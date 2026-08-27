import { useEffect } from 'react';
import type { ClientCase } from '../types';
import { label, labels } from '../lib/data';
import { ConfidenceBadge, CtaButton, Ext, MetricStatusBadge } from './Shared';

interface Props {
  item: ClientCase;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export default function CaseDetail({ item: c, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const primary = c.sources.find((s) => s.url === c.primary_source) ?? c.sources[0];
  const others = c.sources.filter((s) => s !== primary);
  const needs = [...(c.data_used ?? []), ...(c.integrations ?? [])];

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
              <ConfidenceBadge c={c.confidence} />
              <span className="tag">{label(c.stage)}</span>
              <span className="tag">{c.country}</span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </header>

        <div className="drawer-body">
          <Section title="Какая была задача">
            <p>{c.problem}</p>
          </Section>

          {c.before_state && (
            <Section title="Как это работало до внедрения">
              <p>{c.before_state}</p>
            </Section>
          )}

          <Section title="Что внедрили и как это работает">
            <p>{c.solution}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {c.ai_mechanisms.map((m) => (
                <span className="tag mech" key={m}>{label(m)}</span>
              ))}
            </div>
          </Section>

          <Section title="Что изменилось">
            {c.metrics.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>
                Количественных показателей в открытых источниках нет. Итог: {c.result_summary}
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
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 10 }}>{c.result_summary}</p>
              </>
            )}
          </Section>

          <Section title="Масштаб и статус">
            <dl className="kv">
              <dt>Масштаб</dt>
              <dd>{c.scale || 'не раскрыт'}</dd>
              <dt>Стадия</dt>
              <dd>{label(c.stage)}</dd>
              <dt>Сроки оригинального проекта</dt>
              <dd>{c.timeline || 'не раскрыты'}</dd>
              <dt>Бизнес-процесс</dt>
              <dd>{labels(c.business_process)}</dd>
            </dl>
          </Section>

          {(c.first_step || c.growth_paths?.length) && (
            <section className="section sales">
              <h3>Как это может выглядеть у вас</h3>
              {c.first_step && (
                <>
                  <div className="sub-h">С чего можно начать</div>
                  <p>{c.first_step}</p>
                </>
              )}
              {c.growth_paths?.length ? (
                <>
                  <div className="sub-h">Куда это развивается</div>
                  <p>{c.growth_paths.join(' · ')}</p>
                </>
              ) : null}
              {needs.length > 0 && (
                <>
                  <div className="sub-h">Что обычно требуется со стороны компании</div>
                  <p>{needs.join(', ')}</p>
                </>
              )}
            </section>
          )}

          <Section title="Оригинальный проект">
            <dl className="kv">
              <dt>Кто внедрял</dt>
              <dd>{c.vendor.length ? c.vendor.join(', ') : 'внутренняя команда компании'}</dd>
              <dt>Технологии</dt>
              <dd>{c.technology_providers?.length ? c.technology_providers.join(', ') : '—'}</dd>
            </dl>
            <div className="sources" style={{ marginTop: 10 }}>
              {primary && (
                <div className="source">
                  <span className="primary-flag">источник</span>
                  <Ext href={primary.url}>{primary.title || primary.url}</Ext>
                  {primary.publisher && <span className="pub">{primary.publisher}</span>}
                </div>
              )}
              {others.map((s, i) => (
                <div className="source" key={i}>
                  <Ext href={s.url}>{s.title || s.url}</Ext>
                  {s.publisher && <span className="pub">{s.publisher}</span>}
                </div>
              ))}
            </div>
          </Section>

          <div className="cta-block">
            <div className="cta-title">Похожая задача есть и у вас?</div>
            <div className="cta-sub">
              Обсудим, как этот результат воспроизвести на ваших процессах и данных —
              начиная с небольшого пилота.
            </div>
            <CtaButton item={c} />
          </div>
        </div>
      </div>
    </div>
  );
}
