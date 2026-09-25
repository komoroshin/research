/* ============================================================================
   view/vec_stronghold.js — Цитадель на рисованном конвейере.
   Гоблины, наездники на волках, орки, огры, рухи, циклопы, чудища.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   с другой гаммой и заметной деталью (шлем, доспех, корона, молнии, шипы).
   Краски фракции: охра, бурая и зелёная кожа, выделанная кожа, мех, кость.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, move, grow, ell, weapon, arm, humanoid, fit, frameOf, tone, H } = K;
  const BONE = '#e8dcc0', HIDE = '#6a4424', ROPE = '#a88a5a', IRON = '#8e959c', DARK = '#1a120c';

  /** Зубы-клыки в ряд: от a к b, n штук, длина len вниз (или вверх при len < 0). */
  function fangs(a, b, n, len, c) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, w = Math.abs(b[0] - a[0]) / n * 0.42;
      out.push({ p: [P(x - w, y, 1), P(x + w * 0.2, y + len, 1), P(x + w, y, 1)], c: c || BONE, m: 'horn', line: 0.5 });
    }
    return out;
  }

  /* ================= Гоблин / хобгоблин =================
     Мелкий, сутулый, большеголовый, длинные уши назад, тощие руки-ноги, копьё. */
  /** Части гоблина в каноне гуманоида: ноги, голова, корпус, дальняя рука, ближняя рука с оружием. */
  function gob(o) {
    const sk = o.skin, skD = tone(sk, -0.22);
    const gLeg = (hip, foot, side) => {
      const c = side < 0 ? skD : sk, kx = hip[0] + 7, ky = 206, ax = foot[0] - 3, ay = foot[1] - 10;
      return [
        { p: tube([[hip[0], hip[1] - 6, 19], [kx, ky, 13], [ax, ay, 10]], { flat0: true }), c, m: 'skin', belly: 0.2 },
        { e: [kx + 1, ky, 7.5, 7], c, m: 'skin', line: 0.6 },
        // широкая ступня с когтистыми пальцами
        { p: [[ax - 10, ay - 3], [ax + 6, ay - 4], [foot[0] + 14, foot[1] - 6], P(foot[0] + 20, foot[1], 1), P(ax - 12, foot[1], 1)], c, m: 'skin' },
        ...[0, 1].map(i => ({ p: [P(foot[0] + 8 + i * 7, foot[1] - 3, 1), P(foot[0] + 16 + i * 7, foot[1] - 1, 1), P(foot[0] + 10 + i * 7, foot[1] + 1, 1)], c: BONE, m: 'horn', line: 0.4 })),
        ...(o.wraps ? [{ p: tube([[ax, ay - 16, 12], [ax, ay + 2, 11]], { flat1: true }), c: o.wraps, m: 'leather', lines: [{ p: [[ax - 6, ay - 10], [ax + 6, ay - 13]], w: 1, a: 0.6 }, { p: [[ax - 6, ay - 3], [ax + 6, ay - 6]], w: 1, a: 0.6 }] }] : []),
      ];
    };
    // голова: большой череп, крючковатый нос, оскал, жёлтый глаз, уши назад
    const headShapes = [
      // дальнее ухо — выше и темнее, за черепом
      { p: [[106, 50], [86, 34], [58, 14, 1], [74, 38], [96, 58]], c: skD, m: 'skin', line: 0.7 },
      { p: [[92, 86], [88, 64], [96, 44], [114, 36], [134, 40], [144, 52], [146, 62], [158, 70], [163, 78, 1], [150, 80], [150, 88], [140, 98], [124, 100], [106, 96]], c: sk, m: 'skin', id: 'face',
        lines: [{ p: [[132, 48], [144, 54]], w: 1, a: 0.4 }, { p: [[138, 90], [132, 96]], w: 1, a: 0.5 }] },
      // оскал: тёмный рот и зубы
      { p: [[128, 86], [150, 84], [148, 92], [132, 93]], c: '#3a1410', m: 'flat', line: 0.5, sub: fangs([128, 85], [150, 83], 4, 4.5, '#f0e8d0') },
      ...fangs([132, 93], [146, 92], 2, -4, '#f0e8d0'),
      // нос-крючок поверх
      { p: [[140, 60], [152, 66], [163, 78, 1], [154, 80], [144, 76]], c: tone(sk, 0.08), m: 'skin', line: 0.7 },
      // глаз: жёлтый, щёлочка-зрачок, тяжёлая бровь
      { e: [134, 64, 6, 5], c: o.eye || '#f0d040', m: 'gem', line: 0.5, sub: [{ e: [136, 64, 1.6, 4], c: DARK, m: 'flat', line: 0 }], glint: [[132.5, 62.5, 1.6]] },
      { p: [[124, 56], [142, 55], [146, 60], [128, 60]], c: tone(sk, -0.45), m: 'skin', line: 0 },
      // ближнее ухо — длинное, назад и вверх
      { p: [[104, 60], [82, 50], [44, 34, 1], [62, 56], [84, 76], [104, 80]], c: sk, m: 'skin', id: 'ear',
        sub: [{ p: [[100, 64], [80, 56], [54, 40], [68, 58], [86, 72], [100, 74]], c: o.earIn || '#c86a5a', m: 'skin', line: 0 }],
        lines: [{ p: [[96, 64], [70, 48]], w: 1, a: 0.4 }] },
    ];
    if (o.helm) headShapes.push(
      { p: [[90, 70], [92, 50], [104, 38], [122, 34], [140, 40], [148, 54], [150, 62, 1], [92, 64, 1]], c: o.helm, m: 'leather', lines: [{ p: [[96, 56], [146, 56]], w: 1.2, a: 0.5 }, { p: [[120, 36], [120, 60]], w: 1.4, a: 0.5 }] },
      { p: [[88, 62, 1], [152, 60, 1], [154, 66, 1], [88, 70, 1]], c: tone(o.helm, -0.3), m: 'leather', glint: [[100, 65, 1.6], [118, 64, 1.6], [136, 63, 1.6]] },
      { p: [P(114, 38, 1), P(118, 12, 1), P(126, 36, 1)], c: IRON, m: 'steel', line: 0.6 });
    const body = [
      { p: tube([[108, 86, 15], [104, 106, 17]]), c: skD, m: 'skin' },
      // сутулый корпус с брюшком
      { p: [[74, 110], [92, 98], [122, 98], [134, 110], [142, 134], [138, 156], [124, 172], [86, 172], [74, 152], [70, 128]], c: sk, m: 'skin', belly: 0.35,
        sub: [{ e: [120, 146, 20, 22], c: tone(sk, 0.18), m: 'skin', line: 0 }],
        lines: [{ p: [[100, 110], [108, 122]], w: 1, a: 0.35 }, { p: [[90, 124], [98, 132]], w: 1, a: 0.3 }] },
      // верёвочный пояс и рваная набедренная повязка
      { p: [[80, 164], [134, 160], [138, 174], [140, 200, 1], [130, 192], [122, 204, 1], [112, 192], [102, 202, 1], [92, 190], [80, 198, 1], [78, 176]], c: o.cloth, m: 'leather', belly: 0.3, lines: [{ p: [[108, 168], [110, 196]], w: 1, a: 0.4 }] },
      { p: tube([[78, 166, 5], [106, 164, 5], [136, 160, 5]]), c: ROPE, m: 'cloth', line: 0.6 },
    ];
    if (o.vest) body.push(
      { p: [[76, 112], [94, 100], [120, 100], [132, 110], [134, 132], [120, 136], [96, 136], [78, 130]], c: o.vest, m: 'leather', lines: [{ p: [[104, 102], [106, 134]], w: 1.2, a: 0.5 }],
        glint: [[86, 116, 1.8], [124, 116, 1.8], [96, 128, 1.8], [118, 128, 1.8]] });
    else body.push({ p: tube([[82, 104, 4], [108, 124, 4], [132, 150, 4]]), c: HIDE, m: 'leather', line: 0.5 },
      { e: [108, 110, 4, 5], c: BONE, m: 'horn', line: 0.5 }, { e: [118, 114, 3.5, 4.5], c: BONE, m: 'horn', line: 0.5 });
    const shoulder = o.pad ? [{ p: [[110, 102], [124, 94], [140, 100], [142, 116], [124, 118], [112, 114]], c: o.pad, m: 'leather', glint: [[126, 104, 2]], lines: [{ p: [[116, 108], [138, 108]], w: 1, a: 0.5 }] },
      { p: [P(126, 96, 1), P(132, 84, 1), P(136, 98, 1)], c: IRON, m: 'steel', line: 0.5 }] : [{ e: [124, 108, 9, 8], c: sk, m: 'skin' }];
    return {
      leg: gLeg, head: headShapes, body,
      back: arm([84, 108], [72, 136], [84, 156], { c: skD, m: 'skin', hand: skD, w: 12 }),
      /** Ближняя рука: локоть el, кисть hand, оружие — формы, уже вложенные в кисть. */
      arm: (el, hand, wpn) => [...wpn, ...arm([124, 108], el, hand, { c: sk, m: 'skin', hand: sk, w: 12 }), ...shoulder],
    };
  }
  function goblin(name, o) {
    const g = gob(o), hand = [150, 142];
    V.def(name, humanoid({
      name, size: o.size || 0.9, legs: g.leg, back: g.back, body: g.body, head: g.head,
      arm: g.arm([140, 132], hand, weapon.polearm(hand, [0.2, -1], 118, { kind: o.kind || 'spear', back: 60, head: o.blade || '#a8aeb2', shaft: '#6a4a2a', ribbon: o.ribbon })),
    }));
  }
  goblin('goblin', { skin: '#7fa83a', cloth: '#8a4a2a', eye: '#f0d040' });
  goblin('hobgoblin', { skin: '#c8863a', cloth: '#6a3a1c', eye: '#ffe060', helm: '#b0302a', vest: '#7a4a24', pad: '#9a2a24', wraps: '#6a4a2a', kind: 'glaive', blade: '#c0c6cc', ribbon: '#b0302a', earIn: '#a04a3a' });

  /* ================= Орк / вождь орков =================
     Широкоплечий, тяжёлая челюсть с клыками вверх, чуб, кожаный доспех; метает топоры. */
  /** Метательный топор: короткое топорище, бородовидное лезвие вперёд. */
  function throwAxe(hand, dir, len, o) {
    o = o || {}; const at = K.along(hand, dir), E = len, hd = o.head || '#b8c0c8';
    const out = [{ p: tube([[...at(-12, 0), 6], [...at(E + 4, 0), 5]]), c: o.shaft || '#6a4424', m: 'wood', flow: Math.atan2(dir[1], dir[0]), line: 0.8,
      lines: [{ p: [at(-6, -3), at(-4, 3)], w: 1.4, c: '#2a1a10', a: 0.8 }, { p: [at(0, -3), at(2, 3)], w: 1.4, c: '#2a1a10', a: 0.8 }] }];
    out.push({ p: [P(...at(E - 16, 2), 1), P(...at(E - 22, 12)), P(...at(E - 20, 26), 1), P(...at(E - 6, 30)), P(...at(E + 8, 26), 1), P(...at(E + 4, 12)), P(...at(E + 2, 2), 1)], c: hd, m: 'steel', gloss: 1.1,
      lines: [{ p: [at(E - 18, 25), at(E - 6, 28.5), at(E + 6, 25)], w: 1.3, light: true, a: 0.85 }] });
    if (o.double) out.push({ p: [P(...at(E - 14, -2), 1), P(...at(E - 20, -12)), P(...at(E - 16, -22), 1), P(...at(E - 4, -24)), P(...at(E + 6, -20), 1), P(...at(E + 3, -10)), P(...at(E + 2, -2), 1)], c: hd, m: 'steel', gloss: 1.1 });
    if (o.cap) out.push({ p: [P(...at(E - 18, -5), 1), P(...at(E + 6, -5), 1), P(...at(E + 6, 5), 1), P(...at(E - 18, 5), 1)], c: o.cap, m: 'gold', line: 0.6 });
    return out;
  }
  function orc(name, o) {
    const sk = o.skin, skD = tone(sk, -0.2);
    const headShapes = [
      // чуб-хвост назад
      { p: [[96, 30], [80, 34], [62, 48], [58, 66, 1], [72, 52], [88, 44], [100, 40]], c: o.hair || '#1e1a16', m: 'fur', furLen: 1.1, flow: Math.PI * 0.8, id: 'tail' },
      // ухо — острое, назад
      { p: [[92, 50], [70, 42, 1], [86, 62], [96, 64]], c: skD, m: 'skin', line: 0.7 },
      // голова: покатый лоб, тяжёлые надбровья, выпирающая нижняя челюсть
      { p: [[84, 66], [84, 44], [96, 30], [116, 26], [130, 34], [136, 46], [133, 50], [140, 58], [137, 64], [144, 72], [142, 84, 1], [124, 90], [104, 88], [90, 80]], c: sk, m: 'skin', id: 'face',
        lines: [{ p: [[120, 44], [136, 47]], w: 2, a: 0.7 }, { p: [[126, 78], [142, 76]], w: 1.4, c: '#2a1410', a: 0.9 }, { p: [[108, 64], [116, 76]], w: 1, a: 0.4 }] },
      { e: [127, 52, 4.2, 3.4], c: o.eye || '#e0402a', m: 'gem', line: 0.5, glint: [[126, 51, 1.4]] },
      // клыки нижней челюсти
      { p: [P(128, 78, 1), P(131, 64, 1), P(135, 78, 1)], c: BONE, m: 'horn', line: 0.6 },
      { p: [P(138, 77, 1), P(142, 67, 1), P(143, 77, 1)], c: BONE, m: 'horn', line: 0.6 },
      // чуб на макушке
      { p: [[92, 34], [100, 22], [116, 18], [124, 26], [112, 28], [100, 36]], c: o.hair || '#1e1a16', m: 'fur', furLen: 0.8, flow: Math.PI * 0.9, id: 'hair' },
    ];
    const bigHead = list => list.map(q => K.mapShape(q, (x, y) => [108 + (x - 108) * 1.14, 86 + (y - 86) * 1.14], 1.14));
    if (o.helm) headShapes.push(
      { p: [[84, 52], [88, 32], [104, 22], [124, 22], [136, 34], [138, 46, 1], [84, 54, 1]], c: o.helm, m: 'steel', lines: [{ p: [[110, 22], [112, 50]], w: 1.6, a: 0.6 }], glint: [[100, 32, 3]] },
      { p: [[82, 46, 1], [140, 42, 1], [140, 50, 1], [82, 54, 1]], c: o.trim, m: 'gold', glint: [[96, 49, 1.8], [112, 48, 1.8], [128, 46, 1.8]] },
      // рога
      { p: tube([[92, 34, 10], [74, 20, 8], [70, 0, 5], [80, -12, 2]]), c: BONE, m: 'horn', gloss: 0.8, lines: [{ p: [[84, 30], [88, 24]], w: 1, a: 0.5 }, { p: [[74, 14], [80, 12]], w: 1, a: 0.5 }] },
      { p: tube([[124, 28, 9], [138, 12, 7], [136, -6, 4], [126, -14, 2]]), c: tone(BONE, -0.12), m: 'horn', gloss: 0.8 });
    const body = [
      { p: tube([[106, 82, 22], [102, 96, 26]]), c: skD, m: 'skin' },
      { p: [[60, 96], [78, 82], [126, 80], [146, 96], [144, 124], [132, 150], [74, 150], [62, 126]], c: sk, m: 'skin', belly: 0.25,
        lines: [{ p: [[100, 88], [104, 110]], w: 1.2, a: 0.4 }] },
      // доспех: кожаная кираса с оковкой и ремнями
      { p: [[68, 100], [86, 90], [124, 90], [140, 104], [138, 130], [128, 150], [78, 150], [68, 128]], c: o.armor, m: o.armorM || 'leather', belly: 0.2, id: 'armor',
        lines: [{ p: [[72, 116], [138, 116]], w: 1.4, a: 0.5 }, { p: [[72, 132], [136, 132]], w: 1.4, a: 0.5 }, { p: [[104, 92], [104, 148]], w: 1.2, a: 0.4 }],
        glint: [[80, 108, 2], [96, 106, 2], [112, 106, 2], [128, 108, 2], [80, 124, 2], [96, 124, 2], [112, 124, 2], [128, 124, 2]] },
      { p: [[74, 144], [134, 144], [136, 156], [72, 156]], c: HIDE, m: 'leather', sub: [{ e: [106, 150, 8, 7], c: o.buckle || IRON, m: o.buckle ? 'gold' : 'steel', line: 0.5 }] },
      // полосы-тассеты
      ...[0, 1, 2, 3].map(i => ({ p: [[74 + i * 16, 154], [90 + i * 16, 154], [92 + i * 16, 186], [76 + i * 16, 188]], c: i % 2 ? o.skirt : tone(o.skirt, -0.1), m: 'leather', glint: [[83 + i * 16, 178, 1.6]] })),
    ];
    if (o.mantle) body.push({ p: [[58, 110], [64, 86], [84, 76], [108, 80], [128, 76], [140, 88], [132, 100], [118, 96], [100, 102], [80, 100], [70, 118]], c: o.mantle, m: 'fur', furLen: 1.1, flow: Math.PI * 0.55 });
    if (o.skull) body.push({ e: [106, 150, 9, 8], c: BONE, m: 'horn', line: 0.6, sub: [{ e: [103, 149, 2, 2], c: DARK, m: 'flat', line: 0 }, { e: [109, 149, 2, 2], c: DARK, m: 'flat', line: 0 }] });
    const hand = [152, 134];
    V.def(name, humanoid({
      name, size: 1,
      legs: { style: 'hose', c: o.pants || '#5a4028', boot: '#2e2218', tw: 31, m: 'leather' },
      back: [...arm([76, 94], [66, 124], [74, 150], { c: skD, m: 'skin', hand: skD, w: 20 })],
      body,
      head: bigHead(headShapes),
      arm: [
        ...throwAxe(hand, [0.3, -1], 74, { head: o.blade, double: o.double, cap: o.cap, shaft: o.shaft }),
        ...arm([126, 94], [148, 116], hand, { c: sk, m: 'skin', hand: sk, w: 20 }),
        { p: tube([[146, 118, 13], [150, 130, 12]]), c: o.bracer || HIDE, m: 'leather', line: 0.7 },
        { p: [[110, 96], [128, 88], [148, 94], [150, 114], [130, 116], [114, 110]], c: o.pad || IRON, m: o.padM || 'steel', glint: [[128, 96, 3]] },
        { p: [P(132, 92, 1), P(138, 76, 1), P(142, 90, 1)], c: o.spike || IRON, m: 'steel', line: 0.6 },
        { p: [P(142, 92, 1), P(152, 80, 1), P(149, 98, 1)], c: o.spike || IRON, m: 'steel', line: 0.6 },
      ],
    }));
  }
  orc('orc', { skin: '#5f8f3a', armor: '#7a5230', skirt: '#6a4628', pants: '#5a4028', eye: '#e8402a' });
  orc('orc_chieftain', { skin: '#5a8836', armor: '#a82a24', armorM: 'leather', skirt: '#8a2420', pants: '#3a2c22', eye: '#ffb030', helm: '#6a6e74', trim: '#d8a53a', mantle: '#4a3422',
    pad: '#a82a24', padM: 'leather', spike: '#d8a53a', buckle: '#d8a53a', double: true, cap: '#d8a53a', blade: '#d0d6de', bracer: '#a82a24', skull: true });

  /* ================= Огр / огр-маг =================
     Громадный, пузатый, маленькая голова в плечах, дубина из цельного ствола. */
  function ogre(name, o) {
    const sk = o.skin, skD = tone(sk, -0.2);
    const oLeg = (hip, foot, side) => {
      const c = side < 0 ? skD : sk, kx = hip[0] + 4, ky = 208, ax = foot[0] - 2, ay = foot[1] - 10;
      return [
        { p: tube([[hip[0], hip[1] - 8, 40], [kx, ky, 30], [ax, ay, 22]], { flat0: true }), c, m: 'skin', belly: 0.2 },
        { p: tube([[ax, ay - 20, 26], [ax, ay + 2, 24]], { flat1: true }), c: side < 0 ? tone(o.wrap, -0.2) : o.wrap, m: 'fur', furLen: 0.7, flow: Math.PI * 0.5 },
        { p: [[ax - 14, ay - 4], [ax + 10, ay - 6], [foot[0] + 18, foot[1] - 8], P(foot[0] + 22, foot[1], 1), P(ax - 16, foot[1], 1)], c, m: 'skin' },
      ];
    };
    const headShapes = [
      // ухо-лопух
      { e: [96, 66, 7, 9], c: skD, m: 'skin', line: 0.7, sub: [{ e: [97, 67, 3.5, 5], c: tone(skD, -0.2), m: 'skin', line: 0 }] },
      // лысый купол, низкий лоб, приплюснутый нос, выдвинутая нижняя челюсть
      { p: [[92, 76], [90, 54], [100, 38], [118, 32], [134, 38], [141, 50], [139, 57], [147, 64], [145, 72], [150, 80], [148, 94, 1], [128, 100], [106, 96], [96, 88]], c: sk, m: 'skin', id: 'face',
        lines: [{ p: [[124, 82], [146, 80]], w: 1.6, c: '#2a1410', a: 0.9 }, { p: [[106, 70], [114, 84]], w: 1.1, a: 0.4 }, { p: [[112, 42], [124, 40]], w: 1, a: 0.35 }] },
      { p: [[118, 50], [138, 48], [143, 54], [134, 57], [120, 56]], c: tone(sk, -0.25), m: 'skin', line: 0.6 },
      { e: [129, 59, 3.2, 2.6], c: o.eye || '#2a1a10', m: 'gem', line: 0.5, glint: [[128, 58, 1.1]] },
      { p: [[136, 60], [148, 64], [150, 72], [138, 72]], c: tone(sk, 0.08), m: 'skin', line: 0.6, lines: [{ p: [[144, 70], [148, 70]], w: 1.4, a: 0.7 }] },
      // клыки из нижней челюсти
      { p: [P(128, 84, 1), P(131, 68, 1), P(136, 84, 1)], c: BONE, m: 'horn', line: 0.6 },
      { p: [P(140, 83, 1), P(145, 70, 1), P(147, 83, 1)], c: BONE, m: 'horn', line: 0.6 },
      ...(o.hat ? [
        { p: [[88, 58], [90, 40], [104, 30], [126, 30], [138, 42], [140, 54, 1], [88, 60, 1]], c: o.hat, m: 'cloth', lines: [{ p: [[92, 50], [138, 48]], w: 1.2, a: 0.5 }] },
        { p: [[96, 36], [108, 14], [124, 4], [134, 10, 1], [122, 16], [118, 32]], c: o.hat, m: 'cloth' },
        { e: [116, 46, 6, 6], c: o.gem, m: 'gem', glint: [[114, 44, 2]] },
        { e: [95, 76, 3, 4], c: '#e8c050', m: 'gold', line: 0.5 },
      ] : [{ p: tube([[102, 36, 9], [90, 40, 11], [82, 52, 10], [80, 66, 5]]), c: o.hair || '#3a2414', m: 'fur', furLen: 1, flow: Math.PI * 0.6 },
        { p: tube([[98, 36, 10], [95, 40, 10]]), c: HIDE, m: 'leather', line: 0.5 }]),
    ].map(q => K.mapShape(q, (x, y) => [112 + (x - 112) * 1.12, 92 + (y - 92) * 1.12], 1.12));
    const body = [
      // горбатая спина и огромное пузо
      { p: [[56, 110], [66, 84], [90, 72], [128, 72], [150, 86], [156, 112], [158, 140], [148, 164], [124, 176], [86, 176], [62, 160], [52, 136]], c: sk, m: 'skin', belly: 0.35,
        sub: [{ e: [124, 138, 32, 34], c: tone(sk, 0.14), m: 'skin', line: 0 }],
        lines: [{ p: [[100, 96], [118, 100], [132, 94]], w: 1.2, a: 0.4 }, { p: [[128, 134], [132, 138]], w: 1.6, a: 0.6 }] },
      // набедренная повязка из шкуры
      { p: [[62, 158], [144, 158], [150, 176], [148, 204, 1], [132, 194], [118, 208, 1], [102, 196], [86, 206, 1], [68, 196, 1], [60, 176]], c: o.loin, m: o.loinM || 'fur', furLen: 0.9, flow: Math.PI * 0.5, belly: 0.3,
        ...(o.loinTrim ? { sub: [{ p: [[50, 192], [160, 186], [160, 212], [50, 212]], c: o.loinTrim, m: 'gold', line: 0 }] } : {}) },
      { p: tube([[60, 160, 9], [104, 162, 9], [148, 158, 9]]), c: o.belt || HIDE, m: 'leather', line: 0.7 },
    ];
    if (o.sash) body.push({ p: [[74, 80], [92, 76], [148, 150], [134, 160]], c: o.sash, m: 'cloth', line: 0.7 });
    const hand = [160, 150];
    const club = o.staff
      ? weapon.staff(hand, [0.08, -1], 150, { orb: o.orb, back: 86, shaft: '#4a2a5a', cap: '#e8c050' })
      : [{ p: tube([[...K.along(hand, [0.32, -1])(-22, 0), 12], [...K.along(hand, [0.32, -1])(40, 0), 15], [...K.along(hand, [0.32, -1])(96, 1), 26], [...K.along(hand, [0.32, -1])(128, 0), 30]]), c: '#7a5230', m: 'wood', flow: Math.atan2(-1, 0.32), line: 0.9,
          lines: [{ p: [K.along(hand, [0.32, -1])(70, -6), K.along(hand, [0.32, -1])(80, -2)], w: 1.4, a: 0.6 }] },
        ...[[92, -12], [110, 14], [122, -14], [104, -2]].map(([t, w]) => { const q = K.along(hand, [0.32, -1])(t, w); return { p: [P(q[0] - 4, q[1] + 3, 1), P(q[0] + (w > 0 ? 8 : -8), q[1] - 3, 1), P(q[0] + 3, q[1] + 5, 1)], c: IRON, m: 'steel', line: 0.5 }; }),
        { e: [...K.along(hand, [0.32, -1])(60, 7), 4, 3], c: '#4a3020', m: 'wood', line: 0.5 }];
    V.def(name, humanoid({
      name, size: 1, dx: 4,
      legs: oLeg,
      back: [...arm([72, 96], [56, 132], [66, 162], { c: skD, m: 'skin', hand: skD, w: 30 })],
      body,
      head: headShapes,
      arm: [
        ...club,
        ...arm([134, 106], [158, 128], hand, { c: sk, m: 'skin', hand: sk, w: 30 }),
        ...(o.bracer ? [{ p: tube([[153, 128, 20], [158, 144, 19]]), c: o.bracer, m: 'gold', line: 0.7 }] : []),
      ],
    }));
  }
  ogre('ogre', { skin: '#c89868', loin: '#7a5a3a', wrap: '#6a4a2c', hair: '#3a2414' });
  ogre('ogre_mage', { skin: '#5a86c8', loin: '#5a2a7a', loinM: 'cloth', loinTrim: '#e8c050', wrap: '#4a2a5a', hat: '#6a2a8a', gem: '#f05050', eye: '#ffdd44',
    staff: true, orb: '#e05aff', sash: '#e8c050', belt: '#3a1a4a', bracer: '#e8c050' });

  /* ================= Циклоп / король циклопов =================
     Высокий, один глаз, поднятая рука с валуном — вот-вот метнёт. */
  function cyclops(name, o) {
    const sk = o.skin, skD = tone(sk, -0.2);
    const cLeg = (hip, foot, side) => {
      const c = side < 0 ? skD : sk, kx = hip[0] + 5, ky = 206, ax = foot[0] - 2, ay = foot[1] - 10;
      return [
        { p: tube([[hip[0], hip[1] - 6, 32], [kx, ky, 23], [(kx + ax) / 2 + 2, (ky + ay) / 2, 20], [ax, ay, 15]], { flat0: true }), c, m: 'skin', belly: 0.2,
          lines: [{ p: [[kx - 4, ky + 2], [kx + 6, ky + 4]], w: 1, a: 0.45 }] },
        { p: [[ax - 12, ay - 3], [ax + 8, ay - 5], [foot[0] + 16, foot[1] - 6], P(foot[0] + 19, foot[1], 1), P(ax - 13, foot[1], 1)], c, m: 'skin' },
        ...(o.anklet ? [{ p: tube([[ax, ay - 8, 18], [ax, ay - 2, 18]], { flat0: true, flat1: true }), c: o.anklet, m: 'gold', line: 0.5 }] : []),
      ];
    };
    const headShapes = [
      { p: [[84, 60], [86, 40], [100, 28], [120, 28], [134, 38], [140, 52], [138, 62], [142, 70], [138, 84, 1], [118, 90], [98, 86], [88, 74]], c: sk, m: 'skin', id: 'face',
        lines: [{ p: [[120, 80], [136, 78]], w: 1.4, c: '#2a1410', a: 0.9 }] },
      { e: [90, 58, 5, 8], c: skD, m: 'skin', line: 0.7 },
      // единственный глаз — крупный, посреди лба
      { e: [122, 52, 11, 9], c: '#f4efe0', m: 'gem', line: 0.8, gloss: 0.6,
        sub: [{ e: [126, 52, 6, 6.5], c: o.eye || '#6aa83a', m: 'gem', line: 0, sub: [{ e: [127, 52, 2.6, 3.4], c: DARK, m: 'flat', line: 0 }] }], glint: [[123, 49, 2]] },
      { p: [[108, 40], [128, 38], [138, 44], [136, 46], [110, 46]], c: tone(sk, -0.45), m: 'skin', line: 0 },
      { p: [[134, 60], [144, 66], [142, 72], [134, 70]], c: tone(sk, 0.06), m: 'skin', line: 0.6 },
      { p: [P(128, 80, 1), P(130, 72, 1), P(133, 80, 1)], c: BONE, m: 'horn', line: 0.5 },
      ...(o.crown ? [
        { p: [P(90, 40, 1), P(92, 22, 1), P(100, 32, 1), P(108, 14, 1), P(116, 30, 1), P(124, 12, 1), P(130, 30, 1), P(140, 20, 1), P(138, 42, 1), P(90, 46, 1)], c: o.crown, m: 'gold', glint: [[108, 20, 2], [124, 18, 2]] },
        { e: [116, 38, 4.5, 4], c: '#d02a2a', m: 'gem', glint: [[115, 37, 1.5]] },
      ] : [{ p: [[86, 46], [92, 30], [110, 22], [130, 26], [124, 32], [104, 34], [92, 48]], c: o.hair || '#3a2414', m: 'fur', furLen: 0.8, flow: Math.PI * 0.8 }]),
    ];
    const body = [
      { p: tube([[106, 84, 22], [102, 98, 26]]), c: skD, m: 'skin' },
      { p: [[62, 98], [80, 84], [126, 82], [144, 96], [142, 122], [132, 148], [76, 150], [64, 126]], c: sk, m: 'skin', belly: 0.3,
        lines: [{ p: [[88, 106], [102, 112], [118, 106]], w: 1.3, a: 0.45 }, { p: [[104, 116], [104, 142]], w: 1.1, a: 0.35 }, { p: [[92, 126], [116, 126]], w: 1, a: 0.3 }] },
      { p: [[68, 144], [138, 142], [142, 164], [144, 188, 1], [128, 180], [114, 192, 1], [98, 180], [82, 190, 1], [66, 184, 1], [64, 166]], c: o.kilt, m: o.kiltM || 'leather', belly: 0.3,
        lines: [{ p: [[104, 150], [104, 190]], w: 1.1, a: 0.4 }], ...(o.kiltTrim ? { sub: [{ p: [[50, 180], [150, 176], [150, 204], [50, 204]], c: o.kiltTrim, m: 'gold', line: 0 }] } : {}) },
      { p: [[66, 140], [140, 138], [141, 150], [65, 152]], c: o.belt, m: o.beltM || 'leather', sub: [{ e: [104, 145, 7, 6.5], c: o.buckle || IRON, m: o.buckle ? 'gold' : 'steel', line: 0.5 }] },
    ];
    if (o.cape) body.unshift({ p: [[70, 86], [100, 82], [92, 150], [72, 214], [44, 204], [50, 150]], c: o.cape, m: 'cloth', belly: 0.3 });
    const hand = [166, 34];
    V.def(name, humanoid({
      name, size: 1,
      legs: cLeg,
      back: [...arm([78, 96], [68, 126], [74, 154], { c: skD, m: 'skin', hand: skD, w: 22 })],
      body,
      head: headShapes,
      arm: [
        { p: tube([[126, 102, 26], [146, 90, 28], [164, 80, 21]]), c: sk, m: 'skin', lines: [{ p: [[138, 88], [152, 84]], w: 1, light: true, a: 0.5 }] },
        { p: tube([[164, 80, 21], [168, 58, 18], [165, 40, 15]]), c: sk, m: 'skin' },
        { p: [[112, 92], [124, 86], [138, 90], [140, 104], [126, 110], [114, 104]], c: sk, m: 'skin', line: 0.6 },
        ...(o.bracer ? [{ p: tube([[166, 72, 15], [166, 48, 14]]), c: o.bracer, m: 'gold', line: 0.6 }] : []),
        // валун в ладони
        { p: [[146, 20], [152, 4], [170, -4], [188, 2], [194, 18], [188, 34], [170, 40], [152, 36]], c: o.rock, m: 'horn', gloss: 0.2, belly: 0.4,
          lines: [{ p: [[160, 8], [166, 18], [162, 28]], w: 1.2, a: 0.5 }, { p: [[174, 6], [180, 14]], w: 1, a: 0.4 }, { p: [[154, 12], [170, 4]], w: 1.2, light: true, a: 0.5 }] },
        { e: [164, 36, 11, 9], c: sk, m: 'skin', line: 0.8 },
      ],
    }));
  }
  cyclops('cyclops', { skin: '#c89a6a', kilt: '#a83a2a', belt: '#5a3a22', rock: '#8a8a88', hair: '#3a2414', eye: '#6aa83a' });
  cyclops('cyclops_king', { skin: '#9aa4ae', kilt: '#2c4a90', kiltM: 'cloth', kiltTrim: '#e8c050', belt: '#e8c050', beltM: 'gold', buckle: '#d02a2a', rock: '#7a7068', crown: '#e8c050', eye: '#f0a020',
    cape: '#7a1e2a', bracer: '#e8c050', anklet: '#e8c050' });
  /* ================= Наездник на волке / волчий налётчик =================
     Волк собран из трубок в рамке коня (330×290, земля y=282), гоблин сидит на нём. */
  const WG = 282;
  function wolfPaw(x, y, c) {   // x — передний край лапы
    return [
      { p: [[x - 24, y - 12], [x - 6, y - 14], [x + 3, y - 7], [x + 4, y, 1], [x - 26, y, 1]], c, m: 'fur', furLen: 0.5, flow: Math.PI * 0.5 },
      ...[0, 1, 2].map(i => ({ p: [P(x - 2 - i * 6, y - 4, 1), P(x + 5 - i * 6, y - 1, 1), P(x - i * 6, y + 1, 1)], c: '#2a2420', m: 'horn', line: 0.4 })),
    ];
  }
  function wolfLeg(pts, c, pawX, thigh) {
    const out = [];
    if (thigh) out.push({ p: thigh, c, m: 'fur', furLen: 0.8, flow: Math.PI * 0.55, belly: 0.3 });
    out.push({ p: tube(pts, { flat0: true }), c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.5, belly: 0.2 });
    out.push(...wolfPaw(pawX, WG, c));
    return out;
  }
  function wolf(o) {
    const c = o.fur, far = tone(c, -0.28), belly = o.belly, dark = o.dark;
    const legs = [
      { kind: 'leg', side: 1, pivot: [98, 176], shapes: wolfLeg([[98, 166, 34], [114, 208, 22], [94, 244, 14], [100, WG - 10, 12]], far, 112) },
      { kind: 'leg', side: -1, pivot: [222, 180], shapes: wolfLeg([[222, 168, 26], [226, 220, 18], [228, 256, 13], [232, WG - 10, 12]], far, 244) },
      { kind: 'leg', side: -1, pivot: [120, 178], shapes: wolfLeg([[120, 170, 36], [136, 210, 24], [114, 246, 15], [120, WG - 10, 13]], c, 132,
        [[92, 150], [130, 146], [146, 178], [140, 206], [122, 218], [102, 206], [92, 180]]) },
      { kind: 'leg', side: 1, pivot: [242, 182], shapes: wolfLeg([[242, 170, 30], [246, 222, 19], [248, 258, 14], [252, WG - 10, 13]], c, 264) },
    ];
    const body = [
      // пышный хвост, опущенный вниз
      { p: tube([[82, 152, 14], [58, 162, 24], [42, 188, 28], [36, 220, 22], [42, 246, 6]]), c, m: 'fur', furLen: 1.5, flow: Math.PI * 0.55, id: 'tail',
        sub: [{ p: [[20, 226], [60, 222], [60, 260], [20, 260]], c: o.tip || belly, m: 'fur', furLen: 1.2, flow: Math.PI * 0.5, line: 0 }] },
      { p: [[72, 162], [86, 146], [128, 140], [168, 136], [204, 126], [236, 130], [258, 150], [262, 178], [250, 202], [228, 210], [202, 204], [172, 196], [142, 190], [118, 200], [92, 198], [74, 184]], c, m: 'fur', furLen: 0.9, flow: Math.PI * 0.72, belly: 0.4, id: 'body',
        sub: [{ p: [[150, 188], [180, 186], [196, 196, 1], [214, 188], [232, 196, 1], [262, 178], [270, 220], [140, 220]], c: belly, m: 'fur', furLen: 0.8, flow: Math.PI * 0.5, line: 0 },
          { p: [[80, 150], [128, 136], [206, 120], [240, 126], [236, 138], [204, 136], [168, 146], [128, 150], [86, 160]], c: dark, m: 'fur', furLen: 0.9, flow: Math.PI * 0.72, line: 0 }],
        lines: [{ p: [[96, 160], [110, 176], [108, 194]], w: 1.2, a: 0.4 }, { p: [[226, 150], [236, 176], [230, 200]], w: 1.2, a: 0.35 }] },
    ];
    if (o.blanket) body.push({ p: [[140, 132], [200, 124], [206, 160, 1], [196, 172, 1], [178, 164], [160, 174, 1], [142, 166, 1]], c: o.blanket, m: 'cloth', belly: 0.3,
      sub: [{ p: [[130, 156], [210, 150], [210, 180], [130, 180]], c: o.blanketTrim || '#e8c050', m: 'gold', line: 0 }] });
    const head = [
      // грива-воротник
      { p: [[210, 164], [216, 132], [236, 110], [262, 102], [282, 112], [278, 142], [262, 168], [240, 184], [220, 186]], c: o.ruff || c, m: 'fur', furLen: 1.2, flow: Math.PI * 0.62,
        lines: [{ p: [[232, 124], [240, 150], [236, 176]], w: 1.2, a: 0.4 }] },
      { p: [[280, 94], [290, 66, 1], [300, 96]], c: far, m: 'fur', furLen: 0.4, line: 0.7 },
      // череп и морда
      { p: [[256, 110], [270, 94], [292, 90], [306, 100], [320, 110], [334, 118], [337, 126, 1], [322, 132], [306, 136], [292, 146], [274, 146], [260, 132]], c, m: 'fur', furLen: 0.5, flow: Math.PI * 0.95, id: 'skull',
        sub: [{ p: [[300, 126], [340, 120], [340, 150], [296, 150]], c: belly, m: 'fur', furLen: 0.4, line: 0 }],
        lines: [{ p: [[280, 100], [300, 104]], w: 1.2, a: 0.4 }] },
      // пасть: тёмная щель, клыки, нижняя челюсть
      { p: [[298, 134], [334, 130], [334, 142], [300, 144]], c: '#3a1410', m: 'flat', line: 0.5 },
      { p: [[290, 142], [312, 140], [332, 144], [330, 151, 1], [306, 154], [290, 150]], c: tone(c, -0.08), m: 'fur', furLen: 0.4, flow: Math.PI },
      ...fangs([302, 132], [334, 129], 4, 6),
      ...fangs([306, 144], [328, 145], 2, -5),
      { e: [336, 124, 4.5, 3.8], c: '#1a1410', m: 'horn', gloss: 1.2, line: 0.4 },
      { e: [298, 110, 4.4, 3.4], c: o.eye || '#f0c030', m: 'gem', line: 0.5, sub: [{ e: [299, 110, 1.4, 3], c: DARK, m: 'flat', line: 0 }], glint: [[297, 109, 1.4]] },
      { p: [[288, 104], [304, 104], [306, 108], [290, 108]], c: tone(c, -0.5), m: 'flat', line: 0 },
      { p: [[266, 100], [268, 68, 1], [286, 92]], c, m: 'fur', furLen: 0.4, sub: [{ p: [[270, 96], [270, 76], [280, 92]], c: '#c89088', m: 'skin', line: 0 }] },
    ];
    if (o.collar) head.push({ p: tube([[236, 116, 10], [228, 146, 11], [236, 176, 10]]), c: o.collar, m: 'leather', line: 0.7 },
      ...[0, 1, 2].map(i => ({ p: [P(238 + i * 1, 122 + i * 22, 1), P(248 + i * 1, 126 + i * 22, 1), P(238 + i * 1, 130 + i * 22, 1)], c: IRON, m: 'steel', line: 0.5 })));
    return { legs, body, head };
  }
  function wolfRider(name, o) {
    const W = wolf(o.wolf), g = gob(o.rider), k = 1.0;
    const fR = (x, y) => [166 + (x - 100) * k, 134 + (y - 168) * k];
    const R = list => K.mapShapes(list, fR, k);
    const sk = o.rider.skin;
    const riderLeg = [
      { p: tube([[160, 136, 22], [188, 152, 17]], { flat0: true }), c: sk, m: 'skin' },
      { p: tube([[188, 152, 15], [186, 182, 11]]), c: sk, m: 'skin' },
      { p: [[178, 180], [192, 180], [204, 188, 1], [178, 190, 1]], c: sk, m: 'skin' },
      ...(o.rider.wraps ? [{ p: tube([[186, 166, 13], [186, 180, 12]], { flat1: true }), c: o.rider.wraps, m: 'leather' }] : []),
    ];
    const hand = [150, 140];
    const wpn = o.axe ? weapon.axe(hand, [0.5, -1], 70, { head: '#c0c6cc', shaft: '#5a3a22' })
      : weapon.polearm(hand, [0.42, -1], 110, { kind: 'spear', back: 50, head: '#a8aeb2', shaft: '#6a4a2a', ribbon: o.ribbon });
    const parts = [W.legs[0], W.legs[1], W.legs[2], W.legs[3],
      { kind: 'torso', pivot: [166, 170], shapes: R(g.back).concat(W.body, riderLeg, R(g.body)) },
      { kind: 'head', pivot: [240, 150], shapes: W.head },
      { kind: 'head', pivot: fR(104, 96), shapes: R(g.head) },
      { kind: 'prop', pivot: fR(124, 108), shapes: R(g.arm([138, 130], hand, wpn)) }];
    const to = frameOf(name) || { w: 300, h: 243, anchor: [147, 240] };
    V.def(name, fit(parts, { ground: [170, WG], height: 300 }, to, to.anchor[1] / 292));
  }
  wolfRider('wolf_rider', { wolf: { fur: '#8c8a88', belly: '#d8d2c6', dark: '#5a5856', eye: '#f0c030' }, rider: { skin: '#7fa83a', cloth: '#8a4a2a' } });
  wolfRider('wolf_raider', { wolf: { fur: '#7a5634', belly: '#c8a47a', dark: '#3e2a1a', ruff: '#5a3a22', tip: '#2a1a10', eye: '#ff7a20', blanket: '#a82a24', collar: '#3a2418' },
    rider: { skin: '#c8863a', cloth: '#6a3a1c', helm: '#b0302a', vest: '#7a4a24', pad: '#9a2a24', wraps: '#6a4a2a', earIn: '#a04a3a' }, axe: true });

  /* ================= Рух / птица грома =================
     Огромная хищная птица стоит на лапах, крылья вскинуты. Летун: крылья — prop. */
  function talonLeg(dx, c, feath, claw) {
    const X = 196 + dx, G = 290;
    const toes = [0, 1, 2].map(i => ({ p: tube([[X + 2, G - 8, 10], [X + 16 - i * 4, G - 4 + i, 8], [X + 26 - i * 7, G - 2 + i, 5]]), c, m: 'horn', tex: 'scale', texSize: 0.35, line: 0.6 }));
    const claws = [0, 1, 2].map(i => ({ p: [P(X + 24 - i * 7, G - 5 + i, 1), P(X + 33 - i * 7, G - 1 + i, 1), P(X + 26 - i * 7, G + 2 + i * 0.5, 1)], c: claw, m: 'horn', line: 0.5 }));
    return [
      { p: [P(X - 6, G - 6, 1), P(X - 18, G, 1), P(X - 4, G - 1, 1)], c: claw, m: 'horn', line: 0.5 },
      { p: tube([[X - 4, 236, 19], [X, 262, 16], [X + 2, G - 8, 15]]), c, m: 'horn', tex: 'scale', texSize: 0.5 },
      ...toes, ...claws,
      { p: [[X - 26, 196], [X + 18, 194], [X + 20, 226], [X + 12, 250, 1], [X + 2, 238], [X - 6, 252, 1], [X - 14, 238], [X - 24, 246, 1]], c: feath, m: 'feather', texSize: 0.55, belly: 0.3 },
    ];
  }
  /** Молния-зигзаг от точки a к b. */
  function bolt(a, b, w, c) {
    const n = 5, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), px = -dy / L, py = dx / L, L2 = [], R2 = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, j = i % 2 ? 1 : -1, off = (i === 0 || i === n) ? 0 : j * w * 1.4, ww = w * (1 - t * 0.85);
      const x = a[0] + dx * t + px * off, y = a[1] + dy * t + py * off;
      L2.push(P(x + px * ww, y + py * ww, 1)); R2.push(P(x - px * ww, y - py * ww, 1));
    }
    return { p: [...L2, ...R2.reverse()], c: c || '#fff07a', m: 'gem', gloss: 1.3, line: 0.6, lc: '#c08010' };
  }
  function roc(name, o) {
    const WN = { pri: o.pri, pri2: tone(o.pri, 0.1), sec: o.sec, sec2: tone(o.sec, -0.08), cov: o.cov, cov2: o.cov2 };
    const WF = { pri: tone(o.pri, -0.25), pri2: tone(o.pri, -0.18), sec: tone(o.sec, -0.25), sec2: tone(o.sec, -0.3), cov: tone(o.cov, -0.25), cov2: tone(o.cov2, -0.25) };
    const tail = [];
    for (let i = 4; i >= 0; i--) { const lf = K.leaf([138, 204], Math.PI * (0.72 + i * 0.06), 96 - i * 6, 22); tail.push({ p: lf.body, c: i % 2 ? o.pri : tone(o.pri, 0.12), m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.9, light: true, a: 0.45 }] }); }
    const nearWing = K.wing.feather([196, 152], [-0.66, -0.75], 156, WN);
    const farWing = K.wing.feather([216, 146], [-0.16, -1], 138, WF);
    if (o.bolts) {
      nearWing.push(bolt([72, 30], [28, 112], 8), bolt([134, 12], [112, 76], 6.5));
      farWing.unshift(bolt([236, -10], [284, 52], 7));
    }
    const head = [
      { p: [[220, 168], [224, 134], [238, 112], [260, 102], [282, 108], [282, 130], [270, 150], [254, 172]], c: o.neck, m: 'feather', texSize: 0.55, flow: Math.PI * 0.6 },
      ...(o.crest ? [0, 1, 2].map(i => { const lf = K.leaf([256 - i * 5, 86 + i * 5], Math.PI * (1.1 + i * 0.07), 52 - i * 8, 14); return { p: lf.body, c: i % 2 ? o.crest : tone(o.crest, 0.15), m: 'leather', gloss: 0.6, line: 0.6, lines: [{ p: lf.shaft, w: 0.8, light: true, a: 0.5 }] }; }) : []),
      // перья на затылке торчат назад
      { p: [[252, 100], [236, 92, 1], [248, 106], [232, 110, 1], [250, 114]], c: tone(o.head, -0.15), m: 'feather', texSize: 0.4, line: 0.6 },
      { p: [[246, 108], [252, 88], [270, 76], [292, 76], [306, 88], [304, 104], [286, 114], [262, 116]], c: o.head, m: 'feather', texSize: 0.42, flow: Math.PI * 0.8 },
      // клюв-крюк: длинный, низкий, остриё вниз
      { p: [[294, 102], [320, 106], [312, 113], [294, 110]], c: tone(o.beak, -0.22), m: 'horn' },
      { p: [[294, 84], [312, 84], [328, 92], [338, 104], [334, 118, 1], [328, 106], [314, 102], [296, 102]], c: o.beak, m: 'horn', gloss: 1.1, lines: [{ p: [[300, 88], [324, 94]], w: 1, light: true, a: 0.7 }, { p: [[306, 99], [312, 97]], w: 1.4, a: 0.7 }] },
      { p: [[290, 84], [298, 83], [299, 101], [291, 102]], c: tone(o.beak, 0.2), m: 'horn', line: 0.6 },
      { e: [283, 90, 5, 4.4], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [284, 90, 2.2, 3], c: DARK, m: 'flat', line: 0 }], glint: [[282, 88.5, 1.7]] },
      // хмурая надбровная дуга
      { p: [[268, 82], [290, 80], [300, 86, 1], [290, 86], [274, 88]], c: tone(o.head, -0.35), m: 'feather', texSize: 0.3, line: 0.6 },
    ].map(q => K.mapShape(q, (x, y) => [236 + (x - 236) * 1.18, 168 + (y - 168) * 1.18], 1.18));
    V.def(name, {
      w: 373, h: 307, anchor: [187, 290],
      parts: [
        { kind: 'prop', pivot: [216, 146], shapes: farWing },
        { kind: 'leg', side: 1, pivot: [186, 204], shapes: talonLeg(-12, tone(o.leg, -0.2), tone(o.breast, -0.25), '#2a2018') },
        { kind: 'leg', side: -1, pivot: [210, 206], shapes: talonLeg(12, o.leg, o.breast, '#1e1812') },
        { kind: 'torso', pivot: [190, 190], shapes: [...tail,
          { p: [[118, 206], [136, 176], [176, 152], [214, 140], [244, 146], [260, 170], [254, 200], [232, 222], [196, 232], [156, 226], [130, 220]], c: o.body, m: 'feather', texSize: 0.7, flow: Math.PI * 0.8, belly: 0.4,
            sub: [{ p: [[200, 140], [270, 150], [270, 240], [196, 240], [206, 224, 1], [196, 210], [210, 198, 1], [202, 184], [216, 172, 1], [210, 160]], c: o.breast, m: 'feather', texSize: 0.55, flow: Math.PI * 0.5, line: 0, belly: 0.3 }] },
        ] },
        { kind: 'head', pivot: [236, 150], shapes: head },
        { kind: 'prop', pivot: [196, 152], shapes: nearWing },
      ],
    });
  }
  roc('roc', { pri: '#4a3020', sec: '#6a4428', cov: '#8a5a32', cov2: '#a8784a', body: '#7a5030', breast: '#c09060', neck: '#9a7048', head: '#b89068', beak: '#e0b040', leg: '#d8a838', eye: '#f0a020' });
  roc('thunderbird', { pri: '#1a2e7a', sec: '#2448a8', cov: '#2e66c8', cov2: '#5a9ae0', body: '#2448a8', breast: '#8ac4f0', neck: '#3a70c8', head: '#4a88d8', beak: '#f0c830', leg: '#e8b830', eye: '#fff060',
    crest: '#f0c830', bolts: true });

  /* ================= Чудище / древнее чудище =================
     Горбатый зверь на мощных передних лапах, рога вперёд, нижние клыки, шипы по хребту. */
  const BG = 240;
  function bClawPaw(x, c, claw, big) {   // x — передний край, земля BG
    const s = big ? 1.25 : 1;
    return [
      { p: [[x - 34 * s, BG - 16], [x - 8, BG - 18 * s], [x + 2, BG - 8], [x + 3, BG, 1], [x - 36 * s, BG, 1]], c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.5 },
      ...[0, 1, 2].map(i => ({ p: [P(x - 4 - i * 9 * s, BG - 7, 1), P(x + 10 - i * 9 * s, BG - 2, 1), P(x + 2 - i * 9 * s, BG + 1, 1)], c: claw, m: 'horn', line: 0.6, gloss: 0.8 })),
    ];
  }
  function behemoth(name, o) {
    const c = o.fur, far = tone(c, -0.28), mane = o.mane;
    const leg = (pts, col, pawX, big, thigh) => {
      const out = [];
      if (thigh) out.push({ p: thigh, c: col, m: 'fur', furLen: 0.9, flow: Math.PI * 0.5, belly: 0.3 });
      out.push({ p: tube(pts, { flat0: true }), c: col, m: 'fur', furLen: 0.8, flow: Math.PI * 0.5, belly: 0.25 });
      out.push(...bClawPaw(pawX, col, o.claw, big));
      return out;
    };
    const spikes = [];
    const ridge = [[96, 92], [124, 76], [150, 64], [176, 54], [200, 50], [224, 56]];
    ridge.forEach(([x, y], i) => { const h = (o.spikeH || 18) + (i > 1 && i < 5 ? 6 : 0); spikes.push({ p: [P(x - 9, y + 6, 1), P(x - 4, y - h, 1), P(x + 9, y + 4, 1)], c: o.spike, m: o.spikeM || 'horn', gloss: 0.9, line: 0.6 }); });
    const horn = (pts, col) => ({ p: tube(pts), c: col, m: 'horn', gloss: 0.9, lines: [{ p: [pts[1], [pts[1][0] + 4, pts[1][1] - 3]], w: 1, a: 0.5 }, { p: [pts[2], [pts[2][0] + 3, pts[2][1] - 3]], w: 1, a: 0.5 }] });
    const head = [
      horn([[276, 104, 15], [268, 80, 12], [278, 58, 8], [298, 50, 4.5], [310, 56, 2]], tone(o.horn, -0.2)),
      { p: [[244, 116], [258, 98], [284, 92], [306, 102], [322, 118], [324, 136], [312, 148], [288, 152], [264, 150], [248, 136]], c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.95,
        lines: [{ p: [[284, 110], [306, 112]], w: 2.2, a: 0.7 }, { p: [[312, 128], [322, 128]], w: 1.4, a: 0.6 }] },
      // нижняя челюсть — вперёд, с клыками вверх
      { p: [[258, 148], [292, 148], [318, 142], [326, 150], [318, 164], [292, 172], [266, 166]], c: tone(c, -0.1), m: 'fur', furLen: 0.5, flow: Math.PI },
      { p: [[288, 146], [320, 140], [318, 148], [290, 152]], c: '#3a1410', m: 'flat', line: 0.4 },
      ...fangs([290, 146], [318, 141], 4, -8),
      { p: [P(304, 144, 1), P(310, 124, 1), P(316, 142, 1)], c: BONE, m: 'horn', line: 0.6, gloss: 0.8 },
      { e: [322, 124, 4, 3.4], c: '#1a1210', m: 'horn', line: 0.4 },
      { e: [294, 116, 5, 4], c: o.eye, m: 'gem', line: 0.5, glint: [[293, 114.5, 1.6]] },
      { p: [[280, 106], [304, 104], [308, 111], [284, 112]], c: tone(c, -0.5), m: 'flat', line: 0 },
      { p: [[252, 106], [242, 90, 1], [262, 102]], c, m: 'fur', furLen: 0.4, line: 0.7 },
      horn([[262, 106, 17], [250, 82, 14], [258, 56, 9], [280, 44, 5], [294, 48, 2]], o.horn),
    ];
    if (o.hornsExtra) head.push(horn([[252, 128, 11], [238, 132, 8], [230, 120, 5], [234, 108, 2]], o.horn));
    const body = [
      { p: tube([[66, 128, 18], [40, 140, 16], [26, 162, 12], [24, 180, 8]]), c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.6 },
      { p: [[8, 176], [22, 168], [36, 176], [30, 196, 1], [20, 186], [12, 196, 1]], c: mane, m: 'fur', furLen: 1.1, flow: Math.PI * 0.5 },
      ...spikes,
      { p: [[52, 146], [58, 110], [88, 88], [130, 70], [170, 58], [206, 54], [238, 66], [256, 92], [262, 124], [252, 152], [228, 172], [190, 178], [150, 172], [112, 170], [78, 168], [58, 160]], c, m: 'fur', furLen: 1.0, flow: Math.PI * 0.75, belly: 0.45,
        sub: [{ p: [[150, 60], [210, 48], [250, 70], [266, 110], [254, 116], [240, 96], [214, 84], [180, 82], [150, 90], [134, 78]], c: mane, m: 'fur', furLen: 1.3, flow: Math.PI * 0.6, line: 0 },
          ...(o.stripes ? [0, 1, 2, 3].map(i => ({ p: [[84 + i * 26, 96 - i * 6], [96 + i * 26, 92 - i * 6], [92 + i * 26, 130 - i * 4, 1], [86 + i * 26, 120]], c: o.stripes, m: 'fur', furLen: 0.8, line: 0 })) : [])],
        lines: [{ p: [[92, 110], [104, 140], [98, 164]], w: 1.4, a: 0.45 }, { p: [[200, 110], [214, 140], [206, 170]], w: 1.4, a: 0.4 }, { p: [[100, 96], [150, 76], [200, 64]], w: 1.6, light: true, a: 0.35 }] },
    ];
    if (o.crystals) body.push(...[[120, 100, 14], [168, 84, 18], [214, 86, 14]].map(([x, y, h]) => ({ p: [P(x - 7, y + 4, 1), P(x - 3, y - h, 1), P(x + 3, y - h - 4, 1), P(x + 8, y + 2, 1)], c: o.crystals, m: 'gem', gloss: 1.3, line: 0.6 })));
    V.def(name, {
      w: 333, h: 247, anchor: [167, 240],
      parts: [
        { kind: 'leg', side: 1, pivot: [90, 150], shapes: leg([[90, 140, 50], [102, 180, 36], [88, 210, 27], [94, BG - 12, 25]], far, 112, false) },
        { kind: 'leg', side: -1, pivot: [206, 150], shapes: leg([[206, 136, 54], [214, 180, 44], [214, 212, 35], [218, BG - 12, 34]], far, 248, true) },
        { kind: 'leg', side: -1, pivot: [110, 152], shapes: leg([[110, 144, 54], [124, 184, 38], [108, 212, 29], [114, BG - 12, 27]], c, 134, false,
          [[76, 124], [124, 118], [142, 150], [136, 184], [116, 196], [92, 184], [80, 156]]) },
        { kind: 'leg', side: 1, pivot: [230, 154], shapes: leg([[228, 138, 58], [238, 182, 48], [238, 214, 38], [242, BG - 12, 36]], c, 274, true,
          [[208, 110], [250, 112], [262, 146], [254, 184], [232, 192], [212, 170]]) },
        { kind: 'torso', pivot: [160, 150], shapes: body },
        { kind: 'head', pivot: [252, 130], shapes: head },
      ],
    });
  }
  behemoth('behemoth', { fur: '#8a5a34', mane: '#5a3a22', horn: '#e8dcc0', spike: '#d8c8a0', claw: '#f0e6d0', eye: '#f0a020' });
  behemoth('ancient_behemoth', { fur: '#6a7a98', mane: '#e8ecf4', horn: '#f4f6fa', spike: '#9ad8f0', spikeM: 'gem', spikeH: 24, claw: '#e8f4ff', eye: '#60e0ff', crystals: '#7ad0f8', hornsExtra: true });
})(typeof window !== 'undefined' ? window : globalThis);
