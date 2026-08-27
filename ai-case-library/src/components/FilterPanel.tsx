import { useMemo } from 'react';
import type { AiCase, Filters } from '../types';
import { taxonomy, subindustriesFor, vendorList, countryList } from '../lib/taxonomy';
import { activeFilterCount } from '../lib/filters';

type ArrayKey = {
  [K in keyof Filters]: Filters[K] extends string[] ? K : never;
}[keyof Filters];

interface Props {
  filters: Filters;
  setFilters: (updater: (f: Filters) => Filters) => void;
  all: readonly AiCase[];
  /** Кейсы, прошедшие все остальные фильтры — для счётчиков рядом с опциями. */
  visible: readonly AiCase[];
  onReset: () => void;
}

interface Option {
  id: string;
  label: string;
  count: number;
}

function Group({
  title,
  options,
  selected,
  onToggle,
  openByDefault = false,
}: {
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (id: string) => void;
  openByDefault?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <details className="fgroup" open={openByDefault || selected.length > 0}>
      <summary>
        <span>{title}</span>
        {selected.length > 0 && <span className="badge-count">{selected.length}</span>}
      </summary>
      <div className="fgroup-body">
        {options.map((o) => (
          <label className="check" key={o.id}>
            <input
              type="checkbox"
              checked={selected.includes(o.id)}
              onChange={() => onToggle(o.id)}
            />
            <span>{o.label}</span>
            <span className="cnt">{o.count}</span>
          </label>
        ))}
      </div>
    </details>
  );
}

/** Счётчик кейсов по значению поля — считаем по видимой выборке, чтобы фильтры подсказывали объём. */
function counter(list: readonly AiCase[], get: (c: AiCase) => string | string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of list) {
    const v = get(c);
    for (const id of Array.isArray(v) ? v : [v]) m.set(id, (m.get(id) ?? 0) + 1);
  }
  return m;
}

/** Опции группы: подпись, счётчик, скрытие пустых (кроме уже выбранных), сортировка по объёму. */
function simple(
  terms: readonly { id: string; label_ru: string }[],
  counted: Map<string, number>,
  selected: readonly string[],
): Option[] {
  return terms
    .map((t) => ({ id: t.id, label: t.label_ru, count: counted.get(t.id) ?? 0 }))
    .filter((o) => o.count > 0 || selected.includes(o.id))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ru'));
}

export default function FilterPanel({ filters, setFilters, all, visible, onReset }: Props) {
  const toggle = (key: ArrayKey) => (id: string) =>
    setFilters((f) => {
      const cur = f[key];
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      // Смена отрасли делает выбранные подотрасли неактуальными — сбрасываем их.
      if (key === 'industry') {
        const allowed = new Set(subindustriesFor(next).map((s) => s.id));
        return { ...f, industry: next, subindustry: f.subindustry.filter((s) => allowed.has(s)) };
      }
      return { ...f, [key]: next };
    });

  const counts = useMemo(
    () => ({
      region: counter(visible, (c) => c.region),
      country: counter(visible, (c) => c.country),
      industry: counter(visible, (c) => c.industry),
      subindustry: counter(visible, (c) => c.subindustry),
      business_function: counter(visible, (c) => c.business_function),
      business_process: counter(visible, (c) => c.business_process),
      ai_mechanisms: counter(visible, (c) => c.ai_mechanisms),
      vendor: counter(visible, (c) => c.vendor),
      evidence_grade: counter(visible, (c) => c.evidence_grade),
      stage: counter(visible, (c) => c.stage),
      deployment: counter(visible, (c) => c.deployment),
    }),
    [visible],
  );

  const metricGroupCounts = useMemo(() => {
    const byType = new Map(taxonomy.metric_types.map((t) => [t.id, t.group]));
    const m = new Map<string, number>();
    for (const c of visible) {
      const groups = new Set<string>();
      for (const met of c.metrics) {
        const g = byType.get(met.metric_type);
        if (g) groups.add(g);
      }
      for (const g of groups) m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  }, [visible]);

  const vendors = useMemo(() => vendorList(all), [all]);
  const countries = useMemo(() => countryList(all), [all]);
  const activeCount = activeFilterCount(filters);

  return (
    <>
      <div className="filter-head">
        <h2>Фильтры{activeCount > 0 ? ` · ${activeCount}` : ''}</h2>
        <button className="btn btn-sm" onClick={onReset} disabled={activeCount === 0}>
          Сбросить
        </button>
      </div>

      <details className="fgroup" open>
        <summary>
          <span>Sales-отбор</span>
        </summary>
        <div className="fgroup-body">
          <div className="range-row">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sales relevance ≥</span>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={filters.sales_relevance_min}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sales_relevance_min: Number(e.target.value) }))
              }
            />
            <span className="num" style={{ width: 12 }}>
              {filters.sales_relevance_min || '—'}
            </span>
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={filters.has_metrics}
              onChange={() => setFilters((f) => ({ ...f, has_metrics: !f.has_metrics }))}
            />
            <span>Только с измеримым результатом</span>
          </label>
          <label className="check" title="Источник сообщает о фактически достигнутом результате, а не о заявленном или плановом эффекте">
            <input
              type="checkbox"
              checked={filters.measured_only}
              onChange={() => setFilters((f) => ({ ...f, measured_only: !f.measured_only }))}
            />
            <span>Только с измеренным (measured) результатом</span>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={filters.named_client}
              onChange={() => setFilters((f) => ({ ...f, named_client: !f.named_client }))}
            />
            <span>Только с названным клиентом</span>
          </label>
        </div>
      </details>

      <Group
        title="География"
        openByDefault
        options={simple(taxonomy.regions, counts.region, filters.region)}
        selected={filters.region}
        onToggle={toggle('region')}
      />
      <Group
        title="Страна"
        options={countries
          .map((c) => ({ id: c.name, label: c.name, count: counts.country.get(c.name) ?? 0 }))
          .filter((o) => o.count > 0 || filters.country.includes(o.id))}
        selected={filters.country}
        onToggle={toggle('country')}
      />
      <Group
        title="Отрасль"
        openByDefault
        options={simple(taxonomy.industries, counts.industry, filters.industry)}
        selected={filters.industry}
        onToggle={toggle('industry')}
      />
      <Group
        title="Подотрасль"
        options={simple(subindustriesFor(filters.industry), counts.subindustry, filters.subindustry)}
        selected={filters.subindustry}
        onToggle={toggle('subindustry')}
      />
      <Group
        title="Бизнес-процесс"
        openByDefault
        options={simple(taxonomy.business_processes, counts.business_process, filters.business_process)}
        selected={filters.business_process}
        onToggle={toggle('business_process')}
      />
      <Group
        title="Бизнес-функция"
        options={simple(taxonomy.business_functions, counts.business_function, filters.business_function)}
        selected={filters.business_function}
        onToggle={toggle('business_function')}
      />
      <Group
        title="AI-механика"
        openByDefault
        options={simple(taxonomy.ai_mechanisms, counts.ai_mechanisms, filters.ai_mechanisms)}
        selected={filters.ai_mechanisms}
        onToggle={toggle('ai_mechanisms')}
      />
      <Group
        title="Тип результата"
        options={simple(taxonomy.metric_groups, metricGroupCounts, filters.metric_group)}
        selected={filters.metric_group}
        onToggle={toggle('metric_group')}
      />
      <Group
        title="Качество доказательств"
        options={simple(taxonomy.evidence_grades, counts.evidence_grade, filters.evidence_grade)}
        selected={filters.evidence_grade}
        onToggle={toggle('evidence_grade')}
      />
      <Group
        title="Стадия"
        options={simple(taxonomy.stages, counts.stage, filters.stage)}
        selected={filters.stage}
        onToggle={toggle('stage')}
      />
      <Group
        title="Развёртывание"
        options={simple(taxonomy.deployments, counts.deployment, filters.deployment)}
        selected={filters.deployment}
        onToggle={toggle('deployment')}
      />
      <Group
        title="Подрядчик"
        options={vendors
          .map((v) => ({ id: v.name, label: v.name, count: counts.vendor.get(v.name) ?? 0 }))
          .filter((o) => o.count > 0 || filters.vendor.includes(o.id))}
        selected={filters.vendor}
        onToggle={toggle('vendor')}
      />
    </>
  );
}
