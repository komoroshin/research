#!/usr/bin/env node
/**
 * Запасной способ прочитать страницу, когда WebFetch возвращает 403/404/пустой ответ.
 *
 * Часть российских изданий (TAdviser, ComNews, отраслевые сайты) отдаёт контент только
 * браузерному User-Agent. Скрипт забирает HTML и печатает извлечённый текст,
 * чтобы исследователь мог убедиться в наличии факта и цифры своими глазами.
 *
 *   node scripts/fetch-page.mjs <url> [--max=6000]
 *
 * ВАЖНО: страница, прочитанная этим скриптом, считается открытой — её URL можно
 * записывать в источники. Страница, которую скрипт не смог открыть, источником не является.
 */
import { COLORS } from './lib.mjs';

const [, , url, ...rest] = process.argv;
if (!url || !/^https?:\/\//i.test(url)) {
  console.error('Использование: node scripts/fetch-page.mjs <url> [--max=6000]');
  process.exit(1);
}

const maxArg = rest.find((a) => a.startsWith('--max='));
const MAX = maxArg ? Number(maxArg.slice(6)) : 6000;

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 25000);

let res;
try {
  res = await fetch(url, {
    redirect: 'follow',
    signal: controller.signal,
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ru,en;q=0.8',
    },
  });
} catch (e) {
  clearTimeout(timer);
  console.error(COLORS.red(`Не удалось открыть страницу: ${e.message}`));
  process.exit(2);
}
clearTimeout(timer);

const html = await res.text();

/** Грубое извлечение текста: убираем разметку и служебные блоки, схлопываем пробелы. */
function extractText(raw) {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(nav|header|footer|aside)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&laquo;|&raquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
const text = extractText(html);

console.log(`HTTP ${res.status}${res.redirected ? ` (после редиректа: ${res.url})` : ''}`);
console.log(`TITLE: ${title}`);
console.log(`ДЛИНА ТЕКСТА: ${text.length}`);

// Пейволл и «публикация недоступна» выглядят как успешный ответ — предупреждаем явно.
if (/публикация недоступна|доступ ограничен|только для подписчиков|subscribe to continue/i.test(text)) {
  console.log(COLORS.yellow('ВНИМАНИЕ: похоже на пейволл — содержательного текста может не быть.'));
}
if (text.length < 400) {
  console.log(COLORS.yellow('ВНИМАНИЕ: текста почти нет — вероятно, страница рендерится скриптом.'));
}

console.log('-'.repeat(70));
console.log(text.slice(0, MAX));
if (text.length > MAX) console.log(COLORS.dim(`\n… обрезано, всего ${text.length} символов (увеличьте --max)`));
