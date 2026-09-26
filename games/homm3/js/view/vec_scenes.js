/* ============================================================================
   view/vec_scenes.js — рисованные картины интерфейса: открытка начала недели и
   парадная — месяца, финал партии (победа и поражение), живое главное меню.

   Картина — это холст, собранный из тех же приёмов, что и рисованный конвейер:
   гладкие кривые, объём градиентом по свету, контровой свет по гребням, дымка
   воздушной перспективы. Фигуры (герои, существа, города, деревья) — готовые
   рисунки V.def, которые кладутся в сцену с тенью и подсветкой её освещения.
   Свои детали сцен (знамёна, меч в земле) описаны здесь же через V.def — под именами
   «спрайт.деталь» (rally_flag.banner, rally_flag.fallen, ic_att.grave): дополнения к настоящему спрайту.

   H3.Scenes = {
     week(canvas, { kind, cid, faction, heroCls, color, month, seed }) — открытка недели,
     finale(canvas, { won, faction, color, heroCls, seed }) — картина финала,
     menu(host, { faction, heroCls, color, mood, active }) → { destroy() } — живой фон меню,
     weekName(wk) — «Неделя грифона» по событию недели.
   }
   Все размеры внутри — в пикселях устройства; единица сцены — доля высоты.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { P, tube } = K;

  /* ---------- основа ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function rngOf(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rgbOf(c) { c = c.replace('#', ''); if (c.length === 3) c = c.replace(/./g, x => x + x); const n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  const mix = (a, b, t) => { const x = rgbOf(a), y = rgbOf(b); return '#' + x.map((v, i) => clamp(Math.round(v + (y[i] - v) * t), 0, 255).toString(16).padStart(2, '0')).join(''); };
  const rgba = (c, a) => { const [r, g, b] = rgbOf(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(a, 0, 1).toFixed(3) + ')'; };
  function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  /** Плотность картины: 2 хватает и на iPhone (dpr 3) — это живопись, не текст. */
  const DPR = () => Math.min(2, Math.max(1, root.devicePixelRatio || 1));
  function poly(pts) { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); return p; }
  /** Сглаженный контур через точки (середины отрезков — опоры квадратичных кривых). */
  function smoothPath(pts, closed) {
    const p = new Path2D(), n = pts.length;
    if (closed) {
      const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = m(pts[n - 1], pts[0]);
      p.moveTo(s[0], s[1]);
      for (let i = 0; i < n; i++) { const q = m(pts[i], pts[(i + 1) % n]); p.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]); }
      p.closePath(); return p;
    }
    p.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < n - 1; i++) p.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
    p.lineTo(pts[n - 1][0], pts[n - 1][1]);
    return p;
  }
  function star(x, y, r, n, k) { const out = []; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * (k || 0.42) : r; out.push(P(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 1)); } return out; }

  /* ---------- настроение неба и земли ---------- */
  const MOOD = {
    day: { sky: ['#2c5a9a', '#5f92cc', '#a9cbe4', '#e6e6d0'], sun: [0.8, 0.17, '#fff8e0'], glow: 0.38, cloud: ['#ffffff', '#e2e8f2', '#9aa8c2'], haze: '#b6cadf', far: '#7f90b2', light: '#fff2d2', shade: '#34446c' },
    dawn: { sky: ['#34457e', '#8a6c9a', '#e89a72', '#fbdca0'], sun: [0.2, 0.52, '#fff0c4'], glow: 0.62, cloud: ['#ffe2c4', '#e8a48e', '#6e5680'], haze: '#e6b6a0', far: '#86789a', light: '#ffd49a', shade: '#44366a' },
    dusk: { sky: ['#1c1634', '#522848', '#b0463a', '#ee8e4e'], sun: [0.76, 0.62, '#ffb070'], glow: 0.55, cloud: ['#f0a07e', '#9a4e60', '#34223e'], haze: '#9a5c5a', far: '#553858', light: '#ffa070', shade: '#241634' },
    night: { sky: ['#060a1c', '#131e48', '#283866', '#454c76'], moon: [0.76, 0.2, '#f2f0e0'], glow: 0.26, cloud: ['#8c98ba', '#4a5680', '#1a2040'], haze: '#384670', far: '#283254', light: '#b8c8ff', shade: '#0a1024', stars: true },
    gold: { sky: ['#46669c', '#b89c74', '#f0c06e', '#fbe6ae'], sun: [0.7, 0.44, '#fff0b0'], glow: 0.62, cloud: ['#fff0d0', '#f0c890', '#9e786a'], haze: '#e6c69a', far: '#9a8888', light: '#ffe0a0', shade: '#5a4050' },
    gloom: { sky: ['#262e2c', '#454f44', '#65705c', '#868c6c'], sun: [0.3, 0.3, '#d8e0b0'], glow: 0.14, cloud: ['#8a9480', '#586254', '#283026'], haze: '#687260', far: '#4a5448', light: '#c8d0a0', shade: '#1a2018', fog: '#9aaa8a' },
    storm: { sky: ['#171b27', '#2c3244', '#484e62', '#68686e'], glow: 0, cloud: ['#6e7484', '#3a4050', '#13161d'], haze: '#4a5060', far: '#343a4a', light: '#b0b8c8', shade: '#0e1220' },
  };
  const LAND = {
    grass: { far: '#5e8a5a', mid: '#4e7a38', near: '#3e6a28', lit: '#a8d068', dark: '#1c3414', path: '#c8aa70', trees: ['tree_1', 'tree_2', 'tree_pine'], flowers: ['#f4e060', '#ffffff', '#e05a7a', '#9ab0ff'] },
    snow: { far: '#b8c8dc', mid: '#d0dcea', near: '#e4ecf4', lit: '#ffffff', dark: '#7a8aa4', path: '#a4aeba', trees: ['tree_snow', 'tree_pine'] },
    lava: { far: '#5a3a38', mid: '#46302c', near: '#36241f', lit: '#b8643a', dark: '#140c0a', path: '#6a4a38', trees: ['tree_dead'], glow: '#ff6020' },
    dirt: { far: '#6e6a58', mid: '#5c5440', near: '#4a4232', lit: '#a0906a', dark: '#221c14', path: '#8e7c58', trees: ['tree_dead', 'tree_pine'] },
    subter: { far: '#4a4056', mid: '#3e3448', near: '#302838', lit: '#8a78a8', dark: '#140f1a', path: '#6a5a70', trees: ['crystal_rock', 'rock_1'], glow: '#b070e0' },
    rough: { far: '#8a7050', mid: '#7a5c38', near: '#644a2c', lit: '#c8a060', dark: '#2a1c10', path: '#a88a5a', trees: ['rock_1', 'tree_dead', 'tree_pine'] },
    swamp: { far: '#4e6250', mid: '#3e5438', near: '#30462c', lit: '#8aa860', dark: '#141e10', path: '#7a7a4a', trees: ['tree_swamp', 'tree_2'] },
    sand: { far: '#c8a870', mid: '#d0aa6c', near: '#c4965a', lit: '#f8dc98', dark: '#6a4a24', path: '#e0c890', trees: ['tree_palm'] },
  };
  const landOf = fid => { const f = H3.Factions && H3.Factions.get(fid); return LAND[f && f.terrain] || LAND.grass; };

  /* ---------- рисунки из набора ---------- */
  /** Высота рисунка до якоря (ног) в клетках: сколько масштаба нужно на px пикселей роста. */
  function artOf(name, px, flip, tint) {
    const d = V._defs[name];
    if (d) {
      const s = px / Math.max(1, (d.anchor[1] + d.oy) / 10), q = Math.max(0.25, Math.ceil(s * 4) / 4);
      const cv = V.render(name, q, !!flip, tint || null, null);
      return cv ? { cv, k: s / q, ax: cv._anchor[0] * s, ay: cv._anchor[1] * s } : null;
    }
    const Sp = H3.Sprites; if (!Sp || !Sp.has(name)) return null;
    const one = Sp.render(name, 1, flip, tint); if (!one) return null;
    const s = px / Math.max(1, one._anchor[1]), q = Math.max(1, Math.round(s));
    const cv = Sp.render(name, q, flip, tint);
    return cv ? { cv, k: s / q, ax: cv._anchor[0] * s, ay: cv._anchor[1] * s } : null;
  }
  /** Свет сцены на фигуре: тёплое со стороны солнца, холодное в тень (только по нарисованному). */
  function graded(cv, g) {
    const t = mk(cv.width, cv.height), c = t.getContext('2d');
    c.drawImage(cv, 0, 0); c.globalCompositeOperation = 'source-atop';
    const gr = c.createLinearGradient(g.right ? t.width : 0, 0, g.right ? 0 : t.width, t.height * 0.5);
    gr.addColorStop(0, g.lit); gr.addColorStop(1, g.shade); c.fillStyle = gr; c.fillRect(0, 0, t.width, t.height);
    if (g.dark) { c.fillStyle = g.dark; c.fillRect(0, 0, t.width, t.height); }
    return t;
  }
  /** Фигура ростом px, ноги в (x, y); тень на земле (o.ground — где земля, если фигура парит). */
  function figure(ctx, name, x, y, px, o) {
    o = o || {};
    const a = artOf(name, px, o.flip, o.tint); if (!a) return null;
    const w = a.cv.width * a.k, h = a.cv.height * a.k, X = x - a.ax, Y = y - a.ay;
    if (o.shadow !== false) {
      const gy = o.ground === undefined ? y : o.ground, rx = Math.min(w * 0.36, px * 0.55) * (o.sw || 1), ry = rx * 0.2;
      const g = ctx.createRadialGradient(x, gy, 0, x, gy, rx);
      g.addColorStop(0, 'rgba(10,8,6,' + (o.sa || 0.4) + ')'); g.addColorStop(1, 'rgba(10,8,6,0)');
      ctx.save(); ctx.translate(0, gy); ctx.scale(1, ry / rx); ctx.translate(0, -gy); ctx.fillStyle = g; ctx.fillRect(x - rx, gy - rx, rx * 2, rx * 2); ctx.restore();
    }
    const src = o.grade ? graded(a.cv, o.grade) : a.cv;
    ctx.save(); ctx.imageSmoothingEnabled = true; if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
    ctx.drawImage(src, X, Y, w, h); ctx.restore();
    return { X, Y, w, h };
  }

  /* ---------- небо ---------- */
  function paintSky(ctx, w, h, M, rnd, hz) {
    hz = hz || h;
    const g = ctx.createLinearGradient(0, 0, 0, hz);
    M.sky.forEach((c, i) => g.addColorStop(i / (M.sky.length - 1), c));
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (M.stars) for (let i = 0, n = w * h / 700; i < n; i++) {
      const x = rnd() * w, y = rnd() * hz * 0.85, r = (rnd() * 1.1 + 0.4) * DPR();
      ctx.fillStyle = 'rgba(255,250,235,' + (0.25 + rnd() * 0.65).toFixed(2) + ')'; ctx.fillRect(x, y, r, r);
    }
    const s = M.sun || M.moon; if (!s) return;
    const sx = s[0] * w, sy = s[1] * hz, R = Math.max(6, h * 0.05);
    const gl = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 9);
    gl.addColorStop(0, rgba(s[2], M.glow)); gl.addColorStop(0.35, rgba(s[2], M.glow * 0.35)); gl.addColorStop(1, rgba(s[2], 0));
    ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
    const d = ctx.createRadialGradient(sx - R * 0.3, sy - R * 0.3, 0, sx, sy, R);
    d.addColorStop(0, '#ffffff'); d.addColorStop(0.7, s[2]); d.addColorStop(1, rgba(s[2], M.moon ? 0.9 : 0.6));
    ctx.fillStyle = d; ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fill();
    if (M.moon) { ctx.fillStyle = 'rgba(150,150,170,0.35)'; for (const [dx, dy, r] of [[-0.3, -0.1, 0.22], [0.25, 0.3, 0.16], [0.1, -0.4, 0.1]]) { ctx.beginPath(); ctx.arc(sx + dx * R, sy + dy * R, r * R, 0, Math.PI * 2); ctx.fill(); } }
  }
  /** Кучевое облако: пухлые клубы на плоском донце, свет сверху и со стороны солнца, тень снизу. */
  function cloudShape(w, h, M, rnd, lightX) {
    const c = mk(w, h), x = c.getContext('2d'), base = h * 0.84, n = 4 + Math.floor(w / h * 1.4);
    x.fillStyle = '#fff'; x.beginPath();
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, bell = Math.sin(t * Math.PI), r = h * (0.16 + bell * 0.3) * (0.8 + rnd() * 0.4);
      const cx = w * (0.1 + t * 0.8) + (rnd() - 0.5) * w / n * 0.5, cy = base - r * 0.72;
      x.moveTo(cx + r, cy); x.arc(cx, cy, r, 0, Math.PI * 2);
      if (bell > 0.6 && rnd() < 0.7) { const r2 = r * 0.6; x.moveTo(cx + r * 0.3 + r2, cy - r * 0.55); x.arc(cx + r * 0.3, cy - r * 0.55, r2, 0, Math.PI * 2); }
    }
    x.moveTo(w * 0.92, base - h * 0.08); x.ellipse(w / 2, base - h * 0.08, w * 0.42, h * 0.1, 0, 0, Math.PI * 2);
    x.fill();
    x.globalCompositeOperation = 'source-atop';
    const g = x.createLinearGradient(0, h * 0.05, 0, base); g.addColorStop(0, M.cloud[0]); g.addColorStop(0.55, M.cloud[1]); g.addColorStop(1, M.cloud[2]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const lx = clamp(lightX, -0.2, 1.2) * w, gl = x.createRadialGradient(lx, h * 0.1, 0, lx, h * 0.1, w * 0.7);
    gl.addColorStop(0, rgba(M.light, 0.55)); gl.addColorStop(1, rgba(M.light, 0)); x.fillStyle = gl; x.fillRect(0, 0, w, h);
    const sh = x.createLinearGradient(0, base - h * 0.2, 0, base + 2); sh.addColorStop(0, rgba(M.shade, 0)); sh.addColorStop(1, rgba(M.shade, 0.3)); x.fillStyle = sh; x.fillRect(0, 0, w, h);
    return c;
  }
  function paintClouds(ctx, w, h, M, rnd, o) {
    const sunX = (M.sun || M.moon || [0.5])[0] * w;
    for (let i = 0; i < o.n; i++) {
      const cw = w * (o.wMin + rnd() * (o.wMax - o.wMin)), ch = cw * (0.28 + rnd() * 0.12);
      const x = o.x0 !== undefined ? o.x0 + (i + rnd() * 0.6) / o.n * (o.x1 - o.x0) : rnd() * w;
      const y = h * (o.yMin + rnd() * (o.yMax - o.yMin));
      const c = cloudShape(cw, ch, M, rnd, (sunX - x + cw / 2) / cw);
      ctx.globalAlpha = o.alpha || 0.95;
      const wrap = o.wrap ? [-o.wrap, 0, o.wrap] : [0];
      for (const d of wrap) ctx.drawImage(c, x - cw / 2 + d, y - ch);
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- горы ---------- */
  function jag(a, b, n, amp, rnd) {
    const out = [a], nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1;
    for (let i = 1; i < n; i++) { const t = i / n, d = (rnd() - 0.5) * 2 * amp; out.push([a[0] + (b[0] - a[0]) * t + nx / L * d, a[1] + (b[1] - a[1]) * t + ny / L * d]); }
    out.push(b); return out;
  }
  /** Одна гора: теневая масса, освещённый левый склон по ломаному гребню, снег с подтёками, промоины. */
  function mountain(x, p, o, rnd) {
    const top = [p.x, o.base - p.ph], L = [p.x - p.wl, o.base + 4], R = [p.x + p.wr, o.base + 4];
    const left = jag(L, top, 7, p.ph * 0.045, rnd), right = jag(top, R, 7, p.ph * 0.045, rnd);
    const outline = left.concat(right.slice(1)), path = poly(outline);
    x.fillStyle = o.shade; x.fill(path);
    const crest = [top];
    for (let i = 1; i <= 5; i++) crest.push([top[0] + p.wr * (0.06 + 0.3 * i / 5) * (0.5 + rnd()) - p.wl * 0.06, top[1] + p.ph * i / 5 + 4]);
    const litPath = poly(left.concat(crest.slice(1)));   // левый склон до вершины и ломаный гребень вниз
    x.save(); x.clip(path);
    const lg = x.createLinearGradient(0, top[1], 0, o.base); lg.addColorStop(0, o.lit); lg.addColorStop(1, mix(o.lit, o.shade, 0.35));
    x.fillStyle = lg; x.fill(litPath);
    if (o.snow) {
      const sy = top[1] + p.ph * o.snow, sp = [[L[0], top[1] - 8], [R[0], top[1] - 8]];
      const n = 9; for (let i = n; i >= 0; i--) { const t = i / n; sp.push([L[0] + (R[0] - L[0]) * t, sy + (i % 2 ? p.ph * (0.06 + rnd() * 0.1) : -p.ph * 0.03)]); }
      const snow = poly(sp);
      x.fillStyle = o.snowShade; x.fill(snow);
      x.save(); x.clip(litPath); x.fillStyle = o.snowLit; x.fill(snow); x.restore();
    }
    x.strokeStyle = rgba(o.shadeLine, 0.3); x.lineWidth = Math.max(1, p.ph * 0.012);
    for (let k = 0; k < 3; k++) { const c = crest[1 + Math.floor(rnd() * 3)]; x.beginPath(); x.moveTo(c[0] - p.wl * 0.1, c[1]); x.lineTo(c[0] - p.wl * (0.25 + rnd() * 0.2), c[1] + p.ph * (0.2 + rnd() * 0.2)); x.stroke(); }
    x.restore();
    // солнечная кромка по левому гребню
    x.strokeStyle = rgba(o.rim, 0.55); x.lineWidth = Math.max(1, p.ph * 0.012); x.lineJoin = 'round';
    x.beginPath(); x.moveTo(left[0][0], left[0][1]); for (const q of left) x.lineTo(q[0], q[1]); x.stroke();
  }
  /** Хребет: вершины вразброс, высокие дальше; низ тонет в дымке. */
  function paintRange(ctx, w, h, M, rnd, o) {
    const c = mk(w, h), x = c.getContext('2d');
    const base = o.c || M.far;
    const opt = { base: o.base, snow: o.snow, shade: mix(base, M.shade, 0.35), lit: mix(base, M.light, 0.3), shadeLine: M.shade, rim: M.light,
      snowLit: mix('#f6f8fc', M.light, 0.25), snowShade: mix('#c4d0e4', M.shade, 0.3) };
    const peaks = [];
    for (let i = 0; i < o.n; i++) { const ph = o.hMin + (o.hMax - o.hMin) * rnd(); peaks.push({ x: (-0.12 + 1.24 * (i + 0.2 + rnd() * 0.6) / o.n) * w, ph, wl: ph * (1.1 + rnd() * 0.9), wr: ph * (1.1 + rnd() * 0.9) }); }
    if (o.peakAt) for (const [px, k] of o.peakAt) peaks.push({ x: px * w, ph: o.hMax * k, wl: o.hMax * k * 1.2, wr: o.hMax * k * 1.4 });
    peaks.sort((a, b) => b.ph - a.ph);
    for (const p of peaks) mountain(x, p, opt, rnd);
    x.globalCompositeOperation = 'source-atop';
    const g = x.createLinearGradient(0, o.base - o.hMax, 0, o.base);
    g.addColorStop(0, rgba(M.haze, o.hazeTop || 0.05)); g.addColorStop(1, rgba(M.haze, o.hazeA === undefined ? 0.6 : o.hazeA));
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    ctx.drawImage(c, 0, 0);
  }

  /* ---------- холмы ---------- */
  /** Холм: гребень из трёх волн и горбов bumps [[x, высота, ширина]]; заливка по высоте, мягкая кромка света, штрихи травы. Возвращает y(x) гребня. */
  function paintHill(ctx, w, h, rnd, o) {
    const ph = [rnd() * 6.3, rnd() * 6.3, rnd() * 6.3], fr = o.freq || 1;
    const f = X => {
      let y = o.y - o.amp * (0.5 * Math.sin(X / w * 3.1 * fr + ph[0]) + 0.3 * Math.sin(X / w * 7.3 * fr + ph[1]) + 0.2 * Math.sin(X / w * 13 * fr + ph[2]));
      if (o.tilt) y += o.tilt * (X / w - 0.5);
      for (const [bx, bh, bw] of o.bumps || []) y -= bh * Math.exp(-(((X - bx) / bw) ** 2));
      return y;
    };
    const step = Math.max(2, w / 110), crest = [];
    for (let X = -12; X <= w + 12; X += step) crest.push([X, f(X)]);
    const path = new Path2D(); path.moveTo(crest[0][0], crest[0][1]); for (const q of crest) path.lineTo(q[0], q[1]); path.lineTo(w + 12, h + 12); path.lineTo(-12, h + 12); path.closePath();
    let minY = h; for (const q of crest) minY = Math.min(minY, q[1]);
    const g = ctx.createLinearGradient(0, minY, 0, o.bottom || h);
    g.addColorStop(0, o.c0); g.addColorStop(1, o.c1); ctx.fillStyle = g; ctx.fill(path);
    ctx.save(); ctx.clip(path);
    const s = o.s || 1;
    if (o.tex) for (let i = 0; i < o.tex; i++) {
      const X = rnd() * w, y0 = f(X), Y = y0 + Math.pow(rnd(), 1.5) * (h - y0), k = 0.5 + (Y - minY) / Math.max(1, h - minY), len = (2 + rnd() * 5) * s * k;
      ctx.strokeStyle = rgba(rnd() < 0.5 ? o.lit : o.dark, 0.14 + rnd() * 0.22); ctx.lineWidth = 0.8 * s * k;
      ctx.beginPath(); ctx.moveTo(X, Y); ctx.quadraticCurveTo(X + (rnd() - 0.5) * len * 0.4, Y - len * 0.6, X + (rnd() - 0.5) * len * 0.8, Y - len); ctx.stroke();
    }
    if (o.shade) { // тень от гребня: склон под кромкой темнее у подножия
      const sg = ctx.createLinearGradient(0, minY, 0, h); sg.addColorStop(0, rgba(o.dark, 0)); sg.addColorStop(1, rgba(o.dark, o.shade)); ctx.fillStyle = sg; ctx.fillRect(0, minY, w, h - minY);
    }
    const line = new Path2D(); line.moveTo(crest[0][0], crest[0][1]); for (const q of crest) line.lineTo(q[0], q[1]);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = rgba(o.rim || o.lit, 0.14); ctx.lineWidth = 9 * s; ctx.stroke(line);
    ctx.strokeStyle = rgba(o.rim || o.lit, 0.4); ctx.lineWidth = 2.2 * s; ctx.stroke(line);
    ctx.restore();
    f.path = path;
    return f;
  }
  /** Деревья вдоль гребня: дальше и выше по склону — мельче; вне зоны skip [[x0, x1]]. */
  function paintTrees(ctx, names, f, rnd, o) {
    const list = [];
    for (let i = 0; i < o.n; i++) {
      const x = o.x0 + rnd() * (o.x1 - o.x0);
      if ((o.skip || []).some(([a, b]) => x > a && x < b)) continue;
      const dy = rnd() * o.depth, y = f(x) + dy;
      list.push({ x, y, px: (o.hMin + rnd() * (o.hMax - o.hMin)) * (0.8 + dy / Math.max(1, o.depth) * 0.3), name: names[Math.floor(rnd() * names.length)] });
    }
    list.sort((a, b) => a.y - b.y);
    for (const t of list) figure(ctx, t.name, t.x, t.y, t.px, { flip: rnd() < 0.5, sa: 0.3, grade: o.grade });
  }
  /** Слой-плоскость: рисуем отдельно и кладём с дымкой (источник света и воздух над всем нарисованным). */
  function plane(w, h, paint, haze) {
    const c = mk(w, h), x = c.getContext('2d'); paint(x);
    if (haze && haze.a) {
      x.globalCompositeOperation = 'source-atop';
      const g = x.createLinearGradient(0, haze.y0 || 0, 0, haze.y1 || h); g.addColorStop(0, rgba(haze.c, haze.a)); g.addColorStop(1, rgba(haze.c, haze.a2 === undefined ? haze.a * 0.4 : haze.a2));
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    }
    return c;
  }

  /* ---------- свет и эффекты ---------- */
  function rays(ctx, sx, sy, len, n, col, a, rnd, spread, dir) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const ang = (dir === undefined ? Math.PI / 2 : dir) + (rnd() - 0.5) * (spread || Math.PI * 1.2), half = 0.015 + rnd() * 0.04, L = len * (0.6 + rnd() * 0.5);
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, L); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(ang - half) * L, sy + Math.sin(ang - half) * L); ctx.lineTo(sx + Math.cos(ang + half) * L, sy + Math.sin(ang + half) * L); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function glow(ctx, x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  /** Салют: разлёт искр с провисанием, ядро и ореол. */
  function firework(ctx, x, y, r, col, rnd) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glow(ctx, x, y, r * 1.3, col, 0.25);
    const n = 26 + Math.floor(rnd() * 12), s = r / 60;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + rnd() * 0.12, r1 = r * (0.7 + rnd() * 0.3), ex = x + Math.cos(a) * r1, ey = y + Math.sin(a) * r1 + r * 0.12;
      const g = ctx.createLinearGradient(x, y, ex, ey); g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.6, rgba(col, 0.5)); g.addColorStop(1, rgba('#ffffff', 0.95));
      ctx.strokeStyle = g; ctx.lineWidth = 1.6 * s + 0.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.2); ctx.quadraticCurveTo(x + Math.cos(a) * r1 * 0.8, y + Math.sin(a) * r1 * 0.8, ex, ey); ctx.stroke();
      ctx.fillStyle = rgba(mix(col, '#ffffff', 0.6), 0.9); ctx.beginPath(); ctx.arc(ex, ey, 1.8 * s + 0.6, 0, Math.PI * 2); ctx.fill();
      if (rnd() < 0.5) { ctx.fillStyle = rgba(col, 0.6); ctx.beginPath(); ctx.arc(ex + (rnd() - 0.5) * 4 * s, ey + r * 0.1 + rnd() * r * 0.1, 1.2 * s + 0.4, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }
  function vignette(ctx, w, h, a, col) { const g = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.35, w / 2, h * 0.5, Math.max(w, h) * 0.75); g.addColorStop(0, rgba(col || '#0c0806', 0)); g.addColorStop(1, rgba(col || '#0c0806', a)); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
  /** Птица-галочка (ворон, чайка): два крыла дугами. */
  function bird(ctx, x, y, s, col, flap) {
    ctx.fillStyle = col; ctx.beginPath();
    const up = flap === undefined ? 0.5 : flap;
    ctx.moveTo(x - s, y - s * up * 0.6); ctx.quadraticCurveTo(x - s * 0.45, y - s * (0.3 + up * 0.4), x, y); ctx.quadraticCurveTo(x + s * 0.45, y - s * (0.3 + up * 0.4), x + s, y - s * up * 0.6);
    ctx.quadraticCurveTo(x + s * 0.45, y - s * 0.12, x, y + s * 0.16); ctx.quadraticCurveTo(x - s * 0.45, y - s * 0.12, x - s, y - s * up * 0.6); ctx.fill();
  }
  /** Столб дыма: клубы расширяются кверху и сносятся ветром. */
  function smoke(ctx, x, y, hgt, col, rnd, a) {
    for (let i = 0; i < 14; i++) {
      const t = i / 13, r = hgt * (0.05 + t * 0.14), cx = x + t * t * hgt * 0.5 + (rnd() - 0.5) * r * 0.5, cy = y - t * hgt;
      const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      g.addColorStop(0, rgba(mix(col, '#ffffff', 0.15), (a || 0.5) * (1 - t * 0.6))); g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  function fog(ctx, w, y, hh, col, a) { const g = ctx.createLinearGradient(0, y - hh, 0, y + hh); g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.5, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(0, y - hh, w, hh * 2); }
  /** Стог: купол соломы с объёмом и штрихами. */
  function haystack(ctx, x, y, r, M) {
    const p = smoothPath([[x - r, y], [x - r * 0.9, y - r * 0.6], [x - r * 0.45, y - r * 1.1], [x + r * 0.1, y - r * 1.25], [x + r * 0.6, y - r * 0.95], [x + r * 0.95, y - r * 0.4], [x + r, y]], false);
    p.closePath();
    const g = ctx.createLinearGradient(x - r, y - r, x + r, y); g.addColorStop(0, mix('#f0cc6a', M.light, 0.3)); g.addColorStop(0.5, '#d4a440'); g.addColorStop(1, mix('#8a6020', M.shade, 0.3));
    ctx.fillStyle = g; ctx.fill(p);
    ctx.save(); ctx.clip(p); ctx.lineWidth = Math.max(1, r * 0.03);
    for (let i = 0; i < 26; i++) { const t = i / 25, sx = x - r + t * r * 2; ctx.strokeStyle = i % 3 ? 'rgba(120,80,20,0.35)' : 'rgba(255,240,180,0.45)'; ctx.beginPath(); ctx.moveTo(sx, y); ctx.quadraticCurveTo(x + (sx - x) * 0.5, y - r * 0.9, x + (sx - x) * 0.1, y - r * 1.3); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(70,40,10,0.7)'; ctx.lineWidth = Math.max(1, r * 0.035); ctx.stroke(p);
  }
  /** Молния: ломаная с ответвлением, ореол. */
  function lightning(ctx, x, y0, y1, s, rnd) {
    const pts = [[x, y0]]; let cx = x;
    for (let yy = y0; yy < y1; yy += (y1 - y0) / 9) { cx += (rnd() - 0.5) * s * 20; pts.push([cx, yy]); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, x, (y0 + y1) / 2, (y1 - y0) * 0.6, '#b8c8ff', 0.25);
    for (const [lw, c] of [[6 * s, 'rgba(160,180,255,0.25)'], [2.4 * s, 'rgba(220,230,255,0.9)'], [1 * s, '#ffffff']]) {
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
      const b = pts[4]; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] + 14 * s, b[1] + 16 * s); ctx.lineTo(b[0] + 10 * s, b[1] + 30 * s); ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- свои детали сцен (V.def) ---------- */
  const GOLD = '#d8a53a', WOOD = '#6a4424';
  // знамя цвета игрока: древко, ласточкин хвост, золотая звезда и бахрома, навершие-копьё
  V.def('rally_flag.banner', { w: 150, h: 320, anchor: [26, 316], parts: [{ kind: 'prop', pivot: [26, 40], shapes: [
    { p: tube([[26, 318, 8], [26, 34, 7]]), c: WOOD, m: 'wood', flow: -Math.PI / 2, line: 0.8 },
    { p: [P(30, 40, 1), [60, 30], [92, 44], [122, 34], P(146, 38, 1), [132, 74], P(146, 112, 1), [118, 106], [88, 118], [58, 104], P(30, 112, 1)], c: '$b:#d23b2a', m: 'cloth', belly: 0.35, line: 0.9,
      lines: [{ p: [[52, 36], [64, 70], [56, 106]], w: 2.2, a: 0.35 }, { p: [[96, 42], [104, 76], [94, 114]], w: 2.2, a: 0.3 }, { p: [[74, 40], [80, 74], [72, 110]], w: 1.4, light: true, a: 0.35 }],
      sub: [{ p: star(88, 76, 17, 5, 0.45), c: '#f0c24a', m: 'gold', line: 0.6, lc: '#6a4a10' },
        { p: [P(30, 40, 1), P(40, 40, 1), P(40, 112, 1), P(30, 112, 1)], c: '#e8b84a', m: 'gold', line: 0 }] },
    { p: [P(26, 0, 1), P(34, 20, 1), P(29, 30, 1), P(23, 30, 1), P(18, 20, 1)], c: GOLD, m: 'gold', line: 0.7, gloss: 1.2 },
    { e: [26, 33, 8, 5], c: GOLD, m: 'gold', line: 0.6 },
  ] }] });
  // сломанное знамя: обломок древка, клонящийся верх, обгорелое рваное полотнище висит вниз
  V.def('rally_flag.fallen', { w: 220, h: 320, anchor: [40, 316], parts: [{ kind: 'prop', pivot: [40, 300], shapes: [
    { e: [44, 314, 34, 7], c: '#3a2a1a', m: 'flat', line: 0 },
    { p: tube([[40, 318, 9], [52, 210, 8], [58, 170, 7]]), c: '#5a3a20', m: 'wood', flow: -1.45, line: 0.8 },
    { p: [P(52, 176, 1), P(60, 150, 1), P(64, 166, 1), P(70, 146, 1), P(68, 176, 1)], c: '#c8a070', m: 'wood', line: 0.6 },
    { p: tube([[64, 178, 7], [122, 140, 6], [178, 118, 6]]), c: '#5a3a20', m: 'wood', flow: -0.4, line: 0.8 },
    { p: [P(96, 156, 1), [122, 146], P(150, 132, 1), [158, 176], P(164, 214, 1), [152, 204], P(146, 244, 1), [136, 226], P(124, 262, 1), [118, 232], P(104, 250, 1), [102, 214], P(92, 226, 1), [94, 190]],
      c: '$b:#d23b2a', m: 'cloth', belly: 0.5, line: 0.9,
      lines: [{ p: [[110, 160], [116, 200], [112, 236]], w: 2, a: 0.4 }, { p: [[136, 150], [142, 190], [138, 224]], w: 2, a: 0.35 }],
      sub: [{ p: [[92, 140], [170, 120], [170, 180], [140, 200], [92, 196]], c: 'rgba(20,12,10,0.35)', m: 'flat', line: 0 },
        { e: [128, 190, 8, 11], c: 'rgba(20,12,10,0.75)', m: 'flat', line: 0 }, { e: [112, 222, 5, 7], c: 'rgba(20,12,10,0.7)', m: 'flat', line: 0 },
        { p: star(126, 172, 13, 5, 0.45), c: '#9a7a3a', m: 'gold', line: 0.5 }] },
    { p: [P(186, 318, 1), P(200, 296, 1), P(206, 304, 1), P(198, 320, 1)], c: '#9a7a3a', m: 'gold', line: 0.6 },
  ] }] });
  // меч в земле со щитом цвета игрока, прислонённым к кургану
  V.def('ic_att.grave', { w: 200, h: 260, anchor: [100, 256], parts: [{ kind: 'prop', pivot: [100, 250], shapes: [
    { p: [[40, 258], [70, 238], [110, 232], [150, 240], [176, 258]], c: '#4a3a26', m: 'leather', line: 0.6, belly: 0.4 },
    ...K.weapon.sword([112, 96], [0.1, 1], 138, { blade: '#b8c0c8' }),
    ...K.shield.heater(70, 206, 58, 70, { field: '$b:#d23b2a' }),
  ] }] });

  /* ---------- имя недели ---------- */
  const GEN_WORD = { 'стрелок': 'стрелка', 'вепрь': 'вепря', 'рысь': 'рыси', 'медведь': 'медведя', 'олень': 'оленя', 'червь': 'червя', 'элементаль': 'элементаля',
    'коатль': 'коатля', 'змий': 'змия', 'гончая': 'гончей', 'жар-птица': 'жар-птицы', 'олгой-хорхой': 'олгой-хорхоя', 'зомби': 'зомби', 'матка': 'матки' };
  function genWord(w) {
    const lw = w.toLowerCase();
    if (GEN_WORD[lw]) return GEN_WORD[lw];
    if (lw.includes('-')) return lw.split('-').map(genWord).join('-');
    let m;
    if ((m = /^(.*)(ый|ой)$/.exec(lw))) return m[1] + 'ого';
    if ((m = /^(.*[гкх])ий$/.exec(lw))) return m[1] + 'ого';
    if ((m = /^(.*)ий$/.exec(lw))) return m[1] + 'его';
    if ((m = /^(.*[жшчщ])ая$/.exec(lw))) return m[1] + 'ей';
    if ((m = /^(.*)ая$/.exec(lw))) return m[1] + 'ой';
    if ((m = /^(.*)яя$/.exec(lw))) return m[1] + 'ей';
    if ((m = /^(.*)ое$/.exec(lw))) return m[1] + 'ого';
    if ((m = /^(.*)ее$/.exec(lw))) return m[1] + 'его';
    if ((m = /^(.*)ие$/.exec(lw))) return m[1] + 'ия';
    if ((m = /^(.*[жшчщц])е$/.exec(lw))) return m[1] + 'а';
    if ((m = /^(.*)[йь]$/.exec(lw))) return m[1] + 'я';
    if ((m = /^(.*[гкхжшчщ])а$/.exec(lw))) return m[1] + 'и';
    if ((m = /^(.*)а$/.exec(lw))) return m[1] + 'ы';
    if ((m = /^(.*)я$/.exec(lw))) return m[1] + 'и';
    if (/[бвгджзклмнпрстфхцчшщ]$/.test(lw)) return lw + 'а';
    return lw;
  }
  /** Родительный падеж названия существа: определения и главное слово склоняются, хвост («ада», «на волке») — нет. */
  function genitive(name) {
    const words = String(name).split(' ');
    let head = false;
    return words.map((w, i) => {
      if (head) return w.toLowerCase();
      const adj = i < words.length - 1 && /(ый|ий|ой|ая|яя|ое|ее)$/i.test(w) && !GEN_WORD[w.toLowerCase()];
      if (!adj) head = true;
      return genWord(w);
    }).join(' ');
  }
  function weekName(wk) {
    if (!wk || wk.id === 'plain') return 'Мирная неделя';
    if (wk.id === 'creature' && wk.cid && H3.Creatures) { const c = H3.Creatures.get(wk.cid); if (c) return 'Неделя ' + genitive(c.name); }
    return wk.name || 'Новая неделя';
  }

  /* ---------- выбор героев и существ для картин ---------- */
  const FLYERS = { castle: ['griffin', 'angel'], rampart: ['pegasus', 'green_dragon'], tower: ['genie', 'stone_gargoyle'], inferno: ['efreet'], necropolis: ['bone_dragon', 'vampire'],
    dungeon: ['red_dragon', 'harpy', 'manticore'], stronghold: ['roc', 'thunderbird'], fortress: ['wyvern', 'serpent_fly'], conflux: ['phoenix', 'firebird'], cove: ['stormbird'], hive: ['wasp_warrior'],
    bastion: ['great_stag'], factory: ['couatl'] };
  function creaturesOf(fid, tiers) {
    const C = H3.Creatures; if (!C) return [];
    return C.LIST.filter(c => c.faction === fid && !c.upg && tiers.includes(c.tier)).map(c => c.id);
  }
  const isFlyer = cid => { const C = H3.Creatures, c = C && C.get(cid); return !!(c && C.isFlyer && C.isFlyer(c)); };
  const heroOf = (fid, cls) => 'hero_' + (cls || ((H3.Factions && H3.Factions.get(fid) || { classes: ['knight'] }).classes[0]));
  const tintOf = color => H3.Sprites && H3.Sprites.teamTint ? H3.Sprites.teamTint(color || '#d23b2a') : { b: color || '#d23b2a' };

  /* ---------- общий пейзаж для картин ---------- */
  /** Небо, облака, горы, средний план (с городом или без), ближний холм. Возвращает гребни. */
  function landscape(ctx, w, h, M, Ld, rnd, o) {
    o = o || {};
    paintSky(ctx, w, h, M, rnd, h * (o.hz || 0.66));
    paintClouds(ctx, w, h, M, rnd, { n: o.clouds === undefined ? 4 : o.clouds, wMin: 0.18, wMax: 0.34, yMin: 0.14, yMax: 0.4, alpha: 0.92 });
    paintRange(ctx, w, h, M, rnd, { base: h * 0.6, hMin: h * 0.12, hMax: h * 0.3, n: 6, snow: o.snow === undefined ? 0.28 : o.snow, hazeA: 0.55 });
    paintRange(ctx, w, h, M, rnd, { base: h * 0.64, hMin: h * 0.06, hMax: h * 0.14, n: 8, snow: 0, c: mix(Ld.far, M.far, 0.5), hazeA: 0.45 });
    const s = h / 300;
    let fMid = null;
    const mid = plane(w, h, x => {
      fMid = paintHill(x, w, h, rnd, { y: h * 0.66, amp: h * 0.03, c0: mix(Ld.mid, M.haze, 0.25), c1: mix(Ld.mid, M.shade, 0.3), lit: Ld.lit, dark: Ld.dark, rim: M.light, tex: 140, s, bumps: o.midBump ? [o.midBump] : [] });
      if (o.mid) o.mid(x, fMid);
      paintTrees(x, Ld.trees, fMid, rnd, { n: o.trees === undefined ? 7 : o.trees, x0: 0, x1: w, depth: h * 0.04, hMin: h * 0.07, hMax: h * 0.13, skip: o.treeSkip });
    }, { c: M.haze, a: 0.3, a2: 0.05, y0: h * 0.5, y1: h * 0.8 });
    ctx.drawImage(mid, 0, 0);
    const fNear = paintHill(ctx, w, h, rnd, { y: h * (o.nearY || 0.82), amp: h * 0.035, tilt: o.nearTilt || 0, c0: mix(Ld.near, M.light, 0.12), c1: mix(Ld.near, M.shade, 0.45), lit: Ld.lit, dark: Ld.dark, rim: M.light, tex: 420, s: s * 1.6, shade: 0.35, bumps: o.nearBumps || [] });
    return { fMid, fNear, s };
  }
  const warmGrade = (M, right) => ({ lit: rgba(M.light, 0.22), shade: rgba(M.shade, 0.22), right });

  /* ---------- открытка недели ---------- */
  function week(cv, o) {
    o = o || {};
    const dpr = DPR(), cw = cv.clientWidth || 360, ch = cv.clientHeight || Math.round(cw * 0.62);
    const w = cv.width = Math.round(cw * dpr), h = cv.height = Math.round(ch * dpr);
    const ctx = cv.getContext('2d'), rnd = rngOf(hashStr('week:' + (o.seed || 1) + ':' + (o.kind || '')));
    const kind = o.kind || 'plain', fid = o.faction || 'castle';
    const C = H3.Creatures;
    if (kind === 'creature' && o.cid && C && C.get(o.cid)) {
      const c = C.get(o.cid), M = MOOD.day, Ld = landOf(c.faction);
      const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { nearBumps: [[w * 0.56, h * 0.06, w * 0.2]] });
      rays(ctx, w * 0.56, -h * 0.1, h * 1.1, 9, M.light, 0.12, rnd, 0.9);
      const x = w * 0.56, y = fNear(x) + h * 0.02, fly = isFlyer(c.id);
      glow(ctx, x, y - h * 0.26, h * 0.42, '#fff0c0', 0.28);
      figure(ctx, c.id, x, fly ? y - h * 0.1 : y, h * (fly ? 0.5 : 0.56), { ground: y, sa: 0.45, sw: 1.1, grade: warmGrade(M) });
    } else if (kind === 'harvest') {
      const M = MOOD.gold, Ld = LAND.grass;
      const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { trees: 5, treeSkip: [[w * 0.6, w * 0.84]], mid: (x, f) => figure(x, 'windmill', w * 0.72, f(w * 0.72) + h * 0.01, h * 0.34, { grade: warmGrade(M) }) });
      // поле: золотые полосы жнивья по ближнему холму
      ctx.save(); ctx.clip(fNear.path);
      for (let i = 0; i < 14; i++) { const t = i / 13; ctx.strokeStyle = i % 2 ? 'rgba(250,220,120,0.35)' : 'rgba(140,100,30,0.25)'; ctx.lineWidth = h * (0.008 + t * 0.02); ctx.beginPath(); ctx.moveTo(-w * 0.1, h * (0.84 + t * 0.2)); ctx.quadraticCurveTo(w * 0.5, h * (0.8 + t * 0.12), w * 1.1, h * (0.86 + t * 0.2)); ctx.stroke(); }
      ctx.restore();
      haystack(ctx, w * 0.18, fNear(w * 0.18) + h * 0.06, h * 0.12, M);
      haystack(ctx, w * 0.36, fNear(w * 0.36) + h * 0.03, h * 0.08, M);
      figure(ctx, 'res_wood', w * 0.62, fNear(w * 0.62) + h * 0.1, h * 0.1, {});
      figure(ctx, 'res_gold', w * 0.8, fNear(w * 0.8) + h * 0.12, h * 0.13, {});
    } else if (kind === 'plague') {
      const M = MOOD.gloom, Ld = LAND.dirt;
      const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { snow: 0.1, trees: 4 });
      fog(ctx, w, h * 0.68, h * 0.08, M.fog, 0.45);
      figure(ctx, 'tree_dead', w * 0.16, fNear(w * 0.16) + h * 0.04, h * 0.55, { sa: 0.4, grade: { lit: 'rgba(160,190,140,0.15)', shade: 'rgba(10,20,10,0.4)' } });
      figure(ctx, 'tree_dead', w * 0.86, fNear(w * 0.86) + h * 0.02, h * 0.4, { flip: true, sa: 0.4, grade: { lit: 'rgba(160,190,140,0.15)', shade: 'rgba(10,20,10,0.4)' } });
      figure(ctx, 'obst_bones', w * 0.5, fNear(w * 0.5) + h * 0.1, h * 0.08, {});
      glow(ctx, w * 0.5, h * 0.9, h * 0.4, '#8ad060', 0.12);
      fog(ctx, w, h * 0.92, h * 0.1, M.fog, 0.5);
      for (let i = 0; i < 6; i++) bird(ctx, w * (0.3 + rnd() * 0.45), h * (0.14 + rnd() * 0.2), h * (0.018 + rnd() * 0.014), '#1a1c18', rnd());
    } else if (kind === 'swarm') {
      const M = MOOD.storm, Ld = LAND.rough;
      const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { snow: 0.15, trees: 4, clouds: 6 });
      lightning(ctx, w * 0.78, 0, h * 0.5, h / 300, rnd);
      const pool = C ? C.LIST.filter(c => !c.upg && c.tier >= 1 && c.tier <= 3 && c.faction !== 'machine' && !isFlyer(c.id)) : [];
      const pick = () => pool.length ? pool[Math.floor(rnd() * pool.length)].id : 'goblin';
      const marchers = [[0.2, 0.26], [0.38, 0.3], [0.56, 0.34], [0.76, 0.38]];
      for (const [t, k] of marchers) { const x = w * t; figure(ctx, pick(), x, fNear(x) + h * (0.02 + k * 0.1), h * k, { sa: 0.45, grade: { lit: 'rgba(180,190,220,0.12)', shade: 'rgba(10,12,24,0.3)' } }); }
    } else if (kind === 'wanderer') {
      const M = MOOD.day, Ld = landOf(fid);
      const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { nearBumps: [[w * 0.4, h * 0.03, w * 0.3]] });
      // дорога вьётся к горизонту
      const road = new Path2D(); road.moveTo(w * 0.2, h * 1.02); road.bezierCurveTo(w * 0.4, h * 0.9, w * 0.7, h * 0.86, w * 0.62, h * 0.76); road.bezierCurveTo(w * 0.56, h * 0.7, w * 0.66, h * 0.67, w * 0.7, h * 0.655);
      road.lineTo(w * 0.705, h * 0.656); road.bezierCurveTo(w * 0.69, h * 0.68, w * 0.62, h * 0.71, w * 0.68, h * 0.76); road.bezierCurveTo(w * 0.78, h * 0.86, w * 0.6, h * 0.94, w * 0.58, h * 1.02); road.closePath();
      const rg = ctx.createLinearGradient(0, h * 0.65, 0, h); rg.addColorStop(0, mix(Ld.path, M.haze, 0.4)); rg.addColorStop(1, Ld.path); ctx.fillStyle = rg; ctx.fill(road);
      ctx.strokeStyle = rgba(Ld.dark, 0.35); ctx.lineWidth = h * 0.004; ctx.stroke(road);
      // указатель у обочины
      const px = w * 0.84, py = fNear(px) + h * 0.06;
      ctx.fillStyle = '#5a3a1e'; ctx.fillRect(px - h * 0.008, py - h * 0.2, h * 0.016, h * 0.2);
      for (const [dy, dir] of [[0.18, 1], [0.12, -1]]) { const y = py - h * dy; ctx.fillStyle = '#9a7040'; ctx.beginPath(); ctx.moveTo(px, y - h * 0.018); ctx.lineTo(px + dir * h * 0.08, y - h * 0.018); ctx.lineTo(px + dir * h * 0.1, y); ctx.lineTo(px + dir * h * 0.08, y + h * 0.018); ctx.lineTo(px, y + h * 0.018); ctx.fill(); ctx.strokeStyle = '#3a2410'; ctx.lineWidth = h * 0.003; ctx.stroke(); }
      figure(ctx, heroOf(fid, o.heroCls), w * 0.42, h * 0.9, h * 0.42, { tint: tintOf(o.color), grade: warmGrade(M), sa: 0.45 });
    } else {   // мирная неделя: свой город вдали и первые существа прироста
      const M = MOOD.dawn, Ld = landOf(fid);
      const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { treeSkip: [[w * 0.56, w * 0.86]], midBump: [w * 0.7, h * 0.03, w * 0.14], mid: (x, f) => figure(x, 'town_' + fid, w * 0.7, f(w * 0.7) + h * 0.015, h * 0.3, { sa: 0.3, grade: warmGrade(M) }) });
      rays(ctx, w * 0.2, h * 0.34, h * 1.2, 10, M.light, 0.1, rnd, 1.2, 0.2);
      const cs = creaturesOf(fid, [1, 2]);
      if (cs[0]) figure(ctx, cs[0], w * 0.24, fNear(w * 0.24) + h * 0.08, h * 0.3, { grade: warmGrade(M), sa: 0.4 });
      if (cs[1]) figure(ctx, cs[1], w * 0.42, fNear(w * 0.42) + h * 0.12, h * 0.34, { grade: warmGrade(M), sa: 0.4 });
    }
    if (o.month) parade(ctx, w, h, rnd, o.color);
    vignette(ctx, w, h, 0.45);
  }
  /** Парад начала месяца: салют, знамёна по краям, золотой свет. */
  function parade(ctx, w, h, rnd, color) {
    const cols = ['#ffd860', mix(color || '#d23b2a', '#ffffff', 0.35), '#9ad8ff'];
    firework(ctx, w * 0.3, h * 0.2, h * 0.14, cols[0], rnd);
    firework(ctx, w * 0.66, h * 0.13, h * 0.11, cols[1], rnd);
    firework(ctx, w * 0.84, h * 0.3, h * 0.08, cols[2], rnd);
    const t = tintOf(color);
    figure(ctx, 'rally_flag.banner', w * 0.06, h * 1.02, h * 0.8, { tint: t, shadow: false });
    figure(ctx, 'rally_flag.banner', w * 0.94, h * 1.02, h * 0.8, { tint: t, flip: true, shadow: false });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, w * 0.5, h * 0.2, h * 0.6, '#ffe0a0', 0.12); ctx.restore();
  }

  /* ---------- финал партии ---------- */
  function finale(cv, o) {
    o = o || {};
    const dpr = DPR(), w = cv.width = Math.round(480 * dpr), h = cv.height = Math.round(300 * dpr);
    const ctx = cv.getContext('2d'), rnd = rngOf(hashStr('finale:' + (o.faction || '') + ':' + (o.seed || 1) + ':' + !!o.won));
    const fid = o.faction || 'castle', Ld = landOf(fid), tint = tintOf(o.color), hero = heroOf(fid, o.heroCls);
    if (o.won) victory(ctx, w, h, fid, Ld, tint, hero, o, rnd); else defeat(ctx, w, h, fid, Ld, tint, o, rnd);
  }
  function victory(ctx, w, h, fid, Ld, tint, hero, o, rnd) {
    const M = MOOD.dawn;
    const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { hz: 0.7, trees: 6, treeSkip: [[w * 0.14, w * 0.44]], midBump: [w * 0.3, h * 0.04, w * 0.14], nearY: 0.9, nearTilt: -h * 0.04,
      nearBumps: [[w * 0.72, h * 0.14, w * 0.2]], mid: (x, f) => figure(x, 'town_' + fid, w * 0.3, f(w * 0.3) + h * 0.015, h * 0.34, { sa: 0.3, grade: warmGrade(M) }) });
    rays(ctx, w * 0.2, h * 0.36, h * 1.3, 12, '#ffd8a0', 0.13, rnd, 1.3, 0.1);
    firework(ctx, w * 0.6, h * 0.16, h * 0.12, '#ffd860', rnd);
    firework(ctx, w * 0.82, h * 0.26, h * 0.09, mix(o.color || '#d23b2a', '#ffffff', 0.35), rnd);
    firework(ctx, w * 0.44, h * 0.08, h * 0.06, '#a8e0ff', rnd);
    const hx = w * 0.72, hy = fNear(hx) + h * 0.02;
    figure(ctx, 'rally_flag.banner', w * 0.6, fNear(w * 0.6) + h * 0.025, h * 0.46, { tint, flip: true, grade: warmGrade(M) });
    figure(ctx, 'rally_flag.banner', w * 0.86, fNear(w * 0.86) + h * 0.03, h * 0.42, { tint, flip: true, grade: warmGrade(M) });
    const cs = creaturesOf(fid, [1, 2, 3]);
    if (cs[0]) figure(ctx, cs[0], w * 0.5, fNear(w * 0.5) + h * 0.05, h * 0.2, { flip: true, grade: warmGrade(M), sa: 0.35 });
    if (cs[2]) figure(ctx, cs[2], w * 0.94, fNear(w * 0.94) + h * 0.06, h * 0.24, { flip: true, grade: warmGrade(M), sa: 0.35 });
    figure(ctx, hero, hx, hy, h * 0.44, { tint, flip: true, grade: warmGrade(M), sa: 0.5, sw: 1.2 });
    vignette(ctx, w, h, 0.4);
  }
  function defeat(ctx, w, h, fid, Ld, tint, o, rnd) {
    const M = MOOD.dusk;
    const town = 'town_' + fid;
    const { fNear } = landscape(ctx, w, h, M, Ld, rnd, { hz: 0.7, trees: 3, snow: 0.18, treeSkip: [[w * 0.56, w * 0.9]], midBump: [w * 0.72, h * 0.03, w * 0.14], nearY: 0.86,
      mid: (x, f) => {
        const ty = f(w * 0.72) + h * 0.015;
        glow(x, w * 0.72, ty - h * 0.08, h * 0.26, '#ff6a20', 0.35);
        figure(x, town, w * 0.72, ty, h * 0.3, { sa: 0.3, grade: { lit: 'rgba(255,120,60,0.25)', shade: 'rgba(20,10,30,0.55)' } });
        smoke(x, w * 0.66, ty - h * 0.14, h * 0.5, '#3a3038', rnd, 0.6);
        smoke(x, w * 0.8, ty - h * 0.18, h * 0.42, '#40343a', rnd, 0.5);
        x.save(); x.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 16; i++) glow(x, w * (0.62 + rnd() * 0.2), ty - h * (0.02 + rnd() * 0.2), h * 0.012, '#ffa040', 0.9);
        x.restore();
      } });
    const cold = { lit: 'rgba(255,120,80,0.12)', shade: 'rgba(24,12,40,0.45)', right: true };
    figure(ctx, 'tree_dead', w * 0.08, fNear(w * 0.08) + h * 0.06, h * 0.56, { sa: 0.4, grade: cold });
    figure(ctx, 'obst_bones', w * 0.24, fNear(w * 0.24) + h * 0.1, h * 0.07, { grade: cold });
    figure(ctx, 'obst_bones', w * 0.66, fNear(w * 0.66) + h * 0.12, h * 0.06, { flip: true, grade: cold });
    figure(ctx, 'ic_att.grave', w * 0.82, fNear(w * 0.82) + h * 0.1, h * 0.3, { tint, grade: cold, sa: 0.4 });
    figure(ctx, 'rally_flag.fallen', w * 0.38, fNear(w * 0.38) + h * 0.08, h * 0.56, { tint, grade: cold, sa: 0.45, sw: 1.3 });
    for (let i = 0; i < 7; i++) bird(ctx, w * (0.2 + rnd() * 0.6), h * (0.1 + rnd() * 0.22), h * (0.014 + rnd() * 0.012), '#140c10', rnd());
    fog(ctx, w, h * 0.96, h * 0.1, '#6a3a40', 0.35);
    vignette(ctx, w, h, 0.55, '#0a0610');
  }

  /* ---------- главное меню: живая сцена с параллаксом ----------
     Слои рисуются один раз и дальше только сдвигаются трансформом (это делает видеокарта):
     небо стоит, облака плывут, горы, замок, ближний холм и рамка из листвы смещаются тем сильнее,
     чем ближе. Всадник шагает по холму, над долиной пролетает крылатое существо фракции —
     эти два маленьких холста перерисовываются 30 раз в секунду. Наклон телефона и касание
     сдвигают камеру; без них она сама медленно «дышит». */
  function menu(host, o) {
    o = o || {};
    const q = /[?&]mood=(\w+)/.exec(root.location ? location.search : '');
    const M = MOOD[q && MOOD[q[1]] ? q[1] : o.mood] || MOOD.day, fid = o.faction || 'castle', Ld = landOf(fid);
    const dpr = DPR(), W0 = Math.max(200, host.clientWidth || 390), H0 = Math.max(120, host.clientHeight || 270);
    const ox = Math.round(W0 * 0.05), oy = Math.round(H0 * 0.04), LW = W0 + ox * 2, LH = H0 + oy * 2;
    const w = Math.round(LW * dpr), h = Math.round(LH * dpr), s = h / 300;
    const rnd = rngOf(hashStr('menu:' + fid + ':' + W0 + 'x' + H0));
    const layers = [];
    let dead = false, raf = 0;
    const layer = (d, cls) => {
      const el = document.createElement('div'); el.className = 'mp-l' + (cls ? ' ' + cls : '');
      el.style.cssText = 'left:' + -ox + 'px;top:' + -oy + 'px;width:' + LW + 'px;height:' + LH + 'px';
      host.appendChild(el); const L = { el, d }; layers.push(L); return L;
    };
    const canvasIn = (el, cw, ch) => { const c = mk(cw * dpr, ch * dpr); c.style.width = cw + 'px'; c.style.height = ch + 'px'; el.appendChild(c); return c; };
    // небо — сразу, в том же кадре, что и меню: остальное дорисуется следующими
    const sky = mk(w, h); sky.id = 'menuArt'; sky.className = 'mp-sky';
    sky.style.cssText = 'left:' + -ox + 'px;top:' + -oy + 'px;width:' + LW + 'px;height:' + LH + 'px';
    paintSky(sky.getContext('2d'), w, h, M, rnd, h * 0.62);
    host.appendChild(sky);
    let clouds = null, rider = null, flyer = null, fNear = null;
    const steps = [
      () => {   // облака: полоса вдвое шире слоя, повтор с периодом в ширину — плывут без шва
        const L = layer(0.08, 'mp-clouds'), c = canvasIn(L.el, LW * 2, LH), x = c.getContext('2d');
        const band = mk(w, h), bx = band.getContext('2d');
        paintClouds(bx, w, h, M, rnd, { n: 6, x0: 0, x1: w, wMin: 0.16, wMax: 0.3, yMin: 0.12, yMax: 0.42, alpha: 0.9, wrap: w });
        for (let i = 0; i < 5; i++) bird(bx, w * (0.3 + i * 0.03 + rnd() * 0.02), h * (0.22 + rnd() * 0.05), h * 0.012, rgba(M.shade, 0.7), rnd());
        x.drawImage(band, 0, 0); x.drawImage(band, w, 0);
        clouds = { el: c, speed: LW / 150 };   // слой за 150 с
      },
      () => {
        const L = layer(0.18), c = canvasIn(L.el, LW, LH), x = c.getContext('2d');
        paintRange(x, w, h, M, rnd, { base: h * 0.58, hMin: h * 0.12, hMax: h * 0.3, n: 6, snow: Ld === LAND.sand ? 0.08 : 0.3, hazeA: 0.55, peakAt: [[0.8, 1]] });
        paintRange(x, w, h, M, rnd, { base: h * 0.63, hMin: h * 0.05, hMax: h * 0.13, n: 9, snow: 0, c: mix(Ld.far, M.far, 0.5), hazeA: 0.4 });
      },
      () => {   // крылатый над долиной — между горами и замком
        const name = (FLYERS[fid] || FLYERS.castle).find(n => V._defs[n] || (H3.Sprites && H3.Sprites.has(n)));
        if (!name) return;
        const L = layer(0.3), fh = LH * 0.17, fw = fh * 1.7, c = canvasIn(L.el, fw, fh * 1.4);
        c.className = 'mp-actor';
        flyer = { el: c, name, fw, fh, x: 0, dir: -1, t0: performance.now(), ctx: c.getContext('2d') };
      },
      () => {
        const L = layer(0.42), c = canvasIn(L.el, LW, LH), x = c.getContext('2d');
        const cx = w * 0.64;
        const fMid = paintHill(x, w, h, rnd, { y: h * 0.67, amp: h * 0.025, c0: mix(Ld.mid, M.haze, 0.2), c1: mix(Ld.mid, M.shade, 0.25), lit: Ld.lit, dark: Ld.dark, rim: M.light, tex: 260, s, bumps: [[cx, h * 0.05, w * 0.13]] });
        paintTrees(x, Ld.trees, fMid, rnd, { n: 10, x0: 0, x1: w, depth: h * 0.03, hMin: h * 0.06, hMax: h * 0.11, skip: [[cx - w * 0.17, cx + w * 0.17]], grade: { lit: rgba(M.light, 0.1), shade: rgba(M.haze, 0.25) } });
        figure(x, 'town_' + fid, cx, fMid(cx) + h * 0.012, h * 0.4, { sa: 0.35, grade: warmGrade(M, M.sun && M.sun[0] > 0.5) });
        paintTrees(x, Ld.trees, fMid, rnd, { n: 3, x0: cx - w * 0.2, x1: cx + w * 0.2, depth: h * 0.07, hMin: h * 0.05, hMax: h * 0.08, skip: [[cx - w * 0.12, cx + w * 0.12]] });
        x.globalCompositeOperation = 'source-atop';
        const g = x.createLinearGradient(0, h * 0.5, 0, h * 0.75); g.addColorStop(0, rgba(M.haze, 0.22)); g.addColorStop(1, rgba(M.haze, 0.03)); x.fillStyle = g; x.fillRect(0, 0, w, h);
      },
      () => {
        const L = layer(0.75), c = canvasIn(L.el, LW, LH), x = c.getContext('2d');
        fNear = paintHill(x, w, h, rnd, { y: h * 0.78, amp: h * 0.02, tilt: h * 0.06, c0: mix(Ld.near, M.light, 0.1), c1: mix(Ld.near, M.shade, 0.5), lit: Ld.lit, dark: Ld.dark, rim: M.light, tex: 520, s: s * 1.5, shade: 0.3, bumps: [[w * 0.26, h * 0.05, w * 0.22]] });
        // тропа по гребню
        x.save(); x.clip(fNear.path);
        const path = new Path2D(); for (let X = -10; X <= w + 10; X += w / 60) { const y = fNear(X) + h * 0.03 + Math.sin(X / w * 5) * h * 0.006; X < 0 ? path.moveTo(X, y) : path.lineTo(X, y); }
        x.strokeStyle = rgba(Ld.path, 0.55); x.lineWidth = h * 0.022; x.lineCap = 'round'; x.stroke(path);
        x.strokeStyle = rgba(M.light, 0.2); x.lineWidth = h * 0.006; x.stroke(path);
        if (Ld.flowers) for (let i = 0; i < 70; i++) { const X = rnd() * w, Y = fNear(X) + h * (0.05 + rnd() * 0.2); x.fillStyle = Ld.flowers[Math.floor(rnd() * Ld.flowers.length)]; x.beginPath(); x.arc(X, Y, h * (0.003 + rnd() * 0.003), 0, Math.PI * 2); x.fill(); }
        x.restore();
        figure(x, Ld.trees[0], w * 0.88, fNear(w * 0.88) + h * 0.08, h * 0.26, { flip: true, sa: 0.35 });
        const rh = LH * 0.22, rw = rh * 1.7, rc = canvasIn(L.el, rw, rh * 1.25); rc.className = 'mp-actor';
        const road = X => (fNear(X * dpr) + h * 0.03) / dpr;
        rider = { el: rc, ctx: rc.getContext('2d'), name: heroOf(fid, o.heroCls), rh, rw, x: LW * 0.2, a: LW * 0.12, b: LW * 0.42, dir: 1, wait: 0, road, tint: tintOf(o.color) };
      },
      () => {   // рамка: крона тёмного дерева в левом верхнем углу
        const L = layer(1.1), c = canvasIn(L.el, LW, LH), x = c.getContext('2d');
        figure(x, Ld === LAND.sand ? 'tree_palm' : Ld === LAND.snow ? 'tree_snow' : Ld.trees.includes('tree_1') ? 'tree_1' : Ld.trees[0], -w * 0.01, h * 1.02, h * 0.98,
          { shadow: false, grade: { lit: rgba(M.light, 0.08), shade: rgba(M.shade, 0.35), dark: rgba(M.shade, 0.25) } });
      },
    ];
    // лёгкая раскачка камеры: наклон, палец, мышь; без них — медленное «дыхание»
    const inp = { on: false, x: 0, y: 0, t: 0 }, cur = { x: 0, y: 0 };
    let base = null, asked = false;
    const onTilt = e => {
      if (e.gamma === null || e.gamma === undefined) return;
      if (!base) base = { g: e.gamma, b: e.beta };
      base.g += (e.gamma - base.g) * 0.004; base.b += (e.beta - base.b) * 0.004;   // держишь наклон — сцена плавно возвращается
      inp.x = clamp((e.gamma - base.g) / 16, -1, 1); inp.y = clamp((e.beta - base.b) / 16, -1, 1); inp.on = true; inp.t = performance.now();
    };
    const onPoint = e => {
      if (e.type === 'pointermove' && e.pointerType !== 'mouse' && !e.buttons) return;
      const r = host.getBoundingClientRect();
      inp.x = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); inp.y = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1); inp.on = true; inp.t = performance.now();
    };
    const onDown = e => {
      onPoint(e);
      // iPhone отдаёт наклон только с разрешения, и спросить можно лишь по касанию: касание картины — и спрашиваем
      const DOE = root.DeviceOrientationEvent;
      if (!asked && DOE && typeof DOE.requestPermission === 'function') { asked = true; DOE.requestPermission().then(r => { if (r === 'granted') root.addEventListener('deviceorientation', onTilt); }).catch(() => {}); }
    };
    const scr = host.parentElement || host;
    scr.addEventListener('pointermove', onPoint);
    host.addEventListener('pointerdown', onDown);
    const DOE = root.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission !== 'function') root.addEventListener('deviceorientation', onTilt);

    let last = 0, lastDraw = 0;
    function drawRider(ts, dt) {
      const R = rider, A = H3.Anim; if (!R) return;
      if (R.wait > 0) R.wait -= dt; else {
        R.x += R.dir * dt / 1000 * LW * 0.022;
        if (R.x > R.b || R.x < R.a) { R.x = clamp(R.x, R.a, R.b); R.wait = 3500; R.dir = -R.dir; }
      }
      const moving = R.wait <= 0, flip = R.dir < 0 ? !(R.wait > 0) : R.wait > 0;   // на остановке смотрит туда, откуда пришёл — «оглядывает долину»
      const X = R.x, Y = R.road(X), cw = R.el.width, ch = R.el.height, c = R.ctx;
      R.el.style.transform = 'translate3d(' + (X - R.rw / 2).toFixed(1) + 'px,' + (Y - R.rh * 1.25 + R.rh * 0.06).toFixed(1) + 'px,0)';
      c.clearRect(0, 0, cw, ch);
      const sc = R.rh * dpr / Math.max(1, cellsH(R.name));
      if (A) A.draw(c, R.name, cw / 2, ch - R.rh * 0.06 * dpr, sc, flip, { t: ts, moving, key: 'menuRider', phase: 0.7 }, R.tint);
      else if (H3.Sprites) H3.Sprites.draw(c, R.name, cw / 2, ch - R.rh * 0.06 * dpr, sc, flip, R.tint);
    }
    function drawFlyer(ts) {
      const F = flyer, A = H3.Anim; if (!F) return;
      const period = 42000, t = ((ts - F.t0) % period) / period, pass = Math.floor((ts - F.t0) / period) % 2;
      const dir = pass ? 1 : -1, span = LW + F.fw * 2;
      const X = dir > 0 ? -F.fw + t * span : LW + F.fw - t * span, Y = LH * 0.2 + Math.sin(ts / 2300) * LH * 0.03 + t * LH * 0.05;
      F.el.style.transform = 'translate3d(' + (X - F.fw / 2).toFixed(1) + 'px,' + (Y - F.fh).toFixed(1) + 'px,0)';
      const c = F.ctx, cw = F.el.width, ch = F.el.height; c.clearRect(0, 0, cw, ch);
      const sc = F.fh * dpr / Math.max(1, cellsH(F.name));
      if (A) A.draw(c, F.name, cw / 2, ch * 0.92, sc, dir < 0, { t: ts, flying: true, moving: true, key: 'menuFlyer' });
    }
    function frame(ts) {
      if (dead) return;
      raf = requestAnimationFrame(frame);
      if (!host.isConnected) { destroy(); return; }
      if (document.visibilityState === 'hidden' || (o.active && !o.active())) { last = ts; return; }
      const dt = Math.min(100, ts - (last || ts)); last = ts;
      if (inp.on && ts - inp.t > 2500) inp.on = false;
      const tx = inp.on ? inp.x : Math.sin(ts / 9000) * 0.45, ty = inp.on ? inp.y : Math.sin(ts / 13000) * 0.25;
      const k = 1 - Math.pow(0.94, dt / 16.7);
      cur.x += (tx - cur.x) * k; cur.y += (ty - cur.y) * k;
      for (const L of layers) L.el.style.transform = 'translate3d(' + (-cur.x * L.d * ox).toFixed(2) + 'px,' + (-cur.y * L.d * oy).toFixed(2) + 'px,0)';
      if (clouds) clouds.el.style.transform = 'translate3d(' + (-((ts * clouds.speed / 1000) % LW)).toFixed(1) + 'px,0,0)';
      if (ts - lastDraw >= 32) { const d = lastDraw ? Math.min(100, ts - lastDraw) : 16; lastDraw = ts; drawRider(ts, d); drawFlyer(ts); }
    }
    function destroy() {
      dead = true; cancelAnimationFrame(raf);
      scr.removeEventListener('pointermove', onPoint); host.removeEventListener('pointerdown', onDown);
      root.removeEventListener('deviceorientation', onTilt);
    }
    // остальное — по шагу за кадр: первый кадр меню не ждёт картины
    let si = 0;
    const next = () => {
      if (dead) return;
      const t0 = performance.now();
      while (si < steps.length) { try { steps[si++](); } catch (e) { console.error(e); } if (performance.now() - t0 > 24) break; }
      host.querySelectorAll('.mp-l:not(.in)').forEach(el => el.classList.add('in'));
      if (si < steps.length) requestAnimationFrame(() => setTimeout(next, 0)); else host.dataset.ready = '1';
    };
    requestAnimationFrame(() => setTimeout(next, 0));
    raf = requestAnimationFrame(frame);
    return { destroy, draw: () => {} };
  }
  function cellsH(name) {
    const d = V._defs[name]; if (d && V.VEC.on) return (d.anchor[1] + d.oy) / 10;
    const Sp = H3.Sprites, one = Sp && Sp.render(name, 1); return one ? one._anchor[1] : 30;
  }

  H3.Scenes = { week, finale, menu, weekName, genitive, MOOD, LAND };
})(typeof window !== 'undefined' ? window : globalThis);
