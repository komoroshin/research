/* ============================================================================
   terrain.js — процедурная отрисовка ландшафта карты приключений.
   Тайл 32×32 px. Каждый тип местности: базовая палитра + зерно + декор.
   Карта рендерится один раз в offscreen-canvas (mapCanvas), потом только
   копируется в viewport.
   ========================================================================== */
(function () {
  'use strict';
  const TILE = 32;

  // палитры: base (2-3 оттенка фона), spec (крапинки), deco (декор)
  const TERRAIN_STYLE = {
    grass:  { base: ['#4f9a3c', '#559f41', '#4a9138'], spec: ['#67b04d', '#3f7f2f'], deco: 'grass' },
    dirt:   { base: ['#8a6a44', '#8f6f48', '#83643f'], spec: ['#a0805a', '#6e5232'], deco: 'stones' },
    sand:   { base: ['#d9c27e', '#dec886', '#d3bc78'], spec: ['#eadaa0', '#c2a866'], deco: 'sanddots' },
    snow:   { base: ['#e8eef4', '#edf2f7', '#e1e8ee'], spec: ['#ffffff', '#c9d5de'], deco: 'snow' },
    swamp:  { base: ['#5b7a45', '#5f7f49', '#567340'], spec: ['#7a9a5a', '#3e5a2e', '#4d6f7a'], deco: 'swamp' },
    rough:  { base: ['#9a8a6a', '#a09070', '#948465'], spec: ['#b8a888', '#6f6248'], deco: 'stones' },
    lava:   { base: ['#3a2b2b', '#403030', '#332626'], spec: ['#5a3a3a', '#241818', '#c84a1a'], deco: 'lava' },
    water:  { base: ['#2d68b8', '#3170c0', '#2a62ae'], spec: ['#4a86d4', '#245a9e'], deco: 'waves' },
    rock:   { base: ['#2a2a30', '#2e2e34', '#26262c'], spec: ['#3a3a42', '#1c1c20'], deco: 'rock' },
    subter: { base: ['#6a5a5a', '#706060', '#635353'], spec: ['#7f6f6f', '#4f4040'], deco: 'stones' },
  };

  const cache = new Map();

  function tile(type, variant) {
    const key = type + ':' + variant;
    let cv = cache.get(key);
    if (cv) return cv;
    const st = TERRAIN_STYLE[type] || TERRAIN_STYLE.grass;
    const rng = new U.RNG(U.hashStr(key) ^ 0x51ed27);
    cv = document.createElement('canvas'); cv.width = TILE; cv.height = TILE;
    const ctx = cv.getContext('2d');
    // фон крупными пятнами
    ctx.fillStyle = st.base[0]; ctx.fillRect(0, 0, TILE, TILE);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = st.base[rng.int(0, st.base.length - 1)];
      ctx.fillRect(rng.int(-4, 28), rng.int(-4, 28), rng.int(6, 14), rng.int(6, 14));
    }
    // зерно
    const specN = type === 'snow' ? 10 : 26;
    for (let i = 0; i < specN; i++) {
      ctx.fillStyle = rng.pick(st.spec);
      ctx.fillRect(rng.int(0, 31), rng.int(0, 31), 1 + (rng.chance(0.3) ? 1 : 0), 1);
    }
    // декор
    deco(ctx, st.deco, rng, variant);
    cache.set(key, cv);
    return cv;
  }

  function deco(ctx, kind, rng, variant) {
    const n = variant % 4; // 0 — чистый тайл
    if (kind === 'grass') {
      for (let i = 0; i < n * 2; i++) {
        const x = rng.int(2, 28), y = rng.int(4, 30);
        ctx.fillStyle = '#3c7c2c';
        ctx.fillRect(x, y - 2, 1, 3); ctx.fillRect(x + 2, y - 3, 1, 4); ctx.fillRect(x - 2, y - 1, 1, 2);
        ctx.fillStyle = '#82c65a'; ctx.fillRect(x + 1, y - 1, 1, 1);
      }
    } else if (kind === 'stones') {
      for (let i = 0; i < n; i++) {
        const x = rng.int(2, 26), y = rng.int(2, 26), w = rng.int(3, 6), h = rng.int(2, 4);
        ctx.fillStyle = '#4a4036'; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#b0a494'; ctx.fillRect(x, y, w - 1, h - 1);
        ctx.fillStyle = '#7e7264'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
      }
    } else if (kind === 'sanddots') {
      for (let i = 0; i < n * 3; i++) { ctx.fillStyle = '#b89c5a'; ctx.fillRect(rng.int(0, 30), rng.int(0, 30), 2, 1); }
    } else if (kind === 'snow') {
      for (let i = 0; i < n; i++) { ctx.fillStyle = '#cfdbe4'; ctx.fillRect(rng.int(0, 26), rng.int(0, 28), rng.int(3, 6), 1); }
    } else if (kind === 'swamp') {
      for (let i = 0; i < n; i++) {
        const x = rng.int(2, 24), y = rng.int(2, 26);
        ctx.fillStyle = '#3f6a78'; ctx.fillRect(x, y, rng.int(4, 8), rng.int(2, 4));
        ctx.fillStyle = '#5e8e9a'; ctx.fillRect(x + 1, y, 2, 1);
        ctx.fillStyle = '#2f4a22'; ctx.fillRect(x + 3, y - 3, 1, 3); ctx.fillRect(x + 5, y - 4, 1, 4);
      }
    } else if (kind === 'lava') {
      for (let i = 0; i < n + 1; i++) {
        const x = rng.int(0, 26), y = rng.int(0, 26);
        ctx.fillStyle = '#c8461a'; ctx.fillRect(x, y, rng.int(3, 7), 1); ctx.fillRect(x + 2, y + 1, rng.int(2, 5), 1);
        ctx.fillStyle = '#ffb040'; ctx.fillRect(x + 1, y, 2, 1);
      }
    } else if (kind === 'waves') {
      for (let i = 0; i < 2 + n; i++) {
        const x = rng.int(0, 22), y = rng.int(2, 30);
        ctx.fillStyle = '#6ea2e0'; ctx.fillRect(x, y, rng.int(4, 9), 1);
        ctx.fillStyle = '#1f4f96'; ctx.fillRect(x + 1, y + 1, rng.int(3, 6), 1);
      }
    } else if (kind === 'rock') {
      for (let i = 0; i < 3 + n; i++) {
        const x = rng.int(0, 26), y = rng.int(0, 26);
        ctx.fillStyle = '#44444c'; ctx.fillRect(x, y, rng.int(3, 8), rng.int(2, 6));
        ctx.fillStyle = '#18181c'; ctx.fillRect(x + 1, y + 2, rng.int(2, 6), 1);
      }
    }
  }

  /** Рисует всю карту (terrain + дороги) в canvas. map.terrain[y][x] — тип. */
  function renderMap(map) {
    const cv = document.createElement('canvas');
    cv.width = map.w * TILE; cv.height = map.h * TILE;
    const ctx = cv.getContext('2d');
    const rng = new U.RNG(map.seed ^ 0xabcdef);
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        const t = map.terrain[y][x];
        const v = ((x * 7 + y * 13 + (map.seed & 255)) % 9);
        ctx.drawImage(tile(t, v), x * TILE, y * TILE);
      }
    }
    // мягкие переходы между разными типами: дизеринг соседним цветом у границы
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        const t = map.terrain[y][x];
        const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of nb) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= map.w || ny >= map.h) continue;
          const nt = map.terrain[ny][nx];
          if (nt === t) continue;
          if (t === 'water' || nt === 'water') { // берег — светлая кромка
            ctx.fillStyle = t === 'water' ? '#8fc0e8' : '#e6d8a8';
          } else {
            ctx.fillStyle = (TERRAIN_STYLE[nt] || TERRAIN_STYLE.grass).base[0];
          }
          const px = x * TILE, py = y * TILE;
          for (let i = 0; i < 14; i++) {
            const along = rng.int(0, 31), depth = rng.int(0, 5);
            let sx, sy;
            if (dx === 1) { sx = px + 31 - depth; sy = py + along; }
            else if (dx === -1) { sx = px + depth; sy = py + along; }
            else if (dy === 1) { sx = px + along; sy = py + 31 - depth; }
            else { sx = px + along; sy = py + depth; }
            ctx.fillRect(sx, sy, 1 + (depth < 2 ? 1 : 0), 1);
          }
        }
      }
    }
    // дороги
    if (map.roads) {
      for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
        if (!map.roads[y][x]) continue;
        const px = x * TILE, py = y * TILE;
        const has = (dx, dy) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < map.w && ny < map.h && map.roads[ny][nx]; };
        ctx.fillStyle = '#b39a70';
        ctx.fillRect(px + 10, py + 10, 12, 12);
        if (has(1, 0)) ctx.fillRect(px + 16, py + 10, 16, 12);
        if (has(-1, 0)) ctx.fillRect(px, py + 10, 16, 12);
        if (has(0, 1)) ctx.fillRect(px + 10, py + 16, 12, 16);
        if (has(0, -1)) ctx.fillRect(px + 10, py, 12, 16);
        ctx.fillStyle = '#8f7a56';
        for (let i = 0; i < 8; i++) ctx.fillRect(px + rng.int(10, 21), py + rng.int(10, 21), 2, 1);
      }
    }
    return cv;
  }

  window.Terrain = { TILE, STYLE: TERRAIN_STYLE, tile, renderMap };
})();
