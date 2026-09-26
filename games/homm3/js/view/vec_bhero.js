/* ============================================================================
   view/vec_bhero.js — герой на поле боя и читаемость боя.

   • Герой — всадник hero_<класс> из vec_heroes.js (у каждого класса свой скакун
     и снаряжение). Рисуем его по частям сами: дыхание, покачивание, конь
     кивает и изредка перетаптывается; каст — рука с оружием/посохом взлетает,
     на острие горит свет (вспышку и искры кладёт сцена H3.VFx); победа — рука
     вверх, конь привстаёт, знамя поднято; поражение — голова опущена, знамя
     клонится к земле; бегство/сдача — герой разворачивается и уезжает.
   • Знамя в цвете игрока: древко и полотнище нарисованы конвейером (V.def),
     полотнище — 8 кадров волны с плавным переходом между ними.
   • Читаемость боя: подсветка активного отряда и цели, всплывающие цифры и
     плашки численности — в точках экрана, т. е. не мельчают при отдалении.
   Бой (battle.js) передаёт только геометрию и состояние: H3.BHero.*
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const TAU = Math.PI * 2, U = 10;
  const c01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const sm = t => { t = c01(t); return t * t * (3 - 2 * t); };
  const TEAM = '$b:#3060c8', TEAMD = '$B:#1c3a80', GOLD = '#d8a53a';
  /** Плотность, в которой держим части героя и знамени (точек мира на клетку); на экран — масштабом. */
  const S0 = 3;

  /* ============================ знамя ============================
     Имена — «hero_knight.banner0…7», «hero_knight.pole»: деталь настоящего спрайта героя (правило V.def),
     знамя общее для всех классов, красится цветом игрока через '$b'/'$B'. */
  const FW = 180, FH = 112, NF = 8, POLE = 400, FLAG_Y = -POLE + 16;
  /** Кадр полотнища: волна бежит от древка к краю, ласточкин хвост, звезда, складки. */
  function flagDef(name, ph) {
    const amp = 13, N = 12, kx = 5.4;
    const dyT = f => amp * Math.pow(f, 1.1) * Math.sin(ph - f * kx);
    const dyB = f => amp * Math.pow(f, 1.1) * Math.sin(ph - f * kx - 0.4);
    const xs = f => f * FW - amp * 0.35 * f * (1 - Math.cos(ph - f * kx));   // гребни чуть поджимают полотно
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) { const f = i / N; top.push([xs(f), dyT(f)]); bot.push([xs(f), FH + dyB(f)]); }
    const eT = top[N], eB = bot[N];
    const notch = [xs(1) - 32, FH / 2 + (dyT(0.86) + dyB(0.86)) / 2];
    const p = [[0, 0, 1], ...top.slice(1, N), [eT[0], eT[1], 1], [notch[0], notch[1], 1], [eB[0], eB[1], 1], ...bot.slice(1, N).reverse(), [0, FH, 1]];
    // складки: вертикальные полосы света и тени по наклону волны
    const sub = [];
    for (let j = 0; j < 26; j++) {
      const f0 = j / 26, f1 = (j + 1) / 26, fm = (f0 + f1) / 2, s = Math.cos(ph - fm * kx) * Math.min(1, fm * 3.5);
      if (Math.abs(s) < 0.12) continue;
      const col = s > 0 ? 'rgba(255,246,224,' + (s * 0.2).toFixed(3) + ')' : 'rgba(12,6,24,' + (-s * 0.3).toFixed(3) + ')';
      sub.push({ p: [[xs(f0) - 0.5, -40, 1], [xs(f1) + 0.5, -40, 1], [xs(f1) + 0.5, FH + 40, 1], [xs(f0) - 0.5, FH + 40, 1]], c: col, m: 'flat', line: 0 });
    }
    // герб: золотая звезда, наклонённая по волне
    const fs = 0.44, cx = xs(fs), cy = FH / 2 + (dyT(fs) + dyB(fs)) / 2, sl = Math.atan2(dyT(fs + 0.03) - dyT(fs - 0.03), xs(fs + 0.03) - xs(fs - 0.03));
    const star = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5 + sl, r = i % 2 ? 10 : 24; star.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.96, 1]); }
    sub.push({ e: [cx, cy, 30, 29], c: TEAMD, m: 'cloth', line: 0.5, lc: '#8a6a2a' });
    sub.push({ p: star, c: GOLD, m: 'gold', line: 0.6, glint: [[cx - 4, cy - 8, 3]] });
    // золотая кайма вдоль верхнего и нижнего края
    const band = (edge, off) => { const pts = edge.map(q => [q[0], q[1] + off]); return pts; };
    const bT = band(top, 0), bT2 = band(top, 9).reverse(), bB = band(bot, 0), bB2 = band(bot, -9).reverse();
    sub.push({ p: [...bT, ...bT2], c: GOLD, m: 'gold', line: 0 });
    sub.push({ p: [...bB, ...bB2], c: GOLD, m: 'gold', line: 0 });
    const shapes = [
      { p, c: TEAM, m: 'cloth', belly: 0.25, line: 0.8, sub },
      // рукав на древке
      { p: [[-8, -6], [10, -6], [10, FH + 6], [-8, FH + 6]], c: TEAMD, m: 'cloth', line: 0.6, lines: [{ p: [[1, -2], [1, FH + 2]], w: 2, light: true, a: 0.4 }] },
    ];
    V.def(name, { w: 1, h: 1, anchor: [0, 0], parts: [{ kind: 'prop', pivot: [0, 0], shapes }] });
  }
  for (let i = 0; i < NF; i++) flagDef('hero_knight.banner' + i, i / NF * TAU);
  // древко: тёмное дерево, золотое навершие-копьё, шнур с кистью
  V.def('hero_knight.pole', { w: 1, h: 1, anchor: [0, 0], parts: [{ kind: 'prop', pivot: [0, 0], shapes: [
    { p: K.tube([[0, 0, 13], [0, -POLE, 10]], { flat0: true }), c: '#6a4428', m: 'wood', line: 0.7 },
    { p: K.tube([[0, -POLE + 6, 14], [0, -POLE - 6, 14]], { flat0: true, flat1: true }), c: GOLD, m: 'gold', line: 0.6 },
    { e: [0, -POLE - 13, 10, 10], c: GOLD, m: 'gold', line: 0.6, glint: [[-3, -POLE - 17, 3]] },
    { p: [[0, -POLE - 68, 1], [11, -POLE - 36], [5, -POLE - 22, 1], [-5, -POLE - 22, 1], [-11, -POLE - 36]], c: '#e0c060', m: 'gold', line: 0.7, glint: [[-2, -POLE - 44, 3]] },
    { p: K.tube([[6, -POLE + 6, 3], [14, -POLE + 40, 3], [18, -POLE + 84, 3]]), c: GOLD, m: 'gold', line: 0.4 },
    { p: [[13, -POLE + 82], [23, -POLE + 82], [26, -POLE + 112, 1], [10, -POLE + 112, 1]], c: GOLD, m: 'gold', line: 0.5, lines: [{ p: [[15, -POLE + 86], [14, -POLE + 108]], w: 1.2, a: 0.6 }, { p: [[21, -POLE + 86], [22, -POLE + 108]], w: 1.2, a: 0.6 }] },
  ] }] });

  /** Состояние волны по ключу (фаза копится, чтобы смена силы ветра не дёргала кадр). */
  const WAVE = new Map();
  function waveAt(key, t, speed) {
    let w = WAVE.get(key);
    if (!w || t < w.t || t - w.t > 1000) { w = { t, ph: Math.random() * TAU }; WAVE.set(key, w); }
    w.ph += (t - w.t) / 1000 * speed; w.t = t;
    return w.ph;
  }
  function img(ctx, name, x, y, flip, tint, SC, a) {
    const im = V.image(name, S0, flip, tint, SC); if (!im) return;
    const cv = im.cv;
    if (a !== undefined) ctx.globalAlpha = a;
    ctx.drawImage(cv, x - cv._anchor[0] * S0, y - cv._anchor[1] * S0, cv.width * im.k, cv.height * im.k);
  }
  /**
   * Знамя. o: { x, y — основание древка, s — точек мира на клетку, flip, t, key, tint, SC,
   *   raise 0..1 (поднято), lower 0..1 (опущено), vigor — сила ветра, alpha }
   */
  function banner(ctx, o) {
    const f = o.s / S0, fwd = o.flip ? -1 : 1, u = S0 / U, lower = o.lower || 0, raise = o.raise || 0;
    const speed = 5.2 * (o.vigor || 1) * (1 + raise * 0.8) * (1 - lower * 0.7);
    const ph = waveAt(o.key, o.t, speed);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    const A = ctx.globalAlpha;
    ctx.translate(o.x, o.y); ctx.scale(f, f);
    // тень древка на земле — короткий мазок
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 0, 16 * u, 5 * u, 0, 0, TAU); ctx.fill();
    // поднятое знамя: древко выдвинуто и чуть наклонено к полю, полотнище рвётся на ветру;
    // опущенное — приспущено до середины древка и обвисло, древко клонится назад
    ctx.translate(0, -raise * 30 * u);
    const tilt = fwd * 0.14 * raise - fwd * 0.2 * lower + fwd * 0.02 * Math.sin(o.t / 900);
    ctx.rotate(tilt);
    img(ctx, 'hero_knight.pole', 0, 0, o.flip, o.tint, o.SC);
    ctx.translate(fwd * 3 * u, (FLAG_Y + lower * POLE * 0.34) * u);
    const flapA = 0.04 * Math.sin(ph * 0.5) * (1 - lower);
    ctx.rotate(fwd * (lower * 1.3 + flapA));
    if (lower) ctx.scale(1 - lower * 0.3, 1);
    const q = ((ph / TAU) * NF % NF + NF) % NF, i0 = Math.floor(q), fr = q - i0;
    img(ctx, 'hero_knight.banner' + i0, 0, 0, o.flip, o.tint, o.SC, A);
    if (fr > 0.02) img(ctx, 'hero_knight.banner' + ((i0 + 1) % NF), 0, 0, o.flip, o.tint, o.SC, A * fr);
    ctx.restore();
  }

  /* ============================ всадник ============================ */
  /** Геометрия всадника из описания: какие части что, плечо, кисть, остриё оружия, габарит. */
  const GEO = new Map();
  function geo(name) {
    if (GEO.has(name)) return GEO.get(name);
    const d = V._defs && V._defs[name];
    let g = null;
    if (d) {
      const idx = { legs: [], torso: -1, heads: [], prop: -1 };
      d.parts.forEach((p, i) => { if (p.kind === 'leg') idx.legs.push(i); else if (p.kind === 'torso') idx.torso = i; else if (p.kind === 'head') idx.heads.push(i); else if (p.kind === 'prop') idx.prop = i; });
      let tip = null, hand = null, y0 = 1e9, x0 = 1e9, x1 = -1e9;
      for (const p of d.parts) for (const s of p.shapes) { const b = s._bb; if (!b) continue; if (p.kind !== 'prop') y0 = Math.min(y0, b[1]); x0 = Math.min(x0, b[0]); x1 = Math.max(x1, b[2]); }
      if (idx.prop >= 0) {
        const sh = d.parts[idx.prop].shapes, wn = Math.max(1, sh.length - 4);
        for (let i = 0; i < wn; i++) { const s = sh[i]; const pts = s.p || (s.e ? [[s.e[0], s.e[1] - s.e[3]]] : []); for (const q of pts) if (!tip || q[1] < tip[1]) tip = [q[0], q[1]]; }
        const hs = sh[sh.length - 2]; if (hs && hs.e) hand = [hs.e[0], hs.e[1]];
      }
      const aX = d.anchor[0], aY = d.anchor[1];
      // крайние ноги по горизонтали: задние копыта — точка, вокруг которой конь привстаёт
      let back = 0; for (const i of idx.legs) back = Math.min(back, d.parts[i].pivot[0] - aX);
      g = { d, idx, tip: tip || hand, hand, pivot: idx.prop >= 0 ? d.parts[idx.prop].pivot : null, aX, aY,
        h: (aY - y0) / U, back: (aX - x0) / U, front: (x1 - aX) / U, hind: back / U };
    }
    GEO.set(name, g);
    return g;
  }
  /** Точка описания → точки мира в осях героя (до общего масштаба). */
  const loc = (g, X, Y, fwd) => [fwd * (X - g.aX) * S0 / U, (Y - g.aY) * S0 / U];
  const rotAbout = (pt, pv, a) => { if (!a) return pt; const c = Math.cos(a), s = Math.sin(a), dx = pt[0] - pv[0], dy = pt[1] - pv[1]; return [pv[0] + dx * c - dy * s, pv[1] + dx * s + dy * c]; };

  /** Кривые позы: подъём руки при касте (0..1 за время каста). */
  function castLift(c) { return c <= 0 || c >= 1 ? 0 : c < 0.28 ? sm(c / 0.28) : c < 0.72 ? 1 : 1 - sm((c - 0.72) / 0.28); }
  /**
   * Поза в момент t: углы и сдвиги частей. o: { t, ph, flip, cast 0..1, pose: 'win'|'lose'|'flee'|null, pt 0..1 }
   */
  function poseOf(g, o) {
    const fwd = o.flip ? -1 : 1, t = o.t, ph = o.ph || 0, u = S0 / 2.5;
    const br = Math.sin(t / 1150 + ph);
    const lift = castLift(o.cast || 0);
    const win = o.pose === 'win' ? sm((o.pt || 0) * 4) : 0;
    const lose = o.pose === 'lose' || o.pose === 'flee' ? sm((o.pt || 0) * 4) : 0;
    const flee = o.pose === 'flee' ? sm(((o.pt || 0) - 0.18) * 2.2) : 0;
    const arm = Math.max(lift, win);
    // перетоп: раз в несколько секунд ближняя передняя нога приподнимается
    const sp = ((t / 1000 + ph * 2.3) % 6.5 + 6.5) % 6.5, stomp = sp < 0.55 && !lose ? Math.sin(sp / 0.55 * Math.PI) : 0;
    const gal = flee > 0 ? t / 95 : null;
    const P = {
      br, arm, win, lose, flee, stomp, gal,
      torsoDy: -br * 0.3 * u - lift * 0.8 * u + lose * 1.2 * u,
      riderDy: -br * 0.5 * u - lift * 1.0 * u + lose * 1.6 * u,
      riderA: -fwd * 0.12 * lift - fwd * 0.08 * win + fwd * 0.22 * lose,
      horseA: fwd * 0.035 * Math.sin(t / 1500 + ph) - fwd * 0.07 * stomp - fwd * 0.12 * win + fwd * 0.16 * lose * (1 - flee),
      // рука: при касте и победе — вверх (против часовой у смотрящего вправо), при поражении — опущена
      armA: -fwd * (0.8 * arm + 0.1 * win * Math.sin(t / 140)) + fwd * 0.4 * lose * (1 - arm) + fwd * 0.02 * br,
      armDy: -arm * 2.2 * u,
      rear: win * (0.085 + 0.015 * Math.sin(t / 260)),
    };
    return P;
  }
  /**
   * Всадник героя. o: { name, x, y (земля), s (точек мира на клетку), flip, t, ph, tint, SC, day,
   *   cast 0..1, castCol, pose, pt, alpha } → точка острия оружия в мире (или null, если рисунка нет).
   */
  function rider(ctx, o) {
    const g = geo(o.name); if (!g) return null;
    const P = V.parts(o.name, S0, o.flip, o.tint, o.SC); if (!P) return null;
    const f = o.s / S0, fwd = o.flip ? -1 : 1, k = P.k, u = S0 / 2.5;
    const ax = P.anchor[0] * S0, ay = P.anchor[1] * S0;
    const Q = poseOf(g, o);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha *= o.alpha === undefined ? 1 : o.alpha;
    ctx.translate(o.x, o.y); ctx.scale(f, f);
    // пятно под копытами и падающая тень силуэтом
    ctx.fillStyle = 'rgba(0,0,0,0.24)'; ctx.beginPath(); ctx.ellipse(fwd * 1.5 * S0, -1, (g.back + g.front) * 0.48 * S0, 2.6 * S0, 0, 0, TAU); ctx.fill();
    if (H3.Terrain && H3.Terrain.castShadow && !Q.rear) H3.Terrain.castShadow(ctx, o.name, 0, -1, S0, o.flip, o.day || 4, 0.7, 0.5);
    // привстаёт на задние ноги (победа): поворот вокруг задних копыт
    const hp = [fwd * g.hind * S0, 0];
    if (Q.rear) { ctx.translate(hp[0], hp[1]); ctx.rotate(-fwd * Q.rear); ctx.translate(-hp[0], -hp[1]); }
    let heads = 0;
    for (let i = 0; i < P.parts.length; i++) {
      const p = P.parts[i];
      let dx = 0, dy = 0, ang = 0;
      if (p.kind === 'leg') {
        const front = (p.pivot[0] * k - ax) * fwd > 0;
        if (Q.gal !== null) {
          const lag = p.side > 0 ? 0.45 : 0;
          if (front) { const a = Q.gal + lag; ang = -fwd * 0.5 * Math.sin(a) * Q.flee; dy = -Math.max(0, Math.cos(a)) * 1.3 * u * Q.flee; }
          else { const a = Q.gal + 0.55 + lag; ang = fwd * 0.42 * Math.sin(a) * Q.flee; dy = -Math.max(0, -Math.cos(a)) * 1.1 * u * Q.flee; }
        } else if (front && i === g.idx.legs[g.idx.legs.length - 1] && Q.stomp) { ang = -fwd * 0.5 * Q.stomp; dy = -Q.stomp * 1.2 * u; }
        // привстав, передние ноги поджаты
        if (front && Q.win) ang += -fwd * 0.45 * Q.win;
      } else if (p.kind === 'torso') { dy = Q.torsoDy; }
      else if (p.kind === 'head') {
        if (heads++ === 0) { ang = Q.horseA; dy = Q.torsoDy * 0.6; }
        else { ang = Q.riderA; dy = Q.riderDy; }
      } else { ang = Q.armA; dy = Q.torsoDy + Q.armDy; }
      const px = -ax + p.pivot[0] * k, py = -ay + p.pivot[1] * k;
      ctx.save();
      if (ang) { ctx.translate(px, py + dy); ctx.rotate(ang); ctx.translate(-px, -py - dy); }
      ctx.drawImage(p.cv, -ax + p.x * k + dx, -ay + p.y * k + dy, p.cv.width * k, p.cv.height * k);
      ctx.restore();
    }
    // остриё оружия: та же цепочка преобразований, что у руки
    let tip = null;
    if (g.tip && g.pivot) {
      const pv = loc(g, g.pivot[0], g.pivot[1], fwd); pv[1] += Q.torsoDy + Q.armDy;
      let tp = loc(g, g.tip[0], g.tip[1], fwd); tp[1] += Q.torsoDy + Q.armDy;
      tp = rotAbout(tp, pv, Q.armA);
      if (Q.rear) tp = rotAbout(tp, hp, -fwd * Q.rear);
      // свет на острие, пока рука поднята для заклинания
      const lift = castLift(o.cast || 0);
      if (lift > 0.05 && o.castCol) {
        ctx.globalCompositeOperation = 'lighter';
        const r = (6 + 3 * Math.sin(o.t / 45)) * u * (0.6 + 0.4 * lift);
        const gr = ctx.createRadialGradient(tp[0], tp[1], 0, tp[0], tp[1], r * 2.2);
        gr.addColorStop(0, 'rgba(255,255,255,' + (0.95 * lift).toFixed(3) + ')'); gr.addColorStop(0.25, rgba(o.castCol, 0.8 * lift)); gr.addColorStop(1, rgba(o.castCol, 0));
        ctx.globalAlpha = 1; ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(tp[0], tp[1], r * 2.2, 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      tip = [o.x + tp[0] * f, o.y + tp[1] * f];
    }
    ctx.restore();
    return tip || [o.x, o.y - g.h * o.s];
  }
  /** Габарит героя в клетках: { h, back, front } — чтобы бой нашёл ему место. */
  function size(name) { const g = geo(name); return g ? { h: g.h, back: g.back, front: g.front } : null; }

  /** Вспышка каста из острия: белое ядро, волна, искры и угольки цвета школы (сцена H3.VFx). */
  function castFx(sc, x, y, col) {
    if (!sc) return;
    const w = sc.ws(), zk = (sc.S && sc.S.zk) || 1;
    sc.glow(x, y, { col, hard: true, r: 5 * w * zk, r1: 18 * w * zk, ttl: 420 });
    sc.ring(x, y, { col, r0: 3 * w * zk, r1: 24 * w * zk, sq: 1, under: false, ttl: 360, a: 0.8 });
    sc.sparks(x, y, { n: 9, col: ['#ffffff', col], speed: 150, ttl: 360, grav: 60, len: 5 * zk, w: 1.3 * zk });
    sc.embers(x, y, { n: 6, col, ttl: 700, spread: 6, vy: -30, r: 2 * zk });
  }

  /* ============================ читаемость ============================ */
  function rgbOf(c) {
    if (c[0] === '#') { let h = c.slice(1); if (h.length === 3) h = h.replace(/./g, x => x + x); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    const m = c.match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2]] : [128, 128, 128];
  }
  function rgba(c, a) { const [r, g, b] = rgbOf(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + c01(a).toFixed(3) + ')'; }
  function shade(c, k) { const q = rgbOf(c); return '#' + q.map(v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)).toString(16).padStart(2, '0')).join(''); }

  /** Пятно-подложка под отрядом: мягкое свечение + ровное кольцо. kz — поправка толщины на отдаление. */
  function groundMark(ctx, x, y, rx, ry, col, kz, a) {
    a = a === undefined ? 1 : a;
    ctx.save();
    ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, rx * 0.15, 0, 0, rx * 1.35);
    g.addColorStop(0, rgba(col, 0.5 * a)); g.addColorStop(0.55, rgba(col, 0.3 * a)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx * 1.35, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.lineWidth = 4 * kz; ctx.strokeStyle = 'rgba(20,12,4,' + (0.35 * a).toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.stroke();
    ctx.lineWidth = 2 * kz; ctx.strokeStyle = rgba(shade(col, 0.35), 0.95 * a);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.stroke();
  }
  /** Активный отряд: тёплое золото, без мигания. */
  function activeMark(ctx, x, y, rx, ry, kz) { groundMark(ctx, x, y, rx, ry, '#ffc848', kz, 1); }
  /** Цель: цвет по смыслу (удар — красный, чары — цвет школы, помощь — зелёный) + уголки-засечки. */
  function targetMark(ctx, x, y, rx, ry, col, kz, t) {
    groundMark(ctx, x, y, rx * 1.05, ry * 1.05, col, kz, 0.95);
    // четыре засечки по кругу медленно вращаются — видно, что это цель, а не ход
    const rot = (t || 0) / 2600;
    ctx.lineWidth = 2.6 * kz; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(shade(col, 0.45), 0.95);
    for (let i = 0; i < 4; i++) { const a0 = rot + i * TAU / 4; ctx.beginPath(); ctx.ellipse(x, y, rx * 1.28, ry * 1.28, 0, a0 - 0.28, a0 + 0.28); ctx.stroke(); }
    ctx.lineCap = 'butt';
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }
  /**
   * Плашка численности в цвете стороны. (x, y) — угол у ног отряда; right: плашка растёт вправо.
   * k — масштаб плашки (1 — 12 точек мира); возвращает её ширину.
   */
  function badge(ctx, x, y, text, col, right, k, act) {
    const fs = 11.5 * k;
    ctx.font = 'bold ' + fs.toFixed(1) + 'px sans-serif';
    const tw = ctx.measureText(text).width, w = tw + 7 * k, h = fs + 3.5 * k;
    const bx = right ? x : x - w, by = y - h;
    const g = ctx.createLinearGradient(0, by, 0, by + h); g.addColorStop(0, shade(col, 0.28)); g.addColorStop(0.5, col); g.addColorStop(1, shade(col, -0.35));
    roundRect(ctx, bx, by, w, h, 2.5 * k); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 1.2 * k; ctx.strokeStyle = act ? '#ffe08a' : 'rgba(0,0,0,0.85)'; ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 2.4 * k; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.strokeText(text, bx + w / 2, by + h / 2 + 0.5 * k);
    ctx.fillStyle = '#fff'; ctx.fillText(text, bx + w / 2, by + h / 2 + 0.5 * k);
    ctx.textBaseline = 'alphabetic';
    return w;
  }
  /**
   * Всплывающая надпись в точках экрана: iz = 1 / масштаб камеры (размер не зависит от зума).
   * f: { text, color, big, kill, x, y (мир, над отрядом), dy (точки экрана), t, ms }
   */
  function floatText(ctx, f, iz) {
    const k = f.t / f.ms;
    const px = f.big ? 25 : f.kill ? 20 : 15;
    // вылет с подскоком, потом тает; крупные цифры сначала чуть больше
    const pop = f.big || f.kill ? 1 + Math.max(0, 0.3 - k) * 1.3 : 1;
    const rise = f.big || f.kill ? Math.sin(Math.min(1, k * 1.7) * Math.PI / 2) * 30 : k * 26;
    const fs = px * pop * iz, x = f.x, y = f.y + (f.dy || 0) * iz - rise * iz;
    ctx.save();
    ctx.globalAlpha = 1 - Math.pow(Math.max(0, k - 0.35) / 0.65, 2);
    ctx.font = 'bold ' + fs.toFixed(1) + 'px Philosopher, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    // тень, толстая тёмная обводка, затем цвет со светлым верхом
    ctx.lineWidth = 6 * iz; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.strokeText(f.text, x + 1.2 * iz, y + 1.8 * iz);
    ctx.lineWidth = 4.6 * iz; ctx.strokeStyle = 'rgba(24,10,4,0.95)'; ctx.strokeText(f.text, x, y);
    const g = ctx.createLinearGradient(0, y - fs * 0.8, 0, y); g.addColorStop(0, shade(f.color, 0.45)); g.addColorStop(1, f.color);
    ctx.fillStyle = g; ctx.fillText(f.text, x, y);
    ctx.restore();
  }

  H3.BHero = { S0, banner, rider, size, geo, castFx, activeMark, targetMark, groundMark, badge, floatText, rgba, shade, castLift, POLE: POLE / U };
})(typeof window !== 'undefined' ? window : globalThis);
