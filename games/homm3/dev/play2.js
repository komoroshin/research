// Сценарий 2: оборона города от ИИ (ручной бой игрока как защитника), осада, левел-ап, книга заклинаний
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = '/tmp/claude-0/-home-user/a99ab51d-4089-5bf8-9571-78bcca32901c/scratchpad';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|fonts/.test(m.text())) errors.push('console: ' + m.text()); });
  const shot = async name => { await page.screenshot({ path: path.join(out, 'q_' + name + '.png') }); console.log('shot', name); };
  const ev = (fn, ...args) => page.evaluate(fn, ...args);
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=5&faction=tower', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  // 1. осада вражеского города игроком: телепортируем героя к городу ИИ и даём армию
  await ev(() => { const G = H3.Game, S = H3.State, st = G.state; const h = G.selected(); const tw = S.townsOf(st, 1)[0]; tw.buildings.citadel = true; tw.buildings.castle = true; H3.Rules.addToArmy(tw.garrison, 'pikeman', 30); H3.Rules.addToArmy(tw.garrison, 'archer', 12);
    h.army[3] = { cid: 'titan', n: 3 }; h.army[4] = { cid: 'naga', n: 5 }; h.hasBook = true; h.spells.push('fireball', 'slow', 'haste'); h.skills.fire = 2; h.mana = 60; h.x = tw.x; h.y = tw.y + 2; h.move = 2000; S.computeVisibility(st, 0); H3.AdvView.centerOn(h.x, h.y); G.refresh(true); });
  await page.waitForTimeout(400); await shot('before_siege');
  await ev(() => { const G = H3.Game, S = H3.State, st = G.state; const tw = S.townsOf(st, 1)[0]; G.fight(G.selected(), { town: tw }); });
  await page.waitForTimeout(1800); await shot('siege');
  // открыть книгу заклинаний в бою
  await ev(() => { const b = [...document.querySelectorAll('#battleBar button')].find(x => x.textContent.includes('Магия')); if (b) b.click(); });
  await page.waitForTimeout(500); await shot('siege_spellbook');
  await ev(() => H3.UI.closeTop()); await page.waitForTimeout(300);
  await ev(() => { const b = [...document.querySelectorAll('#battleBar button')].find(x => x.textContent.includes('Авто')); if (b) b.click(); });
  await page.waitForTimeout(9000); await shot('siege_end');
  for (let i = 0; i < 4; i++) { await ev(() => { const b = document.querySelector('.choice button') || document.querySelector('.modal .actions button'); if (b) b.click(); }); await page.waitForTimeout(400); }
  await shot('after_siege');
  const st1 = await ev(() => { const st = H3.Game.state; return { towns0: st.players[0].towns.length, towns1: st.players[1].towns.length, heroLvl: H3.Game.selected() && H3.Game.selected().level, winner: st.winner }; });
  console.log(JSON.stringify(st1));
  // 2. оборона: вражеский герой нападает на героя игрока (игрок защищается вручную → авто)
  await ev(() => { const G = H3.Game, S = H3.State, st = G.state; if (st.winner !== null) return; const me = G.selected(); const e = S.heroesOf(st, 1)[0]; if (!e) return; e.x = me.x + 1; e.y = me.y; e.move = 2000; H3.Rules.addToArmy(e.army, 'ogre', 20); const b = H3.Adventure.startBattle(st, e, { hero: me }); H3.BattleView.run(b, { human: [1] }).then(() => { H3.Adventure.endBattle(st); G.showScreen('adv'); G.refresh(true); }); });
  await page.waitForTimeout(1500); await shot('defend');
  await ev(() => { const b = [...document.querySelectorAll('#battleBar button')].find(x => x.textContent.includes('Авто')); if (b) b.click(); });
  await page.waitForTimeout(8000); await shot('defend_end');
  console.log(errors.length ? errors.join('\n') : 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
