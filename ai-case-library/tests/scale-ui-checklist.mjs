/**
 * Проверка каталога «проекты вашего масштаба» в реальном браузере.
 * Ожидает поднятый preview собранного scale-app на http://localhost:4175/.
 *
 * Ключевые отличия от клиентского чек-листа: фильтр по бюджетной вилке,
 * обезличенность (ни ссылок на источники, ни имён студий/площадок-URL в DOM)
 * и паспорт проекта с бюджетом и сроками.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4175/';
const results = [];
const errors = [];
const check = (name, passed, detail = '') => results.push({ name, passed, detail });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text());
});

// --- 1. Главная: плитки отраслей и дисклеймер про обезличенность ---
await page.goto(BASE, { waitUntil: 'networkidle' });
const tiles = await page.locator('.tile').count();
const disclaimer = await page.locator('.disclaimer').innerText();
check('главная: плитки отраслей', tiles >= 8, `${tiles} плиток`);
check(
  'дисклеймер: обезличенность и «не портфолио»',
  disclaimer.includes('обезличены') && disclaimer.includes('не наше портфолио'),
  '',
);

// --- 2. Путь заказчика: отрасль -> список кейсов ---
const firstTileName = (await page.locator('.tile h3').first().innerText()).replace(/\d+\s*$/, '').trim();
await page.locator('.tile').first().click();
await page.waitForTimeout(400);
const heading = await page.locator('main h2').innerText();
const cards = await page.locator('.card').count();
check('клик по отрасли открывает её кейсы', heading === firstTileName && cards > 0, `«${heading}», ${cards} кейсов`);

// --- 3. Фильтр по бюджетной вилке ---
const before = await page.locator('.card').count();
await page.locator('.proc-chips .chip', { hasText: 'бюджет $50–200' }).click();
await page.waitForTimeout(300);
const afterBudget = await page.locator('.card').count();
check('чип бюджета фильтрует', afterBudget > 0 && afterBudget <= before, `${before} -> ${afterBudget}`);
await page.locator('.proc-chips .chip', { hasText: 'бюджет $50–200' }).click();
await page.waitForTimeout(200);

// --- 4. «Только с цифрами результата» ---
await page.locator('.proc-chips .chip', { hasText: 'только с цифрами' }).click();
await page.waitForTimeout(300);
const withNumbers = await page.locator('.card').count();
check('фильтр «с цифрами» сужает выборку', withNumbers > 0 && withNumbers <= before, `${before} -> ${withNumbers}`);

// --- 5. Кейс — страница; бюджет и сроки в паспорте ---
await page.locator('.card').first().click();
await page.waitForTimeout(400);
check('кейс открывается страницей', await page.locator('.case-page').isVisible(), '');

const pageText = (await page.locator('.case-page').innerText()).toLowerCase();
check(
  'страница кейса: секции и паспорт проекта',
  pageText.includes('какая была задача') &&
    pageText.includes('паспорт проекта') &&
    pageText.includes('бюджет') &&
    pageText.includes('откуда этот кейс'),
  '',
);
check(
  'страница кейса: плашка происхождения вместо ссылок',
  /верифицированный отзыв клиента|публичный разбор проекта/.test(pageText),
  '',
);

// --- 6. Обезличенность: единственные внешние ссылки — CTA в Telegram ---
const extLinks = await page.locator('.case-page a[target="_blank"]').evaluateAll((as) =>
  as.map((a) => a.getAttribute('href')),
);
check(
  'обезличенность: нет внешних ссылок кроме Telegram',
  extLinks.length > 0 && extLinks.every((h) => h === 'https://t.me/kmoroshin'),
  extLinks.join(', ') || 'ссылок нет',
);
const domHtml = await page.content();
check(
  'обезличенность: нет URL источников в DOM',
  !/clutch\.co|workspace\.ru|habr\.com|riverstart/i.test(domHtml),
  '',
);

// --- 7. CTA в липкой колонке; Telegram + заявка в буфере ---
const cta = page.locator('.case-aside .cta-btn');
const ctaBox = await cta.boundingBox();
check('CTA видна без скролла (липкая колонка)', ctaBox !== null && ctaBox.y < 900, ctaBox ? `y=${Math.round(ctaBox.y)}` : '');
await page.evaluate(() => {
  document.querySelectorAll('.cta-btn').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
});
await cta.click();
await page.waitForTimeout(300);
const clip = await page.evaluate(() => navigator.clipboard.readText());
check('CTA кладёт заявку в буфер', clip.startsWith('Хочу так же:') && clip.includes('отрасль'), clip.slice(0, 60) + '…');

// Браузерная кнопка «назад» возвращает к списку.
await page.goBack();
await page.waitForTimeout(400);
check(
  'браузерный «назад» закрывает кейс',
  (await page.locator('.case-page').count()) === 0 && (await page.locator('.card').count()) > 0,
  '',
);

// --- 8. Сравнение ---
for (let i = 0; i < 2; i++) {
  await page.locator('.card .pickbtn').nth(i).click();
  await page.waitForTimeout(120);
}
await page.click('.tabs button:has-text("Сравнение")');
await page.waitForTimeout(300);
const cmpCols = await page.locator('table.compare thead th').count();
const cmpText = (await page.locator('table.compare').innerText()).toLowerCase();
check('сравнение работает и показывает бюджет', cmpCols === 3 && cmpText.includes('бюджет'), `${cmpCols - 1} кейса`);

// --- 9. Поиск ---
await page.click('.tabs button:has-text("Отрасли")');
await page.fill('.search input', 'прогноз');
await page.waitForTimeout(400);
const searchCards = await page.locator('.card').count();
check('поиск переводит в кейсы и находит', searchCards > 0, `«прогноз» -> ${searchCards}`);

// --- 10. URL-состояние восстанавливается ---
await page.goto(BASE + '?view=cases&industry=healthcare&budget=usd_200k_1m', { waitUntil: 'networkidle' });
const restored = await page.locator('.card').count();
check('URL-состояние восстанавливается', restored > 0, `healthcare+200k-1m -> ${restored}`);

// --- 11. Мобильная вёрстка ---
const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto(BASE, { waitUntil: 'networkidle' });
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check('mobile: нет горизонтального скролла', !overflow, '');
await mobile.close();

await browser.close();

console.log('\n' + '='.repeat(74));
console.log('  ЧЕК-ЛИСТ КАТАЛОГА «ПРОЕКТЫ ВАШЕГО МАСШТАБА»');
console.log('='.repeat(74));
let failed = 0;
for (const r of results) {
  if (!r.passed) failed++;
  console.log(`${r.passed ? ' OK ' : 'FAIL'}  ${r.name.padEnd(48)} ${r.detail}`);
}
console.log('='.repeat(74));
console.log(`Пройдено ${results.length - failed} из ${results.length}`);
if (errors.length) {
  console.log(`\nОшибки в консоли (${errors.length}):`);
  for (const e of [...new Set(errors)].slice(0, 10)) console.log('  ' + e);
} else {
  console.log('Ошибок в консоли браузера нет.');
}
process.exit(failed || errors.length ? 1 : 0);
