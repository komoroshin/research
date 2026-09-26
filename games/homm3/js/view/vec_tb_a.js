/* ============================================================================
   view/vec_tb_a.js — постройки экрана города: Замок, Оплот, Башня.

   Своя архитектура фракции вместо общих bld_* (vec_towns.js): экран города
   берёт 'bld_<id>@<фракция>', если он описан, и не кладёт поверх «черты
   фракции». Рамка — от общей постройки (тот же слот сцены, центр-низ = якорь).

   Замок  — белый камень, синие конические крыши, знамёна, стрельчатая готика;
   Оплот  — светлый тёплый камень, зелёные вогнутые шпили с золотым листом,
            живые деревья, резьба-лоза, вода;
   Башня  — белый мрамор в снегу, золотые луковичные купола, синие вставки,
            обсерватории и шестерни.

   Окна держим тёплыми (#f2d34c) — ночью экран города зажигает их по
   meta.lights: каждый вызов win()/rose()/lit() сам добавляет точку огня.
   Все формы — в дизайн-единицах (10 на клетку старого спрайта; в сцене
   5 единиц на точку, на телефоне ~0.6 пикселя на единицу).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone } = K;

  /* ---------- общие краски ---------- */
  const WIN = '#f2d34c', WIN_LC = '#3a2614', GOLD = '#d8a53a', IRON = '#4a4a52', HOLE = '#1a1410', WOOD = '#7a5230', WOODD = '#5a3a22';

  /* ---------- рамки общих построек (запас, если спрайта нет) ---------- */
  const FR0 = {
    hall_1: [420, 367, 210, 363], hall_2: [460, 440, 230, 437], hall_3: [520, 460, 260, 457], hall_4: [560, 573, 280, 570],
    guild_1: [220, 437, 110, 433], guild_2: [240, 543, 120, 540], guild_3: [260, 647, 130, 643], guild_4: [280, 750, 140, 747],
    tavern: [360, 340, 180, 337], blacksmith: [333, 370, 167, 367], market: [407, 253, 203, 250], silo: [320, 400, 160, 397], special: [280, 280, 140, 277],
    dwell_1: [260, 253, 130, 250], dwell_2: [313, 280, 157, 277], dwell_3: [353, 293, 177, 290], dwell_4: [340, 300, 170, 297],
    dwell_5: [400, 400, 200, 397], dwell_6: [440, 440, 220, 437], dwell_7: [540, 500, 270, 497],
    fort: [980, 333, 490, 330], citadel: [980, 453, 490, 450], castle: [980, 643, 490, 640],
  };
  function frame(id) {
    const f = K.frameOf('bld_' + id); if (f) return f;
    const a = FR0[id]; return a ? { w: a[0], h: a[1], anchor: [a[2], a[3]] } : null;
  }

  /* ---------- огни окон: собираются, пока строится постройка ---------- */
  let LIT = null;
  const lit = (x, y) => { if (LIT) LIT.push([Math.round(x), Math.round(y)]); };
  /** Описать постройку фракции: build(frame, g — земля, cx — центр) → формы. */
  function bld(id, fac, build) {
    const fr = frame(id); if (!fr) return;
    LIT = [];
    const shapes = build(fr, fr.anchor[1], fr.anchor[0]).filter(Boolean);
    let lights = LIT; LIT = null;
    if (lights.length > 16) { const k = lights.length / 16; lights = Array.from({ length: 16 }, (_, i) => lights[Math.floor(i * k)]); }
    V.def('bld_' + id + '@' + fac, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { lights } });
  }

  /* ---------- геометрия ---------- */
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  /** Арка: низ y1, полуширина w, полная высота h; pointed — стрельчатая. */
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 2.2;
    let row = 0;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push({ p: [[x0, y], [x1, y]], w, a });
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  function voussoirs(cx, cy, r, n) {
    const out = [];
    for (let i = 1; i < n; i++) { const a = Math.PI + i / n * Math.PI; out.push({ p: [[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12]], w: 1.8, a: 0.5 }); }
    return out;
  }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- детали архитектуры ---------- */
  /** Стена-коробка: кладка, тёмная правая часть. o: { c, d, rh, bw, ma, shadeK, lines, m } */
  function wallBox(x0, y0, x1, y1, o) {
    o = o || {};
    return { p: box(x0, y0, x1, y1), c: o.c, m: o.m || 'cloth', line: 1.2, belly: 0.15,
      sub: [{ p: box(x1 - (x1 - x0) * (o.shadeK || 0.16), y0 - 2, x1 + 2, y1 + 2), c: o.d, m: 'flat', line: 0 }].concat(o.sub || []),
      lines: o.lines || (o.rh === 0 ? [] : masonry(x0, y0, x1, y1, o.rh || 26, o.bw || 44, o.ma || 0.35, 2.4)) };
  }
  /** Окно-проём с тёплым светом; o: { pointed, round, c, lc, cross, sill, dark } */
  function win(cx, y1, w, h, o) {
    o = o || {};
    const ys = y1 - h + w, lc = o.lc || WIN_LC;
    const lines = o.cross === false ? [] : [{ p: [[cx, y1 - h + 1], [cx, y1]], w: Math.max(1.5, w * 0.26), c: lc, a: 0.9 }, { p: [[cx - w, ys + (y1 - ys) * 0.2], [cx + w, ys + (y1 - ys) * 0.2]], w: Math.max(1.5, w * 0.22), c: lc, a: 0.9 }];
    const out = [{ p: arch(cx, y1, w, h, o.pointed), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: o.line || 1, lc, lines }];
    if (o.sill) out.push({ p: box(cx - w - 3, y1, cx + w + 3, y1 + 5), c: o.sill, m: 'cloth', line: 0.8 });
    if (!o.dark) lit(cx, y1 - h * 0.45);
    return out;
  }
  /** Квадратное окно (со ставнями). */
  function sqwin(cx, cy, w, h, o) {
    o = o || {}; const out = [];
    if (o.shutters) for (const s of [-1, 1]) out.push({ p: box(cx + s * w, cy - h, cx + s * (w + w * 0.75), cy + h), c: o.shutters, m: 'wood', flow: -Math.PI / 2, line: 1 });
    out.push({ p: box(cx - w, cy - h, cx + w, cy + h), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.2, lc: WIN_LC, lines: [{ p: [[cx, cy - h], [cx, cy + h]], w: 3, c: WIN_LC, a: 0.9 }, { p: [[cx - w, cy], [cx + w, cy]], w: 3, c: WIN_LC, a: 0.9 }] });
    if (o.sill) out.push({ p: box(cx - w - 4, cy + h, cx + w + 4, cy + h + 6), c: o.sill, m: 'cloth', line: 1 });
    lit(cx, cy);
    return out;
  }
  /** Бойница — узкая тёмная щель. */
  const slit = (cx, cy, h) => ({ p: box(cx - 3, cy - h / 2, cx + 3, cy + h / 2), c: HOLE, m: 'flat', line: 0.6 });
  /** Круглое окно-роза: спицы и обод. */
  function rose(cx, cy, r, o) {
    o = o || {}; const lines = [];
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; lines.push({ p: [[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], w: Math.max(1.6, r * 0.12), c: o.lc || WIN_LC, a: 0.85 }); }
    lines.push({ p: ell(cx, cy, r * 0.42, r * 0.42, 12).concat([[cx + r * 0.42, cy]]), w: Math.max(1.4, r * 0.1), c: o.lc || WIN_LC, a: 0.85 });
    lit(cx, cy);
    return [{ e: [cx, cy, r + 5, r + 5], c: o.ring || '#cfc6b2', m: 'cloth', line: 1 }, { e: [cx, cy, r, r], c: o.c || WIN, m: 'gem', gloss: 0.6, rim: 0, line: 1, lc: o.lc || WIN_LC, lines }];
  }
  /** Флажок на древке: основание (x, y), высота L. */
  function flag(x, y, L, c, o) {
    o = o || {}; const fw = o.fw || L * 0.62, fh = o.fh || L * 0.34, s = o.left ? -1 : 1, top = y - L;
    return [
      { p: tube([[x, y, o.pw || 4], [x, top - 3, (o.pw || 4) * 0.8]]), c: o.pole || '#4a3a2a', m: 'wood', line: 0.6 },
      { p: [P(x + s * 1.5, top, 1), [x + s * fw * 0.45, top + fh * 0.12], P(x + s * fw, top + fh * 0.42, 1), [x + s * fw * 0.5, top + fh * 0.62], P(x + s * 1.5, top + fh, 1)], c, m: 'cloth', line: 0.8, lines: [{ p: [[x + s * fw * 0.15, top + fh * 0.2], [x + s * fw * 0.6, top + fh * 0.38]], w: 1.4, light: true, a: 0.5 }] },
      { e: [x, top - 4, 3.6, 3.6], c: o.knob || GOLD, m: 'gold', line: 0.5 },
    ];
  }
  /** Висячее знамя: перекладина на y, ширина 2w, длина h, «ласточкин хвост», эмблема. */
  function banner(cx, y, w, h, c, emb) {
    const out = [{ p: [P(cx - w, y, 1), P(cx + w, y, 1), P(cx + w, y + h, 1), P(cx, y + h - w * 0.8, 1), P(cx - w, y + h, 1)], c, m: 'cloth', line: 1,
      lines: [{ p: [[cx - w * 0.5, y + 4], [cx - w * 0.45, y + h - 8]], w: 1.6, light: true, a: 0.45 }, { p: [[cx + w * 0.55, y + 4], [cx + w * 0.5, y + h - 8]], w: 1.6, a: 0.4 }, { p: [[cx - w, y + 6], [cx + w, y + 6]], w: 2.4, c: GOLD, a: 0.9 }] },
      { p: tube([[cx - w - 5, y, 4], [cx + w + 5, y, 4]]), c: GOLD, m: 'gold', line: 0.6 }];
    if (emb === 'cross') out.push({ p: [P(cx - 2.5, y + h * 0.28, 1), P(cx + 2.5, y + h * 0.28, 1), P(cx + 2.5, y + h * 0.42, 1), P(cx + w * 0.45, y + h * 0.42, 1), P(cx + w * 0.45, y + h * 0.5, 1), P(cx + 2.5, y + h * 0.5, 1), P(cx + 2.5, y + h * 0.72, 1), P(cx - 2.5, y + h * 0.72, 1), P(cx - 2.5, y + h * 0.5, 1), P(cx - w * 0.45, y + h * 0.5, 1), P(cx - w * 0.45, y + h * 0.42, 1), P(cx - 2.5, y + h * 0.42, 1)], c: GOLD, m: 'gold', line: 0.5 });
    else if (emb === 'leaf') out.push({ p: [P(cx, y + h * 0.24, 1), [cx + w * 0.5, y + h * 0.42], P(cx, y + h * 0.66, 1), [cx - w * 0.5, y + h * 0.42]], c: GOLD, m: 'gold', line: 0.5, lines: [{ p: [[cx, y + h * 0.28], [cx, y + h * 0.62]], w: 1.4, a: 0.6 }] });
    else if (emb === 'star') out.push({ p: star(cx, y + h * 0.45, w * 0.5, w * 0.22, 5), c: GOLD, m: 'gold', line: 0.5 });
    else if (emb) out.push({ e: [cx, y + h * 0.45, w * 0.4, w * 0.4], c: GOLD, m: 'gold', line: 0.5 });
    return out;
  }
  function star(cx, cy, r0, r1, n) { const out = []; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i / n * Math.PI, r = i % 2 ? r1 : r0; out.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1)); } return out; }
  /** Коническая крыша (как в общем наборе): основание y, полуширина hw, высота h. o: { flare, lean, m, concave } */
  function cone(cx, y, hw, h, c, cd, o) {
    o = o || {}; const f = o.flare === undefined ? 0.06 : o.flare, L = o.lean || 0, cc = o.concave || 0;
    const at = (t, s) => [cx + s * hw * (1 - t) + L * t, y - h * t];
    const rows = [];
    for (const t of [0.2, 0.4, 0.6, 0.8]) { const [xl, yy] = at(t, -1), xr = at(t, 1)[0]; rows.push({ p: [[xl, yy], [(xl + xr) / 2, yy + hw * (1 - t) * 0.16], [xr, yy]], w: 2, a: 0.4 }); }
    rows.push({ p: [[cx - hw * 0.25, y - h * 0.1], [cx - hw * 0.08 + L * 0.8, y - h * 0.8]], w: 2, light: true, a: 0.55 });
    const k = 0.58 - f - cc;
    return [{ p: [P(cx - hw, y, 1), [cx - hw * k + L * 0.42, y - h * 0.42], P(cx + L, y - h, 1), [cx + hw * k + L * 0.42, y - h * 0.42], P(cx + hw, y, 1), [cx, y + hw * 0.14]], c, m: o.m || 'leather', gloss: 0.3,
      sub: [{ p: [P(cx + hw * 0.08 + L, y - h, 1), P(cx + hw * 1.2, y - 2, 1), P(cx + hw * 1.1, y + hw * 0.3, 1), P(cx + hw * 0.2, y + hw * 0.3, 1)], c: cd, m: 'flat', line: 0 }],
      lines: rows }];
  }
  /** Купол-полусфера. */
  function dome(cx, y, hw, h, c, cd, o) {
    o = o || {};
    return [{ p: [P(cx - hw, y, 1), [cx - hw * 0.96, y - h * 0.5], [cx - hw * 0.62, y - h * 0.9], [cx, y - h], [cx + hw * 0.62, y - h * 0.9], [cx + hw * 0.96, y - h * 0.5], P(cx + hw, y, 1), [cx, y + hw * 0.12]], c, m: o.m || 'gold', gloss: o.gloss || 0.9,
      sub: cd ? [{ p: [[cx + hw * 0.25, y - h * 1.1], [cx + hw * 1.1, y - h * 0.6], [cx + hw * 1.1, y + 6], [cx + hw * 0.4, y + 6]], c: cd, m: 'flat', line: 0 }] : [],
      lines: (o.ribs === false ? [] : [-0.5, 0, 0.5].map(k => ({ p: [[cx + hw * k, y], [cx + hw * k * 0.8, y - h * 0.55], [cx + hw * k * 0.3, y - h * 0.95]], w: 1.8, a: 0.35 }))).concat([{ p: [[cx - hw * 0.6, y - h * 0.55], [cx - hw * 0.3, y - h * 0.85]], w: 2.5, light: true, a: 0.6 }]) }];
  }
  /** Луковичный купол с рёбрами и шпилем. */
  function onion(cx, y, hw, h, c, cd, o) {
    o = o || {};
    const out = [{ p: [P(cx - hw * 0.78, y, 1), [cx - hw, y - h * 0.3], [cx - hw * 0.82, y - h * 0.58], [cx - hw * 0.25, y - h * 0.82], P(cx, y - h, 1), [cx + hw * 0.25, y - h * 0.82], [cx + hw * 0.82, y - h * 0.58], [cx + hw, y - h * 0.3], P(cx + hw * 0.78, y, 1)], c, m: o.m || 'gold', gloss: 1,
      sub: cd ? [{ p: [[cx + hw * 0.15, y - h], [cx + hw * 1.1, y - h * 0.4], [cx + hw * 1.1, y + 4], [cx + hw * 0.35, y + 4]], c: cd, m: 'flat', line: 0 }] : [],
      lines: [{ p: [[cx - hw * 0.6, y - h * 0.3], [cx - hw * 0.4, y - h * 0.6]], w: 2.5, light: true, a: 0.7 }, { p: [[cx, y], [cx + hw * 0.1, y - h * 0.5], [cx, y - h * 0.95]], w: 1.6, a: 0.35 }, { p: [[cx - hw * 0.5, y], [cx - hw * 0.62, y - h * 0.4], [cx - hw * 0.15, y - h * 0.85]], w: 1.4, a: 0.3 }, { p: [[cx + hw * 0.5, y], [cx + hw * 0.62, y - h * 0.4], [cx + hw * 0.15, y - h * 0.85]], w: 1.4, a: 0.3 }] }];
    if (o.spike !== false) out.push({ p: tube([[cx, y - h + 4, Math.max(3, hw * 0.12)], [cx, y - h - hw * 0.7, 1.5]]), c: o.spikeC || GOLD, m: 'gold', line: 0.5 }, { e: [cx, y - h - hw * 0.2, Math.max(3, hw * 0.13), Math.max(3, hw * 0.13)], c: o.spikeC || GOLD, m: 'gold', line: 0.5 });
    return out;
  }
  /** Зубцы (парапет). */
  function merlons(x0, x1, y, mh, st, c, o) {
    o = o || {}; const pts = [P(x0, y + (o.ph || 10), 1), P(x0, y - mh, 1)];
    const mw = st * (o.k || 0.56), n = Math.max(1, Math.round((x1 - x0 - mw) / st)), s = (x1 - x0 - mw) / n;
    for (let i = 0; i <= n; i++) { const x = x0 + i * s; if (i) pts.push(P(x, y, 1), P(x, y - mh, 1)); pts.push(P(x + mw, y - mh, 1)); if (i < n) pts.push(P(x + mw, y, 1)); }
    pts.push(P(x1, y - mh, 1), P(x1, y + (o.ph || 10), 1));
    return { p: pts, c, m: o.m || 'cloth', line: 1, lc: o.lc, lines: [{ p: [[x0, y + (o.ph || 10) - 2], [x1, y + (o.ph || 10) - 2]], w: 2, a: 0.5 }] };
  }
  /** Ворота: обрамление, проём, решётка/створки. o: { pointed, grate, door, ring, rw, grateC, hole } */
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
  /** Дверь в арке с обрамлением и фонарём. o: { pointed, ring, c, lamp: [x, y] } */
  function door(cx, base, w, h, o) {
    o = o || {};
    const out = [{ p: arch(cx, base, w + 7, h + 7, o.pointed), c: o.ring || '#b8ae98', m: 'cloth', line: 1, lines: o.pointed ? [] : voussoirs(cx, base - h + w, w + 4, 6) },
      { p: arch(cx, base, w, h, o.pointed), c: o.c || WOODD, m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [{ p: [[cx, base - h], [cx, base]], w: 2.6, a: 0.8 }, { p: [[cx - w, base - h * 0.3], [cx + w, base - h * 0.3]], w: 3.4, c: IRON, a: 0.9 }, { p: [[cx - w, base - h * 0.62], [cx + w, base - h * 0.62]], w: 3.4, c: IRON, a: 0.9 }] }];
    if (o.lamp) { out.push({ e: [o.lamp[0], o.lamp[1], 6, 6], c: WIN, m: 'gem', gloss: 1, line: 1, lc: WIN_LC }); lit(o.lamp[0], o.lamp[1]); }
    return out;
  }
  /** Вальмовая крыша (трапеция). */
  function hip(x0, x1, y, h, e, inset, c, cd, o) {
    o = o || {}; const rows = [];
    for (let k = 1; k < 4; k++) { const yy = y - h * k / 4, dx = inset * k / 4; rows.push({ p: [[x0 - e + dx, yy], [x1 + e - dx, yy]], w: 2.6, a: 0.45 }); }
    for (let x = x0 + 10; x < x1; x += 34) rows.push({ p: [[x, y - h * 0.02], [x + (x - (x0 + x1) / 2) * -0.08, y - h + 4]], w: 1.6, a: 0.25 });
    return { p: [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)], c, m: o.m || 'leather', gloss: 0.25, line: 1.2, lines: rows,
      sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.18, y - h - 2, 1), P(x1 + e + 2, y - h - 2, 1), P(x1 + e + 2, y + 2, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.3, y + 2, 1)], c: cd, m: 'flat', line: 0 }] };
  }
  /** Фронтон (торец двускатной крыши к зрителю): стена-треугольник и два ската-кромки. */
  function gableFront(x0, x1, y, h, wall, wallD, roof, th) {
    const cx = (x0 + x1) / 2; th = th || 12;
    const k = th / h * (x1 - x0) * 0.5;   // свес по скату
    return [{ p: [P(x0 - k * 1.3, y + th * 0.5, 1), P(cx, y - h - th * 1.3, 1), P(x1 + k * 1.3, y + th * 0.5, 1), P(x1 + k * 0.2, y + th * 0.5, 1), P(cx, y - h + th * 0.1, 1), P(x0 - k * 0.2, y + th * 0.5, 1)], c: roof, m: 'leather', gloss: 0.3, line: 1.1,
      lines: [{ p: [[x0 - k * 0.8, y + th * 0.2], [cx, y - h - th * 0.6], [x1 + k * 0.8, y + th * 0.2]], w: 1.6, a: 0.4 }] },
      { p: [P(x0, y, 1), P(cx, y - h, 1), P(x1, y, 1)], c: wall, m: 'cloth', line: 1.1, sub: [{ p: [P(cx + 4, y - h - 4, 1), P(x1 + 4, y + 4, 1), P(cx + (x1 - cx) * 0.55, y + 4, 1)], c: wallD, m: 'flat', line: 0 }] }];
  }
  /**
   * Эльфийский шпиль Оплота: вогнутые скаты, свес с загнутыми вверх кончиками, ряды «листовой» черепицы,
   * золотой лист на макушке. Основание y, полуширина hw, высота h.
   */
  function elfRoof(cx, y, hw, h, c, cd, o) {
    o = o || {}; const rows = [];
    for (const t of [0.14, 0.3, 0.48, 0.66]) { const w = hw * Math.pow(1 - t, 1.6) * 0.98, yy = y - h * t; for (let x = -w + w / 3; x < w; x += w / 1.5) rows.push({ p: [[cx + x - w / 3, yy], [cx + x, yy + 7 * (1 - t)], [cx + x + w / 3, yy]], w: 1.8, a: 0.45 }); }
    rows.push({ p: [[cx - hw * 0.5, y - h * 0.06], [cx - hw * 0.2, y - h * 0.4], [cx - hw * 0.04, y - h * 0.8]], w: 2.2, light: true, a: 0.5 });
    const out = [{ p: [P(cx - hw * 1.06, y - h * 0.07, 1), [cx - hw * 0.62, y - h * 0.1], [cx - hw * 0.3, y - h * 0.34], [cx - hw * 0.1, y - h * 0.66], P(cx, y - h, 1), [cx + hw * 0.1, y - h * 0.66], [cx + hw * 0.3, y - h * 0.34], [cx + hw * 0.62, y - h * 0.1], P(cx + hw * 1.06, y - h * 0.07, 1), [cx + hw * 0.8, y + 3], [cx, y + hw * 0.1], [cx - hw * 0.8, y + 3]], c, m: o.m || 'leather', gloss: 0.35,
      sub: [{ p: [P(cx + 2, y - h - 4, 1), [cx + hw * 0.4, y - h * 0.3], P(cx + hw * 1.2, y - h * 0.1, 1), P(cx + hw * 1.2, y + hw * 0.2, 1), P(cx + hw * 0.2, y + hw * 0.2, 1)], c: cd, m: 'flat', line: 0 }], lines: rows }];
    if (o.finial !== false) { const lf = K.leaf([cx, y - h + 2], -Math.PI / 2, Math.max(14, hw * 0.35), Math.max(7, hw * 0.16)); out.push({ p: tube([[cx, y - h + 6, 3], [cx, y - h - 6, 2]]), c: GOLD, m: 'gold', line: 0.5 }, { p: lf.body, c: o.finialC || '#e8c048', m: 'gold', gloss: 1, line: 0.6, lines: [{ p: lf.shaft, w: 1.2, a: 0.5 }] }); }
    out.apex = [cx, y - h - Math.max(14, hw * 0.35)];
    return out;
  }
  /** Лоза: изгибистый стебель (штрих) с листьями-каплями. */
  function vine(pts, seed, n, c) {
    const rnd = rngOf(seed), out = [{ p: tube(pts.map(p => [p[0], p[1], 3])), c: '#3a6a2a', m: 'wood', line: 0.4 }];
    for (let i = 0; i < (n || 5); i++) { const t = (i + 0.5) / (n || 5), k = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1))), f = t * (pts.length - 1) - k, a = pts[k], b = pts[k + 1];
      const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, s = i % 2 ? 1 : -1; const lf = K.leaf([x, y], (s > 0 ? 0 : Math.PI) + (rnd() - 0.5), 12, 7); out.push({ p: lf.body, c: c || (i % 2 ? '#5aa840' : '#3f8a30'), m: 'leather', line: 0.5 }); }
    return out;
  }
  /**
   * Башня: тело, кладка, тень справа, окна, верх ('cone' | 'dome' | 'onion' | 'crenel' | 'none').
   * o: { wall, shade, roof, roofD, roofH, eave, win: [y…], winW, winH, pointed, finial, flag, flagL, taper, mason, concave, onionC }
   */
  function tower(cx, base, hw, h, o) {
    const top = base - h, tw = hw * (1 - (o.taper || 0.04)), out = [];
    const sub = [{ p: [P(cx + tw * 0.42, top - 2, 1), P(cx + hw + 4, top - 2, 1), P(cx + hw + 4, base + 2, 1), P(cx + hw * 0.42, base + 2, 1)], c: o.shade, m: 'flat', line: 0 }];
    out.push({ p: trap(cx, top, base, tw, hw), c: o.wall, m: o.m || 'cloth', line: 1.1, sub, lines: o.mason === false ? [] : masonry(cx - hw, top, cx + hw, base, o.rh || 24, o.bw || hw * 0.9, o.ma || 0.35, o.mw || 2.2) });
    for (const y of o.win || []) out.push(...win(cx, y, o.winW || Math.max(6, hw * 0.24), o.winH || Math.max(16, hw * 0.62), { pointed: o.pointed, c: o.winC, dark: o.dark }));
    const t = o.top || 'cone', eave = o.eave === undefined ? 6 : o.eave;
    let apex;
    if (t === 'cone') { const rh = o.roofH || hw * 2.3; out.push(...cone(cx, top + 2, tw + eave, rh, o.roof, o.roofD, { flare: o.flare, concave: o.concave })); apex = top + 2 - rh; }
    else if (t === 'dome') { const rh = o.roofH || tw * 0.95; out.push({ p: box(cx - tw - 4, top - 8, cx + tw + 4, top + 4), c: o.ring || o.wall, m: 'cloth', line: 1 }); if (o.snow) out.push(snow(cx - tw - 4, cx + tw + 4, top - 7, 7)); out.push(...dome(cx, top - 6, tw + 2, rh, o.roof, o.roofD)); apex = top - 6 - rh; }
    else if (t === 'onion') { const rh = o.roofH || tw * 2; out.push({ p: box(cx - tw - 3, top - 6, cx + tw + 3, top + 4), c: o.ring || o.wall, m: 'cloth', line: 1 }); if (o.snow) out.push(snow(cx - tw - 3, cx + tw + 3, top - 5, 7)); out.push(...onion(cx, top - 4, tw + 4, rh, o.roof, o.roofD, { spike: o.finial !== false })); apex = top - 4 - rh - (o.finial !== false ? tw * 0.7 : 0); }
    else if (t === 'elf') { const rh = o.roofH || hw * 2.4, r = elfRoof(cx, top + 2, tw + eave, rh, o.roof, o.roofD, { finial: o.finial !== false }); out.push(...r); apex = r.apex[1]; }
    else if (t === 'crenel') { out.push(merlons(cx - tw - 6, cx + tw + 6, top - 2, 14, (tw * 2 + 12) / 3.6, o.wall, { ph: 12 })); if (o.snow) out.push(snow(cx - tw - 6, cx + tw + 6, top - 16, 6)); apex = top - 16; }
    else apex = top;
    if (o.finial && t === 'cone') out.push({ p: tube([[cx, apex + 4, 4], [cx, apex - 14, 2.5]]), c: o.finial, m: 'gold', line: 0.6 }, { e: [cx, apex - 16, 4.5, 4.5], c: o.finial, m: 'gold', line: 0.6 });
    if (o.flag) out.push(...flag(cx, apex + (t === 'elf' ? 10 : 2), o.flagL || 46, o.flag, { left: o.flagLeft }));
    out.apex = [cx, apex];
    return out;
  }
  /** Ступени: n ступеней от ширины w0 (низ) к w1 (верх) высотой sh каждая. */
  function steps(cx, G, w0, w1, n, sh, c) {
    const out = [];
    for (let i = 0; i < n; i++) { const w = w0 + (w1 - w0) * i / Math.max(1, n - 1), y = G - i * sh; out.push({ p: box(cx - w, y - sh, cx + w, y), c: tone(c, -0.05 * i), m: 'cloth', line: 1 }); }
    return out;
  }
  /** Колонна с капителью. */
  function column(x, y0, y1, w, c, cd) {
    return [{ p: box(x - w, y0 + 6, x + w, y1 - 6), c, m: 'cloth', line: 1, lines: [{ p: [[x - w * 0.35, y0 + 8], [x - w * 0.35, y1 - 8]], w: 1.8, a: 0.4 }, { p: [[x + w * 0.35, y0 + 8], [x + w * 0.35, y1 - 8]], w: 1.8, a: 0.4 }], sub: [{ p: box(x + w * 0.4, y0, x + w + 2, y1), c: cd, m: 'flat', line: 0 }] },
      { p: box(x - w - 4, y0, x + w + 4, y0 + 7), c, m: 'cloth', line: 1 }, { p: box(x - w - 4, y1 - 7, x + w + 4, y1), c, m: 'cloth', line: 1 }];
  }

  /* ---------- природа ---------- */
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
  const trunk = (x, y0, y1, w, c, bend) => [
    { p: [[x - w * 1.7, y0], [x - w * 0.9, y0 - 8], [x, y0 - 5], [x + w * 0.9, y0 - 8], [x + w * 1.8, y0], [x, y0 + 3]], c: tone(c, -0.1), m: 'wood', flow: -Math.PI / 2 },
    { p: tube([[x, y0 + 2, w * 1.5], [x, y0 - 20, w * 1.05], [x + (bend || 0) * 0.5, (y0 + y1) / 2, w * 0.92], [x + (bend || 0), y1, w * 0.75]], { flat1: true }), c, m: 'wood', flow: -Math.PI / 2, lines: [{ p: [[x - w * 0.2, y0 - 6], [x - w * 0.1, y1 + 10]], w: 1.4, a: 0.4 }] }];
  /** Дерево целиком: ствол и крона. */
  function tree(x, G, h, r, cols, seed, o) {
    o = o || {};
    return [...trunk(x, G, G - h + r * 1.2, o.tw || r * 0.16, o.bark || '#6a4a2a', o.bend || 0), ...foliage(x + (o.bend || 0), G - h + r * 0.95, r * 1.1, r, o.n || 5, cols, seed)];
  }
  /** Скала: неровный многоугольник с гранями. */
  function rock(pts, c, o) { o = o || {}; return { p: pts, c, m: 'horn', gloss: 0.15, line: 1, belly: 0.3, lines: o.lines || [], sub: o.sub || [] }; }
  /** Облако из клубов. */
  function cloud(cx, cy, w, h, seed, c) {
    const rnd = rngOf(seed), out = [];
    const n = Math.max(3, Math.round(w / h * 1.6));
    for (let i = 0; i < n; i++) { const t = n > 1 ? i / (n - 1) : 0.5, x = cx - w / 2 + w * t, r = h * (0.55 + 0.45 * Math.sin(t * Math.PI)) * (0.8 + rnd() * 0.3); out.push({ e: [x, cy - r * 0.5, r * 1.1, r], c: c || '#f4f8ff', m: 'cloth', line: 0.7, lc: '#8aa0c0', belly: 0.5 }); }
    out.push({ p: [P(cx - w / 2 - h * 0.4, cy, 1), P(cx + w / 2 + h * 0.4, cy, 1), [cx + w / 2, cy + h * 0.35], [cx - w / 2, cy + h * 0.35]], c: tone(c || '#f4f8ff', -0.12), m: 'cloth', line: 0.7, lc: '#8aa0c0' });
    return out;
  }
  /** Кристалл-призма. */
  function crystal(x, y, w, h, c, lean) {
    const l = (lean || 0) * h;
    return { p: [P(x - w, y, 1), P(x - w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y, 1)], c, m: 'gem', gloss: 1.1, rim: 0.7, line: 0.8,
      sub: [{ p: [P(x + l * 0.5, y + 2, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y + 2, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.3, y - 4], [x - w * 0.3 + l * 0.8, y - h * 0.8]], w: 2, light: true, a: 0.7 }] };
  }
  /** Шестерня. */
  function gear(cx, cy, r, n, c) {
    const pts = [];
    for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, d = Math.PI / n; for (const [a, rr] of [[a0 - d * 0.5, r], [a0 - d * 0.32, r * 1.18], [a0 + d * 0.32, r * 1.18], [a0 + d * 0.5, r]]) pts.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1)); }
    const lines = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; lines.push({ p: [[cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3], [cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78]], w: r * 0.13, c: tone(c, -0.55), a: 0.9 }); }
    return [{ p: pts, c, m: 'gold', gloss: 0.9, line: 1, lines: [{ p: ell(cx, cy, r * 0.82, r * 0.82, 16).concat([[cx + r * 0.82, cy]]), w: 2.4, a: 0.6 }].concat(lines) },
      { e: [cx, cy, r * 0.28, r * 0.28], c: tone(c, 0.15), m: 'gold', line: 0.8, glint: [[cx - r * 0.1, cy - r * 0.1, r * 0.12]] }];
  }
  /** Бочка. */
  const barrel = (x, G, w, h, c) => ({ p: [P(x - w, G, 1), [x - w * 1.12, G - h * 0.5], P(x - w, G - h, 1), P(x + w, G - h, 1), [x + w * 1.12, G - h * 0.5], P(x + w, G, 1)], c: c || '#8a5a30', m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[x - w * 1.05, G - h * 0.22], [x + w * 1.05, G - h * 0.22]], w: 3.4, c: IRON, a: 0.9 }, { p: [[x - w * 1.05, G - h * 0.78], [x + w * 1.05, G - h * 0.78]], w: 3.4, c: IRON, a: 0.9 }] });
  /** Мешок. */
  const sack = (x, G, w, h, c) => ({ p: [[x - w, G], [x - w * 1.1, G - h * 0.5], [x - w * 0.5, G - h * 0.92], [x, G - h], [x + w * 0.5, G - h * 0.92], [x + w * 1.1, G - h * 0.5], [x + w, G]], c: c || '#d8c090', m: 'cloth', line: 1, lines: [{ p: [[x - w * 0.5, G - h * 0.8], [x + w * 0.5, G - h * 0.8]], w: 2.6, c: '#8a6a3a', a: 0.8 }] });
  /** Щит-«треугольник» с гербом. */
  function heater(cx, cy, w, c, c2) {
    const h = w * 1.25;
    return [{ p: [P(cx - w, cy - h * 0.5, 1), P(cx + w, cy - h * 0.5, 1), [cx + w * 0.95, cy + h * 0.1], P(cx, cy + h * 0.6, 1), [cx - w * 0.95, cy + h * 0.1]], c, m: 'steel', gloss: 0.5, line: 1, lc: '#2a2a30',
      sub: c2 ? [{ p: [P(cx - w * 0.2, cy - h * 0.55, 1), P(cx + w * 0.2, cy - h * 0.55, 1), P(cx + w * 0.2, cy + h * 0.7, 1), P(cx - w * 0.2, cy + h * 0.7, 1)], c: c2, m: 'flat', line: 0 }] : [] }];
  }
  /** Наковальня. */
  const anvil = (x, G, s) => ({ p: [P(x - 26 * s, G - 40 * s, 1), P(x + 26 * s, G - 40 * s, 1), [x + 38 * s, G - 34 * s], P(x + 20 * s, G - 26 * s, 1), P(x + 14 * s, G - 12 * s, 1), P(x + 24 * s, G, 1), P(x - 20 * s, G, 1), P(x - 10 * s, G - 12 * s, 1), P(x - 16 * s, G - 26 * s, 1)], c: '#4a4a52', m: 'steel', line: 1 });
  /** Огонь горна. */
  function flame(x, y, w, h) {
    return { p: [P(x - w, y, 1), [x - w * 0.9, y - h * 0.35], [x - w * 0.35, y - h * 0.62], P(x - w * 0.1, y - h, 1), [x + w * 0.3, y - h * 0.62], P(x + w * 0.5, y - h * 0.78, 1), [x + w * 0.9, y - h * 0.35], P(x + w, y, 1)], c: '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.6, lc: '#8a2a0a',
      sub: [{ p: [P(x - w * 0.5, y + 2, 1), [x - w * 0.4, y - h * 0.3], P(x - w * 0.05, y - h * 0.62, 1), [x + w * 0.35, y - h * 0.3], P(x + w * 0.5, y + 2, 1)], c: '#ffe08a', m: 'flat', line: 0 }] };
  }
  /** Горн: тёмная арка, угли, пламя. */
  function forge(cx, G, w, h, pointed) {
    lit(cx, G - h * 0.3);
    return [{ p: arch(cx, G, w, h, pointed), c: '#2a1a12', m: 'cloth', ao: 1.2, line: 1.2 }, { p: ell(cx, G - 18, w * 0.8, 16, 12), c: '#ff7a24', m: 'gem', gloss: 1, line: 0, sub: [{ p: ell(cx - 3, G - 18, w * 0.45, 9, 10), c: '#ffe08a', m: 'flat', line: 0 }] }, flame(cx, G - 24, w * 0.5, h * 0.42)];
  }
  /** Штабель брёвен торцами к зрителю. */
  function logs(x0, G, n, r, c) {
    const out = [];
    for (let row = 0; row < n; row++) for (let i = 0; i < n - row; i++) {
      const x = x0 + r + i * r * 2 + row * r, y = G - r - row * r * 1.7;
      out.push({ e: [x, y, r, r], c: c || '#c89a60', m: 'wood', line: 1, lc: '#4a3018', lines: [{ p: ell(x, y, r * 0.55, r * 0.55, 10).concat([[x + r * 0.55, y]]), w: 1.6, a: 0.5 }] });
    }
    return out;
  }
  /** Тележка с рудой. */
  function oreCart(x, G, s, ore) {
    return [{ p: [P(x - 34 * s, G - 44 * s, 1), P(x + 34 * s, G - 44 * s, 1), P(x + 28 * s, G - 12 * s, 1), P(x - 28 * s, G - 12 * s, 1)], c: '#6a4a2a', m: 'wood', flow: 0, line: 1, lines: [{ p: [[x - 32 * s, G - 30 * s], [x + 32 * s, G - 30 * s]], w: 3, c: IRON, a: 0.9 }] },
      ...[-20, 0, 18].map((dx, i) => ({ e: [x + dx * s, G - 48 * s - (i === 1 ? 6 : 0) * s, 14 * s, 10 * s], c: ore || '#7a7a84', m: 'horn', gloss: 0.3, line: 0.8 })),
      { e: [x - 18 * s, G - 10 * s, 10 * s, 10 * s], c: '#3a3a40', m: 'steel', line: 1 }, { e: [x + 18 * s, G - 10 * s, 10 * s, 10 * s], c: '#3a3a40', m: 'steel', line: 1 }];
  }
  /** Вода: гладь со бликами (эллипс). */
  function pool(cx, cy, rx, ry, c, o) {
    o = o || {}; const lines = [];
    for (let i = 0; i < 5; i++) { const x = cx - rx * 0.6 + (i * 37) % (rx * 1.2), y = cy - ry * 0.4 + (i * 13) % (ry * 0.9); lines.push({ p: [[x, y], [x + rx * 0.22, y]], w: 2.4, light: true, a: 0.75 }); }
    return { e: [cx, cy, rx, ry], c, m: 'gem', gloss: 1, rim: 0.5, line: 1, lc: o.lc || '#1a4a6a', lines };
  }
  /** Водопад: струя от (x, y0) до y1 шириной w. */
  function fall(x, y0, y1, w, c) {
    const lines = []; for (let i = 0; i < 4; i++) { const xx = x - w * 0.6 + i * w * 0.4; lines.push({ p: [[xx, y0 + 6], [xx + 1, y1 - 4]], w: 2.4, light: true, a: 0.7 }); }
    return { p: [P(x - w, y0, 1), P(x + w, y0, 1), [x + w * 1.1, (y0 + y1) / 2], P(x + w * 1.25, y1, 1), P(x - w * 1.25, y1, 1), [x - w * 1.1, (y0 + y1) / 2]], c: c || '#8ac8f0', m: 'gem', gloss: 0.8, op: 0.9, line: 0.6, lc: '#3a7aa8', lines };
  }
  /** Сугроб/снежная шапка по линии: волнистый низ. */
  function snow(x0, x1, y, th, o) {
    o = o || {}; const pts = [P(x0 - 3, y + 2, 1), [x0 + 2, y - th * 0.8], [(x0 + x1) / 2, y - th], [x1 - 2, y - th * 0.8], P(x1 + 3, y + 2, 1)];
    const n = Math.max(2, Math.round((x1 - x0) / 24));
    for (let i = n; i >= 0; i--) { const x = x0 + (x1 - x0) * i / n; pts.push([x, y + (i % 2 ? th * 0.7 : th * 0.2)]); }
    return { p: pts, c: o.c || '#fbfdff', m: 'cloth', line: 0.7, lc: '#90a8c4', belly: 0.4 };
  }
  /** Снежные шапки на зубцах (раскладка как в merlons). */
  function merlonSnow(x0, x1, y, mh, st, k) {
    const mw = st * (k || 0.56), n = Math.max(1, Math.round((x1 - x0 - mw) / st)), sp = (x1 - x0 - mw) / n, out = [];
    for (let i = 0; i <= n; i++) { const x = x0 + i * sp; out.push({ p: [P(x - 2, y - mh + 1, 1), [x + mw * 0.2, y - mh - 5], [x + mw * 0.7, y - mh - 6], P(x + mw + 2, y - mh + 1, 1), [x + mw * 0.6, y - mh + 4]], c: '#fbfdff', m: 'cloth', line: 0.6, lc: '#90a8c4' }); }
    return out;
  }
  /** Снежная шапка на конусе/куполе: треугольный чепец. */
  const snowTip = (cx, apexY, hw, h) => ({ p: [P(cx, apexY, 1), [cx + hw * 0.6, apexY + h * 0.7], P(cx + hw, apexY + h, 1), [cx + hw * 0.4, apexY + h * 0.85], [cx, apexY + h * 1.05], [cx - hw * 0.45, apexY + h * 0.8], P(cx - hw, apexY + h, 1), [cx - hw * 0.6, apexY + h * 0.7]], c: '#fbfdff', m: 'cloth', line: 0.7, lc: '#90a8c4' });

  /* =====================================================================================
     ЗАМОК — белый камень, синие конусы и вальмы, знамёна, стрельчатая готика
     ===================================================================================== */
  const CA = { w: '#e6dfd1', d: '#a69c88', r: '#2f63c8', rd: '#1c3a86', ring: '#c8bea8', ban: '#2450b8', red: '#b02a2a', wood: '#6a4428' };
  const cT = o => Object.assign({ wall: CA.w, shade: CA.d, roof: CA.r, roofD: CA.rd, finial: GOLD, rh: 24, ma: 0.35, pointed: true }, o);
  const cW = (x0, y0, x1, y1, o) => wallBox(x0, y0, x1, y1, Object.assign({ c: CA.w, d: CA.d }, o));
  const cHip = (x0, x1, y, h, e, inset) => hip(x0, x1, y, h, e, inset, CA.r, CA.rd);
  const cGable = (x0, x1, y, h, th) => gableFront(x0, x1, y, h, CA.w, CA.d, CA.r, th);
  const cCornice = (x0, x1, y) => ({ p: box(x0, y - 5, x1, y + 5), c: CA.ring, m: 'cloth', line: 1 });
  const cDoor = (cx, g, w, h, lamp) => door(cx, g, w, h, { pointed: true, ring: CA.ring, lamp });
  const lancet = (cx, y1, w, h) => win(cx, y1, w, h, { pointed: true, sill: CA.ring });

  /* ---------- ратуша ---------- */
  bld('hall_1', 'castle', (f, g) => [
    ...tower(340, g, 30, 250, cT({ roofH: 100, win: [190], winW: 7, winH: 24, flag: CA.ban, flagL: 42 })),
    cW(70, 200, 318, g), cHip(70, 318, 206, 96, 12, 56),
    ...cGable(138, 252, 210, 96, 12), ...rose(195, 172, 15),
    cCornice(66, 322, 204),
    ...lancet(104, 318, 12, 44), ...lancet(286, 318, 12, 44),
    ...banner(148, 226, 13, 50, CA.ban, 'cross'), ...banner(242, 226, 13, 50, CA.ban, 'cross'),
    ...steps(195, g, 40, 34, 2, 5, CA.ring), ...cDoor(195, g - 10, 24, 80),
  ]);
  bld('hall_2', 'castle', (f, g) => [
    ...tower(230, 250, 30, 110, cT({ roofH: 118, win: [], mason: false, flag: CA.red, flagL: 40 })),
    cW(80, 236, 380, g), cHip(80, 380, 242, 92, 12, 72), cCornice(76, 384, 240),
    ...cGable(166, 294, 246, 100, 12), ...rose(230, 206, 18),
    ...tower(66, g, 36, 300, cT({ roofH: 106, win: [220, 318], winW: 8, winH: 24, flag: CA.ban, flagLeft: true })),
    ...tower(394, g, 36, 300, cT({ roofH: 106, win: [220, 318], winW: 8, winH: 24, flag: CA.ban })),
    ...lancet(132, 330, 12, 44), ...lancet(328, 330, 12, 44), ...lancet(132, 412, 12, 40), ...lancet(328, 412, 12, 40),
    ...banner(180, 262, 14, 56, CA.ban, 'cross'), ...banner(280, 262, 14, 56, CA.ban, 'cross'),
    ...steps(230, g, 44, 38, 2, 5, CA.ring), ...cDoor(230, g - 10, 28, 100),
  ]);
  bld('hall_3', 'castle', (f, g) => [
    cW(46, 270, 206, g), cHip(46, 206, 276, 84, 10, 50), cW(314, 270, 474, g), cHip(314, 474, 276, 84, 10, 50),
    cW(198, 150, 322, g, { rh: 28 }), cCornice(194, 326, 152), ...cone(260, 150, 76, 132, CA.r, CA.rd),
    { p: tube([[260, 22, 5], [260, 0, 3]]), c: GOLD, m: 'gold', line: 0.6 }, ...flag(260, 16, 44, CA.red),
    // часы-«солнце» на башне
    { e: [260, 200, 24, 24], c: GOLD, m: 'gold', gloss: 0.9, line: 1.2, lc: '#5a3a10', lines: [{ p: [[260, 200], [260, 184]], w: 3.4, c: '#3a2a10', a: 0.9 }, { p: [[260, 200], [271, 206]], w: 3.4, c: '#3a2a10', a: 0.9 }] },
    ...lancet(236, 290, 10, 44), ...lancet(284, 290, 10, 44),
    ...tower(40, g, 24, 280, cT({ roofH: 84, win: [], mason: false, flag: CA.ban, flagLeft: true })),
    ...tower(480, g, 24, 280, cT({ roofH: 84, win: [], mason: false, flag: CA.ban })),
    ...lancet(96, 350, 11, 40), ...lancet(156, 350, 11, 40), ...lancet(364, 350, 11, 40), ...lancet(424, 350, 11, 40),
    ...lancet(96, 430, 11, 40), ...lancet(424, 430, 11, 40),
    ...banner(126, 380, 14, 60, CA.ban, 'cross'), ...banner(394, 380, 14, 60, CA.ban, 'cross'),
    ...steps(260, g, 48, 40, 2, 6, CA.ring), ...cDoor(260, g - 12, 32, 112),
  ]);
  bld('hall_4', 'castle', (f, g) => {
    const out = [];
    // дальний донжон со шпилем и два пинакля
    out.push(cW(186, 236, 374, 340, { rh: 26 }), ...cone(280, 238, 108, 186, CA.r, CA.rd, { flare: 0.1 }));
    out.push({ p: tube([[280, 54, 6], [280, 28, 4]]), c: GOLD, m: 'gold', line: 0.6 }, ...flag(280, 30, 50, CA.red));
    for (const x of [196, 364]) out.push(...tower(x, 250, 18, 60, cT({ roofH: 74, win: [], mason: false, finial: GOLD })));
    // большие круглые башни по краям
    out.push(...tower(70, g, 46, 440, cT({ roofH: 124, win: [240, 340, 440], winW: 9, winH: 28, flag: CA.ban, flagLeft: true })));
    out.push(...tower(490, g, 46, 440, cT({ roofH: 124, win: [240, 340, 440], winW: 9, winH: 28, flag: CA.ban })));
    // корпус с зубцами
    out.push(cW(110, 336, 450, g), merlons(106, 454, 332, 16, 26, CA.w, { k: 0.52 }));
    // фасад-портал с фронтоном и розой
    out.push(cW(196, 300, 364, g, { rh: 28 }), ...cGable(190, 370, 304, 88, 13), ...rose(280, 346, 26));
    for (const x of [196, 364]) out.push({ p: box(x - 7, 292, x + 7, g - 18), c: CA.ring, m: 'cloth', line: 1 }, { p: [P(x - 9, 294, 1), P(x, 262, 1), P(x + 9, 294, 1)], c: CA.r, m: 'leather', line: 0.8 });
    out.push(...lancet(150, 430, 12, 44), ...lancet(410, 430, 12, 44), ...lancet(150, 520, 12, 44), ...lancet(410, 520, 12, 44), ...lancet(232, 430, 10, 40), ...lancet(328, 430, 10, 40));
    out.push(...banner(232, 470, 15, 70, CA.ban, 'cross'), ...banner(328, 470, 15, 70, CA.ban, 'cross'));
    out.push(...steps(280, g, 70, 54, 3, 6, CA.ring), ...cDoor(280, g - 18, 36, 124));
    return out;
  });

  /* ---------- гильдия магов: готическая башня с контрфорсами и витражами ---------- */
  function castleGuild(L) {
    bld('guild_' + L, 'castle', (f, g, cx) => {
      const top = 170, floors = L + 1, fh = (g - 30 - top) / floors, hw0 = 62, hw1 = 46, out = [];
      const glass = ['#7ab8ff', '#c070e0', '#ff9a6a', '#7ae0b0'];
      if (L >= 4) for (const s of [-1, 1]) out.push(...tower(cx + s * 76, g - 28, 22, g - 28 - top - 120, cT({ roofH: 80, win: [top + 220], winW: 6, winH: 20, mason: false })));
      out.push({ p: box(cx - hw0 - 16, g - 30, cx + hw0 + 16, g), c: CA.d, m: 'cloth', line: 1.2, lines: masonry(cx - hw0 - 16, g - 30, cx + hw0 + 16, g, 15, 30, 0.4, 2.2) });
      out.push({ p: [P(cx - hw1, top, 1), P(cx + hw1, top, 1), P(cx + hw0, g - 30, 1), P(cx - hw0, g - 30, 1)], c: CA.w, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 30, 26, 40, 0.35, 2.2),
        sub: [{ p: [P(cx + hw1 * 0.45, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.45, g, 1)], c: CA.d, m: 'flat', line: 0 }] });
      // контрфорсы с пинаклями
      for (const s of [-1, 1]) {
        const xb = cx + s * (hw0 + 6), xt = cx + s * (hw1 + 4), yt = top + 40;
        out.push({ p: [P(xt - 7, yt, 1), P(xt + 7, yt, 1), P(xb + 10, g - 30, 1), P(xb - 10, g - 30, 1)], c: s > 0 ? CA.d : CA.w, m: 'cloth', line: 1 });
        out.push({ p: [P(xt - 8, yt + 2, 1), P(xt, yt - 30, 1), P(xt + 8, yt + 2, 1)], c: CA.r, m: 'leather', line: 0.8 });
      }
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh, hw = hw1 + (hw0 - hw1) * (y - top) / (g - top); out.push({ p: box(cx - hw - 6, y - 5, cx + hw + 6, y + 5), c: CA.ring, m: 'cloth', line: 1 }); }
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh - 12; out.push(...win(cx, y, 14, Math.min(64, fh * 0.62), { pointed: true, c: glass[i % 4], lc: '#1a2a4a' })); }
      out.push(...door(cx, g - 30, 26, Math.min(96, fh * 0.8), { pointed: true, ring: CA.ring }));
      if (L >= 3) out.push({ p: box(cx - hw1 - 14, top + 60, cx + hw1 + 14, top + 70), c: GOLD, m: 'gold', line: 1, lines: [0, 1, 2, 3, 4, 5, 6].map(k => ({ p: [[cx - hw1 - 10 + k * (hw1 * 2 + 20) / 6, top + 60], [cx - hw1 - 10 + k * (hw1 * 2 + 20) / 6, top + 42]], w: 2.4, c: '#8a6a20', a: 0.9 })) });
      // шпиль: высокий синий конус, золотые обручи, звезда
      out.push({ p: box(cx - hw1 - 8, top - 8, cx + hw1 + 8, top + 6), c: GOLD, m: 'gold', line: 1 });
      const rh = 110 + L * 12;
      out.push(...cone(cx, top - 6, hw1 + 14, rh, CA.r, CA.rd, { flare: 0.16 }));
      if (L >= 2) out.push({ p: [P(cx - (hw1 + 14) * 0.52, top - 6 - rh * 0.48, 1), P(cx + (hw1 + 14) * 0.52, top - 6 - rh * 0.48, 1), P(cx + (hw1 + 14) * 0.48, top - rh * 0.48, 1), P(cx - (hw1 + 14) * 0.48, top - rh * 0.48, 1)], c: GOLD, m: 'gold', line: 0.6 });
      out.push({ p: tube([[cx, top - rh, 6], [cx, top - rh - 24, 4]]), c: GOLD, m: 'gold', line: 0.6 });
      out.push({ p: star(cx, top - rh - 38, 16 + L * 2, 7, L >= 3 ? 8 : 5), c: '#f0e070', m: 'gem', gloss: 1.2, line: 0.8, lc: '#8a6a10' });
      return out;
    });
  }
  for (let i = 1; i <= 4; i++) castleGuild(i);

  /* ---------- таверна: каменный дом с фронтоном, балкон, вывеска-кружка ---------- */
  bld('tavern', 'castle', (f, g) => {
    const out = [];
    out.push({ p: box(268, 70, 298, 200), c: CA.d, m: 'cloth', line: 1.2, lines: masonry(268, 70, 298, 200, 16, 16, 0.45, 2) }, { p: box(262, 62, 304, 74), c: CA.ring, m: 'cloth', line: 1 });
    out.push(cW(236, 214, 336, g), hip(236, 336, 220, 50, 10, 30, CA.r, CA.rd));
    out.push(cW(40, 190, 250, g));
    out.push(...cGable(34, 256, 194, 124, 16));
    out.push(...rose(145, 140, 16));
    out.push(...lancet(96, 238, 12, 36), ...lancet(194, 238, 12, 36));
    // балкон
    out.push({ p: box(64, 244, 226, 254), c: CA.wood, m: 'wood', flow: 0, line: 1 }, { p: box(64, 222, 226, 246), c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => ({ p: [[68 + k * 19.5, 224], [68 + k * 19.5, 246]], w: 3, c: CA.wood, a: 1 })).concat([{ p: [[64, 224], [226, 224]], w: 4, c: CA.wood, a: 1 }]) });
    out.push(...sqwin(84, 296, 14, 18, { shutters: CA.r, sill: CA.ring }), ...sqwin(206, 296, 14, 18, { shutters: CA.r, sill: CA.ring }), ...sqwin(286, 270, 12, 14, { sill: CA.ring }));
    out.push(...door(145, g, 22, 72, { ring: CA.ring, lamp: [178, 282] }));
    // вывеска
    out.push({ p: tube([[250, 236, 5], [310, 236, 5]]), c: IRON, m: 'steel', line: 0.8 }, { p: box(278, 244, 318, 292), c: CA.ban, m: 'cloth', line: 1.2,
      sub: [{ p: [P(288, 256, 1), P(304, 256, 1), P(304, 282, 1), P(288, 282, 1)], c: GOLD, m: 'gold', line: 0.8 }, { e: [308, 268, 5, 8], c: CA.ban, m: 'flat', line: 0 }, { e: [296, 254, 9, 4], c: '#fff8e0', m: 'flat', line: 0 }] });
    out.push({ p: tube([[284, 236, 2], [284, 246, 2]]), c: IRON, m: 'steel', line: 0 }, { p: tube([[312, 236, 2], [312, 246, 2]]), c: IRON, m: 'steel', line: 0 });
    out.push(barrel(22, g, 18, 46), barrel(56, g, 16, 40));
    return out;
  });

  /* ---------- кузница: высокая труба, горн, гербовый щит, мечи ---------- */
  bld('blacksmith', 'castle', (f, g) => {
    const out = [];
    out.push({ p: trap(62, 50, 230, 22, 26), c: CA.d, m: 'cloth', line: 1.2, lines: masonry(36, 50, 88, 230, 16, 22, 0.45, 2.2) }, { p: box(34, 40, 90, 56), c: IRON, m: 'steel', line: 1 });
    out.push(cW(40, 206, 292, g), hip(40, 292, 212, 84, 14, 50, CA.r, CA.rd), cCornice(36, 296, 210));
    out.push(...forge(108, g, 42, 124, true));
    out.push(...door(236, g, 22, 84, { pointed: true, ring: CA.ring, lamp: [206, 300] }));
    out.push(...heater(236, 244, 20, CA.ban, GOLD));
    // скрещённые мечи
    for (const s of [-1, 1]) out.push({ p: tube([[176 - s * 18, 272, 5], [176 + s * 18, 228, 3]]), c: '#c8d0da', m: 'steel', line: 0.8 }, { p: tube([[176 - s * 24, 262, 4], [176 - s * 8, 270, 4]]), c: GOLD, m: 'gold', line: 0.6 });
    out.push(anvil(300, g, 0.9));
    return out;
  });

  /* ---------- рынок: готическая аркада, полосатые навесы, мансарды ---------- */
  bld('market', 'castle', (f, g) => {
    const out = [];
    out.push(cW(26, 104, 382, g), cHip(26, 382, 110, 64, 12, 60), cCornice(22, 386, 108));
    // мансарды
    for (const x of [120, 290]) out.push(...gableFront(x - 24, x + 24, 72, 34, CA.w, CA.d, CA.r, 8), ...sqwin(x, 62, 8, 9));
    // башенка-фонарь с монетой на коньке
    out.push({ p: box(190, 30, 218, 52), c: CA.w, m: 'cloth', line: 1 }, ...cone(204, 32, 20, 40, CA.r, CA.rd), { e: [204, 42, 8, 8], c: GOLD, m: 'gold', line: 0.8 });
    for (const [cx, awn, ware] of [[74, '#2450b8', '#c8322a'], [160, '#b02a2a', null], [248, '#2450b8', '#e8c040'], [334, '#b02a2a', '#6ab04a']]) {
      out.push({ p: arch(cx, g, 32, 96, true), c: '#2a2018', m: 'cloth', ao: 1.2, line: 1.2 });
      if (ware) out.push({ p: box(cx - 30, g - 26, cx + 30, g), c: '#8a5a30', m: 'wood', flow: 0, line: 1 }, ...[-16, 0, 16].map(dx => ({ e: [cx + dx, g - 32, 9, 8], c: ware, m: 'skin', line: 0.8 })));
      else out.push(sack(cx - 10, g, 14, 30), barrel(cx + 16, g, 12, 30));
      const st = []; for (let x = cx - 44; x < cx + 44; x += 16) st.push({ p: [P(x, g - 124, 1), P(x + 8, g - 124, 1), P(x + 10, g - 98, 1), P(x + 2, g - 98, 1)], c: '#f4ecd8', m: 'flat', line: 0 });
      out.push({ p: [P(cx - 42, g - 126, 1), P(cx + 42, g - 126, 1), P(cx + 48, g - 98, 1), [cx + 32, g - 92], [cx + 16, g - 98], [cx, g - 92], [cx - 16, g - 98], [cx - 32, g - 92], P(cx - 48, g - 98, 1)], c: awn, m: 'cloth', line: 1.2, sub: st });
    }
    lit(160, g - 60); lit(248, g - 60);
    return out;
  });

  /* ---------- хранилище: каменная башня-склад с подъёмником, брёвна и руда ---------- */
  bld('silo', 'castle', (f, g) => {
    const out = [];
    out.push(cW(26, 236, 180, g), cHip(26, 180, 242, 70, 12, 40));
    out.push({ p: box(64, 290, 134, g), c: CA.wood, m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [{ p: [[99, 290], [99, g]], w: 3, a: 0.8 }, { p: [[64, 290], [134, g]], w: 4, c: WOODD, a: 0.9 }, { p: [[134, 290], [64, g]], w: 4, c: WOODD, a: 0.9 }] });
    out.push(cW(170, 110, 292, g, { rh: 24, bw: 34 }), cCornice(166, 296, 112));
    out.push(...cone(231, 108, 78, 100, CA.r, CA.rd, { flare: 0.02 }), { p: tube([[231, 12, 4], [231, -6, 3]]), c: GOLD, m: 'gold', line: 0.6 }, ...flag(231, -2, 36, CA.ban));
    // подъёмная балка, верёвка и ящик
    out.push({ p: tube([[292, 150, 9], [330, 150, 8]]), c: CA.wood, m: 'wood', line: 1 }, { p: tube([[322, 152, 2], [322, 220, 2]]), c: '#b89a6a', m: 'cloth', line: 0 }, { p: box(306, 220, 338, 250), c: '#9a7040', m: 'wood', flow: 0, line: 1, lines: [{ p: [[306, 220], [338, 250]], w: 2.4, a: 0.6 }] });
    out.push(...lancet(231, 190, 12, 36), ...sqwin(231, 270, 12, 14));
    out.push(...door(231, g, 22, 70, { pointed: true, ring: CA.ring }));
    out.push(...logs(4, g, 3, 12), ...oreCart(270, g, 0.9));
    return out;
  });

  /* ---------- Конюшни: длинное стойло, морды коней в денниках, флюгер-конь ---------- */
  function horseHead(x, y, c, mane, s) {
    s = s || 1;
    return [{ p: [[x - 12 * s, y + 20 * s], [x - 14 * s, y - 2 * s], [x - 6 * s, y - 16 * s], P(x - 4 * s, y - 26 * s, 1), [x + 2 * s, y - 16 * s], [x + 14 * s, y - 8 * s], [x + 26 * s, y + 2 * s], [x + 26 * s, y + 10 * s], [x + 12 * s, y + 12 * s], [x + 6 * s, y + 22 * s]], c, m: 'fur', flow: Math.PI * 0.4, line: 1, glint: [[x + 4 * s, y - 6 * s, 2 * s]],
      lines: [{ p: [[x + 21 * s, y + 5 * s], [x + 23 * s, y + 5 * s]], w: 2.4, c: '#1a1210', a: 0.9 }] },
      { p: [[x - 14 * s, y + 20 * s], [x - 16 * s, y - 4 * s], [x - 6 * s, y - 20 * s], [x - 4 * s, y - 8 * s], [x - 8 * s, y + 20 * s]], c: mane, m: 'fur', line: 0.8 },
      { e: [x + 4 * s, y - 6 * s, 2.6 * s, 2.6 * s], c: '#1a1210', m: 'flat', line: 0 }];
  }
  bld('special', 'castle', (f, g) => {
    const out = [];
    out.push(cW(0, 150, 290, g, { rh: 0, lines: [{ p: [[0, g - 40], [290, g - 40]], w: 3, a: 0.4 }] }));
    out.push({ p: box(0, g - 40, 290, g), c: CA.d, m: 'cloth', line: 1, lines: masonry(0, g - 40, 290, g, 20, 30, 0.4, 2) });
    out.push(cHip(0, 290, 156, 70, 12, 44));
    // купол-фонарь с флюгером-конём
    out.push({ p: box(128, 70, 162, 96), c: CA.w, m: 'cloth', line: 1, lines: [{ p: [[145, 74], [145, 94]], w: 3, c: HOLE, a: 0.8 }] }, ...cone(145, 72, 24, 36, CA.r, CA.rd), { p: tube([[145, 36, 3], [145, 14, 2.4]]), c: GOLD, m: 'gold', line: 0.5 });
    out.push({ p: [[132, 16], [138, 8], [150, 8], [156, 2], [162, 6], [158, 12], [154, 16], [156, 22], [150, 18], [140, 20], [136, 24], [132, 22]], c: GOLD, m: 'gold', line: 0.6 });
    // денники
    for (const [x, hc, mn] of [[50, '#8a5a30', '#3a2414'], [145, '#e8e2d8', '#b8b0a0'], [240, '#4a3020', '#1a1008']]) {
      out.push({ p: box(x - 30, 176, x + 30, g - 8), c: '#2a2018', m: 'cloth', ao: 1.2, line: 1.2 });
      out.push(...horseHead(x - 4, 206, hc, mn, 0.9));
      out.push({ p: box(x - 30, 236, x + 30, g - 8), c: CA.wood, m: 'wood', flow: 0, line: 1.2, lines: [{ p: [[x - 30, 236], [x + 30, g - 8]], w: 4, c: WOODD, a: 0.9 }, { p: [[x + 30, 236], [x - 30, g - 8]], w: 4, c: WOODD, a: 0.9 }] });
      lit(x + 14, 196);
    }
    // подкова над средним денником и сено
    out.push({ p: tube([[134, 164, 6], [128, 150, 6], [134, 138, 6], [156, 138, 6], [162, 150, 6], [156, 164, 6]]), c: '#9aa0a8', m: 'steel', line: 0.8 });
    out.push({ p: [[270, g], [266, g - 28], [282, g - 36], [304, g - 34], [314, g - 20], [312, g]], c: '#e0c060', m: 'fur', flow: -Math.PI / 2, line: 1 });
    return out;
  });

  /* ---------- жилища ---------- */
  // 1. Караульня (копейщики): донжон с зубцами, сторожевая башенка, стойка пик
  bld('dwell_1', 'castle', (f, g) => [
    ...tower(206, g, 24, 190, cT({ roofH: 74, win: [120], winW: 6, winH: 18, flag: CA.ban })),
    cW(50, 96, 196, g), merlons(46, 200, 94, 16, 26, CA.w, { k: 0.52 }),
    slit(86, 140, 26), slit(160, 140, 26),
    ...heater(123, 136, 20, CA.ban, GOLD),
    ...door(123, g, 22, 70, { pointed: true, ring: CA.ring, lamp: [92, 196] }),
    ...[0, 1, 2].map(i => ({ p: tube([[14 + i * 10, g, 5], [34 + i * 8, 94 + i * 6, 4]]), c: '#8a6a44', m: 'wood', line: 0.6 })),
    ...[0, 1, 2].map(i => ({ p: [P(30 + i * 8, 100 + i * 6, 1), P(36 + i * 8, 70 + i * 6, 1), P(42 + i * 8, 100 + i * 6, 1)], c: '#c8d0da', m: 'steel', line: 0.6 })),
    { p: tube([[8, 150, 5], [60, 150, 5]]), c: CA.wood, m: 'wood', line: 0.6 },
  ]);
  // 2. Башня лучников: круглая башня с галереей-хордингом, мишень
  bld('dwell_2', 'castle', (f, g) => [
    cW(8, 206, 90, g, { rh: 20, bw: 28 }), hip(8, 90, 212, 34, 6, 20, CA.r, CA.rd),
    ...tower(150, g, 46, 170, cT({ roofH: 84, win: [], flag: CA.ban, eave: 14 })),
    { p: box(96, 104, 204, 128), c: CA.wood, m: 'wood', flow: 0, line: 1.2, lines: [0, 1, 2, 3, 4, 5].map(k => ({ p: [[104 + k * 19, 108], [104 + k * 19, 124]], w: 4, c: HOLE, a: 0.8 })) },
    slit(150, 166, 30), ...win(150, 230, 9, 30, { pointed: true }), ...door(150, g, 18, 56, { pointed: true, ring: CA.ring }),
    { p: tube([[258, g, 5], [272, 196, 4]]), c: CA.wood, m: 'wood', line: 0.6 }, { p: tube([[290, g, 5], [276, 196, 4]]), c: CA.wood, m: 'wood', line: 0.6 },
    { e: [272, 200, 30, 30], c: '#f4ecd8', m: 'cloth', line: 1.2, sub: [{ e: [272, 200, 21, 21], c: '#b02a2a', m: 'flat', line: 0 }, { e: [272, 200, 13, 13], c: '#f4ecd8', m: 'flat', line: 0 }, { e: [272, 200, 6, 6], c: GOLD, m: 'flat', line: 0 }] },
    { p: tube([[258, 188, 2], [284, 204, 2]]), c: '#6a4428', m: 'wood', line: 0 }, { p: [P(254, 184, 1), P(262, 186, 1), P(258, 192, 1)], c: '#f4f4f4', m: 'feather', line: 0.4 },
  ]);
  // 3. Башня грифонов: скала, башня с зубцами, гнездо с яйцами наверху
  bld('dwell_3', 'castle', (f, g) => {
    const out = [];
    // утёс: грани светлая/тёмная, трещины
    out.push(rock([P(10, g, 1), [22, 250], P(46, 214, 1), [60, 170], P(84, 150, 1), [110, 156], P(128, 134, 1), P(250, 136, 1), [268, 150], P(292, 146, 1), [306, 176], P(318, 206, 1), [336, 240], P(348, g, 1)], '#a8a090', {
      lines: [{ p: [[60, 200], [96, 186], [120, 210]], w: 2.6, a: 0.55 }, { p: [[262, 170], [290, 214], [284, 250]], w: 2.6, a: 0.55 }, { p: [[150, 230], [190, 246], [206, 280]], w: 2.4, a: 0.45 }, { p: [[40, 262], [80, 250]], w: 2.4, a: 0.45 }],
      sub: [{ p: [P(210, 130, 1), P(360, 200, 1), P(360, g + 4, 1), P(240, g + 4, 1), [230, 220]], c: '#76706a', m: 'flat', line: 0 }, { p: [P(0, g + 4, 1), P(40, 210, 1), P(84, 146, 1), P(110, 160, 1), [80, 220], P(60, g + 4, 1)], c: '#c8c0ae', m: 'flat', line: 0 }] }));
    for (let i = 0; i < 5; i++) out.push({ p: box(92 - i * 12, 236 + i * 12, 124 - i * 12, 244 + i * 12), c: '#c8bea8', m: 'cloth', line: 0.8 });
    out.push(...tower(190, 140, 50, 80, cT({ top: 'crenel', win: [114], winW: 9, winH: 28 })));
    // гнездо: хворост, пух и яйца
    out.push({ p: [P(118, 52, 1), [150, 62], [190, 66], [230, 62], P(262, 52, 1), [250, 34], [220, 26], [160, 26], [130, 34]], c: '#8a6a3a', m: 'wood', flow: 0.2, line: 1.2, lines: [{ p: [[124, 46], [180, 38], [254, 48]], w: 3, a: 0.6 }, { p: [[132, 36], [210, 44]], w: 2.6, a: 0.5 }, { p: [[170, 30], [250, 40]], w: 2.6, a: 0.5 }] });
    out.push({ e: [176, 26, 13, 16], c: '#f0e6c8', m: 'skin', gloss: 0.6, line: 1 }, { e: [202, 28, 12, 14], c: '#e8d8b0', m: 'skin', gloss: 0.6, line: 1 });
    out.push({ p: tube([[138, 30, 6], [118, 4, 2]]), c: '#d8a040', m: 'feather', line: 0.6 }, { p: tube([[244, 30, 6], [268, 8, 2]]), c: '#c89030', m: 'feather', line: 0.6 });
    out.push(...door(150, 140, 14, 38, { pointed: true, ring: CA.ring }));
    out.push(...banner(274, 176, 12, 40, CA.ban, 'dot'));
    return out;
  });
  // 4. Казармы: длинный корпус с зубцами, надвратная башня, щиты в ряд, скрещённые мечи
  bld('dwell_4', 'castle', (f, g) => {
    const out = [cW(14, 150, 326, g), merlons(10, 330, 148, 16, 26, CA.w, { k: 0.52 })];
    out.push(cW(126, 96, 214, g, { rh: 26 }), ...cone(170, 98, 52, 84, CA.r, CA.rd), ...flag(170, 16, 40, CA.red));
    out.push(...door(170, g, 26, 86, { pointed: true, ring: CA.ring }));
    for (const s of [-1, 1]) out.push({ p: tube([[170 - s * 20, 170, 5], [170 + s * 20, 124, 3]]), c: '#c8d0da', m: 'steel', line: 0.8 }, { p: tube([[170 - s * 27, 160, 4], [170 - s * 10, 170, 4]]), c: GOLD, m: 'gold', line: 0.6 });
    for (const [x, i] of [[38, 0], [72, 1], [106, 0], [234, 1], [268, 0], [302, 1]]) out.push(...heater(x, 186, 13, i ? CA.red : CA.ban, i ? '#e8e0d0' : GOLD));
    out.push(...lancet(55, 262, 10, 34), ...lancet(285, 262, 10, 34), ...lancet(100, 262, 9, 30), ...lancet(240, 262, 9, 30));
    return out;
  });
  // 5. Монастырь: неф с высокой крышей, розой, колокольня со шпилем, клуатр
  bld('dwell_5', 'castle', (f, g) => {
    const out = [];
    out.push(cW(30, 210, 262, g), cHip(30, 262, 216, 110, 12, 96));
    out.push(...cGable(92, 208, 222, 96, 12), ...rose(150, 256, 22));
    out.push(...tower(328, g, 42, 300, cT({ roofH: 110, win: [], eave: 10, finial: GOLD })));
    out.push({ p: arch(328, 170, 18, 50, true), c: HOLE, m: 'cloth', line: 1 }, { p: [P(316, 164, 1), [318, 140], [328, 134], [338, 140], P(340, 164, 1)], c: GOLD, m: 'gold', gloss: 1, line: 0.8 });
    out.push(...lancet(328, 250, 10, 38), ...lancet(56, 298, 10, 38), ...lancet(236, 298, 10, 38));
    // клуатр: низкая аркада под навесом
    out.push(cW(24, 330, 276, g, { rh: 0 }), hip(24, 276, 334, 26, 8, 10, CA.r, CA.rd));
    for (const x of [58, 100, 200, 242]) out.push({ p: arch(x, g, 15, 50), c: '#2a2018', m: 'cloth', ao: 1, line: 1 });
    out.push(...door(150, g, 22, 60, { pointed: true, ring: CA.ring, lamp: [120, 352] }));
    return out;
  });
  // 6. Ристалище: трибуна с навесом, шатры, барьер, стойка копий, чучело-квинтана
  function tent(cx, G, hw, h, c, c2, pen) {
    const st = []; for (let k = -3; k <= 3; k += 2) st.push({ p: [P(cx, G - h, 1), P(cx + hw * k / 4, G + 4, 1), P(cx + hw * (k + 1) / 4, G + 4, 1)], c: c2, m: 'flat', line: 0 });
    return [{ p: [P(cx - hw, G, 1), [cx - hw * 0.5, G - h * 0.45], P(cx, G - h, 1), [cx + hw * 0.5, G - h * 0.45], P(cx + hw, G, 1)], c, m: 'cloth', line: 1.2, sub: st },
      { p: [P(cx - hw * 0.28, G, 1), P(cx, G - h * 0.42, 1), P(cx + hw * 0.28, G, 1)], c: '#2a2018', m: 'cloth', line: 1 },
      { p: [P(cx - hw * 1.08, G - h * 0.02, 1), P(cx + hw * 1.08, G - h * 0.02, 1), P(cx + hw * 0.9, G - h * 0.16, 1), P(cx - hw * 0.9, G - h * 0.16, 1)], c: c2, m: 'cloth', line: 0.8 },
      ...flag(cx, G - h + 2, 40, pen)];
  }
  bld('dwell_6', 'castle', (f, g) => {
    const out = [];
    // трибуна под полосатым навесом
    out.push({ p: box(70, 200, 370, 320), c: CA.wood, m: 'wood', flow: 0, line: 1.2, lines: [0, 1, 2, 3, 4].map(k => ({ p: [[70, 222 + k * 22], [370, 222 + k * 22]], w: 3, a: 0.6 })) });
    out.push(...[80, 160, 280, 360].map(x => ({ p: box(x - 6, 130, x + 6, 320), c: CA.wood, m: 'wood', line: 1 })));
    out.push({ p: [P(56, 140, 1), P(384, 140, 1), P(398, 172, 1), [352, 182], [306, 172], [260, 182], [220, 172], [180, 182], [134, 172], [88, 182], P(42, 172, 1)], c: CA.r, m: 'cloth', line: 1.2, sub: [0, 1, 2, 3, 4, 5, 6, 7].map(k => ({ p: box(60 + k * 42, 130, 80 + k * 42, 190), c: '#f4ecd8', m: 'flat', line: 0 })) });
    out.push({ p: [P(64, 142, 1), P(376, 142, 1), P(350, 104, 1), P(90, 104, 1)], c: CA.r, m: 'cloth', line: 1.2, sub: [0, 1, 2, 3, 4, 5, 6, 7].map(k => ({ p: box(70 + k * 40, 100, 88 + k * 40, 146), c: '#f4ecd8', m: 'flat', line: 0 })) });
    for (const x of [100, 220, 340]) out.push(...flag(x, 106, 64, x === 220 ? CA.red : CA.ban));
    out.push(...banner(220, 196, 20, 70, CA.ban, 'cross'));
    // шатры
    out.push(...tent(70, g - 16, 70, 250, CA.ban, '#f4ecd8', CA.ban), ...tent(372, g - 16, 70, 250, CA.red, '#f4ecd8', CA.red));
    // стойка копий
    for (let i = 0; i < 4; i++) { const x = 186 + i * 20; out.push({ p: tube([[x, g - 30, 7], [x + 10, 250, 3]]), c: i % 2 ? '#e8e0d0' : '#2450b8', m: 'wood', line: 0.7, lines: [{ p: [[x + 2, g - 50], [x + 8, 280]], w: 2, c: i % 2 ? CA.ban : '#f4ecd8', a: 0.8 }] }); }
    out.push({ p: tube([[176, 340, 6], [270, 340, 6]]), c: CA.wood, m: 'wood', line: 0.7 });
    // барьер
    out.push({ p: box(6, g - 50, 434, g - 30), c: '#f4ecd8', m: 'wood', flow: 0, line: 1.2, sub: [0, 1, 2, 3, 4, 5, 6].map(k => ({ p: [P(6 + k * 64, g - 52, 1), P(38 + k * 64, g - 52, 1), P(48 + k * 64, g - 28, 1), P(16 + k * 64, g - 28, 1)], c: CA.ban, m: 'flat', line: 0 })) });
    for (const x of [12, 118, 222, 326, 428]) out.push({ p: box(x - 7, g - 58, x + 7, g), c: CA.wood, m: 'wood', line: 1 });
    lit(220, 290);
    return out;
  });
  // 7. Портал славы: мраморная арка в облаках, сияние, золотые крылья
  function wingGold(x, y, s, L) {
    const out = [];
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + s * (0.35 + i * 0.22), len = L * (1 - i * 0.12); const lf = K.leaf([x, y], a, len, 20 - i * 1.5); out.push({ p: lf.body, c: i % 2 ? '#f0d070' : '#e0b040', m: 'gold', gloss: 0.9, line: 0.8, lines: [{ p: lf.shaft, w: 1.6, a: 0.5 }] }); }
    return out;
  }
  bld('dwell_7', 'castle', (f, g, cx) => {
    const out = [];
    // боковые башенки
    for (const x of [90, 450]) out.push(...tower(x, g - 70, 26, 230, cT({ roofH: 90, win: [g - 190], winW: 7, winH: 22, flag: CA.ban, flagLeft: x < cx })));
    // сияние
    for (let i = -3; i <= 3; i++) { const a = -Math.PI / 2 + i * 0.3, r = i % 2 ? 150 : 200, d = 0.06; out.push({ p: [P(cx, 170, 1), P(cx + Math.cos(a - d) * r, 170 + Math.sin(a - d) * r, 1), P(cx + Math.cos(a + d) * r, 170 + Math.sin(a + d) * r, 1)], c: 'rgba(255,236,160,0.3)', m: 'flat', line: 0 }); }
    // столпы и арка
    out.push(cW(cx - 130, 180, cx - 70, g - 70, { rh: 30, bw: 30 }), cW(cx + 70, 180, cx + 130, g - 70, { rh: 30, bw: 30 }));
    out.push({ p: [P(cx - 136, 186, 1), [cx - 132, 110], [cx - 80, 50], [cx, 34], [cx + 80, 50], [cx + 132, 110], P(cx + 136, 186, 1), P(cx + 70, 186, 1), [cx + 64, 130], [cx, 96], [cx - 64, 130], P(cx - 70, 186, 1)], c: CA.w, m: 'cloth', line: 1.2, lines: voussoirs(cx, 186, 100, 9),
      sub: [{ p: [P(cx + 40, 20, 1), P(cx + 150, 20, 1), P(cx + 150, 200, 1), P(cx + 90, 200, 1)], c: CA.d, m: 'flat', line: 0 }] });
    out.push({ p: [P(cx - 70, g - 70, 1), P(cx - 70, 186, 1), [cx - 64, 130], [cx, 96], [cx + 64, 130], P(cx + 70, 186, 1), P(cx + 70, g - 70, 1)], c: '#fff0b0', m: 'gem', gloss: 1.2, rim: 0, line: 1, lc: '#b08a30',
      sub: [{ p: [P(cx - 40, g - 70, 1), [cx - 36, 180], [cx, 130], [cx + 36, 180], P(cx + 40, g - 70, 1)], c: '#ffffff', m: 'flat', line: 0, op: 0.8 }] });
    lit(cx, 200); lit(cx, 300);
    out.push({ e: [cx, 56, 16, 16], c: GOLD, m: 'gold', line: 1 });
    out.push(...wingGold(cx - 12, 44, -1, 150), ...wingGold(cx + 12, 44, 1, 150));
    out.push({ p: ell(cx, 8, 26, 8, 14), c: '#fff4a0', m: 'gem', gloss: 1, rim: 0, line: 1, lc: '#b08a30', sub: [{ p: ell(cx, 8, 18, 4, 12), c: '#fffbe0', m: 'flat', line: 0 }] });
    // ступени и облака
    out.push(...steps(cx, g - 58, 120, 86, 3, 12, '#e8e2d8'));
    out.push(...cloud(cx - 150, g - 30, 180, 44, 11), ...cloud(cx + 150, g - 30, 180, 44, 12), ...cloud(cx, g - 6, 260, 40, 13));
    return out;
  });

  /* ---------- укрепления: надвратная часть ---------- */
  function cFortWall(g, top) {
    return [cW(10, top, 970, g, { shadeK: 0.02, rh: 24, bw: 48 }), merlons(6, 974, top - 2, 24, 44, CA.w, { k: 0.55 }), { p: box(10, g - 26, 970, g), c: CA.d, m: 'cloth', line: 1 }];
  }
  function cGatehouse(g, top, tall) {
    const out = [];
    out.push(cW(404, top, 576, g, { rh: 24, bw: 40 }), merlons(398, 582, top - 2, 24, 34, CA.w, { k: 0.55 }));
    out.push(...gate(490, g, 42, Math.min(140, (g - top) * 0.62), { ring: CA.ring, rw: 14, pointed: true }));
    out.push(...banner(430, top + 26, 14, 58, CA.ban, 'cross'), ...banner(550, top + 26, 14, 58, CA.ban, 'cross'));
    for (const s of [-1, 1]) out.push(...tower(490 + s * 100, g, 30, g - top + (tall || 40), cT({ roofH: 90, win: [top + 30], winW: 7, winH: 22, flag: CA.ban, flagLeft: s < 0 })));
    return out;
  }
  bld('fort', 'castle', (f, g) => [...cFortWall(g, 150), ...cGatehouse(g, 96, 30)]);
  bld('citadel', 'castle', (f, g) => [...cFortWall(g, 270),
    ...tower(110, g, 60, 320, cT({ roofH: 120, win: [220, 310], winW: 10, winH: 30, flag: CA.ban, flagLeft: true })),
    ...tower(870, g, 60, 320, cT({ roofH: 120, win: [220, 310], winW: 10, winH: 30, flag: CA.ban })),
    ...cGatehouse(g, 216, 50)]);
  bld('castle', 'castle', (f, g) => [
    // донжон за воротами
    cW(420, 170, 560, 420, { rh: 28 }), ...cone(490, 172, 80, 150, CA.r, CA.rd), { p: tube([[490, 24, 5], [490, 4, 3]]), c: GOLD, m: 'gold', line: 0.6 }, ...flag(490, 8, 50, CA.red),
    ...lancet(490, 300, 12, 44), ...rose(490, 220, 18),
    ...cFortWall(g, 460),
    ...tower(110, g, 62, 350, cT({ roofH: 126, win: [390, 480], winW: 10, winH: 30, flag: CA.ban, flagLeft: true })),
    ...tower(870, g, 62, 350, cT({ roofH: 126, win: [390, 480], winW: 10, winH: 30, flag: CA.ban })),
    ...cGatehouse(g, 400, 70)]);

  /* =====================================================================================
     ОПЛОТ — светлый тёплый камень, зелёные вогнутые шпили с золотым листом,
     живые деревья, лоза, вода и водопады, полукруглые эльфийские проёмы
     ===================================================================================== */
  const RA = { w: '#e6dcc0', d: '#a8977a', r: '#3f9a3a', rd: '#22622a', ring: '#cdbd94', wood: '#8a5a30', gold: '#e0b040', water: '#6ac0e8' };
  const LEAF = ['#2f6a2a', '#4a9a3a', '#6cc052', '#3f8a30'], LEAF2 = ['#35702c', '#5aa840', '#8ad060', '#4a9a3a'];
  const rT = o => Object.assign({ wall: RA.w, shade: RA.d, roof: RA.r, roofD: RA.rd, top: 'elf', rh: 22, ma: 0.3, eave: 10 }, o);
  const rW = (x0, y0, x1, y1, o) => wallBox(x0, y0, x1, y1, Object.assign({ c: RA.w, d: RA.d, rh: 22, bw: 34, ma: 0.3 }, o));
  const rWin = (cx, y1, w, h) => win(cx, y1, w, h, { sill: RA.ring });
  const rDoor = (cx, g, w, h, lamp) => door(cx, g, w, h, { ring: RA.ring, c: '#6a4a24', lamp });
  /** Каменный круглый зал с эльфийским шпилем. */
  const rHall = (cx, g, hw, h, rh, o) => tower(cx, g, hw, h, rT(Object.assign({ roofH: rh, eave: hw * 0.3, win: [], taper: 0.02 }, o)));
  /** Резной золотой пояс с листьями (карниз). */
  const rBand = (x0, x1, y) => ({ p: box(x0, y - 5, x1, y + 5), c: RA.gold, m: 'gold', line: 0.8, lines: Array.from({ length: Math.max(1, Math.floor((x1 - x0) / 18)) }, (_, i) => ({ p: [[x0 + 9 + i * 18 - 5, y + 3], [x0 + 9 + i * 18, y - 3], [x0 + 9 + i * 18 + 5, y + 3]], w: 1.6, a: 0.6 })) });

  /* ---------- ратуша ---------- */
  bld('hall_1', 'rampart', (f, g) => [
    ...tree(70, g, 300, 72, LEAF, 101, { tw: 13, n: 6 }),
    rW(282, 272, 372, g), elfRoofHip(282, 372, 276, 60, RA.r, RA.rd),
    ...rHall(200, g, 72, 150, 170, { win: [] }),
    rBand(132, 268, 222),
    ...rWin(160, 300, 12, 40), ...rWin(240, 300, 12, 40), ...sqwin(327, 312, 10, 12, { sill: RA.ring }),
    ...rDoor(200, g, 24, 78, [166, 300]),
    ...vine([[132, g], [140, 300], [134, 260], [146, 230]], 7, 4), ...vine([[372, g], [360, 330], [366, 290]], 8, 3),
  ]);
  /** Вальма с вогнутым силуэтом и загнутыми краями (крыша крыльев). */
  function elfRoofHip(x0, x1, y, h, c, cd) {
    const w = x1 - x0;
    return { p: [P(x0 - 16, y - 8, 1), [x0 + w * 0.12, y - h * 0.2], P(x0 + w * 0.3, y - h, 1), P(x1 - w * 0.3, y - h, 1), [x1 - w * 0.12, y - h * 0.2], P(x1 + 16, y - 8, 1), [x1, y + 4], [x0, y + 4]], c, m: 'leather', gloss: 0.35, line: 1.1,
      lines: [0.3, 0.6].map(t => ({ p: [[x0 + w * 0.2 * t, y - h * t], [x1 - w * 0.2 * t, y - h * t]], w: 2, a: 0.4 })),
      sub: [{ p: [P((x0 + x1) / 2 + w * 0.15, y - h - 2, 1), P(x1 + 18, y - h - 2, 1), P(x1 + 18, y + 6, 1), P((x0 + x1) / 2 + w * 0.3, y + 6, 1)], c: cd, m: 'flat', line: 0 }] };
  }
  bld('hall_2', 'rampart', (f, g) => [
    ...tree(390, g - 60, 330, 86, LEAF, 102, { tw: 14, n: 6 }),
    ...rHall(104, g, 30, 270, 120, { win: [230, 320], winW: 7, winH: 22, flag: '#3f9a3a', flagLeft: true }),
    rW(130, 300, 370, g), elfRoofHip(130, 370, 304, 64, RA.r, RA.rd),
    ...rHall(250, g, 82, 180, 180, {}),
    rBand(168, 332, 272),
    ...rWin(210, 350, 13, 44), ...rWin(290, 350, 13, 44), ...rWin(160, 380, 11, 36), ...rWin(340, 380, 11, 36), ...rWin(250, 318, 11, 30),
    ...rDoor(250, g, 26, 62, [218, 402]),
    ...vine([[168, g], [176, 380], [170, 330], [184, 290]], 9, 4), ...vine([[430, g], [410, 390], [420, 350]], 10, 3),
  ]);
  bld('hall_3', 'rampart', (f, g) => [
    ...tree(90, g - 110, 300, 90, LEAF, 103, { tw: 14, n: 6 }),
    ...tree(440, g - 120, 290, 84, LEAF2, 104, { tw: 13, n: 6 }),
    ...rHall(130, g, 66, 170, 140, { win: [370], winW: 11, winH: 36 }),
    ...rHall(390, g, 66, 170, 140, { win: [370], winW: 11, winH: 36 }),
    ...rHall(260, g, 58, 300, 150, { win: [210, 290], winW: 11, winH: 36, flag: '#3f9a3a' }),
    rBand(196, 324, 330),
    { p: box(186, 330, 334, 342), c: RA.wood, m: 'wood', flow: 0, line: 1, lines: Array.from({ length: 8 }, (_, i) => ({ p: [[192 + i * 20, 312], [192 + i * 20, 330]], w: 3, c: RA.wood, a: 1 })).concat([{ p: [[186, 312], [334, 312]], w: 3.6, c: RA.wood, a: 1 }]) },
    ...rDoor(260, g, 28, 88, [224, 386]),
    ...rWin(100, 440, 10, 32), ...rWin(420, 440, 10, 32),
    ...vine([[200, g], [206, 400], [198, 360], [210, 340]], 11, 4), ...vine([[320, g], [314, 400], [322, 360]], 12, 3),
  ]);
  bld('hall_4', 'rampart', (f, g) => {
    const out = [];
    // великое древо за дворцом
    out.push(...trunk(280, 400, 150, 30, '#6a4a2a', 0), ...foliage(280, 120, 200, 110, 7, LEAF, 105));
    out.push(...rHall(40, g - 30, 26, 190, 90, { win: [440], winW: 7, winH: 22 }), ...rHall(520, g - 30, 26, 190, 90, { win: [440], winW: 7, winH: 22 }));
    out.push(...rHall(110, g, 42, 290, 120, { win: [340, 420], winW: 9, winH: 28, flag: '#3f9a3a', flagLeft: true }));
    out.push(...rHall(450, g, 42, 290, 120, { win: [340, 420], winW: 9, winH: 28, flag: '#3f9a3a' }));
    out.push(rW(150, 380, 410, g), elfRoofHip(150, 410, 384, 50, RA.r, RA.rd));
    out.push(...rHall(280, g, 66, 360, 170, { win: [270, 350], winW: 13, winH: 42, finial: true }));
    out.push(rBand(214, 346, 300), rBand(150, 410, 440));
    out.push(...rWin(190, 480, 11, 36), ...rWin(370, 480, 11, 36));
    // терраса-лестница и водопад в пруд
    out.push(...steps(280, g, 76, 52, 3, 8, RA.ring), ...rDoor(280, g - 24, 32, 100));
    out.push(rock([P(360, g, 1), [364, 510], P(390, 476, 1), P(430, 470, 1), [440, 520], P(444, g, 1)], '#9a9480'), fall(404, 482, g - 8, 14, RA.water), pool(420, g - 4, 60, 12, RA.water));
    out.push(...vine([[150, g], [160, 520], [150, 480], [162, 440]], 13, 4));
    return out;
  });

  /* ---------- гильдия магов: стройная башня ярусами-«лепестками», кристалл наверху ---------- */
  function rampartGuild(L) {
    bld('guild_' + L, 'rampart', (f, g, cx) => {
      const top = 180, floors = L + 1, fh = (g - 30 - top) / floors, hw0 = 50, hw1 = 38, out = [];
      if (L >= 3) out.push(...tree(cx + 92, g, 240 + L * 20, 76, LEAF2, 110 + L, { tw: 11, n: 5 }));
      out.push({ p: box(cx - hw0 - 14, g - 30, cx + hw0 + 14, g), c: RA.d, m: 'cloth', line: 1.2, lines: masonry(cx - hw0 - 14, g - 30, cx + hw0 + 14, g, 15, 30, 0.35, 2) });
      out.push({ p: [P(cx - hw1, top, 1), P(cx + hw1, top, 1), P(cx + hw0, g - 30, 1), P(cx - hw0, g - 30, 1)], c: RA.w, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 30, 22, 30, 0.3, 2),
        sub: [{ p: [P(cx + hw1 * 0.45, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.45, g, 1)], c: RA.d, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh + 16; out.push(...win(cx, y - 18, 12, Math.min(52, fh * 0.5), { c: ['#9ae0c0', '#c8f0a0', '#e0b0ff'][i % 3], lc: '#1a3a2a' })); }
      // зелёные юбки-свесы на каждом ярусе
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh, hw = hw1 + (hw0 - hw1) * (y - top) / (g - top); out.push(elfRoofHip(cx - hw, cx + hw, y + 10, 22, RA.r, RA.rd)); }
      out.push(...rDoor(cx, g - 30, 22, Math.min(80, fh * 0.75)));
      out.push(...vine([[cx - hw0 - 10, g - 30], [cx - hw0 + 6, g - 90], [cx - hw0 - 4, g - 150], [cx - hw0 + 10, g - 210]], 20 + L, 5));
      const rh = 120 + L * 14, r = elfRoof(cx, top + 4, hw1 + 18, rh, RA.r, RA.rd, { finial: false });
      out.push(rBand(cx - hw1 - 6, cx + hw1 + 6, top + 4), ...r);
      // парящий кристалл
      out.push({ p: tube([[cx, top - rh + 6, 5], [cx, top - rh - 16, 3]]), c: GOLD, m: 'gold', line: 0.5 });
      out.push(crystal(cx, top - rh - 20, 10 + L * 2, 34 + L * 6, L >= 3 ? '#e070d0' : '#58d0a0', 0));
      if (L >= 2) out.push({ e: [cx, top - rh - 34 - L * 3, 22 + L * 3, 6], c: 'rgba(200,255,220,0.35)', m: 'flat', line: 0.6, lc: '#e0c050' });
      lit(cx, top - rh - 36);
      return out;
    });
  }
  for (let i = 1; i <= 4; i++) rampartGuild(i);

  /* ---------- таверна: дом в огромном пне под зелёной шляпой ---------- */
  bld('tavern', 'rampart', (f, g) => {
    const out = [];
    out.push(...foliage(300, 150, 60, 50, 4, LEAF, 120));
    // пень-дом
    out.push({ p: [P(80, g, 1), [96, g - 26], [100, 200], [96, 130], P(104, 110, 1), P(256, 110, 1), [264, 130], [260, 200], [264, g - 26], P(284, g, 1), [230, g - 8], [180, g - 2], [130, g - 8]], c: '#8a6038', m: 'wood', flow: -Math.PI / 2, line: 1.2,
      lines: [{ p: [[120, 120], [116, 200], [122, g - 20]], w: 2.4, a: 0.5 }, { p: [[160, 116], [156, 180]], w: 2, a: 0.4 }, { p: [[236, 120], [240, 200], [234, g - 20]], w: 2.4, a: 0.5 }],
      sub: [{ p: [P(210, 100, 1), P(290, 100, 1), P(290, g + 4, 1), P(226, g + 4, 1)], c: '#5a3a20', m: 'flat', line: 0 }] });
    // корни
    for (const [x, s] of [[86, -1], [274, 1], [140, -1]]) out.push({ p: tube([[x, g - 30, 14], [x + s * 22, g - 6, 10], [x + s * 36, g + 2, 6]]), c: '#7a5230', m: 'wood', line: 0.8 });
    out.push(...elfRoof(180, 116, 132, 96, RA.r, RA.rd));
    out.push(...sqwin(130, 170, 13, 15, { shutters: RA.r }), ...sqwin(230, 170, 13, 15, { shutters: RA.r }), ...sqwin(180, 230, 12, 14));
    out.push(...rDoor(180, g, 24, 70, [140, 280]));
    // вывеска на суку
    out.push({ p: tube([[262, 214, 7], [300, 206, 5], [330, 212, 4]]), c: '#6a4a2a', m: 'wood', line: 0.8 }, { p: box(300, 222, 336, 262), c: '#c8a060', m: 'wood', flow: 0, line: 1.1, sub: [{ p: box(310, 232, 324, 254), c: GOLD, m: 'gold', line: 0.6 }, { e: [327, 243, 4, 6], c: '#c8a060', m: 'flat', line: 0 }, { e: [317, 231, 8, 3.4], c: '#fff8e0', m: 'flat', line: 0 }] });
    out.push({ p: tube([[306, 210, 1.6], [306, 222, 1.6]]), c: '#b89a6a', m: 'cloth', line: 0 }, { p: tube([[330, 212, 1.6], [330, 222, 1.6]]), c: '#b89a6a', m: 'cloth', line: 0 });
    out.push(barrel(30, g, 16, 40), barrel(62, g, 14, 34), barrel(46, g - 40, 13, 30));
    return out;
  });

  /* ---------- кузница гномов: горн в скале, каменная труба, молот ---------- */
  bld('blacksmith', 'rampart', (f, g) => {
    const out = [];
    out.push({ p: trap(262, 60, 180, 20, 28), c: '#9a9480', m: 'horn', line: 1.1, lines: masonry(234, 60, 290, 180, 18, 20, 0.45, 2) }, { p: box(236, 50, 288, 64), c: '#6a665a', m: 'horn', line: 1 });
    out.push(rock([P(10, g, 1), [16, 250], P(40, 190, 1), [90, 150], P(150, 140, 1), [220, 150], P(270, 176, 1), [310, 230], P(326, g, 1)], '#a09884', { lines: [{ p: [[40, 240], [80, 220]], w: 2.4, a: 0.5 }, { p: [[280, 220], [300, 270]], w: 2.4, a: 0.5 }],
      sub: [{ p: [P(200, 130, 1), P(340, 200, 1), P(340, g + 4, 1), P(250, g + 4, 1)], c: '#74705e', m: 'flat', line: 0 }] }));
    out.push(...foliage(80, 160, 50, 22, 3, LEAF, 130), ...foliage(250, 170, 40, 18, 3, LEAF2, 131));
    // каменный фасад с зелёным фронтоном
    out.push(rW(70, 230, 270, g, { rh: 20, bw: 30 }), ...gableFront(80, 260, 234, 60, RA.w, RA.d, RA.r, 12));
    out.push(...forge(130, g, 40, 104, false));
    out.push(...rDoor(222, g, 20, 70, [196, 296]));
    // вывеска-молот
    out.push({ e: [170, 196, 16, 16], c: RA.gold, m: 'gold', line: 1 }, { p: tube([[170, 206, 4], [170, 186, 4]]), c: '#6a4a24', m: 'wood', line: 0.5 }, { p: box(160, 180, 180, 190), c: '#8a909a', m: 'steel', line: 0.6 });
    out.push(anvil(300, g, 0.8), ...oreCart(40, g, 0.7, '#a0a8b0'));
    return out;
  });

  /* ---------- рынок: деревянный павильон под широкой вогнутой крышей, гирлянды ---------- */
  bld('market', 'rampart', (f, g) => {
    const out = [];
    out.push({ p: box(40, 130, 368, g), c: '#3a2a1a', m: 'cloth', ao: 1, line: 0 });
    out.push(elfRoofHip(30, 378, 132, 90, RA.r, RA.rd), rBand(30, 378, 136));
    out.push(...elfRoof(204, 50, 40, 50, RA.r, RA.rd));
    for (const x of [40, 150, 258, 368]) out.push({ p: box(x - 8, 136, x + 8, g), c: '#9a6a38', m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[x - 8, 160], [x + 8, 176]], w: 2.4, c: '#3a6a2a', a: 0.8 }, { p: [[x - 8, 200], [x + 8, 216]], w: 2.4, c: '#3a6a2a', a: 0.8 }] });
    // гирлянды из листьев между столбами
    for (const [a, b] of [[40, 150], [150, 258], [258, 368]]) out.push({ p: [[a + 8, 146], [(a + b) / 2, 172], [b - 8, 146]], c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: [{ p: [[a + 8, 146], [(a + b) / 2, 172], [b - 8, 146]], w: 5, c: '#4a9a3a', a: 1 }] }, { e: [(a + b) / 2, 172, 5, 5], c: '#e86a8a', m: 'gem', line: 0.5 });
    // прилавки с товаром
    for (const [cx, ware] of [[95, '#e8c040'], [204, '#c8322a'], [313, '#8ad060']]) out.push({ p: box(cx - 38, g - 34, cx + 38, g), c: '#b8844a', m: 'wood', flow: 0, line: 1 }, ...[-22, 0, 22].map(dx => ({ e: [cx + dx, g - 40, 11, 9], c: ware, m: 'skin', line: 0.8 })));
    out.push(sack(20, g, 14, 32), barrel(392, g, 13, 32));
    lit(95, g - 70); lit(313, g - 70);
    return out;
  });

  /* ---------- хранилище: амбар на сваях, поленница, руда, кристаллы ---------- */
  bld('silo', 'rampart', (f, g) => {
    const out = [];
    for (const x of [80, 150, 220]) out.push({ p: box(x - 8, 240, x + 8, g), c: '#6a4a2a', m: 'wood', line: 1 });
    out.push({ p: box(60, 140, 240, 250), c: '#a07040', m: 'wood', flow: 0, line: 1.2, lines: Array.from({ length: 5 }, (_, i) => ({ p: [[60, 160 + i * 20], [240, 160 + i * 20]], w: 2, a: 0.5 })), sub: [{ p: box(210, 136, 244, 254), c: '#6a4a24', m: 'flat', line: 0 }] });
    out.push(...elfRoof(150, 144, 118, 124, RA.r, RA.rd));
    out.push({ p: box(128, 176, 172, 238), c: '#5a3a1c', m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[150, 176], [150, 238]], w: 2.4, a: 0.7 }] });
    // лесенка
    out.push({ p: tube([[112, g, 4], [132, 244, 4]]), c: '#6a4a2a', m: 'wood', line: 0.6 }, { p: tube([[138, g, 4], [158, 244, 4]]), c: '#6a4a2a', m: 'wood', line: 0.6, lines: [0, 1, 2, 3, 4].map(k => ({ p: [[114 + k * 4 - 2, g - 20 - k * 28], [140 + k * 4, g - 20 - k * 28]], w: 3, c: '#6a4a2a', a: 1 })) });
    out.push(...sqwin(96, 196, 10, 12), ...logs(210, g, 3, 12), ...oreCart(40, g, 0.8));
    out.push(crystal(286, g, 10, 40, '#c8f0ff', 0.1), crystal(270, g, 8, 28, '#a0e0ff', -0.2));
    return out;
  });

  /* ---------- Мистический пруд: светящаяся вода в кольце камней, беседка, кристаллы ---------- */
  bld('special', 'rampart', (f, g) => {
    const out = [];
    out.push(...tree(236, g - 70, 240, 58, LEAF2, 140, { tw: 10, n: 5 }));
    // беседка-ротонда за прудом
    out.push(...column(100, 110, 200, 8, RA.w, RA.d), ...column(184, 110, 200, 8, RA.w, RA.d));
    out.push({ p: box(80, 100, 204, 112), c: RA.gold, m: 'gold', line: 1 }, ...elfRoof(142, 104, 76, 90, RA.r, RA.rd));
    out.push({ e: [142, 150, 18, 18], c: '#9af0ff', m: 'gem', gloss: 1.2, line: 1, lc: '#2a6a8a', sub: [{ e: [138, 146, 8, 8], c: '#ffffff', m: 'flat', line: 0 }] }, { p: tube([[142, 168, 10], [142, 200, 14]]), c: RA.ring, m: 'cloth', line: 0.8 });
    lit(142, 150);
    // пруд и кольцо камней
    out.push({ e: [140, g - 34, 132, 40], c: '#8a8474', m: 'horn', line: 1 });
    out.push({ e: [140, g - 36, 118, 30], c: '#3ac8d8', m: 'gem', gloss: 1.2, rim: 0.6, line: 1, lc: '#1a5a6a', sub: [{ e: [120, g - 42, 64, 12], c: '#b8fff4', m: 'flat', line: 0, op: 0.7 }], lines: [{ p: [[70, g - 30], [110, g - 30]], w: 2.4, light: true, a: 0.8 }, { p: [[170, g - 26], [210, g - 26]], w: 2.4, light: true, a: 0.8 }] });
    lit(140, g - 40);
    for (const [x, y, r] of [[30, g - 26, 16], [70, g - 6, 18], [130, g + 2, 16], [196, g - 2, 18], [250, g - 22, 16], [260, g - 50, 12], [22, g - 52, 12]]) out.push({ e: [x, y, r, r * 0.7], c: '#9a9484', m: 'horn', gloss: 0.2, line: 1 });
    // кувшинки и кристаллы
    out.push({ e: [100, g - 34, 12, 5], c: '#4a9a3a', m: 'leather', line: 0.6 }, { e: [100, g - 37, 4, 3], c: '#f0a0c0', m: 'gem', line: 0.4 }, { e: [180, g - 44, 10, 4], c: '#4a9a3a', m: 'leather', line: 0.6 });
    out.push(crystal(12, g - 46, 9, 44, '#e070d0', -0.15), crystal(270, g - 60, 9, 40, '#70e0c0', 0.15));
    return out;
  });

  /* ---------- жилища ---------- */
  // 1. Конюшни кентавров: дощатый дом, открытый денник с сеном, лук и колчан, подкова
  bld('dwell_1', 'rampart', (f, g) => [
    ...tree(226, g - 40, 200, 40, LEAF, 150, { tw: 8, n: 4 }),
    { p: box(26, 130, 220, g), c: '#a07040', m: 'wood', flow: 0, line: 1.2, lines: Array.from({ length: 6 }, (_, i) => ({ p: [[26, 146 + i * 18], [220, 146 + i * 18]], w: 2, a: 0.5 })), sub: [{ p: box(188, 126, 224, g + 4), c: '#6a4a24', m: 'flat', line: 0 }] },
    elfRoofHip(26, 220, 134, 76, RA.r, RA.rd), { p: box(120, 44, 132, 64), c: '#6a4a24', m: 'wood', line: 0.5 },
    { p: arch(88, g, 40, 90), c: '#2a2014', m: 'cloth', ao: 1.2, line: 1.2 },
    { p: [[56, g], [58, g - 30], [74, g - 44], [100, g - 42], [118, g - 28], [120, g]], c: '#e0c060', m: 'fur', flow: -Math.PI / 2, line: 1 },
    { p: tube([[150, 176, 5], [170, 210, 4], [176, 256, 5]]), c: '#8a5a2a', m: 'wood', line: 0.7 }, { p: tube([[150, 176, 1.4], [176, 256, 1.4]]), c: '#e8e0d0', m: 'flat', line: 0 },
    { p: tube([[190, 180, 10], [196, 236, 10]]), c: '#6a3a1a', m: 'leather', line: 0.8 }, ...[0, 1, 2].map(i => ({ p: [P(182 + i * 6, 184, 1), P(186 + i * 6, 166, 1), P(190 + i * 6, 184, 1)], c: '#f4f4f4', m: 'feather', line: 0.4 })),
    { p: tube([[134, 108, 5], [128, 96, 5], [134, 84, 5], [150, 84, 5], [156, 96, 5], [150, 108, 5]]), c: '#9aa0a8', m: 'steel', line: 0.7 },
    { p: box(150, g - 30, 250, g - 22), c: '#8a5a30', m: 'wood', line: 0.8 }, ...[160, 200, 240].map(x => ({ p: box(x - 4, g - 40, x + 4, g), c: '#7a4a24', m: 'wood', line: 0.8 })),
    ...(() => { lit(150, 170); return []; })(),
  ]);
  // 2. Хижина гномов: дом в холме, круглая дверь, труба, вагонетка с рудой, кирка
  bld('dwell_2', 'rampart', (f, g) => {
    const out = [];
    out.push({ p: box(214, 60, 244, 150), c: '#9a9480', m: 'horn', line: 1, lines: masonry(214, 60, 244, 150, 14, 15, 0.45, 2) }, { p: box(208, 52, 250, 64), c: '#6a665a', m: 'horn', line: 1 });
    out.push({ p: [P(6, g, 1), [20, 180], [80, 104], [160, 86], [240, 104], [296, 170], P(308, g, 1)], c: '#5aa040', m: 'fur', flow: -Math.PI / 2, furLen: 0.6, line: 1.2, lines: [{ p: [[60, 150], [120, 116]], w: 2, light: true, a: 0.5 }], sub: [{ p: [P(200, 80, 1), P(320, 150, 1), P(320, g + 4, 1), P(240, g + 4, 1)], c: '#3f7a30', m: 'flat', line: 0 }] });
    out.push({ e: [150, g - 58, 56, 56], c: '#9a9480', m: 'horn', line: 1.2, lines: voussoirs(150, g - 58, 52, 10) });
    out.push({ e: [150, g - 58, 42, 42], c: '#8a5a2a', m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [{ p: [[150, g - 100], [150, g - 16]], w: 2.4, a: 0.7 }, { p: [[122, g - 90], [122, g - 26]], w: 2, a: 0.5 }, { p: [[178, g - 90], [178, g - 26]], w: 2, a: 0.5 }], glint: [[168, g - 58, 4]] });
    out.push({ p: box(94, g - 14, 206, g), c: '#9a9480', m: 'horn', line: 1 });
    for (const x of [62, 238]) { out.push({ e: [x, 190, 22, 22], c: '#9a9480', m: 'horn', line: 1 }, { e: [x, 190, 15, 15], c: WIN, m: 'gem', gloss: 0.6, rim: 0, line: 1, lc: WIN_LC, lines: [{ p: [[x - 15, 190], [x + 15, 190]], w: 3, c: WIN_LC, a: 0.9 }, { p: [[x, 175], [x, 205]], w: 3, c: WIN_LC, a: 0.9 }] }); lit(x, 190); }
    out.push(...oreCart(272, g, 0.8, '#d0b050'), { p: tube([[232, g, 5], [254, g - 58, 5]]), c: '#8a6a44', m: 'wood', line: 0.6 }, { p: [P(234, g - 70, 1), [254, g - 64], P(278, g - 50, 1), [256, g - 58]], c: '#9aa0a8', m: 'steel', line: 0.8 });
    return out;
  });
  // 3. Усадьба эльфов: древо с помостом и домиком в кроне, верёвочная лестница, фонари
  bld('dwell_3', 'rampart', (f, g) => {
    const out = [];
    out.push(...trunk(180, g, 60, 32, '#7a5230', 0));
    out.push(...foliage(180, 86, 176, 86, 8, LEAF, 160));
    out.push({ p: box(70, 150, 290, 164), c: '#8a5a30', m: 'wood', flow: 0, line: 1.1 }, { p: tube([[92, 164, 5], [150, 210, 5]]), c: '#6a4a24', m: 'wood', line: 0.6 }, { p: tube([[268, 164, 5], [210, 210, 5]]), c: '#6a4a24', m: 'wood', line: 0.6 });
    out.push({ p: box(110, 94, 250, 150), c: RA.w, m: 'cloth', line: 1.1, lines: masonry(110, 94, 250, 150, 18, 28, 0.3, 2), sub: [{ p: box(222, 90, 254, 154), c: RA.d, m: 'flat', line: 0 }] });
    out.push(elfRoofHip(110, 250, 98, 58, RA.r, RA.rd));
    out.push(...rWin(140, 142, 10, 30), ...rWin(220, 142, 10, 30), ...door(180, 150, 14, 40, { ring: RA.ring, c: '#6a4a24' }));
    out.push({ p: box(70, 132, 290, 136), c: '#6a4a24', m: 'wood', line: 0.5, lines: Array.from({ length: 12 }, (_, i) => ({ p: [[72 + i * 19, 136], [72 + i * 19, 150]], w: 2.6, c: '#6a4a24', a: 1 })) });
    // верёвочная лестница
    out.push({ p: tube([[252, 164, 2], [262, g, 2]]), c: '#c8a870', m: 'cloth', line: 0 }, { p: tube([[272, 164, 2], [282, g, 2]]), c: '#c8a870', m: 'cloth', line: 0, lines: Array.from({ length: 6 }, (_, i) => ({ p: [[253 + i * 1.6, 182 + i * 20], [273 + i * 1.6, 182 + i * 20]], w: 3, c: '#8a6a3a', a: 1 })) });
    for (const x of [80, 280]) { out.push({ p: tube([[x, 164, 1.4], [x, 178, 1.4]]), c: IRON, m: 'steel', line: 0 }, { e: [x, 184, 5, 7], c: WIN, m: 'gem', gloss: 1, line: 0.8, lc: WIN_LC }); lit(x, 184); }
    return out;
  });
  // 4. Заколдованный источник: скала, водопад в каменную чашу, крылатая статуя
  bld('dwell_4', 'rampart', (f, g) => {
    const out = [];
    out.push(rock([P(40, g - 40, 1), [50, 150], P(90, 90, 1), [140, 70], P(200, 80, 1), [250, 110], P(280, 170, 1), P(290, g - 40, 1)], '#a8a090', { lines: [{ p: [[70, 160], [100, 130]], w: 2.4, a: 0.5 }, { p: [[240, 150], [260, 200]], w: 2.4, a: 0.5 }], sub: [{ p: [P(190, 60, 1), P(300, 120, 1), P(300, g, 1), P(230, g, 1)], c: '#76706a', m: 'flat', line: 0 }] }));
    out.push(...foliage(110, 84, 50, 20, 3, LEAF, 170), ...foliage(236, 108, 40, 16, 3, LEAF2, 171));
    out.push(fall(170, 100, g - 50, 22, '#9ad8f8'));
    // чаша
    out.push({ p: [P(40, g - 60, 1), P(300, g - 60, 1), [292, g - 30], P(270, g, 1), P(70, g, 1), [48, g - 30]], c: RA.w, m: 'cloth', line: 1.2, lines: [{ p: [[50, g - 44], [290, g - 44]], w: 2.4, a: 0.4 }], sub: [{ p: box(230, g - 64, 304, g + 4), c: RA.d, m: 'flat', line: 0 }] });
    out.push({ e: [170, g - 60, 130, 12], c: '#6ac8f0', m: 'gem', gloss: 1.2, line: 1, lc: '#2a6a8a', lines: [{ p: [[100, g - 62], [140, g - 62]], w: 2.4, light: true, a: 0.8 }] });
    lit(170, g - 64);
    // крылатая статуя на столпе
    out.push({ p: box(292, 120, 322, g), c: RA.w, m: 'cloth', line: 1, sub: [{ p: box(310, 116, 326, g + 4), c: RA.d, m: 'flat', line: 0 }] }, { p: box(286, 112, 328, 124), c: RA.gold, m: 'gold', line: 0.8 });
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const lf = K.leaf([307, 108], -Math.PI / 2 + s * (0.45 + i * 0.3), 44 - i * 6, 14); out.push({ p: lf.body, c: '#f4f0e8', m: 'feather', line: 0.8 }); }
    out.push(crystal(20, g, 8, 30, '#c8f0ff', -0.1), { e: [60, g - 90, 4, 4], c: '#ffffff', m: 'gem', line: 0 }, { e: [250, g - 110, 3, 3], c: '#ffffff', m: 'gem', line: 0 });
    return out;
  });
  // 5. Арки дендроидов: два узловатых живых дерева сплелись аркой, светящиеся глаза в коре
  bld('dwell_5', 'rampart', (f, g) => {
    const out = [];
    out.push(...foliage(200, 110, 190, 90, 7, LEAF, 180));
    for (const s of [-1, 1]) {
      const x0 = 200 + s * 130;
      out.push({ p: tube([[x0 + s * 12, g + 2, 62], [x0, g - 90, 46], [x0 - s * 10, 220, 38], [200 + s * 60, 140, 30], [200, 118, 26]]), c: '#6a4a2a', m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [{ p: [[x0 + s * 6, g - 20], [x0 - s * 4, 240], [200 + s * 64, 150]], w: 2.6, a: 0.5 }] });
      for (const k of [-1, 1]) out.push({ p: tube([[x0 + s * 14 + k * 16, g - 4, 16], [x0 + s * 30 + k * 34, g + 2, 8]]), c: '#5a3a1e', m: 'wood', line: 0.8 });
      // лицо в коре
      out.push({ e: [x0 - 10, g - 150, 7, 5], c: '#b8ff70', m: 'gem', gloss: 1.2, rim: 0, line: 0.8, lc: '#2a3a10' }, { e: [x0 + 10, g - 150, 7, 5], c: '#b8ff70', m: 'gem', gloss: 1.2, rim: 0, line: 0.8, lc: '#2a3a10' });
      out.push({ p: tube([[x0 - 12, g - 124, 3], [x0, g - 118, 4], [x0 + 12, g - 124, 3]]), c: '#2a1a0a', m: 'flat', line: 0 });
      lit(x0, g - 150);
    }
    out.push(...foliage(200, 150, 120, 44, 4, LEAF2, 181));
    out.push({ e: [200, g - 4, 70, 8], c: '#4a8a2a', m: 'fur', line: 0.6 });
    return out;
  });
  // 6. Поляна единорогов: светлые деревья в цвету, мраморная арка с рогом, светящийся пруд
  bld('dwell_6', 'rampart', (f, g) => {
    const out = [], BLOS = ['#9cc486', '#f0bcd4', '#f6d6e6', '#c4e4a8'];
    out.push(...tree(70, g - 30, 330, 76, BLOS, 190, { tw: 10, n: 6, bark: '#e8e4dc' }), ...tree(370, g - 30, 350, 80, BLOS, 191, { tw: 10, n: 6, bark: '#e8e4dc' }));
    out.push({ p: [[20, g], [60, g - 60], [200, g - 80], [360, g - 60], [420, g]], c: '#6ab04a', m: 'fur', flow: -Math.PI / 2, line: 1 });
    // арка
    out.push({ p: [P(110, g - 60, 1), P(110, 220, 1), [130, 150], [220, 110], [310, 150], P(330, 220, 1), P(330, g - 60, 1), P(294, g - 60, 1), P(294, 224, 1), [280, 180], [220, 150], [160, 180], P(146, 224, 1), P(146, g - 60, 1)], c: '#f4f2ee', m: 'cloth', gloss: 0.4, line: 1.2, lines: voussoirs(220, 230, 96, 9) });
    out.push({ p: tube([[220, 112, 12], [220, 60, 2]]), c: '#fff4d0', m: 'horn', gloss: 1, line: 0.8, lines: [0, 1, 2, 3].map(k => ({ p: [[214, 104 - k * 12], [226, 98 - k * 12]], w: 1.6, a: 0.5 })) });
    for (const x of [110, 330]) out.push(...vine([[x, g - 60], [x + 6, 300], [x - 4, 250], [x + 6, 200]], 192 + x, 4, '#f0a0c8'));
    // сияющий пруд под аркой
    out.push({ e: [220, g - 64, 70, 14], c: '#b8f4ff', m: 'gem', gloss: 1.3, rim: 0.4, line: 1, lc: '#4a8aaa' }, { p: [P(170, g - 70, 1), P(270, g - 70, 1), P(250, 240, 1), P(190, 240, 1)], c: 'rgba(255,255,255,0.3)', m: 'flat', line: 0 });
    lit(220, g - 90); lit(220, 200);
    // радуга над аркой
    for (const [r, c] of [[150, '#e85a5a'], [142, '#f0c040'], [134, '#5ac05a'], [126, '#5a8ae8']]) out.push({ p: Array.from({ length: 9 }, (_, i) => [220 - Math.cos(i / 8 * Math.PI) * r, 190 - Math.sin(i / 8 * Math.PI) * r * 0.9]).concat(Array.from({ length: 9 }, (_, i) => [220 + Math.cos(i / 8 * Math.PI) * (r - 8), 190 - Math.sin((8 - i) / 8 * Math.PI) * (r - 8) * 0.9])), c, m: 'flat', op: 0.45, line: 0 });
    return out;
  });
  // 7. Драконьи утёсы: две скалы-клыка, пещера с кладом, кристаллы, водопад
  bld('dwell_7', 'rampart', (f, g) => {
    const out = [];
    out.push(rock([P(10, g, 1), [30, 380], P(70, 250, 1), P(110, 120, 1), P(150, 20, 1), [180, 100], P(220, 160, 1), P(260, 110, 1), P(300, 60, 1), [340, 110], P(380, 40, 1), P(420, 150, 1), [470, 250], P(510, 330, 1), P(530, g, 1)], '#9a927e', {
      lines: [{ p: [[110, 200], [150, 140], [170, 200]], w: 3, a: 0.5 }, { p: [[380, 120], [400, 220], [440, 300]], w: 3, a: 0.5 }, { p: [[60, 380], [120, 340]], w: 2.6, a: 0.45 }, { p: [[300, 160], [290, 240]], w: 2.6, a: 0.45 }],
      sub: [{ p: [P(300, 40, 1), P(560, 300, 1), P(560, g + 4, 1), P(380, g + 4, 1), [330, 200]], c: '#6e6858', m: 'flat', line: 0 }, { p: [P(0, g + 4, 1), P(80, 240, 1), P(150, 10, 1), P(170, 90, 1), [110, 260], P(90, g + 4, 1)], c: '#bab29c', m: 'flat', line: 0 }] }));
    out.push(...foliage(120, 300, 50, 20, 3, LEAF, 200), ...foliage(450, 340, 50, 20, 3, LEAF2, 201), ...foliage(300, 90, 30, 12, 2, LEAF, 202));
    // пещера с золотым кладом
    out.push({ p: [P(200, g - 20, 1), [196, 330], [230, 270], [270, 256], [320, 270], [350, 330], P(350, g - 20, 1)], c: '#1e1612', m: 'cloth', ao: 1.4, line: 1.2 });
    out.push({ p: [P(214, g - 20, 1), [240, g - 50], [275, g - 62], [310, g - 50], P(338, g - 20, 1)], c: '#e8b830', m: 'gold', gloss: 1.2, line: 0.8, glint: [[250, g - 46, 3], [290, g - 54, 3], [320, g - 36, 2.5]] });
    lit(275, g - 60);
    // зелёные глаза в темноте пещеры
    out.push({ e: [258, 310, 7, 4], c: '#a8ff60', m: 'gem', gloss: 1.2, rim: 0, line: 0 }, { e: [290, 310, 7, 4], c: '#a8ff60', m: 'gem', gloss: 1.2, rim: 0, line: 0 });
    lit(274, 310);
    out.push(fall(440, 180, g - 30, 14, RA.water), pool(440, g - 24, 60, 12, RA.water));
    out.push(crystal(170, g - 10, 14, 60, '#60e0a0', -0.1), crystal(190, g - 6, 10, 40, '#a0ffd0', 0.2), crystal(380, g - 10, 12, 50, '#60e0a0', 0.15));
    out.push({ p: box(190, g - 22, 360, g), c: '#8a8270', m: 'horn', line: 1 });
    return out;
  });

  /* ---------- укрепления: эльфийские ворота ---------- */
  const RW = '#cfc3a2', RWD = '#8f8062';
  function rFortWall(g, top) {
    return [wallBox(10, top, 970, g, { c: RW, d: RWD, shadeK: 0.02, rh: 22, bw: 44, ma: 0.3 }), merlons(6, 974, top - 2, 20, 40, RW, { k: 0.5 }), { p: box(10, g - 26, 970, g), c: RWD, m: 'cloth', line: 1 }];
  }
  function rGatehouse(g, top, tall) {
    const out = [];
    out.push(...tree(360, top + 40, 240, 70, LEAF, 210, { tw: 12, n: 5 }), ...tree(620, top + 40, 240, 70, LEAF2, 211, { tw: 12, n: 5 }));
    out.push(wallBox(410, top, 570, g, { c: RW, d: RWD, rh: 22, bw: 36 }), elfRoofHip(410, 570, top + 4, 40, RA.r, RA.rd));
    out.push(...gate(490, g, 40, Math.min(136, (g - top) * 0.64), { ring: RA.ring, rw: 14, pointed: true, grate: false, door: '#6a4a24' }));
    out.push({ e: [490, g - Math.min(136, (g - top) * 0.64) * 0.62, 12, 12], c: RA.gold, m: 'gold', line: 0.8 });
    for (const s of [-1, 1]) out.push(...tower(490 + s * 100, g, 30, g - top + (tall || 40), rT({ roofH: 96, win: [top + 40], winW: 7, winH: 22, flag: RA.r, flagLeft: s < 0 })), ...vine([[490 + s * 84, g], [490 + s * 90, g - 60], [490 + s * 82, g - 110]], 212 + s, 3));
    return out;
  }
  bld('fort', 'rampart', (f, g) => [...rFortWall(g, 150), ...rGatehouse(g, 96, 30)]);
  bld('citadel', 'rampart', (f, g) => [...rFortWall(g, 270),
    ...tower(110, g, 58, 320, rT({ roofH: 140, win: [220, 310], winW: 10, winH: 30, flag: RA.r, flagLeft: true })),
    ...tower(870, g, 58, 320, rT({ roofH: 140, win: [220, 310], winW: 10, winH: 30, flag: RA.r })),
    ...rGatehouse(g, 216, 50)]);
  bld('castle', 'rampart', (f, g) => [
    ...foliage(490, 150, 180, 80, 6, LEAF, 220),
    ...tower(490, 430, 62, 300, rT({ roofH: 150, win: [230, 320], winW: 12, winH: 36, flag: RA.r })),
    ...rFortWall(g, 460),
    ...tower(110, g, 60, 350, rT({ roofH: 150, win: [390, 480], winW: 10, winH: 30, flag: RA.r, flagLeft: true })),
    ...tower(870, g, 60, 350, rT({ roofH: 150, win: [390, 480], winW: 10, winH: 30, flag: RA.r })),
    ...rGatehouse(g, 400, 70)]);

  /* =====================================================================================
     БАШНЯ — белый мрамор в снегу, золотые луковицы и купола, синие вставки,
     обсерватории, шестерни и механизмы, кристаллы-самоцветы
     ===================================================================================== */
  const TW = { w: '#eef2f7', d: '#a9b7c8', ring: '#d6dfea', g: '#e2b23c', gd: '#9a6a1a', b: '#3f6cc0', bd: '#23407e', slate: '#5a6a8a', slateD: '#35405a' };
  const tT = o => Object.assign({ wall: TW.w, shade: TW.d, roof: TW.g, roofD: TW.gd, ring: TW.ring, top: 'onion', rh: 26, ma: 0.22, snow: true }, o);
  const tW = (x0, y0, x1, y1, o) => wallBox(x0, y0, x1, y1, Object.assign({ c: TW.w, d: TW.d, rh: 26, bw: 46, ma: 0.22 }, o));
  const tWin = (cx, y1, w, h) => win(cx, y1, w, h, { sill: TW.ring });
  const tDoor = (cx, g, w, h, lamp) => door(cx, g, w, h, { ring: TW.b, c: '#5a4a6a', lamp });
  /** Карниз с синим поясом и снегом поверху. */
  const tCornice = (x0, x1, y) => [{ p: box(x0, y - 6, x1, y + 6), c: TW.ring, m: 'cloth', line: 1, lines: [{ p: [[x0, y + 2], [x1, y + 2]], w: 4, c: TW.b, a: 0.9 }] }, snow(x0, x1, y - 5, 8)];
  /** Сугробы у основания. */
  const drift = (x0, x1, G) => ({ p: [P(x0, G + 2, 1), [x0 + (x1 - x0) * 0.2, G - 10], [x0 + (x1 - x0) * 0.5, G - 5], [x0 + (x1 - x0) * 0.8, G - 12], P(x1, G + 2, 1)], c: '#fbfdff', m: 'cloth', line: 0.7, lc: '#90a8c4', belly: 0.5 });
  /** Барабан с луковицей: основание y, полуширина барабана hw. */
  function drumOnion(cx, y, hw, dh, oh, c, cd) {
    const out = [tW(cx - hw, y - dh, cx + hw, y, { rh: 0 }), ...tCornice(cx - hw - 4, cx + hw + 4, y - dh)];
    for (let x = cx - hw + hw / 3; x < cx + hw - 2; x += hw * 2 / 3) out.push(...win(x, y - 8, Math.max(5, hw * 0.1), dh * 0.55, { cross: false }));
    out.push(...onion(cx, y - dh - 4, hw * 1.02, oh, c || TW.g, cd || TW.gd));
    return out;
  }

  /* ---------- ратуша ---------- */
  bld('hall_1', 'tower', (f, g) => [
    tW(84, 226, 336, g), ...tCornice(80, 340, 226),
    ...drumOnion(210, 222, 58, 60, 112),
    ...tWin(126, 320, 12, 42), ...tWin(294, 320, 12, 42),
    ...tDoor(210, g, 26, 84, [172, 300]),
    drift(70, 180, g), drift(240, 350, g),
  ]);
  bld('hall_2', 'tower', (f, g) => [
    ...tower(66, g, 24, 330, tT({ roofH: 56, win: [180, 260], winW: 6, winH: 20 })), ...tower(394, g, 24, 330, tT({ roofH: 56, win: [180, 260], winW: 6, winH: 20 })),
    tW(96, 264, 364, g), ...tCornice(92, 368, 264),
    ...drumOnion(230, 258, 70, 70, 130),
    ...tWin(140, 350, 12, 42), ...tWin(320, 350, 12, 42), ...tWin(180, 330, 9, 30), ...tWin(280, 330, 9, 30),
    ...steps(230, g, 42, 36, 2, 6, TW.ring), ...tDoor(230, g - 12, 28, 92),
    drift(50, 150, g), drift(310, 410, g),
  ]);
  bld('hall_3', 'tower', (f, g) => {
    const out = [];
    out.push(...tower(40, g, 22, 330, tT({ roofH: 52, win: [200, 290], winW: 6, winH: 18 })), ...tower(480, g, 22, 330, tT({ roofH: 52, win: [200, 290], winW: 6, winH: 18 })));
    out.push(tW(170, 200, 350, 300), ...tCornice(166, 354, 200));
    for (const x of [200, 240, 280, 320]) out.push(...win(x, 280, 8, 44, { cross: false }));
    out.push(...dome(260, 194, 94, 90, TW.g, TW.gd), ...onion(260, 110, 20, 44, TW.g, TW.gd));
    out.push(tW(62, 296, 458, g), ...tCornice(58, 462, 296));
    out.push(...tower(110, 300, 28, 90, tT({ roofH: 56, win: [], mason: false, roof: TW.b, roofD: TW.bd })), ...tower(410, 300, 28, 90, tT({ roofH: 56, win: [], mason: false, roof: TW.b, roofD: TW.bd })));
    // портик: фронтон на четырёх колоннах
    out.push({ p: [P(176, 330, 1), P(260, 290, 1), P(344, 330, 1)], c: TW.w, m: 'cloth', line: 1.2, sub: [{ p: [P(264, 286, 1), P(350, 332, 1), P(300, 332, 1)], c: TW.d, m: 'flat', line: 0 }] }, { p: box(170, 328, 350, 340), c: TW.g, m: 'gold', line: 1 }, snow(176, 344, 330, 5));
    out.push({ p: box(186, 340, 334, g - 14), c: '#3a3848', m: 'cloth', line: 1 }, ...tDoor(260, g - 14, 26, 84));
    for (const x of [196, 232, 288, 324]) out.push(...column(x, 340, g - 14, 8, TW.w, TW.d));
    out.push(...tWin(110, 400, 11, 38), ...tWin(410, 400, 11, 38), ...tWin(110, 440, 9, 20), ...tWin(410, 440, 9, 20));
    out.push(...steps(260, g, 96, 84, 2, 7, TW.ring), drift(20, 140, g), drift(380, 500, g));
    return out;
  });
  bld('hall_4', 'tower', (f, g) => {
    const out = [];
    // большой купол позади
    out.push(tW(120, 300, 440, 360, { rh: 0 }), ...dome(280, 302, 150, 120, TW.g, TW.gd));
    out.push(...tower(36, g, 22, 390, tT({ roofH: 54, win: [260, 360, 460], winW: 6, winH: 18 })), ...tower(524, g, 22, 390, tT({ roofH: 54, win: [260, 360, 460], winW: 6, winH: 18 })));
    out.push(...tower(140, g, 34, 330, tT({ roofH: 76, roof: TW.b, roofD: TW.bd, win: [330, 420], winW: 8, winH: 26 })), ...tower(420, g, 34, 330, tT({ roofH: 76, roof: TW.b, roofD: TW.bd, win: [330, 420], winW: 8, winH: 26 })));
    // главная башня с луковицей
    out.push(...tower(280, g, 58, 400, tT({ roofH: 118, win: [250, 330], winW: 12, winH: 38, rh: 30 })));
    out.push({ p: box(214, 400, 346, 410), c: TW.g, m: 'gold', line: 1 }, ...rose(280, 370, 20, { ring: TW.ring, lc: '#2a3a6a' }));
    out.push(tW(170, 420, 390, g), ...tCornice(166, 394, 420));
    out.push(...tWin(200, 500, 10, 36), ...tWin(360, 500, 10, 36));
    out.push(...steps(280, g, 80, 60, 3, 7, TW.ring), ...tDoor(280, g - 21, 30, 98));
    out.push(drift(10, 120, g), drift(440, 550, g));
    return out;
  });

  /* ---------- гильдия магов: мраморная башня-обсерватория с телескопом ---------- */
  function towerGuild(L) {
    bld('guild_' + L, 'tower', (f, g, cx) => {
      const top = 190, floors = L + 1, fh = (g - 30 - top) / floors, hw0 = 56, hw1 = 44, out = [];
      if (L >= 4) for (const s of [-1, 1]) out.push(...tower(cx + s * 78, g - 28, 20, 300, tT({ roofH: 50, win: [g - 200], winW: 6, winH: 18 })));
      out.push({ p: box(cx - hw0 - 16, g - 30, cx + hw0 + 16, g), c: TW.d, m: 'cloth', line: 1.2, lines: masonry(cx - hw0 - 16, g - 30, cx + hw0 + 16, g, 15, 30, 0.3, 2) });
      out.push({ p: [P(cx - hw1, top, 1), P(cx + hw1, top, 1), P(cx + hw0, g - 30, 1), P(cx - hw0, g - 30, 1)], c: TW.w, m: 'cloth', line: 1.2, lines: masonry(cx - hw0, top, cx + hw0, g - 30, 28, 44, 0.2, 2),
        sub: [{ p: [P(cx + hw1 * 0.45, top - 2, 1), P(cx + hw1 + 4, top - 2, 1), P(cx + hw0 + 4, g, 1), P(cx + hw0 * 0.45, g, 1)], c: TW.d, m: 'flat', line: 0 }] });
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh, hw = hw1 + (hw0 - hw1) * (y - top) / (g - top); out.push({ p: box(cx - hw - 7, y - 5, cx + hw + 7, y + 5), c: TW.g, m: 'gold', line: 1 }, snow(cx - hw - 7, cx + hw + 7, y - 4, 5)); }
      for (let i = 1; i < floors; i++) { const y = g - 30 - i * fh - 14; out.push(...win(cx, y, 13, Math.min(56, fh * 0.55), { c: i % 2 ? '#9ad0ff' : WIN, lc: '#1a2a4a' })); }
      out.push(...tDoor(cx, g - 30, 24, Math.min(84, fh * 0.75)));
      // обсерватория: барабан, синий купол с прорезью, телескоп
      out.push({ p: box(cx - hw1 - 10, top - 10, cx + hw1 + 10, top + 6), c: TW.g, m: 'gold', line: 1 });
      if (L >= 2) out.push({ p: box(cx - hw1 - 16, top - 4, cx + hw1 + 16, top + 2), c: TW.g, m: 'gold', line: 0.6, lines: Array.from({ length: 9 }, (_, i) => ({ p: [[cx - hw1 - 14 + i * (hw1 * 2 + 28) / 8, top - 4], [cx - hw1 - 14 + i * (hw1 * 2 + 28) / 8, top - 22]], w: 2.4, c: TW.gd, a: 0.9 })) });
      out.push(...dome(cx, top - 8, hw1 + 6, 62 + L * 4, TW.b, TW.bd, { m: 'steel' }), snowTip(cx - 4, top - 70 - L * 4, 18, 14));
      out.push({ p: box(cx - 4, top - 66 - L * 4, cx + 4, top - 14), c: '#1a2440', m: 'flat', line: 0.6 });
      out.push({ p: tube([[cx + 4, top - 36, 12], [cx + 46 + L * 4, top - 76 - L * 6, 8]]), c: TW.g, m: 'gold', gloss: 1, line: 0.9 }, { e: [cx + 48 + L * 4, top - 78 - L * 6, 5, 5], c: '#9ad0ff', m: 'gem', line: 0.6 });
      if (L >= 3) { const ax = cx - 34, ay = top - 96; out.push({ p: tube([[ax, top - 50, 3], [ax, ay + 18, 3]]), c: TW.g, m: 'gold', line: 0.4 }, { e: [ax, ay, 16, 16], c: 'rgba(0,0,0,0)', m: 'flat', line: 0, lines: [{ p: ell(ax, ay, 16, 16, 14).concat([[ax + 16, ay]]), w: 2.4, c: TW.g, a: 1 }, { p: ell(ax, ay, 16, 6, 14).concat([[ax + 16, ay]]), w: 2.2, c: TW.g, a: 1 }, { p: ell(ax, ay, 6, 16, 14).concat([[ax + 6, ay]]), w: 2.2, c: TW.g, a: 1 }] }, { e: [ax, ay, 5, 5], c: '#9ad0ff', m: 'gem', line: 0.4 }); }
      lit(cx, top - 30);
      return out;
    });
  }
  for (let i = 1; i <= 4; i++) towerGuild(i);

  /* ---------- таверна: заснеженный дом с крутой сланцевой крышей и золотой башенкой ---------- */
  function snowRoof(x0, x1, y, h, e, inset) {
    return [hip(x0, x1, y, h, e, inset, TW.slate, TW.slateD), { p: [P(x0 - e + inset - 6, y - h + 2, 1), P(x1 + e - inset + 6, y - h + 2, 1), [x1 + e - inset - 6, y - h + 16], [(x0 + x1) / 2 + 20, y - h + 10], [(x0 + x1) / 2 - 10, y - h + 18], [x0 - e + inset + 6, y - h + 12]], c: '#fbfdff', m: 'cloth', line: 0.7, lc: '#90a8c4' }, snow(x0 - e, x1 + e, y, 6)];
  }
  bld('tavern', 'tower', (f, g) => {
    const out = [];
    out.push({ p: box(80, 60, 110, 170), c: TW.d, m: 'cloth', line: 1.1, lines: masonry(80, 60, 110, 170, 16, 16, 0.4, 2) }, { p: box(74, 52, 116, 64), c: TW.ring, m: 'cloth', line: 1 }, snow(74, 116, 53, 5));
    out.push(tW(30, 180, 280, g), ...snowRoof(30, 280, 184, 100, 14, 80));
    out.push(...tower(300, g, 26, 230, tT({ roofH: 60, win: [150, 230], winW: 6, winH: 20 })));
    out.push(...sqwin(80, 250, 14, 18, { shutters: TW.b, sill: TW.ring }), ...sqwin(230, 250, 14, 18, { shutters: TW.b, sill: TW.ring }));
    out.push(...tDoor(155, g, 24, 80, [120, 270]));
    out.push({ p: tube([[200, 214, 5], [248, 214, 5]]), c: IRON, m: 'steel', line: 0.8 }, { p: box(222, 222, 256, 260), c: TW.b, m: 'cloth', line: 1.1, sub: [{ p: box(230, 232, 244, 252), c: GOLD, m: 'gold', line: 0.6 }, { e: [247, 242, 4, 6], c: TW.b, m: 'flat', line: 0 }, { e: [237, 231, 8, 3.4], c: '#fff8e0', m: 'flat', line: 0 }] });
    out.push(barrel(22, g, 14, 36), drift(10, 140, g), drift(190, 340, g));
    return out;
  });

  /* ---------- кузница: горн, труба с золотым колпаком, шестерня-вывеска ---------- */
  bld('blacksmith', 'tower', (f, g) => {
    const out = [];
    out.push({ p: trap(246, 50, 200, 20, 26), c: TW.d, m: 'cloth', line: 1.1, lines: masonry(220, 50, 272, 200, 16, 20, 0.4, 2) }, ...onion(246, 52, 26, 36, TW.g, TW.gd, { spike: false }));
    out.push(tW(30, 206, 276, g), ...snowRoof(30, 276, 210, 70, 14, 50));
    out.push(...forge(96, g, 40, 116, false));
    out.push(...tDoor(222, g, 20, 78, [196, 300]));
    out.push(...gear(170, 256, 22, 10, TW.g));
    out.push(anvil(300, g, 0.85), drift(0, 50, g), drift(250, 330, g));
    return out;
  });

  /* ---------- рынок: аркада под плоской кровлей, три луковки, сине-золотые навесы ---------- */
  bld('market', 'tower', (f, g) => {
    const out = [];
    out.push(tW(20, 120, 388, g), ...tCornice(16, 392, 120));
    for (const x of [80, 204, 328]) out.push(...drumOnion(x, 118, 26, 26, 54, x === 204 ? TW.g : TW.b, x === 204 ? TW.gd : TW.bd));
    for (const [cx, ware] of [[80, '#c8322a'], [204, '#e8c040'], [328, '#9ad0ff']]) {
      out.push({ p: arch(cx, g, 38, 90), c: '#2a2438', m: 'cloth', ao: 1.2, line: 1.2 });
      out.push({ p: box(cx - 34, g - 28, cx + 34, g), c: '#8a5a30', m: 'wood', flow: 0, line: 1 }, ...[-18, 0, 18].map(dx => ware === '#9ad0ff' ? crystal(cx + dx, g - 26, 7, 22, ware) : { e: [cx + dx, g - 34, 10, 8], c: ware, m: 'skin', line: 0.8 }));
      const st = []; for (let x = cx - 46; x < cx + 46; x += 18) st.push({ p: [P(x, g - 112, 1), P(x + 9, g - 112, 1), P(x + 11, g - 88, 1), P(x + 2, g - 88, 1)], c: TW.g, m: 'flat', line: 0 });
      out.push({ p: [P(cx - 46, g - 114, 1), P(cx + 46, g - 114, 1), P(cx + 52, g - 88, 1), [cx + 34, g - 82], [cx + 17, g - 88], [cx, g - 82], [cx - 17, g - 88], [cx - 34, g - 82], P(cx - 52, g - 88, 1)], c: TW.b, m: 'cloth', line: 1.2, sub: st });
      lit(cx, g - 60);
    }
    out.push(drift(0, 60, g), drift(350, 407, g));
    return out;
  });

  /* ---------- хранилище: круглая сокровищница с золотым куполом и друзой самоцветов ---------- */
  bld('silo', 'tower', (f, g) => {
    const out = [];
    out.push(...tower(160, g, 76, 190, tT({ top: 'dome', roofH: 64, win: [], rh: 30 })));
    out.push({ p: box(80, g - 110, 240, g - 100), c: TW.b, m: 'cloth', line: 1 });
    // друза на куполе
    for (const [dx, w, h, c, l] of [[-34, 12, 60, '#8a5ae0', -0.25], [34, 12, 64, '#5a9ae8', 0.25], [-14, 14, 96, '#b070f0', -0.08], [16, 14, 88, '#70b8ff', 0.1], [0, 18, 124, '#c890ff', 0]]) out.push(crystal(160 + dx, 150, w, h, c, l));
    lit(160, 90);
    out.push(...tDoor(160, g, 24, 80));
    out.push(...win(106, g - 130, 8, 26, { cross: false }), ...win(214, g - 130, 8, 26, { cross: false }));
    // сундук с камнями
    out.push({ p: box(236, g - 40, 300, g), c: '#8a5a30', m: 'wood', flow: 0, line: 1.1, lines: [{ p: [[236, g - 26], [300, g - 26]], w: 3, c: GOLD, a: 0.9 }] }, crystal(252, g - 38, 7, 20, '#b070f0', -0.1), crystal(270, g - 38, 8, 26, '#70e0a0', 0), crystal(288, g - 38, 7, 18, '#ff7090', 0.1));
    out.push(drift(20, 130, g), drift(200, 240, g));
    return out;
  });

  /* ---------- Библиотека: портик с колоннами, золотой купол, открытые двери и полки с книгами ---------- */
  bld('special', 'tower', (f, g) => {
    const out = [];
    out.push(tW(60, 110, 220, 150, { rh: 0 }), ...dome(140, 112, 76, 70, TW.g, TW.gd), ...onion(140, 44, 12, 26, TW.g, TW.gd));
    out.push(tW(20, 150, 260, g - 24));
    out.push({ p: [P(14, 152, 1), P(140, 100, 1), P(266, 152, 1)], c: TW.w, m: 'cloth', line: 1.2, sub: [{ p: [P(144, 96, 1), P(272, 154, 1), P(200, 154, 1)], c: TW.d, m: 'flat', line: 0 }] }, snow(40, 240, 140, 5), { p: box(10, 150, 270, 160), c: TW.g, m: 'gold', line: 1 });
    out.push({ e: [140, 132, 10, 10], c: TW.b, m: 'gem', line: 0.8 });
    // двери настежь: полки с разноцветными корешками
    const spines = []; for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) spines.push({ p: [[112 + i * 6.4, 190 + r * 24], [112 + i * 6.4, 206 + r * 24]], w: 4.6, c: ['#b02a2a', '#2a5ab0', '#2a8a3a', '#c8a030', '#6a2a8a'][(i + r * 2) % 5], a: 1 });
    out.push({ p: box(108, 176, 172, g - 24), c: '#5a3a20', m: 'wood', line: 1.1, lines: spines.concat([0, 1, 2].map(r => ({ p: [[108, 208 + r * 24], [172, 208 + r * 24]], w: 2.4, c: '#3a2410', a: 1 }))) });
    lit(140, 210);
    for (const s of [-1, 1]) out.push({ p: [P(140 + s * 32, 176, 1), P(140 + s * 46, 170, 1), P(140 + s * 46, g - 20, 1), P(140 + s * 32, g - 24, 1)], c: '#5a4a6a', m: 'wood', line: 1 });
    for (const x of [36, 76, 204, 244]) out.push(...column(x, 160, g - 24, 8, TW.w, TW.d));
    out.push(...steps(140, g, 130, 118, 2, 12, TW.ring), drift(0, 60, g - 22), drift(220, 280, g - 22));
    return out;
  });

  /* ---------- жилища ---------- */
  // 1. Мастерская гремлинов: цех с шестернями, трубы, пар
  bld('dwell_1', 'tower', (f, g) => {
    const out = [];
    out.push({ p: tube([[176, 110, 12], [176, 60, 12], [210, 40, 10]]), c: '#8a909a', m: 'steel', line: 0.8 }, { p: box(150, 40, 172, 110), c: TW.d, m: 'cloth', line: 1 });
    out.push(tW(20, 116, 200, g, { rh: 22, bw: 34 }), ...snowRoof(20, 200, 120, 60, 12, 40));
    out.push(...gear(140, 164, 26, 10, TW.g), ...gear(176, 196, 14, 8, '#b0b8c4'));
    out.push({ p: tube([[200, 150, 8], [230, 150, 8], [230, 210, 8]]), c: '#b87a3a', m: 'gold', line: 0.8 });
    out.push(...gear(226, g - 38, 36, 12, TW.g));
    out.push(...tDoor(62, g, 20, 60), ...sqwin(140, 236, 13, 14));
    lit(62, 210);
    out.push(drift(0, 90, g), drift(150, 260, g));
    return out;
  });
  // 2. Парапет горгулий: стена с зубцами на арках, столпы с изваяниями горгулий
  function gargoyle(x, y, s) {
    const c = '#6a6e78';
    return [{ p: [P(x - 22 * s, y, 1), [x - 26 * s, y - 16 * s], P(x - 42 * s, y - 42 * s, 1), [x - 26 * s, y - 36 * s], P(x - 14 * s, y - 40 * s, 1), [x - 4 * s, y - 48 * s], P(x + 8 * s, y - 44 * s, 1), [x + 22 * s, y - 36 * s], P(x + 42 * s, y - 42 * s, 1), [x + 28 * s, y - 16 * s], P(x + 22 * s, y, 1)], c, m: 'horn', gloss: 0.3, line: 1 },
      { e: [x, y - 44 * s, 11 * s, 10 * s], c, m: 'horn', gloss: 0.3, line: 1, lines: [{ p: [[x - 6 * s, y - 45 * s], [x - 2 * s, y - 45 * s]], w: 2, c: '#ff7a3a', a: 1 }, { p: [[x + 2 * s, y - 45 * s], [x + 6 * s, y - 45 * s]], w: 2, c: '#ff7a3a', a: 1 }] },
      { p: tube([[x - 8 * s, y - 52 * s, 4 * s], [x - 12 * s, y - 64 * s, 1.5 * s]]), c, m: 'horn', line: 0.6 }, { p: tube([[x + 8 * s, y - 52 * s, 4 * s], [x + 12 * s, y - 64 * s, 1.5 * s]]), c, m: 'horn', line: 0.6 }];
  }
  bld('dwell_2', 'tower', (f, g) => {
    const out = [];
    out.push(tW(20, 130, 290, g), merlons(16, 294, 128, 18, 30, TW.w, { k: 0.52 }), ...merlonSnow(16, 294, 128, 18, 30, 0.52));
    for (const x of [74, 155, 236]) out.push({ p: arch(x, g, 26, 80), c: '#2a2438', m: 'cloth', ao: 1.1, line: 1.1 });
    for (const x of [44, 266]) { out.push({ p: box(x - 18, 60, x + 18, 130), c: TW.w, m: 'cloth', line: 1, sub: [{ p: box(x + 6, 56, x + 22, 134), c: TW.d, m: 'flat', line: 0 }] }, { p: box(x - 22, 52, x + 22, 62), c: TW.g, m: 'gold', line: 0.8 }, ...gargoyle(x, 52, 0.9)); }
    out.push(...banner(155, 146, 16, 52, TW.b, 'star'));
    out.push(...win(114, 200, 7, 24, { cross: false }), ...win(196, 200, 7, 24, { cross: false }), drift(0, 120, g), drift(190, 313, g));
    return out;
  });
  // 3. Фабрика големов: цех с золотым куполом, горн-печь, большая шестерня, заводская труба
  bld('dwell_3', 'tower', (f, g) => {
    const out = [];
    out.push({ p: box(292, 20, 326, 200), c: '#8a909a', m: 'steel', line: 1.1, lines: [40, 90, 140].map(y => ({ p: [[292, y], [326, y]], w: 4, c: IRON, a: 0.9 })) }, { p: box(286, 12, 332, 26), c: TW.g, m: 'gold', line: 1 });
    out.push(tW(20, 130, 300, g), ...tCornice(16, 304, 130));
    out.push(...drumOnion(160, 126, 56, 40, 80));
    out.push(...gear(80, 196, 40, 12, '#9aa2ae'));
    out.push({ p: box(128, 196, 244, g), c: '#3a3a44', m: 'steel', line: 1.2, lines: [0, 1, 2, 3].map(k => ({ p: [[128, 212 + k * 20], [244, 212 + k * 20]], w: 2, a: 0.5 })) }, ...forge(186, g, 40, 70, false));
    // голем-страж у ворот
    out.push({ p: box(256, g - 70, 290, g - 20), c: '#8a8478', m: 'horn', line: 1 }, { p: box(262, g - 90, 284, g - 70), c: '#8a8478', m: 'horn', line: 1, lines: [{ p: [[266, g - 80], [270, g - 80]], w: 2.4, c: '#7ad0ff', a: 1 }, { p: [[276, g - 80], [280, g - 80]], w: 2.4, c: '#7ad0ff', a: 1 }] }, { p: box(258, g - 20, 270, g), c: '#7a7468', m: 'horn', line: 0.8 }, { p: box(276, g - 20, 288, g), c: '#7a7468', m: 'horn', line: 0.8 });
    out.push(drift(0, 110, g), drift(300, 353, g));
    return out;
  });
  // 4. Башня магов: высокая стройная башня под сине-фиолетовым шпилем со звёздами, полумесяц
  bld('dwell_4', 'tower', (f, g) => {
    const out = [];
    out.push(tW(40, 200, 120, g, { rh: 22, bw: 30 }), ...snowRoof(40, 120, 204, 40, 8, 26));
    out.push(...tower(190, g, 46, 216, tT({ top: 'cone', roof: '#5a4ab0', roofD: '#32286e', roofH: 96, win: [150, 220], winW: 9, winH: 28, eave: 12, snow: false })));
    for (const [x, y] of [[176, 30], [196, 48], [180, 60], [204, 22]]) out.push({ p: star(x, y + 26, 6, 2.6, 4), c: '#fff0a0', m: 'gem', line: 0 });
    out.push({ p: tube([[190, -16, 3], [190, -36, 2]]), c: GOLD, m: 'gold', line: 0.4 }, { p: [[178, -54], [190, -64], [202, -58], [194, -54], [190, -48], [196, -42], [184, -42]], c: '#f0d060', m: 'gold', gloss: 1, line: 0.6 });
    out.push({ p: box(136, 100, 244, 110), c: TW.g, m: 'gold', line: 1, lines: Array.from({ length: 10 }, (_, i) => ({ p: [[140 + i * 11.5, 100], [140 + i * 11.5, 84]], w: 2.2, c: TW.gd, a: 1 })) }, snow(136, 244, 100, 5));
    out.push(...tDoor(190, g, 20, 64), ...sqwin(80, 250, 11, 13));
    out.push(drift(20, 130, g), drift(240, 330, g));
    return out;
  });
  // 5. Алтарь желаний: мраморный помост, золотой алтарь, лампа с джинновым дымком
  bld('dwell_5', 'tower', (f, g) => {
    const out = [];
    out.push(...tower(56, g, 26, 250, tT({ roofH: 70, win: [220], winW: 7, winH: 22 })), ...tower(344, g, 26, 250, tT({ roofH: 70, win: [220], winW: 7, winH: 22 })));
    out.push({ p: [P(90, 250, 1), P(90, 130, 1), [120, 70], [200, 40], [280, 70], P(310, 130, 1), P(310, 250, 1), P(282, 250, 1), P(282, 140, 1), [260, 96], [200, 76], [140, 96], P(118, 140, 1), P(118, 250, 1)], c: TW.b, m: 'cloth', gloss: 0.4, line: 1.2, lines: voussoirs(200, 150, 96, 9) });
    out.push(...steps(200, g, 170, 110, 4, 22, TW.ring));
    // алтарь
    out.push({ p: box(150, 216, 250, 300), c: TW.g, m: 'gold', gloss: 0.8, line: 1.2, lines: [{ p: [[160, 234], [240, 234]], w: 2.4, a: 0.5 }, { p: [[160, 282], [240, 282]], w: 2.4, a: 0.5 }] }, { p: box(140, 206, 260, 218), c: TW.g, m: 'gold', line: 1 });
    // лампа и дымок
    out.push({ p: [P(170, 206, 1), [174, 190], [196, 184], [220, 190], [240, 182], P(254, 176, 1), [238, 196], P(226, 206, 1)], c: '#f0c040', m: 'gold', gloss: 1.2, line: 0.9 });
    out.push({ p: tube([[206, 184, 8], [196, 150, 14], [214, 110, 20], [196, 70, 26], [208, 40, 14]]), c: '#8ab8ff', m: 'gem', op: 0.55, gloss: 0.6, rim: 0, line: 0.6, lc: '#4a6ab0' });
    out.push({ p: star(208, 40, 10, 4, 4), c: '#ffffff', m: 'gem', line: 0 }, { p: star(176, 110, 7, 3, 4), c: '#ffffff', m: 'gem', line: 0 }, { p: star(236, 140, 6, 2.6, 4), c: '#ffffff', m: 'gem', line: 0 });
    lit(206, 190); lit(200, 100);
    out.push(drift(0, 90, g), drift(310, 400, g));
    return out;
  });
  // 6. Золотой павильон (наги): золотые колонны, большая луковица, змеиные изваяния, бассейн
  function serpent(x, G, s) {
    return [{ p: tube([[x - s * 30, G - 6, 18], [x, G - 12, 20], [x + s * 26, G - 30, 16], [x + s * 10, G - 70, 14], [x + s * 20, G - 104, 12]]), c: '#3a9a6a', m: 'leather', gloss: 0.6, line: 1, lines: [{ p: [[x - s * 20, G - 8], [x + s * 20, G - 26], [x + s * 12, G - 70]], w: 3, c: '#e0c050', a: 0.7 }] },
      { p: [[x + s * 8, G - 106], [x + s * 20, G - 124], [x + s * 42, G - 116], [x + s * 36, G - 100], [x + s * 22, G - 96]], c: '#3a9a6a', m: 'leather', gloss: 0.6, line: 1, glint: [[x + s * 26, G - 112, 2.4]] }];
  }
  bld('dwell_6', 'tower', (f, g) => {
    const out = [];
    out.push(...steps(220, g - 30, 190, 170, 2, 14, TW.ring));
    out.push({ p: box(70, 110, 370, g - 58), c: '#3a3040', m: 'cloth', ao: 1, line: 0 });
    for (const x of [80, 140, 190, 250, 300, 360]) out.push(...column(x, 150, g - 58, 10, TW.g, TW.gd).map(sh => Object.assign(sh, { m: 'gold' })));
    out.push({ p: box(50, 130, 390, 152), c: TW.g, m: 'gold', gloss: 0.9, line: 1.2, lines: Array.from({ length: 16 }, (_, i) => ({ p: [[58 + i * 21, 134], [66 + i * 21, 148]], w: 2, a: 0.5 })) }, snow(50, 390, 131, 6));
    out.push(...onion(220, 128, 124, 116, TW.g, TW.gd));
    out.push({ e: [220, 250, 20, 24], c: '#7ae0c0', m: 'gem', gloss: 1.2, line: 1, lc: '#1a5a4a' });
    lit(220, 250);
    out.push(...serpent(40, g - 20, 1), ...serpent(400, g - 20, -1));
    out.push(pool(220, g - 14, 150, 16, '#6ab8e8'));
    return out;
  });
  // 7. Облачный храм: храм на облаках — колонны, фронтон, золотой купол, молнии
  function bolt(x, y, s) { return { p: [P(x, y, 1), P(x + 14 * s, y + 30, 1), P(x + 4 * s, y + 32, 1), P(x + 16 * s, y + 66, 1), P(x - 4 * s, y + 28, 1), P(x + 6 * s, y + 26, 1)], c: '#fff4a0', m: 'gem', gloss: 1.2, rim: 0, line: 0.8, lc: '#c8a020' }; }
  bld('dwell_7', 'tower', (f, g, cx) => {
    const out = [];
    out.push(...cloud(cx - 160, 180, 160, 50, 31, '#e8eef8'), ...cloud(cx + 170, 170, 150, 46, 32, '#e8eef8'));
    out.push(tW(cx - 112, 150, cx + 112, 240, { rh: 0 }), ...tCornice(cx - 116, cx + 116, 152), ...dome(cx, 146, 110, 96, TW.g, TW.gd), ...onion(cx, 54, 20, 40, TW.g, TW.gd));
    out.push({ p: box(cx - 170, 250, cx + 170, g - 90), c: '#3a3848', m: 'cloth', line: 0 });
    for (let i = 0; i < 6; i++) out.push(...column(cx - 150 + i * 60, 236, g - 90, 11, TW.w, TW.d));
    out.push({ p: [P(cx - 190, 238, 1), P(cx, 170, 1), P(cx + 190, 238, 1)], c: TW.w, m: 'cloth', line: 1.2, sub: [{ p: [P(cx + 4, 166, 1), P(cx + 196, 240, 1), P(cx + 110, 240, 1)], c: TW.d, m: 'flat', line: 0 }] }, { p: box(cx - 196, 234, cx + 196, 248), c: TW.g, m: 'gold', line: 1 }, snow(cx - 150, cx + 150, 214, 6));
    out.push({ e: [cx, 212, 16, 16], c: TW.b, m: 'gem', line: 1 });
    out.push(...win(cx, g - 96, 30, 110, { c: '#bfe0ff', lc: '#2a4a8a' }), ...win(cx - 90, g - 110, 12, 50, {}), ...win(cx + 90, g - 110, 12, 50, {}));
    out.push(...steps(cx, g - 72, 200, 180, 2, 10, TW.ring));
    out.push(bolt(cx - 230, 200, 1), bolt(cx + 220, 196, -1));
    out.push(...cloud(cx - 120, g - 20, 240, 50, 33), ...cloud(cx + 130, g - 24, 230, 48, 34), ...cloud(cx, g, 280, 44, 35));
    return out;
  });

  /* ---------- укрепления: мраморные стены, золотые луковицы, снег на зубцах ---------- */
  function tFortWall(g, top) {
    return [tW(10, top, 970, g, { shadeK: 0.02, rh: 24, bw: 50 }), merlons(6, 974, top - 2, 22, 44, TW.w, { k: 0.55 }), ...merlonSnow(6, 974, top - 2, 22, 44, 0.55), { p: box(10, g - 26, 970, g), c: TW.d, m: 'cloth', line: 1 }];
  }
  function tGatehouse(g, top, tall) {
    const out = [];
    out.push(tW(404, top, 576, g, { rh: 26, bw: 40 }), ...tCornice(400, 580, top));
    out.push(...gate(490, g, 42, Math.min(140, (g - top) * 0.62), { ring: TW.b, rw: 14, grateC: '#c8a040' }));
    out.push(...onion(490, top - 4, 40, 70, TW.b, TW.bd));
    for (const s of [-1, 1]) out.push(...tower(490 + s * 100, g, 30, g - top + (tall || 40), tT({ roofH: 76, win: [top + 40], winW: 7, winH: 22 })));
    return out;
  }
  bld('fort', 'tower', (f, g) => [...tFortWall(g, 150), ...tGatehouse(g, 110, 30)]);
  bld('citadel', 'tower', (f, g) => [...tFortWall(g, 270),
    ...tower(110, g, 58, 320, tT({ roofH: 110, win: [220, 310], winW: 10, winH: 30 })),
    ...tower(870, g, 58, 320, tT({ roofH: 110, win: [220, 310], winW: 10, winH: 30 })),
    ...tGatehouse(g, 226, 50)]);
  bld('castle', 'tower', (f, g) => [
    tW(410, 200, 570, 430, { rh: 28 }), ...tCornice(406, 574, 200), ...drumOnion(490, 196, 60, 50, 120), ...tWin(490, 330, 12, 44),
    ...tFortWall(g, 460),
    ...tower(110, g, 60, 350, tT({ roofH: 120, win: [390, 480], winW: 10, winH: 30 })),
    ...tower(870, g, 60, 350, tT({ roofH: 120, win: [390, 480], winW: 10, winH: 30 })),
    ...tGatehouse(g, 410, 70)]);

})(typeof window !== 'undefined' ? window : globalThis);
