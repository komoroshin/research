const H3 = require('../test/load.js');
const R = H3.Rules, C = H3.Creatures;
function army(list) { const a = [null,null,null,null,null,null,null]; list.forEach(([cid,n],i)=>a[i]={cid,n}); return a; }
function hero(tid, lvl, mana) { const st = { nextId: 1, heroes: {}, _rng: { misc: new H3.U.RNG(5) } }; const h = R.makeHero(st, tid, 0, 0, 0, true); h.level = lvl||1; h.mana = mana||h.mana; return h; }
const seed = +(process.argv[2]||1);
const rng = new H3.U.RNG(seed);
const h1 = hero('orrin', 3), h2 = hero('crag_hack', 3);
h1.spells.push('magic_arrow','haste','slow','lightning_bolt'); h1.skills.air=2; h1.mana=30; h1.hasBook=true;
const b = H3.Battle.create({ hero: h1, army: army([['pikeman',20],['archer',10],['griffin',5],['swordsman',3]]), player: 0, name: 'Оррин' },
  { hero: h2, army: army([['goblin',30],['wolf_rider',8],['orc',8],['ogre',3]]), player: 1, name: 'Крэг' }, { terrain: 'grass', rng });
const t0=Date.now(); const res = H3.BattleAI.auto(b, true); const dt=Date.now()-t0;
console.log('winner', res.winner, res.reason, 'rounds', res.rounds, 'xp', res.xp, 'ms', dt);
console.log('side0 army', JSON.stringify(res.sides[0].army.filter(Boolean)), 'losses', JSON.stringify(res.sides[0].losses));
console.log('side1 army', JSON.stringify(res.sides[1].army.filter(Boolean)), 'losses', JSON.stringify(res.sides[1].losses));
console.log('mana left', b.sides[0].mana, 'spells cast', b.sides[0].spellsCast);
// siege test
const town = { faction: 'castle', buildings: { fort: true, citadel: true, castle: true } };
const b2 = H3.Battle.create({ hero: h2, army: army([['goblin',60],['wolf_rider',20],['orc',20],['ogre',8],['cyclops',3]]), player: 1, name: 'Крэг' },
  { hero: null, army: army([['pikeman',30],['archer',15]]), player: 0, name: 'Гарнизон', canRetreat: false }, { terrain: 'grass', rng, siege: town });
const r2 = H3.BattleAI.auto(b2, true);
console.log('siege winner', r2.winner, r2.reason, 'rounds', r2.rounds, 'walls', JSON.stringify(b2.siege.walls), 'gate', b2.siege.gate);
console.log('side0 losses', JSON.stringify(r2.sides[0].losses), 'side1 losses', JSON.stringify(r2.sides[1].losses));
