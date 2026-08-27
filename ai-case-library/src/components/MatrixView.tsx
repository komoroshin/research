import { useMemo } from 'react';
import type { AiCase } from '../types';
import { taxonomy, label } from '../lib/taxonomy';

interface Props {
  list: readonly AiCase[];
  /** Клик по ячейке фильтрует библиотеку по паре отрасль + процесс. */
  onPick: (industry: string, process: string) => void;
}

/**
 * Матрица «Отрасль × Бизнес-процесс» — главный экран перещёлкивания библиотеки (п.28 ТЗ).
 * Показываем только те строки и колонки, где есть кейсы, иначе таблица становится нечитаемой.
 */
export default function MatrixView({ list, onPick }: Props) {
  const { rows, cols, cell, rowTotal, colTotal, max } = useMemo(() => {
    const cell = new Map<string, number>();
    const rowTotal = new Map<string, number>();
    const colTotal = new Map<string, number>();

    for (const c of list) {
      rowTotal.set(c.industry, (rowTotal.get(c.industry) ?? 0) + 1);
      // Один кейс может закрывать несколько процессов — он учитывается в каждой колонке.
      for (const p of new Set(c.business_process)) {
        colTotal.set(p, (colTotal.get(p) ?? 0) + 1);
        const key = `${c.industry}|${p}`;
        cell.set(key, (cell.get(key) ?? 0) + 1);
      }
    }

    const rows = taxonomy.industries.filter((i) => (rowTotal.get(i.id) ?? 0) > 0);
    const cols = taxonomy.business_processes.filter((p) => (colTotal.get(p.id) ?? 0) > 0);
    const max = Math.max(1, ...[...cell.values()]);

    return { rows, cols, cell, rowTotal, colTotal, max };
  }, [list]);

  if (rows.length === 0) return null;

  const shade = (n: number): string => {
    if (n === 0) return 'transparent';
    // Плотность ячейки кодируем прозрачностью акцента: чем больше кейсов, тем плотнее.
    const alpha = 0.1 + 0.6 * (n / max);
    return `color-mix(in srgb, var(--accent) ${Math.round(alpha * 100)}%, transparent)`;
  };

  return (
    <>
      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="corner">Отрасль &nbsp;\&nbsp; Процесс</th>
              {cols.map((p) => (
                <th key={p.id} title={`${p.label_ru} — ${colTotal.get(p.id)} кейсов`}>
                  <span className="vert">{p.label_ru}</span>
                </th>
              ))}
              <th className="corner" style={{ minWidth: 56, width: 56, position: 'static' }}>
                Всего
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ind) => (
              <tr key={ind.id}>
                <th title={ind.label_ru}>{ind.label_ru}</th>
                {cols.map((p) => {
                  const n = cell.get(`${ind.id}|${p.id}`) ?? 0;
                  return (
                    <td key={p.id} className="cell" style={{ background: shade(n) }}>
                      <button
                        disabled={n === 0}
                        onClick={() => onPick(ind.id, p.id)}
                        title={
                          n === 0
                            ? `${ind.label_ru} × ${p.label_ru}: кейсов не найдено`
                            : `${ind.label_ru} × ${p.label_ru}: ${n} — открыть выборку`
                        }
                      >
                        {n || '·'}
                      </button>
                    </td>
                  );
                })}
                <td className="total">{rowTotal.get(ind.id) ?? 0}</td>
              </tr>
            ))}
            <tr className="total">
              <th>Всего по процессу</th>
              {cols.map((p) => (
                <td key={p.id}>{colTotal.get(p.id) ?? 0}</td>
              ))}
              <td>{list.length}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="matrix-legend matrix-legend-table">
        <span>Плотность:</span>
        <i style={{ background: shade(1) }} />
        <i style={{ background: shade(Math.round(max / 2)) }} />
        <i style={{ background: shade(max) }} />
        <span>
          1 … {max} кейсов. Сумма по строке считает кейсы, сумма по колонке — вхождения процесса,
          поэтому итоги не совпадают: один кейс может закрывать несколько процессов.
        </span>
      </div>

      {/* На узком экране матрица нечитаема — тот же срез в виде списка (п.39 ТЗ). */}
      <div className="matrix-list">
        {rows.map((ind) => (
          <div className="m-industry" key={ind.id}>
            <h4>
              {ind.label_ru} <span className="num">({rowTotal.get(ind.id)})</span>
            </h4>
            <div className="m-cells">
              {cols
                .map((p) => ({ p, n: cell.get(`${ind.id}|${p.id}`) ?? 0 }))
                .filter((x) => x.n > 0)
                .sort((a, b) => b.n - a.n)
                .map(({ p, n }) => (
                  <button className="chip" key={p.id} onClick={() => onPick(ind.id, p.id)}>
                    {label('business_process', p.id)} <b className="num">{n}</b>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
