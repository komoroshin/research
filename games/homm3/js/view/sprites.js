/* ============================================================================
   view/sprites.js — пиксель-спрайты: строки символов × палитра.

   Спрайт:  { rows: ['..kk..', ...], pal: {k:'#000'}, anchor:[x,y] }
            '.' — прозрачный. pal — переопределения глобальной палитры.
   Вариант: { base:'pikeman', tint:{b:'r', B:'R'}, pal:{}, extra:[[x,y,'ch'],...] }
            tint — замена символов, extra — дорисовка отдельных пикселей.
   extraTint при рендере: {'r':'b'} — замена символа, {'r':'#ff0000'} — прямой цвет.
   Рендер кэшируется по ключу (имя, масштаб, зеркало, доп. tint).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  const PAL = {
    k: '#0d0a08', w: '#ffffff', l: '#c9c9cc', e: '#8b8d94', E: '#4b4d54',
    s: '#f0c8a0', S: '#c48c62', r: '#c8332a', R: '#7a1a14', o: '#e8792b',
    y: '#f2d34c', Y: '#a67c1c', g: '#5cb84a', G: '#2d6b2a', b: '#4d7fe0',
    B: '#243f8c', c: '#7fd9ea', p: '#9a58c8', P: '#4e2a72', n: '#9a6a3c',
    N: '#5a3a1c', t: '#d8b98a', i: '#efe7cf', m: '#ee7fb0', d: '#6f5a3e',
    a: '#c04fd0', q: '#1a7f6e', z: '#101828', f: '#ffb03a', F: '#ff5a1f',
    h: '#bfe36b', x: '#6a1d7a', u: '#3b3b44', v: '#8fd4c8', j: '#5a8a2a',
    D: '#2a1a10', L: '#e8e8ea', O: '#a04a12', C: '#3a9ab8', M: '#b03070',
    T: '#b89a6a', I: '#c9c0a0', A: '#e6a0ff', H: '#7fa838', Q: '#0f4f45',
  };

  const registry = Object.create(null);
  const cache = new Map();

  function define(name, def) { registry[name] = def; return def; }
  function defineMany(obj) { for (const k in obj) define(k, obj[k]); }
  function has(name) { return !!registry[name]; }
  function names() { return Object.keys(registry); }

  function resolve(name, depth) {
    const def = registry[name];
    if (!def) return null;
    if (def.rows) return def;
    if (def.base) {
      const b = resolve(def.base, (depth || 0) + 1);
      if (!b || (depth || 0) > 8) return null;
      const pal = Object.assign({}, b.pal || {}, def.pal || {});
      const tint = def.tint || {};
      let rows = b.rows.map(row => row.replace(/./g, ch => (tint[ch] !== undefined ? tint[ch] : ch)));
      if (def.extra) {
        rows = rows.map(r => r.split(''));
        for (const [x, y, ch] of def.extra) if (rows[y] && x < rows[y].length) rows[y][x] = ch;
        rows = rows.map(r => r.join(''));
      }
      return { rows, pal, anchor: def.anchor || b.anchor };
    }
    return null;
  }

  function colorOf(ch, pal) {
    if (ch === '.' || ch === ' ') return null;
    if (pal && pal[ch]) return pal[ch];
    return PAL[ch] || '#ff00ff';
  }

  /* ---------- детализация 2× ----------
     Спрайты нарисованы на сетке 20–32 px. «Вдвое детальнее» — не перерисовка 400 спрайтов, а конвейер,
     который из той же сетки строит основу вдвое крупнее: EPX сглаживает лестницы диагоналей, чёрный
     контур становится тонким снаружи и тёмным оттенком материала внутри, свет сверху-слева даёт объём,
     лёгкий градиент сверху вниз — вес. Все масштабы рисуются с этой 2×-основы. Иконки интерфейса
     (ic_*) не трогаем: пиктограмме важна не мягкость, а знак. */
  const DETAIL = { on: true, bevel: 0.24, side: 0.1, grad: 0.06, inner: 0.42, skip: /^ic_/ };
  function setDetail(v) { DETAIL.on = !!v; cache.clear(); urlCache.clear(); hiCache.clear(); }
  const hiCache = new Map();
  const NONE = -1;
  function parseColor(col) { const n = parseInt(col.slice(1), 16); return col.length === 4 ? ((n >> 8 & 15) * 17 << 16) | ((n >> 4 & 15) * 17 << 8) | ((n & 15) * 17) : n; }
  function lum(c) { return ((c >> 16 & 255) * 0.299 + (c >> 8 & 255) * 0.587 + (c & 255) * 0.114) / 255; }
  function mix(c, k) { // k>0 — к белому, k<0 — к чёрному
    let r = c >> 16 & 255, g = c >> 8 & 255, b = c & 255;
    if (k > 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
    return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
  }
  /** Сетка цветов спрайта (int RGB или NONE) с учётом зеркала и подмены цветов. */
  function colorGrid(sp, flip, extraTint) {
    const h = sp.rows.length, w = Math.max(...sp.rows.map(r => r.length));
    const g = new Int32Array(w * h).fill(NONE);
    for (let y = 0; y < h; y++) {
      const row = sp.rows[y];
      for (let x = 0; x < row.length; x++) {
        let ch = row[x], col;
        if (extraTint && extraTint[ch] !== undefined) { const t = extraTint[ch]; if (t[0] === '#') col = t; else { ch = t; col = colorOf(ch, sp.pal); } }
        else col = colorOf(ch, sp.pal);
        if (!col) continue;
        g[y * w + (flip ? w - 1 - x : x)] = parseColor(col);
      }
    }
    return { w, h, g };
  }
  /** 2×-основа: EPX → маска краёв → бевел и градиент → тонкий контур. Возвращает canvas 2w×2h. */
  function refine(src) {
    const { w, h, g } = src, W = w * 2, H = h * 2;
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? NONE : g[y * w + x];
    const dark = c => c !== NONE && lum(c) < 0.16;
    // контур-линия в исходнике: тёмный пиксель, у которого есть тёмный сосед (одиночная точка — глаз, не контур)
    const line = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = at(x, y); if (dark(c) && (dark(at(x - 1, y)) || dark(at(x + 1, y)) || dark(at(x, y - 1)) || dark(at(x, y + 1)))) line[y * w + x] = 1; }
    const hi = new Int32Array(W * H);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      const i = (y * 2) * W + x * 2;
      hi[i] = (C === A && C !== D && A !== B) ? A : P;
      hi[i + 1] = (A === B && A !== C && B !== D) ? B : P;
      hi[i + W] = (D === C && D !== B && C !== A) ? C : P;
      hi[i + W + 1] = (B === D && B !== A && D !== C) ? B : P;
    }
    const hat = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? NONE : hi[y * W + x];
    const edge = new Uint8Array(W * H); // прозрачное или контур — то, от чего «отражается» свет
    for (let i = 0; i < W * H; i++) edge[i] = hi[i] === NONE || dark(hi[i]) ? 1 : 0;
    // расстояние до края формы в четырёх направлениях (край — прозрачное, контур или смена цвета):
    // полоса света/тени шириной в полтора исходных пикселя, а не одна линия
    const CAP = 4, du = new Uint8Array(W * H), dl = new Uint8Array(W * H), dd = new Uint8Array(W * H), dr = new Uint8Array(W * H);
    const brk = (i, j) => edge[j] || hi[j] !== hi[i]; // между i и соседом j проходит край
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (edge[i]) continue; du[i] = y === 0 || brk(i, i - W) ? 1 : Math.min(CAP, du[i - W] + 1); dl[i] = x === 0 || brk(i, i - 1) ? 1 : Math.min(CAP, dl[i - 1] + 1); }
    for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const i = y * W + x; if (edge[i]) continue; dd[i] = y === H - 1 || brk(i, i + W) ? 1 : Math.min(CAP, dd[i + W] + 1); dr[i] = x === W - 1 || brk(i, i + 1) ? 1 : Math.min(CAP, dr[i + 1] + 1); }
    const fall = d => d >= CAP ? 0 : [0, 1, 0.5, 0.22][d];
    const out = new Int32Array(hi);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, c = hi[i];
      if (c === NONE) continue;
      if (edge[i]) {
        // контурная линия: внутренняя половина (не касается прозрачного) — тёмный оттенок соседнего материала
        if (line[(y >> 1) * w + (x >> 1)]) {
          const touchesAir = hat(x, y - 1) === NONE || hat(x, y + 1) === NONE || hat(x - 1, y) === NONE || hat(x + 1, y) === NONE;
          if (!touchesAir) {
            const nb = [hat(x, y - 1), hat(x - 1, y), hat(x + 1, y), hat(x, y + 1)].find(v => v !== NONE && !dark(v));
            if (nb !== undefined) out[i] = mix(nb, -DETAIL.inner - 0.2);
          }
        }
        continue;
      }
      let k = DETAIL.bevel * (fall(du[i]) - fall(dd[i])) + DETAIL.side * (fall(dl[i]) - fall(dr[i]));
      k += DETAIL.grad * (1 - 2 * y / H);
      out[i] = k ? mix(c, Math.max(-0.6, Math.min(0.6, k))) : c;
    }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
    for (let i = 0; i < W * H; i++) { const c = out[i]; if (c === NONE) continue; d[i * 4] = c >> 16 & 255; d[i * 4 + 1] = c >> 8 & 255; d[i * 4 + 2] = c & 255; d[i * 4 + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    return cv;
  }
  function hiRes(name, sp, flip, extraTint) {
    const key = name + '|' + (flip ? 1 : 0) + '|' + (extraTint ? JSON.stringify(extraTint) : '');
    let cv = hiCache.get(key);
    if (!cv) { cv = refine(colorGrid(sp, flip, extraTint)); hiCache.set(key, cv); }
    return cv;
  }

  function render(name, scale, flip, extraTint) {
    scale = scale || 1;
    const key = name + '|' + scale + '|' + (flip ? 1 : 0) + '|' + (extraTint ? JSON.stringify(extraTint) : '');
    let cv = cache.get(key);
    if (cv) return cv;
    const sp = resolve(name);
    if (!sp) return null;
    const h = sp.rows.length, w = Math.max(...sp.rows.map(r => r.length));
    cv = document.createElement('canvas');
    cv.width = Math.max(1, w * scale); cv.height = Math.max(1, h * scale);
    const ctx = cv.getContext('2d');
    if (DETAIL.on && !DETAIL.skip.test(name)) {
      const hi = hiRes(name, sp, flip, extraTint);
      ctx.imageSmoothingEnabled = scale < 2; // уменьшение — усредняем, увеличение — резкие пиксели
      ctx.drawImage(hi, 0, 0, hi.width, hi.height, 0, 0, cv.width, cv.height);
    } else {
      for (let y = 0; y < h; y++) {
        const row = sp.rows[y];
        for (let x = 0; x < row.length; x++) {
          let ch = row[x], col;
          if (extraTint && extraTint[ch] !== undefined) {
            const t = extraTint[ch];
            if (t[0] === '#') col = t; else { ch = t; col = colorOf(ch, sp.pal); }
          } else col = colorOf(ch, sp.pal);
          if (!col) continue;
          ctx.fillStyle = col;
          ctx.fillRect((flip ? (w - 1 - x) : x) * scale, y * scale, scale, scale);
        }
      }
    }
    cv._w = w; cv._h = h; cv._anchor = sp.anchor || [w / 2, h];
    cache.set(key, cv);
    return cv;
  }

  /**
   * Что рисовать для масштаба scale: { cv, k } — canvas и множитель его пикселей (drawn = cv.width * k).
   * При включённой детализации мелкие масштабы (<2) берут 2×-основу и уменьшают её уже на целевом контексте:
   * на телефоне карта рисуется с масштабом z·dpr ≈ 2–3, и половинки пикселей основы там видны.
   */
  function image(name, scale, flip, extraTint) {
    scale = scale || 1;
    if (DETAIL.on && scale < 2 && !DETAIL.skip.test(name)) { const cv = render(name, 2, flip, extraTint); return cv ? { cv, k: scale / 2 } : null; }
    const cv = render(name, scale, flip, extraTint); return cv ? { cv, k: 1 } : null;
  }
  /** Сглаживание при рисовании основы: уменьшение на экране — усреднять, увеличение — резко. */
  function smoothFor(ctx, k) { if (k === 1) return null; const prev = ctx.imageSmoothingEnabled; const m = ctx.getTransform(); ctx.imageSmoothingEnabled = k * Math.max(Math.abs(m.a), Math.abs(m.d)) < 1; return prev; }
  /** Рисует так, чтобы якорь (по умолчанию низ-центр) оказался в (x, y). */
  function draw(ctx, name, x, y, scale, flip, extraTint) {
    const im = image(name, scale, flip, extraTint);
    if (!im) { placeholder(ctx, name, x, y, scale || 1); return; }
    const cv = im.cv, ax = cv._anchor[0] * (scale || 1), ay = cv._anchor[1] * (scale || 1);
    if (im.k === 1) { ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay)); return; }
    const prev = smoothFor(ctx, im.k);
    ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay), cv.width * im.k, cv.height * im.k);
    ctx.imageSmoothingEnabled = prev;
  }
  function placeholder(ctx, name, x, y, scale) {
    const s = 12 * scale;
    ctx.fillStyle = '#c04fd0'; ctx.fillRect(Math.round(x - s / 2), Math.round(y - s), s, s);
    ctx.fillStyle = '#000'; ctx.font = (5 * scale) + 'px monospace';
    ctx.fillText(String(name).slice(0, 4), Math.round(x - s / 2) + 1, Math.round(y - s / 2) + 2);
  }
  /** Вписать в прямоугольник (иконки в UI). */
  function drawFit(ctx, name, x, y, w, h, flip) {
    const cv = render(name, 1, flip);
    if (!cv) { placeholder(ctx, name, x + w / 2, y + h, 1); return; }
    const s = Math.max(1, Math.floor(Math.min(w / cv._w, h / cv._h)));
    const dw = cv._w * s, dh = cv._h * s;
    const prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cv, Math.round(x + (w - dw) / 2), Math.round(y + (h - dh) / 2), dw, dh);
    ctx.imageSmoothingEnabled = prev;
  }
  const urlCache = new Map();
  /** dataURL для <img> в DOM. */
  function url(name, scale, flip) {
    const key = name + '|' + (scale || 2) + '|' + (flip ? 1 : 0);
    let u = urlCache.get(key);
    if (u) return u;
    const cv = render(name, scale || 2, flip);
    if (!cv) {
      const c = document.createElement('canvas'); c.width = c.height = 16 * (scale || 2);
      placeholder(c.getContext('2d'), name, c.width / 2, c.height, scale || 2);
      u = c.toDataURL();
    } else u = cv.toDataURL();
    urlCache.set(key, u);
    return u;
  }
  function img(name, scale, cls) { return '<img class="px ' + (cls || '') + '" src="' + url(name, scale) + '" alt="">'; }

  H3.Sprites = { PAL, define, defineMany, has, names, resolve, render, image, smoothFor, draw, drawFit, url, img, setDetail, DETAIL, _registry: registry };
})(typeof window !== 'undefined' ? window : globalThis);
