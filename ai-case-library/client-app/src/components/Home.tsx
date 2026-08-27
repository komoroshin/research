import { useMemo } from 'react';
import { cases, industryTiles } from '../lib/data';

interface Props {
  onPickIndustry: (id: string) => void;
}

export default function Home({ onPickIndustry }: Props) {
  const tiles = useMemo(industryTiles, []);
  const measured = cases.filter((c) => c.metrics.some((m) => m.status === 'measured')).length;
  const ru = cases.filter((c) => c.region === 'russia-cis').length;

  return (
    <>
      <div className="hero">
        <h1>Реальные внедрения AI — уже доказавшие ценность</h1>
        <p className="lead">
          Не обещания, а проверенные проекты: что болело у компании, что внедрили и что
          изменилось — с источником под каждой цифрой. Выберите свою отрасль, найдите
          похожую задачу и получите такой же результат у себя.
        </p>
        <div className="hero-stats">
          <div className="hero-stat"><b>{cases.length}</b>проверенных кейсов</div>
          <div className="hero-stat"><b>{tiles.length}</b>отраслей</div>
          <div className="hero-stat"><b>{ru}</b>из России и СНГ</div>
          <div className="hero-stat"><b>{measured}</b>с измеренным результатом</div>
        </div>
      </div>

      <div className="tiles">
        {tiles.map((t) => (
          <button className="tile" key={t.id} onClick={() => onPickIndustry(t.id)}>
            <h3>
              {t.name} <span className="n">{t.count}</span>
            </h3>
            <div className="tile-sub">
              {t.ru > 0 && `${t.ru} в России/СНГ · `}
              {t.measured} с измеренным результатом
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
        Кейсы собраны из открытых источников — публикаций самих компаний, их подрядчиков и
        деловых СМИ — как доказательство того, что задача решаема и уже решена. Это не наше
        портфолио: авторы оригинальных внедрений указаны в каждой карточке. Наша работа —
        построить аналогичное решение под ваши процессы и данные.
      </div>
    </>
  );
}
