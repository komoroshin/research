// Проверка одностраничной деки: переполнение слайдов в режиме презентации,
// горизонтальный скролл на телефоне, ошибки консоли, запрещённые формулировки.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const file = process.argv[2];
if (!file) { console.error('usage: node deck-check.mjs <deck.html>'); process.exit(2); }
const url = pathToFileURL(file).href;

const BANNED = [
  /уникальн/i, /лучш(ий|ая|ее|ие) в мире/i, /глубок(ая|ой) экспертиз/i,
  /комплексн(ые|ое) решени/i, /индивидуальный подход/i, /богатый опыт/i,
  /гарантиру(ем|ю)/i, /инновацион/i, /ритейл/i, /лучшие практики/i,
  /мы предлагаем услуг/i, /давайте разберёмся/i, /спойлер/i,
];

const errors = [];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

// 1. запрещённые формулировки — по исходнику без base64
const src = readFileSync(file, 'utf8').replace(/base64,[A-Za-z0-9+/=]+/g, '');
for (const re of BANNED) {
  const m = src.match(re);
  if (m) errors.push(`запрещённая формулировка: «${m[0]}»`);
}

// 2. режим презентации: каждый слайд помещается в экран
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', m => { if (m.type() === 'error') errors.push(`консоль: ${m.text()}`); });
  page.on('pageerror', e => errors.push(`ошибка страницы: ${e.message}`));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const total = await page.locator('.slide').count();
  const deckMode = await page.evaluate(() => document.documentElement.classList.contains('deck'));
  if (!deckMode) errors.push('режим презентации не включился на широком экране');
  for (let i = 0; i < total; i++) {
    await page.evaluate(n => {
      document.querySelectorAll('.slide').forEach((s, k) =>
        k === n ? s.setAttribute('data-active', '') : s.removeAttribute('data-active'));
    }, i);
    await page.waitForTimeout(60);
    const over = await page.evaluate(n => {
      const s = document.querySelectorAll('.slide')[n];
      const b = s.querySelector('.body');
      const r = { v: s.scrollHeight - s.clientHeight, h: s.scrollWidth - s.clientWidth,
                  body: 0, clip: 0 };
      if (b) {
        // содержимое .body не должно превышать отведённую высоту: при центрировании
        // излишек уезжает вверх под заголовок и обычной проверкой скролла не виден
        r.body = b.scrollHeight - b.clientHeight;
        const br = b.getBoundingClientRect();
        let top = br.top;
        b.querySelectorAll('*').forEach(el => {
          const t = el.getBoundingClientRect().top;
          if (t < top) top = t;
        });
        r.clip = Math.round(br.top - top);
      }
      return r;
    }, i);
    if (over.v > 1) errors.push(`слайд ${i + 1}: текст не помещается по высоте (+${over.v}px)`);
    if (over.h > 1) errors.push(`слайд ${i + 1}: выходит за ширину (+${over.h}px)`);
    if (over.body > 1) errors.push(`слайд ${i + 1}: содержимое не влезает в тело слайда (+${over.body}px)`);
    if (over.clip > 1) errors.push(`слайд ${i + 1}: содержимое уехало под заголовок (${over.clip}px)`);
  }
  console.log(`слайдов: ${total}, режим презентации: ${deckMode}`);
  await page.close();
}

// 3. телефон: документ-режим, без горизонтального скролла
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => errors.push(`телефон, ошибка страницы: ${e.message}`));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => ({
    deck: document.documentElement.classList.contains('deck'),
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    first: (document.querySelector('h1') || {}).innerText || '',
  }));
  if (r.deck) errors.push('на телефоне включился режим презентации');
  if (r.over > 1) errors.push(`телефон: горизонтальный скролл (+${r.over}px)`);
  if (!r.first.trim()) errors.push('телефон: заголовок первого слайда пуст');
  console.log(`телефон: скролл по горизонтали ${r.over}px, заголовок «${r.first.replace(/\n/g, ' ')}»`);
  await page.close();
}

// 4. без скрипта: содержание читается
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  await page.goto(url, { waitUntil: 'load' });
  const visible = await page.locator('.slide h2').first().isVisible().catch(() => false);
  const h1 = await page.locator('h1').first().isVisible().catch(() => false);
  if (!h1) errors.push('без скрипта: титул не виден');
  if (!visible) errors.push('без скрипта: содержательные слайды не видны');
  console.log(`без скрипта: титул ${h1}, слайды ${visible}`);
  await page.close();
}

await browser.close();
if (errors.length) { console.error('\nНАЙДЕНО:\n' + errors.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log('\nпроверки пройдены');
