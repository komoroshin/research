/* ============================================================================
   model/mapedit.js — документ карты для редактора и сборка партии по нему.

   Документ (в памяти) — простая структура: два слоя типизированных массивов
   (местность, дороги, препятствия) + список объектов + игроки + цели. Он
   сериализуется в JSON (массивы — в base64), хранится в localStorage и
   экспортируется текстом. build() разворачивает документ в настоящее
   состояние партии — там, где обычная игра зовёт Mapgen.generate.
   Никакого DOM: файл грузится и в node.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, F = H3.Factions, C = H3.Creatures, O = H3.Objects, AR = H3.Artifacts;
  const FMT = 1;

  /* ---------- пустой документ ---------- */
  function blank(sizeKey, nPlayers) {
    const size = H3.State.SIZES[sizeKey] || H3.State.SIZES.S;
    const w = size.w, h = size.h, N = w * h;
    const factions = F.LIST.map(f => f.id);
    const players = [];
    for (let i = 0; i < Math.max(2, Math.min(nPlayers || 2, 4)); i++) players.push({ faction: factions[i % factions.length], ai: i > 0 });
    const doc = {
      fmt: FMT, name: 'Новая карта', desc: '', size: sizeKey || 'S', w, h, difficulty: 'normal',
      players, objects: [], goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
      levels: [newLevel(w, h, 'grass'), newLevel(w, h, 'rock')],
      nextPair: 1,
    };
    // рамка гор по краю поверхности: за карту всё равно нельзя выйти
    const s = doc.levels[0];
    for (let x = 0; x < w; x++) { s.obs[x] = 2; s.obs[(h - 1) * w + x] = 2; }
    for (let y = 0; y < h; y++) { s.obs[y * w] = 2; s.obs[y * w + w - 1] = 2; }
    return doc;
  }
  function newLevel(w, h, terrain) {
    const N = w * h;
    const l = { terrain: new Uint8Array(N), road: new Uint8Array(N), obs: new Uint8Array(N) };
    l.terrain.fill(R.TERRAIN_INDEX[terrain] || 0);
    return l;
  }

  /* ---------- сериализация ---------- */
  function toJSON(doc, pretty) {
    const out = {
      fmt: FMT, name: doc.name, desc: doc.desc, size: doc.size, w: doc.w, h: doc.h, difficulty: doc.difficulty,
      players: doc.players, goals: doc.goals, objects: doc.objects, nextPair: doc.nextPair || 1,
      levels: doc.levels.map(l => ({ terrain: U.u8ToB64(l.terrain), road: U.u8ToB64(l.road), obs: U.u8ToB64(l.obs) })),
    };
    return JSON.stringify(out, null, pretty ? 1 : 0);
  }
  function fromJSON(str) {
    const d = typeof str === 'string' ? JSON.parse(str) : str;
    if (!d || d.fmt !== FMT) throw new Error('Неизвестный формат карты' + (d && d.fmt ? ' (версия ' + d.fmt + ')' : ''));
    if (!d.w || !d.h || !Array.isArray(d.levels) || d.levels.length !== 2) throw new Error('Файл карты повреждён');
    const N = d.w * d.h;
    const levels = d.levels.map(l => {
      const lv = { terrain: U.b64ToU8(l.terrain), road: U.b64ToU8(l.road), obs: U.b64ToU8(l.obs) };
      for (const k of ['terrain', 'road', 'obs']) if (lv[k].length !== N) throw new Error('Файл карты повреждён: слой ' + k);
      return lv;
    });
    return {
      fmt: FMT, name: d.name || 'Карта', desc: d.desc || '', size: d.size || 'S', w: d.w, h: d.h,
      difficulty: d.difficulty || 'normal', players: d.players || [], goals: d.goals || null,
      objects: d.objects || [], levels, nextPair: d.nextPair || 1,
    };
  }
  const clone = doc => fromJSON(toJSON(doc));

  /* ---------- объекты документа ---------- */
  // Что редактор умеет ставить: тип → как заполнить поля по умолчанию.
  function makeObj(type, x, y, z, opts) {
    const o = Object.assign({ type, x, y, z: z || 0 }, opts || {});
    if (type === 'town') { o.faction = o.faction || 'castle'; o.owner = o.owner === undefined ? -1 : o.owner; }
    if (type === 'mine') { o.res = o.res || 'gold'; o.owner = -1; }
    if (type === 'resource') { o.res = o.res || 'gold'; o.amount = o.amount || (o.res === 'gold' ? 800 : o.res === 'wood' || o.res === 'ore' ? 6 : 4); }
    if (type === 'monster') { o.cid = o.cid || 'pikeman'; o.n = o.n || 10; o.character = o.character || 'aggressive'; }
    if (type === 'dwelling') { o.cid = o.cid || 'pikeman'; }
    if (type === 'artifact') { o.art = o.art || 'random'; }
    return o;
  }
  /** Клетки, которые объект занимает целиком (для проверки наложений). */
  function cellsOf(obj) {
    const out = [[obj.x, obj.y]];
    const fp = O.get(obj.type).footprint;
    if (fp) for (const [dx, dy] of fp) out.push([obj.x + dx, obj.y + dy]);
    return out;
  }

  /* ---------- проверка ---------- */
  function validate(doc) {
    const out = [];
    const err = t => out.push({ bad: true, text: t });
    const warn = t => out.push({ bad: false, text: t });
    const W = R.TERRAIN_INDEX.water, RK = R.TERRAIN_INDEX.rock;
    if (!doc.players.length) err('Не задан ни один игрок');
    // города игроков
    doc.players.forEach((p, i) => {
      const towns = doc.objects.filter(o => o.type === 'town' && o.owner === i);
      if (!towns.length) err('У игрока ' + (i + 1) + ' нет города — ему негде начать');
    });
    const seen = Object.create(null);
    for (const o of doc.objects) {
      const t = O.get(o.type);
      if (!t) { err('Неизвестный объект: ' + o.type); continue; }
      const lv = doc.levels[o.z || 0];
      for (const [cx, cy] of cellsOf(o)) {
        if (cx < 0 || cy < 0 || cx >= doc.w || cy >= doc.h) { err(name(o) + ' (' + o.x + ',' + o.y + ') вылезает за край карты'); break; }
        const key = (o.z || 0) + ':' + cx + ':' + cy;
        if (seen[key]) err('Два объекта в одной клетке (' + cx + ',' + cy + ')');
        seen[key] = 1;
      }
      const ti = lv.terrain[o.y * doc.w + o.x];
      if (t.sea) { if (ti !== W) warn(name(o) + ' (' + o.x + ',' + o.y + ') стоит не на воде'); }
      else if (ti === W || ti === RK) err(name(o) + ' (' + o.x + ',' + o.y + ') стоит на непроходимой клетке');
      if (o.type === 'town') {
        const ey = o.y + 1, i = ey * doc.w + o.x;
        if (ey >= doc.h || lv.obs[i] || lv.terrain[i] === W || lv.terrain[i] === RK) err('У города (' + o.x + ',' + o.y + ') перекрыт вход снизу');
      }
    }
    // врата: непарные никуда не ведут
    const pairs = {};
    for (const o of doc.objects) if (o.type === 'subter_gate') { pairs[o.pair] = (pairs[o.pair] || 0) + 1; }
    for (const k in pairs) if (pairs[k] !== 2) warn('Врата №' + k + ': нет пары на другом слое');
    // цели, которые нечем выполнить
    const g = doc.goals || {};
    for (const w2 of (g.win || [])) {
      if (w2.type === 'capture_town' && w2.of === 'enemy' && !doc.objects.some(o => o.type === 'town' && o.owner !== 0)) err('Цель «захватить город врага», но чужих городов на карте нет');
      if (w2.type === 'find_artifact' && !doc.objects.some(o => o.type === 'artifact')) err('Цель «найти артефакт», но артефактов на карте нет');
    }
    if (!(g.win || []).length) err('Не задано ни одного условия победы');
    return out;
  }
  function name(o) {
    if (o.type === 'town') return 'Город ' + (F.get(o.faction) || {}).name;
    if (o.type === 'monster') return 'Стражи ' + ((C.get(o.cid) || {}).name || o.cid);
    return (O.get(o.type) || {}).name || o.type;
  }

  /* ---------- разворачивание документа в партию ---------- */
  function build(state, doc) {
    const w = doc.w, h = doc.h, N = w * h, rng = state._rng.map;
    const guardMul = (H3.State.DIFFICULTY[state.settings.difficulty] || H3.State.DIFFICULTY.normal).guards;
    state.levels = doc.levels.map(l => ({
      w, h, terrain: Uint8Array.from(l.terrain), road: Uint8Array.from(l.road), obs: Uint8Array.from(l.obs),
      block: new Uint8Array(N), objAt: new Int32Array(N).fill(-1), zone: new Uint8Array(N),
    }));
    state.objects = {}; state.towns = {}; state.nextId = 1;
    for (const p of state.players) p.towns = [];
    for (const src of doc.objects) {
      if ((src.owner || 0) >= state.players.length && src.type === 'town') { spawn(state, Object.assign({}, src, { owner: -1 }), rng, guardMul); continue; }
      spawn(state, src, rng, guardMul);
    }
    for (let z = 0; z < 2; z++) rebuildBlock(state, z);
    for (const p of state.players) {
      if (!p.towns.length) throw new Error('У игрока ' + (p.id + 1) + ' нет города на карте');
      // фракция игрока — фракция его первого города: иначе стартовый герой не той школы
      p.faction = state.towns[p.towns[0]].faction;
    }
    return state;
  }
  function put(state, obj) {
    const m = state.levels[obj.z || 0];
    obj.id = state.nextId++;
    state.objects[obj.id] = obj;
    m.objAt[obj.y * m.w + obj.x] = obj.id;
    m.obs[obj.y * m.w + obj.x] = 0;
    const fp = O.get(obj.type).footprint;
    if (fp) for (const [dx, dy] of fp) { const i = (obj.y + dy) * m.w + obj.x + dx; if (i >= 0 && i < m.obs.length) m.obs[i] = 0; }
    return obj;
  }
  function spawn(state, src, rng, guardMul) {
    const z = src.z || 0;
    if (src.type === 'town') return spawnTown(state, src, rng, guardMul);
    const obj = { type: src.type, x: src.x, y: src.y, z, visited: {} };
    const t = O.get(src.type);
    if (src.type === 'mine') { obj.res = src.res; obj.owner = -1; }
    else if (src.type === 'resource') { obj.res = src.res; obj.amount = src.amount; }
    else if (src.type === 'monster') {
      obj.cid = src.cid; obj.n = src.n; obj.character = src.character || 'aggressive';
      obj.mood = rng.int(obj.character === 'hostile' ? 4 : 1, 10);
      obj.value = Math.round(C.aiValue(C.get(src.cid)) * src.n);
    } else if (src.type === 'dwelling') {
      const c = C.get(src.cid); obj.cid = c.id; obj.tier = c.tier; obj.avail = c.growth; obj.owner = -1;
    } else if (src.type === 'artifact') {
      obj.art = src.art && src.art !== 'random' ? src.art : rng.pick(AR.byClass(src.cls || 'minor')).id;
    } else if (src.type === 'subter_gate') { obj.pair = src.pair || 1; }
    else if (src.type === 'boat') { /* без полей */ }
    else {
      if (src.type === 'tree_knowledge') obj.price = src.price || rng.pick(['free', 'gold', 'gems']);
      if (src.type.startsWith('shrine_')) obj.spell = src.spell || rng.pick(H3.Spells.byLevel(+src.type.slice(-1)).filter(s => s.kind !== 'adventure')).id;
      if (src.type === 'witch_hut') obj.skill = src.skill || rng.pick(H3.Skills.LIST.filter(s => s.id !== 'necromancy')).id;
      if (src.type === 'windmill') obj.res = src.res || rng.pick(U.RARE);
      if (src.type === 'chest') obj.roll = rng.next();
      if (t.bank) obj.guards = O.BANKS[src.type].guards.map(([cid, n]) => ({ cid, n: Math.max(1, Math.round(n * guardMul)) }));
    }
    return put(state, obj);
  }
  function spawnTown(state, src, rng, guardMul) {
    const owner = src.owner === undefined ? -1 : src.owner;
    const faction = src.faction;
    const town = {
      id: state.nextId++, name: src.name || rng.pick(H3.Mapgen.TOWN_NAMES[faction]), faction, owner, x: src.x, y: src.y, z: src.z || 0,
      buildings: { hall_1: true }, builtToday: false, garrison: [null, null, null, null, null, null, null],
      visiting: null, avail: [0, 0, 0, 0, 0, 0, 0], guild: {}, tavern: [], capturedDay: 0,
    };
    if (owner >= 0) {
      town.buildings.tavern = true; town.buildings.dwell_1 = true; town.buildings.fort = true;
      town.avail[0] = R.growthOf(town, 1);
      state.players[owner].towns.push(town.id);
    } else {
      town.buildings.fort = true; town.buildings.dwell_1 = true; town.buildings.dwell_2 = true; town.buildings.dwell_3 = true; town.buildings.citadel = true;
      const power = rng.int(15000, 30000) * guardMul;
      let left = power;
      for (let t = 3; t >= 1 && left > 0; t--) { const c = F.creaturesOf(faction, t)[0]; const n = Math.max(3, Math.round(left * 0.4 / C.aiValue(c))); R.addToArmy(town.garrison, c.id, n); left -= n * C.aiValue(c); }
      const c4 = F.creaturesOf(faction, 4)[0]; R.addToArmy(town.garrison, c4.id, Math.max(2, Math.round(power * 0.25 / C.aiValue(c4))));
    }
    state.towns[town.id] = town;
    const obj = put(state, { type: 'town', x: src.x, y: src.y, z: src.z || 0, townId: town.id, owner, visited: {} });
    town.objId = obj.id;
    // клетка входа снизу свободна от препятствий
    const m = state.levels[town.z];
    if (town.y + 1 < m.h) m.obs[(town.y + 1) * m.w + town.x] = 0;
    return obj;
  }
  function rebuildBlock(state, z) {
    const m = state.levels[z], w = m.w;
    for (let i = 0; i < m.block.length; i++) {
      const t = m.terrain[i];
      m.block[i] = (m.obs[i] || t === R.TERRAIN_INDEX.water || t === R.TERRAIN_INDEX.rock) ? 1 : 0;
    }
    for (const id in state.objects) {
      const o = state.objects[id];
      if ((o.z || 0) !== z) continue;
      m.block[o.y * w + o.x] = 1;
      const fp = O.get(o.type).footprint;
      if (fp) for (const [dx, dy] of fp) m.block[(o.y + dy) * w + o.x + dx] = 1;
    }
  }

  H3.MapEdit = { FMT, blank, newLevel, toJSON, fromJSON, clone, makeObj, cellsOf, validate, build, name };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.MapEdit;
})(typeof window !== 'undefined' ? window : globalThis);
