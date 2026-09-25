/* ============================================================================
   view/vec_factory.js — Фабрика на рисованном конвейере.
   Полурослик, механик, армадилл, автоматон, песчаный червь, стрелок, коатль
   и их улучшения. Краски фракции — медь, латунь, ржавчина, пустынная охра,
   выбеленные рубахи и кожаные жилеты; металл — gold/steel, заклёпки — glint.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   с другой гаммой и своей деталью (гранаты, сварочная маска, колокол, щит…).
   Гуманоиды рисуются в каноне (земля y=246, центр x=100) и вписываются place();
   звери и червь — прямо в рамке старого спрайта (placeAt).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, move, rot, ell, lerp, along, weapon, head, arm, leg, torso, humanoid, wing, fit, frameOf, mapShapes, tone, H } = K;

  /* ---------- краски фракции ---------- */
  const COPPER = '#c0703c', BRASS = '#d4a444', RUST = '#9a4a26', OCHRE = '#d4a868', SAND = '#dcb878',
    SHIRT = '#ece4d0', VEST = '#6a4428', IRON = '#5a5e66', STEEL = '#aab2bc', DARK = '#1a120c', SKIN = '#e8b890';
  const FIRE = { out: '#d63a18', mid: '#ff8a2a', core: '#ffd050', edge: '#7a1a0a' };
  const BLUEF = { out: '#2a6ae0', mid: '#58b8ff', core: '#e0f6ff', edge: '#16307a' };

  /* ---------- помощники ---------- */
  const FB = { w: 200, h: 250, anchor: [100, 246] };
  /** Вписать части из канона гуманоида (земля y=246, центр x=100+dx) в рамку старого спрайта. */
  function place(name, parts, size, dx) {
    const to = frameOf(name) || FB;
    return fit(parts, { ground: [100 + (dx || 0), 246] }, to, to.anchor[1] / 246 * (size || 1));
  }
  /** Вписать зверя, нарисованного в своей рамке (ground — точка опоры), в рамку старого спрайта. */
  function placeAt(name, parts, ground, size) {
    const to = frameOf(name) || { w: ground[0] * 2, h: ground[1] + 4, anchor: ground };
    return fit(parts, { ground, height: ground[1] }, to, to.anchor[1] / ground[1] * (size || 1));
  }
  /** Заклёпки: блики-точки по списку [x, y]. */
  const rivets = (pts, r) => pts.map(q => [q[0], q[1], r || 2.2]);
  /** Отразить формы по вертикали x = cx (крыло в другую сторону); фактура тоже отражается. */
  function mirror(list, cx) {
    const fl = s => { const o = Object.assign({}, s); if (s.flow !== undefined) o.flow = Math.PI - s.flow; if (s.sub) o.sub = s.sub.map(fl); return o; };
    return mapShapes(list, (x, y) => [2 * cx - x, y], 1).map(fl);
  }
  /** Ряд зубов вдоль линии a→b, остриём на len по нормали (len < 0 — в другую сторону). */
  function teeth(a, b, n, len, c) {
    const out = [], [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = -ty, ny = tx;
    for (let i = 0; i < n; i++) {
      const t0 = (i + 0.12) / n, t1 = (i + 0.88) / n, p0 = lerp(a, b, t0), p1 = lerp(a, b, t1), m = lerp(a, b, (t0 + t1) / 2);
      out.push({ p: [P(...p0, 1), P(m[0] + nx * len, m[1] + ny * len, 1), P(...p1, 1)], c: c || '#f0e8d4', m: 'horn', line: 0.4 });
    }
    return out;
  }
  /** Шестерня: n зубьев, радиус r, ступица. */
  function gear(cx, cy, r, n, c, o) {
    o = o || {}; const pts = [], k = r * 0.78;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + (o.a || 0), da = Math.PI / n;
      pts.push(P(cx + Math.cos(a - da * 0.5) * k, cy + Math.sin(a - da * 0.5) * k, 1), P(cx + Math.cos(a - da * 0.32) * r, cy + Math.sin(a - da * 0.32) * r, 1),
        P(cx + Math.cos(a + da * 0.32) * r, cy + Math.sin(a + da * 0.32) * r, 1), P(cx + Math.cos(a + da * 0.5) * k, cy + Math.sin(a + da * 0.5) * k, 1));
    }
    return [{ p: pts, c, m: o.m || 'gold', line: 0.6, sub: [{ e: [cx, cy, r * 0.5, r * 0.5], c: tone(c, -0.25), m: o.m || 'gold', line: 0 }] },
      { e: [cx, cy, r * 0.26, r * 0.26], c: tone(c, 0.15), m: o.m || 'gold', line: 0.5, glint: [[cx - r * 0.08, cy - r * 0.08, r * 0.1]] }];
  }
  /** Язык пламени (как в Инферно): основание B, направление ang, длина, ширина, изгиб. */
  function tongue(B, ang, len, wid, bend) {
    const c = Math.cos(ang), s = Math.sin(ang), at = (t, w, f) => P(B[0] + c * len * t - s * wid * w, B[1] + s * len * t + c * wid * w, f), b = bend || 0;
    const co = t => b * (1.1 * t * t - 0.35 * Math.sin(Math.PI * 2 * t)), hw = t => 0.55 * Math.pow(1 - t, 0.75) * (0.85 + 0.35 * Math.sin(Math.PI * t * 0.9));
    const L = [], R = [];
    for (const t of [0, 0.18, 0.36, 0.54, 0.72, 0.86]) { L.push(at(t, co(t) - hw(t))); R.push(at(t, co(t) + hw(t))); }
    return [at(-0.08, co(0)), ...L, at(1, co(1), 1), ...R.reverse()];
  }
  /** Пламя тремя слоями (внешний, средний, ядро): основание B, направление ang. */
  function fire(B, ang, len, wid, col, o) {
    o = o || {}; const n = o.n || 3, out = [], sp = o.spread === undefined ? 0.4 : o.spread, nx = -Math.sin(ang), ny = Math.cos(ang);
    const layer = (c, kl, kw, cnt, line) => {
      for (let i = 0; i < cnt; i++) {
        const f = cnt === 1 ? 0 : i / (cnt - 1) - 0.5, L = len * kl * (1 - Math.abs(f) * 0.5);
        out.push({ p: tongue([B[0] + nx * f * wid * 0.6, B[1] + ny * f * wid * 0.6], ang + f * sp, L, wid * kw / Math.max(1, cnt * 0.55), f < 0 ? 0.4 : f > 0 ? -0.4 : 0.25), c, m: 'flat', line, lc: col.edge });
      }
    };
    layer(col.out, 1, 1, n, 0.7); layer(col.mid, 0.74, 0.72, Math.max(1, n - 1), 0); layer(col.core, 0.46, 0.5, Math.max(1, n - 2), 0);
    return out;
  }
  /** Облачко пара/дыма: несколько полупрозрачных кругов. */
  const puff = (pts, rgb, a) => pts.map(([x, y, r], i) => ({ e: [x, y, r, r * 0.86], c: 'rgba(' + rgb + ',' + (a * (1 - i * 0.12)).toFixed(2) + ')', m: 'flat', line: 0 }));
  /** Широкополая шляпа (ковбойская): поля загнуты по краям, тулья с заломом. o: { c, band, flat — плоские поля } */
  function cowHat(hx, hy, o) {
    const c = o.c, up = o.flat ? 0 : 1;
    return [
      { p: [[hx - 46, hy - 12 - up * 8], [hx - 30, hy - 14], [hx, hy - 13], [hx + 32, hy - 17], [hx + 50, hy - 22 - up * 6], [hx + 48, hy - 13, 1], [hx + 20, hy - 6], [hx - 16, hy - 5], [hx - 44, hy - 6, 1]], c: tone(c, -0.08), m: o.m || 'leather', id: 'brim',
        lines: [{ p: [[hx - 38, hy - 10], [hx, hy - 9], [hx + 40, hy - 15]], w: 1, light: true, a: 0.4 }] },
      { p: [[hx - 25, hy - 13], [hx - 24, hy - 36], [hx - 12, hy - 46], [hx + 2, hy - 40], [hx + 14, hy - 47], [hx + 25, hy - 38], [hx + 27, hy - 15]], c, m: o.m || 'leather', id: 'crown',
        lines: [{ p: [[hx + 2, hy - 40], [hx + 4, hy - 26]], w: 1.2, a: 0.45 }],
        sub: [{ p: [[hx - 30, hy - 23], [hx + 30, hy - 25], [hx + 30, hy - 16], [hx - 30, hy - 14]], c: o.band, m: o.bandM || 'leather', line: 0.6 }] },
    ];
  }
  /** Револьвер в кисти hand, ствол по dir. */
  function revolver(hand, dir, o) {
    o = o || {}; const at = along(hand, dir), L = o.len || 30, mt = o.metal || '#7a7e88';
    return [
      { p: [at(-3, -3), at(5, -3), at(2, 6), P(...at(-4, 15), 1), at(-11, 13), at(-8, 4)], c: o.grip || '#7a4a26', m: 'wood', line: 0.7 },
      { p: tube([[...at(-2, -6.5), 7], [...at(L, -6.5), 5]], { flat1: true }), c: mt, m: 'steel', gloss: 1.2, line: 0.7, lines: [{ p: [at(4, -8.5), at(L - 2, -8)], w: 0.9, light: true, a: 0.8 }] },
      { p: ell(...at(8, -4.5), 7, 5.5, 10), c: tone(mt, 0.08), m: 'steel', gloss: 1.1, line: 0.7, lines: [{ p: [at(4, -6), at(12, -6)], w: 0.9, a: 0.6 }, { p: [at(4, -2.5), at(12, -2.5)], w: 0.9, a: 0.6 }] },
      { p: [P(...at(-4, -8), 1), P(...at(-9, -13), 1), P(...at(-2, -9), 1)], c: mt, m: 'steel', line: 0.5 },
      { p: [P(...at(L - 3, -9), 1), P(...at(L - 1, -12), 1), P(...at(L, -9), 1)], c: mt, m: 'steel', line: 0.4 },
    ];
  }

  /* ================= Полурослик / гренадёр =================
     Коренастый, большеголовый, короткие ноги, босые мохнатые ступни. */
  function halfling(name, o) {
    const sk = SKIN, skD = tone(sk, -0.18), hair = o.hair;
    const hLeg = (hip, foot, side) => {
      const d = side < 0 ? -0.18 : 0, pc = tone(o.pants, d), sc = tone(sk, d), knee = [hip[0] + 5, 222], ank = [foot[0] - 2, foot[1] - 9];
      return [
        { p: tube([[knee[0], knee[1] - 4, 15], [ank[0], ank[1], 12]]), c: sc, m: 'skin' },
        // стопа: большая, пальцы вперёд, мохнатый верх
        { p: [[ank[0] - 11, ank[1] - 2], [ank[0] + 6, ank[1] - 5], [foot[0] + 16, foot[1] - 7], [foot[0] + 23, foot[1] - 3], P(foot[0] + 23, foot[1], 1), P(ank[0] - 13, foot[1], 1)], c: sc, m: 'skin',
          lines: [{ p: [[foot[0] + 12, foot[1] - 5], [foot[0] + 13, foot[1]]], w: 0.9, a: 0.5 }, { p: [[foot[0] + 17, foot[1] - 5], [foot[0] + 18, foot[1]]], w: 0.9, a: 0.5 }] },
        { p: [[ank[0] - 3, ank[1] - 5], [ank[0] + 8, ank[1] - 7], [foot[0] + 11, foot[1] - 8], P(foot[0] + 6, foot[1] - 5, 1), P(ank[0] + 4, foot[1] - 6, 1), P(ank[0] - 2, foot[1] - 7, 1)], c: tone(hair, d + 0.12), m: 'fur', furLen: 0.4, flow: 0.2, line: 0.4 },
        // бриджи до колена с отворотом
        { p: tube([[hip[0], hip[1] - 6, 27], [knee[0], knee[1] - 4, 22]], { flat0: true }), c: pc, m: 'cloth', lines: [{ p: [[hip[0] + 4, hip[1] + 4], [knee[0] + 2, knee[1] - 8]], w: 1, a: 0.35 }] },
        { p: tube([[knee[0] - 12, knee[1] - 5, 7], [knee[0] + 12, knee[1] - 3, 7]]), c: tone(pc, -0.12), m: 'cloth', line: 0.6 },
      ];
    };
    const hx = 108, hy = 90, r = 27;
    const coat = o.coat;
    const body = [
      // дальняя рука — вдоль тела, кисть на поясе
      ...arm([82, 132], [72, 158], [82, 180], { c: tone(coat ? o.coat : SHIRT, -0.16), hand: skD, w: 15 }),
      // рубаха-торс с брюшком
      { p: [[76, 124], [126, 122], [138, 138], [143, 162], [136, 188], [80, 190], [70, 166], [68, 140]], c: SHIRT, m: 'cloth', id: 'shirt', belly: 0.2,
        lines: [{ p: [[112, 130], [116, 182]], w: 1, a: 0.3 }] },
      ...(coat
        ? [{ p: [[72, 124], [128, 122], [140, 138], [145, 164], [140, 200], [120, 204], [110, 190], [100, 204], [78, 202], [70, 170], [66, 140]], c: coat, m: 'cloth', id: 'coat', belly: 0.25,
          lines: [{ p: [[108, 128], [110, 194]], w: 1.4, a: 0.5 }, { p: [[84, 150], [80, 196]], w: 1, a: 0.3 }], glint: rivets([[116, 138], [118, 152], [118, 166], [104, 140], [104, 154]], 2.2) },
          { p: [[98, 122], [120, 120], [122, 132], [110, 142], [96, 132]], c: o.scarf, m: 'cloth', line: 0.7 },
          { p: [[110, 136], [124, 138], [128, 158, 1], [116, 150], [108, 156, 1]], c: tone(o.scarf, -0.1), m: 'cloth', line: 0.6 }]
        : [{ p: [[72, 126], [104, 122], [108, 188], [80, 190], [70, 166], [66, 140]], c: o.vest, m: 'cloth', id: 'vest', belly: 0.2, lines: [{ p: [[88, 132], [86, 184]], w: 1, a: 0.3 }] },
          { p: [[116, 122], [128, 124], [140, 140], [144, 162], [136, 188], [118, 188]], c: o.vest, m: 'cloth', glint: rivets([[120, 140], [121, 156], [121, 172]], 2.4) }]),
      // пояс с пряжкой
      { p: [[74, 178], [140, 176], [141, 187], [74, 189]], c: VEST, m: 'leather', sub: [{ p: [P(114, 175, 1), P(126, 175, 1), P(126, 189, 1), P(114, 189, 1)], c: BRASS, m: 'gold', line: 0.5 }] },
      ...(o.grenades ? [
        { p: tube([[80, 128, 6], [110, 158, 6], [138, 184, 6]]), c: tone(VEST, 0.1), m: 'leather', line: 0.6 },
        ...[[92, 142], [106, 156], [122, 170]].map(([x, y]) => ({ e: [x, y + 2, 7, 7], c: IRON, m: 'steel', gloss: 0.9, line: 0.6, glint: [[x - 2, y, 1.8]] })),
        ...[[92, 142], [106, 156], [122, 170]].map(([x, y]) => ({ p: [P(x - 2.5, y - 7, 1), P(x + 2.5, y - 7, 1), P(x + 2.5, y - 3, 1), P(x - 2.5, y - 3, 1)], c: BRASS, m: 'gold', line: 0.4 })),
      ] : [{ p: [[74, 186], [86, 184], [92, 204], [80, 208], [70, 200]], c: '#8a6a44', m: 'leather', line: 0.7, lines: [{ p: [[76, 192], [88, 190]], w: 1, a: 0.5 }] }]),
      { p: tube([[hx - 4, 110, 16], [hx - 6, 126, 19]]), c: sk, m: 'skin', id: 'neck' },
    ];
    const hat = cowHat(hx, hy - 2, { c: o.hat, band: o.band, m: 'leather' });
    const headS = [
      // кудри на затылке
      ...[[84, 98, 9], [80, 84, 9], [86, 72, 9], [96, 66, 8], [90, 110, 7]].map(([x, y, rr]) => ({ e: [x, y, rr, rr], c: tone(hair, -0.08), m: 'fur', furLen: 0.5, line: 0.6 })),
      ...head(hx, hy, r, { skin: sk, hair, hairStyle: 'short', ear: false }),
      // острое ухо полурослика
      { p: [[hx - 14, hy + 10], [hx - 20, hy - 6], P(hx - 16, hy - 16, 1), [hx - 8, hy - 4], [hx - 6, hy + 8]], c: sk, m: 'skin', line: 0.7, sub: [{ p: [[hx - 13, hy + 4], [hx - 16, hy - 6], [hx - 10, hy - 2]], c: '#d08a70', m: 'skin', line: 0 }] },
      // румяная щека и нос-картошка
      { e: [hx + 14, hy + 10, 6, 4], c: 'rgba(230,110,90,0.35)', m: 'flat', line: 0 },
      { e: [hx + r * 1.02, hy + 4, 5, 4.5], c: sk, m: 'skin', line: 0.6 },
      { p: tube([[hx + 10, hy + 17, 1.6], [hx + 18, hy + 20, 1.6], [hx + 24, hy + 16, 1.4]]), c: '#7a3a2a', m: 'flat', line: 0 },
      ...hat,
      ...(o.goggles ? [
        { p: tube([[hx - 26, hy - 22, 5], [hx + 27, hy - 24, 5]]), c: '#3a2a1c', m: 'leather', line: 0.5 },
        { e: [hx + 2, hy - 24, 7.5, 7], c: BRASS, m: 'gold', line: 0.6, sub: [{ e: [hx + 2, hy - 24, 4.8, 4.5], c: '#5ac8e0', m: 'gem', line: 0 }], glint: [[hx, hy - 26, 1.8]] },
        { e: [hx + 18, hy - 25, 7, 6.6], c: BRASS, m: 'gold', line: 0.6, sub: [{ e: [hx + 18, hy - 25, 4.4, 4.2], c: '#5ac8e0', m: 'gem', line: 0 }], glint: [[hx + 16, hy - 27, 1.6]] },
        { p: [P(hx - 28, hy - 32, 1), P(hx - 40, hy - 58, 1), P(hx - 22, hy - 36, 1)], c: '#c83a2a', m: 'feather', texSize: 0.4, line: 0.6 },
      ] : []),
    ];
    // ближняя рука поднята: праща над головой или граната с горящим фитилём
    const sh = [126, 132], el = [156, 124], hand = [166, 98];
    const armS = [...arm(sh, el, hand, { c: tone(coat || SHIRT, 0), hand: sk, w: 15 }), { e: [127, 134, 12, 11], c: coat || SHIRT, m: 'cloth' }];
    if (o.grenades) {
      const b = [174, 80];
      armS.unshift(
        { e: [b[0], b[1], 12, 12], c: IRON, m: 'steel', gloss: 1, line: 0.8, glint: [[b[0] - 4, b[1] - 4, 3]], lines: [{ p: [[b[0] - 11, b[1] + 1], [b[0], b[1] + 4], [b[0] + 11, b[1] + 1]], w: 1, a: 0.5 }] },
        { p: [P(b[0] - 3, b[1] - 15, 1), P(b[0] + 5, b[1] - 15, 1), P(b[0] + 5, b[1] - 10, 1), P(b[0] - 3, b[1] - 10, 1)], c: BRASS, m: 'gold', line: 0.5 },
        { p: tube([[b[0] + 1, b[1] - 14, 2], [b[0] + 6, b[1] - 22, 2], [b[0] + 12, b[1] - 24, 2]]), c: '#d8c8a0', m: 'cloth', line: 0.4 },
        ...fire([b[0] + 13, b[1] - 25], -Math.PI / 2 + 0.3, 16, 9, FIRE, { n: 2 }),
        { e: [b[0] + 13, b[1] - 26, 3, 3], c: '#fff4c0', m: 'flat', line: 0 });
    } else {
      // праща: два шнура к кожаному кармашку с камнем, дуга вращения
      const pch = [198, 62];
      armS.unshift(
        { p: tube([[160, 74, 1.6], [162, 46, 2.4], [186, 30, 2.6], [212, 38, 2.2], [222, 58, 1.4]]), c: 'rgba(255,250,230,0.55)', m: 'flat', line: 0 },
        { p: tube([[hand[0] + 2, hand[1] - 4, 2], [pch[0] - 6, pch[1] - 4, 2]]), c: '#c8a878', m: 'cloth', line: 0.4 },
        { p: tube([[hand[0] + 4, hand[1] - 2, 2], [pch[0] - 4, pch[1] + 5, 2]]), c: '#b8986a', m: 'cloth', line: 0.4 },
        { p: ell(pch[0], pch[1], 9, 7, 10, -0.6), c: '#8a5a30', m: 'leather', line: 0.7 },
        { e: [pch[0] + 1, pch[1] - 2, 5.5, 5], c: '#a8a49c', m: 'horn', line: 0.6, glint: [[pch[0] - 1, pch[1] - 4, 1.5]] });
    }
    const parts = [
      { kind: 'leg', side: -1, pivot: [90, 186], shapes: hLeg([90, 188], [86, 246], -1) },
      { kind: 'leg', side: 1, pivot: [114, 186], shapes: hLeg([114, 188], [120, 246], 1) },
      { kind: 'torso', pivot: [104, 176], shapes: body },
      { kind: 'head', pivot: [hx - 6, 114], shapes: headS },
      { kind: 'prop', pivot: sh, shapes: armS },
    ];
    V.def(name, place(name, parts, o.size || 1, 2));
  }
  halfling('halfling', { hair: '#6a3e1e', pants: '#6a4a2c', vest: '#4a7a34', hat: '#7a5230', band: '#4a2e18' });
  halfling('halfling_grenadier', { hair: '#4a2a14', pants: '#4a3a2a', coat: '#a88448', scarf: '#b8302a', hat: '#5a3a22', band: '#2a1a10', grenades: true, goggles: true });

  /* ================= Механик / инженер =================
     Ранец-бак за спиной, шланг к горелке, струя пламени — «дыхание». */
  function mechanic(name, o) {
    const hx = H.headX, hy = H.headY, r = H.headR, T = o.tank;
    const tank = (x, c, top) => [
      { p: tube([[x, 86, 30], [x, 168, 30]]), c, m: 'gold', gloss: 0.9, line: 0.8, lines: [{ p: [[x - 7, 90], [x - 7, 162]], w: 1.4, light: true, a: 0.5 }] },
      ...[104, 150].map(y => ({ p: [P(x - 16, y - 3, 1), P(x + 16, y - 3, 1), P(x + 16, y + 3, 1), P(x - 16, y + 3, 1)], c: BRASS, m: 'gold', line: 0.5, glint: rivets([[x - 10, y], [x + 2, y]], 1.6) })),
      ...(top ? [{ p: tube([[x, 76, 6], [x, 64, 6]], { flat1: true }), c: IRON, m: 'steel', line: 0.6 }, { e: [x, 62, 9, 3.5], c: '#b8302a', m: 'steel', line: 0.6 }] : []),
    ];
    const back = [
      ...(o.double ? tank(40, tone(T, -0.15), false) : []),
      ...tank(58, T, true),
      { p: tube([[40, 120, 5], [44, 96, 5], [60, 86, 5]]), c: '#3a2a1c', m: 'leather', line: 0.5 },
      ...(o.gauge ? [{ e: [58, 126, 10, 10], c: BRASS, m: 'gold', line: 0.7, sub: [{ e: [58, 126, 7.5, 7.5], c: '#f0ead8', m: 'flat', line: 0 }], lines: [{ p: [[58, 126], [63, 121]], w: 1.6, c: '#c82a1a', a: 1 }] }] : []),
      ...(o.steam ? puff([[58, 50, 9], [50, 36, 12], [60, 20, 14]], '236,236,236', 0.8) : []),
      // шланг: от бака вдоль пояса вперёд
      { p: tube([[66, 164, 7], [88, 176, 7], [118, 172, 7], [134, 160, 7]]), c: '#3a3a40', m: 'leather', line: 0.6, lines: [{ p: [[72, 168], [128, 164]], w: 1, light: true, a: 0.3 }] },
      // дальняя рука с гаечным ключом
      ...[{ p: tube([[84, 146, 7], [64, 196, 7]]), c: STEEL, m: 'steel', line: 0.7, lines: [{ p: [[80, 152], [68, 184]], w: 1, light: true, a: 0.6 }] },
        { p: rot([[50, 192], [74, 192], [76, 212], [69, 214], [68, 202, 1], [60, 202, 1], [59, 214], [52, 212]], 62, 196, 0.38), c: STEEL, m: 'steel', line: 0.7, glint: [[58, 196, 2]] }],
      ...arm([80, 90], [72, 122], [82, 148], { c: tone(o.shirt, -0.18), hand: o.glove, handM: 'leather', w: 16 }),
    ];
    const body = [
      ...torso({ c: o.shirt, skirt: false, belt: VEST, neck: SKIN }),
      // комбинезон: нагрудник, лямки, карман
      { p: [[86, 98], [124, 96], [126, 142], [84, 144]], c: o.overall, m: 'cloth', id: 'bib', lines: [{ p: [[96, 112], [114, 112]], w: 1, a: 0.5 }],
        sub: [{ p: [[94, 110], [116, 110], [116, 128], [94, 128]], c: tone(o.overall, -0.1), m: 'cloth', line: 0.6 }] },
      { p: tube([[88, 100, 7], [78, 82, 7]]), c: o.overall, m: 'cloth', line: 0.6 }, { p: tube([[122, 98, 7], [128, 82, 7]]), c: o.overall, m: 'cloth', line: 0.6 },
      { e: [89, 101, 3, 3], c: BRASS, m: 'gold', line: 0.4 }, { e: [121, 99, 3, 3], c: BRASS, m: 'gold', line: 0.4 },
      { p: [[76, 146], [130, 146], [133, 174], [75, 174]], c: o.overall, m: 'cloth', lines: [{ p: [[102, 150], [102, 172]], w: 1.2, a: 0.45 }] },
      { p: [[74, 140], [130, 140], [131, 151], [73, 151]], c: VEST, m: 'leather', sub: [{ p: [P(98, 139, 1), P(108, 139, 1), P(108, 152, 1), P(98, 152, 1)], c: BRASS, m: 'gold' }] },
      // отвёртка и молоток в поясе
      { p: tube([[120, 146, 4], [124, 170, 3]]), c: STEEL, m: 'steel', line: 0.5 }, { p: tube([[119, 138, 6], [120, 148, 6]]), c: '#b8302a', m: 'cloth', line: 0.5 },
    ];
    const headS = [
      ...head(hx, hy, r, { skin: SKIN, hair: o.hair, hairStyle: 'short', beard: o.beard }),
      { p: [[hx + 6, hy + 11], [hx + 22, hy + 9], [hx + 26, hy + 15], [hx + 10, hy + 16]], c: o.hair, m: 'fur', furLen: 0.4, flow: 0 },
      { e: [hx + 6, hy + 6, 5, 3], c: 'rgba(40,30,30,0.35)', m: 'flat', line: 0 },
    ];
    if (o.visor) headS.push(
      // сварочная маска поднята на лоб
      { p: [[hx - 22, hy - 4], [hx - 20, hy - 22], [hx - 4, hy - 30], [hx + 14, hy - 28], [hx + 26, hy - 20], [hx + 24, hy - 10], [hx - 10, hy - 12]], c: IRON, m: 'steel', gloss: 0.8, line: 0.7 },
      { p: [[hx - 2, hy - 30], [hx + 8, hy - 50], [hx + 32, hy - 48], [hx + 38, hy - 26], [hx + 24, hy - 20]], c: tone(IRON, 0.1), m: 'steel', gloss: 1, line: 0.8,
        sub: [{ p: [[hx + 10, hy - 42], [hx + 30, hy - 42], [hx + 32, hy - 34], [hx + 12, hy - 34]], c: '#2a6a5a', m: 'gem', line: 0.5 }] },
      { e: [hx - 8, hy - 18, 4, 4], c: BRASS, m: 'gold', line: 0.5, glint: [[hx - 9, hy - 19, 1.5]] });
    else headS.push(
      { p: tube([[hx - 24, hy - 6, 6], [hx - 6, hy - 18, 6], [hx + 22, hy - 18, 6]]), c: '#3a2a1c', m: 'leather', line: 0.5 },
      { e: [hx + 2, hy - 20, 8, 7.5], c: BRASS, m: 'gold', line: 0.6, sub: [{ e: [hx + 2, hy - 20, 5.2, 5], c: '#6ad4f0', m: 'gem', line: 0 }], glint: [[hx, hy - 22, 2]] },
      { e: [hx + 18, hy - 19, 7.5, 7], c: BRASS, m: 'gold', line: 0.6, sub: [{ e: [hx + 18, hy - 19, 4.8, 4.6], c: '#6ad4f0', m: 'gem', line: 0 }], glint: [[hx + 16, hy - 21, 1.8]] });
    // ближняя рука: горелка-сопло и струя пламени
    const hand = [152, 122], at = along(hand, [1, -0.12]);
    const nozzle = [
      { p: tube([[...at(-18, 4), 7], [...at(-4, 1), 7]]), c: '#3a3a40', m: 'leather', line: 0.5 },
      { p: tube([[...at(-10, 0), 9], [...at(26, 0), 8]], { flat1: true }), c: BRASS, m: 'gold', gloss: 1, line: 0.7, lines: [{ p: [at(-6, -2.5), at(24, -2.5)], w: 1, light: true, a: 0.7 }] },
      { p: [P(...at(24, -6), 1), P(...at(34, -9), 1), P(...at(34, 9), 1), P(...at(24, 6), 1)], c: COPPER, m: 'gold', line: 0.7 },
      { p: tube([[...at(2, 4), 5], [...at(4, 12), 5]]), c: IRON, m: 'steel', line: 0.5 },
    ];
    const armS = [
      ...fire(at(36, 0), -0.12, o.flameLen || 58, 22, o.flame, { n: 3, spread: 0.35 }),
      ...nozzle,
      ...arm([126, 90], [144, 116], hand, { c: o.shirt, hand: o.glove, handM: 'leather', w: 16 }),
      ...(o.bracer ? [{ p: tube([[142, 116, 15], [148, 120, 15]]), c: BRASS, m: 'gold', line: 0.6, glint: [[144, 114, 1.8]] }] : []),
      { e: [126, 94, 14, 13], c: o.shirt, m: 'cloth' },
      { p: tube([[124, 84, 7], [130, 100, 7]]), c: o.overall, m: 'cloth', line: 0.5 },
    ];
    V.def(name, humanoid({ name, size: o.size || 0.96, legs: { style: 'hose', c: o.overall, boot: '#3a2a1c', tw: 26 }, back, body, head: headS, arm: armS }));
  }
  mechanic('mechanic', { shirt: '#3a6ab0', overall: '#7a5230', tank: COPPER, glove: '#5a3a22', hair: '#3a2414', flame: FIRE });
  mechanic('engineer', { shirt: '#b8402a', overall: '#6a6e76', tank: '#b0782e', glove: '#3a2a1c', hair: '#2a1c14', beard: '#2a1c14', flame: BLUEF, double: true, gauge: true, steam: true, visor: true, bracer: true, flameLen: 64 });

  /* ================= Армадилл / вожак армадиллов =================
     Броненосец: панцирь из поясов, щиток на голове, длинный хвост в кольцах, когти-копалки. */
  function armadillo(name, o) {
    const S = o.shell, SD = tone(S, -0.2), SK = o.skin, SKD = tone(SK, -0.2);
    const leg = (top, knee, foot, c, front) => {
      const out = [{ p: tube([[top[0], top[1], front ? 26 : 30], [knee[0], knee[1], 18], [foot[0] - 2, foot[1] - 7, 14]], { flat0: true }), c, m: 'skin', tex: 'scale', texSize: 0.45, belly: 0.25 }];
      out.push({ p: [[foot[0] - 12, foot[1] - 10], [foot[0] + 6, foot[1] - 11], [foot[0] + 12, foot[1] - 4], P(foot[0] + 12, foot[1], 1), P(foot[0] - 14, foot[1], 1)], c, m: 'skin', line: 0.7 });
      for (let i = 0; i < 3; i++) { const x = foot[0] + 10 - i * 6; out.push({ p: [P(x - 3, foot[1] - 5, 1), P(x + (front ? 12 : 7), foot[1], 1), P(x - 2, foot[1], 1)], c: o.claw, m: 'horn', line: 0.4 }); }
      return out;
    };
    const G = 180;
    const legs = [
      { kind: 'leg', side: 1, pivot: [86, 140], shapes: leg([86, 136], [80, 158], [80, G - 2], SKD, false) },
      { kind: 'leg', side: -1, pivot: [196, 140], shapes: leg([196, 136], [204, 160], [206, G - 2], SKD, true) },
      { kind: 'leg', side: -1, pivot: [104, 142], shapes: leg([104, 138], [96, 162], [100, G], SK, false) },
      { kind: 'leg', side: 1, pivot: [214, 142], shapes: leg([214, 138], [222, 162], [226, G], SK, true) },
    ];
    // хвост в кольцах, конусом назад
    const tail = [[66, 128, 34], [42, 140, 24], [22, 156, 16], [6, 170, 9], [-6, 176, 4]];
    const bodyS = [
      { p: tube(tail), c: S, m: 'horn', gloss: 0.5, tex: 'scale', texSize: 0.45, belly: 0.3,
        lines: tail.slice(0, 4).map((q, i) => ({ p: [[q[0] + 5, q[1] - q[2] * 0.48], [q[0] + 1, q[1]], [q[0] + 5, q[1] + q[2] * 0.48]], w: 1.2, a: 0.55 })) },
      // брюхо — кожа между лапами
      { p: [[70, 128], [120, 150], [200, 150], [236, 132], [232, 152], [200, 160], [110, 160], [72, 148]], c: SKD, m: 'skin', line: 0.6 },
      // задний щит, пояса, передний щит
      { p: [[56, 146], [58, 112], [74, 84], [100, 68], [118, 64], [118, 148], [86, 152]], c: S, m: 'horn', gloss: 0.6, tex: 'scale', texSize: 0.5, id: 'rear', belly: 0.3,
        lines: [{ p: [[70, 96], [96, 76]], w: 1.2, light: true, a: 0.5 }] },
      ...[0, 1, 2, 3, 4, 5].map(i => {
        const x0 = 116 + i * 14, x1 = x0 + 16, top0 = 62 - Math.sin((i + 0.5) / 6 * Math.PI) * 8, top1 = 62 - Math.sin((i + 1.5) / 6 * Math.PI) * 8;
        return { p: [[x0, top0], [x0 + 8, top0 - 3], [x1, top1], P(x1 + 1, 150, 1), P(x0, 150, 1)], c: i % 2 ? tone(S, 0.06) : S, m: 'horn', gloss: 0.6, belly: 0.35, line: 0.8, id: 'band' + i,
          lines: [{ p: [[x0 + 4, top0 + 4], [x0 + 5, 144]], w: 1.1, light: true, a: 0.45 }, { p: [[x0 + 12, top0 + 2], [x0 + 12, 146]], w: 0.9, a: 0.4 }] };
      }),
      { p: [[200, 66], [222, 74], [240, 96], [246, 124], [238, 148], [200, 152]], c: S, m: 'horn', gloss: 0.6, tex: 'scale', texSize: 0.5, id: 'front', belly: 0.3,
        lines: [{ p: [[206, 72], [230, 88]], w: 1.2, light: true, a: 0.5 }] },
      // зубчатый край панциря
      { p: [[56, 146], [86, 152], [120, 152], [200, 152], [238, 148], [236, 156, 1], [226, 152], [216, 158, 1], [206, 152], [196, 158, 1], [150, 156], [104, 158, 1], [94, 154], [84, 160, 1], [74, 154], [60, 156, 1]], c: SD, m: 'horn', line: 0.7 },
      ...(o.spikes ? [[70, 100], [90, 76], [112, 64], [138, 56], [166, 54], [194, 58], [220, 70]].map(([x, y], i) => ({ p: [P(x - 6, y + 4, 1), P(x - 2 + (i < 3 ? -4 : 2), y - 16, 1), P(x + 6, y + 4, 1)], c: o.spikes, m: 'gold', line: 0.6, glint: [[x - 1, y - 6, 1.6]] })) : []),
      ...(o.trim ? [{ p: tube([[58, 144, 5], [120, 150, 5], [200, 150, 5], [238, 146, 5]]), c: o.trim, m: 'gold', line: 0.5, glint: rivets([[90, 148], [140, 150], [180, 150], [220, 148]], 1.8) }] : []),
    ];
    const headS = [
      { p: tube([[226, 126, 36], [248, 132, 30]]), c: SK, m: 'skin', line: 0.7 },
      // вытянутая морда вниз-вперёд
      { p: [[236, 112], [256, 108], [276, 118], [296, 136], [308, 150], [304, 158], [288, 158], [262, 152], [240, 146]], c: SK, m: 'skin', id: 'snout',
        lines: [{ p: [[276, 146], [300, 154]], w: 1.2, a: 0.6 }] },
      { e: [306, 152, 4, 4], c: '#3a2622', m: 'skin', line: 0.5 },
      // щиток на макушке
      { p: [[238, 110], [256, 102], [280, 110], [298, 130], [292, 134], [270, 122], [246, 120]], c: o.cap || S, m: o.cap ? 'gold' : 'horn', gloss: 0.8, tex: o.cap ? undefined : 'scale', texSize: 0.4, line: 0.7, glint: o.cap ? rivets([[256, 108], [276, 116]], 1.8) : undefined },
      { e: [264, 126, 3.6, 3.2], c: '#140c08', m: 'gem', line: 0.4, glint: [[263, 125, 1.3]] },
      // ухо торчком
      { p: [[242, 112], [236, 88, 1], [250, 92], [254, 108]], c: SK, m: 'skin', line: 0.7, sub: [{ p: [[243, 106], [240, 94], [248, 98]], c: '#c88a78', m: 'skin', line: 0 }] },
      ...(o.bell ? [
        { p: tube([[232, 136, 7], [248, 146, 7], [262, 144, 7]]), c: '#8a2a1e', m: 'leather', line: 0.5 },
        { p: [[242, 150], [246, 144], [254, 144], [258, 150], [262, 166, 1], [238, 166, 1]], c: BRASS, m: 'gold', gloss: 1.2, line: 0.7, glint: [[246, 152, 2.4]] },
        { e: [250, 168, 3.2, 3.2], c: tone(BRASS, -0.3), m: 'gold', line: 0.4 },
      ] : []),
    ];
    const parts = [legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [150, 140], shapes: bodyS },
      { kind: 'head', pivot: [232, 130], shapes: headS }];
    V.def(name, placeAt(name, parts, [150, G], o.size || 1));
  }
  armadillo('armadillo', { shell: '#c8a070', skin: '#b0806a', claw: '#3a2a20' });
  armadillo('bellwether_armadillo', { shell: '#a8703a', skin: '#8a6450', claw: '#e8dcc0', spikes: BRASS, trim: BRASS, cap: BRASS, bell: true });

  /* ================= Автоматон / автоматон-страж =================
     Шагающий котёл: грудь-бойлер с топкой, клёпаные трубы-конечности, ключ завода на спине. */
  function automaton(name, o) {
    const C = o.plate, CD = tone(C, -0.22), M = o.m, TR = o.trim, G = o.glow;
    const pl = (p, c, extra) => Object.assign({ p, c, m: M, gloss: 0.9 }, extra || {});
    const joint = (x, y, r, c) => ({ e: [x, y, r, r], c: c || TR, m: 'gold', gloss: 1.1, line: 0.7, glint: [[x - r * 0.35, y - r * 0.35, r * 0.3]] });
    const aLeg = (hip, knee, foot, side) => {
      const d = side < 0 ? -0.2 : 0, c = tone(C, d), ir = tone(IRON, d), tr = tone(TR, d);
      return [
        { p: tube([[hip[0], hip[1] - 4, 20], [knee[0], knee[1], 15]], { flat0: true }), c: ir, m: 'steel', line: 0.7, lines: [{ p: [[hip[0] - 3, hip[1]], [knee[0] - 3, knee[1] - 4]], w: 1, light: true, a: 0.5 }] },
        // голень-поножь: расширяется книзу
        pl([[knee[0] - 10, knee[1] + 2], [knee[0] + 11, knee[1] + 2], [foot[0] + 15, foot[1] - 12], [foot[0] - 14, foot[1] - 12]], c, { line: 0.8, glint: rivets([[knee[0] - 5, knee[1] + 10], [knee[0] + 6, knee[1] + 10]], 1.8),
          lines: [{ p: [[knee[0] + 2, knee[1] + 6], [foot[0] + 3, foot[1] - 14]], w: 1, light: true, a: 0.5 }] }),
        joint(knee[0] + 1, knee[1], 9, tr),
        // тяжёлая стопа-плита
        pl([[foot[0] - 20, foot[1] - 14], [foot[0] + 16, foot[1] - 15], [foot[0] + 26, foot[1] - 6], P(foot[0] + 28, foot[1], 1), P(foot[0] - 22, foot[1], 1)], tone(ir, 0.05), { m: 'steel', line: 0.8, glint: rivets([[foot[0] - 12, foot[1] - 8], [foot[0] + 12, foot[1] - 9]], 1.8) }),
      ];
    };
    // ключ завода и труба за спиной
    const key = [
      { p: tube([[64, 108, 8], [30, 104, 8]]), c: TR, m: 'gold', gloss: 1.1, line: 0.7 },
      { p: ell(18, 86, 10, 16, 12, -0.15), c: TR, m: 'gold', gloss: 1.1, line: 0.8, sub: [{ p: ell(18, 86, 4, 9, 10, -0.15), c: tone(TR, -0.45), m: 'gold', line: 0 }], id: 'keyA' },
      { p: ell(22, 122, 10, 16, 12, 0.15), c: TR, m: 'gold', gloss: 1.1, line: 0.8, sub: [{ p: ell(22, 122, 4, 9, 10, 0.15), c: tone(TR, -0.45), m: 'gold', line: 0 }], id: 'keyB' },
      { e: [26, 104, 8, 8], c: tone(TR, 0.1), m: 'gold', line: 0.7, glint: [[24, 101, 2]] },
    ];
    const stack = [
      ...puff([[70, 22, 9], [60, 8, 12], [68, -10, 15]], o.smoke || '210,206,200', 0.85),
      { p: tube([[76, 82, 13], [72, 34, 12]], { flat1: true }), c: IRON, m: 'steel', line: 0.7, lines: [{ p: [[70, 76], [67, 38]], w: 1, light: true, a: 0.5 }] },
      { p: [P(60, 28, 1), P(84, 28, 1), P(82, 38, 1), P(62, 38, 1)], c: TR, m: 'gold', line: 0.6 },
    ];
    const farArm = [
      { p: tube([[70, 90, 18], [58, 126, 15]]), c: tone(IRON, -0.2), m: 'steel', line: 0.7 },
      pl([[48, 128], [68, 126], [74, 158], [50, 162]], CD, { line: 0.8 }),
      joint(58, 126, 8, tone(TR, -0.2)),
      ...[0, 1, 2].map(i => ({ p: tube([[56 + i * 7, 160, 5], [54 + i * 8, 172, 4.5], [60 + i * 7, 178, 4]]), c: tone(IRON, -0.15), m: 'steel', line: 0.5 })),
      joint(70, 86, 15, tone(TR, -0.2)),
    ];
    const chest = [[66, 76], [146, 74], [158, 96], [154, 138], [138, 158], [78, 160], [62, 140], [56, 98]];
    const body = [
      ...stack, ...key, ...farArm,
      // пояс-шарнир и тазовые пластины
      { p: [[84, 150], [132, 150], [130, 174], [86, 174]], c: IRON, m: 'steel', line: 0.7, lines: [{ p: [[86, 158], [130, 158]], w: 1, a: 0.5 }, { p: [[86, 166], [130, 166]], w: 1, a: 0.5 }] },
      ...gear(86, 170, 13, 9, TR),
      pl([[70, 170], [146, 170], [150, 192, 1], [128, 188], [110, 194, 1], [90, 188], [66, 192, 1]], C, { line: 0.8, lines: [{ p: [[90, 174], [90, 186]], w: 1, a: 0.5 }, { p: [[110, 174], [110, 190]], w: 1, a: 0.5 }, { p: [[128, 174], [128, 186]], w: 1, a: 0.5 }] }),
      // грудь-котёл
      pl(chest, C, { id: 'chest', belly: 0.3, line: 0.9,
        lines: [{ p: [[74, 80], [70, 150]], w: 1.1, a: 0.4 }, { p: [[148, 90], [146, 146]], w: 1.1, a: 0.4 }, { p: [[70, 86], [110, 80], [148, 84]], w: 1.4, light: true, a: 0.5 }],
        glint: rivets([[70, 90], [70, 110], [70, 130], [146, 94], [146, 114], [144, 134], [86, 150], [106, 152], [126, 150]], 2.2),
        sub: [{ p: tube([[56, 144, 9], [110, 150, 9], [160, 142, 9]]), c: TR, m: 'gold', line: 0.6 }] }),
      // топка: латунное кольцо, решётка, жар
      { e: [110, 112, 22, 22], c: TR, m: 'gold', gloss: 1.1, line: 0.8, glint: rivets([[92, 104], [128, 104], [110, 92], [96, 124], [124, 124]], 1.8) },
      { e: [110, 112, 16, 16], c: '#2a1a14', m: 'steel', line: 0.6, sub: [{ e: [110, 114, 13, 12], c: G.out, m: 'flat', line: 0 }, { e: [110, 116, 8, 7], c: G.core, m: 'flat', line: 0 }],
        lines: [100, 110, 120].map(x => ({ p: [[x, 97], [x, 127]], w: 2.2, c: '#2a1a14', a: 1 })) },
      ...(o.shield ? [
        { p: [[32, 92], [66, 86], [98, 92], [96, 150], [86, 184], [66, 202, 1], [44, 184], [34, 150]], c: TR, m: 'gold', line: 0.9 },
        { p: [[38, 98], [66, 93], [92, 98], [90, 148], [81, 178], [66, 194, 1], [50, 178], [40, 148]], c: o.shield, m: 'steel', gloss: 0.9, line: 0.7, glint: rivets([[46, 104], [86, 104], [46, 140], [86, 140]], 2),
          sub: gear(66, 136, 20, 10, TR).map(g => Object.assign({}, g, { line: 0.5 })) },
      ] : []),
    ];
    const hx = 110, hy = 42;
    const headS = [
      { p: tube([[106, 76, 14], [106, 58, 14]]), c: IRON, m: 'steel', line: 0.7, lines: [{ p: [[100, 66], [112, 66]], w: 1.4, a: 0.6 }] },
      // голова-купол с забралом
      pl([[hx - 22, hy + 16], [hx - 23, hy - 6], [hx - 12, hy - 22], [hx + 6, hy - 26], [hx + 22, hy - 18], [hx + 28, hy - 2], [hx + 28, hy + 14], [hx + 18, hy + 22], [hx - 14, hy + 22]], C, { line: 0.9, belly: 0.25,
        lines: [{ p: [[hx - 16, hy - 12], [hx, hy - 22], [hx + 18, hy - 16]], w: 1.3, light: true, a: 0.6 }], glint: rivets([[hx - 16, hy + 14], [hx - 16, hy - 2]], 1.8) }),
      { p: [[hx - 2, hy - 4], [hx + 30, hy - 6], [hx + 31, hy + 6], [hx - 2, hy + 6]], c: '#1c1614', m: 'steel', line: 0.6 },
      { e: [hx + 12, hy + 1, 5.5, 3], c: G.out, m: 'gem', line: 0, glint: [[hx + 12, hy + 1, 4]] },
      { e: [hx + 25, hy, 4.5, 2.6], c: G.out, m: 'gem', line: 0, glint: [[hx + 25, hy, 3.2]] },
      // решётка «рта»
      { p: [[hx + 6, hy + 10], [hx + 28, hy + 9], [hx + 26, hy + 20], [hx + 8, hy + 21]], c: tone(C, -0.1), m: M, line: 0.6, lines: [0, 1, 2, 3].map(i => ({ p: [[hx + 10 + i * 5, hy + 11], [hx + 10 + i * 5, hy + 19]], w: 1.2, a: 0.7 })) },
      joint(hx - 14, hy + 4, 5, TR),
      ...(o.crest ? [{ p: [[hx - 18, hy - 12], [hx - 10, hy - 40], [hx + 8, hy - 44, 1], [hx + 4, hy - 30], [hx + 16, hy - 20]], c: TR, m: 'gold', gloss: 1.1, line: 0.7, lines: [{ p: [[hx - 8, hy - 18], [hx + 2, hy - 38]], w: 1, a: 0.5 }] }]
        : [{ p: tube([[hx + 4, hy - 24, 3], [hx + 8, hy - 38, 3]]), c: IRON, m: 'steel', line: 0.5 }, { e: [hx + 8, hy - 40, 4, 4], c: G.out, m: 'gem', line: 0.5, glint: [[hx + 7, hy - 41, 1.5]] }]),
    ];
    // ближняя рука: тяжёлый молот или алебарда
    const hand = [172, 140], dir = o.halberd ? [0.18, -1] : [0.34, -1], at = along(hand, dir);
    const wpn = o.halberd ? weapon.polearm(hand, dir, 150, { kind: 'halberd', back: 74, shaft: IRON, head: '#c8d0da' })
      : [{ p: tube([[...at(-26, 0), 8], [...at(78, 0), 7]]), c: IRON, m: 'steel', line: 0.7, lines: [{ p: [at(-20, -2), at(74, -2)], w: 1, light: true, a: 0.5 }] },
        pl([at(62, -26), at(96, -26), at(96, 26), at(62, 26)].map(q => P(q[0], q[1], 1)), '#8e969e', { m: 'steel', line: 0.9, glint: rivets([at(68, -18), at(90, -18), at(68, 18), at(90, 18)], 2),
          lines: [{ p: [at(66, -22), at(92, -22)], w: 1.2, light: true, a: 0.7 }] }),
        pl([at(58, -10), at(100, -10), at(100, 10), at(58, 10)].map(q => P(q[0], q[1], 1)), TR, { m: 'gold', line: 0.7 })];
    const armS = [
      ...wpn,
      { p: tube([[146, 96, 18], [158, 124, 15]]), c: IRON, m: 'steel', line: 0.7 },
      pl([[150, 124], [170, 120], [180, 146], [158, 152]], C, { line: 0.8, glint: rivets([[160, 128]], 1.8) }),
      joint(158, 124, 9, TR),
      pl(ell(174, 142, 11, 10, 10), tone(IRON, 0.1), { m: 'steel', line: 0.8 }),
      // наплечник-шар
      pl(ell(142, 86, 19, 17, 12), C, { line: 0.9, glint: rivets([[132, 80], [150, 78], [154, 94]], 2), lines: [{ p: [[126, 90], [142, 96], [158, 92]], w: 1.1, a: 0.5 }] }),
    ];
    const parts = [
      { kind: 'leg', side: -1, pivot: [90, 182], shapes: aLeg([90, 184], [86, 214], [84, 246], -1) },
      { kind: 'leg', side: 1, pivot: [122, 182], shapes: aLeg([122, 184], [126, 214], [122, 246], 1) },
      { kind: 'torso', pivot: [108, 150], shapes: body },
      { kind: 'head', pivot: [106, 70], shapes: headS },
      { kind: 'prop', pivot: [142, 88], shapes: armS },
    ];
    V.def(name, place(name, parts, o.size || 0.86, 4));
  }
  automaton('automaton', { plate: COPPER, m: 'gold', trim: BRASS, glow: { out: '#ff8a2a', core: '#ffe07a' } });
  automaton('sentinel_automaton', { plate: '#9aa4b0', m: 'steel', trim: '#c8a040', glow: { out: '#4ab8ff', core: '#d8f4ff' }, shield: '#6a7480', halberd: true, crest: true, smoke: '150,176,206' });

  /* ================= Песчаный червь / олгой-хорхой =================
     Кольчатое тело встаёт из бархана, наверху — пасть-воронка с кольцами зубов. */
  function sandworm(name, o) {
    const C = o.body, CD = tone(C, -0.2), G = 303;
    const spine = [[119, 298, 86], [117, 268, 83], [124, 228, 78], [146, 196, 72], [170, 166, 68], [184, 136, 64], [188, 110, 62]];
    // кольца поперёк тела: дуга от края к краю, чуть провисает книзу — цилиндр
    const rings = [];
    for (let i = 0; i < spine.length - 1; i++) for (const f of [0.25, 0.75]) {
      const a = spine[i], b = spine[i + 1], q = lerp(a, b, f), w = (a[2] + (b[2] - a[2]) * f) / 2, [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = -ty, ny = tx;
      rings.push({ p: [[q[0] + nx * w, q[1] + ny * w], [q[0] - tx * w * 0.22, q[1] - ty * w * 0.22], [q[0] - nx * w, q[1] - ny * w]].map(([x, y]) => [x, y + 1]), w: 2.2, a: 0.6 });
      rings.push({ p: [[q[0] + nx * w * 0.9, q[1] + ny * w * 0.9 - 4], [q[0] - tx * w * 0.22, q[1] - ty * w * 0.22 - 4], [q[0] - nx * w * 0.9, q[1] - ny * w * 0.9 - 4]], w: 1.2, light: true, a: 0.35 });
    }
    const bodyS = [
      { p: tube(spine, { flat0: true }), c: C, m: 'skin', gloss: 0.4, belly: 0.25, id: 'body', lines: rings,
        sub: [{ p: tube(spine.map(q => [q[0] + q[2] * 0.26, q[1] + 2, q[2] * 0.42]), { flat0: true }), c: o.belly, m: 'skin', line: 0 }] },
      ...(o.spikes ? spine.slice(1).map((q, i) => { const x = q[0] - q[2] * 0.48, y = q[1]; return { p: [P(x + 2, y - 9, 1), P(x - 14, y - 4 - i, 1), P(x + 2, y + 8, 1)], c: o.spikes, m: 'horn', line: 0.6 }; }) : []),
    ];
    // пасть: плоскость рта наклонена вперёд-вверх
    const M = [190, 90], A = -0.3;
    const E = (rx, ry, n, dx, dy) => ell(M[0] + (dx || 0), M[1] + (dy || 0), rx, ry, n || 16, A);
    const onE = (rx, ry, t) => { const c = Math.cos(A), s = Math.sin(A), x = Math.cos(t) * rx, y = Math.sin(t) * ry; return [M[0] + x * c - y * s, M[1] + x * s + y * c]; };
    // крупные клыки-крючья по краю воронки: торчат наружу и вверх
    const fangs = [];
    for (const t of [Math.PI * 0.95, Math.PI * 1.15, Math.PI * 1.35, Math.PI * 1.55, Math.PI * 1.75, Math.PI * 1.95, Math.PI * 0.12, Math.PI * 0.3]) {
      const b = onE(46, 25, t), l = onE(46, 25, t - 0.2), r = onE(46, 25, t + 0.2), out = onE(66, 42, t);
      fangs.push({ p: [P(...l, 1), [lerp(b, out, 0.6)[0] - 2, lerp(b, out, 0.6)[1] - 8], P(out[0], out[1] - 14, 1), P(...r, 1)], c: o.fang, m: 'horn', gloss: 0.8, line: 0.6, lines: [{ p: [b, [out[0], out[1] - 12]], w: 0.9, light: true, a: 0.5 }] });
    }
    const toothRing = (rx, ry, rin, n, c, len) => {
      const out = [];
      for (let i = 0; i < n; i++) {
        const t = i / n * Math.PI * 2, t0 = t - Math.PI / n * 0.7, t1 = t + Math.PI / n * 0.7;
        out.push({ p: [P(...onE(rx, ry, t0), 1), P(...onE(rx * rin, ry * rin, t), 1), P(...onE(rx, ry, t1), 1)], c, m: 'horn', line: 0.45 });
      }
      return out;
    };
    const headS = [
      ...fangs.slice(0, 6),
      { p: E(50, 28, 18), c: tone(C, 0.04), m: 'skin', line: 0.9, id: 'lip', lines: [{ p: E(46, 25, 16).concat([E(46, 25, 16)[0]]), w: 1.2, a: 0.4 }] },
      { p: E(42, 22, 16, 1, 1), c: o.gum, m: 'skin', line: 0.6, sub: [{ p: E(28, 13, 14, 3, 3), c: '#2a0808', m: 'flat', line: 0 }, { p: E(14, 6, 10, 4, 4), c: '#0e0404', m: 'flat', line: 0 }] },
      ...toothRing(41, 21.5, 0.64, o.teeth, '#f2ead4', 0),
      ...toothRing(28, 14, 0.55, o.teeth - 4, '#e0d4b4', 0),
      ...fangs.slice(6),
      ...(o.drool ? [{ p: tube([[222, 96, 4], [226, 112, 3], [224, 124, 2]]), c: o.drool, m: 'gem', line: 0.4 }, { e: [224, 130, 3.4, 4.4], c: o.drool, m: 'gem', line: 0.4, glint: [[223, 128, 1.2]] },
        { p: tube([[164, 102, 3.5], [162, 116, 2.5]]), c: o.drool, m: 'gem', line: 0.4 }] : []),
    ];
    // бархан: дальний склон за телом, ближний — насыпан поверх основания
    const grains = [[40, 282, 3], [66, 266, 2.4], [230, 270, 3], [252, 282, 2.2], [210, 252, 2.4], [84, 250, 2]];
    const back = { kind: 'legs', pivot: [150, 290], shapes: [
      { p: [P(6, G, 1), [40, 290], [84, 276], [130, 268], [180, 270], [226, 280], [268, 292], [292, G, 1], [4, G, 1]], c: o.sand, m: 'skin', gloss: 0, belly: 0.3, line: 0.7, lines: [{ p: [[50, 290], [120, 274], [190, 276], [250, 290]], w: 1.4, light: true, a: 0.5 }] },
      ...grains.map(([x, y, r]) => ({ e: [x, y, r, r], c: tone(o.sand, -0.1), m: 'horn', line: 0.4 })),
    ] };
    const front = { kind: 'legs', pivot: [150, 296], shapes: [
      { p: [P(34, G, 1), [70, 294], [96, 284], [120, 290], [138, 280], [162, 288], [196, 286], [230, 296], [262, G, 1], [30, G, 1]], c: tone(o.sand, 0.08), m: 'skin', gloss: 0, belly: 0.25, line: 0.7,
        lines: [{ p: [[80, 292], [118, 286], [160, 290], [210, 292]], w: 1.2, light: true, a: 0.5 }] },
      ...[[64, 298, 4], [212, 300, 3.4], [150, 296, 2.6]].map(([x, y, r]) => ({ e: [x, y, r * 1.4, r], c: tone(o.sand, -0.15), m: 'horn', line: 0.4 })),
    ] };
    const parts = [back, { kind: 'torso', pivot: [140, 290], shapes: bodyS }, { kind: 'head', pivot: [186, 118], shapes: headS }, front];
    V.def(name, placeAt(name, parts, [147, G], o.size || 1));
  }
  sandworm('sandworm', { body: '#d0a472', belly: '#ecd4a8', gum: '#c05a5a', sand: SAND, teeth: 14, fang: '#f0e6cc' });
  sandworm('olgoi_khorkhoi', { body: '#b0302a', belly: '#e07a5a', gum: '#6a1418', sand: '#d4a868', teeth: 18, spikes: '#3a1a14', drool: '#9ae040', fang: '#2a1a14' });

  /* ================= Стрелок / охотник за головами =================
     Ковбой: широкополая шляпа, рубаха и жилет, кобура на поясе, револьвер вперёд. */
  function gunslinger(name, o) {
    const hx = H.headX, hy = H.headY, r = H.headR;
    const legs = (hip, foot, side) => {
      const d = side < 0 ? -0.2 : 0, out = leg(hip, foot, { style: 'hose', c: tone(o.pants, d), boot: tone(o.boot, d), tw: 25, toe: 13 });
      const kx = (hip[0] + foot[0]) / 2 + 3, ky = (hip[1] + foot[1]) / 2 - 2;
      // кожаные чапсы спереди штанины, бахрома по шву
      out.splice(2, 0, { p: tube([[hip[0] + 3, hip[1] - 2, 20], [kx + 3, ky, 17], [foot[0] + 1, foot[1] - 24, 15]], { flat0: true, flat1: true }), c: tone(o.chaps, d), m: 'leather',
        lines: [{ p: [[hip[0] - 5, hip[1] + 6], [kx - 5, ky], [foot[0] - 6, foot[1] - 26]], w: 1.6, c: tone(o.chaps, d - 0.3), a: 0.8 }] });
      // шпора: хвостовик и колёсико
      out.push({ p: tube([[foot[0] - 12, foot[1] - 7, 2.4], [foot[0] - 19, foot[1] - 8, 2.4]]), c: '#b8bec8', m: 'steel', line: 0.4 },
        { e: [foot[0] - 21, foot[1] - 8, 3.6, 3.6], c: '#c8ccd4', m: 'steel', line: 0.5 });
      return out;
    };
    const coat = o.duster;
    const back = [
      ...(coat ? [{ p: [[70, 88], [96, 84], [94, 150], [86, 232], [64, 236, 1], [52, 196], [58, 140]], c: tone(coat, -0.18), m: 'leather', belly: 0.3, lines: [{ p: [[76, 150], [66, 226]], w: 1.2, a: 0.4 }] }] : []),
      ...arm([80, 90], [70, 122], [84, 144], { c: tone(coat || o.shirt, -0.16), hand: tone(SKIN, -0.1), w: 16 }),
    ];
    const body = [
      ...torso({ c: o.shirt, skirt: false, belt: false, neck: SKIN }),
      ...(coat ? [
        // пыльник: полы распахнуты до голени
        { p: [[64, 84], [98, 82], [102, 150], [96, 238, 1], [70, 240, 1], [60, 190], [62, 140]], c: coat, m: 'leather', belly: 0.25, id: 'coatL', lines: [{ p: [[80, 100], [80, 230]], w: 1.1, a: 0.35 }] },
        { p: [[118, 82], [136, 92], [140, 150], [150, 230], [130, 236, 1], [118, 234], [114, 150]], c: coat, m: 'leather', belly: 0.25, id: 'coatR', lines: [{ p: [[128, 110], [136, 226]], w: 1.1, a: 0.35 }] },
        { p: [[98, 82], [112, 80], [118, 96], [104, 104]], c: tone(coat, -0.12), m: 'leather', line: 0.6 },
        { p: tube([[72, 90, 7], [104, 124, 7], [132, 148, 7]]), c: o.vest, m: 'leather', line: 0.6, glint: rivets([[82, 100], [92, 110], [102, 120], [112, 130], [122, 140]], 2.4) },
      ] : [
        { p: [[66, 86], [96, 82], [100, 142], [74, 146], [66, 120]], c: o.vest, m: 'leather', id: 'vestL' },
        { p: [[116, 82], [132, 88], [138, 110], [134, 142], [114, 144]], c: o.vest, m: 'leather', id: 'vestR' },
        { p: [P(84, 104, 1), P(86, 98, 1), P(88, 104, 1), P(94, 104, 1), P(89, 108, 1), P(91, 114, 1), P(86, 110, 1), P(81, 114, 1), P(83, 108, 1), P(78, 104, 1)], c: BRASS, m: 'gold', gloss: 1.2, line: 0.5, glint: [[85, 106, 1.8]] },
      ]),
      // шейный платок
      { p: [[92, 80], [120, 78], [120, 88], [108, 102, 1], [94, 90]], c: o.scarf, m: 'cloth', line: 0.7 },
      // оружейный пояс с патронами и кобура
      { p: [[70, 140], [134, 144], [136, 156], [70, 152]], c: o.belt, m: 'leather', glint: rivets([[80, 146], [88, 147], [96, 148], [112, 150], [120, 151]], 1.8),
        sub: [{ p: [P(100, 142, 1), P(110, 143, 1), P(110, 156, 1), P(100, 155, 1)], c: '#c8ccd4', m: 'steel' }] },
      { p: [[124, 148], [140, 150], [144, 184], [132, 190], [124, 182]], c: tone(o.belt, 0.08), m: 'leather', line: 0.8, lines: [{ p: [[128, 156], [138, 158]], w: 1, a: 0.5 }] },
      { p: [[76, 150], [130, 154], [130, 172], [104, 170], [78, 172]], c: tone(o.pants, -0.08), m: 'cloth', line: 0.4, id: 'hips' },
    ];
    const headS = [
      ...head(hx, hy, r, { skin: SKIN, hair: o.hair, hairStyle: 'short', beard: o.beard, beardLen: 1.2 }),
      { p: [[hx + 4, hy + 10], [hx + 18, hy + 8], [hx + 28, hy + 12], [hx + 26, hy + 18], [hx + 16, hy + 14], [hx + 6, hy + 17]], c: o.hair, m: 'fur', furLen: 0.4, flow: 0 },
      ...(o.mask ? [{ p: [[hx - 6, hy + 2], [hx + 24, hy + 2], [hx + 29, hy + 10], [hx + 20, hy + 24], [hx + 6, hy + 30, 1], [hx - 4, hy + 16]], c: o.mask, m: 'cloth', line: 0.7, lines: [{ p: [[hx + 2, hy + 10], [hx + 22, hy + 12]], w: 1, a: 0.4 }] }] : []),
      ...cowHat(hx + 2, hy - 2, { c: o.hat, band: o.band, flat: !!o.mask, m: 'leather' }),
    ];
    // ближняя рука: револьвер вперёд либо винтовка с прицелом у пояса
    let armS;
    if (o.rifle) {
      const hand = [156, 122], dir = [1, -0.14], at = along(hand, dir);
      armS = [
        { p: [at(-50, 2), at(-12, -3), at(-4, 6), at(-10, 10), P(...at(-48, 14), 1)], c: '#6a4424', m: 'wood', line: 0.8 },
        { p: tube([[...at(-10, 1), 10], [...at(40, -1), 8]]), c: '#7a4e2a', m: 'wood', line: 0.8 },
        { p: tube([[...at(-6, -5), 6], [...at(112, -5), 5]], { flat1: true }), c: '#6a6e78', m: 'steel', gloss: 1.1, line: 0.7 },
        { p: tube([[...at(8, -12), 7], [...at(50, -12), 7]]), c: '#2a2c32', m: 'steel', gloss: 1.2, line: 0.6, lines: [{ p: [at(12, -14), at(46, -14)], w: 1, light: true, a: 0.7 }] },
        { e: [...at(50, -12), 3, 4.5], c: '#6ad0f0', m: 'gem', line: 0.5 },
        { p: tube([[...at(20, -6), 3], [...at(20, -10), 3]]), c: '#2a2c32', m: 'steel', line: 0.4 }, { p: tube([[...at(40, -6), 3], [...at(40, -10), 3]]), c: '#2a2c32', m: 'steel', line: 0.4 },
        ...arm([126, 90], [140, 118], hand, { c: coat || o.shirt, m: coat ? 'leather' : 'cloth', hand: SKIN, w: 16 }),
        { e: [126, 94, 14, 13], c: coat || o.shirt, m: coat ? 'leather' : 'cloth' },
      ];
    } else {
      const hand = [174, 100];
      armS = [
        ...revolver(hand, [1, -0.08], { len: 32 }),
        ...arm([126, 90], [150, 106], hand, { c: o.shirt, hand: SKIN, w: 16 }),
        { e: [124, 96, 12, 11], c: tone(o.shirt, -0.06), m: 'cloth' },
      ];
    }
    V.def(name, humanoid({ name, size: o.size || 0.98, legs, back, body, head: headS, arm: armS }));
  }
  gunslinger('gunslinger', { shirt: SHIRT, vest: '#7a4a28', pants: '#5e5244', chaps: '#8a5a32', boot: '#4a2e1a', belt: '#5a3820', scarf: '#b8302a', hair: '#5a3418', hat: '#9a6a3a', band: '#4a2e18' });
  gunslinger('bounty_hunter', { shirt: '#c8b890', vest: '#4a3020', pants: '#4a4238', chaps: '#3a2a1c', boot: '#2a1c12', belt: '#3a2618', scarf: '#6a1a18', hair: '#2a1c14', beard: '#2a1c14', hat: '#2a2226', band: '#8a6a3a',
    duster: '#6a5238', mask: '#7a2020', rifle: true });

  /* ================= Коатль / багровый коатль =================
     Пернатый змей: кольцо тела на земле, шея вверх, перьевой воротник и гребень, крылья «галочкой». */
  function couatl(name, o) {
    const C = o.body, CD = tone(C, -0.22), B = o.belly;
    const low = [[18, 304, 7], [56, 300, 18], [104, 293, 32], [160, 288, 42], [212, 282, 48], [244, 262, 50], [244, 234, 50]];
    const up = [[246, 244, 50], [220, 222, 50], [180, 216, 48], [152, 198, 46], [148, 166, 42], [164, 140, 36], [192, 124, 30], [222, 114, 27], [246, 110, 25]];
    const bellyT = (pts, sides) => tube(pts.map((q, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), s = sides[i]; return [q[0] - ty * q[2] * 0.3 * s, q[1] + tx * q[2] * 0.3 * s, q[2] * 0.4]; }));
    const scales = pts => pts.slice(1, -1).map((q, i) => { const a = pts[i], b = pts[i + 2], [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), w = q[2] * 0.5; return { p: [[q[0] + ty * w, q[1] - tx * w], [q[0] - tx * w * 0.2, q[1] - ty * w * 0.2], [q[0] - ty * w, q[1] + tx * w]], w: 1.1, a: 0.35 }; });
    const bodyS = [
      { p: tube(low), c: CD, m: 'skin', tex: 'scale', texSize: 0.9, belly: 0.25, lines: scales(low), sub: [{ p: bellyT(low, [1, 1, 1, 1, 1, 1, 1]), c: tone(B, -0.12), m: 'skin', line: 0 }] },
      ...(o.fan ? [0, 1, 2, 3].map(i => { const lf = K.leaf([24, 296], Math.PI * (0.98 + i * 0.07), 48 - i * 3, 15); return { p: lf.body, c: [o.w.pri, o.w.cov, o.w.sec, o.w.cov2][i], m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.8, light: true, a: 0.5 }] }; }) : []),
      { p: tube(up, { flat0: true }), c: C, m: 'skin', tex: 'scale', texSize: 0.9, belly: 0.2, lines: scales(up), sub: [{ p: bellyT(up, [-1, -1, -1, -0.5, 1, 1, 1, 1, 1]), c: B, m: 'skin', line: 0 }] },
      ...(o.rings ? [[150, 186, 44], [152, 160, 40], [232, 264, 48]].map(([x, y, w]) => ({ p: tube([[x - w * 0.5, y - 2, 6], [x, y + 3, 6], [x + w * 0.5, y - 2, 6]]), c: o.rings, m: 'gold', gloss: 1.2, line: 0.5 })) : []),
    ];
    // перьевой воротник у основания шеи
    const ruffC = o.ruff;
    for (let i = 0; i < 7; i++) {
      const b = lerp([168, 132], [206, 118], i / 6), lf = K.leaf(b, Math.PI * (0.72 + i * 0.03), 30 - i, 13);
      bodyS.push({ p: lf.body, c: ruffC[i % ruffC.length], m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.8, light: true, a: 0.5 }] });
    }
    const crest = [];
    const nCrest = o.crestN || 4;
    for (let i = 0; i < nCrest; i++) {
      const lf = K.leaf([252 - i * 3, 94 + i * 2], -Math.PI * (0.62 + i * 0.1), 62 - i * 6 + (o.crestL || 0), 13);
      crest.push({ p: lf.body, c: o.crest[i % o.crest.length], m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.9, light: true, a: 0.55 }] });
    }
    const headS = [
      ...crest,
      // нижняя челюсть, пасть приоткрыта
      { p: [[244, 116], [270, 122], [300, 128], [320, 128], [322, 134], [302, 140], [272, 140], [250, 132]], c: CD, m: 'skin', tex: 'scale', texSize: 0.5, sub: [{ p: [[250, 132], [320, 132], [320, 142], [250, 142]], c: B, m: 'skin', line: 0 }] },
      { p: [[268, 120], [318, 120], [318, 128], [270, 126]], c: '#5a1418', m: 'flat', line: 0 },
      ...teeth([276, 125], [316, 126], 4, -5, '#f2ead4'),
      // череп и верхняя челюсть
      { p: [[238, 112], [244, 96], [262, 86], [288, 86], [310, 92], [328, 102], [334, 112], [326, 120], [300, 120], [272, 122], [250, 124]], c: C, m: 'skin', tex: 'scale', texSize: 0.5, id: 'skull',
        lines: [{ p: [[262, 92], [290, 90], [316, 98]], w: 1.2, light: true, a: 0.5 }] },
      ...teeth([280, 120], [322, 119], 5, 5, '#f2ead4'),
      { p: [P(318, 118, 1), P(321, 130, 1), P(324, 118, 1)], c: '#fff8e8', m: 'horn', line: 0.5 },
      { e: [326, 106, 2.4, 1.6], c: '#1a0a0a', m: 'flat', line: 0 },
      // глаз и надбровье-перья
      { e: [288, 100, 6, 4.8], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [289.5, 100, 1.6, 4], c: '#0a0606', m: 'flat', line: 0 }], glint: [[287, 98.5, 1.6]] },
      { p: [[274, 94], [290, 90], [302, 94], [296, 96], [280, 98]], c: tone(C, -0.3), m: 'skin', line: 0.5 },
      ...[0, 1, 2].map(i => { const lf = K.leaf([266 - i * 8, 108 + i * 3], Math.PI * (0.92 + i * 0.04), 18, 8); return { p: lf.body, c: o.crest[(i + 1) % o.crest.length], m: 'leather', gloss: 0.5, line: 0.5 }; }),
      ...(o.diadem ? [{ p: tube([[250, 98, 6], [270, 88, 6], [292, 86, 6]]), c: BRASS, m: 'gold', gloss: 1.2, line: 0.5 },
        { e: [270, 88, 5, 5.6], c: o.diadem, m: 'gem', line: 0.6, glint: [[268.5, 86, 1.8]] }] : []),
    ];
    const W = o.w, Wf = { pri: tone(W.pri, -0.2), pri2: tone(W.pri2 || W.pri, -0.2), sec: tone(W.sec, -0.2), sec2: tone(W.sec2 || W.sec, -0.2), cov: tone(W.cov, -0.2), cov2: tone(W.cov2, -0.2) };
    const parts = [
      { kind: 'prop', pivot: [196, 138], shapes: mirror(wing.feather([196, 138], [-0.5, -1], 112, Wf), 196) },
      { kind: 'torso', pivot: [180, 250], shapes: bodyS },
      { kind: 'head', pivot: [238, 118], shapes: headS },
      { kind: 'prop', pivot: [168, 150], shapes: wing.feather([168, 150], [-0.8, -0.72], 128, W) },
    ];
    V.def(name, placeAt(name, parts, [173, 310], o.size || 0.88));
  }
  couatl('couatl', { body: '#3a9a52', belly: '#e8d878', eye: '#f0c020', ruff: ['#d8402a', '#f0b830', '#2aa0a0'], crest: ['#2a9a8a', '#e8b030', '#d8402a', '#3aba5a'],
    w: { pri: '#1e7a6a', pri2: '#2a8a78', sec: '#e0a830', sec2: '#d09420', cov: '#d8502a', cov2: '#3a9a52' } });
  couatl('crimson_couatl', { body: '#b02a2a', belly: '#f0b848', eye: '#a0f040', ruff: ['#f0c040', '#1a1414', '#f0e0a0'], crest: ['#f0c040', '#e04a1a', '#1a1414', '#fff0a0'], crestN: 6, crestL: 12,
    w: { pri: '#4a1216', pri2: '#5a1a1a', sec: '#e06a1e', sec2: '#d05a18', cov: '#f0b030', cov2: '#b02a2a' }, rings: BRASS, diadem: '#3ad08a', fan: true });
})(typeof window !== 'undefined' ? window : globalThis);
