// Скриншот боя с боевыми машинами: node dev/machineshot.js [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || '/tmp/mach.png';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const G = H3.Game, U = H3.U, h = G.selected();
    h.skills = Object.assign({}, h.skills, { artillery: 2, first_aid: 3 });
    h.machines = { ballista: true, first_aid_tent: true, ammo_cart: true };
    const att = { hero: h, army: [{ cid: 'pikeman', n: 40 }, { cid: 'archer', n: 20 }, { cid: 'swordsman', n: 15 }], player: 0 };
    const def = { army: [{ cid: 'goblin', n: 50 }, { cid: 'orc', n: 25 }, { cid: 'wolf_rider', n: 20 }], player: 1, name: 'Орда' };
    const bt = H3.Battle.create(att, def, { rng: new U.RNG(5), terrain: 'grass' });
    H3.BattleView.run(bt, { human: [0] });
    return bt.units.filter(u => H3.Creatures.get(u.cid).machine).map(u => u.cid + '@' + u.x + ',' + u.y);
  });
  console.log('машины:', info.join(' '));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: out });
  // автобой до конца — проверяем, что машины отрабатывают без ошибок
  await page.evaluate(() => { const b = [...document.querySelectorAll('#battleBar button')].find(x => x.textContent.includes('Авто')); if (b) b.click(); });
  await page.waitForTimeout(9000);
  await page.screenshot({ path: out.replace('.png', '_end.png') });
  console.log('итог:', await page.evaluate(() => { const b = H3.BattleView.V.b; return b ? 'идёт, раунд ' + b.round : 'бой завершён'; }));
  console.log(errs.join('\n') || 'no errors');
  await br.close();
})();
