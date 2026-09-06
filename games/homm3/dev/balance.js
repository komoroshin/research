// Симуляция баланса: армия «недели N» каждой фракции против каждой; node dev/balance.js [week] [fights]
const H3 = require('../test/load.js');
const U = H3.U, R = H3.Rules, F = H3.Factions, C = H3.Creatures, Bt = H3.Battle;
const week = +(process.argv[2] || 2), N = +(process.argv[3] || 60);
function weekArmy(fid, w) {
  // равный бюджет золота: 4000 × w, распределённый по тирам 1..min(7, 2+w) пропорционально приросту
  const army = [null, null, null, null, null, null, null];
  const tiers = Math.min(7, 2 + w), budget = 4000 * w;
  const cs = []; for (let t = 1; t <= tiers; t++) cs.push(F.creaturesOf(fid, t)[0]);
  const totalGrowthCost = cs.reduce((a, c) => a + c.growth * c.cost.gold, 0);
  cs.forEach((c, i) => { const share = budget * (c.growth * c.cost.gold) / totalGrowthCost; army[i] = { cid: c.id, n: Math.max(1, Math.round(share / c.cost.gold)) }; });
  return army;
}
function hero(fid) { const st = { nextId: 1, heroes: {}, _rng: { misc: new U.RNG(1) } }; const tid = H3.Heroes.heroesOfFaction(fid)[0].id; const h = R.makeHero(st, tid, 0, 0, 0, true); h.level = 5; h.pri = { att: 3, def: 3, pow: 2, kno: 2 }; return h; }
const ids = F.LIST.map(f => f.id);
const wins = {}; ids.forEach(a => { wins[a] = {}; ids.forEach(b => { wins[a][b] = 0; }); });
for (const a of ids) for (const b of ids) {
  if (a === b) continue;
  for (let i = 0; i < N; i++) {
    const rng = new U.RNG(i * 7919 + 13);
    const bt = Bt.create({ hero: hero(a), army: weekArmy(a, week), player: 0 }, { hero: hero(b), army: weekArmy(b, week), player: 1 }, { rng, terrain: 'grass' });
    const r = H3.BattleAI.auto(bt, true);
    if (r.winner === 0) wins[a][b]++;
  }
}
console.log('Неделя ' + week + ', боёв на пару: ' + N + ' (строка атакует столбец, % побед атакующего)');
console.log('          ' + ids.map(x => x.slice(0, 6).padStart(7)).join(''));
let worst = 0;
for (const a of ids) { let row = a.slice(0, 9).padEnd(10); let tot = 0; for (const b of ids) { if (a === b) { row += '      -'; continue; } const pct = Math.round(100 * wins[a][b] / N); tot += pct; row += String(pct).padStart(7); } console.log(row + '   avg ' + Math.round(tot / (ids.length - 1))); }
for (const a of ids) for (const b of ids) if (a < b) { const ab = wins[a][b] / N, ba = wins[b][a] / N; const bias = Math.abs((ab + (1 - ba)) / 2 - 0.5); worst = Math.max(worst, bias); }
console.log('макс. перекос пары: ' + Math.round((0.5 + worst) * 100) + '/' + Math.round((0.5 - worst) * 100) + (worst > 0.15 ? '  (хуже 65/35)' : '  (в норме)'));
