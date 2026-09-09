// Квесты и ключи в браузере: спрайты, подсказки, диалоги провидца/заставы. node dev/questshot.js [dir]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=7&size=M&opp=2', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  // ставим все пять объектов рядом с героем, открываем карту вокруг
  await page.evaluate(() => {
    const st = H3.Game.state, S = H3.State, Q = H3.Quest, U = H3.U, h = H3.Game.selected();
    const m = st.levels[0];
    const put = (type, dx, dy, extra) => { const x = h.x + dx, y = h.y + dy; const old = S.objAt(st, x, y, 0); if (old) H3.Adventure.removeObject(st, old); m.obs[y * m.w + x] = 0; m.terrain[y * m.w + x] = H3.Rules.TERRAIN_INDEX.grass; const o = Object.assign({ id: st.nextId++, type, x, y, z: 0, visited: {} }, extra); st.objects[o.id] = o; m.objAt[y * m.w + x] = o.id; m.block[y * m.w + x] = 1; return o; };
    put('seer_hut', 3, -2, { quest: { kind: 'level', level: 1 }, reward: { kind: 'gold', amount: 2500 } });
    put('keymaster', -3, -2, { color: 'blue' });
    put('border_guard', 3, 2, { color: 'blue' });
    put('quest_guard', -3, 2, { quest: { kind: 'resources', res: 'wood', amount: 5 } });
    put('pandora_box', 0, 3, Q.randomPandora(new U.RNG(3), 1, 1));
    S.reveal(st, 0, h.x, h.y, 8, 2, 0);
    H3.AdvView.invalidate(); H3.Game.refresh(true);
    H3.AdvView.V.cam.z = 2; H3.AdvView.centerOn(h.x, h.y);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(dir, 'quest_map.png') });
  // подсказка при наведении на провидца
  const pos = await page.evaluate(() => { const V = H3.AdvView.V, h = H3.Game.selected(); const r = V.canvas.getBoundingClientRect(); return [r.left + ((h.x + 3 + 0.5) * 32 - V.cam.x) * V.cam.z, r.top + ((h.y - 2 + 0.5) * 32 - V.cam.y) * V.cam.z]; });
  await page.mouse.move(pos[0], pos[1]); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(dir, 'quest_tip.png') });
  // диалог провидца через движок: посещаем
  await page.evaluate(() => { window.__at = (dx, dy) => { const st = H3.Game.state, h = H3.Game.selected(); return H3.State.objAt(st, h.x + dx, h.y + dy, 0); }; });
  await page.evaluate(() => { H3.Game.handleStop(H3.Game.selected(), { kind: 'object', obj: window.__at(3, -2) }); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(dir, 'quest_seer.png') });
  console.log('диалог провидца:', (await page.evaluate(() => (document.querySelector('.modal') || {}).textContent || 'нет')).slice(0, 140));
  await page.evaluate(() => { const b = [...document.querySelectorAll('.modal button')].find(x => /награду/.test(x.textContent)); if (b) b.click(); });
  await page.waitForTimeout(400);
  console.log('золото после награды:', await page.evaluate(() => H3.Game.state.players[0].res.gold));
  // застава без ключа
  await page.evaluate(() => { H3.Game.handleStop(H3.Game.selected(), { kind: 'object', obj: window.__at(3, 2) }); });
  await page.waitForTimeout(400);
  console.log('застава:', (await page.evaluate(() => (document.querySelector('.modal') || {}).textContent || 'нет')).slice(0, 100));
  await page.evaluate(() => H3.UI.closeTop());
  // ключ, потом застава
  await page.evaluate(() => { H3.Game.handleStop(H3.Game.selected(), { kind: 'object', obj: window.__at(-3, -2) }); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { H3.Game.handleStop(H3.Game.selected(), { kind: 'object', obj: window.__at(3, 2) }); });
  await page.waitForTimeout(400);
  console.log('после ключа: ключи', await page.evaluate(() => JSON.stringify(H3.Game.state.players[0].keys)), 'застава у героя', await page.evaluate(() => !!window.__at(3, 2)));
  await page.screenshot({ path: path.join(dir, 'quest_opened.png') });
  // ящик Пандоры: диалог
  await page.evaluate(() => { H3.Game.handleStop(H3.Game.selected(), { kind: 'object', obj: window.__at(0, 3) }); });
  await page.waitForTimeout(400);
  console.log('пандора:', (await page.evaluate(() => (document.querySelector('.modal') || {}).textContent || 'нет')).slice(0, 120));
  await page.screenshot({ path: path.join(dir, 'quest_pandora.png') });
  await page.evaluate(() => H3.UI.closeTop());
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
