/* ============================================================================
   view/vec_fortress.js — Крепость на рисованном конвейере.
   Гноллы, ящеры, змии-стрекозы, василиски, горгоны, виверны, гидры.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   с другой гаммой и заметной деталью (цеп, доспех, жало, корона рогов, лишние головы).
   Краски фракции: болотная зелень, охра, бирюза; чешуя — skin с фактурой scale.
   Звери нарисованы прямо в рамке старого спрайта (K.frameOf) и вписаны fit().
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, move, rot, ell, lerp, along, weapon, arm, leg, humanoid, wing, fit, frameOf, mapShapes, hoofLeg, tone, H } = K;
  const BONE = '#ece2c8', DARK = '#140e0a', MOUTH = '#4a1614', IRON = '#8e959c';

  /* ---------- общие помощники ---------- */
  /** Вписать зверя, нарисованного в своей рамке (ground — точка опоры), в рамку старого спрайта. */
  function place(name, parts, ground, size) {
    const to = frameOf(name) || { w: ground[0] * 2, h: ground[1] + 4, anchor: ground };
    return fit(parts, { ground, height: ground[1] }, to, to.anchor[1] / ground[1] * (size || 1));
  }
  /**
   * Ряд зубов вдоль линии a→b одной формой-зигзагом (экономит формы); len > 0 — остриём вниз, len < 0 — вверх.
   * Основание уходит на пару единиц в десну — его закрывает челюсть.
   */
  function teeth(a, b, n, len, c) {
    const out = [P(...a, 1)], back = Math.sign(len) * -1.6;
    for (let i = 0; i < n; i++) {
      const t0 = (i + 0.12) / n, t1 = (i + 0.88) / n, p0 = lerp(a, b, t0), p1 = lerp(a, b, t1), m = lerp(a, b, (t0 + t1) / 2);
      out.push(P(...p0, 1), P(m[0] + (b[0] - a[0]) / n * 0.08, m[1] + len, 1), P(...p1, 1));
    }
    out.push(P(...b, 1), P(b[0], b[1] + back, 1), P(a[0], a[1] + back, 1));
    return [{ p: out, c: c || '#f0e8d0', m: 'horn', line: 0.4 }];
  }
  /** Мелкие шипы вдоль линии одной формой (для шей и хвостов, где их много). */
  function sawRidge(pts, n, h, c, side) {
    const L = [], R = [];
    for (let i = 0; i <= n * 2; i++) {
      const t = i / (n * 2), k = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j;
      const a = pts[j], b = pts[j + 1], p = lerp(a, b, f), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = ty * (side || -1), ny = -tx * (side || -1);
      const hh = i % 2 ? h * (1 - Math.abs(t - 0.45) * 0.7) : 0;
      L.push(P(p[0] + nx * hh + tx * (i % 2 ? -h * 0.25 : 0), p[1] + ny * hh + ty * (i % 2 ? -h * 0.25 : 0), 1)); R.push(P(p[0] - nx * 2, p[1] - ny * 2, 1));
    }
    return { p: [...L, ...R.reverse()], c, m: 'horn', gloss: 0.7, line: 0.6 };
  }
  /** Рог изогнутой трубкой [[x, y, толщина]…] с кольцами; tip — цвет кончика. */
  function hornT(pts, c, tip) {
    const s = { p: tube(pts), c, m: 'horn', gloss: 0.9, lines: [] };
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], b = pts[i + 1], [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), w = pts[i][2] * 0.5;
      s.lines.push({ p: [[pts[i][0] - ty * w, pts[i][1] + tx * w], [pts[i][0] + ty * w, pts[i][1] - tx * w]], w: 0.8, a: 0.4 });
    }
    if (tip) { const n = pts.length; s.sub = [{ p: tube(pts.slice(Math.max(0, n - 2)).map(q => [q[0], q[1], q[2] * 2.2])), c: tip, m: 'horn', line: 0 }]; }
    return s;
  }
  /** Гребень шипов вдоль линии pts: side 1 — наружу слева от хода (при ходе вправо — вверх). */
  function spikes(pts, n, h, c, side, m) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, k = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j;
      const a = pts[j], b = pts[j + 1], p = lerp(a, b, f), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = ty * (side || -1), ny = -tx * (side || -1);
      const hh = h * (1 - Math.abs(t - 0.45) * 0.8), w = h * 0.42;
      out.push({ p: [P(p[0] - tx * w, p[1] - ty * w, 1), P(p[0] + nx * hh - tx * w * 0.7, p[1] + ny * hh - ty * w * 0.7, 1), P(p[0] + tx * w, p[1] + ty * w, 1)], c, m: m || 'horn', gloss: 0.7, line: 0.6 });
    }
    return out;
  }
  /** Мягкое свечение: полупрозрачные овалы вокруг точки; rgb — 'r,g,b'. */
  const glow = (cx, cy, r, rgb, a) => [
    { e: [cx, cy, r, r], c: 'rgba(' + rgb + ',' + (0.16 * a).toFixed(3) + ')', m: 'flat', line: 0 },
    { e: [cx, cy, r * 0.6, r * 0.6], c: 'rgba(' + rgb + ',' + (0.3 * a).toFixed(3) + ')', m: 'flat', line: 0 },
  ];
  /** Глаз рептилии: радужка, зрачок-щель, блик. */
  const reptEye = (x, y, r, c, o) => ({ e: [x, y, r, r * 0.84], c, m: 'gem', line: 0.6, lc: o && o.lc,
    sub: [{ e: [x + r * 0.15, y, r * 0.24, r * 0.8], c: DARK, m: 'flat', line: 0 }], glint: [[x - r * 0.3, y - r * 0.35, r * 0.34]] });
  /** Кольца-полосы поперёк трубки (сегменты брюха, членики тела). */
  function rings(c, t0, t1, w, a, k) {
    const out = [];
    for (let i = 1; i < c.length - 1; i++) {
      const t = i / (c.length - 1); if (t < (t0 || 0) || t > (t1 === undefined ? 1 : t1)) continue;
      const pa = c[i - 1], pb = c[i + 1], [tx, ty] = norm(pb[0] - pa[0], pb[1] - pa[1]), r = c[i][2] * 0.5 * (k || 0.96);
      out.push({ p: [[c[i][0] - ty * r, c[i][1] + tx * r], [c[i][0] + tx * r * 0.18, c[i][1] + ty * r * 0.18], [c[i][0] + ty * r, c[i][1] - tx * r]], w: w || 1, a: a || 0.45 });
    }
    return out;
  }
  /** Полоса брюха вдоль трубки: смещена к нижней стороне (side 1 — справа от хода). */
  const bellyTube = (c, k, off, side) => tube(c.map((q, i) => {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), s = (side || 1) * q[2] * (off || 0.26);
    return [q[0] - ty * s, q[1] + tx * s, q[2] * (k || 0.45)];
  }));

  /* ================= Гнолл / гнолл-мародёр =================
     Гиеноголовый: покатый череп, тёмная морда, круглые уши, грива по хребту,
     ноги «на пальцах». Гнолл — с копьём и в дощатом нагруднике; мародёр —
     тёмный, с рыжей гривой, в клёпаной коже с железным наплечником и шипастым цепом. */
  function gnoll(name, o) {
    const f = o.fur, fD = tone(f, -0.24), mane = o.mane;
    const spot = (x, y, r) => ({ e: [x, y, r, r * 0.8], c: o.spot, m: 'fur', furLen: 0.35, line: 0 });
    const gLeg = (hip, foot, side) => {
      const c = side < 0 ? fD : f, kx = hip[0] + 12, ky = 200, hx = foot[0] - 8, hy = 226, ax = foot[0], ay = foot[1] - 9;
      const out = [
        { p: tube([[hip[0], hip[1] - 8, 32], [kx, ky, 21], [hx, hy, 13], [ax, ay, 11]], { flat0: true }), c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.5, belly: 0.25,
          sub: side > 0 ? [spot(hip[0] - 4, 176, 5), spot(hip[0] + 8, 190, 4), spot(kx - 4, ky + 10, 3)] : [] },
        { p: [[ax - 8, ay - 3], [ax + 6, ay - 5], [foot[0] + 14, foot[1] - 5], P(foot[0] + 17, foot[1], 1), P(ax - 10, foot[1], 1)], c, m: 'fur', furLen: 0.35, flow: Math.PI * 0.5 },
        ...[0, 1, 2].map(i => ({ p: [P(foot[0] + 8 - i * 6, foot[1] - 4, 1), P(foot[0] + 17 - i * 6, foot[1] - 0.5, 1), P(foot[0] + 7 - i * 6, foot[1], 1)], c: '#2a2018', m: 'horn', line: 0.4 })),
      ];
      if (o.wraps) out.push({ p: tube([[hx + 1, hy - 4, 15], [ax, ay + 1, 13]], { flat1: true }), c: side < 0 ? tone(o.wraps, -0.2) : o.wraps, m: 'leather', lines: [{ p: [[hx - 6, hy + 2], [hx + 8, hy - 1]], w: 1, a: 0.6 }] });
      return out;
    };
    // голова: гиена в профиль, пасть приоткрыта
    const headS = [
      // грива на затылке и дальнее ухо
      { p: [[116, 28], [108, 14, 1], [102, 26], [92, 16, 1], [90, 30], [78, 26, 1], [82, 40], [70, 42, 1], [78, 52], [66, 60, 1], [76, 66], [68, 80, 1], [82, 80], [92, 70], [98, 50], [106, 36]], c: mane, m: 'fur', furLen: 0.9, flow: Math.PI * 0.85, id: 'mane' },
      { p: [[98, 40], [86, 30], [84, 16], [94, 10], [104, 18], [108, 32]], c: fD, m: 'fur', furLen: 0.4, line: 0.7, sub: [{ e: [95, 22, 5, 7], c: tone(o.earIn, -0.3), m: 'skin', line: 0 }] },
      // нижняя челюсть
      { p: [[118, 72], [140, 68], [164, 66], [170, 70], [160, 78], [140, 82], [120, 80]], c: fD, m: 'fur', furLen: 0.3, flow: Math.PI },
      { p: [[140, 64], [172, 60], [166, 69], [142, 71]], c: MOUTH, m: 'flat', line: 0.4 },
      ...teeth([146, 70], [164, 68], 3, -4, '#f0e6cc'),
      // череп и морда
      { p: [[90, 66], [90, 44], [100, 30], [118, 25], [134, 30], [144, 40], [158, 44], [172, 50], [178, 56], [176, 62, 1], [160, 63], [144, 66], [134, 74], [116, 78], [100, 76]], c: f, m: 'fur', furLen: 0.4, flow: Math.PI * 0.95, id: 'skull',
        sub: [{ p: [[146, 40], [182, 50], [182, 70], [146, 72], [140, 56]], c: o.muzzle, m: 'fur', furLen: 0.3, line: 0 }, spot(112, 40, 4), spot(104, 54, 3.5), spot(122, 62, 3), spot(98, 42, 2.5)],
        lines: [{ p: [[102, 34], [120, 28], [138, 34]], w: 1.1, light: true, a: 0.45 }] },
      ...teeth([148, 63], [172, 60], 4, 4.5, '#f4ecd6'),
      { e: [176, 55, 4.4, 3.6], c: '#1a1210', m: 'horn', gloss: 1.1, line: 0.4 },
      { e: [132, 44, 4, 3.3], c: o.eye, m: 'gem', line: 0.5, sub: [{ e: [133, 44, 1.6, 2.6], c: DARK, m: 'flat', line: 0 }], glint: [[131, 42.6, 1.3]] },
      { p: [[122, 37], [140, 37], [143, 41], [124, 41]], c: tone(mane, -0.2), m: 'flat', line: 0 },
      // ближнее ухо — круглое, торчком
      { p: [[106, 40], [94, 26], [94, 10], [106, 4], [118, 12], [120, 30]], c: f, m: 'fur', furLen: 0.4, line: 0.7, id: 'ear',
        sub: [{ p: [[108, 34], [100, 22], [101, 12], [108, 9], [114, 16], [115, 30]], c: o.earIn, m: 'skin', line: 0 }] },
    ];
    if (o.paint) headS.push({ p: [[120, 48], [146, 42], [148, 47], [122, 53]], c: o.paint, m: 'flat', line: 0 });
    if (o.crest) headS.push({ p: [[118, 26], [110, 4, 1], [104, 20], [96, 2, 1], [94, 22], [84, 8, 1], [86, 30]], c: mane, m: 'fur', furLen: 0.9, flow: -Math.PI * 0.5, line: 0.6 });
    // корпус: сутулый, мохнатый; хвост и дальняя рука — за ним
    const back = [
      { p: tube([[80, 150, 14], [62, 166, 18], [54, 186, 13], [52, 200, 6]]), c: mane, m: 'fur', furLen: 1, flow: Math.PI * 0.55 },
      { p: [[92, 70], [78, 80], [66, 100], [64, 124], [74, 128], [82, 100], [96, 86]], c: mane, m: 'fur', furLen: 1.1, flow: Math.PI * 0.55 },
      ...arm([82, 96], [70, 124], [82, 148], { c: fD, m: 'fur', hand: fD, handM: 'fur', w: 16 }),
    ];
    const body = [
      { p: tube([[104, 66, 24], [100, 92, 30]]), c: f, m: 'fur', furLen: 0.5, id: 'neck' },
      { p: [[70, 98], [88, 82], [122, 82], [140, 96], [142, 124], [132, 150], [80, 152], [66, 126]], c: f, m: 'fur', furLen: 0.6, flow: Math.PI * 0.5, belly: 0.3,
        sub: [{ e: [118, 132, 18, 20], c: tone(f, 0.16), m: 'fur', furLen: 0.4, line: 0 }, spot(84, 110, 5), spot(92, 132, 4)] },
    ];
    if (o.armor === 'wood') body.push(
      { p: [[74, 100], [92, 88], [124, 88], [138, 102], [136, 136], [80, 140], [70, 120]], c: o.armorC, m: 'wood', flow: 0, belly: 0.2, id: 'armor',
        lines: [0, 1, 2].map(i => ({ p: [[74, 106 + i * 11], [138, 108 + i * 11]], w: 1.4, a: 0.7 })).concat([{ p: [[106, 90], [106, 138]], w: 1.1, a: 0.4 }]) },
      { p: tube([[84, 92, 5], [110, 118, 5], [134, 142, 5]]), c: '#a88a5a', m: 'cloth', line: 0.6 });
    else body.push(
      { p: [[72, 100], [90, 86], [124, 86], [140, 100], [138, 136], [80, 142], [70, 122]], c: o.armorC, m: 'leather', belly: 0.2, id: 'armor',
        lines: [{ p: [[106, 88], [106, 140]], w: 1.2, a: 0.5 }, { p: [[74, 120], [138, 120]], w: 1.2, a: 0.45 }],
        glint: [[82, 106, 1.8], [96, 104, 1.8], [118, 104, 1.8], [130, 108, 1.8], [82, 128, 1.8], [96, 128, 1.8], [118, 128, 1.8], [130, 128, 1.8]] },
      { p: [[72, 90], [88, 84], [148, 150], [134, 156]], c: o.sash, m: 'cloth', line: 0.7 });
    body.push(
      { p: [[76, 140], [132, 138], [138, 158], [132, 184, 1], [118, 172], [106, 186, 1], [94, 172], [80, 182, 1], [74, 160]], c: o.loin, m: 'leather', belly: 0.3, lines: [{ p: [[104, 146], [106, 180]], w: 1, a: 0.4 }] },
      { p: [[74, 136], [134, 134], [135, 145], [73, 147]], c: '#4a3020', m: 'leather', sub: [{ e: [104, 140, 6, 6], c: o.buckle || BONE, m: o.buckle ? 'gold' : 'horn', line: 0.5 }] });
    const hand = [150, 132];
    let wpn;
    if (o.flail) {
      // шипастый цеп: рукоять, цепь из звеньев, шар с шипами
      const at = along(hand, [0.5, -1]), E = at(52, 0);
      wpn = [{ p: tube([[...at(-16, 0), 7], [...at(54, 0), 6]]), c: '#5a3a22', m: 'wood', flow: -1.1, line: 0.8, lines: [{ p: [at(-8, -3), at(-6, 3)], w: 1.4, c: '#2a1a10', a: 0.8 }, { p: [at(-2, -3), at(0, 3)], w: 1.4, c: '#2a1a10', a: 0.8 }] },
        { p: tube([[...at(48, 0), 9], [...at(56, 0), 9]], { flat0: true, flat1: true }), c: IRON, m: 'steel', line: 0.6 }];
      const ch = [[E[0] + 7, E[1] - 1], [E[0] + 13, E[1] + 6], [E[0] + 17, E[1] + 15], [E[0] + 19, E[1] + 25]];
      ch.forEach((q, i) => wpn.push({ e: [q[0], q[1], i % 2 ? 2.6 : 4.2, i % 2 ? 4.2 : 2.6], c: IRON, m: 'steel', line: 0.6 }));
      const bx = E[0] + 20, by = E[1] + 38;
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2, c1 = Math.cos(a), s1 = Math.sin(a);
        wpn.push({ p: [P(bx + c1 * 8 - s1 * 3.5, by + s1 * 8 + c1 * 3.5, 1), P(bx + c1 * 19, by + s1 * 19, 1), P(bx + c1 * 8 + s1 * 3.5, by + s1 * 8 - c1 * 3.5, 1)], c: '#c8ced6', m: 'steel', line: 0.5 }); }
      wpn.push({ e: [bx, by, 12, 12], c: '#9aa2ac', m: 'steel', gloss: 1.1, glint: [[bx - 4, by - 4, 3]] });
    } else {
      wpn = [...weapon.polearm(hand, [0.14, -1], 128, { kind: 'spear', back: 96, head: '#cfc8b8', shaft: '#7a5230' }),
        { p: move([[0, 0], [-8, 10], [-3, 22], [4, 11]], ...along(hand, [0.14, -1])(122, 3)), c: o.tuft, m: 'fur', furLen: 0.7, flow: Math.PI * 0.5 }];
    }
    const shoulder = o.pauldron
      ? [{ p: [[108, 94], [124, 84], [142, 90], [146, 110], [126, 114], [110, 108]], c: o.pauldron, m: 'steel', glint: [[126, 94, 3]], lines: [{ p: [[112, 102], [144, 100]], w: 1, a: 0.5 }] },
        { p: [P(124, 88, 1), P(128, 70, 1), P(134, 88, 1)], c: IRON, m: 'steel', line: 0.5 }, { p: [P(134, 90, 1), P(144, 76, 1), P(142, 94, 1)], c: IRON, m: 'steel', line: 0.5 }]
      : [{ e: [124, 98, 12, 11], c: f, m: 'fur', furLen: 0.5 }];
    V.def(name, humanoid({
      name, size: o.size || 0.98, dx: 6,
      legs: gLeg, back, body, head: headS,
      arm: [...wpn, ...arm([124, 96], [142, 120], hand, { c: f, m: 'fur', hand: fD, handM: 'fur', w: 16 }),
        ...[0, 1, 2].map(i => ({ p: [P(hand[0] + 6, hand[1] - 5 + i * 5, 1), P(hand[0] + 12, hand[1] - 3 + i * 5, 1), P(hand[0] + 6, hand[1] - 1 + i * 5, 1)], c: '#2a2018', m: 'horn', line: 0.4 })),
        ...shoulder],
    }));
  }
  gnoll('gnoll', { fur: '#c89a5a', spot: '#6a4626', mane: '#4a3020', muzzle: '#3e2c1e', earIn: '#7a5040', eye: '#f0b030', armor: 'wood', armorC: '#8a5a30', loin: '#5e6e34', tuft: '#4a3020' });
  gnoll('gnoll_marauder', { fur: '#8c7258', spot: '#4e3c2c', mane: '#a8401e', muzzle: '#2a1e16', earIn: '#5a3a2e', eye: '#ff6a20', armor: 'leather', armorC: '#4a3222', sash: '#a82a24',
    loin: '#3a2a1e', buckle: '#d8a53a', pauldron: '#8a929c', wraps: '#6a4a2c', paint: '#b8281e', crest: true, flail: true });

  /* ================= Ящер / ящер-воин =================
     Стрелок: вытянутая морда, гребень, хвост; стоит в стойке лучника (как лучник Замка).
     Воин — бирюзовый, с красным гребнем, в бронзовом наплечнике и чешуйчатой кирасе, лук с золотыми концами. */
  function lizardman(name, o) {
    const sk = o.skin, skD = tone(sk, -0.22), bel = o.belly;
    const lLeg = (hip, foot, side) => {
      const c = side < 0 ? skD : sk;
      const out = leg([hip[0], hip[1] - 2], [foot[0] + (side < 0 ? 0 : 2), foot[1]], { style: 'bare', c, skin: c, tw: 26, toe: 9, bend: 8 });
      out.forEach(s => { s.tex = 'scale'; s.texSize = 0.55; });
      for (let i = 0; i < 3; i++) out.push({ p: [P(foot[0] + 12 - i * 7, foot[1] - 6, 1), P(foot[0] + 22 - i * 7, foot[1], 1), P(foot[0] + 10 - i * 7, foot[1], 1)], c: o.claw, m: 'horn', line: 0.5 });
      if (o.greaves) out.push({ p: [[foot[0] - 9, foot[1] - 40], [foot[0] + 6, foot[1] - 42], [foot[0] + 5, foot[1] - 20], [foot[0] - 1, foot[1] - 14, 1], [foot[0] - 8, foot[1] - 20]], c: side < 0 ? tone(o.greaves, -0.25) : o.greaves, m: 'gold', line: 0.6,
        lines: [{ p: [[foot[0] - 1, foot[1] - 39], [foot[0] - 1, foot[1] - 18]], w: 1, light: true, a: 0.6 }] });
      return out;
    };
    const tail = [[84, 150, 30], [62, 174, 24], [46, 202, 17], [32, 228, 11], [18, 242, 5]];
    // колчан за спиной
    const quiver = [{ p: tube([[72, 62, 16], [62, 128, 14]]), c: o.quiver, m: 'leather', lines: [{ p: [[62, 80], [74, 82]], w: 1, a: 0.6 }, { p: [[60, 118], [70, 120]], w: 1, a: 0.6 }] }];
    for (let i = 0; i < 4; i++) quiver.push({ p: [[66 + i * 4, 62], [62 + i * 4, 46, 1], [70 + i * 4, 50], [72 + i * 4, 62]], c: o.fletch, m: 'feather', texSize: 0.3, line: 0.6 });
    const back = [
      { p: tube(tail), c: skD, m: 'skin', tex: 'scale', texSize: 0.7, belly: 0.3, lines: [{ p: tail.map(q => [q[0] + 4, q[1] - q[2] * 0.3]), w: 1, light: true, a: 0.35 }] },
      ...(o.tailSpikes ? spikes(tail.slice(0, 4).map(q => [q[0] - q[2] * 0.3, q[1] - q[2] * 0.35]), 4, 10, o.crest, -1) : []),
      ...quiver,
      ...arm([80, 92], [76, 106], [112, 100], { c: skD, m: 'skin', hand: skD, handM: 'skin', w: 15 }),
    ];
    const body = [
      { p: [[70, 92], [92, 78], [124, 80], [140, 96], [138, 124], [128, 150], [80, 152], [66, 124]], c: sk, m: 'skin', tex: 'scale', texSize: 0.75, id: 'chest',
        sub: [{ p: [[102, 84], [138, 92], [140, 150], [96, 150], [100, 118]], c: bel, m: 'skin', line: 0, lines: [0, 1, 2, 3, 4].map(i => ({ p: [[100, 96 + i * 11], [140, 98 + i * 11]], w: 1.1, a: 0.45 })) }],
        lines: [{ p: [[78, 100], [90, 124], [88, 146]], w: 1.2, a: 0.35 }] },
    ];
    if (o.cuirass) body.push({ p: [[74, 96], [94, 84], [124, 86], [138, 100], [136, 130], [80, 136], [70, 118]], c: o.cuirass, m: 'mail', tex: 'scale', texSize: 0.55, id: 'cuirass',
      lines: [{ p: [[106, 88], [108, 134]], w: 1.1, a: 0.4 }], sub: [{ p: [[60, 128], [150, 124], [150, 140], [60, 140]], c: o.trim, m: 'gold', line: 0 }] });
    body.push(
      { p: [[72, 88], [86, 82], [142, 146], [130, 152]], c: o.strap, m: 'leather', line: 0.7, glint: [[110, 116, 1.8]] },
      { p: [[74, 140], [128, 140], [134, 160], [124, 184, 1], [110, 172], [100, 186, 1], [88, 170], [74, 180, 1], [70, 160]], c: o.loin, m: 'leather', belly: 0.3, lines: [{ p: [[98, 150], [100, 180]], w: 1, a: 0.4 }] },
      { p: [[74, 136], [130, 136], [131, 146], [73, 146]], c: o.belt, m: 'leather', sub: [{ e: [106, 141, 6, 6], c: o.buckle, m: 'gold', line: 0.5 }] },
      { p: tube([[100, 64, 24], [96, 88, 30]]), c: sk, m: 'skin', tex: 'scale', texSize: 0.5, id: 'neck', sub: [{ p: tube([[110, 66, 12], [108, 90, 16]]), c: bel, m: 'skin', line: 0 }] });
    // голова ящерицы: длинная морда, глаз сбоку, гребень-парус на затылке
    const headS = [
      { p: [[94, 34], [80, 18, 1], [88, 30], [72, 30, 1], [86, 40], [70, 46, 1], [86, 52], [74, 64, 1], [92, 62]], c: o.crest, m: 'skin', line: 0.7, belly: 0.3, id: 'crest',
        lines: [{ p: [[92, 38], [80, 22]], w: 0.9, a: 0.4 }, { p: [[90, 46], [74, 34]], w: 0.9, a: 0.4 }, { p: [[90, 54], [74, 50]], w: 0.9, a: 0.4 }] },
      { p: [[110, 64], [136, 62], [166, 62], [172, 66], [160, 74], [134, 78], [110, 76]], c: skD, m: 'skin', tex: 'scale', texSize: 0.4, sub: [{ p: [[110, 70], [170, 66], [166, 82], [110, 82]], c: bel, m: 'skin', line: 0 }] },
      { p: [[124, 58], [170, 56], [164, 64], [126, 66]], c: MOUTH, m: 'flat', line: 0.4 },
      ...teeth([128, 64], [164, 63], 5, -3.5, '#f0e8d0'),
      { p: [[88, 62], [88, 40], [100, 26], [118, 22], [134, 28], [146, 38], [162, 44], [174, 50], [176, 56, 1], [160, 58], [134, 60], [118, 68], [100, 70]], c: sk, m: 'skin', tex: 'scale', texSize: 0.45, id: 'skull',
        lines: [{ p: [[100, 32], [118, 26], [136, 32]], w: 1.1, light: true, a: 0.5 }, { p: [[142, 52], [168, 52]], w: 1, a: 0.3 }] },
      ...teeth([130, 58], [170, 56], 6, 4, '#f4ecd6'),
      { p: [[118, 32], [134, 30], [142, 38], [130, 40]], c: tone(sk, 0.12), m: 'skin', line: 0.5 },
      reptEye(130, 40, 4.6, o.eye),
      { e: [172, 50, 2, 1.4], c: DARK, m: 'flat', line: 0 },
    ];
    if (o.band) headS.push({ p: tube([[90, 44, 6], [110, 36, 6], [128, 32, 5]]), c: o.band, m: 'gold', line: 0.5, glint: [[110, 36, 1.8]] }, { e: [110, 37, 3.6, 3.6], c: o.gem, m: 'gem', line: 0.5, glint: [[109, 36, 1.2]] });
    // лук в вытянутой руке, стрела на тетиве
    const armS = [...arm([126, 90], [148, 98], [168, 100], { c: sk, m: 'skin', hand: sk, handM: 'skin', w: 15 }),
      // «верх» лука направлен вниз: так дуга выгибается вперёд, а тетива — к стрелку
      ...weapon.bow([170, 100], [-0.08, 1], o.bowLen || 60, { wood: o.bow, string: '#e0d6c0' }),
      { p: [[122, 98], [180, 99], [180, 101], [122, 100]], c: '#e0d6c0', m: 'flat', line: 0 }, { p: [P(180, 95.5, 1), P(191, 100, 1), P(180, 104.5, 1)], c: o.tip, m: 'horn', line: 0.6 }];
    if (o.bowTips) { const t = [[168, 42], [172, 158]]; t.forEach(q => armS.push({ e: [q[0], q[1], 4, 4], c: o.bowTips, m: 'gold', line: 0.5 })); }
    if (o.pad) armS.push({ p: tube([[146, 94, 13], [160, 98, 12]], { flat0: true, flat1: true }), c: o.pad, m: 'gold', line: 0.6 },
      { p: [[108, 96], [116, 84], [132, 80], [146, 88], [148, 102, 1], [128, 98], [112, 104, 1]], c: o.pad, m: 'gold', glint: [[126, 88, 2.6]], lines: [{ p: [[114, 94], [146, 94]], w: 1.2, a: 0.5 }] },
      { p: [[110, 104], [128, 100], [148, 104], [146, 110, 1], [128, 106], [112, 110, 1]], c: tone(o.pad, -0.2), m: 'gold', line: 0.5 });
    else armS.push({ e: [124, 96, 12, 11], c: sk, m: 'skin', tex: 'scale', texSize: 0.45 });
    V.def(name, humanoid({ name, size: o.size || 0.92, legs: lLeg, back, body, head: headS, arm: armS }));
  }
  lizardman('lizardman', { skin: '#5e9a3a', belly: '#d8d890', crest: '#c8a040', claw: '#e8e0cc', eye: '#f0c830', quiver: '#7a5230', fletch: '#e8e0d0', strap: '#5a3a22',
    loin: '#8a6a3a', belt: '#4a3020', buckle: '#c8a040', bow: '#8a5a2a', tip: '#8a8a80' });
  lizardman('lizard_warrior', { skin: '#2a8a84', belly: '#dce8c8', crest: '#c8382a', claw: '#f0e8d8', eye: '#ffd040', quiver: '#5a2a1e', fletch: '#c8382a', strap: '#3a2418',
    loin: '#a8322a', belt: '#3a2418', buckle: '#e8c050', bow: '#4a2a1a', bowLen: 64, bowTips: '#e8c050', tip: '#c8d0da', cuirass: '#b08a3a', trim: '#e8c050', pad: '#c8963a', greaves: '#c8963a',
    band: '#e8c050', gem: '#30c0b0', tailSpikes: true, size: 0.95 });

  /* ================= Змий / стрекоза =================
     Большая стрекоза с телом змеи: фасеточные глаза, жвалы, две пары прозрачных крыльев,
     длинное членистое тело кольцом до земли. Летун: обе пары крыльев — prop.
     Стрекоза — бирюзово-синяя, с янтарными крыльями в тёмных пятнах, гребнем и жалом на хвосте. */
  /** Крыло стрекозы: основание O, направление d, длина L; жилки вдоль и поперёк, тёмный глазок у кончика. */
  function dfWing(O, d, L, col) {
    d = norm(d[0], d[1]); const n = [d[1], -d[0]], W = L * 0.28;
    const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
    const lines = [{ p: [T(0, -W * 0.18), T(L * 0.5, -W * 0.42), T(L * 0.96, -W * 0.3)], w: 1.3, c: col.vein, a: 0.9 }];
    for (const k of [0.05, 0.25]) lines.push({ p: [T(L * 0.02, k * W), T(L * 0.5, k * W * 0.9 - W * 0.12), T(L * 0.92, k * W * 0.4 - W * 0.12)], w: 0.8, c: col.vein, a: 0.6 });
    for (let i = 1; i < 7; i++) { const t = i / 7.2; lines.push({ p: [T(L * t, -W * 0.44), T(L * (t + 0.03), W * 0.38 * (1 - t * 0.4))], w: 0.6, c: col.vein, a: 0.4 }); }
    const sub = [{ p: [T(L * 0.78, -W * 0.5), T(L * 0.88, -W * 0.46), T(L * 0.87, -W * 0.3), T(L * 0.77, -W * 0.32)], c: col.stig || col.vein, m: 'flat', line: 0 }];
    if (col.spot) sub.push({ p: [T(L * 0.6, -W * 0.6), T(L * 1.1, -W * 0.5), T(L * 1.1, W * 0.5), T(L * 0.66, W * 0.5)], c: col.spot, m: 'gem', line: 0 });
    return { p: [T(-2, -W * 0.14), T(L * 0.3, -W * 0.5), T(L * 0.75, -W * 0.52), T(L * 0.97, -W * 0.3), T(L * 1.02, 0), T(L * 0.9, W * 0.28), T(L * 0.5, W * 0.44), T(L * 0.14, W * 0.34), T(-2, W * 0.12)],
      c: col.mem, m: 'gem', gloss: 1.1, rim: 0.5, line: 0.7, lc: col.vein, lines, sub };
  }
  function serpentFly(name, o) {
    const c = o.body, cD = tone(c, -0.22), bel = o.belly;
    const WF = { mem: tone(o.wing, -0.12), vein: o.vein, stig: o.stig, spot: o.spot && tone(o.spot, -0.15) }, WN = { mem: o.wing, vein: o.vein, stig: o.stig, spot: o.spot };
    const tail = [[112, 122, 32], [88, 134, 30], [68, 152, 27], [58, 176, 24], [62, 198, 20], [80, 213, 16], [104, 219, 12], [124, 214, 8], [136, 203, 5]];
    const bodyS = [
      // членистое змеиное тело кольцом
      { p: tube(tail), c, m: 'skin', tex: 'scale', texSize: 0.55, belly: 0.3, lines: rings(tail, 0.05, 0.95, 1.1, 0.5),
        sub: [{ p: bellyTube(tail, 0.42, 0.3, -1), c: bel, m: 'skin', line: 0 }, { p: tube(tail.map(q => [q[0] + q[2] * 0.1, q[1] - q[2] * 0.36, q[2] * 0.22])), c: o.stripe, m: 'skin', line: 0 }] },
      ...(o.sting ? [{ p: [P(132, 206, 1), P(150, 196), P(158, 180, 1), P(148, 202), P(136, 212, 1)], c: o.sting, m: 'horn', gloss: 1.1, line: 0.7 }] : []),
      ...(o.ridge ? spikes(tail.slice(0, 6).map(q => [q[0] - q[2] * 0.2, q[1] - q[2] * 0.42]), 7, 11, o.ridge, -1) : []),
      // тонкие лапки под грудью
      ...[[118, 124, 110, 142, 116, 156], [130, 126, 132, 146, 142, 156], [142, 122, 154, 138, 166, 144]].map(([x0, y0, x1, y1, x2, y2]) => ({ p: tube([[x0, y0, 5], [x1, y1, 4], [x2, y2, 2.5]]), c: o.leg, m: 'horn', line: 0.6 })),
      // грудь
      { p: ell(130, 110, 23, 19, 12, -0.35), c, m: 'skin', tex: 'scale', texSize: 0.5, belly: 0.35,
        sub: [{ p: ell(132, 124, 18, 9, 10, -0.3), c: bel, m: 'skin', line: 0 }, { p: tube([[112, 100, 7], [130, 92, 8], [148, 96, 6]]), c: o.stripe, m: 'skin', line: 0 }],
        lines: [{ p: [[116, 98], [132, 90], [146, 94]], w: 1.1, light: true, a: 0.5 }] },
    ];
    const headS = [
      { p: tube([[146, 106, 16], [156, 102, 14]]), c: cD, m: 'skin' },
      // жвалы
      { p: [[166, 106], [182, 110], [184, 118, 1], [176, 114], [166, 114]], c: o.jaw, m: 'horn', gloss: 0.9, line: 0.7 },
      { p: [[162, 110], [174, 116], [174, 124, 1], [168, 118], [160, 116]], c: tone(o.jaw, -0.2), m: 'horn', line: 0.6 },
      { e: [162, 100, 15, 13], c, m: 'skin', tex: 'scale', texSize: 0.35, sub: [{ e: [170, 110, 9, 5], c: bel, m: 'skin', line: 0 }] },
      // фасеточные глаза: дальний и ближний
      { e: [156, 86, 9.5, 9], c: tone(o.eye, -0.3), m: 'gem', tex: 'scale', texSize: 0.28, line: 0.7 },
      { e: [165, 92, 11.5, 11], c: o.eye, m: 'gem', tex: 'scale', texSize: 0.3, line: 0.8, gloss: 1.2, glint: [[160, 87, 3.2]] },
      ...(o.horns ? [hornT([[150, 88, 5], [142, 74, 3.5], [140, 62, 1.5]], o.horns), hornT([[158, 84, 5], [158, 70, 3.5], [162, 60, 1.5]], o.horns)] : [{ p: tube([[152, 86, 2.4], [140, 70, 2], [132, 64, 1.4]]), c: DARK, m: 'horn', line: 0 }, { p: tube([[158, 84, 2.4], [154, 66, 2], [148, 58, 1.4]]), c: DARK, m: 'horn', line: 0 }]),
    ];
    const parts = [
      { kind: 'prop', pivot: [124, 100], shapes: [dfWing([124, 100], [-0.5, -1], 112, WF), dfWing([122, 102], [-1, -0.62], 104, WF)] },
      { kind: 'torso', pivot: [120, 150], shapes: bodyS },
      { kind: 'head', pivot: [146, 106], shapes: mapShapes(headS, (x, y) => [146 + (x - 146) * 1.3, 106 + (y - 106) * 1.3], 1.3) },
      { kind: 'prop', pivot: [132, 102], shapes: [dfWing([128, 104], [-1, -0.1], 116, WN), dfWing([132, 100], [-0.16, -1], 118, WN)] },
    ];
    V.def(name, place(name, parts, [113, 230], o.size || 1));
  }
  serpentFly('serpent_fly', { body: '#5e9a36', belly: '#d0dc80', stripe: '#2e5a22', leg: '#3a4a22', jaw: '#c8a040', eye: '#e0281c', wing: '#d8eef2', vein: '#3e6a74', stig: '#2a4a3a' });
  serpentFly('dragon_fly', { body: '#2a7c9e', belly: '#9adcd0', stripe: '#16405a', leg: '#1a2a3a', jaw: '#e8c050', eye: '#ff3a1a', wing: '#f4c860', vein: '#8a4a10', stig: '#6a2a08', spot: '#d0701c',
    sting: '#f0d060', ridge: '#e8c050', horns: '#e8c050' });

  /* ================= Василиск / великий василиск =================
     Длинный приземистый ящер на шести лапах; гребень шипов по хребту, горящий взгляд.
     Великий — бирюзовый, с золотым гребнем, короной рогов на затылке и зелёным огнём в глазу. */
  function basilisk(name, o) {
    const c = o.body, far = tone(c, -0.26), bel = o.belly;
    const bLeg = (x, y, col) => [
      // плечо — вбок и вниз, локоть наружу, запястье над стопой
      { p: tube([[x, y, 34], [x + 16, 176, 23], [x + 6, 200, 15]], { flat0: true }), c: col, m: 'skin', tex: 'scale', texSize: 0.55, belly: 0.25,
        lines: [{ p: [[x + 10, 176], [x + 20, 178]], w: 1, a: 0.4 }] },
      { p: [[x - 7, 197], [x + 12, 196], [x + 26, 205], P(x + 29, 210, 1), P(x - 9, 210, 1)], c: col, m: 'skin', tex: 'scale', texSize: 0.4,
        lines: [{ p: [[x + 8, 202], [x + 10, 210]], w: 0.9, a: 0.5 }, { p: [[x + 17, 203], [x + 19, 210]], w: 0.9, a: 0.5 }] },
      ...[0, 1, 2].map(i => ({ p: [P(x + 20 - i * 9, 206, 1), P(x + 31 - i * 9, 209.5, 1), P(x + 20 - i * 9, 210, 1)], c: o.claw, m: 'horn', line: 0.4 })),
    ];
    const tail = [[70, 146, 42], [44, 160, 32], [24, 178, 21], [10, 195, 12], [2, 205, 5]];
    const ridge = [[60, 146], [90, 128], [130, 120], [172, 120], [206, 128], [222, 140]];
    const lift = list => mapShapes(list, (x, y) => [x, y - 18], 1);   // корпус поднят над лапами
    const bodyS = [
      { p: tube(tail), c, m: 'skin', tex: 'scale', texSize: 0.7, belly: 0.3, sub: [{ p: bellyTube(tail, 0.4, 0.3), c: bel, m: 'skin', line: 0 }] },
      ...spikes(tail.slice(0, 4).map(q => [q[0], q[1] - q[2] * 0.42]), 4, 10, o.crest, -1, o.crestM),
      ...lift([...spikes(ridge, 9, o.spikeH || 22, o.crest, 1, o.crestM),
      { p: [[46, 170], [58, 142], [88, 126], [130, 118], [172, 118], [206, 126], [226, 142], [228, 164], [214, 180], [172, 188], [122, 188], [80, 186], [56, 180]], c, m: 'skin', tex: 'scale', texSize: 0.85, belly: 0.4, id: 'body',
        sub: [{ p: [[56, 178], [120, 172], [180, 174], [228, 158], [234, 198], [50, 198]], c: bel, m: 'skin', line: 0, lines: [0, 1, 2, 3, 4, 5, 6].map(i => ({ p: [[76 + i * 24, 176], [78 + i * 24, 190]], w: 1, a: 0.45 })) },
          ...[0, 1, 2, 3].map(i => ({ p: [[84 + i * 36, 124 - i * 2], [100 + i * 36, 120 - i * 2], [104 + i * 36, 150], [92 + i * 36, 156]], c: o.band, m: 'skin', line: 0 }))],
        lines: [{ p: [[80, 136], [130, 124], [180, 124], [214, 134]], w: 1.5, light: true, a: 0.4 }] }]),
    ];
    const headS = [
      ...(o.crown ? [hornT([[222, 124, 11], [206, 110, 8], [192, 106, 5], [182, 110, 2]], tone(o.crown, -0.15)), hornT([[228, 118, 11], [218, 100, 8], [206, 92, 4.5], [196, 94, 2]], o.crown)] : []),
      { p: tube([[200, 152, 44], [220, 142, 38]]), c, m: 'skin', tex: 'scale', texSize: 0.6 },
      // нижняя челюсть, пасть открыта
      { p: [[222, 150], [248, 148], [276, 148], [286, 152], [274, 162], [248, 168], [226, 164]], c: tone(c, -0.08), m: 'skin', sub: [{ p: [[226, 158], [286, 154], [280, 172], [226, 172]], c: bel, m: 'skin', line: 0 }] },
      { p: [[234, 142], [288, 138], [278, 152], [240, 154]], c: MOUTH, m: 'flat', line: 0.4 },
      ...teeth([250, 153], [278, 151], 4, -5, '#e8e0c8'),
      { p: [[206, 136], [220, 118], [242, 109], [262, 110], [278, 118], [292, 130], [290, 139], [272, 141], [250, 143], [230, 148], [212, 150]], c, m: 'skin', tex: 'scale', texSize: 0.45, id: 'skull',
        lines: [{ p: [[224, 120], [244, 112], [264, 114]], w: 1.2, light: true, a: 0.5 }] },
      ...teeth([240, 142], [288, 138], 6, 5.5, '#f4ecd6'),
      ...spikes([[214, 124], [232, 112], [256, 110]], 3, 12, o.crest, 1, o.crestM),
      ...glow(252, 124, 17, o.glow, 1),
      { p: tube([[240, 118, 7], [254, 114, 8], [266, 118, 5]]), c: tone(c, -0.3), m: 'skin', line: 0.5 },
      reptEye(254, 124, 5.6, o.eye),
      { e: [286, 128, 2.2, 1.6], c: DARK, m: 'flat', line: 0 },
    ];
    // голова крупнее и поднята вместе с корпусом
    const headL = mapShapes(headS, (x, y) => [214 + (x - 214) * 1.16, 128 + (y - 146) * 1.16], 1.16);
    const legs = [
      { kind: 'leg', side: -1, pivot: [90, 144], shapes: bLeg(90, 142, far) }, { kind: 'leg', side: 1, pivot: [148, 144], shapes: bLeg(148, 142, far) }, { kind: 'leg', side: -1, pivot: [206, 144], shapes: bLeg(206, 142, far) },
      { kind: 'leg', side: 1, pivot: [70, 150], shapes: bLeg(70, 148, c) }, { kind: 'leg', side: -1, pivot: [128, 150], shapes: bLeg(128, 148, c) }, { kind: 'leg', side: 1, pivot: [186, 150], shapes: bLeg(186, 148, c) },
    ];
    V.def(name, place(name, [...legs, { kind: 'torso', pivot: [140, 144], shapes: bodyS }, { kind: 'head', pivot: [214, 128], shapes: headL }], [137, 210], o.size || 1.06));
  }
  basilisk('basilisk', { body: '#6a9a3a', belly: '#d8d890', band: '#4a7a2a', crest: '#e8602a', claw: '#f0e8d0', eye: '#ff3a1a', glow: '255,70,30' });
  basilisk('greater_basilisk', { body: '#2a8a80', belly: '#e8e0a8', band: '#1a6260', crest: '#f0c040', crestM: 'gold', claw: '#f8e8b0', eye: '#80ff60', glow: '120,255,90', crown: '#f0c848', spikeH: 28 });

  /* ================= Горгона / могучая горгона =================
     Железный бык: тяжёлый загривок, голова опущена, тело в кованых пластинах, раздвоенные копыта.
     Горгона — медно-ржавая, рога цвета кости; могучая — воронёное железо с золотом,
     золотые рога и кольцо в носу, глаза горят зелёным, из ноздрей — смертоносный пар. */
  function gorgon(name, o) {
    const c = o.plate, far = tone(c, -0.28), lc = o.leg || tone(c, -0.12);
    const bLeg = (top, knee, fet, foot, w, col, thigh) => {
      const out = [];
      if (thigh) out.push({ p: thigh, c: col, m: 'steel', tex: 'scale', texSize: 0.9, gloss: 0.5, belly: 0.3 });
      out.push({ p: tube([[top[0], top[1], w], [knee[0], knee[1], w * 0.62], [fet[0], fet[1], w * 0.44], [foot[0] - 1, foot[1] - 12, w * 0.5]], { flat0: true }), c: col, m: 'steel', tex: 'scale', texSize: 0.55, gloss: 0.5,
        lines: [{ p: [[knee[0] - w * 0.3, knee[1]], [knee[0] + w * 0.3, knee[1] + 2]], w: 1.2, a: 0.5 }] });
      // раздвоенное копыто
      out.push({ p: [[foot[0] - 11, foot[1] - 13], [foot[0] + 1, foot[1] - 14], [foot[0] + 3, foot[1], 1], [foot[0] - 13, foot[1], 1]], c: o.hoof, m: 'horn', line: 0.7 },
        { p: [[foot[0] + 1, foot[1] - 13], [foot[0] + 9, foot[1] - 11], [foot[0] + 13, foot[1], 1], [foot[0] + 2, foot[1], 1]], c: tone(o.hoof, 0.1), m: 'horn', line: 0.7 });
      if (o.cuff) out.push({ p: tube([[fet[0], fet[1] - 6, w * 0.56], [fet[0], fet[1] + 4, w * 0.56]], { flat0: true, flat1: true }), c: o.cuff, m: 'gold', line: 0.5 });
      return out;
    };
    const legs = [
      { kind: 'leg', side: 1, pivot: [96, 150], shapes: bLeg([96, 146], [102, 184], [94, 204], [98, 223], 38, far) },
      { kind: 'leg', side: -1, pivot: [214, 150], shapes: bLeg([214, 150], [222, 188], [220, 206], [226, 223], 34, far) },
      { kind: 'leg', side: -1, pivot: [116, 152], shapes: bLeg([116, 150], [128, 186], [114, 206], [118, 223], 42, c, [[80, 122], [124, 116], [144, 146], [138, 180], [118, 192], [96, 178], [84, 150]]) },
      { kind: 'leg', side: 1, pivot: [236, 154], shapes: bLeg([234, 152], [242, 190], [240, 208], [246, 223], 38, c) },
    ];
    // кованые пластины поперёк спины — как у броненосца; обрезаются контуром корпуса
    const plates = [], top = [[70, 100], [104, 92], [140, 88], [170, 74], [196, 60], [224, 60], [246, 76]];
    for (let i = 0; i < top.length - 1; i++) {
      const [x0] = top[i], [x1] = top[i + 1], pc = i % 2 ? tone(c, 0.06) : c;
      plates.push({ p: [P(x0 - 4, 30, 1), P(x1 + 6, 30, 1), [x1 + 4, 110], [x1 - 2, 146], P(x1 - 6, 160, 1), P(x0 - 10, 162, 1), [x0 - 6, 146], [x0 - 2, 110]], c: pc, m: 'steel', gloss: 0.8, line: 0.9, lc: tone(c, -0.6),
        lines: [{ p: [[x1 + 2, 70], [x1 + 2, 110], [x1 - 4, 150]], w: 1.4, light: true, a: 0.5 }], glint: [[x0 + 2, 120, 1.8], [x0 + 1, 140, 1.8], [x0 + 3, 98, 1.8]] });
      if (o.trim) plates.push({ p: [P(x0 - 12, 150, 1), P(x1 - 6, 148, 1), P(x1 - 8, 162, 1), P(x0 - 12, 164, 1)], c: o.trim, m: 'gold', line: 0.5 });
    }
    const bodyS = [
      // хвост с кисточкой
      { p: tube([[64, 114, 11], [50, 132, 8], [42, 156, 6], [40, 172, 5]]), c: lc, m: 'steel', gloss: 0.5, line: 0.7 },
      { p: [[38, 166], [48, 170], [50, 188], [44, 204, 1], [40, 190], [32, 200, 1], [32, 180]], c: o.tuft, m: 'fur', furLen: 0.9, flow: Math.PI * 0.5 },
      { p: [[56, 138], [60, 112], [78, 96], [112, 92], [146, 88], [176, 72], [204, 58], [230, 62], [250, 82], [262, 112], [260, 150], [246, 178], [208, 184], [160, 176], [118, 178], [84, 172], [62, 158]], c: tone(c, -0.18), m: 'steel', tex: 'scale', texSize: 0.7, gloss: 0.4, belly: 0.45, id: 'body',
        sub: plates, lines: [{ p: [[80, 104], [130, 96], [180, 80], [220, 66]], w: 1.6, light: true, a: 0.45 }] },
      ...(o.ridge ? spikes([[150, 88], [176, 72], [204, 58], [230, 62]], 4, 14, o.ridge, 1, 'gold') : []),
    ];
    const headS = [
      hornT([[286, 104, 12], [290, 82, 9], [302, 68, 5.5], [316, 64, 2]], tone(o.horn, -0.25), o.hornTip && tone(o.hornTip, -0.2)),
      { p: [[246, 150], [240, 118], [252, 100], [274, 96], [292, 102], [306, 116], [316, 132], [322, 146], [316, 158], [298, 162], [282, 156], [266, 162], [250, 164]], c, m: 'steel', tex: 'scale', texSize: 0.6, gloss: 0.6, id: 'skull',
        sub: [{ p: [[300, 128], [330, 140], [330, 168], [296, 166]], c: o.muzzle, m: 'steel', gloss: 0.9, line: 0 }],
        lines: [{ p: [[258, 106], [280, 100], [298, 108]], w: 1.2, light: true, a: 0.5 }, { p: [[276, 128], [292, 140], [300, 156]], w: 1.2, a: 0.4 }] },
      { p: [[256, 104], [276, 98], [296, 106], [310, 124], [300, 128], [282, 118], [262, 116]], c: tone(c, 0.08), m: 'steel', gloss: 0.9, line: 0.8, lc: tone(c, -0.6), glint: [[270, 104, 1.6], [290, 110, 1.6]] },
      { p: [[304, 156], [322, 156], [320, 162, 1], [304, 162]], c: '#1a1210', m: 'flat', line: 0 },
      { e: [316, 146, 3.2, 2.4], c: '#140c08', m: 'flat', line: 0 },
      // ухо назад
      { p: [[262, 110], [242, 104, 1], [258, 118]], c: far, m: 'steel', line: 0.7 },
      ...(o.eyeGlow ? glow(284, 118, 15, o.eyeGlow, 1) : []),
      { e: [284, 118, 4.4, 3.6], c: o.eye, m: 'gem', line: 0.6, glint: [[283, 116.6, 1.4]] },
      { p: [[274, 110], [292, 108], [296, 113], [278, 115]], c: tone(c, -0.45), m: 'steel', line: 0 },
      hornT([[272, 106, 15], [262, 86, 11], [268, 66, 7.5], [286, 54, 4], [298, 56, 1.8]], o.horn, o.hornTip),
    ];
    if (o.ring) headS.push({ p: tube([[314, 150, 3.4], [312, 164, 3.4], [320, 170, 3.4], [326, 162, 3.4], [322, 150, 3.4]]), c: o.ring, m: 'gold', line: 0.5, glint: [[316, 168, 1.3]] });
    if (o.breath) {
      // пар из ноздрей клубами
      [[334, 156, 8], [348, 150, 10], [364, 146, 12], [380, 148, 10]].forEach(([x, y, r], i) => headS.push({ e: [x, y, r, r * 0.8], c: 'rgba(' + o.breath + ',' + (0.55 - i * 0.1).toFixed(2) + ')', m: 'flat', line: 0 }));
    }
    const headL = mapShapes(headS, (x, y) => [252 + (x - 252) * 1.18, 128 + (y - 128) * 1.18], 1.18);
    const parts = [...legs, { kind: 'torso', pivot: [160, 150], shapes: bodyS }, { kind: 'head', pivot: [252, 128], shapes: headL }];
    V.def(name, place(name, parts, [153, 223], o.size || 1));
  }
  gorgon('gorgon', { plate: '#b0703c', leg: '#8a5a38', muzzle: '#c88a58', hoof: '#2a201a', horn: '#ece2c8', hornTip: '#8a7a5a', eye: '#f0c030', tuft: '#3a2a1e' });
  gorgon('mighty_gorgon', { plate: '#4a5666', leg: '#3a4450', muzzle: '#6a7a8a', hoof: '#1a1a20', horn: '#f0c848', hornTip: '#8a5a1a', eye: '#b0ff70', eyeGlow: '140,255,90', tuft: '#1a1a20',
    trim: '#d8a53a', cuff: '#d8a53a', ring: '#e8c050', breath: '150,240,120', ridge: '#e8c050' });

  /* ================= Виверна / монарх виверн =================
     Стоит на двух лапах; перепончатые крылья вскинуты, длинная шея, хвост к земле с жалом.
     Монарх — изумрудный, с золотыми рогами-короной, шипами по хребту и жалом, с которого капает яд. */
  function wyvern(name, o) {
    const c = o.body, far = tone(c, -0.26), bel = o.belly;
    const wLeg = (dx, dy, col) => {
      const X = x => x + dx, Y = y => y + dy, G = 317;
      const toes = [[250, 0], [240, 1], [228, 2]].map(([tx, i]) => ({ p: tube([[X(214), Y(298), 11], [X((214 + tx) / 2 + 2), G - 8, 9], [X(tx), G - 4, 6]]), c: col, m: 'skin', tex: 'scale', texSize: 0.35, line: 0.6 }));
      const claws = [250, 240, 228].map(tx => ({ p: [P(X(tx) - 2, G - 8, 1), P(X(tx) + 9, G - 1, 1), P(X(tx) - 1, G, 1)], c: o.claw, m: 'horn', line: 0.5 }));
      return [
        { p: [P(X(204), G - 5, 1), P(X(192), G, 1), P(X(206), G - 1, 1)], c: o.claw, m: 'horn', line: 0.5 },
        { p: tube([[X(228), Y(236), 28], [X(212), Y(274), 19], [X(214), Y(300), 14]]), c: col, m: 'skin', tex: 'scale', texSize: 0.5 },
        ...toes, ...claws,
        { p: [[X(184), Y(196)], [X(224), Y(192)], [X(244), Y(214)], [X(242), Y(240)], [X(226), Y(252)], [X(206), Y(240)], [X(188), Y(220)]], c: col, m: 'skin', tex: 'scale', texSize: 0.7, belly: 0.3 },
      ];
    };
    const tail = [[160, 214, 40], [124, 228, 32], [92, 248, 24], [62, 272, 18], [38, 292, 13], [18, 300, 9], [6, 294, 6]];
    const neck = [[244, 164, 50], [266, 130, 38], [282, 102, 30], [296, 82, 26]];
    const bodyS = [
      { p: tube(tail), c, m: 'skin', tex: 'scale', texSize: 0.7, belly: 0.3, sub: [{ p: bellyTube(tail, 0.4, 0.3), c: bel, m: 'skin', line: 0, lines: rings(tail, 0, 0.8, 1, 0.4) }] },
      // жало: изогнутый клинок на конце хвоста
      { p: [P(12, 300, 1), P(-2, 290), P(-8, 270, 1), P(4, 282), P(14, 288, 1)], c: o.sting, m: 'horn', gloss: 1.2, line: 0.8, glint: [[0, 282, 1.6]] },
      { p: [P(8, 296, 1), P(-10, 300, 1), P(4, 304, 1)], c: o.sting, m: 'horn', line: 0.6 },
      ...(o.venom ? [{ e: [-9, 280, 3, 4.4], c: o.venom, m: 'gem', line: 0.4, glint: [[-10, 278, 1.2]] }, { e: [-6, 292, 2.2, 3.2], c: o.venom, m: 'gem', line: 0.4 }] : []),
      ...(o.ridge ? spikes(tail.slice(0, 5).map(q => [q[0], q[1] - q[2] * 0.45]), 6, 12, o.ridge, -1) : []),
      { p: [[140, 208], [150, 180], [184, 160], [220, 146], [250, 144], [270, 158], [268, 186], [250, 210], [220, 228], [184, 234], [154, 228]], c, m: 'skin', tex: 'scale', texSize: 0.85, belly: 0.4,
        sub: [{ p: [[180, 232], [222, 222], [262, 196], [276, 180], [280, 240], [176, 244]], c: bel, m: 'skin', line: 0, lines: [0, 1, 2, 3].map(i => ({ p: [[200 + i * 18, 232 - i * 10], [206 + i * 18, 240]], w: 1, a: 0.45 })) }],
        lines: [{ p: [[160, 184], [196, 162], [236, 150]], w: 1.5, light: true, a: 0.4 }] },
      ...(o.ridge ? spikes([[152, 184], [184, 162], [220, 148], [248, 146]], 5, 14, o.ridge, 1) : []),
      { p: tube(neck), c, m: 'skin', tex: 'scale', texSize: 0.65,
        sub: [{ p: bellyTube(neck, 0.44, 0.3), c: bel, m: 'skin', line: 0, lines: rings(neck, 0, 1, 1, 0.45) }] },
      ...(o.ridge ? spikes(neck.map(q => [q[0] - q[2] * 0.38, q[1] - q[2] * 0.22]), 4, 11, o.ridge, 1) : []),
    ];
    const headS = [
      hornT([[298, 70, 9], [282, 58, 6.5], [268, 54, 2.5]], tone(o.horn, -0.2)),
      { p: [[302, 94], [330, 92], [352, 94], [350, 102], [330, 106], [306, 106]], c: tone(c, -0.08), m: 'skin', sub: [{ p: [[306, 100], [352, 98], [350, 110], [306, 110]], c: bel, m: 'skin', line: 0 }] },
      { p: [[310, 88], [356, 86], [350, 96], [312, 98]], c: MOUTH, m: 'flat', line: 0.4 },
      ...teeth([314, 97], [346, 96], 4, -4, '#e8e0c8'),
      { p: [[286, 86], [292, 66], [310, 56], [332, 58], [350, 68], [362, 78], [360, 86], [340, 88], [314, 90], [298, 98]], c, m: 'skin', tex: 'scale', texSize: 0.45, id: 'skull',
        lines: [{ p: [[298, 66], [318, 60], [340, 64]], w: 1.1, light: true, a: 0.5 }] },
      ...teeth([316, 89], [356, 86], 5, 4.5, '#f4ecd6'),
      { p: [[292, 84], [278, 90, 1], [290, 94], [282, 104, 1], [296, 98]], c: o.horn, m: 'horn', line: 0.6 },
      { p: tube([[306, 66, 6], [320, 62, 7], [330, 66, 4]]), c: tone(c, -0.3), m: 'skin', line: 0.5 },
      reptEye(320, 70, 4.6, o.eye),
      { e: [356, 76, 2, 1.4], c: DARK, m: 'flat', line: 0 },
      hornT([[306, 62, 10], [292, 44, 7], [276, 36, 2.5]], o.horn, o.hornTip),
      ...(o.crown ? [hornT([[316, 60, 7], [314, 42, 5], [306, 30, 2]], o.horn, o.hornTip), hornT([[298, 70, 7], [280, 72, 5], [266, 66, 2]], o.horn)] : []),
    ];
    const Wn = { mem: o.mem, bone: o.bone, claw: o.claw }, Wf = { mem: tone(o.mem, -0.22), bone: tone(o.bone, -0.22), claw: o.claw };
    const parts = [
      { kind: 'prop', pivot: [230, 154], shapes: wing.bat([230, 154], [0.16, -1], 168, Wf) },
      { kind: 'leg', side: 1, pivot: [194, 206], shapes: wLeg(-20, -4, far) },
      { kind: 'leg', side: -1, pivot: [214, 210], shapes: wLeg(0, 0, c) },
      { kind: 'torso', pivot: [200, 200], shapes: bodyS },
      { kind: 'head', pivot: [290, 96], shapes: headS },
      { kind: 'prop', pivot: [214, 162], shapes: wing.bat([214, 162], [-0.46, -0.9], 186, Wn) },
    ];
    V.def(name, place(name, parts, [203, 317], o.size || 1));
  }
  wyvern('wyvern', { body: '#2a8a84', belly: '#b0e0c8', mem: '#1e5e5c', bone: '#7ac8b8', claw: '#f0e8d0', sting: '#f0ece0', horn: '#e8e0c8', hornTip: '#8a7a60', eye: '#f0c830' });
  wyvern('wyvern_monarch', { body: '#4a9a34', belly: '#e8e08a', mem: '#2c6a24', bone: '#b8d860', claw: '#f0c848', sting: '#f0c030', horn: '#f0c848', hornTip: '#8a5a1a', eye: '#ff5a2a',
    venom: '#a8f040', ridge: '#e8b838', crown: true });

  /* ================= Гидра / гидра хаоса =================
     Грузное тело на коротких лапах, веер шей с головами. Каждая шея — своя голова-часть
     с креплением у основания; дальние шеи рисуются за корпусом.
     Хаоса — багровая, семь голов с чёрными рогами и горящими глазами, шипы по шеям. */
  function hydra(name, o) {
    const c = o.body, far = tone(c, -0.26), bel = o.belly;
    const hLeg = (x, y, col) => [
      { p: tube([[x, y, 48], [x - 6, y + 26, 34], [x - 2, 298, 28]], { flat0: true, flat1: true }), c: col, m: 'skin', tex: 'scale', texSize: 0.6, belly: 0.25 },
      { p: [[x - 20, 294], [x + 10, 292], [x + 24, 302], P(x + 27, 310, 1), P(x - 22, 310, 1)], c: col, m: 'skin', tex: 'scale', texSize: 0.4 },
      ...[0, 1, 2].map(i => ({ p: [P(x + 16 - i * 10, 305, 1), P(x + 29 - i * 10, 309.5, 1), P(x + 16 - i * 10, 310, 1)], c: o.claw, m: 'horn', line: 0.4 })),
    ];
    /** Голова на шее: основание b, изгиб m, голова h; k — размер, open — насколько открыта пасть. */
    const neckHead = (b, m, h, k, open, dark) => {
      const col = dark ? far : c, [hx, hy] = h, K2 = v => v * k;
      const nk = [[b[0], b[1], 36 * k], [m[0], m[1], 28 * k], [hx - K2(8), hy + K2(8), 21 * k]];
      const out = [{ p: tube(nk, { flat0: dark }), c: col, m: 'skin', tex: 'scale', texSize: 0.55, sub: [{ p: bellyTube(nk, 0.42, 0.3), c: dark ? tone(bel, -0.2) : bel, m: 'skin', line: 0, lines: rings(nk, 0.1, 1, 1, 0.4) }] }];
      if (o.spikes) out.push(sawRidge(nk.map(q => [q[0] - q[2] * 0.2, q[1] - q[2] * 0.4]), 4, 9 * k, o.spikes, 1));
      const Hd = pts => pts.map(q => P(hx + q[0] * k, hy + q[1] * k, q[2]));
      if (o.horns) out.push(hornT(Hd([[-6, -8, 7], [-18, -18, 5], [-28, -20, 2]]).map((q, i) => [q[0], q[1], [7, 5, 2][i] * k]), dark ? tone(o.horns, -0.2) : o.horns));
      out.push(
        { p: Hd([[-2, 10], [20, 8 + open * 0.3], [38, 10 + open], [36, 16 + open], [18, 20 + open * 0.6], [0, 18]]), c: tone(col, -0.1), m: 'skin', sub: [{ p: Hd([[0, 15], [40, 14 + open], [36, 24 + open], [0, 24]]), c: bel, m: 'skin', line: 0 }] },
        { p: Hd([[8, 6], [42, 3], [38, 10 + open], [10, 12]]), c: MOUTH, m: 'flat', line: 0.4 },
        ...teeth(Hd([[16, 11 + open * 0.6]])[0], Hd([[36, 10 + open]])[0], 3, -3.5 * k, '#e8e0c8'),
        { p: Hd([[-14, 8], [-12, -6], [2, -14], [20, -13], [34, -7], [44, 0], [42, 5], [26, 6], [8, 9], [-6, 14]]), c: col, m: 'skin', tex: 'scale', texSize: 0.35,
          lines: [{ p: Hd([[-4, -8], [12, -12], [28, -8]]), w: 1, light: true, a: 0.5 }] },
        ...teeth(Hd([[12, 6]])[0], Hd([[42, 3]])[0], 4, 4 * k, '#f4ecd6'),
        ...(o.glow ? [{ e: [hx + 12 * k, hy - 4 * k, 8 * k, 8 * k], c: 'rgba(' + o.glow + ',0.3)', m: 'flat', line: 0 }] : []),
        reptEye(hx + 12 * k, hy - 4 * k, 3.4 * k, o.eye),
        ...(dark ? [] : [{ p: tube(Hd([[2, -9, 4], [12, -11, 4.5], [20, -8, 3]])), c: tone(col, -0.3), m: 'skin', line: 0.4 }, { e: [hx + 39 * k, hy - 1 * k, 1.6 * k, 1.1 * k], c: DARK, m: 'flat', line: 0 }]),
        // гребень-бахрома за челюстью
        { p: Hd([[-10, 4], [-22, 0, 1], [-14, 10], [-24, 14, 1], [-10, 16]]), c: o.frill, m: 'skin', line: 0.6 });
      return out;
    };
    const tail = [[100, 250, 44], [72, 264, 34], [48, 282, 23], [30, 298, 13], [16, 306, 6]];
    const bodyS = [
      { p: tube(tail), c, m: 'skin', tex: 'scale', texSize: 0.75, belly: 0.3, sub: [{ p: bellyTube(tail, 0.4, 0.3), c: bel, m: 'skin', line: 0 }] },
      ...(o.spikes ? spikes(tail.slice(0, 4).map(q => [q[0], q[1] - q[2] * 0.42]), 4, 11, o.spikes, -1) : []),
      { p: [[84, 262], [92, 226], [122, 200], [168, 190], [214, 196], [250, 216], [266, 246], [258, 274], [226, 290], [176, 294], [126, 290], [96, 280]], c, m: 'skin', tex: 'scale', texSize: 0.95, belly: 0.45,
        sub: [{ p: [[110, 286], [150, 276], [210, 278], [264, 256], [270, 300], [100, 300]], c: bel, m: 'skin', line: 0, lines: [0, 1, 2, 3, 4].map(i => ({ p: [[128 + i * 26, 280], [130 + i * 26, 296]], w: 1, a: 0.45 })) },
          ...[[120, 226, 10], [150, 212, 12], [104, 250, 8], [140, 244, 9], [190, 214, 9]].map(([x, y, r]) => ({ e: [x, y, r, r * 0.7], c: o.spot, m: 'skin', line: 0 }))],
        lines: [{ p: [[104, 226], [140, 204], [190, 196]], w: 1.6, light: true, a: 0.4 }] },
    ];
    const heads = o.heads;
    const farH = heads.filter(q => q.far), nearH = heads.filter(q => !q.far);
    const parts = [
      { kind: 'leg', side: 1, pivot: [120, 262], shapes: hLeg(120, 256, far) },
      { kind: 'leg', side: -1, pivot: [228, 262], shapes: hLeg(228, 256, far) },
      ...farH.map(q => ({ kind: 'head', pivot: q.b, shapes: neckHead(q.b, q.m, q.h, q.k || 1, q.open || 0, true) })),
      { kind: 'leg', side: -1, pivot: [138, 268], shapes: hLeg(138, 262, c) },
      { kind: 'leg', side: 1, pivot: [244, 268], shapes: hLeg(244, 262, c) },
      { kind: 'torso', pivot: [176, 250], shapes: bodyS },
      ...nearH.map(q => ({ kind: 'head', pivot: q.b, shapes: neckHead(q.b, q.m, q.h, q.k || 1, q.open || 0, false) })),
    ];
    V.def(name, place(name, parts, [170, 310], o.size || 1));
  }
  const H5 = [
    { b: [168, 212], m: [136, 160], h: [118, 98], far: true, open: 3 },
    { b: [190, 204], m: [178, 132], h: [176, 62], far: true, open: 6 },
    { b: [210, 210], m: [228, 144], h: [236, 78], open: 4 },
    { b: [226, 220], m: [266, 178], h: [284, 122], open: 8 },
    { b: [234, 236], m: [272, 232], h: [304, 188], open: 5, k: 1.05 },
  ];
  hydra('hydra', { body: '#5e7a36', belly: '#d8c070', spot: '#3e5626', claw: '#ece2c8', eye: '#f0d030', frill: '#b89040', heads: H5, size: 1.04 });
  hydra('chaos_hydra', { body: '#a8281e', belly: '#f0a040', spot: '#6a1410', claw: '#2a1a14', eye: '#ffe040', glow: '255,200,60', frill: '#2a1410', horns: '#2a1a14', spikes: '#2a1a14', size: 1.06,
    heads: [
      { b: [158, 214], m: [118, 186], h: [86, 138], far: true, open: 4, k: 0.95 },
      { b: [172, 208], m: [138, 150], h: [126, 86], far: true, open: 3 },
      { b: [192, 204], m: [180, 120], h: [178, 48], far: true, open: 6 },
      { b: [206, 206], m: [218, 136], h: [230, 66], open: 5 },
      { b: [222, 214], m: [256, 162], h: [274, 106], open: 8 },
      { b: [232, 228], m: [276, 210], h: [302, 160], open: 5, k: 1.05 },
      { b: [236, 246], m: [264, 258], h: [302, 226], open: 7, k: 0.95 },
    ] });
})(typeof window !== 'undefined' ? window : globalThis);
