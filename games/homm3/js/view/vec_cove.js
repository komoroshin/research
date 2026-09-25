/* ============================================================================
   view/vec_cove.js — Бухта на рисованном конвейере.
   Гамма фракции: морская бирюза, выбеленная парусина, красные кафтаны,
   чёрные треуголки, пиратское золото; чешуя — кожа с фактурой 'scale'.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   в другой гамме и с отличительной деталью.
   Гуманоидов рисуем в каноне (земля y=246, центр x=100), place() вписывает
   их в рамку старого спрайта.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, along, lerp, ell, leaf, weapon, head, arm, leg, humanoid, wing, fit, frameOf, tone, H } = K;
  const GOLD = '#d8a53a', TAN = '#d49a6a', DARK = '#140e0a';

  /* ---------- помощники этого файла ---------- */
  const FB = { w: 200, h: 250, anchor: [100, 246] };
  /** Вписать части из канона (земля y=246, центр x=100+dx) в рамку старого спрайта name. */
  function place(name, parts, size, dx) {
    const to = frameOf(name) || FB;
    return fit(parts, { ground: [100 + (dx || 0), 246] }, to, to.anchor[1] / 246 * (size || 1));
  }
  /** Прямое древко a → b: у концов короткие отрезки, чтобы сглаживание не выносило контур за торец. */
  function rod(a, b, w0, w1) {
    const q = t => [...lerp(a, b, t), w0 + (w1 - w0) * t];
    return tube([q(0), q(0.03), q(0.5), q(0.97), q(1)]);
  }
  /** Горизонтальные полосы внутри формы (тельняшка): кладутся в sub, родитель их обрежет. */
  function stripes(x0, x1, y0, y1, step, w, c) {
    const out = [];
    for (let y = y0; y < y1; y += step) out.push({ p: [P(x0, y, 1), P(x1, y - 1, 1), P(x1, y + w - 1, 1), P(x0, y + w, 1)], c, m: 'cloth', line: 0 });
    return out;
  }
  /** Абордажная сабля: широкий изогнутый клинок и чашка-гарда, прикрывающая кулак (кладётся после кисти). */
  function cutlass(hand, dir, len, o) {
    o = o || {}; const at = along(hand, dir), bl = o.blade || '#d6dde6', gd = o.guard || GOLD, wd = o.wide || 1;
    return {
      blade: [
        { p: [at(-2, -2.6), at(-2, 2.6), at(-13, 2.4), at(-13, -2.4)], c: '#3a2416', m: 'leather', line: 0.6 },
        { p: [P(...at(4, -4.2 * wd), 1), at(len * 0.4, -5.6 * wd), at(len * 0.78, -5.2 * wd), P(...at(len, 3), 1), at(len * 0.8, 6.8 * wd), at(len * 0.4, 5.8 * wd), P(...at(4, 4.2 * wd), 1)], c: bl, m: 'steel', gloss: 1.2, line: 0.7,
          lines: [{ p: [at(8, -2.4 * wd), at(len * 0.45, -3.6 * wd), at(len * 0.8, -2 * wd)], w: 1, light: true, a: 0.9 }, { p: [at(8, 1.5), at(len * 0.6, 2)], w: 1, a: 0.3 }] },
      ],
      guard: [
        { p: tube([[...at(5, -6), 3.2], [...at(3, 5), 3.6], [...at(-6, 9.5), 3.4], [...at(-14, 7), 3], [...at(-17, 1), 2.6]]), c: gd, m: 'gold', line: 0.6 },
        { p: [P(...at(2, -8), 1), P(...at(6, -8), 1), P(...at(6, 6), 1), P(...at(2, 6), 1)], c: gd, m: 'gold', line: 0.6 },
        { e: [...at(-16, 0), 3.2, 3.2], c: gd, m: 'gold', line: 0.6 },
      ],
    };
  }
  /** Кремнёвый пистолет или мушкет: ложе, ствол с латунными кольцами, курок. len — длина ствола. */
  function flintlock(hand, dir, len, o) {
    o = o || {}; const at = along(hand, dir), wood = o.wood || '#6a3e22', metal = o.metal || '#5a5e66', brass = o.brass || GOLD;
    const out = [];
    if (o.musket) out.push({ p: [at(-6, -3), at(len * 0.72, -4), at(len * 0.72, 2.5), at(-2, 5), at(-30, 13), at(-40, 16), at(-42, 6), at(-26, 1)], c: wood, m: 'wood', line: 0.8, flow: Math.atan2(dir[1], dir[0]) });
    else out.push({ p: [at(-4, -4), at(10, -4.5), at(10, 3), at(0, 4), at(-7, 14), at(-14, 16), at(-15, 10), at(-9, 2)], c: wood, m: 'wood', line: 0.8, flow: Math.atan2(dir[1], dir[0]) + 1 },
      { e: [...at(-13, 14), 3.6, 3.2], c: brass, m: 'gold', line: 0.6 });
    out.push({ p: tube([[...at(2, -4.5), 5.2], [...at(len, -4.5), 4.6]], { flat1: true }), c: metal, m: 'steel', gloss: 1.1, line: 0.7,
      lines: [{ p: [at(4, -6.2), at(len - 2, -6)], w: 0.9, light: true, a: 0.8 }] });
    for (const t of o.musket ? [0.3, 0.6, 0.94] : [0.55, 0.94]) out.push({ p: tube([[...at(len * t - 1.5, -4.5), 6.4], [...at(len * t + 1.5, -4.5), 6.4]], { flat0: true, flat1: true }), c: brass, m: 'gold', line: 0.5 });
    // замок и курок
    out.push({ p: [at(-3, -3), at(6, -3), at(6, 1), at(-3, 1)], c: metal, m: 'steel', line: 0.6 },
      { p: [P(...at(-2, -3), 1), P(...at(-5, -10), 1), P(...at(-1, -11), 1), P(...at(2, -4), 1)], c: tone(metal, -0.1), m: 'steel', line: 0.6 });
    return out;
  }
  /** Жемчужина-блик. */
  const pearl = (x, y, r) => ({ e: [x, y, r, r], c: '#f4f0f4', m: 'gem', gloss: 1.2, line: 0.5, glint: [[x - r * 0.35, y - r * 0.35, r * 0.45]] });
  /** Ракушка-гребешок: веер с рёбрами, основание внизу (x, y — середина). */
  function scallop(x, y, r, c) {
    const out = [P(x - r * 0.25, y + r * 0.9, 1), P(x - r * 0.4, y + r * 0.62, 1)];
    for (let i = 0; i <= 6; i++) { const a = Math.PI * (1.1 + i * 0.8 / 6); out.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.9 + r * 0.2]); }
    out.push(P(x + r * 0.4, y + r * 0.62, 1), P(x + r * 0.25, y + r * 0.9, 1));
    return { p: out, c, m: 'horn', gloss: 0.6, line: 0.6, lines: [-0.6, -0.3, 0, 0.3, 0.6].map(t => ({ p: [[x, y + r * 0.75], [x + t * r * 1.2, y - r * 0.55]], w: 0.8, a: 0.45 })) };
  }
  /** Бандана: косынка на своде черепа и хвостики узла на затылке. */
  function bandana(cx, cy, r, c) {
    return [
      { p: [[cx - r * 1.35, cy + r * 0.1], [cx - r * 1.6, cy + r * 0.7, 1], [cx - r * 1.1, cy + r * 0.45], [cx - r * 1.2, cy + r * 1.0, 1], [cx - r * 0.85, cy + r * 0.2]], c: tone(c, -0.12), m: 'cloth', line: 0.7 },
      { p: [[cx - r * 1.05, cy + r * 0.05], [cx - r * 0.9, cy - r * 0.78], [cx - r * 0.05, cy - r * 1.16], [cx + r * 0.78, cy - r * 0.86], [cx + r * 1.02, cy - r * 0.34, 1], [cx + r * 0.3, cy - r * 0.42], [cx - r * 0.35, cy - r * 0.22], [cx - r * 0.78, cy + r * 0.12]], c, m: 'cloth',
        lines: [{ p: [[cx - r * 0.6, cy - r * 0.7], [cx + r * 0.3, cy - r * 0.8]], w: 1, a: 0.35 }, { p: [[cx - r * 0.3, cy - r * 0.45], [cx + r * 0.6, cy - r * 0.55]], w: 1, a: 0.3 }] },
      { e: [cx - r * 0.98, cy + r * 0.05, r * 0.2, r * 0.18], c: tone(c, -0.08), m: 'cloth', line: 0.7 },
    ];
  }
  /** Треуголка: тулья, три загнутых поля (переднее — острым углом), золотой галун; plume — перо. */
  function tricorn(cx, cy, r, o) {
    const c = o.c || '#1e1a1c', tr = o.trim;
    const out = [];
    if (o.plume) for (let i = 2; i >= 0; i--) {
      const lf = leaf([cx - r * 0.1, cy - r * 1.0], Math.PI * (1.12 + i * 0.1), r * (2.3 - i * 0.3), r * 0.9);
      out.push({ p: lf.body, c: i === 1 ? tone(o.plume, -0.08) : o.plume, m: 'fur', furLen: 0.9, flow: Math.PI * (1.12 + i * 0.1), line: 0.6, lines: [{ p: lf.shaft, w: 1, a: 0.35 }] });
    }
    out.push(
      // тулья
      { p: [[cx - r * 0.9, cy - r * 0.5], [cx - r * 0.75, cy - r * 1.2], [cx, cy - r * 1.42], [cx + r * 0.75, cy - r * 1.2], [cx + r * 0.9, cy - r * 0.5]], c: tone(c, -0.1), m: 'cloth' },
      // поля: заднее вздёрнуто, переднее уходит углом вперёд-вниз
      { p: [[cx - r * 1.55, cy - r * 0.2], [cx - r * 1.5, cy - r * 1.05, 1], [cx - r * 0.6, cy - r * 0.9], [cx + r * 0.35, cy - r * 1.28, 1], [cx + r * 1.0, cy - r * 0.9], [cx + r * 1.7, cy - r * 0.34, 1], [cx + r * 0.9, cy - r * 0.42], [cx, cy - r * 0.45], [cx - r * 0.9, cy - r * 0.32]], c, m: 'cloth',
        lines: [{ p: [[cx - r * 1.45, cy - r * 0.98], [cx - r * 0.6, cy - r * 0.85], [cx + r * 0.35, cy - r * 1.22], [cx + r * 1.0, cy - r * 0.86], [cx + r * 1.62, cy - r * 0.36]], w: tr ? 2.4 : 1.2, c: tr || tone(c, 0.4), a: tr ? 1 : 0.6 }] },
    );
    if (o.skull) out.push({ e: [cx + r * 0.18, cy - r * 0.8, r * 0.2, r * 0.18], c: '#ece6d6', m: 'horn', line: 0.5, sub: [{ e: [cx + r * 0.24, cy - r * 0.82, r * 0.05, r * 0.05], c: DARK, m: 'flat', line: 0 }] });
    if (o.cockade) out.push({ e: [cx - r * 0.35, cy - r * 0.95, r * 0.2, r * 0.2], c: o.cockade, m: 'cloth', line: 0.5, sub: [{ e: [cx - r * 0.35, cy - r * 0.95, r * 0.08, r * 0.08], c: GOLD, m: 'gold', line: 0 }] });
    return out;
  }

  /* ================= Матрос / морской волк =================
     Тельняшка, широкие штаны, абордажная сабля над головой. Морской волк — в бушлате, с бородой и серьгой. */
  function sailor(name, o) {
    const SK = o.skin || TAN, SKD = tone(SK, -0.18), hx = H.headX, hy = H.headY, r = H.headR;
    const legs = (hip, foot, side) => {
      const c = side < 0 ? tone(o.pants, -0.2) : o.pants;
      const s = leg(hip, foot, { style: 'hose', c, boot: o.boots ? (side < 0 ? tone(o.boots, -0.15) : o.boots) : (side < 0 ? SKD : SK), tw: 29, toe: o.boots ? 12 : 10 });
      if (!o.boots) s[s.length - 1].m = 'skin';
      // подвёрнутая штанина
      if (!o.boots) s.push({ p: tube([[foot[0] - 1, foot[1] - 24, 22], [foot[0] - 2, foot[1] - 15, 21]], { flat0: true, flat1: true }), c: tone(c, 0.08), m: 'cloth', line: 0.7 });
      return s;
    };
    const shirt = { p: [[74, 82], [126, 80], [138, 94], [136, 122], [128, 150], [76, 150], [68, 122], [64, 96]], c: o.shirt, m: 'cloth', id: 'chest',
      sub: stripes(56, 150, 90, 152, 11, 5, o.stripe) };
    const coat = o.coat ? [
      { p: [[70, 82], [98, 80], [100, 110], [98, 150], [96, 190], [70, 194, 1], [62, 150], [62, 110]], c: o.coat, m: 'cloth', belly: 0.25, lines: [{ p: [[92, 90], [94, 188]], w: 1.2, a: 0.5 }] },
      { p: [[114, 80], [128, 82], [140, 96], [138, 124], [134, 150], [138, 190, 1], [118, 188], [120, 150], [116, 116]], c: tone(o.coat, 0.06), m: 'cloth', belly: 0.25, lines: [{ p: [[120, 90], [124, 186]], w: 1.2, a: 0.5 }] },
      ...[102, 122, 142].map(y => ({ e: [114, y, 3, 3], c: GOLD, m: 'gold', line: 0.5 })),
      { p: [[96, 80], [108, 82], [112, 104, 1], [100, 98]], c: tone(o.coat, 0.12), m: 'cloth', line: 0.7 },
    ] : [];
    const hand = [160, 96], blade = cutlass(hand, norm(0.42, -1), o.bladeLen || 78, { wide: o.wide || 1 });
    const hat = o.cap
      ? [{ p: [[hx - r * 1.05, hy - r * 0.05], [hx - r * 1.05, hy - r * 0.8], [hx - r * 0.2, hy - r * 1.28], [hx + r * 0.72, hy - r * 1.0], [hx + r * 1.0, hy - r * 0.36, 1], [hx + r * 0.2, hy - r * 0.4], [hx - r * 0.6, hy - r * 0.05]], c: o.cap, m: 'cloth',
        lines: [{ p: [[hx - r * 0.9, hy - r * 0.55], [hx + r * 0.9, hy - r * 0.5]], w: 1, a: 0.4 }, { p: [[hx - r * 0.8, hy - r * 0.85], [hx + r * 0.6, hy - r * 0.9]], w: 1, a: 0.3 }] },
        { p: tube([[hx - r * 1.05, hy - r * 0.2, 8], [hx, hy - r * 0.42, 8], [hx + r * 1.0, hy - r * 0.42, 8]]), c: tone(o.cap, -0.12), m: 'cloth', line: 0.7 }]
      : bandana(hx, hy, r, o.bandana);
    V.def(name, humanoid({
      name, size: o.size || 1,
      legs,
      back: [...arm([80, 90], [70, 120], [80, 146], { c: o.coat || o.shirt, fore: o.coat || SKD, foreM: o.coat ? 'cloth' : 'skin', hand: SKD, w: 15 }),
        ...(o.coat ? [] : [{ p: tube([[72, 112, 16], [70, 122, 15]]), c: tone(o.shirt, -0.1), m: 'cloth', line: 0.6 }])],
      body: [
        { p: [[74, 140], [130, 140], [136, 178], [104, 182], [70, 178]], c: o.pants, m: 'cloth', lines: [{ p: [[104, 156], [104, 182]], w: 1.1, a: 0.5 }] },
        shirt, ...coat,
        { p: tube([[72, 146, 9], [104, 150, 9], [134, 146, 9]]), c: o.sash, m: o.sashM || 'cloth', line: 0.7 },
        ...(o.sashM === 'leather' ? [{ p: [P(98, 142, 1), P(110, 142, 1), P(110, 155, 1), P(98, 155, 1)], c: GOLD, m: 'gold', glint: [[101, 145, 2]] }] : [{ p: [[76, 148], [70, 170, 1], [80, 164], [84, 152]], c: tone(o.sash, -0.1), m: 'cloth', line: 0.7 }]),
        { p: tube([[hx - 4, 68, 17], [hx - 6, 86, 20]]), c: SK, m: 'skin' },
        { p: [[88, 80], [104, 94], [120, 80], [114, 88], [104, 100], [94, 88]], c: o.collar || '#2c4a8a', m: 'cloth', line: 0.7 },
      ],
      head: [
        ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'short', beard: o.beard, beardLen: 1.6 }),
        ...(o.stubble ? [{ p: [[hx + r * 0.1, hy + r * 0.45], [hx + r * 0.9, hy + r * 0.55], [hx + r * 0.6, hy + r * 0.95], [hx - r * 0.1, hy + r * 0.85]], c: tone(SK, -0.3), m: 'flat', line: 0, id: 'stubble' }] : []),
        ...(o.moustache ? [{ p: [[hx + r * 0.45, hy + r * 0.45], [hx + r * 1.05, hy + r * 0.4], [hx + r * 1.2, hy + r * 0.65, 1], [hx + r * 0.8, hy + r * 0.58], [hx + r * 0.4, hy + r * 0.7]], c: o.beard, m: 'fur', furLen: 0.5, flow: 0 }] : []),
        ...hat,
        ...(o.earring ? [{ p: tube([[hx - r * 0.42, hy + r * 0.34, 2.2], [hx - r * 0.3, hy + r * 0.62, 2.2], [hx - r * 0.52, hy + r * 0.62, 2.2], [hx - r * 0.44, hy + r * 0.36, 2.2]]), c: GOLD, m: 'gold', line: 0.4 }] : []),
        ...(o.pipe ? [{ p: tube([[hx + r * 0.9, hy + r * 0.62, 3], [hx + r * 1.4, hy + r * 0.8, 3]]), c: '#3a2418', m: 'wood', line: 0.5 }, { p: [[hx + r * 1.3, hy + r * 0.62], [hx + r * 1.62, hy + r * 0.6], [hx + r * 1.6, hy + r * 1.0], [hx + r * 1.34, hy + r * 1.0]], c: '#5a3420', m: 'wood', line: 0.6 }] : []),
      ],
      arm: [
        ...blade.blade,
        ...arm([124, 90], [146, 116], hand, { c: o.coat || o.shirt, fore: o.coat || SK, foreM: o.coat ? 'cloth' : 'skin', hand: SK, w: 15 }),
        o.coat ? { p: tube([[152, 110, 17], [156, 102, 16]]), c: tone(o.coat, 0.1), m: 'cloth', line: 0.6 }
          : { p: tube([[138, 108, 17], [147, 116, 16]]), c: tone(o.shirt, -0.05), m: 'cloth', line: 0.6, sub: stripes(120, 170, 100, 124, 8, 3.5, o.stripe) },
        { p: tube([[118, 88, 20], [134, 102, 17]]), c: o.coat || o.shirt, m: 'cloth', line: 0.8, sub: o.coat ? [] : stripes(100, 150, 84, 112, 10, 4.5, o.stripe) },
        ...blade.guard,
      ],
    }));
  }
  sailor('crew_mate', { shirt: '#f2f0e8', stripe: '#2c4a9a', pants: '#3a5aa0', sash: '#b8322c', bandana: '#c8302a', hair: '#4a2e18', stubble: true });
  sailor('seaman', { shirt: '#f2f0e8', stripe: '#a82a2a', pants: '#4a3a30', sash: '#5a3a22', sashM: 'leather', coat: '#243458', cap: '#2a2e3a', hair: '#6a6660', beard: '#8a847c', moustache: true,
    earring: true, pipe: true, boots: '#2a1e16', bladeLen: 88, wide: 1.25, collar: '#243458', skin: '#c88a5a' });

  /* ================= Пират / корсар =================
     Треуголка, длиннополый кафтан, повязка на глазу. Пират стреляет из пистолета, в другой руке сабля;
     корсар целится из длинного мушкета двумя руками, на шляпе перо. */
  function pirate(name, o) {
    const SK = o.skin || TAN, SKD = tone(SK, -0.18), hx = H.headX, hy = H.headY, r = H.headR;
    const legs = (hip, foot, side) => {
      const c = side < 0 ? tone(o.pants, -0.2) : o.pants, b = side < 0 ? tone(o.boots, -0.15) : o.boots;
      const s = leg(hip, foot, { style: 'hose', c, boot: b, tw: 25 });
      // ботфорты с раструбом
      s.push({ p: [[foot[0] - 13, foot[1] - 40], [foot[0] + 11, foot[1] - 44], [foot[0] + 12, foot[1] - 34], [foot[0] + 8, foot[1] - 10], [foot[0] - 11, foot[1] - 10]], c: b, m: 'leather', line: 0.8,
        lines: [{ p: [[foot[0] - 11, foot[1] - 34], [foot[0] + 10, foot[1] - 37]], w: 1.2, a: 0.5 }] });
      return s;
    };
    const coatBack = { p: [[70, 84], [96, 82], [92, 150], [96, 214], [72, 220, 1], [58, 200], [60, 150]], c: tone(o.coat, -0.2), m: 'cloth', belly: 0.3 };
    const coat = [
      // полы кафтана
      { p: [[72, 138], [134, 138], [140, 176], [146, 212, 1], [126, 208], [118, 176], [104, 170], [92, 178], [82, 214, 1], [64, 210], [68, 176]], c: o.coat, m: 'cloth', belly: 0.3, id: 'skirt',
        lines: [{ p: [[88, 150], [80, 206]], w: 1.1, a: 0.4 }, { p: [[124, 150], [134, 204]], w: 1.1, a: 0.4 }],
        sub: [{ p: [[60, 200], [150, 196], [150, 222], [60, 222]], c: o.trim, m: 'gold', line: 0 }] },
      // жилет и рубаха
      { p: [[76, 82], [126, 80], [136, 94], [134, 122], [128, 148], [78, 148], [70, 122], [66, 96]], c: o.coat, m: 'cloth', id: 'chest' },
      { p: [[98, 82], [120, 82], [124, 110], [122, 146], [104, 146], [100, 110]], c: o.vest, m: 'cloth', line: 0.8, lines: [{ p: [[112, 88], [113, 144]], w: 1, a: 0.4 }],
        sub: [104, 116, 128, 140].map(y => ({ e: [112, y, 2.6, 2.6], c: GOLD, m: 'gold', line: 0 })) },
      { p: [[94, 80], [104, 94], [116, 80], [112, 92], [104, 102], [96, 92]], c: '#f0ece0', m: 'cloth', line: 0.7 },
      // отвороты с золотыми пуговицами
      { p: [[88, 82], [100, 84], [102, 146], [92, 146]], c: o.lapel, m: 'cloth', line: 0.7, sub: [96, 110, 124, 138].map(y => ({ e: [96, y, 2.4, 2.4], c: GOLD, m: 'gold', line: 0 })) },
      // кушак и перевязь
      { p: tube([[72, 140, 11], [104, 146, 11], [134, 140, 11]]), c: o.sash, m: 'cloth', line: 0.7 },
      { p: [[80, 146], [76, 176, 1], [86, 168], [90, 150]], c: tone(o.sash, -0.1), m: 'cloth', line: 0.7 },
      { p: tube([[80, 84, 7], [104, 116, 7], [128, 144, 7]]), c: '#4a2e1a', m: 'leather', line: 0.6, sub: [{ p: [P(98, 104, 1), P(110, 104, 1), P(110, 116, 1), P(98, 116, 1)], c: GOLD, m: 'gold', line: 0 }] },
      { p: tube([[hx - 4, 68, 17], [hx - 6, 86, 20]]), c: SK, m: 'skin' },
    ];
    const headS = [
      ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'long', beard: o.beard, beardLen: 1.7 }),
      { p: [[hx + r * 0.4, hy + r * 0.42], [hx + r * 1.08, hy + r * 0.38], [hx + r * 1.22, hy + r * 0.7, 1], [hx + r * 0.8, hy + r * 0.56], [hx + r * 0.3, hy + r * 0.66]], c: o.beard, m: 'fur', furLen: 0.5, flow: 0 },
      // повязка на глаз
      { p: tube([[hx - r * 0.8, hy - r * 0.5, 2.6], [hx + r * 0.1, hy - r * 0.34, 2.6], [hx + r * 0.9, hy - r * 0.1, 2.6]]), c: '#1a1414', m: 'leather', line: 0 },
      { p: ell(hx + r * 0.58, hy + r * 0.02, r * 0.26, r * 0.24, 10), c: '#1a1414', m: 'leather', line: 0.6 },
      ...tricorn(hx, hy, r, { c: o.hat, trim: o.hatTrim, plume: o.plume, skull: o.skull, cockade: o.cockade }),
      { p: tube([[hx - r * 0.42, hy + r * 0.34, 2.2], [hx - r * 0.3, hy + r * 0.62, 2.2], [hx - r * 0.52, hy + r * 0.62, 2.2], [hx - r * 0.44, hy + r * 0.36, 2.2]]), c: GOLD, m: 'gold', line: 0.4 },
    ];
    const cuff = (x, y, c) => ({ p: tube([[x - 5, y - 3, 19], [x + 3, y + 1, 19]], { flat0: true, flat1: true }), c: c || o.trim, m: 'cloth', line: 0.7 });
    let back, front;
    if (o.musket) {
      // мушкет у плеча: ближняя рука на ложе, дальняя поддерживает ствол
      const hand = [134, 104], dir = norm(1, -0.04);
      back = [coatBack, ...arm([82, 90], [118, 120], [172, 100], { c: tone(o.coat, -0.2), hand: SKD, w: 16 }), cuff(162, 104, tone(o.trim, -0.15))];
      front = [...flintlock(hand, dir, 100, { musket: true, wood: o.wood, metal: o.metal }),
        { p: tube([[120, 86, 21], [118, 110, 17]]), c: o.coat, m: 'cloth', line: 0.8, lines: [{ p: [[110, 84], [130, 86]], w: 2.4, c: o.trim, a: 1 }] },
        ...arm([118, 104], [118, 114], hand, { c: o.coat, hand: SK, w: 17 }), cuff(126, 112)];
    } else {
      // сабля в ножнах висит у бедра, из-под кафтана торчит конец ножен
      const sab = cutlass([88, 150], norm(0.28, -1), 20, {});
      back = [coatBack,
        { p: tube([[80, 156, 9], [62, 206, 8], [54, 226, 6]]), c: '#3a2416', m: 'leather', line: 0.7, sub: [{ p: tube([[64, 214, 10], [52, 232, 8]]), c: GOLD, m: 'gold', line: 0 }] },
        ...arm([80, 90], [70, 120], [86, 148], { c: tone(o.coat, -0.2), hand: SKD, w: 16 }), cuff(76, 136, tone(o.trim, -0.15)), ...sab.guard];
      const hand = [168, 104];
      front = [...flintlock(hand, norm(1, -0.12), 36, { wood: o.wood, metal: o.metal }),
        ...arm([126, 90], [148, 106], hand, { c: o.coat, hand: SK, w: 17 }), cuff(156, 106),
        { e: [126, 94, 15, 14], c: o.coat, m: 'cloth', lines: [{ p: [[114, 94], [138, 92]], w: 2.4, c: o.trim, a: 1 }] }];
    }
    V.def(name, humanoid({ name, size: o.size || 1, legs, back, body: coat, head: headS, arm: front }));
  }
  pirate('pirate', { coat: '#b0282a', lapel: '#8a1e20', vest: '#e8d8a8', trim: '#d8a53a', sash: '#2a2a3a', pants: '#e0d6bc', boots: '#2a1c14', hat: '#1e1a1c', hatTrim: '#d8a53a', skull: true,
    hair: '#1e1612', beard: '#1e1612' });
  pirate('corsair', { coat: '#1e2436', lapel: '#b0282a', vest: '#b0282a', trim: '#f0c848', sash: '#c02a2a', pants: '#3a3030', boots: '#1a120e', hat: '#141216', hatTrim: '#f0c848', plume: '#f4f0e6',
    cockade: '#c02a2a', hair: '#3a2a1c', beard: '#3a2a1c', musket: true, wood: '#5a3018', metal: '#8a8e96', skin: '#c88a5a' });

  /* ================= Морская ведьма / колдунья =================
     Длинная мантия с рваным «водорослевым» подолом, волосы-водоросли, посох из плавника с жемчужиной;
     свободной рукой держит водяной шар — им и стреляет. */
  function witch(name, o) {
    const SK = o.skin, SKD = tone(SK, -0.18), hx = H.headX, hy = H.headY, r = H.headR;
    const hem = [];
    for (let i = 0; i < 7; i++) { const x = 58 + i * 14; hem.push(P(x, 246, 1), [x + 7, 238]); }
    const robeS = { p: [[78, 80], [122, 80], [134, 100], [132, 150], [148, 238], P(154, 246, 1), ...hem.slice().reverse(), [62, 200], [68, 150], [68, 100]], c: o.robe, m: 'cloth', belly: 0.3, id: 'robe',
      lines: [{ p: [[104, 150], [112, 240]], w: 1.3, a: 0.5 }, { p: [[86, 160], [76, 240]], w: 1.1, a: 0.35 }, { p: [[122, 160], [136, 240]], w: 1.1, a: 0.35 }],
      sub: [{ p: [[40, 214], [170, 208], [170, 260], [40, 260]], c: o.hem, m: 'cloth', line: 0, lines: [{ p: [[60, 222], [150, 216]], w: 1, light: true, a: 0.4 }] }] };
    const hairS = { p: [[hx - r * 1.05, hy - r * 0.6], [hx + r * 0.2, hy - r * 1.2], [hx + r * 0.5, hy - r * 0.2], [hx - r * 0.1, hy + r * 1.0], [hx - r * 0.3, hy + r * 2.6], [hx - r * 0.9, hy + r * 3.3, 1], [hx - r * 1.2, hy + r * 2.4], [hx - r * 1.7, hy + r * 3.0, 1], [hx - r * 1.6, hy + r * 1.6], [hx - r * 1.4, hy + r * 0.4]],
      c: o.hair, m: 'fur', furLen: 1.5, flow: Math.PI * 0.55, id: 'hairLong', lines: [{ p: [[hx - r * 0.8, hy - r * 0.4], [hx - r * 1.0, hy + r * 1.4], [hx - r * 0.8, hy + r * 2.8]], w: 1.2, light: true, a: 0.4 }] };
    const hand = [150, 124], top = [160, 20], foot = [144, 244];
    const staff = [
      { p: rod(foot, top, 5.5, 5), c: o.shaft, m: o.shaftM || 'wood', flow: -Math.PI / 2, line: 0.8 },
      // навершие: развилка из коряги (или золотые зубцы) держит жемчужину
      { p: tube([[160, 34, 5], [150, 24, 4], [148, 12, 3]]), c: o.shaft, m: o.shaftM || 'wood', line: 0.7 },
      { p: tube([[160, 34, 5], [172, 22, 4], [170, 10, 3]]), c: o.shaft, m: o.shaftM || 'wood', line: 0.7 },
      { e: [160, 14, 10, 10], c: o.orb, m: 'gem', gloss: 1.3, line: 0.6, glint: [[156, 10, 3.5]] },
      ...(o.shells ? [{ p: [[150, 40], [158, 36], [162, 46], [152, 48]], c: '#f0d0c0', m: 'horn', line: 0.6 }] : []),
    ];
    const orbHand = [66, 110];
    V.def(name, humanoid({
      name, robe: true, feet: false, size: o.size || 1,
      before: o.cape ? [{ kind: 'torso', pivot: [H.cx, H.waistY], shapes: [{ p: [[72, 84], [100, 80], [96, 150], [86, 246, 1], [72, 238], [58, 246, 1], [48, 236], [56, 150]], c: o.cape, m: 'cloth', belly: 0.3, lines: [{ p: [[80, 100], [66, 236]], w: 1.1, a: 0.4 }] }] }] : [],
      back: [hairS,
        ...arm([80, 90], [60, 112], orbHand, { c: tone(o.robe, -0.18), hand: SKD, w: 15 }),
        { p: [P(56, 104, 1), [64, 96], [74, 112], P(72, 124, 1), [58, 120]], c: tone(o.robe, -0.18), m: 'cloth', line: 0.7 },
        { e: [orbHand[0] - 4, orbHand[1] - 16, 13, 13], c: o.magic, m: 'gem', gloss: 1.4, line: 0.6, lc: tone(o.magic, -0.5), glint: [[orbHand[0] - 9, orbHand[1] - 21, 4]],
          lines: [{ p: [[orbHand[0] - 12, orbHand[1] - 12], [orbHand[0] - 2, orbHand[1] - 20], [orbHand[0] + 6, orbHand[1] - 14]], w: 1.2, light: true, a: 0.7 }] }],
      body: [robeS,
        { p: [[98, 82], [110, 82], [118, 246, 1], [106, 246, 1]], c: o.trim, m: o.trimM || 'cloth', line: 0.7 },
        { p: tube([[72, 144, 9], [104, 148, 9], [132, 144, 9]]), c: o.belt, m: o.beltM || 'leather', line: 0.7 },
        ...[[86, 156], [122, 156]].map(([x, y]) => scallop(x, y, 8, o.shell || '#f0c8b0')),
        ...(o.necklace ? [0, 1, 2, 3, 4].map(i => pearl(90 + i * 6, 88 + Math.sin(i / 4 * Math.PI) * 8, 2.6)) : []),
        { p: tube([[hx - 4, 70, 15], [hx - 6, 86, 18]]), c: SK, m: 'skin' },
      ],
      head: [
        ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'short', eye: o.eye }),
        // пряди-водоросли спадают на лоб и вперёд
        { p: [[hx - r * 0.2, hy - r * 1.1], [hx + r * 0.9, hy - r * 0.8], [hx + r * 0.7, hy - r * 0.35], [hx + r * 0.2, hy - r * 0.55], [hx - r * 0.1, hy + r * 0.3], [hx - r * 0.3, hy - r * 0.4]], c: o.hair, m: 'fur', furLen: 0.8, flow: Math.PI * 0.3 },
        ...(o.crown ? [
          ...[-0.6, -0.2, 0.2, 0.6].map((t, i) => ({ p: [P(hx + r * (t - 0.18), hy - r * 0.95 + Math.abs(t) * r * 0.2, 1), P(hx + r * t, hy - r * (1.55 + (i % 2) * 0.3) + Math.abs(t) * r * 0.2, 1), P(hx + r * (t + 0.18), hy - r * 0.95 + Math.abs(t) * r * 0.2, 1)], c: o.crown, m: 'gold', line: 0.6 })),
          { p: tube([[hx - r * 0.85, hy - r * 0.8, 5], [hx, hy - r * 1.02, 5], [hx + r * 0.85, hy - r * 0.8, 5]]), c: o.crown, m: 'gold', line: 0.6 },
          pearl(hx - r * 0.1, hy - r * 1.02, 3.4)]
          : [{ p: [P(hx - r * 0.2, hy - r * 1.2), P(hx - r * 0.08, hy - r * 1.55, 1), P(hx + r * 0.12, hy - r * 1.2), P(hx + r * 0.35, hy - r * 1.4, 1), P(hx + r * 0.3, hy - r * 1.05)], c: '#e87a5a', m: 'horn', line: 0.6 },
            { p: [[hx - r * 0.6, hy - r * 0.95], [hx - r * 0.45, hy - r * 1.35, 1], [hx - r * 0.25, hy - r * 1.0]], c: '#e87a5a', m: 'horn', line: 0.6 }]),
      ],
      arm: [...staff,
        ...arm([126, 90], [144, 112], hand, { c: o.robe, hand: SK, w: 16 }),
        // широкий рукав свисает из-под предплечья, кисть на посохе открыта
        { p: [P(134, 104, 1), [144, 106], [146, 118], P(136, 142, 1), [130, 124]], c: o.robe, m: 'cloth', line: 0.7, lines: [{ p: [[140, 110], [136, 134]], w: 1, a: 0.4 }] }],
    }));
  }
  witch('sea_witch', { skin: '#a8d4c4', hair: '#1e5a52', robe: '#6a3a8a', hem: '#2e7a6a', trim: '#3aa08a', belt: '#4a3020', shaft: '#8a7458', orb: '#eef0f4', magic: '#6ad8e8', eye: '#101814', shells: true });
  witch('sorceress', { skin: '#c8dce8', hair: '#10304a', robe: '#2848a8', hem: '#e8c050', trim: '#f0c848', trimM: 'gold', belt: '#f0c848', beltM: 'gold', shaft: '#e0b040', shaftM: 'gold', orb: '#e090e8',
    magic: '#f0a0f8', eye: '#20103a', crown: '#f0c848', cape: '#162a6a', necklace: true });
  /* ================= Нимфа / океанида =================
     Дева по пояс выходит из закрученной волны; за спиной прозрачные плавники-крылышки.
     Летун: у летунов весь реквизит машет, поэтому руки — в корпусе, а крылья — prop. */
  function nymph(name, o) {
    const SK = o.skin, SKD = tone(SK, -0.16), W = o.water, WD = tone(W, -0.22), FOAM = '#f4fbfb', hx = H.headX + 2, hy = H.headY + 8, r = H.headR - 2;
    const foam = (x, y, rx, ry) => ({ e: [x, y, rx, ry], c: FOAM, m: 'cloth', line: 0.5, lc: tone(W, -0.3) });
    const water = (p, c, extra) => Object.assign({ p, c, m: 'gem', gloss: 0.9, rim: 0.7, line: 0.7, lc: tone(c, -0.45) }, extra || {});
    const waveS = [
      // гребень позади: волна поднимается за спиной и загибается вперёд, пена на кончике
      water(tube([[80, 236, 30], [58, 210, 24], [44, 176, 19], [46, 146, 14], [60, 128, 10], [76, 130, 7], [80, 142, 4]]), WD,
        { lines: [{ p: [[62, 218], [48, 180], [52, 146]], w: 1.4, light: true, a: 0.6 }] }),
      foam(64, 130, 7, 5), foam(76, 134, 5, 4), foam(52, 136, 5, 4),
      ...(o.twin ? [water(tube([[150, 236, 22], [168, 212, 17], [174, 186, 12], [166, 170, 7], [156, 174, 4]]), WD), foam(164, 170, 6, 4.5), foam(172, 178, 4, 3.5)] : []),
      // лужа-пена у земли
      { e: [104, 240, 64, 8], c: tone(W, -0.1), m: 'gem', gloss: 0.8, line: 0.6, lc: tone(W, -0.5) },
      // столб воды, на котором она стоит
      // закрученный водяной смерч: сужается к «коленям» и раскатывается по земле
      water([[58, 244], [76, 232], [88, 216], [92, 196], [86, 172], [82, 146], [128, 146], [124, 172], [118, 196], [122, 216], [138, 232], [164, 244]], W,
        { belly: 0.25, lines: [
          { p: [[86, 156], [104, 166], [126, 158]], w: 1.6, light: true, a: 0.75 }, { p: [[90, 178], [106, 188], [122, 180]], w: 1.4, light: true, a: 0.65 },
          { p: [[92, 200], [106, 208], [118, 202]], w: 1.3, light: true, a: 0.6 }, { p: [[80, 228], [104, 236], [134, 228]], w: 1.3, light: true, a: 0.55 },
          { p: [[96, 150], [110, 200], [100, 240]], w: 1.1, a: 0.3 }] }),
      { p: [[92, 150], [102, 150], [104, 190], [98, 226], [90, 238], [94, 200]], c: 'rgba(255,255,255,0.22)', m: 'flat', line: 0 },
      // малая волна спереди у земли
      water(tube([[136, 242, 18], [156, 232, 13], [166, 218, 8], [160, 208, 4]]), tone(W, 0.08)), foam(160, 210, 5, 4),
      // пенный край по низу и у пояса
      ...[70, 86, 102, 118, 134, 150].map((x, i) => foam(x, 242 - (i % 2) * 2, 9, 4.5)),
      ...[84, 94, 104, 114, 124].map((x, i) => foam(x, 150 + (i % 2) * 2, 7, 5)),
      // брызги
      ...[[40, 116, 3], [30, 150, 2.4], [176, 150, 2.4], [184, 196, 3]].map(([x, y, rr]) => ({ e: [x, y, rr, rr * 1.3], c: tone(W, 0.25), m: 'gem', gloss: 1.3, line: 0.5 })),
    ];
    const bodyS = [
      // волосы за спиной — длинные, струятся назад, пена на концах
      { p: [[hx - r * 1.0, hy - r * 0.7], [hx + r * 0.2, hy - r * 1.2], [hx + r * 0.3, hy - r * 0.2], [hx - r * 0.3, hy + r * 1.2], [hx - r * 1.2, hy + r * 3.0], [hx - r * 2.2, hy + r * 3.4, 1], [hx - r * 2.0, hy + r * 2.2], [hx - r * 2.8, hy + r * 1.8, 1], [hx - r * 2.0, hy + r * 0.8]],
        c: o.hair, m: 'fur', furLen: 1.4, flow: Math.PI * 0.8, lines: [{ p: [[hx - r * 0.6, hy - r * 0.3], [hx - r * 1.3, hy + r * 1.3], [hx - r * 2.0, hy + r * 2.9]], w: 1.2, light: true, a: 0.45 }] },
      foam(hx - r * 2.1, hy + r * 3.2, 5, 4), foam(hx - r * 2.7, hy + r * 1.8, 4.5, 3.5),
      // дальняя рука — ладонь у волн
      ...arm([84, 96], [68, 118], [60, 138], { c: SKD, m: 'skin', hand: SKD, w: 11 }),
      // тонкий стан
      { p: [[84, 90], [120, 88], [128, 100], [124, 124], [120, 150], [88, 152], [84, 124], [78, 100]], c: SK, m: 'skin', id: 'chest', lines: [{ p: [[106, 128], [106, 146]], w: 1, a: 0.3 }] },
      // лиф из ракушек и пояс из водорослей
      { p: [[86, 100], [104, 98], [122, 100], [124, 112], [104, 116], [84, 114]], c: o.top, m: 'horn', gloss: 0.7, line: 0.7, lines: [{ p: [[104, 99], [104, 115]], w: 1, a: 0.4 }] },
      ...[[94, 106], [114, 106]].map(([x, y]) => scallop(x, y + 1, 8, tone(o.top, 0.12))),
      { p: [[84, 138], [124, 136], [130, 150], [118, 164, 1], [110, 152], [100, 166, 1], [92, 152], [80, 162, 1], [80, 148]], c: o.weed, m: 'cloth', line: 0.7, lines: [{ p: [[100, 142], [100, 160]], w: 1, a: 0.4 }] },
      ...(o.pearls ? [0, 1, 2, 3, 4, 5].map(i => pearl(88 + i * 6.4, 96 + Math.sin(i / 5 * Math.PI) * 7, 2.4)) : []),
      { p: tube([[hx - 5, hy + 14, 12], [hx - 7, 92, 15]]), c: SK, m: 'skin' },
      // ближняя рука протянута вперёд, над ладонью — водяной шарик
      ...arm([118, 96], [138, 110], [158, 100], { c: SK, m: 'skin', hand: SK, w: 11 }),
      { e: [166, 84, 9, 9], c: tone(W, 0.2), m: 'gem', gloss: 1.4, line: 0.6, lc: tone(W, -0.4), glint: [[163, 80, 3]] },
    ];
    const headS = [
      ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'short', eye: o.eye, ear: false }),
      // плавник вместо уха
      { p: [[hx - r * 0.3, hy + r * 0.1], [hx - r * 0.9, hy - r * 0.3, 1], [hx - r * 0.8, hy + r * 0.1], [hx - r * 1.0, hy + r * 0.4, 1], [hx - r * 0.4, hy + r * 0.45]], c: tone(o.fin, 0.1), m: 'skin', gloss: 0.7, line: 0.6 },
      { p: [[hx - r * 0.3, hy - r * 1.05], [hx + r * 0.9, hy - r * 0.9], [hx + r * 0.9, hy - r * 0.4], [hx + r * 0.3, hy - r * 0.55], [hx + r * 0.1, hy + r * 0.2], [hx - r * 0.3, hy - r * 0.4]], c: o.hair, m: 'fur', furLen: 0.7, flow: Math.PI * 0.2 },
      ...(o.tiara ? [
        { p: tube([[hx - r * 0.8, hy - r * 0.78, 4.5], [hx, hy - r * 1.02, 4.5], [hx + r * 0.8, hy - r * 0.78, 4.5]]), c: o.tiara, m: 'gold', line: 0.5 },
        ...[-0.5, 0, 0.5].map(t => ({ p: [P(hx + r * (t - 0.16), hy - r * 0.94, 1), P(hx + r * t, hy - r * (t ? 1.4 : 1.65), 1), P(hx + r * (t + 0.16), hy - r * 0.94, 1)], c: o.tiara, m: 'gold', line: 0.5 })),
        pearl(hx, hy - r * 1.05, 3.2), pearl(hx - r * 0.5, hy - r * 0.92, 2.4), pearl(hx + r * 0.5, hy - r * 0.92, 2.4)]
        : [{ p: star5(hx - r * 0.25, hy - r * 0.95, 7), c: '#f08a6a', m: 'horn', line: 0.6 }]),
    ];
    const wingC = { mem: o.wing, vein: tone(o.wing, -0.55) };
    const parts = [
      { kind: 'prop', pivot: [90, 104], shapes: wing.insect([90, 104], [-0.25, -1], o.wingL || 70, wingC) },
      { kind: 'prop', pivot: [86, 108], shapes: wing.insect([86, 108], [-0.85, -0.7], (o.wingL || 70) * 1.1, wingC) },
      { kind: 'legs', pivot: [104, 200], shapes: waveS },
      { kind: 'torso', pivot: [104, 146], shapes: bodyS },
      { kind: 'head', pivot: [hx - 4, hy + 16], shapes: headS },
    ];
    V.def(name, place(name, parts, o.size || 1, 6));
  }
  /** Звёздочка-морская звезда (острые лучи чуть скруглены — без флага острого угла). */
  function star5(cx, cy, rr) {
    const out = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? rr * 0.45 : rr; out.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); }
    return out;
  }
  nymph('nymph', { skin: '#c8ece0', hair: '#1f8a78', water: '#3ab4bc', top: '#e8b8a8', weed: '#2e8a5a', fin: '#6ad0c0', wing: '#bff0e8', eye: '#0e3a3a' });
  nymph('oceanid', { skin: '#d6e6f6', hair: '#1c4a9a', water: '#2e78d0', top: '#f0e0ec', weed: '#1e5a8a', fin: '#7aa8f0', wing: '#d8e0ff', eye: '#10204a', twin: true, pearls: true, tiara: '#f0c848', wingL: 82 });

  /* ================= Буревестник / айссид =================
     Морская птица стоит на коротких перепончатых лапах, крылья вскинуты. Летун: крылья — prop.
     Рисуем прямо в рамке старого спрайта (земля y=220). */
  function seabird(name, o) {
    const G = 220;
    const WN = { pri: o.pri, pri2: tone(o.pri, 0.12), sec: o.sec, sec2: tone(o.sec, -0.08), cov: o.cov, cov2: o.cov2 };
    const WF = { pri: tone(o.pri, -0.25), pri2: tone(o.pri, -0.18), sec: tone(o.sec, -0.25), sec2: tone(o.sec, -0.3), cov: tone(o.cov, -0.25), cov2: tone(o.cov2, -0.25) };
    const webFoot = (x, c) => [
      { p: tube([[x - 6, 176, 13], [x - 3, 196, 8], [x, G - 6, 6.5]]), c, m: 'skin', gloss: 0.5, line: 0.7 },
      { p: [[x - 8, G - 7], [x + 6, G - 9], [x + 24, G - 4, 1], [x + 20, G - 1], [x + 14, G], [x + 8, G - 1], [x - 10, G, 1]], c, m: 'skin', gloss: 0.5, line: 0.7,
        lines: [{ p: [[x - 2, G - 6], [x + 20, G - 3]], w: 1, a: 0.4 }, { p: [[x - 2, G - 6], [x + 10, G - 1]], w: 1, a: 0.4 }] },
    ];
    const tail = [];
    if (o.streamers) for (const [a, L, c] of [[0.96, 120, o.crest], [1.04, 104, tone(o.crest, -0.12)]]) {
      const lf = leaf([112, 176], Math.PI * a, L, 12); tail.push({ p: lf.body, c, m: 'leather', gloss: 0.6, line: 0.6, lines: [{ p: lf.shaft, w: 0.9, light: true, a: 0.5 }] });
    }
    for (let i = 3; i >= 0; i--) { const lf = leaf([118, 172], Math.PI * (0.88 + i * 0.05), 62 - i * 5, 18); tail.push({ p: lf.body, c: i % 2 ? o.tail : tone(o.tail, 0.1), m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.9, light: true, a: 0.45 }] }); }
    const body = { p: [[100, 176], [124, 150], [164, 136], [206, 128], [236, 136], [248, 158], [242, 182], [222, 198], [190, 204], [156, 198], [124, 188]], c: o.back, m: 'feather', texSize: 0.6, flow: Math.PI * 0.85, belly: 0.35,
      sub: [{ p: [[190, 126], [260, 130], [262, 214], [150, 214], [168, 200, 1], [180, 190], [196, 172], [200, 150]], c: o.breast, m: 'feather', texSize: 0.5, flow: Math.PI * 0.5, line: 0, belly: 0.25 }] };
    const headS = [
      { p: [[214, 150], [218, 120], [232, 100], [252, 94], [266, 104], [264, 126], [252, 146], [236, 160]], c: o.breast, m: 'feather', texSize: 0.5, flow: Math.PI * 0.6 },
      ...(o.crest ? [0, 1, 2].map(i => { const lf = leaf([246 - i * 4, 84 + i * 4], Math.PI * (1.08 + i * 0.08), 46 - i * 8, 11); return { p: lf.body, c: i % 2 ? o.crest : tone(o.crest, 0.15), m: 'leather', gloss: 0.6, line: 0.6, lines: [{ p: lf.shaft, w: 0.8, light: true, a: 0.5 }] }; }) : []),
      { p: [[238, 100], [246, 80], [264, 72], [282, 78], [290, 94], [282, 108], [264, 112], [246, 110]], c: o.head, m: 'feather', texSize: 0.4, flow: Math.PI * 0.8 },
      // клюв с крючком и красным пятном, как у чайки
      { p: [[282, 96], [304, 98], [300, 104], [284, 104]], c: tone(o.beak, -0.2), m: 'horn' },
      { p: [[280, 86], [300, 88], [316, 92], [322, 100], [318, 108, 1], [314, 100], [300, 98], [282, 98]], c: o.beak, m: 'horn', gloss: 1.1, lines: [{ p: [[286, 90], [308, 93]], w: 1, light: true, a: 0.7 }, { p: [[296, 93], [300, 93]], w: 1.4, a: 0.7 }] },
      { e: [306, 101, 3, 2.4], c: '#d8302a', m: 'flat', line: 0 },
      { e: [274, 88, 4.2, 3.8], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [275, 88, 1.8, 2.6], c: DARK, m: 'flat', line: 0 }], glint: [[273, 86.8, 1.5]] },
      { p: [[262, 82], [278, 80], [286, 84, 1], [276, 84], [264, 86]], c: o.brow, m: 'flat', line: 0 },
    ];
    // всё, кроме лап, приподнято: лапы видны из-под брюха; голова крупнее
    const U = 10, up = list => K.mapShapes(list, (x, y) => [x, y - U], 1);
    const headBig = K.mapShapes(headS, (x, y) => [226 + (x - 226) * 1.18, 140 - U + (y - 140) * 1.18], 1.18);
    V.def(name, {
      w: 333, h: 223, anchor: [170, 220],
      parts: [
        { kind: 'prop', pivot: [206, 138 - U], shapes: up(wing.feather([206, 138], [-0.08, -1], 128, WF)) },
        { kind: 'leg', side: 1, pivot: [176, 186], shapes: webFoot(170, tone(o.leg, -0.2)) },
        { kind: 'leg', side: -1, pivot: [198, 188], shapes: webFoot(194, o.leg) },
        { kind: 'torso', pivot: [180, 170 - U], shapes: up([...tail, body]) },
        { kind: 'head', pivot: [228, 140 - U], shapes: headBig },
        { kind: 'prop', pivot: [186, 142 - U], shapes: up(wing.feather([186, 142], [-0.62, -0.78], 146, WN)) },
      ],
    });
  }
  seabird('stormbird', { pri: '#26282e', sec: '#6a7078', cov: '#9aa2ac', cov2: '#c4ccd4', back: '#b8c0c8', breast: '#f4f4f0', head: '#fafaf6', tail: '#e8e8e4', beak: '#f0c030', leg: '#e8905a', eye: '#f0d060', brow: '#8a9098' });
  seabird('ayssid', { pri: '#10205a', sec: '#1e4aa0', cov: '#2a7ac8', cov2: '#58b8e8', back: '#2a6ab8', breast: '#bfeaf8', head: '#6ac8f0', tail: '#1e4aa0', beak: '#f0c830', leg: '#f0b030', eye: '#fff06a', brow: '#10306a',
    crest: '#f0c830', streamers: true });
  /* ---------- плавники и чешуя ---------- */
  /**
   * Плавник-гребень: base — точки крепления (по порядку), out — вынос кончика для каждой точки.
   * Между лучами перепонка провисает выемкой; лучи — тёмные штрихи.
   */
  function fin(base, out, c, o) {
    o = o || {}; const n = base.length, pts = base.map(q => [q[0], q[1]]);
    const sag = o.sag === undefined ? 0.55 : o.sag;
    for (let i = n - 1; i >= 0; i--) {
      pts.push(P(base[i][0] + out[i][0], base[i][1] + out[i][1], 1));
      if (i > 0) pts.push([(base[i][0] + base[i - 1][0]) / 2 + (out[i][0] + out[i - 1][0]) / 2 * sag, (base[i][1] + base[i - 1][1]) / 2 + (out[i][1] + out[i - 1][1]) / 2 * sag]);
    }
    return { p: pts, c, m: o.m || 'skin', gloss: o.gloss === undefined ? 0.6 : o.gloss, rim: 0.7, line: 0.6, id: o.id,
      lines: base.map((q, i) => ({ p: [[q[0], q[1]], [q[0] + out[i][0] * 0.96, q[1] + out[i][1] * 0.96]], w: 1.1, c: o.ray || tone(c, -0.45), a: 0.8 })) };
  }
  /** Точки по ломаной с нормалью: along(path, t) → { x, y, nx, ny } (нормаль — влево по ходу). */
  function onPath(path, t) {
    const seg = [], n = path.length; let L = 0;
    for (let i = 1; i < n; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(l); L += l; }
    let d = t * L, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
    const a = path[i], b = path[i + 1], k = seg[i] ? d / seg[i] : 0, [tx, ty] = norm(b[0] - a[0], b[1] - a[1]);
    return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, w: a[2] + (b[2] - a[2]) * k, nx: ty, ny: -tx };
  }
  /** Чешуйчатая форма (кожа с фактурой чешуи). */
  const scaly = (p, c, extra) => Object.assign({ p, c, m: 'skin', tex: 'scale', texSize: 0.8, gloss: 0.45, belly: 0.3 }, extra || {});
  /** Брюшные щитки вдоль трубки: светлая полоса по стороне side (1 — правая по ходу) с поперечными швами. */
  function bellyPlates(path, c, side, k0, k1, wk) {
    const pts = [];
    for (let i = 0; i <= 12; i++) { const q = onPath(path, k0 + (k1 - k0) * i / 12), off = q.w * 0.28 * side; pts.push([q.x - q.nx * off, q.y - q.ny * off, q.w * (wk || 0.42)]); }
    const lines = [];
    for (let i = 1; i < 12; i++) { const q = pts[i], a = onPath(path, k0 + (k1 - k0) * i / 12); lines.push({ p: [[q[0] + a.nx * q[2] * 0.5, q[1] + a.ny * q[2] * 0.5], [q[0] - a.nx * q[2] * 0.5, q[1] - a.ny * q[2] * 0.5]], w: 1, a: 0.35 }); }
    return { p: tube(pts), c, m: 'horn', gloss: 0.4, line: 0, lines };
  }

  /* ================= Никса / никса-воин =================
     Рыболюд: торс воина в чешуйчатом доспехе на мощном рыбьем хвосте, на голове гребень-плавник.
     В дальней руке щит-раковина, в ближней — трезубец. */
  function nix(name, o) {
    const SK = o.skin, SKD = tone(SK, -0.2), hx = H.headX + 4, hy = H.headY + 4, r = H.headR + 1;
    const tailPath = [[104, 150, 48], [112, 180, 46], [116, 208, 40], [104, 232, 32], [76, 240, 26], [46, 236, 20], [24, 222, 14], [14, 204, 9]];
    const tailS = [
      // хвостовой плавник — две лопасти веером
      fin([[16, 206], [12, 200], [10, 194]], [[-30, 18], [-34, -6], [-22, -30]], o.fin, { sag: 0.35, id: 'caudal' }),
      scaly(tube(tailPath), o.tail, { id: 'tail' }),
      bellyPlates(tailPath, o.belly, 1, 0.08, 0.92),
      // брюшные плавнички
      fin([[118, 214], [112, 222]], [[20, 14], [14, 20]], tone(o.fin, 0.08), { sag: 0.3 }),
      fin([[60, 238], [48, 236]], [[-6, 14], [-12, 12]], tone(o.fin, -0.08), { sag: 0.3 }),
    ];
    const armour = o.armour;
    const shieldC = [110, 128], sr = 40;
    const shieldS = [
      { p: ell(shieldC[0] - 44, shieldC[1], sr, sr * 1.08, 14), c: o.shieldRim, m: o.shieldRimM || 'horn', gloss: 0.8, line: 0.8 },
      scallop(shieldC[0] - 44, shieldC[1] - 2, sr * 0.95, o.shield),
      ...(o.boss ? [{ e: [shieldC[0] - 44, shieldC[1] + 16, 8, 8], c: o.boss, m: 'gem', line: 0.6, glint: [[shieldC[0] - 47, shieldC[1] + 13, 3]] }] : []),
    ];
    const bodyS = [
      // дальняя рука под щитом
      ...arm([82, 90], [70, 116], [66, 132], { c: SKD, m: 'skin', hand: SKD, w: 17 }),
      // мускулистый торс
      scaly([[74, 82], [128, 80], [140, 96], [138, 124], [128, 156], [80, 158], [70, 124], [64, 96]], SK, { id: 'chest', texSize: 0.6 }),
      // чешуйчатый доспех: грудь и юбка
      { p: [[74, 88], [128, 86], [138, 100], [134, 130], [126, 150], [80, 152], [72, 128], [68, 100]], c: armour, m: o.armourM || 'steel', tex: 'scale', texSize: 0.7, gloss: 0.9, id: 'armour',
        lines: [{ p: [[106, 92], [108, 148]], w: 1.2, light: true, a: 0.4 }] },
      { p: [[74, 146], [130, 146], [136, 172, 1], [120, 166], [106, 176, 1], [92, 166], [72, 172, 1]], c: tone(armour, -0.1), m: o.armourM || 'steel', tex: 'scale', texSize: 0.6, id: 'skirt' },
      { p: tube([[72, 146, 10], [104, 150, 10], [134, 146, 10]]), c: o.belt, m: o.beltM || 'leather', line: 0.7, sub: [{ e: [104, 150, 6, 6], c: o.gem, m: 'gem', line: 0 }] },
      // наплечник-раковина
      ...(o.pauldron ? [{ p: [[62, 96], [70, 80], [90, 76], [98, 90], [86, 104]], c: o.pauldron, m: 'gold', line: 0.7, lines: [{ p: [[70, 84], [80, 96]], w: 1, a: 0.4 }, { p: [[80, 80], [88, 94]], w: 1, a: 0.4 }] }] : []),
      scaly(tube([[hx - 8, 72, 20], [hx - 8, 88, 24]]), SK),
      ...shieldS,
    ];
    const headS = [
      // гребень-плавник от лба к затылку
      fin([[hx + r * 0.4, hy - r * 0.8], [hx - r * 0.1, hy - r * 0.95], [hx - r * 0.6, hy - r * 0.8], [hx - r * 1.0, hy - r * 0.4], [hx - r * 1.1, hy + r * 0.1]],
        [[6, -18], [-2, -30], [-12, -30], [-22, -22], [-24, -10]], o.crest, { id: 'crest' }),
      // голова: широкий лоб, приплюснутая морда, большой рот
      scaly([[hx - r * 1.0, hy + r * 0.2], [hx - r * 0.9, hy - r * 0.6], [hx - r * 0.1, hy - r * 1.02], [hx + r * 0.75, hy - r * 0.7], [hx + r * 1.12, hy - r * 0.1], [hx + r * 1.3, hy + r * 0.35], [hx + r * 1.1, hy + r * 0.7], [hx + r * 0.4, hy + r * 1.0], [hx - r * 0.3, hy + r * 0.9], [hx - r * 0.8, hy + r * 0.65]], SK,
        { texSize: 0.5, id: 'face', lines: [{ p: [[hx + r * 0.3, hy + r * 0.55], [hx + r * 0.85, hy + r * 0.62], [hx + r * 1.22, hy + r * 0.45]], w: 1.6, c: '#1a2a28', a: 0.9 }] }),
      // широкий рот
      { p: [[hx + r * 0.3, hy + r * 0.5], [hx + r * 0.8, hy + r * 0.52], [hx + r * 1.24, hy + r * 0.42], [hx + r * 1.14, hy + r * 0.66], [hx + r * 0.7, hy + r * 0.72], [hx + r * 0.36, hy + r * 0.62]], c: '#3a1418', m: 'flat', line: 0.6, lc: '#1a0a0a' },
      // жабры-плавники на щеке
      fin([[hx - r * 0.2, hy + r * 0.2], [hx - r * 0.3, hy + r * 0.5], [hx - r * 0.35, hy + r * 0.8]], [[-14, -8], [-18, 2], [-14, 12]], tone(o.crest, -0.1), { sag: 0.4 }),
      // клыки
      { p: [P(hx + r * 0.8, hy + r * 0.6), P(hx + r * 0.86, hy + r * 0.9, 1), P(hx + r * 0.94, hy + r * 0.58)], c: '#f0ece0', m: 'horn', line: 0.5 },
      { p: [P(hx + r * 1.02, hy + r * 0.52), P(hx + r * 1.06, hy + r * 0.78, 1), P(hx + r * 1.12, hy + r * 0.5)], c: '#f0ece0', m: 'horn', line: 0.5 },
      // круглый рыбий глаз
      { e: [hx + r * 0.5, hy - r * 0.1, r * 0.3, r * 0.3], c: o.eye, m: 'gem', line: 0.7, sub: [{ e: [hx + r * 0.56, hy - r * 0.1, r * 0.13, r * 0.18], c: DARK, m: 'flat', line: 0 }], glint: [[hx + r * 0.42, hy - r * 0.2, r * 0.1]] },
      { p: [[hx + r * 0.2, hy - r * 0.4], [hx + r * 0.8, hy - r * 0.46], [hx + r * 0.84, hy - r * 0.34], [hx + r * 0.2, hy - r * 0.3]], c: tone(SK, -0.4), m: 'flat', line: 0 },
      ...(o.circlet ? [{ p: tube([[hx - r * 0.9, hy - r * 0.45, 6], [hx, hy - r * 0.9, 6], [hx + r * 0.8, hy - r * 0.62, 6]]), c: o.circlet, m: 'gold', line: 0.6, sub: [{ e: [hx + r * 0.1, hy - r * 0.86, 4, 4], c: o.gem, m: 'gem', line: 0 }] }] : []),
    ];
    const hand = [156, 132];
    const trident = weapon.polearm(hand, [0.08, -1], 128, { kind: 'trident', back: 96, head: o.prong, shaft: o.shaft });
    for (const s of trident.slice(1)) { s.m = o.prongM || 'steel'; }
    trident[0].m = o.shaftM || 'wood';
    const armS = [
      ...trident,
      ...arm([126, 90], [150, 116], hand, { c: SK, m: 'skin', hand: SK, w: 18 }),
      ...(o.bracer ? [{ p: tube([[150, 118, 18], [154, 126, 17]]), c: o.bracer, m: 'gold', line: 0.6 }] : []),
      o.pauldron ? { p: [[114, 100], [120, 86], [140, 84], [150, 98], [136, 112]], c: o.pauldron, m: 'gold', line: 0.7, lines: [{ p: [[122, 80], [130, 96]], w: 1, a: 0.4 }, { p: [[134, 78], [140, 94]], w: 1, a: 0.4 }] }
        : { p: [[114, 88], [128, 80], [142, 88], [140, 104], [120, 104]], c: armour, m: o.armourM || 'steel', tex: 'scale', texSize: 0.5, line: 0.7 },
    ];
    const parts = [
      { kind: 'legs', pivot: [104, 200], shapes: tailS },
      { kind: 'torso', pivot: [104, 150], shapes: bodyS },
      { kind: 'head', pivot: [hx - 6, 78], shapes: headS },
      { kind: 'prop', pivot: [126, 90], shapes: armS },
    ];
    V.def(name, place(name, parts, o.size || 1, 12));
  }
  nix('nix', { skin: '#5aa898', tail: '#3a8a7a', belly: '#d8e0b0', fin: '#7ad0c0', crest: '#3ab0a8', armour: '#a8b4bc', belt: '#5a3a22', gem: '#e04a3a', eye: '#f0e080',
    shield: '#efe2d0', shieldRim: '#c8a890', prong: '#c8d0d8', shaft: '#7a5a3a' });
  nix('nix_warrior', { skin: '#4a9a90', tail: '#2e7a70', belly: '#e8d890', fin: '#e85a3a', crest: '#d83a2a', armour: '#e0b040', armourM: 'gold', belt: '#8a1e1e', beltM: 'cloth', gem: '#38c8e8', eye: '#ffe060',
    shield: '#f4e8f0', shieldRim: '#e0b040', shieldRimM: 'gold', boss: '#38c8e8', prong: '#f0c848', prongM: 'gold', shaft: '#e0b040', shaftM: 'gold', pauldron: '#e8b840', bracer: '#e8b840', circlet: '#f0c848', size: 1.04 });

  /* ================= Морской змей / хаспид =================
     Кольца лежат на земле, шея поднимается S-образно, пасть раскрыта; по хребту — гребень-плавник.
     Рисуем прямо в рамке старого спрайта (земля y=310). */
  function serpent(name, o) {
    const G = 310, SC = o.scale, SCD = tone(SC, -0.22);
    const backCoil = [[240, 262, 40], [200, 248, 44], [150, 250, 46], [104, 262, 46], [80, 282, 44]];
    const tailPath = [[112, 292, 40], [70, 294, 30], [36, 284, 22], [16, 264, 15], [14, 240, 10], [26, 226, 6]];
    const neck = [[196, 282, 58], [170, 244, 54], [160, 204, 50], [174, 164, 46], [206, 130, 42], [238, 108, 38], [262, 96, 34]];
    const front = [[60, 290, 50], [120, 298, 56], [190, 298, 58], [244, 288, 52], [270, 268, 44], [264, 246, 36], [246, 240, 28]];
    const dorsal = [];
    for (let i = 0; i <= 8; i++) { const q = onPath(neck, 0.1 + i * 0.1); dorsal.push({ b: [q.x + q.nx * q.w * 0.45, q.y + q.ny * q.w * 0.45], o: [q.nx * (26 - i * 1.2) - 6, q.ny * (26 - i * 1.2) - 4] }); }
    const legsBack = [
      scaly(tube(tailPath), SCD, { id: 'tail' }),
      ...(o.tailSpike ? [{ p: [P(18, 234, 1), P(22, 200, 1), P(34, 226, 1)], c: o.horn, m: 'horn', gloss: 1, line: 0.6 }, { p: [P(12, 250, 1), P(-8, 236, 1), P(14, 238, 1)], c: o.horn, m: 'horn', line: 0.6 }]
        : [fin([[20, 232], [16, 244], [14, 256]], [[-4, -26], [-20, -14], [-24, 0]], tone(o.fin, -0.1), { sag: 0.35 })]),
      scaly(tube(backCoil), SCD),
      fin(backCoil.slice(1, 4).map(q => [q[0], q[1] - q[2] * 0.42]), [[-6, -18], [-6, -20], [-10, -18]], tone(o.fin, -0.2), { sag: 0.4 }),
    ];
    const neckS = [
      fin(dorsal.map(d => d.b), dorsal.map(d => d.o), o.fin, { id: 'dorsal' }),
      scaly(tube(neck), SC, { id: 'neck' }),
      bellyPlates(neck, o.belly, 1, 0.04, 0.98, 0.5),
    ];
    const frontS = [
      scaly(tube(front), SC, { id: 'coil', lines: [{ p: [[80, 282], [150, 288], [230, 280]], w: 1.4, light: true, a: 0.35 }] }),
      bellyPlates(front, o.belly, 1, 0.02, 0.7, 0.36),
    ];
    // голова: вытянутый череп, раскрытая пасть с клыками
    const hx = 272, hy = 86;
    const Q = (x, y, f) => P(hx + x, hy + y, f);
    const headS = [
      // уши-плавники на затылке
      fin([Q(-18, -8), Q(-22, 0), Q(-24, 8)], [[-22, -20], [-30, -6], [-26, 10]], o.fin, { sag: 0.4 }),
      ...(o.horns ? [{ p: tube([[hx - 8, hy - 16, 11], [hx - 26, hy - 34, 8], [hx - 50, hy - 40, 5], [hx - 66, hy - 34, 2]]), c: o.horn, m: 'horn', gloss: 1, line: 0.7,
        lines: [{ p: [[hx - 18, hy - 30], [hx - 14, hy - 22]], w: 1, a: 0.5 }, { p: [[hx - 32, hy - 40], [hx - 30, hy - 30]], w: 1, a: 0.5 }] }] : []),
      // нижняя челюсть — откинута вниз
      scaly([Q(-14, 10), Q(10, 18), Q(40, 30), Q(58, 40), Q(56, 46, 1), Q(30, 42), Q(4, 34), Q(-12, 26)], tone(SC, -0.1), { texSize: 0.5 }),
      { p: [Q(4, 18), Q(40, 30), Q(54, 38), Q(30, 34), Q(6, 28)], c: '#8a2a3a', m: 'skin', line: 0 },
      ...[14, 26, 38, 48].map(x => ({ p: [Q(x - 3, 25 + x * 0.26), Q(x, 16 + x * 0.26, 1), Q(x + 3, 25 + x * 0.26)], c: '#f4f0e0', m: 'horn', line: 0.5 })),
      // верхняя челюсть и череп
      scaly([Q(-24, 4), Q(-20, -14), Q(-2, -24), Q(24, -22), Q(46, -12), Q(66, -4), Q(74, 4, 1), Q(62, 12), Q(36, 12), Q(10, 16), Q(-10, 20)], SC,
        { texSize: 0.5, id: 'skull', lines: [{ p: [Q(64, -2), Q(68, 0)], w: 2, a: 0.8 }] }),
      ...[18, 32, 46, 60].map(x => ({ p: [Q(x - 3, 11 - x * 0.02), Q(x + 1, 22, 1), Q(x + 3, 10 - x * 0.02)], c: '#f4f0e0', m: 'horn', line: 0.5 })),
      // надбровье и глаз
      { p: [Q(4, -16), Q(28, -20), Q(34, -12), Q(10, -8)], c: tone(SC, -0.3), m: 'skin', line: 0.6 },
      { e: [hx + 20, hy - 8, 6, 4.6], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [hx + 21, hy - 8, 1.8, 4], c: DARK, m: 'flat', line: 0 }], glint: [[hx + 18, hy - 10, 1.8]] },
      ...(o.crown ? [0, 1, 2].map(i => ({ p: [Q(-4 + i * 12, -20 + i * 1.5, 1), Q(-2 + i * 12, -38 + i * 3, 1), Q(4 + i * 12, -20 + i * 1.5, 1)], c: o.horn, m: 'horn', gloss: 1, line: 0.5 })) : []),
    ];
    V.def(name, {
      w: 330, h: 313, anchor: [167, G],
      parts: [
        { kind: 'legs', pivot: [160, 280], shapes: legsBack },
        { kind: 'torso', pivot: [190, 250], shapes: neckS },
        { kind: 'legs', pivot: [160, 290], shapes: frontS },
        { kind: 'head', pivot: [252, 102], shapes: K.mapShapes(headS, (x, y) => [252 + (x - 256) * 1.24, 100 + (y - 94) * 1.24], 1.24) },
      ],
    });
  }
  serpent('sea_serpent', { scale: '#2e9a8a', belly: '#dce8b8', fin: '#5ac8c0', eye: '#f0d040' });
  serpent('haspid', { scale: '#a82a2a', belly: '#e8c070', fin: '#3a1a2a', eye: '#ffe040', horn: '#f0c848', horns: true, crown: true, tailSpike: true });
})(typeof window !== 'undefined' ? window : globalThis);
