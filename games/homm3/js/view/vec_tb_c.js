/* ============================================================================
   view/vec_tb_c.js — постройки экрана города: Цитадель, Крепость, Сопряжение, Бухта.

   Имена: bld_<id>@<фракция> (stronghold, fortress, conflux, cove). Экран города
   (townscene.js) берёт такой рисунок вместо общего bld_<id> и не кладёт поверх
   «черты фракции». Рамка — от общей постройки (K.frameOf('bld_…')), поэтому
   рисунок встаёт в тот же слот раскладки; центр-низ = якорь.

   Цвета — свои, без токенов подкраски: у каждой фракции своя архитектура.
   Окна и фонари записываются в meta.lights сами (помощники win/sqwin/porthole/
   lamp) — ночью экран зажигает их на тех же местах.
   Единицы — дизайн-единицы (10 на клетку старого спрайта); на сцене постройки
   идут в масштабе 2, то есть 5 единиц на точку сцены.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone } = K;
  const PI = Math.PI;

  /* ---------- рамки общих построек (запас, если спрайтов нет) ---------- */
  const FB = {
    hall_1: [420, 367, 210, 363], hall_2: [460, 440, 230, 437], hall_3: [520, 460, 260, 457], hall_4: [560, 573, 280, 570],
    guild_1: [220, 437, 110, 433], guild_2: [240, 543, 120, 540], guild_3: [260, 647, 130, 643], guild_4: [280, 750, 140, 747],
    tavern: [360, 340, 180, 337], market: [407, 253, 203, 250], blacksmith: [333, 370, 167, 367], silo: [320, 400, 160, 397], special: [280, 280, 140, 277],
    dwell_1: [260, 253, 130, 250], dwell_2: [313, 280, 157, 277], dwell_3: [353, 293, 177, 290], dwell_4: [340, 300, 170, 297],
    dwell_5: [400, 400, 200, 397], dwell_6: [440, 440, 220, 437], dwell_7: [540, 500, 270, 497],
    fort: [980, 333, 490, 330], citadel: [980, 453, 490, 450], castle: [980, 643, 490, 640],
  };
  function frame(id) {
    const f = K.frameOf && K.frameOf('bld_' + id);
    if (f) return f;
    const b = FB[id]; return { w: b[0], h: b[1], anchor: [b[2], b[3]] };
  }

  /* ---------- огни: окна сами записываются сюда, bd() кладёт их в meta.lights ---------- */
  let LT = [];
  const lit = (x, y) => { LT.push([Math.round(x), Math.round(y)]); };
  /**
   * Описать постройку фракции: build(cx, g, frame) → формы (можно вложенными массивами).
   * cx, g — якорь рамки общей постройки (центр и земля).
   */
  function bd(id, fac, build) {
    const fr = frame(id); LT = [];
    const shapes = build(fr.anchor[0], fr.anchor[1], fr).flat(Infinity).filter(Boolean);
    const lights = LT.slice(0, 16); LT = [];
    V.def('bld_' + id + '@' + fac, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { lights } });
  }

  /* ---------- геометрия ---------- */
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  /** Тёмная правая сторона (плоская подформа). */
  const shadeR = (x0, y0, x1, y1, c) => ({ p: box(x0, y0, x1, y1), c, m: 'flat', line: 0 });
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 2.2;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push({ p: [[x0, y], [x1, y]], w, a });
    let row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  function planks(x0, y0, x1, y1, st, vert, a) {
    const out = []; a = a || 0.5;
    if (vert) for (let x = x0 + st; x < x1 - 1; x += st) out.push({ p: [[x, y0], [x, y1]], w: 2.2, a });
    else for (let y = y0 + st; y < y1 - 1; y += st) out.push({ p: [[x0, y], [x1, y]], w: 2.2, a });
    return out;
  }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- общие детали ---------- */
  const WIN = '#f2d34c', WLC = '#3a2614', HOLE = '#1a1410', IRON = '#4a4a52', GOLD = '#d8a53a';
  /** Арочное окно с тёплым светом (записывает огонь). */
  function win(cx, y1, w, h, o) {
    o = o || {}; const ys = y1 - h + w, lc = o.lc || WLC;
    const lines = o.cross === false ? [] : [{ p: [[cx, y1 - h + 1], [cx, y1]], w: Math.max(1.8, w * 0.28), c: lc, a: 0.9 }, { p: [[cx - w, ys + (y1 - ys) * 0.2], [cx + w, ys + (y1 - ys) * 0.2]], w: Math.max(1.8, w * 0.24), c: lc, a: 0.9 }];
    lit(cx, y1 - h * 0.45);
    const out = [{ p: arch(cx, y1, w, h, o.pointed), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.1, lc, lines }];
    if (o.ring) out.unshift({ p: arch(cx, y1 + 3, w + 5, h + 6, o.pointed), c: o.ring, m: 'cloth', line: 1 });
    return out;
  }
  /** Прямоугольное окно: o.shutters — ставни, o.sill — подоконник, o.cross: false — без переплёта. */
  function sqwin(cx, cy, w, h, o) {
    o = o || {}; const out = [], lc = o.lc || WLC;
    lit(cx, cy);
    if (o.shutters) for (const s of [-1, 1]) out.push({ p: box(cx + s * w, cy - h, cx + s * (w + w * 0.8), cy + h), c: o.shutters, m: 'wood', flow: -PI / 2, line: 1 });
    if (o.frame) out.push({ p: box(cx - w - 4, cy - h - 4, cx + w + 4, cy + h + 4), c: o.frame, m: o.fm || 'wood', line: 1 });
    out.push({ p: box(cx - w, cy - h, cx + w, cy + h), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.1, lc,
      lines: o.cross === false ? [] : [{ p: [[cx, cy - h], [cx, cy + h]], w: 2.6, c: lc, a: 0.9 }, { p: [[cx - w, cy], [cx + w, cy]], w: 2.6, c: lc, a: 0.9 }] });
    if (o.sill) out.push({ p: box(cx - w - 4, cy + h, cx + w + 4, cy + h + 6), c: o.sill, m: 'cloth', line: 1 });
    return out;
  }
  /** Круглое окно / иллюминатор. */
  function porthole(cx, cy, r, o) {
    o = o || {}; lit(cx, cy);
    return [{ e: [cx, cy, r + (o.rw || 4), r + (o.rw || 4)], c: o.ring || '#8a6a3a', m: o.rm || 'gold', line: 1 },
      { e: [cx, cy, r, r], c: o.c || WIN, m: 'gem', gloss: 0.6, rim: 0, line: 1, lc: o.lc || WLC, lines: o.cross === false ? [] : [{ p: [[cx - r, cy], [cx + r, cy]], w: 2.2, c: o.lc || WLC, a: 0.8 }, { p: [[cx, cy - r], [cx, cy + r]], w: 2.2, c: o.lc || WLC, a: 0.8 }] }];
  }
  /** Фонарь-огонёк. */
  const lamp = (x, y, r, c) => { lit(x, y); return { e: [x, y, r || 6, r || 6], c: c || WIN, m: 'gem', gloss: 1, line: 1, lc: WLC }; };
  /** Дверь: арочная (или square) из досок, o.ring — обрамление, o.c — цвет досок, o.bands — оковка. */
  function door(cx, base, w, h, o) {
    o = o || {}; const out = [], sq = o.square;
    const shape = (ww, hh) => sq ? box(cx - ww, base - hh, cx + ww, base) : arch(cx, base, ww, hh, o.pointed);
    if (o.ring) out.push({ p: shape(w + (o.rw || 7), h + (o.rw || 7)), c: o.ring, m: o.rm || 'cloth', line: 1 });
    const lines = [{ p: [[cx - w * 0.33, base - h], [cx - w * 0.33, base]], w: 2, a: 0.5 }, { p: [[cx + w * 0.33, base - h], [cx + w * 0.33, base]], w: 2, a: 0.5 }];
    if (o.bands !== false) lines.push({ p: [[cx - w, base - h * 0.28], [cx + w, base - h * 0.28]], w: 3.2, c: o.band || IRON, a: 0.9 }, { p: [[cx - w, base - h * 0.64], [cx + w, base - h * 0.64]], w: 3.2, c: o.band || IRON, a: 0.9 });
    out.push({ p: shape(w, h), c: o.c || '#5a3a22', m: 'wood', flow: -PI / 2, line: 1.2, lines });
    if (o.lamp) out.push(lamp(o.lamp[0], o.lamp[1]));
    return out;
  }
  /** Тёмный проём (пещера, вход без двери). */
  const hole = (cx, base, w, h, c, o) => ({ p: arch(cx, base, w, h, o && o.pointed), c: c || HOLE, m: 'cloth', ao: 1.4, line: 1.1 });
  /** Флажок на древке. */
  function flag(x, y, L, c, o) {
    o = o || {}; const fw = o.fw || L * 0.62, fh = o.fh || L * 0.34, s = o.left ? -1 : 1, top = y - L;
    return [
      { p: tube([[x, y, o.pw || 5], [x, top - 3, (o.pw || 5) * 0.8]]), c: o.pole || '#4a3a2a', m: 'wood', line: 0.7 },
      { p: [P(x + s * 1.5, top, 1), [x + s * fw * 0.45, top + fh * 0.12], P(x + s * fw, top + fh * 0.42, 1), [x + s * fw * 0.5, top + fh * 0.62], P(x + s * 1.5, top + fh, 1)], c, m: 'cloth', line: 0.9, lines: [{ p: [[x + s * fw * 0.15, top + fh * 0.2], [x + s * fw * 0.6, top + fh * 0.38]], w: 1.6, light: true, a: 0.5 }] },
      o.knob === false ? null : { e: [x, top - 4, 4, 4], c: o.knob || GOLD, m: 'gold', line: 0.6 },
    ];
  }
  /** Коническая крыша: основание y, полуширина hw, высота h; m — материал ('fur' для соломы). */
  function cone(cx, y, hw, h, c, o) {
    o = o || {}; const f = o.flare === undefined ? 0.06 : o.flare, L = o.lean || 0, cd = o.cd || tone(c, -0.3);
    const at = (t, s) => [cx + s * hw * (1 - t) + L * t, y - h * t];
    const rows = [];
    if (o.rows !== false) for (const t of [0.22, 0.44, 0.66]) { const [xl, yy] = at(t, -1), xr = at(t, 1)[0]; rows.push({ p: [[xl, yy], [(xl + xr) / 2, yy + hw * (1 - t) * 0.16], [xr, yy]], w: 2.4, c: o.rowC, a: o.rowC ? 0.85 : 0.4 }); }
    const fur = o.m === 'fur';
    return { p: [P(cx - hw, y, 1), [cx - hw * (0.58 - f) + L * 0.42, y - h * 0.42], P(cx + L, y - h, 1), [cx + hw * (0.58 - f) + L * 0.42, y - h * 0.42], P(cx + hw, y, 1), [cx, y + hw * 0.14]], c, m: o.m || 'leather', gloss: 0.3,
      furLen: fur ? (o.furLen || 1.1) : undefined, flow: fur ? PI / 2 : undefined, dens: fur ? 1.2 : undefined, belly: fur ? 0.25 : undefined, line: 1.1,
      sub: [{ p: [P(cx + hw * 0.08 + L, y - h, 1), P(cx + hw * 1.2, y - 2, 1), P(cx + hw * 1.1, y + hw * 0.3, 1), P(cx + hw * 0.2, y + hw * 0.3, 1)], c: cd, m: 'flat', line: 0, op: fur ? 0.5 : undefined }],
      lines: rows };
  }
  /** Купол: основание y, полуширина hw, высота h. */
  function dome(cx, y, hw, h, c, o) {
    o = o || {};
    return { p: [P(cx - hw, y, 1), [cx - hw * 0.96, y - h * 0.5], [cx - hw * 0.62, y - h * 0.9], [cx, y - h], [cx + hw * 0.62, y - h * 0.9], [cx + hw * 0.96, y - h * 0.5], P(cx + hw, y, 1), [cx, y + hw * 0.1]], c, m: o.m || 'steel', gloss: o.gloss || 0.8, line: 1.1,
      sub: [{ p: [[cx + hw * 0.25, y - h * 1.1], [cx + hw * 1.1, y - h * 0.6], [cx + hw * 1.1, y + 6], [cx + hw * 0.4, y + 6]], c: o.cd || tone(c, -0.3), m: 'flat', line: 0 }],
      lines: (o.ribs === false ? [] : [-0.5, 0, 0.5].map(k => ({ p: [[cx + hw * k, y], [cx + hw * k * 0.8, y - h * 0.55], [cx + hw * k * 0.3, y - h * 0.95]], w: 2, a: 0.35 }))).concat([{ p: [[cx - hw * 0.6, y - h * 0.55], [cx - hw * 0.3, y - h * 0.85]], w: 3, light: true, a: 0.6 }]) };
  }
  /** Вальмовая/двускатная крыша-трапеция над x0…x1: низ y, высота h, свес e, срез inset. */
  function hip(x0, x1, y, h, e, inset, c, o) {
    o = o || {}; const rows = [];
    for (let k = 1; k < (o.n || 4); k++) { const yy = y - h * k / (o.n || 4), dx = inset * k / (o.n || 4); rows.push({ p: [[x0 - e + dx, yy], [x1 + e - dx, yy]], w: 2.8, c: o.rowC, a: o.rowC ? 0.8 : 0.45 }); }
    if (o.tiles) for (let x = x0 + 8; x < x1; x += o.tiles) rows.push({ p: [[x, y - 2], [x + (x - (x0 + x1) / 2) * -0.1, y - h + 4]], w: 2, a: 0.3 });
    const fur = o.m === 'fur';
    return { p: [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)], c, m: o.m || 'leather', gloss: 0.25, line: 1.2, lines: rows,
      furLen: fur ? 1 : undefined, flow: fur ? PI / 2 : undefined, dens: fur ? 1.2 : undefined,
      sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.18, y - h - 2, 1), P(x1 + e + 2, y - h - 2, 1), P(x1 + e + 2, y + 2, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.3, y + 2, 1)], c: o.cd || tone(c, -0.3), m: 'flat', line: 0, op: fur ? 0.55 : undefined }] };
  }
  /** Фронтон: треугольник над x0…x1 на высоте y. */
  const gable = (x0, x1, y, h, e) => [P(x0 - e, y, 1), P((x0 + x1) / 2, y - h, 1), P(x1 + e, y, 1)];
  /** Зубчатый парапет. */
  function merlons(x0, x1, y, mh, st, c, o) {
    o = o || {}; const ph = o.ph || 12, pts = [P(x0, y + ph, 1), P(x0, y - mh, 1)];
    const mw = st * (o.k || 0.56), n = Math.max(1, Math.round((x1 - x0 - mw) / st)), s = (x1 - x0 - mw) / n;
    for (let i = 0; i <= n; i++) { const x = x0 + i * s; if (i) pts.push(P(x, y, 1), P(x, y - mh, 1)); pts.push(P(x + mw, y - mh, 1)); if (i < n) pts.push(P(x + mw, y, 1)); }
    pts.push(P(x1, y - mh, 1), P(x1, y + ph, 1));
    return { p: pts, c, m: o.m || 'cloth', line: 1.1, lines: [{ p: [[x0, y + ph - 2], [x1, y + ph - 2]], w: 2.2, a: 0.5 }] };
  }
  /** Волнистый верх (скруглённые зубцы глиняной стены). */
  function scallop(x0, x1, y, h, n, c, o) {
    o = o || {}; const st = (x1 - x0) / n, pts = [P(x0, y + (o.ph || 14), 1)];
    for (let i = 0; i < n; i++) { const x = x0 + i * st; pts.push(P(x, y, 1), [x + st * 0.12, y - h * 0.75], [x + st * 0.5, y - h], [x + st * 0.88, y - h * 0.75]); }
    pts.push(P(x1, y, 1), P(x1, y + (o.ph || 14), 1));
    return { p: pts, c, m: o.m || 'cloth', line: 1.1 };
  }
  /** Ворота-проём с решёткой или створками. */
  function gate(cx, G, w, h, o) {
    o = o || {}; const out = [];
    if (o.ring) out.push({ p: arch(cx, G, w + (o.rw || 10), h + (o.rw || 10), o.pointed), c: o.ring, m: o.rm || 'cloth', line: 1.1 });
    const lines = [];
    if (o.grate) {
      for (let x = cx - w + w / 3; x < cx + w - 2; x += w / 3) lines.push({ p: [[x, G - h], [x, G]], w: 3.4, c: o.grate, a: 0.95 });
      for (let y = G - h + w * 0.6; y < G - 2; y += 16) lines.push({ p: [[cx - w, y], [cx + w, y]], w: 3, c: o.grate, a: 0.95 });
    }
    out.push({ p: arch(cx, G, w, h, o.pointed), c: o.hole || HOLE, m: 'cloth', ao: 1.4, line: 1.1, lines });
    if (o.door) out.push({ p: arch(cx, G, w * 0.94, h * 0.97, o.pointed), c: o.door, m: 'wood', flow: -PI / 2, line: 1.1, lines: [{ p: [[cx, G - h], [cx, G]], w: 2.6, a: 0.8 }, { p: [[cx - w, G - h * 0.35], [cx + w, G - h * 0.35]], w: 3.4, c: IRON, a: 0.9 }, { p: [[cx - w, G - h * 0.7], [cx + w, G - h * 0.7]], w: 3.4, c: IRON, a: 0.9 }] });
    return out;
  }
  /** Череп (o.horns — рогатый). */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || '#e8e0c8', out = [];
    if (o.horns) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * r * 0.7, cy - r * 0.4, r * 0.5], [cx + s * r * 1.5, cy - r * 0.9, r * 0.35], [cx + s * r * 1.9, cy - r * 1.8, r * 0.12]]), c: o.hornC || '#d8ccb0', m: 'horn', line: 0.8 });
    out.push({ p: [[cx - r, cy - r * 0.1], [cx - r * 0.8, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.8, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.6, cy + r * 0.45], [cx + r * 0.45, cy + r * 0.95, 1], [cx - r * 0.45, cy + r * 0.95, 1], [cx - r * 0.6, cy + r * 0.45]], c, m: 'horn', gloss: 0.3, line: 1,
      lines: [{ p: [[cx - r * 0.38, cy - r * 0.05], [cx - r * 0.32, cy + r * 0.05]], w: r * 0.42, c: '#1a1210', a: 1 }, { p: [[cx + r * 0.38, cy - r * 0.05], [cx + r * 0.32, cy + r * 0.05]], w: r * 0.42, c: '#1a1210', a: 1 },
        { p: [[cx, cy + r * 0.25], [cx, cy + r * 0.4]], w: r * 0.16, c: '#1a1210', a: 0.9 }, { p: [[cx - r * 0.3, cy + r * 0.75], [cx + r * 0.3, cy + r * 0.75]], w: r * 0.1, c: '#3a3028', a: 0.8 }] });
    return out;
  }
  /** Язык пламени (основание x, y). */
  function flame(x, y, w, h, o) {
    o = o || {};
    return { p: [P(x - w, y, 1), [x - w * 0.9, y - h * 0.35], [x - w * 0.35, y - h * 0.62], P(x - w * 0.1, y - h, 1), [x + w * 0.3, y - h * 0.62], P(x + w * 0.5, y - h * 0.78, 1), [x + w * 0.9, y - h * 0.35], P(x + w, y, 1)], c: o.c || '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.7, lc: o.lc || '#8a2a0a',
      sub: [{ p: [P(x - w * 0.5, y + 2, 1), [x - w * 0.4, y - h * 0.3], P(x - w * 0.05, y - h * 0.62, 1), [x + w * 0.35, y - h * 0.3], P(x + w * 0.5, y + 2, 1)], c: o.core || '#ffe08a', m: 'flat', line: 0 }] };
  }
  /** Кристалл-призма. */
  function crystal(x, y, w, h, c, lean) {
    const l = (lean || 0) * h;
    return { p: [P(x - w, y, 1), P(x - w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y, 1)], c, m: 'gem', gloss: 1.1, rim: 0.7, line: 0.9,
      sub: [{ p: [P(x + l * 0.5, y + 2, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y + 2, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.3, y - 4], [x - w * 0.3 + l * 0.8, y - h * 0.8]], w: 2.4, light: true, a: 0.7 }] };
  }
  /** Двусторонний кристалл (парящий, острый снизу и сверху). */
  function gemFloat(x, y, w, h, c) {
    return { p: [P(x, y - h, 1), P(x + w, y - h * 0.15, 1), P(x, y + h * 0.7, 1), P(x - w, y - h * 0.15, 1)], c, m: 'gem', gloss: 1.2, rim: 0.8, line: 0.9,
      sub: [{ p: [P(x, y - h - 2, 1), P(x + w + 2, y - h * 0.15, 1), P(x, y + h * 0.72, 1)], c: tone(c, -0.28), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.45, y - h * 0.3], [x - w * 0.1, y - h * 0.8]], w: 2.2, light: true, a: 0.8 }] };
  }
  /** Вода/пруд у основания. */
  function water(x0, x1, y, y1, c, o) {
    o = o || {}; const lines = [];
    for (let i = 0; i < (o.n || 6); i++) { const x = x0 + 8 + (i * 53) % Math.max(10, x1 - x0 - 30), yy = y + 5 + (i * 7) % Math.max(4, y1 - y - 6); lines.push({ p: [[x, yy], [x + 16 + (i % 3) * 6, yy]], w: 2.4, light: true, a: 0.7 }); }
    return { p: [P(x0, y1, 1), [x0 + 4, y + 3], [x0 + (x1 - x0) * 0.3, y], [x0 + (x1 - x0) * 0.7, y + 2], [x1 - 4, y + 3], P(x1, y1, 1), [(x0 + x1) / 2, y1 + 3]], c, m: o.m || 'gem', gloss: 0.4, rim: 0, line: 0.9, lines };
  }
  /** Камень/скала по контуру (материал рога — тусклый блеск). */
  const rock = (pts, c, o) => Object.assign({ p: pts, c, m: 'horn', gloss: 0.15, line: 1.1, belly: 0.3 }, o || {});
  /** Валун-эллипс. */
  const boulder = (x, y, rx, ry, c) => ({ p: ell(x, y - ry, rx, ry, 11), c, m: 'horn', gloss: 0.15, line: 1, belly: 0.3 });
  /** Бочка. */
  function barrel(x, G, w, h, c) {
    return { p: [P(x - w, G, 1), [x - w * 1.12, G - h / 2], P(x - w, G - h, 1), P(x + w, G - h, 1), [x + w * 1.12, G - h / 2], P(x + w, G, 1)], c: c || '#8a5a30', m: 'wood', flow: -PI / 2, line: 1,
      lines: [{ p: [[x - w * 1.05, G - h * 0.24], [x + w * 1.05, G - h * 0.24]], w: 3.4, c: IRON, a: 0.9 }, { p: [[x - w * 1.05, G - h * 0.76], [x + w * 1.05, G - h * 0.76]], w: 3.4, c: IRON, a: 0.9 }] };
  }
  /** Ящик. */
  const crate = (x0, y0, x1, y1, c) => ({ p: box(x0, y0, x1, y1), c: c || '#9a7040', m: 'wood', flow: 0, line: 1, lines: [{ p: [[x0, y0], [x1, y1]], w: 2.6, a: 0.6 }, { p: [[x1, y0], [x0, y1]], w: 2.6, a: 0.6 }] });
  /** Мешок. */
  const sack = (x, G, w, h, c) => ({ p: [[x - w, G], [x - w * 1.1, G - h * 0.5], [x - w * 0.6, G - h * 0.9], [x, G - h], [x + w * 0.6, G - h * 0.9], [x + w * 1.1, G - h * 0.5], [x + w, G]], c: c || '#d8c090', m: 'cloth', line: 1, lines: [{ p: [[x - w * 0.5, G - h * 0.82], [x + w * 0.5, G - h * 0.82]], w: 2.6, c: '#8a6a3a', a: 0.8 }] });
  /** Столб/бревно (вертикальная трубка). */
  const post = (x, y0, y1, w, c, o) => ({ p: tube([[x, y0, w], [x + ((o && o.lean) || 0), y1, w * ((o && o.k) || 0.9)]], { flat0: true }), c: c || '#6a4424', m: 'wood', flow: -PI / 2, line: 1 });
  /** Бревно поперёк (балка). */
  const beam = (x0, y0, x1, y1, w, c) => ({ p: tube([[x0, y0, w], [x1, y1, w]]), c: c || '#5a3a1c', m: 'wood', flow: 0, line: 0.9 });
  /** Комья листвы/мха. */
  function foliage(cx, cy, rx, ry, n, cols, seed, o) {
    o = o || {}; const rnd = rngOf(seed), back = [], front = [];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
      const a = rnd() * PI * 2, rr = Math.sqrt(rnd()) * (layer ? 0.55 : 0.8);
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr - (layer ? ry * 0.12 : 0);
      const r = (layer ? 0.4 : 0.44) * Math.min(rx, ry) * (0.8 + rnd() * 0.4);
      (layer ? front : back).push({ p: ell(x, y, r * 1.12, r, 9, rnd() * 0.6), c: layer ? cols[1 + ((rnd() * (cols.length - 1)) | 0)] : cols[0], m: 'feather', texSize: o.leaf || 0.7, flow: PI * 0.5, line: layer ? 0.6 : 0.8, ao: 0.8 });
    }
    return back.concat(front);
  }
  /** Частокол из заострённых брёвен. */
  function palisade(x0, x1, top, G, st, c, o) {
    o = o || {}; const pts = [P(x0, G, 1)], lines = [];
    let i = 0;
    for (let x = x0; x < x1 - st * 0.5; x += st, i++) {
      const t = top + (i % 3 === 1 ? 10 : i % 3 === 2 ? 4 : 0);
      pts.push(P(x + 1, t + st * 0.9, 1), P(x + st / 2, t, 1), P(x + st - 1, t + st * 0.9, 1));
      if (x > x0) lines.push({ p: [[x, t + st * 0.9], [x, G]], w: 2.6, a: 0.55 });
    }
    pts.push(P(x1, G, 1));
    if (o.bands) for (const y of o.bands) lines.push({ p: [[x0, y], [x1, y]], w: 6, c: o.bandC || '#4a3420', a: 0.9 });
    return { p: pts, c, m: 'wood', flow: -PI / 2, line: 1.1, lines, belly: 0.3 };
  }

  /* ============================== ЦИТАДЕЛЬ ==============================
     Глиняные башни с волнистым верхом и сквозными брёвнами, бревенчатые дома
     под шкурами и соломой, шатры, черепа на кольях, бивни, орочьи тотемы. */
  {
    const F = 'stronghold';
    const CLAY = '#c27a48', LOG = '#7e5430', LOGD = '#5a3a1c', HIDE = '#c8a06a', FUR = '#a07a44', BONE = '#ece2c6', RED = '#b02e24', STONE = '#8e8474', THATCH = '#bc9a58';
    /** Глиняная башня: сужается кверху, брёвна насквозь (beams), волнистый верх. */
    function clayT(cx, G, hw, h, o) {
      o = o || {}; const c = o.c || CLAY, top = G - h, tw = hw * (o.taper || 0.84), out = [];
      const lines = [{ p: [[cx - hw * 0.5, top + 24], [cx - hw * 0.36, top + 54], [cx - hw * 0.52, top + 84]], w: 2.2, a: 0.35 }, { p: [[cx + hw * 0.1, G - 30], [cx + hw * 0.22, G - 70], [cx + hw * 0.12, G - 96]], w: 2, a: 0.3 },
        { p: [[cx - hw, G - 14], [cx + hw, G - 14]], w: 10, c: tone(c, -0.25), a: 0.5 }];
      out.push({ p: [P(cx - hw, G, 1), [cx - hw * 0.99, G - h * 0.5], P(cx - tw, top, 1), P(cx + tw, top, 1), [cx + hw * 0.99, G - h * 0.5], P(cx + hw, G, 1)], c, m: 'cloth', line: 1.2, belly: 0.25, lines,
        sub: [{ p: [P(cx + tw * 0.3, top - 4, 1), P(cx + hw + 6, top - 4, 1), P(cx + hw + 6, G + 4, 1), P(cx + hw * 0.4, G + 4, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }] });
      for (const y of o.beams || []) out.push(beam(cx - hw - 14, y, cx + hw + 14, y, 9, LOGD));
      if (o.top !== 'none') out.push(scallop(cx - tw - 7, cx + tw + 7, top, 18, Math.max(2, Math.round(tw / 20)), tone(c, 0.08), { ph: 16 }));
      return out;
    }
    /** Бревенчатая стена с угловыми столбами. */
    function logs(x0, y0, x1, y1, o) {
      o = o || {}; const c = o.c || LOG, st = o.st || 20, lines = [];
      for (let y = y0 + st; y < y1 - 2; y += st) lines.push({ p: [[x0, y], [x1, y]], w: 3, a: 0.6 });
      return [{ p: box(x0, y0, x1, y1), c, m: 'wood', flow: 0, line: 1.2, lines, belly: 0.2, sub: [shadeR(x1 - (x1 - x0) * 0.2, y0 - 2, x1 + 2, y1 + 2, tone(c, -0.35))] },
        post(x0, y1, y0 - 10, 16, LOGD), post(x1, y1, y0 - 10, 16, LOGD)];
    }
    /** Крыша из шкур/соломы (скруглённый конёк), перехвачена верёвками. */
    function furRoof(x0, x1, y, h, e, c) {
      const cx = (x0 + x1) / 2, w = x1 - x0;
      return { p: [P(x0 - e, y + 8, 1), [x0 - e * 0.4, y - h * 0.35], [x0 + w * 0.2, y - h * 0.82], [cx, y - h], [x1 - w * 0.2, y - h * 0.82], [x1 + e * 0.4, y - h * 0.35], P(x1 + e, y + 8, 1), [cx, y + 14]], c: c || FUR, m: 'fur', furLen: 1.2, flow: PI / 2, dens: 1.1, line: 1.2, belly: 0.3,
        lines: [{ p: [[x0 - e * 0.6, y - h * 0.2], [cx, y - h * 0.2 + 10], [x1 + e * 0.6, y - h * 0.2]], w: 5, c: '#4a3018', a: 0.8 }, { p: [[x0 + w * 0.06, y - h * 0.62], [cx, y - h * 0.62 + 8], [x1 - w * 0.06, y - h * 0.62]], w: 5, c: '#4a3018', a: 0.8 }],
        sub: [{ p: [[cx + w * 0.15, y - h - 4], [x1 + e + 4, y - h * 0.3], [x1 + e + 4, y + 16], [cx + w * 0.25, y + 16]], c: tone(c || FUR, -0.3), m: 'flat', line: 0, op: 0.55 }] };
    }
    /** Скрещённые брёвна на коньке. */
    const ridgeX = (cx, y, L) => [beam(cx - L * 0.2, y + L * 0.5, cx + L * 0.5, y - L * 0.4, 9, LOGD), beam(cx + L * 0.2, y + L * 0.5, cx - L * 0.5, y - L * 0.4, 9, LOGD)];
    /** Бивень: от основания (x, y) вверх, выгибаясь наружу (s) и обратно. */
    const tusk = (x, y, s, L) => ({ p: tube([[x, y, L * 0.15], [x + s * L * 0.34, y - L * 0.45, L * 0.12], [x + s * L * 0.14, y - L * 0.86, L * 0.07], [x - s * L * 0.14, y - L, L * 0.015]]), c: BONE, m: 'horn', gloss: 0.6, line: 1,
      lines: [{ p: [[x - s * 3, y - 8], [x + s * L * 0.3, y - L * 0.45]], w: 2, light: true, a: 0.5 }] });
    /** Череп на колу. */
    const stakeSkull = (x, G, h, r) => [post(x, G, G - h, 8, '#5a3a1c'), ...skull(x, G - h - r * 0.5, r)];
    /** Шатёр из шкур. */
    function tent(cx, G, hw, h, c, stripe, noDoor) {
      return [
        beam(cx - 16, G - h + 20, cx + 12, G - h - 26, 6, LOGD), beam(cx + 16, G - h + 20, cx - 10, G - h - 24, 6, LOGD),
        { p: [P(cx - hw, G, 1), [cx - hw * 0.55, G - h * 0.5], P(cx, G - h, 1), [cx + hw * 0.55, G - h * 0.5], P(cx + hw, G, 1), [cx, G + 6]], c, m: 'leather', line: 1.1,
          sub: [{ p: [P(cx + 4, G - h, 1), P(cx + hw * 1.2, G + 4, 1), P(cx + hw * 0.3, G + 8, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
          lines: [0.35, 0.7].map(t => ({ p: [[cx - hw * t, G - h * (1 - t)], [cx, G - h * (1 - t) + 6], [cx + hw * t, G - h * (1 - t)]], w: 6, c: stripe, a: 0.9 })).concat([{ p: [[cx - hw * 0.2, G - h * 0.4], [cx - hw * 0.3, G - h * 0.15]], w: 2, a: 0.5 }]) },
        noDoor ? null : { p: [P(cx - hw * 0.26, G, 1), P(cx, G - h * 0.42, 1), P(cx + hw * 0.26, G, 1)], c: '#2a1a10', m: 'cloth', line: 0.9 },
      ];
    }
    /** Орочий тотем: столб, резная личина, красные крылья-перекладина, рогатый череп. */
    function totem(x, G, h) {
      const top = G - h;
      return [post(x, G, top + 10, 20, LOG),
        { p: box(x - 17, top + 30, x + 17, top + 70), c: '#9a6a3a', m: 'wood', line: 1, lines: [{ p: [[x - 9, top + 44], [x - 4, top + 44]], w: 5, c: '#1a1210', a: 1 }, { p: [[x + 4, top + 44], [x + 9, top + 44]], w: 5, c: '#1a1210', a: 1 }, { p: [[x - 9, top + 60], [x + 9, top + 60]], w: 3.4, c: RED, a: 0.9 }] },
        { p: [P(x - 40, top + 22, 1), [x - 14, top + 12], [x + 14, top + 12], P(x + 40, top + 22, 1), P(x + 30, top + 30, 1), P(x - 30, top + 30, 1)], c: RED, m: 'leather', line: 1 },
        skull(x, top + 2, 13, { horns: true })];
    }
    /** Факел на столбе. */
    const torch = (x, G, h) => { lit(x, G - h - 12); return [post(x, G, G - h, 7, LOGD), flame(x, G - h + 2, 9, 30)]; };
    /** Каменная кладка из валунов (штрихи). */
    const rubble = (x0, y0, x1, y1) => masonry(x0, y0, x1, y1, 26, 36, 0.5, 2.6);

    /* ---------- ратуша: бревенчатый дом вождя → глиняная крепость ---------- */
    bd('hall_1', F, (cx, g) => [
      stakeSkull(34, g, 96, 13), stakeSkull(388, g, 96, 13),
      logs(74, 226, 346, g), furRoof(74, 346, 232, 118, 26), ridgeX(cx, 116, 60),
      door(cx, g, 26, 86, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10', lamp: [cx + 44, g - 70] }),
      skull(cx, 248, 17, { horns: true }),
      sqwin(126, 292, 13, 15, { frame: LOGD }), sqwin(294, 292, 13, 15, { frame: LOGD }),
      { p: [P(98, 236, 1), P(132, 236, 1), P(132, 268, 1), P(115, 260, 1), P(98, 268, 1)], c: RED, m: 'cloth', line: 1 },
    ]);
    bd('hall_2', F, (cx, g) => [
      clayT(388, g, 50, 318, { beams: [190, 300] }), flag(388, 108, 60, RED, { fw: 40, fh: 22 }),
      sqwin(388, 164, 11, 14, { frame: LOGD }), sqwin(388, 250, 11, 14, { frame: LOGD }),
      stakeSkull(22, g, 110, 13),
      logs(52, 280, 334, g), furRoof(52, 334, 286, 126, 26), ridgeX(193, 166, 64),
      door(193, g, 28, 94, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10', lamp: [240, g - 76] }),
      skull(193, 304, 18, { horns: true }),
      sqwin(100, 350, 14, 16, { frame: LOGD }), sqwin(288, 350, 14, 16, { frame: LOGD }),
    ]);
    bd('hall_3', F, (cx, g) => [
      clayT(58, g, 48, 330, { beams: [220, 330] }), cone(58, 132, 58, 84, HIDE, { rowC: '#8a4a2a' }),
      clayT(462, g, 48, 330, { beams: [220, 330] }), cone(462, 132, 58, 84, HIDE, { rowC: '#8a4a2a' }), flag(462, 50, 50, RED, { fw: 36, fh: 20 }),
      sqwin(58, 180, 11, 14, { frame: LOGD }), sqwin(462, 180, 11, 14, { frame: LOGD }), sqwin(58, 280, 11, 14, { frame: LOGD }), sqwin(462, 280, 11, 14, { frame: LOGD }),
      logs(112, 286, 408, g), furRoof(112, 408, 292, 140, 28), ridgeX(cx, 158, 70),
      sqwin(160, 360, 14, 16, { frame: LOGD }), sqwin(360, 360, 14, 16, { frame: LOGD }),
      tusk(cx - 54, g, -1, 150), tusk(cx + 54, g, 1, 150),
      door(cx, g, 32, 104, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10' }),
      skull(cx, 300, 24, { horns: true }),
      stakeSkull(130, g, 70, 11), stakeSkull(390, g, 70, 11),
    ]);
    bd('hall_4', F, (cx, g) => {
      const out = [];
      for (const x of [64, 496]) out.push(clayT(x, g, 54, 430, { beams: [240, 360, 470] }), cone(x, 142, 64, 96, HIDE, { rowC: '#8a4a2a' }), sqwin(x, 200, 11, 14, { frame: LOGD }), sqwin(x, 300, 11, 14, { frame: LOGD }), sqwin(x, 420, 11, 14, { frame: LOGD }));
      out.push(flag(64, 48, 56, RED, { fw: 38, fh: 22, left: true }), flag(496, 48, 56, RED, { fw: 38, fh: 22 }));
      // верхний ярус под шкурами
      out.push(clayT(cx, 312, 100, 150, { beams: [226] }), tent(cx, 170, 118, 118, HIDE, '#8a4a2a', true), flag(cx, 54, 50, RED, { fw: 34, fh: 20 }));
      out.push(sqwin(cx - 56, 260, 12, 15, { frame: LOGD }), sqwin(cx + 56, 260, 12, 15, { frame: LOGD }));
      // нижний ярус
      out.push(clayT(cx, g, 156, 262, { beams: [372] }));
      out.push(skull(cx, 250, 30, { horns: true }));
      for (const x of [cx - 104, cx + 104]) out.push(sqwin(x, 420, 13, 16, { frame: LOGD }), sqwin(x, 500, 13, 16, { frame: LOGD }));
      // знамёна
      for (const x of [cx - 58, cx + 58]) out.push({ p: [P(x - 16, 334, 1), P(x + 16, 334, 1), P(x + 16, 420, 1), P(x, 406, 1), P(x - 16, 420, 1)], c: RED, m: 'cloth', line: 1, lines: [{ p: [[x - 9, 350], [x + 9, 376]], w: 4.5, c: BONE, a: 0.95 }, { p: [[x + 9, 350], [x - 9, 376]], w: 4.5, c: BONE, a: 0.95 }] });
      out.push(tusk(cx - 64, g, -1, 190), tusk(cx + 64, g, 1, 190));
      out.push(door(cx, g, 40, 130, { ring: LOGD, c: '#4a2c16', band: '#2a1a10', lamp: [cx, g - 150] }));
      out.push(stakeSkull(150, g, 70, 11), stakeSkull(410, g, 70, 11));
      return out;
    });

    /* ---------- гильдия магов: глиняная башня ярусами, шаманский верх со сферой ---------- */
    for (let L = 1; L <= 4; L++) bd('guild_' + L, F, (cx, g) => {
      const top = 196, floors = L + 1, out = [], fh = (g - 36 - top) / floors;
      out.push(rock([P(cx - 88, g, 1), [cx - 84, g - 26], [cx - 40, g - 40], [cx + 40, g - 40], [cx + 86, g - 24], P(cx + 90, g, 1)], STONE, { lines: [{ p: [[cx - 50, g - 38], [cx - 40, g]], w: 2, a: 0.4 }, { p: [[cx + 30, g - 38], [cx + 36, g]], w: 2, a: 0.4 }] }));
      const beams = []; for (let i = 1; i < floors; i++) beams.push(g - 36 - i * fh);
      out.push(clayT(cx, g - 34, 66, g - 34 - top, { beams, top: 'none', taper: 0.74 }));
      for (let i = 0; i < floors; i++) {
        const y = g - 36 - i * fh - fh * 0.3, dx = i === 0 ? 0 : (i % 2 ? -18 : 18);
        if (i === 0) out.push(door(cx, g - 36, 22, Math.min(80, fh * 0.7), { ring: LOGD, c: '#4a2c16' }));
        else out.push(win(cx + dx, y, 11, Math.min(44, fh * 0.46), { c: '#9ad8ff', lc: '#1a3a5a', ring: LOGD }));
      }
      // руны-полосы шамана
      out.push({ p: tube([[cx - 40, top + 30, 5], [cx, top + 40, 5], [cx + 40, top + 30, 5]]), c: RED, m: 'leather', line: 0.6 });
      // верх: настил, шкуры, рога и сфера в костяной лапе
      out.push(beam(cx - 70, top + 2, cx + 70, top + 2, 12, LOGD));
      out.push(tusk(cx - 56, top + 4, -1, 70), tusk(cx + 56, top + 4, 1, 70));
      out.push(cone(cx, top - 2, 64, 78, HIDE, { rowC: '#8a4a2a' }));
      out.push({ p: tube([[cx, top - 76, 8], [cx, top - 104, 6]]), c: BONE, m: 'horn', line: 0.8 });
      for (const s of [-1, 1]) out.push({ p: tube([[cx, top - 100, 5], [cx + s * 16, top - 112, 4], [cx + s * 12, top - 132, 2.5]]), c: BONE, m: 'horn', line: 0.8 });
      out.push({ e: [cx, top - 124, 15, 15], c: '#c890ff', m: 'gem', gloss: 1.2, line: 1, lc: '#4a1a6a', glint: [[cx - 5, top - 129, 5]] });
      for (let k = 0; k < L; k++) out.push({ p: tube([[cx - 60 + k * 40, top + 18, 3], [cx - 64 + k * 40, top + 52, 2]]), c: '#d8c89a', m: 'cloth', line: 0.5 }, { p: ell(cx - 64 + k * 40, top + 56, 5, 7, 8), c: ['#3aa0e0', '#e04a3a', '#5ac04a', '#e0c03a'][k], m: 'feather', line: 0.6 });
      lit(cx, top - 124);
      return out;
    });

    /* ---------- таверна: бревенчатый дом под шкурами, кружка на шесте ---------- */
    bd('tavern', F, (cx, g) => [
      rock([P(78, 190, 1), [74, 120], [86, 60], [110, 42], [134, 60], [142, 120], P(140, 190, 1)], STONE, { lines: rubble(74, 42, 142, 190) }),
      { p: box(92, 30, 128, 48), c: '#3a3028', m: 'horn', line: 1 },
      logs(46, 190, 302, g), furRoof(46, 302, 196, 112, 24), ridgeX(174, 90, 54),
      door(196, g, 26, 90, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10', lamp: [236, g - 72] }),
      sqwin(104, 252, 15, 16, { shutters: LOGD, frame: LOGD }), sqwin(276, 252, 12, 16, { frame: LOGD }),
      // вывеска: шест с доской и кружкой
      post(336, g, 150, 10, LOGD), beam(300, 168, 346, 168, 7, LOGD),
      { p: box(302, 178, 346, 222), c: '#9a6a3a', m: 'wood', flow: 0, line: 1.1, sub: [{ p: box(314, 188, 332, 214), c: GOLD, m: 'gold', line: 0.8 }, { e: [336, 200, 5, 8], c: '#9a6a3a', m: 'flat', line: 0 }, { p: box(312, 184, 334, 192), c: '#f4ecd8', m: 'flat', line: 0 }] },
      barrel(28, g, 20, 50), barrel(70, g, 18, 44, '#7a4a28'), skull(308, 132, 11, { horns: true }),
    ]);

    /* ---------- кузница: горн под навесом из шкур, каменная труба, наковальня ---------- */
    bd('blacksmith', F, (cx, g) => [
      rock([P(236, 250, 1), [230, 160], [238, 60], [256, 34], [284, 34], [298, 60], [304, 160], P(300, 250, 1)], STONE, { lines: rubble(230, 34, 304, 250) }),
      { p: box(242, 22, 298, 40), c: '#3a3028', m: 'horn', line: 1 },
      clayT(252, g, 70, 150, { beams: [270] }),
      door(262, g, 22, 80, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10' }), sqwin(214, 272, 10, 12, { frame: LOGD }),
      // навес на столбах
      post(26, g, 176, 12, LOGD), post(160, g, 164, 12, LOGD),
      { p: [P(0, 196, 1), [80, 172], P(180, 150, 1), P(186, 176, 1), [168, 186], [148, 178], [128, 190], [108, 182], [86, 196], [64, 188], [42, 202], [20, 194], P(-2, 212, 1)], c: HIDE, m: 'leather', line: 1.1, lines: [{ p: [[4, 200], [180, 158]], w: 5, c: '#8a4a2a', a: 0.8 }] },
      // горн: каменный очаг с огнём
      rock([P(40, g, 1), [38, g - 50], [60, g - 70], [120, g - 70], [142, g - 50], P(140, g, 1)], STONE, { lines: rubble(38, g - 70, 142, g) }),
      { p: arch(90, g - 10, 30, 46), c: '#2a1208', m: 'cloth', ao: 1.2, line: 1 },
      flame(90, g - 14, 24, 52), lamp(90, g - 30, 5, '#ffb040'),
      // топор-вывеска и наковальня
      { p: tube([[160, 210, 5], [160, 262, 5]]), c: LOG, m: 'wood', line: 0.7 }, { p: [P(160, 212, 1), [176, 200], P(190, 212, 1), [194, 230], P(186, 248, 1), [174, 238], P(160, 236, 1)], c: '#b7c0ca', m: 'steel', line: 1 },
      { p: [P(150, g - 44, 1), P(204, g - 44, 1), [216, g - 38], P(198, g - 30, 1), P(192, g - 14, 1), P(202, g, 1), P(158, g, 1), P(166, g - 14, 1), P(160, g - 30, 1)], c: '#4a4a52', m: 'steel', line: 1 },
    ]);

    /* ---------- рынок: шатры и прилавок под полосатым навесом, тотем с монетой ---------- */
    bd('market', F, (cx, g) => {
      const out = [];
      out.push(post(cx, g - 40, 56, 14, LOG), { e: [cx, 40, 24, 24], c: GOLD, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(cx, 40, 16, 16, 12).concat([[cx + 16, 40]]), w: 3, c: '#8a6a20', a: 0.8 }], sub: [{ p: box(cx - 5, 35, cx + 5, 45), c: '#6a4a10', m: 'flat', line: 0 }] });
      out.push(tent(66, g, 64, 150, HIDE, '#8a4a2a'), tent(340, g, 64, 150, '#b88a58', RED));
      // прилавок
      out.push(post(126, g, 100, 11, LOGD), post(280, g, 100, 11, LOGD));
      const stripes = []; for (let x = 118; x < 290; x += 28) stripes.push({ p: box(x, 90, x + 14, 136), c: '#e8d8b0', m: 'flat', line: 0 });
      out.push({ p: [P(112, 92, 1), P(294, 92, 1), P(302, 128, 1), [284, 136], [264, 128], [244, 136], [224, 128], [203, 136], [182, 128], [162, 136], [142, 128], [122, 136], P(104, 128, 1)], c: RED, m: 'cloth', line: 1.1, sub: stripes });
      out.push({ p: box(118, g - 56, 288, g), c: LOG, m: 'wood', flow: 0, line: 1.1, lines: planks(118, g - 56, 288, g, 18, false, 0.5), sub: [shadeR(254, g - 58, 290, g + 2, LOGD)] });
      out.push(lamp(203, 150));
      // товары: горшки, шкура, мясо
      out.push({ p: ell(146, g - 66, 14, 12, 10), c: '#b8683a', m: 'skin', line: 1 }, { p: ell(174, g - 64, 11, 10, 10), c: '#8a5a3a', m: 'skin', line: 1 });
      out.push({ p: [[206, g - 56], [200, g - 78], [214, g - 88], [232, g - 88], [248, g - 76], [240, g - 56]], c: '#c8a878', m: 'fur', furLen: 0.8, line: 1 });
      out.push({ p: ell(268, g - 66, 13, 11, 10), c: '#e0a040', m: 'skin', line: 1 });
      out.push(sack(20, g, 18, 38), stakeSkull(386, g, 80, 10));
      return out;
    });

    /* ---------- хранилище: глиняный амбар-кувшин под соломой, сарай, мешки ---------- */
    bd('silo', F, (cx, g) => [
      logs(10, 270, 96, g), furRoof(10, 96, 276, 64, 14, THATCH),
      { p: [P(92, g, 1), [70, g - 90], [80, g - 200], P(116, 150, 1), P(236, 150, 1), [262, g - 200], [272, g - 90], P(250, g, 1), [171, g + 6]], c: CLAY, m: 'cloth', line: 1.2, belly: 0.3,
        lines: [{ p: [[74, g - 60], [171, g - 48], [268, g - 60]], w: 7, c: LOGD, a: 0.85 }, { p: [[76, g - 170], [171, g - 158], [266, g - 170]], w: 7, c: LOGD, a: 0.85 }, { p: [[110, 190], [100, 240], [112, 290]], w: 2, a: 0.35 }],
        sub: [{ p: [P(190, 140, 1), P(290, 140, 1), P(290, g + 8, 1), P(206, g + 8, 1)], c: tone(CLAY, -0.3), m: 'flat', line: 0 }] },
      cone(176, 156, 92, 118, THATCH, { m: 'fur', rowC: '#7a6030' }), { p: tube([[176, 44, 6], [176, 20, 4]]), c: LOGD, m: 'wood', line: 0.6 },
      door(171, g, 24, 72, { ring: LOGD, c: '#4a2c16', band: '#2a1a10', lamp: [212, g - 60] }), sqwin(171, 220, 10, 12, { frame: LOGD }),
      beam(244, g, 290, 190, 6, '#8a6038'), beam(262, g, 308, 190, 6, '#8a6038'),
      sack(282, g, 18, 40), sack(306, g, 14, 30, '#cbb080'), { p: ell(46, g - 14, 16, 14, 10), c: '#b8683a', m: 'skin', line: 1 },
    ]);

    /* ---------- Зал Валгаллы: бревенчатый чертог, рогатый череп на фронтоне, жаровни ---------- */
    bd('special', F, (cx, g) => [
      logs(34, 150, 246, g),
      { p: gable(34, 246, 160, 110, 18), c: LOG, m: 'wood', flow: 0, line: 1.2, lines: planks(20, 60, 260, 160, 18, false, 0.5), sub: [{ p: [P(cx + 6, 40, 1), P(270, 170, 1), P(cx + 30, 170, 1)], c: LOGD, m: 'flat', line: 0 }] },
      beam(8, 172, cx + 18, 44, 11, LOGD), beam(272, 172, cx - 18, 44, 11, LOGD),
      { p: tube([[cx - 60, 160, 6], [cx + 50, 60, 5]]), c: LOG, m: 'wood', line: 0.7 }, { p: tube([[cx + 60, 160, 6], [cx - 50, 60, 5]]), c: LOG, m: 'wood', line: 0.7 },
      { p: [P(cx + 36, 60, 1), [cx + 62, 52], P(cx + 72, 80, 1), [cx + 56, 82], P(cx + 44, 72, 1)], c: '#b7c0ca', m: 'steel', line: 1 }, { p: [P(cx - 36, 60, 1), [cx - 62, 52], P(cx - 72, 80, 1), [cx - 56, 82], P(cx - 44, 72, 1)], c: '#b7c0ca', m: 'steel', line: 1 },
      skull(cx, 112, 24, { horns: true, c: '#f0e8d0' }),
      { e: [72, 196, 20, 20], c: GOLD, m: 'gold', line: 1, lines: [{ p: [[52, 196], [92, 196]], w: 3, c: '#6a4a10', a: 0.8 }] }, { e: [208, 196, 20, 20], c: GOLD, m: 'gold', line: 1, lines: [{ p: [[208, 176], [208, 216]], w: 3, c: '#6a4a10', a: 0.8 }] },
      door(cx, g, 34, 92, { ring: GOLD, rm: 'gold', c: '#4a2c16', band: GOLD }),
      post(14, g, g - 70, 10, LOGD), { p: [P(-6, g - 80, 1), P(34, g - 80, 1), [26, g - 64], P(2, g - 64, 1)], c: IRON, m: 'steel', line: 1 }, flame(14, g - 78, 16, 40),
      post(266, g, g - 70, 10, LOGD), { p: [P(246, g - 80, 1), P(286, g - 80, 1), [278, g - 64], P(254, g - 64, 1)], c: IRON, m: 'steel', line: 1 }, flame(266, g - 78, 16, 40),
      (lit(14, g - 96), lit(266, g - 96), null),
    ]);

    /* ---------- жилища ---------- */
    // 1. Казармы гоблинов: шатёр из латаных шкур и дощатая пристройка
    bd('dwell_1', F, (cx, g) => [
      { p: box(150, 150, 246, g), c: '#8a6a44', m: 'wood', flow: -PI / 2, line: 1.1, lines: planks(150, 150, 246, g, 16, true, 0.5), sub: [shadeR(222, 148, 248, g + 2, '#5a4028')] },
      { p: [P(140, 160, 1), P(256, 132, 1), P(258, 150, 1), P(142, 178, 1)], c: '#6a5a3a', m: 'wood', flow: 0, line: 1 },
      sqwin(206, 196, 11, 12, { cross: false, frame: LOGD }),
      tent(96, g, 88, 170, '#a8845a', '#5a7a2a'),
      { p: box(60, 150, 84, 178), c: '#7a8a4a', m: 'cloth', line: 0.8 }, { p: box(110, 190, 132, 214), c: '#9a5a3a', m: 'cloth', line: 0.8 },
      flag(146, 84, 50, '#6a9a2a', { fw: 30, fh: 18, knob: false }),
      { p: tube([[240, g, 5], [252, 120, 4]]), c: LOG, m: 'wood', line: 0.6 }, { p: [P(246, 124, 1), P(252, 100, 1), P(258, 124, 1)], c: '#b7c0ca', m: 'steel', line: 0.8 },
      lamp(172, g - 40, 5),
    ]);
    // 2. Волчье логово: каменная нора, волчий череп, частокол
    bd('dwell_2', F, (cx, g) => [
      rock([P(6, g, 1), [20, 180], [70, 110], [140, 80], [210, 96], [270, 150], [300, 210], P(308, g, 1)], STONE, { lines: [{ p: [[80, 130], [100, 190]], w: 2.4, a: 0.4 }, { p: [[230, 140], [250, 200]], w: 2.4, a: 0.4 }] }),
      foliage(70, 110, 50, 20, 3, ['#5a6a2a', '#6a7a32', '#7a8a3a'], 3, { leaf: 0.5 }),
      hole(cx, g, 50, 112, '#140e0a'),
      { p: [P(cx - 20, 150, 1), [cx - 26, 132], P(cx - 18, 110, 1), [cx, 124], P(cx + 18, 110, 1), [cx + 26, 132], P(cx + 20, 150, 1), P(cx + 8, 186, 1), P(cx - 8, 186, 1)], c: BONE, m: 'horn', line: 1,
        lines: [{ p: [[cx - 12, 142], [cx - 6, 146]], w: 6, c: '#1a1210', a: 1 }, { p: [[cx + 12, 142], [cx + 6, 146]], w: 6, c: '#1a1210', a: 1 }, { p: [[cx - 4, 182], [cx + 4, 182]], w: 4, c: '#1a1210', a: 0.9 }] },
      { p: [P(cx - 22, 124, 1), P(cx - 30, 92, 1), P(cx - 8, 112, 1)], c: '#d8ccb0', m: 'horn', line: 0.9 }, { p: [P(cx + 22, 124, 1), P(cx + 30, 92, 1), P(cx + 8, 112, 1)], c: '#d8ccb0', m: 'horn', line: 0.9 },
      { p: [P(cx - 9, 184, 1), P(cx - 5, 184, 1), P(cx - 7, 198, 1)], c: '#f4eedc', m: 'horn', line: 0.6 }, { p: [P(cx + 5, 184, 1), P(cx + 9, 184, 1), P(cx + 7, 198, 1)], c: '#f4eedc', m: 'horn', line: 0.6 },
      palisade(0, 86, 180, g, 18, LOG, { bands: [236] }), palisade(228, 313, 180, g, 18, LOG, { bands: [236] }),
      torch(96, g, 70), torch(220, g, 70),
      { p: tube([[130, g - 4, 5], [160, g - 10, 5]]), c: BONE, m: 'horn', line: 0.6 },
    ]);
    // 3. Башня орков: глиняная башня с навесом и тотемом
    bd('dwell_3', F, (cx, g) => [
      logs(28, 180, 110, g), { p: [P(18, 190, 1), P(120, 160, 1), P(124, 176, 1), P(20, 206, 1)], c: HIDE, m: 'leather', line: 1 },
      clayT(cx + 16, g, 62, 206, { beams: [150, 230] }),
      tent(cx + 16, 100, 80, 70, HIDE, '#8a4a2a', true),
      sqwin(cx + 16, 190, 12, 15, { frame: LOGD }), door(cx + 16, g, 24, 70, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10' }),
      skull(cx + 16, 114, 14, { horns: true }),
      totem(318, g, 190),
      sqwin(68, 234, 11, 13, { frame: LOGD }),
    ]);
    // 4. Форт огров: тяжёлый каменный сруб, колья поверху, дубина
    bd('dwell_4', F, (cx, g) => [
      palisade(28, 312, 80, 150, 22, LOG),
      rock([P(24, g, 1), P(28, 130, 1), [100, 122], [200, 126], P(312, 130, 1), P(316, g, 1)], STONE, { lines: rubble(24, 124, 316, g), sub: [shadeR(262, 120, 320, g + 2, '#5e564a')] }),
      beam(10, 136, 330, 136, 14, LOGD),
      door(cx, g, 38, 110, { ring: LOGD, c: '#4a2c16', band: '#2a1a10' }), skull(cx, 164, 18, { horns: true }),
      sqwin(76, 200, 13, 15, { frame: LOGD }), sqwin(264, 200, 13, 15, { frame: LOGD }),
      { p: tube([[250, g, 12], [274, 170, 22], [284, 146, 26]]), c: '#8a6038', m: 'wood', line: 1 },
      ...[[268, 190], [282, 166], [262, 214]].map(([x, y]) => ({ p: [P(x - 6, y - 4, 1), P(x + 18, y - 2, 1), P(x - 4, y + 6, 1)], c: '#c8c0b0', m: 'horn', line: 0.8 })),
      boulder(30, g, 24, 16, STONE),
    ]);
    // 5. Гнездо на утёсе: скальный столп, огромное гнездо, яйцо
    bd('dwell_5', F, (cx, g) => [
      rock([P(80, g, 1), [110, 320], [140, 230], [150, 170], P(160, 120, 1), P(252, 120, 1), [262, 180], [276, 260], [310, 340], P(330, g, 1)], '#9a8a70',
        { lines: [{ p: [[150, 190], [160, 260], [146, 330]], w: 2.6, a: 0.45 }, { p: [[240, 180], [256, 260]], w: 2.4, a: 0.4 }, { p: [[110, 300], [200, 290]], w: 2.2, a: 0.35 }], sub: [shadeR(250, 140, 350, g + 4, '#6a5c48')] }),
      hole(206, g, 36, 80, '#140e0a'), torch(160, g, 60),
      { p: ell(206, 128, 124, 34, 16), c: '#7a5a34', m: 'wood', flow: 0.2, line: 1.2, lines: [-0.8, -0.4, 0, 0.4, 0.8].map(k => ({ p: [[206 + k * 120 - 30, 114 + Math.abs(k) * 8], [206 + k * 120 + 36, 136 + Math.abs(k) * 6]], w: 4, c: '#4a3018', a: 0.7 })).concat([{ p: [[96, 122], [316, 122]], w: 4, c: '#9a7a4a', a: 0.7 }]) },
      { p: ell(184, 102, 26, 32, 12), c: '#e8e2d0', m: 'skin', line: 1, glint: [[176, 88, 6]], lines: [{ p: [[176, 96], [184, 92]], w: 3, c: '#8a7a5a', a: 0.6 }] },
      { p: ell(230, 108, 20, 24, 12), c: '#d8d0b8', m: 'skin', line: 1 },
      ...[[100, 114, -2.4], [312, 114, -0.7], [140, 96, -1.9], [280, 92, -1.2]].map(([x, y, a]) => { const l = K.leaf([x, y], a, 44, 12); return { p: l.body, c: '#b86a3a', m: 'feather', line: 0.8 }; }),
      boulder(56, g, 26, 18, '#8a7a60'), boulder(360, g, 22, 16, '#8a7a60'),
    ]);
    // 6. Пещера циклопов: скала с пастью, высеченный глаз
    bd('dwell_6', F, (cx, g) => [
      rock([P(10, g, 1), [16, 300], [50, 200], [110, 120], [190, 84], [270, 88], [340, 130], [400, 220], [424, 320], P(430, g, 1)], STONE,
        { lines: [{ p: [[70, 220], [90, 300], [74, 380]], w: 2.8, a: 0.45 }, { p: [[370, 210], [350, 300], [370, 380]], w: 2.8, a: 0.45 }, { p: [[140, 130], [300, 130]], w: 2.4, a: 0.3 }], sub: [shadeR(300, 70, 440, g + 4, '#5e564a')] }),
      rock([P(cx - 110, g, 1), [cx - 100, 300], [cx - 60, 250], [cx, 236], [cx + 60, 250], [cx + 100, 300], P(cx + 110, g, 1)], '#7a7062'),
      hole(cx, g, 76, 170, '#120c0a'),
      { p: [P(cx - 80, 154, 1), [cx - 40, 128], [cx + 40, 128], P(cx + 80, 154, 1), [cx + 40, 190], [cx - 40, 190]], c: '#f0ece0', m: 'skin', line: 1.4 },
      { e: [cx, 158, 26, 26], c: '#c83a24', m: 'gem', gloss: 1, line: 1.2, glint: [[cx - 8, 150, 6]] }, { e: [cx, 158, 11, 11], c: '#1a0a08', m: 'flat', line: 0 },
      { p: tube([[cx - 96, 136, 14], [cx, 108, 18], [cx + 96, 136, 14]]), c: '#6a6254', m: 'horn', line: 1 },
      torch(cx - 110, g, 90), torch(cx + 110, g, 90),
      boulder(52, g, 34, 24, '#8e8474'), boulder(392, g, 30, 22, '#8e8474'), boulder(cx + 62, g + 2, 18, 12, '#7a7062'),
      (lit(cx, 158), null),
    ]);
    // 7. Логово чудищ: гигантский рогатый череп и рёбра над пещерой
    bd('dwell_7', F, (cx, g) => {
      const out = [];
      out.push(rock([P(0, g, 1), [10, 380], [60, 320], [150, 290], [270, 280], [390, 290], [480, 320], [530, 380], P(540, g, 1)], STONE, { sub: [shadeR(400, 270, 550, g + 4, '#5e564a')], lines: [{ p: [[80, 340], [100, 420]], w: 2.6, a: 0.4 }, { p: [[450, 340], [430, 430]], w: 2.6, a: 0.4 }] }));
      // рёбра: пары дуг от земли к хребту
      for (const [dx, h] of [[250, 260], [190, 300]]) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * dx, g, 26], [cx + s * dx * 0.98, g - h * 0.55, 22], [cx + s * dx * 0.66, g - h * 0.95, 16], [cx + s * dx * 0.3, g - h * 1.05, 10]]), c: BONE, m: 'horn', gloss: 0.5, line: 1.1 });
      out.push(hole(cx, g, 96, 190, '#140c0a'));
      // череп чудища
      out.push({ p: tube([[cx - 70, 120, 34], [cx - 140, 74, 26], [cx - 190, 90, 16], [cx - 206, 130, 6]]), c: '#d8ccb0', m: 'horn', gloss: 0.6, line: 1.1 }, { p: tube([[cx + 70, 120, 34], [cx + 140, 74, 26], [cx + 190, 90, 16], [cx + 206, 130, 6]]), c: '#d8ccb0', m: 'horn', gloss: 0.6, line: 1.1 });
      out.push({ p: [[cx - 104, 150], [cx - 96, 90], [cx - 50, 50], [cx, 42], [cx + 50, 50], [cx + 96, 90], [cx + 104, 150], [cx + 80, 200], P(cx + 60, 250, 1), P(cx - 60, 250, 1), [cx - 80, 200]], c: BONE, m: 'horn', gloss: 0.4, line: 1.3,
        lines: [{ p: [[cx - 50, 130], [cx - 30, 140]], w: 26, c: '#1a0a08', a: 1 }, { p: [[cx + 50, 130], [cx + 30, 140]], w: 26, c: '#1a0a08', a: 1 }, { p: [[cx - 14, 190], [cx + 14, 190]], w: 10, c: '#1a1210', a: 0.9 }, { p: [[cx - 40, 236], [cx + 40, 236]], w: 4, c: '#5a4a38', a: 0.8 }] });
      out.push({ e: [cx - 40, 136, 7, 6], c: '#ff5a2a', m: 'gem', line: 0 }, { e: [cx + 40, 136, 7, 6], c: '#ff5a2a', m: 'gem', line: 0 });
      lit(cx - 40, 136); lit(cx + 40, 136);
      for (const s of [-1, 1]) out.push(tusk(cx + s * 50, 256, -s * 0.6, 90));
      out.push(torch(cx - 120, g, 100), torch(cx + 120, g, 100));
      out.push(stakeSkull(30, g, 90, 13), stakeSkull(510, g, 90, 13));
      return out;
    });

    /* ---------- укрепления: частокол, бревенчатые вышки, глиняные башни, ворота ---------- */
    function gateLogs(g, top, hw) {
      const out = [];
      for (const x of [490 - hw, 490 + hw]) out.push(logs(x - 44, top + 40, x + 44, g), furRoof(x - 44, x + 44, top + 46, 70, 16), sqwin(x, top + 90, 11, 13, { frame: LOGD }));
      out.push({ p: box(490 - hw + 40, top + 70, 490 + hw - 40, g), c: LOG, m: 'wood', flow: 0, line: 1.2, lines: planks(490 - hw + 40, top + 70, 490 + hw - 40, g, 20, false, 0.55) });
      out.push(palisade(490 - hw + 36, 490 + hw - 36, top + 30, top + 80, 20, LOG));
      out.push(door(490, g, 50, Math.min(140, g - top - 110), { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10' }));
      out.push(skull(490, g - Math.min(140, g - top - 110) - 30, 18, { horns: true }));
      out.push(torch(490 - 80, g, 90), torch(490 + 80, g, 90));
      return out;
    }
    const band = (g, top) => palisade(10, 970, top, g, 30, LOG, { bands: [top + 60, g - 36] });
    bd('fort', F, (cx, g) => [band(g, 150), gateLogs(g, 60, 110), stakeSkull(250, g, 110, 13), stakeSkull(730, g, 110, 13)]);
    bd('citadel', F, (cx, g) => [band(g, 270),
      clayT(110, g, 62, 330, { beams: [200, 320] }), cone(110, 120, 72, 90, HIDE, { rowC: '#8a4a2a' }), sqwin(110, 200 - 30, 11, 13, { frame: LOGD }), sqwin(110, 270, 12, 14, { frame: LOGD }),
      clayT(870, g, 62, 330, { beams: [200, 320] }), cone(870, 120, 72, 90, HIDE, { rowC: '#8a4a2a' }), sqwin(870, 170, 11, 13, { frame: LOGD }), sqwin(870, 270, 12, 14, { frame: LOGD }),
      gateLogs(g, 180, 110)]);
    bd('castle', F, (cx, g) => [band(g, 460),
      clayT(110, g, 62, 360, { beams: [390, 500] }), cone(110, 280, 72, 90, HIDE, { rowC: '#8a4a2a' }), flag(110, 190, 50, RED, { fw: 34, fh: 20, left: true }), sqwin(110, 340, 11, 13, { frame: LOGD }), sqwin(110, 450, 12, 14, { frame: LOGD }),
      clayT(870, g, 62, 360, { beams: [390, 500] }), cone(870, 280, 72, 90, HIDE, { rowC: '#8a4a2a' }), flag(870, 190, 50, RED, { fw: 34, fh: 20 }), sqwin(870, 340, 11, 13, { frame: LOGD }), sqwin(870, 450, 12, 14, { frame: LOGD }),
      clayT(490, g, 130, 470, { beams: [300, 430] }), tent(490, 176, 150, 120, HIDE, '#8a4a2a', true), flag(490, 56, 56, RED, { fw: 40, fh: 22 }),
      skull(490, 240, 34, { horns: true }), sqwin(420, 360, 13, 16, { frame: LOGD }), sqwin(560, 360, 13, 16, { frame: LOGD }),
      tusk(490 - 70, g, -1, 200), tusk(490 + 70, g, 1, 200),
      door(490, g, 50, 140, { square: true, ring: LOGD, c: '#4a2c16', band: '#2a1a10' }), torch(490 - 150, g, 90), torch(490 + 150, g, 90)]);
  }
  /* ============================== КРЕПОСТЬ ==============================
     Болото: хижины на сваях с дощатыми стенами под лохматой соломой, мох,
     замшелый камень, тотемы ящеров, змеиные мотивы, тёмная вода и камыш. */
  {
    const F = 'fortress';
    const WOOD = '#7a5a34', WOODD = '#4e3a20', THATCH = '#b8a060', MOSS = '#6a8a34', STONE = '#7c8468', WATER = '#3a6a5a', LIZ = '#5a9a3a', RED = '#c84a2a', BONE = '#e4dcc0', TEAL = '#2f8a72';
    const MOSSES = ['#4a6a24', '#5e8a2e', '#76a03a'];
    /** Дощатая стена (вертикальные доски), тёмная правая сторона. */
    const planksWall = (x0, y0, x1, y1, c) => ({ p: box(x0, y0, x1, y1), c: c || WOOD, m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(x0, y0, x1, y1, 16, true, 0.45), sub: [shadeR(x1 - (x1 - x0) * 0.24, y0 - 2, x1 + 2, y1 + 2, tone(c || WOOD, -0.35))] });
    /** Лохматая соломенная крыша (островерхая, с загнутыми краями) + мох. */
    function thatch(cx, y, hw, h, o) {
      o = o || {}; const c = o.c || THATCH, out = [];
      out.push({ p: [P(cx - hw, y + 10, 1), [cx - hw * 0.62, y - h * 0.36], [cx - hw * 0.2, y - h * 0.84], P(cx, y - h, 1), [cx + hw * 0.2, y - h * 0.84], [cx + hw * 0.62, y - h * 0.36], P(cx + hw, y + 10, 1), [cx + hw * 0.5, y + 4], [cx, y + 16], [cx - hw * 0.5, y + 4]], c, m: 'fur', furLen: 1.2, flow: PI / 2, dens: 1.2, line: 1.2, belly: 0.3,
        lines: [{ p: [[cx - hw * 0.84, y + 4], [cx, y + 12], [cx + hw * 0.84, y + 4]], w: 5, c: '#6a5228', a: 0.85 }, { p: [[cx - hw * 0.34, y - h * 0.6], [cx, y - h * 0.56], [cx + hw * 0.34, y - h * 0.6]], w: 4, c: '#6a5228', a: 0.8 }],
        sub: [{ p: [[cx + hw * 0.1, y - h - 4], [cx + hw * 1.1, y], [cx + hw * 1.1, y + 20], [cx + hw * 0.3, y + 20]], c: tone(c, -0.3), m: 'flat', line: 0, op: 0.5 }] });
      if (o.moss !== false) for (const [k, t] of [[-0.5, 0.3], [0.35, 0.45]]) out.push({ p: ell(cx + hw * k, y - h * t, hw * 0.16, hw * 0.08 + 3, 9, 0.2), c: MOSSES[1], m: 'feather', texSize: 0.5, line: 0.6 });
      out.push({ p: tube([[cx, y - h + 8, 6], [cx + 3, y - h - 20, 3]]), c: WOODD, m: 'wood', line: 0.6 });
      return out;
    }
    /** Сваи с настилом: настил на deck, сваи уходят в воду до G. */
    function stilts(x0, x1, deck, G, st) {
      const out = [];
      for (let x = x0 + 8; x <= x1 - 8; x += st || 34) out.push(post(x, G + 2, deck, 11, '#4a3a24'));
      out.push({ p: box(x0 - 8, deck - 10, x1 + 8, deck + 6), c: '#8a6a40', m: 'wood', flow: 0, line: 1.1, lines: planks(x0 - 8, deck - 10, x1 + 8, deck + 6, 20, true, 0.5) });
      return out;
    }
    /** Хижина: стены (x0…x1 от wallTop до deck), соломенная крыша, дверь и окна. */
    function hut(cx, hw, wallTop, deck, roofH, o) {
      o = o || {}; const out = [planksWall(cx - hw, wallTop, cx + hw, deck - 8, o.c)];
      out.push(door(cx + (o.doorDx || 0), deck - 8, o.dw || hw * 0.24, Math.min(o.dh || 90, (deck - wallTop) * 0.72), { c: '#3a2a14', band: '#2a1a0a', bands: false }));
      for (const dx of o.wins || []) out.push(sqwin(cx + dx, wallTop + (deck - wallTop) * 0.42, 10, 13, { cross: false, frame: WOODD }));
      out.push(thatch(cx, wallTop + 4, hw + (o.eave || 30), roofH, o));
      return out;
    }
    /** Тотем ящера: столб с бирюзовыми кольцами, голова ящера с жёлтым глазом, красный гребень. */
    function lizTotem(x, G, h, s) {
      s = s || 1; const top = G - h, k = (h / 150);
      return [
        { p: tube([[x, G, 16 * k + 4], [x, top + 30 * k, 13 * k + 3]], { flat0: true }), c: '#6a5030', m: 'wood', flow: -PI / 2, line: 1, lines: [0.3, 0.5, 0.7].map(t => ({ p: [[x - 9, G - h * t], [x + 9, G - h * t]], w: 5, c: TEAL, a: 0.9 })) },
        { p: [P(x - s * 18 * k, top + 40 * k, 1), [x - s * 20 * k, top + 14 * k], [x - s * 6 * k, top], [x + s * 14 * k, top + 4 * k], [x + s * 42 * k, top + 14 * k], P(x + s * 46 * k, top + 22 * k, 1), [x + s * 20 * k, top + 26 * k], [x + s * 12 * k, top + 40 * k]], c: LIZ, m: 'skin', line: 1.1, lines: [{ p: [[x + s * 16 * k, top + 20 * k], [x + s * 44 * k, top + 21 * k]], w: 2.4, a: 0.8 }] },
        { e: [x + s * 6 * k, top + 11 * k, 4.5 * k + 1, 4 * k + 1], c: '#ffd040', m: 'gem', line: 0.6 },
        { p: [P(x - s * 12 * k, top + 4 * k, 1), [x - s * 3 * k, top - 18 * k], P(x + s * 4 * k, top + 2 * k, 1)], c: RED, m: 'leather', line: 0.9 },
      ];
    }
    /** Змея, обвивающая ствол: от (x, y0) вверх до y1, петли шириной w. */
    function snake(x, y0, y1, w, c) {
      const pts = [], n = 7; for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x + Math.sin(t * PI * 3) * w, y0 + (y1 - y0) * t, 13 - t * 5]); }
      const hx = pts[n][0], hy = pts[n][1];
      return [{ p: tube(pts), c: c || '#4a8a3a', m: 'skin', line: 1, lines: [{ p: pts.map(q => [q[0], q[1]]), w: 3, c: '#e0c050', a: 0.7 }] },
        { p: [P(hx - 10, hy + 6, 1), [hx - 8, hy - 8], [hx + 8, hy - 12], P(hx + 22, hy - 4, 1), [hx + 8, hy + 6]], c: c || '#4a8a3a', m: 'skin', line: 1 }, { e: [hx + 6, hy - 5, 2.6, 2.4], c: '#ffd040', m: 'gem', line: 0 }];
    }
    /** Камыш. */
    const reeds = (x, G, n) => { const out = []; for (let k = 0; k < (n || 3); k++) { const dx = (k - (n || 3) / 2) * 7; out.push({ p: tube([[x + dx, G + 2, 4], [x + dx * 1.5, G - 44 - (k % 2) * 16, 2]]), c: '#6a9a3a', m: 'leather', line: 0.5 }); } out.push({ p: ell(x + 2, G - 50, 4, 10, 8), c: '#7a4a24', m: 'fur', line: 0.6 }); return out; };
    /** Болотная вода у подножия. */
    const pond = (x0, x1, G) => water(x0, x1, G - 16, G + 4, WATER, { n: 5 });
    /** Замшелый камень (кладка + мох). */
    const mossyStone = (pts, x0, y0, x1, y1, o) => rock(pts, (o && o.c) || STONE, { lines: masonry(x0, y0, x1, y1, 30, 44, 0.45, 2.4), sub: [{ p: box(x0 - 4, y0 - 4, x1 + 4, y0 + 16), c: MOSSES[1], m: 'flat', line: 0, op: 0.7 }, shadeR(x1 - (x1 - x0) * 0.2, y0 - 4, x1 + 4, y1 + 4, tone((o && o.c) || STONE, -0.3))] });
    const torchS = (x, G, h) => { lit(x, G - h - 12); return [post(x, G, G - h, 7, WOODD), flame(x, G - h + 2, 9, 30)]; };

    /* ---------- ратуша: хижины на сваях → храм-ступени под соломой ---------- */
    bd('hall_1', F, (cx, g) => [
      pond(0, 420, g), stilts(60, 360, 300, g, 38),
      hut(cx, 110, 180, 300, 118, { wins: [-66, 66], dh: 84 }),
      lizTotem(26, g, 150), reeds(390, g, 3),
    ]);
    bd('hall_2', F, (cx, g) => [
      pond(0, 460, g), stilts(330, 450, 350, g, 36), hut(392, 50, 262, 350, 80, { wins: [], dw: 14, dh: 50, eave: 20 }),
      stilts(40, 330, 370, g, 36), hut(186, 118, 234, 370, 132, { wins: [-72, 72], dh: 96 }),
      lizTotem(20, g, 160), lizTotem(356, g, 90, -1),
    ]);
    bd('hall_3', F, (cx, g) => [
      pond(0, 520, g),
      stilts(10, 130, 350, g, 36), hut(70, 50, 262, 350, 84, { wins: [], dw: 14, dh: 50, eave: 20 }),
      stilts(390, 510, 350, g, 36), hut(450, 50, 262, 350, 84, { wins: [], dw: 14, dh: 50, eave: 20 }),
      stilts(110, 410, 386, g, 36), hut(cx, 132, 236, 386, 150, { wins: [-84, 84], dh: 100 }),
      snake(cx - 136, 380, 250, 10), lizTotem(cx - 150, g, 110), lizTotem(cx + 150, g, 110, -1),
      sqwin(cx, 170, 10, 13, { cross: false, frame: WOODD }),
    ]);
    bd('hall_4', F, (cx, g) => {
      const out = [pond(0, 560, g)];
      // боковые вышки на высоких сваях
      for (const x of [58, 502]) out.push(stilts(x - 50, x + 50, 300, g, 30), hut(x, 44, 210, 300, 90, { wins: [], dw: 13, dh: 48, eave: 18 }), sqwin(x, 170, 9, 11, { cross: false, frame: WOODD }));
      // ступенчатый храм из замшелого камня
      const steps = [[200, g - 110, g], [160, g - 210, g - 110], [120, g - 290, g - 210]];
      for (const [hw, y0, y1] of steps) out.push(mossyStone(box(cx - hw, y0, cx + hw, y1), cx - hw, y0, cx + hw, y1));
      // святилище наверху
      out.push(planksWall(cx - 74, 200, cx + 74, g - 290), thatch(cx, 204, 110, 150), sqwin(cx - 36, 240, 11, 13, { cross: false, frame: WOODD }), sqwin(cx + 36, 240, 11, 13, { cross: false, frame: WOODD }));
      // змеиные головы по краям ступеней
      for (const s of [-1, 1]) for (const [hw, y] of [[200, g - 110], [160, g - 210]]) out.push({ p: [P(cx + s * (hw - 6), y + 30, 1), [cx + s * (hw + 4), y + 4], [cx + s * (hw + 30), y + 2], P(cx + s * (hw + 40), y + 14, 1), [cx + s * (hw + 20), y + 26]], c: '#6a8a5a', m: 'horn', line: 1 }, { e: [cx + s * (hw + 22), y + 10, 3.5, 3], c: '#ffd040', m: 'gem', line: 0 });
      out.push(sqwin(cx - 90, g - 160, 11, 14, { cross: false, frame: WOODD }), sqwin(cx + 90, g - 160, 11, 14, { cross: false, frame: WOODD }), sqwin(cx - 130, g - 60, 11, 14, { cross: false, frame: WOODD }), sqwin(cx + 130, g - 60, 11, 14, { cross: false, frame: WOODD }));
      out.push(hole(cx, g, 44, 120, '#1a1a10'), { p: tube([[cx - 60, g - 118, 10], [cx, g - 150, 10], [cx + 60, g - 118, 10]]), c: TEAL, m: 'skin', line: 1 });
      out.push(lizTotem(cx - 80, g, 150), lizTotem(cx + 80, g, 150, -1), torchS(cx - 50, g, 60), torchS(cx + 50, g, 60));
      out.push(flag(cx, 56, 50, TEAL, { fw: 34, fh: 20 }));
      return out;
    });

    /* ---------- гильдия магов: деревянная башня ярусами под соломенными юбками, змея ---------- */
    for (let L = 1; L <= 4; L++) bd('guild_' + L, F, (cx, g) => {
      const top = 200, floors = L + 1, out = [], base = g - 50, fh = (base - top) / floors;
      out.push(pond(cx - 110, cx + 110, g), mossyStone([P(cx - 84, g, 1), [cx - 80, base + 8], P(cx - 60, base, 1), P(cx + 60, base, 1), [cx + 80, base + 8], P(cx + 84, g, 1)], cx - 84, base, cx + 84, g));
      out.push({ p: trap(cx, top, base, 44, 60), c: WOOD, m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(cx - 60, top, cx + 60, base, 18, true, 0.45), sub: [{ p: [P(cx + 16, top - 2, 1), P(cx + 64, top - 2, 1), P(cx + 64, base + 2, 1), P(cx + 22, base + 2, 1)], c: WOODD, m: 'flat', line: 0 }] });
      out.push(door(cx, base, 20, Math.min(76, fh * 0.7), { c: '#3a2a14', bands: false }));
      for (let i = 1; i < floors; i++) {
        const y = base - i * fh, hw = 60 - 16 * (base - y) / (base - top);
        out.push(win(cx + (i % 2 ? -16 : 16), y - 12, 10, Math.min(40, fh * 0.44), { c: '#b8f070', lc: '#1a3a1a' }));
        out.push({ p: [P(cx - hw - 26, y + 16, 1), [cx - hw * 0.6, y - 10], [cx + hw * 0.6, y - 10], P(cx + hw + 26, y + 16, 1), [cx, y + 22]], c: THATCH, m: 'fur', furLen: 0.9, flow: PI / 2, line: 1, belly: 0.3 });
      }
      out.push(snake(cx + 56, base - 10, top + 30, 26));
      out.push(thatch(cx, top + 6, 76, 110, { moss: L > 1 }));
      // сфера в черепе ящера над крышей
      out.push({ p: tube([[cx, top - 96, 6], [cx, top - 118, 5]]), c: WOODD, m: 'wood', line: 0.6 });
      out.push({ e: [cx, top - 134, 16, 16], c: '#8af060', m: 'gem', gloss: 1.2, line: 1, lc: '#1a4a1a', glint: [[cx - 5, top - 140, 5]] }); lit(cx, top - 134);
      out.push({ p: [P(cx - 22, top - 118, 1), [cx - 26, top - 134], P(cx - 12, top - 150, 1), P(cx - 10, top - 124, 1)], c: BONE, m: 'horn', line: 0.8 }, { p: [P(cx + 22, top - 118, 1), [cx + 26, top - 134], P(cx + 12, top - 150, 1), P(cx + 10, top - 124, 1)], c: BONE, m: 'horn', line: 0.8 });
      out.push(reeds(cx - 96, g, 3));
      return out;
    });

    /* ---------- таверна: хижина на сваях, фонари, бочки на настиле ---------- */
    bd('tavern', F, (cx, g) => [
      pond(0, 360, g), stilts(30, 330, 280, g, 40),
      hut(170, 110, 170, 280, 116, { wins: [-68, 68], dh: 80, doorDx: 0 }),
      { p: tube([[296, 200, 5], [340, 200, 5]]), c: WOODD, m: 'wood', line: 0.7 }, { p: tube([[334, 200, 2], [334, 214, 2]]), c: IRON, m: 'steel', line: 0 }, lamp(334, 224, 9),
      { p: tube([[44, 214, 2], [44, 226, 2]]), c: IRON, m: 'steel', line: 0 }, lamp(44, 236, 8),
      barrel(300, 270, 16, 38), barrel(40, 270, 16, 38, '#7a4a28'),
      { p: box(196, 120, 246, 152), c: '#8a6a40', m: 'wood', flow: 0, line: 1, sub: [{ p: [P(204, 136, 1), [214, 126], [230, 128], P(240, 136, 1), [230, 144], [214, 146]], c: '#8aa0b0', m: 'steel', line: 0.8 }] },
      reeds(350, g, 3),
    ]);

    /* ---------- кузница: глиняный горн под соломенным навесом ---------- */
    bd('blacksmith', F, (cx, g) => [
      { p: trap(250, 40, 220, 20, 28), c: '#7a6a50', m: 'cloth', line: 1.2, lines: masonry(222, 40, 278, 220, 20, 24, 0.45) }, { p: box(226, 30, 274, 44), c: '#3a3028', m: 'horn', line: 1 },
      post(24, g, 180, 12, WOODD), post(310, g, 180, 12, WOODD),
      thatch(170, 184, 172, 96),
      rock([P(40, g, 1), [36, g - 100], [70, g - 140], [150, g - 150], [230, g - 140], [270, g - 100], P(274, g, 1)], '#8a7050', { lines: [{ p: [[80, g - 120], [90, g - 60]], w: 2.4, a: 0.4 }], sub: [shadeR(220, g - 160, 280, g + 4, '#5e4a34')] }),
      { p: arch(126, g, 38, 90), c: '#2a1208', m: 'cloth', ao: 1.2, line: 1.1 }, flame(126, g - 8, 30, 64), lamp(126, g - 30, 6, '#ffb040'),
      door(226, g, 22, 80, { c: '#3a2a14', bands: false }),
      { p: [P(170, g - 40, 1), P(210, g - 40, 1), [220, g - 34], P(206, g - 28, 1), P(202, g - 12, 1), P(210, g, 1), P(174, g, 1), P(180, g - 12, 1), P(176, g - 28, 1)], c: '#4a4a52', m: 'steel', line: 1 },
      ...[300, 314, 328].map((x, i) => ({ p: tube([[x, g, 4], [x - 4, g - 110 + i * 8, 3]]), c: WOOD, m: 'wood', line: 0.6 })), ...[300, 314, 328].map((x, i) => ({ p: [P(x - 10, g - 106 + i * 8, 1), P(x - 4, g - 132 + i * 8, 1), P(x + 2, g - 106 + i * 8, 1)], c: '#b7c0ca', m: 'steel', line: 0.8 })),
    ]);

    /* ---------- рынок: плот-настил с навесами, рыба, корзины ---------- */
    bd('market', F, (cx, g) => {
      const out = [pond(0, 407, g), stilts(20, 390, g - 30, g, 44)];
      out.push(post(cx, g - 40, 50, 12, WOODD), { e: [cx, 36, 22, 22], c: GOLD, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(cx, 36, 14, 14, 12).concat([[cx + 14, 36]]), w: 3, c: '#8a6a20', a: 0.8 }] });
      for (const x0 of [30, 230]) {
        out.push(post(x0 + 10, g - 36, 120, 9, WOODD), post(x0 + 140, g - 36, 120, 9, WOODD));
        out.push({ p: [P(x0 - 16, 132, 1), [x0 + 40, 96], [x0 + 110, 96], P(x0 + 166, 132, 1), [x0 + 75, 142]], c: THATCH, m: 'fur', furLen: 0.9, flow: PI / 2, line: 1.1, belly: 0.3 });
        out.push({ p: box(x0 + 8, g - 76, x0 + 142, g - 38), c: '#8a6a40', m: 'wood', flow: 0, line: 1 });
      }
      // рыба на верёвке, корзины, горшки
      out.push({ p: tube([[46, 140, 2], [164, 140, 2]]), c: '#c8b080', m: 'cloth', line: 0 });
      for (const x of [66, 96, 126, 150]) out.push({ p: [P(x, 142, 1), [x - 7, 156], [x - 5, 172], P(x, 184, 1), [x + 5, 172], [x + 7, 156]], c: '#8aa0a8', m: 'steel', line: 0.8 });
      out.push({ p: ell(262, g - 90, 18, 14, 10), c: '#c8a050', m: 'fur', furLen: 0.6, line: 1 }, { p: ell(300, g - 90, 14, 12, 10), c: '#a86a3a', m: 'skin', line: 1 }, { p: ell(334, g - 90, 16, 14, 10), c: '#6aa040', m: 'skin', line: 1 });
      out.push({ p: ell(90, g - 90, 16, 12, 10), c: '#e0c060', m: 'skin', line: 1 });
      out.push(lamp(cx - 30, 150), lamp(cx + 30, 150));
      return out;
    });

    /* ---------- хранилище: плетёные амбары на сваях под соломой, лестница ---------- */
    bd('silo', F, (cx, g) => {
      const out = [pond(0, 320, g)];
      for (const [x, hw, top, deck] of [[80, 60, 200, 300], [216, 76, 140, 280]]) {
        out.push(stilts(x - hw + 6, x + hw - 6, deck, g, 36));
        out.push({ p: [P(x - hw, deck - 8, 1), [x - hw - 6, (top + deck) / 2], P(x - hw + 4, top, 1), P(x + hw - 4, top, 1), [x + hw + 6, (top + deck) / 2], P(x + hw, deck - 8, 1)], c: '#9a7a48', m: 'wood', flow: 0, line: 1.2,
          lines: [0.25, 0.5, 0.75].map(t => ({ p: [[x - hw - 4, top + (deck - top) * t], [x, top + (deck - top) * t + 8], [x + hw + 4, top + (deck - top) * t]], w: 4, c: '#5a4020', a: 0.7 })), sub: [shadeR(x + hw * 0.5, top - 2, x + hw + 8, deck, '#6a5028')] });
        out.push(thatch(x, top + 6, hw + 20, hw * 1.3));
      }
      out.push(door(216, 272, 18, 60, { c: '#3a2a14', bands: false }), sqwin(80, 240, 9, 11, { cross: false, frame: WOODD }));
      out.push(beam(270, g - 4, 300, 290, 5, WOOD), beam(290, g - 4, 316, 290, 5, WOOD));
      out.push(sack(300, g - 8, 16, 34), reeds(20, g, 3));
      return out;
    });

    /* ---------- Клетка полководцев: деревянная клетка на каменном помосте, тотемы ---------- */
    bd('special', F, (cx, g) => {
      const out = [mossyStone([P(20, g, 1), P(26, g - 40, 1), P(254, g - 40, 1), P(260, g, 1)], 20, g - 40, 260, g)];
      out.push({ p: box(56, 110, 224, g - 40), c: '#1e2014', m: 'cloth', ao: 1.2, line: 1 });
      out.push({ p: [P(80, g - 40, 1), [90, g - 90], [120, g - 110], [150, g - 100], [170, g - 70], P(180, g - 40, 1)], c: '#6a4a3a', m: 'leather', line: 1 });
      out.push({ e: [140, 150, 10, 10], c: WIN, m: 'gem', line: 0.8 }); lit(140, 150);
      const bars = []; for (let x = 60; x <= 222; x += 20) bars.push({ p: tube([[x, g - 40, 7], [x, 110, 7]], { flat0: true, flat1: true }), c: '#6a5030', m: 'wood', line: 0.8 });
      out.push(...bars, beam(46, 116, 234, 116, 12, WOODD), beam(46, g - 44, 234, g - 44, 12, WOODD), beam(46, 180, 234, 180, 7, WOODD));
      out.push(thatch(140, 110, 130, 80));
      out.push(skull(140, 150, 13, { horns: true, c: BONE }));
      out.push(lizTotem(18, g, 150), lizTotem(262, g, 150, -1));
      return out;
    });

    /* ---------- жилища ---------- */
    // 1. Хижина гноллов: глинобитный купол под соломой, кости
    bd('dwell_1', F, (cx, g) => [
      pond(10, 250, g),
      { p: [P(40, g - 6, 1), [36, g - 70], [70, g - 124], [130, g - 140], [190, g - 124], [224, g - 70], P(220, g - 6, 1), [130, g + 2]], c: '#8a7050', m: 'cloth', line: 1.2, belly: 0.3, lines: [{ p: [[60, g - 60], [200, g - 60]], w: 3, c: '#5a4630', a: 0.5 }], sub: [shadeR(170, g - 150, 230, g, '#5e4a34')] },
      thatch(130, g - 110, 110, 70),
      hole(118, g - 6, 22, 60), sqwin(186, g - 64, 9, 10, { cross: false, frame: WOODD }),
      { p: tube([[60, g - 6, 4], [90, g - 16, 4]]), c: BONE, m: 'horn', line: 0.5 }, skull(214, g - 14, 10),
      { p: tube([[22, g, 4], [26, g - 100, 3]]), c: WOOD, m: 'wood', line: 0.5 }, { p: [P(18, g - 96, 1), P(26, g - 124, 1), P(32, g - 96, 1)], c: '#b7c0ca', m: 'steel', line: 0.8 },
    ]);
    // 2. Логово ящеров: хижина на сваях, щиты, копья
    bd('dwell_2', F, (cx, g) => [
      pond(0, 313, g), stilts(50, 270, 210, g, 36), hut(160, 88, 120, 210, 96, { wins: [-54, 54], dh: 64 }),
      { e: [60, 170, 18, 22], c: TEAL, m: 'leather', line: 1, lines: [{ p: [[60, 150], [60, 190]], w: 3, c: '#e0c050', a: 0.9 }] }, { e: [260, 170, 18, 22], c: RED, m: 'leather', line: 1, lines: [{ p: [[244, 170], [276, 170]], w: 3, c: '#e0c050', a: 0.9 }] },
      lizTotem(24, g, 120), reeds(296, g, 3),
    ]);
    // 3. Улей змиев: сухое дерево, бумажные гнёзда-ульи, стрекозы
    bd('dwell_3', F, (cx, g) => {
      const out = [pond(0, 353, g)];
      out.push({ p: tube([[150, g, 44], [156, 200, 30], [140, 120, 22], [130, 60, 12]]), c: '#6a5a44', m: 'wood', flow: -PI / 2, line: 1.1 });
      out.push({ p: tube([[152, 170, 14], [220, 120, 10], [280, 110, 6]]), c: '#6a5a44', m: 'wood', line: 1 }, { p: tube([[140, 140, 12], [80, 100, 8], [46, 96, 4]]), c: '#6a5a44', m: 'wood', line: 1 });
      for (const [x, y, rx, ry] of [[236, 170, 40, 54], [84, 150, 30, 40], [166, 250, 36, 44]]) {
        out.push({ p: ell(x, y, rx, ry, 14), c: '#c8b88a', m: 'cloth', line: 1.1, belly: 0.4, lines: [-0.5, -0.1, 0.3, 0.6].map(t => ({ p: [[x - rx * Math.sqrt(1 - t * t), y + ry * t], [x, y + ry * t + 6], [x + rx * Math.sqrt(1 - t * t), y + ry * t]], w: 2.6, a: 0.5 })) });
        out.push({ e: [x, y + ry * 0.5, rx * 0.26, ry * 0.18], c: '#e8c040', m: 'gem', line: 0.8 }); lit(x, y + ry * 0.5);
      }
      for (const [x, y] of [[300, 90], [40, 200], [310, 230]]) {
        out.push({ p: K.leaf([x, y], -2.6, 26, 9).body, c: '#bfe8f8', m: 'gem', op: 0.75, line: 0.6 }, { p: K.leaf([x, y], -0.5, 26, 9).body, c: '#bfe8f8', m: 'gem', op: 0.75, line: 0.6 });
        out.push({ p: tube([[x - 12, y + 2, 5], [x + 14, y - 2, 3]]), c: '#3a9a6a', m: 'skin', line: 0.6 });
      }
      out.push(reeds(40, g, 3), reeds(320, g, 3));
      return out;
    });
    // 4. Яма василисков: каменный круг над ямой, жёлтые глаза во тьме, колья
    bd('dwell_4', F, (cx, g) => [
      palisade(20, 320, 150, g - 40, 20, '#6a5030'), lizTotem(cx - 40, g - 60, 180),
      { p: ell(cx, g - 50, 150, 44, 16), c: STONE, m: 'horn', line: 1.2, lines: [0, 1, 2, 3, 4, 5].map(i => ({ p: [[cx - 150 + i * 60, g - 70], [cx - 140 + i * 60, g - 20]], w: 2.4, a: 0.4 })) },
      { p: ell(cx, g - 58, 116, 28, 14), c: '#10140c', m: 'cloth', ao: 1.4, line: 1 },
      { e: [cx - 30, g - 60, 9, 6], c: '#ffe040', m: 'gem', gloss: 1, line: 0.6, sub: [{ e: [cx - 30, g - 60, 2, 5], c: '#1a1a0a', m: 'flat', line: 0 }] }, { e: [cx + 10, g - 60, 9, 6], c: '#ffe040', m: 'gem', gloss: 1, line: 0.6, sub: [{ e: [cx + 10, g - 60, 2, 5], c: '#1a1a0a', m: 'flat', line: 0 }] },
      (lit(cx - 30, g - 60), lit(cx + 10, g - 60), null),
      rock([P(20, g, 1), [20, g - 30], [60, g - 50], [100, g - 30], P(110, g, 1)], STONE), rock([P(240, g, 1), [250, g - 36], [290, g - 50], [320, g - 30], P(326, g, 1)], STONE),
      { p: ell(80, g - 38, 30, 8, 9), c: MOSSES[1], m: 'feather', texSize: 0.5, line: 0.6 }, { p: ell(286, g - 44, 26, 8, 9), c: MOSSES[2], m: 'feather', texSize: 0.5, line: 0.6 },
      torchS(40, g - 30, 80), torchS(300, g - 30, 80),
    ]);
    // 5. Логово горгон: замшелые руины-арка, бычий череп, трава
    bd('dwell_5', F, (cx, g) => [
      rock([P(0, g, 1), [20, 280], [90, 230], [200, 214], [310, 230], [380, 280], P(400, g, 1)], '#6a7a44', { lines: [{ p: [[60, 270], [80, 330]], w: 2.4, a: 0.4 }] }),
      mossyStone([P(80, g, 1), P(80, 170, 1), P(320, 170, 1), P(320, g, 1)], 80, 170, 320, g),
      hole(cx, g, 70, 150, '#141410'),
      mossyStone([P(66, 170, 1), P(66, 136, 1), P(334, 136, 1), P(334, 170, 1)], 66, 136, 334, 170, { c: '#8a8e72' }),
      skull(cx, 116, 30, { horns: true, c: BONE, hornC: '#c8b890' }),
      { p: ell(cx - 30, 140, 50, 10, 9), c: MOSSES[1], m: 'feather', texSize: 0.5, line: 0.6 },
      sqwin(120, 250, 11, 14, { cross: false, frame: STONE }), sqwin(280, 250, 11, 14, { cross: false, frame: STONE }),
      { p: tube([[110, 168, 6], [110, 210, 5]]), c: '#4a6a24', m: 'leather', line: 0.5 }, { p: tube([[300, 168, 6], [300, 196, 5]]), c: '#4a6a24', m: 'leather', line: 0.5 },
      foliage(40, g - 20, 40, 20, 3, MOSSES, 11, { leaf: 0.5 }), foliage(362, g - 20, 40, 20, 3, MOSSES, 13, { leaf: 0.5 }),
    ]);
    // 6. Гнездо виверн: мёртвое дерево над болотом, гнездо из веток, зелёные яйца
    bd('dwell_6', F, (cx, g) => [
      pond(0, 440, g),
      { p: tube([[220, g, 60], [212, 300, 44], [230, 200, 34], [220, 130, 26]]), c: '#5e5040', m: 'wood', flow: -PI / 2, line: 1.2, lines: [{ p: [[206, g - 20], [200, 200]], w: 2.4, a: 0.4 }] },
      { p: tube([[214, 260, 18], [130, 210, 12], [70, 150, 6]]), c: '#5e5040', m: 'wood', line: 1 }, { p: tube([[228, 230, 16], [320, 190, 10], [380, 130, 5]]), c: '#5e5040', m: 'wood', line: 1 },
      { p: ell(222, 118, 120, 36, 16), c: '#6a5030', m: 'wood', flow: 0.2, line: 1.2, lines: [-0.8, -0.4, 0, 0.4, 0.8].map(k => ({ p: [[222 + k * 110 - 30, 104], [222 + k * 110 + 36, 128]], w: 4, c: '#3a2a14', a: 0.7 })) },
      { p: ell(196, 92, 22, 28, 12), c: '#9ac870', m: 'skin', line: 1, glint: [[190, 80, 5]] }, { p: ell(240, 96, 18, 22, 12), c: '#7aa850', m: 'skin', line: 1 },
      hole(212, g - 4, 26, 64, '#141008'), lamp(212, g - 30, 5),
      { p: ell(160, 250, 26, 10, 9), c: MOSSES[1], m: 'feather', texSize: 0.5, line: 0.6 }, { p: ell(300, 214, 22, 9, 9), c: MOSSES[2], m: 'feather', texSize: 0.5, line: 0.6 },
      ...[[70, 150], [380, 130]].map(([x, y]) => ({ p: tube([[x, y, 2], [x, y + 50, 2]]), c: '#6a8a3a', m: 'leather', line: 0 })),
      reeds(60, g, 3), reeds(390, g, 3),
    ]);
    // 7. Пруд гидр: каменная чаша, из воды поднимаются каменные змеиные головы
    bd('dwell_7', F, (cx, g) => {
      const out = [];
      out.push(mossyStone([P(20, g, 1), P(40, g - 90, 1), P(500, g - 90, 1), P(520, g, 1)], 20, g - 90, 520, g));
      out.push(water(60, 480, g - 100, g - 70, '#2f6a5a', { n: 6 }));
      // три шеи гидры
      for (const [x, h, s, c] of [[cx - 130, 260, -1, '#4f7a4a'], [cx, 340, 1, '#5a8a50'], [cx + 130, 270, 1, '#4f7a4a']]) {
        const y0 = g - 86, top = y0 - h;
        out.push({ p: tube([[x, y0, 50], [x - s * 30, y0 - h * 0.4, 40], [x + s * 10, y0 - h * 0.8, 30], [x + s * 10, top + 20, 26]], { flat0: true }), c, m: 'skin', line: 1.2,
          lines: [0.2, 0.4, 0.6].map(t => ({ p: [[x - 20, y0 - h * t], [x + 20, y0 - h * t + 6]], w: 3, c: '#c8c070', a: 0.6 })) });
        out.push({ p: [P(x + s * 10 - 26, top + 34, 1), [x + s * 10 - 30, top + 6], [x + s * 10, top - 8], [x + s * 10 + s * 40, top + 4], P(x + s * 10 + s * 64, top + 22, 1), [x + s * 10 + s * 30, top + 36]], c, m: 'skin', line: 1.2 });
        out.push({ e: [x + s * 20, top + 10, 5, 4], c: '#ffd040', m: 'gem', gloss: 1, line: 0.6 }); lit(x + s * 20, top + 10);
        out.push({ p: [P(x + s * 4, top + 2, 1), [x - s * 10, top - 20], P(x - s * 14, top + 10, 1)], c: RED, m: 'leather', line: 0.8 });
      }
      out.push(water(0, 540, g - 14, g + 4, WATER, { n: 5 }));
      out.push(torchS(40, g - 90, 70), torchS(500, g - 90, 70), reeds(20, g, 3), reeds(520, g, 3));
      return out;
    });

    /* ---------- укрепления: частокол с мхом, ворота-хижина, вышки на сваях ---------- */
    function gateHut(g, top) {
      const out = [];
      out.push(mossyStone(box(390, top + 110, 590, g), 390, top + 110, 590, g));
      out.push(planksWall(410, top + 60, 570, top + 116), thatch(490, top + 64, 130, 90));
      out.push(sqwin(450, top + 90, 10, 12, { cross: false, frame: WOODD }), sqwin(530, top + 90, 10, 12, { cross: false, frame: WOODD }));
      out.push(gate(490, g, 46, Math.min(130, g - top - 130), { ring: '#8a8e72', rw: 12, door: '#5a4028' }));
      out.push(lizTotem(360, g, 150), lizTotem(620, g, 150, -1));
      return out;
    }
    const wallF = (g, top) => [palisade(10, 970, top, g, 26, '#6a5a36', { bands: [top + 50, g - 40], bandC: TEAL }), ...[80, 300, 680, 900].map(x => ({ p: ell(x, top + 42, 40, 9, 9), c: MOSSES[1], m: 'feather', texSize: 0.5, line: 0.6 }))];
    const watch = (x, g, deck) => [stilts(x - 56, x + 56, deck, g, 36), hut(x, 50, deck - 100, deck, 90, { wins: [], dw: 14, dh: 50, eave: 22 }), sqwin(x, deck - 150, 9, 11, { cross: false, frame: WOODD })];
    bd('fort', F, (cx, g) => [wallF(g, 150), gateHut(g, 40)]);
    bd('citadel', F, (cx, g) => [wallF(g, 270), watch(110, g, 260), watch(870, g, 260), gateHut(g, 160)]);
    bd('castle', F, (cx, g) => [wallF(g, 460), watch(110, g, 400), watch(870, g, 400),
      mossyStone(box(340, 300, 640, g), 340, 300, 640, g), mossyStone(box(380, 200, 600, 300), 380, 200, 600, 300),
      planksWall(420, 130, 560, 204), thatch(490, 134, 130, 120), flag(490, 26, 46, TEAL, { fw: 32, fh: 18 }),
      sqwin(460, 166, 10, 12, { cross: false, frame: WOODD }), sqwin(520, 166, 10, 12, { cross: false, frame: WOODD }), sqwin(400, 360, 11, 14, { cross: false, frame: WOODD }), sqwin(580, 360, 11, 14, { cross: false, frame: WOODD }), sqwin(430, 250, 10, 12, { cross: false, frame: WOODD }), sqwin(550, 250, 10, 12, { cross: false, frame: WOODD }),
      snake(340, 300, 200, 10), snake(640, 300, 200, 10),
      gate(490, g, 50, 150, { ring: '#8a8e72', rw: 14, door: '#5a4028' }), lizTotem(300, g, 170), lizTotem(680, g, 170, -1)]);
  }
  /* ============================== СОПРЯЖЕНИЕ ==============================
     Белый мрамор и золото, хрустальные шпили и купола, парящие острова,
     стихийные цвета (воздух, вода, огонь, земля), магия и порталы. */
  {
    const F = 'conflux';
    const MAR = '#eceff6', MARD = '#aab4ca', CRY = '#7fd9ea', CRYD = '#3a9ab8', WLAV = '#dcc0ff', WLC2 = '#4a3a6a';
    const AIR = '#e4f2ff', WAT = '#3aa8f0', FIRE = '#ff7a2a', EARTH = '#b08a4a', MAGIC = '#b48aff';
    const ELEM = [FIRE, WAT, AIR, EARTH];
    /** Мраморная башня: тело, тень, золотой пояс сверху. */
    function marT(cx, G, hw, h, o) {
      o = o || {}; const top = G - h, tw = hw * 0.9, out = [];
      out.push({ p: trap(cx, top, G, tw, hw), c: o.c || MAR, m: 'cloth', line: 1.2, lines: masonry(cx - hw, top, cx + hw, G, 34, hw * 1.1, 0.25, 2),
        sub: [{ p: [P(cx + tw * 0.42, top - 2, 1), P(cx + hw + 4, top - 2, 1), P(cx + hw + 4, G + 2, 1), P(cx + hw * 0.42, G + 2, 1)], c: MARD, m: 'flat', line: 0 }] });
      out.push({ p: box(cx - tw - 6, top - 8, cx + tw + 6, top + 6), c: GOLD, m: 'gold', line: 1 });
      for (const y of o.win || []) out.push(win(cx, y, o.ww || Math.max(7, hw * 0.24), o.wh || Math.max(20, hw * 0.6), { pointed: true, c: WLAV, lc: WLC2 }));
      if (o.roof !== false) out.push(cone(cx, top - 6, tw + (o.eave || 8), o.roofH || hw * 2.4, o.roofC || CRY, { m: 'gem', cd: CRYD, flare: 0.18, rows: false }));
      const apex = top - 6 - (o.roofH || hw * 2.4);
      if (o.roof !== false && o.finial !== false) out.push({ p: tube([[cx, apex + 6, 5], [cx, apex - 16, 3]]), c: GOLD, m: 'gold', line: 0.6 }, { e: [cx, apex - 20, 6, 6], c: o.orb || GOLD, m: o.orb ? 'gem' : 'gold', line: 0.7 });
      return out;
    }
    /** Мраморная стена с золотым карнизом. */
    const marWall = (x0, y0, x1, y1) => [{ p: box(x0, y0, x1, y1), c: MAR, m: 'cloth', line: 1.2, belly: 0.15, lines: masonry(x0, y0, x1, y1, 30, 46, 0.25, 2), sub: [shadeR(x1 - (x1 - x0) * 0.16, y0 - 2, x1 + 2, y1 + 2, MARD)] },
      { p: box(x0 - 6, y0 - 8, x1 + 6, y0 + 6), c: GOLD, m: 'gold', line: 1 }, { p: box(x0 - 4, y1 - 12, x1 + 4, y1), c: '#d6dbe6', m: 'cloth', line: 1 }];
    /** Парящий остров: каменное донце, травяной верх, кристаллы. */
    function island(cx, cy, hw, c) {
      return [
        { p: [P(cx - hw, cy, 1), [cx - hw * 0.6, cy + hw * 0.5], P(cx - hw * 0.1, cy + hw * 1.1, 1), [cx + hw * 0.4, cy + hw * 0.6], P(cx + hw, cy, 1)], c: '#8a7a6a', m: 'horn', gloss: 0.2, line: 1, lines: [{ p: [[cx - hw * 0.3, cy + 4], [cx - hw * 0.12, cy + hw * 0.8]], w: 2, a: 0.4 }] },
        { p: ell(cx, cy - 2, hw * 1.02, hw * 0.2, 12), c: '#6aa844', m: 'cloth', line: 0.9 },
        crystal(cx + hw * 0.2, cy - 2, hw * 0.18, hw * 0.9, c, 0.05), crystal(cx - hw * 0.3, cy, hw * 0.13, hw * 0.55, tone(c, 0.3), -0.15),
      ];
    }
    /** Стихийный пилон с кристаллом. */
    function pylon(x, G, h, c) {
      return [
        { p: trap(x, G - h, G, 10, 18), c: MAR, m: 'cloth', line: 1, sub: [shadeR(x + 4, G - h - 2, x + 20, G + 2, MARD)] },
        { p: box(x - 18, G - h - 8, x + 18, G - h + 4), c: GOLD, m: 'gold', line: 0.8 },
        crystal(x, G - h - 8, 12, 50, c, 0),
      ];
    }
    /** Вихрь: спираль-трубка с прозрачностью. */
    function swirl(cx, cy, rx, ry, turns, c, w, op) {
      const pts = [], n = Math.round(turns * 12);
      for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * PI * 2, k = 0.25 + 0.75 * t; pts.push([cx + Math.cos(a) * rx * k, cy - (1 - t) * ry * 2 + Math.sin(a) * rx * 0.25 * k, w * (0.35 + 0.65 * t)]); }
      return { p: tube(pts), c, m: 'gem', op: op || 0.7, gloss: 0.6, line: 0.6 };
    }
    /** Золотое кольцо (эллипс-обруч). */
    const ring = (cx, cy, rx, ry, w) => ({ p: tube(ell(cx, cy, rx, ry, 18).concat([[cx + rx, cy]]).map(q => [q[0], q[1], w || 6])), c: GOLD, m: 'gold', line: 0.6 });
    const orb = (x, y, r, c) => { lit(x, y); return { e: [x, y, r, r], c, m: 'gem', gloss: 1.2, line: 1, glint: [[x - r * 0.35, y - r * 0.35, r * 0.3]] }; };
    const pwin = (cx, y1, w, h) => win(cx, y1, w, h, { pointed: true, c: WLAV, lc: WLC2 });

    /* ---------- ратуша: мраморный павильон → хрустальный дворец ---------- */
    bd('hall_1', F, (cx, g) => [
      gemFloat(cx, 40, 16, 34, CRY),
      marWall(70, 200, 350, g), dome(cx, 200, 110, 96, CRY, { m: 'gem', cd: CRYD, gloss: 1 }),
      pwin(116, 300, 12, 40), pwin(304, 300, 12, 40), door(cx, g, 30, 104, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }),
      pylon(40, g, 100, FIRE), pylon(380, g, 100, WAT),
    ]);
    bd('hall_2', F, (cx, g) => [
      island(70, 70, 44, FIRE),
      marT(380, g, 44, 300, { win: [230, 320], roofH: 110 }),
      marWall(60, 250, 340, g), dome(200, 250, 116, 110, CRY, { m: 'gem', cd: CRYD, gloss: 1 }), gemFloat(200, 104, 14, 30, WLAV),
      pwin(110, 350, 12, 40), pwin(290, 350, 12, 40), door(200, g, 32, 110, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }),
      pylon(24, g, 110, EARTH),
    ]);
    bd('hall_3', F, (cx, g) => [
      island(60, 90, 44, FIRE), island(462, 70, 40, WAT),
      marT(56, g, 44, 280, { win: [260, 350], roofH: 110 }), marT(464, g, 44, 280, { win: [260, 350], roofH: 110 }),
      marWall(100, 240, 420, g), dome(cx, 240, 130, 130, CRY, { m: 'gem', cd: CRYD, gloss: 1 }), ring(cx, 170, 150, 20, 7),
      { p: gable(170, 350, 300, 70, 12), c: MAR, m: 'cloth', line: 1.2, sub: [{ p: [P(cx + 4, 226, 1), P(366, 304, 1), P(cx + 40, 304, 1)], c: MARD, m: 'flat', line: 0 }] },
      { p: tube([[156, 302, 9], [cx, 226, 9], [364, 302, 9]]), c: GOLD, m: 'gold', line: 1 }, orb(cx, 272, 14, MAGIC),
      pwin(150, 380, 12, 40), pwin(370, 380, 12, 40),
      ...[190, 230, 290, 330].map(x => ({ p: box(x - 10, 304, x + 10, g - 12), c: MAR, m: 'cloth', line: 1, sub: [shadeR(x + 3, 302, x + 12, g, MARD)] })),
      door(cx, g - 12, 30, 100, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }),
    ]);
    bd('hall_4', F, (cx, g) => {
      const out = [island(70, 80, 50, FIRE), island(490, 60, 44, WAT), island(420, 190, 24, AIR)];
      out.push(marT(76, g, 46, 330, { win: [320, 420], roofH: 130 }), marT(484, g, 46, 330, { win: [320, 420], roofH: 130 }));
      out.push(marWall(120, 330, 440, g));
      // центральный хрустальный шпиль
      out.push(marT(cx, g - 60, 74, 250, { win: [], roofH: 210, eave: 10, orb: MAGIC }));
      out.push(ring(cx, 150, 110, 18, 7), ring(cx, 90, 70, 12, 6));
      out.push(pwin(cx, 300, 14, 50), pwin(cx - 40, 380, 10, 36), pwin(cx + 40, 380, 10, 36));
      out.push(pwin(160, 440, 12, 40), pwin(400, 440, 12, 40));
      out.push(door(cx, g, 36, 120, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }));
      ELEM.forEach((c, i) => out.push(pylon([130, 200, 360, 430][i], g, 90, c)));
      out.push(gemFloat(20, 300, 12, 26, EARTH), gemFloat(540, 300, 12, 26, AIR));
      return out;
    });

    /* ---------- гильдия: мраморная башня, стихийные окна, парящие самоцветы ---------- */
    for (let L = 1; L <= 4; L++) bd('guild_' + L, F, (cx, g) => {
      const top = 210, floors = L + 1, base = g - 30, fh = (base - top) / floors, out = [];
      out.push({ p: box(cx - 86, base, cx + 86, g), c: '#d6dbe6', m: 'cloth', line: 1.2 }, { p: box(cx - 72, base - 14, cx + 72, base + 2), c: GOLD, m: 'gold', line: 1 });
      out.push(marT(cx, base - 12, 62, base - 12 - top, { roofH: 150, eave: 12, orb: MAGIC }));
      for (let i = 1; i < floors; i++) { const y = base - 12 - i * fh; out.push({ p: box(cx - 64, y - 5, cx + 64, y + 5), c: GOLD, m: 'gold', line: 0.9 }); }
      for (let i = 1; i < floors; i++) { const y = base - 12 - i * fh; out.push(win(cx, y - 14, 12, Math.min(48, fh * 0.5), { pointed: true, c: tone(ELEM[(i - 1) % 4], 0.35), lc: '#2a2a4a' })); }
      out.push(door(cx, base - 12, 22, Math.min(80, fh * 0.72), { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }));
      for (let k = 0; k < L; k++) { const a = k / L * PI * 2 + 0.6, x = cx + Math.cos(a) * 96, y = top - 40 + Math.sin(a) * 22; out.push(gemFloat(x, y, 10, 22, ELEM[k])); }
      return out;
    });

    /* ---------- таверна: мраморный дом под хрустальной кровлей, кубок ---------- */
    bd('tavern', F, (cx, g) => [
      marWall(50, 170, 300, g), hip(50, 300, 176, 90, 18, 70, CRY, { m: 'gem', cd: CRYD }),
      { p: box(236, 40, 272, 120), c: MAR, m: 'cloth', line: 1.1, sub: [shadeR(260, 38, 274, 122, MARD)] }, orb(254, 30, 12, FIRE),
      pwin(100, 250, 14, 44), pwin(250, 250, 14, 44),
      door(175, g, 26, 94, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }),
      { p: tube([[300, 200, 5], [346, 200, 5]]), c: GOLD, m: 'gold', line: 0.7 },
      { p: [P(318, 210, 1), P(342, 210, 1), [338, 230], P(332, 238, 1), P(332, 252, 1), P(340, 258, 1), P(320, 258, 1), P(328, 252, 1), P(328, 238, 1), [322, 230]], c: GOLD, m: 'gold', line: 1 },
      lamp(24, 260, 9, '#bfe8ff'), { p: tube([[24, g, 5], [24, 272, 4]]), c: GOLD, m: 'gold', line: 0.6 },
    ]);

    /* ---------- кузница: мраморная мастерская, огненная чаша, труба с пламенем ---------- */
    bd('blacksmith', F, (cx, g) => [
      { p: trap(250, 70, 200, 20, 26), c: MAR, m: 'cloth', line: 1.1, lines: masonry(224, 70, 276, 200, 22, 26, 0.25), sub: [shadeR(262, 68, 280, 202, MARD)] }, { p: box(222, 60, 278, 74), c: GOLD, m: 'gold', line: 1 }, flame(250, 62, 18, 46),
      marWall(40, 196, 300, g), hip(40, 300, 202, 70, 16, 50, CRY, { m: 'gem', cd: CRYD }),
      { p: arch(110, g, 46, 120, true), c: '#2a1a2a', m: 'cloth', ao: 1.2, line: 1.1 },
      { p: [P(74, g - 40, 1), P(146, g - 40, 1), [136, g - 20], P(84, g - 20, 1)], c: GOLD, m: 'gold', line: 1 }, { p: tube([[110, g - 20, 14], [110, g, 20]]), c: GOLD, m: 'gold', line: 0.8 },
      flame(110, g - 40, 30, 70), lamp(110, g - 60, 6, '#ffb040'),
      door(240, g, 22, 84, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }), pwin(190, 290, 10, 34),
      { p: [P(170, g - 36, 1), P(210, g - 36, 1), [222, g - 30], P(206, g - 24, 1), P(202, g - 10, 1), P(210, g, 1), P(174, g, 1), P(180, g - 10, 1), P(176, g - 24, 1)], c: '#6a6a7a', m: 'steel', line: 1 },
      crystal(18, g, 12, 50, FIRE, 0.1),
    ]);

    /* ---------- рынок: аркада, навесы четырёх стихий, парящая монета ---------- */
    bd('market', F, (cx, g) => {
      const out = [marWall(28, 110, 380, g)];
      out.push({ e: [cx, 44, 24, 24], c: GOLD, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(cx, 44, 16, 16, 12).concat([[cx + 16, 44]]), w: 3, c: '#8a6a20', a: 0.8 }] }, ring(cx, 70, 40, 8, 5));
      [[94, FIRE], [204, WAT], [314, EARTH]].forEach(([x, c], i) => {
        out.push({ p: arch(x, g, 36, 96, true), c: '#2a2438', m: 'cloth', ao: 1.2, line: 1.1 });
        out.push({ p: [P(x - 48, g - 110, 1), P(x + 48, g - 110, 1), P(x + 54, g - 84, 1), [x + 30, g - 78], [x, g - 84], [x - 30, g - 78], P(x - 54, g - 84, 1)], c, m: 'cloth', line: 1.1, lines: [{ p: [[x - 44, g - 98], [x + 44, g - 98]], w: 3, c: '#fff4d8', a: 0.6 }] });
        out.push({ p: box(x - 30, g - 28, x + 30, g), c: '#d6dbe6', m: 'cloth', line: 1 }, crystal(x - 12, g - 28, 7, 22, tone(c, 0.2), -0.1), crystal(x + 10, g - 28, 6, 18, tone(c, 0.3), 0.1));
      });
      out.push(lamp(149, 170, 6, '#bfe8ff'), lamp(259, 170, 6, '#bfe8ff'));
      return out;
    });

    /* ---------- хранилище: ротонда под хрустальным куполом, парящие ресурсы ---------- */
    bd('silo', F, (cx, g) => [
      marWall(20, 250, 120, g), hip(20, 120, 256, 50, 10, 30, CRY, { m: 'gem', cd: CRYD }),
      { p: [P(130, 170, 1), P(290, 170, 1), P(290, g, 1), [210, g + 4], P(130, g, 1)], c: MAR, m: 'cloth', line: 1.2, lines: [220, 280, 340].map(y => ({ p: [[130, y], [210, y + 10], [290, y]], w: 4, c: GOLD, a: 0.8 })), sub: [shadeR(250, 168, 292, g + 4, MARD)] },
      { p: box(124, 160, 296, 176), c: GOLD, m: 'gold', line: 1 }, dome(210, 162, 88, 90, CRY, { m: 'gem', cd: CRYD, gloss: 1 }),
      door(210, g, 22, 80, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }), pwin(170, 250, 9, 30), pwin(250, 250, 9, 30), sqwin(70, 310, 10, 12, { frame: GOLD, fm: 'gold' }),
      gemFloat(150, 40, 10, 22, FIRE), gemFloat(196, 24, 11, 24, WAT), gemFloat(244, 34, 10, 22, EARTH), gemFloat(282, 56, 9, 20, MAGIC),
    ]);

    /* ---------- Алтарь стихий: ступенчатый круг, призма, четыре сферы ---------- */
    bd('special', F, (cx, g) => {
      const out = [{ p: ell(cx, g - 14, 136, 20, 16), c: '#d6dbe6', m: 'cloth', line: 1.1 }, { p: ell(cx, g - 30, 108, 16, 16), c: MAR, m: 'cloth', line: 1.1 }];
      [[40, FIRE], [240, WAT], [90, AIR], [190, EARTH]].forEach(([x, c], i) => {
        const y0 = i < 2 ? g - 10 : g - 36, h = i < 2 ? 100 : 140;
        out.push({ p: trap(x, y0 - h, y0, 8, 14), c: MAR, m: 'cloth', line: 1, sub: [shadeR(x + 3, y0 - h - 2, x + 16, y0 + 2, MARD)] }, { p: box(x - 16, y0 - h - 8, x + 16, y0 - h + 2), c: GOLD, m: 'gold', line: 0.8 }, orb(x, y0 - h - 22, 16, c));
      });
      out.push(crystal(cx, g - 34, 26, 170, '#f4f0ff', 0), ring(cx, 110, 44, 9, 5), orb(cx, 60, 10, MAGIC));
      return out;
    });

    /* ---------- жилища ---------- */
    // 1. Поляна фей: цветущий холм, грибы, парящий островок с домиком
    bd('dwell_1', F, (cx, g) => [
      island(180, 70, 40, '#ffb0e0'), { e: [180, 50, 16, 16], c: '#f4e0c0', m: 'skin', line: 1 }, cone(180, 40, 22, 30, '#e05a9a', { rows: false }), (lit(180, 52), null),
      { p: [P(0, g, 1), [30, g - 50], [130, g - 76], [230, g - 50], P(260, g, 1)], c: '#6aa844', m: 'cloth', line: 1.1, belly: 0.3 },
      { p: tube([[70, g - 40, 16], [72, g - 110, 12]]), c: '#f0e8d8', m: 'skin', line: 1 }, { p: [P(20, g - 100, 1), [36, g - 150], [72, g - 164], [110, g - 150], P(124, g - 100, 1), [72, g - 92]], c: '#d83a5a', m: 'skin', gloss: 0.6, line: 1.1, sub: [{ e: [50, g - 132, 8, 6], c: '#fff', m: 'flat', line: 0 }, { e: [90, g - 140, 7, 5], c: '#fff', m: 'flat', line: 0 }] },
      { p: tube([[150, g - 50, 10], [150, g - 90, 8]]), c: '#f0e8d8', m: 'skin', line: 1 }, { p: [P(118, g - 84, 1), [128, g - 110], [150, g - 118], [172, g - 110], P(182, g - 84, 1), [150, g - 80]], c: '#8a5ad8', m: 'skin', gloss: 0.6, line: 1 },
      sqwin(72, g - 70, 8, 9, { cross: false, frame: '#c8b8a0' }),
      ...[[30, g - 30, '#ffd040'], [110, g - 40, '#ffffff'], [200, g - 34, '#ff8ab0'], [236, g - 16, '#c0a0ff'], [180, g - 60, '#ffd040']].map(([x, y, c]) => ({ e: [x, y, 7, 7], c, m: 'gem', line: 0.6 })),
      ...[[110, 120], [230, 150]].map(([x, y]) => ({ e: [x, y, 4, 4], c: '#fff8c0', m: 'gem', gloss: 1.2, line: 0 })),
    ]);
    // 2. Вихревая башня: мраморная башня в кольцах ветра
    bd('dwell_2', F, (cx, g) => {
      // воронка смерча: задние дуги до башни, передние — после
      const arcs = (front) => [[g - 40, 56], [g - 100, 80], [g - 160, 104], [g - 220, 128]].map(([y, rx], i) => {
        const pts = []; for (let k = 0; k <= 10; k++) { const a = front ? -0.15 + k / 10 * (PI + 0.3) : PI - 0.15 + k / 10 * (PI + 0.3); pts.push([cx + Math.cos(a) * rx + i * 6, y + Math.sin(a) * rx * 0.22, 8 + i * 3]); }
        return { p: tube(pts), c: front ? '#f4faff' : '#c8def0', m: 'gem', op: front ? 0.72 : 0.45, gloss: 0.6, line: 0.5 };
      });
      return [arcs(false), marT(cx, g, 50, 190, { win: [170, 240], roofH: 90, roofC: '#bfe2ff', orb: AIR }),
        door(cx, g, 20, 64, { pointed: true, ring: GOLD, rm: 'gold', c: '#6a5aa0', band: GOLD }), arcs(true),
        gemFloat(34, 120, 10, 22, AIR), gemFloat(290, 70, 10, 22, '#bfe2ff')];
    });
    // 3. Ключ стихий: мраморная чаша, струя воды, голубой кристалл
    bd('dwell_3', F, (cx, g) => [
      crystal(cx, 180, 26, 120, WAT, 0), crystal(cx - 40, 190, 16, 70, '#8ad0ff', -0.2), crystal(cx + 40, 190, 16, 76, '#5ab8ff', 0.2),
      { p: [P(40, 200, 1), P(313, 200, 1), [300, 250], P(260, g - 30, 1), P(94, g - 30, 1), [54, 250]], c: MAR, m: 'cloth', line: 1.2, sub: [shadeR(250, 198, 316, g, MARD)], lines: [{ p: [[46, 214], [308, 214]], w: 4, c: GOLD, a: 0.9 }] },
      water(52, 302, 190, 206, WAT, { n: 4 }),
      { p: tube([[cx - 60, 196, 10], [cx - 90, 160, 8], [cx - 120, 196, 6], [cx - 130, 240, 5]]), c: '#8ad8ff', m: 'gem', op: 0.8, line: 0.5 }, { p: tube([[cx + 60, 196, 10], [cx + 90, 160, 8], [cx + 120, 196, 6], [cx + 130, 240, 5]]), c: '#8ad8ff', m: 'gem', op: 0.8, line: 0.5 },
      { p: box(94, g - 32, 260, g), c: '#d6dbe6', m: 'cloth', line: 1.1 }, water(0, 353, g - 10, g + 4, WAT, { n: 4 }),
      lamp(cx - 50, g - 60, 7, '#bfe8ff'), lamp(cx + 50, g - 60, 7, '#bfe8ff'),
    ]);
    // 4. Огненное озеро: чаша лавы в чёрном камне, языки пламени, огненные кристаллы
    bd('dwell_4', F, (cx, g) => [
      rock([P(10, g, 1), [20, g - 70], [80, g - 100], [170, g - 108], [260, g - 100], [320, g - 70], P(330, g, 1)], '#3a2e2e'),
      { p: ell(cx, g - 90, 132, 26, 16), c: '#ff6a1a', m: 'gem', gloss: 0.8, line: 1, lc: '#6a1a0a', sub: [{ p: ell(cx - 10, g - 92, 90, 14, 14), c: '#ffc050', m: 'flat', line: 0 }] },
      flame(cx - 60, g - 96, 24, 90), flame(cx + 10, g - 100, 34, 150), flame(cx + 70, g - 96, 22, 80),
      crystal(40, g - 60, 14, 70, FIRE, -0.15), crystal(300, g - 60, 14, 80, '#ffb040', 0.15),
      (lit(cx - 60, g - 130), lit(cx + 10, g - 150), lit(cx + 70, g - 120), null),
      boulder(60, g, 26, 18, '#4a3a38'), boulder(290, g, 24, 16, '#4a3a38'),
    ]);
    // 5. Каменная пасть: скала-голова с каменными зубами, бурые кристаллы
    bd('dwell_5', F, (cx, g) => [
      rock([P(20, g, 1), [30, 260], [70, 170], [150, 120], [250, 120], [330, 170], [370, 260], P(380, g, 1)], '#8a6a44', { lines: [{ p: [[90, 190], [110, 280]], w: 2.6, a: 0.4 }, { p: [[310, 190], [290, 280]], w: 2.6, a: 0.4 }], sub: [shadeR(290, 110, 390, g + 4, '#5e4a30')] }),
      { p: [P(cx - 110, g, 1), [cx - 100, g - 110], [cx, g - 150], [cx + 100, g - 110], P(cx + 110, g, 1)], c: '#140c08', m: 'cloth', ao: 1.4, line: 1.1 },
      ...[-80, -40, 0, 40, 80].map(dx => ({ p: [P(cx + dx - 16, g - 128 + Math.abs(dx) * 0.3, 1), P(cx + dx + 16, g - 128 + Math.abs(dx) * 0.3, 1), P(cx + dx, g - 88 + Math.abs(dx) * 0.3, 1)], c: '#c8b090', m: 'horn', line: 1 })),
      ...[-90, -30, 30, 90].map(dx => ({ p: [P(cx + dx - 14, g, 1), P(cx + dx + 14, g, 1), P(cx + dx, g - 34, 1)], c: '#c8b090', m: 'horn', line: 1 })),
      { e: [cx - 60, 190, 18, 12], c: '#ffb040', m: 'gem', gloss: 1, line: 1 }, { e: [cx + 60, 190, 18, 12], c: '#ffb040', m: 'gem', gloss: 1, line: 1 }, (lit(cx - 60, 190), lit(cx + 60, 190), null),
      crystal(40, g, 16, 90, EARTH, -0.15), crystal(360, g, 16, 80, '#d8a860', 0.15), crystal(cx, 130, 14, 60, EARTH, 0),
    ]);
    // 6. Магический вихрь: кольцо-портал из камня и золота, фиолетовая воронка
    bd('dwell_6', F, (cx, g) => [
      { p: ell(cx, g - 14, 180, 20, 16), c: '#d6dbe6', m: 'cloth', line: 1.1 },
      { p: ell(cx, g - 190, 150, 170, 22), c: '#8a7a9a', m: 'horn', gloss: 0.3, line: 1.3, lines: [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * PI * 2; return { p: [[cx + Math.cos(a) * 128, g - 190 + Math.sin(a) * 146], [cx + Math.cos(a) * 150, g - 190 + Math.sin(a) * 170]], w: 3, a: 0.5 }; }) },
      { p: ell(cx, g - 190, 120, 140, 20), c: '#5a2a9a', m: 'gem', gloss: 0.8, line: 1.1, lc: '#2a0a4a', sub: [{ p: ell(cx, g - 190, 70, 86, 16), c: '#9a6aff', m: 'flat', line: 0 }, { p: ell(cx, g - 190, 30, 40, 12), c: '#f0e0ff', m: 'flat', line: 0 }],
        lines: [0, 1, 2].map(i => ({ p: [0, 1, 2, 3, 4, 5, 6].map(k => { const a = k * 0.8 + i * 2.1, r = 110 - k * 14; return [cx + Math.cos(a) * r * 0.85, g - 190 + Math.sin(a) * r]; }), w: 4, light: true, a: 0.6 })) },
      (lit(cx, g - 190), null),
      ...[[-150, 0], [150, 0], [0, -176]].map(([dx, dy]) => gemFloat(cx + dx, g - 190 + dy, 14, 28, GOLD)),
      ...[[40, 90], [400, 120], [70, 330], [380, 340]].map(([x, y], i) => rock([P(x - 22, y, 1), [x - 16, y - 16], [x + 10, y - 20], P(x + 24, y, 1), [x, y + 20]], '#7a6a8a')),
    ]);
    // 7. Гнездо жар-птиц: скальный столп с кристаллами, пылающее гнездо
    bd('dwell_7', F, (cx, g) => [
      rock([P(140, g, 1), [170, 400], [196, 300], P(210, 190, 1), P(330, 190, 1), [344, 300], [370, 400], P(400, g, 1)], '#8a6a5a', { sub: [shadeR(300, 180, 410, g + 4, '#5e4438')], lines: [{ p: [[230, 230], [240, 330], [224, 420]], w: 2.6, a: 0.45 }] }),
      crystal(160, g, 22, 120, FIRE, -0.2), crystal(390, g, 22, 140, '#ffb040', 0.2), crystal(110, g, 14, 70, '#ff5a2a', -0.3), crystal(430, g, 14, 80, FIRE, 0.25),
      hole(cx, g, 34, 90, '#1a0c08'), lamp(cx, g - 50, 6, '#ffb040'),
      { p: ell(cx, 180, 130, 34, 16), c: '#6a4428', m: 'wood', flow: 0.2, line: 1.2, lines: [-0.7, -0.2, 0.3, 0.8].map(k => ({ p: [[cx + k * 120 - 30, 166], [cx + k * 120 + 36, 192]], w: 4, c: '#3a2210', a: 0.7 })) },
      flame(cx - 70, 172, 34, 110), flame(cx + 60, 172, 34, 120), flame(cx, 176, 50, 190, { c: '#ffa030' }),
      (lit(cx, 100), lit(cx - 70, 130), lit(cx + 60, 124), null),
      ...[[-0.9, cx - 60, 120], [-2.2, cx + 50, 110]].map(([a, x, y]) => ({ p: K.leaf([x, y], a, 60, 16).body, c: '#ff8a2a', m: 'feather', line: 0.8 })),
    ]);

    /* ---------- укрепления: мраморная стена, хрустальные зубцы и башни ---------- */
    function wallC(g, top) {
      const out = [{ p: box(10, top, 970, g), c: MAR, m: 'cloth', line: 1.2, belly: 0.2, lines: masonry(10, top, 970, g, 30, 50, 0.25, 2) }, { p: box(6, top - 8, 974, top + 8), c: GOLD, m: 'gold', line: 1 }];
      for (let x = 30; x < 970; x += 60) out.push(crystal(x, top - 6, 10, 30, x % 120 === 30 ? CRY : '#bfe8ff', 0));
      return out;
    }
    function gateC(g, top) {
      return [marWall(400, top, 580, g), ...[420, 460, 520, 560].map(x => crystal(x, top - 6, 10, 40, CRY, 0)),
        gate(490, g, 46, Math.min(150, (g - top) * 0.7), { pointed: true, ring: '#d6dbe6', rw: 14, hole: '#2a3a5a', grate: '#9ad8f0' }),
        orb(490, top + 30, 12, MAGIC), pwin(440, top + 70, 9, 30), pwin(540, top + 70, 9, 30)];
    }
    bd('fort', F, (cx, g) => [wallC(g, 150), gateC(g, 70), pylon(300, g, 110, FIRE), pylon(680, g, 110, WAT)]);
    bd('citadel', F, (cx, g) => [wallC(g, 270), marT(110, g, 60, 330, { win: [220, 310], roofH: 130 }), marT(870, g, 60, 330, { win: [220, 310], roofH: 130 }), gateC(g, 190)]);
    bd('castle', F, (cx, g) => [wallC(g, 460), marT(110, g, 60, 340, { win: [400, 490], roofH: 140 }), marT(870, g, 60, 340, { win: [400, 490], roofH: 140 }),
      island(300, 120, 50, FIRE), island(690, 100, 46, WAT),
      marT(490, g, 100, 460, { win: [], roofH: 190, eave: 12, orb: MAGIC }), ring(490, 150, 130, 20, 7),
      pwin(490, 290, 14, 50), pwin(440, 380, 11, 38), pwin(540, 380, 11, 38),
      gate(490, g, 48, 150, { pointed: true, ring: '#d6dbe6', rw: 14, hole: '#2a3a5a', grate: '#9ad8f0' }), pylon(360, g, 110, EARTH), pylon(620, g, 110, AIR)]);
  }
  /* ============================== БУХТА ==============================
     Пиратский порт: песчаник, черепичные крыши, доски, паруса и канаты,
     бирюзовые ставни, бочки, пушки, маяк, чёрный флаг с черепом. */
  {
    const F = 'cove';
    const SAND = '#d8b882', SANDD = '#9a7c50', TILE = '#c4623a', TILED = '#80381e', PLANK = '#8a6440', PLANKD = '#5a3e24', SAIL = '#efe6cc', ROPE = '#c8b080', RED = '#c42a2a', TEAL = '#2a8a8a', SEA = '#2a78a8', ROCK = '#7a7268';
    /** Стена из песчаника. */
    const sandWall = (x0, y0, x1, y1, o) => ({ p: box(x0, y0, x1, y1), c: (o && o.c) || SAND, m: 'cloth', line: 1.2, belly: 0.2, lines: masonry(x0, y0, x1, y1, 24, 38, 0.35, 2.2), sub: [shadeR(x1 - (x1 - x0) * 0.18, y0 - 2, x1 + 2, y1 + 2, SANDD)] });
    /** Черепичная крыша (вальмовая). */
    const tiles = (x0, x1, y, h, e, inset) => hip(x0, x1, y, h, e, inset, TILE, { cd: TILED, rowC: TILED, tiles: 18, n: 5 });
    /** Круглая башня из песчаника с черепичным конусом. */
    function sTower(cx, G, hw, h, o) {
      o = o || {}; const top = G - h, out = [];
      out.push({ p: [P(cx - hw, top, 1), P(cx + hw, top, 1), P(cx + hw, G, 1), [cx, G + 5], P(cx - hw, G, 1)], c: SAND, m: 'cloth', line: 1.2, lines: masonry(cx - hw, top, cx + hw, G, 24, hw * 0.9, 0.35, 2.2), sub: [shadeR(cx + hw * 0.4, top - 2, cx + hw + 2, G + 6, SANDD)] });
      if (o.top === 'crenel') out.push(merlons(cx - hw - 6, cx + hw + 6, top - 2, 14, (hw * 2 + 12) / 3.6, '#e2c690', { ph: 12 }));
      else out.push({ p: box(cx - hw - 6, top - 6, cx + hw + 6, top + 6), c: '#e2c690', m: 'cloth', line: 1 }, cone(cx, top - 4, hw + (o.eave || 10), o.roofH || hw * 1.7, TILE, { cd: TILED, rowC: TILED, flare: 0.1 }));
      for (const y of o.win || []) out.push(win(cx, y, o.ww || Math.max(7, hw * 0.22), o.wh || Math.max(18, hw * 0.55), { ring: '#e8d0a0' }));
      return out;
    }
    /** Бирюзовые ставни + окно. */
    const swin = (cx, cy, w, h) => sqwin(cx, cy, w, h, { shutters: TEAL, sill: '#e8d0a0' });
    /** Флаг: чёрный с черепом. */
    function jolly(x, y, L, o) {
      o = o || {}; const fw = L * 0.7, fh = L * 0.42, top = y - L;
      return [{ p: tube([[x, y, 5], [x, top - 3, 4]]), c: '#4a3a2a', m: 'wood', line: 0.7 },
        { p: [P(x + 1.5, top, 1), [x + fw * 0.5, top + fh * 0.08], P(x + fw, top + fh * 0.1, 1), [x + fw * 0.94, top + fh * 0.5], P(x + fw, top + fh, 1), [x + fw * 0.5, top + fh * 0.9], P(x + 1.5, top + fh, 1)], c: '#1e1e22', m: 'cloth', line: 0.9 },
        skull(x + fw * 0.5, top + fh * 0.44, fh * 0.26, { c: '#f0ece0' })];
    }
    /** Дощатая стена. */
    const plankW = (x0, y0, x1, y1, c) => ({ p: box(x0, y0, x1, y1), c: c || PLANK, m: 'wood', flow: 0, line: 1.2, lines: planks(x0, y0, x1, y1, 16, false, 0.5), sub: [shadeR(x1 - (x1 - x0) * 0.2, y0 - 2, x1 + 2, y1 + 2, PLANKD)] });
    /** Канат-гирлянда. */
    const rope = (x0, y0, x1, y1, sag) => ({ p: tube([[x0, y0, 3], [(x0 + x1) / 2, (y0 + y1) / 2 + (sag || 16), 3], [x1, y1, 3]]), c: ROPE, m: 'cloth', line: 0.4 });
    /** Пушка на лафете (смотрит в сторону s). */
    const cannon = (x, y, s) => [{ p: tube([[x - s * 14, y - 10, 16], [x + s * 36, y - 16, 10]]), c: '#2e2e34', m: 'steel', line: 1 }, { e: [x - s * 4, y - 4, 10, 10], c: PLANKD, m: 'wood', line: 1 }];
    /** Якорь. */
    const anchor = (x, y, s) => [{ p: tube([[x, y - 40 * s, 6], [x, y + 30 * s, 6]]), c: '#3a3a42', m: 'steel', line: 0.8 }, { p: tube([[x - 26 * s, y + 10 * s, 5], [x - 20 * s, y + 30 * s, 6], [x, y + 36 * s, 6], [x + 20 * s, y + 30 * s, 6], [x + 26 * s, y + 10 * s, 5]]), c: '#3a3a42', m: 'steel', line: 0.8 }, { p: tube([[x - 14 * s, y - 26 * s, 5], [x + 14 * s, y - 26 * s, 5]]), c: '#3a3a42', m: 'steel', line: 0.8 }, { e: [x, y - 44 * s, 6 * s, 6 * s], c: '#3a3a42', m: 'steel', line: 0.8 }];
    const sea = (x0, x1, G) => water(x0, x1, G - 14, G + 4, SEA, { n: 5 });
    const pier = (x0, x1, y, G) => [...[x0 + 12, (x0 + x1) / 2, x1 - 12].map(x => post(x, G + 2, y, 10, PLANKD)), { p: box(x0, y - 10, x1, y + 4), c: PLANK, m: 'wood', flow: 0, line: 1, lines: planks(x0, y - 10, x1, y + 4, 18, true, 0.5) }];
    function stilts(x0, x1, deck, G, st) {
      const out = []; for (let x = x0 + 8; x <= x1 - 8; x += st || 40) out.push(post(x, G + 2, deck, 11, PLANKD));
      out.push({ p: box(x0 - 8, deck - 10, x1 + 8, deck + 6), c: PLANK, m: 'wood', flow: 0, line: 1.1, lines: planks(x0 - 8, deck - 10, x1 + 8, deck + 6, 20, true, 0.5) });
      return out;
    }
    const lantern = (x, y) => [{ p: tube([[x, y - 20, 2], [x, y - 8, 2]]), c: IRON, m: 'steel', line: 0 }, { p: box(x - 7, y - 8, x + 7, y + 10), c: '#2e2e34', m: 'steel', line: 0.8 }, lamp(x, y + 1, 5)];

    /* ---------- ратуша: дом капитана → укреплённый дворец губернатора ---------- */
    bd('hall_1', F, (cx, g) => [
      sandWall(70, 180, 350, g), tiles(70, 350, 186, 90, 18, 70),
      { p: box(60, 262, 360, 272), c: PLANK, m: 'wood', flow: 0, line: 1, lines: [{ p: [[62, 240], [358, 240]], w: 3, c: PLANKD, a: 0.9 }, ...[70, 110, 150, 270, 310, 350].map(x => ({ p: [[x, 240], [x, 262]], w: 2.4, c: PLANKD, a: 0.9 }))] },
      swin(120, 220, 13, 16), swin(210, 220, 13, 16), swin(300, 220, 13, 16), swin(120, 310, 13, 16), swin(300, 310, 13, 16),
      door(cx, g, 26, 80, { ring: '#e8d0a0', c: PLANKD, lamp: [cx + 40, g - 90] }),
      barrel(30, g, 18, 44), barrel(390, g, 18, 44, '#7a4a28'), flag(330, 126, 50, RED, { fw: 32, fh: 18 }),
    ]);
    bd('hall_2', F, (cx, g) => [
      sTower(56, g, 46, 300, { win: [220, 300] }),
      sandWall(100, 220, 420, g), tiles(100, 420, 226, 100, 18, 80),
      { p: box(92, 312, 428, 322), c: PLANK, m: 'wood', flow: 0, line: 1, lines: [{ p: [[94, 290], [426, 290]], w: 3, c: PLANKD, a: 0.9 }, ...[100, 150, 200, 320, 370, 420].map(x => ({ p: [[x, 290], [x, 312]], w: 2.4, c: PLANKD, a: 0.9 }))] },
      swin(150, 264, 14, 17), swin(260, 264, 14, 17), swin(370, 264, 14, 17), swin(150, 370, 14, 17), swin(370, 370, 14, 17),
      door(260, g, 28, 92, { ring: '#e8d0a0', c: PLANKD, lamp: [304, g - 100] }),
      jolly(400, 150, 56), barrel(440, g, 16, 40),
    ]);
    bd('hall_3', F, (cx, g) => [
      sTower(50, g, 44, 330, { win: [230, 310] }), sTower(470, g, 44, 330, { win: [230, 310] }), flag(470, 60, 48, RED, { fw: 32, fh: 18 }),
      sandWall(92, 220, 428, g), tiles(92, 428, 226, 96, 16, 80),
      { p: gable(200, 320, 226, 90, 10), c: SAND, m: 'cloth', line: 1.2, sub: [{ p: [P(cx + 4, 132, 1), P(336, 230, 1), P(cx + 30, 230, 1)], c: SANDD, m: 'flat', line: 0 }] }, { p: tube([[190, 228, 9], [cx, 128, 9], [330, 228, 9]]), c: TILE, m: 'leather', line: 1 },
      porthole(cx, 186, 18, { ring: GOLD }),
      swin(140, 264, 13, 16), swin(210, 264, 13, 16), swin(310, 264, 13, 16), swin(380, 264, 13, 16),
      // аркада первого этажа
      ...[130, 190, 330, 390].map(x => ({ p: arch(x, g, 22, 80), c: '#3a2a1c', m: 'cloth', ao: 1.2, line: 1.1 })),
      ...[130, 390].map(x => lamp(x, g - 50, 6)),
      door(cx, g, 32, 100, { ring: '#e8d0a0', c: PLANKD }),
      { p: box(92, 300, 428, 312), c: '#e8d0a0', m: 'cloth', line: 1 },
    ]);
    bd('hall_4', F, (cx, g) => {
      const out = [];
      for (const x of [60, 500]) out.push(sTower(x, g, 54, 380, { win: [280, 380, 470], top: 'crenel' }), cannon(x, 186, x < cx ? -1 : 1));
      out.push(sandWall(110, 300, 450, g), merlons(104, 456, 298, 16, 26, '#e2c690', { k: 0.5 }));
      // центральный дворец с колокольней
      out.push(sandWall(150, 170, 410, 300), tiles(150, 410, 176, 80, 16, 60));
      out.push(sandWall(cx - 40, 40, cx + 40, 110), { p: arch(cx, 100, 22, 56), c: '#2a1c14', m: 'cloth', line: 1 }, { p: [P(cx - 14, 92, 1), [cx - 12, 70], [cx, 62], [cx + 12, 70], P(cx + 14, 92, 1)], c: GOLD, m: 'gold', line: 0.9 }, cone(cx, 44, 52, 56, TILE, { cd: TILED, rowC: TILED }));
      out.push(sandWall(cx - 46, 108, cx + 46, 180));
      out.push(porthole(cx, 140, 16, { ring: GOLD }), jolly(cx, -10, 50));
      out.push(swin(190, 226, 13, 16), swin(250, 226, 13, 16), swin(310, 226, 13, 16), swin(370, 226, 13, 16));
      out.push(swin(160, 360, 14, 17), swin(400, 360, 14, 17), swin(160, 460, 14, 17), swin(400, 460, 14, 17));
      out.push(door(cx, g, 38, 124, { ring: '#e8d0a0', c: PLANKD, lamp: [cx, g - 150] }));
      out.push(flag(60, 118, 50, RED, { fw: 32, fh: 18, left: true }), flag(500, 118, 50, RED, { fw: 32, fh: 18 }));
      out.push(anchor(cx - 80, g - 60, 1), barrel(cx + 90, g, 18, 44));
      return out;
    });

    /* ---------- гильдия: башня звездочёта-штурмана, балконы, армиллярная сфера ---------- */
    for (let L = 1; L <= 4; L++) bd('guild_' + L, F, (cx, g) => {
      const top = 206, floors = L + 1, base = g - 20, fh = (base - top) / floors, out = [];
      out.push({ p: box(cx - 80, base, cx + 80, g), c: '#c8a878', m: 'cloth', line: 1.2 });
      out.push({ p: trap(cx, top, base, 48, 62), c: SAND, m: 'cloth', line: 1.2, lines: masonry(cx - 62, top, cx + 62, base, 24, 50, 0.35, 2.2), sub: [{ p: [P(cx + 20, top - 2, 1), P(cx + 66, top - 2, 1), P(cx + 66, base + 2, 1), P(cx + 26, base + 2, 1)], c: SANDD, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) {
        const y = base - i * fh, hw = 62 - 14 * (base - y) / (base - top);
        out.push({ p: box(cx - hw - 14, y - 4, cx + hw + 14, y + 6), c: PLANK, m: 'wood', flow: 0, line: 1, lines: [{ p: [[cx - hw - 12, y - 20], [cx + hw + 12, y - 20]], w: 3, c: PLANKD, a: 0.9 }, ...[-1, -0.5, 0.5, 1].map(k => ({ p: [[cx + k * (hw + 10), y - 20], [cx + k * (hw + 10), y - 4]], w: 2.4, c: PLANKD, a: 0.9 }))] });
        out.push(win(cx + (i % 2 ? -14 : 14), y - 26, 11, Math.min(44, fh * 0.44), { c: '#9ad8ff', lc: '#1a3a5a', ring: '#e8d0a0' }));
      }
      out.push(door(cx, base, 22, Math.min(78, fh * 0.72), { ring: '#e8d0a0', c: PLANKD }));
      out.push({ p: box(cx - 60, top - 8, cx + 60, top + 6), c: '#e2c690', m: 'cloth', line: 1 }, cone(cx, top - 6, 66, 110, TILE, { cd: TILED, rowC: TILED, flare: 0.12 }));
      // армиллярная сфера
      const oy = top - 150;
      out.push({ p: tube([[cx, top - 108, 6], [cx, oy + 20, 5]]), c: GOLD, m: 'gold', line: 0.6 });
      out.push(ring(cx, oy, 26, 26, 4), ring(cx, oy, 26, 9, 4), { e: [cx, oy, 9, 9], c: '#6ad0ff', m: 'gem', gloss: 1.2, line: 0.8 }); lit(cx, oy);
      for (let k = 0; k < L; k++) out.push({ e: [cx - 50 + k * 34, top + 26, 5, 5], c: ['#ffd060', '#9ad8ff', '#ff8a60', '#c0a0ff'][k], m: 'gem', gloss: 1, line: 0.5 });
      return out;
    });
    function ring(cx, cy, rx, ry, w) { return { p: tube(ell(cx, cy, rx, ry, 18).concat([[cx + rx, cy]]).map(q => [q[0], q[1], w])), c: GOLD, m: 'gold', line: 0.5 }; }

    /* ---------- таверна: трактир у пирса, вывеска-кружка, фонари, бочки ---------- */
    bd('tavern', F, (cx, g) => [
      { p: box(236, 30, 270, 120), c: SAND, m: 'cloth', line: 1.1, lines: masonry(236, 30, 270, 120, 16, 17, 0.4), sub: [shadeR(258, 28, 272, 122, SANDD)] }, { p: box(230, 22, 276, 34), c: '#e2c690', m: 'cloth', line: 1 },
      sandWall(44, 210, 316, g),
      plankW(36, 120, 324, 214), { p: box(28, 208, 332, 220), c: PLANKD, m: 'wood', flow: 0, line: 1 },
      tiles(36, 324, 126, 84, 18, 70),
      swin(90, 166, 14, 16), swin(180, 166, 14, 16), swin(270, 166, 14, 16),
      sqwin(96, 272, 16, 20, { shutters: TEAL }), sqwin(264, 272, 16, 20, { shutters: TEAL }),
      door(180, g, 26, 90, { ring: '#e8d0a0', c: PLANKD }), lantern(224, 250),
      { p: tube([[316, 234, 5], [354, 234, 5]]), c: IRON, m: 'steel', line: 0.8 }, { p: box(318, 244, 354, 288), c: '#8a5a30', m: 'wood', flow: 0, line: 1.2, sub: [{ p: box(328, 254, 344, 280), c: GOLD, m: 'gold', line: 0.8 }, { e: [348, 266, 5, 8], c: '#8a5a30', m: 'flat', line: 0 }, { p: box(326, 250, 346, 258), c: '#f4ecd8', m: 'flat', line: 0 }] },
      barrel(24, g, 18, 46), barrel(24, g - 46, 16, 36, '#7a4a28'), barrel(62, g, 16, 40),
      rope(36, 118, 180, 118, 18),
    ]);

    /* ---------- кузница: горн из песчаника, якорь, труба ---------- */
    bd('blacksmith', F, (cx, g) => [
      { p: trap(250, 40, 210, 22, 28), c: SAND, m: 'cloth', line: 1.1, lines: masonry(222, 40, 278, 210, 18, 22, 0.4), sub: [shadeR(262, 38, 280, 212, SANDD)] }, { p: box(220, 30, 280, 44), c: IRON, m: 'steel', line: 1 },
      sandWall(40, 200, 300, g), tiles(40, 300, 206, 84, 16, 60),
      { p: arch(106, g, 44, 120), c: '#2a1a12', m: 'cloth', ao: 1.2, line: 1.1 }, { p: ell(106, g - 26, 34, 20, 12), c: '#ff7a24', m: 'gem', gloss: 1, line: 0 }, flame(106, g - 30, 22, 50), lamp(106, g - 44, 5, '#ffb040'),
      door(226, g, 22, 84, { ring: '#e8d0a0', c: PLANKD }), swin(270, 262, 11, 14),
      anchor(180, 270, 1),
      { p: [P(6, g - 40, 1), P(58, g - 40, 1), [70, g - 34], P(52, g - 26, 1), P(46, g - 12, 1), P(56, g, 1), P(12, g, 1), P(22, g - 12, 1), P(16, g - 26, 1)], c: '#4a4a52', m: 'steel', line: 1 },
    ]);

    /* ---------- рынок: причал с лавками под парусиной, ящики, сети ---------- */
    bd('market', F, (cx, g) => {
      const out = [sea(0, 407, g), pier(0, 407, g - 20, g)];
      out.push(post(cx, g - 30, 60, 12, PLANKD), { e: [cx, 44, 22, 22], c: GOLD, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(cx, 44, 14, 14, 12).concat([[cx + 14, 44]]), w: 3, c: '#8a6a20', a: 0.8 }] });
      for (const [x0, c] of [[20, RED], [240, TEAL]]) {
        out.push(post(x0 + 8, g - 28, 110, 8, PLANKD), post(x0 + 142, g - 28, 110, 8, PLANKD));
        const st = []; for (let x = x0; x < x0 + 150; x += 30) st.push({ p: box(x, 100, x + 15, 140), c: SAIL, m: 'flat', line: 0 });
        out.push({ p: [P(x0 - 10, 104, 1), P(x0 + 160, 104, 1), P(x0 + 168, 134, 1), [x0 + 120, 142], [x0 + 75, 134], [x0 + 30, 142], P(x0 - 18, 134, 1)], c, m: 'cloth', line: 1.1, sub: st });
        out.push({ p: box(x0 + 4, g - 70, x0 + 146, g - 30), c: PLANK, m: 'wood', flow: 0, line: 1 });
      }
      out.push(crate(40, g - 108, 76, g - 70), { p: ell(110, g - 82, 16, 12, 10), c: '#8aa0b0', m: 'steel', line: 0.8 }, { p: ell(140, g - 80, 12, 10, 10), c: '#e0a040', m: 'skin', line: 1 });
      out.push({ p: ell(270, g - 84, 18, 14, 10), c: '#d8b060', m: 'gold', line: 1 }, crate(300, g - 104, 334, g - 70), { p: ell(360, g - 80, 12, 10, 10), c: '#b83a3a', m: 'skin', line: 1 });
      out.push({ p: [P(170, g - 30, 1), [176, g - 80], [200, g - 96], [226, g - 80], P(234, g - 30, 1)], c: '#b8a878', m: 'cloth', line: 1, lines: [0, 1, 2, 3].map(i => ({ p: [[178 + i * 14, g - 90], [184 + i * 14, g - 34]], w: 1.6, a: 0.6 })).concat([0, 1, 2].map(i => ({ p: [[174, g - 74 + i * 14], [230, g - 74 + i * 14]], w: 1.6, a: 0.6 }))) });
      out.push(lantern(cx - 40, 170), lantern(cx + 40, 170));
      return out;
    });

    /* ---------- хранилище: склад с грузовой стрелой, бочки ---------- */
    bd('silo', F, (cx, g) => [
      sandWall(20, 200, 250, g), tiles(20, 250, 206, 90, 14, 60),
      { p: box(80, 250, 180, g), c: PLANKD, m: 'wood', flow: -PI / 2, line: 1.1, lines: [{ p: [[80, 250], [180, g]], w: 4, c: PLANK, a: 0.9 }, { p: [[180, 250], [80, g]], w: 4, c: PLANK, a: 0.9 }] },
      swin(50, 250, 11, 13), swin(214, 250, 11, 13), porthole(135, 160, 13, { ring: '#e8d0a0', rm: 'cloth' }),
      // грузовая стрела
      post(280, g, 60, 14, PLANKD), beam(280, 70, 210, 44, 9, PLANK), beam(280, 150, 212, 50, 6, PLANK),
      { p: tube([[214, 50, 2.5], [214, 120, 2.5]]), c: ROPE, m: 'cloth', line: 0 }, crate(196, 120, 232, 156, '#a07848'),
      barrel(262, g, 16, 40), barrel(298, g, 16, 40, '#7a4a28'), barrel(280, g - 40, 14, 34), sack(20, g, 16, 34),
      lamp(135, 236, 6),
    ]);

    /* ---------- Маяк: полосатая башня на скале, фонарь, домик смотрителя ---------- */
    bd('special', F, (cx, g) => {
      const out = [sea(0, 280, g), rock([P(20, g, 1), [26, g - 40], [80, g - 64], [200, g - 66], [256, g - 40], P(264, g, 1)], ROCK)];
      out.push(plankW(170, g - 120, 262, g - 50), tiles(170, 262, g - 114, 44, 10, 30), swin(216, g - 88, 11, 13));
      const top = -100, bands = [];
      for (let y = top + 70; y < g - 60; y += 60) bands.push({ p: box(cx - 60, y, cx + 60, y + 30), c: RED, m: 'flat', line: 0 });
      out.push({ p: trap(cx - 16, top, g - 56, 28, 42), c: '#f2eee6', m: 'cloth', line: 1.2, sub: bands.concat([shadeR(cx, top - 2, cx + 40, g - 50, '#a09888')]) });
      out.push(win(cx - 16, top + 120, 8, 22, {}), win(cx - 16, top + 240, 8, 22, {}));
      out.push({ p: box(cx - 60, top - 10, cx + 28, top + 4), c: '#3a3a42', m: 'steel', line: 1, lines: [{ p: [[cx - 58, top - 24], [cx + 26, top - 24]], w: 3, c: '#3a3a42', a: 0.9 }] });
      out.push({ p: box(cx - 40, top - 56, cx + 8, top - 10), c: '#ffd860', m: 'gem', gloss: 1, line: 1, lc: '#3a2a10', lines: [{ p: [[cx - 16, top - 56], [cx - 16, top - 10]], w: 3, c: '#3a3a42', a: 0.9 }] }); lit(cx - 16, top - 34); lit(cx - 30, top - 30);
      out.push(dome(cx - 16, top - 52, 30, 30, RED, { m: 'steel' }), { p: tube([[cx - 16, top - 80, 4], [cx - 16, top - 96, 3]]), c: '#3a3a42', m: 'steel', line: 0.5 });
      out.push(door(cx - 16, g - 58, 14, 40, { c: PLANKD, bands: false }));
      return out;
    });

    /* ---------- жилища ---------- */
    // 1. Хижина нимф: грот-раковина над водой, жемчуг, кораллы
    bd('dwell_1', F, (cx, g) => {
      const out = [sea(0, 260, g)];
      const rib = []; for (let k = -3; k <= 3; k++) rib.push({ p: [[cx, g - 30], [cx + k * 30, g - 160 + Math.abs(k) * 16]], w: 3, a: 0.5 });
      out.push({ p: [P(cx - 110, g - 24, 1), [cx - 106, g - 100], [cx - 60, g - 160], [cx, g - 176], [cx + 60, g - 160], [cx + 106, g - 100], P(cx + 110, g - 24, 1), [cx + 60, g - 36], [cx, g - 24], [cx - 60, g - 36]], c: '#f4d8d0', m: 'skin', gloss: 0.8, line: 1.2, lines: rib, sub: [shadeR(cx + 50, g - 190, cx + 120, g, '#c8a8a0')] });
      out.push({ p: arch(cx, g - 20, 38, 90), c: '#1a3a4a', m: 'cloth', ao: 1.2, line: 1 }, { e: [cx, g - 58, 13, 13], c: '#f8f4ff', m: 'gem', gloss: 1.2, line: 0.8 }); lit(cx, g - 58);
      out.push({ p: ell(cx, g - 14, 100, 12, 14), c: '#e8c8a0', m: 'cloth', line: 1 });
      for (const [x, s, c] of [[22, 1, '#e05a6a'], [236, -1, '#f08a5a']]) out.push({ p: tube([[x, g, 8], [x + s * 4, g - 50, 6], [x + s * 18, g - 76, 3]]), c, m: 'skin', line: 0.8 }, { p: tube([[x + s * 2, g - 30, 5], [x - s * 14, g - 60, 3]]), c, m: 'skin', line: 0.8 });
      out.push(...[[cx - 60, g - 22], [cx + 56, g - 20], [cx + 76, g - 26]].map(([x, y]) => ({ e: [x, y, 6, 6], c: '#f8f4f0', m: 'gem', gloss: 1.2, line: 0.5 })));
      return out;
    });
    // 2. Матросский кубрик: перевёрнутая лодка-крыша над дощатым срубом, вёсла
    bd('dwell_2', F, (cx, g) => [
      plankW(40, 150, 270, g),
      { p: [P(14, 160, 1), [40, 110], [cx, 90], [274, 110], P(300, 160, 1), [cx, 170]], c: '#6a4424', m: 'wood', flow: 0, line: 1.2, lines: [{ p: [[24, 150], [cx, 118], [290, 150]], w: 3, a: 0.6 }, { p: [[40, 130], [cx, 102], [274, 130]], w: 3, a: 0.6 }, { p: [[20, 158], [296, 158]], w: 7, c: '#c89a3a', a: 0.9 }], sub: [{ p: [[cx + 30, 80], [310, 110], [310, 176], [cx + 50, 176]], c: '#4a2e18', m: 'flat', line: 0 }] },
      porthole(90, 210, 11, { ring: '#c89a3a' }), porthole(230, 210, 11, { ring: '#c89a3a' }),
      door(cx, g, 24, 80, { c: PLANKD, ring: '#6a4424' }),
      beam(290, g, 300, 110, 5, '#a07848'), { p: ell(302, 104, 8, 20, 8), c: '#a07848', m: 'wood', line: 0.8 },
      barrel(20, g, 16, 40), { p: tube([[70, 110, 2], [70, 130, 2]]), c: ROPE, m: 'cloth', line: 0 }, lamp(70, 136, 6),
      jolly(cx + 40, 92, 44),
    ]);
    // 3. Пиратская пещера: скала, дощатая дверь, сундук, череп на флаге
    bd('dwell_3', F, (cx, g) => [
      rock([P(10, g, 1), [16, 200], [60, 120], [140, 80], [230, 90], [300, 140], [340, 220], P(346, g, 1)], ROCK, { sub: [shadeR(260, 70, 360, g + 4, '#524c46')], lines: [{ p: [[70, 150], [90, 230]], w: 2.4, a: 0.4 }] }),
      { p: arch(cx, g, 56, 150), c: '#2a1c14', m: 'cloth', line: 1.1 },
      { p: arch(cx, g, 48, 136), c: PLANK, m: 'wood', flow: -PI / 2, line: 1.1, lines: planks(cx - 48, g - 136, cx + 48, g, 16, true, 0.55).concat([{ p: [[cx - 48, g - 40], [cx + 48, g - 40]], w: 4, c: IRON, a: 0.9 }, { p: [[cx - 48, g - 100], [cx + 48, g - 100]], w: 4, c: IRON, a: 0.9 }]) },
      skull(cx, g - 150, 18, { c: '#f0ece0' }), { p: tube([[cx - 26, g - 170, 5], [cx + 26, g - 130, 5]]), c: '#f0ece0', m: 'horn', line: 0.6 }, { p: tube([[cx + 26, g - 170, 5], [cx - 26, g - 130, 5]]), c: '#f0ece0', m: 'horn', line: 0.6 },
      jolly(250, 100, 70), lantern(cx - 74, g - 70), lantern(cx + 74, g - 70),
      { p: box(250, g - 44, 316, g), c: '#7a4a28', m: 'wood', flow: 0, line: 1.1, lines: [{ p: [[250, g - 30], [316, g - 30]], w: 4, c: GOLD, a: 0.9 }] }, { p: [P(248, g - 44, 1), [254, g - 62], [283, g - 68], [312, g - 62], P(318, g - 44, 1)], c: '#8a5a30', m: 'wood', line: 1 }, { e: [283, g - 44, 8, 6], c: GOLD, m: 'gold', line: 0.6 },
      ...[[262, g - 66], [276, g - 70], [298, g - 68]].map(([x, y]) => ({ e: [x, y, 6, 5], c: '#ffd040', m: 'gold', line: 0.5 })),
    ]);
    // 4. Скала буревестников: морской утёс с гнёздами и птицами
    bd('dwell_4', F, (cx, g) => {
      const out = [sea(0, 340, g), rock([P(60, g, 1), [70, 200], [100, 120], P(130, 50, 1), [170, 30], P(210, 60, 1), [240, 130], [270, 210], P(290, g, 1)], ROCK, { sub: [shadeR(200, 20, 300, g + 4, '#524c46')], lines: [{ p: [[120, 110], [140, 200], [120, 270]], w: 2.6, a: 0.45 }, { p: [[70, 180], [260, 176]], w: 2.2, a: 0.35 }] })];
      for (const [x, y, w] of [[170, 44, 50], [110, 160, 40], [240, 190, 42]]) out.push({ p: ell(x, y, w, 12, 12), c: '#6a5030', m: 'wood', flow: 0, line: 1, lines: [{ p: [[x - w + 6, y - 2], [x + w - 6, y + 2]], w: 3, c: '#3a2a14', a: 0.6 }] });
      out.push(hole(180, g, 30, 70, '#141820'), lamp(180, g - 36, 5));
      for (const [x, y, k] of [[40, 70, 1], [300, 40, 1.2], [260, 110, 0.9], [60, 150, 0.8]]) out.push({ p: [P(x - 26 * k, y - 4 * k, 1), [x - 12 * k, y - 14 * k], P(x, y, 1), [x + 12 * k, y - 14 * k], P(x + 26 * k, y - 4 * k, 1), [x + 12 * k, y - 8 * k], [x, y + 4 * k], [x - 12 * k, y - 8 * k]], c: '#e8eef4', m: 'feather', line: 0.8 });
      out.push({ p: [P(250, 0, 1), P(268, 30, 1), P(256, 30, 1), P(272, 64, 1), P(244, 26, 1), P(256, 26, 1)], c: '#fff4a0', m: 'gem', gloss: 1, line: 0.7 });
      return out;
    });
    // 5. Хижина ведьмы: кривая хижина на сваях, котёл с зелёным варевом, травы
    bd('dwell_5', F, (cx, g) => [
      sea(0, 400, g), stilts(90, 330, g - 60, g, 40),
      { p: [P(110, g - 70, 1), P(104, 170, 1), P(318, 150, 1), P(310, g - 70, 1)], c: '#6a5a4a', m: 'wood', flow: -PI / 2, line: 1.2, lines: planks(104, 150, 318, g - 70, 18, true, 0.5), sub: [shadeR(270, 140, 320, g - 60, '#4a3e32')] },
      { p: [P(80, 184, 1), [140, 110], P(230, 40, 1), [250, 26], P(270, 34, 1), [300, 90], P(344, 164, 1), [210, 176]], c: '#7a6848', m: 'fur', furLen: 1.1, flow: PI / 2, line: 1.2, belly: 0.3, lines: [{ p: [[120, 150], [170, 144]], w: 12, c: '#8a5a8a', a: 0.8 }, { p: [[250, 110], [300, 120]], w: 12, c: '#5a7a5a', a: 0.8 }] },
      sqwin(160, 250, 14, 16, { c: '#9af070', lc: '#1a3a1a', frame: PLANKD, cross: false }), sqwin(270, 236, 12, 14, { c: '#c890ff', lc: '#2a1a3a', frame: PLANKD }),
      door(214, g - 70, 22, 76, { c: '#3a2e24', bands: false }),
      { p: [P(10, g - 60, 1), P(80, g - 60, 1), [84, g - 30], [60, g - 6], [30, g - 6], [6, g - 30]], c: '#2e2e34', m: 'steel', line: 1 }, { p: ell(45, g - 62, 36, 8, 12), c: '#7af040', m: 'gem', gloss: 1, line: 0.8 }, (lit(45, g - 70), null),
      ...[[34, g - 90, 10], [56, g - 110, 8], [40, g - 132, 6]].map(([x, y, r]) => ({ e: [x, y, r, r], c: '#a8f890', m: 'gem', op: 0.6, line: 0 })),
      flame(45, g - 2, 20, 26), { p: tube([[120, 200, 2], [300, 190, 2]]), c: ROPE, m: 'cloth', line: 0 },
      ...[140, 180, 240, 280].map((x, i) => ({ p: ell(x, 212 - i * 2, 6, 14, 8), c: ['#6a9a3a', '#8a5a3a', '#9aba5a', '#6a4a7a'][i], m: 'feather', line: 0.6 })),
      skull(356, g - 100, 12), post(356, g, g - 90, 6, PLANKD),
    ]);
    // 6. Заводь никс: каменная арка над бирюзовой водой, кораллы, трезубец
    bd('dwell_6', F, (cx, g) => [
      { p: ell(cx, g - 30, 200, 36, 16), c: '#9a8e7a', m: 'horn', line: 1.1 }, { p: ell(cx, g - 34, 176, 26, 16), c: '#2aa0a8', m: 'gem', gloss: 0.6, line: 1, lines: [0, 1, 2].map(i => ({ p: [[cx - 120 + i * 90, g - 38 + i * 4], [cx - 90 + i * 90, g - 38 + i * 4]], w: 2.4, light: true, a: 0.7 })) },
      { p: [P(cx - 150, g - 40, 1), P(cx - 150, 200, 1), [cx - 130, 110], [cx - 60, 60], [cx, 50], [cx + 60, 60], [cx + 130, 110], P(cx + 150, 200, 1), P(cx + 150, g - 40, 1), P(cx + 104, g - 40, 1), P(cx + 104, 200, 1), [cx + 90, 140], [cx, 100], [cx - 90, 140], P(cx - 104, 200, 1), P(cx - 104, g - 40, 1)], c: '#c8b898', m: 'cloth', line: 1.2, lines: masonry(cx - 150, 50, cx + 150, g - 40, 30, 40, 0.3), sub: [shadeR(cx + 110, 40, cx + 160, g, '#8a7a60')] },
      { e: [cx, 76, 16, 16], c: '#6af0e0', m: 'gem', gloss: 1.2, line: 1 }, (lit(cx, 76), null),
      { p: tube([[cx, g - 40, 7], [cx, 170, 6]]), c: GOLD, m: 'gold', line: 0.8 }, { p: tube([[cx - 24, 150, 5], [cx - 24, 176, 5], [cx + 24, 176, 5], [cx + 24, 150, 5]]), c: GOLD, m: 'gold', line: 0.8 }, { p: [P(cx - 4, 176, 1), P(cx, 130, 1), P(cx + 4, 176, 1)], c: GOLD, m: 'gold', line: 0.8 },
      ...[[40, '#e05a6a'], [400, '#f08a5a'], [80, '#c85ac8']].map(([x, c], i) => ({ p: tube([[x, g - 30, 10], [x + (i ? -1 : 1) * 10, g - 90, 7], [x + (i ? -1 : 1) * 30, g - 120, 3]]), c, m: 'skin', line: 0.8 })),
      lamp(cx - 127, 230, 6, '#9af0e8'), lamp(cx + 127, 230, 6, '#9af0e8'),
    ]);
    // 7. Логово морских змеев: морская пещера, из воды выгибаются кольца змея
    bd('dwell_7', F, (cx, g) => {
      const out = [rock([P(0, g, 1), [10, 240], [60, 140], [160, 80], [300, 70], [420, 100], [500, 180], [536, 280], P(540, g, 1)], ROCK, { sub: [shadeR(420, 60, 550, g + 4, '#524c46')], lines: [{ p: [[80, 180], [100, 300]], w: 2.6, a: 0.4 }, { p: [[460, 180], [440, 320]], w: 2.6, a: 0.4 }] })];
      out.push({ p: arch(cx, g, 150, 280), c: '#0e1a24', m: 'cloth', ao: 1.4, line: 1.2 });
      out.push(water(0, 540, g - 60, g + 4, '#1f6a8a', { n: 6 }));
      // кольца змея
      for (const [x, r] of [[cx - 150, 60], [cx + 40, 76]]) out.push({ p: tube([[x - r, g - 50, 34], [x - r * 0.8, g - 50 - r * 1.1, 32], [x, g - 50 - r * 1.5, 30], [x + r * 0.8, g - 50 - r * 1.1, 30], [x + r, g - 50, 28]], { flat0: true, flat1: true }), c: '#2a8a7a', m: 'skin', line: 1.2, lines: [{ p: [[x - r * 0.7, g - 50 - r * 1.2], [x, g - 50 - r * 1.6], [x + r * 0.7, g - 50 - r * 1.2]], w: 6, c: '#c8e070', a: 0.7 }] });
      // голова
      const hx = cx + 170, hy = 170;
      out.push({ p: tube([[hx - 20, g - 50, 44], [hx - 30, 290, 38], [hx - 10, 220, 34], [hx, hy + 30, 30]], { flat0: true }), c: '#2a8a7a', m: 'skin', line: 1.2 });
      out.push({ p: [P(hx - 30, hy + 40, 1), [hx - 36, hy + 4], [hx, hy - 14], [hx + 50, hy - 6], P(hx + 84, hy + 16, 1), [hx + 40, hy + 34], P(hx + 60, hy + 44, 1), [hx + 10, hy + 50]], c: '#2f9a88', m: 'skin', line: 1.2 });
      out.push({ p: [P(hx - 26, hy - 2, 1), [hx - 30, hy - 40], P(hx - 10, hy - 60, 1), [hx - 4, hy - 30], P(hx + 20, hy - 50, 1), [hx + 18, hy - 12]], c: '#e05a4a', m: 'leather', line: 1 });
      out.push({ e: [hx + 20, hy + 8, 7, 5], c: '#ffd040', m: 'gem', gloss: 1, line: 0.6 }); lit(hx + 20, hy + 8);
      out.push(lantern(60, g - 110), lantern(480, g - 110));
      return out;
    });

    /* ---------- укрепления: стена из песчаника, пушки, круглые бастионы ---------- */
    const wallS = (g, top) => [sandWall(10, top, 970, g), merlons(6, 974, top - 2, 22, 40, '#e2c690', { k: 0.55 })];
    function gateS(g, top) {
      return [sandWall(400, top, 580, g), merlons(394, 586, top - 2, 24, 34, '#e2c690', { k: 0.55 }),
        gate(490, g, 46, Math.min(150, (g - top) * 0.7), { ring: '#c8a878', rw: 14, door: PLANK }),
        swin(440, top + 50, 10, 12), swin(540, top + 50, 10, 12), cannon(430, top - 12, -1), cannon(550, top - 12, 1)];
    }
    bd('fort', F, (cx, g) => [wallS(g, 150), gateS(g, 70), flag(490, 50, 44, RED, { fw: 30, fh: 18 }), barrel(300, g, 18, 44), barrel(680, g, 18, 44, '#7a4a28')]);
    bd('citadel', F, (cx, g) => [wallS(g, 270), sTower(110, g, 62, 320, { win: [230, 320], roofH: 110 }), sTower(870, g, 62, 320, { win: [230, 320], roofH: 110 }), gateS(g, 190), flag(490, 170, 44, RED, { fw: 30, fh: 18 })]);
    bd('castle', F, (cx, g) => [wallS(g, 460), sTower(110, g, 62, 330, { win: [400, 490], roofH: 110 }), sTower(870, g, 62, 330, { win: [400, 490], roofH: 110 }),
      sTower(490, g, 110, 460, { win: [], roofH: 150, eave: 14 }), jolly(490, 30, 60),
      swin(440, 280, 13, 16), swin(540, 280, 13, 16), swin(440, 380, 13, 16), swin(540, 380, 13, 16), porthole(490, 220, 18, { ring: GOLD }),
      cannon(370, 440, -1), cannon(610, 440, 1),
      gate(490, g, 50, 150, { ring: '#c8a878', rw: 14, door: PLANK })]);
  }
})(typeof window !== 'undefined' ? window : globalThis);
