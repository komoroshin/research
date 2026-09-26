/* ============================================================================
   view/vec_tb_d.js — постройки экрана города: Фабрика, Улей, Бастион.

   Своя архитектура вместо общих построек (bld_* из vec_towns.js): экран города
   берёт 'bld_<id>@<фракция>', если он описан, и рисует его вместо общего
   (подкраска фракции и декоративные «черты» поверх тогда не нужны).

   Фабрика — стимпанк и Дикий Запад: красный кирпич, медь, клёпаный металл,
             трубы с дымом, шестерни, дощатые фасады салунов, водонапорные башни.
   Улей     — восковые купола-соты, хитин, янтарь, светящиеся ячейки, органика.
   Бастион  — брёвна, мох, длинные дома, священный дуб, частокол, вышки на сваях,
             рога и шкуры.

   Рамка каждой постройки — от общей (K.frameOf('bld_…')): центр-низ = якорь,
   рисунок встаёт на то же место сцены (LAYOUT в townscene.js). Единицы — дизайн-
   единицы (10 на клетку старого спрайта); на сцене 5 единиц = 1 точка, поэтому
   штрихи и детали крупные. Окна, которые ночью горят, собираются сами: помощники
   окон кладут свою середину в meta.lights.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf } = K;
  const PI = Math.PI;

  /* ============================== общие помощники ============================== */
  const WIN = '#f2d34c', WLC = '#3a2614', GOLD = '#d8a53a', HOLE = '#1a1410', IRON = '#4a4a52';
  // огни окон текущей постройки: помощники окон кладут сюда середину проёма
  let LT = [];
  const lit = (x, y) => { LT.push([Math.round(x), Math.round(y)]); };

  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  /** Арка: низ y1, полуширина w, полная высота h; pointed — стрельчатая. */
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  /** Купол-полусфера по контуру: основание y, полуширина hw, высота h. */
  const domeP = (cx, y, hw, h) => [P(cx - hw, y, 1), [cx - hw * 0.97, y - h * 0.5], [cx - hw * 0.66, y - h * 0.9], [cx, y - h], [cx + hw * 0.66, y - h * 0.9], [cx + hw * 0.97, y - h * 0.5], P(cx + hw, y, 1)];
  /** Кладка: ряды высотой rh, камни шириной bw, вразбежку. */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 1.8;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push({ p: [[x0, y], [x1, y]], w, a });
    let row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  /** Швы досок/брёвен через шаг st: вертикальные (vert) или горизонтальные. */
  function planks(x0, y0, x1, y1, st, vert, a, w) {
    const out = []; a = a || 0.45;
    if (vert) for (let x = x0 + st; x < x1 - 1; x += st) out.push({ p: [[x, y0], [x, y1]], w: w || 2, a });
    else for (let y = y0 + st; y < y1 - 1; y += st) out.push({ p: [[x0, y], [x1, y]], w: w || 2, a });
    return out;
  }
  /** Тёмная правая сторона (подформа). */
  const shadeR = (x0, y0, x1, y1, k, c) => ({ p: box(x1 - (x1 - x0) * k, y0 - 4, x1 + 4, y1 + 4), c, m: 'flat', line: 0 });
  /** Точка-заклёпка / гвоздь: штрих нулевой длины с круглым концом. */
  const dot = (x, y, w, c, a) => ({ p: [[x, y], [x + 0.4, y]], w, c, a: a || 0.95 });
  const rivets = (x0, x1, y, st, c, w) => { const o = []; for (let x = x0; x <= x1 + 0.1; x += st) o.push(dot(x, y, w || 4.5, c || '#e8dcc0', 0.9)); return o; };
  /** Окно-арка со светом: o { c, lc, pointed, cross, frame, fw } */
  function awin(cx, y1, w, h, o) {
    o = o || {}; lit(cx, y1 - h * 0.45);
    const ys = y1 - h + w, lc = o.lc || WLC, out = [];
    if (o.frame) out.push({ p: arch(cx, y1 + 3, w + (o.fw || 6), h + (o.fw || 6) + 2, o.pointed), c: o.frame, m: 'cloth', line: 1 });
    const lines = o.cross === false ? [] : [{ p: [[cx, y1 - h + 2], [cx, y1]], w: Math.max(2, w * 0.24), c: lc, a: 0.9 }, { p: [[cx - w, ys + (y1 - ys) * 0.25], [cx + w, ys + (y1 - ys) * 0.25]], w: Math.max(2, w * 0.22), c: lc, a: 0.9 }];
    out.push({ p: arch(cx, y1, w, h, o.pointed), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.1, lc, lines });
    return out;
  }
  /** Прямоугольное окно: центр (cx, cy), полуразмеры w, h; o { c, lc, shut, sill, cross } */
  function rwin(cx, cy, w, h, o) {
    o = o || {}; lit(cx, cy);
    const lc = o.lc || WLC, out = [];
    if (o.shut) for (const s of [-1, 1]) out.push({ p: box(cx + s * w, cy - h, cx + s * (w + w * 0.75), cy + h), c: o.shut, m: 'wood', flow: -PI / 2, line: 1 });
    out.push({ p: box(cx - w, cy - h, cx + w, cy + h), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.1, lc,
      lines: o.cross === false ? [] : [{ p: [[cx, cy - h], [cx, cy + h]], w: 2.6, c: lc, a: 0.9 }, { p: [[cx - w, cy - h * 0.1], [cx + w, cy - h * 0.1]], w: 2.6, c: lc, a: 0.9 }] });
    if (o.sill) out.push({ p: box(cx - w - 4, cy + h, cx + w + 4, cy + h + 6), c: o.sill, m: 'cloth', line: 1 });
    return out;
  }
  /** Круглое окно-иллюминатор: ободок ring, стекло c. */
  function port(cx, cy, r, o) {
    o = o || {}; lit(cx, cy);
    return [{ e: [cx, cy, r + (o.rw || 5), r + (o.rw || 5)], c: o.ring || '#c8843a', m: 'gold', line: 1, lines: o.bolts === false ? [] : [0, 1, 2, 3, 4, 5, 6, 7].map(i => dot(cx + Math.cos(i * PI / 4) * (r + 2.5), cy + Math.sin(i * PI / 4) * (r + 2.5), 3, '#5a3a10', 0.8)) },
      { e: [cx, cy, r, r], c: o.c || WIN, m: 'gem', gloss: 0.8, rim: 0, line: 1, lc: o.lc || WLC, lines: o.cross === false ? [] : [{ p: [[cx - r, cy], [cx + r, cy]], w: 2.4, c: o.lc || WLC, a: 0.85 }, { p: [[cx, cy - r], [cx, cy + r]], w: 2.4, c: o.lc || WLC, a: 0.85 }] }];
  }
  /** Шестиугольник (соты): r — радиус, flat — сплющенность по высоте. */
  function hexPts(cx, cy, r, k) { const out = []; for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; out.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r * (k || 0.9), 1)); } return out; }
  /** Сетка сот штрихами в прямоугольнике (обрежется по форме-родителю). */
  function combLines(x0, y0, x1, y1, r, a, w) {
    const out = [];
    for (let row = 0, y = y0; y < y1 + r; y += r * 1.56, row++) for (let x = x0 + (row % 2) * r * 1.5; x < x1 + r; x += r * 3) out.push({ p: hexPts(x, y, r).map(p => [p[0], p[1]]).concat([[x + r, y]]), w: w || 2, a: a || 0.45 });
    return out;
  }
  /** Шестерня: центр, радиус, число зубьев, цвет. */
  function gear(cx, cy, r, n, c, o) {
    o = o || {}; const pts = [];
    for (let i = 0; i < n; i++) { const a0 = i / n * PI * 2 + (o.rot || 0), d = PI / n; for (const [a, rr] of [[a0 - d * 0.5, r], [a0 - d * 0.3, r * 1.2], [a0 + d * 0.3, r * 1.2], [a0 + d * 0.5, r]]) pts.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1)); }
    const lines = [{ p: ell(cx, cy, r * 0.8, r * 0.8, 16).concat([[cx + r * 0.8, cy]]), w: 2.4, a: 0.55 }];
    for (let i = 0; i < (o.spokes || 5); i++) { const a = i / (o.spokes || 5) * PI * 2 + 0.3; lines.push({ p: [[cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3], [cx + Math.cos(a) * r * 0.74, cy + Math.sin(a) * r * 0.74]], w: r * 0.16, c: tone(c, -0.6), a: 0.9 }); }
    return [{ p: pts, c, m: 'gold', gloss: 0.9, line: 1, lines }, { e: [cx, cy, r * 0.26, r * 0.26], c: tone(c, 0.12), m: 'gold', line: 0.8, glint: [[cx - r * 0.08, cy - r * 0.08, r * 0.1]] }];
  }
  /** Флажок: основание древка (x, y), высота L. */
  function flag(x, y, L, c, o) {
    o = o || {}; const fw = o.fw || L * 0.6, fh = o.fh || L * 0.34, s = o.left ? -1 : 1, top = y - L;
    return [
      { p: tube([[x, y, o.pw || 4], [x, top - 3, (o.pw || 4) * 0.8]]), c: o.pole || '#4a3a2a', m: 'wood', line: 0.6 },
      { p: [P(x + s * 1.5, top, 1), [x + s * fw * 0.45, top + fh * 0.12], P(x + s * fw, top + fh * 0.42, 1), [x + s * fw * 0.5, top + fh * 0.62], P(x + s * 1.5, top + fh, 1)], c, m: 'cloth', line: 0.8 },
    ];
  }
  /** Дым: клубы над точкой (x, y), s — размер. Полупрозрачные, чтобы не спорить с живым дымом сцены. */
  function smoke(x, y, s, o) {
    o = o || {}; const c = o.c || '#cfcac4', out = [];
    for (let i = 0; i < (o.n || 3); i++) out.push({ e: [x + i * s * 0.55 + (o.dx || 0) * i, y - s * 0.6 - i * s * 1.25, s * (0.55 + i * 0.22), s * (0.46 + i * 0.18)], c, m: 'cloth', line: 0.5, lc: tone(c, -0.35), op: 0.72 - i * 0.14, ao: 0.4 });
    return out;
  }
  /** Язык пламени. */
  function flame(x, y, w, h, o) {
    o = o || {};
    return [{ p: [P(x - w, y, 1), [x - w * 0.9, y - h * 0.35], [x - w * 0.35, y - h * 0.62], P(x - w * 0.1, y - h, 1), [x + w * 0.3, y - h * 0.62], P(x + w * 0.5, y - h * 0.78, 1), [x + w * 0.9, y - h * 0.35], P(x + w, y, 1)], c: o.c || '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.6, lc: o.lc || '#8a2a0a',
      sub: [{ p: [P(x - w * 0.5, y + 2, 1), [x - w * 0.4, y - h * 0.3], P(x - w * 0.05, y - h * 0.62, 1), [x + w * 0.35, y - h * 0.3], P(x + w * 0.5, y + 2, 1)], c: o.core || '#ffe08a', m: 'flat', line: 0 }] }];
  }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /** Крона из комьев листвы: задний слой темнее, передний светлее. */
  function foliage(cx, cy, rx, ry, n, cols, seed, o) {
    o = o || {}; const rnd = rngOf(seed), back = [], front = [];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
      const a = rnd() * PI * 2, rr = Math.sqrt(rnd()) * (layer ? 0.55 : 0.8);
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr - (layer ? ry * 0.12 : 0);
      const r = (layer ? 0.4 : 0.44) * Math.min(rx, ry) * (0.8 + rnd() * 0.4);
      (layer ? front : back).push({ p: ell(x, y, r * 1.12, r, 9, rnd() * 0.6), c: layer ? cols[1 + ((rnd() * (cols.length - 1)) | 0)] : cols[0], m: 'feather', texSize: o.leaf || 0.8, flow: PI * 0.5, line: layer ? 0.6 : 0.8, ao: 0.8 });
    }
    return back.concat(front);
  }
  /** Череп (с рогами по желанию). */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || '#e8e0c8', out = [];
    out.push({ p: [[cx - r, cy - r * 0.1], [cx - r * 0.8, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.8, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.6, cy + r * 0.45], [cx + r * 0.4, cy + r * 1.1, 1], [cx - r * 0.4, cy + r * 1.1, 1], [cx - r * 0.6, cy + r * 0.45]], c, m: 'horn', gloss: 0.3, line: 0.9,
      lines: [{ p: [[cx - r * 0.38, cy - r * 0.02], [cx - r * 0.32, cy + r * 0.08]], w: r * 0.42, c: '#1a1210', a: 1 }, { p: [[cx + r * 0.38, cy - r * 0.02], [cx + r * 0.32, cy + r * 0.08]], w: r * 0.42, c: '#1a1210', a: 1 },
        { p: [[cx, cy + r * 0.35], [cx, cy + r * 0.5]], w: r * 0.16, c: '#1a1210', a: 0.9 }] });
    return out;
  }
  /** Рога оленя: основание (x, y), сторона s (−1/1), размер L. */
  function antler(x, y, s, L, c) {
    c = c || '#e2d4b2';
    const m = (t, dx, dy) => [x + s * dx * L, y - dy * L, t];
    return [{ p: tube([m(L * 0.09, 0, 0), m(L * 0.08, 0.28, 0.22), m(L * 0.07, 0.42, 0.55), m(L * 0.05, 0.62, 0.85), m(L * 0.02, 0.9, 1.02)]), c, m: 'horn', line: 0.8 },
      { p: tube([m(L * 0.06, 0.26, 0.2), m(L * 0.04, 0.14, 0.5), m(L * 0.015, 0.06, 0.7)]), c, m: 'horn', line: 0.8 },
      { p: tube([m(L * 0.055, 0.42, 0.55), m(L * 0.035, 0.3, 0.8), m(L * 0.015, 0.26, 1)]), c, m: 'horn', line: 0.8 },
      { p: tube([m(L * 0.05, 0.6, 0.82), m(L * 0.03, 0.72, 0.6), m(L * 0.012, 0.86, 0.52)]), c, m: 'horn', line: 0.8 }];
  }

  /** Описать постройку: рамка общей 'bld_<id>', рисунок build(cx, g, рамка) → формы. */
  function B(fac, id, build) {
    const fr = frameOf('bld_' + id); if (!fr) return;
    LT = [];
    const shapes = build(fr.anchor[0], fr.anchor[1], fr).filter(Boolean);
    let lights = LT.filter((p, i) => LT.findIndex(q => Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) < 30) === i);
    if (lights.length > 12) { const k = lights.length / 12; lights = Array.from({ length: 12 }, (_, i) => lights[Math.floor(i * k)]); }
    V.def('bld_' + id + '@' + fac, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { lights } });
  }

  /* ================================= ФАБРИКА =================================
     Кирпич, медь, клёпаная сталь, дощатые фасады Дикого Запада, трубы с дымом. */
  const F = { BR: '#a8472c', BRD: '#6c2a1a', CU: '#c8843a', BRS: '#d8a53a', ST: '#80808a', SD: '#44444e', PL: '#b07a42', PLD: '#6e4626', SAND: '#d8bc8a', STONE: '#cfbc9c', RED: '#9a2a22', GRN: '#3f6a4a' };
  const FWIN = { frame: F.STONE };
  /** Кирпичная стена-коробка (или по контуру o.p) с тёмной правой стороной. */
  function brk(x0, y0, x1, y1, o) {
    o = o || {};
    return { p: o.p || box(x0, y0, x1, y1), c: o.c || F.BR, m: 'cloth', line: 1.2, belly: 0.12, sub: [shadeR(x0, y0, x1, y1, o.k || 0.16, o.cd || F.BRD)].concat(o.sub || []),
      lines: masonry(x0, y0, x1, y1, o.rh || 15, o.bw || 30, o.ma || 0.42, 2.2).concat(o.lines || []) };
  }
  /** Дощатая стена (вертикальные доски). */
  function brd(x0, y0, x1, y1, o) {
    o = o || {};
    return { p: o.p || box(x0, y0, x1, y1), c: o.c || F.PL, m: 'wood', flow: -PI / 2, line: 1.2, belly: 0.1, sub: [shadeR(x0, y0, x1, y1, o.k || 0.15, o.cd || F.PLD)].concat(o.sub || []), lines: planks(x0, y0, x1, y1, o.st || 17, true, 0.5).concat(o.lines || []) };
  }
  /** Фальшфасад салуна: прямоугольник со ступенчатым верхом; top — высший край. */
  function falseTop(x0, x1, top, base, step) {
    const w = x1 - x0, s = step || 22;
    return [P(x0, base, 1), P(x0, top + s * 2, 1), P(x0 + w * 0.14, top + s * 2, 1), P(x0 + w * 0.14, top + s, 1), P(x0 + w * 0.3, top + s, 1), P(x0 + w * 0.3, top, 1), P(x1 - w * 0.3, top, 1), P(x1 - w * 0.3, top + s, 1), P(x1 - w * 0.14, top + s, 1), P(x1 - w * 0.14, top + s * 2, 1), P(x1, top + s * 2, 1), P(x1, base, 1)];
  }
  /** Скатная жестяная крыша (вид спереди, трапеция) с гофром. */
  function tinRoof(x0, x1, y, h, e, inset, o) {
    o = o || {}; const lines = [];
    for (let x = x0 - e + 12; x < x1 + e - 4; x += 14) { const k = (x - (x0 + x1) / 2) / ((x1 - x0) / 2 + e); lines.push({ p: [[x, y], [x - k * inset * 0.9, y - h + 3]], w: 2, a: 0.4 }); }
    lines.push({ p: [[x0 - e + inset * 0.2, y - h * 0.2], [x1 + e - inset * 0.2, y - h * 0.2]], w: 2, light: true, a: 0.35 });
    return { p: [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)], c: o.c || F.SD, m: 'steel', gloss: 0.35, line: 1.2, lines,
      sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.2, y - h - 2, 1), P(x1 + e + 2, y - h - 2, 1), P(x1 + e + 2, y + 2, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.3, y + 2, 1)], c: tone(o.c || F.SD, -0.35), m: 'flat', line: 0 }] };
  }
  /** Пилообразная крыша цеха со стеклянными фонарями: n зубьев от x0 до x1, низ y, высота h. */
  function sawRoof(x0, x1, y, h, n) {
    const st = (x1 - x0) / n, pts = [P(x0, y, 1)], out = [];
    for (let i = 0; i < n; i++) pts.push(P(x0 + i * st, y - h, 1), P(x0 + (i + 1) * st, y, 1));
    out.push({ p: pts, c: F.SD, m: 'steel', gloss: 0.4, line: 1.2 });
    for (let i = 0; i < n; i++) { out.push({ p: [P(x0 + i * st + 5, y - h + 8, 1), P(x0 + i * st + 5, y - 3, 1), P(x0 + (i + 1) * st - st * 0.45, y - 3, 1)], c: WIN, m: 'gem', rim: 0, line: 0.9, lc: WLC }); lit(x0 + i * st + st * 0.2, y - h * 0.3); }
    return out;
  }
  /** Кирпичная труба: от base до top, полуширина внизу w1, вверху w0; o.smoke — клубы. */
  function stack(x, top, base, w0, w1, o) {
    o = o || {}; const bands = [];
    for (let y = top + 40; y < base - 20; y += o.bandSt || 70) bands.push({ p: [[x - w1 - 2, y], [x + w1 + 2, y]], w: 6, c: '#3a3a42', a: 0.95 });
    const out = [{ p: trap(x, top, base, w0, w1), c: o.c || '#9a3c24', m: 'cloth', line: 1.1, lines: masonry(x - w1, top, x + w1, base, 13, w0 * 1.1, 0.4, 2).concat(bands), sub: [{ p: [P(x + w0 * 0.35, top - 2, 1), P(x + w0 + 4, top - 2, 1), P(x + w1 + 4, base + 2, 1), P(x + w1 * 0.35, base + 2, 1)], c: F.BRD, m: 'flat', line: 0 }] },
      { p: box(x - w0 - 6, top - 12, x + w0 + 6, top + 2), c: F.SD, m: 'steel', line: 1, lines: rivets(x - w0 - 1, x + w0 + 1, top - 5, 9) }];
    if (o.smoke) out.push(...smoke(x + 4, top - 10, o.smoke));
    return out;
  }
  /** Медная труба-трубопровод с фланцами в изломах. */
  function pipe(pts, w, o) {
    o = o || {}; const out = [{ p: tube(pts.map(p => [p[0], p[1], w * 2])), c: o.c || F.CU, m: 'gold', gloss: 0.8, line: 0.9 }];
    for (let i = 1; i < pts.length - (o.end ? 0 : 1); i++) out.push({ e: [pts[i][0], pts[i][1], w * 1.4, w * 1.4], c: F.BRS, m: 'gold', line: 0.8 });
    return out;
  }
  /** Клёпаный стальной лист. */
  function plate(x0, y0, x1, y1, c, o) {
    o = o || {};
    return { p: o.p || box(x0, y0, x1, y1), c: c || F.ST, m: 'steel', gloss: 0.5, line: 1.2, sub: o.sub || [],
      lines: rivets(x0 + 7, x1 - 7, y0 + 7, o.st || 14).concat(rivets(x0 + 7, x1 - 7, y1 - 7, o.st || 14), planks(x0, y0, x1, y1, o.seam || 60, true, 0.35)) };
  }
  /** Двустворчатая дверь в каменном обрамлении. o { c, frame, bat (створки салуна), lamp } */
  function fdoor(cx, base, w, h, o) {
    o = o || {}; const out = [];
    if (o.frame !== false) out.push({ p: box(cx - w - 7, base - h - 8, cx + w + 7, base), c: o.frame || F.STONE, m: 'cloth', line: 1 });
    if (o.bat) {
      lit(cx, base - h * 0.6);
      out.push({ p: box(cx - w, base - h, cx + w, base), c: '#ffcf6a', m: 'gem', rim: 0, gloss: 0.3, line: 1, lc: WLC });
      for (const s of [-1, 1]) out.push({ p: [P(cx + s * 2, base - h * 0.72, 1), [cx + s * w * 0.5, base - h * 0.8], P(cx + s * w, base - h * 0.74, 1), P(cx + s * w, base - h * 0.28, 1), P(cx + s * 2, base - h * 0.28, 1)], c: o.c || F.PL, m: 'wood', flow: 0, line: 1, lines: planks(cx - w, base - h, cx + w, base, 8, false, 0.45) });
      return out;
    }
    out.push({ p: box(cx - w, base - h, cx + w, base), c: o.c || '#6a3e22', m: 'wood', flow: -PI / 2, line: 1.2, lines: [{ p: [[cx, base - h], [cx, base]], w: 2.6, a: 0.8 }, { p: [[cx - w, base - h * 0.3], [cx + w, base - h * 0.3]], w: 3.4, c: IRON, a: 0.9 }, { p: [[cx - w, base - h * 0.7], [cx + w, base - h * 0.7]], w: 3.4, c: IRON, a: 0.9 }] });
    if (o.lamp) { out.push({ e: [o.lamp[0], o.lamp[1], 7, 7], c: WIN, m: 'gem', gloss: 1, line: 1, lc: WLC }); lit(o.lamp[0], o.lamp[1]); }
    return out;
  }
  /** Галерея/навес на столбах: крыша от x0 до x1 на высоте y, столбы до base; rail — перила балкона. */
  function porch(x0, x1, y, base, n, o) {
    o = o || {}; const out = [], st = (x1 - x0 - 12) / (n - 1);
    for (let i = 0; i < n; i++) out.push({ p: tube([[x0 + 6 + i * st, y, 5], [x0 + 6 + i * st, base, 5.5]]), c: o.post || F.PLD, m: 'wood', line: 0.9 });
    out.push({ p: [P(x0 - 6, y + 4, 1), P(x0 + 4, y - 14, 1), P(x1 - 4, y - 14, 1), P(x1 + 6, y + 4, 1)], c: o.c || F.SD, m: o.m || 'steel', flow: 0, gloss: 0.3, line: 1.1, lines: planks(x0, y - 14, x1, y + 4, 12, true, 0.3) });
    if (o.rail) { const rl = []; for (let x = x0 + 6; x < x1; x += 12) rl.push({ p: [[x, y - 14], [x, y - 40]], w: 3, a: 0.8 }); out.push({ p: box(x0, y - 44, x1, y - 14), c: 'rgba(0,0,0,0)', m: 'flat', line: 0 }, { p: tube([[x0, y - 42, 4], [x1, y - 42, 4]]), c: o.post || F.PLD, m: 'wood', line: 0.8, lines: [] }); out.push({ p: box(x0, y - 40, x1, y - 16), c: 'rgba(40,20,10,0.0)', m: 'flat', line: 0, lines: rl.map(l => Object.assign(l, { c: o.post || F.PLD })) }); }
    return out;
  }
  /** Вывеска: доска с рамкой; icon — подформы. */
  const sign = (x0, y0, x1, y1, c, icon) => ({ p: box(x0, y0, x1, y1), c: c || F.GRN, m: 'wood', flow: 0, line: 1.2, sub: icon || [], lines: [{ p: [[x0 + 4, y0 + 4], [x1 - 4, y0 + 4], [x1 - 4, y1 - 4], [x0 + 4, y1 - 4], [x0 + 4, y0 + 4]], w: 2.2, c: F.BRS, a: 0.9 }] });
  /** Водонапорная башня: бак (доски с обручами, конус-крыша) на решётчатых опорах. */
  function waterTank(cx, top, hw, h, legBase, o) {
    o = o || {}; const out = [], bot = top + h;
    for (const s of [-1, 1]) out.push({ p: tube([[cx + s * hw * 0.8, bot, 6], [cx + s * hw * 1.05, legBase, 7]]), c: F.PLD, m: 'wood', line: 0.9 });
    const br = []; const n = Math.max(2, Math.round((legBase - bot) / 60));
    for (let i = 0; i < n; i++) { const y0 = bot + (legBase - bot) * i / n, y1 = bot + (legBase - bot) * (i + 1) / n, w0 = hw * (0.8 + 0.25 * i / n), w1 = hw * (0.8 + 0.25 * (i + 1) / n); br.push({ p: tube([[cx - w0, y0, 2.5], [cx + w1, y1, 2.5]]), c: '#4a2e18', m: 'wood', line: 0.5 }, { p: tube([[cx + w0, y0, 2.5], [cx - w1, y1, 2.5]]), c: '#4a2e18', m: 'wood', line: 0.5 }); }
    out.push(...br);
    const hoops = []; for (let y = top + 16; y < bot; y += 26) hoops.push({ p: [[cx - hw, y], [cx, y + 6], [cx + hw, y]], w: 4.5, c: '#3a3a42', a: 0.95 });
    out.push({ p: [P(cx - hw, top, 1), P(cx + hw, top, 1), P(cx + hw, bot, 1), [cx, bot + 8], P(cx - hw, bot, 1)], c: o.c || '#a06a3a', m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(cx - hw, top, cx + hw, bot + 8, 12, true, 0.4).concat(hoops), sub: [shadeR(cx - hw, top, cx + hw, bot + 8, 0.3, '#5e3a1e')] });
    out.push({ p: [P(cx - hw - 8, top + 4, 1), P(cx, top - hw * 0.7, 1), P(cx + hw + 8, top + 4, 1), [cx, top + 10]], c: F.SD, m: 'steel', gloss: 0.4, line: 1.1, sub: [{ p: [P(cx + 2, top - hw * 0.7, 1), P(cx + hw + 12, top + 6, 1), P(cx + 4, top + 12, 1)], c: '#2a2a32', m: 'flat', line: 0 }] });
    if (o.spout !== false) out.push({ p: tube([[cx - hw + 4, bot - 6, 5], [cx - hw - 20, bot + 14, 4], [cx - hw - 26, bot + 40, 4]]), c: '#3a3a42', m: 'steel', line: 0.8 });
    return out;
  }
  /** Жердевая изгородь загона. */
  function fence(x0, x1, base, h, st, c) {
    const out = [];
    for (const y of [base - h * 0.8, base - h * 0.4]) out.push({ p: tube([[x0, y, 4], [x1, y + 2, 4]]), c: c || '#8a6038', m: 'wood', line: 0.7 });
    for (let x = x0; x <= x1 + 0.1; x += st) out.push({ p: tube([[x, base, 5], [x, base - h, 4.5]]), c: tone(c || '#8a6038', -0.15), m: 'wood', line: 0.7 });
    return out;
  }
  /** Бочка. */
  const barrel = (x, base, w, h, c) => ({ p: [P(x - w * 0.86, base, 1), [x - w, base - h / 2], P(x - w * 0.86, base - h, 1), P(x + w * 0.86, base - h, 1), [x + w, base - h / 2], P(x + w * 0.86, base, 1)], c: c || '#8a5a30', m: 'wood', flow: -PI / 2, line: 1,
    lines: [{ p: [[x - w, base - h * 0.25], [x + w, base - h * 0.25]], w: 3.5, c: IRON, a: 0.9 }, { p: [[x - w, base - h * 0.75], [x + w, base - h * 0.75]], w: 3.5, c: IRON, a: 0.9 }] });
  /** Ящик. */
  const crate = (x0, base, s, c) => ({ p: box(x0, base - s, x0 + s, base), c: c || '#a8804a', m: 'wood', flow: 0, line: 1, lines: [{ p: [[x0, base - s], [x0 + s, base]], w: 2.6, a: 0.6 }, { p: [[x0 + 3, base - s + 3], [x0 + s - 3, base - s + 3], [x0 + s - 3, base - 3], [x0 + 3, base - 3], [x0 + 3, base - s + 3]], w: 2, a: 0.4 }] });
  /** Мельница-насос (ветряк на ферме): решётчатая вышка, колесо лопастей, хвост. */
  function windmill(x, top, base, r) {
    const out = [{ p: tube([[x - r * 0.5, base, 4], [x - 3, top + r, 3]]), c: '#6a6a72', m: 'steel', line: 0.7 }, { p: tube([[x + r * 0.5, base, 4], [x + 3, top + r, 3]]), c: '#6a6a72', m: 'steel', line: 0.7 }];
    for (let i = 1; i < 4; i++) { const y = base - (base - top - r) * i / 4, w = r * 0.5 * (1 - i / 4) + 3; out.push({ p: tube([[x - w, y, 2], [x + w, y - 18, 2]]), c: '#5a5a62', m: 'steel', line: 0.4 }); }
    out.push({ p: [P(x, top + r - 4, 1), P(x + r * 1.1, top + r - 12, 1), P(x + r * 1.2, top + r + 6, 1), P(x + 6, top + r + 4, 1)], c: F.RED, m: 'steel', line: 0.9 });
    const bl = []; for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; bl.push([x + Math.cos(a) * r * 0.25, top + r + Math.sin(a) * r * 0.25], [x + Math.cos(a) * r, top + r + Math.sin(a) * r], [x + Math.cos(a + 0.2) * r, top + r + Math.sin(a + 0.2) * r], [x + Math.cos(a + 0.12) * r * 0.25, top + r + Math.sin(a + 0.12) * r * 0.25]); }
    out.push({ e: [x, top + r, r, r], c: '#b8b8c0', m: 'steel', gloss: 0.5, line: 1, lines: Array.from({ length: 12 }, (_, i) => { const a = i / 12 * PI * 2; return { p: [[x + Math.cos(a) * r * 0.2, top + r + Math.sin(a) * r * 0.2], [x + Math.cos(a) * r, top + r + Math.sin(a) * r]], w: 2.4, a: 0.7 }; }) }, { e: [x, top + r, r * 0.2, r * 0.2], c: F.SD, m: 'steel', line: 0.8 });
    return out;
  }
  /** Ступенчатая пирамида из песчаника: n уступов от ширины w0 (низ) до w1 (верх). */
  function steps(cx, base, top, w0, w1, n, c) {
    const out = [], h = (base - top) / n;
    for (let i = 0; i < n; i++) { const y1 = base - i * h, y0 = y1 - h, w = w0 + (w1 - w0) * i / (n - 1); out.push({ p: trap(cx, y0, y1, w - 8, w), c: c || '#c8a878', m: 'cloth', line: 1.2, belly: 0.25, lines: masonry(cx - w, y0, cx + w, y1, h / 2, 34, 0.35, 2.2), sub: [{ p: [P(cx + w * 0.62, y0 - 2, 1), P(cx + w + 4, y0 - 2, 1), P(cx + w + 4, y1 + 2, 1), P(cx + w * 0.62, y1 + 2, 1)], c: tone(c || '#c8a878', -0.3), m: 'flat', line: 0 }] }); }
    return out;
  }

  /* ---------- Фабрика: ратуша — от конторы до капитолия ---------- */
  function fHall(level) {
    return (cx, g) => {
      const out = [];
      if (level === 1) {
        out.push(...stack(cx + 104, 58, 190, 13, 15, { smoke: 16 }));
        out.push(brd(cx - 172, 212, cx - 108, g, { st: 14 }), tinRoof(cx - 172, cx - 108, 214, 26, 6, 10));
        out.push(brk(cx - 116, 128, cx + 128, g, { p: falseTop(cx - 116, cx + 128, 96, g, 16) }));
        out.push({ p: box(cx - 122, 170, cx + 134, 182), c: F.STONE, m: 'cloth', line: 1 });
        out.push(...gear(cx + 6, 134, 28, 10, F.CU));
        for (const x of [cx - 80, cx + 92]) out.push(...awin(x, 160, 13, 36, FWIN), ...awin(x, 272, 13, 40, FWIN));
        out.push(...porch(cx - 60, cx + 72, 240, g, 3, {}));
        out.push(...fdoor(cx + 6, g, 24, 84, { lamp: [cx + 46, g - 90] }));
      } else if (level === 2) {
        out.push(...stack(cx - 150, 96, 250, 13, 15, { smoke: 16 }));
        out.push(brk(cx - 190, 196, cx + 190, g, {}), tinRoof(cx - 190, cx + 190, 200, 64, 12, 60));
        // часовая башня
        out.push(brk(cx - 44, 70, cx + 44, 250, { k: 0.3 }), { p: [P(cx - 56, 76, 1), P(cx, 14, 1), P(cx + 56, 76, 1)], c: F.SD, m: 'steel', gloss: 0.4, line: 1.2, sub: [{ p: [P(cx + 2, 14, 1), P(cx + 60, 78, 1), P(cx + 4, 80, 1)], c: '#2a2a32', m: 'flat', line: 0 }] });
        out.push({ e: [cx, 120, 36, 36], c: F.CU, m: 'gold', line: 1 }, { e: [cx, 120, 29, 29], c: '#f4ecd0', m: 'cloth', line: 1, lc: '#6a4a20', lines: [{ p: [[cx, 120], [cx, 98]], w: 4, c: '#2a1a10', a: 1 }, { p: [[cx, 120], [cx + 15, 128]], w: 4, c: '#2a1a10', a: 1 }] });
        out.push(...awin(cx, 214, 11, 34, FWIN));
        for (const x of [cx - 140, cx - 84, cx + 84, cx + 140]) out.push(...awin(x, 280, 12, 38, FWIN), ...awin(x, 370, 12, 38, FWIN));
        out.push(...porch(cx - 60, cx + 60, 312, g, 3, { c: F.CU, m: 'gold' }));
        out.push(...fdoor(cx, g, 28, 100, {}));
      } else if (level === 3) {
        for (const x of [cx - 214, cx + 214]) out.push(...stack(x, 80, 330, 13, 16, { smoke: x < cx ? 18 : 0 }));
        out.push(brk(cx - 236, 250, cx - 110, g, {}), brk(cx + 110, 250, cx + 236, g, {}), tinRoof(cx - 236, cx - 110, 254, 40, 10, 30), tinRoof(cx + 110, cx + 236, 254, 40, 10, 30));
        out.push(brk(cx - 130, 150, cx + 130, g, { p: falseTop(cx - 130, cx + 130, 124, g, 14) }), { p: box(cx - 136, 190, cx + 136, 202), c: F.STONE, m: 'cloth', line: 1 });
        // центральная башня с медным куполом
        out.push(brk(cx - 50, 60, cx + 50, 160, { k: 0.3 }), { p: box(cx - 58, 52, cx + 58, 66), c: F.STONE, m: 'cloth', line: 1 });
        out.push({ p: domeP(cx, 54, 54, 50), c: F.CU, m: 'gold', gloss: 0.8, line: 1.2, lines: [-0.5, 0, 0.5].map(k => ({ p: [[cx + 54 * k, 54], [cx + 44 * k, 26], [cx + 18 * k, 6]], w: 2.4, a: 0.4 })) });
        out.push({ p: tube([[cx, 6, 5], [cx, -24, 3]]), c: F.BRS, m: 'gold', line: 0.7 });
        out.push(...gear(cx, 108, 32, 12, F.BRS));
        for (const x of [cx - 90, cx - 40, cx + 40, cx + 90]) out.push(...awin(x, 262, 12, 40, FWIN));
        for (const x of [cx - 90, cx + 90]) out.push(...awin(x, 372, 12, 40, FWIN));
        for (const x of [cx - 190, cx - 156, cx + 156, cx + 190]) out.push(...rwin(x, 330, 11, 20, { sill: F.STONE }));
        out.push(...pipe([[cx - 110, 300], [cx - 70, 300], [cx - 70, 214]], 7), ...pipe([[cx + 110, 300], [cx + 70, 300], [cx + 70, 214]], 7));
        out.push(...porch(cx - 56, cx + 56, 336, g, 2, { c: F.CU, m: 'gold' }), ...fdoor(cx, g, 30, 102, {}));
      } else {
        // капитолий: две высоченные трубы, клёпаный цоколь, медный купол с шестернёй
        for (const x of [cx - 238, cx + 238]) out.push(...stack(x, 30, 470, 16, 22, { smoke: 20, bandSt: 90 }));
        out.push(brk(cx - 214, 260, cx + 214, g, { rh: 16 }), { p: box(cx - 222, 250, cx + 222, 266), c: F.STONE, m: 'cloth', line: 1, lines: rivets(cx - 214, cx + 214, 258, 16, '#8a7a60') });
        for (const x of [cx - 176, cx - 120, cx + 120, cx + 176]) out.push(...awin(x, 346, 14, 46, FWIN), ...awin(x, 452, 14, 46, FWIN));
        out.push(brk(cx - 96, 150, cx + 96, 260, { k: 0.25 }), { p: box(cx - 104, 140, cx + 104, 156), c: F.STONE, m: 'cloth', line: 1 });
        for (const x of [cx - 60, cx, cx + 60]) out.push(...awin(x, 236, 12, 54, { frame: F.STONE, c: '#ffd870' }));
        out.push({ p: domeP(cx, 146, 100, 96), c: F.CU, m: 'gold', gloss: 0.9, line: 1.3, lines: [-0.66, -0.33, 0, 0.33, 0.66].map(k => ({ p: [[cx + 100 * k, 146], [cx + 84 * k, 94], [cx + 36 * k, 54]], w: 2.6, a: 0.4 })).concat([{ p: [[cx - 98, 120], [cx + 98, 120]], w: 3, a: 0.4 }]) });
        out.push(...gear(cx, 34, 26, 10, F.BRS), { p: tube([[cx, 12, 4], [cx, -30, 3]]), c: F.BRS, m: 'gold', line: 0.7 });
        // медные трубопроводы и портик из чугунных колонн
        out.push(...pipe([[cx - 216, 360], [cx - 236, 360]], 8), ...pipe([[cx + 216, 360], [cx + 236, 360]], 8));
        out.push(plate(cx - 110, 356, cx + 110, 380, F.SD, { st: 16 }));
        for (const x of [cx - 92, cx - 46, cx + 46, cx + 92]) out.push({ p: tube([[x, 380, 9], [x, g - 12, 10]]), c: '#3a3a44', m: 'steel', gloss: 0.8, line: 1 }, { p: box(x - 13, g - 14, x + 13, g), c: F.STONE, m: 'cloth', line: 1 });
        out.push(...gear(cx, 322, 34, 12, F.BRS), ...fdoor(cx, g, 34, 120, { c: '#5a3a22' }));
        out.push({ p: box(cx - 130, g - 8, cx + 130, g + 2), c: F.STONE, m: 'cloth', line: 1 });
      }
      return out;
    };
  }

  /* ---------- Фабрика: гильдия магов — электробашня с катушкой ---------- */
  function fGuild(level) {
    return (cx, g) => {
      const out = [], top = 190, BL = '#8ae0ff', BLC = '#1a3a5a';
      const floors = level + 1, fh = (g - 36 - top) / floors, hw0 = 66 + level * 3, hw1 = 44 + level * 2;
      const hwAt = y => hw1 + (hw0 - hw1) * (y - top) / (g - 36 - top);
      out.push(brk(cx - hw0 - 16, g - 36, cx + hw0 + 16, g, { rh: 12, bw: 26, c: F.STONE, cd: '#9a8a70' }));
      // медная труба, вьющаяся по башне
      out.push(brk(cx - hw1, top, cx + hw1, g - 36, { p: trap(cx, top, g - 36, hw1, hw0), k: 0.3 }));
      for (let i = 1; i < floors; i++) { const y = g - 36 - i * fh, hw = hwAt(y); out.push({ p: box(cx - hw - 8, y - 7, cx + hw + 8, y + 7), c: F.SD, m: 'steel', gloss: 0.5, line: 1, lines: rivets(cx - hw - 3, cx + hw + 3, y, 12) }); }
      for (let i = 1; i < floors; i++) { const y = g - 36 - i * fh + fh * 0.5; out.push(...port(cx + (i % 2 ? -12 : 12), y, 15, { c: BL, lc: BLC })); }
      out.push(...pipe([[cx + hwAt(g - 80) + 4, g - 60], [cx + hwAt(top + fh) + 10, top + fh * 0.6], [cx + hw1 + 14, top + 10]], 6));
      out.push(...fdoor(cx - 8, g - 36, 22, Math.min(92, fh * 0.75), {}));
      // галерея, купол, катушка
      out.push({ p: box(cx - hw1 - 18, top - 12, cx + hw1 + 18, top + 6), c: F.SD, m: 'steel', line: 1.1, lines: rivets(cx - hw1 - 12, cx + hw1 + 12, top - 3, 12) });
      const rl = []; for (let x = cx - hw1 - 14; x <= cx + hw1 + 14; x += 11) rl.push({ p: [[x, top - 12], [x, top - 34]], w: 2.6, c: '#2a2a32', a: 0.9 });
      out.push({ p: box(cx - hw1 - 18, top - 38, cx + hw1 + 18, top - 32), c: F.SD, m: 'steel', line: 0.8, lines: [] }, { p: box(cx - hw1 - 18, top - 34, cx + hw1 + 18, top - 12), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: rl });
      out.push({ p: domeP(cx, top - 12, hw1 + 4, 50), c: F.CU, m: 'gold', gloss: 0.9, line: 1.2, lines: [-0.5, 0, 0.5].map(k => ({ p: [[cx + hw1 * k, top - 12], [cx + hw1 * k * 0.4, top - 56]], w: 2.2, a: 0.4 })) });
      const ct = top - 62, ch = 40 + level * 16;
      out.push({ p: tube([[cx, ct, 10], [cx, ct - ch, 6]]), c: '#b86a2a', m: 'gold', line: 0.9, lines: Array.from({ length: Math.round(ch / 7) }, (_, i) => ({ p: [[cx - 9, ct - 4 - i * 7], [cx + 9, ct - 7 - i * 7]], w: 2.2, a: 0.6 })) });
      for (let i = 0; i < Math.min(level, 3); i++) { const y = ct - ch * (0.35 + i * 0.25); out.push({ e: [cx, y, 16 + i * 2, 5], c: F.BRS, m: 'gold', line: 0.8 }); }
      const ty = ct - ch - 10, tr = 22 + level * 4;
      out.push({ e: [cx, ty, tr, tr * 0.42], c: '#b8c0c8', m: 'steel', gloss: 1.2, line: 1.1, lines: [{ p: [[cx - tr * 0.8, ty], [cx + tr * 0.8, ty]], w: 2.4, a: 0.5 }] });
      // молнии разряда
      const zap = (s, L) => ({ p: [[cx + s * tr, ty], [cx + s * (tr + L * 0.4), ty - L * 0.35], [cx + s * (tr + L * 0.3), ty - L * 0.1], [cx + s * (tr + L), ty - L * 0.55]], w: 3.2, c: '#bff4ff', a: 0.95 });
      out.push({ e: [cx, ty, tr + 30, tr * 0.42 + 26], c: '#9ae8ff', m: 'flat', line: 0, op: 0.22 });
      out.push({ p: box(cx - tr - 50, ty - 60, cx + tr + 50, ty + 20), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: [zap(-1, 40 + level * 6), zap(1, 34 + level * 8)] });
      out.push({ e: [cx, ty, 7, 7], c: BL, m: 'gem', gloss: 1.3, line: 0.8, lc: BLC });
      if (level >= 3) out.push(...gear(cx - hw0 + 4, g - 110, 20, 9, F.BRS));
      return out;
    };
  }

  /* ---------- Фабрика: таверна — салун с балконом и фальшфасадом ---------- */
  function fTavern(cx, g) {
    const out = [];
    out.push(...stack(cx + 120, 12, 120, 10, 12, {}));
    out.push(brd(cx - 150, 60, cx + 150, g, { p: falseTop(cx - 150, cx + 150, 36, g, 18) }));
    out.push({ p: box(cx - 156, 98, cx + 156, 110), c: F.PLD, m: 'wood', flow: 0, line: 1 });
    out.push(sign(cx - 88, 46, cx + 88, 92, F.RED, [{ p: [P(cx - 16, 54, 1), P(cx + 10, 54, 1), P(cx + 10, 84, 1), P(cx - 16, 84, 1)], c: GOLD, m: 'gold', line: 0.8 }, { e: [cx + 16, 68, 6, 9], c: F.RED, m: 'flat', line: 0, lines: [{ p: [[cx + 8, 60], [cx + 18, 60], [cx + 18, 76], [cx + 8, 76]], w: 4, c: GOLD, a: 1 }] },
      { e: [cx - 50, 69, 10, 10], c: GOLD, m: 'gold', line: 0.6 }, { e: [cx + 52, 69, 10, 10], c: GOLD, m: 'gold', line: 0.6 }]));
    for (const x of [cx - 100, cx, cx + 100]) out.push(...rwin(x, 152, 16, 22, { shut: F.GRN }));
    out.push(...porch(cx - 150, cx + 150, 198, g, 5, { c: F.PLD, m: 'wood', rail: true }));
    for (const x of [cx - 100, cx + 100]) out.push(...rwin(x, 262, 22, 26, {}));
    out.push(...fdoor(cx, g, 26, 84, { bat: true, frame: F.PLD }));
    // коновязь и бочки
    out.push({ p: tube([[cx - 176, g - 30, 4], [cx - 120, g - 30, 4]]), c: F.PLD, m: 'wood', line: 0.7 }, { p: tube([[cx - 172, g, 5], [cx - 172, g - 34, 5]]), c: F.PLD, m: 'wood', line: 0.7 });
    out.push(barrel(cx + 170, g, 18, 46), barrel(cx + 134, g, 16, 40, '#9a6a38'));
    return out;
  }

  /* ---------- Фабрика: кузница — горн, паровой молот, высокая труба ---------- */
  function fSmith(cx, g) {
    const out = [];
    out.push(...stack(cx + 92, 16, 210, 18, 22, { smoke: 18 }));
    out.push(brk(cx - 140, 196, cx + 120, g, {}), tinRoof(cx - 140, cx + 120, 200, 70, 14, 50));
    // паровой молот: А-рама, цилиндр, баба
    out.push({ p: tube([[cx - 148, g, 7], [cx - 110, 160, 6]]), c: F.SD, m: 'steel', line: 0.9 }, { p: tube([[cx - 72, g - 40, 7], [cx - 110, 160, 6]]), c: F.SD, m: 'steel', line: 0.9 });
    out.push(plate(cx - 126, 150, cx - 94, 204, F.CU, { st: 10 }), { p: tube([[cx - 110, 204, 4], [cx - 110, 240, 4]]), c: '#9aa0a8', m: 'steel', line: 0.7 }, plate(cx - 124, 240, cx - 96, 262, '#3a3a44', { st: 12 }));
    out.push(...smoke(cx - 128, 150, 10, { n: 2, c: '#f0f0f0' }));
    // открытый горн
    out.push({ p: arch(cx - 40, g, 44, 118), c: '#2a1a12', m: 'cloth', line: 1.2, ao: 1.3 }, { p: ell(cx - 40, g - 22, 36, 20, 12), c: '#ff7a24', m: 'gem', gloss: 1, line: 0, sub: [{ p: ell(cx - 44, g - 22, 20, 11, 10), c: '#ffe08a', m: 'flat', line: 0 }] });
    out.push(...flame(cx - 40, g - 30, 24, 52)); lit(cx - 40, g - 50);
    out.push(...gear(cx + 44, 250, 26, 10, F.BRS));
    out.push(...rwin(cx + 44, 316, 16, 20, {}), ...fdoor(cx + 88, g, 18, 66, {}));
    // наковальня на пне и колесо
    out.push({ p: box(cx - 170, g - 26, cx - 140, g), c: '#7a5230', m: 'wood', line: 1 }, { p: [P(cx - 186, g - 46, 1), P(cx - 128, g - 46, 1), [cx - 116, g - 40], P(cx - 136, g - 32, 1), P(cx - 170, g - 32, 1)], c: '#4a4a52', m: 'steel', line: 1 });
    return out;
  }

  /* ---------- Фабрика: рынок — лавка «всё для старателя» ---------- */
  function fMarket(cx, g) {
    const out = [];
    out.push(brd(cx - 150, 70, cx + 150, g, { p: falseTop(cx - 150, cx + 150, 40, g, 16), c: '#c8a070', cd: '#8a6440' }));
    out.push({ p: box(cx - 154, 86, cx + 154, 96), c: F.PLD, m: 'wood', flow: 0, line: 1 });
    // монета-вывеска
    out.push({ e: [cx, 64, 22, 22], c: WIN, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(cx, 64, 15, 15, 12).concat([[cx + 15, 64]]), w: 3, c: '#8a6a20', a: 0.8 }], sub: [{ p: box(cx - 5, 59, cx + 5, 69), c: '#6a4a10', m: 'flat', line: 0 }] });
    for (const x of [cx - 90, cx + 90]) out.push(...rwin(x, 140, 26, 24, { c: '#ffd870' }));
    // полосатый навес
    const st = []; for (let x = cx - 164; x < cx + 164; x += 26) st.push({ p: [P(x, 168, 1), P(x + 13, 168, 1), P(x + 16, 198, 1), P(x + 3, 198, 1)], c: '#f0e2c0', m: 'flat', line: 0 });
    out.push({ p: [P(cx - 164, 166, 1), P(cx + 164, 166, 1), P(cx + 172, 198, 1), [cx + 140, 206], [cx + 108, 198], [cx + 76, 206], [cx + 44, 198], [cx + 12, 206], [cx - 20, 198], [cx - 52, 206], [cx - 84, 198], [cx - 116, 206], [cx - 148, 198], P(cx - 172, 198, 1)], c: F.RED, m: 'cloth', line: 1.2, sub: st });
    for (const x of [cx - 160, cx + 160]) out.push({ p: tube([[x, 198, 5], [x, g, 5]]), c: F.PLD, m: 'wood', line: 0.8 });
    out.push(...fdoor(cx, g, 22, 60, { frame: F.PLD, bat: true }));
    // товар: ящики, мешки, кирка, фонарь
    out.push(crate(cx - 146, g, 34), crate(cx - 112, g, 28, '#9a7440'), crate(cx - 140, g - 34, 26, '#b08a52'));
    out.push({ p: [[cx + 90, g], [cx + 84, g - 22], [cx + 92, g - 40], [cx + 106, g - 44], [cx + 120, g - 40], [cx + 126, g - 22], [cx + 122, g]], c: '#d8c090', m: 'cloth', line: 1 }, barrel(cx + 150, g, 16, 42));
    out.push({ p: tube([[cx + 64, g, 3], [cx + 60, g - 60, 3]]), c: F.PLD, m: 'wood', line: 0.6 }, { p: [P(cx + 40, g - 64, 1), [cx + 60, g - 72], P(cx + 82, g - 64, 1), [cx + 60, g - 66]], c: '#8a8a94', m: 'steel', line: 0.8 });
    return out;
  }

  /* ---------- Фабрика: хранилище — водонапорная башня и рудный склад ---------- */
  function fSilo(cx, g) {
    const out = [];
    out.push(...waterTank(cx + 40, 36, 66, 116, g - 4, {}));
    out.push(brk(cx - 146, 250, cx + 10, g, {}), tinRoof(cx - 146, cx + 10, 254, 46, 10, 34));
    out.push(...awin(cx - 106, 320, 13, 38, FWIN), ...fdoor(cx - 40, g, 30, 84, { c: '#7a4a26' }));
    // рельсы и вагонетка с рудой
    out.push({ p: box(cx - 10, g - 6, cx + 150, g), c: '#4a4a52', m: 'steel', line: 0.8, lines: planks(cx - 10, g - 6, cx + 150, g, 16, true, 0.6) });
    out.push({ p: [[cx + 60, g - 60], [cx + 96, g - 72], [cx + 126, g - 62], [cx + 120, g - 50], [cx + 66, g - 50]], c: '#5a5260', m: 'horn', line: 1 }, { p: trap(cx + 94, g - 52, g - 16, 42, 34), c: '#6a6a74', m: 'steel', line: 1.1, lines: rivets(cx + 60, cx + 128, g - 44, 11) });
    out.push({ e: [cx + 72, g - 12, 10, 10], c: F.SD, m: 'steel', line: 1 }, { e: [cx + 116, g - 12, 10, 10], c: F.SD, m: 'steel', line: 1 });
    out.push({ p: [[cx + 28, g], [cx + 24, g - 22], [cx + 32, g - 40], [cx + 44, g - 42], [cx + 54, g - 30], [cx + 52, g]], c: '#e0c860', m: 'horn', line: 1 });
    return out;
  }

  /* ---------- Фабрика: особая — Литейный двор ---------- */
  function fSpecial(cx, g) {
    const out = [];
    out.push(...stack(cx + 90, 8, 150, 13, 15, { smoke: 16 }));
    out.push(brk(cx - 128, 118, cx + 128, g, { rh: 14 }), tinRoof(cx - 128, cx + 128, 122, 40, 10, 40));
    out.push({ p: box(cx - 104, 150, cx + 104, g), c: '#2a1a14', m: 'cloth', line: 1.2, ao: 1.3 });
    // конвертер на цапфах льёт металл в ковш
    out.push({ p: tube([[cx - 70, g, 6], [cx - 70, 190, 6]]), c: F.SD, m: 'steel', line: 0.8 }, { p: tube([[cx + 10, g, 6], [cx + 10, 190, 6]]), c: F.SD, m: 'steel', line: 0.8 });
    out.push({ p: [P(cx - 64, 164, 1), [cx - 72, 196], [cx - 54, 230], [cx - 20, 238], [cx + 8, 222], P(cx + 14, 186, 1), P(cx + 6, 168, 1)], c: '#5a5a64', m: 'steel', gloss: 0.8, line: 1.2, lines: rivets(cx - 62, cx + 4, 200, 11) });
    out.push({ e: [cx - 30, 200, 9, 9], c: F.BRS, m: 'gold', line: 0.8 });
    out.push({ p: tube([[cx + 12, 176, 7], [cx + 34, 186, 6], [cx + 46, 222, 5], [cx + 48, 244, 5]]), c: '#ffb040', m: 'gem', gloss: 1, rim: 0, line: 0.6, lc: '#8a2a0a' });
    out.push({ p: [P(cx + 20, 240, 1), P(cx + 84, 240, 1), [cx + 78, 266], P(cx + 26, 266, 1)], c: '#3e3e46', m: 'steel', line: 1.1, sub: [{ p: box(cx + 22, 236, cx + 82, 248), c: '#ffd070', m: 'flat', line: 0 }] });
    lit(cx + 50, 238); lit(cx - 30, 150);
    out.push({ e: [cx + 52, 236, 40, 18], c: '#ffb040', m: 'flat', line: 0, op: 0.3 });
    out.push(...gear(cx - 100, 128, 22, 9, F.BRS), ...gear(cx + 104, 150, 16, 8, F.CU));
    for (const x of [cx - 128, cx + 128]) out.push({ p: box(x - 10, 118, x + 10, g), c: F.STONE, m: 'cloth', line: 1 });
    return out;
  }

  /* ---------- Фабрика: жилища ---------- */
  const fDwell = [
    // 1. Норы полуросликов: песчаный холм с круглыми дверьми, печные трубы, ветряк-насос
    (cx, g) => {
      const out = [];
      out.push(...windmill(cx + 94, 20, g, 26));
      out.push({ p: [P(cx - 124, g, 1), [cx - 110, 170], [cx - 60, 124], [cx + 10, 112], [cx + 70, 128], [cx + 108, 174], P(cx + 120, g, 1)], c: F.SAND, m: 'cloth', line: 1.2, belly: 0.3, lines: [{ p: [[cx - 90, 160], [cx - 40, 150]], w: 2.4, a: 0.35 }, { p: [[cx + 30, 140], [cx + 80, 156]], w: 2.4, a: 0.35 }],
        sub: [{ p: [P(cx - 130, 210, 1), [cx - 60, 196], [cx, 208], [cx + 70, 196], P(cx + 130, 206, 1), P(cx + 130, g + 4, 1), P(cx - 130, g + 4, 1)], c: '#c8a870', m: 'flat', line: 0 }] });
      out.push(...pipe([[cx - 60, 130], [cx - 60, 94]], 6, { c: '#5a5a64', end: true }), ...smoke(cx - 58, 90, 9, { n: 2 }), ...pipe([[cx + 44, 124], [cx + 44, 100]], 5, { c: '#5a5a64', end: true }));
      for (const [x, r, c] of [[cx - 48, 34, '#3f7a4a'], [cx + 50, 26, F.RED]]) {
        out.push({ e: [x, g - r, r + 7, r + 7], c: '#8a6a4a', m: 'wood', line: 1 }, { p: [P(x - r, g, 1), [x - r, g - r], [x - r * 0.7, g - r * 1.7], [x, g - r * 2], [x + r * 0.7, g - r * 1.7], [x + r, g - r], P(x + r, g, 1)], c, m: 'wood', flow: -PI / 2, line: 1.1, lines: planks(x - r, g - 2 * r, x + r, g, 9, true, 0.4) }, { e: [x + r * 0.5, g - r, 3.5, 3.5], c: F.BRS, m: 'gold', line: 0.5 });
      }
      out.push(...port(cx, 176, 12, { ring: '#8a6a4a', rw: 5 }), ...port(cx + 84, 190, 10, { ring: '#8a6a4a', rw: 4 }));
      out.push(barrel(cx - 104, g, 12, 30));
      return out;
    },
    // 2. Мастерская: цех с пилообразной крышей, большая шестерня, кран-укосина
    (cx, g) => {
      const out = [];
      out.push(...stack(cx + 110, 30, 160, 11, 13, { smoke: 14 }));
      out.push(brk(cx - 134, 146, cx + 128, g, {}), ...sawRoof(cx - 134, cx + 128, 148, 44, 4));
      out.push({ p: box(cx - 80, 196, cx + 30, g), c: '#2a1a12', m: 'cloth', line: 1.2, ao: 1.2 }, { p: box(cx - 74, 204, cx + 24, g), c: '#e8a048', m: 'gem', rim: 0, gloss: 0.3, line: 0, op: 0.5 });
      lit(cx - 26, 230);
      out.push(...gear(cx - 26, 246, 26, 10, F.SD), ...gear(cx + 80, 192, 26, 11, F.BRS));
      out.push(...rwin(cx + 80, 244, 16, 16, {}));
      // кран-укосина
      out.push({ p: tube([[cx - 150, g, 6], [cx - 150, 110, 5]]), c: F.SD, m: 'steel', line: 0.8 }, { p: tube([[cx - 150, 118, 4], [cx - 82, 142, 4]]), c: F.SD, m: 'steel', line: 0.8 }, { p: tube([[cx - 150, 160, 3], [cx - 104, 132, 3]]), c: F.SD, m: 'steel', line: 0.6 });
      out.push({ p: box(cx - 90, 142, cx - 86, 190), c: '#2a2a2a', m: 'flat', line: 0 }, { p: [P(cx - 98, 190, 1), P(cx - 78, 190, 1), P(cx - 82, 214, 1), P(cx - 94, 214, 1)], c: F.CU, m: 'gold', line: 0.9 });
      out.push(crate(cx + 104, g, 30));
      return out;
    },
    // 3. Загон армадиллов: амбар с ломаной крышей и жердевая изгородь
    (cx, g) => {
      const out = [];
      out.push(...fence(cx - 10, cx + 166, g, 50, 44));
      const x0 = cx - 160, x1 = cx + 30, mid = (x0 + x1) / 2;
      out.push({ p: [P(x0, g, 1), P(x0, 150, 1), P(x0 + 26, 98, 1), P(mid, 60, 1), P(x1 - 26, 98, 1), P(x1, 150, 1), P(x1, g, 1)], c: F.RED, m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(x0, 60, x1, g, 15, true, 0.45), sub: [shadeR(x0, 60, x1, g, 0.2, '#6a1c16')] });
      out.push({ p: tube([[x0 - 8, 154, 6], [x0 + 24, 96, 6], [mid, 56, 6], [x1 - 24, 96, 6], [x1 + 8, 154, 6]]), c: F.SD, m: 'steel', line: 1 });
      out.push({ p: box(mid - 44, 190, mid + 44, g), c: '#f0e6d0', m: 'wood', line: 1.2, sub: [{ p: box(mid - 38, 196, mid + 38, g), c: F.RED, m: 'wood', line: 0.8, lines: [{ p: [[mid - 38, 196], [mid + 38, g]], w: 6, c: '#f0e6d0', a: 1 }, { p: [[mid + 38, 196], [mid - 38, g]], w: 6, c: '#f0e6d0', a: 1 }, { p: [[mid, 196], [mid, g]], w: 4, c: '#f0e6d0', a: 1 }] }] });
      out.push(...rwin(mid, 122, 14, 16, { c: WIN }));
      // корыто и тюки сена
      out.push({ p: trap(cx + 90, g - 22, g, 40, 34), c: '#8a6038', m: 'wood', flow: 0, line: 1, sub: [{ p: box(cx + 52, g - 22, cx + 128, g - 16), c: '#5a9ad8', m: 'flat', line: 0 }] });
      out.push({ p: box(cx + 36, g - 30, cx + 76, g), c: '#d8b860', m: 'fur', furLen: 0.5, flow: 0, line: 1, lines: [{ p: [[cx + 36, g - 15], [cx + 76, g - 15]], w: 2.4, c: '#8a5a20', a: 0.8 }] });
      return out;
    },
    // 4. Сборочный цех: клёпаный ангар, мостовой кран, гигантская шестерня
    (cx, g) => {
      const out = [];
      // козловой кран
      for (const x of [cx - 152, cx + 152]) out.push({ p: tube([[x, g, 7], [x, 46, 6]]), c: '#c89a2a', m: 'steel', line: 0.9, lines: [] });
      out.push(plate(cx - 164, 30, cx + 164, 56, '#c89a2a', { st: 18 }));
      out.push({ p: box(cx + 38, 56, cx + 44, 120), c: '#2a2a2a', m: 'flat', line: 0 }, { p: [P(cx + 30, 120, 1), P(cx + 52, 120, 1), [cx + 54, 136], [cx + 42, 146], P(cx + 36, 138, 1)], c: F.SD, m: 'steel', line: 0.9 });
      // ангар-полубочка
      const ribs = []; for (let x = cx - 120; x <= cx + 120; x += 30) ribs.push({ p: [[x, g], [x, 150 + Math.pow((x - cx) / 130, 2) * 90]], w: 3.4, a: 0.5 });
      out.push({ p: [P(cx - 136, g, 1), [cx - 132, 190], [cx - 92, 130], [cx, 108], [cx + 92, 130], [cx + 132, 190], P(cx + 136, g, 1)], c: '#8a8a94', m: 'steel', gloss: 0.8, line: 1.3, lines: ribs.concat(rivets(cx - 100, cx + 100, 170, 16)), sub: [{ p: [[cx + 30, 100], [cx + 150, 150], [cx + 150, g + 4], [cx + 60, g + 4]], c: '#5a5a66', m: 'flat', line: 0 }] });
      out.push({ p: box(cx - 64, 190, cx + 64, g), c: '#2a1a12', m: 'cloth', line: 1.2, ao: 1.1 }, { p: box(cx - 58, 196, cx + 58, g), c: '#f0a848', m: 'gem', rim: 0, gloss: 0.2, line: 0, op: 0.45 });
      // силуэт автоматона в воротах
      out.push({ p: [P(cx - 20, g, 1), P(cx - 22, 250, 1), P(cx - 34, 238, 1), P(cx - 30, 216, 1), P(cx - 12, 212, 1), P(cx - 12, 200, 1), P(cx + 12, 200, 1), P(cx + 12, 212, 1), P(cx + 30, 216, 1), P(cx + 34, 238, 1), P(cx + 22, 250, 1), P(cx + 20, g, 1)], c: '#3a2a20', m: 'flat', line: 0, op: 0.85 });
      lit(cx - 36, 230); lit(cx + 36, 230);
      out.push(...gear(cx, 150, 30, 12, F.BRS), ...port(cx - 96, 214, 11, {}), ...port(cx + 96, 214, 11, {}));
      return out;
    },
    // 5. Песчаная яма: воронка в песке, копёр с колесом, рельсы, рёбра червя
    (cx, g) => {
      const out = [];
      // копёр
      out.push({ p: tube([[cx - 150, g - 30, 7], [cx - 104, 60, 6]]), c: F.PLD, m: 'wood', line: 0.9 }, { p: tube([[cx - 60, g - 30, 7], [cx - 104, 60, 6]]), c: F.PLD, m: 'wood', line: 0.9 }, { p: tube([[cx - 134, 210, 4], [cx - 74, 210, 4]]), c: F.PLD, m: 'wood', line: 0.6 }, { p: tube([[cx - 124, 140, 4], [cx - 84, 140, 4]]), c: F.PLD, m: 'wood', line: 0.6 });
      out.push({ e: [cx - 104, 64, 28, 28], c: '#5a5a64', m: 'steel', line: 1.1, lines: Array.from({ length: 6 }, (_, i) => ({ p: [[cx - 104, 64], [cx - 104 + Math.cos(i * PI / 3) * 26, 64 + Math.sin(i * PI / 3) * 26]], w: 3, a: 0.7 })) });
      out.push({ p: box(cx - 106, 90, cx - 102, 250), c: '#2a2a2a', m: 'flat', line: 0 });
      // холмы песка и воронка
      out.push({ p: [P(cx - 190, g, 1), [cx - 170, 300], [cx - 110, 262], [cx - 30, 250], [cx + 60, 250], [cx + 140, 262], [cx + 184, 300], P(cx + 196, g, 1)], c: F.SAND, m: 'cloth', line: 1.2, belly: 0.25, lines: [{ p: [[cx - 150, 300], [cx - 90, 286]], w: 2.4, a: 0.35 }, { p: [[cx + 90, 286], [cx + 150, 300]], w: 2.4, a: 0.35 }] });
      out.push({ e: [cx + 20, 330, 130, 44], c: '#7a5a38', m: 'cloth', line: 1.2, ao: 1.4, sub: [{ e: [cx + 20, 344, 70, 24], c: '#2a1a10', m: 'cloth', line: 0 }] });
      // зубы пасти червя по краю норы
      for (let i = 0; i < 7; i++) { const a = PI * (0.1 + i * 0.8 / 6), x = cx + 20 - Math.cos(a) * 64, y = 344 - Math.sin(a) * 20; out.push({ p: [P(x - 6, y + 2, 1), P(x + 6, y + 2, 1), P(x, y + 18, 1)], c: '#f0e6d0', m: 'horn', line: 0.7 }); }
      out.push({ e: [cx + 20, 344, 50, 12], c: '#ff6a2a', m: 'flat', line: 0, op: 0.25 }); lit(cx + 20, 344);
      // рёбра древнего червя
      for (let i = 0; i < 4; i++) { const x = cx + 110 + i * 20; out.push({ p: tube([[x, g - 40, 6], [x + 10, 200 - i * 6, 5], [x + 30, 180 - i * 4, 3]]), c: '#ece2c8', m: 'horn', line: 0.8 }); }
      // рельсы с вагонеткой
      out.push({ p: box(cx - 196, g - 30, cx - 40, g - 24), c: '#4a4a52', m: 'steel', line: 0.8 }, { p: trap(cx - 150, g - 64, g - 34, 34, 28), c: '#6a6a74', m: 'steel', line: 1, lines: rivets(cx - 176, cx - 124, g - 56, 12) }, { p: [[cx - 176, g - 64], [cx - 150, g - 80], [cx - 124, g - 64]], c: '#e0c860', m: 'horn', line: 1 });
      return out;
    },
    // 6. Тир: двухэтажный фасад, мишени на столбах, звезда шерифа
    (cx, g) => {
      const out = [];
      out.push(...stack(cx - 150, 80, 200, 11, 13, {}));
      out.push(brd(cx - 170, 130, cx + 70, g, { p: falseTop(cx - 170, cx + 70, 98, g, 18), c: '#b88a50' }));
      out.push({ p: box(cx - 176, 150, cx + 76, 160), c: F.PLD, m: 'wood', flow: 0, line: 1 });
      // звезда шерифа
      const star = []; for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, r = i % 2 ? 13 : 30; star.push(P(cx - 50 + Math.cos(a) * r, 128 + Math.sin(a) * r, 1)); }
      out.push({ p: star, c: GOLD, m: 'gold', gloss: 1, line: 1 }, { e: [cx - 50, 128, 8, 8], c: '#f8e090', m: 'gold', line: 0.6 });
      for (const x of [cx - 130, cx + 30]) out.push(...rwin(x, 204, 18, 22, { shut: F.GRN }));
      out.push(...porch(cx - 170, cx + 70, 262, g, 4, { c: F.PLD, m: 'wood', rail: true }));
      out.push(...rwin(cx - 124, 330, 20, 24, {}), ...fdoor(cx - 36, g, 24, 88, { bat: true, frame: F.PLD }), ...rwin(cx + 36, 330, 16, 24, {}));
      // стрельбище: помост, мишени
      out.push(...fence(cx + 90, cx + 206, g, 36, 58));
      for (const [x, y, r] of [[cx + 124, 280, 26], [cx + 186, 240, 24]]) out.push({ p: tube([[x, g, 5], [x, y + r, 5]]), c: F.PLD, m: 'wood', line: 0.8 }, { e: [x, y, r, r], c: '#f0e6d0', m: 'cloth', line: 1.1, sub: [{ e: [x, y, r * 0.68, r * 0.68], c: F.RED, m: 'flat', line: 0 }, { e: [x, y, r * 0.42, r * 0.42], c: '#f0e6d0', m: 'flat', line: 0 }, { e: [x, y, r * 0.18, r * 0.18], c: F.RED, m: 'flat', line: 0 }] });
      out.push({ p: box(cx + 150, 330, cx + 158, 360), c: '#3a7a3a', m: 'gem', line: 0.6 }, { p: box(cx + 164, 334, cx + 172, 360), c: '#8a5a2a', m: 'gem', line: 0.6 }, { p: box(cx + 140, 360, cx + 180, 368), c: F.PLD, m: 'wood', line: 0.8 });
      return out;
    },
    // 7. Пернатое гнездовье: ступенчатая пирамида, медные жаровни, гнездо коатля из перьев
    (cx, g) => {
      const out = [];
      out.push(...steps(cx, g, 170, 250, 110, 4, '#caa878'));
      // лестница
      const stl = []; for (let y = 180; y < g; y += 18) stl.push({ p: [[cx - 40, y], [cx + 40, y]], w: 2.6, a: 0.55 });
      out.push({ p: trap(cx, 170, g, 30, 46), c: '#dcc096', m: 'cloth', line: 1.1, lines: stl });
      // голова змея у подножия лестницы
      for (const s of [-1, 1]) out.push({ p: [P(cx + s * 50, g, 1), P(cx + s * 50, g - 40, 1), [cx + s * 66, g - 52], P(cx + s * 86, g - 44, 1), P(cx + s * 90, g - 24, 1), P(cx + s * 74, g - 16, 1), P(cx + s * 70, g, 1)], c: '#3a9a6a', m: 'skin', line: 1, glint: [[cx + s * 72, g - 40, 4]] });
      // храм на вершине с медными гранями
      out.push({ p: box(cx - 80, 100, cx + 80, 172), c: '#c09a6a', m: 'cloth', line: 1.2, lines: masonry(cx - 80, 100, cx + 80, 172, 18, 30, 0.35), sub: [shadeR(cx - 80, 100, cx + 80, 172, 0.25, '#8a6a44')] });
      out.push({ p: box(cx - 28, 118, cx + 28, 172), c: '#2a1a10', m: 'cloth', line: 1 }, { p: box(cx - 22, 124, cx + 22, 172), c: '#ffb050', m: 'gem', rim: 0, line: 0, op: 0.55 }); lit(cx, 146);
      out.push(plate(cx - 90, 88, cx + 90, 104, F.CU, { st: 16 }));
      // гнездо из перьев
      const FE = ['#2f8a4a', '#c8322a', '#3fa06a', '#e0a030', '#2a6a9a'];
      for (let i = 0; i < 13; i++) { const a = PI * (1.05 + i * 0.9 / 12), L = 54 + (i % 3) * 16, x = cx + Math.cos(a) * 60, y = 90; out.push({ p: K.leaf([x, y], a, L, 16).body, c: FE[i % FE.length], m: 'feather', texSize: 0.5, line: 0.8 }); }
      out.push({ p: [P(cx - 96, 92, 1), [cx - 70, 70], [cx, 62], [cx + 70, 70], P(cx + 96, 92, 1), [cx, 104]], c: '#8a6a3a', m: 'wood', flow: 0.2, line: 1.1 });
      // жаровни
      for (const x of [cx - 190, cx + 190]) { out.push({ p: tube([[x, 250, 6], [x, 200, 5]]), c: F.CU, m: 'gold', line: 0.8 }, { p: trap(x, 186, 204, 22, 14), c: F.CU, m: 'gold', line: 1 }, ...flame(x, 188, 16, 38)); lit(x, 176); }
      return out;
    },
  ];

  /* ---------- Фабрика: укрепления — кирпичные ворота с клёпаными створками ---------- */
  function fGate(cx, g, top, o) {
    o = o || {}; const out = [];
    out.push(brk(cx - 90, top, cx + 90, g, { rh: 16, k: 0.2 }));
    const mer = [P(cx - 100, top + 12, 1)]; for (let x = cx - 100; x < cx + 96; x += 40) mer.push(P(x, top - 22, 1), P(x + 24, top - 22, 1), P(x + 24, top, 1), P(x + 40, top, 1));
    mer.push(P(cx + 100, top - 22, 1), P(cx + 100, top + 12, 1));
    out.push({ p: mer, c: F.BR, m: 'cloth', line: 1.2, lines: [{ p: [[cx - 100, top + 6], [cx + 100, top + 6]], w: 5, c: F.SD, a: 0.9 }] });
    const h = Math.min(150, (g - top) * 0.72);
    out.push({ p: arch(cx, g, 58, h + 10), c: F.STONE, m: 'cloth', line: 1.1 }, { p: arch(cx, g, 48, h), c: '#2a2a32', m: 'steel', gloss: 0.6, line: 1.2, lines: [{ p: [[cx, g - h], [cx, g]], w: 3.4, a: 0.9 }].concat(rivets(cx - 40, cx + 40, g - h * 0.3, 10, '#b8b0a0'), rivets(cx - 40, cx + 40, g - h * 0.65, 10, '#b8b0a0')), sub: [{ p: box(cx - 50, g - h * 0.72, cx + 50, g - h * 0.58), c: '#5a5a64', m: 'flat', line: 0 }, { p: box(cx - 50, g - h * 0.37, cx + 50, g - h * 0.23), c: '#5a5a64', m: 'flat', line: 0 }] });
    out.push(...gear(cx, top + 36, 24, 10, F.BRS));
    for (const s of [-1, 1]) { out.push(...rwin(cx + s * 62, top + 40, 8, 14, {})); }
    return out;
  }
  function fWallSeg(x0, x1, g, top) {
    const mer = [P(x0, top + 12, 1)]; for (let x = x0; x < x1 - 10; x += 36) mer.push(P(x, top - 18, 1), P(x + 20, top - 18, 1), P(x + 20, top, 1), P(x + 36, top, 1));
    mer.push(P(x1, top, 1), P(x1, top + 12, 1));
    return [brk(x0, top, x1, g, { rh: 16, k: 0.04 }), { p: mer, c: F.BR, m: 'cloth', line: 1.1 }];
  }
  function fTower(x, g, top, hw) {
    const out = [brk(x - hw, top, x + hw, g, { k: 0.32 }), { p: box(x - hw - 8, top - 10, x + hw + 8, top + 6), c: F.SD, m: 'steel', line: 1, lines: rivets(x - hw - 2, x + hw + 2, top - 2, 12) }];
    out.push(...waterTank(x, top - 110, hw * 0.8, 70, top - 8, { spout: false }));
    out.push(...awin(x, top + 90, 11, 32, FWIN), ...awin(x, top + 190, 11, 32, FWIN));
    return out;
  }

  /* =================================== УЛЕЙ ===================================
     Восковые купола в кольцах, соты, хитиновые шипы, янтарь и светящиеся ячейки. */
  const Hv = { WAX: '#d8b048', WAXL: '#e8c868', WAXD: '#9a7428', CH: '#4e5e1c', CHL: '#7a8a2a', AMB: '#ffb020', RES: '#8a5a18', HON: '#f0a020', ACID: '#9ae040', EARTH: '#8a6a44', MAG: '#e0a8ff' };
  /** Восковой купол-улей: кольца, сбоку соты; o { c, comb, band } */
  function wdome(cx, base, hw, h, o) {
    o = o || {}; const c = o.c || Hv.WAX, lines = [];
    for (let y = base - 20; y > base - h + 14; y -= o.band || 26) { const k = Math.sqrt(Math.max(0, 1 - Math.pow((base - y) / h, 2))); lines.push({ p: [[cx - hw * k * 1.02, y], [cx, y + 10 * k], [cx + hw * k * 1.02, y]], w: o.bw || 3.2, c: o.bc, a: 0.5 }); }
    if (o.comb) lines.push(...combLines(cx - hw * 0.75, base - h * 0.78, cx - hw * 0.05, base - h * 0.3, 11, 0.35));
    return { p: [P(cx - hw, base, 1), [cx - hw * 1.03, base - h * 0.42], [cx - hw * 0.8, base - h * 0.8], [cx - hw * 0.3, base - h * 0.99], [cx, base - h], [cx + hw * 0.3, base - h * 0.99], [cx + hw * 0.8, base - h * 0.8], [cx + hw * 1.03, base - h * 0.42], P(cx + hw, base, 1), [cx, base + 6]], c, m: 'leather', gloss: 0.5, line: 1.2, belly: 0.3, lines,
      sub: [{ p: [[cx + hw * 0.3, base - h * 1.06], [cx + hw * 1.12, base - h * 0.5], [cx + hw * 1.12, base + 8], [cx + hw * 0.42, base + 8]], c: tone(c, -0.28), m: 'flat', line: 0 }] };
  }
  /** Светящаяся ячейка-сота (окно). */
  function cell(cx, cy, r, o) {
    o = o || {}; if (o.lit !== false) lit(cx, cy);
    return { p: hexPts(cx, cy, r), c: o.c || '#ffc040', m: 'gem', gloss: 0.9, rim: 0, line: 1.1, lc: o.lc || '#5a3a08', sub: [{ p: hexPts(cx - r * 0.2, cy - r * 0.22, r * 0.45), c: o.core || '#fff0b0', m: 'flat', line: 0 }] };
  }
  /** Хитиновый шип с кольцами и янтарной сферой на острие. */
  function hspire(x, base, h, w, c, orb) {
    const out = [{ p: [P(x - w, base, 1), [x - w * 0.8, base - h * 0.4], [x - w * 0.3, base - h * 0.8], P(x + w * 0.1, base - h, 1), [x + w * 0.4, base - h * 0.6], [x + w * 0.85, base - h * 0.3], P(x + w, base, 1)], c: c || Hv.CH, m: 'horn', gloss: 0.8, line: 1,
      lines: [0.2, 0.36, 0.52, 0.68].map(t => ({ p: [[x - w * (1 - t) * 0.95, base - h * t], [x + w * 0.1 * t, base - h * t + 6], [x + w * (1 - t) * 0.95, base - h * t]], w: 2.4, a: 0.55 })) }];
    if (orb) { out.push({ e: [x + w * 0.1, base - h - 9, 11, 12], c: orb, m: 'gem', gloss: 1.1, line: 0.8, lc: '#6a3a08', glint: [[x + w * 0.1 - 3, base - h - 13, 4]] }); lit(x + w * 0.1, base - h - 9); }
    return out;
  }
  /** Проход-зев: смоляная кайма, тёмная глубина, тёплый свет изнутри. */
  function hdoor(cx, base, w, h, o) {
    o = o || {}; lit(cx, base - h * 0.4);
    return [{ p: arch(cx, base + 2, w + 10, h + 10), c: o.rim || Hv.RES, m: 'horn', gloss: 0.5, line: 1.1 },
      { p: arch(cx, base, w, h), c: '#2a1406', m: 'cloth', ao: 1.4, line: 1, sub: [{ e: [cx, base - h * 0.2, w * 0.8, h * 0.4], c: o.glow || '#ffa030', m: 'flat', line: 0, op: 0.55 }] }];
  }
  /** Жвалы-арка у входа: изогнутые хитиновые клыки. */
  function mandibles(cx, base, w, L, c) {
    return [-1, 1].map(s => ({ p: tube([[cx + s * w, base, 16], [cx + s * (w + L * 0.18), base - L * 0.5, 14], [cx + s * w * 0.7, base - L * 0.92, 8], [cx + s * w * 0.25, base - L * 0.86, 2]]), c: c || Hv.CH, m: 'horn', gloss: 0.9, line: 1 }));
  }
  /** Капля воска/мёда. */
  const drip = (x, y, l, c) => ({ p: tube([[x, y, 10], [x, y + l * 0.7, 8], [x, y + l, 9]]), c: c || Hv.HON, m: 'gem', gloss: 0.9, rim: 0, line: 0.6, lc: '#7a4a08' });
  /** Усик с огоньком. */
  const antenna = (x, y, dx, L, c) => [{ p: tube([[x, y, 5], [x + dx * 0.3, y - L * 0.6, 3.5], [x + dx, y - L, 2.5]]), c: c || Hv.CH, m: 'horn', line: 0.7 }, { e: [x + dx, y - L - 4, 7, 7], c: Hv.AMB, m: 'gem', gloss: 1, line: 0.7 }];
  /** Прозрачное крыло: основание, угол, длина, ширина. */
  function hwing(x, y, ang, L, W) {
    const lf = K.leaf([x, y], ang, L, W).body;
    return { p: lf, c: '#d8eef0', m: 'gem', gloss: 1, rim: 0.4, line: 0.8, lc: '#5a7a80', op: 0.55, lines: [0.3, 0.55, 0.8].map(t => ({ p: [[x, y], [x + Math.cos(ang) * L * t + Math.sin(ang) * W * 0.3, y + Math.sin(ang) * L * t - Math.cos(ang) * W * 0.3]], w: 2, c: '#5a7a80', a: 0.7 })) };
  }
  /** Яйцо: полупрозрачное, светится изнутри. */
  const egg = (x, y, rx, ry, c) => { lit(x, y); return { e: [x, y, rx, ry], c: c || '#f4e0a0', m: 'gem', gloss: 1, rim: 0.5, line: 0.9, lc: '#7a5a20', sub: [{ e: [x - rx * 0.1, y + ry * 0.15, rx * 0.5, ry * 0.45], c: '#ffb040', m: 'flat', line: 0, op: 0.6 }] }; };
  /** Смоляной пояс-обод. */
  const resinBand = (x0, x1, y, h) => ({ p: [P(x0, y + h / 2, 1), [x0 + 10, y - h / 2], [(x0 + x1) / 2, y - h / 2 - 4], [x1 - 10, y - h / 2], P(x1, y + h / 2, 1), [(x0 + x1) / 2, y + h / 2 + 4]], c: Hv.RES, m: 'horn', gloss: 0.6, line: 1 });

  /* ---------- Улей: ратуша — купол совета, растёт ярусами ---------- */
  function hHall(level) {
    return (cx, g) => {
      const out = [];
      if (level === 1) {
        out.push(...hspire(cx - 156, g, 200, 16, Hv.CH, Hv.AMB), ...hspire(cx + 160, g, 150, 14, Hv.CHL, null));
        out.push(wdome(cx, g, 140, 238, { comb: true }), resinBand(cx - 142, cx + 142, g - 16, 16));
        out.push(cell(cx - 64, g - 140, 15), cell(cx + 56, g - 160, 15), cell(cx + 4, g - 196, 13));
        out.push(...hdoor(cx, g, 34, 96), ...mandibles(cx, g, 44, 130));
        out.push(drip(cx - 104, g - 110, 30), drip(cx + 96, g - 120, 24));
        out.push(...antenna(cx - 8, g - 234, -26, 60), ...antenna(cx + 8, g - 234, 30, 54));
      } else if (level === 2) {
        out.push(...hspire(cx + 180, g - 10, 280, 18, Hv.CH, Hv.AMB), ...hspire(cx - 200, g - 10, 200, 14, Hv.CHL, null));
        out.push(wdome(cx - 124, g, 84, 160, {}), cell(cx - 130, g - 90, 13));
        out.push(wdome(cx + 20, g, 156, 310, { comb: true }), resinBand(cx - 136, cx + 176, g - 16, 16));
        for (const [x, y, r] of [[cx - 50, g - 190, 16], [cx + 80, g - 210, 16], [cx + 16, g - 260, 14], [cx + 104, g - 120, 15], [cx - 70, g - 110, 15]]) out.push(cell(x, y, r));
        out.push(...hdoor(cx + 14, g, 38, 110), ...mandibles(cx + 14, g, 50, 150));
        out.push(drip(cx - 120, g - 150, 30), drip(cx + 150, g - 170, 26), drip(cx + 40, g - 300, 22));
        out.push(...antenna(cx + 10, g - 306, -34, 70), ...antenna(cx + 30, g - 306, 34, 64));
      } else if (level === 3) {
        for (const s of [-1, 1]) out.push(...hspire(cx + s * 222, g - 6, 330, 20, Hv.CH, Hv.AMB));
        out.push(wdome(cx, g - 170, 118, 206, { comb: true }), resinBand(cx - 120, cx + 120, g - 184, 16));
        out.push(wdome(cx, g, 204, 214, {}), resinBand(cx - 206, cx + 206, g - 16, 18));
        for (const [x, y, r] of [[cx - 40, g - 300, 15], [cx + 44, g - 270, 15], [cx - 130, g - 90, 16], [cx + 130, g - 90, 16], [cx - 80, g - 160, 15], [cx + 84, g - 150, 15]]) out.push(cell(x, y, r));
        out.push(...hdoor(cx, g, 42, 118), ...mandibles(cx, g, 54, 160));
        out.push(drip(cx - 170, g - 110, 34), drip(cx + 176, g - 100, 30), drip(cx - 90, g - 330, 22));
        out.push(...antenna(cx - 10, g - 372, -36, 70), ...antenna(cx + 10, g - 372, 36, 70));
      } else {
        // великий улей: крылья за спиной, три яруса, корона шипов
        out.push(hwing(cx - 20, g - 380, -PI * 0.86, 230, 90), hwing(cx + 20, g - 380, -PI * 0.14, 230, 90));
        for (const s of [-1, 1]) out.push(...hspire(cx + s * 244, g - 4, 450, 22, Hv.CH, Hv.AMB), ...hspire(cx + s * 196, g - 60, 250, 14, Hv.CHL, null));
        out.push(wdome(cx, g - 340, 92, 150, {}));
        out.push(wdome(cx, g - 190, 156, 196, { comb: true }), resinBand(cx - 158, cx + 158, g - 200, 16));
        out.push(wdome(cx, g, 232, 226, {}), resinBand(cx - 234, cx + 234, g - 16, 18));
        for (let i = 0; i < 5; i++) { const x = cx - 64 + i * 32, h = i === 2 ? 80 : 54; out.push({ p: [P(x - 12, g - 470, 1), [x - 6, g - 470 - h * 0.6], P(x, g - 470 - h, 1), [x + 6, g - 470 - h * 0.6], P(x + 12, g - 470, 1)], c: Hv.CH, m: 'horn', gloss: 0.9, line: 1 }, { e: [x, g - 470 - h, 7, 7], c: Hv.AMB, m: 'gem', line: 0.7 }); }
        out.push({ p: box(cx - 80, g - 478, cx + 80, g - 464), c: GOLD, m: 'gold', line: 1 });
        for (const [x, y, r] of [[cx, g - 410, 14], [cx - 70, g - 300, 16], [cx + 70, g - 300, 16], [cx - 20, g - 250, 15], [cx - 150, g - 100, 17], [cx + 150, g - 100, 17], [cx - 100, g - 170, 16], [cx + 100, g - 170, 16]]) out.push(cell(x, y, r));
        out.push(...hdoor(cx, g, 46, 130), ...mandibles(cx, g, 60, 180));
        out.push(drip(cx - 196, g - 110, 36), drip(cx + 200, g - 110, 32), drip(cx - 130, g - 250, 26), drip(cx + 136, g - 240, 26));
      }
      return out;
    };
  }

  /* ---------- Улей: гильдия — термитный шпиль из восковых колец ---------- */
  function hGuild(level) {
    return (cx, g) => {
      const out = [], top = 150, n = level + 2, sh = (g - top) / n;
      if (level >= 3) for (const s of [-1, 1]) out.push(...hspire(cx + s * 76, g, 200 + level * 30, 14, Hv.CHL, null));
      for (let i = 0; i < n; i++) {
        const yb = g - i * sh, yt = yb - sh - 10, hb = 86 - i * (40 / n), ht = 86 - (i + 1) * (40 / n), hm = (hb + ht) / 2 + 10, ym = (yb + yt) / 2;
        const c = i % 2 ? Hv.WAX : Hv.WAXL;
        out.push({ p: [P(cx - hb, yb, 1), [cx - hm, ym], P(cx - ht, yt, 1), [cx, yt - 4], P(cx + ht, yt, 1), [cx + hm, ym], P(cx + hb, yb, 1), [cx, yb + 6]], c, m: 'leather', gloss: 0.5, line: 1.2, belly: 0.35,
          lines: [{ p: [[cx - hm, ym], [cx, ym + 8], [cx + hm, ym]], w: 3, a: 0.4 }], sub: [{ p: [[cx + hm * 0.35, yt - 6], [cx + hm + 12, yt], [cx + hm + 12, yb + 8], [cx + hm * 0.45, yb + 8]], c: tone(c, -0.3), m: 'flat', line: 0 }] });
      }
      for (let i = 1; i < n; i++) { const y = g - i * sh - sh * 0.5; out.push(cell(cx + (i % 2 ? -14 : 14), y, 15, { c: Hv.MAG, lc: '#4a1a5a', core: '#fbe8ff' })); }
      out.push(...hdoor(cx, g, 26, Math.min(88, sh * 0.8), { glow: '#d890ff' }));
      out.push({ p: domeP(cx, top + 4, 48, 40), c: Hv.RES, m: 'horn', gloss: 0.8, line: 1.1 });
      out.push(...antenna(cx - 10, top - 30, -40, 70 + level * 12, Hv.CH), ...antenna(cx + 10, top - 30, 40, 64 + level * 12, Hv.CH));
      out.push({ e: [cx, top - 30, 16, 16], c: Hv.MAG, m: 'gem', gloss: 1.2, line: 0.9, lc: '#4a1a5a', glint: [[cx - 5, top - 36, 5]] }, { e: [cx, top - 30, 34, 30], c: '#e8b8ff', m: 'flat', line: 0, op: 0.25 });
      lit(cx, top - 30);
      for (let i = 0; i < level; i++) out.push(drip(cx + (i % 2 ? 60 : -62) - i * 3, g - (i + 1) * sh - 4, 22 + i * 4));
      return out;
    };
  }

  /* ---------- Улей: таверна — медовуха ---------- */
  function hTavern(cx, g) {
    const out = [];
    out.push({ p: tube([[cx + 30, g - 170, 16], [cx + 34, 40, 12]]), c: Hv.CH, m: 'horn', gloss: 0.7, line: 1, lines: [0.3, 0.6].map(t => ({ p: [[cx + 18, g - 170 - (g - 210) * t], [cx + 46, g - 170 - (g - 210) * t]], w: 3, a: 0.6 })) });
    out.push(wdome(cx - 24, g, 130, 210, { comb: true }), resinBand(cx - 156, cx + 108, g - 16, 16));
    // бочонок-горшок мёда
    out.push(wdome(cx + 120, g, 50, 100, { c: '#c88a30', band: 18 }), { p: box(cx + 94, g - 108, cx + 146, g - 94), c: Hv.RES, m: 'horn', line: 1 });
    out.push(drip(cx + 100, g - 94, 36, Hv.HON), drip(cx + 130, g - 94, 24, Hv.HON));
    out.push(cell(cx - 90, g - 110, 16), cell(cx + 30, g - 120, 16), cell(cx - 30, g - 170, 14));
    out.push(...hdoor(cx - 24, g, 30, 86));
    // вывеска-цветок на хитиновом кронштейне
    out.push({ p: tube([[cx - 150, g - 150, 6], [cx - 190, g - 158, 5]]), c: Hv.CH, m: 'horn', line: 0.7 }, { p: box(cx - 186, g - 158, cx - 184, g - 132), c: '#2a2a1a', m: 'flat', line: 0 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; out.push({ e: [cx - 185 + Math.cos(a) * 12, g - 116 + Math.sin(a) * 12, 10, 10], c: '#e86a9a', m: 'cloth', line: 0.8 }); }
    out.push({ e: [cx - 185, g - 116, 8, 8], c: Hv.AMB, m: 'gem', line: 0.7 });
    out.push({ p: tube([[cx - 170, g, 7], [cx - 170, g - 30, 7]]), c: Hv.CH, m: 'horn', line: 0.7 }, { p: box(cx - 196, g - 36, cx - 144, g - 26), c: Hv.RES, m: 'horn', line: 0.9 });
    return out;
  }

  /* ---------- Улей: кузница — смоляной горн с кислотным огнём ---------- */
  function hSmith(cx, g) {
    const out = [];
    out.push({ p: tube([[cx + 80, g - 150, 26], [cx + 86, 70, 20], [cx + 92, 24, 24]]), c: Hv.CH, m: 'horn', gloss: 0.8, line: 1.1, lines: [0.25, 0.5, 0.75].map(t => ({ p: [[cx + 62, g - 150 - (g - 174) * t], [cx + 110, g - 150 - (g - 174) * t]], w: 3.4, a: 0.55 })) });
    out.push({ p: [P(cx - 150, g, 1), [cx - 146, g - 110], [cx - 110, g - 180], [cx - 30, g - 210], [cx + 50, g - 200], [cx + 116, g - 150], [cx + 140, g - 70], P(cx + 146, g, 1)], c: '#a07030', m: 'leather', gloss: 0.4, line: 1.2, belly: 0.3,
      lines: combLines(cx + 20, g - 190, cx + 130, g - 60, 10, 0.3), sub: [{ p: [[cx + 40, g - 220], [cx + 160, g - 150], [cx + 160, g + 6], [cx + 70, g + 6]], c: '#6e4a1c', m: 'flat', line: 0 }] });
    out.push({ p: arch(cx - 30, g, 50, 120), c: '#1a1206', m: 'cloth', ao: 1.4, line: 1.2 }, { e: [cx - 30, g - 22, 40, 20], c: Hv.ACID, m: 'gem', gloss: 1, line: 0, sub: [{ e: [cx - 34, g - 22, 22, 10], c: '#e8ffb0', m: 'flat', line: 0 }] });
    out.push(...flame(cx - 30, g - 30, 26, 56, { c: '#8ad838', core: '#e8ffb0', lc: '#2a5a0a' })); lit(cx - 30, g - 56);
    out.push(...mandibles(cx - 30, g, 62, 150));
    // панцири-щиты на стене и наковальня из жука
    for (const [x, y] of [[cx + 70, g - 110], [cx + 110, g - 60]]) out.push({ p: [P(x - 18, y - 24, 1), [x, y - 30], P(x + 18, y - 24, 1), [x + 16, y + 6], [x, y + 22], [x - 16, y + 6]], c: Hv.CH, m: 'horn', gloss: 1, line: 1, lines: [{ p: [[x, y - 28], [x, y + 20]], w: 2.4, a: 0.6 }] });
    out.push({ p: [P(cx - 160, g, 1), [cx - 166, g - 30], [cx - 140, g - 50], [cx - 100, g - 48], [cx - 84, g - 26], P(cx - 90, g, 1)], c: '#3a4a18', m: 'horn', gloss: 1, line: 1, lines: [{ p: [[cx - 150, g - 40], [cx - 96, g - 38]], w: 2.4, light: true, a: 0.5 }] });
    out.push(cell(cx + 30, g - 170, 14));
    return out;
  }

  /* ---------- Улей: рынок — лепестковые навесы на стеблях ---------- */
  function hMarket(cx, g) {
    const out = [];
    out.push(wdome(cx, g - 20, 90, 150, { comb: true }), cell(cx - 30, g - 100, 13), cell(cx + 32, g - 110, 13));
    const stall = (x, y, r, c, c2) => {
      const o = [{ p: tube([[x, g, 8], [x, y + 10, 6]]), c: Hv.CHL, m: 'horn', line: 0.8 }];
      for (let i = 0; i < 7; i++) { const a = PI + i * PI / 6; o.push({ e: [x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.28 + 6, r * 0.42, r * 0.22], c: i % 2 ? c : c2, m: 'cloth', line: 0.9 }); }
      o.push({ e: [x, y + 4, r * 0.3, r * 0.14], c: Hv.AMB, m: 'gem', line: 0.7 });
      return o;
    };
    out.push(...stall(cx - 124, 124, 86, '#e86a9a', '#f4a0c0'), ...stall(cx + 124, 116, 86, '#f0a030', '#ffd060'));
    // прилавки: соты с мёдом, янтарь, пыльца
    out.push({ p: box(cx - 176, g - 40, cx - 84, g), c: Hv.RES, m: 'horn', line: 1, lines: combLines(cx - 176, g - 40, cx - 84, g, 8, 0.4) });
    for (const x of [cx - 160, cx - 130, cx - 100]) out.push({ p: [P(x - 10, g - 40, 1), [x - 12, g - 56], [x, g - 66], [x + 12, g - 56], P(x + 10, g - 40, 1)], c: Hv.HON, m: 'gem', gloss: 1, line: 0.8 });
    out.push({ p: box(cx + 84, g - 40, cx + 176, g), c: Hv.RES, m: 'horn', line: 1 });
    for (const [x, c] of [[cx + 104, '#ffe060'], [cx + 132, '#d8f060'], [cx + 158, '#ffe060']]) out.push({ e: [x, g - 50, 14, 12], c, m: 'fur', furLen: 0.4, line: 0.9 });
    out.push(...hdoor(cx, g, 22, 60));
    return out;
  }

  /* ---------- Улей: хранилище — башня медовых сот ---------- */
  function hSilo(cx, g) {
    const out = [], x0 = cx - 96, x1 = cx + 96, top = 110;
    out.push({ p: trap(cx, top, g, 82, 100), c: Hv.WAX, m: 'leather', gloss: 0.4, line: 1.2, belly: 0.2, lines: combLines(x0, top, x1, g, 18, 0.55, 2.6), sub: [shadeR(x0, top, x1, g, 0.28, Hv.WAXD)] });
    // заполненные мёдом ячейки
    const R = 18;
    for (const [i, j, lt] of [[0, 1, 1], [1, 2, 0], [-1, 3, 1], [1, 4, 0], [0, 5, 1], [-1, 6, 0], [1, 7, 1], [0, 9, 0], [-1, 10, 1], [1, 11, 0]]) {
      const x = cx + i * R * 3 + (j % 2) * R * 1.5 - R * 0.75, y = top + j * R * 1.56;
      if (y > g - 20) continue;
      out.push({ p: hexPts(x, y, R - 3), c: lt ? '#ffc040' : Hv.HON, m: 'gem', gloss: 0.8, rim: 0, line: 0.8, lc: '#6a3a08' }); if (lt) lit(x, y);
    }
    out.push(wdome(cx, top + 10, 92, 80, { band: 20 }), ...hspire(cx, top - 60, 70, 12, Hv.CH, Hv.AMB));
    out.push(drip(cx - 70, top + 20, 40), drip(cx + 60, top + 26, 30), drip(cx - 10, top + 30, 24));
    out.push(...hdoor(cx, g, 26, 70));
    for (const x of [cx - 128, cx + 126]) out.push({ p: [P(x - 18, g, 1), [x - 22, g - 26], P(x - 12, g - 44, 1), P(x + 12, g - 44, 1), [x + 22, g - 26], P(x + 18, g, 1)], c: Hv.HON, m: 'gem', gloss: 0.9, line: 1, lc: '#6a3a08', sub: [{ p: box(x - 13, g - 50, x + 13, g - 40), c: Hv.RES, m: 'horn', line: 0.6 }] });
    return out;
  }

  /* ---------- Улей: особая — Инкубатор: прозрачный купол с яйцами ---------- */
  function hSpecial(cx, g) {
    const out = [];
    out.push({ e: [cx, g - 90, 110, 90], c: '#ffb040', m: 'flat', line: 0, op: 0.35 });
    for (const [x, y, r] of [[cx - 50, g - 50, 22], [cx, g - 44, 26], [cx + 50, g - 50, 22], [cx - 26, g - 94, 20], [cx + 26, g - 96, 20], [cx, g - 136, 18]]) out.push(egg(x, y, r * 0.8, r));
    out.push({ p: domeP(cx, g - 24, 112, 190), c: '#e8f0d8', m: 'gem', gloss: 1.2, rim: 0.6, line: 1.1, lc: '#6a6a3a', op: 0.42 });
    for (const k of [-0.7, -0.25, 0.25, 0.7]) out.push({ p: tube([[cx + k * 116, g - 24, 9], [cx + k * 106, g - 110, 8], [cx + k * 70, g - 180, 6], [cx + k * 20, g - 212, 4]]), c: Hv.CH, m: 'horn', gloss: 0.9, line: 0.9 });
    out.push({ p: [P(cx - 128, g, 1), P(cx - 124, g - 34, 1), [cx, g - 40], P(cx + 124, g - 34, 1), P(cx + 128, g, 1)], c: Hv.WAX, m: 'leather', gloss: 0.4, line: 1.2, lines: combLines(cx - 128, g - 40, cx + 128, g, 9, 0.45) });
    out.push(...antenna(cx - 4, g - 212, -30, 50), ...antenna(cx + 4, g - 212, 30, 50));
    out.push(drip(cx - 100, g - 30, 20), drip(cx + 96, g - 30, 18));
    return out;
  }

  /* ---------- Улей: жилища ---------- */
  const hDwell = [
    // 1. Кладка: яйца в восковой колыбели, стенка сот
    (cx, g) => {
      const out = [];
      out.push({ p: [P(cx - 100, g, 1), P(cx - 110, 130, 1), [cx - 60, 96], [cx, 86], [cx + 60, 96], P(cx + 110, 130, 1), P(cx + 100, g, 1)], c: Hv.WAXD, m: 'leather', gloss: 0.3, line: 1.1, lines: combLines(cx - 110, 86, cx + 110, g, 13, 0.5) });
      out.push(cell(cx - 60, 124, 12), cell(cx + 62, 130, 12));
      for (const [x, y, r] of [[cx - 50, g - 50, 26], [cx + 50, g - 50, 26], [cx, g - 56, 30], [cx - 24, g - 100, 24], [cx + 26, g - 100, 24], [cx, g - 138, 20]]) out.push(egg(x, y, r * 0.78, r));
      out.push({ p: [P(cx - 118, g - 44, 1), [cx - 100, g - 10], [cx, g + 2], [cx + 100, g - 10], P(cx + 118, g - 44, 1), [cx + 86, g - 30], [cx, g - 22], [cx - 86, g - 30]], c: Hv.WAX, m: 'leather', gloss: 0.5, line: 1.1 });
      out.push(drip(cx - 80, g - 30, 18), drip(cx + 70, g - 28, 22));
      return out;
    },
    // 2. Рабочий тоннель: земляной муравейник с ходами
    (cx, g) => {
      const out = [];
      out.push(...hspire(cx + 120, g, 150, 12, Hv.CHL, null));
      out.push({ p: [P(cx - 150, g, 1), [cx - 120, g - 90], [cx - 60, g - 180], P(cx - 4, g - 236, 1), [cx + 50, g - 190], [cx + 110, g - 100], P(cx + 148, g, 1)], c: Hv.EARTH, m: 'cloth', line: 1.2, belly: 0.3,
        lines: [[-110, 60], [-60, 120], [30, 150], [80, 80], [-20, 40]].map(([dx, dy]) => ({ p: [[cx + dx, g - dy], [cx + dx + 30, g - dy - 6]], w: 2.4, a: 0.4 })), sub: [{ p: [[cx + 20, g - 240], [cx + 170, g - 60], [cx + 170, g + 6], [cx + 60, g + 6]], c: '#5e4628', m: 'flat', line: 0 }] });
      for (const [x, y, r] of [[cx - 50, g - 120, 16], [cx + 40, g - 160, 13], [cx - 6, g - 206, 11]]) { out.push({ e: [x, y, r + 7, r + 5], c: Hv.WAX, m: 'leather', line: 1 }, { e: [x, y + 2, r, r * 0.8], c: '#1a1006', m: 'cloth', ao: 1.2, line: 0.8 }); lit(x, y); }
      out.push(...hdoor(cx, g, 30, 76, { rim: Hv.WAX }));
      out.push({ p: [P(cx - 170, g, 1), [cx - 160, g - 24], [cx - 136, g - 32], [cx - 116, g - 18], P(cx - 106, g, 1)], c: '#9a7a50', m: 'cloth', line: 1 }, { p: [P(cx + 80, g, 1), [cx + 90, g - 20], [cx + 110, g - 24], P(cx + 126, g, 1)], c: '#9a7a50', m: 'cloth', line: 1 });
      return out;
    },
    // 3. Кислотная яма: кольцо хитиновых клыков, светящаяся зелёная кислота
    (cx, g) => {
      const out = [];
      for (const s of [-1, 1]) out.push(...hspire(cx + s * 120, g - 50, 190, 16, Hv.CH, Hv.ACID));
      out.push({ e: [cx, g - 56, 158, 56], c: '#6a5030', m: 'cloth', line: 1.2, ao: 1.2 });
      out.push({ e: [cx, g - 48, 120, 36], c: Hv.ACID, m: 'gem', gloss: 1.1, rim: 0, line: 1, lc: '#2a5a0a', sub: [{ e: [cx - 20, g - 52, 60, 14], c: '#d8ff90', m: 'flat', line: 0, op: 0.7 }] });
      lit(cx, g - 50); lit(cx - 70, g - 48); lit(cx + 70, g - 48);
      out.push({ e: [cx, g - 60, 150, 60], c: '#b8ff60', m: 'flat', line: 0, op: 0.18 });
      for (const [x, y, r] of [[cx - 40, g - 58, 8], [cx + 30, g - 44, 6], [cx + 70, g - 56, 5]]) out.push({ e: [x, y, r, r], c: '#e8ffb0', m: 'gem', gloss: 1, line: 0.6 });
      // передняя кромка и клыки
      out.push({ p: [P(cx - 162, g - 50, 1), [cx - 120, g - 14], [cx, g + 2], [cx + 120, g - 14], P(cx + 162, g - 50, 1), [cx + 120, g - 26], [cx, g - 12], [cx - 120, g - 26]], c: Hv.EARTH, m: 'cloth', line: 1.1 });
      for (let i = 0; i < 7; i++) { const t = i / 6, x = cx - 140 + t * 280, y = g - 20 - Math.sin(t * PI) * 8 - (i % 2 ? 0 : 10), s = x < cx ? 1 : -1; out.push({ p: tube([[x, y, 14], [x + s * 6, y - 44, 9], [x + s * 22, y - 70, 2]]), c: i % 2 ? Hv.CH : Hv.CHL, m: 'horn', gloss: 0.9, line: 0.9 }); }
      out.push(...skull(cx - 150, g - 12, 12));
      return out;
    },
    // 4. Осиное гнездо: бумажное гнездо на суку сухого дерева
    (cx, g) => {
      const out = [];
      out.push({ p: tube([[cx - 110, g, 26], [cx - 110, 150, 18], [cx - 96, 70, 12], [cx - 90, 30, 6]]), c: '#6a5a44', m: 'wood', flow: -PI / 2, line: 1 });
      out.push({ p: tube([[cx - 104, 90, 14], [cx, 64, 10], [cx + 110, 60, 7], [cx + 150, 44, 3]]), c: '#6a5a44', m: 'wood', line: 0.9 }, { p: tube([[cx - 110, 170, 10], [cx - 160, 130, 5]]), c: '#6a5a44', m: 'wood', line: 0.8 });
      const nest = (x, y, rx, ry) => {
        const lines = []; for (let k = 1; k < 6; k++) { const yy = y + ry * (k / 3 - 1); const w = rx * Math.sqrt(Math.max(0, 1 - Math.pow((yy - y) / ry, 2))); lines.push({ p: [[x - w, yy], [x - w * 0.5, yy + 8], [x, yy + 2], [x + w * 0.5, yy + 8], [x + w, yy]], w: 3, a: 0.45 }); }
        return [{ p: [P(x - 8, y - ry - 6, 1), [x - rx * 0.7, y - ry * 0.7], [x - rx, y], [x - rx * 0.7, y + ry * 0.75], [x, y + ry], [x + rx * 0.7, y + ry * 0.75], [x + rx, y], [x + rx * 0.7, y - ry * 0.7], P(x + 8, y - ry - 6, 1)], c: '#b8a888', m: 'cloth', line: 1.2, belly: 0.3, lines, sub: [{ p: [[x + rx * 0.3, y - ry], [x + rx * 1.1, y], [x + rx * 0.8, y + ry * 1.1], [x + rx * 0.2, y + ry * 1.1]], c: '#8a7a60', m: 'flat', line: 0 }] }];
      };
      out.push(...nest(cx + 20, 150, 78, 90), ...nest(cx + 118, 120, 36, 46));
      out.push({ p: hexPts(cx + 20, 224, 16), c: '#2a1a08', m: 'cloth', line: 1, sub: [{ p: hexPts(cx + 20, 226, 10), c: '#ffb030', m: 'flat', line: 0, op: 0.8 }] }); lit(cx + 20, 224);
      out.push(cell(cx - 4, 140, 12), cell(cx + 44, 170, 12));
      // осы-стражи
      for (const [x, y] of [[cx + 80, 210], [cx - 40, 220]]) out.push({ e: [x, y, 10, 6], c: '#f0c020', m: 'skin', line: 0.8, lines: [{ p: [[x - 2, y - 6], [x - 2, y + 6]], w: 3, c: '#1a1a10', a: 1 }, { p: [[x + 4, y - 6], [x + 4, y + 6]], w: 3, c: '#1a1a10', a: 1 }] }, { e: [x - 2, y - 8, 8, 4], c: '#e0f0f4', m: 'gem', line: 0.5, op: 0.6 });
      out.push({ p: [P(cx - 150, g, 1), [cx - 130, g - 20], [cx - 90, g - 24], [cx - 70, g - 10], P(cx - 60, g, 1)], c: '#7a6a44', m: 'cloth', line: 1 });
      return out;
    },
    // 5. Ловчая нора: травяной холм, вход под аркой из клинков богомола
    (cx, g) => {
      const out = [];
      out.push({ p: [P(cx - 180, g, 1), [cx - 160, g - 90], [cx - 90, g - 150], [cx, g - 166], [cx + 90, g - 150], [cx + 160, g - 90], P(cx + 180, g, 1)], c: '#6a8a2a', m: 'fur', furLen: 0.8, flow: -PI / 2, line: 1.2, belly: 0.3 });
      // хватательные лапы богомола: бедро вверх, клинок с шипами свисает внутрь; голова-треугольник над входом
      for (const s of [-1, 1]) {
        out.push({ p: tube([[cx + s * 64, g - 30, 24], [cx + s * 100, g - 180, 20], [cx + s * 104, g - 290, 16]]), c: '#5a9a2a', m: 'horn', gloss: 0.8, line: 1 });
        out.push({ p: [P(cx + s * 112, g - 300, 1), [cx + s * 96, g - 316], [cx + s * 60, g - 290], [cx + s * 40, g - 240], P(cx + s * 34, g - 196, 1), [cx + s * 56, g - 236], [cx + s * 80, g - 270], P(cx + s * 98, g - 276, 1)], c: '#7ab83a', m: 'horn', gloss: 0.9, line: 1.1 });
        for (let i = 0; i < 4; i++) { const t = i / 4, x = cx + s * (86 - 44 * t), y = g - 286 + 70 * t; out.push({ p: [P(x - s * 4, y - 4, 1), P(x + s * 10, y + 10, 1), P(x + s * 2, y + 6, 1)], c: '#e8f0b0', m: 'horn', line: 0.6 }); }
      }
      out.push({ p: [P(cx - 50, g - 340, 1), [cx, g - 356], P(cx + 50, g - 340, 1), [cx + 20, g - 300], P(cx, g - 282, 1), [cx - 20, g - 300]], c: '#7ab83a', m: 'skin', gloss: 0.5, line: 1.1 });
      for (const s of [-1, 1]) out.push({ e: [cx + s * 36, g - 340, 14, 16], c: '#c8e040', m: 'gem', gloss: 1, line: 0.9, lc: '#2a4a10' }, { p: tube([[cx + s * 10, g - 350, 3], [cx + s * 40, g - 390, 2], [cx + s * 80, g - 396, 1.5]]), c: '#4a7a1a', m: 'horn', line: 0.5 });
      lit(cx - 36, g - 340); lit(cx + 36, g - 340);
      out.push(...hdoor(cx, g, 44, 100, { rim: '#4a3a1c', glow: '#8ad040' }));
      // высокая трава
      for (let i = 0; i < 9; i++) { const x = cx - 180 + i * 45, L = 60 + (i * 37) % 50, a = -PI / 2 + ((i % 3) - 1) * 0.25; out.push({ p: K.leaf([x, g], a, L, 12).body, c: i % 2 ? '#8ab83a' : '#6a9a2a', m: 'skin', line: 0.8 }); }
      return out;
    },
    // 6. Панцирный курган: гигантский панцирь жука с рогом
    (cx, g) => {
      const out = [];
      for (const s of [-1, 1]) for (const k of [0.4, 0.85]) out.push({ p: tube([[cx + s * 150 * k, g - 120, 16], [cx + s * (180 * k + 50), g - 60, 13], [cx + s * (180 * k + 60), g, 11]]), c: '#2a3a14', m: 'horn', gloss: 0.8, line: 0.9 });
      out.push({ p: [P(cx - 200, g - 40, 1), [cx - 196, g - 180], [cx - 120, g - 290], [cx, g - 318], [cx + 120, g - 290], [cx + 196, g - 180], P(cx + 200, g - 40, 1), [cx, g - 20]], c: '#3e5a22', m: 'steel', gloss: 1, rim: 0.8, line: 1.3,
        lines: [{ p: [[cx, g - 318], [cx, g - 24]], w: 4.5, a: 0.8 }].concat([0.3, 0.55, 0.8].map(t => ({ p: [[cx - 190 * (1 - t * 0.4), g - 60 - 240 * t], [cx - 60, g - 80 - 220 * t], [cx - 6, g - 70 - 230 * t]], w: 2.6, a: 0.35 })), [0.3, 0.55, 0.8].map(t => ({ p: [[cx + 190 * (1 - t * 0.4), g - 60 - 240 * t], [cx + 60, g - 80 - 220 * t], [cx + 6, g - 70 - 230 * t]], w: 2.6, a: 0.35 }))),
        sub: [{ p: [[cx + 30, g - 330], [cx + 220, g - 180], [cx + 220, g], [cx + 60, g]], c: '#26381a', m: 'flat', line: 0 }] });
      // переднеспинка с рогом, вход
      out.push({ p: [P(cx - 110, g, 1), [cx - 120, g - 70], [cx - 70, g - 120], [cx, g - 130], [cx + 70, g - 120], [cx + 120, g - 70], P(cx + 110, g, 1)], c: '#4a6a26', m: 'steel', gloss: 1, rim: 0.8, line: 1.2 });
      out.push({ p: tube([[cx, g - 116, 30], [cx + 8, g - 180, 22], [cx + 40, g - 260, 12], [cx + 76, g - 290, 3]]), c: '#2e3e16', m: 'horn', gloss: 1, line: 1.1 });
      out.push(...hdoor(cx, g, 40, 90, { rim: '#2a3a14' }));
      out.push(cell(cx - 110, g - 200, 15), cell(cx + 110, g - 210, 15), cell(cx - 140, g - 110, 14), cell(cx + 146, g - 110, 14));
      return out;
    },
    // 7. Тронная камера: купол цвета брюшка матки, крылья, корона
    (cx, g) => {
      const out = [];
      out.push(hwing(cx - 30, g - 330, -PI * 0.83, 220, 96), hwing(cx + 30, g - 330, -PI * 0.17, 220, 96), hwing(cx - 30, g - 300, -PI * 0.95, 180, 70), hwing(cx + 30, g - 300, -PI * 0.05, 180, 70));
      for (const s of [-1, 1]) out.push(...hspire(cx + s * 236, g, 380, 20, Hv.CH, Hv.AMB));
      out.push(wdome(cx, g, 210, 380, { c: '#e0962a', band: 42, bw: 11, bc: '#5a3208' }));
      out.push(resinBand(cx - 212, cx + 212, g - 16, 20));
      // корона
      out.push({ p: box(cx - 60, g - 386, cx + 60, g - 370), c: GOLD, m: 'gold', line: 1 });
      for (let i = 0; i < 5; i++) { const x = cx - 50 + i * 25, h = i === 2 ? 70 : 46; out.push({ p: [P(x - 10, g - 384, 1), P(x, g - 384 - h, 1), P(x + 10, g - 384, 1)], c: GOLD, m: 'gold', line: 0.9 }, { e: [x, g - 384 - h, 7, 7], c: '#ff5a3a', m: 'gem', line: 0.7 }); }
      for (const [x, y] of [[cx - 110, g - 150], [cx + 110, g - 150], [cx - 60, g - 250], [cx + 60, g - 250], [cx, g - 320], [cx - 150, g - 60], [cx + 150, g - 60]]) out.push(cell(x, y, 17));
      out.push(...hdoor(cx, g, 50, 140, { rim: GOLD, glow: '#ffc040' }), ...mandibles(cx, g, 64, 190));
      out.push(drip(cx - 170, g - 130, 36), drip(cx + 176, g - 120, 30));
      return out;
    },
  ];

  /* ---------- Улей: укрепления — смоляная стена, ворота-жвалы, шпили ---------- */
  function hWallSeg(x0, x1, g, top) {
    const pts = [P(x0, g, 1), P(x0, top + 10, 1)];
    for (let x = x0; x < x1 - 20; x += 40) pts.push([x + 20, top - 14], [x + 40, top + 2]);
    pts.push(P(x1, top + 10, 1), P(x1, g, 1));
    return [{ p: pts, c: '#c0a048', m: 'leather', gloss: 0.3, line: 1.2, belly: 0.25, lines: combLines(x0, top, x1, g, 14, 0.4) }];
  }
  function hGate(cx, g, top) {
    const out = [];
    out.push(wdome(cx, g, 110, g - top + 40, { comb: true }));
    out.push(cell(cx - 64, top + 90, 14), cell(cx + 64, top + 90, 14));
    const h = Math.min(150, (g - top) * 0.7);
    out.push(...hdoor(cx, g, 44, h), ...mandibles(cx, g, 56, h + 50));
    return out;
  }
  function hTower(x, g, top, hw) { return [...hspire(x, g, g - top, hw, Hv.CH, Hv.AMB), cell(x, g - (g - top) * 0.3, 13), cell(x - 2, g - (g - top) * 0.55, 11)]; }

  /* ================================== БАСТИОН ==================================
     Брёвна, мох на крышах, длинные дома с резными коньками, вышки на сваях,
     частокол, священный дуб, рога и шкуры. */
  const Bn = { LOG: '#8a5a30', LOGL: '#b0804a', LOGD: '#5a3a1c', MOSS: '#5f8a2e', MOSSD: '#3e6a22', HIDE: '#c49a68', BONE: '#e8dcc0', STONE: '#8e8a7e', RED: '#a8322a', BARK: '#6a4a2c', RUNE: '#8af0c0' };
  const LEAF = ['#2a5a20', '#3e7a2a', '#52902e', '#6aa838'];
  /** Бревенчатая стена: горизонтальные брёвна, торцы по краям (ends). */
  function logWall(x0, y0, x1, y1, o) {
    o = o || {}; const st = o.st || 20, out = [];
    out.push({ p: box(x0, y0, x1, y1), c: o.c || Bn.LOG, m: 'wood', flow: 0, line: 1.2, belly: 0.15, sub: [shadeR(x0, y0, x1, y1, o.k || 0.16, Bn.LOGD)], lines: planks(x0, y0, x1, y1, st, false, 0.6, 2.8) });
    if (o.ends !== false) for (let y = y0 + st / 2, i = 0; y < y1 - 2 && i < 9; y += st, i++) for (const x of [x0 - 3, x1 + 3]) out.push({ e: [x, y, st * 0.52, st * 0.5], c: Bn.LOGL, m: 'wood', line: 0.8, lines: [{ p: ell(x, y, st * 0.24, st * 0.22, 8).concat([[x + st * 0.24, y]]), w: 1.8, a: 0.55 }] });
    return out;
  }
  /** Мшистая вальмовая крыша (вид спереди). */
  function sod(x0, x1, y, h, e, inset, o) {
    o = o || {}; const c = o.c || Bn.MOSS;
    const pts = [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)];
    for (let x = x1 + e - 14; x > x0 - e + 10; x -= 26) pts.push([x, y + 7 + ((x * 7) % 5)], [x - 13, y + 1]);
    return { p: pts, c, m: 'fur', furLen: 0.8, flow: PI * 0.5, line: 1.2, belly: 0.25, sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.2, y - h - 4, 1), P(x1 + e + 4, y - h - 4, 1), P(x1 + e + 4, y + 12, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.32, y + 12, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x0 - e + inset, y - h + 3], [x1 + e - inset, y - h + 3]], w: 4, c: Bn.LOGD, a: 0.7 }] };
  }
  /** Фронтон из досок с крест-накрест резными коньками, уходящими в рога. */
  function gableF(cx, y, hw, h, o) {
    o = o || {}; const out = [];
    out.push({ p: [P(cx - hw, y, 1), P(cx, y - h, 1), P(cx + hw, y, 1)], c: o.c || Bn.LOGL, m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(cx - hw, y - h, cx + hw, y, 13, true, 0.45), sub: [{ p: [P(cx + 2, y - h - 4, 1), P(cx + hw + 4, y + 2, 1), P(cx + 4, y + 2, 1)], c: tone(o.c || Bn.LOGL, -0.25), m: 'flat', line: 0 }] });
    const L = hw * 0.4;
    for (const s of [-1, 1]) out.push({ p: tube([[cx - s * (hw + 10), y + 6, 10], [cx, y - h, 9], [cx + s * L * 0.6, y - h - L * 0.7, 7], [cx + s * L * 0.2, y - h - L * 1.1, 5], [cx - s * L * 0.1, y - h - L * 0.95, 3]]), c: o.beam || '#7a4a24', m: 'wood', line: 1 });
    return out;
  }
  /** Сваи с раскосами: от base до top, n столбов между x0 и x1. */
  function stilts(x0, x1, top, base, n) {
    const out = [], st = (x1 - x0) / (n - 1);
    for (let i = 0; i < n - 1; i++) { const a = x0 + i * st, b = a + st; out.push({ p: tube([[a, base - 10, 4], [b, top + 20, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 }, { p: tube([[b, base - 10, 4], [a, top + 20, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 }); }
    for (let i = 0; i < n; i++) out.push({ p: tube([[x0 + i * st, base, 9], [x0 + i * st, top, 8]]), c: Bn.LOG, m: 'wood', flow: -PI / 2, line: 0.9 });
    return out;
  }
  /** Приставная лестница. */
  function ladder(x0, y0, x1, y1) {
    const out = [{ p: tube([[x0 - 10, y0, 4], [x1 - 10, y1, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 }, { p: tube([[x0 + 10, y0, 4], [x1 + 10, y1, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 }];
    const lines = []; for (let t = 0.08; t < 1; t += 0.12) lines.push({ p: [[x0 - 10 + (x1 - x0) * t, y0 + (y1 - y0) * t], [x0 + 10 + (x1 - x0) * t, y0 + (y1 - y0) * t]], w: 3.4, c: Bn.LOGD, a: 1 });
    out.push({ p: box(Math.min(x0, x1) - 14, Math.min(y0, y1), Math.max(x0, x1) + 14, Math.max(y0, y1)), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines });
    return out;
  }
  /** Шкура на раме из жердей. */
  function hideFrame(cx, cy, w, h, c) {
    return [{ p: tube([[cx - w - 6, cy + h + 18, 4], [cx - w - 2, cy - h - 10, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 }, { p: tube([[cx + w + 6, cy + h + 18, 4], [cx + w + 2, cy - h - 10, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 },
      { p: tube([[cx - w - 8, cy - h - 4, 4], [cx + w + 8, cy - h - 4, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 },
      { p: [[cx - w * 0.5, cy - h], [cx, cy - h * 0.8], [cx + w * 0.5, cy - h], P(cx + w, cy - h * 0.7, 1), [cx + w * 0.8, cy], P(cx + w, cy + h * 0.7, 1), [cx + w * 0.4, cy + h * 0.8], [cx, cy + h], [cx - w * 0.4, cy + h * 0.8], P(cx - w, cy + h * 0.7, 1), [cx - w * 0.8, cy], P(cx - w, cy - h * 0.7, 1)], c: c || Bn.HIDE, m: 'leather', line: 1, lines: [{ p: [[cx, cy - h * 0.6], [cx, cy + h * 0.6]], w: 2.4, a: 0.35 }] }];
  }
  /** Круглый расписной щит. */
  const shield = (x, y, r, c) => ({ e: [x, y, r, r], c: c || Bn.RED, m: 'wood', line: 1.1, lines: [{ p: [[x - r, y], [x + r, y]], w: 3, c: '#e8dcc0', a: 0.8 }, { p: [[x, y - r], [x, y + r]], w: 3, c: '#e8dcc0', a: 0.8 }], sub: [{ e: [x, y, r * 0.28, r * 0.28], c: '#9a9aa2', m: 'steel', line: 0.6 }] });
  /** Частокол из заострённых брёвен. */
  function palis(x0, x1, top, G, st, o) {
    o = o || {}; const pts = [P(x0, G, 1)], lines = []; let i = 0;
    for (let x = x0; x < x1 - st * 0.5; x += st, i++) {
      const t = top + (i % 3 === 1 ? 8 : i % 3 === 2 ? 3 : 0);
      pts.push(P(x + 1, t + st * 0.9, 1), P(x + st / 2, t, 1), P(x + st - 1, t + st * 0.9, 1));
      if (x > x0) lines.push({ p: [[x, t + st * 0.9], [x, G]], w: 2.4, a: 0.6 });
    }
    pts.push(P(x1, G, 1));
    for (const y of o.bands || []) lines.push({ p: [[x0, y], [x1, y]], w: 5, c: '#4a3420', a: 0.9 });
    return { p: pts, c: o.c || '#8a5a32', m: 'wood', flow: -PI / 2, line: 1.1, lines, belly: 0.3 };
  }
  /** Каменная труба из булыжника. */
  const stoneChim = (x, top, base, w) => ({ p: trap(x, top, base, w * 0.85, w), c: Bn.STONE, m: 'cloth', line: 1.1, lines: masonry(x - w, top, x + w, base, 13, w * 0.9, 0.5, 2.2), sub: [shadeR(x - w, top, x + w, base, 0.35, '#5e5a52')] });
  /** Дуб: ствол с ветвями и крона. */
  function oak(cx, base, ttop, rx, ry, seed, o) {
    o = o || {}; const w = o.w || 26, out = [];
    out.push({ p: [[cx - w * 1.8, base], [cx - w, base - 12], [cx, base - 8], [cx + w, base - 12], [cx + w * 1.9, base], [cx, base + 4]], c: tone(Bn.BARK, -0.1), m: 'wood', flow: -PI / 2 });
    out.push({ p: tube([[cx, base + 2, w * 2], [cx, (base + ttop) / 2, w * 1.5], [cx + 4, ttop, w * 1.1]], { flat1: true }), c: Bn.BARK, m: 'wood', flow: -PI / 2, line: 1 });
    for (const s of [-1, 1]) out.push({ p: tube([[cx, ttop + 30, w * 0.9], [cx + s * rx * 0.4, ttop - 10, w * 0.55], [cx + s * rx * 0.7, ttop - 20, w * 0.3]]), c: Bn.BARK, m: 'wood', line: 0.9 });
    out.push(...foliage(cx, ttop - ry * 0.5, rx, ry, o.n || 8, LEAF, seed));
    return out;
  }
  /** Ель ярусами. */
  function pine(x, base, h, w) {
    const out = [{ p: tube([[x, base, 10], [x, base - h * 0.3, 8]]), c: Bn.BARK, m: 'wood', line: 0.7 }];
    for (let i = 0; i < 3; i++) { const yb = base - h * (0.18 + i * 0.25), ww = w * (1 - i * 0.26), hh = h * 0.42; out.push({ p: [P(x - ww, yb, 1), [x - ww * 0.5, yb - hh * 0.45], P(x, yb - hh, 1), [x + ww * 0.5, yb - hh * 0.45], P(x + ww, yb, 1), [x + ww * 0.4, yb + 6], [x, yb + 2], [x - ww * 0.4, yb + 6]], c: i % 2 ? '#2f5a28' : '#3a6a2e', m: 'feather', texSize: 0.6, flow: PI / 2, line: 1 }); }
    return out;
  }
  /** Стоячий камень с горящей руной. */
  function stoneS(x, base, w, h, rune) {
    const s = { p: [P(x - w, base, 1), [x - w * 1.05, base - h * 0.5], [x - w * 0.7, base - h], [x + w * 0.4, base - h * 1.02], [x + w, base - h * 0.6], P(x + w * 0.9, base, 1)], c: Bn.STONE, m: 'horn', gloss: 0.2, line: 1.1, belly: 0.3, lines: [{ p: [[x - w * 0.3, base - h * 0.3], [x + w * 0.2, base - h * 0.7]], w: 2, a: 0.4 }] };
    if (rune) { s.lines.push({ p: [[x, base - h * 0.75], [x, base - h * 0.35], [x - w * 0.35, base - h * 0.55], [x + w * 0.35, base - h * 0.62]], w: 4, c: Bn.RUNE, a: 1 }); lit(x, base - h * 0.55); }
    return s;
  }
  /** Жаровня-чаша на камне. */
  const firebowl = (x, base) => { lit(x, base - 56); return [{ p: trap(x, base - 30, base, 14, 18), c: Bn.STONE, m: 'cloth', line: 1 }, { p: [P(x - 24, base - 40, 1), P(x + 24, base - 40, 1), [x + 18, base - 26], P(x - 18, base - 26, 1)], c: '#5a5a62', m: 'steel', line: 1 }, ...flame(x, base - 38, 16, 40)]; };
  /** Бревенчатое окно со ставнями. */
  const bwin = (cx, cy, w, h) => rwin(cx, cy, w, h, { shut: Bn.LOGD });
  /** Дверь из плах под резной притолокой. */
  const bdoor = (cx, base, w, h, lamp) => fdoor(cx, base, w, h, { frame: Bn.LOGD, c: '#6a4222', lamp });
  /** Сторожевая вышка на сваях: площадка с избушкой и мшистой крышей. */
  function watch(x, base, top, hw) {
    const out = [...stilts(x - hw * 0.8, x + hw * 0.8, top + 60, base, 2)];
    out.push(...logWall(x - hw, top + 10, x + hw, top + 64, { st: 14, ends: false }), sod(x - hw, x + hw, top + 16, hw * 0.9 + 16, 12, hw * 0.8));
    out.push(...bwin(x, top + 38, 9, 12));
    out.push({ p: box(x - hw - 12, top + 62, x + hw + 12, top + 72), c: Bn.LOGD, m: 'wood', flow: 0, line: 1 });
    return out;
  }

  /* ---------- Бастион: ратуша — изба, длинный дом, чертог под священным дубом ---------- */
  function bHall(level) {
    return (cx, g) => {
      const out = [];
      if (level === 1) {
        out.push(stoneChim(cx + 92, 110, 220, 16), ...smoke(cx + 96, 104, 14));
        out.push(...logWall(cx - 140, 200, cx + 124, g), sod(cx - 140, cx + 124, 206, 96, 16, 70));
        out.push(...gableF(cx - 10, 214, 62, 76), ...antler(cx - 18, 118, -1, 50), ...antler(cx - 2, 118, 1, 50), ...skull(cx - 10, 126, 12));
        out.push(...bwin(cx - 94, 262, 16, 18), ...bwin(cx + 80, 262, 16, 18));
        out.push(...bdoor(cx - 10, g, 26, 88, [cx + 30, g - 92]));
        out.push(shield(cx - 94, 318, 16), shield(cx + 80, 318, 16, '#3a6a8a'));
      } else if (level === 2) {
        out.push(stoneChim(cx + 140, 120, 250, 17), ...smoke(cx + 144, 114, 15));
        out.push(...logWall(cx - 200, 250, cx + 196, g), sod(cx - 200, cx + 196, 256, 130, 18, 100));
        out.push(...gableF(cx, 262, 80, 110), ...antler(cx - 10, 136, -1, 62), ...antler(cx + 10, 136, 1, 62), ...skull(cx, 146, 14));
        for (const x of [cx - 150, cx - 94, cx + 94, cx + 150]) out.push(...bwin(x, 310, 14, 16));
        for (const [x, c] of [[cx - 150, Bn.RED], [cx - 94, '#3a6a8a'], [cx + 94, '#d8a53a'], [cx + 150, Bn.RED]]) out.push(shield(x, 372, 18, c));
        out.push(...bdoor(cx, g, 30, 104, [cx + 44, g - 110]));
      } else if (level === 3) {
        out.push(...watch(cx - 196, g, 80, 52));
        out.push(stoneChim(cx + 160, 136, 260, 17), ...smoke(cx + 164, 130, 15));
        out.push(...logWall(cx - 130, 250, cx + 226, g), sod(cx - 130, cx + 226, 256, 124, 18, 100));
        out.push(...gableF(cx + 48, 262, 86, 118), ...antler(cx + 38, 128, -1, 70), ...antler(cx + 58, 128, 1, 70), ...skull(cx + 48, 138, 15));
        for (const x of [cx - 90, cx + 170]) out.push(...bwin(x, 314, 15, 17));
        for (const [x, c] of [[cx - 90, Bn.RED], [cx - 30, '#3a6a8a'], [cx + 126, '#d8a53a'], [cx + 186, Bn.RED]]) out.push(shield(x, 380, 18, c));
        out.push(...bdoor(cx + 48, g, 32, 110, [cx + 96, g - 114]));
        out.push(palis(cx - 250, cx - 140, g - 70, g, 18));
      } else {
        // чертог под священным дубом
        out.push(...oak(cx, g - 180, 190, 250, 130, 41, { w: 30, n: 10 }));
        out.push(...watch(cx - 230, g, 180, 42), ...watch(cx + 230, g, 180, 42));
        out.push(...logWall(cx - 124, g - 330, cx + 124, g - 190, { ends: false }), sod(cx - 124, cx + 124, g - 324, 90, 16, 70));
        out.push(...logWall(cx - 190, g - 190, cx + 190, g), sod(cx - 190, cx + 190, g - 184, 70, 20, 40));
        out.push(...gableF(cx, g - 176, 96, 130), ...antler(cx - 12, g - 310, -1, 80), ...antler(cx + 12, g - 310, 1, 80), ...skull(cx, g - 298, 17));
        for (const x of [cx - 80, cx + 80]) out.push(...bwin(x, g - 250, 14, 16));
        for (const x of [cx - 146, cx + 146]) out.push(...bwin(x, g - 120, 16, 18));
        for (const [x, c] of [[cx - 146, Bn.RED], [cx - 104, '#3a6a8a'], [cx + 104, '#d8a53a'], [cx + 146, Bn.RED]]) out.push(shield(x, g - 54, 18, c));
        out.push(...bdoor(cx, g, 34, 116, [cx + 50, g - 120]));
        out.push(...firebowl(cx - 76, g), ...firebowl(cx + 76, g));
      }
      return out;
    };
  }

  /* ---------- Бастион: гильдия — дом духов на живом дереве ---------- */
  function bGuild(level) {
    return (cx, g) => {
      const out = [], top = 190, n = level + 1;
      out.push({ p: [[cx - 70, g], [cx - 34, g - 22], [cx, g - 16], [cx + 34, g - 22], [cx + 74, g], [cx, g + 6]], c: tone(Bn.BARK, -0.1), m: 'wood', flow: -PI / 2 });
      out.push({ p: tube([[cx, g + 2, 64], [cx - 6, (g + top) / 2, 44], [cx + 4, top - 30, 30]], { flat1: true }), c: Bn.BARK, m: 'wood', flow: -PI / 2, line: 1.1 });
      out.push(...foliage(cx, top - 70, 110 + level * 6, 90, 7, LEAF, 13 + level));
      for (let i = 0; i < n; i++) {
        const y = g - 110 - i * (g - top - 60) / n, s = i % 2 ? 1 : -1, hx = cx + s * 30;
        out.push({ p: tube([[cx, y + 30, 8], [hx + s * 40, y + 6, 6]]), c: Bn.BARK, m: 'wood', line: 0.7 });
        out.push({ p: box(hx - 64, y, hx + 64, y + 12), c: Bn.LOGD, m: 'wood', flow: 0, line: 1 });
        out.push(...logWall(hx - 40, y - 56, hx + 40, y, { st: 14, ends: false }), { p: [P(hx - 58, y - 50, 1), P(hx, y - 104, 1), P(hx + 58, y - 50, 1), [hx, y - 42]], c: '#a89048', m: 'fur', furLen: 0.6, flow: PI / 2, line: 1.1, sub: [{ p: [P(hx + 2, y - 104, 1), P(hx + 62, y - 48, 1), P(hx + 4, y - 40, 1)], c: '#7a6630', m: 'flat', line: 0 }] });
        out.push(...rwin(hx, y - 28, 12, 14, { c: Bn.RUNE, lc: '#1a4a3a' }));
      }
      // дупло-святилище и рунные камни
      out.push({ p: arch(cx, g, 24, 70), c: '#1a1208', m: 'cloth', ao: 1.4, line: 1, sub: [{ e: [cx, g - 20, 18, 26], c: Bn.RUNE, m: 'flat', line: 0, op: 0.6 }] }); lit(cx, g - 30);
      out.push(stoneS(cx - 84, g, 14, 44, true), stoneS(cx + 86, g, 13, 38, true));
      if (level >= 3) out.push(stoneS(cx - 110, g, 10, 28, false), stoneS(cx + 112, g, 10, 30, false), ...antler(cx - 8, top - 150, -1, 44), ...antler(cx + 8, top - 150, 1, 44));
      return out;
    };
  }

  /* ---------- Бастион: таверна — медовый зал ---------- */
  function bTavern(cx, g) {
    const out = [];
    out.push(stoneChim(cx + 104, 30, 150, 15), ...smoke(cx + 108, 22, 13, { n: 2 }));
    out.push(...logWall(cx - 150, 160, cx + 130, g), sod(cx - 150, cx + 130, 166, 104, 16, 80));
    out.push(...gableF(cx - 10, 172, 58, 70));
    // вывеска: рог для мёда на кронштейне
    out.push({ p: tube([[cx - 150, 196, 5], [cx - 196, 196, 5]]), c: Bn.LOGD, m: 'wood', line: 0.7 }, { p: tube([[cx - 190, 196, 2.5], [cx - 190, 212, 2.5]]), c: '#3a2a1a', m: 'wood', line: 0 });
    out.push({ p: tube([[cx - 208, 214, 5], [cx - 190, 228, 9], [cx - 168, 226, 13]]), c: '#e8d8b0', m: 'horn', gloss: 0.8, line: 1, lines: [{ p: [[cx - 186, 220], [cx - 182, 236]], w: 3, c: GOLD, a: 0.9 }] });
    out.push(...bwin(cx - 100, 232, 16, 18), ...bwin(cx + 84, 232, 16, 18));
    out.push(...bdoor(cx - 10, g, 26, 88, [cx + 28, g - 92]));
    out.push(barrel(cx - 170, g, 18, 46, '#8a5a30'), barrel(cx - 134, g, 15, 38, '#9a6a38'));
    out.push({ p: box(cx + 50, g - 28, cx + 140, g - 20), c: Bn.LOGL, m: 'wood', flow: 0, line: 1 }, { p: tube([[cx + 60, g, 5], [cx + 60, g - 24, 5]]), c: Bn.LOGD, m: 'wood', line: 0.6 }, { p: tube([[cx + 130, g, 5], [cx + 130, g - 24, 5]]), c: Bn.LOGD, m: 'wood', line: 0.6 });
    out.push(...antler(cx - 18, 106, -1, 36), ...antler(cx - 2, 106, 1, 36));
    return out;
  }

  /* ---------- Бастион: кузница — навес на столбах, каменный горн ---------- */
  function bSmith(cx, g) {
    const out = [];
    out.push(stoneChim(cx - 90, 24, 250, 20), ...smoke(cx - 86, 16, 14, { n: 2 }));
    out.push(...logWall(cx - 140, 210, cx + 120, g - 60, { ends: false, c: Bn.LOGD }));
    out.push(sod(cx - 150, cx + 130, 214, 76, 14, 44));
    for (const x of [cx - 146, cx + 126]) out.push({ p: tube([[x, g, 10], [x, 214, 9]]), c: Bn.LOG, m: 'wood', flow: -PI / 2, line: 0.9 });
    // каменный горн с огнём
    out.push({ p: box(cx - 140, g - 110, cx - 40, g), c: Bn.STONE, m: 'cloth', line: 1.2, lines: masonry(cx - 140, g - 110, cx - 40, g, 22, 30, 0.5, 2.4), sub: [shadeR(cx - 140, g - 110, cx - 40, g, 0.2, '#5e5a52')] });
    out.push({ p: arch(cx - 90, g - 20, 30, 60), c: '#2a1a12', m: 'cloth', ao: 1.2, line: 1 }, ...flame(cx - 90, g - 22, 22, 44)); lit(cx - 90, g - 44);
    // мехи, наковальня на пне, инструмент
    out.push({ p: [P(cx - 30, g - 70, 1), [cx - 4, g - 88], [cx + 20, g - 80], P(cx + 20, g - 60, 1), [cx - 4, g - 52]], c: Bn.HIDE, m: 'leather', line: 1 });
    out.push({ p: box(cx + 30, g - 44, cx + 70, g), c: Bn.LOGL, m: 'wood', flow: -PI / 2, line: 1 }, { p: [P(cx + 16, g - 62, 1), P(cx + 76, g - 62, 1), [cx + 90, g - 56], P(cx + 68, g - 46, 1), P(cx + 32, g - 46, 1)], c: '#4a4a52', m: 'steel', line: 1 });
    out.push({ p: tube([[cx + 96, g - 150, 4], [cx + 96, g - 90, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 }, { p: [P(cx + 84, g - 150, 1), P(cx + 112, g - 150, 1), [cx + 116, g - 134], P(cx + 96, g - 136, 1)], c: '#9aa0a8', m: 'steel', line: 0.8 });
    out.push(...antler(cx + 20, 196, -1, 34), ...antler(cx + 36, 196, 1, 34));
    return out;
  }

  /* ---------- Бастион: рынок — меновой двор со шкурами ---------- */
  function bMarket(cx, g) {
    const out = [];
    out.push(...logWall(cx - 90, 130, cx + 90, g), sod(cx - 90, cx + 90, 136, 74, 14, 50));
    out.push(...antler(cx - 8, 60, -1, 40), ...antler(cx + 8, 60, 1, 40));
    out.push({ p: [P(cx - 106, 150, 1), P(cx + 106, 150, 1), P(cx + 116, 182, 1), [cx + 70, 176], [cx, 186], [cx - 70, 176], P(cx - 116, 182, 1)], c: Bn.HIDE, m: 'leather', line: 1.1 });
    for (const x of [cx - 100, cx + 100]) out.push({ p: tube([[x, 180, 5], [x, g, 5]]), c: Bn.LOGD, m: 'wood', line: 0.7 });
    out.push(...bdoor(cx, g, 22, 56), ...bwin(cx - 56, 212, 12, 13), ...bwin(cx + 56, 212, 12, 13));
    out.push(...hideFrame(cx - 150, 150, 30, 40, '#b88a58'), ...hideFrame(cx + 152, 146, 30, 40, '#8a6a48'));
    // жердь с мехами, корзины ягод
    out.push({ p: tube([[cx - 196, g - 110, 4], [cx - 116, g - 110, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 });
    for (const [x, c] of [[cx - 186, '#6a4a2a'], [cx - 156, '#c8b8a0'], [cx - 128, '#8a5a30']]) out.push({ p: [P(x - 8, g - 110, 1), [x - 12, g - 80], [x - 6, g - 58], [x + 4, g - 60], [x + 10, g - 84], P(x + 8, g - 110, 1)], c, m: 'fur', furLen: 0.5, flow: PI / 2, line: 0.9 });
    for (const [x, c] of [[cx + 124, '#b83248'], [cx + 164, '#4a3a8a']]) out.push({ p: trap(x, g - 28, g, 22, 16), c: '#b89a58', m: 'wood', flow: 0, line: 1, lines: planks(x - 22, g - 28, x + 22, g, 7, false, 0.5) }, { e: [x, g - 30, 20, 8], c, m: 'gem', line: 0.8 });
    return out;
  }

  /* ---------- Бастион: хранилище — лабаз на высоких сваях и поленница ---------- */
  function bSilo(cx, g) {
    const out = [];
    out.push(...stilts(cx - 90, cx + 70, 204, g, 3));
    out.push(...logWall(cx - 100, 110, cx + 80, 204, { st: 16 }), sod(cx - 100, cx + 80, 116, 80, 16, 60));
    out.push({ p: box(cx - 112, 200, cx + 92, 212), c: Bn.LOGD, m: 'wood', flow: 0, line: 1 });
    out.push(...bdoor(cx - 10, 200, 20, 64), ...bwin(cx + 48, 150, 10, 12));
    out.push(...ladder(cx - 10, 204, cx - 60, g));
    // поленница: торцы брёвен
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) { const x = cx + 88 + i * 20 + r * 10, y = g - 10 - r * 18; out.push({ e: [x, y, 10, 9], c: Bn.LOGL, m: 'wood', line: 0.8, lines: [{ p: ell(x, y, 4, 4, 6).concat([[x + 4, y]]), w: 1.5, a: 0.5 }] }); }
    out.push(barrel(cx - 130, g, 15, 38), { p: [[cx - 104, g], [cx - 108, g - 20], [cx - 100, g - 36], [cx - 86, g - 38], [cx - 76, g - 22], [cx - 78, g]], c: '#d8c090', m: 'cloth', line: 1 });
    return out;
  }

  /* ---------- Бастион: особая — Тотем охоты ---------- */
  function bSpecial(cx, g) {
    const out = [];
    out.push(stoneS(cx - 118, g, 14, 50, true), stoneS(cx + 118, g, 14, 46, true));
    out.push(...firebowl(cx - 70, g), ...firebowl(cx + 72, g));
    // крылья тотема
    for (const s of [-1, 1]) out.push({ p: [P(cx + s * 20, 110, 1), [cx + s * 70, 90], P(cx + s * 110, 96, 1), P(cx + s * 96, 112, 1), P(cx + s * 104, 124, 1), P(cx + s * 84, 132, 1), P(cx + s * 86, 144, 1), P(cx + s * 20, 146, 1)], c: '#c8a060', m: 'wood', flow: 0, line: 1.1,
      lines: [{ p: [[cx + s * 30, 118], [cx + s * 92, 108]], w: 3, c: Bn.RED, a: 0.9 }, { p: [[cx + s * 30, 134], [cx + s * 80, 132]], w: 3, c: '#2a4a6a', a: 0.9 }] });
    const bands = [];
    for (const [y, c] of [[130, Bn.RED], [170, '#2a4a6a'], [210, Bn.RED], [240, '#e8dcc0']]) bands.push({ p: [[cx - 26, y], [cx + 26, y]], w: 5, c, a: 0.9 });
    out.push({ p: tube([[cx, g, 40], [cx, 90, 34]], { flat1: true }), c: '#8a5a30', m: 'wood', flow: -PI / 2, line: 1.1, lines: bands });
    // вырезанные лики
    for (const y of [150, 196]) out.push({ e: [cx - 8, y, 5, 4], c: '#1a1208', m: 'flat', line: 0 }, { e: [cx + 8, y, 5, 4], c: '#1a1208', m: 'flat', line: 0 }, { p: box(cx - 9, y + 10, cx + 9, y + 14), c: '#1a1208', m: 'flat', line: 0 });
    out.push(...antler(cx - 10, 70, -1, 70), ...antler(cx + 10, 70, 1, 70), ...skull(cx, 80, 18, { c: '#f0e6d0' }));
    out.push({ e: [cx - 7, 80, 3.5, 3.5], c: Bn.RUNE, m: 'gem', line: 0 }, { e: [cx + 7, 80, 3.5, 3.5], c: Bn.RUNE, m: 'gem', line: 0 }); lit(cx, 80);
    out.push(...hideFrame(cx - 40, 238, 12, 16, '#b88a58'));
    return out;
  }

  /* ---------- Бастион: жилища ---------- */
  const bDwell = [
    // 1. Кошачья опушка: полое бревно-логово, пень с когтеточкой, кусты
    (cx, g) => {
      const out = [];
      out.push(...foliage(cx - 30, 130, 90, 60, 5, LEAF, 5, { leaf: 0.6 }), ...foliage(cx + 70, 150, 50, 44, 3, LEAF, 7, { leaf: 0.6 }));
      out.push({ p: tube([[cx - 110, g - 40, 72], [cx + 70, g - 44, 64]]), c: Bn.BARK, m: 'wood', flow: 0, line: 1.1, lines: [{ p: [[cx - 100, g - 60], [cx + 60, g - 64]], w: 2.4, a: 0.4 }] });
      out.push({ p: [P(cx - 100, g - 76, 1), [cx - 40, g - 90], [cx + 30, g - 86], P(cx + 64, g - 78, 1), [cx + 10, g - 70], [cx - 60, g - 72]], c: Bn.MOSS, m: 'fur', furLen: 0.5, flow: PI / 2, line: 0.8 });
      out.push({ e: [cx + 72, g - 44, 30, 34], c: Bn.LOGL, m: 'wood', line: 1, lines: [{ p: ell(cx + 72, g - 44, 22, 26, 10).concat([[cx + 94, g - 44]]), w: 2, a: 0.5 }] }, { e: [cx + 74, g - 42, 20, 24], c: '#1a1208', m: 'cloth', line: 0.8 });
      out.push({ e: [cx + 67, g - 46, 3.5, 2.5], c: '#d8f060', m: 'gem', line: 0 }, { e: [cx + 81, g - 46, 3.5, 2.5], c: '#d8f060', m: 'gem', line: 0 }); lit(cx + 74, g - 46);
      out.push({ p: box(cx - 120, g - 70, cx - 80, g), c: Bn.LOGL, m: 'wood', flow: -PI / 2, line: 1, lines: [0, 1, 2].map(i => ({ p: [[cx - 112 + i * 10, g - 60], [cx - 108 + i * 10, g - 20]], w: 2.4, a: 0.7 })) }, { e: [cx - 100, g - 70, 20, 7], c: '#c8a070', m: 'wood', line: 0.8 });
      return out;
    },
    // 2. Сторожка следопытов: избушка, лук и колчан на фронтоне, мишень из соломы
    (cx, g) => {
      const out = [];
      out.push(...pine(cx + 120, g, 220, 44));
      out.push(...logWall(cx - 110, 140, cx + 80, g), sod(cx - 110, cx + 80, 146, 80, 14, 60));
      out.push(...gableF(cx - 16, 152, 50, 60));
      out.push({ p: tube([[cx - 58, 110, 4], [cx - 16, 84, 5], [cx + 26, 110, 4]]), c: '#6a3a1a', m: 'wood', line: 0.8 });
      out.push(...bwin(cx - 70, 190, 12, 14), ...bdoor(cx + 10, g, 22, 76));
      out.push(...hideFrame(cx - 140, 200, 18, 26, '#b88a58'));
      out.push({ e: [cx + 130, g - 40, 28, 30], c: '#d8b860', m: 'fur', furLen: 0.4, line: 1, sub: [{ e: [cx + 130, g - 40, 17, 18], c: Bn.RED, m: 'flat', line: 0 }, { e: [cx + 130, g - 40, 7, 7], c: '#f0e0c0', m: 'flat', line: 0 }] }, { p: tube([[cx + 126, g - 44, 2], [cx + 100, g - 58, 2]]), c: '#3a2a1a', m: 'wood', line: 0 });
      return out;
    },
    // 3. Кабанья чаща: плетень, шалаш, кабаний череп на колу, грязь
    (cx, g) => {
      const out = [];
      out.push(...foliage(cx - 60, 110, 110, 70, 6, ['#2a4a1c', '#3e6a2a', '#4a7a2e', '#5a8a30'], 11), ...foliage(cx + 110, 130, 60, 50, 4, ['#2a4a1c', '#3e6a2a', '#4a7a2e'], 12));
      out.push({ p: [P(cx - 110, g - 30, 1), P(cx - 20, 110, 1), P(cx + 70, g - 30, 1)], c: '#9a8048', m: 'fur', furLen: 0.9, flow: PI / 2, line: 1.2, belly: 0.25 });
      out.push({ p: arch(cx - 20, g - 30, 28, 70), c: '#1a1208', m: 'cloth', line: 1, ao: 1.2 }); lit(cx - 20, g - 60);
      out.push({ e: [cx + 40, g - 16, 90, 16], c: '#5a4228', m: 'gem', gloss: 0.6, line: 0.8 });
      // плетень
      const wl = []; for (let y = g - 60; y < g - 4; y += 10) wl.push({ p: [[cx - 170, y], [cx - 120, y + 4], [cx - 70, y], [cx - 20, y + 4], [cx + 30, y], [cx + 80, y + 4], [cx + 130, y], [cx + 170, y + 4]], w: 4, a: 0.55 });
      out.push({ p: box(cx - 170, g - 64, cx + 170, g), c: '#9a7a48', m: 'wood', flow: 0, line: 1.1, lines: wl.concat(planks(cx - 170, g - 64, cx + 170, g, 34, true, 0.8, 4)) });
      out.push({ p: tube([[cx + 130, g, 7], [cx + 130, 150, 6]]), c: Bn.LOGD, m: 'wood', line: 0.8 }, ...skull(cx + 130, 140, 16, { c: '#e8dcc0' }));
      for (const s of [-1, 1]) out.push({ p: tube([[cx + 130 + s * 10, 152, 5], [cx + 130 + s * 28, 146, 4], [cx + 130 + s * 30, 124, 2]]), c: '#f4ecd8', m: 'horn', line: 0.7 });
      return out;
    },
    // 4. Логово росомах: скала с логовом, корни, следы когтей, кости
    (cx, g) => {
      const out = [];
      out.push(...pine(cx + 60, 110, 110, 34));
      out.push({ p: [P(cx - 160, g, 1), [cx - 150, g - 100], [cx - 100, g - 170], [cx - 20, g - 190], [cx + 70, g - 186], [cx + 140, g - 130], [cx + 164, g - 50], P(cx + 160, g, 1)], c: '#7e7a70', m: 'horn', gloss: 0.2, line: 1.2, belly: 0.3,
        lines: [{ p: [[cx - 120, g - 110], [cx - 70, g - 150], [cx - 40, g - 130]], w: 2.4, a: 0.45 }, { p: [[cx + 60, g - 150], [cx + 110, g - 110]], w: 2.4, a: 0.45 }],
        sub: [{ p: [[cx + 40, g - 200], [cx + 180, g - 120], [cx + 180, g + 6], [cx + 80, g + 6]], c: '#5a564e', m: 'flat', line: 0 }] });
      out.push({ p: [P(cx - 130, g - 150, 1), [cx - 60, g - 196], [cx + 20, g - 196], [cx + 100, g - 170], P(cx + 130, g - 140, 1), [cx + 40, g - 170], [cx - 50, g - 172]], c: Bn.MOSS, m: 'fur', furLen: 0.6, flow: PI / 2, line: 0.9 });
      for (const [x, dx] of [[cx - 90, -30], [cx - 30, -8], [cx + 40, 24]]) out.push({ p: tube([[x, g - 186, 7], [x + dx * 0.5, g - 140, 5], [x + dx, g - 100, 2]]), c: '#6a5030', m: 'wood', line: 0.6 });
      out.push({ p: [P(cx - 64, g, 1), [cx - 70, g - 50], [cx - 40, g - 100], [cx + 10, g - 110], [cx + 50, g - 80], P(cx + 64, g, 1)], c: '#140e08', m: 'cloth', line: 1.2, ao: 1.4 });
      out.push({ e: [cx - 10, g - 50, 3.5, 2.5], c: '#ffd040', m: 'gem', line: 0 }, { e: [cx + 6, g - 50, 3.5, 2.5], c: '#ffd040', m: 'gem', line: 0 }); lit(cx - 2, g - 50);
      out.push({ p: box(cx + 70, g - 150, cx + 130, g - 90), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: [0, 1, 2, 3].map(i => ({ p: [[cx + 80 + i * 12, g - 144], [cx + 92 + i * 12, g - 100]], w: 4, c: '#2a2620', a: 0.8 })) });
      out.push({ p: tube([[cx - 130, g - 6, 6], [cx - 84, g - 14, 6]]), c: Bn.BONE, m: 'horn', line: 0.7 }, ...skull(cx + 100, g - 12, 11));
      return out;
    },
    // 5. Дом ловчих: изба на высоких сваях с галереей, лестница, шкуры, лук
    (cx, g) => {
      const out = [];
      out.push(...pine(cx - 150, g, 280, 52));
      out.push(...stilts(cx - 90, cx + 90, 220, g, 3));
      out.push(...logWall(cx - 110, 120, cx + 100, 220), sod(cx - 110, cx + 100, 126, 100, 16, 76));
      out.push(...gableF(cx - 4, 132, 56, 74), ...antler(cx - 14, 50, -1, 46), ...antler(cx + 6, 50, 1, 46));
      out.push({ p: box(cx - 126, 216, cx + 116, 228), c: Bn.LOGD, m: 'wood', flow: 0, line: 1 });
      const rl = []; for (let x = cx - 120; x <= cx + 110; x += 16) rl.push({ p: [[x, 216], [x, 190]], w: 3, c: Bn.LOGD, a: 0.9 });
      out.push({ p: box(cx - 126, 186, cx + 116, 216), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: rl }, { p: tube([[cx - 126, 188, 4], [cx + 116, 188, 4]]), c: Bn.LOGD, m: 'wood', line: 0.6 });
      out.push(...bwin(cx - 66, 164, 13, 14), ...bwin(cx + 60, 164, 13, 14));
      out.push(...ladder(cx + 60, 226, cx + 130, g));
      out.push(...hideFrame(cx - 40, g - 70, 22, 30, '#a07a50'), ...hideFrame(cx + 170, g - 60, 18, 26, '#c49a68'));
      out.push({ p: tube([[cx - 110, 90, 3], [cx - 90, 170, 3]]), c: '#1a1208', m: 'wood', line: 0 });
      return out;
    },
    // 6. Медвежья берлога: мшистый холм, пещера, поваленная ель, череп медведя
    (cx, g) => {
      const out = [];
      out.push(...pine(cx + 140, 190, 180, 44), ...pine(cx - 150, 220, 150, 40));
      out.push({ p: [P(cx - 210, g, 1), [cx - 190, g - 120], [cx - 120, g - 220], [cx, g - 250], [cx + 120, g - 220], [cx + 196, g - 120], P(cx + 214, g, 1)], c: '#5a7a34', m: 'fur', furLen: 0.9, flow: PI / 2, line: 1.2, belly: 0.35, sub: [{ p: [[cx + 60, g - 260], [cx + 230, g - 110], [cx + 230, g + 6], [cx + 100, g + 6]], c: '#44602a', m: 'flat', line: 0 }] });
      for (const [x, y, w, h] of [[cx - 150, g - 20, 30, 34], [cx + 150, g - 16, 34, 30], [cx - 96, g - 110, 20, 18]]) out.push(stoneS(x, y, w, h, false));
      out.push({ p: arch(cx, g + 4, 86, 164), c: '#8a8578', m: 'horn', gloss: 0.2, line: 1.2 }, { p: arch(cx, g, 70, 140), c: '#120c06', m: 'cloth', line: 1, ao: 1.5 });
      out.push({ e: [cx - 14, g - 60, 4.5, 3], c: '#ffb030', m: 'gem', line: 0 }, { e: [cx + 14, g - 60, 4.5, 3], c: '#ffb030', m: 'gem', line: 0 }); lit(cx, g - 60);
      out.push({ p: tube([[cx - 200, g - 210, 22], [cx + 40, g - 256, 18], [cx + 180, g - 250, 12]]), c: Bn.BARK, m: 'wood', flow: 0, line: 1 }, { e: [cx - 200, g - 210, 12, 12], c: Bn.LOGL, m: 'wood', line: 0.8 });
      out.push(...skull(cx, g - 186, 26, { c: '#ece2c8' }));
      for (const s of [-1, 1]) out.push({ e: [cx + s * 22, g - 208, 9, 8], c: '#ece2c8', m: 'horn', line: 0.8 });
      out.push({ p: box(cx + 90, g - 150, cx + 140, g - 80), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: [0, 1, 2].map(i => ({ p: [[cx + 96 + i * 14, g - 146], [cx + 106 + i * 14, g - 90]], w: 5, c: '#2a3a18', a: 0.8 })) });
      return out;
    },
    // 7. Оленья поляна: священный дуб, круг камней, арка из гигантских рогов
    (cx, g) => {
      const out = [];
      out.push(...oak(cx + 150, g - 60, 200, 130, 110, 23, { w: 24, n: 6 }));
      out.push({ e: [cx, g - 170, 190, 150], c: '#c8fff0', m: 'flat', line: 0, op: 0.18 });
      for (const [x, w, h] of [[cx - 230, 22, 90], [cx - 170, 18, 70], [cx + 170, 18, 74], [cx + 236, 22, 92]]) out.push(stoneS(x, g, w, h, true));
      // арка: два резных столба и рога великого оленя
      for (const s of [-1, 1]) out.push({ p: tube([[cx + s * 90, g, 26], [cx + s * 86, 170, 22]]), c: '#8a5a30', m: 'wood', flow: -PI / 2, line: 1.1, lines: [{ p: [[cx + s * 86 - 12, 250], [cx + s * 86 + 12, 250]], w: 5, c: Bn.RED, a: 0.9 }, { p: [[cx + s * 88 - 12, 320], [cx + s * 88 + 12, 320]], w: 5, c: '#2a4a6a', a: 0.9 }] });
      out.push({ p: tube([[cx - 110, 176, 16], [cx, 160, 18], [cx + 110, 176, 16]]), c: '#7a4a24', m: 'wood', flow: 0, line: 1.1 });
      out.push(...antler(cx - 20, 150, -1, 170, '#f0e6cc'), ...antler(cx + 20, 150, 1, 170, '#f0e6cc'), ...skull(cx, 150, 30, { c: '#f4ecd8' }));
      out.push({ e: [cx - 11, 150, 5, 5], c: Bn.RUNE, m: 'gem', line: 0 }, { e: [cx + 11, 150, 5, 5], c: Bn.RUNE, m: 'gem', line: 0 }); lit(cx, 150);
      out.push(...firebowl(cx - 100, g), ...firebowl(cx + 100, g));
      out.push({ e: [cx, g - 8, 60, 12], c: '#6a9a3a', m: 'fur', furLen: 0.4, flow: -PI / 2, line: 0.8 });
      return out;
    },
  ];

  /* ---------- Бастион: укрепления — частокол, ворота между вышками ---------- */
  const bWallSeg = (x0, x1, g, top) => [palis(x0, x1, top, g, 26, { bands: [top + 70, g - 40] })];
  function bGate(cx, g, top) {
    const out = [];
    for (const s of [-1, 1]) out.push(...watch(cx + s * 96, g, top, 46));
    const h = Math.min(160, (g - top) * 0.62);
    out.push({ p: box(cx - 60, g - h - 24, cx + 60, g), c: Bn.LOGD, m: 'wood', flow: -PI / 2, line: 1.2 });
    out.push({ p: box(cx - 50, g - h, cx + 50, g), c: '#7a4a24', m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(cx - 50, g - h, cx + 50, g, 14, true, 0.5).concat([{ p: [[cx - 50, g - h * 0.3], [cx + 50, g - h * 0.3]], w: 5, c: IRON, a: 0.9 }, { p: [[cx - 50, g - h * 0.72], [cx + 50, g - h * 0.72]], w: 5, c: IRON, a: 0.9 }, { p: [[cx, g - h], [cx, g]], w: 3, a: 0.8 }]) });
    out.push(...antler(cx - 8, g - h - 20, -1, 50), ...antler(cx + 8, g - h - 20, 1, 50), ...skull(cx, g - h - 12, 14));
    return out;
  }

  /* ================================= регистрация ================================= */
  const FAC = {
    factory: {
      hall: fHall, guild: fGuild, tavern: fTavern, blacksmith: fSmith, market: fMarket, silo: fSilo, special: fSpecial, dwell: fDwell,
      fort: (cx, g) => [...fWallSeg(20, 960, g, 150), ...fGate(cx, g, 96)],
      citadel: (cx, g) => [...fWallSeg(20, 960, g, 270), ...fTower(110, g, 150, 52), ...fTower(870, g, 150, 52), ...fGate(cx, g, 200)],
      castle: (cx, g) => [...fWallSeg(20, 960, g, 460), ...fTower(110, g, 300, 56), ...fTower(870, g, 300, 56),
        ...stack(cx - 70, 40, 300, 14, 18, { smoke: 18 }), ...stack(cx + 70, 40, 300, 14, 18, {}), brk(cx - 96, 170, cx + 96, 420, { p: falseTop(cx - 96, cx + 96, 150, 420, 16), k: 0.2 }), ...gear(cx, 220, 30, 12, F.BRS), ...awin(cx - 56, 330, 12, 40, FWIN), ...awin(cx + 56, 330, 12, 40, FWIN), ...fGate(cx, g, 400)],
    },
    hive: {
      hall: hHall, guild: hGuild, tavern: hTavern, blacksmith: hSmith, market: hMarket, silo: hSilo, special: hSpecial, dwell: hDwell,
      fort: (cx, g) => [...hWallSeg(20, 960, g, 150), ...hGate(cx, g, 110)],
      citadel: (cx, g) => [...hWallSeg(20, 960, g, 270), ...hTower(120, g, 40, 40), ...hTower(860, g, 40, 40), ...hGate(cx, g, 220)],
      castle: (cx, g) => [...hWallSeg(20, 960, g, 460), ...hTower(120, g, 210, 44), ...hTower(860, g, 210, 44), wdome(cx, 470, 106, 300, { comb: true }), cell(cx - 44, 290, 15), cell(cx + 44, 290, 15), cell(cx, 230, 14), ...antenna(cx - 8, 172, -34, 60), ...antenna(cx + 8, 172, 34, 60), ...hGate(cx, g, 420)],
    },
    bastion: {
      hall: bHall, guild: bGuild, tavern: bTavern, blacksmith: bSmith, market: bMarket, silo: bSilo, special: bSpecial, dwell: bDwell,
      fort: (cx, g) => [...bWallSeg(20, 960, g, 140), ...bGate(cx, g, 110)],
      citadel: (cx, g) => [...bWallSeg(20, 960, g, 260), ...watch(110, g, 100, 56), ...watch(870, g, 100, 56), ...bGate(cx, g, 200)],
      castle: (cx, g) => [...bWallSeg(20, 960, g, 450), ...watch(110, g, 270, 60), ...watch(870, g, 270, 60),
        ...logWall(cx - 110, 290, cx + 110, 440, { ends: false }), sod(cx - 110, cx + 110, 296, 96, 16, 76), ...gableF(cx, 302, 70, 90), ...antler(cx - 10, 196, -1, 56), ...antler(cx + 10, 196, 1, 56), ...skull(cx, 206, 14), ...bwin(cx - 78, 340, 12, 14), ...bwin(cx + 78, 340, 12, 14), ...bGate(cx, g, 420)],
    },
  };
  for (const fac in FAC) {
    const S = FAC[fac];
    for (let i = 1; i <= 4; i++) { if (S.hall) B(fac, 'hall_' + i, S.hall(i)); if (S.guild) B(fac, 'guild_' + i, S.guild(i)); }
    for (const id of ['tavern', 'blacksmith', 'market', 'silo', 'special', 'fort', 'citadel', 'castle']) if (S[id]) B(fac, id, S[id]);
    if (S.dwell) S.dwell.forEach((fn, i) => B(fac, 'dwell_' + (i + 1), fn));
  }
})(typeof window !== 'undefined' ? window : globalThis);
