import type { ScaleCase } from '../types';
import { budgetLabel, durationLabel, label, labels } from '../lib/data';
import { BudgetBadge, CtaButton, resultHeadline } from './Shared';

interface Props {
  item: ScaleCase;
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
 * Страница кейса для заказчика: заголовок — сразу результат, дальше история
 * «боль → что сделали → что изменилось» и рамки проекта. Служебной информации
 * о происхождении кейса здесь нет намеренно — читателю она не нужна.
 */
export default function CaseDetail({ item: c, onBack }: Props) {
  const { head, sub } = resultHeadline(c);

  return (
    <article className="case-page">
      <button className="backlink" onClick={onBack}>
        ← К списку кейсов
      </button>

      <header className="case-head">
        <h2>{head}</h2>
        <div className="sub">
          {sub} — {c.client_profile}
        </div>
        <div className="case-badges">
          <BudgetBadge item={c} />
          {c.duration_months ? <span className="tag">{durationLabel(c.duration_months)}</span> : null}
          <span className="tag">{label(c.industry)}</span>
        </div>
      </header>

      {/* Все результаты кейса — первым экраном */}
      {c.metrics.length > 0 && (
        <div className="metrics-hero">
          {c.metrics.map((m, i) => (
            <div className="metric-tile reported" key={i}>
              <div className="mt-value">
                <span className="mt-to">{m.result}</span>
              </div>
              <div className="mt-name">{m.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="case-grid">
        <div className="case-main">
          <Section title="В чём была боль">
            <p>{c.pain}</p>
            <p>{c.problem}</p>
          </Section>

          <Section title="Что сделали">
            <p>{c.solution}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {c.ai_mechanisms.map((m) => (
                <span className="tag mech" key={m}>{label(m)}</span>
              ))}
            </div>
          </Section>

          <Section title="Что изменилось">
            <p>{c.result_summary}</p>
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
            <h3>Рамки проекта</h3>
            <dl className="kv aside-kv">
              <dt>Бюджет</dt>
              <dd>{budgetLabel(c)}</dd>
              <dt>Сроки</dt>
              <dd>{durationLabel(c.duration_months)}</dd>
              <dt>Год</dt>
              <dd>{c.year}</dd>
              {c.geo !== 'не раскрыто' && (
                <>
                  <dt>География</dt>
                  <dd>{c.geo}</dd>
                </>
              )}
              <dt>Процессы</dt>
              <dd>{labels(c.business_process)}</dd>
            </dl>
          </div>
        </aside>
      </div>

      {/* На узком экране липкой колонки нет — CTA закреплена снизу. */}
      <div className="cta-mobile-bar">
        <CtaButton item={c} compact />
      </div>
    </article>
  );
}
