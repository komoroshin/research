import { useMemo } from 'react';
import { cases, industryTiles } from '../lib/data';

interface Props {
  onPickIndustry: (id: string) => void;
}

export default function Home({ onPickIndustry }: Props) {
  const tiles = useMemo(industryTiles, []);
  const withBudget = cases.filter((c) => c.budget_band !== 'undisclosed').length;
  const withNumbers = cases.filter((c) => c.metrics.length > 0).length;
  const ru = cases.filter((c) => c.region === 'russia-cis').length;

  return (
    <>
      <div className="hero">
        <h1>AI-проекты вашего масштаба — от $50 тыс. до $1 млн</h1>
        <p className="lead">
          Не гигантские программы корпораций, а проекты, которые компания вашего размера
          заказывает у команды-подрядчика: с понятным бюджетом, сроками и измеримым
          результатом. Выберите отрасль, найдите похожую задачу — и обсудим такой же
          проект у вас.
        </p>
        <div className="hero-stats">
          <div className="hero-stat"><b>{cases.length}</b>проектов в каталоге</div>
          <div className="hero-stat"><b>{withNumbers}</b>с цифрами результата</div>
          <div className="hero-stat"><b>{withBudget}</b>с известным бюджетом</div>
          <div className="hero-stat"><b>{ru}</b>из России и СНГ</div>
        </div>
      </div>

      <div className="tiles">
        {tiles.map((t) => (
          <button className="tile" key={t.id} onClick={() => onPickIndustry(t.id)}>
            <h3>
              {t.name} <span className="n">{t.count}</span>
            </h3>
            <div className="tile-sub">
              {t.withBudget > 0 && `${t.withBudget} с известным бюджетом · `}
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
        Все проекты в каталоге реальные; названия компаний не раскрываются. Найдите
        похожую задачу — а как это будет выглядеть у вас, обсудим лично.
      </div>
    </>
  );
}
