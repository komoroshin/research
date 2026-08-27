import taxonomyJson from '../../data/taxonomy.json';
import casesJson from '../../data/cases.json';
import type { AiCase, Taxonomy, TaxonomyTerm } from '../types';

export const taxonomy = taxonomyJson as unknown as Taxonomy;
export const cases = (casesJson as unknown as AiCase[]).slice();

/** Построить индекс id → term для быстрых подписей. */
function index(terms: readonly TaxonomyTerm[]): Map<string, TaxonomyTerm> {
  return new Map(terms.map((t) => [t.id, t]));
}

const allSubindustries = taxonomy.industries.flatMap((i) => i.subindustries);

export const idx = {
  industry: index(taxonomy.industries),
  subindustry: index(allSubindustries),
  business_function: index(taxonomy.business_functions),
  business_process: index(taxonomy.business_processes),
  ai_mechanisms: index(taxonomy.ai_mechanisms),
  metric_type: index(taxonomy.metric_types),
  metric_group: index(taxonomy.metric_groups),
  metric_status: index(taxonomy.metric_status),
  source_type: index(taxonomy.source_types),
  evidence_grade: index(taxonomy.evidence_grades),
  stage: index(taxonomy.stages),
  deployment: index(taxonomy.deployments),
  vendor_type: index(taxonomy.vendor_types),
  region: index(taxonomy.regions),
  likely_buyer: index(taxonomy.likely_buyers),
};

type IdxKey = keyof typeof idx;

/** Русская подпись для id из таксономии. Неизвестный id возвращается как есть — данные важнее красоты. */
export function label(kind: IdxKey, id: string): string {
  const term = idx[kind].get(id);
  return (term?.label_ru as string) ?? id;
}

export function labels(kind: IdxKey, ids: readonly string[] | undefined): string {
  if (!ids || ids.length === 0) return '—';
  return ids.map((id) => label(kind, id)).join(', ');
}

/** Группа метрики (time/cost/…) по её типу. */
export function metricGroupOf(metricType: string): string | undefined {
  return idx.metric_type.get(metricType)?.group as string | undefined;
}

/** Все подотрасли выбранных отраслей — для каскадного фильтра. */
export function subindustriesFor(industryIds: readonly string[]): TaxonomyTerm[] {
  if (industryIds.length === 0) return allSubindustries;
  const set = new Set(industryIds);
  return taxonomy.industries.filter((i) => set.has(i.id)).flatMap((i) => i.subindustries);
}

/** Уникальные подрядчики по всей базе, отсортированные по числу кейсов. */
export function vendorList(all: readonly AiCase[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of all) for (const v of c.vendor) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru'));
}

export function countryList(all: readonly AiCase[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of all) counts.set(c.country, (counts.get(c.country) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru'));
}
