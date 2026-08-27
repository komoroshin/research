import type { ScaleCase } from '../types';
import { budgetLabel, durationLabel, label, labels } from '../lib/data';
import { BudgetBadge, ConfidenceBadge, CtaButton, ReportedBadge } from './Shared';

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
 * Кейс — полноценная страница (как в клиентском каталоге): результат первым экраном,
 * CTA в липкой колонке, браузерный «назад» работает. Отличие этого каталога:
 * вместо ссылок на источники — текстовая плашка о происхождении кейса, потому что
 * каталог намеренно обезличен.
 */
export default function CaseDetail({ item: c, onBack }: Props) {
  return (
    <article className="case-page">
      <button className="backlink" onClick={onBack}>
        ← К списку кейсов
      </button>

      <header className="case-head">
        <h2>{c.title}</h2>
        <div className="sub">{c.client_profile}</div>
        <div className="case-badges">
          <ConfidenceBadge c={c.confidence} />
          <BudgetBadge item={c} />
          <span className="tag">{label(c.stage)}</span>
          <span className="tag">{label(c.industry)}</span>
        </div>
      </header>

      {/* Результат — причина, по которой человек открыл кейс. Показываем его первым. */}
      {c.metrics.length > 0 && (
        <div className="metrics-hero">
          {c.metrics.map((m, i) => (
            <div className="metric-tile reported" key={i}>
              <div className="mt-value">
                <span className="mt-to">{m.result}</span>
              </div>
              <div className="mt-name">{m.name}</div>
              <div className="mt-meta">
                <ReportedBadge c={c.confidence} />
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
                Численные показатели источником не раскрыты.
              </p>
            )}
          </Section>

          <Section title="Откуда этот кейс">
            <p>{c.source_label}.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Каталог намеренно обезличен: имена заказчика и команды-исполнителя скрыты.
              Кейс здесь — доказательство, что задача решаема в этом бюджете и в эти
              сроки, а не реклама конкретного подрядчика.
            </p>
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
            <h3>Паспорт проекта</h3>
            <dl className="kv aside-kv">
              <dt>Бюджет</dt>
              <dd>{budgetLabel(c)}</dd>
              <dt>Сроки</dt>
              <dd>{durationLabel(c.duration_months)}</dd>
              <dt>Год</dt>
              <dd>{c.year}</dd>
              <dt>География</dt>
              <dd>{c.geo}</dd>
              <dt>Стадия</dt>
              <dd>{label(c.stage)}</dd>
              <dt>Бизнес-процесс</dt>
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
