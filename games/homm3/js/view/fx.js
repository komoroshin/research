/* ============================================================================
   view/fx.js — процедурные спецэффекты: частицы, молнии, кольца, снаряды,
   вспышки и тряска. Ассетов нет — всё рисуется примитивами канвы, поэтому
   любой эффект — это несколько строк параметров.

   Экран (бой или карта) заводит свою сцену: const fx = H3.Fx.scene();
   fx.update(dt) — раз в кадр; fx.drawUnder(ctx) — до спрайтов (кольца на
   земле, вспышки гексов), fx.drawOver(ctx) — после (искры, дым, молнии);
   fx.shake() — смещение камеры для тряски; fx.busy() — есть ли что играть.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function scene() {
    const S = { p: [], bolts: [], rings: [], flashes: [], missiles: [], shakeT: 0, shakeAmp: 0, time: 0 };

    /* ---------- частицы ---------- */
    // p: { x, y, vx, vy, ax, ay, ttl, life, size, color, shape, under, spin, drag, shrink }
    function add(o) { o.life = 0; S.p.push(o); return o; }
    /** Разлёт из точки: искры, кровь, осколки. */
    function burst(x, y, o) {
      o = o || {};
      const n = o.n || 12, sp = o.speed || 90, a0 = o.angle === undefined ? 0 : o.angle, spread = o.spread === undefined ? Math.PI * 2 : o.spread;
      for (let i = 0; i < n; i++) {
        const a = a0 + rnd(-spread / 2, spread / 2), v = sp * rnd(0.35, 1);
        add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (o.lift || 0), ax: 0, ay: o.grav === undefined ? 220 : o.grav, ttl: (o.ttl || 500) * rnd(0.6, 1.2),
          size: (o.size || 2) * rnd(0.7, 1.3), color: Array.isArray(o.color) ? pick(o.color) : (o.color || '#fff'), shape: o.shape || 'dot', under: !!o.under, drag: o.drag || 0, shrink: o.shrink !== false, glow: o.glow });
      }
    }
    /** Восходящие искорки в прямоугольнике (бафы, лечение). */
    function rise(x, y, w, h, o) {
      o = o || {};
      for (let i = 0; i < (o.n || 14); i++) add({ x: x + rnd(-w / 2, w / 2), y: y + rnd(-h, 0), vx: rnd(-8, 8), vy: -rnd(20, 55), ax: 0, ay: 0, ttl: (o.ttl || 700) * rnd(0.7, 1.3), size: (o.size || 2) * rnd(0.7, 1.4), color: Array.isArray(o.color) ? pick(o.color) : o.color, shape: o.shape || 'spark', glow: true, shrink: true });
    }
    /** Падающие тёмные крупицы (дебафы). */
    function fall(x, y, w, h, o) {
      o = o || {};
      for (let i = 0; i < (o.n || 14); i++) add({ x: x + rnd(-w / 2, w / 2), y: y - h - rnd(0, 10), vx: rnd(-6, 6), vy: rnd(15, 40), ax: 0, ay: 40, ttl: (o.ttl || 700) * rnd(0.7, 1.3), size: (o.size || 2) * rnd(0.7, 1.3), color: Array.isArray(o.color) ? pick(o.color) : o.color, shape: 'dot', shrink: true });
    }
    /** Дым/туман: медленные растущие блины. */
    function puff(x, y, o) {
      o = o || {};
      for (let i = 0; i < (o.n || 6); i++) add({ x: x + rnd(-4, 4), y: y + rnd(-4, 4), vx: rnd(-10, 10) + (o.vx || 0), vy: -rnd(8, 22) + (o.vy || 0), ax: 0, ay: 0, ttl: (o.ttl || 900) * rnd(0.7, 1.3), size: (o.size || 6) * rnd(0.7, 1.3), color: Array.isArray(o.color) ? pick(o.color) : (o.color || 'rgba(60,60,60,0.5)'), shape: 'puff', grow: o.grow || 1.8, under: !!o.under });
    }
    /** Растворение спрайта: частицы берут цвета его пикселей. */
    function dissolve(cv, x, y, scale, flip, o) {
      o = o || {};
      if (!cv) return;
      let data;
      try { data = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; } catch (e) { return; }
      const w = cv.width, h = cv.height, n = Math.min(o.n || 140, w * h / 4);
      const ax = cv._anchor ? cv._anchor[0] * scale : w / 2, ay = cv._anchor ? cv._anchor[1] * scale : h;
      for (let i = 0; i < n; i++) {
        const px = Math.floor(Math.random() * w), py = Math.floor(Math.random() * h), k = (py * w + px) * 4;
        if (data[k + 3] < 40) { i--; if (--o._guard < -4000) break; continue; }
        const col = 'rgb(' + data[k] + ',' + data[k + 1] + ',' + data[k + 2] + ')';
        add({ x: x + (flip ? w - px : px) - ax, y: y + py - ay, vx: rnd(-14, 14), vy: -rnd(10, 45), ax: 0, ay: o.grav || -25, ttl: (o.ttl || 900) * rnd(0.6, 1.3), size: Math.max(1.5, scale), color: col, shape: 'square', shrink: true });
      }
    }

    /* ---------- молнии, кольца, вспышки ---------- */
    /** Ломаная молния с ветвями. */
    function bolt(x1, y1, x2, y2, o) {
      o = o || {};
      const pts = jag(x1, y1, x2, y2, o.jag || 14, o.depth || 4);
      const b = { pts, color: o.color || '#e8f6ff', glow: o.glow || 'rgba(120,200,255,0.55)', width: o.width || 2, ttl: o.ttl || 260, life: 0, branches: [] };
      const nb = o.branches === undefined ? 3 : o.branches;
      for (let i = 0; i < nb; i++) {
        const k = Math.floor(rnd(1, pts.length - 1)); const p = pts[k];
        const a = Math.atan2(y2 - y1, x2 - x1) + rnd(-1.2, 1.2), len = rnd(10, 30);
        b.branches.push(jag(p[0], p[1], p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len, 6, 2));
      }
      S.bolts.push(b);
      return b;
    }
    function jag(x1, y1, x2, y2, amp, depth) {
      let pts = [[x1, y1], [x2, y2]];
      for (let d = 0; d < depth; d++) {
        const out = [pts[0]];
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
          const nx = -(b[1] - a[1]), ny = b[0] - a[0]; const len = Math.hypot(nx, ny) || 1;
          const off = rnd(-amp, amp);
          out.push([mx + nx / len * off, my + ny / len * off], b);
        }
        pts = out; amp *= 0.55;
      }
      return pts;
    }
    /** Расширяющееся кольцо на земле или в воздухе. */
    function ring(x, y, o) { o = o || {}; S.rings.push({ x, y, r0: o.r0 || 4, r1: o.r1 || 40, color: o.color || '#fff', width: o.width || 3, ttl: o.ttl || 400, life: 0, under: o.under !== false, squash: o.squash === undefined ? 0.5 : o.squash, fill: o.fill }); }
    /** Вспышка на весь экран. */
    function flash(o) { o = o || {}; S.flashes.push({ color: o.color || '#fff', alpha: o.alpha === undefined ? 0.5 : o.alpha, ttl: o.ttl || 200, life: 0 }); }
    function shake(amp, ttl) { S.shakeAmp = Math.max(S.shakeAmp, amp || 4); S.shakeT = Math.max(S.shakeT, ttl || 220); S.shakeTtl = S.shakeT; }
    function shakeOffset() {
      if (S.shakeT <= 0) return [0, 0];
      const k = S.shakeT / (S.shakeTtl || 1);
      return [Math.sin(S.time / 9) * S.shakeAmp * k, Math.cos(S.time / 7) * S.shakeAmp * k * 0.7];
    }

    /* ---------- снаряды ---------- */
    /**
     * Летящий объект из (x1,y1) в (x2,y2) за ttl мс. kind: arrow|orb|stone|axe|fire|skull|dart.
     * arc — высота дуги; trail — цвет следа; onArrive() — по прибытии.
     * Возвращает Promise, который резолвится по прибытии.
     */
    function missile(x1, y1, x2, y2, o) {
      return new Promise(resolve => {
        o = o || {};
        S.missiles.push({ x1, y1, x2, y2, x: x1, y: y1, ttl: o.ttl || 240, life: 0, arc: o.arc === undefined ? 28 : o.arc, kind: o.kind || 'arrow', color: o.color || '#ffe9a0', size: o.size || 1, trail: o.trail, spin: 0, done: () => { if (o.onArrive) o.onArrive(x2, y2); resolve(); } });
      });
    }

    /* ---------- шаг ---------- */
    function update(dt) {
      S.time += dt;
      const sec = dt / 1000;
      for (let i = S.p.length - 1; i >= 0; i--) {
        const p = S.p[i]; p.life += dt;
        if (p.life >= p.ttl) { S.p.splice(i, 1); continue; }
        p.vx += (p.ax || 0) * sec; p.vy += (p.ay || 0) * sec;
        if (p.drag) { p.vx *= 1 - p.drag * sec; p.vy *= 1 - p.drag * sec; }
        if (p.sway) p.x += Math.sin((S.time + p.ttl) / 600) * 14 * sec;
        p.x += p.vx * sec; p.y += p.vy * sec;
        if (S.bounds && (p.y > S.bounds.h + 24 || p.x < -40 || p.x > S.bounds.w + 40 || p.y < -60)) { S.p.splice(i, 1); continue; }
      }
      for (let i = S.bolts.length - 1; i >= 0; i--) { const b = S.bolts[i]; b.life += dt; if (b.life >= b.ttl) S.bolts.splice(i, 1); }
      for (let i = S.rings.length - 1; i >= 0; i--) { const r = S.rings[i]; r.life += dt; if (r.life >= r.ttl) S.rings.splice(i, 1); }
      for (let i = S.flashes.length - 1; i >= 0; i--) { const f = S.flashes[i]; f.life += dt; if (f.life >= f.ttl) S.flashes.splice(i, 1); }
      for (let i = S.missiles.length - 1; i >= 0; i--) {
        const m = S.missiles[i]; m.life += dt; const k = Math.min(1, m.life / m.ttl);
        const px = m.x, py = m.y;
        m.x = m.x1 + (m.x2 - m.x1) * k; m.y = m.y1 + (m.y2 - m.y1) * k - Math.sin(k * Math.PI) * m.arc;
        m.angle = Math.atan2(m.y - py, m.x - px); m.spin += dt / 40;
        if (m.trail) add({ x: m.x + rnd(-1, 1), y: m.y + rnd(-1, 1), vx: rnd(-5, 5), vy: rnd(-5, 5), ax: 0, ay: m.kind === 'fire' ? -40 : 0, ttl: 260, size: m.kind === 'fire' ? 3 : 1.6, color: m.trail, shape: m.kind === 'fire' ? 'puff' : 'spark', glow: true, shrink: true });
        if (k >= 1) { S.missiles.splice(i, 1); m.done(); }
      }
      if (S.shakeT > 0) S.shakeT -= dt;
    }
    function busy() { return S.p.length + S.bolts.length + S.rings.length + S.missiles.length + S.flashes.length > 0; }
    function clear() { S.p.length = 0; S.bolts.length = 0; S.rings.length = 0; S.flashes.length = 0; S.missiles.length = 0; S.shakeT = 0; }

    /* ---------- рисование ---------- */
    function drawParticles(ctx, under) {
      for (const p of S.p) {
        if (!!p.under !== under) continue;
        const k = p.life / p.ttl;
        let a = p.fade === false ? 1 : (k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4);
        const sz = p.shape === 'puff' ? p.size * (1 + k * (p.grow || 1.8)) : p.shrink ? p.size * (1 - k * 0.6) : p.size;
        ctx.globalAlpha = Math.max(0, a * (p.shape === 'puff' ? 0.5 : 1));
        ctx.fillStyle = p.color;
        if (p.shape === 'dot' || p.shape === 'puff') { ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.4, sz), 0, Math.PI * 2); ctx.fill(); }
        else if (p.shape === 'square') ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.max(1, sz), Math.max(1, sz));
        else if (p.shape === 'spark') {
          // штрих вдоль скорости
          const l = Math.max(1.5, sz * 2.5), ang = Math.atan2(p.vy, p.vx);
          ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(1, sz * 0.8);
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - Math.cos(ang) * l, p.y - Math.sin(ang) * l); ctx.stroke();
        }
        if (p.glow && p.shape !== 'puff') { ctx.globalAlpha *= 0.35; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, sz * 2.2), 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }
    function drawUnder(ctx) {
      for (const r of S.rings) {
        if (!r.under) continue;
        drawRing(ctx, r);
      }
      drawParticles(ctx, true);
    }
    function drawRing(ctx, r) {
      const k = r.life / r.ttl, rad = r.r0 + (r.r1 - r.r0) * k;
      ctx.globalAlpha = 1 - k;
      ctx.beginPath(); ctx.ellipse(r.x, r.y, rad, rad * (r.squash || 1), 0, 0, Math.PI * 2);
      if (r.fill) { ctx.fillStyle = r.fill; ctx.globalAlpha = (1 - k) * 0.35; ctx.fill(); ctx.globalAlpha = 1 - k; }
      ctx.strokeStyle = r.color; ctx.lineWidth = r.width * (1 - k * 0.5); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function drawOver(ctx, w, h) {
      for (const r of S.rings) if (!r.under) drawRing(ctx, r);
      for (const b of S.bolts) {
        const k = b.life / b.ttl; const a = k < 0.3 ? 1 : 1 - (k - 0.3) / 0.7;
        ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const strokePts = (pts, wdt, col) => { ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); };
        strokePts(b.pts, b.width * 4, b.glow); for (const br of b.branches) strokePts(br, b.width * 2, b.glow);
        strokePts(b.pts, b.width, b.color); for (const br of b.branches) strokePts(br, Math.max(1, b.width * 0.6), b.color);
        ctx.globalAlpha = 1;
      }
      for (const m of S.missiles) drawMissile(ctx, m);
      drawParticles(ctx, false);
      for (const f of S.flashes) { const k = f.life / f.ttl; ctx.globalAlpha = f.alpha * (1 - k); ctx.fillStyle = f.color; ctx.fillRect(-50, -50, (w || 4000) + 100, (h || 4000) + 100); ctx.globalAlpha = 1; }
    }
    function drawMissile(ctx, m) {
      ctx.save(); ctx.translate(m.x, m.y);
      const s = m.size;
      if (m.kind === 'arrow' || m.kind === 'dart') {
        ctx.rotate(m.angle);
        const L = m.kind === 'dart' ? 14 * s : 11 * s;
        ctx.strokeStyle = '#000'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.lineTo(L / 2, 0); ctx.stroke();
        ctx.strokeStyle = m.kind === 'dart' ? '#c9c9cc' : '#d8b98a'; ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.lineTo(L / 2, 0); ctx.stroke();
        ctx.fillStyle = '#e8e8ea'; ctx.beginPath(); ctx.moveTo(L / 2 + 2 * s, 0); ctx.lineTo(L / 2 - 2 * s, -2 * s); ctx.lineTo(L / 2 - 2 * s, 2 * s); ctx.fill();
        ctx.fillStyle = '#c8332a'; ctx.fillRect(-L / 2, -1.5 * s, 3 * s, 3 * s);
      } else if (m.kind === 'stone') {
        ctx.rotate(m.spin * 0.3); ctx.fillStyle = '#4b4d54'; ctx.beginPath(); ctx.moveTo(-5 * s, -3 * s); ctx.lineTo(4 * s, -5 * s); ctx.lineTo(6 * s, 2 * s); ctx.lineTo(0, 6 * s); ctx.lineTo(-6 * s, 3 * s); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#8b8d94'; ctx.fillRect(-2 * s, -3 * s, 3 * s, 2 * s);
      } else if (m.kind === 'axe') {
        ctx.rotate(m.spin); ctx.strokeStyle = '#5a3a1c'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(-7 * s, 6 * s); ctx.lineTo(4 * s, -5 * s); ctx.stroke();
        ctx.fillStyle = '#c9c9cc'; ctx.beginPath(); ctx.arc(4 * s, -5 * s, 5 * s, 0.3, 3.2); ctx.fill();
      } else {
        // светящийся сгусток: orb | fire | skull | ice
        const col = m.color;
        ctx.globalAlpha = 0.35; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 8 * s, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(0, 0, 4 * s, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-1 * s, -1 * s, 1.6 * s, 0, Math.PI * 2); ctx.fill();
        if (m.kind === 'skull') { ctx.fillStyle = '#101010'; ctx.fillRect(-2.5 * s, -1.5 * s, 1.6 * s, 1.6 * s); ctx.fillRect(0.8 * s, -1.5 * s, 1.6 * s, 1.6 * s); }
      }
      ctx.restore();
    }

    return { S, add, burst, rise, fall, puff, dissolve, bolt, ring, flash, shake, shakeOffset, missile, update, busy, clear, drawUnder, drawOver };
  }

  H3.Fx = { scene };
})(typeof window !== 'undefined' ? window : globalThis);
