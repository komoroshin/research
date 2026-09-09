// Мобильный аудит: все экраны на iPhone-размере (390×844), тач. node dev/mobileshot.js [dir]
const { chromium, devices } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await br.newContext({ ...devices['iPhone 13'], locale: 'ru-RU' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const shot = async name => { console.log('shot', name); await page.screenshot({ path: path.join(dir, 'm_' + name + '.png') }); };
  await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'load' });
  await page.waitForTimeout(700); await shot('menu');
  await page.tap('#btnNew', { timeout: 4000 }); await page.waitForTimeout(400); await shot('newgame');
  await page.tap('#btnBack', { timeout: 4000 }); await page.tap('#btnCamp', { timeout: 4000 }); await page.waitForTimeout(400); await shot('campaign');
  await page.tap('#campBack', { timeout: 4000 }); await page.tap('#btnMaps', { timeout: 4000 }); await page.waitForTimeout(300); await page.tap('#mapNew', { timeout: 4000 }); await page.waitForTimeout(300);
  await page.tap('.choice button', { timeout: 4000 }); await page.waitForTimeout(300); await page.tap('.choice button', { timeout: 4000 }); await page.waitForTimeout(600); await shot('editor');
  await page.evaluate(() => H3.Game.menu());
  // партия
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3', { waitUntil: 'load' });
  await page.waitForTimeout(900); await shot('map');
  // тап по клетке рядом с героем: первый тап — путь
  const pos = await page.evaluate(() => { const V = H3.AdvView.V, h = H3.Game.selected(); const r = V.canvas.getBoundingClientRect(); return [r.left + ((h.x + 3 + 0.5) * 32 - V.cam.x) * V.cam.z, r.top + ((h.y + 0.5) * 32 - V.cam.y) * V.cam.z]; });
  await page.touchscreen.tap(pos[0], pos[1]); await page.waitForTimeout(400); await shot('map_tap');
  await page.evaluate(() => { const st = H3.Game.state; const t = H3.State.townsOf(st, 0)[0]; for (const b of ['tavern', 'market', 'fort', 'dwell_2', 'guild_1']) t.buildings[b] = true; H3.Game.openTown(t); });
  await page.waitForTimeout(900); await shot('town');
  // тап по призраку постройки — карточка действий
  const gpos = await page.evaluate(() => { const c = document.querySelector('#townPic'), w = document.querySelector('#townPicWrap'); const r = c.getBoundingClientRect(); const L = H3.TownScene.LAYOUT.blacksmith; const x = r.left + r.width * L[0] / 960, y = r.top + r.height * (L[1] - 20) / 400; return [x, y, w.scrollLeft]; });
  console.log('кузница на экране:', Math.round(gpos[0]), Math.round(gpos[1]));
  await page.touchscreen.tap(gpos[0], gpos[1]); await page.waitForTimeout(500);
  console.log('карточка:', (await page.evaluate(() => { const ms = document.querySelectorAll('.modal'); return ms.length > 1 ? ms[ms.length - 1].textContent : 'нет'; })).slice(0, 120));
  await shot('town_sheet');
  await page.evaluate(() => { const b = [...document.querySelectorAll('.modal .choice button')].find(x => /Построить/.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(400);
  await page.evaluate(() => { const b = [...document.querySelectorAll('.modal button')].find(x => x.textContent === 'Построить'); if (b) b.click(); }); await page.waitForTimeout(500);
  console.log('построено:', await page.evaluate(() => Object.keys(H3.State.townsOf(H3.Game.state, 0)[0].buildings).join(',')));
  await page.evaluate(() => { H3.UI.closeTop(); H3.UI.closeTop(); }); await page.waitForTimeout(300);
  await page.evaluate(() => { H3.Game.openHero(H3.Game.selected()); }); await page.waitForTimeout(600); await shot('hero');
  await page.evaluate(() => H3.UI.closeTop()); await page.waitForTimeout(200);
  await page.evaluate(() => { const G = H3.Game, U = H3.U; const att = { hero: G.selected(), army: [{ cid: 'pikeman', n: 20 }, { cid: 'archer', n: 10 }, { cid: 'griffin', n: 4 }], player: 0 }; const def = { army: [{ cid: 'goblin', n: 30 }, { cid: 'wolf_rider', n: 8 }], player: 1, name: 'Стражи' }; H3.BattleView.run(H3.Battle.create(att, def, { rng: new U.RNG(1), terrain: 'grass' }), { human: [0] }); });
  await page.waitForTimeout(1200); await shot('battle');
  console.log('бой:', await page.evaluate(() => { const V = H3.BattleView.V; return JSON.stringify({ size: V.size, cw: V.cw, ch: V.ch, worldW: V.worldW, z: +V.cam.z.toFixed(2), zFit: +V.zFit.toFixed(2) }); }));
  // двойной тап по достижимой клетке — отряд идёт туда (первый тап показывает, второй подтверждает)
  const mv = await page.evaluate(() => { const V = H3.BattleView.V, b = V.b; const cur = H3.Battle.current(b); const reach = V.reach || H3.Battle.reachable(b, cur); let best = null; for (const r of reach.hexes.values()) if (!best || r.cost > best.cost) best = r; const [x, y] = H3.U.Hex.center(best.x, best.y, V.size, V.ox, V.oy); V.cam.x = Math.max(0, Math.min(V.worldW - V.cw, x - V.cw / 2)); const rc = V.canvas.getBoundingClientRect(); return [rc.left + (x - V.cam.x) * V.cam.z, rc.top + (y - V.cam.y) * V.cam.z, cur.cid, cur.x, cur.y, best.x, best.y]; });
  console.log('текущий', mv[2], 'из', mv[3], mv[4], 'в', mv[5], mv[6]);
  await page.touchscreen.tap(mv[0], mv[1]); await page.waitForTimeout(300); await shot('battle_tap1');
  await page.touchscreen.tap(mv[0], mv[1]); await page.waitForTimeout(1200); await shot('battle_tap2');
  console.log('после двух тапов:', await page.evaluate(cid => { const b = H3.BattleView.V.b; const u = b.units.find(x => x.cid === cid && x.side === 0); return u.x + ',' + u.y; }, mv[2]), '| лог:', await page.evaluate(() => H3.BattleView.V.logLines.slice(-2).join(' / ')));
  // долгое нажатие по своему отряду — карточка
  const own = await page.evaluate(() => { const V = H3.BattleView.V, b = V.b; const u = b.units.find(x => x.side === 0 && x.alive); const p = V.pos[u.id]; const r = V.canvas.getBoundingClientRect(); return [r.left + (p.x - V.cam.x) * V.cam.z, r.top + (p.y - V.cam.y) * V.cam.z]; });
  await page.evaluate(([x, y]) => { const c = document.querySelector('#battleCanvas'); const r = c.getBoundingClientRect(); const ev = t => new PointerEvent(t, { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y, bubbles: true }); const d = ev('pointerdown'); Object.defineProperty(d, 'offsetX', { value: x - r.left }); Object.defineProperty(d, 'offsetY', { value: y - r.top }); c.dispatchEvent(d); }, own);
  await page.waitForTimeout(700);
  console.log('долгое нажатие:', (await page.evaluate(() => (document.querySelector('.modal') || {}).textContent || 'нет окна')).slice(0, 60));
  await page.evaluate(([x, y]) => { const c = document.querySelector('#battleCanvas'); c.dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y, bubbles: true })); H3.UI.closeTop(); }, own);
  await shot('battle_info');
  await page.evaluate(() => { H3.BattleView.V.b.over = true; }); await page.waitForTimeout(800);
  await page.evaluate(() => H3.UI.closeTop()); await page.waitForTimeout(300);
  await page.evaluate(() => { H3.Game.openMenu(); }); await page.waitForTimeout(400); await shot('gamemenu');
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
