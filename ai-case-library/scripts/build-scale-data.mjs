#!/usr/bin/env node
/**
 * Проекция базы «проектов клиентского масштаба» ($50k–$1M) в публичный каталог:
 * data/small-cases.json -> scale-app/src/generated/scale-cases.json.
 *
 * Каталог обезличенный по решению владельца: ни имён студий-исполнителей, ни имён
 * клиентов, ни ссылок на источники в клиентском бандле. URL источника хранится
 * только во внутренней базе (data/small-cases.json) для проверяемости; наружу
 * уходит текстовая плашка «верифицированный отзыв клиента · Clutch · 2024».
 *
 * Принцип тот же, что в build-client-data.mjs: белый список полей + падение
 * сборки при любом ключе вне списка.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DATA, readJson, COLORS } from './lib.mjs';

const OUT_DIR = path.join(ROOT, 'scale-app', 'src', 'generated');

const CASE_WHITELIST = new Set([
  'id', 'title', 'region', 'geo', 'industry', 'business_process', 'ai_mechanisms',
  'client_profile', 'problem', 'solution', 'result_summary', 'metrics',
  'budget_band', 'budget_note', 'duration_months', 'year', 'stage',
  // производные поля этого скрипта:
  'confidence', 'source_label',
]);
const METRIC_WHITELIST = new Set(['name', 'result', 'status']);

const PLATFORM_LABEL = {
  clutch: 'Clutch',
  workspace: 'Workspace',
  habr: 'Хабр',
  'vendor-site': 'публичный разбор исполнителя',
};

const CONFIDENCE = {
  client_review: {
    level: 'review',
    label: 'Подтверждён верифицированным отзывом клиента',
  },
  vendor_report: {
    level: 'vendor',
    label: 'По данным исполнителя проекта',
  },
};

const cases = readJson(path.join(DATA, 'small-cases.json'));

const projected = cases.map((c) => {
  const out = {};
  for (const key of CASE_WHITELIST) {
    if (key in c) out[key] = c[key];
  }
  out.metrics = (c.metrics ?? []).map((m) => {
    const mm = {};
    for (const k of METRIC_WHITELIST) if (k in m) mm[k] = m[k];
    return mm;
  });
  out.confidence = CONFIDENCE[c.confidence];
  const platform = PLATFORM_LABEL[c.source?.platform] ?? 'открытый источник';
  out.source_label =
    c.confidence === 'client_review'
      ? `Верифицированный отзыв клиента · ${platform} · ${c.source?.date ?? ''}`.trim()
      : `Публичный разбор проекта · ${platform} · ${c.source?.date ?? ''}`.trim();
  return out;
});

// Сильные вперёд: отзыв клиента выше данных исполнителя, цифры выше их отсутствия.
projected.sort((a, b) => {
  const score = (x) =>
    (x.confidence.level === 'review' ? 10 : 0) +
    Math.min(x.metrics.length, 4) * 2 +
    (x.budget_band !== 'undisclosed' ? 1 : 0);
  return score(b) - score(a) || a.title.localeCompare(b.title, 'ru');
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

const review = projected.filter((c) => c.confidence.level === 'review').length;
console.log(COLORS.green(`scale-cases.json — ${projected.length} кейсов (${review} по отзывам клиентов, ${projected.length - review} по данным исполнителей)`));
console.log(`  с бюджетной вилкой: ${projected.filter((c) => c.budget_band !== 'undisclosed').length}, с цифрами результата: ${projected.filter((c) => c.metrics.length > 0).length}`);
