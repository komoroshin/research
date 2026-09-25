/* ============================================================================
   view/vec_icons.js — иконки на рисованном конвейере: ресурсы, характеристики,
   кнопки интерфейса (ic_*), артефакты (art_*), заклинания (sp_*), вторичные
   навыки (sk_*).

   Каждая иконка рисуется в своём квадрате 100×100 (y вниз) и вписывается в рамку
   старой пиксельной иконки (K.frameOf) с полями M — так она занимает рамку
   так же плотно, как старая. Иконки мелкие (16–32 точки в интерфейсе), поэтому:
   крупные формы, ясный силуэт, контур толще обычного (LW), минимум мелочи.
   Фон прозрачный; у заклинаний фон-плашка цветом школы — часть смысла.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, rot, frameOf, tone } = K;

  /* ---------- основа: формы, штрихи, вписывание ---------- */
  const LW = 1.5;      // контур иконок — толще обычного, чтобы силуэт читался мелко
  const M = 5;         // поля в рамке старой иконки, дизайн-единицы
  const rad = d => d * Math.PI / 180;
  const sharp = pts => pts.map(q => P(q[0], q[1], 1));
  /** Форма по точкам. */
  const S = (p, c, m, o) => Object.assign({ p, c, m: m || 'cloth', line: LW }, o);
  /** Эллипс. */
  const E = (cx, cy, rx, ry, c, m, o) => Object.assign({ e: [cx, cy, rx, ry], c, m: m || 'cloth', line: LW }, o);
  /** Точки вдоль отрезка: at(t, w) — t вдоль от начала, w поперёк; f — острый угол. */
  function seg(x0, y0, x1, y1) {
    const L = Math.hypot(x1 - x0, y1 - y0), dx = (x1 - x0) / L, dy = (y1 - y0) / L;
    const at = (t, w, f) => P(x0 + dx * t - dy * (w || 0), y0 + dy * t + dx * (w || 0), f);
    at.L = L; at.ang = Math.atan2(dy, dx);
    return at;
  }
  /** Точки из центра по углу: pol(cx, cy, r, угол°). */
  const pol = (cx, cy, r, a, f) => P(cx + Math.cos(rad(a)) * r, cy + Math.sin(rad(a)) * r, f);
  /** Звезда: n лучей, R — внешний, r — внутренний радиус, a0 — угол первого луча (°, −90 — вверх). */
  function star(cx, cy, R, r, n, a0) {
    a0 = a0 === undefined ? -90 : a0; const out = [];
    for (let i = 0; i < n * 2; i++) out.push(pol(cx, cy, i % 2 ? r : R, a0 + i * 180 / n, 1));
    return out;
  }
  /** Прямоугольник со скруглёнными углами (скругление r). */
  function rrect(x0, y0, x1, y1, r) {
    const out = [], C = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]];
    for (const [cx, cy, a] of C) for (let i = 0; i <= 3; i++) out.push(pol(cx, cy, r, a + i * 30, i === 0 || i === 3 ? 1 : 0));
    return out;
  }
  /** Кольцо-обод (дырка посередине): трубка по эллипсу; шов на угле seam°. */
  function band(cx, cy, rx, ry, w, seam) {
    const n = 28, a0 = seam === undefined ? 90 : seam, c = [];
    for (let i = 0; i <= n; i++) { const a = rad(a0 + i * 360 / n); c.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, w]); }
    return tube(c, { flat0: true, flat1: true });
  }
  /** Перенести готовые формы: f — функция точки, k — масштаб (штрихи тоже). */
  function xf(list, f, k) {
    const out = K.mapShapes(list, f, k);
    const fix = s => { if (s.lines) s.lines = s.lines.map(l => Object.assign({}, l, { w: (l.w || 1.3) * k })); if (s.sub) s.sub.forEach(fix); };
    out.forEach(fix); return out;
  }
  /** Сдвиг и масштаб вокруг (50, 50) квадрата. */
  const place = (list, s, dx, dy) => xf(list, (x, y) => [50 + (x - 50) * s + (dx || 0), 50 + (y - 50) * s + (dy || 0)], s);
  /** Зеркало по горизонтали. */
  const mirror = list => xf(list, (x, y) => [100 - x, y], 1);
  /** Поворот вокруг (cx, cy) на a°. */
  const turn = (list, a, cx, cy) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); cx = cx === undefined ? 50 : cx; cy = cy === undefined ? 50 : cy;
    return xf(list, (x, y) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c], 1); };
  const hl = (p, a, w) => ({ p, w: w || 1.4, light: true, a: a || 0.8 });   // светлый штрих
  const dl = (p, a, w) => ({ p, w: w || 1.4, a: a || 0.6 });                // тёмный штрих

  /** Описать иконку: формы в квадрате 100×100 → рамка старой иконки. */
  function icon(name, shapes) {
    const fr = frameOf(name) || { w: 160, h: 160, anchor: [80, 160] };
    const k = (Math.min(fr.w, fr.h) - 2 * M) / 100, ox = (fr.w - 100 * k) / 2, oy = (fr.h - 100 * k) / 2;
    const list = xf(shapes.flat().filter(Boolean), (x, y) => [ox + x * k, oy + y * k], k);
    V.def(name, { w: fr.w, h: fr.h, anchor: fr.anchor, parts: [{ kind: 'torso', pivot: [fr.w / 2, fr.h / 2], shapes: list }] });
  }

  /* ---------- краски ---------- */
  const GOLD = '#e2b43c', STEEL = '#c6ced8', IRON = '#7e8792', WOOD = '#94602e', BARK = '#6e4424', LEATHER = '#8a5430',
    BONE = '#ece2c4', RED = '#d0342a', BLUE = '#3a6ad8', GREEN = '#4cae3a', PURPLE = '#9048d0', WHITE = '#f4f2ea',
    PARCH = '#eadbb0', GLASS = '#cfe9f2', DARK = '#2e2a34', SKIN = '#eab88c';

  /* ---------- детали ---------- */
  /** Меч от навершия (x0, y0) к острию (x1, y1). o: { bw — ширина клинка, blade, guard, grip, g0 — где гарда } */
  function sword(x0, y0, x1, y1, o) {
    o = o || {}; const a = seg(x0, y0, x1, y1), L = a.L, bw = o.bw || 11, g0 = o.g0 || L * 0.27, gw = o.gw || bw * 2.7, gt = o.gt || 7;
    const tipL = o.tip || bw * 1.3;
    return [
      S(tube([[...a(4), 7.5], [...a(g0), 7.5]]), o.grip || '#5a3418', 'leather', { lines: [dl([a(g0 * 0.4, -3.5), a(g0 * 0.4, 3.5)], 0.6), dl([a(g0 * 0.7, -3.5), a(g0 * 0.7, 3.5)], 0.6)] }),
      E(...a(3), o.pr || 7, o.pr || 7, o.pommel || o.guard || GOLD, 'gold'),
      S([a(g0 - 1, -bw / 2, 1), a(L - tipL, -bw / 2, 1), a(L, 0, 1), a(L - tipL, bw / 2, 1), a(g0 - 1, bw / 2, 1)], o.blade || '#e2e8ee', 'steel',
        { gloss: 1.2, lc: o.bladeLc, lines: [dl([a(g0 + 4, 0.5), a(L - tipL * 1.1, 0.5)], 0.35, 1.6), hl([a(g0 + 3, -bw * 0.24), a(L - tipL * 1.05, -bw * 0.24)], 0.9, 1.6)] }),
      S([a(g0 - gt / 2, -gw / 2, 1), a(g0 + gt / 2, -gw / 2, 1), a(g0 + gt / 2, gw / 2, 1), a(g0 - gt / 2, gw / 2, 1)], o.guard || GOLD, 'gold'),
    ];
  }
  /** Геральдический щит: центр, ширина, высота; o: { field, rim, fieldM, charge: формы на поле, boss } */
  function heater(cx, cy, w, h, o) {
    o = o || {}; const hw = w / 2, t = cy - h / 2;
    const out = (s, k) => [P(cx - hw * s, t + h * (1 - k) * 0.5, 1), P(cx, t + h * (1 - k) * 0.5 - h * 0.035 * k), P(cx + hw * s, t + h * (1 - k) * 0.5, 1),
      P(cx + hw * 0.97 * s, cy + h * 0.02 * k), P(cx + hw * 0.6 * s, cy + h * 0.32 * k), P(cx, cy + h * 0.5 * k - h * 0.02 * (1 - k), 1), P(cx - hw * 0.6 * s, cy + h * 0.32 * k), P(cx - hw * 0.97 * s, cy + h * 0.02 * k)];
    const res = [S(out(1, 1), o.rim || GOLD, o.rimM || 'gold'),
      S(out(0.8, 0.83), o.field || BLUE, o.fieldM || 'steel', { gloss: 0.8, line: 1, sub: o.charge || [], lines: o.fieldLines })];
    if (o.boss) res.push(E(cx, cy - h * 0.04, w * 0.12, w * 0.12, o.boss, 'steel', { glint: [[cx - w * 0.04, cy - h * 0.08, w * 0.05]] }));
    return res;
  }
  /** Крест на щите (для sub). */
  const cross = (cx, cy, w, h, t, c) => [
    S(sharp([[cx - t / 2, cy - h / 2], [cx + t / 2, cy - h / 2], [cx + t / 2, cy + h / 2], [cx - t / 2, cy + h / 2]]), c, 'gold', { line: 1 }),
    S(sharp([[cx - w / 2, cy - t / 2 - h * 0.12], [cx + w / 2, cy - t / 2 - h * 0.12], [cx + w / 2, cy + t / 2 - h * 0.12], [cx - w / 2, cy + t / 2 - h * 0.12]]), c, 'gold', { line: 1 })];
  /** Сапог носком вправо в квадрате 100×100. o: { c, sole, cuff, lace } */
  function boot(o) {
    o = o || {}; const c = o.c || LEATHER;
    return [
      S([P(28, 10, 1), P(64, 8, 1), [62, 30], [62, 54], [74, 60], [88, 66], [95, 76], P(95, 88, 1), P(24, 88, 1), [20, 76], [26, 60], [28, 36]], c, 'leather',
        { lines: [dl([[62, 56], [48, 62], [36, 60]], 0.45), hl([[34, 16], [36, 50]], 0.5, 2)],
          sub: [S(sharp([[0, 80], [100, 80], [100, 100], [0, 100]]), o.sole || '#3a2618', 'leather', { line: 1 }),
            S(sharp([[0, 0], [100, 0], [100, 22], [0, 24]]), o.cuff || tone(c, -0.25), 'leather', { line: 1 })] }),
    ];
  }
  /** Закрытая книга: обложка c, эмблема — формы (в квадрате, центр ≈ 48, 50). */
  function book(c, emblem, o) {
    o = o || {};
    return [
      S(sharp([[28, 14], [86, 12], [90, 88], [32, 92]]), '#f0e6c8', 'cloth', { line: LW, lines: [dl([[86, 30], [89, 84]], 0.4, 1.2), dl([[80, 90], [36, 92]], 0.4, 1.2)] }),
      S([P(12, 12, 1), P(76, 6, 1), [79, 44], P(80, 84, 1), P(16, 92, 1), [14, 50]], c, 'leather', { gloss: 0.3,
        sub: [S(tube([[14, 8, 15], [16, 96, 15]]), tone(c, -0.35), 'leather', { line: 1 }),
          S(sharp([[64, 6], [80, 6], [80, 20]]), o.corner || GOLD, 'gold', { line: 0.8 }), S(sharp([[80, 72], [80, 88], [66, 88]]), o.corner || GOLD, 'gold', { line: 0.8 })],
        lines: [hl([[26, 14], [72, 10]], 0.5, 1.6)] }),
      ...(emblem || []),
    ];
  }
  /** Череп анфас. o: { c, eye (цвет глазниц), glow } */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || BONE, X = (x, y, f) => P(cx + x * r, cy + y * r, f);
    return [
      S([X(-0.86, 0.1), X(-0.9, -0.45), X(-0.5, -0.92), X(0, -1), X(0.5, -0.92), X(0.9, -0.45), X(0.86, 0.1), X(0.6, 0.42), X(0.56, 0.9, 1), X(-0.56, 0.9, 1), X(-0.6, 0.42)], c, 'horn',
        { gloss: 0.4, lines: [dl([X(-0.32, 0.62), X(-0.3, 0.9)], 0.7, 1.6), dl([X(0, 0.62), X(0, 0.92)], 0.7, 1.6), dl([X(0.32, 0.62), X(0.3, 0.9)], 0.7, 1.6), dl([X(-0.55, 0.6), X(0.55, 0.6)], 0.5, 1.4)] }),
      E(cx - 0.36 * r, cy + 0.02 * r, 0.25 * r, 0.28 * r, o.eye || '#20160f', o.glow ? 'gem' : 'flat', { line: 0.8, glint: o.glow ? [[cx - 0.4 * r, cy - 0.04 * r, 0.12 * r]] : undefined }),
      E(cx + 0.36 * r, cy + 0.02 * r, 0.25 * r, 0.28 * r, o.eye || '#20160f', o.glow ? 'gem' : 'flat', { line: 0.8, glint: o.glow ? [[cx + 0.32 * r, cy - 0.04 * r, 0.12 * r]] : undefined }),
      S(sharp([[cx - 0.1 * r, cy + 0.44 * r], [cx + 0.1 * r, cy + 0.44 * r], [cx, cy + 0.26 * r]]), '#20160f', 'flat', { line: 0.6 }),
    ];
  }
  /** Пламя: основание (cx, by), ширина, высота; cols — [внешний, средний, сердце]. */
  function flame(cx, by, w, h, cols) {
    cols = cols || ['#e84a1c', '#f89a22', '#ffe89a'];
    const F = (s, dy) => { const W = w * s, Hh = h * s; const y = by - dy;
      return [P(cx + W * 0.04, y - Hh, 1), [cx + W * 0.26, y - Hh * 0.66], P(cx + W * 0.4, y - Hh * 0.72, 1), [cx + W * 0.5, y - Hh * 0.34], [cx + W * 0.4, y - Hh * 0.08], [cx, y],
        [cx - W * 0.4, y - Hh * 0.08], [cx - W * 0.5, y - Hh * 0.32], P(cx - W * 0.42, y - Hh * 0.62, 1), [cx - W * 0.24, y - Hh * 0.48], [cx - W * 0.16, y - Hh * 0.74]]; };
    return [S(F(1, 0), cols[0], 'flat', { lc: tone(cols[0], -0.6) }), S(F(0.68, h * 0.02), cols[1], 'flat', { line: 0 }), S(F(0.38, h * 0.04), cols[2], 'flat', { line: 0 })];
  }
  /** Молния-зигзаг в квадрате (масштабируй place). */
  const boltPts = () => sharp([[64, 2], [24, 54], [48, 54], [30, 98], [80, 38], [56, 38], [80, 2]]);
  /** Сердце: центр, радиус. */
  function heartPts(cx, cy, r) {
    const X = (x, y, f) => P(cx + x * r, cy + y * r, f);
    return [X(0, 0.95, 1), X(-0.62, 0.36), X(-0.96, -0.12), X(-0.86, -0.62), X(-0.46, -0.86), X(-0.1, -0.7), X(0, -0.5, 1), X(0.1, -0.7), X(0.46, -0.86), X(0.86, -0.62), X(0.96, -0.12), X(0.62, 0.36)];
  }
  /** Капля остриём вверх. */
  function dropPts(cx, cy, r) {
    const X = (x, y, f) => P(cx + x * r, cy + y * r, f);
    return [X(0, -1.55, 1), X(0.5, -0.66), X(0.92, 0.1), X(0.84, 0.66), X(0.4, 0.98), X(-0.4, 0.98), X(-0.84, 0.66), X(-0.92, 0.1), X(-0.5, -0.66)];
  }
  /** Клевер-четырёхлистник: центр, радиус листа, цвет. */
  function clover(cx, cy, r, c, o) {
    o = o || {}; const out = [S(tube([[cx, cy, 7], [cx + r * 0.5, cy + r * 1.4, 6.5], [cx + r * 0.3, cy + r * 2.2, 5.5]]), o.stem || tone(c, -0.2), 'leather')];
    for (let i = 0; i < 4; i++) {
      const a = 45 + i * 90, lx = cx + Math.cos(rad(a - 90)) * r * 0.62 * 0, ly = 0;
      const leafC = [cx + Math.cos(rad(a)) * r * 0.78, cy + Math.sin(rad(a)) * r * 0.78];
      out.push(S(rot(heartPts(leafC[0], leafC[1], r * 0.72), leafC[0], leafC[1], rad(a - 90 + 180)), i % 2 ? tone(c, 0.08) : c, 'leather',
        { gloss: 0.4, lines: [hl([[cx + (lx || 0), cy + ly], [cx + Math.cos(rad(a)) * r * 1.2, cy + Math.sin(rad(a)) * r * 1.2]], 0.55, 1.6)] }));
    }
    out.push(E(cx, cy, r * 0.18, r * 0.18, tone(c, -0.2), 'leather', { line: 0.8 }));
    return out;
  }
  /** Самоцвет огранки «бриллиант» сбоку: центр, радиус, цвет. */
  function gem(cx, cy, r, c, o) {
    o = o || {}; const X = (x, y, f) => P(cx + x * r, cy + y * r, f);
    return [S([X(-1, -0.25, 1), X(-0.56, -0.8, 1), X(0.56, -0.8, 1), X(1, -0.25, 1), X(0, 1, 1)], c, 'gem',
      { gloss: 1.2, lc: o.lc, lines: [hl([X(-0.96, -0.25), X(0.96, -0.25)], 0.7, 1.4), dl([X(-0.3, -0.8), X(-0.4, -0.25), X(0, 0.96)], 0.4, 1.2), dl([X(0.3, -0.8), X(0.4, -0.25), X(0, 0.96)], 0.4, 1.2)],
        glint: [[cx - r * 0.4, cy - r * 0.5, r * 0.3]] })];
  }
  /** Кристалл-призма: основание (bx, by), угол (°), длина, ширина. */
  function prism(bx, by, a, len, wid, c, o) {
    const r = rad(a), at = seg(bx, by, bx + Math.cos(r), by + Math.sin(r));
    return S([at(0, -wid / 2, 1), at(len * 0.74, -wid / 2, 1), at(len, 0, 1), at(len * 0.74, wid / 2, 1), at(0, wid / 2, 1)], c, 'gem',
      Object.assign({ gloss: 1, lines: [hl([at(len * 0.04, -wid * 0.1), at(len * 0.74, -wid * 0.1), at(len * 0.98, 0)], 0.75, 1.5)] }, o));
  }
  /** Перьевое крыло, поднятое влево-вверх (корень справа внизу ≈ 92, 64) в квадрате 100×100: маховые перья + кроющие. */
  function wingL(c) {
    const out = [];
    const F = [[80, 60, 56, 94], [70, 50, 36, 86], [60, 40, 18, 74], [50, 32, 6, 54], [42, 26, 4, 32], [38, 22, 10, 8]];
    F.forEach(([bx, by, tx, ty], i) => {
      const lf = K.leaf([bx, by], Math.atan2(ty - by, tx - bx), Math.hypot(tx - bx, ty - by), 21);
      out.push(S(lf.body, i % 2 ? c : tone(c, -0.1), 'cloth', { lines: [hl(lf.shaft, 0.5, 1.2)] }));
    });
    out.push(S([[97, 72], [97, 50], [86, 34], [66, 20], [46, 12], [28, 12], [26, 22], [44, 30], [60, 42], [74, 58], [84, 76]], tone(c, 0.08), 'cloth',
      { lines: [hl([[90, 50], [70, 30], [44, 18]], 0.7, 1.8), dl([[40, 28], [58, 40], [74, 58]], 0.3, 1.4)] }));
    return out;
  }
  /** Шлем анфас. o: { c, visor (цвет прорези), crest — формы сверху, band — цвет обода } */
  function helm(o) {
    o = o || {}; const c = o.c || STEEL;
    return [
      ...(o.crest || []),
      S([P(14, 90, 1), [13, 62], [20, 38], [36, 22], [50, 18], [64, 22], [80, 38], [87, 62], P(86, 90, 1)], c, 'steel',
        { gloss: 1.1, lines: [hl([[30, 32], [50, 24], [66, 28]], 0.7, 2)],
          sub: [S(sharp([[20, 50], [80, 50], [80, 60], [56, 60], [56, 90], [44, 90], [44, 60], [20, 60]]), o.visor || '#1a1820', 'flat', { line: 0.8 }),
            ...(o.band ? [S(sharp([[0, 38], [100, 38], [100, 46], [0, 46]]), o.band, 'gold', { line: 0.8 })] : [])] }),
    ];
  }
  /** Кираса анфас: цвет, отделка, эмблема (формы). */
  function cuirass(c, trim, emblem, o) {
    o = o || {};
    const body = [P(22, 12, 1), [36, 18], [50, 30], [64, 18], P(78, 12, 1), [90, 22], [86, 42], [82, 70], [72, 88], [50, 95], [28, 88], [18, 70], [14, 42], [10, 22]];
    return [S(body, c, o.m || 'steel', Object.assign({ gloss: o.m ? 0.4 : 1, lines: [hl([[50, 34], [50, 90]], 0.55, 2), dl([[26, 44], [40, 54], [50, 52], [60, 54], [74, 44]], 0.45, 1.6)],
      sub: [...(trim ? [S(tube([[20, 8, 8], [36, 20, 8], [50, 32, 8], [64, 20, 8], [80, 8, 8]]), trim, 'gold', { line: 0.8 }), S(sharp([[0, 76], [100, 76], [100, 84], [0, 84]]), trim, 'gold', { line: 0.8 })] : [])] }, o.opt)),
    ...(emblem || [])];
  }
  /** Плащ: цвет, застёжка-камень. */
  function cape(c, gemC) {
    return [
      S([P(34, 14, 1), [50, 18], P(66, 14, 1), [76, 26], [86, 60], [92, 88], [78, 92], [64, 86], [50, 92], [36, 86], [22, 92], [8, 88], [14, 60], [24, 26]], c, 'cloth',
        { lines: [dl([[40, 30], [34, 86]], 0.5, 1.6), dl([[60, 30], [66, 86]], 0.5, 1.6), hl([[26, 34], [16, 80]], 0.5, 1.6)] }),
      S(tube([[26, 18, 11], [50, 24, 11], [74, 18, 11]]), GOLD, 'gold'),
      E(50, 25, 7, 7, gemC || RED, 'gem', { glint: [[48, 23, 3]] }),
    ];
  }
  /** Кольцо с камнем. */
  function ring(gemC) {
    return [
      S(band(50, 60, 30, 26, 12, -90), GOLD, 'gold', { gloss: 1.2, lines: [hl(ell(50, 60, 30, 26, 18).slice(9, 15), 0.6, 1.6)] }),
      S(sharp([[38, 36], [62, 36], [58, 26], [42, 26]]), GOLD, 'gold'),
      ...gem(50, 22, 16, gemC),
    ];
  }
  /** Цепочка ожерелья (U) от (x0, top) до (x1, top) с низом в (50, bot). */
  const chain = (bot) => S(tube([[16, 6, 6], [18, 30, 6], [32, bot - 10, 6], [50, bot, 6], [68, bot - 10, 6], [82, 30, 6], [84, 6, 6]]), GOLD, 'gold', { gloss: 1, lines: [dl([[18, 12], [22, 36], [34, bot - 8]], 0.3, 1.4)] });
  /** Стрела от хвоста к острию. o: { shaft, head, fl — оперение } */
  function arrow(x0, y0, x1, y1, o) {
    o = o || {}; const a = seg(x0, y0, x1, y1), L = a.L, hw = o.hw || 9, hl0 = o.hlen || 20;
    return [
      S(tube([[...a(4), o.sw || 5], [...a(L - hl0 + 2), o.sw || 5]]), o.shaft || WOOD, 'wood', { flow: a.ang }),
      S([a(0, -1, 1), a(14, -9, 1), a(22, -9, 1), a(16, -1, 1)], o.fl || RED, 'cloth', { line: 1.2 }),
      S([a(0, 1, 1), a(14, 9, 1), a(22, 9, 1), a(16, 1, 1)], tone(o.fl || RED, -0.2), 'cloth', { line: 1.2 }),
      S([a(L - hl0, -hw, 1), a(L, 0, 1), a(L - hl0, hw, 1), a(L - hl0 + 5, 0, 1)], o.head || STEEL, 'steel', { gloss: 1.2 }),
    ];
  }
  /** Ладонь пальцами вверх (кость, камень, кожа). */
  function palm(c, m, o) {
    o = o || {}; const f = [];
    const fingers = [[30, 40, 26, 12], [42, 34, 18, 10], [54, 34, 16, 10], [66, 40, 22, 10]];
    for (const [x, y0, y1, w] of fingers) f.push(S(tube([[x, 60, w], [x + (x - 48) * 0.12, y0 - (y0 - y1) * 0.3, w * 0.95], [x + (x - 48) * 0.18, y1, w * 0.85]]), c, m, { line: LW }));
    return [...f,
      S(tube([[78, 72, 13], [86, 58, 11], [88, 46, 10]]), c, m),
      S([[24, 52], [74, 52], [80, 70], [70, 86], [60, 96], [40, 96], [28, 84], [22, 66]], c, m, { lines: o.lines || [dl([[34, 62], [46, 70], [60, 64]], 0.4, 1.4)] }),
    ];
  }

  /* ======================= ic_*: ресурсы, характеристики, кнопки ======================= */
  /** Столбик монет: центр x, низ y, число монет, радиус, толщина монеты. */
  function coins(cx, by, n, r, th, c) {
    const ry = r * 0.38, top = by - n * th, lines = [];
    for (let i = 1; i < n; i++) { const y = by - i * th; lines.push(dl([[cx - r, y], [cx - r * 0.5, y + ry * 0.85], [cx, y + ry], [cx + r * 0.5, y + ry * 0.85], [cx + r, y]], 0.55, 1.5)); }
    return [
      S([P(cx - r, top, 1), P(cx + r, top, 1), P(cx + r, by, 1), [cx + r * 0.7, by + ry * 0.72], [cx, by + ry], [cx - r * 0.7, by + ry * 0.72], P(cx - r, by, 1)], tone(c, -0.12), 'gold', { lines }),
      E(cx, top, r, ry, tone(c, 0.1), 'gold', { gloss: 1.3, lines: [Object.assign(dl(ell(cx, top, r * 0.64, ry * 0.58, 14), 0.4, 1.3), { closed: true })] }),
    ];
  }
  icon('ic_gold', [
    coins(64, 62, 4, 22, 9, GOLD),
    coins(36, 80, 6, 24, 9, GOLD),
    E(78, 84, 17, 7, tone(GOLD, 0.1), 'gold', { gloss: 1.3, lines: [Object.assign(dl(ell(78, 84, 11, 4, 12), 0.4, 1.2), { closed: true })] }),
  ]);
  /** Бревно: торец (cx, cy), тело уходит на (dx, dy). */
  const log = (cx, cy, r, dx, dy) => [
    S(tube([[cx, cy, r * 2], [cx + dx, cy + dy, r * 2]], { flat0: true }), BARK, 'wood', { flow: Math.atan2(dy, dx), lines: [dl([[cx + dx * 0.25, cy - r * 0.45 + dy * 0.25], [cx + dx * 0.9, cy - r * 0.45 + dy * 0.9]], 0.5, 1.6)] }),
    E(cx, cy, r * 0.94, r, '#e4b878', 'wood', { flow: 0.3, lines: [Object.assign(dl(ell(cx, cy, r * 0.56, r * 0.6, 12), 0.5, 1.4), { closed: true }), Object.assign(dl(ell(cx, cy, r * 0.22, r * 0.24, 8), 0.5, 1.4), { closed: true })] }),
  ];
  icon('ic_wood', [log(26, 76, 15, 24, -16), log(60, 76, 15, 24, -16), log(43, 49, 15, 24, -16)]);
  const rock = (pts, c) => S(pts, c || '#9298a2', 'horn', { gloss: 0.5, lines: [hl([pts[1], pts[2]], 0.6, 1.6)] });
  icon('ic_ore', [
    E(28, 84, 11, 11, '#3a3a42', 'steel', { glint: [[25, 81, 3]] }), E(72, 84, 11, 11, '#3a3a42', 'steel', { glint: [[69, 81, 3]] }),
    rock([[12, 50], [18, 34], [34, 26], [44, 40], [42, 52]]),
    rock([[34, 50], [40, 24], [56, 12], [70, 24], [68, 50]], '#a4aab4'),
    rock([[60, 50], [66, 32], [80, 26], [90, 38], [88, 50]], '#868c96'),
    S(sharp([[8, 46], [92, 46], [84, 82], [16, 82]]), '#8a5a2c', 'wood', { flow: 0, lines: [dl([[12, 62], [88, 62]], 0.5, 2)],
      sub: [S(sharp([[28, 40], [36, 40], [36, 90], [28, 90]]), IRON, 'steel', { line: 0.8 }), S(sharp([[64, 40], [72, 40], [72, 90], [64, 90]]), IRON, 'steel', { line: 0.8 })] }),
    S(tube([[6, 47, 8], [94, 47, 8]]), IRON, 'steel'),
  ]);
  icon('ic_mercury', [
    S([P(40, 12, 1), P(60, 12, 1), [60, 36], [76, 46], [86, 64], [82, 82], [68, 93], [50, 96], [32, 93], [18, 82], [14, 64], [24, 46], P(40, 36, 0)], GLASS, 'gem',
      { gloss: 1.3, line: LW, lc: '#3a5a68', sub: [S(sharp([[0, 58], [100, 58], [100, 100], [0, 100]]), '#c4cad4', 'steel', { gloss: 1.5, line: 0.8, lines: [hl([[20, 60], [80, 60]], 0.9, 2)] })],
        glint: [[30, 54, 7]] }),
    S(rrect(36, 2, 64, 16, 3), '#9a6a3a', 'wood'),
  ]);
  icon('ic_sulfur', [
    prism(40, 86, -118, 50, 20, '#d8b42a'), prism(62, 86, -62, 52, 20, '#d8b42a'),
    prism(50, 90, -90, 78, 26, '#f4d63c'),
    prism(24, 92, -150, 30, 16, '#e8c832'), prism(76, 92, -30, 30, 16, '#e8c832'),
    S([[8, 94], [20, 82], [40, 80], [60, 80], [80, 82], [92, 94]], '#8a7040', 'horn', { line: LW }),
  ]);
  icon('ic_crystal', [
    prism(38, 88, -122, 56, 24, '#b02838'), prism(62, 88, -58, 56, 24, '#b02838'),
    prism(50, 92, -90, 84, 32, '#e03848'),
    S([[14, 96], [26, 84], [50, 82], [74, 84], [86, 96]], '#6a5a58', 'horn', { line: LW }),
  ]);
  icon('ic_gems', [
    gem(52, 40, 30, '#3cc050'),
    gem(24, 68, 20, '#3a78e8'),
    gem(78, 70, 20, '#e03040'),
    gem(50, 82, 14, '#f0c830'),
  ]);
  icon('ic_att', [sword(14, 88, 90, 10, { bw: 13 })]);
  icon('ic_def', [heater(50, 50, 80, 92, { field: BLUE, charge: cross(50, 50, 44, 60, 10, GOLD) })]);
  icon('ic_defend', [heater(50, 50, 84, 94, { field: '#2c58c0', rim: '#cfd6de', rimM: 'steel', charge: cross(50, 50, 50, 64, 14, GOLD), boss: '#f0d060' })]);
  icon('ic_pow', [
    S(star(66, 30, 34, 13, 8, -90), '#ffe79a', 'flat', { line: 0 }),
    S(tube([[18, 96, 10], [42, 62, 10], [60, 36, 9]]), WOOD, 'wood', { flow: rad(-55) }),
    S(tube([[52, 48, 8], [58, 40, 9]]), GOLD, 'gold', { line: 1.2 }),
    E(66, 30, 16, 16, '#b448f0', 'gem', { gloss: 1.4, glint: [[61, 25, 6]] }),
  ]);
  icon('ic_kno', [book('#b8282a', [S(sharp([[46, 30], [60, 48], [46, 66], [32, 48]]), GOLD, 'gold', { glint: [[43, 42, 4]] })])]);
  icon('ic_spellbook', [book('#6a34b0', [S(star(46, 50, 22, 9, 5), GOLD, 'gold', { glint: [[43, 44, 4]] })])]);
  icon('ic_mana', [S(dropPts(50, 60, 30), '#3a78e8', 'gem', { gloss: 1.4, glint: [[40, 52, 8]], lines: [hl([[36, 44], [30, 60], [34, 72]], 0.7, 2.2)] })]);
  icon('ic_hp', [S(heartPts(50, 50, 46), '#d8283a', 'gem', { gloss: 1.2, glint: [[30, 30, 9]] })]);
  icon('ic_luck', [clover(46, 42, 22, '#3cb040')]);
  /** Золотые крылья с камнем — мораль. */
  icon('ic_morale', [
    place(wingL('#f0c040'), 0.56, -22, -8), mirror(place(wingL('#f0c040'), 0.56, -22, -8)),
    S(heartPts(50, 60, 26), '#d83a30', 'gem', { gloss: 1.2, glint: [[40, 52, 6]] }),
  ]);
  icon('ic_speed', [wingL(WHITE)]);
  icon('ic_move', [boot({ c: '#9a5e2e' })]);
  icon('ic_xp', [S(star(50, 54, 48, 20, 5), '#f4c83a', 'gold', { gloss: 1.2, glint: [[42, 42, 7]], lines: [hl([[50, 10], [50, 50]], 0.5, 1.6)] })]);
  icon('ic_day', [
    S(star(50, 50, 49, 30, 12, -90), '#ffb830', 'gold', { line: 1.2 }),
    E(50, 50, 28, 28, '#ffe050', 'gold', { gloss: 1.2, glint: [[42, 42, 8]] }),
  ]);
  icon('ic_crown', [
    S([P(8, 84, 1), P(8, 34, 1), P(30, 58, 1), P(50, 22, 1), P(70, 58, 1), P(92, 34, 1), P(92, 84, 1)], GOLD, 'gold',
      { gloss: 1.2, sub: [S(sharp([[0, 68], [100, 68], [100, 100], [0, 100]]), tone(GOLD, -0.15), 'gold', { line: 1 })] }),
    E(8, 30, 7, 7, GOLD, 'gold'), E(50, 18, 8, 8, GOLD, 'gold'), E(92, 30, 7, 7, GOLD, 'gold'),
    E(30, 76, 6, 6, '#e03040', 'gem', { line: 1 }), E(50, 76, 7, 7, '#3a78e8', 'gem', { line: 1 }), E(70, 76, 6, 6, '#3cc050', 'gem', { line: 1 }),
  ]);
  icon('ic_hero', [helm({ c: STEEL, crest: [S(tube([[50, 22, 10], [60, 6, 14], [80, 4, 12], [94, 16, 8]]), RED, 'cloth')] })]);
  icon('ic_town', [
    S(tube([[62, 6, 3], [62, 22, 3]]), '#4a3a2a', 'wood', { line: 1 }), S(sharp([[63, 6], [82, 10], [63, 16]]), RED, 'cloth', { line: 1.2 }),
    S(sharp([[26, 36], [74, 36], [72, 94], [28, 94]]), '#b0aca6', 'horn', { lines: [dl([[27, 52], [73, 52]], 0.4), dl([[28, 68], [72, 68]], 0.4), dl([[28, 82], [72, 82]], 0.4), dl([[50, 36], [50, 52]], 0.3), dl([[40, 52], [40, 68]], 0.3), dl([[60, 52], [60, 68]], 0.3)] }),
    S(sharp([[18, 22], [30, 22], [30, 30], [44, 30], [44, 22], [56, 22], [56, 30], [70, 30], [70, 22], [82, 22], [82, 40], [18, 40]]), '#c4c0ba', 'horn'),
    S([P(40, 94, 1), [40, 76], [50, 68], [60, 76], P(60, 94, 1)], '#4a3020', 'wood', { line: 1.2 }),
    E(50, 54, 5, 7, '#1a1820', 'flat', { line: 0.8 }),
  ]);
  /** Флаг на древке. */
  const flag = (c) => [
    S(tube([[20, 8, 7], [20, 96, 7]]), '#6a4424', 'wood'),
    S([P(23, 10, 1), [44, 6], [66, 14], [92, 10], [86, 30], P(90, 46, 1), [66, 48], [44, 42], P(23, 46, 1)], c, 'cloth', { lines: [dl([[44, 10], [44, 40]], 0.35, 1.6), dl([[66, 16], [66, 46]], 0.35, 1.6)] }),
    E(20, 6, 6, 6, GOLD, 'gold'),
  ];
  icon('ic_flag', [flag(RED)]);
  icon('ic_surrender', [flag(WHITE)]);
  icon('ic_flee', [
    S(tube([[48, 56, 14], [34, 70, 12], [16, 74, 10]]), '#5a3a24', 'cloth'),
    S(tube([[48, 30, 10], [36, 40, 9], [26, 36, 8]]), '#b02a24', 'cloth'),
    S(tube([[48, 56, 14], [66, 70, 12], [60, 92, 10]]), '#6a4a2c', 'cloth'),
    S([P(56, 94, 1), [70, 90], P(76, 96, 1)], '#3a2618', 'leather'),
    S(tube([[62, 26, 18], [48, 56, 16]]), '#d0342a', 'cloth'),
    S(tube([[60, 32, 10], [74, 44, 9], [86, 36, 8]]), '#b02a24', 'cloth'),
    E(66, 14, 11, 11, SKIN, 'skin'),
    S(tube([[4, 50, 3], [20, 50, 3]]), '#f0e6c8', 'flat', { line: 0 }), S(tube([[2, 62, 3], [16, 62, 3]]), '#f0e6c8', 'flat', { line: 0 }),
  ]);
  icon('ic_wait', [
    E(50, 54, 42, 42, STEEL, 'steel', { gloss: 1.2 }),
    E(50, 54, 33, 33, '#f6f0e0', 'cloth', { line: 1, lines: [dl([[50, 24], [50, 30]], 0.8, 2.5), dl([[80, 54], [74, 54]], 0.8, 2.5), dl([[50, 84], [50, 78]], 0.8, 2.5), dl([[20, 54], [26, 54]], 0.8, 2.5)] }),
    S(tube([[50, 56, 6], [50, 30, 5]]), '#2a2420', 'flat', { line: 0 }), S(tube([[48, 54, 6], [68, 64, 5]]), '#2a2420', 'flat', { line: 0 }),
    E(50, 54, 4.5, 4.5, RED, 'gem', { line: 0.8 }),
    E(50, 8, 7, 5, STEEL, 'steel'),
  ]);
  icon('ic_end_turn', [
    S(tube([[22, 14, 7], [22, 86, 7]]), WOOD, 'wood'), S(tube([[78, 14, 7], [78, 86, 7]]), WOOD, 'wood'),
    S([[30, 16], [70, 16], [68, 34], [54, 50], [68, 66], [70, 84], [30, 84], [32, 66], [46, 50], [32, 34]], GLASS, 'gem',
      { gloss: 1.1, lc: '#3a5a68', sub: [S([[20, 72], [50, 58], [80, 72], [80, 100], [20, 100]], '#f0c040', 'cloth', { line: 0.8 }), S(sharp([[36, 32], [64, 32], [52, 46], [48, 46]]), '#f0c040', 'cloth', { line: 0.8 }), S(tube([[50, 46, 3], [50, 60, 3]]), '#f0c040', 'flat', { line: 0 })] }),
    S(rrect(12, 6, 88, 18, 4), GOLD, 'gold'), S(rrect(12, 82, 88, 94, 4), GOLD, 'gold'),
  ]);
  /** Шестерня. */
  function gearPts(cx, cy, R, r, n) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = i * 360 / n; out.push(pol(cx, cy, r, a - 360 / n * 0.3, 0), pol(cx, cy, R, a - 360 / n * 0.18, 1), pol(cx, cy, R, a + 360 / n * 0.18, 1), pol(cx, cy, r, a + 360 / n * 0.3, 0)); }
    return out;
  }
  icon('ic_auto', [
    S(gearPts(50, 50, 48, 36, 8), '#b8c0cc', 'steel', { gloss: 1.1 }),
    E(50, 50, 20, 20, '#8a929e', 'steel', { line: 1.2 }),
    E(50, 50, 10, 10, '#2a2a32', 'flat', { line: 1 }),
  ]);
  icon('ic_check', [S(tube([[12, 54, 17], [38, 80, 18], [90, 22, 16]]), '#48c038', 'gem', { gloss: 0.8 })]);
  icon('ic_cross', [S(tube([[16, 16, 18], [84, 84, 18]]), '#d8342a', 'gem', { gloss: 0.6 }), S(tube([[84, 16, 18], [16, 84, 18]]), '#d8342a', 'gem', { gloss: 0.6 })]);
  icon('ic_arrow_r', [S(sharp([[6, 36], [52, 36], [52, 12], [96, 50], [52, 88], [52, 64], [6, 64]]), GOLD, 'gold', { gloss: 1.1, lines: [hl([[10, 40], [54, 40]], 0.7, 2)] })]);
  icon('ic_exchange', [
    S(sharp([[6, 20], [60, 20], [60, 6], [94, 30], [60, 54], [60, 40], [6, 40]]), GOLD, 'gold', { gloss: 1 }),
    S(sharp([[94, 60], [40, 60], [40, 46], [6, 70], [40, 94], [40, 80], [94, 80]]), STEEL, 'steel', { gloss: 1 }),
  ]);
  icon('ic_save', [
    S(sharp([[22, 18], [78, 18], [78, 84], [22, 84]]), PARCH, 'cloth', { lines: [dl([[30, 32], [70, 32]], 0.55, 2.4), dl([[30, 44], [64, 44]], 0.55, 2.4), dl([[30, 56], [70, 56]], 0.55, 2.4), dl([[30, 68], [56, 68]], 0.55, 2.4)] }),
    S(tube([[12, 16, 15], [88, 16, 15]]), '#d8c490', 'cloth'), S(tube([[12, 86, 15], [88, 86, 15]]), '#d8c490', 'cloth'),
    E(70, 76, 9, 9, '#c02a24', 'gem', { line: 1.2 }),
  ]);
  icon('ic_shots', [arrow(10, 92, 92, 10, { hw: 11, hlen: 24, sw: 6 })]);
  icon('ic_skull', [skull(50, 48, 42)]);
  icon('ic_sound', [
    S(tube([[36, 78, 6], [36, 20, 6]]), '#efe6d0', 'horn'), S(tube([[82, 70, 6], [82, 12, 6]]), '#efe6d0', 'horn'),
    S(sharp([[33, 14], [85, 4], [85, 20], [33, 30]]), '#efe6d0', 'horn'),
    S(ell(26, 80, 13, 10, 12, rad(-20)), '#efe6d0', 'horn'), S(ell(72, 72, 13, 10, 12, rad(-20)), '#efe6d0', 'horn'),
  ]);

  /* ======================= art_*: артефакты ======================= */
  icon('art_centaur_axe', [
    S(tube([[18, 94, 9], [46, 52, 9], [68, 18, 8]]), WOOD, 'wood', { flow: rad(-57) }),
    S([P(56, 30, 1), [66, 10], [84, 6], [96, 20], [94, 42], [82, 54], P(70, 40, 1)], STEEL, 'steel', { gloss: 1.2, lines: [hl([[84, 9], [94, 22], [92, 40]], 0.9, 2)] }),
    S(tube([[56, 38, 11], [72, 16, 11]]), IRON, 'steel', { line: 1.2 }),
  ]);
  icon('art_dwarven_shield', [heater(50, 50, 84, 94, { field: '#b8c0ca', charge: [
    S(tube([[50, 36, 8], [50, 80, 8]]), WOOD, 'wood', { line: 1 }), S(rrect(32, 24, 68, 40, 3), GOLD, 'gold', { line: 1 })] })]);
  icon('art_unicorn_helm', [helm({ c: '#e8ecf2', band: '#c8ccd8', crest: [S([P(44, 22, 1), P(58, 22, 1), P(54, 0, 1)], '#fff6e0', 'horn', { gloss: 1.2, lines: [dl([[47, 16], [56, 14]], 0.5), dl([[49, 9], [55, 8]], 0.5)] })] })]);
  icon('art_skull_helmet', [skull(50, 50, 44, { eye: '#e02020', glow: true })]);
  icon('art_petrified_breastplate', [cuirass('#8a6444', null, [], { m: 'wood', opt: { flow: rad(90) } })]);
  icon('art_ring_conjuring', [ring('#3a78e8')]);
  icon('art_ring_life', [ring('#3cc050')]);
  icon('art_ring_vitality', [ring('#e03040')]);
  icon('art_badge_courage', [
    S(sharp([[34, 4], [48, 4], [56, 46], [44, 50]]), '#c02a30', 'cloth'), S(sharp([[66, 4], [52, 4], [44, 46], [56, 50]]), '#e04040', 'cloth'),
    E(50, 66, 28, 28, GOLD, 'gold', { gloss: 1.2 }),
    S(star(50, 66, 18, 8, 5), '#fff0a0', 'gold', { line: 1 }),
  ]);
  icon('art_clover_fortune', [clover(46, 40, 24, '#2ea040', { stem: '#c8a030' })]);
  icon('art_blackshard', [sword(12, 90, 92, 8, { bw: 12, blade: '#4a3a66', guard: '#8a8a9a', pommel: '#a050e0', bladeLc: '#c080ff' })]);
  icon('art_gnoll_flail', [
    S(tube([[14, 94, 10], [40, 56, 9]]), WOOD, 'wood'),
    S(tube([[38, 60, 12], [44, 50, 12]]), IRON, 'steel'),
    ...[[48, 44], [54, 38], [60, 33]].map(([x, y]) => E(x, y, 4.5, 4.5, IRON, 'steel', { line: 1 })),
    S(star(74, 26, 26, 14, 10), IRON, 'steel'),
    E(74, 26, 17, 17, '#9aa2ac', 'steel', { gloss: 1.2 }),
  ]);
  icon('art_gnoll_buckler', [
    E(50, 50, 46, 46, '#8a5a30', 'wood'),
    E(50, 50, 34, 34, '#9aa2ac', 'steel', { line: 1.2 }),
    E(50, 50, 13, 13, '#d0d6de', 'steel', { glint: [[46, 46, 5]] }),
    ...[0, 90, 180, 270].map(a => E(50 + Math.cos(rad(a + 45)) * 40, 50 + Math.sin(rad(a + 45)) * 40, 3.5, 3.5, STEEL, 'steel', { line: 0.8 })),
  ]);
  icon('art_magi_crown', [
    S([P(8, 86, 1), P(8, 30, 1), P(24, 52, 1), P(38, 22, 1), P(50, 46, 1), P(62, 22, 1), P(76, 52, 1), P(92, 30, 1), P(92, 86, 1)], '#4a6ae0', 'steel',
      { gloss: 1.1, sub: [S(sharp([[0, 70], [100, 70], [100, 100], [0, 100]]), GOLD, 'gold', { line: 1 })] }),
    ...gem(38, 56, 10, '#f0d040'), ...gem(62, 56, 10, '#f0d040'),
    E(50, 78, 6, 6, '#e03040', 'gem', { line: 1 }),
  ]);
  icon('art_rib_cage', [
    S(tube([[50, 6, 10], [50, 94, 10]]), BONE, 'horn'),
    ...[18, 34, 50, 66].map((y, i) => S(tube([[50, y, 8], [28 - i, y + 4, 8], [16 + i * 2, y + 14, 7], [22 + i * 3, y + 20, 6]]), BONE, 'horn')),
    ...[18, 34, 50, 66].map((y, i) => S(tube([[50, y, 8], [72 + i, y + 4, 8], [84 - i * 2, y + 14, 7], [78 - i * 3, y + 20, 6]]), BONE, 'horn')),
    S(tube([[50, 10, 12], [50, 70, 10]]), '#f6eed6', 'horn'),
  ]);
  icon('art_basilisk_scales', [cuirass('#48a048', null, [], { m: 'leather', opt: { tex: 'scale', texSize: 1.1, flow: rad(90) } })]);
  icon('art_boots_speed', [
    boot({ c: '#8a5a2e' }),
    place(wingL(WHITE), 0.5, -30, -26),
  ]);
  icon('art_equestrian_gloves', (() => {
    const glove = c => [
      S([P(22, 96, 1), P(22, 74, 1), [16, 58], [14, 40], [22, 36], [26, 50], [28, 22], [36, 18], [40, 24], [42, 14], [50, 12], [54, 20], [58, 16], [66, 18], [68, 30], [70, 44], [68, 62], P(66, 74, 1), P(66, 96, 1)], c, 'leather',
        { lines: [dl([[38, 26], [38, 50]], 0.5), dl([[52, 22], [52, 50]], 0.5), dl([[62, 24], [62, 50]], 0.5)], sub: [S(sharp([[0, 74], [100, 74], [100, 100], [0, 100]]), tone(c, -0.3), 'leather', { line: 1 })] })];
    return [place(glove('#a07040'), 0.82, -14, 4), place(glove('#b88050'), 0.82, 18, 8)];
  })());
  icon('art_cape_conjuring', [cape('#3a5ad0', '#4ad0f0')]);
  icon('art_necklace_swiftness', [chain(64), place(wingL(WHITE), 0.44, 2, 30)]);
  icon('art_sword_hellfire', [
    flame(80, 40, 30, 38, ['#e8401c', '#ffa020', '#fff0a0']),
    sword(12, 90, 90, 10, { bw: 13, blade: '#f06a28', guard: '#3a2a2a', pommel: '#e04020', bladeLc: '#8a2010' }),
  ]);
  icon('art_shield_yawning_dead', [heater(50, 50, 84, 94, { field: '#3c3a46', rim: '#8a8e98', rimM: 'steel', charge: skull(50, 46, 24) })]);
  icon('art_thunder_helmet', [helm({ c: '#aeb6c2', band: GOLD, crest: [S(place([S(boltPts(), '#ffd83a', 'gold')], 0.36, 16, -38)[0].p, '#ffd83a', 'gold')] })]);
  icon('art_armor_wonder', [cuirass('#f2dcf0', GOLD, [E(50, 56, 9, 9, '#a050e0', 'gem', { glint: [[47, 53, 3]] })])]);
  icon('art_ogre_club', [
    S(tube([[14, 94, 10], [36, 64, 16], [60, 36, 26], [76, 18, 30]]), '#8a5a2e', 'wood', { flow: rad(-50), lines: [dl([[48, 50], [54, 46]], 0.6, 2.4), dl([[64, 30], [70, 26]], 0.6, 2.4)] }),
    ...[[56, 26, -120], [76, 42, 20], [84, 8, -60], [90, 26, -10]].map(([x, y, a]) => S(sharp([pol(x, y, 5, a - 90), pol(x, y, 12, a), pol(x, y, 5, a + 90)]), STEEL, 'steel', { line: 1 })),
  ]);
  icon('art_ogre_targ', [
    ...Array.from({ length: 10 }, (_, i) => S(sharp([pol(50, 50, 36, i * 36 - 10), pol(50, 50, 49, i * 36), pol(50, 50, 36, i * 36 + 10)]), STEEL, 'steel', { line: 1 })),
    E(50, 50, 40, 40, '#b88a58', 'leather', { lines: [Object.assign(dl(ell(50, 50, 30, 30, 16), 0.5, 1.6), { closed: true })] }),
    E(50, 50, 13, 13, '#c8ced6', 'steel', { glint: [[46, 46, 5]] }),
  ]);
  icon('art_cyclops_tunic', [
    S([P(30, 8, 1), [50, 16], P(70, 8, 1), [90, 20], P(96, 40, 1), [80, 46], [78, 92], [50, 96], [22, 92], [20, 46], P(4, 40, 1), [10, 20]], '#d8bc88', 'cloth',
      { lines: [dl([[36, 50], [34, 90]], 0.4, 1.6), dl([[64, 50], [66, 90]], 0.4, 1.6)], sub: [S(sharp([[0, 64], [100, 64], [100, 72], [0, 72]]), '#7a4a26', 'leather', { line: 1 })] }),
    S(ell(50, 40, 14, 9, 12), '#f6f0e0', 'gem', { line: 1.2, lc: '#8a6a20' }),
    E(50, 40, 6, 6, '#e0a020', 'gem', { line: 1, glint: [[48, 38, 2]] }),
  ]);
  icon('art_pendant_courage', [chain(56), E(50, 74, 20, 20, GOLD, 'gold', { gloss: 1.2 }), E(50, 74, 9, 9, '#e03040', 'gem', { line: 1, glint: [[47, 71, 3]] })]);
  icon('art_cape_velocity', [cape('#c8302a', '#f0d040')]);
  icon('art_boots_polarity', [boot({ c: '#8040b8', sole: '#2a1a3a' }), S(star(20, 20, 16, 5, 4), '#f0e0ff', 'gem', { line: 1 }), S(star(84, 30, 10, 3.5, 4), '#f0e0ff', 'gem', { line: 1 })]);
  icon('art_titan_gladius', [sword(14, 88, 90, 12, { bw: 17, blade: '#b4dcff', tip: 26, g0: 22 })]);
  icon('art_sentinel_shield', [heater(50, 50, 86, 96, { field: '#eef0f4', charge: [S(star(50, 44, 22, 10, 8), GOLD, 'gold', { line: 1 }), E(50, 44, 9, 9, '#f8e080', 'gold', { line: 1 })] })]);
  icon('art_helm_enlightenment', [helm({ c: '#f2f2f6', band: GOLD, crest: [S(star(50, 30, 30, 18, 12), '#ffe07a', 'flat', { line: 0.8 })] })]);
  icon('art_titan_cuirass', [cuirass('#3a64d0', GOLD, [S(star(50, 56, 12, 5, 8), GOLD, 'gold', { line: 1 })])]);
  icon('art_necklace_bliss', [chain(60), ...place(gem(50, 50, 18, '#8ae8f8'), 1, 0, 28)]);
  icon('art_angel_wings', [place(wingL(WHITE), 0.62, -18, 2), mirror(place(wingL(WHITE), 0.62, -18, 2))]);
  icon('art_drowned_compass', [
    E(50, 50, 46, 46, GOLD, 'gold', { gloss: 1.2 }),
    E(50, 50, 35, 35, '#e8eef4', 'cloth', { line: 1.2, lines: [dl([[50, 18], [50, 24]], 0.7, 2.4), dl([[82, 50], [76, 50]], 0.7, 2.4), dl([[50, 82], [50, 76]], 0.7, 2.4), dl([[18, 50], [24, 50]], 0.7, 2.4)] }),
    S(sharp([[44, 44], [76, 24], [56, 56]]), '#d02a24', 'gem', { line: 1 }),
    S(sharp([[44, 44], [24, 76], [56, 56]]), '#f4f4f4', 'steel', { line: 1 }),
    E(50, 50, 4, 4, GOLD, 'gold', { line: 0.8 }),
  ]);

  /* ======================= sp_*: заклинания — плашка цветом школы + символ ======================= */
  const SCHOOL = {
    air: { rim: '#7ed2ec', field: '#1e3a48' }, water: { rim: '#4a80e8', field: '#16223e' }, fire: { rim: '#f07a2c', field: '#3a1c12' },
    earth: { rim: '#b88a4c', field: '#2e2216' }, all: { rim: '#b070e0', field: '#2c1a3c' },
  };
  const SPELL_SCHOOL = { magic_arrow: 'all', haste: 'air', slow: 'earth', bless: 'water', curse: 'fire', shield: 'earth', stone_skin: 'earth', bloodlust: 'fire', cure: 'water', dispel: 'water',
    lightning_bolt: 'air', ice_bolt: 'water', death_ripple: 'earth', blind: 'fire', precision: 'air', weakness: 'water', disrupting_ray: 'air', fortune: 'air', fireball: 'fire', frost_ring: 'water',
    destroy_undead: 'air', animate_dead: 'earth', air_shield: 'air', meteor_shower: 'earth', chain_lightning: 'air', inferno: 'fire', resurrection: 'earth', prayer: 'water', town_portal: 'earth',
    armageddon: 'fire', implosion: 'earth', titans_bolt: 'air', berserk: 'fire' };
  /** Заклинание: плашка школы и символ (формы в квадрате 100×100, вписываются в окно плашки). */
  function spell(id, sym) {
    const sc = SCHOOL[SPELL_SCHOOL[id]];
    icon('sp_' + id, [
      S(rrect(1, 1, 99, 99, 14), sc.rim, 'gold', { gloss: 0.6 }),
      S(rrect(9, 9, 91, 91, 8), sc.field, 'cloth', { line: 1, hi: 1.6 }),
      place(sym.flat(), 0.8, 0, 0),
    ]);
  }
  spell('magic_arrow', [S(star(74, 26, 22, 8, 4, -45), '#f0d8ff', 'flat', { line: 0 }), arrow(14, 86, 80, 20, { shaft: '#d8b8ff', head: '#f4e8ff', fl: '#b070e0', hw: 12, sw: 7 })]);
  spell('haste', [boot({ c: '#8a5a2e' }), place(wingL(WHITE), 0.54, -28, -24)]);
  spell('slow', [
    S([P(8, 90, 1), [10, 76], [30, 72], [70, 72], [86, 58], [92, 40], [98, 44], [96, 66], [86, 84], P(70, 90, 1)], '#78b048', 'skin', { gloss: 0.5 }),
    S(tube([[88, 44, 4], [84, 22, 3]]), '#78b048', 'skin', { line: 1 }), S(tube([[94, 46, 4], [98, 26, 3]]), '#78b048', 'skin', { line: 1 }),
    E(48, 50, 34, 30, '#b07a3a', 'horn', { gloss: 0.8, lines: [dl([[48, 50], [56, 44], [60, 54], [48, 62], [36, 52], [42, 34], [62, 30], [74, 46], [70, 66]], 0.6, 2.2)] }),
  ]);
  spell('bless', [S(star(50, 50, 44, 11, 4), '#fff2a0', 'gold', { gloss: 1.3, line: 1.2 }), S(star(50, 50, 24, 8, 4, -45), '#ffe060', 'gold', { line: 1 }), S(star(82, 18, 12, 3, 4), '#fff8d0', 'flat', { line: 0 }), S(star(18, 80, 9, 3, 4), '#fff8d0', 'flat', { line: 0 })]);
  spell('curse', [skull(50, 48, 40, { c: '#b8b0a8', eye: '#b030e0', glow: true })]);
  spell('shield', [heater(50, 50, 80, 92, { field: '#9aa4b0', rim: '#d8dde4', rimM: 'steel', boss: '#f0d060' })]);
  spell('stone_skin', [palm('#9a9c98', 'horn', { lines: [dl([[32, 60], [44, 72], [40, 86]], 0.6, 2), dl([[58, 58], [64, 78]], 0.6, 2)] })]);
  spell('bloodlust', [S(dropPts(50, 58, 32), '#c01828', 'gem', { gloss: 1.3, glint: [[40, 50, 8]] })]);
  spell('cure', [E(50, 50, 44, 44, '#2e6a3a', 'flat', { line: 0 }), S(sharp([[38, 8], [62, 8], [62, 38], [92, 38], [92, 62], [62, 62], [62, 92], [38, 92], [38, 62], [8, 62], [8, 38], [38, 38]]), '#f8f6ee', 'cloth', { gloss: 0.5 })]);
  spell('dispel', [
    S(tube([[50, 50, 4], [60, 46, 6], [62, 34, 7], [50, 24, 8], [32, 30, 9], [24, 50, 10], [34, 72, 10], [58, 78, 9], [76, 64, 8], [82, 40, 7], [72, 18, 6], [56, 8, 4]]), '#c080f8', 'gem', { gloss: 1 }),
    S(star(86, 82, 12, 3, 4), '#f0d8ff', 'flat', { line: 0 }), S(star(14, 16, 10, 3, 4), '#f0d8ff', 'flat', { line: 0 }),
  ]);
  spell('lightning_bolt', [S(boltPts(), '#ffe040', 'gold', { gloss: 1.2 })]);
  spell('ice_bolt', [
    S([P(90, 10, 1), [62, 30], P(58, 26, 1), [44, 50], P(48, 54, 1), [26, 68], P(10, 90, 1), [32, 74], P(38, 80, 1), [52, 58], P(56, 62, 1), [70, 38]], '#a8e8ff', 'gem', { gloss: 1.4, lc: '#2a6a90', lines: [hl([[86, 14], [36, 64]], 0.8, 2)] }),
  ]);
  spell('death_ripple', [
    S(band(50, 50, 42, 42, 7, 0), '#6ac850', 'gem', { line: 1 }), S(band(50, 50, 30, 30, 6, 0), '#4aa040', 'gem', { line: 1 }),
    skull(50, 50, 18),
  ]);
  spell('blind', [
    S([P(6, 50, 1), [28, 28], [50, 22], [72, 28], P(94, 50, 1), [72, 72], [50, 78], [28, 72]], '#f4f0e8', 'cloth', { sub: [E(50, 50, 18, 18, '#3a70c0', 'gem', { line: 1 }), E(50, 50, 8, 8, '#101018', 'flat', { line: 0 })] }),
    S(sharp([[2, 30], [98, 44], [98, 66], [2, 52]]), '#8a2a24', 'cloth', { lines: [dl([[4, 42], [96, 56]], 0.4, 1.6)] }),
  ]);
  spell('precision', [
    E(46, 54, 40, 40, '#f4f0e8', 'cloth'), E(46, 54, 28, 28, '#d0342a', 'cloth', { line: 1 }), E(46, 54, 15, 15, '#f4f0e8', 'cloth', { line: 1 }), E(46, 54, 6, 6, '#d0342a', 'cloth', { line: 1 }),
    arrow(96, 4, 48, 52, { hw: 8, hlen: 16, sw: 5, fl: '#3a78e8' }),
  ]);
  spell('weakness', [
    ...sword(12, 90, 60, 40, { bw: 13, tip: 0.1 }),
    S(sharp([[64, 32], [78, 18], [90, 8], [84, 22], [70, 38], [66, 36]]), '#d0d6de', 'steel', { gloss: 1 }),
    S(sharp([[58, 34], [66, 30], [62, 40], [70, 40], [60, 46], [62, 38]]), '#fff2a0', 'flat', { line: 0 }),
  ]);
  spell('disrupting_ray', [
    S(sharp([[4, 14], [16, 4], [96, 84], [84, 96]]), '#d890ff', 'gem', { gloss: 1.2, lines: [hl([[10, 9], [90, 89]], 0.9, 3)] }),
    S(star(70, 70, 26, 9, 6), '#f4e0ff', 'flat', { line: 0.8 }),
  ]);
  spell('fortune', [clover(46, 38, 22, '#48c050'), S(star(82, 80, 12, 3.5, 4), '#fff8d0', 'flat', { line: 0 })]);
  spell('fireball', [
    S([[20, 90], [10, 70], [22, 76], [18, 56], [32, 66], [36, 46], [48, 58]], '#f08020', 'flat', { line: 1 }),
    E(60, 42, 32, 32, '#ff7a1c', 'gem', { gloss: 0.6, lc: '#8a2a10', sub: [E(66, 36, 20, 20, '#ffc040', 'flat', { line: 0 }), E(70, 32, 10, 10, '#fff4b0', 'flat', { line: 0 })] }),
  ]);
  spell('frost_ring', [
    S(band(50, 50, 34, 34, 16, 0), '#9adcff', 'gem', { gloss: 1.2, lc: '#2a6a90' }),
    ...[0, 60, 120, 180, 240, 300].map(a => S(sharp([pol(50, 50, 44, a - 8), pol(50, 50, 50, a), pol(50, 50, 44, a + 8), pol(50, 50, 38, a)]), '#e0f6ff', 'gem', { line: 1 })),
  ]);
  spell('destroy_undead', [S(star(50, 50, 48, 26, 12), '#ffe07a', 'flat', { line: 0.8 }), skull(50, 50, 30)]);
  spell('animate_dead', [S(sharp([[4, 86], [96, 86], [96, 100], [4, 100]]), '#5a4028', 'leather'), place(palm(BONE, 'horn'), 0.9, 0, -6)]);
  spell('air_shield', [
    heater(50, 50, 82, 92, { field: '#bdeefc', rim: '#e8fbff', rimM: 'gem', fieldM: 'gem' }),
    S(tube([[50, 50, 3], [58, 46, 5], [56, 36, 6], [42, 34, 7], [34, 48, 7], [44, 62, 6], [62, 62, 5]]), '#4ab0d8', 'flat', { line: 0 }),
  ]);
  spell('meteor_shower', [
    ...[[30, 30, 12], [72, 26, 10], [56, 70, 15]].flatMap(([x, y, r]) => [
      S(tube([[x - r * 2.6, y - r * 2.6, 3], [x - r * 0.4, y - r * 0.4, r * 1.6]]), '#f08020', 'flat', { line: 0 }),
      E(x, y, r, r, '#8a5a3a', 'horn', { lc: '#3a1a08', gloss: 0.3, sub: [E(x + r * 0.4, y + r * 0.4, r * 0.6, r * 0.6, '#ff8a2a', 'flat', { line: 0 })] })]),
  ]);
  spell('chain_lightning', [
    S(sharp([[40, 2], [58, 2], [48, 30], [70, 30], [52, 56], [74, 56], [40, 98], [50, 64], [30, 64], [44, 40], [24, 40]]), '#ffe040', 'gold', { gloss: 1.1 }),
    S(sharp([[70, 30], [96, 20], [78, 40]]), '#ffe040', 'gold', { line: 1.2 }), S(sharp([[30, 64], [4, 72], [24, 56]]), '#ffe040', 'gold', { line: 1.2 }),
  ]);
  spell('inferno', [flame(50, 96, 92, 94)]);
  spell('resurrection', [
    S(star(50, 44, 46, 26, 12), '#fff2b0', 'flat', { line: 0 }),
    S(band(50, 28, 16, 20, 10, 90), GOLD, 'gold', { gloss: 1.2 }),
    S(sharp([[44, 44], [56, 44], [56, 96], [44, 96]]), GOLD, 'gold'),
    S(sharp([[18, 50], [82, 50], [82, 62], [18, 62]]), GOLD, 'gold'),
  ]);
  spell('prayer', [
    S(star(50, 50, 48, 28, 12), '#fff2b0', 'flat', { line: 0 }),
    S([P(50, 8, 1), [44, 20], [34, 48], [28, 70], P(22, 92, 1), P(50, 92, 1)], SKIN, 'skin', { lines: [dl([[42, 30], [34, 56]], 0.4)] }),
    S([P(50, 8, 1), [56, 20], [66, 48], [72, 70], P(78, 92, 1), P(50, 92, 1)], tone(SKIN, -0.08), 'skin', { lines: [dl([[58, 30], [66, 56]], 0.4)] }),
    S(sharp([[18, 80], [82, 80], [82, 98], [18, 98]]), '#6a8ae0', 'cloth'),
  ]);
  spell('town_portal', [
    S(band(50, 50, 38, 44, 14, 90), '#b078f0', 'gem', { gloss: 1.2 }),
    E(50, 50, 31, 37, '#1a1030', 'flat', { line: 0.8, sub: [S(sharp([[40, 90], [40, 44], [36, 44], [36, 36], [44, 36], [44, 40], [48, 40], [48, 36], [52, 36], [52, 40], [56, 40], [56, 36], [64, 36], [64, 44], [60, 44], [60, 90]]), '#8a88a8', 'horn', { line: 0.8 })] }),
  ]);
  spell('armageddon', [
    S(sharp([[2, 74], [98, 74], [98, 100], [2, 100]]), '#6a1a10', 'cloth'),
    S(star(50, 58, 46, 22, 9), '#f06020', 'flat', { lc: '#6a1a08' }),
    S(star(50, 58, 28, 13, 9, -70), '#ffb030', 'flat', { line: 0 }),
    E(50, 58, 12, 12, '#fff0a0', 'flat', { line: 0 }),
  ]);
  spell('implosion', [
    ...[45, 135, 225, 315].map(a => S(sharp([pol(50, 50, 48, a - 7), pol(50, 50, 28, a - 7), pol(50, 50, 28, a - 16), pol(50, 50, 14, a), pol(50, 50, 28, a + 16), pol(50, 50, 28, a + 7), pol(50, 50, 48, a + 7)]), '#d8c8a8', 'steel', { gloss: 0.8 })),
    E(50, 50, 10, 10, '#1a0a20', 'flat', { line: 1.2, lc: '#c080ff' }),
  ]);
  spell('titans_bolt', [S(star(56, 50, 48, 30, 10), '#bfe8ff', 'flat', { line: 0 }), place([S(boltPts(), '#fff070', 'gold', { gloss: 1.4, lc: '#8a5a00' })], 1.02, 0, 0)]);
  spell('berserk', [
    S([P(14, 8, 1), [30, 24], [50, 18], [70, 24], P(86, 8, 1), [84, 34], [88, 56], [76, 82], [50, 94], [24, 82], [12, 56], [16, 34]], '#c82a24', 'skin', { gloss: 0.6 }),
    S(sharp([[24, 40], [44, 50], [42, 58], [26, 52]]), '#ffe040', 'gem', { line: 1 }), S(sharp([[76, 40], [56, 50], [58, 58], [74, 52]]), '#ffe040', 'gem', { line: 1 }),
    S(sharp([[30, 68], [70, 68], [64, 82], [36, 82]]), '#2a0a08', 'flat', { line: 1, sub: [S(sharp([[30, 66], [38, 74], [44, 66], [50, 74], [56, 66], [62, 74], [70, 66]]), '#f4f0e0', 'flat', { line: 0 })] }),
  ]);

  /* ======================= sk_*: вторичные навыки ======================= */
  icon('sk_air', [
    S(tube([[52, 50, 5], [60, 44, 7], [58, 32, 8], [44, 26, 9], [28, 36, 10], [24, 56, 10], [38, 74, 10], [62, 76, 9], [80, 60, 8], [84, 36, 7], [72, 16, 5]]), '#8ad8f0', 'gem', { gloss: 1 }),
    S(tube([[62, 88, 4], [92, 80, 3]]), '#cff2ff', 'flat', { line: 0 }), S(tube([[8, 22, 4], [30, 14, 3]]), '#cff2ff', 'flat', { line: 0 }),
  ]);
  icon('sk_archery', [
    S(tube([[28, 6, 6], [18, 30, 9], [16, 50, 10], [18, 70, 9], [28, 94, 6]]), WOOD, 'wood'),
    S(tube([[29, 8, 2], [29, 92, 2]]), '#f0e8d8', 'flat', { line: 0 }),
    arrow(12, 50, 96, 50, { hw: 10, hlen: 20 }),
  ]);
  icon('sk_armorer', [cuirass('#b8c0cc', null, [...[[28, 30], [72, 30], [50, 66]].map(([x, y]) => E(x, y, 4.5, 4.5, GOLD, 'gold', { line: 0.8 }))])]);
  icon('sk_artillery', [
    S(tube([[48, 56, 8], [22, 94, 7]]), WOOD, 'wood'), S(tube([[52, 56, 8], [80, 94, 7]]), WOOD, 'wood'),
    S(tube([[8, 48, 12], [92, 48, 10]]), '#8a5a2e', 'wood', { flow: 0 }),
    S(tube([[74, 8, 6], [82, 28, 8], [84, 48, 9], [82, 68, 8], [74, 88, 6]]), IRON, 'steel'),
    S(tube([[75, 10, 2], [30, 48, 2], [75, 86, 2]]), '#f0e8d8', 'flat', { line: 0 }),
    S(sharp([[30, 44], [96, 44], [100, 48], [96, 52], [30, 52]]), STEEL, 'steel', { line: 1 }),
  ]);
  icon('sk_ballistics', [
    S(sharp([[8, 70], [92, 70], [92, 80], [8, 80]]), '#8a5a2e', 'wood', { flow: 0 }),
    S(tube([[36, 72, 7], [48, 44, 7]]), WOOD, 'wood'), S(tube([[64, 72, 7], [48, 44, 7]]), WOOD, 'wood'),
    S(tube([[80, 70, 8], [22, 24, 7]]), '#a06a34', 'wood'),
    S([[8, 18], [30, 12], [32, 30], [14, 34]], '#6a4424', 'leather'),
    E(20, 14, 11, 11, '#8a8e96', 'horn', { gloss: 0.5 }),
    E(22, 84, 11, 11, '#4a3a2a', 'wood'), E(78, 84, 11, 11, '#4a3a2a', 'wood'),
  ]);
  icon('sk_diplomacy', [
    S(tube([[2, 74, 26], [36, 58, 24]]), '#3a6ad0', 'cloth'),
    S(tube([[98, 74, 26], [64, 58, 24]]), '#c8342a', 'cloth'),
    S([[28, 46], [48, 36], [64, 38], [78, 48], [74, 64], [58, 72], [40, 72], [28, 64]], SKIN, 'skin', { lines: [dl([[44, 48], [62, 50]], 0.5), dl([[44, 56], [64, 58]], 0.5), dl([[46, 64], [62, 66]], 0.5)] }),
    S(tube([[46, 40, 9], [60, 30, 8]]), SKIN, 'skin', { line: 1.2 }),
  ]);
  icon('sk_earth', [
    S(sharp([[4, 92], [38, 16], [54, 42], [66, 28], [96, 92]]), '#9a6a38', 'horn', { gloss: 0.4, lines: [hl([[38, 18], [30, 50]], 0.6, 2), hl([[66, 30], [62, 52]], 0.5, 2)],
      sub: [S(sharp([[0, 78], [100, 78], [100, 100], [0, 100]]), '#5a8a30', 'cloth', { line: 1 })] }),
    S(sharp([[30, 34], [38, 16], [46, 30], [40, 36]]), '#e8e0d0', 'flat', { line: 0 }),
  ]);
  icon('sk_estates', [
    S(sharp([[10, 44], [44, 12], [78, 44]]), '#b8342a', 'cloth'),
    S(sharp([[16, 42], [72, 42], [72, 84], [16, 84]]), '#d8c49a', 'cloth', { sub: [S([P(36, 90, 1), [36, 66], [44, 60], [52, 66], P(52, 90, 1)], '#5a3a20', 'wood', { line: 1 }), E(26, 56, 5, 5, '#3a70c0', 'gem', { line: 0.8 }), E(62, 56, 5, 5, '#3a70c0', 'gem', { line: 0.8 })] }),
    E(76, 74, 20, 20, GOLD, 'gold', { gloss: 1.3, lines: [Object.assign(dl(ell(76, 74, 13, 13, 14), 0.5, 1.6), { closed: true })] }),
  ]);
  icon('sk_fire', [flame(50, 96, 86, 94)]);
  icon('sk_first_aid', [
    S(tube([[36, 20, 6], [38, 8, 6], [62, 8, 6], [64, 20, 6]]), '#6a4a30', 'leather'),
    S(rrect(8, 18, 92, 92, 10), '#f4f0e6', 'cloth', { sub: [S(sharp([[42, 30], [58, 30], [58, 48], [76, 48], [76, 64], [58, 64], [58, 82], [42, 82], [42, 64], [24, 64], [24, 48], [42, 48]]), '#d0282a', 'cloth', { line: 1 })] }),
  ]);
  icon('sk_intelligence', [
    S([[12, 58], [10, 40], [20, 22], [38, 12], [58, 12], [78, 20], [90, 36], [90, 58], [80, 70], [62, 74], [56, 88], [46, 90], [42, 76], [24, 74]], '#f09ab8', 'skin',
      { gloss: 0.6, lines: [dl([[50, 14], [48, 30], [52, 46], [48, 70]], 0.6, 2), dl([[20, 36], [34, 34], [36, 48]], 0.5, 1.8), dl([[22, 58], [36, 60]], 0.5, 1.8), dl([[66, 26], [64, 40], [78, 44]], 0.5, 1.8), dl([[64, 58], [80, 58]], 0.5, 1.8)] }),
  ]);
  icon('sk_leadership', [
    S(tube([[24, 8, 7], [24, 96, 7]]), '#6a4424', 'wood'), E(24, 6, 6, 6, GOLD, 'gold'),
    S([P(27, 12, 1), P(88, 12, 1), P(88, 62, 1), P(72, 52, 1), P(58, 62, 1), P(27, 62, 1)], RED, 'cloth', { lines: [dl([[50, 14], [50, 58]], 0.3, 1.6)] }),
    S(star(56, 34, 14, 6, 5), GOLD, 'gold', { line: 1 }),
  ]);
  icon('sk_learning', [
    S(sharp([[8, 26], [64, 20], [70, 92], [14, 96]]), PARCH, 'cloth', { lines: [dl([[20, 40], [58, 36]], 0.55, 2.2), dl([[21, 52], [59, 48]], 0.55, 2.2), dl([[22, 64], [54, 61]], 0.55, 2.2), dl([[23, 76], [60, 73]], 0.55, 2.2)] }),
    S(K.leaf([54, 66], rad(-52), 44, 16).body, WHITE, 'cloth', { lines: [hl(K.leaf([54, 66], rad(-52), 44, 16).shaft, 0.5, 1.2)] }),
    S(tube([[58, 60, 4], [44, 82, 3]]), '#3a2a20', 'flat', { line: 0.8 }),
  ]);
  icon('sk_logistics', [
    boot({ c: '#6a4428', cuff: '#4a2c18' }),
    S(sharp([[14, 70], [30, 68], [30, 74], [14, 76]]), GOLD, 'gold', { line: 1 }),
    S(star(10, 72, 9, 3.5, 6), '#c8ced6', 'steel', { line: 1 }),
  ]);
  icon('sk_luck', [
    S(tube([[24, 86, 16], [16, 58, 18], [22, 30, 18], [50, 12, 18], [78, 30, 18], [84, 58, 18], [76, 86, 16]]), '#e8b83a', 'gold', { gloss: 1.2 }),
    ...[[20, 44], [28, 26], [72, 26], [80, 44], [20, 66], [80, 66]].map(([x, y]) => E(x, y, 2.6, 2.6, '#5a3a10', 'flat', { line: 0 })),
  ]);
  icon('sk_mysticism', [
    E(50, 50, 44, 44, '#9a3ad8', 'gem', { gloss: 1.2 }),
    S(sharp([[50, 14], [78, 46], [60, 46], [60, 82], [40, 82], [40, 46], [22, 46]]), '#fbf4ff', 'cloth', { line: 1.2 }),
  ]);
  icon('sk_necromancy', [S(band(50, 50, 44, 44, 8, 0), '#90e060', 'gem', { gloss: 1 }), skull(50, 50, 32, { eye: '#60e040', glow: true })]);
  icon('sk_offense', [sword(10, 92, 92, 10, { bw: 11 }), mirror(sword(10, 92, 92, 10, { bw: 11 }))]);
  icon('sk_pathfinding', [
    E(50, 50, 46, 46, '#c8ced6', 'steel', { gloss: 1.2 }),
    E(50, 50, 35, 35, '#f0ead8', 'cloth', { line: 1.2 }),
    S(sharp([[50, 16], [58, 50], [42, 50]]), '#d02a24', 'gem', { line: 1 }),
    S(sharp([[50, 84], [58, 50], [42, 50]]), '#3a3a44', 'steel', { line: 1 }),
    E(50, 50, 4, 4, GOLD, 'gold', { line: 0.8 }),
  ]);
  icon('sk_resistance', [heater(50, 50, 84, 94, { field: '#8a929e', rim: '#c8ced6', rimM: 'steel', charge: [
    S(tube([[50, 46, 4], [58, 40, 6], [54, 28, 7], [40, 28, 8], [32, 44, 8], [40, 60, 7], [60, 62, 6], [70, 48, 4]]), '#c070ff', 'gem', { line: 1 })] })]);
  icon('sk_scouting', [
    S(tube([[10, 90, 12], [34, 66, 12]]), '#6a4424', 'leather'),
    S(tube([[32, 68, 16], [58, 42, 16]]), '#c89a40', 'gold'),
    S(tube([[56, 44, 20], [86, 14, 22]], { flat1: true }), '#d8aa48', 'gold', { gloss: 1.2 }),
    S(ell(86, 14, 12, 5, 10, rad(-45)), '#a8e0ff', 'gem', { line: 1 }),
  ]);
  icon('sk_sorcery', [
    S(tube([[12, 92, 8], [60, 40, 7]]), '#3a2a50', 'wood'),
    S(star(70, 30, 28, 11, 5, -72), '#ffe060', 'gold', { gloss: 1.2 }),
    S(star(24, 20, 10, 3, 4), '#fff8d0', 'flat', { line: 0 }), S(star(88, 72, 9, 3, 4), '#fff8d0', 'flat', { line: 0 }),
  ]);
  icon('sk_tactics', [
    S(sharp([[6, 16], [94, 10], [90, 90], [10, 94]]), PARCH, 'cloth'),
    S(tube([[22, 76, 6], [30, 46, 6], [54, 30, 6], [70, 32, 6]]), '#c02a24', 'flat', { line: 0 }),
    S(sharp([[66, 20], [88, 34], [66, 44]]), '#c02a24', 'flat', { line: 0 }),
    E(24, 30, 8, 8, '#3a64d0', 'cloth', { line: 1 }), E(70, 72, 8, 8, '#3a64d0', 'cloth', { line: 1 }),
  ]);
  icon('sk_water', [
    S([[4, 84], [12, 58], [30, 34], [52, 24], [74, 28], [88, 40], [82, 52], [68, 44], [54, 46], [56, 60], [70, 64], [82, 58], [96, 64], [96, 84], [70, 92], [40, 92]], '#3a78e0', 'gem',
      { gloss: 1.2, lines: [hl([[14, 64], [30, 42], [52, 32], [72, 34]], 0.8, 2.4)] }),
  ]);
  icon('sk_wisdom', [
    S(sharp([[4, 30], [50, 36], [96, 30], [96, 86], [50, 94], [4, 86]]), '#8a2a24', 'leather'),
    S([P(8, 22, 1), [30, 18], P(50, 28, 1), P(50, 86, 1), [30, 78], P(8, 80, 1)], '#f4ecd4', 'cloth', { lines: [dl([[16, 34], [42, 38]], 0.5, 2), dl([[16, 46], [42, 50]], 0.5, 2), dl([[16, 58], [42, 62]], 0.5, 2)] }),
    S([P(92, 22, 1), [70, 18], P(50, 28, 1), P(50, 86, 1), [70, 78], P(92, 80, 1)], '#ece2c6', 'cloth', { lines: [dl([[58, 38], [84, 34]], 0.5, 2), dl([[58, 50], [84, 46]], 0.5, 2), dl([[58, 62], [84, 58]], 0.5, 2)] }),
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
