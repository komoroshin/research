#!/usr/bin/env node
/**
 * Починка исследовательских CSV, в которых свободный текст содержит незакавыченные запятые.
 *
 * Агенты пишут логи вручную и регулярно забывают закавычить поле с запятой
 * («Аптечная сеть 36,6», «полки, весы, очереди»). Из-за этого строка получает лишние
 * колонки, и сводный research/candidates.csv собирается со смещением.
 *
 * Восстановление детерминированное, потому что структура строки известна:
 *  - первые N полей фиксированы (id, client, vendor, url) — берём слева;
 *  - decision/reason_code — значение из перечисления, ищем его справа;
 *  - всё, что между, схлопывается в свободнотекстовые поля.
 * Строки, где перечисление не найдено, не трогаем и показываем — угадывать нельзя.
 *
 *   node scripts/repair-csv.mjs                # починить все CSV в research/raw
 *   node scripts/repair-csv.mjs --check        # только показать проблемы, ничего не менять
 */
import fs from 'node:fs';
import path from 'node:path';
import { RAW, parseCsv, toCsv, COLORS } from './lib.mjs';

const checkOnly = process.argv.includes('--check');

const DECISIONS = new Set(['included', 'rejected', 'duplicate']);
const REASON_CODES = new Set([
  'grade_d_marketing', 'no_client', 'no_implementation', 'announcement_only',
  'no_result', 'duplicate', 'source_unavailable', 'not_ai', 'out_of_scope', 'unverifiable',
]);

/**
 * Схема файла: сколько полей слева фиксировано, где находится «якорное» поле-перечисление
 * и какими значениями оно может быть.
 */
const SCHEMAS = {
  '-candidates.csv': {
    headers: ['candidate_id', 'client', 'vendor', 'url', 'short_description', 'assumed_industry', 'assumed_process', 'decision', 'reason'],
    fixedLeft: 4,
    anchorIndex: 7,
    anchorValues: DECISIONS,
  },
  '-rejected.csv': {
    headers: ['candidate_id', 'client', 'vendor', 'url', 'reason_code', 'reason'],
    fixedLeft: 4,
    anchorIndex: 4,
    anchorValues: REASON_CODES,
  },
  '-source-log.csv': {
    headers: ['url', 'publisher', 'source_type', 'accessed', 'status', 'used_for'],
    fixedLeft: 3,
    anchorIndex: 4,
    anchorValues: new Set(['ok', 'partial', 'blocked', 'error']),
  },
};

/**
 * Собирает строку нужной длины: слева фиксированные поля, справа — хвост от якоря,
 * а лишние запятые схлопываются в свободный текст между ними.
 */
function repairRow(row, schema) {
  const { headers, fixedLeft, anchorIndex, anchorValues } = schema;
  if (row.length === headers.length) return { row, changed: false };

  // Ищем якорь справа налево: справа от него структура жёсткая.
  let anchorAt = -1;
  for (let i = row.length - 1; i >= fixedLeft; i--) {
    if (anchorValues.has(row[i].trim().toLowerCase())) {
      anchorAt = i;
      break;
    }
  }
  if (anchorAt === -1) return { row, changed: false, unfixable: true };

  const left = row.slice(0, fixedLeft);
  const tailAfterAnchor = row.slice(anchorAt + 1);
  // Поля между фиксированной частью и якорем: последние из них тоже структурные.
  const structuralBetween = anchorIndex - fixedLeft; // сколько полей должно быть между
  const middle = row.slice(fixedLeft, anchorAt);

  let rebuiltMiddle;
  if (middle.length <= structuralBetween) {
    rebuiltMiddle = [...middle, ...Array(structuralBetween - middle.length).fill('')];
  } else {
    // Лишние куски принадлежат свободному тексту — он идёт первым в middle.
    const surplus = middle.length - structuralBetween;
    const freeText = middle.slice(0, surplus + 1).join(', ');
    rebuiltMiddle = [freeText, ...middle.slice(surplus + 1)];
  }

  const rebuilt = [
    ...left,
    ...rebuiltMiddle,
    row[anchorAt],
    tailAfterAnchor.length ? tailAfterAnchor.join(', ') : '',
  ];

  while (rebuilt.length < headers.length) rebuilt.push('');
  return { row: rebuilt.slice(0, headers.length), changed: true };
}

let filesTouched = 0;
let rowsRepaired = 0;
let rowsUnfixable = 0;

for (const file of fs.readdirSync(RAW).filter((f) => f.endsWith('.csv')).sort()) {
  const suffix = Object.keys(SCHEMAS).find((s) => file.endsWith(s));
  if (!suffix) continue;
  const schema = SCHEMAS[suffix];

  const full = path.join(RAW, file);
  const rows = parseCsv(fs.readFileSync(full, 'utf8'));
  if (rows.length === 0) continue;

  const body = rows.slice(1);
  const out = [];
  let repaired = 0;
  let unfixable = 0;

  for (const row of body) {
    const res = repairRow(row, schema);
    if (res.unfixable) {
      unfixable++;
      console.log(COLORS.yellow(`  ${file}: не восстановить (${row.length} полей): ${row[0]?.slice(0, 40)}`));
    } else if (res.changed) repaired++;
    out.push(res.row);
  }

  if (repaired > 0) {
    rowsRepaired += repaired;
    filesTouched++;
    console.log(`  ${file}: ${COLORS.green(`починено ${repaired}`)} строк из ${body.length}`);
    if (!checkOnly) fs.writeFileSync(full, toCsv(schema.headers, out), 'utf8');
  }
  rowsUnfixable += unfixable;
}

if (rowsRepaired === 0 && rowsUnfixable === 0) {
  console.log(COLORS.green('Все исследовательские CSV корректны.'));
} else {
  console.log(
    `\n${checkOnly ? 'Найдено' : 'Починено'}: ${rowsRepaired} строк в ${filesTouched} файлах` +
      (rowsUnfixable ? `, не восстановлено: ${rowsUnfixable}` : ''),
  );
  if (checkOnly) console.log(COLORS.dim('Запустите без --check, чтобы записать исправления.'));
}
