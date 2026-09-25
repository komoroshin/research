/* ============================================================================
   view/mappaint.js — рисованная земля карты приключений.

   Карта делится на куски 8×8 клеток; каждый кусок рисуется лениво, с двойной
   плотностью, и живёт в кэше (одним холстом всю карту ×2 телефон не потянет).
   Земля считается по точкам: местность берётся со сдвинутой шумом клетки —
   границы получаются мягкими и неровными, а не сеткой; цвет — пятна света и
   тени по шуму; у воды — отмель и пена, у берега — пляж. Поверх — детали
   (трава пучками, камни, рябь, лужи, трещины), дороги и препятствия.
   Всё детерминировано по координатам клеток — куски сходятся без швов.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const TILE = 32, CH = 8, CPX = CH * TILE;

  /* ---------- шум ---------- */
  function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 144665) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s, oct) { let sum = 0, amp = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { sum += amp * vnoise(x * f, y * f, s + i * 17); n += amp; amp *= 0.5; f *= 2.03; } return sum / n; }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  /* ---------- палитры: тень, середина, свет; детали ---------- */
  const PAL = {
    grass:  { c: ['#3a7428', '#56963a', '#8abc5c'], blade: ['#2a5a1a', '#3f7a26', '#6aa23c', '#a6d066'], tuft: 14, flowers: ['#f6e27a', '#ffffff', '#ee93b8', '#a8c8ff'] },
    dirt:   { c: ['#6a4e32', '#8a6a44', '#aa8a5e'], blade: ['#5e5a2a', '#7c7640', '#a09858'], tuft: 2, stones: 3, cracks: 1 },
    sand:   { c: ['#c4a262', '#dcc284', '#f2e2ae'], ripple: '#b08a52', stones: 1 },
    snow:   { c: ['#a8bcd2', '#dde7f1', '#ffffff'], sparkle: 1, stones: 1 },
    swamp:  { c: ['#34482a', '#50703e', '#76965a'], blade: ['#223a18', '#3a5626', '#5a7a36', '#86a050'], tuft: 6, puddles: 1, reeds: 1 },
    rough:  { c: ['#76664a', '#968666', '#b8a886'], blade: ['#5e5a30', '#7c7640', '#a09858'], tuft: 1.5, stones: 6, cracks: 1 },
    lava:   { c: ['#221614', '#3a2824', '#56382e'], glow: 1, stones: 2 },
    subter: { c: ['#44383e', '#62545a', '#84747a'], stones: 4, crystals: ['#7fd9ea', '#c07ff0', '#7fe0a8'] },
    water:  { c: ['#1b4a88', '#2a64b2', '#3f86cc'] },
    rock:   { c: ['#18181e', '#2a2a32', '#44444e'], cracks: 2 },
  };
  for (const k in PAL) PAL[k].rgb = PAL[k].c.map(rgb);
  const BEACH = rgb('#e2cc92'), SHALLOW = rgb('#4aa6d6'), FOAM = rgb('#e6f4fb');

  /** Художник одного слоя карты. */
  function create(state, z) {
    const map = H3.State.lvl(state, z), T = H3.Rules.TERRAINS, Sp = H3.Sprites, seed = (state.seed || 1) >>> 0;
    const RS = Math.min(2, Math.max(1, Math.round(root.devicePixelRatio || 1)));
    const chunks = new Map(), order = [];
    const MAX = 64;   // кусков в памяти (≈1 МБ каждый при ×2)
    const tAt = (tx, ty) => T[map.terrain[Math.max(0, Math.min(map.h - 1, ty)) * map.w + Math.max(0, Math.min(map.w - 1, tx))]];
    const land = t => t !== 'water';

    /** Земля куска: по точке на пиксель карты, затем ×RS со сглаживанием. */
    function paintBase(ctx, cx, cy) {
      const X0 = cx * CPX, Y0 = cy * CPX;
      const low = document.createElement('canvas'); low.width = CPX; low.height = CPX;
      const lc = low.getContext('2d'), img = lc.createImageData(CPX, CPX), d = img.data;
      const W = map.w * TILE, H = map.h * TILE;
      for (let j = 0; j < CPX; j++) for (let i = 0; i < CPX; i++) {
        const x = X0 + i, y = Y0 + j, k = (j * CPX + i) * 4;
        if (x >= W || y >= H) { d[k + 3] = 0; continue; }
        const n1 = vnoise(x / 22, y / 22, seed) * 2 - 1 + (vnoise(x / 7, y / 7, seed + 3) - 0.5) * 0.5;
        const n2 = vnoise(x / 22 + 40, y / 22, seed + 1) * 2 - 1 + (vnoise(x / 7 + 9, y / 7, seed + 4) - 0.5) * 0.5;
        const px = x + n1 * 10, py = y + n2 * 10;
        const tx = Math.floor(px / TILE), ty = Math.floor(py / TILE), t = tAt(tx, ty);
        const P = PAL[t] || PAL.grass;
        const v = fbm(x / 110, y / 110, seed + 7, 3), s = vnoise(x / 8, y / 8, seed + 9);
        let c = v < 0.5 ? mix(P.rgb[0], P.rgb[1], v * 2) : mix(P.rgb[1], P.rgb[2], (v - 0.5) * 2);
        c = mix(c, s < 0.5 ? P.rgb[0] : P.rgb[2], Math.abs(s - 0.5) * 0.35);
        if (t === 'water') {
          // глубина: чем ближе суша, тем светлее; у самой кромки — пена
          let near = 0;
          for (const [dx, dy, w] of [[9, 0, 1], [-9, 0, 1], [0, 9, 1], [0, -9, 1], [4, 0, 2], [-4, 0, 2], [0, 4, 2], [0, -4, 2]]) if (land(tAt(Math.floor((px + dx) / TILE), Math.floor((py + dy) / TILE)))) near = Math.max(near, w);
          if (near === 1) c = mix(c, SHALLOW, 0.45);
          else if (near === 2) c = mix(mix(c, SHALLOW, 0.6), FOAM, 0.35 + 0.35 * s);
        } else if (t !== 'lava' && t !== 'rock' && t !== 'snow' && t !== 'subter') {
          // пляж у воды
          let wet = false;
          for (const [dx, dy] of [[6, 0], [-6, 0], [0, 6], [0, -6]]) if (tAt(Math.floor((px + dx) / TILE), Math.floor((py + dy) / TILE)) === 'water') { wet = true; break; }
          if (wet) c = mix(c, BEACH, 0.7);
        }
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
      lc.putImageData(img, 0, 0);
      ctx.save(); ctx.setTransform(RS, 0, 0, RS, 0, 0); ctx.imageSmoothingEnabled = true; ctx.drawImage(low, 0, 0); ctx.restore();
    }

    /** Детали по клеткам (с полем в клетку вокруг куска — чтобы на стыке ничего не обрезалось). */
    function paintDetails(ctx, cx, cy) {
      const tx0 = cx * CH - 1, ty0 = cy * CH - 1, tx1 = cx * CH + CH, ty1 = cy * CH + CH;
      const B = {};   // пучки штрихов по цвету — один stroke на цвет
      const path = c => B[c] || (B[c] = new Path2D());
      ctx.lineCap = 'round';
      for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
        if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) continue;
        const t = tAt(tx, ty), P = PAL[t]; if (!P) continue;
        const rnd = rngOf(hash(tx, ty, seed + 101) * 4294967296);
        const bx = tx * TILE, by = ty * TILE;
        if (P.tuft) for (let i = 0; i < P.tuft; i++) {
          const x = bx + rnd() * TILE, y = by + rnd() * TILE, L = fbm(x / 110, y / 110, seed + 7, 3), n = 3 + (rnd() * 3 | 0);
          for (let b = 0; b < n; b++) {
            const h = (1.6 + rnd() * 2.0) * (P.reeds && rnd() < 0.2 ? 2.4 : 1), lean = (rnd() - 0.5) * 1.1, x0 = x + (rnd() - 0.5) * 3;
            const ci = Math.max(0, Math.min(P.blade.length - 1, Math.floor(L * P.blade.length * 1.2 + (rnd() - 0.5) * 1.8) - (b === 0 ? 1 : 0)));
            const p = path(P.blade[ci]); p.moveTo(x0, y); p.quadraticCurveTo(x0 + lean * h * 0.3, y - h * 0.6, x0 + lean * h, y - h);
          }
        }
        if (P.flowers && rnd() < 0.18) { ctx.fillStyle = P.flowers[(rnd() * P.flowers.length) | 0]; const x = bx + 4 + rnd() * 24, y = by + 4 + rnd() * 24; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x + (rnd() - 0.5) * 5, y + (rnd() - 0.5) * 3, 0.9, 0, Math.PI * 2); ctx.fill(); } }
        if (P.stones) for (let i = 0; i < P.stones; i++) {
          if (rnd() > 0.45) continue;
          const x = bx + rnd() * TILE, y = by + rnd() * TILE, s = 0.8 + rnd() * 1.8, base = PAL[t].rgb[2];
          ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x + s * 0.5, y + s * 0.4, s * 1.3, s * 0.6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgb(' + mix(base, [255, 255, 255], 0.15).map(v => v | 0).join(',') + ')'; ctx.beginPath(); ctx.ellipse(x, y - s * 0.2, s * 1.2, s * 0.8, 0, 0, Math.PI * 2); ctx.fill();
        }
        if (P.ripple) { const p = path('rgba(160,120,70,0.35)'); for (let i = 0; i < 3; i++) { const x = bx + rnd() * TILE, y = by + rnd() * TILE, L = 4 + rnd() * 6; p.moveTo(x - L, y); p.quadraticCurveTo(x, y - 1.5, x + L, y + 0.5); } }
        if (P.cracks && rnd() < 0.3 * P.cracks) { const p = path('rgba(30,20,12,0.4)'); let x = bx + rnd() * TILE, y = by + rnd() * TILE; p.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rnd() - 0.5) * 9; y += (rnd() - 0.3) * 4; p.lineTo(x, y); } }
        if (P.sparkle) { ctx.fillStyle = 'rgba(255,255,255,0.95)'; for (let i = 0; i < 4; i++) ctx.fillRect(bx + rnd() * TILE, by + rnd() * TILE, 0.6, 0.6); }
        if (P.puddles && rnd() < 0.35) {
          const x = bx + 6 + rnd() * 20, y = by + 6 + rnd() * 20, r = 3 + rnd() * 5;
          ctx.fillStyle = 'rgba(20,34,28,0.55)'; ctx.beginPath(); ctx.ellipse(x + 0.6, y + 0.8, r * 1.6 + 1, r * 0.7 + 1, 0, 0, Math.PI * 2); ctx.fill();
          const g = ctx.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, '#5e8e8a'); g.addColorStop(1, '#2a4a44'); ctx.fillStyle = g;
          ctx.beginPath(); ctx.ellipse(x, y, r * 1.6, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
        }
        if (P.glow && rnd() < 0.5) {
          let x = bx + rnd() * TILE, y = by + rnd() * TILE; ctx.beginPath(); ctx.moveTo(x, y);
          for (let k = 0; k < 4; k++) { x += (rnd() - 0.5) * 10; y += (rnd() - 0.3) * 5; ctx.lineTo(x, y); }
          ctx.strokeStyle = 'rgba(255,110,30,0.35)'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = 'rgba(255,190,90,0.9)'; ctx.lineWidth = 0.9; ctx.stroke();
        }
        if (P.crystals && rnd() < 0.15) { const x = bx + 6 + rnd() * 20, y = by + 8 + rnd() * 20, c = P.crystals[(rnd() * 3) | 0]; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x, y - 6); ctx.lineTo(x + 2, y); ctx.fill(); }
        if (t === 'water' && rnd() < 0.6) { const p = path('rgba(200,230,255,0.35)'); const x = bx + rnd() * TILE, y = by + rnd() * TILE, L = 3 + rnd() * 5; p.moveTo(x - L, y); p.quadraticCurveTo(x, y - 1.5, x + L, y); }
      }
      for (const c in B) { ctx.strokeStyle = c; ctx.lineWidth = c.startsWith('rgba') ? 0.6 : 0.5; ctx.stroke(B[c]); }
    }

    /** Дороги: мягкая колея от центра к центрам соседей. */
    function paintRoads(ctx, cx, cy) {
      const x0 = cx * CH - 1, y0 = cy * CH - 1, x1 = cx * CH + CH, y1 = cy * CH + CH;
      const roadAt = (x, y) => x >= 0 && y >= 0 && x < map.w && y < map.h && map.road[y * map.w + x];
      const P = new Path2D(); let any = false;
      const DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (!roadAt(x, y)) continue; any = true;
        const cxp = x * TILE + 16, cyp = y * TILE + 16; let links = 0;
        for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) if (roadAt(x + d[0], y + d[1]) && !(d[0] && d[1] && (roadAt(x + d[0], y) || roadAt(x, y + d[1])))) links++;
        for (const d of DIRS) {
          if (!roadAt(x + d[0], y + d[1])) continue;
          if (d[0] && d[1] && (roadAt(x + d[0], y) || roadAt(x, y + d[1]))) continue;
          P.moveTo(cxp, cyp); P.lineTo(cxp + d[0] * TILE, cyp + d[1] * TILE);
        }
        if (!links) { P.moveTo(cxp, cyp); P.lineTo(cxp + 0.1, cyp); }
      }
      if (!any) return;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [c, w] of [['rgba(60,44,28,0.35)', 16], ['#7a6040', 12], ['#b49a70', 9], ['rgba(230,210,170,0.35)', 3]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(P); }
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (!roadAt(x, y)) continue; const rnd = rngOf(hash(x, y, seed + 303) * 4294967296);
        ctx.fillStyle = 'rgba(110,90,60,0.8)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x * TILE + 11 + rnd() * 10, y * TILE + 11 + rnd() * 10, 0.9, 0, Math.PI * 2); ctx.fill(); }
      }
    }

    /** Препятствия: деревья, горы, скалы — с мягкой тенью у подножия. */
    function paintObstacles(ctx, cx, cy) {
      const x0 = cx * CH - 2, y0 = cy * CH - 1, x1 = cx * CH + CH + 1, y1 = cy * CH + CH + 3;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (x < 0 || y < 0 || x >= map.w || y >= map.h) continue;
        const obs = map.obs[y * map.w + x]; if (!obs) continue;
        const sp = H3.Terrain.obstacleSprite(T[map.terrain[y * map.w + x]], obs, x, y); if (!sp) continue;
        const px = x * TILE + 16 + ((x * 3 + y) % 3) - 1, py = y * TILE + 31;
        const g = ctx.createRadialGradient(px, py - 2, 1, px, py - 2, obs === 2 ? 22 : 13);
        g.addColorStop(0, 'rgba(10,14,20,0.35)'); g.addColorStop(1, 'rgba(10,14,20,0)');
        ctx.fillStyle = g; ctx.fillRect(px - 24, py - 20, 48, 30);
        ctx.imageSmoothingEnabled = true;
        Sp.draw(ctx, sp, px, py, 1, (x + y) % 2 === 0);
      }
    }

    function build(cx, cy) {
      const cv = document.createElement('canvas'); cv.width = CPX * RS; cv.height = CPX * RS;
      const ctx = cv.getContext('2d');
      paintBase(ctx, cx, cy);
      ctx.setTransform(RS, 0, 0, RS, -cx * CPX * RS, -cy * CPX * RS);
      paintDetails(ctx, cx, cy);
      paintRoads(ctx, cx, cy);
      paintObstacles(ctx, cx, cy);
      if (z) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#5b5568'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.globalCompositeOperation = 'source-over'; }
      return cv;
    }
    function get(cx, cy, force) {
      const key = cx + ',' + cy;
      let cv = chunks.get(key);
      if (cv) return cv;
      if (!force) return null;
      cv = build(cx, cy); chunks.set(key, cv); order.push(key);
      while (order.length > MAX) chunks.delete(order.shift());
      return cv;
    }
    /** Вывести видимые клетки; недорисованные куски — по два за кадр, остальное — ровным цветом (дорисуется). */
    function draw(ctx, x0, y0, x1, y1) {
      let budget = 2;
      const prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
      for (let cy = Math.floor(y0 / CH); cy <= Math.floor(y1 / CH); cy++) for (let cx = Math.floor(x0 / CH); cx <= Math.floor(x1 / CH); cx++) {
        let cv = get(cx, cy, false);
        if (!cv && budget > 0) { budget--; cv = get(cx, cy, true); }
        if (cv) ctx.drawImage(cv, cx * CPX, cy * CPX, CPX, CPX);
        else { ctx.fillStyle = (PAL[tAt(cx * CH + 4, cy * CH + 4)] || PAL.grass).c[1]; ctx.fillRect(cx * CPX, cy * CPX, CPX, CPX); painter.pending = true; }
      }
      ctx.imageSmoothingEnabled = prev;
    }
    const painter = { draw, get, clear: () => { chunks.clear(); order.length = 0; }, pending: false };
    return painter;
  }

  H3.MapPaint = { create, PAL, CH };
})(typeof window !== 'undefined' ? window : globalThis);
