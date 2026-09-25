/* ============================================================================
   view/battlebg.js — рисованный задник поля боя.

   Три слоя, как на театральной сцене: небо с облаками и дальними горами,
   средний план (холмы, лес, скалы), земля. Слои едут с разной скоростью
   (параллакс в battle.js). Всё рисуется с запасом плотности (×2), поэтому
   на телефоне фон не распадается на квадраты.

   Земля — не заливка: крупные пятна света и тени по шуму, трава пучками
   (светлые кончики там, где солнце), цветы, камни с тенью, проплешины;
   у каждой местности свои детали — лужи в болоте, трещины на лаве, рябь
   на песке, искры на снегу, кристаллы под землёй.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  /* ---------- шум ---------- */
  function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 144665) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s, oct) { let sum = 0, amp = 0.5, f = 1, n = 0; for (let i = 0; i < (oct || 4); i++) { sum += amp * vnoise(x * f, y * f, s + i * 17); n += amp; amp *= 0.5; f *= 2.03; } return sum / n; }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- цвет ---------- */
  function rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  const css = (c, a) => a === undefined ? 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')' : 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';

  /* ---------- палитры местностей ---------- */
  const PAL = {
    grass:  { sky: ['#3d74c0', '#8cbbe8', '#e9e6cf'], far: '#8399b8', hill: '#6a9160', hill2: '#50784a', tree: '#2f5229', treeL: '#6b9a44',
              gFar: '#93b060', gNear: '#3f6f26', gDark: '#2c521a', gLight: '#b5d06c', blade: ['#264d17', '#3f7424', '#6c9d3a', '#a9cf63'], tuft: 1, flowers: ['#f6e27a', '#ffffff', '#ee93b8', '#a8c8ff'], patch: '#8d7048', stone: '#a29f93' },
    dirt:   { sky: ['#5a79a6', '#b5c3cf', '#e8dcc2'], far: '#8e93a0', hill: '#8a7a58', hill2: '#6f6244', tree: '#4a4a2a', treeL: '#7a7a44',
              gFar: '#b09a70', gNear: '#6e5236', gDark: '#4f3a24', gLight: '#cdb487', blade: ['#5a5a2a', '#76733a', '#9c9454', '#c2b774'], tuft: 0.35, flowers: ['#e8d27a'], patch: '#5e4630', stone: '#9a8f80', cracks: '#3e2c1c' },
    sand:   { sky: ['#4c8fd6', '#a9d0f0', '#f6ecd0'], far: '#c9ae7a', hill: '#dcc088', hill2: '#c8a86e', tree: '#6f7a3a', treeL: '#a8a860',
              gFar: '#f0dcac', gNear: '#d0a868', gDark: '#b08850', gLight: '#fff0c8', blade: ['#8a8a48', '#a8a060', '#c8bc78'], tuft: 0.12, ripple: '#b89058', stone: '#b8a078' },
    snow:   { sky: ['#6f8fb8', '#c2d4e6', '#f2f5f8'], far: '#aebfd4', hill: '#dfe8f0', hill2: '#c4d2e0', tree: '#3a5048', treeL: '#6a8078',
              gFar: '#eef3f8', gNear: '#d2deea', gDark: '#a8bcd2', gLight: '#ffffff', blade: ['#9aa0a0', '#b8bcb8'], tuft: 0.015, sparkle: 1, stone: '#8e96a2' },
    swamp:  { sky: ['#4f6e70', '#98ae9e', '#cfd6bc'], far: '#6d8478', hill: '#4f6a4a', hill2: '#3e5a3c', tree: '#243a24', treeL: '#4e6a3a',
              gFar: '#7a8f5a', gNear: '#3e5430', gDark: '#2a3c22', gLight: '#9aae6a', blade: ['#243a1a', '#3a5626', '#5a7a36', '#86a050'], tuft: 1.1, puddles: '#2e4a44', reeds: 1, stone: '#6f7666' },
    rough:  { sky: ['#5a7eaa', '#b4c6d4', '#eadfc6'], far: '#8f8a90', hill: '#9a8866', hill2: '#7e6e50', tree: '#4c5230', treeL: '#7c8048',
              gFar: '#b8a57c', gNear: '#7e6a48', gDark: '#5e4c32', gLight: '#d2be90', blade: ['#5e5a30', '#7c7640', '#a09858'], tuft: 0.3, rocks: 1, stone: '#a09486', cracks: '#4a3a28' },
    lava:   { sky: ['#1e0e10', '#5a1e14', '#b0481e'], far: '#3a1a18', hill: '#2c1614', hill2: '#241010', tree: '#1a0c0a', treeL: '#3a1a14',
              gFar: '#4a302a', gNear: '#2a1a16', gDark: '#160c0a', gLight: '#6a4436', blade: [], tuft: 0, glow: '#ff7a24', stone: '#4a3a36', cracks: '#ff6a1a' },
    subter: { sky: ['#140f16', '#241a26', '#3a2c38'], far: '#2a2030', hill: '#2e2432', hill2: '#241c28', tree: '#1a141e', treeL: '#3a2e40',
              gFar: '#4a3c46', gNear: '#2c2230', gDark: '#1c1620', gLight: '#6a5a66', blade: ['#3a4a3a', '#4a5e48'], tuft: 0.1, crystals: ['#7fd9ea', '#c07ff0', '#7fe0a8'], stone: '#5a4e5a' },
  };

  function layer(w, h, R) { const c = document.createElement('canvas'); c.width = Math.round(w * R); c.height = Math.round(h * R); const x = c.getContext('2d'); x.setTransform(R, 0, 0, R, 0, 0); return [c, x]; }

  /* ---------- небо ---------- */
  function cloud(ctx, x, y, s, rnd, lit, shade, a) {
    // кучевое облако: круги, свет сверху, тень снизу
    const blobs = []; const n = 5 + Math.floor(rnd() * 5);
    for (let i = 0; i < n; i++) blobs.push([x + (rnd() - 0.5) * s * 2.2, y - rnd() * s * 0.5, s * (0.35 + rnd() * 0.45)]);
    ctx.save(); ctx.globalAlpha = a;
    for (const [bx, by, r] of blobs) { const g = ctx.createRadialGradient(bx - r * 0.3, by - r * 0.4, r * 0.1, bx, by, r); g.addColorStop(0, css(lit)); g.addColorStop(0.7, css(mix(lit, shade, 0.35))); g.addColorStop(1, css(shade, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = css(shade, 0.5); ctx.beginPath(); ctx.ellipse(x, y + s * 0.15, s * 1.3, s * 0.16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function ridge(w, base, amp, sc, seed, sharp) {
    const pts = [];
    for (let x = -10; x <= w + 10; x += 4) { let n = fbm(x / sc, 0.5, seed, 5); if (sharp) n = 1 - Math.abs(n * 2 - 1); pts.push([x, base - n * amp]); }
    return pts;
  }
  function fillRidge(ctx, pts, bottom, top, low) {
    const g = ctx.createLinearGradient(0, Math.min(...pts.map(p => p[1])), 0, bottom); g.addColorStop(0, top); g.addColorStop(1, low);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pts[0][0], bottom); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], bottom); ctx.closePath(); ctx.fill();
  }
  /** Освещённые склоны гор: на каждый подъём слева от вершины кладём светлую грань. */
  function litFaces(ctx, pts, bottom, color) {
    ctx.fillStyle = color;
    for (let i = 2; i < pts.length - 2; i++) {
      const p = pts[i]; if (!(p[1] < pts[i - 1][1] && p[1] <= pts[i + 1][1] && p[1] < pts[i - 2][1])) continue;
      let j = i; while (j > 0 && pts[j - 1][1] >= pts[j][1]) j--;
      ctx.beginPath(); ctx.moveTo(p[0], p[1]);
      for (let k = i - 1; k >= j; k--) ctx.lineTo(pts[k][0], pts[k][1]);
      ctx.lineTo(pts[j][0] + (p[0] - pts[j][0]) * 0.55, bottom); ctx.lineTo(p[0] + 2, bottom * 0.3 + p[1] * 0.7); ctx.closePath(); ctx.fill();
    }
  }
  function paintSky(ctx, P, t, w, h, HZ, rnd) {
    const S = P.sky.map(rgb);
    const g = ctx.createLinearGradient(0, 0, 0, HZ + 20); g.addColorStop(0, css(S[0])); g.addColorStop(0.62, css(S[1])); g.addColorStop(1, css(S[2]));
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (t === 'subter') {   // свод пещеры: каменные складки и сталактиты
      for (let k = 0; k < 3; k++) {
        const pts = ridge(w, HZ * (0.25 + k * 0.22), HZ * 0.18, 60 + k * 30, 71 + k, true).map(p => [p[0], HZ * (0.25 + k * 0.22) * 2 - p[1]]);
        const c = mix(rgb(P.far), rgb('#000000'), 0.3 - k * 0.1);
        ctx.fillStyle = css(c); ctx.beginPath(); ctx.moveTo(-10, -10); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(w + 10, -10); ctx.fill();
      }
      for (let x = rnd() * 30; x < w; x += 18 + rnd() * 40) {
        const L = 10 + rnd() * HZ * 0.5, W = 4 + rnd() * 8, y0 = HZ * (0.3 + rnd() * 0.3);
        const gg = ctx.createLinearGradient(x - W, 0, x + W, 0); gg.addColorStop(0, '#4a3c4c'); gg.addColorStop(1, '#1a141c');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x - W, y0 - 20); ctx.lineTo(x + W, y0 - 20); ctx.lineTo(x + 1, y0 + L); ctx.closePath(); ctx.fill();
      }
      return;
    }
    // светило с ореолом
    const sx = w * 0.78, sy = HZ * 0.3, glow = t === 'lava' ? '#ffb070' : '#fff6d8';
    const sg = ctx.createRadialGradient(sx, sy, 2, sx, sy, HZ * 0.9); sg.addColorStop(0, css(rgb(glow), 0.85)); sg.addColorStop(0.08, css(rgb(glow), 0.5)); sg.addColorStop(1, css(rgb(glow), 0));
    ctx.fillStyle = sg; ctx.fillRect(0, 0, w, HZ + 30);
    // облака: дальние бледнее и мельче
    const lit = t === 'lava' ? rgb('#8a4a38') : rgb('#ffffff'), shade = t === 'lava' ? rgb('#2a1210') : mix(S[1], rgb('#6a7a96'), 0.45);
    for (let i = 0; i < Math.round(w / 140); i++) cloud(ctx, rnd() * w, HZ * (0.18 + rnd() * 0.45), 14 + rnd() * 20, rnd, lit, shade, 0.55 + rnd() * 0.3);
    // дальние горы: дымка к подножию, свет на левых склонах
    const far = rgb(P.far), haze = S[2];
    const r1 = ridge(w, HZ - 4, HZ * 0.55, 150, 11, true);
    fillRidge(ctx, r1, HZ + 30, css(mix(far, haze, 0.25)), css(mix(far, haze, 0.75)));
    litFaces(ctx, r1, HZ + 30, css(mix(haze, rgb('#ffffff'), 0.4), 0.22));
    if (t === 'snow' || t === 'grass' || t === 'rough') {   // снег на вершинах
      ctx.fillStyle = 'rgba(250,252,255,0.75)';
      for (let i = 2; i < r1.length - 2; i++) { const p = r1[i]; if (p[1] < HZ - HZ * 0.38 && p[1] <= r1[i - 1][1] && p[1] <= r1[i + 1][1]) { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - 9, p[1] + 9); ctx.lineTo(p[0] - 3, p[1] + 7); ctx.lineTo(p[0] + 2, p[1] + 10); ctx.lineTo(p[0] + 8, p[1] + 7); ctx.closePath(); ctx.fill(); } }
    }
    if (t === 'lava') {   // вулкан с дымом
      const vx = w * 0.3, vy = HZ - HZ * 0.6;
      ctx.fillStyle = '#2a1210'; ctx.beginPath(); ctx.moveTo(vx - 90, HZ + 10); ctx.lineTo(vx - 14, vy); ctx.lineTo(vx + 14, vy); ctx.lineTo(vx + 100, HZ + 10); ctx.fill();
      const lg = ctx.createRadialGradient(vx, vy, 2, vx, vy, 40); lg.addColorStop(0, 'rgba(255,150,60,0.9)'); lg.addColorStop(1, 'rgba(255,90,30,0)'); ctx.fillStyle = lg; ctx.fillRect(vx - 40, vy - 40, 80, 80);
      for (let i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(40,24,22,' + (0.35 - i * 0.03) + ')'; ctx.beginPath(); ctx.arc(vx + i * 9 + rnd() * 8, vy - 10 - i * 12, 10 + i * 3, 0, Math.PI * 2); ctx.fill(); }
    }
  }

  /* ---------- средний план ---------- */
  function tree(ctx, x, y, s, P, rnd, kind) {
    const dark = rgb(P.tree), lite = rgb(P.treeL);
    if (kind === 'pine') {
      for (let k = 0; k < 3; k++) {
        const yy = y - s * (0.3 + k * 0.45), ww = s * (0.55 - k * 0.13);
        const g = ctx.createLinearGradient(x - ww, 0, x + ww, 0); g.addColorStop(0, css(mix(dark, lite, 0.55))); g.addColorStop(1, css(dark));
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - ww, yy + s * 0.25); ctx.lineTo(x, yy - s * 0.5); ctx.lineTo(x + ww, yy + s * 0.25); ctx.closePath(); ctx.fill();
      }
      return;
    }
    if (kind === 'palm') {
      ctx.strokeStyle = css(mix(dark, rgb('#6a5030'), 0.6)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.6, x + s * 0.1, y - s * 1.2); ctx.stroke();
      ctx.strokeStyle = css(mix(dark, lite, 0.4)); ctx.lineWidth = 1.4;
      for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.55; ctx.beginPath(); ctx.moveTo(x + s * 0.1, y - s * 1.2); ctx.quadraticCurveTo(x + s * 0.1 + Math.cos(a) * s * 0.4, y - s * 1.3 + Math.sin(a) * s * 0.2, x + s * 0.1 + Math.cos(a) * s * 0.6, y - s * 1.05 + Math.sin(a) * s * 0.1 + s * 0.2); ctx.stroke(); }
      return;
    }
    // лиственное дерево: ствол и крона из шаров, свет слева-сверху
    ctx.fillStyle = css(mix(dark, rgb('#3a2a1a'), 0.6)); ctx.fillRect(x - s * 0.05, y - s * 0.45, s * 0.1, s * 0.45);
    const n = 4 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const bx = x + (rnd() - 0.5) * s * 0.6, by = y - s * (0.55 + rnd() * 0.45), r = s * (0.22 + rnd() * 0.16);
      const g = ctx.createRadialGradient(bx - r * 0.4, by - r * 0.4, r * 0.1, bx, by, r); g.addColorStop(0, css(lite)); g.addColorStop(1, css(dark));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  function paintMid(ctx, P, t, w, h, HZ, rnd) {
    if (t === 'subter') {   // дальняя стена пещеры и светящиеся жилы
      const pts = ridge(w, HZ + 4, HZ * 0.4, 70, 23, true);
      fillRidge(ctx, pts, HZ + 30, css(rgb(P.hill)), css(rgb(P.hill2)));
      for (let i = 0; i < w / 60; i++) { const x = rnd() * w, y = HZ - rnd() * HZ * 0.3, c = P.crystals[i % 3]; const g = ctx.createRadialGradient(x, y, 0, x, y, 14); g.addColorStop(0, css(rgb(c), 0.55)); g.addColorStop(1, css(rgb(c), 0)); ctx.fillStyle = g; ctx.fillRect(x - 14, y - 14, 28, 28); }
      return;
    }
    // холмы среднего плана
    const hill = rgb(P.hill), hill2 = rgb(P.hill2), haze = rgb(P.sky[2]);
    const r2 = ridge(w, HZ + 6, HZ * 0.22, 110, 37, false);
    fillRidge(ctx, r2, HZ + 34, css(mix(hill, haze, 0.35)), css(mix(hill2, haze, 0.2)));
    // линия леса / скал / пальм на горизонте
    const kind = t === 'sand' ? 'palm' : t === 'snow' ? 'pine' : t === 'swamp' ? 'round' : t === 'rough' || t === 'dirt' ? 'mixed' : t === 'lava' ? 'rock' : 'mixed';
    for (let x = -10; x < w + 10; x += 5 + rnd() * 9) {
      const i = Math.max(0, Math.min(r2.length - 1, Math.round((x + 10) / 4)));
      const y = Math.max(HZ + 8, r2[i][1] + 6) + rnd() * 5;
      const dense = fbm(x / 90, 3.3, 51, 3);
      if (kind === 'palm' && dense < 0.55) continue;
      if (kind === 'rock' || (kind === 'mixed' && dense < 0.38)) {
        if (rnd() < 0.5) continue;
        const s = 5 + rnd() * 10; const g = ctx.createLinearGradient(x - s, 0, x + s, 0); g.addColorStop(0, css(mix(hill, rgb('#ffffff'), t === 'lava' ? 0.05 : 0.2))); g.addColorStop(1, css(mix(hill2, rgb('#000000'), 0.3)));
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * 0.3, y - s * 0.9); ctx.lineTo(x + s * 0.4, y - s * 0.7); ctx.lineTo(x + s, y); ctx.closePath(); ctx.fill();
        continue;
      }
      if (dense < 0.42 && rnd() < 0.6) continue;
      const s = 12 + rnd() * 12 + dense * 10;
      tree(ctx, x, y, s, P, rnd, kind === 'mixed' ? (rnd() < 0.35 ? 'pine' : 'round') : kind);
    }
    // дымка у горизонта: дальний план тонет в воздухе
    const hg = ctx.createLinearGradient(0, HZ - 30, 0, HZ + 30); hg.addColorStop(0, css(haze, 0)); hg.addColorStop(0.6, css(haze, t === 'lava' ? 0.1 : 0.28)); hg.addColorStop(1, css(haze, 0));
    ctx.fillStyle = hg; ctx.fillRect(0, HZ - 30, w, 60);
  }

  /* ---------- земля ---------- */
  function paintGround(ctx, P, t, w, h, HZ, rnd, R) {
    const top = HZ + 2;
    // волнистая кромка поля
    const edge = []; for (let x = -10; x <= w + 10; x += 6) edge.push([x, top + 6 + fbm(x / 70, 9.1, 5, 3) * 10]);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-10, h); for (const p of edge) ctx.lineTo(p[0], p[1]); ctx.lineTo(w + 10, h); ctx.closePath(); ctx.clip();
    // основа: пятна света и тени по шуму, дальнее — светлее и в дымке
    const gFar = rgb(P.gFar), gNear = rgb(P.gNear), gDark = rgb(P.gDark), gLight = rgb(P.gLight), haze = rgb(P.sky[2]);
    const cs = 5, lw = Math.ceil(w / cs), lh = Math.ceil((h - top) / cs) + 2;
    const low = document.createElement('canvas'); low.width = lw; low.height = lh;
    const lc = low.getContext('2d'), img = lc.createImageData(lw, lh), d = img.data;
    const light = new Float32Array(lw * lh);
    for (let j = 0; j < lh; j++) {
      const y = top + j * cs, v = Math.max(0, Math.min(1, (y - top) / (h - top)));
      const base = mix(gFar, gNear, Math.pow(v, 0.7));
      for (let i = 0; i < lw; i++) {
        const x = i * cs;
        const n = fbm(x / 150, y / 95, 3, 4), m = fbm(x / 40 + 7, y / 28, 9, 3);
        let c = n < 0.5 ? mix(base, gDark, (0.5 - n) * 1.3) : mix(base, gLight, (n - 0.5) * 1.1);
        c = mix(c, m < 0.5 ? gDark : gLight, Math.abs(m - 0.5) * 0.35);
        // солнечное пятно сверху-слева и тень облака
        const sun = Math.max(0, 1 - Math.hypot((x - w * 0.3) / (w * 0.7), (y - top) / (h * 0.9)));
        c = mix(c, gLight, sun * 0.18);
        c = mix(c, haze, Math.max(0, 0.35 - v) * 0.9);
        const k = (j * lw + i) * 4; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
        light[j * lw + i] = n;
      }
    }
    lc.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(low, 0, top, lw * cs, lh * cs);
    const lightAt = (x, y) => { const i = Math.max(0, Math.min(lw - 1, Math.round(x / cs))), j = Math.max(0, Math.min(lh - 1, Math.round((y - top) / cs))); return light[j * lw + i]; };
    const depth = y => Math.max(0, Math.min(1, (y - top) / (h - top)));
    // проплешины и тропа
    if (P.patch) for (let i = 0; i < 4 + w / 300; i++) {
      const x = rnd() * w, y = top + 30 + rnd() * (h - top - 40), s = (18 + rnd() * 30) * (0.5 + depth(y));
      const g = ctx.createRadialGradient(x, y, 0, x, y, s); g.addColorStop(0, css(rgb(P.patch), 0.55)); g.addColorStop(0.7, css(rgb(P.patch), 0.25)); g.addColorStop(1, css(rgb(P.patch), 0));
      ctx.save(); ctx.translate(x, y); ctx.scale(1.6, 1); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.fillRect(x - s, y - s, s * 2, s * 2); ctx.restore();
    }
    // лужи болота: тёмная вода с отражением неба
    if (P.puddles) for (let i = 0; i < 6 + w / 200; i++) {
      const x = rnd() * w, y = top + 20 + rnd() * (h - top - 30), s = (10 + rnd() * 22) * (0.5 + depth(y));
      ctx.fillStyle = css(rgb(P.gDark), 0.6); ctx.beginPath(); ctx.ellipse(x + 1, y + 1.5, s * 1.7 + 2, s * 0.62 + 2, 0, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createLinearGradient(0, y - s * 0.6, 0, y + s * 0.6); g.addColorStop(0, css(mix(rgb(P.puddles), rgb(P.sky[1]), 0.45))); g.addColorStop(1, css(rgb(P.puddles)));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, s * 1.7, s * 0.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(x - s * 0.2, y - s * 0.15, s * 0.9, s * 0.2, 0, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
    }
    // рябь песка
    if (P.ripple) { ctx.strokeStyle = css(rgb(P.ripple), 0.35); ctx.lineWidth = 1; for (let i = 0; i < w * (h - top) / 900; i++) { const x = rnd() * w, y = top + rnd() * (h - top), L = 10 + rnd() * 18; ctx.beginPath(); ctx.moveTo(x - L, y); ctx.quadraticCurveTo(x, y - 3, x + L, y + 1); ctx.stroke(); ctx.strokeStyle = i % 2 ? css(rgb(P.ripple), 0.35) : 'rgba(255,248,225,0.45)'; } }
    // трещины: сухая земля, скалы, лава (светится)
    if (P.cracks) {
      const glow = t === 'lava';
      for (let i = 0; i < (glow ? 26 : 14) * w / 900; i++) {
        let x = rnd() * w, y = top + 20 + rnd() * (h - top - 20); const n = 4 + Math.floor(rnd() * 5);
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let k = 0; k < n; k++) { x += (rnd() - 0.5) * 22; y += (rnd() - 0.3) * 8; ctx.lineTo(x, y); }
        if (glow) { ctx.save(); ctx.shadowColor = '#ff7a24'; ctx.shadowBlur = 8 * R; ctx.strokeStyle = 'rgba(255,120,40,0.9)'; ctx.lineWidth = 2; ctx.stroke(); ctx.strokeStyle = 'rgba(255,220,140,0.9)'; ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore(); }
        else { ctx.strokeStyle = css(rgb(P.cracks), 0.45); ctx.lineWidth = 0.9; ctx.stroke(); }
      }
    }
    // камни с тенью и бликом
    const stone = rgb(P.stone), nStones = (P.rocks ? 60 : 22) * w / 900;
    for (let i = 0; i < nStones; i++) {
      const x = rnd() * w, y = top + 16 + rnd() * (h - top - 16), s = (1.5 + rnd() * (P.rocks ? 5 : 3)) * (0.5 + depth(y));
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(x + s * 0.5, y + s * 0.35, s * 1.3, s * 0.55, 0, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createLinearGradient(x - s, y - s, x + s, y + s); g.addColorStop(0, css(mix(stone, rgb('#ffffff'), 0.35))); g.addColorStop(1, css(mix(stone, rgb('#000000'), 0.4)));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - s * 0.2, s * 1.2, s * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    }
    // трава пучками: тёмная у земли, светлые кончики там, где солнце
    if (P.tuft && P.blade.length) {
      const B = P.blade, paths = B.map(() => new Path2D()), n = Math.round(w * (h - top) / 70 * P.tuft);
      for (let i = 0; i < n; i++) {
        const x = rnd() * w, y = top + 8 + rnd() * (h - top), v = depth(y), sz = 0.55 + v * 0.8, L = lightAt(x, y);
        const blades = 3 + Math.floor(rnd() * 4);
        for (let b = 0; b < blades; b++) {
          const bx = x + (rnd() - 0.5) * 5 * sz, H = (3 + rnd() * 4.5) * sz * (P.reeds && rnd() < 0.15 ? 2.6 : 1), lean = (rnd() - 0.5) * 0.9;
          let ci = Math.min(B.length - 1, Math.max(0, Math.floor(L * B.length * 1.25 + (rnd() - 0.5) * 1.6)));
          if (b === 0 && ci > 0) ci--;
          const p = paths[ci]; p.moveTo(bx, y); p.quadraticCurveTo(bx + lean * H * 0.3, y - H * 0.6, bx + lean * H, y - H);
        }
      }
      ctx.lineCap = 'round';
      B.forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 0.75; ctx.stroke(paths[i]); });
    }
    // цветы
    if (P.flowers) for (let i = 0; i < w * (h - top) / 2600; i++) {
      const x = rnd() * w, y = top + 20 + rnd() * (h - top - 20), s = 0.9 + depth(y) * 0.9;
      if (fbm(x / 60, y / 60, 77, 2) < 0.52) continue;
      ctx.fillStyle = P.flowers[Math.floor(rnd() * P.flowers.length)];
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x + (rnd() - 0.5) * 6, y + (rnd() - 0.5) * 3, s, 0, Math.PI * 2); ctx.fill(); }
    }
    // искры на снегу
    if (P.sparkle) { ctx.fillStyle = 'rgba(255,255,255,0.95)'; for (let i = 0; i < w * (h - top) / 700; i++) { const x = rnd() * w, y = top + rnd() * (h - top); ctx.fillRect(x, y, 0.8, 0.8); } }
    // кристаллы подземелья: светятся цветом
    if (P.crystals) for (let i = 0; i < 10 * w / 900; i++) {
      const x = rnd() * w, y = top + 30 + rnd() * (h - top - 40), c = rgb(P.crystals[i % P.crystals.length]), s = 4 + rnd() * 5;
      const g = ctx.createRadialGradient(x, y - s, 0, x, y - s, s * 4); g.addColorStop(0, css(c, 0.4)); g.addColorStop(1, css(c, 0)); ctx.fillStyle = g; ctx.fillRect(x - s * 4, y - s * 5, s * 8, s * 8);
      for (let k = -1; k <= 1; k++) { ctx.fillStyle = css(mix(c, rgb('#ffffff'), k === 0 ? 0.3 : 0)); ctx.beginPath(); ctx.moveTo(x + k * s * 0.6 - s * 0.3, y); ctx.lineTo(x + k * s * 0.9, y - s * (k === 0 ? 2.2 : 1.4)); ctx.lineTo(x + k * s * 0.6 + s * 0.3, y); ctx.fill(); }
    }
    // светящиеся угли на лаве
    if (P.glow) { for (let i = 0; i < 40 * w / 900; i++) { const x = rnd() * w, y = top + rnd() * (h - top); ctx.fillStyle = 'rgba(255,' + (120 + (rnd() * 100 | 0)) + ',40,0.8)'; ctx.fillRect(x, y, 1.2, 1.2); } }
    ctx.restore();
    // мягкая тень у кромки поля: земля уходит за горизонт
    const eg = ctx.createLinearGradient(0, top, 0, top + 26); eg.addColorStop(0, css(haze, t === 'subter' ? 0 : 0.35)); eg.addColorStop(1, css(haze, 0)); ctx.fillStyle = eg; ctx.fillRect(0, top, w, 26);
  }

  /** Слои задника: { sky, mid, ground, s } — s пикселей холста на единицу поля. */
  function make(terrain, w, h, day, hz) {
    const P = PAL[terrain] || PAL.grass, t = PAL[terrain] ? terrain : 'grass';
    const R = Math.min(2, Math.max(1, root.devicePixelRatio || 1));
    const HZ = h * hz, seed = (terrain.length * 7919 + w) >>> 0;
    const T = H3.Terrain;
    const [sky, sc] = layer(w, h, R); paintSky(sc, P, t, w, h, HZ, rngOf(seed + 1));
    const [mid, mc] = layer(w, h, R); paintMid(mc, P, t, w, h, HZ, rngOf(seed + 2));
    const [ground, gc] = layer(w, h, R); paintGround(gc, P, t, w, h, HZ, rngOf(seed + 3), R);
    // виньетка: края уходят в тень, взгляд собирается к середине
    const g = gc.createRadialGradient(w / 2, (HZ + h) / 2, Math.min(w, h) * 0.32, w / 2, (HZ + h) / 2, Math.max(w, h) * 0.66);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(12,10,8,0.38)'); gc.fillStyle = g; gc.fillRect(0, HZ, w, h - HZ);
    // свет дня: на слоях с прозрачными местами — только в пределах нарисованного
    if (T && T.applyDaylight) for (const [cv, c] of [[sky, sc], [mid, mc], [ground, gc]]) {
      const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height; const x = tmp.getContext('2d');
      x.drawImage(cv, 0, 0); x.setTransform(R, 0, 0, R, 0, 0); T.applyDaylight(x, day || 4, 0, 0, w, h);
      x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(cv, 0, 0);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.drawImage(tmp, 0, 0); c.restore();
    }
    return { sky, mid, ground, s: R };
  }

  H3.BattleBg = { make, PAL, fbm };
})(typeof window !== 'undefined' ? window : globalThis);
