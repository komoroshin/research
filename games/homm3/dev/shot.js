// Скриншот страницы через Playwright (dev). usage: node dev/shot.js <url-or-file> <out.png> [width] [height] [js-to-eval-before-shot]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [,, target, out, w = '1280', h = '800', evalJs = ''] = process.argv;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  const url = target.startsWith('http') ? target : 'file://' + require('path').resolve(target);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  if (evalJs) { try { const r = await page.evaluate(evalJs); if (r !== undefined) console.log('EVAL:', JSON.stringify(r).slice(0, 2000)); } catch (e) { errors.push('EVALERR: ' + e.message); } await page.waitForTimeout(400); }
  await page.screenshot({ path: out });
  console.log('saved', out);
  if (errors.length) console.log(errors.join('\n'));
  await browser.close();
})();
