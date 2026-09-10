// Тесты правил без браузера: node test/run.js
const assert = require('assert');
const H3 = require('./load.js');
const U = H3.U, R = H3.Rules, S = H3.State, Bt = H3.Battle, C = H3.Creatures, PF = H3.Pathfind, HE = H3.Heroes;
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok  ' + name); } catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + (e.message || e) + (process.env.TRACE ? '\n' + e.stack : '')); } }
const army = list => { const a = [null, null, null, null, null, null, null]; list.forEach(([cid, n], i) => a[i] = { cid, n }); return a; };
const mkHero = (tid, lvl) => { const st = { nextId: 1, heroes: {}, _rng: { misc: new U.RNG(5) } }; const h = R.makeHero(st, tid, 0, 0, 0, true); h.level = lvl || 1; return h; };

console.log('hex');
test('расстояния и соседи', () => {
  const H = U.Hex;
  assert.equal(H.dist(0, 0, 14, 10), 19); assert.equal(H.dist(3, 3, 3, 4), 1); assert.equal(H.dist(0, 0, 0, 2), 2);
  for (const [c, r] of H.neighbors(5, 5)) assert.equal(H.dist(5, 5, c, r), 1);
  for (const [c, r] of H.neighbors(5, 6)) assert.equal(H.dist(5, 6, c, r), 1);
});
test('пиксель ↔ гекс', () => {
  const H = U.Hex;
  for (let r = 0; r < 11; r++) for (let c = 0; c < 15; c++) { const [x, y] = H.center(c, r, 20, 7, 9); const [c2, r2] = H.fromPixel(x + 2, y - 3, 20, 7, 9); assert.deepEqual([c2, r2], [c, r]); }
});
test('гекс «за целью»', () => { assert.deepEqual(U.Hex.beyond(0, 0, 1, 0), [2, 0]); assert.equal(U.Hex.dist(1, 0, ...U.Hex.beyond(0, 0, 1, 0)), 1); });

console.log('rng');
test('детерминизм и 32-битное состояние', () => { const a = new U.RNG(7), b = new U.RNG(7); for (let i = 0; i < 1000; i++) assert.equal(a.next(), b.next()); assert.ok(a.save() < 2 ** 32); });

console.log('damage');
test('формула урона: разница атаки/защиты и капы', () => {
  const rng = new U.RNG(1);
  const h1 = mkHero('orrin'), h2 = mkHero('crag_hack');
  h1.pri = { att: 0, def: 0, pow: 1, kno: 1 }; h2.pri = { att: 0, def: 0, pow: 1, kno: 1 };
  const b = Bt.create({ hero: h1, army: army([['pikeman', 10]]), player: 0 }, { hero: h2, army: army([['skeleton', 5]]), player: 1 }, { rng, terrain: 'grass' });
  const a = b.units[0], t = b.units[1];
  const d = Bt.calcDamage(b, a, t, {}); // pikeman 4 att vs skeleton 4 def → ×1
  assert.equal(d.min, 10); assert.equal(d.max, 30);
  h1.pri.att = 70; b.sides[0].att = 70; const d2 = Bt.calcDamage(b, a, t, {}); assert.equal(d2.max, 30 * 4); // кап +300 %
  h1.pri.att = 0; b.sides[0].att = 0; b.sides[1].def = 100; const d3 = Bt.calcDamage(b, a, t, {}); assert.equal(d3.min, Math.floor(10 * 0.3)); // кап −70 %
});
test('штраф стрелка в ближнем бою и удача', () => {
  const rng = new U.RNG(1);
  const b = Bt.create({ hero: null, army: army([['archer', 10]]), player: 0 }, { hero: null, army: army([['archer', 10]]), player: 1 }, { rng, terrain: 'grass' });
  const a = b.units[0], t = b.units[1];
  const melee = Bt.calcDamage(b, a, t, { ranged: false }), ranged = Bt.calcDamage(b, a, t, { ranged: true, dist: 5 });
  assert.equal(melee.max, Math.floor(ranged.max * 0.5)); // без героев att 6 vs def 3 → ×1.15
  const far = Bt.calcDamage(b, a, t, { ranged: true, dist: 12 }); assert.equal(far.max, Math.floor(ranged.max * 0.5));
  const luck = Bt.calcDamage(b, a, t, { ranged: true, dist: 5, luck: true }); assert.ok(luck.max > ranged.max * 1.8);
});
test('благословение и урон по HP-пулу', () => {
  const rng = new U.RNG(1);
  const b = Bt.create({ hero: null, army: army([['pikeman', 10]]), player: 0 }, { hero: null, army: army([['pikeman', 3]]), player: 1 }, { rng, terrain: 'grass' });
  const a = b.units[0], t = b.units[1];
  a.effects.bless = { v: 0, turns: 3 }; const d = Bt.calcDamage(b, a, t, {}); assert.equal(d.min, d.max);
  t.hp = 4; const total = Bt.totalHp(t); assert.equal(total, 24);
});

console.log('pathfind');
test('диагональ дороже, терминальные клетки, аннотация', () => {
  const res = PF.dijkstra({ w: 10, h: 6, start: [0, 0], cost: (x, y) => (x === 5 && y < 5) ? Infinity : 100, terminal: (x, y) => x === 2 && y === 0 });
  assert.ok(Math.abs(res.dist[1] - 100) < 1e-9); assert.ok(Math.abs(res.dist[11] - 141) < 1e-9);
  assert.ok(res.dist[2] < Infinity); const beyond = PF.pathTo(res, 3, 0); assert.ok(!beyond.some(([x, y]) => x === 2 && y === 0));
  const p = PF.pathTo(res, 9, 0); const an = PF.annotate(res, p, 500, 1500); assert.equal(an[0].turn, 0); assert.ok(an[an.length - 1].turn >= 1);
});

console.log('rules');
test('доход, прирост, уровни, мораль', () => {
  const town = { faction: 'castle', buildings: { hall_1: true }, avail: [0, 0, 0, 0, 0, 0, 0] };
  assert.equal(R.townIncome(town).gold, 500); town.buildings.hall_3 = true; assert.equal(R.townIncome(town).gold, 2000);
  assert.equal(R.growthOf(town, 1), 14); town.buildings.citadel = true; assert.equal(R.growthOf(town, 1), 21); town.buildings.castle = true; assert.equal(R.growthOf(town, 1), 28);
  assert.equal(HE.xpForLevel(2), 1000); assert.equal(HE.xpForLevel(12), 20600); assert.equal(HE.levelForXp(2999), 3); assert.ok(HE.xpForLevel(31) > HE.xpForLevel(30));
  const h = mkHero('orrin'); h.army = army([['pikeman', 5], ['skeleton', 5]]); assert.equal(R.heroMorale(h).value, R.skillVal(h, 'leadership') - 1);
  h.army = army([['pikeman', 5], ['angel', 1]]); assert.equal(R.heroMorale(h).value, 1 + 1 + R.skillVal(h, 'leadership'));
});
test('движение по самому медленному', () => { const h = mkHero('orrin'); h.skills = {}; h.army = army([['pikeman', 1]]); assert.equal(R.heroMaxMove(h), 1560); h.army = army([['angel', 1]]); assert.equal(R.heroMaxMove(h), 2000); h.skills.logistics = 3; assert.equal(R.heroMaxMove(h), 2600); });
test('aiValue монотонен по тирам', () => { for (const f of H3.Factions.LIST) { let prev = 0; for (let t = 1; t <= 7; t++) { const v = C.aiValue(H3.Factions.creaturesOf(f.id, t)[0]); assert.ok(v > prev, f.id + ' tier ' + t); prev = v; } } });
test('стройка: требования и одна в день', () => {
  const st = S.newGame({ size: 'S', seed: 11, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const town = st.towns[st.players[0].towns[0]];
  assert.ok(!R.canBuild(st, town, 'hall_3').ok); assert.ok(R.canBuild(st, town, 'hall_2').ok);
  assert.ok(R.build(st, town, 'hall_2').ok); assert.ok(!R.canBuild(st, town, 'market').ok);
});

console.log('mapgen');
test('все размеры × все числа противников: связность, объекты, время', () => {
  const t0 = Date.now(); let n = 0;
  for (const size of ['S', 'M', 'L']) for (let opp = 1; opp <= S.SIZES[size].maxPlayers - 1; opp++) for (let seed = 1; seed <= 5; seed++) {
    let st;
    try { st = S.newGame({ size, seed, opponents: opp, difficulty: 'normal', faction: 'rampart' }); }
    catch (e) { throw new Error('карта не создалась: ' + size + ', противников ' + opp + ', сид ' + seed + ' — ' + e.message); }
    const map = st.levels[0]; n++;
    assert.equal(st.players.length, opp + 1, 'число игроков ' + size + opp);
    const t = st.towns[st.players[0].towns[0]];
    const seen = PF.reachable(map.w, map.h, t.x, t.y + 1, (x, y) => { const i = y * map.w + x; return map.objAt[i] >= 0 || !map.block[i]; });
    const tag = size + ' opp' + opp + ' seed' + seed;
    for (const p of st.players) { const tw = st.towns[p.towns[0]]; assert.ok(seen[(tw.y + 1) * map.w + tw.x], 'город недостижим ' + tag); }
    // каждая зона должна быть достижима хотя бы одним объектом, иначе часть карты отрезана
    const zonesWithObj = new Set(), zonesReached = new Set();
    for (const id in st.objects) { const o = st.objects[id]; if (o.z) continue; zonesWithObj.add(map.zone[o.y * map.w + o.x]); if (seen[o.y * map.w + o.x]) zonesReached.add(map.zone[o.y * map.w + o.x]); }
    assert.ok(zonesReached.size >= zonesWithObj.size - 1, 'отрезано зон: ' + (zonesWithObj.size - zonesReached.size) + ' в ' + tag);
    const mines = Object.values(st.objects).filter(o => o.type === 'mine' && !o.z);
    assert.ok(mines.filter(o => o.res === 'wood').length >= st.players.length, 'лесопилки ' + tag);
    const zone0 = map.zone[t.y * map.w + t.x];
    const near = mines.filter(o => map.zone[o.y * map.w + o.x] === zone0 && ['wood', 'ore'].includes(o.res));
    assert.ok(near.length >= 2, 'стартовые шахты ' + tag);
    // первый бой выигрышный: страж стартовой шахты слабее стартовой армии
    const hero = st.heroes[st.players[0].heroes[0]]; const hp = R.armyPower(hero.army, hero);
    for (const m of near) for (const g of S.monstersNear(st, m.x, m.y)) assert.ok(H3.Adventure.monsterPower(g) <= hp * 0.45, 'слишком сильный первый страж ' + tag);
  }
  const ms = (Date.now() - t0) / n; assert.ok(ms < 300, 'среднее время генерации ' + Math.round(ms) + ' мс');
});

test('подземелье: два слоя, врата, связность пещер', () => {
  const st = S.newGame({ size: 'M', seed: 7, opponents: 1, difficulty: 'normal', faction: 'castle' });
  assert.equal(st.levels.length, 2);
  const T = R.TERRAINS, under = st.levels[1];
  let rock = 0, open = 0;
  for (let i = 0; i < under.terrain.length; i++) { if (T[under.terrain[i]] === 'rock') rock++; if (!under.block[i]) open++; }
  assert.ok(rock > under.terrain.length * 0.3, 'подземелье должно быть в основном скалой, а не полем');
  assert.ok(open > under.terrain.length * 0.2, 'но пещеры должны быть просторными: открыто ' + open);
  assert.ok(!Object.values(st.towns).some(t => t.z === 1), 'городов под землёй нет');
  // врата парные и стоят на обоих слоях
  const gates = Object.values(st.objects).filter(o => o.type === 'subter_gate');
  assert.ok(gates.length >= 4 && gates.length % 2 === 0, 'врат должно быть чётное число: ' + gates.length);
  for (const g of gates) {
    const other = H3.Adventure.gatePartner(st, g);
    assert.ok(other, 'у врат нет пары');
    assert.notEqual(other.z, g.z, 'пара должна быть на другом слое');
    assert.equal(other.x + ',' + other.y, g.x + ',' + g.y, 'пара стоит на той же координате');
  }
  // спуск и подъём
  const hero = st.heroes[st.players[0].heroes[0]];
  const gate = gates.find(g => !g.z);
  hero.x = gate.x; hero.y = gate.y; hero.move = 3000;
  H3.Adventure.visit(st, hero, gate);
  assert.equal(hero.z, 1, 'герой спустился');
  assert.equal(hero.x + ',' + hero.y, gate.x + ',' + gate.y, 'вышел на парных вратах');
  assert.ok(Array.from(st.players[0].vis[1]).some(v => v > 0), 'подземелье начало открываться');
  // из точки выхода достижима бо́льшая часть пещер
  const pf = S.pathfield(st, hero);
  const reach = pf.dist.filter(d => d < Infinity && d > 0).length;
  assert.ok(reach > open * 0.5, 'из врат достижимо лишь ' + reach + ' из ' + open + ' открытых клеток');
  // объекты подземелья есть и не путаются со слоем 0
  const underObjs = Object.values(st.objects).filter(o => o.z === 1 && o.type !== 'subter_gate');
  assert.ok(underObjs.length >= 20, 'в подземелье должно быть чем поживиться: ' + underObjs.length);
  for (const o of underObjs) assert.equal(st.levels[1].objAt[o.y * under.w + o.x], o.id, 'объект не на своём слое');
  // подъём обратно
  const back = H3.Adventure.gatePartner(st, gate);
  H3.Adventure.visit(st, hero, back);
  assert.equal(hero.z, 0, 'герой вернулся на поверхность');
});

test('море: связный водоём, лодка, плавание и высадка', () => {
  let st = null;
  for (let seed = 1; seed <= 8 && !st; seed++) {
    const g = S.newGame({ size: 'M', seed, opponents: 1, difficulty: 'normal', faction: 'castle' });
    if (Object.values(g.objects).some(o => o.type === 'boat')) st = g;
  }
  assert.ok(st, 'хотя бы на одной карте из восьми должно быть море с лодкой');
  const m = st.levels[0], W = m.w, T = R.TERRAINS;
  const boat = Object.values(st.objects).find(o => o.type === 'boat');
  // лодка стоит в большом водоёме, а не в луже, и вся морская добыча из неё достижима
  const sea = PF.reachable(m.w, m.h, boat.x, boat.y, (x, y) => T[m.terrain[y * W + x]] === 'water');
  const seaSize = Array.from(sea).filter(v => v).length;
  assert.ok(seaSize >= 60, 'море должно быть просторным, а не лужей: ' + seaSize);
  const loot = Object.values(st.objects).filter(o => ['flotsam', 'sea_chest'].includes(o.type));
  assert.ok(loot.length >= 3, 'в море должна быть добыча');
  for (const o of loot) assert.ok(sea[o.y * W + o.x], 'добыча вне доступного моря');
  assert.ok(Object.values(st.objects).some(o => o.type === 'shipyard'), 'на берегу должна быть верфь');
  // без лодки в воду не войти
  const hero = st.heroes[st.players[0].heroes[0]];
  let shore = null;
  for (let dy = -1; dy <= 1 && !shore; dy++) for (let dx = -1; dx <= 1; dx++) {
    const x = boat.x + dx, y = boat.y + dy;
    if ((dx || dy) && S.terrainAt(st, x, y, 0) !== 'water' && !S.isBlocked(st, x, y, 0)) { shore = [x, y]; break; }
  }
  assert.ok(shore, 'у лодки должен быть берег');
  hero.x = shore[0]; hero.y = shore[1]; hero.move = 5000;
  const deep = Object.values(st.objects).find(o => o.type === 'flotsam' || o.type === 'sea_chest');
  assert.equal(S.moveCost(st, hero, deep.x, deep.y), Infinity, 'пешком в море не войти');
  // садимся в лодку
  H3.Adventure.visit(st, hero, boat);
  assert.ok(hero.boat, 'герой в лодке');
  assert.equal(hero.x + ',' + hero.y, boat.x + ',' + boat.y, 'герой встал на место лодки');
  assert.ok(!st.objects[boat.id], 'лодка больше не отдельный объект');
  assert.ok(S.moveCost(st, hero, deep.x, deep.y) < Infinity, 'под парусом море проходимо');
  // плывём и высаживаемся
  const pf = S.pathfield(st, hero);
  let land = null, ld = Infinity;
  for (let i = 0; i < pf.dist.length; i++) {
    const d = pf.dist[i], x = i % W, y = (i / W) | 0;
    if (d < Infinity && d > 0 && d < ld && T[m.terrain[i]] !== 'water' && !m.block[i]) { ld = d; land = [x, y]; }
  }
  assert.ok(land, 'с моря должен быть виден берег');
  const r = H3.Adventure.moveHero(st, hero, PF.pathTo(pf, land[0], land[1]));
  assert.equal(r.stop && r.stop.kind, 'landed', 'ход должен закончиться высадкой');
  assert.ok(!hero.boat, 'герой сошёл с лодки');
  assert.notEqual(S.terrainAt(st, hero.x, hero.y, 0), 'water', 'герой на суше');
  const left = Object.values(st.objects).find(o => o.type === 'boat' && Math.abs(o.x - hero.x) <= 1 && Math.abs(o.y - hero.y) <= 1);
  assert.ok(left, 'лодка осталась у берега');
});

console.log('battle');
test('детерминированный автобой, конец, осада ломает стены', () => {
  const run = seed => { const rng = new U.RNG(seed); const h1 = mkHero('orrin', 3), h2 = mkHero('crag_hack', 3);
    const b = Bt.create({ hero: h1, army: army([['pikeman', 20], ['archer', 10], ['griffin', 5]]), player: 0 }, { hero: h2, army: army([['goblin', 30], ['wolf_rider', 8], ['orc', 8]]), player: 1 }, { rng, terrain: 'grass' });
    return H3.BattleAI.auto(b, true); };
  const a = run(3), b2 = run(3); assert.equal(JSON.stringify(a.sides.map(s => s.losses)), JSON.stringify(b2.sides.map(s => s.losses))); assert.ok(a.winner === 0 || a.winner === 1); assert.ok(a.rounds < 100);
  const rng = new U.RNG(4); const h = mkHero('crag_hack', 5);
  const town = { faction: 'castle', buildings: { fort: true, citadel: true, castle: true } };
  const sb = Bt.create({ hero: h, army: army([['goblin', 60], ['ogre', 10], ['cyclops', 4]]), player: 1 }, { hero: null, army: army([['pikeman', 20], ['archer', 10]]), player: 0, canRetreat: false }, { rng, terrain: 'grass', siege: town });
  assert.ok(sb.siege && sb.siege.walls.length === 4 && sb.siege.moat && sb.siege.towers === 3);
  const r = H3.BattleAI.auto(sb, true); assert.ok(r.winner === 0 || r.winner === 1); assert.ok(sb.siege.walls.some(w => w < 2) || sb.siege.gate < 2 || r.rounds <= 2);
});
test('крупные существа: два гекса, расстановка, атака, инварианты', () => {
  const big = army([['cavalier', 8], ['archer', 20], ['green_dragon', 3], ['pikeman', 30], ['unicorn', 4]]);
  const big2 = army([['hydra', 4], ['medusa', 10], ['wolf_rider', 20], ['behemoth', 3], ['black_knight', 5]]);
  // расстановка: крупный стоит двумя гексами внутри поля и никого не задевает
  const b0 = Bt.create({ army: big, player: 0 }, { army: big2, player: 1 }, { rng: new U.RNG(1), terrain: 'grass' });
  for (const u of b0.units) {
    const hx = Bt.hexesOf(u);
    assert.equal(hx.length, C.hasAb(C.get(u.cid), 'large') ? 2 : 1, u.cid);
    for (const [x, y] of hx) assert.ok(x >= 0 && x < Bt.W && y >= 0 && y < Bt.H, u.cid + ' вне поля: ' + x + ',' + y);
  }
  // крупный не встанет туда, где занят второй гекс
  const drag = b0.units.find(u => u.cid === 'green_dragon');
  const ally = b0.units.find(u => u.side === 0 && u.id !== drag.id);
  assert.ok(!Bt.canStand(b0, drag, ally.x, ally.y), 'встал на союзника');
  // позиции атаки учитывают оба гекса цели
  const foe = b0.units.find(u => u.side === 1);
  const reach = Bt.reachable(b0, drag);
  for (const a of reach.attacks) {
    const t = b0.units[a.target];
    let touch = false;
    for (const [ax, ay] of Bt.hexesOf(drag, a.from[0], a.from[1])) for (const n of U.Hex.neighbors(ax, ay)) if (Bt.occupies(t, n[0], n[1])) touch = true;
    assert.ok(touch, 'позиция атаки не касается цели');
  }
  assert.ok(reach.attacks.length === 0 || foe, 'цели есть');
  // 30 боёв на обычном поле и в осаде: никаких наложений и выходов за поле
  const town = { faction: 'castle', buildings: { fort: true, citadel: true, castle: true } };
  for (let i = 0; i < 30; i++) {
    const b = Bt.create({ army: big, player: 0 }, { army: big2, player: 1 }, { rng: new U.RNG(i * 977 + 3), terrain: 'grass', siege: i % 2 ? town : null });
    let guard = 0;
    while (!b.over && guard++ < 400) {
      Bt.act(b, H3.BattleAI.choose(b, true) || { type: 'defend' });
      const occ = new Map();
      for (const u of b.units) { if (!u.alive) continue;
        for (const [x, y] of Bt.hexesOf(u)) {
          assert.ok(x >= 0 && x < Bt.W && y >= 0 && y < Bt.H, 'вне поля: ' + u.cid);
          assert.ok(!Bt.isObstacle(b, x, y), 'в препятствии: ' + u.cid);
          const k = x + ',' + y;
          assert.ok(!occ.has(k), 'наложение ' + u.cid + ' и ' + occ.get(k) + ' в ' + k);
          occ.set(k, u.cid);
        }
      }
    }
    assert.ok(b.over, 'бой ' + i + ' не завершился');
  }
});
test('фаза тактики: полоса по разнице навыка, расстановка, старт боя', () => {
  const h1 = mkHero('orrin', 5); h1.skills = { tactics: 3 };   // экспертная — 7
  const h2 = mkHero('crag_hack', 5); h2.skills = { tactics: 1 };  // базовая — 3
  const b = Bt.create({ hero: h1, army: army([['pikeman', 20], ['archer', 10], ['cavalier', 5]]), player: 0 },
                      { hero: h2, army: army([['goblin', 30], ['orc', 10]]), player: 1 }, { rng: new U.RNG(3), terrain: 'grass' });
  assert.equal(b.phase, 'tactics');
  assert.equal(b.tactics.side, 0);
  assert.equal(b.tactics.dist, 4, 'полоса = разница навыков (7 − 3)');
  // вне полосы переставить нельзя
  const pike = b.units.find(u => u.cid === 'pikeman');
  assert.equal(Bt.act(b, { type: 'tacticsMove', unit: pike.id, x: 9, y: 3 })[0].t, 'error');
  // чужой отряд переставить нельзя
  const foe = b.units.find(u => u.side === 1);
  assert.equal(Bt.act(b, { type: 'tacticsMove', unit: foe.id, x: 1, y: 3 })[0].t, 'error');
  // расстановка ИИ: все остаются в полосе, стрелки у своего края
  let guard = 0;
  while (b.phase === 'tactics' && guard++ < 50) Bt.act(b, H3.BattleAI.chooseTactics(b));
  assert.equal(b.phase, 'battle');
  assert.equal(b.round, 1);
  for (const u of b.units) if (u.side === 0) for (const [x] of Bt.hexesOf(u)) assert.ok(x < 4, u.cid + ' вышел за полосу: ' + x);
  assert.ok(b.units.find(u => u.cid === 'archer').x === 0, 'стрелок остался у своего края');
  assert.ok(b.units.find(u => u.cid === 'cavalier').x === 3, 'ближний бой вышел вперёд');
  // при равном навыке фазы нет
  const h3 = mkHero('orrin', 5); h3.skills = { tactics: 2 };
  const h4 = mkHero('crag_hack', 5); h4.skills = { tactics: 2 };
  const b2 = Bt.create({ hero: h3, army: army([['pikeman', 5]]), player: 0 }, { hero: h4, army: army([['goblin', 5]]), player: 1 }, { rng: new U.RNG(4), terrain: 'grass' });
  assert.equal(b2.phase, 'battle');
});
test('боевые машины: баллиста, палатка, повозка, катапульта', () => {
  const h1 = mkHero('orrin', 8); h1.skills = { artillery: 2, first_aid: 3 };
  h1.machines = { ballista: true, first_aid_tent: true, ammo_cart: true };
  const h2 = mkHero('crag_hack', 8); h2.skills = {};
  const b = Bt.create({ hero: h1, army: army([['pikeman', 20], ['archer', 10]]), player: 0 },
                      { hero: h2, army: army([['goblin', 30], ['orc', 10]]), player: 1 }, { rng: new U.RNG(3), terrain: 'grass' });
  const mach = b.units.filter(u => C.get(u.cid).machine);
  assert.equal(mach.length, 3, 'три машины на поле');
  for (const m of mach) assert.equal(m.x, 0, 'машины у своего края');
  // машины не двигаются
  const bal = b.units.find(u => u.cid === 'ballista');
  assert.equal(Bt.reachable(b, bal).hexes.size, 1, 'баллиста никуда не идёт');
  // баллиста стреляет и в упор
  const foe = b.units.find(u => u.side === 1);
  foe.x = 1; foe.y = bal.y;
  assert.ok(Bt.isShooterNow(b, bal), 'баллиста стреляет при соседнем враге');
  // повозка бережёт боезапас
  const arch = b.units.find(u => u.cid === 'archer');
  const shots0 = arch.shots;
  b.cur = arch.id; Bt.act(b, { type: 'shoot', target: foe.id });
  assert.equal(arch.shots, shots0, 'повозка: выстрелы не тратятся');
  // палатка лечит
  const pike = b.units.find(u => u.cid === 'pikeman');
  pike.hp = 1;
  const tent = b.units.find(u => u.cid === 'first_aid_tent');
  b.cur = tent.id; Bt.act(b, { type: 'heal', target: pike.id });
  assert.equal(pike.hp, pike.maxHp, 'экспертная первая помощь долечила верхнего');
  // катапульта: экспертная «Баллистика» — два выстрела и гарантированное разрушение
  const wallsDown = (ball, rounds) => {
    const h = mkHero('crag_hack', 8); h.skills = ball ? { ballistics: ball } : {};
    const town = { faction: 'castle', buildings: { fort: true, citadel: true, castle: true } };
    // стек толстый нарочно: башни осады иначе выбьют нападающего раньше, чем упадут стены
    const sb = Bt.create({ hero: h, army: army([['pikeman', 400]]), player: 0 },
                         { hero: null, army: army([['skeleton', 400]]), player: 1, canRetreat: false }, { rng: new U.RNG(7), terrain: 'grass', siege: town });
    while (sb.round <= rounds && !sb.over) Bt.act(sb, { type: 'defend' });
    return sb.siege.walls.filter(w => w === 0).length + (sb.siege.gate === 0 ? 1 : 0);
  };
  assert.equal(wallsDown(3, 3), 5, 'экспертная «Баллистика»: за 3 раунда рушатся все 4 участка и ворота');
  assert.ok(wallsDown(0, 3) < 5, 'без навыка за 3 раунда всё разрушить не выходит')
});
test('способности второго эшелона: воскрешение, демоны, чары, перехват маны', () => {
  const h1 = mkHero('orrin', 10), h2 = mkHero('crag_hack', 10);
  const b = Bt.create({ hero: h1, army: army([['archangel', 3], ['pikeman', 30], ['master_genie', 8]]), player: 0 },
                      { hero: h2, army: army([['pit_lord', 10], ['ogre_mage', 10], ['orc', 30]]), player: 1 }, { rng: new U.RNG(9), terrain: 'grass' });
  const ang = b.units.find(u => u.cid === 'archangel');
  const pike = b.units.find(u => u.cid === 'pikeman');
  // архангел воскрешает: 100 HP × число архангелов
  pike.count = 20; pike.hp = pike.maxHp;
  b.cur = ang.id;
  assert.ok(Bt.abilityTargets(b, ang).some(t => t.id === pike.id), 'раненый стек — цель воскрешения');
  Bt.act(b, { type: 'ability', target: pike.id });
  assert.equal(pike.count, Math.min(pike.initial, 20 + Math.floor(300 / pike.maxHp)), 'воскрешено 300 HP, но не больше исходного числа');
  assert.ok(ang.usedAbility && !Bt.abilityOf(ang), 'способность раз за бой');
  // владыка бездны поднимает демонов из павшего стека
  const pit = b.units.find(u => u.cid === 'pit_lord');
  const orc = b.units.find(u => u.cid === 'orc');
  orc.alive = false; orc.count = 0;
  b.cur = pit.id;
  Bt.act(b, { type: 'ability', target: orc.id });
  assert.equal(orc.cid, 'demon', 'павший стек стал демонами');
  assert.ok(orc.alive && orc.count > 0 && orc.count <= pit.count, 'демонов не больше, чем владык бездны');
  assert.equal(orc.tempRaised, orc.count, 'после боя поднятые демоны не остаются');
  // джинн накладывает чары на своего
  const genie = b.units.find(u => u.cid === 'master_genie');
  b.cur = genie.id;
  const before = Object.keys(pike.effects).length;
  Bt.act(b, { type: 'ability', target: pike.id });
  assert.ok(Object.keys(pike.effects).length > before, 'джинн наложил чары');
  // фамильяр перехватывает ману вражеского героя
  const h3 = mkHero('orrin', 10); h3.spells = ['magic_arrow']; h3.hasBook = true;
  const h4 = mkHero('crag_hack', 10);
  const b2 = Bt.create({ hero: h3, army: army([['pikeman', 10]]), player: 0 },
                       { hero: h4, army: army([['familiar', 20]]), player: 1 }, { rng: new U.RNG(2), terrain: 'grass' });
  const mana0 = b2.sides[1].mana;
  b2.cur = b2.units.find(u => u.side === 0).id;   // колдует герой той стороны, чей стек ходит
  Bt.act(b2, { type: 'cast', spell: 'magic_arrow', target: b2.units.find(u => u.side === 1).id });
  assert.ok(b2.sides[1].mana > mana0, 'фамильяры перехватили ману: было ' + mana0 + ', стало ' + b2.sides[1].mana);
});
test('магия 5 уровня: гильдия, мудрость, армагеддон, берсерк', () => {
  const SP = H3.Spells;
  assert.equal(SP.byLevel(5).length, 4, 'четыре заклинания 5 уровня');
  // гильдия 5 есть не у всех фракций
  const withGuild5 = H3.Factions.LIST.filter(f => f.guildMax >= 5).map(f => f.id);
  assert.deepEqual(withGuild5, ['rampart', 'tower', 'necropolis', 'dungeon']);
  assert.ok(H3.Buildings.forFaction('tower').some(b => b.id === 'guild_5'), 'у Башни есть Гильдия V');
  assert.ok(!H3.Buildings.forFaction('castle').some(b => b.id === 'guild_5'), 'у Замка гильдии V нет');
  // 5 уровень требует экспертной Мудрости
  const h = mkHero('orrin', 20);
  h.skills = { wisdom: 2 };
  assert.ok(!R.canLearn(h, SP.get('armageddon')), 'продвинутой Мудрости мало');
  h.skills = { wisdom: 3 };
  assert.ok(R.canLearn(h, SP.get('armageddon')), 'экспертной Мудрости хватает');
  // армагеддон бьёт всех, включая своих
  h.pri.pow = 10; h.mana = 200; h.hasBook = true; h.spells = ['armageddon', 'berserk'];
  // стеки большие: армагеддон при Силе 10 бьёт на 530 и иначе выкосил бы всё поле
  const b = Bt.create({ hero: h, army: army([['pikeman', 300]]), player: 0 },
                      { hero: mkHero('crag_hack', 20), army: army([['goblin', 400], ['orc', 200]]), player: 1 }, { rng: new U.RNG(4), terrain: 'grass' });
  const mine = b.units.find(u => u.side === 0), hp0 = Bt.totalHp(mine);
  b.cur = mine.id;
  Bt.act(b, { type: 'cast', spell: 'armageddon' });
  assert.ok(Bt.totalHp(mine) < hp0, 'армагеддон задел и своих');
  // берсерк: цель кидается на своих
  b.casted = [false, false];
  const foe = b.units.find(u => u.side === 1 && u.alive);
  b.cur = mine.id;
  Bt.act(b, { type: 'cast', spell: 'berserk', target: foe.id });
  assert.ok(Bt.berserk(foe), 'эффект наложен');
  assert.ok(Bt.autoMachine(b, foe), 'под берсерком стек игроку не подчиняется');
  b.cur = foe.id;
  const act = H3.BattleAI.choose(b, true);
  if (act.type === 'attack') assert.equal(b.units[act.target].side, 1, 'берсерк бьёт своего, если тот ближе');
});
test('отступление и лимит раундов', () => {
  const rng = new U.RNG(5); const h1 = mkHero('orrin');
  const b = Bt.create({ hero: h1, army: army([['pikeman', 5]]), player: 0 }, { hero: null, army: army([['skeleton', 5]]), player: 1, canRetreat: false }, { rng, terrain: 'dirt' });
  const ev = Bt.act(b, { type: 'retreat' }); assert.ok(b.over && b.winner === 1 && b.reason === 'retreat');
});
test('заклинание: урон, мана, раз в раунд', () => {
  const rng = new U.RNG(6); const h1 = mkHero('solmyr', 5); h1.mana = 40; h1.hasBook = true;
  const b = Bt.create({ hero: h1, army: army([['gremlin', 20]]), player: 0 }, { hero: null, army: army([['skeleton', 30]]), player: 1 }, { rng, terrain: 'snow' });
  const t = b.units.find(u => u.side === 1);
  const before = Bt.totalHp(t);
  const ev = Bt.act(b, { type: 'cast', spell: 'lightning_bolt', target: t.id });
  assert.ok(ev.some(e => e.t === 'spell')); assert.ok(Bt.totalHp(t) < before || !t.alive); assert.ok(b.sides[0].mana < 40);
  const ev2 = Bt.act(b, { type: 'cast', spell: 'lightning_bolt', target: t.id }); assert.ok(ev2.some(e => e.t === 'error'));
});

test('умный ИИ боя обыгрывает жадный', () => {
  const F = H3.Factions, AI = H3.BattleAI;
  const weekArmy = (fid, w) => { const a = [null, null, null, null, null, null, null]; const tiers = Math.min(7, 2 + w), bud = 4000 * w;
    const cs = []; for (let t = 1; t <= tiers; t++) cs.push(F.creaturesOf(fid, t)[0]);
    const tot = cs.reduce((x, c) => x + c.growth * c.cost.gold, 0);
    cs.forEach((c, i) => { const sh = bud * (c.growth * c.cost.gold) / tot; a[i] = { cid: c.id, n: Math.max(1, Math.round(sh / c.cost.gold)) }; });
    return a; };
  const h = (fid, seed) => { const st = { nextId: 1, heroes: {}, _rng: { misc: new U.RNG(seed) } };
    const x = R.makeHero(st, H3.Heroes.heroesOfFaction(fid)[0].id, 0, 0, 0, true); x.level = 5; x.pri = { att: 3, def: 3, pow: 3, kno: 3 }; x.hasBook = true; return x; };
  const ids = F.LIST.map(f => f.id);
  let win = 0, total = 0;
  for (let i = 0; i < 40; i++) {
    const fa = ids[i % ids.length], fb = ids[(i * 3 + 1) % ids.length], smart = i % 2;
    const b = Bt.create({ hero: h(fa, i + 1), army: weekArmy(fa, 4), player: 0 }, { hero: h(fb, i + 2), army: weekArmy(fb, 4), player: 1 }, { rng: new U.RNG(i * 7919 + 5), terrain: 'grass' });
    let g = 0;
    while (!b.over && g++ < 4000) { const cur = Bt.current(b); if (!cur) break; Bt.act(b, AI.choose(b, cur.side === smart) || { type: 'defend' }); }
    if (!b.over) Bt.finish(b, 0, 'timeout');
    total++; if (b.result.winner === smart) win++;
  }
  assert.ok(win / total >= 0.65, 'умный ИИ выиграл лишь ' + win + ' из ' + total);
});

test('ИИ карты: прогон боя отсеивает безнадёжные цели', () => {
  const st = S.newGame({ size: 'S', seed: 12, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const hero = st.heroes[st.players[0].heroes[0]];
  hero.army = army([['pikeman', 5]]);           // заведомо слабая армия
  hero.move = 100000;
  // ставим рядом с героем стража, которого не победить, и убираем остальные соблазны
  for (const id of Object.keys(st.objects)) { const o = st.objects[id]; if (o.type !== 'town' && (o.z || 0) === 0) H3.Adventure.removeObject(st, o); }
  let spot = null;
  for (let r = 2; r < 8 && !spot; r++) for (let dy = -r; dy <= r && !spot; dy++) for (let dx = -r; dx <= r; dx++) {
    const x = hero.x + dx, y = hero.y + dy;
    if (!S.inMap(st, x, y, 0) || S.isBlocked(st, x, y, 0) || S.objAt(st, x, y, 0)) continue;
    if (Math.abs(dx) + Math.abs(dy) < 3) continue;
    spot = [x, y]; break;
  }
  assert.ok(spot, 'нашлось место для стража');
  const m = S.lvl(st, 0), i = spot[1] * m.w + spot[0];
  const guard = { id: st.nextId++, type: 'monster', x: spot[0], y: spot[1], z: 0, cid: 'black_dragon', n: 20, mood: 10, character: 'aggressive', value: 999999 };
  st.objects[guard.id] = guard; m.objAt[i] = guard.id; m.block[i] = 1;
  S.computeVisibility(st, 0);
  hero._role = 'main';
  st._ai = { 0: { threat: null } };
  const pf = S.pathfield(st, hero);
  // при выключенном прогоне ИИ судит по отношению сил и в такую драку не полезет тоже,
  // поэтому проверяем главное: с прогоном цель точно отвергнута
  H3.AI.FLAGS.sim = true;
  const t = H3.AI.chooseTarget(st, hero, pf, new Set(), true);
  assert.ok(!t || t.key !== 'm' + guard.id, 'ИИ не должен идти на 20 чёрных драконов с пятью копейщиками');
  // сам прогон должен давать разные вердикты для безнадёжного и посильного боя
  const hopeless = H3.AI.simFight(st, hero, army([['black_dragon', 20]]), null, 'grass', 1);
  assert.equal(hopeless.p, 0, 'бой с 20 чёрными драконами обязан проигрываться');
  const easy = H3.AI.simFight(st, hero, army([['goblin', 3]]), null, 'grass', 1);
  assert.equal(easy.p, 1, 'трёх гоблинов пять копейщиков обязаны бить');
  assert.ok(easy.kept > 0.7, 'и почти без потерь, а осталось ' + Math.round(easy.kept * 100) + ' %');
});

test('цели сценария: захват города, накопление, срок, поражение', () => {
  const mk = goals => S.newGame({ size: 'S', seed: 5, opponents: 1, difficulty: 'normal', faction: 'castle', goals });
  const A = H3.Adventure;
  // 1. захватить город противника
  let st = mk({ win: [{ type: 'capture_town', townId: 0 }], lose: [{ type: 'lose_all' }] });
  const foeTown = S.townsOf(st, 1)[0];
  st.goals.win[0].townId = foeTown.id;
  A.checkGoals(st); assert.equal(st.winner, null, 'пока город чужой — не победа');
  A.captureTown(st, foeTown, 0, S.heroesOf(st, 0)[0]);
  A.checkGoals(st); assert.equal(st.winner, 0, 'город взят — победа');
  assert.ok(/Захватить город/.test(st.endReason), 'причина названа: ' + st.endReason);
  // 2. накопить золото
  st = mk({ win: [{ type: 'gather', res: 'gold', amount: 50000 }], lose: [{ type: 'lose_all' }] });
  A.checkGoals(st); assert.equal(st.winner, null);
  st.players[0].res.gold = 50000;
  A.checkGoals(st); assert.equal(st.winner, 0, 'золото накоплено');
  // 3. продержаться N дней
  st = mk({ win: [{ type: 'survive', days: 10 }], lose: [{ type: 'timeout', days: 20 }] });
  st.day = 10; A.checkGoals(st); assert.equal(st.winner, null, 'на десятый день ещё рано');
  st.day = 11; A.checkGoals(st); assert.equal(st.winner, 0, 'продержались');
  // 4. срок вышел — поражение, и оно важнее победы
  st = mk({ win: [{ type: 'survive', days: 30 }], lose: [{ type: 'timeout', days: 20 }] });
  st.day = 21; A.checkGoals(st);
  assert.notEqual(st.winner, 0, 'просрочка — поражение');
  assert.ok(/уложиться/.test(st.endReason), 'причина: ' + st.endReason);
  // 5. потеря конкретного героя
  st = mk({ win: [{ type: 'kill_all' }], lose: [{ type: 'lose_hero', heroId: 0 }] });
  const hero = S.heroesOf(st, 0)[0];
  st.goals.lose[0].heroId = hero.id;
  A.checkGoals(st); assert.equal(st.winner, null);
  A.killHero(st, hero);
  A.checkGoals(st); assert.notEqual(st.winner, 0, 'герой погиб — сценарий проигран');
  // 6. список целей для интерфейса
  const list = A.goalList(st, 0);
  assert.equal(list.length, 2);
  assert.ok(list[1].lose && list[1].done, 'провалившееся условие помечено');
  // 7. по умолчанию — старое поведение «убить всех»
  st = S.newGame({ size: 'S', seed: 6, opponents: 1, difficulty: 'normal', faction: 'castle' });
  assert.equal(st.goals, null, 'без настроек целей нет');
  A.checkGoals(st); assert.equal(st.winner, null);
});

console.log('quests');
test('квесты и ключи: ключник и застава, страж-квестор, провидец, Ящик Пандоры, зона контроля', () => {
  const Q = H3.Quest, A = H3.Adventure, O = H3.Objects;
  const st = S.newGame({ size: 'S', seed: 7, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const h = S.heroesOf(st, 0)[0], p = st.players[0], m = st.levels[0];
  const put = (type, x, y, extra) => {
    // клетку и её окрестность расчищаем: объект должен быть достижим
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const i = (y + dy) * m.w + x + dx; const old = m.objAt[i] >= 0 ? st.objects[m.objAt[i]] : null; if (old && old.type !== 'town') A.removeObject(st, old); m.obs[i] = 0; m.terrain[i] = R.TERRAIN_INDEX.grass; m.block[i] = 0; }
    const o = Object.assign({ id: st.nextId++, type, x, y, z: 0, visited: {} }, extra); st.objects[o.id] = o; m.objAt[y * m.w + x] = o.id; m.block[y * m.w + x] = 1; return o;
  };
  // застава без ключа не открывается, с ключом — исчезает
  const bg = put('border_guard', h.x + 3, h.y, { color: 'blue' });
  let v = A.visit(st, h, bg); assert.ok(st.objects[bg.id] && /синий ключ/.test(v.text));
  // без ключа стража подсказывает направление, а шатёр появляется на карте
  const km0 = put('keymaster', h.x - 3, h.y, { color: 'blue' });
  st.players[0].vis[0].fill(0);
  v = A.visit(st, h, bg); assert.ok(/кивает на запад/.test(v.text), 'подсказка направления: ' + v.text);
  assert.ok(st.players[0].vis[0][km0.y * m.w + km0.x] >= 1, 'шатёр открыт на карте');
  A.removeObject(st, km0); S.computeVisibility(st, 0);
  const km = put('keymaster', h.x - 3, h.y, { color: 'blue' });
  A.visit(st, h, km); assert.ok(p.keys.blue, 'ключ получен');
  v = A.visit(st, h, bg); assert.ok(!st.objects[bg.id], 'застава открыта');
  // зона контроля: клетки вокруг заставы терминальны, но к самой заставе путь есть
  const bg2 = put('border_guard', h.x + 5, h.y - 4, { color: 'red' });
  assert.ok(S.isTerminal(st, h, bg2.x - 1, bg2.y) && S.isTerminal(st, h, bg2.x, bg2.y + 1), 'зона контроля');
  const pf = S.pathfield(st, h);
  assert.ok(pf.dist[bg2.y * m.w + bg2.x] < Infinity, 'к заставе можно подойти');
  const path = PF.pathTo(pf, bg2.x, bg2.y);
  const r = A.moveHero(st, h, path);
  assert.ok(r.stop && r.stop.kind === 'object' && r.stop.obj === bg2, 'герой останавливается у заставы: ' + JSON.stringify(r.stop && r.stop.kind));
  assert.ok(Math.max(Math.abs(h.x - bg2.x), Math.abs(h.y - bg2.y)) >= 2, 'и не входит в её зону');
  // страж-квестор по уровню: сначала не пускает, потом отступает
  const qg = put('quest_guard', h.x - 4, h.y + 3, { quest: { kind: 'level', level: 3 } });
  v = A.visit(st, h, qg); assert.ok(!v.choices, 'уровень 1 — не пускает');
  h.level = 3; v = A.visit(st, h, qg); assert.ok(v.choices, 'уровень 3 — предлагает пройти');
  A.resolve(st, h, qg, 'give'); assert.ok(!st.objects[qg.id], 'страж ушёл');
  // провидец: забирает ресурсы, даёт награду, второй раз не платит
  const sh = put('seer_hut', h.x + 2, h.y - 3, { quest: { kind: 'resources', res: 'wood', amount: 5 }, reward: { kind: 'gold', amount: 3000 } });
  const g0 = p.res.gold, w0 = p.res.wood;
  v = A.visit(st, h, sh); assert.ok(v.choices, 'условие выполнено');
  A.resolve(st, h, sh, 'give');
  assert.equal(p.res.gold - g0, 3000); assert.equal(w0 - p.res.wood, 5);
  v = A.visit(st, h, sh); assert.ok(!v.choices && /уже/.test(v.text), 'награда один раз');
  // квест-артефакт забирает артефакт; награда-существа встаёт в армию
  const sh2 = put('seer_hut', h.x + 2, h.y + 4, { quest: { kind: 'artifact', art: 'centaur_axe' }, reward: { kind: 'creatures', cid: 'griffin', n: 4 } });
  assert.ok(!Q.met(st, h, sh2.quest)); h.backpack.push('centaur_axe'); assert.ok(Q.met(st, h, sh2.quest));
  A.visit(st, h, sh2); A.resolve(st, h, sh2, 'give');
  assert.ok(!h.backpack.includes('centaur_axe') && h.army.some(s => s && s.cid === 'griffin' && s.n >= 4), 'обмен состоялся');
  // Ящик Пандоры: бой со стражами, награда, ящик исчезает
  const pb = put('pandora_box', h.x - 4, h.y - 3, Q.randomPandora(new U.RNG(3), 1, 1));
  assert.ok(pb.guards.length && pb.rewards.length);
  h.army[0] = { cid: 'archangel', n: 30 };
  const b = A.startBattle(st, h, { bank: pb }); H3.BattleAI.auto(b, true); const sum = A.endBattle(st);
  assert.ok(sum.attWon && sum.text.length && !st.objects[pb.id], 'ящик вскрыт: ' + sum.text.join(', '));
  // генератор: у каждой заставы есть ключник своего цвета, объекты квестов есть
  for (const seed of [1, 2, 3]) {
    const g = S.newGame({ size: 'M', seed, opponents: 2, difficulty: 'normal', faction: 'castle' });
    const objs = Object.values(g.objects);
    for (const o of objs) if (o.type === 'border_guard') assert.ok(objs.some(k => k.type === 'keymaster' && k.color === o.color), 'ключник для заставы ' + o.color);
    for (const o of objs) if (o.type === 'seer_hut') assert.ok(o.quest && o.reward && Q.text(o.quest) && Q.rewardText(o.reward));
    assert.ok(objs.some(o => O.get(o.type).quest || o.type === 'pandora_box' || o.type === 'keymaster'), 'квестовые объекты на карте');
  }
});

test('заставы никогда не запирают игрока: ключник достижим, иначе застава становится стражами', () => {
  const A = H3.Adventure;
  // генератор: на каждой карте ключник каждой заставы достижим для игрока без ключей
  for (const [size, opp] of [['S', 1], ['M', 2], ['L', 3]]) for (let seed = 1; seed <= (size === 'L' ? 4 : 10); seed++) {
    const st = S.newGame({ size, seed, opponents: opp, difficulty: 'normal', faction: 'castle' });
    const guards = Object.values(st.objects).filter(o => o.type === 'border_guard').length;
    assert.equal(A.sanitizeGates(st), 0, size + '/' + seed + ': застава без достижимого ключника (застав ' + guards + ')');
  }
  // первый сценарий кампании — тот, где это и было поймано
  const sc = H3.Campaign.get('erathia').scenarios[0];
  const st1 = S.newGame({ size: sc.size, seed: sc.seed, opponents: sc.opponents, difficulty: sc.difficulty, faction: sc.faction, goals: U.clone(sc.goals) });
  assert.equal(A.sanitizeGates(st1), 0, 'сценарий 1 кампании проходим');
  // подстроенный тупик: ключник замурован в горах — застава превращается в стражей
  const st = S.newGame({ size: 'S', seed: 9, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const m = st.levels[0], h = S.heroesOf(st, 0)[0];
  for (const o of Object.values(st.objects)) if (o.type === 'border_guard' || o.type === 'keymaster') A.removeObject(st, o);
  const put = (type, x, y, extra) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const i = (y + dy) * m.w + x + dx; const old = m.objAt[i] >= 0 ? st.objects[m.objAt[i]] : null; if (old && old.type !== 'town') A.removeObject(st, old); m.obs[i] = 0; m.block[i] = 0; m.terrain[i] = R.TERRAIN_INDEX.grass; } const o = Object.assign({ id: st.nextId++, type, x, y, z: 0, visited: {} }, extra); st.objects[o.id] = o; m.objAt[y * m.w + x] = o.id; m.block[y * m.w + x] = 1; return o; };
  const bg = put('border_guard', h.x + 4, h.y, { color: 'green' });
  const km = put('keymaster', 30, 30, { color: 'green' });
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.max(Math.abs(dx), Math.abs(dy)) === 2) { const i = (30 + dy) * m.w + 30 + dx; const old = m.objAt[i] >= 0 ? st.objects[m.objAt[i]] : null; if (old && old.type !== 'town') A.removeObject(st, old); m.obs[i] = 2; m.block[i] = 1; }
  assert.equal(A.sanitizeGates(st), 1, 'замурованный ключник — застава заменена');
  assert.equal(bg.type, 'monster'); assert.ok(bg.cid && bg.n > 0);
  assert.ok(st.log.some(l => /Застава без ключа/.test(l.text)));
  // а достижимого ключника предохранитель не трогает
  const st2 = S.newGame({ size: 'S', seed: 9, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const m2 = st2.levels[0], h2 = S.heroesOf(st2, 0)[0];
  for (const o of Object.values(st2.objects)) if (o.type === 'border_guard' || o.type === 'keymaster') A.removeObject(st2, o);
  const put2 = (type, x, y, extra) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const i = (y + dy) * m2.w + x + dx; const old = m2.objAt[i] >= 0 ? st2.objects[m2.objAt[i]] : null; if (old && old.type !== 'town') A.removeObject(st2, old); m2.obs[i] = 0; m2.block[i] = 0; m2.terrain[i] = R.TERRAIN_INDEX.grass; } const o = Object.assign({ id: st2.nextId++, type, x, y, z: 0, visited: {} }, extra); st2.objects[o.id] = o; m2.objAt[y * m2.w + x] = o.id; m2.block[y * m2.w + x] = 1; return o; };
  const bg2 = put2('border_guard', h2.x + 4, h2.y, { color: 'green' }); put2('keymaster', h2.x - 3, h2.y, { color: 'green' });
  assert.equal(A.sanitizeGates(st2), 0); assert.equal(bg2.type, 'border_guard');
});

console.log('editor');
test('редактор: документ карты, проверка, экспорт и партия по своей карте', () => {
  const ME = H3.MapEdit;
  const doc = ME.blank('S', 2);
  assert.equal(doc.w, 36); assert.equal(doc.levels.length, 2);
  assert.equal(doc.levels[1].terrain[100], R.TERRAIN_INDEX.rock, 'подземелье начинается сплошной скалой');
  // пустая карта играться не должна: игрокам негде начать
  let bad = ME.validate(doc).filter(p => p.bad);
  assert.equal(bad.length, 2, 'у обоих игроков нет города: ' + JSON.stringify(ME.validate(doc)));
  doc.objects.push(ME.makeObj('town', 8, 8, 0, { faction: 'castle', owner: 0 }));
  doc.objects.push(ME.makeObj('town', 26, 26, 0, { faction: 'necropolis', owner: 1 }));
  assert.deepEqual(ME.validate(doc).filter(p => p.bad), [], 'два города — карта готова');
  // объект на скале и город с закрытым входом ловятся
  const spoiled = ME.clone(doc);
  spoiled.objects.push(ME.makeObj('windmill', 5, 5, 1, {}));
  assert.ok(ME.validate(spoiled).some(p => p.bad && /непроходим/.test(p.text)), 'объект на скале — ошибка');
  const blocked = ME.clone(doc);
  blocked.levels[0].obs[9 * blocked.w + 8] = 2;
  assert.ok(ME.validate(blocked).some(p => p.bad && /вход/.test(p.text)), 'заваленный вход в город — ошибка');
  // остальное содержимое
  doc.objects.push(ME.makeObj('mine', 12, 12, 0, { res: 'ore' }));
  doc.objects.push(ME.makeObj('monster', 14, 14, 0, { cid: 'griffin', n: 14 }));
  doc.objects.push(ME.makeObj('resource', 11, 9, 0, { res: 'gold', amount: 1500 }));
  doc.objects.push(ME.makeObj('artifact', 15, 17, 0, { art: 'random', cls: 'major' }));
  doc.objects.push(ME.makeObj('witch_hut', 18, 11, 0, {}));
  doc.objects.push(ME.makeObj('subter_gate', 20, 10, 0, { pair: 1 }));
  doc.objects.push(ME.makeObj('subter_gate', 20, 10, 1, { pair: 1 }));
  for (let y = 8; y < 14; y++) for (let x = 16; x < 26; x++) doc.levels[1].terrain[y * doc.w + x] = R.TERRAIN_INDEX.subter;
  for (let x = 8; x < 20; x++) doc.levels[0].road[9 * doc.w + x] = 1;
  // экспорт/импорт не теряет ни клетки
  const back = ME.fromJSON(ME.toJSON(doc));
  assert.deepEqual(Array.from(back.levels[0].road), Array.from(doc.levels[0].road));
  assert.deepEqual(Array.from(back.levels[1].terrain), Array.from(doc.levels[1].terrain));
  assert.equal(back.objects.length, doc.objects.length);
  assert.throws(() => ME.fromJSON('{"fmt":99}'), /формат/);
  // партия по документу: игроки, объекты, проходимость, ход ИИ
  const st = S.newGame({ mapData: back, difficulty: 'normal', name: 'Игрок' });
  assert.equal(st.players.length, 2);
  assert.deepEqual(st.players.map(p => p.faction), ['castle', 'necropolis'], 'фракция игрока — от его города');
  assert.equal(Object.keys(st.towns).length, 2);
  assert.equal(Object.keys(st.objects).length, back.objects.length);
  const witch = Object.values(st.objects).find(o => o.type === 'witch_hut');
  assert.ok(witch.skill, 'хижине ведьмы досталcя навык');
  const mon = Object.values(st.objects).find(o => o.type === 'monster');
  assert.equal(mon.n, 14); assert.ok(mon.value > 0);
  const hero = S.heroesOf(st, 0)[0];
  assert.equal(hero.x, 8); assert.equal(hero.y, 8);
  const pf = S.pathfield(st, hero);
  assert.ok(pf.dist[12 * st.levels[0].w + 12] < Infinity, 'до шахты можно дойти');
  assert.equal(S.moveCost(st, hero, 9, 9), R.ROAD_COST, 'дорога из документа работает');
  H3.Adventure.endPlayerTurn(st); H3.Adventure.endPlayerTurn(st);
  assert.equal(st.day, 2, 'ход противника-ИИ проходит на своей карте');
  // цели из документа попадают в партию
  doc.goals = { win: [{ type: 'capture_town', of: 'enemy' }], lose: [{ type: 'lose_all' }] };
  const st2 = S.newGame({ mapData: ME.clone(doc), difficulty: 'normal', name: 'Игрок' });
  assert.ok(st2.goals.win[0].townId != null && st2.towns[st2.goals.win[0].townId].owner === 1, 'шаблонная цель развернулась');
});

console.log('campaign');
test('цели: выбывание всех противников не даёт победу, пока не взяты все города', () => {
  const A = H3.Adventure;
  const mk = goals => S.newGame({ size: 'S', seed: 7, opponents: 1, difficulty: 'normal', faction: 'castle', goals });
  const strip = st => { const foe = st.players[1]; for (const h of S.heroesOf(st, 1)) A.killHero(st, h); for (const tid of foe.towns.slice()) st.towns[tid].owner = -1; foe.towns = []; return foe; };
  // сценарий «все города»: враг выбыл, его город стал нейтральным — игра продолжается
  let st = mk({ win: [{ type: 'capture_all_towns' }], lose: [{ type: 'lose_all' }] });
  strip(st); A.checkPlayersAlive(st);
  assert.equal(st.players[1].alive, false, 'противник выбыл');
  assert.equal(st.winner, null, 'победы нет: остался нейтральный город');
  for (const t of Object.values(st.towns)) if (t.owner === -1) A.captureTown(st, t, 0, S.heroesOf(st, 0)[0]);
  A.checkPlayersAlive(st); assert.equal(st.winner, 0, 'все города взяты — победа');
  // обычная партия «победить всех»: выбывание — победа, как и раньше
  st = mk({ win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] });
  strip(st); A.checkPlayersAlive(st); assert.equal(st.winner, 0, 'убить всех — победа');
  // без целей вообще — тоже победа
  st = S.newGame({ size: 'S', seed: 7, opponents: 1, difficulty: 'normal', faction: 'castle' });
  strip(st); A.checkPlayersAlive(st); assert.equal(st.winner, 0, 'по умолчанию — победа');
});

test('кампания: перенос героя между сценариями и шаблонные цели', () => {
  const CP = H3.Campaign, sc = CP.get('erathia').scenarios;
  const start = (s, carry) => S.newGame({ size: s.size, seed: s.seed, opponents: s.opponents, difficulty: s.difficulty, faction: s.faction, goals: U.clone(s.goals), carryHero: carry || null });
  assert.ok(sc.length >= 5, 'в кампании пять сценариев');
  // прошли первый сценарий «прокачанным» героем
  const st1 = start(sc[0]);
  const h1 = S.heroesOf(st1, 0)[0];
  h1.level = 9; h1.xp = 12000; h1.skills = { wisdom: 3, offense: 2 }; h1.spells.push('fireball');
  h1.arts.head = 'centaur_axe'; h1.backpack.push('ring_of_vitality'); h1.army[0] = { cid: 'archangel', n: 4 };
  const carry = S.carryOf(h1);
  // второй сценарий получает того же героя целиком
  const st2 = start(sc[1], carry);
  const h2 = S.heroesOf(st2, 0)[0];
  assert.equal(h2.name, h1.name); assert.equal(h2.level, 9); assert.equal(h2.xp, 12000);
  assert.deepEqual(h2.skills, { wisdom: 3, offense: 2 });
  assert.ok(h2.spells.includes('fireball'), 'заклинания перенесены');
  assert.equal(h2.arts.head, 'centaur_axe'); assert.ok(h2.backpack.includes('ring_of_vitality'));
  assert.deepEqual(h2.army[0], { cid: 'archangel', n: 4 }, 'армия перенесена');
  assert.equal(st2.carried, h2.id);
  assert.equal(h2.move, R.heroMaxMove(h2), 'ход полный, а не остаток прошлой карты');
  assert.notStrictEqual(h2.skills, carry.skills, 'перенос копией, а не ссылкой');
  // шаблонная цель развернулась в конкретный вражеский город
  const tid = st2.goals.win[0].townId;
  assert.ok(tid != null && st2.towns[tid] && st2.towns[tid].owner > 0, 'цель — реально чужой город');
  // цель-артефакт обязана лежать на карте
  const st4 = start(sc[3]);
  assert.ok(Object.values(st4.objects).some(o => o.type === 'artifact' && o.art === 'titan_gladius'), 'клинок предков на карте');
  assert.ok(st4.goals.lose.some(g => g.type === 'lose_hero' && g.heroId != null), 'цель «не потерять героя» привязана к герою');
});

test('кампании: каждый сценарий генерируется, противники и цели — по сценарию', () => {
  const CP = H3.Campaign, B = H3.Buildings, AR = H3.Artifacts;
  assert.ok(CP.LIST.length >= 2, 'две кампании');
  for (const c of CP.LIST) for (const sc of c.scenarios) {
    const st = S.newGame({ size: sc.size, seed: sc.seed, opponents: sc.opponents, difficulty: sc.difficulty, faction: sc.faction, hero: sc.hero || null, foes: sc.foes || null, goals: U.clone(sc.goals) });
    const tag = c.id + '/' + sc.id + ': ';
    assert.equal(st.players.length, sc.opponents + 1, tag + 'число игроков');
    assert.equal(st.players[0].faction, sc.faction, tag + 'фракция игрока');
    if (sc.hero) assert.equal(S.heroesOf(st, 0)[0].tid, sc.hero, tag + 'стартовый герой');
    if (sc.foes) sc.foes.forEach((f, i) => assert.equal(st.players[i + 1].faction, f, tag + 'фракция противника ' + (i + 1)));
    const fs = st.players.map(p => p.faction); assert.equal(new Set(fs).size, fs.length, tag + 'фракции не повторяются');
    for (const g of st.goals.win.concat(st.goals.lose)) {
      if (g.type === 'capture_town' || g.type === 'lose_town') assert.ok(g.townId != null && st.towns[g.townId], tag + g.type + ' привязан к городу');
      if (g.type === 'defeat_hero' || g.type === 'lose_hero') { assert.ok(g.heroId != null && st.heroes[g.heroId], tag + g.type + ' привязан к герою'); assert.equal(st.heroes[g.heroId].owner > 0, g.type === 'defeat_hero', tag + g.type + ' — герой нужной стороны'); }
      if (g.type === 'find_artifact') assert.ok(Object.values(st.objects).some(o => o.type === 'artifact' && o.art === g.art) && AR.get(g.art), tag + 'артефакт на карте');
      if (g.type === 'build') assert.ok(B.BY_ID[g.building], tag + 'постройка существует');
    }
    assert.equal(st.winner, null, tag + 'на старте победителя нет');
    H3.Adventure.checkGoals(st); assert.equal(st.winner, null, tag + 'цели не выполнены на старте');
  }
});

test('особые постройки фракций: ход, гильдия, пруд, портал, разовый подарок, некромантия', () => {
  const A = H3.Adventure, B = H3.Buildings;
  const mk = f => S.newGame({ size: 'S', seed: 11, opponents: 1, difficulty: 'normal', faction: f });
  for (const fid of H3.Factions.LIST.map(f => f.id)) assert.ok(B.get(fid, 'special'), 'у ' + fid + ' есть особая постройка');
  // Конюшни: +400 очков движения всем героям игрока
  let st = mk('castle'), t = S.townsOf(st, 0)[0], h = S.heroesOf(st, 0)[0];
  const move0 = R.heroMaxMove(h);
  t.buildings.fort = true; t.buildings.special = true;
  A.newDay(st);
  assert.equal(R.heroMaxMove(S.heroesOf(st, 0)[0]), move0 + 400, 'конюшни дают +400');
  // Библиотека: на заклинание больше на уровень, уже выученные не пропадают
  st = mk('tower'); t = S.townsOf(st, 0)[0]; t.buildings.fort = true;
  R.build(st, t, 'guild_1');
  const spells0 = t.guild[1].slice();
  t.builtToday = false; Object.assign(st.players[0].res, { gold: 99999, wood: 99, ore: 99, gems: 99 });
  R.build(st, t, 'special');
  assert.equal(t.guild[1].length, spells0.length + 1, 'библиотека добавила заклинание');
  for (const id of spells0) assert.ok(t.guild[1].includes(id), 'старые заклинания на месте');
  // Мистический пруд: редкий ресурс в понедельник
  st = mk('rampart'); t = S.townsOf(st, 0)[0]; t.buildings.special = true;
  const rare0 = U.RARE.reduce((a, r) => a + st.players[0].res[r], 0);
  A.weeklySpecials(st);
  assert.ok(U.RARE.reduce((a, r) => a + st.players[0].res[r], 0) > rare0, 'пруд принёс редкий ресурс');
  // Портал призыва: внешние жилища идут в гарнизон
  st = mk('dungeon'); t = S.townsOf(st, 0)[0]; t.buildings.special = true; t.garrison = [null, null, null, null, null, null, null];
  const dw = Object.values(st.objects).find(o => o.type === 'dwelling');
  dw.owner = 0; dw.avail = 5;
  A.weeklySpecials(st);
  assert.equal(dw.avail, 0, 'жилище опустело');
  assert.ok(t.garrison.some(x => x && x.cid === dw.cid && x.n === 5), 'существа пришли в гарнизон');
  // Зал Валгаллы: подарок один раз на героя
  st = mk('stronghold'); t = S.townsOf(st, 0)[0]; t.buildings.special = true; h = S.heroesOf(st, 0)[0];
  const att0 = h.pri.att;
  A.enterOwnTown(st, h, t); assert.equal(h.pri.att, att0 + 1, 'первый визит дал +1 к атаке');
  A.enterOwnTown(st, h, t); assert.equal(h.pri.att, att0 + 1, 'второй визит ничего не даёт');
  // Усилитель некромантии виден правилам
  st = mk('necropolis'); t = S.townsOf(st, 0)[0];
  assert.equal(R.hasSpecial(st, 0, 'necropolis'), false);
  t.buildings.special = true;
  assert.equal(R.hasSpecial(st, 0, 'necropolis'), true);
});

test('сборные артефакты: комплект даёт эффект сверх суммы частей', () => {
  const AR = H3.Artifacts;
  for (const set of AR.SETS) {
    assert.ok(set.parts.length >= 2, set.id + ': в наборе хотя бы две части');
    for (const id of set.parts) assert.ok(AR.get(id), set.id + ': часть ' + id + ' существует');
  }
  const st = S.newGame({ size: 'S', seed: 3, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const h = S.heroesOf(st, 0)[0];
  h.arts = { weapon: 'gnoll_flail' };
  const one = R.artifactFx(h);
  assert.equal(one.att, 4, 'одна часть — только её эффект');
  assert.ok(!one.morale, 'неполный набор бонуса не даёт');
  let sets = AR.setsOf(h);
  assert.equal(sets.length, 1); assert.equal(sets[0].complete, false);
  h.arts.shield = 'gnoll_buckler';
  const full = R.artifactFx(h);
  assert.equal(full.att, 5, '+1 от собранного набора');
  assert.equal(full.def, 5, 'защита тоже выросла');
  assert.equal(full.morale, 1, 'мораль от набора');
  sets = AR.setsOf(h);
  assert.equal(sets[0].complete, true, 'набор собран');
  // части в рюкзаке не считаются
  h.arts = { weapon: 'gnoll_flail' }; h.backpack = ['gnoll_buckler'];
  assert.equal(AR.setsOf(h)[0].complete, false, 'рюкзак не собирает набор');
});

console.log('save');
test('сериализация туда-обратно', () => {
  const st = S.newGame({ size: 'S', seed: 21, opponents: 1, difficulty: 'hard', faction: 'necropolis' });
  const s1 = S.serialize(st); const st2 = S.deserialize(s1); assert.equal(S.serialize(st2), s1);
  // содержимое карты и видимости должно пережить сохранение (типизированные массивы)
  // оба слоя должны вернуться типизированными и совпасть побайтно
  for (let z = 0; z < 2; z++) {
    assert.ok(st2.levels[z].terrain instanceof Uint8Array && st2.levels[z].objAt instanceof Int32Array, 'слой ' + z + ': типизированные массивы');
    assert.ok(st2.players[0].vis[z] instanceof Uint8Array, 'слой ' + z + ': туман');
    for (const k of ['terrain', 'block', 'road', 'obs']) { assert.equal(st2.levels[z][k].length, st.levels[z][k].length, k);
      for (let i = 0; i < st.levels[z][k].length; i++) if (st2.levels[z][k][i] !== st.levels[z][k][i]) throw new Error('несовпадение ' + k + ' на слое ' + z + ' в ' + i); }
    for (let i = 0; i < st.levels[z].objAt.length; i++) assert.equal(st2.levels[z].objAt[i], st.levels[z].objAt[i]);
    assert.ok(st.levels[z].terrain.some(v => v !== st.levels[z].terrain[0]), 'слой ' + z + ' не должен быть однородным');
  }
  // после загрузки герой может ходить
  const h2 = st2.heroes[st2.players[0].heroes[0]];
  let ok = false; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) { if (S.moveCost(st2, h2, h2.x + dx, h2.y + dy) < Infinity) ok = true; }
  assert.ok(ok, 'герой после загрузки заперт');
  assert.throws(() => S.deserialize(JSON.stringify({ version: 99, state: {} })));
  assert.throws(() => S.deserialize(JSON.stringify({ version: S.VERSION, state: { map: { w: 4, h: 4, terrain: {} }, players: [] } })), /повреждено/);
});

console.log('adventure');
test('движение, подбор, дипломатия, конец хода', () => {
  const st = S.newGame({ size: 'S', seed: 3, opponents: 1, difficulty: 'normal', faction: 'castle' });
  const h = st.heroes[st.players[0].heroes[0]]; const p = st.players[0];
  const pf = S.pathfield(st, h);
  const res = Object.values(st.objects).filter(o => o.type === 'resource' && !o.z && pf.dist[o.y * st.levels[0].w + o.x] < Infinity).sort((a, b) => pf.dist[a.y * st.levels[0].w + a.x] - pf.dist[b.y * st.levels[0].w + b.x])[0];
  const path = PF.pathTo(pf, res.x, res.y); const before = p.res[res.res];
  const r = H3.Adventure.moveHero(st, h, path); assert.equal(r.stop.kind, 'object');
  H3.Adventure.visit(st, h, res.obj || r.stop.obj); assert.ok(p.res[r.stop.obj.res] > before);
  const m = Object.values(st.objects).find(o => o.type === 'monster'); const ap = H3.Adventure.approachMonster(st, h, m); assert.ok(['fight', 'join', 'pay', 'flee'].includes(ap.outcome));
  const gold = p.res.gold; H3.Adventure.endPlayerTurn(st); H3.Adventure.endPlayerTurn(st); assert.equal(st.day, 2); assert.ok(p.res.gold >= gold + 500); assert.equal(h.move, R.heroMaxMove(h));
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
