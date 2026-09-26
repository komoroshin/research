/* ============================================================================
   view/vec_mapobj.js — объекты карты, осада и боевые машины на рисованном конвейере.

   Шахты и ресурсы, находки и постройки карты, море, сокровищницы, стены замка
   для осады и три боевые машины (баллиста, палатка лекаря, повозка с боеприпасом).
   Рамки — от старых спрайтов (K.frameOf), дизайн-единицы: 10 на клетку пиксельного
   спрайта; рисунок стоит основанием в anchor рамки и занимает ту же площадь.

   Цвета-подмены: '$b' / '$B' — цвет игрока и его тёмный оттенок (боевые машины
   в бою получают подмену; на карте её нет — берётся запасной цвет),
   '$r' — цвет ключа у хранителя ключа и пограничной заставы.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf, mapShapes } = K;

  /* ---------- краски ---------- */
  const STONE = '#a49e92', STONE_D = '#7e786e', MARBLE = '#e4e0d6', SLATE = '#4e5260',
    WOOD = '#8a5a32', WOOD_D = '#654022', PLANK = '#a8743e', LOG = '#9a6a3c',
    ROOF = '#b8442e', THATCH = '#d6ae4a', EARTH = '#b49464', SAND = '#dcc48a', DIRT = '#7a5c3a',
    IRON = '#55555e', GOLD = '#e0b040', DARK = '#17131a', WATER = '#3a86c0', LEAF = '#4a8a32',
    ROPE = '#d8c8a0', TEAM = '$b:#3060c8', TEAM_D = '$B:#1c3a80';

  /* ---------- общие помощники ---------- */
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  /** Форма по контуру / эллипсом; o — прочие поля формы. */
  const sh = (p, c, m, o) => Object.assign({ p, c, m: m || 'cloth' }, o);
  const el = (cx, cy, rx, ry, c, m, o) => Object.assign({ e: [cx, cy, rx, ry], c, m: m || 'cloth' }, o);
  /** Прямоугольник с острыми углами. */
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  /** Штрих: w — толщина, a — сила; o — { light, c, closed }. */
  const ln = (p, w, a, o) => Object.assign({ p, w: w || 1.2, a: a || 0.5 }, o);

  /**
   * Объект карты: одна часть-«корпус», рамка старого спрайта.
   * o.dy — опустить якорь (до 12 ед.), если у старого спрайта под якорем много земли:
   * рамка обрезается на 26 ед. ниже якоря, ниже рисовать нельзя.
   */
  function obj(name, build, o) {
    o = o || {};
    const fr = frameOf(name) || o.frame; if (!fr) return;
    const anchor = [fr.anchor[0], fr.anchor[1] + (o.dy || 0)];
    const shapes = build(fr, rngOf(hash(name)));
    V.def(name, { w: fr.w, h: Math.min(fr.h, anchor[1] + 26), anchor, parts: [{ kind: 'torso', pivot: anchor.slice(), shapes }], meta: o.meta });
  }
  /** Боевая машина — «существо»: корпус (обязателен) и, если нужно, реквизит. */
  function machine(name, build) {
    const fr = frameOf(name); if (!fr) return;
    V.def(name, { w: fr.w, h: Math.min(fr.h, fr.anchor[1] + 26), anchor: fr.anchor, parts: build(fr) });
  }
  /** Перенести готовые формы: локальные (0,0) → (cx, by), масштаб k. */
  const place = (list, cx, by, k) => mapShapes(list, (x, y) => [cx + x * k, by + y * k], k);

  /** Кладка: ряды и вертикальные швы вразбежку. */
  function bricks(x0, y0, x1, y1, rh, bw) {
    const out = [];
    for (let y = y0 + rh; y < y1 - 2; y += rh) { out.push(ln([[x0 + 1, y], [x1 - 1, y]], 1.3, 0.55)); out.push(ln([[x0 + 1, y + 1.8], [x1 - 1, y + 1.8]], 0.9, 0.3, { light: true })); }
    let row = 0;
    for (let y = y0; y < y1 - 2; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 3; x += bw) out.push(ln([[x, y + 1], [x, Math.min(y1, y + rh) - 1]], 1.1, 0.45));
    return out;
  }
  /** Каменная стена прямоугольником. */
  const wall = (x0, y0, x1, y1, c, rh, bw, o) => sh(box(x0, y0, x1, y1), c || STONE, 'horn', Object.assign({ gloss: 0.12, lines: bricks(x0, y0, x1, y1, rh || 12, bw || 22) }, o));
  /** Швы бревенчатого сруба. */
  function logLines(x0, y0, x1, y1, lh) {
    const out = [];
    for (let y = y0 + lh; y < y1 - 1; y += lh) { out.push(ln([[x0, y], [x1, y]], 1.8, 0.75)); out.push(ln([[x0, y + 2.2], [x1, y + 2.2]], 1, 0.35, { light: true })); }
    return out;
  }
  const logWall = (x0, y0, x1, y1, c, lh) => sh(box(x0, y0, x1, y1), c || LOG, 'wood', { flow: 0, lines: logLines(x0, y0, x1, y1, lh || 11), gloss: 0.1 });
  /** Скат крыши, видимый спереди (конёк вдоль фасада): трапеция с рядами черепицы. */
  function roof(x0, x1, yE, yR, c, o) {
    o = o || {}; const ov = o.ov === undefined ? 10 : o.ov, ins = o.ins === undefined ? 18 : o.ins, rows = o.rows || 4;
    const pts = [P(x0 - ov, yE, 1), P(x0 + ins, yR, 1), P(x1 - ins, yR, 1), P(x1 + ov, yE, 1)];
    const lines = [];
    for (let i = 1; i < rows; i++) {
      const t = i / rows, y = yR + (yE - yR) * t, xa = x0 + ins - (ins + ov) * t, xb = x1 - ins + (ins + ov) * t;
      lines.push(ln([[xa + 2, y], [xb - 2, y]], 1.5, 0.6));
      if (o.tiles) { const y0 = yR + (yE - yR) * (i - 1) / rows; for (let x = xa + 6 + (i % 2) * 6; x < xb - 4; x += 12) lines.push(ln([[x, y0 + 1], [x, y - 1]], 1, 0.4)); }
    }
    lines.push(ln([[x0 + ins, yR + 1.5], [x1 - ins, yR + 1.5]], 1.2, 0.55, { light: true }));
    return sh(pts, c || ROOF, o.m || 'leather', { lines, gloss: 0.2, belly: 0.25 });
  }
  /** Фронтон: треугольник крыши торцом к нам. */
  const gable = (cx, yE, yR, hw, c, o) => sh([P(cx - hw, yE, 1), P(cx, yR, 1), P(cx + hw, yE, 1)], c, 'leather', Object.assign({ gloss: 0.15, belly: 0.3 }, o));
  /** Окно с переплётом и тёплым светом. */
  const win = (cx, cy, w, h, o) => { o = o || {}; return [
    sh(box(cx - w / 2 - 2.5, cy - h / 2 - 2.5, cx + w / 2 + 2.5, cy + h / 2 + 2.5), o.frame || WOOD_D, 'wood', { line: 0.6 }),
    sh(box(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), o.glass || '#ffcf5a', 'gem', { line: 0.3, gloss: 0.5, lines: [ln([[cx, cy - h / 2], [cx, cy + h / 2]], 1.6, 0.9, { c: '#5a3a1c' }), ln([[cx - w / 2, cy], [cx + w / 2, cy]], 1.6, 0.9, { c: '#5a3a1c' })] })]; };
  /** Арка: прямые стороны и полукруглый верх. */
  function arch(cx, yb, w, h) {
    const r = w / 2, yc = yb - h + r, pts = [P(cx - r, yb, 1)];
    for (let i = 0; i <= 6; i++) { const a = Math.PI + i / 6 * Math.PI; pts.push([cx + Math.cos(a) * r, yc + Math.sin(a) * r]); }
    pts.push(P(cx + r, yb, 1)); return pts;
  }
  /** Дверь досками с коваными полосами. */
  function door(cx, yb, w, h, c, o) {
    o = o || {}; const lines = [];
    for (let x = cx - w / 2 + w / 4; x < cx + w / 2 - 1; x += w / 4) lines.push(ln([[x, yb - h + w * 0.15], [x, yb]], 1.1, 0.55));
    if (!o.nobands) lines.push(ln([[cx - w / 2, yb - h * 0.28], [cx + w / 2, yb - h * 0.28]], 2.2, 0.8, { c: IRON }), ln([[cx - w / 2, yb - h * 0.68], [cx + w / 2, yb - h * 0.68]], 2.2, 0.8, { c: IRON }));
    return sh(o.square ? box(cx - w / 2, yb - h, cx + w / 2, yb) : arch(cx, yb, w, h), c || PLANK, 'wood', { flow: -Math.PI / 2, lines, glint: o.ring ? [[cx + w * 0.25, yb - h * 0.45, 2.5]] : undefined });
  }
  /** Тёмный проём. */
  const hole = (cx, yb, w, h, o) => sh(arch(cx, yb, w, h), DARK, 'cloth', Object.assign({ line: 0.7, rim: 0 }, o));
  /** Флаг на древке: x — древко, yb/yt — низ и верх, len×h — полотнище; o.tri — треугольный вымпел. */
  function flag(x, yb, yt, len, h, c, o) {
    o = o || {}; const out = [sh(tube([[x, yb, o.pw || 3.6], [x, yt, (o.pw || 3.6) * 0.8]]), o.pole || '#4a3020', 'wood', { line: 0.6 })];
    const y = yt + 2;
    const pts = o.tri
      ? [P(x + 1, y, 1), [x + len * 0.35, y + h * 0.08], [x + len * 0.7, y + h * 0.3], P(x + len, y + h * 0.45, 1), [x + len * 0.66, y + h * 0.62], [x + len * 0.33, y + h * 0.82], P(x + 1, y + h, 1)]
      : [P(x + 1, y, 1), [x + len * 0.35, y - 3], [x + len * 0.68, y + 2], P(x + len, y - 1, 1), P(x + len * 0.82, y + h * 0.5, 1), P(x + len, y + h + 1, 1), [x + len * 0.68, y + h + 3], [x + len * 0.35, y + h - 2], P(x + 1, y + h, 1)];
    out.push(sh(pts, c, 'cloth', { line: 0.7, lines: [ln([[x + len * 0.3, y + h * 0.15], [x + len * 0.42, y + h * 0.7]], 1.2, 0.35)] }));
    out.push(el(x, yt - 2, 3.2, 3.2, GOLD, 'gold', { line: 0.5 }));
    return out;
  }
  /** Бочка: пузатая, с обручами и крышкой. */
  function barrel(cx, yb, w, h, c) {
    c = c || '#9a6636';
    return [sh([P(cx - w * 0.42, yb, 1), [cx - w / 2, yb - h / 2], P(cx - w * 0.42, yb - h, 1), P(cx + w * 0.42, yb - h, 1), [cx + w / 2, yb - h / 2], P(cx + w * 0.42, yb, 1)], c, 'wood',
      { flow: -Math.PI / 2, lines: [0.2, 0.8].map(t => ln([[cx - w * 0.47, yb - h * t], [cx, yb - h * t + 2], [cx + w * 0.47, yb - h * t]], 2.2, 0.85, { c: IRON }))
        .concat([ln([[cx - w * 0.15, yb - 2], [cx - w * 0.18, yb - h + 2]], 1, 0.4), ln([[cx + w * 0.18, yb - 2], [cx + w * 0.2, yb - h + 2]], 1, 0.4)]) }),
    el(cx, yb - h, w * 0.42, w * 0.13, tone(c, 0.25), 'wood', { line: 0.6 })];
  }
  /** Колесо со спицами. */
  function wheel(cx, cy, r, c, o) {
    o = o || {}; c = c || WOOD_D; const n = o.n || 8, lines = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (o.a || 0); lines.push(ln([[cx + Math.cos(a) * r * 0.2, cy + Math.sin(a) * r * 0.2], [cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8]], Math.max(1.6, r * 0.13), 1, { c: tone(c, 0.15) })); }
    return [el(cx, cy, r, r, c, 'wood', { gloss: 0.15, sub: [el(cx, cy, r * 0.76, r * 0.76, tone(c, -0.55), 'flat', { line: 0 })], lines }),
      el(cx, cy, r * 0.22, r * 0.22, o.hub || IRON, 'steel', { line: 0.6 })];
  }
  /** Кольцо трубкой (обод большого колеса, обруч). */
  function ring(cx, cy, rx, ry, w, n) { n = n || 24; const pts = []; for (let i = 0; i <= n + 1; i++) { const a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, w]); } return tube(pts); }
  /** Арочный обод: полоса толщиной t по верхней половине эллипса (cx, yc, rx, ry), концы уходят вниз на ext. */
  function archBand(cx, yc, rx, ry, t, ext) {
    const o = [], n = 12, R = [rx + t / 2, ry + t / 2], r = [rx - t / 2, ry - t / 2];
    o.push(P(cx - R[0], yc + ext, 1));
    for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI; o.push([cx + Math.cos(a) * R[0], yc + Math.sin(a) * R[1]]); }
    o.push(P(cx + R[0], yc + ext, 1), P(cx + r[0], yc + ext, 1));
    for (let i = n; i >= 0; i--) { const a = Math.PI + i / n * Math.PI; o.push([cx + Math.cos(a) * r[0], yc + Math.sin(a) * r[1]]); }
    o.push(P(cx - r[0], yc + ext, 1));
    return o;
  }
  /** Валун с гранью. */
  const boulder = (cx, cy, rx, ry, c, a) => ({ p: ell(cx, cy, rx, ry, 8, a || 0).map((p, i) => [p[0] + (i % 3 - 1) * rx * 0.08, p[1] + (i % 2) * ry * 0.06]), c, m: 'horn', gloss: 0.2,
    lines: [{ p: [[cx - rx * 0.3, cy - ry * 0.4], [cx, cy + ry * 0.1], [cx + rx * 0.2, cy + ry * 0.5]], w: 1, a: 0.35 }] });
  /** Пятно земли под постройкой. */
  const patch = (cx, cy, rx, ry, c, o) => el(cx, cy, rx, ry, c || EARTH, 'cloth', Object.assign({ line: 0.6, ao: 0.5, belly: 0.3 }, o));
  /** Вода: синяя с бликами-рябью. */
  const water = (cx, cy, rx, ry, c, o) => el(cx, cy, rx, ry, c || WATER, 'gem', Object.assign({ gloss: 0.7, rim: 0.4, line: 0.6,
    lines: [ln([[cx - rx * 0.5, cy - ry * 0.2], [cx - rx * 0.1, cy - ry * 0.28]], 1.4, 0.6, { light: true }), ln([[cx + rx * 0.05, cy + ry * 0.2], [cx + rx * 0.45, cy + ry * 0.12]], 1.2, 0.5, { light: true })] }, o));
  /** Друза кристаллов: острые призмы веером. */
  function crystals(cx, base, cols, n, H, W) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const x = cx - W / 2 + i * (W / (n - 1)), mid = i === (n >> 1), h = H * (mid ? 1 : 0.5 + (i % 3) * 0.18), w = (mid ? 13 : 10) * W / 100, lean = (i - (n - 1) / 2) * 0.16;
      out.push({ p: [P(x - w, base, 1), P(x - w * 0.8 + lean * h, base - h * 0.84, 1), P(x + lean * h, base - h, 1), P(x + w * 0.8 + lean * h, base - h * 0.84, 1), P(x + w, base, 1)], c: cols[i % cols.length], m: 'gem', gloss: 1.1, rim: 0.6,
        lines: [{ p: [[x, base - 2], [x + lean * h, base - h + 4]], w: 1.2, light: true, a: 0.7 }] });
    }
    // сначала крайние, потом ближе к середине, центральная — поверх всех
    return [out[0], out[n - 1], ...out.slice(1, n - 1).filter((_, i) => i !== (n >> 1) - 1), out[n >> 1]];
  }

  /* =================================================================== ресурсы
     Кучи ресурса в локальных координатах: (0,0) — низ по центру, ширина ~110.
     Те же кучи лежат у шахт (уменьшенные) и в вагонетке. */
  function ingot(x, y, w) {
    const c = '#e6b030', h = 11, d = 7;
    return [sh([P(x - w / 2 + d, y - h, 1), P(x + w / 2 - d, y - h, 1), P(x + w / 2 - d - 5, y - h - 6, 1), P(x - w / 2 + d + 5, y - h - 6, 1)], tone(c, 0.35), 'gold', { line: 0.6 }),
      sh([P(x - w / 2, y, 1), P(x + w / 2, y, 1), P(x + w / 2 - d, y - h, 1), P(x - w / 2 + d, y - h, 1)], c, 'gold', { line: 0.7, glint: [[x - w * 0.18, y - h * 0.5, 2.6]] })];
  }
  function logEnd(x, y, r) {
    return [sh(tube([[x, y, r * 2], [x - 20, y - 9, r * 1.9]], { flat0: true }), LOG, 'wood', { flow: Math.atan2(-9, -20), line: 0.7 }),
      el(x, y, r * 0.92, r, '#dcb47a', 'wood', { line: 0.7, lines: [ln(ell(x, y, r * 0.56, r * 0.6, 10), 1, 0.5, { closed: true }), ln(ell(x, y, r * 0.22, r * 0.25, 8), 1, 0.5, { closed: true })] })];
  }
  function cutGem(x, y, r, c) {
    return sh([P(x - r, y - r * 0.55, 1), P(x - r * 0.5, y - r * 1.1, 1), P(x + r * 0.5, y - r * 1.1, 1), P(x + r, y - r * 0.55, 1), P(x, y, 1)], c, 'gem', { gloss: 1.2, rim: 0.7, line: 0.7,
      lines: [ln([[x - r, y - r * 0.55], [x + r, y - r * 0.55]], 1, 0.5), ln([[x - r * 0.5, y - r * 0.55], [x, y]], 0.9, 0.4), ln([[x + r * 0.5, y - r * 0.55], [x, y]], 0.9, 0.4)], glint: [[x - r * 0.35, y - r * 0.8, r * 0.35]] });
  }
  const RES = {
    gold: () => [...ingot(-38, 0, 36), ...ingot(0, 0, 36), ...ingot(38, 0, 36), ...ingot(-19, -12, 36), ...ingot(19, -12, 36), ...ingot(0, -24, 36)],
    wood: () => [...logEnd(-16, 0, 11.5), ...logEnd(8, 0, 11.5), ...logEnd(32, 0, 11.5), ...logEnd(-4, -21, 11.5), ...logEnd(20, -21, 11.5), ...logEnd(8, -42, 11.5)],
    ore: () => [boulder(22, -28, 16, 11, '#9a6a58'), boulder(-30, -12, 22, 13, '#8a8a90'), boulder(30, -11, 22, 12, '#7c7c84'), boulder(0, -24, 22, 15, '#9a9aa0'), boulder(-6, -7, 18, 8, '#72727a')]
      .map((s, i) => Object.assign(s, { glint: [[s.p[0][0] - 10 - i * 2, s.p[0][1] - 4, 2.4]] })),
    mercury: () => [
      el(-34, -7, 15, 8, '#5ab4dc', 'steel', { gloss: 1.3, glint: [[-38, -10, 3.4]] }), el(36, -7, 16, 8.5, '#5ab4dc', 'steel', { gloss: 1.3, glint: [[32, -10, 3.6]] }), el(-52, -14, 7, 5, '#5ab4dc', 'steel', { glint: [[-53, -16, 2.2]] }), el(54, -16, 6, 4.5, '#5ab4dc', 'steel', { glint: [[53, -17, 2]] }),
      sh(tube([[0, -34, 12], [0, -52, 10]], { flat1: true }), '#b0e2f2', 'gem', { gloss: 1, line: 0.6 }),
      sh(box(-7, -60, 7, -50), '#9a6a3c', 'wood', { line: 0.6 }),
      el(0, -19, 22, 19, '#b0e2f2', 'gem', { gloss: 1.2, rim: 0.8, line: 0.7, sub: [el(0, -5, 24, 14, '#48a8d4', 'steel', { line: 0 })], glint: [[-8, -28, 4.5], [10, -10, 2]] })],
    sulfur: () => [['#e8b020', -30, -10, 20, 11], ['#f2c832', 28, -10, 22, 11], ['#f6d850', -4, -22, 22, 15], ['#eab82a', 14, -32, 13, 9], ['#f0c02c', -8, -6, 16, 7]]
      .map(([c, x, y, rx, ry]) => Object.assign(boulder(x, y, rx, ry, c), { gloss: 0.5, glint: [[x - rx * 0.3, y - ry * 0.35, 2.4]] })),
    crystal: () => [boulder(0, -6, 44, 8, '#8a8a96'), ...crystals(0, -4, ['#eaf8ff', '#c4e6f8', '#a8d8f2'], 5, 80, 86)],
    gems: () => [boulder(0, -6, 46, 9, '#7a7068'), ...crystals(0, -6, ['#3cc060', '#58d474', '#2aa850'], 3, 76, 50), cutGem(-36, 0, 15, '#e03048'), cutGem(38, 0, 15, '#3a6ae0'), cutGem(-12, 2, 10, '#f0c030')],
  };
  const RES_IDS = ['gold', 'wood', 'ore', 'mercury', 'sulfur', 'crystal', 'gems'];
  for (const r of RES_IDS) obj('res_' + r, f => place(RES[r](), f.anchor[0], 124, 1.15));

  /* =================================================================== шахты
     У каждой добычи свой промысел, как в оригинале: золото — штольня в холме, дерево — лесопилка
     с водяным колесом, руда — открытый карьер с воротом, ртуть — алхимическая лаборатория, сера —
     дымящиеся дюны, кристаллы — пещера в друзах, самоцветы — пруд. Под землёй руда, сера и самоцветы
     добываются штольней в скале с жилой своего цвета.

     На каждую шахту четыре рисунка: 'mine_<res>' — для интерфейса (всё на месте, дым нарисован);
     'mine_<res>#g' / '#s' / '#u' — для карты на обычной земле, на снегу и под землёй: без подвижных
     деталей (их карта кладёт сверху — колесо и пила крутятся, бадья ходит, дым идёт частицами).
     Служебные точки карты — в meta: flag (основание древка флажка владельца), smoke (дым: точка, цвет,
     частота), lights (окна ночью), anim (подвижная деталь: имя рисунка, точка, spin рад/с или bob),
     rope (канат от блока к бадье), sparkle (искры на камнях), glow (свечение из глубины).
     Ткань цвета владельца — токен '$b' (на ничьей шахте серая). */
  const OWN = '$b:#9a968c', OWN_D = '$B:#6a665e';
  const SNOW = '#f2f6fa';
  const puff = (x, y, r, a, c) => el(x, y, r, r * 0.86, 'rgba(' + (c || '236,236,228') + ',' + (a || 0.5) + ')', 'flat', { line: 0 });
  const flame = (x, y, h, w) => sh([P(x - w, y, 1), [x - w * 0.9, y - h * 0.4], P(x - w * 0.3, y - h * 0.8, 1), [x, y - h * 0.5], P(x + w * 0.2, y - h, 1), [x + w * 0.9, y - h * 0.35], P(x + w, y, 1)], '#ff9a2a', 'flat',
    { line: 0.5, lc: '#a8401a', sub: [sh([P(x - w * 0.5, y, 1), [x - w * 0.3, y - h * 0.4], P(x, y - h * 0.62, 1), [x + w * 0.35, y - h * 0.3], P(x + w * 0.5, y, 1)], '#ffe070', 'flat', { line: 0 })] });
  /** Снеговая шапка: полоса по линии pts толщиной t (сверху выпуклая, снизу неровная). */
  function snowCap(pts, t) {
    const top = pts.map(p => [p[0], p[1] - 2]), bot = pts.slice().reverse().map((p, i) => [p[0], p[1] + t * (0.55 + 0.45 * ((i * 7) % 3) / 2)]);
    return sh([...top, ...bot], SNOW, 'cloth', { line: 0.5, lc: '#9ab0c4', ao: 0.25, hi: 0.4 });
  }
  /** Вымпел цвета владельца: древко (x, yb→yt) и треугольное полотнище. */
  const pennant = (x, yb, yt, len) => [sh(tube([[x, yb, 3], [x, yt, 2.4]]), '#4a3020', 'wood', { line: 0.5 }),
    sh([P(x + 1, yt + 1, 1), [x + len * 0.5, yt + 5], P(x + len, yt + 9, 1), [x + len * 0.5, yt + 13], P(x + 1, yt + 17, 1)], OWN, 'cloth', { line: 0.6 })];
  /** Земля под объектом: трава / снег / камень подземелья. */
  const ground = (E, cx, cy, rx, ry, c) => patch(cx, cy, rx, ry, E.under ? '#4e4854' : E.snow ? '#e4ecf2' : c, { ao: 0.3 });
  /** Вагонетка на рельсах с добычей rid (x — середина, y — низ колёс). */
  function cart(x, y, rid, k) {
    k = k || 1; const L = (a, b) => [x + a * k, y + b * k];
    return [...place(RES[rid](), x, y - 36 * k, 0.8 * k),
      sh([P(...L(-42, -48), 1), P(...L(42, -48), 1), P(...L(34, -2), 1), P(...L(-34, -2), 1)], '#8a5a32', 'wood', { flow: 0,
        sub: [sh([P(...L(-40, -30), 1), P(...L(40, -30), 1), P(...L(38, -20), 1), P(...L(-38, -20), 1)], OWN, 'cloth', { line: 0 })],
        lines: [ln([L(-40, -46), L(40, -46)], 2.4, 0.6, { light: true }), ln([L(-39, -44), L(-32, -4)], 3, 0.8, { c: IRON }), ln([L(39, -44), L(32, -4)], 3, 0.8, { c: IRON })] }),
      ...wheel(x - 20 * k, y + 6 * k, 11 * k, '#3e3830', { n: 6 }), ...wheel(x + 20 * k, y + 6 * k, 11 * k, '#3e3830', { n: 6, a: 0.4 })];
  }
  /** Рельсы: подсыпка, шпалы, две нити (x0…x1 у земли y). */
  function rails(x0, x1, y) {
    const sleepers = []; for (let x = x0 + 8; x < x1; x += 15) sleepers.push(ln([[x, y - 12], [x - 3, y + 1]], 4, 0.9, { c: '#5a3a1c' }));
    return sh([P(x0, y + 4, 1), P(x1, y + 2, 1), P(x1 - 2, y - 12, 1), P(x0 + 4, y - 11, 1)], '#6e6254', 'cloth', { line: 0.4, ao: 0.4,
      lines: [...sleepers, ln([[x0 + 2, y - 9], [x1 - 2, y - 10]], 2, 0.9, { c: '#c8ccd4' }), ln([[x0, y - 1], [x1, y - 2]], 2.2, 0.9, { c: '#c8ccd4' })] });
  }

  /* ---------- штольня в холме: золото везде, руда / сера / самоцветы под землёй ---------- */
  const VEIN = { gold: ['#f0c040', '#ffe070'], ore: ['#b06a4a', '#d08a60'], sulfur: ['#eec830', '#fff070'], gems: ['#e03048', '#3cc060', '#3a6ae0'], crystal: ['#eaf8ff', '#c4e6f8'] };
  function shaft(rid, E) {
    const out = [], R = E.under ? ['#5e5866', '#77707e', '#48434e', '#8a8392'] : ['#8c857a', '#a8a194', '#6c665e', '#b8b1a4'];
    out.push(sh([P(14, 288, 1), [22, 238], [44, 186], [74, 140], [112, 110], [162, 96], [214, 104], [256, 130], [288, 172], [308, 226], P(316, 288, 1)], R[0], 'horn', { gloss: 0.12, belly: 0.35 }));
    out.push(sh([P(30, 260, 1), [48, 196], [80, 146], [118, 114], P(160, 100, 1), [138, 132], [112, 170], [84, 230], P(70, 276, 1)], R[1], 'horn', { gloss: 0.1, line: 0.4, ao: 0.4 }));
    out.push(sh([P(214, 106, 1), [252, 134], [286, 176], [304, 226], P(310, 282, 1), [276, 262], [252, 206], [232, 150]], R[2], 'horn', { gloss: 0.05, line: 0.4, ao: 0.5 }));
    out.push(sh([[120, 124], [164, 112], [200, 120], [176, 132], [140, 134]], R[3], 'horn', { line: 0.3, ao: 0.3 }));
    // жилы своего цвета по скале — сразу видно, что здесь добывают
    const vc = VEIN[rid] || VEIN.gold, vl = [];
    [[[54, 222], [70, 204], [66, 186], [84, 170]], [[178, 124], [198, 136], [206, 158]], [[246, 176], [262, 196], [258, 214], [276, 232]], [[190, 104], [212, 118]], [[40, 256], [56, 244]]]
      .forEach((pts, i) => vl.push(sh(tube(pts.map(p => [p[0], p[1], 4 + (i % 2)])), vc[i % vc.length], rid === 'gems' || rid === 'crystal' ? 'gem' : 'gold', { line: 0.5, gloss: 0.9 })));
    out.push(...vl);
    if (rid === 'gems') [[70, 196, '#e03048'], [200, 140, '#3cc060'], [264, 206, '#3a6ae0']].forEach(([x, y, c]) => out.push(cutGem(x, y, 7, c)));
    if (E.snow) out.push(snowCap([[44, 190], [74, 144], [112, 114], [162, 100], [214, 108], [256, 134], [286, 176]], 12));
    out.push(boulder(292, 272, 20, 12, R[2]), boulder(36, 276, 16, 10, R[0]));
    // штольня: проём, крепь, фонарь; на верхняке — вымпел цвета владельца
    out.push(sh([P(86, 278, 1), [86, 176], [96, 160], [118, 152], [140, 160], [150, 176], P(150, 278, 1)], DARK, 'cloth', { line: 0.6, rim: 0,
      lines: [ln([[104, 278], [112, 214]], 2, 0.5, { c: '#4a4450' }), ln([[132, 278], [124, 214]], 2, 0.5, { c: '#4a4450' })] }));
    out.push(sh(tube([[80, 282, 13], [80, 150, 11]], { flat0: true, flat1: true }), WOOD, 'wood', { flow: -Math.PI / 2, line: 0.8 }));
    out.push(sh(tube([[156, 282, 13], [156, 150, 11]], { flat0: true, flat1: true }), WOOD, 'wood', { flow: -Math.PI / 2, line: 0.8 }));
    out.push(sh(tube([[66, 152, 15], [170, 146, 15]], { flat0: true, flat1: true }), '#7a4e2a', 'wood', { flow: 0, line: 0.8 }));
    out.push(sh([P(98, 156, 1), P(138, 154, 1), P(136, 178, 1), [118, 172], P(100, 180, 1)], OWN, 'cloth', { line: 0.6, lines: [ln([[104, 162], [132, 160]], 1.4, 0.5, { c: OWN_D })] }));
    if (E.snow) out.push(snowCap([[64, 144], [118, 141], [172, 138]], 7));
    out.push(sh(tube([[168, 162, 2.4], [168, 172, 2.4]]), IRON, 'steel', { line: 0.4 }), el(168, 180, 7, 9, '#ffb040', 'gem', { gloss: 1.3, lc: '#6a3a10', glint: [[166, 177, 3.5]] }));
    out.push(rails(110, 306, 284));
    out.push(...cart(244, 262, rid, 0.85));
    out.push(...place(RES[rid](), 64, 290, 1.1));
    return out;
  }
  const shaftMeta = rid => ({ flag: [196, 106], lights: [[168, 180]], smoke: [],
    sparkle: rid === 'gold' ? [[40, 280], [64, 262], [90, 282], [236, 214]] : rid === 'gems' ? [[70, 196], [200, 140], [264, 206], [60, 272]] : [] });

  /* ---------- лесопилка ---------- */
  // водяное колесо и дисковая пила — отдельные рисунки: на карте они крутятся
  const WHEEL_R = 46;
  function waterWheel(cx, cy) {
    const pads = [];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + 0.13; pads.push(sh(tube([[cx + Math.cos(a) * (WHEEL_R - 6), cy + Math.sin(a) * (WHEEL_R - 6), 10], [cx + Math.cos(a) * (WHEEL_R + 11), cy + Math.sin(a) * (WHEEL_R + 11), 10]], { flat0: true, flat1: true }), PLANK, 'wood', { line: 0.6 })); }
    return [...pads, ...wheel(cx, cy, WHEEL_R, WOOD_D, { n: 8, hub: IRON })];
  }
  function sawBlade(cx, cy) {
    const teeth = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, rr = i % 2 ? 25 : 31; teeth.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1)); }
    return [sh(teeth, '#c8ccd4', 'steel', { gloss: 1.1, line: 0.6, sub: [el(cx, cy, 17, 17, '#a8aeb8', 'steel', { line: 0, lines: [ln([[cx - 12, cy], [cx + 12, cy]], 1.4, 0.5), ln([[cx, cy - 12], [cx, cy + 12]], 1.4, 0.5)] })], glint: [[cx - 10, cy - 10, 4]] }),
      el(cx, cy, 5, 5, IRON, 'steel', { line: 0.5 })];
  }
  const WW = [50, 212], SAW = [214, 222];
  function sawmill(E) {
    const out = [];
    out.push(ground(E, 190, 282, 138, 13, '#9a7a4e'));
    out.push(water(50, 282, 50, 11, E.under ? '#2a5a88' : '#3a86c0'));
    if (E.still) out.push(...waterWheel(...WW));
    out.push(puff(18, 272, 9, 0.55, '240,250,255'), puff(84, 274, 7, 0.5, '240,250,255'));
    out.push(logWall(106, 150, 262, 282, LOG, 12));
    out.push(roof(106, 262, 154, 96, E.snow ? '#6a5034' : '#7a5634', { m: 'wood', rows: 4, ov: 12 }));
    if (E.snow) out.push(snowCap([[94, 152], [124, 96], [244, 96], [274, 152]], 11));
    out.push(...win(134, 196, 18, 20));
    out.push(sh(box(166, 182, 256, 282), '#2a2018', 'cloth', { line: 0.7, rim: 0 }));
    // полосатый навес над пролётом — цвет владельца
    out.push(sh([P(160, 172, 1), P(262, 172, 1), P(256, 188, 1), P(166, 188, 1)], OWN, 'cloth', { line: 0.6,
      lines: [180, 196, 212, 228, 244].map(x => ln([[x, 173], [x - 1, 187]], 5, 0.35, { c: OWN_D }))
    }));
    if (E.still) out.push(...sawBlade(...SAW));
    out.push(sh(box(160, 256, 262, 268), '#6a4424', 'wood', { flow: 0, line: 0.7 }), sh(tube([[172, 268, 7], [172, 282, 7]], { flat0: true, flat1: true }), '#5a3a1c', 'wood'), sh(tube([[250, 268, 7], [250, 282, 7]], { flat0: true, flat1: true }), '#5a3a1c', 'wood'));
    out.push(sh(tube([[126, 247, 17], [196, 247, 17]], { flat0: true, flat1: true }), LOG, 'wood', { flow: 0, line: 0.7 }), el(126, 247, 7, 8.5, '#dcb47a', 'wood', { line: 0.6, lines: [ln(ell(126, 247, 4, 5, 8), 0.9, 0.5, { closed: true })] }));
    for (let i = 0; i < 9; i++) out.push(el(186 + i * 7 - (i % 3) * 3, 280 - (i % 2) * 2, 3, 1.6, '#e8cc8a', 'flat', { line: 0 }));
    for (let i = 0; i < 5; i++) { const y = 284 - i * 8; out.push(sh(box(266 - i * 1.5, y - 8, 322 - i * 2, y), i % 2 ? '#c89458' : '#b8844a', 'wood', { flow: 0, line: 0.6, lines: [ln([[268, y - 6.5], [320 - i * 2, y - 6.5]], 1, 0.5, { light: true })] })); }
    if (E.snow) out.push(snowCap([[262, 244], [292, 243], [318, 245]], 5));
    out.push(...place(RES.wood(), 294, 246, 0.46));
    return out;
  }
  const sawmillMeta = () => ({ flag: [236, 98], lights: [[134, 196]], smoke: [],
    anim: [{ name: 'mine_wood.wheel', at: WW, spin: 0.9 }, { name: 'mine_wood.saw', at: SAW, spin: 9 }] });

  /* ---------- рудный карьер ---------- */
  const PULLEY = [160, 116], BUCKET = [160, 206];
  function bucket(cx, top) { return [...barrel(cx, top + 30, 26, 26, '#7a5230'), ...place(RES.ore(), cx, top + 6, 0.34), sh(tube([[cx - 12, top + 6, 2], [cx, top - 2, 2], [cx + 12, top + 6, 2]]), IRON, 'steel', { line: 0.3 })]; }
  function orePit(E) {
    const out = [], rim = E.snow ? '#dfe6ec' : '#9a8468';
    out.push(el(160, 252, 146, 42, rim, 'horn', { gloss: 0.05, belly: 0.3 }));
    out.push(el(160, 254, 118, 31, '#7a6650', 'horn', { gloss: 0.05, ao: 0.6, line: 0.5 }));
    out.push(el(160, 258, 88, 22, '#5e4e3e', 'horn', { gloss: 0.05, ao: 0.7, line: 0.5 }));
    out.push(el(160, 262, 56, 13, '#2a221c', 'cloth', { line: 0.5, rim: 0 }));
    // ржавые жилы руды на уступах
    for (const [x0, y0, x1, y1] of [[90, 246, 118, 240], [196, 240, 226, 248], [124, 262, 142, 258]]) out.push(sh(tube([[x0, y0, 4], [(x0 + x1) / 2, (y0 + y1) / 2 - 2, 5], [x1, y1, 4]]), '#b06a4a', 'gold', { line: 0.4, gloss: 0.6 }));
    out.push(sh(tube([[96, 268, 9], [160, 112, 7]], { flat0: true }), WOOD, 'wood', { line: 0.7 }), sh(tube([[224, 268, 9], [160, 112, 7]], { flat0: true }), WOOD, 'wood', { line: 0.7 }));
    out.push(sh(tube([[124, 196, 6], [196, 196, 6]], { flat0: true, flat1: true }), WOOD_D, 'wood', { line: 0.6 }));
    out.push(sh([P(200, 150, 1), P(222, 150, 1), P(220, 180, 1), [211, 174], P(202, 180, 1)], OWN, 'cloth', { line: 0.6 }));   // полотнище на козлах
    out.push(...wheel(...PULLEY, 13, '#6a4424', { n: 4 }));
    if (E.still) out.push(sh(tube([[PULLEY[0], PULLEY[1] + 12, 2.4], [BUCKET[0], BUCKET[1]]]), ROPE, 'cloth', { line: 0.4 }), ...bucket(...BUCKET));
    out.push(...place(RES.ore(), 48, 290, 0.9));
    if (E.snow) out.push(snowCap([[20, 244], [60, 222], [110, 212], [160, 210], [210, 212], [260, 222], [300, 244]], 8), snowCap([[20, 262], [48, 254], [78, 262]], 5));
    out.push(rails(232, 322, 288));
    out.push(...cart(278, 268, 'ore'));
    out.push(boulder(26, 256, 14, 9, '#8a8478'), boulder(300, 230, 12, 8, '#7a746a'));
    return out;
  }
  const orePitMeta = () => ({ flag: [160, 104], lights: [], smoke: [], rope: { from: [PULLEY[0], PULLEY[1] + 12] },
    anim: [{ name: 'mine_ore.bucket', at: BUCKET, bob: 30 }] });

  /* ---------- алхимическая лаборатория ---------- */
  const FLAME = [62, 280];
  function alchemyLab(E) {
    const out = [];
    out.push(ground(E, 170, 282, 150, 11, '#7a6a58'));
    if (E.still) out.push(puff(272, 104, 13, 0.45, '170,230,190'), puff(282, 84, 16, 0.38, '190,170,230'), puff(270, 62, 19, 0.3, '200,220,240'));
    out.push(wall(262, 110, 282, 172, '#8a5a48', 8, 12));
    out.push(wall(204, 168, 296, 282, STONE_D, 13, 22), roof(204, 296, 170, 136, SLATE, { tiles: true, rows: 3, ov: 8, ins: 12 }));
    if (E.snow) out.push(snowCap([[196, 168], [216, 136], [284, 136], [304, 168]], 8));
    out.push(...win(262, 214, 18, 20, { glass: '#9ee8ff' }));
    out.push(wall(112, 110, 214, 282, STONE, 14, 24));
    out.push(sh([P(100, 114, 1), [128, 80], P(163, 26, 1), [198, 80], P(226, 114, 1)], SLATE, 'leather', { gloss: 0.2, belly: 0.3, lines: [ln([[132, 90], [194, 90]], 1.4, 0.5), ln([[118, 104], [208, 104]], 1.4, 0.5)] }));
    if (E.snow) out.push(snowCap([[108, 112], [134, 76], [163, 32], [192, 76], [218, 112]], 10));
    out.push(el(163, 26, 5, 5, GOLD, 'gold', { line: 0.5 }), sh(tube([[163, 22, 2], [163, 6, 1.4]]), IRON, 'steel'));
    out.push(...win(163, 150, 16, 24, { glass: '#9ee8ff' }));
    // знамя владельца на башне
    out.push(sh([P(147, 176, 1), P(179, 176, 1), P(179, 214, 1), P(163, 206, 1), P(147, 214, 1)], OWN, 'cloth', { line: 0.6, sub: [el(163, 190, 6, 6, GOLD, 'gold', { line: 0.4 })] }));
    out.push(door(163, 282, 34, 56, PLANK, { ring: true }));
    out.push(sh(tube([[40, 282, 4], [58, 250, 3]]), IRON, 'steel'), sh(tube([[84, 282, 4], [66, 250, 3]]), IRON, 'steel'));
    if (E.still) out.push(flame(...FLAME, 22, 10));
    out.push(sh(tube([[66, 196, 7], [92, 170, 6], [112, 166, 6]], { flat1: true }), '#c8ecf6', 'gem', { gloss: 1, line: 0.5, op: 0.85 }));
    out.push(el(62, 222, 30, 30, '#cdeef8', 'gem', { gloss: 1.3, rim: 0.8, line: 0.7, op: 0.88, sub: [el(62, 238, 30, 16, '#6ab8dc', 'steel', { line: 0, gloss: 1.2 })], glint: [[52, 208, 5], [72, 232, 2.5]] }));
    out.push(sh(tube([[62, 194, 10], [62, 180, 9]], { flat1: true }), '#cdeef8', 'gem', { line: 0.6, op: 0.88 }), el(62, 178, 6, 3, '#8a5a32', 'wood', { line: 0.5 }));
    out.push(...place(RES.mercury(), 262, 292, 0.55));
    return out;
  }
  const alchemyMeta = () => ({ flag: [272, 108], lights: [[163, 150], [262, 214]],
    smoke: [{ at: [272, 104], c: '160,230,180', rate: 5 }, { at: [272, 104], c: '190,160,235', rate: 3 }],
    anim: [{ name: 'mine_mercury.flame', at: FLAME, flicker: 1 }], sparkle: [[52, 208], [240, 280]] });

  /* ---------- серные дюны ---------- */
  const VENTS = [[172, 148, 16], [92, 222, 12], [244, 236, 11]];
  function sulfurDune(E) {
    const out = [], S = E.snow ? 0.45 : 0;
    const dune = (c) => E.snow ? tone(c, 0.12) : c;
    out.push(sh([P(20, 284, 1), [60, 206], [124, 150], [176, 138], [232, 168], [284, 222], P(318, 284, 1)], dune('#c89a22'), 'cloth', { belly: 0.4, gloss: 0.15, lines: [ln([[80, 200], [140, 164], [200, 158]], 1.4, 0.35, { light: true })] }));
    if (S) out.push(snowCap([[40, 236], [70, 200], [110, 164]], 7), snowCap([[228, 168], [262, 196], [292, 234]], 7));
    out.push(sh([P(4, 288, 1), [34, 238], [90, 214], [148, 226], P(186, 288, 1)], dune('#e2b62c'), 'cloth', { belly: 0.35, gloss: 0.2, lines: [ln([[40, 246], [96, 224], [140, 232]], 1.4, 0.4, { light: true })] }));
    out.push(sh([P(150, 290, 1), [186, 246], [240, 228], [292, 244], P(324, 290, 1)], dune('#eec83a'), 'cloth', { belly: 0.35, gloss: 0.2 }));
    for (const [x, y, rx] of VENTS) {
      out.push(el(x, y, rx, rx * 0.36, '#5a3c10', 'cloth', { line: 0.6, rim: 0, sub: [el(x, y + 1, rx * 0.6, rx * 0.2, '#ff9a2a', 'flat', { line: 0 })] }));
      if (E.still) out.push(puff(x - 3, y - 16, rx * 0.8, 0.5, '250,240,190'), puff(x + 5, y - 34, rx, 0.38, '245,235,200'), puff(x - 2, y - 56, rx * 1.2, 0.26, '240,236,210'));
    }
    out.push(...crystals(200, 206, ['#f6e050', '#ffe878', '#e8c030'], 3, 36, 26), ...crystals(52, 262, ['#f6e050', '#ffe878', '#e8c030'], 3, 30, 22));
    // бочка добытого под навесом-тентом цвета владельца
    out.push(sh(tube([[100, 290, 4], [100, 238, 3]]), '#4a3020', 'wood'), sh(tube([[146, 290, 4], [146, 238, 3]]), '#4a3020', 'wood'));
    out.push(sh([P(94, 240, 1), [123, 232], P(152, 240, 1), P(148, 250, 1), [123, 244], P(98, 250, 1)], OWN, 'cloth', { line: 0.6 }));
    out.push(...barrel(123, 290, 30, 32, '#8a5a32'), el(123, 258, 12, 3.5, '#f0cc30', 'cloth', { line: 0.4 }));
    out.push(...place(RES.sulfur(), 272, 292, 0.62));
    return out;
  }
  const sulfurMeta = () => ({ flag: [60, 212], lights: [], sparkle: [[200, 172], [52, 234]],
    smoke: VENTS.map(([x, y, r]) => ({ at: [x, y - 4], c: '250,236,170', rate: 2 + r / 6, big: r / 12 })) });

  /* ---------- кристальная пещера ---------- */
  function crystalCave(E) {
    const out = [], R = E.under ? ['#5a5c6c', '#72758a', '#44465a'] : ['#7c7f8e', '#9a9dac', '#5e6070'];
    out.push(sh([P(16, 286, 1), [30, 220], P(56, 180, 1), [84, 150], P(112, 104, 1), [150, 92], P(186, 78, 1), [214, 108], P(246, 122, 1), [276, 168], P(300, 214, 1), [314, 250], P(318, 286, 1)], R[0], 'horn', { gloss: 0.15, belly: 0.35 }));
    out.push(sh([P(34, 262, 1), [48, 204], P(80, 160, 1), [110, 118], P(150, 96, 1), [128, 136], [96, 196], P(80, 256, 1)], R[1], 'horn', { gloss: 0.1, line: 0.4, ao: 0.4 }));
    out.push(sh([P(246, 126, 1), [280, 172], [304, 226], P(310, 282, 1), [280, 250], [262, 190]], R[2], 'horn', { gloss: 0.05, line: 0.4, ao: 0.5 }));
    if (E.snow) out.push(snowCap([[56, 182], [84, 152], [112, 106], [150, 94], [186, 80], [214, 110], [246, 124], [276, 170]], 12));
    out.push(sh([P(110, 284, 1), [114, 224], [132, 190], [164, 176], [196, 188], [214, 222], P(220, 284, 1)], '#1a1426', 'cloth', { line: 0.7, rim: 0,
      sub: [el(164, 262, 40, 30, 'rgba(170,140,255,0.45)', 'flat', { line: 0 }), el(164, 270, 22, 14, 'rgba(210,190,255,0.5)', 'flat', { line: 0 })] }));
    // полог над входом на двух жердях — цвет владельца
    out.push(sh(tube([[118, 286, 3.4], [124, 196, 2.8]]), '#4a3020', 'wood'), sh(tube([[210, 286, 3.4], [204, 196, 2.8]]), '#4a3020', 'wood'));
    out.push(sh([P(116, 194, 1), [164, 186], P(212, 194, 1), P(206, 212, 1), [192, 206], [178, 214], [164, 206], [150, 214], [136, 206], P(122, 212, 1)], OWN, 'cloth', { line: 0.6 }));
    out.push(...crystals(74, 284, ['#eaf8ff', '#c4e6f8', '#a8d8f2', '#d8ccff'], 5, 150, 96));
    out.push(...crystals(262, 284, ['#eaf8ff', '#c4e6f8', '#b8c8ff'], 4, 112, 72));
    out.push(...crystals(170, 96, ['#eaf8ff', '#d0e8ff', '#c4e6f8'], 3, 54, 36));
    out.push(...crystals(236, 136, ['#eaf8ff', '#c4e6f8'], 3, 34, 24));
    out.push(...crystals(144, 286, ['#d8ccff', '#eaf8ff'], 3, 30, 22), ...crystals(196, 286, ['#eaf8ff', '#c4e6f8'], 3, 26, 20));
    return out;
  }
  const crystalMeta = () => ({ flag: [150, 96], lights: [], smoke: [], glow: { at: [164, 262], r: 60, c: '180,150,255' },
    sparkle: [[74, 138], [48, 190], [100, 200], [262, 176], [244, 214], [170, 44], [236, 104], [144, 258], [196, 262]] });

  /* ---------- пруд самоцветов ---------- */
  function gemPond(E) {
    const out = [];
    out.push(el(164, 256, 156, 38, E.snow ? '#dfe6ec' : E.under ? '#4e4854' : '#6e6a4a', 'cloth', { ao: 0.4, belly: 0.2, line: 0.5 }));
    out.push(...crystals(58, 240, ['#3cc060', '#58d474', '#2aa850'], 5, 118, 70), ...crystals(262, 236, ['#e03048', '#f0506a', '#c02038'], 4, 96, 56), ...crystals(160, 228, ['#6a8ae8', '#8aa8f8', '#4a6ad0'], 3, 58, 34));
    out.push(el(164, 258, 128, 28, E.snow ? '#b8dcf0' : '#4aa6d6', 'gem', { gloss: 0.4, line: 0.6 }));
    out.push(water(164, 260, 116, 23, E.snow ? '#5a98c8' : '#2a6ea8', { glint: [[120, 254, 3.5], [196, 262, 3], [150, 268, 2.4], [226, 256, 2.2]] }));
    if (E.snow) out.push(el(96, 254, 26, 6, 'rgba(235,245,255,0.7)', 'flat', { line: 0.4, lc: '#9ab0c4' }), el(230, 264, 20, 5, 'rgba(235,245,255,0.7)', 'flat', { line: 0.4, lc: '#9ab0c4' }));   // ледок
    for (const [x, y, r, c] of [[132, 262, 7, '#e03048'], [168, 256, 8, '#3a6ae0'], [204, 266, 6, '#3cc060'], [104, 268, 5, '#f0c030'], [236, 262, 5, '#b060e0']]) out.push(cutGem(x, y, r, c));
    for (const [x, y, rx, ry, c] of [[30, 270, 18, 11, '#8a8478'], [300, 266, 16, 10, '#7a746a'], [70, 288, 14, 8, '#9a9488'], [256, 290, 17, 9, '#8a8478'], [164, 294, 12, 6, '#7a746a']]) out.push(boulder(x, y, rx, ry, c));
    // лоток старателя на берегу, накрытый тканью цвета владельца
    out.push(sh(box(180, 276, 226, 292), PLANK, 'wood', { flow: 0, line: 0.6 }), sh([P(176, 278, 1), [203, 270], P(230, 278, 1), P(226, 286, 1), P(180, 286, 1)], OWN, 'cloth', { line: 0.6 }));
    out.push(cutGem(96, 290, 11, '#e03048'), cutGem(118, 294, 9, '#3a6ae0'), cutGem(240, 294, 8, '#3cc060'));
    if (!E.snow && !E.under) for (const [x, h, lean] of [[18, 56, -0.2], [26, 70, -0.05], [36, 50, 0.15], [292, 60, 0.1], [304, 74, 0.25], [314, 52, 0.3]]) {
      out.push(sh(tube([[x, 272, 3], [x + lean * h, 272 - h, 1.6]]), '#5a8a32', 'leather', { line: 0.4 }));
      if (h > 55) out.push(sh(tube([[x + lean * h * 0.86, 272 - h * 0.86, 5.5], [x + lean * h * 0.98, 272 - h * 0.98, 5]]), '#6a4424', 'fur', { line: 0.4 }));
    }
    if (E.snow) out.push(snowCap([[20, 250], [58, 232], [96, 240]], 6), snowCap([[234, 236], [262, 222], [292, 236]], 6));
    return out;
  }
  const gemMeta = () => ({ flag: [300, 258], lights: [], smoke: [],
    sparkle: [[132, 256], [168, 250], [204, 261], [236, 258], [58, 130], [262, 146], [160, 172], [96, 284], [120, 256], [196, 262]] });

  /* ---------- регистрация ---------- */
  // под землёй руда, сера и самоцветы — штольнями; золото — штольня везде
  const SURF = { gold: E => shaft('gold', E), wood: sawmill, ore: orePit, mercury: alchemyLab, sulfur: sulfurDune, crystal: crystalCave, gems: gemPond };
  const META = { gold: () => shaftMeta('gold'), wood: sawmillMeta, ore: orePitMeta, mercury: alchemyMeta, sulfur: sulfurMeta, crystal: crystalMeta, gems: gemMeta };
  const UNDER_SHAFT = { ore: 1, sulfur: 1, gems: 1 };
  for (const r of RES_IDS) {
    const frame = frameOf('mine_' + r);
    obj('mine_' + r, () => SURF[r]({ still: true }));
    for (const [k, E] of [['g', {}], ['s', { snow: true }], ['u', { under: true }]]) {
      const sh_ = E.under && UNDER_SHAFT[r];
      obj('mine_' + r + '#' + k, () => sh_ ? shaft(r, E) : SURF[r](E), { frame, meta: sh_ ? shaftMeta(r) : META[r]() });
    }
  }
  /** Подвижная деталь: рисунок с якорем в точке крепления (центр колеса, верх бадьи, низ пламени). */
  function part(name, w, h, anchor, shapes) { V.def(name, { w, h, anchor, parts: [{ kind: 'torso', pivot: anchor.slice(), shapes }] }); }
  part('mine_wood.wheel', 130, 130, [65, 65], waterWheel(65, 65));
  part('mine_wood.saw', 70, 70, [35, 35], sawBlade(35, 35));
  part('mine_ore.bucket', 40, 44, [20, 4], bucket(20, 4));
  part('mine_mercury.flame', 30, 30, [15, 28], [flame(15, 28, 22, 10)]);

  /* =================================================================== находки
     Сундук — общий для сундука, ящика Пандоры и морского сундука. */
  function chest(cx, yb, w, h, o) {
    o = o || {}; const x0 = cx - w / 2, x1 = cx + w / 2, yl = yb - h * 0.55, ry = h * 0.45, band = o.band || GOLD, body = o.body || '#8a5a32';
    const lid = [P(x0 - 2, yl + 2, 1)]; for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; lid.push([cx + Math.cos(a) * (w / 2 + 1), yl + Math.sin(a) * ry]); } lid.push(P(x1 + 2, yl + 2, 1));
    const planks = [0.33, 0.66].map(t => ln([[x0 + 2, yl + (yb - yl) * t], [x1 - 2, yl + (yb - yl) * t]], 1.3, 0.55));
    const out = [
      sh(box(x0, yl, x1, yb), body, 'wood', { flow: 0, lines: planks }),
      sh(lid, tone(body, 0.08), 'wood', { flow: 0, lines: [ln([[x0 + 4, yl - ry * 0.45], [x1 - 4, yl - ry * 0.45]], 1.3, 0.5)] }),
    ];
    for (const sx of [cx - w * 0.3, cx + w * 0.3]) out.push(sh(box(sx - 4.5, yl - ry * 0.8, sx + 4.5, yb), band, o.bandM || 'gold', { line: 0.6, glint: [[sx - 1, yl - ry * 0.5, 2]] }));
    out.push(sh(box(x0 - 2, yl - 3, x1 + 2, yl + 4), band, o.bandM || 'gold', { line: 0.6, lines: o.glow ? [ln([[x0 + 2, yl - 3.5], [x1 - 2, yl - 3.5]], 2.6, 1, { c: o.glow })] : undefined }));
    out.push(sh(box(cx - 9, yl - 5, cx + 9, yl + 17), band, 'gold', { line: 0.7, lines: [ln([[cx, yl + 3], [cx, yl + 10]], 2.6, 1, { c: '#2a1a10' })], glint: [[cx - 4, yl - 1, 2.5]] }));
    return out;
  }
  obj('chest', () => [el(88, 126, 62, 7, '#3a3226', 'flat', { line: 0 }), ...chest(88, 126, 112, 86)]);
  obj('pandora_box', () => {
    const out = [el(99, 136, 70, 7, '#2a2230', 'flat', { line: 0 })];
    // свет из щели под крышкой: лучи веером
    for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.22 + i * 0.14), L = i === 2 ? 100 : 86, w = i === 2 ? 14 : 10; out.push(sh([P(95, 74, 1), P(99 + Math.cos(a) * L - Math.sin(a) * w, 72 + Math.sin(a) * L + Math.cos(a) * w, 1), P(99 + Math.cos(a) * L + Math.sin(a) * w, 72 + Math.sin(a) * L - Math.cos(a) * w, 1), P(103, 74, 1)], i % 2 ? '#fff6c8' : '#ffe88a', 'gem', { line: 0, gloss: 0.6 })); }
    return [...out, ...chest(99, 134, 124, 100, { body: '#7a3a9a', glow: '#fff4b0' })];
  });

  obj('campfire', () => {
    const out = [el(87, 170, 64, 14, '#3a3024', 'flat', { line: 0 })];
    const stones = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + 0.2; stones.push([87 + Math.cos(a) * 60, 168 + Math.sin(a) * 12, a]); }
    const stone = ([x, y], i) => boulder(x, y, 12, 8, ['#8a8478', '#9a9488', '#7a7468'][i % 3]);
    stones.filter(s => Math.sin(s[2]) < 0).forEach((s, i) => out.push(stone(s, i)));
    out.push(sh(tube([[38, 174, 13], [124, 146, 10]]), '#6a4424', 'wood', { flow: -0.3 }), sh(tube([[136, 174, 13], [50, 146, 10]]), '#7a4e2a', 'wood', { flow: 0.3 }));
    const flame = (cx, yb, w, h, c) => sh([[cx - w / 2, yb - h * 0.1], [cx - w * 0.45, yb - h * 0.42], P(cx - w * 0.3, yb - h * 0.76, 1), [cx - w * 0.14, yb - h * 0.52], P(cx + 2, yb - h, 1), [cx + w * 0.14, yb - h * 0.56], P(cx + w * 0.32, yb - h * 0.72, 1), [cx + w * 0.46, yb - h * 0.4], [cx + w / 2, yb - h * 0.1], [cx, yb + 3]], c, 'gem', { gloss: 0.8, rim: 0.3, line: 0.4, lc: '#8a2a08' });
    out.push(flame(87, 162, 76, 116, '#e8501a'), flame(88, 162, 54, 88, '#ff9a2a'), flame(88, 162, 30, 52, '#ffe27a'));
    stones.filter(s => Math.sin(s[2]) >= 0).forEach((s, i) => out.push(stone(s, i + 1)));
    return out;
  });

  obj('artifact', () => [
    el(77, 138, 36, 6, '#2a2418', 'flat', { line: 0 }),
    sh([P(54, 138, 1), P(100, 138, 1), P(94, 124, 1), P(60, 124, 1)], STONE, 'horn', { gloss: 0.2 }),
    sh(tube([[77, 126, 12], [77, 112, 8]], { flat0: true }), GOLD, 'gold'),
    sh(ring(77, 56, 8, 8, 4, 14), GOLD, 'gold', { line: 0.6 }),
    el(77, 86, 32, 32, GOLD, 'gold', { lines: [ln(ell(77, 86, 25, 25, 16), 1.4, 0.5, { closed: true })], sub: [el(77, 86, 19, 19, '#8a3ad0', 'gem', { gloss: 1.3, rim: 0.8, glint: [[70, 79, 6]] })] }),
    ...[0, 1, 2, 3].map(i => { const a = i * Math.PI / 2 + Math.PI / 4; return el(77 + Math.cos(a) * 27, 86 + Math.sin(a) * 27, 4, 4, '#fff0b0', 'gold', { line: 0.5 }); }),
  ]);

  obj('learning_stone', () => {
    const rune = (pts) => ln(pts, 3.2, 1, { c: '#6fe6ff' });
    return [
      el(112, 244, 88, 10, '#3a3a36', 'flat', { line: 0 }),
      sh([P(28, 244, 1), [26, 200], [46, 160], [84, 138], [132, 134], [176, 150], [198, 192], P(196, 244, 1)], '#9a968e', 'horn', { gloss: 0.2, belly: 0.4,
        lines: [rune([[60, 190], [70, 176], [80, 190]]), rune([[70, 176], [70, 212]]), rune([[100, 200], [112, 186], [124, 200], [112, 214], [100, 200]]), rune([[142, 180], [142, 214]]), rune([[142, 196], [158, 184]]), rune([[142, 196], [158, 208]]),
          ln([[40, 222], [90, 230], [150, 226], [188, 216]], 1.4, 0.4), ln([[120, 150], [110, 170]], 1.2, 0.4)] }),
      el(112, 146, 52, 13, '#b8b4ac', 'horn', { gloss: 0.3, line: 0.6, sub: [el(112, 147, 38, 8, '#6fe0f8', 'gem', { gloss: 1.2, line: 0 })] }),
      el(112, 120, 5, 22, '#bff6ff', 'gem', { gloss: 1.2, line: 0, glint: [[112, 116, 6]] }),
    ];
  });

  /* ---------- святилища магии: каменный домик, шар в цвете уровня, насечки по числу ---------- */
  const ORB = ['#4d7fe0', '#d8382a', '#9a58c8'];
  [1, 2, 3].forEach(n => obj('shrine_' + n, () => {
    const out = [
      el(120, 244, 90, 9, '#3a3a36', 'flat', { line: 0 }),
      sh(box(40, 228, 200, 246), '#8a8680', 'horn', { gloss: 0.15, lines: [ln([[41, 229.5], [199, 229.5]], 1.2, 0.5, { light: true }), ln([[90, 236], [150, 236]], 1, 0.3)] }),
      wall(56, 130, 184, 228, '#b0aca4', 14, 22),
      sh(box(56, 130, 70, 228), '#c4c0b8', 'horn', { gloss: 0.2, line: 0.6 }), sh(box(170, 130, 184, 228), '#a09c94', 'horn', { gloss: 0.2, line: 0.6 }),
      roof(56, 184, 134, 92, SLATE, { ov: 18, ins: 36, rows: 3, tiles: true }),
      sh(box(96, 158, 144, 228), '#8a8680', 'horn', { gloss: 0.1, line: 0.6 }),
      hole(120, 228, 28, 62),
      sh(tube([[120, 92, 8], [120, 78, 5]], { flat0: true }), GOLD, 'gold'),
      el(120, 66, 16, 16, ORB[n - 1], 'gem', { gloss: 1.3, rim: 0.9, glint: [[114, 60, 6]] }),
    ];
    for (let i = 0; i < n; i++) out.push(el(120 + (i - (n - 1) / 2) * 13, 146, 4, 4, ORB[n - 1], 'gem', { line: 0.4, glint: [[119 + (i - (n - 1) / 2) * 13, 145, 2]] }));
    return out;
  }));

  obj('magic_well', () => {
    const body = [P(51, 196, 1), [53, 226], [123, 240], [193, 226], P(195, 196, 1)];
    return [
      el(123, 236, 80, 8, '#3a3a36', 'flat', { line: 0 }),
      sh(tube([[62, 206, 11], [62, 84, 9]], { flat0: true, flat1: true }), WOOD, 'wood', { flow: -Math.PI / 2 }),
      sh(tube([[184, 206, 11], [184, 84, 9]], { flat0: true, flat1: true }), WOOD, 'wood', { flow: -Math.PI / 2 }),
      sh(body, STONE, 'horn', { gloss: 0.15, lines: [ln([[54, 212], [123, 222], [192, 212]], 1.3, 0.55), ln([[56, 226], [123, 236], [190, 226]], 1.3, 0.55), ...[80, 104, 128, 152, 176].map((x, i) => ln([[x + (i % 2) * 8, 200 + (i % 2) * 14], [x + (i % 2) * 8, 212 + (i % 2) * 14]], 1.1, 0.45))] }),
      el(123, 196, 72, 20, '#bcb6aa', 'horn', { gloss: 0.3, sub: [el(123, 198, 60, 14, '#3a8ae0', 'gem', { gloss: 1.1, line: 0, glint: [[104, 194, 5], [140, 200, 3]] })] }),
      sh(tube([[56, 122, 8], [190, 122, 8]]), '#7a4e2a', 'wood', { flow: 0 }),
      el(196, 122, 5, 9, IRON, 'steel', { line: 0.5 }),
      sh(tube([[123, 124, 2], [123, 166, 2]]), ROPE, 'cloth', { line: 0.4 }),
      sh([P(110, 164, 1), P(136, 164, 1), P(133, 188, 1), P(113, 188, 1)], '#8a5a32', 'wood', { flow: -Math.PI / 2, lines: [ln([[111, 170], [135, 170]], 2, 0.8, { c: IRON }), ln([[112, 183], [134, 183]], 2, 0.8, { c: IRON })] }),
      roof(62, 184, 92, 52, ROOF, { ov: 24, ins: 50, rows: 3, tiles: true }),
    ];
  });

  obj('fountain_fortune', () => {
    const coins = [[-40, 4], [-12, 8], [18, 2], [44, 7], [-26, -4]].map(([dx, dy]) => el(120 + dx, 226 + dy, 5, 2.6, '#f2c84a', 'gold', { line: 0.3 }));
    const jet = s => sh(tube([[120 + s * 2, 126, 4.5], [120 + s * 16, 108, 4], [120 + s * 34, 116, 3.4], [120 + s * 50, 150, 3], [120 + s * 60, 206, 2.6]]), '#c4ecfb', 'gem', { gloss: 1, line: 0.3, lc: '#5a9ac0' });
    return [
      el(120, 254, 94, 8, '#3a3a36', 'flat', { line: 0 }),
      sh([P(28, 222, 1), [32, 246], [120, 262], [208, 246], P(212, 222, 1)], '#c8c4bc', 'horn', { gloss: 0.2, lines: [ln([[31, 234], [120, 250], [209, 234]], 1.2, 0.4)] }),
      el(120, 222, 92, 24, '#dcd8d0', 'horn', { gloss: 0.3, sub: [el(120, 224, 80, 18, '#4aa6e0', 'gem', { gloss: 0.9, line: 0, sub: coins, lines: [ln([[70, 218], [100, 214]], 1.4, 0.6, { light: true })] })] }),
      sh(tube([[120, 228, 20], [120, 190, 14], [120, 150, 12]], { flat0: true }), '#d0ccc4', 'horn', { gloss: 0.3 }),
      sh([P(82, 146, 1), [94, 160], [120, 166], [146, 160], P(158, 146, 1)], '#d0ccc4', 'horn', { gloss: 0.3 }),
      el(120, 146, 38, 9, '#e0dcd4', 'horn', { gloss: 0.3, sub: [el(120, 147, 31, 6, '#4aa6e0', 'gem', { line: 0 })] }),
      sh(tube([[120, 146, 10], [120, 128, 7]], { flat0: true }), '#d0ccc4', 'horn'),
      jet(-1), jet(1),
      sh([P(120, 90, 1), [126, 108], [120, 128], [114, 108]], '#dff6ff', 'gem', { gloss: 1.2, line: 0.3, lc: '#5a9ac0' }),
      el(62, 212, 8, 3, '#e8f8ff', 'gem', { line: 0 }), el(180, 212, 8, 3, '#e8f8ff', 'gem', { line: 0 }),
    ];
  });

  obj('temple', () => {
    const out = [
      el(120, 246, 110, 7, '#3a3a36', 'flat', { line: 0 }),
      sh(box(14, 232, 226, 248), '#c0bcb2', 'horn', { gloss: 0.15, lines: [ln([[15, 233.5], [225, 233.5]], 1.2, 0.5, { light: true })] }),
      sh(box(24, 220, 216, 233), '#d4d0c6', 'horn', { gloss: 0.15, lines: [ln([[25, 221.5], [215, 221.5]], 1.2, 0.5, { light: true })] }),
      sh(box(34, 118, 206, 220), '#8e8a84', 'horn', { gloss: 0.05, ao: 1.2 }),
      hole(120, 220, 34, 64, { c: '#2a2228' }),
    ];
    for (const x of [44, 82, 120, 158, 196]) out.push(
      sh(box(x - 10, 124, x + 10, 220), MARBLE, 'horn', { gloss: 0.3, lines: [ln([[x - 4, 126], [x - 4, 218]], 1, 0.35), ln([[x + 3, 126], [x + 3, 218]], 1, 0.35), ln([[x - 7, 126], [x - 7, 218]], 1, 0.4, { light: true })] }),
      sh(box(x - 14, 114, x + 14, 124), '#eeeae2', 'horn', { gloss: 0.3, line: 0.7 }));
    out.push(sh(box(20, 98, 220, 116), '#ece8e0', 'horn', { gloss: 0.25, lines: [ln([[21, 106], [219, 106]], 1.2, 0.45)] }));
    out.push(gable(120, 100, 40, 108, '#f0ece4', { m: 'horn', lines: [ln([[34, 96], [120, 48], [206, 96]], 1.4, 0.5)] }));
    out.push(el(120, 80, 13, 9, GOLD, 'gold', { line: 0.6, glint: [[116, 77, 3]] }));
    return out;
  });

  obj('rally_flag', () => [
    el(110, 246, 80, 8, '#3a3024', 'flat', { line: 0 }),
    boulder(126, 238, 30, 12, '#8a8478'), boulder(100, 242, 20, 8, '#9a9488'),
    ...flag(120, 244, 36, 76, 54, '#c8332a', { pw: 5 }),
    // барабан у древка
    sh([P(44, 212, 1), P(92, 212, 1), P(92, 244, 1), P(44, 244, 1)], '#a8743e', 'wood', { flow: -Math.PI / 2, lines: [ln([[46, 214], [58, 242], [70, 214], [82, 242], [90, 216]], 1.6, 0.9, { c: ROPE }), ln([[44, 218], [92, 218]], 3, 0.8, { c: '#8a2a20' }), ln([[44, 240], [92, 240]], 3, 0.8, { c: '#8a2a20' })] }),
    el(68, 212, 24, 7, '#eadcb8', 'leather', { line: 0.7 }),
    sh(tube([[76, 206, 3], [100, 188, 2.5]]), '#5a3a1c', 'wood', { line: 0.5 }), el(101, 187, 4, 4, '#eadcb8', 'leather', { line: 0.5 }),
  ]);

  /* ---------- пальма: ствол кольцами, веер листьев ---------- */
  function palm(x, yb, h, lean, s) {
    const T = [[x, yb, 12 * s], [x + lean * 0.25, yb - h * 0.4, 10 * s], [x + lean * 0.7, yb - h * 0.8, 8.5 * s], [x + lean, yb - h, 8 * s]], top = [x + lean, yb - h];
    const out = [sh(tube(T), '#8a6a44', 'wood', { flow: -Math.PI / 2, lines: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map(t => { const yy = yb - h * t, xx = x + lean * t * t; return ln([[xx - 5 * s, yy + 2], [xx + 5 * s, yy - 1]], 1.3, 0.55); }) })];
    const fr = (ang, L, c) => { const lf = K.leaf(top, ang, L * s, 22 * s); out.push(sh(lf.body, c, 'leather', { gloss: 0.4, line: 0.6, lines: [ln(lf.shaft, 1, 0.5)] })); };
    fr(Math.PI * 1.02, 74, '#3e7a2a'); fr(-Math.PI * 0.2, 72, '#3e7a2a'); fr(Math.PI * 1.32, 62, '#4a8a32'); fr(-Math.PI * 0.5, 50, '#56963a'); fr(Math.PI * 0.14, 70, '#4a8a32'); fr(Math.PI * 0.84, 66, '#56963a');
    out.push(el(top[0] - 4, top[1] + 6, 6, 6, '#6a4a24', 'wood', { line: 0.5 }), el(top[0] + 5, top[1] + 7, 6, 6, '#6a4a24', 'wood', { line: 0.5 }));
    return out;
  }
  obj('oasis', () => [
    el(128, 236, 112, 24, SAND, 'cloth', { line: 0.6, belly: 0.3, ao: 0.4 }),
    ...palm(80, 228, 150, -16, 1),
    water(136, 232, 78, 17),
    ...[[74, 234], [92, 238], [178, 236], [194, 232]].map(([x, y]) => sh([P(x - 5, y, 1), P(x - 7, y - 14, 1), P(x - 1, y - 4, 1), P(x + 2, y - 18, 1), P(x + 3, y - 3, 1), P(x + 8, y - 12, 1), P(x + 6, y, 1)], '#5a9a3a', 'leather', { line: 0.4 })),
    ...palm(196, 236, 104, 12, 0.8),
  ]);

  obj('windmill', () => {
    const hub = [130, 118], out = [el(130, 332, 60, 7, '#3a3a36', 'flat', { line: 0 })];
    out.push(sh([P(96, 332, 1), P(164, 332, 1), P(154, 132, 1), P(106, 132, 1)], '#b4aea2', 'horn', { gloss: 0.15, lines: bricks(96, 132, 164, 332, 14, 20) }));
    out.push(door(130, 332, 26, 46, PLANK, { square: false }), ...win(130, 214, 12, 16));
    out.push(sh([P(98, 136, 1), [104, 112], P(130, 86, 1), [156, 112], P(162, 136, 1)], '#7a4e2a', 'wood', { flow: -0.6, gloss: 0.2, lines: [ln([[106, 122], [154, 122]], 1.4, 0.5)] }));
    for (let i = 0; i < 4; i++) {
      const a = -0.62 + i * Math.PI / 2, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]], at = (r, o) => [hub[0] + u[0] * r + v[0] * o, hub[1] + u[1] * r + v[1] * o];
      const lat = []; for (let r = 34; r < 112; r += 13) lat.push(ln([at(r, 3), at(r, 25)], 1.4, 0.8, { c: '#6a4a2a' }));
      lat.push(ln([at(20, 14), at(112, 14)], 1.2, 0.6, { c: '#6a4a2a' }));
      out.push(sh([P(...at(20, 3), 1), P(...at(114, 3), 1), P(...at(114, 25), 1), P(...at(20, 25), 1)], '#e6dcc2', 'cloth', { line: 0.7, lines: lat }));
      out.push(sh(tube([[...at(0, 0), 6], [...at(120, 0), 4]]), '#6a4424', 'wood', { line: 0.7 }));
    }
    out.push(el(hub[0], hub[1], 9, 9, IRON, 'steel', { line: 0.7 }));
    return out;
  });

  obj('water_wheel', () => {
    const c = [74, 196], R = 62, out = [];
    out.push(sh([P(2, 260, 1), [60, 256], P(124, 258, 1), P(128, 292, 1), [60, 296], P(4, 292, 1)], '#4a96d0', 'gem', { gloss: 0.6, line: 0.6, lines: [ln([[14, 272], [44, 270]], 1.4, 0.6, { light: true }), ln([[80, 282], [110, 280]], 1.4, 0.6, { light: true })] }));
    out.push(logWall(120, 160, 290, 284, LOG, 12));
    out.push(sh(box(118, 160, 128, 284), '#7a5030', 'wood', { flow: -Math.PI / 2, line: 0.6 }), sh(box(282, 160, 292, 284), '#6a4428', 'wood', { flow: -Math.PI / 2, line: 0.6 }));
    out.push(door(196, 284, 32, 60, PLANK), ...win(252, 212, 20, 20), ...win(150, 212, 16, 18));
    out.push(roof(120, 290, 164, 94, ROOF, { ov: 14, ins: 28, rows: 4, tiles: true }));
    out.push(sh(tube([[c[0], c[1], 9], [132, 200, 9]]), '#5a3a1c', 'wood', { line: 0.6 }));
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2; out.push(sh(tube([[c[0], c[1], 6], [c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R, 5]]), '#7a4e2a', 'wood', { line: 0.6 })); }
    out.push(sh(ring(c[0], c[1], R, R, 9, 28), '#8a5a32', 'wood', { line: 0.8 }));
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a); out.push(sh(tube([[c[0] + ca * (R - 4), c[1] + sa * (R - 4), 9], [c[0] + ca * (R + 12), c[1] + sa * (R + 12), 9]], { flat0: true, flat1: true }), '#9a6a3c', 'wood', { line: 0.6 })); }
    out.push(el(c[0], c[1], 11, 11, IRON, 'steel', { line: 0.7 }));
    out.push(el(56, 262, 16, 5, '#e8f6ff', 'gem', { line: 0 }), el(96, 264, 12, 4, '#e8f6ff', 'gem', { line: 0 }));
    return out;
  });

  /* =================================================================== постройки карты */
  obj('witch_hut', () => {
    const leg = (x, s) => [
      sh(tube([[x, 196, 18], [x - s * 8, 222, 12], [x + s * 2, 244, 8]]), '#d89a3a', 'skin', { line: 0.8, lines: [ln([[x - s * 6, 222], [x - s * 2, 226]], 1, 0.4), ln([[x - s * 3, 232], [x + s, 236]], 1, 0.4)] }),
      ...[-1, 0, 1].map(t => sh(tube([[x + s * 2, 244, 6], [x + s * 2 + t * 14 + s * 4, 250, 3.5]]), '#c8862a', 'horn', { line: 0.6 }))];
    return [
      el(113, 248, 72, 7, '#3a3024', 'flat', { line: 0 }),
      ...leg(82, -1), ...leg(146, 1),
      sh([P(48, 112, 1), P(180, 104, 1), P(186, 202, 1), P(44, 206, 1)], LOG, 'wood', { flow: 0, lines: logLines(40, 104, 190, 206, 12) }),
      sh(box(42, 108, 52, 208), '#7a5030', 'wood', { flow: -Math.PI / 2, line: 0.6 }), sh(box(178, 102, 188, 204), '#6a4428', 'wood', { flow: -Math.PI / 2, line: 0.6 }),
      door(114, 204, 30, 58, '#6a4428'),
      el(72, 150, 12, 12, WOOD_D, 'wood', { line: 0.6, sub: [el(72, 150, 8, 8, '#b8e060', 'gem', { gloss: 1, line: 0 })] }),
      el(156, 146, 12, 12, WOOD_D, 'wood', { line: 0.6, sub: [el(156, 146, 8, 8, '#b8e060', 'gem', { gloss: 1, line: 0 })] }),
      sh([P(144, 70, 1), P(162, 68, 1), P(166, 96, 1), P(142, 98, 1)], '#6e6660', 'horn', { gloss: 0.1, lines: bricks(142, 68, 166, 98, 8, 10) }),
      sh([P(30, 120, 1), [58, 88], [92, 66], P(118, 52, 1), [150, 70], [182, 92], P(200, 116, 1), [150, 110], [80, 114]], '#4a6e30', 'fur', { furLen: 0.7, flow: Math.PI / 2, dens: 0.9, belly: 0.3 }),
      el(154, 58, 9, 5, '#d8d8d0', 'cloth', { line: 0.4 }), el(160, 46, 11, 6, '#e8e8e0', 'cloth', { line: 0.4 }),
    ];
  });

  obj('arena', () => {
    const cx = 166, out = [el(cx, 196, 158, 14, '#3a3a36', 'flat', { line: 0 })];
    out.push(el(cx, 146, 156, 56, '#b4ac9c', 'horn', { gloss: 0.15, lines: [ln(ell(cx, 150, 138, 46, 24), 1.3, 0.5, { closed: true }), ln(ell(cx, 153, 124, 39, 24), 1.3, 0.5, { closed: true })] }));
    // колонны по дальнему краю трибун
    for (let i = 1; i < 8; i++) { const a = Math.PI + i / 8 * Math.PI, x = cx + Math.cos(a) * 146, y = 146 + Math.sin(a) * 50; out.push(sh(box(x - 7, y - 30, x + 7, y + 2), '#c8c2b4', 'horn', { gloss: 0.25, line: 0.7 }), sh(box(x - 9, y - 34, x + 9, y - 28), '#d8d2c4', 'horn', { line: 0.6 })); }
    out.push(el(cx, 158, 112, 32, SAND, 'cloth', { line: 0.8, ao: 0.8, lines: [ln([[cx - 60, 162], [cx - 20, 170]], 1, 0.3), ln([[cx + 30, 150], [cx + 70, 156]], 1, 0.3)] }));
    // ворота бойцов у дальнего края
    out.push(sh(box(cx - 26, 96, cx + 26, 132), '#a8a092', 'horn', { gloss: 0.2 }), hole(cx, 132, 26, 30));
    const arches = []; for (let i = 0; i < 11; i++) { const x = 30 + i * 27, y = 176 + Math.sin(Math.PI * i / 10) * 18; arches.push(ln(arch(x, y + 12, 12, 16).slice(1, -1), 2.6, 0.8)); }
    out.push(sh([P(8, 148, 1), [30, 178], [cx, 208], [302, 178], P(324, 148, 1), [300, 164], [cx, 190], [32, 164]], '#a49c8e', 'horn', { gloss: 0.15, lines: arches }));
    return out;
  });

  obj('mercenary_camp', () => [
    el(128, 238, 100, 9, '#3a3024', 'flat', { line: 0 }),
    sh([P(40, 238, 1), [80, 160], P(126, 66, 1), [172, 160], P(214, 238, 1)], '#b08a5a', 'cloth', { belly: 0.3, lines: [ln([[126, 70], [84, 236]], 1.3, 0.5), ln([[126, 70], [170, 236]], 1.3, 0.5), ln([[48, 226], [126, 232], [206, 226]], 1.4, 0.4)] }),
    sh([P(104, 238, 1), P(127, 150, 1), P(152, 238, 1)], DARK, 'cloth', { line: 0.6 }),
    sh([P(104, 238, 1), P(127, 150, 1), P(94, 226, 1)], '#c8a070', 'cloth', { line: 0.6 }), sh([P(152, 238, 1), P(127, 150, 1), P(162, 226, 1)], '#9a7448', 'cloth', { line: 0.6 }),
    ...flag(126, 72, 44, 44, 26, '#c8332a', { tri: true }),
    ...[[198, -0.16], [214, 0.16]].map(([x, a]) => { const tip = [x + Math.sin(a) * 96, 238 - Math.cos(a) * 96]; return sh(tube([[x, 238, 4], tip.concat([3])]), '#6a4424', 'wood', { line: 0.6 }); }),
    ...[[198, -0.16], [214, 0.16]].map(([x, a]) => { const t = [x + Math.sin(a) * 96, 238 - Math.cos(a) * 96]; return sh([P(t[0] - 6, t[1] + 4, 1), P(t[0] + Math.sin(a) * 22, t[1] - 20, 1), P(t[0] + 6, t[1] + 4, 1)], '#c8d0d8', 'steel', { line: 0.6 }); }),
    sh(tube([[190, 196, 4], [222, 196, 4]]), '#6a4424', 'wood', { line: 0.6 }),
  ]);

  /** Зубцы поверх прямоугольной стены/башни. */
  function merlons(x0, x1, y, n, h, c) { const out = [], w = (x1 - x0) / (n * 2 - 1); for (let i = 0; i < n; i++) { const x = x0 + i * w * 2; out.push(sh(box(x, y - h, x + w, y + 1), c, 'horn', { gloss: 0.15, lines: [ln([[x + 1, y - h + 1.5], [x + w - 1, y - h + 1.5]], 1, 0.4, { light: true })] })); } return out; }
  obj('marletto_tower', () => [
    el(92, 332, 44, 6, '#3a3a36', 'flat', { line: 0 }),
    wall(60, 104, 124, 334, '#aca69c', 14, 20),
    sh(box(52, 86, 132, 106), '#b8b2a8', 'horn', { gloss: 0.15, lines: [ln([[53, 104], [131, 104]], 1.4, 0.6)] }),
    ...merlons(52, 132, 86, 4, 16, '#b8b2a8'),
    door(92, 334, 26, 46, PLANK),
    ...win(92, 208, 14, 22, { glass: '#ffd84a' }),
    sh(box(88, 140, 96, 168), DARK, 'cloth', { line: 0.5 }),
    ...flag(66, 70, 24, 48, 28, TEAM, { pw: 4 }),
  ]);

  obj('star_axis', () => {
    const out = [
      el(113, 234, 80, 7, '#3a3a36', 'flat', { line: 0 }),
      sh(box(32, 218, 194, 236), '#8e8a84', 'horn', { gloss: 0.15, lines: [ln([[33, 219.5], [193, 219.5]], 1.2, 0.5, { light: true })] }),
      sh(box(44, 204, 182, 219), '#a8a49c', 'horn', { gloss: 0.15, lines: [ln([[45, 205.5], [181, 205.5]], 1.2, 0.5, { light: true })] }),
    ];
    for (const x of [62, 113, 164]) out.push(sh(box(x - 11, 130, x + 11, 204), '#d8d4cc', 'horn', { gloss: 0.3, lines: [ln([[x - 4, 132], [x - 4, 202]], 1, 0.35), ln([[x + 4, 132], [x + 4, 202]], 1, 0.35)] }));
    out.push(el(113, 126, 88, 15, '#b4b0a8', 'horn', { gloss: 0.3, sub: [el(113, 124, 64, 8, '#8e8a84', 'horn', { line: 0 })] }));
    out.push(el(30, 124, 9, 9, '#f4f4f8', 'gem', { glint: [[28, 121, 3]] }), el(196, 124, 9, 9, '#f4f4f8', 'gem', { glint: [[194, 121, 3]] }));
    out.push(sh(tube([[113, 124, 8], [113, 104, 6]], { flat0: true }), GOLD, 'gold'));
    out.push(el(113, 76, 34, 34, '#3a86e0', 'gem', { gloss: 1.2, rim: 0.8, lines: [ln(ell(113, 76, 14, 34, 16), 1.2, 0.5, { closed: true, light: true }), ln([[79, 76], [147, 76]], 1.2, 0.5, { light: true })], glint: [[102, 64, 9]] }));
    out.push(sh(ring(113, 76, 46, 14, 4.5, 26).map(p => { const a = -0.45, dx = p[0] - 113, dy = p[1] - 76; return P(113 + dx * Math.cos(a) - dy * Math.sin(a), 76 + dx * Math.sin(a) + dy * Math.cos(a)); }), GOLD, 'gold', { line: 0.6 }));
    return out;
  });

  obj('garden_revelation', (f, rnd) => {
    const out = [el(140, 238, 136, 10, '#2e4a22', 'flat', { line: 0 })];
    const hedge = (x0, x1) => { for (let layer = 0; layer < 2; layer++) for (let x = x0; x <= x1; x += 26) { const y = 176 - layer * 22 + (rnd() - 0.5) * 8, r = 24 + rnd() * 6; out.push(el(x, y, r * 1.05, r, layer ? '#4e9a3a' : '#2e6a26', 'feather', { texSize: 0.5, flow: Math.PI / 2, line: layer ? 0.5 : 0.8, ao: 0.8 })); } };
    hedge(20, 100); hedge(180, 262);
    out.push(sh(box(10, 194, 272, 230), '#3a7a2e', 'feather', { texSize: 0.5, line: 0.6 }));
    out.push(sh(tube([[118, 226, 16], [118, 132, 14]], { flat0: true }), '#d8d4ca', 'horn', { gloss: 0.3 }), sh(tube([[164, 226, 16], [164, 132, 14]], { flat0: true }), '#c8c4ba', 'horn', { gloss: 0.3 }));
    out.push(sh(tube([[116, 136, 16], [120, 110, 16], [141, 94, 16], [162, 110, 16], [166, 136, 16]], { flat0: true, flat1: true }), '#e2ded4', 'horn', { gloss: 0.3, lines: [ln([[141, 88], [141, 101]], 1.2, 0.5)] }));
    out.push(el(141, 94, 7, 7, '#ffe070', 'gem', { gloss: 1.2, line: 0.5 }));
    const cols = ['#f08ab8', '#ffd0e4', '#e060a0', '#fff0a0'];
    for (let i = 0; i < 14; i++) { const x = 18 + i * 18.5 + (rnd() - 0.5) * 6; if (x > 104 && x < 178) continue; out.push(el(x, 216 + (i % 2) * 8, 6, 5, cols[i % cols.length], 'cloth', { line: 0.4, glint: [[x - 1, 215 + (i % 2) * 8, 1.6]] })); }
    return out;
  });

  obj('observatory', () => [
    el(110, 332, 56, 6, '#3a3a36', 'flat', { line: 0 }),
    sh(box(62, 166, 158, 334), '#dcd8ce', 'horn', { gloss: 0.3, lines: bricks(62, 166, 158, 334, 14, 24) }),
    door(110, 334, 28, 50, '#7a4e2a'), ...win(110, 230, 14, 20, { glass: '#fff0a0' }),
    sh(box(50, 160, 170, 174), '#c8c4ba', 'horn', { gloss: 0.2, line: 0.8 }),
    sh([P(54, 162, 1), [58, 130], [80, 108], [110, 100], [140, 108], [162, 130], P(166, 162, 1)], '#a4a8b4', 'steel', { gloss: 0.6, lines: [ln([[110, 102], [110, 160]], 1.2, 0.4)] }),
    sh([P(118, 104, 1), P(132, 106, 1), P(134, 160, 1), P(120, 160, 1)], DARK, 'cloth', { line: 0.5 }),
    sh(tube([[118, 138, 18], [150, 102, 16], [184, 66, 13]], { flat0: true, flat1: true }), '#7a5a3a', 'leather', { gloss: 0.4, line: 0.8, lines: [ln([[140, 104], [156, 120]], 2.4, 0.8, { c: GOLD }), ln([[164, 80], [176, 92]], 2.4, 0.8, { c: GOLD })] }),
    el(184, 66, 6, 9, '#2a2a38', 'gem', { line: 0.8, lc: GOLD }),
  ]);

  obj('trading_post', () => [
    el(128, 212, 110, 9, '#3a3024', 'flat', { line: 0 }),
    sh(box(26, 200, 214, 218), '#8e8a84', 'horn', { gloss: 0.15, lines: bricks(26, 200, 214, 218, 9, 18) }),
    logWall(34, 110, 206, 202, LOG, 12),
    sh(box(30, 106, 40, 202), '#7a5030', 'wood', { flow: -Math.PI / 2, line: 0.6 }), sh(box(200, 106, 210, 202), '#6a4428', 'wood', { flow: -Math.PI / 2, line: 0.6 }),
    door(120, 202, 30, 58, PLANK), ...win(72, 150, 20, 20), ...win(168, 150, 20, 20),
    roof(34, 206, 112, 46, ROOF, { ov: 16, ins: 30, rows: 4, tiles: true }),
    el(120, 124, 13, 13, GOLD, 'gold', { line: 0.7, lines: [ln([[120, 116], [120, 132]], 2, 0.7)], glint: [[116, 120, 3]] }),
    ...barrel(226, 214, 28, 38),
    sh([P(8, 216, 1), [4, 196], [14, 176], [26, 172], [34, 184], [36, 204], P(32, 216, 1)], '#d8c89a', 'cloth', { line: 0.7, lines: [ln([[12, 180], [30, 180]], 1.6, 0.8, { c: '#8a6a3a' })] }),
  ]);

  obj('hill_fort', () => {
    const out = [sh([P(16, 318, 1), [36, 282], [100, 240], [170, 228], [244, 236], [306, 272], P(326, 318, 1), [170, 322]], '#8e7248', 'cloth', { belly: 0.4, lines: [ln([[40, 300], [100, 292]], 1.2, 0.3), ln([[230, 296], [290, 300]], 1.2, 0.3)] })];
    out.push(sh([P(50, 262, 1), [110, 234], [170, 226], [236, 234], P(292, 262, 1), [170, 270]], '#6a8a3a', 'fur', { furLen: 0.5, flow: -Math.PI / 2, line: 0.5 }));
    const yb = x => 266 - Math.sin((x - 40) / 260 * Math.PI) * 26;
    for (let x = 56; x <= 286; x += 15) {
      if (x > 146 && x < 196) continue;
      const b = yb(x), t = b - 104 - (x % 30 ? 0 : 6);
      out.push(sh([P(x - 7.5, b, 1), P(x - 7.5, t + 10, 1), P(x, t, 1), P(x + 7.5, t + 10, 1), P(x + 7.5, b, 1)], x % 30 ? '#8a5a32' : '#7a4e2a', 'wood', { flow: -Math.PI / 2, line: 0.7, lines: [ln([[x - 7, b - 70], [x + 7, b - 72]], 2.4, 0.8, { c: '#3a2a1a' })] }));
    }
    out.push(sh(box(148, 142, 194, 242), '#6a4428', 'wood', { flow: -Math.PI / 2 }), hole(171, 242, 36, 84));
    out.push(sh(tube([[140, 150, 11], [202, 150, 11]], { flat0: true, flat1: true }), '#7a4e2a', 'wood', { flow: 0 }));
    for (const x of [142, 200]) out.push(sh([P(x - 9, 244, 1), P(x - 9, 118, 1), P(x, 104, 1), P(x + 9, 118, 1), P(x + 9, 244, 1)], '#7a4e2a', 'wood', { flow: -Math.PI / 2, line: 0.8 }));
    out.push(...flag(172, 150, 72, 48, 28, '#c8332a'));
    return out;
  }, { dy: 12 });

  obj('tavern', () => [
    el(143, 286, 116, 8, '#3a3024', 'flat', { line: 0 }),
    logWall(42, 182, 236, 286, LOG, 13),
    sh(box(40, 118, 238, 184), '#e8dcc0', 'cloth', { lines: [ln([[40, 120], [238, 120]], 4, 0.9, { c: '#5a3a1c' }), ln([[40, 182], [238, 182]], 5, 0.9, { c: '#5a3a1c' }), ...[42, 90, 140, 188, 236].map(x => ln([[x, 120], [x, 182]], 4, 0.9, { c: '#5a3a1c' })), ln([[42, 120], [90, 182]], 3, 0.8, { c: '#5a3a1c' }), ln([[236, 120], [188, 182]], 3, 0.8, { c: '#5a3a1c' })] }),
    ...win(116, 150, 22, 22), ...win(164, 150, 22, 22), ...win(78, 230, 22, 22), ...win(206, 230, 22, 22),
    door(143, 286, 34, 64, PLANK, { ring: true }),
    roof(42, 236, 122, 52, ROOF, { ov: 16, ins: 32, rows: 5, tiles: true }),
    sh(box(96, 48, 112, 84), '#8a7a6e', 'horn', { gloss: 0.1, lines: bricks(96, 48, 112, 84, 8, 8) }),
    sh(tube([[236, 108, 5], [270, 108, 5]]), '#4a3020', 'wood', { line: 0.6 }),
    sh(tube([[250, 110, 1.6], [248, 124, 1.6]]), IRON, 'steel', { line: 0.3 }), sh(tube([[266, 110, 1.6], [268, 124, 1.6]]), IRON, 'steel', { line: 0.3 }),
    sh(box(240, 122, 276, 150), '#8a5a32', 'wood', { flow: 0, line: 0.8 }),
    sh(box(250, 128, 264, 146), '#f2c84a', 'gold', { line: 0.6, lines: [ln([[251, 131], [263, 131]], 3, 0.9, { c: '#fff8e0' })] }), sh(ring(266, 137, 4, 5, 2.4, 12), '#f2c84a', 'gold', { line: 0.4 }),
    ...barrel(30, 288, 26, 36), ...barrel(250, 288, 26, 36),
  ]);

  obj('seer_hut', () => [
    el(122, 246, 106, 16, EARTH, 'cloth', { line: 0.6, belly: 0.3 }),
    sh([P(42, 160, 1), [40, 200], [46, 236], [122, 250], [198, 236], [204, 200], P(202, 160, 1)], '#b89060', 'wood', { flow: 0, lines: [...logLines(36, 160, 208, 250, 12)] }),
    sh(box(106, 186, 138, 246), DARK, 'cloth', { line: 0.6 }), sh(box(102, 182, 142, 190), '#6a4428', 'wood', { line: 0.6 }),
    sh([P(24, 172, 1), [44, 150], [82, 108], P(122, 50, 1), [162, 108], [200, 150], P(222, 172, 1), [174, 176], [122, 180], [70, 176]], THATCH, 'fur', { furLen: 0.8, flow: Math.PI / 2, dens: 0.9, belly: 0.25, lines: [ln([[40, 160], [122, 166], [206, 160]], 1.4, 0.5)] }),
    ...crystals(214, 250, ['#c070f0', '#e0a0ff', '#a050d8'], 3, 44, 22),
  ]);

  obj('quest_guard', () => [
    el(113, 216, 44, 6, '#3a3a36', 'flat', { line: 0 }),
    sh(box(82, 196, 144, 216), '#8e8a84', 'horn', { gloss: 0.15, line: 0.8 }),
    wall(88, 76, 138, 198, '#aca69c', 13, 18),
    sh([P(82, 78, 1), [84, 60], [113, 44], [142, 60], P(144, 78, 1)], '#b8b2a8', 'horn', { gloss: 0.3 }),
    sh([P(90, 104, 1), P(136, 104, 1), [137, 134], P(113, 166, 1), [89, 134]], '#3a64c8', 'leather', { gloss: 0.5, line: 0.9, lc: '#1c2a5a',
      lines: [ln([[113, 108], [113, 160]], 5, 1, { c: GOLD }), ln([[93, 126], [133, 126]], 5, 1, { c: GOLD })], glint: [[100, 112, 4]] }),
    el(113, 126, 5, 5, '#fff0b0', 'gold', { line: 0.4 }),
  ]);

  obj('keymaster', () => [
    el(140, 230, 110, 8, '#3a3024', 'flat', { line: 0 }),
    sh([P(36, 228, 1), [74, 168], P(140, 52, 1), [206, 168], P(244, 228, 1)], '$r:#9a58c8', 'cloth', { belly: 0.3, lines: [ln([[140, 56], [96, 226]], 1.3, 0.5), ln([[140, 56], [186, 226]], 1.3, 0.5), ln([[44, 216], [140, 222], [236, 216]], 1.4, 0.4)] }),
    sh([P(116, 228, 1), P(140, 150, 1), P(164, 228, 1)], DARK, 'cloth', { line: 0.6 }),
    ...flag(140, 56, 30, 40, 18, '#f2d34c', { tri: true }),
    sh(tube([[212, 170, 11], [254, 222, 11]], { flat1: true }), '#f2c840', 'gold', { line: 0.8 }),
    sh([P(232, 206, 1), P(244, 194, 1), P(258, 208, 1), P(246, 220, 1)], '#f2c840', 'gold', { line: 0.7 }), sh([P(220, 192, 1), P(230, 182, 1), P(242, 194, 1), P(232, 204, 1)], '#f2c840', 'gold', { line: 0.7 }),
    sh(ring(200, 160, 22, 22, 10, 20), '#f2c840', 'gold', { line: 0.8, glint: [[190, 146, 4]] }),
  ]);

  obj('border_guard', () => {
    const out = [el(150, 256, 128, 7, '#3a3a36', 'flat', { line: 0 })];
    for (const x of [24, 218]) out.push(wall(x, 80, x + 58, 254, '#aca69c', 14, 20), sh(box(x - 4, 240, x + 62, 256), '#8e8a84', 'horn', { gloss: 0.15, line: 0.8 }));
    out.push(sh(box(18, 58, 282, 84), '#bcb6aa', 'horn', { gloss: 0.2, lines: [ln([[19, 60], [281, 60]], 1.2, 0.5, { light: true }), ln([[19, 76], [281, 76]], 1.2, 0.4)] }));
    // цепь провисает между столбами
    for (let i = 0; i <= 12; i++) { const t = i / 12, x = 84 + t * 132, y = 116 + Math.sin(t * Math.PI) * 22; out.push(el(x, y, i % 2 ? 7 : 5, i % 2 ? 4 : 6, '#6a6a74', 'steel', { line: 0.6, sub: [el(x, y, i % 2 ? 3 : 2, i % 2 ? 1.4 : 2.6, DARK, 'flat', { line: 0 })] })); }
    out.push(el(150, 156, 34, 34, '$r:#e0b020', 'gold', { line: 0.9, lines: [ln(ell(150, 156, 26, 26, 18), 1.6, 0.5, { closed: true })], sub: [el(150, 148, 8, 8, DARK, 'flat', { line: 0 }), sh([P(146, 150, 1), P(154, 150, 1), P(157, 170, 1), P(143, 170, 1)], DARK, 'flat', { line: 0 })], glint: [[139, 144, 6]] }));
    return out;
  });

  obj('subter_gate', () => [
    el(108, 240, 104, 10, '#2e2a30', 'flat', { line: 0 }),
    sh([P(4, 244, 1), [10, 190], [40, 122], [90, 72], [150, 74], [196, 120], [212, 190], P(210, 246, 1)], '#76707a', 'horn', { gloss: 0.15, belly: 0.3 }),
    sh([P(20, 230, 1), [30, 170], [58, 116], P(94, 80, 1), [80, 130], [60, 190], P(52, 240, 1)], '#908a94', 'horn', { gloss: 0.1, line: 0.4, ao: 0.4 }),
    sh([P(170, 96, 1), [198, 132], [210, 190], P(206, 244, 1), [180, 200]], '#5e5862', 'horn', { gloss: 0.05, line: 0.4, ao: 0.4 }),
    sh(archBand(108, 176, 52, 62, 16, 10), '#a49ea8', 'horn', { gloss: 0.2, line: 0.8 }),
    sh(arch(108, 244, 88, 128), '#2a1438', 'cloth', { line: 0.7, rim: 0, sub: [el(108, 196, 30, 44, '#8a3ac8', 'gem', { line: 0, gloss: 0.4 }), el(108, 200, 14, 26, '#e0a8ff', 'gem', { line: 0, gloss: 1 })],
      lines: [ln([[70, 232], [146, 232]], 2, 0.8, { c: '#5a4a60' }), ln([[78, 220], [138, 220]], 2, 0.7, { c: '#4a3a50' })] }),
  ], { dy: 12 });

  /* =================================================================== море */
  obj('boat', () => {
    const hull = [P(17, 127, 1), [120, 118], P(240, 107, 1), [238, 128], P(233, 147, 1), [216, 166], P(197, 180, 1), P(60, 180, 1), [30, 166], P(17, 147, 1)];
    return [
      sh([P(143, 9, 1), [120, 12], P(98, 19, 1), [120, 24], P(143, 29, 1)], '$b:#c8332a', 'cloth', { line: 0.6 }),
      sh(tube([[148, 150, 8], [148, 10, 6]], { flat0: true }), '#6a4424', 'wood', { flow: -Math.PI / 2, line: 0.7 }),
      sh([P(142, 22, 1), [112, 44], [82, 84], [60, 122], P(50, 144, 1), P(142, 144, 1)], '#f0ece0', 'cloth', { belly: 0.25, lines: [ln([[142, 52], [102, 60]], 1.2, 0.4), ln([[142, 86], [80, 94]], 1.2, 0.4), ln([[142, 118], [62, 124]], 1.2, 0.4)] }),
      sh(tube([[151, 32, 1.6], [236, 104, 1.6]]), '#3a2a1a', 'flat', { line: 0 }),
      sh([P(154, 34, 1), [196, 70], P(230, 103, 1), P(202, 112, 1), [176, 96], P(154, 76, 1)], '#e4dece', 'cloth', { belly: 0.2 }),
      sh(tube([[44, 146, 6], [152, 150, 6]]), '#6a4424', 'wood', { line: 0.6 }),
      sh(tube([[20, 150, 9], [16, 94, 7]], { flat0: true }), '#6a4424', 'wood', { line: 0.7 }),
      sh(hull, '#7a4e2a', 'wood', { flow: -0.08, lines: [ln([[24, 150], [236, 132]], 1.3, 0.55), ln([[30, 164], [226, 150]], 1.3, 0.55), ln([[44, 176], [210, 166]], 1.3, 0.5)] }),
      sh([P(17, 127, 1), P(240, 107, 1), P(240, 115, 1), P(17, 136, 1)], '#a8743e', 'wood', { flow: -0.08, line: 0.6 }),
      el(126, 182, 96, 6, '#b8e0f4', 'gem', { line: 0, gloss: 0.4 }),
    ];
  });

  obj('shipyard', () => {
    const out = [el(112, 168, 102, 8, '#1e4a6a', 'flat', { line: 0 })];
    for (const x of [30, 90, 150, 200]) out.push(sh(box(x - 4, 150, x + 4, 174), '#4a3020', 'wood', { line: 0.6 }));
    const planks = []; for (let x = 24; x < 210; x += 14) planks.push(ln([[x, 148], [x - 3, 168]], 1.2, 0.55));
    out.push(sh([P(10, 150, 1), P(212, 144, 1), P(206, 162, 1), P(14, 168, 1)], PLANK, 'wood', { flow: 0, lines: planks }));
    // остов лодки: киль, шпангоуты, нижние доски обшивки
    out.push(sh([P(40, 128, 1), [110, 124], P(186, 118, 1), [176, 140], P(56, 146, 1)], '#8a5a32', 'wood', { flow: -0.04, lines: [ln([[44, 134], [182, 124]], 1.2, 0.5)] }));
    for (let i = 0; i < 7; i++) { const x = 52 + i * 21, top = 60 + Math.abs(i - 3) * 6; out.push(sh(tube([[x, 136, 6], [x - 8, 100, 5], [x - 4, top, 4]]), '#a8743e', 'wood', { line: 0.6 })); }
    out.push(sh(tube([[40, 74, 5], [110, 60, 5], [190, 70, 5]]), '#a8743e', 'wood', { line: 0.6 }));
    out.push(sh(tube([[186, 120, 7], [196, 64, 5]]), '#8a5a32', 'wood', { line: 0.6 }));
    out.push(...logEnd(28, 164, 9), ...logEnd(48, 166, 9), ...logEnd(38, 150, 9));
    return out;
  });

  obj('flotsam', () => [
    water(97, 136, 88, 15, '#2e8a8a'),
    sh([P(20, 124, 1), P(104, 112, 1), P(106, 124, 1), P(22, 136, 1)], '#8a6038', 'wood', { flow: -0.14, lines: [ln([[24, 130], [102, 118]], 1, 0.5)] }),
    sh([P(46, 108, 1), P(118, 126, 1), P(114, 136, 1), P(42, 118, 1)], '#a07040', 'wood', { flow: 0.24, lines: [ln([[48, 113], [114, 130]], 1, 0.5)], glint: [[60, 112, 2]] }),
    sh([P(116, 94, 1), [136, 88], P(160, 92, 1), [166, 108], P(160, 126, 1), [136, 130], P(116, 124, 1)], '#9a6636', 'wood', { flow: 0, lines: [ln([[128, 90], [126, 128]], 2.4, 0.85, { c: IRON }), ln([[150, 90], [152, 128]], 2.4, 0.85, { c: IRON })] }),
    el(114, 109, 8, 15, '#b8844a', 'wood', { line: 0.7, lines: [ln(ell(114, 109, 4, 8, 8), 1, 0.4, { closed: true })] }),
    el(60, 138, 18, 3, '#d8f0f4', 'gem', { line: 0 }), el(150, 132, 14, 3, '#d8f0f4', 'gem', { line: 0 }),
  ]);

  obj('sea_chest', () => {
    const weed = (x, y, s) => sh(tube([[x, y, 6], [x + s * 4, y - 14, 5], [x - s * 2, y - 28, 3.5], [x + s * 5, y - 40, 2]]), '#3a7a3a', 'leather', { line: 0.5, gloss: 0.3 });
    return [water(96, 126, 80, 13, '#2e7aa0'), ...chest(96, 124, 104, 84, { body: '#6a4a30', band: '#b8902a' }), weed(40, 128, 1), weed(52, 130, -1), weed(146, 128, -1), weed(156, 126, 1),
      el(126, 106, 6, 5, '#e89a8a', 'horn', { line: 0.5 }), el(66, 110, 5, 4, '#e8d8c0', 'horn', { line: 0.5 })];
  });

  /* =================================================================== сокровищницы */
  obj('bank_crypt', () => {
    const skull = (x, y, r) => el(x, y, r, r * 1.05, '#ece6d4', 'horn', { gloss: 0.4, sub: [el(x - r * 0.38, y, r * 0.24, r * 0.3, DARK, 'flat', { line: 0 }), el(x + r * 0.38, y, r * 0.24, r * 0.3, DARK, 'flat', { line: 0 }), sh([P(x - 2, y + r * 0.55, 1), P(x + 2, y + r * 0.55, 1), P(x, y + r * 0.3, 1)], DARK, 'flat', { line: 0 })] });
    const out = [el(208, 280, 158, 22, '#4a464e', 'horn', { gloss: 0.1, line: 0.6, belly: 0.4 })];
    for (const x of [74, 342]) out.push(sh(tube([[x, 282, 18], [x, 170, 14]], { flat0: true }), '#d8d0bc', 'horn', { gloss: 0.3, lines: [ln([[x - 8, 240], [x + 8, 240]], 2, 0.6), ln([[x - 7, 200], [x + 7, 200]], 2, 0.6)] }), skull(x, 158, 17));
    out.push(wall(142, 120, 274, 280, '#6e6a74', 16, 26));
    out.push(sh([P(124, 126, 1), P(208, 66, 1), P(292, 126, 1)], '#3e3c46', 'leather', { gloss: 0.2, lines: [ln([[150, 118], [208, 80], [266, 118]], 1.4, 0.5)] }));
    out.push(sh(box(122, 124, 294, 134), '#5a5862', 'horn', { line: 0.7 }));
    out.push(hole(208, 280, 60, 112), sh(archBand(208, 204, 38, 44, 10, 10), '#8a8692', 'horn', { gloss: 0.2, line: 0.6 }));
    out.push(skull(208, 62, 18));
    out.push(...[[176, 272], [238, 276]].map(([x, y]) => sh(tube([[x - 12, y, 5], [x + 12, y - 3, 5]]), '#e0d8c4', 'horn', { line: 0.6 })));
    return out;
  }, { dy: 12 });

  obj('bank_dwarven', () => [
    el(208, 332, 176, 28, '#b09068', 'cloth', { line: 0.6, belly: 0.35, ao: 0.4 }),
    sh([P(236, 350, 1), [270, 322], [320, 318], [352, 334], P(340, 352, 1)], '#5a3a24', 'cloth', { line: 0.5 }),
    wall(118, 160, 298, 330, '#a8a4a0', 17, 30),
    sh(box(112, 150, 304, 168), '#8e8a86', 'horn', { gloss: 0.2, lines: [ln([[113, 152], [303, 152]], 1.2, 0.5, { light: true })] }),
    sh(box(112, 128, 144, 152), GOLD, 'gold', { line: 0.7, glint: [[120, 134, 4]] }), sh(box(272, 128, 304, 152), GOLD, 'gold', { line: 0.7, glint: [[280, 134, 4]] }),
    sh(archBand(208, 256, 50, 56, 12, 6), '#d8a838', 'gold', { line: 0.7 }),
    door(208, 330, 88, 132, '#7a4a26', { ring: true }),
    ...[[178, 232], [238, 232], [178, 292], [238, 292], [208, 222]].map(([x, y]) => el(x, y, 3.5, 3.5, '#f2d060', 'gold', { line: 0.4 })),
  ], { dy: 12 });

  obj('bank_griffin', () => {
    const out = [el(200, 368, 166, 28, '#8e8a86', 'horn', { gloss: 0.15, line: 0.6, belly: 0.4 })];
    out.push(sh(box(108, 336, 298, 356), '#c8c4bc', 'horn', { gloss: 0.15, lines: [ln([[109, 338], [297, 338]], 1.2, 0.5, { light: true })] }));
    out.push(sh(box(120, 178, 288, 338), '#8e8c8a', 'horn', { gloss: 0.05 }), hole(204, 338, 44, 84, { c: '#2a2630' }));
    for (const x of [132, 168, 240, 276]) out.push(sh(box(x - 11, 182, x + 11, 338), '#ecebe6', 'horn', { gloss: 0.3, lines: [ln([[x - 4, 184], [x - 4, 336]], 1, 0.35), ln([[x + 4, 184], [x + 4, 336]], 1, 0.35)] }), sh(box(x - 15, 172, x + 15, 184), '#f4f2ee', 'horn', { line: 0.7 }));
    out.push(sh(box(104, 156, 304, 174), '#e4e2dc', 'horn', { gloss: 0.2, lines: [ln([[105, 165], [303, 165]], 1.2, 0.4)] }));
    out.push(gable(204, 158, 100, 116, '#a8a8ac', { m: 'horn', lines: [ln([[110, 154], [204, 104], [298, 154]], 1.4, 0.5, { light: true })] }));
    // крыло грифона на коньке
    for (let i = 0; i < 6; i++) { const lf = K.leaf([204, 104], -Math.PI * (0.66 - i * 0.09), 84 - i * 8, 22); out.push(sh(lf.body, i % 2 ? '#e8e4dc' : '#d4d0c8', 'feather', { texSize: 0.4, flow: -Math.PI * (0.66 - i * 0.09), line: 0.6, lines: [ln(lf.shaft, 1, 0.4)] })); }
    out.push(el(204, 106, 9, 7, '#c8a040', 'gold', { line: 0.5 }));
    return out;
  }, { dy: 12 });

  obj('bank_utopia', () => {
    const horn = (x, y, s) => sh(tube([[x, y, 16], [x + s * 22, y - 22, 12], [x + s * 48, y - 26, 7], [x + s * 66, y - 44, 2]]), '#ece0b8', 'horn', { gloss: 0.5, line: 0.8 });
    return [
      el(250, 424, 210, 28, SAND, 'cloth', { line: 0.6, belly: 0.35, ao: 0.4 }),
      sh([P(292, 446, 1), [340, 418], [400, 416], [432, 432], P(420, 450, 1)], '#5a3a24', 'cloth', { line: 0.5 }),
      sh(box(128, 186, 372, 426), '#e8bf3c', 'gold', { gloss: 0.4, lines: bricks(128, 186, 372, 426, 22, 60) }),
      sh(box(118, 176, 382, 192), '#c8962a', 'gold', { line: 0.8 }),
      horn(120, 180, -1), horn(380, 180, 1), horn(186, 120, -0.7), horn(314, 120, 0.7),
      sh([P(100, 184, 1), P(250, 92, 1), P(400, 184, 1)], '#c8962a', 'gold', { gloss: 0.3, lines: [ln([[128, 178], [250, 106], [372, 178]], 1.6, 0.6, { light: true })] }),
      el(250, 148, 24, 24, '#d8202a', 'gem', { gloss: 1.3, rim: 0.8, lc: '#6a1010', glint: [[242, 140, 7]] }),
      sh(archBand(250, 290, 58, 66, 14, 6), '#f4d870', 'gold', { line: 0.7 }),
      hole(250, 426, 92, 184),
    ];
  }, { dy: 12 });

  /* =================================================================== осада (поле боя) */
  function siegeWall(o) {
    o = o || {}; const out = [], C = '#a8a296';
    // отдельные камни чуть светлее/темнее — кладка не выглядит заливкой
    const rnd = rngOf(o.seed || 7), subs = [];
    for (let i = 0; i < 16; i++) { const row = (rnd() * 15) | 0, y = 72 + row * 24, x = 26 + (row % 2 ? 22 : 0) + ((rnd() * 6) | 0) * 44; if (x + 44 > 286) continue; subs.push(sh(box(x + 1.5, y + 1.5, x + 42.5, y + 22.5), tone(C, rnd() < 0.5 ? 0.12 : -0.12), 'horn', { line: 0, ao: 0.3, gloss: 0 })); }
    out.push(wall(26, 72, 286, 446, C, 24, 44, { belly: 0.2, sub: subs }));
    out.push(sh(box(18, 426, 294, 450), '#8a857c', 'horn', { gloss: 0.1, line: 0.8, lines: [ln([[19, 428], [293, 428]], 1.2, 0.4, { light: true })] }));
    out.push(sh(box(16, 60, 296, 80), '#b8b2a6', 'horn', { gloss: 0.2, lines: [ln([[17, 62], [295, 62]], 1.4, 0.5, { light: true }), ln([[17, 78], [295, 78]], 1.4, 0.5)] }));
    const n = 5, w = 280 / (n * 2 - 1);
    for (let i = 0; i < n; i++) { if (o.gap && o.gap.includes(i)) continue; const x = 16 + i * w * 2; out.push(sh(box(x, 26, x + w, 61), '#b8b2a6', 'horn', { gloss: 0.2, lines: [ln([[x + 1, 28], [x + w - 1, 28]], 1.2, 0.5, { light: true })] })); }
    return out;
  }
  obj('wall_ok', () => siegeWall());
  obj('wall_dmg', () => [...siegeWall({ gap: [1, 3] }),
    sh([P(120, 60, 1), P(170, 60, 1), [164, 94], P(146, 118, 1), [128, 90]], '#3a3432', 'horn', { line: 0.8, gloss: 0, lo: 1.4, ao: 1.4 }),
    sh([P(40, 210, 1), [70, 196], P(96, 214, 1), [88, 250], P(56, 258, 1)], '#3a3432', 'horn', { line: 0.8, gloss: 0, lo: 1.4, ao: 1.4 }),
    sh([P(190, 300, 1), [230, 286], P(262, 306, 1), [250, 344], P(208, 346, 1)], '#3a3432', 'horn', { line: 0.8, gloss: 0, lo: 1.4, ao: 1.4 }),
    sh(tube([[140, 120, 2], [150, 170, 2], [138, 214, 2], [150, 262, 1.5]]), '#3a3434', 'flat', { line: 0 }),
    sh(tube([[96, 250, 2], [110, 300, 2], [100, 350, 1.5]]), '#3a3434', 'flat', { line: 0 }),
    ...[[60, 140, 16], [96, 180, 12], [210, 150, 14], [240, 250, 12], [120, 380, 16], [80, 320, 10]].map(([x, y, r]) => el(x, y, r * 1.3, r, '#5a8a3a', 'fur', { furLen: 0.4, line: 0.4, ao: 0.4 })),
  ]);
  obj('wall_broken', () => [
    sh([P(22, 172, 1), P(22, 128, 1), [60, 116], P(84, 124, 1), [120, 104], P(156, 118, 1), [196, 108], P(230, 122, 1), [262, 110], P(290, 126, 1), P(290, 172, 1)], '#a09a8e', 'horn', { gloss: 0.15, lines: bricks(22, 104, 290, 172, 18, 40) }),
    boulder(70, 104, 30, 16, '#aca69a'), boulder(150, 96, 36, 18, '#9a9488', 0.1), boulder(236, 100, 30, 15, '#b0aa9e'), boulder(112, 92, 20, 10, '#8e887c'), boulder(196, 88, 18, 10, '#a49e92'),
    boulder(40, 168, 18, 9, '#8e887c'), boulder(270, 168, 20, 9, '#9a9488'),
  ]);
  const gateArch = () => sh(archBand(156, 256, 82, 90, 20, 6), '#bcb6aa', 'horn', { gloss: 0.2, line: 0.8 });
  obj('gate', () => [...siegeWall(), gateArch(),
    Object.assign(door(156, 446, 148, 270, '#7a4a26'), { lines: [...[0.2, 0.4, 0.6, 0.8].map(t => ln([[82 + t * 148, 190], [82 + t * 148, 446]], 1.6, 0.6)), ...[0.25, 0.5, 0.75].map(t => ln([[82, 446 - 270 * t], [230, 446 - 270 * t]], 5, 0.9, { c: IRON }))],
      glint: [[100, 244, 3], [120, 244, 3], [140, 244, 3], [172, 244, 3], [192, 244, 3], [212, 244, 3], [100, 311, 3], [212, 311, 3]] }),
    sh(tube([[156, 180, 5], [156, 446, 5]], { flat0: true, flat1: true }), '#3a2616', 'wood', { line: 0.4 }),
  ]);
  obj('gate_broken', () => [...siegeWall(), gateArch(),
    hole(156, 446, 148, 270),
    sh([P(82, 446, 1), P(82, 250, 1), P(100, 226, 1), P(108, 262, 1), P(118, 240, 1), P(126, 446, 1)], '#6a4024', 'wood', { flow: -Math.PI / 2, lines: [ln([[82, 330], [126, 334]], 4, 0.9, { c: IRON })] }),
    sh([P(230, 446, 1), P(230, 290, 1), P(214, 270, 1), P(206, 300, 1), P(196, 282, 1), P(188, 446, 1)], '#5e3a20', 'wood', { flow: -Math.PI / 2, lines: [ln([[188, 370], [230, 366]], 4, 0.9, { c: IRON })] }),
    sh([P(120, 440, 1), P(170, 420, 1), P(176, 430, 1), P(126, 450, 1)], '#7a4a26', 'wood', { flow: -0.3 }),
    boulder(196, 440, 14, 7, '#a8a296'),
  ]);

  obj('siege_tower', () => {
    const out = [el(150, 526, 124, 10, '#3a3024', 'flat', { line: 0 })];
    const planks = []; for (let x = 64; x < 260; x += 24) planks.push(ln([[x, 106], [x, 498]], 1.2, 0.5));
    out.push(sh(box(44, 104, 256, 500), '#8a5a32', 'wood', { flow: -Math.PI / 2, lines: planks }));
    for (const y of [104, 236, 368, 496]) out.push(sh(tube([[36, y, 14], [264, y, 14]], { flat0: true, flat1: true }), '#6a4424', 'wood', { flow: 0 }));
    for (const x of [44, 256]) out.push(sh(tube([[x, 506, 14], [x, 96, 12]], { flat0: true, flat1: true }), '#6a4424', 'wood', { flow: -Math.PI / 2 }));
    out.push(sh(tube([[56, 240, 6], [244, 364, 6]]), '#7a4e2a', 'wood'), sh(tube([[244, 240, 6], [56, 364, 6]]), '#6a4424', 'wood'));
    out.push(sh(box(26, 66, 274, 100), '#7a4e2a', 'wood', { flow: 0, lines: [ln([[28, 70], [272, 70]], 1.4, 0.5, { light: true })] }));
    for (const x of [86, 150, 214]) out.push(el(x, 164, 26, 30, '#c8332a', 'leather', { gloss: 0.5, lc: '#5a1a14', lines: [ln([[x, 136], [x, 192]], 5, 1, { c: GOLD }), ln([[x - 24, 164], [x + 24, 164]], 5, 1, { c: GOLD })], glint: [[x - 8, 150, 5]] }));
    out.push(...win(150, 300, 30, 30, { glass: '#2a2228' }), ...win(150, 432, 30, 30, { glass: '#2a2228' }));
    out.push(...wheel(92, 500, 32, '#4a3424', { n: 8 }), ...wheel(208, 500, 32, '#4a3424', { n: 8, a: 0.3 }));
    return out;
  });

  obj('moat', () => {
    const out = [el(152, 112, 146, 42, '#5a4a36', 'cloth', { line: 0.7 }), el(152, 114, 134, 34, '#1e5a60', 'gem', { gloss: 0.5, line: 0.4, lines: [ln([[70, 104], [120, 98]], 1.4, 0.4, { light: true }), ln([[180, 124], [230, 118]], 1.4, 0.4, { light: true })] })];
    for (let i = 0; i < 9; i++) { const x = 44 + i * 27, b = 120 + Math.sin(i * 1.7) * 6, t = b - 46 - (i % 2) * 8, lean = (i % 3 - 1) * 6; out.push(sh([P(x - 6, b, 1), P(x + lean, t, 1), P(x + 6, b, 1)], '#6a4424', 'wood', { flow: -Math.PI / 2, line: 0.7 }), el(x, b, 9, 2.5, '#6ab0b8', 'gem', { line: 0 })); }
    return out;
  });

  /* =================================================================== боевые машины
     Стоят в бою как существа, смотрят вправо; цвет игрока — '$b' (эмблема, вымпел). */
  machine('ballista', f => {
    const a = f.anchor, tip = [178, 96], dir = [0.983, -0.183], nrm = [0.183, 0.983];
    return [
      { kind: 'torso', pivot: a.slice(), shapes: [
        el(94, 194, 74, 6, '#2a2418', 'flat', { line: 0 }),
        ...wheel(56, 172, 25, '#5a3a22'),
        sh(tube([[96, 144, 11], [98, 112, 10]], { flat0: true }), '#6a4424', 'wood', { flow: -Math.PI / 2 }),
        sh(tube([[22, 140, 15], [170, 104, 12]], { flat0: true, flat1: true }), '#8a5a32', 'wood', { flow: -0.24, lines: [ln([[34, 134], [164, 104]], 1.2, 0.5, { light: true })] }),
        sh([P(28, 140, 1), P(158, 140, 1), P(152, 166, 1), P(34, 166, 1)], '#7a4e2a', 'wood', { flow: 0, lines: [ln([[30, 152], [156, 152]], 1.2, 0.5), ln([[30, 141], [34, 165]], 3, 0.8, { c: IRON }), ln([[156, 141], [152, 165]], 3, 0.8, { c: IRON })] }),
        el(93, 153, 9, 9, TEAM, 'leather', { gloss: 0.5, line: 0.7, lc: '#2a1a10' }),
        ...wheel(130, 172, 25, '#5a3a22', { a: 0.3 }),
      ] },
      { kind: 'prop', pivot: [96, 110], shapes: [
        sh(tube([[146, 50, 1.8], [96, 110, 2], [146, 166, 1.8]]), ROPE, 'flat', { line: 0.3, lc: '#6a5a40' }),
        sh(tube([[92, 112, 4.5], [tip[0], tip[1], 4.5]], { flat1: true }), '#a8743e', 'wood', { line: 0.6 }),
        sh([P(tip[0] + nrm[0] * 7, tip[1] + nrm[1] * 7, 1), P(tip[0] + dir[0] * 20, tip[1] + dir[1] * 20, 1), P(tip[0] - nrm[0] * 7, tip[1] - nrm[1] * 7, 1)], '#c8d0d8', 'steel', { line: 0.6 }),
        sh(tube([[144, 48, 6], [154, 74, 9], [158, 108, 11], [154, 142, 9], [144, 168, 6]]), '#6a4424', 'horn', { gloss: 0.3, line: 0.8, lines: [ln([[156, 94], [158, 122]], 3.4, 0.8, { c: IRON })] }),
        el(92, 112, 4.5, 4.5, IRON, 'steel', { line: 0.4 }),
      ] },
    ];
  });

  machine('first_aid_tent', f => [{ kind: 'torso', pivot: f.anchor.slice(), shapes: [
    el(92, 166, 76, 6, '#2a2418', 'flat', { line: 0 }),
    sh([P(92, 44, 1), [128, 100], P(158, 164, 1), P(172, 154, 1), [138, 96]], '#c8c4b8', 'cloth', { line: 0.7 }),
    sh([P(20, 166, 1), [54, 108], P(92, 44, 1), [126, 106], P(158, 166, 1)], '#f0ece0', 'cloth', { belly: 0.25, lines: [ln([[92, 48], [60, 164]], 1.2, 0.4), ln([[92, 48], [126, 164]], 1.2, 0.4)] }),
    sh([P(74, 166, 1), P(90, 130, 1), P(106, 166, 1)], '#8a8474', 'cloth', { line: 0.5 }),
    sh([P(84, 82, 1), P(100, 82, 1), P(100, 98, 1), P(116, 98, 1), P(116, 114, 1), P(100, 114, 1), P(100, 130, 1), P(84, 130, 1), P(84, 114, 1), P(68, 114, 1), P(68, 98, 1), P(84, 98, 1)], '#d02a2a', 'cloth', { line: 0.8, lc: '#6a1010' }),
    ...flag(92, 48, 18, 30, 16, TEAM, { tri: true, pw: 3 }),
    sh([P(138, 168, 1), [134, 150], P(146, 140, 1), P(170, 140, 1), [176, 152], P(172, 168, 1)], '#7a4a26', 'leather', { gloss: 0.3, line: 0.7, lines: [ln([[138, 148], [174, 148]], 2, 0.7)] }),
    sh(tube([[148, 142, 3], [154, 130, 3], [162, 130, 3], [166, 142, 3]]), '#5a3418', 'leather', { line: 0.4 }),
  ] }]);

  machine('ammo_cart', f => {
    const sheaf = (x, y) => [
      sh([P(x - 9, y, 1), P(x - 14, y - 44, 1), P(x + 14, y - 44, 1), P(x + 9, y, 1)], '#c8a070', 'wood', { flow: -Math.PI / 2, line: 0.5, lines: [-8, -3, 2, 7].map(d => ln([[x + d * 0.7, y - 2], [x + d * 1.3, y - 42]], 1, 0.5)).concat([ln([[x - 11, y - 22], [x + 11, y - 22]], 3, 0.9, { c: '#6a3a1c' })]) }),
      sh([P(x - 16, y - 42, 1), P(x - 12, y - 56, 1), P(x - 4, y - 44, 1), P(x, y - 58, 1), P(x + 4, y - 44, 1), P(x + 12, y - 56, 1), P(x + 16, y - 42, 1)], '#eeeae0', 'feather', { texSize: 0.4, line: 0.5 })];
    return [{ kind: 'torso', pivot: f.anchor.slice(), shapes: [
      el(92, 160, 76, 6, '#2a2418', 'flat', { line: 0 }),
      ...flag(26, 94, 34, 30, 15, TEAM, { tri: true, pw: 3.4 }),
      ...sheaf(50, 94),
      ...barrel(90, 96, 34, 42, '#8a5a32'), ...barrel(124, 96, 30, 36, '#9a6636'),
      el(146, 90, 8, 8, '#3a3a42', 'steel', { line: 0.6 }), el(62, 92, 7, 7, '#3a3a42', 'steel', { line: 0.6 }),
      sh(tube([[150, 128, 6], [184, 142, 4]]), '#6a4424', 'wood', { line: 0.6 }),
      sh([P(20, 88, 1), P(162, 88, 1), P(154, 140, 1), P(28, 140, 1)], '#8a5a32', 'wood', { flow: 0, lines: [ln([[22, 106], [160, 106]], 1.2, 0.5), ln([[24, 123], [158, 123]], 1.2, 0.5), ln([[22, 90], [160, 90]], 2.4, 0.6, { light: true }), ln([[22, 90], [28, 138]], 3.2, 0.85, { c: IRON }), ln([[160, 90], [154, 138]], 3.2, 0.85, { c: IRON })] }),
      el(91, 114, 8, 8, TEAM, 'leather', { gloss: 0.5, line: 0.7, lc: '#2a1a10' }),
      ...wheel(52, 142, 22, '#5a3a22'), ...wheel(132, 142, 22, '#5a3a22', { a: 0.3 }),
    ] }];
  });
})(typeof window !== 'undefined' ? window : globalThis);
