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
  function renderMap(state) {
    const map = state.map;
    const cv = document.createElement('canvas');
    cv.width = map.w * TILE; cv.height = map.h * TILE;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const rng = new U.RNG(state.seed ^ 0xabcdef);
    const T = R.TERRAINS;
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const t = T[map.terrain[y * map.w + x]];
      ctx.drawImage(tile(t, (x * 7 + y * 13 + (state.seed & 255)) % 9), x * TILE, y * TILE);
    }
    // дизеринг границ
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const t = T[map.terrain[y * map.w + x]];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= map.w || ny >= map.h) continue;
        const nt = T[map.terrain[ny * map.w + nx]];
        if (nt === t) continue;
        ctx.fillStyle = (t === 'water' || nt === 'water') ? (t === 'water' ? '#8fc0e8' : '#e6d8a8') : (STYLE[nt] || STYLE.grass).base[0];
        const px = x * TILE, py = y * TILE;
        for (let i = 0; i < 14; i++) {
          const along = rng.int(0, 31), depth = rng.int(0, 5);
          let sx, sy;
          if (dx === 1) { sx = px + 31 - depth; sy = py + along; } else if (dx === -1) { sx = px + depth; sy = py + along; }
          else if (dy === 1) { sx = px + along; sy = py + 31 - depth; } else { sx = px + along; sy = py + depth; }
          ctx.fillRect(sx, sy, 1 + (depth < 2 ? 1 : 0), 1);
        }
      }
    }
    // дороги
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      if (!map.road[y * map.w + x]) continue;
      const px = x * TILE, py = y * TILE;
      const has = (dx, dy) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < map.w && ny < map.h && map.road[ny * map.w + nx]; };
      ctx.fillStyle = '#b39a70';
      ctx.fillRect(px + 10, py + 10, 12, 12);
      if (has(1, 0)) ctx.fillRect(px + 16, py + 10, 16, 12); if (has(-1, 0)) ctx.fillRect(px, py + 10, 16, 12);
      if (has(0, 1)) ctx.fillRect(px + 10, py + 16, 12, 16); if (has(0, -1)) ctx.fillRect(px + 10, py, 12, 16);
      if (has(1, 1)) ctx.fillRect(px + 18, py + 18, 14, 14); if (has(-1, -1)) ctx.fillRect(px, py, 14, 14);
      if (has(1, -1)) ctx.fillRect(px + 18, py, 14, 14); if (has(-1, 1)) ctx.fillRect(px, py + 18, 14, 14);
      ctx.fillStyle = '#8f7a56';
      for (let i = 0; i < 8; i++) ctx.fillRect(px + rng.int(8, 22), py + rng.int(8, 22), 2, 1);
    }
    // препятствия (снизу вверх по рядам, чтобы перекрытия были верными)
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const obs = map.obs[y * map.w + x]; if (!obs) continue;
      const sp = obstacleSprite(T[map.terrain[y * map.w + x]], obs, x, y);
      if (sp) Sp.draw(ctx, sp, x * TILE + 16 + ((x * 3 + y) % 3) - 1, y * TILE + 31, 1, (x + y) % 2 === 0);
    }
    return cv;
  }

  /** Миникарта: 1 пиксель на тайл (с туманом). */
  function renderMini(state, pid, cv) {
    const map = state.map, vis = state.players[pid].vis;
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
      const o = state.objects[id]; if (!vis[o.y * map.w + o.x]) continue;
      if (o.type === 'town') { const t = state.towns[o.townId]; ctx.fillStyle = t.owner >= 0 ? state.players[t.owner].color : '#aaa'; ctx.fillRect(o.x - 1, o.y - 1, 3, 3); }
      else if (o.type === 'mine') { ctx.fillStyle = o.owner >= 0 ? state.players[o.owner].color : '#ddd'; ctx.fillRect(o.x, o.y, 1, 1); }
      else if (o.type === 'monster') { ctx.fillStyle = '#e04040'; ctx.fillRect(o.x, o.y, 1, 1); }
    }
    for (const id in state.heroes) { const h = state.heroes[id]; if (h.dead || !vis[h.y * map.w + h.x]) continue; ctx.fillStyle = state.players[h.owner].color; ctx.fillRect(h.x - 1, h.y - 1, 3, 3); ctx.fillStyle = '#fff'; ctx.fillRect(h.x, h.y, 1, 1); }
  }

  H3.Terrain = { TILE, STYLE, tile, renderMap, renderMini, obstacleSprite };
})(typeof window !== 'undefined' ? window : globalThis);
