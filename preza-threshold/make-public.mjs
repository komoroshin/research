/* Собирает публичную копию презентации для GitHub Pages.
   Usage: node make-public.mjs <target-dir>

   Два отличия от локальной версии.

   Первое — вырезаны блоки «Проговорить». Они лежат в том же файле, что и
   слайды, и любой, кто откроет исходник страницы, прочитал бы их целиком.

   Второе — целиком вырезаны слайды с пометкой `internal`. Это внутренние
   памятки: постраничные сметы этапов, где стоит строка наценки. Она объясняет
   разницу между себестоимостью и ценой, и на публичной ссылке ей не место.
*/

import { mkdirSync, copyFileSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const target = process.argv[2]
if (!target) {
  console.error('Usage: node make-public.mjs <target-dir>')
  process.exit(1)
}

mkdirSync(target, { recursive: true })

for (const file of ['index.html', 'presenter.html', 'deck.css', 'deck.js']) {
  copyFileSync(join(here, file), join(target, file))
}

// Снимки экранов прототипа, если они есть.
const assets = join(here, 'assets')
if (existsSync(assets)) {
  mkdirSync(join(target, 'assets'), { recursive: true })
  for (const f of readdirSync(assets)) copyFileSync(join(assets, f), join(target, 'assets', f))
}

// Страница не для поиска: ссылка раздаётся адресно.
for (const file of ['index.html', 'presenter.html']) {
  const p = join(target, file)
  let html = readFileSync(p, 'utf8')
  if (!html.includes('name="robots"')) {
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">')
    writeFileSync(p, html)
  }
}

const src = existsSync(join(here, 'content.js'))
  ? join(here, 'content.js')
  : join(here, 'content.example.js')

const raw = readFileSync(src, 'utf8')

// Слайды с пометкой internal вырезаются целиком, вместе с заголовком и сметой.
const internal = (raw.match(/^===[^\n]*\|[ \t]*internal[ \t]*$/gm) || []).length
let stripped = raw.replace(/^===[^\n]*\|[ \t]*internal[ \t]*$[\s\S]*?(?=^===|^`)/gm, '')

// Всё от строки «--- notes» до следующего слайда — вон.
const removed = (stripped.match(/^---[ \t]*notes[ \t]*$/gm) || []).length
stripped = stripped.replace(/^---[ \t]*notes[ \t]*$[\s\S]*?(?=^===|^`)/gm, '')

writeFileSync(
  join(target, 'content.js'),
  '/* Публичная копия: блоки «Проговорить» и внутренние слайды вырезаны\n' +
    '   сборкой make-public.mjs. */\n' + stripped
)

if (stripped.includes('--- notes')) {
  console.error('ОШИБКА: заметки остались в публичной копии')
  process.exit(1)
}
if (/\|[ \t]*internal/.test(stripped)) {
  console.error('ОШИБКА: внутренние слайды остались в публичной копии')
  process.exit(1)
}
console.log(
  `Публичная копия собрана в ${target}: вырезано блоков заметок — ${removed}, ` +
    `внутренних слайдов — ${internal}`
)
