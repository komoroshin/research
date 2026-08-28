import type { Offer } from '../types';
import { CtaButton } from './Shared';

interface Props {
  item: Offer;
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
 * Направление — полноценная страница по образцу кейса: боль → что сделаем →
 * что получите → реальные проекты; CTA в липкой колонке, «назад» браузера работает.
 */
export default function OfferDetail({ item: o, onBack }: Props) {
  return (
    <article className="case-page">
      <button className="backlink" onClick={onBack}>
        ← Ко всем направлениям
      </button>

      <header className="case-head">
        <h2>{o.title}</h2>
        <div className="case-badges">
          <span className="tag budget">{o.budget}</span>
          <span className="tag">{o.timeline}</span>
        </div>
      </header>

      {/* Ожидаемый результат — первым экраном, как метрики в каталоге кейсов. */}
      <div className="metrics-hero">
        {o.outcomes.map((out, i) => (
          <div className="metric-tile reported" key={i}>
            <div className="mt-name" style={{ fontSize: 14, color: 'var(--text)' }}>{out}</div>
          </div>
        ))}
      </div>

      <div className="case-grid">
        <div className="case-main">
          <Section title="Знакомая ситуация?">
            <p>{o.pain}</p>
          </Section>

          <Section title="Что мы сделаем">
            <p>{o.solution}</p>
          </Section>

          {o.proof.length > 0 && (
            <Section title="Как это уже работает у других">
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 0 }}>
                Примеры реальных проектов похожих компаний — по открытым данным рынка:
              </p>
              <ul className="proof-list">
                {o.proof.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="С чего начнём">
            <p>{o.first_step}</p>
          </Section>
        </div>

        <aside className="case-aside">
          <div className="cta-block">
            <div className="cta-title">Узнали свою ситуацию?</div>
            <div className="cta-sub">
              Расскажите, как это устроено у вас, — за один созвон наметим пилот
              и посчитаем, что он даст в ваших цифрах. Сначала ретро-тест на ваших
              данных — потом решение о проекте.
            </div>
            <CtaButton item={o} />
          </div>

          <div className="section" style={{ marginTop: 12 }}>
            <h3>Рамки проекта</h3>
            <dl className="kv aside-kv">
              <dt>Бюджет</dt>
              <dd>{o.budget}</dd>
              <dt>Срок</dt>
              <dd>{o.timeline}</dd>
              <dt>Старт</dt>
              <dd>пилот на вашем участке</dd>
            </dl>
          </div>
        </aside>
      </div>

      <div className="cta-mobile-bar">
        <CtaButton item={o} compact />
      </div>
    </article>
  );
}
