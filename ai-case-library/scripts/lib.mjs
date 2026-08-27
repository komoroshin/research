import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DATA = path.join(ROOT, 'data');
export const RESEARCH = path.join(ROOT, 'research');
export const RAW = path.join(RESEARCH, 'raw');

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

export const taxonomy = readJson(path.join(DATA, 'taxonomy.json'));

/** Множества допустимых id — валидатор не даёт исследователям вводить свои категории. */
export const allowed = {
  industry: new Set(taxonomy.industries.map((i) => i.id)),
  subindustry: new Set(taxonomy.industries.flatMap((i) => i.subindustries.map((s) => s.id))),
  business_function: new Set(taxonomy.business_functions.map((t) => t.id)),
  business_process: new Set(taxonomy.business_processes.map((t) => t.id)),
  ai_mechanisms: new Set(taxonomy.ai_mechanisms.map((t) => t.id)),
  metric_type: new Set(taxonomy.metric_types.map((t) => t.id)),
  metric_status: new Set(taxonomy.metric_status.map((t) => t.id)),
  source_type: new Set(taxonomy.source_types.map((t) => t.id)),
  evidence_grade: new Set(taxonomy.evidence_grades.map((t) => t.id)),
  stage: new Set(taxonomy.stages.map((t) => t.id)),
  deployment: new Set(taxonomy.deployments.map((t) => t.id)),
  vendor_type: new Set(taxonomy.vendor_types.map((t) => t.id)),
  region: new Set(taxonomy.regions.map((t) => t.id)),
  likely_buyer: new Set(taxonomy.likely_buyers.map((t) => t.id)),
};

export const subindustryParent = new Map(
  taxonomy.industries.flatMap((i) => i.subindustries.map((s) => [s.id, i.id])),
);

/** Нормализация названия компании для поиска дублей: регистр, кавычки, ООО/АО, латиница-кириллица. */
export function normName(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"'`’]/g, '')
    .replace(/\b(ооо|оао|зао|пао|ао|гк|группа компаний|llc|ltd|inc|plc|gmbh|corp|co)\b/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function normText(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Коэффициент Жаккара по словам — грубая, но достаточная мера похожести заголовков и описаний. */
export function similarity(a, b) {
  const A = new Set(normText(a).split(' ').filter((w) => w.length > 2));
  const B = new Set(normText(b).split(' ').filter((w) => w.length > 2));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Домен + путь без хвостов — чтобы utm-метки не мешали находить общие источники. */
export function canonicalUrl(url) {
  try {
    const u = new URL(String(url));
    u.hash = '';
    u.search = '';
    const host = u.hostname.replace(/^www\./, '');
    const p = u.pathname.replace(/\/+$/, '');
    return `${host}${p}`;
  } catch {
    return String(url ?? '').trim().toLowerCase();
  }
}

export function csvCell(value) {
  const s = value == null ? '' : String(value);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers, rows) {
  return [headers.join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\r\n') + '\r\n';
}

/** Разбор CSV с поддержкой кавычек и переводов строк внутри полей. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const s = text.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') cell += ch;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

export const COLORS = {
  red: (s) => `\u001b[31m${s}\u001b[0m`,
  yellow: (s) => `\u001b[33m${s}\u001b[0m`,
  green: (s) => `\u001b[32m${s}\u001b[0m`,
  dim: (s) => `\u001b[2m${s}\u001b[0m`,
};
