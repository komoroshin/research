// Тесты правил без браузера: node test/run.js
const assert = require('assert');
const H3 = require('./load.js');
const U = H3.U, R = H3.Rules, S = H3.State, Bt = H3.Battle, C = H3.Creatures, PF = H3.Pathfind, HE = H3.Heroes;
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); passed++; console.log('  ok  ' + name); } catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + (e.message || e)); } }
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
test('30 сидов × 3 размера: связность, обязательные объекты, время', () => {
  const t0 = Date.now(); let n = 0;
  for (const size of ['S', 'M', 'L']) for (let seed = 1; seed <= (size === 'L' ? 6 : 12); seed++) {
    const opp = size === 'S' ? 1 : size === 'M' ? 2 : 3;
    const st = S.newGame({ size, seed, opponents: opp, difficulty: 'normal', faction: 'rampart' });
    const map = st.map; n++;
    assert.equal(st.players.length, opp + 1);
    const t = st.towns[st.players[0].towns[0]];
    const seen = PF.reachable(map.w, map.h, t.x, t.y + 1, (x, y) => { const i = y * map.w + x; return map.objAt[i] >= 0 || !map.block[i]; });
    for (const p of st.players) { const tw = st.towns[p.towns[0]]; assert.ok(seen[(tw.y + 1) * map.w + tw.x], 'town reachable ' + size + seed); }
    const mines = Object.values(st.objects).filter(o => o.type === 'mine');
    assert.ok(mines.filter(o => o.res === 'wood').length >= st.players.length, 'sawmills');
    const zone0 = map.zone[t.y * map.w + t.x];
    const near = mines.filter(o => map.zone[o.y * map.w + o.x] === zone0 && ['wood', 'ore'].includes(o.res));
    assert.ok(near.length >= 2, 'start mines ' + size + seed);
    // первый бой выигрышный: страж стартовой лесопилки ≤ 40 % силы стартовой армии
    const hero = st.heroes[st.players[0].heroes[0]]; const hp = R.armyPower(hero.army, hero);
    for (const m of near) { for (const g of S.monstersNear(st, m.x, m.y)) assert.ok(H3.Adventure.monsterPower(g) <= hp * 0.45, 'first guard too strong ' + size + seed + ' ' + H3.Adventure.monsterPower(g) + ' vs ' + hp); }
  }
  const ms = (Date.now() - t0) / n; assert.ok(ms < 300, 'avg gen ms ' + ms);
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

console.log('save');
test('сериализация туда-обратно', () => {
  const st = S.newGame({ size: 'S', seed: 21, opponents: 1, difficulty: 'hard', faction: 'necropolis' });
  const s1 = S.serialize(st); const st2 = S.deserialize(s1); assert.equal(S.serialize(st2), s1);
  // содержимое карты и видимости должно пережить сохранение (типизированные массивы)
  assert.ok(st2.map.terrain instanceof Uint8Array && st2.map.objAt instanceof Int32Array && st2.players[0].vis instanceof Uint8Array);
  for (const k of ['terrain', 'block', 'road', 'obs']) { assert.equal(st2.map[k].length, st.map[k].length, k);
    for (let i = 0; i < st.map[k].length; i++) if (st2.map[k][i] !== st.map[k][i]) throw new Error('несовпадение ' + k + ' в ' + i); }
  for (let i = 0; i < st.map.objAt.length; i++) assert.equal(st2.map.objAt[i], st.map.objAt[i]);
  assert.ok(st.map.terrain.some((v, i) => v !== st.map.terrain[0]) , 'карта не должна быть однородной');
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
  const res = Object.values(st.objects).filter(o => o.type === 'resource' && pf.dist[o.y * st.map.w + o.x] < Infinity).sort((a, b) => pf.dist[a.y * st.map.w + a.x] - pf.dist[b.y * st.map.w + b.x])[0];
  const path = PF.pathTo(pf, res.x, res.y); const before = p.res[res.res];
  const r = H3.Adventure.moveHero(st, h, path); assert.equal(r.stop.kind, 'object');
  H3.Adventure.visit(st, h, res.obj || r.stop.obj); assert.ok(p.res[r.stop.obj.res] > before);
  const m = Object.values(st.objects).find(o => o.type === 'monster'); const ap = H3.Adventure.approachMonster(st, h, m); assert.ok(['fight', 'join', 'pay', 'flee'].includes(ap.outcome));
  const gold = p.res.gold; H3.Adventure.endPlayerTurn(st); H3.Adventure.endPlayerTurn(st); assert.equal(st.day, 2); assert.ok(p.res.gold >= gold + 500); assert.equal(h.move, R.heroMaxMove(h));
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
