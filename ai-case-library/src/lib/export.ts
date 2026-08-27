import type { AiCase } from '../types';
import { label } from './taxonomy';

/** Экранирование значения для CSV по RFC 4180. */
function csvCell(value: unknown): string {
  const s = value == null ? '' : String(value);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const COLUMNS: { key: string; get: (c: AiCase) => string }[] = [
  { key: 'id', get: (c) => c.id },
  { key: 'title', get: (c) => c.title },
  { key: 'client', get: (c) => c.client },
  { key: 'client_disclosed', get: (c) => String(c.client_disclosed) },
  { key: 'vendor', get: (c) => c.vendor.join('; ') },
  { key: 'vendor_type', get: (c) => (c.vendor_type ? label('vendor_type', c.vendor_type) : '') },
  { key: 'technology_providers', get: (c) => (c.technology_providers ?? []).join('; ') },
  { key: 'country', get: (c) => c.country },
  { key: 'region', get: (c) => label('region', c.region) },
  { key: 'industry', get: (c) => label('industry', c.industry) },
  { key: 'subindustry', get: (c) => c.subindustry.map((s) => label('subindustry', s)).join('; ') },
  { key: 'business_function', get: (c) => c.business_function.map((s) => label('business_function', s)).join('; ') },
  { key: 'business_process', get: (c) => c.business_process.map((s) => label('business_process', s)).join('; ') },
  { key: 'ai_mechanisms', get: (c) => c.ai_mechanisms.map((s) => label('ai_mechanisms', s)).join('; ') },
  { key: 'problem', get: (c) => c.problem },
  { key: 'before_state', get: (c) => c.before_state ?? '' },
  { key: 'solution', get: (c) => c.solution },
  { key: 'scale', get: (c) => c.scale ?? '' },
  { key: 'stage', get: (c) => label('stage', c.stage) },
  { key: 'deployment', get: (c) => label('deployment', c.deployment) },
  {
    key: 'metrics',
    get: (c) =>
      c.metrics
        .map((m) => `${m.metric_name}: ${m.baseline ? `${m.baseline} -> ` : ''}${m.result}${m.delta ? ` (${m.delta})` : ''} [${m.status}]`)
        .join(' | '),
  },
  { key: 'metric_sources', get: (c) => c.metrics.map((m) => m.source_url).join(' | ') },
  { key: 'result_summary', get: (c) => c.result_summary },
  { key: 'timeline', get: (c) => c.timeline ?? '' },
  { key: 'budget_disclosed', get: (c) => (c.budget_disclosed == null ? '' : String(c.budget_disclosed)) },
  { key: 'evidence_grade', get: (c) => c.evidence_grade },
  { key: 'vendor_claim', get: (c) => String(c.vendor_claim) },
  { key: 'sales_relevance', get: (c) => String(c.sales_relevance) },
  { key: 'why_it_matters', get: (c) => c.why_it_matters ?? '' },
  { key: 'entry_hypothesis', get: (c) => c.entry_hypothesis ?? '' },
  { key: 'likely_buyer', get: (c) => (c.likely_buyer ?? []).map((s) => label('likely_buyer', s)).join('; ') },
  { key: 'land_opportunity', get: (c) => c.land_opportunity ?? '' },
  { key: 'expand_opportunities', get: (c) => (c.expand_opportunities ?? []).join('; ') },
  { key: 'primary_source', get: (c) => c.primary_source ?? '' },
  { key: 'sources', get: (c) => c.sources.map((s) => s.url).join(' | ') },
  { key: 'tags', get: (c) => (c.tags ?? []).join('; ') },
];

export function casesToCsv(list: readonly AiCase[]): string {
  const head = COLUMNS.map((c) => c.key).join(',');
  const rows = list.map((c) => COLUMNS.map((col) => csvCell(col.get(c))).join(','));
  return [head, ...rows].join('\r\n');
}

/**
 * Отдаёт файл пользователю. Blob + object URL, никакой сети — приложение остаётся статическим.
 * BOM нужен, чтобы Excel открыл кириллический CSV в UTF-8.
 */
export function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([mime.startsWith('text/csv') ? '﻿' + content : content], {
    type: `${mime};charset=utf-8`,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function stamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function exportCsv(list: readonly AiCase[]): void {
  download(`ai-cases-${stamp()}.csv`, casesToCsv(list), 'text/csv');
}

export function exportJson(list: readonly AiCase[]): void {
  download(`ai-cases-${stamp()}.json`, JSON.stringify(list, null, 2), 'application/json');
}
