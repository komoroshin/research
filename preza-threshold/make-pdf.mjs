/* Renders the deck to a PDF, one slide per page, no cropping.
   Usage:  npm install  &&  npm run pdf
   Output: threshold-deck.pdf next to this file.

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

await page.pdf({
  path: out,
  width: '1920px',
  height: '1080px',
  printBackground: true,
  pageRanges: '',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})

await browser.close()
console.log(`PDF written: ${out}`)
