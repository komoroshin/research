#!/usr/bin/env node
/**
 * Копирует собранное приложение в публикуемый каталог репозитория (<repo>/cases),
 * откуда GitHub Pages отдаёт его по адресу /<repo>/cases/.
 *
 * Vite собран с base './', поэтому пути относительные и каталог можно перемещать.
 * Запускать после `npm run build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, COLORS } from './lib.mjs';

const dist = path.join(ROOT, 'dist');
const target = path.resolve(ROOT, '..', 'cases');

if (!fs.existsSync(dist)) {
  console.error(COLORS.red('Нет каталога dist — сначала выполните npm run build'));
  process.exit(1);
}

// Чистим только ранее опубликованную сборку, чтобы удалённые ассеты не оставались висеть.
if (fs.existsSync(target)) fs.rmSync(target, { recursive: true });
fs.cpSync(dist, target, { recursive: true });

const files = fs.readdirSync(path.join(target, 'assets')).length;
console.log(COLORS.green(`Опубликовано в ${path.relative(path.resolve(ROOT, '..'), target)}/ — index.html + ${files} ассетов`));
console.log(COLORS.dim('Закоммитьте каталог cases/, чтобы GitHub Pages отдал новую версию.'));
