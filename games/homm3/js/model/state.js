/* ============================================================================
   model/state.js — единое состояние игры: создание, доступ, видимость,
   сериализация (ТЗ §11.3). Никакого DOM.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, F = H3.Factions, HE = H3.Heroes;
  const VERSION = 2;

  const DIFFICULTY = {
    easy: { name: 'Лёгкая', res: { gold: 30000, wood: 30, ore: 30, mercury: 15, sulfur: 15, crystal: 15, gems: 15 }, aiGold: -0.25, aiWood: 0, aiRare: 0, guards: 0.8, aiSmart: false, dip: 1,
      desc: 'Больше стартовых ресурсов, ИИ получает −25 % золота, стражи слабее, ИИ не использует ожидание и массовые заклинания.' },
    normal: { name: 'Нормальная', res: { gold: 20000, wood: 20, ore: 20, mercury: 10, sulfur: 10, crystal: 10, gems: 10 }, aiGold: 0, aiWood: 0, aiRare: 0, guards: 1, aiSmart: true, dip: 0,
      desc: 'Стандартные условия: ни у кого нет бонусов.' },
    hard: { name: 'Сложная', res: { gold: 15000, wood: 15, ore: 15, mercury: 7, sulfur: 7, crystal: 7, gems: 7 }, aiGold: 0.25, aiWood: 0.4, aiRare: 0.15, guards: 1, aiSmart: true, dip: 0,
      desc: 'Меньше стартовых ресурсов, ИИ получает +25 % золота, +40 % дерева и руды, +15 % редких ресурсов.' },
    expert: { name: 'Экспертная', res: { gold: 10000, wood: 10, ore: 10, mercury: 4, sulfur: 4, crystal: 4, gems: 4 }, aiGold: 0.5, aiWood: 0.5, aiRare: 0.3, guards: 1.2, aiSmart: true, dip: 0,
      desc: 'Мало стартовых ресурсов, ИИ получает +50 % золота, дерева и руды, +30 % редких, стражи сильнее на 20 %.' },
  };
  const SIZES = { S: { w: 36, h: 36, name: 'Маленькая (36×36)', maxPlayers: 2 }, M: { w: 54, h: 54, name: 'Средняя (54×54)', maxPlayers: 3 }, L: { w: 72, h: 72, name: 'Большая (72×72)', maxPlayers: 4 } };

  /* ---------- RNG-потоки ---------- */
  function attachRng(state) {
    state._rng = {};
    for (const k of ['map', 'battle', 'ai', 'misc']) state._rng[k] = new U.RNG(state.rng[k]);
    return state;
  }
  function syncRng(state) { for (const k in state._rng) state.rng[k] = state._rng[k].save(); }

  /* ---------- Создание партии ---------- */
  function newGame(settings) {
    const size = SIZES[settings.size] || SIZES.S;
    const seed = (settings.seed >>> 0) || (Date.now() >>> 0);
    const state = {
      version: VERSION, seed, settings: Object.assign({}, settings, { seed }),
      day: 1, turn: 0, nextId: 1, players: [], map: null, objects: {}, heroes: {}, towns: {}, battle: null, log: [], events: [],
      stats: { battles: 0, won: 0, killed: 0, lost: 0 },
      rng: { map: seed, battle: (seed ^ 0x5bd1e995) >>> 0, ai: (seed ^ 0x27d4eb2f) >>> 0, misc: (seed ^ 0x165667b1) >>> 0 },
      winner: null,
    };
    attachRng(state);
    const rng = state._rng.map;
    const nPlayers = 1 + U.clamp(settings.opponents || 1, 1, size.maxPlayers - 1);
    const diff = DIFFICULTY[settings.difficulty] || DIFFICULTY.normal;
    const factions = F.LIST.map(f => f.id).filter(f => f !== settings.faction);
    rng.shuffle(factions);
    for (let i = 0; i < nPlayers; i++) {
      const fid = i === 0 ? settings.faction : factions.pop();
      state.players.push({
        id: i, name: i === 0 ? (settings.name || 'Игрок') : F.PLAYER_NAMES[i] + ' лорд', color: F.PLAYER_COLORS[i], faction: fid, isAI: i > 0,
        res: Object.assign({}, diff.res), heroes: [], towns: [], vis: null, daysWithoutTown: 0, alive: true, visitedObjs: {},
      });
    }
    H3.Mapgen.generate(state, size);
    // стартовые герои
    for (const p of state.players) {
      const town = state.towns[p.towns[0]];
      let tid = p.id === 0 && settings.hero ? settings.hero : null;
      if (!tid) { const pool = HE.heroesOfFaction(p.faction).filter(h => !Object.values(state.heroes).some(x => x.tid === h.id)); tid = rng.pick(pool).id; }
      const hero = R.makeHero(state, tid, p.id, town.x, town.y, true);
      p.heroes.push(hero.id);
      town.visiting = hero.id;
      hero.inTown = town.id;
      if (R.guildLevel(town)) learnTownSpells(state, hero, town);
      town.tavern = R.tavernCandidates(state, town, 2);
      p.vis = new Uint8Array(state.map.w * state.map.h);
    }
    for (const p of state.players) computeVisibility(state, p.id);
    for (const p of state.players) p.income = playerIncome(state, p.id);
    addLog(state, 'Месяц 1, неделя 1, день 1. Партия началась.', 'day');
    syncRng(state);
    return state;
  }

  function learnTownSpells(state, hero, town) {
    if (!hero.hasBook) return [];
    const learned = [];
    for (const sid of R.townSpells(town)) {
      const sp = H3.Spells.get(sid);
      if (!hero.spells.includes(sid) && R.canLearn(hero, sp)) { hero.spells.push(sid); learned.push(sid); }
    }
    return learned;
  }

  /* ---------- Доступ ---------- */
  const idx = (state, x, y) => y * state.map.w + x;
  function inMap(state, x, y) { return x >= 0 && y >= 0 && x < state.map.w && y < state.map.h; }
  function terrainAt(state, x, y) { return R.TERRAINS[state.map.terrain[idx(state, x, y)]]; }
  function objAt(state, x, y) { const id = state.map.objAt[idx(state, x, y)]; return id >= 0 ? state.objects[id] : null; }
  function heroAt(state, x, y) { for (const id in state.heroes) { const h = state.heroes[id]; if (!h.dead && h.x === x && h.y === y) return h; } return null; }
  function townAt(state, x, y) { for (const id in state.towns) { const t = state.towns[id]; if (t.x === x && t.y === y) return t; } return null; }
  function isBlocked(state, x, y) { return !inMap(state, x, y) || state.map.block[idx(state, x, y)] === 1; }
  function player(state, id) { return state.players[id]; }
  function heroesOf(state, pid) { return state.players[pid].heroes.map(id => state.heroes[id]).filter(h => h && !h.dead); }
  function townsOf(state, pid) { return state.players[pid].towns.map(id => state.towns[id]); }
  function monstersNear(state, x, y) {
    const out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const o = inMap(state, x + dx, y + dy) ? objAt(state, x + dx, y + dy) : null;
      if (o && o.type === 'monster') out.push(o);
    }
    return out;
  }
  /** Стоимость входа в клетку для героя (с учётом дорог, навыка, полёта). */
  function moveCost(state, hero, x, y) {
    if (!inMap(state, x, y)) return Infinity;
    const i = idx(state, x, y);
    if (state.map.block[i]) {
      const o = objAt(state, x, y);
      if (!o) return Infinity; // препятствие
      // объекты проходимы как цель (терминальные), кроме препятствий
      if (H3.Objects.get(o.type).obstacle) return Infinity;
    }
    const t = state.map.terrain[i];
    let c = R.TERRAIN_COST[t];
    if (!(c < Infinity)) return Infinity;
    if (state.map.road[i]) return R.ROAD_COST;
    const fx = R.artifactFx(hero);
    if (fx.fly) return 100;
    if (c > 100) { const pf = R.skillVal(hero, 'pathfinding'); c = Math.max(100, c - pf); }
    const own = (t === R.TERRAIN_INDEX[F.get(hero.faction).terrain]);
    return own && c > 100 ? Math.max(100, c - 25) : c;
  }
  /** Терминальная клетка: объект с взаимодействием, чужой герой, город, зона контроля стража. */
  function isTerminal(state, hero, x, y) {
    const o = objAt(state, x, y);
    if (o && !H3.Objects.get(o.type).obstacle) return true;
    const h = heroAt(state, x, y);
    if (h && h.id !== hero.id) return true;
    for (const m of monstersNear(state, x, y)) if (m) return true;
    return false;
  }
  function pathfield(state, hero) {
    return H3.Pathfind.dijkstra({
      w: state.map.w, h: state.map.h, start: [hero.x, hero.y],
      cost: (x, y) => moveCost(state, hero, x, y),
      terminal: (x, y) => isTerminal(state, hero, x, y),
    });
  }

  /* ---------- Видимость ---------- */
  function reveal(state, pid, cx, cy, radius, level) {
    const vis = state.players[pid].vis, w = state.map.w, h = state.map.h;
    const r2 = (radius + 0.5) * (radius + 0.5);
    for (let y = Math.max(0, cy - radius); y <= Math.min(h - 1, cy + radius); y++)
      for (let x = Math.max(0, cx - radius); x <= Math.min(w - 1, cx + radius); x++) {
        const d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        if (d <= r2) { const i = y * w + x; if (vis[i] < (level || 2)) vis[i] = level || 2; }
      }
  }
  function heroSight(hero) { return 5 + R.skillVal(hero, 'scouting'); }
  function computeVisibility(state, pid) {
    const vis = state.players[pid].vis;
    for (let i = 0; i < vis.length; i++) if (vis[i] === 2) vis[i] = 1;
    for (const h of heroesOf(state, pid)) reveal(state, pid, h.x, h.y, heroSight(h));
    for (const t of townsOf(state, pid)) reveal(state, pid, t.x, t.y, 7);
    for (const id in state.objects) { const o = state.objects[id]; if ((o.type === 'mine' || o.type === 'dwelling') && o.owner === pid) reveal(state, pid, o.x, o.y, 3); }
  }
  function visible(state, pid, x, y) { return inMap(state, x, y) ? state.players[pid].vis[idx(state, x, y)] : 0; }

  /* ---------- Доход ---------- */
  function playerIncome(state, pid) {
    const inc = { gold: 0, wood: 0, ore: 0, mercury: 0, sulfur: 0, crystal: 0, gems: 0 };
    for (const t of townsOf(state, pid)) U.addRes(inc, R.townIncome(t));
    for (const id in state.objects) { const o = state.objects[id]; if (o.type === 'mine' && o.owner === pid) inc[o.res] += H3.Objects.MINE_INCOME[o.res]; }
    for (const h of heroesOf(state, pid)) {
      inc.gold += R.skillVal(h, 'estates');
      if (h.spec && h.spec.type === 'resource') { if (h.spec.id === 'gold') inc.gold += 350; else inc[h.spec.id] += 1; }
    }
    return inc;
  }

  /* ---------- Лог ---------- */
  function addLog(state, text, cls, pid) {
    state.log.push({ day: state.day, text, cls: cls || '', p: pid === undefined ? -1 : pid });
    if (state.log.length > 300) state.log.splice(0, state.log.length - 300);
  }
  function dateStr(day) {
    const d = day - 1;
    return 'Месяц ' + (Math.floor(d / 28) + 1) + ', неделя ' + (Math.floor((d % 28) / 7) + 1) + ', день ' + ((d % 7) + 1);
  }
  const dayOfWeek = day => ((day - 1) % 7) + 1;

  /* ---------- Сериализация ---------- */
  function serialize(state) {
    syncRng(state);
    const repl = (k, v) => {
      if (k && k[0] === '_') return undefined;
      // маркеры не начинаются с '_': иначе их вырежет фильтр служебных полей выше
      if (v instanceof Uint8Array) return { $u8: U.u8ToB64(v) };
      if (v instanceof Int32Array) return { $i32: U.u8ToB64(new Uint8Array(v.buffer)) };
      if (v instanceof Int16Array) return { $i16: U.u8ToB64(new Uint8Array(v.buffer)) };
      return v;
    };
    return JSON.stringify({ version: VERSION, state }, repl);
  }
  function deserialize(str) {
    const rev = (k, v) => {
      if (v && typeof v === 'object') {
        if (v.$u8) return U.b64ToU8(v.$u8);
        if (v.$i32) { const u = U.b64ToU8(v.$i32); return new Int32Array(u.buffer, u.byteOffset, u.length / 4); }
        if (v.$i16) { const u = U.b64ToU8(v.$i16); return new Int16Array(u.buffer, u.byteOffset, u.length / 2); }
      }
      return v;
    };
    const data = JSON.parse(str, rev);
    if (!data || data.version !== VERSION) throw new Error('Неизвестная версия сохранения: ' + (data && data.version));
    const state = data.state;
    // карта обязана восстановиться типизированными массивами, иначе сейв битый
    const m = state.map;
    if (!m || !(m.terrain instanceof Uint8Array) || !(m.block instanceof Uint8Array) || !(m.objAt instanceof Int32Array) || m.terrain.length !== m.w * m.h) throw new Error('Сохранение повреждено');
    for (const p of state.players) if (!(p.vis instanceof Uint8Array) || p.vis.length !== m.w * m.h) throw new Error('Сохранение повреждено');
    attachRng(state);
    return state;
  }

  H3.State = {
    VERSION, DIFFICULTY, SIZES, newGame, attachRng, syncRng, learnTownSpells,
    idx, inMap, terrainAt, objAt, heroAt, townAt, isBlocked, player, heroesOf, townsOf, monstersNear, moveCost, isTerminal, pathfield,
    reveal, heroSight, computeVisibility, visible, playerIncome, addLog, dateStr, dayOfWeek, serialize, deserialize,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.State;
})(typeof window !== 'undefined' ? window : globalThis);
