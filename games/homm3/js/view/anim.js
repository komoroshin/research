/* ============================================================================
   view/anim.js — процедурная анимация спрайтов.

   Спрайты статичные (кадров нет), поэтому «жизнь» им даёт деформация при
   отрисовке: сжатие-растяжение (дыхание, шаг), наклон-сдвиг (замах, отдача,
   падение) и смещение (подпрыгивание, парение). Одна матрица на существо —
   никаких попиксельных проходов, отрисовка остаётся одним drawImage.

   state(o) → { dx, dy, sx, sy, skew, alpha } — что применить к спрайту
   (прозрачностью распоряжается вызывающий: в бою она уже выставлена).
   draw(ctx, name, x, y, scale, flip, o) — нарисовать сразу с деформацией.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const Sp = H3.Sprites;

  /** Стабильная фаза 0..2π по строке — чтобы стеки дышали не в такт. */
  function phaseOf(key) {
    let h = 2166136261;
    const s = String(key);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return (h % 1000) / 1000 * Math.PI * 2;
  }

  /**
   * o: { t мс, phase, flying, moving, lunge 0..1 (замах→удар), hurt 0..1,
   *      dead 0..1 (1 — жив, 0 — совсем упал), cast 0..1, idle (вкл/выкл) }
   */
  function state(o) {
    const t = o.t || 0, ph = o.phase || 0, dir = o.dir || 1;
    let dx = 0, dy = 0, sx = 1, sy = 1, skew = 0;

    if (o.flying) {
      // парение + взмах: тело чуть сжимается по вертикали в такт крыльям
      const w = Math.sin(t / (o.moving ? 130 : 260) + ph);
      dy -= 3 + w * (o.moving ? 3 : 2);
      sy += w * 0.05; sx -= w * 0.045;
    } else if (o.moving) {
      // шаг: подскок вдвое чаще наклона, корпус подаётся вперёд
      const s = Math.sin(t / 105 + ph);
      dy -= Math.abs(s) * 2.4;
      sy += Math.abs(s) * 0.05; sx -= Math.abs(s) * 0.04;
      skew += dir * 0.05 * s;
    } else if (o.idle !== false) {
      // дыхание
      const b = Math.sin(t / 720 + ph);
      sy += b * 0.028; sx -= b * 0.022;
    }

    if (o.lunge) {
      // lunge: −1 — полный замах назад, +1 — выпад вперёд, 0 — стойка.
      // Перелом −1 → +1 в момент удара и есть щелчок атаки.
      const l = o.lunge;
      skew -= dir * l * 0.22; sy -= Math.abs(l) * 0.06; sx += Math.abs(l) * 0.05;
    }
    if (o.cast) { const c = Math.sin(o.cast * Math.PI); dy -= c * 4; sy += c * 0.08; sx -= c * 0.05; }
    if (o.hurt) { // отдача назад + просадка
      skew -= dir * o.hurt * 0.16; sy -= o.hurt * 0.08; sx += o.hurt * 0.06;
      dx += Math.sin(t / 11) * 3 * o.hurt;
    }
    if (o.dead !== undefined && o.dead < 1) { // оседает и заваливается
      const f = Math.max(0, o.dead);
      sy = 0.3 + 0.7 * f; sx = 1 + (1 - f) * 0.15; skew += dir * (1 - f) * 0.35;
    }
    return { dx, dy, sx, sy, skew, alpha: o.dead !== undefined ? Math.max(0, Math.min(1, o.dead)) : 1 };
  }

  /** Отрисовка спрайта с деформацией; якорь (низ-центр) попадает в (x, y). */
  function draw(ctx, name, x, y, scale, flip, o, extraTint) {
    const cv = Sp.render(name, scale || 1, flip, extraTint);
    if (!cv) { Sp.draw(ctx, name, x, y, scale, flip, extraTint); return; }
    const st = o && o.st ? o.st : state(o || {});
    const ax = cv._anchor[0] * (scale || 1), ay = cv._anchor[1] * (scale || 1);
    const flat = st.sx === 1 && st.sy === 1 && !st.skew;
    ctx.save();
    if (flat) {
      ctx.drawImage(cv, Math.round(x + st.dx - ax), Math.round(y + st.dy - ay));
    } else {
      ctx.translate(Math.round(x + st.dx), Math.round(y + st.dy));
      // сдвиг растёт с высотой над «землёй»: ноги стоят, корпус качается
      ctx.transform(st.sx, 0, st.skew, st.sy, 0, 0);
      ctx.drawImage(cv, -ax, -ay);
    }
    ctx.restore();
  }

  H3.Anim = { state, draw, phaseOf };
})(typeof window !== 'undefined' ? window : globalThis);
