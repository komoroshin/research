#!/usr/bin/env node
/**
 * Проекция базы «проектов клиентского масштаба» ($50k–$1M) в публичный каталог:
 * data/small-cases.json -> scale-app/src/generated/scale-cases.json.
 *
 * Каталог обезличенный по решению владельца: ни имён студий-исполнителей, ни имён
 * клиентов, ни ссылок на источники в клиентском бандле. URL источника хранится
 * только во внутренней базе (data/small-cases.json) для проверяемости; наружу
 * уходят только факты проекта: результат, бюджетная вилка, сроки, отрасль.
 *
 * Принцип тот же, что в build-client-data.mjs: белый список полей + падение
 * сборки при любом ключе вне списка.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DATA, readJson, COLORS } from './lib.mjs';

const OUT_DIR = path.join(ROOT, 'scale-app', 'src', 'generated');

// Клиентская страница не показывает служебные поля (confidence, происхождение,
// стадия) — их нет и в бандле: доказательность живёт во внутренней базе.
const CASE_WHITELIST = new Set([
  'id', 'title', 'region', 'geo', 'industry', 'business_process', 'ai_mechanisms',
  'client_profile', 'pain', 'problem', 'solution', 'result_summary', 'metrics',
  'budget_band', 'budget_note', 'duration_months', 'year',
]);
const METRIC_WHITELIST = new Set(['name', 'result', 'status']);

const cases = readJson(path.join(DATA, 'small-cases.json'));

// Сильные вперёд: цифры результата выше их отсутствия, отзыв клиента выше данных
// исполнителя (внутренний сигнал качества, в бандл не попадает), бюджет раскрыт.
const sorted = [...cases].sort((a, b) => {
  const score = (x) =>
    Math.min(x.metrics?.length ?? 0, 4) * 2 +
    (x.confidence === 'client_review' ? 10 : 0) +
    (x.budget_band !== 'undisclosed' ? 1 : 0);
  return score(b) - score(a) || a.title.localeCompare(b.title, 'ru');
});

const projected = sorted.map((c) => {
  const out = {};
  for (const key of CASE_WHITELIST) {
    if (key in c) out[key] = c[key];
  }
  out.metrics = (c.metrics ?? []).map((m) => {
    const mm = {};
    for (const k of METRIC_WHITELIST) if (k in m) mm[k] = m[k];
    return mm;
  });
  return out;
});

// --- Страховка от утечки ---
const leaks = [];
for (const c of projected) {
  for (const k of Object.keys(c)) if (!CASE_WHITELIST.has(k)) leaks.push(`${c.id}: ${k}`);
  for (const m of c.metrics) for (const k of Object.keys(m)) if (!METRIC_WHITELIST.has(k)) leaks.push(`${c.id}: metrics.${k}`);
}
const serialized = JSON.stringify(projected);
// Ни URL источников, ни ключа source, ни имён clutch-профилей в выводе быть не должно.
for (const marker of ['"source"', '"url"', 'clutch.co', 'workspace.ru', 'habr.com', 'riverstart', 'http://', 'https://']) {
  if (serialized.includes(marker)) leaks.push(`сериализованный вывод содержит "${marker}"`);
}
if (leaks.length) {
  console.error(COLORS.red('УТЕЧКА ВНУТРЕННИХ ПОЛЕЙ — сборка остановлена:'));
  for (const l of leaks.slice(0, 20)) console.error('  x ' + l);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'scale-cases.json'), JSON.stringify(projected, null, 2) + '\n', 'utf8');

const review = sorted.filter((c) => c.confidence === 'client_review').length;
console.log(COLORS.green(`scale-cases.json — ${projected.length} кейсов (внутренне: ${review} по отзывам клиентов, ${projected.length - review} по данным исполнителей)`));
console.log(`  с бюджетной вилкой: ${projected.filter((c) => c.budget_band !== 'undisclosed').length}, с цифрами результата: ${projected.filter((c) => c.metrics.length > 0).length}`);
