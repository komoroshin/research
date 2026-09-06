// node dev/sim.js [size] [seed] [players] [days] — партия ИИ против ИИ без экрана
const H3 = require('../test/load.js');
const S = H3.State, A = H3.Adventure;
const size = process.argv[2] || 'S', seed = +(process.argv[3] || 1), opp = +(process.argv[4] || 1), days = +(process.argv[5] || 60);
const st = S.newGame({ size, seed, opponents: opp, difficulty: 'normal', faction: 'castle' });
st.players[0].isAI = true;
(async () => {
  const t0 = Date.now();
  while (st.day <= days && st.winner === null) {
    const p = st.players[st.turn];
    if (p.alive) await H3.AI.playTurn(st, p.id, {});
    A.endPlayerTurn(st);
    if (S.dayOfWeek(st.day) === 1 && st.turn === 0) {
      const line = st.players.map(q => q.name.slice(0, 7) + ': ' + (q.alive ? 'g' + q.res.gold + ' t' + q.towns.length + ' h' + q.heroes.length + ' pw' + A.playerPower(st, q.id) : 'dead')).join(' | ');
      console.log('day', st.day, line);
    }
  }
  console.log('finished day', st.day, 'winner', st.winner, 'battles', st.stats.battles, 'ms', Date.now() - t0);
  const mines = Object.values(st.objects).filter(o => o.type === 'mine'); console.log('mines owned', mines.filter(m => m.owner >= 0).length, '/', mines.length, 'monsters left', Object.values(st.objects).filter(o => o.type === 'monster').length);
  for (const p of st.players) { console.log(p.name, 'towns', p.towns.map(t => st.towns[t].name + ':' + Object.keys(st.towns[t].buildings).length + 'bld').join(','), 'heroes', S.heroesOf(st, p.id).map(h => h.name + ' L' + h.level + ' ' + h.army.filter(Boolean).map(s => s.cid + 'x' + s.n).join('+')).join(' ; ')); console.log('  think:', (p.aiThink || []).slice(-6).join(' / ')); }
})().catch(e => { console.error('ERROR', e.stack); process.exit(1); });
