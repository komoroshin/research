/* ============================================================================
   view/vec_kit.js — набор деталей для рисованных существ (H3.VK).

   Всё рисуется в дизайн-единицах (10 на клетку пиксельного спрайта), существо
   смотрит вправо. Формы — объекты для H3.Vec.def (см. vector.js): контур p,
   цвет c, материал m, вложенные sub, штрихи lines, блики glint.

   Главный примитив — tube(): осевая линия с толщиной в каждой точке → контур.
   Из неё — руки, ноги, шеи, хвосты, щупальца, змеиные тела.

   Сборки:
     humanoid(o)  — гуманоид «на ногах» в каноничной рамке 200×250 (земля y=246),
                    затем fit() вписывает его в рамку старого спрайта;
     horse(o)     — конь (и любое копытное) в рамке 330×290 (земля y=282);
     wing.*       — перьевое, перепончатое, стрекозиное крыло;
     weapon.*, shield.* — оружие и щиты в руку.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const V = H3.Vec; if (!V) return;
  const tone = V.tone;

  /* ---------- геометрия ---------- */
  const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  const P = (x, y, f) => f ? [x, y, f] : [x, y];
  const move = (pts, dx, dy) => pts.map(p => P(p[0] + dx, p[1] + dy, p[2]));
  const grow = (pts, cx, cy, k, ky) => pts.map(p => P(cx + (p[0] - cx) * k, cy + (p[1] - cy) * (ky === undefined ? k : ky), p[2]));
  const rot = (pts, cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(p => P(cx + (p[0] - cx) * c - (p[1] - cy) * s, cy + (p[0] - cx) * s + (p[1] - cy) * c, p[2])); };
  const flipX = (pts, cx) => pts.map(p => P(2 * cx - p[0], p[1], p[2])).reverse();
  /** Эллипс точками (для сглаженного контура): годится под любые преобразования, в отличие от e:[…]. */
  function ell(cx, cy, rx, ry, n, a) { n = n || 10; const out = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; out.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]); } return a ? rot(out, cx, cy, a) : out; }
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  /**
   * Трубка: осевая линия [[x, y, толщина], …] → контур. Концы скруглены;
   * o.flat0 / o.flat1 — срезать начало/конец (сустав спрятан под другой частью).
   */
  function tube(c, o) {
    o = o || {};
    const n = c.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)];
      const [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), w = c[i][2] / 2;
      L.push([c[i][0] - ty * w, c[i][1] + tx * w]); R.push([c[i][0] + ty * w, c[i][1] - tx * w]);
    }
    const [sx, sy] = norm(c[1][0] - c[0][0], c[1][1] - c[0][1]), [ex, ey] = norm(c[n - 1][0] - c[n - 2][0], c[n - 1][1] - c[n - 2][1]);
    const w0 = c[0][2] / 2, w1 = c[n - 1][2] / 2;
    const out = [];
    if (o.flat0) { out.push(P(L[0][0], L[0][1], 1)); } else out.push(L[0]);
    for (let i = 1; i < n - 1; i++) out.push(L[i]);
    if (o.flat1) { out.push(P(L[n - 1][0], L[n - 1][1], 1), P(R[n - 1][0], R[n - 1][1], 1)); }
    else { out.push(L[n - 1], [c[n - 1][0] + ex * w1 * 0.9, c[n - 1][1] + ey * w1 * 0.9], R[n - 1]); }
    for (let i = n - 2; i > 0; i--) out.push(R[i]);
    if (o.flat0) out.push(P(R[0][0], R[0][1], 1)); else out.push(R[0], [c[0][0] - sx * w0 * 0.9, c[0][1] - sy * w0 * 0.9]);
    return out;
  }
  /** Средняя линия трубки — для штриха вдоль (шов, хребет, древко). */
  const spine = (c, t0, t1) => { const n = c.length, a = Math.floor((n - 1) * (t0 || 0)), b = Math.ceil((n - 1) * (t1 === undefined ? 1 : t1)); return c.slice(a, b + 1).map(p => [p[0], p[1]]); };
  /** Перо-лист: основание B, направление ang, длина, ширина; T — перевод локальных точек на рисунок. */
  function leaf(B, ang, len, wid, T) {
    T = T || ((x, y) => [x, y]);
    const c = Math.cos(ang), s = Math.sin(ang), nx = -s, ny = c;
    const pt = (t, w) => T(B[0] + c * len * t + nx * w, B[1] + s * len * t + ny * w);
    return { body: [pt(0, -wid * 0.5), pt(0.4, -wid * 0.6), pt(0.8, -wid * 0.44), [...pt(1, 0.08 * wid), 1], pt(0.84, wid * 0.4), pt(0.4, wid * 0.56), pt(0, wid * 0.5)],
      shaft: [pt(0.04, 0), pt(0.5, -wid * 0.05), pt(0.9, 0)] };
  }

  /* ---------- преобразование готовых форм (вписать в рамку, сдвинуть, повернуть) ---------- */
  function mapShape(s, f, k) {
    const o = Object.assign({}, s);
    if (s.d) throw new Error('VK.map: путь d не преобразуется — используй p');
    if (s.p) o.p = s.p.map(q => P(...f(q[0], q[1]), q[2]));
    if (s.e) { const [x, y] = f(s.e[0], s.e[1]); o.e = [x, y, s.e[2] * k, s.e[3] * k]; }
    if (s.sub) o.sub = s.sub.map(q => mapShape(q, f, k));
    if (s.lines) o.lines = s.lines.map(l => Object.assign({}, l, { p: l.p.map(q => P(...f(q[0], q[1]))) }));
    if (s.glint) o.glint = s.glint.map(g => [...f(g[0], g[1]), g[2] * k]);
    if (s.furLen) o.furLen = s.furLen * Math.sqrt(k);
    return o;
  }
  const mapShapes = (list, f, k) => list.map(s => mapShape(s, f, k));
  /** Все части описания через функцию точки f и масштаб k. */
  function mapParts(parts, f, k) { return parts.map(p => Object.assign({}, p, { pivot: f(p.pivot[0], p.pivot[1]), shapes: mapShapes(p.shapes, f, k) })); }
  /**
   * Вписать описание из каноничной рамки в рамку старого спрайта.
   * from: { ground: [x, y] } — точка опоры в каноне; to: { w, h, anchor } — дизайн-единицы (×10 пиксельных);
   * k — масштаб (по умолчанию: рост канона → высота якоря старого спрайта).
   */
  function fit(parts, from, to, k) {
    const [gx, gy] = from.ground, [ax, ay] = to.anchor;
    k = k || ay / (from.height || gy);
    const f = (x, y) => [ax + (x - gx) * k, ay + (y - gy) * k];
    return { w: to.w, h: to.h, anchor: to.anchor, parts: mapParts(parts, f, k) };
  }
  /** Рамка старого пиксельного спрайта ×10 — чтобы рисованное встало в тот же гекс. */
  function frameOf(name) {
    const Sp = H3.Sprites, sp = Sp && Sp.resolve && Sp.resolve(name);
    if (!sp || !sp.rows) return null;
    const u = sp.unit || 1, h = sp.rows.length / u, w = Math.max(...sp.rows.map(r => r.length)) / u;
    const a = sp.anchor ? [sp.anchor[0] / u, sp.anchor[1] / u] : [w / 2, h];
    return { w: Math.round(w * 10), h: Math.round(h * 10), anchor: [Math.round(a[0] * 10), Math.round(a[1] * 10)] };
  }

  /* ---------- оружие ---------- */
  const GOLD = '#d8a53a', STEEL = '#b7c0ca', WOOD = '#7a5230', LEATHER = '#5a3a22';
  /** Точки вдоль направления dir от кисти: at(t, w) — t вдоль, w поперёк. */
  const along = (hand, dir) => { const [dx, dy] = norm(dir[0], dir[1]); return (t, w) => [hand[0] + dx * t - dy * w, hand[1] + dy * t + dx * w]; };
  const weapon = {
    sword(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir), G = 9, bl = o.blade || '#d6dde6', gd = o.guard || GOLD;
      return [
        { p: [at(-2, -2.6), at(-2, 2.6), at(-17, 2.3), at(-17, -2.3)], c: o.grip || '#4a2e1a', m: 'leather' },
        { e: [...at(-19.5, 0), 4.6, 4.6], c: gd, m: 'gold' },
        { p: [P(...at(G, -(o.w || 4.8)), 1), P(...at(G + len * 0.86, -(o.w || 4.8) * 0.7), 1), P(...at(G + len, 0), 1), P(...at(G + len * 0.86, (o.w || 4.8) * 0.7), 1), P(...at(G, o.w || 4.8), 1)], c: bl, m: 'steel', gloss: 1.2,
          lines: [{ p: [at(G + 3, 0), at(G + len * 0.8, 0)], w: 1.5, a: 0.4 }, { p: [at(G + 2, -3.7), at(G + len * 0.84, -2.5)], w: 1, light: true, a: 0.9 }] },
        { p: [P(...at(G - 2.8, -17), 1), P(...at(G + 2.2, -16), 1), P(...at(G + 2.2, 16), 1), P(...at(G - 2.8, 17), 1)], c: gd, m: 'gold' },
      ];
    },
    /** Древко с наконечником: kind — 'spear' | 'pike' | 'halberd' | 'trident' | 'lance' | 'glaive'. back — сколько древка за кистью. */
    polearm(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir), back = o.back === undefined ? 30 : o.back, sh = o.shaft || WOOD, hd = o.head || STEEL, E = len;
      const out = [{ p: tube([[...at(-back, 0), 5], [...at(E - 4, 0), 4.2]]), c: sh, m: 'wood', flow: Math.atan2(dir[1], dir[0]), line: 0.8 }];
      const kind = o.kind || 'spear';
      if (kind === 'spear' || kind === 'pike') out.push({ p: [P(...at(E - 6, -4.5), 1), P(...at(E + 4, -5.5)), P(...at(E + 24, 0), 1), P(...at(E + 4, 5.5)), P(...at(E - 6, 4.5), 1)], c: hd, m: 'steel', gloss: 1.1, lines: [{ p: [at(E - 4, 0), at(E + 20, 0)], w: 1, light: true, a: 0.7 }] });
      if (kind === 'halberd') out.push(
        { p: [P(...at(E - 22, -3), 1), P(...at(E - 26, -22)), P(...at(E - 12, -26)), P(...at(E - 2, -20)), P(...at(E - 4, -3), 1)], c: hd, m: 'steel', gloss: 1.1 },
        { p: [P(...at(E - 16, 3), 1), P(...at(E - 10, 13), 1), P(...at(E - 4, 3), 1)], c: hd, m: 'steel' },
        { p: [P(...at(E - 6, -3.5), 1), P(...at(E + 22, 0), 1), P(...at(E - 6, 3.5), 1)], c: hd, m: 'steel', gloss: 1.1 });
      if (kind === 'trident') for (const w of [-9, 0, 9]) out.push({ p: [P(...at(E - 4, w - 2), 1), P(...at(E + 18 - Math.abs(w) * 0.4, w), 1), P(...at(E - 4, w + 2), 1)], c: hd, m: 'steel' });
      if (kind === 'trident') out.push({ p: [P(...at(E - 6, -11), 1), P(...at(E - 2, -11), 1), P(...at(E - 2, 11), 1), P(...at(E - 6, 11), 1)], c: hd, m: 'steel' });
      if (kind === 'lance') out.push({ p: [P(...at(-6, -9), 1), P(...at(10, -4)), P(...at(E + 20, 0), 1), P(...at(10, 4)), P(...at(-6, 9), 1)], c: o.lanceC || '#e8e0c8', m: 'wood', gloss: 0.4, lines: [{ p: [at(20, -3), at(E, -0.8)], w: 3, c: o.stripe || '#b02a2a', a: 0.9 }] });
      if (kind === 'glaive') out.push({ p: [P(...at(E - 6, -4), 1), P(...at(E + 10, -9)), P(...at(E + 30, 2), 1), P(...at(E + 4, 5)), P(...at(E - 6, 4), 1)], c: hd, m: 'steel', gloss: 1.1 });
      if (o.ribbon) out.push({ p: [at(E - 12, 3), at(E - 18, 16), at(E - 8, 24), at(E - 2, 14), at(E - 6, 4)], c: o.ribbon, m: 'cloth' });
      return out;
    },
    axe(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir), E = len, hd = o.head || STEEL;
      return [
        { p: tube([[...at(-14, 0), 5.5], [...at(E, 0), 4.5]]), c: o.shaft || WOOD, m: 'wood', flow: Math.atan2(dir[1], dir[0]), line: 0.8 },
        { p: [P(...at(E - 20, 2), 1), P(...at(E - 26, 20)), P(...at(E - 10, 30)), P(...at(E + 4, 24)), P(...at(E - 2, 2), 1)], c: hd, m: 'steel', gloss: 1.1, lines: [{ p: [at(E - 24, 20), at(E - 10, 28), at(E + 2, 22)], w: 1.2, light: true, a: 0.8 }] },
        ...(o.double ? [{ p: [P(...at(E - 20, -2), 1), P(...at(E - 26, -20)), P(...at(E - 10, -30)), P(...at(E + 4, -24)), P(...at(E - 2, -2), 1)], c: hd, m: 'steel', gloss: 1.1 }] : []),
      ];
    },
    mace(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir), E = len, hd = o.head || STEEL;
      const out = [{ p: tube([[...at(-14, 0), 5], [...at(E, 0), 4.5]]), c: o.shaft || '#5a4a3a', m: 'leather', line: 0.8 }];
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const c = at(E + 6, 0); out.push({ p: [P(c[0] + Math.cos(a) * 8, c[1] + Math.sin(a) * 8), P(c[0] + Math.cos(a + 0.5) * 15, c[1] + Math.sin(a + 0.5) * 15, 1), P(c[0] + Math.cos(a + 1) * 8, c[1] + Math.sin(a + 1) * 8)], c: hd, m: 'steel' }); }
      out.push({ e: [...at(E + 6, 0), 10, 10], c: hd, m: 'steel', gloss: 1.1 });
      return out;
    },
    /** Посох; o.orb — цвет навершия-сферы, o.crook — загнутый. */
    staff(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir), E = len;
      const out = [{ p: tube([[...at(-(o.back || 60), 0), 5], [...at(E * 0.5, 1.5), 5.4], [...at(E, 0), 5]]), c: o.shaft || WOOD, m: 'wood', flow: Math.atan2(dir[1], dir[0]), line: 0.8 }];
      if (o.crook) out.push({ p: tube([[...at(E - 2, 0), 5], [...at(E + 10, -3), 5], [...at(E + 14, -12), 4.6], [...at(E + 8, -18), 4]]), c: o.shaft || WOOD, m: 'wood', line: 0.8 });
      if (o.orb) out.push({ e: [...at(E + 8, 0), 9, 9], c: o.orb, m: 'gem', glint: [[...at(E + 5, -4), 3.5]] }, { p: [P(...at(E - 4, -6), 1), P(...at(E + 2, -9)), P(...at(E + 2, 9)), P(...at(E - 4, 6), 1)], c: o.cap || GOLD, m: 'gold', line: 0.7 });
      return out;
    },
    /** Лук: кисть держит середину; up — направление верхнего плеча. */
    bow(hand, up, size, o) {
      o = o || {}; const [ux, uy] = norm(up[0], up[1]), nx = uy, ny = -ux;   // n — вперёд (в сторону выстрела)
      const pt = (t, bulge) => [hand[0] + ux * t + nx * bulge, hand[1] + uy * t + ny * bulge];
      const S = size;
      const arc = [[...pt(-S, -2), 3.2], [...pt(-S * 0.55, 8), 5], [...pt(0, 11), 6.4], [...pt(S * 0.55, 8), 5], [...pt(S, -2), 3.2]];
      return [
        { p: [pt(-S + 1, -2.5), pt(S - 1, -2.5), pt(S - 1, -1.5), pt(-S + 1, -1.5)], c: o.string || '#e8e0d0', m: 'flat', line: 0 },
        { p: tube(arc), c: o.wood || '#8a5a2a', m: 'wood', gloss: 0.5, flow: Math.atan2(uy, ux) },
        { p: tube([[...pt(-7, 11), 7.5], [...pt(7, 11), 7.5]]), c: LEATHER, m: 'leather', line: 0.7 },
      ];
    },
    crossbow(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir);
      return [
        { p: tube([[...at(-18, 2), 8], [...at(len, 0), 6]]), c: o.wood || '#6a4424', m: 'wood', line: 0.9 },
        { p: tube([[...at(len - 6, -22), 4], [...at(len - 2, 0), 5], [...at(len - 6, 22), 4]]), c: STEEL, m: 'steel' },
        { p: tube([[...at(len - 7, -21), 1.4], [...at(2, 0), 1.4], [...at(len - 7, 21), 1.4]]), c: '#e8e0d0', m: 'flat', line: 0 },
      ];
    },
    gun(hand, dir, len, o) {
      o = o || {}; const at = along(hand, dir);
      return [
        { p: [at(-16, -2), at(8, -4), at(10, 4), at(-18, 9)], c: o.wood || '#6a4424', m: 'wood', line: 0.9 },
        { p: tube([[...at(2, -2), 6.5], [...at(len, -2), 5.5]], { flat1: true }), c: o.metal || '#6a6e76', m: 'steel', gloss: 1 },
      ];
    },
  };

  /* ---------- щиты ---------- */
  const shield = {
    /** Геральдический: золотая оковка, поле, крест или своя эмблема (emblem — формы в координатах щита). */
    heater(cx, cy, w, h, o) {
      o = o || {}; const hw = w / 2, rim = o.rim || GOLD, field = o.field || '#2c52b0';
      const out = [
        { p: [P(cx - hw, cy - h * 0.46, 1), P(cx, cy - h * 0.52), P(cx + hw, cy - h * 0.46, 1), P(cx + hw * 0.96, cy), P(cx + hw * 0.52, cy + h * 0.32), P(cx, cy + h * 0.52, 1), P(cx - hw * 0.52, cy + h * 0.32), P(cx - hw * 0.96, cy)], c: rim, m: 'gold' },
        { p: [P(cx - hw * 0.8, cy - h * 0.39, 1), P(cx, cy - h * 0.44), P(cx + hw * 0.8, cy - h * 0.39, 1), P(cx + hw * 0.78, cy), P(cx + hw * 0.4, cy + h * 0.28), P(cx, cy + h * 0.42, 1), P(cx - hw * 0.4, cy + h * 0.28), P(cx - hw * 0.78, cy)], c: field, m: 'steel', gloss: 0.7, line: 0.8,
          sub: o.emblem || (o.cross === false ? [] : [
            { p: [P(cx - 3.5, cy - h * 0.5, 1), P(cx + 3.5, cy - h * 0.5, 1), P(cx + 3.5, cy + h * 0.5, 1), P(cx - 3.5, cy + h * 0.5, 1)], c: o.charge || rim, m: 'gold', line: 0.6 },
            { p: [P(cx - hw, cy - h * 0.08, 1), P(cx + hw, cy - h * 0.08, 1), P(cx + hw, cy + 0.02 * h, 1), P(cx - hw, cy + 0.02 * h, 1)], c: o.charge || rim, m: 'gold', line: 0.6 }]) },
      ];
      if (o.boss !== false) out.push({ e: [cx, cy - h * 0.03, w * 0.13, w * 0.13], c: '#cfd6de', m: 'steel', glint: [[cx - w * 0.05, cy - h * 0.07, 3]] });
      return out;
    },
    round(cx, cy, r, o) {
      o = o || {};
      const out = [{ e: [cx, cy, r, r * 1.02], c: o.rim || '#8a8f98', m: 'steel' }, { e: [cx, cy, r * 0.84, r * 0.86], c: o.field || '#8a5a2a', m: o.fieldM || 'wood', line: 0.7, sub: o.emblem || [] }];
      if (o.boss !== false) out.push({ e: [cx, cy, r * 0.26, r * 0.26], c: o.bossC || '#c8ced6', m: 'steel', glint: [[cx - r * 0.08, cy - r * 0.08, 3]] });
      return out;
    },
  };

  /* ---------- гуманоид ----------
     Канон: рамка 200×250, земля y=246, центр x=100, смотрит вправо, рост ~230.
     Ключевые точки — H (голова, шея, плечи, пояс, таз, колени, щиколотки). */
  const H = { G: 246, cx: 100, headX: 104, headY: 52, headR: 23, neckY: 74, shY: 86, waistY: 146, hipY: 170, kneeY: 206, ankleY: 238,
    backHip: 90, frontHip: 112, backSh: 78, frontSh: 126, backFoot: 88, frontFoot: 116 };
  /** Нога: бедро → колено → щиколотка трубками, стопа носком вправо. o: { c, boot, style: 'armor'|'hose'|'bare', knee, toe } */
  function leg(hip, foot, o) {
    o = o || {}; const c = o.c || '#7a5a3a', boot = o.boot || '#4a3020', kneeX = (hip[0] + foot[0]) / 2 + (o.bend || 3), kneeY = (hip[1] + foot[1]) / 2 - 2;
    const ank = [foot[0] - 2, foot[1] - 9];
    const thigh = tube([[hip[0], hip[1] - 4, o.tw || 24], [kneeX, kneeY, (o.tw || 27) * 0.76]], { flat0: true });
    const shin = tube([[kneeX, kneeY, (o.tw || 27) * 0.74], [(kneeX + ank[0]) / 2 + 1, (kneeY + ank[1]) / 2, (o.tw || 27) * 0.66], [ank[0], ank[1], (o.tw || 27) * 0.5]]);
    const toe = o.toe === undefined ? 12 : o.toe;
    const footS = { p: [[ank[0] - 9, ank[1] - 2], [ank[0] + 7, ank[1] - 3], [foot[0] + toe, foot[1] - 3], P(foot[0] + toe + 3, foot[1], 1), P(ank[0] - 11, foot[1], 1)], c: o.style === 'bare' ? o.skin || c : boot, m: o.style === 'armor' ? 'steel' : o.style === 'bare' ? 'skin' : 'leather' };
    const m = o.style === 'armor' ? 'steel' : o.style === 'bare' ? 'skin' : o.m || 'cloth';
    const out = [{ p: thigh, c, m }, { p: shin, c: o.shinC || c, m }];
    if (o.style === 'armor') out.push({ e: [kneeX + 1, kneeY, 10, 9], c, m: 'steel', glint: [[kneeX - 3, kneeY - 3, 3]] });
    if (o.style === 'hose' && o.boot) out.push({ p: tube([[ank[0], ank[1] - 18, (o.tw || 27) * 0.62], [ank[0], ank[1] + 2, (o.tw || 27) * 0.56]], { flat1: true }), c: boot, m: 'leather' });
    out.push(footS);
    return out;
  }
  /** Рука: плечо → локоть → кисть. o: { c (рукав), hand (цвет кисти), m, w, fist } */
  function arm(sh, el, hand, o) {
    o = o || {}; const w = o.w || 15;
    const out = [{ p: tube([[sh[0], sh[1], w * 1.1], [el[0], el[1], w * 0.9]]), c: o.c || '#8a6a4a', m: o.m || 'cloth' },
      { p: tube([[el[0], el[1], w * 0.88], [hand[0], hand[1], w * 0.7]]), c: o.fore || o.c || '#8a6a4a', m: o.foreM || o.m || 'cloth' }];
    if (o.hand !== false) out.push({ e: [hand[0] + 1, hand[1], w * 0.52, w * 0.46], c: o.hand || '#e0b088', m: o.handM || 'skin', line: 0.8 });
    return out;
  }
  /**
   * Голова в три четверти, лицом вправо. o: { skin, hair, hairStyle: 'short'|'long'|'bald'|'none', beard, eye, brow, ear: true }
   * Шлемы и уборы — отдельные формы поверх (helm.*).
   */
  function head(cx, cy, r, o) {
    o = o || {}; const sk = o.skin || '#e8b890', out = [];
    if (o.hairStyle === 'long') out.push({ p: [[cx - r * 1.05, cy - r * 0.5], [cx + r * 0.1, cy - r * 1.1], [cx + r * 0.2, cy - r * 0.2], [cx - r * 0.2, cy + r * 1.3], [cx - r * 1.1, cy + r * 1.2]], c: o.hair || '#5a3a20', m: 'fur', furLen: 1.3, flow: Math.PI * 0.55 });
    out.push({ p: [[cx - r * 0.95, cy - r * 0.1], [cx - r * 0.7, cy - r * 0.8], [cx, cy - r * 1.02], [cx + r * 0.72, cy - r * 0.72], [cx + r * 0.95, cy - r * 0.2], [cx + r * 1.14, cy + r * 0.12], [cx + r * 0.96, cy + r * 0.28], [cx + r * 0.9, cy + r * 0.62], [cx + r * 0.5, cy + r * 0.98], [cx - r * 0.2, cy + r * 0.9], [cx - r * 0.8, cy + r * 0.55]], c: sk, m: 'skin', id: 'face',
      lines: [{ p: [[cx + r * 0.72, cy + r * 0.6], [cx + r * 0.92, cy + r * 0.58]], w: 1.2, a: 0.7 }] });
    if (o.ear !== false) out.push({ e: [cx - r * 0.42, cy + r * 0.12, r * 0.16, r * 0.24], c: sk, m: 'skin', line: 0.7, lc: tone(sk, -0.7) });
    if (o.hairStyle !== 'bald' && o.hairStyle !== 'none') out.push({ p: [[cx - r * 1.0, cy + r * 0.15], [cx - r * 0.85, cy - r * 0.75], [cx - r * 0.05, cy - r * 1.12], [cx + r * 0.75, cy - r * 0.82], [cx + r * 0.85, cy - r * 0.45], [cx + r * 0.2, cy - r * 0.55], [cx - r * 0.1, cy - r * 0.1], [cx - r * 0.45, cy + r * 0.05], [cx - r * 0.6, cy + r * 0.5]], c: o.hair || '#5a3a20', m: 'fur', furLen: 0.8, flow: Math.PI * 0.6, id: 'hair' });
    if (o.beard) out.push({ p: [[cx + r * 0.1, cy + r * 0.45], [cx + r * 0.9, cy + r * 0.5], [cx + r * 0.85, cy + r * 1.1], [cx + r * 0.35, cy + r * (o.beardLen || 1.5)], [cx - r * 0.2, cy + r * 0.95]], c: o.beard, m: 'fur', furLen: 0.9, flow: Math.PI * 0.5, id: 'beard' });
    out.push({ e: [cx + r * 0.56, cy - r * 0.02, r * 0.13, r * 0.15], c: o.eye || '#1a120c', m: 'gem', line: 0.4, glint: [[cx + r * 0.53, cy - r * 0.07, r * 0.07]] });
    if (o.brow !== false) out.push({ p: [[cx + r * 0.35, cy - r * 0.27], [cx + r * 0.78, cy - r * 0.22], [cx + r * 0.78, cy - r * 0.16], [cx + r * 0.35, cy - r * 0.19]], c: o.browC || o.hair || '#3a2414', m: 'flat', line: 0 });
    return out;
  }
  /** Шлемы и уборы поверх головы (cx, cy, r — те же, что у head). */
  const helm = {
    /** Шапель/кабассет — каска с полями (копейщик, стрелок). */
    kettle(cx, cy, r, o) { o = o || {}; const c = o.c || STEEL; return [
      { p: [[cx - r * 1.45, cy - r * 0.28], [cx - r * 0.2, cy - r * 0.46], [cx + r * 1.5, cy - r * 0.3], [cx + r * 1.45, cy - r * 0.12, 1], [cx - r * 1.4, cy - r * 0.08, 1]], c, m: 'steel' },
      { p: [[cx - r * 0.95, cy - r * 0.3], [cx - r * 0.8, cy - r * 0.95], [cx, cy - r * 1.22], [cx + r * 0.8, cy - r * 0.95], [cx + r * 0.98, cy - r * 0.3, 1]], c, m: 'steel', glint: [[cx - r * 0.3, cy - r * 0.85, r * 0.2]], lines: [{ p: [[cx - r * 0.6, cy - r * 1.05], [cx, cy - r * 1.22], [cx + r * 0.6, cy - r * 1.05]], w: 1.2, light: true, a: 0.7 }] },
    ]; },
    /** Закрытый шлем с забралом (рыцарь). */
    great(cx, cy, r, o) { o = o || {}; const c = o.c || STEEL; return [
      { p: [[cx - r * 0.95, cy + r * 0.5], [cx - r * 1.0, cy - r * 0.4], [cx - r * 0.5, cy - r * 1.0], [cx + r * 0.4, cy - r * 1.05], [cx + r * 1.0, cy - r * 0.6], [cx + r * 1.12, cy + r * 0.3], [cx + r * 0.9, cy + r * 1.05, 1], [cx - r * 0.8, cy + r * 1.05, 1]], c, m: 'steel',
        lines: [{ p: [[cx - r * 0.5, cy - r * 0.8], [cx + r * 0.2, cy - r * 1.0], [cx + r * 0.9, cy - r * 0.6]], w: 1.2, light: true, a: 0.8 }] },
      { p: [[cx + r * 0.05, cy - r * 0.3], [cx + r * 1.1, cy - r * 0.26], [cx + r * 1.5, cy + r * 0.2, 1], [cx + r * 1.1, cy + r * 0.72], [cx + r * 0.05, cy + r * 0.72]], c: tone(c, 0.1), m: 'steel', gloss: 1.2,
        lines: [{ p: [[cx + r * 0.2, cy + r * 0.07], [cx + r * 1.3, cy + r * 0.12]], w: 2.4, c: '#101318', a: 1 }] },
    ]; },
    /** Капюшон (монах, маг). */
    hood(cx, cy, r, o) { o = o || {}; const c = o.c || '#7a5a3a'; return [
      { p: [[cx - r * 1.25, cy + r * 1.1], [cx - r * 1.3, cy - r * 0.2], [cx - r * 0.7, cy - r * 1.2], [cx + r * 0.2, cy - r * 1.35], [cx + r * 1.0, cy - r * 0.9], [cx + r * 1.25, cy - r * 0.1], [cx + r * 0.7, cy - r * 0.6], [cx + r * 0.05, cy - r * 0.55], [cx - r * 0.35, cy + r * 0.2], [cx - r * 0.2, cy + r * 1.2]], c, m: 'cloth',
        lines: [{ p: [[cx - r * 0.9, cy - r * 0.6], [cx - r * 0.9, cy + r * 0.8]], w: 1.1, a: 0.4 }] },
    ]; },
    crown(cx, cy, r, o) { o = o || {}; const c = o.c || GOLD, y = cy - r * 0.78; return [
      { p: [P(cx - r * 0.85, y + r * 0.25, 1), P(cx - r * 0.85, y - r * 0.25, 1), P(cx - r * 0.5, y, 1), P(cx - r * 0.1, y - r * 0.45, 1), P(cx + r * 0.3, y, 1), P(cx + r * 0.75, y - r * 0.35, 1), P(cx + r * 0.8, y + r * 0.25, 1)], c, m: 'gold', glint: [[cx - r * 0.1, y - r * 0.1, r * 0.12]] },
    ]; },
    halo(cx, cy, r, o) { o = o || {}; return [{ p: tube([[cx - r * 0.9, cy - r * 1.35, 3.5], [cx, cy - r * 1.55, 3.5], [cx + r * 0.9, cy - r * 1.35, 3.5], [cx, cy - r * 1.18, 3.5], [cx - r * 0.9, cy - r * 1.35, 3.5]]), c: o.c || '#ffe07a', m: 'gold', gloss: 1.2, line: 0.5 }]; },
  };
  /** Торс: грудь и корпус, пояс, подол. o: { c, m, skirt (цвет подола), skirtLen, belt, trim, plate (цвет кирасы) } */
  function torso(o) {
    o = o || {}; const c = o.c || '#8a6a4a', out = [];
    const sl = o.skirtLen || 186;
    if (o.skirt !== false) out.push({ p: [[78, 142], [126, 142], [132, 168], [134, sl, 1], [118, sl - 3], [102, sl + 1], [86, sl - 3], [70, sl, 1], [72, 168]], c: o.skirt || c, m: o.skirtM || o.m || 'cloth', belly: 0.25, id: 'skirt',
      lines: [{ p: [[102, 152], [102, sl - 2]], w: 1.2, a: 0.5 }, { p: [[88, 156], [84, sl - 4]], w: 1, a: 0.3 }, { p: [[116, 156], [120, sl - 4]], w: 1, a: 0.3 }] });
    out.push({ p: [[74, 82], [126, 80], [138, 94], [136, 122], [126, 148], [78, 148], [68, 122], [64, 96]], c, m: o.m || 'cloth', id: 'chest', lines: o.chestLines || [] });
    if (o.plate) out.push({ p: [[80, 88], [124, 88], [134, 104], [130, 132], [106, 143], [80, 134], [72, 106]], c: o.plate, m: 'steel', id: 'plate', lines: [{ p: [[106, 92], [108, 138]], w: 1.2, light: true, a: 0.6 }] });
    if (o.belt !== false) out.push({ p: [[77, 140], [127, 140], [128, 151], [76, 151]], c: o.belt || LEATHER, m: 'leather', id: 'belt', sub: [{ p: [P(98, 139, 1), P(108, 139, 1), P(108, 152, 1), P(98, 152, 1)], c: o.buckle || GOLD, m: 'gold' }] });
    out.push({ p: tube([[H.headX - 4, 70, 17], [H.headX - 6, 86, 20]]), c: o.neck || o.skin || '#e8b890', m: o.neckM || 'skin', id: 'neck' });
    return out;
  }
  /** Длинная ряса/мантия до пят — ноги под ней не видны. */
  function robe(o) {
    o = o || {}; const c = o.c || '#6a4a30';
    return [
      { p: [[78, 80], [122, 80], [134, 100], [132, 150], [146, 236], [150, 247, 1], [56, 247, 1], [62, 200], [68, 150], [68, 100]], c, m: o.m || 'cloth', belly: 0.3, id: 'robe',
        lines: [{ p: [[104, 150], [112, 244]], w: 1.3, a: 0.5 }, { p: [[86, 160], [76, 242]], w: 1.1, a: 0.35 }, { p: [[122, 160], [134, 242]], w: 1.1, a: 0.35 }] },
      { p: [[74, 138], [130, 138], [131, 148], [73, 148]], c: o.belt || '#c8b080', m: 'cloth', id: 'belt' },
      { p: tube([[H.headX - 4, 70, 17], [H.headX - 6, 86, 20]]), c: o.skin || '#e8b890', m: 'skin', id: 'neck' },
    ];
  }
  /**
   * Гуманоид: собирает пять частей в каноне и вписывает в рамку старого спрайта name.
   * o: { name (чья рамка), legs: { back, front } | (hip, foot, side) => формы, back: формы за корпусом (плащ, дальняя рука, колчан),
   *      body: формы корпуса, head: формы головы, arm: формы ближней руки с оружием (prop), size (≈1), dx }
   */
  function humanoid(o) {
    const legFn = typeof o.legs === 'function' ? o.legs : (hip, foot, side) => leg(hip, foot, Object.assign({}, o.legs || {}, side < 0 ? { c: tone(o.legs && o.legs.c || '#7a5a3a', -0.18) } : {}));
    const parts = (o.before || []).slice();   // за всем телом: крылья, дальний плащ
    if (o.robe !== true) {
      parts.push({ kind: 'leg', side: -1, pivot: [H.backHip, H.hipY], shapes: legFn([H.backHip, H.hipY], [H.backFoot, H.G], -1) });
      parts.push({ kind: 'leg', side: 1, pivot: [H.frontHip, H.hipY], shapes: legFn([H.frontHip, H.hipY], [H.frontFoot, H.G], 1) });
    } else if (o.feet !== false) {
      // под рясой видны только носки
      parts.push({ kind: 'leg', side: -1, pivot: [H.backHip, H.hipY], shapes: [{ p: [[80, 236], [96, 235], [104, 246, 1], [78, 246, 1]], c: o.feetC || '#4a3020', m: 'leather' }] });
      parts.push({ kind: 'leg', side: 1, pivot: [H.frontHip, H.hipY], shapes: [{ p: [[110, 236], [126, 235], [136, 246, 1], [108, 246, 1]], c: o.feetC || '#4a3020', m: 'leather' }] });
    }
    parts.push({ kind: 'torso', pivot: [H.cx, H.waistY], shapes: (o.back || []).concat(o.body || torso(o.torso || {})) });
    parts.push({ kind: 'head', pivot: [H.headX - 4, H.neckY], shapes: o.head || head(H.headX, H.headY, H.headR, {}) });
    if (o.arm) parts.push({ kind: 'prop', pivot: [H.frontSh, H.shY], shapes: o.arm });
    if (o.extra) for (const p of o.extra) parts.push(p);
    const to = o.frame || frameOf(o.name) || { w: 200, h: 250, anchor: [100, 246] };
    return fit(parts, { ground: [H.cx + (o.dx || 0), H.G], height: 246 }, to, to.anchor[1] / 246 * (o.size || 1));
  }

  /* ---------- крылья ---------- */
  const wing = {
    /** Поднятое перьевое крыло: плечо O, кость по d длиной L; перья уходят к хвосту. col: { pri, pri2, sec, sec2, cov, cov2 } */
    feather(O, d, L, col) {
      d = norm(d[0], d[1]); const n = [d[1], -d[0]];
      const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
      const out = [];
      const f = (lf, c, a) => out.push({ p: lf.body, c, m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.8, light: true, a: a || 0.45 }] });
      for (let i = 5; i >= 0; i--) f(leaf([L * (0.62 + i * 0.066), 3 + (5 - i) * 1.6], Math.PI * (0.25 - i * 0.047), L * (0.44 + i * 0.05), L * 0.14, T), i % 2 ? col.pri : (col.pri2 || col.pri), 0.5);
      for (let j = 6; j >= 0; j--) f(leaf([L * (0.06 + j * 0.086), 5], Math.PI * (0.45 - j * 0.03), L * (0.34 + j * 0.013), L * 0.16, T), j % 2 ? col.sec : (col.sec2 || col.sec));
      for (let k = 9; k >= 0; k--) { const lf = leaf([L * (0.02 + k * 0.1), 0], Math.PI * (0.42 - k * 0.036), L * 0.21, L * 0.13, T); out.push({ p: lf.body, c: col.cov, m: 'leather', gloss: 0.35, line: 0.55 }); }
      out.push({ p: [T(-16, -2), T(-4, -9), T(L * 0.35, -11), T(L * 0.75, -8), T(L * 1.0, -1), T(L * 0.86, L * 0.07), P(...T(L * 0.6, L * 0.1), 1), T(L * 0.5, L * 0.1), P(...T(L * 0.36, L * 0.15), 1), T(L * 0.26, L * 0.13), P(...T(L * 0.12, L * 0.21), 1), T(L * 0.02, L * 0.19), P(...T(-14, L * 0.2), 1)],
        c: col.cov2 || col.cov, m: 'feather', texSize: 0.55, line: 0.6, flow: Math.atan2(n[1], n[0]), lines: [{ p: [T(0, -4), T(L * 0.45, -8), T(L * 0.92, -3)], w: 1.1, light: true, a: 0.6 }] });
      return out;
    },
    /** Перепончатое (дракон, демон, мантикора): кость-рука и пальцы, перепонка между ними. col: { mem, bone } */
    bat(O, d, L, col, o) {
      o = o || {}; d = norm(d[0], d[1]); const n = [d[1], -d[0]];
      const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
      const wrist = T(L * 0.55, -L * 0.04), fingers = [T(L * 1.05, L * 0.05), T(L * 0.95, L * 0.36), T(L * 0.72, L * 0.6), T(L * 0.4, L * 0.72)];
      const root = T(-L * 0.06, L * 0.34);
      const mem = [T(-L * 0.04, -L * 0.02), wrist, P(...fingers[0], 1), T(L * 0.88, L * 0.18), P(...fingers[1], 1), T(L * 0.72, L * 0.42), P(...fingers[2], 1), T(L * 0.5, L * 0.58), P(...fingers[3], 1), T(L * 0.22, L * 0.5), root];
      const out = [{ p: mem, c: col.mem, m: 'skin', gloss: 0.25, belly: 0.2, rim: 0.6, lines: fingers.map(f => ({ p: [wrist, lerp(wrist, f, 0.5), f], w: 1, a: 0.35 })) }];
      out.push({ p: tube([[...T(-L * 0.04, -L * 0.02), L * 0.075], [...wrist, L * 0.05]]), c: col.bone, m: o.boneM || 'skin', line: 0.8 });
      for (const f of fingers) out.push({ p: tube([[...wrist, L * 0.035], [...lerp(wrist, f, 0.55), L * 0.028], [...f, L * 0.016]]), c: col.bone, m: o.boneM || 'skin', line: 0.7 });
      out.push({ p: [T(L * 0.55, -L * 0.04), T(L * 0.6, -L * 0.14), P(...T(L * 0.66, -L * 0.2), 1), T(L * 0.62, -L * 0.06)], c: col.claw || '#e8dcc0', m: 'horn', line: 0.6 });
      return out;
    },
    /** Прозрачное крыло насекомого (стрекоза, оса, фея). */
    insect(O, d, L, col) {
      d = norm(d[0], d[1]); const n = [d[1], -d[0]];
      const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
      return [{ p: [T(0, -L * 0.06), T(L * 0.5, -L * 0.14), T(L * 1.0, -L * 0.06), T(L * 1.04, L * 0.08), T(L * 0.6, L * 0.2), T(L * 0.1, L * 0.12)], c: col.mem || '#cfe8f0', m: 'gem', gloss: 1.2, rim: 0.4, line: 0.6, lc: col.vein || '#4a6a78',
        lines: [0.25, 0.5, 0.75].map(t => ({ p: [T(0, 0), T(L * t, -L * 0.1 + L * 0.2 * t * 0.3), T(L * (t + 0.2), L * 0.12)], w: 0.8, c: col.vein || '#4a6a78', a: 0.6 })) }];
    },
  };

  /* ---------- копытное: конь, единорог, кошмар ----------
     Рамка 330×290, земля y=282, морда вправо. o: { coat, mane, hoof, dark (дальние ноги), barding (попона-цвет), saddle, horn, head: 'horse' } */
  const HG = 282;
  function hoofLeg(top, knee, fet, foot, w, c, hoof, o) {
    o = o || {};
    const out = [{ p: tube([[top[0], top[1], w], [knee[0], knee[1], w * 0.62], [fet[0], fet[1], w * 0.42], [foot[0] - 2, foot[1] - 9, w * 0.46]], { flat0: true }), c, m: o.m || 'fur', furLen: 0.5, flow: Math.PI * 0.5 }];
    out.push({ p: [[foot[0] - 9, foot[1] - 12], [foot[0] + 7, foot[1] - 12], [foot[0] + 10, foot[1], 1], [foot[0] - 11, foot[1], 1]], c: hoof, m: 'horn', line: 0.8 });
    if (o.feather) out.push({ p: [[foot[0] - 11, foot[1] - 22], [foot[0] + 9, foot[1] - 22], [foot[0] + 12, foot[1] - 8, 1], [foot[0] + 2, foot[1] - 10], [foot[0] - 6, foot[1] - 7, 1], [foot[0] - 13, foot[1] - 10]], c: o.feather, m: 'fur', furLen: 0.6, flow: Math.PI * 0.5 });
    return out;
  }
  function horse(o) {
    o = o || {}; const c = o.coat || '#8a5a34', far = o.dark || tone(c, -0.25), hf = o.hoof || '#3a2c22', mane = o.mane || '#2a1c14';
    const legs = [
      { kind: 'leg', side: 1, pivot: [96, 196], shapes: hoofLeg([96, 188], [88, 232], [92, 262], [96, HG - 4], 30, far, hf, o) },
      { kind: 'leg', side: -1, pivot: [222, 196], shapes: hoofLeg([222, 188], [228, 234], [226, 262], [230, HG - 4], 26, far, hf, o) },
      { kind: 'leg', side: -1, pivot: [118, 198], shapes: hoofLeg([118, 186], [108, 236], [114, 264], [118, HG], 34, c, hf, o) },
      { kind: 'leg', side: 1, pivot: [240, 198], shapes: hoofLeg([240, 186], [248, 238], [246, 266], [252, HG], 28, c, hf, o) },
    ];
    const bodyShapes = [
      { p: tube([[70, 150, 14], [44, 176, 18], [36, 214, 14], [40, 238, 8]]), c: o.tail || mane, m: 'fur', furLen: 1.6, flow: Math.PI * 0.5, id: 'tail' },
      { p: [[72, 150], [96, 132], [150, 134], [200, 128], [238, 136], [256, 160], [252, 196], [232, 212], [190, 214], [140, 212], [104, 210], [80, 196], [68, 172]], c, m: o.m || 'fur', furLen: 0.45, dens: 0.6, belly: 0.4, id: 'body',
        lines: [{ p: [[92, 150], [110, 176], [106, 200]], w: 1.2, a: 0.35 }, { p: [[236, 150], [242, 180], [236, 200]], w: 1.2, a: 0.35 }, { p: [[100, 138], [150, 136], [198, 130]], w: 1.4, light: true, a: 0.35 }] },
    ];
    if (o.barding) bodyShapes.push({ p: [[80, 138], [150, 134], [236, 134], [258, 160], [254, 212, 1], [236, 222], [210, 214], [186, 226], [160, 214], [134, 226], [108, 214], [82, 222], [70, 200, 1], [70, 160]], c: o.barding, m: 'cloth', belly: 0.35, id: 'barding',
      sub: [{ p: [[60, 200], [270, 200], [270, 230], [60, 230]], c: o.bardTrim || GOLD, m: 'gold', line: 0 }], lines: [{ p: [[150, 140], [150, 214]], w: 1.1, a: 0.4 }] });
    if (o.saddle) bodyShapes.push({ p: [[150, 128], [192, 124], [200, 140], [186, 150], [154, 150], [144, 138]], c: o.saddle, m: 'leather', id: 'saddle' });
    const headShapes = [
      { p: [[212, 152], [218, 112], [236, 80], [258, 60], [280, 60], [286, 84], [276, 118], [266, 156], [240, 174]], c, m: o.m || 'fur', furLen: 0.4, id: 'neck', lines: [{ p: [[270, 90], [262, 130], [252, 160]], w: 1.2, a: 0.3 }] },
      { p: [[262, 62], [284, 50], [306, 58], [326, 90], [336, 108], [332, 122], [316, 128], [298, 124], [284, 110], [270, 96]], c, m: o.m || 'fur', furLen: 0.35, id: 'head',
        lines: [{ p: [[324, 124], [332, 120]], w: 1.3, a: 0.7 }, { p: [[318, 104], [322, 107]], w: 2.2, a: 0.8 }, { p: [[290, 70], [300, 96], [298, 112]], w: 1.1, a: 0.3 }] },
      { p: [[268, 56], [270, 36, 1], [284, 52]], c, m: 'fur', furLen: 0.3, id: 'ear' },
      { p: [[232, 84], [252, 60], [270, 52], [264, 74], [250, 104], [234, 142], [222, 150], [222, 112]], c: mane, m: 'fur', furLen: 1.3, flow: Math.PI * 0.65, id: 'mane' },
      { e: [296, 78, 3.8, 3.2], c: '#120c08', m: 'gem', line: 0.4, glint: [[295, 77, 1.5]] },
    ];
    if (o.horn) headShapes.push({ p: [P(288, 56, 1), P(318, 10, 1), P(298, 62, 1)], c: o.horn, m: 'horn', gloss: 1.2, lines: [{ p: [[296, 48], [302, 42]], w: 1, a: 0.5 }, { p: [[303, 36], [308, 30]], w: 1, a: 0.5 }] });
    if (o.bridle !== false) headShapes.push({ p: tube([[282, 66, 3], [306, 102, 3], [322, 112, 3]]), c: o.bridle || LEATHER, m: 'leather', line: 0.5 });
    if (o.chanfron) headShapes.push({ p: [[272, 60], [300, 60], [328, 96], [320, 106], [296, 86], [276, 76]], c: o.chanfron, m: 'steel', id: 'chanfron' });
    return { legs, body: bodyShapes, head: headShapes, frame: { ground: [165, HG] } };
  }
  /**
   * Всадник на коне. o.horse — параметры horse(); o.body/head/arm — формы всадника в каноне гуманоида (как для humanoid);
   * o.leg — { c, boot }; o.back — формы за всадником (плащ). Вписывается в рамку o.name (или o.frame).
   */
  function mounted(o) {
    const h = horse(o.horse || {}), k = 1.08, fR = (x, y) => [170 + (x - 100) * k, 126 + (y - 160) * k];
    const R = list => mapShapes(list || [], fR, k);
    const lc = (o.leg && o.leg.c) || '#6a5a4a', boot = (o.leg && o.leg.boot) || '#3a2a1c', lm = (o.leg && o.leg.m) || 'cloth';
    const riderLeg = [
      { p: tube([[164, 124, 30], [194, 156, 25]], { flat0: true }), c: lc, m: lm },
      { p: tube([[194, 156, 23], [192, 192, 18]]), c: lc, m: lm },
      { p: [[178, 186], [200, 186], [204, 198], [216, 203, 1], [182, 205, 1]], c: boot, m: o.leg && o.leg.m === 'steel' ? 'steel' : 'leather' },
      { p: tube([[188, 180, 2.5], [188, 204, 2.5]]), c: '#8a8f98', m: 'steel', line: 0.4 },
    ];
    const parts = [h.legs[0], h.legs[1], h.legs[2], h.legs[3],
      { kind: 'torso', pivot: [160, 170], shapes: R(o.back).concat(h.body, riderLeg, R(o.body)) },
      { kind: 'head', pivot: [236, 150], shapes: h.head },
      { kind: 'head', pivot: fR(H.headX - 4, H.neckY), shapes: R(o.head) }];
    if (o.arm) parts.push({ kind: 'prop', pivot: fR(H.frontSh, H.shY), shapes: R(o.arm) });
    const to = o.frame || frameOf(o.name) || { w: 330, h: 290, anchor: [165, 282] };
    return fit(parts, { ground: [165, HG] }, to, (to.anchor[1] / HG) * (o.size || 1));
  }
  /** Собрать коня как существо (без всадника). */
  function horseCreature(o) {
    const h = horse(o);
    const parts = [h.legs[0], h.legs[1], h.legs[2], h.legs[3], { kind: 'torso', pivot: [160, 170], shapes: h.body }, { kind: 'head', pivot: [236, 150], shapes: h.head }];
    if (o.extra) for (const p of o.extra) parts.push(p);
    const to = o.frame || frameOf(o.name) || { w: 330, h: 290, anchor: [165, 282] };
    return fit(parts, { ground: [165, HG] }, to, (to.anchor[1] / HG) * (o.size || 1));
  }

  H3.VK = { norm, P, move, grow, rot, flipX, ell, lerp, tube, spine, leaf, along, mapShape, mapShapes, mapParts, fit, frameOf,
    weapon, shield, H, leg, arm, head, helm, torso, robe, humanoid, wing, horse, hoofLeg, horseCreature, mounted, tone, COL: { GOLD, STEEL, WOOD, LEATHER } };
})(typeof window !== 'undefined' ? window : globalThis);
