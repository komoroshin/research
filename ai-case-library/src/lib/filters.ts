import type { AiCase, Filters } from '../types';
import { metricGroupOf } from './taxonomy';

export const emptyFilters: Filters = {
  q: '',
  region: [],
  country: [],
  industry: [],
  subindustry: [],
  business_function: [],
  business_process: [],
  ai_mechanisms: [],
  vendor: [],
  evidence_grade: [],
  stage: [],
  deployment: [],
  metric_group: [],
  sales_relevance_min: 0,
  has_metrics: false,
  measured_only: false,
  named_client: false,
};

/**
 * Нормализация текста для поиска: нижний регистр, унификация "ё", схлопывание пробелов.
 * Поддерживает русский и английский; морфологии нет, поиск идёт по подстроке.
 */
function normalize(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
}

const haystacks = new WeakMap<AiCase, string>();

/** Строка для полнотекстового поиска: компания, вендор, проблема, решение, отрасль, процесс, теги. */
function haystack(c: AiCase): string {
  const cached = haystacks.get(c);
  if (cached !== undefined) return cached;
  const parts = [
    c.title,
    c.client,
    c.country,
    ...c.vendor,
    ...(c.technology_providers ?? []),
    c.problem,
    c.before_state ?? '',
    c.solution,
    c.result_summary,
    c.scale ?? '',
    c.why_it_matters ?? '',
    c.entry_hypothesis ?? '',
    c.land_opportunity ?? '',
    ...(c.expand_opportunities ?? []),
    ...(c.tags ?? []),
    ...(c.data_used ?? []),
    ...(c.integrations ?? []),
    c.industry,
    ...c.subindustry,
    ...c.business_process,
    ...c.ai_mechanisms,
    ...c.metrics.map((m) => `${m.metric_name} ${m.result} ${m.baseline ?? ''} ${m.delta ?? ''}`),
  ];
  const value = normalize(parts.join('  '));
  haystacks.set(c, value);
  return value;
}

/** Кейс проходит, только если удовлетворяет всем группам фильтров: AND между группами, OR внутри группы. */
export function applyFilters(all: readonly AiCase[], f: Filters): AiCase[] {
  const terms = normalize(f.q).split(' ').filter(Boolean);

  return all.filter((c) => {
    if (f.region.length && !f.region.includes(c.region)) return false;
    if (f.country.length && !f.country.includes(c.country)) return false;
    if (f.industry.length && !f.industry.includes(c.industry)) return false;
    if (f.subindustry.length && !c.subindustry.some((s) => f.subindustry.includes(s))) return false;
    if (f.business_function.length && !c.business_function.some((s) => f.business_function.includes(s))) return false;
    if (f.business_process.length && !c.business_process.some((s) => f.business_process.includes(s))) return false;
    if (f.ai_mechanisms.length && !c.ai_mechanisms.some((s) => f.ai_mechanisms.includes(s))) return false;
    if (f.vendor.length && !c.vendor.some((v) => f.vendor.includes(v))) return false;
    if (f.evidence_grade.length && !f.evidence_grade.includes(c.evidence_grade)) return false;
    if (f.stage.length && !f.stage.includes(c.stage)) return false;
    if (f.deployment.length && !f.deployment.includes(c.deployment)) return false;

    if (f.metric_group.length) {
      const groups = new Set(
        c.metrics.map((m) => metricGroupOf(m.metric_type)).filter(Boolean) as string[],
      );
      if (!f.metric_group.some((g) => groups.has(g))) return false;
    }

    if (f.sales_relevance_min > 0 && c.sales_relevance < f.sales_relevance_min) return false;
    if (f.has_metrics && c.metrics.length === 0) return false;
    if (f.measured_only && !c.metrics.some((m) => m.status === 'measured')) return false;
    if (f.named_client && !c.client_disclosed) return false;

    if (terms.length) {
      const h = haystack(c);
      if (!terms.every((t) => h.includes(t))) return false;
    }
    return true;
  });
}

const ARRAY_KEYS = [
  'region',
  'country',
  'industry',
  'subindustry',
  'business_function',
  'business_process',
  'ai_mechanisms',
  'vendor',
  'evidence_grade',
  'stage',
  'deployment',
  'metric_group',
] as const;

export function activeFilterCount(f: Filters): number {
  let n = 0;
  if (f.q.trim()) n++;
  for (const key of ARRAY_KEYS) n += f[key].length ? 1 : 0;
  if (f.sales_relevance_min > 0) n++;
  if (f.has_metrics) n++;
  if (f.measured_only) n++;
  if (f.named_client) n++;
  return n;
}

/** Фильтры в строку запроса, чтобы ссылку на подборку можно было отправить коллеге или клиенту. */
export function filtersToParams(
  f: Filters,
  view: string,
  selected: readonly string[],
  caseId: string | null,
): string {
  const p = new URLSearchParams();
  if (view !== 'dashboard') p.set('view', view);
  if (f.q.trim()) p.set('q', f.q.trim());
  for (const key of ARRAY_KEYS) {
    if (f[key].length) p.set(key, f[key].join('~'));
  }
  if (f.sales_relevance_min > 0) p.set('sales_min', String(f.sales_relevance_min));
  if (f.has_metrics) p.set('metrics', '1');
  if (f.measured_only) p.set('measured', '1');
  if (f.named_client) p.set('named', '1');
  if (selected.length) p.set('compare', selected.join('~'));
  if (caseId) p.set('case', caseId);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export interface ParsedState {
  filters: Filters;
  view: string;
  selected: string[];
  caseId: string | null;
}

export function parseParams(search: string): ParsedState {
  const p = new URLSearchParams(search);
  const filters: Filters = { ...emptyFilters, q: p.get('q') ?? '' };
  for (const key of ARRAY_KEYS) {
    const raw = p.get(key);
    if (raw) filters[key] = raw.split('~').filter(Boolean);
  }
  const min = Number(p.get('sales_min'));
  filters.sales_relevance_min = Number.isFinite(min) && min > 0 ? Math.min(5, Math.trunc(min)) : 0;
  filters.has_metrics = p.get('metrics') === '1';
  filters.measured_only = p.get('measured') === '1';
  filters.named_client = p.get('named') === '1';

  return {
    filters,
    view: p.get('view') ?? 'dashboard',
    selected: (p.get('compare') ?? '').split('~').filter(Boolean).slice(0, 4),
    caseId: p.get('case'),
  };
}
