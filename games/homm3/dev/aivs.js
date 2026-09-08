// Новый ИИ против старого жадного: node dev/aivs.js [боёв] [неделя]
const H3 = require('../test/load.js');
const U = H3.U, R = H3.Rules, F = H3.Factions, C = H3.Creatures, Bt = H3.Battle, AI = H3.BattleAI;
const N = +(process.argv[2] || 60), week = +(process.argv[3] || 3);
function weekArmy(fid, w) {
  const army = [null,null,null,null,null,null,null];
  const tiers = Math.min(7, 2 + w), budget = 4000 * w;
  const cs = []; for (let t = 1; t <= tiers; t++) cs.push(F.creaturesOf(fid, t)[0]);
  const tot = cs.reduce((a, c) => a + c.growth * c.cost.gold, 0);
  cs.forEach((c, i) => { const share = budget * (c.growth * c.cost.gold) / tot; army[i] = { cid: c.id, n: Math.max(1, Math.round(share / c.cost.gold)) }; });
  return army;
}
function hero(fid, seed) { const st = { nextId: 1, heroes: {}, _rng: { misc: new U.RNG(seed) } }; const tid = H3.Heroes.heroesOfFaction(fid)[0].id; const h = R.makeHero(st, tid, 0, 0, 0, true); h.level = 5; h.pri = { att: 3, def: 3, pow: 3, kno: 3 }; h.hasBook = true; return h; }
// одна сторона играет smart, другая greedy; стороны меняются местами
const ids = F.LIST.map(f => f.id);
let smartWins = 0, greedyWins = 0, draws = 0, rounds = 0, smartLoss = 0, greedyLoss = 0;
for (let i = 0; i < N; i++) {
  const fa = ids[i % ids.length], fb = ids[(i * 3 + 1) % ids.length];
  const smartSide = i % 2; // чередуем, чтобы преимущество первого хода не искажало
  const rng = new U.RNG(i * 7919 + 5);
  const b = Bt.create(
    { hero: hero(fa, i + 1), army: weekArmy(fa, week), player: 0, name: 'A' },
    { hero: hero(fb, i + 2), army: weekArmy(fb, week), player: 1, name: 'B' },
    { rng, terrain: 'grass' });
  let guard = 0;
  while (!b.over && guard++ < 4000) {
    const cur = Bt.current(b); if (!cur) break;
    const a = AI.choose(b, cur.side === smartSide);
    Bt.act(b, a || { type: 'defend' });
  }
  if (!b.over) Bt.finish(b, 0, 'timeout');
  const r = b.result;
  rounds += r.rounds;
  const smartLost = r.sides[smartSide].lostValue, greedyLost = r.sides[1 - smartSide].lostValue;
  smartLoss += smartLost; greedyLoss += greedyLost;
  if (r.reason === 'timeout') draws++;
  else if (r.winner === smartSide) smartWins++; else greedyWins++;
}
console.log('боёв', N, '· неделя', week);
console.log('новый ИИ побед:', smartWins, '| старый жадный:', greedyWins, '| ничьих:', draws);
console.log('win-rate нового:', Math.round(100 * smartWins / (smartWins + greedyWins)) + '%');
console.log('средние потери за бой — новый:', Math.round(smartLoss / N), '| старый:', Math.round(greedyLoss / N));
console.log('средняя длина боя:', (rounds / N).toFixed(1), 'раундов');
