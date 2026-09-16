/* ============================================================================
   view/sprites.js — пиксель-спрайты: строки символов × палитра.

   Спрайт:  { rows: ['..kk..', ...], pal: {k:'#000'}, anchor:[x,y] }
            '.' — прозрачный. pal — переопределения глобальной палитры.
   Вариант: { base:'pikeman', tint:{b:'r', B:'R'}, pal:{}, extra:[[x,y,'ch'],...] }
            tint — замена символов, extra — дорисовка отдельных пикселей.
   extraTint при рендере: {'r':'b'} — замена символа, {'r':'#ff0000'} — прямой цвет.
   Рендер кэшируется по ключу (имя, масштаб, зеркало, доп. tint).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  const PAL = {
    k: '#0d0a08', w: '#ffffff', l: '#c9c9cc', e: '#8b8d94', E: '#4b4d54',
    s: '#f0c8a0', S: '#c48c62', r: '#c8332a', R: '#7a1a14', o: '#e8792b',
    y: '#f2d34c', Y: '#a67c1c', g: '#5cb84a', G: '#2d6b2a', b: '#4d7fe0',
    B: '#243f8c', c: '#7fd9ea', p: '#9a58c8', P: '#4e2a72', n: '#9a6a3c',
    N: '#5a3a1c', t: '#d8b98a', i: '#efe7cf', m: '#ee7fb0', d: '#6f5a3e',
    a: '#c04fd0', q: '#1a7f6e', z: '#101828', f: '#ffb03a', F: '#ff5a1f',
    h: '#bfe36b', x: '#6a1d7a', u: '#3b3b44', v: '#8fd4c8', j: '#5a8a2a',
    D: '#2a1a10', L: '#e8e8ea', O: '#a04a12', C: '#3a9ab8', M: '#b03070',
    T: '#b89a6a', I: '#c9c0a0', A: '#e6a0ff', H: '#7fa838', Q: '#0f4f45',
  };

  const registry = Object.create(null);
  const cache = new Map();

  function define(name, def) { registry[name] = def; return def; }
  function defineMany(obj) { for (const k in obj) define(k, obj[k]); }
  function has(name) { return !!registry[name]; }
  function names() { return Object.keys(registry); }

  function resolve(name, depth) {
    const def = registry[name];
    if (!def) return null;
    if (def.rows) return def;
    if (def.base) {
      const b = resolve(def.base, (depth || 0) + 1);
      if (!b || (depth || 0) > 8) return null;
      const pal = Object.assign({}, b.pal || {}, def.pal || {});
      const tint = def.tint || {};
      let rows = b.rows.map(row => row.replace(/./g, ch => (tint[ch] !== undefined ? tint[ch] : ch)));
      if (def.extra) {
        rows = rows.map(r => r.split(''));
        for (const [x, y, ch] of def.extra) if (rows[y] && x < rows[y].length) rows[y][x] = ch;
        rows = rows.map(r => r.join(''));
      }
      return { rows, pal, anchor: def.anchor || b.anchor, hd: def.hd !== undefined ? def.hd : b.hd, unit: def.unit || b.unit, paint: def.paint || b.paint, mat: def.mat || b.mat };
    }
    return null;
  }

  function colorOf(ch, pal) {
    if (ch === '.' || ch === ' ') return null;
    if (pal && pal[ch]) return pal[ch];
    return PAL[ch] || '#ff00ff';
  }

  /* ---------- детализация 2× ----------
     Спрайты нарисованы на сетке 20–32 px. «Вдвое детальнее» — не перерисовка 400 спрайтов, а конвейер,
     который из той же сетки строит основу вдвое крупнее: EPX сглаживает лестницы диагоналей, чёрный
     контур становится тонким снаружи и тёмным оттенком материала внутри, свет сверху-слева даёт объём,
     лёгкий градиент сверху вниз — вес. Все масштабы рисуются с этой 2×-основы. Иконки интерфейса
     (ic_*) не трогаем: пиктограмме важна не мягкость, а знак. */
  const DETAIL = { on: true, paint: true, materials: true, bevel: 0.24, side: 0.1, grad: 0.06, inner: 0.42, skip: /^ic_/ };
  const MAT_FLAT = { spec: 0.6, pow: 8, ao: 1, rim: 1, grain: 'none', ga: 0, edge: 0, shade: 0, ek: 4 };   // как было до материалов
  // paint-конвейер применяется к спрайтам с hd:true — крупная сетка (unit = исходных пикселей на номинальный), стиль без контура
  /* ---------- свет сцены ----------
     Спрайт нарисован при своём студийном свете, а стоит он то на рассвете, то в лаве, то ночью.
     Плоская заливка поверх кадра красит всё одинаково и делает картинку мутной. Здесь свет сцены
     запекается в сам спрайт: со стороны источника кромка формы теплеет, с теневой уходит в холод,
     а снизу приходит отсвет земли — снег подсвечивает белым, лава оранжевым, трава зелёным. */
  const SCENE = { id: '', wr: 0, wg: 0, wb: 0, cr: 0, cg: 0, cb: 0, br: 0, bg: 0, bb: 0, wk: 0, ck: 0, bk: 0, lx: -0.6, ly: -0.8, R: 4, bh: 0.34 };
  function rgbOf(col) { const n = parseInt(String(col).slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  /** Задать свет сцены. id — ключ кэша: тот же id = те же запечённые спрайты. */
  function setScene(s) {
    const id = s && s.id || '';
    if (id === SCENE.id) return;
    SCENE.id = id;
    SCENE.wk = s && s.wk || 0; SCENE.ck = s && s.ck || 0; SCENE.bk = s && s.bk || 0;
    const [wr, wg, wb] = rgbOf(s && s.warm || '#ffffff'); SCENE.wr = wr; SCENE.wg = wg; SCENE.wb = wb;
    const [cr, cg, cb] = rgbOf(s && s.cool || '#40507a'); SCENE.cr = cr; SCENE.cg = cg; SCENE.cb = cb;
    const [br, bg, bb] = rgbOf(s && s.bounce || '#808080'); SCENE.br = br; SCENE.bg = bg; SCENE.bb = bb;
    const l = Math.hypot(s && s.lx || -0.6, s && s.ly || -0.8) || 1;
    SCENE.lx = (s && s.lx !== undefined ? s.lx : -0.6) / l; SCENE.ly = (s && s.ly !== undefined ? s.ly : -0.8) / l;
    SCENE.R = s && s.R || 4; SCENE.bh = s && s.bh || 0.34;
    trimCache();
  }
  /* Свет сцены накладывается на уже готовый спрайт, а не на дорогую 4×-основу: пересчёт при
     смене света стоит один проход по пикселям, а не всю покраску заново (было ~2 с на экран).
     Ключи готовых спрайтов содержат id сцены, поэтому возврат к прошлому свету бесплатен. */
  function trimCache() { if (cache.size > 900) { cache.clear(); urlCache.clear(); } }
  function clearAll() { cache.clear(); urlCache.clear(); hiCache.clear(); shadowCache.clear(); }
  function setDetail(v) { DETAIL.on = !!v; clearAll(); }
  function setPaint(v) { DETAIL.paint = !!v; clearAll(); }
  function setMaterials(v) { DETAIL.materials = !!v; clearAll(); }
  const hiCache = new Map();
  const NONE = -1;
  function parseColor(col) { const n = parseInt(col.slice(1), 16); return col.length === 4 ? ((n >> 8 & 15) * 17 << 16) | ((n >> 4 & 15) * 17 << 8) | ((n & 15) * 17) : n; }
  function lum(c) { return ((c >> 16 & 255) * 0.299 + (c >> 8 & 255) * 0.587 + (c & 255) * 0.114) / 255; }
  function mix(c, k) { // k>0 — к белому, k<0 — к чёрному
    let r = c >> 16 & 255, g = c >> 8 & 255, b = c & 255;
    if (k > 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
    return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
  }
  /* ---------- материалы ----------
     Раньше материал угадывался по насыщенности цвета: всё серое считалось сталью,
     остальное — «не сталью». Кольчуга и серая шкура выходили одинаковыми. Теперь у
     каждой буквы палитры есть материал по умолчанию, а спрайт может его переопределить
     полем mat: { r: 'skin' } — буква r у мага ткань, у демона кожа. */
  const MATS = {
    // мягкие: свет рассеивается — край почти без блика, форму держит зерно
    cloth: { spec: 0.35, pow: 4, ao: 1.2, rim: 1.0, grain: 'weave', ga: 0.034, edge: 0.07, shade: 0.07, ek: 6 },
    skin: { spec: 0.45, pow: 6, ao: 1.0, rim: 1.0, grain: 'none', ga: 0, edge: 0.08, shade: 0.07, ek: 5 },
    leaf: { spec: 0.30, pow: 5, ao: 1.2, rim: 1.0, grain: 'speck', ga: 0.040, edge: 0.07, shade: 0.08, ek: 5 },
    fur: { spec: 0.20, pow: 3, ao: 1.3, rim: 1.1, grain: 'fur', ga: 0.062, edge: 0.05, shade: 0.06, ek: 4 },
    wood: { spec: 0.30, pow: 5, ao: 1.1, rim: 0.9, grain: 'wood', ga: 0.048, edge: 0.10, shade: 0.09, ek: 5 },
    stone: { spec: 0.25, pow: 4, ao: 1.2, rim: 0.9, grain: 'speck', ga: 0.056, edge: 0.09, shade: 0.10, ek: 5 },
    // твёрдые и блестящие: чёткая кромка блика, узкая полоса
    bone: { spec: 0.55, pow: 8, ao: 1.1, rim: 1.0, grain: 'speck', ga: 0.028, edge: 0.18, shade: 0.11, ek: 4 },
    steel: { spec: 1.40, pow: 16, ao: 0.7, rim: 1.2, grain: 'brush', ga: 0.022, edge: 0.30, shade: 0.16, ek: 3 },
    gold: { spec: 1.30, pow: 14, ao: 0.7, rim: 1.1, grain: 'brush', ga: 0.020, edge: 0.26, shade: 0.14, ek: 3 },
    crystal: { spec: 1.60, pow: 20, ao: 0.5, rim: 1.8, grain: 'facet', ga: 0.046, edge: 0.34, shade: 0.10, ek: 4 },
    water: { spec: 1.10, pow: 12, ao: 0.6, rim: 1.4, grain: 'none', ga: 0, edge: 0.30, shade: 0.10, ek: 4 },
    // светящееся: само себе свет, кромка не нужна
    glow: { spec: 0.20, pow: 4, ao: 0.2, rim: 0.4, grain: 'none', ga: 0, emit: 0.16, edge: 0.03, shade: 0.02, ek: 3 },
  };
  const MAT_KEYS = Object.keys(MATS);
  const MAT_ID = {}; MAT_KEYS.forEach((k, i) => { MAT_ID[k] = i; });
  const MAT_LIST = MAT_KEYS.map(k => MATS[k]);
  /** Материал по умолчанию для каждой буквы палитры. */
  const MAT_OF = {
    k: 'cloth', z: 'cloth', u: 'steel', e: 'steel', E: 'steel', l: 'steel',
    w: 'bone', L: 'bone', i: 'bone', I: 'bone',
    s: 'skin', S: 'skin', t: 'skin', T: 'skin', m: 'skin', v: 'skin', o: 'skin', g: 'skin', G: 'skin',
    h: 'leaf', H: 'leaf', j: 'leaf',
    n: 'fur', N: 'fur', d: 'fur', D: 'fur',
    O: 'wood', y: 'gold', Y: 'gold',
    r: 'cloth', R: 'cloth', M: 'cloth', b: 'cloth', B: 'cloth',
    p: 'cloth', P: 'cloth', x: 'cloth', q: 'cloth', Q: 'cloth',
    f: 'glow', F: 'glow', a: 'glow', A: 'glow',
    c: 'crystal', C: 'water',
  };
  /* Буква не знает контекста: серый `e` у мечника — доспех, у замка — камень, у мельницы — доска.
     Поэтому у групп спрайтов свой профиль по умолчанию, поверх которого работает поле mat спрайта. */
  const MAT_PROFILE = [
    // каменная кладка: серое и бежевое здесь — камень, не доспех и не доска.
    // Сцена города перекрашивает буквы под фракцию, поэтому «коричневые» буквы тут тоже камень.
    [/^(town_|bld_|bank_|shrine_|wall_|gate|siege_tower|moat|subter_gate|mountain_|rock_|crystal_rock|obst_rock|hill_fort|arena|temple|magic_well|fountain_fortune|star_axis|garden_revelation|observatory|marletto_tower|learning_stone|oasis|pandora_box|keymaster|border_guard|quest_guard|dwelling_)/,
      { e: 'stone', E: 'stone', l: 'stone', u: 'stone', L: 'stone', i: 'stone', I: 'stone', t: 'stone', T: 'stone', n: 'stone', N: 'stone', d: 'stone', D: 'stone', O: 'stone' }],
    // сруб, доски, стволы: дерево с волокном, камень для серого фундамента
    [/^(mine_|tree_|obst_stump|obst_bush|windmill|water_wheel|sawmill|witch_hut|seer_hut|tavern|trading_post|mercenary_camp|shipyard|boat|flotsam|chest|sea_chest|ballista|ammo_cart|first_aid_tent|rally_flag|campfire)/,
      { n: 'wood', N: 'wood', d: 'wood', D: 'wood', O: 'wood', e: 'stone', E: 'stone', l: 'stone' }],
    // портреты: кость лица — кожа, а не блестящий череп
    [/^portrait_/, { i: 'skin', I: 'skin' }],
  ];
  const profCache = new Map();
  function matProfile(name) {
    let p = profCache.get(name);
    if (p === undefined) { const hit = MAT_PROFILE.find(([re]) => re.test(name)); p = hit ? hit[1] : null; profCache.set(name, p); }
    return p;
  }
  function matIdOf(ch, spMat, prof) {
    const name = (spMat && spMat[ch]) || (prof && prof[ch]) || MAT_OF[ch] || 'cloth';
    const id = MAT_ID[name];
    return id === undefined ? MAT_ID.cloth : id;
  }
  /** Дешёвый хеш-шум: одинаковый для одной точки, разный по сетке. */
  function hash2(x, y) {
    let n = (x | 0) * 374761393 + (y | 0) * 668265263;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) >>> 0) / 4294967295;
  }
  /** Зерно материала в точке 4×-основы. Крупность 2–4 px: мельче не переживает уменьшение. */
  function grainAt(kind, x, y) {
    if (kind === 'speck') return hash2(x >> 1, y >> 1) * 2 - 1;
    if (kind === 'fur') return (hash2(x >> 1, 0) * 2 - 1) * 0.65 + (hash2(x >> 1, y >> 2) * 2 - 1) * 0.35;
    if (kind === 'brush') return (hash2(0, y >> 1) * 2 - 1) * 0.7 + (hash2(x >> 2, y >> 1) * 2 - 1) * 0.3;
    if (kind === 'wood') return Math.sin(y * 0.38 + Math.sin(x * 0.045) * 2.6) * 0.6 + (hash2(x >> 1, y >> 1) * 2 - 1) * 0.3;
    if (kind === 'weave') return Math.sin(x * 0.8) * Math.sin(y * 0.8) * 0.6 + (hash2(x >> 1, y >> 1) * 2 - 1) * 0.3;
    if (kind === 'facet') return Math.sin((x * 0.22 + y * 0.38)) * 0.8;
    return 0;
  }

  /** Сетка цветов спрайта (int RGB или NONE) с учётом зеркала и подмены цветов. */
  function colorGrid(sp, flip, extraTint, prof) {
    const h = sp.rows.length, w = Math.max(...sp.rows.map(r => r.length));
    const g = new Int32Array(w * h).fill(NONE);
    const mg = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      const row = sp.rows[y];
      for (let x = 0; x < row.length; x++) {
        let ch = row[x], col;
        if (extraTint && extraTint[ch] !== undefined) { const t = extraTint[ch]; if (t[0] === '#') col = t; else { ch = t; col = colorOf(ch, sp.pal); } }
        else col = colorOf(ch, sp.pal);
        if (!col) continue;
        const di = y * w + (flip ? w - 1 - x : x);
        g[di] = parseColor(col);
        mg[di] = matIdOf(ch, sp.mat, prof);
      }
    }
    return { w, h, g, m: mg };
  }
  /** 2×-основа: EPX → маска краёв → бевел и градиент → тонкий контур. Возвращает canvas 2w×2h. */
  function refine(src) {
    const { w, h, g } = src, W = w * 2, H = h * 2;
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? NONE : g[y * w + x];
    const dark = c => c !== NONE && lum(c) < 0.16;
    // контур-линия в исходнике: тёмный пиксель, у которого есть тёмный сосед (одиночная точка — глаз, не контур)
    const line = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = at(x, y); if (dark(c) && (dark(at(x - 1, y)) || dark(at(x + 1, y)) || dark(at(x, y - 1)) || dark(at(x, y + 1)))) line[y * w + x] = 1; }
    const hi = new Int32Array(W * H);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      const i = (y * 2) * W + x * 2;
      hi[i] = (C === A && C !== D && A !== B) ? A : P;
      hi[i + 1] = (A === B && A !== C && B !== D) ? B : P;
      hi[i + W] = (D === C && D !== B && C !== A) ? C : P;
      hi[i + W + 1] = (B === D && B !== A && D !== C) ? B : P;
    }
    const hat = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? NONE : hi[y * W + x];
    const edge = new Uint8Array(W * H); // прозрачное или контур — то, от чего «отражается» свет
    for (let i = 0; i < W * H; i++) edge[i] = hi[i] === NONE || dark(hi[i]) ? 1 : 0;
    // расстояние до края формы в четырёх направлениях (край — прозрачное, контур или смена цвета):
    // полоса света/тени шириной в полтора исходных пикселя, а не одна линия
    const CAP = 4, du = new Uint8Array(W * H), dl = new Uint8Array(W * H), dd = new Uint8Array(W * H), dr = new Uint8Array(W * H);
    const brk = (i, j) => edge[j] || hi[j] !== hi[i]; // между i и соседом j проходит край
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (edge[i]) continue; du[i] = y === 0 || brk(i, i - W) ? 1 : Math.min(CAP, du[i - W] + 1); dl[i] = x === 0 || brk(i, i - 1) ? 1 : Math.min(CAP, dl[i - 1] + 1); }
    for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const i = y * W + x; if (edge[i]) continue; dd[i] = y === H - 1 || brk(i, i + W) ? 1 : Math.min(CAP, dd[i + W] + 1); dr[i] = x === W - 1 || brk(i, i + 1) ? 1 : Math.min(CAP, dr[i + 1] + 1); }
    const fall = d => d >= CAP ? 0 : [0, 1, 0.5, 0.22][d];
    const out = new Int32Array(hi);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, c = hi[i];
      if (c === NONE) continue;
      if (edge[i]) {
        // контурная линия: внутренняя половина (не касается прозрачного) — тёмный оттенок соседнего материала
        if (line[(y >> 1) * w + (x >> 1)]) {
          const touchesAir = hat(x, y - 1) === NONE || hat(x, y + 1) === NONE || hat(x - 1, y) === NONE || hat(x + 1, y) === NONE;
          if (!touchesAir) {
            const nb = [hat(x, y - 1), hat(x - 1, y), hat(x + 1, y), hat(x, y + 1)].find(v => v !== NONE && !dark(v));
            if (nb !== undefined) out[i] = mix(nb, -DETAIL.inner - 0.2);
          }
        }
        continue;
      }
      let k = DETAIL.bevel * (fall(du[i]) - fall(dd[i])) + DETAIL.side * (fall(dl[i]) - fall(dr[i]));
      k += DETAIL.grad * (1 - 2 * y / H);
      out[i] = k ? mix(c, Math.max(-0.6, Math.min(0.6, k))) : c;
    }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
    for (let i = 0; i < W * H; i++) { const c = out[i]; if (c === NONE) continue; d[i * 4] = c >> 16 & 255; d[i * 4 + 1] = c >> 8 & 255; d[i * 4 + 2] = c & 255; d[i * 4 + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    return cv;
  }

  /* ---------- «Краска»: основа 4× с гладкими формами и освещением ----------
     Та же сетка символов, но вместо удвоения с бевелом строится основа вчетверо крупнее:
     1. Формы. Каждый цвет спрайта — отдельная маска; маски растягиваются билинейно и в каждой точке
        побеждает самая весомая. Лестницы диагоналей превращаются в кривые, а границы между материалами
        остаются чёткими (это «векторизация масок», а не размытие).
     2. Объём. Два поля расстояний — до края силуэта и до края своего цветового пятна. Из них
        собирается высота (общий купол тела плюс купол каждого материала), из высоты — нормаль.
     3. Свет. Направленный источник сверху-слева: рассеянный свет, блик (сильнее на металле),
        затенение в стыках материалов, холодный ободок с теневой стороны силуэта.
     4. Контур. Исходная чёрная линия шириной в пиксель на 4× стала бы четырёхпиксельной — она
        утоньшается до двух: наружная — почти чёрная, внутренняя — тёмный оттенок соседнего материала. */
  const PAINT = { S: 4, sigma: 0.55, lineBoost: 1.35, light: [-0.45, -0.75, 0.55], domeR: 10, matR: 4, silDome: 0.5, matDome: 0, outline: 'none', ambient: 0.82, diffuse: 0.3, spec: 0.25, rim: 0.18, ao: 0.12 };
  function setPaintVolume(v) { Object.assign(PAINT, v); clearAll(); }
  function refinePaint(src, ov) {
    const P = ov ? Object.assign({}, PAINT, ov) : PAINT;   // ov — переопределения параметров для одного спрайта (sp.paint)
    const { w, h, g } = src, S = P.S, W = w * S, H = h * S;
    const srcMat = src.m || new Uint8Array(w * h);
    const himat = new Uint8Array(W * H);
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? NONE : g[y * w + x];
    const dark = c => c !== NONE && lum(c) < 0.16;
    const line = new Uint8Array(w * h), thin = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = at(x, y); if (c === NONE) continue;
      if (dark(c) && (dark(at(x - 1, y)) || dark(at(x + 1, y)) || dark(at(x, y - 1)) || dark(at(x, y + 1)))) line[y * w + x] = 1;
      // тонкая деталь: однопиксельная полоска любого цвета (перо, складка, звено кольчуги) — не даём ядру её размыть
      if ((at(x - 1, y) !== c && at(x + 1, y) !== c) || (at(x, y - 1) !== c && at(x, y + 1) !== c)) thin[y * w + x] = 1;
    }
    // 1. гладкие формы: для каждой точки 4× берём четыре ближайших исходных пикселя с билинейными весами,
    //    суммируем веса по цветам и выбираем самый весомый; прозрачность участвует наравне с цветами
    // ядро шире одного исходного пикселя (гаусс σ≈0,55 по окну 4×4): лестница диагонали усредняется
    // в кривую; контурная линия получает надбавку веса, иначе однопиксельная линия истончилась бы
    const hi = new Int32Array(W * H).fill(NONE), hline = new Uint8Array(W * H), alpha = new Uint8Array(W * H);
    const SIG2 = 2 * P.sigma * P.sigma;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const sx = (x + 0.5) / S - 0.5, sy = (y + 0.5) / S - 0.5;
      const x0 = Math.floor(sx) - 1, y0 = Math.floor(sy) - 1;
      const acc = new Map(); let bestC = NONE, bestW = -1, totW = 0, opW = 0, bestOp = NONE, bestOpW = -1;
      for (let cy = y0; cy < y0 + 4; cy++) for (let cx = x0; cx < x0 + 4; cx++) {
        const dx = cx - sx, dy = cy - sy; const d2 = dx * dx + dy * dy; if (d2 > 2.6) continue;
        const inside = !(cx < 0 || cy < 0 || cx >= w || cy >= h);
        const c = inside ? g[cy * w + cx] : NONE;
        let wgt = Math.exp(-d2 / SIG2);
        if (inside && (line[cy * w + cx] || thin[cy * w + cx])) wgt *= P.lineBoost;
        totW += wgt; if (c !== NONE) opW += wgt;
        const v = (acc.get(c) || 0) + wgt; acc.set(c, v);
        if (v > bestW) { bestW = v; bestC = c; }
        if (c !== NONE && v > bestOpW) { bestOpW = v; bestOp = c; }
      }
      // без контура: край силуэта сглаживаем альфой — прозрачная точка с заметной долей непрозрачного
      // веса красится лучшим непрозрачным цветом и получает частичную прозрачность
      if (P.outline === 'none') {
        const a = totW ? opW / totW : 0;
        if (bestC === NONE && a > 0.22) { bestC = bestOp; alpha[y * W + x] = Math.round(255 * Math.min(1, (a - 0.22) / 0.5)); }
        else if (bestC !== NONE) alpha[y * W + x] = a < 0.72 ? Math.round(255 * Math.min(1, 0.5 + a * 0.7)) : 255;
      } else if (bestC !== NONE) alpha[y * W + x] = 255;
      hi[y * W + x] = bestC;
      {   // материал берём у ближайшего исходного пикселя — он же задал цвет
        const mx = Math.min(w - 1, Math.max(0, Math.round(sx))), my = Math.min(h - 1, Math.max(0, Math.round(sy)));
        himat[y * W + x] = srcMat[my * w + mx];
      }
      if (bestC !== NONE && dark(bestC)) {
        // контур: помечаем, если ближайший исходный пиксель — линия
        const nx = Math.min(w - 1, Math.max(0, Math.round(sx))), ny = Math.min(h - 1, Math.max(0, Math.round(sy)));
        if (line[ny * w + nx]) hline[y * W + x] = 1;
      }
    }
    const hat = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? NONE : hi[y * W + x];
    // 2. поля расстояний (шахматная метрика, два прохода): до прозрачного и до чужого цвета
    const distTo = (isEdge) => {
      const d = new Float32Array(W * H).fill(1e4);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (isEdge(x, y)) { d[i] = 0; continue; }
        let m = 1e4; if (y > 0) m = Math.min(m, d[i - W] + 1); if (x > 0) m = Math.min(m, d[i - 1] + 1); if (y > 0 && x > 0) m = Math.min(m, d[i - W - 1] + 1.4); if (y > 0 && x < W - 1) m = Math.min(m, d[i - W + 1] + 1.4); d[i] = m; }
      for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const i = y * W + x; let m = d[i];
        if (y < H - 1) m = Math.min(m, d[i + W] + 1); if (x < W - 1) m = Math.min(m, d[i + 1] + 1); if (y < H - 1 && x < W - 1) m = Math.min(m, d[i + W + 1] + 1.4); if (y < H - 1 && x > 0) m = Math.min(m, d[i + W - 1] + 1.4); d[i] = m; }
      return d;
    };
    const air = (x, y) => hat(x, y) === NONE;
    const dSil = distTo((x, y) => air(x, y) || air(x - 1, y) || air(x + 1, y) || air(x, y - 1) || air(x, y + 1));
    const dMat = distTo((x, y) => { const c = hat(x, y); if (c === NONE) return true; return hat(x - 1, y) !== c || hat(x + 1, y) !== c || hat(x, y - 1) !== c || hat(x, y + 1) !== c; });
    // высота: купол силуэта + купол материала
    const dome = (d, R) => { const t = Math.min(1, d / R); return Math.sqrt(t); };
    const hgt = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) if (hi[i] !== NONE) hgt[i] = dome(dSil[i], P.domeR) * P.silDome + dome(dMat[i], P.matR) * P.matDome;
    const hg = (x, y) => (x < 0 || y < 0 || x >= W || y >= H || hi[y * W + x] === NONE) ? 0 : hgt[y * W + x];
    const [lx, ly, lz] = P.light; const ll = Math.hypot(lx, ly, lz); const Lx = lx / ll, Ly = ly / ll, Lz = lz / ll;
    // 3. свет
    const out = new Int32Array(hi);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, c = hi[i];
      if (c === NONE) continue;
      // 4. контур: утоньшаем — дальше двух пикселей от края линии закрашиваем соседним материалом
      if (hline[i]) {
        if (P.outline === 'none') {
          let nb = NONE;
          for (let r = 1; r <= 4 && nb === NONE; r++) for (let dy = -r; dy <= r && nb === NONE; dy++) for (let dx = -r; dx <= r; dx++) { const v = hat(x + dx, y + dy); if (v !== NONE && !dark(v) && !hline[(y + dy) * W + (x + dx)]) { nb = v; break; } }
          out[i] = nb === NONE ? c : mix(nb, -0.1);
          continue;
        }
        const touchesAir = air(x, y - 1) || air(x, y + 1) || air(x - 1, y) || air(x + 1, y) || air(x - 1, y - 1) || air(x + 1, y + 1) || air(x - 1, y + 1) || air(x + 1, y - 1);
        if (touchesAir) { out[i] = 0x0d0a08; continue; }
        // расстояние до ближайшего не-контурного пикселя
        let nb = NONE, nd = 9;
        for (let r = 1; r <= 3 && nb === NONE; r++) for (let dy = -r; dy <= r && nb === NONE; dy++) for (let dx = -r; dx <= r; dx++) { const v = hat(x + dx, y + dy); if (v !== NONE && !dark(v) && !hline[(y + dy) * W + (x + dx)]) { nb = v; nd = r; break; } }
        if (nb === NONE) { out[i] = 0x0d0a08; continue; }
        out[i] = nd <= 1 ? mix(nb, -0.55) : mix(nb, -0.2);
        continue;
      }
      const nx = -(hg(x + 1, y) - hg(x - 1, y)) * 2.2, ny = -(hg(x, y + 1) - hg(x, y - 1)) * 2.2, nz = 1;
      const nl = Math.hypot(nx, ny, nz); const Nx = nx / nl, Ny = ny / nl, Nz = nz / nl;
      const ndl = Nx * Lx + Ny * Ly + Nz * Lz;
      const l = lum(c);
      const M = DETAIL.materials ? MAT_LIST[himat[i]] : MAT_FLAT;
      const shiny = l > 0.85 ? 0.45 : 1;                           // на почти белом блик не виден
      let k = P.ambient + P.diffuse * Math.max(0, ndl) - 1;   // множитель яркости относительно базы
      // блик: отражённый вектор ≈ (2·(N·L)·N − L), смотрим на зрителя (0,0,1)
      const rz = 2 * ndl * Nz - Lz; const sp = Math.pow(Math.max(0, rz), M.pow) * P.spec * M.spec * shiny;
      k += sp * 0.75;
      if (M.emit) k += M.emit;                                     // свечение: огонь и магия светят сами
      // зерно материала: мех штрихами, камень крапом, сталь протяжкой, дерево волокном
      if (M.ga) k += grainAt(M.grain, x, y) * M.ga;
      // свет по краю пятна: со стороны источника пятно светлеет, с теневой темнеет.
      // Это не купол по центру (его отвергли как «подушку»), а ручная штриховка по границе:
      // у стали кромка узкая и резкая, у ткани широкая и мягкая, у меха её почти нет.
      if (M.edge || M.shade) {
        const ek = M.ek;
        let lit = 0, shd = 0;
        for (let d = 1; d <= ek; d++) {
          const jx = Math.round(x + Lx * d), jy = Math.round(y + Ly * d);
          if (hat(jx, jy) !== c) { lit = 1 - (d - 1) / ek; break; }
        }
        for (let d = 1; d <= ek; d++) {
          const jx = Math.round(x - Lx * d), jy = Math.round(y - Ly * d);
          if (hat(jx, jy) !== c) { shd = 1 - (d - 1) / ek; break; }
        }
        k += M.edge * lit - M.shade * shd;
      }
      // затенение в стыках материалов с теневой стороны
      if (dMat[i] < 2.5 && ndl < 0.35) k -= P.ao * M.ao * (1 - dMat[i] / 2.5);
      // холодный ободок с теневой стороны силуэта
      let rim = 0; if (dSil[i] < 2.2 && ndl < 0.2) rim = P.rim * M.rim * (1 - dSil[i] / 2.2);
      let col = mix(c, Math.max(-0.55, Math.min(0.5, k)));
      if (rim) { const cr = col >> 16 & 255, cg = col >> 8 & 255, cb = col & 255; col = (Math.min(255, Math.round(cr + (170 - cr) * rim)) << 16) | (Math.min(255, Math.round(cg + (200 - cg) * rim)) << 8) | Math.min(255, Math.round(cb + (255 - cb) * rim)); }
      out[i] = col;
    }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
    for (let i = 0; i < W * H; i++) { const c = out[i]; if (c === NONE) continue; d[i * 4] = c >> 16 & 255; d[i * 4 + 1] = c >> 8 & 255; d[i * 4 + 2] = c & 255; d[i * 4 + 3] = alpha[i] || 255; }
    ctx.putImageData(img, 0, 0);
    return cv;
  }
  /* Сетка втрое крупнее номинала (unit 3) уже несёт втрое больше клеток, поэтому основу
     покраски для неё берём втрое, а не вчетверо: в абсолютных пикселях разрешение основы
     остаётся прежним, а запекание спрайта дешевеет с 89 до 58 мс. Разницы на глаз нет. */
  function paintFor(sp) {
    if ((sp.unit || 1) < 3) return sp.paint;
    return sp.paint ? Object.assign({ S: 3 }, sp.paint) : { S: 3 };
  }
  /** Масштаб основы в номинальных пикселях: hd-спрайт — S× на исходный пиксель, исходных на номинальный — unit. */
  function baseScale(sp) {
    if (!(DETAIL.paint && sp && sp.hd)) return 2;
    const ov = paintFor(sp);
    return ((ov && ov.S) || PAINT.S) * (sp.unit || 1);
  }
  function hiRes(name, sp, flip, extraTint) {
    const key = name + '|' + (flip ? 1 : 0) + '|' + (extraTint ? JSON.stringify(extraTint) : '');
    let cv = hiCache.get(key);
    if (!cv) { const grid = colorGrid(sp, flip, extraTint, matProfile(name)); cv = (DETAIL.paint && sp.hd) ? refinePaint(grid, paintFor(sp)) : refine(grid); hiCache.set(key, cv); }
    return cv;
  }

  /* Свет сцены поверх готового спрайта. Форму читаем по альфе: поле расстояния до прозрачного
     даёт нормаль края, направленную наружу, — по ней видно, какая сторона фигуры повёрнута
     к источнику. Плюс отсвет земли в нижней части. */
  function tintScene(cv, ps) {
    if (!SCENE.wk && !SCENE.ck && !SCENE.bk) return;
    const W = cv.width, H = cv.height;
    if (W < 3 || H < 3) return;
    const ctx = cv.getContext('2d');
    let img; try { img = ctx.getImageData(0, 0, W, H); } catch (e) { return; }
    const d = img.data, N = W * H;
    const dist = new Float32Array(N);
    for (let i = 0; i < N; i++) dist[i] = d[i * 4 + 3] < 128 ? 0 : 1e4;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!dist[i]) continue;
      let m = dist[i]; if (y > 0) m = Math.min(m, dist[i - W] + 1); if (x > 0) m = Math.min(m, dist[i - 1] + 1);
      if (y > 0 && x > 0) m = Math.min(m, dist[i - W - 1] + 1.4); if (y > 0 && x < W - 1) m = Math.min(m, dist[i - W + 1] + 1.4); dist[i] = m; }
    for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const i = y * W + x; let m = dist[i];
      if (y < H - 1) m = Math.min(m, dist[i + W] + 1); if (x < W - 1) m = Math.min(m, dist[i + 1] + 1);
      if (y < H - 1 && x < W - 1) m = Math.min(m, dist[i + W + 1] + 1.4); if (y < H - 1 && x > 0) m = Math.min(m, dist[i + W - 1] + 1.4); dist[i] = m; }
    const R = Math.max(2, SCENE.R * ps), y0 = H * (1 - SCENE.bh), bh = H * SCENE.bh;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, o = i * 4;
      if (d[o + 3] < 8) continue;
      let r = d[o], g = d[o + 1], b = d[o + 2];
      if (SCENE.wk || SCENE.ck) {
        const wF = 0.4 + 0.6 * Math.max(0, 1 - dist[i] / R);   // к краю форма читается сильнее, но и середина в сцене
        const gx = (x < W - 1 ? dist[i + 1] : 0) - (x > 0 ? dist[i - 1] : 0);
        const gy = (y < H - 1 ? dist[i + W] : 0) - (y > 0 ? dist[i - W] : 0);
        const gl = Math.hypot(gx, gy);
        if (gl > 0.001) {
          const f = (-gx / gl) * SCENE.lx + (-gy / gl) * SCENE.ly;   // наружу = против роста расстояния
          if (f > 0 && SCENE.wk) { const t = SCENE.wk * f * wF; r += (SCENE.wr - r) * t; g += (SCENE.wg - g) * t; b += (SCENE.wb - b) * t; }
          else if (f < 0 && SCENE.ck) { const t = SCENE.ck * -f * wF; r += (SCENE.cr - r) * t; g += (SCENE.cg - g) * t; b += (SCENE.cb - b) * t; }
        }
      }
      if (SCENE.bk && y > y0) { const t = SCENE.bk * Math.min(1, (y - y0) / bh); r += (SCENE.br - r) * t; g += (SCENE.bg - g) * t; b += (SCENE.bb - b) * t; }
      d[o] = r < 0 ? 0 : r > 255 ? 255 : r; d[o + 1] = g < 0 ? 0 : g > 255 ? 255 : g; d[o + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    ctx.putImageData(img, 0, 0);
  }

  function render(name, scale, flip, extraTint) {
    scale = scale || 1;
    const key = name + '|' + scale + '|' + (flip ? 1 : 0) + '|' + (extraTint ? JSON.stringify(extraTint) : '') + '|' + SCENE.id;
    let cv = cache.get(key);
    if (cv) return cv;
    const sp = resolve(name);
    if (!sp) return null;
    const h = sp.rows.length, w = Math.max(...sp.rows.map(r => r.length));
    const unit = sp.unit || 1, ps = scale / unit;   // масштаб на исходный пиксель сетки
    cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(w * ps)); cv.height = Math.max(1, Math.round(h * ps));
    const ctx = cv.getContext('2d');
    if (DETAIL.on && !DETAIL.skip.test(name)) {
      const hi = hiRes(name, sp, flip, extraTint);
      ctx.imageSmoothingEnabled = scale < baseScale(sp); // уменьшение — усредняем, увеличение — резкие пиксели
      ctx.drawImage(hi, 0, 0, hi.width, hi.height, 0, 0, cv.width, cv.height);
    } else {
      for (let y = 0; y < h; y++) {
        const row = sp.rows[y];
        for (let x = 0; x < row.length; x++) {
          let ch = row[x], col;
          if (extraTint && extraTint[ch] !== undefined) {
            const t = extraTint[ch];
            if (t[0] === '#') col = t; else { ch = t; col = colorOf(ch, sp.pal); }
          } else col = colorOf(ch, sp.pal);
          if (!col) continue;
          ctx.fillStyle = col;
          ctx.fillRect((flip ? (w - 1 - x) : x) * ps, y * ps, ps, ps);
        }
      }
    }
    if (DETAIL.on && !DETAIL.skip.test(name)) tintScene(cv, ps);   // свет сцены: время суток и отсвет земли
    cv._w = w / unit; cv._h = h / unit; cv._anchor = sp.anchor ? [sp.anchor[0] / unit, sp.anchor[1] / unit] : [w / unit / 2, h / unit];
    cache.set(key, cv);
    return cv;
  }

  /**
   * Что рисовать для масштаба scale: { cv, k } — canvas и множитель его пикселей (drawn = cv.width * k).
   * При включённой детализации мелкие масштабы (<2) берут 2×-основу и уменьшают её уже на целевом контексте:
   * на телефоне карта рисуется с масштабом z·dpr ≈ 2–3, и половинки пикселей основы там видны.
   */
  function image(name, scale, flip, extraTint) {
    scale = scale || 1;
    const bs = baseScale(resolve(name));
    if (DETAIL.on && scale < bs && !DETAIL.skip.test(name)) { const cv = render(name, bs, flip, extraTint); return cv ? { cv, k: scale / bs } : null; }
    const cv = render(name, scale, flip, extraTint); return cv ? { cv, k: 1 } : null;
  }
  /** Сглаживание при рисовании основы: уменьшение на экране — усреднять, увеличение — резко. */
  function smoothFor(ctx, k) { if (k === 1) return null; const prev = ctx.imageSmoothingEnabled; const m = ctx.getTransform(); ctx.imageSmoothingEnabled = k * Math.max(Math.abs(m.a), Math.abs(m.d)) < 1; return prev; }
  /** Рисует так, чтобы якорь (по умолчанию низ-центр) оказался в (x, y). */
  function draw(ctx, name, x, y, scale, flip, extraTint) {
    const im = image(name, scale, flip, extraTint);
    if (!im) { placeholder(ctx, name, x, y, scale || 1); return; }
    const cv = im.cv, ax = cv._anchor[0] * (scale || 1), ay = cv._anchor[1] * (scale || 1);
    if (im.k === 1) { ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay)); return; }
    const prev = smoothFor(ctx, im.k);
    ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay), cv.width * im.k, cv.height * im.k);
    ctx.imageSmoothingEnabled = prev;
  }
  function placeholder(ctx, name, x, y, scale) {
    const s = 12 * scale;
    ctx.fillStyle = '#c04fd0'; ctx.fillRect(Math.round(x - s / 2), Math.round(y - s), s, s);
    ctx.fillStyle = '#000'; ctx.font = (5 * scale) + 'px monospace';
    ctx.fillText(String(name).slice(0, 4), Math.round(x - s / 2) + 1, Math.round(y - s / 2) + 2);
  }
  /** Вписать в прямоугольник (иконки в UI). */
  function drawFit(ctx, name, x, y, w, h, flip) {
    const cv = render(name, 1, flip);
    if (!cv) { placeholder(ctx, name, x + w / 2, y + h, 1); return; }
    const s = Math.max(1, Math.floor(Math.min(w / cv._w, h / cv._h)));
    const dw = cv._w * s, dh = cv._h * s;
    const prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cv, Math.round(x + (w - dw) / 2), Math.round(y + (h - dh) / 2), dw, dh);
    ctx.imageSmoothingEnabled = prev;
  }
  const urlCache = new Map();
  /** dataURL для <img> в DOM. */
  function url(name, scale, flip) {
    const key = name + '|' + (scale || 2) + '|' + (flip ? 1 : 0) + '|' + SCENE.id;
    let u = urlCache.get(key);
    if (u) return u;
    const cv = render(name, scale || 2, flip);
    if (!cv) {
      const c = document.createElement('canvas'); c.width = c.height = 16 * (scale || 2);
      placeholder(c.getContext('2d'), name, c.width / 2, c.height, scale || 2);
      u = c.toDataURL();
    } else u = cv.toDataURL();
    urlCache.set(key, u);
    return u;
  }
  function img(name, scale, cls) { return '<img class="px ' + (cls || '') + '" src="' + url(name, scale) + '" alt="">'; }

  /** Чёрный силуэт спрайта — из него рисуются падающие тени (наклон + сплющивание). */
  const shadowCache = new Map();
  function silhouette(name, scale, flip) {
    const key = name + '|' + (scale || 1) + '|' + (flip ? 1 : 0);
    if (shadowCache.has(key)) return shadowCache.get(key);
    const src = render(name, scale, flip);
    if (!src) { shadowCache.set(key, null); return null; }
    const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height;
    const c = cv.getContext('2d');
    c.drawImage(src, 0, 0);
    c.globalCompositeOperation = 'source-in'; c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
    cv._w = src._w; cv._h = src._h; cv._anchor = src._anchor;
    shadowCache.set(key, cv);
    return cv;
  }

  /** Подмена цвета команды: буква b — цвет игрока, B — его тёмный оттенок (попона героя, знамя). */
  const teamCache = new Map();
  function teamTint(color) {
    let t = teamCache.get(color);
    if (!t) { const c = mix(parseColor(color), -0.42); t = { b: color, B: '#' + c.toString(16).padStart(6, '0') }; teamCache.set(color, t); }
    return t;
  }
  H3.Sprites = { PAL, define, defineMany, has, names, resolve, render, image, smoothFor, draw, drawFit, url, img, silhouette, teamTint, setDetail, setPaint, setPaintVolume, setMaterials, setScene, SCENE, DETAIL, PAINT, MATS, MAT_OF, MAT_PROFILE, matProfile, _registry: registry };
})(typeof window !== 'undefined' ? window : globalThis);
