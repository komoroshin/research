// Живая карта: блики воды, погода по местности, дым, огни вечером. node dev/mapfxshot.js [dir]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=5&size=M&opp=2', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const open = () => page.evaluate(() => { const st = H3.Game.state; for (const v of st.players[0].vis) v.fill(2); H3.AdvView.invalidate(); H3.Game.refresh(true); });
  await open();
  // море: находим воду и центрируем
  const shown = await page.evaluate(() => {
    const st = H3.Game.state, m = st.levels[0], R = H3.Rules;
    let best = null, bc = 0;
    for (let y = 4; y < m.h - 4; y += 2) for (let x = 4; x < m.w - 4; x += 2) { let c = 0; for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (m.terrain[(y + dy) * m.w + x + dx] === R.TERRAIN_INDEX.water) c++; if (c > bc) { bc = c; best = [x, y]; } }
    if (best) { H3.AdvView.V.cam.z = 2; H3.AdvView.centerOn(best[0], best[1]); }
    return bc;
  });
  console.log('водных клеток в окне:', shown);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(dir, 'map_water.png') });
  // вечер: день 6 — огни в окнах; центр на город
  await page.evaluate(() => { const st = H3.Game.state; st.day = 6; const t = H3.State.townsOf(st, 0)[0]; H3.AdvView.setState(st); H3.AdvView.V.cam.z = 2.5; H3.AdvView.centerOn(t.x, t.y + 2); });
  await open();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(dir, 'map_evening.png') });
  console.log('частиц на карте:', await page.evaluate(() => H3.AdvView.V.fx.S.p.length));
  // снег/лава: находим зону
  for (const terr of ['snow', 'lava', 'swamp']) {
    const ok = await page.evaluate(t => {
      const st = H3.Game.state, m = st.levels[0], R = H3.Rules; const ti = R.TERRAIN_INDEX[t];
      let best = null, bc = 0;
      for (let y = 6; y < m.h - 6; y += 3) for (let x = 6; x < m.w - 6; x += 3) { let c = 0; for (let dy = -5; dy <= 5; dy++) for (let dx = -8; dx <= 8; dx++) if (m.terrain[(y + dy) * m.w + x + dx] === ti) c++; if (c > bc) { bc = c; best = [x, y]; } }
      if (bc < 40) return 0;
      st.day = 3; H3.AdvView.V.cam.z = 2; H3.AdvView.centerOn(best[0], best[1]); return bc;
    }, terr);
    if (!ok) { console.log(terr, ': нет на карте'); continue; }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(dir, 'map_' + terr + '.png') });
    console.log(terr, ': клеток', ok, 'частиц', await page.evaluate(() => H3.AdvView.V.fx.S.p.length));
  }
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
