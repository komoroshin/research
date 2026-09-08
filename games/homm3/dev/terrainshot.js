// Крупный скриншот ландшафта сгенерированной карты: node dev/terrainshot.js [seed] [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const seed = process.argv[2] || '7', out = process.argv[3] || '/tmp/terrain.png';
  const size = process.argv[4] || 'S', opp = process.argv[5] || '1';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());   // не ждём внешние шрифты: недоступный CDN вешал прогон
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=' + seed + '&size=' + size + '&opp=' + opp, { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const st = H3.Game.state, cv = H3.Terrain.renderMap(st);
    // ищем участок с максимальным разнообразием местности
    const T = H3.Rules.TERRAINS, m = st.map; let best = null;
    for (let y = 0; y + 20 <= m.h; y += 2) for (let x = 0; x + 20 <= m.w; x += 2) {
      const s = new Set(); for (let j = 0; j < 20; j++) for (let i = 0; i < 20; i++) s.add(m.terrain[(y + j) * m.w + x + i]);
      if (!best || s.size > best.n) best = { x, y, n: s.size };
    }
    const o = document.createElement('canvas'); o.width = 20 * 32 * 2; o.height = 20 * 32 * 2;
    const c = o.getContext('2d'); c.imageSmoothingEnabled = false;
    c.drawImage(cv, best.x * 32, best.y * 32, 640, 640, 0, 0, 1280, 1280);
    document.body.innerHTML = ''; document.body.style.margin = '0'; document.body.appendChild(o);
    return best;
  });
  console.log('region', JSON.stringify(info));
  await page.screenshot({ path: out });
  console.log('saved', out, errors.join('\n'));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
