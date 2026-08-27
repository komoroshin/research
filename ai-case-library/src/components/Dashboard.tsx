import { useMemo } from 'react';
import type { AiCase } from '../types';
import { taxonomy, label } from '../lib/taxonomy';

interface Props {
  all: readonly AiCase[];
  /** Текущая выборка — дашборд показывает её, а не всегда всю базу. */
  list: readonly AiCase[];
  onPickIndustry: (id: string) => void;
  onPickProcess: (id: string) => void;
  onPickMechanism: (id: string) => void;
  onPickGrade: (id: string) => void;
}

function tally(list: readonly AiCase[], get: (c: AiCase) => string | string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of list) {
    const v = get(c);
    for (const id of new Set(Array.isArray(v) ? v : [v])) m.set(id, (m.get(id) ?? 0) + 1);
  }
  return m;
}

function Bars({
  data,
  onPick,
}: {
  data: { id: string; name: string; n: number }[];
  onPick?: (id: string) => void;
}) {
  const max = Math.max(1, ...data.map((d) => d.n));
  return (
    <div className="bars">
      {data.map((d) => (
        <button
          className="bar-row"
          key={d.id}
          onClick={() => onPick?.(d.id)}
          title={onPick ? `Отфильтровать: ${d.name}` : d.name}
        >
          <span className="nm">{d.name}</span>
          <span className="track">
            <span className="fill" style={{ width: `${(d.n / max) * 100}%` }} />
          </span>
          <span className="n">{d.n}</span>
        </button>
      ))}
    </div>
  );
}

export default function Dashboard({
  all,
  list,
  onPickIndustry,
  onPickProcess,
  onPickMechanism,
  onPickGrade,
}: Props) {
  const stats = useMemo(() => {
    const byIndustry = tally(list, (c) => c.industry);
    const byProcess = tally(list, (c) => c.business_process);
    const byMech = tally(list, (c) => c.ai_mechanisms);
    const byGrade = tally(list, (c) => c.evidence_grade);

    const ru = list.filter((c) => c.region === 'russia-cis').length;
    const production = list.filter((c) => c.stage === 'production' || c.stage === 'scaled-production').length;
    const ab = (byGrade.get('A') ?? 0) + (byGrade.get('B') ?? 0);
    const withMetrics = list.filter((c) => c.metrics.length > 0).length;
    const vendors = new Set(list.flatMap((c) => c.vendor)).size;

    const named = (kind: 'industry' | 'business_process' | 'ai_mechanisms', m: Map<string, number>) =>
      [...m.entries()]
        .map(([id, n]) => ({ id, name: label(kind, id), n }))
        .sort((a, b) => b.n - a.n);

    return {
      byIndustry: named('industry', byIndustry),
      byProcess: named('business_process', byProcess).slice(0, 14),
      byMech: named('ai_mechanisms', byMech).slice(0, 14),
      byGrade: taxonomy.evidence_grades
        .map((g) => ({ id: g.id, name: g.label_ru, n: byGrade.get(g.id) ?? 0 }))
        .filter((g) => g.n > 0),
      ru,
      global: list.length - ru,
      production,
      ab,
      withMetrics,
      vendors,
      industries: byIndustry.size,
      processes: byProcess.size,
    };
  }, [list]);

  const pct = (n: number) => (list.length ? Math.round((n / list.length) * 100) : 0);
  const filtered = list.length !== all.length;

  return (
    <>
      <div className="stats">
        <div className="stat">
          <div className="v">{list.length}</div>
          <div className="k">{filtered ? 'кейсов в выборке' : 'подтверждённых AI-кейсов'}</div>
          {filtered && <div className="sub">из {all.length} в библиотеке</div>}
        </div>
        <div className="stat">
          <div className="v">{stats.industries}</div>
          <div className="k">отраслей</div>
          <div className="sub">{stats.processes} бизнес-процессов</div>
        </div>
        <div className="stat">
          <div className="v">{stats.ru}</div>
          <div className="k">Россия / СНГ</div>
          <div className="sub">{pct(stats.ru)}% выборки</div>
        </div>
        <div className="stat">
          <div className="v">{stats.global}</div>
          <div className="k">глобальные бенчмарки</div>
          <div className="sub">{pct(stats.global)}% выборки</div>
        </div>
        <div className="stat">
          <div className="v">{stats.production}</div>
          <div className="k">в промышленной эксплуатации</div>
          <div className="sub">{pct(stats.production)}% выборки</div>
        </div>
        <div className="stat">
          <div className="v">{pct(stats.ab)}%</div>
          <div className="k">Evidence A/B</div>
          <div className="sub">{stats.ab} кейсов</div>
        </div>
        <div className="stat">
          <div className="v">{stats.withMetrics}</div>
          <div className="k">с измеримым результатом</div>
          <div className="sub">{pct(stats.withMetrics)}% выборки</div>
        </div>
        <div className="stat">
          <div className="v">{stats.vendors}</div>
          <div className="k">подрядчиков и команд</div>
        </div>
      </div>

      <div className="charts">
        <div className="panel">
          <h3>Кейсы по отраслям</h3>
          <Bars data={stats.byIndustry} onPick={onPickIndustry} />
        </div>
        <div className="panel">
          <h3>Кейсы по бизнес-процессам</h3>
          <Bars data={stats.byProcess} onPick={onPickProcess} />
        </div>
        <div className="panel">
          <h3>Кейсы по AI-механикам</h3>
          <Bars data={stats.byMech} onPick={onPickMechanism} />
        </div>
        <div className="panel">
          <h3>Качество доказательств</h3>
          <Bars data={stats.byGrade} onPick={onPickGrade} />
          <div className="matrix-legend" style={{ marginTop: 12 }}>
            <span>
              A — измеримый результат и первичный источник. B — внедрение подтверждено, но цифр мало
              или они со стороны подрядчика. C — ограниченные данные, часто без названного клиента. D в библиотеку не
              включается.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
