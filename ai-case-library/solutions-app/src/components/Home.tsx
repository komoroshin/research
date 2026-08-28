import { byCategory, categories, offers } from '../lib/data';
import { OfferCard } from './Shared';

interface Props {
  onOpen: (id: string) => void;
}

export default function Home({ onOpen }: Props) {
  const withProof = offers.filter((o) => o.proof.length > 0).length;

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
          <div className="hero-stat"><b>{withProof}</b>с примерами реальных внедрений</div>
          <div className="hero-stat"><b>$30k+</b>бюджеты от</div>
          <div className="hero-stat"><b>2–6</b>месяцев типовой срок</div>
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

      <section className="section process" style={{ marginTop: 26 }}>
        <h3>Как проходит проект</h3>
        <ol className="process-steps">
          <li>
            <b>Разбор задачи — 30 минут.</b> Созвон: что болит, какие данные есть,
            решаема ли задача в вашем бюджете. Без обязательств.
          </li>
          <li>
            <b>Ретро-тест или пилот — 4–6 недель.</b> Считаем эффект на ваших
            исторических данных или запускаем узкий пилот. Решение о большом проекте —
            после цифр, не до.
          </li>
          <li>
            <b>Внедрение и сопровождение.</b> Интеграция в ваши системы, обучение
            команды, развитие по мере роста.
          </li>
        </ol>
      </section>

      <div className="disclaimer" style={{ marginTop: 18 }}>
        Цифры в примерах — из открытых данных о реальных проектах других компаний.
        Это ориентиры: что получится у вас, считаем на ретро-тесте или пилоте.
      </div>
    </>
  );
}
