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

  /* ============================ разбор спрайта на части ============================
     Спрайт нарисован одним куском, но двигаться должен как существо: ноги шагают,
     оружие замахивается, крылья бьют, голова покачивается. Перерисовывать 112 существ
     покадрово нереально, поэтому части находим по геометрии готового спрайта:
       1) связные компоненты — то, что не касается тела (копьё, лук, крыло), это «реквизит»;
       2) главное тело режем по горизонтали в самых узких местах: шея и таз;
       3) ноги делим пополам по вертикали — получаются левая и правая.
     Каждая часть становится своим канвасом со смещением и точкой крепления. */
  const partCache = new Map();
  const MAXPARTS = 900000;   // предохранитель: очень крупные спрайты не режем

  function build(im) {
    const cv = im.cv, W = cv.width, H = cv.height;
    if (W * H > MAXPARTS || W < 8 || H < 10) return null;
    let data;
    try { data = cv.getContext('2d').getImageData(0, 0, W, H).data; } catch (e) { return null; }
    const solid = new Uint8Array(W * H);
    let total = 0;
    for (let i = 0; i < W * H; i++) if (data[i * 4 + 3] > 40) { solid[i] = 1; total++; }
    if (total < 40) return null;

    // связные компоненты (4-связность)
    const comp = new Int32Array(W * H).fill(-1);
    const areas = [], boxes = [], stack = [];
    for (let i = 0; i < W * H; i++) {
      if (!solid[i] || comp[i] >= 0) continue;
      const id = areas.length; areas.push(0); boxes.push([W, H, 0, 0]);
      stack.length = 0; stack.push(i); comp[i] = id;
      while (stack.length) {
        const p = stack.pop(); const px = p % W, py = (p - px) / W;
        areas[id]++;
        const b = boxes[id];
        if (px < b[0]) b[0] = px; if (py < b[1]) b[1] = py;
        if (px > b[2]) b[2] = px; if (py > b[3]) b[3] = py;
        if (px > 0 && solid[p - 1] && comp[p - 1] < 0) { comp[p - 1] = id; stack.push(p - 1); }
        if (px < W - 1 && solid[p + 1] && comp[p + 1] < 0) { comp[p + 1] = id; stack.push(p + 1); }
        if (py > 0 && solid[p - W] && comp[p - W] < 0) { comp[p - W] = id; stack.push(p - W); }
        if (py < H - 1 && solid[p + W] && comp[p + W] < 0) { comp[p + W] = id; stack.push(p + W); }
      }
    }
    let body = 0; for (let i = 1; i < areas.length; i++) if (areas[i] > areas[body]) body = i;
    if (areas[body] < total * 0.4) return null;   // тело не доминирует — спрайт странной формы, не режем

    const parts = [];
    // реквизит: отдельные куски заметного размера (копьё, лук, крыло, щит)
    for (let id = 0; id < areas.length; id++) {
      if (id === body || areas[id] < Math.max(6, total * 0.015) || areas[id] > total * 0.4) continue;
      const b = boxes[id];
      const part = maskedCut(cv, comp, id, b, W);
      if (!part) continue;
      part.kind = 'prop';
      // крепление — ближняя к телу сторона по горизонтали
      const bodyB = boxes[body], cxBody = (bodyB[0] + bodyB[2]) / 2;
      const cx = (b[0] + b[2]) / 2;
      part.pivot = [cx < cxBody ? b[2] : b[0], b[1] + (b[3] - b[1]) * 0.35];
      parts.push(part);
    }

    // Оружие почти всегда прирастает к руке и отдельной компонентой не выделяется.
    // Ищем «древко»: тонкую колонку у переднего края, вытянутую почти во весь рост,
    // отделённую от корпуса пустым просветом. Копьё, лук, посох, коса находятся именно так.
    const bb = boxes[body];
    const bodyH = bb[3] - bb[1] + 1;
    // канвас может быть крупнее исходной сетки — толщину меряем в пикселях рисунка, а не экрана
    const unit = cv._w ? cv.width / cv._w : 1;
    const maxPole = Math.max(2, Math.round(2.6 * unit));
    const colOf = x => { let n = 0, y0 = H, y1 = -1; for (let y = bb[1]; y <= bb[3]; y++) if (comp[y * W + x] === body) { n++; if (y < y0) y0 = y; if (y > y1) y1 = y; } return { n, y0, y1, span: y1 - y0 + 1 }; };
    const tall = x => { const c = colOf(x); return c.n > 0 && c.span >= bodyH * 0.42; };
    // самая правая «высокая» колонка — это древко; наконечник и оперение правее неё короткие,
    // поэтому в оружие уходит всё, что находится за просветом
    let xt = -1;
    for (let x = bb[2]; x >= bb[0] + Math.round((bb[2] - bb[0]) * 0.45); x--) if (tall(x)) { xt = x; break; }
    if (xt > bb[0]) {
      let xa = xt; while (xa - 1 >= bb[0] && tall(xa - 1) && xt - xa + 1 < maxPole) xa--;
      const width = xt - xa + 1;
      let py0 = H, py1 = -1, cnt = 0;
      for (let x = xa; x <= bb[2]; x++) { const c = colOf(x); if (!c.n) continue; if (c.y0 < py0) py0 = c.y0; if (c.y1 > py1) py1 = c.y1; cnt += c.n; }
      const gapCol = xa - 1 >= bb[0] ? colOf(xa - 1) : { n: 0 };
      // просвет слева от древка: колонка почти пустая на его высоте — значит это не край корпуса
      if (width <= maxPole && cnt < total * 0.32 && gapCol.n < (py1 - py0 + 1) * 0.45) {
        const hand = gapCol.n ? Math.round((gapCol.y0 + gapCol.y1) / 2) : Math.round(py0 + (py1 - py0) * 0.45);
        const prop = maskedCut(cv, comp, body, [xa, py0, bb[2], py1], W);
        if (prop) {
          prop.kind = 'prop'; prop.pivot = [xa, Math.max(py0, Math.min(py1, hand))];
          parts.push(prop);
          for (let y = py0; y <= py1; y++) for (let x = xa; x <= bb[2]; x++) if (comp[y * W + x] === body) comp[y * W + x] = -2;
          while (bb[2] > bb[0] && !colOf(bb[2]).n) bb[2]--;
        }
      }
    }
    const rowW = new Int32Array(H);
    for (let y = bb[1]; y <= bb[3]; y++) { let n = 0; for (let x = bb[0]; x <= bb[2]; x++) if (comp[y * W + x] === body) n++; rowW[y] = n; }
    const top = bb[1], bot = bb[3], hh = bot - top + 1;
    const findMin = (a, b2) => { let best = -1, bw = 1e9; for (let y = Math.max(top + 1, a); y <= Math.min(bot - 1, b2); y++) { if (rowW[y] && rowW[y] < bw) { bw = rowW[y]; best = y; } } return best; };
    const neck = findMin(top + Math.round(hh * 0.14), top + Math.round(hh * 0.42));
    const hips = findMin(top + Math.round(hh * 0.52), top + Math.round(hh * 0.80));
    if (neck < 0 || hips < 0 || hips - neck < 2) return null;

    const seg = (y0, y1, kind, pivot) => {
      let x0 = W, x1 = 0, any = false;
      for (let y = y0; y <= y1; y++) for (let x = bb[0]; x <= bb[2]; x++) if (comp[y * W + x] === body) { any = true; if (x < x0) x0 = x; if (x > x1) x1 = x; }
      if (!any) return null;
      const part = maskedCut(cv, comp, body, [x0, y0, x1, y1], W);
      if (!part) return null;
      part.kind = kind; part.pivot = pivot(x0, x1, y0, y1);
      parts.push(part);
      return part;
    };
    // срезы перекрываются на пиксель рисунка: верхняя часть закрывает шов с нижней
    const ov = Math.max(1, Math.round(unit * 0.6));
    seg(top, Math.min(bot, neck + ov), 'head', (x0, x1) => [(x0 + x1) / 2, neck]);          // крепление — шея
    seg(neck + 1, Math.min(bot, hips + ov), 'torso', (x0, x1) => [(x0 + x1) / 2, hips]);    // крепление — пояс
    // ноги: делим пополам по вертикали, чтобы шагали в противофазе
    let lx0 = W, lx1 = 0, hasLegs = false;
    for (let y = hips + 1; y <= bot; y++) for (let x = bb[0]; x <= bb[2]; x++) if (comp[y * W + x] === body) { hasLegs = true; if (x < lx0) lx0 = x; if (x > lx1) lx1 = x; }
    if (!hasLegs) return null;
    const mid = Math.round((lx0 + lx1) / 2);
    const legA = maskedCut(cv, comp, body, [lx0, hips + 1, mid, bot], W);
    const legB = maskedCut(cv, comp, body, [mid + 1, hips + 1, lx1, bot], W);
    if (legA && legB && legA.cv.width > 1 && legB.cv.width > 1) {
      legA.kind = 'leg'; legA.pivot = [(lx0 + mid) / 2, hips + 1];
      legB.kind = 'leg'; legB.pivot = [(mid + lx1) / 2, hips + 1];
      legA.side = -1; legB.side = 1;
      parts.push(legA, legB);
    } else {
      const legs = maskedCut(cv, comp, body, [lx0, hips + 1, lx1, bot], W);
      if (!legs) return null;
      legs.kind = 'legs'; legs.pivot = [(lx0 + lx1) / 2, hips + 1]; parts.push(legs);
    }
    return { parts, W, H, anchor: cv._anchor };
  }
  /** Вырезать из спрайта прямоугольник, оставив только пиксели нужной компоненты. */
  function maskedCut(cv, comp, id, box, W) {
    const [x0, y0, x1, y1] = box;
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    if (w <= 0 || h <= 0) return null;
    const out = document.createElement('canvas'); out.width = w; out.height = h;
    const c = out.getContext('2d');
    c.drawImage(cv, x0, y0, w, h, 0, 0, w, h);
    const img = c.getImageData(0, 0, w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (comp[(y0 + y) * W + (x0 + x)] !== id) d[(y * w + x) * 4 + 3] = 0;
    c.putImageData(img, 0, 0);
    return { cv: out, x: x0, y: y0 };
  }
  function parts(name, scale, flip, tint) {
    if (!PARTS.on) return null;
    const key = name + '|' + (scale || 1) + '|' + (flip ? 1 : 0) + '|' + (tint ? JSON.stringify(tint) : '');
    if (partCache.has(key)) return partCache.get(key);
    const im = Sp.image(name, scale || 1, flip, tint);
    let res = null;
    if (im) { try { res = build(im); } catch (e) { res = null; } }
    if (res) { res.k = im.k; res.cv = im.cv; }
    partCache.set(key, res);
    return res;
  }
  const PARTS = { on: true };
  function setParts(v) { PARTS.on = !!v; partCache.clear(); }

  /** Отрисовка по частям: у каждой своя фаза и свой поворот вокруг крепления. */
  function drawParts(ctx, P, x, y, scale, flip, o, st) {
    const k = P.k, u = scale || 1;
    const ax = P.anchor[0] * u, ay = P.anchor[1] * u;
    const t = o.t || 0, ph = o.phase || 0, fwd = flip ? -1 : 1;
    const walk = o.moving ? Math.sin(t / 105 + ph) : 0;
    const breath = Math.sin(t / 720 + ph);
    const lunge = o.lunge || 0, hurt = o.hurt || 0, cast = o.cast || 0;
    const flap = o.flying ? Math.sin(t / (o.moving ? 130 : 260) + ph) : 0;
    // в полёте всё существо держится в воздухе целиком (подъём даёт общий st.dy),
    // поэтому части не расходятся: качается только реквизит-крыло
    const bob = o.flying ? 0 : (o.moving ? -Math.abs(walk) * 1.1 * u : 0);
    ctx.save();
    ctx.globalAlpha *= st.alpha === undefined ? 1 : st.alpha;
    ctx.translate(Math.round(x + st.dx), Math.round(y + st.dy));
    if (Sp.smoothFor) Sp.smoothFor(ctx, k);
    const order = o.flying ? ['prop', 'leg', 'legs', 'torso', 'head'] : ['leg', 'legs', 'torso', 'head', 'prop'];
    for (const kind of order) for (const p of P.parts) {
      if (p.kind !== kind) continue;
      let dx = 0, dy = 0, ang = 0;
      if (kind === 'leg') {
        const sgn = p.side * (flip ? -1 : 1);
        dx = walk * 1.3 * u * sgn * fwd; dy = -Math.max(0, walk * sgn) * 0.9 * u;
        ang = walk * 0.16 * sgn * fwd + lunge * 0.04 * fwd;
      } else if (kind === 'legs') {
        dx = walk * 0.5 * u * fwd; dy = -Math.abs(walk) * 0.5 * u;
      } else if (kind === 'torso') {
        dy = bob - breath * 0.25 * u * (o.flying ? 0.4 : 1); ang = lunge * 0.17 * fwd - hurt * 0.18 * fwd + cast * 0.05;
      } else if (kind === 'head') {
        dy = bob - breath * 0.45 * u * (o.flying ? 0.4 : 1) - cast * 1.5 * u;
        dx = walk * 0.25 * u * fwd + lunge * 0.6 * u * fwd;
        ang = lunge * 0.1 * fwd - hurt * 0.35 * fwd;
      } else { // реквизит: крылья машут, оружие замахивается
        if (o.flying) { ang = flap * 0.5 * fwd; dy = bob * 0.6; }
        else { ang = -lunge * 0.3 * fwd + cast * 0.22 * fwd + breath * 0.015; dx = lunge * 0.6 * u * fwd; dy = bob - cast * 1.2 * u; }
      }
      // смещения только целыми пикселями: дробный сдвиг оставлял бы светлый шов на срезе
      dx = Math.round(dx); dy = Math.round(dy);
      const px = -ax + p.pivot[0] * k, py = -ay + p.pivot[1] * k;
      ctx.save();
      if (ang) { ctx.translate(px, py); ctx.rotate(ang); ctx.translate(-px, -py); }
      ctx.drawImage(p.cv, -ax + p.x * k + dx, -ay + p.y * k + dy, p.cv.width * k, p.cv.height * k);
      ctx.restore();
    }
    ctx.restore();
  }

  /** Отрисовка спрайта с деформацией; якорь (низ-центр) попадает в (x, y). */
  function draw(ctx, name, x, y, scale, flip, o, extraTint) {
    const im = Sp.image(name, scale || 1, flip, extraTint);
    if (!im) { Sp.draw(ctx, name, x, y, scale, flip, extraTint); return; }
    const cv = im.cv, k = im.k, dw = cv.width * k, dh = cv.height * k;
    const st = o && o.st ? o.st : state(o || {});
    // живая анимация по частям — пока существо на ногах; падение и смерть по-прежнему цельным спрайтом
    if (PARTS.on && o && o.t !== undefined && !(o.dead !== undefined && o.dead < 1)) {
      const P = parts(name, scale || 1, flip, extraTint);
      if (P) { drawParts(ctx, P, x, y, scale, flip, o, st); return; }
    }
    const ax = cv._anchor[0] * (scale || 1), ay = cv._anchor[1] * (scale || 1);
    const flat = st.sx === 1 && st.sy === 1 && !st.skew;
    ctx.save();
    if (k !== 1) Sp.smoothFor(ctx, k);
    if (flat) {
      ctx.drawImage(cv, Math.round(x + st.dx - ax), Math.round(y + st.dy - ay), dw, dh);
    } else {
      ctx.translate(Math.round(x + st.dx), Math.round(y + st.dy));
      // сдвиг растёт с высотой над «землёй»: ноги стоят, корпус качается
      ctx.transform(st.sx, 0, st.skew, st.sy, 0, 0);
      ctx.drawImage(cv, -ax, -ay, dw, dh);
    }
    ctx.restore();
  }

  H3.Anim = { state, draw, phaseOf, parts, setParts, PARTS };
})(typeof window !== 'undefined' ? window : globalThis);
