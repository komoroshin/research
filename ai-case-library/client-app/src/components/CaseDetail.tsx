import type { ClientCase } from '../types';
import { label, labels } from '../lib/data';
import { ConfidenceBadge, CtaButton, Ext, MetricStatusBadge } from './Shared';

interface Props {
  item: ClientCase;
  onBack: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

/**
 * Кейс — целевой контент всей воронты «отрасль → кейс → заявка», поэтому он
 * рендерится полноценной страницей, а не выезжающей панелью: результат виден
 * первым экраном, CTA — в липкой боковой колонке, кнопка «назад» браузера работает.
 */
export default function CaseDetail({ item: c, onBack }: Props) {
  const primary = c.sources.find((s) => s.url === c.primary_source) ?? c.sources[0];
  const others = c.sources.filter((s) => s !== primary);
  const needs = [...(c.data_used ?? []), ...(c.integrations ?? [])];

  return (
    <article className="case-page">
      <button className="backlink" onClick={onBack}>
        ← К списку кейсов
      </button>

      <header className="case-head">
        <h2>{c.client}</h2>
        <div className="sub">{c.title}</div>
        <div className="case-badges">
          <ConfidenceBadge c={c.confidence} />
          <span className="tag">{label(c.stage)}</span>
          <span className="tag">{c.country}</span>
          <span className="tag">{label(c.industry)}</span>
        </div>
      </header>

      {/* Результат — причина, по которой человек открыл кейс. Показываем его первым. */}
      {c.metrics.length > 0 && (
        <div className="metrics-hero">
          {c.metrics.map((m, i) => (
            <div className={`metric-tile ${m.status}`} key={i}>
              <div className="mt-value">
                {m.baseline && <span className="mt-from">{m.baseline} →</span>}
                <span className="mt-to">{m.result}</span>
              </div>
              <div className="mt-name">{m.metric_name}</div>
              <div className="mt-meta">
                <MetricStatusBadge status={m.status} />
                <Ext href={m.source_url}>источник</Ext>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="case-grid">
        <div className="case-main">
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

          <Section title="Итог">
            <p>{c.result_summary}</p>
            {c.metrics.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Количественные показатели в открытых источниках не раскрыты.
              </p>
            )}
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
        </div>

        <aside className="case-aside">
          <div className="cta-block">
            <div className="cta-title">Похожая задача есть и у вас?</div>
            <div className="cta-sub">
              Обсудим, как воспроизвести этот результат на ваших процессах и данных —
              начиная с небольшого пилота.
            </div>
            <CtaButton item={c} />
          </div>

          <div className="section" style={{ marginTop: 12 }}>
            <h3>Коротко о проекте</h3>
            <dl className="kv aside-kv">
              <dt>Масштаб</dt>
              <dd>{c.scale || 'не раскрыт'}</dd>
              <dt>Стадия</dt>
              <dd>{label(c.stage)}</dd>
              <dt>Сроки оригинала</dt>
              <dd>{c.timeline || 'не раскрыты'}</dd>
              <dt>Бизнес-процесс</dt>
              <dd>{labels(c.business_process)}</dd>
            </dl>
          </div>
        </aside>
      </div>

      {/* На узком экране липкой колонки нет — CTA закреплена снизу и всегда под пальцем. */}
      <div className="cta-mobile-bar">
        <CtaButton item={c} compact />
      </div>
    </article>
  );
}
