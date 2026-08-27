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

fs.writeFileSync(
  path.join(RAW, `${slug}-source-log.csv`),
  toCsv(['url', 'publisher', 'source_type', 'accessed', 'status', 'used_for'], sourceRows),
  'utf8',
);
fs.writeFileSync(
  path.join(RAW, `${slug}-candidates.csv`),
  toCsv(
    ['candidate_id', 'client', 'vendor', 'url', 'short_description', 'assumed_industry', 'assumed_process', 'decision', 'reason'],
    candidateRows,
  ),
  'utf8',
);
// Реконструировать rejected честно нельзя — агент оборвался до записи лога отклонений.
fs.writeFileSync(
  path.join(RAW, `${slug}-rejected.csv`),
  toCsv(['candidate_id', 'client', 'vendor', 'url', 'reason_code', 'reason'], []),
  'utf8',
);

console.log(
  COLORS.green(`${slug}: восстановлено ${sourceRows.length} источников и ${candidateRows.length} кандидатов (только included; rejected пуст — лог был утрачен при обрыве сессии).`),
);
