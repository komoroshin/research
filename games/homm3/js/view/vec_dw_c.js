/* ============================================================================
   view/vec_dw_c.js — жилища существ на карте: Бухта, Фабрика, Улей, Бастион.

   Имена: dwelling_<уровень>@<id базового существа> (улучшенные живут у базового).
   Карта (adventure.js, dwellSprite) берёт такой рисунок вместо общего dwelling_<уровень>.
   Рамка и якорь — от общего жилища того же уровня (320×313, земля y≈308).
   Рисунок крупный и простой: на телефоне жилище — одна клетка, читаются силуэт и цвет
   фракции. Слева у входа карта рисует само существо (x≈20…100 в единицах рисунка),
   справа вверху — флажок владельца, поэтому основная масса стоит в центре-справа.

   meta.flag — основание древка флажка владельца, meta.lights — окна и огни ночью.
   Единицы — дизайн-единицы (10 на точку старого спрайта).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P } = K;
  const PI = Math.PI;

  /* ---------- описание жилища ---------- */
  let LT = [];
  const lit = (x, y) => { LT.push([Math.round(x), Math.round(y)]); };
  /** Жилище существа: build(g) → формы (можно вложенными массивами); g — линия земли. */
  function dw(lvl, id, flag, build) {
    const fr = K.frameOf('dwelling_' + lvl) || { w: 320, h: 313, anchor: [160, 310] };
    LT = [];
    const shapes = build(fr.anchor[1] - 2).flat(Infinity).filter(Boolean);
    const lights = LT.slice(0, 10); LT = [];
    V.def('dwelling_' + lvl + '@' + id, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }], meta: { flag, lights } });
  }

  /* ---------- геометрия и формы ---------- */
  const sh = (p, c, m, o) => Object.assign({ p, c, m: m || 'cloth', line: 1.2 }, o);
  const el = (cx, cy, rx, ry, c, m, o) => Object.assign({ e: [cx, cy, rx, ry], c, m: m || 'cloth', line: 1.1 }, o);
  const ln = (p, w, a, o) => Object.assign({ p, w: w || 2, a: a || 0.5 }, o);
  const tb = (pts, c, m, o, to) => sh(tube(pts, to), c, m, o);
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  const trap = (cx, y0, y1, w0, w1) => [P(cx - w0, y0, 1), P(cx + w0, y0, 1), P(cx + w1, y1, 1), P(cx - w1, y1, 1)];
  /** Арка: низ y1, полуширина w, полная высота h; pointed — стрельчатая. */
  function arch(cx, y1, w, h, pointed) {
    const ys = y1 - h + (pointed ? w * 1.35 : w);
    if (pointed) { const ym = ys - (ys - (y1 - h)) * 0.6; return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.7, ym], P(cx, y1 - h, 1), [cx + w * 0.7, ym], P(cx + w, ys, 1), P(cx + w, y1, 1)]; }
    return [P(cx - w, y1, 1), P(cx - w, ys, 1), [cx - w * 0.71, ys - w * 0.71], [cx, ys - w], [cx + w * 0.71, ys - w * 0.71], P(cx + w, ys, 1), P(cx + w, y1, 1)];
  }
  /** Плоская тень-подформа (обрежется по родителю). */
  const shade = (pts, c, op) => ({ p: pts, c, m: 'flat', line: 0, op });
  /** Кладка: ряды высотой rh и швы вразбежку через bw. */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.4; w = w || 2.2;
    for (let y = y0 + rh; y < y1 - 2; y += rh) out.push(ln([[x0, y], [x1, y]], w, a));
    let row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 2; x += bw) out.push(ln([[x, y], [x, Math.min(y1, y + rh)]], w * 0.85, a * 0.8));
    return out;
  }
  /** Доски: вертикальные (vert) или горизонтальные швы через шаг st. */
  function planks(x0, y0, x1, y1, st, vert, a) {
    const out = []; a = a || 0.5;
    if (vert) for (let x = x0 + st; x < x1 - 1; x += st) out.push(ln([[x, y0], [x, y1]], 2.2, a));
    else for (let y = y0 + st; y < y1 - 1; y += st) out.push(ln([[x0, y], [x1, y]], 2.2, a));
    return out;
  }
  /** Соты: контуры шестиугольников радиуса r в прямоугольнике (обрежутся по форме). */
  function comb(x0, y0, x1, y1, r, a, w) {
    const out = [], dx = r * 1.732, dy = r * 1.5;
    let row = 0;
    for (let y = y0; y < y1 + r; y += dy, row++) for (let x = x0 + (row % 2 ? dx / 2 : 0); x < x1 + r; x += dx) {
      const pts = []; for (let i = 0; i <= 6; i++) { const t = PI / 6 + i * PI / 3; pts.push([x + Math.cos(t) * r, y + Math.sin(t) * r]); }
      out.push(ln(pts, w || 2, a || 0.45));
    }
    return out;
  }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- общие детали ---------- */
  const WIN = '#f2d34c', WLC = '#3a2614', HOLE = '#16110e', IRON = '#4a4a52', GOLD = '#d8a53a';
  /** Прямоугольное окно с тёплым светом (записывает огонь). */
  function sqwin(cx, cy, w, h, o) {
    o = o || {}; const out = [], lc = o.lc || WLC; lit(cx, cy);
    if (o.frame) out.push(sh(box(cx - w - 4, cy - h - 4, cx + w + 4, cy + h + 4), o.frame, 'wood', { line: 1 }));
    out.push(sh(box(cx - w, cy - h, cx + w, cy + h), o.c || WIN, 'gem', { gloss: 0.5, rim: 0, lc,
      lines: o.cross === false ? [] : [ln([[cx, cy - h], [cx, cy + h]], 2.6, 0.9, { c: lc }), ln([[cx - w, cy], [cx + w, cy]], 2.6, 0.9, { c: lc })] }));
    return out;
  }
  /** Арочное окно. */
  function win(cx, y1, w, h, o) {
    o = o || {}; lit(cx, y1 - h * 0.45);
    return sh(arch(cx, y1, w, h, o.pointed), o.c || WIN, 'gem', { gloss: 0.5, rim: 0, lc: o.lc || WLC,
      lines: o.cross === false ? [] : [ln([[cx, y1 - h + 1], [cx, y1]], 2.6, 0.9, { c: o.lc || WLC }), ln([[cx - w, y1 - h * 0.45], [cx + w, y1 - h * 0.45]], 2.6, 0.9, { c: o.lc || WLC })] });
  }
  /** Круглое окно / иллюминатор. */
  function port(cx, cy, r, o) {
    o = o || {}; lit(cx, cy);
    return [el(cx, cy, r + (o.rw || 5), r + (o.rw || 5), o.ring || '#c89a3a', o.rm || 'gold', { line: 1 }),
      el(cx, cy, r, r, o.c || WIN, 'gem', { gloss: 0.6, rim: 0, lc: WLC, lines: o.cross === false ? [] : [ln([[cx - r, cy], [cx + r, cy]], 2.4, 0.8, { c: WLC }), ln([[cx, cy - r], [cx, cy + r]], 2.4, 0.8, { c: WLC })] })];
  }
  /** Огонёк. */
  const lamp = (x, y, r, c) => { lit(x, y); return el(x, y, r || 6, r || 6, c || WIN, 'gem', { gloss: 1, line: 1, lc: WLC }); };
  /** Дверь из досок: арочная или square, o.ring — обрамление. */
  function door(cx, base, w, h, o) {
    o = o || {}; const out = [], shp = (ww, hh) => o.square ? box(cx - ww, base - hh, cx + ww, base) : arch(cx, base, ww, hh, o.pointed);
    if (o.ring) out.push(sh(shp(w + (o.rw || 7), h + (o.rw || 7)), o.ring, o.rm || 'cloth', { line: 1.1 }));
    const lines = [ln([[cx - w * 0.33, base - h], [cx - w * 0.33, base]], 2, 0.5), ln([[cx + w * 0.33, base - h], [cx + w * 0.33, base]], 2, 0.5)];
    if (o.bands !== false) lines.push(ln([[cx - w, base - h * 0.28], [cx + w, base - h * 0.28]], 3.4, 0.9, { c: o.band || IRON }), ln([[cx - w, base - h * 0.66], [cx + w, base - h * 0.66]], 3.4, 0.9, { c: o.band || IRON }));
    out.push(sh(shp(w, h), o.c || '#5a3a22', 'wood', { flow: -PI / 2, line: 1.3, lines }));
    return out;
  }
  /** Тёмный проём (пещера, нора). */
  const hole = (cx, base, w, h, c, o) => sh(arch(cx, base, w, h, o && o.pointed), c || HOLE, 'cloth', { ao: 1.4, line: 1.2 });
  /** Тёплое свечение в проёме. */
  const glow = (cx, base, w, h, c, a) => { lit(cx, base - h * 0.45); return sh(arch(cx, base, w, h), c || '#ffb050', 'gem', { rim: 0, gloss: 0.2, line: 0, op: a || 0.5 }); };
  /** Скала / валун: контур pts, цвет c, o.sd — цвет тени справа, o.sx — где начинается тень. */
  function rock(pts, c, o) {
    o = o || {}; const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sx = o.sx || x1 - (x1 - Math.min(...xs)) * 0.26;
    return sh(pts, c, 'horn', Object.assign({ gloss: 0.15, belly: 0.35, line: 1.3, lines: o.lines || [], sub: o.sd === false ? [] : [shade([P(sx, y0 - 4, 1), P(x1 + 6, y0 - 4, 1), P(x1 + 6, y1 + 6, 1), P(sx + (o.lean || 18), y1 + 6, 1)], o.sd || '#4e4842', 0.7)] }, o.extra));
  }
  /** Вода: ободок и гладь с бликами. */
  function pool(cx, y, rx, ry, c, rim) {
    return [el(cx, y, rx, ry, rim || '#8e8472', 'horn', { line: 1.1, gloss: 0.2 }),
      el(cx, y - 2, rx - 9, Math.max(4, ry - 6), c || '#2aa0b0', 'gem', { gloss: 0.8, line: 0.8,
        lines: [ln([[cx - rx * 0.55, y - 4], [cx - rx * 0.2, y - 5]], 2.6, 0.75, { light: true }), ln([[cx + rx * 0.1, y], [cx + rx * 0.45, y - 1]], 2.4, 0.6, { light: true })] })];
  }
  /** Клубы дыма (плоские полупрозрачные). */
  const smoke = (x, y, r, n, c) => Array.from({ length: n || 3 }, (_, i) => el(x + i * r * 0.5, y - i * r * 1.3, r * (1 + i * 0.3), r * (0.85 + i * 0.25), 'rgba(' + (c || '210,206,198') + ',' + (0.62 - i * 0.14) + ')', 'flat', { line: 0 }));
  /** Древко с полотнищем: основание (x, y), высота L, цвет c; o.skull — чёрный флаг с черепом. */
  function flagOn(x, y, L, c, o) {
    o = o || {}; const t = y - L, fw = o.fw || L * 0.6, fh = o.fh || L * 0.38;
    const cloth = sh([P(x + 2, t, 1), [x + fw * 0.5, t + fh * 0.1], P(x + fw, t + fh * 0.04, 1), [x + fw * 0.86, t + fh * 0.5], P(x + fw, t + fh, 1), [x + fw * 0.5, t + fh * 0.9], P(x + 2, t + fh, 1)], c, 'cloth', { line: 0.9 });
    if (o.skull) {
      cloth.sub = [el(x + fw * 0.5, t + fh * 0.4, fh * 0.2, fh * 0.18, '#f0ece0', 'flat', { line: 0 })];
      cloth.lines = [ln([[x + fw * 0.3, t + fh * 0.84], [x + fw * 0.7, t + fh * 0.56]], 2.6, 1, { c: '#f0ece0' }), ln([[x + fw * 0.3, t + fh * 0.56], [x + fw * 0.7, t + fh * 0.84]], 2.6, 1, { c: '#f0ece0' })];
    }
    return [tb([[x, y, 5], [x, t - 3, 4]], o.pole || '#4a3020', 'wood', { line: 0.7 }), cloth];
  }
  /** Череп (кость). */
  function skull(x, y, r, c) {
    return sh([P(x - r, y + r * 0.1, 1), [x - r, y - r * 0.6], [x, y - r * 1.05], [x + r, y - r * 0.6], P(x + r, y + r * 0.1, 1), P(x + r * 0.55, y + r * 0.4, 1), P(x + r * 0.5, y + r * 0.85, 1), P(x - r * 0.5, y + r * 0.85, 1), P(x - r * 0.55, y + r * 0.4, 1)], c || '#efe8d6', 'horn', { line: 1,
      sub: [el(x - r * 0.4, y - r * 0.15, r * 0.28, r * 0.3, '#2a2018', 'flat', { line: 0 }), el(x + r * 0.4, y - r * 0.15, r * 0.28, r * 0.3, '#2a2018', 'flat', { line: 0 })] });
  }
  /** Бочка. */
  const barrel = (x, g, r, h, c) => sh([P(x - r, g, 1), [x - r * 1.14, g - h / 2], P(x - r, g - h, 1), P(x + r, g - h, 1), [x + r * 1.14, g - h / 2], P(x + r, g, 1)], c || '#8a5a30', 'wood', { flow: -PI / 2,
    lines: [ln([[x - r * 1.1, g - h * 0.25], [x + r * 1.1, g - h * 0.25]], 3, 0.9, { c: IRON }), ln([[x - r * 1.1, g - h * 0.75], [x + r * 1.1, g - h * 0.75]], 3, 0.9, { c: IRON })] });
  /** Шестерня: n зубьев, радиус r. */
  function gear(cx, cy, r, n, c) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * PI * 2, d = PI / n;
      pts.push(P(cx + Math.cos(a - d * 0.55) * r * 0.8, cy + Math.sin(a - d * 0.55) * r * 0.8, 1), P(cx + Math.cos(a - d * 0.32) * r, cy + Math.sin(a - d * 0.32) * r, 1),
        P(cx + Math.cos(a + d * 0.32) * r, cy + Math.sin(a + d * 0.32) * r, 1), P(cx + Math.cos(a + d * 0.55) * r * 0.8, cy + Math.sin(a + d * 0.55) * r * 0.8, 1));
    }
    return [sh(pts, c || '#d8a53a', 'gold', { gloss: 0.9, line: 1.1, lines: [ln(ell(cx, cy, r * 0.58, r * 0.58, 14).concat([[cx + r * 0.58, cy]]), 2.4, 0.5)] }), el(cx, cy, r * 0.24, r * 0.24, '#4a4a52', 'steel', { line: 0.9 })];
  }
  /** Листва: облако листьев (дальний слой + ближний). */
  function foliage(cx, cy, rx, ry, n, cols, seed, o) {
    o = o || {}; const rnd = rngOf(seed), back = [], front = [];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
      const a = rnd() * PI * 2, rr = Math.sqrt(rnd()) * (layer ? 0.55 : 0.8);
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr - (layer ? ry * 0.12 : 0);
      const r = (layer ? 0.42 : 0.46) * Math.min(rx, ry) * (0.8 + rnd() * 0.4);
      (layer ? front : back).push({ p: ell(x, y, r * 1.12, r, 9, rnd() * 0.6), c: layer ? cols[1 + ((rnd() * (cols.length - 1)) | 0)] : cols[0], m: 'feather', texSize: o.leaf || 0.8, flow: PI * 0.5, line: layer ? 0.7 : 0.9, ao: 0.8 });
    }
    return back.concat(front);
  }
  /** Ель: ствол и три яруса лап. */
  function pine(x, base, h, w, c) {
    const out = [tb([[x, base, 11], [x, base - h * 0.3, 8]], '#5a3c22', 'wood', { line: 0.8 })];
    for (let i = 0; i < 3; i++) {
      const yb = base - h * (0.2 + i * 0.25), ww = w * (1 - i * 0.26), hh = h * 0.44;
      out.push(sh([P(x - ww, yb, 1), [x - ww * 0.5, yb - hh * 0.45], P(x, yb - hh, 1), [x + ww * 0.5, yb - hh * 0.45], P(x + ww, yb, 1), [x + ww * 0.4, yb + 7], [x, yb + 3], [x - ww * 0.4, yb + 7]], i % 2 ? (c || '#2f5a28') : '#3c6c2e', 'feather', { texSize: 0.7, flow: PI / 2, line: 1.1 }));
    }
    return out;
  }
  /** Коралл: ствол с двумя ветвями (s — наклон). */
  const coral = (x, g, h, c, s) => [tb([[x, g, 9], [x + s * 5, g - h * 0.6, 6], [x + s * 18, g - h, 3]], c, 'skin', { line: 0.9 }), tb([[x + s * 3, g - h * 0.4, 5], [x - s * 14, g - h * 0.78, 3]], c, 'skin', { line: 0.9 })];
  /** Бревенчатая стена: горизонтальные венцы, торцы брёвен по краям. */
  function logWall(x0, y0, x1, y1, c, lh) {
    lh = lh || 17; const lines = [], out = [];
    for (let y = y0 + lh; y < y1 - 2; y += lh) lines.push(ln([[x0, y], [x1, y]], 2.8, 0.7), ln([[x0, y + 3], [x1, y + 3]], 1.4, 0.35, { light: true }));
    out.push(sh(box(x0, y0, x1, y1), c || '#8a5a30', 'wood', { flow: 0, lines, sub: [shade(box(x1 - (x1 - x0) * 0.18, y0 - 2, x1 + 2, y1 + 2), '#4e3016', 0.55)] }));
    for (let y = y0 + lh / 2; y < y1; y += lh) for (const x of [x0 - 3, x1 + 3]) out.push(el(x, y, lh * 0.5, lh * 0.46, '#b0804a', 'wood', { line: 0.8, lines: [ln(ell(x, y, lh * 0.22, lh * 0.2, 8), 1.4, 0.5)] }));
    return out;
  }
  /** Пучок травы у земли. */
  const tuft = (x, g, s, c) => sh([P(x - 12 * s, g, 1), P(x - 10 * s, g - 16 * s, 1), P(x - 4 * s, g - 6 * s, 1), P(x, g - 24 * s, 1), P(x + 4 * s, g - 6 * s, 1), P(x + 11 * s, g - 18 * s, 1), P(x + 12 * s, g, 1)], c || '#4e8a2e', 'feather', { line: 0.8, texSize: 0.5 });

  /* ============================== БУХТА ==============================
     Песчаник, черепица, доски, бирюзовая вода, чёрные флаги с черепом. */
  const C = { SAND: '#d8b882', SANDD: '#9a7c50', TILE: '#c4623a', TILED: '#80381e', PLANK: '#8a6440', PLANKD: '#5a3e24', ROPE: '#c8b080', RED: '#c42a2a',
    SEA: '#2a9ab0', DEEP: '#1f6a8a', ROCK: '#7a7268', ROCKD: '#4e4842', PEARL: '#f8f2ff', SHELL: '#f2c4b8' };

  // 1. Грот нимф: раковина-гребешок над заводью, жемчужина в гроте, кораллы
  dw(1, 'nymph', [258, 196], g => {
    const out = [...pool(196, g - 8, 116, 18, C.SEA)];
    const cx = 196, cy = g - 26, R = 110, pts = [P(cx - 26, cy + 4, 1)], ribs = [];
    for (let i = 0; i <= 12; i++) {
      const a = PI + i * PI / 12, r = R * (i % 2 ? 1.04 : 0.95) * (0.92 + 0.08 * Math.sin(i / 12 * PI));
      pts.push(P(cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.12, i % 2 ? 0 : 1));
      if (i % 2) ribs.push(ln([[cx, cy], [cx + Math.cos(a) * r * 0.98, cy + Math.sin(a) * r * 1.08]], 3.4, 0.45));
    }
    pts.push(P(cx + 26, cy + 4, 1));
    out.push(sh(pts, C.SHELL, 'skin', { gloss: 0.9, line: 1.4, lc: '#7a4a44', lines: ribs, sub: [shade([P(cx + 40, cy - 140, 1), P(cx + 130, cy - 140, 1), P(cx + 130, cy + 10, 1), P(cx + 56, cy + 10, 1)], '#c89088', 0.6)] }));
    out.push(sh(arch(cx, g - 14, 44, 96), '#123646', 'cloth', { ao: 1.3, line: 1.2 }));
    out.push(el(cx, g - 40, 18, 18, C.PEARL, 'gem', { gloss: 1.4, line: 1, glint: [[cx - 6, g - 46, 5]] })); lit(cx, g - 40);
    out.push(el(cx, g - 18, 30, 8, '#e8b8b0', 'skin', { line: 0.9 }));
    out.push(sh([P(cx - 40, cy + 12, 1), P(cx - 22, cy - 6, 1), P(cx + 22, cy - 6, 1), P(cx + 40, cy + 12, 1)], '#e8b0a4', 'skin', { line: 1 }));
    out.push(...coral(290, g - 6, 70, '#e0506a', -1), ...coral(118, g - 8, 44, '#f08a5a', 1));
    out.push(...[[150, g - 12], [246, g - 10]].map(([x, y]) => el(x, y, 6, 5, '#fbf6ee', 'gem', { gloss: 1.2, line: 0.6 })));
    return out;
  });

  // 2. Кубрик: сруб под перевёрнутой лодкой, иллюминаторы, якорь и бочка
  dw(2, 'crew_mate', [262, 150], g => [
    sh(box(122, 196, 282, g), C.PLANK, 'wood', { flow: 0, lines: planks(122, 196, 282, g, 18, false, 0.55), sub: [shade(box(250, 190, 290, g + 4), C.PLANKD, 0.7)] }),
    sh([P(94, 208, 1), [116, 160], [200, 124], [284, 160], P(308, 208, 1), [200, 218]], '#6a4424', 'wood', { flow: 0, line: 1.4,
      lines: [ln([[104, 196], [200, 150], [298, 196]], 3, 0.55), ln([[120, 172], [200, 136], [282, 172]], 3, 0.5), ln([[98, 204], [200, 212], [304, 204]], 8, 0.95, { c: C.RED })],
      sub: [shade([P(212, 110, 1), P(320, 150, 1), P(320, 230, 1), P(236, 230, 1)], '#43280f', 0.7)] }),
    tb([[108, 190, 5], [200, 120, 7], [292, 190, 5]], '#4a2c14', 'wood', { line: 0.9 }),
    ...port(156, 238, 12), ...port(250, 238, 12),
    ...door(204, g, 22, 66, { c: C.PLANKD, ring: '#6a4424' }),
    tb([[132, g - 4, 4], [132, 256, 4]], IRON, 'steel', { line: 0.8 }), tb([[118, 266, 3], [146, 266, 3]], IRON, 'steel', { line: 0.7 }),
    sh([P(112, 284, 1), [118, g - 2], P(132, g + 2, 1), [146, g - 2], P(152, 284, 1), P(146, 292, 1), P(132, 298, 1), P(118, 292, 1)], IRON, 'steel', { line: 0.9 }),
    barrel(292, g, 16, 40),
    tb([[282, 170, 2], [282, 184, 2]], C.ROPE, 'cloth', { line: 0 }), lamp(282, 190, 7),
  ]);

  // 3. Пиратская пещера: скала, дощатая дверь, череп с костями, сундук, чёрный флаг
  dw(3, 'pirate', [264, 150], g => [
    ...flagOn(140, 158, 88, '#1e1c20', { skull: true, fw: 58, fh: 36 }),
    rock([P(92, g, 1), [98, 236], [132, 168], [190, 122], [254, 132], [294, 196], P(310, g, 1)], C.ROCK, { sd: C.ROCKD, lines: [ln([[124, 200], [140, 262]], 2.6, 0.4), ln([[270, 180], [256, 240]], 2.6, 0.4)] }),
    sh(arch(198, g, 44, 118), '#2a1c14', 'cloth', { line: 1.2 }),
    sh(arch(198, g, 36, 106), C.PLANK, 'wood', { flow: -PI / 2, line: 1.2, lines: planks(162, g - 106, 234, g, 14, true, 0.55).concat([ln([[162, g - 30], [234, g - 30]], 4, 0.95, { c: IRON }), ln([[162, g - 76], [234, g - 76]], 4, 0.95, { c: IRON })]) }),
    tb([[176, 150, 5], [220, 184, 5]], '#f0ece0', 'horn', { line: 0.8 }), tb([[220, 150, 5], [176, 184, 5]], '#f0ece0', 'horn', { line: 0.8 }), skull(198, 164, 16),
    lamp(150, 240, 7), lamp(246, 240, 7),
    sh(box(246, g - 34, 300, g), '#7a4a28', 'wood', { flow: 0, line: 1.2, lines: [ln([[246, g - 22], [300, g - 22]], 4, 0.95, { c: GOLD })] }),
    sh([P(244, g - 34, 1), [250, g - 50], [273, g - 56], [296, g - 50], P(302, g - 34, 1)], '#8a5a30', 'wood', { line: 1.1 }),
    ...[[256, g - 54], [270, g - 58], [288, g - 55]].map(([x, y]) => el(x, y, 7, 5, '#ffd040', 'gold', { line: 0.6 })),
  ]);

  // 4. Утёс буревестников: морской утёс с гнёздами на уступах, молния, птицы
  dw(4, 'stormbird', [236, 90], g => {
    const out = [...pool(204, g - 8, 112, 14, C.SEA, '#e8f0f0')];
    out.push(sh([P(248, 0, 1), P(266, 28, 1), P(254, 30, 1), P(272, 62, 1), P(240, 24, 1), P(252, 22, 1)], '#fff0a0', 'gem', { gloss: 1, line: 0.9, lc: '#8a7a20' }));
    out.push(rock([P(112, g - 6, 1), [118, 240], [136, 168], P(158, 112, 1), [178, 86], P(206, 62, 1), [236, 82], [258, 140], [280, 210], P(298, g - 6, 1)], '#6e7a8a', { sd: '#46505e',
      lines: [ln([[150, 150], [164, 220], [150, 276]], 2.8, 0.45), ln([[124, 212], [282, 206]], 2.4, 0.35), ln([[196, 96], [240, 120]], 2.4, 0.35)] }));
    for (const [x, y, w] of [[204, 66, 32], [148, 158, 26], [262, 188, 26]]) out.push(sh(ell(x, y, w, 10, 12), '#6a5030', 'wood', { flow: 0, line: 1, lines: [ln([[x - w + 6, y - 2], [x + w - 6, y + 2]], 3, 0.6, { c: '#3a2a14' })] }), el(x, y - 7, w * 0.35, 6, '#eef2f6', 'feather', { line: 0.7 }));
    out.push(hole(210, g - 8, 26, 64, '#141a24'), lamp(210, g - 40, 6, '#bfe8ff'));
    for (const [x, y, k] of [[112, 112, 1.1], [290, 150, 0.9], [150, 50, 0.8]]) out.push(sh([P(x - 26 * k, y - 4 * k, 1), [x - 12 * k, y - 16 * k], P(x, y, 1), [x + 12 * k, y - 16 * k], P(x + 26 * k, y - 4 * k, 1), [x + 12 * k, y - 8 * k], [x, y + 5 * k], [x - 12 * k, y - 8 * k]], '#3a4a6a', 'feather', { line: 0.9, lines: [ln([[x - 4 * k, y - 2 * k], [x + 4 * k, y - 2 * k]], 2.4, 0.9, { c: '#ffe070' })] }));
    return out;
  });

  // 5. Хижина морской ведьмы: кривая хижина на сваях над водой, зелёные окна, котёл
  dw(5, 'sea_witch', [262, 90], g => [
    ...pool(206, g - 8, 112, 16, '#2a8a7a'),
    ...[130, 172, 232, 276].map((x, i) => tb([[x, g - 6, 7], [x + (i % 2 ? 2 : -2), 232, 7]], '#4a3a2a', 'wood', { line: 0.9 })),
    sh(box(110, 230, 296, 244), C.PLANKD, 'wood', { flow: 0, line: 1.1 }),
    sh([P(132, 232, 1), P(126, 158, 1), P(278, 148, 1), P(272, 232, 1)], '#6a5a4a', 'wood', { flow: -PI / 2, lines: planks(126, 148, 278, 232, 18, true, 0.5), sub: [shade(box(240, 140, 284, 240), '#3e3428', 0.7)] }),
    sh([P(100, 174, 1), [150, 112], P(214, 58, 1), [230, 44], P(248, 52, 1), [274, 100], P(308, 166, 1), [206, 180]], '#6a5a3e', 'fur', { furLen: 1.1, flow: PI / 2, dens: 1.2, belly: 0.3, line: 1.3,
      lines: [ln([[128, 150], [176, 144]], 12, 0.8, { c: '#7a4a8a' }), ln([[244, 108], [290, 124]], 12, 0.8, { c: '#4a7a5a' })] }),
    ...sqwin(162, 196, 15, 16, { c: '#9af070', lc: '#1a3a1a', frame: C.PLANKD, cross: false }), ...port(250, 188, 11, { c: '#c890ff', ring: C.PLANKD, rm: 'wood' }),
    ...door(210, 230, 17, 52, { c: '#2e261e', bands: false }),
    sh([P(98, 226, 1), P(142, 226, 1), [144, 244], [128, 258], [112, 258], [96, 244]], '#2e2e34', 'steel', { line: 1.1 }),
    el(120, 227, 22, 6, '#7af040', 'gem', { gloss: 1, line: 0.8 }), (lit(120, 222), null),
    ...[[114, 208, 8], [128, 192, 6], [118, 178, 5]].map(([x, y, r]) => el(x, y, r, r, '#a8f890', 'gem', { op: 0.65, line: 0 })),
    tb([[298, g - 4, 5], [298, 210, 4]], '#4a3a2a', 'wood', { line: 0.8 }), skull(298, 206, 12),
  ]);

  // 6. Арка никс: каменная арка над бирюзовой заводью, самоцвет в замковом камне, трезубец
  dw(6, 'nix', [262, 94], g => [
    ...pool(196, g - 12, 126, 22, '#2ab0b8'),
    sh([P(88, g - 16, 1), P(88, 188, 1), [102, 118], [148, 70], [196, 56], [244, 70], [290, 118], P(304, 188, 1), P(304, g - 16, 1), P(266, g - 16, 1), P(266, 196, 1), [256, 146], [196, 108], [136, 146], P(126, 196, 1), P(126, g - 16, 1)], '#cfc0a0', 'cloth', { line: 1.4,
      lines: masonry(88, 56, 304, g - 16, 28, 38, 0.32), sub: [shade(box(270, 40, 320, g), '#8e7e62', 0.8), shade(box(88, 40, 124, g), '#e6dac0', 0.5)] }),
    sh([P(182, 52, 1), P(210, 52, 1), P(206, 96, 1), P(186, 96, 1)], '#e6dac0', 'cloth', { line: 1.1 }),
    el(196, 74, 13, 15, '#5af0e0', 'gem', { gloss: 1.3, line: 1, glint: [[192, 68, 4]] }), (lit(196, 74), null),
    tb([[196, g - 18, 6], [196, 160, 5]], GOLD, 'gold', { line: 0.9 }),
    tb([[172, 138, 5], [172, 164, 5], [220, 164, 5], [220, 138, 5]], GOLD, 'gold', { line: 0.9 }), sh([P(192, 164, 1), P(196, 124, 1), P(200, 164, 1)], GOLD, 'gold', { line: 0.9 }),
    ...coral(102, g - 14, 60, '#e0506a', 1), ...coral(296, g - 14, 54, '#c85ac8', -1),
    lamp(107, 200, 6, '#9af0e8'), lamp(285, 200, 6, '#9af0e8'),
  ]);

  // 7. Морская пещера змея: скала с чёрным зевом, из воды выгибаются кольца, голова над пещерой
  dw(7, 'sea_serpent', [292, 150], g => {
    const S = '#2a8a7a', SL = '#c8e070';
    const out = [rock([P(80, g, 1), [86, 226], [112, 146], [168, 100], [236, 94], [288, 128], [312, 210], P(316, g, 1)], C.ROCK, { sd: C.ROCKD, lines: [ln([[110, 190], [124, 270]], 2.6, 0.4), ln([[292, 190], [280, 262]], 2.6, 0.4)] })];
    out.push(sh(arch(196, g, 82, 164), '#0c1822', 'cloth', { ao: 1.4, line: 1.3 }));
    out.push(...pool(198, g - 8, 124, 16, C.DEEP, '#5e5850'));
    // кольца змея из воды
    for (const [x, r] of [[150, 36], [214, 30]]) out.push(tb([[x - r, g - 10, 22], [x - r * 0.8, g - 10 - r * 1.1, 21], [x, g - 10 - r * 1.5, 20], [x + r * 0.8, g - 10 - r * 1.1, 19], [x + r, g - 10, 18]], S, 'skin', { line: 1.2, lines: [ln([[x - r * 0.7, g - 10 - r * 1.2], [x, g - 10 - r * 1.6], [x + r * 0.7, g - 10 - r * 1.2]], 5, 0.8, { c: SL })] }, { flat0: true, flat1: true }));
    // шея и голова
    out.push(tb([[266, g - 8, 30], [276, 250, 26], [262, 186, 23], [236, 128, 21], [226, 96, 19]], S, 'skin', { line: 1.3, lines: [ln([[252, 272], [258, 220], [244, 160], [232, 118]], 6, 0.8, { c: SL })] }, { flat0: true }));
    out.push(sh([P(236, 86, 1), [248, 64], P(234, 28, 1), [224, 58], P(208, 40, 1), [208, 74], P(200, 84, 1)], '#e05a4a', 'leather', { line: 1.1, lines: [ln([[232, 70], [214, 58]], 2, 0.5)] }));
    out.push(sh([P(204, 108, 1), [206, 82], [230, 68], [264, 74], P(300, 94, 1), [270, 102], P(290, 112, 1), [246, 118]], '#2f9a88', 'skin', { line: 1.3 }));
    out.push(el(244, 84, 6, 5, '#ffd040', 'gem', { gloss: 1.2, line: 0.7 })); lit(244, 84);
    out.push(sh([P(276, 104, 1), P(282, 116, 1), P(288, 106, 1)], '#f8f4e8', 'horn', { line: 0.6 }));
    return out;
  });

  /* ============================== ФАБРИКА ==============================
     Кирпич и ржавчина, сталь, медь и латунь, песок пустоши, пар и дым. */
  const F = { BR: '#a8472c', BRD: '#6c2a1a', CU: '#c8843a', BRS: '#d8a53a', ST: '#80808a', SD: '#44444e', PL: '#b07a42', PLD: '#6e4626', SAND: '#d8bc8a', SANDD: '#b0925e', RED: '#9a2a22', GRN: '#3f6a4a' };
  const brick = (x0, y0, x1, y1, o) => sh(box(x0, y0, x1, y1), (o && o.c) || F.BR, 'cloth', { line: 1.3, belly: 0.15, lines: masonry(x0, y0, x1, y1, 14, 28, 0.35, 2), sub: [shade(box(x1 - (x1 - x0) * 0.2, y0 - 2, x1 + 2, y1 + 2), F.BRD, 0.7)] });
  /** Заклёпки в ряд. */
  const rivets = (x0, x1, y, st) => { const out = []; for (let x = x0; x <= x1; x += st) out.push(ln([[x, y], [x + 0.5, y]], 5, 0.8, { c: '#2a2a30' })); return out; };
  /** Дымовая труба из кирпича / стали: низ y1, верх y0, дым. */
  function stack(x, y0, y1, w, c, sm) {
    const out = [sh(trap(x, y0, y1, w * 0.85, w), c || F.BR, 'cloth', { line: 1.2, lines: [ln([[x - w, y0 + 12], [x + w, y0 + 12]], 3, 0.6), ln([[x - w, y0 + 40], [x + w, y0 + 40]], 2.4, 0.4)], sub: [shade(box(x + w * 0.3, y0 - 2, x + w + 2, y1 + 2), F.BRD, 0.6)] }),
      sh(box(x - w - 3, y0 - 6, x + w + 3, y0 + 4), F.SD, 'steel', { line: 1 })];
    if (sm !== false) out.push(...smoke(x + 2, y0 - 16, sm || 11, 3));
    return out;
  }

  // 1. Норы полуросликов: песчаный холм с круглыми дверьми, трубы с дымком, ветряк
  dw(1, 'halfling', [250, 186], g => [
    tb([[138, 200, 5], [138, 108, 4]], F.SD, 'steel', { line: 0.8 }),
    ...[0, 1, 2, 3].map(i => { const a = i * PI / 2 + 0.4; return sh(K.leaf([138, 104], a, 36, 13).body, i % 2 ? '#e8e0cc' : F.RED, 'cloth', { line: 0.8 }); }),
    el(138, 104, 5, 5, F.BRS, 'gold', { line: 0.6 }),
    tb([[228, 196, 6], [228, 158, 6]], F.SD, 'steel', { line: 0.9 }), sh(box(220, 150, 236, 160), F.CU, 'gold', { line: 0.8 }), ...smoke(230, 138, 9, 3),
    sh([P(96, g, 1), [102, 250], [138, 200], [200, 180], [262, 196], [298, 246], P(306, g, 1)], '#b8905e', 'cloth', { line: 1.4, belly: 0.35,
      lines: [ln([[128, 236], [168, 226]], 2.4, 0.35), ln([[232, 222], [270, 236]], 2.4, 0.35)], sub: [shade([P(250, 170, 1), P(320, 170, 1), P(320, g + 4, 1), P(270, g + 4, 1)], '#8a6a44', 0.6),
        { p: [P(80, 150, 1), P(320, 150, 1), P(320, 238, 1), [282, 216], [240, 222], [200, 212], [160, 222], [124, 222], P(80, 252, 1)], c: '#6a9a3a', m: 'fur', furLen: 0.7, flow: PI / 2, line: 0 }] }),
    ...[[134, g - 12, 8, '#6a9a3a'], [284, g - 10, 7, '#7aa640']].map(([x, y, s, c]) => tuft(x, g, s / 8, c)),
    ...[[168, 32, F.GRN], [252, 24, F.RED]].flatMap(([x, r, c]) => [sh(arch(x, g, r + 8, r * 2 + 8), '#8a6a4a', 'wood', { line: 1.1 }),
      sh([P(x - r, g, 1), [x - r, g - r], [x - r * 0.7, g - r * 1.7], [x, g - r * 2], [x + r * 0.7, g - r * 1.7], [x + r, g - r], P(x + r, g, 1)], c, 'wood', { flow: -PI / 2, line: 1.2, lines: planks(x - r, g - 2 * r, x + r, g, 10, true, 0.4) }),
      el(x + r * 0.5, g - r, 4, 4, F.BRS, 'gold', { line: 0.5 })]),
    ...port(210, 222, 11, { ring: '#8a6a4a', rm: 'wood' }),
  ]);

  // 2. Мастерская: кирпичный цех с пилообразной крышей, латунная шестерня, дымовая труба
  dw(2, 'mechanic', [288, 128], g => {
    const out = [...stack(128, 84, 176, 13)];
    out.push(brick(108, 168, 302, g));
    const T = [108, 173, 238, 302], pts = [P(102, 172, 1)];
    for (let k = 0; k < 3; k++) pts.push(P(T[k], 122, 1), P(T[k + 1] - 1, 170, 1));
    pts.push(P(306, 172, 1));
    out.push(sh(pts, F.ST, 'steel', { line: 1.3, gloss: 0.6 }));
    for (let k = 0; k < 3; k++) out.push(sh([P(T[k] + 2, 128, 1), P(T[k] + 10, 136, 1), P(T[k] + 10, 164, 1), P(T[k] + 2, 164, 1)], '#bfe0f0', 'gem', { gloss: 0.9, line: 0.8 }));
    out.push(sh(box(214, 214, 290, g), '#2a1a12', 'cloth', { line: 1.3, ao: 1.2 }), sh(box(220, 220, 284, g), '#f0a848', 'gem', { rim: 0, gloss: 0.3, line: 0, op: 0.55 })); lit(252, 256);
    out.push(tb([[252, 222, 3], [252, 250, 3]], '#2a2a2a', 'flat', { line: 0 }), sh(trap(252, 250, 266, 8, 12), F.SD, 'steel', { line: 0.8 }));
    out.push(...gear(164, 230, 38, 10, F.BRS), ...gear(210, 190, 18, 8, F.CU));
    out.push(sh(box(112, g - 26, 146, g), '#9a7a4a', 'wood', { flow: 0, line: 1, lines: [ln([[112, g - 26], [146, g]], 2.4, 0.6), ln([[146, g - 26], [112, g]], 2.4, 0.6)] }));
    return out;
  });

  // 3. Амбар броненосцев: красный амбар под сегментной «бронированной» крышей, изгородь, сено
  dw(3, 'armadillo', [238, 128], g => {
    const out = [];
    for (let i = 0; i < 4; i++) { const x = 250 + i * 18; out.push(tb([[x, g, 5], [x, g - 50, 4]], F.PLD, 'wood', { line: 0.8 })); }
    out.push(tb([[246, g - 40, 4], [310, g - 40, 4]], F.PL, 'wood', { line: 0.7 }), tb([[246, g - 20, 4], [310, g - 20, 4]], F.PL, 'wood', { line: 0.7 }));
    out.push(sh(box(120, 190, 256, g), F.RED, 'wood', { flow: -PI / 2, lines: planks(120, 190, 256, g, 15, true, 0.45), sub: [shade(box(226, 186, 262, g + 4), '#5a1a14', 0.7)] }));
    const band = []; for (let i = 1; i < 7; i++) { const t = i / 7, x = 106 + t * 160; band.push(ln([[x, 202 - Math.sin(t * PI) * 10], [x + (t - 0.5) * 12, 116 + Math.pow(t - 0.5, 2) * 250]], 3.6, 0.7)); }
    out.push(sh([P(100, 204, 1), [106, 160], [138, 122], [188, 104], [238, 122], [270, 160], P(276, 204, 1), [188, 214]], '#9a8474', 'horn', { gloss: 0.7, line: 1.4, lines: band, sub: [shade([P(200, 90, 1), P(290, 110, 1), P(290, 220, 1), P(224, 220, 1)], '#6a5648', 0.6)] }));
    out.push(sh(box(154, 236, 222, g), '#f0e6d0', 'wood', { line: 1.2, sub: [{ p: box(160, 242, 216, g), c: F.RED, m: 'wood', line: 0.8, lines: [ln([[160, 242], [216, g]], 6, 1, { c: '#f0e6d0' }), ln([[216, 242], [160, g]], 6, 1, { c: '#f0e6d0' })] }] }));
    out.push(...sqwin(188, 170, 14, 14, { frame: '#f0e6d0' }));
    out.push(sh(box(272, g - 30, 310, g), '#d8b860', 'fur', { furLen: 0.5, flow: 0, line: 1, lines: [ln([[272, g - 15], [310, g - 15]], 2.4, 0.8, { c: '#8a5a20' })] }));
    return out;
  });

  // 4. Цех автоматонов: клёпаный ангар-полубочка, огненные ворота с силуэтом, шестерня, труба
  dw(4, 'automaton', [252, 150], g => {
    const out = [...stack(282, 64, 200, 12, F.SD, 12)];
    const ribs = []; for (let x = 120; x <= 280; x += 26) ribs.push(ln([[x, g], [x, 160 + Math.pow((x - 196) / 100, 2) * 72]], 3.4, 0.5));
    out.push(sh([P(98, g, 1), [100, 214], [134, 166], [196, 146], [258, 166], [292, 214], P(294, g, 1)], '#8a8a96', 'steel', { gloss: 0.9, line: 1.4, lines: ribs.concat(rivets(124, 268, 196, 16)), sub: [shade([P(236, 140, 1), P(310, 180, 1), P(310, g + 4, 1), P(252, g + 4, 1)], '#55555f', 0.7)] }));
    out.push(sh(box(148, 216, 244, g), '#2a1a12', 'cloth', { line: 1.3, ao: 1.2 }), sh(box(154, 222, 238, g), '#f0a848', 'gem', { rim: 0, gloss: 0.2, line: 0, op: 0.55 }));
    out.push(sh([P(186, g, 1), P(184, 276, 1), P(172, 266, 1), P(176, 246, 1), P(188, 242, 1), P(188, 230, 1), P(204, 230, 1), P(204, 242, 1), P(216, 246, 1), P(220, 266, 1), P(208, 276, 1), P(206, g, 1)], '#3a2a20', 'flat', { line: 0, op: 0.85 }));
    lit(170, 262); lit(222, 262);
    out.push(...gear(196, 142, 30, 10, F.BRS));
    out.push(sh(box(136, 206, 256, 216), F.CU, 'gold', { line: 1, lines: rivets(142, 250, 211, 14) }));
    return out;
  });

  // 5. Яма песчаного червя: дюна с воронкой, из неё выгибается червь с зубастой пастью, копёр
  dw(5, 'sandworm', [244, 70], g => {
    const W = '#c08a6a', WD = '#7a4a34';
    const out = [];
    // копёр позади
    out.push(tb([[208, 250, 7], [244, 72, 6]], F.PLD, 'wood', { line: 0.9 }), tb([[284, 250, 7], [244, 72, 6]], F.PLD, 'wood', { line: 0.9 }), tb([[222, 176, 4], [268, 176, 4]], F.PLD, 'wood', { line: 0.6 }));
    out.push(el(244, 78, 22, 22, '#5a5a64', 'steel', { line: 1.1, lines: Array.from({ length: 6 }, (_, i) => ln([[244, 78], [244 + Math.cos(i * PI / 3) * 20, 78 + Math.sin(i * PI / 3) * 20]], 3, 0.7)) }));
    // дюна и воронка
    out.push(sh([P(88, g, 1), [96, 272], [140, 244], [206, 236], [270, 244], [304, 268], P(312, g, 1)], F.SAND, 'cloth', { line: 1.4, belly: 0.25, lines: [ln([[118, 270], [156, 258]], 2.4, 0.35), ln([[252, 258], [290, 272]], 2.4, 0.35)] }));
    out.push(el(196, 280, 76, 20, '#7a5a38', 'cloth', { line: 1.2, ao: 1.4, sub: [el(196, 286, 52, 12, '#2a1a10', 'cloth', { line: 0 })] }));
    // тело червя: кольца-сегменты
    const seg = []; for (let i = 1; i < 6; i++) { const t = i / 6; seg.push(ln([[176 - t * 8, 280 - t * 150], [214 - t * 2, 272 - t * 150]], 3.4, 0.6, { c: WD })); }
    out.push(tb([[196, 286, 34], [186, 230, 32], [178, 180, 30], [186, 140, 30]], W, 'skin', { line: 1.4, gloss: 0.5, lines: seg }, { flat0: true }));
    // пасть: кольцо зубов
    out.push(el(192, 128, 36, 22, '#8a3a2a', 'skin', { line: 1.3, sub: [el(194, 130, 22, 12, '#2a0e0a', 'flat', { line: 0 })] }));
    for (let i = 0; i < 9; i++) { const a = i / 9 * PI * 2, x = 194 + Math.cos(a) * 27, y = 130 + Math.sin(a) * 16; out.push(sh([P(x - 4, y, 1), P(x + 4, y, 1), P(194 + Math.cos(a) * 16, 130 + Math.sin(a) * 9, 1)], '#f4ead0', 'horn', { line: 0.6 })); }
    // рёбра древнего червя справа
    for (let i = 0; i < 3; i++) { const x = 256 + i * 18; out.push(tb([[x, g - 6, 6], [x + 10, 262 - i * 6, 5], [x + 26, 250 - i * 4, 3]], '#ece2c8', 'horn', { line: 0.8 })); }
    return out;
  });

  // 6. Салун стрелков: фальшфасад со звездой шерифа, веранда, двери-крылья, мишень
  dw(6, 'gunslinger', [286, 96], g => {
    const out = [];
    out.push(sh([P(110, g, 1), P(110, 112, 1), P(132, 112, 1), P(132, 96, 1), P(178, 96, 1), P(186, 78, 1), P(220, 78, 1), P(228, 96, 1), P(274, 96, 1), P(274, 112, 1), P(292, 112, 1), P(292, g, 1)], '#b88a50', 'wood', { flow: 0, line: 1.4,
      lines: planks(110, 78, 292, g, 16, false, 0.4), sub: [shade(box(258, 70, 300, g + 4), '#7a5a30', 0.7)] }));
    out.push(sh(box(106, 150, 296, 160), F.PLD, 'wood', { flow: 0, line: 1.1 }));
    const star = []; for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, r = i % 2 ? 10 : 24; star.push(P(203 + Math.cos(a) * r, 122 + Math.sin(a) * r, 1)); }
    out.push(sh(star, GOLD, 'gold', { gloss: 1, line: 1.1 }), el(203, 122, 6, 6, '#f8e090', 'gold', { line: 0.6 }));
    out.push(...sqwin(150, 190, 16, 18, { frame: F.GRN }), ...sqwin(254, 190, 16, 18, { frame: F.GRN }));
    // веранда
    out.push(sh([P(98, 228, 1), P(304, 228, 1), P(296, 216, 1), P(106, 216, 1)], F.RED, 'cloth', { line: 1.1, lines: [ln([[140, 216], [136, 228]], 2, 0.5), ln([[200, 216], [200, 228]], 2, 0.5), ln([[260, 216], [264, 228]], 2, 0.5)] }));
    for (const x of [112, 290]) out.push(tb([[x, g, 5], [x, 228, 5]], F.PLD, 'wood', { line: 0.8 }));
    out.push(sh(box(172, 250, 232, g), '#2a1a12', 'cloth', { line: 1.1 }), sh(box(176, 256, 228, g), '#f0b050', 'gem', { rim: 0, line: 0, op: 0.5 })); lit(202, 272);
    out.push(sh([P(176, 258, 1), P(200, 262, 1), P(200, 292, 1), P(176, 290, 1)], F.PL, 'wood', { line: 1, lines: planks(176, 258, 200, 292, 6, true, 0.5) }), sh([P(204, 262, 1), P(228, 258, 1), P(228, 290, 1), P(204, 292, 1)], F.PL, 'wood', { line: 1, lines: planks(204, 258, 228, 292, 6, true, 0.5) }));
    out.push(tb([[306, g, 4], [306, 256, 4]], F.PLD, 'wood', { line: 0.8 }), el(306, 244, 16, 16, '#f0e6d0', 'cloth', { line: 1.1, sub: [el(306, 244, 11, 11, F.RED, 'flat', { line: 0 }), el(306, 244, 6, 6, '#f0e6d0', 'flat', { line: 0 }), el(306, 244, 2.6, 2.6, F.RED, 'flat', { line: 0 })] }));
    return out;
  });

  // 7. Пирамида коатля: ступенчатая пирамида, храм на вершине, гнездо из ярких перьев, жаровни
  dw(7, 'couatl', [262, 150], g => {
    const out = [], S = ['#caa878', '#d4b484', '#c09c6c', '#d8bc8e'];
    for (let i = 0; i < 4; i++) { const y1 = g - i * 38, y0 = y1 - 38, hw = 106 - i * 20; out.push(sh(box(200 - hw, y0, 200 + hw, y1), S[i], 'cloth', { line: 1.3, lines: masonry(200 - hw, y0, 200 + hw, y1, 19, 28, 0.3), sub: [shade(box(200 + hw * 0.55, y0 - 2, 200 + hw + 2, y1 + 2), '#8a6a44', 0.6)] })); }
    const stl = []; for (let y = 164; y < g; y += 14) stl.push(ln([[178, y], [222, y]], 2.4, 0.55));
    out.push(sh(trap(200, 156, g, 20, 30), '#e4cca0', 'cloth', { line: 1.1, lines: stl }));
    for (const s of [-1, 1]) out.push(sh([P(200 + s * 32, g, 1), P(200 + s * 32, g - 26, 1), [200 + s * 44, g - 36], P(200 + s * 60, g - 30, 1), P(200 + s * 62, g - 14, 1), P(200 + s * 50, g - 8, 1), P(200 + s * 48, g, 1)], '#3a9a6a', 'skin', { line: 1, glint: [[200 + s * 50, g - 28, 3.5]] }));
    out.push(sh(box(160, 104, 240, 156), '#c09a6a', 'cloth', { line: 1.3, lines: masonry(160, 104, 240, 156, 17, 26, 0.35), sub: [shade(box(214, 100, 244, 160), '#8a6a44', 0.6)] }));
    out.push(sh(box(184, 118, 216, 156), '#2a1a10', 'cloth', { line: 1 }), sh(box(188, 122, 212, 156), '#ffb050', 'gem', { rim: 0, line: 0, op: 0.55 })); lit(200, 138);
    out.push(sh(box(152, 94, 248, 106), F.CU, 'gold', { line: 1.1, lines: rivets(158, 244, 100, 14) }));
    const FE = ['#2f8a4a', '#c8322a', '#3fa06a', '#e0a030', '#2a6a9a'];
    for (let i = 0; i < 9; i++) { const a = PI * (1.1 + i * 0.8 / 8), L = 40 + (i % 3) * 12, x = 200 + Math.cos(a) * 40; out.push(sh(K.leaf([x, 90], a, L, 14).body, FE[i % FE.length], 'feather', { texSize: 0.6, line: 0.9 })); }
    out.push(sh([P(140, 96, 1), [168, 78], [200, 72], [232, 78], P(260, 96, 1), [200, 102]], '#8a6a3a', 'wood', { flow: 0.2, line: 1.1 }));
    for (const x of [112, 288]) { out.push(sh(trap(x, 212, 228, 16, 10), F.CU, 'gold', { line: 1 })); out.push(sh([P(x - 12, 212, 1), [x - 10, 196], P(x - 3, 182, 1), [x, 194], P(x + 4, 176, 1), [x + 10, 196], P(x + 12, 212, 1)], '#ff9a2a', 'flat', { line: 0.6, lc: '#a8401a', sub: [sh([P(x - 6, 212, 1), P(x, 190, 1), P(x + 6, 212, 1)], '#ffe070', 'flat', { line: 0 })] })); lit(x, 198); }
    return out;
  });

  /* ============================== УЛЕЙ ==============================
     Воск и янтарь, оливковый хитин, кислотная зелень, мёд. */
  const Hv = { WAX: '#d8b048', WAXL: '#e8c868', WAXD: '#9a7428', CH: '#4e5e1c', CHL: '#7a8a2a', AMB: '#ffb020', RES: '#8a5a18', ACID: '#9ae040', EARTH: '#8a6a44', EGG: '#f2ead0' };
  /** Восковой потёк. */
  const drip = (x, y, h) => sh([P(x - 6, y, 1), P(x + 6, y, 1), [x + 5, y + h * 0.7], [x, y + h], [x - 5, y + h * 0.7]], Hv.WAXL, 'leather', { gloss: 0.8, line: 0.8 });
  /** Яйцо. */
  const egg = (x, y, rx, ry) => el(x, y, rx, ry, Hv.EGG, 'skin', { gloss: 1, line: 1, glint: [[x - rx * 0.35, y - ry * 0.4, rx * 0.22]] });
  /** Хитиновый шип-рог: основание (x, g), вершина (tx, ty). */
  const spike = (x, g, tx, ty, w, c) => tb([[x, g, w], [(x + tx) / 2 + (tx > x ? -6 : 6), (g + ty) / 2, w * 0.7], [tx, ty, 1.5]], c || Hv.CH, 'horn', { gloss: 0.8, line: 1 });

  // 1. Кладка: восковая колыбель с грудой яиц, стенка сот позади
  dw(1, 'larva', [262, 176], g => [
    sh([P(116, g, 1), P(110, 206, 1), [150, 166], [200, 156], [250, 166], P(290, 206, 1), P(284, g, 1)], Hv.WAXD, 'leather', { gloss: 0.3, line: 1.3, lines: comb(110, 156, 290, g, 14, 0.5, 2.2), sub: [shade([P(250, 150, 1), P(300, 150, 1), P(300, g + 4, 1), P(262, g + 4, 1)], '#6a4e18', 0.6)] }),
    ...[[144, 202], [256, 204]].flatMap(([x, y]) => [el(x, y, 12, 11, Hv.AMB, 'gem', { gloss: 1, line: 1 }), (lit(x, y), null)]),
    ...[[162, 262, 22], [238, 262, 22], [200, 256, 26], [178, 222, 20], [222, 222, 20], [200, 192, 17]].map(([x, y, r]) => egg(x, y, r * 0.8, r)),
    sh([P(112, 262, 1), [128, 298], [200, 310], [272, 298], P(288, 262, 1), [256, 278], [200, 284], [144, 278]], Hv.WAX, 'leather', { gloss: 0.6, line: 1.3, lines: [ln([[130, 280], [200, 294], [270, 280]], 2.4, 0.4, { light: true })] }),
    drip(140, 282, 18), drip(252, 284, 22),
  ]);

  // 2. Муравейник рабочих: земляной конус с восковыми окнами-ходами, шпиль
  dw(2, 'worker', [246, 150], g => [
    spike(280, g - 20, 292, 104, 18, Hv.CHL),
    sh([P(98, g, 1), [120, 232], [160, 160], P(200, 104, 1), [240, 156], [278, 230], P(302, g, 1)], Hv.EARTH, 'cloth', { line: 1.4, belly: 0.3,
      lines: [[-70, 50], [-40, 110], [26, 130], [56, 70], [-10, 30]].map(([dx, dy]) => ln([[200 + dx, g - dy], [200 + dx + 24, g - dy - 5]], 2.4, 0.4)), sub: [shade([P(214, 96, 1), P(320, 250, 1), P(320, g + 4, 1), P(236, g + 4, 1)], '#5e4628', 0.7)] }),
    ...[[170, 206, 14], [232, 176, 12], [196, 144, 10]].flatMap(([x, y, r]) => [el(x, y, r + 7, r + 5, Hv.WAX, 'leather', { line: 1 }), el(x, y + 2, r, r * 0.8, Hv.AMB, 'gem', { gloss: 0.8, line: 0.9 }), (lit(x, y), null)]),
    el(200, 104, 14, 8, Hv.WAX, 'leather', { line: 1 }),
    el(200, g - 36, 40, 42, Hv.WAX, 'leather', { gloss: 0.5, line: 1.2 }), hole(200, g, 26, 62, '#1a1006'), glow(200, g, 20, 50, '#ffb040', 0.35),
    sh([P(110, g, 1), [120, g - 20], [140, g - 26], [158, g - 14], P(166, g, 1)], '#a0805a', 'cloth', { line: 1 }), sh([P(244, g, 1), [254, g - 18], [276, g - 22], P(292, g, 1)], '#a0805a', 'cloth', { line: 1 }),
  ]);

  // 3. Кислотная яма плевунов: смоляная труба с зелёным паром, яма с кислотой, хитиновые шипы
  dw(3, 'spitter', [244, 120], g => [
    ...smoke(212, 92, 12, 3, '170,230,110'),
    sh([P(170, g - 20, 1), [178, 180], [196, 112], P(212, 102, 1), P(228, 104, 1), [242, 150], [256, 230], P(266, g - 20, 1)], Hv.CH, 'horn', { gloss: 0.5, line: 1.4,
      lines: [ln([[186, 220], [250, 214]], 3, 0.5), ln([[196, 160], [240, 158]], 3, 0.5)], sub: [shade([P(226, 96, 1), P(280, 96, 1), P(280, g, 1), P(240, g, 1)], '#2e3a10', 0.7)] }),
    el(220, 104, 14, 6, Hv.ACID, 'gem', { gloss: 1, line: 0.9 }),
    sh(tube([[226, 108, 4], [232, 140, 3], [230, 160, 2]]), Hv.ACID, 'gem', { line: 0.6, op: 0.9 }),
    el(196, g - 16, 104, 24, '#6a5a2a', 'cloth', { line: 1.3, ao: 0.6 }),
    el(196, g - 18, 84, 15, Hv.ACID, 'gem', { gloss: 1.2, line: 1, lines: [ln([[140, g - 22], [176, g - 24]], 2.6, 0.7, { light: true })] }), (lit(196, g - 18), null),
    ...[[160, g - 24, 7], [214, g - 20, 5], [236, g - 26, 6]].map(([x, y, r]) => el(x, y, r, r * 0.8, '#d8ff90', 'gem', { gloss: 1, line: 0.6 })),
    spike(106, g - 8, 94, 190, 17), spike(130, g - 2, 152, 214, 14), spike(288, g - 8, 302, 184, 17), spike(262, g - 2, 242, 218, 14),
  ]);

  // 4. Осиное гнездо: бумажное гнездо полосами на кривом суку, вход-леток, осы
  dw(4, 'wasp_warrior', [274, 84], g => {
    const out = [];
    out.push(tb([[284, g, 16], [290, 220, 12], [276, 140, 10], [272, 92, 8], [230, 80, 6], [192, 86, 5]], '#5a4630', 'wood', { line: 1.2, flow: -PI / 2 }));
    out.push(sh([P(286, g, 1), [270, g - 6], [262, g], [300, g], [310, g - 8]], '#4a3a26', 'wood', { line: 1 }));
    const bands = []; for (let i = 1; i < 9; i++) { const y = 100 + i * 20, w = Math.sin(Math.min(1, i / 8 * 1.2) * PI) * 70 + 16; bands.push(ln([[200 - w, y - 4], [200 - w * 0.5, y + 4], [200, y - 2], [200 + w * 0.5, y + 4], [200 + w, y - 4]], 3, 0.55, { c: '#6a5020' })); }
    out.push(sh([P(186, 90, 1), [150, 116], [124, 170], [124, 226], [146, 272], [200, 290], [254, 272], [276, 226], [272, 170], [248, 116], P(214, 90, 1)], '#c8a45a', 'leather', { gloss: 0.3, line: 1.4, lc: '#4a3410', lines: bands, sub: [shade([P(220, 80, 1), P(300, 80, 1), P(300, 300, 1), P(236, 300, 1)], '#8a6a30', 0.55)] }));
    out.push(el(200, 262, 20, 14, '#1a1006', 'cloth', { line: 1.1, ao: 1.2 }), el(200, 264, 12, 7, Hv.AMB, 'gem', { op: 0.5, line: 0 })); lit(200, 262);
    for (const [x, y, k] of [[118, 132, 1], [292, 170, 0.8], [150, 60, 0.9]]) out.push(
      sh(K.leaf([x - 2, y - 4], -PI * 0.65, 20 * k, 11 * k).body, '#e8f4ff', 'flat', { op: 0.7, line: 0.6 }),
      el(x, y, 12 * k, 7 * k, '#f0c020', 'leather', { line: 1, lines: [ln([[x - 4 * k, y - 7 * k], [x - 4 * k, y + 7 * k]], 3.4 * k, 1, { c: '#1a1a14' }), ln([[x + 3 * k, y - 7 * k], [x + 3 * k, y + 7 * k]], 3.4 * k, 1, { c: '#1a1a14' })] }),
      el(x + 13 * k, y - 1, 5 * k, 5 * k, '#1a1a14', 'horn', { line: 0.6 }));
    return out;
  });

  // 5. Нора богомола: земляной холм, над ним голова-купол богомола с глазами-окнами, серпы по бокам
  dw(5, 'mantis', [258, 132], g => {
    const G = '#6aa83a', GD = '#3e6a22';
    const out = [];
    out.push(tb([[176, 126, 3], [160, 84, 2.4], [132, 62, 2]], GD, 'horn', { line: 0.7 }), tb([[224, 126, 3], [240, 84, 2.4], [268, 62, 2]], GD, 'horn', { line: 0.7 }));
    out.push(sh([P(112, 150, 1), [130, 120], [200, 110], [270, 120], P(288, 150, 1), [262, 188], [226, 226], P(200, 248, 1), [174, 226], [138, 188]], G, 'horn', { gloss: 0.8, line: 1.4, sub: [shade([P(214, 100, 1), P(300, 100, 1), P(300, 250, 1), P(214, 250, 1)], GD, 0.5)] }));
    out.push(el(142, 148, 26, 22, '#c8f060', 'gem', { gloss: 1.3, line: 1.2, lc: '#2a3a10', glint: [[134, 140, 6]] }), el(258, 148, 26, 22, '#c8f060', 'gem', { gloss: 1.3, line: 1.2, lc: '#2a3a10', glint: [[250, 140, 6]] })); lit(142, 148); lit(258, 148);
    out.push(sh([P(98, g, 1), [110, 246], [150, 214], [200, 206], [250, 214], [290, 246], P(302, g, 1)], Hv.EARTH, 'cloth', { line: 1.4, belly: 0.3, sub: [shade([P(250, 200, 1), P(320, 200, 1), P(320, g + 4, 1), P(266, g + 4, 1)], '#5e4628', 0.7)] }));
    out.push(hole(200, g, 28, 70, '#140e06', { pointed: true }), glow(200, g, 20, 50, '#ffb040', 0.4));
    // серпы-передние лапы: сложены по бокам входа
    for (const s of [-1, 1]) {
      const x = 200 + s * 62;
      out.push(tb([[x, g - 6, 12], [x + s * 10, 236, 10], [x - s * 4, 196, 8]], G, 'horn', { line: 1.2 }));
      out.push(sh([P(x - s * 4, 190, 1), [x + s * 18, 204], [x + s * 30, 238], P(x + s * 26, 272, 1), [x + s * 18, 244], P(x + s * 2, 206, 1)], '#8ac84a', 'horn', { gloss: 0.9, line: 1.1,
        lines: [ln([[x + s * 20, 216], [x + s * 26, 214]], 2.4, 0.8), ln([[x + s * 26, 232], [x + s * 32, 230]], 2.4, 0.8)] }));
    }
    return out;
  });

  // 6. Панцирь жука-тарана: огромный блестящий панцирь с рогом, вход под ним, ноги-опоры
  dw(6, 'ram_beetle', [228, 106], g => {
    const B = '#3e5a34', BD = '#243620';
    const out = [];
    for (const [x0, x1] of [[120, 100], [170, 162], [236, 250], [276, 300]]) out.push(tb([[x0, g - 40, 10], [(x0 + x1) / 2 + (x1 > x0 ? 8 : -8), g - 30, 9], [x1, g, 7]], BD, 'horn', { gloss: 0.6, line: 1 }));
    out.push(sh([P(102, g - 30, 1), [102, 210], [130, 142], [190, 108], [250, 118], [290, 164], P(300, g - 30, 1), [200, g - 20]], B, 'horn', { gloss: 1.3, line: 1.5, lc: '#10180c',
      lines: [ln([[196, 110], [196, g - 24]], 3.4, 0.8, { c: BD }), ln([[132, 180], [170, 136]], 4, 0.55, { light: true }), ln([[226, 128], [262, 154]], 3, 0.4, { light: true })],
      sub: [shade([P(240, 100, 1), P(320, 150, 1), P(320, g, 1), P(262, g, 1)], BD, 0.55)] }));
    out.push(sh([P(262, 190, 1), [272, 150], [292, 120], P(300, 70, 1), [312, 118], [300, 160], P(290, 196, 1)], '#b89a5a', 'horn', { gloss: 1, line: 1.3 }));
    out.push(sh([P(140, g - 24, 1), [148, g - 60], [200, g - 72], [252, g - 60], P(260, g - 24, 1), [200, g - 18]], '#2a2012', 'cloth', { line: 1.1, ao: 1.2 }));
    out.push(hole(200, g, 26, 60, '#140e06'), glow(200, g, 18, 46, Hv.AMB, 0.45));
    out.push(...[[152, 214], [240, 212]].flatMap(([x, y]) => [el(x, y, 11, 9, Hv.AMB, 'gem', { gloss: 1.1, line: 1 }), (lit(x, y), null)]));
    return out;
  });

  // 7. Купол матки: восковой купол в сотах, барабан с янтарными окнами, хитиновые рёбра и шпили-корона
  dw(7, 'queen', [264, 118], g => {
    const out = [];
    for (const [x, h] of [[164, 58], [236, 58]]) out.push(spike(x, 110, x + (x < 200 ? -8 : 8), h, 10, Hv.CH));
    out.push(spike(200, 96, 200, 34, 13, Hv.CH));
    out.push(sh(box(94, 226, 306, g), Hv.WAX, 'leather', { gloss: 0.4, line: 1.4, lines: comb(94, 226, 306, g, 13, 0.45, 2), sub: [shade(box(262, 222, 310, g + 4), Hv.WAXD, 0.6)] }));
    out.push(sh([P(104, 234, 1), [110, 170], [146, 116], [200, 94], [254, 116], [290, 170], P(296, 234, 1)], Hv.WAXL, 'leather', { gloss: 0.7, line: 1.4, lines: comb(104, 94, 296, 234, 15, 0.4, 2.2), sub: [shade([P(236, 90, 1), P(310, 150, 1), P(310, 240, 1), P(258, 240, 1)], '#b89040', 0.55)] }));
    for (const s of [-1, 0.45, -0.45, 1]) out.push(tb([[200 + s * 94, 232, 7], [200 + s * 80, 160, 6], [200 + s * 40, 110, 5], [200, 96, 4]], Hv.CH, 'horn', { gloss: 0.7, line: 1 }));
    out.push(sh(box(90, 222, 310, 236), Hv.RES, 'wood', { line: 1.1 }));
    out.push(...[[128, 264], [272, 264]].flatMap(([x, y]) => [sh(arch(x, y + 16, 12, 34), Hv.AMB, 'gem', { gloss: 0.8, line: 1.1, lc: '#4a2a08' }), (lit(x, y), null)]));
    out.push(el(200, 160, 16, 16, '#ffd060', 'gem', { gloss: 1.4, line: 1.1 })); lit(200, 160);
    out.push(sh(arch(200, g, 34, 74, true), Hv.RES, 'wood', { line: 1.2 }), hole(200, g, 26, 64, '#1a1006', { pointed: true }), glow(200, g, 20, 50, Hv.AMB, 0.5));
    return out;
  });

  /* ============================== БАСТИОН ==============================
     Брёвна и мох, шкуры и кость, ели, зелёные руны. */
  const Bn = { LOG: '#8a5a30', LOGL: '#b0804a', LOGD: '#5a3a1c', MOSS: '#5f8a2e', MOSSD: '#3e6a22', HIDE: '#c49a68', BONE: '#e8dcc0', STONE: '#8e8a7e', RED: '#a8322a', BARK: '#6a4a2c', RUNE: '#8af0c0' };
  const LEAF = ['#2a5a20', '#3e7a2a', '#52902e', '#6aa838'];
  /** Дерновая крыша (скаты с мхом): от x0 до x1, свес y, высота h. */
  const sod = (x0, x1, y, h, c) => sh([P(x0 - 14, y, 1), P((x0 + x1) / 2, y - h, 1), P(x1 + 14, y, 1), [x1, y + 8], [(x0 + x1) / 2, y + 4], [x0, y + 8]], c || Bn.MOSS, 'fur', { furLen: 0.8, flow: PI / 2, dens: 1.1, belly: 0.3, line: 1.3,
    sub: [shade([P((x0 + x1) / 2 + 2, y - h - 4, 1), P(x1 + 20, y - 4, 1), P(x1 + 20, y + 12, 1), P((x0 + x1) / 2 + 20, y + 12, 1)], Bn.MOSSD, 0.7)] });
  /** Рога (оленьи): основание (x, y), сторона s, размах k, цвет c. */
  function antler(x, y, s, k, c, m) {
    const wk = k < 0.6 ? 1 : 1.5, pts = [[x, y, 7 * k * wk], [x + s * 20 * k, y - 40 * k, 6 * k * wk], [x + s * 30 * k, y - 90 * k, 5 * k * wk], [x + s * 22 * k, y - 140 * k, 3.4 * k * wk]];
    const out = [tb(pts, c, m || 'horn', { line: 1, gloss: 0.8 })];
    for (const [t, dx, dy] of [[0, 30, -14], [1, 34, -26], [2, 30, -30], [2, -12, -34]]) { const b = pts[t], bx = t === 0 ? x + s * 10 * k : (b[0] + pts[t + 1][0]) / 2, by = t === 0 ? y - 20 * k : (b[1] + pts[t + 1][1]) / 2; out.push(tb([[bx, by, 4.5 * k * wk], [bx + s * dx * k, by + dy * k, 2 * k * wk]], c, m || 'horn', { line: 0.9, gloss: 0.8 })); }
    return out;
  }

  // 1. Логово лесной рыси: полое бревно во мху, в торце светятся глаза, куст позади
  dw(1, 'forest_cat', [240, 184], g => [
    ...foliage(206, 214, 92, 48, 5, LEAF, 5, { leaf: 0.7 }),
    tb([[120, g - 34, 64], [276, g - 38, 60]], Bn.BARK, 'wood', { flow: 0, line: 1.4, lines: [ln([[128, g - 52], [270, g - 56]], 2.6, 0.45), ln([[140, g - 18], [260, g - 20]], 2.6, 0.45)] }),
    sh([P(112, g - 62, 1), [160, g - 78], [220, g - 74], P(270, g - 66, 1), [220, g - 56], [160, g - 58]], Bn.MOSS, 'fur', { furLen: 0.6, flow: PI / 2, line: 1 }),
    el(278, g - 38, 30, 34, Bn.LOGL, 'wood', { line: 1.2, lines: [ln(ell(278, g - 38, 22, 25, 12).concat([[300, g - 38]]), 2.2, 0.5)] }),
    el(280, g - 36, 20, 24, '#140e06', 'cloth', { line: 1 }),
    el(273, g - 40, 4.5, 3.2, '#d8f060', 'gem', { line: 0, gloss: 1.2 }), el(287, g - 40, 4.5, 3.2, '#d8f060', 'gem', { line: 0, gloss: 1.2 }), (lit(280, g - 40), null),
    ...[0, 1, 2].map(i => sh(tube([[164 + i * 9, g - 50, 2], [170 + i * 9, g - 22, 1.5]]), '#e8d0a8', 'flat', { line: 0, op: 0.8 })),
    tuft(112, g, 1), tuft(300, g, 0.8, '#5a9a34'),
  ]);

  // 2. Сторожка следопыта: сруб с дерновой крышей, лук и колчан на фронтоне, ель
  dw(2, 'tracker', [220, 134], g => [
    ...pine(282, g, 230, 42),
    ...logWall(118, 200, 262, g),
    sod(118, 262, 206, 84),
    sh([P(150, 204, 1), P(190, 150, 1), P(230, 204, 1)], Bn.LOGL, 'wood', { flow: 0, line: 1.1, lines: planks(150, 150, 230, 204, 12, false, 0.5) }),
    tb([[166, 182, 3], [190, 164, 4], [214, 182, 3]], '#6a3a1a', 'wood', { line: 0.8 }), sh(tube([[166, 183, 1], [214, 183, 1]]), '#e8dcc0', 'flat', { line: 0 }),
    sh([P(236, 174, 1), P(248, 170, 1), P(252, 196, 1), P(240, 198, 1)], Bn.HIDE, 'leather', { line: 0.9 }), ...[238, 244].map(x => tb([[x, 172, 1.5], [x - 2, 156, 1.5]], '#e8dcc0', 'flat', { line: 0.5 })),
    ...door(170, g, 18, 60, { c: Bn.LOGD }), ...sqwin(228, 246, 13, 14, { frame: Bn.LOGD }),
  ]);

  // 3. Загон кабана: частокол полукругом, навес под соломой, клыки над воротами, лужа
  dw(3, 'boar', [252, 150], g => {
    const out = [];
    out.push(sh(box(146, 178, 262, 240), Bn.LOGD, 'wood', { line: 1.1 }));
    out.push(sh([P(130, 186, 1), [170, 150], P(208, 124, 1), [246, 150], P(284, 186, 1), [208, 194]], '#c8a858', 'fur', { furLen: 1.1, flow: PI / 2, dens: 1.2, belly: 0.3, line: 1.3 }));
    // частокол
    const pts = [P(96, g, 1)], lines = [];
    let i = 0;
    for (let x = 96; x < 300; x += 17, i++) {
      if (x > 180 && x < 226) { pts.push(P(x, 244, 1), P(x + 17, 244, 1)); continue; }
      const t = 222 + (i % 3 === 1 ? 7 : i % 3 === 2 ? 3 : 0);
      pts.push(P(x + 1, t + 14, 1), P(x + 8.5, t, 1), P(x + 16, t + 14, 1));
      if (x > 96) lines.push(ln([[x, t + 14], [x, g]], 2.2, 0.55));
    }
    pts.push(P(304, g, 1));
    lines.push(ln([[96, 256], [304, 256]], 5, 0.9, { c: '#4a3420' }), ln([[96, 286], [304, 286]], 5, 0.9, { c: '#4a3420' }));
    out.push(sh(pts, Bn.LOG, 'wood', { flow: -PI / 2, line: 1.3, lines, belly: 0.3, sub: [shade(box(250, 200, 310, g + 4), '#4e3016', 0.55)] }));
    out.push(sh(box(186, 250, 226, g), '#2a1a0c', 'cloth', { line: 1 }), sh(box(190, 254, 222, g), Bn.LOGL, 'wood', { flow: -PI / 2, line: 0.9, lines: planks(190, 254, 222, g, 8, true, 0.5) }));
    out.push(tb([[180, 244, 5], [232, 244, 5]], Bn.LOGD, 'wood', { line: 0.8 }));
    for (const s of [-1, 1]) out.push(tb([[206 + s * 6, 236, 6], [206 + s * 22, 222, 4.5], [206 + s * 20, 202, 2]], Bn.BONE, 'horn', { line: 0.9, gloss: 0.8 }));
    out.push(sh([P(196, 242, 1), [194, 230], [206, 222], [218, 230], P(216, 242, 1)], '#4a3a2c', 'fur', { furLen: 0.5, line: 1 }));
    out.push(el(262, g - 2, 26, 6, '#5a4028', 'gem', { gloss: 0.6, line: 0.8 }));
    return out;
  });

  // 4. Логово росомахи: груда валунов под корнями кривой сосны, чёрный лаз с глазами, кости
  dw(4, 'wolverine', [256, 140], g => {
    const out = [];
    out.push(tb([[224, 170, 12], [240, 124, 9], [226, 90, 7], [246, 60, 5]], Bn.BARK, 'wood', { line: 1, flow: -PI / 2 }), tb([[236, 110, 5], [270, 96, 3]], Bn.BARK, 'wood', { line: 0.8 }));
    out.push(...foliage(246, 70, 46, 24, 3, ['#2a4a24', '#3a5e2a', '#4a6e30'], 11, { leaf: 0.7 }), ...foliage(276, 96, 26, 14, 2, ['#2a4a24', '#3a5e2a'], 12, { leaf: 0.7 }));
    out.push(rock([P(98, g, 1), [104, 250], [128, 204], [168, 176], [218, 162], [262, 174], [296, 222], P(306, g, 1)], '#7a766c', { sd: '#4a4640', lines: [ln([[140, 220], [196, 206]], 2.6, 0.5), ln([[228, 196], [276, 230]], 2.6, 0.5), ln([[166, 180], [176, 214]], 2.6, 0.5)] }));
    for (const [x0, y0, x1, y1] of [[206, 170, 150, 212], [230, 168, 286, 214], [218, 170, 196, 230]]) out.push(tb([[x0, y0, 6], [(x0 + x1) / 2, (y0 + y1) / 2 - 8, 4.5], [x1, y1, 2]], Bn.BARK, 'wood', { line: 0.9 }));
    out.push(sh([P(160, g, 1), [158, 262], [178, 236], [206, 230], [232, 240], [246, 266], P(248, g, 1)], '#120c08', 'cloth', { line: 1.2, ao: 1.4 }));
    out.push(el(194, 262, 4.5, 3.2, '#ffc040', 'gem', { line: 0, gloss: 1.2 }), el(210, 262, 4.5, 3.2, '#ffc040', 'gem', { line: 0, gloss: 1.2 })); lit(202, 262);
    for (const [x0, y0] of [[124, 240], [262, 226]]) for (let k = 0; k < 3; k++) out.push(sh(tube([[x0 + k * 8, y0, 2.4], [x0 + k * 8 + 8, y0 + 26, 1.4]]), '#e8e0d0', 'flat', { line: 0, op: 0.8 }));
    out.push(tb([[256, g - 6, 4], [292, g - 12, 4]], Bn.BONE, 'horn', { line: 0.9 }), el(254, g - 6, 6, 5, Bn.BONE, 'horn', { line: 0.8 }), el(294, g - 12, 6, 5, Bn.BONE, 'horn', { line: 0.8 }), skull(128, g - 10, 12, Bn.BONE));
    return out;
  });

  // 5. Изба ловчих: двухъярусная изба под крутой крышей, рога на фронтоне, растянутая шкура
  dw(5, 'ranger', [266, 118], g => {
    const out = [];
    // рама со шкурой справа
    out.push(tb([[272, g, 5], [274, 200, 5]], Bn.LOGD, 'wood', { line: 0.8 }), tb([[308, g, 5], [306, 200, 5]], Bn.LOGD, 'wood', { line: 0.8 }), tb([[266, 206, 4], [314, 206, 4]], Bn.LOGD, 'wood', { line: 0.8 }));
    out.push(sh([P(276, 212, 1), [290, 216], P(304, 212, 1), [300, 240], P(306, 266, 1), [290, 262], P(274, 268, 1), [280, 240]], Bn.HIDE, 'leather', { line: 1.1, lines: [ln([[290, 220], [290, 258]], 2, 0.4)] }));
    out.push(...logWall(112, 150, 262, g));
    out.push(sh([P(98, 158, 1), P(187, 64, 1), P(276, 158, 1), [262, 164], [187, 158], [112, 164]], '#6a4a2c', 'wood', { flow: -PI / 2, line: 1.4,
      lines: [ln([[126, 140], [248, 140]], 2.4, 0.5), ln([[146, 118], [228, 118]], 2.4, 0.5), ln([[166, 96], [208, 96]], 2.4, 0.5)], sub: [shade([P(189, 56, 1), P(290, 150, 1), P(290, 170, 1), P(189, 170, 1)], '#43301c', 0.6)] }));
    out.push(sh([P(150, 150, 1), P(187, 104, 1), P(224, 150, 1)], Bn.LOGL, 'wood', { flow: 0, line: 1, lines: planks(150, 104, 224, 150, 11, false, 0.5) }));
    out.push(...sqwin(187, 134, 10, 10, { frame: Bn.LOGD }));
    out.push(...antler(180, 100, -1, 0.42, Bn.BONE), ...antler(194, 100, 1, 0.42, Bn.BONE), el(187, 102, 9, 7, Bn.HIDE, 'fur', { line: 0.8 }));
    out.push(sh(box(108, 196, 266, 204), Bn.LOGD, 'wood', { line: 1 }));
    out.push(...door(160, g, 20, 64, { c: Bn.LOGD }), ...sqwin(226, 246, 13, 14, { frame: Bn.LOGD }), ...sqwin(140, 176, 10, 10, { frame: Bn.LOGD }), ...sqwin(234, 176, 10, 10, { frame: Bn.LOGD }));
    out.push(lamp(192, 254, 6));
    return out;
  });

  // 6. Берлога медведя: мшистый холм под корнями могучего дуба, широкий лаз, следы когтей, улей
  dw(6, 'bear', [276, 186], g => {
    const out = [];
    out.push(...trunkRoots(176, 190, 110, 16));
    out.push(...foliage(186, 96, 104, 60, 6, LEAF, 21, { leaf: 0.8 }));
    out.push(sh([P(90, g, 1), [96, 240], [134, 188], [196, 168], [260, 180], [300, 232], P(310, g, 1)], '#6a5a38', 'cloth', { line: 1.4, belly: 0.35,
      sub: [shade([P(250, 160, 1), P(320, 160, 1), P(320, g + 4, 1), P(270, g + 4, 1)], '#43381e', 0.7), { p: [P(90, 200, 1), [150, 176], [200, 170], [256, 180], P(320, 210, 1), P(320, 214, 1), [256, 200], [200, 192], [150, 196], P(90, 222, 1)], c: Bn.MOSS, m: 'fur', furLen: 0.7, flow: PI / 2, line: 0 }] }));
    out.push(sh(arch(206, g, 54, 88), '#3a2e1c', 'cloth', { line: 1.2 }), hole(206, g, 44, 78, '#0e0a06'));
    for (const [x0, y0] of [[132, 222], [268, 214]]) for (let k = 0; k < 4; k++) out.push(sh(tube([[x0 + k * 9, y0, 3], [x0 + k * 9 + 10, y0 + 34, 1.6]]), '#2a2014', 'flat', { line: 0, op: 0.75 }));
    out.push(tb([[112, 150, 2], [112, 164, 2]], '#3a2a14', 'flat', { line: 0 }), el(112, 180, 14, 18, '#d8a040', 'leather', { gloss: 0.6, line: 1.1, lines: [ln([[98, 174], [126, 174]], 2.4, 0.6), ln([[99, 186], [125, 186]], 2.4, 0.6)] }), el(112, 190, 4, 3, '#1a1006', 'flat', { line: 0 }));
    out.push(sh([P(252, g, 1), [256, g - 14], [276, g - 18], [292, g - 8], P(296, g, 1)], Bn.STONE, 'horn', { line: 1 }));
    return out;
  });
  /** Ствол с корнями, уходящими в холм. */
  function trunkRoots(x, y0, y1, w) {
    return [tb([[x, y0 + 20, w * 1.6], [x + 4, (y0 + y1) / 2, w * 1.1], [x, y1, w]], Bn.BARK, 'wood', { flow: -PI / 2, line: 1.2, lines: [ln([[x - 4, y0], [x - 2, y1 + 10]], 2, 0.45)] })];
  }

  // 7. Поляна великого оленя: круг стоячих камней с рунами, алтарь и огромные золотые рога
  dw(7, 'great_stag', [296, 176], g => {
    const out = [];
    const stoneS = (x, w, h, rune) => { const s = sh([P(x - w, g, 1), [x - w * 1.05, g - h * 0.5], [x - w * 0.7, g - h], [x + w * 0.4, g - h * 1.02], [x + w, g - h * 0.6], P(x + w * 0.9, g, 1)], Bn.STONE, 'horn', { gloss: 0.2, line: 1.2, belly: 0.3, lines: [ln([[x - w * 0.3, g - h * 0.3], [x + w * 0.2, g - h * 0.7]], 2, 0.4)] });
      if (rune) { s.lines.push(ln([[x, g - h * 0.78], [x, g - h * 0.34], [x - w * 0.4, g - h * 0.55], [x + w * 0.4, g - h * 0.62]], 4.4, 1, { c: Bn.RUNE })); lit(x, g - h * 0.55); } return s; };
    out.push(el(200, g - 6, 116, 16, '#6aa040', 'fur', { furLen: 0.5, flow: PI / 2, line: 0.9 }));
    out.push(stoneS(116, 14, 90, true), stoneS(284, 14, 96, true), stoneS(150, 11, 60), stoneS(252, 11, 64));
    out.push(sh(trap(200, g - 60, g, 46, 54), Bn.STONE, 'horn', { gloss: 0.2, line: 1.3, lines: [ln([[156, g - 40], [244, g - 40]], 2.4, 0.4)], sub: [shade(box(222, g - 64, 260, g + 4), '#5e5a50', 0.6)] }));
    out.push(sh(box(142, g - 72, 258, g - 58), '#a8a498', 'horn', { line: 1.2 }));
    out.push(...antler(186, g - 76, -1, 1.02, '#e0b040', 'gold'), ...antler(214, g - 76, 1, 1.02, '#e0b040', 'gold'));
    out.push(sh([P(180, g - 88, 1), [186, g - 100], [200, g - 104], [214, g - 100], P(220, g - 88, 1), [210, g - 72], P(204, g - 52, 1), P(196, g - 52, 1), [190, g - 72]], '#f0e6cc', 'horn', { line: 1.2, sub: [el(190, g - 86, 4, 5, '#2a2018', 'flat', { line: 0 }), el(210, g - 86, 4, 5, '#2a2018', 'flat', { line: 0 })] }));
    out.push(el(200, g - 30, 10, 14, Bn.RUNE, 'gem', { gloss: 1.2, line: 1 })); lit(200, g - 30);
    out.push(tuft(172, g, 0.8, '#5a9a34'), tuft(236, g, 0.9, '#5a9a34'));
    return out;
  });
})(typeof window !== 'undefined' ? window : globalThis);
