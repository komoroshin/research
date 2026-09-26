/* ============================================================================
   view/vec_dw_a.js — жилища существ на карте: Замок, Оплот, Башня, Инферно, Некрополис.

   Карта берёт 'dwelling_<уровень>@<id базового существа>', если он описан (иначе
   общее 'dwelling_<уровень>' из vec_towns.js). Рамка и якорь — от общего жилища
   того же уровня (320×313, основание около y=308), чтобы жилище занимало ту же клетку.

   Рисунок крупный и простой: на телефоне клетка карты — ~32 точки, поэтому читаются
   силуэт и цвет фракции, а не мелочи. Слева у входа карта рисует само существо
   (занимает низ левой трети), справа вверху — флажок владельца: туда высокое не ставим.

   Служебные точки (meta): flag — основание древка флажка владельца (макушка крыши,
   башни, скалы справа), lights — окна и огни ночью (собираются сами из win()/lit()).

   Замок      — белый камень, синие крыши, золото, знамёна;
   Оплот      — тёплый камень и дерево, зелёные вогнутые шпили, живые деревья;
   Башня      — белый мрамор, золотые купола, синие вставки, снег;
   Инферно    — чёрный камень, багрянец, лава и огонь, рога и шипы;
   Некрополис — серый камень, кость, тёмная зелень, фиолет, мертвенный зелёный свет.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone } = K;

  /* ---------- краски ---------- */
  const WIN = '#f2d34c', WIN_LC = '#3a2614', GOLD = '#d8a53a', IRON = '#4a4a52', HOLE = '#1a1410', WOOD = '#7a5230', WOODD = '#5a3a22';

  /* ---------- описание жилища: рамка общего жилища, огни и флажок собираются по ходу ---------- */
  let LIT = null, FLAG = null;
  const lit = (x, y) => { if (LIT) LIT.push([Math.round(x), Math.round(y)]); };
  const flagAt = (x, y) => { FLAG = [Math.round(x), Math.round(y)]; };
  function dw(cid, tier, build) {
    const name = 'dwelling_' + tier;
    const fr = K.frameOf(name) || { w: 320, h: 313, anchor: [160, 310] };
    LIT = []; FLAG = null;
    const shapes = build(fr.anchor[1] - 2, fr).flat().filter(Boolean);
    let lights = LIT; LIT = null;
    if (lights.length > 6) { const k = lights.length / 6; lights = Array.from({ length: 6 }, (_, i) => lights[Math.floor(i * k)]); }
    V.def(name + '@' + cid, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { flag: FLAG || [280, 120], lights } });
  }

  /* ---------- геометрия ---------- */
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  const ln = (p, w, a, o) => Object.assign({ p, w: w || 2, a: a || 0.5 }, o);
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /** Арка: низ y1, полуширина w, полная высота h; pointed — стрельчатая. */
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  /** Кладка: ряды высотой rh, камни шириной bw вразбежку (обрежутся по форме). */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.35; w = w || 2.4;
    let row = 0;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push({ p: [[x0, y], [x1, y]], w, a });
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push({ p: [[x, y], [x, Math.min(y1, y + rh)]], w: w * 0.85, a: a * 0.8 });
    return out;
  }
  function star(cx, cy, r0, r1, n) { const out = []; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i / n * Math.PI, r = i % 2 ? r1 : r0; out.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1)); } return out; }

  /* ---------- архитектура ---------- */
  /** Стена-коробка с кладкой и тёмной правой частью. o: { c, d, rh, bw, ma, shadeK, m, lines, sub } */
  function wallBox(x0, y0, x1, y1, o) {
    o = o || {};
    return { p: box(x0, y0, x1, y1), c: o.c, m: o.m || 'cloth', line: 1.3, belly: 0.15,
      sub: [{ p: box(x1 - (x1 - x0) * (o.shadeK || 0.2), y0 - 2, x1 + 2, y1 + 2), c: o.d, m: 'flat', line: 0 }].concat(o.sub || []),
      lines: o.lines || (o.rh === 0 ? [] : masonry(x0, y0, x1, y1, o.rh || 24, o.bw || 40, o.ma || 0.33, 2.6)) };
  }
  /** Окно-проём с тёплым светом; o: { pointed, c, lc, cross, dark } */
  function win(cx, y1, w, h, o) {
    o = o || {};
    const ys = y1 - h + w, lc = o.lc || WIN_LC;
    const lines = o.cross === false ? [] : [{ p: [[cx, y1 - h + 1], [cx, y1]], w: Math.max(2, w * 0.28), c: lc, a: 0.9 }, { p: [[cx - w, ys + (y1 - ys) * 0.2], [cx + w, ys + (y1 - ys) * 0.2]], w: Math.max(2, w * 0.24), c: lc, a: 0.9 }];
    if (!o.dark) lit(cx, y1 - h * 0.45);
    return [{ p: arch(cx, y1, w, h, o.pointed), c: o.c || WIN, m: 'gem', gloss: 0.5, rim: 0, line: 1.2, lc, lines }];
  }
  /** Флажок на древке: основание (x, y), высота L. */
  function flag(x, y, L, c, o) {
    o = o || {}; const fw = o.fw || L * 0.62, fh = o.fh || L * 0.36, s = o.left ? -1 : 1, top = y - L;
    return [
      { p: tube([[x, y, o.pw || 5], [x, top - 3, (o.pw || 5) * 0.8]]), c: o.pole || '#4a3a2a', m: 'wood', line: 0.8 },
      { p: [P(x + s * 1.5, top, 1), [x + s * fw * 0.45, top + fh * 0.12], P(x + s * fw, top + fh * 0.42, 1), [x + s * fw * 0.5, top + fh * 0.62], P(x + s * 1.5, top + fh, 1)], c, m: 'cloth', line: 1 },
      { e: [x, top - 4, 4, 4], c: o.knob || GOLD, m: 'gold', line: 0.6 },
    ];
  }
  /** Висячее знамя с эмблемой: перекладина на y, ширина 2w, длина h. emb: 'cross' | 'leaf' | 'star' | 'skull' | 'horns' | цвет круга */
  function banner(cx, y, w, h, c, emb, ec) {
    ec = ec || GOLD;
    const out = [{ p: [P(cx - w, y, 1), P(cx + w, y, 1), P(cx + w, y + h, 1), P(cx, y + h - w * 0.8, 1), P(cx - w, y + h, 1)], c, m: 'cloth', line: 1.1,
      lines: [{ p: [[cx + w * 0.55, y + 4], [cx + w * 0.5, y + h - 8]], w: 2, a: 0.4 }, { p: [[cx - w, y + 7], [cx + w, y + 7]], w: 3, c: ec, a: 0.9 }] },
      { p: tube([[cx - w - 5, y, 5], [cx + w + 5, y, 5]]), c: GOLD, m: 'gold', line: 0.6 }];
    const my = y + h * 0.45;
    if (emb === 'cross') out.push({ p: [P(cx - 3, my - h * 0.2, 1), P(cx + 3, my - h * 0.2, 1), P(cx + 3, my - 3, 1), P(cx + w * 0.5, my - 3, 1), P(cx + w * 0.5, my + 3, 1), P(cx + 3, my + 3, 1), P(cx + 3, my + h * 0.22, 1), P(cx - 3, my + h * 0.22, 1), P(cx - 3, my + 3, 1), P(cx - w * 0.5, my + 3, 1), P(cx - w * 0.5, my - 3, 1), P(cx - 3, my - 3, 1)], c: ec, m: 'gold', line: 0.6 });
    else if (emb === 'leaf') out.push({ p: [P(cx, my - h * 0.2, 1), [cx + w * 0.5, my], P(cx, my + h * 0.2, 1), [cx - w * 0.5, my]], c: ec, m: 'gold', line: 0.6 });
    else if (emb === 'star') out.push({ p: star(cx, my, w * 0.55, w * 0.24, 5), c: ec, m: 'gold', line: 0.6 });
    else if (emb === 'skull') out.push(...skull(cx, my, w * 0.42, { c: ec }));
    else if (emb === 'horns') out.push({ p: [P(cx - w * 0.6, my - h * 0.18, 1), [cx - w * 0.3, my + 2], [cx, my + h * 0.05], [cx + w * 0.3, my + 2], P(cx + w * 0.6, my - h * 0.18, 1), [cx + w * 0.25, my + h * 0.18], [cx - w * 0.25, my + h * 0.18]], c: ec, m: 'horn', line: 0.6 });
    else if (emb) out.push({ e: [cx, my, w * 0.4, w * 0.4], c: emb, m: 'gold', line: 0.6 });
    return out;
  }
  /** Коническая крыша: основание y (полуширина hw), высота h. o: { flare, lean, m, concave } */
  function cone(cx, y, hw, h, c, cd, o) {
    o = o || {}; const f = o.flare === undefined ? 0.06 : o.flare, L = o.lean || 0, k = 0.58 - f - (o.concave || 0);
    const at = (t, s) => [cx + s * hw * (1 - t) + L * t, y - h * t];
    const rows = [];
    for (const t of [0.25, 0.5, 0.75]) { const [xl, yy] = at(t, -1), xr = at(t, 1)[0]; rows.push({ p: [[xl, yy], [(xl + xr) / 2, yy + hw * (1 - t) * 0.16], [xr, yy]], w: 2.4, a: 0.4 }); }
    rows.push({ p: [[cx - hw * 0.28, y - h * 0.1], [cx - hw * 0.08 + L * 0.8, y - h * 0.8]], w: 3, light: true, a: 0.55 });
    return [{ p: [P(cx - hw, y, 1), [cx - hw * k + L * 0.42, y - h * 0.42], P(cx + L, y - h, 1), [cx + hw * k + L * 0.42, y - h * 0.42], P(cx + hw, y, 1), [cx, y + hw * 0.14]], c, m: o.m || 'leather', gloss: 0.35, line: 1.2,
      sub: [{ p: [P(cx + hw * 0.08 + L, y - h, 1), P(cx + hw * 1.2, y - 2, 1), P(cx + hw * 1.1, y + hw * 0.3, 1), P(cx + hw * 0.2, y + hw * 0.3, 1)], c: cd, m: 'flat', line: 0 }], lines: rows }];
  }
  /** Купол-полусфера. */
  function dome(cx, y, hw, h, c, cd, o) {
    o = o || {};
    return [{ p: [P(cx - hw, y, 1), [cx - hw * 0.96, y - h * 0.5], [cx - hw * 0.62, y - h * 0.9], [cx, y - h], [cx + hw * 0.62, y - h * 0.9], [cx + hw * 0.96, y - h * 0.5], P(cx + hw, y, 1), [cx, y + hw * 0.12]], c, m: o.m || 'gold', gloss: o.gloss || 0.9, line: 1.2,
      sub: cd ? [{ p: [[cx + hw * 0.25, y - h * 1.1], [cx + hw * 1.1, y - h * 0.6], [cx + hw * 1.1, y + 6], [cx + hw * 0.4, y + 6]], c: cd, m: 'flat', line: 0 }] : [],
      lines: [-0.5, 0, 0.5].map(k => ({ p: [[cx + hw * k, y], [cx + hw * k * 0.8, y - h * 0.55], [cx + hw * k * 0.3, y - h * 0.95]], w: 2, a: 0.3 })).concat([{ p: [[cx - hw * 0.6, y - h * 0.55], [cx - hw * 0.3, y - h * 0.85]], w: 3, light: true, a: 0.6 }]) }];
  }
  /** Луковичный купол со шпилем. */
  function onion(cx, y, hw, h, c, cd, o) {
    o = o || {};
    const out = [{ p: [P(cx - hw * 0.78, y, 1), [cx - hw, y - h * 0.3], [cx - hw * 0.82, y - h * 0.58], [cx - hw * 0.25, y - h * 0.82], P(cx, y - h, 1), [cx + hw * 0.25, y - h * 0.82], [cx + hw * 0.82, y - h * 0.58], [cx + hw, y - h * 0.3], P(cx + hw * 0.78, y, 1)], c, m: o.m || 'gold', gloss: 1, line: 1.2,
      sub: cd ? [{ p: [[cx + hw * 0.15, y - h], [cx + hw * 1.1, y - h * 0.4], [cx + hw * 1.1, y + 4], [cx + hw * 0.35, y + 4]], c: cd, m: 'flat', line: 0 }] : [],
      lines: [{ p: [[cx - hw * 0.6, y - h * 0.3], [cx - hw * 0.4, y - h * 0.6]], w: 3, light: true, a: 0.7 }, { p: [[cx - hw * 0.5, y], [cx - hw * 0.62, y - h * 0.4], [cx - hw * 0.15, y - h * 0.85]], w: 1.8, a: 0.3 }, { p: [[cx + hw * 0.5, y], [cx + hw * 0.62, y - h * 0.4], [cx + hw * 0.15, y - h * 0.85]], w: 1.8, a: 0.3 }] }];
    if (o.spike !== false) out.push({ p: tube([[cx, y - h + 4, Math.max(4, hw * 0.14)], [cx, y - h - hw * 0.7, 2]]), c: GOLD, m: 'gold', line: 0.6 }, { e: [cx, y - h - hw * 0.22, Math.max(4, hw * 0.14), Math.max(4, hw * 0.14)], c: GOLD, m: 'gold', line: 0.6 });
    return out;
  }
  /** Зубчатый парапет. */
  function merlons(x0, x1, y, mh, st, c, o) {
    o = o || {}; const ph = o.ph || 12, pts = [P(x0, y + ph, 1), P(x0, y - mh, 1)];
    const mw = st * (o.k || 0.56), n = Math.max(1, Math.round((x1 - x0 - mw) / st)), s = (x1 - x0 - mw) / n;
    for (let i = 0; i <= n; i++) { const x = x0 + i * s; if (i) pts.push(P(x, y, 1), P(x, y - mh, 1)); if (o.pointy) pts.push(P(x + mw / 2, y - mh - o.pointy, 1)); pts.push(P(x + mw, y - mh, 1)); if (i < n) pts.push(P(x + mw, y, 1)); }
    pts.push(P(x1, y - mh, 1), P(x1, y + ph, 1));
    return { p: pts, c, m: o.m || 'cloth', line: 1.2, lines: [{ p: [[x0, y + ph - 2], [x1, y + ph - 2]], w: 2.4, a: 0.5 }] };
  }
  /** Проём: обрамление (ring), тёмная арка, решётка или створки, либо свечение (glow). */
  function gate(cx, G, w, h, o) {
    o = o || {};
    const out = [];
    if (o.ring) out.push({ p: arch(cx, G, w + (o.rw || 9), h + (o.rw || 9), o.pointed), c: o.ring, m: 'cloth', line: 1.2 });
    const lines = [];
    if (o.grate) {
      for (let x = cx - w + w / 3; x < cx + w - 2; x += w / 3) lines.push({ p: [[x, G - h], [x, G]], w: 3.4, c: o.grate, a: 0.95 });
      for (let y = G - h + w * 0.7; y < G - 2; y += 16) lines.push({ p: [[cx - w, y], [cx + w, y]], w: 3, c: o.grate, a: 0.95 });
    }
    out.push({ p: arch(cx, G, w, h, o.pointed), c: o.hole || HOLE, m: o.glow ? 'gem' : 'cloth', gloss: o.glow ? 0.6 : 0, rim: 0, ao: o.glow ? 0 : 1.4, line: 1.2, lines });
    if (o.door) out.push({ p: arch(cx, G, w * 0.94, h * 0.97, o.pointed), c: o.door, m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [{ p: [[cx, G - h], [cx, G]], w: 2.6, a: 0.8 }, { p: [[cx - w, G - h * 0.35], [cx + w, G - h * 0.35]], w: 3.4, c: IRON, a: 0.9 }, { p: [[cx - w, G - h * 0.7], [cx + w, G - h * 0.7]], w: 3.4, c: IRON, a: 0.9 }] });
    if (o.glow) lit(cx, G - h * 0.4);
    return out;
  }
  /** Вальмовая крыша (трапеция). */
  function hip(x0, x1, y, h, e, inset, c, cd, o) {
    o = o || {}; const rows = [];
    for (let k = 1; k < 4; k++) { const yy = y - h * k / 4, dx = inset * k / 4; rows.push({ p: [[x0 - e + dx, yy], [x1 + e - dx, yy]], w: 2.6, a: 0.42 }); }
    return { p: [P(x0 - e, y, 1), P(x0 - e + inset, y - h, 1), P(x1 + e - inset, y - h, 1), P(x1 + e, y, 1)], c, m: o.m || 'leather', gloss: 0.25, line: 1.3, lines: rows,
      sub: [{ p: [P((x0 + x1) / 2 + (x1 - x0) * 0.2, y - h - 2, 1), P(x1 + e + 2, y - h - 2, 1), P(x1 + e + 2, y + 2, 1), P((x0 + x1) / 2 + (x1 - x0) * 0.32, y + 2, 1)], c: cd, m: 'flat', line: 0 }] };
  }
  /** Щипец: двускатная крыша торцом к зрителю — стена-треугольник и скаты-кромки. */
  function gableFront(x0, x1, y, h, wall, wallD, roof, roofD, th) {
    const cx = (x0 + x1) / 2; th = th || 14;
    const k = th / h * (x1 - x0) * 0.5;
    return [{ p: [P(x0, y, 1), P(cx, y - h, 1), P(x1, y, 1)], c: wall, m: 'cloth', line: 1.2, sub: [{ p: [P(cx + 4, y - h - 4, 1), P(x1 + 4, y + 4, 1), P(cx + (x1 - cx) * 0.55, y + 4, 1)], c: wallD, m: 'flat', line: 0 }] },
      { p: [P(x0 - k * 1.3, y + th * 0.5, 1), P(cx, y - h - th * 1.3, 1), P(x1 + k * 1.3, y + th * 0.5, 1), P(x1 + k * 0.2, y + th * 0.5, 1), P(cx, y - h + th * 0.1, 1), P(x0 - k * 0.2, y + th * 0.5, 1)], c: roof, m: 'leather', gloss: 0.3, line: 1.2,
        sub: [{ p: [P(cx, y - h - th * 2, 1), P(x1 + k * 2, y + th, 1), P(cx + 30, y + th, 1)], c: roofD || tone(roof, -0.3), m: 'flat', line: 0 }] }];
  }
  /** Вогнутый шпиль Оплота с загнутыми кончиками и золотым листом. */
  function elfRoof(cx, y, hw, h, c, cd, o) {
    o = o || {}; const rows = [];
    for (const t of [0.18, 0.4, 0.62]) { const w = hw * Math.pow(1 - t, 1.6) * 0.96, yy = y - h * t; rows.push({ p: [[cx - w, yy], [cx, yy + 8 * (1 - t)], [cx + w, yy]], w: 2.4, a: 0.42 }); }
    rows.push({ p: [[cx - hw * 0.5, y - h * 0.06], [cx - hw * 0.2, y - h * 0.4], [cx - hw * 0.04, y - h * 0.8]], w: 3, light: true, a: 0.5 });
    const out = [{ p: [P(cx - hw * 1.08, y - h * 0.08, 1), [cx - hw * 0.62, y - h * 0.1], [cx - hw * 0.3, y - h * 0.34], [cx - hw * 0.1, y - h * 0.66], P(cx, y - h, 1), [cx + hw * 0.1, y - h * 0.66], [cx + hw * 0.3, y - h * 0.34], [cx + hw * 0.62, y - h * 0.1], P(cx + hw * 1.08, y - h * 0.08, 1), [cx + hw * 0.8, y + 3], [cx, y + hw * 0.1], [cx - hw * 0.8, y + 3]], c, m: o.m || 'leather', gloss: 0.35, line: 1.2,
      sub: [{ p: [P(cx + 2, y - h - 4, 1), [cx + hw * 0.4, y - h * 0.3], P(cx + hw * 1.2, y - h * 0.1, 1), P(cx + hw * 1.2, y + hw * 0.2, 1), P(cx + hw * 0.2, y + hw * 0.2, 1)], c: cd, m: 'flat', line: 0 }], lines: rows }];
    if (o.finial !== false) { const lf = K.leaf([cx, y - h + 2], -Math.PI / 2, Math.max(16, hw * 0.36), Math.max(8, hw * 0.18)); out.push({ p: lf.body, c: '#e8c048', m: 'gold', gloss: 1, line: 0.7 }); }
    return out;
  }
  /** Башня: тело (сужение кверху), кладка, окна; верх 'cone' | 'onion' | 'dome' | 'elf' | 'crenel' | 'none'. Возвращает массив с .apex. */
  function tower(cx, base, hw, h, o) {
    const top = base - h, tw = hw * (1 - (o.taper || 0.05)), out = [];
    out.push({ p: trap(cx, top, base, tw, hw), c: o.wall, m: o.m || 'cloth', line: 1.3,
      sub: [{ p: [P(cx + tw * 0.4, top - 2, 1), P(cx + hw + 4, top - 2, 1), P(cx + hw + 4, base + 2, 1), P(cx + hw * 0.4, base + 2, 1)], c: o.shade, m: 'flat', line: 0 }],
      lines: o.mason === false ? [] : masonry(cx - hw, top, cx + hw, base, o.rh || 24, o.bw || hw * 0.9, 0.33, 2.4) });
    for (const y of o.win || []) out.push(...win(cx, y, o.winW || Math.max(7, hw * 0.26), o.winH || Math.max(18, hw * 0.66), { pointed: o.pointed, c: o.winC, dark: o.dark }));
    const t = o.top || 'cone', eave = o.eave === undefined ? 7 : o.eave;
    let apex;
    if (t === 'cone') { const rh = o.roofH || hw * 2.3; out.push(...cone(cx, top + 2, tw + eave, rh, o.roof, o.roofD, { concave: o.concave })); apex = top + 2 - rh; }
    else if (t === 'onion') { const rh = o.roofH || tw * 2; out.push({ p: box(cx - tw - 4, top - 7, cx + tw + 4, top + 4), c: o.ring || o.wall, m: 'cloth', line: 1.2 }); out.push(...onion(cx, top - 5, tw + 5, rh, o.roof, o.roofD)); apex = top - 5 - rh; }
    else if (t === 'dome') { const rh = o.roofH || tw * 0.95; out.push({ p: box(cx - tw - 5, top - 8, cx + tw + 5, top + 4), c: o.ring || o.wall, m: 'cloth', line: 1.2 }); out.push(...dome(cx, top - 6, tw + 3, rh, o.roof, o.roofD)); apex = top - 6 - rh; }
    else if (t === 'elf') { const rh = o.roofH || hw * 2.4; out.push(...elfRoof(cx, top + 2, tw + eave, rh, o.roof, o.roofD)); apex = top + 2 - rh; }
    else if (t === 'crenel') { out.push(merlons(cx - tw - 7, cx + tw + 7, top - 2, 16, (tw * 2 + 14) / 3.6, o.wall, { ph: 14, pointy: o.pointy })); apex = top - 18; }
    else apex = top;
    if (o.finial && t === 'cone') out.push({ p: tube([[cx, apex + 4, 5], [cx, apex - 14, 3]]), c: o.finial, m: 'gold', line: 0.7 }, { e: [cx, apex - 16, 5, 5], c: o.finial, m: 'gold', line: 0.7 });
    out.apex = [cx, apex];
    return out;
  }
  /** Ступени: n ступеней от полуширины w0 (низ) к w1 (верх) высотой sh. */
  function steps(cx, G, w0, w1, n, sh, c) {
    const out = [];
    for (let i = 0; i < n; i++) { const w = w0 + (w1 - w0) * i / Math.max(1, n - 1), y = G - i * sh; out.push({ p: box(cx - w, y - sh, cx + w, y), c: tone(c, -0.05 * i), m: 'cloth', line: 1.1 }); }
    return out;
  }
  /** Колонна с капителью и базой. */
  function column(x, y0, y1, w, c, cd) {
    return [{ p: box(x - w, y0 + 7, x + w, y1 - 7), c, m: 'cloth', line: 1.1, lines: [{ p: [[x - w * 0.3, y0 + 9], [x - w * 0.3, y1 - 9]], w: 2, a: 0.35 }], sub: [{ p: box(x + w * 0.35, y0, x + w + 2, y1), c: cd, m: 'flat', line: 0 }] },
      { p: box(x - w - 5, y0, x + w + 5, y0 + 8), c, m: 'cloth', line: 1.1 }, { p: box(x - w - 5, y1 - 8, x + w + 5, y1), c, m: 'cloth', line: 1.1 }];
  }

  /* ---------- природа и фракционные детали ---------- */
  function foliage(cx, cy, rx, ry, n, cols, seed, o) {
    o = o || {}; const rnd = rngOf(seed), back = [], front = [];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (layer ? 0.55 : 0.8);
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr - (layer ? ry * 0.12 : 0);
      const r = (layer ? 0.42 : 0.46) * Math.min(rx, ry) * (0.8 + rnd() * 0.4);
      (layer ? front : back).push({ p: ell(x, y, r * 1.12, r, 9, rnd() * 0.6), c: layer ? cols[1 + ((rnd() * (cols.length - 1)) | 0)] : cols[0], m: 'feather', texSize: o.leaf || 0.9, flow: Math.PI * 0.5, line: layer ? 0.7 : 0.9, ao: 0.8 });
    }
    return back.concat(front);
  }
  /** Ствол с корнями: от земли y0 до y1, толщина w, изгиб bend. */
  const trunk = (x, y0, y1, w, c, bend) => [
    { p: [[x - w * 1.8, y0], [x - w * 0.9, y0 - 9], [x, y0 - 6], [x + w * 0.9, y0 - 9], [x + w * 1.9, y0], [x, y0 + 3]], c: tone(c, -0.1), m: 'wood', flow: -Math.PI / 2, line: 1 },
    { p: tube([[x, y0 + 2, w * 1.5], [x, y0 - 20, w * 1.05], [x + (bend || 0) * 0.5, (y0 + y1) / 2, w * 0.92], [x + (bend || 0), y1, w * 0.75]], { flat1: true }), c, m: 'wood', flow: -Math.PI / 2, line: 1, lines: [{ p: [[x - w * 0.2, y0 - 6], [x - w * 0.1, y1 + 10]], w: 2, a: 0.4 }] }];
  /** Скала: неровный многоугольник. */
  const rock = (pts, c, o) => Object.assign({ p: pts, c, m: 'horn', gloss: 0.15, line: 1.2, belly: 0.3 }, o);
  /** Скальный массив с гранями: от x0 до x1, земля G, вершина около top. */
  function crag(x0, x1, G, top, seed, o) {
    o = o || {}; const r = rngOf(seed), n = o.n || 8, pts = [P(x0, G, 1)], lines = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, hump = Math.pow(Math.sin(t * Math.PI), o.pow || 0.7);
      const y = G - (G - top) * (0.2 + 0.8 * hump) * (0.86 + r() * 0.28);
      pts.push(i % 2 ? P(x, y, 1) : [x, y]);
      if (i && i < n && r() < 0.7) lines.push({ p: [[x, y + 10], [x + (r() - 0.5) * 30, y + (G - y) * 0.4], [x + (r() - 0.5) * 20, y + (G - y) * (0.6 + r() * 0.3)]], w: 2.6, a: 0.45 });
    }
    pts.push(P(x1, G, 1));
    return { p: pts, c: o.c || '#8a8278', m: 'horn', gloss: 0.12, line: 1.3, belly: 0.35, lines: lines.concat(o.lines || []), sub: o.sub };
  }
  /** Облако из клубов. */
  function cloud(cx, cy, w, h, seed, c, lc) {
    const rnd = rngOf(seed), out = [], n = Math.max(3, Math.round(w / h * 1.6));
    for (let i = 0; i < n; i++) { const t = n > 1 ? i / (n - 1) : 0.5, x = cx - w / 2 + w * t, r = h * (0.55 + 0.45 * Math.sin(t * Math.PI)) * (0.8 + rnd() * 0.3); out.push({ e: [x, cy - r * 0.5, r * 1.1, r], c: c || '#f4f8ff', m: 'cloth', line: 0.9, lc: lc || '#8aa0c0', belly: 0.5 }); }
    out.push({ p: [P(cx - w / 2 - h * 0.4, cy, 1), P(cx + w / 2 + h * 0.4, cy, 1), [cx + w / 2, cy + h * 0.35], [cx - w / 2, cy + h * 0.35]], c: tone(c || '#f4f8ff', -0.12), m: 'cloth', line: 0.9, lc: lc || '#8aa0c0' });
    return out;
  }
  /** Кристалл-призма. */
  function crystal(x, y, w, h, c, lean) {
    const l = (lean || 0) * h;
    return { p: [P(x - w, y, 1), P(x - w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y, 1)], c, m: 'gem', gloss: 1.1, rim: 0.7, line: 1,
      sub: [{ p: [P(x + l * 0.5, y + 2, 1), P(x + l, y - h, 1), P(x + w * 0.8 + l * 0.85, y - h * 0.8, 1), P(x + w, y + 2, 1)], c: tone(c, -0.3), m: 'flat', line: 0 }],
      lines: [{ p: [[x - w * 0.3, y - 4], [x - w * 0.3 + l * 0.8, y - h * 0.8]], w: 2.4, light: true, a: 0.7 }] };
  }
  /** Шестерня: центр, радиус, число зубцов. */
  function gear(cx, cy, r, n, c, o) {
    o = o || {}; const pts = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + (o.a || 0), da = Math.PI / n;
      pts.push(P(cx + Math.cos(a0 - da * 0.5) * r * 0.8, cy + Math.sin(a0 - da * 0.5) * r * 0.8, 1), P(cx + Math.cos(a0 - da * 0.3) * r, cy + Math.sin(a0 - da * 0.3) * r, 1),
        P(cx + Math.cos(a0 + da * 0.3) * r, cy + Math.sin(a0 + da * 0.3) * r, 1), P(cx + Math.cos(a0 + da * 0.5) * r * 0.8, cy + Math.sin(a0 + da * 0.5) * r * 0.8, 1));
    }
    return [{ p: pts, c, m: o.m || 'gold', gloss: 0.8, line: 1.1, sub: [{ e: [cx, cy, r * 0.5, r * 0.5], c: tone(c, -0.35), m: 'flat', line: 0 }] }, { e: [cx, cy, r * 0.22, r * 0.22], c: tone(c, 0.2), m: o.m || 'gold', line: 0.9 }];
  }
  /** Язык пламени: основание (x, y), полуширина w, высота h. */
  function flame(x, y, w, h, o) {
    o = o || {}; const L = o.lean || 0;
    return { p: [P(x - w, y, 1), [x - w * 0.95 + L * 0.2, y - h * 0.35], [x - w * 0.35 + L * 0.5, y - h * 0.62], P(x - w * 0.1 + L, y - h, 1), [x + w * 0.3 + L * 0.6, y - h * 0.6], P(x + w * 0.5 + L * 0.5, y - h * 0.78, 1), [x + w * 0.9 + L * 0.2, y - h * 0.35], P(x + w, y, 1), [x, y + w * 0.25]], c: o.c || '#ff7a24', m: 'gem', gloss: 0.8, rim: 0, line: 0.8, lc: o.lc || '#8a2a0a',
      sub: [{ p: [P(x - w * 0.55, y + 2, 1), [x - w * 0.45 + L * 0.2, y - h * 0.3], P(x - w * 0.05 + L * 0.55, y - h * 0.6, 1), [x + w * 0.38 + L * 0.2, y - h * 0.3], P(x + w * 0.55, y + 2, 1)], c: o.core || '#ffe08a', m: 'flat', line: 0 }] };
  }
  /** Гребень шипов. */
  function spikes(x0, x1, y, h, st, c, o) {
    o = o || {}; const pts = [P(x0, y + (o.ph || 12), 1)];
    let i = 0;
    for (let x = x0; x < x1 - st * 0.5; x += st, i++) { const hh = h * (o.vary && i % 2 ? 0.6 : 1); pts.push(P(x, y, 1), [x + st * 0.36, y - hh * 0.45], P(x + st * 0.5, y - hh, 1), [x + st * 0.64, y - hh * 0.45], P(x + st, y, 1)); }
    pts.push(P(x1, y + (o.ph || 12), 1));
    return { p: pts, c, m: 'horn', gloss: 0.35, line: 1.1 };
  }
  /** Рог: основание (cx, y), s — куда загибается, длина L. */
  const horn = (cx, y, s, L, c) => ({ p: tube([[cx, y, L * 0.28], [cx + s * L * 0.5, y - L * 0.22, L * 0.2], [cx + s * L * 0.7, y - L * 0.66, L * 0.1], [cx + s * L * 0.56, y - L, L * 0.02]]), c: c || '#e8dcc0', m: 'horn', gloss: 0.6, line: 1 });
  /** Череп: центр, радиус; o.glow — светящиеся глазницы. */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || '#e8e0c8', eye = o.glow || '#1a1210';
    if (o.glow) lit(cx, cy);
    return [{ p: [[cx - r, cy - r * 0.1], [cx - r * 0.8, cy - r * 0.85], [cx, cy - r * 1.05], [cx + r * 0.8, cy - r * 0.85], [cx + r, cy - r * 0.1], [cx + r * 0.6, cy + r * 0.45], P(cx + r * 0.45, cy + r * 0.95, 1), P(cx - r * 0.45, cy + r * 0.95, 1), [cx - r * 0.6, cy + r * 0.45]], c, m: 'horn', gloss: 0.3, line: 1,
      lines: [{ p: [[cx - r * 0.38, cy - r * 0.05], [cx - r * 0.32, cy + r * 0.05]], w: r * 0.44, c: eye, a: 1 }, { p: [[cx + r * 0.38, cy - r * 0.05], [cx + r * 0.32, cy + r * 0.05]], w: r * 0.44, c: eye, a: 1 },
        { p: [[cx, cy + r * 0.25], [cx, cy + r * 0.4]], w: r * 0.16, c: '#1a1210', a: 0.9 }] }];
  }
  /** Ореол света (плоско, с прозрачностью). */
  const halo = (cx, cy, rx, ry, c) => ({ e: [cx, cy, rx, ry], c, m: 'flat', line: 0 });
  /** Пятно земли под постройкой. */
  const patch = (cx, cy, rx, ry, c) => ({ e: [cx, cy, rx, ry], c, m: 'cloth', line: 0.8, ao: 0.5, belly: 0.3 });
  /** Клуб дыма. */
  const puff = (x, y, r, a, c) => ({ e: [x, y, r, r * 0.86], c: 'rgba(' + (c || '220,220,214') + ',' + (a || 0.6) + ')', m: 'flat', line: 0 });
  /** Кость (плечевая): от a до b, толщина w. */
  function bone(a, b, w, c) {
    c = c || '#e4dcc4';
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d * w * 0.6, ny = (b[0] - a[0]) / d * w * 0.6;
    return [{ p: tube([[a[0], a[1], w], [b[0], b[1], w]]), c, m: 'horn', line: 1 },
      { e: [a[0] + nx, a[1] + ny, w * 0.7, w * 0.7], c, m: 'horn', line: 1 }, { e: [a[0] - nx, a[1] - ny, w * 0.7, w * 0.7], c, m: 'horn', line: 1 },
      { e: [b[0] + nx, b[1] + ny, w * 0.7, w * 0.7], c, m: 'horn', line: 1 }, { e: [b[0] - nx, b[1] - ny, w * 0.7, w * 0.7], c, m: 'horn', line: 1 }];
  }

  /* ============================== ЗАМОК ==============================
     белый камень, синие конические и вальмовые крыши, золото, красно-синие знамёна */
  const CS = { wall: '#dcd4c2', shade: '#9e9684', light: '#ece6d8', roof: '#3b6fd4', roofD: '#243f8c', red: '#b8282c' };
  const CSTWR = { wall: CS.wall, shade: CS.shade, roof: CS.roof, roofD: CS.roofD };

  // Караульня: приземистая каменная сторожка с зубцами, угловая башенка и стойка с пиками
  dw('pikeman', 1, G => {
    const tw = tower(236, G, 30, 150, Object.assign({}, CSTWR, { roofH: 76, win: [206], finial: GOLD }));
    flagAt(tw.apex[0], tw.apex[1] - 14);
    return [
      patch(186, G + 2, 120, 12, '#8a7a5a'),
      wallBox(96, 196, 214, G, { c: CS.wall, d: CS.shade, shadeK: 0.14 }),
      merlons(90, 220, 196, 18, 26, CS.light),
      tw,
      ...gate(152, G, 22, 68, { ring: CS.shade, door: WOODD }),
      ...banner(196, 214, 12, 44, CS.red, 'cross'),
      // пики у стены: древки и наконечники
      ...[266, 280].map((x, i) => ({ p: tube([[x - 8 + i * 4, G - 2, 5], [x + 2, G - 150 + i * 14, 4]]), c: WOOD, m: 'wood', line: 0.8 })),
      ...[266, 280].map((x, i) => ({ p: [P(x + 2 - 5, G - 148 + i * 14, 1), P(x + 2 + 1, G - 176 + i * 14, 1), P(x + 2 + 6, G - 148 + i * 14, 1)], c: '#d6dde6', m: 'steel', line: 0.8 })),
    ];
  });

  // Башня лучников: высокая круглая башня с деревянной галереей, рядом мишень
  dw('archer', 2, G => {
    const cx = 186, top = 118;
    const tw = tower(cx, G, 40, G - top, Object.assign({}, CSTWR, { top: 'none', win: [260, 196], winW: 7, winH: 22, mason: true }));
    flagAt(cx, 36);
    return [
      patch(190, G + 2, 116, 12, '#8a7a5a'),
      tw,
      // галерея-навес из досок на консолях
      { p: box(cx - 58, top - 4, cx + 58, top + 22), c: '#9a6a3c', m: 'wood', flow: 0, line: 1.2, lines: [48, 30, 12, -6, -24, -42].map(d => ln([[cx - d, top - 2], [cx - d, top + 20]], 2.4, 0.6)), sub: [{ p: box(cx + 30, top - 6, cx + 60, top + 24), c: '#5a3a1e', m: 'flat', line: 0 }] },
      ...[-50, 0, 50].map(d => ({ p: [P(cx + d - 6, top + 22, 1), P(cx + d + 6, top + 22, 1), P(cx + d, top + 36, 1)], c: WOODD, m: 'wood', line: 0.8 })),
      ...cone(cx, top - 2, 70, 82, CS.roof, CS.roofD),
      { p: tube([[cx, 38, 5], [cx, 26, 3]]), c: GOLD, m: 'gold', line: 0.7 },
      // мишень на треноге
      { p: tube([[258, G, 5], [272, G - 70, 4]]), c: WOODD, m: 'wood', line: 0.8 }, { p: tube([[292, G, 5], [276, G - 70, 4]]), c: WOODD, m: 'wood', line: 0.8 },
      { e: [274, G - 64, 26, 26], c: '#ece4d0', m: 'cloth', line: 1.2, sub: [{ e: [274, G - 64, 18, 18], c: CS.red, m: 'cloth', line: 0 }, { e: [274, G - 64, 11, 11], c: '#ece4d0', m: 'cloth', line: 0 }, { e: [274, G - 64, 5, 5], c: CS.red, m: 'cloth', line: 0 }] },
      { p: tube([[262, G - 80, 3], [276, G - 66, 3]]), c: '#6a4a2a', m: 'wood', line: 0.6 }, { p: [P(254, G - 88, 1), P(262, G - 84, 1), P(258, G - 78, 1)], c: '#f0f0e8', m: 'feather', line: 0.6 },
    ];
  });

  // Гнездо грифонов: гнездо из прутьев на макушке скалы, в гнезде золотые яйца
  dw('griffin', 3, G => {
    flagAt(262, 108);
    const twigs = [];
    for (let i = 0; i < 9; i++) { const a = -0.3 + i * 0.07; twigs.push(ln([[132 + i * 16, 118 + (i % 2) * 6], [150 + i * 16, 102 - (i % 3) * 3]], 3, 0.8, { c: i % 2 ? '#3a2410' : '#c09a60' })); }
    return [
      // скала-столб с плоской макушкой, уступы и трещины
      rock([P(96, G, 1), [104, 250], P(116, 196, 1), [112, 160], P(126, 124, 1), [170, 112], P(218, 116, 1), [262, 120], P(276, 150, 1), [272, 196], P(290, 236, 1), [294, 280], P(300, G, 1)], '#a09a8c',
        { lines: [ln([[150, 130], [160, 190], [146, 250], [156, 300]], 3, 0.5), ln([[228, 124], [220, 170], [240, 214]], 3, 0.5), ln([[118, 200], [150, 206]], 2.6, 0.4), ln([[250, 240], [286, 244]], 2.6, 0.4)],
          sub: [{ p: [P(236, 110, 1), P(300, 110, 1), P(304, G + 4, 1), P(250, G + 4, 1), [262, 230], [244, 170]], c: '#6e6a62', m: 'flat', line: 0 }] }),
      rock([P(70, G, 1), [80, 272], P(104, 256, 1), [128, 270], P(138, G, 1)], '#8a8478'),
      // гнездо: чаша прутьев
      { p: [P(112, 110, 1), [140, 128], [200, 136], [258, 126], P(282, 106, 1), [262, 96], [200, 92], [136, 96]], c: '#8a6436', m: 'wood', flow: 0, line: 1.3, lines: twigs },
      { e: [174, 96, 14, 18], c: '#f0d890', m: 'gold', gloss: 1, line: 1 }, { e: [202, 92, 15, 20], c: '#f4e0a0', m: 'gold', gloss: 1, line: 1 }, { e: [230, 98, 13, 16], c: '#e8cc80', m: 'gold', gloss: 1, line: 1 },
      { p: [P(112, 106, 1), [150, 112], [200, 118], [252, 112], P(284, 102, 1), [262, 120], [200, 130], [136, 122]], c: '#a07844', m: 'wood', flow: 0, line: 1.1, lines: [ln([[124, 112], [168, 122]], 3, 0.8, { c: '#3a2410' }), ln([[190, 124], [236, 116]], 3, 0.8, { c: '#3a2410' }), ln([[236, 120], [276, 108]], 3, 0.8, { c: '#c09a60' })] },
      // перо и синий вымпел
      { p: K.leaf([110, 104], -2.3, 34, 12).body, c: '#e8d8a8', m: 'feather', line: 0.8 },
      ...flag(262, 108, 50, CS.roof, { fw: 28, fh: 16 }),
    ];
  });

  // Казармы: длинный каменный дом под синей крышей, щипец со щитом и мечами
  dw('swordsman', 4, G => {
    flagAt(186, 70);
    return [
      patch(180, G + 2, 130, 12, '#8a7a5a'),
      wallBox(62, 200, 298, G, { c: CS.wall, d: CS.shade, shadeK: 0.12 }),
      hip(62, 298, 202, 58, 10, 44, CS.roof, CS.roofD),
      ...gableFront(126, 246, 206, 130, CS.light, CS.shade, CS.roof, CS.roofD, 16),
      // щит и два скрещённых меча на щипце
      ...[-1, 1].map(s => ({ p: tube([[186 - s * 36, 176, 6], [186 + s * 30, 110, 4]]), c: '#d6dde6', m: 'steel', line: 0.9 })),
      ...[-1, 1].map(s => ({ p: tube([[186 - s * 42, 168, 5], [186 - s * 28, 182, 5]]), c: GOLD, m: 'gold', line: 0.7 })),
      { p: [P(166, 118, 1), P(206, 118, 1), [206, 146], P(186, 170, 1), [166, 146]], c: CS.red, m: 'steel', gloss: 0.4, line: 1.2, sub: [{ p: box(182, 118, 190, 170), c: GOLD, m: 'flat', line: 0 }, { p: box(166, 134, 206, 142), c: GOLD, m: 'flat', line: 0 }] },
      ...gate(186, G, 22, 70, { ring: CS.shade, door: WOODD }),
      ...win(106, 262, 10, 30), ...win(266, 262, 10, 30),
    ];
  });

  // Монастырь: белая церковь со щипцом и окном-розой, колокольня со шпилем
  dw('monk', 5, G => {
    const bt = tower(246, G, 28, 190, Object.assign({}, CSTWR, { top: 'none', mason: true }));
    flagAt(246, 48); lit(146, 156);
    return [
      patch(180, G + 2, 124, 12, '#8a7a5a'),
      bt,
      // звонница с колоколом и шпилем
      { p: box(214, 104, 278, 122), c: CS.light, m: 'cloth', line: 1.2 },
      { p: arch(246, 150, 16, 44), c: HOLE, m: 'cloth', line: 1.1 }, { p: [P(234, 144, 1), [238, 126], [246, 120], [254, 126], P(258, 144, 1)], c: GOLD, m: 'gold', gloss: 1, line: 0.8 },
      ...cone(246, 106, 38, 64, CS.roof, CS.roofD),
      { p: tube([[246, 46, 5], [246, 22, 4]]), c: GOLD, m: 'gold', line: 0.7 }, { p: tube([[236, 32, 4], [256, 32, 4]]), c: GOLD, m: 'gold', line: 0.7 },
      wallBox(78, 196, 214, G, { c: CS.wall, d: CS.shade, shadeK: 0.1 }),
      ...gableFront(78, 214, 198, 96, CS.light, CS.shade, '#a8322a', '#6a1c18', 16),
      { e: [146, 156, 20, 20], c: CS.shade, m: 'cloth', line: 1.1 }, { e: [146, 156, 14, 14], c: WIN, m: 'gem', gloss: 0.6, rim: 0, line: 1, lines: [0, 1, 2, 3].map(i => ln([[146 + Math.cos(i * 0.785) * 14, 156 + Math.sin(i * 0.785) * 14], [146 - Math.cos(i * 0.785) * 14, 156 - Math.sin(i * 0.785) * 14]], 2.4, 0.9, { c: WIN_LC })) },
      { p: tube([[146, 104, 5], [146, 78, 4]]), c: GOLD, m: 'gold', line: 0.7 }, { p: tube([[136, 88, 4], [156, 88, 4]]), c: GOLD, m: 'gold', line: 0.7 },
      ...gate(146, G, 20, 66, { ring: CS.shade, door: '#7a2a20', pointed: true }),
    ];
  });

  // Ристалище: полосатый шатёр, барьер для сшибки и копья с вымпелами
  dw('cavalier', 6, G => {
    flagAt(196, 44);
    const stripes = [];
    for (let i = -3; i <= 3; i++) stripes.push({ p: [P(196 + i * 26 - 12, G - 20, 1), P(196, 70, 1), P(196 + i * 26 + 12, G - 20, 1)], c: i % 2 ? '#f0ece0' : CS.roof, m: 'flat', line: 0 });
    return [
      patch(186, G + 2, 130, 12, '#a08a5a'),
      // шатёр: стенка и конус
      { p: box(126, 200, 266, G - 8), c: '#f0ece0', m: 'cloth', line: 1.2, sub: [{ p: box(126, 200, 142, G), c: CS.roof, m: 'flat', line: 0 }, { p: box(162, 200, 178, G), c: CS.roof, m: 'flat', line: 0 }, { p: box(214, 200, 230, G), c: CS.roof, m: 'flat', line: 0 }, { p: box(250, 200, 266, G), c: CS.roof, m: 'flat', line: 0 }, { p: box(236, 196, 270, G), c: 'rgba(20,30,70,0.3)', m: 'flat', line: 0 }] },
      { p: [P(196, G - 44, 1), P(214, G - 8, 1), P(178, G - 8, 1)], c: HOLE, m: 'cloth', line: 1 },
      { p: [P(112, 206, 1), [150, 140], P(196, 64, 1), [242, 140], P(280, 206, 1), [250, 212], [224, 204], [196, 212], [168, 204], [142, 212]], c: '#f0ece0', m: 'cloth', line: 1.3, belly: 0.2,
        sub: [{ p: [P(128, 210, 1), P(196, 64, 1), P(158, 210, 1)], c: CS.roof, m: 'flat', line: 0 }, { p: [P(184, 214, 1), P(196, 64, 1), P(212, 214, 1)], c: CS.roof, m: 'flat', line: 0 }, { p: [P(236, 210, 1), P(196, 64, 1), P(266, 210, 1)], c: CS.roof, m: 'flat', line: 0 }, { p: [P(200, 60, 1), P(290, 214, 1), P(240, 214, 1)], c: 'rgba(20,30,70,0.3)', m: 'flat', line: 0 }] },
      ...flag(196, 66, 30, CS.red, { fw: 26, fh: 14 }),
      // копья с вымпелами, прислонённые к шатру
      ...[[96, 250]].map(([x, y], i) => [{ p: tube([[x, G, 5], [x + (i ? 8 : -8), y - 150, 4]]), c: i ? '#e0d4b0' : '#c83030', m: 'wood', line: 0.8 }, { p: [P(x + (i ? 8 : -8) - 1, y - 150, 1), P(x + (i ? 8 : -8) + (i ? 26 : -26), y - 140, 1), P(x + (i ? 8 : -8) - 1, y - 130, 1)], c: i ? CS.roof : CS.red, m: 'cloth', line: 0.8 }]).flat(),
      // барьер для сшибки
      { p: box(60, G - 34, 300, G - 22), c: '#e0d4b0', m: 'wood', flow: 0, line: 1.2, sub: [60, 120, 180, 240].map(x => ({ p: box(x, G - 36, x + 30, G - 20), c: CS.red, m: 'flat', line: 0 })) },
      ...[70, 150, 230, 292].map(x => ({ p: box(x - 4, G - 40, x + 4, G), c: WOODD, m: 'wood', line: 0.9 })),
    ];
  });

  // Портал славы: мраморная арка с золотом, внутри — небесный свет, на ступенях облака
  dw('angel', 7, G => {
    flagAt(182, 60);
    lit(182, 190);
    return [
      halo(182, 180, 112, 116, 'rgba(255,240,180,0.28)'),
      ...steps(182, G, 132, 104, 3, 12, '#e6e0d2'),
      ...column(108, 112, G - 36, 17, '#f0ece2', '#b8b0a0'), ...column(256, 112, G - 36, 17, '#f0ece2', '#b8b0a0'),
      // свод арки и сияние внутри
      { p: arch(182, G - 36, 56, 154), c: '#fff4c8', m: 'gem', gloss: 0.6, rim: 0, line: 1.1, lc: '#b89a40',
        sub: [{ p: arch(182, G - 36, 36, 124), c: '#ffffff', m: 'flat', line: 0 }, ...[-40, -14, 14, 40].map(d => ({ p: [P(182 + d * 0.3, 90, 1), P(182 + d - 6, G - 36, 1), P(182 + d + 6, G - 36, 1)], c: 'rgba(255,220,120,0.35)', m: 'flat', line: 0 }))] },
      { p: arch(182, G - 36, 64, 162), c: '#f0ece2', m: 'cloth', line: 1.2, op: 0 },
      // антаблемент и золотые крылья наверху
      { p: box(80, 96, 284, 116), c: GOLD, m: 'gold', gloss: 0.8, line: 1.2 },
      ...[-1, 1].map(s => ({ p: [P(182 + s * 8, 96, 1), [182 + s * 40, 70], P(182 + s * 92, 46, 1), [182 + s * 74, 66], P(182 + s * 82, 70, 1), [182 + s * 62, 80], P(182 + s * 70, 90, 1), [182 + s * 40, 94]], c: '#f0d070', m: 'gold', gloss: 1, line: 1.1, lines: [ln([[182 + s * 20, 90], [182 + s * 70, 62]], 2.2, 0.5)] })),
      { e: [182, 78, 14, 14], c: '#fff0b0', m: 'gold', gloss: 1, line: 1 },
      ...cloud(114, G - 4, 90, 26, 71, '#f8faff'), ...cloud(256, G - 2, 80, 24, 73, '#f8faff'),
    ];
  });

  /* ============================== ОПЛОТ ==============================
     тёплый светлый камень и дерево, зелёные вогнутые шпили с золотым листом, живые деревья */
  const RP = { wall: '#e6d8b2', shade: '#a8966c', roof: '#4c9c3a', roofD: '#2a6224', thatch: '#8ab04a', thatchD: '#4e7a2a' };
  const LEAF = ['#2f6a26', '#4a9a38', '#62b44a'], LEAF_D = ['#1f4a1c', '#2e6a26', '#3e8430'];

  // Хижина кентавров: круглый сруб под травяной кровлей, у входа лук и колчан, позади дерево
  dw('centaur', 1, G => {
    flagAt(182, 108);
    const logs = []; for (let y = 236; y < G; y += 14) logs.push(ln([[112, y], [252, y]], 2.6, 0.55));
    return [
      patch(186, G + 2, 116, 12, '#7a6a44'),
      ...trunk(268, G - 4, 150, 9, '#6a4a2a', 4), ...foliage(272, 128, 40, 36, 4, LEAF, 21),
      { p: [P(112, 226, 1), P(252, 226, 1), P(252, G - 6, 1), [182, G + 4], P(112, G - 6, 1)], c: '#9a6a3c', m: 'wood', flow: 0, line: 1.3, lines: logs,
        sub: [{ p: box(220, 220, 256, G + 6), c: '#5a3a1e', m: 'flat', line: 0 }] },
      ...gate(182, G - 2, 18, 58, { door: WOODD }),
      { p: [P(88, 234, 1), [120, 206], [154, 150], P(182, 108, 1), [210, 150], [244, 206], P(276, 234, 1), [240, 244], [182, 250], [124, 244]], c: RP.thatch, m: 'fur', furLen: 1.1, flow: Math.PI * 0.5, dens: 1.2, line: 1.3, belly: 0.3,
        sub: [{ p: [P(186, 104, 1), P(290, 236, 1), P(240, 252, 1), P(200, 150, 1)], c: RP.thatchD, m: 'flat', line: 0 }],
        lines: [ln([[100, 232], [182, 246], [264, 232]], 4, 0.8, { c: '#4a6a24' }), ln([[128, 196], [182, 206], [236, 196]], 3, 0.6, { c: '#4a6a24' })] },
      { p: tube([[182, 112, 7], [184, 88, 3]]), c: '#5a3a1e', m: 'wood', line: 0.7 },
      // лук и колчан у стены
      { p: tube([[232, 250, 4], [244, 272, 4], [238, 296, 4]]), c: '#a06a30', m: 'wood', line: 0.7 }, ln([[232, 250], [238, 296]], 1.4, 0.9, { c: '#f0e8d0' }),
      { p: [P(212, 262, 1), P(226, 258, 1), P(230, 300, 1), P(216, 302, 1)], c: '#7a4a24', m: 'leather', line: 1 },
      ...[214, 220, 226].map(x => ({ p: [P(x - 3, 262, 1), P(x, 246, 1), P(x + 3, 262, 1)], c: '#f0e8d8', m: 'feather', line: 0.6 })),
    ];
  });

  // Мастерская гномов: дом в травяном холме — круглая дверь, окна, труба с дымом, наковальня
  dw('dwarf', 2, G => {
    flagAt(160, 138);
    lit(262, 94);
    return [
      // холм
      { p: [P(58, G, 1), [66, 236], [96, 170], [150, 138], [210, 134], [262, 158], [292, 214], P(304, G, 1)], c: '#5e9c3c', m: 'fur', furLen: 0.9, flow: Math.PI * 0.5, line: 1.3, belly: 0.4,
        sub: [{ p: [P(230, 120, 1), P(310, 180, 1), P(310, G + 4, 1), P(262, G + 4, 1), [270, 220]], c: '#3e7a2c', m: 'flat', line: 0 }] },
      // труба и дым
      { p: box(248, 104, 276, 170), c: '#8a8070', m: 'cloth', line: 1.2, lines: masonry(248, 104, 276, 170, 16, 14, 0.4), sub: [{ p: box(266, 100, 280, 174), c: '#5e5648', m: 'flat', line: 0 }] },
      { p: box(242, 96, 282, 106), c: '#a09888', m: 'cloth', line: 1.1 },
      puff(262, 82, 14, 0.7), puff(272, 60, 18, 0.55), puff(290, 36, 22, 0.4),
      // каменный фасад-арка
      { p: arch(170, G, 72, 130), c: '#b0a488', m: 'cloth', line: 1.3, lines: masonry(98, G - 130, 242, G, 22, 30, 0.35), sub: [{ p: box(214, G - 140, 250, G + 4), c: '#7e7258', m: 'flat', line: 0 }] },
      { e: [170, G - 48, 40, 44], c: '#6a6050', m: 'cloth', line: 1.2 },
      { e: [170, G - 46, 32, 36], c: '#8a5a2a', m: 'wood', flow: -Math.PI / 2, line: 1.2, lines: [ln([[150, G - 76], [150, G - 14]], 2.4, 0.6), ln([[170, G - 82], [170, G - 10]], 2.4, 0.6), ln([[190, G - 76], [190, G - 14]], 2.4, 0.6), ln([[138, G - 50], [202, G - 50]], 3.4, 0.9, { c: IRON })] },
      { e: [186, G - 40, 4, 4], c: GOLD, m: 'gold', line: 0.6 },
      ...win(118, G - 60, 11, 26), ...win(222, G - 60, 11, 26),
      // наковальня на пне
      { p: box(262, G - 30, 290, G), c: '#7a5230', m: 'wood', line: 1 },
      { p: [P(250, G - 44, 1), P(300, G - 44, 1), P(306, G - 50, 1), P(290, G - 40, 1), P(284, G - 30, 1), P(266, G - 30, 1), P(262, G - 38, 1), P(246, G - 40, 1)], c: '#5a5a64', m: 'steel', line: 1.1 },
      { p: tube([[280, G - 48, 5], [296, G - 70, 5]]), c: '#8a5a2a', m: 'wood', line: 0.7 }, { p: box(288, G - 80, 306, G - 68), c: '#6a6a74', m: 'steel', line: 0.8 },
    ];
  });

  // Дом на дереве: могучий ствол, помост с домиком под эльфийским шпилем в кроне, верёвочная лестница
  dw('wood_elf', 3, G => {
    const cx = 184;
    flagAt(cx, 70);
    const rungs = []; for (let y = 222; y < G - 4; y += 14) rungs.push(ln([[240, y], [256, y]], 3, 0.9, { c: '#8a6a3a' }));
    return [
      patch(cx, G + 2, 110, 12, '#6a5a3a'),
      ...foliage(cx, 118, 116, 70, 6, LEAF, 31),
      ...trunk(cx, G - 4, 200, 20, '#7a5634', -4),
      { p: tube([[cx - 8, 220, 12], [cx - 60, 176, 8], [cx - 88, 160, 4]]), c: '#7a5634', m: 'wood', line: 1 },
      // помост и домик
      { p: box(110, 200, 262, 212), c: '#a0703c', m: 'wood', flow: 0, line: 1.2, lines: [ln([[110, 206], [262, 206]], 2, 0.5)] },
      ...[124, 248].map(x => ({ p: tube([[x, 212, 6], [cx + (x < cx ? -10 : 10), 250, 5]]), c: WOODD, m: 'wood', line: 0.8 })),
      { p: box(140, 150, 228, 200), c: RP.wall, m: 'cloth', line: 1.2, lines: [ln([[140, 176], [228, 176]], 2.2, 0.3)], sub: [{ p: box(206, 146, 230, 204), c: RP.shade, m: 'flat', line: 0 }] },
      ...win(162, 190, 9, 26), ...gate(200, 200, 11, 34, { door: WOODD }),
      ...elfRoof(cx, 154, 60, 84, RP.roof, RP.roofD),
      // верёвочная лестница
      ln([[242, 212], [240, G - 2]], 2.6, 0.95, { c: '#c8b080' }), ln([[256, 212], [258, G - 2]], 2.6, 0.95, { c: '#c8b080' }),
      { p: box(236, 212, 262, 214), c: '#c8b080', m: 'flat', line: 0, lines: rungs },
      ...foliage(118, 160, 30, 22, 2, LEAF, 33), ...foliage(254, 150, 30, 22, 2, LEAF, 34),
    ];
  });

  // Конюшня пегасов: светлая конюшня с двумя стойлами, в середине — эльфийский шпиль и золотые крылья
  dw('pegasus', 4, G => {
    flagAt(184, 48);
    const wing = s => ({ p: [P(184 + s * 10, 160, 1), [184 + s * 36, 132], P(184 + s * 80, 118, 1), [184 + s * 64, 134], P(184 + s * 72, 142, 1), [184 + s * 54, 150], P(184 + s * 58, 160, 1), [184 + s * 34, 164]], c: '#f0d070', m: 'gold', gloss: 1, line: 1.1, lines: [ln([[184 + s * 18, 158], [184 + s * 62, 132]], 2.2, 0.5)] });
    return [
      patch(186, G + 2, 130, 12, '#8a7a5a'),
      wallBox(64, 206, 304, G, { c: '#ece6da', d: '#aaa294', shadeK: 0.1, rh: 0 }),
      { p: box(64, 206, 304, 216), c: '#8a5a32', m: 'wood', line: 1 },
      hip(64, 304, 208, 42, 10, 30, RP.roof, RP.roofD),
      // два стойла с полудверцами
      ...[108, 262].map(x => [{ p: arch(x, G, 24, 70), c: HOLE, m: 'cloth', line: 1.2 }, { p: box(x - 22, G - 34, x + 22, G), c: '#a06a36', m: 'wood', flow: 0, line: 1.1, lines: [ln([[x - 22, G - 34], [x + 22, G]], 3, 0.7), ln([[x - 22, G], [x + 22, G - 34]], 3, 0.7)] }]).flat(),
      // центральный щипец со шпилем
      wallBox(144, 150, 224, G, { c: '#f2ece0', d: '#b0a898', shadeK: 0.18, rh: 26, bw: 40 }),
      ...gate(184, G, 20, 64, { ring: '#c8bca4', door: '#6a4424' }),
      ...win(184, 212, 10, 30),
      ...elfRoof(184, 154, 52, 104, RP.roof, RP.roofD),
      wing(-1), wing(1),
    ];
  });

  // Древо дендроидов: исполинское корявое дерево, между корнями — светящийся зелёный проход
  dw('dendroid_guard', 5, G => {
    flagAt(184, 50);
    lit(184, G - 30);
    return [
      patch(184, G + 2, 124, 12, '#5a4a2a'),
      ...foliage(184, 110, 124, 72, 7, LEAF_D, 51),
      // ствол с раскинутыми корнями и ветвями
      { p: [P(70, G, 1), [106, G - 14], [132, G - 40], [140, 200], [136, 150], [110, 116], P(86, 96, 1), [124, 104], [152, 128], [168, 96], P(160, 64, 1), [186, 92], [204, 110], [222, 80], P(246, 66, 1), [234, 104], [222, 140], [228, 200], [238, G - 40], [264, G - 14], P(300, G, 1)], c: '#6a4a2e', m: 'wood', flow: -Math.PI / 2, line: 1.4,
        sub: [{ p: [P(210, 60, 1), P(310, 60, 1), P(310, G + 4, 1), P(250, G + 4, 1), [220, 220]], c: '#4a3220', m: 'flat', line: 0 }],
        lines: [ln([[150, G - 20], [158, 200], [150, 150]], 3, 0.5), ln([[214, G - 20], [208, 210], [214, 160]], 3, 0.5), ln([[176, 140], [190, 170]], 2.6, 0.4)] },
      // дупло-проход
      { p: arch(184, G, 30, 84), c: '#9aff7a', m: 'gem', gloss: 0.8, rim: 0, line: 1.3, lc: '#1a2a10', sub: [{ p: arch(184, G, 18, 66), c: '#e8ffc8', m: 'flat', line: 0 }] },
      // глаза-сучки
      { e: [166, 176, 7, 5], c: '#b8ff70', m: 'gem', gloss: 1, line: 1 }, { e: [202, 176, 7, 5], c: '#b8ff70', m: 'gem', gloss: 1, line: 1 },
      ...foliage(92, 106, 36, 26, 2, LEAF_D, 53), ...foliage(252, 72, 40, 28, 2, LEAF_D, 54), ...foliage(170, 54, 42, 26, 2, LEAF, 55),
    ];
  });

  // Поляна единорогов: лунные ворота из белого мрамора с золотым рогом, серебристый пруд, цветущее дерево
  dw('unicorn', 6, G => {
    const cx = 178, cy = 170, R = 76;
    flagAt(cx, 60);
    lit(cx, 200);
    const ring = ell(cx, cy, R, R, 28).concat([[cx + R, cy]]);
    const inner = ell(cx, cy, R - 18, R - 18, 28).reverse();
    return [
      patch(184, G + 2, 128, 14, '#5a8a3a'),
      ...trunk(270, G - 6, 150, 8, '#d8d4cc', -6), ...foliage(266, 134, 44, 36, 4, ['#e8a8c8', '#f8d0e0', '#fff0f4'], 61),
      halo(cx, cy, R - 14, R - 14, 'rgba(236,246,255,0.8)'), halo(cx - 12, cy - 14, R - 40, R - 44, 'rgba(255,255,255,0.7)'),
      { p: ring.concat(inner.concat([inner[0]])), c: '#f0eee8', m: 'cloth', line: 1.3, lines: [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return ln([[cx + Math.cos(a) * (R - 18), cy + Math.sin(a) * (R - 18)], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 2.4, 0.4); }),
        sub: [{ p: [[cx + 30, cy - R - 4], [cx + R + 6, cy - 20], [cx + R + 6, cy + R], [cx + 40, cy + R]], c: '#b8b4c4', m: 'flat', line: 0 }] },
      // золотой витой рог на вершине
      { p: [P(cx - 10, cy - R + 4, 1), P(cx, cy - R - 58, 1), P(cx + 10, cy - R + 4, 1)], c: '#f0d070', m: 'gold', gloss: 1, line: 1.1, lines: [0, 1, 2, 3].map(i => ln([[cx - 9 + i * 2.2, cy - R - i * 13], [cx + 9 - i * 2.2, cy - R - 8 - i * 13]], 2, 0.6)) },
      // пруд
      { e: [cx + 6, G - 10, 110, 20], c: '#a8c8e8', m: 'gem', gloss: 1, rim: 0.4, line: 1.2, lc: '#4a6a88', lines: [ln([[cx - 60, G - 12], [cx - 10, G - 14]], 2.6, 0.7, { light: true }), ln([[cx + 30, G - 6], [cx + 80, G - 8]], 2.6, 0.6, { light: true })] },
      ...[[90, G - 8], [300, G - 6], [228, G - 26], [120, G - 28]].map(([x, y], i) => ({ p: star(x, y, 8, 3.5, 5), c: i % 2 ? '#fff4a0' : '#f8f8ff', m: 'flat', line: 0.8 })),
    ];
  });

  // Драконьи утёсы: высокие зелёно-серые скалы, пещера с золотом и изумрудные друзы
  dw('green_dragon', 7, G => {
    flagAt(264, 102);
    lit(178, G - 36);
    return [
      rock([P(64, G, 1), [72, 240], P(90, 176, 1), [96, 130], P(126, 86, 1), [140, 104], P(160, 40, 1), [186, 70], P(208, 50, 1), [230, 88], P(256, 96, 1), [276, 140], P(292, 190, 1), [296, 250], P(306, G, 1)], '#7e8a78',
        { lines: [ln([[126, 92], [140, 160], [124, 220]], 3, 0.5), ln([[208, 56], [214, 120], [236, 170]], 3, 0.5), ln([[92, 190], [118, 200]], 2.6, 0.4), ln([[256, 104], [252, 150], [274, 210]], 3, 0.5)],
          sub: [{ p: [P(214, 40, 1), P(320, 40, 1), P(320, G + 4, 1), P(262, G + 4, 1), [264, 200], [236, 120]], c: '#56604e', m: 'flat', line: 0 }] }),
      // пещера с блеском золота
      { p: [P(120, G, 1), [124, 250], [150, 206], [184, 196], [216, 212], [236, 254], P(240, G, 1)], c: HOLE, m: 'cloth', ao: 1.2, line: 1.3 },
      { e: [178, G - 8, 40, 12], c: '#e8b830', m: 'gold', gloss: 1, line: 0.9 }, ...[[160, G - 16], [192, G - 18], [176, G - 22]].map(([x, y]) => ({ e: [x, y, 8, 6], c: '#f4d060', m: 'gold', gloss: 1, line: 0.7 })),
      // изумрудные друзы
      crystal(96, 186, 9, 34, '#3ad06a', -0.3), crystal(110, 190, 11, 48, '#4ae07a', 0.05),
      crystal(252, 102, 8, 30, '#3ad06a', 0.3), crystal(264, 262, 10, 40, '#4ae07a', 0.2), crystal(278, 268, 8, 28, '#2ab05a', 0.4),
      crystal(166, 56, 8, 28, '#4ae07a', -0.1),
      // следы когтей
      ...[0, 1, 2].map(i => ln([[146 + i * 10, 120], [160 + i * 10, 160]], 4, 0.6, { c: '#3a4036' })),
    ];
  });

  /* ============================== БАШНЯ ==============================
     белый мрамор, золотые купола, синие вставки, снег на крышах */
  const TW = { wall: '#eeece6', shade: '#aab0bc', gold: '#e8c048', goldD: '#a07820', blue: '#3a6ac0', blueD: '#24407a', snow: '#f6f8fc' };
  /** Снеговая шапка: полоса вдоль линии pts толщиной t. */
  function snowCap(pts, t) {
    const top = pts.map(p => [p[0], p[1] - 3]), bot = pts.slice().reverse().map((p, i) => [p[0], p[1] + t * (0.55 + 0.45 * ((i * 7) % 3) / 2)]);
    return { p: [...top, ...bot], c: TW.snow, m: 'cloth', line: 0.8, lc: '#9ab0c4', ao: 0.25 };
  }

  // Мастерская гремлинов: белая мастерская под синей крышей, большая золотая шестерня и дымящая труба
  dw('gremlin', 1, G => {
    flagAt(236, 118);
    return [
      patch(184, G + 2, 120, 12, '#a0a8b0'),
      { p: box(226, 112, 250, 180), c: '#8a8a94', m: 'cloth', line: 1.2, lines: masonry(226, 112, 250, 180, 14, 12, 0.4), sub: [{ p: box(242, 108, 254, 184), c: '#5e5e68', m: 'flat', line: 0 }] },
      { p: box(220, 104, 256, 114), c: '#6a6a74', m: 'steel', line: 1 },
      puff(238, 90, 13, 0.7), puff(250, 68, 17, 0.55), puff(270, 46, 21, 0.4),
      wallBox(84, 196, 262, G, { c: TW.wall, d: TW.shade, shadeK: 0.14, rh: 22, bw: 36 }),
      hip(84, 262, 198, 50, 10, 38, TW.blue, TW.blueD),
      snowCap([[112, 150], [174, 146], [236, 150]], 10),
      ...gear(128, 238, 40, 10, TW.gold, { a: 0.2 }),
      ...gate(212, G, 20, 64, { ring: '#c8ccd4', door: '#6a4424' }),
      ...win(212, 222, 9, 26),
      // трубы-переходы от шестерни
      { p: tube([[168, 238, 8], [186, 238, 8], [186, 214, 8]]), c: '#c89a40', m: 'gold', line: 0.9 },
    ];
  });

  // Парапет горгулий: мраморная стена-башня с зубцами, на зубцах — каменные горгульи
  dw('stone_gargoyle', 2, G => {
    flagAt(262, 108);
    const garg = (x, y, s) => [
      { p: [P(x - s * 4, y - 20, 1), [x - s * 18, y - 40], P(x - s * 34, y - 58, 1), [x - s * 30, y - 44], P(x - s * 36, y - 38, 1), [x - s * 26, y - 30], P(x - s * 30, y - 20, 1), [x - s * 16, y - 18]], c: '#5e5e6c', m: 'leather', line: 1.1 },
      { e: [x, y - 16, 15, 16], c: '#7a7a88', m: 'horn', gloss: 0.2, line: 1.1 },
      { e: [x + s * 10, y - 34, 10, 9], c: '#7a7a88', m: 'horn', line: 1.1 },
      { p: [P(x + s * 6, y - 40, 1), P(x + s * 8, y - 54, 1), P(x + s * 12, y - 42, 1)], c: '#5e5e6c', m: 'horn', line: 0.8 },
      { e: [x + s * 15, y - 35, 2.6, 2.6], c: '#ffcc40', m: 'gem', line: 0 },
      { p: [P(x + s * 4, y - 28, 1), [x + s * 22, y - 50], P(x + s * 40, y - 64, 1), [x + s * 34, y - 50], P(x + s * 42, y - 44, 1), [x + s * 30, y - 36], P(x + s * 34, y - 26, 1), [x + s * 16, y - 20]], c: '#6a6a78', m: 'leather', line: 1.1 }];
    return [
      patch(184, G + 2, 124, 12, '#a0a8b0'),
      wallBox(88, 170, 280, G, { c: TW.wall, d: TW.shade, shadeK: 0.14, rh: 26, bw: 38 }),
      { p: box(88, 206, 280, 216), c: TW.blue, m: 'cloth', line: 1 },
      merlons(80, 288, 168, 22, 44, '#f4f2ec', { ph: 14 }),
      snowCap([[80, 147], [98, 147]], 6), snowCap([[124, 147], [144, 147]], 6), snowCap([[172, 147], [192, 147]], 6),
      ...gate(184, G, 24, 74, { ring: '#c8ccd4', door: '#6a4424' }),
      ...win(122, 262, 9, 26), ...win(246, 262, 9, 26),
      ...garg(110, 148, 1), ...garg(256, 148, -1),
    ];
  });

  // Фабрика големов: мраморный цех под золотым куполом, две трубы, горн светится в воротах, шестерни
  dw('stone_golem', 3, G => {
    flagAt(178, 70);
    lit(178, G - 30);
    return [
      patch(184, G + 2, 128, 12, '#8a8a90'),
      ...[[104, 96], [252, 108]].map(([x, t]) => [{ p: box(x - 13, t, x + 13, 210), c: '#8a7a6a', m: 'cloth', line: 1.2, lines: masonry(x - 13, t, x + 13, 210, 14, 13, 0.4), sub: [{ p: box(x + 5, t - 4, x + 16, 214), c: '#5a4e44', m: 'flat', line: 0 }] }, { p: box(x - 17, t - 8, x + 17, t + 2), c: '#6a6a74', m: 'steel', line: 1 }, puff(x + 4, t - 18, 13, 0.65, '200,200,196'), puff(x + 14, t - 40, 17, 0.45, '190,190,186')]).flat(),
      wallBox(72, 170, 292, G, { c: '#e2e0da', d: TW.shade, shadeK: 0.14, rh: 24, bw: 36 }),
      { p: box(64, 166, 300, 178), c: TW.blue, m: 'cloth', line: 1.1 },
      ...dome(178, 168, 60, 66, TW.gold, TW.goldD),
      { p: tube([[178, 104, 5], [178, 80, 3]]), c: TW.gold, m: 'gold', line: 0.7 },
      snowCap([[130, 132], [158, 110], [180, 104]], 8),
      // горн: жар в воротах
      { p: arch(178, G, 32, 86), c: '#6a6a74', m: 'steel', line: 1.2 },
      { p: arch(178, G, 24, 76), c: '#ff9a30', m: 'gem', gloss: 0.8, rim: 0, line: 1.1, lc: '#6a2a0a', sub: [{ p: arch(178, G, 13, 50), c: '#ffe890', m: 'flat', line: 0 }] },
      ...gear(110, 234, 28, 8, TW.gold), ...gear(250, 246, 22, 8, '#c8c8d0', { m: 'steel', a: 0.3 }),
    ];
  });

  // Башня мага: высокая мраморная башня с синими поясами, золотая луковица, балкон и подзорная труба
  dw('mage', 4, G => {
    const cx = 178;
    const tw = tower(cx, G, 38, 196, { wall: TW.wall, shade: TW.shade, top: 'onion', roof: TW.gold, roofD: TW.goldD, roofH: 68, win: [270, 210], winW: 9, winH: 28, pointed: true, ring: TW.blue });
    flagAt(tw.apex[0], tw.apex[1] + 6);
    return [
      patch(180, G + 2, 100, 12, '#a0a8b0'),
      { p: box(122, 244, 236, G), c: '#e6e4de', m: 'cloth', line: 1.2, sub: [{ p: box(214, 240, 240, G + 4), c: TW.shade, m: 'flat', line: 0 }] },
      tw,
      ...[240, 180].map(y => ({ p: box(cx - 40, y, cx + 40, y + 8), c: TW.blue, m: 'cloth', line: 1 })),
      // балкон и подзорная труба
      { p: box(cx - 54, 142, cx + 54, 154), c: '#f4f2ec', m: 'cloth', line: 1.2, lines: [cx - 40, cx - 20, cx, cx + 20, cx + 40].map(x => ln([[x, 142], [x, 154]], 2.4, 0.5)) },
      { p: [P(cx - 50, 154, 1), P(cx + 50, 154, 1), P(cx + 30, 166, 1), P(cx - 30, 166, 1)], c: TW.shade, m: 'cloth', line: 1 },
      { p: tube([[cx + 30, 136, 12], [cx + 78, 108, 8]]), c: '#c89a40', m: 'gold', gloss: 0.9, line: 1 }, { p: tube([[cx + 40, 142, 4], [cx + 46, 154, 4]]), c: '#6a6a74', m: 'steel', line: 0.6 },
      { p: star(cx, 116, 14, 6, 5), c: '#f8e070', m: 'gold', line: 0.8 },
      ...gate(cx, G, 18, 56, { ring: '#c8ccd4', door: '#4a3a6a', pointed: true }),
    ];
  });

  // Лампа джинна: золотая волшебная лампа на мраморном постаменте, из носика вьётся синий дым
  dw('genie', 5, G => {
    flagAt(246, 196);
    lit(186, 190);
    const smoke = [[266, 150, 13], [254, 126, 16], [232, 104, 19], [208, 86, 21], [190, 62, 21], [206, 38, 17]];
    return [
      patch(180, G + 2, 116, 12, '#a0a8b0'),
      ...steps(180, G, 110, 80, 3, 14, '#eeece6'),
      { p: box(114, 206, 246, G - 42), c: '#f2f0ea', m: 'cloth', line: 1.2, sub: [{ p: box(222, 202, 250, G - 38), c: TW.shade, m: 'flat', line: 0 }, { p: box(114, 226, 246, 236), c: TW.blue, m: 'flat', line: 0 }] },
      { p: box(104, 196, 256, 210), c: '#f8f6f0', m: 'cloth', line: 1.2 },
      // дым: извилистая лента
      ...smoke.map(([x, y, r], i) => ({ e: [x, y, r, r * 0.8], c: i % 2 ? 'rgba(150,120,230,0.75)' : 'rgba(110,150,240,0.75)', m: 'flat', line: 0.8, lc: 'rgba(60,50,140,0.6)' })),
      // лампа
      { e: [184, 196, 44, 8], c: '#c89a30', m: 'gold', line: 1 },
      { p: [P(130, 172, 1), [150, 196], [184, 200], [226, 190], [248, 176], P(270, 160, 1), P(262, 168, 1), [238, 174], [228, 162], [200, 150], [168, 150], [140, 158]], c: TW.gold, m: 'gold', gloss: 1.1, line: 1.3,
        lines: [ln([[150, 170], [220, 170]], 3, 0.5), ln([[160, 160], [200, 156]], 3, 0.7, { light: true })] },
      { p: tube([[134, 170, 7], [110, 168, 7], [104, 150, 7], [118, 140, 6], [138, 154, 5]]), c: TW.gold, m: 'gold', line: 1 },
      { e: [184, 148, 22, 9], c: '#e0b040', m: 'gold', line: 1 }, { p: [P(172, 144, 1), [178, 128], P(184, 116, 1), [190, 128], P(196, 144, 1)], c: TW.gold, m: 'gold', gloss: 1, line: 1 },
      { e: [184, 114, 5, 5], c: '#e04080', m: 'gem', gloss: 1, line: 0.8 },
    ];
  });

  // Золотой павильон нагов: двухъярусная золотая кровля с загнутыми углами на колоннах, над водой
  dw('naga', 6, G => {
    const cx = 184;
    flagAt(cx, 50);
    lit(cx, 222);
    const pag = (y, hw, h, c, cd) => ({ p: [P(cx - hw - 16, y - 16, 1), [cx - hw, y - 2], P(cx - hw + 10, y + 4, 1), [cx, y], P(cx + hw - 10, y + 4, 1), [cx + hw, y - 2], P(cx + hw + 16, y - 16, 1), [cx + hw * 0.62, y - h * 0.5], P(cx, y - h, 1), [cx - hw * 0.62, y - h * 0.5]], c, m: 'gold', gloss: 1, line: 1.3,
      sub: [{ p: [P(cx + 4, y - h - 4, 1), P(cx + hw + 20, y - 20, 1), P(cx + hw + 20, y + 8, 1), P(cx + 20, y + 8, 1)], c: cd, m: 'flat', line: 0 }], lines: [ln([[cx - hw * 0.8, y - 8], [cx + hw * 0.8, y - 8]], 2.6, 0.4), ln([[cx - hw * 0.5, y - h * 0.45], [cx + hw * 0.5, y - h * 0.45]], 2.6, 0.4)] });
    return [
      { e: [cx, G - 6, 128, 18], c: '#3a8ac0', m: 'gem', gloss: 1, rim: 0.4, line: 1.2, lc: '#1a3a5a', lines: [ln([[cx - 90, G - 8], [cx - 40, G - 10]], 2.6, 0.7, { light: true }), ln([[cx + 50, G - 2], [cx + 100, G - 4]], 2.6, 0.6, { light: true })] },
      { p: box(cx - 96, G - 30, cx + 96, G - 14), c: '#e8e0cc', m: 'cloth', line: 1.2, sub: [{ p: box(cx + 70, G - 34, cx + 100, G - 10), c: '#a89e88', m: 'flat', line: 0 }] },
      { p: box(cx - 78, 176, cx + 78, G - 30), c: '#6a1a14', m: 'cloth', line: 1 },
      { e: [cx, 222, 20, 20], c: TW.gold, m: 'gold', gloss: 1, line: 1.1, sub: [{ e: [cx, 222, 10, 10], c: '#3aa0a0', m: 'flat', line: 0 }] },
      ...[-78, -30, 30, 78].map(d => ({ p: box(cx + d - 8, 168, cx + d + 8, G - 30), c: '#c8342a', m: 'cloth', line: 1.1, lines: [ln([[cx + d - 3, 172], [cx + d - 3, G - 34]], 2, 0.4, { light: true })], sub: [{ p: box(cx + d - 8, 190, cx + d + 8, 196), c: TW.gold, m: 'flat', line: 0 }] })),
      pag(174, 104, 50, TW.gold, TW.goldD),
      { p: box(cx - 50, 116, cx + 50, 134), c: '#c8342a', m: 'cloth', line: 1.1, sub: [{ p: box(cx + 30, 112, cx + 54, 138), c: '#8a1e18', m: 'flat', line: 0 }] },
      pag(120, 72, 44, '#f0d060', TW.goldD),
      { p: tube([[cx, 78, 6], [cx, 52, 3]]), c: TW.gold, m: 'gold', line: 0.8 }, { e: [cx, 64, 7, 7], c: '#e04040', m: 'gem', gloss: 1, line: 0.8 },
    ];
  });

  // Облачный храм: мраморный храм с колоннами и золотым куполом на гряде облаков
  dw('giant', 7, G => {
    const cx = 180;
    flagAt(cx, 36);
    lit(cx, 210);
    return [
      ...cloud(cx, G - 18, 200, 44, 81, '#f4f8ff'),
      ...steps(cx, G - 40, 104, 88, 2, 12, '#eeece6'),
      { p: box(cx - 80, 170, cx + 80, G - 64), c: '#d8dce8', m: 'cloth', line: 1.1 },
      { p: arch(cx, G - 64, 22, 64), c: '#ffe8a0', m: 'gem', gloss: 0.6, rim: 0, line: 1.1 },
      ...[-66, -32, 32, 66].map(d => column(cx + d, 158, G - 64, 9, '#f6f4ee', TW.shade)).flat(),
      { p: box(cx - 94, 142, cx + 94, 160), c: '#f4f2ec', m: 'cloth', line: 1.2, sub: [{ p: box(cx - 94, 150, cx + 94, 156), c: TW.blue, m: 'flat', line: 0 }] },
      ...dome(cx, 144, 66, 76, TW.gold, TW.goldD),
      { p: tube([[cx, 70, 6], [cx, 40, 3]]), c: TW.gold, m: 'gold', line: 0.8 }, { e: [cx, 52, 6, 6], c: '#f8f0c0', m: 'gold', line: 0.8 },
      ...cloud(84, 126, 60, 20, 83, '#ffffff'), ...cloud(274, 170, 50, 18, 84, '#ffffff'),
      ...cloud(cx + 40, G - 4, 120, 30, 82, '#ffffff'),
    ];
  });

  /* ============================== ИНФЕРНО ==============================
     чёрный камень, багрянец, лава и огонь, рога и шипы */
  const IN = { stone: '#4e3c3c', stoneD: '#2a1c1e', red: '#a82a1e', redD: '#5a1210', lava: '#ff7a1a', core: '#ffd860', horn: '#e6d8b8', iron: '#3a3438' };
  const fire = (x, y, w, h, lean) => flame(x, y, w, h, { lean });
  const lava = (cx, cy, rx, ry) => ({ e: [cx, cy, rx, ry], c: IN.lava, m: 'gem', gloss: 1, rim: 0, line: 1.2, lc: '#5a1a08', sub: [{ e: [cx - rx * 0.15, cy - ry * 0.1, rx * 0.6, ry * 0.5], c: IN.core, m: 'flat', line: 0 }] });

  // Котёл бесов: чёрный котёл на треноге над огнём, внутри кипит лава, вокруг — очаг из камней
  dw('imp', 1, G => {
    const cx = 184;
    flagAt(268, 168);
    lit(cx, 176);
    return [
      patch(cx, G + 2, 116, 12, '#3a2a24'),
      ...[-1, 1].map(s => ({ p: tube([[cx + s * 58, 250, 10], [cx + s * 78, G - 2, 8]]), c: IN.iron, m: 'steel', line: 1 })),
      fire(cx - 30, G - 4, 26, 64, -6), fire(cx + 28, G - 4, 24, 56, 6), fire(cx, G - 2, 30, 80, 0),
      // котёл
      { p: [P(cx - 92, 176, 1), [cx - 96, 214], [cx - 72, 258], [cx, 274], [cx + 72, 258], [cx + 96, 214], P(cx + 92, 176, 1)], c: '#3a3640', m: 'steel', gloss: 0.6, line: 1.4,
        lines: [ln([[cx - 90, 196], [cx + 90, 196]], 3, 0.5), ln([[cx - 60, 204], [cx - 70, 244]], 4, 0.5, { light: true })] },
      { e: [cx, 176, 98, 18], c: '#4a4652', m: 'steel', line: 1.3 },
      lava(cx, 178, 84, 13),
      ...[[cx - 30, 172, 7], [cx + 24, 176, 9], [cx + 52, 172, 5]].map(([x, y, r]) => ({ e: [x, y, r, r * 0.8], c: '#ffb040', m: 'gem', gloss: 1, line: 0.8, lc: '#8a3a08' })),
      ...[-1, 1].map(s => ({ p: tube([[cx + s * 94, 194, 7], [cx + s * 110, 186, 7], [cx + s * 108, 206, 6]]), c: IN.iron, m: 'steel', line: 0.9 })),
      puff(cx - 20, 148, 18, 0.75, '96,80,84'), puff(cx + 8, 122, 22, 0.6, '110,96,100'),
      // очаг из камней
      ...[[cx - 94, 16], [cx - 58, 14], [cx + 56, 14], [cx + 92, 16]].map(([x, r]) => rock(ell(x, G - r * 0.6, r * 1.3, r, 8), '#5e4a44')),
    ];
  });

  // Зал грехов: чёрный зал под крутой багровой крышей с шипами, рога на коньке, огненные окна и жаровни
  dw('gog', 2, G => {
    const cx = 184;
    flagAt(cx, 78);
    return [
      patch(cx, G + 2, 122, 12, '#3a2a24'),
      wallBox(80, 186, 288, G, { c: IN.stone, d: IN.stoneD, shadeK: 0.14, rh: 24, bw: 40, ma: 0.45 }),
      hip(80, 288, 190, 40, 10, 30, IN.red, IN.redD),
      ...gableFront(124, 244, 196, 108, '#5e4848', IN.stoneD, IN.red, IN.redD, 16),
      spikes(160, 208, 96, 18, 12, '#2a2224'),
      horn(cx - 12, 84, -1, 44, IN.horn), horn(cx + 12, 84, 1, 44, IN.horn),
      { e: [cx, 150, 16, 16], c: '#ff9a30', m: 'gem', gloss: 1, rim: 0, line: 1.1, sub: [{ e: [cx, 150, 7, 7], c: IN.core, m: 'flat', line: 0 }] },
      ...gate(cx, G, 22, 70, { ring: '#3a2a2a', hole: '#ff7a24', glow: true, pointed: true }),
      ...win(108, 262, 9, 30, { c: '#ff8a2a', pointed: true }), ...win(260, 262, 9, 30, { c: '#ff8a2a', pointed: true }),
      // жаровни у входа
      ...[140, 228].map(x => [{ p: tube([[x, G, 5], [x, G - 38, 4]]), c: IN.iron, m: 'steel', line: 0.8 }, { p: [P(x - 14, G - 44, 1), P(x + 14, G - 44, 1), P(x + 8, G - 34, 1), P(x - 8, G - 34, 1)], c: IN.iron, m: 'steel', line: 1 }, fire(x, G - 42, 11, 30, 0)]).flat(),
    ];
  });

  // Псарня: приземистая псарня из чёрного камня с шипастой крышей, за решётками — горящие глаза, кости у входа
  dw('hell_hound', 3, G => {
    flagAt(262, 172);
    lit(128, 262); lit(236, 262);
    return [
      patch(184, G + 2, 130, 12, '#3a2a24'),
      wallBox(64, 212, 300, G, { c: IN.stone, d: IN.stoneD, shadeK: 0.1, rh: 22, bw: 38, ma: 0.45 }),
      hip(64, 300, 216, 44, 10, 34, IN.red, IN.redD),
      spikes(98, 270, 172, 24, 17, '#2a2224', { vary: true, ph: 8 }),
      // клетки: тёмные арки, решётка, глаза
      ...[128, 236].map(x => [...gate(x, G, 28, 66, { ring: '#3a2a2a', grate: '#6a6a72' }), { e: [x - 8, G - 30, 4, 3], c: '#ff4020', m: 'gem', line: 0 }, { e: [x + 8, G - 30, 4, 3], c: '#ff4020', m: 'gem', line: 0 }]).flat(),
      { p: box(172, 236, 196, G), c: '#2a1c1e', m: 'cloth', line: 1 },
      { e: [184, 226, 14, 10], c: IN.horn, m: 'horn', line: 1, lines: [ln([[176, 224], [180, 230]], 3, 0.9, { c: '#1a1210' }), ln([[188, 224], [192, 230]], 3, 0.9, { c: '#1a1210' })] },
      ...bone([150, G + 2], [196, G - 6], 6), ...bone([214, G], [250, G + 4], 5),
    ];
  });

  // Врата демонов: две мощные колонны с рогами и огнём, между ними — багровый портал
  dw('demon', 4, G => {
    const cx = 182;
    flagAt(262, 92);
    lit(cx, 200);
    const swirl = []; for (let i = 0; i < 3; i++) swirl.push(ln(ell(cx, 206 - i * 4, 44 - i * 13, 60 - i * 18, 14, 0.3 * i), 3, 0.6, { c: i % 2 ? '#ffd060' : '#ff5020' }));
    return [
      patch(cx, G + 2, 128, 12, '#3a2a24'),
      { p: arch(cx, G, 66, 176), c: '#c0201a', m: 'gem', gloss: 0.8, rim: 0, line: 1.2, lc: '#3a0808', sub: [{ e: [cx, 200, 44, 60], c: '#ff6a20', m: 'flat', line: 0 }, { e: [cx, 206, 22, 32], c: '#ffd060', m: 'flat', line: 0 }], lines: swirl },
      // свод и колонны
      { p: [P(cx - 92, 140, 1), [cx - 60, 104], [cx, 90], [cx + 60, 104], P(cx + 92, 140, 1), P(cx + 66, 150, 1), [cx + 40, 124], [cx, 114], [cx - 40, 124], P(cx - 66, 150, 1)], c: '#3a2c2e', m: 'cloth', line: 1.3, lines: [ln([[cx - 50, 116], [cx - 56, 126]], 2.6, 0.5), ln([[cx, 92], [cx, 114]], 2.6, 0.5), ln([[cx + 50, 116], [cx + 56, 126]], 2.6, 0.5)] },
      ...[-1, 1].map(s => wallBox(cx + s * 80 - 22, 120, cx + s * 80 + 22, G, { c: IN.stone, d: IN.stoneD, shadeK: 0.35, rh: 26, bw: 22, ma: 0.45 })),
      ...[-1, 1].map(s => ({ p: box(cx + s * 80 - 30, 110, cx + s * 80 + 30, 124), c: '#2a1c1e', m: 'cloth', line: 1.2 })),
      horn(cx - 94, 112, -1, 58, IN.horn), horn(cx + 94, 112, 1, 58, IN.horn),
      fire(cx - 72, 112, 16, 48, 0), fire(cx + 72, 112, 16, 48, 0),
      ...skull(cx, 104, 13, { c: IN.horn, glow: '#ff5020' }),
    ];
  });

  // Адская яма: кратер из чёрных скал, из жерла бьёт пламя, по склонам текут ручьи лавы
  dw('pit_fiend', 5, G => {
    const cx = 184;
    flagAt(270, 196);
    lit(cx, 160);
    return [
      // задний край кратера
      rock([P(84, 196, 1), [110, 160], P(140, 150, 1), [184, 140], P(226, 146, 1), [262, 156], P(288, 196, 1)], '#3a2e30'),
      lava(cx, 166, 90, 22),
      fire(cx - 40, 172, 24, 70, -10), fire(cx + 36, 170, 22, 64, 12), fire(cx, 174, 34, 118, 0),
      puff(cx - 40, 70, 22, 0.75, '84,70,74'), puff(cx + 8, 46, 26, 0.6, '100,88,92'),
      // передний склон кратера с потёками лавы
      rock([P(60, G, 1), [70, 250], P(92, 196, 1), [130, 184], P(184, 190, 1), [238, 184], P(280, 196, 1), [300, 250], P(310, G, 1)], '#4a3a3a',
        { lines: [ln([[120, 196], [112, 240], [124, 290]], 3, 0.5), ln([[250, 196], [262, 250]], 3, 0.5)],
          sub: [{ p: [P(236, 180, 1), P(320, 180, 1), P(320, G + 4, 1), P(268, G + 4, 1)], c: '#2a1c1e', m: 'flat', line: 0 },
            { p: tube([[156, 190, 12], [150, 230, 9], [160, 270, 7], [154, G, 5]]), c: IN.lava, m: 'flat', line: 0 }, { p: tube([[212, 190, 10], [220, 236, 8], [214, 280, 5]]), c: IN.lava, m: 'flat', line: 0 }] }),
      ...[[96, 206, -0.3], [124, 190, -0.1], [248, 190, 0.15], [276, 206, 0.35]].map(([x, y, l]) => ({ p: [P(x - 11, y + 8, 1), P(x + l * 60, y - 36, 1), P(x + 11, y + 8, 1)], c: '#2e2426', m: 'horn', gloss: 0.4, line: 1.1 })),
    ];
  });

  // Огненное озеро: широкое озеро лавы в обсидиановых берегах, над ним чёрный обелиск с огнём
  dw('efreet', 6, G => {
    const cx = 184;
    flagAt(cx, 64);
    lit(cx, 250);
    return [
      rock([P(56, G, 1), [60, 250], P(90, 230, 1), [184, 222], P(278, 230, 1), [308, 250], P(312, G, 1)], '#2e2628'),
      lava(cx, 262, 112, 30),
      fire(104, 262, 16, 44, -4), fire(262, 264, 14, 40, 4), fire(142, 276, 12, 30, 0), fire(234, 280, 12, 28, 0),
      // обелиск на островке
      rock([P(cx - 42, 272, 1), [cx - 30, 254], P(cx, 248, 1), [cx + 30, 254], P(cx + 44, 272, 1), [cx, 280]], '#3a3032'),
      { p: [P(cx - 26, 258, 1), P(cx - 16, 110, 1), P(cx, 90, 1), P(cx + 16, 110, 1), P(cx + 26, 258, 1)], c: '#2a2226', m: 'gem', gloss: 0.7, rim: 0.6, line: 1.3,
        sub: [{ p: [P(cx + 2, 90, 1), P(cx + 30, 260, 1), P(cx + 6, 260, 1)], c: '#14100e', m: 'flat', line: 0 }],
        lines: [ln([[cx - 8, 150], [cx - 6, 230]], 3, 0.8, { c: '#ff6a20' }), ln([[cx - 14, 170], [cx + 8, 170]], 3, 0.8, { c: '#ff6a20' })] },
      fire(cx, 96, 16, 42, 0),
      // лава-берег спереди
      rock([P(56, G, 1), [80, 290], P(130, 294, 1), [184, 298], P(240, 292, 1), [290, 288], P(312, G, 1), [184, G + 6]], '#3a2e30'),
    ];
  });

  // Дворец дьяволов: чёрный дворец с высоким шпилем-клыком посередине, боковыми башнями и рогатыми воротами
  dw('devil', 7, G => {
    const cx = 178;
    const R = tower(254, G, 26, 150, { wall: '#3e3034', shade: '#1e1618', roof: IN.red, roofD: IN.redD, roofH: 78, concave: 0.12, win: [210], winW: 7, winH: 22, winC: '#ff8a2a', pointed: true });
    flagAt(R.apex[0], R.apex[1] + 6);
    return [
      patch(cx, G + 2, 130, 12, '#3a2a24'),
      ...tower(102, G, 26, 140, { wall: '#3e3034', shade: '#1e1618', roof: IN.red, roofD: IN.redD, roofH: 74, concave: 0.12, win: [220], winW: 7, winH: 22, winC: '#ff8a2a', pointed: true }),
      R,
      ...tower(cx, G, 40, 190, { wall: '#4a3a3e', shade: '#221a1c', roof: '#c02a1e', roofD: IN.redD, roofH: 110, concave: 0.16, win: [180, 130], winW: 9, winH: 28, winC: '#ff8a2a', pointed: true }),
      wallBox(112, 220, 244, G, { c: IN.stone, d: IN.stoneD, shadeK: 0.12, rh: 24, bw: 36, ma: 0.45 }),
      spikes(108, 248, 212, 16, 14, '#2a2224', { ph: 10 }),
      ...gate(cx, G, 22, 64, { ring: '#2a1c1e', hole: '#ff6a20', glow: true, pointed: true }),
      horn(cx - 30, 244, -1, 34, IN.horn), horn(cx + 30, 244, 1, 34, IN.horn),
    ];
  });

  /* ============================== НЕКРОПОЛИС ==============================
     серый камень, кость, тёмная зелень, фиолет, мертвенный зелёный свет */
  const NC = { stone: '#74747e', stoneD: '#44444e', dark: '#3a3a46', bone: '#e2dac2', green: '#2e6a4c', greenD: '#1a3e2c', purple: '#5e3c80', purpleD: '#36204e', glow: '#8aff9a', glowC: '#e0ffe0' };
  const ghostDoor = (cx, G, w, h, pointed) => gate(cx, G, w, h, { ring: NC.stoneD, hole: NC.glow, glow: true, pointed });
  const nwin = (cx, y1, w, h) => win(cx, y1, w, h, { c: NC.glow, lc: '#1a3a22', pointed: true });
  /** Надгробие: основание (x, G), ширина w, высота h. */
  const tomb = (x, G, w, h, c) => ({ p: [P(x - w, G, 1), P(x - w, G - h + w, 1), [x - w * 0.7, G - h + w * 0.3], [x, G - h], [x + w * 0.7, G - h + w * 0.3], P(x + w, G - h + w, 1), P(x + w, G, 1)], c: c || '#9a9aa2', m: 'cloth', line: 1.2, lines: [ln([[x - w * 0.5, G - h * 0.55], [x + w * 0.5, G - h * 0.55]], 2.4, 0.5)], sub: [{ p: box(x + w * 0.4, G - h - 2, x + w + 2, G + 2), c: '#5e5e68', m: 'flat', line: 0 }] });
  /** Мёртвое дерево: ствол и голые ветви. */
  const deadTree = (x, G, h, c) => [
    { p: tube([[x, G, 16], [x - 4, G - h * 0.5, 11], [x + 6, G - h, 5]]), c: c || '#4a3c34', m: 'wood', line: 1 },
    { p: tube([[x - 3, G - h * 0.5, 7], [x - 30, G - h * 0.72, 5], [x - 40, G - h * 0.92, 2]]), c: c || '#4a3c34', m: 'wood', line: 1 },
    { p: tube([[x + 2, G - h * 0.66, 7], [x + 28, G - h * 0.8, 4], [x + 42, G - h * 0.78, 2]]), c: c || '#4a3c34', m: 'wood', line: 1 },
    { p: tube([[x + 4, G - h * 0.9, 4], [x - 14, G - h * 1.06, 2]]), c: c || '#4a3c34', m: 'wood', line: 0.9 }];

  // Проклятый храм: серый храм с колоннами, треугольный фронтон с черепом, зелёный свет в проёме
  dw('skeleton', 1, G => {
    const cx = 180;
    flagAt(cx, 118);
    return [
      patch(cx, G + 2, 118, 12, '#4a4a3e'),
      ...steps(cx, G, 100, 90, 2, 10, '#8a8a92'),
      { p: box(cx - 80, 190, cx + 80, G - 20), c: NC.dark, m: 'cloth', line: 1.1 },
      ...ghostDoor(cx, G - 20, 20, 60),
      ...[-66, -34, 34, 66].map(d => column(cx + d, 186, G - 20, 9, '#a4a4ac', '#62626c')).flat(),
      { p: box(cx - 94, 176, cx + 94, 192), c: '#9a9aa2', m: 'cloth', line: 1.2 },
      { p: [P(cx - 100, 178, 1), P(cx, 120, 1), P(cx + 100, 178, 1)], c: NC.green, m: 'leather', line: 1.3, sub: [{ p: [P(cx + 2, 116, 1), P(cx + 106, 180, 1), P(cx + 40, 180, 1)], c: NC.greenD, m: 'flat', line: 0 }] },
      { p: [P(cx - 80, 176, 1), P(cx, 132, 1), P(cx + 80, 176, 1)], c: '#8a8a92', m: 'cloth', line: 1.1 },
      ...skull(cx, 160, 13, { c: NC.bone, glow: '#3aff6a' }),
      // обломок колонны
      { p: [P(cx + 108, G, 1), P(cx + 108, G - 40, 1), P(cx + 114, G - 48, 1), P(cx + 120, G - 36, 1), P(cx + 126, G - 44, 1), P(cx + 126, G, 1)], c: '#9a9aa2', m: 'cloth', line: 1.1 },
    ];
  });

  // Кладбище: склеп с зелёным светом, надгробия, кресты, кованая ограда и мёртвое дерево
  dw('walking_dead', 2, G => {
    const cx = 186;
    flagAt(cx, 118);
    const bars = []; for (let x = 70; x <= 300; x += 14) bars.push(ln([[x, G - 4], [x, G - 40]], 3, 0.95, { c: '#2a2a30' }));
    return [
      patch(cx, G + 2, 126, 14, '#4e4a38'),
      ...deadTree(270, G - 20, 150),
      // склеп
      wallBox(cx - 50, 176, cx + 50, G - 16, { c: NC.stone, d: NC.stoneD, shadeK: 0.22, rh: 22, bw: 30 }),
      ...gableFront(cx - 56, cx + 56, 178, 54, '#8a8a94', NC.stoneD, NC.green, NC.greenD, 14),
      { p: tube([[cx, 122, 6], [cx, 96, 5]]), c: '#8a8a94', m: 'cloth', line: 0.9 }, { p: tube([[cx - 12, 106, 5], [cx + 12, 106, 5]]), c: '#8a8a94', m: 'cloth', line: 0.9 },
      ...ghostDoor(cx, G - 16, 18, 54),
      // надгробия и кресты
      tomb(96, G - 10, 13, 42), tomb(254, G - 8, 12, 38), tomb(128, G - 4, 11, 30, '#8a8a92'),
      { p: tube([[226, G - 4, 6], [226, G - 50, 6]]), c: '#8a8a92', m: 'cloth', line: 1 }, { p: tube([[214, G - 36, 6], [238, G - 36, 6]]), c: '#8a8a92', m: 'cloth', line: 1 },
      // ограда
      { p: box(64, G - 44, 304, G - 38), c: '#2a2a30', m: 'steel', line: 0.6, lines: bars },
      ...[70, 150, 222, 300].map(x => ({ p: [P(x - 3, G - 40, 1), P(x, G - 52, 1), P(x + 3, G - 40, 1)], c: '#2a2a30', m: 'steel', line: 0.5 })),
    ];
  });

  // Гробница: массивная гробница-пирамида с каменной плитой-дверью, из щелей сочится призрачный синий свет
  dw('wight', 3, G => {
    const cx = 182;
    flagAt(cx, 70);
    lit(cx, G - 40);
    return [
      patch(cx, G + 2, 122, 12, '#4a4a3e'),
      { p: [P(cx - 110, G, 1), P(cx - 92, 196, 1), P(cx + 92, 196, 1), P(cx + 110, G, 1)], c: '#7e7e88', m: 'cloth', line: 1.3, lines: masonry(cx - 110, 196, cx + 110, G, 22, 44, 0.35), sub: [{ p: [P(cx + 50, 190, 1), P(cx + 116, 190, 1), P(cx + 116, G + 4, 1), P(cx + 60, G + 4, 1)], c: '#4a4a54', m: 'flat', line: 0 }] },
      { p: [P(cx - 86, 200, 1), P(cx, 72, 1), P(cx + 86, 200, 1)], c: '#8a8a94', m: 'cloth', line: 1.3, lines: [ln([[cx - 62, 164], [cx + 62, 164]], 2.4, 0.4), ln([[cx - 38, 128], [cx + 38, 128]], 2.4, 0.4), ln([[cx - 18, 100], [cx + 18, 100]], 2.4, 0.4)],
        sub: [{ p: [P(cx + 2, 68, 1), P(cx + 92, 204, 1), P(cx + 16, 204, 1)], c: '#54545e', m: 'flat', line: 0 }] },
      { e: [cx, 150, 13, 13], c: '#7ab8ff', m: 'gem', gloss: 1, rim: 0, line: 1.1, sub: [{ e: [cx, 150, 6, 6], c: '#e8f4ff', m: 'flat', line: 0 }] },
      // портал с плитой
      { p: box(cx - 40, 206, cx + 40, G), c: '#5e5e68', m: 'cloth', line: 1.2 },
      { p: box(cx - 30, 216, cx + 30, G), c: '#9ad0ff', m: 'gem', gloss: 0.8, rim: 0, line: 1.1 },
      { p: box(cx - 28, 222, cx + 22, G), c: '#6a6a74', m: 'cloth', line: 1.1, lines: [ln([[cx - 20, 240], [cx + 14, 240]], 2.4, 0.5)] },
      // призрачные завитки
      { p: [P(cx + 30, 226, 1), [cx + 50, 200], [cx + 44, 170], P(cx + 64, 150, 1), [cx + 58, 176], [cx + 66, 206], P(cx + 40, 236, 1)], c: 'rgba(160,210,255,0.75)', m: 'flat', line: 0.8, lc: 'rgba(60,110,180,0.7)' },
      { p: [P(cx - 32, 226, 1), [cx - 56, 196], [cx - 50, 176], P(cx - 70, 160, 1), [cx - 64, 186], [cx - 68, 210], P(cx - 42, 236, 1)], c: 'rgba(160,210,255,0.65)', m: 'flat', line: 0.8, lc: 'rgba(60,110,180,0.7)' },
    ];
  });

  // Поместье вампиров: готический особняк под крутыми фиолетовыми крышами, башенка со шпилем, красные окна, летучие мыши
  dw('vampire', 4, G => {
    const T = tower(248, G, 28, 170, { wall: '#6a6470', shade: '#3a3440', roof: NC.purple, roofD: NC.purpleD, roofH: 96, concave: 0.06, win: [236, 176], winW: 7, winH: 22, winC: '#e03a3a', pointed: true, finial: '#9a9aa2' });
    flagAt(T.apex[0], T.apex[1] - 10);
    const bat = (x, y, k) => ({ p: [P(x, y, 1), [x - 6 * k, y - 6 * k], P(x - 16 * k, y - 4 * k, 1), [x - 12 * k, y], P(x - 18 * k, y + 4 * k, 1), [x - 8 * k, y + 2 * k], P(x, y + 6 * k, 1), [x + 8 * k, y + 2 * k], P(x + 18 * k, y + 4 * k, 1), [x + 12 * k, y], P(x + 16 * k, y - 4 * k, 1), [x + 6 * k, y - 6 * k]], c: '#1e1a22', m: 'flat', line: 0 });
    return [
      patch(180, G + 2, 126, 12, '#4a4a3e'),
      wallBox(76, 190, 228, G, { c: '#7a7480', d: '#4a4450', shadeK: 0.14, rh: 24, bw: 38 }),
      ...gableFront(92, 212, 194, 106, '#8a8490', '#4a4450', NC.purple, NC.purpleD, 16),
      T,
      { p: box(76, 190, 228, 200), c: '#4a4450', m: 'cloth', line: 1 },
      ...win(152, 170, 12, 40, { c: '#e03a3a', lc: '#2a0a0a', pointed: true }),
      ...win(106, 262, 9, 30, { c: '#e03a3a', lc: '#2a0a0a', pointed: true }), ...win(198, 262, 9, 30, { c: '#e03a3a', lc: '#2a0a0a', pointed: true }),
      ...gate(152, G, 18, 56, { ring: '#4a4450', door: '#4a1a1a', pointed: true }),
      bat(128, 76, 1), bat(206, 58, 0.8), bat(92, 110, 0.7),
    ];
  });

  // Мавзолей: круглая усыпальница с колоннадой под тёмно-зелёным куполом, на макушке — череп
  dw('lich', 5, G => {
    const cx = 180;
    flagAt(cx, 50); lit(cx - 27, 140); lit(cx + 27, 140);
    return [
      patch(cx, G + 2, 120, 12, '#4a4a3e'),
      ...steps(cx, G, 108, 96, 2, 10, '#8a8a92'),
      { p: box(cx - 88, 166, cx + 88, G - 20), c: NC.dark, m: 'cloth', line: 1.1 },
      ...ghostDoor(cx, G - 20, 20, 64),
      ...[-76, -44, 44, 76].map(d => column(cx + d, 164, G - 20, 8, '#a4a4ac', '#62626c')).flat(),
      ...[-60, 60].map(d => nwin(cx + d, 238, 6, 26)).flat(),
      { p: box(cx - 98, 150, cx + 98, 168), c: '#9a9aa2', m: 'cloth', line: 1.2, sub: [{ p: box(cx + 60, 146, cx + 102, 172), c: '#62626c', m: 'flat', line: 0 }] },
      { p: box(cx - 64, 128, cx + 64, 152), c: '#8a8a94', m: 'cloth', line: 1.2, lines: [cx - 40, cx - 14, cx + 14, cx + 40].map(x => ln([[x, 132], [x, 150]], 5, 0.9, { c: NC.glow })) },
      ...dome(cx, 130, 70, 62, NC.green, NC.greenD, { m: 'steel', gloss: 0.5 }),
      ...skull(cx, 62, 11, { c: NC.bone, glow: '#3aff6a' }),
    ];
  });

  // Зал тьмы: чёрный готический зал с тремя шпилями-иглами, железные ворота и фиолетовые знамёна
  dw('black_knight', 6, G => {
    const cx = 180;
    const R = tower(260, G, 22, 176, { wall: '#3e3c48', shade: '#1e1c26', roof: '#2a2834', roofD: '#14121a', roofH: 88, concave: 0.14, win: [200], winW: 6, winH: 20, winC: '#b070ff', pointed: true });
    flagAt(R.apex[0], R.apex[1]);
    return [
      patch(cx, G + 2, 128, 12, '#3a3a34'),
      ...tower(100, G, 22, 176, { wall: '#3e3c48', shade: '#1e1c26', roof: '#2a2834', roofD: '#14121a', roofH: 88, concave: 0.14, win: [200], winW: 6, winH: 20, winC: '#b070ff', pointed: true }),
      R,
      wallBox(116, 170, 244, G, { c: '#4a4854', d: '#26242e', shadeK: 0.14, rh: 24, bw: 36 }),
      ...gableFront(120, 240, 174, 120, '#56545e', '#26242e', '#2a2834', '#14121a', 16),
      ...win(cx, 150, 13, 44, { c: '#b070ff', lc: '#1a0a2a', pointed: true }),
      ...gate(cx, G, 24, 76, { ring: '#2a2834', grate: '#8a8a94', pointed: true }),
      ...banner(138, 196, 10, 50, NC.purple, 'skull', NC.bone), ...banner(222, 196, 10, 50, NC.purple, 'skull', NC.bone),
    ];
  });

  // Драконье кладбище: огромный драконий череп и рёбра, торчащие из земли, вокруг кости и мертвенный свет
  dw('bone_dragon', 7, G => {
    const B = NC.bone, BD = '#b8ae94';
    flagAt(270, 176);
    lit(128, 238); lit(168, 178);
    const rib = (x, h, lean) => ({ p: tube([[x, G - 4, 14], [x + lean * 0.4, G - h * 0.6, 11], [x + lean, G - h, 6], [x + lean * 1.5, G - h * 1.05, 3]]), c: B, m: 'horn', gloss: 0.3, line: 1.2 });
    return [
      patch(184, G + 2, 130, 14, '#4a4636'),
      halo(150, 250, 90, 40, 'rgba(140,255,160,0.28)'),
      // хребет и рёбра (дальние темнее)
      { p: tube([[300, G - 30, 12], [250, 150, 14], [200, 120, 14], [150, 112, 12]]), c: BD, m: 'horn', line: 1.1 },
      ...[[262, 140, 30], [232, 170, 34], [202, 188, 36]].map(([x, h, l]) => ({ p: tube([[x, G - 4, 12], [x + l * 0.4, G - h * 0.6, 10], [x + l, G - h, 5], [x + l * 1.4, G - h * 1.04, 3]]), c: BD, m: 'horn', line: 1.1 })),
      rib(274, 130, -34), rib(242, 160, -38), rib(210, 180, -40),
      // череп дракона: морда смотрит влево, пасть раскрыта — это вход
      { p: [P(60, G, 1), [66, 256], P(84, 226, 1), [108, 200], [140, 170], [170, 150], P(196, 130, 1), [210, 150], [214, 190], P(206, 232, 1), [196, 264], P(190, G, 1)], c: B, m: 'horn', gloss: 0.35, line: 1.4,
        sub: [{ p: [P(176, 124, 1), P(230, 124, 1), P(230, G + 4, 1), P(180, G + 4, 1), [200, 220]], c: BD, m: 'flat', line: 0 }],
        lines: [ln([[96, 214], [150, 196], [196, 186]], 3, 0.5)] },
      { p: [P(78, G, 1), [84, 262], P(100, 238, 1), [130, 222], P(168, 222, 1), [176, 256], P(174, G, 1)], c: '#1a2a1e', m: 'cloth', ao: 1, line: 1.2 },
      ...[92, 114, 136, 158].map(x => ({ p: [P(x - 6, 226 + (x - 92) * -0.05, 1), P(x, 250, 1), P(x + 6, 226 + (x - 92) * -0.05, 1)], c: '#f4eed8', m: 'horn', line: 0.8 })),
      { e: [166, 176, 16, 12], c: '#1a1a1a', m: 'cloth', line: 1, sub: [{ e: [168, 178, 6, 5], c: NC.glow, m: 'flat', line: 0 }] },
      { p: tube([[180, 148, 12], [214, 104, 8], [236, 86, 3]]), c: B, m: 'horn', gloss: 0.5, line: 1.1 },
      { p: tube([[150, 160, 9], [170, 118, 6], [186, 102, 2]]), c: BD, m: 'horn', line: 1 },
      ...bone([228, G], [276, G - 10], 7), ...bone([60, G - 2], [90, G + 4], 5),
    ];
  });
})(typeof window !== 'undefined' ? window : globalThis);
