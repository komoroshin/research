import type { ScaleCase } from '../types';
import { budgetLabel, durationLabel, label, labels } from '../lib/data';

interface Props {
  items: readonly ScaleCase[];
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
}

const ROWS: { title: string; render: (c: ScaleCase) => React.ReactNode }[] = [
  { title: 'Отрасль', render: (c) => label(c.industry) },
  { title: 'Кто заказчик', render: (c) => c.client_profile },
  { title: 'Боль', render: (c) => c.pain },
  { title: 'Задача', render: (c) => c.problem },
  { title: 'Что внедрили', render: (c) => c.solution },
  { title: 'Технология', render: (c) => labels(c.ai_mechanisms) },
  { title: 'Бюджет', render: (c) => budgetLabel(c) },
  { title: 'Сроки', render: (c) => durationLabel(c.duration_months) },
  {
    title: 'Что изменилось',
    render: (c) =>
      c.metrics.length === 0 ? (
        <span style={{ color: 'var(--text-muted)' }}>цифры не раскрыты</span>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {c.metrics.map((m, i) => (
            <li key={i}>
              {m.name}: <b className="num">{m.result}</b>
            </li>
          ))}
        </ul>
      ),
  },
  { title: 'Год', render: (c) => c.year },
];

export default function CompareView({ items, onRemove, onOpen }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty">
        <h3>Сравнение пусто</h3>
        <p>Отметьте до четырёх кейсов кнопкой «+ сравнить» — здесь они встанут рядом.</p>
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
                  aria-label={`Убрать кейс из сравнения`}
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
                  {c.title}
                </a>
                <div style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-faint)' }}>{budgetLabel(c)}</div>
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
