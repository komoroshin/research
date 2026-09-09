/* ============================================================================
   model/adventure.js — действия на карте приключений: движение, объекты,
   стражи (дипломатия), бои на карте, города/герои, конец хода, новый день,
   победа/поражение (ТЗ §3, §4, §6). Без DOM: возвращает описания
   взаимодействий, которые представление показывает игроку.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, F = H3.Factions, O = H3.Objects, AR = H3.Artifacts, SP = H3.Spells, HE = H3.Heroes, SK = H3.Skills, Bt = H3.Battle, Q = H3.Quest;

  const week = state => Math.floor((state.day - 1) / 7);

  /* ---------- движение ---------- */
  /**
   * Двигает героя по пути (список [x,y]) пока хватает очков и не встретится
   * терминальная клетка. Возвращает { steps:[[x,y]...], stop:{kind,...}|null, res }.
   */
  function moveHero(state, hero, path) {
    const steps = [];
    let stop = null;
    if (hero.inTown) { const t = state.towns[hero.inTown]; if (t && t.visiting === hero.id) t.visiting = null; hero.inTown = null; }
    for (const [x, y] of path) {
      const cost = S.moveCost(state, hero, x, y);
      if (!(cost < Infinity)) break;
      if (hero.move <= 0) { stop = { kind: 'nomove' }; break; }
      const dx = Math.abs(x - hero.x), dy = Math.abs(y - hero.y);
      const stepCost = (dx && dy) ? cost * 1.41 : cost;
      // под парусом шаг на сушу — высадка: лодка остаётся у берега, ход заканчивается
      if (hero.boat && S.terrainAt(state, x, y, hero.z) !== 'water') {
        const from = [hero.x, hero.y];
        hero.move = Math.max(0, hero.move - stepCost); hero.x = x; hero.y = y; steps.push([x, y]);
        disembark(state, hero, from);
        stop = { kind: 'landed' }; break;
      }
      // страж на пути: подход к его зоне контроля — бой до входа
      const guards = S.monstersNear(state, x, y, hero.z);
      const obj = S.objAt(state, x, y, hero.z);
      const other = S.heroAt(state, x, y, hero.z);
      // застава / страж-квестор: у них зона контроля, как у стражей — подходим, но не входим
      const gates = S.gatesNear(state, x, y, hero.z);
      if (gates.length && obj !== gates[0] && !(obj && O.get(obj.type).gate)) { stop = { kind: 'object', obj: gates[0], pending: [x, y] }; break; }
      if (obj && !O.get(obj.type).obstacle) {
        // объект: не входим, взаимодействуем «с порога» (кроме города и своих объектов-проходимых)
        if (obj.type === 'monster') { stop = { kind: 'monster', obj }; break; }
        if (guards.length && !(guards.length === 1 && guards[0] === obj)) { stop = { kind: 'monster', obj: guards[0], blocked: obj }; break; }
        if (obj.type === 'town') {
          const town = state.towns[obj.townId];
          if (town.owner === hero.owner) { hero.move = Math.max(0, hero.move - stepCost); hero.x = x; hero.y = y; steps.push([x, y]); enterOwnTown(state, hero, town); stop = { kind: 'town', town }; break; }
          stop = { kind: 'siege', town }; break;
        }
        // одноклеточный объект: становимся на него? Нет — остаёмся рядом, кроме подбираемых
        const t = O.get(obj.type);
        if ((t.once === 'remove' && !t.bank) || t.enter) { hero.move = Math.max(0, hero.move - stepCost); hero.x = x; hero.y = y; steps.push([x, y]); stop = { kind: 'object', obj }; break; }
        stop = { kind: 'object', obj }; hero.move = Math.max(0, hero.move - Math.min(stepCost, hero.move)); break;
      }
      if (other) {
        if (other.owner === hero.owner) { stop = { kind: 'hero', hero: other }; break; }
        stop = { kind: 'enemyHero', hero: other }; break;
      }
      if (guards.length) {
        // входим в зону контроля: сначала бой
        stop = { kind: 'monster', obj: guards[0], pending: [x, y] };
        break;
      }
      hero.move = Math.max(0, hero.move - stepCost);
      hero.x = x; hero.y = y; steps.push([x, y]);
      S.computeVisibility(state, hero.owner);
    }
    if (stop && (stop.kind === 'monster' || stop.kind === 'siege' || stop.kind === 'enemyHero' || stop.kind === 'hero')) {
      // тратим движение за подход (стоимость клетки цели)
      const tx = stop.pending ? stop.pending[0] : (stop.obj ? stop.obj.x : stop.town ? stop.town.x : stop.hero.x);
      const ty = stop.pending ? stop.pending[1] : (stop.obj ? stop.obj.y : stop.town ? stop.town.y : stop.hero.y);
      const c = S.moveCost(state, hero, tx, ty); if (c < Infinity) hero.move = Math.max(0, hero.move - Math.min(hero.move, c));
    }
    S.computeVisibility(state, hero.owner);
    return { steps, stop };
  }
  function enterOwnTown(state, hero, town) {
    hero.inTown = town.id; town.visiting = hero.id;
    const learned = S.learnTownSpells(state, hero, town);
    if (R.guildLevel(town)) hero.mana = Math.max(hero.mana, R.heroMaxMana(hero));
    return learned;
  }
  /** Герой стоит в городе (на его клетке). */
  function townOfHero(state, hero) { return hero.inTown ? state.towns[hero.inTown] : null; }

  /* ---------- стражи: дипломатия ---------- */
  function monsterPower(obj) { return C.aiValue(C.get(obj.cid)) * obj.n; }
  function approachMonster(state, hero, obj) {
    const rng = state._rng.misc;
    const power = R.armyPower(hero.army, hero);
    const mp = monsterPower(obj);
    const k = power / Math.max(1, mp);
    let st;
    if (k >= 7) st = 11; else if (k >= 1) st = Math.floor(2 * (k - 1)); else if (k >= 0.5) st = -1; else if (k >= 1 / 3) st = -2; else st = -3;
    const diff = S.DIFFICULTY[state.settings.difficulty] || S.DIFFICULTY.normal;
    const dip = 1 + R.skillLvl(hero, 'diplomacy') + (state.players[hero.owner].isAI ? 0 : diff.dip);
    let symp = 0;
    const cid = obj.cid, base = C.get(cid).upg ? C.get(cid).base : cid;
    let sameVal = 0;
    for (const s of hero.army) if (s && s.n > 0 && (s.cid === cid || s.cid === base || C.get(s.cid).base === base || C.get(s.cid).upgTo === cid)) sameVal += C.aiValue(C.get(s.cid)) * s.n;
    if (sameVal > 0) symp = sameVal > power / 2 ? 2 : 1;
    const charisma = st + dip + symp;
    const cost = C.get(cid).cost.gold * obj.n;
    let outcome;
    if (obj.character === 'compliant') outcome = 'join';
    else if (obj.character === 'savage' || charisma < obj.mood) outcome = 'fight';
    else if (dip + symp >= obj.mood) outcome = 'join';
    else if (dip + symp + 2 >= obj.mood) outcome = 'pay';
    else outcome = 'flee';
    if (outcome === 'join' && !R.canAddToArmy(hero.army, cid)) outcome = 'fight';
    return { outcome, cost, k, charisma, mood: obj.mood, power, mp };
  }
  function joinMonster(state, hero, obj, pay) {
    if (pay) state.players[hero.owner].res.gold -= pay;
    R.addToArmy(hero.army, obj.cid, obj.n);
    removeObject(state, obj);
    S.addLog(state, C.get(obj.cid).name + ' ×' + obj.n + ' присоединились к ' + hero.name + '.', 'good', hero.owner);
  }
  /* ---------- море ---------- */
  /** Герой садится в лодку: лодка исчезает с карты и становится его судном. */
  function board(state, hero, boat) {
    hero.boat = 1;
    hero.x = boat.x; hero.y = boat.y;
    removeObject(state, boat);
  }
  /** Высадка: лодка остаётся на клетке, с которой сошли. */
  function disembark(state, hero, from) {
    hero.boat = 0;
    const m = S.lvl(state, hero.z), i = from[1] * m.w + from[0];
    if (m.objAt[i] < 0) {
      const boat = { id: state.nextId++, type: 'boat', x: from[0], y: from[1], z: hero.z || 0, owner: hero.owner };
      state.objects[boat.id] = boat;
      m.objAt[i] = boat.id; m.block[i] = 1;
    }
    S.addLog(state, hero.name + ' сходит на берег.', '', hero.owner);
  }
  /** Свободная клетка моря рядом — куда спустить новую лодку. */
  function waterSpotNear(state, x, y, z) {
    for (let r = 1; r <= 3; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const nx = x + dx, ny = y + dy;
      if (!S.inMap(state, nx, ny, z) || S.terrainAt(state, nx, ny, z) !== 'water') continue;
      const m = S.lvl(state, z);
      if (m.objAt[ny * m.w + nx] >= 0) continue;
      if (S.heroAt(state, nx, ny, z)) continue;
      return [nx, ny];
    }
    return null;
  }
  /** Парные врата на другом слое. */
  function gatePartner(state, gate) {
    for (const id in state.objects) {
      const o = state.objects[id];
      if (o.type === 'subter_gate' && o.pair === gate.pair && o.id !== gate.id) return o;
    }
    return null;
  }
  function removeObject(state, obj) {
    delete state.objects[obj.id];
    const m = S.lvl(state, obj.z), i = S.idx(state, obj.x, obj.y, obj.z);
    m.objAt[i] = -1; m.block[i] = 0;
  }

  /* ---------- посещение объектов ---------- */
  const RESN = O.RES_NAMES_GEN;
  function resTxt(cost) { return U.RES.filter(r => cost[r]).map(r => cost[r] + ' ' + RESN[r]).join(', '); }
  const heroVisited = (obj, hero) => !!(obj.visited && obj.visited['h' + hero.id]);
  const markHero = (obj, hero) => { obj.visited = obj.visited || {}; obj.visited['h' + hero.id] = true; };
  const playerVisited = (obj, pid) => !!(obj.visited && obj.visited['p' + pid]);
  const markPlayer = (obj, pid) => { obj.visited = obj.visited || {}; obj.visited['p' + pid] = true; };

  /**
   * Взаимодействие героя с объектом (герой уже стоит рядом или на нём).
   * Возвращает { title, text, icon, choices?: [{id,label,desc}], effect?, kind }.
   * Эффекты без выбора применяются сразу.
   */
  function visit(state, hero, obj) {
    const p = state.players[hero.owner];
    const t = O.get(obj.type);
    const name = obj.type === 'mine' ? O.MINE_NAMES[obj.res] : t.name;
    const base = { title: name, icon: obj.type === 'mine' ? 'mine_' + obj.res : t.sprite, kind: obj.type, obj };
    switch (obj.type) {
      case 'resource': {
        p.res[obj.res] += obj.amount; removeObject(state, obj);
        S.addLog(state, hero.name + ' подбирает ' + obj.amount + ' ' + RESN[obj.res] + '.', '', hero.owner);
        return Object.assign(base, { text: 'Вы нашли ' + obj.amount + ' ' + RESN[obj.res] + '.', icon: 'res_' + obj.res, toast: true });
      }
      case 'subter_gate': {
        const other = gatePartner(state, obj);
        if (!other) return Object.assign(base, { text: 'Врата завалены.', toast: true });
        // герой появляется прямо на парных вратах (клетка объекта проходима как цель)
        const busy = S.heroAt(state, other.x, other.y, other.z);
        if (busy) return Object.assign(base, { text: 'На той стороне у врат уже кто-то стоит.', toast: true });
        hero.z = other.z; hero.x = other.x; hero.y = other.y;
        hero.move = Math.max(0, hero.move - 200);
        S.computeVisibility(state, hero.owner);
        S.addLog(state, hero.name + (other.z ? ' уходит в подземелье.' : ' выходит на поверхность.'), '', hero.owner);
        return Object.assign(base, { text: other.z ? 'Герой спускается в подземелье.' : 'Герой выходит на поверхность.', toast: true, moved: true });
      }
      case 'boat': {
        board(state, hero, obj);
        S.addLog(state, hero.name + ' поднимает парус.', '', hero.owner);
        return Object.assign(base, { text: 'Герой садится в лодку.', toast: true, moved: true });
      }
      case 'shipyard': {
        const spot = waterSpotNear(state, obj.x, obj.y, obj.z);
        if (!spot) return Object.assign(base, { text: 'Спустить лодку негде — у причала тесно.', toast: true });
        if (p.res.gold < 1000) return Object.assign(base, { text: 'Постройка лодки стоит 1000 золота — не хватает.', toast: true });
        p.res.gold -= 1000;
        const m = S.lvl(state, obj.z);
        const boat = { id: state.nextId++, type: 'boat', x: spot[0], y: spot[1], z: obj.z || 0, owner: hero.owner };
        state.objects[boat.id] = boat; m.objAt[spot[1] * m.w + spot[0]] = boat.id; m.block[spot[1] * m.w + spot[0]] = 1;
        obj.owner = hero.owner;
        return Object.assign(base, { text: 'Верфь спустила лодку на воду за 1000 золота.', toast: true });
      }
      case 'flotsam': {
        const rng = state._rng.misc; const wood = rng.int(3, 6), gold = rng.int(2, 5) * 100;
        p.res.wood += wood; p.res.gold += gold; removeObject(state, obj);
        return Object.assign(base, { text: 'Среди обломков: ' + wood + ' дерева и ' + gold + ' золота.', toast: true });
      }
      case 'sea_chest': {
        const rng = state._rng.misc;
        if (rng.chance(0.3)) {
          const art = rng.pick(AR.byClass('minor'));
          giveArtifact(hero, art.id); removeObject(state, obj);
          return Object.assign(base, { text: 'В сундуке нашёлся артефакт: ' + art.name + '.', toast: true, icon: 'art_' + art.id });
        }
        const gold = rng.int(10, 15) * 100; p.res.gold += gold; removeObject(state, obj);
        return Object.assign(base, { text: 'В сундуке ' + gold + ' золота.', toast: true });
      }
      case 'campfire': {
        const rng = state._rng.misc; const gold = rng.int(4, 6) * 100, res = rng.pick(U.RES.filter(r => r !== 'gold')), n = rng.int(4, 6);
        p.res.gold += gold; p.res[res] += n; removeObject(state, obj);
        return Object.assign(base, { text: 'У костра вы нашли ' + gold + ' золота и ' + n + ' ' + RESN[res] + '.', toast: true });
      }
      case 'chest': {
        const r = obj.roll;
        if (r >= 0.95) { const art = state._rng.misc.pick(AR.byClass('treasure')); giveArtifact(hero, art.id); removeObject(state, obj); return Object.assign(base, { text: 'В сундуке лежал артефакт: ' + art.name + '!', icon: 'art_' + art.id }); }
        const gold = r < 0.32 ? 1000 : r < 0.64 ? 1500 : 2000, xp = gold - 500;
        return Object.assign(base, { text: 'В сундуке ' + gold + ' золота. Взять золото или раздать его на опыт (' + xp + ')?', choices: [{ id: 'gold', label: gold + ' золота' }, { id: 'xp', label: xp + ' опыта' }] });
      }
      case 'artifact': {
        const art = AR.get(obj.art); giveArtifact(hero, art.id); removeObject(state, obj);
        S.addLog(state, hero.name + ' нашёл артефакт: ' + art.name + '.', 'good', hero.owner);
        return Object.assign(base, { text: art.name + ' (' + AR.CLASS_NAMES[art.cls] + '): ' + art.desc + '.', icon: 'art_' + art.id });
      }
      case 'mine': {
        if (obj.owner === hero.owner) return Object.assign(base, { text: 'Шахта уже ваша. Доход: ' + O.MINE_INCOME[obj.res] + ' ' + RESN[obj.res] + ' в день.', toast: true });
        obj.owner = hero.owner; S.computeVisibility(state, hero.owner);
        S.addLog(state, hero.name + ' захватил: ' + name + '.', 'good', hero.owner);
        return Object.assign(base, { text: 'Шахта захвачена! Теперь она приносит ' + O.MINE_INCOME[obj.res] + ' ' + RESN[obj.res] + ' в день.', toast: true });
      }
      case 'dwelling': {
        obj.owner = hero.owner;
        const c = C.get(obj.cid);
        return Object.assign(base, { text: c.name + ': доступно ' + obj.avail + ' (по ' + resTxt(c.cost) + ' за каждого).', icon: c.id, kind: 'dwelling', choices: obj.avail > 0 ? [{ id: 'recruit', label: 'Нанять' }, { id: 'no', label: 'Уйти' }] : null });
      }
      case 'learning_stone': {
        if (heroVisited(obj, hero)) return Object.assign(base, { text: 'Камень уже открыл вам свои знания.', toast: true });
        markHero(obj, hero); const lv = R.gainXp(hero, 1000);
        return Object.assign(base, { text: 'Медитация у камня даёт 1000 опыта.', levelUps: lv });
      }
      case 'tree_knowledge': {
        if (heroVisited(obj, hero)) return Object.assign(base, { text: 'Древо уже делилось с вами мудростью.', toast: true });
        if (obj.price === 'free') { markHero(obj, hero); const need = HE.xpForLevel(hero.level + 1) - hero.xp; const lv = R.gainXp(hero, need); return Object.assign(base, { text: 'Древо знаний дарует вам новый уровень!', levelUps: lv }); }
        const cost = obj.price === 'gold' ? { gold: 2000 } : { gems: 10 };
        return Object.assign(base, { text: 'Древо знаний даст уровень за ' + resTxt(cost) + '. Заплатить?', choices: [{ id: 'pay', label: 'Заплатить', disabled: !U.canAfford(p.res, cost) }, { id: 'no', label: 'Уйти' }], cost });
      }
      case 'shrine_1': case 'shrine_2': case 'shrine_3': {
        const sp = SP.get(obj.spell);
        if (!hero.hasBook) return Object.assign(base, { text: 'Здесь учат заклинанию «' + sp.name + '», но у вас нет книги заклинаний (купите в гильдии магов).' });
        if (hero.spells.includes(sp.id)) return Object.assign(base, { text: 'Вы уже знаете «' + sp.name + '».', toast: true });
        if (!R.canLearn(hero, sp)) return Object.assign(base, { text: 'Здесь учат заклинанию «' + sp.name + '» (' + sp.level + ' ур.), но без Мудрости вам его не понять.' });
        hero.spells.push(sp.id); markHero(obj, hero);
        return Object.assign(base, { text: 'Вы выучили заклинание «' + sp.name + '»: ' + SP.describe(sp, SP.masteryOf(hero, sp)), icon: 'sp_' + sp.id });
      }
      case 'magic_well': {
        if (obj.visited && obj.visited['d' + hero.id] === state.day) return Object.assign(base, { text: 'Сегодня вы уже пили из колодца.', toast: true });
        obj.visited = obj.visited || {}; obj.visited['d' + hero.id] = state.day; hero.mana = R.heroMaxMana(hero);
        return Object.assign(base, { text: 'Мана полностью восстановлена.', toast: true });
      }
      case 'fountain_fortune': case 'temple': case 'rally_flag': case 'oasis': {
        if (obj.visited && obj.visited['w' + hero.id] === week(state)) return Object.assign(base, { text: 'На этой неделе вы уже были здесь.', toast: true });
        obj.visited = obj.visited || {}; obj.visited['w' + hero.id] = week(state);
        hero.bonuses = hero.bonuses || {};
        let text = '';
        if (obj.type === 'fountain_fortune') { const l = state._rng.misc.pick([-1, 1, 1, 2, 2, 3]); hero.bonuses.luck = l; text = 'Удача ' + (l > 0 ? '+' : '') + l + ' до следующего боя.'; }
        if (obj.type === 'temple') { const m = S.dayOfWeek(state.day) === 7 ? 2 : 1; hero.bonuses.morale = m; text = 'Мораль +' + m + ' до следующего боя.'; }
        if (obj.type === 'rally_flag') { hero.bonuses.morale = 1; hero.bonuses.luck = 1; text = 'Мораль +1 и удача +1 до следующего боя.'; }
        if (obj.type === 'oasis') { hero.bonuses.morale = 1; hero.move += 800; text = 'Мораль +1 до следующего боя, +800 очков движения.'; }
        return Object.assign(base, { text, toast: true });
      }
      case 'windmill': case 'water_wheel': {
        if (obj.weekTaken === week(state)) return Object.assign(base, { text: 'На этой неделе здесь уже всё забрали.', toast: true });
        obj.weekTaken = week(state);
        if (obj.type === 'windmill') { const n = state._rng.misc.int(3, 6); const res = state._rng.misc.pick(U.RARE); p.res[res] += n; return Object.assign(base, { text: 'Мельник отдаёт вам ' + n + ' ' + RESN[res] + '.', toast: true }); }
        const g = week(state) === 0 ? 500 : 1000; p.res.gold += g; return Object.assign(base, { text: 'Мельница приносит ' + g + ' золота.', toast: true });
      }
      case 'witch_hut': {
        const sk = SK.get(obj.skill);
        if (hero.skills[sk.id]) return Object.assign(base, { text: 'Ведьма учит навыку «' + sk.name + '», но вы его уже знаете.', toast: true });
        if (Object.keys(hero.skills).length >= SK.MAX_SKILLS) return Object.assign(base, { text: 'Ведьма учит навыку «' + sk.name + '», но у вас нет места для новых навыков.' });
        hero.skills[sk.id] = 1;
        return Object.assign(base, { text: 'Ведьма научила вас навыку «' + sk.name + '» (базовый): ' + SK.describe(sk.id, 1), icon: 'sk_' + sk.id });
      }
      case 'arena': {
        if (heroVisited(obj, hero)) return Object.assign(base, { text: 'Вы уже сражались на этой арене.', toast: true });
        return Object.assign(base, { text: 'Победа на арене! Выберите награду.', choices: [{ id: 'att', label: '+2 к атаке' }, { id: 'def', label: '+2 к защите' }] });
      }
      case 'mercenary_camp': case 'marletto_tower': case 'star_axis': case 'garden_revelation': {
        if (heroVisited(obj, hero)) return Object.assign(base, { text: 'Здесь вам больше нечему учиться.', toast: true });
        markHero(obj, hero);
        const stat = { mercenary_camp: 'att', marletto_tower: 'def', star_axis: 'pow', garden_revelation: 'kno' }[obj.type];
        hero.pri[stat] += 1; if (stat === 'kno') hero.mana = Math.min(R.heroMaxMana(hero), hero.mana + 10);
        return Object.assign(base, { text: '+1 к ' + ({ att: 'атаке', def: 'защите', pow: 'силе магии', kno: 'знанию' })[stat] + '.', toast: true });
      }
      case 'observatory': {
        if (playerVisited(obj, hero.owner)) return Object.assign(base, { text: 'Отсюда вы уже осматривали окрестности.', toast: true });
        markPlayer(obj, hero.owner); S.reveal(state, hero.owner, obj.x, obj.y, 15, 1, hero.z); S.computeVisibility(state, hero.owner);
        return Object.assign(base, { text: 'С обсерватории видно всё вокруг в радиусе 15.', toast: true });
      }
      case 'trading_post': return Object.assign(base, { text: 'Торговый пост: обмен ресурсов.', kind: 'market' });
      case 'hill_fort': return Object.assign(base, { text: 'Холмфорт: улучшение существ 1–4 уровня. Существа 1 уровня улучшаются бесплатно.', kind: 'hillfort' });
      case 'tavern': return Object.assign(base, { text: 'Таверна: здесь можно нанять героя.', kind: 'tavern' });
      case 'bank_crypt': case 'bank_dwarven': case 'bank_griffin': case 'bank_utopia': case 'pandora_box': {
        if (!obj.guards || !obj.guards.length) return Object.assign(base, { text: 'Здесь уже пусто.', toast: true });
        const g = obj.guards.map(x => C.get(x.cid).name + ' ×' + x.n).join(', ');
        if (obj.type === 'pandora_box') return Object.assign(base, { text: 'Ящик заперт, и его берегут: ' + g + '. Внутри — ' + (obj.rewards || []).map(Q.rewardText).join(' и ') + '. Открыть?', choices: [{ id: 'fight', label: 'Открыть' }, { id: 'no', label: 'Уйти' }] });
        return Object.assign(base, { text: t.desc + ' Внутри: ' + g + '. Напасть?', choices: [{ id: 'fight', label: 'В бой' }, { id: 'no', label: 'Уйти' }] });
      }
      case 'keymaster': {
        const keys = Q.keysOf(p), col = Q.KEY_COLORS[obj.color];
        if (keys[obj.color]) return Object.assign(base, { text: col.name + ' ключ у вас уже есть.', toast: true });
        keys[obj.color] = true; markPlayer(obj, hero.owner);
        S.addLog(state, hero.name + ' получает ' + col.gen.replace(/ого$/, 'ый') + ' ключ.', 'good', hero.owner);
        return Object.assign(base, { text: 'Ключник вручает вам ' + col.name.toLowerCase() + ' ключ. Теперь застава ' + col.gen + ' цвета вас пропустит.', toast: true });
      }
      case 'border_guard': {
        const col = Q.KEY_COLORS[obj.color];
        if (!Q.keysOf(p)[obj.color]) return Object.assign(base, { text: 'Застава требует ' + col.name.toLowerCase() + ' ключ. Его выдаёт шатёр ключника того же цвета.' });
        removeObject(state, obj);
        S.addLog(state, hero.name + ' открывает заставу ' + col.gen + ' цвета.', 'good', hero.owner);
        return Object.assign(base, { text: 'Стража видит ' + col.name.toLowerCase() + ' ключ и открывает проход.', toast: true });
      }
      case 'quest_guard': {
        const done = Q.met(state, hero, obj.quest);
        if (!done) return Object.assign(base, { text: 'Страж пропустит, если ' + Q.text(obj.quest) + '.' });
        const cost = Q.costText(obj.quest);
        return Object.assign(base, { text: 'Условие выполнено: ' + Q.text(obj.quest) + '.' + (cost ? ' (' + cost + '.)' : '') + ' Пройти?', choices: [{ id: 'give', label: 'Пройти' }, { id: 'no', label: 'Позже' }] });
      }
      case 'seer_hut': {
        if (playerVisited(obj, hero.owner)) return Object.assign(base, { text: 'Провидец уже отблагодарил вас.', toast: true });
        const done = Q.met(state, hero, obj.quest);
        const rw = Q.rewardText(obj.reward);
        if (!done) return Object.assign(base, { text: 'Провидец просит ' + Q.text(obj.quest) + '. Награда: ' + rw + '.' });
        const cost = Q.costText(obj.quest);
        return Object.assign(base, { text: 'Задание выполнено: ' + Q.text(obj.quest) + '.' + (cost ? ' (' + cost + '.)' : '') + ' Награда: ' + rw + '. Получить?', choices: [{ id: 'give', label: 'Получить награду' }, { id: 'no', label: 'Позже' }] });
      }
      default: return Object.assign(base, { text: t.desc || 'Здесь ничего нет.', toast: true });
    }
  }
  /** Разрешение выбора в диалоге объекта. */
  function resolve(state, hero, obj, choice) {
    const p = state.players[hero.owner];
    if (obj.type === 'chest') {
      const r = obj.roll; const gold = r < 0.32 ? 1000 : r < 0.64 ? 1500 : 2000;
      removeObject(state, obj);
      if (choice === 'gold') { p.res.gold += gold; S.addLog(state, hero.name + ' взял ' + gold + ' золота из сундука.', '', hero.owner); return { text: '+' + gold + ' золота' }; }
      const lv = R.gainXp(hero, gold - 500); S.addLog(state, hero.name + ' получил ' + (gold - 500) + ' опыта.', '', hero.owner); return { text: '+' + (gold - 500) + ' опыта', levelUps: lv };
    }
    if (obj.type === 'tree_knowledge' && choice === 'pay') {
      const cost = obj.price === 'gold' ? { gold: 2000 } : { gems: 10 };
      if (!U.canAfford(p.res, cost)) return { text: 'Не хватает ресурсов' };
      U.pay(p.res, cost); markHero(obj, hero);
      const lv = R.gainXp(hero, HE.xpForLevel(hero.level + 1) - hero.xp); return { text: 'Новый уровень!', levelUps: lv };
    }
    if (obj.type === 'arena') { markHero(obj, hero); hero.pri[choice] += 2; return { text: '+2 к ' + (choice === 'att' ? 'атаке' : 'защите') }; }
    if (obj.type === 'quest_guard' && choice === 'give') {
      if (!Q.met(state, hero, obj.quest)) return { text: 'Условие не выполнено' };
      Q.take(state, hero, obj.quest); removeObject(state, obj);
      S.addLog(state, hero.name + ' проходит стража-квестора.', 'good', hero.owner);
      return { text: 'Страж отступает: проход открыт' };
    }
    if (obj.type === 'seer_hut' && choice === 'give') {
      if (!Q.met(state, hero, obj.quest) || playerVisited(obj, hero.owner)) return { text: 'Задание не выполнено' };
      Q.take(state, hero, obj.quest); markPlayer(obj, hero.owner);
      const g = Q.give(state, hero, obj.reward);
      S.addLog(state, hero.name + ' выполняет задание провидца: ' + g.text + '.', 'good', hero.owner);
      return { text: 'Награда: ' + g.text, levelUps: g.levelUps };
    }
    if (obj.type === 'dwelling' && choice === 'recruit') return { kind: 'recruitDwelling', obj };
    return null;
  }
  function giveArtifact(hero, artId) {
    const art = AR.get(artId);
    for (const slot of AR.slotsFor(art)) if (!hero.arts[slot]) { hero.arts[slot] = artId; return slot; }
    hero.backpack.push(artId); return null;
  }
  function recruitFromDwelling(state, hero, obj, n) {
    const c = C.get(obj.cid), p = state.players[hero.owner];
    let max = obj.avail;
    for (const r of U.RES) if (c.cost[r]) max = Math.min(max, Math.floor(p.res[r] / c.cost[r]));
    n = Math.min(n, max);
    if (n <= 0) return { ok: false, reason: 'Не хватает ресурсов' };
    if (!R.canAddToArmy(hero.army, c.id)) return { ok: false, reason: 'Нет места в армии' };
    U.pay(p.res, R.recruitCost(c.id, n)); obj.avail -= n; R.addToArmy(hero.army, c.id, n);
    return { ok: true, n };
  }

  /* ---------- бои на карте ---------- */
  function splitNeutral(cid, n) {
    const army = [null, null, null, null, null, null, null];
    const k = n >= 40 ? 5 : n >= 20 ? 4 : n >= 8 ? 3 : n >= 3 ? 2 : 1;
    const per = Math.floor(n / k); let rest = n - per * k;
    const rows = [3, 1, 5, 0, 6, 2, 4];
    for (let i = 0; i < k; i++) army[rows[i]] = { cid, n: per + (rest-- > 0 ? 1 : 0) };
    return army;
  }
  /**
   * target: { monster } | { hero } | { town } | { bank }
   * Возвращает bstate; state.battle = { b, ctx }.
   */
  function startBattle(state, hero, target) {
    const rng = state._rng.battle;
    const terrain = S.terrainAt(state, hero.x, hero.y, hero.z);
    const att = { hero, army: hero.army, player: hero.owner, name: hero.name, isAI: state.players[hero.owner].isAI };
    let def, ctx, siege = null, defTerrain = terrain;
    if (target.monster) {
      const m = target.monster; defTerrain = S.terrainAt(state, m.x, m.y, m.z);
      def = { hero: null, army: splitNeutral(m.cid, m.n), player: -1, name: C.get(m.cid).name + ' ×' + m.n, isAI: true, canRetreat: false };
      ctx = { type: 'monster', objId: m.id, heroId: hero.id, pending: target.pending || null };
    } else if (target.hero) {
      const e = target.hero; defTerrain = S.terrainAt(state, e.x, e.y, e.z);
      def = { hero: e, army: e.army, player: e.owner, name: e.name, isAI: state.players[e.owner].isAI };
      ctx = { type: 'hero', heroId: hero.id, defHeroId: e.id };
      const tw = townOfHero(state, e); if (tw) { siege = tw; mergeGarrison(tw, e); }
    } else if (target.town) {
      const tw = target.town; siege = tw; defTerrain = S.terrainAt(state, tw.x, tw.y + 1, tw.z);
      const dh = tw.visiting ? state.heroes[tw.visiting] : null;
      if (dh) { mergeGarrison(tw, dh); def = { hero: dh, army: dh.army, player: dh.owner, name: dh.name, isAI: true, canRetreat: false, morale: tw.buildings.tavern ? 1 : 0 }; }
      else def = { hero: null, army: tw.garrison, player: tw.owner, name: 'Гарнизон ' + tw.name, isAI: true, canRetreat: false, morale: tw.buildings.tavern ? 1 : 0 };
      if (R.armyEmpty(def.army)) return null; // пустой город — захват без боя
      ctx = { type: 'town', townId: tw.id, heroId: hero.id, defHeroId: dh ? dh.id : null };
    } else if (target.bank) {
      const bk = target.bank; const army = [null, null, null, null, null, null, null];
      bk.guards.forEach((g, i) => { army[[1, 3, 5, 7, 9][i] ? [0, 2, 4, 6][i] || i : i] = { cid: g.cid, n: g.n }; });
      def = { hero: null, army: army.filter(Boolean).concat([null, null, null, null, null, null, null]).slice(0, 7), player: -1, name: O.get(bk.type).name, isAI: true, canRetreat: false };
      ctx = { type: 'bank', objId: bk.id, heroId: hero.id };
    }
    const native = { 0: F.get(hero.faction).terrain === defTerrain && false, 1: false };
    const b = Bt.create(att, def, { terrain: defTerrain, rng, siege });
    // родная земля: существа фракции на своей местности
    state.battle = { b, ctx };
    state.stats.battles++;
    return b;
  }
  function mergeGarrison(town, hero) {
    for (let i = 0; i < 7; i++) { const g = town.garrison[i]; if (g && g.n > 0) { const left = R.addToArmy(hero.army, g.cid, g.n); town.garrison[i] = left ? { cid: g.cid, n: left } : null; } }
  }
  /** Применяет результат боя к состоянию. Возвращает сводку для экрана итогов. */
  function endBattle(state) {
    const { b, ctx } = state.battle;
    const res = b.result || (b.over ? b.result : null);
    state.battle = null;
    if (!res) return null;
    const attHero = state.heroes[ctx.heroId];
    const defHero = ctx.defHeroId ? state.heroes[ctx.defHeroId] : null;
    const attWon = res.winner === 0;
    // армии
    const apply = (hero, sideRes) => {
      if (!hero) return;
      for (let i = 0; i < 7; i++) hero.army[i] = sideRes.army[i];
      R.cleanArmy(hero.army); hero.bonuses = {};
      // уничтоженные боевые машины потеряны — покупать заново
      if (hero.machines) for (const mid of sideRes.machinesLost || []) delete hero.machines[mid];
    };
    apply(attHero, res.sides[0]); apply(defHero, res.sides[1]);
    if (attHero) attHero.mana = b.sides[0].mana; if (defHero) defHero.mana = b.sides[1].mana;
    const summary = { attWon, winner: attWon ? attHero : defHero, loser: attWon ? defHero : attHero, xp: 0, levelUps: 0, raised: 0, loot: [], res, ctx, text: [] };
    const winnerHero = attWon ? attHero : defHero, loserHero = attWon ? defHero : attHero;
    state.stats.killed += res.sides[attWon ? 1 : 0].losses.reduce((a, l) => a + l.n, 0);
    state.stats.lost += res.sides[attWon ? 0 : 1].losses.reduce((a, l) => a + l.n, 0);
    if (winnerHero) {
      summary.xp = res.xp; summary.levelUps = R.gainXp(winnerHero, res.xp);
      if (attWon) state.stats.won++;
      // некромантия
      const nec = R.skillVal(winnerHero, 'necromancy');
      if (nec > 0) {
        let killed = 0, hp = 0; for (const k of res.killedLiving) { killed += k.n; hp += k.n * k.hp; }
        const raised = Math.min(Math.floor(killed * nec / 100), Math.floor(hp / 6));
        if (raised > 0 && R.canAddToArmy(winnerHero.army, 'skeleton')) { R.addToArmy(winnerHero.army, 'skeleton', raised); summary.raised = raised; }
      }
    }
    // проигравший герой
    if (loserHero) {
      if (res.reason === 'surrender') { const cost = Math.floor(R.armyCost(loserHero.army).gold * 0.5 * (1 - 0.2 * R.skillLvl(loserHero, 'diplomacy'))); state.players[loserHero.owner].res.gold = Math.max(0, state.players[loserHero.owner].res.gold - cost); retireHero(state, loserHero, true); }
      else if (res.reason === 'retreat') retireHero(state, loserHero, false);
      else { // погиб: артефакты победителю
        if (winnerHero) { for (const slot in loserHero.arts) { summary.loot.push(loserHero.arts[slot]); giveArtifact(winnerHero, loserHero.arts[slot]); } for (const a of loserHero.backpack) { summary.loot.push(a); giveArtifact(winnerHero, a); } }
        killHero(state, loserHero);
      }
    }
    // контекст
    if (ctx.type === 'monster') {
      const m = state.objects[ctx.objId];
      if (attWon && m) { removeObject(state, m); if (ctx.pending && attHero && !S.heroAt(state, ctx.pending[0], ctx.pending[1], attHero.z)) { /* герой остаётся на месте; путь продолжит игрок */ } }
      else if (m && !attWon) { // страж поредел
        const left = res.sides[1].army.filter(Boolean).reduce((a, s) => a + s.n, 0); if (left > 0) m.n = left; else removeObject(state, m);
      }
    } else if (ctx.type === 'town') {
      const tw = state.towns[ctx.townId];
      if (attWon) captureTown(state, tw, attHero.owner, attHero);
      else if (defHero) { /* защитник остаётся */ } else { // гарнизон выжил
        for (let i = 0; i < 7; i++) tw.garrison[i] = res.sides[1].army[i]; R.cleanArmy(tw.garrison);
      }
    } else if (ctx.type === 'bank') {
      const bk = state.objects[ctx.objId];
      if (attWon && bk && bk.type === 'pandora_box') {
        // ящик открыт: награды — в формате квестов, сам ящик исчезает
        for (const r of (bk.rewards || [])) { const g = Q.give(state, attHero, r); summary.text.push('+' + g.text); if (r.kind === 'artifact') summary.loot.push(r.art); if (g.levelUps) summary.levelUps = (summary.levelUps || 0) + g.levelUps; }
        removeObject(state, bk);
      } else if (attWon && bk) {
        const rw = O.BANKS[bk.type].reward, p = state.players[attHero.owner];
        if (rw.gold) { p.res.gold += rw.gold; summary.text.push('+' + rw.gold + ' золота'); }
        if (rw.crystal) { p.res.crystal += rw.crystal; summary.text.push('+' + rw.crystal + ' кристаллов'); }
        if (rw.creature) { const left = R.addToArmy(attHero.army, rw.creature, rw.n); summary.text.push(C.get(rw.creature).name + ' ×' + (rw.n - left) + ' присоединились'); }
        if (rw.artifacts) { const rng = state._rng.misc; for (let i = 0; i < rw.artifacts; i++) { const art = rng.pick(AR.byClass(rng.pick(['minor', 'major', 'major', 'relic']))); giveArtifact(attHero, art.id); summary.loot.push(art.id); } }
        bk.guards = []; bk.type = bk.type; bk.empty = true;
      } else if (bk && !attWon) { bk.guards = res.sides[1].army.filter(Boolean).map(s => ({ cid: s.cid, n: s.n })); }
    } else if (ctx.type === 'hero') {
      if (attWon && defHero) { const tw = townOfHero(state, defHero); }
    }
    if (attHero && !attHero.dead) S.computeVisibility(state, attHero.owner);
    if (defHero && !defHero.dead) S.computeVisibility(state, defHero.owner);
    S.addLog(state, (attHero ? attHero.name : '?') + ' — бой с ' + b.sides[1].name + ': ' + (attWon ? 'победа' : 'поражение') + (summary.xp ? ' (+' + summary.xp + ' опыта)' : ''), attWon ? 'good' : 'warn', (defHero && !state.players[attHero.owner].isAI) || (attHero && !state.players[attHero.owner].isAI) ? -1 : (defHero ? defHero.owner : attHero.owner));
    checkPlayersAlive(state);
    return summary;
  }
  function killHero(state, hero) {
    hero.dead = true;
    const p = state.players[hero.owner];
    p.heroes = p.heroes.filter(id => id !== hero.id);
    if (hero.inTown) { const t = state.towns[hero.inTown]; if (t && t.visiting === hero.id) t.visiting = null; }
    hero.x = -1; hero.y = -1; hero.inTown = null;
    S.addLog(state, 'Герой ' + hero.name + ' погиб.', 'warn');
  }
  function retireHero(state, hero, keepArmy) {
    state.retired = state.retired || {};
    const rec = U.clone(hero); if (!keepArmy) rec.army = [null, null, null, null, null, null, null];
    state.retired[hero.tid] = rec;
    killHero(state, hero);
  }
  function captureTown(state, town, newOwner, hero) {
    const old = town.owner;
    if (old >= 0) { const op = state.players[old]; op.towns = op.towns.filter(id => id !== town.id); }
    town.owner = newOwner; state.players[newOwner].towns.push(town.id);
    town.capturedDay = state.day; town.builtToday = true;
    town.garrison = [null, null, null, null, null, null, null];
    if (town.visiting) { const vh = state.heroes[town.visiting]; if (vh && !vh.dead) killHero(state, vh); town.visiting = null; }
    if (town.buildings.hall_4 && state.players[newOwner].towns.some(id => id !== town.id && state.towns[id].buildings.hall_4)) { delete town.buildings.hall_4; town.buildings.hall_3 = true; }
    town.tavern = R.tavernCandidates(state, town, 2);
    if (hero) { hero.x = town.x; hero.y = town.y; enterOwnTown(state, hero, town); }
    const obj = state.objects[town.objId]; if (obj) obj.owner = newOwner;
    S.computeVisibility(state, newOwner);
    S.addLog(state, (hero ? hero.name : 'Армия') + ' захватил город ' + town.name + '!', 'good');
    checkPlayersAlive(state);
  }

  /* ---------- герои: найм, обмен, портал ---------- */
  function hireHero(state, town, tid) {
    const p = state.players[town.owner];
    if (town.visiting) return { ok: false, reason: 'В городе уже есть герой' };
    if (!town.buildings.tavern) return { ok: false, reason: 'Нет таверны' };
    if (p.res.gold < R.HERO_COST) return { ok: false, reason: 'Нужно 2500 золота' };
    if (p.heroes.length >= 8) return { ok: false, reason: 'Слишком много героев' };
    if (!town.tavern.includes(tid)) return { ok: false, reason: 'Такого героя нет в таверне' };
    p.res.gold -= R.HERO_COST;
    let hero;
    if (state.retired && state.retired[tid]) {
      hero = U.clone(state.retired[tid]); delete state.retired[tid];
      hero.id = state.nextId++; hero.dead = false; hero.owner = town.owner; hero.x = town.x; hero.y = town.y; hero.move = R.heroMaxMove(hero); hero.bonuses = {};
      if (R.armyEmpty(hero.army)) hero.army = R.startingArmy(hero.faction, state._rng.misc);
      state.heroes[hero.id] = hero;
    } else hero = R.makeHero(state, tid, town.owner, town.x, town.y, false);
    p.heroes.push(hero.id);
    enterOwnTown(state, hero, town);
    town.tavern = town.tavern.filter(x => x !== tid);
    const more = R.tavernCandidates(state, town, 1); if (more.length) town.tavern.push(more[0]);
    S.computeVisibility(state, town.owner);
    S.addLog(state, 'Нанят герой ' + hero.name + ' в городе ' + town.name + '.', '', town.owner);
    return { ok: true, hero };
  }
  function dismissHero(state, hero) { killHero(state, hero); }
  /** Перемещение стека между слотами двух армий (или внутри одной). */
  function moveStack(a1, i, a2, j) {
    const s1 = a1[i], s2 = a2[j];
    if (!s1) return false;
    if (s2 && s2.cid === s1.cid && !(a1 === a2 && i === j)) { s2.n += s1.n; a1[i] = null; return true; }
    a1[i] = s2 || null; a2[j] = s1; return true;
  }
  function splitStack(a1, i, a2, j, n) {
    const s1 = a1[i]; if (!s1 || n <= 0 || n >= s1.n) return false;
    if (a2[j] && a2[j].cid !== s1.cid) return false;
    if (a2[j]) a2[j].n += n; else a2[j] = { cid: s1.cid, n };
    s1.n -= n; return true;
  }
  function castTownPortal(state, hero, townId) {
    const sp = SP.get('town_portal');
    if (!hero.spells.includes('town_portal')) return { ok: false, reason: 'Герой не знает Городской портал' };
    const m = SP.masteryOf(hero, sp), cost = SP.manaCost(sp, m);
    if (hero.mana < cost) return { ok: false, reason: 'Не хватает маны' };
    if (hero.move < 300) return { ok: false, reason: 'Нужно не меньше 300 очков движения' };
    const towns = S.townsOf(state, hero.owner).filter(t => !t.visiting || t.visiting === hero.id);
    if (!towns.length) return { ok: false, reason: 'Нет свободного города' };
    let town;
    if (m >= 2 && townId) town = towns.find(t => t.id === townId);
    if (!town) town = towns.sort((p, q) => Math.hypot(p.x - hero.x, p.y - hero.y) - Math.hypot(q.x - hero.x, q.y - hero.y))[0];
    if (hero.inTown) { const t0 = state.towns[hero.inTown]; if (t0 && t0.visiting === hero.id) t0.visiting = null; hero.inTown = null; }
    hero.mana -= cost; hero.move -= 300; hero.x = town.x; hero.y = town.y; enterOwnTown(state, hero, town); S.computeVisibility(state, hero.owner);
    return { ok: true, town };
  }

  /* ---------- ход, день, неделя ---------- */
  function endPlayerTurn(state) {
    const p = state.players[state.turn];
    for (const h of S.heroesOf(state, p.id)) h._moved = false;
    let next = state.turn;
    for (let i = 0; i < state.players.length; i++) { next = (next + 1) % state.players.length; if (state.players[next].alive) break; }
    if (next <= state.turn) newDay(state);
    state.turn = next;
    if (!state.players[state.turn].alive) { // если все мертвы кроме одного — победа уже поставлена
      for (let i = 0; i < state.players.length; i++) if (state.players[i].alive) { state.turn = i; break; }
    }
    state._rng && S.syncRng(state);
  }
  function newDay(state) {
    state.day++;
    const isWeek = S.dayOfWeek(state.day) === 1;
    const diff = S.DIFFICULTY[state.settings.difficulty] || S.DIFFICULTY.normal;
    for (const p of state.players) {
      if (!p.alive) continue;
      const inc = S.playerIncome(state, p.id);
      if (p.isAI) { inc.gold = Math.floor(inc.gold * (1 + diff.aiGold)); inc.wood = Math.floor(inc.wood * (1 + diff.aiWood)); inc.ore = Math.floor(inc.ore * (1 + diff.aiWood)); for (const r of U.RARE) inc[r] = Math.floor(inc[r] * (1 + diff.aiRare)); }
      U.addRes(p.res, inc); p.income = inc;
      for (const h of S.heroesOf(state, p.id)) {
        h.move = R.heroMaxMove(h);
        const t = townOfHero(state, h);
        if (t && R.guildLevel(t)) h.mana = R.heroMaxMana(h); else h.mana = Math.min(R.heroMaxMana(h), h.mana + 1 + R.skillVal(h, 'mysticism'));
        if (isWeek) h.bonuses = {};
      }
      for (const t of S.townsOf(state, p.id)) { t.builtToday = false; if (isWeek) R.newTownWeek(t); }
      if (!p.towns.length) { p.daysWithoutTown++; if (p.daysWithoutTown >= 7) eliminate(state, p, '7 дней без города'); } else p.daysWithoutTown = 0;
    }
    if (isWeek) {
      for (const id in state.objects) {
        const o = state.objects[id];
        if (o.type === 'monster') o.n = Math.max(o.n + 1, Math.ceil(o.n * 1.1));
        if (o.type === 'dwelling') o.avail += C.get(o.cid).growth;
      }
      for (const id in state.towns) { const t = state.towns[id]; if (t.owner < 0) R.newTownWeek(t); }
      S.addLog(state, S.dateStr(state.day) + '. Новая неделя: прирост существ, стражи усилились.', 'day');
    } else S.addLog(state, S.dateStr(state.day) + '.', 'day');
    for (const p of state.players) if (p.alive) S.computeVisibility(state, p.id);
    checkCapitulation(state);
    checkPlayersAlive(state);
  }
  function eliminate(state, p, why) {
    if (!p.alive) return;
    p.alive = false;
    for (const h of S.heroesOf(state, p.id)) killHero(state, h);
    for (const tid of p.towns.slice()) { const t = state.towns[tid]; t.owner = -1; }
    p.towns = [];
    S.addLog(state, p.name + ' выбывает из игры (' + why + ').', 'warn');
  }
  function playerPower(state, pid) {
    let v = 0;
    for (const h of S.heroesOf(state, pid)) v += R.armyPower(h.army, h);
    for (const t of S.townsOf(state, pid)) v += R.armyPower(t.garrison, null);
    return v;
  }
  function checkCapitulation(state) {
    const human = state.players[0]; if (!human.alive) return;
    const hp = playerPower(state, 0);
    for (const p of state.players) {
      if (!p.isAI || !p.alive) continue;
      const weak = (!p.towns.length) || (p.towns.length && human.towns.length >= 2 && playerPower(state, p.id) < 0.2 * hp);
      p.weakDays = weak ? (p.weakDays || 0) + 1 : 0;
      if (p.weakDays >= 3 && !p.towns.length) { eliminate(state, p, 'капитуляция'); }
      else if (p.weakDays >= 3) {
        for (const tid of p.towns.slice()) captureTown(state, state.towns[tid], 0, null);
        eliminate(state, p, 'капитуляция');
        S.addLog(state, p.name + ' капитулировал: его города переходят вам!', 'good');
      }
    }
  }
  /* ---------- цели сценария ----------
     Кроме «убить всех» карта может ставить свои условия: взять конкретный
     город, добыть артефакт, накопить ресурс, продержаться N дней. Победа —
     если выполнено ЛЮБОЕ из win-условий, поражение — если сработало любое
     из lose. Цели проверяются за игрока-человека (0); ИИ играет на истребление. */
  const GOAL_TEXT = {
    kill_all: () => 'Победить всех противников',
    capture_town: (state, g) => 'Захватить город ' + ((state.towns[g.townId] || {}).name || '?'),
    capture_all_towns: () => 'Захватить все города на карте',
    defeat_hero: (state, g) => 'Победить героя ' + ((state.heroes[g.heroId] || {}).name || '?'),
    gather: (state, g) => 'Накопить ' + U.fmt(g.amount) + ' ' + (O.RES_NAMES_GEN[g.res] || g.res),
    find_artifact: (state, g) => 'Найти артефакт «' + ((AR.get(g.art) || {}).name || '?') + '»',
    survive: (state, g) => 'Продержаться ' + g.days + ' ' + U.plural(g.days, 'день', 'дня', 'дней'),
    build: (state, g) => 'Построить ' + ((H3.Buildings.BY_ID[g.building] || {}).name || g.building),
    lose_all: () => 'Потерять все города и героев',
    lose_town: (state, g) => 'Потерять город ' + ((state.towns[g.townId] || {}).name || '?'),
    lose_hero: (state, g) => 'Потерять героя ' + ((state.heroes[g.heroId] || {}).name || '?'),
    timeout: (state, g) => 'Не уложиться в ' + g.days + ' ' + U.plural(g.days, 'день', 'дня', 'дней'),
  };
  function goalText(state, g) { const f = GOAL_TEXT[g.type]; return f ? f(state, g) : g.type; }
  function goalMet(state, g, pid) {
    const p = state.players[pid];
    switch (g.type) {
      case 'kill_all': return state.players.every(q => q.id === pid || !q.alive);
      case 'capture_town': { const t = state.towns[g.townId]; return !!t && t.owner === pid; }
      case 'capture_all_towns': return Object.values(state.towns).every(t => t.owner === pid);
      case 'defeat_hero': { const h = state.heroes[g.heroId]; return !h || h.dead; }
      case 'gather': return (p.res[g.res] || 0) >= g.amount;
      case 'find_artifact': return S.heroesOf(state, pid).some(h => Object.keys(h.arts).some(k => h.arts[k] === g.art) || h.backpack.includes(g.art));
      case 'survive': return state.day > g.days;
      case 'build': return S.townsOf(state, pid).some(t => !!t.buildings[g.building]);
      default: return false;
    }
  }
  function goalFailed(state, g, pid) {
    switch (g.type) {
      case 'lose_all': return !state.players[pid].alive;
      case 'lose_town': { const t = state.towns[g.townId]; return !!t && t.owner !== pid; }
      case 'lose_hero': { const h = state.heroes[g.heroId]; return !h || h.dead; }
      case 'timeout': return state.day > g.days;
      default: return false;
    }
  }
  /** Сводка целей для интерфейса: [{text, done, lose}]. */
  function goalList(state, pid) {
    const g = state.goals || DEFAULT_GOALS;
    return g.win.map(x => ({ text: goalText(state, x), done: goalMet(state, x, pid || 0), lose: false }))
      .concat(g.lose.map(x => ({ text: goalText(state, x), done: goalFailed(state, x, pid || 0), lose: true })));
  }
  const DEFAULT_GOALS = { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] };
  /** Проверка целей игрока-человека; ставит state.winner и state.endReason. */
  function checkGoals(state) {
    if (state.winner !== null) return;
    const goals = state.goals || DEFAULT_GOALS;
    for (const g of goals.lose) {
      if (goalFailed(state, g, 0)) {
        const alive = state.players.filter(p => p.alive && p.id !== 0);
        state.winner = alive.length ? alive[0].id : -1;
        state.endReason = goalText(state, g);
        return;
      }
    }
    for (const g of goals.win) {
      if (goalMet(state, g, 0)) { state.winner = 0; state.endReason = goalText(state, g); return; }
    }
  }
  function checkPlayersAlive(state) {
    for (const p of state.players) {
      if (!p.alive) continue;
      if (!p.heroes.length && !p.towns.length) eliminate(state, p, 'нет героев и городов');
    }
    checkGoals(state);
    const alive = state.players.filter(p => p.alive);
    if (state.winner === null) {
      // страховка на случай, если целей нет: обычная победа «остался один»
      if (!state.players[0].alive) state.winner = alive.length ? alive[0].id : -1;
      else if (alive.length === 1) state.winner = 0;
    }
  }

  H3.Adventure = { checkGoals, goalList, goalText, goalMet, goalFailed, DEFAULT_GOALS, board, disembark, waterSpotNear, gatePartner, week, moveHero, enterOwnTown, townOfHero, approachMonster, joinMonster, removeObject, visit, resolve, giveArtifact, recruitFromDwelling,
    startBattle, endBattle, killHero, captureTown, hireHero, dismissHero, moveStack, splitStack, castTownPortal, endPlayerTurn, newDay, playerPower, checkPlayersAlive, monsterPower };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Adventure;
})(typeof window !== 'undefined' ? window : globalThis);
