#!/usr/bin/env node
/**
 * Копирует собранный каталог решений в <repo>/solutions,
 * откуда GitHub Pages отдаёт его по адресу /<repo>/solutions/.
 * Запускать после `npm run build-solutions`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, COLORS } from './lib.mjs';

const dist = path.join(ROOT, 'solutions-app', 'dist');
const target = path.resolve(ROOT, '..', 'solutions');

if (!fs.existsSync(dist)) {
  console.error(COLORS.red('Нет каталога dist — сначала выполните npm run build-solutions'));
  process.exit(1);
}

if (fs.existsSync(target)) fs.rmSync(target, { recursive: true });
fs.cpSync(dist, target, { recursive: true });

const files = fs.readdirSync(path.join(target, 'assets')).length;
console.log(COLORS.green(`Опубликовано в ${path.relative(path.resolve(ROOT, '..'), target)}/ — index.html + ${files} ассетов`));
console.log(COLORS.dim('Закоммитьте каталог solutions/, чтобы GitHub Pages отдал новую версию.'));
