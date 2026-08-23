import { chromium, devices } from 'playwright'
import { existsSync } from 'node:fs'
const browser = await chromium.launch(
  existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
)
const dir = process.argv[2] || '/home/user/research/preza-threshold'
const ctx = await browser.newContext({ ...devices['iPhone 13'], isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto(`file://${dir}/index.html`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

const at = () => page.evaluate(() => Number(document.querySelector('.canvas.is-current').dataset.index))
const say = (label, got, want) =>
  console.log(`${got === want ? '  ok  ' : ' FAIL '} ${label}: ${got} (ожидалось ${want})`)

// Число слайдов берём из презентации, чтобы тест не правился при её росте.
const main = await page.evaluate(() => window.deckData.main.length)

const size = page.viewportSize()
const midY = Math.round(size.height / 2)

say('открывается на первом слайде', await at(), 0)

// Кнопки должны быть видимы на телефоне.
const bar = await page.evaluate(() => {
  const el = document.querySelector('.deck-controls')
  if (!el) return 'нет в DOM'
  const r = el.getBoundingClientRect()
  return r.width > 0 ? `виден ${Math.round(r.width)}×${Math.round(r.height)}` : 'скрыт css'
})
console.log(`${bar.startsWith('виден') ? '  ok  ' : ' FAIL '} панель управления: ${bar}`)

await page.locator('.deck-controls button[aria-label="Следующий слайд"]').click()
say('кнопка вперёд', await at(), 1)
await page.locator('.deck-controls button[aria-label="Предыдущий слайд"]').click()
say('кнопка назад', await at(), 0)

// Свайп влево — вперёд.
await page.touchscreen.tap(200, midY)
await page.evaluate(() => window.deckGoto(0))
const swipe = async (from, to) => {
  await page.evaluate(([from, to]) => {
    const mk = (type, x) =>
      new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === 'touchend' ? [] : [new Touch({ identifier: 1, target: document.body, clientX: x, clientY: 400 })],
        changedTouches: [new Touch({ identifier: 1, target: document.body, clientX: x, clientY: 400 })],
      })
    document.dispatchEvent(mk('touchstart', from))
    document.dispatchEvent(mk('touchend', to))
  }, [from, to])
  await page.waitForTimeout(120)
}
await swipe(300, 60)
say('свайп влево листает вперёд', await at(), 1)
await swipe(60, 300)
say('свайп вправо листает назад', await at(), 0)

// Тап по правому краю.
await page.touchscreen.tap(size.width - 20, midY)
await page.waitForTimeout(120)
say('тап по правому краю', await at(), 1)
await page.touchscreen.tap(20, midY)
await page.waitForTimeout(120)
say('тап по левому краю', await at(), 0)

// Список слайдов вместо ввода номера с клавиатуры.
await page.locator('.deck-controls button.counter').click()
await page.waitForTimeout(150)
const pickerShown = await page.evaluate(() => document.querySelector('.deck-picker').classList.contains('show'))
console.log(`${pickerShown ? '  ok  ' : ' FAIL '} список слайдов открывается`)
await page.locator('.deck-picker button', { hasText: /^A1$/ }).click()
await page.waitForTimeout(150)
say('переход в приложение из списка', await at(), main)

// Дальше последнего основного слайда показ не уходит — но на телефоне нет
// клавиши A, поэтому свайп/тап на этой границе не должен быть немым: он
// открывает список слайдов вместо того, чтобы просто ничего не делать.
await page.evaluate((i) => window.deckGoto(i), main - 1)
await page.evaluate(() => document.querySelector('.deck-picker').classList.remove('show'))
await swipe(300, 60)
say(`свайп с последнего слайда не уводит в приложение`, await at(), main - 1)
const pickerAfterSwipe = await page.evaluate(() =>
  document.querySelector('.deck-picker').classList.contains('show')
)
console.log(`${pickerAfterSwipe ? '  ok  ' : ' FAIL '} свайп с последнего слайда открывает список слайдов`)

// Кнопка «вперёд» на этой же границе должна быть кликабельной (не disabled)
// и делать то же самое — иначе на телефоне нет способа узнать про приложение.
await page.evaluate(() => document.querySelector('.deck-picker').classList.remove('show'))
const nextBtnDisabled = await page.evaluate(() =>
  document.querySelector('.deck-controls button[aria-label="Следующий слайд"]').disabled
)
console.log(`${!nextBtnDisabled ? '  ok  ' : ' FAIL '} кнопка «вперёд» на последнем слайде не отключена`)
await page.locator('.deck-controls button[aria-label="Следующий слайд"]').click()
await page.waitForTimeout(120)
const pickerAfterButton = await page.evaluate(() =>
  document.querySelector('.deck-picker').classList.contains('show')
)
console.log(`${pickerAfterButton ? '  ok  ' : ' FAIL '} кнопка «вперёд» на последнем слайде открывает список слайдов`)

await page.screenshot({ path: '/tmp/shots/deck-mobile.png' })
await browser.close()
