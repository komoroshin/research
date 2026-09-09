// Экран города как картина: все фракции, день и вечер, призраки построек, наведение. node dev/townshot.js [dir]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 860 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const factions = ['castle', 'rampart', 'tower', 'inferno', 'necropolis', 'dungeon', 'stronghold', 'fortress'];
  for (let i = 0; i < factions.length; i++) {
    const f = factions[i];
    await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3&faction=' + f, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const full = i % 2 === 0;
    await page.evaluate(([full, day]) => {
      const st = H3.Game.state; const t = H3.State.townsOf(st, 0)[0]; st.day = day;
      const list = full ? ['tavern', 'market', 'blacksmith', 'silo', 'fort', 'citadel', 'castle', 'guild_1', 'guild_2', 'guild_3', 'hall_2', 'hall_3', 'dwell_1', 'dwell_2', 'dwell_3', 'dwell_4', 'dwell_5', 'dwell_6', 'dwell_7', 'dwell_up_1', 'dwell_up_3'] : ['fort', 'dwell_2', 'guild_1'];
      for (const b of list) t.buildings[b] = true;
      st.players[0].res.gold = 30000;
      H3.Game.openTown(t);
    }, [full, i === 1 || i === 4 ? 6 : i === 5 ? 7 : 3]);
    await page.waitForTimeout(1200);
    // наводим на первую призрачную постройку (или на ратушу)
    await page.evaluate(() => { const sc = H3.TownView; const c = document.querySelector('#townPic'); const r = c.getBoundingClientRect(); window.__pic = [r.left, r.top, r.width, r.height]; });
    const r = await page.evaluate(() => window.__pic);
    const target = await page.evaluate(() => { const V = document.querySelector('#townPic'); const scene = H3.TownScene; void V; return null; });
    void target;
    await page.mouse.move(r[0] + r[2] * (480 / 960), r[1] + r[3] * (230 / 400)); await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(dir, 'town_' + f + '.png') });
    const info = await page.evaluate(() => { const items = []; const modal = document.querySelector('.modal'); return { modal: !!modal, tip: (document.querySelector('#tip') || {}).textContent }; });
    console.log(f, JSON.stringify(info));
  }
  // клик по призраку строит
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3&faction=castle', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.evaluate(() => { const st = H3.Game.state; const t = H3.State.townsOf(st, 0)[0]; st.players[0].res.gold = 30000; st.players[0].res.wood = 50; H3.Game.openTown(t); });
  await page.waitForTimeout(600);
  const before = await page.evaluate(() => Object.keys(H3.State.townsOf(H3.Game.state, 0)[0].buildings).join(','));
  const r = await page.evaluate(() => { const c = document.querySelector('#townPic'); const b = c.getBoundingClientRect(); const L = H3.TownScene.LAYOUT.market; return [b.left + b.width * L[0] / 960, b.top + b.height * (L[1] - 20) / 400]; });
  await page.mouse.click(r[0], r[1]); await page.waitForTimeout(400);
  console.log('диалог:', (await page.evaluate(() => { const ms = document.querySelectorAll('.modal'); return ms[ms.length - 1].textContent; })).slice(0, 80));
  await page.evaluate(() => { const b = [...document.querySelectorAll('.modal button')].find(x => x.textContent === 'Построить'); if (b) b.click(); });
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => Object.keys(H3.State.townsOf(H3.Game.state, 0)[0].buildings).join(','));
  console.log('до:', before, '| после:', after);
  await page.screenshot({ path: path.join(dir, 'town_built.png') });
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
