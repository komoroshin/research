/* ============================================================================
   pathfind.js — поиск пути по карте приключений (8 направлений, Дейкстра).

   Стоимость входа в клетку задаётся снаружи (стоимость местности / дорога),
   диагональ ×1.41 как в HoMM3. «Терминальные» клетки (монстры, объекты
   с взаимодействием, чужие герои, города) — в них можно войти, но нельзя
   пройти насквозь. Клетки, охраняемые монстром (соседние с ним), тоже
   терминальны: попытка пройти мимо вызывает бой.
   ========================================================================== */
(function (root) {
  'use strict';
  const U = root.U || require('../util.js');

  /**
   * @param {object} opts
   *   w,h            размеры
   *   start          [x,y]
   *   cost(x,y)      стоимость входа (>0) или Infinity если непроходимо
   *   terminal(x,y)  true — вход возможен, дальше идти нельзя
   *   maxCost        ограничение (необязательно)
   * @returns { dist: Float64Array, prev: Int32Array }  индекс = y*w+x
   */
  function dijkstra(opts) {
    const { w, h, start, cost, terminal } = opts;
    const maxCost = opts.maxCost || Infinity;
    const N = w * h;
    const dist = new Float64Array(N).fill(Infinity);
    const prev = new Int32Array(N).fill(-1);
    const done = new Uint8Array(N);
    const s = start[1] * w + start[0];
    dist[s] = 0;
    const pq = new U.PQ();
    pq.push({ p: 0, i: s });
    while (pq.size) {
      const { p, i } = pq.pop();
      if (done[i]) continue;
      done[i] = 1;
      if (p > maxCost) break;
      const x = i % w, y = (i - x) / w;
      if (i !== s && terminal && terminal(x, y)) continue; // из терминальной дальше не идём
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const c = cost(nx, ny, x, y);
        if (!(c < Infinity)) continue;
        const step = (dx && dy) ? c * 1.41 : c;
        const nd = p + step;
        const ni = ny * w + nx;
        if (nd < dist[ni]) { dist[ni] = nd; prev[ni] = i; pq.push({ p: nd, i: ni }); }
      }
    }
    return { dist, prev, w, h };
  }

  /** Восстанавливает путь [[x,y],...] от старта (исключая его) до цели. */
  function pathTo(res, tx, ty) {
    const { prev, w, dist } = res;
    let i = ty * w + tx;
    if (!(dist[i] < Infinity)) return null;
    const out = [];
    while (prev[i] !== -1) { out.push([i % w, (i - i % w) / w]); i = prev[i]; }
    out.reverse();
    return out;
  }

  /**
   * Разбивает путь по ходам: возвращает массив с накопленной стоимостью и
   * номером хода для каждого шага (turn=0 — доступно сегодня).
   * Правило: если очков > 0, шаг разрешён всегда (как в HoMM3).
   */
  function annotate(res, path, movePoints, maxPoints) {
    let mp = movePoints, turn = 0, prevCost = 0;
    return path.map(([x, y]) => {
      const c = res.dist[y * res.w + x] - prevCost;
      prevCost += c;
      if (mp <= 0) { turn++; mp = maxPoints; }
      mp -= c;
      return { x, y, cost: c, turn };
    });
  }

  const PF = { dijkstra, pathTo, annotate };
  if (typeof module !== 'undefined' && module.exports) module.exports = PF;
  root.Pathfind = PF;
})(typeof window !== 'undefined' ? window : globalThis);
