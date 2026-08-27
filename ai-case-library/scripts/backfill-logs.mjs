#!/usr/bin/env node
/**
 * Разовая утилита: если направление исследования успело записать <slug>-cases.json,
 * но оборвалось по лимиту сессии до записи <slug>-candidates.csv / -rejected.csv / -source-log.csv,
 * этот скрипт честно реконструирует то, что реально можно подтвердить —
 * source-log и candidates по фактически включённым кейсам. Отклонённых кандидатов
 * в этом случае не выдумывает: если лог не был записан агентом, "rejected" остаётся пустым,
 * и это отражается в итоговом отчёте, а не маскируется.
 */
import fs from 'node:fs';
import path from 'node:path';
import { RAW, readJson, toCsv, COLORS } from './lib.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Использование: node scripts/backfill-logs.mjs <slug>');
  process.exit(1);
}

const casesFile = path.join(RAW, `${slug}-cases.json`);
if (!fs.existsSync(casesFile)) {
  console.error(COLORS.red(`Нет файла ${casesFile}`));
  process.exit(1);
}
const cases = readJson(casesFile);

const sourceRows = [];
const seen = new Set();
for (const c of cases) {
  for (const s of c.sources ?? []) {
    const key = s.url;
    if (seen.has(key)) continue;
    seen.add(key);
    sourceRows.push([s.url, s.publisher ?? '', s.type ?? '', new Date().toISOString().slice(0, 10), 'ok', c.id]);
  }
  for (const m of c.metrics ?? []) {
    if (seen.has(m.source_url)) continue;
    seen.add(m.source_url);
    sourceRows.push([m.source_url, '', m.source_type ?? '', new Date().toISOString().slice(0, 10), 'ok', c.id]);
  }
}

const candidateRows = cases.map((c) => [
  c.id,
  c.client,
  (c.vendor ?? []).join('; '),
  c.primary_source ?? c.sources?.[0]?.url ?? '',
  c.title,
  c.industry,
  c.business_process?.[0] ?? '',
  'included',
  `evidence ${c.evidence_grade}, sales_relevance ${c.sales_relevance}`,
]);

/**
 * Настоящий лог исследователя всегда богаче реконструкции: в нём есть отклонённые
 * кандидаты с причинами и источники, которые смотрели, но не использовали.
 * Поэтому существующий файл не перезаписываем — только сообщаем и пропускаем.
 * (Ровно так реконструкция однажды затёрла работу ещё не завершившегося агента.)
 */
function writeIfAbsent(name, headers, rows, description) {
  const file = path.join(RAW, name);
  if (fs.existsSync(file)) {
    console.log(COLORS.dim(`  ${name}: уже есть настоящий лог — не трогаем`));
    return false;
  }
  fs.writeFileSync(file, toCsv(headers, rows), 'utf8');
  console.log(COLORS.green(`  ${name}: восстановлено ${description}`));
  return true;
}

const force = process.argv.includes('--force');
if (force) {
  console.log(COLORS.yellow('--force: существующие CSV будут перезаписаны реконструкцией'));
  for (const suffix of ['-source-log.csv', '-candidates.csv', '-rejected.csv']) {
    const f = path.join(RAW, `${slug}${suffix}`);
    if (fs.existsSync(f)) fs.rmSync(f);
  }
}

console.log(`${slug}:`);
writeIfAbsent(
  `${slug}-source-log.csv`,
  ['url', 'publisher', 'source_type', 'accessed', 'status', 'used_for'],
  sourceRows,
  `${sourceRows.length} источников (только те, что попали во включённые кейсы)`,
);
writeIfAbsent(
  `${slug}-candidates.csv`,
  ['candidate_id', 'client', 'vendor', 'url', 'short_description', 'assumed_industry', 'assumed_process', 'decision', 'reason'],
  candidateRows,
  `${candidateRows.length} кандидатов (только included)`,
);
// Реконструировать rejected честно нельзя: кто и почему был отклонён, знает только исследователь.
writeIfAbsent(
  `${slug}-rejected.csv`,
  ['candidate_id', 'client', 'vendor', 'url', 'reason_code', 'reason'],
  [],
  'пустой файл — список отклонённых восстановить невозможно',
);
