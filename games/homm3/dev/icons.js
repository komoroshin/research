// Иконки PWA из спрайта города: node dev/icons.js — пишет icons/icon-192.png, icon-512.png, icon-512-maskable.png
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 600, height: 600 } });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'load' });
  await page.waitForTimeout(500);
  for (const [size, name, pad] of [[192, 'icon-192.png', 0.08], [512, 'icon-512.png', 0.08], [512, 'icon-512-maskable.png', 0.2]]) {
    const dataUrl = await page.evaluate(([size, pad]) => {
      const cv = document.createElement('canvas'); cv.width = size; cv.height = size; const ctx = cv.getContext('2d');
      const g = ctx.createLinearGradient(0, 0, 0, size); g.addColorStop(0, '#4a3418'); g.addColorStop(1, '#120c07'); ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#b8912f'; ctx.lineWidth = size * 0.03; ctx.strokeRect(size * 0.04, size * 0.04, size * 0.92, size * 0.92);
      ctx.imageSmoothingEnabled = false;
      const sp = H3.Sprites.render('town_castle', 1, false);
      const inner = size * (1 - 2 * pad), s = Math.floor(inner / Math.max(sp._w, sp._h));
      ctx.drawImage(sp, Math.round((size - sp._w * s) / 2), Math.round((size - sp._h * s) / 2) + size * 0.02, sp._w * s, sp._h * s);
      return cv.toDataURL('image/png');
    }, [size, pad]);
    fs.writeFileSync(path.join('icons', name), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('icon', name);
  }
  await br.close();
})();
