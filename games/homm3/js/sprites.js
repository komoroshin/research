/* ============================================================================
   sprites.js — система процедурных пиксель-спрайтов.

   Формат спрайта:
     { rows: ['..kk..', ...],  // строки одинаковой длины; '.' = прозрачный
       pal:  { k:'#000', ... }, // необязательные переопределения палитры
       anchor: [x, y] }        // необязательная точка опоры (по умолчанию низ-центр)

   Глобальная палитра PAL — буквы для частых цветов. Спрайт может переопределить
   любую букву в своём pal. Апгрейды существ описываются как { base:'pikeman',
   tint:{r:'Y', b:'c'} } — перекраска букв базового спрайта.

   Рендер кэшируется в offscreen-canvas по ключу (имя, масштаб, зеркало, tint).
   ========================================================================== */
(function () {
  'use strict';

  const PAL = {
    k: '#0d0a08', // контур
    w: '#ffffff',
    l: '#c9c9cc', // светло-серый
    e: '#8b8d94', // сталь
    E: '#4b4d54', // тёмная сталь
    s: '#f0c8a0', // кожа
    S: '#c48c62', // кожа тень
    r: '#c8332a', // красный
    R: '#7a1a14', // тёмно-красный
    o: '#e8792b', // оранжевый
    y: '#f2d34c', // жёлтый / золото
    Y: '#a67c1c', // тёмное золото
    g: '#5cb84a', // зелёный
    G: '#2d6b2a', // тёмно-зелёный
    b: '#4d7fe0', // синий
    B: '#243f8c', // тёмно-синий
    c: '#7fd9ea', // голубой / лёд
    p: '#9a58c8', // фиолетовый
    P: '#4e2a72', // тёмно-фиолетовый
    n: '#9a6a3c', // коричневый
    N: '#5a3a1c', // тёмно-коричневый
    t: '#d8b98a', // песок / тан
    i: '#efe7cf', // кость / слоновая кость
    m: '#ee7fb0', // розовый
    d: '#6f5a3e', // земля
    a: '#c04fd0', // магия / аура
    q: '#1a7f6e', // бирюзовый тёмный
    z: '#101828', // почти чёрный синий
    f: '#ffb03a', // огонь светлый
    F: '#ff5a1f', // огонь тёмный
    h: '#bfe36b', // ядовито-зелёный светлый
    x: '#6a1d7a', // некро-фиолет
  };

  const registry = Object.create(null); // имя -> определение
  const cache = new Map();

  function define(name, def) { registry[name] = def; return def; }
  function defineMany(obj) { for (const k in obj) define(k, obj[k]); }
  function get(name) { return registry[name]; }
  function has(name) { return !!registry[name]; }
  function names() { return Object.keys(registry); }

  /** Разворачивает base/tint в плоский спрайт {rows,pal} */
  function resolve(name, depth) {
    const def = registry[name];
    if (!def) return null;
    if (def.rows) return def;
    if (def.base) {
      const b = resolve(def.base, (depth || 0) + 1);
      if (!b || (depth || 0) > 8) return null;
      const pal = Object.assign({}, b.pal || {}, def.pal || {});
      const tint = def.tint || {};
      const rows = b.rows.map(row => row.replace(/./g, ch => (tint[ch] !== undefined ? tint[ch] : ch)));
      return { rows, pal, anchor: def.anchor || b.anchor };
    }
    return null;
  }

  function colorOf(ch, pal) {
    if (ch === '.' || ch === ' ') return null;
    if (pal && pal[ch]) return pal[ch];
    return PAL[ch] || '#ff00ff';
  }

  /** Рисует спрайт в новый canvas. flip — зеркалить по горизонтали. */
  function render(name, scale, flip, extraTint) {
    scale = scale || 1;
    const key = name + '|' + scale + '|' + (flip ? 1 : 0) + '|' + (extraTint ? JSON.stringify(extraTint) : '');
    let cv = cache.get(key);
    if (cv) return cv;
    const sp = resolve(name);
    if (!sp) return null;
    const h = sp.rows.length, w = Math.max(...sp.rows.map(r => r.length));
    cv = document.createElement('canvas');
    cv.width = w * scale; cv.height = h * scale;
    const ctx = cv.getContext('2d');
    for (let y = 0; y < h; y++) {
      const row = sp.rows[y];
      for (let x = 0; x < row.length; x++) {
        let ch = row[x];
        if (extraTint && extraTint[ch] !== undefined) ch = extraTint[ch];
        const col = colorOf(ch, sp.pal);
        if (!col) continue;
        ctx.fillStyle = col;
        const px = flip ? (w - 1 - x) : x;
        ctx.fillRect(px * scale, y * scale, scale, scale);
      }
    }
    cv._w = w; cv._h = h;
    cv._anchor = sp.anchor || [w / 2, h];
    cache.set(key, cv);
    return cv;
  }

  /** Рисует спрайт так, чтобы его якорь (низ-центр) оказался в (x,y). */
  function draw(ctx, name, x, y, scale, flip, extraTint) {
    const cv = render(name, scale, flip, extraTint);
    if (!cv) { // заглушка — розовый квадрат
      ctx.fillStyle = '#f0f';
      ctx.fillRect(x - 6, y - 12, 12, 12);
      return;
    }
    const ax = cv._anchor[0] * scale, ay = cv._anchor[1] * scale;
    ctx.drawImage(cv, Math.round(x - ax), Math.round(y - ay));
  }

  /** Рисует спрайт, вписанный в прямоугольник (для UI-иконок). */
  function drawFit(ctx, name, x, y, w, h, flip) {
    const cv = render(name, 1, flip);
    if (!cv) return;
    const s = Math.min(w / cv._w, h / cv._h);
    const dw = cv._w * s, dh = cv._h * s;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cv, Math.round(x + (w - dw) / 2), Math.round(y + (h - dh) / 2), Math.round(dw), Math.round(dh));
  }

  /** dataURL для <img> в DOM-интерфейсе. */
  function url(name, scale, flip) {
    const cv = render(name, scale || 2, flip);
    return cv ? cv.toDataURL() : '';
  }

  window.Sprites = { PAL, define, defineMany, get, has, names, resolve, render, draw, drawFit, url, _registry: registry };
})();
