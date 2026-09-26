/* ============================================================================
   view/vec_tb_b.js — постройки экрана города: Инферно, Некрополис, Подземелье.

   Своя архитектура фракции вместо общих построек bld_* (vec_towns.js):
   экран города (townscene.js) берёт 'bld_<id>@<фракция>', если он описан,
   и выключает поверх него декоративные «черты фракции».

   Рамка каждой постройки — от общей (K.frameOf('bld_…')), поэтому рисунок
   встаёт на то же место сцены (центр-низ = якорь). Единицы — дизайн-единицы
   (10 на клетку старого спрайта); на сцене 5 единиц = 1 точка.
   Окна, двери-огни и жаровни регистрируют себя в meta.lights: ночью экран
   города зажигает там тёплый свет.

   Инферно   — чёрный камень, красные крыши-клыки, рога, шипы, лава и огонь.
   Некрополис — тёмный камень, иглы-шпили, кость, черепа, фиолетовые огни.
   Подземелье — скалы, пурпур, пещерные своды, грибы, кристаллы.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf } = K;

  /* ============================== ОБЩИЕ ПОМОЩНИКИ ============================== */
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  /** Трапеция по центру: верх полуширины w0 на y0, низ полуширины w1 на y1. */
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  /** Арка: низ y1, полуширина w, полная высота h; pointed — стрельчатая. */
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  /** Кладка: ряды высотой rh, камни шириной bw вразбежку (обрежутся по форме). */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 1.8;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push({ p: [[x0, y], [x1, y]], w, a });
    let row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  /** Клинчатые камни арки. */
  function voussoirs(cx, cy, r, n) {
    const out = [];
    for (let i = 1; i < n; i++) { const a = Math.PI + i / n * Math.PI; out.push({ p: [[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12]], w: 1.8, a: 0.5 }); }
    return out;
  }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const range = (n, f) => Array.from({ length: n }, (_, i) => f(i));

  /* ---------- огни: окна и жаровни сами записываются в meta.lights ---------- */
  let LIT = null;
  const lit = (x, y) => { if (LIT) LIT.push([Math.round(x), Math.round(y)]); };
  /** Не больше n огней: равномерно по списку. */
  const thin = (a, n) => a.length <= n ? a : range(n, i => a[Math.floor(i * a.length / n)]);
  /**
   * Постройка фракции: рамка общей постройки base, рисунок build(g, fr) → формы (можно вложенными массивами).
   * Регистрирует 'base@fid'.
   */
  function bdef(base, fid, build) {
    const fr = frameOf(base); if (!fr) return;
    LIT = [];
    let shapes, lights;
    try { shapes = build(fr.anchor[1], fr).flat(Infinity).filter(Boolean); } finally { lights = LIT; LIT = null; }
    V.def(base + '@' + fid, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { lights: thin(lights, 16) } });
  }

  /* ---------- архитектура (цвета — из стиля S) ---------- */
  /** Стена-коробка: тёмная правая сторона, кладка (или свои штрихи o.lines). */
  function wallB(S, x0, y0, x1, y1, o) {
    o = o || {};
    return { p: o.p || box(x0, y0, x1, y1), c: o.c || S.wall, m: 'cloth', line: 1.2, belly: 0.22, id: o.id,
      sub: [{ p: box(x1 - (x1 - x0) * (o.k || 0.18), y0 - 60, x1 + 4, y1 + 4), c: o.d || S.wallD, m: 'flat', line: 0 }].concat(o.sub || []),
      lines: (o.mason === false ? [] : masonry(x0, y0, x1, y1, o.rh || 24, o.bw || 40, o.ma || 0.42, 2.4)).concat(o.lines || []) };
  }
  /** Окно-проём со светом; стрельчатое (или o.round), с рамой-обрамлением. Записывает огонь. */
  function win(S, cx, y1, w, h, o) {
    o = o || {}; if (o.lit !== false) lit(cx, y1 - h * 0.4);
    const pointed = !o.round, c = o.c || S.win, lc = S.winLC, out = [];
    if (o.frame !== false) out.push({ p: arch(cx, y1 + 3, w + 4, h + 6, pointed), c: o.fc || S.trim, m: 'cloth', line: 1 });
    out.push({ p: arch(cx, y1, w, h, pointed), c, m: 'gem', gloss: 0.5, rim: 0, line: 1, lc,
      sub: [{ p: box(cx - w - 2, y1 - h * 0.42, cx + w + 2, y1 + 2), c: tone(c, 0.25), m: 'flat', line: 0 }],
      lines: o.bars === false ? [] : [{ p: [[cx, y1 - h + 3], [cx, y1]], w: Math.max(1.6, w * 0.26), c: lc, a: 0.9 }, { p: [[cx - w, y1 - h * 0.45], [cx + w, y1 - h * 0.45]], w: Math.max(1.4, w * 0.2), c: lc, a: 0.85 }] });
    return out;
  }
  /** Круглое окно-розетка. */
  function rose(S, cx, cy, r, o) {
    o = o || {}; lit(cx, cy);
    const c = o.c || S.win, lines = [];
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; lines.push({ p: [[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], w: 2.2, c: S.winLC, a: 0.9 }); }
    lines.push({ p: ell(cx, cy, r * 0.45, r * 0.45, 12).concat([[cx + r * 0.45, cy]]), w: 2.2, c: S.winLC, a: 0.9 });
    return [{ e: [cx, cy, r + 5, r + 5], c: o.fc || S.trim, m: 'cloth', line: 1 }, { e: [cx, cy, r, r], c, m: 'gem', gloss: 0.7, rim: 0, line: 1, lc: S.winLC, lines }];
  }
  /** Дверь: обрамление-арка, створки (или светящийся проём o.glow), фонарь o.lamp. */
  function door(S, cx, base, w, h, o) {
    o = o || {}; const pt = !o.round;
    const out = [{ p: arch(cx, base, w + 8, h + 8, pt), c: o.fc || S.trim, m: 'cloth', line: 1.1, lines: voussoirs(cx, base - h + w, w + 4, 6) }];
    if (o.glow) { lit(cx, base - h * 0.35); out.push({ p: arch(cx, base, w, h, pt), c: o.glow, m: 'gem', gloss: 0.6, rim: 0, line: 1, sub: [{ p: box(cx - w, base - h * 0.45, cx + w, base + 2), c: tone(o.glow, 0.35), m: 'flat', line: 0 }] }); }
    else out.push({ p: arch(cx, base, w, h, pt), c: o.c || S.door, m: 'wood', flow: -Math.PI / 2, line: 1.1,
      lines: [{ p: [[cx, base - h], [cx, base]], w: 2.4, a: 0.8 }, { p: [[cx - w, base - h * 0.3], [cx + w, base - h * 0.3]], w: 3.2, c: S.iron, a: 0.9 }, { p: [[cx - w, base - h * 0.64], [cx + w, base - h * 0.64]], w: 3.2, c: S.iron, a: 0.9 }] });
    if (o.lamp) { lit(o.lamp[0], o.lamp[1]); out.push({ e: [o.lamp[0], o.lamp[1], 6, 6], c: S.lamp || S.win, m: 'gem', gloss: 1, line: 1 }); }
    return out;
  }
  /** Вальмовая крыша над x0…x1: низ y, высота h, свес e, срез боков inset. */
  function hip(S, x0, x1, y, h, e, inset, o) {
    o = o || {}; const rows = [];
    for (let k = 1; k < 4; k++) { const yy = y - h * k / 4, dx = inset * k / 4; rows.push({ p: [[x0 - e + dx, yy], [x1 + e - dx, yy]], w: 2.6, a: 0.45 }); }
    for (let x = x0 + 10; x < x1; x += 30) rows.push({ p: [[x, y - h * 0.02], [x + (x - (x0 + x1) / 2) * -0.08, y - h + 4]], w: 1.6, a: 0.25 });
    return { p: [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)], c: o.c || S.roof, m: 'leather', gloss: 0.3, line: 1.2, lines: rows,
      sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.18, y - h - 2, 1), P(x1 + e + 2, y - h - 2, 1), P(x1 + e + 2, y + 2, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.3, y + 2, 1)], c: o.cd || S.roofD, m: 'flat', line: 0 }] };
  }
  /** Крутой фронтон-щипец (треугольная крыша спереди). */
  function gableR(S, x0, x1, y, h, e, o) {
    o = o || {}; const cx = (x0 + x1) / 2, rows = [];
    for (const t of [0.25, 0.5, 0.75]) rows.push({ p: [[x0 - e + (cx - x0 + e) * t, y - h * t], [x1 + e - (x1 + e - cx) * t, y - h * t]], w: 2.4, a: 0.4 });
    return { p: [P(x0 - e, y, 1), [x0 - e + (cx - x0) * 0.5, y - h * (o.bow || 0.46)], P(cx, y - h, 1), [x1 + e - (x1 - cx) * 0.5, y - h * (o.bow || 0.46)], P(x1 + e, y, 1)], c: o.c || S.roof, m: 'leather', gloss: 0.3, line: 1.2, lines: rows,
      sub: [{ p: [P(cx + 2, y - h - 4, 1), P(x1 + e + 6, y + 2, 1), P(cx + (x1 - cx) * 0.2, y + 4, 1)], c: o.cd || S.roofD, m: 'flat', line: 0 }] };
  }
  /** Коническая крыша: основание y (полуширина hw), высота h; flare > 0 — вогнутые скаты (клык, игла). */
  function cone(cx, y, hw, h, c, cd, o) {
    o = o || {}; const f = o.flare === undefined ? 0.06 : o.flare, L = o.lean || 0;
    const at = (t, s) => [cx + s * hw * (1 - t) + L * t, y - h * t];
    const rows = [];
    for (const t of [0.2, 0.4, 0.6, 0.8]) { const [xl, yy] = at(t, -1), xr = at(t, 1)[0]; rows.push({ p: [[xl, yy], [(xl + xr) / 2, yy + hw * (1 - t) * 0.16], [xr, yy]], w: 2, a: 0.4 }); }
    rows.push({ p: [[cx - hw * 0.25, y - h * 0.1], [cx - hw * 0.08 + L * 0.8, y - h * 0.8]], w: 2, light: true, a: 0.5 });
    return [{ p: [P(cx - hw, y, 1), [cx - hw * (0.58 - f) + L * 0.42, y - h * 0.42], P(cx + L, y - h, 1), [cx + hw * (0.58 - f) + L * 0.42, y - h * 0.42], P(cx + hw, y, 1), [cx, y + hw * 0.14]], c, m: o.m || 'leather', gloss: 0.35,
      sub: [{ p: [P(cx + hw * 0.08 + L, y - h, 1), P(cx + hw * 1.2, y - 2, 1), P(cx + hw * 1.1, y + hw * 0.3, 1), P(cx + hw * 0.2, y + hw * 0.3, 1)], c: cd, m: 'flat', line: 0 }], lines: rows }];
  }
  /** Зубчатый парапет. */
  function merlons(x0, x1, y, mh, st, c, o) {
    o = o || {}; const ph = o.ph || 10, pts = [P(x0, y + ph, 1), P(x0, y - mh, 1)];
    const mw = st * (o.k || 0.56), n = Math.max(1, Math.round((x1 - x0 - mw) / st)), s = (x1 - x0 - mw) / n;
    for (let i = 0; i <= n; i++) { const x = x0 + i * s; if (i) pts.push(P(x, y, 1), P(x, y - mh, 1)); if (o.pointy) pts.push(P(x + mw / 2, y - mh - o.pointy, 1)); pts.push(P(x + mw, y - mh, 1)); if (i < n) pts.push(P(x + mw, y, 1)); }
    pts.push(P(x1, y - mh, 1), P(x1, y + ph, 1));
    return { p: pts, c, m: 'cloth', line: 1, lines: [{ p: [[x0, y + ph - 2], [x1, y + ph - 2]], w: 2, a: 0.5 }] };
  }
  /** Гребень шипов: полоса y…y+12 и зубья высотой h с шагом st. */
  function spikes(x0, x1, y, h, st, c, o) {
    o = o || {}; const pts = [P(x0, y + (o.ph || 12), 1)];
    let i = 0;
    for (let x = x0; x < x1 - st * 0.5; x += st, i++) { const hh = h * (o.vary && i % 2 ? 0.6 : 1); pts.push(P(x, y, 1), [x + st * 0.36, y - hh * 0.45], P(x + st * 0.5, y - hh, 1), [x + st * 0.64, y - hh * 0.45], P(x + st, y, 1)); }
    pts.push(P(x1, y + (o.ph || 12), 1));
    return { p: pts, c, m: 'horn', gloss: 0.35, line: 1 };
  }
  /** Рог: основание (cx, y), s — в какую сторону загибается, длина L. */
  function horn(cx, y, s, L, c) {
    return { p: tube([[cx, y, L * 0.26], [cx + s * L * 0.5, y - L * 0.22, L * 0.19], [cx + s * L * 0.7, y - L * 0.66, L * 0.1], [cx + s * L * 0.56, y - L, L * 0.02]]), c, m: 'horn', gloss: 0.6, line: 0.9,
      lines: [0.25, 0.45, 0.65].map(t => ({ p: [[cx + s * L * 0.62 * t, y - L * 0.5 * t - 8], [cx + s * L * 0.62 * t + s * 6, y - L * 0.5 * t + 6]], w: 1.6, a: 0.45 })) };
  }
  /** Череп: центр (cx, cy), радиус r; o.horns — рога, o.glow — светящиеся глазницы. */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || '#e8e0c8', out = [], eye = o.glow || '#1a1210';
    if (o.horns) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * r * 0.7, cy - r * 0.4, r * 0.45], [cx + s * r * 1.5, cy - r * 0.9, r * 0.32], [cx + s * r * 1.9, cy - r * 1.8, r * 0.1]]), c: o.hornC || '#6a5a50', m: 'horn', line: 0.8 });
    if (o.glow) lit(cx, cy);
    out.push({ p: [[cx - r, cy - r * 0.1], [cx - r * 0.8, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.8, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.6, cy + r * 0.45], P(cx + r * 0.45, cy + r * 0.95, 1), P(cx - r * 0.45, cy + r * 0.95, 1), [cx - r * 0.6, cy + r * 0.45]], c, m: 'horn', gloss: 0.3, line: 0.9,
      lines: [{ p: [[cx - r * 0.38, cy - r * 0.05], [cx - r * 0.32, cy + r * 0.05]], w: r * 0.42, c: eye, a: 1 }, { p: [[cx + r * 0.38, cy - r * 0.05], [cx + r * 0.32, cy + r * 0.05]], w: r * 0.42, c: eye, a: 1 },
        { p: [[cx, cy + r * 0.25], [cx, cy + r * 0.4]], w: r * 0.16, c: '#1a1210', a: 0.9 }, { p: [[cx - r * 0.3, cy + r * 0.75], [cx + r * 0.3, cy + r * 0.75]], w: r * 0.1, c: '#3a3028', a: 0.8 }] });
    return out;
  }
  /** Язык пламени: основание (x, y), полуширина w, высота h; o.c/o.core — цвета, o.lean — наклон. */
  function flame(x, y, w, h, o) {
    o = o || {}; const L = o.lean || 0;
    return [{ p: [P(x - w, y, 1), [x - w * 0.95 + L * 0.2, y - h * 0.35], [x - w * 0.35 + L * 0.5, y - h * 0.62], P(x - w * 0.1 + L, y - h, 1), [x + w * 0.3 + L * 0.6, y - h * 0.6], P(x + w * 0.5 + L * 0.5, y - h * 0.78, 1), [x + w * 0.9 + L * 0.2, y - h * 0.35], P(x + w, y, 1), [x, y + w * 0.25]], c: o.c || '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.6, lc: o.lc || '#8a2a0a', op: o.op,
      sub: [{ p: [P(x - w * 0.55, y + 2, 1), [x - w * 0.45 + L * 0.2, y - h * 0.3], P(x - w * 0.05 + L * 0.55, y - h * 0.6, 1), [x + w * 0.38 + L * 0.2, y - h * 0.3], P(x + w * 0.55, y + 2, 1)], c: o.core || '#ffe08a', m: 'flat', line: 0 }] }];
  }
  /** Мягкий ореол света (рисуется плоско с прозрачностью). */
  const halo = (cx, cy, rx, ry, c) => ({ e: [cx, cy, rx, ry], c, m: 'flat', line: 0 });
  /** Кристалл-призма: основание (x, y), полуширина w, высота h, наклон lean. */
  function crystal(x, y, w, h, c, lean) {
    const l = (lean || 0) * h;
    return { p: [P(x - w, y, 1), P(x - w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y, 1)], c, m: 'gem', gloss: 1.1, rim: 0.7, line: 0.8,
      sub: [{ p: [P(x + l * 0.5, y + 2, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y + 2, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.3, y - 4], [x - w * 0.3 + l * 0.8, y - h * 0.8]], w: 2, light: true, a: 0.7 }] };
  }
  /** Друза: несколько кристаллов веером. */
  const druse = (x, y, s, c, c2) => [crystal(x - s * 0.5, y, s * 0.2, s * 0.7, c2 || c, -0.35), crystal(x + s * 0.5, y, s * 0.2, s * 0.6, c2 || c, 0.35), crystal(x, y, s * 0.26, s, c, 0.04)];
  /** Скальный массив с гранями: от x0 до x1, земля G, вершина около top. */
  function crag(x0, x1, G, top, seed, o) {
    o = o || {}; const r = rngOf(seed), n = o.n || 8, pts = [P(x0, G, 1)], lines = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, hump = Math.pow(Math.sin(t * Math.PI * (o.half ? 0.5 : 1) + (o.half === 'r' ? Math.PI * 0.5 : 0)), o.pow || 0.7);
      const y = G - (G - top) * (0.2 + 0.8 * hump) * (0.86 + r() * 0.28);
      pts.push(i % 2 ? P(x, y, 1) : [x, y]);
      if (i && i < n && r() < 0.7) lines.push({ p: [[x, y + 10], [x + (r() - 0.5) * 30, y + (G - y) * 0.4], [x + (r() - 0.5) * 20, y + (G - y) * (0.6 + r() * 0.3)]], w: 2.2, a: 0.45 });
    }
    pts.push(P(x1, G, 1));
    return { p: pts, c: o.c || '#4a4252', m: 'horn', gloss: 0.12, line: 1.1, belly: 0.35, lines: lines.concat(o.lines || []), sub: o.sub };
  }
  /** Гриб: ножка от земли (x, G) высотой h, шляпка радиуса r. */
  function mushroom(x, G, h, r, cap, o) {
    o = o || {}; const L = o.lean || 0, cy = G - h, spots = [];
    const rr = rngOf(Math.round(x * 7 + h));
    for (let i = 0; i < (o.spots === undefined ? 4 : o.spots); i++) spots.push({ e: [x + L + (rr() - 0.5) * r * 1.3, cy - r * (0.15 + rr() * 0.3), r * 0.12, r * 0.08], c: tone(cap, 0.55), m: 'flat', line: 0 });
    if (o.glow) lit(x + L, cy);
    return [{ p: tube([[x, G, r * 0.3], [x + L * 0.6, G - h * 0.5, r * 0.22], [x + L, cy, r * 0.2]]), c: o.stem || '#d8ccbc', m: 'skin', line: 0.8 },
      { p: [P(x + L - r, cy + r * 0.12, 1), [x + L - r * 0.86, cy - r * 0.34], [x + L - r * 0.4, cy - r * 0.6], [x + L, cy - r * 0.64], [x + L + r * 0.4, cy - r * 0.6], [x + L + r * 0.86, cy - r * 0.34], P(x + L + r, cy + r * 0.12, 1), [x + L, cy + r * 0.02]], c: cap, m: o.glow ? 'gem' : 'skin', gloss: 0.6, line: 1,
        sub: spots.concat([{ p: [P(x + L - r, cy + r * 0.12, 1), P(x + L + r, cy + r * 0.12, 1), [x + L, cy + r * 0.25]], c: tone(cap, -0.4), m: 'flat', line: 0 }]) }];
  }
  /** Башня: тело (сужение кверху), кладка, окна; верх — крыша стиля (S.spire), 'crenel', 'spikes', 'none'. Возвращает массив с .apex. */
  function tower(S, cx, base, hw, h, o) {
    o = o || {};
    const top = base - h, tw = hw * (1 - (o.taper === undefined ? 0.06 : o.taper)), out = [];
    out.push({ p: trap(cx, top, base, tw, hw), c: o.wall || S.wall, m: 'cloth', line: 1.1,
      sub: [{ p: [P(cx + tw * 0.4, top - 2, 1), P(cx + hw + 4, top - 2, 1), P(cx + hw + 4, base + 2, 1), P(cx + hw * 0.4, base + 2, 1)], c: o.shade || S.wallD, m: 'flat', line: 0 }],
      lines: (o.mason === false ? [] : masonry(cx - hw, top, cx + hw, base, o.rh || 22, o.bw || hw * 0.9, 0.4, 2.2)).concat(o.lines || []) });
    for (const y of o.win || []) out.push(...win(S, cx, y, o.winW || Math.max(6, hw * 0.24), o.winH || Math.max(16, hw * 0.62), { frame: o.winFrame }));
    const t = o.top || 'roof'; let apex = top;
    if (t === 'roof') { const rh = o.roofH || hw * 2.4; out.push(...S.spire(cx, top + 2, tw + (o.eave === undefined ? 6 : o.eave), rh, o)); apex = top + 2 - rh; }
    else if (t === 'crenel') { out.push(merlons(cx - tw - 6, cx + tw + 6, top - 2, 14, (tw * 2 + 12) / 3.6, o.wall || S.wall, { ph: 12, pointy: o.pointy })); apex = top - 16; }
    else if (t === 'spikes') { out.push(spikes(cx - tw - 6, cx + tw + 6, top, o.sh || 22, (tw * 2 + 12) / (o.ns || 4), S.iron)); apex = top - (o.sh || 22); }
    out.apex = [cx + (t === 'roof' ? o.lean || 0 : 0), apex];
    return out;
  }
  /** Ступени/цоколь: n ступеней от земли G, ширина сверху w0, снизу w1. */
  function steps(S, cx, G, n, sh, w0, w1, c) {
    const out = [];
    for (let i = 0; i < n; i++) { const w = w1 - (w1 - w0) * i / Math.max(1, n - 1); out.push({ p: box(cx - w, G - sh * (i + 1), cx + w, G - sh * i), c: c || S.trim, m: 'cloth', line: 1, lines: [{ p: [[cx - w, G - sh * (i + 1) + 2], [cx + w, G - sh * (i + 1) + 2]], w: 1.6, light: true, a: 0.4 }] }); }
    return out;
  }
  /** Лужа/озеро лавы (или светящейся жижи): эллипс с ядром и бликами. */
  function pool(cx, cy, rx, ry, c, core, lc) {
    const lines = range(5, i => { const x = cx - rx * 0.6 + i * rx * 0.3, y = cy - ry * 0.3 + ((i * 37) % 5) * ry * 0.12; return { p: [[x, y], [x + rx * 0.14, y - 1]], w: 2.2, light: true, a: 0.7 }; });
    return { e: [cx, cy, rx, ry], c, m: 'gem', gloss: 0.8, rim: 0, line: 1, lc: lc || tone(c, -0.6), lines, sub: [{ e: [cx - rx * 0.08, cy - ry * 0.1, rx * 0.62, ry * 0.5], c: core, m: 'flat', line: 0 }] };
  }

  /* ================================== ИНФЕРНО ================================== */
  const INF = {
    wall: '#46322e', wallD: '#241614', trim: '#2e1e1c', roof: '#b02a1c', roofD: '#5c1410', win: '#ffa040', winLC: '#3a0e04',
    door: '#3a1a12', iron: '#2a2022', horn: '#8a7868', lava: '#ff6a1a', lavaC: '#ffd060', gold: '#c8902a', lamp: '#ffb050',
  };
  /** Крыша-клык: вогнутый красный конус, чёрное жало на вершине, крючья-рога у свеса. */
  INF.spire = (cx, y, hw, h, o) => {
    o = o || {}; const L = o.lean || 0;
    const out = cone(cx, y, hw, h, INF.roof, INF.roofD, { flare: 0.22, lean: L });
    out.push({ p: tube([[cx + L, y - h + Math.min(18, h * 0.2), hw * 0.14], [cx + L * 1.1, y - h - hw * 0.55, 1]]), c: INF.iron, m: 'horn', gloss: 0.5, line: 0.8 });
    if (o.hooks !== false) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * hw * 0.84, y - 3, hw * 0.13], [cx + s * hw * 1.18, y - hw * 0.14, hw * 0.08], [cx + s * hw * 1.26, y - hw * 0.5, 0.8]]), c: INF.iron, m: 'horn', gloss: 0.5, line: 0.7 });
    return out;
  };
  /** Раскалённые трещины в камне: зигзаги лавы (штрихи). */
  function veins(x0, y0, x1, y1, seed, n) {
    const r = rngOf(seed), out = [];
    for (let i = 0; i < (n || 4); i++) {
      let x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0) * 0.6; const pts = [[x, y]];
      for (let k = 0; k < 3; k++) { x += (r() - 0.5) * 30; y += 12 + r() * 18; pts.push([x, y]); }
      out.push({ p: pts, w: 3.2, c: '#ff5a1a', a: 0.85 }, { p: pts, w: 1.2, c: '#ffd070', a: 0.9 });
    }
    return out;
  }
  /** Жаровня на треноге: основание (x, G), высота h. */
  function brazier(x, G, h, k) {
    k = k || 1; const bw = 20 * k, by = G - h; lit(x, by - 14 * k);
    return [halo(x, by - 18 * k, 34 * k, 30 * k, 'rgba(255,120,40,0.22)'),
      { p: tube([[x - 12 * k, G, 3.5 * k], [x, by + 10 * k, 3 * k]]), c: INF.iron, m: 'steel', line: 0.6 }, { p: tube([[x + 12 * k, G, 3.5 * k], [x, by + 10 * k, 3 * k]]), c: INF.iron, m: 'steel', line: 0.6 },
      { p: tube([[x, G - 4, 4 * k], [x, by + 6, 4 * k]]), c: INF.iron, m: 'steel', line: 0.6 },
      ...flame(x, by - 2, bw * 0.8, 44 * k),
      { p: [P(x - bw, by - 4, 1), P(x + bw, by - 4, 1), [x + bw * 0.7, by + 8 * k], P(x, by + 12 * k, 1), [x - bw * 0.7, by + 8 * k]], c: INF.iron, m: 'steel', gloss: 0.7, line: 0.9,
        sub: [{ p: box(x - bw, by - 6, x + bw, by - 1), c: INF.lava, m: 'flat', line: 0 }] }];
  }
  /** Рогатый череп-герб демона. */
  const demonMask = (cx, cy, r) => skull(cx, cy, r, { horns: true, c: '#c8b8a0', hornC: '#3a2a26', glow: '#ff7a24' });
  /** Лавовый желоб у подножия: полоса x0…x1 на земле G. */
  const lavaStrip = (x0, x1, G, hh) => ({ p: [P(x0, G, 1), [x0 + 6, G - hh], [(x0 + x1) / 2, G - hh - 2], [x1 - 6, G - hh], P(x1, G, 1), [(x0 + x1) / 2, G + 3]], c: INF.lava, m: 'gem', gloss: 0.8, rim: 0, line: 1, lc: '#5a1408',
    sub: [{ p: box(x0, G - hh * 0.5, x1, G + 2), c: INF.lavaC, m: 'flat', line: 0 }] });
  const sw = (S, x0, y0, x1, y1, seed, o) => wallB(S, x0, y0, x1, y1, Object.assign({ lines: veins(x0, y0, x1, y1, seed, 3) }, o));

  /* ---------- ратуша: от чёрной управы до рогатого капитолия ---------- */
  bdef('bld_hall_1', 'inferno', g => [
    tower(INF, 332, 232, 28, 142, { roofH: 76, win: [168], winW: 7, winH: 22, mason: false }),
    sw(INF, 60, 184, 360, g, 11), hip(INF, 60, 360, 190, 78, 14, 64), spikes(130, 290, 110, 18, 20, INF.iron),
    { p: box(54, 184, 366, 196), c: INF.trim, m: 'cloth', line: 1 },
    win(INF, 108, 270, 12, 36), win(INF, 312, 270, 12, 36), win(INF, 108, 340, 11, 30), win(INF, 312, 340, 11, 30),
    demonMask(210, 226, 20),
    door(INF, 210, g, 26, 96, { glow: INF.lava }),
    brazier(26, g, 54), brazier(394, g, 54),
  ]);
  bdef('bld_hall_2', 'inferno', g => [
    tower(INF, 74, 262, 32, 162, { roofH: 84, win: [168], winW: 7, winH: 22, mason: false }),
    tower(INF, 386, 262, 32, 162, { roofH: 84, win: [168], winW: 7, winH: 22, mason: false }),
    sw(INF, 46, 206, 414, g, 12), hip(INF, 46, 414, 212, 90, 14, 88), spikes(140, 320, 124, 20, 20, INF.iron),
    { p: box(40, 206, 420, 218), c: INF.trim, m: 'cloth', line: 1 },
    win(INF, 112, 290, 13, 38), win(INF, 348, 290, 13, 38), win(INF, 112, 380, 12, 34), win(INF, 348, 380, 12, 34),
    demonMask(230, 262, 22),
    door(INF, 230, g, 30, 112, { glow: INF.lava }),
    brazier(18, g, 60), brazier(442, g, 60),
  ]);
  bdef('bld_hall_3', 'inferno', g => [
    tower(INF, 260, 210, 30, 110, { roofH: 76, win: [150], winW: 7, winH: 20, mason: false }),
    tower(INF, 74, 270, 36, 172, { roofH: 92, win: [180, 236], winW: 8, winH: 22, mason: false }),
    tower(INF, 446, 270, 36, 172, { roofH: 92, win: [180, 236], winW: 8, winH: 22, mason: false }),
    sw(INF, 50, 212, 470, g, 13), hip(INF, 50, 470, 218, 84, 14, 84), spikes(150, 370, 134, 18, 22, INF.iron),
    { p: box(44, 212, 476, 224), c: INF.trim, m: 'cloth', line: 1 },
    // фронтон с огненным оком и рогами
    horn(214, 170, -1, 70, INF.horn), horn(306, 170, 1, 70, INF.horn),
    { p: [P(180, 226, 1), [220, 176], P(260, 118, 1), [300, 176], P(340, 226, 1)], c: INF.wall, m: 'cloth', line: 1.2, sub: [{ p: [P(262, 112, 1), P(350, 230, 1), P(296, 230, 1)], c: INF.wallD, m: 'flat', line: 0 }] },
    { p: tube([[170, 228, 8], [220, 172, 7], [260, 110, 7], [300, 172, 7], [350, 228, 8]]), c: INF.roof, m: 'leather', line: 1 },
    rose(INF, 260, 184, 20, { c: '#ff8a2a' }),
    win(INF, 110, 300, 12, 36), win(INF, 410, 300, 12, 36), win(INF, 110, 392, 12, 34), win(INF, 410, 392, 12, 34), win(INF, 186, 330, 10, 30), win(INF, 334, 330, 10, 30),
    demonMask(260, 262, 18),
    door(INF, 260, g, 32, 110, { glow: INF.lava }),
    lavaStrip(150, 370, g + 2, 8),
  ]);
  bdef('bld_hall_4', 'inferno', g => {
    const out = [];
    // рогатый донжон с огнём на вершине
    out.push(horn(226, 140, -1, 130, INF.horn), horn(334, 140, 1, 130, INF.horn));
    const keep = tower(INF, 280, 330, 66, 210, { top: 'spikes', sh: 26, ns: 5, win: [200, 270], winW: 12, winH: 36 });
    out.push(keep, brazier(280, keep.apex[1] + 30, 30, 1.6));
    for (const x of [164, 396]) out.push(tower(INF, x, 330, 26, 120, { roofH: 78, win: [], mason: false }));
    for (const x of [62, 498]) out.push(tower(INF, x, g, 38, 400, { roofH: 110, win: [250, 330, 420, 500], winW: 8, winH: 24 }));
    out.push(sw(INF, 96, 320, 464, g, 14), spikes(92, 468, 308, 20, 24, INF.iron, { vary: true }));
    out.push(win(INF, 136, 400, 12, 34), win(INF, 424, 400, 12, 34), win(INF, 136, 492, 12, 34), win(INF, 424, 492, 12, 34));
    // портал: рогатая арка, колонны, лава
    out.push({ p: arch(280, g - 16, 92, 196, true), c: INF.trim, m: 'cloth', line: 1.2, lines: voussoirs(280, g - 150, 90, 9) });
    out.push(horn(214, 402, -1, 50, '#3a2a26'), horn(346, 402, 1, 50, '#3a2a26'));
    out.push(door(INF, 280, g - 16, 56, 160, { glow: INF.lava, fc: INF.wallD }));
    out.push(demonMask(280, 372, 20));
    for (const x of [200, 360]) out.push({ p: box(x - 12, 390, x + 12, g - 16), c: INF.wall, m: 'cloth', line: 1, sub: [{ p: box(x + 4, 388, x + 14, g), c: INF.wallD, m: 'flat', line: 0 }], lines: [{ p: [[x - 3, 396], [x - 3, g - 20]], w: 2, a: 0.4 }] }, spikes(x - 14, x + 14, 380, 22, 28, INF.iron));
    out.push(steps(INF, 280, g, 2, 8, 110, 130));
    out.push(lavaStrip(106, 196, g + 2, 7), lavaStrip(364, 454, g + 2, 7));
    return out;
  });

  /* ---------- гильдия магов: чёрный обелиск с огненным оком в рогах ---------- */
  function guildInf(L) {
    return (g, fr) => {
      const cx = fr.anchor[0], top = 200, floors = L + 1, fh = (g - 34 - top) / floors, hw0 = 64, hw1 = 42, out = [];
      const hwAt = y => hw1 + (hw0 - hw1) * (y - top) / (g - 34 - top);
      out.push({ p: box(cx - hw0 - 16, g - 34, cx + hw0 + 16, g), c: INF.trim, m: 'cloth', line: 1.2, lines: masonry(cx - hw0 - 16, g - 34, cx + hw0 + 16, g, 17, 30, 0.4, 2.4) });
      out.push({ p: trap(cx, top, g - 34, hw1, hw0), c: INF.wall, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 34, 26, 38, 0.4, 2.4).concat(veins(cx - hw0, top, cx + hw0, g - 34, 40 + L, 2 + L)),
        sub: [{ p: [P(cx + hw1 * 0.4, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.4, g, 1)], c: INF.wallD, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) {
        const y = g - 34 - i * fh, hw = hwAt(y);
        out.push({ p: box(cx - hw - 8, y - 6, cx + hw + 8, y + 6), c: INF.iron, m: 'steel', line: 1 });
        for (const s of [-1, 1]) out.push({ p: tube([[cx + s * (hw + 6), y, 6], [cx + s * (hw + 30), y - 12, 0.8]]), c: INF.iron, m: 'horn', gloss: 0.5, line: 0.7 });
      }
      for (let i = 1; i < floors; i++) { const y = g - 34 - i * fh - 18; out.push(win(INF, cx + (i % 2 ? -14 : 14), y, 11, Math.min(54, fh * 0.52), { c: '#ff8a3a' })); }
      out.push(door(INF, cx, g - 34, 26, Math.min(100, fh * 0.8), { glow: INF.lava }));
      // корона: шипы, рога, огненная сфера
      out.push({ p: box(cx - hw1 - 12, top - 10, cx + hw1 + 12, top + 6), c: INF.iron, m: 'steel', line: 1 }, spikes(cx - hw1 - 10, cx + hw1 + 10, top - 10, 18, (hw1 * 2 + 20) / 4, INF.iron));
      out.push(horn(cx - hw1 + 2, top - 8, -1, 76 + L * 6, INF.horn), horn(cx + hw1 - 2, top - 8, 1, 76 + L * 6, INF.horn));
      lit(cx, top - 58);
      out.push(halo(cx, top - 58, 58, 58, 'rgba(255,110,30,0.2)'), { e: [cx, top - 58, 24 + L * 2, 24 + L * 2], c: '#ff6a1a', m: 'gem', gloss: 1.2, line: 1, lc: '#6a1a08', sub: [{ e: [cx - 3, top - 62, 12 + L, 12 + L], c: '#ffe08a', m: 'flat', line: 0 }] });
      out.push(flame(cx, top - 70 - L * 2, 16, 44 + L * 6));
      return out;
    };
  }
  for (let i = 1; i <= 4; i++) bdef('bld_guild_' + i, 'inferno', guildInf(i));

  /* ---------- таверна: чёрный дом с железными балками, огненная труба, вывеска-кубок ---------- */
  bdef('bld_tavern', 'inferno', g => {
    const out = [], B = INF.iron;
    out.push({ p: trap(266, 34, 140, 18, 22), c: INF.trim, m: 'cloth', line: 1.2, lines: masonry(244, 34, 288, 140, 16, 20, 0.45, 2.2) }, { p: box(240, 24, 292, 38), c: B, m: 'steel', line: 1 }, flame(266, 26, 16, 44));
    out.push(sw(INF, 56, 212, 304, g, 21));
    const lines = [];
    for (const x of [40, 110, 180, 250, 320]) lines.push({ p: [[x, 120], [x, 210]], w: 8, c: B, a: 1 });
    lines.push({ p: [[40, 166], [320, 166]], w: 6, c: B, a: 1 }, { p: [[40, 120], [110, 166]], w: 5, c: B, a: 1 }, { p: [[320, 120], [250, 166]], w: 5, c: B, a: 1 });
    out.push({ p: box(40, 120, 320, 212), c: INF.wall, m: 'cloth', line: 1.2, lines, sub: [{ p: box(282, 116, 324, 214), c: INF.wallD, m: 'flat', line: 0 }] });
    out.push({ p: box(34, 206, 326, 218), c: B, m: 'steel', line: 1 });
    out.push(hip(INF, 40, 320, 126, 84, 18, 70), spikes(106, 254, 46, 16, 18, B));
    out.push(win(INF, 75, 158, 12, 28, { frame: false }), win(INF, 145, 158, 12, 28, { frame: false }), win(INF, 215, 158, 12, 28, { frame: false }), win(INF, 285, 158, 11, 28, { frame: false }));
    out.push(win(INF, 100, 296, 16, 42), win(INF, 262, 296, 16, 42));
    out.push(door(INF, 180, g, 26, 96, { lamp: [188, 222] }));
    // вывеска: кронштейн и доска с рогатым кубком
    out.push({ p: tube([[304, 236, 5], [352, 236, 5]]), c: B, m: 'steel', line: 0.8 }, { p: tube([[320, 236, 2], [320, 248, 2]]), c: B, m: 'steel', line: 0 }, { p: tube([[346, 236, 2], [346, 248, 2]]), c: B, m: 'steel', line: 0 });
    out.push({ p: box(312, 246, 354, 296), c: '#5a2218', m: 'wood', flow: 0, line: 1.2,
      sub: [{ p: [P(322, 258, 1), P(344, 258, 1), [340, 272], P(335, 276, 1), P(335, 284, 1), P(342, 288, 1), P(324, 288, 1), P(331, 284, 1), P(331, 276, 1), [326, 272]], c: INF.gold, m: 'gold', line: 0.8 }] });
    out.push(horn(318, 250, -1, 20, INF.horn), horn(348, 250, 1, 20, INF.horn));
    out.push(brazier(28, g, 46, 0.9));
    return out;
  });

  /* ---------- кузница: горн-пасть с лавой, рогатая труба-вулкан ---------- */
  bdef('bld_blacksmith', 'inferno', g => {
    const out = [];
    out.push({ p: trap(252, 40, 200, 20, 30), c: INF.trim, m: 'cloth', line: 1.2, lines: masonry(222, 40, 282, 200, 16, 22, 0.5, 2.4).concat(veins(222, 40, 282, 200, 3, 2)) });
    out.push({ p: [P(222, 44, 1), P(282, 44, 1), P(296, 22, 1), P(208, 22, 1)], c: INF.iron, m: 'steel', line: 1 }, spikes(206, 298, 10, 16, 23, INF.iron));
    out.push(halo(252, 0, 40, 30, 'rgba(255,120,40,0.25)'), flame(252, 12, 22, 60, { lean: 10 }));
    lit(252, -10);
    out.push(sw(INF, 38, 200, 296, g, 5, { ma: 0.5 }));
    out.push(hip(INF, 38, 296, 206, 86, 16, 60), spikes(100, 214, 122, 16, 19, INF.iron));
    // горн-пасть: арка с клыками, лава внутри
    out.push({ p: arch(104, g, 44, 128, true), c: '#1a0c08', m: 'cloth', ao: 1.2, line: 1.2 });
    lit(104, g - 40);
    out.push(pool(104, g - 22, 38, 20, INF.lava, INF.lavaC), flame(104, g - 30, 24, 58));
    for (const [x, y, s] of [[66, g - 86, 1], [142, g - 86, -1], [74, g - 108, 1], [134, g - 108, -1]]) out.push({ p: [P(x, y - 8, 1), P(x + s * 20, y + 2, 1), P(x, y + 10, 1)], c: '#d8c8b0', m: 'horn', line: 0.7 });
    out.push(door(INF, 222, g, 22, 88, { lamp: [180, 310] }));
    out.push(win(INF, 268, 268, 11, 30));
    // вывеска: скрещённые молот и клещи
    out.push({ p: tube([[150, 280, 5], [194, 236, 5]]), c: '#5a3a22', m: 'wood', line: 0.8 }, { p: box(180, 226, 206, 244), c: '#6a6a74', m: 'steel', line: 1 }, { p: tube([[194, 282, 4], [160, 240, 4], [150, 234, 2]]), c: '#6a6a74', m: 'steel', line: 0.8 });
    // наковальня и лава в желобе
    out.push({ p: [P(8, g - 40, 1), P(60, g - 40, 1), [72, g - 34], P(54, g - 26, 1), P(48, g - 12, 1), P(58, g, 1), P(14, g, 1), P(24, g - 12, 1), P(18, g - 26, 1)], c: '#3a3438', m: 'steel', line: 1, glint: [[20, g - 36, 3]] });
    out.push(lavaStrip(150, 316, g + 2, 6));
    return out;
  });

  /* ---------- рынок: стрельчатая аркада, багровые навесы, сера и ртуть ---------- */
  bdef('bld_market', 'inferno', g => {
    const out = [];
    out.push(sw(INF, 28, 118, 380, g, 7));
    out.push(hip(INF, 28, 380, 122, 56, 14, 70), spikes(100, 308, 66, 14, 20, INF.iron), { p: box(24, 116, 384, 128), c: INF.trim, m: 'cloth', line: 1 });
    // вывеска-монета в рогах
    out.push(horn(172, 44, -1, 34, INF.horn), horn(208, 44, 1, 34, INF.horn), { e: [190, 40, 20, 20], c: INF.gold, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(190, 40, 13, 13, 12).concat([[203, 40]]), w: 3, c: '#8a6a20', a: 0.8 }] });
    const WARES = [
      (cx) => [{ p: [[cx - 30, g - 30], [cx - 18, g - 50], [cx, g - 56], [cx + 18, g - 50], [cx + 30, g - 30]], c: '#e8c83a', m: 'skin', line: 0.8 }],   // сера
      (cx) => range(3, i => ({ e: [cx - 20 + i * 20, g - 40, 9, 9], c: '#c8ccd8', m: 'steel', gloss: 1.3, line: 0.8 })),   // ртуть в колбах
      (cx) => [crystal(cx - 14, g - 30, 7, 24, '#e04a2a', -0.1), crystal(cx + 4, g - 30, 8, 30, '#ff7a3a', 0.05), crystal(cx + 20, g - 30, 6, 20, '#c83a1a', 0.2)],
    ];
    [[94, 0], [204, 1], [314, 2]].forEach(([cx, k]) => {
      out.push({ p: arch(cx, g, 38, 100, true), c: '#1a0c0a', m: 'cloth', ao: 1.2, line: 1.2 });
      lit(cx, g - 70);
      out.push({ p: box(cx - 34, g - 30, cx + 34, g), c: '#4a2a1a', m: 'wood', flow: 0, line: 1 }, WARES[k](cx));
      const stripes = []; for (let x = cx - 50; x < cx + 50; x += 20) stripes.push({ p: [P(x, g - 112, 1), P(x + 10, g - 112, 1), P(x + 12, g - 84, 1), P(x + 2, g - 84, 1)], c: '#2a0e0a', m: 'flat', line: 0 });
      out.push({ p: [P(cx - 50, g - 114, 1), P(cx + 50, g - 114, 1), P(cx + 56, g - 84, 1), P(cx + 42, g - 72, 1), P(cx + 28, g - 84, 1), P(cx + 14, g - 72, 1), P(cx, g - 84, 1), P(cx - 14, g - 72, 1), P(cx - 28, g - 84, 1), P(cx - 42, g - 72, 1), P(cx - 56, g - 84, 1)], c: '#a8201a', m: 'cloth', line: 1.2, sub: stripes });
    });
    return out;
  });

  /* ---------- хранилище: чан ртути — клёпаный котёл-башня с серебряным куполом ---------- */
  bdef('bld_silo', 'inferno', g => {
    const out = [];
    out.push(sw(INF, 16, 236, 150, g, 17, { rh: 22, bw: 36 }), gableR(INF, 16, 150, 240, 86, 12), spikes(60, 108, 162, 12, 16, INF.iron));
    out.push({ p: box(54, 290, 112, g), c: INF.iron, m: 'steel', line: 1, lines: [{ p: [[54, 290], [112, g]], w: 4, c: '#1a1214', a: 0.9 }, { p: [[112, 290], [54, g]], w: 4, c: '#1a1214', a: 0.9 }] });
    // котёл-башня: железные листы и обручи с заклёпками
    const hoops = [], rivets = [];
    for (let y = 176; y < g; y += 46) { hoops.push({ p: [[140, y], [210, y + 10], [280, y]], w: 6, c: '#1a1214', a: 0.9 }); for (let x = 150; x < 280; x += 22) rivets.push([x, y + (1 - Math.pow((x - 210) / 70, 2)) * 10, 2.4]); }
    out.push({ p: [P(140, 160, 1), P(280, 160, 1), P(284, g, 1), [210, g + 4], P(136, g, 1)], c: '#3e3436', m: 'steel', gloss: 0.5, line: 1.2, lines: hoops.concat(range(5, i => ({ p: [[152 + i * 28, 164], [150 + i * 28, g]], w: 1.6, a: 0.35 }))), glint: rivets,
      sub: [{ p: box(238, 150, 290, g + 6), c: '#241c1e', m: 'flat', line: 0 }] });
    out.push({ p: box(128, 150, 292, 166), c: INF.iron, m: 'steel', line: 1 }, spikes(130, 290, 150, 14, 20, INF.iron, { vary: true }));
    out.push({ p: [P(146, 150, 1), [150, 104], [180, 74], [210, 66], [240, 74], [270, 104], P(274, 150, 1)], c: '#c4c8d4', m: 'steel', gloss: 1.4, line: 1, glint: [[184, 96, 7], [196, 84, 3]] });
    out.push(horn(166, 108, -1, 50, INF.horn), horn(254, 108, 1, 50, INF.horn), { p: tube([[210, 70, 5], [210, 40, 1]]), c: INF.iron, m: 'horn', line: 0.7 });
    // носик-кран: ртуть каплей
    out.push({ p: tube([[270, 300, 6], [304, 300, 5], [308, 316, 4]]), c: INF.iron, m: 'steel', line: 0.8 }, { e: [308, 330, 6, 8], c: '#d8dce8', m: 'steel', gloss: 1.4, line: 0.7 });
    out.push(door(INF, 196, g, 20, 76, { lamp: [170, 318] }));
    out.push({ e: [300, g - 6, 20, 8], c: '#c8ccd8', m: 'steel', gloss: 1.4, line: 0.8 });
    return out;
  });

  /* ---------- Орден Огня: вечное пламя в чаше между рогатыми обелисками ---------- */
  bdef('bld_special', 'inferno', g => {
    const out = [];
    out.push({ p: arch(140, g - 30, 76, 214, true), c: INF.wall, m: 'cloth', line: 1.2, lines: masonry(64, 30, 216, g, 24, 36, 0.4, 2.2), sub: [{ p: box(170, 20, 220, g), c: INF.wallD, m: 'flat', line: 0 }] });
    out.push({ p: arch(140, g - 30, 54, 180, true), c: '#1a0a08', m: 'cloth', ao: 1.4, line: 1 });
    out.push(spikes(78, 202, 124, 16, 20, INF.iron, { vary: true }));
    out.push(steps(INF, 140, g, 3, 10, 90, 126));
    for (const x of [34, 246]) {
      out.push({ p: trap(x, 96, g - 30, 12, 20), c: INF.wall, m: 'cloth', line: 1.1, sub: [{ p: box(x + 4, 90, x + 24, g), c: INF.wallD, m: 'flat', line: 0 }], lines: veins(x - 20, 100, x + 20, g - 30, x, 1) });
      out.push(horn(x - 10, 102, -1, 40, INF.horn), horn(x + 10, 102, 1, 40, INF.horn), brazier(x, 98, 14, 0.8));
    }
    // чаша вечного пламени
    lit(140, 150);
    out.push(halo(140, 150, 90, 90, 'rgba(255,110,30,0.22)'));
    out.push({ p: tube([[140, g - 30, 14], [140, 214, 10]]), c: INF.gold, m: 'gold', line: 1 });
    out.push(flame(140, 196, 48, 150, { lean: -6 }), flame(118, 198, 22, 80, { lean: -10 }), flame(162, 198, 22, 90, { lean: 8 }));
    out.push({ p: [P(92, 192, 1), P(188, 192, 1), [178, 214], P(154, 224, 1), P(126, 224, 1), [102, 214]], c: INF.gold, m: 'gold', gloss: 1, line: 1, sub: [{ p: box(92, 188, 188, 198), c: INF.lava, m: 'flat', line: 0 }] });
    out.push(demonMask(140, 250, 12));
    return out;
  });

  /* ---------- жилища Инферно ---------- */
  // 1. Тигель бесов: котёл с кипящей лавой на когтистых лапах над огнём
  bdef('bld_dwell_1', 'inferno', g => {
    const out = [];
    out.push(steps(INF, 130, g, 1, 16, 118, 118));
    lit(130, g - 50);
    out.push(halo(130, g - 44, 80, 40, 'rgba(255,110,30,0.25)'), flame(96, g - 16, 20, 56, { lean: -6 }), flame(130, g - 16, 26, 72), flame(166, g - 16, 20, 58, { lean: 6 }));
    for (const [x0, x1] of [[64, 44], [196, 216], [120, 112]]) out.push({ p: tube([[x0 + (x1 - x0) * 0.2, 160, 10], [x1, g - 34, 8], [x1 + (x1 - x0) * 0.6, g - 16, 5]]), c: INF.iron, m: 'steel', gloss: 0.6, line: 0.9 });
    out.push({ p: [P(34, 96, 1), [30, 136], [60, 178], [130, 196], [200, 178], [230, 136], P(226, 96, 1)], c: '#3a3032', m: 'steel', gloss: 0.8, line: 1.2,
      lines: [{ p: [[36, 128], [130, 150], [224, 128]], w: 6, c: '#1a1214', a: 0.9 }], glint: [[70, 140, 5]], sub: [{ p: box(160, 90, 240, 200), c: '#221a1c', m: 'flat', line: 0 }] });
    out.push({ e: [130, 96, 100, 20], c: '#2a2022', m: 'steel', line: 1.2 }, pool(130, 96, 88, 14, INF.lava, INF.lavaC));
    for (const [x, r] of [[92, 8], [150, 10], [178, 6]]) out.push({ e: [x, 90, r, r * 0.8], c: '#ff8a3a', m: 'gem', gloss: 1, line: 0.6, lc: '#8a2a0a' });
    out.push(skull(130, 150, 16, { horns: true, c: '#c8b8a0', hornC: '#2a2022' }));
    // пар и искры
    out.push({ e: [110, 54, 26, 16], c: 'rgba(120,90,80,0.35)', m: 'flat', line: 0 }, { e: [150, 36, 20, 12], c: 'rgba(120,90,80,0.25)', m: 'flat', line: 0 });
    return out;
  });
  // 2. Зал грехов: храм гогов — рогатый фронтон, огненные чаши на колоннах
  bdef('bld_dwell_2', 'inferno', g => {
    const out = [];
    out.push(sw(INF, 60, 130, 254, g, 22));
    out.push(gableR(INF, 60, 254, 134, 90, 16), spikes(128, 186, 50, 14, 14, INF.iron));
    out.push(horn(126, 90, -1, 46, INF.horn), horn(188, 90, 1, 46, INF.horn));
    out.push(rose(INF, 157, 112, 14, { c: '#ff8a2a' }));
    out.push(door(INF, 157, g, 30, 104, { glow: INF.lava }));
    out.push(win(INF, 96, 214, 10, 30), win(INF, 218, 214, 10, 30));
    for (const x of [30, 284]) out.push({ p: box(x - 13, 150, x + 13, g), c: INF.wall, m: 'cloth', line: 1.1, sub: [{ p: box(x + 4, 146, x + 16, g), c: INF.wallD, m: 'flat', line: 0 }], lines: veins(x - 13, 150, x + 13, g, x, 1) }, brazier(x, 148, 10, 0.85));
    out.push(steps(INF, 157, g, 1, 10, 120, 120));
    return out;
  });
  // 3. Псарня: кострище за шипастой оградой, конура с горящими глазами, кости
  bdef('bld_dwell_3', 'inferno', g => {
    const out = [];
    // конура-склеп сзади справа
    out.push({ p: [P(190, g - 20, 1), P(190, 150, 1), [230, 100], [270, 88], [310, 100], P(340, 150, 1), P(340, g - 20, 1)], c: INF.wall, m: 'cloth', line: 1.2, lines: masonry(190, 88, 340, g, 22, 34, 0.4, 2.2), sub: [{ p: box(300, 80, 344, g), c: INF.wallD, m: 'flat', line: 0 }] });
    out.push(spikes(200, 332, 92, 18, 22, INF.iron, { vary: true }), horn(236, 108, -1, 40, INF.horn), horn(304, 108, 1, 40, INF.horn));
    out.push({ p: arch(265, g - 20, 36, 84, false), c: '#0c0404', m: 'cloth', ao: 1.4, line: 1 });
    lit(265, g - 70);
    for (const [x, y] of [[252, g - 70], [274, g - 70], [258, g - 48], [280, g - 50]]) out.push({ e: [x, y, 4, 2.4], c: '#ff5a1a', m: 'gem', gloss: 1.2, line: 0 });
    // кострище в каменном круге
    lit(120, g - 70);
    out.push(halo(120, g - 60, 90, 60, 'rgba(255,110,30,0.25)'));
    out.push(flame(120, g - 24, 40, 130), flame(94, g - 22, 20, 70, { lean: -10 }), flame(150, g - 22, 20, 80, { lean: 10 }));
    out.push({ p: tube([[70, g - 16, 8], [170, g - 40, 7]]), c: '#2a1a14', m: 'wood', line: 0.8 }, { p: tube([[70, g - 40, 7], [170, g - 16, 8]]), c: '#2a1a14', m: 'wood', line: 0.8 });
    for (let i = 0; i < 7; i++) out.push({ e: [64 + i * 19, g - 12 + Math.abs(i - 3) * -1, 11, 8], c: INF.wallD, m: 'horn', gloss: 0.2, line: 0.9 });
    // ограда-шипы на переднем плане и кости
    out.push({ p: tube([[20, g, 5], [20, g - 70, 4], [20, g - 88, 0.6]]), c: INF.iron, m: 'horn', line: 0.7 }, { p: tube([[40, g, 5], [40, g - 56, 4], [40, g - 72, 0.6]]), c: INF.iron, m: 'horn', line: 0.7 });
    out.push({ p: tube([[180, g - 4, 4], [216, g - 12, 4]]), c: '#d8ccb4', m: 'horn', line: 0.7 }, { e: [180, g - 4, 5, 5], c: '#d8ccb4', m: 'horn', line: 0.6 }, { e: [216, g - 12, 5, 5], c: '#d8ccb4', m: 'horn', line: 0.6 });
    out.push(skull(330, g - 10, 12, { c: '#d8ccb4' }));
    return out;
  });
  // 4. Врата демонов: два рогатых пилона, стрельчатая арка, огненный портал
  bdef('bld_dwell_4', 'inferno', g => {
    const out = [];
    out.push(steps(INF, 170, g, 2, 10, 130, 150));
    // портал: вихрь пламени
    lit(170, g - 110);
    out.push(halo(170, g - 110, 90, 110, 'rgba(255,90,20,0.22)'));
    out.push({ p: arch(170, g - 20, 76, 220, true), c: '#ff5a1a', m: 'gem', gloss: 0.8, rim: 0, line: 1, lc: '#5a1408',
      sub: [{ p: arch(170, g - 20, 54, 170, true), c: '#ff9a3a', m: 'flat', line: 0 }, { p: arch(170, g - 20, 30, 110, true), c: '#ffe08a', m: 'flat', line: 0 }],
      lines: range(4, i => ({ p: ell(170, g - 120 + i * 14, 60 - i * 12, 80 - i * 16, 16).concat([[230 - i * 12, g - 120 + i * 14]]), w: 3, c: '#b8280a', a: 0.6 })) });
    // арка
    out.push({ p: [P(80, g - 20, 1), P(80, g - 160, 1), [110, g - 238], P(170, g - 282, 1), [230, g - 238], P(260, g - 160, 1), P(260, g - 20, 1), P(246, g - 20, 1), P(246, g - 150, 1), [220, g - 222], P(170, g - 258, 1), [120, g - 222], P(94, g - 150, 1), P(94, g - 20, 1)], c: INF.trim, m: 'cloth', line: 1.2 });
    out.push(demonMask(170, g - 270, 18));
    for (const x of [52, 288]) {
      out.push({ p: trap(x, g - 220, g - 20, 22, 30), c: INF.wall, m: 'cloth', line: 1.2, lines: masonry(x - 30, g - 220, x + 30, g - 20, 24, 30, 0.4, 2.2).concat(veins(x - 30, g - 220, x + 30, g - 20, x, 2)), sub: [{ p: box(x + 6, g - 230, x + 34, g), c: INF.wallD, m: 'flat', line: 0 }] });
      out.push(spikes(x - 26, x + 26, g - 226, 22, 17, INF.iron), horn(x - 18, g - 232, -1, 64, INF.horn), horn(x + 18, g - 232, 1, 64, INF.horn));
      out.push(win(INF, x, g - 110, 8, 30));
    }
    return out;
  });
  // 5. Адская дыра: пылающий провал в чёрной скале, клыки скал, столбы огня
  bdef('bld_dwell_5', 'inferno', g => {
    const out = [];
    out.push(crag(10, 130, g - 20, 60, 51, { c: '#3a2a28', n: 5 }), crag(270, 392, g - 20, 40, 52, { c: '#3a2a28', n: 5 }));
    out.push({ p: tube([[70, g - 180, 24], [60, 80, 12], [74, 20, 1]]), c: '#2e2220', m: 'horn', gloss: 0.3, line: 1 }, { p: tube([[330, g - 200, 26], [340, 60, 12], [322, 0, 1]]), c: '#2e2220', m: 'horn', gloss: 0.3, line: 1 });
    // вал кратера
    out.push({ p: [P(20, g, 1), [40, g - 70], [110, g - 130], [200, g - 142], [290, g - 130], [360, g - 70], P(380, g, 1)], c: '#3a2a28', m: 'horn', gloss: 0.15, line: 1.2, belly: 0.4, lines: veins(40, g - 130, 360, g, 55, 4) });
    lit(200, g - 110);
    out.push(halo(200, g - 150, 120, 110, 'rgba(255,90,20,0.22)'));
    out.push(pool(200, g - 112, 130, 28, INF.lava, INF.lavaC));
    out.push(flame(200, g - 110, 46, 190), flame(150, g - 108, 26, 110, { lean: -16 }), flame(252, g - 108, 26, 120, { lean: 14 }));
    for (const [x, s, h] of [[80, 1, 60], [120, 1, 44], [280, -1, 50], [320, -1, 64]]) out.push({ p: [P(x - 14, g - 108, 1), P(x + s * 16, g - 108 - h, 1), P(x + 14, g - 108, 1)], c: '#2a1e1c', m: 'horn', gloss: 0.3, line: 1 });
    out.push({ p: [P(40, g, 1), [100, g - 40], [200, g - 58], [300, g - 40], P(360, g, 1)], c: '#46322e', m: 'horn', gloss: 0.15, line: 1.2, belly: 0.3, lines: veins(80, g - 50, 320, g, 57, 3) });
    out.push(demonMask(200, g - 30, 16));
    return out;
  });
  // 6. Огненное озеро: лава в каменной чаше, огненный смерч над островом, скальная арка
  bdef('bld_dwell_6', 'inferno', g => {
    const out = [];
    out.push(crag(20, 190, g - 60, 80, 61, { c: '#3a2a28', n: 6, half: 'l' }), crag(260, 430, g - 60, 60, 62, { c: '#3a2a28', n: 6, half: 'r' }));
    out.push({ p: [P(60, g - 110, 1), [90, 110], [180, 50], [260, 50], [350, 110], P(380, g - 110, 1), P(350, g - 110, 1), [320, 140], [250, 90], [190, 90], [120, 140], P(90, g - 110, 1)], c: '#2e2220', m: 'horn', gloss: 0.2, line: 1.2, lines: veins(90, 50, 350, 200, 63, 3) });
    out.push(spikes(150, 290, 54, 20, 20, '#2e2220', { vary: true }));
    // берег и озеро
    out.push({ e: [220, g - 58, 214, 60], c: '#2a1e1c', m: 'horn', gloss: 0.1, line: 1.2 });
    out.push(pool(220, g - 58, 196, 44, INF.lava, INF.lavaC));
    lit(220, g - 180);
    out.push(halo(220, g - 190, 110, 170, 'rgba(255,100,30,0.22)'));
    // огненный смерч-столп (ифрит)
    out.push({ p: [P(190, g - 70, 1), [170, g - 150], [196, g - 230], [174, g - 300], [206, 70], P(220, 30, 1), [236, 70], [262, g - 300], [238, g - 230], [268, g - 150], P(250, g - 70, 1)], c: '#ff6a1a', m: 'gem', gloss: 0.9, rim: 0, line: 0.8, lc: '#8a2a0a', op: 0.92,
      sub: [{ p: [P(204, g - 70, 1), [192, g - 160], [210, g - 250], [204, g - 320], P(220, 70, 1), [232, g - 320], [230, g - 250], [248, g - 160], P(236, g - 70, 1)], c: '#ffd070', m: 'flat', line: 0 }],
      lines: range(5, i => ({ p: [[182 + i * 3, g - 90 - i * 60], [220, g - 100 - i * 60 + 12], [258 - i * 3, g - 90 - i * 60]], w: 3, c: '#c8380a', a: 0.6 })) });
    out.push({ e: [220, g - 66, 42, 14], c: '#2a1e1c', m: 'horn', gloss: 0.2, line: 1 });
    out.push(flame(110, g - 60, 18, 70, { lean: -8 }), flame(330, g - 62, 18, 80, { lean: 8 }));
    for (const x of [70, 370]) out.push(brazier(x, g - 6, 30, 0.8));
    return out;
  });
  // 7. Покинутый дворец: чёрный купол в рогах на барабане, тонкие башни-клыки, аркада с огнём
  bdef('bld_dwell_7', 'inferno', g => {
    const out = [], cx = 270;
    for (const x of [44, 496]) out.push(tower(INF, x, g, 34, 320, { roofH: 150, win: [g - 250, g - 170, g - 90], winW: 7, winH: 24 }));
    for (const x of [140, 400]) out.push(tower(INF, x, g - 150, 28, 120, { roofH: 100, win: [], mason: false }));
    // барабан и купол
    out.push(horn(cx - 90, 230, -1, 110, INF.horn), horn(cx + 90, 230, 1, 110, INF.horn));
    out.push(sw(INF, cx - 100, 210, cx + 100, g - 150, 72, { rh: 22 }));
    for (const x of [cx - 60, cx - 20, cx + 20, cx + 60]) out.push(win(INF, x, 290, 8, 40, { frame: false }));
    const dh = 130, dy = 214;
    out.push({ p: [P(cx - 110, dy, 1), [cx - 106, dy - dh * 0.5], [cx - 70, dy - dh * 0.9], [cx, dy - dh], [cx + 70, dy - dh * 0.9], [cx + 106, dy - dh * 0.5], P(cx + 110, dy, 1), [cx, dy + 12]], c: '#2e2426', m: 'steel', gloss: 0.8, line: 1.2,
      sub: [{ p: [[cx + 30, dy - dh - 6], [cx + 120, dy - dh * 0.5], [cx + 120, dy + 10], [cx + 44, dy + 10]], c: '#1a1214', m: 'flat', line: 0 }],
      lines: [-0.66, -0.33, 0, 0.33, 0.66].map(k => ({ p: [[cx + 110 * k, dy], [cx + 90 * k, dy - dh * 0.6], [cx + 36 * k, dy - dh * 0.97]], w: 3, c: '#ff5a1a', a: 0.7 })) });
    out.push(spikes(cx - 112, cx + 112, dy - 6, 16, 22, INF.iron), { p: tube([[cx, dy - dh + 6, 12], [cx, dy - dh - 70, 1]]), c: INF.iron, m: 'horn', gloss: 0.5, line: 0.9 });
    // нижний ярус: аркада из трёх огненных арок
    out.push(sw(INF, 84, g - 160, 456, g, 71), spikes(80, 460, g - 172, 20, 24, INF.iron, { vary: true }));
    for (const [x, w, h] of [[160, 30, 100], [270, 46, 132], [380, 30, 100]]) out.push(door(INF, x, g - 16, w, h, { glow: INF.lava, fc: INF.wallD }));
    out.push(demonMask(270, g - 182, 20));
    out.push(steps(INF, 270, g, 2, 8, 170, 190), lavaStrip(96, 130, g + 2, 6), lavaStrip(410, 444, g + 2, 6));
    return out;
  });

  /* ---------- укрепления: чёрная стена с шипами, надвратная башня с рогами ---------- */
  function fortInf(lvl) {
    return (g) => {
      const out = [], wallTop = g - 180;
      out.push(sw(INF, 10, wallTop, 970, g, 90 + lvl, { k: 0.02, rh: 24, bw: 48 }), spikes(6, 974, wallTop - 12, 20, 34, INF.iron, { vary: true }));
      out.push({ p: box(10, g - 30, 970, g), c: INF.trim, m: 'cloth', line: 1 });
      if (lvl >= 2) for (const x of [110, 870]) out.push(tower(INF, x, g, 60, 330, { roofH: 130, win: [g - 250, g - 160], winW: 10, winH: 30 }));
      if (lvl >= 3) {
        out.push(horn(420, g - 470, -1, 130, INF.horn), horn(560, g - 470, 1, 130, INF.horn));
        out.push(tower(INF, 490, g - 150, 90, 330, { roofH: 150, eave: 12, win: [g - 390, g - 290], winW: 12, winH: 34 }));
      }
      const top = lvl === 1 ? wallTop - 54 : wallTop - 60 - (lvl === 2 ? 0 : 0);
      out.push(sw(INF, 404, top, 576, g, 97, { rh: 24, bw: 40 }), spikes(398, 582, top - 12, 26, 26, INF.iron));
      out.push(horn(410, top - 6, -1, 70, INF.horn), horn(570, top - 6, 1, 70, INF.horn));
      out.push({ p: arch(490, g, 60, 164, true), c: INF.trim, m: 'cloth', line: 1.2, lines: voussoirs(490, g - 104, 56, 7) });
      lit(490, g - 60);
      const grate = []; for (let x = 460; x <= 520; x += 15) grate.push({ p: [[x, g - 150], [x, g]], w: 3.4, c: '#140a08', a: 0.95 }); for (let y = g - 110; y < g; y += 18) grate.push({ p: [[440, y], [540, y]], w: 3, c: '#140a08', a: 0.95 });
      out.push({ p: arch(490, g, 46, 146, true), c: INF.lava, m: 'gem', gloss: 0.6, rim: 0, line: 1, lines: grate, sub: [{ p: box(440, g - 60, 540, g + 2), c: INF.lavaC, m: 'flat', line: 0 }] });
      out.push(demonMask(490, top + 34, 18));
      out.push(win(INF, 438, top + 60, 7, 26), win(INF, 542, top + 60, 7, 26));
      return out;
    };
  }
  bdef('bld_fort', 'inferno', fortInf(1)); bdef('bld_citadel', 'inferno', fortInf(2)); bdef('bld_castle', 'inferno', fortInf(3));


  /* ================================= НЕКРОПОЛИС ================================= */
  const NEC = {
    wall: '#5a5868', wallD: '#33313e', trim: '#423f50', roof: '#3e2e4e', roofD: '#1e1628', win: '#b67ae8', winLC: '#1a0e24',
    door: '#2a2230', iron: '#34323e', bone: '#e4dcc6', glow: '#b070f0', glowC: '#f0dcff', ghost: '#b8f0e0', lamp: '#c890ff', gfire: '#5ad07a', gfireC: '#e0ffd0',
  };
  /** Крыша-игла: высокий вогнутый конус тёмного шифера, железная спица с костяным шаром. */
  NEC.spire = (cx, y, hw, h, o) => {
    o = o || {}; const L = o.lean || 0;
    const out = cone(cx, y, hw, h, NEC.roof, NEC.roofD, { flare: 0.3, lean: L, m: 'steel' });
    out.push({ p: tube([[cx + L, y - h + 12, 3.2], [cx + L * 1.05, y - h - Math.max(26, hw * 0.9), 0.6]]), c: NEC.iron, m: 'steel', line: 0.6 }, { e: [cx + L, y - h - 6, 4.5, 4.5], c: NEC.bone, m: 'horn', line: 0.6 });
    return out;
  };
  const nw = (x0, y0, x1, y1, o) => wallB(NEC, x0, y0, x1, y1, o);
  const bone = (pts, o) => Object.assign({ p: tube(pts), c: NEC.bone, m: 'horn', gloss: 0.5, line: 0.9 }, o);
  /** Контрфорс-клык: наклонная опора у стены (s — сторона). */
  const buttress = (x, top, G, s, w) => ({ p: [P(x, G, 1), P(x, top + 30, 1), P(x + s * (w || 14) * 0.3, top, 1), P(x + s * (w || 14) * 1.6, top + 60, 1), P(x + s * (w || 14) * 2.2, G, 1)], c: NEC.trim, m: 'cloth', line: 1.1, lines: [{ p: [[x + s * 4, top + 50], [x + s * (w || 14) * 1.2, G]], w: 1.6, a: 0.4 }] });
  /** Призрачный огонёк-дух. */
  const wisp = (x, y, h, c) => ({ p: [P(x - h * 0.16, y, 1), [x - h * 0.24, y - h * 0.35], [x - h * 0.04, y - h * 0.7], P(x + h * 0.12, y - h, 1), [x + h * 0.04, y - h * 0.62], [x + h * 0.22, y - h * 0.34], P(x + h * 0.16, y, 1), [x, y + h * 0.1]], c: c || NEC.ghost, m: 'gem', gloss: 0.7, rim: 0, line: 0, op: 0.55 });
  /** Надгробие: плита-арка с крестом. */
  const grave = (x, G, w, h, lean) => ({ p: K.rot(arch(x, G, w, h), x, G, lean || 0), c: '#8a8898', m: 'cloth', line: 1, belly: 0.3, lines: [{ p: [[x, G - h * 0.8], [x, G - h * 0.35]], w: 2.4, a: 0.6 }, { p: [[x - w * 0.4, G - h * 0.64], [x + w * 0.4, G - h * 0.64]], w: 2.4, a: 0.6 }] });
  /** Гроб: шестигранник, крест на крышке. */
  const coffin = (cx, G, w, h, c) => ({ p: [P(cx - w * 0.6, G, 1), P(cx - w, G - h * 0.72, 1), P(cx - w * 0.7, G - h, 1), P(cx + w * 0.7, G - h, 1), P(cx + w, G - h * 0.72, 1), P(cx + w * 0.6, G, 1)], c: c || '#3a2a30', m: 'wood', flow: -Math.PI / 2, line: 1,
    lines: [{ p: [[cx, G - h * 0.88], [cx, G - h * 0.3]], w: 3, c: '#8a8898', a: 0.9 }, { p: [[cx - w * 0.35, G - h * 0.7], [cx + w * 0.35, G - h * 0.7]], w: 3, c: '#8a8898', a: 0.9 }] });
  /** Фиолетовая сфера силы с ореолом. */
  function orb(cx, cy, r) { lit(cx, cy); return [halo(cx, cy, r * 2.4, r * 2.4, 'rgba(180,110,255,0.22)'), { e: [cx, cy, r, r], c: NEC.glow, m: 'gem', gloss: 1.3, rim: 0.8, line: 1, lc: '#2a0e44', sub: [{ e: [cx - r * 0.15, cy - r * 0.15, r * 0.5, r * 0.5], c: NEC.glowC, m: 'flat', line: 0 }], glint: [[cx - r * 0.35, cy - r * 0.4, r * 0.18]] }]; }
  /** Жаровня с фиолетовым огнём на каменной тумбе. */
  function nbrazier(x, G, h, k) {
    k = k || 1; const by = G - h; lit(x, by - 16 * k);
    return [halo(x, by - 18 * k, 30 * k, 30 * k, 'rgba(180,110,255,0.2)'), { p: box(x - 10 * k, by + 4, x + 10 * k, G), c: NEC.trim, m: 'cloth', line: 1 },
      flame(x, by, 15 * k, 40 * k, { c: '#a860f0', core: '#f0dcff', lc: '#3a1060' }), { p: [P(x - 18 * k, by - 4, 1), P(x + 18 * k, by - 4, 1), [x + 12 * k, by + 8 * k], P(x - 12 * k, by + 8 * k, 1)], c: NEC.iron, m: 'steel', line: 0.9 }];
  }
  const nfire = (x, y, w, h, o) => flame(x, y, w, h, Object.assign({ c: NEC.gfire, core: NEC.gfireC, lc: '#1a5a2a' }, o));

  /* ---------- ратуша: готический зал игл и черепов ---------- */
  bdef('bld_hall_1', 'necropolis', g => [
    tower(NEC, 92, 232, 28, 132, { roofH: 104, win: [170], winW: 7, winH: 24, mason: false }),
    nw(70, 190, 350, g), hip(NEC, 70, 350, 196, 104, 14, 118), cone(210, 94, 16, 40, NEC.roof, NEC.roofD, { flare: 0.3 }),
    { p: box(64, 188, 356, 200), c: NEC.trim, m: 'cloth', line: 1 },
    buttress(70, 250, g, -1), buttress(350, 250, g, 1),
    win(NEC, 116, 280, 11, 44), win(NEC, 304, 280, 11, 44), win(NEC, 116, 346, 10, 30), win(NEC, 304, 346, 10, 30),
    skull(210, 226, 18),
    door(NEC, 210, g, 26, 100, { lamp: [252, 280] }),
  ]);
  bdef('bld_hall_2', 'necropolis', g => [
    tower(NEC, 72, 270, 30, 168, { roofH: 116, win: [170, 226], winW: 7, winH: 24, mason: false, lean: -6 }),
    tower(NEC, 388, 270, 30, 168, { roofH: 116, win: [170, 226], winW: 7, winH: 24, mason: false, lean: 6 }),
    nw(56, 210, 404, g), hip(NEC, 56, 404, 216, 104, 14, 132),
    { p: box(50, 208, 410, 220), c: NEC.trim, m: 'cloth', line: 1 },
    // слуховое окно-щипец в крыше
    { p: [P(196, 204, 1), P(230, 136, 1), P(264, 204, 1)], c: NEC.wall, m: 'cloth', line: 1.1 }, cone(230, 150, 40, 40, NEC.roof, NEC.roofD, { flare: 0.2, m: 'steel' }), win(NEC, 230, 200, 9, 30, { frame: false }),
    win(NEC, 112, 300, 12, 46), win(NEC, 348, 300, 12, 46), win(NEC, 112, 392, 11, 34), win(NEC, 348, 392, 11, 34),
    skull(230, 262, 20),
    door(NEC, 230, g, 30, 112, { lamp: [282, 350] }),
  ]);
  bdef('bld_hall_3', 'necropolis', g => [
    tower(NEC, 260, 212, 26, 112, { roofH: 124, win: [150], winW: 7, winH: 22, mason: false }),
    tower(NEC, 72, 276, 34, 176, { roofH: 128, win: [184, 240], winW: 8, winH: 24, mason: false, lean: -6 }),
    tower(NEC, 448, 276, 34, 176, { roofH: 128, win: [184, 240], winW: 8, winH: 24, mason: false, lean: 6 }),
    nw(52, 216, 468, g), hip(NEC, 52, 468, 222, 94, 14, 110),
    { p: box(46, 214, 474, 226), c: NEC.trim, m: 'cloth', line: 1 },
    // центральный щипец с розеткой и иглами-пинаклями
    { p: [P(178, 232, 1), P(260, 112, 1), P(342, 232, 1)], c: NEC.wall, m: 'cloth', line: 1.2, sub: [{ p: [P(262, 108, 1), P(352, 236, 1), P(300, 236, 1)], c: NEC.wallD, m: 'flat', line: 0 }] },
    { p: tube([[168, 234, 8], [260, 104, 7], [352, 234, 8]]), c: NEC.roof, m: 'steel', line: 1 },
    cone(178, 232, 10, 60, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }), cone(342, 232, 10, 60, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }),
    rose(NEC, 260, 192, 22),
    buttress(52, 280, g, -1), buttress(468, 280, g, 1),
    win(NEC, 108, 310, 12, 44), win(NEC, 412, 310, 12, 44), win(NEC, 108, 400, 11, 34), win(NEC, 412, 400, 11, 34), win(NEC, 186, 340, 10, 36), win(NEC, 334, 340, 10, 36),
    skull(260, 268, 18),
    door(NEC, 260, g, 32, 110, { lamp: [310, 380] }),
  ]);
  bdef('bld_hall_4', 'necropolis', g => {
    const out = [];
    const keep = tower(NEC, 280, 330, 58, 196, { roofH: 150, eave: 10, win: [], mason: true });
    out.push(keep, rose(NEC, 280, 200, 24), win(NEC, 280, 300, 12, 50));
    for (const x of [166, 394]) out.push(tower(NEC, x, 330, 24, 110, { roofH: 110, win: [], mason: false }));
    for (const [x, L] of [[62, -8], [498, 8]]) out.push(tower(NEC, x, g, 36, 384, { roofH: 130, lean: L, win: [260, 340, 420, 500], winW: 8, winH: 26 }));
    out.push(nw(96, 320, 464, g), merlons(92, 468, 318, 16, 24, NEC.wall, { k: 0.5, pointy: 10 }));
    out.push(buttress(96, 380, g, -1, 12), buttress(464, 380, g, 1, 12));
    out.push(win(NEC, 134, 410, 12, 44), win(NEC, 426, 410, 12, 44), win(NEC, 134, 500, 12, 40), win(NEC, 426, 500, 12, 40));
    // портал: стрельчатая арка с черепом и светом
    out.push({ p: [P(186, g - 16, 1), P(186, 420, 1), P(280, 338, 1), P(374, 420, 1), P(374, g - 16, 1)], c: NEC.trim, m: 'cloth', line: 1.2, sub: [{ p: box(330, 330, 380, g), c: NEC.wallD, m: 'flat', line: 0 }] });
    out.push(cone(186, 420, 12, 70, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }), cone(374, 420, 12, 70, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }));
    out.push(door(NEC, 280, g - 16, 50, 146, { glow: '#8a4ad0', fc: NEC.wallD }), skull(280, 380, 20, { glow: '#c890ff' }));
    out.push(steps(NEC, 280, g, 2, 8, 110, 130));
    return out;
  });

  /* ---------- гильдия магов: готическая башня, костяная клеть с фиолетовой сферой ---------- */
  function guildNec(L) {
    return (g, fr) => {
      const cx = fr.anchor[0], top = 210, floors = L + 1, fh = (g - 34 - top) / floors, hw0 = 62, hw1 = 44, out = [];
      const hwAt = y => hw1 + (hw0 - hw1) * (y - top) / (g - 34 - top);
      out.push({ p: box(cx - hw0 - 16, g - 34, cx + hw0 + 16, g), c: NEC.trim, m: 'cloth', line: 1.2, lines: masonry(cx - hw0 - 16, g - 34, cx + hw0 + 16, g, 17, 30, 0.4, 2.4) });
      for (const s of [-1, 1]) out.push(buttress(cx + s * (hw0 - 4), g - 34 - fh * Math.min(2, floors - 0.5), g - 34, s, 12));
      out.push({ p: trap(cx, top, g - 34, hw1, hw0), c: NEC.wall, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 34, 26, 38, 0.4, 2.4),
        sub: [{ p: [P(cx + hw1 * 0.4, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.4, g, 1)], c: NEC.wallD, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) {
        const y = g - 34 - i * fh, hw = hwAt(y);
        out.push({ p: box(cx - hw - 8, y - 6, cx + hw + 8, y + 6), c: NEC.trim, m: 'cloth', line: 1 });
        for (const s of [-1, 1]) out.push(skull(cx + s * (hw + 2), y + 12, 7));
      }
      for (let i = 1; i < floors; i++) { const y = g - 34 - i * fh - 20; out.push(win(NEC, cx, y, 12, Math.min(60, fh * 0.56))); }
      out.push(door(NEC, cx, g - 34, 26, Math.min(100, fh * 0.8), { glow: '#8a4ad0' }));
      // корона: пинакли-иглы и костяная клеть со сферой
      out.push({ p: box(cx - hw1 - 12, top - 10, cx + hw1 + 12, top + 6), c: NEC.trim, m: 'cloth', line: 1 });
      for (const s of [-1, 1]) out.push(cone(cx + s * (hw1 + 4), top - 8, 9, 60 + L * 6, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }));
      const oy = top - 62 - L * 3;
      for (const s of [-1, 1]) out.push(bone([[cx + s * 30, top - 8, 7], [cx + s * 44, oy + 10, 5], [cx + s * 24, oy - 36, 3], [cx + s * 4, oy - 44, 1.5]]), bone([[cx + s * 12, top - 8, 5], [cx + s * 20, oy + 20, 4], [cx + s * 8, oy - 24, 1.5]]));
      out.push(orb(cx, oy, 20 + L * 2));
      out.push(skull(cx, top - 22, 10));
      return out;
    };
  }
  for (let i = 1; i <= 4; i++) bdef('bld_guild_' + i, 'necropolis', guildNec(i));

  /* ---------- таверна: кривой узкий дом, крутая крыша, призрачный фонарь, гроб у двери ---------- */
  bdef('bld_tavern', 'necropolis', g => {
    const out = [], B = '#2a2230';
    out.push({ p: [P(238, 150, 1), P(244, 20, 1), P(278, 26, 1), P(276, 150, 1)], c: NEC.trim, m: 'cloth', line: 1.2, lines: masonry(236, 20, 280, 150, 16, 20, 0.45, 2.2) }, { p: [P(236, 26, 1), P(242, 12, 1), P(282, 18, 1), P(280, 32, 1)], c: NEC.iron, m: 'steel', line: 1 });
    out.push(nw(60, 212, 300, g));
    const lines = [];
    for (const x of [44, 112, 180, 248, 316]) lines.push({ p: [[x, 118], [x, 210]], w: 7, c: B, a: 1 });
    lines.push({ p: [[44, 164], [316, 164]], w: 5, c: B, a: 1 }, { p: [[44, 118], [112, 210]], w: 5, c: B, a: 1 }, { p: [[316, 118], [248, 210]], w: 5, c: B, a: 1 });
    out.push({ p: box(44, 118, 316, 212), c: '#6a6676', m: 'cloth', line: 1.2, lines, sub: [{ p: box(280, 116, 320, 214), c: NEC.wallD, m: 'flat', line: 0 }] });
    out.push({ p: box(38, 206, 322, 218), c: B, m: 'wood', flow: 0, line: 1 });
    out.push(hip(NEC, 44, 316, 124, 104, 18, 124));
    out.push({ p: [P(150, 110, 1), P(180, 40, 1), P(210, 110, 1)], c: '#6a6676', m: 'cloth', line: 1 }, cone(180, 52, 38, 40, NEC.roof, NEC.roofD, { flare: 0.25, m: 'steel' }), win(NEC, 180, 104, 8, 28, { frame: false }));
    out.push(win(NEC, 78, 156, 11, 30, { frame: false }), win(NEC, 146, 156, 11, 30, { frame: false }), win(NEC, 214, 156, 11, 30, { frame: false }), win(NEC, 282, 156, 10, 30, { frame: false }));
    out.push(win(NEC, 100, 296, 15, 44), win(NEC, 262, 296, 15, 44));
    out.push(door(NEC, 180, g, 26, 96));
    // вывеска: доска с черепом-кружкой; призрачный фонарь
    out.push({ p: tube([[300, 236, 5], [352, 236, 5]]), c: NEC.iron, m: 'steel', line: 0.8 }, { p: tube([[318, 236, 2], [318, 248, 2]]), c: NEC.iron, m: 'steel', line: 0 }, { p: tube([[346, 236, 2], [346, 248, 2]]), c: NEC.iron, m: 'steel', line: 0 });
    out.push({ p: box(310, 246, 354, 294), c: '#3a2e38', m: 'wood', flow: 0, line: 1.2 }, skull(332, 268, 12));
    lit(226, 244);
    out.push({ p: tube([[226, 220, 2], [226, 232, 2]]), c: NEC.iron, m: 'steel', line: 0 }, halo(226, 244, 20, 20, 'rgba(160,255,210,0.25)'), { p: [P(218, 232, 1), P(234, 232, 1), P(236, 256, 1), P(216, 256, 1)], c: NEC.ghost, m: 'gem', gloss: 1, line: 1, lc: '#1a3a30' });
    out.push(coffin(32, g, 22, 84));
    return out;
  });

  /* ---------- кузница: горн с мертвенно-зелёным огнём, костяная труба ---------- */
  bdef('bld_blacksmith', 'necropolis', g => {
    const out = [];
    out.push({ p: trap(252, 30, 200, 20, 28), c: NEC.trim, m: 'cloth', line: 1.2, lines: masonry(224, 30, 280, 200, 16, 22, 0.5, 2.4) }, { p: box(224, 18, 280, 32), c: NEC.iron, m: 'steel', line: 1 });
    for (const s of [-1, 1]) out.push(bone([[252 + s * 22, 40, 5], [252 + s * 38, 20, 4], [252 + s * 30, -6, 1]]));
    lit(252, 0);
    out.push(nfire(252, 20, 16, 44, { op: 0.85 }));
    out.push(nw(38, 200, 296, g, { ma: 0.5 }));
    out.push(hip(NEC, 38, 296, 206, 96, 16, 90));
    out.push({ p: arch(104, g, 42, 124, true), c: '#0e0a14', m: 'cloth', ao: 1.2, line: 1.2 });
    lit(104, g - 40);
    out.push(halo(104, g - 40, 50, 40, 'rgba(120,255,160,0.2)'), { e: [104, g - 24, 34, 20], c: '#3a8a4a', m: 'gem', gloss: 1, line: 0, sub: [{ e: [100, g - 26, 20, 11], c: NEC.gfireC, m: 'flat', line: 0 }] }, nfire(104, g - 32, 22, 54));
    out.push(door(NEC, 222, g, 22, 88, { lamp: [180, 310] }));
    out.push(win(NEC, 268, 268, 10, 32));
    // вывеска: череп над скрещёнными молотами
    out.push({ p: tube([[150, 290, 4], [196, 236, 4]]), c: '#4a3a2a', m: 'wood', line: 0.8 }, { p: tube([[196, 290, 4], [150, 236, 4]]), c: '#4a3a2a', m: 'wood', line: 0.8 }, { p: box(136, 226, 162, 244), c: '#6a6a74', m: 'steel', line: 1 }, { p: box(184, 226, 210, 244), c: '#6a6a74', m: 'steel', line: 1 }, skull(173, 262, 11));
    out.push({ p: [P(8, g - 40, 1), P(60, g - 40, 1), [72, g - 34], P(54, g - 26, 1), P(48, g - 12, 1), P(58, g, 1), P(14, g, 1), P(24, g - 12, 1), P(18, g - 26, 1)], c: '#44424c', m: 'steel', line: 1, glint: [[20, g - 36, 3]] });
    return out;
  });

  /* ---------- рынок: готическая аркада, рваные лиловые навесы, свечи, склянки, черепа ---------- */
  bdef('bld_market', 'necropolis', g => {
    const out = [];
    out.push(nw(28, 118, 380, g));
    out.push(hip(NEC, 28, 380, 122, 64, 14, 90), { p: box(24, 116, 384, 128), c: NEC.trim, m: 'cloth', line: 1 });
    for (const x of [28, 380]) out.push(cone(x, 118, 12, 70, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }));
    out.push(bone([[168, 60, 4], [174, 30, 3], [190, 14, 2]]), bone([[212, 60, 4], [206, 30, 3], [190, 14, 2]]), { e: [190, 44, 18, 18], c: '#c8c4d4', m: 'steel', gloss: 1.2, line: 1.2, lines: [{ p: ell(190, 44, 11, 11, 12).concat([[201, 44]]), w: 3, c: '#6a6878', a: 0.8 }] });
    const WARES = [
      (cx) => range(4, i => [{ p: box(cx - 24 + i * 16, g - 50 + (i % 2) * 6, cx - 18 + i * 16, g - 30), c: '#e8e0c8', m: 'cloth', line: 0.6 }, flame(cx - 21 + i * 16, g - 50 + (i % 2) * 6, 3, 9)]),
      (cx) => range(3, i => [{ e: [cx - 20 + i * 20, g - 40, 8, 10], c: ['#5ad07a', '#b070f0', '#5ad07a'][i], m: 'gem', gloss: 1.2, line: 0.8 }, { p: box(cx - 23 + i * 20, g - 56, cx - 17 + i * 20, g - 48), c: '#8a7a6a', m: 'wood', line: 0.5 }]),
      (cx) => [skull(cx - 18, g - 40, 10), skull(cx + 18, g - 40, 10), skull(cx, g - 50, 11)],
    ];
    [[94, 0], [204, 1], [314, 2]].forEach(([cx, k]) => {
      out.push({ p: arch(cx, g, 38, 104, true), c: '#140e1a', m: 'cloth', ao: 1.2, line: 1.2 });
      lit(cx, g - 70);
      out.push({ p: box(cx - 34, g - 30, cx + 34, g), c: '#3a2e38', m: 'wood', flow: 0, line: 1 }, WARES[k](cx));
      out.push({ p: [P(cx - 50, g - 114, 1), P(cx + 50, g - 114, 1), P(cx + 54, g - 80, 1), P(cx + 40, g - 88, 1), P(cx + 32, g - 74, 1), P(cx + 16, g - 86, 1), P(cx + 4, g - 72, 1), P(cx - 10, g - 86, 1), P(cx - 24, g - 76, 1), P(cx - 36, g - 88, 1), P(cx - 54, g - 80, 1)], c: '#5a3478', m: 'cloth', line: 1.2,
        lines: [{ p: [[cx - 30, g - 112], [cx - 34, g - 88]], w: 2, a: 0.4 }, { p: [[cx + 10, g - 112], [cx + 8, g - 86]], w: 2, a: 0.4 }] });
    });
    return out;
  });

  /* ---------- хранилище: склеп-хранилище ртути, урны и игла ---------- */
  bdef('bld_silo', 'necropolis', g => {
    const out = [];
    out.push(nw(16, 236, 150, g, { rh: 22, bw: 36 }), gableR(NEC, 16, 150, 240, 100, 12));
    out.push({ p: arch(82, g, 26, 80, true), c: '#140e1a', m: 'cloth', line: 1 }, skull(82, 216, 12));
    // круглая башня-урна
    out.push({ p: [P(146, 170, 1), P(274, 170, 1), P(282, g, 1), [210, g + 4], P(138, g, 1)], c: NEC.wall, m: 'cloth', line: 1.2, lines: masonry(138, 170, 282, g, 22, 30, 0.35, 2.2).concat(range(3, i => ({ p: [[140, 214 + i * 60], [210, 222 + i * 60], [280, 214 + i * 60]], w: 5, c: NEC.trim, a: 0.9 }))),
      sub: [{ p: box(238, 160, 290, g + 6), c: NEC.wallD, m: 'flat', line: 0 }] });
    out.push({ p: [P(136, 172, 1), [140, 130], [176, 104], [210, 98], [244, 104], [280, 130], P(284, 172, 1)], c: '#6a6878', m: 'steel', gloss: 0.8, line: 1.1 });
    out.push(NEC.spire(210, 106, 22, 80, {}));
    out.push(win(NEC, 210, 240, 10, 36));
    out.push(door(NEC, 196, g, 20, 76, { lamp: [170, 318] }));
    // урны с ртутью
    for (const [x, k] of [[250, 1], [290, 0.8]]) out.push({ p: [P(x - 10 * k, g, 1), [x - 18 * k, g - 22 * k], [x - 10 * k, g - 38 * k], P(x - 8 * k, g - 46 * k, 1), P(x + 8 * k, g - 46 * k, 1), [x + 10 * k, g - 38 * k], [x + 18 * k, g - 22 * k], P(x + 10 * k, g, 1)], c: '#8a8898', m: 'steel', gloss: 0.9, line: 1, lines: [{ p: [[x - 16 * k, g - 22 * k], [x + 16 * k, g - 22 * k]], w: 2.4, c: '#4a4858', a: 0.8 }] });
    return out;
  });

  /* ---------- Усилитель некромантии: игла-обелиск на ступенях, костяные кольца, сфера ---------- */
  bdef('bld_special', 'necropolis', g => {
    const out = [];
    out.push(steps(NEC, 140, g, 3, 12, 80, 124));
    for (const x of [30, 250]) out.push({ p: box(x - 9, g - 90, x + 9, g - 30), c: NEC.trim, m: 'cloth', line: 1 }, skull(x, g - 98, 11, { glow: '#c890ff' }));
    // духи, втягиваемые к сфере
    out.push(wisp(62, g - 40, 60), wisp(220, g - 44, 70), wisp(96, 150, 44), wisp(190, 140, 50));
    // обелиск-игла
    out.push({ p: [P(100, g - 36, 1), P(118, 110, 1), P(140, 60, 1), P(162, 110, 1), P(180, g - 36, 1)], c: NEC.wall, m: 'cloth', line: 1.2, lines: [0, 1, 2, 3].map(i => ({ p: [[114, g - 60 - i * 36], [166, g - 60 - i * 36]], w: 3, c: '#b070f0', a: 0.8 })).concat([{ p: [[140, g - 40], [140, 80]], w: 3, c: '#c890ff', a: 0.7 }]),
      sub: [{ p: [P(142, 56, 1), P(186, 56, 1), P(186, g, 1), P(150, g, 1)], c: NEC.wallD, m: 'flat', line: 0 }] });
    out.push(skull(140, g - 70, 14, { glow: '#c890ff' }));
    // костяные кольца: задняя половина за обелиском не видна — рисуем переднюю дугу
    for (const [y, r] of [[g - 120, 76], [g - 176, 58]]) out.push(bone(range(9, i => { const a = Math.PI * (0.02 + i / 8 * 0.96); return [140 - Math.cos(a) * r, y + Math.sin(a) * r * 0.3, 6]; })));
    out.push(orb(140, 44, 28));
    return out;
  });

  /* ---------- жилища Некрополиса ---------- */
  // 1. Проклятый храм: часовня с обломанной колокольней-иглой
  bdef('bld_dwell_1', 'necropolis', g => {
    const out = [];
    out.push(tower(NEC, 196, g - 60, 24, 120, { roofH: 70, win: [g - 140], winW: 7, winH: 20, mason: false, lean: 10 }));
    out.push(nw(30, 120, 200, g, { lines: [{ p: [[80, 130], [96, 170], [86, 210]], w: 2.4, a: 0.6 }] }));
    out.push(gableR(NEC, 30, 200, 124, 86, 12));
    out.push({ p: [P(172, g, 1), P(172, g - 90, 1), P(196, g - 110, 1), P(236, g - 90, 1), P(236, g, 1)], c: NEC.wall, m: 'cloth', line: 1.1, lines: masonry(172, g - 110, 236, g, 20, 26, 0.4, 2) });
    out.push(win(NEC, 115, 104, 9, 26, { frame: false }));
    out.push(door(NEC, 115, g, 24, 84), win(NEC, 204, g - 40, 9, 30));
    out.push(skull(115, 146, 12), skull(20, g - 10, 10), skull(244, g - 8, 9));
    out.push(grave(62, g, 10, 30, -0.15));
    return out;
  });
  // 2. Кладбище: ограда с воротами, надгробия, раскрытая могила, мёртвое дерево и склеп
  bdef('bld_dwell_2', 'necropolis', g => {
    const out = [];
    // мёртвое дерево
    out.push({ p: tube([[56, g - 30, 12], [58, 120, 8], [44, 60, 4]]), c: '#3a3036', m: 'wood', line: 0.9 }, { p: tube([[57, 150, 6], [96, 110, 4], [120, 104, 1.5]]), c: '#3a3036', m: 'wood', line: 0.8 }, { p: tube([[56, 120, 5], [24, 88, 3], [12, 90, 1]]), c: '#3a3036', m: 'wood', line: 0.8 });
    // склеп
    out.push(nw(180, 120, 290, g - 30), gableR(NEC, 180, 290, 124, 70, 10), NEC.spire(235, 60, 8, 40, {}));
    out.push({ p: arch(235, g - 30, 22, 70, true), c: '#140e1a', m: 'cloth', ao: 1.2, line: 1 }, skull(235, 102, 10, { glow: '#c890ff' }));
    // надгробия и кресты
    out.push(grave(110, g - 30, 14, 44, -0.08), grave(150, g - 20, 12, 38, 0.1));
    out.push({ p: box(86, g - 90, 94, g - 34), c: '#8a8898', m: 'cloth', line: 0.9 }, { p: box(72, g - 76, 108, g - 68), c: '#8a8898', m: 'cloth', line: 0.9 });
    // раскрытая могила
    out.push({ p: [P(200, g - 4, 1), P(210, g - 22, 1), P(270, g - 22, 1), P(280, g - 4, 1)], c: '#140e10', m: 'cloth', line: 1 }, { p: [[210, g - 24], [230, g - 44], [256, g - 46], [276, g - 26]], c: '#5a4a3a', m: 'cloth', line: 1, belly: 0.4 });
    out.push({ p: tube([[272, g - 40, 3], [296, g - 90, 3]]), c: '#6a5030', m: 'wood', line: 0.7 }, { p: [P(286, g - 96, 1), P(304, g - 90, 1), P(302, g - 76, 1), P(290, g - 80, 1)], c: '#6a6a74', m: 'steel', line: 0.7 });
    // ограда с пиками
    const bars = []; for (let x = 10; x < 305; x += 14) if (Math.abs(x - 157) > 26) bars.push({ p: tube([[x, g, 2.6], [x, g - 44, 2.2], [x, g - 54, 0.4]]), c: NEC.iron, m: 'steel', line: 0.5 });
    out.push(bars, { p: box(8, g - 38, 306, g - 33), c: NEC.iron, m: 'steel', line: 0.5 }, { p: box(8, g - 14, 306, g - 10), c: NEC.iron, m: 'steel', line: 0.5 });
    out.push({ p: tube([[128, g, 6], [128, g - 80, 5]]), c: NEC.trim, m: 'cloth', line: 0.8 }, { p: tube([[186, g, 6], [186, g - 80, 5]]), c: NEC.trim, m: 'cloth', line: 0.8 }, bone([[128, g - 78, 4], [157, g - 104, 3], [186, g - 78, 4]]), skull(157, g - 104, 10));
    lit(157, g - 104);
    return out;
  });
  // 3. Гробница душ: низкий склеп под куполом, духи поднимаются из дверей
  bdef('bld_dwell_3', 'necropolis', g => {
    const out = [];
    out.push(steps(NEC, 177, g, 2, 10, 150, 166));
    out.push(nw(60, 130, 294, g - 20));
    out.push({ p: [P(80, 134, 1), [86, 80], [130, 44], [177, 34], [224, 44], [268, 80], P(274, 134, 1)], c: '#4a4658', m: 'steel', gloss: 0.6, line: 1.2, lines: [-0.5, 0, 0.5].map(k => ({ p: [[177 + k * 97, 134], [177 + k * 70, 70], [177 + k * 20, 36]], w: 2, a: 0.4 })), sub: [{ p: box(200, 20, 280, 140), c: '#2e2a3a', m: 'flat', line: 0 }] });
    out.push({ p: box(54, 124, 300, 138), c: NEC.trim, m: 'cloth', line: 1 }, NEC.spire(177, 38, 10, 36, {}));
    for (const x of [86, 136, 218, 268]) out.push({ p: box(x - 10, 138, x + 10, g - 20), c: '#6a6878', m: 'cloth', line: 1, lines: [{ p: [[x - 3, 142], [x - 3, g - 24]], w: 1.8, a: 0.4 }] });
    out.push({ p: arch(177, g - 20, 30, 100, true), c: '#0e0a14', m: 'cloth', ao: 1.3, line: 1 });
    lit(177, g - 70);
    out.push(halo(177, g - 90, 60, 80, 'rgba(160,255,220,0.15)'));
    out.push(wisp(168, g - 30, 90), wisp(190, g - 70, 110), wisp(150, g - 120, 70), wisp(214, 150, 60), wisp(140, 110, 50));
    out.push(skull(177, 120, 12), skull(20, g - 10, 10), skull(334, g - 8, 9));
    return out;
  });
  // 4. Поместье вампиров: два крутых щипца, башенка-игла, герб-летучая мышь, гроб у крыльца
  bdef('bld_dwell_4', 'necropolis', g => {
    const out = [];
    out.push(tower(NEC, 280, g - 40, 30, 190, { roofH: 110, win: [g - 170, g - 100], winW: 8, winH: 26, lean: 6 }));
    out.push(nw(30, 140, 250, g));
    out.push(gableR(NEC, 30, 140, 144, 110, 10), gableR(NEC, 140, 250, 144, 110, 10));
    out.push(win(NEC, 85, 110, 10, 34, { frame: false }), win(NEC, 195, 110, 10, 34, { frame: false }));
    out.push(win(NEC, 70, 214, 12, 42), win(NEC, 210, 214, 12, 42));
    // летучая мышь-герб
    out.push({ p: [P(140, 176, 1), P(124, 164, 1), P(96, 160, 1), P(106, 172, 1), P(98, 184, 1), P(116, 180, 1), P(126, 192, 1), P(140, 184, 1), P(154, 192, 1), P(164, 180, 1), P(182, 184, 1), P(174, 172, 1), P(184, 160, 1), P(156, 164, 1)], c: '#1a1220', m: 'leather', line: 0.8, glint: [[136, 172, 1.6], [144, 172, 1.6]] });
    out.push(door(NEC, 140, g, 24, 86, { lamp: [178, 230] }));
    out.push(coffin(300, g, 20, 80, '#4a1a24'));
    return out;
  });
  // 5. Мавзолей: ступенчатый склеп с портиком, пинаклями и фиолетовыми жаровнями
  bdef('bld_dwell_5', 'necropolis', g => {
    const out = [];
    out.push(steps(NEC, 200, g, 3, 12, 150, 190));
    out.push(nw(70, 170, 330, g - 36), { p: trap(200, 104, 170, 80, 140), c: NEC.wall, m: 'cloth', line: 1.2, lines: masonry(60, 104, 340, 170, 22, 40, 0.4, 2.2), sub: [{ p: box(240, 100, 346, 174), c: NEC.wallD, m: 'flat', line: 0 }] });
    out.push({ p: trap(200, 60, 104, 50, 80), c: NEC.wall, m: 'cloth', line: 1.2, sub: [{ p: box(226, 56, 286, 106), c: NEC.wallD, m: 'flat', line: 0 }] }, NEC.spire(200, 62, 30, 60, {}));
    for (const x of [70, 330]) out.push(tower(NEC, x, g - 36, 20, 170, { roofH: 90, mason: false, win: [] }));
    // портик
    out.push({ p: [P(118, 214, 1), P(200, 158, 1), P(282, 214, 1)], c: '#6a6878', m: 'cloth', line: 1.2 }, skull(200, 194, 14));
    for (const x of [132, 176, 224, 268]) out.push({ p: box(x - 10, 214, x + 10, g - 36), c: '#7a7888', m: 'cloth', line: 1, lines: [{ p: [[x - 3, 218], [x - 3, g - 40]], w: 1.8, a: 0.4 }] });
    out.push({ p: box(110, 208, 290, 220), c: NEC.trim, m: 'cloth', line: 1 });
    out.push(door(NEC, 200, g - 36, 26, 100, { glow: '#8a4ad0', fc: NEC.wallD }));
    out.push(win(NEC, 120, 150, 8, 26), win(NEC, 280, 150, 8, 26));
    out.push(nbrazier(24, g, 50), nbrazier(376, g, 50));
    return out;
  });
  // 6. Зал тьмы: мрачная крепость рыцарей смерти, чёрные знамёна, решётка
  bdef('bld_dwell_6', 'necropolis', g => {
    const out = [];
    for (const [x, L] of [[70, -8], [370, 8]]) out.push(tower(NEC, x, g, 42, 300, { roofH: 130, lean: L, win: [g - 230, g - 150], winW: 9, winH: 30 }));
    out.push(nw(100, 150, 340, g), merlons(96, 344, 148, 18, 26, NEC.wall, { k: 0.5, pointy: 12 }));
    out.push(tower(NEC, 220, 150, 44, 60, { roofH: 96, mason: false, win: [] }));
    // чёрные знамёна с черепом
    for (const x of [140, 300]) out.push({ p: [P(x - 20, 180, 1), P(x + 20, 180, 1), P(x + 20, 270, 1), P(x, 256, 1), P(x - 20, 270, 1)], c: '#1a1620', m: 'cloth', line: 1, lines: [{ p: [[x - 12, 190], [x - 10, 250]], w: 2, light: true, a: 0.3 }] }, skull(x, 212, 10), { p: box(x - 24, 174, x + 24, 180), c: NEC.iron, m: 'steel', line: 0.6 });
    // ворота с решёткой
    out.push({ p: arch(220, g, 52, 170, true), c: NEC.trim, m: 'cloth', line: 1.2, lines: voussoirs(220, g - 118, 50, 7) });
    const grate = []; for (let x = 196; x <= 244; x += 12) grate.push({ p: [[x, g - 160], [x, g]], w: 3.4, c: '#5a5868', a: 0.95 }); for (let y = g - 120; y < g; y += 18) grate.push({ p: [[176, y], [264, y]], w: 3, c: '#5a5868', a: 0.95 });
    lit(220, g - 60);
    out.push({ p: arch(220, g, 38, 150, true), c: '#1a0e28', m: 'cloth', ao: 1.3, line: 1, lines: grate, sub: [{ e: [220, g - 30, 30, 40], c: '#4a2a70', m: 'flat', line: 0 }] });
    out.push(skull(220, g - 190, 18, { glow: '#c890ff' }));
    for (const x of [22, 418]) out.push({ p: tube([[x, g, 4], [x, g - 60, 3], [x, g - 76, 0.5]]), c: NEC.iron, m: 'steel', line: 0.6 });
    return out;
  });
  // 7. Драконье хранилище: хребет и рёбра исполинского дракона над склепом, череп с горящими глазами
  bdef('bld_dwell_7', 'necropolis', g => {
    const out = [];
    // склеп
    out.push(nw(150, g - 170, 390, g), gableR(NEC, 150, 390, g - 166, 90, 12));
    out.push({ p: arch(270, g, 50, 150, true), c: NEC.trim, m: 'cloth', line: 1.2, lines: voussoirs(270, g - 100, 48, 7) });
    lit(270, g - 60);
    out.push({ p: arch(270, g, 38, 134, true), c: '#3a1a5a', m: 'gem', gloss: 0.5, rim: 0, line: 1, sub: [{ e: [270, g - 20, 30, 50], c: '#9a5ae0', m: 'flat', line: 0 }] });
    out.push(win(NEC, 190, g - 90, 10, 34), win(NEC, 350, g - 90, 10, 34));
    // хребет от хвоста (слева) к шее (справа)
    const spine = [[20, g - 20], [60, g - 120], [140, 150], [240, 100], [340, 96], [420, 130], [460, 180]];
    out.push(bone(spine.map(([x, y], i) => [x, y, 14 - i * 0.8])));
    for (let i = 0; i < spine.length - 1; i++) { const [x, y] = spine[i]; if (i < 1) continue; out.push({ p: [P(x - 8, y - 4, 1), P(x + 2, y - 26, 1), P(x + 8, y - 2, 1)], c: NEC.bone, m: 'horn', line: 0.7 }); }
    // рёбра дугами до земли
    for (const [x, y, k] of [[150, 146, 1], [200, 120, 1], [250, 104, 1.05], [300, 98, 1.05], [350, 100, 1], [400, 118, 0.95]]) {
      out.push(bone([[x, y, 9], [x - 60 * k, y + 60, 8], [x - 76 * k, y + 150, 6], [x - 60 * k, g - 200 + 160 * (k - 1) + 60, 4]]));
      out.push(bone([[x, y, 8], [x + 36 * k, y + 70, 6], [x + 40 * k, y + 140, 4]], { op: 0.9 }));
    }
    // череп дракона на шее, смотрит вправо-вниз
    out.push({ p: [[440, 140], [470, 118], [506, 124], [534, 150], P(540, 172, 1), [520, 180], [496, 176], [470, 196], [446, 190], [432, 168]], c: NEC.bone, m: 'horn', gloss: 0.5, line: 1.1,
      lines: [{ p: [[470, 180], [536, 170]], w: 2.4, a: 0.7 }, { p: [[500, 178], [502, 186]], w: 3, c: '#1a1210', a: 0.9 }, { p: [[516, 176], [518, 184]], w: 3, c: '#1a1210', a: 0.9 }] });
    out.push({ p: [[450, 196], [480, 194], [520, 192], P(534, 196, 1), [510, 212], [470, 214]], c: tone(NEC.bone, -0.1), m: 'horn', line: 1 });
    out.push({ p: tube([[462, 132, 8], [440, 100, 5], [444, 70, 1]]), c: '#b8ac94', m: 'horn', line: 0.8 }, { p: tube([[476, 124, 6], [470, 96, 4], [480, 76, 1]]), c: '#b8ac94', m: 'horn', line: 0.8 });
    lit(486, 146);
    out.push(halo(486, 146, 16, 12, 'rgba(190,120,255,0.4)'), { e: [486, 146, 9, 6], c: '#c890ff', m: 'gem', gloss: 1.2, line: 0.6, lc: '#1a0e24' });
    out.push(skull(60, g - 12, 12), skull(470, g - 10, 14));
    return out;
  });

  /* ---------- укрепления: тёмная стена с игольчатыми зубцами, черепа, врата с фиолетовым светом ---------- */
  function fortNec(lvl) {
    return (g) => {
      const out = [], wallTop = g - 180;
      out.push(nw(10, wallTop, 970, g, { k: 0.02, rh: 24, bw: 48 }), merlons(6, 974, wallTop - 2, 22, 44, NEC.wall, { k: 0.5, pointy: 12 }));
      out.push({ p: box(10, g - 30, 970, g), c: NEC.trim, m: 'cloth', line: 1 });
      for (const x of [200, 330, 650, 780]) out.push(skull(x, wallTop + 40, 11));
      if (lvl >= 2) for (const [x, L] of [[110, -8], [870, 8]]) out.push(tower(NEC, x, g, 58, 330, { roofH: 132, lean: L, win: [g - 250, g - 160], winW: 10, winH: 32 }));
      if (lvl >= 3) out.push(tower(NEC, 490, g - 150, 84, 300, { roofH: 190, eave: 12, win: [g - 380, g - 290], winW: 12, winH: 38 }), buttress(406, g - 380, g - 150, -1, 14), buttress(574, g - 380, g - 150, 1, 14));
      const top = wallTop - 54;
      out.push(nw(404, top, 576, g, { rh: 24, bw: 40 }), merlons(398, 582, top - 2, 24, 30, NEC.wall, { k: 0.5, pointy: 14 }));
      for (const x of [404, 576]) out.push(cone(x, top - 20, 12, 70, NEC.roof, NEC.roofD, { flare: 0.3, m: 'steel' }));
      out.push({ p: arch(490, g, 60, 164, true), c: NEC.trim, m: 'cloth', line: 1.2, lines: voussoirs(490, g - 104, 56, 7) });
      lit(490, g - 60);
      const grate = []; for (let x = 460; x <= 520; x += 15) grate.push({ p: [[x, g - 150], [x, g]], w: 3.4, c: '#6a6878', a: 0.95 }); for (let y = g - 110; y < g; y += 18) grate.push({ p: [[440, y], [540, y]], w: 3, c: '#6a6878', a: 0.95 });
      out.push({ p: arch(490, g, 46, 146, true), c: '#1a0e28', m: 'cloth', ao: 1.3, line: 1, lines: grate, sub: [{ e: [490, g - 30, 36, 50], c: '#5a2a8a', m: 'flat', line: 0 }] });
      out.push(skull(490, top + 34, 18, { glow: '#c890ff' }));
      out.push(win(NEC, 438, top + 64, 7, 28), win(NEC, 542, top + 64, 7, 28));
      return out;
    };
  }
  bdef('bld_fort', 'necropolis', fortNec(1)); bdef('bld_citadel', 'necropolis', fortNec(2)); bdef('bld_castle', 'necropolis', fortNec(3));

  /* ================================= ПОДЗЕМЕЛЬЕ ================================= */
  const DUN = {
    wall: '#5e4e62', wallD: '#34283a', trim: '#46384c', roof: '#8a4ac0', roofD: '#4e2a72', win: '#e8a0ff', winLC: '#2a0e3a',
    door: '#3a2a34', iron: '#3a3240', rock: '#4c4454', rockD: '#3a3342', cry: '#b070f0', cry2: '#d8a8ff', lamp: '#e8a8ff', cap: '#b0405a', cap2: '#6a4ac0',
  };
  /** Крыша подземелья: пурпурный конус, на вершине — кристалл. */
  DUN.spire = (cx, y, hw, h, o) => {
    o = o || {}; const L = o.lean || 0;
    const out = cone(cx, y, hw, h, DUN.roof, DUN.roofD, { flare: 0.1, lean: L });
    out.push(crystal(cx + L, y - h + 10, Math.max(5, hw * 0.2), Math.max(22, hw * 0.9), DUN.cry2, 0));
    return out;
  };
  const dw = (x0, y0, x1, y1, o) => wallB(DUN, x0, y0, x1, y1, o);
  /** Клыки-сталактиты вниз от линии y (x0…x1). */
  function fangs(x0, x1, y, len, n, c) {
    const out = [], st = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { const x = x0 + st * (i + 0.5), l = len * (0.6 + ((i * 37) % 5) / 10); out.push({ p: [P(x - st * 0.42, y - 4, 1), P(x + st * 0.42, y - 4, 1), [x + st * 0.12, y + l * 0.6], P(x, y + l, 1), [x - st * 0.14, y + l * 0.55]], c: c || '#6a6072', m: 'horn', gloss: 0.3, line: 0.8 }); }
    return out;
  }
  /** Пещерный зев: тёмный провал (арка неправильной формы) с клыками. */
  function cave(cx, G, w, h, o) {
    o = o || {};
    const out = [{ p: [P(cx - w, G, 1), [cx - w * 0.96, G - h * 0.5], [cx - w * 0.6, G - h * 0.92], [cx, G - h], [cx + w * 0.62, G - h * 0.9], [cx + w * 0.98, G - h * 0.46], P(cx + w, G, 1)], c: o.c || '#0c0810', m: 'cloth', ao: 1.5, line: 1.1, sub: o.glow ? [{ e: [cx, G - h * 0.2, w * 0.7, h * 0.45], c: o.glow, m: 'flat', line: 0 }] : [] }];
    if (o.fangs !== false) out.push(fangs(cx - w * 0.72, cx + w * 0.72, G - h * 0.9, h * 0.22, o.nf || 5, o.fc));
    return out;
  }
  const dCrag = (x0, x1, G, top, seed, o) => crag(x0, x1, G, top, seed, Object.assign({ c: DUN.rock }, o));

  /* ---------- ратуша: дворец, вытесанный в скале; кристаллы и грибы ---------- */
  bdef('bld_hall_1', 'dungeon', g => [
    dCrag(14, 406, g, 70, 101, { n: 9 }),
    dw(84, 184, 336, g), hip(DUN, 84, 336, 190, 70, 14, 60), { p: box(78, 182, 342, 194), c: DUN.trim, m: 'cloth', line: 1 },
    crystal(210, 124, 12, 44, DUN.cry2, 0),
    win(DUN, 126, 268, 12, 36), win(DUN, 294, 268, 12, 36),
    door(DUN, 210, g, 26, 100, { lamp: [252, 280] }), fangs(186, 234, g - 102, 18, 3),
    mushroom(40, g, 64, 34, DUN.cap), mushroom(66, g, 36, 20, DUN.cap2, { lean: 6 }), druse(378, g, 50, DUN.cry, DUN.cry2),
  ]);
  bdef('bld_hall_2', 'dungeon', g => [
    dCrag(10, 450, g, 40, 102, { n: 10 }),
    tower(DUN, 84, 280, 32, 170, { roofH: 86, win: [180, 236], winW: 7, winH: 22, mason: false }),
    tower(DUN, 376, 280, 32, 170, { roofH: 86, win: [180, 236], winW: 7, winH: 22, mason: false }),
    dw(96, 214, 364, g), hip(DUN, 96, 364, 220, 78, 14, 70), { p: box(90, 212, 370, 224), c: DUN.trim, m: 'cloth', line: 1 },
    crystal(230, 146, 14, 52, DUN.cry2, 0),
    win(DUN, 140, 300, 13, 40), win(DUN, 320, 300, 13, 40), win(DUN, 140, 386, 12, 32), win(DUN, 320, 386, 12, 32),
    door(DUN, 230, g, 30, 116, { lamp: [284, 350] }), fangs(202, 258, g - 118, 20, 3),
    mushroom(30, g, 80, 36, DUN.cap), mushroom(430, g, 60, 30, DUN.cap2), druse(56, g, 36, DUN.cry, DUN.cry2),
  ]);
  bdef('bld_hall_3', 'dungeon', g => [
    dCrag(6, 514, g, 30, 103, { n: 11 }),
    tower(DUN, 260, 214, 30, 114, { roofH: 84, win: [150], winW: 7, winH: 20, mason: false }),
    tower(DUN, 78, 290, 36, 190, { roofH: 96, win: [190, 250], winW: 8, winH: 24, mason: false }),
    tower(DUN, 442, 290, 36, 190, { roofH: 96, win: [190, 250], winW: 8, winH: 24, mason: false }),
    dw(96, 220, 424, g), hip(DUN, 96, 424, 226, 76, 14, 70), { p: box(90, 218, 430, 230), c: DUN.trim, m: 'cloth', line: 1 },
    // вытесанный фасад: щипец, око-кристалл
    { p: [P(186, 236, 1), P(260, 128, 1), P(334, 236, 1)], c: DUN.wall, m: 'cloth', line: 1.2, sub: [{ p: [P(262, 124, 1), P(344, 240, 1), P(300, 240, 1)], c: DUN.wallD, m: 'flat', line: 0 }] },
    { p: tube([[176, 238, 8], [260, 120, 7], [344, 238, 8]]), c: DUN.roof, m: 'leather', line: 1 },
    { e: [260, 196, 26, 16], c: '#e8dcf0', m: 'gem', gloss: 0.8, line: 1, lc: '#2a0e3a', sub: [{ e: [260, 196, 11, 11], c: '#b030d0', m: 'gem', line: 0 }, { e: [260, 196, 4, 7], c: '#1a0820', m: 'flat', line: 0 }] },
    win(DUN, 136, 310, 12, 38), win(DUN, 384, 310, 12, 38), win(DUN, 136, 400, 12, 34), win(DUN, 384, 400, 12, 34), win(DUN, 206, 330, 10, 32), win(DUN, 314, 330, 10, 32),
    door(DUN, 260, g, 32, 112, { lamp: [312, 380] }), fangs(230, 290, g - 114, 20, 3),
    mushroom(30, g, 90, 32, DUN.cap), druse(490, g, 56, DUN.cry, DUN.cry2), mushroom(150, g, 40, 22, DUN.cap2, { lean: -6 }),
  ]);
  bdef('bld_hall_4', 'dungeon', g => {
    const out = [];
    out.push(dCrag(0, 560, g, 60, 104, { n: 12, pow: 0.6 }));
    const keep = tower(DUN, 280, 330, 62, 200, { roofH: 140, eave: 10, win: [220, 290], winW: 12, winH: 36 });
    out.push(keep);
    for (const x of [166, 394]) out.push(tower(DUN, x, 340, 26, 130, { roofH: 80, win: [260], winW: 7, winH: 20, mason: false }));
    for (const x of [64, 496]) out.push(tower(DUN, x, g, 38, 380, { roofH: 110, win: [270, 350, 430, 510], winW: 8, winH: 24 }));
    out.push(dw(100, 330, 460, g), merlons(96, 464, 328, 14, 24, DUN.wall, { k: 0.5 }));
    out.push(win(DUN, 140, 410, 12, 36), win(DUN, 420, 410, 12, 36), win(DUN, 140, 500, 12, 34), win(DUN, 420, 500, 12, 34));
    // пещерные врата с клыками и лиловым светом
    out.push({ p: arch(280, g - 16, 86, 190, false), c: DUN.rock, m: 'horn', gloss: 0.15, line: 1.2 });
    lit(280, g - 70);
    out.push(cave(280, g - 16, 64, 160, { glow: '#5a2a80', nf: 6 }));
    out.push(druse(186, g - 16, 50, DUN.cry, DUN.cry2), druse(374, g - 16, 50, DUN.cry, DUN.cry2));
    out.push(steps(DUN, 280, g, 2, 8, 110, 130));
    out.push(mushroom(20, g, 70, 26, DUN.cap), mushroom(540, g, 70, 26, DUN.cap2));
    return out;
  });

  /* ---------- гильдия магов: башня с друзами на каждом ярусе, кристалл в каменной длани ---------- */
  function guildDun(L) {
    return (g, fr) => {
      const cx = fr.anchor[0], top = 200, floors = L + 1, fh = (g - 34 - top) / floors, hw0 = 62, hw1 = 46, out = [];
      const hwAt = y => hw1 + (hw0 - hw1) * (y - top) / (g - 34 - top);
      out.push(dCrag(cx - hw0 - 24, cx + hw0 + 24, g, g - 60, 200 + L, { n: 5 }));
      out.push({ p: trap(cx, top, g - 34, hw1, hw0), c: DUN.wall, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 34, 26, 38, 0.4, 2.4),
        sub: [{ p: [P(cx + hw1 * 0.4, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.4, g, 1)], c: DUN.wallD, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) {
        const y = g - 34 - i * fh, hw = hwAt(y);
        out.push({ p: box(cx - hw - 8, y - 6, cx + hw + 8, y + 6), c: DUN.trim, m: 'cloth', line: 1 });
        out.push(crystal(cx + (i % 2 ? -1 : 1) * (hw + 4), y - 4, 7, 30, i % 2 ? DUN.cry : DUN.cry2, (i % 2 ? -1 : 1) * 0.3));
      }
      for (let i = 1; i < floors; i++) { const y = g - 34 - i * fh - 18; out.push(win(DUN, cx + (i % 2 ? 12 : -12), y, 12, Math.min(56, fh * 0.52), { round: true })); }
      out.push(door(DUN, cx, g - 34, 26, Math.min(100, fh * 0.8), { round: true, lamp: [cx + 40, g - 90] }));
      // каменная длань с парящим кристаллом
      out.push({ p: box(cx - hw1 - 12, top - 10, cx + hw1 + 12, top + 6), c: DUN.trim, m: 'cloth', line: 1 });
      for (const s of [-1, 1]) out.push({ p: tube([[cx + s * (hw1 - 4), top - 6, 12], [cx + s * (hw1 + 8), top - 40, 9], [cx + s * 26, top - 84 - L * 4, 4]]), c: DUN.rock, m: 'horn', gloss: 0.2, line: 1 });
      const cy = top - 40 - L * 3;
      lit(cx, cy - 30);
      out.push(halo(cx, cy - 30, 56, 64, 'rgba(210,140,255,0.22)'), { p: [P(cx, cy + 10, 1), P(cx - 18 - L, cy - 30, 1), P(cx, cy - 76 - L * 4, 1), P(cx + 18 + L, cy - 30, 1)], c: DUN.cry2, m: 'gem', gloss: 1.3, rim: 0.8, line: 1,
        sub: [{ p: [P(cx, cy + 12, 1), P(cx, cy - 78 - L * 4, 1), P(cx + 20 + L, cy - 30, 1)], c: DUN.cry, m: 'flat', line: 0 }] });
      return out;
    };
  }
  for (let i = 1; i <= 4; i++) bdef('bld_guild_' + i, 'dungeon', guildDun(i));

  /* ---------- таверна: дом в ножке исполинского гриба ---------- */
  bdef('bld_tavern', 'dungeon', g => {
    const out = [];
    out.push(mushroom(310, g, 110, 44, DUN.cap2, { lean: 10 }));
    // ножка-дом
    out.push({ p: [P(88, g, 1), [96, 240], [110, 170], P(118, 130, 1), P(242, 130, 1), [250, 170], [264, 240], P(272, g, 1)], c: '#d8c8b4', m: 'skin', line: 1.2, belly: 0.3,
      lines: [{ p: [[130, 140], [124, 250], [112, g]], w: 2, a: 0.3 }, { p: [[226, 140], [236, 250], [250, g]], w: 2, a: 0.3 }], sub: [{ p: box(214, 120, 280, g + 4), c: '#a89684', m: 'flat', line: 0 }] });
    // труба сквозь шляпку
    out.push({ p: box(222, 36, 248, 110), c: DUN.trim, m: 'cloth', line: 1, lines: masonry(222, 36, 248, 110, 14, 13, 0.4, 2) }, { p: box(218, 30, 252, 40), c: DUN.iron, m: 'steel', line: 1 });
    // шляпка
    const spots = [[80, 96, 18, 10], [150, 70, 22, 12], [236, 76, 16, 9], [290, 110, 14, 8], [196, 110, 12, 7]].map(([x, y, rx, ry]) => ({ e: [x, y, rx, ry], c: '#f0c8d4', m: 'flat', line: 0 }));
    out.push({ p: [P(20, 150, 1), [30, 110], [90, 64], [180, 44], [270, 64], [330, 110], P(340, 150, 1), [290, 146], [180, 156], [70, 146]], c: DUN.cap, m: 'skin', gloss: 0.7, line: 1.2,
      sub: spots.concat([{ p: [P(20, 150, 1), P(340, 150, 1), [290, 150], [180, 162], [70, 150]], c: '#6a1a34', m: 'flat', line: 0 }, { p: [[250, 50], [340, 110], [340, 160], [230, 160]], c: tone(DUN.cap, -0.25), m: 'flat', line: 0 }]) });
    out.push({ p: [P(40, 150, 1), [180, 164], P(320, 150, 1), [180, 172]], c: '#e0d0c0', m: 'skin', line: 0.8, lines: range(12, i => ({ p: [[60 + i * 22, 152], [180 + (i - 5.5) * 6, 166]], w: 1.4, a: 0.4 })) });
    // окна-кругляши, дверь, вывеска
    out.push(win(DUN, 140, 214, 13, 30, { round: true }), win(DUN, 222, 214, 13, 30, { round: true }), win(DUN, 180, 180, 10, 22, { round: true }));
    out.push(door(DUN, 180, g, 26, 92, { round: true, fc: '#a89684' }));
    out.push({ p: tube([[262, 250, 5], [312, 250, 5]]), c: DUN.iron, m: 'steel', line: 0.8 }, { p: box(278, 258, 314, 300), c: '#5a3a2a', m: 'wood', flow: 0, line: 1.2,
      sub: [{ p: [P(286, 268, 1), P(302, 268, 1), P(302, 292, 1), P(286, 292, 1)], c: '#d8a53a', m: 'gold', line: 0.8 }, { e: [306, 280, 4, 7], c: '#5a3a2a', m: 'flat', line: 0 }] });
    lit(70, g - 70);
    out.push({ p: tube([[70, g, 4], [70, g - 60, 3]]), c: DUN.iron, m: 'steel', line: 0.6 }, crystal(70, g - 58, 7, 26, DUN.cry2, 0));
    out.push(mushroom(26, g, 40, 22, DUN.cap));
    return out;
  });

  /* ---------- кузница: горн в скальной нише, труба-утёс с огнём ---------- */
  bdef('bld_blacksmith', 'dungeon', g => {
    const out = [];
    out.push(dCrag(8, 190, g, 70, 111, { n: 6 }));
    out.push({ p: [P(226, 200, 1), [222, 120], P(236, 40, 1), P(270, 34, 1), [284, 120], P(284, 200, 1)], c: DUN.rock, m: 'horn', gloss: 0.15, line: 1.1, lines: [{ p: [[246, 50], [240, 120], [250, 190]], w: 2, a: 0.4 }] });
    lit(253, 16);
    out.push(halo(253, 14, 36, 30, 'rgba(255,140,60,0.22)'), flame(253, 38, 18, 50, { lean: 6 }));
    out.push(dw(160, 200, 312, g), hip(DUN, 160, 312, 206, 76, 14, 50));
    // горн в пещере
    out.push(cave(92, g, 62, 150, { c: '#140a0c', nf: 4 }));
    lit(92, g - 40);
    out.push(halo(92, g - 40, 60, 40, 'rgba(255,130,50,0.25)'), pool(92, g - 22, 40, 18, '#ff6a1a', '#ffd060'), flame(92, g - 28, 26, 62));
    out.push(door(DUN, 236, g, 22, 88, { lamp: [276, 300] }));
    out.push(win(DUN, 290, 260, 9, 28));
    out.push({ p: tube([[188, 290, 4], [214, 236, 4]]), c: '#4a3a2a', m: 'wood', line: 0.8 }, { p: box(200, 226, 228, 244), c: '#6a6a74', m: 'steel', line: 1 });
    out.push({ p: [P(170, g - 40, 1), P(222, g - 40, 1), [234, g - 34], P(216, g - 26, 1), P(210, g - 12, 1), P(220, g, 1), P(176, g, 1), P(186, g - 12, 1), P(180, g - 26, 1)], c: '#44424c', m: 'steel', line: 1, glint: [[182, g - 36, 3]] });
    out.push(druse(20, g, 36, DUN.cry, DUN.cry2));
    return out;
  });

  /* ---------- рынок: аркада под сталактитами, пурпурные навесы, самоцветы и грибы ---------- */
  bdef('bld_market', 'dungeon', g => {
    const out = [];
    out.push(dCrag(0, 407, 130, 20, 121, { n: 10, pow: 0.4 }));
    out.push(dw(28, 118, 380, g));
    out.push(hip(DUN, 28, 380, 122, 50, 14, 60), { p: box(24, 116, 384, 128), c: DUN.trim, m: 'cloth', line: 1 });
    out.push(crystal(190, 76, 14, 50, DUN.cry2, 0));
    const WARES = [
      (cx) => [crystal(cx - 16, g - 30, 8, 26, DUN.cry, -0.1), crystal(cx + 2, g - 30, 9, 34, DUN.cry2, 0.05), crystal(cx + 20, g - 30, 7, 22, '#70b0f0', 0.2)],
      (cx) => [{ e: [cx - 18, g - 38, 9, 7], c: '#e04a6a', m: 'gem', gloss: 1.2, line: 0.7 }, { e: [cx + 2, g - 40, 9, 7], c: '#40c0a0', m: 'gem', gloss: 1.2, line: 0.7 }, { e: [cx + 20, g - 38, 9, 7], c: '#e8c83a', m: 'gem', gloss: 1.2, line: 0.7 }],
      (cx) => [mushroom(cx - 16, g - 30, 14, 10, DUN.cap, { spots: 2 }), mushroom(cx + 4, g - 30, 18, 12, DUN.cap2, { spots: 2 }), mushroom(cx + 22, g - 30, 12, 9, DUN.cap, { spots: 1 })],
    ];
    [[94, 0], [204, 1], [314, 2]].forEach(([cx, k]) => {
      out.push({ p: arch(cx, g, 38, 100, false), c: '#140e18', m: 'cloth', ao: 1.2, line: 1.2 });
      lit(cx, g - 70);
      out.push({ p: box(cx - 34, g - 30, cx + 34, g), c: '#4a3a3a', m: 'wood', flow: 0, line: 1 }, WARES[k](cx));
      const stripes = []; for (let x = cx - 50; x < cx + 50; x += 20) stripes.push({ p: [P(x, g - 110, 1), P(x + 10, g - 110, 1), P(x + 12, g - 84, 1), P(x + 2, g - 84, 1)], c: '#d8a8f0', m: 'flat', line: 0 });
      out.push({ p: [P(cx - 50, g - 112, 1), P(cx + 50, g - 112, 1), P(cx + 56, g - 84, 1), [cx + 38, g - 78], [cx + 19, g - 84], [cx, g - 78], [cx - 19, g - 84], [cx - 38, g - 78], P(cx - 56, g - 84, 1)], c: '#7a3aa8', m: 'cloth', line: 1.2, sub: stripes });
    });
    return out;
  });

  /* ---------- хранилище: башня-закром, груда серы и вагонетка ---------- */
  bdef('bld_silo', 'dungeon', g => {
    const out = [];
    out.push(dCrag(6, 150, g, 190, 131, { n: 5 }));
    out.push({ p: [P(140, 160, 1), P(280, 160, 1), P(284, g, 1), [210, g + 4], P(136, g, 1)], c: DUN.wall, m: 'cloth', line: 1.2, lines: masonry(136, 160, 284, g, 22, 30, 0.35, 2.2).concat(range(3, i => ({ p: [[138, 206 + i * 64], [210, 216 + i * 64], [282, 206 + i * 64]], w: 5, c: DUN.trim, a: 0.9 }))),
      sub: [{ p: box(238, 150, 290, g + 6), c: DUN.wallD, m: 'flat', line: 0 }] });
    out.push(DUN.spire(210, 162, 84, 104, {}));
    out.push(win(DUN, 210, 240, 11, 34, { round: true }));
    out.push(door(DUN, 196, g, 20, 76, { round: true, lamp: [170, 318] }));
    // сера
    out.push({ p: [P(16, g, 1), [30, g - 40], [70, g - 74], [100, g - 80], [132, g - 50], P(150, g, 1)], c: '#e8c83a', m: 'skin', gloss: 0.4, line: 1, lines: range(5, i => ({ p: [[40 + i * 20, g - 20 - (i % 2) * 20], [48 + i * 20, g - 26 - (i % 2) * 20]], w: 3, light: true, a: 0.6 })) });
    out.push({ p: [P(250, g - 8, 1), P(244, g - 50, 1), P(316, g - 50, 1), P(310, g - 8, 1)], c: '#5a4a44', m: 'wood', flow: 0, line: 1, lines: [{ p: [[246, g - 30], [314, g - 30]], w: 3, c: DUN.iron, a: 0.8 }] });
    out.push({ p: [[248, g - 50], [262, g - 70], [284, g - 76], [304, g - 66], [312, g - 50]], c: '#e8c83a', m: 'skin', line: 0.8 }, { e: [262, g - 6, 8, 8], c: DUN.iron, m: 'steel', line: 0.7 }, { e: [298, g - 6, 8, 8], c: DUN.iron, m: 'steel', line: 0.7 });
    return out;
  });

  /* ---------- Портал призыва: каменное кольцо с рунами и лиловым вихрем ---------- */
  bdef('bld_special', 'dungeon', g => {
    const out = [], cx = 140, cy = 128, R = 96;
    out.push(steps(DUN, cx, g, 3, 10, 90, 126));
    lit(cx, cy);
    out.push(halo(cx, cy, R + 30, R + 30, 'rgba(190,110,255,0.2)'));
    // вихрь
    out.push({ e: [cx, cy, R - 16, R - 16], c: '#6a2aa8', m: 'gem', gloss: 0.8, rim: 0, line: 0,
      sub: [{ e: [cx, cy, R * 0.55, R * 0.55], c: '#a860f0', m: 'flat', line: 0 }, { e: [cx, cy, R * 0.25, R * 0.25], c: '#f0dcff', m: 'flat', line: 0 }],
      lines: range(4, i => { const pts = []; for (let k = 0; k <= 16; k++) { const a = i * Math.PI / 2 + k * 0.35, r = (R - 20) * (1 - k / 18); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return { p: pts, w: 4, c: '#e0b0ff', a: 0.6 }; }) });
    // каменное кольцо из блоков с рунами
    const ring = [];
    for (let i = 0; i < 12; i++) {
      const a0 = i / 12 * Math.PI * 2, a1 = (i + 1) / 12 * Math.PI * 2 - 0.04;
      const pt = (a, r) => P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1);
      ring.push({ p: [pt(a0, R - 16), pt(a0, R + 12), [cx + Math.cos((a0 + a1) / 2) * (R + 14), cy + Math.sin((a0 + a1) / 2) * (R + 14)], pt(a1, R + 12), pt(a1, R - 16)], c: DUN.rock, m: 'horn', gloss: 0.2, line: 1,
        lines: [{ p: [[cx + Math.cos((a0 + a1) / 2) * (R - 8), cy + Math.sin((a0 + a1) / 2) * (R - 8)], [cx + Math.cos((a0 + a1) / 2) * (R + 4), cy + Math.sin((a0 + a1) / 2) * (R + 4)]], w: 3, c: '#e0a0ff', a: 0.8 }] });
    }
    out.push(ring);
    out.push({ p: trap(cx, g - 50, g - 30, 50, 70), c: DUN.trim, m: 'cloth', line: 1 });
    out.push(druse(26, g, 44, DUN.cry, DUN.cry2), druse(254, g, 44, DUN.cry, DUN.cry2));
    return out;
  });

  /* ---------- жилища Подземелья ---------- */
  // 1. Логово троглодитов: каменный холм с норами, грибы
  bdef('bld_dwell_1', 'dungeon', g => {
    const out = [];
    out.push(dCrag(6, 254, g, 60, 141, { n: 7 }));
    out.push(cave(80, g, 30, 70, { nf: 3 }), cave(180, g, 26, 60, { nf: 3 }), cave(136, g - 100, 18, 40, { nf: 2 }));
    lit(80, g - 30); lit(180, g - 26);
    for (const [x, y] of [[74, g - 36], [86, g - 36], [174, g - 30], [186, g - 30]]) out.push({ e: [x, y, 3.2, 2.2], c: '#ffe070', m: 'gem', gloss: 1, line: 0 });
    out.push(mushroom(24, g, 44, 20, DUN.cap), mushroom(240, g, 34, 16, DUN.cap2), mushroom(128, g, 22, 12, DUN.cap));
    out.push(crystal(210, 110, 7, 30, DUN.cry2, 0.2));
    return out;
  });
  // 2. Гнездо гарпий: скальные иглы с гнёздами из прутьев на уступах
  bdef('bld_dwell_2', 'dungeon', g => {
    const out = [];
    // гнездо: чаша из прутьев, торчащие ветки, яйца
    const nest = (x, y, w) => [
      range(5, i => ({ p: tube([[x - w * 0.6 + i * w * 0.3, y, 2.4], [x - w * 1.1 + i * w * 0.55, y - w * 0.5 - (i % 2) * 6, 1]]), c: '#6a4a2a', m: 'wood', line: 0.5 })),
      { e: [x - w * 0.22, y - w * 0.18, w * 0.2, w * 0.24], c: '#e8e0d0', m: 'skin', gloss: 0.6, line: 0.7 }, { e: [x + w * 0.2, y - w * 0.2, w * 0.18, w * 0.22], c: '#d8d0e8', m: 'skin', gloss: 0.6, line: 0.7 },
      { p: [P(x - w, y - w * 0.16, 1), [x - w * 0.86, y + w * 0.34], [x, y + w * 0.5], [x + w * 0.86, y + w * 0.34], P(x + w, y - w * 0.16, 1), [x, y + w * 0.04]], c: '#8a643a', m: 'wood', line: 1,
        lines: range(6, i => ({ p: [[x - w + i * w * 0.36, y - w * 0.1], [x - w * 0.5 + i * w * 0.3, y + w * 0.4]], w: 2.2, a: 0.6 })).concat([{ p: [[x - w, y + w * 0.05], [x, y + w * 0.3], [x + w, y + w * 0.05]], w: 2.2, a: 0.5 }]) }];
    out.push({ p: [P(92, g, 1), [96, 200], [118, 110], P(146, 50, 1), [178, 110], [200, 200], P(206, g, 1)], c: DUN.rock, m: 'horn', gloss: 0.15, line: 1.1, belly: 0.3, lines: [{ p: [[140, 70], [130, 160], [150, 250]], w: 2.2, a: 0.4 }, { p: [[176, 140], [186, 220]], w: 2, a: 0.4 }] });
    out.push({ p: [P(196, g, 1), [202, 220], [222, 150], P(246, 104, 1), [270, 150], [290, 220], P(304, g, 1)], c: DUN.rockD, m: 'horn', gloss: 0.15, line: 1.1, belly: 0.3 });
    out.push({ p: [P(6, g, 1), [20, 210], P(52, 150, 1), [84, 200], P(104, g, 1)], c: DUN.rockD, m: 'horn', gloss: 0.15, line: 1.1 });
    out.push(nest(146, 60, 44), nest(246, 114, 34), nest(52, 158, 30), nest(186, 176, 24));
    for (const [x, y, a] of [[100, 230, -0.6], [214, 70, 0.4], [280, 210, 0.8], [30, 100, 2.2]]) out.push({ p: K.leaf([x, y], a, 30, 10).body, c: '#6a4a8a', m: 'feather', line: 0.6 });
    out.push(skull(260, g - 8, 8), crystal(110, g, 8, 30, DUN.cry, -0.2));
    return out;
  });
  // 3. Столп глаз: каменный столп с горящими очами, наверху — исполинский глаз
  bdef('bld_dwell_3', 'dungeon', g => {
    const out = [];
    const eye = (x, y, r, c) => { lit(x, y); return { e: [x, y, r, r * 0.7], c: '#f0e8d8', m: 'gem', gloss: 0.8, line: 1, lc: '#2a1020', sub: [{ e: [x, y, r * 0.5, r * 0.5], c: c || '#e03a2a', m: 'flat', line: 0 }, { e: [x, y, r * 0.16, r * 0.36], c: '#140810', m: 'flat', line: 0 }] }; };
    out.push(steps(DUN, 177, g, 2, 12, 90, 112));
    out.push({ p: [P(128, g - 24, 1), P(142, 90, 1), P(212, 90, 1), P(226, g - 24, 1)], c: DUN.wall, m: 'cloth', line: 1.2, lines: masonry(128, 90, 226, g - 24, 24, 36, 0.4, 2.2), sub: [{ p: box(196, 80, 232, g), c: DUN.wallD, m: 'flat', line: 0 }] });
    out.push({ p: box(128, 80, 226, 96), c: DUN.trim, m: 'cloth', line: 1 });
    out.push(eye(160, 140, 12), eye(196, 180, 12, '#40c060'), eye(160, 222, 11, '#e0a030'));
    // верхний глаз со стебельками
    for (const [dx, h] of [[-30, 40], [-12, 54], [14, 56], [32, 42]]) out.push({ p: tube([[177 + dx * 0.5, 40, 4], [177 + dx, 40 - h * 0.6, 3], [177 + dx * 1.2, 40 - h, 2]]), c: '#8a5a7a', m: 'skin', line: 0.6 }, { e: [177 + dx * 1.2, 40 - h - 4, 5, 5], c: '#f0e8d8', m: 'gem', line: 0.6, sub: [{ e: [177 + dx * 1.2, 40 - h - 4, 2, 2], c: '#1a0810', m: 'flat', line: 0 }] });
    out.push({ e: [177, 50, 44, 40], c: '#9a5a7a', m: 'skin', gloss: 0.6, line: 1.2 }, eye(177, 54, 22));
    out.push(druse(60, g, 56, DUN.cry, DUN.cry2), druse(300, g, 48, DUN.cry, DUN.cry2));
    return out;
  });
  // 4. Часовня безмолвных голосов: колонный храм со змеиным фронтоном и окаменевшими статуями
  bdef('bld_dwell_4', 'dungeon', g => {
    const out = [], ST = '#7a8078';
    out.push(steps(DUN, 170, g, 2, 10, 140, 156));
    out.push(dw(60, 110, 280, g - 20));
    out.push({ p: [P(40, 112, 1), P(170, 40, 1), P(300, 112, 1)], c: DUN.wall, m: 'cloth', line: 1.2, sub: [{ p: [P(172, 36, 1), P(310, 116, 1), P(240, 116, 1)], c: DUN.wallD, m: 'flat', line: 0 }],
      lines: [{ p: [[96, 100], [120, 88], [140, 98], [170, 70], [200, 98], [220, 88], [244, 100]], w: 4, c: '#3a8a5a', a: 0.9 }] });
    out.push({ p: tube([[30, 114, 8], [170, 34, 7], [310, 114, 8]]), c: DUN.roof, m: 'leather', line: 1 }, { p: box(34, 108, 306, 122), c: DUN.trim, m: 'cloth', line: 1 });
    for (const x of [82, 126, 214, 258]) out.push({ p: box(x - 11, 122, x + 11, g - 20), c: '#7a6a7e', m: 'cloth', line: 1, lines: [{ p: [[x - 3, 126], [x - 3, g - 24]], w: 1.8, a: 0.4 }] });
    out.push(door(DUN, 170, g - 20, 26, 104, { glow: '#6a3a8a', fc: DUN.wallD }));
    // окаменевшие жертвы медузы
    const statue = (x, s) => [{ p: box(x - 14, g - 20, x + 14, g), c: DUN.trim, m: 'cloth', line: 1 },
      { p: [P(x - 10, g - 20, 1), [x - 12, g - 50], [x - 16 * s, g - 70], [x - 22 * s, g - 90], [x - 16 * s, g - 94], [x - 4, g - 76], [x, g - 84], [x + 8, g - 76], [x + 12, g - 50], P(x + 10, g - 20, 1)], c: ST, m: 'cloth', line: 1, belly: 0.3 },
      { e: [x + 1, g - 94, 9, 10], c: ST, m: 'cloth', line: 1 }];
    out.push(statue(26, 1), statue(314, -1));
    return out;
  });
  // 5. Лабиринт: извилистые стены и надвратная башня с бычьим черепом
  bdef('bld_dwell_5', 'dungeon', g => {
    const out = [];
    const seg = (x0, x1, G, h, sd) => dw(x0, G - h, x1, G, { rh: 16, bw: 26, k: sd || 0.08 });
    out.push(seg(20, 150, g - 120, 60), seg(250, 380, g - 120, 60), seg(40, 120, g - 60, 70, 0.3), seg(280, 360, g - 60, 70, 0.3));
    // башня-врата
    out.push(tower(DUN, 200, g - 40, 60, 250, { top: 'crenel', win: [g - 220], winW: 10, winH: 30 }));
    out.push({ p: box(144, g - 300, 256, g - 290), c: DUN.trim, m: 'cloth', line: 1 });
    // бычий череп с рогами
    out.push({ p: tube([[176, g - 316, 12], [130, g - 330, 9], [110, g - 376, 4], [120, g - 400, 1]]), c: '#e0d4bc', m: 'horn', gloss: 0.5, line: 1 }, { p: tube([[224, g - 316, 12], [270, g - 330, 9], [290, g - 376, 4], [280, g - 400, 1]]), c: '#e0d4bc', m: 'horn', gloss: 0.5, line: 1 });
    out.push({ p: [[168, g - 330], [200, g - 342], [232, g - 330], [226, g - 300], P(212, g - 270, 1), P(188, g - 270, 1), [174, g - 300]], c: '#e8dcc6', m: 'horn', gloss: 0.3, line: 1,
      lines: [{ p: [[184, g - 318], [188, g - 312]], w: 7, c: '#1a1210', a: 1 }, { p: [[216, g - 318], [212, g - 312]], w: 7, c: '#1a1210', a: 1 }, { p: [[194, g - 282], [206, g - 282]], w: 3, c: '#3a3028', a: 0.8 }] });
    out.push({ p: arch(200, g - 40, 36, 110, false), c: '#0e0a12', m: 'cloth', ao: 1.3, line: 1.1 });
    lit(200, g - 90);
    out.push(steps(DUN, 200, g, 3, 12, 70, 96));
    out.push(seg(0, 110, g, 50, 0.3), seg(290, 400, g, 50, 0.3));
    out.push(mushroom(160, g - 40, 24, 12, DUN.cap), crystal(380, g - 120, 8, 30, DUN.cry2, 0.2));
    return out;
  });
  // 6. Логово мантикор: скала с широкой пастью-пещерой, шипы-жала, кости у входа
  bdef('bld_dwell_6', 'dungeon', g => {
    const out = [];
    out.push(dCrag(10, 430, g, 90, 161, { n: 9, pow: 0.6 }));
    for (const [x, y, s, h] of [[110, 130, -1, 70], [170, 100, -1, 60], [270, 96, 1, 60], [330, 124, 1, 76]]) out.push({ p: tube([[x, y + 20, 12], [x + s * h * 0.3, y - h * 0.5, 7], [x + s * h * 0.1, y - h, 1]]), c: '#6a3a3a', m: 'horn', gloss: 0.6, line: 0.9 });
    out.push(cave(220, g, 110, 230, { nf: 7, c: '#0c0608' }));
    lit(220, g - 110);
    for (const [x, y] of [[200, g - 120], [236, g - 120]]) out.push({ e: [x, y, 7, 4], c: '#ff4a2a', m: 'gem', gloss: 1.2, line: 0 });
    out.push(halo(218, g - 120, 40, 20, 'rgba(255,80,40,0.2)'));
    for (const [x, y] of [[60, 220], [380, 240]]) out.push(range(3, i => ({ p: [[x + i * 10, y], [x + i * 10 + 18, y + 40]], w: 3, c: '#241c2a', a: 0.8 })));
    out.push(bone([[120, g - 6, 4], [170, g - 16, 4]]), skull(330, g - 12, 13), bone([[290, g - 4, 4], [320, g - 20, 4]]));
    out.push(druse(40, g, 50, DUN.cry, DUN.cry2));
    return out;
  });
  // 7. Драконья пещера: гора с исполинским зевом, горящие глаза дракона, сокровища
  bdef('bld_dwell_7', 'dungeon', g => {
    const out = [];
    out.push(dCrag(0, 540, g, 30, 171, { n: 12, pow: 0.55 }));
    out.push(dCrag(330, 540, g, 160, 172, { n: 6, c: DUN.rockD, half: 'r' }));
    out.push(cave(250, g, 150, 300, { nf: 8, c: '#0a0608', glow: '#2a0a10' }));
    lit(250, g - 190);
    out.push(halo(250, g - 190, 90, 36, 'rgba(255,90,30,0.18)'));
    for (const x of [214, 286]) out.push({ p: [P(x - 16, g - 190, 1), [x, g - 200], P(x + 16, g - 190, 1), [x, g - 182]], c: '#ffa020', m: 'gem', gloss: 1.3, line: 0.6, lc: '#5a1a08', sub: [{ p: box(x - 2, g - 198, x + 2, g - 182), c: '#1a0808', m: 'flat', line: 0 }] });
    // дым из ноздрей
    out.push({ e: [220, g - 140, 20, 12], c: 'rgba(160,140,160,0.35)', m: 'flat', line: 0 }, { e: [282, g - 136, 18, 10], c: 'rgba(160,140,160,0.3)', m: 'flat', line: 0 });
    // сокровища у входа
    lit(250, g - 20);
    out.push({ p: [P(170, g, 1), [200, g - 30], [250, g - 44], [300, g - 30], P(330, g, 1)], c: '#e0b040', m: 'gold', gloss: 1.2, line: 1, glint: [[220, g - 30, 4], [262, g - 36, 5], [290, g - 18, 3]] });
    out.push({ p: box(282, g - 34, 320, g - 4), c: '#6a3a1a', m: 'wood', flow: 0, line: 1, lines: [{ p: [[282, g - 20], [320, g - 20]], w: 3, c: '#d8a53a', a: 0.9 }] });
    out.push(druse(60, g, 80, DUN.cry, DUN.cry2), druse(470, g, 70, DUN.cry, DUN.cry2), crystal(130, 150, 12, 50, DUN.cry2, -0.3), crystal(400, 190, 10, 40, DUN.cry, 0.3));
    out.push(skull(360, g - 10, 14, { horns: true, hornC: '#b8ac94' }));
    return out;
  });

  /* ---------- укрепления: неровная скальная стена, врата-пещера, кристальные огни ---------- */
  function fortDun(lvl) {
    return (g) => {
      const out = [], wallTop = g - 180, r = rngOf(300 + lvl);
      const top = [P(10, g, 1)]; for (let x = 10; x <= 970; x += 40) top.push(P(x, wallTop - 6 - r() * 24, 1), [x + 20, wallTop + 4 - r() * 10]);
      top.push(P(970, g, 1));
      out.push({ p: top, c: DUN.rock, m: 'horn', gloss: 0.12, line: 1.1, belly: 0.3, lines: masonry(10, wallTop, 970, g, 30, 60, 0.3, 2.2) });
      out.push({ p: box(10, g - 30, 970, g), c: DUN.trim, m: 'cloth', line: 1 });
      for (const x of [220, 760]) out.push(druse(x, g - 30, 44, DUN.cry, DUN.cry2));
      if (lvl >= 2) for (const x of [110, 870]) out.push(tower(DUN, x, g, 60, 330, { roofH: 100, win: [g - 250, g - 160], winW: 10, winH: 32 }));
      if (lvl >= 3) out.push(tower(DUN, 490, g - 150, 88, 320, { roofH: 150, eave: 12, win: [g - 390, g - 290], winW: 12, winH: 36 }));
      const gt = wallTop - 60;
      out.push({ p: [P(396, g, 1), P(400, gt + 20, 1), P(430, gt - 10, 1), P(470, gt, 1), P(500, gt - 22, 1), P(540, gt - 4, 1), P(580, gt + 16, 1), P(584, g, 1)], c: DUN.rockD, m: 'horn', gloss: 0.15, line: 1.2, belly: 0.3, lines: masonry(396, gt, 584, g, 28, 44, 0.3, 2.2) });
      lit(490, g - 60);
      const grate = []; for (let x = 460; x <= 520; x += 15) grate.push({ p: [[x, g - 160], [x, g]], w: 3.4, c: '#5a4a60', a: 0.95 }); for (let y = g - 110; y < g; y += 18) grate.push({ p: [[430, y], [550, y]], w: 3, c: '#5a4a60', a: 0.95 });
      out.push({ p: [P(430, g, 1), [432, g - 90], [460, g - 150], [490, g - 162], [520, g - 150], [548, g - 90], P(550, g, 1)], c: '#1a0e24', m: 'cloth', ao: 1.3, line: 1.1, lines: grate, sub: [{ e: [490, g - 30, 40, 50], c: '#4a2a70', m: 'flat', line: 0 }] });
      out.push(fangs(440, 540, g - 150, 30, 5));
      for (const x of [412, 568]) { lit(x, gt + 50); out.push(crystal(x, gt + 70, 8, 34, DUN.cry2, 0)); }
      out.push(crystal(490, gt - 10, 12, 44, DUN.cry, 0));
      return out;
    };
  }
  bdef('bld_fort', 'dungeon', fortDun(1)); bdef('bld_citadel', 'dungeon', fortDun(2)); bdef('bld_castle', 'dungeon', fortDun(3));
})(typeof window !== 'undefined' ? window : globalThis);
