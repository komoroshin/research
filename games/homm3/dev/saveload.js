// Проверка «выход → продолжить» в браузере: node dev/saveload.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = '/tmp/claude-0/-home-user/a99ab51d-4089-5bf8-9571-78bcca32901c/scratchpad';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|ERR_FAILED|fonts/.test(m.text())) errors.push(m.text()); });
  const ev = (fn, ...a) => page.evaluate(fn, ...a);
  const url = 'file://' + path.resolve('index.html');
  await page.route(/^https?:\/\//, r => r.abort());   // игра полностью локальна: внешние шрифты не ждём
  await page.goto(url + '?autostart=1&seed=5', { waitUntil: 'load' }); await page.waitForTimeout(900);
  // походить, закончить ход, чтобы состояние отличалось от стартового
  await ev(() => { const G=H3.Game,S=H3.State,st=G.state,h=G.selected(); const pf=S.pathfield(st,h);
    const o=Object.values(st.objects).filter(o=>o.type==='resource'&&pf.dist[o.y*st.map.w+o.x]<Infinity).sort((a,b)=>pf.dist[a.y*st.map.w+a.x]-pf.dist[b.y*st.map.w+b.x])[0];
    G.moveAlong(h,H3.Pathfind.annotate(pf,H3.Pathfind.pathTo(pf,o.x,o.y),h.move,H3.Rules.heroMaxMove(h))); });
  await page.waitForTimeout(2500);
  await ev(() => { H3.Game.settings().confirmEndTurn=false; H3.Game.endTurn(); }); await page.waitForTimeout(3000);
  const before = await ev(() => { const st=H3.Game.state,h=H3.State.heroesOf(st,0)[0];
    return { day:st.day, gold:st.players[0].res.gold, hx:h.x, hy:h.y, seed:st.seed, vis:Array.from(st.players[0].vis).filter(v=>v>0).length, terr:Array.from(st.map.terrain).reduce((a,b)=>a+b,0) }; });
  // «выход» = перезагрузка страницы, затем «Продолжить»
  await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(700);
  await page.screenshot({ path: out + '/s_menu.png' });
  await page.click('#btnCont'); await page.waitForTimeout(1200);
  await page.screenshot({ path: out + '/s_loaded.png' });
  const after = await ev(() => { const st=H3.Game.state; if(!st) return null; const h=H3.State.heroesOf(st,0)[0];
    return { day:st.day, gold:st.players[0].res.gold, hx:h.x, hy:h.y, seed:st.seed, vis:Array.from(st.players[0].vis).filter(v=>v>0).length, terr:Array.from(st.map.terrain).reduce((a,b)=>a+b,0) }; });
  console.log('до выхода :', JSON.stringify(before));
  console.log('после     :', JSON.stringify(after));
  console.log('совпало   :', JSON.stringify(before) === JSON.stringify(after));
  // герой действительно ходит после загрузки
  const moved = await ev(async () => { const G=H3.Game,S=H3.State,st=G.state,h=G.selected()||S.heroesOf(st,0)[0]; G.selectHero(h.id);
    const pf=S.pathfield(st,h); const reach=pf.dist.filter(d=>d<Infinity&&d>0).length;
    // цель — самая дальняя клетка, путь к которой не задевает ни одного объекта:
    // иначе откроется диалог (бой, сундук) и прогон будет ждать игрока вечно
    const cands=[]; for(let y=0;y<st.map.h;y++)for(let x=0;x<st.map.w;x++){const i=y*st.map.w+x,d=pf.dist[i]; if(d<Infinity&&d>0&&d<h.move&&st.map.objAt[i]<0) cands.push([d,x,y]);}
    cands.sort((a,b)=>b[0]-a[0]);
    let best=null,p=null;
    for(const c of cands){ const path=H3.Pathfind.pathTo(pf,c[1],c[2]); if(path.every(([x,y])=>st.map.objAt[y*st.map.w+x]<0)){ best=[c[1],c[2]]; p=path; break; } }
    if(!best) return {reach, moved:0};
    const from=[h.x,h.y];
    // прогон не должен зависать, если движение вдруг упрётся в диалог
    const outcome = await Promise.race([
      G.moveAlong(h,H3.Pathfind.annotate(pf,p,h.move,H3.Rules.heroMaxMove(h))).then(()=> 'ok'),
      new Promise(r=>setTimeout(()=>r('ЗАВИСЛО: '+((document.querySelector('.modal')||{}).textContent||'без диалога').slice(0,60)),8000)),
    ]);
    return { reach, outcome, moved: Math.abs(h.x-from[0])+Math.abs(h.y-from[1]), pos:[h.x,h.y] }; });
  await page.waitForTimeout(1500);
  console.log('после загрузки: достижимо клеток', moved.reach, ', герой сместился на', moved.moved, 'клеток →', JSON.stringify(moved.pos), moved.outcome === 'ok' ? '' : moved.outcome);
  await page.screenshot({ path: out + '/s_after_move.png' });
  // битое сохранение старого формата → понятное сообщение, а не пустое поле
  await ev(() => localStorage.setItem('homm3.save.auto', JSON.stringify({ version: 1, state: { day: 3 } })));
  await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(600);
  await page.click('#btnCont'); await page.waitForTimeout(600);
  const msg = await ev(() => { const m=document.querySelector('.modal'); return m ? m.textContent.slice(0,90) : 'нет диалога'; });
  console.log('битый сейв:', msg);
  await page.screenshot({ path: out + '/s_broken.png' });
  console.log(errors.length ? 'ОШИБКИ:\n' + errors.join('\n') : 'ошибок в консоли нет');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
