/* ============================================================================
   view/terrain.js — процедурные тайлы ландшафта (32×32), рендер всей карты
   в offscreen-canvas: местность, дизеринг границ, дороги, препятствия.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, Sp = H3.Sprites;
  const TILE = 32;

  const STYLE = {
    grass: { base: ['#4f9a3c', '#559f41', '#4a9138'], spec: ['#67b04d', '#3f7f2f'], deco: 'grass', mini: '#4f9a3c' },
    dirt: { base: ['#8a6a44', '#8f6f48', '#83643f'], spec: ['#a0805a', '#6e5232'], deco: 'stones', mini: '#8a6a44' },
    sand: { base: ['#d9c27e', '#dec886', '#d3bc78'], spec: ['#eadaa0', '#c2a866'], deco: 'sanddots', mini: '#d9c27e' },
    snow: { base: ['#e8eef4', '#edf2f7', '#e1e8ee'], spec: ['#ffffff', '#c9d5de'], deco: 'snow', mini: '#e8eef4' },
    swamp: { base: ['#5b7a45', '#5f7f49', '#567340'], spec: ['#7a9a5a', '#3e5a2e', '#4d6f7a'], deco: 'swamp', mini: '#5b7a45' },
    rough: { base: ['#9a8a6a', '#a09070', '#948465'], spec: ['#b8a888', '#6f6248'], deco: 'stones', mini: '#9a8a6a' },
    lava: { base: ['#3a2b2b', '#403030', '#332626'], spec: ['#5a3a3a', '#241818', '#c84a1a'], deco: 'lava', mini: '#3a2b2b' },
    subter: { base: ['#6a5a5a', '#706060', '#635353'], spec: ['#7f6f6f', '#4f4040'], deco: 'stones', mini: '#6a5a5a' },
    water: { base: ['#2d68b8', '#3170c0', '#2a62ae'], spec: ['#4a86d4', '#245a9e'], deco: 'waves', mini: '#2d68b8' },
    rock: { base: ['#2a2a30', '#2e2e34', '#26262c'], spec: ['#3a3a42', '#1c1c20'], deco: 'rock', mini: '#2a2a30' },
  };
  const cache = new Map();

  function tile(type, variant) {
    const key = type + ':' + variant;
    let cv = cache.get(key); if (cv) return cv;
    const st = STYLE[type] || STYLE.grass;
    const rng = new U.RNG(U.hashStr(key) ^ 0x51ed27);
    cv = document.createElement('canvas'); cv.width = TILE; cv.height = TILE;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = st.base[0]; ctx.fillRect(0, 0, TILE, TILE);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = st.base[rng.int(0, st.base.length - 1)]; ctx.fillRect(rng.int(-4, 28), rng.int(-4, 28), rng.int(6, 14), rng.int(6, 14)); }
    const specN = type === 'snow' ? 10 : 26;
    for (let i = 0; i < specN; i++) { ctx.fillStyle = rng.pick(st.spec); ctx.fillRect(rng.int(0, 31), rng.int(0, 31), 1 + (rng.chance(0.3) ? 1 : 0), 1); }
    deco(ctx, st.deco, rng, variant);
    cache.set(key, cv);
    return cv;
  }
  function deco(ctx, kind, rng, variant) {
    const n = variant % 4;
    if (kind === 'grass') for (let i = 0; i < n * 2; i++) { const x = rng.int(2, 28), y = rng.int(4, 30); ctx.fillStyle = '#3c7c2c'; ctx.fillRect(x, y - 2, 1, 3); ctx.fillRect(x + 2, y - 3, 1, 4); ctx.fillRect(x - 2, y - 1, 1, 2); ctx.fillStyle = '#82c65a'; ctx.fillRect(x + 1, y - 1, 1, 1); }
    else if (kind === 'stones') for (let i = 0; i < n; i++) { const x = rng.int(2, 26), y = rng.int(2, 26), w = rng.int(3, 6), h = rng.int(2, 4); ctx.fillStyle = '#4a4036'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#b0a494'; ctx.fillRect(x, y, w - 1, h - 1); ctx.fillStyle = '#7e7264'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2); }
    else if (kind === 'sanddots') for (let i = 0; i < n * 3; i++) { ctx.fillStyle = '#b89c5a'; ctx.fillRect(rng.int(0, 30), rng.int(0, 30), 2, 1); }
    else if (kind === 'snow') for (let i = 0; i < n; i++) { ctx.fillStyle = '#cfdbe4'; ctx.fillRect(rng.int(0, 26), rng.int(0, 28), rng.int(3, 6), 1); }
    else if (kind === 'swamp') for (let i = 0; i < n; i++) { const x = rng.int(2, 24), y = rng.int(2, 26); ctx.fillStyle = '#3f6a78'; ctx.fillRect(x, y, rng.int(4, 8), rng.int(2, 4)); ctx.fillStyle = '#5e8e9a'; ctx.fillRect(x + 1, y, 2, 1); ctx.fillStyle = '#2f4a22'; ctx.fillRect(x + 3, y - 3, 1, 3); ctx.fillRect(x + 5, y - 4, 1, 4); }
    else if (kind === 'lava') for (let i = 0; i < n + 1; i++) { const x = rng.int(0, 26), y = rng.int(0, 26); ctx.fillStyle = '#c8461a'; ctx.fillRect(x, y, rng.int(3, 7), 1); ctx.fillRect(x + 2, y + 1, rng.int(2, 5), 1); ctx.fillStyle = '#ffb040'; ctx.fillRect(x + 1, y, 2, 1); }
    else if (kind === 'waves') for (let i = 0; i < 2 + n; i++) { const x = rng.int(0, 22), y = rng.int(2, 30); ctx.fillStyle = '#6ea2e0'; ctx.fillRect(x, y, rng.int(4, 9), 1); ctx.fillStyle = '#1f4f96'; ctx.fillRect(x + 1, y + 1, rng.int(3, 6), 1); }
    else if (kind === 'rock') for (let i = 0; i < 3 + n; i++) { const x = rng.int(0, 26), y = rng.int(0, 26); ctx.fillStyle = '#44444c'; ctx.fillRect(x, y, rng.int(3, 8), rng.int(2, 6)); ctx.fillStyle = '#18181c'; ctx.fillRect(x + 1, y + 2, rng.int(2, 6), 1); }
  }

  /* ---------- автотайлинг переходов ----------
     Каждый тип местности имеет приоритет. Более приоритетная местность
     «наползает» на соседнюю: у тайла мы смотрим 8 соседей, собираем битовую
     маску по каждому типу-«победителю» и рисуем его поверх через процедурную
     маску. Вода в самом низу — поэтому берег всегда над водой, с пеной.
     Маска строится по расстоянию до соседних клеток, искажённому шумом;
     шум ТАЙЛЯЩИЙСЯ (период 32 px), иначе на стыках тайлов рвался бы контур. */
  const PRIO = { water: 0, sand: 1, swamp: 2, dirt: 3, grass: 4, rough: 5, snow: 6, subter: 7, lava: 8, rock: 9 };
  const DIRS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const DEPTH = 8;       // насколько глубоко сосед заходит в клетку, px
                         // (глубже — и одиночный тайл-пятно съедается соседями целиком)
  const FOAM = '#cfe6f5';

  const smooth = t => t * t * (3 - 2 * t);
  let NOISE = null, STIP = null;

  /** Тайлящееся value-noise TILE×TILE (две октавы), значения ≈ −1..1. */
  function noiseField() {
    if (NOISE) return NOISE;
    const f = new Float32Array(TILE * TILE);
    const rng = new U.RNG(0x1f35d7);
    for (const oct of [[4, 1], [8, 0.45]]) {
      const cells = oct[0], amp = oct[1], step = TILE / cells;
      const g = new Float32Array(cells * cells);
      for (let i = 0; i < g.length; i++) g[i] = rng.next() * 2 - 1;
      for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
        const fx = x / step, fy = y / step;
        const ix = Math.floor(fx), iy = Math.floor(fy);
        const x0 = ix % cells, y0 = iy % cells, x1 = (x0 + 1) % cells, y1 = (y0 + 1) % cells;
        const tx = smooth(fx - ix), ty = smooth(fy - iy);
        const a = g[y0 * cells + x0] * (1 - tx) + g[y0 * cells + x1] * tx;
        const b = g[y1 * cells + x0] * (1 - tx) + g[y1 * cells + x1] * tx;
        f[y * TILE + x] += (a * (1 - ty) + b * ty) * amp;
      }
    }
    NOISE = f; return f;
  }
  /** Стипль-решётка для «рваного» края перехода (тоже тайлящаяся). */
  function stipple() {
    if (STIP) return STIP;
    const s = new Uint8Array(TILE * TILE), rng = new U.RNG(0x7a19c3);
    for (let i = 0; i < s.length; i++) s[i] = rng.chance(0.5) ? 1 : 0;
    STIP = s; return s;
  }

  const maskCache = new Map();
  /** Маска перехода по маске соседей: 0 — нет, 1 — сплошь, 2 — стипль, 3 — кайма. */
  function maskFor(bits) {
    let m = maskCache.get(bits); if (m) return m;
    m = new Uint8Array(TILE * TILE);
    const nf = noiseField();
    for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
      const px = x + 0.5, py = y + 0.5;
      let best = 1e9;
      for (let d = 0; d < 8; d++) {
        if (!(bits & (1 << d))) continue;
        const rx = DIRS[d][0] * TILE, ry = DIRS[d][1] * TILE;
        const ddx = Math.max(rx - px, px - (rx + TILE), 0);
        const ddy = Math.max(ry - py, py - (ry + TILE), 0);
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < best) best = dist;
      }
      if (best > 1e8) continue;
      const cov = DEPTH - (best + nf[y * TILE + x] * 4.5);
      m[y * TILE + x] = cov > 2.5 ? 1 : cov > 0 ? 2 : cov > -2 ? 3 : 0;
    }
    maskCache.set(bits, m);
    return m;
  }

  /** Тайл соседней местности, обрезанный маской перехода (+ пена над водой). */
  function overlay(type, variant, bits, rim) {
    const key = 'ov:' + type + ':' + variant + ':' + bits + ':' + (rim || '-');
    let cv = cache.get(key); if (cv) return cv;
    cv = document.createElement('canvas'); cv.width = TILE; cv.height = TILE;
    const ctx = cv.getContext('2d');
    ctx.drawImage(tile(type, variant), 0, 0);
    const img = ctx.getImageData(0, 0, TILE, TILE), d = img.data;
    const m = maskFor(bits), st = stipple();
    const rc = rim ? [parseInt(rim.slice(1, 3), 16), parseInt(rim.slice(3, 5), 16), parseInt(rim.slice(5, 7), 16)] : null;
    for (let i = 0; i < TILE * TILE; i++) {
      const c = m[i];
      if (c === 1) continue;
      if (c === 2 && st[i]) continue;
      if (rc && (c === 3 || c === 2)) { d[i * 4] = rc[0]; d[i * 4 + 1] = rc[1]; d[i * 4 + 2] = rc[2]; d[i * 4 + 3] = 255; continue; }
      d[i * 4 + 3] = 0;
    }
    ctx.putImageData(img, 0, 0);
    cache.set(key, cv);
    return cv;
  }

  /** Все переходы для клетки: [{type, bits}] в порядке рисования. */
  function transitions(map, T, x, y, own) {
    const groups = [];
    for (let d = 0; d < 8; d++) {
      const nx = x + DIRS[d][0], ny = y + DIRS[d][1];
      if (nx < 0 || ny < 0 || nx >= map.w || ny >= map.h) continue;
      const nt = T[map.terrain[ny * map.w + nx]];
      if ((PRIO[nt] || 0) <= own) continue;
      let g = null;
      for (const q of groups) if (q.type === nt) { g = q; break; }
      if (!g) groups.push(g = { type: nt, bits: 0 });
      g.bits |= 1 << d;
    }
    if (groups.length > 1) groups.sort((a, b) => PRIO[a.type] - PRIO[b.type]);
    return groups;
  }

  /** Спрайт препятствия для клетки. */
  function obstacleSprite(terrain, obs, x, y) {
    const h = (x * 31 + y * 17) % 7;
    if (obs === 1) {
      if (terrain === 'snow') return 'tree_snow';
      if (terrain === 'lava') return 'tree_dead';
      if (terrain === 'dirt') return h % 3 === 0 ? 'tree_dead' : 'tree_pine';
      if (terrain === 'swamp') return h % 2 ? 'tree_swamp' : 'tree_2';
      if (terrain === 'sand') return 'tree_palm';
      if (terrain === 'subter') return h % 2 ? 'crystal_rock' : 'tree_dead';
      if (terrain === 'rough') return h % 2 ? 'tree_pine' : 'tree_3';
      return ['tree_1', 'tree_2', 'tree_3', 'tree_pine', 'tree_1', 'tree_2', 'tree_1'][h];
    }
    if (obs === 2) return terrain === 'lava' ? 'mountain_lava' : (h % 2 ? 'mountain_1' : 'mountain_2');
    if (obs === 3) return terrain === 'subter' ? 'crystal_rock' : (h % 2 ? 'rock_1' : 'rock_2');
    return null;
  }

  /** Рендер всей карты (местность + дороги + препятствия) в canvas. */
  function renderMap(state, z) {
    const map = H3.State.lvl(state, z);
    const cv = document.createElement('canvas');
    cv.width = map.w * TILE; cv.height = map.h * TILE;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const rng = new U.RNG(state.seed ^ 0xabcdef);
    const T = R.TERRAINS;
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const i = y * map.w + x, t = T[map.terrain[i]];
      const variant = (x * 7 + y * 13 + (state.seed & 255)) % 9;
      ctx.drawImage(tile(t, variant), x * TILE, y * TILE);
      const tr = transitions(map, T, x, y, PRIO[t] || 0);
      const rim = t === 'water' ? FOAM : null;
      // вариант для перехода огрубляем: кэш переходов иначе разрастается втрое
      for (const g of tr) ctx.drawImage(overlay(g.type, variant % 3, g.bits, rim), x * TILE, y * TILE);
    }
    // дороги: линии от центра к центрам соседей — диагонали идут ровно,
    // без «лесенки» из квадратов
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const roadAt = (x, y) => x >= 0 && y >= 0 && x < map.w && y < map.h && map.road[y * map.w + x];
    for (const layer of [{ c: '#7a6444', w: 13 }, { c: '#b39a70', w: 9 }]) {
      ctx.strokeStyle = layer.c; ctx.lineWidth = layer.w;
      ctx.beginPath();
      for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
        if (!map.road[y * map.w + x]) continue;
        const cx = x * TILE + TILE / 2, cy = y * TILE + TILE / 2;
        let links = 0;
        for (const d of DIRS) {
          if (!roadAt(x + d[0], y + d[1])) continue;
          // диагональ не нужна, если тот же путь уже идёт по прямым: иначе треугольник
          if (d[0] && d[1] && (roadAt(x + d[0], y) || roadAt(x, y + d[1]))) continue;
          links++;
          if (d[0] < 0 || (d[0] === 0 && d[1] < 0)) continue; // каждую связь рисуем один раз
          ctx.moveTo(cx, cy); ctx.lineTo(cx + d[0] * TILE, cy + d[1] * TILE);
        }
        if (!links) { ctx.moveTo(cx, cy); ctx.lineTo(cx + 0.1, cy); }
      }
      ctx.stroke();
    }
    // камешки и колеи
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      if (!map.road[y * map.w + x]) continue;
      const px = x * TILE, py = y * TILE;
      ctx.fillStyle = '#95805c';
      for (let i = 0; i < 5; i++) ctx.fillRect(px + rng.int(10, 20), py + rng.int(10, 20), 2, 1);
      ctx.fillStyle = '#c9b287';
      for (let i = 0; i < 3; i++) ctx.fillRect(px + rng.int(10, 20), py + rng.int(10, 20), 1, 1);
    }
    // препятствия (снизу вверх по рядам, чтобы перекрытия были верными)
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const obs = map.obs[y * map.w + x]; if (!obs) continue;
      const sp = obstacleSprite(T[map.terrain[y * map.w + x]], obs, x, y);
      if (sp) Sp.draw(ctx, sp, x * TILE + 16 + ((x * 3 + y) % 3) - 1, y * TILE + 31, 1, (x + y) % 2 === 0);
    }
    bakeLight(ctx, map, state.seed);
    if (z) caveGrade(ctx, map);
    return cv;
  }

  /* ---------- свет ----------
     Запечённый свет карты: крупные пятна света и тени (иначе большие
     однородные зоны выглядят ковром), затенение под скалами и препятствиями
     и тёплое свечение лавы. Всё рисуется поверх готового полотна градиентами —
     попиксельный проход по карте 72×72 стоил бы куда дороже. */
  function bakeLight(ctx, map, seed) {
    const rng = new U.RNG(seed ^ 0x5eed11);
    ctx.save();
    // 1. крупные пятна света и тени
    const step = 6 * TILE;
    for (let y = -step / 2; y < map.h * TILE + step; y += step) {
      for (let x = -step / 2; x < map.w * TILE + step; x += step) {
        const cx = x + rng.int(-40, 40), cy = y + rng.int(-40, 40), r = rng.int(step * 0.7, step * 1.3);
        const up = rng.chance(0.5), a = rng.next() * 0.1 + 0.03;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, (up ? 'rgba(255,244,214,' : 'rgba(20,26,40,') + a.toFixed(3) + ')');
        g.addColorStop(1, (up ? 'rgba(255,244,214,0)' : 'rgba(20,26,40,0)'));
        ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }
    // 2. мягкая тень под скалами и горами — «объём» рельефа
    const T = R.TERRAINS;
    const sh = document.createElement('canvas'); sh.width = 1; sh.height = 10;
    const sg = sh.getContext('2d').createLinearGradient(0, 0, 0, 10);
    sg.addColorStop(0, 'rgba(10,14,24,0.22)'); sg.addColorStop(1, 'rgba(10,14,24,0)');
    sh.getContext('2d').fillStyle = sg; sh.getContext('2d').fillRect(0, 0, 1, 10);
    const smooth0 = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
    for (let y = 1; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const above = (y - 1) * map.w + x;
      const tall = map.obs[above] === 2 || T[map.terrain[above]] === 'rock';
      if (!tall) continue;
      if (map.obs[y * map.w + x] === 2 || T[map.terrain[y * map.w + x]] === 'rock') continue;
      ctx.drawImage(sh, x * TILE, y * TILE, TILE, 10);
    }
    ctx.imageSmoothingEnabled = smooth0;
    // 3. свечение лавы
    ctx.globalCompositeOperation = 'lighter';
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const i = y * map.w + x;
      if (T[map.terrain[i]] !== 'lava' || ((x * 31 + y * 17) % 9)) continue;
      const cx = x * TILE + 16, cy = y * TILE + 16, r = 34;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(255,120,30,0.22)'); g.addColorStop(1, 'rgba(255,120,30,0)');
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  /** Подземелье: общий сумрак и тёплые пятна света у лавы. */
  function caveGrade(ctx, map) {
    const T = R.TERRAINS;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#5b5568'; ctx.fillRect(0, 0, map.w * TILE, map.h * TILE);
    ctx.globalCompositeOperation = 'lighter';
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      if (T[map.terrain[y * map.w + x]] !== 'lava' || ((x * 17 + y * 31) % 7)) continue;
      const cx = x * TILE + 16, cy = y * TILE + 16, r = 48;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(255,140,50,0.20)'); g.addColorStop(1, 'rgba(255,140,50,0)');
      ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  /* Освещение недели: партия проживает неделю от прохладного утра к золотому
     вечеру. Сдвиг слабый (до ~7 %), чтобы не мешать читаемости карты. */
  const DAYLIGHT = [
    { name: 'Раннее утро', col: '#8fb0e0', a: 0.10, warm: 0 },
    { name: 'Утро', col: '#bcd2f0', a: 0.06, warm: 0 },
    { name: 'Полдень', col: '#fff6dc', a: 0.05, warm: 0.04 },
    { name: 'День', col: '#ffffff', a: 0.00, warm: 0 },
    { name: 'После полудня', col: '#ffe9b0', a: 0.05, warm: 0.05 },
    { name: 'Вечер', col: '#ffc98a', a: 0.09, warm: 0.07 },
    { name: 'Закат', col: '#f0a878', a: 0.12, warm: 0.08 },
  ];
  function daylight(day) { return DAYLIGHT[((day - 1) % 7 + 7) % 7]; }
  /** Наложить свет дня на уже отрисованный кадр карты (в координатах карты). */
  function applyDaylight(ctx, day, x, y, w, h) {
    const d = daylight(day);
    if (!d.a) return;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = d.a;
    ctx.fillStyle = d.col; ctx.fillRect(x, y, w, h);
    if (d.warm) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = d.warm; ctx.fillStyle = d.col; ctx.fillRect(x, y, w, h); }
    ctx.restore();
  }

  /** Миникарта: 1 пиксель на тайл (с туманом). */
  function renderMini(state, pid, cv, z) {
    z = z || 0;
    const map = H3.State.lvl(state, z), vis = state.players[pid].vis[z];
    cv.width = map.w; cv.height = map.h;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(map.w, map.h), d = img.data;
    const T = R.TERRAINS;
    for (let i = 0; i < map.w * map.h; i++) {
      let col;
      if (!vis[i]) col = [0, 0, 0];
      else {
        const st = STYLE[T[map.terrain[i]]] || STYLE.grass;
        const hex = st.mini; col = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
        if (map.obs[i] === 2) col = [70, 70, 78]; else if (map.obs[i] === 1) col = [40, 90, 40];
        if (vis[i] === 1) col = col.map(c => c * 0.6 | 0);
      }
      d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; d[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // объекты
    for (const id in state.objects) {
      const o = state.objects[id]; if ((o.z || 0) !== z || !vis[o.y * map.w + o.x]) continue;
      if (o.type === 'town') { const t = state.towns[o.townId]; ctx.fillStyle = t.owner >= 0 ? state.players[t.owner].color : '#aaa'; ctx.fillRect(o.x - 1, o.y - 1, 3, 3); }
      else if (o.type === 'mine') { ctx.fillStyle = o.owner >= 0 ? state.players[o.owner].color : '#ddd'; ctx.fillRect(o.x, o.y, 1, 1); }
      else if (o.type === 'monster') { ctx.fillStyle = '#e04040'; ctx.fillRect(o.x, o.y, 1, 1); }
    }
    for (const id in state.heroes) { const h = state.heroes[id]; if (h.dead || (h.z || 0) !== z || !vis[h.y * map.w + h.x]) continue; ctx.fillStyle = state.players[h.owner].color; ctx.fillRect(h.x - 1, h.y - 1, 3, 3); ctx.fillStyle = '#fff'; ctx.fillRect(h.x, h.y, 1, 1); }
  }

  H3.Terrain = { TILE, STYLE, PRIO, DAYLIGHT, tile, overlay, maskFor, renderMap, renderMini, obstacleSprite, daylight, applyDaylight };
})(typeof window !== 'undefined' ? window : globalThis);
