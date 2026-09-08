// Скриншот боя с крупными существами: node dev/bigshot.js [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || '/tmp/big.png';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const G = H3.Game, U = H3.U;
    const att = { hero: G.selected(), army: [{ cid: 'cavalier', n: 9 }, { cid: 'archer', n: 40 }, { cid: 'green_dragon', n: 4 }, { cid: 'pikeman', n: 60 }, { cid: 'unicorn', n: 6 }], player: 0 };
    const def = { army: [{ cid: 'hydra', n: 5 }, { cid: 'medusa', n: 16 }, { cid: 'wolf_rider', n: 30 }, { cid: 'behemoth', n: 4 }, { cid: 'black_knight', n: 7 }], player: 1, name: 'Стражи' };
    const bt = H3.Battle.create(att, def, { rng: new U.RNG(11), terrain: 'grass' });
    H3.BattleView.run(bt, { human: [0] });
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: out });
  // навести на крупного врага, чтобы увидеть подсказку и рамку атаки
  await page.evaluate(() => {
    const V = H3.BattleView.V, b = V.b; const foe = b.units.find(u => u.side === 1 && H3.Battle.isBig(u));
    const [x, y] = H3.U.Hex.center(foe.x, foe.y, V.size, V.ox, V.oy); const r = V.canvas.getBoundingClientRect();
    window.__h = [r.left + x, r.top + y];
  });
  const h = await page.evaluate(() => window.__h);
  await page.mouse.move(h[0], h[1]); await page.waitForTimeout(400);
  await page.screenshot({ path: out.replace('.png', '_hover.png') });
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
