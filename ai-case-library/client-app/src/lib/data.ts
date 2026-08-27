import casesJson from '../generated/client-cases.json';
import taxonomyJson from '../../../data/taxonomy.json';
import type { ClientCase, ClientFilters } from '../types';

export const cases = casesJson as unknown as ClientCase[];

interface Term {
  id: string;
  label_ru: string;
  [k: string]: unknown;
}

/** Из общей таксономии клиентской версии нужны только подписи — без служебных справочников. */
const tax = taxonomyJson as unknown as {
  industries: (Term & { subindustries: Term[] })[];
  business_processes: Term[];
  ai_mechanisms: Term[];
  stages: Term[];
  deployments: Term[];
  metric_status: Term[];
};

const labelIndex = new Map<string, string>();
for (const group of [
  tax.industries,
  tax.industries.flatMap((i) => i.subindustries),
  tax.business_processes,
  tax.ai_mechanisms,
  tax.stages,
  tax.deployments,
  tax.metric_status,
]) {
  for (const t of group) labelIndex.set(t.id, t.label_ru);
}

export const label = (id: string): string => labelIndex.get(id) ?? id;
export const labels = (ids?: readonly string[]): string =>
  ids?.length ? ids.map(label).join(', ') : '—';

export interface IndustryTile {
  id: string;
  name: string;
  count: number;
  ru: number;
  measured: number;
  topProcesses: { id: string; name: string; count: number }[];
}

/** Плитки отраслей для главной: сколько кейсов, сколько российских, ведущие процессы. */
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
      measured: list.filter((c) => c.metrics.some((m) => m.status === 'measured')).length,
      topProcesses: [...proc.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, count]) => ({ id, name: label(id), count })),
    });
  }
  return tiles.sort((a, b) => b.count - a.count);
}

/** Процессы, реально встречающиеся в выбранных отраслях, — для чипов фильтра. */
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

const haystacks = new WeakMap<ClientCase, string>();
function haystack(c: ClientCase): string {
  let h = haystacks.get(c);
  if (h === undefined) {
    h = normalize(
      [
        c.title, c.client, c.country, c.problem, c.solution, c.result_summary,
        c.scale ?? '', c.first_step ?? '',
        ...(c.growth_paths ?? []), ...(c.tags ?? []), ...c.vendor,
        ...(c.technology_providers ?? []),
        ...c.business_process.map(label), ...c.ai_mechanisms.map(label),
        label(c.industry),
        ...c.metrics.map((m) => `${m.metric_name} ${m.result}`),
      ].join('  '),
    );
    haystacks.set(c, h);
  }
  return h;
}

export const emptyFilters: ClientFilters = {
  q: '',
  industry: [],
  business_process: [],
  measured_only: false,
};

export function applyFilters(f: ClientFilters): ClientCase[] {
  const terms = normalize(f.q).split(' ').filter(Boolean);
  return cases.filter((c) => {
    if (f.industry.length && !f.industry.includes(c.industry)) return false;
    if (f.business_process.length && !c.business_process.some((p) => f.business_process.includes(p))) return false;
    if (f.measured_only && !c.metrics.some((m) => m.status === 'measured')) return false;
    if (terms.length) {
      const h = haystack(c);
      if (!terms.every((t) => h.includes(t))) return false;
    }
    return true;
  });
}

/** Состояние в URL: ссылку на подборку под отрасль клиента можно отправить ему напрямую. */
export function stateToParams(f: ClientFilters, view: string, caseId: string | null, compare: readonly string[]): string {
  const p = new URLSearchParams();
  if (view !== 'home') p.set('view', view);
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.industry.length) p.set('industry', f.industry.join('~'));
  if (f.business_process.length) p.set('process', f.business_process.join('~'));
  if (f.measured_only) p.set('measured', '1');
  if (caseId) p.set('case', caseId);
  if (compare.length) p.set('compare', compare.join('~'));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function parseState(search: string): {
  filters: ClientFilters; view: string; caseId: string | null; compare: string[];
} {
  const p = new URLSearchParams(search);
  return {
    filters: {
      q: p.get('q') ?? '',
      industry: (p.get('industry') ?? '').split('~').filter(Boolean),
      business_process: (p.get('process') ?? '').split('~').filter(Boolean),
      measured_only: p.get('measured') === '1',
    },
    view: p.get('view') ?? 'home',
    caseId: p.get('case'),
    compare: (p.get('compare') ?? '').split('~').filter(Boolean).slice(0, 4),
  };
}

export const TELEGRAM = 'https://t.me/kmoroshin';

/** Текст заявки, который CTA кладёт в буфер обмена перед открытием Telegram. */
export function ctaMessage(c: ClientCase): string {
  return `Хочу так же: «${c.title}» (кейс ${c.client}, отрасль «${label(c.industry)}»). Обсудим, как это может выглядеть у нас?`;
}
