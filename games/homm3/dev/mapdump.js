// node dev/mapdump.js [size] [seed] [players] — ASCII-карта
const H3 = require('../test/load.js');
const size = process.argv[2] || 'S', seed = +(process.argv[3] || 1), opp = +(process.argv[4] || 1);
const t0 = Date.now();
const st = H3.State.newGame({ size, seed, opponents: opp, difficulty: 'normal', faction: 'castle' });
const dt = Date.now() - t0;
const m = st.map; const ch = { grass: '.', dirt: ',', sand: ':', snow: '*', swamp: '~', rough: '^', lava: '#', subter: '_', water: 'w', rock: 'X' };
const lines = [];
for (let y = 0; y < m.h; y++) { let s = ''; for (let x = 0; x < m.w; x++) { const i = y * m.w + x; const o = m.objAt[i] >= 0 ? st.objects[m.objAt[i]] : null;
  if (o) s += ({ town: 'T', mine: 'M', monster: 'G', resource: 'r', chest: 'c', artifact: 'a', dwelling: 'd' })[o.type] || 'o';
  else if (m.obs[i] === 2) s += 'A'; else if (m.obs[i] === 1) s += 't'; else if (m.obs[i] === 3) s += 'x'; else if (m.road[i]) s += '='; else s += ch[H3.Rules.TERRAINS[m.terrain[i]]]; } lines.push(s); }
console.log(lines.join('\n'));
const objs = Object.values(st.objects); const cnt = {}; objs.forEach(o => cnt[o.type] = (cnt[o.type] || 0) + 1);
console.log('gen ms', dt, 'objects', objs.length, JSON.stringify(cnt));
console.log('towns', Object.values(st.towns).map(t => t.name + '@' + t.x + ',' + t.y + ' owner ' + t.owner).join('; '));
console.log('guards', objs.filter(o => o.type === 'monster').map(o => o.cid + 'x' + o.n).join(', '));
