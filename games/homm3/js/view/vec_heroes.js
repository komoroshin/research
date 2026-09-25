/* ============================================================================
   view/vec_heroes.js — герои на карте: всадник на скакуне, попона в цвете игрока.
   Цвет игрока приходит подменой {b, B} (Sp.teamTint) и попадает в формы с цветом '$b' / '$B'.
   Скакуны: конь, костяной конь, механический конь, олень, ящер, жук.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, weapon, helm, head, arm, torso, horse, mounted, tone, H, ell } = K;
  const TEAM = '$b:#3060c8', TEAMD = '$B:#1c3a80';
  const hx = H.headX, hy = H.headY, hr = H.headR;

  /* ---------- скакуны (рамка коня 330×290, земля 282) ---------- */
  function stag(o) {
    const h = horse({ coat: o.coat || '#a0703a', mane: o.coat || '#a0703a', tail: '#f0e8d8', hoof: '#3a2c22', blanket: TEAM, blanketTrim: TEAMD, saddle: '#5a3a22', bridle: false });
    const ant = [];
    const branch = (pts, w) => ant.push({ p: tube(pts.map(p => [p[0], p[1], w])), c: '#e8dcc0', m: 'horn', line: 0.6 });
    branch([[276, 58], [268, 36], [252, 18], [238, 8]], 5); branch([[268, 38], [282, 20], [286, 6]], 4); branch([[256, 22], [248, 4]], 3.5);
    branch([[286, 60], [292, 38], [304, 22], [314, 16]], 4.5); branch([[293, 38], [306, 32]], 3);
    h.head.push(...ant);
    h.head.push({ p: [[260, 150], [280, 120], [284, 150]], c: '#f0e8d8', m: 'fur', furLen: 0.4, line: 0.5 });
    return h;
  }
  function bone(o) {
    const h = horse({ coat: '#e6dcc4', mane: '#5a8a6a', tail: '#5a8a6a', hoof: '#6a6258', blanket: TEAM, blanketTrim: '#6a6a70', saddle: '#2a2420', bridle: false, m: 'horn' });
    h.body.push({ p: [[80, 150], [260, 150], [260, 200], [80, 200]], c: '#2a2a22', m: 'flat', line: 0, id: 'ribsBg' });
    h.body.splice(h.body.length - 1, 1);   // фон рёбер не нужен — рёбра штрихами
    const body = h.body.find(s => s.id === 'body');
    body.lines = [96, 110, 124, 138, 214, 226, 238].map(x => ({ p: [[x, 142], [x + 4, 176], [x, 204]], w: 2.2, a: 0.6 }));
    const hd = h.head.find(s => s.id === 'head'); hd.lines.push({ p: [[298, 84], [306, 86]], w: 5, c: '#0a1a10', a: 1 });
    h.head.push({ e: [300, 84, 3, 2.6], c: '#7aff9a', m: 'gem', line: 0, glint: [[300, 84, 4]] });
    return h;
  }
  function mech(o) {
    const h = horse({ coat: '#c8903e', mane: '#6a5a4a', tail: '#6a5a4a', hoof: '#5a4a3a', blanket: TEAM, blanketTrim: '#8a6a3a', saddle: '#4a3020', bridle: false, m: 'gold' });
    const body = h.body.find(s => s.id === 'body'); body.lines = [[110, 140, 110, 204], [170, 136, 170, 210], [232, 140, 232, 204]].map(a => ({ p: [[a[0], a[1]], [a[2], a[3]]], w: 1.4, a: 0.5 }));
    body.glint = [[100, 150, 3], [150, 146, 3], [220, 150, 3]];
    h.head.push({ p: tube([[250, 92, 10], [248, 60, 12]], { flat1: true }), c: '#5a5a62', m: 'steel' },
      { e: [246, 48, 12, 8], c: 'rgba(230,230,230,0.9)', m: 'flat', line: 0 }, { e: [236, 34, 9, 6], c: 'rgba(230,230,230,0.7)', m: 'flat', line: 0 });
    h.head.push({ e: [300, 82, 5, 5], c: '#ff8a2a', m: 'gem', line: 0.5, glint: [[299, 81, 2]] });
    return h;
  }
  function lizard(o) {
    const c = o.coat || '#6a8a3a', far = tone(c, -0.25), belly = '#c8c090';
    const lg = (top, knee, foot, w, col) => [{ p: tube([[top[0], top[1], w], [knee[0], knee[1], w * 0.7], [foot[0], foot[1] - 6, w * 0.55]], { flat0: true }), c: col, m: 'skin', tex: 'scale', texSize: 0.5 },
      ...[0, 1, 2].map(i => ({ p: [[foot[0] - 6, foot[1] - 8], [foot[0] + 8 + i * 5, foot[1] - 4 + i], [foot[0] + 13 + i * 5, foot[1] + 1, 1], [foot[0] - 6, foot[1]]], c: col, m: 'skin', line: 0.6 }))];
    const legs = [
      { kind: 'leg', side: 1, pivot: [100, 196], shapes: lg([100, 190], [76, 232], [80, 276], 30, far) },
      { kind: 'leg', side: -1, pivot: [224, 196], shapes: lg([224, 190], [246, 230], [246, 276], 26, far) },
      { kind: 'leg', side: -1, pivot: [120, 198], shapes: lg([120, 192], [96, 238], [102, 282], 34, c) },
      { kind: 'leg', side: 1, pivot: [240, 198], shapes: lg([240, 192], [264, 236], [264, 282], 30, c) },
    ];
    const body = [
      { p: tube([[80, 180, 44], [40, 196, 30], [14, 222, 18], [6, 256, 8]]), c, m: 'skin', tex: 'scale', texSize: 0.7, id: 'tail' },
      { p: [[70, 170], [100, 140], [160, 132], [220, 136], [256, 156], [262, 186], [240, 212], [160, 216], [90, 208], [66, 190]], c, m: 'skin', tex: 'scale', texSize: 0.8, belly: 0.35, id: 'body',
        sub: [{ p: [[80, 200], [250, 196], [240, 220], [90, 220]], c: belly, m: 'skin', line: 0 }] },
      ...[0, 1, 2, 3, 4, 5].map(i => ({ p: [[96 + i * 26, 142 - (i < 2 ? i * 3 : 6)], [106 + i * 26, 124 - (i < 2 ? i * 3 : 6), 1], [116 + i * 26, 140 - (i < 2 ? i * 3 : 6)]], c: '#b8502a', m: 'horn', line: 0.6 })),
      { p: [[134, 126], [206, 120], [214, 174, 1], [192, 182], [172, 174], [152, 182], [130, 174, 1]], c: TEAM, m: 'cloth', belly: 0.3, id: 'blanket' },
      { p: [[150, 128], [192, 124], [200, 140], [186, 150], [154, 150], [144, 138]], c: '#5a3a22', m: 'leather', id: 'saddle' },
    ];
    const headS = [
      { p: tube([[236, 164, 40], [268, 146, 30], [290, 132, 26]]), c, m: 'skin', tex: 'scale', texSize: 0.6, id: 'neck' },
      { p: [[276, 120], [300, 110], [330, 118], [344, 130], [336, 142], [304, 148], [282, 146]], c, m: 'skin', tex: 'scale', texSize: 0.45, id: 'head', lines: [{ p: [[300, 138], [338, 134]], w: 1.4, a: 0.8 }] },
      { e: [304, 122, 4, 3.4], c: '#e0a020', m: 'gem', line: 0.5, sub: [{ e: [304, 122, 1.2, 3], c: '#100a04', m: 'flat', line: 0 }], glint: [[303, 121, 1.4]] },
    ];
    return { legs, body, head: headS };
  }
  function beetle(o) {
    const c = o.coat || '#4a7a3a', far = tone(c, -0.3);
    const lg = (top, knee, foot, col) => [{ p: tube([[top[0], top[1], 12], [knee[0], knee[1], 9], [foot[0], foot[1], 5]]), c: col, m: 'horn', line: 0.7 }];
    const legs = [
      { kind: 'leg', side: 1, pivot: [110, 200], shapes: lg([110, 196], [80, 226], [74, 278], far) },
      { kind: 'leg', side: -1, pivot: [230, 200], shapes: lg([230, 196], [262, 226], [268, 278], far) },
      { kind: 'leg', side: -1, pivot: [130, 204], shapes: lg([130, 200], [104, 236], [100, 282], c) },
      { kind: 'leg', side: 1, pivot: [224, 204], shapes: lg([224, 200], [252, 238], [258, 282], c) },
    ];
    const body = [
      ...lg([172, 204], [176, 244], [166, 282], c),
      { p: [[62, 190], [74, 150], [120, 124], [190, 120], [238, 136], [262, 170], [254, 206], [200, 220], [120, 220], [74, 212]], c, m: 'gem', gloss: 0.9, belly: 0.4, id: 'shell',
        lines: [{ p: [[80, 160], [160, 130], [240, 150]], w: 1.6, a: 0.45 }, { p: [[160, 128], [164, 216]], w: 1.4, a: 0.4 }] },
      { p: [[134, 126], [206, 120], [214, 174, 1], [192, 182], [172, 174], [152, 182], [130, 174, 1]], c: TEAM, m: 'cloth', belly: 0.3, id: 'blanket' },
      { p: [[150, 128], [192, 124], [200, 140], [186, 150], [154, 150], [144, 138]], c: '#5a3a22', m: 'leather', id: 'saddle' },
    ];
    const headS = [
      { p: [[244, 150], [270, 136], [300, 146], [304, 176], [280, 196], [252, 190]], c: tone(c, -0.15), m: 'gem', gloss: 0.8, id: 'head' },
      { p: tube([[290, 150, 14], [314, 122, 10], [322, 92, 5]]), c: '#e8dcc0', m: 'horn', line: 0.7 },
      { p: tube([[290, 144, 3], [306, 116, 2.5], [326, 110, 2]]), c: '#2a2a1a', m: 'horn', line: 0.4 },
      { e: [284, 160, 6, 5], c: '#e8c040', m: 'gem', line: 0.5, glint: [[282, 158, 2]] },
    ];
    return { legs, body, head: headS };
  }
  function mountOf(kind, o) {
    if (kind === 'stag') return stag(o);
    if (kind === 'bone') return bone(o);
    if (kind === 'mech') return mech(o);
    if (kind === 'lizard') return lizard(o);
    if (kind === 'beetle') return beetle(o);
    return horse(Object.assign({ blanket: TEAM, blanketTrim: TEAMD, saddle: '#5a3a22' }, o));
  }

  /* ---------- уборы всадника (канон гуманоида) ---------- */
  const GEAR = {
    helm: o => helm.great(hx, hy, hr, { c: o.gcol }),
    hood: o => helm.hood(hx, hy, hr, { c: o.gcol }),
    crown: o => helm.crown(hx, hy, hr, { c: o.gcol }),
    mitre: o => [{ p: [[hx - 16, hy - 16], [hx - 12, hy - 50], [hx + 2, hy - 64, 1], [hx + 14, hy - 48], [hx + 18, hy - 16]], c: o.gcol, m: 'cloth', sub: [{ p: [[hx - 2, hy - 60], [hx + 4, hy - 60], [hx + 4, hy - 16], [hx - 2, hy - 16]], c: '#d8a53a', m: 'gold', line: 0 }] }],
    hat: o => [{ p: [[hx - 34, hy - 14], [hx + 30, hy - 18], [hx + 30, hy - 12, 1], [hx - 34, hy - 8, 1]], c: o.gcol, m: 'cloth' }, { p: [[hx - 18, hy - 14], [hx - 20, hy - 40], [hx - 30, hy - 72, 1], [hx - 2, hy - 44], [hx + 18, hy - 16]], c: o.gcol, m: 'cloth', lines: [{ p: [[hx - 16, hy - 20], [hx + 16, hy - 22]], w: 3, c: '#d8a53a', a: 0.9 }] }],
    skull: o => [{ p: [[hx - 22, hy - 4], [hx - 20, hy - 22], [hx - 2, hy - 30], [hx + 18, hy - 24], [hx + 24, hy - 6], [hx + 14, hy + 2], [hx - 16, hy + 2]], c: o.gcol, m: 'horn', lines: [{ p: [[hx + 6, hy - 14], [hx + 14, hy - 14]], w: 3.5, c: '#1a1210', a: 1 }] },
      { p: tube([[hx - 14, hy - 24, 7], [hx - 26, hy - 42, 5], [hx - 18, hy - 58, 2]]), c: '#e8dcc0', m: 'horn', line: 0.6 }, { p: tube([[hx + 12, hy - 26, 7], [hx + 20, hy - 46, 5], [hx + 32, hy - 56, 2]]), c: '#e8dcc0', m: 'horn', line: 0.6 }],
    fur: o => [{ p: [[hx - 24, hy - 4], [hx - 22, hy - 26], [hx - 4, hy - 34], [hx + 16, hy - 30], [hx + 24, hy - 12], [hx + 20, hy - 6], [hx - 20, hy + 2]], c: o.gcol, m: 'fur', furLen: 0.9, flow: Math.PI * 0.5 }],
    circlet: o => [{ p: tube([[hx - 20, hy - 12, 4], [hx + 20, hy - 16, 4]]), c: '#d8a53a', m: 'gold', line: 0.6 }, { e: [hx + 14, hy - 16, 4, 4], c: o.gcol, m: 'gem', glint: [[hx + 13, hy - 17, 1.6]] }],
    tricorn: o => [{ p: [[hx - 30, hy - 10], [hx - 16, hy - 32], [hx + 4, hy - 26], [hx + 26, hy - 34], [hx + 32, hy - 10], [hx + 4, hy - 16]], c: o.gcol, m: 'cloth', lines: [{ p: [[hx - 26, hy - 12], [hx + 4, hy - 18], [hx + 30, hy - 12]], w: 2, c: '#d8a53a', a: 0.9 }] }],
    wide: o => [{ p: [[hx - 40, hy - 12], [hx + 40, hy - 16], [hx + 38, hy - 10, 1], [hx - 40, hy - 6, 1]], c: o.gcol, m: 'leather' }, { p: [[hx - 18, hy - 12], [hx - 14, hy - 34], [hx + 12, hy - 36], [hx + 18, hy - 14]], c: o.gcol, m: 'leather', lines: [{ p: [[hx - 17, hy - 18], [hx + 17, hy - 20]], w: 3, c: TEAMD, a: 0.9 }] }],
    crystal: o => [{ p: [[hx - 14, hy - 18], [hx - 8, hy - 44, 1], [hx, hy - 30], [hx + 8, hy - 48, 1], [hx + 14, hy - 18]], c: o.gcol, m: 'gem', gloss: 1 }],
    wreath: o => [{ p: tube([[hx - 22, hy - 10, 6], [hx - 6, hy - 22, 6], [hx + 14, hy - 20, 6], [hx + 22, hy - 10, 6]]), c: '#5a8a3a', m: 'fur', furLen: 0.4 }],
    bandana: o => [{ p: [[hx - 24, hy - 4], [hx - 20, hy - 22], [hx, hy - 30], [hx + 20, hy - 22], [hx + 22, hy - 10], [hx - 10, hy - 10], [hx - 30, hy + 6, 1]], c: o.gcol, m: 'cloth' }],
  };
  /* ---------- оружие в поднятой руке (кисть у [150, 104]) ---------- */
  const HAND = [150, 106];
  const ARMS = {
    sword: o => weapon.sword(HAND, [0.25, -1], 80, { blade: o.wcol || '#d6dde6' }),
    staff: o => weapon.staff(HAND, [0.08, -1], 64, { orb: o.wcol || '#7ad0f0', back: 70 }),
    spear: o => weapon.polearm(HAND, [0.2, -1], 90, { kind: 'spear', back: 60 }),
    mace: o => weapon.mace(HAND, [0.35, -1], 44, {}),
    axe: o => weapon.axe(HAND, [0.25, -1], 50, {}),
    bow: o => weapon.bow(HAND, [0.1, -1], 44, {}),
    gun: o => weapon.gun(HAND, [0.3, -1], 56, {}),
    wrench: o => [{ p: tube([[HAND[0], HAND[1] + 10, 6], [HAND[0] + 8, HAND[1] - 40, 6]]), c: '#9aa3ad', m: 'steel', line: 0.8 }, { p: [[HAND[0] - 2, HAND[1] - 38], [HAND[0] + 2, HAND[1] - 58, 1], [HAND[0] + 8, HAND[1] - 48], [HAND[0] + 16, HAND[1] - 60, 1], [HAND[0] + 18, HAND[1] - 38]], c: '#9aa3ad', m: 'steel' }],
    spyglass: o => [{ p: tube([[HAND[0] - 4, HAND[1], 7], [HAND[0] + 32, HAND[1] - 10, 9]], { flat1: true }), c: '#6a4424', m: 'leather', lines: [{ p: [[HAND[0] + 18, HAND[1] - 12], [HAND[0] + 20, HAND[1] - 2]], w: 2.5, c: '#d8a53a', a: 1 }] }],
    flame: o => [{ p: [[HAND[0] - 8, HAND[1] - 6], [HAND[0] - 4, HAND[1] - 30], [HAND[0] + 2, HAND[1] - 20], [HAND[0] + 6, HAND[1] - 44, 1], [HAND[0] + 12, HAND[1] - 18], [HAND[0] + 14, HAND[1] - 4]], c: '#ff8a2a', m: 'gem', gloss: 1.2, line: 0.6, lc: '#a02a0a', sub: [{ p: [[HAND[0] - 2, HAND[1] - 6], [HAND[0] + 4, HAND[1] - 26], [HAND[0] + 10, HAND[1] - 6]], c: '#ffe07a', m: 'flat', line: 0 }] }],
    orbs: o => ['#ff7a2a', '#6ad0f0', '#b8e070'].map((c, i) => ({ e: [HAND[0] + 6 + (i % 2) * 14, HAND[1] - 20 - i * 14, 6, 6], c, m: 'gem', glint: [[HAND[0] + 4 + (i % 2) * 14, HAND[1] - 22 - i * 14, 2]] })),
  };

  /** Один герой: скакун + всадник. */
  function hero(name, M, R) {
    const skin = R.skin || '#e8b890';
    const gear = GEAR[R.gear] ? GEAR[R.gear](R) : [];
    const hideHead = R.gear === 'helm';
    const body = [...torso({ c: R.body, skirt: R.robe ? R.body : false, skirtLen: 200, plate: R.plate, belt: '#5a3a22', neck: skin, skin }), { e: [80, 94, 15, 13], c: R.plate || R.body, m: R.plate ? 'steel' : 'cloth' }];
    const back = R.cape ? [{ p: [[74, 84], [98, 80], [94, 150], [60, 204], [36, 192], [54, 130]], c: R.cape, m: 'cloth', belly: 0.35 }] : [];
    V.def(name, mounted({
      name, mount: mountOf(M.kind, M),
      leg: { c: R.legC || tone(R.body, -0.2), boot: '#3a2a1c', m: R.plate ? 'steel' : 'cloth' },
      back, body,
      head: [...head(hx, hy, hr, { skin, hair: R.hair || '#5a3a20', beard: R.beard, hairStyle: hideHead ? 'none' : 'short' }), ...gear],
      arm: [...(ARMS[R.weapon] ? ARMS[R.weapon](R) : []), ...K.arm([126, 90], [140, 112], HAND, { c: R.plate || R.body, m: R.plate ? 'steel' : 'cloth', hand: R.plate ? '#8a939e' : skin, w: 15 }), { e: [126, 94, 15, 13], c: R.plate || R.body, m: R.plate ? 'steel' : 'cloth' }],
    }));
  }
  const STEEL = '#b7c0ca';
  const T = [
    ['hero_knight', { coat: '#8a5a34', mane: '#2a1c14' }, { body: '#2c52b0', plate: STEEL, gear: 'helm', gcol: STEEL, weapon: 'sword', cape: TEAM }],
    ['hero_cleric', { coat: '#8a5a34', mane: '#2a1c14' }, { body: '#f0ece2', robe: true, gear: 'mitre', gcol: '#f0ece2', weapon: 'staff', wcol: '#f0d060' }],
    ['hero_ranger', { coat: '#9a9aa0', mane: '#4a4a50' }, { body: '#6a4a2a', gear: 'hood', gcol: '#3e6a2c', weapon: 'bow' }],
    ['hero_druid', { coat: '#9a9aa0', mane: '#4a4a50' }, { body: '#c8b080', robe: true, gear: 'wreath', weapon: 'staff', wcol: '#b8e070', beard: '#d8d8d8', hair: '#d8d8d8' }],
    ['hero_alchemist', { coat: '#9a9aa0', mane: '#4a4a50' }, { body: '#4a4a52', gear: 'circlet', gcol: '#e8a030', weapon: 'staff', wcol: '#8ae070' }],
    ['hero_wizard', { coat: '#e8e2d6', mane: '#a8a098' }, { body: '#2c52b0', robe: true, gear: 'hat', gcol: '#2c52b0', weapon: 'staff', wcol: '#7ad0f0', beard: '#e0e0e0', hair: '#e0e0e0' }],
    ['hero_demoniac', { coat: '#2a2226', mane: '#ff7a2a' }, { body: '#7a1a14', plate: '#4a3a3a', gear: 'skull', gcol: '#e8dcc0', weapon: 'sword', wcol: '#ff8a3a', skin: '#c85a4a' }],
    ['hero_heretic', { coat: '#2a2226', mane: '#ff7a2a' }, { body: '#7a1a14', robe: true, gear: 'hood', gcol: '#2a2226', weapon: 'flame' }],
    ['hero_deathknight', { coat: '#2a2226', mane: '#1a1414' }, { body: '#2a2a30', plate: '#4a4a54', gear: 'helm', gcol: '#4a4a54', weapon: 'sword', cape: '#8a1a1a', skin: '#d8d8d0' }],
    ['hero_necromancer', { kind: 'bone' }, { body: '#3a3a42', robe: true, gear: 'hood', gcol: '#2a2a30', weapon: 'staff', wcol: '#7aff9a', skin: '#d8d8d0' }],
    ['hero_overlord', { coat: '#9a9aa0', mane: '#4a4a50' }, { body: '#1c2a4a', plate: '#3a4a6a', gear: 'helm', gcol: '#3a4a6a', weapon: 'mace', cape: '#b02a2a' }],
    ['hero_warlock', { coat: '#4a4a50', mane: '#1a1a1e' }, { body: '#6a3a8a', robe: true, gear: 'hood', gcol: '#5a2a7a', weapon: 'staff', wcol: '#e0a0ff' }],
    ['hero_barbarian', { coat: '#8a5a34', mane: '#2a1c14' }, { body: '#d8a070', legC: '#6a4a2a', gear: 'fur', gcol: '#6a4a2a', weapon: 'axe', beard: '#2a1c14', skin: '#d8a070' }],
    ['hero_battlemage', { coat: '#9a9aa0', mane: '#4a4a50' }, { body: '#7a5a34', gear: 'skull', gcol: '#e8dcc0', weapon: 'staff', wcol: '#ff8a3a' }],
    ['hero_beastmaster', { kind: 'lizard', coat: '#6a8a3a' }, { body: '#7a5a34', gear: 'fur', gcol: '#4a6a2a', weapon: 'spear', beard: '#2a1c14' }],
    ['hero_witch', { kind: 'lizard', coat: '#5a7a3a' }, { body: '#6a3a8a', robe: true, gear: 'hood', gcol: '#5a2a7a', weapon: 'staff', wcol: '#ffb03a', skin: '#a8c880' }],
    ['hero_planeswalker', { coat: '#e8e2d6', mane: '#a8a098' }, { body: '#4aa0c0', plate: '#9adcf0', gear: 'crystal', gcol: '#9adcf0', weapon: 'sword', wcol: '#bff0ff' }],
    ['hero_elementalist', { coat: '#e8e2d6', mane: '#a8a098' }, { body: '#a860c8', robe: true, gear: 'circlet', gcol: '#e0a0ff', weapon: 'orbs' }],
    ['hero_captain', { coat: '#9a9aa0', mane: '#4a4a50' }, { body: '#b02a2a', gear: 'tricorn', gcol: '#2a2a30', weapon: 'sword', beard: '#e0e0e0' }],
    ['hero_navigator', { coat: '#8a5a34', mane: '#2a1c14' }, { body: '#e8e0d0', gear: 'bandana', gcol: TEAM, weapon: 'spyglass' }],
    ['hero_mercenary', { coat: '#4a3a2a', mane: '#1a1410' }, { body: '#c8b080', gear: 'wide', gcol: '#6a4a2a', weapon: 'gun', cape: '#b8a070' }],
    ['hero_artificer', { kind: 'mech' }, { body: '#7a5a34', gear: 'wide', gcol: '#a8581a', weapon: 'wrench' }],
    ['hero_swarmlord', { kind: 'beetle', coat: '#4a7a3a' }, { body: '#4a7a3a', plate: '#6a9a4a', gear: 'helm', gcol: '#3a5a2a', weapon: 'spear' }],
    ['hero_pheromancer', { kind: 'beetle', coat: '#3a5a2a' }, { body: '#e8a030', robe: true, gear: 'hood', gcol: '#6a9a4a', weapon: 'staff', wcol: '#e8c040' }],
    ['hero_huntsman', { kind: 'stag', coat: '#a0703a' }, { body: '#6a4a2a', gear: 'hood', gcol: '#3e6a2c', weapon: 'bow' }],
    ['hero_totemist', { kind: 'stag', coat: '#8a5a34' }, { body: '#8a6a44', robe: true, gear: 'hood', gcol: '#5a3a22', weapon: 'staff', wcol: '#e8dcc0', beard: '#8a8a8a' }],
  ];
  for (const [name, M, R] of T) hero(name, M, R);
  // ell пригодится для будущих уборов
  void ell;
})(typeof window !== 'undefined' ? window : globalThis);
