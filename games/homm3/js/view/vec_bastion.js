/* ============================================================================
   view/vec_bastion.js — Бастион на рисованном конвейере: лесной народ и приручённое зверьё.
   Лесной кот / рысь, следопыт / лесник, вепрь / клыкач, росомаха / матёрая росомаха,
   ловчий / мастер-ловчий, пещерный медведь (улучшение медведя из vec_pilot.js),
   великий олень / король леса.
   Краски фракции — лесная зелень, охра, бурый мех, берёзово-светлые рога.
   Звери нарисованы в рамке 330×290 (земля y=282, морда вправо) и вписаны place() в рамку старого спрайта.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, lerp, ell, weapon, helm, head, arm, torso, humanoid, hoofLeg, fit, frameOf, tone, H } = K;
  const G = 282;   // земля в рамке зверя
  const SKIN = '#e0b088', LEATHER = '#5a3a22', DARK = '#140c08';

  /* ---------- общие помощники ---------- */
  /** Вписать зверя из рамки 330×290 (ground — точка опоры) в рамку старого спрайта. */
  function place(name, parts, ground, size) {
    const to = frameOf(name) || { w: 330, h: 290, anchor: ground };
    return fit(parts, { ground, height: ground[1] }, to, to.anchor[1] / ground[1] * (size || 1));
  }
  /** Лапа хищника: суставы трубкой, внизу стопа длиной pl с пальцами и когтями. o: { pl, ph, claw, clawL, furLen } */
  function paw(joints, foot, c, o) {
    o = o || {};
    const [fx, fy] = foot, pl = o.pl || 28, ph = o.ph || 11, out = [];
    out.push({ p: tube(joints, { flat0: true }), c, m: 'fur', flow: Math.PI * 0.5, furLen: o.furLen || 0.6, belly: 0.25 });
    out.push({ p: [[fx - pl * 0.55, fy - ph], [fx + pl * 0.12, fy - ph * 1.1], [fx + pl * 0.46, fy - ph * 0.55], P(fx + pl * 0.52, fy, 1), P(fx - pl * 0.62, fy, 1)], c, m: 'fur', furLen: 0.4, flow: Math.PI * 0.5,
      lines: [{ p: [[fx + pl * 0.1, fy - ph * 0.7], [fx + pl * 0.14, fy]], w: 0.9, a: 0.5 }, { p: [[fx + pl * 0.3, fy - ph * 0.5], [fx + pl * 0.32, fy]], w: 0.9, a: 0.5 }] });
    if (o.claw) for (let i = 0; i < 3; i++) {
      const x = fx + pl * 0.48 - i * pl * 0.2, y = fy - 1.5, L = o.clawL || 6;
      out.push({ p: [P(x - 3, y - 4, 1), P(x + L, y + 1.5, 1), P(x - 3, y + 1.5, 1)], c: o.claw, m: 'horn', line: 0.5 });
    }
    return out;
  }
  /** Нога копытного: суставы трубкой и раздвоенное копыто. */
  function cloven(joints, foot, c, hoof, o) {
    o = o || {};
    const [fx, fy] = foot, hw = o.hw || 9, hh = o.hh || 11;
    return [
      { p: tube(joints, { flat0: true }), c, m: 'fur', flow: Math.PI * 0.5, furLen: o.furLen || 0.5, belly: 0.2 },
      { p: [[fx - hw, fy - hh], [fx + hw * 0.6, fy - hh], [fx + hw * 1.15, fy - 2], P(fx + hw * 1.25, fy, 1), P(fx - hw * 1.1, fy, 1)], c: hoof, m: 'horn', gloss: 0.9, line: 0.7,
        lines: [{ p: [[fx + hw * 0.2, fy - hh * 0.8], [fx + hw * 0.35, fy]], w: 1.1, c: DARK, a: 0.8 }] },
      { p: [[fx - hw * 1.2, fy - hh * 1.5], [fx - hw * 1.6, fy - hh * 0.9, 1], [fx - hw * 0.8, fy - hh * 1.1]], c: hoof, m: 'horn', line: 0.5 },
    ];
  }
  /** Шипы/щетина вдоль линии pts: треугольники вверх от хода вправо. o: { m, flow, furLen, w } */
  function spikes(pts, n, h, c, o) {
    o = o || {}; const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, k = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j;
      const a = pts[j], b = pts[j + 1], p = lerp(a, b, f), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = ty, ny = -tx;
      const hh = h * (1 - Math.abs(t - 0.45) * 0.8) * (i % 2 ? 0.8 : 1), w = h * (o.w || 0.4), lean = o.lean === undefined ? -0.35 : o.lean;
      out.push({ p: [P(p[0] - tx * w, p[1] - ty * w, 1), P(p[0] + nx * hh + tx * hh * lean, p[1] + ny * hh + ty * hh * lean, 1), P(p[0] + tx * w, p[1] + ty * w, 1)], c, m: o.m || 'fur', furLen: o.furLen || 0.6, flow: o.flow === undefined ? -Math.PI * 0.5 : o.flow, line: 0.5 });
    }
    return out;
  }
  /** Поперечные штрихи-кольца вдоль трубки (полосатый хвост, кольца рога). */
  function rings(pts, from, c, w, a) {
    const out = [];
    for (let i = from; i < pts.length - 1; i++) {
      const q = pts[i], b = pts[i + 1], [tx, ty] = norm(b[0] - q[0], b[1] - q[1]), r = q[2] * 0.5;
      out.push({ p: [[q[0] - ty * r, q[1] + tx * r], [q[0] + tx * 3, q[1] + ty * 3], [q[0] + ty * r, q[1] - tx * r]], w, c, a });
    }
    return out;
  }
  /** Глаз зверя: радужка, зрачок (slit — щелью), блик. */
  function eye(cx, cy, rx, ry, iris, slit) {
    return { e: [cx, cy, rx, ry], c: iris, m: 'gem', line: 0.5, lc: DARK,
      sub: [{ e: [cx + rx * 0.15, cy, slit ? rx * 0.24 : rx * 0.5, slit ? ry * 0.9 : ry * 0.55], c: DARK, m: 'flat', line: 0 }], glint: [[cx - rx * 0.25, cy - ry * 0.35, Math.max(1, rx * 0.32)]] };
  }
  /** Ряд клыков вдоль линии a→b (dir 1 — остриём вниз, −1 — вверх). */
  function fangs(a, b, n, len, c) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t0 = (i + 0.15) / n, t1 = (i + 0.85) / n, p0 = lerp(a, b, t0), p1 = lerp(a, b, t1), m = lerp(a, b, (t0 + t1) / 2);
      out.push({ p: [P(...p0, 1), P(m[0], m[1] + len, 1), P(...p1, 1)], c: c || '#f0ead8', m: 'horn', line: 0.4 });
    }
    return out;
  }
  /** Сдвинуть формы (для дальних ног — те же, что ближние, но чуть позади и выше). */
  const shift = (list, dx, dy) => K.mapShapes(list, (x, y) => [x + dx, y + dy], 1);

  /* =================== лесной кот / рысь ===================
     Гибкое поджарое тело, круглая голова с ушами торчком.
     Кот — охристый в тёмную полоску, хвост трубой; рысь — серебристая в пятнах,
     длинные ноги, кисточки на ушах, бакенбарды и куцый хвост с чёрным кончиком. */
  function cat(name, o) {
    const c = o.fur, far = tone(c, -0.26), dk = o.dark, cream = o.cream, lx = !!o.lynx;
    const L = lx ? 10 : 0;   // рысь выше на ногах
    const pw = { pl: lx ? 34 : 27, ph: lx ? 13 : 10, claw: o.claw, clawL: 4 };
    const legs = [
      { kind: 'leg', side: 1, pivot: [100, 178 - L], shapes: paw([[98, 172 - L, 40], [114, 212 - L * 0.5, 22], [96, 246, 13], [100, 270, 12]], [104, 280], far, pw) },
      { kind: 'leg', side: -1, pivot: [222, 182 - L], shapes: paw([[222, 180 - L, 28], [216, 224 - L * 0.5, 16], [220, 256, 12], [224, 270, 11]], [230, 280], far, pw) },
      { kind: 'leg', side: -1, pivot: [114, 180 - L], shapes: paw([[114, 172 - L, 48], [132, 214 - L * 0.5, 26], [112, 248, 15], [116, 270, 13]], [120, 282], c, pw) },
      { kind: 'leg', side: 1, pivot: [240, 184 - L], shapes: paw([[240, 180 - L, 34], [234, 226 - L * 0.5, 19], [238, 258, 14], [242, 272, 12]], [248, 282], c, pw) },
    ];
    // хвост: у кота — высокой дугой «трубой», у рыси — куцый
    const tp = lx ? [[98, 164 - L, 18], [80, 156 - L, 17], [68, 158 - L, 14]] : [[96, 168, 16], [72, 156, 15], [58, 130, 14], [56, 100, 13], [64, 74, 12], [78, 56, 11], [94, 50, 9]];
    const tail = [{ p: tube(tp), c, m: 'fur', furLen: lx ? 0.9 : 0.8, flow: lx ? Math.PI : -Math.PI * 0.5,
      lines: lx ? [] : rings(tp, 2, dk, 3.2, 0.8),
      sub: [{ p: lx ? [[54, 130], [74, 130], [74, 180], [54, 180]] : ell(94, 50, 16, 14, 10), c: dk, m: 'fur', furLen: 0.6, line: 0 }] }];
    const back = [];
    if (!lx) for (const x of [120, 142, 164, 186, 208, 228]) back.push({ p: [[x, 156], [x - 4, 172], [x - 10, 190]], w: 4, c: dk, a: 0.75 });
    const spots = [];
    if (lx) [[128, 164], [150, 176], [176, 164], [200, 176], [222, 164], [140, 192], [190, 194], [112, 186], [160, 160], [208, 190]].forEach(([x, y], i) => spots.push({ e: [x, y - L, 3.6 + (i % 3), 2.8 + (i % 2)], c: dk, m: 'flat', line: 0 }));
    const body = [
      { p: move2([[84, 182], [94, 162], [118, 154], [160, 160], [200, 158], [234, 150], [258, 160], [266, 184], [256, 206], [232, 214], [200, 208], [160, 210], [124, 214], [98, 206]], 0, -L),
        c, m: 'fur', furLen: lx ? 0.8 : 0.6, flow: Math.PI * 0.72, belly: 0.45, lines: back.map(l => ({ ...l, p: move2(l.p, 0, -L) })).concat([{ p: move2([[120, 158], [180, 160], [232, 152]], 0, -L), w: 1.4, light: true, a: 0.4 }]),
        sub: [{ p: move2([[130, 202], [246, 196], [262, 236], [120, 236]], 0, -L), c: cream, m: 'fur', furLen: 0.6, flow: Math.PI * 0.5, line: 0 }, ...spots] },
    ];
    // голова: шея, круглый череп, светлая морда, уши торчком
    const hdY = -L;
    const M = pts => move2(pts, 0, hdY);
    const headS = [
      { p: M([[234, 152], [256, 132], [280, 130], [290, 160], [270, 192], [244, 192]]), c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.6 },
      { p: M([[268, 120], [264, 92, 1], [284, 114]]), c: far, m: 'fur', furLen: 0.3, line: 0.6 },
      { p: M([[262, 142], [266, 122], [282, 112], [300, 114], [312, 126], [318, 140], [314, 154], [302, 164], [284, 166], [270, 158]]), c, m: 'fur', furLen: 0.45, flow: Math.PI * 0.95,
        lines: lx ? [] : [{ p: M([[284, 116], [288, 128]]), w: 2.2, c: dk, a: 0.7 }, { p: M([[292, 115], [294, 126]]), w: 2, c: dk, a: 0.7 }, { p: M([[270, 140], [282, 144]]), w: 2, c: dk, a: 0.6 }] },
      // бакенбарды рыси — светлый воротник под челюстью
      ...(lx ? [{ p: M([[264, 146], [276, 164], [292, 170], [306, 176, 1], [298, 164], [312, 170, 1], [304, 158], [292, 156], [276, 150]]), c: cream, m: 'fur', furLen: 0.8, flow: Math.PI * 0.4,
        lines: [{ p: M([[276, 158], [296, 170]]), w: 1.6, c: dk, a: 0.7 }] }] : []),
      { p: M([[298, 140], [314, 136], [324, 146], [320, 160], [304, 162], [296, 152]]), c: cream, m: 'fur', furLen: 0.3, line: 0.6,
        lines: [{ p: M([[322, 147], [318, 154], [308, 156]]), w: 1.2, c: DARK, a: 0.8 }, { p: M([[306, 150], [338, 144]]), w: 0.8, light: true, a: 0.9 }, { p: M([[306, 153], [338, 156]]), w: 0.8, light: true, a: 0.9 }] },
      { p: M([[318, 138], [326, 140], [323, 147], [319, 146]]), c: '#8a4a44', m: 'skin', line: 0.4 },
      eye(300, 134 + hdY, 5, 3.8, o.eye, true),
      { p: M([[292, 128], [306, 128], [308, 131], [294, 131]]), c: tone(c, -0.5), m: 'flat', line: 0 },
      { p: M([[280, 118], [290, 88, 1], [302, 116]]), c, m: 'fur', furLen: 0.3, line: 0.6, sub: [{ p: M([[285, 114], [290, 96], [297, 114]]), c: '#d8a09a', m: 'skin', line: 0 }] },
      ...(lx ? [{ p: M([[288, 94], [292, 70, 1], [294, 94]]), c: DARK, m: 'flat', line: 0.3 }, { p: M([[264, 98], [262, 78, 1], [268, 98]]), c: DARK, m: 'flat', line: 0.3 }] : []),
    ];
    const parts = [legs[0], legs[1], legs[2], legs[3],
      { kind: 'head', pivot: [96, 168 - L], shapes: tail },
      { kind: 'torso', pivot: [170, 184 - L], shapes: body },
      { kind: 'head', pivot: [256, 160 + hdY], shapes: headS }];
    V.def(name, place(name, parts, [178, G], o.size));
  }
  function move2(pts, dx, dy) { return pts.map(p => P(p[0] + dx, p[1] + dy, p[2])); }
  cat('forest_cat', { fur: '#c8944a', dark: '#5a3418', cream: '#f0dcb0', eye: '#a8c030', claw: '#eadfc6', size: 1.05 });
  cat('lynx', { fur: '#b0a894', dark: '#3a3028', cream: '#ece6d6', eye: '#e0a020', claw: '#eadfc6', lynx: true, size: 1.05 });

  /* =================== следопыт / лесник ===================
     Лучник в капюшоне и короткой пелерине, целится из лука. Лесник — бурая куртка,
     серый капюшон, плащ до колен, топорик на поясе и лук длиннее. */
  function tracker(name, o) {
    const q = [];   // колчан за спиной
    q.push({ p: tube([[70, 66, 16], [60, 134, 14]]), c: '#6a4424', m: 'leather', lines: [{ p: [[62, 80], [72, 82]], w: 1, a: 0.6 }] });
    for (let i = 0; i < 4; i++) q.push({ p: [[64 + i * 4, 64], [58 + i * 4, 48, 1], [68 + i * 4, 52], [70 + i * 4, 66]], c: o.fletch, m: 'feather', texSize: 0.3, line: 0.6 });
    const cloak = o.cloak ? [{ p: [[72, 80], [96, 78], [90, 140], [84, 196], [72, 214, 1], [58, 204], [44, 212, 1], [48, 160], [58, 110]], c: o.cloak, m: 'cloth', belly: 0.3,
      lines: [{ p: [[70, 100], [58, 200]], w: 1.1, a: 0.4 }, { p: [[84, 104], [80, 196]], w: 1, a: 0.3 }] }] : [];
    const S = o.bow || 60;
    const armS = [...arm([126, 90], [148, 98], [168, 100], { c: o.sleeve, hand: SKIN, w: 15 }),
      { p: tube([[152, 99, 14], [166, 100, 13]]), c: LEATHER, m: 'leather', line: 0.6 },   // наруч
      ...weapon.bow([170, 100], [0.08, -1], S, { wood: o.bowC || '#7a4a22' }),
      { p: [[122, 98], [178, 99], [178, 101], [122, 100]], c: '#e0d6c0', m: 'flat', line: 0 }, { p: [P(177, 96, 1), P(188, 100, 1), P(177, 104, 1)], c: '#b7c0ca', m: 'steel', line: 0.6 },
      { p: [[118, 94], [126, 90, 1], [124, 99], [126, 106, 1]], c: o.fletch, m: 'feather', line: 0.5 }];
    // пелерина капюшона на плечах
    const cape = { p: [[70, 76], [104, 70], [134, 78], [140, 100], [122, 112], [104, 106], [86, 114], [66, 104]], c: o.hood, m: 'cloth', belly: 0.2,
      lines: [{ p: [[92, 80], [90, 110]], w: 1, a: 0.35 }, { p: [[118, 80], [124, 108]], w: 1, a: 0.35 }] };
    const belt = [];
    if (o.hatchet) belt.push({ p: tube([[122, 142, 5], [132, 180, 4.5]]), c: '#7a5230', m: 'wood', line: 0.7 },
      { p: [P(124, 140, 1), P(140, 132), P(146, 146), P(134, 152, 1)], c: '#aab2bc', m: 'steel', gloss: 1.1, line: 0.7 });
    V.def(name, humanoid({
      name, size: o.size,
      legs: { style: 'hose', c: o.hose, boot: o.boot, tw: 24 },
      back: [...cloak, ...q, ...arm([80, 90], [76, 104], [114, 98], { c: o.sleeve, hand: SKIN, w: 15 })],
      body: [...torso({ c: o.tunic, skirt: o.skirt || o.tunic, skirtLen: 190, belt: LEATHER, chestLines: [{ p: [[86, 84], [122, 140]], w: 3.2, c: LEATHER, a: 0.9 }] }), cape, ...belt],
      head: [...head(H.headX, H.headY, H.headR, { skin: SKIN, hair: o.hair, beard: o.beard }), ...helm.hood(H.headX, H.headY, H.headR, { c: o.hood }),
        ...(o.leaf ? [{ p: [P(H.headX - 12, H.headY - 26, 1), P(H.headX - 34, H.headY - 40), P(H.headX - 40, H.headY - 30, 1), P(H.headX - 22, H.headY - 22)], c: o.leaf, m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: [[H.headX - 14, H.headY - 25], [H.headX - 36, H.headY - 34]], w: 0.8, light: true, a: 0.6 }] }] : [])],
      arm: armS,
    }));
  }
  tracker('tracker', { hose: '#5a4a30', boot: '#4a3020', sleeve: '#5a8a34', tunic: '#4a7a2c', hood: '#3e6a26', fletch: '#e8e0d0', hair: '#7a4a22', size: 0.98 });
  tracker('forester', { hose: '#4a3a2a', boot: '#3a2418', sleeve: '#8a5a32', tunic: '#7a4e2a', skirt: '#6a4224', hood: '#8a8a84', cloak: '#3a5a2a', fletch: '#c8a040', hair: '#5a3418',
    beard: '#5a3418', hatchet: true, leaf: '#6a9a34', bow: 68, bowC: '#5a3418', size: 1.0 });

  /* =================== вепрь / клыкач ===================
     Тяжёлый клин: высокий загривок со щетиной гребнем, низко опущенная голова,
     пятачок и загнутые вверх клыки, короткие ноги на копытцах. */
  function boar(name, o) {
    const c = o.fur, far = tone(c, -0.25), dk = o.crest, hf = o.hoof;
    const legs = [
      { kind: 'leg', side: 1, pivot: [98, 196], shapes: cloven([[98, 190, 44], [110, 228, 20], [98, 258, 12], [100, 272, 11]], [102, 280], far, hf) },
      { kind: 'leg', side: -1, pivot: [232, 198], shapes: cloven([[232, 196, 34], [228, 238, 17], [232, 262, 11], [234, 272, 10]], [238, 280], far, hf) },
      { kind: 'leg', side: -1, pivot: [114, 198], shapes: cloven([[114, 192, 50], [128, 232, 24], [114, 260, 13], [116, 272, 12]], [120, 282], c, hf) },
      { kind: 'leg', side: 1, pivot: [252, 200], shapes: cloven([[252, 196, 40], [256, 238, 20], [252, 262, 13], [254, 272, 12]], [258, 282], c, hf) },
    ];
    const ridge = [[96, 138], [140, 124], [186, 110], [226, 102], [256, 110]];
    const body = [
      { p: tube([[66, 162, 6], [54, 170, 5], [50, 186, 4]]), c: far, m: 'fur', furLen: 0.4 },
      { p: [[40, 186], [50, 180], [58, 196, 1], [50, 206, 1], [44, 196]], c: dk, m: 'fur', furLen: 0.8, flow: Math.PI * 0.5 },
      ...spikes(ridge, o.bristles || 13, o.crestH || 20, dk, { furLen: 0.8, w: 0.45 }),
      { p: [[62, 176], [70, 150], [96, 134], [140, 124], [190, 108], [232, 102], [262, 116], [278, 146], [276, 182], [264, 210], [238, 222], [200, 222], [160, 224], [120, 222], [88, 212], [68, 198]],
        c, m: 'fur', furLen: 0.9, flow: Math.PI * 0.62, dens: 1.2, belly: 0.5,
        lines: [{ p: [[92, 146], [104, 176], [100, 204]], w: 1.3, a: 0.45 }, { p: [[242, 130], [252, 170], [246, 206]], w: 1.3, a: 0.4 }, { p: [[110, 140], [180, 118], [236, 108]], w: 1.6, light: true, a: 0.35 },
          ...(o.scars || []).map(s => ({ p: s, w: 1.8, c: o.scarC, a: 0.9 }))],
        sub: [{ p: [[92, 140], [140, 126], [196, 108], [240, 100], [268, 118], [240, 126], [200, 132], [150, 144], [104, 154]], c: dk, m: 'fur', furLen: 0.9, flow: Math.PI * 0.62, line: 0 }] },
    ];
    const tusk = (pts, col) => ({ p: tube(pts), c: col, m: 'horn', gloss: 1.1, line: 0.6, lines: [{ p: pts.slice(0, -1).map(q => [q[0] - 1, q[1]]), w: 0.9, light: true, a: 0.6 }] });
    const headS = [
      { p: [[240, 116], [268, 116], [296, 136], [318, 166], [334, 194], [342, 208], [338, 224], [318, 230], [296, 224], [270, 214], [246, 198], [234, 160]], c: o.head || c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.2,
        lines: [{ p: [[288, 150], [306, 176], [320, 204]], w: 1.2, light: true, a: 0.4 }, { p: [[300, 224], [330, 222]], w: 1.4, a: 0.7 }],
        sub: [{ p: [[236, 112], [270, 112], [290, 132], [268, 140], [244, 150]], c: dk, m: 'fur', furLen: 0.9, flow: -Math.PI * 0.3, line: 0 }] },
      ...(o.tusk2 ? [tusk([[300, 222, 5], [290, 212, 4], [286, 198, 2.8], [290, 188, 1.2]], tone(o.tusk, -0.2))] : []),
      { p: [[262, 128], [262, 100, 1], [284, 128]], c: far, m: 'fur', furLen: 0.3, line: 0.6, sub: [{ p: [[266, 124], [264, 108], [278, 126]], c: '#a0706a', m: 'skin', line: 0 }] },
      { e: [338, 214, 7, 12], c: o.snout || '#a87a6a', m: 'skin', line: 0.7, sub: [{ e: [339, 210, 2, 2.4], c: DARK, m: 'flat', line: 0 }, { e: [340, 219, 2, 2.4], c: DARK, m: 'flat', line: 0 }] },
      eye(292, 162, 3.6, 3, o.eye, false),
      { p: [[282, 154], [298, 156], [300, 159], [284, 158]], c: tone(dk, -0.3), m: 'flat', line: 0 },
      tusk([[320, 226, 7], [330, 214, 5.5], [332, 200, 3.8], [326, 188, 1.6]], o.tusk),
      ...(o.tusk2 ? [tusk([[312, 226, 6], [320, 234, 4.6], [332, 234, 3], [340, 226, 1.2]], o.tusk)] : []),
      ...(o.ring ? [{ p: tube([[327, 212, 9], [330, 206, 9]]), c: o.ring, m: 'steel', gloss: 1.1, line: 0.6 }] : []),
    ];
    const parts = [legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [170, 190], shapes: body },
      { kind: 'head', pivot: [252, 160], shapes: headS }];
    V.def(name, place(name, parts, [172, G], o.size));
  }
  boar('boar', { fur: '#7a5434', crest: '#3e2616', head: '#80583a', hoof: '#2e241c', tusk: '#f0e6cc', snout: '#a87a6a', eye: '#e0b020', size: 1.02 });
  boar('tusker', { fur: '#4a4046', crest: '#141014', head: '#4e444a', hoof: '#1e1a1a', tusk: '#c8742e', snout: '#8a5a52', eye: '#e03a20', size: 1.04,
    bristles: 16, crestH: 30, tusk2: true, ring: '#9aa2ac', scarC: '#b88a7a', scars: [[[150, 150], [170, 170]], [[176, 146], [194, 172]], [[214, 136], [226, 160]]] });

  /* =================== росомаха / матёрая росомаха ===================
     Низкое длинное тело горбом, тёмный мех со светлой полосой по боку, пушистый хвост,
     широкая голова со светлой маской, короткие лапы с длинными когтями. */
  function wolverine(name, o) {
    const c = o.fur, far = tone(c, -0.3), st = o.stripe;
    const pw = { pl: 36, ph: 14, claw: o.claw, clawL: o.clawL || 11, furLen: 0.9 };
    const legs = [
      { kind: 'leg', side: 1, pivot: [92, 206], shapes: paw([[92, 200, 46], [106, 238, 26], [96, 264, 19]], [104, 280], far, pw) },
      { kind: 'leg', side: -1, pivot: [228, 208], shapes: paw([[228, 204, 38], [232, 242, 22], [232, 264, 18]], [240, 280], far, pw) },
      { kind: 'leg', side: -1, pivot: [110, 208], shapes: paw([[110, 200, 54], [126, 240, 30], [114, 266, 21]], [122, 282], c, pw) },
      { kind: 'leg', side: 1, pivot: [248, 210], shapes: paw([[248, 204, 44], [252, 244, 26], [252, 266, 21]], [260, 282], c, pw) },
    ];
    const tp = [[70, 184, 22], [48, 188, 30], [32, 206, 30], [26, 230, 22], [30, 248, 8]];
    const body = [
      { p: tube(tp), c, m: 'fur', furLen: 1.7, flow: Math.PI * 0.6, dens: 1.2, sub: [{ p: [[40, 186], [60, 180], [66, 196], [44, 206]], c: st, m: 'fur', furLen: 1.2, line: 0 }] },
      ...(o.hackles ? spikes([[96, 156], [140, 142], [184, 146], [230, 154], [256, 164]], 15, 24, o.hackles, { furLen: 0.9, lean: -0.55, w: 0.5 }) : []),
      { p: [[56, 196], [64, 170], [90, 150], [130, 140], [168, 146], [204, 152], [236, 156], [262, 170], [272, 196], [262, 222], [236, 234], [200, 232], [160, 234], [120, 236], [86, 228], [64, 214]],
        c, m: 'fur', furLen: 1.1, flow: Math.PI * 0.68, dens: 1.2, belly: 0.5,
        lines: [{ p: [[94, 156], [110, 186], [106, 214]], w: 1.3, a: 0.4 }, { p: [[244, 170], [252, 200], [244, 224]], w: 1.2, a: 0.35 }, { p: [[100, 150], [140, 142], [190, 150]], w: 1.4, light: true, a: 0.35 },
          ...(o.scars || []).map(s => ({ p: s, w: 1.8, c: o.scarC, a: 0.9 }))],
        sub: [{ p: [[250, 176], [220, 168], [180, 166], [140, 164], [106, 166], [80, 176], [62, 196], [72, 204], [90, 190], [116, 184], [150, 186], [190, 188], [226, 192], [252, 198]], c: st, m: 'fur', furLen: 1, flow: Math.PI, line: 0 }] },
    ];
    const headS = [
      { p: [[232, 164], [256, 152], [284, 156], [296, 190], [278, 218], [246, 212]], c, m: 'fur', furLen: 1, flow: Math.PI * 0.6 },
      { e: [266, 158, 7.5, 6.5], c: far, m: 'fur', furLen: 0.4, sub: [{ e: [267, 160, 3.4, 3], c: tone(st, -0.3), m: 'skin', line: 0 }] },
      { p: [[262, 172], [276, 154], [300, 150], [320, 160], [334, 172], [344, 186], [340, 198], [324, 204], [302, 206], [282, 202], [266, 190]], c, m: 'fur', furLen: 0.6, flow: Math.PI * 0.95,
        sub: [{ p: [[266, 162], [284, 150], [306, 150], [318, 160], [300, 166], [282, 170], [270, 176]], c: o.mask, m: 'fur', furLen: 0.6, flow: Math.PI, line: 0 },
          { p: [[312, 178], [346, 176], [346, 208], [310, 208]], c: tone(c, -0.15), m: 'fur', furLen: 0.4, line: 0 }] },
      { e: [340, 182, 5.5, 4.4], c: '#141010', m: 'horn', gloss: 1.2, line: 0.4 },
      ...(o.snarl ? [{ p: [[308, 196], [338, 194], [334, 206], [312, 208]], c: '#4a1010', m: 'skin', line: 0.6 }, ...fangs([314, 195], [336, 193], 3, 7), ...fangs([316, 207], [332, 206], 2, -6)]
        : [{ p: tube([[310, 199, 2], [338, 196, 2]]), c: '#2a1810', m: 'flat', line: 0 }]),
      eye(306, 172, 4, 3.4, o.eye, false),
      { e: [280, 154, 7.5, 6.5], c, m: 'fur', furLen: 0.4, sub: [{ e: [281, 156, 3.4, 3], c: tone(st, -0.4), m: 'skin', line: 0 }] },
    ];
    const parts = [legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [170, 196], shapes: body },
      { kind: 'head', pivot: [258, 186], shapes: headS }];
    V.def(name, place(name, parts, [176, G], o.size));
  }
  wolverine('wolverine', { fur: '#3e2a1c', stripe: '#c8985a', mask: '#9a7a5a', claw: '#ece2c8', eye: '#e0a830', size: 1.0 });
  wolverine('dire_wolverine', { fur: '#5a5a60', stripe: '#e8e2d4', mask: '#c8c4bc', claw: '#f8f4ea', clawL: 16, eye: '#f02a1a', size: 1.04, snarl: true, hackles: '#b4b4b8',
    scarC: '#c89a8a', scars: [[[150, 170], [168, 196]], [[204, 176], [222, 204]]] });

  /* =================== ловчий / мастер-ловчий ===================
     Бородатый охотник в длинном плаще и кольчужном вороте: длинный лук за спиной,
     в поднятой руке дротик — бьёт и издали, и вблизи. */
  function ranger(name, o) {
    const back = [];
    // длинный плащ за спиной
    back.push({ p: [[72, 78], [100, 76], [96, 140], [92, 200], [82, 226, 1], [66, 214], [50, 224, 1], [40, 196], [48, 140], [58, 100]], c: o.cloak, m: 'cloth', belly: 0.35,
      lines: [{ p: [[68, 100], [52, 210]], w: 1.2, a: 0.4 }, { p: [[84, 104], [76, 212]], w: 1.1, a: 0.35 }],
      sub: o.trim ? [{ p: [[30, 206], [100, 190], [100, 240], [30, 240]], c: o.trim, m: 'gold', line: 0 }] : [] });
    // длинный лук, перекинутый через спину
    back.push(...weapon.bow([62, 124], [0.5, -1], 88, { wood: o.bowC, string: '#e8e0d0' }));
    // колчан с дротиками
    back.push({ p: tube([[90, 72, 17], [98, 140, 15]]), c: '#6a4424', m: 'leather', lines: [{ p: [[82, 84], [98, 84]], w: 1, a: 0.6 }] });
    for (let i = 0; i < 3; i++) { const b = [84 + i * 4, 76], t = [60 + i * 7, 40 - i * 3], d = norm(t[0] - b[0], t[1] - b[1]);
      back.push({ p: tube([[...b, 3.2], [...t, 3]]), c: '#8a5a2a', m: 'wood', line: 0.5 },
        { p: [P(t[0] - d[1] * 3.5, t[1] + d[0] * 3.5, 1), P(t[0] + d[0] * 12, t[1] + d[1] * 12, 1), P(t[0] + d[1] * 3.5, t[1] - d[0] * 3.5, 1)], c: o.dartHead, m: 'steel', line: 0.5 }); }
    back.push(...arm([80, 90], [74, 122], [84, 148], { c: o.sleeve, hand: SKIN, w: 16 }));
    const hand = [150, 36];
    const armS = [
      ...weapon.polearm(hand, [1, -0.14], 46, { kind: 'spear', back: 22, shaft: '#8a5a2a', head: o.dartHead }),
      ...(o.plume ? [{ p: [[hand[0] - 16, hand[1] + 1], [hand[0] - 26, hand[1] - 6, 1], [hand[0] - 24, hand[1] + 8, 1]], c: o.plume, m: 'feather', texSize: 0.3, line: 0.5 }] : []),
      ...arm([126, 90], [144, 66], hand, { c: o.sleeve, hand: SKIN, w: 16 }),
      ...(o.bracer ? [58, 47].map(y => ({ p: tube([[144 + (66 - y) * 0.2, y + 2.5, 16.5], [145 + (66 - y) * 0.2, y - 2.5, 15.5]], { flat0: true, flat1: true }), c: o.bracer, m: 'gold', line: 0.5 })) : []),   // золотые кольца наруча
      { e: [126, 92, 15, 13], c: o.sleeve, m: 'cloth' },
    ];
    V.def(name, humanoid({
      name, size: o.size,
      legs: { style: 'hose', c: o.hose, boot: '#3a2418', tw: 26 },
      back,
      body: [...torso({ c: o.tunic, skirt: o.tunic, skirtLen: 196, belt: LEATHER, buckle: o.buckle, chestLines: [{ p: [[120, 84], [86, 140]], w: 3.2, c: LEATHER, a: 0.9 }] }),
        { p: [[76, 76], [104, 70], [132, 78], [136, 100], [104, 106], [72, 98]], c: '#8d96a0', m: 'mail' },
        ...(o.fur ? [{ p: [[70, 80], [90, 70], [118, 70], [136, 80], [132, 92, 1], [118, 86], [104, 92, 1], [90, 86], [76, 94, 1]], c: o.fur, m: 'fur', furLen: 1.2, flow: Math.PI * 0.5 }] : []),
        { p: tube([[146, 144, 6], [158, 178, 5]]), c: '#3a2418', m: 'leather', line: 0.6 },   // нож в ножнах
        { e: [145, 142, 4, 4], c: o.buckle || '#b08a3a', m: 'gold', line: 0.5 }],
      head: [...head(H.headX, H.headY, H.headR, { skin: SKIN, hair: o.hair, beard: o.hair, beardLen: 1.6 }), ...helm.hood(H.headX, H.headY, H.headR, { c: o.hood }),
        (f => ({ p: f.body, c: o.feather, m: 'feather', texSize: 0.3, line: 0.6, lines: [{ p: f.shaft, w: 0.8, light: true, a: 0.6 }] }))(K.leaf([H.headX - 16, H.headY - 20], -Math.PI * 0.8, 34, 11))],
      arm: armS,
    }));
  }
  ranger('ranger', { cloak: '#2e4a22', tunic: '#3e5e2a', sleeve: '#4a6a30', hood: '#2a4420', hose: '#4a3a2a', hair: '#6a3a1e', feather: '#3a2a1a', bowC: '#6a4020', dartHead: '#aab2bc', size: 1.0 });
  ranger('master_ranger', { cloak: '#6a7078', tunic: '#4a5a3a', sleeve: '#7a8088', hood: '#5a6068', hose: '#3a3a3a', hair: '#8a8a88', feather: '#f4f0e6', bowC: '#3a2418', dartHead: '#e0e6ee',
    trim: '#d8a53a', buckle: '#e8c050', bracer: '#d8a53a', fur: '#cfc6b4', plume: '#f4f0e6', size: 1.02 });

  /* =================== пещерный медведь ===================
     Улучшение медведя из vec_pilot.js: серо-сизый мех, светлая морда,
     шрамы и каменные наросты на загривке. Части медведя: 0–3 ноги, 4 корпус, 5 голова. */
  const BR = { fur: '#6e4a2c', far: '#50351f', head: '#7a5234', muz: '#b08a5e', dark: '#2a1a10', ear: '#3a2416' };
  const CB = { fur: '#6a6e76', far: '#4a4e58', head: '#767b83', muz: '#cfcabe', dark: '#1e2026', ear: '#34363c', stone: '#8a8478', scar: '#c8a8a0' };
  /** Каменная глыба-нарост: неровный многоугольник с гранью-трещиной. */
  const stone = (cx, cy, r, c, a) => { const pts = [0, 1, 2, 3, 4, 5, 6].map(i => { const t = i / 7 * Math.PI * 2 + (a || 0), k = [1, 0.8, 1.05, 0.9, 1, 0.75, 0.95][i]; return P(cx + Math.cos(t) * r * k * 1.15, cy + Math.sin(t) * r * k * 0.8, 1); });
    return { p: pts, c: c || CB.stone, m: 'horn', gloss: 0.35, line: 0.8, lc: '#2a2824', lines: [{ p: [[cx - r * 0.5, cy - r * 0.2], [cx + r * 0.1, cy + r * 0.1], [cx + r * 0.3, cy + r * 0.6]], w: 1, a: 0.55 }] }; };
  const HK = 1.14, hd = pts => pts.map(q => P(262 + (q[0] - 262) * HK, 118 + (q[1] - 118) * HK, q[2]));   // голова медведя увеличена от морды
  V.def('cave_bear', { base: 'bear', recolor: { [BR.fur]: CB.fur, [BR.far]: CB.far, [BR.head]: CB.head, [BR.muz]: CB.muz, [BR.dark]: CB.dark, [BR.ear]: CB.ear },
    add: [
      { part: 4, shapes: [
        // каменные наросты по хребту — как сросшиеся с шерстью сланцевые плиты
        stone(138, 92, 11, '#7e786e', 0.3), stone(162, 80, 14), stone(190, 68, 16, '#7e786e', 0.8), stone(218, 70, 13, null, 1.4), stone(238, 82, 9, '#7e786e'),
        { e: [104, 122, 7, 5], c: '#6fa0b0', m: 'gem', line: 0.5, glint: [[102, 120, 1.8]] },
        { e: [118, 110, 5, 4], c: '#6fa0b0', m: 'gem', line: 0.5, glint: [[116, 108, 1.5]] },
        ...[[[168, 112, 3.4], [158, 132, 3.2], [150, 156, 2]], [[182, 116, 3.4], [172, 140, 3.2], [166, 162, 2]], [[196, 120, 3], [188, 142, 2]]].map(q => ({ p: tube(q), c: CB.scar, m: 'skin', line: 0.4, lc: '#5a3a36' })),
      ] },
      { part: 5, shapes: [
        // шрам через глаз и каменный нарост на лбу
        { p: tube(hd([[264, 98], [272, 110], [278, 124]]).map(q => [q[0], q[1], 3])), c: CB.scar, m: 'skin', line: 0.4, lc: '#5a3a36' },
        stone(...hd([[252, 92]])[0], 9, '#7e786e', 0.5),
      ] },
    ] });

  /* =================== великий олень / король леса ===================
     Высокий благородный олень: крепкий круп, длинные ноги, косматый подгрудок,
     ветвистые берёзово-светлые рога. Король леса — белая шерсть, огромные золотые рога-корона
     в листьях, венок на шее и зелёное сияние-аура с искрами. */
  /** Рог: основа base, ствол beam, отростки tines [индекс точки ствола, x, y, x2, y2]. */
  function antler(base, beam, tines, w, c, m) {
    const out = [], n = beam.length + 1;
    const pts = [base, ...beam].map((q, i) => [q[0], q[1], w * (1 - i / n * 0.72)]);
    out.push({ p: tube(pts), c, m: m || 'horn', gloss: 0.9, line: 0.7, lines: [{ p: pts.slice(0, -1).map(q => [q[0] - q[2] * 0.2, q[1]]), w: 1.2, light: true, a: 0.5 }] });
    for (const t of tines) {
      const q = pts[t[0]], tw = q[2] * 0.8;
      out.push({ p: tube([[q[0], q[1], tw], [t[1], t[2], tw * 0.62], [t[3], t[4], tw * 0.34]]), c, m: m || 'horn', gloss: 0.9, line: 0.7 });
    }
    // шишка-«розетка» у основания
    out.push({ e: [base[0], base[1], w * 0.62, w * 0.45], c: tone(c, -0.15), m: m || 'horn', line: 0.6 });
    return out;
  }
  function stag(name, o) {
    const c = o.coat, far = tone(c, -0.25), hf = o.hoof, cr = o.cream;
    const haunch = (col, dx, dy) => ({ p: move2([[90, 150], [132, 144], [144, 176], [136, 208], [116, 226], [98, 208], [88, 178]], dx, dy), c: col, m: 'fur', furLen: 0.5, flow: Math.PI * 0.55, belly: 0.3 });
    const legs = [
      { kind: 'leg', side: 1, pivot: [100, 188], shapes: [haunch(far, -18, -2), ...hoofLeg([98, 190], [88, 236], [96, 262], [100, G - 3], 26, far, hf, {})] },
      { kind: 'leg', side: -1, pivot: [224, 192], shapes: hoofLeg([224, 184], [230, 236], [228, 262], [232, G - 3], 22, far, hf, {}) },
      { kind: 'leg', side: -1, pivot: [120, 190], shapes: [haunch(c, 0, 0), ...hoofLeg([120, 196], [108, 238], [116, 264], [120, G], 30, c, hf, {})] },
      { kind: 'leg', side: 1, pivot: [242, 194], shapes: hoofLeg([242, 184], [248, 238], [246, 266], [252, G], 27, c, hf, {}) },
    ];
    const body = [
      // короткий хвост вниз, светлое «зеркало» на крупе
      { p: [[80, 138], [68, 140], [62, 156], [66, 170, 1], [76, 160]], c, m: 'fur', furLen: 0.5, flow: Math.PI * 0.5, line: 0.6, sub: [{ p: [[60, 150], [72, 150], [72, 176], [60, 176]], c: cr, m: 'fur', line: 0 }] },
      { p: [[70, 160], [80, 136], [108, 124], [150, 128], [196, 120], [232, 122], [256, 142], [262, 176], [250, 202], [228, 210], [196, 206], [156, 204], [120, 212], [92, 204], [74, 186]],
        c, m: 'fur', furLen: 0.5, dens: 0.8, belly: 0.4,
        lines: [{ p: [[236, 146], [244, 176], [238, 200]], w: 1.2, a: 0.35 }, { p: [[100, 132], [150, 132], [200, 124]], w: 1.4, light: true, a: 0.4 }],
        sub: [{ p: [[56, 128], [80, 130], [88, 158], [82, 192], [56, 192]], c: tone(cr, -0.12), m: 'fur', furLen: 0.4, flow: Math.PI * 0.5, line: 0 }, { p: [[120, 198], [238, 190], [250, 218], [120, 218]], c: tone(c, 0.3), m: 'fur', furLen: 0.4, line: 0 },
          ...(o.spots ? o.spots.map(([x, y]) => ({ e: [x, y, 3.5, 2.6], c: o.spotC || cr, m: 'flat', line: 0 })) : [])] },
    ];
    const aF = antler([272, 62], o.far.beam, o.far.tines, o.antW * 0.9, tone(o.antler, -0.2), o.antM);
    const aN = antler([290, 60], o.near.beam, o.near.tines, o.antW, o.antler, o.antM);
    const headS = [
      ...aF,
      // шея и косматый подгрудок по горлу
      { p: [[210, 152], [220, 112], [242, 80], [264, 64], [286, 68], [292, 92], [282, 124], [268, 158], [242, 178]], c, m: 'fur', furLen: 0.5, flow: Math.PI * 0.6,
        lines: [{ p: [[262, 80], [246, 110], [232, 146]], w: 1.2, light: true, a: 0.35 }] },
      { p: [[278, 96], [292, 94], [294, 120], [288, 148], [282, 176, 1], [274, 160], [268, 184, 1], [260, 166], [250, 182, 1], [248, 160], [262, 130]], c: o.ruff, m: 'fur', furLen: 1.3, flow: Math.PI * 0.5, dens: 1.2 },
      ...(o.wreath || []),
      { p: [[274, 66], [244, 54, 1], [260, 74]], c: far, m: 'fur', furLen: 0.3, line: 0.6 },
      { p: [[266, 72], [284, 54], [304, 56], [322, 76], [338, 96], [342, 108], [332, 116], [314, 114], [296, 100], [278, 92]], c, m: 'fur', furLen: 0.35, flow: Math.PI * 0.9,
        lines: [{ p: [[300, 64], [324, 90]], w: 1.2, light: true, a: 0.45 }],
        sub: [{ p: [[318, 92], [346, 94], [346, 120], [312, 118]], c: tone(c, -0.35), m: 'fur', furLen: 0.3, line: 0 }, { p: [[318, 106], [340, 110], [336, 120], [314, 118]], c: cr, m: 'fur', furLen: 0.3, line: 0 }] },
      { e: [338, 100, 5, 4], c: '#1a1210', m: 'horn', gloss: 1.2, line: 0.4 },
      eye(302, 76, 4.4, 3.6, o.eye, false),
      { p: [[286, 64], [262, 44, 1], [270, 62], [280, 76]], c, m: 'fur', furLen: 0.3, line: 0.6, sub: [{ p: [[282, 66], [268, 50], [274, 66]], c: '#c8a098', m: 'skin', line: 0 }] },
      ...aN,
      ...(o.leaves || []),
      ...(o.sparks || []),
    ];
    const parts = [];
    if (o.aura) parts.push({ kind: 'torso', pivot: [170, 170], shapes: o.aura });
    parts.push(legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [170, 170], shapes: body },
      { kind: 'head', pivot: [240, 150], shapes: headS });
    V.def(name, place(name, parts, [170, G], o.size));
  }
  const leafShape = (B, ang, len, col) => { const f = K.leaf(B, ang, len, len * 0.5); return { p: f.body, c: col, m: 'leather', gloss: 0.6, line: 0.5, lines: [{ p: f.shaft, w: 0.7, light: true, a: 0.5 }] }; };
  // великий олень: ветвистые берёзово-светлые рога
  stag('great_stag', { coat: '#a8723e', cream: '#f0e4c8', ruff: '#7a5230', hoof: '#2e241c', eye: '#1a120c', antler: '#ece4cc', antW: 13, size: 0.92,
    near: { beam: [[296, 36], [294, 12], [304, -10], [322, -26]], tines: [[1, 314, 30, 328, 26], [2, 316, 4, 330, -2], [3, 298, -26, 292, -42], [4, 336, -38, 342, -52]] },
    far: { beam: [[262, 36], [250, 12], [242, -8], [236, -28]], tines: [[1, 240, 32, 226, 26], [2, 230, 6, 216, 0], [3, 250, -24, 254, -40], [4, 222, -40, 214, -50]] } });
  // король леса: белая шерсть, золотые рога-корона в листьях, венок, аура и искры
  const kingLeaves = [], kingSparks = [], wreath = [], aura = [];
  [[330, -30, -0.6], [312, -58, -1.5], [344, -50, -1.0], [246, -44, -2.0], [216, -34, -2.6], [336, 16, -0.3], [222, 18, -2.9], [292, -52, -1.8], [262, -60, -1.7], [216, -60, -2.2]].forEach(([x, y, a], i) =>
    kingLeaves.push(leafShape([x, y], a, 15 + (i % 3) * 3, i % 2 ? '#4a9a3a' : '#6ab848')));
  [[206, 60], [356, 36], [188, -8], [362, -34], [236, -86], [320, -90], [196, -56], [370, -70], [278, -96], [180, 30]].forEach(([x, y], i) =>
    kingSparks.push({ e: [x, y, 2.6 + (i % 3), 2.6 + (i % 3)], c: '#c8ffa8', m: 'gem', line: 0, glint: [[x, y, 4 + (i % 3)]] }));
  // сияние: несколько прозрачных овалов вокруг рогов — мягкий край без жёсткой границы
  for (let i = 0; i < 5; i++) aura.push({ e: [284, 8 + i * 6, 70 + i * 22, 58 + i * 26], c: 'rgba(170,255,140,0.055)', m: 'flat', line: 0 });
  for (let i = 0; i < 8; i++) {
    const t = i / 7, x = 244 + t * 42, y = 164 - t * 56;
    wreath.push(leafShape([x, y], i % 2 ? Math.PI * 0.62 : Math.PI * 0.12, 18, i % 2 ? '#3e8a34' : '#5aa840'));
  }
  wreath.push({ e: [256, 146, 3.6, 3.6], c: '#d8303a', m: 'gem', line: 0.4 }, { e: [270, 128, 3.6, 3.6], c: '#d8303a', m: 'gem', line: 0.4 }, { e: [282, 112, 3.4, 3.4], c: '#f0e8f8', m: 'gem', line: 0.4 });
  stag('forest_king', { coat: '#e8e4d8', cream: '#fbf8ee', ruff: '#d0ccb4', hoof: '#d0a840', eye: '#2a8a1a', antler: '#e8b440', antM: 'gold', antW: 15, size: 0.94,
    aura, leaves: kingLeaves, sparks: kingSparks, wreath, spotC: '#c8d8b8',
    spots: [[140, 146], [162, 156], [184, 142], [204, 154], [124, 160], [218, 138]],
    near: { beam: [[298, 34], [296, 8], [308, -16], [328, -34]], tines: [[1, 318, 28, 332, 22], [2, 320, 2, 334, -6], [3, 298, -30, 292, -48], [3, 314, -40, 316, -58], [4, 338, -52, 342, -68], [4, 346, -34, 360, -40]] },
    far: { beam: [[262, 34], [248, 10], [240, -12], [234, -32]], tines: [[1, 238, 30, 222, 24], [2, 226, 4, 210, -2], [3, 250, -28, 256, -46], [4, 220, -44, 212, -56], [4, 238, -50, 240, -66]] } });
})(typeof window !== 'undefined' ? window : globalThis);
