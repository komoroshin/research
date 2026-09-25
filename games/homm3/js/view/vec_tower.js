/* ============================================================================
   view/vec_tower.js — Башня на рисованном конвейере.
   Гремлин, горгулья, голем, маг, джинн, нага, гигант — каждый функцией с параметрами;
   улучшение — тот же рисунок в другой гамме и с отличительной деталью.
   Рисуем в каноне гуманоида (земля y=246, центр x=100), place() вписывает в рамку старого спрайта.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, along, lerp, ell, weapon, helm, head, arm, leg, torso, robe, humanoid, wing, fit, frameOf, tone, H } = K;
  const GOLD = '#d8a53a', SKIN = '#e8b890';

  /* ---------- помощники этого файла ---------- */
  const FB = { w: 200, h: 250, anchor: [100, 246] };
  /** Вписать части из канона (земля y=246, центр x=100+dx) в рамку старого спрайта name. */
  function place(name, parts, size, dx) {
    const to = frameOf(name) || FB;
    return fit(parts, { ground: [100 + (dx || 0), 246] }, to, to.anchor[1] / 246 * (size || 1));
  }
  /** Скосить углы многоугольника: каждый угол → две точки на рёбрах; сглаживание даст мягкий «блок». */
  function bevel(pts, r) {
    const out = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
      const da = norm(a[0] - p[0], a[1] - p[1]), db = norm(b[0] - p[0], b[1] - p[1]);
      const la = Math.min(r, Math.hypot(a[0] - p[0], a[1] - p[1]) * 0.4), lb = Math.min(r, Math.hypot(b[0] - p[0], b[1] - p[1]) * 0.4);
      out.push([p[0] + da[0] * la, p[1] + da[1] * la], [p[0] + db[0] * lb, p[1] + db[1] * lb]);
    }
    return out;
  }
  /** Брусок от a к b шириной w0 → w1 со скошенными углами (каменные и железные руки-ноги). */
  function slab(a, b, w0, w1, r) {
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]), nx = -dy, ny = dx, h0 = w0 / 2, h1 = w1 / 2;
    return bevel([[a[0] + nx * h0, a[1] + ny * h0], [b[0] + nx * h1, b[1] + ny * h1], [b[0] - nx * h1, b[1] - ny * h1], [a[0] - nx * h0, a[1] - ny * h0]], r || 4);
  }
  /** Звезда (острые углы): n лучей, радиус r. */
  function star(cx, cy, r, n) {
    n = n || 5; const out = [];
    for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * 0.45 : r; out.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1)); }
    return out;
  }
  /** Когти веером из точки (x, y) по направлению ang. */
  function claws(x, y, ang, n, len, c, spread) {
    const out = []; spread = spread || 0.35;
    for (let i = 0; i < n; i++) {
      const a = ang + (i - (n - 1) / 2) * spread, ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
      out.push({ p: [[x + nx * 2.6, y + ny * 2.6], [x + ca * len * 0.6 + nx * 2, y + sa * len * 0.6 + ny * 2], P(x + ca * len, y + sa * len, 1), [x - nx * 2.6, y - ny * 2.6]], c, m: 'horn', line: 0.6 });
    }
    return out;
  }
  /** Сабля-скимитар в кисть hand по направлению dir. */
  function scimitar(hand, dir, len, o) {
    o = o || {}; const at = along(hand, dir), bl = o.blade || '#d6dde6', gd = o.guard || GOLD;
    return [
      { p: [at(-2, -2.4), at(-2, 2.4), at(-13, 2.2), at(-13, -2.2)], c: '#4a2e1a', m: 'leather', line: 0.6 },
      { e: [...at(-15, 0), 3.6, 3.6], c: gd, m: 'gold', line: 0.6 },
      { p: [P(...at(6, -3.6), 1), at(len * 0.45, -5.5), at(len * 0.8, -3.5), P(...at(len, 5), 1), at(len * 0.78, 6.5), at(len * 0.4, 5.5), P(...at(6, 3.6), 1)], c: bl, m: 'steel', gloss: 1.2, line: 0.7,
        lines: [{ p: [at(8, -1.8), at(len * 0.45, -3.4), at(len * 0.78, -1.2)], w: 1, light: true, a: 0.9 }] },
      { p: [P(...at(3, -9), 1), P(...at(7, -9), 1), P(...at(7, 9), 1), P(...at(3, 9), 1)], c: gd, m: 'gold', line: 0.6 },
    ];
  }
  /** Прямое древко a → b: у концов короткие отрезки, чтобы сглаживание не выносило контур за торец. */
  function rod(a, b, w0, w1) {
    const q = t => [...lerp(a, b, t), w0 + (w1 - w0) * t];
    return tube([q(0), q(0.03), q(0.5), q(0.97), q(1)]);
  }
  /** Сменить материал у готовых форм (крыло из набора — «кожа» → камень). */
  const remat = (list, m, extra) => list.map(s => Object.assign({}, s, { m: s.m === 'horn' ? s.m : m }, extra || {}));

  /* ================= Гремлин / мастер-гремлин ================= */
  function gremlin(name, o) {
    const SK = '#78b048', SKD = tone(SK, -0.2), EAR = '#d88c7a';
    const legO = c => ({ style: 'bare', c, skin: c, tw: 19, toe: 13, bend: 5 });
    const hx = 112, hy = 100;
    const headS = [
      // дальнее ухо — за головой
      { p: [[124, 84], [150, 66], [178, 50, 1], [162, 76], [134, 98]], c: SKD, m: 'skin', line: 0.8, sub: [{ p: [[134, 84], [156, 68], [170, 58, 1], [158, 76], [138, 92]], c: tone(EAR, -0.15), m: 'skin', line: 0 }] },
      { p: [[82, 100], [86, 78], [102, 66], [124, 66], [140, 78], [146, 96], [144, 112], [134, 124], [114, 130], [96, 126], [86, 114]], c: SK, m: 'skin', id: 'face',
        lines: [{ p: [[92, 108], [100, 116]], w: 1, a: 0.35 }] },
      // нос-крючок
      { p: [[136, 90], [154, 98], [166, 110, 1], [152, 111], [138, 106]], c: SK, m: 'skin', line: 0.9 },
      // рот-оскал с зубками
      { p: [[116, 114], [146, 112], [140, 121], [122, 123]], c: '#3a1410', m: 'flat', line: 0.8, lc: '#1a0a06',
        sub: [{ p: [P(124, 113, 1), P(127, 118, 1), P(130, 113, 1)], c: '#f4ecd8', m: 'flat', line: 0 }, { p: [P(134, 113, 1), P(137, 118, 1), P(140, 112, 1)], c: '#f4ecd8', m: 'flat', line: 0 }] },
      { e: [128, 90, 7.5, 8.5], c: '#f2d23c', m: 'gem', line: 0.8, sub: [{ e: [130, 91, 2.2, 5.4], c: '#140c06', m: 'flat', line: 0 }], glint: [[126, 87, 2.4]] },
      { p: [[116, 80], [132, 78], [140, 84], [118, 85]], c: tone(SK, -0.45), m: 'flat', line: 0 },
      // ближнее ухо — огромный лист назад
      { p: [[98, 84], [70, 70], [30, 58, 1], [56, 86], [92, 106]], c: SK, m: 'skin', line: 0.9,
        sub: [{ p: [[92, 88], [66, 76], [42, 66, 1], [62, 86], [88, 100]], c: EAR, m: 'skin', line: 0 }] },
      // вихры на макушке
      { p: [[98, 70], [100, 54, 1], [108, 66], [114, 50, 1], [118, 66], [126, 56, 1], [126, 70]], c: '#3a2a1a', m: 'fur', furLen: 0.5, line: 0.7 },
    ];
    if (o.cap) headS.push(
      { p: [[84, 80], [92, 58], [80, 40], [62, 30, 1], [96, 34], [124, 48], [144, 76], [112, 70]], c: o.cap, m: 'cloth', lines: [{ p: [[92, 56], [120, 58]], w: 1, a: 0.4 }] },
      { p: tube([[84, 80, 9], [114, 72, 9], [146, 78, 9]]), c: tone(o.cap, -0.15), m: 'cloth' },
      { e: [62, 31, 7, 7], c: GOLD, m: 'gold', glint: [[60, 29, 2.5]] });
    const chain = [], hand = [150, 178], ball = [168, 226];
    for (let i = 0; i < 6; i++) {
      const t = (i + 0.6) / 7, x = lerp(hand, ball, t)[0] + Math.sin(t * Math.PI) * 6, y = lerp(hand, ball, t)[1];
      chain.push(i % 2 ? { e: [x, y, 2.4, 4.2], c: '#6a707a', m: 'steel', line: 0.7 } : { p: ell(x, y, 4.6, 3, 8), c: '#7a808a', m: 'steel', line: 0.7 });
    }
    const ballS = [{ e: [ball[0], ball[1], 13, 13], c: o.ball, m: 'steel', gloss: 1.1, glint: [[ball[0] - 5, ball[1] - 5, 4]] }];
    if (o.spikes) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; ballS.unshift({ p: [P(ball[0] + Math.cos(a - 0.35) * 11, ball[1] + Math.sin(a - 0.35) * 11), P(ball[0] + Math.cos(a) * 19, ball[1] + Math.sin(a) * 19, 1), P(ball[0] + Math.cos(a + 0.35) * 11, ball[1] + Math.sin(a + 0.35) * 11)], c: o.spikes, m: 'gold', line: 0.6 }); }
    const parts = [
      { kind: 'leg', side: -1, pivot: [90, 200], shapes: leg([90, 200], [84, 246], legO(SKD)) },
      { kind: 'leg', side: 1, pivot: [112, 200], shapes: leg([112, 200], [118, 246], legO(SK)) },
      { kind: 'torso', pivot: [104, 176], shapes: [
        ...arm([84, 138], [72, 164], [80, 188], { c: SKD, m: 'skin', hand: false, w: 12 }),
        { e: [81, 191, 8, 7.5], c: SKD, m: 'skin', line: 0.8 },
        { p: [[80, 128], [124, 126], [136, 146], [140, 176], [146, 208, 1], [132, 201], [122, 212, 1], [110, 203], [98, 212, 1], [86, 203], [72, 209, 1], [70, 178], [70, 146]], c: o.tunic, m: 'cloth', belly: 0.3, id: 'tunic',
          lines: [{ p: [[104, 184], [104, 208]], w: 1.1, a: 0.45 }, { p: [[88, 182], [82, 204]], w: 1, a: 0.35 }, { p: [[122, 182], [128, 204]], w: 1, a: 0.35 }],
          sub: [{ p: [P(112, 146, 1), P(128, 144, 1), P(129, 160, 1), P(113, 162, 1)], c: o.patch, m: 'cloth', line: 0.7, lines: [{ p: [[114, 148], [127, 147]], w: 0.8, a: 0.6 }, { p: [[114, 159], [127, 158]], w: 0.8, a: 0.6 }] }] },
        { p: tube([[70, 176, 6], [106, 181, 6], [141, 174, 6]]), c: o.belt, m: o.beltM || 'cloth', line: 0.7 },
        ...(o.buckle ? [{ p: [P(100, 175, 1), P(112, 175, 1), P(112, 187, 1), P(100, 187, 1)], c: GOLD, m: 'gold', glint: [[103, 178, 2]] }] : []),
      ] },
      { kind: 'head', pivot: [110, 128], shapes: headS },
      { kind: 'prop', pivot: [124, 138], shapes: [
        ...chain, ...ballS,
        ...arm([124, 138], [138, 160], hand, { c: SK, m: 'skin', hand: false, w: 12 }),
        ...(o.bracer ? [{ p: tube([[141, 164, 13], [147, 173, 12]]), c: o.bracer, m: 'gold', line: 0.7 }] : []),
        { e: [hand[0] + 1, hand[1] + 1, 8.5, 8], c: SK, m: 'skin', line: 0.8 },
      ] },
    ];
    V.def(name, place(name, parts, 1, 4));
  }
  gremlin('gremlin', { tunic: '#8a5a32', patch: '#b08050', belt: '#c8a868', ball: '#4a4e58' });
  gremlin('master_gremlin', { tunic: '#7a3aa0', patch: '#a86ad0', belt: '#4a2a18', beltM: 'leather', buckle: true, ball: '#5a5e68', spikes: '#e0b848', cap: '#c8302a', bracer: GOLD });

  /* ================= Горгулья: каменная / обсидиановая ================= */
  function gargoyle(name, o) {
    const S = o.c, SD = tone(S, -0.22), M = o.m, G = o.gloss;
    const st = (p, c, extra) => Object.assign({ p, c, m: M, gloss: G }, extra || {});
    const cr = o.crack, cracks = (list) => list.map(p => ({ p, w: 1.1, c: cr, a: o.crackA || 0.7 }));
    /** Ступня-лапа: бедро → колено вперёд → скакательный сустав назад → пальцы с когтями. */
    const clawLeg = (hip, knee, ank, toe, c) => [
      st(tube([[...hip, 32], [...lerp(hip, knee, 0.5), 26], [...knee, 19]], { flat0: true }), c),
      st(tube([[...knee, 18], [...ank, 12]]), c),
      st(tube([[...ank, 13], [...toe, 11]]), c),
      ...claws(toe[0] + 3, toe[1] + 1, 0.25, 3, 11, o.claw, 0.45),
    ];
    const wingC = { mem: o.mem, bone: S, claw: o.claw }, wingF = { mem: tone(o.mem, -0.18), bone: SD, claw: o.claw };
    const parts = [
      { kind: 'prop', pivot: [100, 104], shapes: remat(wing.bat([100, 104], [0.1, -1], 112, wingF), M, { gloss: G }) },
      { kind: 'prop', pivot: [88, 108], shapes: remat(wing.bat([88, 108], [-0.9, -0.62], 126, wingC), M, { gloss: G }) },
      { kind: 'leg', side: -1, pivot: [92, 168], shapes: clawLeg([92, 166], [112, 194], [94, 224], [118, 238], SD) },
      { kind: 'leg', side: 1, pivot: [112, 170], shapes: clawLeg([112, 168], [136, 196], [118, 226], [144, 238], S) },
      { kind: 'torso', pivot: [106, 150], shapes: [
        // хвост с наконечником-пикой
        st(tube([[82, 166, 15], [58, 186, 11], [40, 214, 8], [22, 228, 6], [6, 224, 4]]), SD),
        st([[10, 226], [-2, 212, 1], [0, 224], [-10, 236, 1], [6, 234], [14, 230]], SD),
        // дальняя рука
        st(tube([[86, 112, 21], [80, 142, 16]]), SD), st(tube([[80, 142, 16], [100, 162, 12]]), SD),
        ...claws(102, 164, 1.2, 3, 10, o.claw, 0.4),
        // сгорбленный корпус
        st([[70, 124], [80, 100], [104, 88], [132, 90], [150, 106], [152, 132], [140, 156], [124, 176], [98, 180], [80, 170], [70, 148]], S, { belly: 0.35, id: 'body',
          lines: [...cracks([[[96, 100], [102, 118], [96, 132]], [[84, 150], [94, 160]], [[138, 116], [132, 126]]]), { p: [[114, 104], [128, 116], [146, 112]], w: 1.3, a: 0.5 }],
          sub: [st([[118, 108], [150, 112], [146, 142], [132, 164], [112, 172], [112, 140]], tone(S, 0.12), { line: 0, lines: [{ p: [[116, 130], [146, 128]], w: 1, a: 0.4 }, { p: [[114, 150], [138, 148]], w: 1, a: 0.4 }] })] }),
        ...(o.spikes ? [[96, 92, 88, 64], [80, 104, 66, 84], [72, 124, 54, 110]].map(([x, y, tx, ty]) => ({ p: [P(x + 6, y + 2), P(tx, ty, 1), P(x - 4, y + 8)], c: o.spikes, m: 'gem', line: 0.7, glint: [[(x + tx) / 2, (y + ty) / 2, 2]] })) : []),
        // ближняя рука — в корпусе: у летуна весь реквизит машет как крылья
        st(tube([[128, 108, 24], [140, 138, 18]]), S), st(tube([[140, 138, 18], [160, 152, 13]]), S),
        st([[122, 98], [142, 100], [146, 118], [130, 124], [120, 114]], tone(S, 0.08)),
        ...claws(162, 154, 1.1, 4, 12, o.claw, 0.32),
      ] },
      { kind: 'head', pivot: [136, 100], shapes: [
        st(tube([[134, 74, 9], [124, 54, 7], [110, 44, 4.5], [100, 46, 2]]), tone(o.horn, -0.2), { m: 'horn', gloss: undefined }),
        st([[126, 80], [104, 68, 1], [120, 90]], SD),
        st([[124, 92], [126, 74], [142, 64], [160, 66], [170, 76], [182, 88], [180, 100], [168, 108], [148, 112], [130, 106]], S, { id: 'face',
          lines: [{ p: [[168, 100], [180, 96]], w: 1.2, a: 0.8 }, ...cracks([[[140, 70], [146, 84]]])] }),
        // клыки
        { p: [P(166, 102), P(168, 112, 1), P(171, 101)], c: '#ece4d0', m: 'horn', line: 0.6 },
        { p: [P(174, 99), P(176, 108, 1), P(179, 98)], c: '#ece4d0', m: 'horn', line: 0.6 },
        // тяжёлая надбровная дуга и горящий глаз
        st([[146, 74], [166, 72], [172, 80], [150, 82]], SD, { line: 0.6 }),
        { e: [158, 84, 5, 3.6], c: o.eye, m: 'gem', line: 0.5, glint: [[157, 83, 2]] },
        { e: [178, 88, 1.8, 1.4], c: '#141014', m: 'flat', line: 0 },
        st(tube([[142, 70, 11], [140, 50, 8], [130, 36, 5], [118, 32, 2]]), o.horn, { m: 'horn', gloss: undefined }),
      ] },
    ];
    V.def(name, place(name, parts, 1, 6));
  }
  gargoyle('stone_gargoyle', { c: '#8e9298', m: 'horn', gloss: 0.15, mem: '#747a82', claw: '#e2dccc', horn: '#b4b0a4', eye: '#ff9a2a', crack: '#3e4248' });
  gargoyle('obsidian_gargoyle', { c: '#3a3446', m: 'steel', gloss: 1.2, mem: '#4a3a5c', claw: '#c8a0f0', horn: '#2a2432', eye: '#e070ff', crack: '#b060f0', crackA: 0.9, spikes: '#9a58e0' });

  /* ================= Голем: каменный / железный ================= */
  function golem(name, o) {
    const C = o.c, CD = tone(C, -0.2), M = o.m, G = o.gloss;
    const st = (p, c, extra) => Object.assign({ p, c, m: M, gloss: G }, extra || {});
    const rv = o.rivets ? (pts) => ({ glint: pts.map(q => [q[0], q[1], 2.6]) }) : () => ({});
    const cr = (list) => list.map(p => ({ p, w: 1.2, c: o.crack, a: 0.75 }));
    const legB = (dx, c) => [
      st(slab([86 + dx, 166], [84 + dx, 204], 34, 32, 6), c, { lines: cr([[[80 + dx, 176], [88 + dx, 188]]]) }),
      st(slab([84 + dx, 206], [82 + dx, 234], 32, 34, 6), c, rv([[74 + dx, 214], [92 + dx, 214]])),
      st(bevel([[64 + dx, 230], [100 + dx, 230], [112 + dx, 238], [112 + dx, 246], [62 + dx, 246]], 4), tone(c, -0.08)),
    ];
    const parts = [
      { kind: 'leg', side: -1, pivot: [84, 172], shapes: legB(-4, CD) },
      { kind: 'leg', side: 1, pivot: [118, 174], shapes: legB(32, C) },
      { kind: 'torso', pivot: [100, 150], shapes: [
        // дальняя рука — висит за корпусом
        st(slab([60, 86], [54, 140], 30, 26, 6), CD), st(slab([54, 142], [56, 186], 30, 34, 6), CD),
        st(bevel([[38, 184], [74, 184], [76, 212], [40, 214]], 7), tone(CD, -0.05)),
        // таз
        st(bevel([[70, 146], [134, 146], [138, 184], [66, 184]], 6), tone(C, -0.1), { lines: [{ p: [[102, 150], [102, 182]], w: 1.1, a: 0.5 }] }),
        // грудь-глыба
        st(bevel([[52, 72], [150, 68], [158, 100], [144, 152], [62, 154], [46, 104]], 9), C, { id: 'chest',
          lines: cr([[[64, 96], [74, 110], [70, 126]], [[132, 128], [140, 142]], [[98, 120], [104, 134]]]),
          sub: [
            st(bevel([[66, 80], [104, 78], [102, 112], [68, 114]], 6), tone(C, 0.1), Object.assign({ line: 0.7 }, rv([[72, 84], [98, 84]]))),
            st(bevel([[108, 78], [146, 76], [142, 112], [106, 112]], 6), tone(C, 0.1), Object.assign({ line: 0.7 }, rv([[114, 82], [140, 82]]))),
            st(bevel([[72, 118], [138, 118], [134, 146], [76, 148]], 5), tone(C, 0.03), { line: 0.7, lines: [{ p: [[104, 118], [104, 146]], w: 1, a: 0.5 }] }),
          ] }),
        ...(o.core ? [{ e: [104, 128, 11, 11], c: '#3a3032', m: 'steel', line: 0.8 }, { e: [104, 128, 7, 7], c: o.core, m: 'gem', line: 0.5, glint: [[102, 126, 3]] }] : []),
      ] },
      { kind: 'head', pivot: [108, 76], shapes: [
        st(bevel([[88, 36], [128, 34], [138, 50], [136, 80], [90, 82], [84, 56]], 7), C, { id: 'head', lines: cr([[[96, 42], [100, 54]]]) }),
        st(bevel([[98, 46], [140, 44], [142, 56], [100, 58]], 3), CD, { line: 0.7 }),
        { p: [[108, 58], [138, 57], [137, 63], [109, 64]], c: '#1a1414', m: 'flat', line: 0 },
        { e: [124, 60, 6, 2.6], c: o.eye, m: 'gem', line: 0, glint: [[122, 59, 2]] },
        ...(o.jaw ? [st(bevel([[104, 68], [136, 68], [134, 80], [106, 80]], 3), CD, { line: 0.6, lines: [{ p: [[110, 74], [132, 74]], w: 1, a: 0.6 }] })] : []),
      ] },
      { kind: 'prop', pivot: [140, 88], shapes: [
        st(slab([148, 96], [154, 142], 30, 28, 6), C, rv([[146, 110], [158, 128]])),
        st(slab([154, 144], [160, 186], 32, 36, 6), C, { lines: cr([[[150, 156], [160, 170]]]) }),
        st(bevel([[140, 184], [180, 182], [184, 214], [144, 218]], 8), tone(C, 0.04), { lines: [{ p: [[150, 196], [178, 194]], w: 1.1, a: 0.5 }, { p: [[150, 206], [178, 204]], w: 1.1, a: 0.5 }] }),
        st(bevel([[122, 66], [160, 68], [170, 96], [152, 110], [126, 100]], 8), tone(C, 0.06), Object.assign({ id: 'pauldron' }, rv([[134, 76], [156, 80]]))),
      ] },
    ];
    V.def(name, place(name, parts, 1, 2));
  }
  golem('stone_golem', { c: '#b09c7c', m: 'horn', gloss: 0.12, crack: '#4a3a28', eye: '#f0c050' });
  golem('iron_golem', { c: '#86909c', m: 'steel', gloss: 1, crack: '#3a4048', eye: '#ff5020', rivets: true, core: '#ff7a20', jaw: true });

  /* ================= Маг / архимаг ================= */
  function mage(name, o) {
    const hx = H.headX, hy = H.headY, r = H.headR;
    const hat = [
      { p: [[hx - 40, hy - 12], [hx - 6, hy - 22], [hx + 40, hy - 20], [hx + 44, hy - 12, 1], [hx + 4, hy - 8], [hx - 42, hy - 4, 1]], c: tone(o.hat, -0.1), m: 'cloth', id: 'brim' },
      { p: [[hx - 26, hy - 16], [hx - 14, hy - 48], [hx - 24, hy - 76], [hx - 46, hy - 92, 1], [hx - 12, hy - 84], [hx + 8, hy - 56], [hx + 26, hy - 18]], c: o.hat, m: 'cloth', id: 'hat',
        lines: [{ p: [[hx - 10, hy - 30], [hx - 4, hy - 60]], w: 1.1, a: 0.35 }],
        sub: [
          { p: tube([[hx - 30, hy - 22, 9], [hx, hy - 26, 9], [hx + 30, hy - 22, 9]]), c: o.band, m: 'gold', line: 0.6 },
          { p: star(hx - 2, hy - 46, 7), c: o.star, m: 'gold', line: 0.5 },
          { p: star(hx - 22, hy - 68, 5), c: o.star, m: 'gold', line: 0.5 },
          { p: star(hx + 12, hy - 36, 4), c: o.star, m: 'gold', line: 0.5 },
        ] },
    ];
    const sleeve = (a, b, c) => ({ p: [P(...a), [b[0] - 4, b[1] - 12], P(b[0] + 8, b[1] - 6, 1), P(b[0] + 6, b[1] + 10, 1), [b[0] - 10, b[1] + 8]], c: tone(c, -0.05), m: 'cloth', line: 0.8 });
    const hand = [152, 126], foot = [145, 244], top = [159, 12];
    const shaft = { p: rod(foot, top, 5, 5), c: o.shaft, m: o.shaftM || 'wood', flow: -Math.PI / 2, line: 0.8 };
    const staff = o.crystal
      ? [shaft,
        ...[[-14, -10], [14, -8], [0, -26]].map(([dx, dy]) => ({ p: [P(hand[0] + 7 + dx * 0.6, hand[1] - 116 + dy * 0.2), P(hand[0] + 7 + dx, hand[1] - 124 + dy, 1), P(hand[0] + 7 + dx * 0.3, hand[1] - 110)], c: GOLD, m: 'gold', line: 0.6 })),
        { p: [P(hand[0] + 7, hand[1] - 150, 1), P(hand[0] + 17, hand[1] - 128), P(hand[0] + 7, hand[1] - 110, 1), P(hand[0] - 3, hand[1] - 128)], c: o.crystal, m: 'gem', gloss: 1.4, line: 0.7, glint: [[hand[0] + 4, hand[1] - 134, 3.5]] }]
      : [shaft, ...weapon.staff(hand, [0.06, -1], 116, { orb: o.orb, back: 1, shaft: o.shaft }).slice(1)];
    V.def(name, humanoid({
      name, robe: true, feetC: '#3a2a1c',
      back: [
        ...(o.cape ? [{ p: [[74, 84], [94, 80], [86, 150], [66, 240, 1], [44, 236], [56, 150]], c: o.cape, m: 'cloth', belly: 0.3 }] : []),
        ...arm([80, 90], [72, 124], [88, 146], { c: tone(o.robe, -0.18), hand: SKIN, w: 17 }), sleeve([76, 124], [88, 146], tone(o.robe, -0.18))],
      body: [...robe({ c: o.robe, belt: o.belt }),
        { p: [[98, 82], [110, 82], [120, 246, 1], [106, 246, 1]], c: o.trim, m: 'gold', line: 0.7, lines: [{ p: [[104, 90], [112, 240]], w: 1, light: true, a: 0.5 }] },
        ...(o.runes ? [{ p: star(84, 206, 6), c: o.trim, m: 'gold', line: 0.5 }, { p: star(134, 214, 5), c: o.trim, m: 'gold', line: 0.5 }] : [])],
      head: [...head(hx, hy, r, { skin: SKIN, hair: o.hair, hairStyle: 'long', beard: o.beard, beardLen: 2.6 }),
        { p: [[hx + 2, hy + 10], [hx + 22, hy + 8], [hx + 26, hy + 16], [hx + 8, hy + 18]], c: o.beard, m: 'fur', furLen: 0.6, flow: 0 },
        ...hat],
      arm: [...staff, ...arm([126, 90], [144, 112], hand, { c: o.robe, hand: SKIN, w: 17 }), sleeve([140, 108], [150, 124], o.robe)],
    }));
  }
  mage('mage', { robe: '#2c5ab8', hat: '#2c5ab8', band: '#e8c050', star: '#f0d060', belt: '#d8b050', trim: '#e0c060', hair: '#c8c8c8', beard: '#dcdcdc', orb: '#78d8ff', shaft: '#7a5230' });
  mage('arch_mage', { robe: '#6a2c9c', hat: '#6a2c9c', band: '#f0d060', star: '#f8e080', belt: '#f0c848', trim: '#f0c848', hair: '#f0f0f0', beard: '#f4f4f4', crystal: '#58b8ff', shaft: '#d8a53a', shaftM: 'gold', cape: '#2c2a70', runes: true });

  /* ================= Джинн / мастер-джинн ================= */
  function genie(name, o) {
    const SK = o.skin, SKD = tone(SK, -0.2), SM = o.smoke;
    const wisp = (pts, c) => ({ p: tube(pts), c, m: 'cloth', line: 0.6, belly: 0.3 });
    const hx = H.headX, hy = H.headY + 2, r = H.headR;
    const parts = [
      { kind: 'torso', pivot: [102, 140], shapes: [
        // дымный хвост вместо ног: завитки-струйки за ним, сверху — сама струя
        wisp([[84, 160, 16], [64, 176, 12], [58, 196, 8], [68, 206, 5], [76, 200, 3]], tone(SM, -0.14)),
        wisp([[92, 196, 12], [74, 218, 8], [78, 234, 5], [88, 234, 2.5]], tone(SM, -0.1)),
        wisp([[114, 180, 12], [132, 196, 9], [138, 212, 5], [130, 216, 2.5]], tone(SM, 0.08)),
        { p: tube([[104, 136, 58], [98, 168, 48], [90, 196, 34], [98, 220, 22], [118, 234, 13], [134, 234, 7], [140, 226, 3]]), c: SM, m: 'cloth', belly: 0.3, id: 'smoke',
          lines: [{ p: [[88, 160], [110, 176], [96, 196]], w: 1.4, light: true, a: 0.6 }, { p: [[92, 208], [108, 222], [126, 230]], w: 1.2, light: true, a: 0.6 }, { p: [[112, 150], [120, 170]], w: 1.1, a: 0.35 }] },
        // дальняя рука — кулак в бок
        ...arm([80, 92], [60, 116], [80, 138], { c: SKD, m: 'skin', hand: SKD, w: 17 }),
        { p: tube([[66, 126, 13], [74, 134, 13]]), c: o.gold, m: 'gold', line: 0.7 },
        // торс
        { p: [[74, 82], [126, 80], [140, 96], [138, 122], [128, 146], [80, 148], [70, 124], [64, 98]], c: SK, m: 'skin', id: 'chest',
          lines: [{ p: [[104, 96], [118, 108], [132, 104]], w: 1.2, a: 0.45 }, { p: [[106, 118], [106, 140]], w: 1, a: 0.35 }, { p: [[98, 124], [116, 124]], w: 1, a: 0.3 }] },
        { p: [[70, 84], [98, 80], [92, 112], [86, 146], [74, 144], [66, 112]], c: o.vest, m: 'cloth', line: 0.8, lines: [{ p: [[92, 84], [84, 144]], w: 2, c: o.gold, a: 0.9 }] },
        { p: [[76, 136], [132, 134], [134, 152], [78, 154]], c: o.sash, m: 'cloth', id: 'sash', sub: [{ e: [110, 144, 6, 6], c: o.gold, m: 'gem', line: 0.5 }] },
        { p: [[112, 148], [124, 150], [128, 178, 1], [118, 170], [110, 180, 1]], c: tone(o.sash, -0.1), m: 'cloth', line: 0.7 },
        { p: tube([[H.headX - 4, 70, 18], [H.headX - 6, 86, 22]]), c: SK, m: 'skin' },
        // ближняя рука — вытянута вперёд, в ладони колдовской огонёк
        ...arm([126, 90], [150, 106], [170, 90], { c: SK, m: 'skin', hand: SK, w: 17 }),
        { p: tube([[154, 102, 13], [162, 96, 12]]), c: o.gold, m: 'gold', line: 0.7 },
        { e: [128, 94, 13, 12], c: SK, m: 'skin' },
        { p: star(182, 78, 12, 4), c: o.magic, m: 'gem', line: 0.5, glint: [[182, 78, 6]] },
        { p: star(194, 94, 5, 4), c: o.magic, m: 'gem', line: 0.4 }, { p: star(172, 64, 4, 4), c: o.magic, m: 'gem', line: 0.4 },
      ] },
      { kind: 'head', pivot: [H.headX - 4, H.neckY], shapes: [
        ...(o.turban ? [] : [{ p: tube([[hx - 10, hy - 20, 10], [hx - 30, hy - 30, 8], [hx - 44, hy - 18, 6], [hx - 48, hy + 4, 3]]), c: o.hair, m: 'fur', furLen: 0.8, flow: Math.PI * 0.6 }]),
        ...head(hx, hy, r, { skin: SK, hairStyle: 'bald', beard: o.beard, beardLen: 2.0, eye: o.eye, browC: o.hair }),
        { p: [[hx - 6, hy - 2], [hx - 26, hy - 16, 1], [hx - 14, hy + 8]], c: SK, m: 'skin', line: 0.8 },
        { p: tube([[hx + 12, hy + 10, 3], [hx + 24, hy + 12, 3], [hx + 30, hy + 20, 2]]), c: o.hair, m: 'fur', line: 0.5 },
        { p: ell(hx - 10, hy + 12, 3.5, 4.5, 8), c: o.gold, m: 'gold', line: 0.6 },
        ...(o.turban ? [
          { p: [[hx - 26, hy - 4], [hx - 28, hy - 26], [hx - 10, hy - 42], [hx + 14, hy - 40], [hx + 28, hy - 26], [hx + 26, hy - 10], [hx + 4, hy - 14]], c: o.turban, m: 'cloth', lines: [{ p: [[hx - 24, hy - 14], [hx + 24, hy - 24]], w: 1.2, a: 0.4 }, { p: [[hx - 20, hy - 30], [hx + 20, hy - 34]], w: 1.2, a: 0.4 }] },
          { p: [[hx - 2, hy - 36], [hx + 10, hy - 64, 1], [hx + 12, hy - 36]], c: '#f0f0f8', m: 'feather', texSize: 0.4, line: 0.6 },
          { e: [hx + 6, hy - 30, 6, 7], c: '#d83040', m: 'gem', line: 0.6, glint: [[hx + 4, hy - 32, 2.2]] },
          { p: tube([[hx - 4, hy - 38, 4], [hx + 14, hy - 34, 4]]), c: o.gold, m: 'gold', line: 0.5 }] : []),
      ] },
    ];
    V.def(name, place(name, parts, 1, 4));
  }
  genie('genie', { skin: '#4a86d8', smoke: '#5c94dc', vest: '#7a2a8a', sash: '#d8a53a', gold: '#e8c050', hair: '#16244a', beard: '#16244a', eye: '#f8f0a0', magic: '#fff4b0' });
  genie('master_genie', { skin: '#7cc8e4', smoke: '#c8e4f0', vest: '#c02838', sash: '#f0f0f0', gold: '#f0c848', hair: '#1a3a5a', beard: '#e8f0f8', eye: '#ffffff', magic: '#fff0a0', turban: '#f4f0e6' });

  /* ================= Нага / королева наг ================= */
  function naga(name, o) {
    const SK = o.skin, SKD = tone(SK, -0.2), TL = o.tail, hx = H.headX, hy = H.headY + 6, r = H.headR - 1;
    const sc = (p, c, extra) => Object.assign({ p, c, m: 'horn', gloss: 0.4, tex: 'scale', texSize: 0.7, belly: 0.35 }, extra || {});
    const belly = pts => ({ p: tube(pts), c: o.belly, m: 'horn', gloss: 0.3, line: 0, lines: pts.slice(1).map((q, i) => ({ p: [[pts[i][0] - 10, pts[i][1] + 3], [q[0] + 10, q[1] - 3]], w: 1, a: 0.3 })) });
    // три руки с каждой стороны: плечо, локоть, кисть, направление клинка
    const armsFar = [[[84, 86], [64, 70], [48, 48], [-0.55, -1]], [[82, 94], [58, 100], [30, 92], [-1, -0.35]], [[84, 104], [66, 124], [40, 136], [-1, 0.25]]];
    const armsNear = [[[124, 86], [146, 68], [160, 44], [0.5, -1]], [[126, 94], [150, 100], [178, 92], [1, -0.35]], [[124, 104], [144, 124], [170, 134], [1, 0.25]]];
    const armSet = (list, c, blade) => {
      const out = [];
      list.forEach(([sh, el, hd, dir]) => out.push(...scimitar(hd, dir, 62, { blade, guard: o.guard })));
      list.forEach(([sh, el, hd]) => out.push(...arm(sh, el, hd, { c, m: 'skin', hand: c, w: 13 }), { p: tube([[...lerp(el, hd, 0.55), 12], [...lerp(el, hd, 0.75), 11]]), c: o.gold, m: 'gold', line: 0.6 }));
      return out;
    };
    const parts = [
      { kind: 'prop', pivot: [84, 94], shapes: armSet(armsFar, SKD, tone(o.blade, -0.12)) },
      { kind: 'legs', pivot: [110, 210], shapes: [
        // хвост на земле уходит назад и загибается кончиком вверх
        sc(tube([[136, 236, 32], [96, 240, 28], [56, 238, 22], [22, 230, 15], [0, 214, 10], [-6, 194, 5]]), tone(TL, -0.12), { id: 'tailBack' }),
        // тело спускается из-под торса и ложится петлёй
        sc(tube([[108, 150, 42], [116, 180, 44], [134, 208, 40], [148, 228, 34], [134, 240, 30]]), TL, { id: 'coil',
          sub: [belly([[130, 150, 16], [142, 180, 18], [158, 208, 16], [166, 228, 12]])] }),
      ] },
      { kind: 'torso', pivot: [106, 150], shapes: [
        { p: [[84, 118], [124, 116], [130, 142], [128, 162], [88, 164], [80, 142]], c: SK, m: 'skin', id: 'waist' },
        { p: [[80, 84], [122, 82], [132, 96], [130, 122], [86, 126], [76, 104]], c: SK, m: 'skin', id: 'chest' },
        { p: [[80, 98], [130, 96], [130, 112], [82, 116]], c: o.band, m: 'gold', line: 0.8, glint: [[112, 102, 2.5]], sub: [{ e: [108, 106, 5, 5], c: o.gem, m: 'gem', line: 0.5 }] },
        { p: tube([[82, 146, 8], [106, 152, 8], [130, 146, 8]]), c: o.gold, m: 'gold', line: 0.7 },
        { p: [P(100, 152), P(106, 170, 1), P(112, 152)], c: o.gem, m: 'gem', line: 0.6 },
        { p: tube([[H.headX - 4, 76, 16], [H.headX - 6, 90, 20]]), c: SK, m: 'skin' },
      ] },
      { kind: 'head', pivot: [H.headX - 4, 82], shapes: [
        ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'long', eye: o.eye }),
        ...(o.tall
          ? [{ p: [P(hx - 20, hy - 14, 1), P(hx - 22, hy - 34, 1), P(hx - 12, hy - 24, 1), P(hx - 4, hy - 46, 1), P(hx + 4, hy - 24, 1), P(hx + 14, hy - 40, 1), P(hx + 20, hy - 14, 1)], c: o.gold, m: 'gold', glint: [[hx - 4, hy - 34, 2.5]] },
            { e: [hx - 2, hy - 20, 4, 4.5], c: o.gem, m: 'gem', line: 0.5 }, { e: [hx - 22, hy - 30, 3, 3], c: o.gem, m: 'gem', line: 0.5 }, { e: [hx + 14, hy - 36, 3, 3], c: o.gem, m: 'gem', line: 0.5 }]
          : helm.crown(hx, hy, r, { c: o.gold })),
      ] },
      { kind: 'prop', pivot: [124, 94], shapes: armSet(armsNear, SK, o.blade) },
    ];
    V.def(name, place(name, parts, 1, 12));
  }
  naga('naga', { skin: '#8ad0b4', tail: '#3e9a78', belly: '#e0dca0', hair: '#1c2a2a', eye: '#1a120c', band: '#f0ece0', gold: '#e0b040', gem: '#d83838', blade: '#d6dde6', guard: '#d8a53a' });
  naga('naga_queen', { skin: '#d8a0d8', tail: '#7a3aa0', belly: '#f0d890', hair: '#2a1030', eye: '#401060', band: '#e8c050', gold: '#f0c848', gem: '#38c8e8', blade: '#f0d070', guard: '#c83040', tall: true });

  /* ================= Гигант / титан ================= */
  function giant(name, o) {
    const SK = o.skin, SKD = tone(SK, -0.2), hx = H.headX + 2, hy = H.headY + 2, r = 27;
    const fist = (x, y, c) => ({ p: ell(x, y, 12, 11, 10), c, m: o.handM || 'skin', line: 0.8, lines: [{ p: [[x + 4, y - 8], [x + 6, y + 6]], w: 1, a: 0.5 }] });
    const zig = (hd, k) => [[-4, 6], [10, -30], [0, -33], [18, -66], [8, -69], [30, -110], [2, -62], [12, -59], [-10, -24], [0, -21], [-12, 10]].map(([x, y]) => P(hd[0] + x * k, hd[1] + y * k, 1));
    const bolt = hd => [{ p: zig(hd, 1.15), c: '#ffd84a', m: 'gem', gloss: 1.4, line: 0.9, lc: '#b87808', glint: [[hd[0] + 10, hd[1] - 46, 6], [hd[0] + 22, hd[1] - 92, 5]] },
      { p: zig([hd[0] + 2, hd[1] - 4], 0.9), c: '#fffbe0', m: 'flat', line: 0 }];
    const hand = [160, 44];
    V.def(name, humanoid({
      name, size: o.size || 1,
      before: o.cape ? [{ kind: 'torso', pivot: [H.cx, H.waistY], shapes: [{ p: [[70, 84], [96, 80], [90, 150], [72, 214], [44, 208], [56, 140]], c: o.cape, m: 'cloth', belly: 0.3 }] }] : [],
      legs: (hip, foot, side) => leg(hip, foot, { style: o.greaves ? 'armor' : 'hose', c: o.greaves ? (side < 0 ? tone(o.greaves, -0.15) : o.greaves) : (side < 0 ? SKD : SK), m: 'skin', boot: side < 0 ? tone(o.boot, -0.15) : o.boot, tw: 30 }),
      back: [...arm([80, 90], [68, 124], [74, 152], { c: SKD, m: 'skin', hand: false, w: 22 }), fist(76, 158, SKD),
        ...(o.bracer ? [{ p: tube([[70, 132, 20], [72, 144, 19]]), c: tone(o.bracer, -0.12), m: 'gold', line: 0.7 }] : [])],
      body: o.armor
        ? [...torso({ c: o.armor, m: 'gold', skirt: o.skirt, skirtLen: 196, belt: tone(o.armor, -0.25), neck: SK, chestLines: [{ p: [[92, 100], [104, 110], [128, 104]], w: 1.4, a: 0.5 }, { p: [[106, 112], [106, 140]], w: 1.2, a: 0.4 }] }),
          { p: [[70, 80], [96, 76], [100, 100], [80, 108], [62, 98]], c: o.armor, m: 'gold', glint: [[80, 86, 3]] }]
        : [...torso({ c: SK, m: 'skin', skirt: o.toga, skirtLen: 200, belt: o.belt, neck: SK, chestLines: [{ p: [[92, 102], [104, 112], [128, 106]], w: 1.3, a: 0.45 }] }),
          { p: [[70, 82], [94, 78], [132, 132], [128, 150], [104, 148], [68, 102]], c: o.toga, m: 'cloth', lines: [{ p: [[84, 88], [118, 138]], w: 1.2, a: 0.4 }, { p: [[76, 98], [106, 144]], w: 1, a: 0.3 }] }],
      head: [
        ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'long', beard: o.hair, beardLen: 2.1 }),
        { p: [[hx - 4, hy + 14], [hx + 30, hy + 10], [hx + 30, hy + 30 * o.bk], [hx + 14, hy + 56 * o.bk], [hx - 10, hy + 44 * o.bk], [hx - 18, hy + 20]], c: o.hair, m: 'fur', furLen: 1, flow: Math.PI * 0.5, id: 'beard2' },
        { p: [[hx + 10, hy + 12], [hx + 30, hy + 10], [hx + 32, hy + 17], [hx + 14, hy + 18]], c: tone(o.hair, 0.12), m: 'fur', furLen: 0.5, flow: 0 },
        ...(o.helm ? [
          { p: tube([[hx - 40, hy + 2, 9], [hx - 34, hy - 30, 15], [hx - 10, hy - 50, 16], [hx + 16, hy - 44, 12], [hx + 28, hy - 30, 6]]), c: o.crest, m: 'fur', furLen: 1, flow: Math.PI * 0.9 },
          { p: [[hx - 30, hy + 12], [hx - 32, hy - 12], [hx - 18, hy - 30], [hx + 4, hy - 34], [hx + 22, hy - 26], [hx + 30, hy - 12], [hx + 33, hy - 4, 1], [hx + 10, hy - 9], [hx - 6, hy - 8], [hx - 14, hy + 6], [hx - 18, hy + 24, 1]], c: o.helm, m: 'gold', glint: [[hx - 8, hy - 24, 3.5]],
            lines: [{ p: [[hx - 26, hy - 10], [hx - 10, hy - 26], [hx + 14, hy - 26]], w: 1.2, light: true, a: 0.7 }] },
          { p: tube([[hx - 4, hy - 9, 4], [hx + 33, hy - 5, 4]]), c: tone(o.helm, -0.15), m: 'gold', line: 0.6 }] : []),
      ],
      arm: [
        ...(o.bolt ? bolt(hand) : []),
        ...arm([126, 90], [150, 72], hand, { c: SK, m: 'skin', hand: false, w: 22 }),
        ...(o.bracer ? [{ p: tube([[152, 66, 20], [156, 54, 19]]), c: o.bracer, m: 'gold', line: 0.7 }] : []),
        fist(hand[0] + 1, hand[1] - 2, SK),
        ...(o.armor ? [{ p: [[112, 78], [140, 76], [150, 96], [132, 108], [114, 98]], c: o.armor, m: 'gold', glint: [[130, 84, 3.5]] }] : [{ e: [128, 94, 16, 15], c: SK, m: 'skin' }]),
      ],
    }));
  }
  giant('giant', { skin: '#d8a070', hair: '#5a3418', toga: '#ece6d6', belt: '#b08a40', boot: '#6a4424', bk: 1, size: 1.08 });
  giant('titan', { skin: '#b0c4e8', hair: '#eef2f8', bk: 0.8, size: 1.08, armor: '#e0b040', skirt: '#2c4aa0', boot: '#8a6a2a', greaves: '#e0b040', bracer: '#e8c050', helm: '#e8b840', crest: '#c02828', cape: '#2a48a8', bolt: true });
})(typeof window !== 'undefined' ? window : globalThis);
