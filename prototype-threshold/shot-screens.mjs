// Снимки экранов прототипа для приложения презентации.
// Кадр — рамка телефона без панели презентации и без переключателя языка.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const ROOT = new URL('./dist/', import.meta.url).pathname
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }

const server = createServer(async (req, res) => {
  const p = req.url.split('?')[0]
  const file = join(ROOT, p === '/' ? 'index.html' : p)
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((r) => server.listen(0, r))
const url = `http://localhost:${server.address().port}/`

const out = process.argv[2] || '../preza-threshold/assets'
const shots = [
  { name: 'prototype-calendar', screen: 'calendar', week: 4 },
  { name: 'prototype-challenge', screen: 'today', week: 4, scroll: 120 },
]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 2 })
await page.goto(url)
await page.waitForTimeout(600)

for (const s of shots) {
  // Навигация через панель презентации: клики по чипам.
  await page.evaluate(([screen, week]) => {
    const btns = [...document.querySelectorAll('button')]
    const num = { calendar: '1', check: '2', meal: '3', today: '4', signals: '5', map: '6', ask: '7' }[screen]
    const chip = btns.find((b) => b.textContent.trim().startsWith(num + ' ·') || b.textContent.trim() === num)
    if (chip) chip.click()
    const wk = btns.filter((b) => b.textContent.trim() === String(week))
    if (wk.length) wk[wk.length - 1].click()
  }, [s.screen, s.week])
  await page.waitForTimeout(500)
  if (s.scroll) await page.evaluate((y) => { document.querySelector('main').scrollTop = y }, s.scroll)
  await page.waitForTimeout(200)
  // Спрятать леса перед кадром.
  await page.evaluate(() => {
    const panel = document.querySelector('.fixed.left-1\\/2')
    if (panel) panel.style.display = 'none'
    const lang = document.querySelector('[class*="absolute"][class*="bottom-24"]')
    if (lang) lang.style.display = 'none'
  })
  await page.waitForTimeout(200)
  const phone = await page.$('div.relative.h-\\[100dvh\\]')
  await phone.screenshot({ path: join(out, s.name + '.png') })
  console.log('written', s.name)
}
await browser.close()
server.close()
