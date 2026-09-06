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
    cv._w = w; cv._h = h; cv._anchor = sp.anchor || [w / 2, h];
    cache.set(key, cv);
    return cv;
  }

  /** Рисует так, чтобы якорь (по умолчанию низ-центр) оказался в (x, y). */
  function draw(ctx, name, x, y, scale, flip, extraTint) {
    const cv = render(name, scale, flip, extraTint);
    if (!cv) { placeholder(ctx, name, x, y, scale || 1); return; }
    const ax = cv._anchor[0] * (scale || 1), ay = cv._anchor[1] * (scale || 1);
    ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay));
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

  H3.Sprites = { PAL, define, defineMany, has, names, resolve, render, draw, drawFit, url, img, _registry: registry };
})(typeof window !== 'undefined' ? window : globalThis);
