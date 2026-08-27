#!/usr/bin/env node
/** Генерация data/cases.csv из data/cases.json (п.3 ТЗ). Подписи разворачиваются из таксономии. */
import fs from 'node:fs';
import path from 'node:path';
import { DATA, readJson, taxonomy, toCsv, COLORS } from './lib.mjs';

const labels = new Map();
const register = (terms) => {
  for (const t of terms) labels.set(t.id, t.label_ru);
};
register(taxonomy.industries);
register(taxonomy.industries.flatMap((i) => i.subindustries));
register(taxonomy.business_functions);
register(taxonomy.business_processes);
register(taxonomy.ai_mechanisms);
register(taxonomy.metric_types);
register(taxonomy.evidence_grades);
register(taxonomy.stages);
register(taxonomy.deployments);
register(taxonomy.vendor_types);
register(taxonomy.regions);
register(taxonomy.likely_buyers);
register(taxonomy.source_types);

const L = (id) => (id ? labels.get(id) ?? id : '');
const LS = (ids) => (ids ?? []).map(L).join('; ');

const cases = readJson(path.join(DATA, 'cases.json'));

const HEADERS = [
  'id', 'title', 'client', 'client_disclosed', 'client_url', 'vendor', 'vendor_type',
  'technology_providers', 'country', 'region', 'industry', 'subindustry',
  'business_function', 'business_process', 'ai_mechanisms', 'problem', 'before_state',
  'solution', 'data_used', 'integrations', 'scale', 'stage', 'deployment', 'timeline',
  'metrics', 'metric_sources', 'result_summary', 'budget_disclosed', 'budget_note',
  'evidence_grade', 'vendor_claim', 'sales_relevance', 'why_it_matters',
  'entry_hypothesis', 'likely_buyer', 'land_opportunity', 'expand_opportunities',
  'primary_source', 'sources', 'tags',
];

const rows = cases.map((c) => [
  c.id,
  c.title,
  c.client,
  c.client_disclosed,
  c.client_url ?? '',
  (c.vendor ?? []).join('; '),
  L(c.vendor_type),
  (c.technology_providers ?? []).join('; '),
  c.country,
  L(c.region),
  L(c.industry),
  LS(c.subindustry),
  LS(c.business_function),
  LS(c.business_process),
  LS(c.ai_mechanisms),
  c.problem,
  c.before_state ?? '',
  c.solution,
  (c.data_used ?? []).join('; '),
  (c.integrations ?? []).join('; '),
  c.scale ?? '',
  L(c.stage),
  L(c.deployment),
  c.timeline ?? '',
  (c.metrics ?? [])
    .map((m) => `${m.metric_name}: ${m.baseline ? `${m.baseline} -> ` : ''}${m.result}${m.delta ? ` (${m.delta})` : ''} [${m.status}]`)
    .join(' | '),
  (c.metrics ?? []).map((m) => m.source_url).join(' | '),
  c.result_summary,
  c.budget_disclosed ?? '',
  c.budget_note ?? '',
  c.evidence_grade,
  c.vendor_claim,
  c.sales_relevance,
  c.why_it_matters ?? '',
  c.entry_hypothesis ?? '',
  LS(c.likely_buyer),
  c.land_opportunity ?? '',
  (c.expand_opportunities ?? []).join('; '),
  c.primary_source ?? '',
  (c.sources ?? []).map((s) => s.url).join(' | '),
  (c.tags ?? []).join('; '),
]);

const out = path.join(DATA, 'cases.csv');
// BOM, чтобы Excel открыл кириллицу как UTF-8, а не как cp1251.
fs.writeFileSync(out, '﻿' + toCsv(HEADERS, rows), 'utf8');
console.log(COLORS.green(`data/cases.csv — ${rows.length} строк, ${HEADERS.length} колонок`));
