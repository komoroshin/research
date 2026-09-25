/* ============================================================================
   view/vec_towns.js — города и постройки на рисованном конвейере.

   town_<фракция>  — город на карте приключений (рамка старого спрайта 567×437,
                     основание — якорь рамки);
   bld_*           — постройки экрана города (общие для всех фракций): стены
                     и крыши окрашены токенами '$n' / '$N' / '$r' / '$R' —
                     экран города подставляет цвета фракции (TINT в townscene.js);
   dwelling_1…7    — жилища существ на карте (от хижины до башни).

   Окна — тёплый жёлтый (#f2d34c): ночью экран города зажигает окна там, где в
   старом спрайте стоят буквы 'y', поэтому окна держим на тех же местах.
   Все формы — в дизайн-единицах (10 на клетку старого спрайта).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf, mapShapes } = K;

  /* ---------- краски ---------- */
  const WIN = '#f2d34c', WIN_LC = '#3a2614', GOLD = '#d8a53a', IRON = '#4a4a52', DOOR = '#5a3a22', HOLE = '#1a1410';
  // токены подкраски: стены светлые/тёмные, крыши светлые/тёмные (после двоеточия — цвета Замка)
  const Tn = '$n:#d8d0c0', TN = '$N:#9a9280', Tr = '$r:#3b6fd4', TR = '$R:#243f8c';

  /* ---------- геометрия ---------- */
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  /** Трапеция по центру: верх полуширины w0 на y0, низ полуширины w1 на y1. */
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  /** Арка: низ y1, полуширина w, полная высота h; pointed — стрельчатая. */
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  /** Штрихи кладки в прямоугольнике: ряды высотой rh, камни шириной bw, вразбежку (обрежутся по форме). */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 1.8;
    let row = 0;
    for (let y = y0 + rh; y < y1 - 2; y += rh, row++) out.push({ p: [[x0, y], [x1, y]], w, a });
    row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  /** Доски/брёвна: вертикальные (vert) или горизонтальные швы через шаг st. */
  function planks(x0, y0, x1, y1, st, vert, a) {
    const out = []; a = a || 0.45;
    if (vert) for (let x = x0 + st; x < x1 - 1; x += st) out.push({ p: [[x, y0], [x, y1]], w: 1.8, a });
    else for (let y = y0 + st; y < y1 - 1; y += st) out.push({ p: [[x0, y], [x1, y]], w: 1.8, a });
    return out;
  }

  /* ---------- детали архитектуры ---------- */
  /** Окно: арочный проём с тёплым светом, переплёт крестом. o: { pointed, lc, c, cross: false, sill } */
  function win(cx, y1, w, h, o) {
    o = o || {};
    const ys = y1 - h + w;
    const lines = o.cross === false ? [] : [{ p: [[cx, y1 - h + 1], [cx, y1]], w: Math.max(1.5, w * 0.28), c: o.lc || WIN_LC, a: 0.9 }, { p: [[cx - w, ys + (y1 - ys) * 0.2], [cx + w, ys + (y1 - ys) * 0.2]], w: Math.max(1.5, w * 0.24), c: o.lc || WIN_LC, a: 0.9 }];
    const out = [{ p: arch(cx, y1, w, h, o.pointed), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: o.line || 1, lc: o.lc || WIN_LC, lines }];
    if (o.sill) out.push({ p: box(cx - w - 3, y1, cx + w + 3, y1 + 4), c: o.sill, m: 'cloth', line: 0.6 });
    return out;
  }
  /** Флажок на древке: основание древка (x, y), высота L, цвет полотнища. */
  function flag(x, y, L, c, o) {
    o = o || {}; const fw = o.fw || L * 0.62, fh = o.fh || L * 0.34, s = o.left ? -1 : 1, top = y - L;
    return [
      { p: tube([[x, y, o.pw || 4], [x, top - 3, (o.pw || 4) * 0.8]]), c: o.pole || '#4a3a2a', m: 'wood', line: 0.6 },
      { p: [P(x + s * 1.5, top, 1), [x + s * fw * 0.45, top + fh * 0.12], P(x + s * fw, top + fh * 0.42, 1), [x + s * fw * 0.5, top + fh * 0.62], P(x + s * 1.5, top + fh, 1)], c, m: 'cloth', line: 0.8, lines: [{ p: [[x + s * fw * 0.15, top + fh * 0.2], [x + s * fw * 0.6, top + fh * 0.38]], w: 1.4, light: true, a: 0.5 }] },
      { e: [x, top - 4, 3.6, 3.6], c: o.knob || GOLD, m: 'gold', line: 0.5 },
    ];
  }
  /** Коническая крыша: основание на y (полуширина hw), высота h; тёмная правая половина, ряды черепицы. */
  function cone(cx, y, hw, h, c, cd, o) {
    o = o || {}; const f = o.flare === undefined ? 0.06 : o.flare, L = o.lean || 0;
    const at = (t, s) => [cx + s * hw * (1 - t) + L * t, y - h * t];
    const rows = [];
    for (const t of [0.2, 0.4, 0.6, 0.8]) { const [xl, yy] = at(t, -1), xr = at(t, 1)[0]; rows.push({ p: [[xl, yy], [(xl + xr) / 2, yy + hw * (1 - t) * 0.16], [xr, yy]], w: 2, a: 0.4 }); }
    rows.push({ p: [[cx - hw * 0.25, y - h * 0.1], [cx - hw * 0.08 + L * 0.8, y - h * 0.8]], w: 2, light: true, a: 0.55 });
    return [{ p: [P(cx - hw, y, 1), [cx - hw * (0.58 - f) + L * 0.42, y - h * 0.42], P(cx + L, y - h, 1), [cx + hw * (0.58 - f) + L * 0.42, y - h * 0.42], P(cx + hw, y, 1), [cx, y + hw * 0.14]], c, m: o.m || 'leather', gloss: 0.3,
      sub: [{ p: [P(cx + hw * 0.08 + L, y - h, 1), P(cx + hw * 1.2, y - 2, 1), P(cx + hw * 1.1, y + hw * 0.3, 1), P(cx + hw * 0.2, y + hw * 0.3, 1)], c: cd, m: 'flat', line: 0 }],
      lines: rows, id: o.id }];
  }
  /** Купол-полусфера на барабане: основание y, полуширина hw, высота h. */
  function dome(cx, y, hw, h, c, cd, o) {
    o = o || {};
    return [{ p: [P(cx - hw, y, 1), [cx - hw * 0.96, y - h * 0.5], [cx - hw * 0.62, y - h * 0.9], [cx, y - h], [cx + hw * 0.62, y - h * 0.9], [cx + hw * 0.96, y - h * 0.5], P(cx + hw, y, 1), [cx, y + hw * 0.12]], c, m: o.m || 'steel', gloss: o.gloss || 0.9,
      sub: cd ? [{ p: [[cx + hw * 0.25, y - h * 1.1], [cx + hw * 1.1, y - h * 0.6], [cx + hw * 1.1, y + 6], [cx + hw * 0.4, y + 6]], c: cd, m: 'flat', line: 0 }] : [],
      lines: (o.ribs === false ? [] : [-0.5, 0, 0.5].map(k => ({ p: [[cx + hw * k, y], [cx + hw * k * 0.8, y - h * 0.55], [cx + hw * k * 0.3, y - h * 0.95]], w: 1.8, a: 0.35 }))).concat([{ p: [[cx - hw * 0.6, y - h * 0.55], [cx - hw * 0.3, y - h * 0.85]], w: 2.5, light: true, a: 0.6 }]) }];
  }
  /** Луковичный купол. */
  function onion(cx, y, hw, h, c, cd) {
    return [{ p: [P(cx - hw * 0.8, y, 1), [cx - hw, y - h * 0.3], [cx - hw * 0.8, y - h * 0.58], [cx - hw * 0.25, y - h * 0.82], P(cx, y - h, 1), [cx + hw * 0.25, y - h * 0.82], [cx + hw * 0.8, y - h * 0.58], [cx + hw, y - h * 0.3], P(cx + hw * 0.8, y, 1)], c, m: 'steel', gloss: 1,
      sub: cd ? [{ p: [[cx + hw * 0.15, y - h], [cx + hw * 1.1, y - h * 0.4], [cx + hw * 1.1, y + 4], [cx + hw * 0.35, y + 4]], c: cd, m: 'flat', line: 0 }] : [],
      lines: [{ p: [[cx - hw * 0.6, y - h * 0.3], [cx - hw * 0.4, y - h * 0.6]], w: 2.5, light: true, a: 0.7 }] }];
  }
  /** Зубчатый верх (парапет): полоса от y до y+ph, зубцы высотой mh с шагом st. */
  function merlons(x0, x1, y, mh, st, c, o) {
    o = o || {}; const pts = [P(x0, y + (o.ph || 10), 1), P(x0, y - mh, 1)];
    const mw = st * (o.k || 0.56), n = Math.max(1, Math.round((x1 - x0 - mw) / st)), s = (x1 - x0 - mw) / n;
    for (let i = 0; i <= n; i++) { const x = x0 + i * s; if (i) pts.push(P(x, y, 1), P(x, y - mh, 1)); pts.push(P(x + mw, y - mh, 1)); if (i < n) pts.push(P(x + mw, y, 1)); }
    pts.push(P(x1, y - mh, 1), P(x1, y + (o.ph || 10), 1));
    return { p: pts, c, m: o.m || 'cloth', line: 1, lc: o.lc, lines: [{ p: [[x0, y + (o.ph || 10) - 2], [x1, y + (o.ph || 10) - 2]], w: 2, a: 0.5 }] };
  }
  /** Ворота: каменное обрамление (ring), тёмный проём, решётка или створки. o: { pointed, grate, door, ring, ringD } */
  function gate(cx, G, w, h, o) {
    o = o || {};
    const out = [];
    if (o.ring) out.push({ p: arch(cx, G, w + (o.rw || 10), h + (o.rw || 10), o.pointed), c: o.ring, m: 'cloth', line: 1, lines: voussoirs(cx, G - h + (o.pointed ? w * 1.35 : w), w + (o.rw || 10) * 0.5, 7) });
    const lines = [];
    if (o.grate !== false) {
      for (let x = cx - w + w / 3; x < cx + w - 2; x += w / 3) lines.push({ p: [[x, G - h], [x, G]], w: 3, c: o.grateC || '#6a6a72', a: 0.95 });
      for (let y = G - h + w * 0.6; y < G - 2; y += 14) lines.push({ p: [[cx - w, y], [cx + w, y]], w: 2.6, c: o.grateC || '#6a6a72', a: 0.95 });
    }
    out.push({ p: arch(cx, G, w, h, o.pointed), c: o.hole || HOLE, m: 'cloth', ao: 1.4, line: 1, lines });
    if (o.door) out.push({ p: arch(cx, G, w * 0.94, h * 0.97, o.pointed), c: o.door, m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[cx, G - h], [cx, G]], w: 2.4, a: 0.8 }, { p: [[cx - w, G - h * 0.35], [cx + w, G - h * 0.35]], w: 3, c: IRON, a: 0.9 }, { p: [[cx - w, G - h * 0.7], [cx + w, G - h * 0.7]], w: 3, c: IRON, a: 0.9 }] });
    return out;
  }
  /** Клинчатые камни арки: радиальные штрихи вокруг центра (cx, cy) радиуса r. */
  function voussoirs(cx, cy, r, n) {
    const out = [];
    for (let i = 1; i < n; i++) { const a = Math.PI + i / n * Math.PI; out.push({ p: [[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12]], w: 1.8, a: 0.5 }); }
    return out;
  }
  /**
   * Башня: тело (лёгкое сужение кверху), кладка, тёмная правая сторона, окна, верх.
   * o: { wall, shade, light, top: 'cone'|'dome'|'onion'|'crenel'|'none', roof, roofD, roofH, eave, win: [y…], winW, winH, winC, pointed, finial, flag, flagL, taper, mason }
   */
  function tower(cx, base, hw, h, o) {
    const top = base - h, tw = hw * (1 - (o.taper || 0.04)), out = [];
    const sub = [{ p: [P(cx + tw * 0.42, top - 2, 1), P(cx + hw + 4, top - 2, 1), P(cx + hw + 4, base + 2, 1), P(cx + hw * 0.42, base + 2, 1)], c: o.shade, m: 'flat', line: 0 }];
    if (o.light) sub.push({ p: [P(cx - hw - 4, top - 2, 1), P(cx - tw * 0.72, top - 2, 1), P(cx - hw * 0.72, base + 2, 1), P(cx - hw - 4, base + 2, 1)], c: o.light, m: 'flat', line: 0 });
    out.push({ p: trap(cx, top, base, tw, hw), c: o.wall, m: o.m || 'cloth', line: 1, lc: o.lc, sub, lines: o.mason === false ? [] : masonry(cx - hw, top, cx + hw, base, o.rh || 22, o.bw || hw * 0.9, o.ma || 0.35, o.mw || 1.8), id: o.id });
    for (const y of o.win || []) out.push(...win(cx, y, o.winW || Math.max(6, hw * 0.24), o.winH || Math.max(16, hw * 0.62), { pointed: o.pointed, c: o.winC, lc: o.winLC }));
    const t = o.top || 'cone', eave = o.eave === undefined ? 6 : o.eave;
    if (t === 'cone') out.push(...cone(cx, top + 2, tw + eave, o.roofH || hw * 2.3, o.roof, o.roofD, { flare: o.flare, lean: o.lean, m: o.roofM }));
    else if (t === 'dome') out.push({ p: box(cx - tw - 4, top - 8, cx + tw + 4, top + 4), c: o.wall, m: 'cloth', line: 1 }, ...dome(cx, top - 6, tw + 2, o.roofH || tw * 0.95, o.roof, o.roofD));
    else if (t === 'onion') out.push({ p: box(cx - tw - 3, top - 6, cx + tw + 3, top + 4), c: o.wall, m: 'cloth', line: 1 }, ...onion(cx, top - 4, tw + 4, o.roofH || tw * 2, o.roof, o.roofD));
    else if (t === 'crenel') out.push(merlons(cx - tw - 6, cx + tw + 6, top - 2, 14, (tw * 2 + 12) / 3.6, o.wall, { ph: 12 }));
    const apex = t === 'cone' ? top + 2 - (o.roofH || hw * 2.3) : t === 'dome' ? top - 6 - (o.roofH || tw * 0.95) : t === 'onion' ? top - 4 - (o.roofH || tw * 2) : top - 16;
    const ax = cx + (t === 'cone' ? o.lean || 0 : 0);
    if (o.finial) out.push({ p: tube([[ax, apex + 4, 4], [ax, apex - 14, 2.5]]), c: o.finial, m: 'gold', line: 0.6 }, { e: [ax, apex - 16, 4.5, 4.5], c: o.finial, m: 'gold', line: 0.6 });
    if (o.flag) out.push(...flag(ax, apex + 2, o.flagL || 48, o.flag, { left: o.flagLeft }));
    out.apex = [ax, apex];
    return out;
  }
  /** Зубчатая стена: тело от y до земли G, кладка, зубцы. */
  function cwall(x0, x1, y, G, c, o) {
    o = o || {};
    const out = [{ p: box(x0, y, x1, G), c, m: 'cloth', line: 1, belly: 0.25, lines: masonry(x0, y, x1, G, o.rh || 20, o.bw || 34, o.ma || 0.35) }];
    if (o.merlons !== false) out.push(merlons(x0 - 4, x1 + 4, y - 2, o.mh || 16, o.st || 30, o.top || c, { ph: 12 }));
    return out;
  }

  /* ---------- природа и фракционные детали ---------- */
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /** Крона из комьев листвы: задний слой темнее, передний светлее. */
  function foliage(cx, cy, rx, ry, n, cols, seed, o) {
    o = o || {}; const rnd = rngOf(seed), back = [], front = [];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (layer ? 0.55 : 0.8);
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr - (layer ? ry * 0.12 : 0);
      const r = (layer ? 0.4 : 0.44) * Math.min(rx, ry) * (0.8 + rnd() * 0.4);
      (layer ? front : back).push({ p: ell(x, y, r * 1.12, r, 9, rnd() * 0.6), c: layer ? cols[1 + ((rnd() * (cols.length - 1)) | 0)] : cols[0], m: 'feather', texSize: o.leaf || 0.7, flow: Math.PI * 0.5, line: layer ? 0.6 : 0.8, ao: 0.8 });
    }
    return back.concat(front);
  }
  /** Ствол с корнями: от земли y0 до y1. */
  const trunk = (x, y0, y1, w, c, bend) => [
    { p: [[x - w * 1.7, y0], [x - w * 0.9, y0 - 8], [x, y0 - 5], [x + w * 0.9, y0 - 8], [x + w * 1.8, y0], [x, y0 + 3]], c: tone(c, -0.1), m: 'wood', flow: -Math.PI / 2 },
    { p: tube([[x, y0 + 2, w * 1.5], [x, y0 - 20, w * 1.05], [x + (bend || 0) * 0.5, (y0 + y1) / 2, w * 0.92], [x + (bend || 0), y1, w * 0.75]], { flat1: true }), c, m: 'wood', flow: -Math.PI / 2, lines: [{ p: [[x - w * 0.2, y0 - 6], [x - w * 0.1, y1 + 10]], w: 1.4, a: 0.4 }] }];
  /** Частокол из заострённых брёвен от x0 до x1, верх острия top, земля G. */
  function palisade(x0, x1, top, G, st, c, o) {
    o = o || {}; const pts = [P(x0, G, 1)], lines = [];
    let i = 0;
    for (let x = x0; x < x1 - st * 0.5; x += st, i++) {
      const t = top + (i % 3 === 1 ? 8 : i % 3 === 2 ? 3 : 0);
      pts.push(P(x + 1, t + st * 0.9, 1), P(x + st / 2, t, 1), P(x + st - 1, t + st * 0.9, 1));
      if (x > x0) lines.push({ p: [[x, t + st * 0.9], [x, G]], w: 2.2, a: 0.55 });
    }
    pts.push(P(x1, G, 1));
    if (o.bands) for (const y of o.bands) lines.push({ p: [[x0, y], [x1, y]], w: 5, c: o.bandC || '#4a3420', a: 0.9 });
    return { p: pts, c, m: 'wood', flow: -Math.PI / 2, line: 1, lines, belly: 0.3 };
  }
  /** Череп: центр (cx, cy), радиус r. */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || '#e8e0c8', out = [];
    if (o.horns) for (const s of [-1, 1]) out.push({ p: tube([[cx + s * r * 0.7, cy - r * 0.4, r * 0.5], [cx + s * r * 1.5, cy - r * 0.9, r * 0.35], [cx + s * r * 1.9, cy - r * 1.8, r * 0.12]]), c: o.hornC || '#d8ccb0', m: 'horn', line: 0.7 });
    out.push({ p: [[cx - r, cy - r * 0.1], [cx - r * 0.8, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.8, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.6, cy + r * 0.45], [cx + r * 0.45, cy + r * 0.95, 1], [cx - r * 0.45, cy + r * 0.95, 1], [cx - r * 0.6, cy + r * 0.45]], c, m: 'horn', gloss: 0.3, line: 0.9,
      lines: [{ p: [[cx - r * 0.38, cy - r * 0.05], [cx - r * 0.32, cy + r * 0.05]], w: r * 0.42, c: '#1a1210', a: 1 }, { p: [[cx + r * 0.38, cy - r * 0.05], [cx + r * 0.32, cy + r * 0.05]], w: r * 0.42, c: '#1a1210', a: 1 },
        { p: [[cx, cy + r * 0.25], [cx, cy + r * 0.4]], w: r * 0.16, c: '#1a1210', a: 0.9 }, { p: [[cx - r * 0.3, cy + r * 0.75], [cx + r * 0.3, cy + r * 0.75]], w: r * 0.1, c: '#3a3028', a: 0.8 }] });
    return out;
  }
  /** Язык пламени: основание (x, y), полуширина w, высота h. */
  function flame(x, y, w, h, o) {
    o = o || {};
    return [{ p: [P(x - w, y, 1), [x - w * 0.9, y - h * 0.35], [x - w * 0.35, y - h * 0.62], P(x - w * 0.1, y - h, 1), [x + w * 0.3, y - h * 0.62], P(x + w * 0.5, y - h * 0.78, 1), [x + w * 0.9, y - h * 0.35], P(x + w, y, 1)], c: o.c || '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.6, lc: '#8a2a0a',
      sub: [{ p: [P(x - w * 0.5, y + 2, 1), [x - w * 0.4, y - h * 0.3], P(x - w * 0.05, y - h * 0.62, 1), [x + w * 0.35, y - h * 0.3], P(x + w * 0.5, y + 2, 1)], c: o.core || '#ffe08a', m: 'flat', line: 0 }] }];
  }
  /** Кристалл-призма: основание (x, y), полуширина w, высота h, наклон lean. */
  function crystal(x, y, w, h, c, lean) {
    const l = (lean || 0) * h;
    return { p: [P(x - w, y, 1), P(x - w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y, 1)], c, m: 'gem', gloss: 1.1, rim: 0.7, line: 0.8,
      sub: [{ p: [P(x + l * 0.5, y + 2, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y + 2, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.3, y - 4], [x - w * 0.3 + l * 0.8, y - h * 0.8]], w: 2, light: true, a: 0.7 }] };
  }
  /** Шестерня: центр, радиус, число зубьев. */
  function gear(cx, cy, r, n, c) {
    const pts = [];
    for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, d = Math.PI / n; for (const [a, rr] of [[a0 - d * 0.5, r], [a0 - d * 0.32, r * 1.18], [a0 + d * 0.32, r * 1.18], [a0 + d * 0.5, r]]) pts.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1)); }
    const lines = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; lines.push({ p: [[cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3], [cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78]], w: r * 0.13, c: tone(c, -0.55), a: 0.9 }); }
    return [{ p: pts, c, m: 'gold', gloss: 0.9, line: 1, lines: [{ p: ell(cx, cy, r * 0.82, r * 0.82, 16).concat([[cx + r * 0.82, cy]]), w: 2.4, a: 0.6 }].concat(lines) },
      { e: [cx, cy, r * 0.28, r * 0.28], c: tone(c, 0.15), m: 'gold', line: 0.8, glint: [[cx - r * 0.1, cy - r * 0.1, r * 0.12]] }];
  }
  /** Водная полоса у основания: от y до низа y1. */
  function water(x0, x1, y, y1, c, o) {
    o = o || {}; const lines = [];
    for (let i = 0; i < (o.n || 10); i++) { const x = x0 + (i * 53) % (x1 - x0 - 30), yy = y + 6 + (i * 17) % Math.max(4, y1 - y - 8); lines.push({ p: [[x, yy], [x + 18 + (i % 3) * 8, yy]], w: 2.2, light: true, a: 0.7 }); }
    return { p: [P(x0, y1, 1), P(x0, y + 4), [x0 + (x1 - x0) * 0.3, y], [x0 + (x1 - x0) * 0.7, y + 3], P(x1, y), P(x1, y1, 1)], c, m: o.m || 'gem', gloss: 0.4, rim: 0, line: 0.8, lines };
  }
  /** Двускатная крыша спереди (фронтон) над стеной x0…x1 на высоте y. */
  const gable = (x0, x1, y, h, e) => [P(x0 - e, y, 1), P((x0 + x1) / 2, y - h, 1), P(x1 + e, y, 1)];

  /* ---------- описание-картинка: одна часть в рамке старого спрайта ---------- */
  const CX = 283, G = 433;   // канон города на карте: центр и земля
  function one(name, shapes, fr) { V.def(name, { w: fr.w, h: fr.h, anchor: fr.anchor, parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }] }); }
  /** Город: рисуем в каноне 567×437 (центр CX, земля G) и сдвигаем к якорю рамки старого спрайта. */
  function town(name, build) {
    const fr = frameOf(name) || { w: 567, h: 437, anchor: [CX, G] };
    const dx = fr.anchor[0] - CX, dy = fr.anchor[1] - G;
    let shapes = build(fr);
    if (dx || dy) shapes = mapShapes(shapes, (x, y) => [x + dx, y + dy], 1);
    one(name, shapes, fr);
  }

  /* ============================== ГОРОДА НА КАРТЕ ============================== */

  /* ---------- Замок: белый камень, синие конусы, алые знамёна ---------- */
  town('town_castle', () => {
    const S = { wall: '#e4e0d6', shade: '#b4b0aa', light: '#f4f2ec', roof: '#3566cc', roofD: '#1f3f8e', finial: GOLD };
    const out = [];
    out.push(...cwall(36, 531, 322, G, '#dcd8ce', { top: '#e8e4da' }));
    out.push(...tower(167, G, 34, 168, Object.assign({}, S, { win: [300, 360], roofH: 88 })));
    out.push(...tower(400, G, 34, 168, Object.assign({}, S, { win: [300, 360], roofH: 88 })));
    out.push(...tower(58, G, 42, 214, Object.assign({}, S, { win: [258, 320, 382], roofH: 104, flag: '#c42a2a', flagL: 40, flagLeft: true })));
    out.push(...tower(509, G, 42, 214, Object.assign({}, S, { win: [258, 320, 382], roofH: 104, flag: '#c42a2a', flagL: 40 })));
    // донжон
    out.push(...tower(CX, G, 76, 292, Object.assign({}, S, { win: [], roofH: 118, eave: 10, finial: GOLD })));
    out.push(...win(CX, 250, 13, 36), ...win(CX - 42, 300, 11, 30), ...win(CX + 42, 300, 11, 30));
    // алое знамя с золотым крестом
    out.push({ p: [P(CX - 26, 150, 1), P(CX + 26, 150, 1), P(CX + 26, 196, 1), P(CX, 186, 1), P(CX - 26, 196, 1)], c: '#c42a2a', m: 'cloth', line: 1,
      sub: [{ p: box(CX - 4, 150, CX + 4, 190), c: GOLD, m: 'gold', line: 0 }, { p: box(CX - 18, 162, CX + 18, 169), c: GOLD, m: 'gold', line: 0 }] });
    out.push(...gate(CX, G, 34, 92, { ring: '#c8c4ba', grate: true, rw: 12 }));
    return out;
  });

  /* ---------- Оплот: светлый камень, зелёные шпили, эльфийские арки, великое дерево ---------- */
  town('town_rampart', () => {
    const S = { wall: '#dcd6c0', shade: '#a8a088', light: '#f2eee0', roof: '#4c9a3a', roofD: '#2d6424', finial: GOLD, flare: 0.16, pointed: true };
    const LEAF = ['#2f6a24', '#4a8a32', '#5e9e3c', '#76b44a'], BARK = '#7a5230';
    const out = [];
    // великое дерево за городом, с домиком в ветвях
    out.push(...trunk(468, G, 200, 30, BARK, -8));
    out.push({ p: tube([[462, 262, 18], [420, 222, 12], [384, 200, 8]]), c: BARK, m: 'wood', line: 0.9 }, { p: tube([[462, 236, 16], [510, 196, 10], [536, 170, 6]]), c: BARK, m: 'wood', line: 0.9 });
    out.push(...foliage(462, 132, 112, 90, 8, LEAF, 17));
    out.push({ e: [398, 196, 34, 28], c: '#9a6a3a', m: 'wood', flow: 0, line: 1 }, ...win(398, 208, 7, 18, { pointed: true }), ...cone(398, 178, 40, 50, '#4c9a3a', '#2d6424', { flare: 0.18 }));
    // низкая стена с аркадой
    const arc = [];
    for (let x = 62; x < 520; x += 46) if (Math.abs(x - CX) > 60) arc.push({ p: arch(x, 414, 12, 44, true), c: '#34462c', m: 'flat', line: 0 });
    out.push({ p: box(28, 352, 539, G), c: '#d4ccb2', m: 'cloth', line: 1, belly: 0.2, sub: arc, lines: masonry(28, 352, 539, G, 20, 36, 0.3).concat([{ p: [[28, 360], [539, 360]], w: 5, c: GOLD, a: 0.85 }]) });
    // башни
    out.push(...tower(72, G, 32, 236, Object.assign({}, S, { win: [262, 322], roofH: 132, flag: '#3f8f33', flagL: 40, flagLeft: true })));
    out.push(...tower(370, G, 28, 178, Object.assign({}, S, { win: [320], roofH: 104 })));
    out.push(...tower(CX, G, 56, 300, Object.assign({}, S, { win: [220, 286], winW: 12, winH: 34, roofH: 150, eave: 8, flag: '#3f8f33', flagL: 44 })));
    // деревянные балконы на башнях
    for (const [cx, y, hw] of [[72, 290, 32], [CX, 250, 56], [370, 340, 28]]) out.push({ p: box(cx - hw - 12, y, cx + hw + 12, y + 9), c: '#8a5a30', m: 'wood', flow: 0, line: 1,
      lines: [{ p: [[cx - hw - 10, y - 12], [cx + hw + 10, y - 12]], w: 2.4, c: '#5a3a1c', a: 0.9 }, ...[-1, -0.5, 0, 0.5, 1].map(k => ({ p: [[cx + k * (hw + 8), y], [cx + k * (hw + 8), y - 12]], w: 2, c: '#5a3a1c', a: 0.9 }))] });
    out.push(...gate(CX, G, 28, 86, { pointed: true, ring: '#e6d8a8', rw: 8, grate: false, door: '#8a5a30' }));
    // кусты у подножия
    out.push(...foliage(120, 424, 44, 18, 3, LEAF, 5, { leaf: 0.5 }), ...foliage(450, 424, 50, 18, 3, LEAF, 9, { leaf: 0.5 }));
    return out;
  });

  /* ---------- Башня: белый камень, снег, купола обсерваторий, золото ---------- */
  function snowcap(cx, y, hw, k) {
    k = k || 1;
    return { p: [P(cx - hw, y + 5 * k), [cx - hw * 0.62, y - 7 * k], [cx, y - 11 * k], [cx + hw * 0.62, y - 7 * k], P(cx + hw, y + 5 * k), [cx + hw * 0.55, y + 10 * k], [cx + hw * 0.2, y + 4 * k], [cx - hw * 0.15, y + 12 * k], [cx - hw * 0.55, y + 6 * k]], c: '#f8fbff', m: 'cloth', line: 0.8, lc: '#8aa0b8' };
  }
  town('town_tower', () => {
    const S = { wall: '#eef2f6', shade: '#b8c6d6', light: '#ffffff', roof: '#4f86d0', roofD: '#2a5a9c', finial: GOLD, winC: '#bfe2ff', winLC: '#2a4a78' };
    const out = [];
    out.push(...cwall(36, 531, 330, G, '#e4eaf0', { top: '#eef3f8' }));
    for (let x = 40; x < 530; x += 30) out.push(snowcap(x + 8, 314, 10, 0.6));
    const mid = [167, 400], outer = [58, 509];
    for (const x of mid) { const t = tower(x, G, 32, 178, Object.assign({}, S, { top: 'dome', roof: '#9ab8d8', roofD: '#6a88b0', roofH: 34, win: [300, 360] })); out.push(...t, { p: tube([[x, t.apex[1] + 2, 5], [x, t.apex[1] + 30, 5]]), c: '#2a3a5a', m: 'flat', line: 0 }, snowcap(x, t.apex[1] + 4, 16, 0.7)); }
    for (const x of outer) { const t = tower(x, G, 40, 232, Object.assign({}, S, { top: 'onion', roofH: 84, win: [250, 310, 370], finial: GOLD })); out.push(...t, snowcap(x, t.apex[1] + 34, 26, 0.8)); }
    // главная башня-обсерватория с телескопом
    const c = tower(CX, G, 64, 318, Object.assign({}, S, { top: 'dome', roof: '#6aa0e0', roofD: '#3a6aa8', roofH: 62, win: [], finial: GOLD }));
    out.push({ p: tube([[CX + 10, c.apex[1] + 40, 12], [CX + 58, c.apex[1] + 2, 10], [CX + 76, c.apex[1] - 12, 12]], { flat1: true }), c: '#c8943a', m: 'gold', line: 0.9 });
    out.push(...c, snowcap(CX - 14, c.apex[1] + 12, 34), ...win(CX, 190, 13, 36, { c: '#bfe2ff', lc: '#2a4a78' }), ...win(CX - 32, 250, 10, 28), ...win(CX + 32, 250, 10, 28), ...win(CX, 310, 10, 28));
    // золотая площадка у подножия
    out.push({ p: box(8, 420, 559, G), c: GOLD, m: 'gold', line: 1, lines: [0, 1, 2, 3, 4, 5, 6, 7].map(i => ({ p: [[30 + i * 70, 420], [30 + i * 70, G]], w: 2, a: 0.5 })) });
    out.push(...gate(CX, 420, 30, 78, { ring: '#d8e2ec', rw: 10 }));
    return out;
  });

  /* ---------- Инферно: чёрный камень, шипы, рога, пламя, лавовый ров ---------- */
  function spikes(x0, x1, y, h, st, c) {
    const pts = [P(x0, y + 12, 1)];
    for (let x = x0; x < x1 - st * 0.5; x += st) pts.push(P(x, y, 1), P(x + st * 0.5, y - h, 1), P(x + st, y, 1));
    pts.push(P(x1, y + 12, 1));
    return { p: pts, c, m: 'horn', gloss: 0.3, line: 1 };
  }
  function horn(cx, y, s, L, c) { return { p: tube([[cx, y, L * 0.28], [cx + s * L * 0.55, y - L * 0.25, L * 0.2], [cx + s * L * 0.72, y - L * 0.72, L * 0.1], [cx + s * L * 0.6, y - L, L * 0.02]]), c, m: 'horn', gloss: 0.6, line: 0.9, lines: [0.3, 0.5, 0.7].map(t => ({ p: [[cx + s * L * 0.5 * t * 1.3, y - L * 0.25 * t * 1.8 - 6], [cx + s * L * 0.5 * t * 1.3 + 4, y - L * 0.25 * t * 1.8 + 6]], w: 1.5, a: 0.4 })) }; }
  town('town_inferno', () => {
    const S = { wall: '#40302e', shade: '#221816', light: '#5c4844', roof: '#a8281c', roofD: '#5c1410', winC: '#ffa040', winLC: '#2a0a04', pointed: true, flare: 0.1, finial: '#3a2a28' };
    const out = [];
    out.push({ p: box(10, 322, 557, 412), c: '#382a28', m: 'cloth', line: 1, lines: masonry(10, 322, 557, 412, 20, 34, 0.45) }, spikes(4, 563, 322, 24, 22, '#2a1e1c'));
    for (const x of [160, 406]) out.push(...tower(x, 414, 32, 168, Object.assign({}, S, { win: [300, 356], roofH: 96 })));
    for (const [x, s] of [[36, -1], [530, 1]]) {
      const t = tower(x, 414, 42, 222, Object.assign({}, S, { top: 'crenel', win: [250, 312, 372] }));
      out.push(horn(x - 30, 196, -1, 56, '#6a5a50'), horn(x + 30, 196, 1, 56, '#6a5a50'), ...t, { p: box(x - 26, 176, x + 26, 190), c: '#2a1e1c', m: 'steel', line: 1 }, ...flame(x, 180, 24, 58));
    }
    // донжон с рогами
    const d = tower(CX, 414, 74, 300, Object.assign({}, S, { win: [], roofH: 150, eave: 10 }));
    out.push(horn(CX - 64, 130, -1, 92, '#7a6a5e'), horn(CX + 64, 130, 1, 92, '#7a6a5e'), ...d);
    out.push(spikes(CX - 84, CX + 84, 118, 18, 21, '#2a1e1c'));
    out.push(...win(CX, 220, 13, 38, { pointed: true, c: '#ffa040', lc: '#2a0a04' }), ...win(CX - 40, 280, 10, 30, { pointed: true, c: '#ffa040', lc: '#2a0a04' }), ...win(CX + 40, 280, 10, 30, { pointed: true, c: '#ffa040', lc: '#2a0a04' }));
    out.push(...gate(CX, 414, 32, 90, { pointed: true, ring: '#2a1e1c', rw: 12, hole: '#ff6a1a', grateC: '#1a0e0c' }));
    // лавовый ров
    out.push(Object.assign(water(-20, 587, 408, G, '#ff6a1a', { n: 14 }), { sub: [{ p: box(-20, 418, 587, 426), c: '#ffc050', m: 'flat', line: 0 }], lc: '#6a1a0a' }));
    return out;
  });

  /* ---------- Некрополис: тёмный камень, иглы-шпили, фиолетовые окна, черепа ---------- */
  town('town_necropolis', () => {
    const S = { wall: '#5e5c6c', shade: '#3a3846', light: '#7c7a8c', roof: '#3a2c46', roofD: '#1c1424', winC: '#b67ae8', winLC: '#1a0e24', pointed: true, flare: 0.2, finial: '#8a8898' };
    const out = [];
    out.push(...cwall(36, 531, 330, G, '#524f62', { top: '#5e5b70' }));
    out.push(...tower(167, G, 30, 170, Object.assign({}, S, { win: [300, 356], roofH: 140, lean: 8 })));
    out.push(...tower(400, G, 30, 170, Object.assign({}, S, { win: [300, 356], roofH: 140, lean: -8 })));
    out.push(...tower(58, G, 40, 212, Object.assign({}, S, { win: [258, 318, 378], roofH: 160, lean: -12 })));
    out.push(...tower(509, G, 40, 212, Object.assign({}, S, { win: [258, 318, 378], roofH: 160, lean: 12 })));
    out.push(...tower(CX, G, 66, 272, Object.assign({}, S, { win: [], roofH: 150, eave: 10 })));
    // контрфорсы-шипы по бокам донжона
    for (const s of [-1, 1]) out.push({ p: [P(CX + s * 66, 170, 1), P(CX + s * 90, 118, 1), P(CX + s * 82, 176, 1), P(CX + s * 70, 250, 1)], c: '#2a2434', m: 'horn', line: 0.9 });
    out.push(...win(CX, 230, 14, 44, { pointed: true, c: '#b67ae8', lc: '#1a0e24' }), ...win(CX - 38, 296, 9, 30, { pointed: true, c: '#b67ae8', lc: '#1a0e24' }), ...win(CX + 38, 296, 9, 30, { pointed: true, c: '#b67ae8', lc: '#1a0e24' }));
    out.push(...skull(CX, 184, 20, { c: '#e8e4d8' }));
    out.push(...gate(CX, G, 32, 92, { pointed: true, ring: '#46435a', rw: 12, hole: '#120c18', grateC: '#5a5868' }));
    for (const x of [112, 454]) out.push(...skull(x, 384, 16));
    // надгробия у стены
    for (const [x, k] of [[208, 1], [358, 0.9]]) out.push({ p: arch(x, G, 10 * k, 30 * k), c: '#8a8898', m: 'cloth', line: 1, lines: [{ p: [[x, G - 24 * k], [x, G - 8 * k]], w: 2, a: 0.6 }, { p: [[x - 5 * k, G - 18 * k], [x + 5 * k, G - 18 * k]], w: 2, a: 0.6 }] });
    return out;
  });

  /* ---------- Подземелье: пещерный вход в скале, пурпурные башни, кристаллы ---------- */
  function rock(pts, c, o) { o = o || {}; return { p: pts, c, m: 'horn', gloss: 0.15, line: 1, belly: 0.3, lines: o.lines || [] }; }
  town('town_dungeon', () => {
    const S = { wall: '#5c4c60', shade: '#342a38', light: '#76667a', roof: '#8a4ac0', roofD: '#4e2a72', winC: '#e090ff', winLC: '#2a0e3a', pointed: true, flare: 0.1, finial: '#c890f0' };
    const RK = '#4a4252', RK2 = '#3a3442', out = [];
    out.push(...tower(CX, 380, 56, 300, Object.assign({}, S, { win: [150, 210, 270], winW: 11, winH: 32, roofH: 140, eave: 8 })));
    // скальные массивы по бокам
    out.push(rock([P(-20, G, 1), [-14, 250], [20, 170], [70, 130], [130, 150], [176, 210], [200, 300], P(214, G, 1)], RK, { lines: [{ p: [[60, 160], [80, 240], [66, 320]], w: 2.4, a: 0.45 }, { p: [[140, 190], [150, 280]], w: 2, a: 0.4 }] }));
    out.push(rock([P(352, G, 1), [366, 300], [390, 220], [440, 160], [500, 150], [548, 190], [564, 280], P(566, G, 1)], RK, { lines: [{ p: [[470, 170], [456, 260], [480, 340]], w: 2.4, a: 0.45 }] }));
    out.push(...tower(96, 300, 32, 150, Object.assign({}, S, { win: [220], roofH: 92 })));
    out.push(...tower(470, 290, 32, 140, Object.assign({}, S, { win: [214], roofH: 88 })));
    // пещерная пасть: каменная арка, тёмный провал уходит под землю, клыки-сталактиты
    out.push(rock([P(170, G + 50, 1), [178, 360], [206, 318], [CX, 294], [360, 318], [388, 360], P(396, G + 50, 1)], RK2));
    out.push({ p: [P(206, G + 52, 1), [212, 390], [234, 348], [CX, 330], [332, 348], [354, 390], P(360, G + 52, 1)], c: '#0e0a12', m: 'cloth', ao: 1.5, line: 1 });
    for (let i = 0; i < 7; i++) { const x = 226 + i * 19, len = 18 + (i % 3) * 10, y = 342 - Math.sin(i / 6 * Math.PI) * 10; out.push({ p: [P(x - 8, y - 4, 1), P(x + 8, y - 4, 1), P(x + 1, y + len, 1)], c: '#6a6072', m: 'horn', line: 0.8 }); }
    // сталагмиты и кристаллы
    for (const [x, y, h, c, l] of [[36, G, 70, '#9a5ae0', -0.15], [58, G, 48, '#c890f8', 0.1], [150, G, 40, '#b070f0', 0.2], [400, G, 44, '#b070f0', -0.2], [512, G, 76, '#9a5ae0', 0.12], [540, G, 50, '#c890f8', 0.25], [184, G + 30, 30, '#d8a8ff', -0.1], [380, G + 30, 34, '#d8a8ff', 0.1]]) out.push(crystal(x, y, h * 0.24, h, c, l));
    return out;
  });

  /* ---------- Цитадель: частокол, бревенчатая вышка с черепом, шатры, черепа на кольях ---------- */
  function tent(cx, G, hw, h, c, stripe) {
    return [
      { p: tube([[cx - 14, G - h + 16, 5], [cx + 10, G - h - 26, 4]]), c: '#5a3a1c', m: 'wood', line: 0.6 }, { p: tube([[cx + 14, G - h + 16, 5], [cx - 8, G - h - 24, 4]]), c: '#5a3a1c', m: 'wood', line: 0.6 },
      { p: [P(cx - hw, G, 1), [cx - hw * 0.55, G - h * 0.5], P(cx, G - h, 1), [cx + hw * 0.55, G - h * 0.5], P(cx + hw, G, 1), [cx, G + 6]], c, m: 'leather', line: 1,
        sub: [{ p: [P(cx + 4, G - h, 1), P(cx + hw * 1.2, G + 4, 1), P(cx + hw * 0.3, G + 8, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
        lines: [0.3, 0.55, 0.8].map(t => ({ p: [[cx - hw * t, G - h * (1 - t)], [cx, G - h * (1 - t) + 6], [cx + hw * t, G - h * (1 - t)]], w: 5, c: stripe, a: 0.9 })) },
      { p: [P(cx - hw * 0.28, G, 1), P(cx, G - h * 0.45, 1), P(cx + hw * 0.28, G, 1)], c: '#2a1a10', m: 'cloth', line: 0.8 },
    ];
  }
  function stakeSkull(x, G, h, r) { return [{ p: tube([[x, G, 7], [x, G - h, 5]]), c: '#5a3a1c', m: 'wood', line: 0.8 }, ...skull(x, G - h - r * 0.6, r)]; }
  town('town_stronghold', () => {
    const WOOD = '#6e4a28', out = [];
    out.push(palisade(10, 557, 312, G, 24, '#7a5230', { bands: [360, 404] }));
    // бревенчатая вышка вождя
    const logs = []; for (let y = 206; y < G; y += 17) logs.push({ p: [[CX - 62, y], [CX + 62, y]], w: 2.4, a: 0.55 });
    out.push({ p: trap(CX, 196, G, 56, 64), c: WOOD, m: 'wood', flow: 0, line: 1, lines: logs, sub: [{ p: [P(CX + 26, 190, 1), P(CX + 70, 190, 1), P(CX + 70, G + 2, 1), P(CX + 30, G + 2, 1)], c: '#4a3018', m: 'flat', line: 0 }] });
    for (const s of [-1, 1]) out.push({ p: tube([[CX + s * 60, 206, 12], [CX + s * 60, G, 13]]), c: '#5a3a1c', m: 'wood', line: 0.9 });
    out.push({ p: [P(CX - 86, 204, 1), [CX - 50, 150], P(CX, 96, 1), [CX + 50, 150], P(CX + 86, 204, 1), [CX, 214]], c: '#b08a50', m: 'fur', furLen: 1.2, flow: Math.PI * 0.5, line: 1, belly: 0.3 });
    out.push(...flag(CX, 98, 50, '#b8322a', { fw: 34, fh: 20 }));
    out.push(...skull(CX, 250, 30, { horns: true }));
    out.push(...win(CX - 34, 320, 7, 20), ...win(CX + 34, 320, 7, 20));
    out.push(...gate(CX, G, 28, 74, { grate: false, door: '#5a3a1c', hole: HOLE }));
    // шатры и черепа на кольях
    out.push(...tent(102, G, 70, 150, '#c8a06a', '#8a4a2a'), ...tent(466, G, 70, 150, '#c8a06a', '#8a4a2a'));
    out.push(...stakeSkull(24, G, 96, 13), ...stakeSkull(543, G, 96, 13), ...stakeSkull(196, G, 60, 11), ...stakeSkull(370, G, 60, 11));
    return out;
  });

  /* ---------- Крепость: хижины на сваях над болотом, соломенные крыши, тотемы ящеров ---------- */
  function lizardTotem(x, G, h) {
    const top = G - h;
    return [
      { p: tube([[x, G, 16], [x, top + 30, 13]]), c: '#6a5030', m: 'wood', flow: -Math.PI / 2, line: 0.9, lines: [0.3, 0.5, 0.7].map(t => ({ p: [[x - 8, G - h * t], [x + 8, G - h * t]], w: 4, c: '#3a8a6a', a: 0.9 })) },
      { p: [[x - 16, top + 40], [x - 18, top + 14], [x - 6, top], [x + 14, top + 4], [x + 42, top + 14], P(x + 46, top + 22, 1), [x + 20, top + 26], [x + 12, top + 40]], c: '#5a9a3a', m: 'skin', line: 1, lines: [{ p: [[x + 16, top + 20], [x + 44, top + 21]], w: 2, a: 0.8 }], glint: [[x + 6, top + 10, 3]] },
      { e: [x + 6, top + 11, 4, 3.5], c: '#ffd040', m: 'gem', line: 0.5 },
      { p: [P(x - 10, top + 4, 1), [x - 2, top - 16], P(x + 4, top + 2, 1)], c: '#c84a2a', m: 'leather', line: 0.8 },
    ];
  }
  town('town_fortress', () => {
    const WOOD = '#7a5a34', THATCH = '#b8a060', out = [];
    out.push(...lizardTotem(28, 398, 150), ...lizardTotem(539, 398, 150));
    // сваи и настил
    for (let x = 34; x < 540; x += 30) out.push({ p: tube([[x, 352, 9], [x + 2, 424, 9]], { flat0: true }), c: '#4a3a24', m: 'wood', line: 0.8 });
    out.push({ p: box(18, 342, 549, 358), c: '#8a6a40', m: 'wood', flow: 0, line: 1, lines: planks(18, 342, 549, 358, 22, true, 0.5) });
    // хижины
    const hut = (cx, hw, top, rh, win2) => {
      const base = 344, r = [];
      r.push({ p: box(cx - hw, top, cx + hw, base), c: WOOD, m: 'wood', flow: -Math.PI / 2, line: 1, lines: planks(cx - hw, top, cx + hw, base, 14, true, 0.4), sub: [{ p: box(cx + hw * 0.45, top, cx + hw + 2, base + 2), c: '#4e3a20', m: 'flat', line: 0 }] });
      r.push({ p: arch(cx, base, hw * 0.2, (base - top) * 0.62), c: HOLE, m: 'cloth', line: 1 });
      for (const dx of win2) r.push(...win(cx + dx, top + (base - top) * 0.52, 9, 20, { cross: false }));
      r.push({ p: [P(cx - hw - 22, top + 12, 1), [cx - hw * 0.5, top - rh * 0.45], P(cx, top - rh, 1), [cx + hw * 0.5, top - rh * 0.45], P(cx + hw + 22, top + 12, 1), [cx, top + 18]], c: THATCH, m: 'fur', furLen: 1.1, flow: Math.PI * 0.5, dens: 1.2, line: 1, belly: 0.25,
        lines: [{ p: [[cx - hw - 18, top + 10], [cx, top + 16], [cx + hw + 18, top + 10]], w: 4, c: '#7a6030', a: 0.8 }] });
      r.push({ p: tube([[cx, top - rh + 10, 6], [cx, top - rh - 18, 3]]), c: '#4a3a24', m: 'wood', line: 0.6 });
      return r;
    };
    out.push(...hut(96, 56, 270, 86, [-34, 34]), ...hut(471, 56, 270, 86, [-34, 34]), ...hut(CX, 80, 214, 130, [-46, 46]));
    out.push(...win(CX, 184, 10, 24, { cross: false }));
    out.push(...lizardTotem(CX - 118, 398, 104), ...lizardTotem(CX + 104, 398, 104));
    // зелёная вода и камыш
    out.push(water(0, 567, 396, G, '#3a6a58', { n: 12 }));
    for (const x of [14, 160, 250, 330, 420, 556]) for (let k = -1; k <= 1; k++) out.push({ p: tube([[x + k * 6, 420, 3], [x + k * 9, 386 - Math.abs(k) * -8, 2]]), c: '#6a9a3a', m: 'leather', line: 0.5 });
    return out;
  });

  /* ---------- Сопряжение: парящие острова, стихийные пилоны, хрустальный шпиль ---------- */
  function island(cx, cy, hw, c) {
    return [
      { p: [P(cx - hw, cy, 1), [cx - hw * 0.6, cy + hw * 0.5], P(cx - hw * 0.1, cy + hw * 1.1, 1), [cx + hw * 0.4, cy + hw * 0.6], P(cx + hw, cy, 1)], c: '#8a7a6a', m: 'horn', gloss: 0.2, line: 1, lines: [{ p: [[cx - hw * 0.3, cy + 4], [cx - hw * 0.12, cy + hw * 0.8]], w: 2, a: 0.4 }] },
      { p: ell(cx, cy - 2, hw * 1.02, hw * 0.2, 12), c: '#6aa844', m: 'cloth', line: 0.9 },
      crystal(cx + hw * 0.2, cy - 2, hw * 0.16, hw * 0.9, c, 0.05), crystal(cx - hw * 0.3, cy, hw * 0.12, hw * 0.55, tone(c, 0.3), -0.15),
    ];
  }
  function pylon(x, G, h, c) {
    return [
      { p: trap(x, G - h, G, 10, 18), c: '#e6eaf2', m: 'cloth', line: 1, sub: [{ p: box(x + 4, G - h - 2, x + 20, G + 2), c: '#a8b2c6', m: 'flat', line: 0 }] },
      { p: box(x - 18, G - h - 8, x + 18, G - h + 4), c: GOLD, m: 'gold', line: 0.8 },
      crystal(x, G - h - 8, 13, 58, c, 0),
      { p: tube([[x - 24, G - h - 34, 3], [x, G - h - 26, 3], [x + 24, G - h - 34, 3]]), c: GOLD, m: 'gold', line: 0.4 },
    ];
  }
  town('town_conflux', () => {
    const S = { wall: '#eef0f6', shade: '#b0b8cc', light: '#ffffff', roof: '#7fd9ea', roofD: '#3a9ab8', roofM: 'gem', winC: '#dcc0ff', winLC: '#4a3a6a', pointed: true };
    const out = [];
    out.push(...island(90, 96, 58, '#ff8a3a'), ...island(480, 76, 50, '#3ab0f0'), ...island(398, 170, 26, '#e8f4ff'));
    out.push({ p: box(40, 350, 527, G), c: '#e2e6ee', m: 'cloth', line: 1, lines: masonry(40, 350, 527, G, 20, 36, 0.3) }, merlons(36, 531, 348, 12, 26, '#eef1f7', { k: 0.5 }));
    out.push(...tower(118, G, 34, 208, Object.assign({}, S, { win: [270, 330], roofH: 110 })));
    out.push(...tower(448, G, 34, 208, Object.assign({}, S, { win: [270, 330], roofH: 110 })));
    for (const [x, c] of [[30, '#ff7a2a'], [196, '#3a9af0'], [370, '#eaf6ff'], [537, '#b08a4a']]) out.push(...pylon(x, G, 120, c));
    // центральный хрустальный шпиль
    const d = tower(CX, G, 60, 290, Object.assign({}, S, { win: [], roofH: 170, eave: 8, flare: 0.2 }));
    out.push(...d, { p: tube([[CX - 50, 104, 4], [CX, 118, 4], [CX + 50, 104, 4]]), c: GOLD, m: 'gold', line: 0.5 }, { p: tube([[CX - 34, 60, 3], [CX, 70, 3], [CX + 34, 60, 3]]), c: GOLD, m: 'gold', line: 0.5 });
    out.push(...win(CX, 220, 13, 40, { pointed: true, c: '#dcc0ff', lc: '#4a3a6a' }), ...win(CX - 34, 290, 9, 28, { pointed: true, c: '#dcc0ff', lc: '#4a3a6a' }), ...win(CX + 34, 290, 9, 28, { pointed: true, c: '#dcc0ff', lc: '#4a3a6a' }));
    out.push(...gate(CX, G, 30, 86, { pointed: true, ring: '#d0d8e6', rw: 10, hole: '#2a3a5a', grateC: '#9ad8f0' }));
    // земля и воздух у подножия
    out.push({ p: ell(210, 426, 30, 12, 10), c: '#8a6a3a', m: 'horn', line: 0.8 }, { p: ell(356, 424, 26, 12, 10), c: '#dfeaf6', m: 'cloth', line: 0.8 });
    return out;
  });

  /* ---------- Бухта: песчаный форт, маяк, корабль у пирса ---------- */
  town('town_cove', () => {
    const S = { wall: '#caa878', shade: '#8f7450', light: '#e0c496', roof: '#2a8a8a', roofD: '#155a5a', finial: GOLD };
    const out = [];
    out.push(...cwall(150, 540, 334, 404, '#c0a070', { top: '#ccae80' }));
    out.push(...tower(410, 404, 32, 176, Object.assign({}, S, { win: [290, 346], roofH: 96 })));
    out.push(...tower(CX, 404, 66, 290, Object.assign({}, S, { win: [], roofH: 136, eave: 10, flag: '#c42a2a', flagL: 44 })));
    out.push(...win(CX, 200, 12, 34), ...win(CX - 36, 262, 10, 28), ...win(CX + 36, 262, 10, 28));
    out.push(...gate(CX, 404, 30, 80, { ring: '#a88a5c', rw: 10 }));
    // маяк на скале
    out.push({ p: ell(508, 406, 56, 22, 12), c: '#6a6258', m: 'horn', line: 1 });
    const bands = []; for (let y = 206; y < 400; y += 46) bands.push({ p: [P(470, y, 1), P(546, y, 1), P(546, y + 22, 1), P(470, y + 22, 1)], c: '#c42a2a', m: 'flat', line: 0 });
    out.push({ p: trap(508, 196, 400, 22, 34), c: '#f2eee6', m: 'cloth', line: 1, sub: bands.concat([{ p: [P(516, 190, 1), P(550, 190, 1), P(550, 404, 1), P(524, 404, 1)], c: '#9a9088', m: 'flat', line: 0 }]) });
    out.push({ p: box(480, 186, 536, 198), c: '#3a3a42', m: 'steel', line: 1 }, { p: box(488, 150, 528, 188), c: '#ffd860', m: 'gem', gloss: 1, line: 1, lc: '#3a2a10', lines: [{ p: [[508, 150], [508, 188]], w: 3, c: '#3a3a42', a: 0.9 }] }, ...dome(508, 152, 24, 26, '#b8322a', '#7a1a14'));
    // пирс и корабль
    out.push({ p: box(0, 392, 212, 402), c: '#8a6a40', m: 'wood', flow: 0, line: 1, lines: planks(0, 392, 212, 402, 18, true, 0.5) });
    out.push({ p: tube([[112, 352, 7], [112, 150, 5]]), c: '#6a4a2a', m: 'wood', line: 0.8 }, { p: tube([[60, 232, 4], [168, 232, 4]]), c: '#6a4a2a', m: 'wood', line: 0.6 });
    out.push({ p: [P(66, 162, 1), [110, 168], P(156, 162, 1), [166, 200], P(160, 230, 1), [110, 222], P(62, 230, 1), [56, 196]], c: '#efe6cc', m: 'cloth', line: 1, lines: [{ p: [[70, 196], [156, 196]], w: 6, c: '#c42a2a', a: 0.85 }] });
    out.push({ p: [P(56, 240, 1), [112, 246], P(172, 240, 1), [182, 290], P(176, 334, 1), [112, 326], P(52, 334, 1), [44, 288]], c: '#efe6cc', m: 'cloth', line: 1, lines: [{ p: [[112, 244], [112, 330]], w: 2, a: 0.4 }] });
    out.push(...flag(112, 152, 30, '#c42a2a', { fw: 28, fh: 12 }));
    out.push({ p: [P(10, 350, 1), P(214, 350, 1), [198, 380], P(176, 400, 1), P(40, 400, 1), [20, 380]], c: '#6a4424', m: 'wood', flow: 0, line: 1, lines: [{ p: [[14, 362], [210, 362]], w: 5, c: '#c89a3a', a: 0.9 }], sub: [0, 1, 2, 3].map(i => ({ e: [60 + i * 36, 376, 6, 6], c: '#2a1a10', m: 'flat', line: 0 })) });
    // вода
    out.push(water(0, 567, 400, G, '#2a78a8', { n: 12 }));
    return out;
  });

  /* ---------- Фабрика: кирпич, медь, трубы с дымом, большая шестерня ---------- */
  town('town_factory', () => {
    const S = { wall: '#9a4028', shade: '#62261a', light: '#b85a3a', roof: '#6a6a74', roofD: '#3b3b44', finial: '#c8883a' };
    const BR = '#9a4028', CU = '#c8883a', out = [];
    // трубы с дымом
    for (const x of [44, 523]) {
      out.push({ p: trap(x, 96, G, 15, 21), c: '#7a3020', m: 'cloth', line: 1, lines: masonry(x - 22, 96, x + 22, G, 16, 20, 0.35).concat([130, 200].map(y => ({ p: [[x - 22, y], [x + 22, y]], w: 5, c: '#3a3a42', a: 0.9 }))), sub: [{ p: box(x + 6, 90, x + 24, G + 2), c: '#4e1c12', m: 'flat', line: 0 }] });
      out.push({ p: box(x - 20, 88, x + 20, 100), c: '#3b3b44', m: 'steel', line: 1 });
      for (let i = 0; i < 3; i++) out.push({ p: ell(x + 6 + i * 12, 70 - i * 24, 14 + i * 5, 11 + i * 4, 10), c: '#c8c8ce', m: 'cloth', line: 0.6, lc: '#8a8a94', ao: 0.4 });
    }
    // цеха с пилообразной крышей
    for (const [x0, x1] of [[70, 200], [367, 497]]) {
      const pts = [P(x0, 300, 1)], n = 3, st = (x1 - x0) / n;
      for (let i = 0; i < n; i++) pts.push(P(x0 + i * st, 262, 1), P(x0 + (i + 1) * st, 300, 1));
      out.push({ p: box(x0, 298, x1, G), c: BR, m: 'cloth', line: 1, lines: masonry(x0, 298, x1, G, 16, 24, 0.35) }, { p: pts, c: '#6a6a74', m: 'steel', line: 1 });
      for (let i = 0; i < n; i++) out.push({ p: [P(x0 + i * st + 4, 266, 1), P(x0 + i * st + 4, 296, 1), P(x0 + (i + 1) * st - 10, 296, 1)], c: WIN, m: 'gem', line: 0.8, lc: WIN_LC });
      for (const x of [x0 + 30, x1 - 30]) out.push(...win(x, 370, 10, 30, { sill: '#6a6a74' }));
    }
    // медные трубопроводы
    out.push({ p: tube([[64, 230, 10], [120, 230, 10], [140, 244, 10], [140, 262, 10]]), c: CU, m: 'gold', line: 0.9 }, { p: tube([[503, 230, 10], [447, 230, 10], [427, 244, 10], [427, 262, 10]]), c: CU, m: 'gold', line: 0.9 });
    // главный корпус
    const d = tower(CX, G, 90, 270, Object.assign({}, S, { win: [], roofH: 120, eave: 10, bw: 26, rh: 16 }));
    out.push(...d, ...gear(CX, 240, 52, 12, CU));
    out.push(...win(CX - 62, 220, 10, 30), ...win(CX + 62, 220, 10, 30), ...win(CX - 62, 300, 10, 30), ...win(CX + 62, 300, 10, 30));
    out.push({ p: box(CX - 96, 160, CX + 96, 170), c: '#3b3b44', m: 'steel', line: 1 });
    out.push(...gate(CX, G, 30, 76, { ring: '#6a6a74', rw: 10, grateC: '#8a8a94' }));
    return out;
  });

  /* ---------- Улей: купола-ульи из воска, соты, хитиновые шпили ---------- */
  function hexPts(cx, cy, r) { const out = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; out.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9, 1)); } return out; }
  function combLines(x0, y0, x1, y1, r) {
    const out = [];
    for (let row = 0, y = y0; y < y1 + r; y += r * 1.56, row++) for (let x = x0 + (row % 2) * r * 1.5; x < x1 + r; x += r * 3) out.push({ p: hexPts(x, y, r).map(p => [p[0], p[1]]).concat([[x + r, y]]), w: 1.8, a: 0.45 });
    return out;
  }
  function skep(cx, G, hw, h, c, o) {
    o = o || {}; const lines = [];
    for (let y = G - 16; y > G - h + 12; y -= 20) { const k = Math.sqrt(Math.max(0, 1 - Math.pow((G - y) / h, 2))); lines.push({ p: [[cx - hw * k, y], [cx, y + 8 * k], [cx + hw * k, y]], w: 3, a: 0.5 }); }
    return { p: [P(cx - hw, G, 1), [cx - hw * 0.98, G - h * 0.45], [cx - hw * 0.7, G - h * 0.85], [cx, G - h], [cx + hw * 0.7, G - h * 0.85], [cx + hw * 0.98, G - h * 0.45], P(cx + hw, G, 1)], c, m: 'leather', gloss: 0.4, line: 1, lines: lines.concat(o.comb ? combLines(cx - hw * 0.6, G - h * 0.8, cx - hw * 0.1, G - h * 0.45, 9) : []), belly: 0.3,
      sub: [{ p: [[cx + hw * 0.35, G - h * 1.05], [cx + hw * 1.1, G - h * 0.5], [cx + hw * 1.1, G + 4], [cx + hw * 0.5, G + 4]], c: tone(c, -0.3), m: 'flat', line: 0 }] };
  }
  function spire(x, G, h, w, c, orb) {
    return [{ p: [P(x - w, G, 1), [x - w * 0.7, G - h * 0.4], [x - w * 0.2, G - h * 0.8], P(x + w * 0.1, G - h, 1), [x + w * 0.4, G - h * 0.6], [x + w * 0.8, G - h * 0.3], P(x + w, G, 1)], c, m: 'horn', gloss: 0.7, line: 1,
      lines: [0.25, 0.45, 0.65].map(t => ({ p: [[x - w * (1 - t) * 0.9, G - h * t], [x + w * (1 - t) * 0.9, G - h * t + 6]], w: 2.4, a: 0.5 })) },
    { e: [x + w * 0.1, G - h - 8, 10, 11], c: orb, m: 'gem', line: 0.8, glint: [[x + w * 0.1 - 3, G - h - 12, 4]] }];
  }
  town('town_hive', () => {
    const WAX = '#d8b048', CH = '#8aa02a', out = [];
    out.push(...spire(34, G, 330, 26, CH, '#ffb020'), ...spire(533, G, 330, 26, CH, '#ffb020'), ...spire(160, 350, 200, 18, '#6a8020', '#ffc040'), ...spire(410, 350, 200, 18, '#6a8020', '#ffc040'));
    out.push({ p: box(18, 368, 549, G), c: '#c8a040', m: 'leather', line: 1, lines: combLines(20, 378, 549, G, 11) });
    out.push(skep(104, G, 72, 150, '#caa040'), skep(463, G, 72, 150, '#caa040'));
    for (const x of [104, 463]) out.push({ e: [x, G - 30, 14, 12], c: '#2a1a08', m: 'cloth', line: 1 });
    // большой улей
    out.push(skep(CX, G, 124, 300, WAX, { comb: true }));
    for (const [x, y] of [[CX - 40, 196], [CX + 20, 176], [CX + 60, 230], [CX - 70, 270], [CX - 10, 256], [CX + 64, 300], [CX - 50, 330]]) out.push({ p: hexPts(x, y, 13), c: '#ffc040', m: 'gem', gloss: 0.7, line: 1, lc: '#5a3a08' });
    out.push({ p: ell(CX, 390, 36, 34, 12), c: '#1e1206', m: 'cloth', ao: 1.4, line: 1 }, { p: tube([[CX - 44, 364, 12], [CX, 350, 12], [CX + 44, 364, 12]]), c: '#e8c060', m: 'leather', line: 1 });
    // капли воска
    for (const [x, y, l] of [[CX - 96, 300, 26], [CX + 100, 290, 20], [CX - 30, 360, 14], [CX + 40, 362, 18]]) out.push({ p: tube([[x, y, 8], [x, y + l, 7]]), c: '#f0d070', m: 'gem', gloss: 0.8, line: 0.6 });
    out.push({ p: tube([[CX, 138, 8], [CX, 100, 4]]), c: CH, m: 'horn', line: 0.8 }, { e: [CX, 96, 10, 11], c: '#ffb020', m: 'gem', line: 0.8 });
    return out;
  });

  /* ---------- Бастион: бревенчатый частокол, длинный дом, священный дуб, вышки, тотемы ---------- */
  town('town_bastion', () => {
    const WOOD = '#8a5a30', MOSS = '#5a8a2e', out = [];
    // священный дуб над городом
    out.push(...trunk(CX, 300, 150, 30, '#6a4a2c', 0));
    for (const s of [-1, 1]) out.push({ p: tube([[CX, 190, 20], [CX + s * 60, 150, 13], [CX + s * 110, 140, 7]]), c: '#6a4a2c', m: 'wood', line: 0.9 });
    out.push(...foliage(CX, 108, 170, 88, 10, ['#2a5a20', '#3e7a2a', '#52902e', '#6aa838'], 29));
    // частокол
    out.push(palisade(10, 557, 290, G, 22, '#7a5230', { bands: [340, 396] }));
    // сторожевые вышки на столбах
    for (const x of [58, 509]) {
      for (const dx of [-26, 26]) out.push({ p: tube([[x + dx, G, 9], [x + dx * 0.8, 226, 8]]), c: '#5a3a1c', m: 'wood', line: 0.8 });
      out.push({ p: tube([[x - 26, 330, 4], [x + 22, 262, 4]]), c: '#5a3a1c', m: 'wood', line: 0.6 }, { p: tube([[x + 26, 330, 4], [x - 22, 262, 4]]), c: '#5a3a1c', m: 'wood', line: 0.6 });
      out.push({ p: box(x - 36, 180, x + 36, 232), c: WOOD, m: 'wood', flow: -Math.PI / 2, line: 1, lines: planks(x - 36, 180, x + 36, 232, 12, true, 0.45) }, ...win(x, 216, 8, 22, { cross: false }));
      out.push({ p: [P(x - 48, 186, 1), P(x, 126, 1), P(x + 48, 186, 1), [x, 194]], c: MOSS, m: 'fur', furLen: 0.8, flow: Math.PI * 0.5, line: 1 });
    }
    // длинный дом вождя
    const logs = []; for (let y = 282; y < G; y += 16) logs.push({ p: [[CX - 104, y], [CX + 104, y]], w: 2.4, a: 0.5 });
    out.push({ p: box(CX - 104, 272, CX + 104, G), c: WOOD, m: 'wood', flow: 0, line: 1, lines: logs, sub: [{ p: box(CX + 60, 270, CX + 106, G + 2), c: '#5a3a1c', m: 'flat', line: 0 }] });
    out.push({ p: gable(CX - 104, CX + 104, 282, 104, 22), c: MOSS, m: 'fur', furLen: 0.9, flow: Math.PI * 0.5, line: 1, belly: 0.3, lines: [{ p: [[CX - 110, 280], [CX, 186], [CX + 110, 280]], w: 5, c: '#4a3018', a: 0.8 }] });
    out.push({ p: tube([[CX - 30, 196, 8], [CX + 4, 176, 7], [CX + 30, 150, 4]]), c: '#8a5a30', m: 'wood', line: 0.8 }, { p: tube([[CX + 30, 196, 8], [CX - 4, 176, 7], [CX - 30, 150, 4]]), c: '#8a5a30', m: 'wood', line: 0.8 });
    out.push(...win(CX - 62, 330, 9, 24), ...win(CX + 62, 330, 9, 24), ...win(CX, 250, 10, 26));
    out.push(...gate(CX, G, 30, 76, { grate: false, door: '#5a3a1c' }));
    // тотемы с рогатыми черепами у ворот
    for (const x of [178, 388]) out.push({ p: tube([[x, G, 10], [x, 340, 8]]), c: '#6a4424', m: 'wood', line: 0.8, lines: [{ p: [[x - 5, 390], [x + 5, 390]], w: 4, c: '#b8322a', a: 0.9 }] }, ...skull(x, 330, 14, { horns: true }));
    return out;
  });

  /* ============================== ПОСТРОЙКИ ЭКРАНА ГОРОДА ==============================
     Стены — '$n' (тёмная сторона '$N'), крыши — '$r' (тёмная половина '$R'). Экран города рисует
     их в масштабе 2 (5 единиц на точку сцены), поэтому штрихи толще, чем у городов на карте. */
  const BEAM = '#5a3a22', LAMP = WIN;
  function bld(name, build) {
    const fr = frameOf(name); if (!fr) return;
    one(name, build(fr, fr.anchor[1]), fr);
  }
  const TWR = { wall: Tn, shade: TN, roof: Tr, roofD: TR, rh: 26, ma: 0.4, mw: 2.6, finial: GOLD };
  /** Стена-коробка с тёмной правой стороной и кладкой. */
  function walls(x0, y0, x1, y1, o) {
    o = o || {};
    return { p: box(x0, y0, x1, y1), c: o.c || Tn, m: 'cloth', line: 1.2, belly: 0.15,
      sub: [{ p: box(x1 - (x1 - x0) * (o.shadeK || 0.16), y0 - 2, x1 + 2, y1 + 2), c: o.shade || TN, m: 'flat', line: 0 }].concat(o.sub || []),
      lines: o.lines || masonry(x0, y0, x1, y1, o.rh || 26, o.bw || 44, o.ma || 0.4, 2.6) };
  }
  /** Вальмовая крыша (трапеция) над x0…x1: низ y, высота h, свес e, срез боков inset. */
  function hip(x0, x1, y, h, e, inset, o) {
    o = o || {}; const rows = [];
    for (let k = 1; k < 4; k++) { const yy = y - h * k / 4, dx = inset * k / 4; rows.push({ p: [[x0 - e + dx, yy], [x1 + e - dx, yy]], w: 2.6, a: 0.45 }); }
    for (let x = x0 + 10; x < x1; x += 34) rows.push({ p: [[x, y - h * 0.02], [x + (x - (x0 + x1) / 2) * -0.08, y - h + 4]], w: 1.6, a: 0.25 });
    return { p: [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)], c: o.c || Tr, m: 'leather', gloss: 0.25, line: 1.2, lines: rows, id: o.id,
      sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.18, y - h - 2, 1), P(x1 + e + 2, y - h - 2, 1), P(x1 + e + 2, y + 2, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.3, y + 2, 1)], c: o.cd || TR, m: 'flat', line: 0 }] };
  }
  /** Карниз: светлая полоса под крышей. */
  const cornice = (x0, x1, y, c) => ({ p: box(x0, y - 5, x1, y + 5), c: c || TN, m: 'cloth', line: 1 });
  /** Дверь: арка с досками и фонарём (lamp — точка огня ночью). */
  function door(cx, base, w, h, lamp) {
    const out = [{ p: arch(cx, base, w + 7, h + 7), c: TN, m: 'cloth', line: 1, lines: voussoirs(cx, base - h + w, w + 4, 6) },
      { p: arch(cx, base, w, h), c: DOOR, m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [{ p: [[cx, base - h], [cx, base]], w: 2.6, a: 0.8 }, { p: [[cx - w, base - h * 0.3], [cx + w, base - h * 0.3]], w: 3.4, c: IRON, a: 0.9 }, { p: [[cx - w, base - h * 0.66], [cx + w, base - h * 0.66]], w: 3.4, c: IRON, a: 0.9 }] }];
    if (lamp) out.push({ e: [lamp[0], lamp[1], 6, 6], c: LAMP, m: 'gem', gloss: 1, line: 1, lc: WIN_LC });
    return out;
  }
  /** Прямоугольное окно со ставнями. */
  function sqwin(cx, cy, w, h, o) {
    o = o || {};
    const out = [];
    if (o.shutters) for (const s of [-1, 1]) out.push({ p: box(cx + s * w, cy - h, cx + s * (w + w * 0.8), cy + h), c: o.shutters, m: 'wood', flow: -Math.PI / 2, line: 1 });
    out.push({ p: box(cx - w, cy - h, cx + w, cy + h), c: WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.2, lc: WIN_LC, lines: [{ p: [[cx, cy - h], [cx, cy + h]], w: 3, c: WIN_LC, a: 0.9 }, { p: [[cx - w, cy], [cx + w, cy]], w: 3, c: WIN_LC, a: 0.9 }] });
    out.push({ p: box(cx - w - 4, cy + h, cx + w + 4, cy + h + 6), c: TN, m: 'cloth', line: 1 });
    return out;
  }
  const pennant = (x, base, top, c) => flag(x, base, base - top, c || WIN, { fw: 30, fh: 20, pw: 4 });

  /* ---------- ратуша: от сельской управы до капитолия ---------- */
  bld('bld_hall_1', (f, g) => [
    ...tower(80, 200, 30, 120, Object.assign({}, TWR, { roofH: 58, win: [], mason: false, eave: 6 })),
    walls(56, 164, 364, g), hip(56, 364, 170, 84, 14, 64), cornice(52, 368, 168),
    ...win(105, 210, 12, 32), ...win(305, 210, 12, 32), ...win(105, 300, 12, 32), ...win(305, 300, 12, 32),
    { e: [210, 196, 20, 20], c: GOLD, m: 'gold', line: 1, lines: [{ p: [[210, 196], [210, 183]], w: 3, c: '#3a2a10', a: 0.9 }, { p: [[210, 196], [219, 200]], w: 3, c: '#3a2a10', a: 0.9 }] },
    { p: box(170, g - 8, 250, g), c: TN, m: 'cloth', line: 1 },
    ...door(210, g - 8, 26, 100),
  ]);
  bld('bld_hall_2', (f, g) => [
    ...tower(80, 250, 32, 150, Object.assign({}, TWR, { roofH: 66, win: [168], winW: 7, winH: 20, mason: false })),
    ...tower(380, 250, 32, 150, Object.assign({}, TWR, { roofH: 66, win: [168], winW: 7, winH: 20, mason: false })),
    walls(46, 196, 414, g), hip(46, 414, 202, 92, 14, 90), cornice(42, 418, 200),
    ...win(115, 240, 12, 32), ...win(335, 240, 12, 32), ...win(115, 340, 12, 32), ...win(335, 340, 12, 32),
    { e: [230, 232, 24, 24], c: GOLD, m: 'gold', line: 1, lines: [{ p: [[230, 232], [230, 216]], w: 3.4, c: '#3a2a10', a: 0.9 }, { p: [[230, 232], [241, 238]], w: 3.4, c: '#3a2a10', a: 0.9 }] },
    { p: box(180, g - 10, 280, g), c: TN, m: 'cloth', line: 1 },
    ...door(230, g - 10, 30, 118),
  ]);
  bld('bld_hall_3', (f, g) => [
    ...tower(260, 200, 30, 130, Object.assign({}, TWR, { roofH: 64, win: [140], winW: 7, winH: 20, mason: false })),
    ...tower(76, 260, 34, 150, Object.assign({}, TWR, { roofH: 72, win: [178], winW: 8, winH: 22, mason: false })),
    ...tower(444, 260, 34, 150, Object.assign({}, TWR, { roofH: 72, win: [178], winW: 8, winH: 22, mason: false })),
    walls(44, 204, 476, g), hip(44, 476, 210, 86, 14, 80), cornice(40, 480, 208),
    // фронтон с круглым окном
    { p: [P(176, 212, 1), P(260, 140, 1), P(344, 212, 1)], c: Tn, m: 'cloth', line: 1.2, sub: [{ p: [P(264, 136, 1), P(350, 214, 1), P(300, 214, 1)], c: TN, m: 'flat', line: 0 }] },
    { p: tube([[166, 214, 8], [260, 132, 8], [354, 214, 8]]), c: Tr, m: 'leather', line: 1 },
    { e: [260, 186, 18, 18], c: WIN, m: 'gem', line: 1.2, lc: WIN_LC, lines: [{ p: [[242, 186], [278, 186]], w: 3, c: WIN_LC, a: 0.9 }, { p: [[260, 168], [260, 204]], w: 3, c: WIN_LC, a: 0.9 }] },
    ...win(125, 250, 12, 32), ...win(385, 250, 12, 32), ...win(125, 350, 12, 32), ...win(385, 350, 12, 32), ...win(195, 300, 10, 28), ...win(325, 300, 10, 28),
    { p: box(200, 330, 320, 342), c: TN, m: 'cloth', line: 1 },
    { p: box(200, g - 10, 320, g), c: TN, m: 'cloth', line: 1 },
    ...door(260, g - 10, 32, 106),
  ]);
  bld('bld_hall_4', (f, g) => {
    const out = [];
    // купол на барабане
    out.push(walls(196, 150, 364, 244, { rh: 22 }), ...dome(280, 152, 92, 96, Tr, TR, { m: 'leather', gloss: 0.5 }));
    out.push({ p: tube([[280, 60, 6], [280, 28, 4]]), c: GOLD, m: 'gold', line: 0.8 }, { e: [280, 24, 8, 8], c: GOLD, m: 'gold', line: 0.8 });
    for (const x of [222, 262, 302, 342]) out.push(...win(x, 224, 7, 34, { cross: false }));
    for (const [x, h] of [[152, 170], [408, 170]]) out.push(...tower(x, 250, 26, h - 70, Object.assign({}, TWR, { roofH: 58, win: [], mason: false })));
    out.push(...tower(66, g, 36, 410, Object.assign({}, TWR, { roofH: 90, win: [210, 400, 480], winW: 8, winH: 24 })));
    out.push(...tower(494, g, 36, 410, Object.assign({}, TWR, { roofH: 90, win: [210, 400, 480], winW: 8, winH: 24 })));
    out.push(walls(100, 244, 460, g), merlons(96, 464, 242, 14, 24, Tn, { k: 0.5 }));
    out.push(...win(135, 296, 12, 32), ...win(415, 296, 12, 32), ...win(135, 400, 12, 32), ...win(415, 400, 12, 32), ...win(135, 500, 12, 32), ...win(415, 500, 12, 32));
    // портик: фронтон и колонны
    out.push({ p: [P(170, 336, 1), P(280, 262, 1), P(390, 336, 1)], c: Tn, m: 'cloth', line: 1.2, sub: [{ p: [P(284, 258, 1), P(396, 338, 1), P(330, 338, 1)], c: TN, m: 'flat', line: 0 }] });
    out.push({ p: tube([[160, 338, 9], [280, 256, 9], [400, 338, 9]]), c: Tr, m: 'leather', line: 1 }, { p: box(166, 334, 394, 346), c: TN, m: 'cloth', line: 1 });
    out.push({ e: [280, 308, 14, 14], c: GOLD, m: 'gold', line: 1 });
    out.push({ p: box(186, 346, 374, g - 16), c: '#2a2018', m: 'cloth', line: 1 }, ...door(280, g - 16, 30, 110));
    for (const x of [192, 240, 320, 368]) out.push({ p: box(x - 11, 346, x + 11, g - 16), c: Tn, m: 'cloth', line: 1, lines: [{ p: [[x - 4, 350], [x - 4, g - 20]], w: 2, a: 0.4 }, { p: [[x + 4, 350], [x + 4, g - 20]], w: 2, a: 0.4 }], sub: [{ p: box(x + 4, 344, x + 13, g), c: TN, m: 'flat', line: 0 }] });
    out.push({ p: box(160, g - 16, 400, g - 8), c: Tn, m: 'cloth', line: 1 }, { p: box(150, g - 8, 410, g), c: TN, m: 'cloth', line: 1 });
    return out;
  });

  /* ---------- гильдия магов: башня, ярус за уровнем ---------- */
  function guild(name, level) {
    bld(name, (f, g) => {
      const cx = f.anchor[0], top = 170, floors = level + 1, fh = (g - 30 - top) / floors, hw0 = 70, hw1 = 52, out = [];
      const hwAt = y => hw1 + (hw0 - hw1) * (y - top) / (g - top);
      out.push({ p: box(cx - hw0 - 14, g - 30, cx + hw0 + 14, g), c: TN, m: 'cloth', line: 1.2, lines: masonry(cx - hw0 - 14, g - 30, cx + hw0 + 14, g, 15, 30, 0.4, 2.4) });
      out.push({ p: [P(cx - hw1, top, 1), P(cx + hw1, top, 1), P(cx + hw0, g - 30, 1), P(cx - hw0, g - 30, 1)], c: Tn, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 30, 24, 40, 0.4, 2.6),
        sub: [{ p: [P(cx + hw1 * 0.45, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.45, g, 1)], c: TN, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh, hw = hwAt(y); out.push({ p: box(cx - hw - 8, y - 6, cx + hw + 8, y + 6), c: TN, m: 'cloth', line: 1 }); }
      // окна-витражи по ярусам, дверь внизу
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh - 16, dx = (i % 2 ? -1 : 1) * 16; out.push(...win(cx + dx, y, 13, Math.min(56, fh * 0.55), { pointed: true, c: '#8ae0ff', lc: '#1a3a5a' })); }
      out.push(...door(cx, g - 30, 30, Math.min(110, fh * 0.8)));
      // крыша, золотой обруч и сфера
      out.push({ p: box(cx - hw1 - 12, top - 8, cx + hw1 + 12, top + 6), c: GOLD, m: 'gold', line: 1 });
      out.push(...cone(cx, top - 6, hw1 + 18, 110, Tr, TR, { flare: 0.14 }));
      out.push({ p: tube([[cx, top - 110, 7], [cx, top - 140, 5]]), c: GOLD, m: 'gold', line: 0.8 }, { e: [cx, top - 150, 13, 13], c: '#f0a0f0', m: 'gem', gloss: 1.2, line: 1, lc: '#6a2a6a', glint: [[cx - 4, top - 154, 5]] });
      return out;
    });
  }
  for (let i = 1; i <= 4; i++) guild('bld_guild_' + i, i);

  /* ---------- таверна: фахверк, вывеска с кружкой, труба ---------- */
  bld('bld_tavern', (f, g) => {
    const out = [];
    out.push({ p: box(244, 26, 284, 130), c: TN, m: 'cloth', line: 1.2, lines: masonry(244, 26, 284, 130, 16, 20, 0.45, 2.4) }, { p: box(238, 18, 290, 30), c: TN, m: 'cloth', line: 1 });
    out.push(walls(56, 210, 304, g));
    // верхний этаж с выносом, фахверк
    const beams = [[40, 118], [40, 208], [320, 118], [320, 208], [110, 118], [110, 208], [180, 118], [180, 208], [250, 118], [250, 208]];
    const lines = []; for (let i = 0; i < beams.length; i += 2) lines.push({ p: [beams[i], beams[i + 1]], w: 8, c: BEAM, a: 1 });
    lines.push({ p: [[40, 164], [320, 164]], w: 6, c: BEAM, a: 1 }, { p: [[40, 118], [110, 164]], w: 6, c: BEAM, a: 1 }, { p: [[320, 118], [250, 164]], w: 6, c: BEAM, a: 1 });
    out.push({ p: box(40, 118, 320, 212), c: Tn, m: 'cloth', line: 1.2, lines, sub: [{ p: box(282, 116, 322, 214), c: TN, m: 'flat', line: 0 }] });
    out.push({ p: box(34, 206, 326, 218), c: BEAM, m: 'wood', flow: 0, line: 1 });
    out.push(hip(40, 320, 124, 84, 18, 70));
    out.push(...sqwin(75, 150, 16, 16), ...sqwin(145, 150, 16, 16), ...sqwin(215, 150, 16, 16), ...sqwin(285, 150, 14, 16));
    out.push(...sqwin(100, 272, 18, 22, { shutters: BEAM }), ...sqwin(262, 272, 18, 22, { shutters: BEAM }));
    out.push(...door(180, g, 26, 96, [187, 274]));
    // вывеска: кронштейн и доска с кружкой
    out.push({ p: tube([[304, 236, 5], [350, 236, 5]]), c: IRON, m: 'steel', line: 0.8 }, { p: box(316, 244, 352, 290), c: '#8a5a30', m: 'wood', flow: 0, line: 1.2,
      sub: [{ p: [P(324, 256, 1), P(340, 256, 1), P(340, 282, 1), P(324, 282, 1)], c: GOLD, m: 'gold', line: 0.8 }, { e: [344, 268, 5, 8], c: '#8a5a30', m: 'flat', line: 0 }] });
    out.push({ p: tube([[322, 236, 2], [322, 246, 2]]), c: IRON, m: 'steel', line: 0 }, { p: tube([[346, 236, 2], [346, 246, 2]]), c: IRON, m: 'steel', line: 0 });
    // бочка у входа
    out.push({ p: [P(40, g, 1), [36, g - 30], P(44, g - 58, 1), P(84, g - 58, 1), [92, g - 30], P(88, g, 1)], c: '#8a5a30', m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[38, g - 14], [90, g - 14]], w: 4, c: IRON, a: 0.9 }, { p: [[40, g - 46], [88, g - 46]], w: 4, c: IRON, a: 0.9 }] });
    return out;
  });

  /* ---------- рынок: аркада с навесами, монета на коньке, товары ---------- */
  bld('bld_market', (f, g) => {
    const out = [];
    out.push(walls(28, 116, 380, g));
    out.push(hip(28, 380, 120, 58, 14, 70), cornice(24, 384, 120));
    // вывеска-монета на коньке
    out.push({ p: tube([[190, 64, 5], [190, 90, 5]]), c: IRON, m: 'steel', line: 0.6 }, { e: [190, 50, 24, 24], c: WIN, m: 'gold', gloss: 1, line: 1.2, lc: '#5a3a10', lines: [{ p: ell(190, 50, 16, 16, 12).concat([[206, 50]]), w: 3, c: '#8a6a20', a: 0.8 }], sub: [{ p: box(185, 45, 195, 55), c: '#6a4a10', m: 'flat', line: 0 }] });
    // три арки с навесами и лавками
    for (const [cx, ware] of [[94, '#c8322a'], [204, null], [314, '#e8c040']]) {
      out.push({ p: arch(cx, g, 38, 96), c: '#2a2018', m: 'cloth', ao: 1.2, line: 1.2 });
      if (ware) out.push({ p: box(cx - 34, g - 30, cx + 34, g), c: '#8a5a30', m: 'wood', flow: 0, line: 1 }, ...[-20, 0, 20].map(dx => ({ e: [cx + dx, g - 36, 10, 9], c: ware, m: 'skin', line: 0.8 })));
      const stripes = []; for (let x = cx - 50; x < cx + 50; x += 20) stripes.push({ p: [P(x, g - 110, 1), P(x + 10, g - 110, 1), P(x + 12, g - 84, 1), P(x + 2, g - 84, 1)], c: '#f4ecd8', m: 'flat', line: 0 });
      out.push({ p: [P(cx - 50, g - 112, 1), P(cx + 50, g - 112, 1), P(cx + 56, g - 84, 1), [cx + 38, g - 78], [cx + 19, g - 84], [cx, g - 78], [cx - 19, g - 84], [cx - 38, g - 78], P(cx - 56, g - 84, 1)], c: Tr, m: 'cloth', line: 1.2, sub: stripes });
    }
    out.push({ e: [209, 200, 6, 6], c: LAMP, m: 'gem', line: 1, lc: WIN_LC });
    // мешки и ящики перед рынком
    out.push({ p: box(150, g - 34, 184, g), c: '#9a7040', m: 'wood', flow: 0, line: 1, lines: [{ p: [[150, g - 34], [184, g]], w: 2.4, a: 0.6 }] });
    out.push({ p: [[236, g], [232, g - 20], [240, g - 36], [252, g - 40], [264, g - 36], [270, g - 20], [266, g]], c: '#d8c090', m: 'cloth', line: 1 });
    return out;
  });

  /* ---------- кузница: горн с огнём, наковальня, высокая труба ---------- */
  bld('bld_blacksmith', (f, g) => {
    const out = [];
    out.push({ p: trap(252, 26, 200, 22, 26), c: TN, m: 'cloth', line: 1.2, lines: masonry(224, 26, 280, 200, 16, 22, 0.5, 2.4) }, { p: box(222, 16, 282, 30), c: IRON, m: 'steel', line: 1 });
    out.push(walls(38, 196, 296, g, { c: TN, shade: TN, ma: 0.5 }));
    out.push(hip(38, 296, 202, 88, 16, 60));
    // открытый горн
    out.push({ p: arch(104, g, 42, 124), c: '#2a1a12', m: 'cloth', ao: 1.2, line: 1.2 }, { p: ell(104, g - 26, 34, 22, 12), c: '#ff7a24', m: 'gem', gloss: 1, line: 0, sub: [{ p: ell(100, g - 26, 20, 12, 10), c: '#ffe08a', m: 'flat', line: 0 }] });
    out.push(...flame(104, g - 34, 22, 50));
    out.push(...door(214, g, 22, 88), { e: [173, 306, 6, 6], c: LAMP, m: 'gem', line: 1, lc: WIN_LC });
    out.push(...sqwin(262, 258, 12, 16));
    // вывеска-подкова
    out.push({ p: tube([[160, 234, 12], [150, 256, 12], [160, 276, 12], [182, 276, 12], [192, 256, 12], [182, 234, 12]]), c: '#9aa0a8', m: 'steel', line: 1 });
    // наковальня
    out.push({ p: [P(10, g - 40, 1), P(62, g - 40, 1), [74, g - 34], P(56, g - 26, 1), P(50, g - 12, 1), P(60, g, 1), P(16, g, 1), P(26, g - 12, 1), P(20, g - 26, 1)], c: '#4a4a52', m: 'steel', line: 1 });
    return out;
  });

  /* ---------- склад ресурсов: круглый амбар-силос с амбаром ---------- */
  bld('bld_silo', (f, g) => {
    const out = [];
    out.push(walls(20, 230, 150, g, { rh: 22, bw: 36 }), { p: gable(20, 150, 236, 80, 14), c: Tr, m: 'leather', line: 1.2, lines: [{ p: [[20, 214], [150, 214]], w: 2.4, a: 0.4 }, { p: [[40, 196], [130, 196]], w: 2.4, a: 0.4 }], sub: [{ p: [P(85, 150, 1), P(170, 240, 1), P(85, 240, 1)], c: TR, m: 'flat', line: 0 }] });
    out.push({ p: box(56, 280, 114, g), c: DOOR, m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[56, 280], [114, g]], w: 4, c: BEAM, a: 0.9 }, { p: [[114, 280], [56, g]], w: 4, c: BEAM, a: 0.9 }] });
    // силос: цилиндр с обручами
    const hoops = []; for (let y = 170; y < g; y += 44) hoops.push({ p: [[140, y], [210, y + 10], [280, y]], w: 5, c: IRON, a: 0.8 });
    out.push({ p: [P(140, 150, 1), P(280, 150, 1), P(280, g, 1), [210, g + 3], P(140, g, 1)], c: Tn, m: 'cloth', line: 1.2, lines: hoops.concat(masonry(140, 150, 280, g, 22, 32, 0.3, 2.2)),
      sub: [{ p: box(236, 146, 284, g + 4), c: TN, m: 'flat', line: 0 }] });
    out.push(...cone(210, 152, 84, 118, Tr, TR, { flare: 0.04 }));
    out.push({ p: tube([[210, 36, 5], [210, 18, 4]]), c: GOLD, m: 'gold', line: 0.6 });
    out.push(...door(186, g, 20, 80), { e: [166, 323, 6, 6], c: LAMP, m: 'gem', line: 1, lc: WIN_LC });
    out.push(...sqwin(236, 210, 12, 14));
    // мешки и бочонок
    out.push({ p: [[250, g], [244, g - 22], [252, g - 40], [266, g - 44], [280, g - 40], [288, g - 22], [284, g]], c: '#d8c090', m: 'cloth', line: 1, lines: [{ p: [[256, g - 36], [276, g - 36]], w: 3, c: '#8a6a3a', a: 0.8 }] });
    out.push({ p: [[286, g], [284, g - 16], [292, g - 30], [304, g - 32], [314, g - 22], [312, g]], c: '#cbb080', m: 'cloth', line: 1 });
    return out;
  });

  /* ---------- особая постройка: павильон с куполом и чашей силы ---------- */
  bld('bld_special', (f, g) => {
    const out = [];
    out.push({ p: box(34, g - 26, 246, g), c: TN, m: 'cloth', line: 1.2 }, { p: box(48, g - 42, 232, g - 24), c: Tn, m: 'cloth', line: 1.2 });
    out.push({ p: box(58, 120, 222, g - 42), c: '#2a2030', m: 'cloth', ao: 1.2, line: 1 });
    // чаша силы: сияние в центре павильона
    out.push({ p: [P(118, 210, 1), P(174, 210, 1), [166, 228], P(150, 234, 1), P(142, 234, 1), [126, 228]], c: GOLD, m: 'gold', line: 1 }, { p: tube([[146, 234, 8], [146, g - 44, 12]]), c: GOLD, m: 'gold', line: 1 });
    out.push({ e: [146, 204, 22, 14], c: '#b890ff', m: 'gem', gloss: 1.2, line: 0.8, sub: [{ e: [146, 204, 10, 7], c: '#f4e8ff', m: 'flat', line: 0 }] }, { e: [146, 223, 5, 4], c: LAMP, m: 'gem', line: 0.6 });
    for (const x of [66, 112, 180, 226]) out.push({ p: box(x - 12, 118, x + 12, g - 42), c: Tn, m: 'cloth', line: 1.2, lines: [{ p: [[x - 4, 122], [x - 4, g - 46]], w: 2.2, a: 0.45 }, { p: [[x + 4, 122], [x + 4, g - 46]], w: 2.2, a: 0.45 }], sub: [{ p: box(x + 4, 116, x + 14, g), c: TN, m: 'flat', line: 0 }] });
    out.push({ p: box(40, 104, 240, 124), c: Tn, m: 'cloth', line: 1.2, lines: [{ p: [[40, 114], [240, 114]], w: 2.4, a: 0.4 }] });
    out.push(...dome(140, 106, 92, 70, Tr, TR, { m: 'leather', gloss: 0.5 }));
    out.push({ p: tube([[140, 38, 6], [140, 16, 4]]), c: GOLD, m: 'gold', line: 0.6 }, { e: [140, 12, 7, 7], c: GOLD, m: 'gold', line: 0.6 });
    return out;
  });

  /* ---------- знак улучшения: золотая медаль с молотом ---------- */
  bld('bld_upg', (f, g) => [
    { e: [57, 72, 46, 46], c: GOLD, m: 'gold', gloss: 1, line: 1.4, lc: '#5a3a10', lines: [{ p: ell(57, 72, 38, 38, 16).concat([[95, 72]]), w: 3, a: 0.5 }] },
    { p: tube([[57, 110, 10], [57, 58, 10]]), c: '#8a5a30', m: 'wood', line: 1 },
    { p: [P(28, 40, 1), P(86, 40, 1), P(86, 62, 1), P(28, 62, 1)], c: '#b7c0ca', m: 'steel', line: 1.2 },
    { p: [P(57, 128, 1), P(40, 108, 1), P(74, 108, 1)], c: '#5cc848', m: 'gem', line: 1 },
  ]);

  /* ---------- жилища существ: от хижины до чертога; флажки по уровню ---------- */
  const DW = [
    // py — верх флажков, knob — фонарь у двери, wall — верх стены, roof — высота крыши, tw — башни [cx, полуширина, верх]
    { py: 46, knob: [137, 200], x0: 24, x1: 236, wall: 122, roof: 62, door: [130, 22, 70], wins: [[70, 176], [192, 176]] },
    { py: 53, knob: [163, 223], x0: 24, x1: 289, wall: 132, roof: 64, door: [157, 24, 80], wins: [[80, 190], [236, 190]] },
    { py: 53, knob: [183, 235], x0: 24, x1: 329, wall: 136, roof: 66, door: [177, 26, 84], wins: [[80, 196], [260, 196], [300, 196]], chim: 280 },
    { py: 56, knob: [177, 240], x0: 24, x1: 290, wall: 140, roof: 66, door: [170, 26, 88], wins: [[80, 200], [240, 200]], tw: [[292, 38, 70]] },
    { py: 73, knob: [207, 326], x0: 24, x1: 330, wall: 170, roof: 70, door: [200, 30, 106], wins: [[80, 230], [80, 320], [280, 230]], tw: [[346, 44, 70]] },
    { py: 80, knob: [227, 360], x0: 24, x1: 380, wall: 180, roof: 76, door: [220, 32, 116], wins: [[80, 240], [80, 340], [330, 240], [330, 340]], tw: [[258, 34, 58, true], [400, 38, 60]] },
    { py: 93, knob: [277, 410], x0: 24, x1: 440, wall: 196, roof: 80, door: [270, 36, 130], wins: [[80, 260], [80, 380], [200, 260], [360, 260], [360, 380]], tw: [[330, 40, 70, true], [476, 50, 40, false, 'dome']] },
  ];
  DW.forEach((o, i) => bld('bld_dwell_' + (i + 1), (f, g) => {
    const out = [], lvl = i + 1;
    for (const t of o.tw || []) {
      const [cx, hw, top, back, kind] = t;
      if (!back) continue;
      out.push(...tower(cx, o.wall + 40, hw, o.wall + 40 - top - hw * 1.6, Object.assign({}, TWR, { roofH: hw * 1.8, win: [], mason: false })));
    }
    out.push(walls(o.x0, o.wall, o.x1, g), hip(o.x0, o.x1, o.wall + 6, o.roof, 12, o.roof * 0.9), cornice(o.x0 - 4, o.x1 + 4, o.wall + 4));
    if (o.chim) out.push({ p: box(o.chim - 14, o.wall - o.roof - 10, o.chim + 14, o.wall - 10), c: TN, m: 'cloth', line: 1 });
    for (const t of o.tw || []) {
      const [cx, hw, top, back, kind] = t;
      if (back) continue;
      out.push(...tower(cx, g, hw, g - top - (kind === 'dome' ? hw * 0.9 : hw * 1.8), Object.assign({}, TWR, { top: kind || 'cone', roofH: kind === 'dome' ? hw * 0.9 : hw * 1.8, win: [g - 110, g - 190].filter(y => y > top + hw * 2.4), winW: 9, winH: 26 })));
    }
    for (const [x, y] of o.wins) out.push(...sqwin(x, y, 14, 18));
    out.push(...door(o.door[0], g, o.door[1], o.door[2], o.knob));
    // флажки уровня на скате крыши
    const rx0 = o.x0 - 12 + o.roof * 0.9, roofY = x => x < rx0 ? o.wall + 6 - o.roof * (x - (o.x0 - 12)) / (o.roof * 0.9) : o.wall + 6 - o.roof;
    for (let k = 0; k < lvl; k++) { const x = 62 + k * 30; out.push(...pennant(x, Math.max(o.py + 44, roofY(x) + 8), o.py - 2)); }
    return out;
  }));

  /* ---------- стены: форт, цитадель, замок ---------- */
  function fortWall(f, g, wallTop) {
    const out = [];
    out.push(walls(10, wallTop, 970, g, { shadeK: 0.02, rh: 24, bw: 48 }), merlons(6, 974, wallTop - 2, 26, 44, Tn, { k: 0.55 }));
    out.push({ p: box(10, g - 30, 970, g), c: TN, m: 'cloth', line: 1 });
    return out;
  }
  function gatehouse(g, top) {
    return [
      walls(410, top, 570, g, { rh: 24, bw: 40 }), merlons(404, 576, top - 2, 26, 36, Tn, { k: 0.55 }),
      ...gate(490, g, 44, Math.min(150, (g - top) * 0.7), { ring: TN, rw: 14, grateC: '#6a6a72' }),
      { p: box(454, top + 24, 466, top + 60), c: HOLE, m: 'flat', line: 0 }, { p: box(514, top + 24, 526, top + 60), c: HOLE, m: 'flat', line: 0 },
    ];
  }
  bld('bld_fort', (f, g) => [...fortWall(f, g, 150), ...gatehouse(g, 96)]);
  bld('bld_citadel', (f, g) => [...fortWall(f, g, 270),
    ...tower(110, g, 60, 330, Object.assign({}, TWR, { roofH: 110, win: [200, 290], winW: 10, winH: 30, pointed: false })),
    ...tower(870, g, 60, 330, Object.assign({}, TWR, { roofH: 110, win: [200, 290], winW: 10, winH: 30 })),
    ...gatehouse(g, 216)]);
  bld('bld_castle', (f, g) => [...fortWall(f, g, 460),
    ...tower(110, g, 60, 340, Object.assign({}, TWR, { roofH: 110, win: [390, 480], winW: 10, winH: 30 })),
    ...tower(870, g, 60, 340, Object.assign({}, TWR, { roofH: 110, win: [390, 480], winW: 10, winH: 30 })),
    ...tower(490, g, 96, 520, Object.assign({}, TWR, { roofH: 116, eave: 12, win: [220, 310], winW: 12, winH: 34 })),
    ...gate(490, g, 44, 140, { ring: TN, rw: 14, grateC: '#6a6a72' })]);

  /* ============================== ЖИЛИЩА НА КАРТЕ ==============================
     Общие для всех существ, растут с уровнем: хижина → домик → каменный дом → дом с башенкой →
     чертог с башней → крепостца → башня. Слева у входа карта рисует само существо, справа вверху — флаг владельца. */
  const DS = { wall: '#c4baa4', shade: '#8e8470', light: '#dcd4c0', roof: '#b8452e', roofD: '#7a2a1c', finial: GOLD, rh: 22, ma: 0.4 };
  const SLATE = { roof: '#5a6a8a', roofD: '#36405a' };
  function logWall(x0, y0, x1, y1, c) {
    const lines = []; for (let y = y0 + 15; y < y1; y += 15) lines.push({ p: [[x0, y], [x1, y]], w: 2.4, a: 0.55 });
    return { p: box(x0, y0, x1, y1), c: c || '#8a6038', m: 'wood', flow: 0, line: 1, lines, sub: [{ p: box(x1 - (x1 - x0) * 0.2, y0 - 2, x1 + 2, y1 + 2), c: '#5a3a1e', m: 'flat', line: 0 }] };
  }
  const stoneWall = (x0, y0, x1, y1) => walls(x0, y0, x1, y1, { c: DS.wall, shade: DS.shade, rh: 20, bw: 32 });
  const G2 = 308;
  one('dwelling_1', [
    logWall(106, 220, 254, G2, '#8a6a40'),
    { p: arch(160, G2, 17, 56), c: HOLE, m: 'cloth', line: 1 }, ...win(216, 268, 10, 24, { cross: false }),
    { p: [P(76, 234, 1), [116, 176], P(180, 110, 1), [244, 176], P(284, 234, 1), [180, 248]], c: '#c8a860', m: 'fur', furLen: 1.1, flow: Math.PI * 0.5, dens: 1.2, line: 1, belly: 0.3, lines: [{ p: [[96, 232], [180, 244], [264, 232]], w: 4, c: '#8a6a30', a: 0.8 }] },
    { p: tube([[180, 118, 6], [184, 92, 3]]), c: '#5a3a1e', m: 'wood', line: 0.6 },
  ], frameOf('dwelling_1') || { w: 320, h: 313, anchor: [160, 310] });
  one('dwelling_2', [
    logWall(100, 196, 262, G2),
    { p: gable(100, 262, 204, 94, 18), c: DS.roof, m: 'leather', line: 1, lines: [{ p: [[100, 180], [262, 180]], w: 2.4, a: 0.4 }, { p: [[124, 156], [238, 156]], w: 2.4, a: 0.4 }, { p: [[150, 132], [212, 132]], w: 2.4, a: 0.4 }], sub: [{ p: [P(184, 108, 1), P(290, 210, 1), P(184, 210, 1)], c: DS.roofD, m: 'flat', line: 0 }] },
    ...door(170, G2, 18, 64), ...sqwin(226, 250, 14, 16, { shutters: '#5a3a1e' }), ...win(181, 176, 9, 22),
    { p: box(206, 268, 246, 276), c: '#6a4424', m: 'wood', line: 0.8 }, ...[212, 226, 240].map(x => ({ e: [x, 264, 6, 6], c: '#e05a7a', m: 'skin', line: 0.6 })),
  ], frameOf('dwelling_2') || { w: 320, h: 313, anchor: [160, 310] });
  one('dwelling_3', [
    { p: box(222, 124, 250, 190), c: '#8a8274', m: 'cloth', line: 1, lines: masonry(222, 124, 250, 190, 14, 14, 0.45) },
    stoneWall(82, 188, 272, G2), hip(82, 272, 194, 76, 14, 60, { c: '#9a5a36', cd: '#6a3a22' }),
    ...door(160, G2, 20, 70), ...sqwin(108, 240, 13, 16), ...sqwin(222, 240, 13, 16),
  ], frameOf('dwelling_3') || { w: 320, h: 313, anchor: [160, 310] });
  one('dwelling_4', [
    stoneWall(70, 166, 236, G2), hip(70, 236, 172, 70, 14, 56, { c: SLATE.roof, cd: SLATE.roofD }),
    ...tower(262, G2, 32, 190, Object.assign({}, DS, SLATE, { roofH: 76, win: [190, 250], winW: 8, winH: 22 })),
    ...door(146, G2, 20, 72), ...sqwin(96, 214, 12, 15), ...sqwin(196, 214, 12, 15), ...sqwin(96, 266, 12, 15),
  ], frameOf('dwelling_4') || { w: 320, h: 313, anchor: [160, 310] });
  one('dwelling_5', [
    stoneWall(64, 176, 220, G2), hip(64, 220, 182, 66, 14, 50, { c: DS.roof, cd: DS.roofD }),
    ...tower(252, G2, 40, 214, Object.assign({}, DS, { roofH: 84, win: [150, 210, 266], winW: 9, winH: 24, flag: '#c8a030', flagL: 30 })),
    ...door(138, G2, 22, 76), ...sqwin(92, 222, 12, 15), ...sqwin(186, 222, 12, 15),
    { p: box(96, 232, 180, 240), c: '#8e8470', m: 'cloth', line: 1 },
  ], frameOf('dwelling_5') || { w: 320, h: 313, anchor: [160, 310] });
  one('dwelling_6', [
    ...tower(92, G2, 30, 190, Object.assign({}, DS, SLATE, { roofH: 72, win: [180, 240], winW: 8, winH: 22 })),
    ...tower(270, G2, 30, 190, Object.assign({}, DS, SLATE, { roofH: 72, win: [180, 240], winW: 8, winH: 22 })),
    stoneWall(112, 140, 250, G2), merlons(108, 254, 138, 16, 26, DS.light, { k: 0.55 }),
    ...gate(181, G2, 24, 74, { ring: '#8e8470', rw: 8 }),
    ...win(150, 190, 9, 26), ...win(212, 190, 9, 26),
    ...flag(181, 120, 34, '#c8a030', { fw: 26, fh: 14 }),
  ], frameOf('dwelling_6') || { w: 320, h: 313, anchor: [160, 310] });
  one('dwelling_7', [
    stoneWall(72, 226, 160, G2), hip(72, 160, 232, 50, 12, 36, { c: SLATE.roof, cd: SLATE.roofD }),
    ...tower(206, G2, 52, 222, Object.assign({}, DS, SLATE, { top: 'cone', roofH: 96, eave: 10, win: [130, 190, 250], winW: 10, winH: 28, finial: GOLD })),
    { p: box(150, 150, 262, 160), c: DS.shade, m: 'cloth', line: 1 },
    ...door(206, G2, 20, 66), ...sqwin(114, 266, 12, 15),
  ], frameOf('dwelling_7') || { w: 320, h: 313, anchor: [160, 310] });
})(typeof window !== 'undefined' ? window : globalThis);
