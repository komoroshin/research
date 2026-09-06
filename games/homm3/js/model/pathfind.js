/* ============================================================================
   model/pathfind.js — поиск пути по карте приключений (8 направлений, Дейкстра
   на бинарной куче). Диагональ ×1.41. Терминальные клетки: в них можно войти,
   но нельзя пройти насквозь (объекты с взаимодействием, чужие герои/города,
   зона контроля стражей). (ТЗ §4.1, §4.4)
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U;

  /**
   * opts: { w, h, start:[x,y], cost(x,y) → число|Infinity, terminal(x,y) → bool, maxCost }
   * → { dist: Float64Array, prev: Int32Array, w, h }
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
    pq.push(0, s);
    while (pq.size) {
      const [p, i] = pq.pop();
      if (done[i]) continue;
      done[i] = 1;
      if (p > maxCost) break;
      const x = i % w, y = (i - x) / w;
      if (i !== s && terminal && terminal(x, y)) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const c = cost(nx, ny, x, y);
        if (!(c < Infinity)) continue;
        const nd = p + ((dx && dy) ? c * 1.41 : c);
        const ni = ny * w + nx;
        if (nd < dist[ni]) { dist[ni] = nd; prev[ni] = i; pq.push(nd, ni); }
      }
    }
    return { dist, prev, w, h };
  }

  /** Путь [[x,y],...] от старта (исключая его) до цели, или null. */
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
   * Аннотирует путь: стоимость каждого шага и номер хода (0 — сегодня).
   * Правило: если очков движения > 0, шаг разрешён всегда.
   */
  function annotate(res, path, movePoints, maxPoints) {
    let mp = movePoints, turn = 0, prevCost = 0;
    return path.map(([x, y]) => {
      const c = res.dist[y * res.w + x] - prevCost;
      prevCost += c;
      if (mp <= 0) { turn++; mp = maxPoints; }
      mp -= c;
      return { x, y, cost: c, turn, left: Math.max(0, mp) };
    });
  }

  /** BFS-связность по проходимости (для генератора карт). */
  function reachable(w, h, sx, sy, passable) {
    const seen = new Uint8Array(w * h);
    const q = [sy * w + sx]; seen[q[0]] = 1;
    while (q.length) {
      const i = q.pop(); const x = i % w, y = (i - x) / w;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (seen[ni] || !passable(nx, ny)) continue;
        seen[ni] = 1; q.push(ni);
      }
    }
    return seen;
  }

  H3.Pathfind = { dijkstra, pathTo, annotate, reachable };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Pathfind;
})(typeof window !== 'undefined' ? window : globalThis);
