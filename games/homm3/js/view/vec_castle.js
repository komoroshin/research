/* ============================================================================
   view/vec_castle.js — Замок на рисованном конвейере.
   Мечник, крестоносец, грифоны — в vec_pilot.js (крестоносец и королевский грифон — здесь, как улучшения).
   Каждое существо — функция с параметрами; улучшение — тот же рисунок с другими красками и деталями.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, weapon, shield, helm, head, arm, leg, torso, robe, humanoid, wing, horse, mounted, fit, frameOf, mapShapes, tone, H } = K;
  const SKIN = '#e8b890', STEEL = '#b7c0ca';

  /* ---------- копейщик / алебардщик ---------- */
  function pikeman(name, o) {
    const hand = [146, 132], dir = [0.16, -1];
    V.def(name, humanoid({
      name,
      legs: { style: 'hose', c: o.hose, boot: '#4a3020' },
      back: [...arm([80, 90], [72, 120], [80, 146], { c: o.sleeve, hand: SKIN, w: 16 })],
      body: [...torso({ c: o.doublet, skirt: o.skirt, plate: o.plate, belt: '#5a3a22' }),
        { e: [80, 94, 14, 13], c: o.sleeve, m: 'cloth', lines: [{ p: [[70, 88], [82, 104]], w: 1.2, c: o.stripe, a: 0.9 }, { p: [[80, 82], [90, 104]], w: 1.2, c: o.stripe, a: 0.9 }] }],
      head: [...head(H.headX, H.headY, H.headR, { skin: SKIN, hair: '#6a4424', beard: o.beard }), ...helm.kettle(H.headX, H.headY, H.headR, { c: STEEL })],
      arm: [
        ...weapon.polearm(hand, dir, 136, { kind: o.kind, back: 90, ribbon: o.ribbon }),
        ...arm([126, 90], [140, 118], hand, { c: o.sleeve, hand: SKIN, w: 16 }),
        { e: [126, 94, 15, 14], c: o.sleeve, m: 'cloth', lines: [{ p: [[116, 88], [128, 106]], w: 1.2, c: o.stripe, a: 0.9 }, { p: [[126, 82], [136, 104]], w: 1.2, c: o.stripe, a: 0.9 }] },
      ],
    }));
  }
  pikeman('pikeman', { hose: '#5a6a8a', sleeve: '#b8322c', stripe: '#f0d060', doublet: '#8a2a24', skirt: '#8a2a24', plate: STEEL, kind: 'pike' });
  pikeman('halberdier', { hose: '#3a4a7a', sleeve: '#2c52b0', stripe: '#f0d060', doublet: '#1e3a80', skirt: '#1e3a80', plate: '#c8d0da', kind: 'halberd', beard: '#6a4424' });

  /* ---------- лучник / арбалетчик ---------- */
  function archer(name, o) {
    const q = [];   // колчан за спиной
    q.push({ p: tube([[70, 66, 16], [62, 132, 14]]), c: '#6a4424', m: 'leather', lines: [{ p: [[62, 80], [72, 82]], w: 1, a: 0.6 }] });
    for (let i = 0; i < 4; i++) q.push({ p: [[64 + i * 4, 64], [60 + i * 4, 50, 1], [68 + i * 4, 54], [70 + i * 4, 66]], c: '#e8e0d0', m: 'cloth', line: 0.6 });
    const armShapes = o.crossbow
      ? [...arm([126, 90], [136, 116], [152, 116], { c: o.sleeve, hand: SKIN, w: 15 }), ...weapon.crossbow([150, 112], [1, -0.05], 44, {})]
      : [...arm([126, 90], [148, 98], [168, 100], { c: o.sleeve, hand: SKIN, w: 15 }), ...weapon.bow([170, 100], [0.08, -1], 58, {}),
        { p: [[122, 98], [176, 99], [176, 101], [122, 100]], c: '#e0d6c0', m: 'flat', line: 0 }, { p: [P(176, 96, 1), P(186, 100, 1), P(176, 104, 1)], c: STEEL, m: 'steel', line: 0.6 }];
    V.def(name, humanoid({
      name,
      legs: { style: 'hose', c: o.hose, boot: '#5a3a22' },
      back: [...q, ...arm([80, 90], [74, 104], [112, 98], { c: o.sleeve, hand: SKIN, w: 15 })],
      body: torso({ c: o.tunic, skirt: o.tunic, belt: '#5a3a22', chestLines: [{ p: [[88, 84], [120, 138]], w: 3, c: '#5a3a22', a: 0.9 }] }),
      head: [...head(H.headX, H.headY, H.headR, { skin: SKIN, hair: o.hair || '#8a5a2a' }),
        ...(o.hat === 'hood' ? helm.hood(H.headX, H.headY, H.headR, { c: o.cap }) : [{ p: [[H.headX - 22, H.headY - 8], [H.headX - 8, H.headY - 30], [H.headX + 18, H.headY - 26], [H.headX + 30, H.headY - 12, 1], [H.headX - 20, H.headY - 4, 1]], c: o.cap, m: 'cloth' },
          { p: [[H.headX - 10, H.headY - 26], [H.headX - 30, H.headY - 44], [H.headX - 22, H.headY - 26]], c: o.feather || '#e8e0d0', m: 'feather', texSize: 0.4, line: 0.6 }])],
      arm: armShapes,
    }));
  }
  archer('archer', { hose: '#4a5a2a', sleeve: '#4a7a34', tunic: '#3e6a2c', cap: '#5a8a3a', feather: '#e8e0d0' });
  archer('marksman', { hose: '#3a3a5a', sleeve: '#a82a2a', tunic: '#7a1e1e', cap: '#2c3a70', feather: '#f0d060', crossbow: true, hair: '#4a2e18' });

  /* ---------- монах / фанатик ---------- */
  function monk(name, o) {
    V.def(name, humanoid({
      name, robe: true, feetC: '#5a3a22',
      back: arm([80, 90], [76, 122], [88, 146], { c: o.robe, hand: SKIN, w: 17 }),
      body: [...robe({ c: o.robe, belt: o.belt }), ...(o.stole ? [{ p: [[96, 84], [108, 84], [112, 236], [100, 236]], c: o.stole, m: 'cloth', line: 0.8 }] : [])],
      head: [...head(H.headX, H.headY, H.headR, { skin: SKIN, hairStyle: o.hood ? 'none' : 'bald', beard: o.beard, beardLen: 1.9 }), ...(o.hood ? helm.hood(H.headX, H.headY, H.headR, { c: o.hood }) : [])],
      arm: [...weapon.staff([150, 120], [0.1, -1], 90, { orb: o.orb, back: 110 }), ...arm([126, 90], [142, 112], [150, 122], { c: o.robe, hand: SKIN, w: 17 })],
    }));
  }
  monk('monk', { robe: '#7a5a38', belt: '#d8c090', beard: '#8a8a8a', orb: '#7ad0f0' });
  monk('zealot', { robe: '#e8e0cc', belt: '#b02a2a', stole: '#b02a2a', hood: '#b02a2a', orb: '#ffcc55', beard: '#cfcfcf' });

  /* ---------- кавалерист / чемпион ---------- */
  function cavalier(name, o) {
    V.def(name, mounted({
      name,
      horse: { coat: o.coat, mane: o.mane, barding: o.barding, bardTrim: o.trim, chanfron: STEEL, saddle: '#5a3a22' },
      leg: { c: STEEL, boot: '#9aa3ad', m: 'steel' },
      back: [{ p: [[70, 86], [96, 82], [92, 150], [60, 196], [40, 186], [56, 130]], c: o.cape, m: 'cloth', belly: 0.3 }],
      body: [...torso({ c: o.surcoat, skirt: false, plate: STEEL, belt: '#5a3a22' }), { e: [80, 94, 16, 14], c: STEEL, m: 'steel' }],
      head: [...head(H.headX, H.headY, H.headR, { skin: SKIN }), ...helm.great(H.headX, H.headY, H.headR, { c: STEEL }),
        { p: [[H.headX - 6, H.headY - 22], [H.headX - 20, H.headY - 44], [H.headX - 36, H.headY - 40], [H.headX - 22, H.headY - 20]], c: o.plume, m: 'fur', furLen: 1.3, flow: Math.PI }],
      arm: [...weapon.polearm([140, 128], [1, -0.18], 150, { kind: 'lance', back: 50, stripe: o.stripe, lanceC: o.lance }),
        ...arm([126, 90], [132, 118], [140, 128], { c: STEEL, m: 'steel', hand: '#8a939e', handM: 'steel', w: 17 }), { e: [128, 94, 16, 14], c: STEEL, m: 'steel', glint: [[122, 88, 4]] }],
    }));
  }
  cavalier('cavalier', { coat: '#e8e2d6', mane: '#8a7a6a', barding: '#2c52b0', trim: '#d8a53a', cape: '#2c52b0', surcoat: '#2c52b0', plume: '#e8e0d0', stripe: '#2c52b0', lance: '#e8e0c8' });
  cavalier('champion', { coat: '#3a2a22', mane: '#1a1210', barding: '#b02a2a', trim: '#e8c050', cape: '#b02a2a', surcoat: '#b02a2a', plume: '#f0d060', stripe: '#d8a53a', lance: '#f0e8d0' });

  /* ---------- ангел / архангел ---------- */
  function angel(name, o) {
    const W = { pri: o.wing2, pri2: tone(o.wing2, 0.1), sec: o.wing, sec2: tone(o.wing, -0.06), cov: o.wing, cov2: tone(o.wing, 0.15) };
    V.def(name, humanoid({
      name, size: o.size || 0.92,
      before: [
        { kind: 'prop', pivot: [96, 92], shapes: wing.feather([96, 92], [-0.25, -1], 118, W) },
        { kind: 'prop', pivot: [86, 96], shapes: wing.feather([86, 96], [-0.8, -0.62], 132, W) },
      ],
      legs: { style: 'armor', c: o.armor },
      body: [...torso({ c: o.robe, skirt: o.robe, skirtLen: 196, plate: o.armor, belt: o.belt }), { e: [78, 94, 15, 13], c: o.armor, m: o.armorM || 'gold' }],
      head: [...head(H.headX, H.headY, H.headR, { skin: '#f0caa8', hair: o.hair, hairStyle: 'long' }), ...helm.halo(H.headX, H.headY, H.headR, {})],
      arm: [...weapon.sword([150, 122], [0.42, -0.9], 118, { blade: o.blade, guard: '#e8c050', w: 5.4 }),
        ...arm([126, 90], [142, 116], [150, 124], { c: o.armor, m: o.armorM || 'gold', hand: '#f0caa8', w: 16 }), { e: [126, 94, 16, 14], c: o.armor, m: o.armorM || 'gold', glint: [[120, 88, 4]] }],
    }));
  }
  angel('angel', { wing: '#f4f1ea', wing2: '#dcd6ca', armor: '#d8b050', robe: '#f0ece2', belt: '#8a6a2a', hair: '#f0d070', blade: '#e0e6ee' });
  angel('archangel', { wing: '#fbf6e8', wing2: '#f0d890', armor: '#c8a040', robe: '#b02a2a', belt: '#5a2a1a', hair: '#e8b848', blade: '#ffd58a', size: 0.9 });

  /* ---------- улучшения пилотных: крестоносец, королевский грифон ---------- */
  V.def('crusader', { base: 'swordsman', recolor: { '#a8262a': '#e8e2d2', '#efe4c4': '#b02a2a', '#2c52b0': '#b02a2a', '#c8302a': '#f0f0f0' } });
  V.def('royal_griffin', { base: 'griffin', recolor: { '#c79a5a': '#d8b060', '#9a7440': '#b08a3a', '#b98646': '#d8a848', '#dcb676': '#f0d890', '#a0703a': '#c89040', '#8f6232': '#b8843a', '#6f4c2a': '#8a5a2a', '#7e5730': '#9a6a32', '#e8b43a': '#f0c848' },
    add: [{ part: 6, shapes: [{ p: [P(236, 66, 1), P(240, 52, 1), P(248, 62, 1), P(254, 48, 1), P(260, 60, 1), P(268, 50, 1), P(270, 66, 1)], c: '#e8c050', m: 'gold', glint: [[252, 58, 2.5]] }] }] });
})(typeof window !== 'undefined' ? window : globalThis);
