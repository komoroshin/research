/* ============================================================================
   view/vec_siege.js — осада: стены и город фракции за ними.

   У каждой из 13 фракций свои стены, башни, ворота и ров:
     wall_ok@<ф>, wall_dmg@<ф>, wall_broken@<ф>  — участок стены: целый, повреждённый, развалины;
     gate@<ф>, gate_broken@<ф>                   — ворота целые и выбитые;
     siege_tower@<ф>                              — стрелковая башня защитников;
     moat@<ф>                                     — ров (вода, лава, болото, мёд…) по форме гекса.
   Рамки — от общих спрайтов (K.frameOf('wall_ok') и т. д.), поэтому рисунок встаёт на то же
   место в гексе, что и общий. Дизайн-единицы: 10 на клетку пиксельного спрайта; в бою на
   телефоне одна единица ≈ 0,15 точки экрана — детали крупные, силуэт и цвет важнее мелочей.

   Помощники архитектуры (башня, конус, луковица, арка, окно, череп, кристалл…) — из
   vec_towns.js (H3.VTownKit): стены в том же стиле, что города на карте и экран города.
   Рисунки описываются по требованию (SiegeView.name → ensure) — в бою нужна одна фракция,
   91 описание сразу замедлило бы старт на телефоне; в node (тесты) — все сразу.

   Город за стенами: SiegeView.paintTown рисует город фракции (town_<ф> из vec_towns.js)
   на заднике поля боя, на горизонте за линией стен, с дымкой и светом дня.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf } = K;

  const FACTIONS = ['castle', 'rampart', 'tower', 'inferno', 'necropolis', 'dungeon', 'stronghold', 'fortress', 'conflux', 'cove', 'factory', 'hive', 'bastion'];
  const PARTS = ['wall_ok', 'wall_dmg', 'wall_broken', 'gate', 'gate_broken', 'siege_tower', 'moat'];
  const GOLD = '#d8a53a', IRON = '#46464e', HOLE = '#1a1410';
  let T = null;              // набор архитектуры vec_towns.js
  const done = {};           // фракция → описаны ли её рисунки

  /* ---------- общие помощники ---------- */
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const sh = (p, c, m, o) => Object.assign({ p, c, m: m || 'cloth' }, o);
  const el = (cx, cy, rx, ry, c, m, o) => Object.assign({ e: [cx, cy, rx, ry], c, m: m || 'cloth' }, o);
  const box = (x0, y0, x1, y1) => [P(x0, y0, 1), P(x1, y0, 1), P(x1, y1, 1), P(x0, y1, 1)];
  const ln = (p, w, a, o) => Object.assign({ p, w: w || 2, a: a || 0.5 }, o);

  /** Кладка крупно: ряды rh, камни bw, вразбежку; толстые швы — иначе на телефоне их не видно. */
  function masonry(x0, y0, x1, y1, rh, bw, a, w) {
    const out = []; a = a || 0.45; w = w || 3.2;
    for (let y = y0 + rh; y < y1 - 4; y += rh) { out.push(ln([[x0, y], [x1, y]], w, a)); out.push(ln([[x0, y + w * 0.9], [x1, y + w * 0.9]], w * 0.6, a * 0.55, { light: true })); }
    let row = 0;
    for (let y = y0; y < y1 - 4; y += rh, row++) for (let x = x0 + (row % 2 ? bw / 2 : bw); x < x1 - 4; x += bw) out.push(ln([[x, y + 1], [x, Math.min(y1, y + rh) - 1]], w * 0.85, a * 0.85));
    return out;
  }
  /** Неровная глыба: камень развалин, кусок воска, обломок кристалла. Низ приплюснут — лежит. */
  function chunk(cx, cy, rx, ry, c, rnd, o) {
    o = o || {}; const n = 7, pts = [];
    for (let i = 0; i < n; i++) { const a = (i + rnd() * 0.5) / n * Math.PI * 2, r = 0.78 + rnd() * 0.3; pts.push(P(cx + Math.cos(a) * rx * r, Math.min(cy + ry * 0.55, cy + Math.sin(a) * ry * r), rnd() < 0.6 ? 1 : 0)); }
    return sh(pts, c, o.m || 'horn', { gloss: o.gloss === undefined ? 0.2 : o.gloss, line: 1, lc: o.lc, lines: o.lines });
  }
  /** Пролом: рваная дыра с тёмной глубиной и светлой кромкой по верхнему краю. */
  function breach(cx, cy, rx, ry, c, rnd, o) {
    o = o || {}; const n = 11, pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = 0.7 + rnd() * 0.45; pts.push(P(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, 1)); }
    return sh(pts, c, 'horn', { gloss: 0, lo: 1.6, ao: 1.6, line: 1.1, lc: o.lc, lines: [ln([[cx - rx * 0.9, cy - ry * 0.2], [cx - rx * 0.3, cy - ry * 0.85], [cx + rx * 0.5, cy - ry * 0.7]], 3, 0.35, { light: true })] });
  }
  /** Трещина ломаной линией: тонкая тёмная полоса. */
  const crack = (pts, c, w) => sh(tube(pts.map(p => [p[0], p[1], w || 2.6])), c, 'flat', { line: 0 });
  /** Бойница: узкий проём, крестом или щелью, с цветом глубины. */
  function slit(cx, cy, h, c, o) {
    o = o || {}; const w = o.w || 7, out = [sh(box(cx - w, cy - h / 2, cx + w, cy + h / 2), c, o.glow ? 'gem' : 'cloth', { line: 1.2, ao: 1.2, gloss: o.glow ? 0.6 : 0, rim: 0 })];
    if (o.cross) out.push(sh(box(cx - w * 2.6, cy - w * 0.9, cx + w * 2.6, cy + w * 0.9), c, o.glow ? 'gem' : 'cloth', { line: 1.2, ao: 1.2, gloss: o.glow ? 0.6 : 0, rim: 0 }));
    return out;
  }
  /** Зубцы вдоль верха: n штук от x0 до x1, основание y, высота mh; kind задаёт форму, gap — выбитые. */
  function crenels(x0, x1, y, mh, n, kind, c, o) {
    o = o || {}; const out = [], st = (x1 - x0) / (n * 2 - 1), rnd = rngOf(o.seed || 11);
    for (let i = 0; i < n; i++) {
      if (o.gap && o.gap.includes(i)) continue;
      const a = x0 + i * st * 2, b = a + st, m = (a + b) / 2, t = y - mh;
      let p;
      if (kind === 'leaf') p = [P(a, y + 4, 1), P(a, t + st * 0.55, 1), [a + st * 0.12, t + st * 0.2], P(m, t - st * 0.35, 1), [b - st * 0.12, t + st * 0.2], P(b, t + st * 0.55, 1), P(b, y + 4, 1)];
      else if (kind === 'spike') p = [P(a - st * 0.3, y + 4, 1), [a + st * 0.1, t + mh * 0.4], P(m + (i % 2 ? 4 : -4), t - mh * 0.55, 1), [b - st * 0.1, t + mh * 0.4], P(b + st * 0.3, y + 4, 1)];
      else if (kind === 'fang') p = [P(a - 2, y + 4, 1), [a + st * 0.05, t + mh * 0.45], [a + st * 0.3, t + mh * 0.05], P(m + st * 0.2, t - mh * 0.5, 1), [b - st * 0.18, t + mh * 0.2], [b, t + mh * 0.6], P(b + 2, y + 4, 1)];
      else p = box(a, t, b, y + 4);
      const lines = kind === 'spike' || kind === 'fang' ? [ln([[a + st * 0.25, y], [m, t - mh * 0.3]], 2.4, 0.5, { light: true })] : [ln([[a + 2, t + 3], [b - 2, t + 3]], 2.4, 0.55, { light: true })];
      out.push(sh(p, kind === 'spike' || kind === 'fang' ? (o.tipC || c) : c, o.m || 'horn', { gloss: o.gloss === undefined ? 0.25 : o.gloss, line: 1.1, lines }));
      if (o.snow && kind !== 'spike') out.push(T.snowcap(m, t + 2, st * 0.62, 0.9));
      if (o.crystal) out.push(T.crystal(m, t + 2, st * 0.28, mh * 0.9 + rnd() * 16, o.crystal[i % o.crystal.length], (rnd() - 0.5) * 0.2));
    }
    return out;
  }

  /* ====================================================================== рамки
     Стена: 313×453, основание y=450. Развалины: 313×180, основание 177. Башня: 300×550, 530.
     Ров: 307×160, основание 157; гекс рва в единицах рисунка — центр (153, 75), полуширина 143,
     радиус 165 (ров рисуется в бою масштабом 0.85 от гекса). */
  const X0 = 26, X1 = 287, CX = 157, TOP = 92, G = 446;
  const RB = 174;                         // земля у развалин
  const TX = 150, TG = 526;               // башня
  const MX = 153, MY = 75, MW = 143, MR = 165;

  /* ====================================================================== палитры фракций
     kind — чем сложена стена: stone (кладка), rock (скала), pal (частокол), logs (сруб на сваях),
     wax (воск и хитин). top — верх: merlon, leaf, spike, fang, crystal, plate, rock, wax. */
  const S = {
    castle:     { kind: 'stone', wall: '#e2ded4', cap: '#ece8de', hole: '#3a3430', top: 'merlon', rh: 46, bw: 78, pointed: false, ring: '#d0ccc2', door: 'wood', doorC: '#7a4a26', emblem: 'shield',
                  moat: { c: '#3a78b0', deep: '#24507e', bank: '#7a6a50', stakes: '#6a4424' } },
    rampart:    { kind: 'stone', wall: '#dcd4b6', cap: '#e8e0c4', hole: '#34402a', top: 'leaf', rh: 44, bw: 70, pointed: true, ring: '#e6d8a8', door: 'wood', doorC: '#8a5a30', band: GOLD, emblem: 'leaf',
                  moat: { c: '#3a90a0', deep: '#246470', bank: '#5a7a3a', lily: 1, reeds: '#6a9a3a' } },
    tower:      { kind: 'stone', wall: '#e8eef4', cap: '#f2f6fa', hole: '#2a3a52', top: 'merlon', snow: 1, rh: 46, bw: 80, pointed: false, ring: '#d8e2ec', door: 'grate', doorC: '#5a6a84', grateC: '#4a5a74', holeC: '#1a2436', slitC: '#bfe2ff', emblem: 'star',
                  moat: { c: '#6aa4cc', deep: '#3a6c98', bank: '#c8d8e6', ice: '#eef6ff' } },
    inferno:    { kind: 'stone', wall: '#46332f', cap: '#382a28', hole: '#140806', top: 'spike', tipC: '#2a1e1c', rh: 44, bw: 70, pointed: true, ring: '#2a1e1c', door: 'grate', holeC: '#ff6a1a', grateC: '#1a0e0c', glowHole: 1, slitC: '#ff9a3a', magma: 1, emblem: 'horns',
                  moat: { lava: 1, c: '#f06a1a', deep: '#b8300c', bank: '#2a1a16', crust: '#3a2420' } },
    necropolis: { kind: 'stone', wall: '#5c5a6a', cap: '#4a4756', hole: '#16121c', top: 'fang', tipC: '#484554', rh: 44, bw: 72, pointed: true, ring: '#423f50', door: 'grate', holeC: '#2a1a3a', grateC: '#2a2832', slitC: '#b67ae8', emblem: 'skull',
                  moat: { c: '#2e3e3a', deep: '#1a2624', bank: '#3a3830', mist: '#cfe6dc', bones: 1 } },
    dungeon:    { kind: 'rock', wall: '#564a5e', cap: '#4a4052', hole: '#120e16', top: 'rock', rh: 0, pointed: true, ring: '#3a3442', door: 'maw', doorC: '#3e2e46', holeC: '#0e0a12', slitC: '#e090ff', crystals: ['#9a5ae0', '#c890f8', '#b070f0'], emblem: 'none',
                  moat: { c: '#2c2640', deep: '#18142a', bank: '#3a3442', shards: ['#b070f0', '#c890f8'] } },
    stronghold: { kind: 'pal', wood: '#7e5432', woodD: '#5a3a1c', clay: '#b67a4a', band: '#4a3420', hole: '#1e140c', pointed: false, door: 'logs', doorC: '#6a4424', emblem: 'bull',
                  moat: { c: '#6a5a36', deep: '#4a3e22', bank: '#8a6a40', stakes: '#5a3a1c' } },
    fortress:   { kind: 'logs', wood: '#7a5a34', pile: '#4a3a24', thatch: '#b8a060', moss: '#5a8a3a', hole: '#1a1610', door: 'logs', doorC: '#6a4a28', emblem: 'lizard',
                  moat: { c: '#3e6446', deep: '#2a4632', bank: '#4a5a30', lily: 1, reeds: '#7aa040', bubbles: 1 } },
    conflux:    { kind: 'stone', wall: '#eef0f6', cap: '#f6f8fc', hole: '#2a2a44', top: 'crystal', crystal: ['#ff8a3a', '#5ab0ff', '#9ae8f8', '#8ad060'], rh: 48, bw: 84, pointed: true, ring: '#e0e4ee', band: GOLD, door: 'crystal', doorC: '#7fd9ea', emblem: 'gem',
                  moat: { c: '#48c4e4', deep: '#2080b0', bank: '#e0e4ee', sparkle: 1 } },
    cove:       { kind: 'stone', wall: '#d8bc88', cap: '#e4cc9c', hole: '#2a2016', top: 'merlon', rh: 44, bw: 76, pointed: false, ring: '#c8a874', band: '#2a8a8a', door: 'wood', doorC: '#6a4426', cannon: 1, emblem: 'anchor',
                  moat: { c: '#2a86a4', deep: '#16587a', bank: '#d8c490', foam: 1 } },
    factory:    { kind: 'stone', wall: '#a8483a', cap: '#7a7e88', hole: '#1e1614', top: 'plate', rh: 26, bw: 52, pointed: false, ring: '#8a8e96', door: 'steel', doorC: '#6a6e78', plate: '#7a7e88', emblem: 'gear',
                  moat: { c: '#2a2c34', deep: '#16181e', bank: '#5a5048', oil: 1, stakes: '#5a5e66' } },
    hive:       { kind: 'wax', wall: '#d6aa42', cap: '#e8c060', hole: '#2a1a08', chitin: '#7a8a24', honey: '#f4c440', pointed: false, door: 'wax', doorC: '#c89a30', emblem: 'amber',
                  moat: { honey: 1, c: '#e8a820', deep: '#b87410', bank: '#8a6a20' } },
    bastion:    { kind: 'pal', wood: '#6e5434', woodD: '#4a3620', moss: '#5e8a3a', band: '#3a2a18', hole: '#16120c', antlers: 1, pointed: false, door: 'logs', doorC: '#5e4428', emblem: 'antlers',
                  moat: { c: '#2e5a4c', deep: '#1c3e34', bank: '#4a5a32', reeds: '#5a8a3a', lily: 1 } },
  };

  /* ====================================================================== лицо стены
     o: { dmg — повреждена, gap — выбитые зубцы, gate — оставить место под ворота (без украшений в центре) } */
  function face(f, o) {
    const s = S[f]; o = o || {};
    if (s.kind === 'pal') return palisade(f, o);
    if (s.kind === 'logs') return logWall(f, o);
    if (s.kind === 'rock') return rockWall(f, o);
    if (s.kind === 'wax') return waxWall(f, o);
    return stoneWall(f, o);
  }

  /** Каменная кладка: тело, цоколь, выступающий парапет, зубцы по фракции. */
  function stoneWall(f, o) {
    const s = S[f], out = [], rnd = rngOf(hash(f) + 3);
    const subs = [];
    for (let i = 0; i < 14; i++) {
      const row = (rnd() * 8) | 0, y = TOP + 22 + row * s.rh, x = X0 + (row % 2 ? s.bw / 2 : 0) + ((rnd() * 4) | 0) * s.bw;
      if (x + s.bw > X1 || y + s.rh > G - 20) continue;
      subs.push(sh(box(x + 2, y + 2, x + s.bw - 2, y + s.rh - 2), tone(s.wall, rnd() < 0.5 ? 0.1 : -0.12), 'horn', { line: 0, ao: 0.35, gloss: 0 }));
    }
    if (s.magma) for (const [x, y] of [[70, 250], [214, 170], [180, 360]]) subs.push(el(x, y, 26, 20, '#ff6a1a', 'flat', { op: 0.18, line: 0 }));
    out.push(sh(box(X0, TOP, X1, G), s.wall, 'horn', { gloss: 0.12, belly: 0.3, sub: subs, lines: masonry(X0, TOP + 22, X1, G, s.rh, s.bw) }));
    // цоколь
    out.push(sh(box(X0 - 8, G - 30, X1 + 8, G + 4), tone(s.wall, -0.14), 'horn', { gloss: 0.1, line: 1, lines: [ln([[X0 - 7, G - 27], [X1 + 7, G - 27]], 2.6, 0.5, { light: true })] }));
    // парапет: полоса над стеной чуть шире её, тень под ней
    out.push(sh(box(X0 - 10, TOP - 8, X1 + 10, TOP + 22), s.top === 'plate' ? s.plate : s.cap, s.top === 'plate' ? 'steel' : 'horn', { gloss: 0.25, line: 1.2,
      lines: [ln([[X0 - 9, TOP - 5], [X1 + 9, TOP - 5]], 2.6, 0.6, { light: true }), ln([[X0 - 9, TOP + 19], [X1 + 9, TOP + 19]], 3, 0.6)],
      glint: s.top === 'plate' ? [48, 100, 157, 214, 266].map(x => [x, TOP + 7, 4]) : undefined }));
    out.push(sh(box(X0, TOP + 22, X1, TOP + 34), tone(s.wall, -0.5), 'flat', { line: 0, op: 0.35 }));
    if (s.band) out.push(sh(box(X0, TOP + 40, X1, TOP + 52), s.band, s.band === GOLD ? 'gold' : 'cloth', { line: 0.8 }));
    // зубцы
    const kind = s.top === 'crystal' || s.top === 'plate' ? 'merlon' : s.top;
    out.push(...crenels(X0 - 10, X1 + 10, TOP - 8, s.top === 'spike' ? 58 : s.top === 'fang' ? 56 : s.top === 'plate' ? 30 : 44, 5, kind, s.top === 'plate' ? s.plate : s.cap,
      { gap: o.gap, snow: s.snow, tipC: s.tipC, crystal: s.top === 'crystal' ? s.crystal : null, m: s.top === 'plate' ? 'steel' : 'horn', seed: hash(f) }));
    return out;
  }

  /** Скала Подземелья: неровная глыба с трещинами, наверху — зубья скалы и кристаллы. */
  function rockWall(f, o) {
    const s = S[f], out = [], rnd = rngOf(hash(f));
    const bite = o.gap && o.gap.length ? 38 : 0;
    const top = [P(X0 - 8, G + 2, 1), [X0 - 12, 330], [X0 - 4, 210], P(X0 + 2, TOP + 10, 1), [X0 + 30, TOP - 34], P(X0 + 62, TOP - 6 + bite * 0.3, 1), [104, TOP - 50 + bite], P(136, TOP - 12 + bite, 1), [168, TOP - 44 + bite * 1.2], P(198, TOP - 6 + bite * 0.5, 1), [236, TOP - 52], P(262, TOP - 16, 1), [X1 + 6, TOP + 12], [X1 + 12, 240], P(X1 + 8, G + 2, 1)];
    out.push(sh(top, s.wall, 'horn', { gloss: 0.15, belly: 0.35, line: 1.2,
      sub: [sh([P(X0 + 20, TOP + 60, 1), [110, TOP + 40], P(170, TOP + 70, 1), [150, 260], P(60, 250, 1)], tone(s.wall, 0.12), 'horn', { line: 0, ao: 0.4, gloss: 0 }),
        sh([P(180, 250, 1), [250, 230], P(X1 - 4, 300, 1), [260, 400], P(190, 380, 1)], tone(s.wall, -0.14), 'horn', { line: 0, ao: 0.4, gloss: 0 })],
      lines: [ln([[70, TOP + 20], [90, 190], [72, 280], [96, 380]], 3.4, 0.55), ln([[200, TOP + 10], [186, 150], [220, 240]], 3, 0.5), ln([[150, 300], [170, 400], [150, G]], 3, 0.45), ln([[X0 + 10, 160], [40, 260]], 2.6, 0.4, { light: true })] }));
    // кладка, вросшая в скалу: пурпурный зубчатый пояс
    out.push(sh(box(X0 + 6, TOP + 40, X1 - 6, TOP + 64), '#4a3a56', 'horn', { gloss: 0.2, line: 1, lines: masonry(X0 + 6, TOP + 40, X1 - 6, TOP + 64, 24, 44, 0.5, 2.6) }));
    for (const [x, y, h, l] of [[X0 + 24, TOP - 2, 64, -0.18], [X0 + 44, TOP + 4, 44, 0.12], [X1 - 30, TOP - 6, 70, 0.16], [X1 - 52, TOP + 2, 42, -0.1]]) {
      if (bite && x > 100 && x < 220) continue;
      out.push(T.crystal(x, y, h * 0.26, h, s.crystals[(x | 0) % 3], l));
    }
    for (const [x, h, l] of [[X0 + 4, 58, -0.2], [X0 + 26, 40, 0.1], [X1 - 8, 64, 0.2], [X1 - 30, 38, -0.12]]) out.push(T.crystal(x, G, h * 0.26, h, s.crystals[(h | 0) % 3], l));
    void rnd;
    return out;
  }

  /** Частокол: заострённые брёвна, обвязка; Цитадель — глиняная обмазка снизу, Бастион — мох и рога. */
  function palisade(f, o) {
    const s = S[f], out = [], n = 7, st = (X1 - X0 + 16) / n, x0 = X0 - 8;
    const lift = [0, 18, 6, 24, 2, 14, 8], broken = o.dmg ? [1, 4] : [];
    out.push(sh(box(X0, TOP, X1, G), s.hole, 'cloth', { line: 0, ao: 1 }));   // тьма в щелях между брёвнами
    for (let i = 0; i < n; i++) {
      const x = x0 + i * st, t = TOP - 46 + lift[i], c = tone(s.wood, i % 2 ? 0.07 : -0.05);
      if (broken.includes(i)) {
        const tb = t + 170 + (i % 2) * 40;   // обломок: расщеплённый верх
        out.push(sh([P(x + 2, G, 1), P(x + 2, tb + 10, 1), P(x + st * 0.25, tb - 14, 1), P(x + st * 0.42, tb + 6, 1), P(x + st * 0.6, tb - 22, 1), P(x + st * 0.78, tb + 4, 1), P(x + st - 2, tb - 6, 1), P(x + st - 2, G, 1)], c, 'wood', { flow: -Math.PI / 2, line: 1.1 }));
        out.push(sh([P(x + st * 0.2, tb - 8, 1), P(x + st * 0.46, tb + 8, 1), P(x + st * 0.66, tb - 16, 1), P(x + st * 0.8, tb + 10, 1), P(x + st * 0.3, tb + 20, 1)], tone(s.wood, 0.35), 'wood', { flow: -Math.PI / 2, line: 0.6 }));
        continue;
      }
      out.push(sh([P(x + 2, G, 1), P(x + 2, t + 30, 1), P(x + st / 2, t, 1), P(x + st - 2, t + 30, 1), P(x + st - 2, G, 1)], c, 'wood', { flow: -Math.PI / 2, line: 1.1,
        lines: [ln([[x + st * 0.3, t + 34], [x + st * 0.3, G]], 2.6, 0.35, { light: true }), ln([[x + st * 0.72, t + 40], [x + st * 0.7, G]], 2.2, 0.35)] }));
    }
    for (const y of [TOP + 54, G - 120]) out.push(sh(tube([[X0 - 10, y, 8], [X1 + 10, y + 4, 8]]), s.band, 'leather', { line: 0.8, gloss: 0.3 }));
    if (s.clay) {   // Цитадель: глиняная обмазка снизу с красным узором
      const zig = []; for (let x = X0; x < X1; x += 36) zig.push([x, G - 70], [x + 18, G - 92]);
      out.push(sh([P(X0 - 10, G + 4, 1), P(X0 - 10, G - 124, 1), [60, G - 136], [110, G - 122], [170, G - 138], [230, G - 124], P(X1 + 10, G - 132, 1), P(X1 + 10, G + 4, 1)], s.clay, 'cloth', { line: 1.1, belly: 0.3,
        lines: [ln(zig, 5, 0.85, { c: '#8a2a1a' }), ln([[X0, G - 40], [X1, G - 40]], 4, 0.7, { c: '#e8d0a0' }), ln([[70, G - 110], [80, G - 60]], 2.2, 0.4)] }));
    }
    if (s.moss) {   // Бастион: мох на брёвнах
      for (const [x, y, rx] of [[x0 + st * 0.5, G - 30, 30], [x0 + st * 2.5, G - 60, 26], [x0 + st * 5.5, G - 40, 34], [x0 + st * 3.5, TOP + 40, 20], [x0 + st * 6.5, TOP + 30, 18]]) out.push(el(x, y, rx, rx * 0.6, s.moss, 'fur', { furLen: 0.5, flow: Math.PI / 2, line: 0.6, ao: 0.5 }));
    }
    return out;
  }

  /** Сруб на сваях (Крепость): горизонтальные брёвна с торцами, сваи, соломенный козырёк. */
  function logWall(f, o) {
    const s = S[f], out = [], lh = 36, base = G - 96;
    for (const x of [X0 + 10, 92, CX, 222, X1 - 10]) out.push(sh(tube([[x, G + 2, 15], [x + 2, base - 10, 13]], { flat0: true }), s.pile, 'wood', { flow: -Math.PI / 2, line: 1 }));
    out.push(sh(tube([[X0 - 6, G - 44, 5], [X1 + 6, G - 60, 5]]), '#5a4a2a', 'wood', { line: 0.6 }));   // распорка
    let i = 0;
    for (let y = base - lh / 2; y > TOP + 10; y -= lh, i++) {
      const hole = o.dmg && ((i === 2) || (i === 5));
      const xa = hole ? 150 : X0 - 8;
      out.push(sh(tube([[xa, y, lh / 2], [X1 + 8, y, lh / 2]], { flat0: true, flat1: true }), tone(s.wood, i % 2 ? 0.06 : -0.06), 'wood', { flow: 0, line: 1, lines: [ln([[xa + 4, y - lh * 0.22], [X1 + 4, y - lh * 0.22]], 2.2, 0.4, { light: true })] }));
      out.push(el(X1 + 8, y, 10, lh / 2 - 1, tone(s.wood, 0.25), 'wood', { line: 0.9, lines: [ln(ell(X1 + 8, y, 5, lh / 4, 10).concat([[X1 + 13, y]]), 1.6, 0.5)] }));
      if (hole) out.push(sh([P(xa, y - lh / 2, 1), P(xa - 22, y - 8, 1), P(xa - 6, y, 1), P(xa - 20, y + 12, 1), P(xa, y + lh / 2, 1)], tone(s.wood, 0.3), 'wood', { flow: 0, line: 0.8 }));
      else out.push(el(X0 - 8, y, 10, lh / 2 - 1, tone(s.wood, 0.25), 'wood', { line: 0.9 }));
    }
    // мох и тина по нижним брёвнам
    for (const [x, y, rx] of [[60, base - 10, 34], [200, base - 20, 28], [260, base - 70, 18]]) out.push(el(x, y, rx, rx * 0.45, s.moss, 'fur', { furLen: 0.5, flow: Math.PI / 2, line: 0.5, ao: 0.5 }));
    // соломенный козырёк
    const gap = o.gap && o.gap.length;
    out.push(sh([P(X0 - 26, TOP + 28, 1), [X0 - 6, TOP - 20], [CX - 40, TOP - 44], P(CX, TOP - 58, 1), [CX + 40, TOP - 44], [X1 + 6, TOP - 20], P(X1 + 26, TOP + 28, 1), [CX + 60, TOP + 36], gap ? P(CX + 10, TOP + 6, 1) : [CX, TOP + 38], gap ? P(CX - 30, TOP + 30, 1) : [CX - 60, TOP + 36]], s.thatch, 'fur',
      { furLen: 1.3, flow: Math.PI / 2, dens: 1.1, line: 1.1, belly: 0.3, lines: [ln([[X0 - 20, TOP + 24], [CX, TOP + 34], [X1 + 20, TOP + 24]], 5, 0.7, { c: '#7a6030' })] }));
    return out;
  }

  /** Воск и хитин (Улей): тело с сотами, верх буграми, хитиновые шипы, потёки мёда. */
  function waxWall(f, o) {
    const s = S[f], out = [], n = 5, st = (X1 - X0 + 20) / n, x0 = X0 - 10;
    // хитиновые шипы позади бугров
    for (let i = 0; i <= n; i++) {
      if (o.gap && o.gap.includes(i)) continue;
      const x = x0 + i * st;
      out.push(sh([P(x - 16, TOP + 20, 1), [x - 10, TOP - 30], P(x + 4, TOP - 86 + (i % 2) * 20, 1), [x + 10, TOP - 30], P(x + 16, TOP + 20, 1)], s.chitin, 'horn', { gloss: 0.7, line: 1, lines: [ln([[x - 6, TOP], [x + 2, TOP - 60]], 2.4, 0.5, { light: true })] }));
    }
    const pts = [P(X0 - 6, G + 2, 1), P(X0 - 10, TOP + 10, 1)];
    for (let i = 0; i < n; i++) {
      const a = x0 + i * st, b = a + st, bump = o.gap && o.gap.includes(i) ? 8 : 40;
      pts.push([a + st * 0.15, TOP - bump * 0.7], [a + st * 0.5, TOP - bump], [b - st * 0.15, TOP - bump * 0.7], P(b, TOP + 4, 1));
    }
    pts.push(P(X1 + 6, G + 2, 1));
    out.push(sh(pts, s.wall, 'leather', { gloss: 0.45, belly: 0.3, line: 1.2, lines: T.combLines(X0, TOP + 10, X1, G, 22).map(l => Object.assign({}, l, { w: 3, a: 0.45 })) }));
    // потёки мёда с гребня
    for (const [x, l] of [[52, 70], [112, 44], [168, 96], [236, 58], [272, 36]]) out.push(sh(tube([[x, TOP - 6, 9], [x + 1, TOP + l * 0.7, 7], [x, TOP + l, 9]]), s.honey, 'gem', { gloss: 0.9, line: 0.7, lc: '#8a5a08' }));
    out.push(sh(box(X0 - 8, G - 24, X1 + 8, G + 4), tone(s.chitin, -0.1), 'horn', { gloss: 0.5, line: 1 }));
    return out;
  }

  /* ====================================================================== украшения стены
     Кладутся поверх лица стены; center: false — место в центре занято воротами. */
  function deco(f, o) {
    const s = S[f], out = [], center = !o.gate;
    const slits = (c, glow, cross) => [...slit(76, TOP + 120, 70, c, { glow, cross }), ...slit(238, TOP + 120, 70, c, { glow, cross })];
    switch (f) {
      case 'castle':
        out.push(...slits('#2a2420', false, true));
        if (center) out.push(sh([P(CX - 34, TOP + 20, 1), P(CX + 34, TOP + 20, 1), P(CX + 34, TOP + 150, 1), P(CX, TOP + 128, 1), P(CX - 34, TOP + 150, 1)], '#c42a2a', 'cloth', { line: 1.2, lines: [ln([[CX - 26, TOP + 30], [CX - 22, TOP + 130]], 2.4, 0.4, { light: true })],
          sub: [sh(box(CX - 6, TOP + 34, CX + 6, TOP + 118), GOLD, 'gold', { line: 0 }), sh(box(CX - 24, TOP + 58, CX + 24, TOP + 70), GOLD, 'gold', { line: 0 })] }),
          sh(tube([[CX - 42, TOP + 22, 5], [CX + 42, TOP + 22, 5]]), '#5a3a1c', 'wood', { line: 0.6 }));
        break;
      case 'rampart': {
        out.push(...slit(76, TOP + 130, 60, '#34462c', { w: 9 }), ...slit(238, TOP + 130, 60, '#34462c', { w: 9 }));
        // плющ: стебли от земли вверх и листва комьями
        const LEAF = ['#2f6a24', '#4a8a32', '#5e9e3c', '#76b44a'];
        out.push(sh(tube([[40, G, 5], [52, 330, 4.5], [36, 240, 4], [58, 160, 3.5], [44, TOP + 20, 3]]), '#5a4020', 'wood', { line: 0.5 }));
        out.push(sh(tube([[270, G, 5], [256, 360, 4.5], [274, 280, 4], [252, 200, 3]]), '#5a4020', 'wood', { line: 0.5 }));
        out.push(...T.foliage(46, 190, 44, 80, 5, LEAF, 3, { leaf: 0.5 }), ...T.foliage(58, TOP + 30, 50, 34, 4, LEAF, 5, { leaf: 0.5 }), ...T.foliage(262, 290, 40, 90, 5, LEAF, 7, { leaf: 0.5 }));
        if (center) out.push(...T.foliage(CX + 30, TOP + 26, 60, 28, 4, LEAF, 9, { leaf: 0.5 }));
        break;
      }
      case 'tower':
        out.push(...slits(s.slitC, true, false));
        for (let x = X0 - 4; x < X1 + 4; x += 22) out.push(sh([P(x, TOP + 20, 1), P(x + 12, TOP + 20, 1), P(x + 6, TOP + 44 + ((x * 7) % 26), 1)], '#e6f2ff', 'gem', { gloss: 0.9, line: 0.6, lc: '#7a9ab8', rim: 0 }));
        break;
      case 'inferno':
        out.push(...slits(s.slitC, true, false));
        out.push(T.horn(X0 + 8, TOP - 4, -1, 60, '#6a5a50'), T.horn(X1 - 8, TOP - 4, 1, 60, '#6a5a50'));
        for (const pts of [[[40, 300], [74, 332], [66, 380], [96, G - 30]], [[210, 180], [236, 228], [222, 270], [250, 300]], [[130, 380], [150, 410], [140, G - 30]]]) {
          out.push(sh(tube(pts.map(p => [p[0], p[1], 6])), '#ff6a1a', 'gem', { gloss: 0.8, rim: 0, line: 0.6, lc: '#6a1a08' }), sh(tube(pts.map(p => [p[0], p[1], 2.2])), '#ffe08a', 'flat', { line: 0 }));
        }
        break;
      case 'necropolis': {
        out.push(...slits(s.slitC, true, false));
        const xs = center ? [60, CX, 254] : [60, 254];
        for (const x of xs) out.push(...T.skull(x, TOP + 8, 17));
        break;
      }
      case 'dungeon':
        out.push(...slit(CX, TOP + 150, 64, s.slitC, { glow: true, w: 8 }).filter(() => center));
        break;
      case 'stronghold':
        if (center) out.push(...T.skull(CX + 2, TOP - 20, 26, { horns: true }));
        out.push(sh([P(60, TOP + 60, 1), P(96, TOP + 60, 1), P(92, TOP + 130, 1), P(78, TOP + 116, 1), P(64, TOP + 132, 1)], '#a8322a', 'cloth', { line: 1 }));
        break;
      case 'fortress':
        if (center) out.push(...T.lizardTotem(CX, TOP + 150, 110).map(q => Object.assign({}, q)));
        break;
      case 'conflux':
        for (const [x, c] of [[70, '#ff8a3a'], [CX, '#5ab0ff'], [244, '#8ad060']]) if (center || x !== CX) out.push(sh([P(x, TOP + 80, 1), P(x + 28, TOP + 116, 1), P(x, TOP + 152, 1), P(x - 28, TOP + 116, 1)], GOLD, 'gold', { line: 0.8 }), sh([P(x, TOP + 90, 1), P(x + 18, TOP + 116, 1), P(x, TOP + 142, 1), P(x - 18, TOP + 116, 1)], c, 'gem', { gloss: 1.1, rim: 0.7, line: 1, lc: '#6a5a3a' }));
        break;
      case 'cove': {
        if (!center) break;
        // пушечный порт: тёмная арка, ствол глядит влево, к нападающим
        out.push(sh(T.arch(CX, TOP + 190, 36, 72), '#1e1610', 'cloth', { ao: 1.4, line: 1.2 }));
        out.push(sh(tube([[CX + 20, TOP + 158, 17], [CX - 40, TOP + 160, 15], [CX - 60, TOP + 160, 17]], { flat0: true, flat1: true }), '#34343c', 'steel', { gloss: 0.9, line: 1, lines: [ln([[CX - 30, TOP + 146], [CX - 30, TOP + 174]], 4, 0.8, { c: '#1a1a20' })] }));
        out.push(el(CX - 60, TOP + 160, 5, 15, '#0e0e12', 'flat', { line: 0 }));
        out.push(sh(tube([[X0 + 6, TOP + 60, 5], [80, TOP + 76, 5], [X1 - 60, TOP + 64, 5]]), '#c8b080', 'leather', { line: 0.5 }));
        break;
      }
      case 'factory': {
        // клёпаный стальной пояс и труба
        const rv = []; for (let x = X0 + 14; x < X1; x += 26) rv.push([x, 228, 4], [x, 262, 4]);
        out.push(sh(box(X0 - 4, 216, X1 + 4, 274), s.plate, 'steel', { gloss: 0.7, line: 1.2, glint: rv, lines: [80, 150, 220].map(x => ln([[x, 216], [x, 274]], 3, 0.6))
        }));
        out.push(sh(tube([[X1 - 26, G - 30, 11], [X1 - 26, TOP + 30, 11]], { flat0: true, flat1: true }), '#5a5e66', 'steel', { gloss: 0.8, line: 1, lines: [ln([[X1 - 37, 180], [X1 - 15, 180]], 5, 0.7), ln([[X1 - 37, 340], [X1 - 15, 340]], 5, 0.7)] }));
        out.push(...slit(76, TOP + 70, 40, '#2a1a14', { w: 9 }));
        break;
      }
      case 'hive':
        for (const [x, y] of center ? [[90, 240], [CX, 180], [226, 300]] : [[70, 240], [250, 300]]) out.push(sh(T.hexPts(x, y, 20), '#ffc040', 'gem', { gloss: 0.8, line: 1, lc: '#5a3a08' }));
        break;
      case 'bastion': {
        const ant = (x, y, sgn) => sh(tube([[x, y, 7], [x + sgn * 20, y - 30, 5], [x + sgn * 16, y - 62, 3], [x + sgn * 34, y - 84, 1.5]]), '#e0d4b0', 'horn', { gloss: 0.4, line: 0.8 });
        const tine = (x, y, sgn) => sh(tube([[x + sgn * 18, y - 30, 4], [x + sgn * 40, y - 46, 1.5]]), '#e0d4b0', 'horn', { line: 0.7 });
        for (const x of center ? [70, 244] : [70, 244]) out.push(ant(x - 8, TOP - 24, -1), tine(x - 8, TOP - 24, -1), ant(x + 8, TOP - 24, 1), tine(x + 8, TOP - 24, 1), el(x, TOP - 22, 13, 10, '#d8ccb0', 'horn', { line: 0.8 }));
        break;
      }
    }
    return out;
  }

  /* ====================================================================== повреждения */
  function damage(f) {
    const s = S[f], out = [], rnd = rngOf(hash(f) + 17);
    const dark = s.hole, cc = tone(s.kind === 'pal' || s.kind === 'logs' ? s.wood : s.wall, -0.65);
    if (s.kind === 'stone' || s.kind === 'rock' || s.kind === 'wax') {
      out.push(breach(96, 206, 44, 34, dark, rnd, { lc: cc }), breach(212, 318, 40, 30, dark, rnd, { lc: cc }), breach(58, 372, 26, 20, dark, rnd, { lc: cc }));
      out.push(crack([[128, TOP + 20], [136, 150], [122, 180]], cc), crack([[204, 290], [190, 240], [206, 200], [194, TOP + 30]], cc), crack([[88, 236], [100, 290], [84, 340]], cc), crack([[236, 346], [250, 400], [238, G - 30]], cc));
      if (s.kind === 'stone') out.push(sh([P(150, TOP - 8, 1), P(196, TOP - 8, 1), P(190, TOP + 12, 1), P(170, TOP + 26, 1), P(154, TOP + 10, 1)], dark, 'horn', { gloss: 0, lo: 1.4, ao: 1.4, line: 1 }));
      if (f === 'inferno') out.push(el(96, 206, 22, 16, '#ff6a1a', 'gem', { gloss: 0.8, rim: 0, line: 0, op: 0.7 }));
      if (f === 'tower') out.push(sh([P(60, 190, 1), P(128, 190, 1), P(120, 202, 1), P(70, 204, 1)], '#f4f8ff', 'cloth', { line: 0.6, lc: '#8aa0b8' }));
    }
    if (s.kind === 'pal') for (const [x, y, rx] of [[120, 310, 16], [250, 220, 12]]) out.push(breach(x, y, rx, rx * 2, dark, rnd, { lc: cc }));
    // обломки у подножия
    const rc = s.kind === 'pal' || s.kind === 'logs' ? s.wood : s.kind === 'wax' ? s.wall : s.cap;
    for (const [x, rx] of [[70, 30], [150, 20], [236, 34], [110, 16]]) out.push(chunk(x, G - 8, rx, rx * 0.6, tone(rc, (rnd() - 0.5) * 0.25), rnd, { m: s.kind === 'pal' || s.kind === 'logs' ? 'wood' : s.kind === 'wax' ? 'leather' : 'horn' }));
    if (f === 'conflux') out.push(T.crystal(196, G - 4, 10, 36, '#5ab0ff', 0.4), T.crystal(90, G - 4, 8, 28, '#ff8a3a', -0.5));
    if (s.moss || f === 'castle' || f === 'rampart') for (const [x, y, r] of [[60, 150, 14], [236, 262, 12], [120, 400, 14]]) out.push(el(x, y, r * 1.3, r, s.moss || '#5a8a3a', 'fur', { furLen: 0.4, line: 0.4, ao: 0.4 }));
    return out;
  }

  /* ====================================================================== развалины (рамка 313×180, земля 174) */
  function rubble(f) {
    const s = S[f], out = [], rnd = rngOf(hash(f) + 29);
    if (s.kind === 'pal' || s.kind === 'logs') {
      // пеньки брёвен и поваленные брёвна
      for (let i = 0; i < 6; i++) { const x = X0 + 8 + i * 44, h = 30 + ((i * 37) % 44); out.push(sh([P(x - 18, RB, 1), P(x - 18, RB - h, 1), P(x - 8, RB - h - 16, 1), P(x, RB - h + 2, 1), P(x + 8, RB - h - 12, 1), P(x + 18, RB - h + 4, 1), P(x + 18, RB, 1)], tone(s.wood, i % 2 ? 0.06 : -0.06), 'wood', { flow: -Math.PI / 2, line: 1 })); }
      out.push(sh(tube([[X0 - 10, RB - 14, 17], [X1 - 30, RB - 46, 16]], { flat0: true, flat1: true }), tone(s.wood, 0.1), 'wood', { flow: -0.12, line: 1 }), el(X1 - 30, RB - 46, 9, 16, tone(s.wood, 0.3), 'wood', { line: 0.8 }));
      out.push(sh(tube([[60, RB - 4, 15], [220, RB - 12, 14]], { flat0: true, flat1: true }), tone(s.wood, -0.1), 'wood', { flow: 0, line: 1 }));
      if (s.clay) for (const [x, r] of [[40, 22], [150, 16], [260, 20]]) out.push(chunk(x, RB - 6, r, r * 0.6, s.clay, rnd, { m: 'cloth' }));
      if (s.thatch) out.push(sh([P(150, RB - 10, 1), [190, RB - 40], P(260, RB - 30, 1), [250, RB - 6]], s.thatch, 'fur', { furLen: 1, flow: 0.3, line: 1 }));
      if (s.moss) out.push(el(120, RB - 10, 40, 12, s.moss, 'fur', { furLen: 0.5, line: 0.5 }));
      if (f === 'stronghold') out.push(...T.skull(206, RB - 22, 16, { horns: true }));
      if (f === 'bastion') out.push(sh(tube([[200, RB - 8, 5], [220, RB - 40, 3.5], [212, RB - 70, 1.5]]), '#e0d4b0', 'horn', { line: 0.7 }));
      return out;
    }
    const c = s.kind === 'wax' ? s.wall : s.wall, m = s.kind === 'wax' ? 'leather' : 'horn';
    // пенёк стены — неровный срез
    out.push(sh([P(X0 - 4, RB + 2, 1), P(X0 - 4, 120, 1), [58, 104], P(88, 118, 1), [122, 96], P(156, 116, 1), [196, 100], P(226, 120, 1), [260, 104], P(X1 + 4, 122, 1), P(X1 + 4, RB + 2, 1)], c, m,
      { gloss: 0.15, line: 1.1, belly: 0.3, lines: s.kind === 'stone' ? masonry(X0, 96, X1, RB, Math.min(s.rh, 30), s.bw * 0.7, 0.5, 2.6) : s.kind === 'wax' ? T.combLines(X0, 110, X1, RB, 20) : [ln([[80, 110], [96, 170]], 3, 0.5), ln([[200, 104], [186, 160]], 3, 0.5)] }));
    const rc = s.kind === 'stone' ? s.cap : c;
    for (const [x, y, rx] of [[64, 104, 34], [150, 94, 38], [236, 100, 32], [108, 86, 22], [196, 84, 20], [36, 164, 20], [272, 166, 22], [160, 166, 18]]) out.push(chunk(x, y, rx, rx * 0.55, tone(rc, (rnd() - 0.5) * 0.24), rnd, { m }));
    if (f === 'inferno') for (const [x, y] of [[100, 110], [210, 106]]) out.push(el(x, y, 12, 6, '#ff6a1a', 'gem', { gloss: 0.9, rim: 0, line: 0.5, lc: '#6a1a08' }));
    if (f === 'necropolis') out.push(...T.skull(200, 150, 15), ...T.skull(80, 156, 12));
    if (f === 'dungeon' || f === 'conflux') { const cols = s.crystals || s.crystal; out.push(T.crystal(90, 110, 12, 44, cols[0], -0.3), T.crystal(220, 108, 10, 36, cols[1], 0.3)); }
    if (f === 'tower') for (const x of [60, 150, 240]) out.push(T.snowcap(x, 94, 26, 0.7));
    if (f === 'factory') out.push(sh([P(90, 150, 1), P(180, 120, 1), P(200, 136, 1), P(110, 170, 1)], s.plate, 'steel', { gloss: 0.8, line: 1, glint: [[120, 152, 4], [170, 132, 4]] }));
    if (f === 'hive') out.push(sh(tube([[150, 96, 8], [152, 140, 7]]), s.honey, 'gem', { gloss: 0.9, line: 0.6, lc: '#8a5a08' }), sh([P(220, 170, 1), P(236, 100, 1), P(250, 170, 1)], s.chitin, 'horn', { gloss: 0.6, line: 1 }));
    if (f === 'rampart') out.push(...T.foliage(250, 110, 30, 16, 3, ['#2f6a24', '#4a8a32', '#76b44a'], 4, { leaf: 0.5 }));
    if (f === 'cove') out.push(sh(tube([[180, 150, 13], [250, 140, 12]], { flat0: true, flat1: true }), '#34343c', 'steel', { gloss: 0.9, line: 1 }));
    return out;
  }

  /* ====================================================================== ворота */
  const GW = 64, GH = 262;   // полуширина и высота проёма
  function gateShapes(f, broken) {
    const s = S[f], out = [], pt = !!s.pointed, rnd = rngOf(hash(f) + 41);
    // обрамление
    if (s.door === 'maw') {   // Подземелье: пасть в скале с клыками
      out.push(sh([P(CX - GW - 34, G + 2, 1), [CX - GW - 30, G - 150], [CX - 50, G - GH - 30], [CX, G - GH - 44], [CX + 50, G - GH - 30], [CX + GW + 30, G - 150], P(CX + GW + 34, G + 2, 1)], s.ring, 'horn', { gloss: 0.15, line: 1.2 }));
    } else if (s.door === 'wax') {
      out.push(sh(ell(CX, G - 120, GW + 30, 140, 16), s.chitin, 'horn', { gloss: 0.6, line: 1.2 }));
    } else if (s.kind === 'pal' || s.kind === 'logs') {
      for (const d of [-1, 1]) out.push(sh(tube([[CX + d * (GW + 12), G + 2, 18], [CX + d * (GW + 12), G - GH - 30, 15]], { flat0: true }), tone(s.wood, -0.12), 'wood', { flow: -Math.PI / 2, line: 1.1 }));
      out.push(sh(tube([[CX - GW - 40, G - GH - 10, 16], [CX + GW + 40, G - GH - 10, 16]], { flat0: true, flat1: true }), tone(s.wood, 0.05), 'wood', { flow: 0, line: 1.1 }));
    } else {
      out.push(sh(T.arch(CX, G, GW + 20, GH + 20, pt), s.ring, 'horn', { gloss: 0.25, line: 1.2, lines: T.voussoirs(CX, G - GH + (pt ? GW * 1.35 : GW), GW + 12, 9).map(l => Object.assign({}, l, { w: 3.4, a: 0.55 })) }));
    }
    const hole = s.door === 'maw' ? [P(CX - GW, G + 2, 1), [CX - GW + 4, G - 150], [CX - 30, G - GH + 10], [CX, G - GH], [CX + 30, G - GH + 10], [CX + GW - 4, G - 150], P(CX + GW, G + 2, 1)]
      : s.door === 'wax' ? ell(CX, G - 110, GW + 6, 118, 16)
      : s.kind === 'pal' || s.kind === 'logs' ? box(CX - GW, G - GH, CX + GW, G + 2) : T.arch(CX, G, GW, GH, pt);
    const glowC = s.glowHole ? s.holeC : null;
    out.push(sh(hole, glowC || s.holeC || HOLE, glowC ? 'gem' : 'cloth', { ao: glowC ? 0 : 1.5, gloss: glowC ? 0.9 : 0, rim: 0, line: 1.2,
      sub: glowC ? [sh(box(CX - GW, G - 90, CX + GW, G + 4), '#ffd070', 'flat', { line: 0, op: 0.7 })] : undefined }));
    if (s.door === 'maw') for (let i = 0; i < 6; i++) { const x = CX - GW + 14 + i * 22, y = G - GH + 16 + Math.abs(i - 2.5) * 16; out.push(sh([P(x - 10, y - 10, 1), P(x + 10, y - 10, 1), P(x + 1, y + 30 + (i % 2) * 12, 1)], '#7a7084', 'horn', { gloss: 0.3, line: 0.9 })); }
    if (!broken) out.push(...door(f, hole, rnd));
    else out.push(...brokenDoor(f, rnd));
    out.push(...emblem(f, broken));
    return out;
  }
  /** Целая створка по виду ворот фракции. */
  function door(f, hole, rnd) {
    const s = S[f], out = [];
    const inset = s.door === 'maw' ? [P(CX - GW + 10, G + 2, 1), [CX - GW + 12, G - 140], [CX - 24, G - GH + 40], [CX + 24, G - GH + 40], [CX + GW - 12, G - 140], P(CX + GW - 10, G + 2, 1)] : hole;
    const bars = (c, w) => { const l = []; for (let x = CX - GW + 22; x < CX + GW - 8; x += 22) l.push(ln([[x, G - GH], [x, G]], w || 7, 0.95, { c })); for (let y = G - GH + 60; y < G - 6; y += 36) l.push(ln([[CX - GW, y], [CX + GW, y]], (w || 7) * 0.85, 0.95, { c })); return l; };
    switch (s.door) {
      case 'wood': case 'maw':
        out.push(sh(inset, s.doorC, 'wood', { flow: -Math.PI / 2, line: 1.2, lines: [ln([[CX, G - GH], [CX, G]], 4, 0.8), ...[-0.5, 0.5].map(k => ln([[CX + GW * k, G - GH], [CX + GW * k, G]], 2.4, 0.5)), ...[0.3, 0.62].map(t => ln([[CX - GW, G - GH * t], [CX + GW, G - GH * t]], 9, 0.95, { c: IRON }))],
          glint: [[CX - 40, G - GH * 0.3, 5], [CX - 14, G - GH * 0.3, 5], [CX + 14, G - GH * 0.3, 5], [CX + 40, G - GH * 0.3, 5], [CX - 40, G - GH * 0.62, 5], [CX + 40, G - GH * 0.62, 5]] }));
        out.push(el(CX - 16, G - 110, 7, 7, GOLD, 'gold', { line: 0.6 }), el(CX + 16, G - 110, 7, 7, GOLD, 'gold', { line: 0.6 }));
        break;
      case 'grate':
        out.push(sh(hole, 'rgba(0,0,0,0)', 'flat', { line: 0, lines: bars(s.grateC, 8) }));
        if (s.doorC) out.push(sh(box(CX - GW, G - 90, CX + GW, G + 2), s.doorC, 'steel', { gloss: 0.5, line: 1, lines: [ln([[CX, G - 90], [CX, G]], 3, 0.6)] }));
        break;
      case 'logs': {
        const logs = []; for (let x = CX - GW; x < CX + GW - 4; x += 26) logs.push(sh(box(x + 1, G - GH + 4, x + 25, G + 2), tone(s.doorC, ((x / 26) | 0) % 2 ? 0.08 : -0.06), 'wood', { flow: -Math.PI / 2, line: 1 }));
        out.push(...logs, sh(tube([[CX - GW - 4, G - GH * 0.72, 7], [CX + GW + 4, G - GH * 0.72, 7]]), '#3a2a18', 'leather', { line: 0.7 }), sh(tube([[CX - GW - 4, G - GH * 0.3, 7], [CX + GW + 4, G - GH * 0.3, 7]]), '#3a2a18', 'leather', { line: 0.7 }));
        out.push(sh(tube([[CX - GW + 6, G - 20, 6], [CX + GW - 6, G - GH + 30, 6]]), tone(s.doorC, -0.15), 'wood', { line: 0.8 }));
        break;
      }
      case 'crystal':
        out.push(sh(hole, s.doorC, 'gem', { gloss: 1.1, rim: 0.8, line: 1.2, lc: '#2a6a8a', op: 0.85, lines: [ln([[CX, G - GH], [CX, G]], 3, 0.6, { light: true }), ln([[CX - GW, G - GH * 0.5], [CX + GW, G - GH * 0.5]], 3, 0.5, { light: true })], glint: [[CX - 30, G - GH + 80, 12]] }));
        break;
      case 'steel': {
        const rv = []; for (let y = G - GH + 70; y < G; y += 44) for (const x of [CX - GW + 12, CX - 10, CX + 10, CX + GW - 12]) rv.push([x, y, 4]);
        out.push(sh(hole, s.doorC, 'steel', { gloss: 0.7, line: 1.2, glint: rv, lines: [ln([[CX, G - GH], [CX, G]], 4, 0.8), ...[0.3, 0.6].map(t => ln([[CX - GW, G - GH * t], [CX + GW, G - GH * t]], 5, 0.7))] }));
        out.push(...T.gear(CX, G - GH * 0.5, 26, 8, '#b08a3a'));
        break;
      }
      case 'wax':
        out.push(sh(ell(CX, G - 110, GW, 112, 16), s.doorC, 'leather', { gloss: 0.5, line: 1.2, lines: T.combLines(CX - GW, G - 220, CX + GW, G, 16).map(l => Object.assign({}, l, { w: 2.6, a: 0.55 })) }));
        break;
    }
    void rnd;
    return out;
  }
  /** Выбитые ворота: створки висят обломками, решётка погнута, щепа у порога. */
  function brokenDoor(f, rnd) {
    const s = S[f], out = [];
    if (s.door === 'grate') {
      for (const [x, bend] of [[CX - GW + 22, -30], [CX - GW + 44, 16], [CX + GW - 22, 26]]) out.push(sh(tube([[x, G - GH + 8, 4.5], [x + bend * 0.3, G - GH + 90, 4.5], [x + bend, G - GH + 150, 4.5]]), s.grateC, 'steel', { line: 0.4 }));
      out.push(sh(tube([[CX - GW, G - GH + 64, 4], [CX - 10, G - GH + 80, 4], [CX + 30, G - GH + 50, 4]]), s.grateC, 'steel', { line: 0.4 }));
      out.push(sh([P(CX - 50, G + 2, 1), P(CX - 20, G - 30, 1), P(CX + 60, G - 16, 1), P(CX + 56, G + 2, 1)], s.grateC, 'steel', { line: 1, lines: [ln([[CX - 30, G - 10], [CX + 50, G - 6]], 3, 0.6)] }));
      return out;
    }
    const c = s.doorC, m = s.door === 'crystal' ? 'gem' : s.door === 'steel' ? 'steel' : s.door === 'wax' ? 'leather' : 'wood';
    out.push(sh([P(CX - GW, G + 2, 1), P(CX - GW, G - 150, 1), P(CX - GW + 22, G - 186, 1), P(CX - GW + 28, G - 140, 1), P(CX - GW + 42, G - 168, 1), P(CX - GW + 48, G + 2, 1)], c, m, { flow: -Math.PI / 2, line: 1.1, lines: m === 'wood' ? [ln([[CX - GW, G - 90], [CX - GW + 48, G - 88]], 8, 0.9, { c: IRON })] : [] }));
    out.push(sh([P(CX + GW, G + 2, 1), P(CX + GW, G - 120, 1), P(CX + GW - 18, G - 150, 1), P(CX + GW - 26, G - 110, 1), P(CX + GW - 38, G - 128, 1), P(CX + GW - 40, G + 2, 1)], tone(c, -0.1), m, { flow: -Math.PI / 2, line: 1.1 }));
    out.push(sh([P(CX - 30, G - 4, 1), P(CX + 30, G - 30, 1), P(CX + 40, G - 18, 1), P(CX - 20, G + 4, 1)], tone(c, 0.1), m, { flow: -0.4, line: 1 }));
    for (const [x, r] of [[CX - 6, 12], [CX + 30, 9]]) out.push(chunk(x, G - 4, r, r * 0.6, tone(c, 0.2), rnd, { m }));
    return out;
  }
  /** Знак фракции над воротами. */
  function emblem(f, broken) {
    const s = S[f], y = G - GH - 36, out = [];
    switch (s.emblem) {
      case 'shield': out.push(sh([P(CX - 24, y - 26, 1), P(CX + 24, y - 26, 1), [CX + 22, y + 6], P(CX, y + 28, 1), [CX - 22, y + 6]], '#2e5ab8', 'steel', { gloss: 0.8, line: 1, sub: [sh(box(CX - 4, y - 22, CX + 4, y + 20), GOLD, 'gold', { line: 0 }), sh(box(CX - 18, y - 8, CX + 18, y), GOLD, 'gold', { line: 0 })] })); break;
      case 'leaf': { const lf = K.leaf([CX, y + 20], -Math.PI / 2, 56, 26); out.push(sh(lf.body, GOLD, 'gold', { line: 0.8, lines: [ln(lf.shaft, 2, 0.6)] })); break; }
      case 'star': out.push(sh([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 11 : 26; return P(CX + Math.cos(a) * r, y + Math.sin(a) * r, 1); }), GOLD, 'gold', { line: 0.8 })); break;
      case 'horns': out.push(T.horn(CX - 14, y + 16, -1, 50, '#7a6a5e'), T.horn(CX + 14, y + 16, 1, 50, '#7a6a5e'), el(CX, y + 10, 20, 18, '#8a2418', 'leather', { gloss: 0.5, line: 1, glint: [[CX - 7, y + 6, 4], [CX + 7, y + 6, 4]] })); break;
      case 'skull': out.push(...T.skull(CX, y + 4, 22)); break;
      case 'bull': out.push(...T.skull(CX, y + 2, 24, { horns: true })); break;
      case 'lizard': out.push(...T.lizardTotem(CX - 10, y + 44, 70).slice(1)); break;
      case 'gem': out.push(T.crystal(CX, y + 26, 16, 56, '#9ae8f8', 0)); break;
      case 'anchor': out.push(sh(tube([[CX, y - 24, 5], [CX, y + 22, 5]]), IRON, 'steel', { line: 0.6 }), sh(tube([[CX - 24, y + 6, 4], [CX - 14, y + 22, 4.5], [CX, y + 26, 5], [CX + 14, y + 22, 4.5], [CX + 24, y + 6, 4]]), IRON, 'steel', { line: 0.6 }), sh(tube([[CX - 14, y - 12, 4], [CX + 14, y - 12, 4]]), IRON, 'steel', { line: 0.6 }), el(CX, y - 28, 7, 7, IRON, 'steel', { line: 0.6 })); break;
      case 'gear': if (s.door !== 'steel' || broken) out.push(...T.gear(CX, y, 22, 8, '#b08a3a')); break;
      case 'amber': out.push(sh(T.hexPts(CX, y, 24), '#ffb020', 'gem', { gloss: 0.9, line: 1, lc: '#5a3a08' })); break;
      case 'antlers': for (const d of [-1, 1]) out.push(sh(tube([[CX + d * 8, y + 16, 7], [CX + d * 30, y - 10, 5], [CX + d * 26, y - 44, 2]]), '#e0d4b0', 'horn', { line: 0.8 }), sh(tube([[CX + d * 28, y - 12, 4], [CX + d * 52, y - 22, 1.5]]), '#e0d4b0', 'horn', { line: 0.7 })); break;
    }
    return out;
  }

  /* ====================================================================== башня (рамка 300×550, земля 526) */
  function towerShapes(f) {
    const out = [el(TX, TG + 4, 118, 12, '#2a2418', 'flat', { line: 0, op: 0.5 })];
    const k = { rh: 40, bw: 64, ma: 0.45, mw: 3, winW: 15, winH: 40 };
    const std = (o) => { const t = T.tower(TX, TG, 100, 310, Object.assign({}, k, o)); out.push(...t); return t; };
    switch (f) {
      case 'castle':
        std({ wall: '#e4e0d6', shade: '#b4b0aa', light: '#f4f2ec', roof: '#3566cc', roofD: '#1f3f8e', finial: GOLD, win: [282, 352], roofH: 200, flag: '#c42a2a', flagL: 70 });
        break;
      case 'rampart':
        std({ wall: '#dcd6c0', shade: '#a8a088', light: '#f2eee0', roof: '#4c9a3a', roofD: '#2d6424', finial: GOLD, flare: 0.16, pointed: true, win: [282, 352], roofH: 230, flag: '#3f8f33', flagL: 70 });
        out.push(sh(box(TX - 108, 346, TX + 108, 360), '#8a5a30', 'wood', { flow: 0, line: 1, lines: [ln([[TX - 104, 328], [TX + 104, 328]], 3.4, 0.9, { c: '#5a3a1c' }), ...[-1, -0.5, 0, 0.5, 1].map(q => ln([[TX + q * 100, 346], [TX + q * 100, 328]], 3, 0.9, { c: '#5a3a1c' }))] }));
        out.push(...T.foliage(TX - 70, TG - 40, 50, 36, 4, ['#2f6a24', '#4a8a32', '#5e9e3c', '#76b44a'], 21, { leaf: 0.5 }));
        break;
      case 'tower': {
        const t = std({ wall: '#eef2f6', shade: '#b8c6d6', light: '#ffffff', roof: '#4f86d0', roofD: '#2a5a9c', top: 'onion', finial: GOLD, winC: '#bfe2ff', winLC: '#2a4a78', win: [282, 352], roofH: 150 });
        out.push(T.snowcap(TX, t.apex[1] + 70, 60, 1.2), T.snowcap(TX, TG - 310, 108, 1));
        break;
      }
      case 'inferno': {
        const x = TX;
        out.push(T.horn(x - 80, TG - 300, -1, 96, '#6a5a50'), T.horn(x + 80, TG - 300, 1, 96, '#6a5a50'));
        std({ wall: '#40302e', shade: '#221816', light: '#5c4844', top: 'crenel', winC: '#ffa040', winLC: '#2a0a04', pointed: true, win: [282, 352] });
        out.push(sh(box(x - 56, TG - 346, x + 56, TG - 320), '#2a1e1c', 'steel', { line: 1 }), ...T.flame(x, TG - 340, 52, 116), ...T.flame(x - 32, TG - 340, 24, 64, { c: '#ffa040' }));
        break;
      }
      case 'necropolis': {
        const t = std({ wall: '#5a5868', shade: '#33313e', light: '#6e6c7c', roof: '#3e2e4e', roofD: '#1e1628', roofM: 'steel', flare: 0.3, pointed: true, winC: '#b67ae8', winLC: '#1a0e24', win: [282, 352], roofH: 250 });
        out.push(sh(tube([[TX, t.apex[1] + 14, 5], [TX, t.apex[1] - 44, 1]]), '#34323e', 'steel', { line: 0.6 }), el(TX, t.apex[1] - 6, 9, 9, '#e4dcc6', 'horn', { line: 0.6 }));
        out.push(...T.skull(TX, TG - 250, 22));
        break;
      }
      case 'dungeon': {
        std({ wall: '#5c4c60', shade: '#342a38', light: '#76667a', roof: '#8a4ac0', roofD: '#4e2a72', finial: '#c890f0', flare: 0.1, pointed: true, winC: '#e090ff', winLC: '#2a0e3a', win: [282, 352], roofH: 220 });
        out.push(T.rock([P(TX - 130, TG + 4, 1), [TX - 128, TG - 90], [TX - 96, TG - 150], [TX - 60, TG - 110], [TX - 20, TG - 60], [TX + 30, TG - 90], [TX + 80, TG - 170], [TX + 120, TG - 110], P(TX + 132, TG + 4, 1)], '#4a4252', { lines: [ln([[TX - 90, TG - 130], [TX - 70, TG - 40]], 3, 0.5), ln([[TX + 80, TG - 150], [TX + 94, TG - 60]], 3, 0.5)] }));
        for (const [x, h, c, l] of [[TX - 110, 80, '#9a5ae0', -0.15], [TX - 84, 50, '#c890f8', 0.1], [TX + 100, 90, '#b070f0', 0.12], [TX + 124, 54, '#c890f8', 0.25]]) out.push(T.crystal(x, TG, h * 0.24, h, c, l));
        break;
      }
      case 'stronghold': {
        const logs = []; for (let y = TG - 300; y < TG; y += 26) logs.push(ln([[TX - 100, y], [TX + 100, y]], 3, 0.6));
        for (const d of [-1, 1]) out.push(sh(tube([[TX + d * 96, TG + 2, 16], [TX + d * 86, TG - 316, 13]]), '#5a3a1c', 'wood', { flow: -Math.PI / 2, line: 1 }));
        out.push(sh(T.trap(TX, TG - 310, TG, 82, 94), '#6e4a28', 'wood', { flow: 0, line: 1.1, lines: logs, sub: [sh([P(TX + 36, TG - 320, 1), P(TX + 110, TG - 320, 1), P(TX + 110, TG + 4, 1), P(TX + 44, TG + 4, 1)], '#4a3018', 'flat', { line: 0 })] }));
        out.push(sh([P(TX - 130, TG - 300, 1), [TX - 70, TG - 380], P(TX, TG - 470, 1), [TX + 70, TG - 380], P(TX + 130, TG - 300, 1), [TX, TG - 286]], '#b08a50', 'fur', { furLen: 1.3, flow: Math.PI / 2, line: 1.1, belly: 0.3 }));
        out.push(...T.flag(TX, TG - 466, 70, '#b8322a', { fw: 50, fh: 28 }), ...T.skull(TX, TG - 220, 34, { horns: true }), ...slit(TX - 50, TG - 110, 50, HOLE, { w: 9 }), ...slit(TX + 50, TG - 110, 50, HOLE, { w: 9 }));
        break;
      }
      case 'fortress': {
        for (const x of [TX - 90, TX - 30, TX + 30, TX + 90]) out.push(sh(tube([[x, TG + 2, 13], [x + 2, TG - 170, 12]], { flat0: true }), '#4a3a24', 'wood', { flow: -Math.PI / 2, line: 1 }));
        out.push(sh(tube([[TX - 100, TG - 40, 5], [TX + 100, TG - 140, 5]]), '#5a4a2a', 'wood', { line: 0.6 }), sh(tube([[TX + 100, TG - 40, 5], [TX - 100, TG - 140, 5]]), '#5a4a2a', 'wood', { line: 0.6 }));
        out.push(sh(box(TX - 124, TG - 184, TX + 124, TG - 164), '#8a6a40', 'wood', { flow: 0, line: 1 }));
        out.push(sh(box(TX - 96, TG - 330, TX + 96, TG - 182), '#7a5a34', 'wood', { flow: -Math.PI / 2, line: 1.1, lines: [-64, -32, 0, 32, 64].map(d => ln([[TX + d, TG - 330], [TX + d, TG - 182]], 2.4, 0.45)), sub: [sh(box(TX + 40, TG - 334, TX + 100, TG - 180), '#4e3a20', 'flat', { line: 0 })] }));
        out.push(...T.win(TX - 44, TG - 230, 14, 36, { cross: false }), ...T.win(TX + 44, TG - 230, 14, 36, { cross: false }));
        out.push(sh([P(TX - 150, TG - 310, 1), [TX - 80, TG - 390], P(TX, TG - 500, 1), [TX + 80, TG - 390], P(TX + 150, TG - 310, 1), [TX, TG - 296]], '#b8a060', 'fur', { furLen: 1.2, flow: Math.PI / 2, dens: 1.2, line: 1.1, belly: 0.25, lines: [ln([[TX - 140, TG - 314], [TX, TG - 304], [TX + 140, TG - 314]], 6, 0.8, { c: '#7a6030' })] }));
        out.push(sh(tube([[TX, TG - 490, 7], [TX, TG - 530, 3]]), '#4a3a24', 'wood', { line: 0.6 }), ...T.lizardTotem(TX + 120, TG, 150));
        break;
      }
      case 'conflux': {
        const t = std({ wall: '#eef0f6', shade: '#b0b8cc', light: '#ffffff', roof: '#7fd9ea', roofD: '#3a9ab8', roofM: 'gem', pointed: true, winC: '#dcc0ff', winLC: '#4a3a6a', win: [282, 352], roofH: 240 });
        out.push(sh(box(TX - 112, TG - 316, TX + 112, TG - 300), GOLD, 'gold', { line: 0.8 }));
        out.push(...T.island(TX + 118, t.apex[1] + 70, 34, '#ff8a3a'));
        break;
      }
      case 'cove': {
        std({ wall: '#dcc08a', shade: '#a8885a', light: '#eed8a8', roof: '#2a8a8a', roofD: '#16585a', finial: GOLD, win: [352], roofH: 200, flag: '#2a8a8a', flagL: 70 });
        out.push(sh(T.arch(TX, TG - 250, 32, 70), '#1e1610', 'cloth', { ao: 1.4, line: 1.2 }));
        out.push(sh(tube([[TX + 16, TG - 286, 16], [TX - 60, TG - 284, 14], [TX - 82, TG - 284, 16]], { flat0: true, flat1: true }), '#34343c', 'steel', { gloss: 0.9, line: 1 }), el(TX - 82, TG - 284, 5, 14, '#0e0e12', 'flat', { line: 0 }));
        out.push(sh(tube([[TX - 90, TG - 150, 6], [TX, TG - 136, 6], [TX + 90, TG - 150, 6]]), '#c8b080', 'leather', { line: 0.6 }));
        break;
      }
      case 'factory': {
        std({ wall: '#a8483a', shade: '#6e2a22', light: '#c26050', top: 'dome', roof: '#7a7e88', roofD: '#4a4e56', m: 'cloth', rh: 26, bw: 52, winC: '#ffd070', win: [282, 352], roofH: 90 });
        out.push(sh(tube([[TX + 66, TG - 340, 16], [TX + 66, TG - 480, 14]], { flat0: true, flat1: true }), '#5a5e66', 'steel', { gloss: 0.8, line: 1, lines: [ln([[TX + 44, TG - 420], [TX + 76, TG - 420]], 5, 0.7)] }), sh(box(TX + 40, TG - 500, TX + 80, TG - 474), '#3a3e46', 'steel', { line: 1 }));
        for (const [x, y, r] of [[TX + 64, TG - 520, 20], [TX + 84, TG - 552, 26], [TX + 110, TG - 590, 30]]) out.push(el(x, y, r, r * 0.8, '#c8c8d0', 'cloth', { op: 0.75, line: 0.6, lc: '#8a8a94' }));
        const rv = []; for (let x = TX - 80; x <= TX + 80; x += 32) rv.push([x, TG - 206, 4], [x, TG - 178, 4]);
        out.push(sh(box(TX - 94, TG - 216, TX + 94, TG - 168), '#7a7e88', 'steel', { gloss: 0.7, line: 1, glint: rv }), ...T.gear(TX - 20, TG - 250, 30, 9, '#b08a3a'));
        break;
      }
      case 'hive':
        out.push(...T.spire(TX, TG - 150, 330, 50, '#7a8a24', '#ffb020'));
        out.push(T.skep(TX, TG, 110, 230, '#d6aa42', { comb: true }), el(TX, TG - 60, 26, 24, '#1e1206', 'cloth', { ao: 1.4, line: 1 }));
        for (const [x, y] of [[TX - 50, TG - 150], [TX + 40, TG - 120]]) out.push(sh(T.hexPts(x, y, 16), '#ffc040', 'gem', { gloss: 0.8, line: 1, lc: '#5a3a08' }));
        for (const [x, y, l] of [[TX - 80, TG - 120, 30], [TX + 70, TG - 170, 40]]) out.push(sh(tube([[x, y, 9], [x, y + l, 8]]), '#f4c440', 'gem', { gloss: 0.9, line: 0.6, lc: '#8a5a08' }));
        break;
      case 'bastion': {
        for (const d of [-1, 1]) out.push(sh(tube([[TX + d * 100, TG + 2, 13], [TX + d * 70, TG - 250, 11]]), '#5a4428', 'wood', { flow: -Math.PI / 2, line: 1 }));
        out.push(sh(tube([[TX - 96, TG - 20, 6], [TX + 76, TG - 220, 6]]), '#4a3620', 'wood', { line: 0.7 }), sh(tube([[TX + 96, TG - 20, 6], [TX - 76, TG - 220, 6]]), '#4a3620', 'wood', { line: 0.7 }));
        out.push(sh(box(TX - 110, TG - 262, TX + 110, TG - 244), '#7a5a34', 'wood', { flow: 0, line: 1 }));
        out.push(sh(box(TX - 80, TG - 380, TX + 80, TG - 260), '#6e5434', 'wood', { flow: -Math.PI / 2, line: 1.1, lines: [-40, 0, 40].map(d => ln([[TX + d, TG - 380], [TX + d, TG - 260]], 2.4, 0.45)), sub: [sh(box(TX + 34, TG - 384, TX + 84, TG - 256), '#4a3620', 'flat', { line: 0 })] }));
        out.push(...T.win(TX, TG - 300, 14, 36, { cross: false }));
        out.push(sh([P(TX - 128, TG - 364, 1), [TX - 60, TG - 430], P(TX, TG - 500, 1), [TX + 60, TG - 430], P(TX + 128, TG - 364, 1), [TX, TG - 352]], '#5e8a3a', 'fur', { furLen: 1, flow: Math.PI / 2, dens: 1.2, line: 1.1, belly: 0.3 }));
        for (const d of [-1, 1]) out.push(sh(tube([[TX + d * 8, TG - 492, 6], [TX + d * 34, TG - 526, 4], [TX + d * 28, TG - 566, 2]]), '#e0d4b0', 'horn', { line: 0.8 }), sh(tube([[TX + d * 30, TG - 530, 3.5], [TX + d * 58, TG - 546, 1.5]]), '#e0d4b0', 'horn', { line: 0.7 }));
        out.push(el(TX - 70, TG - 20, 40, 16, '#5e8a3a', 'fur', { furLen: 0.6, line: 0.6 }));
        break;
      }
    }
    // бойницы на каменных башнях — башня стреляет
    if (['castle', 'rampart', 'tower', 'inferno', 'necropolis', 'conflux'].includes(f)) out.push(...slit(TX - 52, TG - 100, 56, '#1e1814', { w: 8, cross: true }), ...slit(TX + 52, TG - 100, 56, '#1e1814', { w: 8, cross: true }));
    return out;
  }

  /* ====================================================================== ров
     Вода по форме гекса со скруглёнными углами (соседние гексы рва сливаются в канал), без
     объёма — иначе стыки видны; берег — по левому и правому краю; поверх — приметы фракции. */
  function moatShapes(f) {
    const m = S[f].moat, out = [], rnd = rngOf(hash(f) + 53);
    const hexAt = k => { const h = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); h.push(P(MX + MW * k * Math.cos(a) / Math.cos(Math.PI / 6), MY + MR * k * Math.sin(a), 1)); } return h; };
    out.push(sh(hexAt(1.03), m.c, 'flat', { line: 0 }));
    // глубина — полоса темнее вдоль канала: у соседних гексов она сходится в одну ленту
    out.push(sh([P(MX - 44, MY - MR * 1.03, 1), P(MX + 44, MY - MR * 1.03, 1), [MX + 70, MY], P(MX + 44, MY + MR * 1.03, 1), P(MX - 44, MY + MR * 1.03, 1), [MX - 70, MY]], m.deep, 'flat', { line: 0, op: 0.5 }));
    if (m.lava) {
      for (const [x, y, rx, ry] of [[MX - 56, MY - 70, 40, 18], [MX + 50, MY + 60, 46, 20]]) out.push(chunk(x, y, rx, ry, m.crust, rnd, { gloss: 0.1, lines: [ln([[x - rx * 0.5, y], [x + rx * 0.4, y - 4]], 3, 0.6, { c: '#ff9a3a' })] }));
      out.push(sh(tube([[MX - 90, MY + 10, 3], [MX - 30, MY - 6, 4], [MX + 20, MY + 14, 3]]), '#ffe08a', 'flat', { line: 0 }), sh(tube([[MX + 10, MY - 110, 3], [MX + 60, MY - 96, 3]]), '#ffe08a', 'flat', { line: 0 }));
    } else if (m.honey) {
      out.push(sh(tube([[MX - 70, MY - 90, 6], [MX - 20, MY - 104, 7], [MX + 30, MY - 92, 6]]), '#fff0a0', 'flat', { line: 0, op: 0.7 }));
      for (const [x, y] of [[MX - 50, MY + 40], [MX + 56, MY - 30]]) out.push(sh(T.hexPts(x, y, 16), '#e8c060', 'leather', { gloss: 0.5, line: 0.8, lc: '#8a5a08' }));
    } else {
      // блики ряби
      for (const [x, y, l] of [[MX - 80, MY - 100, 40], [MX + 10, MY - 40, 34], [MX - 60, MY + 50, 30], [MX + 30, MY + 120, 36]]) out.push(sh(tube([[x, y, 3], [x + l * 0.5, y - 4, 3.4], [x + l, y, 3]]), tone(m.c, 0.5), 'flat', { line: 0, op: 0.8 }));
    }
    if (m.ice) for (const [x, y, rx] of [[MX - 50, MY - 50, 38], [MX + 44, MY + 60, 44]]) out.push(chunk(x, y, rx, rx * 0.45, m.ice, rnd, { m: 'gem', gloss: 0.8, lc: '#7a9ab8' }));
    if (m.lily) for (const [x, y] of [[MX - 64, MY - 30], [MX + 56, MY + 80]]) out.push(el(x, y, 22, 11, '#4a8a32', 'leather', { line: 0.6, gloss: 0.4 }), el(x + 6, y - 4, 6, 5, '#f4e0f0', 'cloth', { line: 0.4 }));
    if (m.reeds) for (const [x, y] of [[MX - MW + 26, MY + 20], [MX + MW - 30, MY - 60]]) for (let q = -1; q <= 1; q++) out.push(sh(tube([[x + q * 9, y + 40, 4], [x + q * 15, y - 40 + Math.abs(q) * 14, 2]]), m.reeds, 'leather', { line: 0.5 }), el(x + q * 15, y - 30 + Math.abs(q) * 14, 5, 12, '#6a4a2a', 'leather', { line: 0.4 }));
    if (m.bubbles) for (const [x, y] of [[MX - 10, MY + 30], [MX + 20, MY - 70], [MX - 40, MY + 100]]) out.push(el(x, y, 7, 6, tone(m.c, 0.5), 'gem', { gloss: 1, rim: 0, line: 0.4 }));
    if (m.mist) for (const [x, y, rx] of [[MX - 30, MY - 70, 110], [MX + 30, MY + 60, 100]]) out.push(el(x, y, rx, 30, m.mist, 'flat', { line: 0, op: 0.3 }));
    if (m.bones) out.push(sh(tube([[MX - 50, MY + 10, 6], [MX, MY + 22, 6]]), '#e4dcc6', 'horn', { line: 0.6 }), ...T.skull(MX + 44, MY - 30, 14));
    if (m.shards) for (const [x, y, h, i] of [[MX - 50, MY - 20, 46, 0], [MX + 44, MY + 70, 56, 1]]) out.push(T.crystal(x, y, h * 0.25, h, m.shards[i], (i - 0.5) * 0.3));
    if (m.sparkle) for (const [x, y] of [[MX - 70, MY - 90], [MX + 40, MY - 20], [MX - 30, MY + 70], [MX + 60, MY + 120]]) out.push(el(x, y, 5, 5, '#ffffff', 'gem', { gloss: 1.2, rim: 0, line: 0, glint: [[x, y, 14]] }));
    if (m.foam) for (const [x, y] of [[MX - 60, MY - 80], [MX + 40, MY + 10], [MX - 30, MY + 110]]) out.push(sh(tube([[x - 24, y, 4], [x, y - 8, 5], [x + 24, y, 4]]), '#eef6f8', 'flat', { line: 0 }));
    if (m.oil) for (const [x, y, rx] of [[MX - 30, MY - 50, 46], [MX + 36, MY + 80, 38]]) out.push(el(x, y, rx, rx * 0.35, '#7a5aa0', 'gem', { gloss: 1, rim: 0, line: 0, op: 0.4 }));
    if (m.stakes) for (const [x, y, lean] of [[MX - 48, MY - 10, -8], [MX + 4, MY + 16, 4], [MX + 52, MY - 6, 10]]) out.push(sh([P(x - 10, y, 1), P(x + lean, y - 76, 1), P(x + 10, y, 1)], m.stakes, f === 'factory' ? 'steel' : 'wood', { flow: -Math.PI / 2, line: 0.9 }), el(x, y, 15, 5, tone(m.c, 0.4), 'flat', { line: 0 }));
    return out;
  }

  /* ====================================================================== описание */
  function defOne(name, shapes, base) {
    const fr = frameOf(base) || { w: 313, h: 453, anchor: [157, 450] };
    V.def(name, { w: fr.w, h: fr.h, anchor: fr.anchor.slice(), parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }] });
  }
  function build(f) {
    const w = o => [...face(f, o), ...deco(f, o)];
    defOne('wall_ok@' + f, w({}), 'wall_ok');
    defOne('wall_dmg@' + f, [...face(f, { dmg: true, gap: [1, 3] }), ...deco(f, { dmg: true }), ...damage(f)], 'wall_dmg');
    defOne('wall_broken@' + f, rubble(f), 'wall_broken');
    defOne('gate@' + f, [...face(f, { gate: true }), ...deco(f, { gate: true }), ...gateShapes(f, false)], 'gate');
    defOne('gate_broken@' + f, [...face(f, { gate: true, gap: [2] }), ...deco(f, { gate: true }), ...gateShapes(f, true)], 'gate_broken');
    defOne('siege_tower@' + f, towerShapes(f), 'siege_tower');
    defOne('moat@' + f, moatShapes(f), 'moat');
  }
  /** Описать рисунки фракции, если их ещё нет. true — описаны. */
  function ensure(f) {
    if (done[f] !== undefined) return done[f];
    if (!T || !S[f] || !frameOf('wall_ok')) return false;
    try { build(f); done[f] = true; } catch (e) { done[f] = false; if (root.console) console.warn('siege ' + f + ': ' + e.message); }
    return done[f];
  }
  function ensureAll() { for (const f of FACTIONS) ensure(f); }
  /** Имя рисунка для участка осады: свой у фракции, если описан и рисованная графика включена; иначе общий. */
  function name(base, f) {
    if (!f || !V.VEC.on || !S[f]) return base;
    const n = base + '@' + f;
    return (V.has(n) || ensure(f)) && V.has(n) ? n : base;
  }
  /** Подсветка гексов рва — под цвет того, что в нём (вода, лава, мёд, туман). */
  const tints = {};
  function moatTint(f) {
    const m = S[f] && S[f].moat; if (!m || !V.VEC.on) return null;
    if (!tints[f]) { const c = parseInt(m.c.slice(1), 16); tints[f] = 'rgba(' + (c >> 16 & 255) + ',' + (c >> 8 & 255) + ',' + (c & 255) + ',0.38)'; }
    return tints[f];
  }

  /* ====================================================================== город за стенами
     Рисуется на слое земли задника (он не едет при панораме — город стоит ровно за стенами):
     рисунок города фракции на горизонте, за линией стен, в дымке — дальний план тонет в воздухе,
     и под светом дня (утро, вечер, ночь). geo: { x — середина линии стен, hz — горизонт (точки),
     size — гекс, w, h — размер поля, day, haze — цвет дымки }. */
  function paintTown(bg, f, geo) {
    if (!bg || !bg.ground || !V.VEC.on || typeof document === 'undefined') return;
    const nm = 'town_' + f; if (!V.has(nm)) return;
    const R = bg.s || 1, g = bg.ground, H = Math.max(56, Math.min(geo.hz * 1.08, geo.size * 5.4));   // высота города в точках
    const probe = V.render(nm, 1, false, null, null); if (!probe) return;
    const sc = H / (probe._anchor[1] - 2);   // точки на пиксель спрайта: от земли рисунка до его верха
    const cv = V.render(nm, sc * R, false, null, null);
    const ax = probe._anchor[0] * sc, ay = probe._anchor[1] * sc;
    const baseY = geo.hz + geo.size * 0.35, cx = Math.min(geo.w - probe._w * sc * 0.42, geo.x + geo.size * 2.4);
    // отдельный холст: дымка, низ растворяется в земле, свет дня — только по рисунку
    const tmp = document.createElement('canvas'); tmp.width = g.width; tmp.height = g.height;
    const t = tmp.getContext('2d');
    t.setTransform(R, 0, 0, R, 0, 0); t.imageSmoothingEnabled = true;
    t.drawImage(cv, cx - ax, baseY - ay, cv.width / R, cv.height / R);
    t.globalCompositeOperation = 'source-atop';
    t.fillStyle = geo.haze || 'rgba(214,224,236,1)'; t.globalAlpha = 0.22; t.fillRect(0, 0, geo.w, geo.h); t.globalAlpha = 1;
    t.globalCompositeOperation = 'destination-out';
    const fade = t.createLinearGradient(0, baseY - H * 0.24, 0, baseY); fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,0.9)');
    t.fillStyle = fade; t.fillRect(0, baseY - H * 0.24, geo.w, H * 0.3);
    t.globalCompositeOperation = 'source-over';
    const Tr = H3.Terrain;
    if (Tr && Tr.applyDaylight) {
      const lit = document.createElement('canvas'); lit.width = tmp.width; lit.height = tmp.height; const x = lit.getContext('2d');
      x.drawImage(tmp, 0, 0); x.setTransform(R, 0, 0, R, 0, 0); Tr.applyDaylight(x, geo.day || 4, 0, 0, geo.w, geo.h);
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(tmp, 0, 0);
      t.setTransform(1, 0, 0, 1, 0, 0); t.clearRect(0, 0, tmp.width, tmp.height); t.drawImage(lit, 0, 0);
    }
    // тень города на землю у подножия — чтобы он стоял, а не висел
    const gc = g.getContext('2d');
    gc.save(); gc.setTransform(R, 0, 0, R, 0, 0);
    const sh2 = gc.createRadialGradient(cx, baseY, 0, cx, baseY, probe._w * sc * 0.55);
    sh2.addColorStop(0, 'rgba(20,16,12,0.28)'); sh2.addColorStop(1, 'rgba(20,16,12,0)');
    gc.fillStyle = sh2; gc.beginPath(); gc.ellipse(cx, baseY, probe._w * sc * 0.55, geo.size * 0.5, 0, 0, Math.PI * 2); gc.fill();
    gc.setTransform(1, 0, 0, 1, 0, 0); gc.drawImage(tmp, 0, 0);
    gc.restore();
  }

  function init(kit) {
    if (T) return;
    T = kit;
    if (typeof document === 'undefined') ensureAll();   // node: тест проверит все описания
  }
  H3.SiegeView = { FACTIONS, PARTS, STYLE: S, ensure, ensureAll, name, moatTint, paintTown };
  // набор архитектуры приходит из vec_towns.js; в node файлы грузятся по алфавиту, и он появится позже
  if (H3.VTownKit) init(H3.VTownKit);
  else {
    let kit;
    Object.defineProperty(H3, 'VTownKit', { configurable: true, enumerable: true, get: () => kit,
      set: v => { kit = v; Object.defineProperty(H3, 'VTownKit', { value: v, writable: true, configurable: true, enumerable: true }); init(v); } });
  }
})(typeof window !== 'undefined' ? window : globalThis);
