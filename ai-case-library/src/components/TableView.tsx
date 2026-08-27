import { useMemo, useState } from 'react';
import type { AiCase } from '../types';
import { label, labels } from '../lib/taxonomy';
import { Grade, Stars } from './Badges';

type SortKey =
  | 'client'
  | 'industry'
  | 'process'
  | 'ai'
  | 'vendor'
  | 'country'
  | 'metrics'
  | 'evidence'
  | 'sales';

const GRADE_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

interface Props {
  list: readonly AiCase[];
  onOpen: (id: string) => void;
}

const COLUMNS: { key: SortKey; title: string }[] = [
  { key: 'client', title: 'Клиент' },
  { key: 'industry', title: 'Отрасль' },
  { key: 'process', title: 'Процесс' },
  { key: 'ai', title: 'AI' },
  { key: 'vendor', title: 'Подрядчик' },
  { key: 'country', title: 'Страна' },
  { key: 'metrics', title: 'Результат' },
  { key: 'evidence', title: 'Evidence' },
  { key: 'sales', title: 'Sales' },
];

function value(c: AiCase, key: SortKey): string | number {
  switch (key) {
    case 'client': return c.client;
    case 'industry': return label('industry', c.industry);
    case 'process': return labels('business_process', c.business_process);
    case 'ai': return labels('ai_mechanisms', c.ai_mechanisms);
    case 'vendor': return c.vendor.join(', ');
    case 'country': return c.country;
    case 'metrics': return c.metrics.length;
    case 'evidence': return GRADE_ORDER[c.evidence_grade] ?? 9;
    case 'sales': return c.sales_relevance;
  }
}

export default function TableView({ list, onOpen }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'sales', dir: -1 });

  const sorted = useMemo(() => {
    const copy = [...list];
    copy.sort((a, b) => {
      const va = value(a, sort.key);
      const vb = value(b, sort.key);
      const cmp =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'ru');
      return cmp * sort.dir;
    });
    return copy;
  }, [list, sort]);

  const clickHead = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === 'sales' || key === 'metrics' ? -1 : 1 }));

  return (
    <div className="tablewrap">
      <table className="dense">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => clickHead(col.key)}
                aria-sort={sort.key === col.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}
              >
                {col.title}
                {sort.key === col.key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.id} onClick={() => onOpen(c.id)}>
              <td className="client">
                {c.client}
                <div style={{ fontWeight: 400, color: 'var(--text-faint)', fontSize: 11.5 }}>{c.title}</div>
              </td>
              <td>{label('industry', c.industry)}</td>
              <td>{labels('business_process', c.business_process)}</td>
              <td>{labels('ai_mechanisms', c.ai_mechanisms)}</td>
              <td>{c.vendor.length ? c.vendor.join(', ') : '—'}</td>
              <td className="nowrap">{c.country}</td>
              <td className="metrics">
                {c.metrics.length === 0
                  ? '—'
                  : c.metrics.slice(0, 2).map((m, i) => (
                      <div key={i}>
                        {m.metric_name}: <b className="num">{m.result}</b>
                        {m.delta ? <span className="num"> ({m.delta})</span> : null}
                      </div>
                    ))}
                {c.metrics.length > 2 && (
                  <div style={{ color: 'var(--text-faint)' }}>+ ещё {c.metrics.length - 2}</div>
                )}
              </td>
              <td className="nowrap">
                <Grade grade={c.evidence_grade} vendorClaim={c.vendor_claim} />
              </td>
              <td className="nowrap">
                <Stars value={c.sales_relevance} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
