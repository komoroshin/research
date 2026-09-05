/* ============================================================================
   util.js — общие утилиты: сидированный RNG, гексовая математика, хелперы.
   Без зависимостей от DOM: используется и в браузере, и в node-тестах.
   ========================================================================== */
(function (root) {
  'use strict';

  /* ---------- RNG (mulberry32) ---------- */
  function RNG(seed) {
    this.s = (seed >>> 0) || 0x9e3779b9;
  }
  RNG.prototype.next = function () {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  RNG.prototype.int = function (a, b) { // целое в [a, b]
    if (b === undefined) { b = a; a = 0; }
    return a + Math.floor(this.next() * (b - a + 1));
  };
  RNG.prototype.pick = function (arr) { return arr[Math.floor(this.next() * arr.length)]; };
  RNG.prototype.chance = function (p) { return this.next() < p; };
  RNG.prototype.shuffle = function (arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  };
  RNG.prototype.weighted = function (items, weightFn) {
    let total = 0;
    for (const it of items) total += weightFn(it);
    let r = this.next() * total;
    for (const it of items) { r -= weightFn(it); if (r <= 0) return it; }
    return items[items.length - 1];
  };
  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* ---------- Гексы (offset "odd-r": нечётные ряды сдвинуты вправо) ---------- */
  // Поле боя 15×11, как в HoMM3. Координаты (col,row). Odd-r shoves odd rows right.
  const Hex = {
    toCube(col, row) {
      const x = col - ((row - (row & 1)) >> 1);
      const z = row;
      return [x, -x - z, z];
    },
    fromCube(x, y, z) {
      const row = z;
      const col = x + ((z - (z & 1)) >> 1);
      return [col, row];
    },
    dist(c1, r1, c2, r2) {
      const a = Hex.toCube(c1, r1), b = Hex.toCube(c2, r2);
      return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
    },
    // соседи в odd-r
    neighbors(col, row) {
      const odd = row & 1;
      const d = odd
        ? [[1, 0], [1, -1], [0, -1], [-1, 0], [0, 1], [1, 1]]
        : [[1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
      return d.map(([dc, dr]) => [col + dc, row + dr]);
    },
    // линия гексов между двумя (для проверки препятствий стрелкам)
    line(c1, r1, c2, r2) {
      const a = Hex.toCube(c1, r1), b = Hex.toCube(c2, r2);
      const n = Hex.dist(c1, r1, c2, r2);
      const out = [];
      for (let i = 0; i <= n; i++) {
        const t = n === 0 ? 0 : i / n;
        let x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t;
        let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
        const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
        if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
        out.push(Hex.fromCube(rx, ry, rz));
      }
      return out;
    },
    // пиксельный центр гекса (pointy-top), size = радиус
    center(col, row, size, ox, oy) {
      const w = Math.sqrt(3) * size;
      const x = (ox || 0) + w * (col + 0.5 * (row & 1)) + w / 2;
      const y = (oy || 0) + size * 1.5 * row + size;
      return [x, y];
    },
    // пиксель → гекс (pointy-top)
    fromPixel(px, py, size, ox, oy) {
      const w = Math.sqrt(3) * size;
      px -= (ox || 0) + w / 2; py -= (oy || 0) + size;
      const q = (Math.sqrt(3) / 3 * px - 1 / 3 * py) / size;
      const r = (2 / 3 * py) / size;
      // округление куба
      let x = q, z = r, y = -x - z;
      let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
      const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
      if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
      return Hex.fromCube(rx, ry, rz);
    },
    polygon(cx, cy, size) {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const ang = Math.PI / 180 * (60 * i - 30);
        pts.push([cx + size * Math.cos(ang), cy + size * Math.sin(ang)]);
      }
      return pts;
    },
  };

  /* ---------- Прочее ---------- */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const deepClone = o => JSON.parse(JSON.stringify(o));
  function fmt(n) { // 12 345
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function plural(n, one, few, many) { // 1 воин, 2 воина, 5 воинов
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }
  // Приоритетная очередь (бинарная куча) для Дейкстры/A*
  function PQ(cmp) { this.a = []; this.cmp = cmp || ((x, y) => x.p - y.p); }
  PQ.prototype.push = function (v) {
    const a = this.a; a.push(v); let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (this.cmp(a[i], a[p]) < 0) { [a[i], a[p]] = [a[p], a[i]]; i = p; } else break; }
  };
  PQ.prototype.pop = function () {
    const a = this.a; if (!a.length) return undefined;
    const top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l; if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
      if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } }
    return top;
  };
  Object.defineProperty(PQ.prototype, 'size', { get() { return this.a.length; } });

  const U = { RNG, hashStr, Hex, clamp, lerp, sum, deepClone, fmt, plural, PQ };
  if (typeof module !== 'undefined' && module.exports) module.exports = U;
  root.U = U;
})(typeof window !== 'undefined' ? window : globalThis);
