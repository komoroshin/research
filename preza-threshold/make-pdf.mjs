/* Renders the deck to a PDF, one slide per page, no cropping.
   Usage:  npm install  &&  npm run pdf
           npm run pdf -- --with-appendix
   Output: threshold-deck.pdf next to this file.

   By default the PDF holds the twelve numbered slides only. The appendix is
   left out: those slides carry a headline and nothing else, so in a file sent
   to a committee they read as blank pages. Pass --with-appendix when the
   appendix has real content.

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
    .map((s, i) => (s.blocks.filter((b) => b.type !== 'h1').length > 0 ? i : -1))
    .filter((i) => i >= 0),
}))

const pageRanges = withAppendix
  ? ''
  : [`1-${counts.main}`, ...counts.filled.map((i) => String(counts.main + i + 1))].join(',')

await page.pdf({
  path: out,
  width: '1920px',
  height: '1080px',
  printBackground: true,
  pageRanges,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})

const skipped = counts.appendix - counts.filled.length
console.log(
  withAppendix
    ? `Включено страниц: ${counts.main + counts.appendix} — все слайды и всё приложение.`
    : `Включено страниц: ${counts.main + counts.filled.length} — ${counts.main} слайдов и ${counts.filled.length} из приложения.` +
      (skipped
        ? ` Пропущено ${skipped}: у этих слайдов приложения нет содержимого, кроме заголовка, и в файле они читались бы как пустые. Нужны все: npm run pdf -- --with-appendix`
        : '')
)

await browser.close()
console.log(`PDF written: ${out}`)
