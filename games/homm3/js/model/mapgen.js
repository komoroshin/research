/* ============================================================================
   model/mapgen.js — генератор случайных карт по зонам (ТЗ §4.5).
   Детерминирован потоком state._rng.map.
   Карта: terrain (индекс R.TERRAINS), road, obs (0 нет, 1 дерево, 2 гора,
   3 камень), block (непроходимо), objAt (id объекта или −1), zone.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, F = H3.Factions, C = H3.Creatures, O = H3.Objects, AR = H3.Artifacts, B = H3.Buildings;

  const TOWN_NAMES = {
    castle: ['Стедвик', 'Уайтстоун', 'Каслгейт', 'Фэрхейвен', 'Брайтвуд', 'Гринфолл'],
    rampart: ['Авли', 'Лесная Гавань', 'Эльфийский Дол', 'Серебряная Роща', 'Тихий Ручей', 'Дубрава'],
    tower: ['Бракада', 'Снежная Вершина', 'Хрустальный Шпиль', 'Академия', 'Ледяной Пик', 'Облачный Двор'],
    inferno: ['Эофол', 'Пекло', 'Кринжень', 'Огненная Пасть', 'Серный Круг', 'Пепелище'],
    necropolis: ['Дейя', 'Курган', 'Могильник', 'Тень', 'Чёрный Погост', 'Ветхий Склеп'],
    dungeon: ['Нигон', 'Глубина', 'Мрачный Провал', 'Бездна', 'Каменное Чрево', 'Тёмный Грот'],
    stronghold: ['Крюлод', 'Костяной Холм', 'Волчий Лог', 'Утёс Грома', 'Оркград', 'Клыкастая Скала'],
    fortress: ['Таталия', 'Топь', 'Змеиное Болото', 'Тростник', 'Гнилой Пруд', 'Мшистый Брод'],
  };
  const MID_TERRAINS = ['grass', 'dirt', 'sand', 'snow', 'swamp', 'rough', 'lava', 'subter'];
  /** Вторичная местность зоны: пятна внутри, чтобы зона не была одноцветной. */
  const SECONDARY = {
    grass: ['dirt', 'rough', 'sand', 'swamp'], dirt: ['grass', 'rough', 'sand'],
    sand: ['dirt', 'rough'], snow: ['rough', 'dirt'], swamp: ['grass', 'dirt'],
    rough: ['dirt', 'grass', 'snow'], lava: ['dirt', 'rough', 'subter'],
    subter: ['rough', 'dirt', 'lava'],
  };

  /* ---------- шум ---------- */
  function makeNoise(rng, size) {
    const g = new Float32Array(size * size);
    for (let i = 0; i < g.length; i++) g[i] = rng.next();
    return function (x, y) {
      const xi = Math.floor(x) % size, yi = Math.floor(y) % size, fx = x - Math.floor(x), fy = y - Math.floor(y);
      const x1 = (xi + 1) % size, y1 = (yi + 1) % size;
      const a = g[yi * size + xi], b = g[yi * size + x1], c = g[y1 * size + xi], d = g[y1 * size + x1];
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      return U.lerp(U.lerp(a, b, sx), U.lerp(c, d, sx), sy);
    };
  }

  /* ---------- шаблоны зон ---------- */
  function template(sizeKey, nPlayers) {
    const starts = {
      S: [[0.2, 0.22], [0.8, 0.78]],
      M: nPlayers === 2 ? [[0.18, 0.2], [0.82, 0.8]] : [[0.18, 0.2], [0.82, 0.2], [0.5, 0.84]],
      L: [[0.15, 0.15], [0.85, 0.85], [0.85, 0.15], [0.15, 0.85]],
    }[sizeKey];
    const mids = { S: [], M: nPlayers === 2 ? [[0.78, 0.22], [0.22, 0.78]] : [[0.5, 0.18], [0.24, 0.6], [0.76, 0.6]], L: [[0.5, 0.12], [0.5, 0.88], [0.12, 0.5], [0.88, 0.5]] }[sizeKey];
    const zones = [];
    for (let i = 0; i < nPlayers; i++) zones.push({ id: zones.length, kind: 'start', nx: starts[i][0], ny: starts[i][1], tier: 1, weight: 1.0, player: i });
    for (const m of mids) zones.push({ id: zones.length, kind: 'mid', nx: m[0], ny: m[1], tier: 2, weight: 0.85 });
    zones.push({ id: zones.length, kind: 'treasure', nx: 0.5, ny: 0.5, tier: 3, weight: sizeKey === 'S' ? 0.8 : 0.95 });
    return zones;
  }
  /** Сила стража на проходе между зонами — по их тирам (старт → mid → сокровищница). */
  function guardValueFor(A, B, rng) {
    const maxTier = Math.max(A.tier, B.tier);
    if (maxTier >= 3) return rng.int(12000, 25000);          // вход в центральную зону
    if (A.kind === 'start' && B.kind === 'start') return rng.int(8000, 16000);
    return rng.int(3000, 6000);                               // старт ↔ промежуточная
  }

  /* ---------- главная функция ---------- */
  function generate(state, size) {
    const rng = state._rng.map;
    const w = size.w, h = size.h, N = w * h;
    const nPlayers = state.players.length;
    const diff = H3.State.DIFFICULTY[state.settings.difficulty] || H3.State.DIFFICULTY.normal;
    const guardMul = diff.guards;

    for (let attempt = 0; attempt < 25; attempt++) {
      const map = newLevel(w, h);
      state.levels = [map, null]; state.objects = {}; state.towns = {}; state.nextId = 1;
      for (const p of state.players) p.towns = [];
      const ctx = { state, map, z: 0, rng, w, h, size, guardMul, occupied: new Uint8Array(N) };
      if (!tryGenerate(ctx, nPlayers)) continue;
      // подземелье вторым слоем + врата между слоями
      const under = newLevel(w, h);
      state.levels[1] = under;
      const uctx = { state, map: under, z: 1, rng, w, h, size, guardMul, occupied: new Uint8Array(N) };
      if (!generateUnder(uctx)) continue;
      if (!placeGates(ctx, uctx)) continue;
      // застава, до ключника которой человеку не дойти (проход в промежуточную зону
      // лежит через сокровищницу), — тупик: такие сразу становятся стражами
      if (H3.Adventure) H3.Adventure.sanitizeGates(state, true);
      return state;
    }
    throw new Error('Не удалось сгенерировать карту');
  }
  function newLevel(w, h) {
    const N = w * h;
    return { w, h, terrain: new Uint8Array(N), road: new Uint8Array(N), obs: new Uint8Array(N), block: new Uint8Array(N), objAt: new Int32Array(N).fill(-1), zone: new Uint8Array(N) };
  }

  function tryGenerate(ctx, nPlayers) {
    const { state, map, rng, w, h, size } = ctx;
    const zones = template(state.settings.size in H3.State.SIZES ? state.settings.size : 'S', nPlayers);
    ctx.zones = zones;
    const noise = makeNoise(rng, 64);
    for (const z of zones) {
      z.cx = Math.round(z.nx * (w - 1) + rng.int(-2, 2)); z.cy = Math.round(z.ny * (h - 1) + rng.int(-2, 2));
      z.cx = U.clamp(z.cx, 4, w - 5); z.cy = U.clamp(z.cy, 4, h - 5);
      z.terrain = z.kind === 'start' ? F.get(state.players[z.player].faction).terrain : rng.pick(MID_TERRAINS);
      z.terrain2 = rng.pick(SECONDARY[z.terrain] || SECONDARY.grass);
    }
    // 1. принадлежность тайлов зонам
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let best = 0, bd = Infinity;
      for (const z of zones) {
        const d = Math.hypot(x - z.cx, y - z.cy) / z.weight + (noise(x / 6, y / 6) - 0.5) * 7;
        if (d < bd) { bd = d; best = z.id; }
      }
      map.zone[y * w + x] = best;
      map.terrain[y * w + x] = R.TERRAIN_INDEX[zones[best].terrain];
    }
    // 1б. пятна вторичной местности — иначе зона выглядит одним ковром
    const patch = makeNoise(rng, 64);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const z = zones[map.zone[y * w + x]];
      if (patch(x / 4.5, y / 4.5) > 0.68) map.terrain[y * w + x] = R.TERRAIN_INDEX[z.terrain2];
    }
    // 1в. море вдоль одного края — до расстановки всего остального,
    // чтобы объекты и проходы сами обходили воду
    carveSea(ctx, zones);
    // 2. границы зон → горы/лес; проходы
    const border = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const z = map.zone[y * w + x];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (map.zone[ny * w + nx] !== z) { border[y * w + x] = 1; break; }
      }
    }
    // фактическая смежность зон: какие пары реально соприкасаются и где
    const pairs = new Map(); // 'a,b' → { a, b, cells: [[x,y]...] }
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      if (!border[y * w + x]) continue;
      const za = map.zone[y * w + x];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const zb = map.zone[(y + dy) * w + x + dx];
        if (zb === za) continue;
        const key = Math.min(za, zb) + ',' + Math.max(za, zb);
        let pr = pairs.get(key);
        if (!pr) { pr = { a: Math.min(za, zb), b: Math.max(za, zb), cells: [] }; pairs.set(key, pr); }
        pr.cells.push([x, y]);
      }
    }
    // остовное дерево по смежности: каждая зона обязана быть достижима
    const zdist = (a, b) => Math.hypot(zones[a].cx - zones[b].cx, zones[a].cy - zones[b].cy);
    const connected = new Set([0]);
    const chosen = [];
    while (connected.size < zones.length) {
      let best = null, bd = Infinity;
      for (const pr of pairs.values()) {
        const inA = connected.has(pr.a), inB = connected.has(pr.b);
        if (inA === inB) continue;
        const d = zdist(pr.a, pr.b) - pr.cells.length * 0.1; // при прочих равных — широкая граница
        if (d < bd) { bd = d; best = pr; }
      }
      if (!best) return false; // зона оторвана от остальных — перегенерируем карту
      chosen.push(best); connected.add(best.a); connected.add(best.b);
    }
    // пара дополнительных проходов, чтобы карта не была цепочкой
    const extras = [...pairs.values()].filter(pr => !chosen.includes(pr))
      .sort((p, q) => q.cells.length - p.cells.length).slice(0, zones.length >= 6 ? 2 : 1);
    chosen.push(...extras);

    const corridor = new Uint8Array(w * h);
    const passages = [];
    for (const pr of chosen) {
      const A = zones[pr.a], Bz = zones[pr.b];
      const mx = (A.cx + Bz.cx) / 2, my = (A.cy + Bz.cy) / 2;
      let best = null, bd = Infinity;
      for (const [x, y] of pr.cells) {
        const d = Math.hypot(x - mx, y - my) + rng.next() * 2;
        if (d < bd) { bd = d; best = [x, y]; }
      }
      if (!best) return false;
      passages.push({ x: best[0], y: best[1], link: { a: pr.a, b: pr.b, value: guardValueFor(A, Bz, rng) } });
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const x = best[0] + dx, y = best[1] + dy;
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        if (Math.abs(dx) + Math.abs(dy) <= 3) corridor[y * w + x] = 1;
      }
    }
    for (let i = 0; i < w * h; i++) if (border[i] && !corridor[i]) map.obs[i] = 2;
    // внешняя рамка карты — горы
    for (let x = 0; x < w; x++) { map.obs[x] = 2; map.obs[(h - 1) * w + x] = 2; }
    for (let y = 0; y < h; y++) { map.obs[y * w] = 2; map.obs[y * w + w - 1] = 2; }
    // утолщение границ (второй слой) — чтобы диагональ не просачивалась
    const obs2 = map.obs.slice();
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      if (obs2[y * w + x] !== 2 || corridor[y * w + x]) continue;
      // диагональные утечки: если (x+1,y+1) и (x,y+1),(x+1,y) свободны в разных зонах — блокируем
      for (const [dx, dy] of [[1, 1], [1, -1]]) {
        const ax = x + dx, ay = y + dy;
        if (map.obs[ay * w + ax] === 2 && map.zone[y * w + ax] !== map.zone[ay * w + x] && !corridor[y * w + ax]) map.obs[y * w + ax] = 2;
      }
    }
    // 3. препятствия внутри зон (лес/озёра/камни) по шуму
    const n2 = makeNoise(rng, 64), n3 = makeNoise(rng, 64);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (map.obs[i] || corridor[i]) continue;
      const z = zones[map.zone[i]];
      if (Math.hypot(x - z.cx, y - z.cy) < 5) continue;
      const v = n2(x / 4.5, y / 4.5), v2 = n3(x / 9, y / 9);
      if (v > 0.68) map.obs[i] = 1; // лес
      else if (v2 > 0.74) { map.terrain[i] = R.TERRAIN_INDEX.water; }
      else if (v < 0.2 && rng.chance(0.25)) map.obs[i] = 3; // камни
    }
    // очистка вокруг проходов
    for (const p of passages) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const x = p.x + dx, y = p.y + dy; if (x < 0 || y < 0 || x >= w || y >= h) continue;
      if (corridor[y * w + x]) { map.obs[y * w + x] = 0; if (map.terrain[y * w + x] === R.TERRAIN_INDEX.water) map.terrain[y * w + x] = R.TERRAIN_INDEX[zones[map.zone[y * w + x]].terrain]; }
    }
    ctx.corridor = corridor; ctx.border = border;
    // 4. города
    for (const z of zones) {
      if (z.kind === 'start') { if (!placeTown(ctx, z, state.players[z.player].faction, z.player)) return false; }
      else if (z.kind === 'treasure' && size.w >= 54) { if (!placeTown(ctx, z, rng.pick(F.LIST).id, -1)) return false; }
    }
    // 5. обязательные объекты и сокровища
    for (const z of zones) if (!populateZone(ctx, z)) return false;
    // 5б. квесты и ключи: провидцы, ключники с заставами, страж-квестор
    placeQuests(ctx, zones, passages);
    // 6. стражи проходов (часть проходов закрыта заставой или квестом, а не стражем)
    for (const p of passages) {
      if (p.gate) { narrowPassage(ctx, p); addObject(ctx, Object.assign({ x: p.x, y: p.y, visited: {} }, p.gate)); }
      else placeGuardAt(ctx, p.x, p.y, p.link.value * ctx.guardMul, 'aggressive');
    }
    // 7. дороги, проверка связности
    rebuildBlock(ctx);
    if (!ensureConnectivity(ctx, passages)) return false;
    buildRoads(ctx, passages);
    rebuildBlock(ctx);
    populateSea(ctx);
    rebuildBlock(ctx);
    return true;
  }

  /* ---------- размещение ---------- */
  function free(ctx, x, y) {
    const { map, w, h } = ctx;
    if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) return false;
    const i = y * w + x;
    return !map.obs[i] && !ctx.occupied[i] && map.terrain[i] !== R.TERRAIN_INDEX.water && map.terrain[i] !== R.TERRAIN_INDEX.rock && !ctx.corridor[i];
  }
  function addObject(ctx, obj) {
    const { state, map, w } = ctx;
    obj.id = state.nextId++;
    obj.z = ctx.z || 0;
    state.objects[obj.id] = obj;
    map.objAt[obj.y * w + obj.x] = obj.id;
    ctx.occupied[obj.y * w + obj.x] = 1;
    const fp = O.get(obj.type).footprint;
    if (fp) for (const [dx, dy] of fp) { const i = (obj.y + dy) * w + obj.x + dx; ctx.occupied[i] = 1; map.obs[i] = 0; }
    return obj;
  }
  function placeTown(ctx, z, faction, owner) {
    const { state, map, w, rng } = ctx;
    // площадка 5×3 + вход снизу
    let x = z.cx, y = z.cy;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) { const i = (y + dy) * w + x + dx; map.obs[i] = 0; map.terrain[i] = R.TERRAIN_INDEX[z.terrain]; }
    const town = {
      id: state.nextId++, name: rng.pick(TOWN_NAMES[faction]), faction, owner, x, y, z: ctx.z || 0, buildings: { hall_1: true }, builtToday: false,
      garrison: [null, null, null, null, null, null, null], visiting: null, avail: [0, 0, 0, 0, 0, 0, 0], guild: {}, tavern: [], capturedDay: 0,
    };
    if (owner >= 0) {
      town.buildings.tavern = true; town.buildings.dwell_1 = true; town.buildings.fort = true;
      town.avail[0] = R.growthOf(town, 1);
      state.players[owner].towns.push(town.id);
    } else {
      // нейтральный город с гарнизоном
      town.buildings.fort = true; town.buildings.dwell_1 = true; town.buildings.dwell_2 = true; town.buildings.dwell_3 = true; town.buildings.citadel = true;
      const power = rng.int(15000, 30000) * ctx.guardMul;
      let left = power;
      for (let t = 3; t >= 1 && left > 0; t--) { const c = F.creaturesOf(faction, t)[0]; const n = Math.max(3, Math.round(left * 0.4 / C.aiValue(c))); R.addToArmy(town.garrison, c.id, n); left -= n * C.aiValue(c); }
      const c4 = F.creaturesOf(faction, 4)[0]; R.addToArmy(town.garrison, c4.id, Math.max(2, Math.round(power * 0.25 / C.aiValue(c4))));
    }
    state.towns[town.id] = town;
    const obj = addObject(ctx, { type: 'town', x, y, townId: town.id, owner });
    town.objId = obj.id;
    // оставить свободной клетку входа (снизу) и не занимать её объектами
    for (let dx = -2; dx <= 2; dx++) ctx.occupied[(y + 1) * w + x + dx] = 1;
    map.objAt[(y + 1) * w + x] = -1; ctx.entranceFree = ctx.entranceFree || []; ctx.entranceFree.push((y + 1) * w + x);
    return true;
  }
  function randomTile(ctx, z, minD, maxD, tries) {
    const { rng, map, w } = ctx;
    for (let t = 0; t < (tries || 200); t++) {
      const a = rng.next() * Math.PI * 2, d = rng.int(minD, maxD);
      const x = Math.round(z.cx + Math.cos(a) * d), y = Math.round(z.cy + Math.sin(a) * d);
      if (!free(ctx, x, y) || map.zone[y * w + x] !== z.id) continue;
      // нужен хотя бы один свободный сосед и расстояние ≥ 2 от других объектов
      let ok = true, freeNb = 0;
      for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= ctx.h) continue;
        if (map.objAt[ny * w + nx] >= 0 && Math.max(Math.abs(dx), Math.abs(dy)) <= 1) { ok = false; break; }
        if (ctx.corridor[ny * w + nx] && Math.max(Math.abs(dx), Math.abs(dy)) <= 1) { ok = false; break; }
        if (Math.max(Math.abs(dx), Math.abs(dy)) === 1 && free(ctx, nx, ny)) freeNb++;
      }
      if (ok && freeNb >= 3) return [x, y];
    }
    return null;
  }
  function guardCreature(ctx, value) {
    const { rng } = ctx;
    // выбираем существо так, чтобы численность была 5..90
    const pool = C.LIST.filter(c => { const n = value / C.aiValue(c); return n >= 4 && n <= 90; });
    const c = pool.length ? rng.pick(pool) : C.get('pikeman');
    const n = Math.max(1, Math.round(value / C.aiValue(c)));
    return { cid: c.id, n };
  }
  function placeGuardAt(ctx, x, y, value, character) {
    const g = guardCreature(ctx, value);
    const mood = ctx.rng.int(character === 'hostile' ? 4 : 1, 10);
    return addObject(ctx, { type: 'monster', x, y, cid: g.cid, n: g.n, mood, character: character || 'aggressive', value: Math.round(value) });
  }
  /** Поставить стража рядом с объектом (на свободной соседней клетке, предпочтительно снизу). */
  function guardObject(ctx, obj, value, character) {
    const { w, h } = ctx;
    const cand = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]];
    for (const [dx, dy] of cand) {
      const x = obj.x + dx, y = obj.y + dy;
      if (!free(ctx, x, y) || ctx.map.objAt[y * w + x] >= 0) continue;
      // страж не должен стоять рядом с чужим объектом (иначе охраняет и его)
      let clash = false;
      for (let ny = y - 1; ny <= y + 1 && !clash; ny++) for (let nx = x - 1; nx <= x + 1; nx++) { if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const id = ctx.map.objAt[ny * w + nx]; if (id >= 0 && id !== obj.id) { clash = true; break; } if (ctx.corridor[ny * w + nx]) { clash = true; break; } }
      if (clash) continue;
      return placeGuardAt(ctx, x, y, value, character);
    }
    return null;
  }
  function placeMine(ctx, z, res, guardValue) {
    const pos = randomTile(ctx, z, 5, Math.round(zoneRadius(ctx, z) * 0.8));
    if (!pos) return null;
    const m = addObject(ctx, { type: 'mine', x: pos[0], y: pos[1], res, owner: -1 });
    if (guardValue) guardObject(ctx, m, guardValue * ctx.guardMul, 'aggressive');
    return m;
  }
  /** Хижины провидца, шатры ключника с заставами на входе в сокровищницу, страж-квестор. */
  function placeQuests(ctx, zones, passages) {
    const { rng, state } = ctx, Q = H3.Quest;
    const arts = Object.values(state.objects).filter(o => o.type === 'artifact' && (o.z || 0) === (ctx.z || 0)).map(o => o.art);
    const cids = Object.values(state.objects).filter(o => o.type === 'dwelling').map(o => o.cid)
      .concat(Object.values(state.towns).map(t => F.creaturesOf(t.faction, 1)[0].id));
    const qctx = { arts, cids };
    // провидцы: по одному в промежуточных зонах, на маленькой карте — в стартовых
    let hutZones = zones.filter(z => z.kind === 'mid'); if (!hutZones.length) hutZones = zones.filter(z => z.kind === 'start');
    for (const z of hutZones) {
      if (!rng.chance(0.8)) continue;
      const pos = randomTile(ctx, z, 4, zoneRadius(ctx, z)); if (!pos) continue;
      addObject(ctx, { type: 'seer_hut', x: pos[0], y: pos[1], quest: Q.randomQuest(rng, z.tier, qctx), reward: Q.randomReward(rng, Math.min(3, z.tier + 1)), visited: {} });
    }
    // заставы: вход в сокровищницу закрывается ключом; шатёр — в той же зоне,
    // из которой идёт проход. Ставить его «в соседнюю» нельзя: на маленькой
    // карте соседняя зона — стартовая зона противника, и ключ за стражем
    // 8–16 тысяч запирал игрока в собственном уделе (кампания, сценарий 1).
    const colors = Q.COLOR_IDS.slice(); rng.shuffle(colors);
    let used = 0;
    const touchesTreasure = p => zones[p.link.a].kind === 'treasure' || zones[p.link.b].kind === 'treasure';
    for (const p of passages) {
      if (!touchesTreasure(p) || used >= colors.length || !rng.chance(0.45)) continue;
      const tentZone = zones[p.link.a].kind === 'treasure' ? zones[p.link.b] : zones[p.link.a];
      const pos = randomTile(ctx, tentZone, 3, zoneRadius(ctx, tentZone)); if (!pos) continue;
      const color = colors[used++];
      addObject(ctx, { type: 'keymaster', x: pos[0], y: pos[1], color, visited: {} });
      p.gate = { type: 'border_guard', color };
    }
    // страж-квестор на одном проходе между обычными зонами: условие всегда достижимо
    const cand = passages.filter(p => !p.gate && !touchesTreasure(p));
    if (cand.length && rng.chance(0.5)) { const p = rng.pick(cand); p.gate = { type: 'quest_guard', quest: Q.randomQuest(rng, 1, {}) }; }
  }
  /** Сузить проход до одной клетки: зона контроля заставы должна перекрывать его целиком. */
  function narrowPassage(ctx, p) {
    const { map, w, h } = ctx;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const x = p.x + dx, y = p.y + dy; if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
      if (Math.max(Math.abs(dx), Math.abs(dy)) <= 1) continue;
      const i = y * w + x;
      if (ctx.border[i] && ctx.corridor[i] && map.objAt[i] < 0 && !ctx.occupied[i]) map.obs[i] = 2;
    }
  }
  function zoneRadius(ctx, z) { return Math.max(8, Math.round(Math.min(ctx.w, ctx.h) * (z.kind === 'treasure' ? 0.22 : 0.2))); }

  function populateZone(ctx, z) {
    const { rng, state } = ctx;
    const rad = zoneRadius(ctx, z);
    const rare = (z.kind === 'start') ? F.get(state.players[z.player].faction).rare : rng.pick(U.RARE);
    if (z.kind === 'start') {
      if (!placeMine(ctx, z, 'wood', rng.int(600, 1000))) return false;
      if (!placeMine(ctx, z, 'ore', rng.int(600, 1000))) return false;
      if (!placeMine(ctx, z, rare, rng.int(1500, 3000))) return false;
      placeResources(ctx, z, rng.int(4, 6), 1);
      placeSimple(ctx, z, 'chest', 2);
      placeDwelling(ctx, z, rng.int(1, 2), 0);
      placeTreasure(ctx, z, 1, 3500);
    } else if (z.kind === 'mid') {
      placeMine(ctx, z, rng.pick(U.RARE), rng.int(2000, 4000));
      placeMine(ctx, z, rng.pick(U.RARE), rng.int(2000, 4000));
      placeMine(ctx, z, 'gold', rng.int(4000, 8000));
      placeMine(ctx, z, rng.pick(['wood', 'ore']), rng.int(1500, 3000));
      placeDwelling(ctx, z, rng.int(3, 4), 3000);
      placeArtifact(ctx, z, 'minor');
      placeResources(ctx, z, rng.int(3, 5), 2);
      placeTreasure(ctx, z, 2, 9000);
    } else {
      placeMine(ctx, z, 'gold', rng.int(6000, 10000));
      placeMine(ctx, z, 'gold', rng.int(6000, 10000));
      placeMine(ctx, z, rng.pick(U.RARE), rng.int(3000, 5000));
      placeDwelling(ctx, z, rng.int(5, 6), 12000);
      placeArtifact(ctx, z, 'relic');
      placeArtifact(ctx, z, 'major');
      placeSimple(ctx, z, 'bank_utopia', 1, 0);
      placeResources(ctx, z, rng.int(3, 5), 3);
      placeTreasure(ctx, z, 3, 14000);
    }
    return true;
  }
  function placeResources(ctx, z, n, tier) {
    const { rng } = ctx;
    for (let i = 0; i < n; i++) {
      const pos = randomTile(ctx, z, 3, zoneRadius(ctx, z)); if (!pos) continue;
      const res = rng.weighted(U.RES, r => (r === 'gold' ? 3 : r === 'wood' || r === 'ore' ? 4 : 2));
      const amount = res === 'gold' ? rng.int(5, 10) * 100 : (r => r === 'wood' || r === 'ore' ? rng.int(5, 10) : rng.int(3, 6))(res);
      addObject(ctx, { type: 'resource', x: pos[0], y: pos[1], res, amount: amount * (tier >= 2 ? 1.5 : 1) | 0 });
    }
  }
  function placeSimple(ctx, z, type, n, guardValue) {
    const { rng } = ctx;
    const out = [];
    for (let i = 0; i < n; i++) {
      const pos = randomTile(ctx, z, 3, zoneRadius(ctx, z)); if (!pos) continue;
      const obj = addObject(ctx, { type, x: pos[0], y: pos[1] });
      initObject(ctx, obj, z);
      if (guardValue) guardObject(ctx, obj, guardValue * ctx.guardMul);
      out.push(obj);
    }
    return out;
  }
  function placeDwelling(ctx, z, tier, guardValue) {
    const { rng } = ctx;
    const pos = randomTile(ctx, z, 4, zoneRadius(ctx, z)); if (!pos) return null;
    const faction = rng.pick(F.LIST).id;
    const c = F.creaturesOf(faction, tier)[0];
    const obj = addObject(ctx, { type: 'dwelling', x: pos[0], y: pos[1], cid: c.id, tier, avail: c.growth, owner: -1 });
    if (guardValue) guardObject(ctx, obj, guardValue * ctx.guardMul);
    return obj;
  }
  function placeArtifact(ctx, z, cls) {
    const { rng } = ctx;
    const pos = randomTile(ctx, z, 4, zoneRadius(ctx, z)); if (!pos) return null;
    const art = rng.pick(AR.byClass(cls));
    const obj = addObject(ctx, { type: 'artifact', x: pos[0], y: pos[1], art: art.id });
    const val = AR.CLASS_VALUE[cls];
    if (val > 2000) guardObject(ctx, obj, Math.min(val * 1.5, 30000) * ctx.guardMul);
    return obj;
  }
  function initObject(ctx, obj, z) {
    const { rng } = ctx;
    const t = O.get(obj.type);
    if (obj.type === 'tree_knowledge') obj.price = rng.pick(['free', 'gold', 'gems']);
    if (obj.type.startsWith('shrine_')) {
      const lvl = +obj.type.slice(-1);
      obj.spell = rng.pick(H3.Spells.byLevel(lvl).filter(s => s.kind !== 'adventure')).id;
    }
    if (obj.type === 'witch_hut') obj.skill = rng.pick(H3.Skills.LIST.filter(s => s.id !== 'necromancy')).id;
    if (obj.type === 'windmill') obj.res = rng.pick(U.RARE);
    if (obj.type === 'pandora_box') Object.assign(obj, H3.Quest.randomPandora(rng, z && z.tier ? z.tier : 2, ctx.guardMul));
    else if (t.bank) { const bk = O.BANKS[obj.type]; obj.guards = bk.guards.map(([cid, n]) => ({ cid, n: Math.max(1, Math.round(n * ctx.guardMul)) })); }
    if (obj.type === 'chest') obj.roll = rng.next();
    obj.visited = {};
  }
  function placeTreasure(ctx, z, tier, budget) {
    const { rng } = ctx;
    const table = O.TREASURE_TABLE.filter(t => t[2] <= tier && !(tier === 1 && t[2] < 1));
    let spent = 0, guardN = 0;
    for (let i = 0; i < 40 && spent < budget; i++) {
      const [type] = rng.weighted(table, t => t[1] * (t[2] === tier ? 2 : 1));
      const pos = randomTile(ctx, z, 3, zoneRadius(ctx, z)); if (!pos) continue;
      let obj, value;
      if (type === 'resource') { placeResources(ctx, z, 1, tier); value = 500; }
      else if (type === 'artifact') { const cls = tier === 1 ? rng.pick(['treasure', 'treasure', 'minor']) : tier === 2 ? rng.pick(['minor', 'major']) : rng.pick(['major', 'relic']); obj = placeArtifact(ctx, z, cls); value = AR.CLASS_VALUE[cls]; }
      else if (type === 'dwelling') { obj = placeDwelling(ctx, z, tier === 1 ? rng.int(1, 2) : tier === 2 ? rng.int(2, 4) : rng.int(4, 6), tier === 1 ? 0 : 2500 * tier); value = 3000; }
      else {
        obj = addObject(ctx, { type, x: pos[0], y: pos[1] });
        initObject(ctx, obj, z);
        value = O.get(type).value;
        if (value > 1500 && !O.get(type).bank && guardN < 6) { guardObject(ctx, obj, Math.min(value * 2, 12000) * ctx.guardMul, rng.pick(['aggressive', 'aggressive', 'friendly', 'hostile'])); guardN++; }
      }
      spent += value || 500;
    }
  }

  /* ---------- проходимость, связность, дороги ---------- */
  function rebuildBlock(ctx) {
    const { map, w, h, state } = ctx;
    for (let i = 0; i < w * h; i++) {
      const t = map.terrain[i];
      map.block[i] = (map.obs[i] || t === R.TERRAIN_INDEX.water || t === R.TERRAIN_INDEX.rock) ? 1 : 0;
    }
    for (const id in state.objects) {
      const o = state.objects[id];
      if ((o.z || 0) !== (ctx.z || 0)) continue;   // объекты другого слоя этот не блокируют
      map.block[o.y * w + o.x] = 1;
      const fp = O.get(o.type).footprint;
      if (fp) for (const [dx, dy] of fp) map.block[(o.y + dy) * w + o.x + dx] = 1;
    }
  }
  function passableForConn(ctx, x, y) {
    const { map, w } = ctx;
    const i = y * w + x;
    const o = map.objAt[i] >= 0 ? ctx.state.objects[map.objAt[i]] : null;
    if (o) return true; // объекты достижимы как цели
    return !map.block[i];
  }
  function ensureConnectivity(ctx, passages) {
    const { state, map, w, h } = ctx;
    const starts = state.players.map(p => state.towns[p.towns[0]]);
    const targets = Object.values(state.objects).filter(o => (o.z || 0) === (ctx.z || 0)).map(o => [o.x, o.y]).concat(passages.map(p => [p.x, p.y]));
    for (let round = 0; round < 3; round++) {
      const seen = H3.Pathfind.reachable(w, h, starts[0].x, starts[0].y + 1, (x, y) => passableForConn(ctx, x, y));
      let fixed = 0;
      for (const [tx, ty] of targets) {
        if (seen[ty * w + tx]) continue;
        // прорубаем прямую от центра зоны цели к цели, потом от ближайшей достижимой клетки
        const z = ctx.zones[map.zone[ty * w + tx]];
        carve(ctx, z.cx, z.cy + 1, tx, ty);
        // и от центра зоны к ближайшему проходу зоны
        let best = null, bd = Infinity;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (seen[y * w + x]) { const d = Math.hypot(x - tx, y - ty); if (d < bd) { bd = d; best = [x, y]; } }
        if (best) carve(ctx, best[0], best[1], tx, ty);
        fixed++;
      }
      rebuildBlock(ctx);
      if (!fixed) break;
    }
    const seen = H3.Pathfind.reachable(w, h, starts[0].x, starts[0].y + 1, (x, y) => passableForConn(ctx, x, y));
    for (const t of starts) if (!seen[(t.y + 1) * w + t.x]) return false;
    let unreachable = 0;
    for (const [tx, ty] of targets) if (!seen[ty * w + tx]) unreachable++;
    return unreachable <= 2;
  }
  function carve(ctx, x0, y0, x1, y1) {
    const { map, w } = ctx;
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
      if (x <= 0 || y <= 0 || x >= w - 1 || y >= ctx.h - 1) continue;
      const idx = y * w + x;
      if (map.objAt[idx] >= 0) continue;
      map.obs[idx] = 0;
      if (map.terrain[idx] === R.TERRAIN_INDEX.water) map.terrain[idx] = R.TERRAIN_INDEX[ctx.zones[map.zone[idx]].terrain];
    }
  }
  function buildRoads(ctx, passages) {
    const { state, map, w, h } = ctx;
    for (const p of state.players) {
      const town = state.towns[p.towns[0]];
      const zid = map.zone[town.y * w + town.x];
      const targets = Object.values(state.objects).filter(o => o.type === 'mine' && (o.z || 0) === (ctx.z || 0) && map.zone[o.y * w + o.x] === zid).map(o => [o.x, o.y])
        .concat(passages.filter(ps => map.zone[ps.y * w + ps.x] === zid || ctx.zones[ps.link.b].player === p.id || ctx.zones[ps.link.a].player === p.id).map(ps => [ps.x, ps.y]));
      const res = H3.Pathfind.dijkstra({ w, h, start: [town.x, town.y + 1], cost: (x, y) => { const i = y * w + x; if (map.block[i] && map.objAt[i] < 0) return Infinity; return map.road[i] ? 50 : R.TERRAIN_COST[map.terrain[i]] || 100; } });
      for (const [tx, ty] of targets) {
        const path = H3.Pathfind.pathTo(res, tx, ty); if (!path) continue;
        for (const [x, y] of path) if (map.objAt[y * w + x] < 0) map.road[y * w + x] = 1;
        map.road[(town.y + 1) * w + town.x] = 1;
      }
    }
  }

  /* ---------- море ----------
     Море нарезается полосой вдоль одного края ещё до расстановки объектов:
     дальше генератор сам обходит воду (free() её исключает), а связность
     проверяется общим механизмом. Вокруг центров стартовых зон — сухой круг,
     чтобы город не оказался на дне. */
  function carveSea(ctx, zones) {
    const { map, rng, w, h } = ctx;
    if (rng.chance(0.25)) return;              // четверть карт — без моря
    const side = rng.int(0, 3);                // 0 север, 1 восток, 2 юг, 3 запад
    const noise = makeNoise(rng, 64);
    const WATER = R.TERRAIN_INDEX.water;
    let cells = 0;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const d = side === 0 ? y : side === 1 ? w - 1 - x : side === 2 ? h - 1 - y : x;
      const band = 2.5 + noise(x / 7, y / 7) * 9;
      if (d > band) continue;
      let dry = false;
      for (const z of zones) { const r = z.kind === 'start' ? 9 : 5; if (Math.hypot(x - z.cx, y - z.cy) < r) { dry = true; break; } }
      if (dry) continue;
      map.terrain[y * w + x] = WATER; cells++;
    }
    if (cells >= 40) ctx.sea = { side, cells };
  }
  /** Что стоит в море и на его берегу: лодки, верфи и морская добыча.
      Всё сажаем только в САМЫЙ БОЛЬШОЙ водоём — иначе лодка окажется
      в трёхклеточной луже, из которой некуда плыть. */
  function populateSea(ctx) {
    const { map, rng, w, h } = ctx;
    if (!ctx.sea) return;
    const WATER = R.TERRAIN_INDEX.water;
    const isWater = (x, y) => x >= 0 && y >= 0 && x < w && y < h && map.terrain[y * w + x] === WATER;
    // компоненты связности воды
    const comp = new Int32Array(w * h).fill(-1);
    let best = -1, bestSize = 0, nComp = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!isWater(x, y) || comp[y * w + x] >= 0) continue;
      const id = nComp++; const q = [[x, y]]; comp[y * w + x] = id; let size = 0;
      while (q.length) {
        const [cx, cy] = q.pop(); size++;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx, ny = cy + dy;
          if (!isWater(nx, ny) || comp[ny * w + nx] >= 0) continue;
          comp[ny * w + nx] = id; q.push([nx, ny]);
        }
      }
      if (size > bestSize) { bestSize = size; best = id; }
    }
    if (bestSize < 30) return;                       // не море, а лужи
    ctx.sea.main = best; ctx.sea.size = bestSize;
    const inSea = (x, y) => isWater(x, y) && comp[y * w + x] === best;
    const shoreWater = [], deepWater = [], shoreLand = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (map.objAt[i] >= 0 || ctx.occupied[i]) continue;
      let near = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && inSea(x + dx, y + dy)) near++;
      if (inSea(x, y)) { if (near >= 7) deepWater.push([x, y]); else if (near >= 3) shoreWater.push([x, y]); }
      else if (near >= 2 && !map.block[i] && !map.road[i]) shoreLand.push([x, y]);
    }
    if (shoreWater.length < 4 || shoreLand.length < 2) return;
    rng.shuffle(shoreWater); rng.shuffle(deepWater); rng.shuffle(shoreLand);
    // верфь на берегу + лодка рядом с ней
    const yard = shoreLand.pop();
    if (yard) {
      addObject(ctx, { type: 'shipyard', x: yard[0], y: yard[1], owner: -1 });
      const spot = shoreWater.find(([x, y]) => Math.abs(x - yard[0]) <= 2 && Math.abs(y - yard[1]) <= 2);
      if (spot) { addObject(ctx, { type: 'boat', x: spot[0], y: spot[1], owner: -1 }); shoreWater.splice(shoreWater.indexOf(spot), 1); }
    }
    if (shoreWater.length) { const b = shoreWater.pop(); addObject(ctx, { type: 'boat', x: b[0], y: b[1], owner: -1 }); }
    // морская добыча в глубине
    const loot = Math.min(deepWater.length, 3 + Math.round(bestSize / 120));
    for (let i = 0; i < loot; i++) {
      const spot = deepWater.pop(); if (!spot) break;
      addObject(ctx, { type: rng.chance(0.55) ? 'flotsam' : 'sea_chest', x: spot[0], y: spot[1] });
    }
  }

  /* ---------- подземелье ----------
     Слой 1 — пещеры: всё скала, в ней выгрызены каверны вокруг центров зон и
     соединяющие их коридоры. Городов нет, зато сокровищ и стражей больше:
     подземелье — риск за награду. */
  const UNDER_TERRAINS = ['subter', 'subter', 'rough', 'lava'];
  function generateUnder(ctx) {
    const { map, rng, w, h, size } = ctx;
    const N = w * h, ROCK = R.TERRAIN_INDEX.rock;
    ctx.corridor = new Uint8Array(N);
    const nz = w >= 70 ? 5 : w >= 50 ? 4 : 3;
    const zones = [];
    for (let i = 0; i < nz; i++) {
      const a = Math.PI * 2 * i / nz + rng.next() * 0.6;
      const rad = Math.min(w, h) * 0.3;
      zones.push({
        id: i, kind: i === 0 ? 'treasure' : 'mid', tier: i === 0 ? 3 : 2,
        cx: U.clamp(Math.round(w / 2 + Math.cos(a) * rad), 7, w - 8),
        cy: U.clamp(Math.round(h / 2 + Math.sin(a) * rad), 7, h - 8),
        terrain: rng.pick(UNDER_TERRAINS), weight: 1,
      });
    }
    ctx.zones = zones;
    // принадлежность клеток кавернам + сплошная скала
    const noise = makeNoise(rng, 64);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let best = 0, bd = Infinity;
      for (const z of zones) { const d = Math.hypot(x - z.cx, y - z.cy) + (noise(x / 6, y / 6) - 0.5) * 8; if (d < bd) { bd = d; best = z.id; } }
      const i = y * w + x;
      map.zone[i] = best;
      map.terrain[i] = ROCK;
    }
    // выгрызаем каверны: шум + расстояние до центра зоны
    const cave = makeNoise(rng, 64);
    for (const z of zones) {
      const rad = Math.round(Math.min(w, h) * 0.26);
      for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
        const x = z.cx + dx, y = z.cy + dy;
        if (x < 2 || y < 2 || x >= w - 2 || y >= h - 2) continue;
        const d = Math.hypot(dx, dy) / rad;
        if (d > 1) continue;
        if (d > 0.3 && cave(x / 5, y / 5) < 0.12 + d * 0.5) continue;   // рваный край каверны
        map.terrain[y * w + x] = R.TERRAIN_INDEX[zones[map.zone[y * w + x]].terrain];
      }
    }
    // коридоры между каверными: цепочка + одна перемычка
    const links = [];
    for (let i = 1; i < zones.length; i++) links.push([i - 1, i]);
    if (zones.length > 2) links.push([zones.length - 1, 0]);
    for (const [a, b] of links) tunnel(ctx, zones[a], zones[b]);
    // редкие препятствия внутри каверн
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (map.terrain[i] === ROCK || ctx.corridor[i]) continue;
      if (cave(x / 3.5, y / 3.5) > 0.86) map.obs[i] = rng.chance(0.5) ? 3 : 2;
    }
    rebuildBlock(ctx);
    // наполнение каверн — реже, чем наверху: пещеры теснее, а стражи перекрывают проходы
    for (const z of zones) populateCave(ctx, z);
    rebuildBlock(ctx);
    // связность подземелья: от центра первой каверны видно все объекты
    const seen = H3.Pathfind.reachable(w, h, zones[0].cx, zones[0].cy, (x, y) => passableForConn(ctx, x, y));
    let bad = 0;
    for (const id in ctx.state.objects) {
      const o = ctx.state.objects[id];
      if ((o.z || 0) !== 1) continue;
      if (!seen[o.y * w + o.x]) bad++;
    }
    ctx.underSeen = seen;
    void size;
    return bad <= 2;
  }
  /** Наполнение каверны: дорого, но редко — иначе стражи запирают узкие проходы. */
  function populateCave(ctx, z) {
    const { rng } = ctx;
    const rich = z.kind === 'treasure';
    placeMine(ctx, z, rng.pick(U.RARE), rng.int(2500, 5000));
    if (rich) placeMine(ctx, z, 'gold', rng.int(6000, 10000));
    placeDwelling(ctx, z, rng.int(rich ? 5 : 3, rich ? 6 : 4), rich ? 9000 : 4000);
    placeArtifact(ctx, z, rich ? 'relic' : 'major');
    placeResources(ctx, z, rng.int(2, 3), rich ? 3 : 2);
    if (rich) placeSimple(ctx, z, 'bank_utopia', 1, 0);
    placeTreasure(ctx, z, rich ? 3 : 2, rich ? 9000 : 5000);
  }
  /** Извилистый тоннель между двумя кавернами (шириной 1–2 клетки). */
  function tunnel(ctx, a, b) {
    const { map, rng, w, h } = ctx;
    let x = a.cx, y = a.cy, guard = 0;
    while ((x !== b.cx || y !== b.cy) && guard++ < w * h) {
      const dx = Math.sign(b.cx - x), dy = Math.sign(b.cy - y);
      if (dx && (!dy || rng.chance(0.5))) x += dx; else if (dy) y += dy;
      for (let oy = 0; oy <= 1; oy++) for (let ox = 0; ox <= 1; ox++) {
        const nx = x + ox, ny = y + oy;
        if (nx < 1 || ny < 1 || nx >= w - 1 || ny >= h - 1) continue;
        const i = ny * w + nx;
        if (map.terrain[i] === R.TERRAIN_INDEX.rock) map.terrain[i] = R.TERRAIN_INDEX[ctx.zones[map.zone[i]].terrain];
        map.obs[i] = 0; ctx.corridor[i] = 1;
      }
    }
  }
  function openNeighbours(ctx, x, y) {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && free(ctx, x + dx, y + dy)) n++;
    return n;
  }
  /** Врата между слоями: пара объектов на одной координате, связанных pairId. */
  function placeGates(ctx, uctx) {
    const { rng, w, h } = ctx;
    const nGates = w >= 70 ? 4 : w >= 50 ? 3 : 2;
    let made = 0;
    for (let attempt = 0; attempt < 400 && made < nGates; attempt++) {
      const x = rng.int(3, w - 4), y = rng.int(3, h - 4);
      if (!free(ctx, x, y) || !free(uctx, x, y)) continue;
      if (!uctx.underSeen[y * w + x]) continue;             // врата должны вести в связную часть пещер
      if (openNeighbours(ctx, x, y) < 3 || openNeighbours(uctx, x, y) < 3) continue;  // не замуровать выход
      let near = false;
      for (const id in ctx.state.objects) { const o = ctx.state.objects[id]; if (o.type === 'subter_gate' && Math.hypot(o.x - x, o.y - y) < 12) { near = true; break; } }
      if (near) continue;
      const pair = made + 1;
      addObject(ctx, { type: 'subter_gate', x, y, pair });
      addObject(uctx, { type: 'subter_gate', x, y, pair });
      made++;
    }
    if (!made) return false;
    rebuildBlock(ctx); rebuildBlock(uctx);
    return true;
  }

  H3.Mapgen = { generate, TOWN_NAMES, guardCreature };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Mapgen;
})(typeof window !== 'undefined' ? window : globalThis);
