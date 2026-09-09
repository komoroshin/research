// Турнир: новый ИИ (v1.7) против снимка старого (v1.6).
// Партии играются ПАРАМИ: один и тот же сид сначала с новым ИИ за игрока 0,
// потом с новым за игрока 1. Так преимущество карты, фракции и первого хода
// вычитается полностью — на одинаковом коде счёт обязан быть ровно 50/50.
// node dev/aiwar.js [пар] [размер] [дней]
const H3 = require('../test/load.js');
require('./ai_v16.js');
const S = H3.State, A = H3.Adventure;

const pairs = +(process.argv[2] || 6), size = process.argv[3] || 'M', maxDays = +(process.argv[4] || 90);
const NEW = H3.AI, OLD = H3.AIOld;
// AI_OFF=sim / AI_ON=threat,roles — включить или выключить механики нового ИИ
for (const f of (process.env.AI_OFF || '').split(',')) if (f && f in NEW.FLAGS) NEW.FLAGS[f] = false;
for (const f of (process.env.AI_ON || '').split(',')) if (f && f in NEW.FLAGS) NEW.FLAGS[f] = true;

async function play(seed, newSide) {
  const st = S.newGame({ size, seed, opponents: 1, difficulty: 'normal', faction: 'castle' });
  st.players[0].isAI = true;
  while (st.day <= maxDays && st.winner === null) {
    const p = st.players[st.turn];
    if (p.alive) await (p.id === newSide ? NEW : OLD).playTurn(st, p.id, {});
    A.endPlayerTurn(st);
  }
  const stats = st._aiStats || {};
  const sN = stats[newSide] || { fights: 0, lost: 0, lostValue: 0 }, sO = stats[1 - newSide] || { fights: 0, lost: 0, lostValue: 0 };
  return {
    fightsNew: sN.fights, lostNew: sN.lost, lossValNew: sN.lostValue,
    fightsOld: sO.fights, lostOld: sO.lost, lossValOld: sO.lostValue,
    winner: st.winner, day: st.day,
    powNew: A.playerPower(st, newSide), powOld: A.playerPower(st, 1 - newSide),
    townsNew: st.players[newSide].towns.length, townsOld: st.players[1 - newSide].towns.length,
  };
}

(async () => {
  let winNew = 0, winOld = 0, draw = 0, days = 0, t0 = Date.now();
  let pNew = 0, pOld = 0, tNew = 0, tOld = 0, n = 0, aheadNew = 0, aheadOld = 0;
  const fx = { fN: 0, lN: 0, vN: 0, fO: 0, lO: 0, vO: 0 };
  for (let g = 0; g < pairs; g++) {
    for (const side of [0, 1]) {
      const r = await play(2000 + g, side);
      n++; days += r.day; pNew += r.powNew; pOld += r.powOld; tNew += r.townsNew; tOld += r.townsOld;
      fx.fN += r.fightsNew; fx.lN += r.lostNew; fx.vN += r.lossValNew; fx.fO += r.fightsOld; fx.lO += r.lostOld; fx.vO += r.lossValOld;
      if (r.winner === side) winNew++; else if (r.winner === 1 - side) winOld++; else draw++;
      // «перевес по силе» — устойчивее к разгромам, чем среднее отношение
      if (r.powNew > r.powOld * 1.05) aheadNew++; else if (r.powOld > r.powNew * 1.05) aheadOld++;
      process.stdout.write(r.winner === side ? '+' : r.winner === null ? '.' : '-');
    }
  }
  console.log('');
  console.log('партий: ' + n + ' (' + pairs + ' пар, ' + size + ', до ' + maxDays + ' дней), ' + Math.round((Date.now() - t0) / 1000) + ' с');
  console.log('новый ИИ побед: ' + winNew + ' | старый: ' + winOld + ' | без победителя: ' + draw);
  const decided = winNew + winOld;
  if (decided) console.log('win-rate нового в решённых партиях: ' + Math.round(100 * winNew / decided) + ' %');
  console.log('средняя сила армий: новый ' + Math.round(pNew / n) + ' | старый ' + Math.round(pOld / n)
    + '  (отношение ' + (pNew / Math.max(1, pOld)).toFixed(2) + ')');
  console.log('партий с перевесом по силе: новый ' + aheadNew + ' | старый ' + aheadOld + ' | вровень ' + (n - aheadNew - aheadOld));
  console.log('средние города: новый ' + (tNew / n).toFixed(1) + ' | старый ' + (tOld / n).toFixed(1));
  console.log('средняя длина партии: ' + (days / n).toFixed(1) + ' дней');
  const pct = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
  console.log('боёв начато: новый ' + fx.fN + ' (проиграно ' + fx.lN + ', ' + pct(fx.lN, fx.fN) + ')'
    + ' | старый ' + fx.fO + ' (проиграно ' + fx.lO + ', ' + pct(fx.lO, fx.fO) + ')');
  console.log('потеряно армии за партию: новый ' + Math.round(fx.vN / n) + ' | старый ' + Math.round(fx.vO / n));
})();
