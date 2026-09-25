/* ============================================================================
   view/vector.js — рисованные существа: слои кривых вместо пиксельной сетки.

   Существо описано в «дизайн-единицах» (10 на клетку пиксельного спрайта),
   поэтому встаёт в тот же гекс и с тем же якорем, что и старый спрайт.
   Каждая форма — сглаженный контур через опорные точки; при отрисовке она
   получает объём градиентом по свету, внутреннюю тень, контровой свет,
   фактуру материала (мех, перо, кольчуга, дерево), блик и тонкий контур
   цвета тени. Сверху кладётся свет сцены: время суток и отсвет земли.

   Существо собрано из частей (ноги, корпус, голова, реквизит) — это готовая
   разбивка для анимации, резать картинку не нужно.

   Описание:
     Vec.def('name', { w, h, anchor:[x,y], parts:[
       { kind:'leg'|'legs'|'torso'|'head'|'prop', side:-1|1, pivot:[x,y], shapes:[…] } ] })
   Форма:
     { p:[[x,y],[x,y,1],…] | e:[cx,cy,rx,ry] | d:'M…', c:'#цвет', m:'материал',
       flow:угол фактуры, sub:[формы внутри], lines:[{p,w,a,light}], glint:[[x,y,r]] }
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const DEFS = Object.create(null);
  // пилот: включается в настройках или ссылкой ?vec=1 (см. main.js)
  const VEC = { on: false };
  const U = 10;   // дизайн-единиц на клетку пиксельного спрайта

  /* ---------- цвет ---------- */
  function rgbOf(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function toHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  }
  function fromHsl(h, s, l) {
    if (!s) return [l * 255, l * 255, l * 255];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  }
  function towardHue(h, target, k) { let d = target - h; if (d > 0.5) d -= 1; if (d < -0.5) d += 1; return (h + d * k + 1) % 1; }
  const toneCache = new Map();
  /** Оттенок цвета: t > 0 — к тёплому свету, t < 0 — в холодную тень (оттенок уходит к синему, как у художников). */
  function tone(c, t, a) {
    const key = c + '|' + t + '|' + a; let v = toneCache.get(key); if (v) return v;
    const [r, g, b] = rgbOf(c); let [h, s, l] = toHsl(r, g, b);
    if (t >= 0) { h = towardHue(h, 0.13, t * 0.22 * s); s = s * (1 - t * 0.12); l = l + (1 - l) * t * 0.85; }
    else {
      // тень холоднее; у жёлто-оранжевых кратчайший путь к синему идёт через красный — там сдвиг слабый, иначе золото рыжеет
      const k = -t, warm = h > 0.04 && h < 0.22;
      h = towardHue(h, 0.66, k * 0.28 * s * (warm ? 0.3 : 1)); s = Math.min(1, s * (1 + k * 0.25)); l = l * (1 - k * 0.78);
    }
    const [R, G, B] = fromHsl(h, s, l);
    // без прозрачности — '#rrggbb': такой цвет можно снова передать в tone() (улучшения строят краски от базовых)
    const hx = v2 => Math.max(0, Math.min(255, Math.round(v2))).toString(16).padStart(2, '0');
    v = a === undefined ? '#' + hx(R) + hx(G) + hx(B) : 'rgba(' + (R | 0) + ',' + (G | 0) + ',' + (B | 0) + ',' + a + ')';
    toneCache.set(key, v); return v;
  }

  /* ---------- контуры ---------- */
  const f1 = v => Math.round(v * 10) / 10;
  /** Сглаженный контур через точки (Catmull-Rom → кубические Безье). Точка [x, y, 1] — острый угол. */
  function smooth(pts, closed, ten) {
    closed = closed !== false; ten = ten === undefined ? 1 : ten;
    const n = pts.length, P = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const s1 = p1[2] ? 0 : ten / 6, s2 = p2[2] ? 0 : ten / 6;
      d += 'C' + f1(p1[0] + (p2[0] - p0[0]) * s1) + ' ' + f1(p1[1] + (p2[1] - p0[1]) * s1) + ' ' + f1(p2[0] - (p3[0] - p1[0]) * s2) + ' ' + f1(p2[1] - (p3[1] - p1[1]) * s2) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
    }
    return closed ? d + 'Z' : d;
  }
  function ellipse(cx, cy, rx, ry) {
    const k = 0.5523, ox = rx * k, oy = ry * k;
    return 'M' + f1(cx - rx) + ' ' + f1(cy) + 'C' + f1(cx - rx) + ' ' + f1(cy - oy) + ' ' + f1(cx - ox) + ' ' + f1(cy - ry) + ' ' + f1(cx) + ' ' + f1(cy - ry)
      + 'C' + f1(cx + ox) + ' ' + f1(cy - ry) + ' ' + f1(cx + rx) + ' ' + f1(cy - oy) + ' ' + f1(cx + rx) + ' ' + f1(cy)
      + 'C' + f1(cx + rx) + ' ' + f1(cy + oy) + ' ' + f1(cx + ox) + ' ' + f1(cy + ry) + ' ' + f1(cx) + ' ' + f1(cy + ry)
      + 'C' + f1(cx - ox) + ' ' + f1(cy + ry) + ' ' + f1(cx - rx) + ' ' + f1(cy + oy) + ' ' + f1(cx - rx) + ' ' + f1(cy) + 'Z';
  }
  /** Рамка пути по точкам на самой кривой (опорные точки Безье выносят рамку далеко за форму). */
  function bboxOf(d) {
    const tok = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, cx = 0, cy = 0, i = 0;
    const add = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
    let cmd = 'M';
    while (i < tok.length) {
      if (/[MLCZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') continue; }
      if (cmd === 'C') {
        const a = +tok[i], b = +tok[i + 1], c = +tok[i + 2], e = +tok[i + 3], x = +tok[i + 4], y = +tok[i + 5]; i += 6;
        for (let k = 1; k <= 8; k++) { const t = k / 8, u = 1 - t; add(u * u * u * cx + 3 * u * u * t * a + 3 * u * t * t * c + t * t * t * x, u * u * u * cy + 3 * u * u * t * b + 3 * u * t * t * e + t * t * t * y); }
        cx = x; cy = y;
      } else { cx = +tok[i]; cy = +tok[i + 1]; i += 2; add(cx, cy); }
    }
    return [x0, y0, x1, y1];
  }
  /** Подготовка формы: строка пути, рамка, материал. Делается один раз при описании. */
  function compile(s) {
    if (s._d) return s;
    s._d = s.d || (s.e ? ellipse(s.e[0], s.e[1], s.e[2], s.e[3]) : smooth(s.p, s.open ? false : true, s.ten));
    s._bb = bboxOf(s._d);
    if (s.sub) s.sub.forEach(compile);
    if (s.lines) for (const l of s.lines) if (!l._d) l._d = l.d || smooth(l.p, l.closed === true, l.ten);
    return s;
  }

  /* ---------- материалы ---------- */
  const MAT = {
    steel:   { hi: 0.55, lo: 0.95, gloss: 0.75, ao: 0.9, rim: 0.7, line: 1 },
    gold:    { hi: 0.5, lo: 0.85, gloss: 0.7, ao: 0.8, rim: 0.6, line: 1 },
    cloth:   { hi: 0.3, lo: 0.8, gloss: 0, ao: 0.95, rim: 0.25, line: 1 },
    leather: { hi: 0.3, lo: 0.8, gloss: 0.15, ao: 0.9, rim: 0.3, line: 1 },
    skin:    { hi: 0.35, lo: 0.7, gloss: 0.12, ao: 0.8, rim: 0.35, line: 1 },
    fur:     { hi: 0.35, lo: 0.85, gloss: 0, ao: 1, rim: 0.45, line: 1, tex: 'fur' },
    feather: { hi: 0.35, lo: 0.8, gloss: 0, ao: 0.9, rim: 0.45, line: 1, tex: 'feather' },
    mail:    { hi: 0.4, lo: 0.9, gloss: 0.35, ao: 0.9, rim: 0.5, line: 1, tex: 'mail' },
    wood:    { hi: 0.3, lo: 0.8, gloss: 0.1, ao: 0.85, rim: 0.3, line: 1, tex: 'wood' },
    horn:    { hi: 0.45, lo: 0.8, gloss: 0.5, ao: 0.8, rim: 0.4, line: 1 },
    gem:     { hi: 0.6, lo: 0.9, gloss: 0.9, ao: 0.6, rim: 0.3, line: 0.8 },
    flat:    { hi: 0, lo: 0, gloss: 0, ao: 0, rim: 0, line: 0 },
  };

  /* ---------- случайность с зерном: фактура одинакова от кадра к кадру ---------- */
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* ---------- фактура ---------- */
  function texture(ctx, s, mat, env, rnd) {
    const kind = s.tex || mat.tex; if (!kind || s.tex === false) return;
    const [x0, y0, x1, y1] = s._bb, w = x1 - x0, h = y1 - y0, c = s.c, dens = s.dens || 1;
    const flow = s.flow !== undefined ? s.flow : Math.PI * 0.62;
    ctx.lineCap = 'round';
    if (kind === 'fur') {
      const n = Math.round(w * h / 38 * dens);
      const lite = tone(c, 0.42, 0.38), dark = tone(c, -0.55, 0.42);
      for (let i = 0; i < n; i++) {
        const x = x0 + rnd() * w, y = y0 + rnd() * h, L = (5 + rnd() * 8) * (s.furLen || 1), a = flow + (rnd() - 0.5) * 0.5;
        const ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L, bend = (rnd() - 0.5) * 3;
        ctx.strokeStyle = rnd() < 0.5 ? lite : dark; ctx.lineWidth = 0.9 + rnd() * 0.9;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + ex) / 2 - Math.sin(a) * bend, (y + ey) / 2 + Math.cos(a) * bend, ex, ey); ctx.stroke();
      }
    } else if (kind === 'feather' || kind === 'scale') {
      const st = (kind === 'scale' ? 6 : 10) * (s.texSize || 1), R = Math.hypot(w, h) / 2 + st, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(flow - Math.PI / 2);
      const k = kind === 'scale' ? 1 : 0.38, dark = tone(c, -0.5, 0.5 * k), lite = tone(c, 0.5, 0.42 * k);
      let row = 0;
      // перья лежат неровно: лёгкий разброс места и размера, чтобы не было «рыбьей чешуи»
      for (let y = -R; y < R; y += st * 0.62, row++) for (let x = -R + (row % 2) * st / 2; x < R; x += st) {
        const jx = x + (rnd() - 0.5) * st * 0.3, jy = y + (rnd() - 0.5) * st * 0.2, r = st / 2 * (0.85 + rnd() * 0.3);
        ctx.strokeStyle = dark; ctx.lineWidth = kind === 'scale' ? 1.1 : 0.9;
        ctx.beginPath(); ctx.arc(jx, jy, r, 0.25, Math.PI - 0.25); ctx.stroke();
        ctx.strokeStyle = lite; ctx.lineWidth = 0.8;
        if (r > 2.2) { ctx.beginPath(); ctx.arc(jx, jy - 1.2, r - 1.5, 0.6, Math.PI - 0.6); ctx.stroke(); }
      }
      ctx.restore();
    } else if (kind === 'mail') {
      const st = 4.2, dark = tone(c, -0.6, 0.55), lite = tone(c, 0.6, 0.5);
      let row = 0;
      for (let y = y0; y < y1 + st; y += st * 0.8, row++) for (let x = x0 + (row % 2) * st / 2; x < x1 + st; x += st) {
        ctx.strokeStyle = dark; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(x, y, st * 0.42, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = lite; ctx.fillRect(x - st * 0.3, y - st * 0.35, 0.9, 0.9);
      }
    } else if (kind === 'wood') {
      const dark = tone(c, -0.45, 0.45), lite = tone(c, 0.35, 0.3), n = Math.round(Math.max(w, h) / 3);
      for (let i = 0; i < n; i++) {
        const t = rnd(), x = x0 + t * w, y = y0 + t * h;
        ctx.strokeStyle = rnd() < 0.6 ? dark : lite; ctx.lineWidth = 0.7 + rnd() * 0.6;
        ctx.beginPath(); const L = Math.max(w, h);
        ctx.moveTo(x - Math.cos(flow) * L, y - Math.sin(flow) * L); ctx.lineTo(x + Math.cos(flow) * L, y + Math.sin(flow) * L); ctx.stroke();
      }
    }
  }

  /* ---------- внутренняя тень и контровой свет ---------- */
  function innerShadow(ctx, s, color, blur, ox, oy, env) {
    const [x0, y0, x1, y1] = s._bb, m = blur * 3 + Math.abs(ox) + Math.abs(oy) + 4;
    const inv = s._inv || (s._inv = new Path2D('M' + (x0 - m) + ' ' + (y0 - m) + 'H' + (x1 + m) + 'V' + (y1 + m) + 'H' + (x0 - m) + 'Z' + s._d));
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = blur * env.px; ctx.shadowOffsetX = ox * env.px * env.sx; ctx.shadowOffsetY = oy * env.px;
    ctx.fillStyle = '#000'; ctx.fill(inv, 'evenodd');
    ctx.restore();
  }

  /* ---------- одна форма ---------- */
  /** Цвет формы: '#rrggbb' или '$b:#запасной' — цвет из подмены (цвет игрока, краска фракции). */
  function colorOf(c, env) {
    if (!c || c[0] !== '$') return c || '#888888';
    const i = c.indexOf(':'), key = c.slice(1, i < 0 ? undefined : i), def = i < 0 ? '#888888' : c.slice(i + 1);
    let v = env.tint && env.tint[key];
    if (v && v[0] !== '#') { const P = H3.Sprites && H3.Sprites.PAL; v = P && P[v]; }
    return v || def;
  }
  function paintShape(ctx, s, env, rnd, depth) {
    const mat = MAT[s.m] || MAT.cloth, c = colorOf(s.c, env);
    const path = s._p || (s._p = new Path2D(s._d));
    const [x0, y0, x1, y1] = s._bb, w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const lx = env.lx, ly = env.ly, R = Math.hypot(w, h) * 0.5;
    // объём: светлая сторона к свету, тень уходит в холодное
    if (mat.hi || mat.lo) {
      const g = ctx.createLinearGradient(cx + lx * R, cy + ly * R, cx - lx * R, cy - ly * R);
      g.addColorStop(0, tone(c, mat.hi * (s.hi || 1) * 0.55)); g.addColorStop(0.45, c); g.addColorStop(1, tone(c, -mat.lo * (s.lo || 1) * 0.55));
      ctx.fillStyle = g;
    } else ctx.fillStyle = c;
    ctx.fill(path);
    ctx.save(); ctx.clip(path);
    texture(ctx, s, mat, env, rnd);
    if (s.belly) {   // низ формы уходит в тень мягко, без жёсткой границы
      const g = ctx.createLinearGradient(0, y0 + h * 0.45, 0, y1);
      g.addColorStop(0, tone(c, -0.8, 0)); g.addColorStop(1, tone(c, -0.8, s.belly));
      ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
    }
    if (s.sub) for (const q of s.sub) paintShape(ctx, q, env, rnd, (depth || 0) + 1);
    const big = Math.min(w, h), sl = env.sl;
    if (mat.ao) {
      // широкая мягкая тень от края к середине и узкая плотная — форма «поворачивается» от света
      innerShadow(ctx, s, tone(c, -0.85, 0.55 * mat.ao * (s.ao === undefined ? 1 : s.ao)), Math.max(3, big * 0.28), sl[0] * big * 0.22, sl[1] * big * 0.22, env);
      innerShadow(ctx, s, tone(c, -0.9, 0.35 * mat.ao * (s.ao === undefined ? 1 : s.ao)), 1.6, sl[0] * 2.4, sl[1] * 2.4, env);
    }
    if (mat.rim && s.rim !== 0) innerShadow(ctx, s, tone(c, 0.75, 0.6 * mat.rim * (s.rim || 1)), 1.8, -sl[0] * 2.2, -sl[1] * 2.2, env);
    if (mat.gloss && s.gloss !== 0) {
      const gx = cx + lx * w * 0.22, gy = cy + ly * h * 0.26, gr = Math.max(4, big * 0.42);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      const a = mat.gloss * (s.gloss || 1);
      g.addColorStop(0, 'rgba(255,252,240,' + (0.55 * a).toFixed(3) + ')'); g.addColorStop(0.35, 'rgba(255,250,235,' + (0.18 * a).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,250,235,0)');
      ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
    }
    if (s.lines) for (const l of s.lines) {
      const lp = l._p || (l._p = new Path2D(l._d));
      ctx.strokeStyle = l.c ? colorOf(l.c, env) : (l.light ? tone(c, 0.7, l.a || 0.8) : tone(c, -0.72, l.a || 0.8));
      ctx.lineWidth = l.w || 1.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(lp);
    }
    if (s.glint) for (const [gx, gy, gr] of s.glint) {
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, 'rgba(255,255,250,0.95)'); g.addColorStop(0.4, 'rgba(255,255,245,0.45)'); g.addColorStop(1, 'rgba(255,255,245,0)');
      ctx.fillStyle = g; ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
    }
    ctx.restore();
    const lw = (s.line === undefined ? mat.line : s.line) * (depth ? 0.75 : 1);
    if (lw) {
      // контур толще со стороны тени: второй проход чуть сдвинут от света
      ctx.strokeStyle = s.lc ? colorOf(s.lc, env) : tone(c, -0.82); ctx.lineWidth = 2 * lw; ctx.lineJoin = 'round'; ctx.stroke(path);
      if (!s._out) s._out = new Path2D('M' + (x0 - 20) + ' ' + (y0 - 20) + 'H' + (x1 + 20) + 'V' + (y1 + 20) + 'H' + (x0 - 20) + 'Z' + s._d);
      ctx.save(); ctx.clip(s._out, 'evenodd'); ctx.translate(-lx * 0.9 * lw, -ly * 0.9 * lw); ctx.lineWidth = 1.8 * lw; ctx.stroke(path); ctx.restore();
    }
  }

  /* ---------- свет сцены: тёплый сверху-слева, холодный снизу-справа, отсвет земли снизу ---------- */
  function sceneLight(ctx, W, H, SC, X0, Y0) {
    if (!SC || !SC.id) return;
    // градиенты считаются по всему существу, даже когда холст — обрезанная часть
    ctx.save(); ctx.setTransform(1, 0, 0, 1, -(X0 || 0), -(Y0 || 0)); ctx.globalCompositeOperation = 'source-atop';
    const rgba = (r, g, b, a) => 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + a.toFixed(3) + ')';
    if (SC.wk) { const g = ctx.createLinearGradient(0, 0, W * 0.75, H * 0.75); g.addColorStop(0, rgba(SC.wr, SC.wg, SC.wb, SC.wk * 0.5)); g.addColorStop(1, rgba(SC.wr, SC.wg, SC.wb, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    if (SC.ck) { const g = ctx.createLinearGradient(W, H, W * 0.3, H * 0.3); g.addColorStop(0, rgba(SC.cr, SC.cg, SC.cb, SC.ck * 0.55)); g.addColorStop(1, rgba(SC.cr, SC.cg, SC.cb, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    if (SC.bk) { const g = ctx.createLinearGradient(0, H, 0, H * (1 - SC.bh)); g.addColorStop(0, rgba(SC.br, SC.bg, SC.bb, SC.bk * 0.6)); g.addColorStop(1, rgba(SC.br, SC.bg, SC.bb, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }

  /* ---------- рендер ---------- */
  /** Улучшение из базового: те же формы с заменой красок (recolor), без форм с id из drop,
      с добавленными формами (add: [{ part: индекс, shapes, back: true — под остальными }]). */
  function variant(d) {
    const b = DEFS[d.base]; if (!b) throw new Error('Vec: нет базового ' + d.base);
    const map = {}; for (const k in d.recolor || {}) map[k.toLowerCase()] = d.recolor[k];
    const rc = c => (c && map[c.toLowerCase()]) || c;
    const cp = s => { const o = Object.assign({}, s); o.c = rc(s.c); if (s.lc) o.lc = rc(s.lc);
      if (s.sub) o.sub = s.sub.map(cp); if (s.lines) o.lines = s.lines.map(l => l.c ? Object.assign({}, l, { c: rc(l.c) }) : l); return o; };
    const drop = d.drop || [];
    const parts = b.parts.map(p => Object.assign({}, p, { shapes: p.shapes.filter(s => !drop.includes(s.id)).map(cp) }));
    for (const a of d.add || []) { const p = parts[a.part]; p.shapes = a.back ? a.shapes.concat(p.shapes) : p.shapes.concat(a.shapes); }
    return { w: b.w, h: b.h, anchor: b.anchor, parts };
  }
  function def(name, d) {
    if (d.base) d = variant(d);
    for (const p of d.parts) p.shapes.forEach(compile);
    // холст растёт под рисунок: крыло или плюмаж могут выходить за рамку старого спрайта
    let x0 = 0, y0 = 0, x1 = d.w, y1 = d.h;
    for (const p of d.parts) for (const s of p.shapes) { const b = s._bb; x0 = Math.min(x0, b[0] - 4); y0 = Math.min(y0, b[1] - 4); x1 = Math.max(x1, b[2] + 4); y1 = Math.max(y1, b[3] + 4); }
    d.ox = Math.ceil(-x0); d.oy = Math.ceil(-y0); d.W = Math.ceil(x1 + d.ox); d.H = Math.ceil(y1 + d.oy);
    d.seed = hashStr(name);
    DEFS[name] = d;
    return d;
  }
  function has(name) { return VEC.on && !!DEFS[name]; }
  /** Холст одной части (или всего существа) при S пикселях на клетку. */
  /** Рамка части в пикселях полного холста: часть хранится обрезанной — память телефона не резиновая. */
  function partRect(d, part, px, W, flip) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of part.shapes) { const b = s._bb; x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); }
    x0 -= 4; y0 -= 4; x1 += 4; y1 += 4;
    const sx0 = flip ? W - (x1 + d.ox) * px : (x0 + d.ox) * px, sx1 = flip ? W - (x0 + d.ox) * px : (x1 + d.ox) * px;
    const X0 = Math.max(0, Math.floor(sx0)), Y0 = Math.max(0, Math.floor((y0 + d.oy) * px));
    return [X0, Y0, Math.max(1, Math.ceil(sx1) - X0), Math.max(1, Math.ceil((y1 + d.oy) * px) - Y0)];
  }
  function paintPart(d, part, S, flip, SC, idx, tint) {
    const px = S / U, W = Math.max(1, Math.round(d.W * px)), H = Math.max(1, Math.round(d.H * px));
    const [X0, Y0, cw, ch] = partRect(d, part, px, W, flip);
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; cv._x = X0; cv._y = Y0;
    const ctx = cv.getContext('2d');
    if (flip) ctx.setTransform(-px, 0, 0, px, W - d.ox * px - X0, d.oy * px - Y0); else ctx.setTransform(px, 0, 0, px, d.ox * px - X0, d.oy * px - Y0);
    const L = Math.hypot(SC && SC.lx || -0.6, SC && SC.ly || -0.8), slx = (SC && SC.lx !== undefined ? SC.lx : -0.6) / L, sly = (SC && SC.ly !== undefined ? SC.ly : -0.8) / L;
    // свет в координатах рисунка: при зеркале он тоже зеркалится, чтобы на экране всегда падал сверху-слева
    const env = { px, sx: 1, lx: flip ? -slx : slx, ly: sly, sl: [flip ? -slx : slx, sly], tint };
    // смещение тени задаётся в пикселях холста — зеркалу оно не подчиняется, поэтому переворачиваем знак сами
    env.sx = flip ? -1 : 1;
    const rnd = rngOf(d.seed + idx * 7919);
    for (const s of part.shapes) paintShape(ctx, s, env, rnd, 0);
    sceneLight(ctx, W, H, SC, X0, Y0);
    return cv;
  }
  const cache = new Map();
  function sceneId(SC) { return SC && SC.id || ''; }
  /** Все части при S пикселях на клетку; кэш по имени, плотности, зеркалу и свету сцены. */
  function build(name, S, flip, SC, tint) {
    const key = name + '|' + S + '|' + (flip ? 1 : 0) + '|' + sceneId(SC) + (tint ? '|' + JSON.stringify(tint) : '');
    let r = cache.get(key); if (r) return r;
    const d = DEFS[name]; if (!d) return null;
    const px = S / U;
    const parts = d.parts.map((p, i) => ({
      kind: p.kind, side: (p.side || 0) * (flip ? -1 : 1),
      pivot: [(flip ? d.W - d.ox - p.pivot[0] : p.pivot[0] + d.ox) * px, (p.pivot[1] + d.oy) * px],
      cv: paintPart(d, p, S, flip, SC, i, tint),
    }));
    for (const p of parts) { p.x = p.cv._x; p.y = p.cv._y; }
    const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(d.W * px)); cv.height = Math.max(1, Math.round(d.H * px));
    const c = cv.getContext('2d'); for (const p of parts) c.drawImage(p.cv, p.x, p.y);
    const ax = (flip ? d.W - d.ox - d.anchor[0] : d.anchor[0] + d.ox) / U, ay = (d.anchor[1] + d.oy) / U;
    cv._w = d.W / U; cv._h = d.H / U; cv._anchor = [ax, ay]; cv._vec = true;
    r = { parts, cv, anchor: [ax, ay], vec: true, ordered: true };
    cache.set(key, r);
    if (cache.size > 400) cache.delete(cache.keys().next().value);
    return r;
  }
  /** Запас плотности: рисуем с избытком под экран телефона и приближение камеры. */
  function quality() { const dpr = root.devicePixelRatio || 1; return Math.min(5, Math.max(2, Math.round(dpr * 1.5 * 2) / 2)); }
  /** Картинка ровно в масштабе scale (для теней, иконок, снимков). */
  function render(name, scale, flip, tint, SC) { const r = build(name, scale || 1, flip, SC, tint); return r && r.cv; }
  /** Картинка с запасом плотности: { cv, k }, на экране cv.width * k. */
  function image(name, scale, flip, tint, SC) {
    const Q = quality(), r = build(name, (scale || 1) * Q, flip, SC, tint);
    return r ? { cv: r.cv, k: 1 / Q } : null;
  }
  /** Части для анимации — в том же формате, что даёт нарезка пиксельного спрайта. */
  function parts(name, scale, flip, tint, SC) {
    const Q = quality(), r = build(name, (scale || 1) * Q, flip, SC, tint);
    return r ? { parts: r.parts, anchor: r.anchor, k: 1 / Q, cv: r.cv, vec: true, ordered: true } : null;
  }
  function setOn(v) {
    VEC.on = !!v; cache.clear();
    if (H3.Anim && H3.Anim.setParts) H3.Anim.setParts(H3.Anim.PARTS.on);   // нарезка частей строилась из прежних картинок
  }

  H3.Vec = { VEC, def, has, render, image, parts, setOn, smooth, ellipse, tone, names: () => Object.keys(DEFS), _defs: DEFS };
})(typeof window !== 'undefined' ? window : globalThis);
