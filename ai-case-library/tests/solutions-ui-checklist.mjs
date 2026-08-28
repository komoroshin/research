/**
 * Проверка каталога решений «AI под вашу задачу» в реальном браузере.
 * Ожидает поднятый preview собранного solutions-app на http://localhost:4176/.
 *
 * Смысловые проверки: путь «боль → направление → CTA», уверенный тон без
 * оговорок-дисклеймеров в теле направлений, ссылка на каталог реальных кейсов.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4176/';
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
  // Сетевые ошибки загрузки шрифтов игнорируем: песочница без интернета,
  // на живом сайте Google Fonts доступны.
  if (m.type() === 'error' && !/ERR_CONNECTION|Failed to load resource/.test(m.text()))
    errors.push('console: ' + m.text());
});

// --- 1. Главная: группы направлений и карточки-боли ---
await page.goto(BASE, { waitUntil: 'networkidle' });
const groups = await page.locator('.offer-group').count();
const cards = await page.locator('.card').count();
check('главная: группы направлений', groups >= 5, `${groups} групп`);
check('главная: карточки направлений', cards >= 14, `${cards} карточек`);

const heroText = (await page.locator('.hero').innerText()).toLowerCase();
check('hero говорит о проблеме клиента', heroText.includes('проблем'), '');

// Целевой сайт один: ссылок на внутренние каталоги быть не должно.
const internalLinks = await page
  .locator('a[href*="projects"], a[href*="catalog"], a[href*="cases"]')
  .count();
check('нет ссылок на внутренние каталоги', internalLinks === 0, `${internalLinks} ссылок`);

// Блок «Как проходит проект» — этапы с ретро-тестом.
const homeText = (await page.locator('main').innerText()).toLowerCase();
check(
  'блок «как проходит проект» с ретро-тестом',
  homeText.includes('как проходит проект') && homeText.includes('ретро-тест'),
  '',
);

// --- 2. Направление открывается страницей ---
await page.locator('.card').first().click();
await page.waitForTimeout(400);
check('направление открывается страницей', await page.locator('.case-page').isVisible(), '');

const offerText = (await page.locator('.case-page').innerText()).toLowerCase();
check(
  'страница направления: путь боль → решение → старт',
  offerText.includes('знакомая ситуация') &&
    offerText.includes('что мы сделаем') &&
    offerText.includes('с чего начнём'),
  '',
);
check(
  'уверенный тон: нет оговорок-дисклеймеров',
  !/реконструкция|допущение|гипотетич|не является офертой/.test(offerText),
  '',
);

// Ожидаемый результат — первым экраном.
const heroTile = await page.locator('.metrics-hero .metric-tile').first().boundingBox();
check('результат виден без скролла', heroTile !== null && heroTile.y < 800, heroTile ? `y=${Math.round(heroTile.y)}` : '');

// --- 3. CTA: липкая колонка, Telegram, буфер ---
const cta = page.locator('.case-aside .cta-btn');
const ctaBox = await cta.boundingBox();
check('CTA видна без скролла', ctaBox !== null && ctaBox.y < 900, ctaBox ? `y=${Math.round(ctaBox.y)}` : '');
const ctaHref = await cta.getAttribute('href');
await page.evaluate(() => {
  document.querySelectorAll('.cta-btn').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
});
await cta.click();
await page.waitForTimeout(300);
const clip = await page.evaluate(() => navigator.clipboard.readText());
check('CTA ведёт на t.me/kmoroshin', ctaHref === 'https://t.me/kmoroshin', ctaHref ?? '');
check('CTA кладёт заявку в буфер', clip.startsWith('Хочу обсудить:'), clip.slice(0, 60) + '…');

// --- 4. Навигация: «назад» и прямая ссылка ---
await page.goBack();
await page.waitForTimeout(400);
check(
  'браузерный «назад» возвращает к списку',
  (await page.locator('.case-page').count()) === 0 && (await page.locator('.card').count()) > 0,
  '',
);
await page.goto(BASE + '?offer=demand-forecast', { waitUntil: 'networkidle' });
const direct = (await page.locator('.case-page h2').innerText()).toLowerCase();
check('прямая ссылка ?offer= открывает направление', direct.includes('интуиции'), direct);

// Примеры рынка показаны без присвоения: «у других», а не «наши проекты».
const proofText = (await page.locator('.case-page').innerText()).toLowerCase();
check(
  'примеры рынка с цифрами, без присвоения',
  proofText.includes('уже работает у других') &&
    proofText.includes('2 млн') &&
    !proofText.includes('наши проекты') &&
    !proofText.includes('наши кейсы'),
  '',
);

// --- 5. Разрез по отраслям ---
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('.tabs button:has-text("По отраслям")');
await page.waitForTimeout(300);
const indTiles = await page.locator('.tile').count();
check('вкладка «По отраслям»: плитки отраслей', indTiles >= 8, `${indTiles} плиток`);

// Регрессия: длинные чипы-примеры не вылезают за границы плитки.
const overflowChips = await page.evaluate(() => {
  let bad = 0;
  for (const tile of document.querySelectorAll('.tile')) {
    const tr = tile.getBoundingClientRect();
    for (const tag of tile.querySelectorAll('.tag')) {
      const gr = tag.getBoundingClientRect();
      if (gr.right > tr.right + 1 || gr.left < tr.left - 1) bad++;
    }
  }
  return bad;
});
check('чипы примеров не вылезают из плиток', overflowChips === 0, `${overflowChips} переполнений`);

await page.locator('.tile', { hasText: 'Производство' }).first().click();
await page.waitForTimeout(400);
const indText = (await page.locator('main').innerText()).toLowerCase();
check(
  'страница отрасли: реальные результаты и направления',
  indText.includes('что уже получают компании отрасли') &&
    indText.includes('2 млн ₽') &&
    (await page.locator('.card').count()) >= 4,
  '',
);

// Направление открывается со страницы отрасли, «назад» возвращает в отрасль.
await page.locator('.card').first().click();
await page.waitForTimeout(400);
check('направление открывается из отрасли', await page.locator('.case-page').isVisible(), '');
await page.goBack();
await page.waitForTimeout(400);
check(
  '«назад» возвращает на страницу отрасли',
  (await page.locator('.case-page').count()) === 0 &&
    // innerText отдаёт текст после text-transform: uppercase — сравниваем без регистра
    (await page.locator('main').innerText()).toLowerCase().includes('что уже получают компании отрасли'),
  '',
);

// Прямая ссылка на отрасль.
await page.goto(BASE + '?view=industries&industry=healthcare', { waitUntil: 'networkidle' });
check(
  'прямая ссылка ?industry= открывает отрасль',
  (await page.locator('main h2').innerText()).includes('Медицина'),
  '',
);

// --- 6. Мобильная вёрстка ---
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
console.log('  ЧЕК-ЛИСТ КАТАЛОГА РЕШЕНИЙ');
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
