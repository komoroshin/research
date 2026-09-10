/* ============================================================================
   model/ai.js — ИИ игрока на карте приключений (ТЗ §8): стройка по
   приоритету, найм, цели по полезности «награда / путь × P(победа) − опасность».
   playTurn — async: если защищается человек, вызывает hooks.battle(b) и ждёт.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, A = H3.Adventure, C = H3.Creatures, O = H3.Objects, AR = H3.Artifacts, B = H3.Buildings, PF = H3.Pathfind, F = H3.Factions, SK = H3.Skills;

  const RESERVE = 1500;
  /* Переключатели новых механик v1.7 — нужны для замеров вклада каждой по
     отдельности (dev/aitune-map.js). В игре все включены. */
  /* Механики v1.7 и результат их замера в парном турнире против ИИ v1.6
     (dev/aiwar.js, 16 партий, «перевес по силе» новый/старый):
       sim          прогон настоящего боя вместо оценки по силам   12 / 4  ← включено
       threat       карта угроз для разведки и обороны              7 / 11
       defend       возврат героя на защиту города по карте угроз   7 / 11
       roles        роли и цепочки подвоза армии                    хуже в связке
       econ         стройка по ценности вместо жёсткого порядка     хуже в связке
       bold         пониженные пороги «лезть в драку»               4 / 13
       recruitFirst найм до выхода героев из города                 9 / 9 (вничью)
     Проигравшие механики оставлены выключенными и под флагом — чтобы
     отрицательный результат можно было воспроизвести (dev/aitune-map.js),
     а не поверить на слово. */
  const FLAGS = { sim: true, threat: false, defend: false, roles: false, econ: false, bold: false, recruitFirst: false, naval: false };
  const RES_VALUE = { gold: 1, wood: 100, ore: 100, mercury: 300, sulfur: 300, crystal: 300, gems: 300 };
  const MINE_VALUE = { gold: 15000, wood: 2500, ore: 2500, mercury: 4500, sulfur: 4500, crystal: 4500, gems: 4500 };

  async function playTurn(state, pid, hooks) {
    hooks = hooks || {};
    const p = state.players[pid];
    if (!p.alive) return;
    const diff = S.DIFFICULTY[state.settings.difficulty] || S.DIFFICULTY.normal;
    const smart = diff.aiSmart;
    const think = [];
    if (!state._ai) state._ai = {};
    state._ai[pid] = { threat: smart && FLAGS.threat ? buildThreat(state, pid) : null };
    p._buildReserve = 0;
    // 1. города: стройка и найм героев
    for (const t of S.townsOf(state, pid)) {
      buildInTown(state, t, think, smart);
      hireIfNeeded(state, t, think);
    }
    // 1б. найм ДО выхода героев: иначе прирост остаётся в гарнизоне до следующего визита
    if (smart && FLAGS.recruitFirst) for (const t of S.townsOf(state, pid)) recruitInTown(state, t, think);
    // 2. герои: сначала роли, потом ходы (сильнейший первым)
    const heroes = S.heroesOf(state, pid).sort((a, b) => R.armyPower(b.army, b) - R.armyPower(a.army, a));
    assignRoles(state, pid, heroes, smart);
    for (const h of heroes) {
      if (h.dead) continue;
      await playHero(state, h, hooks, smart, think);
      if (state.winner !== null) return;
    }
    // 3. добор в конце хода: то, на что не хватало золота до выхода героев
    for (const t of S.townsOf(state, pid)) recruitInTown(state, t, think);
    p.aiThink = think.slice(-12);
  }

  /* ---------- роли героев ----------
     main     — главный кулак: берёт города, бьёт героев, растёт;
     defender — идёт закрывать угрожаемый город;
     feeder   — подвозчик: собирает прирост по городам и передаёт главному;
     scout    — разведка и мелкая добыча.
     Роль не фиксируется навсегда: она пересчитывается каждый ход по обстановке. */
  function assignRoles(state, pid, heroes, smart) {
    if (!heroes.length) return;
    heroes[0]._role = 'main';
    if (!smart || !FLAGS.roles) { for (let i = 1; i < heroes.length; i++) heroes[i]._role = 'scout'; return; }
    const main = heroes[0];
    const towns = S.townsOf(state, pid);
    // города, которым не хватает своей обороны
    const endangered = towns.filter(t => {
      const th = threatAt(state, pid, t.x, t.y, t.z);
      if (!th) return false;
      const inTown = t.visiting ? heroPower(state.heroes[t.visiting]) : 0;
      return th > (R.armyPower(t.garrison, null) + inTown + R.fortLevel(t) * 2500) * 1.1;
    });
    // города, где скопился прирост, который стоит увезти главному
    const stocked = towns.filter(t => R.armyPower(t.garrison, null) > 1200 || t.avail.some((n, i) => n > 0 && t.buildings['dwell_' + (i + 1)]));
    for (let i = 1; i < heroes.length; i++) {
      const h = heroes[i];
      const mine = R.armyPower(h.army, h);
      const near = (list) => list.map(t => ({ t, d: dist(h, t) })).sort((a, b) => a.d - b.d)[0];
      const dz = endangered.filter(t => (t.z || 0) === (h.z || 0));
      const sz = stocked.filter(t => (t.z || 0) === (h.z || 0));
      if (dz.length && mine > 1500 && near(dz).d < 14) { h._role = 'defender'; h._roleTown = near(dz).t.id; continue; }
      // подвозчик: сам слабоват, но рядом есть чем нагрузиться и есть кому везти
      if (sz.length && mine < R.armyPower(main.army, main) * 0.5 && (h.z || 0) === (main.z || 0)) { h._role = 'feeder'; h._roleTown = near(sz).t.id; continue; }
      h._role = 'scout';
    }
  }
  function dist(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)) + ((a.z || 0) === (b.z || 0) ? 0 : 40); }

  /* ---------- города ----------
     Стройка не по жёсткому списку, а по ценности на вложенное золото.
     Ценность считаем в тех же единицах, что и армию (aiValue), а золото —
     один к одному: так доход, прирост и оборона сравнимы между собой. */
  const HORIZON = 25;   // на столько дней вперёд окупаем доход

  function creatureValueOf(town, tier, upgraded) {
    const list = F.creaturesOf(town.faction, tier);
    const c = list[upgraded && list[1] ? 1 : 0];
    return { c, weekly: c.growth * C.aiValue(c) };
  }
  /** Во сколько городу обойдётся неделя без этой постройки. */
  function buildingScore(state, town, b, smart) {
    const p = state.players[town.owner];
    const growthMul = town.buildings.castle ? 2 : town.buildings.citadel ? 1.5 : 1;
    switch (b.kind) {
      case 'dwell': {
        const { weekly } = creatureValueOf(town, b.tier, false);
        return weekly * growthMul * 3;            // три недели прироста
      }
      case 'dwell_up': {
        const base = creatureValueOf(town, b.tier, false), up = creatureValueOf(town, b.tier, true);
        const gain = Math.max(0, C.aiValue(up.c) - C.aiValue(base.c));
        return gain * (base.c.growth * growthMul * 3 + town.avail[b.tier - 1]);
      }
      case 'hall': {
        const prev = R.townHallLevel ? 0 : 0; void prev;
        const cur = town.buildings.hall_4 ? 4000 : town.buildings.hall_3 ? 2000 : town.buildings.hall_2 ? 1000 : 500;
        return Math.max(0, (b.income - cur)) * HORIZON;
      }
      case 'fort': {
        const th = threatAt(state, town.owner, town.x, town.y, town.z);
        let v = b.id === 'fort' ? 3000 : 0;
        if (b.id === 'citadel' || b.id === 'castle') {
          // цитадель и замок — это прежде всего прирост во всех жилищах
          const step = b.id === 'castle' ? 0.5 : 0.5;
          let weekly = 0;
          for (let t = 1; t <= 7; t++) if (town.buildings['dwell_' + t]) weekly += creatureValueOf(town, t, !!town.buildings['dwell_up_' + t]).weekly;
          v = weekly * step * 3 + 1500;
        }
        return v + Math.min(20000, th * 0.25);
      }
      case 'guild': {
        const heroes = S.heroesOf(state, town.owner);
        const mage = heroes.some(h => h.hasBook) || F.get(town.faction).alignment === 'good';
        return (mage ? 2600 : 900) / b.level;
      }
      default:
        if (b.id === 'tavern') return p.heroes.length < 3 ? 2500 : 800;
        if (b.id === 'market') return 1600;
        if (b.id === 'blacksmith') return 1400;
        if (b.id === 'silo') return 1200;
        if (b.id === 'special') return 3000;   // особая постройка фракции окупается лучше складов
        if (b.id === 'shipyard') return 600;
        return 500;
    }
  }
  /** Стройка v1.6: жёсткий порядок AI_ORDER, копим на первое недоступное. */
  function buildByOrder(state, town, think) {
    const p = state.players[town.owner];
    const list = B.forFaction(town.faction);
    for (const bid of B.AI_ORDER) {
      const b = list.find(x => x.id === bid); if (!b || town.buildings[bid]) continue;
      const chk = R.canBuild(state, town, bid);
      if (chk.ok) { R.build(state, town, bid); think.push('Строю ' + b.name + ' в ' + town.name); return; }
      if (chk.reason === 'Не хватает ресурсов' && b.cost.gold && p.res.gold >= b.cost.gold * 0.6 && U.RES.every(r => r === 'gold' || (p.res[r] || 0) >= (b.cost[r] || 0))) { think.push('Коплю на ' + b.name); return; }
    }
  }
  function buildInTown(state, town, think, smart) {
    if (town.builtToday) return;
    if (!smart || !FLAGS.econ) { buildByOrder(state, town, think); return; }
    const p = state.players[town.owner];
    const list = B.forFaction(town.faction);
    let best = null, bestSave = null;
    for (const b of list) {
      if (town.buildings[b.id]) continue;
      const chk = R.canBuild(state, town, b.id);
      if (!chk.ok && chk.reason !== 'Не хватает ресурсов') continue;    // требования не выполнены — не наш случай
      const score = buildingScore(state, town, b, smart);
      if (score <= 0) continue;
      const gold = b.cost.gold || 250;
      const eff = score / gold;                                        // ценность на золото
      if (chk.ok) { if (!best || eff > best.eff) best = { b, eff, score }; continue; }
      // не хватает — стоит ли копить: только если это заметно выгоднее того, что можем сейчас
      const haveRare = U.RES.every(r => r === 'gold' || (p.res[r] || 0) >= (b.cost[r] || 0));
      if (haveRare && p.res.gold >= gold * 0.55 && (!bestSave || eff > bestSave.eff)) bestSave = { b, eff, score };
    }
    // Копим только если цель реально близка и мы не копим уже третий ход подряд:
    // иначе город замирает навсегда — найм съедает золото быстрее, чем оно копится.
    if (bestSave && (!best || bestSave.eff > best.eff * 1.35)) {
      const stall = town._saveFor === bestSave.b.id ? (town._saveTurns || 0) + 1 : 1;
      if (stall <= 3) {
        town._saveFor = bestSave.b.id; town._saveTurns = stall;
        // резервируем недостающее золото, чтобы найм его не потратил
        p._buildReserve = (p._buildReserve || 0) + Math.max(0, (bestSave.b.cost.gold || 0) - p.res.gold);
        think.push('Коплю на ' + bestSave.b.name);
        return;
      }
    }
    town._saveFor = null; town._saveTurns = 0;
    if (best) { R.build(state, town, best.b.id); think.push('Строю ' + best.b.name + ' в ' + town.name); }
  }
  function hireIfNeeded(state, town, think) {
    const p = state.players[town.owner];
    const n = p.heroes.length;
    const want = n === 0 || (n === 1 && p.res.gold >= R.HERO_COST + 1000) || (n === 2 && p.res.gold >= R.HERO_COST + 6000 && S.dayOfWeek(state.day) <= 3);
    if (!want || town.visiting) return;
    if (!town.tavern.length) town.tavern = R.tavernCandidates(state, town, 2);
    const r = A.hireHero(state, town, town.tavern[0]);
    if (r.ok) { think.push('Нанял героя ' + r.hero.name); r.hero._fresh = true; }
  }
  function recruitInTown(state, town, think) {
    const p = state.players[town.owner];
    const hero = town.visiting ? state.heroes[town.visiting] : null;
    const army = hero ? hero.army : town.garrison;
    for (let t = 7; t >= 1; t--) {
      const upg = !!town.buildings['dwell_up_' + t];
      let n = R.maxRecruit(state, town, t, upg);
      if (!n && upg) n = R.maxRecruit(state, town, t, false);
      if (!n) continue;
      const cid = F.creaturesOf(town.faction, t)[upg && town.buildings['dwell_up_' + t] && R.maxRecruit(state, town, t, true) > 0 ? 1 : 0].id;
      // резерв золота
      const c = C.get(cid); const floor = RESERVE + (FLAGS.econ ? (p._buildReserve || 0) : 0);
      const canPay = Math.floor(Math.max(0, p.res.gold - floor) / c.cost.gold); n = Math.min(n, canPay);
      if (n <= 0) continue;
      if (!R.canAddToArmy(army, cid)) continue;
      const r = R.recruit(state, town, t, c.upg, n, army);
      if (r.ok) think.push('Нанял ' + c.name + ' ×' + r.n);
    }
    // гарнизон отдаёт армию герою в городе
    if (hero) { for (let i = 0; i < 7; i++) { const g = town.garrison[i]; if (g && g.n > 0) { const left = R.addToArmy(hero.army, g.cid, g.n); town.garrison[i] = left ? { cid: g.cid, n: left } : null; } } }
  }

  /* ---------- герои ---------- */
  async function playHero(state, hero, hooks, smart, think) {
    const p = state.players[hero.owner];
    const blacklist = new Set();
    for (let iter = 0; iter < 14 && !hero.dead && hero.move > 60; iter++) {
      const pf = S.pathfield(state, hero);
      const target = chooseTarget(state, hero, pf, blacklist, smart);
      if (!target) { think.push(hero.name + ': целей нет'); break; }
      const path = PF.pathTo(pf, target.x, target.y);
      if (!path || !path.length) { blacklist.add(target.key); continue; }
      think.push(hero.name + ' → ' + target.label);
      hero._target = target.label;
      const before = hero.move;
      const r = A.moveHero(state, hero, path);
      const stop = r.stop;
      if (!stop) { if (hero.move === before && !r.steps.length) blacklist.add(target.key); continue; }
      if (stop.kind === 'nomove') break;
      if (stop.kind === 'object') {
        const gate = stop.obj.type === 'subter_gate' ? A.gatePartner(state, stop.obj) : null;
        await handleObject(state, hero, stop.obj, hooks, smart, think);
        if (gate) blacklist.add('o' + gate.id);   // иначе герой скачет через врата туда-сюда
        if (!stop.obj || !state.objects[stop.obj.id] || (stop.obj.type === 'mine' && stop.obj.owner === hero.owner)) continue;
        blacklist.add('o' + stop.obj.id); continue;
      }
      if (stop.kind === 'monster') {
        const done = await handleMonster(state, hero, stop.obj, hooks, smart, think);
        if (!done) blacklist.add('m' + stop.obj.id);
        continue;
      }
      if (stop.kind === 'town') { recruitInTown(state, state.towns[stop.town.id], think); buySpellbook(state, hero, stop.town); buyMachine(state, hero, stop.town); blacklist.add('t' + stop.town.id); continue; }
      if (stop.kind === 'siege') {
        const ok = await attackTown(state, hero, stop.town, hooks, smart, think);
        if (!ok) blacklist.add('t' + stop.town.id);
        continue;
      }
      if (stop.kind === 'enemyHero') {
        const ok = await attackHero(state, hero, stop.hero, hooks, smart, think);
        if (!ok) blacklist.add('h' + stop.hero.id);
        continue;
      }
      if (stop.kind === 'hero') { exchange(state, hero, stop.hero); blacklist.add('h' + stop.hero.id); continue; }
      if (r.steps.length === 0 && hero.move === before) break;
    }
    // левел-апы
    while (R.pendingLevels(hero) > 0 && !hero.dead) autoLevelUp(state, hero);
  }

  function heroPower(hero) { return R.armyPower(hero.army, hero); }

  /* ---------- карта угроз ----------
     Для каждого слоя: сила сильнейшего ВИДИМОГО вражеского героя, который
     дотянется до клетки примерно за полтора хода. Считается один раз в начале
     хода игрока: дальше по ней решают и цели героев, и оборона городов. */
  function buildThreat(state, pid) {
    const p = state.players[pid];
    const maps = [];
    for (let z = 0; z < state.levels.length; z++) {
      const m = S.lvl(state, z);
      maps.push(new Float64Array(m.w * m.h));
    }
    for (const e of enemyHeroesOf(state, pid)) {
      const z = e.z || 0, m = S.lvl(state, z);
      if (p.vis[z][e.y * m.w + e.x] !== 2) continue;      // о невидимых героях ИИ не знает
      const pw = heroPower(e);
      const reach = PF.dijkstra({ w: m.w, h: m.h, start: [e.x, e.y], cost: (x, y) => S.moveCost(state, e, x, y) });
      const range = R.heroMaxMove(e) * 1.5;
      const map = maps[z];
      for (let i = 0; i < map.length; i++) if (reach.dist[i] <= range && pw > map[i]) map[i] = pw;
    }
    return maps;
  }
  function threatAt(state, pid, x, y, z) {
    const t = state._ai && state._ai[pid] && state._ai[pid].threat;
    if (!t) return 0;
    const m = S.lvl(state, z || 0);
    if (x < 0 || y < 0 || x >= m.w || y >= m.h) return 0;
    return t[z || 0][y * m.w + x];
  }
  function guardOf(state, obj) {
    let best = null;
    for (const m of S.monstersNear(state, obj.x, obj.y, obj.z)) { const v = A.monsterPower(m); if (!best || v > best.v) best = { m, v }; }
    return best;
  }
  /* ---------- оценка боя настоящим прогоном ----------
     Отношение сил врёт: 20 крестьян и 1 архангел «равны» по aiValue, но бой
     проходит совершенно по-разному. Для дорогих решений прогоняем настоящий
     автобой на копии — дважды, с разными сидами, и смотрим, что осталось. */
  function simFight(state, hero, defArmy, defHero, terrain, seed, siege) {
    const Bt = H3.Battle, AI = H3.BattleAI;
    let wins = 0, kept = 0, runs = 2;
    for (let k = 0; k < runs; k++) {
      const att = { hero: U.clone(hero), army: U.clone(hero.army), player: hero.owner };
      const def = { hero: defHero ? U.clone(defHero) : null, army: U.clone(defArmy), player: -1, canRetreat: false };
      const b = Bt.create(att, def, { rng: new U.RNG(seed + k * 7919), terrain: terrain || 'grass', siege: siege || null });
      const res = AI.auto(b, true);
      if (res.winner === 0) {
        wins++;
        const before = R.armyPower(hero.army, hero);
        kept += Math.max(0, R.armyPower(res.sides[0].army, hero)) / Math.max(1, before);
      }
    }
    return { p: wins / runs, kept: wins ? kept / wins : 0 };
  }
  /** Прогон боя для решающего кандидата (с кэшем на ход). */
  function fightOutcome(state, hero, cand) {
    if (!FLAGS.sim || !cand.army) return null;
    // ключ кэша — по составу армии, а не по очкам движения: исход боя от них
    // не зависит, иначе один и тот же бой считался бы на каждом шаге героя
    const sig = hero.army.map(x => (x && x.n ? x.cid + x.n : '-')).join(',');
    const key = hero.id + '|' + cand.key + '|' + sig;
    if (!state._ai) state._ai = {};
    const box = state._ai[hero.owner] || (state._ai[hero.owner] = {});
    const cache = box.sims || (box.sims = {});
    if (cache[key]) return cache[key];
    const terrain = S.terrainAt(state, cand.x, cand.y, hero.z);
    const r = simFight(state, hero, cand.army, cand.defHero || null, terrain, (state.seed ^ hero.id ^ cand.x * 31 ^ cand.y * 17) >>> 0, cand.siege);
    cache[key] = r;
    return r;
  }
  function winChance(ratio, role, smart) {
    const bold = FLAGS.bold ? 0.8 : 1;
    const lo = (role === 'main' ? 1.2 : 2.0) * bold, hi = (role === 'main' ? 2.0 : 3.0) * bold;
    if (ratio >= hi) return 1; if (ratio < lo) return 0; return (ratio - lo) / (hi - lo) * 0.7 + 0.3;
  }
  function enemyHeroesOf(state, pid) { const out = []; for (const q of state.players) if (q.id !== pid && q.alive) out.push(...S.heroesOf(state, q.id)); return out; }
  /** Опасность клетки: сила врага, который до неё дотянется, если он сильнее нас. */
  function dangerAt(state, hero, x, y, myPower) {
    if (!FLAGS.threat) {   // старое приближение: по прямой, без учёта проходимости
      let d = 0;
      for (const e of enemyHeroesOf(state, hero.owner)) {
        const ep = heroPower(e);
        if (ep <= myPower * 1.2) continue;
        const dist = Math.max(Math.abs(e.x - x), Math.abs(e.y - y));
        if (dist * 100 <= R.heroMaxMove(e) * 1.3) d = Math.max(d, ep);
      }
      return d;
    }
    const t = threatAt(state, hero.owner, x, y, hero.z);
    return t > myPower * 1.2 ? t : 0;
  }
  function armyOf(list) { const a = [null, null, null, null, null, null, null]; list.slice(0, 7).forEach((x, i) => { a[i] = { cid: x.cid, n: x.n }; }); return a; }
  function chooseTarget(state, hero, pf, blacklist, smart) {
    const p = state.players[hero.owner], w = S.lvl(state, hero.z).w;
    const my = heroPower(hero), role = hero._role || 'scout', maxMove = R.heroMaxMove(hero);
    const cands = [];
    let extraSiege = null;
    const consider = (x, y, key, value, label, guardV, extra, army, defHero) => {
      if (blacklist.has(key)) return;
      const d = pf.dist[y * w + x]; if (!(d < Infinity)) return;
      const turns = d / maxMove;
      let pw = 1;
      if (guardV) pw = winChance(my / Math.max(1, guardV), role, smart);
      if (pw <= 0) return;
      let util = value / (turns + 1) * pw;
      if (smart && dangerAt(state, hero, x, y, my)) util *= 0.1;
      if (extra) util += extra;
      cands.push({ x, y, key, util, label, value, turns, army, defHero, guardV, siege: extraSiege });
    };
    for (const id in state.objects) {
      const o = state.objects[id];
      if ((o.z || 0) !== (hero.z || 0)) continue;          // цели ищем на своём слое
      const vis = p.vis[hero.z || 0][o.y * w + o.x]; if (!vis) continue;
      const t = O.get(o.type); if (t.obstacle) continue;
      const g = guardOf(state, o); const gv = g && g.m !== o ? g.v : 0;
      const garmy = g && g.m !== o ? armyOf([{ cid: g.m.cid, n: g.m.n }]) : undefined;
      const key = 'o' + o.id;
      switch (o.type) {
        case 'resource': consider(o.x, o.y, key, o.amount * RES_VALUE[o.res], 'ресурсы', gv, undefined, garmy); break;
        case 'chest': consider(o.x, o.y, key, 1500, 'сундук', gv, undefined, garmy); break;
        case 'campfire': consider(o.x, o.y, key, 900, 'костёр', gv, undefined, garmy); break;
        case 'artifact': consider(o.x, o.y, key, AR.CLASS_VALUE[AR.get(o.art).cls], 'артефакт', gv, undefined, garmy); break;
        case 'mine': if (o.owner !== hero.owner) consider(o.x, o.y, key, MINE_VALUE[o.res] * (o.owner >= 0 ? 1.3 : 1), O.MINE_NAMES[o.res], gv, undefined, garmy); break;
        case 'dwelling': if (o.owner !== hero.owner || o.avail >= 3) consider(o.x, o.y, key, 1500 + (o.avail ? Math.min(3000, o.avail * C.aiValue(C.get(o.cid)) * 0.5) : 0), 'жилище', gv, undefined, garmy); break;
        case 'boat': {
          // лодка нужна, только если своя суша уже обобрана: доплыть — целое приключение
          if (hero.boat) break;
          const dry = cands.filter(c => c.util > 800).length;
          if (!dry) consider(o.x, o.y, key, 900, 'лодка', gv, undefined, garmy);
          break;
        }
        case 'shipyard': {
          if (hero.boat || o.owner === hero.owner || p.res.gold < 2500) break;
          const dry2 = cands.filter(c => c.util > 800).length;
          if (!dry2) consider(o.x, o.y, key, 800, 'верфь', gv, undefined, garmy);
          break;
        }
        case 'flotsam': consider(o.x, o.y, key, 800, 'обломки', gv, undefined, garmy); break;
        case 'sea_chest': consider(o.x, o.y, key, 1500, 'сундук в воде', gv, undefined, garmy); break;
        case 'subter_gate': {
          // ценность врат — по доле неразведанного на том слое: чем больше
          // неизвестного, тем интереснее спуститься. Разведали — врата остывают.
          const ov = p.vis[1 - (hero.z || 0)];
          let unknown = 0;
          for (let i = 0; i < ov.length; i++) if (!ov[i]) unknown++;
          consider(o.x, o.y, key, 300 + Math.round(2200 * unknown / ov.length), 'врата в подземелье', gv, undefined, garmy);
          break;
        }
        case 'keymaster': if (!H3.Quest.keysOf(p)[o.color]) consider(o.x, o.y, key, 2500, 'ключ', gv, undefined, garmy); break;
        case 'border_guard': if (H3.Quest.keysOf(p)[o.color]) consider(o.x, o.y, key, 3000, 'застава', 0); break;
        case 'quest_guard': if (H3.Quest.met(state, hero, o.quest)) consider(o.x, o.y, key, 3000, 'страж-квестор', 0); break;
        case 'seer_hut': if (H3.Quest.met(state, hero, o.quest) && !(o.visited && o.visited['p' + hero.owner])) consider(o.x, o.y, key, H3.Quest.rewardValue(o.reward), 'провидец', gv, undefined, garmy); break;
        case 'monster': {
          const mv = A.monsterPower(o); const ratio = my / Math.max(1, mv);
          const need = (role === 'main' ? 1.5 : 2.5) * (FLAGS.bold ? 0.8 : 1);
          if (ratio >= need) consider(o.x, o.y, 'm' + o.id, mv * 0.35 + 1500, 'стражи ' + C.get(o.cid).name, 0, undefined, armyOf([{ cid: o.cid, n: o.n }]));
          break;
        }
        case 'town': {
          const tw = state.towns[o.townId];
          if (tw.owner === hero.owner) { // вернуться за приростом / защитить
            const avail = tw.avail.reduce((a, n, i) => a + n * (tw.buildings['dwell_' + (i + 1)] ? C.aiValue(F.creaturesOf(tw.faction, i + 1)[0]) : 0), 0);
            let v = 0;
            if (role === 'main' && S.dayOfWeek(state.day) <= 2 && avail > my * 0.15) v = 6000;
            if (!FLAGS.defend) {
              const near = enemyHeroesOf(state, hero.owner).some(e => Math.max(Math.abs(e.x - tw.x), Math.abs(e.y - tw.y)) <= 8 && heroPower(e) > R.armyPower(tw.garrison, null) * 1.2);
              if (near && role === 'main') v = 20000;
            } else {
              // оборона по карте угроз: считаем, чем город прикрыт прямо сейчас
              const th = threatAt(state, hero.owner, tw.x, tw.y, tw.z);
              if (th) {
                const inTown = tw.visiting && tw.visiting !== hero.id ? heroPower(state.heroes[tw.visiting]) : 0;
                const def = R.armyPower(tw.garrison, null) + inTown + R.fortLevel(tw) * 2500;
                if (th > def * 1.1 && my > th * 0.5) v = Math.max(v, 9000 + Math.min(30000, th / 3));
              }
            }
            if (!hero.hasBook && R.guildLevel(tw) && p.res.gold > 3000) v = Math.max(v, 1500);
            if (v) consider(o.x, o.y, 't' + tw.id, v, 'город ' + tw.name, 0);
          } else {
            const dh = tw.visiting ? state.heroes[tw.visiting] : null;
            const gp = dh ? heroPower(dh) : R.armyPower(tw.garrison, null);
            const towers = R.fortLevel(tw) * 1500;
            // штурм считаем настоящим боем — вместе со стенами, рвом и башнями
            const defArmy = dh ? U.clone(dh.army) : U.clone(tw.garrison);
            extraSiege = R.fortLevel(tw) ? tw : null;
            consider(o.x, o.y, 't' + tw.id, 30000 + Object.keys(tw.buildings).length * 1000, 'город ' + tw.name, gp + towers + 500, undefined, defArmy, dh);
            extraSiege = null;
          }
          break;
        }
        default:
          if (t.bank) { if (o.guards && o.guards.length) { const bv = o.guards.reduce((a, g) => a + C.aiValue(C.get(g.cid)) * g.n, 0); const val = o.type === 'pandora_box' ? (o.rewards || []).reduce((a, r) => a + H3.Quest.rewardValue(r), 0) : t.value; consider(o.x, o.y, key, val, t.name, bv, undefined, armyOf(o.guards)); } break; }
          if (t.once === 'hero' && o.visited && o.visited['h' + hero.id]) break;
          if (t.once === 'player' && o.visited && o.visited['p' + hero.owner]) break;
          if (t.once === 'week' && ((o.weekTaken === A.week(state)) || (o.visited && o.visited['w' + hero.id] === A.week(state)))) break;
          if (t.once === 'day' && o.visited && o.visited['d' + hero.id] === state.day) break;
          if (o.type === 'trading_post' || o.type === 'tavern' || o.type === 'hill_fort') break;
          if (o.type.startsWith('shrine_') && (!hero.hasBook || hero.spells.includes(o.spell))) break;
          if (o.type === 'magic_well' && hero.mana > R.heroMaxMana(hero) * 0.5) break;
          consider(o.x, o.y, key, t.value || 500, t.name, gv, undefined, garmy);
      }
    }
    // вражеские герои
    for (const e of enemyHeroesOf(state, hero.owner)) {
      if ((e.z || 0) !== (hero.z || 0)) continue;
      if (!p.vis[hero.z || 0][e.y * w + e.x]) continue;
      const ep = heroPower(e);
      consider(e.x, e.y, 'h' + e.id, ep * 1.2 + 3000, 'герой ' + e.name, ep + 200, undefined, U.clone(e.army), e);
    }
    // цепочка снабжения: подвозчик едет в город за приростом, потом к главному
    if (role !== 'main') {
      const main = S.heroesOf(state, hero.owner).find(h => h._role === 'main');
      const carrying = R.armyPower(hero.army, null);
      if (main && main.id !== hero.id && carrying > 800 && !hero._fresh) {
        // ценность доставки — это ценность того, что везём (плюс за роль подвозчика)
        const v = !FLAGS.roles ? 2500 : role === 'feeder' ? carrying * 0.9 + 2000 : Math.min(carrying * 0.5, 4000);
        consider(main.x, main.y, 'h' + main.id, v, 'армию к ' + main.name, 0);
      }
      if (role === 'feeder' && hero._roleTown !== undefined) {
        const t = state.towns[hero._roleTown];
        if (t && t.owner === hero.owner && (t.z || 0) === (hero.z || 0)) {
          const stock = R.armyPower(t.garrison, null) + t.avail.reduce((a, n, i) => a + (t.buildings['dwell_' + (i + 1)] ? n * C.aiValue(F.creaturesOf(t.faction, i + 1)[0]) : 0), 0);
          if (stock > 600) consider(t.x, t.y + 1, 't' + t.id, Math.min(stock, 20000), 'за подкреплением в ' + t.name, 0);
        }
      }
    }
    // разведка: ближайшая достижимая клетка на границе неизведанного
    if (!cands.some(c => c.util > 400)) {
      const m = S.lvl(state, hero.z), h = m.h; let best = null, bd = Infinity;
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x; const d = pf.dist[i]; if (!(d < Infinity) || d < 100) continue;
        if (m.block[i]) continue;
        const vis = p.vis[hero.z || 0];
        const frontier = vis[i - 1] === 0 || vis[i + 1] === 0 || vis[i - w] === 0 || vis[i + w] === 0;
        if (!frontier) continue;
        if (smart && !FLAGS.bold && dangerAt(state, hero, x, y, my)) continue;
        if (d < bd) { bd = d; best = [x, y]; }
      }
      if (best) cands.push({ x: best[0], y: best[1], key: 'x' + best[0] + ',' + best[1], util: 600 / (bd / maxMove + 1), label: 'разведка', value: 600, turns: bd / maxMove });
    }
    cands.sort((a, b) => b.util - a.util);
    if (!smart || !FLAGS.sim) return cands[0] || null;
    // проверяем боем только верхних кандидатов: прогон стоит миллисекунды,
    // но именно на этих решениях армия и теряется
    for (let i = 0; i < Math.min(3, cands.length); i++) {
      const c = cands[i];
      if (!c.army || !c.guardV || c.guardV < 2500) return c;
      if (my / c.guardV > 4) return c;                         // подавляющий перевес — прогон не нужен
      const r = fightOutcome(state, hero, c);
      if (!r) return c;
      if (r.p >= 1 && r.kept > 0.55) return c;                 // выигрываем и не разоряемся
      if (r.p >= 0.5 && r.kept > 0.75 && role === 'main') return c;
      blacklist.add(c.key);
    }
    return cands.find(c => !blacklist.has(c.key)) || null;
  }

  async function handleObject(state, hero, obj, hooks, smart, think) {
    const p = state.players[hero.owner];
    if (!state.objects[obj.id]) return;
    const v = A.visit(state, hero, obj);
    if (v && v.choices) {
      let choice = null;
      if (obj.type === 'chest') choice = (hero.level < 6 && p.res.gold > 4000) ? 'xp' : 'gold';
      else if (obj.type === 'tree_knowledge') choice = U.canAfford(p.res, v.cost || {}) ? 'pay' : 'no';
      else if (obj.type === 'arena') choice = hero.pri.att <= hero.pri.def ? 'att' : 'def';
      else if (obj.type === 'dwelling') choice = 'recruit';
      else if (obj.type === 'quest_guard' || obj.type === 'seer_hut') choice = 'give';
      else if (O.get(obj.type).bank) choice = (heroPower(hero) / Math.max(1, obj.guards.reduce((a, g) => a + C.aiValue(C.get(g.cid)) * g.n, 0)) >= 1.5) ? 'fight' : 'no';
      if (choice === 'recruit') { const c = C.get(obj.cid); const n = Math.floor(Math.max(0, p.res.gold - RESERVE) / c.cost.gold); if (n > 0) A.recruitFromDwelling(state, hero, obj, n); }
      else if (choice === 'fight') { await runBattle(state, hero, { bank: obj }, hooks, smart, think); }
      else if (choice) { const rr = A.resolve(state, hero, obj, choice); if (rr && rr.levelUps) while (R.pendingLevels(hero) > 0) autoLevelUp(state, hero); }
    }
    if (v && v.levelUps) while (R.pendingLevels(hero) > 0) autoLevelUp(state, hero);
  }
  async function handleMonster(state, hero, m, hooks, smart, think) {
    const p = state.players[hero.owner];
    const ap = A.approachMonster(state, hero, m);
    if (ap.outcome === 'join') { A.joinMonster(state, hero, m, 0); think.push(C.get(m.cid).name + ' присоединились к ' + hero.name); return true; }
    if (ap.outcome === 'pay' && p.res.gold >= ap.cost + RESERVE) { A.joinMonster(state, hero, m, ap.cost); return true; }
    if (ap.outcome === 'flee') { A.removeObject(state, m); think.push(C.get(m.cid).name + ' бегут от ' + hero.name); return true; }
    const ratio = heroPower(hero) / Math.max(1, ap.mp);
    if (ratio < (hero._role === 'main' ? 1.2 : 2.0)) return false;
    await runBattle(state, hero, { monster: m }, hooks, smart, think);
    return true;
  }
  async function attackTown(state, hero, town, hooks, smart, think) {
    const dh = town.visiting ? state.heroes[town.visiting] : null;
    const gp = (dh ? heroPower(dh) : R.armyPower(town.garrison, null)) + R.fortLevel(town) * 1500;
    if (R.armyEmpty(dh ? dh.army : town.garrison) && !dh) { A.captureTown(state, town, hero.owner, hero); think.push(hero.name + ' занял пустой ' + town.name); return true; }
    if (heroPower(hero) / Math.max(1, gp) < 1.2) return false;
    await runBattle(state, hero, { town }, hooks, smart, think);
    return true;
  }
  async function attackHero(state, hero, enemy, hooks, smart, think) {
    if (heroPower(hero) / Math.max(1, heroPower(enemy)) < 1.1) return false;
    const tw = A.townOfHero(state, enemy);
    await runBattle(state, hero, tw ? { town: tw } : { hero: enemy }, hooks, smart, think);
    return true;
  }
  async function runBattle(state, hero, target, hooks, smart, think) {
    const b = A.startBattle(state, hero, target);
    if (!b) { if (target.town) A.captureTown(state, target.town, hero.owner, hero); return null; }
    const defPlayer = b.sides[1].player;
    const humanDefends = defPlayer >= 0 && !state.players[defPlayer].isAI;
    if (humanDefends && hooks.battle) await hooks.battle(b);
    else H3.BattleAI.auto(b, smart);
    const sum = A.endBattle(state);
    // статистика для замеров: сколько боёв ИИ начал и сколько из них проиграл
    if (sum) {
      const st = state._aiStats || (state._aiStats = {});
      const me = st[hero.owner] || (st[hero.owner] = { fights: 0, lost: 0, lostValue: 0 });
      me.fights++;
      if (!sum.attWon) { me.lost++; me.lostValue += sum.res.sides[0].lostValue || 0; }
      else me.lostValue += sum.res.sides[0].lostValue || 0;
    }
    if (sum) think.push(hero.name + ': бой ' + (sum.attWon ? 'выигран' : 'проигран'));
    if (hooks.afterBattle) await hooks.afterBattle(sum);
    while (!hero.dead && R.pendingLevels(hero) > 0) autoLevelUp(state, hero);
    return sum;
  }
  function exchange(state, hero, other) {
    // всё лучшее — главному герою
    const main = hero._role === 'main' ? hero : (other._role === 'main' ? other : (heroPower(hero) >= heroPower(other) ? hero : other));
    const src = main === hero ? other : hero;
    for (let i = 0; i < 7; i++) { const s = src.army[i]; if (s && s.n > 0) { const left = R.addToArmy(main.army, s.cid, s.n); src.army[i] = left ? { cid: s.cid, n: left } : null; } }
    // разведчику оставляем одно существо, чтобы мог ходить
    if (R.armyEmpty(src.army)) { const weakest = main.army.filter(Boolean).sort((a, b) => C.aiValue(C.get(a.cid)) - C.aiValue(C.get(b.cid)))[0]; if (weakest && weakest.n > 1) { weakest.n -= 1; R.addToArmy(src.army, weakest.cid, 1); } }
  }
  function buySpellbook(state, hero, town) {
    const p = state.players[hero.owner];
    if (!hero.hasBook && R.guildLevel(town) && p.res.gold >= 500 + RESERVE) { p.res.gold -= 500; hero.hasBook = true; S.learnTownSpells(state, hero, town); }
  }
  /** Боевая машина главному герою — если кузница есть и золото лишнее. */
  function buyMachine(state, hero, town) {
    if (!town.buildings.blacksmith) return;
    const p = state.players[hero.owner];
    if (!hero.machines) hero.machines = {};
    const mid = C.SMITHY[town.faction] || 'ballista';
    if (hero.machines[mid]) return;
    const cost = C.get(mid).cost;
    if (p.res.gold < cost.gold + RESERVE * 2) return;
    U.pay(p.res, cost); hero.machines[mid] = true;
  }
  const PREF = { might: ['offense', 'armorer', 'logistics', 'archery', 'leadership', 'earth', 'air', 'wisdom', 'luck', 'pathfinding'], magic: ['wisdom', 'earth', 'air', 'sorcery', 'intelligence', 'logistics', 'armorer', 'offense', 'water', 'fire'] };
  function autoLevelUp(state, hero) {
    const opt = R.levelUpOptions(hero, state._rng.ai);
    const cl = H3.Heroes.getClass(hero.cls);
    const pref = PREF[cl.type];
    let choice = opt.choices[0] || null;
    if (opt.choices.length > 1) { const rank = c => { const i = pref.indexOf(c.id); return (i < 0 ? 20 : i) - (c.lvl > 1 ? 2 : 0); }; choice = opt.choices.slice().sort((a, b) => rank(a) - rank(b))[0]; }
    R.applyLevelUp(hero, opt.pri, choice);
  }

  H3.AI = { FLAGS, simFight, playTurn, buildInTown, recruitInTown, chooseTarget, autoLevelUp, buySpellbook, buyMachine, heroPower };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.AI;
})(typeof window !== 'undefined' ? window : globalThis);
