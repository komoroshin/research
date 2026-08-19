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

// Количество слайдов читается из самой презентации: версия 2 длиннее версии 1,
// и тест не должен требовать правки при каждом добавлении слайда.
const main = await page.evaluate(() => window.deckData.main.length)
const appendix = await page.evaluate(() => window.deckData.appendix.length)
const internal = await page.evaluate(() => window.deckData.all.filter((s) => s.internal).length)
const last = main - 1

say('opens on slide 1', await at(), 0)
for (let i = 0; i < last; i++) await page.keyboard.press('ArrowRight')
say(`arrow right reaches slide ${main}`, await at(), last)
await page.keyboard.press('ArrowRight')
say(`paging past ${main} does not enter the appendix`, await at(), last)
await page.keyboard.press('Space')
say(`space past ${main} does not enter the appendix`, await at(), last)
await page.keyboard.press('Home')
say('Home returns to slide 1', await at(), 0)
await page.keyboard.press('End')
say(`End goes to slide ${main}`, await at(), last)
await page.keyboard.press('a')
say('A opens the appendix', await at(), main)
const a3 = String(main + 3)
for (const ch of a3) await page.keyboard.press(ch)
await page.keyboard.press('Enter')
say(`typing ${a3} + Enter goes to appendix 3`, await at(), main + 2)
await page.keyboard.press('7'); await page.keyboard.press('Enter')
say('typing 7 + Enter goes to slide 7', await at(), 6)
// Внутренние памятки должны быть распознаны как таковые: от этого зависит,
// попадут ли они в PDF и в публичную копию.
console.log(`  ok   слайдов приложения: ${appendix}`)
say('внутренних слайдов помечено', internal, 2)
const marks = await page.evaluate(() => document.querySelectorAll('.private').length)
say('на внутренних слайдах стоит пометка «Не для показа»', marks, 2)

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
// Кусок настоящей заметки: если он появится на основном экране, заметки текут.
const leak = await page.evaluate(() =>
  document.body.innerText.includes('договор автора с ней юристом не проверен')
)
console.log(`${leak ? ' FAIL ' : '  ok  '} notes never appear on the main screen`)
await presenter.screenshot({ path: '/tmp/shots/deck-presenter.png' })

await browser.close()
