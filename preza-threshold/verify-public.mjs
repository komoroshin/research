import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
const dir = process.argv[2] || '/tmp/deck-public'
const browser = await chromium.launch(
  existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
)
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto(`file://${dir}/index.html`, { waitUntil: 'networkidle' })

const slides = await page.evaluate(() => document.querySelectorAll('.canvas').length)
const badge = await page.evaluate(() => document.querySelector('.badge') !== null)
// Куски заметок и внутренних слайдов, которых на публичной ссылке быть не должно.
const secrets = [
  'Тракшена сегодня нет',
  'договор автора с ней юристом не проверен',
  'Наценка за перенесённую ценность',
  'Сырая себестоимость',
  'Не для показа',
]
const leaked = await page.evaluate((words) => {
  const html = document.documentElement.outerHTML + (window.DECK || '')
  return words.filter((w) => html.includes(w))
}, secrets)

console.log(`слайдов: ${slides}`)
console.log(`метка example content: ${badge ? 'ЕСТЬ — контент не подхватился' : 'нет'}`)
console.log(`утечки из заметок: ${leaked.length ? leaked.join(', ') : 'нет'}`)

// Заметки не должны появиться и в окне докладчика публичной копии.
const [presenter] = await Promise.all([ctx.waitForEvent('page'), page.keyboard.press('p')])
await presenter.waitForLoadState('networkidle')
const notes = (await presenter.textContent('#notes')).trim()
console.log(`заметки в окне докладчика: ${notes === '—' || notes === '' ? 'пусто, как и задумано' : 'ЕСТЬ: ' + notes.slice(0, 40)}`)

await browser.close()
process.exit(leaked.length || badge ? 1 : 0)
