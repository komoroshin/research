/* ============================================================================
   view/vec_objects.js — природа на рисованном конвейере: деревья, горы, скалы,
   кристаллы (карта) и препятствия поля боя.
   Рамки — от старых спрайтов (K.frameOf), дизайн-единицы: 10 на клетку.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf } = K;

  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /** Описание-картинка: одна часть, рамка старого спрайта; build(fr, rnd) — формы в координатах рамки. */
  function obj(name, build, seed) {
    const fr = frameOf(name.split('#')[0]) || { w: 200, h: 300, anchor: [100, 296] };   // 'tree_1#autumn' — рамка своего дерева
    V.def(name, { w: fr.w, h: fr.h, anchor: fr.anchor, parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes: build(fr, rngOf(seed || name.length * 7919)) }] });
  }
  /** Крона из комьев листвы: задние темнее, передние светлее; листва — мелкие перья-чешуйки. */
  function crown(cx, cy, rx, ry, n, cols, rnd, o) {
    o = o || {}; const out = [];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (layer ? 0.55 : 0.8);
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr - (layer ? ry * 0.1 : 0);
      const r = (layer ? 0.38 : 0.42) * Math.min(rx, ry) * (0.8 + rnd() * 0.4);
      const c = layer ? cols[1 + ((rnd() * (cols.length - 1)) | 0)] : cols[0];
      out.push({ p: ell(x, y, r * 1.1, r, 9, rnd() * 0.6), c, m: 'feather', texSize: o.leaf || 0.55, flow: Math.PI * 0.5, line: layer ? 0.55 : 0.8, ao: 0.8 });
    }
    out.sort((a, b) => (a.c === cols[0] ? -1 : 0) - (b.c === cols[0] ? -1 : 0));
    return out;
  }
  const trunk = (x, y0, y1, w, c, bend) => [{ p: tube([[x - 1, y0 + 2, w * 1.6], [x, y0 - 12, w * 1.05], [x + (bend || 0) * 0.5, (y0 + y1) / 2, w * 0.9], [x + (bend || 0), y1, w * 0.7]], { flat1: true }), c, m: 'wood', flow: -Math.PI / 2, lines: [{ p: [[x - w * 0.2, y0 - 6], [x - w * 0.1, y1 + 10]], w: 1, a: 0.4 }] },
    { p: [[x - w * 1.6, y0 + 2], [x - w * 0.9, y0 - 6], [x, y0 - 4], [x + w * 0.9, y0 - 6], [x + w * 1.7, y0 + 2]], c: tone(c, -0.1), m: 'wood' }];

  /* ---------- лиственные ---------- */
  const LEAF = ['#2f5e24', '#4a8a32', '#5e9e3c', '#6fae44'];
  obj('tree_1', (f, r) => [...trunk(100, 283, 190, 16, '#6a4a2c', 2), ...crown(100, 140, 94, 92, 8, LEAF, r)], 11);
  obj('tree_2', (f, r) => [...trunk(120, 316, 190, 20, '#5e4228', -3),
    { p: tube([[118, 220, 8], [80, 180, 5], [60, 160, 3]]), c: '#5e4228', m: 'wood' }, { p: tube([[122, 210, 8], [160, 176, 5], [182, 162, 3]]), c: '#5e4228', m: 'wood' },
    ...crown(118, 150, 116, 104, 10, ['#2a5620', '#44802e', '#58943a', '#6aa640'], r)], 23);
  obj('tree_3', (f, r) => [...trunk(97, 266, 180, 13, '#6e4e30', 1), ...crown(97, 150, 86, 84, 7, ['#3a6a26', '#5a9a38', '#72b04a', '#86c056'], r)], 37);
  obj('tree_knowledge', (f, r) => {
    const out = [...trunk(137, 330, 200, 22, '#5a3e26', 0), ...crown(137, 138, 118, 104, 10, ['#2a5a2e', '#3e8a44', '#52a052', '#66b464'], r, { leaf: 0.6 })];
    for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.7; out.push({ e: [137 + Math.cos(a) * 110 * d, 138 + Math.sin(a) * 90 * d, 7, 7], c: '#ffd24a', m: 'gem', line: 0.5, glint: [[137 + Math.cos(a) * 110 * d - 2, 138 + Math.sin(a) * 90 * d - 2, 3]] }); }
    return out;
  }, 41);

  /* ---------- хвойные ---------- */
  function pine(cx, base, top, w, cols, snow) {
    const out = [...trunk(cx, base, base - 40, 10, '#5a3e26', 0)];
    const tiers = 4, H = base - 30 - top;
    for (let i = 0; i < tiers; i++) {
      const y1 = base - 30 - H * i / tiers * 0.95, y0 = y1 - H / tiers * 1.6, ww = w * (1 - i / tiers * 0.72);
      const edge = []; for (let k = 0; k <= 6; k++) { const t = k / 6; edge.push(P(cx + ww * (t * 2 - 1), y1 + (k % 2 ? -8 : 2), k % 2 ? 0 : 1)); }
      out.push({ p: [P(cx, y0, 1), ...edge.reverse()], c: cols[i % cols.length], m: 'fur', furLen: 0.8, flow: Math.PI * 0.5, dens: 0.8, belly: 0.35 });
      if (snow) out.push({ p: [P(cx, y0, 1), P(cx + ww * 0.55, y0 + (y1 - y0) * 0.55), P(cx + ww * 0.2, y0 + (y1 - y0) * 0.5), P(cx - ww * 0.15, y0 + (y1 - y0) * 0.62), P(cx - ww * 0.5, y0 + (y1 - y0) * 0.5)], c: '#f4f8fc', m: 'cloth', line: 0.6, lc: '#8aa0b8' });
    }
    return out;
  }
  obj('tree_pine', () => pine(97, 296, 18, 70, ['#1e4a2a', '#265a32', '#2e663a', '#367042']), 5);
  obj('tree_snow', () => pine(97, 296, 18, 70, ['#2a4a3a', '#30543e', '#365c44', '#3e664a'], true), 6);

  /* ---------- сухое, болотное, пальма ---------- */
  function deadTree(snow) {
    const c = '#6a5a4a', out = [...trunk(97, 256, 120, 12, c, 4)];
    const br = (pts, w) => { out.push({ p: tube(pts.map((p, i) => [p[0], p[1], w * (1 - i / pts.length * 0.7)])), c, m: 'wood', line: 0.8 }); if (snow) out.push(...snowRidge(pts, w)); };
    br([[100, 150], [72, 118], [54, 104], [40, 80]], 8); br([[72, 118], [66, 90]], 4); br([[101, 132], [128, 100], [146, 84], [156, 60]], 8); br([[128, 100], [148, 104]], 4); br([[100, 124], [98, 80], [106, 50]], 7);
    if (snow) out.push(snowDrift(97, 258, 34));
    return out;
  }
  obj('tree_dead', () => deadTree(false), 7);
  obj('tree_swamp', (f, r) => {
    const out = [...trunk(120, 303, 170, 18, '#4a4232', -4), ...crown(120, 130, 100, 70, 7, ['#2e4428', '#4a6034', '#5a6e3a', '#6a7a44'], r)];
    for (let i = 0; i < 9; i++) { const x = 40 + i * 20 + r() * 8; out.push({ p: tube([[x, 150 + r() * 20, 5], [x + 2, 200 + r() * 30, 3], [x - 1, 230 + r() * 30, 1.5]]), c: '#7a8a5a', m: 'fur', furLen: 0.5, line: 0.4 }); }
    return out;
  }, 8);
  obj('tree_palm', () => {
    const out = [];
    const T = [[100, 296, 16], [104, 250, 14], [114, 200, 12], [126, 150, 11], [132, 110, 10]];
    out.push({ p: tube(T), c: '#8a6a44', m: 'wood', lines: [40, 80, 120, 160].map(k => ({ p: [[100 + k * 0.2, 290 - k], [118 + k * 0.1, 292 - k]], w: 1.2, a: 0.5 })) });
    const fr = (ang, L, c) => { const lf = K.leaf([132, 106], ang, L, 26); out.push({ p: lf.body, c, m: 'leather', gloss: 0.4, line: 0.6, lines: [{ p: lf.shaft, w: 1, a: 0.5 }] }); };
    fr(Math.PI * 1.05, 90, '#3e7a2a'); fr(Math.PI * 1.35, 80, '#4a8a32'); fr(-Math.PI * 0.2, 88, '#3e7a2a'); fr(-Math.PI * 0.5, 64, '#56963a'); fr(Math.PI * 0.12, 84, '#4a8a32'); fr(Math.PI * 0.85, 78, '#56963a');
    for (let i = 0; i < 3; i++) out.push({ e: [124 + i * 9, 116 + (i % 2) * 6, 7, 7], c: '#6a4a24', m: 'wood', line: 0.6 });
    return out;
  });

  /* ---------- времена года: варианты деревьев ----------
     'имя#autumn' / '#autumn2' — золотая / багряная крона, '#bare' — облетевшее, '#winter' — голое
     под снегом (ель — в снегу), '#spring' — цветущее. Какой вариант где — решает H3.Season.tree
     (vec_seasons.js), запекает в куски карты MapPaint. Сид тот же, что у летнего дерева, —
     комья кроны лежат на тех же местах, меняется только цвет: смена сезона не «переставляет» лес. */
  /** Снежный валик по верху ветки: та же осевая линия, чуть выше и тоньше; на отвесном сучке снег не держится. */
  function snowRidge(pts, w) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      if (Math.abs(y1 - y0) > Math.abs(x1 - x0) * 2.4) continue;
      const t0 = w * (1 - i / pts.length * 0.7), t1 = w * (1 - (i + 1) / pts.length * 0.7);
      out.push({ p: tube([[x0, y0 - t0 * 0.5, t0 * 0.8], [x1, y1 - t1 * 0.5, t1 * 0.7]]), c: '#f6f9fc', m: 'flat', line: 0.5, lc: '#9ab0c6' });
    }
    return out;
  }
  /** Сугроб у комля. */
  function snowDrift(x, y, r) { return { p: [P(x - r, y + 3, 1), [x - r * 0.55, y - 7], [x - r * 0.1, y - 11], [x + r * 0.5, y - 8], P(x + r, y + 3, 1), [x, y + 7]], c: '#f4f8fc', m: 'cloth', line: 0.6, lc: '#8aa0b8' }; }
  /**
   * Голое лиственное дерево в рамке своей летней кроны: сучья веером до края кроны, на них — ветки.
   * Сзади — полупрозрачная «дымка» мелких веток по силуэту кроны: издали голое дерево читается
   * именно ею, иначе на карте (20×30 точек) остаются одни палки.
   */
  function bareTree(tr, cr, rnd, o) {
    o = o || {};
    const [x, y0, y1, w, c, bend] = tr, [cx, cy, rx, ry] = cr, out = [];
    out.push({ p: ell(cx, cy + ry * 0.08, rx * 0.8, ry * 0.76, 14), c: o.haze || 'rgba(92,66,52,0.30)', m: 'flat', line: 0 });
    out.push(...trunk(x, y0, y1, w, c, bend));
    const sx0 = x + (bend || 0), sy0 = y1 + 12, n = 5;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.6 + (rnd() - 0.5) * 0.18;
      const sx = sx0 + (i - 2) * w * 0.12, sy = sy0 + Math.abs(i - 2) * 9;
      const ex = cx + Math.cos(a) * rx * 0.86, ey = cy + Math.sin(a) * ry * 0.86;
      const mx = (sx + ex) / 2 + (rnd() - 0.5) * 14, my = (sy + ey) / 2 + 5;
      out.push({ p: tube([[sx, sy, w * 0.8], [mx, my, w * 0.48], [ex, ey, w * 0.2]]), c, m: 'wood', line: 0.7 });
      if (o.snow) out.push(...snowRidge([[sx, sy], [mx, my], [ex, ey]], w * 0.62));
      // ветки: от середины сучка и ближе к концу, в обе стороны
      for (const [bx, by, k] of [[mx, my, 0.42], [(mx + ex) / 2, (my + ey) / 2, 0.28]]) for (const s of [-1, 1]) {
        if (rnd() < 0.2) continue;
        const L = Math.hypot(ex - sx, ey - sy), ta = a + s * (0.55 + rnd() * 0.35), tl = L * k * (0.6 + rnd() * 0.4);
        const tx = bx + Math.cos(ta) * tl, ty = by + Math.sin(ta) * tl;
        out.push({ p: tube([[bx, by, w * 0.3], [tx, ty, w * 0.1]]), c, m: 'wood', line: 0.5 });
        if (o.snow && Math.abs(ty - by) < Math.abs(tx - bx) * 2.4) out.push({ p: tube([[bx, by - w * 0.14, w * 0.26], [tx, ty - w * 0.06, w * 0.12]]), c: '#f6f9fc', m: 'flat', line: 0.4, lc: '#9ab0c6' });
        if (o.left) for (let j = 0; j < 2; j++) if (rnd() < 0.6) out.push({ e: [tx + (rnd() - 0.5) * 14, ty + (rnd() - 0.5) * 10, 6, 4.5], c: o.left[(rnd() * o.left.length) | 0], m: 'leather', line: 0.4 });
      }
    }
    if (o.snow) out.push(snowDrift(x, y0, w * 2.6));
    return out;
  }
  const AUTUMN = [['#7a4a18', '#d88a24', '#ecbc3c', '#c8642a'], ['#6a2814', '#c8482a', '#e2802e', '#b8341e']];   // золото, багрянец
  const SPRING = ['#4e8a34', '#f4bcd0', '#fde8ef', '#8ac654'];                                               // сад в цвету
  const LEAFT = {
    tree_1: { tr: [100, 283, 190, 16, '#6a4a2c', 2], cr: [100, 140, 94, 92, 8], seed: 11 },
    tree_2: { tr: [120, 316, 190, 20, '#5e4228', -3], cr: [118, 150, 116, 104, 10], seed: 23,
      forks: [{ p: tube([[118, 220, 8], [80, 180, 5], [60, 160, 3]]), c: '#5e4228', m: 'wood' }, { p: tube([[122, 210, 8], [160, 176, 5], [182, 162, 3]]), c: '#5e4228', m: 'wood' }] },
    tree_3: { tr: [97, 266, 180, 13, '#6e4e30', 1], cr: [97, 150, 86, 84, 7], seed: 37 },
  };
  for (const n in LEAFT) {
    const T = LEAFT[n], [cx, cy, rx, ry, k] = T.cr;
    const leafy = cols => (f, r) => [...trunk(...T.tr), ...(T.forks || []), ...crown(cx, cy, rx, ry, k, cols, r)];
    obj(n + '#autumn', leafy(AUTUMN[0]), T.seed);
    obj(n + '#autumn2', leafy(AUTUMN[1]), T.seed);
    obj(n + '#spring', (f, r) => {   // цветущий сад: розово-белые комья и россыпь лепестков по всей кроне
      const out = leafy(SPRING)(f, r);
      for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.85; out.push({ e: [cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, 7, 6], c: r() < 0.5 ? '#ffffff' : '#f8d4e0', m: 'cloth', line: 0.4 }); }
      return out;
    }, T.seed);
    obj(n + '#late', (f, r) => bareTree(T.tr, T.cr, r, { left: ['#b8642a', '#d89a34'] }), T.seed);
    obj(n + '#bare', (f, r) => bareTree(T.tr, T.cr, r), T.seed);
    obj(n + '#bud', (f, r) => bareTree(T.tr, T.cr, r, { left: ['#9ad466', '#b8e27a', '#7cc04a'], haze: 'rgba(120,150,80,0.32)' }), T.seed);
    obj(n + '#winter', (f, r) => bareTree(T.tr, T.cr, r, { snow: true, haze: 'rgba(92,66,52,0.2)' }), T.seed);
  }
  // болотное: осенью бурое, зимой голое с бородами мха и снегом
  function swampTree(r, o) {
    const out = o.bare ? bareTree([120, 303, 170, 18, '#4a4232', -4], [120, 130, 100, 70], r, o) : [...trunk(120, 303, 170, 18, '#4a4232', -4), ...crown(120, 130, 100, 70, 7, o.cols, r)];
    for (let i = 0; i < 9; i++) { const x = 40 + i * 20 + r() * 8; out.push({ p: tube([[x, 150 + r() * 20, 5], [x + 2, 200 + r() * 30, 3], [x - 1, 230 + r() * 30, 1.5]]), c: o.moss, m: 'fur', furLen: 0.5, line: 0.4 }); }
    return out;
  }
  obj('tree_swamp#autumn', (f, r) => swampTree(r, { cols: ['#4a3a1c', '#7a6a2a', '#9a7a34', '#8a5a26'], moss: '#8a8a5a' }), 8);
  obj('tree_swamp#autumn2', (f, r) => swampTree(r, { cols: ['#4a2e1a', '#7a4a24', '#94642e', '#6a5a28'], moss: '#8a845a' }), 8);
  obj('tree_swamp#bare', (f, r) => swampTree(r, { bare: true, moss: '#8a8a6a', haze: 'rgba(80,74,56,0.3)' }), 8);
  obj('tree_swamp#late', (f, r) => swampTree(r, { bare: true, moss: '#8a8a5a', haze: 'rgba(80,74,56,0.3)', left: ['#8a6a2a', '#a07a34'] }), 8);
  obj('tree_swamp#winter', (f, r) => swampTree(r, { bare: true, snow: true, moss: '#9aa09a', haze: 'rgba(80,74,56,0.2)' }), 8);
  // хвойные зимой в снегу, сухое — со снегом на сучьях
  obj('tree_pine#winter', () => [...pine(97, 296, 18, 70, ['#1e4a2a', '#265a32', '#2e663a', '#367042'], true), snowDrift(97, 296, 34)], 5);
  obj('tree_dead#winter', () => deadTree(true), 7);

  /* ---------- горы ---------- */
  function mountain(pk, cols, o) {
    o = o || {}; const out = [];
    // массив: общий силуэт, затем грани — освещённые слева, в тени справа
    out.push({ p: [P(6, 310, 1), [40, 240], ...pk.map(p => [p[0], p[1]]), [300, 236], P(336, 310, 1)], c: cols[1], m: 'horn', gloss: 0.1, belly: 0.3 });
    for (const [x, y] of pk) {
      out.push({ p: [P(x, y, 1), [x - 40, y + 70], P(x - 80, 310, 1), [x - 10, 300], [x - 4, y + 90]], c: cols[2], m: 'horn', gloss: 0.1, line: 0.4, ao: 0.5 });
      out.push({ p: [P(x, y, 1), [x + 8, y + 90], [x + 14, 300], P(x + 90, 310, 1), [x + 46, y + 80]], c: cols[0], m: 'horn', gloss: 0, line: 0.4, ao: 0.6 });
      if (o.snow && y < 120) out.push({ p: [P(x, y, 1), P(x - 26, y + 34), P(x - 12, y + 30), P(x - 4, y + 42), P(x + 8, y + 32), P(x + 24, y + 38)], c: '#f4f8fc', m: 'cloth', line: 0.6, lc: '#8aa0b8' });
      if (o.lava) out.push({ p: tube([[x - 2, y + 8, 5], [x - 10, y + 60, 7], [x - 4, y + 120, 6], [x - 16, y + 180, 5]]), c: '#ff7a24', m: 'gem', gloss: 1, line: 0, lines: [{ p: [[x - 2, y + 12], [x - 9, y + 60], [x - 4, y + 118]], w: 2, c: '#ffe08a', a: 0.9 }] });
    }
    out.push({ p: [P(20, 310, 1), [120, 290], [220, 294], P(320, 310, 1)], c: tone(cols[0], -0.1), m: 'horn', line: 0, ao: 0 });
    if (o.lava) out.push({ e: [pk[0][0], pk[0][1] + 2, 18, 7], c: '#ffb04a', m: 'gem', line: 0.5 });
    return out;
  }
  obj('mountain_1', () => mountain([[130, 50], [220, 96]], ['#5a5a66', '#7a7a86', '#a4a4ae'], { snow: true }));
  obj('mountain_2', () => mountain([[96, 90], [196, 40], [270, 120]], ['#6a5e50', '#8a7c6a', '#b0a28a'], { snow: true }));
  obj('mountain_lava', () => mountain([[170, 60]], ['#2a1e1c', '#3e2c28', '#5a4038'], { lava: true }));

  /* ---------- камни и кристаллы ---------- */
  const boulder = (cx, cy, rx, ry, c, a) => ({ p: ell(cx, cy, rx, ry, 8, a || 0).map((p, i) => [p[0] + (i % 3 - 1) * rx * 0.08, p[1] + (i % 2) * ry * 0.06]), c, m: 'horn', gloss: 0.2, lines: [{ p: [[cx - rx * 0.3, cy - ry * 0.4], [cx, cy + ry * 0.1], [cx + rx * 0.2, cy + ry * 0.5]], w: 1, a: 0.35 }] });
  obj('rock_1', () => [boulder(74, 70, 60, 36, '#8a8478'), boulder(40, 90, 26, 16, '#7a7468')]);
  obj('rock_2', () => [boulder(90, 64, 56, 32, '#8a8070'), boulder(118, 86, 30, 16, '#9a9080'), boulder(46, 84, 22, 13, '#7a7060')]);
  function crystals(cx, base, cols, n, H) {
    const out = [boulder(cx, base - 12, 60, 18, '#4a4250')];
    for (let i = 0; i < n; i++) {
      const x = cx - 50 + i * (100 / (n - 1)), h = H * (0.5 + (i % 3) * 0.25 + (i === (n >> 1) ? 0.35 : 0)), w = 12 + (i % 2) * 5, lean = (i - n / 2) * 0.12;
      out.push({ p: [P(x - w, base - 8, 1), P(x - w * 0.8 + lean * h, base - h * 0.85, 1), P(x + lean * h, base - h, 1), P(x + w * 0.8 + lean * h, base - h * 0.85, 1), P(x + w, base - 8, 1)], c: cols[i % cols.length], m: 'gem', gloss: 1.1, rim: 0.6,
        lines: [{ p: [[x, base - 10], [x + lean * h, base - h + 4]], w: 1.2, light: true, a: 0.7 }] });
    }
    return out;
  }
  obj('crystal_rock', () => crystals(86, 156, ['#9a6ad8', '#b88af0', '#7a4ac0'], 5, 110));

  /* ---------- препятствия поля боя ---------- */
  obj('obst_rock', () => [boulder(150, 160, 90, 52, '#8a8478', -0.1), boulder(80, 190, 50, 28, '#7a7468'), boulder(210, 196, 44, 22, '#9a9488')]);
  obj('obst_stump', () => [
    { p: tube([[140, 178, 70], [140, 120, 60]], { flat0: true, flat1: true }), c: '#6a4a2c', m: 'wood', flow: -Math.PI / 2 },
    { e: [140, 120, 30, 11], c: '#c8a070', m: 'wood', line: 0.8, lines: [{ p: ell(140, 120, 18, 6, 10).concat([[122, 120]]), w: 1, a: 0.5 }, { p: ell(140, 120, 8, 3, 8).concat([[132, 120]]), w: 1, a: 0.5 }] },
    ...[[80, 176, -1], [200, 176, 1]].map(([x, y, s]) => ({ p: tube([[140 + s * 20, y - 6, 16], [x, y, 10], [x + s * 20, y + 4, 5]]), c: '#5e4228', m: 'wood' })),
  ]);
  obj('obst_bush', (f, r) => crown(140, 150, 110, 56, 7, ['#2a5620', '#44802e', '#5a963a', '#6aa644'], r));
  obj('obst_bones', () => [
    ...[0, 1, 2, 3].map(i => ({ p: tube([[70 + i * 22, 190, 7], [80 + i * 22, 150, 6], [96 + i * 22, 136, 5]]), c: '#e8e0c8', m: 'horn', line: 0.7 })),
    { p: tube([[56, 192, 10], [200, 188, 9]]), c: '#ded6be', m: 'horn', line: 0.7 },
    { p: [[190, 170], [200, 140], [226, 130], [250, 144], [252, 172], [236, 190], [206, 190]], c: '#efe8d4', m: 'horn', lines: [{ p: [[214, 154], [222, 154]], w: 5, c: '#2a2218', a: 1 }, { p: [[234, 152], [240, 152]], w: 5, c: '#2a2218', a: 1 }, { p: [[226, 178], [238, 178]], w: 2, c: '#2a2218', a: 0.8 }] },
  ]);
  obj('obst_lava', () => [
    { p: ell(137, 100, 128, 30, 12), c: '#2a1c1a', m: 'horn', line: 0.8 },
    { p: ell(137, 98, 110, 22, 12), c: '#ff6a1a', m: 'gem', gloss: 1.1, rim: 0.8, line: 0, sub: [{ p: ell(130, 96, 70, 10, 10), c: '#ffd070', m: 'flat', line: 0 }] },
  ]);
  obj('obst_ice', () => crystals(140, 206, ['#bfe6f5', '#e6f6fc', '#9ad0ea'], 5, 150));
})(typeof window !== 'undefined' ? window : globalThis);
