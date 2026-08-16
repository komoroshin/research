/* Собирает публичную копию презентации для GitHub Pages.
   Usage: node make-public.mjs <target-dir>

   Единственное отличие от локальной версии — из контента вырезаны блоки
   «Проговорить». Они лежат в том же файле, что и слайды, и любой, кто откроет
   исходник страницы, прочитал бы их целиком: там условия сделки, доли и
   «тракшена сегодня нет». На публичной ссылке этого быть не должно.
*/

import { mkdirSync, copyFileSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
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
// Всё от строки «--- notes» до следующего слайда — вон.
const stripped = raw.replace(/^---[ \t]*notes[ \t]*$[\s\S]*?(?=^===|^`)/gm, '')
const removed = (raw.match(/^---[ \t]*notes[ \t]*$/gm) || []).length

writeFileSync(
  join(target, 'content.js'),
  '/* Публичная копия: блоки «Проговорить» вырезаны сборкой make-public.mjs. */\n' + stripped
)

if (stripped.includes('--- notes')) {
  console.error('ОШИБКА: заметки остались в публичной копии')
  process.exit(1)
}
console.log(`Публичная копия собрана в ${target}: вырезано блоков заметок — ${removed}`)
