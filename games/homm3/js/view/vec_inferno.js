/* ============================================================================
   view/vec_inferno.js — Инферно на рисованном конвейере.
   Бес/фамильяр, гог/магог, адская гончая/цербер, демон/рогатый демон,
   порождение ада/владыка бездны, ифрит/султан ифритов, дьявол/архидьявол.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   с другой гаммой и заметной деталью.
   Гуманоиды рисуются в каноне K.H (рамка 200×250, земля y=246),
   псы — в своём каноне (земля y=210), затем fit() вписывает в рамку старого спрайта.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, weapon, wing, fit, frameOf, tone, norm, lerp, rot, ell } = K;

  /* ---------- краски фракции ---------- */
  const FIRE = { out: '#d63a18', mid: '#ff7f24', core: '#ffc94a', hot: '#fff3c0', edge: '#7a1a0a' };
  const BLUE = { out: '#2a62e0', mid: '#46b0ff', core: '#b8ecff', hot: '#f2fcff', edge: '#16307a' };
  const IVORY = '#eadcc0', CLAW = '#f0e6cc', GOLD = '#dcaa3c';

  /* ---------- помощники ---------- */
  /** Вписать части из канона гуманоида (земля y=246) в рамку старого спрайта. */
  function place(name, parts, size, dx) {
    const to = frameOf(name) || { w: 200, h: 250, anchor: [100, 246] };
    return fit(parts, { ground: [100 + (dx || 0), 246] }, to, to.anchor[1] / 246 * (size || 1));
  }
  /** Точки вдоль направления ang от B: t — вдоль (в долях len), w — поперёк (в долях wid). */
  function axis(B, ang, len, wid) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return (t, w, f) => P(B[0] + c * len * t - s * wid * w, B[1] + s * len * t + c * wid * w, f);
  }
  /** Язык пламени: основание B, направление ang, длина, ширина; bend — изгиб кончика (в долях ширины). */
  function tongue(B, ang, len, wid, bend) {
    const at = axis(B, ang, len, wid), b = bend || 0;
    // осевая линия волной (S-изгиб), ширина сходит к кончику — язык, а не кристалл
    const co = t => b * (1.1 * t * t - 0.35 * Math.sin(Math.PI * 2 * t)), hw = t => 0.55 * Math.pow(1 - t, 0.75) * (0.85 + 0.35 * Math.sin(Math.PI * t * 0.9));
    const L = [], R = [];
    for (const t of [0, 0.18, 0.36, 0.54, 0.72, 0.86]) { L.push(at(t, co(t) - hw(t))); R.push(at(t, co(t) + hw(t))); }
    return [at(-0.08, co(0)), ...L, at(1, co(1), 1), ...R.reverse()];
  }
  /**
   * Пламя: несколько языков тремя слоями (внешний, средний, ядро).
   * B — середина основания, ang — куда тянется, len — высота, wid — ширина основания, n — языков.
   */
  function fire(B, ang, len, wid, col, o) {
    o = o || {}; const n = o.n || 3, out = [], sp = o.spread === undefined ? 0.5 : o.spread;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    const layer = (c, kl, kw, cnt, line) => {
      for (let i = 0; i < cnt; i++) {
        const f = cnt === 1 ? 0 : i / (cnt - 1) - 0.5;
        const L = len * kl * (1 - Math.abs(f) * 0.55) * (o.jit ? 1 + ((i * 37 + cnt * 11) % 7 - 3) * 0.04 : 1);
        const base = [B[0] + nx * f * wid * 0.62, B[1] + ny * f * wid * 0.62];
        out.push({ p: tongue(base, ang + f * sp, L, wid * kw / Math.max(1, cnt * 0.55), (f < 0 ? 0.4 : f > 0 ? -0.4 : (o.lean || 0.25)) * (o.curl || 1)), c, m: 'flat', line, lc: col.edge });
      }
    };
    layer(col.out, 1, 1, n, o.line === undefined ? 0.7 : o.line);
    layer(col.mid, 0.74, 0.72, Math.max(1, n - 1), 0);
    layer(col.core, 0.46, 0.5, Math.max(1, n - 2), 0);
    return out;
  }
  /** Мягкое свечение: полупрозрачные круги (форма flat с цветом rgba). */
  const glow = (cx, cy, r, rgb, a) => [{ e: [cx, cy, r, r], c: 'rgba(' + rgb + ',' + (a * 0.5).toFixed(2) + ')', m: 'flat', line: 0 },
    { e: [cx, cy, r * 0.7, r * 0.7], c: 'rgba(' + rgb + ',' + a.toFixed(2) + ')', m: 'flat', line: 0 }];
  /** Огненный шар: ореол, раскалённая сфера, ядро, язычки сверху. */
  function fireball(cx, cy, r, col, o) {
    o = o || {}; const rgb = o.rgb || '255,140,40';
    return [
      ...glow(cx, cy, r * 1.9, rgb, 0.28),
      ...fire([cx - r * 0.1, cy - r * 0.35], -Math.PI / 2 - 0.2, r * 1.9, r * 1.5, col, { n: 3, line: 0.5, spread: 0.7 }),
      { e: [cx, cy, r, r], c: col.mid, m: 'gem', gloss: 1.1, line: 0.6, lc: col.edge, sub: [{ e: [cx - r * 0.12, cy - r * 0.1, r * 0.66, r * 0.62], c: col.core, m: 'flat', line: 0 }, { e: [cx - r * 0.22, cy - r * 0.22, r * 0.34, r * 0.32], c: col.hot, m: 'flat', line: 0 }],
        glint: [[cx - r * 0.35, cy - r * 0.4, r * 0.35]] },
    ];
  }
  /** Рог трубкой: корень R, изгиб задан точками [dx, dy, толщина] в долях r. */
  function horn(R, r, path, c, o) {
    o = o || {}; const pts = path.map(q => [R[0] + q[0] * r * (o.fx || 1), R[1] + q[1] * r, q[2] * r]);
    return { p: tube(pts), c: c || IVORY, m: 'horn', gloss: 0.8, line: 0.8,
      lines: [{ p: pts.slice(0, -1).map(q => [q[0] - q[2] * 0.12, q[1] - q[2] * 0.18]), w: 1.1, light: true, a: 0.6 },
        ...pts.slice(1, -1).map(q => ({ p: [[q[0] - q[2] * 0.45, q[1] + q[2] * 0.1], [q[0] + q[2] * 0.45, q[1] - q[2] * 0.1]], w: 0.9, a: 0.35 }))] };
  }
  const HORN = {
    stub: [[0, 0, 0.36], [0.08, -0.34, 0.26], [0.3, -0.62, 0.1]],
    short: [[0, 0, 0.42], [-0.05, -0.45, 0.32], [0.14, -0.86, 0.17], [0.42, -1.05, 0.04]],
    long: [[0, 0, 0.46], [-0.36, -0.5, 0.36], [-0.46, -1.15, 0.26], [-0.2, -1.75, 0.13], [0.22, -2.05, 0.03]],
    sweep: [[0, 0, 0.48], [-0.5, -0.3, 0.38], [-1.05, -0.62, 0.26], [-1.35, -1.2, 0.14], [-1.2, -1.7, 0.03]],
    ram: [[0, 0, 0.5], [-0.45, -0.25, 0.44], [-0.8, 0.2, 0.34], [-0.5, 0.62, 0.22], [-0.05, 0.5, 0.1]],
  };
  /**
   * Голова демона в три четверти, лицом вправо: скула, подбородок, острое ухо,
   * злые светящиеся глаза под тяжёлой бровью, пасть с клыками, рога.
   * o: { skin, brow, eye, horns: ключ HORN, hornC, hornK, mouth: 'snarl'|'grin'|'shut', ear, jaw }
   */
  function dHead(cx, cy, r, o) {
    o = o || {}; const sk = o.skin, out = [], hc = o.hornC || IVORY, hk = o.hornK || 1, jaw = o.jaw || 1;
    const hornPath = o.horns && HORN[o.horns];
    if (hornPath) out.push(horn([cx - r * 0.42, cy - r * 0.72], r * hk * 0.9, hornPath, tone(hc, -0.25)));
    if (o.ear !== false) out.push({ p: [[cx - r * 0.25, cy - r * 0.12], P(cx - r * 1.25, cy - r * 0.62, 1), [cx - r * 0.6, cy + r * 0.12], [cx - r * 0.3, cy + r * 0.4]], c: sk, m: 'skin', line: 0.8,
      lines: [{ p: [[cx - r * 0.45, cy + r * 0.06], [cx - r * 0.95, cy - r * 0.42]], w: 1.1, a: 0.55 }] });
    out.push({ p: [[cx - r * 0.92, cy - r * 0.05], [cx - r * 0.7, cy - r * 0.8], [cx, cy - r * 1.02], [cx + r * 0.72, cy - r * 0.72], [cx + r * 0.95, cy - r * 0.28], P(cx + r * 1.16, cy + r * 0.1, 1),
      [cx + r * 1.0, cy + r * 0.34], [cx + r * 1.04, cy + r * 0.56 * jaw], [cx + r * 0.9, cy + r * 0.9 * jaw], [cx + r * 0.46, cy + r * 1.06 * jaw], [cx - r * 0.2, cy + r * 0.92], [cx - r * 0.78, cy + r * 0.5]],
      c: sk, m: 'skin', id: 'face', lines: [{ p: [[cx + r * 0.3, cy + r * 0.22], [cx + r * 0.52, cy + r * 0.48], [cx + r * 0.6, cy + r * 0.72]], w: 1, a: 0.4 }] });
    if (o.mouth !== 'shut') {
      const my = cy + r * 0.56 * jaw;
      out.push({ p: [[cx + r * 0.46, my - r * 0.02], [cx + r * 1.03, my - r * 0.12], [cx + r * 0.98, my + r * 0.12], [cx + r * 0.58, my + r * 0.14]], c: '#3a0a08', m: 'flat', line: 0.6, lc: '#1a0404' });
      for (const [fx, up] of [[0.64, 0], [0.9, 0], [0.76, 1]]) {
        const x = cx + r * fx, y = up ? my + r * 0.14 : my - r * 0.06;
        out.push({ p: up ? [P(x - r * 0.07, y, 1), P(x, y - r * 0.18, 1), P(x + r * 0.07, y, 1)] : [P(x - r * 0.07, y, 1), P(x + r * 0.07, y, 1), P(x, y + r * 0.2, 1)], c: CLAW, m: 'horn', line: 0.4 });
      }
    }
    // тяжёлая бровь и злой глаз
    out.push({ p: [[cx + r * 0.22, cy - r * 0.34], P(cx + r * 0.95, cy - r * 0.2, 1), [cx + r * 0.9, cy - r * 0.06], [cx + r * 0.3, cy - r * 0.16]], c: o.brow || tone(sk, -0.5), m: 'skin', line: 0.5 });
    out.push({ p: [[cx + r * 0.36, cy - r * 0.06], P(cx + r * 0.84, cy - r * 0.1, 1), [cx + r * 0.76, cy + r * 0.1], [cx + r * 0.44, cy + r * 0.1]], c: o.eye || '#ffd23a', m: 'gem', line: 0.5, lc: '#2a0604',
      glint: [[cx + r * 0.6, cy - r * 0.01, r * 0.14]] });
    if (hornPath) out.push(horn([cx + r * 0.12, cy - r * 0.8], r * hk, hornPath, hc));
    return out;
  }
  /** Мускулистая рука с когтями: плечо → локоть → кисть. o: { c, w, claw, band (цвет наруча), bandM, fist } */
  function mArm(sh, el, hand, o) {
    o = o || {}; const w = o.w || 16, c = o.c, m = o.m || 'skin';
    const mid1 = lerp(sh, el, 0.45), mid2 = lerp(el, hand, 0.35);
    const out = [
      { p: tube([[sh[0], sh[1], w * 1.2], [mid1[0], mid1[1], w * 1.28], [el[0], el[1], w * 0.86]]), c, m, lines: [{ p: [lerp(sh, el, 0.25), lerp(sh, el, 0.7)], w: 1, a: 0.3 }] },
      { p: tube([[el[0], el[1], w * 0.9], [mid2[0], mid2[1], w * 1.0], [hand[0], hand[1], w * 0.66]]), c: o.fore || c, m },
    ];
    if (o.band) { const b0 = lerp(el, hand, 0.45), b1 = lerp(el, hand, 0.85); out.push({ p: tube([[b0[0], b0[1], w * 1.08], [b1[0], b1[1], w * 0.86]], { flat0: true, flat1: true }), c: o.band, m: o.bandM || 'steel', glint: [[...lerp(b0, b1, 0.4), 2.5]] }); }
    const d = norm(hand[0] - el[0], hand[1] - el[1]);
    out.push({ e: [hand[0] + d[0] * 2, hand[1] + d[1] * 2, w * 0.56, w * 0.5], c: o.hand || c, m, line: 0.8 });
    if (o.claw !== false) for (let i = -1; i <= 1; i++) {
      const a = Math.atan2(d[1], d[0]) + i * 0.38 + (o.clawBend || 0), bx = hand[0] + d[0] * w * 0.45 + Math.cos(a) * w * 0.3, by = hand[1] + d[1] * w * 0.45 + Math.sin(a) * w * 0.3;
      out.push({ p: [P(bx - Math.sin(a) * 2.8, by + Math.cos(a) * 2.8, 1), [bx + Math.cos(a + 0.2) * w * 0.4, by + Math.sin(a + 0.2) * w * 0.4], P(bx + Math.cos(a + 0.45) * w * 0.72, by + Math.sin(a + 0.45) * w * 0.72, 1), P(bx + Math.sin(a) * 2.8, by - Math.cos(a) * 2.8, 1)], c: o.clawC || CLAW, m: 'horn', line: 0.5 });
    }
    return out;
  }
  /**
   * Нога демона с обратным коленом: бедро → колено вперёд → скакательный сустав назад → стопа.
   * o: { c, tw, foot: 'hoof'|'claw', hoofC, fur (цвет шерсти на голени) }
   */
  function dLeg(hip, foot, o) {
    o = o || {}; const c = o.c, tw = o.tw || 26, Hh = foot[1] - hip[1];
    const knee = [hip[0] + (o.kx === undefined ? 14 : o.kx), hip[1] + Hh * 0.42], hock = [foot[0] - (o.hx === undefined ? 8 : o.hx), foot[1] - Hh * 0.3], ank = [foot[0] + 1, foot[1] - 9];
    const out = [
      { p: tube([[hip[0], hip[1] - 8, tw], [lerp(hip, knee, 0.5)[0] + 2, lerp(hip, knee, 0.5)[1], tw * 0.92], [knee[0], knee[1], tw * 0.62]], { flat0: true }), c, m: o.m || 'skin' },
      { p: tube([[knee[0], knee[1], tw * 0.6], [lerp(knee, hock, 0.5)[0] - 1, lerp(knee, hock, 0.5)[1], tw * 0.52], [hock[0], hock[1], tw * 0.34]]), c: o.shinC || c, m: o.shinM || o.m || 'skin' },
      { p: tube([[hock[0], hock[1], tw * 0.34], [ank[0], ank[1], tw * 0.28]]), c: o.shinC || c, m: o.shinM || o.m || 'skin' },
    ];
    if (o.fur) out.push({ p: [[knee[0] - tw * 0.4, knee[1] - 4], [knee[0] + tw * 0.34, knee[1] - 2], [hock[0] + tw * 0.3, hock[1] + 2], [ank[0] + 6, ank[1] - 4, 1], [ank[0] - 2, ank[1] + 2], [ank[0] - 9, ank[1] - 6, 1], [hock[0] - tw * 0.36, hock[1]]], c: o.fur, m: 'fur', furLen: 0.9, flow: Math.PI * 0.55 });
    if (o.foot === 'hoof') out.push({ p: [[ank[0] - 8, ank[1] - 3], [ank[0] + 7, ank[1] - 4], P(foot[0] + 12, foot[1], 1), P(ank[0] - 10, foot[1], 1)], c: o.hoofC || '#2a1c18', m: 'horn', gloss: 0.9,
      lines: [{ p: [[foot[0] + 3, foot[1] - 8], [foot[0] + 4, foot[1]]], w: 1.2, a: 0.8 }] });
    else {
      out.push({ p: [[ank[0] - 8, ank[1] - 4], [ank[0] + 8, ank[1] - 4], [foot[0] + 12, foot[1] - 3], P(foot[0] + 12, foot[1], 1), P(ank[0] - 10, foot[1], 1)], c: o.shinC || c, m: 'skin' });
      for (let i = 0; i < 3; i++) out.push({ p: [P(foot[0] + 4 + i * 4, foot[1] - 5, 1), P(foot[0] + 15 + i * 3, foot[1] - 1 + i * 0.4, 1), P(foot[0] + 8 + i * 4, foot[1], 1)], c: o.clawC || CLAW, m: 'horn', line: 0.5 });
    }
    return out;
  }
  /** Хвост с наконечником-стрелкой: точки [x, y, толщина]. */
  function tail(pts, c, o) {
    o = o || {}; const n = pts.length, a = pts[n - 2], b = pts[n - 1], d = norm(b[0] - a[0], b[1] - a[1]), nx = -d[1], ny = d[0], s = o.spade || 9;
    const out = [{ p: tube(pts), c, m: o.m || 'skin', line: 0.8, lines: [{ p: pts.map(q => [q[0], q[1] - q[2] * 0.2]), w: 0.9, light: true, a: 0.35 }] }];
    if (s) out.push({ p: [P(b[0] - d[0] * 2 + nx * 2, b[1] - d[1] * 2 + ny * 2, 1), P(b[0] - d[0] * s * 0.5 + nx * s, b[1] - d[1] * s * 0.5 + ny * s, 1), P(b[0] + d[0] * s * 1.6, b[1] + d[1] * s * 1.6, 1), P(b[0] - d[0] * s * 0.5 - nx * s, b[1] - d[1] * s * 0.5 - ny * s, 1), P(b[0] - d[0] * 2 - nx * 2, b[1] - d[1] * 2 - ny * 2, 1)],
      c: o.spadeC || c, m: o.m || 'skin', line: 0.8 });
    return out;
  }
  /** Голый мускулистый корпус: плечи, грудь, пресс; belly — светлая грудь и живот. */
  function chest(o) {
    const c = o.c, out = [];
    out.push({ p: [[70, 86], [98, 76], [130, 80], [146, 98], [142, 124], [130, 148], [126, 170], [78, 170], [74, 150], [62, 124], [60, 100]], c, m: 'skin', id: 'chest',
      sub: o.belly ? [{ p: [[100, 92], [138, 94], [142, 120], [130, 150], [124, 172], [96, 172], [94, 140], [92, 110]], c: o.belly, m: 'skin', line: 0, belly: 0.2 }] : [],
      lines: [{ p: [[98, 106], [114, 116], [136, 110]], w: 1.4, a: 0.55 }, { p: [[112, 118], [112, 162]], w: 1.1, a: 0.4 }, { p: [[100, 132], [124, 132]], w: 1, a: 0.35 }, { p: [[100, 146], [122, 146]], w: 1, a: 0.3 },
        { p: [[78, 96], [70, 120]], w: 1.1, a: 0.35 }] });
    out.push({ p: tube([[106, 66, 20], [104, 88, 24]]), c: o.neck || c, m: 'skin', id: 'neck' });
    if (o.cloth) out.push({ p: [[76, 158], [128, 158], [132, 196, 1], [118, 190], [106, 202], [92, 190], [72, 196, 1]], c: o.cloth, m: 'cloth', belly: 0.3, id: 'loin', lines: [{ p: [[104, 164], [106, 198]], w: 1.1, a: 0.4 }] });
    if (o.belt) out.push({ p: [[74, 152], [130, 152], [131, 163], [73, 163]], c: o.belt, m: 'leather', id: 'belt', sub: [{ e: [106, 157.5, 7, 6.5], c: o.buckle || GOLD, m: 'gold', line: 0.6 }] });
    return out;
  }

  /* ================= 1. Бес / фамильяр ================= */
  // Мелкий чертёнок: большая голова с рожками, пузо, кожистые крылышки, хвост-стрелка, когти вперёд.
  function imp(name, o) {
    const sk = o.skin, far = tone(sk, -0.25);
    const wingS = [
      ...wing.bat([84, 116], [-0.35, -1], 74, { mem: o.mem, bone: tone(sk, -0.2), claw: CLAW }),
      ...wing.bat([96, 112], [-0.85, -0.6], 84, { mem: tone(o.mem, 0.08), bone: sk, claw: CLAW }),
    ];
    const parts = [
      { kind: 'leg', side: -1, pivot: [90, 176], shapes: dLeg([90, 178], [86, 246], { c: far, tw: 22, kx: 12, hx: 8 }) },
      { kind: 'leg', side: 1, pivot: [110, 176], shapes: dLeg([110, 178], [112, 246], { c: sk, tw: 24, kx: 12, hx: 8 }) },
      { kind: 'torso', pivot: [100, 160], shapes: [
        ...tail([[76, 174, 9], [52, 186, 7], [38, 172, 5], [36, 150, 4], [44, 136, 3]], sk, { spade: 9 }),
        ...wingS,
        ...mArm([80, 118], [70, 142], [80, 162], { c: far, w: 12 }),
        { p: [[76, 118], [100, 108], [126, 114], [138, 138], [134, 170], [118, 188], [90, 190], [72, 176], [66, 148]], c: sk, m: 'skin', belly: 0.25,
          sub: [{ e: [114, 158, 22, 28], c: o.belly, m: 'skin', line: 0, belly: 0.2 }], lines: [{ p: [[106, 148], [120, 152]], w: 1, a: 0.3 }, { p: [[104, 166], [122, 168]], w: 1, a: 0.3 }] },
        ...(o.extraBody || []),
      ] },
      { kind: 'head', pivot: [108, 112], shapes: [...dHead(112, 82, 30, { skin: sk, eye: o.eye, horns: o.horns, hornC: o.hornC, hornK: 0.8, jaw: 0.95 }), ...(o.extraHead || [])] },
      { kind: 'prop', pivot: [124, 122], shapes: [...(o.held || []), ...mArm([124, 122], [140, 146], [158, 132], { c: sk, w: 13, clawBend: -0.3 })] },
    ];
    V.def(name, place(name, parts, o.size || 0.9));
  }
  imp('imp', { skin: '#c8342a', belly: '#f08a3a', mem: '#6a1c1c', eye: '#ffd23a', horns: 'short', hornC: '#3a2622' });
  imp('familiar', { skin: '#7a1c3a', belly: '#b0405a', mem: '#2a1030', eye: '#7ae0ff', horns: 'long', hornC: '#e8dcc0', size: 0.94,
    held: [...glow(166, 116, 18, '120,200,255', 0.35), ...fire([163, 128], -Math.PI / 2 - 0.15, 46, 26, BLUE, { n: 3, spread: 0.6, line: 0.5 })] });

  /* ================= 2. Гог / магог ================= */
  // Коренастый демон с рожками, ржавая шкура, светлое лицо; поднятой рукой держит огненный шар.
  function gog(name, o) {
    const sk = o.skin, far = tone(sk, -0.25);
    const parts = [
      { kind: 'leg', side: -1, pivot: [90, 170], shapes: dLeg([90, 172], [86, 246], { c: far, tw: 26 }) },
      { kind: 'leg', side: 1, pivot: [112, 170], shapes: dLeg([112, 172], [114, 246], { c: sk, tw: 28 }) },
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...tail([[80, 168, 11], [56, 184, 8], [40, 176, 6], [32, 156, 4]], far, { spade: 8 }),
        ...mArm([80, 96], [72, 128], [84, 152], { c: far, w: 15 }),
        ...chest({ c: sk, belly: o.belly, cloth: o.cloth, belt: '#3a2418', buckle: GOLD }),
      ] },
      { kind: 'head', pivot: [104, 76], shapes: dHead(110, 52, 24, { skin: o.face || sk, eye: o.eye, horns: o.horns, hornC: o.hornC, hornK: o.hornK || 1 }) },
      { kind: 'prop', pivot: [128, 92], shapes: [
        ...mArm([128, 92], [150, 84], [154, 54], { c: sk, w: 15, clawBend: 0.2 }),
        ...fireball(156, 30 - (o.ballR - 16) * 0.6, o.ballR, o.fire, { rgb: o.rgb }),
      ] },
    ];
    V.def(name, place(name, parts, o.size || 0.92));
  }
  gog('gog', { skin: '#a8502a', face: '#c87848', belly: '#d89060', cloth: '#4a2a1a', eye: '#ffd23a', horns: 'short', hornC: '#3a2622', ballR: 15, fire: FIRE });
  gog('magog', { skin: '#a8242a', face: '#c84a3a', belly: '#e07050', cloth: '#1e1414', eye: '#fff07a', horns: 'long', hornC: '#f0c040', hornK: 0.9, ballR: 20,
    fire: { out: '#ff5a18', mid: '#ffa22a', core: '#ffe07a', hot: '#fffbe0', edge: '#8a2a08' }, rgb: '255,180,60' });

  /* ================= 3. Адская гончая / цербер ================= */
  // Поджарый пёс из трубок: глубокая грудь, подтянутый живот, огненная грива и хвост,
  // раскалённые трещины на шкуре, в раскрытой пасти — жар. Канон: земля y=210, морда вправо.
  const DG = 210;
  function dogPaw(x, y, c) {
    return [{ p: [[x - 16, y - 10], [x + 2, y - 11], [x + 10, y - 5], [x + 12, y, 1], [x - 18, y, 1]], c, m: 'skin', line: 0.8 },
      ...[0, 1, 2].map(i => ({ p: [P(x - 2 + i * 5, y - 4, 1), P(x + 6 + i * 5, y - 1, 1), P(x + 2 + i * 5, y, 1)], c: CLAW, m: 'horn', line: 0.4 }))];
  }
  function hindLeg(dx, dy, c) {
    const m = (x, y, w) => [x + dx, y + dy, w];
    return [
      { p: tube([m(90, 120, 44), m(104, 148, 28), m(112, 160, 19)], { flat0: true }), c, m: 'skin' },
      { p: tube([m(112, 160, 17), m(98, 176, 13), m(86, 186, 11)]), c, m: 'skin' },
      { p: tube([m(86, 186, 11), m(90, 198, 9.5), m(94, 204, 9)]), c, m: 'skin' },
      ...dogPaw(100 + dx, DG + dy, c),
    ];
  }
  function foreLeg(dx, dy, c) {
    const m = (x, y, w) => [x + dx, y + dy, w];
    return [
      { p: tube([m(206, 118, 34), m(200, 150, 20), m(198, 158, 16)], { flat0: true }), c, m: 'skin' },
      { p: tube([m(198, 158, 15), m(202, 180, 12), m(206, 192, 10)]), c, m: 'skin' },
      { p: tube([m(206, 192, 10), m(210, 202, 9)]), c, m: 'skin' },
      ...dogPaw(218 + dx, DG + dy, c),
    ];
  }
  /** Голова пса на шее; (dx, dy) — сдвиг, sh — затемнение для дальних голов цербера. */
  function dogHead(dx, dy, o, sh) {
    const c = sh ? tone(o.coat, -sh) : o.coat, M = pts => pts.map(q => P(q[0] + dx, q[1] + dy, q[2])), X = x => x + dx, Y = y => y + dy;
    const out = [];
    out.push({ p: tube([[X(204), Y(126), 40], [X(222), Y(100), 30], [X(238), Y(80), 24]]), c, m: 'skin', lines: [{ p: [[X(214), Y(118)], [X(230), Y(92)]], w: 1.4, c: o.crack, a: 0.9 }] });
    if (o.collar) out.push({ p: tube([[X(214), Y(118), 12], [X(230), Y(96), 12]]), c: o.collar, m: 'steel', line: 0.7, id: 'collar' },
      ...[0, 1, 2].map(i => ({ p: [P(X(209 + i * 8), Y(110 - i * 10), 1), P(X(200 + i * 8), Y(100 - i * 10), 1), P(X(213 + i * 8), Y(104 - i * 10), 1)], c: '#c8ced6', m: 'steel', line: 0.5 })));
    out.push(...fire([X(222), Y(84)], -Math.PI * 0.72, 40 * (o.mane || 1) * (1 - (sh || 0)), 34 * (1 - (sh || 0) * 0.8), o.fire, { n: 3, spread: 0.7, curl: 1.2 }));
    out.push({ p: M([[240, 62], P(232, 34, 1), [252, 56]]), c: tone(c, -0.2), m: 'skin', line: 0.8 });
    // нижняя челюсть, жар пасти, верхняя челюсть с черепом
    out.push({ p: M([[246, 92], [268, 96], [292, 104], [294, 110], [270, 110], [250, 104]]), c: tone(c, -0.1), m: 'skin', line: 0.8 });
    out.push({ p: M([[250, 84], [296, 84], [294, 104], [252, 98]]), c: o.maw, m: 'flat', line: 0 });
    out.push(...[0, 1, 2].map(i => ({ p: [P(X(262 + i * 10), Y(97 + i * 2), 1), P(X(266 + i * 10), Y(89 + i * 2), 1), P(X(270 + i * 10), Y(98 + i * 2), 1)], c: CLAW, m: 'horn', line: 0.4 })));
    out.push({ p: M([[228, 74], [236, 60], [256, 54], [272, 62], [292, 70], [302, 78], [300, 86], [284, 88], P(268, 86, 1), [250, 90], [234, 90]]), c, m: 'skin',
      lines: [{ p: M([[258, 64], [278, 70], [294, 74]]), w: 1.1, light: true, a: 0.45 }, { p: M([[236, 82], [244, 70]]), w: 1.3, c: o.crack, a: 0.9 }] });
    out.push(...[0, 1, 2, 3].map(i => ({ p: [P(X(262 + i * 9), Y(85 - i * 0.5), 1), P(X(266 + i * 9), Y(93), 1), P(X(270 + i * 9), Y(85 - i * 0.5), 1)], c: CLAW, m: 'horn', line: 0.4 })));
    out.push({ e: [X(300), Y(77), 4, 3.4], c: '#141014', m: 'horn', line: 0.4, glint: [[X(299), Y(76), 1.5]] });
    out.push({ p: M([[252, 60], P(274, 62, 1), [272, 67], [254, 66]]), c: tone(c, -0.45), m: 'flat', line: 0 });
    out.push({ p: M([[258, 64], P(273, 64, 1), [268, 70], [258, 69]]), c: o.eye, m: 'gem', line: 0.4, lc: '#2a0604', glint: [[X(264), Y(66), 2]] });
    return out;
  }
  function hound(name, o) {
    const c = o.coat, far = tone(c, -0.3), heads = o.heads || [[0, 0, 0]];
    // ноги длиннее канона: корпус поднят на lift, ноги растянуты по вертикали от земли
    const lift = o.lift || 0, sl = (DG - 126 + lift) / (DG - 126);
    const up = (x, y) => [x, y - lift], st = (x, y) => [x, DG - (DG - y) * sl];
    const L = (sh, piv, side) => ({ kind: 'leg', side, pivot: st(...piv), shapes: K.mapShapes(sh, st, 1) });
    const parts = [
      L(hindLeg(18, -3, far), [108, 126], 1),
      L(foreLeg(-18, -3, far), [188, 126], -1),
      L(hindLeg(0, 0, c), [90, 126], -1),
      L(foreLeg(0, 0, c), [206, 126], 1),
      { kind: 'torso', pivot: up(140, 130), shapes: K.mapShapes([
        { p: tube([[64, 116, 13], [44, 104, 10], [34, 86, 8], [36, 70, 6]]), c, m: 'skin', line: 0.8 },
        ...fire([36, 76], -Math.PI * 0.62, 44 * (o.tailK || 1), 22, o.fire, { n: 3, spread: 0.6 }),
        ...fire([96, 104], -Math.PI * 0.72, 30, 26, o.fire, { n: 3, spread: 0.6 }),
        ...fire([150, 104], -Math.PI * 0.7, 28, 26, o.fire, { n: 3, spread: 0.6 }),
        { p: [[60, 118], [86, 102], [120, 106], [150, 110], [178, 100], [204, 94], [226, 104], [236, 126], [230, 148], [214, 162], [192, 164], [168, 150], [140, 142], [118, 146], [96, 152], [74, 146], [58, 132]], c, m: 'skin', belly: 0.4,
          lines: [{ p: [[186, 108], [196, 130], [192, 152]], w: 1.2, a: 0.4 }, { p: [[90, 110], [108, 130], [104, 146]], w: 1.2, a: 0.4 }, { p: [[150, 118], [148, 136]], w: 1, a: 0.3 },
            { p: [[122, 112], [132, 124], [128, 134]], w: 1.5, c: o.crack, a: 0.95 }, { p: [[200, 110], [210, 124], [206, 140]], w: 1.5, c: o.crack, a: 0.95 }, { p: [[80, 118], [86, 132]], w: 1.4, c: o.crack, a: 0.9 },
            { p: [[92, 106], [150, 112], [200, 98]], w: 1.3, light: true, a: 0.35 }] },
      ], up, 1) },
    ];
    heads.forEach(([dx, dy, sh, a]) => {
      // голова поворачивается вокруг основания шеи: у цербера — веером
      const px = 206 + dx, py = 124 + dy, ca = Math.cos(a || 0), sa = Math.sin(a || 0);
      const f = (x, y) => up(px + (x - px) * ca - (y - py) * sa, py + (x - px) * sa + (y - py) * ca);
      parts.push({ kind: 'head', pivot: up(px, py), shapes: K.mapShapes(dogHead(dx, dy, o, sh), f, 1) });
    });
    const to = frameOf(name) || { w: 280, h: 213, anchor: [140, 210] };
    V.def(name, fit(parts, { ground: [150 + (o.dx || 0), DG] }, to, o.k || 1));
  }
  hound('hell_hound', { coat: '#3e3c46', crack: '#ff7a2a', maw: '#ffb040', eye: '#ffcc30', fire: FIRE, k: 0.94, lift: 16 });
  hound('cerberus', { coat: '#3a2a2e', crack: '#ff5a1a', maw: '#ffd060', eye: '#ff4a2a', fire: { out: '#e8341a', mid: '#ff8a1e', core: '#ffe06a', hot: '#fff6c8', edge: '#6a0e06' },
    mane: 1.2, tailK: 1.2, k: 0.97, dx: 6, lift: 16, heads: [[-24, -36, 0.25, -0.48], [-9, -17, 0.12, -0.18], [4, 2, 0, 0.14]] });

  /** Наплечник: широкая выпуклая пластина и две полосы-ламы под ней, шип назад-вверх. */
  function pauldron(cx, cy, r, c, m, spike) {
    m = m || 'steel'; const dk = tone(c, -0.2), out = [];
    for (const [k, dy] of [[0.78, 0.86], [0.9, 0.5]]) out.push({ p: [P(cx - r * k, cy + dy * r - r * 0.2, 1), [cx, cy + dy * r - r * 0.32], P(cx + r * k * 1.05, cy + dy * r - r * 0.14, 1), P(cx + r * k * 0.95, cy + dy * r + r * 0.18, 1), [cx, cy + dy * r + r * 0.06], P(cx - r * k * 0.95, cy + dy * r + r * 0.12, 1)], c: dk, m, line: 0.8 });
    out.push({ p: [[cx - r * 1.12, cy + r * 0.2], [cx - r * 0.85, cy - r * 0.42], [cx - r * 0.05, cy - r * 0.66], [cx + r * 0.8, cy - r * 0.46], [cx + r * 1.18, cy + r * 0.12], P(cx + r * 1.06, cy + r * 0.38, 1), [cx, cy + r * 0.22], P(cx - r * 1.04, cy + r * 0.44, 1)], c, m,
      glint: [[cx - r * 0.25, cy - r * 0.32, r * 0.3]], lines: [{ p: [[cx - r * 0.9, cy + r * 0.22], [cx, cy + r * 0.05], [cx + r * 1.0, cy + r * 0.22]], w: 1.6, c: tone(c, 0.4), a: 0.9 }] });
    for (const i of [-0.6, 0, 0.6]) out.push({ e: [cx + i * r, cy + r * 0.14 - Math.abs(i) * r * 0.04, r * 0.08, r * 0.08], c: tone(c, 0.3), m, line: 0.4 });
    if (spike !== false) out.push({ p: [P(cx - r * 0.5, cy - r * 0.5, 1), P(cx - r * 0.55, cy - r * 1.35, 1), P(cx + r * 0.05, cy - r * 0.62, 1)], c: spike || tone(c, 0.15), m, line: 0.7 });
    return out;
  }
  /** Тяжёлая глефа: толстое древко, широкий изогнутый клинок вперёд, крюк назад, кольцо-оковка. */
  function glaive(hand, dir, len, o) {
    o = o || {}; const at = K.along(hand, dir), back = o.back === undefined ? 80 : o.back, E = len, B = o.bladeLen || 52, hd = o.head || '#c8ced6', m = o.headM || 'steel';
    const out = [];
    if (o.fire) out.push(...fire(at(E + B * 0.2, 6), Math.atan2(dir[1], dir[0]), B * 1.05, B * 0.95, o.fire, { n: 4, spread: 0.7 }));
    out.push({ p: tube([[...at(-back, 0), 7.5], [...at(E, 0), 6.5]]), c: o.shaft || '#3a2418', m: 'wood', flow: Math.atan2(dir[1], dir[0]), line: 0.8 });
    out.push({ p: [P(...at(-back - 2, -4), 1), P(...at(-back - 16, 0), 1), P(...at(-back - 2, 4), 1)], c: hd, m, line: 0.6 });
    out.push({ p: [P(...at(E - 4, -5), 1), P(...at(E + 8, -7)), P(...at(E + 12, -22), 1), P(...at(E + 18, -7)), P(...at(E + B * 0.6, -6)), P(...at(E + B, -2), 1),
      P(...at(E + B * 0.8, 9)), P(...at(E + B * 0.48, 16)), P(...at(E + B * 0.18, 14)), P(...at(E + 2, 6)), P(...at(E - 4, 5), 1)], c: hd, m, gloss: 1.1,
      lines: [{ p: [at(E + 6, 10), at(E + B * 0.3, 13), at(E + B * 0.62, 11), at(E + B * 0.9, 3)], w: 1.3, light: true, a: 0.9 }, { p: [at(E + 4, 0), at(E + B * 0.7, 0)], w: 1.1, a: 0.4 }] });
    out.push({ p: tube([[...at(E - 10, 0), 11], [...at(E - 1, 0), 11]], { flat0: true, flat1: true }), c: o.ring || GOLD, m: 'gold', line: 0.7 });
    return out;
  }
  /** Кнут: рукоять в кулаке, плеть змеится вниз и вперёд по земле. */
  function whip(hand, pts, o) {
    o = o || {}; const lash = [[hand[0], hand[1], 5], ...pts];
    const out = [{ p: tube(lash), c: o.c || '#3a2418', m: 'leather', line: 0.7, lines: [{ p: lash.map(q => [q[0], q[1] - q[2] * 0.2]), w: 0.8, light: true, a: 0.4 }] },
      { p: tube([[hand[0] - 4, hand[1] + 10, 7], [hand[0] + 3, hand[1] - 10, 7]]), c: o.grip || '#5a3a22', m: 'leather', line: 0.8 }];
    if (o.fire) { const e = pts[pts.length - 1]; out.push(...fire([e[0], e[1]], -Math.PI / 2 - 0.3, 26, 16, o.fire, { n: 3, line: 0.5 })); }
    return out;
  }
  /** Ятаган: клинок расширяется к концу и загибается назад. */
  function scimitar(hand, dir, len, o) {
    o = o || {}; const at = K.along(hand, dir), G = 8, bend = t => -len * 0.17 * t * t;
    const pts = [];
    for (const t of [0, 0.3, 0.6, 0.85]) pts.push(P(...at(G + len * t, bend(t) + 3.5 + t * 3)));
    pts.push(P(...at(G + len, bend(1) - 2), 1));
    for (const t of [0.8, 0.5, 0.2, 0]) pts.push(P(...at(G + len * t, bend(t) - 4 - t * 4)));
    return [
      { p: [at(-2, -3), at(-2, 3), at(-16, 2.6), at(-16, -2.6)], c: '#3a2418', m: 'leather' },
      { e: [...at(-18, 0), 4.2, 4.2], c: GOLD, m: 'gold' },
      { p: pts, c: o.blade || '#dfe4ea', m: 'steel', gloss: 1.2, lines: [{ p: [0.1, 0.4, 0.7, 0.9].map(t => at(G + len * t, bend(t) - 1 - t * 2)), w: 1, light: true, a: 0.9 }] },
      { p: [P(...at(G - 2.5, -12), 1), P(...at(G + 2, -11), 1), P(...at(G + 2, 11), 1), P(...at(G - 2.5, 12), 1)], c: GOLD, m: 'gold' },
    ];
  }

  /* ================= 4. Демон / рогатый демон ================= */
  // Мускулистый громила, сутулый: голова ниже плеч, тяжёлые когтистые руки, светлая грудь, набедренная повязка.
  function demon(name, o) {
    const sk = o.skin, far = tone(sk, -0.25);
    const parts = [
      { kind: 'leg', side: -1, pivot: [88, 170], shapes: dLeg([88, 172], [82, 246], { c: far, tw: 30, kx: 16 }) },
      { kind: 'leg', side: 1, pivot: [114, 170], shapes: dLeg([114, 172], [118, 246], { c: sk, tw: 32, kx: 16 }) },
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...(o.tail ? tail([[80, 164, 12], [54, 178, 9], [38, 168, 6], [30, 148, 4]], far, { spade: 8 }) : []),
        ...mArm([78, 96], [64, 130], [70, 166], { c: far, w: 19, band: o.band, bandM: o.bandM }),
        ...chest({ c: sk, belly: o.belly, cloth: o.cloth, belt: o.belt, buckle: o.buckle }),
        { e: [78, 100, 16, 15], c: far, m: 'skin', line: 0.8 },
      ] },
      { kind: 'head', pivot: [110, 82], shapes: dHead(116, 62, 23, { skin: sk, eye: o.eye, horns: o.horns, hornC: o.hornC, hornK: o.hornK || 1, jaw: 1.08 }) },
      { kind: 'prop', pivot: [130, 94], shapes: [
        { e: [132, 98, 21, 19], c: sk, m: 'skin', line: 0.8 },
        ...mArm([132, 98], [156, 126], [176, 106], { c: sk, w: 19, band: o.band, bandM: o.bandM, clawBend: -0.2 }),
      ] },
    ];
    V.def(name, place(name, parts, o.size || 1.0));
  }
  demon('demon', { skin: '#c03428', belly: '#e88a5a', cloth: '#5a2a1a', belt: '#3a2418', eye: '#ffd23a', horns: 'short', hornC: '#3a2622' });
  demon('horned_demon', { skin: '#8a1a22', belly: '#b84a44', cloth: '#1e1616', belt: '#2a1a14', buckle: '#c0c6ce', eye: '#ffe25a', horns: 'ram', hornC: '#e8d8b0', hornK: 1.35,
    band: GOLD, bandM: 'gold', tail: true });

  /* ================= 5. Порождение ада / владыка бездны ================= */
  // Рослый демон в стальных наплечниках и наручах, за спиной кожистые крылья (не летает), в руке кнут.
  function fiend(name, o) {
    const sk = o.skin, far = tone(sk, -0.25);
    const wings = [
      ...wing.bat([92, 100], [0.05, -1], 92, { mem: tone(o.mem, -0.12), bone: tone(sk, -0.3), claw: CLAW }),
      ...wing.bat([96, 98], [-0.5, -1], 96, { mem: o.mem, bone: far, claw: CLAW }),
    ];
    const weaponS = o.glaive
      ? glaive([150, 136], [0.2, -1], 130, { back: 92, bladeLen: 64, head: '#c8ced6', ring: o.metal, shaft: '#2a1a14' })
      : whip([152, 144], [[166, 170, 4], [180, 204, 3.4], [174, 230, 2.8], [190, 244, 2.4], [216, 240, 2], [228, 224, 1.4]], { fire: o.whipFire });
    const parts = [
      { kind: 'leg', side: -1, pivot: [88, 170], shapes: dLeg([88, 172], [84, 246], { c: far, tw: 28, foot: 'hoof' }) },
      { kind: 'leg', side: 1, pivot: [112, 170], shapes: dLeg([112, 172], [116, 246], { c: sk, tw: 30, foot: 'hoof' }) },
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...wings,
        ...tail([[80, 168, 11], [56, 190, 8], [44, 214, 6], [56, 236, 4], [76, 238, 3]], far, { spade: 9 }),
        ...mArm([78, 96], [68, 130], [80, 160], { c: far, w: 17, band: o.metal, bandM: o.metalM }),
        ...chest({ c: sk, belly: o.belly, cloth: o.cloth, belt: '#2a1a14', buckle: o.metal }),
        ...pauldron(74, 96, 16, tone(o.metal, -0.2), o.metalM, false),
      ] },
      { kind: 'head', pivot: [106, 76], shapes: dHead(112, 52, 23, { skin: sk, eye: o.eye, horns: o.horns, hornC: o.hornC, hornK: o.hornK || 1 }) },
      { kind: 'prop', pivot: [128, 92], shapes: [
        ...(o.glaive ? weaponS : []),
        ...mArm([128, 94], [146, 124], [150, 140], { c: sk, w: 17, band: o.metal, bandM: o.metalM, claw: false }),
        ...(o.glaive ? [] : weaponS),
        ...pauldron(132, 92, 19, o.metal, o.metalM),
      ] },
    ];
    V.def(name, place(name, parts, o.size || 1.0));
  }
  fiend('pit_fiend', { skin: '#b83028', belly: '#e07a50', mem: '#5a1a1a', cloth: '#3a2a22', metal: '#9aa2ac', metalM: 'steel', eye: '#ffd23a', horns: 'long', hornC: '#3a2622' });
  fiend('pit_lord', { skin: '#3a2a2e', belly: '#6a3a38', mem: '#7a1a1a', cloth: '#8a1a1a', metal: '#e0b048', metalM: 'gold', eye: '#ff6a2a', horns: 'sweep', hornC: '#e8d8b0', hornK: 1.15, glaive: true });

  /* ================= 6. Ифрит / султан ифритов ================= */
  // Огненный торс, пламя вместо волос, ноги переходят в языки пламени; золотые браслеты, ятаган.
  function efreet(name, o) {
    const sk = o.skin, far = tone(sk, -0.22), F = o.fire;
    // нижняя половина — вихрь пламени: три слоя-трубки и языки, срывающиеся назад
    const tailPts = k => [[104, 150, 60 * k], [100, 180, 50 * k], [104, 208, 36 * k], [118, 230, 20 * k], [140, 242, 6 * k]];
    const flameLow = [
      ...fire([86, 196], Math.PI * 0.86, 56, 30, F, { n: 3, spread: 0.5 }),
      ...fire([98, 226], Math.PI * 0.9, 50, 24, F, { n: 3, spread: 0.5 }),
      { p: tube(tailPts(1)), c: F.out, m: 'flat', line: 0.7, lc: F.edge },
      { p: tube(tailPts(0.66).map((q, i) => [q[0] + 4, q[1] - 2 + i, q[2]])), c: F.mid, m: 'flat', line: 0 },
      { p: tube(tailPts(0.34).map((q, i) => [q[0] + 6, q[1] - 6 + i, q[2]])), c: F.core, m: 'flat', line: 0 },
      ...glow(126, 244, 22, o.rgb, 0.3),
    ];
    const parts = [
      { kind: 'legs', pivot: [100, 160], shapes: flameLow },
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...mArm([78, 96], [60, 124], [66, 150], { c: far, w: 16, band: GOLD, bandM: 'gold', claw: false }),
        ...chest({ c: sk, belly: o.belly, belt: GOLD, buckle: o.gem }),
        { p: [[74, 160], [130, 160], [126, 176], [104, 170], [78, 176]], c: o.sash, m: 'cloth', line: 0.8 },
      ] },
      { kind: 'head', pivot: [106, 76], shapes: [
        ...fire([100, 36], -Math.PI / 2 - 0.35, 50 * (o.crest || 1), 34, F, { n: 4, spread: 0.7, curl: 1.2 }),
        ...dHead(112, 50, 24, { skin: sk, eye: o.eye, mouth: 'grin', brow: tone(sk, -0.45) }),
        ...(o.crown ? K.helm.crown(110, 48, 24, { c: GOLD }) : []),
      ] },
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...scimitar([150, 68], [0.34, -1], 84, { blade: o.blade }),
        ...mArm([128, 94], [152, 98], [150, 72], { c: sk, w: 16, band: GOLD, bandM: 'gold', claw: false }),
        { e: [130, 96, 17, 15], c: sk, m: 'skin', line: 0.8 },
      ] },
    ];
    V.def(name, place(name, parts, o.size || 1.0));
  }
  efreet('efreet', { skin: '#d84a2a', belly: '#f49a58', sash: '#8a1a14', gem: '#ff3a2a', eye: '#fff07a', fire: FIRE, rgb: '255,140,40', blade: '#e0e4ea' });
  efreet('efreet_sultan', { skin: '#3a6ad8', belly: '#7ab0f0', sash: '#1a2a6a', gem: '#e8303a', eye: '#ffffff', fire: BLUE, rgb: '120,190,255', blade: '#f0d890', crown: true, crest: 1.25 });

  /* ================= 7. Дьявол / архидьявол ================= */
  // Высокий, широкие перепончатые крылья, длинные рога, козлиные ноги с копытами, хвост, глефа.
  function devil(name, o) {
    const sk = o.skin, far = tone(sk, -0.25);
    const parts = [
      { kind: 'prop', pivot: [92, 96], shapes: wing.bat([92, 96], [-0.12, -1], 150, { mem: tone(o.mem, -0.15), bone: tone(sk, -0.35), claw: CLAW }) },
      { kind: 'prop', pivot: [88, 100], shapes: wing.bat([88, 100], [-0.95, -0.42], 150, { mem: o.mem, bone: far, claw: CLAW }) },
      { kind: 'leg', side: -1, pivot: [90, 170], shapes: dLeg([90, 172], [86, 246], { c: far, tw: 26, foot: 'hoof', fur: tone(o.fur, -0.2) }) },
      { kind: 'leg', side: 1, pivot: [112, 170], shapes: dLeg([112, 172], [116, 246], { c: sk, tw: 28, foot: 'hoof', fur: o.fur }) },
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...tail([[82, 166, 10], [58, 188, 8], [40, 208, 6], [34, 232, 4], [48, 240, 3]], far, { spade: 10 }),
        ...mArm([78, 96], [66, 128], [78, 156], { c: far, w: 16 }),
        ...chest({ c: sk, belly: o.belly, cloth: o.cloth, belt: '#1e1414', buckle: o.buckle || GOLD }),
        { e: [76, 98, 17, 16], c: far, m: 'skin', line: 0.8 },
      ] },
      { kind: 'head', pivot: [106, 76], shapes: [...dHead(112, 52, 22, { skin: sk, eye: o.eye, horns: o.horns, hornC: o.hornC, hornK: o.hornK || 1.1, mouth: 'grin' }), ...(o.extraHead || [])] },
      // летун: крылья машут, поэтому рука с глефой — отдельный слой, движется вместе с корпусом
      { kind: 'torso', pivot: [100, 150], shapes: [
        ...glaive([152, 134], [0.16, -1], 138, { back: 100, bladeLen: 54, head: o.blade, headM: o.bladeM, shaft: o.shaft, ring: o.ring, fire: o.bladeFire }),
        ...mArm([128, 94], [148, 122], [152, 136], { c: sk, w: 16, claw: false }),
        { e: [130, 97, 17, 16], c: sk, m: 'skin', line: 0.8 },
      ] },
    ];
    V.def(name, place(name, parts, o.size || 0.9));
  }
  devil('devil', { skin: '#b82a26', belly: '#e0745a', mem: '#6a1414', fur: '#3a1e1a', cloth: '#2a1616', eye: '#ffd23a', horns: 'long', hornC: '#2e2220', blade: '#c8ced6', shaft: '#3a2418', ring: '#8a8f98' });
  devil('arch_devil', { skin: '#3a2a30', belly: '#6a4048', mem: '#a01c1c', fur: '#141012', cloth: '#8a1414', eye: '#ff5a2a', horns: 'sweep', hornC: '#e0c070', hornK: 1.15, blade: '#e8c060', bladeM: 'gold', shaft: '#1a1012', ring: '#e8c060', bladeFire: FIRE });
})(typeof window !== 'undefined' ? window : globalThis);
