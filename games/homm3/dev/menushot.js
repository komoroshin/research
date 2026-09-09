// Экраны меню на телефоне и десктопе: главное меню, новая игра (верх/низ, сохранение прокрутки), кампания, свои карты, загрузка, настройки. node dev/menushot.js [dir]
const { chromium, devices } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errs = [];
  const mk = async (opts, tag) => { const ctx = await br.newContext({ ...opts, locale: 'ru-RU' }); const page = await ctx.newPage(); page.on('pageerror', e => errs.push(tag + ': ' + e.message)); await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); return page; };
  const root = 'file://' + path.resolve(__dirname, '..', 'index.html');
  const page = await mk(devices['iPhone 13'], 'phone');
  const shot = async name => { console.log('shot', name); await page.screenshot({ path: path.join(dir, 'm_' + name + '.png') }); };
  await page.goto(root, { waitUntil: 'load' }); await page.waitForTimeout(600); await shot('menu');
  console.log('сцена меню рисуется:', await page.evaluate(() => { const c = document.querySelector('#menuArt'); if (!c) return false; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4 * 97) if (d[i]) n++; return n > 100; }));
  await page.tap('#btnSet'); await page.waitForTimeout(300); await shot('settings'); await page.evaluate(() => H3.UI.closeTop());
  await page.tap('#btnLoad'); await page.waitForTimeout(300); await shot('load'); await page.evaluate(() => H3.UI.closeTop());
  await page.tap('#btnNew'); await page.waitForTimeout(300); await shot('newgame');
  await page.evaluate(() => { document.querySelector('.mbody').scrollTop = 99999; }); await page.tap('.more summary'); await page.waitForTimeout(200);
  await page.evaluate(() => { document.querySelector('.mbody').scrollTop = 99999; }); await page.waitForTimeout(200);
  const before = await page.evaluate(() => document.querySelector('.mbody').scrollTop);
  await page.evaluate(() => { [...document.querySelectorAll('[data-k=hero]')][2].click(); }); await page.waitForTimeout(200);
  const after = await page.evaluate(() => document.querySelector('.mbody').scrollTop);
  console.log('прокрутка до/после выбора героя:', before, after, before === after ? 'ok' : 'ПРЫГНУЛА');
  await shot('newgame_bottom');
  await page.tap('#btnBack'); await page.tap('#btnCamp'); await page.waitForTimeout(300); await shot('campaign');
  await page.tap('#campBack'); await page.tap('#btnMaps'); await page.waitForTimeout(300); await shot('maps');
  await page.tap('#mapBack'); await page.tap('#btnNew'); await page.tap('#btnStart'); await page.waitForTimeout(1500);
  console.log('после старта экран:', await page.evaluate(() => H3.Game.G.screen), '| сцена меню убрана:', await page.evaluate(() => !document.querySelector('#menuArt')));
  await page.evaluate(() => { H3.Game.menu(); }); await page.waitForTimeout(400); await shot('menu_continue');
  console.log('«Продолжить»:', await page.evaluate(() => (document.querySelector('#btnCont') || {}).textContent || 'нет'));
  // десктоп — та же оболочка карточкой по центру
  const dp = await mk({ viewport: { width: 1280, height: 800 } }, 'desktop');
  await dp.goto(root, { waitUntil: 'load' }); await dp.waitForTimeout(500); await dp.screenshot({ path: path.join(dir, 'd_menu.png') });
  await dp.click('#btnNew'); await dp.waitForTimeout(300); await dp.screenshot({ path: path.join(dir, 'd_newgame.png') });
  await dp.click('#btnBack'); await dp.click('#btnCamp'); await dp.waitForTimeout(300); await dp.screenshot({ path: path.join(dir, 'd_campaign.png') });
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
