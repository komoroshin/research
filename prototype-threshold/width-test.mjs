import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
const browser = await chromium.launch(
  existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
)
const url = 'http://localhost:4180/'

// Ширина приложения не должна зависеть ни от языка, ни от экрана.
for (const [name, w, h] of [['phone', 390, 844], ['small', 360, 780], ['tablet', 820, 1100]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)

  const measure = () =>
    page.evaluate(() => {
      const el = document.querySelector('main').parentElement
      const r = el.getBoundingClientRect()
      return { left: Math.round(r.left), width: Math.round(r.width) }
    })

  const en = await measure()
  await page.locator('button:text-is("ru")').click()
  await page.waitForTimeout(300)
  const ru = await measure()

  const same = en.width === ru.width && en.left === ru.left
  // На широком экране это внутренняя область рамки: 390 минус две рамки по 9px.
  const expected = w < 640 ? w : 372
  const fits = en.width === expected
  console.log(
    `${same && fits ? '  ok  ' : ' FAIL '} ${name} ${w}px: EN ${en.width}px @${en.left}, RU ${ru.width}px @${ru.left} (ожидалось ${expected}px)`
  )
  await page.screenshot({ path: `/tmp/shots/w-${name}.png` })
  await page.close()
}
await browser.close()
