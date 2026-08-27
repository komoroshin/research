import { industries, offersOf } from '../lib/data';

interface Props {
  onPick: (id: string) => void;
}

export default function IndustriesHome({ onPick }: Props) {
  return (
    <>
      <div className="hero">
        <h1>Что мы делаем для вашей отрасли</h1>
        <p className="lead">
          Одни и те же боли в каждой отрасли выглядят по-своему. Выберите свою — покажем
          типичные задачи, реальные результаты похожих компаний и то, с чего обычно начинают.
        </p>
      </div>

      <div className="tiles">
        {industries.map((ind) => (
          <button className="tile" key={ind.id} onClick={() => onPick(ind.id)}>
            <h3>
              {ind.name} <span className="n">{offersOf(ind).length}</span>
            </h3>
            <div className="tile-sub">{ind.intro}</div>
            <div className="tile-procs">
              {ind.highlights.slice(0, 2).map((h, i) => (
                <span className="tag" key={i}>{h}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
