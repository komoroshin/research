/* Renders the deck to a PDF, one slide per page, no cropping.
   Usage:  npm install  &&  npm run pdf
           npm run pdf -- --with-appendix
   Output: threshold-deck.pdf next to this file.

   В PDF идут все нумерованные слайды и те слайды приложения, у которых есть
   содержимое кроме заголовка. Пропускаются два вида: пустые (в файле они
   читались бы как пустая страница) и помеченные `internal` — внутренние
   памятки, которым в присланном комитету файле не место. Флаг --with-appendix
   добавляет пустые, но не внутренние: те не попадают в PDF никогда.

   The deck itself needs no build and no npm — this script is the only thing
   that does, and only when the PDF has to be regenerated. */

import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const url = 'file://' + join(here, 'index.html')
const out = join(here, 'threshold-deck.pdf')

// The pre-installed browser lives outside node_modules in this environment;
// fall back to Playwright's own copy anywhere else.
const preinstalled = '/opt/pw-browsers/chromium'
const { existsSync } = await import('node:fs')
const browser = await chromium.launch(
  existsSync(preinstalled) ? { executablePath: preinstalled } : {}
)
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForFunction(() => document.querySelectorAll('.canvas').length > 0)

// Report any slide whose text does not fit at the minimum size. Per the brief,
// this is a content problem: nothing is shrunk to make it fit.
const overflows = await page.evaluate(() => window.deckOverflows())
if (overflows.length) {
  console.log('\nText does not fit on:')
  for (const o of overflows) console.log(`  slide ${o.slide} — over by ${o.overflowPx}px`)
  console.log('Fix the text, not the type size.\n')
} else {
  console.log('All slides fit at the minimum type size.')
}

const withAppendix = process.argv.includes('--with-appendix')
const counts = await page.evaluate(() => ({
  main: window.deckData.main.length,
  appendix: window.deckData.appendix.length,
  // Номера страниц приложения, у которых есть что показать помимо заголовка.
  filled: window.deckData.appendix
    .map((s, i) => (!s.internal && s.blocks.filter((b) => b.type !== 'h1').length > 0 ? i : -1))
    .filter((i) => i >= 0),
  // Внутренние слайды не печатаются ни при каком флаге.
  internal: window.deckData.appendix
    .map((s, i) => (s.internal ? i : -1))
    .filter((i) => i >= 0),
}))

const appendixPages = withAppendix
  ? [...Array(counts.appendix).keys()].filter((i) => !counts.internal.includes(i))
  : counts.filled
// Подстраховка: внутренний слайд не должен попасть в диапазон ни при какой
// комбинации флагов. Дешевле проверить здесь, чем найти его в присланном файле.
const leaked = appendixPages.filter((i) => counts.internal.includes(i))
if (leaked.length) {
  console.error(`ОШИБКА: внутренние слайды приложения попали в PDF: ${leaked.map((i) => 'A' + (i + 1)).join(', ')}`)
  process.exit(1)
}

const pageRanges = [`1-${counts.main}`, ...appendixPages.map((i) => String(counts.main + i + 1))].join(',')
console.log(`Страницы: ${pageRanges}`)

await page.pdf({
  path: out,
  width: '1920px',
  height: '1080px',
  printBackground: true,
  pageRanges,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})

const empty = counts.appendix - counts.filled.length - counts.internal.length
console.log(
  `Включено страниц: ${counts.main + appendixPages.length} — ${counts.main} слайдов и ` +
    `${appendixPages.length} из приложения.` +
    (counts.internal.length
      ? ` Не печатается ${counts.internal.length} со сметами: помечены internal, это внутренние памятки.`
      : '') +
    (!withAppendix && empty
      ? ` Пропущено ${empty} пустых: у них нет содержимого кроме заголовка. Нужны и они: npm run pdf -- --with-appendix`
      : '')
)

await browser.close()
console.log(`PDF written: ${out}`)
