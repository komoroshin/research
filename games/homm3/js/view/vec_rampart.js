/* ============================================================================
   view/vec_rampart.js — Оплот на рисованном конвейере.
   Кентавр, гном, лесной эльф, пегас, дендроид, единорог, зелёный дракон —
   и их улучшения. Каждое существо — функция с параметрами; улучшение — тот же
   рисунок в другой гамме и с новой деталью (доспех, рога, вторая стрела…).
   Координаты — дизайн-единицы (10 на клетку), существо смотрит вправо.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, lerp, leaf, weapon, shield, helm, head, arm, leg, torso, wing, horse, fit, frameOf, mapShapes, tone, H } = K;
  const SKIN = '#e8b890', GOLD = '#d8a53a', LEATHER = '#5a3a22';

  /* ---------- общие помощники ---------- */
  /** Вписать свои части (канон с землёй ground и высотой height) в рамку старого спрайта name. */
  function place(name, parts, ground, height, size) {
    const to = frameOf(name) || { w: 200, h: 250, anchor: [100, ground[1]] };
    return fit(parts, { ground, height }, to, to.anchor[1] / height * (size || 1));
  }
  /** Заострённое ухо эльфа/кентавра: основание у виска, кончик назад-вверх. */
  function pointyEar(cx, cy, r, skin) {
    return { p: [[cx - r * 0.2, cy - r * 0.1], P(cx - r * 1.05, cy - r * 0.75, 1), [cx - r * 0.62, cy + r * 0.05], [cx - r * 0.3, cy + r * 0.42]], c: skin, m: 'skin', line: 0.7,
      lines: [{ p: [[cx - r * 0.35, cy + r * 0.1], [cx - r * 0.78, cy - r * 0.48]], w: 1, a: 0.45 }] };
  }
  /** Колчан за спиной со стрелами (канон гуманоида). */
  function quiver(x, y, c, fl) {
    const out = [{ p: tube([[x + 8, y, 16], [x, y + 66, 14]]), c, m: 'leather', lines: [{ p: [[x + 1, y + 14], [x + 12, y + 16]], w: 1, a: 0.6 }] }];
    for (let i = 0; i < 4; i++) out.push({ p: [[x + 2 + i * 4, y - 2], P(x - 2 + i * 4, y - 16, 1), [x + 6 + i * 4, y - 12], [x + 8 + i * 4, y]], c: fl, m: 'feather', texSize: 0.35, line: 0.6 });
    return out;
  }

  /* ================= Гном / боевой гном =================
     Коренастый: большая голова, рыжая борода до пояса, кольчуга, короткие толстые ноги, топор. */
  function dwarfAxe(hand, dir, len, o) {
    const [dx, dy] = norm(dir[0], dir[1]), at = (t, w) => [hand[0] + dx * t - dy * w, hand[1] + dy * t + dx * w], E = len, hd = o.head;
    const out = [{ p: tube([[...at(-o.back, 0), 6.5], [...at(E + 6, 0), 5.5]]), c: o.shaft || '#6a4424', m: 'wood', flow: Math.atan2(dy, dx), line: 0.8,
      lines: [{ p: [at(-6, -3), at(-2, 3)], w: 1.4, c: '#3a2414', a: 0.8 }, { p: [at(2, -3), at(6, 3)], w: 1.4, c: '#3a2414', a: 0.8 }] }];
    const blade = s => ({ p: [P(...at(E - 26, 3 * s), 1), P(...at(E - 40, 22 * s)), P(...at(E - 34, 40 * s), 1), P(...at(E - 8, 34 * s)), P(...at(E + 14, 40 * s), 1), P(...at(E + 16, 24 * s)), P(...at(E + 4, 3 * s), 1)],
      c: hd, m: 'steel', gloss: 1.1, lines: [{ p: [at(E - 32, 36 * s), at(E - 10, 30 * s), at(E + 12, 36 * s)], w: 1.4, light: true, a: 0.85 }] });
    out.push(blade(1));
    if (o.double) out.push(blade(-1));
    out.push({ p: [P(...at(E - 28, -7), 1), P(...at(E + 6, -7), 1), P(...at(E + 6, 7), 1), P(...at(E - 28, 7), 1)], c: o.socket || tone(hd, -0.2), m: 'steel', glint: [[...at(E - 20, -3), 2.5]] });
    out.push({ p: [P(...at(E + 4, -3), 1), P(...at(E + 18, 0), 1), P(...at(E + 4, 3), 1)], c: hd, m: 'steel' });
    return out;
  }
  function dwarf(name, o) {
    const hx = 114, hy = 72, hr = 30;
    const legFn = (hip, foot, side) => leg(hip, foot, { style: 'hose', c: side < 0 ? tone(o.hose, -0.2) : o.hose, boot: o.boot, tw: 34, toe: 14, bend: 4 });
    const parts = [
      { kind: 'leg', side: -1, pivot: [86, 192], shapes: legFn([86, 196], [82, 246], -1) },
      { kind: 'leg', side: 1, pivot: [122, 192], shapes: legFn([122, 196], [124, 246], 1) },
      { kind: 'torso', pivot: [104, 170], shapes: [
        ...(o.shield ? shield.round(70, 150, 30, { rim: o.trim, field: o.shield, fieldM: 'steel', bossC: o.trim }) : []),
        ...arm([76, 116], [64, 146], [72, 170], { c: o.mail, m: 'mail', hand: SKIN, w: 22 }),
        { p: [[62, 116], [86, 100], [136, 100], [158, 118], [160, 150], [154, 178], [162, 208, 1], [132, 204], [108, 208], [84, 204], [56, 208, 1], [64, 178], [58, 148]], c: o.mail, m: 'mail', belly: 0.3,
          sub: [{ p: [[50, 198], [170, 198], [170, 212], [50, 212]], c: o.trim, m: 'gold', line: 0 }] },
        { p: [[74, 104], [150, 104], [152, 170], [74, 170]], c: o.tunic, m: o.tunicM || 'leather', lines: [{ p: [[112, 106], [112, 168]], w: 1.2, a: 0.4 }] },
        ...(o.plate ? [{ p: [[80, 110], [146, 108], [150, 146], [112, 166], [78, 146]], c: o.plate, m: 'steel', lines: [{ p: [[112, 112], [112, 160]], w: 1.2, light: true, a: 0.6 }] }] : []),
        { p: [[60, 166], [158, 166], [159, 182], [59, 182]], c: LEATHER, m: 'leather', sub: [{ p: [P(98, 163, 1), P(122, 163, 1), P(122, 185, 1), P(98, 185, 1)], c: GOLD, m: 'gold', glint: [[103, 168, 3]], line: 0.7 }] },
      ] },
      { kind: 'head', pivot: [108, 100], shapes: [
        ...head(hx, hy, hr, { skin: SKIN, hair: o.beard, hairStyle: 'short', browC: o.beard }),
        { p: [[hx - hr * 0.3, hy + hr * 0.3], [hx + hr * 0.3, hy + hr * 0.6], [hx + hr * 1.12, hy + hr * 0.45], [hx + hr * 1.08, hy + hr * 1.0], [hx + hr * 0.9, hy + hr * 2.0], P(hx + hr * 0.45, hy + hr * 3.0, 1), [hx + hr * 0.05, hy + hr * 2.2], [hx - hr * 0.3, hy + hr * 1.6], [hx - hr * 0.55, hy + hr * 0.8]],
          c: o.beard, m: 'fur', furLen: 1.3, flow: Math.PI * 0.5, dens: 1.2, id: 'beard',
          lines: [{ p: [[hx + hr * 0.2, hy + hr * 0.9], [hx + hr * 0.35, hy + hr * 2.3]], w: 1.2, a: 0.5 }, { p: [[hx + hr * 0.7, hy + hr * 0.9], [hx + hr * 0.55, hy + hr * 2.1]], w: 1.2, light: true, a: 0.5 }] },
        ...(o.rings ? [{ p: [P(hx + hr * 0.25, hy + hr * 1.9, 1), P(hx + hr * 0.75, hy + hr * 1.9, 1), P(hx + hr * 0.72, hy + hr * 2.12, 1), P(hx + hr * 0.28, hy + hr * 2.12, 1)], c: GOLD, m: 'gold', glint: [[hx + hr * 0.4, hy + hr * 1.95, 2]] }] : []),
        // усы поверх бороды
        { p: [[hx + hr * 0.45, hy + hr * 0.52], [hx + hr * 1.1, hy + hr * 0.42], [hx + hr * 1.22, hy + hr * 0.78], [hx + hr * 0.92, hy + hr * 0.7], [hx + hr * 0.52, hy + hr * 0.82]], c: tone(o.beard, 0.12), m: 'fur', furLen: 0.6, flow: Math.PI * 0.15 },
        { e: [hx + hr * 1.04, hy + hr * 0.24, hr * 0.2, hr * 0.18], c: '#e8a080', m: 'skin', line: 0.7 },
        // шлем-шишак с наносником и ободом
        { p: [[hx - hr * 1.04, hy - hr * 0.3], [hx - hr * 0.92, hy - hr * 0.95], [hx - hr * 0.2, hy - hr * 1.38], [hx + hr * 0.6, hy - hr * 1.2], [hx + hr * 1.02, hy - hr * 0.55], P(hx + hr * 1.04, hy - hr * 0.34, 1), P(hx - hr * 1.04, hy - hr * 0.26, 1)], c: o.helm, m: 'steel',
          glint: [[hx - hr * 0.25, hy - hr * 0.85, 4]], lines: [{ p: [[hx - hr * 0.15, hy - hr * 1.18], [hx + hr * 0.1, hy - hr * 0.2]], w: 1.4, light: true, a: 0.6 }] },
        { p: [P(hx - hr * 1.1, hy - hr * 0.5, 1), P(hx + hr * 1.08, hy - hr * 0.56, 1), P(hx + hr * 1.1, hy - hr * 0.3, 1), P(hx - hr * 1.1, hy - hr * 0.22, 1)], c: o.trim, m: 'gold', line: 0.7 },
        ...(o.horns ? [
          { p: tube([[hx - hr * 0.7, hy - hr * 0.55, 13], [hx - hr * 1.35, hy - hr * 0.95, 10], [hx - hr * 1.55, hy - hr * 1.7, 6], [hx - hr * 1.3, hy - hr * 2.2, 2]]), c: '#ece0c0', m: 'horn', lines: [{ p: [[hx - hr * 1.1, hy - hr * 0.72], [hx - hr * 1.2, hy - hr * 1.0]], w: 1, a: 0.5 }] },
          { p: tube([[hx + hr * 0.3, hy - hr * 0.9, 12], [hx + hr * 0.7, hy - hr * 1.5, 9], [hx + hr * 0.6, hy - hr * 2.15, 5], [hx + hr * 0.3, hy - hr * 2.5, 2]]), c: '#f4ead0', m: 'horn' },
        ] : [{ p: [P(hx - hr * 0.3, hy - hr * 1.15, 1), P(hx - hr * 0.1, hy - hr * 1.45, 1), P(hx + hr * 0.1, hy - hr * 1.12, 1)], c: o.helm, m: 'steel' }]),
      ] },
      { kind: 'prop', pivot: [138, 116], shapes: [
        ...dwarfAxe([166, 152], [0.12, -1], 100, { head: o.axe, back: 64, double: o.double, socket: o.trim }),
        ...arm([138, 116], [154, 142], [166, 152], { c: o.mail, m: 'mail', hand: SKIN, w: 22 }),
        { p: [[124, 106], [140, 100], [156, 106], [158, 120], [146, 126], [128, 122]], c: o.pad, m: 'steel', glint: [[138, 106, 3.5]], lines: [{ p: [[128, 116], [156, 114]], w: 1.2, a: 0.5 }] },
      ] },
    ];
    V.def(name, place(name, parts, [104, 246], 246, 1.04));
  }
  dwarf('dwarf', { hose: '#6a4a2e', boot: '#3a2616', mail: '#8d96a0', tunic: '#7a5634', trim: '#b88a3a', beard: '#d0622a', helm: '#b7c0ca', pad: '#9aa3ad', axe: '#c8d0da' });
  dwarf('battle_dwarf', { hose: '#34406a', boot: '#2a2018', mail: '#6c7c94', tunic: '#2c4a8a', tunicM: 'cloth', trim: '#e0b040', beard: '#e0782e', helm: '#5a88c8', pad: '#5a88c8', axe: '#9cc8f0',
    plate: '#6a94cc', horns: true, double: true, rings: true, shield: '#2c4a8a' });

  /* ================= Лесной эльф / великий эльф =================
     Стройный лучник с натянутым луком, острые уши, колчан за спиной. */
  /** Натянутый длинный лук: кисть держит рукоять grip, тетива уходит углом к точке натяжения draw. */
  function longbow(grip, S, draw, o) {
    const g = grip, top = [g[0] - 14, g[1] - S], bot = [g[0] - 10, g[1] + S];
    return [
      { p: [[top[0], top[1]], [draw[0], draw[1] - 1], [bot[0], bot[1]], [bot[0] + 1, bot[1]], [draw[0] + 1, draw[1] + 1], [top[0] + 1, top[1]]], c: '#f0ead8', m: 'flat', line: 0, ten: 0 },
      { p: tube([[top[0] - 2, top[1] - 4, 3], [g[0] - 2, g[1] - S * 0.62, 5.5], [g[0] + 3, g[1], 7], [g[0], g[1] + S * 0.62, 5.5], [bot[0] - 2, bot[1] + 4, 3]]), c: o.bow, m: 'wood', gloss: 0.5, flow: -Math.PI / 2 },
      { p: [P(top[0] - 5, top[1] - 2, 1), P(top[0] - 8, top[1] - 12, 1), P(top[0] + 1, top[1] - 5, 1)], c: o.bowTip || tone(o.bow, 0.3), m: 'horn', line: 0.6 },
      { p: [P(bot[0] - 5, bot[1] + 2, 1), P(bot[0] - 8, bot[1] + 12, 1), P(bot[0] + 1, bot[1] + 5, 1)], c: o.bowTip || tone(o.bow, 0.3), m: 'horn', line: 0.6 },
      { p: tube([[g[0] + 3, g[1] - 8, 8], [g[0] + 3, g[1] + 8, 8]]), c: LEATHER, m: 'leather', line: 0.7 },
    ];
  }
  function elf(name, o) {
    const hx = H.headX + 2, hy = H.headY - 4, hr = 21, bowH = [168, 100];
    const arrows = o.two ? [-4, 4] : [0];
    const parts = [];
    const legFn = (hip, foot, side) => leg(hip, foot, { style: 'hose', c: side < 0 ? tone(o.hose, -0.2) : o.hose, boot: o.boot, tw: 21, toe: 13 });
    parts.push({ kind: 'leg', side: -1, pivot: [H.backHip, H.hipY], shapes: legFn([H.backHip, H.hipY], [H.backFoot - 4, H.G], -1) });
    parts.push({ kind: 'leg', side: 1, pivot: [H.frontHip, H.hipY], shapes: legFn([H.frontHip, H.hipY], [H.frontFoot + 6, H.G], 1) });
    parts.push({ kind: 'torso', pivot: [H.cx, H.waistY], shapes: [
      // плащ за спиной
      { p: [[74, 82], [96, 80], [90, 140], [72, 200], [46, 214, 1], [52, 188], [40, 176, 1], [58, 130]], c: o.cape, m: 'cloth', belly: 0.35, lines: [{ p: [[72, 100], [58, 190]], w: 1.1, a: 0.4 }] },
      ...quiver(66, 70, o.quiver, o.fletch),
      // дальняя рука тянет тетиву к щеке
      ...arm([80, 92], [94, 104], [122, 86], { c: o.sleeve, hand: SKIN, w: 13, fore: o.bracer, foreM: 'leather' }),
      ...torso({ c: o.tunic, skirt: o.tunic, skirtLen: 190, belt: o.belt, buckle: o.buckle, chestLines: [{ p: [[88, 84], [122, 140]], w: 3, c: LEATHER, a: 0.9 }] }),
      // зубчатый подол-листья
      { p: [[70, 176], [134, 176], [136, 196, 1], [126, 188], [118, 200, 1], [108, 190], [98, 202, 1], [88, 190], [78, 200, 1], [70, 190]], c: o.hem, m: 'cloth', line: 0.8 },
    ] });
    const hair = o.hairLong
      ? [{ p: [[hx - hr * 1.1, hy - hr * 0.5], [hx + hr * 0.1, hy - hr * 1.15], [hx + hr * 0.2, hy - hr * 0.2], [hx - hr * 0.3, hy + hr * 2.1], [hx - hr * 1.25, hy + hr * 2.0]], c: o.hair, m: 'fur', furLen: 1.3, flow: Math.PI * 0.55 }] : [];
    parts.push({ kind: 'head', pivot: [H.headX - 4, H.neckY], shapes: [
      ...hair,
      ...head(hx, hy, hr, { skin: SKIN, hair: o.hair, hairStyle: 'short', ear: false }),
      pointyEar(hx - 2, hy + 2, hr, SKIN),
      ...(o.hood ? helm.hood(hx, hy, hr, { c: o.hood }) : []),
      ...(o.circlet ? [{ p: tube([[hx - hr * 0.95, hy - hr * 0.45, 3.6], [hx, hy - hr * 0.72, 3.6], [hx + hr * 0.9, hy - hr * 0.5, 3.6]]), c: o.circlet, m: 'gold', line: 0.6 },
        { p: [P(hx + hr * 0.1, hy - hr * 0.7, 1), P(hx + hr * 0.3, hy - hr * 1.2, 1), P(hx + hr * 0.5, hy - hr * 0.64, 1)], c: '#6ad06a', m: 'gem', glint: [[hx + hr * 0.3, hy - hr * 0.8, 2]] }] : []),
    ] });
    const arm2 = [
      ...longbow(bowH, 66, [122, 88], o),
      ...arrows.map(d => ({ p: [[120, 87 + d], [190, 89 + d], [190, 91 + d], [120, 89 + d]], c: '#d8ccb0', m: 'flat', line: 0 })),
      ...arrows.map(d => ({ p: [P(188, 85 + d, 1), P(201, 90 + d, 1), P(188, 95 + d, 1)], c: o.tip || '#b7c0ca', m: 'steel', line: 0.6 })),
      ...arrows.map(d => ({ p: [P(118, 85 + d, 1), P(132, 87 + d), P(128, 91 + d, 1), P(114, 91 + d)], c: o.fletch, m: 'feather', texSize: 0.3, line: 0.5 })),
      ...arm([124, 90], [146, 96], bowH, { c: o.sleeve, hand: SKIN, w: 13, fore: o.bracer, foreM: 'leather' }),
    ];
    parts.push({ kind: 'prop', pivot: [H.frontSh, H.shY], shapes: arm2 });
    V.def(name, place(name, parts, [H.cx, H.G], 246, 1.0));
  }
  elf('wood_elf', { hose: '#4a6a2a', boot: '#5a3a22', tunic: '#4f8a36', hem: '#3e7a2c', cape: '#2e5e2a', sleeve: '#5a9a3e', bracer: '#6a4424', belt: '#5a3a22',
    hair: '#8a4a22', hood: '#3a7430', bow: '#8a5a2a', quiver: '#6a4424', fletch: '#e8e0d0' });
  elf('grand_elf', { hose: '#4a2a6a', boot: '#d8a53a', tunic: '#f0ece0', hem: '#6a3a9a', cape: '#5a2e8a', sleeve: '#e8e2d2', bracer: '#c8963a', belt: '#6a3a9a', buckle: '#f0d060',
    hair: '#f0d070', hairLong: true, circlet: '#e8c050', bow: '#e0b040', quiver: '#6a3a9a', fletch: '#f0d060', tip: '#f0d890', two: true });

  /* ================= Кентавр / капитан кентавров =================
     Конское тело из K.horse без шеи и головы; на месте шеи — торс, голова и рука человека. */
  function centaur(name, o) {
    const h = horse({ coat: o.coat, mane: o.tail, hoof: '#2a1e16', bridle: false });
    const k = 1.12, fC = (x, y) => [234 + (x - 100) * k, 118 + (y - 146) * k], R = list => mapShapes(list, fC, k);
    // конский корпус с холкой, поднятой к поясу человека (вместо шеи коня)
    const body = { p: [[72, 150], [96, 132], [150, 134], [184, 128], [204, 116], [214, 100], [252, 98], [264, 120], [266, 160], [256, 196], [232, 212], [190, 214], [140, 212], [104, 210], [80, 196], [68, 172]],
      c: o.coat, m: 'fur', furLen: 0.45, dens: 0.6, belly: 0.4,
      lines: [{ p: [[92, 150], [110, 176], [106, 200]], w: 1.2, a: 0.35 }, { p: [[240, 150], [246, 180], [238, 200]], w: 1.2, a: 0.35 }, { p: [[100, 138], [150, 136], [194, 126]], w: 1.4, light: true, a: 0.35 }] };
    // пояс на стыке человека и коня
    const sash = { p: [[68, 138], [136, 136], [138, 147], [68, 150]], c: o.sash, m: o.sashM || 'leather', line: 0.8,
      sub: [{ p: [P(96, 134, 1), P(110, 134, 1), P(110, 152, 1), P(96, 152, 1)], c: o.trim, m: 'gold', glint: [[100, 138, 2.5]] }] };
    const human = [
      ...(o.cape ? [{ p: [[74, 84], [100, 80], [96, 130], [80, 170], [54, 160], [62, 120]], c: o.cape, m: 'cloth', belly: 0.3 }] : []),
      ...arm([80, 90], [70, 118], [84, 138], { c: SKIN, m: 'skin', hand: SKIN, w: 16, fore: o.bracer, foreM: 'leather' }),
      { p: [[74, 82], [126, 80], [138, 94], [136, 122], [128, 150], [76, 150], [68, 122], [64, 96]], c: SKIN, m: 'skin', lines: [{ p: [[100, 100], [106, 116], [118, 114]], w: 1.1, a: 0.35 }, { p: [[104, 124], [104, 146]], w: 1, a: 0.3 }] },
      { p: [[70, 84], [98, 82], [96, 150], [72, 150], [66, 120]], c: o.vest, m: o.vestM || 'leather', lines: [{ p: [[92, 86], [90, 148]], w: 1.2, light: true, a: 0.4 }] },
      { p: [[112, 82], [128, 80], [138, 96], [134, 124], [126, 150], [110, 150], [114, 110]], c: o.vest, m: o.vestM || 'leather' },
      ...(o.plate ? [{ p: [[82, 86], [124, 86], [134, 104], [128, 132], [104, 142], [80, 132], [72, 106]], c: o.plate, m: 'steel', lines: [{ p: [[104, 90], [106, 138]], w: 1.2, light: true, a: 0.6 }] }] : []),
      { p: tube([[H.headX - 4, 70, 17], [H.headX - 6, 86, 20]]), c: SKIN, m: 'skin' },
      sash,
    ];
    const hx = H.headX, hy = H.headY, hr = H.headR;
    const face = [
      ...head(hx, hy, hr, { skin: SKIN, hair: o.hair, hairStyle: 'long', beard: o.beard, beardLen: 1.6, ear: false }),
      pointyEar(hx - 2, hy + 2, hr, SKIN),
      ...(o.helm ? [...helm.kettle(hx, hy, hr, { c: o.helm }),
        { p: [[hx - 6, hy - 26], [hx - 22, hy - 50], [hx - 40, hy - 46], [hx - 24, hy - 22]], c: o.plume, m: 'fur', furLen: 1.3, flow: Math.PI }]
        : [{ p: tube([[hx - hr * 0.95, hy - hr * 0.5, 4], [hx, hy - hr * 0.78, 4], [hx + hr * 0.9, hy - hr * 0.55, 4]]), c: o.band, m: 'leather', line: 0.6 },
          ...[0, 1, 2].map(i => ({ p: leaf([hx - hr * 0.5 + i * hr * 0.5, hy - hr * 0.72], -Math.PI * (0.62 - i * 0.12), 16, 8).body, c: '#5aa040', m: 'leather', line: 0.6 }))]),
    ];
    const hand = [150, 126];
    const spear = [
      ...weapon.polearm(hand, [0.2, -1], 128, { kind: o.kind, back: 70, head: o.tip, ribbon: o.ribbon }),
      ...arm([126, 90], [144, 114], hand, { c: SKIN, m: 'skin', hand: SKIN, w: 16, fore: o.bracer, foreM: 'leather' }),
      ...(o.plate ? [{ e: [126, 94, 16, 14], c: o.plate, m: 'steel', glint: [[120, 88, 4]] }] : [{ e: [124, 92, 11, 10], c: SKIN, m: 'skin', line: 0.6 }]),
    ];
    const parts = [h.legs[0], h.legs[1], h.legs[2], h.legs[3],
      { kind: 'torso', pivot: [170, 168], shapes: [h.body[0], body, ...R(human)] },
      { kind: 'head', pivot: fC(H.headX - 4, H.neckY), shapes: R(face) },
      { kind: 'prop', pivot: fC(H.frontSh, H.shY), shapes: R(spear) }];
    V.def(name, place(name, parts, [165, 282], 282, 0.96));
  }
  centaur('centaur', { coat: '#9a6a3a', tail: '#4a2e1a', vest: '#4f8a36', bracer: '#6a4424', sash: '#6a4424', trim: '#b88a3a', hair: '#6a3c1c', beard: '#6a3c1c', band: '#6a4424', kind: 'spear' });
  centaur('centaur_captain', { coat: '#5a5a62', tail: '#1e1e24', vest: '#a82a2a', vestM: 'cloth', bracer: '#b7c0ca', sash: '#a82a2a', sashM: 'cloth', trim: '#e0b040', hair: '#2a2a2e', beard: '#2a2a2e',
    helm: '#c8d0da', plume: '#c83030', plate: '#b7c0ca', cape: '#8a2020', kind: 'glaive', tip: '#dde4ec' });

  /* ================= Пегас / серебряный пегас =================
     Конь из K.horse и два перьевых крыла от холки: дальнее — за всем телом, ближнее — поверх. */
  function horseParts(h, headExtra, bodyExtra) {
    return [h.legs[0], h.legs[1], h.legs[2], h.legs[3],
      { kind: 'torso', pivot: [160, 170], shapes: h.body.concat(bodyExtra || []) },
      { kind: 'head', pivot: [236, 150], shapes: h.head.concat(headExtra || []) }];
  }
  function pegasus(name, o) {
    const h = horse({ coat: o.coat, mane: o.mane, hoof: o.hoof, bridle: o.bridle, chanfron: o.chanfron, dark: o.dark, m: 'skin' });
    const W = { pri: o.pri, pri2: tone(o.pri, 0.12), sec: o.sec, sec2: tone(o.sec, -0.05), cov: o.cov, cov2: o.cov2 || tone(o.cov, 0.12) };
    const Wf = { pri: tone(o.pri, -0.25), pri2: tone(o.pri, -0.18), sec: tone(o.sec, -0.25), sec2: tone(o.sec, -0.3), cov: tone(o.cov, -0.22), cov2: tone(o.cov2 || o.cov, -0.16) };
    const extra = [];
    const parts = horseParts(h, extra);
    parts.unshift({ kind: 'prop', pivot: [210, 136], shapes: wing.feather([210, 136], [-0.42, -1], 128, Wf) });
    parts.push({ kind: 'prop', pivot: [196, 142], shapes: wing.feather([196, 142], [-0.9, -0.64], 146, W) });
    V.def(name, place(name, parts, [165, 282], 282, 1.0));
  }
  pegasus('pegasus', { coat: '#eceae4', dark: '#c4c2bc', mane: '#f2eee2', hoof: '#6a5a4a', bridle: '#d8a53a', pri: '#c4cad4', sec: '#eceef0', cov: '#fbfaf6', cov2: '#f4f6fa' });
  pegasus('silver_pegasus', { coat: '#aebccc', dark: '#7e8c9e', mane: '#2c4a8a', hoof: '#2a2e38', bridle: '#2c4a8a', chanfron: '#dde4ec', pri: '#4a6a9a', sec: '#c8d4e2', cov: '#e4ecf4', cov2: '#dfe8f2' });

  /* ================= Единорог / боевой единорог =================
     Конь-существо с витым рогом, длинной гривой, козлиной бородкой и щётками над копытами. */
  function unicorn(name, o) {
    const h = horse({ coat: o.coat, mane: o.mane, hoof: o.hoof, dark: o.dark, m: 'skin', bridle: o.bridle || false, blanket: o.blanket, blanketTrim: o.trim, chanfron: o.chanfron });
    const hornPts = [[292, 64, 11], [304, 38, 8], [316, 14, 5], [326, -8, 1.5]];
    const extra = [
      { p: [[270, 50], [262, 72], [246, 100], [232, 130], [222, 160], [206, 174, 1], [208, 152], [194, 150, 1], [204, 124], [192, 116, 1], [212, 92], [206, 82, 1], [230, 64], [250, 48]], c: o.mane, m: 'fur', furLen: 1.5, flow: Math.PI * 0.62,
        lines: [{ p: [[258, 58], [236, 96], [218, 140]], w: 1.2, light: true, a: 0.5 }, { p: [[240, 66], [218, 104], [206, 140]], w: 1.1, a: 0.4 }] },
      { p: [[276, 50], [292, 44], [300, 58], [298, 76], [286, 70]], c: o.mane, m: 'fur', furLen: 0.9, flow: Math.PI * 0.3 },
      { p: tube(hornPts), c: o.horn, m: 'horn', gloss: 1.3, lo: 0.3, ao: 0.2, line: 0.8, lc: '#8a6a2a',
        lines: [0.16, 0.32, 0.48, 0.64, 0.8].map(t => { const a = lerp([292, 64], [326, -8], t), r = 6 - t * 5; return { p: [[a[0] - r, a[1] + 1], [a[0] + r, a[1] - 4]], w: 1.1, a: 0.5 }; }),
        glint: [[302, 36, 3]] },
    ];
    h.body[0] = { p: [[72, 142], [52, 150], [36, 172], [28, 206], [34, 238], [24, 250, 1], [40, 246], [44, 256, 1], [52, 240], [48, 206], [58, 176], [76, 160]], c: o.mane, m: 'fur', furLen: 1.6, flow: Math.PI * 0.5, id: 'tail' };
    const parts = horseParts(h, extra);
    V.def(name, place(name, parts, [165, 282], 282, 1.0));
  }
  unicorn('unicorn', { coat: '#f4f2ee', dark: '#cfccc6', mane: '#c8d8f0', hoof: '#c8a050', horn: '#fbeab0', spiral: '#c8962e' });
  unicorn('war_unicorn', { coat: '#bcd4ec', dark: '#8aa2bc', mane: '#f4f0e0', hoof: '#8a6a2a', horn: '#fbeab0', spiral: '#c8962e', blanket: '#3a7a34', trim: '#e0b040', chanfron: '#d8dee6', bridle: '#8a5a2a' });

  /* ================= Дендроид-страж / дендроид-солдат =================
     Живое дерево: ствол-корпус с лицом, ветви-руки, корни-ноги, крона-голова. Канон: земля y=330, центр x=150. */
  /** Ветвь-рука: трубка коры по точкам [x, y, толщина] и растопыренные пальцы-сучья в конце. */
  function branchArm(pts, o, fingers) {
    const end = pts[pts.length - 1], out = [{ p: tube(pts), c: o.bark, m: 'wood', flow: Math.atan2(end[1] - pts[0][1], end[0] - pts[0][0]), line: 0.9,
      lines: [{ p: pts.slice(0, -1).map(q => [q[0] + 2, q[1] - 2]), w: 1.2, a: 0.45 }] }];
    for (const f of fingers) out.push({ p: tube([[end[0], end[1], 7], [end[0] + f[0] * 0.55, end[1] + f[1] * 0.55, 5], [end[0] + f[0], end[1] + f[1], 1.6]]), c: o.claw, m: 'wood', line: 0.8 });
    if (o.thorns) for (let i = 1; i < pts.length - 1; i++) { const q = pts[i]; out.push({ p: [P(q[0] - 4, q[1] - q[2] * 0.4, 1), P(q[0] + 2, q[1] - q[2] * 0.5 - 12, 1), P(q[0] + 5, q[1] - q[2] * 0.4, 1)], c: o.thorn, m: 'horn', line: 0.6 }); }
    return out;
  }
  /** Клок листвы: пятно с фактурой листьев и россыпью отдельных листьев по краю. */
  function foliage(cx, cy, rx, ry, c, n, seed) {
    // контур-облако: выпуклые «шапки» листвы, между ними острые впадины
    const cloud = [], nb = 9;
    for (let i = 0; i < nb; i++) {
      const a0 = (i / nb) * Math.PI * 2 + seed, a1 = a0 + Math.PI / nb, k = 0.93 + ((seed * 7 + i * 3) % 5) * 0.035;
      cloud.push(P(cx + Math.cos(a0) * rx * 0.84, cy + Math.sin(a0) * ry * 0.84, 1), [cx + Math.cos(a1) * rx * k, cy + Math.sin(a1) * ry * k]);
    }
    const out = [{ p: cloud, c, m: 'feather', texSize: 0.75, flow: -Math.PI / 2, belly: 0.35, line: 0.8 }];
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (1.05 + (i + 0.5) / n * 0.9) + Math.sin(seed + i * 2.3) * 0.12, B = [cx + Math.cos(a) * rx * 0.86, cy + Math.sin(a) * ry * 0.86];
      out.push({ p: leaf(B, a, 16 + ((seed + i) % 3) * 3, 10).body, c: tone(c, (i % 3 - 1) * 0.12), m: 'leather', line: 0.6 });
    }
    return out;
  }
  function dendroid(name, o) {
    const L = o.leaves, parts = [];
    const rootLeg = (hip, knee, foot, c) => [
      { p: tube([[hip[0], hip[1], 34], [knee[0], knee[1], 28], [foot[0], foot[1] - 10, 24]], { flat0: true }), c, m: 'wood', flow: Math.PI / 2, line: 0.9 },
      ...[[-22, 2], [-10, 6], [14, 5], [26, 1]].map(t => ({ p: tube([[foot[0], foot[1] - 10, 14], [foot[0] + t[0] * 0.6, foot[1] - 4, 10], [foot[0] + t[0], foot[1] + t[1] - 2, 3]]), c: tone(c, -0.08), m: 'wood', line: 0.8 })),
    ];
    parts.push({ kind: 'leg', side: -1, pivot: [128, 262], shapes: rootLeg([128, 256], [118, 292], [112, 328], tone(o.bark, -0.2)) });
    parts.push({ kind: 'leg', side: 1, pivot: [172, 262], shapes: rootLeg([172, 256], [180, 294], [186, 330], o.bark) });
    const eye = (x, y) => [{ e: [x, y, 10, 8], c: '#1a1008', m: 'flat', line: 0 }, { e: [x + 1, y + 1, 6, 5], c: o.eye, m: 'gem', line: 0, glint: [[x - 1, y - 1, 2.6]] }];
    parts.push({ kind: 'torso', pivot: [150, 220], shapes: [
      ...branchArm([[116, 168, 30], [80, 184, 22], [58, 214, 16], [50, 238, 12]], Object.assign({}, o, { bark: tone(o.bark, -0.2) }), [[-16, 18], [-4, 24], [8, 20]]),
      ...foliage(98, 166, 26, 18, tone(L[0], -0.2), 4, 3),
      { p: [[112, 96], [188, 96], [196, 150], [202, 214], [206, 262], [196, 276, 1], [150, 270], [104, 276, 1], [96, 262], [102, 214], [106, 150]], c: o.bark, m: 'wood', flow: Math.PI / 2, belly: 0.3,
        lines: [{ p: [[124, 110], [120, 170], [124, 230], [118, 268]], w: 1.6, a: 0.6 }, { p: [[140, 196], [146, 240], [140, 270]], w: 1.4, a: 0.5 }, { p: [[180, 206], [186, 246], [190, 270]], w: 1.4, a: 0.5 },
          { p: [[112, 120], [110, 190], [116, 250]], w: 1.4, light: true, a: 0.35 }, { p: [[160, 110], [158, 140]], w: 1.2, a: 0.45 }],
        sub: o.moss ? [{ p: [[90, 250], [212, 244], [212, 290], [90, 290]], c: o.moss, m: 'fur', furLen: 0.5, flow: -Math.PI / 2, line: 0 }] : [] },
      // лицо: надбровный нарост, глаза-дупла с огнём, сучок-нос, рот-трещина
      { p: [[132, 146], [156, 140], [186, 144], [194, 152], [164, 150], [136, 156]], c: tone(o.bark, 0.1), m: 'wood', line: 0.8 },
      ...eye(150, 162), ...eye(178, 164),
      { p: [[170, 170], [190, 178], [194, 188, 1], [174, 186]], c: tone(o.bark, 0.08), m: 'wood', line: 0.8 },
      { p: [[146, 204], [164, 198], [186, 202], [180, 212], [156, 214]], c: '#140c06', m: 'flat', line: 0.8, lc: tone(o.bark, -0.5) },
    ] });
    // крона: большие клочья листвы; нижний край прячет верх ствола
    const crown = [
      ...foliage(76, 100, 52, 34, tone(L[0], -0.12), 5, 1),
      ...foliage(222, 96, 54, 36, tone(L[0], -0.05), 5, 2),
      ...foliage(150, 56, 72, 46, L[1], 7, 4),
      ...foliage(114, 106, 54, 28, L[0], 0, 5),
      ...foliage(190, 108, 52, 28, L[2], 0, 6),
      ...(o.berries || []).map(b => ({ e: [b[0], b[1], 5, 5], c: o.berry, m: 'gem', line: 0.6, glint: [[b[0] - 1.5, b[1] - 1.5, 1.8]] })),
    ];
    parts.push({ kind: 'head', pivot: [150, 118], shapes: crown });
    parts.push({ kind: 'prop', pivot: [196, 190], shapes: [
      ...branchArm([[190, 188, 30], [230, 198, 22], [254, 226, 16], [262, 248, 12]], o, [[-6, 22], [6, 24], [18, 16]]),
      ...foliage(218, 192, 18, 12, L[2], 3, 7),
    ] });
    V.def(name, place(name, parts, [150, 330], 330, 1.0));
  }
  dendroid('dendroid_guard', { bark: '#7a5432', claw: '#4a3220', eye: '#ffb030', leaves: ['#3e8a34', '#4ea83e', '#5cb84a'], moss: false });
  dendroid('dendroid_soldier', { bark: '#4a3424', claw: '#2a1c12', eye: '#ff3a1a', leaves: ['#7a8a2a', '#9aa436', '#c07a28'], thorns: true, thorn: '#d8c8a0',
    berry: '#d02a2a', berries: [[120, 44], [176, 36], [210, 74], [96, 84], [150, 80], [230, 100]] });

  /* ================= Зелёный дракон / золотой дракон =================
     Корпус — сглаженный контур, шея и хвост — трубки, крылья перепончатые, голова ящера.
     Канон: земля y=340, существо ~360 в длину. */
  function dragon(name, o) {
    const c = o.body, far = tone(c, -0.28), sk = { m: o.m || 'skin', tex: 'scale', texSize: 0.9 }, HK = 1.28;   // голова крупнее — читается в бою
    const claws = (x, y, cc) => [0, 1, 2].map(i => ({ p: [[x - 8 + i * 8, y - 8], P(x + 2 + i * 8, y - 6), P(x + 8 + i * 8, y + 1, 1), P(x - 4 + i * 8, y - 1, 1)], c: o.claw, m: 'horn', line: 0.6 }));
    const hind = (dx, dy, cc) => [
      { p: tube([[116 + dx, 212 + dy, 74], [152 + dx, 258 + dy, 48], [130 + dx, 300 + dy, 28], [138 + dx, 330 + dy, 22]], { flat0: true }), c: cc, ...sk, belly: 0.3 },
      { p: [[124 + dx, 322 + dy], [150 + dx, 322 + dy], [162 + dx, 332 + dy], P(164 + dx, 340 + dy, 1), P(120 + dx, 340 + dy, 1)], c: cc, ...sk },
      ...claws(158 + dx, 340 + dy, cc),
    ];
    const fore = (dx, dy, cc) => [
      { p: tube([[238 + dx, 214 + dy, 54], [230 + dx, 262 + dy, 34], [244 + dx, 302 + dy, 24], [250 + dx, 328 + dy, 20]], { flat0: true }), c: cc, ...sk, belly: 0.3 },
      { p: [[236 + dx, 322 + dy], [260 + dx, 322 + dy], [270 + dx, 332 + dy], P(272 + dx, 340 + dy, 1), P(232 + dx, 340 + dy, 1)], c: cc, ...sk },
      ...claws(266 + dx, 340 + dy, cc),
    ];
    const spikes = (pts, h, col) => pts.map((q, i) => ({ p: [P(q[0] - 7, q[1] + 3, 1), P(q[0] - 2 - h * 0.35, q[1] - h * (i % 2 ? 0.8 : 1), 1), P(q[0] + 7, q[1] + 2, 1)], c: col, m: 'horn', line: 0.6 }));
    const Wn = { mem: o.mem, bone: o.bone, claw: o.hornC }, Wf = { mem: tone(o.mem, -0.3), bone: tone(o.bone, -0.25), claw: o.hornC };
    const parts = [
      { kind: 'prop', pivot: [216, 176], shapes: wing.bat([216, 176], [-0.06, -1], 186, Wf) },
      { kind: 'leg', side: 1, pivot: [110, 216], shapes: hind(-16, -6, far) },
      { kind: 'leg', side: -1, pivot: [224, 218], shapes: fore(-18, -6, far) },
      { kind: 'leg', side: -1, pivot: [124, 220], shapes: hind(0, 0, c) },
      { kind: 'leg', side: 1, pivot: [240, 222], shapes: fore(0, 0, c) },
      { kind: 'torso', pivot: [176, 216], shapes: [
        { p: tube([[104, 206, 44], [66, 222, 34], [38, 250, 25], [22, 282, 17], [14, 312, 10], [20, 330, 6]]), c, ...sk, belly: 0.4,
          lines: [{ p: [[70, 234], [42, 262], [30, 300]], w: 1.3, light: true, a: 0.4 }] },
        { p: [P(20, 326, 1), P(4, 322), P(-4, 338, 1), P(14, 336), P(32, 344, 1), P(28, 330)], c: o.hornC, m: 'horn', line: 0.7 },
        ...spikes([[34, 262], [50, 238], [72, 220], [96, 192], [126, 172], [158, 164], [190, 162]], 18, o.spike),
        { p: [[76, 204], [100, 180], [150, 166], [196, 160], [236, 166], [266, 192], [272, 224], [258, 252], [214, 268], [160, 270], [114, 262], [84, 242]], c, ...sk, belly: 0.35,
          lines: [{ p: [[110, 190], [160, 178], [210, 174]], w: 1.6, light: true, a: 0.4 }],
          sub: [{ p: [[100, 244], [150, 242], [200, 240], [248, 220], [276, 218], [276, 280], [90, 280]], c: o.belly, m: 'horn', tex: false, line: 0,
            lines: [130, 160, 190, 220, 246].map(x => ({ p: [[x - 4, 244 - (x - 100) * 0.12], [x + 2, 272]], w: 1.2, a: 0.45 })) }] },
      ] },
      { kind: 'head', pivot: [246, 196], shapes: [
        // гребень по загривку шеи: шипы смотрят назад-вверх
        ...[[238, 176, 22], [252, 146, 21], [264, 120, 19], [276, 98, 16]].map(q => ({ p: [P(q[0] - 2, q[1] + 8, 1), P(q[0] - q[2] * 0.9, q[1] - q[2] * 0.2, 1), P(q[0] + 6, q[1] - 4, 1)], c: o.spike, m: 'horn', line: 0.6 })),
        { p: tube([[232, 206, 56], [254, 166, 42], [270, 130, 34], [288, 98, 30]]), c, ...sk,
          sub: [{ p: [[250, 214], [268, 176], [282, 140], [298, 108], [320, 120], [300, 220]], c: o.belly, m: 'horn', tex: false, line: 0,
            lines: [[262, 190], [272, 162], [282, 138], [292, 116]].map(q => ({ p: [[q[0] - 4, q[1] - 6], [q[0] + 14, q[1] + 4]], w: 1.1, a: 0.4 })) }] },
        ...mapShapes([
          ...(o.frill ? [{ p: [[270, 94], [256, 70, 1], [266, 80], [262, 54, 1], [276, 72], [278, 48, 1], [288, 70]], c: o.frill, m: 'skin', line: 0.7 }] : []),
          // рога назад
          { p: tube([[290, 72, 10], [276, 58, 7], [256, 50, 3]]), c: o.hornC, m: 'horn', line: 0.7 },
          ...(o.bigHorns ? [{ p: tube([[298, 68, 10], [292, 48, 7], [298, 28, 4], [308, 18, 1.5]]), c: o.hornC, m: 'horn', line: 0.7 }] : []),
          // нижняя челюсть приоткрыта
          { p: [[290, 100], [322, 104], [346, 104], [352, 110], [338, 116], [312, 118], [292, 112]], c: tone(c, -0.1), ...sk,
            sub: [{ p: [[300, 100], [350, 100], [350, 106], [300, 106]], c: '#8a2020', m: 'flat', line: 0 }] },
          ...[312, 324, 336].map(x => ({ p: [P(x, 105, 1), P(x + 3, 98, 1), P(x + 6, 105, 1)], c: '#f4eee0', m: 'flat', line: 0.4 })),
          { p: [[280, 76], [296, 62], [320, 64], [344, 76], [360, 88], [356, 98], [340, 100], [316, 101], [296, 104], [282, 96]], c, ...sk,
            lines: [{ p: [[300, 90], [340, 96]], w: 1.2, a: 0.5 }, { p: [[296, 66], [320, 68], [344, 78]], w: 1.2, light: true, a: 0.5 }] },
          ...[308, 322, 338, 350].map(x => ({ p: [P(x - 3, 99, 1), P(x, 107, 1), P(x + 3, 99, 1)], c: '#f4eee0', m: 'flat', line: 0.4 })),
          { p: [[296, 68], [314, 66], [320, 74], [304, 76]], c: tone(c, -0.3), m: 'skin', line: 0 },
          { e: [310, 78, 5.5, 4.2], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [311, 78, 1.4, 3.6], c: '#0c0806', m: 'flat', line: 0 }], glint: [[308, 76.5, 1.8]] },
          { e: [350, 84, 2.4, 1.6], c: '#140c08', m: 'flat', line: 0 },
          // щёчные шипы
          { p: [[284, 90], [266, 96, 1], [280, 100], [270, 108, 1], [290, 104]], c: o.spike, m: 'horn', line: 0.6 },
        ], (x, y) => [286 + (x - 286) * HK, 100 + (y - 100) * HK], HK),
      ] },
      { kind: 'prop', pivot: [198, 184], shapes: wing.bat([198, 184], [-0.42, -0.9], 200, Wn) },
    ];
    V.def(name, place(name, parts, [186, 340], 340, 1.0));
  }
  dragon('green_dragon', { body: '#3a8436', belly: '#d0da80', mem: '#86b450', bone: '#2e5e28', claw: '#e8dcb0', hornC: '#e8dcb0', spike: '#a8c860', eye: '#ffd040' });
  dragon('gold_dragon', { body: '#f0c850', m: 'gold', belly: '#fff0c8', mem: '#f4d070', bone: '#b07820', claw: '#f4ead0', hornC: '#f4ead0', spike: '#c8581e', eye: '#e82020', frill: '#c8581e', bigHorns: true });
})(typeof window !== 'undefined' ? window : globalThis);
