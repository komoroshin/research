/* ============================================================================
   view/vec_doll.js — кукла героя с надетыми артефактами.

   Фигура героя в полный рост, анфас, в каноне 260×500 (дизайн-единицы, земля
   y=488, центр x=130). Облик — из тех же данных, что портрет (пол, кожа,
   волосы, борода, одежда класса, цвета фракции): таблица T ниже повторяет
   таблицу vec_portraits.js (там она закрыта в модуле).

   Кукла собирается слоями, каждый слой — отдельный рисунок того же канона
   (кэшируется движком сам по себе, поэтому снять/надеть — перерисовать один
   слой, а не всю фигуру):
     ниша фракции → спина плаща/крылья → тело → сапоги → подол мантии →
     доспех → ожерелье → плечи плаща → шлем (или убор класса) → оружие →
     кисти → перчатки → щит → кольца → «прочее» на поясе (иконкой).
   Рисунки названы по правилу теста «<спрайт>.<деталь>»:
     portrait_<класс>_<a|b>.doll / .skirt / .hands / .hat — тело героя,
     art_<id>.worn / .back / .worn2 — артефакт на теле (worn2 — кольцо на левой),
     ic_hero.niche — ниша-фон.
   Слой хранится в своей маленькой рамке вокруг рисунка (якорь = ноги куклы),
   чтобы холсты не были размером со всю фигуру.

   H3.VecDoll: PW×PH — панель в CSS-точках, layout() — где стоят ячейки слотов
   и куда от них тянется нить на фигуре, paint(canvas, hero) — нарисовать куклу.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, tone, ell, mapShapes } = K;

  /* ---------- цвет ---------- */
  const rgb = c => { c = c.replace('#', ''); const n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const A = (c, a) => { const [r, g, b] = rgb(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return '#' + x.map((v, i) => Math.max(0, Math.min(255, Math.round(v + (y[i] - v) * t))).toString(16).padStart(2, '0')).join(''); };
  const GOLD = '#d8a53a', STEEL = '#b7c0ca', BONE = '#e8dcc0', IRON = '#7e8792', WOOD = '#94602e', LEATHER = '#6a4424', WHITE = '#fbfaf4';

  /* ---------- канон ---------- */
  const CX = 130, GY = 488;
  const F = [62, 302];                 // правый кулак (слева на экране): в нём оружие
  const LF = [2 * CX - F[0], F[1]];    // левый кулак: держит щит
  const SHC = [210, 250];              // центр щита на левом предплечье

  /* ---------- простые формы ---------- */
  const S = (p, c, m, o) => Object.assign({ p, c, m: m || 'cloth' }, o || {});
  const E = (x, y, rx, ry, c, m, o) => Object.assign({ e: [x, y, rx, ry], c, m: m || 'cloth' }, o || {});
  const flat = (p, c, a, o) => Object.assign({ p, c: a === undefined ? c : A(c, a), m: 'flat', line: 0 }, o || {});
  const fe = (x, y, rx, ry, c, a) => ({ e: [x, y, rx, ry], c: a === undefined ? c : A(c, a), m: 'flat', line: 0 });
  const T2 = (pts, o) => tube(pts, o);
  const hl = (p, a, w) => ({ p, w: w || 1.4, light: true, a: a || 0.7 });
  const dl = (p, a, w) => ({ p, w: w || 1.3, a: a || 0.5 });
  /** Штрих трубкой (концы тоньше): бровь, веко, губы, прядь. */
  function strokeP(pts, w, even) {
    const n = pts.length;
    return tube(pts.map((q, i) => { const t = i / (n - 1), k = even ? 1 : 0.4 + 0.6 * Math.sin(Math.PI * t); return [q[0], q[1], (q[2] || w) * k]; }));
  }
  const stroke = (pts, w, c, a, even) => ({ p: strokeP(pts, w, even), c: a === undefined ? c : A(c, a), m: 'flat', line: 0 });
  /** Зеркало относительно оси фигуры. */
  const mxv = x => 2 * CX - x;
  const mirP = pts => pts.map(q => P(mxv(q[0]), q[1], q[2]));
  const mir = list => mapShapes(list, (x, y) => [mxv(x), y], 1);
  const both = list => list.concat(mir(list));
  /** Симметричный контур: правая половина (сверху вниз), точки на оси сверху и снизу. */
  const symC = (half, top, bot) => [...(top ? [top] : []), ...half, ...(bot ? [bot] : []), ...mirP(half).reverse()];
  const rad = d => d * Math.PI / 180;
  const pol = (cx, cy, r, a, f) => P(cx + Math.cos(rad(a)) * r, cy + Math.sin(rad(a)) * r, f);
  function star(cx, cy, R, r, n, a0) { a0 = a0 === undefined ? -90 : a0; const out = []; for (let i = 0; i < n * 2; i++) out.push(pol(cx, cy, i % 2 ? r : R, a0 + i * 180 / n, 1)); return out; }
  /** Язык пламени: основание (x, y), высота h, ширина w, наклон lean. */
  const flameP = (x, y, h, w, lean) => [[x - w, y], [x - w * 0.8, y - h * 0.45], [x - w * 0.2 + lean * 0.5, y - h * 0.7], P(x + lean, y - h, 1), [x + w * 0.5 + lean * 0.3, y - h * 0.55], [x + w, y - h * 0.2], [x + w * 0.6, y + w * 0.3], [x - w * 0.4, y + w * 0.35]];
  /** Точки вдоль оружия: at(t, w) — t вдоль от кулака вверх, w поперёк (минус — наружу, от тела). */
  const D = [-0.12, -1], along = K.along(F, D), at = (t, w) => along(t, w || 0), atA = (t, w, f) => P(...at(t, w), f);

  /* ---------- слой: свой рисунок в тесной рамке, якорь — ноги куклы ---------- */
  function bbOf(list) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    const add = (x, y) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; };
    for (const s of list) { if (s.p) for (const q of s.p) add(q[0], q[1]); if (s.e) { add(s.e[0] - s.e[2], s.e[1] - s.e[3]); add(s.e[0] + s.e[2], s.e[1] + s.e[3]); } }
    return [x0, y0, x1, y1];
  }
  function layer(name, make) {
    if (V._defs[name]) return name;
    const list = [].concat(make()).flat(4).filter(Boolean);
    if (!list.length) return null;
    const [x0, y0, x1, y1] = bbOf(list), tx = Math.floor(x0) - 8, ty = Math.floor(y0) - 8;
    const shapes = mapShapes(list, (x, y) => [x - tx, y - ty], 1);
    V.def(name, { w: Math.ceil(x1 - tx) + 8, h: Math.ceil(y1 - ty) + 8, anchor: [CX - tx, GY - ty], parts: [{ kind: 'torso', pivot: [CX - tx, 250 - ty], shapes }] });
    return name;
  }

  /* ---------- облик героев: та же таблица, что у портретов (vec_portraits.js) ---------- */
  const SK = { fair: '#ecc3a0', light: '#f2d0b4', rosy: '#eebca0', tan: '#d49a6c', olive: '#c8905c', swarthy: '#b07a4e', brown: '#8a5634', dark: '#5e3a24', pale: '#eedad0',
    ghost: '#dcdcd2', grey: '#b8bcb4', vamp: '#aeb0b8', red: '#c8483a', orange: '#d87a3e', green: '#a8c080', elf: '#f2d4b8', lizard: '#6a8a3a' };
  const HR = { black: '#1e1612', dbrown: '#3a2616', brown: '#5a3a22', chest: '#7a4424', red: '#b04a1e', ginger: '#c8662a', blond: '#e2c070', white: '#ece8e0', grey: '#a8a49c', dgrey: '#6a6660' };
  const T = {
    knight_a: { f: 'castle', sex: 'm', age: 1, coarse: 0.3, skin: SK.fair, hair: HR.brown, hs: 'none', eye: '#4a78b0', bt: 0.5, gear: 'visor', g: { c: STEEL, c3: '#c0282a' }, wear: 'plate', w: { c: STEEL, trim: GOLD, cape: '#2c52b0' } },
    knight_b: { f: 'castle', sex: 'f', age: 0, skin: SK.light, hair: HR.blond, hs: 'swept', eye: '#3a78c0', mc: 0.3, wear: 'tabard', w: { c: STEEL, c2: '#2c52b0', c3: GOLD, trim: GOLD } },
    cleric_a: { f: 'castle', sex: 'f', age: 1, skin: SK.light, hair: '#c8a060', hs: 'fringe', eye: '#5a8ab0', mc: 0.4, gear: 'hood', g: { c: '#ece6da', c2: GOLD }, wear: 'robe', w: { c: '#ece6da', c2: '#d8d0c0', c3: GOLD, amulet: '#e03040' } },
    cleric_b: { f: 'castle', sex: 'f', age: 1, skin: SK.tan, hair: HR.red, hs: 'long', eye: '#3a6a3a', mc: 0.2, gear: 'mitre', g: { c: GOLD, c2: '#b02a2a' }, wear: 'robe', w: { c: '#a82a2a', c2: '#ece6da', c3: GOLD } },
    ranger_a: { f: 'rampart', sex: 'f', age: 0, skin: SK.elf, hair: HR.ginger, hs: 'fringe', eye: '#3a8a3a', ear: 'elf', mc: 0.2, gear: 'hood', g: { c: '#3e6a2c' }, wear: 'tunic', w: { c: '#7a5230', c2: '#5a3a22' }, prop: 'bow' },
    ranger_b: { f: 'rampart', sex: 'm', age: 1, skin: SK.swarthy, hair: HR.dbrown, hs: 'short', eye: '#5a4a20', ear: 'elf', beard: { s: 'full', c: HR.dbrown, len: 0.1 }, gear: 'hoodDown', g: { c: '#4a6a2c' }, wear: 'tunic', w: { c: '#6a6a2a', c2: '#4a3a1a' }, prop: 'bow' },
    druid_a: { f: 'rampart', sex: 'f', age: 1, skin: SK.elf, hair: HR.chest, hs: 'long', eye: '#6a7a2a', ear: 'elf', mc: 0.3, gear: 'wreath', g: { c: '#5a8a3a', c2: '#d04040' }, wear: 'robe', w: { c: '#6a7a3a', c2: '#c8b080', c3: '#a8904a' } },
    druid_b: { f: 'rampart', sex: 'm', age: 2, skin: SK.fair, hair: HR.white, hs: 'bald', eye: '#5a7a9a', brow: '#f4f0e8', beard: { s: 'long', c: '#e4e0d8', len: 1.0 }, gear: 'wreath', g: { c: '#4a7a30' }, wear: 'robe', w: { c: '#8a7a4a', c2: '#6a5a30', c3: '#c8b080' } },
    alchemist_a: { f: 'tower', sex: 'f', age: 0, skin: SK.light, hair: HR.brown, hs: 'bun', eye: '#6a4a2a', mc: 0.3, wear: 'apron', w: { c: '#7a4a2a', c2: '#d8d0c0' }, x: { goggles: 'eyes' } },
    alchemist_b: { f: 'tower', sex: 'm', age: 2, skin: SK.fair, hair: HR.grey, hs: 'ring', eye: '#4a6a8a', beard: { s: 'goatee', c: HR.grey, len: 0.1 }, mc: 0.3, wear: 'apron', w: { c: '#6a4a2a', c2: '#c8c0b0' }, x: { glasses: '#c8a040' } },
    wizard_a: { f: 'tower', sex: 'm', age: 1, skin: SK.fair, hair: HR.black, hs: 'short', eye: '#4a5a7a', bt: 0.3, beard: { s: 'full', c: HR.black, len: 0.5 }, gear: 'wizHat', g: { c: '#2c52b0', c2: '#f0d060', c3: '#f0d060' }, wear: 'robe', w: { c: '#2c52b0', c2: '#1a2e6a', c3: '#f0d060' } },
    wizard_b: { f: 'tower', sex: 'm', age: 2, skin: SK.dark, hair: HR.white, hs: 'short', eye: '#3a2a1a', brow: '#f0ece4', beard: { s: 'long', c: '#f0ece4', len: 0.9 }, gear: 'wideHat', g: { c: '#2a3e7a', c2: '#7ad0f0' }, wear: 'robe', w: { c: '#2c4a9a', c2: '#1a2a5a', c3: '#7ad0f0' } },
    demoniac_a: { f: 'inferno', sex: 'f', age: 0, skin: SK.red, hair: HR.black, hs: 'long', glow: '#ffb020', mc: 0.4, bt: 0.3, gear: 'horns', g: { c: BONE }, wear: 'plate', w: { c: '#4a3a3a', trim: '#b02a1a', cape: '#7a1a14' } },
    demoniac_b: { f: 'inferno', sex: 'm', age: 1, coarse: 0.7, skin: SK.orange, hair: HR.black, hs: 'bald', glow: '#ffc030', bt: 0.8, beard: { s: 'goatee', c: HR.black, len: 0.3 }, gear: 'horns', g: { c: '#e8d8b0', big: true }, wear: 'spiked', w: { c: '#4a3a3a', trim: '#b02a1a' } },
    heretic_a: { f: 'inferno', sex: 'm', age: 2, skin: SK.fair, hair: HR.grey, hs: 'none', glow: '#ff8a20', bt: 0.6, beard: { s: 'full', c: '#b8b4ac', len: 0.6 }, gear: 'coif', g: { c: '#8a929c' }, wear: 'robe', w: { c: '#7a1a14', c2: '#3a0e0a', c3: '#c8702a' } },
    heretic_b: { f: 'inferno', sex: 'm', age: 0, skin: SK.pale, hair: HR.dbrown, hs: 'fringe', glow: '#ff9a20', bt: 0.2, gear: 'hood', g: { c: '#5a3a2a' }, wear: 'robe', w: { c: '#5a1a14', c2: '#2a0e0a', c3: '#8a4a2a', amulet: '#ff7a20' } },
    deathknight_a: { f: 'necropolis', sex: 'm', age: 1, skin: SK.ghost, hair: HR.black, hs: 'none', eye: '#7a2020', bt: 0.6, gear: 'visor', g: { c: '#4a4a54', c2: '#8a8a94', c3: '#b01a1a' }, wear: 'plate', w: { c: '#3a3a44', trim: '#8a1a1a', cape: '#6a1010' } },
    deathknight_b: { f: 'necropolis', sex: 'm', age: 1, coarse: 0.2, skin: SK.vamp, hair: HR.black, hs: 'none', glow: '#ff3030', bt: 0.7, mc: -0.2, x: { fangs: true }, gear: 'hornHelm', g: { c: '#4a4a54', c2: '#8a8a94', c3: '#d8d0c0' }, wear: 'spiked', w: { c: '#34343c', trim: '#6a1010' } },
    necromancer_a: { f: 'necropolis', sex: 'f', age: 1, skin: '#e6e6de', hair: HR.black, hs: 'long', eye: '#40e070', glow: '#50f080', sclera: '#e8f0e0', bt: 0.2, gear: 'hood', g: { c: '#2a2a34', glow: '#40d070' }, wear: 'robe', w: { c: '#2a2a34', c2: '#141418', c3: '#4a8a5a' } },
    necromancer_b: { f: 'necropolis', sex: 'm', age: 2, skin: SK.grey, hair: HR.grey, hs: 'none', glow: '#50f080', sclera: '#d8e0d0', bt: 0.5, beard: { s: 'long', c: '#b0b0a8', len: 0.8 }, gear: 'hood', g: { c: '#4e2a72', c2: '#8a6ab0' }, wear: 'robe', w: { c: '#3a2250', c2: '#1a1024', c3: '#6a4a8a' } },
    overlord_a: { f: 'dungeon', sex: 'm', age: 1, coarse: 0.5, skin: SK.fair, hair: HR.black, hs: 'bald', eye: '#3a2a1a', bt: 0.8, beard: { s: 'full', c: HR.black, len: 0.3 }, x: { scar: [0.62, -0.5, 0.86, 0.3] }, wear: 'spiked', w: { c: '#3a4a6a', trim: '#b02a2a', cape: '#b02a2a' } },
    overlord_b: { f: 'dungeon', sex: 'm', age: 1, coarse: 0.3, skin: SK.brown, hair: HR.black, hs: 'pony', eye: '#2a1a0a', bt: 0.6, x: { paint: { k: 'bars', c: '#c02a2a' } }, wear: 'spiked', w: { c: '#50586a', trim: '#8a2a2a' } },
    warlock_a: { f: 'dungeon', sex: 'm', age: 2, skin: SK.pale, hair: HR.grey, hs: 'none', eye: '#6a4a8a', bt: 0.4, beard: { s: 'full', c: '#c8c4bc', len: 0.5 }, gear: 'hood', g: { c: '#6a3a8a', c2: '#c8a040' }, wear: 'robe', w: { c: '#5a2a7a', c2: '#2a1438', c3: '#c8a040', amulet: '#b050e0' } },
    warlock_b: { f: 'dungeon', sex: 'm', age: 0, skin: SK.light, hair: HR.black, hs: 'fringe', eye: '#6a3a8a', bt: 0.2, mc: 0.2, gear: 'hood', g: { c: '#8a5aaa' }, wear: 'robe', w: { c: '#6a3a8a', c2: '#2a1438', c3: '#b890d8' } },
    barbarian_a: { f: 'stronghold', sex: 'm', age: 1, coarse: 0.9, skin: SK.tan, hair: HR.black, hs: 'none', eye: '#3a2a1a', bt: 0.9, beard: { s: 'mous', c: HR.black, droop: 0.3 }, x: { scar: [0.0, -0.44, 0.24, 0.3] }, gear: 'wolf', g: { c: '#8a8278' }, wear: 'fur', w: { c: '#6a4a2a', c2: '#6a5a4a' } },
    barbarian_b: { f: 'stronghold', sex: 'f', age: 1, coarse: 0.3, skin: SK.fair, hair: HR.red, hs: 'braids', eye: '#3a6a3a', bt: 0.5, x: { paint: { k: 'bars', c: '#2a5ab0' } }, gear: 'hornHelm', g: { c: '#8a8f98', c3: BONE }, wear: 'fur', w: { c: '#5a3a22', c2: '#8a6a4a', necklace: 'bone' } },
    battlemage_a: { f: 'stronghold', sex: 'f', age: 1, coarse: 0.2, skin: SK.swarthy, hair: HR.black, hs: 'braids', eye: '#2a1a0a', bt: 0.4, x: { paint: { k: 'bars', c: '#c02a2a' } }, gear: 'skull', g: { c: BONE }, wear: 'fur', w: { c: '#5a3a22', c2: '#7a5a3a', necklace: 'claw' } },
    battlemage_b: { f: 'stronghold', sex: 'f', age: 2, skin: SK.fair, hair: '#c8c4bc', hs: 'long', eye: '#4a6a9a', x: { paint: { k: 'stripe', c: '#2a5ab0' } }, gear: 'skull', g: { c: BONE, horns: true }, wear: 'furCollar', w: { c: '#2a4a8a', c2: '#8a7a6a' } },
    beastmaster_a: { f: 'fortress', sex: 'm', age: 1, coarse: 0.6, skin: SK.olive, hair: HR.black, hs: 'none', eye: '#3a2a1a', bt: 0.5, beard: { s: 'full', c: HR.black, len: 0.4 }, gear: 'croc', g: { c: '#5a7a3a' }, wear: 'jacket', w: { c: '#6a4a2a' } },
    beastmaster_b: { f: 'fortress', sex: 'm', lizard: true, skin: SK.lizard, gear: 'lizardHood', g: { c: '#7a5a3a' }, wear: 'jacket', w: { c: '#5a4a2a' } },
    witch_a: { f: 'fortress', sex: 'f', age: 1, skin: SK.green, hair: HR.black, hs: 'long', eye: '#8a3aa0', mc: 0.4, bt: 0.2, wear: 'robe', w: { c: '#5a2a7a', c2: '#2a1438', c3: '#8ab040', amulet: '#80e040' }, prop: 'staff', propTop: 'crystal', propC: '#b070e0' },
    witch_b: { f: 'fortress', sex: 'm', age: 2, skin: SK.fair, hair: HR.grey, hs: 'none', eye: '#4a6a3a', beard: { s: 'long', c: '#c8c4bc', len: 0.7 }, gear: 'hood', g: { c: '#3e5a2c' }, wear: 'robe', w: { c: '#3e5a2c', c2: '#1e2a14', c3: '#8a7a4a' }, prop: 'staff', propTop: 'flame' },
    planeswalker_a: { f: 'conflux', sex: 'm', age: 0, skin: SK.swarthy, hair: HR.dbrown, hs: 'short', eye: '#2a4a6a', mc: 0.2, gear: 'circlet', g: { c: '#9adcf0' }, wear: 'crystal', w: { c: '#4aa0c0', c2: '#bff0ff' } },
    planeswalker_b: { f: 'conflux', sex: 'm', age: 2, skin: SK.fair, hair: HR.white, hs: 'long', eye: '#4a7a9a', beard: { s: 'full', c: '#e8e4dc', len: 0.5 }, gear: 'tiara', g: { c: '#bff0ff', c3: '#40a0e0' }, wear: 'crystal', w: { c: '#6ac8b0', c2: '#d8fff0' } },
    elementalist_a: { f: 'conflux', sex: 'm', age: 2, skin: SK.dark, hair: HR.white, hs: 'short', eye: '#3a2a1a', brow: '#f0ece4', beard: { s: 'full', c: '#f0ece4', len: 0.3 }, gear: 'elements', wear: 'robe', w: { c: '#8a4ab0', c2: '#3a1a50', c3: '#e0a0ff' } },
    elementalist_b: { f: 'conflux', sex: 'f', age: 0, skin: SK.light, hair: '#e8602a', hs: 'short', eye: '#c05a20', mc: 0.3, gear: 'flame', wear: 'robe', w: { c: '#2a70b8', c2: '#123a6a', c3: '#8ad8f8' }, prop: 'orbs' },
    captain_a: { f: 'cove', sex: 'm', age: 2, skin: SK.rosy, hair: HR.grey, hs: 'short', eye: '#3a6a9a', brow: '#d8d4cc', beard: { s: 'full', c: '#dcd8d0', len: 0.2 }, gear: 'tricorn', g: { c: '#22222a', c2: GOLD }, wear: 'coat', w: { c: '#23408a', c2: '#a82a2a', c3: GOLD } },
    captain_b: { f: 'cove', sex: 'm', age: 0, skin: SK.fair, hair: HR.black, hs: 'long', eye: '#3a2a1a', mc: 0.4, bt: 0.2, x: { patch: true, earring: true }, beard: { s: 'stub', c: HR.black }, gear: 'tricorn', g: { c: '#5a3a22', c2: '#c8a040', feather: '#e8e0d0' }, wear: 'coat', w: { c: '#a82a2a', c2: '#2a2a30', c3: GOLD } },
    navigator_a: { f: 'cove', sex: 'f', age: 1, skin: SK.dark, hair: HR.black, hs: 'braids', eye: '#2a1a0a', mc: 0.4, x: { earring: true }, gear: 'bandana', g: { c: '#2a5ab0' }, wear: 'vest', w: { c: '#6a4424', c2: '#e8e0d0', c3: GOLD, tie: '#2a5ab0' } },
    navigator_b: { f: 'cove', sex: 'f', age: 0, skin: SK.light, hair: HR.ginger, hs: 'long', eye: '#3a7a4a', mc: 0.5, x: { earring: true }, gear: 'bandana', g: { c: '#2a60c0' }, wear: 'vest', w: { c: '#3a6a3a', c2: '#e8e0d0', c3: '#c8a040' } },
    mercenary_a: { f: 'factory', sex: 'm', age: 1, coarse: 0.3, skin: SK.swarthy, hair: HR.dbrown, hs: 'short', eye: '#3a2a1a', bt: 0.6, mc: 0.1, beard: { s: 'stub', c: HR.dbrown }, x: { scar: [-0.1, -0.5, 0.2, 0.2] }, gear: 'brimHat', g: { c: '#6a4424', c2: '#3a2414' }, wear: 'jacket', w: { c: '#5a4030', kerchief: '#b02a2a' } },
    mercenary_b: { f: 'factory', sex: 'm', age: 1, coarse: 0.5, skin: SK.tan, hair: HR.black, hs: 'bald', eye: '#2a1a0a', bt: 0.5, beard: { s: 'goatee', c: HR.black, len: 0.15 }, gear: 'brimHat', g: { c: '#7a5a3a', c2: '#b02a2a' }, wear: 'jacket', w: { c: '#4a3a2a', kerchief: '#d8b030' } },
    artificer_a: { f: 'factory', sex: 'f', age: 1, skin: SK.fair, hair: HR.chest, hs: 'bun', eye: '#5a6a2a', mc: 0.3, x: { goggles: 'brow' }, wear: 'apron', w: { c: '#6a4424', c2: '#c8b8a0', pauldron: '#c07a3a' } },
    artificer_b: { f: 'factory', sex: 'm', age: 2, skin: SK.rosy, hair: HR.grey, hs: 'ring', eye: '#4a5a6a', brow: '#d0ccc4', beard: { s: 'mous', c: '#d0ccc4', droop: 0.2 }, x: { goggles: 'brow' }, wear: 'apron', w: { c: '#5a3a22', c2: '#a8a098', pauldron: '#c07a3a', both: true } },
    swarmlord_a: { f: 'hive', sex: 'm', age: 1, coarse: 0.4, skin: SK.tan, hair: HR.black, hs: 'shaved', eye: '#6a8a2a', bt: 0.7, gear: 'mask', g: { c: '#4a6a2a', c2: '#c8b060' }, wear: 'chitin', w: { c: '#3a4a26', c2: '#56702e' } },
    swarmlord_b: { f: 'hive', sex: 'm', age: 1, coarse: 0.3, skin: SK.dark, hair: HR.black, hs: 'none', eye: '#e0a020', bt: 0.5, gear: 'carapace', g: { c: '#3a5a2a', c2: '#a8c040' }, wear: 'chitin', w: { c: '#3a3a26', c2: '#6a6a30' } },
    pheromancer_a: { f: 'hive', sex: 'f', age: 0, skin: SK.light, hair: HR.red, hs: 'long', eye: '#8a6a1a', mc: 0.4, gear: 'antennae', g: { c: '#3a2a1a', c2: GOLD, c3: '#e8a030' }, wear: 'robe', w: { c: '#d8902a', c2: '#6a4010', c3: '#6a9a4a', necklace: 'amber' } },
    pheromancer_b: { f: 'hive', sex: 'f', age: 1, skin: SK.pale, hair: '#c8b088', hs: 'fringe', eye: '#6a8a3a', gear: 'hood', g: { c: '#6a9a4a', c2: '#c8a020' }, x: { lens: '#e8b020' }, wear: 'robe', w: { c: '#4a6a30', c2: '#1e2a14', c3: '#c8a020' } },
    huntsman_a: { f: 'bastion', sex: 'm', age: 2, skin: SK.rosy, hair: HR.grey, hs: 'none', eye: '#4a6a3a', beard: { s: 'full', c: '#c8c4bc', len: 0.5 }, gear: 'hood', g: { c: '#3e6a2c' }, wear: 'furCollar', w: { c: '#5a4a2a', c2: '#8a6a4a' }, prop: 'quiver' },
    huntsman_b: { f: 'bastion', sex: 'f', age: 0, skin: SK.fair, hair: HR.red, hs: 'braid', eye: '#4a7a3a', bt: 0.3, mc: 0.2, x: { scar: [0.7, 0.1, 0.9, 0.5] }, gear: 'headband', g: { c: '#6a4424' }, wear: 'furCollar', w: { c: '#6a4a2a', c2: '#9a7a5a' }, prop: 'quiver' },
    totemist_a: { f: 'bastion', sex: 'f', age: 1, skin: SK.tan, hair: HR.dbrown, hs: 'long', eye: '#3a2a1a', x: { paint: { k: 'totem', c: '#f0e8d8' } }, wear: 'tunic', w: { c: '#8a6a44', c2: '#5a3a22', necklace: 'claw' } },
    totemist_b: { f: 'bastion', sex: 'm', age: 2, skin: SK.olive, hair: HR.grey, hs: 'none', eye: '#3a2a1a', beard: { s: 'long', c: '#b8b4ac', len: 0.6 }, x: { paint: { k: 'chin', c: '#c03a2a' } }, gear: 'antlerHood', g: { c: '#6a4a2a', c3: '#e0d0b0' }, wear: 'robe', w: { c: '#7a5a34', c2: '#3a2a14', c3: '#c8a060' }, prop: 'staff', propTop: 'totem' },
  };

  /* ======================= тело героя ======================= */
  const HX = 130, HY = 74;                 // центр лица; голова 44…104
  const EYE = [120.5, 139.5];
  /** Опора лица: половина контура (правая), подбородок. */
  function faceOf(o) {
    const fem = o.sex === 'f', cr = o.coarse || 0;
    const half = fem ? [[137, 45.5], [148, 51], [153, 64], [153, 80], [147.5, 93], [138.5, 101.5]]
      : [[138, 44.5], [150, 50], [155, 64], [155 + cr, 81], [150 + cr * 2.5, 95], [141 + cr * 2, 103]];
    return symC(half, [130, 43], [130, fem ? 104 : 105 + cr * 2]);
  }
  function head(o) {
    const out = [], sk = o.skin, fem = o.sex === 'f', age = o.age || 0, dk = tone(sk, -0.72);
    if (o.lizard) return lizardHead(o);
    // уши
    if (o.ear === 'elf') out.push(...both([S([[108, 66], [95, 52, 1], [100, 70], [106, 86]], sk, 'skin', { line: 0.8 })]));
    else out.push(...both([E(106, 77, 4.6, 8, sk, 'skin', { line: 0.8, lines: [dl([[106, 72], [104.5, 78], [106, 83]], 0.4, 1)] })]));
    const sub = [];
    // румянец и тень под волосами
    sub.push(fe(117.5, 86, 5.5, 3.2, '#d04838', fem ? 0.2 : 0.1), fe(142.5, 86, 5.5, 3.2, '#d04838', fem ? 0.2 : 0.1));
    sub.push(flat([[100, 40], [160, 40], [160, 58], [130, 62], [100, 58]], dk, 0.12));
    // глаза
    const bt = o.bt || 0;
    for (const ex of EYE) {
      const inner = ex < CX ? 1 : -1;   // к переносице
      sub.push(fe(ex, 75.6, 4.9, 3, o.sclera || '#f6f1e8'));
      if (o.glow) sub.push(fe(ex, 75.6, 6.5, 4.5, o.glow, 0.35));
      sub.push(E(ex, 75.7, 2.7, 2.9, o.glow || o.eye || '#3a2a1a', 'gem', { line: 0, glint: [[ex - 0.9, 74.6, 1.2]] }));
      if (!o.glow) sub.push(fe(ex, 75.7, 1.1, 1.3, '#0a0806', 0.85));
      sub.push(stroke([[ex - 5.4, 74.8], [ex, 72.3], [ex + 5.4, 74.6]], fem ? 2.3 : 1.7, dk, 0.95, true));
      if (fem) sub.push(stroke([[ex - inner * 5, 74.4], [ex - inner * 7.4, 72.6]], 1.4, dk, 0.9));
      sub.push(stroke([[ex - 4, 78.4], [ex + 4, 78.4]], 0.8, dk, 0.25));
      // бровь: внутренний край ниже у суровых
      const bw = (fem ? 1.9 : 2.8) * (age === 2 ? 1.2 : 1);
      sub.push(stroke([[ex - inner * 6, 68.6 - bt * 0.6], [ex, 66.6], [ex + inner * 5.5, 67.6 + bt * 2.2]], bw, o.brow || o.hair || '#3a2414', 0.95));
      if (age === 2) sub.push(stroke([[ex - inner * 7, 77], [ex - inner * 9, 79.5]], 0.9, dk, 0.4));
    }
    if (age >= 1) sub.push(stroke([[122, 58], [130, 57], [138, 58]], 0.9, dk, age === 2 ? 0.35 : 0.18));
    // нос
    sub.push(flat([[130.5, 76], [134, 86], [132, 89.6], [127.2, 89]], dk, 0.17), fe(127.3, 88.8, 1.7, 1.05, dk, 0.55), fe(132.7, 88.8, 1.7, 1.05, dk, 0.55),
      fe(129.4, 81.5, 1.2, 3.6, '#ffffff', 0.2));
    // рот
    const lip = fem ? mix(sk, '#b8303e', 0.55) : mix(sk, '#a04a40', 0.3);
    if (fem) sub.push(fe(130, 97.2, 4.4, 1.9, lip, 0.95), fe(130, 94.9, 4.8, 1.3, tone(lip, -0.2), 0.9));
    sub.push(stroke([[124.4, 95.2], [127.5, 96], [130, 95.7], [132.5, 96], [135.6, 95.2]], fem ? 1.5 : 1.8, tone(lip, -0.65), 0.9));
    if (!fem) sub.push(stroke([[127, 99.5], [133, 99.5]], 1.2, dk, 0.18));
    if (o.x && o.x.scar) sub.push(stroke([[141, 66], [144, 76], [145, 86]], 1.4, '#9a3a30', 0.6));
    if (o.x && o.x.paint) sub.push(...(o.x.paint.k === 'chin' ? [flat([[124, 99], [136, 99], [134, 105], [126, 105]], o.x.paint.c, 0.8)]
      : [flat([[112, 80], [124, 81], [124, 84], [112, 84]], o.x.paint.c, 0.75), flat([[136, 81], [148, 80], [148, 84], [136, 84]], o.x.paint.c, 0.75)]));
    out.push(S(faceOf(o), sk, 'skin', { sub, lc: tone(sk, -0.78), id: 'face' }));
    if (o.x && o.x.patch) out.push(E(139.5, 75.5, 6, 5, '#1a1410', 'leather', { line: 0.6 }), stroke([[134, 70], [150, 62]], 1.4, '#1a1410', 1, true), stroke([[134, 72], [108, 62]], 1.4, '#1a1410', 1, true));
    if (o.x && (o.x.goggles || o.x.glasses)) {
      const gy = o.x.goggles === 'brow' ? 60 : 75.5, gc = o.x.glasses || '#8a6a3a';
      out.push(stroke([[104, gy], [156, gy]], 3, '#3a2a1a', 1, true));
      for (const ex of EYE) out.push(E(ex, gy, 6.5, 5.5, gc, 'gold', { line: 0.6, sub: [E(ex, gy, 4.6, 3.8, '#9ad0e0', 'gem', { line: 0, glint: [[ex - 1.5, gy - 1.5, 1.6]] })] }));
    }
    if (o.x && o.x.earring) out.push(E(106, 88, 2, 2, GOLD, 'gold', { line: 0.4 }), E(154, 88, 2, 2, GOLD, 'gold', { line: 0.4 }));
    return out;
  }
  function lizardHead(o) {
    const sk = o.skin, out = [];
    out.push(S(symC([[142, 44], [154, 52], [158, 66], [155, 84], [148, 100], [140, 110]], [130, 40], [130, 113]), sk, 'skin', { tex: 'scale', texSize: 0.4,
      sub: [fe(130, 104, 10, 6, '#e0d8a0', 0.35), fe(126.5, 104, 1.5, 1.1, '#1a1a0a', 0.8), fe(133.5, 104, 1.5, 1.1, '#1a1a0a', 0.8), stroke([[120, 110], [130, 112], [140, 110]], 1.2, '#1a1a0a', 0.5)] }));
    for (const ex of [117, 143]) out.push(E(ex, 68, 6, 5, '#e0a020', 'gem', { line: 0.6, sub: [fe(ex, 68, 1.3, 4.4, '#100a04')], glint: [[ex - 1.5, 66.5, 1.5]] }));
    out.push(...both([S([[140, 44], [150, 36, 1], [148, 50]], tone(sk, -0.2), 'horn', { line: 0.6 })]));
    return out;
  }
  /* ---------- волосы: за головой (до шеи) и поверх лица ---------- */
  function hairBack(o) {
    const hc = o.hair, hs = o.hs, fem = o.sex === 'f';
    if (o.lizard) return [];
    if (hs === 'long' || (fem && (hs === 'fringe' || hs === 'swept'))) return [S(symC([[150, 40], [163, 58], [167, 88], [169, 122], [166, 150, 1], [152, 146], [148, 120]], [130, 33], [130, 118]), hc, 'fur', { furLen: 0.9, flow: Math.PI / 2 })];
    if (hs === 'pony') return [S(T2([[140, 46, 16], [158, 76, 14], [164, 112, 10], [160, 140, 4]]), hc, 'fur', { furLen: 0.8, flow: Math.PI / 2 })];
    if (hs === 'bun') return [E(130, 36, 13, 10, hc, 'fur', { furLen: 0.6, flow: 0 })];
    return [];
  }
  function hairFront(o) {
    const hc = o.hair, hs = o.hs === 'none' ? 'short' : o.hs, fem = o.sex === 'f', out = [];
    if (o.lizard || hs === 'bald') return out;
    const fur = { furLen: 0.5, flow: Math.PI / 2 };
    if (hs === 'ring') return both([S([[103, 62], [109, 58], [111, 76], [108, 88], [102, 80]], hc, 'fur', fur)]);
    const low = hs === 'fringe' ? 9 : hs === 'swept' ? 4 : 0;
    const cap = symC([[145, 38.5], [155.5, 49], [159.5, 64], [158.5, 78, 1], [153.5, 69], [149, 58 + low * 0.6], [140, 54.5 + low]], [130, 32.5], [130, 53.5 + low]);
    if (hs === 'shaved') return [flat(cap, hc, 0.4)];
    out.push(S(cap, hc, 'fur', Object.assign({ lines: [dl([[130, 36], [128, 52 + low]], 0.3, 1)] }, fur)));
    if (hs === 'swept') out.push(S([[120, 44], [146, 46], [155, 62], [146, 58], [132, 58], [118, 54]], hc, 'fur', fur));
    if (hs === 'fringe') out.push(stroke([[118, 58], [120, 64]], 2, tone(hc, -0.5), 0.5), stroke([[130, 58], [130, 64.5]], 2, tone(hc, -0.5), 0.5), stroke([[142, 58], [140, 64]], 2, tone(hc, -0.5), 0.5));
    if (hs === 'long' || (fem && (hs === 'fringe' || hs === 'swept'))) out.push(...both([S(T2([[155, 58, 10], [159, 92, 12], [161, 126, 10], [158, 146, 4]]), hc, 'fur', fur)]));
    if (hs === 'braids' || hs === 'braid') {
      const br = [S(T2([[154, 70, 11], [158, 102, 10], [157, 134, 9], [154, 162, 6]]), hc, 'fur', Object.assign({ lines: [0, 1, 2, 3, 4].map(i => dl([[151, 84 + i * 16], [161, 90 + i * 16]], 0.45, 1.2)) }, fur)),
        E(154.5, 160, 4.5, 3, '#c8a040', 'gold', { line: 0.5 })];
      out.push(...(hs === 'braids' ? both(br) : br));
    }
    return out;
  }
  function beard(o) {
    const b = o.beard; if (!b || o.lizard) return [];
    const c = b.c, L = (b.len || 0.2) * 44, dr = (b.droop || 0) * 10, out = [];
    const must = () => S(symC([[135, 89.6], [142, 90], [147, 95], [148.5, 101 + dr, 1], [142, 97.6], [135, 95.8]], [130, 90], [130, 95.2]), c, 'fur', { furLen: 0.4, flow: Math.PI / 2 });
    const ring = LL => [[153, 72], [155.5, 86], [151.5, 99], [144, 110 + LL * 0.6], [136, 115 + LL * 0.9], [130, 117 + LL], [124, 115 + LL * 0.9], [116, 110 + LL * 0.6], [108.5, 99], [104.5, 86], [107, 72], [111, 83], [118, 90.5], [124, 92.5], [130, 92.2], [136, 92.5], [142, 90.5], [149, 83]];
    if (b.s === 'full' || b.s === 'long') {
      out.push(S(ring(L), c, 'fur', { furLen: 0.8, flow: Math.PI / 2, lines: [dl([[130, 100], [130, 112 + L]], 0.3, 1.2)] }));
      out.push(stroke([[125, 96.5], [130, 97.2], [135, 96.5]], 1.8, '#2a1410', 0.75), must());
    } else if (b.s === 'goatee') {
      out.push(S(symC([[134.5, 98.5], [136.5, 106], [134, 114 + L * 0.8]], [130, 98], [130, 118 + L]), c, 'fur', { furLen: 0.5, flow: Math.PI / 2 }), must());
    } else if (b.s === 'mous') out.push(must());
    else if (b.s === 'stub') out.push(flat(ring(0), c, 0.28));
    return out;
  }
  /* ---------- одежда класса ---------- */
  const TORSO = (hem, fl, fem) => symC(fem
    ? [[140, 124], [155, 128], [169, 136], [175, 150], [173, 172], [164, 204], [160, 232], [165, 256], [168 + fl * 0.6, (256 + hem) / 2], [171 + fl, hem, 1], [152, hem + 3]]
    : [[141, 124], [158, 128], [174, 136], [181, 150], [180, 170], [173, 200], [166, 236], [168, 258], [170 + fl * 0.6, (258 + hem) / 2], [172 + fl, hem, 1], [152, hem + 3]], [130, 126.5], [130, hem + 1]);
  const ARM = (w, fem) => { const k = fem ? 0.88 : 1; return T2([[93, 146, 30 * k * w], [82, 186, 26 * k * w], [72, 224, 23 * k * w], [66, 258, 20 * k * w], [64, 284, 18 * k * w]], { flat1: true }); };
  function legs(c, m, shoe) {
    const leg = S(T2([[113, 254, 38], [110, 316, 32], [108, 372, 27], [106, 446, 21]], { flat0: true }), c, m || 'cloth', { lines: [dl([[102, 368], [114, 372]], 0.4)] });
    const foot = S([[94, 436], [118, 436], [120, 460], [118, 476], [110, 488.5, 1], [78, 488.5, 1], [74, 481], [86, 470], [94, 458]], shoe || '#4a3020', 'leather', { lines: [dl([[76, 482], [108, 482]], 0.4)] });
    return both([leg]).concat(both([foot]));
  }
  const belt = (c, buckle, y) => { y = y || 236; return S([[95, y], [165, y], [166, y + 12], [94, y + 12]], c || LEATHER, 'leather', { sub: [S([P(124, y - 1, 1), P(136, y - 1, 1), P(136, y + 13, 1), P(124, y + 13, 1)], buckle || GOLD, 'gold')] }); };
  const neck = (sk) => S(T2([[130, 92, 21], [130, 132, 25]], { flat1: true }), sk, 'skin', { sub: [flat([[110, 92], [150, 92], [150, 108], [130, 112], [110, 108]], tone(sk, -0.8), 0.25)] });
  const wrist = sk => both([S(T2([[65, 276, 15], [62.5, 296, 14]]), sk, 'skin', { line: 0.8 })]);
  const CLOTH = {
    robe(o, w, fem) {   // верх мантии; подол — отдельным слоем поверх сапог
      const c = w.c, c2 = w.c2 || tone(c, -0.4), c3 = w.c3 || GOLD;
      return [
        ...legs(tone(c2, -0.1), 'cloth', '#3a2818'),
        S(TORSO(262, 0, fem), c, 'cloth', { sub: [S([[125, 120], [135, 120], [135, 270], [125, 270]], c3, o.wear === 'robe' ? 'cloth' : 'gold', { line: 0.6 })], lines: [dl([[112, 150], [116, 230]], 0.3), dl([[148, 150], [144, 230]], 0.3)] }),
        ...both([S(T2([[93, 146, 30], [82, 190, 27], [74, 230, 28], [67, 270, 38]], { flat1: true }), c, 'cloth', { belly: 0.3, lines: [dl([[80, 200], [72, 262]], 0.35)],
          sub: [S([[40, 262], [100, 262], [100, 290], [40, 290]], c3, 'cloth', { line: 0.5 })] })]),
        ...wrist(o.skin),
        S(symC([[140, 122], [150, 128], [142, 150]], [130, 120], [130, 160]), c2, 'cloth', { line: 0.8 }),
        o.w.amulet ? E(130, 150, 5, 6, o.w.amulet, 'gem', { line: 0.6, glint: [[128.5, 148, 1.6]] }) : null,
      ];
    },
    mail(o, w, fem) {   // латник: кольчуга до колен, табард цветом рода, кольчужные рукава
      const mc = w.c || STEEL, tab = w.cape || w.c2 || w.trim || '#2c52b0', trim = w.trim || w.c3 || GOLD, dark = tone(mc, -0.35);
      return [
        ...legs(dark, 'mail', '#3a3a40'),
        S(TORSO(334, 6, fem), mc, 'mail'),
        ...both([S(ARM(1, fem), mc, 'mail'), S(T2([[65, 268, 21], [64, 286, 20]], { flat0: true, flat1: true }), '#5a3a22', 'leather')]),
        S(symC([[146, 126], [158, 134], [158, 200], [155, 238], [160, 344, 1], [140, 348]], [130, 138], [130, 346]), tab, 'cloth', { belly: 0.25,
          sub: [S([[0, 332], [260, 332], [260, 360], [0, 360]], trim, 'gold', { line: 0 }), S(star(130, 188, 14, 5, 4), trim, 'gold', { line: 0.6 })], lines: [dl([[138, 246], [144, 340]], 0.35), dl([[122, 246], [116, 340]], 0.35)] }),
        belt('#3a2818', trim),
        ...wrist(o.skin),
      ];
    },
    tunic(o, w, fem, hem) {
      const c = w.c, c2 = w.c2 || tone(c, -0.4);
      return [
        ...legs(c2, 'cloth', '#4a3020'),
        S(TORSO(hem || 316, 4, fem), c, 'cloth', { belly: 0.2, lines: [dl([[130, 128], [130, 150]], 0.5), dl([[116, 250], [110, 310]], 0.3), dl([[144, 250], [150, 310]], 0.3)] }),
        ...both([S(ARM(1, fem), c, 'cloth', { lines: [dl([[70, 226], [80, 228]], 0.35)] }), S(T2([[65, 272, 20], [64, 288, 19]], { flat0: true, flat1: true }), tone(c, -0.3), 'leather')]),
        belt(), ...wrist(o.skin),
      ];
    },
    fur(o, w, fem) {   // варвар: меховая безрукавка, голые руки
      const c = w.c, c2 = w.c2 || '#6a5a4a';
      return [
        ...legs(c, 'leather', '#3a2818'),
        S(TORSO(300, 8, fem), fem ? mix(c, '#000000', 0.2) : o.skin, fem ? 'leather' : 'skin', { lines: fem ? [] : [dl([[112, 170], [124, 176], [130, 172], [136, 176], [148, 170]], 0.35), dl([[130, 190], [130, 232]], 0.25)] }),
        ...both([S([[139, 124], [160, 130], [176, 142], [180, 156], [168, 172], [158, 220], [160, 262], [163, 300, 1], [146, 304, 1], [143, 240], [138, 160]], c2, 'fur', { furLen: 1.1, flow: Math.PI / 2 })]),
        ...both([S(ARM(1.08, fem), o.skin, 'skin'), S(T2([[65, 262, 20], [64, 288, 19]], { flat0: true, flat1: true }), '#5a3a22', 'leather', { lines: [dl([[56, 272], [74, 272]], 0.5)] })]),
        belt('#4a2a14', '#b8b8c0'),
        w.necklace ? S(T2([[114, 124, 3], [122, 142, 3], [130, 146, 3], [138, 142, 3], [146, 124, 3]]), '#6a4a2a', 'leather', { line: 0.5 }) : null,
        ...(w.necklace ? [120, 130, 140].map((x, i) => S([[x - 3, 142 + (i === 1 ? 4 : 0)], [x + 3, 142 + (i === 1 ? 4 : 0)], P(x, 156 + (i === 1 ? 4 : 0), 1)], BONE, 'horn', { line: 0.6 })) : []),
      ];
    },
    coat(o, w, fem) {   // капитан: долгополый кафтан, белая рубаха, золотые пуговицы
      const c = w.c, c2 = w.c2 || '#e8e0d0', c3 = w.c3 || GOLD;
      return [
        ...legs('#2a2a30', 'cloth', '#1e1a18'),
        S(TORSO(384, 14, fem), c, 'cloth', { belly: 0.25, sub: [S([[124, 120], [136, 120], [150, 250], [134, 400], [126, 400], [110, 250]], '#e8e0d0', 'cloth', { line: 0.6 })],
          lines: [dl([[118, 262], [106, 380]], 0.35), dl([[142, 262], [154, 380]], 0.35)] }),
        ...both([S([[122, 126], [110, 130], [106, 176], [118, 214], [124, 170]], c2, 'cloth', { line: 0.8 })]),
        ...[160, 184, 208].map(y => E(118, y, 2.6, 2.6, c3, 'gold', { line: 0.4 })), ...[160, 184, 208].map(y => E(142, y, 2.6, 2.6, c3, 'gold', { line: 0.4 })),
        ...both([S(ARM(1, fem), c, 'cloth'), S(T2([[65, 266, 21], [64, 286, 20]], { flat0: true, flat1: true }), c2, 'cloth', { sub: [S([[40, 262], [100, 262], [100, 268], [40, 268]], c3, 'gold', { line: 0 })] })]),
        belt('#2a1a10', c3, 240), ...wrist(o.skin),
      ];
    },
    vest(o, w, fem) {
      const c = w.c, c2 = w.c2 || '#e8e0d0', c3 = w.c3 || GOLD;
      return [
        ...legs('#3a3040', 'cloth', '#2a1c14'),
        S(TORSO(262, 0, fem), c2, 'cloth', { lines: [dl([[130, 128], [130, 250]], 0.3)] }),
        ...both([S(ARM(1, fem), c2, 'cloth', { lines: [dl([[76, 200], [70, 250]], 0.3)] }), S(T2([[65, 272, 20], [64, 288, 19]], { flat0: true, flat1: true }), c2, 'cloth')]),
        ...both([S([[134, 128], [158, 130], [170, 150], [166, 200], [160, 248, 1], [134, 254, 1], [140, 190]], c, 'leather', { line: 1, lines: [dl([[150, 140], [152, 240]], 0.3)] })]),
        ...[176, 200, 224].map(y => E(137, y, 2.2, 2.2, c3, 'gold', { line: 0.4 })),
        w.tie ? S([[124, 124], [136, 124], [134, 132], [140, 158, 1], [130, 150], [120, 158, 1], [126, 132]], w.tie, 'cloth', { line: 0.6 }) : null,
        belt('#3a2414', c3, 244), ...wrist(o.skin),
      ];
    },
    apron(o, w, fem) {
      const c = w.c, c2 = w.c2 || '#d8d0c0';
      return [
        ...CLOTH.tunic(o, { c: c2, c2: '#4a3a2a' }, fem, 300),
        S(symC([[146, 152], [152, 156], [156, 250], [162, 356, 1], [142, 360]], [130, 150], [130, 360]), c, 'leather', { belly: 0.2, lines: [dl([[120, 220], [140, 220]], 0.3)],
          sub: [S([[114, 270], [146, 270], [146, 300], [114, 300]], tone(c, -0.15), 'leather', { line: 0.6 })] }),
        stroke([[114, 152], [124, 124]], 2.5, '#3a2414', 1, true), stroke([[146, 152], [136, 124]], 2.5, '#3a2414', 1, true),
        w.pauldron ? S([[152, 132], [172, 134], [186, 150], [182, 168], [164, 160]], w.pauldron, 'gold', { lines: [dl([[160, 148], [182, 156]], 0.4)] }) : null,
        w.pauldron && w.both ? S([[108, 132], [88, 134], [74, 150], [78, 168], [96, 160]], w.pauldron, 'gold') : null,
      ];
    },
    jacket(o, w, fem) {
      const c = w.c;
      return [
        ...CLOTH.tunic(o, { c, c2: '#4a3a2a' }, fem, 292).map(s => s && s.m === 'cloth' && s.c === c ? Object.assign({}, s, { m: 'leather' }) : s),
        S(symC([[134, 126], [148, 130], [150, 146], [140, 146]], [130, 124], [130, 140]), w.kerchief || '#b02a2a', 'cloth', { line: 0.7 }),
        ...[170, 196, 222].map(y => E(130, y, 2.4, 2.4, '#c8b060', 'gold', { line: 0.4 })),
      ];
    },
    chitin(o, w, fem) {
      return [...CLOTH.tunic(o, { c: w.c, c2: tone(w.c, -0.4) }, fem, 300),
        ...[150, 176, 202].map((y, i) => S(symC([[146 - i * 2, y], [156 - i * 3, y + 8], [148 - i * 2, y + 20]], [130, y + 2], [130, y + 22]), w.c2 || '#56702e', 'horn', { gloss: 0.8 })),
        ...both([S([[76, 142], [92, 130], [108, 138], [104, 158], [84, 166]], w.c2 || '#56702e', 'horn', { gloss: 0.8 })])];
    },
    crystal(o, w, fem) {
      return [...CLOTH.tunic(o, { c: w.c, c2: tone(w.c, -0.45) }, fem, 316),
        ...both([S([[76, 146], [84, 122, 1], [96, 136], [104, 118, 1], [110, 144], [100, 162], [84, 164]], w.c2 || '#bff0ff', 'gem', { gloss: 1.1, line: 0.8 })]),
        S([[124, 170], [130, 156, 1], [136, 170], [130, 186, 1]], w.c2 || '#bff0ff', 'gem', { gloss: 1.2, line: 0.7 })];
    },
    furCollar(o, w, fem) {
      return [...CLOTH.tunic(o, { c: w.c, c2: tone(w.c, -0.4) }, fem, 316),
        S(T2([[92, 144, 22], [108, 128, 24], [130, 124, 24], [152, 128, 24], [168, 144, 22]]), w.c2 || '#8a6a4a', 'fur', { furLen: 1, flow: Math.PI / 2 })];
    },
  };
  const WEAR = { robe: 'robe', plate: 'mail', spiked: 'mail', tabard: 'mail', tunic: 'tunic', furCollar: 'furCollar', fur: 'fur', jacket: 'jacket', coat: 'coat', vest: 'vest', apron: 'apron', chitin: 'chitin', crystal: 'crystal' };
  /** Подол мантии (слой поверх сапог). */
  function skirtOf(o) {
    if (WEAR[o.wear] !== 'robe') return null;
    const w = o.w, c = w.c, c3 = w.c3 || GOLD;
    return [
      S(symC([[166, 234], [170, 270], [180, 340], [190, 418, 1], [162, 424], [144, 421]], [130, 234], [130, 420]), c, 'cloth', { belly: 0.3,
        lines: [dl([[112, 262], [100, 412]], 0.35), dl([[148, 262], [160, 412]], 0.35), dl([[130, 262], [130, 416]], 0.2)],
        sub: [S([[125, 230], [135, 230], [137, 430], [123, 430]], c3, 'cloth', { line: 0.5 }), S([[0, 406], [260, 406], [260, 440], [0, 440]], c3, 'cloth', { line: 0.5 })] }),
      S(T2([[95, 238, 13], [130, 240, 13], [165, 238, 13]]), w.c2 || tone(c, -0.4), 'cloth', { line: 0.8 }),
      S(T2([[140, 244, 7], [144, 270, 6], [142, 290, 5]]), w.c2 || tone(c, -0.4), 'cloth', { line: 0.7 }),
      E(136, 240, 6, 6, c3, 'gold', { line: 0.5 }),
    ];
  }
  function bodyOf(o) {
    const fem = o.sex === 'f', kind = WEAR[o.wear] || 'tunic';
    return [...hairBack(o), neck(o.skin), ...CLOTH[kind](o, o.w || { c: '#6a4a2a' }, fem), ...head(o), ...hairFront(o), ...beard(o)];
  }
  /** Кисти: правый кулак сжат (держит оружие), левый — ремень щита. */
  const FIST = [[53, 292], [63, 289.5], [71.5, 291.5], [75, 298], [74.5, 309], [68, 315.5], [57, 315.5], [51, 309], [50, 299]];
  function handsOf(o) {
    const sk = o.lizard ? o.skin : o.skin, dk = tone(sk, -0.7);
    const fist = S(FIST, sk, 'skin', { lc: tone(sk, -0.8), lines: [dl([[56.5, 297.5], [73, 298]], 0.45, 1.1), dl([[55, 304], [74, 304.5]], 0.45, 1.1), dl([[56, 310.5], [72, 311]], 0.45, 1.1)],
      sub: [flat([[48, 312], [76, 312], [76, 320], [48, 320]], dk, 0.2)] });
    const thumb = S([[75, 293], [76, 299.5], [70, 302], [60, 301.5], [57, 298.5], [61, 295.5], [68, 295.5]], sk, 'skin', { line: 0.8, lines: [dl([[60, 298.5], [66, 298.8]], 0.35, 0.9)] });
    return both([fist, thumb]);
  }
  const HOODED = { hood: 'cloth', croc: 'leather', lizardHood: 'leather', hideHood: 'leather', coif: 'mail', antlerHood: 'leather' };
  /** Изнанка капюшона — за головой (рисуется до тела, только без шлема). */
  function hoodBackOf(o) {
    const m = HOODED[o.gear]; if (!m || o.lizard) return null;
    const c = (o.g && o.g.c) || '#6a4a2a';
    return [S(symC([[149, 20], [168, 32], [179, 58], [181, 94], [177, 122], [186, 148, 1], [158, 152]], [130, 14], [130, 148]), c, m, { belly: 0.3,
      sub: [flat(symC([[143, 34], [157, 46], [163, 70], [164, 102], [160, 128]], [130, 30], [130, 132]), tone(c, -0.75), 0.75)] })];
  }
  /** Убор класса — пока не надет шлем. */
  function hatOf(o) {
    const g = o.g || {}, c = g.c || '#6a4a2a', gear = o.gear;
    const hood = (m) => [
      S(T2([[109, 126, 8], [104, 98, 9.5], [105, 66, 10.5], [115, 44, 11.5], [130, 37, 12], [145, 44, 11.5], [155, 66, 10.5], [156, 98, 9.5], [151, 126, 8]]), c, m || 'cloth', { lines: [dl([[108, 70], [116, 48], [130, 41], [144, 48], [152, 70]], 0.35)] }),
      S(symC([[146, 122], [166, 130], [180, 146], [170, 158], [150, 158]], [130, 120], [130, 164]), c, m || 'cloth', { belly: 0.35, lines: [dl([[112, 140], [130, 150], [148, 140]], 0.3)] }),
    ];
    const brimmed = (rx, cone) => [E(130, 52, rx, 9, c, 'cloth', { belly: 0.4 }), S(cone, c, 'cloth', { lines: [hl([[118, 40], [124, 10]], 0.4)] }),
      S(T2([[108, 48, 7], [130, 50, 7], [152, 48, 7]]), g.c2 || GOLD, g.c2 ? 'cloth' : 'gold', { line: 0.6 })];
    switch (gear) {
      case 'hood': case 'croc': case 'lizardHood': case 'hideHood': return hood(gear === 'hood' ? 'cloth' : 'leather');
      case 'coif': return hood('mail');
      case 'antlerHood': return [...hood('leather'), ...both([S(T2([[146, 36, 7], [158, 16, 5], [170, 4, 3]]), g.c3 || '#e0d0b0', 'horn', { line: 0.6 }), S(T2([[156, 20, 4], [166, 22, 2.5]]), g.c3 || '#e0d0b0', 'horn', { line: 0.5 })])];
      case 'wizHat': return brimmed(38, [[106, 50], [114, 30], [122, 8], [138, -6, 1], [134, 12], [144, 32], [154, 50]]);
      case 'wideHat': return brimmed(50, [[110, 50], [116, 28], [126, 6], [132, -8, 1], [136, 10], [144, 30], [150, 50]]);
      case 'mitre': return [S([[110, 58], [108, 30], [124, 8], [130, 0, 1], [136, 8], [152, 30], [150, 58]], c, 'gold', { sub: [S([[126, 0], [134, 0], [134, 60], [126, 60]], g.c2 || '#b02a2a', 'cloth', { line: 0 })] })];
      case 'horns': return both([S(T2([[146, 52, 10], [160, 38, 8], [168, 20, 5], [164, 6, 2]]), c, 'horn', { line: 0.8, lines: [dl([[152, 46], [158, 42]], 0.4), dl([[160, 34], [165, 28]], 0.4)] })]);
      case 'circlet': case 'tiara': return [S(T2([[103, 60, 5], [130, 55, 5], [157, 60, 5]]), GOLD, 'gold', { line: 0.6 }), E(130, 55, 4.5, 5, g.c3 || g.c || '#40a0e0', 'gem', { line: 0.5, glint: [[128.6, 53.4, 1.6]] })];
      case 'wreath': return [...[-4, -3, -2, -1, 1, 2, 3, 4].map(i => { const x = 130 + i * 6.5, y = 55 + Math.abs(i) * 1.6; return S(K.leaf([x, y], i < 0 ? rad(-150) : rad(-30), 12, 7).body, c, 'cloth', { line: 0.5 }); }),
        g.c2 ? E(122, 52, 2.8, 2.8, g.c2, 'gem', { line: 0.4 }) : null];
      case 'tricorn': return [S([[92, 50], [104, 30], [118, 36], [130, 26], [142, 36], [156, 30], [168, 50], [148, 44], [130, 48], [112, 44]], c, 'cloth', { lines: [{ p: [[96, 48], [112, 42], [130, 46], [148, 42], [164, 48]], w: 2.2, c: g.c2 || GOLD, a: 0.9 }] }),
        g.feather ? S(K.leaf([150, 34], rad(-50), 34, 10).body, g.feather, 'feather', { line: 0.5 }) : null];
      case 'bandana': return [S(symC([[146, 38], [158, 50], [159, 64], [150, 58], [140, 55]], [130, 32], [130, 54]), c, 'cloth'), S([[156, 58], [170, 66], [168, 82, 1], [160, 72]], c, 'cloth', { line: 0.8 })];
      case 'brimHat': return [E(130, 52, 44, 8, c, 'leather', { belly: 0.3 }), S([[110, 52], [112, 30], [122, 24], [130, 28], [138, 24], [148, 30], [150, 52]], c, 'leather'),
        S(T2([[110, 46, 6], [130, 47, 6], [150, 46, 6]]), g.c2 || '#3a2414', 'leather', { line: 0.5 })];
      case 'headband': return [S(T2([[102, 58, 6], [130, 54, 6], [158, 58, 6]]), c, 'leather', { line: 0.6 }), S([[156, 58], [166, 66], [162, 78, 1], [158, 66]], c, 'leather', { line: 0.6 })];
      case 'antennae': return both([S(T2([[140, 40, 3], [148, 20, 2.6], [158, 6, 2]]), g.c || '#3a2a1a', 'horn', { line: 0.4 }), E(159, 5, 4, 4, g.c3 || '#e8a030', 'gem', { line: 0.5 })]);
      case 'wolf': return [S(symC([[150, 36], [162, 50], [166, 80], [174, 120], [176, 150, 1], [160, 140], [156, 90], [152, 66], [140, 56]], [130, 24], [130, 54]), c, 'fur', { furLen: 1.1, flow: Math.PI / 2 }),
        ...both([S([[142, 30], [152, 12, 1], [156, 36]], c, 'fur', { furLen: 0.5 })]), S([[118, 40], [142, 40], [138, 58], [130, 64], [122, 58]], tone(c, -0.1), 'fur', { furLen: 0.6, sub: [fe(122, 46, 3, 2, '#1a1410'), fe(138, 46, 3, 2, '#1a1410')] })];
      case 'skull': return [S(symC([[142, 34], [156, 46], [158, 62], [148, 60], [140, 58]], [130, 28], [130, 56]), g.c || BONE, 'horn', { sub: [fe(122, 46, 4, 3.5, '#2a1a10', 0.8), fe(138, 46, 4, 3.5, '#2a1a10', 0.8)] }),
        g.horns ? both([S(T2([[150, 40, 8], [164, 30, 6], [172, 14, 3]]), BONE, 'horn', { line: 0.6 })]) : null];
      case 'mask': case 'carapace': return [S(symC([[146, 38], [158, 52], [160, 70], [150, 62], [140, 58]], [130, 30], [130, 56]), c, 'horn', { gloss: 0.9, lines: [dl([[130, 32], [130, 54]], 0.4)] })];
      default: return [];
    }
  }

  /* ======================= артефакты на теле ======================= */
  /* Как надетый артефакт выглядит на фигуре: вид по типу и краски по иконке (vec_icons.js).
     Незнакомый артефакт получает умолчание своего слота. */
  const WORN = {
    unicorn_helm: { k: 'helm', c: '#e8ecf2', band: '#c8ccd8', crest: 'horn' },
    skull_helmet: { k: 'skull' },
    magi_crown: { k: 'crown', c: '#4a6ae0' },
    thunder_helmet: { k: 'helm', c: '#aeb6c2', band: GOLD, crest: 'bolt' },
    helm_enlightenment: { k: 'helm', c: '#f2f2f6', band: GOLD, crest: 'rays' },
    centaur_axe: { k: 'axe' },
    blackshard: { k: 'sword', blade: '#4a3a66', guard: '#8a8a9a', pommel: '#a050e0', bladeLc: '#c080ff', bw: 12, len: 172, aura: '#a050e0' },
    gnoll_flail: { k: 'flail' },
    sword_hellfire: { k: 'sword', blade: '#f06a28', guard: '#3a2a2a', pommel: '#e04020', bladeLc: '#8a2010', bw: 13, len: 178, flame: true },
    ogre_club: { k: 'club' },
    titan_gladius: { k: 'sword', blade: '#b4dcff', bw: 18, len: 186, tip: 30, aura: '#b4dcff', gw: 50 },
    dwarven_shield: { k: 'heater', field: '#b8c0ca', fieldM: 'steel', rim: GOLD, charge: 'hammer' },
    gnoll_buckler: { k: 'buckler' },
    shield_yawning_dead: { k: 'heater', field: '#3c3a46', fieldM: 'steel', rim: '#8a8e98', rimM: 'steel', charge: 'skull' },
    ogre_targ: { k: 'targ' },
    sentinel_shield: { k: 'heater', field: '#eef0f4', fieldM: 'steel', rim: GOLD, charge: 'star' },
    petrified_breastplate: { k: 'plate', c: '#8a6444', m: 'wood' },
    rib_cage: { k: 'ribs' },
    basilisk_scales: { k: 'plate', c: '#48a048', m: 'leather', scale: true },
    armor_wonder: { k: 'plate', c: '#f2dcf0', trim: GOLD, gem: '#a050e0' },
    cyclops_tunic: { k: 'tunic', c: '#d8bc88' },
    titan_cuirass: { k: 'plate', c: '#3a64d0', trim: GOLD, star: true },
    cape_conjuring: { k: 'cape', c: '#3a5ad0', trim: '#4ad0f0' },
    cape_velocity: { k: 'cape', c: '#c8302a', trim: '#f0d040' },
    angel_wings: { k: 'wings' },
    necklace_swiftness: { k: 'neck', chain: '#d8dce4', pend: 'wing' },
    pendant_courage: { k: 'neck', pend: 'medal', gem: '#e03040' },
    necklace_bliss: { k: 'neck', pend: 'gem', gem: '#8ae8f8' },
    boots_speed: { k: 'boots', c: '#8a5a2e', wings: true },
    boots_polarity: { k: 'boots', c: '#8040b8', sole: '#2a1a3a', stars: '#f0e0ff' },
    ring_conjuring: { k: 'ring', gem: '#3a78e8' },
    ring_life: { k: 'ring', gem: '#3cc050' },
    ring_vitality: { k: 'ring', gem: '#e03040' },
    equestrian_gloves: { k: 'gloves', c: '#a07040' },
  };
  const BY_SLOT = { helm: { k: 'helm', c: STEEL, band: GOLD }, weapon: { k: 'sword' }, shield: { k: 'heater', field: '#2c52b0', rim: GOLD, charge: 'cross' },
    armor: { k: 'plate', c: STEEL, trim: GOLD }, cape: { k: 'cape', c: '#7a2a2a', trim: GOLD }, neck: { k: 'neck', pend: 'medal', gem: '#e03040' },
    boots: { k: 'boots', c: '#6a4424' }, ring: { k: 'ring', gem: '#e03040' }, misc: { k: 'misc' } };
  function specOf(id) { const a = H3.Artifacts && H3.Artifacts.get(id); return WORN[id] || (a && BY_SLOT[a.slot]) || { k: 'misc' }; }

  /* ---------- шлемы (голова: центр 130,74, макушка y=44) ---------- */
  const HELM = symC([[137, 36.5], [152, 42], [159.5, 56], [161, 74], [158.5, 95, 1], [150, 96, 1], [149, 76], [146, 64], [139, 60]], [130, 35], null);
  function helm(s) {
    const c = s.c || STEEL, band = s.band || GOLD, out = [];
    if (s.crest === 'rays') out.push(S(star(130, 44, 50, 30, 14), '#ffe07a', 'flat', { line: 0.8, lc: '#c89a2a' }), fe(130, 44, 36, 36, '#fff4c0', 0.5));
    out.push(S(HELM, c, 'steel', { lines: [hl([[112, 46], [130, 38.5], [148, 46]], 0.8, 1.8), dl([[106, 70], [110, 92]], 0.35), dl([[154, 70], [150, 92]], 0.35)],
      sub: [S(T2([[100, 62, 7], [115, 58, 7], [130, 57, 7], [145, 58, 7], [160, 62, 7]]), band, band === GOLD ? 'gold' : 'steel', { line: 0.6 })] }));
    out.push(S([[127.5, 57], [132.5, 57], [133.5, 85, 1], [126.5, 85, 1]], tone(c, -0.05), 'steel', { line: 0.8 }));
    out.push(...[104, 156].map(x => E(x, 82, 2.2, 2.2, band, band === GOLD ? 'gold' : 'steel', { line: 0.4 })));
    if (s.crest === 'horn') out.push(S([P(122.5, 42, 1), P(137.5, 42, 1), P(132, -4, 1)], '#fff4d8', 'horn', { gloss: 1.2, line: 0.9, lc: '#8a7a50',
      lines: [dl([[124, 32], [136, 28]], 0.5, 1.4), dl([[126, 20], [134.5, 17]], 0.5, 1.3), dl([[128, 9], [133, 7]], 0.5, 1.2)] }));
    if (s.crest === 'bolt') out.push(S([P(138, -6, 1), P(120, 18, 1), P(131, 18, 1), P(122, 42, 1), P(144, 12, 1), P(133, 12, 1), P(143, -6, 1)], '#ffd83a', 'gold', { gloss: 1.2, line: 0.8 }),
      ...both([S([[158, 52], [176, 40], [186, 30, 1], [180, 44], [170, 58]], '#e8ecf2', 'feather', { line: 0.6, texSize: 0.3 })]));
    if (s.crest === 'rays') out.push(E(130, 58, 4.5, 4.5, '#ffe07a', 'gem', { line: 0.5, glint: [[128.6, 56.6, 1.6]] }));
    return out;
  }
  function skullHelm() {
    return [
      ...both([S(T2([[108, 66, 8], [106, 82, 7], [110, 96, 5]]), BONE, 'horn', { line: 0.7 })]),
      S(symC([[140, 35], [154, 42], [160, 56], [160, 72], [154, 78], [146, 72], [140, 70]], [130, 32], [130, 69]), BONE, 'horn', { gloss: 0.6,
        lines: [dl([[124, 36], [128, 46], [124, 52]], 0.4, 1)],
        sub: [E(121, 60, 7, 6, '#1a0e0a', 'flat', { line: 0 }), E(139, 60, 7, 6, '#1a0e0a', 'flat', { line: 0 }), fe(121, 60, 3, 2.6, '#ff3020', 0.9), fe(139, 60, 3, 2.6, '#ff3020', 0.9),
          flat([[127, 66], [133, 66], [130, 71]], '#1a0e0a', 0.9)] }),
      ...both([S(T2([[148, 38, 8], [160, 26, 6], [164, 12, 3]]), '#d8ccb0', 'horn', { line: 0.6 })]),
    ];
  }
  function crown(s) {
    const c = s.c || '#4a6ae0';
    return [S([P(104, 64, 1), P(104, 36, 1), P(114, 48, 1), P(121, 26, 1), P(130, 44, 1), P(139, 26, 1), P(146, 48, 1), P(156, 36, 1), P(156, 64, 1)], c, 'steel', { gloss: 1.1,
      sub: [S([[90, 54], [170, 54], [170, 70], [90, 70]], GOLD, 'gold', { line: 0.6 })] }),
      ...[121, 139].map(x => E(x, 27, 3.2, 3.2, '#f0d040', 'gem', { line: 0.4 })), E(130, 60, 4, 4, '#e03040', 'gem', { line: 0.5, glint: [[128.8, 58.8, 1.4]] }),
      ...[112, 148].map(x => E(x, 61, 2.5, 2.5, '#f0d040', 'gem', { line: 0.4 }))];
  }
  /* ---------- оружие в правом кулаке, остриём вверх ---------- */
  const ang = Math.atan2(D[1], D[0]);
  function sword(s) {
    const L = s.len || 176, bw = s.bw || 12, g0 = 16, tip = s.tip || bw * 1.5, gw = s.gw || bw * 3.2, out = [];
    if (s.aura) out.push(flat(ell(...at(L * 0.6, 0), bw * 1.6, L * 0.42, 14, ang + Math.PI / 2), s.aura, 0.18));
    if (s.flame) out.push(flat(ell(...at(L * 0.6, 0), bw * 2.2, L * 0.46, 14, ang + Math.PI / 2), '#ff8a20', 0.2));
    out.push(S(T2([[...at(-20), 8], [...at(g0 + 2), 8]]), s.grip || '#5a3418', 'leather', { lines: [dl([at(-10, -4), at(-10, 4)], 0.5), dl([at(-4, -4), at(-4, 4)], 0.5), dl([at(9, -4), at(9, 4)], 0.5)] }));
    out.push(E(...at(-23), 6.5, 6.5, s.pommel || GOLD, s.pommel ? 'gem' : 'gold', { line: 0.8, glint: [[...at(-24, -2), 2]] }));
    out.push(S([atA(g0 + 3, -bw / 2, 1), atA(L - tip, -bw / 2, 1), atA(L, 0, 1), atA(L - tip, bw / 2, 1), atA(g0 + 3, bw / 2, 1)], s.blade || '#e2e8ee', 'steel',
      { gloss: 1.2, lc: s.bladeLc, lines: [dl([at(g0 + 10, 0.5), at(L - tip - 4, 0.5)], 0.4, 1.8), hl([at(g0 + 8, -bw * 0.26), at(L - tip, -bw * 0.26)], 0.85, 1.5)] }));
    if (s.flame) for (let i = 0; i < 5; i++) {
      const t = 50 + i * 26, side = i % 2 ? 1 : -1, B = at(t, side * bw * 0.4), l = K.leaf(B, ang + side * 0.5, 22 + (i % 3) * 5, 10);
      out.push(S(l.body, '#ff7a20', 'gem', { line: 0.6, lc: '#a02a0a', gloss: 0.6, sub: [flat(K.leaf(B, ang + side * 0.5, 13, 5).body, '#ffe070', 0.9)] }));
    }
    out.push(S([atA(g0 - 3, -gw / 2, 1), atA(g0 - 6, -gw / 2 - 4), atA(g0 + 4, -gw / 2 - 2, 1), atA(g0 + 4, gw / 2 + 2, 1), atA(g0 - 6, gw / 2 + 4), atA(g0 - 3, gw / 2, 1)], s.guard || GOLD, s.guard ? 'steel' : 'gold', { line: 0.9 }));
    return out;
  }
  function axe() {
    return [
      S(T2([[...at(-30), 10], [...at(60), 10], [...at(180), 9]]), WOOD, 'wood', { flow: ang, lines: [dl([at(-10, -5), at(-10, 5)], 0.5), dl([at(-2, -5), at(-2, 5)], 0.5)] }),
      S([atA(138, -3, 1), atA(126, -24), atA(114, -46, 1), atA(136, -54), atA(160, -55), atA(184, -48, 1), atA(172, -24), atA(166, -3, 1)], '#c6ced8', 'steel',
        { gloss: 1.2, lines: [hl([at(118, -45), at(136, -52), at(160, -53), at(180, -47)], 0.9, 2)] }),
      S(T2([[...at(134), 15], [...at(170), 15]], { flat0: true, flat1: true }), IRON, 'steel'),
      S([atA(144, 5, 1), atA(162, 26, 1), atA(158, 5, 1)], IRON, 'steel', { line: 0.8 }),
    ];
  }
  function flail() {
    const links = [[48, 222], [41, 218], [33, 220], [27, 227], [23, 236]];
    return [
      S(T2([[...at(-22), 10], [...at(66), 9]]), WOOD, 'wood', { flow: ang }),
      S(T2([[...at(60), 13], [...at(74), 13]], { flat0: true, flat1: true }), IRON, 'steel'),
      ...links.map(([x, y], i) => E(x, y, i % 2 ? 3 : 4, i % 2 ? 4 : 3, IRON, 'steel', { line: 0.7 })),
      S(star(20, 256, 23, 13, 10), IRON, 'steel', { line: 0.9 }),
      E(20, 256, 15, 15, '#9aa2ac', 'steel', { gloss: 1.2, glint: [[15, 250, 4]] }),
    ];
  }
  function club() {
    const out = [S(T2([[...at(-24), 13], [...at(40), 18], [...at(110), 30], [...at(160), 36]]), '#8a5a2e', 'wood', { flow: ang,
      lines: [dl([at(70, -6), at(80, -8)], 0.6, 2.2), dl([at(120, 4), at(132, 6)], 0.6, 2.2)] })];
    for (const [t, w, dir] of [[96, -14, -1], [126, -17, -1], [150, -18, -1], [112, 15, 1], [142, 17, 1], [168, 0, 0]]) {
      const tipP = dir ? at(t + 4, w + dir * 13) : at(t + 16, 0), s1 = at(t - 5, w), s2 = at(t + 5, w);
      out.push(S([P(...s1, 1), P(...tipP, 1), P(...s2, 1)], STEEL, 'steel', { line: 0.8 }));
    }
    return out;
  }
  /* ---------- щиты на левом предплечье ---------- */
  function heaterPts(cx, cy, w, h, k) {
    const hw = w / 2 * k, t = cy - h / 2 * k;
    return [P(cx - hw, t, 1), [cx, t - h * 0.03 * k], P(cx + hw, t, 1), [cx + hw * 0.98, cy + h * 0.04 * k], [cx + hw * 0.62, cy + h * 0.33 * k], P(cx, cy + h * 0.5 * k, 1), [cx - hw * 0.62, cy + h * 0.33 * k], [cx - hw * 0.98, cy + h * 0.04 * k]];
  }
  function heater(s) {
    const [cx, cy] = SHC, w = 72, h = 92, rim = s.rim || GOLD, ch = [];
    if (s.charge === 'hammer') ch.push(S(T2([[cx, cy - 8, 7], [cx, cy + 30, 7]]), WOOD, 'wood', { line: 0.6 }), S([P(cx - 14, cy - 20, 1), P(cx + 14, cy - 20, 1), P(cx + 14, cy - 6, 1), P(cx - 14, cy - 6, 1)], GOLD, 'gold', { line: 0.6 }));
    if (s.charge === 'skull') ch.push(E(cx, cy - 6, 14, 13, BONE, 'horn', { line: 0.7, sub: [fe(cx - 5.5, cy - 6, 4, 3.6, '#1a0e0a'), fe(cx + 5.5, cy - 6, 4, 3.6, '#1a0e0a'), fe(cx - 5.5, cy - 6, 1.6, 1.4, '#ff4020', 0.9), fe(cx + 5.5, cy - 6, 1.6, 1.4, '#ff4020', 0.9)] }),
      S([[cx - 8, cy + 4], [cx + 8, cy + 4], [cx + 7, cy + 14], [cx - 7, cy + 14]], BONE, 'horn', { line: 0.6, lines: [dl([[cx - 3, cy + 5], [cx - 3, cy + 13]], 0.6, 1), dl([[cx + 3, cy + 5], [cx + 3, cy + 13]], 0.6, 1)] }));
    if (s.charge === 'star') ch.push(S(star(cx, cy - 6, 24, 10, 8), GOLD, 'gold', { line: 0.7 }), E(cx, cy - 6, 8, 8, '#f8e080', 'gold', { line: 0.6 }));
    if (s.charge === 'cross') ch.push(S([P(cx - 4, cy - 40, 1), P(cx + 4, cy - 40, 1), P(cx + 4, cy + 44, 1), P(cx - 4, cy + 44, 1)], rim, 'gold', { line: 0.5 }), S([P(cx - 40, cy - 12, 1), P(cx + 40, cy - 12, 1), P(cx + 40, cy - 4, 1), P(cx - 40, cy - 4, 1)], rim, 'gold', { line: 0.5 }));
    return [S(heaterPts(cx, cy, w, h, 1), rim, s.rimM || 'gold', { gloss: 0.9 }),
      S(heaterPts(cx, cy + 1, w, h, 0.84), s.field, s.fieldM || 'cloth', { gloss: 0.6, line: 0.8, sub: ch }),
      ...[[cx - 30, cy - 38], [cx + 30, cy - 38], [cx - 26, cy + 14], [cx + 26, cy + 14]].map(([x, y]) => E(x, y, 2.2, 2.2, tone(rim, 0.3), 'steel', { line: 0.4 }))];
  }
  function buckler() {
    const [cx, cy] = SHC;
    return [E(cx, cy, 38, 38, '#8a5a30', 'wood', { flow: 0.3 }), E(cx, cy, 28, 28, '#9aa2ac', 'steel', { line: 0.9 }), E(cx, cy, 11, 11, '#d0d6de', 'steel', { glint: [[cx - 3, cy - 3, 3.5]] }),
      ...[45, 135, 225, 315].map(a => E(cx + Math.cos(rad(a)) * 33, cy + Math.sin(rad(a)) * 33, 2.8, 2.8, STEEL, 'steel', { line: 0.5 }))];
  }
  function targ() {
    const [cx, cy] = SHC;
    return [...Array.from({ length: 10 }, (_, i) => S([pol(cx, cy, 30, i * 36 - 11, 1), pol(cx, cy, 44, i * 36, 1), pol(cx, cy, 30, i * 36 + 11, 1)], STEEL, 'steel', { line: 0.7 })),
      E(cx, cy, 34, 34, '#b88a58', 'leather', { lines: [Object.assign(dl(ell(cx, cy, 26, 26, 16), 0.5, 1.4), { closed: true })] }),
      E(cx, cy, 11, 11, '#c8ced6', 'steel', { glint: [[cx - 3, cy - 3, 3.5]] })];
  }
  /* ---------- доспехи на торсе ---------- */
  function plate(s) {
    const c = s.c || STEEL, m = s.m || 'steel', trim = s.trim, o = m === 'leather' && s.scale ? { tex: 'scale', texSize: 0.9 } : m === 'wood' ? { flow: Math.PI / 2 } : {};
    const brd = trim ? { sub: [S(T2([[96, 250, 6], [130, 258, 6], [164, 250, 6]]), trim, 'gold', { line: 0 })] } : {};
    const out = [
      S(symC([[162, 250], [168, 272], [154, 280]], [130, 256], [130, 284]), tone(c, -0.12), m, Object.assign({}, o, brd)),
      S(symC([[158, 234], [164, 254], [152, 262]], [130, 238], [130, 266]), c, m, Object.assign({}, o)),
      S(symC([[141, 125.5], [156, 130], [167, 142], [169, 166], [165, 200], [160, 232], [150, 248]], [130, 128], [130, 253]), c, m, Object.assign({ gloss: m === 'steel' ? 1 : undefined,
        lines: [hl([[130, 134], [130, 244]], 0.6, 1.6), dl([[104, 170], [116, 180], [130, 177], [144, 180], [156, 170]], 0.35, 1.4)] }, o,
        trim ? { sub: [S(T2([[100, 132, 5], [116, 128, 5], [130, 136, 5], [144, 128, 5], [160, 132, 5]]), trim, 'gold', { line: 0 })] } : {})),
      S(T2([[112, 124, 9], [130, 129, 10], [148, 124, 9]]), tone(c, -0.08), m, Object.assign({ line: 0.8 }, o)),
      ...both([S([[70, 146], [78, 132], [94, 125], [110, 132], [108, 150], [98, 164], [80, 170], [70, 162]], c, m, Object.assign({ lines: [dl([[74, 156], [96, 148], [108, 140]], 0.4)] }, o,
        trim ? { sub: [S(T2([[66, 164, 5], [82, 168, 5], [100, 160, 5]]), trim, 'gold', { line: 0 })] } : {}))]),
    ];
    if (s.star) out.push(S(star(130, 178, 14, 6, 8), trim || GOLD, 'gold', { line: 0.7 }));
    if (s.gem) out.push(E(130, 176, 7, 7, s.gem, 'gem', { line: 0.6, glint: [[128, 174, 2.2]] }), ...[0, 90, 180, 270].map(a => E(130 + Math.cos(rad(a)) * 12, 176 + Math.sin(rad(a)) * 12, 2.2, 2.2, trim || GOLD, 'gold', { line: 0.4 })));
    return out;
  }
  function ribs() {
    const out = [S(T2([[130, 128, 9], [130, 250, 8]]), BONE, 'horn', { lines: [18, 36, 54, 72, 90, 108].map(d => dl([[126, 130 + d], [134, 130 + d]], 0.5, 1.2)) })];
    for (let i = 0; i < 5; i++) { const y = 146 + i * 19; out.push(...both([S(T2([[132, y, 7], [150, y + 1, 7], [163, y + 9, 6], [162, y + 19, 5]]), BONE, 'horn', { line: 0.8 })])); }
    out.push(...both([S(T2([[132, 132, 7], [150, 131, 6.5], [168, 138, 5.5]]), BONE, 'horn', { line: 0.8 })]), S(T2([[130, 134, 12], [130, 204, 10]]), '#f6eed6', 'horn', { line: 0.8 }));
    return out;
  }
  function tunicArmor(s) {
    const c = s.c || '#d8bc88';
    return [S(TORSO(304, 6, false), c, 'cloth', { belly: 0.2, lines: [dl([[116, 250], [112, 298]], 0.35), dl([[144, 250], [148, 298]], 0.35)] }),
      ...both([S(T2([[93, 146, 32], [82, 186, 28]], { flat1: true }), c, 'cloth')]),
      belt('#7a4a26', GOLD, 238),
      S(ell(130, 180, 15, 9.5, 14), '#f6f0e0', 'gem', { line: 0.9, lc: '#8a6a20' }), E(130, 180, 6, 6, '#e0a020', 'gem', { line: 0.6, sub: [fe(130, 180, 2, 3.6, '#1a1008')], glint: [[128.4, 178.4, 1.8]] })];
  }
  /* ---------- плащ: спина за телом и складки на плечах ---------- */
  function capeBack(s) {
    const c = s.c, trim = s.trim || GOLD;
    return [S(symC([[146, 126], [165, 132], [184, 150], [196, 210], [205, 300], [212, 392], [216, 440, 1], [186, 444], [158, 440]], [130, 125], [130, 441]), c, 'cloth', { belly: 0.35,
      lines: [dl([[182, 200], [198, 430]], 0.4, 1.6), dl([[78, 200], [62, 430]], 0.4, 1.6), dl([[160, 300], [168, 436]], 0.25), dl([[100, 300], [92, 436]], 0.25)],
      sub: [S([[0, 426], [260, 426], [260, 470], [0, 470]], trim, 'cloth', { line: 0.5 })] }),
      S(T2([[100, 132, 14], [114, 116, 13], [130, 112, 13], [146, 116, 13], [160, 132, 14]]), tone(c, -0.2), 'cloth', { line: 0.8 })];
  }
  function capeFront(s) {
    const c = s.c, trim = s.trim || GOLD;
    return [...both([S([[82, 144], [92, 130], [110, 124], [124, 130], [116, 142], [100, 152], [88, 170], [80, 160]], c, 'cloth', { belly: 0.3,
      sub: [S(T2([[78, 158, 5], [96, 150, 5], [116, 140, 5], [126, 131, 5]]), trim, 'cloth', { line: 0 })] })]),
      S(T2([[116, 136, 2.6], [130, 143, 2.6], [144, 136, 2.6]]), GOLD, 'gold', { line: 0.4 }),
      ...[116, 144].map(x => E(x, 135, 6, 6, GOLD, 'gold', { line: 0.6, sub: [E(x, 135, 3, 3, trim, 'gem', { line: 0 })], glint: [[x - 2, 133, 1.6]] }))];
  }
  function wings() {
    const out = [], root = [150, 168];
    const prim = [[-78, 118], [-62, 142], [-46, 158], [-30, 164], [-14, 160], [2, 150], [18, 134], [34, 112]];
    prim.forEach(([a, L]) => out.push(S(K.leaf(root, rad(a), L, 30).body, WHITE, 'feather', { texSize: 0.45, line: 0.8, lc: '#8a8a90', lines: [dl(K.leaf(root, rad(a), L, 30).shaft, 0.3, 1.2)] })));
    [[-70, 70], [-48, 84], [-26, 88], [-4, 82], [18, 66]].forEach(([a, L]) => out.push(S(K.leaf([152, 160], rad(a), L, 30).body, '#f2eee4', 'feather', { texSize: 0.4, line: 0.7, lc: '#8a8a90' })));
    out.push(E(156, 158, 20, 24, '#f6f2e8', 'feather', { texSize: 0.4, line: 0.7, lc: '#8a8a90' }));
    return both(out);
  }
  /* ---------- ожерелья ---------- */
  function necklace(s) {
    const ch = s.chain || GOLD, out = [S(T2([[118, 118, 3.2], [118.5, 132, 3.2], [123, 148, 3.2], [130, 153, 3.2], [137, 148, 3.2], [141.5, 132, 3.2], [142, 118, 3.2]]), ch, 'gold', { line: 0.5 })];
    if (s.pend === 'wing') out.push(...both([S(K.leaf([131, 160], rad(-20), 20, 10).body, WHITE, 'feather', { line: 0.6, lc: '#8a8a90' })]), E(130, 159, 4, 4, ch, 'gold', { line: 0.5 }));
    if (s.pend === 'medal') out.push(E(130, 164, 10, 10, GOLD, 'gold', { gloss: 1.2, line: 0.7 }), E(130, 164, 4.6, 4.6, s.gem, 'gem', { line: 0.5, glint: [[128.6, 162.6, 1.6]] }));
    if (s.pend === 'gem') out.push(fe(130, 164, 11, 11, s.gem, 0.3), S([P(130, 153, 1), P(139, 162, 1), P(130, 176, 1), P(121, 162, 1)], s.gem, 'gem', { gloss: 1.3, line: 0.7, lc: tone(s.gem, -0.6), lines: [hl([[124, 162], [136, 162]], 0.7, 1)] }));
    return out;
  }
  /* ---------- сапоги ---------- */
  function boots(s) {
    const c = s.c || '#6a4424', sole = s.sole || tone(c, -0.6), out = [];
    out.push(S([[91, 390], [123, 390], [122, 428], [121, 452], [120, 468], [115, 481], [109, 490, 1], [70, 490, 1], [68, 481], [81, 471], [91, 460], [92, 430]], c, 'leather', { belly: 0.2,
      lines: [dl([[96, 440], [118, 440]], 0.35), hl([[98, 400], [96, 456]], 0.5, 1.4)], sub: [S([[50, 483], [140, 483], [140, 500], [50, 500]], sole, 'leather', { line: 0 })] }));
    out.push(S([[88, 382], [126, 382], [128, 402, 1], [86, 402, 1]], tone(c, 0.12), 'leather', { line: 0.9 }));
    if (s.stars) out.push(S(star(107, 392, 8, 3, 4), s.stars, 'gem', { line: 0.6 }), S(star(84, 462, 5, 1.8, 4), s.stars, 'gem', { line: 0.5 }));
    if (s.wings) [[-128, 30], [-146, 40], [-164, 42], [-182, 34]].forEach(([a, L]) => out.push(S(K.leaf([94, 452], rad(a), L, 13).body, WHITE, 'feather', { line: 0.7, lc: '#6a6a74', texSize: 0.3, lines: [dl(K.leaf([94, 452], rad(a), L, 13).shaft, 0.35, 1)] })));
    return both(out);
  }
  /* ---------- кольца и перчатки ---------- */
  function ring(s, left) {
    const out = [fe(71, 297, 7, 7, s.gem, 0.25), S(T2([[64.5, 297, 3.8], [74.5, 298, 3.8]]), GOLD, 'gold', { line: 0.5 }), E(71, 296.4, 3, 3, s.gem, 'gem', { line: 0.5, glint: [[70, 295.3, 1.2]] })];
    return left ? mir(out) : out;
  }
  function gloves(s) {
    const c = s.c || '#a07040';
    return both([S(T2([[65, 270, 23], [64, 290, 19]], { flat1: true }), tone(c, -0.1), 'leather', { line: 0.9 }),
      S(FIST.map(q => [62 + (q[0] - 62) * 1.08, 303 + (q[1] - 303) * 1.08]), c, 'leather', { lines: [dl([[56, 297.5], [74, 298]], 0.5, 1.1), dl([[54, 304], [75, 304.5]], 0.5, 1.1), dl([[55, 311], [73, 311.5]], 0.5, 1.1)] }),
      S([[75.5, 292.5], [76.5, 299.5], [70, 302.5], [59.5, 302], [56.5, 298.5], [61, 295], [68, 295]], c, 'leather', { line: 0.8 })]);
  }
  /** Формы надетого артефакта: { front, back } (back — за телом: спина плаща, крылья). */
  function wornShapes(id) {
    const s = specOf(id);
    switch (s.k) {
      case 'helm': return { front: helm(s) };
      case 'skull': return { front: skullHelm(s) };
      case 'crown': return { front: crown(s) };
      case 'sword': return { front: sword(s) };
      case 'axe': return { front: axe(s) };
      case 'flail': return { front: flail(s) };
      case 'club': return { front: club(s) };
      case 'heater': return { front: heater(s) };
      case 'buckler': return { front: buckler(s) };
      case 'targ': return { front: targ(s) };
      case 'plate': return { front: plate(s) };
      case 'ribs': return { front: ribs(s) };
      case 'tunic': return { front: tunicArmor(s) };
      case 'cape': return { front: capeFront(s), back: capeBack(s) };
      case 'wings': return { back: wings(s) };
      case 'neck': return { front: necklace(s) };
      case 'boots': return { front: boots(s) };
      case 'ring': return { front: ring(s), left: ring(s, true) };
      case 'gloves': return { front: gloves(s) };
      default: return {};
    }
  }

  /* ======================= ниша-фон ======================= */
  /* Арка-ниша в стене: углубление цветом фракции (подмена $b), резная золочёная рамка,
     замковый камень, постамент под ногами. Рисуется один раз и красится подменой. */
  const NICHE_C = { castle: '#46587a', rampart: '#3e5a38', tower: '#48587e', inferno: '#6a3024', necropolis: '#3e3a54', dungeon: '#4a3050', stronghold: '#6a4c2a',
    fortress: '#46563a', conflux: '#3a5a6a', cove: '#2e5068', hive: '#56562a', bastion: '#5a4630', factory: '#5a4636' };
  const ARCH = [[14, 170], [26, 104], [54, 54], [92, 26], [130, 17], [168, 26], [206, 54], [234, 104], [246, 170]];
  function niche() {
    return layer('ic_hero.niche', () => [
      S([P(14, 494, 1), ...ARCH, P(246, 494, 1)], '$b:#46587a', 'cloth', { line: 0, rim: 0, ao: 1.5, hi: 0.4, lo: 1.2,
        sub: [fe(130, 190, 96, 150, '#fff2c8', 0.1), fe(130, 150, 60, 90, '#fff2c8', 0.08),
          ...[0, 1, 2, 3, 4, 5, 6].map(i => flat([[14, 214 + i * 40], [246, 214 + i * 40], [246, 216 + i * 40], [14, 216 + i * 40]], '#000000', 0.08)),
          ...[0, 1, 2, 3, 4, 5, 6].map(i => flat([[70 + (i % 2) * 60, 176 + i * 40], [72 + (i % 2) * 60, 176 + i * 40], [72 + (i % 2) * 60, 214 + i * 40], [70 + (i % 2) * 60, 214 + i * 40]], '#000000', 0.07)),
          ...[0, 1, 2, 3, 4, 5, 6].map(i => flat([[190 - (i % 2) * 60, 176 + i * 40], [192 - (i % 2) * 60, 176 + i * 40], [192 - (i % 2) * 60, 214 + i * 40], [190 - (i % 2) * 60, 214 + i * 40]], '#000000', 0.07))] }),
      S(T2([[8, 496, 14], ...ARCH.map(q => [q[0] - Math.sign(q[0] - 130) * 6, q[1] - 6, 14]), [252, 496, 14]]), '#8a6a34', 'wood', { line: 1, flow: 0 }),
      S(T2([[16, 494, 4], ...ARCH.map(q => [q[0] + Math.sign(q[0] - 130) * 1.5, q[1] + 1.5, 4]), [244, 494, 4]]), GOLD, 'gold', { line: 0.5 }),
      S([P(116, -2, 1), P(144, -2, 1), P(139, 30, 1), P(121, 30, 1)], '#b8923a', 'gold', { line: 0.8, sub: [E(130, 12, 5, 5, '#c02a24', 'gem', { line: 0.4 })] }),
      ...both([E(8, 176, 8, 8, '#b8923a', 'gold', { line: 0.7 })]),
      E(130, 492, 102, 12, '#8a7a5a', 'cloth', { line: 0.8 }), E(130, 487, 94, 9, '#b8a47a', 'cloth', { line: 0.8, lines: [dl(ell(130, 487, 82, 6.5, 20), 0.25)] }),
      fe(130, 486, 62, 7, '#000000', 0.32),
    ]);
  }

  /* ======================= сборка слоёв ======================= */
  const TBL = () => T;
  function lookOf(hero) {
    const key = String(hero.portrait || '').replace(/^portrait_/, '');
    const o = T[key] || T[hero.cls + '_a'] || T.knight_a;
    return { key: T[key] ? key : T[hero.cls + '_a'] ? hero.cls + '_a' : 'knight_a', o };
  }
  function bodyLayers(key, o) {
    const pre = 'portrait_' + key;
    const hatShapes = o.lizard ? [] : hatOf(o);
    return {
      body: layer(pre + '.doll', () => bodyOf(o)),
      skirt: skirtOf(o) ? layer(pre + '.skirt', () => skirtOf(o)) : null,
      hands: layer(pre + '.hands', () => handsOf(o)),
      hat: hatShapes.length ? layer(pre + '.hat', () => hatOf(o)) : null,
      hood: hoodBackOf(o) ? layer(pre + '.hood', () => hoodBackOf(o)) : null,
    };
  }
  function worn(id) {
    const base = 'art_' + id;
    let w = null; const get = () => w || (w = wornShapes(id));
    const has = n => !!V._defs[n];
    return {
      front: () => has(base + '.worn') ? base + '.worn' : (get().front ? layer(base + '.worn', () => get().front) : null),
      back: () => has(base + '.back') ? base + '.back' : (get().back ? layer(base + '.back', () => get().back) : null),
      left: () => has(base + '.worn2') ? base + '.worn2' : (get().left ? layer(base + '.worn2', () => get().left) : null),
    };
  }
  /** Слои куклы по порядку: { name, tint } — рисунок, { icon, at, size } — иконка «прочего» на поясе. */
  function layers(hero) {
    const { key, o } = lookOf(hero), a = hero.arts || {}, L = [];
    const B = bodyLayers(key, o);
    L.push({ name: niche(), tint: { b: NICHE_C[o.f] || NICHE_C.castle } });
    if (a.cape) L.push({ name: worn(a.cape).back() });
    if (!a.helm && B.hood) L.push({ name: B.hood });
    L.push({ name: B.body });
    if (a.boots) L.push({ name: worn(a.boots).front() });
    if (B.skirt) L.push({ name: B.skirt });
    if (a.armor) L.push({ name: worn(a.armor).front() });
    if (a.neck) L.push({ name: worn(a.neck).front() });
    if (a.cape) L.push({ name: worn(a.cape).front() });
    if (a.helm) L.push({ name: worn(a.helm).front() });
    else if (B.hat) L.push({ name: B.hat });
    if (a.weapon) L.push({ name: worn(a.weapon).front() });
    L.push({ name: B.hands });
    for (const m of ['misc1', 'misc2']) if (a[m] && specOf(a[m]).k === 'gloves') L.push({ name: worn(a[m]).front() });
    if (a.shield) L.push({ name: worn(a.shield).front() });
    if (a.ring1) L.push({ name: worn(a.ring1).front() });
    if (a.ring2) L.push({ name: worn(a.ring2).left() });
    const BELT = { misc1: [100, 266], misc2: [158, 268] };
    for (const m of ['misc1', 'misc2']) if (a[m] && specOf(a[m]).k !== 'gloves') L.push({ icon: 'art_' + a[m], at: BELT[m], size: 34 });
    return L.filter(l => l.name || l.icon);
  }

  /* ======================= панель: ячейки, нити, рисование ======================= */
  const PW = 360, PH = 440, SC = 0.85, OX = PW / 2 - CX * SC, OY = PH - 14 - GY * SC, CELL = 48;
  /** Точка на фигуре, к которой тянется нить от ячейки слота (единицы куклы). */
  const AT = { helm: [110, 52], neck: [122, 150], weapon: [44, 190], misc1: [100, 256], ring1: [58, 300], boots: [92, 440],
    cape: [178, 144], armor: [154, 186], shield: [236, 236], misc2: [160, 256], ring2: [202, 300] };
  const LEFT = ['helm', 'neck', 'weapon', 'misc1', 'ring1', 'boots'], RIGHT = ['cape', 'armor', 'shield', 'misc2', 'ring2'];
  /** Силуэт-подсказка пустого слота: иконка типичного артефакта. */
  const HINT = { helm: 'art_unicorn_helm', neck: 'art_pendant_courage', cape: 'art_cape_velocity', weapon: 'art_titan_gladius', shield: 'art_sentinel_shield',
    armor: 'art_titan_cuirass', ring1: 'art_ring_life', ring2: 'art_ring_life', boots: 'art_boots_speed', misc1: 'art_clover_fortune', misc2: 'art_badge_courage' };
  const toPanel = (x, y) => [OX + x * SC, OY + y * SC];
  /** Ячейки: столбик слева и справа, каждая — на высоте своей точки, без наложений. */
  function layout() {
    const out = [], gap = CELL + 6, top = 8 + CELL / 2, bot = PH - 8 - CELL / 2;
    for (const [list, x] of [[LEFT, 8 + CELL / 2], [RIGHT, PW - 8 - CELL / 2]]) {
      const ys = list.map(s => Math.min(bot, Math.max(top, toPanel(...AT[s])[1])));
      for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + gap);
      ys[ys.length - 1] = Math.min(ys[ys.length - 1], bot);
      for (let i = ys.length - 2; i >= 0; i--) ys[i] = Math.min(ys[i], ys[i + 1] - gap);
      list.forEach((s, i) => { const [px, py] = toPanel(...AT[s]); out.push({ slot: s, x, y: ys[i], px, py, side: x < PW / 2 ? -1 : 1 }); });
    }
    return out;
  }
  /** Нарисовать куклу героя на холст (размер панели PW×PH, плотность dpr). */
  function paint(cv, hero, dpr) {
    dpr = Math.min(3, Math.max(1, dpr || root.devicePixelRatio || 1));
    const Pk = SC * dpr, Sk = Pk * 10;
    cv.width = Math.round(PW * dpr); cv.height = Math.round(PH * dpr);
    const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
    const AX = (OX + CX * SC) * dpr, AY = (OY + GY * SC) * dpr;
    for (const l of layers(hero)) {
      if (l.icon) {
        const d = V._defs[l.icon]; if (!d) continue;
        const k = l.size / Math.max(d.w, d.h), r = V.render(l.icon, k * Sk); if (!r) continue;
        const cx = AX + (l.at[0] - CX) * Pk, cy = AY + (l.at[1] - GY) * Pk;
        ctx.save(); ctx.strokeStyle = '#3a2414'; ctx.lineWidth = 2 * dpr; ctx.beginPath(); ctx.moveTo(cx, cy - 16 * Pk); ctx.lineTo(cx, cy - 8 * Pk); ctx.stroke();
        ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 3 * dpr; ctx.shadowOffsetY = 1.5 * dpr;
        ctx.drawImage(r, Math.round(cx - r.width / 2), Math.round(cy - r.height / 2)); ctx.restore();
        continue;
      }
      const r = V.render(l.name, Sk, false, l.tint); if (!r) continue;
      ctx.drawImage(r, Math.round(AX - r._anchor[0] * Sk), Math.round(AY - r._anchor[1] * Sk));
    }
    return cv;
  }
  /** Все рисунки куклы заранее (для проверок): тела всех портретов и все известные артефакты. */
  function defineAll() {
    niche();
    for (const key in T) { const B = bodyLayers(key, T[key]); void B; }
    const ids = H3.Artifacts ? H3.Artifacts.LIST.map(a => a.id) : Object.keys(WORN);
    for (const id of ids) { const w = worn(id); w.front(); w.back(); w.left(); }
  }

  H3.VecDoll = { PW, PH, SC, CELL, AT, HINT, LEFT, RIGHT, layout, layers, paint, toPanel, defineAll, looks: TBL };
})(typeof window !== 'undefined' ? window : globalThis);
