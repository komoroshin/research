import { useEffect } from 'react';
import type { AiCase } from '../types';
import { label, labels } from '../lib/taxonomy';
import { Grade, Stars, MetricStatusBadge } from './Badges';

interface Props {
  item: AiCase;
  onClose: () => void;
  picked: boolean;
  onTogglePick: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

/** Ссылка на источник всегда открывается в новой вкладке (п.27 ТЗ). */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function CaseDetail({ item: c, onClose, picked, onTogglePick }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const primary = c.sources.find((s) => s.url === c.primary_source) ?? c.sources[0];
  const others = c.sources.filter((s) => s !== primary);
  const hasSalesLens =
    c.why_it_matters || c.entry_hypothesis || c.land_opportunity || (c.expand_opportunities?.length ?? 0) > 0;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Кейс: ${c.client}`}
      >
        <header className="drawer-head">
          <div style={{ minWidth: 0 }}>
            <h2>{c.client}</h2>
            <div className="sub">{c.title}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Grade grade={c.evidence_grade} vendorClaim={c.vendor_claim} />
              <Stars value={c.sales_relevance} />
              <span className="tag">{label('stage', c.stage)}</span>
              <span className="tag">{c.country}</span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </header>

        <div className="drawer-body">
          {/* Клиент, исполнитель и технология — разные роли, их нельзя смешивать (п.55 ТЗ). */}
          <div className="parties">
            <div className="party">
              <div className="lbl">Client — кому внедряли</div>
              <div className="val">
                {c.client_url ? <Ext href={c.client_url}>{c.client}</Ext> : c.client}
                {!c.client_disclosed && <span className="tag" style={{ marginLeft: 6 }}>под NDA</span>}
              </div>
            </div>
            <div className="party">
              <div className="lbl">Built by — кто внедрял</div>
              <div className="val">
                {c.vendor.length ? c.vendor.join(', ') : 'Внутренняя команда'}
                {c.vendor_type && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-faint)', fontWeight: 400 }}>
                    {label('vendor_type', c.vendor_type)}
                  </div>
                )}
              </div>
            </div>
            <div className="party">
              <div className="lbl">Technology</div>
              <div className="val">
                {c.technology_providers?.length ? c.technology_providers.join(', ') : '—'}
              </div>
            </div>
          </div>

          <Section title="Бизнес-проблема">
            <p>{c.problem}</p>
          </Section>

          {c.before_state && (
            <Section title="Как было до внедрения">
              <p>{c.before_state}</p>
            </Section>
          )}

          <Section title="Что внедрили и как это работает">
            <p>{c.solution}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {c.ai_mechanisms.map((m) => (
                <span className="tag mech" key={m}>
                  {label('ai_mechanisms', m)}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Классификация и масштаб">
            <dl className="kv">
              <dt>Отрасль</dt>
              <dd>
                {label('industry', c.industry)}
                {c.subindustry.length > 0 && ` — ${labels('subindustry', c.subindustry)}`}
              </dd>
              <dt>Бизнес-процесс</dt>
              <dd>{labels('business_process', c.business_process)}</dd>
              <dt>Бизнес-функция</dt>
              <dd>{labels('business_function', c.business_function)}</dd>
              <dt>Масштаб</dt>
              <dd>{c.scale || 'unknown'}</dd>
              <dt>Стадия</dt>
              <dd>{label('stage', c.stage)}</dd>
              <dt>Развёртывание</dt>
              <dd>{label('deployment', c.deployment)}</dd>
              <dt>Сроки</dt>
              <dd>{c.timeline || 'unknown'}</dd>
              <dt>Данные</dt>
              <dd>{c.data_used?.length ? c.data_used.join(', ') : 'unknown'}</dd>
              <dt>Интеграции</dt>
              <dd>{c.integrations?.length ? c.integrations.join(', ') : 'unknown'}</dd>
              <dt>Бюджет</dt>
              <dd>
                {c.budget_disclosed == null
                  ? 'не раскрыт'
                  : `${c.budget_disclosed.toLocaleString('ru-RU')}${c.budget_note ? ` — ${c.budget_note}` : ''}`}
              </dd>
            </dl>
          </Section>

          <Section title="Измеренные результаты">
            {c.metrics.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>
                Количественных показателей в открытых источниках нет. Итог по кейсу: {c.result_summary}
              </p>
            ) : (
              <>
                <div className="metric-list">
                  {c.metrics.map((m, i) => (
                    <div className={`metric ${m.status}`} key={i}>
                      <div className="nm">
                        {m.metric_name} <MetricStatusBadge status={m.status} />
                      </div>
                      <div className="vals">
                        {m.baseline && <span className="from">{m.baseline}</span>}
                        <span className="to">{m.result}</span>
                        {m.delta && <span className="delta">{m.delta}</span>}
                      </div>
                      <div className="src">
                        <Ext href={m.source_url}>источник цифры</Ext>
                        {m.source_type && (
                          <span style={{ color: 'var(--text-faint)' }}> · {label('source_type', m.source_type)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 10 }}>{c.result_summary}</p>
              </>
            )}
            {c.vendor_claim && (
              <div className="notice" style={{ marginTop: 10 }}>
                Цифры опубликованы стороной подрядчика или технологического партнёра и не подтверждены
                независимо. Это не делает кейс плохим, но происхождение данных стоит учитывать.
              </div>
            )}
          </Section>

          {hasSalesLens && (
            <section className="section sales">
              <h3>Sales Lens — интерпретация исследователя, а не факт из источника</h3>
              {c.why_it_matters && (
                <>
                  <div className="sub-h">Почему кейс важен</div>
                  <p>{c.why_it_matters}</p>
                </>
              )}
              {c.likely_buyer?.length ? (
                <>
                  <div className="sub-h">Кто вероятный покупатель</div>
                  <p>{labels('likely_buyer', c.likely_buyer)}</p>
                </>
              ) : null}
              {c.entry_hypothesis && (
                <>
                  <div className="sub-h">Гипотеза входа</div>
                  <p>{c.entry_hypothesis}</p>
                </>
              )}
              {c.land_opportunity && (
                <>
                  <div className="sub-h">Land — первый небольшой проект</div>
                  <p>{c.land_opportunity}</p>
                </>
              )}
              {c.expand_opportunities?.length ? (
                <>
                  <div className="sub-h">Expand — соседние процессы</div>
                  <p>{c.expand_opportunities.join(' · ')}</p>
                </>
              ) : null}
            </section>
          )}

          <Section title="Источники">
            <div className="sources">
              {primary && (
                <div className="source">
                  <span className="primary-flag">primary</span>
                  <Ext href={primary.url}>{primary.title || primary.url}</Ext>
                  <span className="pub">
                    {[primary.publisher, primary.type && label('source_type', primary.type), primary.date]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
              )}
              {others.map((s, i) => (
                <div className="source" key={i}>
                  <Ext href={s.url}>{s.title || s.url}</Ext>
                  <span className="pub">
                    {[s.publisher, s.type && label('source_type', s.type), s.date].filter(Boolean).join(' · ')}
                  </span>
                </div>
              ))}
            </div>
            {c.research_notes && (
              <div className="notice" style={{ marginTop: 10 }}>
                <strong>Заметки исследователя:</strong> {c.research_notes}
              </div>
            )}
          </Section>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className={picked ? 'btn btn-primary' : 'btn'} onClick={onTogglePick}>
              {picked ? '✓ В сравнении' : '+ Добавить в сравнение'}
            </button>
            <button
              className="btn"
              onClick={() => {
                void navigator.clipboard?.writeText(
                  `${window.location.origin}${window.location.pathname}?case=${encodeURIComponent(c.id)}`,
                );
              }}
            >
              Скопировать ссылку на кейс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
