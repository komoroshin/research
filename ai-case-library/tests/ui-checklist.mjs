/**
 * Проверка интерфейса по чек-листу п.61 ТЗ.
 * Каждый пункт проверяется через реальное взаимодействие, а не через чтение кода.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4173/';
const results = [];
const errors = [];

function check(name, passed, detail = '') {
  results.push({ name, passed, detail });
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text());
});

const count = async () => Number((await page.locator('.resultbar .count strong').innerText()).replace(/\s/g, ''));

// --- 1. Переключение отраслей ---
await page.goto(BASE + '?view=cards', { waitUntil: 'networkidle' });
const total = await count();
await page.locator('.fgroup', { hasText: 'Отрасль' }).first().locator('.check', { hasText: 'Здравоохранение' }).first().click();
await page.waitForTimeout(300);
const healthcare = await count();
check('переключаются отрасли', healthcare > 0 && healthcare < total, `${total} -> ${healthcare}`);

// --- 2. Комбинирование фильтров (отрасль + процесс) ---
await page.locator('.fgroup', { hasText: 'Бизнес-процесс' }).first().locator('.check').first().click();
await page.waitForTimeout(300);
const combo = await count();
check('комбинирование фильтров', combo <= healthcare, `отрасль ${healthcare} + процесс -> ${combo}`);

// --- 3. Переключение процессов независимо от отрасли ---
await page.goto(BASE + '?view=cards&business_process=predictive-maintenance', { waitUntil: 'networkidle' });
const pdm = await count();
check('переключаются процессы', pdm > 0 && pdm < total, `predictive-maintenance -> ${pdm}`);

// --- 4. Russia / Global ---
await page.goto(BASE + '?view=cards&region=russia-cis', { waitUntil: 'networkidle' });
const ru = await count();
await page.goto(BASE + '?view=cards', { waitUntil: 'networkidle' });
await page.click('text=Глобальные бенчмарки');
await page.waitForTimeout(400);
const global = await count();
check('работает Russia / Global', ru > 0 && global > 0 && ru + global === total, `RU ${ru} + Global ${global} = ${ru + global}, всего ${total}`);

// --- 5. Evidence filter ---
await page.goto(BASE + '?view=cards&evidence_grade=A', { waitUntil: 'networkidle' });
const gradeA = await count();
check('работает Evidence filter', gradeA > 0 && gradeA < total, `Grade A -> ${gradeA}`);

// --- 6. AI mechanism filter ---
await page.goto(BASE + '?view=cards&ai_mechanisms=computer-vision', { waitUntil: 'networkidle' });
const cv = await count();
check('работает AI mechanism filter', cv > 0 && cv < total, `computer-vision -> ${cv}`);

// --- 7. Полнотекстовый поиск (русский и английский) ---
await page.goto(BASE + '?view=cards', { waitUntil: 'networkidle' });
await page.fill('.search input', 'нейросеть');
await page.waitForTimeout(400);
const ruSearch = await count();
await page.fill('.search input', 'copilot');
await page.waitForTimeout(400);
const enSearch = await count();
check('полнотекстовый поиск RU+EN', ruSearch > 0 && enSearch > 0, `"нейросеть" -> ${ruSearch}, "copilot" -> ${enSearch}`);

// --- 8-10. Три представления ---
for (const [view, selector, label] of [
  ['cards', '.card', 'Cards View'],
  ['table', 'table.dense tbody tr', 'Table View'],
  ['matrix', 'table.matrix td.cell', 'Industry x Process Matrix'],
]) {
  await page.goto(`${BASE}?view=${view}`, { waitUntil: 'networkidle' });
  const n = await page.locator(selector).count();
  check(`есть ${label}`, n > 0, `${n} элементов`);
}

// --- 11. Клик по ячейке матрицы фильтрует ---
await page.goto(BASE + '?view=matrix', { waitUntil: 'networkidle' });
const cell = page.locator('table.matrix td.cell button:not([disabled])').first();
const cellTitle = await cell.getAttribute('title');
const expected = Number(cellTitle.match(/:\s*(\d+)\s*—/)?.[1] ?? -1);
await cell.click();
await page.waitForTimeout(400);
const afterCell = await count();
check('клик по ячейке Matrix фильтрует', afterCell === expected && afterCell > 0, `ожидалось ${expected}, получено ${afterCell}`);

// --- 12. Case Detail ---
await page.goto(BASE + '?view=cards', { waitUntil: 'networkidle' });
await page.locator('.card').first().click();
await page.waitForTimeout(400);
const drawerVisible = await page.locator('.drawer[role="dialog"]').isVisible();
const hasSalesLens = await page.locator('.section.sales').count();
const hasParties = await page.locator('.party').count();
check('работает Case Detail', drawerVisible && hasParties >= 3, `drawer ${drawerVisible}, ролей ${hasParties}, Sales Lens ${hasSalesLens}`);

// --- 13. Source links кликабельные и открываются в новой вкладке ---
const links = page.locator('.drawer .sources a, .drawer .metric .src a');
const linkCount = await links.count();
const firstHref = linkCount ? await links.first().getAttribute('href') : '';
const firstTarget = linkCount ? await links.first().getAttribute('target') : '';
const firstRel = linkCount ? await links.first().getAttribute('rel') : '';
check(
  'source links кликабельные, новая вкладка',
  linkCount > 0 && /^https?:\/\//.test(firstHref) && firstTarget === '_blank' && (firstRel || '').includes('noopener'),
  `ссылок ${linkCount}, target=${firstTarget}, rel=${firstRel}`,
);

// --- 14. Сравнение кейсов ---
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
for (let i = 0; i < 3; i++) {
  await page.locator('.card .pickbtn').nth(i).click();
  await page.waitForTimeout(120);
}
await page.click('.tabs button:has-text("Сравнение")');
await page.waitForTimeout(400);
const compareCols = await page.locator('table.compare thead th').count();
const compareRows = await page.locator('table.compare tbody tr').count();
check('можно сравнить кейсы', compareCols === 4 && compareRows > 5, `${compareCols - 1} кейса, ${compareRows} параметров`);

// --- 15. Экспорт выборки ---
await page.goto(BASE + '?view=cards&industry=healthcare', { waitUntil: 'networkidle' });
const expected2 = await count();
const dl = await Promise.all([
  page.waitForEvent('download', { timeout: 8000 }),
  page.click('button:has-text("Экспорт CSV")'),
]).then((r) => r[0]).catch(() => null);
let csvRows = -1;
if (dl) {
  const p = await dl.path();
  const fs = await import('node:fs');
  const text = fs.readFileSync(p, 'utf8');
  csvRows = text.split(/\r\n/).filter((l) => l.trim()).length - 1;
}
check('экспорт выборки CSV', dl !== null && csvRows === expected2, `в выборке ${expected2}, в файле ${csvRows} строк`);

// --- 16. Фильтры сохраняются в URL и восстанавливаются ---
// Сначала набираем фильтры кликами и смотрим, что записалось в URL,
// затем открываем этот URL заново — выборка обязана совпасть.
await page.goto(BASE + '?view=cards', { waitUntil: 'networkidle' });
await page.locator('.fgroup', { hasText: 'География' }).first().locator('.check', { hasText: 'Россия и СНГ' }).first().click();
await page.waitForTimeout(250);
await page.locator('.check', { hasText: 'Только с измеренным' }).first().click();
await page.waitForTimeout(350);
const beforeReload = await count();
const builtUrl = page.url();
await page.goto('about:blank');
await page.goto(builtUrl, { waitUntil: 'networkidle' });
const restored = await count();
const qs = new URL(builtUrl).search;
check(
  'фильтры в URL и восстановление',
  beforeReload > 0 && restored === beforeReload && qs.includes('region=russia-cis') && qs.includes('measured=1'),
  `${beforeReload} -> после перезагрузки ${restored}; ${qs}`,
);

// --- 17. Responsive: мобильный экран ---
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(BASE + '?view=matrix', { waitUntil: 'networkidle' });
const matrixHidden = await mobile.locator('.matrix-wrap').isVisible();
const listVisible = await mobile.locator('.matrix-list').isVisible();
const bodyScrollX = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
check('mobile: матрица -> список, нет гориз. скролла', !matrixHidden && listVisible && !bodyScrollX, `matrix ${matrixHidden}, list ${listVisible}, overflow ${bodyScrollX}`);
await mobile.close();

await browser.close();

// --- Итог ---
console.log('\n' + '='.repeat(74));
console.log('  ЧЕК-ЛИСТ ИНТЕРФЕЙСА (п.61 ТЗ)');
console.log('='.repeat(74));
let failed = 0;
for (const r of results) {
  if (!r.passed) failed++;
  console.log(`${r.passed ? ' OK ' : 'FAIL'}  ${r.name.padEnd(44)} ${r.detail}`);
}
console.log('='.repeat(74));
console.log(`Пройдено ${results.length - failed} из ${results.length}`);
if (errors.length) {
  console.log(`\nОшибки в консоли браузера (${errors.length}):`);
  for (const e of [...new Set(errors)].slice(0, 10)) console.log('  ' + e);
} else {
  console.log('Ошибок в консоли браузера нет.');
}
process.exit(failed || errors.length ? 1 : 0);
