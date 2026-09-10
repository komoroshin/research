/* ============================================================================
   model/state.js — единое состояние игры: создание, доступ, видимость,
   сериализация (ТЗ §11.3). Никакого DOM.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, F = H3.Factions, HE = H3.Heroes;
  const VERSION = 3;

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
    // своя карта из редактора: размеры, игроки и цели берём из документа
    const doc = settings.mapData || null;
    const size = doc ? { w: doc.w, h: doc.h, maxPlayers: doc.players.length, name: doc.name } : (SIZES[settings.size] || SIZES.S);
    const seed = (settings.seed >>> 0) || (Date.now() >>> 0);
    const state = {
      version: VERSION, seed, settings: Object.assign({}, settings, { seed }),
      day: 1, turn: 0, nextId: 1, players: [], map: null, objects: {}, heroes: {}, towns: {}, battle: null, log: [], events: [],
      stats: { battles: 0, won: 0, killed: 0, lost: 0 },
      rng: { map: seed, battle: (seed ^ 0x5bd1e995) >>> 0, ai: (seed ^ 0x27d4eb2f) >>> 0, misc: (seed ^ 0x165667b1) >>> 0 },
      winner: null, endReason: null, goals: settings.goals || (doc && doc.goals ? U.clone(doc.goals) : null),
    };
    attachRng(state);
    const rng = state._rng.map;
    const nPlayers = doc ? doc.players.length : 1 + U.clamp(settings.opponents || 1, 1, size.maxPlayers - 1);
    const diff = DIFFICULTY[settings.difficulty] || DIFFICULTY.normal;
    // фракции противников: заданные сценарием (foes) — по порядку, остальные — случайные без повторов
    const foes = (settings.foes || []).filter(f => F.get(f) && f !== settings.faction);
    const factions = F.LIST.map(f => f.id).filter(f => f !== settings.faction && !foes.includes(f));
    rng.shuffle(factions);
    for (let i = 0; i < nPlayers; i++) {
      const fid = doc ? doc.players[i].faction : (i === 0 ? settings.faction : (foes[i - 1] || factions.pop()));
      state.players.push({
        id: i, name: i === 0 ? (settings.name || 'Игрок') : F.PLAYER_NAMES[i] + ' лорд', color: F.PLAYER_COLORS[i], faction: fid, isAI: i > 0,
        res: Object.assign({}, diff.res), heroes: [], towns: [], vis: null, daysWithoutTown: 0, alive: true, visitedObjs: {}, keys: {},
      });
    }
    if (doc) H3.MapEdit.build(state, doc); else H3.Mapgen.generate(state, size);
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
      p.vis = [new Uint8Array(state.levels[0].w * state.levels[0].h), new Uint8Array(state.levels[1].w * state.levels[1].h)];
    }
    // цели сценария заданы шаблоном («вражеский город»), а id известны только
    // после генерации — разворачиваем их здесь
    if (state.goals) resolveGoals(state);
    // герой, перенесённый из прошлого сценария кампании
    if (settings.carryHero) applyCarry(state, settings.carryHero, settings.carry);
    for (const p of state.players) computeVisibility(state, p.id);
    for (const p of state.players) p.income = playerIncome(state, p.id);
    addLog(state, 'Месяц 1, неделя 1, день 1. Партия началась.', 'day');
    syncRng(state);
    return state;
  }

  /** Развернуть шаблонные цели («of: enemy») в конкретные id. */
  function resolveGoals(state) {
    const pick = (g) => {
      if (g.type === 'capture_town' && g.of) {
        const t = Object.values(state.towns).find(x => g.of === 'enemy' ? x.owner > 0 : x.owner === 0);
        if (t) g.townId = t.id;
      }
      if (g.type === 'lose_town' && g.of === 'mine') { const t = Object.values(state.towns).find(x => x.owner === 0); if (t) g.townId = t.id; }
      if (g.type === 'find_artifact' && g.art) {
        // цель-артефакт обязан лежать на карте: если генератор его не положил,
        // подменяем им уже стоящий артефакт (предпочитая охраняемый в подземелье)
        const arts = Object.values(state.objects).filter(o => o.type === 'artifact');
        if (!arts.some(o => o.art === g.art)) {
          const target = arts.find(o => o.z === 1) || arts[arts.length - 1];
          if (target) target.art = g.art;
        }
      }
      if ((g.type === 'defeat_hero' || g.type === 'lose_hero') && g.of) {
        const list = Object.values(state.heroes).filter(h => g.of === 'enemy' ? h.owner > 0 : h.owner === 0);
        if (list.length) g.heroId = list[0].id;
      }
    };
    (state.goals.win || []).forEach(pick);
    (state.goals.lose || []).forEach(pick);
  }
  /** Перенести героя из прошлого сценария кампании на место стартового. */
  /* Правила переноса задаёт сценарий (см. data/campaign.js). Что можно ограничить:
       hero: false — предыдущий герой не приходит вовсе;
       army: 'none' — армию набираешь заново, 'part' — половина каждого отряда и не больше трёх,
             'full' — всё войско целиком;
       arts: false — артефакты, рюкзак и боевые машины остаются в прошлом;
       levelCap: N — уровень срезается до N, лишние очки первичных навыков снимаются с самого
             высокого (это обратная сторона повышений уровня). */
  const DEFAULT_CARRY = { hero: true, army: 'part', arts: true, levelCap: 0 };
  const PART_STACKS = 3;
  function carryRules(rules) { return Object.assign({}, DEFAULT_CARRY, rules || {}); }
  /** Отряды, которые доходят до следующей карты, по правилу армии. */
  function carriedArmy(carry, mode) {
    const src = (carry.army || []).filter(s => s && s.n > 0);
    if (mode === 'none' || !src.length) return [];
    if (mode === 'full') return src.map(s => ({ cid: s.cid, n: s.n }));
    const half = src.map(s => ({ cid: s.cid, n: Math.max(1, Math.ceil(s.n / 2)) }));
    half.sort((a, b) => R.armyPower([b], null) - R.armyPower([a], null));
    return half.slice(0, PART_STACKS);
  }
  function applyCarry(state, carry, rules) {
    const hero = heroesOf(state, 0)[0];
    if (!hero || !carry) return;
    const r = carryRules(rules);
    if (!r.hero) return;   // сценарий начинается с чистого героя
    hero.level = carry.level; hero.xp = carry.xp; hero.pri = U.clone(carry.pri);
    hero.skills = U.clone(carry.skills); hero.spells = carry.spells.slice(); hero.hasBook = carry.hasBook;
    if (r.arts) { hero.arts = U.clone(carry.arts); hero.backpack = carry.backpack.slice(); hero.machines = U.clone(carry.machines || {}); }
    // потолок уровня: снимаем лишние очки с самого высокого первичного навыка
    if (r.levelCap && hero.level > r.levelCap) {
      let extra = hero.level - r.levelCap;
      const keys = ['att', 'def', 'pow', 'kno'];
      while (extra-- > 0) {
        const k = keys.slice().sort((a, b) => hero.pri[b] - hero.pri[a])[0];
        if (hero.pri[k] > 0) hero.pri[k]--;
      }
      hero.level = r.levelCap; hero.xp = HE.xpForLevel(r.levelCap);
    }
    const troops = carriedArmy(carry, r.army);
    if (troops.length) {
      // пришедшие отряды встают первыми; местное ополчение занимает только свободные слоты
      // и не подмешивается к перенесённым — иначе «половина войска» тихо превращалась бы в полторы
      const local = hero.army.filter(s => s && s.n > 0).map(s => ({ cid: s.cid, n: s.n }));
      hero.army = [null, null, null, null, null, null, null];
      for (const s of troops) R.addToArmy(hero.army, s.cid, s.n);
      for (const s of local) {
        if (hero.army.some(x => x && x.cid === s.cid)) continue;
        const free = hero.army.findIndex(x => !x || x.n <= 0);
        if (free >= 0) hero.army[free] = { cid: s.cid, n: s.n };
      }
    }
    hero.name = carry.name; hero.tid = carry.tid; hero.cls = carry.cls; hero.portrait = carry.portrait; hero.spec = carry.spec;
    hero.mana = R.heroMaxMana(hero); hero.move = R.heroMaxMove(hero);
    state.carried = hero.id;
  }
  /** Снимок героя для переноса в следующий сценарий. */
  function carryOf(hero) {
    return {
      tid: hero.tid, name: hero.name, cls: hero.cls, portrait: hero.portrait, spec: hero.spec,
      level: hero.level, xp: hero.xp, pri: U.clone(hero.pri), skills: U.clone(hero.skills),
      spells: hero.spells.slice(), hasBook: hero.hasBook, arts: U.clone(hero.arts), backpack: hero.backpack.slice(),
      machines: U.clone(hero.machines || {}), army: hero.army.map(s => s ? { cid: s.cid, n: s.n } : null),
    };
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

  /* ---------- Доступ ----------
     Карта двухслойная: state.levels[0] — поверхность, [1] — подземелье.
     У героев, объектов и городов есть z; почти все функции принимают его
     последним аргументом (по умолчанию поверхность). */
  function lvl(state, z) { return state.levels[z || 0]; }
  const idx = (state, x, y, z) => y * lvl(state, z).w + x;
  function inMap(state, x, y, z) { const m = lvl(state, z); return x >= 0 && y >= 0 && x < m.w && y < m.h; }
  function terrainAt(state, x, y, z) { return R.TERRAINS[lvl(state, z).terrain[idx(state, x, y, z)]]; }
  function objAt(state, x, y, z) { const id = lvl(state, z).objAt[idx(state, x, y, z)]; return id >= 0 ? state.objects[id] : null; }
  function heroAt(state, x, y, z) { z = z || 0; for (const id in state.heroes) { const h = state.heroes[id]; if (!h.dead && h.x === x && h.y === y && (h.z || 0) === z) return h; } return null; }
  function townAt(state, x, y, z) { z = z || 0; for (const id in state.towns) { const t = state.towns[id]; if (t.x === x && t.y === y && (t.z || 0) === z) return t; } return null; }
  function isBlocked(state, x, y, z) { return !inMap(state, x, y, z) || lvl(state, z).block[idx(state, x, y, z)] === 1; }
  function player(state, id) { return state.players[id]; }
  function heroesOf(state, pid) { return state.players[pid].heroes.map(id => state.heroes[id]).filter(h => h && !h.dead); }
  function townsOf(state, pid) { return state.players[pid].towns.map(id => state.towns[id]); }
  function monstersNear(state, x, y, z) {
    const out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const o = inMap(state, x + dx, y + dy, z) ? objAt(state, x + dx, y + dy, z) : null;
      if (o && o.type === 'monster') out.push(o);
    }
    return out;
  }
  /** Стоимость входа в клетку для героя (с учётом дорог, навыка, полёта). */
  /** Заставы и стражи-квесторы рядом с клеткой: их зона контроля — как у стражей. */
  function gatesNear(state, x, y, z) {
    const out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const o = inMap(state, x + dx, y + dy, z) ? objAt(state, x + dx, y + dy, z) : null;
      if (o && H3.Objects.get(o.type).gate) out.push(o);
    }
    return out;
  }
  function moveCost(state, hero, x, y) {
    const z = hero.z || 0;
    if (!inMap(state, x, y, z)) return Infinity;
    const m = lvl(state, z), i = idx(state, x, y, z);
    const o = objAt(state, x, y, z);
    if (o && H3.Objects.get(o.type).obstacle) return Infinity;
    const water = m.terrain[i] === R.TERRAIN_INDEX.water;
    // под парусом: море проходимо, суша — только чтобы сойти на берег
    if (hero.boat) {
      if (water) return R.SEA_COST;
      if (m.block[i] && !o) return Infinity;
      return R.LAND_COST;
    }
    if (water) return o && o.type === 'boat' ? 100 : Infinity;   // в воду — только сесть в лодку
    if (m.block[i] && !o) return Infinity;   // препятствие; объекты проходимы как цель
    const t = m.terrain[i];
    let c = R.TERRAIN_COST[t];
    if (!(c < Infinity)) return Infinity;
    if (m.road[i]) return R.ROAD_COST;
    const fx = R.artifactFx(hero);
    if (fx.fly) return 100;
    if (c > 100) { const pf = R.skillVal(hero, 'pathfinding'); c = Math.max(100, c - pf); }
    const own = (t === R.TERRAIN_INDEX[F.get(hero.faction).terrain]);
    return own && c > 100 ? Math.max(100, c - 25) : c;
  }
  /** Терминальная клетка: объект с взаимодействием, чужой герой, город, зона контроля стража. */
  function isTerminal(state, hero, x, y) {
    const z = hero.z || 0;
    // высадка на берег заканчивает движение, посадка в лодку — тоже (это объект)
    if (hero.boat && lvl(state, z).terrain[idx(state, x, y, z)] !== R.TERRAIN_INDEX.water) return true;
    const o = objAt(state, x, y, z);
    if (o && !H3.Objects.get(o.type).obstacle) return true;
    const h = heroAt(state, x, y, z);
    if (h && h.id !== hero.id) return true;
    for (const m of monstersNear(state, x, y, z)) if (m) return true;
    if (gatesNear(state, x, y, z).length) return true;
    return false;
  }
  function pathfield(state, hero) {
    const m = lvl(state, hero.z || 0);
    return H3.Pathfind.dijkstra({
      w: m.w, h: m.h, start: [hero.x, hero.y],
      cost: (x, y) => moveCost(state, hero, x, y),
      terminal: (x, y) => isTerminal(state, hero, x, y),
      through: (x, y) => { const o = objAt(state, x, y, hero.z || 0); return !!(o && H3.Objects.get(o.type).gate); },
    });
  }

  /* ---------- Видимость ---------- */
  function reveal(state, pid, cx, cy, radius, level, z) {
    const m = lvl(state, z), vis = state.players[pid].vis[z || 0], w = m.w, h = m.h;
    const r2 = (radius + 0.5) * (radius + 0.5);
    for (let y = Math.max(0, cy - radius); y <= Math.min(h - 1, cy + radius); y++)
      for (let x = Math.max(0, cx - radius); x <= Math.min(w - 1, cx + radius); x++) {
        const d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        if (d <= r2) { const i = y * w + x; if (vis[i] < (level || 2)) vis[i] = level || 2; }
      }
  }
  function heroSight(hero) { return 5 + R.skillVal(hero, 'scouting'); }
  function computeVisibility(state, pid) {
    for (const vis of state.players[pid].vis) for (let i = 0; i < vis.length; i++) if (vis[i] === 2) vis[i] = 1;
    for (const h of heroesOf(state, pid)) reveal(state, pid, h.x, h.y, heroSight(h), 2, h.z || 0);
    for (const t of townsOf(state, pid)) reveal(state, pid, t.x, t.y, 7, 2, t.z || 0);
    for (const id in state.objects) { const o = state.objects[id]; if ((o.type === 'mine' || o.type === 'dwelling') && o.owner === pid) reveal(state, pid, o.x, o.y, 3, 2, o.z || 0); }
  }
  function visible(state, pid, x, y, z) { return inMap(state, x, y, z) ? state.players[pid].vis[z || 0][idx(state, x, y, z)] : 0; }

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
    // оба слоя обязаны восстановиться типизированными массивами, иначе сейв битый
    if (!Array.isArray(state.levels) || state.levels.length !== 2) throw new Error('Сохранение повреждено');
    for (const m of state.levels) {
      if (!m || !(m.terrain instanceof Uint8Array) || !(m.block instanceof Uint8Array) || !(m.objAt instanceof Int32Array) || m.terrain.length !== m.w * m.h) throw new Error('Сохранение повреждено');
    }
    for (const p of state.players) {
      if (!Array.isArray(p.vis) || p.vis.length !== 2) throw new Error('Сохранение повреждено');
      for (let z = 0; z < 2; z++) if (!(p.vis[z] instanceof Uint8Array) || p.vis[z].length !== state.levels[z].w * state.levels[z].h) throw new Error('Сохранение повреждено');
    }
    attachRng(state);
    return state;
  }

  H3.State = {
    lvl, resolveGoals, applyCarry, carryOf, carryRules, carriedArmy, DEFAULT_CARRY,
    VERSION, DIFFICULTY, SIZES, newGame, attachRng, syncRng, learnTownSpells,
    idx, inMap, terrainAt, objAt, heroAt, townAt, isBlocked, player, heroesOf, townsOf, monstersNear, gatesNear, moveCost, isTerminal, pathfield,
    reveal, heroSight, computeVisibility, visible, playerIncome, addLog, dateStr, dayOfWeek, serialize, deserialize,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.State;
})(typeof window !== 'undefined' ? window : globalThis);
