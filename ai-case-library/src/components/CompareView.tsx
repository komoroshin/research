import type { AiCase } from '../types';
import { label, labels } from '../lib/taxonomy';
import { Grade, Stars } from './Badges';

interface Props {
  items: readonly AiCase[];
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
}

const ROWS: { title: string; render: (c: AiCase) => React.ReactNode }[] = [
  { title: 'Отрасль', render: (c) => `${label('industry', c.industry)}${c.subindustry.length ? ` — ${labels('subindustry', c.subindustry)}` : ''}` },
  { title: 'Процесс', render: (c) => labels('business_process', c.business_process) },
  { title: 'Проблема', render: (c) => c.problem },
  { title: 'Решение', render: (c) => c.solution },
  { title: 'Технология', render: (c) => labels('ai_mechanisms', c.ai_mechanisms) },
  { title: 'Масштаб', render: (c) => c.scale || 'unknown' },
  {
    title: 'Результаты',
    render: (c) =>
      c.metrics.length === 0 ? (
        <span style={{ color: 'var(--text-muted)' }}>цифр нет</span>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {c.metrics.map((m, i) => (
            <li key={i}>
              {m.metric_name}: <b className="num">{m.result}</b>
              {m.delta ? <span className="num"> ({m.delta})</span> : null}{' '}
              <span className={`mstatus ${m.status}`}>{m.status}</span>
            </li>
          ))}
        </ul>
      ),
  },
  { title: 'Подрядчик', render: (c) => (c.vendor.length ? c.vendor.join(', ') : 'внутренняя команда') },
  { title: 'Стадия', render: (c) => label('stage', c.stage) },
  { title: 'Развёртывание', render: (c) => label('deployment', c.deployment) },
  { title: 'Evidence', render: (c) => <Grade grade={c.evidence_grade} vendorClaim={c.vendor_claim} /> },
  { title: 'Sales relevance', render: (c) => <Stars value={c.sales_relevance} /> },
  { title: 'Гипотеза входа', render: (c) => c.entry_hypothesis || '—' },
];

export default function CompareView({ items, onRemove, onOpen }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty">
        <h3>Сравнение пусто</h3>
        <p>
          Отметьте до четырёх кейсов кнопкой «+ сравнить» на карточке — здесь они встанут рядом
          по отрасли, процессу, масштабу, технологии, результатам и качеству доказательств.
        </p>
      </div>
    );
  }

  return (
    <div className="compare-wrap">
      <table className="compare">
        <thead>
          <tr>
            <th className="rowlbl">Параметр</th>
            {items.map((c) => (
              <th key={c.id}>
                <button
                  className="btn btn-sm"
                  style={{ float: 'right', marginLeft: 8 }}
                  onClick={() => onRemove(c.id)}
                  aria-label={`Убрать ${c.client} из сравнения`}
                >
                  ✕
                </button>
                <a
                  href="#case"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpen(c.id);
                  }}
                >
                  {c.client}
                </a>
                <div style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-faint)' }}>{c.country}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.title}>
              <th className="rowlbl">{row.title}</th>
              {items.map((c) => (
                <td key={c.id}>{row.render(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
