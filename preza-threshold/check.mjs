import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
const browser = await chromium.launch(
  existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
)
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('file:///home/user/research/preza-threshold/index.html', { waitUntil: 'networkidle' })

const at = () => page.evaluate(() => Number(document.querySelector('.canvas.is-current').dataset.index))
const say = (label, got, want) =>
  console.log(`${got === want ? '  ok  ' : ' FAIL '} ${label}: ${got} (want ${want})`)

say('opens on slide 1', await at(), 0)
for (let i = 0; i < 11; i++) await page.keyboard.press('ArrowRight')
say('arrow right reaches slide 12', await at(), 11)
await page.keyboard.press('ArrowRight')
say('paging past 12 does not enter the appendix', await at(), 11)
await page.keyboard.press('Space')
say('space past 12 does not enter the appendix', await at(), 11)
await page.keyboard.press('Home')
say('Home returns to slide 1', await at(), 0)
await page.keyboard.press('End')
say('End goes to slide 12', await at(), 11)
await page.keyboard.press('a')
say('A opens the appendix', await at(), 12)
await page.keyboard.press('1'); await page.keyboard.press('5'); await page.keyboard.press('Enter')
say('typing 15 + Enter goes to appendix 3', await at(), 14)
await page.keyboard.press('7'); await page.keyboard.press('Enter')
say('typing 7 + Enter goes to slide 7', await at(), 6)

// Presenter window: notes must exist there and nowhere else.
const [presenter] = await Promise.all([ctx.waitForEvent('page'), page.keyboard.press('p')])
await presenter.waitForLoadState('networkidle')
await page.keyboard.press('ArrowRight')
await presenter.waitForTimeout(400)
const notes = (await presenter.textContent('#notes')).trim()
console.log(`${notes.length > 0 ? '  ok  ' : ' FAIL '} presenter shows notes: "${notes.slice(0, 40)}…"`)
const where = await presenter.textContent('#where')
console.log(`${/8/.test(where) ? '  ok  ' : ' FAIL '} presenter follows the deck: "${where}"`)
const thumb = await presenter.evaluate(() => document.querySelector('#thumb .canvas') !== null)
console.log(`${thumb ? '  ok  ' : ' FAIL '} presenter renders the next-slide thumbnail`)
const leak = await page.evaluate(() =>
  document.body.innerText.includes('Заметки к восьмому слайду')
)
console.log(`${leak ? ' FAIL ' : '  ok  '} notes never appear on the main screen`)
await presenter.screenshot({ path: '/tmp/shots/deck-presenter.png' })

await browser.close()
