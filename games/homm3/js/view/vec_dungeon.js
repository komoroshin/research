/* ============================================================================
   view/vec_dungeon.js — Подземелье на рисованном конвейере.
   Троглодит, гарпия, бехолдер, медуза, минотавр, мантикора, красный дракон
   и их улучшения. Краски фракции — пурпур, серо-сизое, красное.
   Каждое существо — функция с параметрами; улучшение — тот же рисунок
   с другой гаммой и своей деталью (рога, корона, шипы, лишние глаза).
   Звери нарисованы прямо в рамке старого спрайта (K.frameOf) и вписаны fit().
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, move, grow, rot, ell, lerp, along, weapon, helm, head, arm, leg, torso, humanoid, wing, fit, frameOf, mapShapes, tone, H } = K;

  /* ---------- общие помощники ---------- */
  /** Вписать зверя, нарисованного в своей рамке (ground — точка опоры), в рамку старого спрайта. */
  function place(name, parts, ground, size) {
    const to = frameOf(name) || { w: ground[0] * 2, h: ground[1] + 4, anchor: ground };
    return fit(parts, { ground, height: ground[1] }, to, to.anchor[1] / ground[1] * (size || 1));
  }
  /** Лапа зверя: суставы трубкой [[x, y, толщина]…], внизу стопа длиной pl с когтями. o: { m, flow, tex, claw, pl, ph, furLen } */
  function beastLeg(joints, foot, c, o) {
    o = o || {};
    const [fx, fy] = foot, pl = o.pl || 30, ph = o.ph || 12, out = [];
    out.push({ p: tube(joints, { flat0: true }), c, m: o.m || 'fur', flow: Math.PI * 0.5, furLen: o.furLen || 0.6, tex: o.tex, texSize: o.texSize, belly: 0.25 });
    out.push({ p: [[fx - pl * 0.55, fy - ph], [fx + pl * 0.12, fy - ph * 1.1], [fx + pl * 0.46, fy - ph * 0.55], P(fx + pl * 0.52, fy, 1), P(fx - pl * 0.62, fy, 1)], c: o.pawC || c, m: o.m || 'fur', furLen: 0.4, flow: Math.PI * 0.5, tex: o.tex, texSize: o.texSize,
      lines: [{ p: [[fx + pl * 0.1, fy - ph * 0.7], [fx + pl * 0.14, fy]], w: 0.9, a: 0.5 }, { p: [[fx + pl * 0.3, fy - ph * 0.5], [fx + pl * 0.32, fy]], w: 0.9, a: 0.5 }] });
    if (o.claw) for (let i = 0; i < 3; i++) {
      const x = fx + pl * 0.48 - i * pl * 0.2, y = fy - 1.5;
      out.push({ p: [P(x - 3, y - 4, 1), P(x + (o.clawL || 7), y + 1.5, 1), P(x - 3, y + 1.5, 1)], c: o.claw, m: 'horn', line: 0.5 });
    }
    return out;
  }
  /** Глаз-яблоко: белок, радужка, зрачок (slit — щелью), блик. */
  function eyeball(cx, cy, r, iris, o) {
    o = o || {};
    return [
      { e: [cx, cy, r, r], c: o.white || '#f2eee4', m: 'gem', gloss: 0.8, line: 0.7, lc: o.lc,
        sub: [{ e: [cx + r * (o.look || 0.28), cy, r * 0.58, r * 0.6], c: iris, m: 'gem', line: 0,
          sub: [{ e: [cx + r * ((o.look || 0.28) + 0.06), cy, r * (o.slit ? 0.13 : 0.26), r * (o.slit ? 0.48 : 0.28)], c: '#0c0608', m: 'flat', line: 0 }] }] },
      { e: [cx + r * 0.05, cy - r * 0.35, r * 0.2, r * 0.16], c: '#ffffff', m: 'flat', line: 0 },
    ];
  }
  /** Ряд зубов вдоль линии a→b (остриём по dir: 1 — вниз, −1 — вверх). */
  function teeth(a, b, n, len, c, dir) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t0 = (i + 0.15) / n, t1 = (i + 0.85) / n, p0 = lerp(a, b, t0), p1 = lerp(a, b, t1), m = lerp(a, b, (t0 + t1) / 2);
      out.push({ p: [P(...p0, 1), P(m[0], m[1] + len * (dir || 1), 1), P(...p1, 1)], c: c || '#f0ead8', m: 'horn', line: 0.4 });
    }
    return out;
  }
  /** Рог изогнутой трубкой: осевые точки [[x, y, толщина]…], кончик острый; tip — цвет кончика. */
  function hornT(pts, c, tip) {
    const s = { p: tube(pts), c, m: 'horn', gloss: 0.9, lines: [] };
    for (let i = 1; i < pts.length - 1; i++) {   // кольца на роге
      const a = pts[i - 1], b = pts[i + 1], [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), w = pts[i][2] * 0.5;
      s.lines.push({ p: [[pts[i][0] - ty * w, pts[i][1] + tx * w], [pts[i][0] + ty * w, pts[i][1] - tx * w]], w: 0.8, a: 0.4 });
    }
    if (tip) { const n = pts.length; s.sub = [{ p: tube(pts.slice(Math.max(0, n - 2)).map((q, i) => [q[0], q[1], q[2] * 2.2])), c: tip, m: 'horn', line: 0 }]; }
    return s;
  }
  /** Шипы-гребень вдоль линии pts: треугольники наружу; side 1 — слева от хода (при ходе вправо — вверх), −1 — справа. */
  function spikes(pts, n, h, c, side, m) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, k = t * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(k)), f = k - j;
      const a = pts[j], b = pts[j + 1], p = lerp(a, b, f), [tx, ty] = norm(b[0] - a[0], b[1] - a[1]), nx = ty * (side || -1), ny = -tx * (side || -1);
      const hh = h * (1 - Math.abs(t - 0.4) * 0.9), w = h * 0.45;
      out.push({ p: [P(p[0] - tx * w, p[1] - ty * w, 1), P(p[0] + nx * hh - tx * w * 0.6, p[1] + ny * hh - ty * w * 0.6, 1), P(p[0] + tx * w, p[1] + ty * w, 1)], c, m: m || 'horn', line: 0.6 });
    }
    return out;
  }
  /** Сдвинуть и увеличить формы канона гуманоида (для существ, у которых ниже пояса не ноги). */
  const canon = (list, dx, dy, k) => mapShapes(list, (x, y) => [x * k + dx, y * k + dy], k);
  /** Увеличить формы вокруг точки (cx, cy). */
  const scaleAt = (list, cx, cy, k) => canon(list, cx - cx * k, cy - cy * k, k);
  /** Отразить формы по вертикали x = cx (крыло, развёрнутое в другую сторону); направление фактуры тоже отражается. */
  function mirror(list, cx) {
    const fl = s => { const o = Object.assign({}, s); if (s.flow !== undefined) o.flow = Math.PI - s.flow; if (s.sub) o.sub = s.sub.map(fl); return o; };
    return mapShapes(list, (x, y) => [2 * cx - x, y], 1).map(fl);
  }

  /* =================== троглодит / адский троглодит =================== */
  function troglodyte(name, o) {
    const sk = o.skin, skD = tone(sk, -0.2), bel = o.belly;
    const legs = (hip, foot, side) => {
      const c = side < 0 ? skD : sk;
      const out = leg([hip[0], hip[1] - 2], [foot[0] + (side < 0 ? 0 : 2), foot[1]], { style: 'bare', c, skin: c, tw: 30, toe: 8, bend: 9 });
      for (let i = 0; i < 3; i++) out.push({ p: [P(foot[0] + 10 - i * 7, foot[1] - 6, 1), P(foot[0] + 20 - i * 7, foot[1], 1), P(foot[0] + 8 - i * 7, foot[1], 1)], c: o.claw, m: 'horn', line: 0.5 });
      return out;
    };
    // хвост и дальняя рука — за корпусом
    const tail = [[82, 150, 30], [62, 176, 24], [46, 206, 17], [30, 232, 10], [14, 244, 5]];
    const back = [
      { p: tube(tail), c: skD, m: 'skin', tex: 'scale', texSize: 0.7, belly: 0.3, lines: [{ p: tail.map(q => [q[0] + 4, q[1] - q[2] * 0.3]), w: 1, light: true, a: 0.35 }] },
      ...(o.spikes ? spikes(tail.slice(0, 4).map(q => [q[0] - q[2] * 0.3, q[1] - q[2] * 0.35]), 4, 10, o.spikes, -1) : []),
      ...arm([82, 92], [70, 122], [80, 146], { c: skD, m: 'skin', hand: skD, handM: 'skin', w: 17 }),
    ];
    const body = [
      // сгорбленный корпус ящера: грудь выпячена, спина круглая
      { p: [[70, 92], [92, 78], [124, 80], [140, 96], [138, 124], [128, 150], [80, 152], [66, 124]], c: sk, m: 'skin', tex: 'scale', texSize: 0.8, id: 'chest',
        sub: [{ p: [[102, 84], [138, 92], [140, 150], [96, 150], [100, 118]], c: bel, m: 'skin', line: 0,
          lines: [0, 1, 2, 3, 4].map(i => ({ p: [[100, 96 + i * 12], [140, 98 + i * 12]], w: 1.1, a: 0.45 })) }],
        lines: [{ p: [[78, 100], [90, 124], [88, 146]], w: 1.2, a: 0.35 }] },
      // набедренная повязка
      { p: [[74, 140], [128, 140], [134, 160], [124, 184, 1], [110, 172], [100, 186, 1], [88, 170], [74, 180, 1], [70, 160]], c: o.loin, m: 'leather', belly: 0.3, id: 'loin',
        lines: [{ p: [[98, 150], [100, 180]], w: 1, a: 0.4 }] },
      { p: [[74, 136], [130, 136], [131, 146], [73, 146]], c: o.belt, m: 'leather', sub: [{ e: [106, 141, 6, 6], c: o.bone, m: 'horn', line: 0.5 }] },
      ...(o.spikes ? spikes([[70, 128], [70, 100], [86, 80], [100, 72]], 4, 12, o.spikes, 1) : []),
      { p: tube([[100, 64, 26], [96, 88, 32]]), c: sk, m: 'skin', id: 'neck' },
    ];
    // безглазая голова ящера: тупая широкая морда, приоткрытая пасть, на месте глаз — гладкий надбровный валик
    const hx = 0, hy = 6;
    const HD = pts => move(pts, hx, hy);
    const headS = [
      // гребень-перепонка на затылке
      { p: HD([[86, 40], [66, 22, 1], [80, 24], [74, 6, 1], [92, 18], [94, 0, 1], [106, 18], [98, 34]]), c: o.crest, m: 'skin', line: 0.7, belly: 0.3, id: 'crest',
        lines: [{ p: HD([[84, 36], [72, 18]]), w: 0.9, a: 0.4 }, { p: HD([[92, 32], [84, 10]]), w: 0.9, a: 0.4 }, { p: HD([[98, 30], [96, 8]]), w: 0.9, a: 0.4 }] },
      // тёмное нутро пасти
      { p: HD([[112, 56], [150, 52], [162, 54], [158, 68], [132, 74], [112, 70]]), c: '#4a1418', m: 'skin', line: 0 },
      // нижняя челюсть, опущена
      { p: HD([[92, 64], [116, 66], [142, 68], [160, 66], [162, 72], [150, 82], [124, 88], [100, 84], [90, 76]]), c: tone(sk, -0.06), m: 'skin', id: 'jaw',
        sub: [{ p: HD([[104, 78], [160, 72], [156, 92], [104, 92]]), c: bel, m: 'skin', line: 0 }] },
      ...teeth(HD([[118, 69]])[0], HD([[158, 68]])[0], 6, -5, '#e8dcc0', 1),
      // череп и верхняя челюсть
      { p: HD([[78, 58], [78, 34], [92, 16], [114, 8], [136, 12], [152, 26], [162, 42], [166, 54], [158, 58], [136, 58], [114, 60], [100, 70], [86, 70]]), c: sk, m: 'skin', tex: 'scale', texSize: 0.55, id: 'skull',
        lines: [{ p: HD([[94, 22], [116, 14], [138, 20]]), w: 1.2, light: true, a: 0.5 }, { p: HD([[122, 46], [132, 50]]), w: 1, a: 0.35 }, { p: HD([[118, 52], [124, 56]]), w: 1, a: 0.3 }] },
      ...teeth(HD([[116, 58]])[0], HD([[162, 56]])[0], 7, 6, '#f0e8d0', 1),
      // надбровный валик без глаз и ноздря
      { p: tube(HD([[104, 30, 8], [124, 24, 11], [142, 28, 8], [152, 38, 4]])), c: tone(sk, 0.1), m: 'skin', line: 0.6, id: 'brow' },
      { p: HD([[118, 36], [134, 34], [144, 38], [132, 42], [120, 42]]), c: tone(sk, -0.12), m: 'skin', line: 0.5 },   // заросшая глазница
      { e: [...HD([[158, 46]])[0], 2.4, 1.6], c: '#1a1010', m: 'flat', line: 0 },
      ...(o.horns ? [hornT(HD([[98, 26, 9], [96, 10, 7], [86, -2, 3]]), o.horns), hornT(HD([[116, 20, 9], [122, 4, 7], [116, -10, 3]]), o.horns)] : []),
    ];
    const hand = [148, 134], dir = [0.2, -1];
    V.def(name, humanoid({
      name, size: o.size || 0.98,
      legs,
      back, body, head: headS,
      arm: [
        ...weapon.polearm(hand, dir, 124, { kind: 'spear', back: 70, head: o.tip, shaft: o.shaft }),
        ...(o.tuft ? [{ p: move([[0, 0], [-10, 10], [-4, 22], [4, 12]], ...along(hand, dir)(114, 2)), c: o.tuft, m: 'fur', furLen: 0.8, flow: Math.PI * 0.55 }] : []),
        ...arm([124, 92], [140, 118], hand, { c: sk, m: 'skin', hand: sk, handM: 'skin', w: 17 }),
        ...[0, 1, 2].map(i => ({ p: [P(hand[0] + 6, hand[1] - 5 + i * 5, 1), P(hand[0] + 13, hand[1] - 3 + i * 5, 1), P(hand[0] + 6, hand[1] - 1 + i * 5, 1)], c: o.claw, m: 'horn', line: 0.4 })),
      ],
    }));
  }
  troglodyte('troglodyte', { skin: '#8e96a4', belly: '#c9c2b2', crest: '#6e5a86', loin: '#6a4a2e', belt: '#4a3020', bone: '#e8dcc0', claw: '#e8e0cc', tip: '#6a6470', shaft: '#7a5230', tuft: '#8a6a9a' });
  troglodyte('infernal_troglodyte', { skin: '#b4402e', belly: '#e8a060', crest: '#3a1a1a', loin: '#2e1e1e', belt: '#1a1010', bone: '#f0c040', claw: '#2a1a14', tip: '#3a3a40', shaft: '#3a2418', tuft: '#f0a030', spikes: '#3a2020', horns: '#2a1a14' });

  /* =================== гарпия / гарпия-ведьма =================== */
  function harpy(name, o) {
    const sk = o.skin, W = o.wing;
    // птичьи ноги: оперённое бедро-«штанина», длинная чешуйчатая цевка, три пальца вперёд и один назад
    const legs = (hip, foot, side) => {
      const d = side < 0 ? -0.2 : 0, fc = tone(o.feet, d), ft = tone(W.cov, d - 0.05);
      const knee = [hip[0] + 8, hip[1] + 30], ank = [foot[0] - 6, foot[1] - 8];
      const out = [{ p: tube([[knee[0], knee[1], 11], [(knee[0] + ank[0]) / 2 - 3, (knee[1] + ank[1]) / 2, 8], [ank[0], ank[1], 8]]), c: fc, m: 'horn', tex: 'scale', texSize: 0.35 }];
      out.push({ p: [P(ank[0] - 3, ank[1] - 1, 1), P(ank[0] - 16, foot[1] + 1, 1), P(ank[0] + 3, ank[1] + 4, 1)], c: o.talon, m: 'horn', line: 0.5 });
      for (let i = 0; i < 3; i++) {
        const tx = ank[0] + 22 - i * 8, ty = foot[1] - i * 0.8;
        out.push({ p: [[ank[0] - 3, ank[1] - 3], [tx - 4, ty - 5], [tx + 1, ty - 2, 1], [tx - 3, ty + 1], [ank[0] - 3, ank[1] + 5]], c: fc, m: 'horn', line: 0.6 },
          { p: [P(tx - 2, ty - 5, 1), P(tx + 8, ty - 1, 1), P(tx + 3, ty + 1, 1), P(tx - 4, ty, 1)], c: o.talon, m: 'horn', line: 0.5 });
      }
      out.push({ p: [[hip[0] - 13, hip[1] - 10], [hip[0] + 14, hip[1] - 12], [knee[0] + 11, knee[1] - 6], [knee[0] + 8, knee[1] + 8, 1], [knee[0], knee[1] + 3], [knee[0] - 7, knee[1] + 10, 1], [hip[0] - 13, hip[1] + 18]], c: ft, m: 'feather', texSize: 0.45, flow: Math.PI * 0.5 });
      return out;
    };
    const Wf = { pri: tone(W.pri, -0.18), pri2: tone(W.pri2 || W.pri, -0.18), sec: tone(W.sec, -0.18), sec2: tone(W.sec2 || W.sec, -0.18), cov: tone(W.cov, -0.18), cov2: tone(W.cov2, -0.18) };
    const body = [
      // короткая перьевая юбка, стройный женский торс, грудь в пуху
      { p: [[80, 136], [124, 136], [134, 160], [128, 178, 1], [116, 170], [104, 182, 1], [94, 170], [82, 180, 1], [72, 166], [72, 150]], c: W.cov, m: 'feather', texSize: 0.45, flow: Math.PI * 0.5, belly: 0.3 },
      { p: [[80, 84], [120, 82], [130, 96], [126, 118], [120, 142], [86, 142], [78, 120], [72, 98]], c: sk, m: 'skin', id: 'chest',
        lines: [{ p: [[100, 126], [102, 136]], w: 1, a: 0.3 }] },
      { p: [[74, 94], [94, 84], [114, 84], [130, 92], [132, 106], [122, 116, 1], [114, 108], [104, 118, 1], [94, 108], [84, 116, 1], [74, 108]], c: W.cov2, m: 'feather', texSize: 0.38, flow: Math.PI * 0.5 },
      { p: [[80, 132], [122, 132], [124, 140], [78, 140]], c: o.belt, m: 'leather', line: 0.6 },
      ...(o.necklace ? [{ p: tube([[88, 84, 2.6], [104, 94, 2.6], [122, 86, 2.6]]), c: o.necklace, m: 'horn', line: 0.4 }, { p: [P(100, 94, 1), P(104, 108, 1), P(108, 94, 1)], c: o.necklace, m: 'horn', line: 0.5 }] : []),
      { p: tube([[H.headX - 4, 70, 14], [H.headX - 6, 86, 17]]), c: sk, m: 'skin', id: 'neck' },
    ];
    const headS = [
      // длинные волосы, развеваются назад
      { p: [[84, 36], [70, 50], [60, 80], [48, 104, 1], [66, 96], [62, 118, 1], [80, 98], [84, 110, 1], [92, 84], [96, 60]], c: tone(o.hair, -0.1), m: 'fur', furLen: 1.2, flow: Math.PI * 0.6 },
      ...head(H.headX, H.headY, H.headR, { skin: sk, hair: o.hair, hairStyle: 'short', eye: o.eye, browC: tone(o.hair, -0.2) }),
      { p: [[80, 44], [76, 28, 1], [90, 32], [94, 20, 1], [104, 30], [116, 22, 1], [118, 34], [128, 34, 1], [118, 42], [96, 40]], c: o.hair, m: 'fur', furLen: 0.9, flow: -Math.PI * 0.4 },
    ];
    if (o.hag) headS.push(
      { p: [[124, 48], [136, 52], [134, 66, 1], [126, 60]], c: tone(sk, -0.1), m: 'skin', line: 0.6 },   // крючковатый нос
      { p: [P(86, 50, 1), P(72, 38, 1), P(92, 46, 1)], c: sk, m: 'skin', line: 0.6 },                    // острое ухо
      { p: [P(116, 66, 1), P(118, 72, 1), P(121, 66, 1)], c: '#e8e0c8', m: 'horn', line: 0.4 });        // клык
    // крылья вместо рук, разведены «галочкой»: дальнее — вперёд-вверх (зеркальное), ближнее — назад-вверх
    V.def(name, humanoid({
      name, size: o.size || 0.86, dx: 4,
      before: [
        { kind: 'prop', pivot: [116, 94], shapes: mirror(wing.feather([116, 94], [-0.5, -1], 118, Wf), 116) },
        { kind: 'prop', pivot: [92, 94], shapes: wing.feather([92, 94], [-0.75, -0.8], 130, W) },
      ],
      legs, body, head: headS,
    }));
  }
  harpy('harpy', { skin: '#e6b48c', hair: '#4a2a1a', eye: '#3a2010', feet: '#e0a838', talon: '#2a1e18', belt: '#8a5a2a',
    wing: { pri: '#7a4a22', pri2: '#8a5628', sec: '#c8862e', sec2: '#b8782a', cov: '#e0a83c', cov2: '#f0c860' } });
  harpy('harpy_hag', { skin: '#9ab070', hair: '#dcdcd4', eye: '#e02020', feet: '#8a8a70', talon: '#1a1414', belt: '#3a2a3a', hag: true, necklace: '#e8dcc0',
    wing: { pri: '#2e2c36', pri2: '#3a3844', sec: '#5a5866', sec2: '#4e4c5a', cov: '#7a7888', cov2: '#9a98a6' } });

  /* =================== бехолдер / злой глаз =================== */
  function beholder(name, o) {
    const cx = 110, cy = 146, R = 64, c = o.body, cD = tone(c, -0.2);
    // стебельки глаз: основание на макушке, изгиб, глаз на конце
    const stalk = (bx, by, mx, my, ex, ey, w, dark) => {
      const col = dark ? cD : c;
      return [{ p: tube([[bx, by, w], [mx, my, w * 0.7], [ex, ey, w * 0.55]]), c: col, m: 'skin', belly: 0.2 }, ...eyeball(ex, ey, w * 1.05, o.stalkIris, { lc: tone(col, -0.5), slit: o.slit })];
    };
    const farSt = [], nearSt = [];
    for (const s of o.stalks) (s[7] ? farSt : nearSt).push(...stalk(...s.slice(0, 7), s[7]));
    const bodyS = [
      { p: ell(cx, cy, R, R * 0.95, 16), c, m: 'skin', belly: 0.45, rim: 0.7, tex: o.tex, texSize: 1.2,
        sub: [
          ...o.spots.map(s => ({ e: s, c: tone(c, 0.14), m: 'skin', line: 0 })),
          { p: ell(cx - 30, cy + 20, 50, 46, 12), c: cD, m: 'skin', line: 0, gloss: 0 },
        ] },
      // пасть внизу, чуть вперёд
      { p: [[92, 176], [124, 182], [152, 172], [164, 160], [168, 170], [158, 190], [132, 202], [104, 198], [88, 186]], c: '#3a0c1e', m: 'skin', line: 0.9, id: 'mouth',
        sub: [{ p: [[96, 196], [150, 188], [150, 206], [96, 206]], c: '#8a2a3a', m: 'skin', line: 0 }] },
      ...teeth([94, 178], [164, 164], o.teeth, 8, '#f2ecd8', 1),
      ...teeth([104, 198], [156, 186], o.teeth - 2, -7, '#e8e0c8', 1),
      // большой глаз с веком
      { e: [142, 132, 34, 32], c: tone(c, 0.08), m: 'skin', line: 0.9 },
      ...eyeball(146, 132, 26, o.iris, { look: 0.3, slit: o.slit }),
      { p: tube([[112, 110, 7], [140, 98, 9], [170, 110, 6]]), c: tone(c, -0.1), m: 'skin', id: 'brow' },
      ...(o.horns ? o.horns.map(h => hornT(h, o.hornC)) : []),
    ];
    const parts = [
      { kind: 'head', pivot: [cx, cy - R + 6], shapes: farSt },
      { kind: 'torso', pivot: [cx, cy + R], shapes: bodyS },
      { kind: 'head', pivot: [cx, cy - R + 6], shapes: nearSt },
    ];
    V.def(name, place(name, parts, [113, 230]));
  }
  // стебельки: [основание x, y, изгиб x, y, глаз x, y, толщина, дальний?]
  beholder('beholder', { body: '#7c3a9a', iris: '#5ac8e8', stalkIris: '#5ac8e8', teeth: 7, tex: false,
    spots: [[80, 110, 8, 6], [70, 150, 6, 5], [96, 96, 5, 4], [124, 186, 5, 4]],
    stalks: [[86, 96, 66, 72, 56, 48, 12, 1], [124, 90, 136, 64, 126, 38, 12, 1], [100, 88, 94, 60, 90, 34, 13], [140, 98, 164, 80, 172, 58, 12]] });
  beholder('evil_eye', { body: '#a8302a', iris: '#f0a020', stalkIris: '#f07a20', teeth: 9, slit: true, tex: 'scale',
    spots: [[80, 110, 8, 6], [70, 150, 6, 5], [96, 96, 5, 4], [124, 186, 5, 4]],
    hornC: '#2a1a1a', horns: [[[70, 104, 12], [52, 90, 8], [44, 70, 3]], [[62, 138, 10], [42, 132, 7], [30, 118, 3]]],
    stalks: [[82, 100, 58, 84, 40, 66, 10, 1], [116, 88, 124, 60, 112, 32, 11, 1], [134, 92, 154, 64, 152, 36, 10, 1],
      [98, 88, 86, 60, 76, 40, 12], [146, 102, 172, 88, 184, 66, 11], [70, 120, 44, 116, 26, 102, 10]] });

  /* =================== медуза / королева медуз =================== */
  function medusa(name, o) {
    const sk = o.skin, T = o.tail, TD = tone(T, -0.2), B = o.belly;
    // змеиный хвост: передняя петля на земле и дальний конец, уходящий назад и вверх
    const back = [[166, 292, 36], [124, 302, 34], [82, 300, 30], [46, 288, 24], [24, 266, 16], [20, 244, 10], [30, 230, 5]];
    const front = [[118, 158, 48], [120, 194, 54], [130, 228, 54], [150, 258, 48], [170, 282, 40], [176, 300, 34]];
    const belly = (pts, side) => pts.map(q => [q[0] + q[2] * 0.28 * side, q[1], q[2] * 0.46]);
    const plates = (pts, side) => pts.slice(1, -1).map(q => ({ p: [[q[0] + q[2] * 0.02 * side, q[1] - 2], [q[0] + q[2] * 0.5 * side, q[1] + 1]], w: 1, a: 0.45 }));
    const tailS = [
      { p: tube(back), c: TD, m: 'skin', tex: 'scale', texSize: 0.8, belly: 0.3,
        sub: [{ p: tube(back.map(q => [q[0], q[1] + q[2] * 0.3, q[2] * 0.5])), c: tone(B, -0.15), m: 'skin', line: 0 }] },
      { p: tube(front), c: T, m: 'skin', tex: 'scale', texSize: 0.8, belly: 0.25,
        sub: [{ p: tube(belly(front, 1)), c: B, m: 'skin', line: 0, lines: plates(front, 1) }],
        lines: [{ p: front.map(q => [q[0] - q[2] * 0.2, q[1]]), w: 1.4, light: true, a: 0.35 }] },
      ...(o.bands ? front.slice(1, 5).map(q => ({ p: tube([[q[0] - q[2] * 0.48, q[1] - 4, 5], [q[0] - q[2] * 0.1, q[1] - 7, 5]]), c: o.bands, m: 'skin', line: 0 })) : []),
    ];
    // торс, голова, руки — канон гуманоида, посаженный на хвост
    const k = 1.05, dx = 12, dy = 12;
    const C = list => canon(list, dx, dy, k);
    const bodyS = C([
      ...arm([80, 90], [74, 104], [112, 98], { c: sk, m: 'skin', hand: sk, w: 14 }),
      { p: [[74, 82], [126, 80], [136, 94], [134, 122], [126, 142], [128, 160], [76, 160], [72, 140], [66, 122], [64, 96]], c: sk, m: 'skin', id: 'chest' },
      { p: [[68, 96], [100, 92], [136, 96], [136, 112], [118, 118], [100, 112], [82, 118], [66, 110]], c: o.top, m: o.topM || 'leather', line: 0.8, id: 'top',
        sub: [{ p: [[96, 90], [104, 90], [104, 118], [96, 118]], c: o.trim, m: 'gold', line: 0.4 }] },
      { p: [[76, 140], [104, 144], [128, 140], [130, 152], [104, 156], [74, 152]], c: o.trim, m: 'gold', id: 'belt', glint: [[104, 147, 2.5]] },
      { p: tube([[H.headX - 4, 70, 15], [H.headX - 6, 86, 18]]), c: sk, m: 'skin', id: 'neck' },
    ]);
    // волосы-змеи: изогнутые трубки с головками и красными глазками
    const snakes = [];
    const sn = [[[84, 42], [66, 30], [60, 12]], [[92, 32], [84, 12], [92, -4]], [[104, 28], [110, 8], [124, 0]], [[118, 30], [134, 18], [146, 20]], [[80, 54], [60, 58], [50, 44]], [[86, 64], [70, 78], [58, 72]]];
    sn.forEach((s, i) => {
      const [a, b, e] = s, [tx, ty] = norm(e[0] - b[0], e[1] - b[1]);
      snakes.push({ p: tube([[...a, 9], [...b, 7], [...e, 5.5]]), c: i % 2 ? o.hair : tone(o.hair, -0.12), m: 'skin', line: 0.7 });
      snakes.push({ e: [e[0] + tx * 4, e[1] + ty * 4, 6, 4.6], c: o.hair, m: 'skin', line: 0.7, sub: [{ e: [e[0] + tx * 4 + 1.5, e[1] + ty * 4 - 1.5, 1.4, 1.4], c: '#e8201a', m: 'flat', line: 0 }] });
    });
    const headS = C([
      ...snakes.slice(0, 4).filter((_, i) => i % 2 === 0),
      ...head(H.headX, H.headY, H.headR, { skin: sk, hairStyle: 'none', eye: o.eye, browC: '#2a3a20' }),
      ...snakes,
      ...(o.crown ? helm.crown(H.headX, H.headY + 4, H.headR * 1.05, { c: o.crown }) : []),
    ]);
    const armS = C([
      ...weapon.bow([170, 100], [0.08, -1], 58, { wood: o.bow }),
      { p: [[122, 98], [176, 99], [176, 101], [122, 100]], c: '#e0d6c0', m: 'flat', line: 0 },
      { p: [P(176, 96, 1), P(186, 100, 1), P(176, 104, 1)], c: '#b7c0ca', m: 'steel', line: 0.6 },
      ...arm([126, 90], [148, 98], [168, 100], { c: sk, m: 'skin', hand: sk, w: 14 }),
      { p: tube([[146, 94, 8], [150, 104, 8]]), c: o.trim, m: 'gold', line: 0.5 },
    ]);
    const parts = [
      { kind: 'legs', pivot: [130, 250], shapes: tailS },
      { kind: 'torso', pivot: [118, 170], shapes: bodyS },
      { kind: 'head', pivot: C([{ e: [H.headX - 4, H.neckY, 1, 1] }])[0].e.slice(0, 2), shapes: headS },
      { kind: 'prop', pivot: C([{ e: [H.frontSh, H.shY, 1, 1] }])[0].e.slice(0, 2), shapes: armS },
    ];
    V.def(name, place(name, parts, [127, 310], o.size || 0.98));
  }
  medusa('medusa', { skin: '#d8b890', eye: '#c8a020', tail: '#5a8a3a', belly: '#d8cf88', hair: '#5a9a3a', top: '#4a4050', trim: '#c8a040', bow: '#7a4a2a' });
  medusa('medusa_queen', { skin: '#dcc2a0', eye: '#e03020', tail: '#2a8a86', belly: '#e8e0a8', hair: '#2a9a8a', top: '#a82430', topM: 'cloth', trim: '#e8c050', bow: '#c8a040', crown: '#e8c050', bands: '#1a4a5a' });

  /* =================== минотавр / король минотавров =================== */
  /** Двусторонний топор-лабрис: кисть hand, древко по dir, лезвия-полумесяцы на конце. */
  function labrys(hand, dir, len, o) {
    const at = along(hand, dir), E = len, hd = o.head || '#b7c0ca';
    const blade = s => ({ p: [P(...at(E - 30, 4 * s), 1), P(...at(E - 40, 22 * s)), P(...at(E - 34, 40 * s), 1), P(...at(E - 14, 36 * s)), P(...at(E + 6, 40 * s), 1), P(...at(E + 12, 22 * s)), P(...at(E + 2, 4 * s), 1)], c: hd, m: o.headM || 'steel', gloss: 1.1,
      lines: [{ p: [at(E - 32, 38 * s), at(E - 12, 32 * s), at(E + 4, 38 * s)], w: 1.4, light: true, a: 0.8 }] });
    return [
      { p: tube([[...at(-40, 0), 7], [...at(E + 14, 0), 6]]), c: o.shaft || '#6a4424', m: 'wood', flow: Math.atan2(dir[1], dir[0]), line: 0.8,
        lines: [0, 1, 2].map(i => ({ p: [at(-6 + i * 8, -3.5), at(-2 + i * 8, 3.5)], w: 1.3, a: 0.6 })) },
      blade(1), blade(-1),
      { p: [P(...at(E - 12, -6), 1), P(...at(E + 4, -6), 1), P(...at(E + 4, 6), 1), P(...at(E - 12, 6), 1)], c: o.band || '#8a8f98', m: o.bandM || 'steel', line: 0.6 },
      { p: [P(...at(E + 12, -3), 1), P(...at(E + 24, 0), 1), P(...at(E + 12, 3), 1)], c: hd, m: 'steel' },
    ];
  }
  function minotaur(name, o) {
    const sk = o.skin, fur = o.fur, furD = tone(fur, -0.2);
    const legs = (hip, foot, side) => {
      const c = side < 0 ? furD : fur;
      const out = leg(hip, foot, { style: 'hose', m: 'fur', c, boot: o.hoof, tw: 32, toe: 4, bend: 6 });
      out.push({ p: [[foot[0] - 14, foot[1] - 22], [foot[0] + 8, foot[1] - 22], [foot[0] + 10, foot[1] - 10, 1], [foot[0] - 16, foot[1] - 10, 1]], c, m: 'fur', furLen: 0.8, flow: Math.PI * 0.5 });   // щётка над копытом
      out[out.length - 2].lines = [{ p: [[foot[0] + 6, foot[1] - 10], [foot[0] + 7, foot[1]]], w: 1.4, a: 0.8 }];
      return out;
    };
    const muscles = [{ p: [[104, 96], [118, 114], [142, 110]], w: 1.5, a: 0.5 }, { p: [[70, 100], [86, 112], [102, 108]], w: 1.4, a: 0.45 }, { p: [[106, 112], [108, 142]], w: 1.1, a: 0.35 },
      { p: [[94, 122], [120, 122]], w: 1, a: 0.35 }, { p: [[94, 132], [120, 132]], w: 1, a: 0.35 }];
    const body = [
      ...torso({ c: sk, m: 'skin', skirt: o.loin, skirtLen: 192, belt: false, neck: fur, neckM: 'fur' }),
      // широкая грудь и живот поверх канонного торса — минотавр массивнее человека
      { p: [[58, 88], [100, 78], [138, 82], [150, 98], [144, 124], [130, 146], [78, 146], [64, 124], [54, 102]], c: sk, m: 'skin', id: 'bulk', lines: muscles,
        sub: [{ p: [[100, 88], [144, 90], [146, 112], [120, 116], [102, 108]], c: tone(sk, 0.06), m: 'skin', line: 0 }] },
      { p: [[68, 140], [136, 140], [137, 152], [67, 152]], c: o.belt, m: 'leather', sub: [{ p: [P(98, 139, 1), P(110, 139, 1), P(110, 153, 1), P(98, 153, 1)], c: o.buckle, m: 'gold' }] },
      // шерсть на холке — бычья шея переходит в плечи
      { p: [[66, 90], [82, 64], [108, 56], [126, 66], [134, 88], [118, 96], [100, 90], [80, 98]], c: fur, m: 'fur', furLen: 0.9, flow: Math.PI * 0.4 },
      ...(o.armor ? [{ p: [[54, 88], [90, 78], [100, 96], [80, 112], [52, 106]], c: o.armor, m: 'gold', glint: [[78, 86, 3]], lines: [{ p: [[70, 96], [98, 88]], w: 1, a: 0.5 }] }] : []),
    ];
    // бычья голова: широкий лоб, морда книзу-вперёд, кольцо в носу; рисуется крупнее канона
    const headS = scaleAt([
      hornT([[94, 30, 16], [76, 20, 13], [62, 6, 9], [58, -12, 4]], tone(o.horn, -0.2), o.hornTip && tone(o.hornTip, -0.15)),
      { p: [[92, 44], [74, 34, 1], [80, 50], [92, 56]], c: tone(fur, 0.05), m: 'fur', furLen: 0.4, line: 0.7, sub: [{ p: [[88, 46], [78, 40], [84, 52]], c: '#b07a6a', m: 'skin', line: 0 }] },
      { p: [[82, 58], [84, 32], [98, 18], [122, 16], [138, 26], [150, 42], [160, 60], [166, 76], [162, 90], [146, 96], [128, 92], [110, 88], [92, 80]], c: fur, m: 'fur', furLen: 0.6, flow: Math.PI * 0.3, id: 'skull',
        lines: [{ p: [[134, 34], [146, 50], [152, 64]], w: 1.2, light: true, a: 0.4 }, { p: [[110, 60], [122, 76], [136, 84]], w: 1.2, a: 0.35 }] },
      { p: [[138, 58], [158, 62], [170, 76], [168, 90], [154, 98], [138, 94], [130, 78]], c: o.muzzle, m: 'skin', line: 0.8, id: 'muzzle',
        lines: [{ p: [[146, 92], [164, 90]], w: 1.2, a: 0.6 }] },
      { e: [161, 72, 3.2, 2.4], c: '#1a0e0a', m: 'flat', line: 0 },
      { p: tube([[158, 80, 3.2], [158, 90, 3.2], [166, 90, 3.2], [167, 80, 3.2]]), c: o.ring, m: 'gold', line: 0.5, gloss: 1.2 },
      { p: [[114, 36], [138, 34], [140, 40], [118, 42]], c: tone(fur, -0.45), m: 'flat', line: 0 },
      { e: [128, 45, 4.8, 3.8], c: o.eye, m: 'gem', line: 0.5, glint: [[126.5, 43.5, 1.5]] },
      // чёлка между рогами
      { p: [[96, 28], [104, 12], [112, 22], [122, 10], [128, 26], [112, 32]], c: tone(fur, -0.15), m: 'fur', furLen: 0.9, flow: -Math.PI * 0.3 },
      hornT([[112, 24, 17], [134, 12, 14], [152, 0, 9], [160, -18, 4]], o.horn, o.hornTip),
      ...(o.crown ? helm.crown(110, 38, 20, { c: o.crown }) : []),
    ], 100, 78, 1.14);
    const hand = [168, 148], dir = [0.26, -1];
    V.def(name, humanoid({
      name, size: o.size || 1,
      legs,
      back: [...arm([72, 90], [58, 120], [66, 148], { c: sk, m: 'skin', hand: sk, w: 24 }), ...(o.armor ? [{ p: tube([[60, 128, 17], [65, 144, 16]]), c: o.armor, m: 'gold', line: 0.6 }] : [])],
      body, head: headS,
      arm: [
        ...labrys(hand, dir, 150, { head: o.axe, headM: o.axeM, band: o.band, bandM: o.bandM }),
        ...arm([134, 94], [154, 120], hand, { c: sk, m: 'skin', hand: sk, w: 24 }),
        { p: [[118, 86], [138, 82], [152, 94], [152, 112], [140, 116], [124, 104]], c: sk, m: 'skin', line: 0.8, lines: [{ p: [[128, 90], [146, 96]], w: 1.1, light: true, a: 0.4 }] },
        ...(o.armor ? [{ p: tube([[152, 118, 17], [164, 140, 16]]), c: o.armor, m: 'gold', line: 0.6 }, { p: [[114, 84], [140, 78], [156, 92], [156, 110], [140, 112], [120, 100]], c: o.armor, m: 'gold', glint: [[132, 88, 4]], lines: [{ p: [[120, 96], [154, 100]], w: 1, a: 0.5 }] }] : []),
      ],
    }));
  }
  minotaur('minotaur', { skin: '#c48a5a', fur: '#6a4026', muzzle: '#b08868', horn: '#e8dcc0', hornTip: '#8a7a60', eye: '#d02a1a', ring: '#c8a040', loin: '#a82a2a', belt: '#4a3020', buckle: '#c8a040', hoof: '#2a1e18', axe: '#b7c0ca', band: '#6a4424' });
  minotaur('minotaur_king', { skin: '#b07a52', fur: '#2e2a2e', muzzle: '#5a5058', horn: '#e8dcc0', hornTip: '#e8c050', eye: '#40a0f0', ring: '#e8c050', loin: '#2c4aa8', belt: '#1a1a24', buckle: '#e8c050', hoof: '#1a1414', axe: '#c8d0da', band: '#e8c050', bandM: 'gold', armor: '#d8a53a', crown: '#e8c050' });

  /* =================== мантикора / скорпикора =================== */
  function manticore(name, o) {
    const c = o.body, far = tone(c, -0.22), mane = o.mane;
    const lionLeg = (pts, foot, col) => beastLeg(pts.map(q => [q[0], q[1], q[2] * 1.22]), foot, col, { pl: 38, ph: 16, claw: o.claw, clawL: 6, furLen: 0.7 });
    const legs = [
      { kind: 'leg', side: 1, pivot: [96, 196], shapes: lionLeg([[96, 186, 46], [110, 228, 30], [94, 262, 20], [100, 298, 18]], [102, 308], far) },
      { kind: 'leg', side: -1, pivot: [236, 196], shapes: lionLeg([[236, 188, 40], [230, 238, 26], [238, 276, 20], [246, 298, 18]], [250, 308], far) },
      { kind: 'leg', side: -1, pivot: [118, 200], shapes: lionLeg([[118, 188, 52], [136, 236, 32], [116, 270, 22], [122, 300, 20]], [126, 310], c) },
      { kind: 'leg', side: 1, pivot: [258, 200], shapes: lionLeg([[256, 190, 44], [250, 240, 28], [258, 280, 22], [266, 300, 20]], [272, 310], c) },
    ];
    // хвост-жало: членики скорпиона дугой над спиной
    const path = [[84, 184], [56, 168], [36, 138], [30, 102], [38, 72], [58, 50], [84, 42], [106, 50]];
    const tailS = [];
    path.forEach((q, i) => {
      if (i === path.length - 1) return;
      const r = 17 - i * 1.4, nx = path[i + 1];
      tailS.push({ p: ell((q[0] + nx[0]) / 2, (q[1] + nx[1]) / 2, r * 1.35, r, 10, Math.atan2(nx[1] - q[1], nx[0] - q[0])), c: i % 2 ? o.tail : tone(o.tail, -0.08), m: o.tailM || 'skin', gloss: 0.6, line: 0.8,
        lines: [{ p: [[(q[0] + nx[0]) / 2 - 4, (q[1] + nx[1]) / 2 - 4], [(q[0] + nx[0]) / 2 + 2, (q[1] + nx[1]) / 2 - 8]], w: 1, light: true, a: 0.5 }] });
    });
    if (o.tailSpikes) path.slice(1, 6).forEach((q, i) => tailS.push({ p: [P(q[0] - 4, q[1] - 2, 1), P(q[0] - 14 + i * 3, q[1] - 12 - i * 2, 1), P(q[0] + 4, q[1] - 6, 1)], c: o.tailSpikes, m: 'horn', line: 0.5 }));
    tailS.push({ p: [P(100, 46, 1), P(120, 52), P(128, 70), P(122, 92, 1), P(116, 74), P(102, 62, 1)], c: o.sting, m: 'horn', gloss: 1.2, glint: [[118, 60, 2.5]], line: 0.8 });
    if (o.venom) tailS.push({ e: [123, 100, 3, 4.2], c: o.venom, m: 'gem', line: 0.4, glint: [[122, 98.6, 1.2]] });
    const bodyS = [
      { p: [[74, 184], [80, 152], [112, 140], [158, 144], [200, 136], [236, 138], [262, 154], [272, 186], [262, 212], [236, 222], [200, 220], [168, 214], [140, 218], [112, 222], [86, 212]], c, m: 'fur', furLen: 0.55, flow: Math.PI * 0.7, belly: 0.45,
        lines: [{ p: [[124, 156], [106, 172], [100, 198]], w: 1.3, a: 0.38 }, { p: [[90, 152], [130, 144], [170, 148]], w: 1.5, light: true, a: 0.4 }, { p: [[180, 166], [186, 196]], w: 1.1, a: 0.3 }],
      },
      ...(o.ridge ? spikes([[84, 156], [120, 142], [160, 144], [200, 138]], 6, 13, o.ridge, 1) : []),
      // грива: крупная масса вокруг шеи и головы
      { p: [[216, 206], [206, 176], [214, 140], [236, 116], [262, 106], [290, 110], [306, 126], [310, 150], [300, 176], [288, 198], [270, 214, 1], [258, 204], [246, 218, 1], [232, 206], [222, 220, 1]], c: mane, m: 'fur', furLen: 1.3, flow: Math.PI * 0.55, dens: 1.2,
        lines: [{ p: [[232, 130], [250, 118], [274, 114]], w: 1.4, light: true, a: 0.4 }] },
    ];
    const headS = [
      { p: [[262, 132], [276, 118], [300, 116], [318, 124], [334, 138], [340, 152], [334, 168], [318, 176], [298, 178], [280, 172], [266, 158]], c: o.face, m: 'fur', furLen: 0.4, flow: Math.PI * 0.9, id: 'face',
        lines: [{ p: [[290, 132], [304, 128], [318, 134]], w: 1.8, a: 0.7 }] },
      { p: [[312, 142], [334, 142], [344, 152], [340, 162], [322, 164], [310, 156]], c: tone(o.face, 0.2), m: 'fur', furLen: 0.3, line: 0.7 },
      { p: [[336, 138], [346, 142], [344, 150], [336, 148]], c: '#2a1a16', m: 'horn', gloss: 1.1, line: 0.5 },
      // открытая пасть с клыками
      { p: [[304, 164], [338, 162], [334, 180], [312, 184], [300, 176]], c: '#4a0e12', m: 'skin', line: 0.8 },
      { p: [P(316, 162, 1), P(320, 176, 1), P(324, 162, 1)], c: '#f4eedc', m: 'horn', line: 0.4 },
      { p: [P(330, 162, 1), P(333, 173, 1), P(336, 162, 1)], c: '#f4eedc', m: 'horn', line: 0.4 },
      { p: [P(312, 184, 1), P(316, 172, 1), P(320, 183, 1)], c: '#e8e0c8', m: 'horn', line: 0.4 },
      { e: [306, 136, 5, 4], c: o.eye, m: 'gem', line: 0.5, sub: [{ e: [307.5, 136, 1.6, 3.2], c: '#0a0606', m: 'flat', line: 0 }], glint: [[305, 134.5, 1.4]] },
      { p: [[294, 130], [312, 128], [314, 132], [296, 134]], c: tone(mane, -0.3), m: 'flat', line: 0 },
      { p: [[274, 122], [270, 104, 1], [286, 116]], c: o.face, m: 'fur', furLen: 0.3, line: 0.7 },   // ухо
      ...(o.horns ? [hornT([[280, 118, 9], [276, 100, 7], [266, 86, 3]], o.horns), hornT([[292, 116, 9], [296, 96, 7], [290, 80, 3]], o.horns)] : []),
    ];
    const W = { mem: o.mem, bone: o.bone, claw: o.wclaw };
    const Wf = { mem: tone(o.mem, -0.25), bone: tone(o.bone, -0.2), claw: o.wclaw };
    const parts = [
      { kind: 'prop', pivot: [228, 150], shapes: wing.bat([228, 150], [0.12, -1], 136, Wf) },
      legs[0], legs[1], legs[2], legs[3],
      { kind: 'head', pivot: [84, 180], shapes: tailS },
      { kind: 'torso', pivot: [170, 190], shapes: bodyS },
      { kind: 'head', pivot: [274, 150], shapes: headS },
      { kind: 'prop', pivot: [214, 156], shapes: wing.bat([214, 156], [-0.22, -1], 150, W) },
    ];
    V.def(name, place(name, parts, [193, 310]));
  }
  manticore('manticore', { body: '#d8843a', mane: '#7a3a1e', face: '#e0944a', eye: '#f0c020', claw: '#f0e8d0', tail: '#8a5a3a', sting: '#f0e8d0',
    mem: '#6a3a2e', bone: '#4a2a22', wclaw: '#3a2a22' });
  manticore('scorpicore', { body: '#b82a26', mane: '#2a1414', face: '#c8382e', eye: '#a0f040', claw: '#1a1010', tail: '#2a1a1e', tailM: 'horn', sting: '#b0e040', venom: '#b0f040', tailSpikes: '#1a1010',
    mem: '#5a1a22', bone: '#1e1216', wclaw: '#1a1010', ridge: '#1a1010', horns: '#1a1010' });

  /* =================== красный / чёрный дракон =================== */
  function dragon(name, o) {
    const c = o.body, far = tone(c, -0.25), bel = o.belly;
    const dLeg = (pts, foot, col) => beastLeg(pts, foot, col, { m: 'skin', tex: 'scale', texSize: 0.7, pl: 34, ph: 14, claw: o.claw, clawL: 9 });
    const legs = [
      { kind: 'leg', side: 1, pivot: [104, 212], shapes: dLeg([[104, 200, 56], [128, 244, 34], [108, 280, 22], [114, 308, 20]], [116, 316], far) },
      { kind: 'leg', side: -1, pivot: [226, 210], shapes: dLeg([[226, 200, 42], [218, 248, 28], [230, 290, 20], [236, 308, 18]], [240, 316], far) },
      { kind: 'leg', side: -1, pivot: [126, 214], shapes: dLeg([[126, 200, 62], [152, 248, 38], [130, 284, 24], [136, 310, 22]], [140, 320], c) },
      { kind: 'leg', side: 1, pivot: [248, 214], shapes: dLeg([[248, 204, 46], [240, 252, 30], [254, 294, 22], [260, 310, 20]], [264, 320], c) },
    ];
    const tail = [[112, 206, 50], [74, 222, 40], [44, 246, 30], [22, 274, 20], [12, 298, 12], [18, 314, 6]];
    const neck = [[232, 190, 60], [254, 150, 46], [270, 118, 38], [290, 96, 32]];
    const bodyS = [
      { p: tube(tail), c, m: 'skin', tex: 'scale', texSize: 0.8, belly: 0.3,
        sub: [{ p: tube(tail.map(q => [q[0] + q[2] * 0.12, q[1] + q[2] * 0.36, q[2] * 0.4])), c: bel, m: 'skin', line: 0 }] },
      { p: [P(10, 300, 1), P(-4, 290, 1), P(4, 316, 1), P(26, 318, 1)], c: o.spine, m: 'horn', line: 0.6 },   // пика на хвосте
      ...spikes(tail.slice(0, 5).map(q => [q[0], q[1] - q[2] * 0.45]), 6, 14, o.spine, -1),
      { p: [[92, 196], [110, 168], [150, 154], [196, 150], [236, 160], [262, 184], [266, 216], [248, 240], [210, 250], [164, 250], [120, 244], [96, 226]], c, m: 'skin', tex: 'scale', texSize: 0.9, belly: 0.4,
        sub: [{ p: [[120, 238], [160, 228], [210, 230], [262, 206], [270, 256], [110, 256]], c: bel, m: 'skin', line: 0, lines: [0, 1, 2, 3, 4, 5].map(i => ({ p: [[130 + i * 24, 230 - i * 2], [134 + i * 24, 252]], w: 1, a: 0.45 })) }],
        lines: [{ p: [[120, 172], [170, 158], [220, 162]], w: 1.6, light: true, a: 0.35 }] },
      ...spikes([[104, 176], [150, 156], [200, 152], [236, 162]], 5, 16, o.spine, 1),
      { p: tube(neck), c, m: 'skin', tex: 'scale', texSize: 0.7,
        sub: [{ p: tube(neck.map(q => [q[0] + q[2] * 0.34, q[1] + q[2] * 0.1, q[2] * 0.42])), c: bel, m: 'skin', line: 0,
          lines: neck.slice(0, 3).map(q => ({ p: [[q[0] + q[2] * 0.1, q[1] + 4], [q[0] + q[2] * 0.55, q[1] - 4]], w: 1, a: 0.45 })) }] },
      ...spikes(neck.map(q => [q[0] - q[2] * 0.4, q[1] - q[2] * 0.2]), 4, 12, o.spine, 1),
    ];
    const hx = 0, hy = 0;
    const D = pts => move(pts, hx, hy);
    const headS = [
      ...(o.horns2 ? [hornT(D([[284, 78, 10], [270, 58, 8], [262, 40, 4]]), tone(o.horn, -0.2))] : []),
      hornT(D([[286, 86, 12], [266, 74, 9], [248, 70, 6], [236, 74, 2.5]]), tone(o.horn, -0.15)),
      // череп и верхняя челюсть
      { p: D([[272, 96], [280, 76], [300, 68], [322, 72], [342, 82], [362, 90], [370, 100], [362, 106], [338, 106], [312, 108], [290, 114]]), c, m: 'skin', tex: 'scale', texSize: 0.5, id: 'skull',
        lines: [{ p: D([[300, 76], [330, 80], [356, 90]]), w: 1.2, light: true, a: 0.5 }] },
      // нижняя челюсть, приоткрыта
      { p: D([[290, 112], [316, 110], [344, 112], [362, 116], [360, 124], [336, 128], [308, 126], [292, 122]]), c: tone(c, -0.1), m: 'skin', sub: [{ p: D([[296, 120], [362, 118], [362, 132], [296, 132]]), c: bel, m: 'skin', line: 0 }] },
      { p: D([[312, 108], [360, 104], [360, 114], [312, 112]]), c: '#3a0a0a', m: 'flat', line: 0 },
      ...teeth(D([[316, 106]])[0], D([[360, 104]])[0], 6, 6, '#f2ecd8', 1),
      ...teeth(D([[318, 113]])[0], D([[356, 115]])[0], 5, -5, '#e8e0c8', 1),
      { e: [...D([[358, 90]])[0], 2.6, 1.8], c: '#1a0a0a', m: 'flat', line: 0 },
      // надбровье и глаз
      { e: [...D([[312, 86]])[0], 6, 4.6], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [...D([[313.5, 86]])[0], 1.6, 4], c: '#0a0606', m: 'flat', line: 0 }], glint: [[...D([[311, 84.5]])[0], 1.5]] },
      { p: D([[298, 80], [322, 76], [330, 82], [318, 82], [300, 86]]), c: tone(c, -0.15), m: 'skin', line: 0.6 },
      // щёчные шипы-«бахрома»
      { p: D([[282, 102], [268, 110, 1], [280, 112], [270, 124, 1], [288, 118]]), c: o.spine, m: 'horn', line: 0.6 },
      hornT(D([[296, 76, 13], [278, 58, 10], [258, 50, 6], [242, 52, 2.5]]), o.horn, o.hornTip),
      ...(o.horns2 ? [hornT(D([[306, 72, 8], [306, 56, 6], [298, 44, 2.5]]), o.horn, o.hornTip), hornT(D([[326, 78, 6], [330, 66, 4], [326, 58, 2]]), o.horn)] : []),
    ];
    const Wn = { mem: o.mem, bone: o.bone, claw: o.wclaw }, Wf = { mem: tone(o.mem, -0.25), bone: tone(o.bone, -0.2), claw: o.wclaw };
    const parts = [
      { kind: 'prop', pivot: [206, 160], shapes: wing.bat([206, 160], [-0.05, -1], 180, Wf) },
      legs[0], legs[1], legs[2], legs[3],
      { kind: 'torso', pivot: [180, 210], shapes: bodyS },
      { kind: 'head', pivot: [282, 104], shapes: headS },
      { kind: 'prop', pivot: [196, 166], shapes: wing.bat([196, 166], [-0.42, -0.9], 196, Wn) },
    ];
    V.def(name, place(name, parts, [173, 320]));
  }
  dragon('red_dragon', { body: '#c0302a', belly: '#e8b85a', spine: '#f0d8a0', horn: '#f0e0b8', hornTip: '#8a6a4a', eye: '#f0d020', claw: '#f0e8d0', mem: '#d8503a', bone: '#9a2420', wclaw: '#f0e0b8' });
  dragon('black_dragon', { body: '#2e2a36', belly: '#5a4a6a', spine: '#8a5ab0', horn: '#b8b0c0', hornTip: '#4a2a6a', eye: '#c060ff', claw: '#c8c0d0', mem: '#4a2a5e', bone: '#1a161e', wclaw: '#c8c0d0', horns2: true });
})(typeof window !== 'undefined' ? window : globalThis);
