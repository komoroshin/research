#!/usr/bin/env node
/**
 * Сборка research/raw/*.json в единую базу (PASS 4 и PASS 5 из п.7 ТЗ).
 *
 * Что делает:
 *  1. Читает выдачу всех направлений исследования.
 *  2. Схлопывает дубли: один и тот же проект часто публикуют и подрядчик, и клиент, и СМИ.
 *     При склейке объединяются sources, metrics, tags и берётся более сильный evidence_grade.
 *  3. Выкидывает Grade D — в основной библиотеке их быть не должно.
 *  4. Пишет data/cases.json и сводные research/*.csv.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  DATA, RESEARCH, RAW, readJson, writeJson, normName, similarity, canonicalUrl, parseCsv, toCsv, COLORS,
} from './lib.mjs';

const GRADE_RANK = { A: 0, B: 1, C: 2, D: 3 };

if (!fs.existsSync(RAW)) {
  console.error(COLORS.red(`Нет каталога ${RAW}`));
  process.exit(1);
}

const files = fs.readdirSync(RAW).filter((f) => f.endsWith('-cases.json')).sort();
if (files.length === 0) {
  console.error(COLORS.red('В research/raw нет файлов *-cases.json'));
  process.exit(1);
}

const incoming = [];
const perSource = [];
for (const f of files) {
  const full = path.join(RAW, f);
  let list;
  try {
    list = readJson(full);
  } catch (e) {
    console.error(COLORS.red(`${f}: не разбирается как JSON — ${e.message}`));
    process.exit(1);
  }
  if (!Array.isArray(list)) {
    console.error(COLORS.red(`${f}: ожидался массив`));
    process.exit(1);
  }
  perSource.push([f, list.length]);
  for (const c of list) incoming.push({ ...c, _origin: f });
}

const droppedD = incoming.filter((c) => c.evidence_grade === 'D');
const pool = incoming.filter((c) => c.evidence_grade !== 'D');

/** Два кейса — один проект, если совпал клиент и решение либо есть общий первичный источник. */
function isDuplicate(a, b) {
  const clientA = normName(a.client);
  const clientB = normName(b.client);
  const sharedUrl = (a.sources ?? []).some((s) =>
    (b.sources ?? []).some((t) => canonicalUrl(s.url) === canonicalUrl(t.url)),
  );
  if (!clientA || !clientB) return false;
  if (clientA !== clientB) return false;
  if (similarity(a.solution, b.solution) > 0.4) return true;
  if (similarity(a.title, b.title) > 0.5) return true;
  const sameProcess = (a.business_process ?? []).some((p) => (b.business_process ?? []).includes(p));
  return sharedUrl && sameProcess;
}

function mergeInto(base, extra) {
  const urls = new Set((base.sources ?? []).map((s) => canonicalUrl(s.url)));
  for (const s of extra.sources ?? []) {
    if (!urls.has(canonicalUrl(s.url))) {
      base.sources.push(s);
      urls.add(canonicalUrl(s.url));
    }
  }
  const metricKeys = new Set((base.metrics ?? []).map((m) => `${m.metric_type}|${m.result}`));
  for (const m of extra.metrics ?? []) {
    const key = `${m.metric_type}|${m.result}`;
    if (!metricKeys.has(key)) {
      base.metrics.push(m);
      metricKeys.add(key);
    }
  }
  for (const key of ['subindustry', 'business_function', 'business_process', 'ai_mechanisms', 'vendor', 'tags', 'technology_providers', 'likely_buyer', 'expand_opportunities', 'data_used', 'integrations']) {
    const merged = new Set([...(base[key] ?? []), ...(extra[key] ?? [])]);
    base[key] = [...merged];
  }
  // Из двух оценок берём более сильную: объединённый кейс опирается на больше источников.
  if (GRADE_RANK[extra.evidence_grade] < GRADE_RANK[base.evidence_grade]) {
    base.evidence_grade = extra.evidence_grade;
  }
  base.sales_relevance = Math.max(base.sales_relevance ?? 0, extra.sales_relevance ?? 0);
  base.vendor_claim = base.vendor_claim && extra.vendor_claim;
  for (const key of ['before_state', 'scale', 'timeline', 'why_it_matters', 'entry_hypothesis', 'land_opportunity', 'client_url']) {
    if (!base[key] && extra[key]) base[key] = extra[key];
  }
  if (base.budget_disclosed == null && extra.budget_disclosed != null) {
    base.budget_disclosed = extra.budget_disclosed;
    base.budget_note = extra.budget_note;
  }
  base.research_notes = [base.research_notes, extra.research_notes ? `Слито с ${extra.id}: ${extra.research_notes}` : `Слито с ${extra.id} (${extra._origin}).`]
    .filter(Boolean)
    .join(' ');
}

const merged = [];
const mergeLog = [];
for (const c of pool) {
  const hit = merged.find((m) => isDuplicate(m, c));
  if (hit) {
    mergeLog.push([c.id, hit.id, c.client, c._origin, hit._origin]);
    mergeInto(hit, c);
  } else {
    merged.push({ ...c, sources: [...(c.sources ?? [])], metrics: [...(c.metrics ?? [])] });
  }
}

// Дубли id между направлениями быть не должно, но подстрахуемся суффиксом.
const idSeen = new Map();
for (const c of merged) {
  const n = idSeen.get(c.id) ?? 0;
  idSeen.set(c.id, n + 1);
  if (n > 0) c.id = `${c.id}-${n + 1}`;
}

const clean = merged.map(({ _origin, ...rest }) => rest);
clean.sort(
  (a, b) =>
    b.sales_relevance - a.sales_relevance ||
    GRADE_RANK[a.evidence_grade] - GRADE_RANK[b.evidence_grade] ||
    a.client.localeCompare(b.client, 'ru'),
);

writeJson(path.join(DATA, 'cases.json'), clean);

// --- Сводные исследовательские журналы ---
function concatCsv(suffix, headers, outName) {
  const rows = [];
  for (const f of fs.readdirSync(RAW).filter((x) => x.endsWith(suffix)).sort()) {
    const text = fs.readFileSync(path.join(RAW, f), 'utf8');
    const parsed = parseCsv(text);
    if (parsed.length === 0) continue;
    const head = parsed[0].map((h) => h.trim().toLowerCase());
    const map = headers.map((h) => head.indexOf(h));
    for (const row of parsed.slice(1)) {
      rows.push([f.replace(suffix, ''), ...map.map((i) => (i >= 0 ? (row[i] ?? '') : ''))]);
    }
  }
  fs.writeFileSync(path.join(RESEARCH, outName), toCsv(['research_track', ...headers], rows), 'utf8');
  return rows.length;
}

const nCandidates = concatCsv(
  '-candidates.csv',
  ['candidate_id', 'client', 'vendor', 'url', 'short_description', 'assumed_industry', 'assumed_process', 'decision', 'reason'],
  'candidates.csv',
);
const nRejected = concatCsv(
  '-rejected.csv',
  ['candidate_id', 'client', 'vendor', 'url', 'reason_code', 'reason'],
  'rejected.csv',
);
const nSources = concatCsv(
  '-source-log.csv',
  ['url', 'publisher', 'source_type', 'accessed', 'status', 'used_for'],
  'source-log.csv',
);

fs.writeFileSync(
  path.join(RESEARCH, 'dedup-log.csv'),
  toCsv(['merged_case_id', 'kept_case_id', 'client', 'from_track', 'into_track'], mergeLog),
  'utf8',
);

console.log('\nСборка базы:');
for (const [f, n] of perSource) console.log(`  ${f.padEnd(30)} ${String(n).padStart(3)}`);
console.log('-'.repeat(44));
console.log(`  Получено записей:        ${incoming.length}`);
console.log(`  Отброшено Grade D:       ${droppedD.length}`);
console.log(`  Склеено дублей:          ${mergeLog.length}`);
console.log(COLORS.green(`  Итог в data/cases.json:  ${clean.length}`));
console.log(`\nЖурналы: candidates ${nCandidates}, rejected ${nRejected}, sources ${nSources}\n`);
