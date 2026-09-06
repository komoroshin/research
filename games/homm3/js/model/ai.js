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
  const RES_VALUE = { gold: 1, wood: 100, ore: 100, mercury: 300, sulfur: 300, crystal: 300, gems: 300 };
  const MINE_VALUE = { gold: 15000, wood: 2500, ore: 2500, mercury: 4500, sulfur: 4500, crystal: 4500, gems: 4500 };

  async function playTurn(state, pid, hooks) {
    hooks = hooks || {};
    const p = state.players[pid];
    if (!p.alive) return;
    const diff = S.DIFFICULTY[state.settings.difficulty] || S.DIFFICULTY.normal;
    const smart = diff.aiSmart;
    const think = [];
    // 1. города: стройка и найм героев
    for (const t of S.townsOf(state, pid)) {
      buildInTown(state, t, think);
      hireIfNeeded(state, t, think);
    }
    // 2. герои
    const heroes = S.heroesOf(state, pid).sort((a, b) => R.armyPower(b.army, b) - R.armyPower(a.army, a));
    for (let i = 0; i < heroes.length; i++) {
      const h = heroes[i]; if (h.dead) continue;
      h._role = i === 0 ? 'main' : 'scout';
      await playHero(state, h, hooks, smart, think);
      if (state.winner !== null) return;
    }
    // 3. найм существ в городах (в конце — чтобы сначала потратить на стройку)
    for (const t of S.townsOf(state, pid)) recruitInTown(state, t, think);
    p.aiThink = think.slice(-12);
  }

  /* ---------- города ---------- */
  function buildInTown(state, town, think) {
    if (town.builtToday) return;
    const p = state.players[town.owner];
    const list = B.forFaction(town.faction);
    for (const bid of B.AI_ORDER) {
      const b = list.find(x => x.id === bid); if (!b || town.buildings[bid]) continue;
      const chk = R.canBuild(state, town, bid);
      if (chk.ok) { R.build(state, town, bid); think.push('Строю ' + b.name + ' в ' + town.name); return; }
      // не хватает золота на важное — копим (если есть хотя бы 60 %)
      if (chk.reason === 'Не хватает ресурсов' && b.cost.gold && p.res.gold >= b.cost.gold * 0.6 && U.RES.every(r => r === 'gold' || (p.res[r] || 0) >= (b.cost[r] || 0))) { think.push('Коплю на ' + b.name); return; }
    }
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
      const c = C.get(cid); const canPay = Math.floor(Math.max(0, p.res.gold - RESERVE) / c.cost.gold); n = Math.min(n, canPay);
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
      if (stop.kind === 'object') { await handleObject(state, hero, stop.obj, hooks, smart, think); if (!stop.obj || !state.objects[stop.obj.id] || (stop.obj.type === 'mine' && stop.obj.owner === hero.owner)) continue; blacklist.add('o' + stop.obj.id); continue; }
      if (stop.kind === 'monster') {
        const done = await handleMonster(state, hero, stop.obj, hooks, smart, think);
        if (!done) blacklist.add('m' + stop.obj.id);
        continue;
      }
      if (stop.kind === 'town') { recruitInTown(state, state.towns[stop.town.id], think); buySpellbook(state, hero, stop.town); blacklist.add('t' + stop.town.id); continue; }
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
  function guardOf(state, obj) {
    let best = null;
    for (const m of S.monstersNear(state, obj.x, obj.y)) { const v = A.monsterPower(m); if (!best || v > best.v) best = { m, v }; }
    return best;
  }
  function winChance(ratio, role, smart) {
    const lo = role === 'main' ? 1.2 : 2.0, hi = role === 'main' ? 2.0 : 3.0;
    if (ratio >= hi) return 1; if (ratio < lo) return 0; return (ratio - lo) / (hi - lo) * 0.7 + 0.3;
  }
  function enemyHeroesOf(state, pid) { const out = []; for (const q of state.players) if (q.id !== pid && q.alive) out.push(...S.heroesOf(state, q.id)); return out; }
  function dangerAt(state, hero, x, y, myPower) {
    let d = 0;
    for (const e of enemyHeroesOf(state, hero.owner)) {
      const ep = heroPower(e);
      if (ep <= myPower * 1.2) continue;
      const dist = Math.max(Math.abs(e.x - x), Math.abs(e.y - y));
      if (dist * 100 <= R.heroMaxMove(e) * 1.3) d = Math.max(d, ep);
    }
    return d;
  }
  function chooseTarget(state, hero, pf, blacklist, smart) {
    const p = state.players[hero.owner], w = state.map.w;
    const my = heroPower(hero), role = hero._role || 'scout', maxMove = R.heroMaxMove(hero);
    const cands = [];
    const consider = (x, y, key, value, label, guardV, extra) => {
      if (blacklist.has(key)) return;
      const d = pf.dist[y * w + x]; if (!(d < Infinity)) return;
      const turns = d / maxMove;
      let pw = 1;
      if (guardV) pw = winChance(my / Math.max(1, guardV), role, smart);
      if (pw <= 0) return;
      let util = value / (turns + 1) * pw;
      if (smart && dangerAt(state, hero, x, y, my)) util *= 0.1;
      if (extra) util += extra;
      cands.push({ x, y, key, util, label, value, turns });
    };
    for (const id in state.objects) {
      const o = state.objects[id];
      const vis = p.vis[o.y * w + o.x]; if (!vis) continue;
      const t = O.get(o.type); if (t.obstacle) continue;
      const g = guardOf(state, o); const gv = g && g.m !== o ? g.v : 0;
      const key = 'o' + o.id;
      switch (o.type) {
        case 'resource': consider(o.x, o.y, key, o.amount * RES_VALUE[o.res], 'ресурсы', gv); break;
        case 'chest': consider(o.x, o.y, key, 1500, 'сундук', gv); break;
        case 'campfire': consider(o.x, o.y, key, 900, 'костёр', gv); break;
        case 'artifact': consider(o.x, o.y, key, AR.CLASS_VALUE[AR.get(o.art).cls], 'артефакт', gv); break;
        case 'mine': if (o.owner !== hero.owner) consider(o.x, o.y, key, MINE_VALUE[o.res] * (o.owner >= 0 ? 1.3 : 1), O.MINE_NAMES[o.res], gv); break;
        case 'dwelling': if (o.owner !== hero.owner || o.avail >= 3) consider(o.x, o.y, key, 1500 + (o.avail ? Math.min(3000, o.avail * C.aiValue(C.get(o.cid)) * 0.5) : 0), 'жилище', gv); break;
        case 'monster': {
          const mv = A.monsterPower(o); const ratio = my / Math.max(1, mv);
          if (ratio >= (role === 'main' ? 1.5 : 2.5)) consider(o.x, o.y, 'm' + o.id, mv * 0.35 + 1500, 'стражи ' + C.get(o.cid).name, 0);
          break;
        }
        case 'town': {
          const tw = state.towns[o.townId];
          if (tw.owner === hero.owner) { // вернуться за приростом / защитить
            const avail = tw.avail.reduce((a, n, i) => a + n * (tw.buildings['dwell_' + (i + 1)] ? C.aiValue(F.creaturesOf(tw.faction, i + 1)[0]) : 0), 0);
            let v = 0;
            if (role === 'main' && S.dayOfWeek(state.day) <= 2 && avail > my * 0.15) v = 6000;
            const threat = enemyHeroesOf(state, hero.owner).some(e => Math.max(Math.abs(e.x - tw.x), Math.abs(e.y - tw.y)) <= 8 && heroPower(e) > R.armyPower(tw.garrison, null) * 1.2);
            if (threat && role === 'main') v = 20000;
            if (!hero.hasBook && R.guildLevel(tw) && p.res.gold > 3000) v = Math.max(v, 1500);
            if (v) consider(o.x, o.y, 't' + tw.id, v, 'город ' + tw.name, 0);
          } else {
            const dh = tw.visiting ? state.heroes[tw.visiting] : null;
            const gp = dh ? heroPower(dh) : R.armyPower(tw.garrison, null);
            const towers = R.fortLevel(tw) * 1500;
            consider(o.x, o.y, 't' + tw.id, 30000 + Object.keys(tw.buildings).length * 1000, 'город ' + tw.name, gp + towers + 500);
          }
          break;
        }
        default:
          if (t.bank) { if (o.guards && o.guards.length) { const bv = o.guards.reduce((a, g) => a + C.aiValue(C.get(g.cid)) * g.n, 0); consider(o.x, o.y, key, t.value, t.name, bv); } break; }
          if (t.once === 'hero' && o.visited && o.visited['h' + hero.id]) break;
          if (t.once === 'player' && o.visited && o.visited['p' + hero.owner]) break;
          if (t.once === 'week' && ((o.weekTaken === A.week(state)) || (o.visited && o.visited['w' + hero.id] === A.week(state)))) break;
          if (t.once === 'day' && o.visited && o.visited['d' + hero.id] === state.day) break;
          if (o.type === 'trading_post' || o.type === 'tavern' || o.type === 'hill_fort') break;
          if (o.type.startsWith('shrine_') && (!hero.hasBook || hero.spells.includes(o.spell))) break;
          if (o.type === 'magic_well' && hero.mana > R.heroMaxMana(hero) * 0.5) break;
          consider(o.x, o.y, key, t.value || 500, t.name, gv);
      }
    }
    // вражеские герои
    for (const e of enemyHeroesOf(state, hero.owner)) {
      if (!p.vis[e.y * w + e.x]) continue;
      const ep = heroPower(e);
      consider(e.x, e.y, 'h' + e.id, ep * 1.2 + 3000, 'герой ' + e.name, ep + 200);
    }
    // передать армию главному
    if (role !== 'main') { const main = S.heroesOf(state, hero.owner).find(h => h._role === 'main'); if (main && main.id !== hero.id && R.armyPower(hero.army, null) > 800 && !hero._fresh) consider(main.x, main.y, 'h' + main.id, 2500, 'к ' + main.name, 0); }
    // разведка: ближайшая достижимая клетка на границе неизведанного
    if (!cands.some(c => c.util > 400)) {
      const h = state.map.h; let best = null, bd = Infinity;
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x; const d = pf.dist[i]; if (!(d < Infinity) || d < 100) continue;
        if (state.map.block[i]) continue;
        const frontier = p.vis[i - 1] === 0 || p.vis[i + 1] === 0 || p.vis[i - w] === 0 || p.vis[i + w] === 0;
        if (!frontier) continue;
        if (smart && dangerAt(state, hero, x, y, my)) continue;
        if (d < bd) { bd = d; best = [x, y]; }
      }
      if (best) cands.push({ x: best[0], y: best[1], key: 'x' + best[0] + ',' + best[1], util: 600 / (bd / maxMove + 1), label: 'разведка', value: 600, turns: bd / maxMove });
    }
    cands.sort((a, b) => b.util - a.util);
    return cands[0] || null;
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
  const PREF = { might: ['offense', 'armorer', 'logistics', 'archery', 'leadership', 'earth', 'air', 'wisdom', 'luck', 'pathfinding'], magic: ['wisdom', 'earth', 'air', 'sorcery', 'intelligence', 'logistics', 'armorer', 'offense', 'water', 'fire'] };
  function autoLevelUp(state, hero) {
    const opt = R.levelUpOptions(hero, state._rng.ai);
    const cl = H3.Heroes.getClass(hero.cls);
    const pref = PREF[cl.type];
    let choice = opt.choices[0] || null;
    if (opt.choices.length > 1) { const rank = c => { const i = pref.indexOf(c.id); return (i < 0 ? 20 : i) - (c.lvl > 1 ? 2 : 0); }; choice = opt.choices.slice().sort((a, b) => rank(a) - rank(b))[0]; }
    R.applyLevelUp(hero, opt.pri, choice);
  }

  H3.AI = { playTurn, buildInTown, recruitInTown, chooseTarget, autoLevelUp, buySpellbook, heroPower };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.AI;
})(typeof window !== 'undefined' ? window : globalThis);
