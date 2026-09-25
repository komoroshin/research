/* ============================================================================
   view/vec_hive.js — Улей на рисованном конвейере.
   Личинка, рабочий, плевун, оса-воин, богомол, жук-таран, матка и их улучшения.
   Краски фракции — зелёный и янтарный хитин, воск, кислотно-жёлтое.
   Хитин — блестящий (gem / horn с gloss), брюшко делится на сегменты полосами,
   ноги насекомых — тонкие трубки с изломом (колено выше тазика), глаза фасеточные.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   с другой гаммой и своей деталью (шипы, соты, наросты, крепостной гребень, корона).
   Рисуем прямо в рамке старого спрайта (K.frameOf) и вписываем place().
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, ell, lerp, wing, fit, frameOf, tone } = K;

  /* ---------- общие помощники ---------- */
  /** Вписать существо, нарисованное в своей рамке (ground — точка опоры), в рамку старого спрайта. */
  function place(name, parts, ground, size) {
    const to = frameOf(name) || { w: ground[0] * 2, h: ground[1] + 4, anchor: ground };
    return fit(parts, { ground, height: ground[1] }, to, to.anchor[1] / ground[1] * (size || 1));
  }
  /** Локальные оси тела: u — вдоль (к голове), v — поперёк (вниз при a = 0). */
  const axes = (cx, cy, a) => { const c = Math.cos(a), s = Math.sin(a); return (u, v) => [cx + c * u - s * v, cy + s * u + c * v]; };
  /**
   * Сегментированное тело (брюшко, грудь, личинка): эллипс по оси a, поперёк — дуги-сегменты.
   * o: { c, m, gloss, belly, n (сегментов), stripes: [цвет, …] — чередующиеся полосы, band — толщина шва, tip — сегменты чаще к концу, id }
   */
  function segBody(cx, cy, rx, ry, a, o) {
    const T = axes(cx, cy, a), n = o.n || 5, out = { p: ell(cx, cy, rx, ry, 16, a), c: o.c, m: o.m || 'gem', gloss: o.gloss === undefined ? 0.8 : o.gloss, belly: o.belly === undefined ? 0.35 : o.belly, lines: [], id: o.id, line: o.line };
    const h = u => ry * Math.sqrt(Math.max(0, 1 - (u / rx) * (u / rx)));
    const at = i => { const t = i / n; return -rx + 2 * rx * (o.tip ? Math.pow(t, 0.8) : t); };   // от хвоста (−rx) к голове (+rx)
    if (o.stripes) {
      out.sub = [];
      for (let i = 0; i < n; i++) {
        const u0 = at(i), u1 = at(i + 1), c = o.stripes[i % o.stripes.length]; if (!c) continue;
        const b = (u1 - u0) * 0.25;
        out.sub.push({ p: [T(u0, -ry * 1.3), T(u1, -ry * 1.3), T(u1 + b, 0), T(u1, ry * 1.3), T(u0, ry * 1.3), T(u0 + b, 0)], c, m: o.m || 'gem', line: 0, gloss: 0 });
      }
    }
    for (let i = 1; i < n; i++) {
      const u = at(i), hh = h(u) * 0.99, b = (2 * rx / n) * 0.22;
      out.lines.push({ p: [T(u, -hh), T(u + b * 0.8, -hh * 0.5), T(u + b, 0), T(u + b * 0.8, hh * 0.5), T(u, hh)], w: o.band || 1.6, a: 0.75 });
      out.lines.push({ p: [T(u - 2.4, -hh * 0.92), T(u + b * 0.8 - 2.4, -hh * 0.45), T(u + b - 2.4, 0)], w: 1, light: true, a: 0.45 });
    }
    if (o.ridge !== false) out.lines.push({ p: [T(-rx * 0.8, -ry * 0.55), T(0, -ry * 0.78), T(rx * 0.8, -ry * 0.55)], w: 1.4, light: true, a: 0.5 });
    return out;
  }
  /**
   * Нога насекомого: тазик hip → колено knee (выше или вровень) → голень до ank → лапка до toe.
   * w — толщина бедра; o: { m, spur — цвет шпор на голени, claw }
   */
  function iLeg(hip, knee, ank, toe, w, c, o) {
    o = o || {};
    const m = o.m || 'horn', cD = tone(c, -0.12), cT = tone(c, -0.22);
    const out = [
      { p: tube([[hip[0], hip[1], w], [...lerp(hip, knee, 0.55), w * 1.05], [knee[0], knee[1], w * 0.72]], { flat0: true }), c, m, gloss: 1, line: 0.8,
        lines: [{ p: [lerp(hip, knee, 0.2), lerp(hip, knee, 0.8)], w: 1, light: true, a: 0.5 }] },
      { p: tube([[knee[0], knee[1], w * 0.6], [...lerp(knee, ank, 0.5), w * 0.5], [ank[0], ank[1], w * 0.36]]), c: cD, m, gloss: 0.9, line: 0.8 },
    ];
    if (o.spur) for (const t of [0.3, 0.55, 0.8]) {   // шпоры по голени, назад-вниз
      const q = lerp(knee, ank, t), [dx, dy] = norm(ank[0] - knee[0], ank[1] - knee[1]), s = toe[0] > ank[0] ? -1 : 1, nx = -dy * s, ny = dx * s;
      const hw = w * 0.22;
      out.push({ p: [P(q[0] - dx * hw, q[1] - dy * hw, 1), P(q[0] + nx * w * 0.55 + dx * w * 0.1, q[1] + ny * w * 0.55 + dy * w * 0.1, 1), P(q[0] + dx * hw, q[1] + dy * hw, 1)], c: o.spur, m: 'horn', line: 0.5 });
    }
    // лапка из двух члеников и коготок
    const mid = lerp(ank, toe, 0.5);
    out.push({ p: tube([[ank[0], ank[1], w * 0.34], [mid[0], mid[1], w * 0.3]]), c: cT, m, line: 0.6 });
    out.push({ p: tube([[mid[0], mid[1], w * 0.28], [toe[0], toe[1], w * 0.22]]), c: cT, m, line: 0.6 });
    const s = toe[0] >= ank[0] ? 1 : -1;
    out.push({ p: [P(toe[0] - 1 * s, toe[1] - w * 0.14, 1), P(toe[0] + w * 0.5 * s, toe[1] + 1, 1), P(toe[0] + 1 * s, toe[1] + 1.6, 1)], c: o.claw || '#1e1a12', m: 'horn', line: 0.4 });
    out.push({ e: [knee[0], knee[1], w * 0.46, w * 0.42], c: tone(c, 0.08), m: 'gem', gloss: 0.9, line: 0.7 });
    return out;
  }
  /** Фасеточный глаз: гладкий блестящий эллипс с сеткой фасеток и бликом. */
  const cEye = (cx, cy, rx, ry, c, a) => ({ p: ell(cx, cy, rx, ry, 12, a || 0), c, m: 'gem', gloss: 1.2, tex: 'scale', texSize: Math.max(0.14, Math.min(rx, ry) / 40), line: 0.9, lc: '#140c06',
    lines: [{ p: [[cx - rx * 0.55, cy + ry * 0.45], [cx + rx * 0.1, cy + ry * 0.72], [cx + rx * 0.62, cy + ry * 0.4]], w: 1, light: true, a: 0.35 }],
    glint: [[cx - rx * 0.28, cy - ry * 0.38, Math.min(rx, ry) * 0.42], [cx + rx * 0.3, cy + ry * 0.3, Math.min(rx, ry) * 0.16]] });
  /** Коленчатый усик: основание, колено, кончик; на кончике булава. */
  function antenna(b, k, t, c, w) {
    w = w || 3;
    return [{ p: tube([[b[0], b[1], w * 1.2], [k[0], k[1], w], [...lerp(k, t, 0.5), w * 0.85], [t[0], t[1], w * 0.8]]), c, m: 'horn', gloss: 0.7, line: 0.6 },
      { p: ell(t[0], t[1], w * 1.1, w * 0.8, 8, Math.atan2(t[1] - k[1], t[0] - k[0])), c: tone(c, -0.1), m: 'horn', line: 0.6 }];
  }
  /** Жвало-серп из основания B по углу ang (вперёд = 0), длина L; зубцы по внутреннему краю; low — нижнее (изгиб вверх). */
  function mandible(B, ang, L, c, low) {
    const T = axes(B[0], B[1], ang), s = low ? -1 : 1, w = L * 0.3;
    return { p: [T(-L * 0.1, -w * 0.55 * s), T(L * 0.45, -w * 0.6 * s), T(L * 0.85, -w * 0.2 * s), P(...T(L * 1.02, w * 0.55 * s), 1), T(L * 0.8, w * 0.1 * s), P(...T(L * 0.68, w * 0.32 * s), 1), T(L * 0.56, w * 0.12 * s), P(...T(L * 0.42, w * 0.4 * s), 1), T(L * 0.26, w * 0.3 * s), T(-L * 0.08, w * 0.5 * s)],
      c, m: 'horn', gloss: 1.1, line: 0.8, lines: [{ p: [T(L * 0.05, -w * 0.25 * s), T(L * 0.5, -w * 0.3 * s), T(L * 0.8, -w * 0.05 * s)], w: 1, light: true, a: 0.6 }] };
  }
  /** Шипы вдоль линии pts: side 1 — слева от хода (при ходе вправо — вверх), −1 — справа. */
  function spikes(pts, n, h, c, side, m) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, k = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j;
      const a = pts[j], b = pts[j + 1], p = lerp(a, b, f), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = ty * (side || -1), ny = -tx * (side || -1);
      const hh = h * (1 - Math.abs(t - 0.45) * 0.8), w = h * 0.42;
      out.push({ p: [P(p[0] - tx * w, p[1] - ty * w, 1), P(p[0] + nx * hh - tx * w * 0.7, p[1] + ny * hh - ty * w * 0.7, 1), P(p[0] + tx * w, p[1] + ty * w, 1)], c, m: m || 'horn', gloss: 1, line: 0.6 });
    }
    return out;
  }
  /** Капля (кислота, яд): круглая снизу, острая сверху. */
  const drop = (x, y, r, c) => ({ p: [P(x, y - r * 2, 1), [x + r, y - r * 0.2], [x + r * 0.7, y + r * 0.8], [x - r * 0.7, y + r * 0.8], [x - r, y - r * 0.2]], c, m: 'gem', gloss: 1.2, line: 0.6, glint: [[x - r * 0.3, y - r * 0.2, r * 0.45]] });
  /** Увеличить формы вокруг точки (cx, cy). */
  const scaleAt = (list, cx, cy, k) => K.mapShapes(list, (x, y) => [cx + (x - cx) * k, cy + (y - cy) * k], k);
  /** Ноги по схеме «треножник»: ближние перед и зад в одной фазе со средней дальней. */
  const legPart = (side, hip, shapes) => ({ kind: 'leg', side, pivot: hip, shapes });

  /* =================== личинка / кровавая личинка =================== */
  function larva(name, o) {
    const G = 137, c = o.flesh, cD = tone(c, -0.25);
    // сегменты от хвоста к голове: каждый следующий перекрывает предыдущий
    const segs = [[22, 11, 13], [40, 15, 19], [60, 18, 25], [82, 19, 30], [105, 19, 33], [127, 18, 33], [147, 16, 29]];
    const bodyS = [];
    segs.forEach(([x, rx, ry], i) => {
      const cy = G - 12 - ry + i * 0.4;
      bodyS.push({ p: ell(x, cy, rx + 3, ry, 14, -0.08), c: i % 2 ? c : tone(c, -0.06), m: 'skin', gloss: 1.1, belly: 0.4, rim: 0.8, line: 0.9,
        lines: [{ p: [[x - rx * 0.5, cy - ry * 0.72], [x + rx * 0.4, cy - ry * 0.82]], w: 1.4, light: true, a: 0.6 },
          { p: [[x - rx * 0.2, cy + ry * 0.2], [x + rx * 0.1, cy + ry * 0.24]], w: 2.4, c: tone(c, -0.6), a: 0.8 }] });   // дыхальце
      if (o.pustule && i > 0 && i < 6) bodyS.push({ e: [x + 2, cy - ry * 0.35, 4.2, 3.6], c: o.pustule, m: 'gem', gloss: 1.2, line: 0.5, glint: [[x + 1, cy - ry * 0.45, 1.6]] });
    });
    if (o.spikes) bodyS.push(...spikes(segs.slice(1).map(([x, , ry], i) => [x, G - 12 - ry * 2 + (i + 1) * 0.4 + 4]), 6, 14, o.spikes, 1));
    // ложноножки: две группы в разной фазе — тело «перетекает»
    const pro = k => segs.filter((s, i) => i % 2 === k && i > 0).map(([x]) => ({ p: ell(x + 2, G - 9, 7.5, 8, 10), c: cD, m: 'skin', gloss: 0.8, line: 0.8,
      lines: [{ p: [[x - 3, G - 3], [x + 7, G - 3]], w: 1.2, a: 0.6 }] }));
    const hx = 172, hy = 92;
    const headS = scaleAt([
      ...antenna([hx + 2, hy - 16], [hx + 8, hy - 30], [hx + 20, hy - 36], o.head, 2.6),
      mandible([hx + 14, hy + 12], 0.55, 18, tone(o.head, -0.3), true),
      { p: ell(hx, hy, 22, 20, 14, 0.1), c: o.head, m: 'gem', gloss: 1.1, id: 'capsule',
        lines: [{ p: [[hx - 12, hy - 12], [hx + 2, hy - 18], [hx + 14, hy - 12]], w: 1.4, light: true, a: 0.6 }, { p: [[hx - 4, hy - 19], [hx - 2, hy + 4]], w: 1.2, a: 0.5 }] },
      cEye(hx + 9, hy - 3, 6.5, 5.5, o.eye, 0.2),
      { e: [hx + 1, hy - 9, 2.4, 2.2], c: o.eye, m: 'gem', line: 0.5 },
      mandible([hx + 14, hy + 8], 0.2, 20, tone(o.head, -0.2), false),
    ], hx, hy, 1.2);
    const parts = [
      legPart(-1, [100, G - 10], pro(0)),
      legPart(1, [100, G - 10], pro(1)),
      { kind: 'torso', pivot: [100, G - 30], shapes: bodyS },
      { kind: 'head', pivot: [150, 100], shapes: headS },
    ];
    V.def(name, place(name, parts, [100, G], o.size));
  }
  larva('larva', { flesh: '#b8d06a', head: '#6a8a2a', eye: '#d8402a' });
  larva('blood_larva', { flesh: '#c84a4e', head: '#4a1a22', eye: '#f0d030', spikes: '#3a1418', pustule: '#ff9a3a', size: 1.04 });

  /* =================== рабочий / строитель =================== */
  function worker(name, o) {
    const G = 227, c = o.chitin, cD = tone(c, -0.28), cL = tone(c, 0.15);
    // стоит на задней паре: колено вперёд, лапка по земле
    const legS = (dx, col) => iLeg([96 + dx, 146], [116 + dx, 178], [98 + dx, 214], [120 + dx, G - 3], 15, col, { spur: tone(col, -0.3) });
    // брюшко-галер позади, стебелёк, грудь торчком
    const gaster = segBody(62, 160, 38, 30, 0.55, { c: o.gaster || c, n: 4, id: 'gaster' });
    const load = o.load === 'comb' ? comb(o) : logs(o);
    const bodyS = [
      ...load.back,
      // дальняя средняя лапа-рука: держит ношу снизу
      ...iLeg([100, 116], [86, 128], [70, 118], [60, 108], 9, cD, {}),
      gaster,
      { p: ell(92, 136, 10, 9, 10), c: cD, m: 'gem', gloss: 0.9 },   // стебелёк
      { p: [[88, 142], [86, 118], [96, 96], [112, 80], [126, 84], [124, 104], [114, 126], [104, 146]], c, m: 'gem', gloss: 0.9, belly: 0.3, id: 'thorax',
        lines: [{ p: [[94, 112], [108, 106], [120, 100]], w: 1.5, a: 0.6 }, { p: [[92, 130], [106, 124], [116, 118]], w: 1.5, a: 0.6 }, { p: [[96, 104], [108, 88], [118, 84]], w: 1.2, light: true, a: 0.5 }] },
      ...(o.plates ? [{ p: [[92, 108], [104, 88], [120, 82], [124, 94], [112, 104], [98, 116]], c: o.plates, m: 'gem', gloss: 1.1, line: 0.7 }] : []),
    ];
    const hx = 136, hy = 60;
    const headS = [
      ...antenna([hx + 4, hy - 16], [hx + 2, hy - 42], [hx + 30, hy - 50], cD, 3),
      mandible([hx + 16, hy + 14], 0.35, 26, tone(c, -0.35), true),
      { p: [[hx - 22, hy + 4], [hx - 18, hy - 16], [hx - 2, hy - 24], [hx + 16, hy - 20], [hx + 24, hy - 4], [hx + 22, hy + 14], [hx + 8, hy + 22], [hx - 10, hy + 20]], c, m: 'gem', gloss: 1, id: 'head',
        lines: [{ p: [[hx - 12, hy - 14], [hx + 2, hy - 20], [hx + 14, hy - 16]], w: 1.4, light: true, a: 0.6 }] },
      ...(o.crest ? [{ p: [[hx - 20, hy - 8], [hx - 14, hy - 26], [hx + 2, hy - 34], [hx + 14, hy - 26], [hx + 4, hy - 20], [hx - 10, hy - 14]], c: o.crest, m: 'gem', gloss: 1.2, line: 0.8 }] : []),
      cEye(hx + 8, hy - 5, 7.5, 6.5, o.eye, 0.2),
      mandible([hx + 14, hy + 10], -0.05, 28, tone(c, -0.2), false),
    ];
    const hand = [152, 112];
    const armS = [
      ...tool(hand, o),
      ...iLeg([116, 100], [134, 128], hand, [hand[0] + 4, hand[1] - 8], 11, c, {}),
    ];
    const parts = [
      legPart(-1, [96, 150], legS(-8, cD)),
      legPart(1, [100, 150], legS(4, c)),
      { kind: 'torso', pivot: [100, 140], shapes: bodyS },
      { kind: 'head', pivot: [124, 76], shapes: headS },
      { kind: 'prop', pivot: [116, 100], shapes: armS },
    ];
    V.def(name, place(name, parts, [103, G], o.size));
  }
  /** Орудие в ближней лапе: кирка (рабочий) или восковая лопатка (строитель). */
  function tool(hand, o) {
    const d = norm(0.35, -1), at = (t, w) => [hand[0] + d[0] * t - d[1] * w, hand[1] + d[1] * t + d[0] * w];
    const out = [{ p: tube([[...at(-26, 0), 6], [...at(62, 0), 5]]), c: o.wood || '#8a5a30', m: 'wood', flow: Math.atan2(d[1], d[0]), line: 0.8 }];
    if (o.tool === 'trowel') out.push({ p: [P(...at(58, -3), 1), P(...at(64, -16)), P(...at(92, -14)), P(...at(100, 0), 1), P(...at(92, 14)), P(...at(64, 16)), P(...at(58, 3), 1)], c: o.wax, m: 'gem', gloss: 1, line: 0.8,
      sub: [{ p: [at(62, -18), at(96, -18), at(96, -6), at(62, -6)], c: o.honey, m: 'gem', line: 0 }], lines: [{ p: [at(64, 0), at(94, 0)], w: 1, light: true, a: 0.6 }] });
    else out.push({ p: [P(...at(54, -4), 1), P(...at(60, -26)), P(...at(52, -46), 1), P(...at(66, -30)), P(...at(70, 0)), P(...at(66, 26)), P(...at(52, 40), 1), P(...at(60, 22)), P(...at(54, 4), 1)], c: o.stone || '#8a8a7a', m: 'horn', gloss: 0.8, line: 0.8,
      lines: [{ p: [at(64, -24), at(68, 0), at(64, 22)], w: 1, light: true, a: 0.6 }] },
      { p: tube([[...at(52, -8), 5], [...at(58, 8), 5]]), c: o.strap || '#5a3a1e', m: 'leather', line: 0.5 });
    return out;
  }
  /** Вязанка веток за спиной, на ремне. */
  function logs(o) {
    const back = [];
    const L = [[30, 104, 124, 34, 13], [26, 118, 122, 48, 12], [40, 96, 132, 30, 11]];
    for (const [x0, y0, x1, y1, w] of L) back.push({ p: tube([[x0, y0, w], [x1, y1, w * 0.9]]), c: o.wood, m: 'wood', flow: Math.atan2(y1 - y0, x1 - x0), line: 0.8,
      sub: [{ e: [x1, y1, w * 0.4, w * 0.4], c: tone(o.wood, 0.3), m: 'wood', line: 0.5 }] });
    back.push({ p: tube([[70, 64, 5], [84, 94, 5]]), c: o.strap, m: 'leather', line: 0.6 }, { p: tube([[50, 80, 5], [62, 108, 5]]), c: o.strap, m: 'leather', line: 0.6 });
    return { back };
  }
  /** Восковой сот на плече: шестигранные ячейки, мёд в некоторых. */
  function comb(o) {
    const cx = 62, cy = 84, k = 0.74, back = [];
    back.push({ p: [[-48, 34], [-44, -16], [-10, -44], [40, -40], [54, -4], [30, 40], [-14, 52]].map(([x, y]) => [cx + x * k, cy + y * k]), c: o.wax, m: 'gem', gloss: 0.6, line: 1, id: 'comb',
      sub: (() => { const s = []; const R = 7; for (let r = -6; r <= 6; r++) for (let q = -6; q <= 6; q++) {
        const x = cx + q * R * 1.74 + (r % 2 ? R * 0.87 : 0), y = cy + r * R * 1.5, pts = [];
        for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; pts.push(P(x + Math.cos(a) * R * 0.78, y + Math.sin(a) * R * 0.78, 1)); }
        if (Math.hypot(x - cx - 2, (y - cy - 4) * 0.95) > 44) continue;   // за краем пластины — не нужна
        s.push({ p: pts, c: (q * 7 + r * 3 + 40) % 5 === 0 ? o.honey : tone(o.wax, -0.18), m: 'gem', gloss: 0.8, line: 0.5 });
      } return s; })() });
    return { back };
  }
  worker('worker', { chitin: '#5a8e2c', eye: '#e8a020', wood: '#8a5a30', strap: '#5a3a1e', stone: '#9a9484' });
  worker('builder', { chitin: '#c8902a', gaster: '#b07a22', eye: '#3a2008', load: 'comb', tool: 'trowel', wood: '#6a4424', wax: '#f0dc94', honey: '#e8a020', plates: '#f0d890', crest: '#f0d890' });

  /* =================== плевун / кислотный плевун =================== */
  function spitter(name, o) {
    const G = 197, c = o.chitin, cD = tone(c, -0.3);
    const legs = [
      // дальние: перед, середина, зад (колено выше тазика — ноги расставлены, как у паука)
      legPart(-1, [170, 140], iLeg([170, 140], [206, 116], [232, 160], [246, G - 3], 10, cD, { spur: tone(cD, -0.3) })),
      legPart(1, [150, 144], iLeg([150, 144], [160, 112], [180, 158], [186, G - 3], 10, cD, { spur: tone(cD, -0.3) })),
      legPart(-1, [132, 146], iLeg([132, 146], [104, 118], [84, 160], [70, G - 3], 10, cD, { spur: tone(cD, -0.3) })),
      // ближние
      legPart(1, [176, 148], iLeg([176, 148], [214, 126], [236, 170], [254, G - 3], 12, c, { spur: cD })),
      legPart(-1, [154, 152], iLeg([154, 152], [170, 124], [158, 168], [150, G - 3], 12, c, { spur: cD })),
      legPart(1, [136, 152], iLeg([136, 152], [110, 130], [96, 170], [82, G - 3], 12, c, { spur: cD })),
    ];
    // раздутое брюшко задрано вверх-назад; сквозь хитин светятся мешки с кислотой
    const T = axes(84, 94, -0.42), ab = segBody(84, 94, 72, 56, -0.42, { c, n: 6, id: 'abdomen', stripes: o.stripes });
    ab.sub = (ab.sub || []).concat([[-30, 16, 14], [2, 24, 16], [32, 18, 12], [-8, -8, 10]].map(([u, v, r]) => { const [x, y] = T(u, v); return { e: [x, y, r * 1.2, r], c: o.acid, m: 'gem', gloss: 1.1, line: 0.6, lc: tone(o.acid, -0.5), glint: [[x - r * 0.4, y - r * 0.4, r * 0.4]] }; }));
    const bodyS = [
      ab,
      ...(o.spines ? spikes([T(-58, -26), T(-20, -44), T(20, -46), T(54, -28)], 5, 16, o.spines, 1) : []),
      ...(o.drip ? [drop(...T(-64, 26), 4.5, o.acid), drop(...T(-50, 44), 3.5, o.acid)] : []),
      segBody(160, 132, 30, 24, 0.1, { c, n: 3, id: 'thorax' }),
    ];
    const hx = 202, hy = 120;
    const headS = [
      ...antenna([hx + 2, hy - 18], [hx + 14, hy - 40], [hx + 36, hy - 44], cD, 2.8),
      { p: [[hx - 20, hy + 6], [hx - 16, hy - 14], [hx, hy - 22], [hx + 18, hy - 16], [hx + 26, hy - 2], [hx + 22, hy + 16], [hx + 4, hy + 22], [hx - 14, hy + 18]], c, m: 'gem', gloss: 1, id: 'head' },
      cEye(hx + 6, hy - 6, 8, 7, o.eye, 0.2),
      // хоботок-сопло, из него летит кислота
      { p: tube([[hx + 16, hy + 8, 13], [hx + 32, hy + 4, 11], [hx + 44, hy - 2, 12]], { flat1: true }), c: cD, m: 'horn', gloss: 1, line: 0.8,
        lines: [{ p: [[hx + 24, hy - 2], [hx + 26, hy + 12]], w: 1.2, a: 0.6 }, { p: [[hx + 34, hy - 4], [hx + 36, hy + 9]], w: 1.2, a: 0.6 }] },
      { p: ell(hx + 44, hy - 2, 3, 6, 8, -0.4), c: o.acid, m: 'gem', gloss: 1, line: 0.5 },
      { p: ell(hx + 58, hy - 8, 7, 5.5, 10, -0.3), c: o.acid, m: 'gem', gloss: 1.2, line: 0.6, lc: tone(o.acid, -0.5), glint: [[hx + 56, hy - 10, 2.2]] },
      { p: ell(hx + 72, hy - 14, 4.6, 3.8, 8, -0.3), c: o.acid, m: 'gem', gloss: 1.2, line: 0.5, lc: tone(o.acid, -0.5) },
      { e: [hx + 82, hy - 19, 2.6, 2.4], c: o.acid, m: 'gem', line: 0.4, lc: tone(o.acid, -0.5) },
    ];
    const parts = [legs[0], legs[1], legs[2], legs[3], legs[4], legs[5],
      { kind: 'torso', pivot: [150, 140], shapes: bodyS },
      { kind: 'head', pivot: [184, 124], shapes: headS }];
    // ближние ноги поверх дальних, но под корпусом — порядок частей уже такой
    V.def(name, place(name, parts, [113, G], o.size));
  }
  spitter('spitter', { chitin: '#6a9a30', eye: '#e84a20', acid: '#e8e040' });
  spitter('acid_spitter', { chitin: '#c8c030', eye: '#2a6a10', acid: '#7aff5a', stripes: [null, '#8a8a1a'], spines: '#3a4a10', drip: true, size: 1.04 });

  /* =================== оса-воин / оса-опустошитель =================== */
  function wasp(name, o) {
    const G = 253, c = o.thorax, cD = tone(c, -0.3);
    const legs = [
      legPart(1, [132, 156], iLeg([132, 156], [104, 186], [104, 226], [92, G - 3], 9, cD, {})),
      legPart(-1, [148, 152], iLeg([148, 152], [170, 182], [160, 224], [176, G - 3], 9, cD, {})),
      legPart(-1, [136, 160], iLeg([136, 160], [112, 194], [118, 232], [106, G - 3], 11, o.legs, { spur: cD })),
      legPart(1, [152, 158], iLeg([152, 158], [178, 190], [170, 230], [188, G - 3], 11, o.legs, { spur: cD })),
    ];
    // полосатое брюшко вниз-назад, на конце жало
    const T = axes(84, 186, 2.35 - Math.PI);
    const ab = segBody(84, 186, 56, 30, 2.35 - Math.PI, { c: o.stripe1, n: 6, stripes: [o.stripe2, null], id: 'abdomen', band: 1.2 });
    const tip = T(-58, 0), sd = norm(tip[0] - 84, tip[1] - 186);
    const stingS = { p: [P(tip[0] + sd[1] * 6, tip[1] - sd[0] * 6, 1), P(tip[0] + sd[0] * 30, tip[1] + sd[1] * 30, 1), P(tip[0] - sd[1] * 6, tip[1] + sd[0] * 6, 1)], c: o.sting, m: 'horn', gloss: 1.2, line: 0.7 };
    const Wf = { mem: tone(o.wing, -0.15), vein: o.vein }, Wn = { mem: o.wing, vein: o.vein };
    const bodyS = [
      stingS, ab,
      { p: ell(122, 154, 9, 7, 10, 0.6), c: cD, m: 'gem', gloss: 0.9 },   // стебелёк
      segBody(148, 132, 28, 25, -0.5, { c, n: 3, id: 'thorax' }),
      ...(o.thornsT ? spikes([[128, 116], [146, 104], [164, 108]], 3, 12, o.thornsT, 1) : []),
      // дальняя передняя лапа держит древко снизу
      ...iLeg([160, 140], [182, 162], [198, 150], [206, 144], 8, cD, {}),
    ];
    const hx = 186, hy = 100;
    const headS = [
      ...antenna([hx - 2, hy - 18], [hx - 8, hy - 44], [hx + 18, hy - 62], '#1e1a14', 3),
      ...antenna([hx + 6, hy - 18], [hx + 8, hy - 46], [hx + 34, hy - 58], '#2a241c', 3),
      mandible([hx + 14, hy + 14], 0.7, o.jaw || 16, '#1e1a14', true),
      { p: [[hx - 20, hy + 2], [hx - 16, hy - 16], [hx, hy - 22], [hx + 18, hy - 16], [hx + 24, hy], [hx + 20, hy + 16], [hx + 6, hy + 24], [hx - 12, hy + 18]], c: o.face, m: 'gem', gloss: 1, id: 'head',
        sub: [{ p: [[hx + 4, hy - 4], [hx + 26, hy - 2], [hx + 24, hy + 20], [hx + 4, hy + 20]], c: o.stripe1, m: 'gem', line: 0 }] },
      cEye(hx + 2, hy - 4, 9, 12, o.eye, 0.35),
      mandible([hx + 14, hy + 12], 0.35, o.jaw || 18, '#2a2418', false),
    ];
    // копьё из жала: древко-хитин, зазубренный наконечник
    const hand = [206, 146], d = norm(1, -0.42), at = (t, w) => [hand[0] + d[0] * t - d[1] * w, hand[1] + d[1] * t + d[0] * w];
    const E = 92, spear = [
      { p: tube([[...at(-96, 0), 6], [...at(E, 0), 5]]), c: o.shaft, m: 'horn', gloss: 0.9, line: 0.8, lines: [-60, -20, 20, 60].map(t => ({ p: [at(t, -3), at(t + 2, 3)], w: 1.2, a: 0.5 })) },
      { p: [P(...at(E - 6, -7), 1), P(...at(E + 8, -8)), P(...at(E + 50, 0), 1), P(...at(E + 8, 8)), P(...at(E - 6, 7), 1)], c: o.sting, m: 'horn', gloss: 1.3, line: 0.8,
        lines: [{ p: [at(E, 0), at(E + 42, 0)], w: 1, light: true, a: 0.7 }] },
      ...[0, 1, 2].map(i => ({ p: [P(...at(E + 6 + i * 11, 5), 1), P(...at(E + 2 + i * 11, 13 - i * 2), 1), P(...at(E + 12 + i * 11, 4 - i * 0.6), 1)], c: o.sting, m: 'horn', line: 0.5 })),
      ...(o.venom ? [drop(...at(E + 30, 12), 3.6, o.venom), drop(...at(E + 14, 20), 3, o.venom)] : []),
      ...iLeg([164, 138], [184, 158], hand, [hand[0] + 6, hand[1] - 6], 9, o.legs, {}),
    ];
    const parts = [
      { kind: 'prop', pivot: [142, 112], shapes: [...wing.insect([142, 112], [-0.2, -1], 118, Wf), ...wing.insect([140, 116], [-0.75, -0.66], 92, Wf)] },
      legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [140, 150], shapes: bodyS },
      { kind: 'head', pivot: [168, 112], shapes: headS.concat(spear) },
      { kind: 'prop', pivot: [136, 114], shapes: [...wing.insect([136, 114], [-0.5, -0.87], 128, Wn), ...wing.insect([134, 118], [-0.95, -0.3], 96, Wn)] },
    ];
    V.def(name, place(name, parts, [147, G], o.size));
  }
  wasp('wasp_warrior', { thorax: '#3a3226', legs: '#2a241c', face: '#e8b830', stripe1: '#f0b820', stripe2: '#221c14', sting: '#3a2e1e', shaft: '#6a4a24', eye: '#2a1a0c',
    wing: '#d8ecf0', vein: '#5a7a88' });
  wasp('wasp_reaver', { thorax: '#2a1e22', legs: '#1e1418', face: '#c83a2a', stripe1: '#c82a2a', stripe2: '#1a1014', sting: '#b8ff5a', shaft: '#3a2228', eye: '#f04020',
    wing: '#e8c8c0', vein: '#7a3a3a', venom: '#9aff4a', thornsT: '#b82a2a', jaw: 22, size: 1.02 });

  /* =================== богомол / богомол-жнец =================== */
  function mantis(name, o) {
    const G = 313, c = o.chitin, cD = tone(c, -0.3);
    const legs = [
      legPart(1, [124, 206], iLeg([124, 206], [150, 176], [166, 250], [184, G - 3], 11, cD, { spur: tone(cD, -0.3) })),
      legPart(-1, [110, 212], iLeg([110, 212], [84, 180], [64, 256], [48, G - 3], 11, cD, { spur: tone(cD, -0.3) })),
      legPart(-1, [132, 210], iLeg([132, 210], [164, 184], [178, 256], [198, G - 3], 13, c, { spur: cD })),
      legPart(1, [116, 216], iLeg([116, 216], [92, 188], [72, 262], [58, G - 3], 13, c, { spur: cD })),
    ];
    // длинное брюшко назад-вниз, поверх — сложенные крылья-листья
    const bodyS = [
      segBody(72, 220, 70, 27, 0.24, { c: o.belly || c, n: 7, id: 'abdomen' }),
      { p: [[132, 194], [100, 196], [50, 208], [8, 232, 1], [40, 234], [92, 224], [126, 212]], c: o.wing, m: 'gem', gloss: 0.9, line: 0.8, id: 'wings',
        lines: [{ p: [[128, 202], [80, 212], [20, 232]], w: 1.2, a: 0.6 }, { p: [[118, 210], [70, 224], [36, 232]], w: 0.9, a: 0.4 }, { p: [[124, 198], [80, 204], [36, 222]], w: 1, light: true, a: 0.5 }] },
      ...(o.tatter ? [{ p: [[70, 206], [40, 216], [8, 232, 1], [26, 220, 1], [18, 228], [42, 214, 1], [40, 222]], c: tone(o.wing, -0.3), m: 'gem', line: 0.6 }] : []),
      segBody(128, 200, 16, 14, 0.2, { c, n: 2, ridge: false }),
      // вытянутая переднегрудь — «шея»
      { p: tube([[130, 204, 24], [142, 160, 18], [156, 112, 17], [162, 96, 19]]), c, m: 'gem', gloss: 1, id: 'neck',
        lines: [{ p: [[134, 196], [146, 150], [158, 106]], w: 1.2, light: true, a: 0.5 }] },
    ];
    // дальняя лапа-серп — в корпусе, за шеей
    const scythe = (sh, col, far) => {
      const k = [sh[0] + 16, sh[1] + 34], f = [sh[0] + 66, sh[1] - 18], t = [sh[0] + 46, sh[1] + 48], blade = o.blade || col;
      const out = [
        { p: tube([[sh[0], sh[1], 16], [k[0], k[1], 13]]), c: col, m: 'gem', gloss: 1, line: 0.8 },   // тазик
        // бедро: толстое, вверх-вперёд, по нижнему краю шипы
        { p: [P(k[0] - 8, k[1] + 5, 1), [k[0] - 8, k[1] - 10], [lerp(k, f, 0.5)[0] - 8, lerp(k, f, 0.5)[1] - 12], [f[0] - 6, f[1] - 9], P(f[0] + 6, f[1] - 4, 1), [f[0] + 5, f[1] + 9], [lerp(k, f, 0.5)[0] + 8, lerp(k, f, 0.5)[1] + 10], [k[0] + 9, k[1] + 7]], c: col, m: 'gem', gloss: 1.1, line: 0.8,
          lines: [{ p: [[k[0] - 3, k[1] - 7], [f[0] - 4, f[1] - 6]], w: 1.2, light: true, a: 0.6 }] },
        ...spikes([[k[0] + 8, k[1] + 8], [f[0] + 5, f[1] + 10]], 5, far ? 8 : 11, o.spine, -1),
        // голень-серп: выпуклая спинка, крюк на конце, зубья по лезвию
        { p: [P(f[0] - 2, f[1] - 8, 1), [f[0] + 10, f[1] + 4], [t[0] + 14, t[1] - 16], [t[0] + 8, t[1] + 6], P(t[0] - 10, t[1] + 20, 1), [t[0] - 2, t[1] + 4], [t[0] - 6, t[1] - 8], [f[0] - 6, f[1] + 8]], c: blade, m: o.bladeM || 'gem', gloss: 1.3, line: 0.8,
          lines: [{ p: [[f[0] + 4, f[1] + 2], [t[0] + 8, t[1] - 12], [t[0] + 2, t[1] + 8]], w: 1.2, light: true, a: 0.75 }, ...(o.edge ? [{ p: [[f[0] - 3, f[1] + 8], [t[0] - 4, t[1] - 6], [t[0] - 6, t[1] + 12]], w: 1.6, c: o.edge, a: 0.9 }] : [])] },
        ...spikes([[f[0] - 4, f[1] + 8], [t[0] - 5, t[1] - 6]], 4, far ? 6 : 8, o.spine, -1),
        { e: [f[0], f[1], 7, 7], c: tone(col, 0.08), m: 'gem', line: 0.7 },
      ];
      return out;
    };
    bodyS.push(...scythe([150, 124], cD, true));
    const hx = 170, hy = 76;
    const headS = [
      ...antenna([hx - 4, hy - 16], [hx - 12, hy - 50], [hx + 10, hy - 84], cD, 2.2),
      ...antenna([hx + 4, hy - 16], [hx + 4, hy - 52], [hx + 34, hy - 80], cD, 2.2),
      // треугольная голова: широкий верх с глазами по углам, узкий рот внизу
      { p: [[hx - 26, hy - 8], [hx - 14, hy - 20], [hx + 12, hy - 22], [hx + 30, hy - 10], [hx + 22, hy + 8], P(hx + 10, hy + 30, 1), [hx - 6, hy + 10]], c, m: 'gem', gloss: 1, id: 'head',
        lines: [{ p: [[hx - 10, hy - 14], [hx + 4, hy - 17], [hx + 18, hy - 12]], w: 1.2, light: true, a: 0.6 }, { p: [[hx + 2, hy - 2], [hx + 10, hy + 24]], w: 1, a: 0.5 }] },
      ...(o.crest ? [{ p: [[hx - 20, hy - 14], [hx - 16, hy - 40, 1], [hx - 6, hy - 22], [hx + 4, hy - 44, 1], [hx + 10, hy - 22], [hx + 22, hy - 36, 1], [hx + 22, hy - 14]], c: o.crest, m: 'horn', gloss: 1, line: 0.8 }] : []),
      cEye(hx - 20, hy - 10, 7, 9, tone(o.eye, -0.2), 0.3),
      cEye(hx + 24, hy - 8, 9, 11, o.eye, -0.3),
      { p: [[hx + 4, hy + 20], [hx + 14, hy + 18], P(hx + 12, hy + 32, 1)], c: tone(c, -0.4), m: 'horn', line: 0.5 },
    ];
    const headB = scaleAt(headS, hx, hy + 10, 1.15);
    const parts = [legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [128, 204], shapes: bodyS },
      { kind: 'head', pivot: [160, 98], shapes: headB },
      { kind: 'prop', pivot: [156, 128], shapes: scythe([156, 128], c, false) }];
    V.def(name, place(name, parts, [133, G], o.size));
  }
  mantis('mantis', { chitin: '#6aaa38', wing: '#8ac050', eye: '#d8e060', spine: '#e8e0a0' });
  mantis('mantis_reaper', { chitin: '#d8d2bc', belly: '#b8b09a', wing: '#4a4038', eye: '#e82a1a', spine: '#2a2420', blade: '#c8d0da', bladeM: 'steel', edge: '#a82020', crest: '#8a2a22', tatter: true, size: 1.03 });

  /* =================== жук-таран / жук-крепость =================== */
  function beetle(name, o) {
    const G = 223, c = o.chitin, cD = tone(c, -0.32), lg = o.legC || tone(c, -0.45), lgD = tone(lg, -0.25);
    const legs = [
      legPart(-1, [246, 164], iLeg([246, 164], [276, 150], [298, 190], [314, G - 3], 16, lgD, { spur: tone(lgD, -0.3) })),
      legPart(1, [178, 168], iLeg([178, 168], [202, 160], [214, 198], [230, G - 3], 16, lgD, { spur: tone(lgD, -0.3) })),
      legPart(-1, [108, 166], iLeg([108, 166], [78, 154], [60, 194], [42, G - 3], 16, lgD, { spur: tone(lgD, -0.3) })),
      // ближние ноги кладём поверх брюшка: у жука они растут из-под панциря и видны целиком
      legPart(1, [254, 178], iLeg([254, 178], [286, 164], [306, 200], [328, G - 3], 19, lg, { spur: lgD })),
      legPart(-1, [172, 184], iLeg([172, 184], [198, 172], [204, 204], [220, G - 3], 19, lg, { spur: lgD })),
      legPart(1, [106, 182], iLeg([106, 182], [76, 170], [62, 206], [44, G - 3], 19, lg, { spur: lgD })),
    ];
    // надкрылья: большой купол со швом и рёбрами
    const shell = { p: [[34, 150], [40, 104], [72, 64], [124, 44], [180, 44], [226, 62], [250, 96], [252, 142], [236, 172], [190, 184], [120, 186], [66, 180], [40, 168]], c, m: 'gem', gloss: 1, belly: 0.4, id: 'shell',
      lines: [{ p: [[52, 162], [66, 110], [110, 66], [170, 50], [222, 68]], w: 2.2, a: 0.8 },   // шов надкрылий
        { p: [[60, 132], [96, 84], [150, 62]], w: 1.4, a: 0.6 }, { p: [[90, 176], [120, 118], [190, 80]], w: 1.4, a: 0.6 }, { p: [[150, 182], [180, 130], [236, 100]], w: 1.4, a: 0.6 },
        { p: [[64, 136], [100, 88], [154, 66]], w: 1, light: true, a: 0.4 }, { p: [[94, 178], [124, 122], [194, 84]], w: 1, light: true, a: 0.4 },
        { p: [[74, 90], [118, 60], [170, 52]], w: 2, light: true, a: 0.55 }] };
    const under = { p: [[50, 166], [120, 178], [200, 176], [250, 160], [262, 180], [236, 196], [170, 202], [100, 200], [56, 186]], c: tone(c, -0.5), m: 'gem', gloss: 0.6, line: 0.8,
      lines: [80, 110, 140, 170, 200, 228].map(x => ({ p: [[x, 180], [x + 4, 200]], w: 1.2, a: 0.6 })) };
    // кромка надкрылья — светлый кант по низу
    shell.sub = [{ p: tube([[36, 150, 6], [66, 176, 7], [130, 184, 7], [200, 180, 7], [240, 166, 6], [252, 140, 5]]), c: tone(c, 0.25), m: 'gem', gloss: 0.6, line: 0 }];
    const bodyS = [under, shell];
    if (o.fort) {
      // крепостной гребень: зубцы по хребту, клёпаные плиты, бойницы
      const ridge = [[70, 78], [110, 54], [160, 44], [210, 52], [240, 76]];
      bodyS.push({ p: [[62, 96], [66, 66], [106, 38], [160, 26], [214, 36], [246, 64], [246, 84], [212, 64], [160, 56], [110, 66]], c: o.fort, m: 'steel', gloss: 0.8, line: 0.9, id: 'wall',
        lines: [{ p: [[90, 64], [130, 46], [180, 42], [226, 58]], w: 1, light: true, a: 0.5 }] });
      for (let i = 0; i < 6; i++) {
        const t = (i + 0.5) / 6, k = t * (ridge.length - 1), j = Math.min(ridge.length - 2, Math.floor(k)), q = lerp(ridge[j], ridge[j + 1], k - j), y = q[1] - 12;
        bodyS.push({ p: [P(q[0] - 9, y + 14, 1), P(q[0] - 9, y - 10, 1), P(q[0] + 9, y - 10, 1), P(q[0] + 9, y + 14, 1)], c: o.fort, m: 'steel', gloss: 0.9, line: 0.9,
          lines: [{ p: [[q[0] - 6, y - 8], [q[0] - 6, y + 8]], w: 1, light: true, a: 0.5 }] });
      }
      for (const [x, y] of [[80, 130], [120, 110], [160, 96], [200, 100], [110, 160], [160, 150], [210, 140]]) bodyS.push({ e: [x, y, 5, 5], c: o.trim, m: 'gold', line: 0.6, glint: [[x - 1.5, y - 1.5, 2]] });
      bodyS.push({ p: [[126, 128, 1], [136, 126, 1], [138, 146, 1], [128, 148, 1]], c: '#14100c', m: 'flat', line: 0.8, lc: o.trim }, { p: [[184, 118, 1], [194, 116, 1], [196, 136, 1], [186, 138, 1]], c: '#14100c', m: 'flat', line: 0.8, lc: o.trim });
    }
    // переднеспинка-щит и голова; рог
    const headS = [
      { p: [[236, 98], [262, 82], [292, 92], [306, 124], [298, 156], [272, 174], [244, 168], [232, 134]], c: tone(c, -0.1), m: 'gem', gloss: 1, id: 'pronotum',
        lines: [{ p: [[250, 96], [276, 90], [296, 106]], w: 1.6, light: true, a: 0.55 }] },
      // грудной рог сверху, загнут вперёд
      { p: tube([[270, 96, 18], [292, 72, 12], [318, 64, 7], [334, 72, 3]]), c: o.horn, m: 'horn', gloss: 1.2, line: 0.8, id: 'horn2',
        lines: [{ p: [[276, 88], [296, 72], [318, 66]], w: 1.2, light: true, a: 0.6 }] },
      { p: [[290, 138], [310, 128], [328, 138], [330, 160], [312, 172], [292, 166]], c: tone(c, -0.25), m: 'gem', gloss: 0.9, id: 'head' },
      // головной рог-таран: мощный, загнут вверх
      { p: tube([[316, 150, 20], [338, 132, 15], [352, 104, 10], [352, 80, 5]]), c: o.horn, m: 'horn', gloss: 1.3, line: 0.9, id: 'horn',
        lines: [{ p: [[320, 142], [340, 124], [350, 100]], w: 1.4, light: true, a: 0.7 }, { p: [[328, 150], [334, 140]], w: 1, a: 0.4 }, { p: [[340, 136], [348, 128]], w: 1, a: 0.4 }] },
      ...(o.hornTip ? [{ p: tube([[352, 96, 9], [352, 80, 5]]), c: o.hornTip, m: 'gold', gloss: 1.3, line: 0.7 }] : []),
      cEye(314, 146, 5.5, 5, o.eye, 0),
      mandible([324, 164], 0.3, 14, tone(c, -0.5), true),
    ];
    // корпус и голову приподнимаем над землёй — под панцирем видны ноги
    const up = list => K.mapShapes(list, (x, y) => [x, y - 16], 1);
    const parts = [legs[0], legs[1], legs[2],
      { kind: 'torso', pivot: [170, 134], shapes: up(bodyS) },
      legs[3], legs[4], legs[5],
      { kind: 'head', pivot: [256, 124], shapes: up(headS) }];
    V.def(name, place(name, parts, [192, G], o.size));
  }
  beetle('ram_beetle', { chitin: '#4a8a3a', horn: '#2e3a1e', eye: '#e8b020' });
  beetle('fortress_beetle', { chitin: '#4a5a6e', legC: '#2a303a', horn: '#3a4250', hornTip: '#e8c050', eye: '#f0c040', fort: '#8a9098', trim: '#d8a53a', size: 1.03 });

  /* =================== матка / древняя матка =================== */
  function queen(name, o) {
    const G = 307, c = o.chitin, cD = tone(c, -0.3), lg = tone(c, -0.35);
    const legs = [
      legPart(1, [250, 214], iLeg([250, 214], [284, 198], [300, 250], [318, G - 3], 16, tone(lg, -0.25), { spur: tone(lg, -0.5) })),
      legPart(-1, [218, 220], iLeg([218, 220], [224, 198], [238, 256], [250, G - 3], 16, tone(lg, -0.25), { spur: tone(lg, -0.5) })),
      legPart(-1, [256, 222], iLeg([256, 222], [294, 210], [308, 262], [330, G - 3], 20, lg, { spur: tone(lg, -0.3) })),
      legPart(1, [224, 228], iLeg([224, 228], [234, 206], [252, 266], [268, G - 3], 20, lg, { spur: tone(lg, -0.3) })),
    ];
    // огромное брюшко: янтарные кольца, по низу тянется по земле
    const abd = segBody(124, 212, 116, 86, 0.1, { c: o.abd, n: 7, stripes: [null, tone(o.abd, -0.22)], id: 'abdomen', belly: 0.45, band: 2.6 });
    const T = axes(124, 212, 0.1);
    abd.sub = (abd.sub || []).concat(o.eggs ? [[-50, 30], [-20, 40], [10, 36], [-36, 58], [30, 52]].map(([u, v]) => { const [x, y] = T(u, v); return { p: ell(x, y, 10, 7, 10, 0.3), c: o.eggs, m: 'gem', gloss: 1.2, line: 0.6, glint: [[x - 3, y - 2, 2.5]] }; }) : []);
    const bodyS = [
      // сложенные крылья по спине (не машут — матка ползёт)
      ...wing.insect([214, 150], [-1, -0.28], 170, { mem: tone(o.wing, -0.12), vein: o.vein }),
      abd,
      ...(o.spines ? spikes([T(-96, -52), T(-50, -80), T(0, -88), T(50, -80), T(90, -56)], 7, 18, o.spines, 1) : []),
      ...wing.insect([220, 148], [-1, -0.12], 150, { mem: o.wing, vein: o.vein }),
      segBody(236, 180, 44, 40, -0.3, { c, n: 3, id: 'thorax' }),
      // дальняя передняя лапа-рука
      ...iLeg([262, 178], [290, 160], [318, 182], [330, 180], 13, tone(lg, -0.2), {}),
    ];
    const hx = 294, hy = 118;
    // корона-гребень: зубцы веером вокруг темени
    const crown = [];
    for (let i = 0; i < o.crownN; i++) {
      const a = -Math.PI * 0.95 + i / (o.crownN - 1) * Math.PI * 0.62, L = (i === Math.floor(o.crownN * 0.55) ? 1.35 : 1) * o.crownL * (0.8 + 0.3 * Math.sin(i / (o.crownN - 1) * Math.PI));
      const bx = hx - 4 + Math.cos(a) * 20, by = hy - 4 + Math.sin(a) * 20, dx = Math.cos(a), dy = Math.sin(a);
      crown.push({ p: [P(bx - dy * 6, by + dx * 6, 1), P(bx + dx * L, by + dy * L, 1), P(bx + dy * 6, by - dx * 6, 1)], c: o.crown, m: 'horn', gloss: 1.3, line: 0.7, glint: [[bx + dx * L * 0.5, by + dy * L * 0.5, 2]] });
    }
    const headS = [
      ...crown,
      ...antenna([hx + 4, hy - 22], [hx + 14, hy - 52], [hx + 44, hy - 62], cD, 3.4),
      mandible([hx + 20, hy + 18], 0.6, 26, tone(c, -0.5), true),
      { p: [[hx - 26, hy + 8], [hx - 22, hy - 18], [hx - 2, hy - 30], [hx + 22, hy - 24], [hx + 32, hy - 4], [hx + 28, hy + 18], [hx + 8, hy + 30], [hx - 14, hy + 26]], c, m: 'gem', gloss: 1.1, id: 'head',
        lines: [{ p: [[hx - 14, hy - 20], [hx + 4, hy - 26], [hx + 20, hy - 20]], w: 1.4, light: true, a: 0.6 }] },
      { p: tube([[hx - 20, hy - 20, 7], [hx, hy - 30, 8], [hx + 20, hy - 24, 7]]), c: o.crown, m: 'horn', gloss: 1.2, line: 0.7 },   // обод короны
      cEye(hx + 10, hy - 4, 11, 12, o.eye, 0.3),
      cEye(hx - 16, hy - 6, 5, 6, tone(o.eye, -0.25), 0.2),
      mandible([hx + 18, hy + 14], 0.25, 28, tone(c, -0.35), false),
    ];
    const hand = [338, 190];
    const armS = iLeg([270, 188], [302, 166], hand, [hand[0] + 12, hand[1] - 4], 15, lg, { spur: tone(lg, -0.3) });
    const parts = [legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [200, 200], shapes: bodyS },
      { kind: 'head', pivot: [266, 144], shapes: headS },
      { kind: 'prop', pivot: [270, 186], shapes: armS }];
    V.def(name, place(name, parts, [187, G], o.size));
  }
  queen('queen', { chitin: '#5a8e2c', abd: '#e0a030', wing: '#d8ecf0', vein: '#6a8a90', eye: '#e84a20', crown: '#f0c848', crownN: 5, crownL: 30 });
  queen('ancient_queen', { chitin: '#3a2e3e', abd: '#b02a3a', wing: '#c8b8c8', vein: '#5a3a4a', eye: '#f0d030', crown: '#f0ece0', crownN: 7, crownL: 32, spines: '#2a1e2a', eggs: '#f0e8a0', size: 1.03 });
})(typeof window !== 'undefined' ? window : globalThis);
