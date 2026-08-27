import casesJson from '../generated/scale-cases.json';
import taxonomyJson from '../../../data/taxonomy.json';
import type { BudgetBand, ScaleCase, ScaleFilters } from '../types';

export const cases = casesJson as unknown as ScaleCase[];

interface Term {
  id: string;
  label_ru: string;
  [k: string]: unknown;
}

const tax = taxonomyJson as unknown as {
  industries: (Term & { subindustries: Term[] })[];
  business_processes: Term[];
  ai_mechanisms: Term[];
  stages: Term[];
};

const labelIndex = new Map<string, string>();
for (const group of [
  tax.industries,
  tax.industries.flatMap((i) => i.subindustries),
  tax.business_processes,
  tax.ai_mechanisms,
  tax.stages,
]) {
  for (const t of group) labelIndex.set(t.id, t.label_ru);
}

export const label = (id: string): string => labelIndex.get(id) ?? id;
export const labels = (ids?: readonly string[]): string =>
  ids?.length ? ids.map(label).join(', ') : '—';

export const BUDGET_LABEL: Record<BudgetBand, string> = {
  usd_50_200k: '$50–200 тыс.',
  usd_200k_1m: '$200 тыс. – 1 млн',
  undisclosed: 'бюджет не раскрыт',
};

export function budgetLabel(c: ScaleCase): string {
  if (c.budget_band !== 'undisclosed') return BUDGET_LABEL[c.budget_band];
  return c.budget_note ?? BUDGET_LABEL.undisclosed;
}

export function durationLabel(m: number | null): string {
  if (!m) return 'не раскрыты';
  if (m % 10 === 1 && m % 100 !== 11) return `${m} месяц`;
  if ([2, 3, 4].includes(m % 10) && ![12, 13, 14].includes(m % 100)) return `${m} месяца`;
  return `${m} месяцев`;
}

export interface IndustryTile {
  id: string;
  name: string;
  count: number;
  ru: number;
  withBudget: number;
  topProcesses: { id: string; name: string; count: number }[];
}

export function industryTiles(): IndustryTile[] {
  const tiles: IndustryTile[] = [];
  for (const ind of tax.industries) {
    const list = cases.filter((c) => c.industry === ind.id);
    if (list.length === 0) continue;
    const proc = new Map<string, number>();
    for (const c of list) for (const p of new Set(c.business_process)) proc.set(p, (proc.get(p) ?? 0) + 1);
    tiles.push({
      id: ind.id,
      name: ind.label_ru,
      count: list.length,
      ru: list.filter((c) => c.region === 'russia-cis').length,
      withBudget: list.filter((c) => c.budget_band !== 'undisclosed').length,
      topProcesses: [...proc.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, count]) => ({ id, name: label(id), count })),
    });
  }
  return tiles.sort((a, b) => b.count - a.count);
}

export function processesFor(industryIds: readonly string[]): { id: string; name: string; count: number }[] {
  const pool = industryIds.length ? cases.filter((c) => industryIds.includes(c.industry)) : cases;
  const m = new Map<string, number>();
  for (const c of pool) for (const p of new Set(c.business_process)) m.set(p, (m.get(p) ?? 0) + 1);
  return tax.business_processes
    .filter((p) => m.has(p.id))
    .map((p) => ({ id: p.id, name: p.label_ru, count: m.get(p.id)! }))
    .sort((a, b) => b.count - a.count);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
}

const haystacks = new WeakMap<ScaleCase, string>();
function haystack(c: ScaleCase): string {
  let h = haystacks.get(c);
  if (h === undefined) {
    h = normalize(
      [
        c.title, c.client_profile, c.geo, c.pain, c.problem, c.solution, c.result_summary,
        ...c.business_process.map(label), ...c.ai_mechanisms.map(label),
        label(c.industry),
        ...c.metrics.map((m) => `${m.name} ${m.result}`),
      ].join('  '),
    );
    haystacks.set(c, h);
  }
  return h;
}

export const emptyFilters: ScaleFilters = {
  q: '',
  industry: [],
  business_process: [],
  budget: [],
  with_numbers: false,
};

export function applyFilters(f: ScaleFilters): ScaleCase[] {
  const terms = normalize(f.q).split(' ').filter(Boolean);
  return cases.filter((c) => {
    if (f.industry.length && !f.industry.includes(c.industry)) return false;
    if (f.business_process.length && !c.business_process.some((p) => f.business_process.includes(p))) return false;
    if (f.budget.length && !f.budget.includes(c.budget_band)) return false;
    if (f.with_numbers && c.metrics.length === 0) return false;
    if (terms.length) {
      const h = haystack(c);
      if (!terms.every((t) => h.includes(t))) return false;
    }
    return true;
  });
}

export function stateToParams(f: ScaleFilters, view: string, caseId: string | null, compare: readonly string[]): string {
  const p = new URLSearchParams();
  if (view !== 'home') p.set('view', view);
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.industry.length) p.set('industry', f.industry.join('~'));
  if (f.business_process.length) p.set('process', f.business_process.join('~'));
  if (f.budget.length) p.set('budget', f.budget.join('~'));
  if (f.with_numbers) p.set('numbers', '1');
  if (caseId) p.set('case', caseId);
  if (compare.length) p.set('compare', compare.join('~'));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function parseState(search: string): {
  filters: ScaleFilters; view: string; caseId: string | null; compare: string[];
} {
  const p = new URLSearchParams(search);
  return {
    filters: {
      q: p.get('q') ?? '',
      industry: (p.get('industry') ?? '').split('~').filter(Boolean),
      business_process: (p.get('process') ?? '').split('~').filter(Boolean),
      budget: (p.get('budget') ?? '').split('~').filter(Boolean) as ScaleFilters['budget'],
      with_numbers: p.get('numbers') === '1',
    },
    view: p.get('view') ?? 'home',
    caseId: p.get('case'),
    compare: (p.get('compare') ?? '').split('~').filter(Boolean).slice(0, 4),
  };
}

export const TELEGRAM = 'https://t.me/kmoroshin';

/** Текст заявки для CTA. Имён клиентов в каталоге нет — заявка ссылается на название кейса. */
export function ctaMessage(c: ScaleCase): string {
  return `Хочу так же: «${c.title}» (отрасль «${label(c.industry)}», ${budgetLabel(c)}). Обсудим, как это может выглядеть у нас?`;
}
