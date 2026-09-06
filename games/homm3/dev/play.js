// Сценарный прогон игры в браузере: node dev/play.js [seed] [outdir]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const seed = process.argv[2] || '3', out = process.argv[3] || '/tmp/claude-0/-home-user/a99ab51d-4089-5bf8-9571-78bcca32901c/scratchpad';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|fonts/.test(m.text())) errors.push('console: ' + m.text()); });
  const shot = async name => { await page.screenshot({ path: path.join(out, 'p_' + name + '.png') }); console.log('shot', name); };
  const ev = (fn, ...args) => page.evaluate(fn, ...args);
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=' + seed, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  // 1. движение к ближайшему ресурсу
  const r1 = await ev(() => { const G = H3.Game, S = H3.State, st = G.state; const h = G.selected(); const pf = S.pathfield(st, h);
    const objs = Object.values(st.objects).filter(o => ['resource', 'chest'].includes(o.type) && pf.dist[o.y * st.map.w + o.x] < Infinity).sort((a, b) => pf.dist[a.y * st.map.w + a.x] - pf.dist[b.y * st.map.w + b.x]);
    const o = objs[0]; const p = H3.Pathfind.pathTo(pf, o.x, o.y); G.moveAlong(h, H3.Pathfind.annotate(pf, p, h.move, H3.Rules.heroMaxMove(h))); return o.type + '@' + o.x + ',' + o.y; });
  console.log('moving to', r1); await page.waitForTimeout(2500); await shot('move');
  // закрыть возможный диалог (сундук)
  await ev(() => { const b = document.querySelector('.modal .actions button, .choice button'); if (b) b.click(); }); await page.waitForTimeout(500);
  // 2. город
  await ev(() => { const G = H3.Game, S = H3.State; const t = S.townsOf(G.state, 0)[0]; G.openTown(t); }); await page.waitForTimeout(700); await shot('town');
  await ev(() => { const b = [...document.querySelectorAll('.tabs button')].find(x => x.textContent === 'Найм'); if (b) b.click(); }); await page.waitForTimeout(400); await shot('town_recruit');
  await ev(() => H3.UI.closeTop()); await page.waitForTimeout(300);
  // 3. герой
  await ev(() => { H3.Game.openHero(H3.Game.selected()); }); await page.waitForTimeout(600); await shot('hero');
  await ev(() => H3.UI.closeTop()); await page.waitForTimeout(300);
  // 4. бой с ближайшим стражем (ручной экран), потом авто
  const r4 = await ev(() => { const G = H3.Game, st = G.state; const h = G.selected(); const ms = Object.values(st.objects).filter(o => o.type === 'monster').sort((a, b) => Math.hypot(a.x - h.x, a.y - h.y) - Math.hypot(b.x - h.x, b.y - h.y)); const m = ms[0]; G.fight(h, { monster: m }); return m.cid + 'x' + m.n; });
  console.log('fight', r4); await page.waitForTimeout(1500); await shot('battle');
  // навести на врага для подсказки
  const hint = await ev(() => { const V = H3.BattleView.V, b = V.b; if (!b) return 'no battle'; const cur = H3.Battle.current(b); const foe = b.units.find(u => u.alive && u.side !== cur.side); const [x, y] = H3.U.Hex.center(foe.x, foe.y, V.size, V.ox, V.oy); const r = V.canvas.getBoundingClientRect(); return [r.left + x, r.top + y]; });
  if (Array.isArray(hint)) { await page.mouse.move(hint[0], hint[1]); await page.waitForTimeout(300); await shot('battle_hover'); }
  await ev(() => { const b = [...document.querySelectorAll('#battleBar button')].find(x => x.textContent.includes('Авто')); if (b) b.click(); });
  await page.waitForTimeout(6000); await shot('battle_result');
  await ev(() => H3.UI.closeTop()); await page.waitForTimeout(500);
  // уровни: закрыть диалоги выбора
  for (let i = 0; i < 3; i++) { await ev(() => { const b = document.querySelector('.choice button'); if (b) b.click(); }); await page.waitForTimeout(300); }
  await shot('after_battle');
  // 5. конец хода
  await ev(() => { H3.Game.settings().confirmEndTurn = false; H3.Game.endTurn(); }); await page.waitForTimeout(3000); await shot('day2');
  const info = await ev(() => { const st = H3.Game.state; return { day: st.day, gold: st.players[0].res.gold, think: st.players[1].aiThink, heroes: H3.State.heroesOf(st, 1).map(h => h.name + '@' + h.x + ',' + h.y) }; });
  console.log(JSON.stringify(info));
  console.log(errors.length ? errors.join('\n') : 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
