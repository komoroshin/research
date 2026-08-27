import type { AiCase } from '../types';
import { label } from '../lib/taxonomy';
import { Grade, Stars, MetricStatusBadge, headlineMetric } from './Badges';

interface Props {
  list: readonly AiCase[];
  onOpen: (id: string) => void;
  selected: readonly string[];
  onTogglePick: (id: string) => void;
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(' '), max - 24);
  return cut.slice(0, stop).trimEnd() + '…';
}

export default function CardsView({ list, onOpen, selected, onTogglePick }: Props) {
  return (
    <div className="cards">
      {list.map((c) => {
        const metric = headlineMetric(c);
        const picked = selected.includes(c.id);
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
            <div className="card-top">
              <div style={{ minWidth: 0 }}>
                <div className="card-client">
                  {c.client}
                  {!c.client_disclosed && (
                    <span
                      className="tag"
                      style={{ marginLeft: 6, verticalAlign: 'middle' }}
                      title="Имя клиента не раскрыто: NDA, агрегированные данные по нескольким клиентам либо источник не называет компанию"
                    >
                      имя не раскрыто
                    </span>
                  )}
                </div>
                <div className="card-geo">
                  {c.country} · {label('industry', c.industry)}
                </div>
              </div>
            </div>

            <div className="card-title">{c.title}</div>

            <div className="card-meta">
              {c.business_process.slice(0, 2).map((p) => (
                <span className="tag" key={p}>
                  {label('business_process', p)}
                </span>
              ))}
              {c.ai_mechanisms.slice(0, 3).map((m) => (
                <span className="tag mech" key={m}>
                  {label('ai_mechanisms', m)}
                </span>
              ))}
            </div>

            <div className="card-field">
              <span className="lbl">Проблема</span>
              {clamp(c.problem, 150)}
            </div>

            <div className="card-field">
              <span className="lbl">Решение</span>
              {clamp(c.solution, 150)}
            </div>

            <div className="card-result">
              {metric ? (
                <div className="card-metric">
                  <span>{metric.metric_name}:</span>
                  {metric.baseline && <span style={{ color: 'var(--text-faint)' }}>{metric.baseline} →</span>}
                  <span className="val">{metric.result}</span>
                  {metric.delta && <span className="val">({metric.delta})</span>}
                  <MetricStatusBadge status={metric.status} />
                </div>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>{clamp(c.result_summary, 160)}</span>
              )}
            </div>

            <div className="card-foot">
              <Grade grade={c.evidence_grade} vendorClaim={c.vendor_claim} />
              <Stars value={c.sales_relevance} />
              <span className="spacer" />
              <button
                className="pickbtn"
                data-on={picked}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePick(c.id);
                }}
                title="Добавить в сравнение (до 4 кейсов)"
              >
                {picked ? '✓ в сравнении' : '+ сравнить'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
