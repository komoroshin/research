// Вклад каждой части ИИ: node dev/aitune.js [боёв]
const H3 = require('../test/load.js');
const U = H3.U, R = H3.Rules, F = H3.Factions, Bt = H3.Battle, AI = H3.BattleAI;
const N = +(process.argv[2] || 60);
function weekArmy(fid, w) { const a=[null,null,null,null,null,null,null]; const tiers=Math.min(7,2+w),bud=4000*w;
  const cs=[]; for(let t=1;t<=tiers;t++)cs.push(F.creaturesOf(fid,t)[0]); const tot=cs.reduce((x,c)=>x+c.growth*c.cost.gold,0);
  cs.forEach((c,i)=>{const sh=bud*(c.growth*c.cost.gold)/tot; a[i]={cid:c.id,n:Math.max(1,Math.round(sh/c.cost.gold))};}); return a; }
function hero(fid,seed){const st={nextId:1,heroes:{},_rng:{misc:new U.RNG(seed)}};const tid=H3.Heroes.heroesOfFaction(fid)[0].id;const h=R.makeHero(st,tid,0,0,0,true);h.level=5;h.pri={att:3,def:3,pow:3,kno:3};h.hasBook=true;return h;}
const ids = F.LIST.map(f=>f.id);
function run(label, tune) {
  const saved = Object.assign({}, AI.T); Object.assign(AI.T, tune);
  let win=0, lose=0, shots=0, rounds=0;
  for (let i=0;i<N;i++){
    const fa=ids[i%ids.length], fb=ids[(i*3+1)%ids.length], smart=i%2;
    const rng=new U.RNG(i*7919+5);
    const b=Bt.create({hero:hero(fa,i+1),army:weekArmy(fa,3),player:0},{hero:hero(fb,i+2),army:weekArmy(fb,3),player:1},{rng,terrain:'grass'});
    let g=0;
    while(!b.over&&g++<4000){ const cur=Bt.current(b); if(!cur)break; const isSmart=cur.side===smart; const a=AI.choose(b,isSmart)||{type:'defend'};
      if(isSmart&&a.type==='shoot')shots++; Bt.act(b,a); }
    if(!b.over)Bt.finish(b,0,'timeout');
    rounds+=b.result.rounds;
    if(b.result.winner===smart)win++; else lose++;
  }
  Object.assign(AI.T, saved);
  console.log(label.padEnd(34), Math.round(100*win/(win+lose))+'%', '| выстрелов', shots, '| раундов', (rounds/N).toFixed(1));
}
console.log('win-rate нового ИИ против старого жадного, боёв на конфигурацию:', N);
run('всё включено', {});
run('без учёта входящего урона', { incoming: 0 });
run('без ожидания', { wait: 0 });
run('без отхода стрелка', { shooterFlee: 0 });
run('без строя и прикрытия', { support: 0, cover: 0 });
run('без осторожности в движении', { moveDanger: 0 });
run('стрелок не боится ближнего боя', { meleePenalty: 0 });
run('только размен, без позиционки', { moveDanger: 0, support: 0, cover: 0, surround: 0, wait: 0, shooterFlee: 0 });

console.log('\n--- без строя и прикрытия, подбор осторожности ---');
for (const d of [0.3, 0.45, 0.7, 1.0, 1.5]) run('осторожность ' + d, { support: 0, cover: 0, moveDanger: d });
console.log('\n--- лучшая база + варианты размена ---');
run('база (осторожность 0.7)', { support: 0, cover: 0, moveDanger: 0.7 });
run('  + без входящего в атаке', { support: 0, cover: 0, moveDanger: 0.7, incoming: 0 });
run('  + входящий ×1.5', { support: 0, cover: 0, moveDanger: 0.7, incoming: 1.5 });
run('  + без ожидания', { support: 0, cover: 0, moveDanger: 0.7, wait: 0 });
run('  + без окружения', { support: 0, cover: 0, moveDanger: 0.7, surround: 0 });
