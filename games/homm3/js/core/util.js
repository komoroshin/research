/* ============================================================================
   core/util.js — RNG (mulberry32, потоки), гексовая математика, очередь,
   форматирование. Без DOM: используется в браузере и в node-тестах.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  /* ---------- RNG ---------- */
  function RNG(seed) { this.s = (seed >>> 0) || 0x9e3779b9; }
  RNG.prototype.next = function () {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  RNG.prototype.int = function (a, b) { if (b === undefined) { b = a; a = 0; } return a + Math.floor(this.next() * (b - a + 1)); };
  RNG.prototype.pick = function (arr) { return arr[Math.floor(this.next() * arr.length)]; };
  RNG.prototype.chance = function (p) { return this.next() < p; };
  RNG.prototype.shuffle = function (arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(this.next() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  };
  RNG.prototype.weighted = function (items, wfn) {
    let total = 0; for (const it of items) total += wfn(it);
    let r = this.next() * total;
    for (const it of items) { r -= wfn(it); if (r <= 0) return it; }
    return items[items.length - 1];
  };
  RNG.prototype.save = function () { return this.s; };
  RNG.prototype.load = function (s) { this.s = s >>> 0; return this; };
  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /* ---------- Гексы (odd-r, pointy-top). Поле боя 15×11 ---------- */
  const Hex = {
    toCube(col, row) { const x = col - ((row - (row & 1)) >> 1); return [x, -x - row, row]; },
    fromCube(x, y, z) { return [x + ((z - (z & 1)) >> 1), z]; },
    dist(c1, r1, c2, r2) {
      const a = Hex.toCube(c1, r1), b = Hex.toCube(c2, r2);
      return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
    },
    neighbors(col, row) {
      const d = (row & 1)
        ? [[1, 0], [1, -1], [0, -1], [-1, 0], [0, 1], [1, 1]]
        : [[1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1]];
      return d.map(([dc, dr]) => [col + dc, row + dr]);
    },
    // гекс «за целью» на линии от атакующего через цель (для дыхания дракона)
    beyond(fromC, fromR, toC, toR) {
      const a = Hex.toCube(fromC, fromR), b = Hex.toCube(toC, toR);
      const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const n = Math.max(Math.abs(d[0]), Math.abs(d[1]), Math.abs(d[2])) || 1;
      const step = d.map(v => Math.round(v / n));
      // нормализуем до корректного шага куба (сумма = 0)
      const s = step[0] + step[1] + step[2];
      if (s !== 0) { const i = [0, 1, 2].sort((p, q) => Math.abs(d[q] / n - step[q]) - Math.abs(d[p] / n - step[p]))[0]; step[i] -= s; }
      return Hex.fromCube(b[0] + step[0], b[1] + step[1], b[2] + step[2]);
    },
    line(c1, r1, c2, r2) {
      const a = Hex.toCube(c1, r1), b = Hex.toCube(c2, r2);
      const n = Hex.dist(c1, r1, c2, r2), out = [];
      for (let i = 0; i <= n; i++) {
        const t = n === 0 ? 0 : i / n;
        const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + 1e-6, z = a[2] + (b[2] - a[2]) * t;
        out.push(Hex.fromCube(...Hex.roundCube(x, y, z)));
      }
      return out;
    },
    roundCube(x, y, z) {
      let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
      const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
      if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
      return [rx, ry, rz];
    },
    center(col, row, size, ox, oy) {
      const w = Math.sqrt(3) * size;
      return [(ox || 0) + w * (col + 0.5 * (row & 1)) + w / 2, (oy || 0) + size * 1.5 * row + size];
    },
    fromPixel(px, py, size, ox, oy) {
      const w = Math.sqrt(3) * size;
      px -= (ox || 0) + w / 2; py -= (oy || 0) + size;
      const q = (Math.sqrt(3) / 3 * px - 1 / 3 * py) / size, r = (2 / 3 * py) / size;
      return Hex.fromCube(...Hex.roundCube(q, -q - r, r));
    },
    polygon(cx, cy, size, squash) {
      const pts = [];
      for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); pts.push([cx + size * Math.cos(a), cy + size * (squash || 1) * Math.sin(a)]); }
      return pts;
    },
  };

  /* ---------- Очередь с приоритетом ---------- */
  function PQ() { this.a = []; }
  PQ.prototype.push = function (p, v) {
    const a = this.a; a.push([p, v]); let i = a.length - 1;
    while (i > 0) { const q = (i - 1) >> 1; if (a[i][0] < a[q][0]) { const t = a[i]; a[i] = a[q]; a[q] = t; i = q; } else break; }
  };
  PQ.prototype.pop = function () {
    const a = this.a; if (!a.length) return undefined;
    const top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i;
      if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r;
      if (m === i) break; const t = a[i]; a[i] = a[m]; a[m] = t; i = m; } }
    return top;
  };
  Object.defineProperty(PQ.prototype, 'size', { get() { return this.a.length; } });

  /* ---------- Хелперы ---------- */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const clone = o => JSON.parse(JSON.stringify(o));
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }
  const RES = ['gold', 'wood', 'ore', 'mercury', 'sulfur', 'crystal', 'gems'];
  const RARE = ['mercury', 'sulfur', 'crystal', 'gems'];
  function costStr(cost, names) {
    return RES.filter(r => cost[r]).map(r => cost[r] + ' ' + (names ? names[r] : r)).join(', ');
  }
  function canAfford(res, cost) { return RES.every(r => (res[r] || 0) >= (cost[r] || 0)); }
  function pay(res, cost, mult) { mult = mult || 1; RES.forEach(r => { if (cost[r]) res[r] -= cost[r] * mult; }); }
  function addRes(res, cost, mult) { mult = mult || 1; RES.forEach(r => { if (cost[r]) res[r] = (res[r] || 0) + cost[r] * mult; }); }
  function mulCost(cost, k) { const o = {}; RES.forEach(r => { if (cost[r]) o[r] = cost[r] * k; }); return o; }
  function u8ToB64(u8) { let s = ''; for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]); return (typeof btoa === 'function' ? btoa(s) : Buffer.from(s, 'binary').toString('base64')); }
  function b64ToU8(b) { const s = typeof atob === 'function' ? atob(b) : Buffer.from(b, 'base64').toString('binary'); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }

  H3.U = { RNG, hashStr, Hex, PQ, clamp, lerp, sum, clone, fmt, plural, RES, RARE, costStr, canAfford, pay, addRes, mulCost, u8ToB64, b64ToU8 };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.U;
})(typeof window !== 'undefined' ? window : globalThis);
