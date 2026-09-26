/* ============================================================================
   view/vec_dw_b.js — жилища существ на карте: Подземелье, Цитадель, Крепость, Сопряжение.

   Имена: 'dwelling_<уровень>@<id базового существа>' (улучшенные живут у базового) —
   карта (adventure.js, dwellSprite) берёт такой рисунок вместо общего 'dwelling_<уровень>'.
   Рамка и якорь — от общего жилища (K.frameOf('dwelling_N'), 320×313, якорь 160,310),
   земля — y = 308. Слева у входа карта рисует само существо (центр около x = 60),
   справа вверху — флажок владельца: поэтому главная масса жилища сдвинута к центру-правее,
   а слева оставлено место (только низкие мелочи).

   Служебные точки в meta: flag — основание древка флажка владельца (на макушке справа),
   lights — окна, норы и огни, которые ночью зажигаются (помощники сами записывают их в lit()).

   На карте жилище — около 32 точек в ширину: крупный силуэт и цвет фракции важнее мелочей,
   штрихи и контуры толще, чем у построек экрана города. Идеи — из vec_tb_b.js / vec_tb_c.js.

   Подземелье — лиловый камень, пещеры, кристаллы, грибы.
   Цитадель   — охра, брёвна, шкуры, глина, кость, красные полосы.
   Крепость   — болото: зелень, мох, солома, сваи, тёмная вода.
   Сопряжение — белый мрамор, золото, стихийные кристаллы и сияние.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf } = K;
  const PI = Math.PI;

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
  const range = (n, f) => Array.from({ length: n }, (_, i) => f(i));
  /** Штрих: w — толщина, a — сила; o — { light, c }. */
  const ln = (p, w, a, o) => Object.assign({ p, w: w || 2.4, a: a || 0.5 }, o);
  /** Кладка: ряды высотой rh, камни шириной bw вразбежку (обрежутся по форме). */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 2.4;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push({ p: [[x0, y], [x1, y]], w, a });
    let row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  /** Тёмная правая сторона (плоская подложка внутри формы). */
  const shadeR = (x0, y0, x1, y1, c) => ({ p: box(x0, y0, x1, y1), c, m: 'flat', line: 0 });

  /* ---------- огни: помощники сами записывают их в meta.lights ---------- */
  let LIT = null;
  const lit = (x, y) => { if (LIT) LIT.push([Math.round(x), Math.round(y)]); };
  const G = 308;   // земля в рамке жилища

  /**
   * Жилище: 'dwelling_<lvl>@<cid>'. build(g) → формы (можно вложенными массивами),
   * flag — основание древка флажка владельца.
   */
  function dwell(lvl, cid, flag, build) {
    const base = 'dwelling_' + lvl, fr = frameOf(base) || { w: 320, h: 313, anchor: [160, 310] };
    const g = fr.anchor[1] - 2;
    LIT = [];
    let shapes, lights;
    try { shapes = build(g).flat(Infinity).filter(Boolean); } finally { lights = LIT.slice(0, 6); LIT = null; }
    V.def(base + '@' + cid, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { flag, lights } });
  }

  /* ---------- природа ---------- */
  /** Скала по контуру: материал рога (матовый камень), трещины lines. */
  const rock = (pts, c, o) => Object.assign({ p: pts, c, m: 'horn', gloss: 0.14, line: 1.3, belly: 0.32 }, o);
  /** Валун. */
  const boulder = (x, g, w, h, c) => rock([P(x - w, g, 1), [x - w * 0.9, g - h * 0.6], [x - w * 0.3, g - h], [x + w * 0.5, g - h * 0.85], [x + w, g - h * 0.3], P(x + w, g, 1)], c, { line: 1 });
  /** Мягкий ореол света (плоско, с прозрачностью). */
  const halo = (cx, cy, rx, ry, c) => ({ e: [cx, cy, rx, ry], c, m: 'flat', line: 0 });
  /** Кристалл-призма: основание (x, y), полуширина w, высота h, наклон lean. */
  function crystal(x, y, w, h, c, lean) {
    const l = (lean || 0) * h;
    return { p: [P(x - w, y, 1), P(x - w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y, 1)], c, m: 'gem', gloss: 1.1, rim: 0.7, line: 1,
      sub: [{ p: [P(x + l * 0.5, y + 2, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y + 2, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.3, y - 4], [x - w * 0.3 + l * 0.8, y - h * 0.8]], w: 3, light: true, a: 0.7 }] };
  }
  /** Друза: три кристалла веером. */
  const druse = (x, y, s, c, c2) => [crystal(x - s * 0.5, y, s * 0.2, s * 0.7, c2 || c, -0.35), crystal(x + s * 0.5, y, s * 0.2, s * 0.6, c2 || c, 0.35), crystal(x, y, s * 0.26, s, c, 0.04)];
  /** Гриб: ножка от земли (x, g) высотой h, шляпка радиуса r. */
  function mushroom(x, g, h, r, cap, o) {
    o = o || {}; const L = o.lean || 0, cy = g - h;
    return [{ p: tube([[x, g, r * 0.34], [x + L * 0.6, g - h * 0.5, r * 0.26], [x + L, cy, r * 0.24]]), c: o.stem || '#d8ccbc', m: 'skin', line: 1 },
      { p: [P(x + L - r, cy + r * 0.12, 1), [x + L - r * 0.86, cy - r * 0.34], [x + L - r * 0.4, cy - r * 0.62], [x + L, cy - r * 0.66], [x + L + r * 0.4, cy - r * 0.62], [x + L + r * 0.86, cy - r * 0.34], P(x + L + r, cy + r * 0.12, 1), [x + L, cy + r * 0.04]], c: cap, m: 'skin', gloss: 0.6, line: 1.1,
        sub: [{ e: [x + L - r * 0.4, cy - r * 0.3, r * 0.16, r * 0.1], c: tone(cap, 0.55), m: 'flat', line: 0 }, { e: [x + L + r * 0.3, cy - r * 0.42, r * 0.12, r * 0.08], c: tone(cap, 0.55), m: 'flat', line: 0 },
          { p: [P(x + L - r, cy + r * 0.12, 1), P(x + L + r, cy + r * 0.12, 1), [x + L, cy + r * 0.26]], c: tone(cap, -0.4), m: 'flat', line: 0 }] }];
  }
  /** Клыки-сталактиты вниз от линии y (x0…x1). */
  function fangs(x0, x1, y, len, n, c) {
    const out = [], st = (x1 - x0) / n;
    for (let i = 0; i < n; i++) { const x = x0 + st * (i + 0.5), l = len * (0.6 + ((i * 37) % 5) / 10); out.push({ p: [P(x - st * 0.42, y - 4, 1), P(x + st * 0.42, y - 4, 1), [x + st * 0.12, y + l * 0.6], P(x, y + l, 1), [x - st * 0.14, y + l * 0.55]], c: c || '#7a7084', m: 'horn', gloss: 0.3, line: 0.9 }); }
    return out;
  }
  /** Пещерный зев: тёмный провал неправильной арки; o.fangs / o.nf — клыки, o.glow — отсвет из глубины. */
  function cave(cx, g, w, h, o) {
    o = o || {};
    const out = [{ p: [P(cx - w, g, 1), [cx - w * 0.96, g - h * 0.5], [cx - w * 0.6, g - h * 0.92], [cx, g - h], [cx + w * 0.62, g - h * 0.9], [cx + w * 0.98, g - h * 0.46], P(cx + w, g, 1)], c: o.c || '#0e0a12', m: 'cloth', ao: 1.5, line: 1.3,
      sub: o.glow ? [{ e: [cx, g - h * 0.12, w * 0.75, h * 0.5], c: o.glow, m: 'flat', line: 0 }] : [] }];
    if (o.fangs !== false) out.push(fangs(cx - w * 0.72, cx + w * 0.72, g - h * 0.9, h * 0.24, o.nf || 4, o.fc));
    return out;
  }
  /** Череп: центр (cx, cy), радиус r; o.horns — рога, o.glow — светящиеся глазницы. */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || '#e8e0c8', out = [], eye = o.glow || '#1a1210';
    if (o.horns) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * r * 0.7, cy - r * 0.4, r * 0.45], [cx + s * r * 1.5, cy - r * 0.9, r * 0.32], [cx + s * r * 1.9, cy - r * 1.8, r * 0.1]]), c: o.hornC || '#6a5a50', m: 'horn', line: 0.9 });
    if (o.glow) lit(cx, cy);
    out.push({ p: [[cx - r, cy - r * 0.1], [cx - r * 0.8, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.8, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.6, cy + r * 0.45], P(cx + r * 0.45, cy + r * 0.95, 1), P(cx - r * 0.45, cy + r * 0.95, 1), [cx - r * 0.6, cy + r * 0.45]], c, m: 'horn', gloss: 0.3, line: 1,
      lines: [{ p: [[cx - r * 0.38, cy - r * 0.05], [cx - r * 0.32, cy + r * 0.05]], w: r * 0.46, c: eye, a: 1 }, { p: [[cx + r * 0.38, cy - r * 0.05], [cx + r * 0.32, cy + r * 0.05]], w: r * 0.46, c: eye, a: 1 },
        { p: [[cx, cy + r * 0.25], [cx, cy + r * 0.4]], w: r * 0.18, c: '#1a1210', a: 0.9 }] });
    return out;
  }
  /** Кость: трубка по точкам [[x, y, w], …]. */
  const bone = (pts, c) => ({ p: tube(pts), c: c || '#e4dcc4', m: 'horn', gloss: 0.4, line: 0.9 });
  /** Язык пламени: основание (x, y), полуширина w, высота h. */
  function flame(x, y, w, h, o) {
    o = o || {}; const L = o.lean || 0;
    return { p: [P(x - w, y, 1), [x - w * 0.95 + L * 0.2, y - h * 0.35], [x - w * 0.35 + L * 0.5, y - h * 0.62], P(x - w * 0.1 + L, y - h, 1), [x + w * 0.3 + L * 0.6, y - h * 0.6], P(x + w * 0.5 + L * 0.5, y - h * 0.78, 1), [x + w * 0.9 + L * 0.2, y - h * 0.35], P(x + w, y, 1), [x, y + w * 0.25]], c: o.c || '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.8, lc: o.lc || '#8a2a0a', op: o.op,
      sub: [{ p: [P(x - w * 0.55, y + 2, 1), [x - w * 0.45 + L * 0.2, y - h * 0.3], P(x - w * 0.05 + L * 0.55, y - h * 0.6, 1), [x + w * 0.38 + L * 0.2, y - h * 0.3], P(x + w * 0.55, y + 2, 1)], c: o.core || '#ffe08a', m: 'flat', line: 0 }] };
  }
  /** Гнездо из прутьев: центр (x, y), полуширина w; eggs — цвета яиц. */
  function nest(x, y, w, c, eggs) {
    const out = [];
    for (let i = 0; i < 5; i++) out.push({ p: tube([[x - w * 0.6 + i * w * 0.3, y, 3.4], [x - w * 1.12 + i * w * 0.56, y - w * 0.46 - (i % 2) * 8, 1.4]]), c: tone(c, -0.2), m: 'wood', line: 0.6 });
    (eggs || []).forEach((ec, i) => out.push({ e: [x + (i - (eggs.length - 1) / 2) * w * 0.44, y - w * 0.2, w * 0.2, w * 0.25], c: ec, m: 'skin', gloss: 0.7, line: 0.9 }));
    out.push({ p: [P(x - w, y - w * 0.16, 1), [x - w * 0.86, y + w * 0.34], [x, y + w * 0.5], [x + w * 0.86, y + w * 0.34], P(x + w, y - w * 0.16, 1), [x, y + w * 0.06]], c, m: 'wood', line: 1.2,
      lines: range(5, i => ln([[x - w + i * w * 0.44, y - w * 0.1], [x - w * 0.5 + i * w * 0.34, y + w * 0.42]], 3, 0.6)).concat([ln([[x - w, y + w * 0.06], [x, y + w * 0.3], [x + w, y + w * 0.06]], 3, 0.55)]) });
    return out;
  }
  /** Вода/пруд: эллипс с бликами. */
  function pond(cx, cy, rx, ry, c, o) {
    o = o || {};
    const lines = range(4, i => { const x = cx - rx * 0.6 + i * rx * 0.36, y = cy - ry * 0.2 + ((i * 37) % 5) * ry * 0.1; return ln([[x, y], [x + rx * 0.18, y - 1]], 3, 0.7, { light: true }); });
    return { p: ell(cx, cy, rx, ry, 16), c, m: 'gem', gloss: 0.5, rim: 0, line: 1.1, lc: o.lc || tone(c, -0.6), lines, sub: [{ e: [cx - rx * 0.1, cy + ry * 0.2, rx * 0.75, ry * 0.5], c: tone(c, -0.25), m: 'flat', line: 0 }] };
  }
  /** Камыш: пучок стеблей с початком. */
  const reeds = (x, g, n) => { const out = []; for (let k = 0; k < (n || 3); k++) { const dx = (k - ((n || 3) - 1) / 2) * 8; out.push({ p: tube([[x + dx, g + 2, 5], [x + dx * 1.6, g - 50 - (k % 2) * 16, 2.4]]), c: '#6a9a3a', m: 'leather', line: 0.6 }); } out.push({ p: ell(x + 2, g - 56, 5, 12, 8), c: '#7a4a24', m: 'fur', line: 0.7 }); return out; };
  /** Мох-подушка. */
  const moss = (x, y, rx, ry, c) => ({ p: ell(x, y, rx, ry, 9, 0.1), c: c || '#5e8a2e', m: 'feather', texSize: 0.5, line: 0.7 });
  /** Факел на шесте: низ (x, g), высота h. */
  const torch = (x, g, h) => { lit(x, g - h - 10); return [{ p: tube([[x, g, 6], [x, g - h, 5]]), c: '#5a3a1c', m: 'wood', line: 0.8 }, flame(x, g - h + 2, 9, 30)]; };

  /* ============================== ПОДЗЕМЕЛЬЕ ============================== */
  const DUN = { rock: '#5a5066', rockD: '#40384c', rockL: '#7a6e88', wall: '#6a5a70', wallD: '#3c2e44', trim: '#4c3c54', roof: '#8a4ac0', roofD: '#4e2a72',
    cry: '#b070f0', cry2: '#d8a8ff', cap: '#b0405a', cap2: '#6a4ac0', eye: '#ffe070' };
  /** Глаза во тьме: пара светящихся точек. */
  const eyes = (x, y, d, c, r) => { lit(x, y); return [{ e: [x - d, y, r || 4.5, (r || 4.5) * 0.7], c: c || DUN.eye, m: 'gem', gloss: 1.2, line: 0 }, { e: [x + d, y, r || 4.5, (r || 4.5) * 0.7], c: c || DUN.eye, m: 'gem', gloss: 1.2, line: 0 }]; };

  // 1. Логово троглодитов: каменный холм с норами, глаза во тьме, грибы
  dwell(1, 'troglodyte', [254, 140], g => [
    rock([P(74, g, 1), [84, 236], [116, 176], [166, 142], [222, 134], [266, 160], [294, 216], P(308, g, 1)], DUN.rock,
      { lines: [ln([[150, 160], [140, 210]], 3, 0.4), ln([[258, 178], [272, 230]], 3, 0.4), ln([[118, 200], [180, 186]], 2.6, 0.3, { light: true })], sub: [shadeR(262, 120, 320, g + 4, DUN.rockD)] }),
    rock([P(150, 150, 1), [176, 124], [214, 118], [246, 132], P(262, 152, 1), [206, 148]], DUN.rockL, { line: 1.1 }),
    cave(196, g, 40, 96, { nf: 3 }), eyes(196, g - 46, 9),
    cave(128, 222, 18, 36, { nf: 2 }), eyes(128, 206, 6, DUN.eye, 3.4),
    cave(266, g, 20, 44, { fangs: false }),
    mushroom(96, g, 46, 24, DUN.cap), mushroom(290, g, 34, 20, DUN.cap2, { lean: 4 }),
    crystal(232, 138, 10, 40, DUN.cry2, 0.12),
  ]);
  // 2. Гнездо гарпий: скальные иглы, гнёзда из прутьев на макушках, перья
  dwell(2, 'harpy', [270, 102], g => [
    rock([P(206, g, 1), [214, 226], [232, 152], P(258, 112, 1), [280, 160], [296, 236], P(304, g, 1)], DUN.rockD, { lines: [ln([[256, 150], [262, 250]], 3, 0.35)] }),
    rock([P(108, g, 1), [118, 216], [140, 128], P(170, 70, 1), [198, 128], [216, 218], P(226, g, 1)], DUN.rock,
      { lines: [ln([[166, 96], [156, 180], [172, 270]], 3, 0.4), ln([[196, 170], [206, 240]], 3, 0.35), ln([[134, 170], [150, 150]], 2.6, 0.35, { light: true })], sub: [shadeR(192, 60, 240, g + 4, DUN.rockD)] }),
    nest(168, 76, 48, '#7a5634', ['#e8e0d0', '#d8c8e8']), nest(258, 116, 34, '#6a4a2c', ['#e0d8c8']),
    ...[[104, 186, -0.6], [216, 60, 0.5], [292, 196, 0.9], [120, 110, 2.4]].map(([x, y, a]) => ({ p: K.leaf([x, y], a, 30, 11).body, c: '#8a4a6a', m: 'feather', line: 0.8 })),
    bone([[236, g - 6, 5], [268, g - 14, 5]]), skull(288, g - 10, 10),
  ]);
  // 3. Столп глаз: каменный столп с очами на гранях, наверху — исполинский глаз на стебельках
  dwell(3, 'beholder', [226, 114], g => {
    const out = [];
    const eye = (x, y, r, c) => { lit(x, y); return { e: [x, y, r, r * 0.72], c: '#f0e8d8', m: 'gem', gloss: 0.8, line: 1.1, lc: '#2a1020', sub: [{ e: [x, y, r * 0.52, r * 0.52], c: c || '#e03a2a', m: 'flat', line: 0 }, { e: [x, y, r * 0.18, r * 0.4], c: '#140810', m: 'flat', line: 0 }] }; };
    out.push({ p: box(112, g - 18, 254, g), c: DUN.trim, m: 'cloth', line: 1.1 }, { p: box(128, g - 34, 238, g - 16), c: DUN.wall, m: 'cloth', line: 1.1 });
    out.push({ p: trap(183, 122, g - 34, 34, 42), c: DUN.wall, m: 'cloth', line: 1.3, lines: masonry(140, 122, 226, g - 34, 26, 36, 0.4), sub: [shadeR(200, 110, 240, g, DUN.wallD)] });
    out.push({ p: box(138, 112, 228, 128), c: DUN.trim, m: 'cloth', line: 1.1 });
    out.push(eye(166, 168, 11), eye(200, 208, 11, '#40c060'), eye(168, 250, 10, '#e0a030'));
    for (const [dx, h] of [[-40, 44], [-18, 60], [16, 62], [40, 46]]) out.push({ p: tube([[183 + dx * 0.4, 60, 6], [183 + dx * 0.9, 60 - h * 0.6, 4.5], [183 + dx * 1.15, 60 - h, 3]]), c: '#8a5a7a', m: 'skin', line: 0.8 }, { e: [183 + dx * 1.15, 56 - h, 7, 7], c: '#f0e8d8', m: 'gem', line: 0.8, sub: [{ e: [183 + dx * 1.15, 56 - h, 3, 3], c: '#1a0810', m: 'flat', line: 0 }] });
    out.push({ e: [183, 72, 50, 44], c: '#9a5a8a', m: 'skin', gloss: 0.6, line: 1.4 }, eye(183, 76, 26));
    out.push({ p: [P(146, 104, 1), [164, 96], [183, 100], [202, 96], P(220, 104, 1), [183, 116]], c: '#5a2a4a', m: 'skin', line: 1 });
    out.push(druse(88, g, 50, DUN.cry, DUN.cry2), druse(282, g, 44, DUN.cry, DUN.cry2));
    return out;
  });
  // 4. Часовня безмолвных голосов: колонный храм, змеиный фронтон, окаменевшая статуя
  dwell(4, 'medusa', [262, 118], g => {
    const out = [], ST = '#8c9088', COL = '#8a7a90';
    out.push({ p: box(80, g - 16, 298, g), c: DUN.trim, m: 'cloth', line: 1.1 }, { p: box(92, g - 30, 286, g - 14), c: DUN.wall, m: 'cloth', line: 1.1 });
    out.push({ p: box(102, 150, 274, g - 30), c: DUN.wallD, m: 'cloth', line: 1.1, ao: 1.2 });
    out.push({ p: arch(188, g - 30, 26, 96, true), c: '#10141a', m: 'cloth', ao: 1.3, line: 1.1, sub: [{ e: [188, g - 44, 20, 34], c: '#2a6a4a', m: 'flat', line: 0 }] });
    lit(188, g - 70);
    for (const x of [112, 150, 226, 264]) out.push({ p: box(x - 11, 150, x + 11, g - 30), c: COL, m: 'cloth', line: 1.1, lines: [ln([[x - 3, 154], [x - 3, g - 34]], 2.2, 0.4)], sub: [shadeR(x + 4, 146, x + 13, g, tone(COL, -0.3))] });
    out.push({ p: box(92, 136, 284, 152), c: DUN.trim, m: 'cloth', line: 1.1 });
    out.push({ p: [P(84, 140, 1), P(188, 72, 1), P(292, 140, 1)], c: DUN.wall, m: 'cloth', line: 1.3, sub: [{ p: [P(190, 68, 1), P(300, 144, 1), P(250, 144, 1)], c: DUN.wallD, m: 'flat', line: 0 }],
      lines: [ln([[132, 128], [150, 114], [168, 126], [188, 104], [208, 126], [226, 114], [244, 128]], 5, 0.95, { c: '#3aa05a' })] });
    out.push({ p: tube([[76, 144, 9], [188, 66, 8], [300, 144, 9]]), c: DUN.roof, m: 'leather', line: 1.1 });
    // змея на коньке
    out.push({ p: tube([[176, 68, 8], [170, 50, 7], [184, 38, 6], [198, 44, 5], [196, 30, 4]]), c: '#4aa060', m: 'skin', line: 1 }, { e: [198, 26, 8, 6], c: '#4aa060', m: 'skin', line: 1, glint: [[201, 24, 1.8]] });
    // окаменевшая жертва у ступеней
    out.push({ p: box(274, g - 14, 306, g), c: DUN.trim, m: 'cloth', line: 1 },
      { p: [P(280, g - 14, 1), [278, g - 44], [270, g - 64], [262, g - 82], [270, g - 86], [284, g - 66], [292, g - 76], [300, g - 66], [302, g - 44], P(300, g - 14, 1)], c: ST, m: 'cloth', line: 1.1, belly: 0.3 },
      { e: [292, g - 84, 9, 10], c: ST, m: 'cloth', line: 1.1 });
    return out;
  });
  // 5. Лабиринт: низкие стены с ходами (вид сверху), надвратная башня с бычьим черепом
  dwell(5, 'minotaur', [216, 102], g => {
    const out = [];
    // верх лабиринта: плита с тёмными ходами
    const maze = [[[98, 212], [150, 212], [150, 200]], [[116, 222], [116, 204]], [[228, 204], [228, 216], [276, 216]], [[250, 204], [262, 204]], [[92, 224], [134, 224]], [[244, 224], [286, 224]]];
    out.push({ p: [P(92, 196, 1), P(284, 196, 1), P(302, 232, 1), P(72, 232, 1)], c: '#8a7a92', m: 'cloth', line: 1.2, lines: maze.map(p => ln(p, 5, 0.9, { c: '#2a2030' })) });
    out.push({ p: box(72, 230, 302, g), c: DUN.wall, m: 'cloth', line: 1.3, lines: masonry(72, 230, 302, g, 20, 30, 0.42), sub: [shadeR(262, 226, 306, g + 4, DUN.wallD)] });
    // башня-врата
    out.push({ p: box(144, 126, 226, g), c: DUN.wall, m: 'cloth', line: 1.3, lines: masonry(144, 126, 226, g, 24, 30, 0.42), sub: [shadeR(208, 116, 230, g + 4, DUN.wallD)] });
    out.push({ p: [P(136, 132, 1), P(136, 106, 1), P(152, 106, 1), P(152, 116, 1), P(168, 116, 1), P(168, 106, 1), P(202, 106, 1), P(202, 116, 1), P(218, 116, 1), P(218, 106, 1), P(234, 106, 1), P(234, 132, 1)], c: DUN.trim, m: 'cloth', line: 1.2 });
    out.push({ p: arch(185, g, 24, 88), c: '#0e0a12', m: 'cloth', ao: 1.3, line: 1.2 }, eyes(185, g - 52, 7, '#ff5a2a', 3.6));
    // бычий череп с рогами над воротами
    out.push({ p: tube([[172, 172, 13], [138, 160, 10], [120, 128, 5], [128, 106, 1.5]]), c: '#e8dcc0', m: 'horn', gloss: 0.5, line: 1.1 }, { p: tube([[198, 172, 13], [232, 160, 10], [250, 128, 5], [242, 106, 1.5]]), c: '#e8dcc0', m: 'horn', gloss: 0.5, line: 1.1 });
    out.push({ p: [[160, 160], [185, 150], [210, 160], [206, 186], P(194, 208, 1), P(176, 208, 1), [164, 186]], c: '#ece2cc', m: 'horn', gloss: 0.3, line: 1.2,
      lines: [ln([[172, 170], [176, 176]], 8, 1, { c: '#1a1210' }), ln([[198, 170], [194, 176]], 8, 1, { c: '#1a1210' }), ln([[181, 198], [189, 198]], 4, 0.8, { c: '#3a3028' })] });
    return out;
  });
  // 6. Логово мантикор: скала с широкой пастью-пещерой, шипы-жала, красные глаза, кости
  dwell(6, 'manticore', [262, 150], g => [
    ...[[128, 158, -1, 58], [168, 130, -1, 52], [236, 128, 1, 56], [278, 168, 1, 62]].map(([x, y, s, h]) => ({ p: tube([[x, y + 22, 16], [x + s * h * 0.34, y - h * 0.5, 9], [x + s * h * 0.12, y - h, 1.5]]), c: '#7a3a3a', m: 'horn', gloss: 0.6, line: 1 })),
    rock([P(68, g, 1), [78, 226], [112, 162], [168, 128], [230, 126], [280, 162], [302, 230], P(310, g, 1)], DUN.rock,
      { lines: [ln([[110, 200], [124, 250]], 3, 0.4), ln([[282, 190], [270, 260]], 3, 0.4), ln([[150, 150], [214, 140]], 2.6, 0.35, { light: true })], sub: [shadeR(270, 120, 320, g + 4, DUN.rockD)] }),
    cave(188, g, 68, 136, { nf: 5, c: '#0c0608' }),
    halo(188, g - 74, 36, 18, 'rgba(255,80,40,0.28)'), eyes(188, g - 74, 16, '#ff4a2a', 6),
    bone([[90, g - 6, 6], [122, g - 16, 6]]), skull(284, g - 12, 13),
  ]);
  // 7. Драконья пещера: гора с исполинским зевом, огненные глаза, груда золота, кристаллы
  dwell(7, 'red_dragon', [274, 106], g => [
    rock([P(214, g, 1), [232, 150], P(270, 98, 1), [300, 146], [314, 220], P(318, g, 1)], DUN.rockD, { lines: [ln([[270, 120], [282, 200]], 3, 0.35)] }),
    rock([P(56, g, 1), [66, 210], [100, 130], [150, 76], P(186, 48, 1), [228, 78], [266, 140], [294, 214], P(304, g, 1)], DUN.rock,
      { lines: [ln([[184, 60], [170, 110]], 3, 0.4), ln([[96, 180], [110, 240]], 3, 0.4), ln([[250, 160], [262, 230]], 3, 0.4), ln([[130, 110], [180, 84]], 3, 0.35, { light: true })], sub: [shadeR(248, 40, 310, g + 4, DUN.rockD)] }),
    cave(180, g, 82, 164, { nf: 5, c: '#0a0608', glow: '#3a0c10' }),
    halo(180, g - 104, 70, 26, 'rgba(255,90,30,0.28)'),
    ...[150, 210].map(x => { lit(x, g - 104); return { p: [P(x - 18, g - 104, 1), [x, g - 116], P(x + 18, g - 104, 1), [x, g - 94]], c: '#ffa020', m: 'gem', gloss: 1.3, line: 0.8, lc: '#5a1a08', sub: [{ p: box(x - 2.5, g - 114, x + 2.5, g - 95), c: '#1a0808', m: 'flat', line: 0 }] }; }),
    { e: [150, g - 70, 14, 8], c: 'rgba(170,150,170,0.4)', m: 'flat', line: 0 }, { e: [212, g - 66, 12, 7], c: 'rgba(170,150,170,0.35)', m: 'flat', line: 0 },
    (lit(180, g - 16), null),
    { p: [P(116, g, 1), [138, g - 24], [176, g - 36], [216, g - 26], P(246, g, 1)], c: '#e8b440', m: 'gold', gloss: 1.2, line: 1.1, glint: [[150, g - 22, 4], [184, g - 30, 5], [214, g - 14, 3.5]] },
    druse(84, g, 56, DUN.cry, DUN.cry2), druse(288, g, 42, DUN.cry, DUN.cry2), crystal(122, 132, 10, 40, DUN.cry2, -0.3),
    skull(250, g - 10, 12, { horns: true, hornC: '#b8ac94' }),
  ]);

  /* ============================== СТРОЕНИЯ (общее для Цитадели и Крепости) ============================== */
  /** Столб/кол: низ (x, g), верх top, толщина w. */
  const post = (x, g, top, w, c) => ({ p: tube([[x, g, w], [x, top, w * 0.86]], { flat0: true }), c: c || '#5a3a1c', m: 'wood', flow: -PI / 2, line: 1 });
  /** Бревно-перекладина между двумя точками. */
  const beam = (x0, y0, x1, y1, w, c) => ({ p: tube([[x0, y0, w], [x1, y1, w]]), c: c || '#5a3a1c', m: 'wood', line: 1 });
  /** Частокол: заострённые колья с шагом st от x0 до x1, верх top. */
  function palisade(x0, x1, top, g, st, c, o) {
    o = o || {}; const pts = [P(x0, g, 1)], lines = [];
    let i = 0;
    for (let x = x0; x < x1 - st * 0.5; x += st, i++) {
      const t = top + (i % 3 === 1 ? 8 : i % 3 === 2 ? 3 : 0);
      pts.push(P(x + 1, t + st * 0.9, 1), P(x + st / 2, t, 1), P(x + st - 1, t + st * 0.9, 1));
      if (x > x0) lines.push(ln([[x, t + st * 0.9], [x, g]], 2.6, 0.6));
    }
    pts.push(P(x1, g, 1));
    if (o.band) lines.push(ln([[x0, o.band], [x1, o.band]], 6, 0.9, { c: o.bandC || '#4a3420' }));
    return { p: pts, c, m: 'wood', flow: -PI / 2, line: 1.1, lines, belly: 0.3 };
  }
  /** Тёмный проём-арка. */
  const hole = (cx, g, w, h, c) => ({ p: arch(cx, g, w, h), c: c || '#140e0a', m: 'cloth', ao: 1.4, line: 1.2 });
  /** Квадратное окошко с тёплым светом. */
  function sqwin(cx, cy, w, h, frame) {
    lit(cx, cy);
    return [{ p: box(cx - w - 4, cy - h - 4, cx + w + 4, cy + h + 4), c: frame || '#4a3018', m: 'wood', line: 0.8 },
      { p: box(cx - w, cy - h, cx + w, cy + h), c: '#ffc850', m: 'gem', gloss: 0.5, rim: 0, line: 0.6, lines: [ln([[cx, cy - h], [cx, cy + h]], 3, 0.9, { c: '#3a2210' })] }];
  }
  /** Дверь из досок (прямоугольная или арочная). */
  function door(cx, g, w, h, c, o) {
    o = o || {}; const lines = [];
    for (let x = cx - w + w / 2; x < cx + w - 1; x += w / 2) lines.push(ln([[x, g - h + 6], [x, g]], 2, 0.55));
    lines.push(ln([[cx - w, g - h * 0.3], [cx + w, g - h * 0.3]], 3.4, 0.85, { c: '#2a2020' }), ln([[cx - w, g - h * 0.7], [cx + w, g - h * 0.7]], 3.4, 0.85, { c: '#2a2020' }));
    return { p: o.square ? box(cx - w, g - h, cx + w, g) : arch(cx, g, w, h), c: c || '#6a4424', m: 'wood', flow: -PI / 2, line: 1.1, lines };
  }
  /** Лохматая крыша (солома/шкуры): конус с загнутыми краями, перехвачен верёвками. */
  function thatch(cx, y, hw, h, c, o) {
    o = o || {};
    return { p: [P(cx - hw, y + 10, 1), [cx - hw * 0.62, y - h * 0.36], [cx - hw * 0.2, y - h * 0.84], P(cx, y - h, 1), [cx + hw * 0.2, y - h * 0.84], [cx + hw * 0.62, y - h * 0.36], P(cx + hw, y + 10, 1), [cx + hw * 0.5, y + 4], [cx, y + 16], [cx - hw * 0.5, y + 4]], c, m: 'fur', furLen: 1.2, flow: PI / 2, dens: 1.1, line: 1.3, belly: 0.3,
      lines: [ln([[cx - hw * 0.84, y + 4], [cx, y + 12], [cx + hw * 0.84, y + 4]], 6, 0.85, { c: o.rope || '#5a4020' }), ln([[cx - hw * 0.36, y - h * 0.58], [cx, y - h * 0.54], [cx + hw * 0.36, y - h * 0.58]], 5, 0.8, { c: o.rope || '#5a4020' })],
      sub: [{ p: [P(cx + hw * 0.1, y - h - 4, 1), P(cx + hw + 6, y + 4, 1), P(cx + hw + 6, y + 20, 1), P(cx + hw * 0.3, y + 20, 1)], c: tone(c, -0.3), m: 'flat', line: 0, op: 0.6 }] };
  }
  /** Бивень/рог: от основания (x, y) вверх, выгибаясь наружу (s). */
  const tusk = (x, y, s, L, c) => ({ p: tube([[x, y, L * 0.16], [x + s * L * 0.34, y - L * 0.45, L * 0.12], [x + s * L * 0.14, y - L * 0.86, L * 0.07], [x - s * L * 0.14, y - L, L * 0.02]]), c: c || '#ece2c6', m: 'horn', gloss: 0.6, line: 1.1 });

  /* ============================== ЦИТАДЕЛЬ ============================== */
  const STR = { clay: '#c27a48', log: '#7e5430', logD: '#5a3a1c', hide: '#c8a06a', fur: '#a07a44', bone: '#ece2c6', red: '#b02e24', stone: '#948a78', stoneD: '#6a6254' };

  // 1. Казармы гоблинов: латаный шатёр из шкур и дощатая пристройка, копьё
  dwell(1, 'goblin', [262, 176], g => [
    { p: box(200, 196, 292, g), c: '#8a6a44', m: 'wood', flow: -PI / 2, line: 1.2, lines: range(4, i => ln([[216 + i * 18, 196], [216 + i * 18, g]], 2.4, 0.5)), sub: [shadeR(268, 190, 296, g + 2, '#5a4028')] },
    { p: [P(190, 206, 1), P(300, 176, 1), P(304, 194, 1), P(192, 224, 1)], c: '#6a5a3a', m: 'wood', flow: 0, line: 1.1 },
    sqwin(250, 244, 10, 11, STR.logD),
    beam(134, 150, 162, 108, 7, STR.logD), beam(166, 150, 140, 110, 7, STR.logD),
    { p: [P(76, g, 1), [110, 228], P(152, 134, 1), [196, 228], P(226, g, 1), [152, g + 6]], c: '#a8845a', m: 'leather', line: 1.3,
      sub: [{ p: [P(156, 134, 1), P(240, g + 4, 1), P(176, g + 8, 1)], c: tone('#a8845a', -0.3), m: 'flat', line: 0 }, { p: box(106, 206, 130, 232), c: '#7a8a4a', m: 'flat', line: 0 }, { p: box(170, 234, 194, 258), c: '#9a5a3a', m: 'flat', line: 0 }],
      lines: [0.4, 0.72].map(t => ln([[152 - 74 * t, 134 + 174 * t], [152, 134 + 174 * t + 6], [152 + 74 * t, 134 + 174 * t]], 7, 0.9, { c: '#5a7a2a' })) },
    { p: [P(134, g, 1), P(152, 226, 1), P(170, g, 1)], c: '#2a1a10', m: 'cloth', line: 1 },
    post(300, g, 128, 6, STR.log), { p: [P(293, 132, 1), P(300, 104, 1), P(307, 132, 1)], c: '#b7c0ca', m: 'steel', line: 0.9 },
    (lit(152, 290), null),
  ]);
  // 2. Волчье логово: каменный холм с норой, волчий череп над входом, частокол
  dwell(2, 'wolf_rider', [252, 150], g => [
    rock([P(80, g, 1), [90, 226], [126, 166], [186, 138], [246, 150], [286, 200], P(308, g, 1)], STR.stone,
      { lines: [ln([[120, 200], [134, 250]], 3, 0.4), ln([[268, 190], [262, 250]], 3, 0.4)], sub: [shadeR(262, 130, 320, g + 4, STR.stoneD)] }),
    moss(150, 152, 34, 12, '#5a6a2a'), moss(220, 144, 26, 10, '#6a7a32'),
    hole(190, g, 42, 94, '#120c08'), eyes(190, g - 42, 10, '#ffd040', 4),
    // волчий череп: вытянутая морда вниз, уши-клинья
    { p: [P(176, 174, 1), P(164, 146, 1), P(184, 160, 1)], c: '#d8ccb0', m: 'horn', line: 1 }, { p: [P(204, 174, 1), P(216, 146, 1), P(196, 160, 1)], c: '#d8ccb0', m: 'horn', line: 1 },
    { p: [P(170, 176, 1), [168, 162], [190, 156], [212, 162], P(210, 176, 1), [200, 196], P(194, 214, 1), P(186, 214, 1), [180, 196]], c: STR.bone, m: 'horn', gloss: 0.3, line: 1.2,
      lines: [ln([[178, 176], [183, 180]], 7, 1, { c: '#1a1210' }), ln([[202, 176], [197, 180]], 7, 1, { c: '#1a1210' }), ln([[187, 208], [193, 208]], 4, 0.9, { c: '#1a1210' })] },
    palisade(70, 140, 236, g, 18, STR.log, { band: 270 }), palisade(244, 314, 240, g, 18, STR.log, { band: 274 }),
    bone([[140, g - 4, 6], [170, g - 12, 6]]),
  ]);
  // 3. Башня орков: глиняная башня под шкурами, брёвна насквозь, рогатый череп, бревенчатая пристройка
  dwell(3, 'orc', [236, 82], g => {
    const out = [], cx = 196, hw = 50, top = 118;
    out.push({ p: box(88, 236, 148, g), c: STR.log, m: 'wood', flow: 0, line: 1.2, lines: range(3, i => ln([[88, 254 + i * 18], [148, 254 + i * 18]], 3, 0.6)) },
      { p: [P(78, 242, 1), P(154, 216, 1), P(160, 232, 1), P(80, 258, 1)], c: STR.hide, m: 'leather', line: 1.1 });
    out.push({ p: [P(cx - hw, g, 1), [cx - hw * 0.99, g - 90], P(cx - hw * 0.84, top, 1), P(cx + hw * 0.84, top, 1), [cx + hw * 0.99, g - 90], P(cx + hw, g, 1)], c: STR.clay, m: 'cloth', line: 1.3, belly: 0.25,
      lines: [ln([[cx - 30, 150], [cx - 22, 190], [cx - 32, 220]], 2.6, 0.35), ln([[cx - hw, g - 14], [cx + hw, g - 14]], 10, 0.5, { c: tone(STR.clay, -0.25) })],
      sub: [shadeR(cx + 14, top - 4, cx + hw + 6, g + 4, tone(STR.clay, -0.3))] });
    out.push(beam(cx - hw - 14, 160, cx + hw + 14, 160, 10, STR.logD), beam(cx - hw - 14, 236, cx + hw + 14, 236, 10, STR.logD));
    out.push(beam(cx - 60, top + 4, cx + 60, top + 4, 12, STR.logD));
    out.push({ p: [P(cx - 66, top + 6, 1), [cx - 40, top - 30], P(cx, top - 86, 1), [cx + 40, top - 30], P(cx + 66, top + 6, 1), [cx, top + 14]], c: STR.fur, m: 'fur', furLen: 1.1, flow: PI / 2, line: 1.3, belly: 0.3,
      lines: [ln([[cx - 50, top - 10], [cx, top - 2], [cx + 50, top - 10]], 6, 0.85, { c: STR.red })], sub: [{ p: [P(cx + 4, top - 90, 1), P(cx + 72, top + 10, 1), P(cx + 20, top + 20, 1)], c: tone(STR.fur, -0.3), m: 'flat', line: 0, op: 0.6 }] });
    out.push({ p: tube([[cx, top - 80, 6], [cx, top - 104, 4]]), c: STR.bone, m: 'horn', line: 0.9 });
    out.push(skull(cx, 188, 15, { horns: true }), sqwin(cx, 214, 9, 10, STR.logD), door(cx, g, 20, 56, '#4a2c16', { square: true }));
    return out;
  });
  // 4. Форт огров: тяжёлый каменный сруб, колья поверху, рогатый череп над воротами, дубина
  dwell(4, 'ogre', [282, 116], g => [
    palisade(82, 304, 104, 160, 22, STR.log),
    rock([P(78, g, 1), P(82, 150, 1), [150, 142], [240, 146], P(304, 150, 1), P(308, g, 1)], STR.stone, { lines: masonry(78, 146, 308, g, 26, 38, 0.5, 2.8), sub: [shadeR(262, 140, 312, g + 2, STR.stoneD)] }),
    beam(66, 156, 318, 156, 14, STR.logD),
    door(188, g, 32, 104, '#4a2c16'), skull(188, 184, 16, { horns: true }),
    sqwin(116, 212, 11, 12, STR.logD), sqwin(264, 212, 11, 12, STR.logD),
    { p: tube([[284, g, 12], [296, 226, 20], [302, 196, 26]]), c: '#8a6038', m: 'wood', line: 1.2 },
    ...[[292, 214], [304, 190]].map(([x, y]) => ({ p: [P(x - 6, y - 4, 1), P(x + 18, y - 2, 1), P(x - 4, y + 6, 1)], c: '#d0c8b8', m: 'horn', line: 0.9 })),
  ]);
  // 5. Гнездо на утёсе (рух): скальный столп, огромное гнездо, яйцо, перья
  dwell(5, 'roc', [290, 108], g => [
    rock([P(104, g, 1), [122, 256], [146, 196], P(158, 134, 1), P(250, 134, 1), [262, 196], [284, 258], P(302, g, 1)], '#9a8a70',
      { lines: [ln([[158, 170], [168, 230], [150, 280]], 3, 0.45), ln([[236, 170], [250, 240]], 3, 0.4)], sub: [shadeR(232, 126, 320, g + 4, '#6a5c48')] }),
    hole(204, g, 26, 60), (lit(204, g - 24), null),
    ...[[96, 118, -2.5], [300, 116, -0.8], [120, 98, -2.0], [280, 96, -1.1]].map(([x, y, a]) => ({ p: K.leaf([x, y], a, 40, 13).body, c: '#b86a3a', m: 'feather', line: 0.9 })),
    { p: ell(204, 130, 116, 30, 16), c: '#7a5a34', m: 'wood', flow: 0.2, line: 1.3,
      lines: [-0.8, -0.4, 0, 0.4, 0.8].map(k => ln([[204 + k * 108 - 26, 118 + Math.abs(k) * 8], [204 + k * 108 + 30, 140 + Math.abs(k) * 6]], 4.5, 0.7, { c: '#4a3018' })).concat([ln([[96, 124], [312, 124]], 4, 0.7, { c: '#a88a5a' })]) },
    { p: ell(186, 100, 26, 32, 12), c: '#ece6d4', m: 'skin', gloss: 0.6, line: 1.1, glint: [[178, 86, 6]] }, { p: ell(230, 108, 18, 22, 12), c: '#dcd4bc', m: 'skin', line: 1.1 },
    boulder(88, g, 20, 16, '#8a7a60'),
  ]);
  // 6. Пещера циклопов: скала с пастью, высеченный над входом глаз, факелы
  dwell(6, 'cyclops', [272, 138], g => [
    rock([P(66, g, 1), [72, 230], [100, 164], [150, 124], [210, 112], [266, 132], [298, 190], P(312, g, 1)], STR.stone,
      { lines: [ln([[104, 200], [116, 260]], 3, 0.45), ln([[290, 210], [280, 270]], 3, 0.45)], sub: [shadeR(266, 100, 320, g + 4, STR.stoneD)] }),
    rock([P(116, g, 1), [124, 232], [160, 210], [190, 204], [220, 210], [256, 232], P(264, g, 1)], '#7a7062', { line: 1.1 }),
    hole(190, g, 52, 96, '#120c0a'),
    { p: tube([[140, 146, 14], [190, 128, 18], [240, 146, 14]]), c: '#6a6254', m: 'horn', line: 1.1 },
    { p: [P(140, 166, 1), [166, 146], [214, 146], P(240, 166, 1), [214, 188], [166, 188]], c: '#f0ece0', m: 'skin', line: 1.5 },
    { e: [190, 167, 19, 19], c: '#d03a24', m: 'gem', gloss: 1, line: 1.2, glint: [[184, 161, 5]] }, { e: [190, 167, 8, 8], c: '#1a0a08', m: 'flat', line: 0 },
    (lit(190, 167), null),
    torch(122, g, 70), torch(258, g, 70),
    boulder(300, g, 16, 14, '#8e8474'),
  ]);
  // 7. Логово бегемотов: исполинский рогатый череп и рёбра над пещерой
  dwell(7, 'behemoth', [290, 168], g => {
    const out = [], cx = 188;
    out.push(rock([P(58, g, 1), [66, 236], [104, 178], [170, 160], [240, 162], [290, 196], [310, 250], P(314, g, 1)], STR.stone, { sub: [shadeR(270, 150, 320, g + 4, STR.stoneD)] }));
    for (const [dx, h] of [[112, 150], [80, 176]]) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * dx, g, 16], [cx + s * dx * 0.98, g - h * 0.55, 13], [cx + s * dx * 0.66, g - h * 0.95, 9], [cx + s * dx * 0.3, g - h * 1.04, 6]]), c: STR.bone, m: 'horn', gloss: 0.5, line: 1.2 });
    out.push(hole(cx, g, 50, 108, '#140c0a'));
    out.push({ p: tube([[cx - 36, 106, 20], [cx - 80, 76, 15], [cx - 110, 86, 9], [cx - 118, 110, 3]]), c: '#d8ccb0', m: 'horn', gloss: 0.6, line: 1.2 }, { p: tube([[cx + 36, 106, 20], [cx + 80, 76, 15], [cx + 110, 86, 9], [cx + 118, 110, 3]]), c: '#d8ccb0', m: 'horn', gloss: 0.6, line: 1.2 });
    out.push({ p: [[cx - 58, 126], [cx - 52, 92], [cx - 26, 70], [cx, 66], [cx + 26, 70], [cx + 52, 92], [cx + 58, 126], [cx + 44, 156], P(cx + 32, 186, 1), P(cx - 32, 186, 1), [cx - 44, 156]], c: STR.bone, m: 'horn', gloss: 0.4, line: 1.4,
      lines: [ln([[cx - 28, 116], [cx - 16, 122]], 16, 1, { c: '#1a0a08' }), ln([[cx + 28, 116], [cx + 16, 122]], 16, 1, { c: '#1a0a08' }), ln([[cx - 8, 150], [cx + 8, 150]], 6, 0.9, { c: '#1a1210' }), ln([[cx - 22, 176], [cx + 22, 176]], 3, 0.8, { c: '#5a4a38' })] });
    out.push({ e: [cx - 22, 119, 5, 4], c: '#ff5a2a', m: 'gem', line: 0 }, { e: [cx + 22, 119, 5, 4], c: '#ff5a2a', m: 'gem', line: 0 });
    lit(cx - 22, 119); lit(cx + 22, 119);
    out.push(tusk(cx - 26, 188, 0.5, 44), tusk(cx + 26, 188, -0.5, 44));
    out.push(torch(110, g, 66), torch(268, g, 66));
    return out;
  });

  /* ============================== КРЕПОСТЬ ============================== */
  const FRT = { wood: '#7a5a34', woodD: '#4e3a20', thatch: '#b8a060', moss: '#5e8a2e', moss2: '#76a03a', stone: '#7c8468', stoneD: '#58604a', water: '#3a6a5a', liz: '#5a9a3a', red: '#c84a2a', bone: '#e4dcc0', teal: '#2f8a72', clay: '#8a7050' };
  /** Болотная лужа у основания. */
  const swamp = (cx, rx) => pond(cx, G - 6, rx, 14, FRT.water);
  /** Тотем ящеров: столб, голова ящера с гребнем. */
  function lizTotem(x, g, h, s) {
    s = s || 1; const top = g - h;
    return [{ p: tube([[x, g, 16], [x, top + 30, 13]], { flat0: true }), c: '#6a5030', m: 'wood', flow: -PI / 2, line: 1, lines: [0.3, 0.5, 0.7].map(t => ln([[x - 8, g - h * t], [x + 8, g - h * t]], 5, 0.9, { c: FRT.teal })) },
      { p: [[x - s * 16, top + 40], [x - s * 18, top + 14], [x - s * 6, top], [x + s * 14, top + 4], [x + s * 42, top + 14], P(x + s * 46, top + 22, 1), [x + s * 20, top + 26], [x + s * 12, top + 40]], c: FRT.liz, m: 'skin', line: 1.1, lines: [ln([[x + s * 16, top + 20], [x + s * 44, top + 21]], 2.4, 0.8)] },
      { e: [x + s * 6, top + 11, 4.5, 4], c: '#ffd040', m: 'gem', line: 0.6 },
      { p: [P(x - s * 10, top + 4, 1), [x - s * 2, top - 18], P(x + s * 4, top + 2, 1)], c: FRT.red, m: 'leather', line: 0.9 }];
  }
  /** Сваи под хижиной. */
  const stilts = (x0, x1, top, g, st) => range(Math.floor((x1 - x0) / st) + 1, i => post(x0 + i * st, g - 4, top, 10, FRT.woodD));

  // 1. Хижина гноллов: глинобитный купол под соломой, кости, копьё
  dwell(1, 'gnoll', [244, 150], g => [
    swamp(190, 110),
    { p: [P(104, g - 4, 1), [98, 250], [124, 212], [186, 198], [248, 212], [274, 250], P(268, g - 4, 1), [186, g + 4]], c: FRT.clay, m: 'cloth', line: 1.3, belly: 0.3,
      lines: [ln([[110, 262], [262, 262]], 3.4, 0.5, { c: '#5a4630' })], sub: [shadeR(232, 190, 280, g, '#5e4a34')] },
    thatch(186, 214, 104, 80, FRT.thatch),
    moss(146, 184, 18, 8), moss(214, 172, 14, 7, FRT.moss2),
    hole(180, g - 4, 22, 58), (lit(180, g - 30), null),
    sqwin(240, 256, 8, 8, FRT.woodD),
    bone([[122, g - 6, 6], [150, g - 14, 6]]), skull(262, g - 14, 10),
    post(290, g, 150, 6, FRT.wood), { p: [P(283, 154, 1), P(290, 124, 1), P(297, 154, 1)], c: '#b7c0ca', m: 'steel', line: 0.9 },
  ]);
  // 2. Логово ящеров: хижина на сваях над водой, щиты, лестница, камыш
  dwell(2, 'lizardman', [252, 128], g => [
    swamp(190, 124),
    stilts(124, 260, 226, g, 34),
    beam(168, g - 6, 150, 226, 5, FRT.wood), beam(186, g - 6, 168, 226, 5, FRT.wood),
    ...range(3, i => beam(165 - i * 5, g - 24 - i * 22, 183 - i * 5, g - 24 - i * 22, 4, FRT.wood)),
    { p: box(112, 218, 270, 232), c: FRT.woodD, m: 'wood', flow: 0, line: 1.1 },
    { p: box(128, 164, 256, 220), c: FRT.wood, m: 'wood', flow: -PI / 2, line: 1.2, lines: range(7, i => ln([[144 + i * 16, 164], [144 + i * 16, 220]], 2.4, 0.45)), sub: [shadeR(228, 160, 260, 222, FRT.woodD)] },
    hole(192, 220, 14, 38, '#140e08'), (lit(192, 200), null),
    thatch(192, 166, 94, 84, FRT.thatch),
    moss(150, 136, 16, 7), moss(226, 128, 14, 6, FRT.moss2),
    { e: [146, 192, 13, 16], c: FRT.teal, m: 'leather', line: 1.1, lines: [ln([[146, 178], [146, 206]], 3.4, 0.9, { c: '#e0c050' })] },
    { e: [240, 192, 13, 16], c: FRT.red, m: 'leather', line: 1.1, lines: [ln([[228, 192], [252, 192]], 3.4, 0.9, { c: '#e0c050' })] },
    reeds(294, g, 3),
  ]);
  // 3. Улей змиев: сухое дерево, бумажные гнёзда-ульи со светящимися летками, стрекоза
  dwell(3, 'serpent_fly', [270, 110], g => {
    const out = [swamp(190, 116)];
    out.push({ p: tube([[190, g - 4, 34], [196, 230, 24], [184, 160, 18], [176, 90, 10]]), c: '#6a5a44', m: 'wood', flow: -PI / 2, line: 1.2 });
    out.push({ p: tube([[192, 196, 12], [240, 150, 8], [274, 116, 4]]), c: '#6a5a44', m: 'wood', line: 1.1 }, { p: tube([[186, 176, 10], [140, 140, 7], [110, 128, 3]]), c: '#6a5a44', m: 'wood', line: 1.1 });
    for (const [x, y, rx, ry] of [[240, 188, 30, 40], [134, 172, 24, 32], [190, 118, 22, 30]]) {
      out.push({ p: ell(x, y, rx, ry, 14), c: '#d0c090', m: 'cloth', line: 1.2, belly: 0.4, lines: [-0.5, -0.1, 0.3, 0.65].map(t => ln([[x - rx * Math.sqrt(1 - t * t), y + ry * t], [x, y + ry * t + 5], [x + rx * Math.sqrt(1 - t * t), y + ry * t]], 3, 0.5)) });
      out.push({ e: [x, y + ry * 0.45, rx * 0.3, ry * 0.2], c: '#ffc830', m: 'gem', line: 0.9 }); lit(x, y + ry * 0.45);
    }
    for (const [x, y] of [[292, 234], [104, 222]]) {
      out.push({ p: K.leaf([x, y], -2.6, 26, 10).body, c: '#bfe8f8', m: 'gem', op: 0.75, line: 0.7 }, { p: K.leaf([x, y], -0.5, 26, 10).body, c: '#bfe8f8', m: 'gem', op: 0.75, line: 0.7 });
      out.push({ p: tube([[x - 14, y + 2, 6], [x + 16, y - 2, 3.4]]), c: '#3a9a6a', m: 'skin', line: 0.7 });
    }
    out.push(reeds(96, g, 3), reeds(292, g, 2));
    return out;
  });
  // 4. Яма василисков: каменное кольцо над ямой, жёлтые глаза во тьме, частокол и тотем
  dwell(4, 'basilisk', [274, 118], g => [
    palisade(92, 300, 200, g - 40, 20, '#6a5030'),
    lizTotem(270, g - 40, 150, -1),
    { p: ell(188, g - 36, 116, 34, 16), c: FRT.stone, m: 'horn', gloss: 0.15, line: 1.3, lines: range(6, i => ln([[80 + i * 40, g - 60], [88 + i * 40, g - 8]], 3, 0.4)) },
    { p: ell(188, g - 44, 88, 20, 14), c: '#10140c', m: 'cloth', ao: 1.4, line: 1.1 },
    ...[168, 206].map(x => { lit(x, g - 44); return { e: [x, g - 44, 9, 6], c: '#ffe040', m: 'gem', gloss: 1.1, line: 0.7, sub: [{ e: [x, g - 44, 2, 5], c: '#1a1a0a', m: 'flat', line: 0 }] }; }),
    moss(116, g - 56, 24, 8), moss(262, g - 56, 20, 7, FRT.moss2),
    boulder(96, g, 16, 14, FRT.stoneD),
  ]);
  // 5. Логово горгон: замшелые руины-арка, бычий череп на перемычке
  dwell(5, 'gorgon', [290, 128], g => {
    const ms = (pts, x0, y0, x1, y1, c) => ({ p: pts, c: c || FRT.stone, m: 'horn', gloss: 0.12, line: 1.3, belly: 0.25, lines: masonry(x0, y0, x1, y1, 26, 40, 0.45, 2.6) });
    return [
      rock([P(70, g, 1), [84, 256], [130, 228], [200, 220], [270, 228], [306, 256], P(314, g, 1)], '#6a7a44'),
      ms([P(96, g, 1), P(96, 176, 1), P(290, 176, 1), P(290, g, 1)], 96, 176, 290, g),
      { p: box(250, 170, 294, g + 2), c: FRT.stoneD, m: 'flat', line: 0, op: 0.45 },
      hole(190, g, 52, 108, '#141410'), eyes(190, g - 50, 10, '#7ae070', 4),
      ms([P(84, 178, 1), P(84, 146, 1), P(302, 146, 1), P(302, 178, 1)], 84, 146, 302, 178, '#8a8e72'),
      moss(140, 148, 40, 9), moss(260, 150, 26, 8, FRT.moss2), moss(110, 250, 14, 18),
      skull(190, 120, 26, { horns: true, c: FRT.bone, hornC: '#c8b890' }),
      { p: tube([[130, 176, 6], [128, 214, 5]]), c: '#4a6a24', m: 'leather', line: 0.6 }, { p: tube([[264, 176, 6], [266, 204, 5]]), c: '#4a6a24', m: 'leather', line: 0.6 },
    ];
  });
  // 6. Гнездо виверн: мёртвое дерево над болотом, гнездо из веток, зелёные яйца
  dwell(6, 'wyvern', [284, 100], g => [
    swamp(190, 126),
    { p: tube([[196, g - 4, 42], [190, 240, 30], [202, 176, 24], [196, 132, 18]]), c: '#5e5040', m: 'wood', flow: -PI / 2, line: 1.3, lines: [ln([[184, g - 20], [180, 200]], 3, 0.4)] },
    { p: tube([[192, 222, 14], [134, 184, 9], [96, 146, 4]]), c: '#5e5040', m: 'wood', line: 1.1 }, { p: tube([[204, 204, 12], [262, 178, 8], [298, 138, 4]]), c: '#5e5040', m: 'wood', line: 1.1 },
    nest(196, 126, 70, '#6a5030', ['#9ac870', '#7aa850', '#aad880']),
    moss(146, 194, 16, 7), moss(250, 184, 14, 6, FRT.moss2),
    hole(196, g - 8, 16, 44, '#141008'), (lit(196, g - 26), null),
    ...[[96, 146], [298, 138]].map(([x, y]) => ({ p: tube([[x, y, 3], [x + 2, y + 44, 2]]), c: '#6a8a3a', m: 'leather', line: 0.5 })),
    reeds(106, g, 3),
  ]);
  // 7. Пруд гидр: каменная чаша, из воды поднимаются три змеиные шеи
  dwell(7, 'hydra', [298, 250], g => {
    const out = [], y0 = g - 50;
    out.push({ p: [P(66, g, 1), P(78, y0 - 6, 1), P(306, y0 - 6, 1), P(316, g, 1)], c: FRT.stone, m: 'horn', gloss: 0.12, line: 1.3, lines: masonry(66, y0 - 6, 316, g, 22, 40, 0.45, 2.6), sub: [shadeR(280, y0 - 10, 320, g + 2, FRT.stoneD)] });
    out.push(pond(192, y0 - 8, 110, 16, '#2f6a5a'));
    for (const [x, h, s, c] of [[132, 150, -1, '#4f7a4a'], [196, 210, 1, '#5a8a50'], [250, 132, -1, '#4f7a4a']]) {
      const top = y0 - h;
      out.push({ p: tube([[x, y0 - 4, 30], [x - s * 18, y0 - h * 0.4, 24], [x + s * 6, y0 - h * 0.8, 18], [x + s * 6, top + 16, 16]], { flat0: true }), c, m: 'skin', line: 1.3,
        lines: [0.25, 0.5].map(t => ln([[x - 12, y0 - h * t], [x + 12, y0 - h * t + 4]], 3, 0.6, { c: '#c8c070' })) });
      out.push({ p: [P(x + s * 6 - 18, top + 26, 1), [x + s * 6 - 20, top + 6], [x + s * 6, top - 6], [x + s * 6 + s * 28, top + 2], P(x + s * 6 + s * 44, top + 16, 1), [x + s * 6 + s * 20, top + 26]], c, m: 'skin', line: 1.3 });
      out.push({ e: [x + s * 14, top + 6, 4.5, 3.6], c: '#ffd040', m: 'gem', gloss: 1, line: 0.6 }); lit(x + s * 14, top + 6);
      out.push({ p: [P(x + s * 2, top, 1), [x - s * 8, top - 18], P(x - s * 12, top + 8, 1)], c: FRT.red, m: 'leather', line: 0.9 });
    }
    out.push(moss(100, y0 - 4, 22, 7), moss(290, y0 - 2, 18, 6, FRT.moss2), reeds(80, g, 3));
    return out;
  });

  /* ============================== СОПРЯЖЕНИЕ ============================== */
  const CFX = { mar: '#eceff6', marD: '#aab4ca', gold: '#d8a53a', air: '#dff0ff', water: '#3aa8f0', fire: '#ff7a2a', earth: '#b08a4a', magic: '#b48aff' };
  /** Мраморные ступени: n ступеней от земли, полуширина сверху w0 и снизу w1. */
  function steps(cx, g, n, sh, w0, w1, c) {
    return range(n, i => { const w = w1 - (w1 - w0) * i / Math.max(1, n - 1); return { p: box(cx - w, g - sh * (i + 1), cx + w, g - sh * i), c: c || CFX.mar, m: 'cloth', line: 1.1, lines: [ln([[cx - w, g - sh * (i + 1) + 2], [cx + w, g - sh * (i + 1) + 2]], 2, 0.5, { light: true })], sub: [shadeR(cx + w * 0.6, g - sh * (i + 1) - 2, cx + w + 2, g - sh * i + 2, CFX.marD)] }; });
  }
  /** Колонна-пьедестал с золотой капителью. */
  const plinth = (cx, y0, y1, hw) => [{ p: trap(cx, y0, y1, hw * 0.8, hw), c: CFX.mar, m: 'cloth', line: 1.2, lines: [ln([[cx - hw * 0.3, y0 + 4], [cx - hw * 0.34, y1 - 4]], 2.4, 0.4)], sub: [shadeR(cx + hw * 0.3, y0 - 2, cx + hw + 2, y1 + 2, CFX.marD)] },
    { p: box(cx - hw - 6, y0 - 12, cx + hw + 6, y0 + 2), c: CFX.gold, m: 'gold', line: 1 }];
  /** Парящий самоцвет-ромб. */
  const gemFloat = (x, y, w, h, c) => { lit(x, y); return { p: [P(x, y - h, 1), P(x + w, y, 1), P(x, y + h * 0.6, 1), P(x - w, y, 1)], c, m: 'gem', gloss: 1.2, rim: 0.6, line: 1, sub: [{ p: [P(x, y - h, 1), P(x + w, y, 1), P(x, y + h * 0.6, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }] }; };
  /** Сверкание: четырёхлучевая звёздочка. */
  const spark = (x, y, r, c) => ({ p: [P(x, y - r, 1), [x + r * 0.2, y - r * 0.2], P(x + r, y, 1), [x + r * 0.2, y + r * 0.2], P(x, y + r, 1), [x - r * 0.2, y + r * 0.2], P(x - r, y, 1), [x - r * 0.2, y - r * 0.2]], c: c || '#fffbe0', m: 'flat', line: 0 });

  // 1. Волшебный сад фей: цветущий холм, дом-гриб со светящимися окнами, цветы и искры
  dwell(1, 'pixie', [252, 118], g => [
    { p: [P(80, g, 1), [104, 262], [168, 238], [240, 244], [290, 268], P(310, g, 1)], c: '#6aa844', m: 'cloth', line: 1.3, belly: 0.3 },
    { p: tube([[190, g - 30, 56], [188, 220, 48], [192, 176, 42]], { flat1: true }), c: '#f0e8d8', m: 'skin', line: 1.2, sub: [shadeR(206, 160, 230, g, '#cfc4b0')] },
    door(190, g - 30, 14, 44, '#8a5ad8'), sqwin(174, 212, 6, 7, '#c8b8a0'), sqwin(206, 196, 6, 7, '#c8b8a0'),
    { p: [P(106, 180, 1), [118, 128], [160, 98], [192, 94], [228, 98], [266, 128], P(278, 180, 1), [190, 170]], c: '#e0407a', m: 'skin', gloss: 0.7, line: 1.4,
      sub: [{ e: [150, 130, 14, 9], c: '#fff4f8', m: 'flat', line: 0 }, { e: [202, 116, 12, 8], c: '#fff4f8', m: 'flat', line: 0 }, { e: [246, 146, 10, 7], c: '#fff4f8', m: 'flat', line: 0 }, { p: [P(106, 180, 1), P(278, 180, 1), [190, 192]], c: '#8a2048', m: 'flat', line: 0 }] },
    mushroom(274, g - 18, 40, 22, '#8a5ad8'),
    ...[[112, g - 28, '#ffd040'], [140, g - 44, '#ffffff'], [238, g - 44, '#ff8ab0'], [296, g - 12, '#c0a0ff'], [258, g - 60, '#ffd040']].map(([x, y, c]) => ({ e: [x, y, 8, 8], c, m: 'gem', line: 0.8, sub: [{ e: [x, y, 3, 3], c: '#ffb020', m: 'flat', line: 0 }] })),
    spark(128, 104, 10), spark(284, 96, 8), spark(236, 64, 7, '#ffe0ff'),
  ]);
  // 2. Алтарь воздуха: мраморная колонна, парящий бледный кристалл в кольцах ветра
  dwell(2, 'air_elemental', [262, 150], g => {
    const arcs = front => [[196, 58], [150, 74], [104, 62]].map(([y, rx], i) => {
      const pts = []; for (let k = 0; k <= 10; k++) { const a = front ? -0.15 + k / 10 * (PI + 0.3) : PI - 0.15 + k / 10 * (PI + 0.3); pts.push([190 + Math.cos(a) * rx + i * 6, y + Math.sin(a) * rx * 0.24, 7 + i * 2]); }
      return { p: tube(pts), c: front ? '#f4faff' : '#b8d4ec', m: 'gem', op: front ? 0.8 : 0.5, gloss: 0.6, line: 0.7 };
    });
    return [steps(190, g, 2, 14, 74, 96), arcs(false), plinth(190, 206, g - 28, 30),
      halo(190, 120, 44, 56, 'rgba(210,235,255,0.35)'), gemFloat(190, 128, 26, 70, CFX.air), arcs(true),
      spark(122, 90, 9, '#ffffff'), spark(268, 118, 8, '#ffffff')];
  });
  // 3. Алтарь воды: мраморная чаша-фонтан, синий кристалл, струи
  dwell(3, 'water_elemental', [276, 170], g => [
    pond(190, g - 8, 130, 12, CFX.water),
    steps(190, g, 1, 14, 90, 90),
    crystal(190, 196, 22, 110, CFX.water, 0), crystal(158, 200, 13, 62, '#8ad0ff', -0.2), crystal(224, 200, 13, 68, '#5ab8ff', 0.2),
    { p: tube([[168, 196, 8], [136, 160, 6], [110, 196, 5], [104, 230, 4]]), c: '#9adcff', m: 'gem', op: 0.8, line: 0.6 }, { p: tube([[212, 196, 8], [244, 160, 6], [270, 196, 5], [276, 230, 4]]), c: '#9adcff', m: 'gem', op: 0.8, line: 0.6 },
    { p: [P(92, 196, 1), P(288, 196, 1), [278, 234], P(246, g - 16, 1), P(134, g - 16, 1), [102, 234]], c: CFX.mar, m: 'cloth', line: 1.3, sub: [shadeR(240, 192, 292, g, CFX.marD)], lines: [ln([[98, 208], [282, 208]], 5, 0.95, { c: CFX.gold })] },
    { p: ell(190, 197, 96, 8, 14), c: CFX.water, m: 'gem', gloss: 0.6, rim: 0, line: 0.9, lines: [ln([[140, 196], [170, 195]], 2.4, 0.8, { light: true })] },
    (lit(190, 150), lit(150, 230), null),
    spark(110, 150, 8, '#e0f4ff'), spark(270, 130, 7, '#e0f4ff'),
  ]);
  // 4. Алтарь огня: чёрная скала-жаровня с чашей лавы, языки пламени, огненные кристаллы
  dwell(4, 'fire_elemental', [274, 150], g => [
    rock([P(86, g, 1), [96, 240], [130, 212], [190, 204], [250, 212], [286, 240], P(298, g, 1)], '#3e3232', { lines: [ln([[120, 240], [136, 290]], 3, 0.5, { c: '#ff6a1a' }), ln([[262, 236], [250, 292]], 3, 0.5, { c: '#ff6a1a' })] }),
    halo(190, 150, 90, 70, 'rgba(255,140,40,0.2)'),
    { p: ell(190, 212, 90, 16, 16), c: '#ff6a1a', m: 'gem', gloss: 0.8, line: 1.1, lc: '#6a1a0a', sub: [{ p: ell(184, 210, 60, 9, 12), c: '#ffc050', m: 'flat', line: 0 }] },
    flame(150, 210, 20, 76), flame(236, 210, 20, 84, { lean: 6 }), flame(192, 214, 34, 150, { lean: -6 }),
    crystal(110, g, 14, 72, CFX.fire, -0.15), crystal(276, g, 14, 84, '#ffb040', 0.15),
    (lit(150, 170), lit(192, 120), lit(236, 160), null),
    boulder(150, g, 18, 12, '#4a3a38'),
  ]);
  // 5. Алтарь земли: скальная пасть с каменными зубами, бурые кристаллы, горящие очи
  dwell(5, 'earth_elemental', [270, 132], g => [
    rock([P(74, g, 1), [82, 232], [112, 170], [160, 136], [220, 134], [268, 166], [300, 230], P(310, g, 1)], '#8a6a44',
      { lines: [ln([[110, 200], [122, 260]], 3, 0.45), ln([[284, 200], [274, 260]], 3, 0.45)], sub: [shadeR(266, 120, 320, g + 4, '#5e4a30')] }),
    { p: [P(122, g, 1), [128, g - 70], [190, g - 100], [252, g - 70], P(258, g, 1)], c: '#140c08', m: 'cloth', ao: 1.4, line: 1.3 },
    ...[-44, -16, 16, 44].map(dx => ({ p: [P(190 + dx - 13, g - 88 + Math.abs(dx) * 0.4, 1), P(190 + dx + 13, g - 88 + Math.abs(dx) * 0.4, 1), P(190 + dx, g - 56 + Math.abs(dx) * 0.4, 1)], c: '#c8b090', m: 'horn', line: 1 })),
    ...[-48, 0, 48].map(dx => ({ p: [P(190 + dx - 13, g, 1), P(190 + dx + 13, g, 1), P(190 + dx, g - 28, 1)], c: '#c8b090', m: 'horn', line: 1 })),
    ...[150, 230].map(x => { lit(x, 176); return { e: [x, 176, 16, 11], c: '#ffb040', m: 'gem', gloss: 1, line: 1.1 }; }),
    crystal(96, g, 14, 70, CFX.earth, -0.15), crystal(298, g, 14, 62, '#d8a860', 0.15), crystal(190, 142, 14, 56, CFX.earth, 0),
  ]);
  // 6. Алтарь разума: каменное кольцо-портал, лиловая воронка, золотые самоцветы вокруг
  dwell(6, 'psychic_elemental', [284, 110], g => {
    const cx = 190, cy = 176;
    return [
      steps(cx, g, 2, 12, 84, 104),
      { p: ell(cx, cy, 100, 108, 22), c: '#8a7a9a', m: 'horn', gloss: 0.3, line: 1.4, lines: range(8, i => { const a = i / 8 * PI * 2; return ln([[cx + Math.cos(a) * 84, cy + Math.sin(a) * 90], [cx + Math.cos(a) * 100, cy + Math.sin(a) * 108]], 4, 0.5); }) },
      { p: ell(cx, cy, 80, 88, 20), c: '#5a2a9a', m: 'gem', gloss: 0.8, line: 1.2, lc: '#2a0a4a', sub: [{ p: ell(cx, cy, 48, 54, 16), c: '#9a6aff', m: 'flat', line: 0 }, { p: ell(cx, cy, 20, 24, 12), c: '#f0e0ff', m: 'flat', line: 0 }],
        lines: range(3, i => ({ p: range(7, k => { const a = k * 0.8 + i * 2.1, r = 76 - k * 10; return [cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r]; }), w: 5, light: true, a: 0.6 })) },
      (lit(cx, cy), null),
      gemFloat(cx - 118, cy - 20, 11, 22, CFX.gold), gemFloat(cx + 116, cy + 10, 11, 22, CFX.gold), gemFloat(cx, cy - 124, 12, 24, CFX.magic),
    ];
  });
  // 7. Гнездо жар-птиц: скальный столп с огненными кристаллами, пылающее гнездо
  dwell(7, 'firebird', [296, 150], g => [
    rock([P(120, g, 1), [136, 250], [152, 200], P(160, 158, 1), P(222, 158, 1), [232, 200], [248, 250], P(262, g, 1)], '#8a6a5a', { sub: [shadeR(208, 150, 270, g + 4, '#5e4438')], lines: [ln([[170, 180], [176, 240], [166, 290]], 3, 0.45)] }),
    crystal(130, g, 16, 90, CFX.fire, -0.2), crystal(262, g, 16, 104, '#ffb040', 0.2), crystal(98, g, 11, 52, '#ff5a2a', -0.3), crystal(292, g, 11, 60, CFX.fire, 0.25),
    hole(192, g, 20, 56, '#1a0c08'), (lit(192, g - 26), null),
    { p: ell(192, 156, 94, 24, 16), c: '#6a4428', m: 'wood', flow: 0.2, line: 1.3, lines: [-0.7, -0.2, 0.3, 0.8].map(k => ln([[192 + k * 86 - 24, 144], [192 + k * 86 + 28, 166]], 4.5, 0.7, { c: '#3a2210' })) },
    halo(192, 96, 80, 66, 'rgba(255,150,40,0.22)'),
    flame(142, 150, 26, 86), flame(240, 150, 26, 94), flame(192, 154, 40, 150, { c: '#ffa030' }),
    (lit(192, 80), lit(142, 110), lit(240, 104), null),
    ...[[-0.9, 146, 90], [-2.2, 236, 84]].map(([a, x, y]) => ({ p: K.leaf([x, y], a, 50, 15).body, c: '#ff8a2a', m: 'feather', line: 0.9 })),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
