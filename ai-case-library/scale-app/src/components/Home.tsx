import { useMemo } from 'react';
import { cases, industryTiles } from '../lib/data';

interface Props {
  onPickIndustry: (id: string) => void;
}

export default function Home({ onPickIndustry }: Props) {
  const tiles = useMemo(industryTiles, []);
  const withBudget = cases.filter((c) => c.budget_band !== 'undisclosed').length;
  const withNumbers = cases.filter((c) => c.metrics.length > 0).length;
  const review = cases.filter((c) => c.confidence.level === 'review').length;

  return (
    <>
      <div className="hero">
        <h1>AI-проекты вашего масштаба — от $50 тыс. до $1 млн</h1>
        <p className="lead">
          Не гигантские программы корпораций, а проекты, которые компания вашего размера
          заказывает у команды-подрядчика: с бюджетной вилкой, сроками и результатом.
          Большинство — из верифицированных отзывов самих заказчиков. Выберите отрасль,
          найдите похожую задачу — и обсудим такой же проект у вас.
        </p>
        <div className="hero-stats">
          <div className="hero-stat"><b>{cases.length}</b>проектов в каталоге</div>
          <div className="hero-stat"><b>{withBudget}</b>с раскрытой бюджетной вилкой</div>
          <div className="hero-stat"><b>{review}</b>из верифицированных отзывов клиентов</div>
          <div className="hero-stat"><b>{withNumbers}</b>с цифрами результата</div>
        </div>
      </div>

      <div className="tiles">
        {tiles.map((t) => (
          <button className="tile" key={t.id} onClick={() => onPickIndustry(t.id)}>
            <h3>
              {t.name} <span className="n">{t.count}</span>
            </h3>
            <div className="tile-sub">
              {t.withBudget > 0 && `${t.withBudget} с бюджетной вилкой · `}
              {t.ru > 0 ? `${t.ru} в России/СНГ` : 'международные'}
            </div>
            <div className="tile-procs">
              {t.topProcesses.map((p) => (
                <span className="tag" key={p.id}>
                  {p.name} · {p.count}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="disclaimer" style={{ marginTop: 26 }}>
        Каталог собран из верифицированных отзывов заказчиков на международных площадках
        и публичных разборов проектов. Все кейсы намеренно обезличены: имена компаний и
        исполнителей скрыты — важна суть: такая задача уже решена в таком бюджете и в такие
        сроки. Это не наше портфолио; наша работа — построить аналогичное решение под ваши
        процессы и данные.
      </div>
    </>
  );
}
