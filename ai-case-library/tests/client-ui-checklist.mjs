/**
 * Проверка клиентской версии каталога в реальном браузере.
 * Ожидает поднятый preview собранного client-app на http://localhost:4174/.
 *
 * Ключевые отличия от внутреннего чек-листа: путь заказчика (отрасль → кейс → CTA),
 * CTA «Хочу так же» (ссылка на Telegram + текст заявки в буфере) и отсутствие
 * внутренних полей в интерфейсе.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4174/';
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

// --- 1. Главная: плитки отраслей и дисклеймер ---
await page.goto(BASE, { waitUntil: 'networkidle' });
const tiles = await page.locator('.tile').count();
const disclaimer = await page.locator('.disclaimer').innerText();
check('главная: плитки отраслей', tiles >= 10, `${tiles} плиток`);
check(
  'дисклеймер про чужие кейсы виден',
  disclaimer.includes('не наше портфолио') && disclaimer.includes('открытых источников'),
  '',
);

// --- 2. Путь заказчика: отрасль -> список кейсов ---
const firstTileName = (await page.locator('.tile h3').first().innerText()).replace(/\d+\s*$/, '').trim();
await page.locator('.tile').first().click();
await page.waitForTimeout(400);
const heading = await page.locator('main h2').innerText();
const cards = await page.locator('.card').count();
check('клик по отрасли открывает её кейсы', heading === firstTileName && cards > 0, `«${heading}», ${cards} кейсов`);

// --- 3. Чипы процессов фильтруют ---
const chipText = await page.locator('.proc-chips .chip').first().innerText();
await page.locator('.proc-chips .chip').first().click();
await page.waitForTimeout(300);
const afterChip = await page.locator('.card').count();
const chipCount = Number(chipText.match(/(\d+)\s*$/)?.[1] ?? -1);
check('чип процесса фильтрует', afterChip === chipCount && afterChip > 0, `${chipText.trim()} -> ${afterChip}`);
await page.locator('.proc-chips .chip').first().click();
await page.waitForTimeout(200);

// --- 4. «Только с измеренным результатом» ---
const before = await page.locator('.card').count();
await page.locator('.proc-chips .chip', { hasText: 'только с измеренным' }).click();
await page.waitForTimeout(300);
const measured = await page.locator('.card').count();
check('фильтр measured сужает выборку', measured > 0 && measured <= before, `${before} -> ${measured}`);

// --- 5. Кейс — полноценная страница, результат первым экраном ---
await page.locator('.card').first().click();
await page.waitForTimeout(400);
const isPage = await page.locator('.case-page').isVisible();
const noDrawer = (await page.locator('.drawer').count()) === 0;
check('кейс открывается страницей, а не панелью', isPage && noDrawer, '');

const heroTile = page.locator('.metrics-hero .metric-tile').first();
const heroBox = (await heroTile.count()) ? await heroTile.boundingBox() : null;
check(
  'результат виден без скролла (metrics-hero в первом экране)',
  heroBox !== null && heroBox.y < 800,
  heroBox ? `y=${Math.round(heroBox.y)}` : 'метрик нет у первого кейса',
);

// innerText возвращает текст после CSS text-transform: uppercase — сравниваем без регистра.
const pageText = (await page.locator('.case-page').innerText()).toLowerCase();
check(
  'страница кейса: секции пути клиента',
  pageText.includes('какая была задача') &&
    pageText.includes('как это может выглядеть у вас') &&
    pageText.includes('оригинальный проект'),
  '',
);
check(
  'страница кейса: нет внутренней терминологии',
  !/sales relevance|entry|гипотеза входа|evidence grade|vendor_claim/i.test(pageText),
  '',
);

// --- 6. CTA в липкой колонке видна сразу; ссылка на Telegram и заявка в буфере ---
const cta = page.locator('.case-aside .cta-btn');
const ctaBox = await cta.boundingBox();
check('CTA видна без скролла (липкая колонка)', ctaBox !== null && ctaBox.y < 900, ctaBox ? `y=${Math.round(ctaBox.y)}` : '');
const ctaHref = await cta.getAttribute('href');
const ctaTarget = await cta.getAttribute('target');
await page.evaluate(() => {
  document.querySelectorAll('.cta-btn').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
});
await cta.click();
await page.waitForTimeout(300);
const clip = await page.evaluate(() => navigator.clipboard.readText());
check('CTA ведёт на t.me/kmoroshin в новой вкладке', ctaHref === 'https://t.me/kmoroshin' && ctaTarget === '_blank', ctaHref ?? '');
check('CTA кладёт заявку в буфер', clip.startsWith('Хочу так же:') && clip.includes('отрасль'), clip.slice(0, 60) + '…');

// --- 7. Ссылки на источники и навигация назад ---
const srcLink = page.locator('.case-page .sources a').first();
check(
  'источники: target=_blank + noopener',
  (await srcLink.getAttribute('target')) === '_blank' &&
    ((await srcLink.getAttribute('rel')) ?? '').includes('noopener'),
  '',
);
// Браузерная кнопка «назад» возвращает к списку — кейс ведёт себя как страница.
await page.goBack();
await page.waitForTimeout(400);
check(
  'браузерный «назад» закрывает кейс и возвращает список',
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
check('сравнение работает', cmpCols === 3, `${cmpCols - 1} кейса`);

// --- 9. Поиск ---
await page.click('.tabs button:has-text("Отрасли")');
await page.fill('.search input', 'документ');
await page.waitForTimeout(400);
const searchCards = await page.locator('.card').count();
check('поиск переводит в кейсы и находит', searchCards > 0, `«документ» -> ${searchCards}`);

// --- 10. URL-состояние восстанавливается ---
await page.goto(BASE + '?view=cases&industry=healthcare&measured=1', { waitUntil: 'networkidle' });
const restored = await page.locator('.card').count();
check('URL-состояние восстанавливается', restored > 0, `healthcare+measured -> ${restored}`);

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
console.log('  ЧЕК-ЛИСТ КЛИЕНТСКОЙ ВЕРСИИ');
console.log('='.repeat(74));
let failed = 0;
for (const r of results) {
  if (!r.passed) failed++;
  console.log(`${r.passed ? ' OK ' : 'FAIL'}  ${r.name.padEnd(46)} ${r.detail}`);
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
