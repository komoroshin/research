import { byCategory, categories, offers } from '../lib/data';
import { COMPANY } from '../lib/company';
import { OfferCard, ResearchCta } from './Shared';

interface Props {
  onOpen: (id: string) => void;
}

export default function Home({ onOpen }: Props) {
  return (
    <>
      <div className="hero">
        <h1>С какой проблемой вы пришли?</h1>
        <p className="lead">
          Мы строим AI-решения под конкретную бизнес-боль: от потерянных заявок до прогноза
          спроса. Выберите свою ситуацию — внутри написано, что мы сделаем, что вы получите,
          в каком бюджете и с чего начнём.
        </p>
        <div className="hero-stats">
          <div className="hero-stat"><b>{offers.length}</b>направлений</div>
          <div className="hero-stat"><b>48</b>проектов реализовано</div>
          <div className="hero-stat"><b>150 тыс. ₽</b>вход — исследование за 2 недели</div>
          <div className="hero-stat"><b>2–6</b>месяцев типовой срок проекта</div>
        </div>
      </div>

      {categories.map((cat) => {
        const list = byCategory(cat.id);
        if (list.length === 0) return null;
        return (
          <section key={cat.id} className="offer-group">
            <h2 className="offer-group-title">{cat.name}</h2>
            <div className="cards">
              {list.map((o) => (
                <OfferCard key={o.id} offer={o} onOpen={onOpen} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Ступень входа: исследование вместо прыжка сразу в большой проект */}
      <section className="research-band" id="research">
        <div className="research-main">
          <h2 className="research-title">{COMPANY.research.title}</h2>
          <div className="research-price">
            <b>{COMPANY.research.price}</b> · {COMPANY.research.duration}
          </div>
          <ul className="research-list">
            {COMPANY.research.includes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className="research-note">{COMPANY.research.note}</p>
          <ResearchCta />
        </div>
        <blockquote className="research-quote">
          <p>«{COMPANY.research.quote.text}»</p>
          <footer>{COMPANY.research.quote.author}</footer>
        </blockquote>
      </section>

      {/* Кто мы — доверие рядом с решением, факты из презентации компании */}
      <section className="about">
        <h2 className="offer-group-title">Кто мы</h2>
        <p className="about-lead">{COMPANY.positioning}</p>
        <div className="hero-stats about-stats">
          {COMPANY.stats.map((s) => (
            <div className="hero-stat" key={s.label}>
              <b>{s.value}</b>
              {s.label}
            </div>
          ))}
        </div>
        <div className="cards about-pillars">
          {COMPANY.pillars.map((p) => (
            <div className="card" key={p.name}>
              <div className="card-title" style={{ fontSize: 16 }}>{p.name}</div>
              <div className="card-field">{p.text}</div>
            </div>
          ))}
        </div>
        <div className="about-team">
          {COMPANY.team.map((m) => (
            <div className="about-person" key={m.name}>
              <b>{m.name}</b>
              <span>{m.role}</span>
            </div>
          ))}
        </div>
        <blockquote className="about-quote">
          <p>«{COMPANY.quote.text}»</p>
          <footer>{COMPANY.quote.author}</footer>
        </blockquote>
        <p className="about-media">{COMPANY.media}</p>
      </section>

      <section className="section process" style={{ marginTop: 26 }}>
        <h3>Как проходит проект</h3>
        <ol className="process-steps">
          <li>
            <b>Разбор задачи — 30 минут, бесплатно.</b> Созвон с техническим специалистом:
            что болит, какие данные есть, решаема ли задача в вашем бюджете. Без обязательств.
          </li>
          <li>
            <b>Исследование или пилот — 2–6 недель.</b> Считаем эффект на ваших
            исторических данных или запускаем узкий пилот. Решение о большом проекте —
            после цифр, не до.
          </li>
          <li>
            <b>Внедрение и сопровождение.</b> Интеграция в ваши системы, обучение
            команды, аналитика результата и развитие по мере роста.
          </li>
        </ol>
        <p className="research-note" style={{ marginTop: 12 }}>{COMPANY.projectThreshold}</p>
      </section>

      <div className="disclaimer" style={{ marginTop: 18 }}>
        Цифры в примерах — из открытых данных о реальных проектах других компаний.
        Это ориентиры: что получится у вас, считаем на исследовании или пилоте.
      </div>
    </>
  );
}
