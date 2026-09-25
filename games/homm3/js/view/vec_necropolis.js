/* ============================================================================
   view/vec_necropolis.js — Некрополис на рисованном конвейере.
   Гамма фракции: кость, тёмно-зелёное свечение, фиолет и чёрное железо.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок с другой гаммой и деталью.

   Приём для призраков: у материала flat заливка берётся как есть, поэтому цвет 'rgba(…)'
   даёт полупрозрачную форму (дымка, свечение, призрачная плоть). Контур у таких форм
   выключен, штрихи — только с явным цветом (tone() не понимает rgba).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, lerp, norm, weapon, shield, helm, head, arm, leg, torso, robe, humanoid, horse, mounted, fit, frameOf, mapShapes, tone, H } = K;

  const BONE = '#e8e0c8', BONE_D = '#bdb29a', VOID = '#2a2230';

  /* ---------- общие помощники ---------- */
  /** Кость: трубка с утолщёнными суставами на концах. */
  function bone(a, b, w, c, o) {
    o = o || {};
    const m1 = lerp(a, b, 0.22), m2 = lerp(a, b, 0.78);
    return { p: tube([[a[0], a[1], w * 1.35], [m1[0], m1[1], w * 0.8], [m2[0], m2[1], w * 0.8], [b[0], b[1], w * 1.3]]), c: c || BONE, m: 'horn', gloss: 0.35, line: o.line || 0.8, id: o.id,
      lines: o.split ? [{ p: [lerp(a, b, 0.2), lerp(a, b, 0.8)], w: 0.9, a: 0.5 }] : undefined };
  }
  /** Свечение: несколько полупрозрачных овалов — тёплое ядро и мягкий ореол. rgb — 'r,g,b'. */
  function glow(cx, cy, r, rgb, a) {
    a = a === undefined ? 1 : a;
    return [
      { e: [cx, cy, r, r], c: 'rgba(' + rgb + ',' + (0.14 * a).toFixed(3) + ')', m: 'flat', line: 0 },
      { e: [cx, cy, r * 0.66, r * 0.66], c: 'rgba(' + rgb + ',' + (0.2 * a).toFixed(3) + ')', m: 'flat', line: 0 },
      { e: [cx, cy, r * 0.38, r * 0.38], c: 'rgba(' + rgb + ',' + (0.32 * a).toFixed(3) + ')', m: 'flat', line: 0 },
    ];
  }
  /** Горящий глаз: светящаяся точка с ореолом. */
  const eye = (x, y, r, c, rgb) => [...glow(x, y, r * 2.6, rgb, 0.9), { e: [x, y, r, r * 0.9], c, m: 'gem', line: 0, glint: [[x - r * 0.3, y - r * 0.3, r * 0.6]] }];
  /**
   * Череп в три четверти, лицом вправо (cx, cy, r — как у head()).
   * o: { c, eyeC, eyeRgb, jaw: смещение челюсти вниз, horns }
   */
  function skull(cx, cy, r, o) {
    o = o || {}; const c = o.c || BONE, k = r / 22, X = x => cx + x * k, Y = y => cy + y * k, Q = (x, y, f) => P(X(x), Y(y), f);
    const jaw = o.jaw || 0;
    const out = [
      // нижняя челюсть: уже черепа, чуть отвисла
      { p: [Q(0, 15), Q(12, 17 + jaw), Q(24, 18 + jaw), Q(23, 24 + jaw), Q(14, 27 + jaw, 1), Q(4, 25 + jaw), Q(-3, 19)], c: tone(c, -0.14), m: 'horn', gloss: 0.3, id: 'jaw',
        lines: [{ p: [[X(12), Y(18.5 + jaw)], [X(22), Y(19.5 + jaw)]], w: 0.9, a: 0.6 }, { p: [[X(15), Y(18 + jaw)], [X(15), Y(21 + jaw)]], w: 0.8, a: 0.55 }, { p: [[X(19), Y(18 + jaw)], [X(19), Y(21 + jaw)]], w: 0.8, a: 0.55 }] },
      // свод черепа, надбровье, верхняя челюсть
      { p: [Q(-19, 6), Q(-21, -8), Q(-13, -20), Q(3, -24), Q(18, -19), Q(25, -8), Q(27, 2), Q(25, 9), Q(26, 16, 1), Q(21, 18), Q(10, 17), Q(2, 14), Q(-6, 15), Q(-13, 12)], c, m: 'horn', gloss: 0.55, id: 'skull',
        lines: [{ p: [[X(-9), Y(-2)], [X(-2), Y(6)], [X(4), Y(12)]], w: 1, a: 0.35 }, { p: [[X(-3), Y(12)], [X(4), Y(10)]], w: 1, a: 0.4 }],
        sub: [
          // глазницы: ближняя крупная и круглая, дальняя уходит за переносицу
          { p: [Q(5, -5), Q(11, -9), Q(18, -6), Q(19, 2), Q(14, 6), Q(7, 5), Q(4, 0)], c: VOID, m: 'flat', line: 0 },
          { p: [Q(22, -6), Q(26, -6), Q(27, 2), Q(23, 3)], c: VOID, m: 'flat', line: 0 },
          // носовая впадина
          { p: [Q(21, 6), Q(24.5, 6), Q(24, 11, 1), Q(22, 11, 1), Q(20, 9)], c: VOID, m: 'flat', line: 0 },
          // верхний ряд зубов
          { p: [Q(9, 14), Q(25, 14), Q(25, 19), Q(9, 19)], c: tone(c, 0.2), m: 'flat', line: 0,
            lines: [12, 15.5, 19, 22.5].map(x => ({ p: [[X(x), Y(14.5)], [X(x), Y(18.5)]], w: 0.8, c: tone(c, -0.5) })) },
        ] },
    ];
    if (o.eyeC) out.push(...eye(X(11), Y(-0.5), 2.6 * k, o.eyeC, o.eyeRgb), ...eye(X(24), Y(-0.8), 1.6 * k, o.eyeC, o.eyeRgb));
    return out;
  }
  /** Рваный край: зубцы между точками a и b, глубина dep (вниз по нормали), n зубцов. */
  function tatters(a, b, dep, n, seed) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, q = lerp(a, b, t), j = ((seed || 1) * (i + 3) * 7919) % 13 / 13;
      out.push(P(q[0], q[1] - 2, 1));
      if (i < n) { const m = lerp(a, b, t + 0.5 / n); out.push(P(m[0] + (j - 0.5) * 4, m[1] + dep * (0.55 + j * 0.6), 1)); }
    }
    return out;
  }
  /** Добавить формы в часть готового описания: формы в каноне from (ground, k — как у fit). */
  function addShapes(d, part, shapes, ground, kf, back) {
    const [gx, gy] = ground, [ax, ay] = d.anchor;
    const f = (x, y) => [ax + (x - gx) * kf, ay + (y - gy) * kf];
    const m = mapShapes(shapes, f, kf);
    d.parts[part].shapes = back ? m.concat(d.parts[part].shapes) : d.parts[part].shapes.concat(m);
  }

  /* ======================= скелет / скелет-воин ======================= */
  function skelLeg(hip, foot, side, o) {
    const c = side < 0 ? o.boneD : o.bone;
    const knee = [(hip[0] + foot[0]) / 2 + 4, (hip[1] + foot[1]) / 2 - 2], ank = [foot[0] - 2, foot[1] - 10];
    return [
      bone([hip[0], hip[1] - 2], knee, 8.5, c),
      bone(knee, ank, 7.5, c, { split: true }),
      { e: [knee[0] + 2, knee[1], 5.5, 5], c, m: 'horn', line: 0.7 },
      // стопа: пяточная кость и пальцы-фаланги
      { p: [[ank[0] - 6, ank[1] - 1], [ank[0] + 5, ank[1] - 2], [ank[0] + 7, foot[1] - 3], P(ank[0] - 8, foot[1], 1)], c, m: 'horn', line: 0.8 },
      { p: tube([[ank[0] + 3, foot[1] - 4, 4.5], [foot[0] + 8, foot[1] - 3, 3.8], [foot[0] + 16, foot[1] - 1, 3]]), c, m: 'horn', line: 0.7 },
      { p: tube([[ank[0] + 1, foot[1] - 2, 4], [foot[0] + 6, foot[1] - 1.5, 3.4], [foot[0] + 11, foot[1] - 1, 2.8]]), c: tone(c, -0.1), m: 'horn', line: 0.7 },
    ];
  }
  /** Грудная клетка скелета в каноне гуманоида: тень внутри, позвоночник, рёбра, ключица, таз. */
  function ribcage(c, o) {
    o = o || {}; const out = [];
    out.push({ p: [[84, 88], [120, 86], [131, 100], [130, 122], [118, 138], [92, 140], [81, 122]], c: VOID, m: 'cloth', line: 0.6, ao: 0.6 });
    // поясничный отдел позвоночника
    for (let i = 0; i < 3; i++) out.push({ e: [99, 144 + i * 8, 6, 4.2], c, m: 'horn', line: 0.7 });
    // таз
    out.push({ p: [[80, 160], [92, 154], [110, 154], [124, 160], [118, 172], [106, 176], [96, 176], [84, 172]], c, m: 'horn', gloss: 0.3, line: 0.8,
      lines: [{ p: [[90, 164], [100, 170], [112, 164]], w: 1, a: 0.5 }] });
    // рёбра: дуги от позвоночника вперёд к грудине
    for (let i = 0; i < 5; i++) {
      const y = 94 + i * 9, sp = 1 - i * 0.08;
      out.push({ p: tube([[88, y - 1, 5], [102, y - 4, 5.4], [118, y - 1, 5], [126 * sp + 128 * (1 - sp), y + 5, 4]]), c: i % 2 ? tone(c, -0.05) : c, m: 'horn', gloss: 0.3, line: 0.7 });
    }
    out.push({ p: tube([[119, 90, 6], [121, 108, 6], [118, 124, 4.5]]), c, m: 'horn', line: 0.7 });   // грудина
    out.push({ p: tube([[92, 91, 7], [96, 110, 6], [98, 136, 6]]), c: tone(c, -0.08), m: 'horn', line: 0.7, lines: [{ p: [[92, 100], [100, 100]], w: 0.9, a: 0.5 }, { p: [[94, 118], [100, 118]], w: 0.9, a: 0.5 }] });   // хребет
    out.push({ p: tube([[80, 86, 6], [104, 82, 5], [126, 85, 6]]), c, m: 'horn', line: 0.7 });   // ключицы
    out.push({ p: tube([[H.headX - 5, 70, 8], [H.headX - 7, 86, 9]]), c: tone(c, -0.1), m: 'horn', line: 0.7, lines: [{ p: [[H.headX - 10, 76], [H.headX - 3, 76]], w: 0.9, a: 0.6 }, { p: [[H.headX - 11, 81], [H.headX - 3, 81]], w: 0.9, a: 0.6 }] });   // шея
    return out;
  }
  /** Костлявая рука: плечо → локоть → кисть, кисть — костяшки. */
  function boneArm(sh, el, hand, c, o) {
    o = o || {};
    return [bone(sh, el, 7.5, c), bone(el, hand, 6.5, c, { split: true }),
      { p: [[hand[0] - 5, hand[1] - 5], [hand[0] + 5, hand[1] - 6], [hand[0] + 8, hand[1] + 1], [hand[0] + 4, hand[1] + 7], [hand[0] - 5, hand[1] + 5]], c, m: 'horn', line: 0.8,
        lines: [{ p: [[hand[0] - 1, hand[1] - 5], [hand[0] + 1, hand[1] + 5]], w: 0.9, a: 0.6 }, { p: [[hand[0] + 3, hand[1] - 5], [hand[0] + 5, hand[1] + 5]], w: 0.9, a: 0.6 }] }];
  }
  function skeleton(name, o) {
    const hand = [150, 128], rag = o.rag;
    const shieldS = o.warrior
      ? [...shield.round(62, 118, 27, { rim: '#2e3038', field: '#4a4e58', fieldM: 'steel', bossC: '#8a8f98' }),
        ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return { e: [62 + Math.cos(a) * 23, 118 + Math.sin(a) * 23, 2.2, 2.2], c: '#c8ced6', m: 'steel', line: 0.4 }; }),
        { p: [P(62, 104, 1), P(66, 92, 1), P(70, 104, 1)], c: '#c8ced6', m: 'steel', line: 0.5 }]
      : [...shield.round(62, 118, 26, { rim: '#6a6a70', field: '#6a4a2c', bossC: '#8a7a6a' }),
        { p: [[48, 102], [60, 112], [56, 128]], c: '#3a2a1a', m: 'flat', line: 0, open: true }];
    const rags = [{ p: [[82, 150], [120, 150], [124, 164], ...tatters([124, 176], [80, 176], 14, 5, 3).slice(1), [78, 164]], c: rag, m: 'cloth', belly: 0.3, line: 0.8,
      lines: [{ p: [[96, 154], [92, 184]], w: 1, a: 0.4 }, { p: [[110, 154], [114, 184]], w: 1, a: 0.4 }] },
      { p: tube([[78, 152, 5], [102, 150, 5], [126, 153, 5]]), c: o.belt, m: 'leather', line: 0.7 }];
    V.def(name, humanoid({
      name, size: 0.98,
      legs: (hip, foot, side) => skelLeg(hip, foot, side, o),
      back: [...(o.cape ? [{ p: [[80, 82], [98, 82], [96, 130], ...tatters([96, 178], [60, 186], 14, 4, 5).slice(1), [60, 140]], c: o.cape, m: 'cloth', belly: 0.35, lines: [{ p: [[84, 96], [76, 170]], w: 1.1, a: 0.45 }] }] : []),
        ...boneArm([82, 90], [70, 114], [74, 134], o.boneD), ...shieldS],
      body: [...ribcage(o.bone), ...rags],
      head: [...skull(H.headX + 2, H.headY, H.headR - 1, { c: o.bone, eyeC: o.eyeC, eyeRgb: o.eyeRgb }), ...(o.helm ? o.helm : [])],
      arm: [...weapon.sword(hand, [0.18, -1], o.blade ? 92 : 80, { blade: o.blade || '#b0764a', guard: o.guard, grip: '#3a2a1a', w: o.blade ? 5.2 : 4.8 }), ...boneArm([124, 90], [140, 116], hand, o.bone)],
    }));
  }
  skeleton('skeleton', { bone: BONE, boneD: BONE_D, rag: '#4e4058', belt: '#5a4632', guard: '#7a6a58', eyeC: '#b8f070', eyeRgb: '160,240,110' });
  skeleton('skeleton_warrior', { bone: '#ece6d4', boneD: '#c2b8a2', rag: '#7a1e22', belt: '#2e2a30', guard: '#8a8f98', blade: '#d6dde6', eyeC: '#ff5a3a', eyeRgb: '255,70,40', warrior: true,
    cape: '#5a161a',
    helm: [
      // рогатый шлем из чёрного железа
      { p: [[H.headX - 22, H.headY - 2], [H.headX - 18, H.headY - 20], [H.headX, H.headY - 28], [H.headX + 20, H.headY - 22], [H.headX + 28, H.headY - 8], P(H.headX + 26, H.headY - 2, 1), [H.headX + 4, H.headY - 8], P(H.headX - 20, H.headY + 6, 1)], c: '#4a4e58', m: 'steel',
        lines: [{ p: [[H.headX - 14, H.headY - 18], [H.headX + 2, H.headY - 26], [H.headX + 18, H.headY - 20]], w: 1.2, light: true, a: 0.7 }, { p: [[H.headX - 18, H.headY - 4], [H.headX + 24, H.headY - 5]], w: 1.4, a: 0.6 }] },
      { p: [P(H.headX + 12, H.headY - 10, 1), P(H.headX + 16, H.headY - 10, 1), P(H.headX + 17, H.headY + 6, 1), P(H.headX + 13, H.headY + 6, 1)], c: '#5a5e68', m: 'steel', line: 0.6 },   // наносник
      { p: tube([[H.headX - 12, H.headY - 20, 7], [H.headX - 22, H.headY - 34, 5], [H.headX - 18, H.headY - 46, 2]]), c: '#d8ceb4', m: 'horn', line: 0.7 },
      { p: tube([[H.headX + 8, H.headY - 24, 7], [H.headX + 8, H.headY - 40, 5], [H.headX + 16, H.headY - 50, 2]]), c: '#e8dec4', m: 'horn', line: 0.7 },
    ] });

  /* ======================= ходячий мертвец / зомби ======================= */
  function zombie(name, o) {
    const SK = o.skin, SKD = tone(o.skin, -0.2);
    const hx = 124, hy = 68, hr = 22;   // голова вынесена вперёд и опущена — горб
    const legs = (hip, foot, side) => {
      const c = side < 0 ? tone(o.pants, -0.2) : o.pants, sk = side < 0 ? SKD : SK;
      const out = leg(hip, [foot[0] + (side < 0 ? -4 : 6), foot[1]], { style: 'hose', c, shinC: sk, boot: sk, tw: 23, bend: 6 });
      const knee = [(hip[0] + foot[0]) / 2 + 6, (hip[1] + foot[1]) / 2];
      // рваная штанина чуть ниже колена
      out.splice(2, 0, { p: [[knee[0] - 12, knee[1] - 12], [knee[0] + 12, knee[1] - 12], ...tatters([knee[0] + 12, knee[1] + 8], [knee[0] - 12, knee[1] + 8], 7, 3, side + 3).slice(1)], c, m: 'cloth', line: 0.8 });
      return out;
    };
    const hand = (x, y, c) => [
      { e: [x, y, 7.5, 6.5], c, m: 'skin', line: 0.8 },
      ...[0, 1, 2].map(i => ({ p: tube([[x + 3, y - 3 + i * 3.5, 3.4], [x + 11, y - 1 + i * 4, 3], [x + 15, y + 4 + i * 4, 2.4]]), c, m: 'skin', line: 0.7 })),
    ];
    // рука вперёд: короткий рваный рукав, голое предплечье
    const zarm = (sh, el, hd, c, sleeve, far) => [
      { p: tube([[sh[0], sh[1], 17], [el[0], el[1], 13]]), c, m: 'skin', line: 0.9 },
      { p: tube([[el[0], el[1], 12.5], [hd[0], hd[1], 10]]), c, m: 'skin', line: 0.9, lines: o.bones && !far ? [{ p: [lerp(el, hd, 0.25), lerp(el, hd, 0.7)], w: 3, c: '#e8e0c8', a: 1 }] : [] },
      { p: [[sh[0] - 11, sh[1] - 9], [sh[0] + 8, sh[1] - 10], [lerp(sh, el, 0.6)[0] + 6, lerp(sh, el, 0.6)[1] - 8], ...tatters([lerp(sh, el, 0.7)[0] + 2, lerp(sh, el, 0.7)[1] + 9], [sh[0] - 8, sh[1] + 12], 6, 3, 2).slice(1)], c: sleeve, m: 'cloth', line: 0.8 },
      ...hand(hd[0], hd[1], c),
      ...(o.chain && !far ? [{ p: tube([[lerp(el, hd, 0.72)[0], lerp(el, hd, 0.72)[1] - 7, 4], [lerp(el, hd, 0.76)[0], lerp(el, hd, 0.76)[1] + 7, 4]]), c: '#6a6460', m: 'steel', line: 0.6 },
        ...[0, 1, 2].map(i => ({ e: [lerp(el, hd, 0.74)[0] - 4 - i * 5, lerp(el, hd, 0.74)[1] + 10 + i * 6, 3.4, 2.6], c: '#7a746e', m: 'steel', line: 0.6 }))] : []),
    ];
    const body = [
      { p: tube([[hx - 16, hy + 10, 16], [hx - 24, hy + 24, 19]]), c: SK, m: 'skin', line: 0.9 },   // шея
      { p: [[72, 96], [114, 82], [138, 92], [142, 118], [132, 146], [80, 150], [68, 126]], c: SK, m: 'skin', line: 0.9 },
      // рубаха в лохмотьях
      { p: [[66, 100], [80, 88], [112, 80], [136, 90], [140, 118], [134, 144], ...tatters([136, 160], [80, 160], 11, 5, o.seed || 2).slice(1), [72, 136]], c: o.shirt, m: 'cloth', belly: 0.35, line: 0.9,
        lines: [{ p: [[96, 100], [92, 160]], w: 1.1, a: 0.45 }, { p: [[122, 96], [128, 150]], w: 1, a: 0.35 }],
        sub: o.bones ? [{ p: [[102, 112], [128, 106], [132, 130], [108, 138]], c: '#3a2a2a', m: 'flat', line: 0 },
          ...[0, 1, 2].map(i => ({ p: tube([[104, 118 + i * 7, 3.5], [118, 114 + i * 7, 3.5], [130, 118 + i * 7, 3]]), c: '#e0d8bc', m: 'horn', line: 0.5 }))] : [{ p: [[106, 118], [118, 114], [120, 126], [110, 128]], c: SKD, m: 'skin', line: 0.5 }] },
      { p: tube([[72, 150, 6], [104, 152, 6], [140, 148, 6]]), c: o.rope, m: 'leather', line: 0.6 },
    ];
    const headS = [...head(hx, hy, hr, { skin: SK, hair: o.hair, hairStyle: 'short', eye: o.eye, browC: '#2a2420' }),
      // впалая глазница и провал рта
      { e: [hx + hr * 0.56, hy + 1, hr * 0.26, hr * 0.22], c: tone(SK, -0.5), m: 'skin', line: 0, sub: [] },
      { e: [hx + hr * 0.56, hy, hr * 0.13, hr * 0.13], c: o.eye, m: 'gem', line: 0.4, glint: [[hx + hr * 0.52, hy - 1.5, 1.6]] },
      { p: [[hx + hr * 0.45, hy + hr * 0.52], [hx + hr * 0.98, hy + hr * 0.46], [hx + hr * 0.9, hy + hr * (0.72 + (o.jaw || 0))], [hx + hr * 0.5, hy + hr * 0.78]], c: '#2a1818', m: 'flat', line: 0,
        lines: [{ p: [[hx + hr * 0.6, hy + hr * 0.5], [hx + hr * 0.6, hy + hr * 0.62]], w: 1.4, c: '#d8d0b0', a: 1 }, { p: [[hx + hr * 0.78, hy + hr * 0.5], [hx + hr * 0.78, hy + hr * 0.6]], w: 1.4, c: '#d8d0b0', a: 1 }] },
      { p: [[hx - hr * 0.2, hy - hr * 0.2], [hx + hr * 0.1, hy + hr * 0.2]], c: SK, m: 'flat', line: 0, open: true, lines: [{ p: [[hx - hr * 0.3, hy - hr * 0.3], [hx - hr * 0.1, hy + hr * 0.3]], w: 1.4, a: 0.6 }] },
      ...(o.eyeGlow ? glow(hx + hr * 0.56, hy, 8, o.eyeGlow, 0.9) : []),
    ];
    V.def(name, humanoid({
      name, size: 0.96,
      legs,
      back: zarm([86, 96], [118, 102], [160, 96], SKD, tone(o.shirt, -0.2), true),
      body,
      head: headS,
      arm: zarm([126, 96], [150, 110], [174, 106], SK, o.shirt),
    }));
  }
  zombie('walking_dead', { skin: '#a2a488', shirt: '#7e6a4e', pants: '#4a4c5a', rope: '#6a5a3a', hair: '#3a3428', eye: '#e8e4c8', seed: 2 });
  zombie('zombie', { skin: '#7e9a58', shirt: '#4a3c58', pants: '#2e2a36', rope: '#3a2e22', hair: '#1e2418', eye: '#f0e040', eyeGlow: '240,220,60', bones: true, chain: true, jaw: 0.14, seed: 5 });

  /* ======================= привидение / призрак ======================= */
  /** Широкий рукав балахона: плечо → локоть → раструб; кисть — костлявые когти. */
  function sleeve(sh, el, cuff, c, o) {
    o = o || {}; const d = norm(cuff[0] - el[0], cuff[1] - el[1]), n = [-d[1], d[0]];
    const out = [{ p: [...tube([[sh[0], sh[1], 20], [el[0], el[1], 18], [cuff[0] - d[0] * 4, cuff[1] - d[1] * 4, 20]], { flat1: true }).slice(0, -2),
      P(cuff[0] + n[0] * 14, cuff[1] + n[1] * 14, 1), P(cuff[0] + n[0] * 6 + d[0] * 6, cuff[1] + n[1] * 6 + d[1] * 6, 1), P(cuff[0] + d[0] * 2, cuff[1] + d[1] * 2, 1), P(cuff[0] - n[0] * 6 + d[0] * 5, cuff[1] - n[1] * 6 + d[1] * 5, 1), P(cuff[0] - n[0] * 12, cuff[1] - n[1] * 12, 1)],
      c, m: 'cloth', belly: 0.2, line: 0.9, lines: [{ p: [lerp(sh, el, 0.3), lerp(el, cuff, 0.6)], w: 1, a: 0.4 }] }];
    return out;
  }
  function claw(hd, d, c, len) {
    d = norm(d[0], d[1]); const n = [-d[1], d[0]], L = len || 16;
    const out = [{ e: [hd[0], hd[1], 6, 5.5], c, m: 'horn', line: 0.7 }];
    for (let i = -1; i <= 1; i++) {
      const b = [hd[0] + n[0] * i * 4, hd[1] + n[1] * i * 4], m = [b[0] + d[0] * L * 0.55 + n[0] * i * 3, b[1] + d[1] * L * 0.55 + n[1] * i * 3], e = [b[0] + d[0] * L + n[0] * (i * 3 + 5), b[1] + d[1] * L + n[1] * (i * 3 + 5)];
      out.push({ p: tube([[b[0], b[1], 3.6], [m[0], m[1], 2.8], [e[0], e[1], 1.2]]), c, m: 'horn', line: 0.6 });
    }
    return out;
  }
  function wight(name, o) {
    const C = o.c, CD = tone(C, -0.3);
    const fade = 'rgba(' + o.mist + ',0.34)', fade2 = 'rgba(' + o.mist + ',0.16)';
    const shroud = [
      // дымка под подолом: балахон тает книзу
      { p: [[52, 196], [156, 196], [150, 222], ...tatters([150, 232], [54, 232], 16, 6, 7).slice(1)], c: fade2, m: 'flat', line: 0 },
      { p: [[58, 190], [150, 190], [146, 214], ...tatters([146, 222], [60, 222], 14, 6, 4).slice(1)], c: fade, m: 'flat', line: 0 },
      { p: [[80, 80], [124, 78], [136, 100], [140, 150], [152, 196], ...tatters([152, 208], [56, 208], 18, 7, 3).slice(1), [58, 180], [68, 130], [70, 98]], c: C, m: 'cloth', belly: 0.5, line: 0.9,
        lines: [{ p: [[100, 110], [96, 200]], w: 1.4, a: 0.55 }, { p: [[84, 120], [72, 196]], w: 1.2, a: 0.45 }, { p: [[120, 112], [134, 196]], w: 1.2, a: 0.45 }, { p: [[108, 96], [112, 150], [116, 200]], w: 1.1, light: true, a: 0.3 }] },
      // пелерина на плечах
      { p: [[74, 84], [100, 74], [130, 82], [142, 104], ...tatters([140, 118], [72, 122], 10, 4, 9).slice(1), [66, 104]], c: tone(C, -0.12), m: 'cloth', line: 0.8, belly: 0.2 },
      ...(o.sash ? [{ p: [[70, 140], [140, 136], [141, 146], [71, 150]], c: o.sash, m: 'cloth', line: 0.7 }, { p: [[118, 146], [128, 144], [132, 184, 1], [124, 176], [116, 186, 1]], c: o.sash, m: 'cloth', line: 0.7 }] : []),
    ];
    const hx = H.headX, hy = H.headY, r = 26;
    const hood = [
      { p: [[hx - r * 1.2, hy + r * 1.3], [hx - r * 1.3, hy - r * 0.1], [hx - r * 0.8, hy - r * 1.1], [hx + r * 0.1, hy - r * 1.35], [hx + r * 0.9, hy - r * 0.95], P(hx + r * 1.5, hy - r * 0.2, 1), [hx + r * 1.1, hy + r * 0.3], [hx + r * 0.9, hy + r * 1.1], [hx + r * 0.2, hy + r * 1.4]], c: C, m: 'cloth', line: 0.9,
        lines: [{ p: [[hx - r * 0.9, hy - r * 0.6], [hx - r * 0.8, hy + r * 1.0]], w: 1.2, a: 0.45 }] },
      // тьма под капюшоном
      { p: [[hx - r * 0.05, hy - r * 0.55], [hx + r * 0.7, hy - r * 0.62], [hx + r * 1.12, hy - r * 0.1], [hx + r * 0.95, hy + r * 0.7], [hx + r * 0.3, hy + r * 0.95], [hx - r * 0.1, hy + r * 0.4]], c: '#0e0c14', m: 'cloth', line: 0, ao: 1.4, rim: 0 },
      ...eye(hx + r * 0.46, hy + r * 0.05, 3, o.eyeC, o.eyeRgb), ...eye(hx + r * 0.9, hy + r * 0.02, 2.2, o.eyeC, o.eyeRgb),
    ];
    const farHand = [56, 50], hand = [176, 112];
    const nearArm = [...sleeve([126, 90], [152, 110], [168, 112], C), ...claw(hand, [1, 0.25], o.hand, 18)];
    if (o.scythe) {
      const d = norm(0.18, -1), at = (t, w) => [hand[0] + d[0] * t - d[1] * w, hand[1] + d[1] * t + d[0] * w];
      nearArm.unshift({ p: tube([[...at(-70, 0), 5.5], [...at(40, 1), 5.5], [...at(130, 0), 5]]), c: '#3a3036', m: 'wood', flow: Math.atan2(d[1], d[0]), line: 0.8 },
        { p: [P(...at(128, -2), 1), P(...at(136, 30)), P(...at(122, 70)), P(...at(96, 96), 1), P(...at(114, 64)), P(...at(120, 30)), P(...at(116, 2), 1)], c: o.blade, m: 'steel', gloss: 1.2,
          lines: [{ p: [at(128, 10), at(126, 44), at(110, 76)], w: 1.2, light: true, a: 0.8 }] });
      nearArm.push(...claw([hand[0] - 1, hand[1] - 3], [0.3, 1], o.hand, 8));
    }
    V.def(name, humanoid({
      name, robe: true, feet: false, size: 0.97,
      before: [{ kind: 'prop', pivot: [80, 92], shapes: [...sleeve([80, 92], [66, 72], [58, 56], CD), ...claw(farHand, [0.1, -1], tone(o.hand, -0.2), 15)] }],
      body: shroud,
      head: hood,
      arm: nearArm,
    }));
  }
  wight('wight', { c: '#5c586c', mist: '150,150,180', hand: '#d4d8cc', eyeC: '#c8f8ff', eyeRgb: '120,230,255' });
  wight('wraith', { c: '#242a46', mist: '80,120,200', hand: '#b8c8e0', eyeC: '#e8f6ff', eyeRgb: '90,170,255', scythe: true, blade: '#a8b8cc', sash: '#3a5aa0' });

  /* ======================= вампир / лорд вампиров ======================= */
  /** Плащ-крыло: наружная ткань с зубчатым краем, подкладка видна изнутри, складки — от «запястья». */
  function capeWing(O, d, L, outer, inner, o) {
    o = o || {}; d = norm(d[0], d[1]); const n = [d[1], -d[0]];
    const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
    const wrist = T(L * 0.6, -L * 0.02), tips = [T(L * 1.04, L * 0.06), T(L * 0.92, L * 0.36), T(L * 0.7, L * 0.58), T(L * 0.4, L * 0.72)];
    const edge = [T(-L * 0.04, -L * 0.04), T(L * 0.3, -L * 0.08), wrist, P(...tips[0], 1), T(L * 0.84, L * 0.2), P(...tips[1], 1), T(L * 0.68, L * 0.44), P(...tips[2], 1), T(L * 0.46, L * 0.6), P(...tips[3], 1), T(L * 0.18, L * 0.52), T(-L * 0.08, L * 0.4)];
    const lin = grow(edge, ...T(L * 0.4, L * 0.22), 0.86);
    return [{ p: edge, c: outer, m: 'leather', gloss: 0.35, rim: 0.8, line: 0.9,
      sub: [{ p: lin, c: inner, m: 'cloth', line: 0, belly: 0.3, lines: tips.map(t => ({ p: [lerp(wrist, T(L * 0.2, L * 0.1), 0.3), lerp(wrist, t, 0.5), t], w: 1.3, a: 0.55 })) }],
      lines: [{ p: [T(0, -L * 0.03), T(L * 0.3, -L * 0.07), wrist], w: 1.2, light: true, a: 0.45 }] },
    ...(o.trim ? [{ p: tube([[...T(-L * 0.02, -L * 0.04), 3], [...T(L * 0.3, -L * 0.08), 3], [...wrist, 3], [...tips[0], 2]]), c: o.trim, m: 'gold', line: 0.4 }] : [])];
  }
  const grow = K.grow;
  function vampire(name, o) {
    const SK = o.skin, hx = H.headX, hy = H.headY, r = H.headR;
    const collar = [{ p: [[80, 92], [70, 40], [92, 58], [104, 70], [118, 58], [138, 38], [130, 92]], c: o.cape, m: 'leather', line: 0.9,
      sub: [{ p: [[84, 90], [76, 50], [94, 64], [104, 74], [116, 64], [132, 48], [126, 90]], c: o.lining, m: 'cloth', line: 0, belly: 0.3 }] }];
    const hand = [162, 82];
    V.def(name, humanoid({
      name, size: 0.95,
      before: [
        { kind: 'prop', pivot: [92, 88], shapes: capeWing([92, 88], [-0.35, -1], 122, tone(o.cape, -0.15), o.lining, { trim: o.trim }) },
        { kind: 'prop', pivot: [84, 94], shapes: capeWing([84, 94], [-0.95, -0.4], 132, o.cape, tone(o.lining, -0.1), { trim: o.trim }) },
      ],
      legs: { style: 'hose', c: o.hose, boot: '#141218', tw: 22 },
      back: [...collar, ...arm([80, 90], [72, 118], [84, 140], { c: o.coat, hand: SK, w: 14 })],
      body: [...torso({ c: o.coat, skirt: o.coat, skirtLen: 190, belt: '#141218', buckle: o.gem, neck: SK, chestLines: [{ p: [[104, 88], [106, 140]], w: 1.2, a: 0.5 }] }),
        { p: [[96, 86], [116, 86], [114, 138], [100, 138]], c: o.vest, m: 'cloth', line: 0.7 },
        { p: [[98, 84], [114, 84], [112, 100], [106, 108], [100, 98]], c: '#ece6e0', m: 'cloth', line: 0.6, lines: [{ p: [[106, 88], [106, 104]], w: 0.9, a: 0.5 }] },
        { e: [106, 88, 5, 5], c: o.gem, m: 'gem', glint: [[104.5, 86.5, 1.6]] },
        ...(o.chain ? [{ p: tube([[84, 88, 2.5], [96, 110, 2.5], [108, 118, 2.5], [122, 108, 2.5], [128, 88, 2.5]]), c: '#e8c050', m: 'gold', line: 0.4 }, { e: [108, 120, 7, 7], c: '#e8c050', m: 'gold', glint: [[106, 118, 2]], sub: [{ e: [108, 120, 3.5, 3.5], c: '#c81830', m: 'gem', line: 0 }] }] : [])],
      head: [...head(hx, hy, r, { skin: SK, hair: o.hair, eye: '#d81818', browC: '#141018' }),
        // вдовий мыс и зачёс назад
        { p: [[hx - r * 1.0, hy + r * 0.2], [hx - r * 0.9, hy - r * 0.8], [hx - r * 0.1, hy - r * 1.15], [hx + r * 0.7, hy - r * 0.85], [hx + r * 0.5, hy - r * 0.55], P(hx + r * 0.3, hy - r * 0.3, 1), [hx + r * 0.05, hy - r * 0.6], [hx - r * 0.3, hy - r * 0.35], [hx - r * 0.6, hy + r * 0.4]], c: o.hair, m: 'fur', furLen: 0.7, flow: Math.PI, id: 'hair' },
        { p: [[hx - r * 0.3, hy + r * 0.4], [hx - r * 0.25, hy + r * 0.0], [hx - r * 0.5, hy - r * 0.05], P(hx - r * 1.0, hy - r * 0.4, 1), [hx - r * 0.62, hy + r * 0.3]], c: SK, m: 'skin', line: 0.7, lines: [{ p: [[hx - r * 0.4, hy + r * 0.2], [hx - r * 0.75, hy - r * 0.2]], w: 1, a: 0.5 }] },   // острое ухо
        { p: [P(hx + r * 0.62, hy + r * 0.62, 1), P(hx + r * 0.7, hy + r * 0.62, 1), P(hx + r * 0.66, hy + r * 0.85, 1)], c: '#fffaf0', m: 'flat', line: 0.4, lc: '#6a5a5a' },
        { p: [P(hx + r * 0.82, hy + r * 0.6, 1), P(hx + r * 0.9, hy + r * 0.6, 1), P(hx + r * 0.86, hy + r * 0.82, 1)], c: '#fffaf0', m: 'flat', line: 0.4, lc: '#6a5a5a' },
        ...glow(hx + r * 0.56, hy, 6, '255,40,40', 0.8),
        ...(o.crown ? [{ p: tube([[hx - r * 0.9, hy - r * 0.55, 3.2], [hx, hy - r * 0.95, 3.2], [hx + r * 0.85, hy - r * 0.62, 3.2]]), c: '#e8c050', m: 'gold', line: 0.5 },
          { p: [P(hx - r * 0.15, hy - r * 0.9, 1), P(hx + r * 0.02, hy - r * 1.35, 1), P(hx + r * 0.2, hy - r * 0.88, 1)], c: '#e8c050', m: 'gold', line: 0.5 }, { e: [hx + r * 0.02, hy - r * 1.0, 2.6, 2.6], c: '#c81830', m: 'gem', line: 0.3 }] : [])],
      arm: [...arm([126, 90], [146, 108], hand, { c: o.coat, hand: false, w: 15 }),
        { p: tube([[134, 106, 17], [146, 106, 19]]), c: o.lining, m: 'cloth', line: 0.7 },   // обшлаг
        ...claw(hand, [0.55, -0.85], SK, 16)],
    }));
  }
  vampire('vampire', { skin: '#dcd6dc', hair: '#141218', cape: '#1c1820', lining: '#a0141e', coat: '#2a2430', vest: '#6a1018', hose: '#1e1c24', gem: '#c81830' });
  vampire('vampire_lord', { skin: '#e4dce4', hair: '#d8d8e2', cape: '#6a0c22', lining: '#1a1420', coat: '#4a0c1c', vest: '#1a1420', hose: '#2a1018', gem: '#e8c050', trim: '#e8c050', chain: true, crown: true });

  /* ======================= лич / могучий лич ======================= */
  function lich(name, o) {
    const hx = H.headX, hy = H.headY, r = H.headR, hand = [150, 124], d = norm(0.08, -1);
    const orbAt = [hand[0] + d[0] * 112, hand[1] + d[1] * 112];
    const staff = [{ p: tube([[hand[0] - d[0] * 104, hand[1] - d[1] * 104, 5], [hand[0] + d[0] * 50, hand[1] + d[1] * 50, 5.6], [orbAt[0] - d[0] * 8, orbAt[1] - d[1] * 8, 5]]), c: o.shaft, m: o.shaftM || 'wood', flow: Math.atan2(d[1], d[0]), line: 0.8 }];
    if (o.skullStaff) staff.push(...skull(orbAt[0] - 2, orbAt[1] - 6, 10, { eyeC: o.eyeC, eyeRgb: o.glowRgb }),
      { p: tube([[orbAt[0] - 12, orbAt[1] - 12, 3.4], [orbAt[0] - 20, orbAt[1] - 28, 2.6], [orbAt[0] - 16, orbAt[1] - 40, 1.4]]), c: '#e8dcc0', m: 'horn', line: 0.6 },
      { p: tube([[orbAt[0] + 6, orbAt[1] - 14, 3.4], [orbAt[0] + 10, orbAt[1] - 32, 2.6], [orbAt[0] + 18, orbAt[1] - 42, 1.4]]), c: '#e8dcc0', m: 'horn', line: 0.6 });
    else staff.push(
      ...[-1, 1].map(s => ({ p: tube([[orbAt[0] + s * 5, orbAt[1] + 8, 3.6], [orbAt[0] + s * 13, orbAt[1] - 2, 3], [orbAt[0] + s * 8, orbAt[1] - 14, 1.6]]), c: BONE, m: 'horn', line: 0.6 })));
    staff.push(...glow(orbAt[0], orbAt[1] - (o.skullStaff ? 6 : 0), o.glowR, o.glowRgb, 1));
    if (!o.skullStaff) staff.push({ e: [orbAt[0], orbAt[1], 8.5, 8.5], c: o.orb, m: 'gem', glint: [[orbAt[0] - 3, orbAt[1] - 3, 3]] });
    const rc = o.robe;
    V.def(name, humanoid({
      name, robe: true, feetC: BONE_D, size: 0.95,
      back: [...sleeve([80, 90], [74, 118], [80, 140], tone(rc, -0.2)), ...claw([84, 144], [0.3, 1], BONE_D, 12)],
      body: [...robe({ c: rc, belt: o.belt, skin: BONE }),
        // кайма по полу мантии
        { p: [[104, 88], [114, 88], [122, 150], [130, 246, 1], [116, 246, 1], [108, 150]], c: o.trim, m: o.trimM || 'cloth', line: 0.6,
          lines: [0, 1, 2, 3].map(i => ({ p: [[114 + i * 3.5, 168 + i * 18], [118 + i * 3.5, 176 + i * 18]], w: 1.6, c: 'rgba(' + o.glowRgb + ',0.9)' })) },
        // наплечная пелерина
        { p: [[70, 86], [104, 76], [132, 84], [140, 104], ...tatters([138, 116], [68, 118], 9, 4, 3).slice(1), [64, 102]], c: tone(rc, -0.12), m: 'cloth', line: 0.8 },
        ...(o.spikes ? [0, 1].map(i => ({ p: [P(74 + i * 52, 88 - i * 4, 1), P(64 + i * 62, 60 - i * 2, 1), P(88 + i * 44, 84 - i * 2, 1)], c: o.trim, m: 'gold', line: 0.6 })) : []),
        // знак смерти на груди
        ...glow(106, 118, 14, o.glowRgb, 0.9),
        { e: [106, 118, 8, 8], c: o.rune, m: 'gem', line: 0.6, lc: '#102010', lines: [{ p: [[106, 112], [106, 124]], w: 1.4, c: '#10261a' }, { p: [[102, 116], [110, 116]], w: 1.4, c: '#10261a' }] }],
      head: [...skull(hx + 2, hy + 2, r - 2, { eyeC: o.eyeC, eyeRgb: o.glowRgb, jaw: 1 }),
        { p: [[hx - r * 1.25, hy + r * 1.3], [hx - r * 1.35, hy - r * 0.2], [hx - r * 0.75, hy - r * 1.2], [hx + r * 0.2, hy - r * 1.4], [hx + r * 1.0, hy - r * 1.0], P(hx + r * 1.4, hy - r * 0.3, 1), [hx + r * 0.7, hy - r * 0.55], [hx + r * 0.1, hy - r * 0.6], [hx - r * 0.3, hy + r * 0.1], [hx - r * 0.3, hy + r * 1.2]], c: o.hood, m: 'cloth', line: 0.9,
          lines: [{ p: [[hx - r * 0.9, hy - r * 0.7], [hx - r * 0.95, hy + r * 1.0]], w: 1.2, a: 0.45 }] },
        ...(o.crown ? [{ p: [P(hx - r * 0.8, hy - r * 0.95, 1), P(hx - r * 0.7, hy - r * 1.7, 1), P(hx - r * 0.4, hy - r * 1.15, 1), P(hx - r * 0.05, hy - r * 1.95, 1), P(hx + r * 0.25, hy - r * 1.2, 1), P(hx + r * 0.65, hy - r * 1.75, 1), P(hx + r * 0.75, hy - r * 0.95, 1), [hx, hy - r * 1.3]], c: o.trim, m: 'gold', line: 0.7, glint: [[hx - r * 0.05, hy - r * 1.5, 2.5]] },
          { e: [hx - r * 0.05, hy - r * 1.3, 3.2, 3.2], c: o.rune, m: 'gem', line: 0.4 }] : [])],
      arm: [...staff, ...sleeve([126, 90], [140, 112], [148, 118], rc), ...claw([152, 124], [0.2, -1], BONE, 10)],
    }));
  }
  lich('lich', { robe: '#4e2a72', hood: '#3e2060', belt: '#8a7a50', trim: '#7a5aa0', shaft: '#5a4a3a', orb: '#8af06a', rune: '#8af06a', eyeC: '#b8ff90', glowRgb: '120,240,100', glowR: 22 });
  lich('power_lich', { robe: '#221e28', hood: '#1a161e', belt: '#c8a040', trim: '#d8a53a', trimM: 'gold', shaft: '#d8ceb4', shaftM: 'horn', rune: '#d8ff60', eyeC: '#e8ff90', glowRgb: '190,255,80', glowR: 30, skullStaff: true, crown: true, spikes: true });

  /* ======================= чёрный рыцарь / рыцарь смерти ======================= */
  function knight(name, o) {
    const A = o.armor, hx = H.headX, hy = H.headY, r = H.headR;
    const skullEmblem = skull(140, 112, 11, { c: '#e0d8c0' });
    const hand = [140, 64];
    const d = mounted({
      name,
      horse: { coat: o.coat, mane: o.mane, hoof: '#141214', dark: tone(o.coat, -0.3), barding: o.barding, bardTrim: o.bardTrim, chanfron: o.chanfron, saddle: '#1e1a1e', bridle: '#2a2226', horn: o.horn },
      leg: { c: A, boot: tone(A, -0.1), m: 'steel' },
      back: [{ p: [[70, 86], [96, 82], [96, 150], ...tatters([70, 206], [34, 190], 12, 4, 6).slice(1), [52, 130]], c: o.cape, m: 'cloth', belly: 0.35, lines: [{ p: [[80, 100], [56, 186]], w: 1.1, a: 0.45 }] }],
      body: [...torso({ c: o.surcoat, skirt: false, plate: A, belt: '#1a161a', buckle: o.metal2, neck: tone(A, -0.2), neckM: 'steel' }),
        { e: [80, 94, 16, 14], c: A, m: 'steel' },
        // щит с черепом на дальней руке — выставлен вперёд
        ...shield.heater(142, 118, 46, 60, { rim: o.metal2, field: o.field, cross: false, boss: false, emblem: skullEmblem })],
      head: [...helm.great(hx, hy, r, { c: A }),
        ...(o.horns ? [{ p: tube([[hx - r * 0.5, hy - r * 0.7, 8], [hx - r * 1.2, hy - r * 1.4, 6], [hx - r * 1.1, hy - r * 2.2, 2]]), c: '#e0d6bc', m: 'horn', line: 0.7 },
          { p: tube([[hx + r * 0.4, hy - r * 0.9, 8], [hx + r * 0.7, hy - r * 1.7, 5.5], [hx + r * 1.3, hy - r * 2.1, 2]]), c: '#ece2c8', m: 'horn', line: 0.7 }] : []),
        { p: [[hx - 4, hy - 22], [hx - 14, hy - 36 - o.plumeH], [hx - 34, hy - 30 - o.plumeH * 0.6], [hx - 44, hy - 10], [hx - 22, hy - 16]], c: o.plume, m: 'fur', furLen: 1.3, flow: Math.PI * 1.1 },
        { e: [hx + r * 0.62, hy + r * 0.1, 3, 2], c: '#ff4020', m: 'gem', line: 0 }, ...glow(hx + r * 0.62, hy + r * 0.1, 7, '255,60,30', 0.8)],
      arm: [...(o.bladeGlow ? glow(hand[0] - 14, hand[1] - 60, 34, o.bladeGlow, 0.7) : []),
        ...weapon.sword(hand, [-0.22, -1], 104, { blade: o.blade, guard: o.metal2, grip: '#1a1418', w: 5.6 }),
        ...arm([126, 90], [148, 84], hand, { c: A, m: 'steel', hand: tone(A, -0.1), handM: 'steel', w: 17 }), { e: [128, 94, 16, 14], c: A, m: 'steel', glint: [[122, 88, 4]],
          sub: o.spikes ? [] : [] },
        ...(o.spikes ? [0, 1, 2].map(i => ({ p: [P(118 + i * 8, 86, 1), P(116 + i * 10, 68 - (i === 1 ? 6 : 0), 1), P(126 + i * 8, 86, 1)], c: tone(A, 0.2), m: 'steel', line: 0.6 })) : [])],
    });
    // горящие глаза коня
    const kf = d.anchor[1] / 282;
    addShapes(d, 5, [{ e: [296, 79, 6, 5], c: VOID, m: 'flat', line: 0 }, { e: [297, 79, 3.4, 2.8], c: '#ff4020', m: 'gem', line: 0, glint: [[296, 78, 1.4]] }, ...glow(296, 78, 10, '255,50,20', 1), { p: [[318, 102], [328, 96], [332, 104]], c: 'rgba(255,90,40,0.5)', m: 'flat', line: 0 }], [165, 282], kf);
    V.def(name, d);
  }
  knight('black_knight', { armor: '#3e4048', metal2: '#8a8f98', surcoat: '#1e1c22', cape: '#2a1418', coat: '#24212a', mane: '#0c0a10', chanfron: '#4a4c54', field: '#2a2830', plume: '#9a1c1c', plumeH: 0, blade: '#c4ccd6' });
  knight('dread_knight', { armor: '#34303e', metal2: '#c8a040', surcoat: '#4a1030', cape: '#6a0c22', coat: '#1c1a22', mane: '#6a0c22', chanfron: '#d8ceb4', barding: '#4a1438', bardTrim: '#c8a040', field: '#5a0c20', plume: '#c81830', plumeH: 16, blade: '#ff6a4a', bladeGlow: '255,60,30', horns: true, spikes: true });

  /* ======================= костяной / призрачный дракон ======================= */
  /** Костяное крыло: плечевая и лучевая кости, пальцы-спицы и рваные клочья перепонки между ними. */
  function boneWing(O, d, L, o) {
    d = norm(d[0], d[1]); const n = [d[1], -d[0]];
    const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
    const elbow = T(L * 0.28, -L * 0.08), wrist = T(L * 0.56, -L * 0.02);
    const tips = [T(L * 1.06, L * 0.02), T(L * 0.98, L * 0.34), T(L * 0.78, L * 0.6), T(L * 0.46, L * 0.76)];
    const out = [];
    // клочья перепонки: от кисти вдоль соседних пальцев, край рваный
    const mem = (i, reach) => {
      const a = tips[i], b = tips[i + 1], a1 = lerp(wrist, a, reach), b1 = lerp(wrist, b, reach * 0.9), mid = lerp(a1, b1, 0.5), j = lerp(wrist, mid, 0.72);
      return { p: [wrist, lerp(wrist, a, 0.3), P(...a1, 1), P(...lerp(a1, j, 0.45), 1), lerp(a1, b1, 0.35), P(...j, 1), lerp(b1, j, 0.3), P(...b1, 1), lerp(wrist, b, 0.35)], c: o.mem, m: o.memM || 'leather', gloss: 0.2, line: o.memLine === undefined ? 0.7 : o.memLine, lc: o.memLc, rim: 0.5 };
    };
    out.push(mem(0, 0.94), mem(1, 0.78), mem(2, 0.88));
    out.push({ p: [O, elbow, P(...lerp(elbow, T(L * 0.06, L * 0.36), 0.6), 1), T(L * 0.04, L * 0.3), P(...lerp(wrist, tips[3], 0.4), 1), T(L * 0.2, L * 0.3)], c: o.mem, m: o.memM || 'leather', line: o.memLine === undefined ? 0.7 : o.memLine, lc: o.memLc });
    out.push(bone(O, elbow, L * 0.075, o.bone), bone(elbow, wrist, L * 0.062, o.bone, { split: true }));
    for (const t of tips) out.push({ p: tube([[...wrist, L * 0.05], [...lerp(wrist, t, 0.5), L * 0.038], [...t, L * 0.016]]), c: o.bone, m: 'horn', gloss: 0.35, line: 0.7 });
    out.push({ e: [...wrist, L * 0.04, L * 0.04], c: o.bone, m: 'horn', line: 0.7 });
    out.push({ p: [wrist, P(...T(L * 0.6, -L * 0.16), 1), T(L * 0.62, -L * 0.03)], c: o.claw, m: 'horn', line: 0.6 });   // коготь на сгибе
    return out;
  }
  /** Лапа дракона: бедро → колено → щиколотка → стопа с тремя когтями. */
  function dragonLeg(pts, w, c, claw) {
    const [a, b, e, f] = pts, out = [bone(a, b, w, c), bone(b, e, w * 0.8, c, { split: true }), bone(e, [f[0] - 4, f[1] - 6], w * 0.62, c)];
    out.push({ e: [b[0], b[1], w * 0.75, w * 0.7], c, m: 'horn', line: 0.7 });
    for (let i = 0; i < 3; i++) out.push({ p: tube([[f[0] - 6 + i * 2, f[1] - 6, 4.5], [f[0] + 6 + i * 3, f[1] - 3 + i * 0.5, 3.4], [f[0] + 14 + i * 3, f[1] + 1, 1.2]]), c: i === 1 ? c : tone(c, -0.12), m: 'horn', line: 0.6 });
    out.push({ p: [[f[0] + 12, f[1] - 5], [f[0] + 20, f[1] - 1], P(f[0] + 22, f[1] + 1, 1), [f[0] + 13, f[1]]], c: claw, m: 'horn', line: 0.5 });
    return out;
  }
  /** Цепочка позвонков по точкам: овалы убывающего размера + остистые отростки сверху. */
  function vertebrae(pts, w0, w1, c, o) {
    o = o || {}; const out = [], n = pts.length;
    if (o.cord) out.push({ p: tube(pts.map((q, i) => [q[0], q[1], (w0 + (w1 - w0) * i / (n - 1)) * 0.45])), c: tone(c, -0.35), m: 'horn', line: 0.5 });
    for (let i = 0; i < n; i++) {
      const w = w0 + (w1 - w0) * i / (n - 1), a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const q = pts[i], nx = Math.sin(ang), ny = -Math.cos(ang);
      if (o.spines) out.push({ p: [P(q[0] - Math.cos(ang) * w * 0.4, q[1] - Math.sin(ang) * w * 0.4, 1), P(q[0] + nx * w * 1.2 - Math.cos(ang) * w * 0.6, q[1] + ny * w * 1.2 - Math.sin(ang) * w * 0.6, 1), P(q[0] + Math.cos(ang) * w * 0.3, q[1] + Math.sin(ang) * w * 0.3, 1)], c: tone(c, -0.06), m: 'horn', line: 0.6 });
      out.push({ p: K.ell(q[0], q[1], w * 0.62, w * 0.46, 10, ang), c: i % 2 ? c : tone(c, -0.06), m: 'horn', gloss: 0.3, line: 0.7 });
    }
    return out;
  }
  function dragon(name, o) {
    const B = o.bone, BD = tone(o.bone, -0.22), CL = o.claw;
    const wingO = { bone: B, mem: o.mem, memM: o.memM, memLine: o.memLine, memLc: o.memLc, claw: CL };
    const wingFar = Object.assign({}, wingO, { bone: BD, mem: o.memFar || o.mem });
    const spine = [[112, 196], [132, 186], [156, 180], [182, 176], [208, 174], [232, 174], [252, 170]];
    const tail = [[104, 200], [88, 208], [72, 220], [58, 236], [46, 254], [38, 272], [32, 290], [28, 306], [20, 318], [10, 324]];
    const neck = [[258, 166], [270, 150], [282, 134], [292, 118], [302, 104], [312, 94]];
    const ribs = [];
    for (let i = 0; i < 7; i++) {
      const x = 150 + i * 14, top = 180 - i * 0.6, dep = 60 - Math.abs(i - 3) * 5;
      ribs.push({ p: tube([[x, top, 8], [x + 8, top + dep * 0.45, 8.4], [x + 3, top + dep * 0.85, 6.5], [x - 6, top + dep, 4]]), c: i % 2 ? B : tone(B, -0.08), m: 'horn', gloss: 0.3, line: 0.7 });
    }
    const torso = [];
    if (o.spirit) torso.push(
      // призрачная плоть: полупрозрачный силуэт прежнего тела
      { p: [[30, 300], [44, 262], [70, 226], [104, 200], [150, 172], [210, 164], [252, 158], [284, 118], [306, 90], [330, 80], [352, 96], [330, 112], [300, 140], [276, 180], [262, 214], [236, 240], [180, 246], [130, 236], [96, 222], [66, 246], [40, 300], [22, 322]], c: 'rgba(' + o.spirit + ',0.2)', m: 'flat', line: 0 },
      { p: [[110, 196], [150, 176], [210, 170], [252, 166], [268, 196], [246, 234], [180, 242], [128, 228]], c: 'rgba(' + o.spirit + ',0.22)', m: 'flat', line: 0 });
    torso.push({ p: [[146, 184], [200, 176], [250, 178], [252, 214], [230, 240], [180, 244], [140, 228]], c: o.voidC, m: 'flat', line: 0 });
    torso.push(...vertebrae(tail, 20, 8, B, { cord: true }));
    torso.push({ p: [[100, 190], [118, 180], [142, 186], [150, 200], [138, 214], [126, 222, 1], [118, 210], [104, 210]], c: B, m: 'horn', gloss: 0.3, line: 0.8, lines: [{ p: [[114, 196], [128, 206], [140, 198]], w: 1.1, a: 0.5 }] });   // таз
    torso.push(...vertebrae(spine, 19, 21, B, { spines: true }));
    torso.push(...ribs);
    torso.push({ p: [[228, 168], [256, 160], [270, 178], [262, 200], [244, 204], [232, 190]], c: B, m: 'horn', gloss: 0.3, line: 0.8, lines: [{ p: [[240, 176], [256, 192]], w: 1, a: 0.5 }] });   // лопатка
    torso.push(...vertebrae(neck, 20, 15, B, { spines: true }));
    if (o.embers) torso.push(...glow(200, 212, 30, o.embers, 0.8));
    // череп: свод, длинная морда, отвисшая челюсть с зубами, рога назад
    const hd = [
      { p: tube([[316, 78, 11], [300, 60, 9], [280, 50, 6], [262, 52, 2]]), c: tone(B, -0.08), m: 'horn', gloss: 0.4, line: 0.7 },
      { p: [[318, 104], [344, 102], [368, 108], [376, 114], [370, 120, 1], [346, 118], [326, 122], [314, 116]], c: BD, m: 'horn', line: 0.8,
        lines: [0, 1, 2, 3].map(i => ({ p: [[340 + i * 8, 108], [340 + i * 8, 102]], w: 1.4, c: '#f4f0e0', a: 1 })) },
      { p: [[304, 96], [306, 78], [322, 66], [342, 70], [360, 82], [382, 92], P(386, 100, 1), [360, 104], [336, 104], [316, 110]], c: B, m: 'horn', gloss: 0.55, line: 0.8,
        lines: [{ p: [[346, 100], [380, 97]], w: 1.1, a: 0.5 }, ...[0, 1, 2, 3, 4].map(i => ({ p: [[344 + i * 8, 103], [346 + i * 8, 108]], w: 1.4, c: '#f4f0e0', a: 1 }))],
        sub: [{ p: [[326, 78], [340, 76], [344, 88], [332, 92], [324, 86]], c: VOID, m: 'flat', line: 0 }, { p: [[372, 88], [378, 90], [376, 94]], c: VOID, m: 'flat', line: 0 }] },
      ...eye(334, 84, 3.6, o.eyeC, o.eyeRgb),
      { p: tube([[326, 70, 10], [318, 48, 8], [324, 30, 5], [336, 20, 1.6]]), c: B, m: 'horn', gloss: 0.5, line: 0.7, lines: [{ p: [[320, 54], [328, 52]], w: 1, a: 0.5 }, { p: [[320, 42], [328, 42]], w: 1, a: 0.5 }] },
    ];
    // голова крупнее — череп главный опознавательный знак на поле боя
    const head = mapShapes(hd, (x, y) => [312 + (x - 312) * 1.18, 100 + (y - 100) * 1.18], 1.18);
    const parts = [
      { kind: 'prop', pivot: [240, 166], shapes: boneWing([240, 166], [0.1, -1], 160, wingFar) },
      { kind: 'leg', side: 1, pivot: [150, 204], shapes: dragonLeg([[150, 204], [182, 244], [158, 288], [168, 322]], 14, BD, CL) },
      { kind: 'leg', side: -1, pivot: [262, 196], shapes: dragonLeg([[262, 196], [252, 244], [274, 288], [284, 320]], 13, BD, CL) },
      { kind: 'leg', side: -1, pivot: [128, 206], shapes: dragonLeg([[128, 206], [164, 248], [138, 292], [150, 327]], 16, B, CL) },
      { kind: 'leg', side: 1, pivot: [244, 200], shapes: dragonLeg([[244, 200], [232, 248], [254, 292], [266, 327]], 15, B, CL) },
      { kind: 'torso', pivot: [190, 190], shapes: torso },
      { kind: 'head', pivot: [262, 166], shapes: head },
      { kind: 'prop', pivot: [218, 174], shapes: boneWing([218, 174], [-0.5, -0.87], 200, wingO) },
    ];
    if (o.mist) parts[5].shapes.push(...o.mist);
    V.def(name, { w: 380, h: 347, anchor: [200, 327], parts });
  }
  dragon('bone_dragon', { bone: BONE, claw: '#4a4046', mem: '#4a3e52', memFar: '#3a3044', voidC: 'rgba(40,20,50,0.55)', eyeC: '#c8ff70', eyeRgb: '150,255,80', embers: '150,80,200' });
  dragon('ghost_dragon', { bone: '#d0eeea', claw: '#6aa8a8', mem: 'rgba(150,230,225,0.34)', memFar: 'rgba(120,200,210,0.26)', memM: 'flat', memLine: 0, voidC: 'rgba(90,200,200,0.28)', eyeC: '#f0ffff', eyeRgb: '140,240,255', spirit: '150,235,225', embers: '120,240,230' });
})(typeof window !== 'undefined' ? window : globalThis);
