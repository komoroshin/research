/* ============================================================================
   model/rules.js — правила игры, не зависящие от экрана: статы героя,
   движение, мораль/удача, опыт и уровни, доход, прирост, стройка, найм, армия.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, C = H3.Creatures, F = H3.Factions, B = H3.Buildings, SK = H3.Skills, SP = H3.Spells, AR = H3.Artifacts, HE = H3.Heroes;

  /* ---------- Местность ---------- */
  const TERRAINS = ['grass', 'dirt', 'sand', 'snow', 'swamp', 'rough', 'lava', 'subter', 'water', 'rock'];
  const TERRAIN_COST = [100, 100, 150, 150, 175, 125, 100, 100, Infinity, Infinity];
  const TERRAIN_NAMES = { grass: 'Трава', dirt: 'Грязь', sand: 'Песок', snow: 'Снег', swamp: 'Болото', rough: 'Холмы', lava: 'Лава', subter: 'Подземная земля', water: 'Вода', rock: 'Скалы' };
  const TERRAIN_INDEX = Object.create(null);
  TERRAINS.forEach((t, i) => { TERRAIN_INDEX[t] = i; });
  const ROAD_COST = 75;

  /* ---------- Артефакты и производные статы героя ---------- */
  function artifactFx(hero) {
    const fx = {};
    for (const slot in hero.arts) {
      const art = AR.get(hero.arts[slot]); if (!art) continue;
      for (const k in art.fx) fx[k] = (fx[k] || 0) + art.fx[k];
    }
    return fx;
  }
  function heroPrimary(hero) {
    const fx = artifactFx(hero);
    return {
      att: Math.max(0, hero.pri.att + (fx.att || 0)), def: Math.max(0, hero.pri.def + (fx.def || 0)),
      pow: Math.max(1, hero.pri.pow + (fx.pow || 0)), kno: Math.max(1, hero.pri.kno + (fx.kno || 0)),
    };
  }
  function skillLvl(hero, id) { return (hero.skills && hero.skills[id]) || 0; }
  function skillVal(hero, id) { const l = skillLvl(hero, id); if (!l) return 0; let v = SK.get(id).value[l - 1]; if (hero.spec && hero.spec.type === 'skill' && hero.spec.id === id) v = v * (1 + 0.05 * hero.level); return v; }
  function heroMaxMana(hero) { const p = heroPrimary(hero); return Math.floor(p.kno * 10 * (1 + skillVal(hero, 'intelligence') / 100)); }

  /* ---------- Армия ---------- */
  function slowestSpeed(army) {
    let s = Infinity;
    for (const st of army) if (st && st.n > 0) s = Math.min(s, C.get(st.cid).speed);
    return s === Infinity ? 11 : s;
  }
  const MOVE_BASE = { 0: 1500, 1: 1500, 2: 1500, 3: 1500, 4: 1560, 5: 1630, 6: 1700, 7: 1760, 8: 1830, 9: 1900, 10: 1960 };
  function heroMaxMove(hero) {
    const sp = slowestSpeed(hero.army);
    let base = sp >= 11 ? 2000 : MOVE_BASE[sp];
    base = Math.floor(base * (1 + skillVal(hero, 'logistics') / 100));
    const fx = artifactFx(hero);
    base += fx.move || 0;
    base += (hero.bonuses && hero.bonuses.move) || 0;
    return base;
  }
  function armySize(army) { return army.filter(s => s && s.n > 0).length; }
  function armyEmpty(army) { return armySize(army) === 0; }
  /** Добавить существ в армию; возвращает, сколько не влезло. */
  function addToArmy(army, cid, n) {
    if (n <= 0) return 0;
    for (const st of army) if (st && st.cid === cid) { st.n += n; return 0; }
    for (let i = 0; i < 7; i++) if (!army[i] || army[i].n <= 0) { army[i] = { cid, n }; return 0; }
    return n;
  }
  function canAddToArmy(army, cid) { return army.some(s => s && s.cid === cid) || armySize(army) < 7; }
  function armyPower(army, hero) {
    let v = 0;
    for (const st of army) if (st && st.n > 0) v += C.aiValue(C.get(st.cid)) * st.n;
    if (hero) { const p = heroPrimary(hero); v *= 1 + 0.05 * (p.att + p.def); }
    return Math.round(v);
  }
  function armyCost(army) {
    const cost = {};
    for (const st of army) if (st && st.n > 0) U.addRes(cost, C.get(st.cid).cost, st.n);
    return cost;
  }
  function cleanArmy(army) { for (let i = 0; i < 7; i++) if (army[i] && army[i].n <= 0) army[i] = null; return army; }
  function factionsInArmy(army) {
    const s = new Set();
    for (const st of army) if (st && st.n > 0) s.add(C.get(st.cid).faction);
    return s;
  }

  /* ---------- Мораль и удача ---------- */
  function heroMorale(hero, extra) {
    const parts = [];
    let v = 0;
    const l = skillVal(hero, 'leadership'); if (l) { v += l; parts.push(['Лидерство', l]); }
    const fx = artifactFx(hero); if (fx.morale) { v += fx.morale; parts.push(['Артефакты', fx.morale]); }
    const fs = factionsInArmy(hero.army);
    if (fs.size === 1) { v += 1; parts.push(['Одна фракция', 1]); }
    else if (fs.size >= 3) { const m = -(fs.size - 2); v += m; parts.push([fs.size + ' фракции', m]); }
    let hasUndead = false, hasLiving = false, angels = false;
    for (const st of hero.army) if (st && st.n > 0) { const c = C.get(st.cid); if (C.isUndead(c)) hasUndead = true; else if (!C.noMorale(c)) hasLiving = true; if (C.hasAb(c, 'moraleBonus')) angels = true; }
    if (hasUndead && hasLiving) { v -= 1; parts.push(['Нежить в армии', -1]); }
    if (angels) { v += 1; parts.push(['Ангелы', 1]); }
    if (hero.bonuses && hero.bonuses.morale) { v += hero.bonuses.morale; parts.push(['Посещение', hero.bonuses.morale]); }
    if (extra) for (const [name, val] of extra) { v += val; parts.push([name, val]); }
    return { value: U.clamp(v, -3, 3), parts };
  }
  function heroLuck(hero, extra) {
    const parts = [];
    let v = 0;
    const l = skillVal(hero, 'luck'); if (l) { v += l; parts.push(['Удача (навык)', l]); }
    const fx = artifactFx(hero); if (fx.luck) { v += fx.luck; parts.push(['Артефакты', fx.luck]); }
    if (hero.bonuses && hero.bonuses.luck) { v += hero.bonuses.luck; parts.push(['Посещение', hero.bonuses.luck]); }
    if (extra) for (const [name, val] of extra) { v += val; parts.push([name, val]); }
    return { value: U.clamp(v, -3, 3), parts };
  }
  const MORALE_CHANCE = { 1: 1 / 24, 2: 1 / 12, 3: 1 / 8, '-1': 1 / 12, '-2': 1 / 6, '-3': 1 / 4 };
  const LUCK_CHANCE = { 1: 1 / 24, 2: 1 / 12, 3: 1 / 8 };

  /* ---------- Опыт и уровни ---------- */
  function xpToNext(hero) { return HE.xpForLevel(hero.level + 1); }
  /** Начисляет опыт (с Learning); возвращает число новых уровней (левел-апы применяются отдельно). */
  function gainXp(hero, amount) {
    amount = Math.round(amount * (1 + skillVal(hero, 'learning') / 100));
    hero.xp += amount;
    let n = 0;
    while (hero.xp >= HE.xpForLevel(hero.level + 1 + n)) n++;
    return n;
  }
  function pendingLevels(hero) { let n = 0; while (hero.xp >= HE.xpForLevel(hero.level + 1 + n)) n++; return n; }
  /** Формирует выбор при повышении: первичный навык + два вторичных. */
  function levelUpOptions(hero, rng) {
    const cl = HE.getClass(hero.cls);
    const grow = Object.assign({}, cl.grow);
    if (hero.level >= 10 && cl.type === 'might') { grow.att -= 5; grow.def -= 5; grow.pow += 5; grow.kno += 5; }
    const pri = rng.weighted(['att', 'def', 'pow', 'kno'], k => Math.max(1, grow[k]));
    const have = Object.keys(hero.skills || {});
    const upgradable = have.filter(id => hero.skills[id] < 3);
    const canNew = have.length < SK.MAX_SKILLS;
    const fresh = SK.LIST.filter(s => !hero.skills[s.id] && s.w[cl.type] > 0 && !(s.id === 'necromancy' && cl.faction !== 'necropolis'));
    const choices = [];
    if (upgradable.length) { const id = rng.pick(upgradable); choices.push({ id, lvl: hero.skills[id] + 1 }); }
    if (canNew && fresh.length) {
      const s = rng.weighted(fresh, x => x.w[cl.type] * (cl.faction === 'necropolis' && x.id === 'necromancy' ? 6 : 1));
      choices.push({ id: s.id, lvl: 1 });
    } else if (upgradable.length > 1) {
      const rest = upgradable.filter(id => id !== choices[0].id); const id = rng.pick(rest); choices.push({ id, lvl: hero.skills[id] + 1 });
    }
    return { pri, choices };
  }
  function applyLevelUp(hero, pri, choice) {
    hero.level += 1;
    hero.pri[pri] += 1;
    if (choice) hero.skills[choice.id] = choice.lvl;
    if (pri === 'kno') hero.mana = Math.min(heroMaxMana(hero), hero.mana + 10);
  }

  /* ---------- Город: доход, прирост, стройка, найм ---------- */
  function townHallLevel(town) { for (let i = 4; i >= 1; i--) if (town.buildings['hall_' + i]) return i; return 1; }
  function townIncome(town) {
    let gold = B.BY_ID['hall_' + townHallLevel(town)].income;
    const res = { gold };
    if (town.buildings.silo) U.addRes(res, F.get(town.faction).siloRes);
    return res;
  }
  function growthOf(town, tier) {
    const [base] = F.creaturesOf(town.faction, tier);
    let mult = 1;
    if (town.buildings.castle) mult = 2; else if (town.buildings.citadel) mult = 1.5;
    return Math.max(1, Math.floor(base.growth * mult));
  }
  function guildLevel(town) { for (let i = 4; i >= 1; i--) if (town.buildings['guild_' + i]) return i; return 0; }
  function fortLevel(town) { return town.buildings.castle ? 3 : town.buildings.citadel ? 2 : town.buildings.fort ? 1 : 0; }
  function canBuild(state, town, bid) {
    const b = B.get(town.faction, bid);
    if (!b) return { ok: false, reason: 'Нет такой постройки' };
    if (town.buildings[bid]) return { ok: false, reason: 'Уже построено' };
    if (town.builtToday) return { ok: false, reason: 'Сегодня в этом городе уже строили' };
    for (const r of b.req) if (!town.buildings[r]) return { ok: false, reason: 'Нужно: ' + B.get(town.faction, r).name };
    if (bid === 'hall_4') {
      const owner = state.players[town.owner];
      if (owner.towns.some(tid => tid !== town.id && state.towns[tid].buildings.hall_4)) return { ok: false, reason: 'Капитолий может быть только один' };
    }
    const player = state.players[town.owner];
    if (!U.canAfford(player.res, b.cost)) return { ok: false, reason: 'Не хватает ресурсов' };
    return { ok: true };
  }
  function build(state, town, bid) {
    const chk = canBuild(state, town, bid); if (!chk.ok) return chk;
    const b = B.get(town.faction, bid);
    U.pay(state.players[town.owner].res, b.cost);
    town.buildings[bid] = true;
    town.builtToday = true;
    if (b.kind === 'guild') fillGuild(state, town, b.level);
    if (b.kind === 'dwell') town.avail[b.tier - 1] = growthOf(town, b.tier); // первая партия сразу
    return { ok: true, building: b };
  }
  function fillGuild(state, town, level) {
    const rng = state._rng.misc;
    const n = B.GUILD_SPELLS[level];
    const pool = SP.byLevel(level).filter(s => s.kind !== 'adventure' || level === 4);
    const banned = town.faction === 'necropolis' ? ['resurrection', 'cure', 'bless'] : [];
    const forced = [];
    if (town.faction === 'necropolis' && level === 3) forced.push('animate_dead');
    if (town.faction === 'inferno' && level === 1) forced.push('bloodlust', 'curse');
    const chosen = forced.slice();
    const rest = rng.shuffle(pool.filter(s => !banned.includes(s.id) && !chosen.includes(s.id)).map(s => s.id));
    while (chosen.length < n && rest.length) chosen.push(rest.pop());
    town.guild[level] = chosen;
  }
  function townSpells(town) { const out = []; for (let l = 1; l <= 4; l++) if (town.guild[l]) out.push(...town.guild[l]); return out; }
  function canLearn(hero, spell) {
    if (spell.level <= 2) return true;
    return skillVal(hero, 'wisdom') >= spell.level;
  }
  /** Стоимость найма n существ */
  function recruitCost(cid, n) { return U.mulCost(C.get(cid).cost, n); }
  function maxRecruit(state, town, tier, upg) {
    const [base, up] = F.creaturesOf(town.faction, tier);
    const c = upg ? up : base;
    if (!town.buildings['dwell_' + tier]) return 0;
    if (upg && !town.buildings['dwell_up_' + tier]) return 0;
    const player = state.players[town.owner];
    let n = town.avail[tier - 1];
    for (const r of U.RES) if (c.cost[r]) n = Math.min(n, Math.floor((player.res[r] || 0) / c.cost[r]));
    return Math.max(0, n);
  }
  function recruit(state, town, tier, upg, n, army) {
    const [base, up] = F.creaturesOf(town.faction, tier);
    const c = upg ? up : base;
    n = Math.min(n, maxRecruit(state, town, tier, upg));
    if (n <= 0) return { ok: false, reason: 'Нельзя нанять' };
    if (!canAddToArmy(army, c.id)) return { ok: false, reason: 'Нет свободного слота в армии' };
    U.pay(state.players[town.owner].res, recruitCost(c.id, n));
    town.avail[tier - 1] -= n;
    addToArmy(army, c.id, n);
    return { ok: true, n, cid: c.id };
  }
  function upgradeStackCost(cid, n) {
    const c = C.get(cid); if (!c.upgTo) return null;
    const u = C.get(c.upgTo);
    const cost = {};
    for (const r of U.RES) { const d = (u.cost[r] || 0) - (c.cost[r] || 0); if (d > 0) cost[r] = d * n; }
    return cost;
  }
  /** Можно ли улучшить стек в этом городе (есть улучшенное жилище того же тира и фракции) или в Холмфорте */
  function canUpgradeIn(town, cid) {
    const c = C.get(cid); if (!c.upgTo || c.upg) return false;
    return town.faction === c.faction && !!town.buildings['dwell_up_' + c.tier];
  }
  function newTownWeek(town) {
    for (let t = 1; t <= 7; t++) if (town.buildings['dwell_' + t]) town.avail[t - 1] += growthOf(town, t);
  }

  /* ---------- Герой: создание ---------- */
  function startingArmy(faction, rng, strong) {
    const army = [null, null, null, null, null, null, null];
    const [c1] = F.creaturesOf(faction, 1), [c2] = F.creaturesOf(faction, 2), [c3] = F.creaturesOf(faction, 3);
    addToArmy(army, c1.id, rng.int(10, 20));
    addToArmy(army, c2.id, rng.int(4, 7));
    if (strong || rng.chance(0.5)) addToArmy(army, c3.id, rng.int(2, 3));
    return army;
  }
  function makeHero(state, tid, owner, x, y, strong) {
    const t = HE.get(tid), cl = HE.getClass(t.cls);
    const rng = state._rng.misc;
    const hero = {
      id: state.nextId++, tid, name: t.name, cls: t.cls, faction: cl.faction, owner, x, y, level: 1, xp: 0,
      pri: Object.assign({}, cl.start), skills: {}, spells: [], mana: 0, move: 0,
      army: startingArmy(cl.faction, rng, strong), arts: {}, backpack: [], visited: {}, bonuses: {}, spec: t.spec, portrait: 'portrait_' + t.cls + '_' + t.portrait,
      sleeping: false, hasBook: cl.type === 'magic', dead: false,
    };
    for (const s of t.skills) hero.skills[s.id] = s.lvl;
    if (t.spell) { hero.spells.push(t.spell); hero.hasBook = true; }
    hero.mana = heroMaxMana(hero);
    hero.move = heroMaxMove(hero);
    state.heroes[hero.id] = hero;
    return hero;
  }
  /** Кандидаты в таверну: герои фракции города и любые другие, не находящиеся на карте */
  function tavernCandidates(state, town, n) {
    const rng = state._rng.misc;
    const onMap = new Set(Object.values(state.heroes).filter(h => !h.dead).map(h => h.tid));
    const own = HE.heroesOfFaction(town.faction).filter(h => !onMap.has(h.id)).map(h => h.id);
    const other = HE.HEROES.filter(h => !onMap.has(h.id) && !own.includes(h.id)).map(h => h.id);
    const pool = rng.shuffle(own).concat(rng.shuffle(other));
    return pool.slice(0, n || 2);
  }
  const HERO_COST = 2500;

  /* ---------- Рынок ---------- */
  /** Курс: сколько ресурса `from` нужно за 1 `to` при k рынках. */
  function marketRate(from, to, markets) {
    const k = Math.max(1, Math.min(9, markets));
    const div = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9][k]; // условный делитель
    const rareFrom = U.RARE.includes(from), rareTo = U.RARE.includes(to);
    if (to === 'gold') { const base = rareFrom ? 50 : 25; return { give: 1, get: Math.floor(base * (1 + (k - 1) * 0.5)) }; }
    if (from === 'gold') { const base = rareTo ? 5000 : 2500; return { give: Math.max(100, Math.floor(base / div)), get: 1 }; }
    let base = rareFrom === rareTo ? 5 : rareFrom ? 2 : 10;
    base = Math.max(1, Math.round(base / Math.sqrt(k)));
    return { give: base, get: 1 };
  }

  H3.Rules = {
    TERRAINS, TERRAIN_COST, TERRAIN_NAMES, TERRAIN_INDEX, ROAD_COST,
    artifactFx, heroPrimary, skillLvl, skillVal, heroMaxMana, heroMaxMove, slowestSpeed,
    armySize, armyEmpty, addToArmy, canAddToArmy, armyPower, armyCost, cleanArmy, factionsInArmy,
    heroMorale, heroLuck, MORALE_CHANCE, LUCK_CHANCE,
    xpToNext, gainXp, pendingLevels, levelUpOptions, applyLevelUp,
    townHallLevel, townIncome, growthOf, guildLevel, fortLevel, canBuild, build, fillGuild, townSpells, canLearn,
    recruitCost, maxRecruit, recruit, upgradeStackCost, canUpgradeIn, newTownWeek,
    startingArmy, makeHero, tavernCandidates, HERO_COST, marketRate,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Rules;
})(typeof window !== 'undefined' ? window : globalThis);
