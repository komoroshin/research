import type { ScaleCase, ScaleFilters } from '../types';
import { BUDGET_LABEL, durationLabel, label, processesFor } from '../lib/data';
import { BudgetBadge, headlineMetric } from './Shared';

interface Props {
  list: readonly ScaleCase[];
  filters: ScaleFilters;
  setFilters: (updater: (f: ScaleFilters) => ScaleFilters) => void;
  onOpen: (id: string) => void;
  compare: readonly string[];
  onToggleCompare: (id: string) => void;
  onBackHome: () => void;
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 24)).trimEnd() + '…';
}

const BUDGET_CHIPS = ['usd_50_200k', 'usd_200k_1m'] as const;

export default function CaseList({
  list, filters, setFilters, onOpen, compare, onToggleCompare, onBackHome,
}: Props) {
  const procs = processesFor(filters.industry);
  const industryTitle =
    filters.industry.length === 1 ? label(filters.industry[0]) : 'Все отрасли';

  return (
    <>
      <button className="backlink" onClick={onBackHome}>
        ← Все отрасли
      </button>
      <h2 style={{ margin: '0 0 4px', letterSpacing: '-0.01em' }}>{industryTitle}</h2>
      <p style={{ margin: '0 0 14px', color: 'var(--text-muted)', fontSize: 13.5 }}>
        Выберите задачу, похожую на вашу, — внутри видно, что сделали,
        что изменилось, в каком бюджете и в какие сроки.
      </p>

      <div className="proc-chips">
        {BUDGET_CHIPS.map((b) => (
          <button
            className="chip"
            key={b}
            data-on={filters.budget.includes(b)}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                budget: f.budget.includes(b) ? f.budget.filter((x) => x !== b) : [...f.budget, b],
              }))
            }
          >
            бюджет {BUDGET_LABEL[b]}
          </button>
        ))}
        <button
          className="chip"
          data-on={filters.with_numbers}
          onClick={() => setFilters((f) => ({ ...f, with_numbers: !f.with_numbers }))}
        >
          только с цифрами результата
        </button>
        {procs.map((p) => (
          <button
            className="chip"
            key={p.id}
            data-on={filters.business_process.includes(p.id)}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                business_process: f.business_process.includes(p.id)
                  ? f.business_process.filter((x) => x !== p.id)
                  : [...f.business_process, p.id],
              }))
            }
          >
            {p.name} <b className="num">{p.count}</b>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <h3>По этим условиям кейсов нет</h3>
          <p>Снимите часть фильтров — или напишите нам: возможно, похожий проект уже есть, просто ещё не опубликован.</p>
        </div>
      ) : (
        <div className="cards">
          {list.map((c) => {
            const metric = headlineMetric(c);
            const picked = compare.includes(c.id);
            return (
              <article
                key={c.id}
                className={`card${picked ? ' picked' : ''}`}
                onClick={() => onOpen(c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen(c.id);
                  }
                }}
              >
                {/* Результат — первым, это причина открыть кейс */}
                {metric ? (
                  <div className="card-headline">
                    <span className="chl-value">{metric.result}</span>
                    <span className="chl-name">{c.headline ?? metric.name}</span>
                  </div>
                ) : (
                  <div className="card-title" style={{ fontSize: 16 }}>{c.title}</div>
                )}

                <div className="card-geo" style={{ marginBottom: 6 }}>
                  {c.client_profile} · {label(c.industry)}
                </div>

                <div className="card-field">
                  <span className="lbl">Боль</span>
                  {clamp(c.pain, 140)}
                </div>

                <div className="card-foot">
                  <BudgetBadge item={c} />
                  {c.duration_months ? <span className="tag">{durationLabel(c.duration_months)}</span> : null}
                  <span className="spacer" />
                  <button
                    className="pickbtn"
                    data-on={picked}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(c.id);
                    }}
                    title="Положить рядом для сравнения (до 4 кейсов)"
                  >
                    {picked ? '✓ в сравнении' : '+ сравнить'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
