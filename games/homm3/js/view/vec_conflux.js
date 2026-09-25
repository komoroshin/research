/* ============================================================================
   view/vec_conflux.js — Сопряжение на рисованном конвейере.
   Фея, четыре пары элементалей, псионический элементаль и жар-птица —
   каждое существо функцией с параметрами; улучшение — тот же рисунок в другой
   гамме и с отличительной деталью (молнии, лёд, плазма, лава, кольцо, пламя).
   Рисуем в каноне гуманоида (земля y=246, центр x=100), place() вписывает в рамку
   старого спрайта; птицы — в своей рамке (земля y=290).

   Приёмы стихий:
   - свечение и прозрачность — формы материала flat с цветом 'rgba(…)': у flat
     заливка берётся как есть (tone() rgba не понимает — у таких форм контур
     либо выключен, либо задан явным lc);
   - блеск стихии — материал gem; потоки и завихрения — светлые штрихи lines;
   - огонь — «язык» из трёх слоёв: внешний (gem), средний и ядро (flat).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, P, norm, lerp, ell, grow, head, wing, fit, frameOf, tone, leaf } = K;

  /* ---------- помощники этого файла ---------- */
  const FB = { w: 200, h: 250, anchor: [100, 246] };
  /** Вписать части из канона (земля y=246, центр x=100+dx) в рамку старого спрайта name. */
  function place(name, parts, size, dx) {
    const to = frameOf(name) || FB;
    return fit(parts, { ground: [100 + (dx || 0), 246] }, to, to.anchor[1] / 246 * (size || 1));
  }
  const rgba = (rgb, a) => 'rgba(' + rgb + ',' + (+a).toFixed(3) + ')';
  /** Полупрозрачная форма (дымка, вихрь, призрачная плоть). extra — например { line, lc } с явным цветом контура. */
  const haze = (p, rgb, a, extra) => Object.assign({ p, c: rgba(rgb, a), m: 'flat', line: 0 }, extra || {});
  /** Свечение: три вложенных полупрозрачных овала — мягкий ореол и плотное ядро. */
  function glow(cx, cy, rx, ry, rgb, a) {
    a = a === undefined ? 1 : a;
    // пять ступеней с малым шагом прозрачности — край ореола не читается
    return [[1, 0.06], [0.82, 0.08], [0.64, 0.11], [0.46, 0.15], [0.3, 0.2]].map(([k, al]) => ({ e: [cx, cy, rx * k, ry * k], c: rgba(rgb, al * a), m: 'flat', line: 0 }));
  }
  /** Скосить углы многоугольника — мягкий «блок» (камень, глыба). */
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
  /** Брусок a → b шириной w0 → w1 со скошенными углами (каменные руки-ноги). */
  function slab(a, b, w0, w1, r) {
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]), nx = -dy, ny = dx, h0 = w0 / 2, h1 = w1 / 2;
    return bevel([[a[0] + nx * h0, a[1] + ny * h0], [b[0] + nx * h1, b[1] + ny * h1], [b[0] - nx * h1, b[1] - ny * h1], [a[0] - nx * h0, a[1] - ny * h0]], r || 4);
  }
  /** Звезда-искра (острые углы): n лучей, радиус r, внутренний радиус r * k. */
  function star(cx, cy, r, n, k) {
    n = n || 4; k = k || 0.4; const out = [];
    for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * k : r; out.push(P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 1)); }
    return out;
  }
  /** Искра: звёздочка с ореолом. */
  const spark = (x, y, r, c, rgb) => [...glow(x, y, r * 1.8, r * 1.8, rgb, 0.9), { p: star(x, y, r, 4, 0.3), c, m: 'gem', gloss: 1.2, line: 0.4, lc: tone(c, -0.5) }];
  /** Молния-зигзаг от точки a к b. */
  function bolt(a, b, w, c, lc) {
    const n = 5, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), px = -dy / L, py = dx / L, L2 = [], R2 = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, j = i % 2 ? 1 : -1, off = (i === 0 || i === n) ? 0 : j * w * 1.4, ww = w * (1 - t * 0.85);
      const x = a[0] + dx * t + px * off, y = a[1] + dy * t + py * off;
      L2.push(P(x + px * ww, y + py * ww, 1)); R2.push(P(x - px * ww, y - py * ww, 1));
    }
    return { p: [...L2, ...R2.reverse()], c: c || '#fff07a', m: 'gem', gloss: 1.3, line: 0.6, lc: lc || '#c08010' };
  }
  /** Точка на пути от основания B по углу ang: t — доля длины, w — отступ поперёк. */
  const along = (B, ang, len) => { const c = Math.cos(ang), s = Math.sin(ang); return (t, w) => [B[0] + c * len * t - s * w, B[1] + s * len * t + c * w]; };
  /** Язык пламени: основание B, угол ang, длина, ширина; curl — изгиб кончика вбок. */
  function flameP(B, ang, len, wid, curl) {
    const at = along(B, ang, len), cu = curl || 0;
    return [at(0, -wid * 0.5), at(0.3, -wid * 0.56), at(0.62, -wid * 0.3 + cu * 0.3), P(...at(1, cu), 1), at(0.7, wid * 0.14 + cu * 0.45), at(0.36, wid * 0.46), at(0, wid * 0.5)];
  }
  /** Трёхслойный язык огня: внешний край, средний слой и раскалённое ядро. pal: { out, mid, core, lc } */
  function tongue(B, ang, len, wid, pal, curl) {
    const cu = curl || 0;
    return [
      { p: flameP(B, ang, len, wid, cu), c: pal.out, m: 'gem', gloss: 0.3, ao: 0.35, line: 0.5, lc: pal.lc },
      { p: flameP(B, ang, len * 0.74, wid * 0.62, cu * 0.7), c: pal.mid, m: 'gem', line: 0, ao: 0.15, gloss: 0.2, rim: 0 },
      { p: flameP(B, ang, len * 0.44, wid * 0.34, cu * 0.4), c: pal.core, m: 'flat', line: 0 },
    ];
  }
  /** Огненное тело: контур в три слоя (внешний, средний, ядро), сжатых к центру (cx, cy). */
  function blaze(pts, cx, cy, pal, extra) {
    return [
      Object.assign({ p: pts, c: pal.out, m: 'gem', gloss: 0.35, ao: 0.4, line: 0.6, lc: pal.lc }, extra || {}),
      { p: grow(pts, cx, cy, 0.8, 0.86), c: pal.mid, m: 'gem', line: 0, ao: 0.15, gloss: 0.2, rim: 0 },
      { p: grow(pts, cx, cy - 6, 0.5, 0.6), c: pal.core, m: 'flat', line: 0 },
    ];
  }
  /** Трубка-«рука» из огня: три слоя, сужающихся к оси. */
  function blazeTube(c, pal) {
    const k = (m) => c.map(q => [q[0], q[1], q[2] * m]);
    return [{ p: tube(c), c: pal.out, m: 'gem', gloss: 0.35, ao: 0.4, line: 0.6, lc: pal.lc }, { p: tube(k(0.66)), c: pal.mid, m: 'flat', line: 0 }, { p: tube(k(0.32)), c: pal.core, m: 'flat', line: 0 }];
  }
  /** Кристалл: шестигранная призма сбоку — основание B, угол ang, остриё на конце. */
  function shard(B, ang, len, wid, c, lc) {
    const at = along(B, ang, len);
    return { p: [P(...at(0, -wid / 2), 1), P(...at(0.7, -wid / 2), 1), P(...at(1, 0), 1), P(...at(0.7, wid / 2), 1), P(...at(0, wid / 2), 1)], c, m: 'gem', gloss: 1.3, line: 0.7, lc,
      lines: [{ p: [at(0.02, -wid * 0.12), at(0.7, -wid * 0.12), at(0.97, 0)], w: 1.1, light: true, a: 0.9 }] };
  }
  /** Капля (вода, лава): кончик вверх, круглый низ. */
  const drop = (x, y, r, c, extra) => Object.assign({ p: [P(x, y - r * 2.2, 1), [x + r * 0.85, y - r * 0.2], [x + r * 0.6, y + r * 0.8], [x - r * 0.6, y + r * 0.8], [x - r * 0.85, y - r * 0.2]], c, m: 'gem', line: 0.5 }, extra || {});
  /** Крыло насекомого (стрекоза): прозрачная перепонка, жилки, тёмный глазок у кончика. col: { rgb, a, vein, veinRgb, tipRgb } */
  function insectWing(O, d, L, W, col) {
    d = norm(d[0], d[1]); const n = [d[1], -d[0]];
    const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
    const w = L * W;
    const lines = [{ p: [T(0, -w * 0.6), T(L * 0.5, -w * 0.78), T(L * 0.96, -w * 0.3)], w: 1.5, c: col.vein }];
    for (let i = 1; i <= 5; i++) { const t = i / 6.2; lines.push({ p: [T(L * t, -w * 0.7), T(L * (t + 0.05), 0), T(L * (t + 0.02), w * 0.8)], w: 0.7, c: rgba(col.veinRgb, 0.55) }); }
    lines.push({ p: [T(4, -w * 0.1), T(L * 0.5, w * 0.05), T(L * 0.9, w * 0.1)], w: 0.8, c: rgba(col.veinRgb, 0.6) });
    return [{ p: [T(-3, -w * 0.3), T(L * 0.22, -w * 0.95), T(L * 0.62, -w), T(L * 0.93, -w * 0.6), T(L * 1.02, 0), T(L * 0.88, w * 0.66), T(L * 0.5, w * 0.92), T(L * 0.14, w * 0.6), T(-2, w * 0.2)],
      c: rgba(col.rgb, col.a || 0.34), m: 'flat', line: 0.7, lc: col.vein, lines,
      sub: [...[[0.34, 0.1], [0.26, 0.12], [0.18, 0.16]].map(([k, al]) => ({ e: [...T(L * 0.86, 0), L * k, L * k * 0.7], c: rgba(col.tipRgb, al), m: 'flat', line: 0 })),
        { e: [...T(L * 0.8, -w * 0.62), L * 0.05, L * 0.03], c: col.vein, m: 'flat', line: 0 }],
      glint: [[...T(L * 0.3, -w * 0.35), L * 0.08]] }];
  }

  /* ================= Фея / спрайт =================
     Крошечная девочка-эльф парит на двух парах стрекозиных крыльев, юбка из лепестков.
     Летун: крылья — prop (машут), руки — в корпусе. */
  function pixie(name, o) {
    const SK = '#f8dcc6', SKD = tone(SK, -0.14), hx = 112, hy = 84, r = 22;
    const WF = { rgb: o.wingRgb, a: 0.26, vein: tone(o.vein, -0.15), veinRgb: o.veinRgb, tipRgb: o.tipRgb };
    const WN = { rgb: o.wingRgb, a: 0.36, vein: o.vein, veinRgb: o.veinRgb, tipRgb: o.tipRgb };
    const ws = o.wingK || 1;
    const shoe = (B, ang, c) => { const lf = leaf(B, ang, 17, 10); return { p: lf.body, c, m: 'leather', line: 0.6 }; };
    const petals = [[0.8, 34, 20, -6], [0.24, 34, 20, 8], [0.68, 40, 23, -3], [0.36, 40, 23, 4], [0.52, 43, 25, 0]].map(([a, len, wid, dx], i) => {
      const lf = leaf([106 + dx, 142], Math.PI * a, len, wid);
      return { p: lf.body, c: i < 2 ? tone(o.dress, -0.18) : i < 4 ? tone(o.dress, -0.06) : o.dress, m: 'cloth', line: 0.7, lines: [{ p: lf.shaft, w: 0.9, a: 0.45 }, { p: lf.shaft.slice(0, 2), w: 0.8, light: true, a: 0.4 }] };
    });
    const hand = [155, 114];
    const handProp = o.wand
      ? [{ p: tube([[146, 128, 3], [178, 80, 2.4]]), c: '#e8c050', m: 'gold', line: 0.5 }, ...spark(181, 76, 11, o.spark, o.sparkRgb), ...spark(196, 96, 4, o.spark, o.sparkRgb), ...spark(170, 62, 3.5, o.spark, o.sparkRgb)]
      : [...spark(165, 104, 7, o.spark, o.sparkRgb), ...spark(176, 118, 3, o.spark, o.sparkRgb), ...spark(172, 90, 2.6, o.spark, o.sparkRgb)];
    const parts = [
      { kind: 'prop', pivot: [96, 122], shapes: [...insectWing([96, 122], [-0.28, -1], 106 * ws, 0.15, WF), ...insectWing([96, 126], [-1, -0.08], 84 * ws, 0.16, WF)] },
      { kind: 'prop', pivot: [100, 122], shapes: [...insectWing([100, 122], [-0.72, -0.85], 122 * ws, 0.16, WN), ...insectWing([100, 128], [-1, 0.34], 94 * ws, 0.16, WN)] },
      { kind: 'leg', side: -1, pivot: [102, 166], shapes: [
        { p: tube([[102, 162, 15], [90, 194, 11]], { flat0: true }), c: SKD, m: 'skin' },
        { p: tube([[90, 194, 10.5], [84, 212, 8], [81, 226, 6]]), c: SKD, m: 'skin' },
        shoe([81, 224], Math.PI * 0.6, tone(o.shoe, -0.2)),
      ] },
      { kind: 'leg', side: 1, pivot: [114, 166], shapes: [
        { p: tube([[114, 162, 15], [124, 194, 11]], { flat0: true }), c: SK, m: 'skin' },
        { p: tube([[124, 194, 10.5], [122, 212, 8], [118, 226, 6]]), c: SK, m: 'skin' },
        shoe([118, 224], Math.PI * 0.44, o.shoe),
      ] },
      { kind: 'torso', pivot: [108, 140], shapes: [
        { p: tube([[98, 118, 10], [88, 138, 8], [94, 156, 7]]), c: SKD, m: 'skin' },
        { e: [95, 159, 4.6, 4.2], c: SKD, m: 'skin', line: 0.7 },
        ...petals,
        { p: [[96, 110], [120, 108], [128, 122], [122, 144], [104, 148], [94, 134], [92, 120]], c: o.bodice || o.dress, m: 'cloth', belly: 0.2,
          lines: [{ p: [[110, 114], [112, 144]], w: 1, light: true, a: 0.4 }, { p: [[100, 124], [104, 128], [100, 132]], w: 0.9, a: 0.5 }] },
        { p: tube([[96, 144, 5.5], [106, 146, 5.5], [120, 142, 5.5]]), c: o.belt, m: o.beltM || 'cloth', line: 0.6 },
        { p: tube([[108, 98, 9], [108, 114, 10]]), c: SK, m: 'skin' },
        { p: tube([[118, 116, 10], [136, 130, 8]]), c: SK, m: 'skin' },
        { p: tube([[136, 130, 7.5], [152, 116, 6]]), c: SK, m: 'skin' },
        { e: [hand[0], hand[1], 4.8, 4.4], c: SK, m: 'skin', line: 0.7 },
        { p: [[114, 108], [128, 110], [132, 122], [120, 124]], c: o.bodice || o.dress, m: 'cloth', line: 0.7 },
        ...handProp,
      ] },
      { kind: 'head', pivot: [108, 104], shapes: [
        ...head(hx, hy, r, { skin: SK, hair: o.hair, hairStyle: 'long', ear: false, eye: o.eye }),
        // заострённое эльфийское ухо поверх волос
        { p: [[hx - r * 0.2, hy + r * 0.3], [hx - r * 0.55, hy - r * 0.05], P(hx - r * 1.15, hy - r * 0.7, 1), [hx - r * 0.3, hy - r * 0.2]], c: SK, m: 'skin', line: 0.7, lc: tone(SK, -0.6),
          lines: [{ p: [[hx - r * 0.35, hy + r * 0.05], [hx - r * 0.8, hy - r * 0.4]], w: 0.9, a: 0.4 }] },
        { e: [hx + r * 0.58, hy + r * 0.42, r * 0.16, r * 0.1], c: '#f0a0a0', m: 'flat', line: 0 },
        // чёлка прядями вперёд
        { p: [[hx - r * 0.3, hy - r * 1.05], [hx + r * 0.6, hy - r * 0.95], P(hx + r * 1.0, hy - r * 0.3, 1), [hx + r * 0.62, hy - r * 0.55], P(hx + r * 0.46, hy - r * 0.2, 1), [hx + r * 0.26, hy - r * 0.62], P(hx + r * 0.05, hy - r * 0.35, 1), [hx - r * 0.2, hy - r * 0.75]], c: tone(o.hair, 0.08), m: 'fur', furLen: 0.5, flow: Math.PI * 0.3, line: 0.6 },
        ...(o.tiara
          ? [{ p: tube([[hx - r * 0.7, hy - r * 0.78, 3], [hx, hy - r * 1.08, 3], [hx + r * 0.62, hy - r * 0.86, 3]]), c: '#f0c848', m: 'gold', line: 0.5 },
            { p: star(hx - r * 0.05, hy - r * 1.22, 6, 4, 0.35), c: o.tiara, m: 'gem', line: 0.5, lc: tone(o.tiara, -0.5), glint: [[hx - r * 0.08, hy - r * 1.25, 2.2]] }]
          : [0, 1, 2, 3, 4].map(i => { const a = i / 5 * Math.PI * 2; return { e: [hx - r * 0.55 + Math.cos(a) * 4.4, hy - r * 0.9 + Math.sin(a) * 4.4, 3.6, 3.6], c: o.flower, m: 'cloth', line: 0.5 }; }).concat([{ e: [hx - r * 0.55, hy - r * 0.9, 2.6, 2.6], c: '#f8d840', m: 'gem', line: 0.4 }])),
      ] },
    ];
    V.def(name, place(name, parts, o.size || 1, 8));
  }
  pixie('pixie', { hair: '#e0662a', eye: '#2a6a2a', dress: '#4aa83a', bodice: '#3a9030', belt: '#e8d070', shoe: '#3a8a2a', flower: '#f08ab8',
    wingRgb: '200,245,235', vein: '#3a8a8a', veinRgb: '60,140,140', tipRgb: '120,230,180', spark: '#fff6a0', sparkRgb: '255,240,150' });
  pixie('sprite', { hair: '#e4e8f4', eye: '#3a4ab0', dress: '#3a62d0', bodice: '#e8ecf8', belt: '#f0c848', beltM: 'gold', shoe: '#2c4aa8', tiara: '#78d8ff',
    wingRgb: '215,200,255', vein: '#6a4ab0', veinRgb: '110,80,190', tipRgb: '255,150,230', spark: '#ffffff', sparkRgb: '190,220,255', wand: true, wingK: 1.1 });

  /* ================= Воздушный / штормовой элементаль =================
     Смерч-воронка вместо ног, облачный торс, голова со струёй ветра назад.
     Штормовой — грозовая туча с молнией в кулаке и жёлтыми глазами. */
  function air(name, o) {
    const B = o.c, BD = tone(B, -0.22), BL = tone(B, 0.3), R = o.rgb, W = o.white;
    const band = (x0, x1, y, s, light) => ({ p: [[x0, y - s], [(x0 + x1) / 2 - 4, y + s * 0.9], [x1, y - s * 0.2]], w: light ? 2.4 : 1.6, light, a: light ? 0.85 : 0.5 });
    const funnel = [[100, 140, 82], [95, 176, 56], [101, 206, 34], [98, 228, 18], [100, 238, 9]];
    const ribbon = (pts, a) => haze(tube(pts), W, a);
    const parts = [
      { kind: 'legs', pivot: [100, 170], shapes: [
        ...glow(100, 238, 40, 7, R, 0.9),
        haze(tube([[100, 132, 104], [94, 174, 72], [102, 206, 46], [99, 228, 26], [100, 236, 14]]), R, 0.22),
        { p: tube(funnel), c: B, m: 'gem', gloss: 0.5, line: 0.6, lc: tone(B, -0.6),
          lines: [band(60, 138, 152, 5, true), band(68, 128, 168, 5, false), band(72, 124, 182, 4, true), band(80, 120, 196, 4, false), band(86, 116, 208, 3, true), band(90, 108, 220, 3, false), band(92, 106, 230, 2, true)] },
        ribbon([[54, 178, 3], [76, 192, 5], [118, 190, 5], [140, 176, 2.5]], 0.55),
        ribbon([[70, 214, 2.5], [92, 222, 4], [120, 216, 3], [132, 206, 2]], 0.5),
        ...(o.bolts ? [bolt([112, 170], [96, 212], 3.4, o.bolt, o.boltLc)] : []),
      ] },
      { kind: 'torso', pivot: [104, 130], shapes: [
        ...glow(104, 112, 70, 64, R, 0.8),
        // дальняя рука вскинута вверх, кончик закручен ветром
        { p: tube([[84, 98, 26], [70, 74, 20], [66, 48, 16], [74, 28, 11], [88, 22, 5]]), c: BD, m: 'gem', gloss: 0.45, line: 0.6, lc: tone(BD, -0.6),
          lines: [{ p: [[70, 92], [80, 80]], w: 2, light: true, a: 0.7 }, { p: [[60, 64], [74, 56]], w: 2, light: true, a: 0.7 }, { p: [[62, 40], [76, 38]], w: 1.6, light: true, a: 0.7 }] },
        ribbon([[62, 30, 3], [74, 14, 4], [92, 12, 3], [100, 22, 1.5]], 0.5),
        ...(o.bolts ? [bolt([74, 20], [58, -8], 3, o.bolt, o.boltLc)] : []),
        // хвосты ветра за спиной
        ribbon([[74, 112, 10], [50, 104, 7], [30, 112, 4], [16, 104, 1.5]], 0.45),
        ribbon([[76, 136, 8], [52, 140, 6], [34, 132, 3], [24, 138, 1.5]], 0.4),
        { p: [[66, 106], [80, 86], [108, 78], [134, 84], [146, 100], [142, 124], [128, 142], [104, 152], [82, 146], [68, 128]], c: B, m: 'gem', gloss: 0.55, line: 0.7, lc: tone(B, -0.6), belly: 0.25,
          lines: [{ p: [[74, 100], [100, 92], [132, 98]], w: 2.4, light: true, a: 0.8 }, { p: [[72, 122], [104, 118], [140, 116]], w: 2, light: true, a: 0.7 }, { p: [[80, 138], [108, 138], [128, 134]], w: 1.4, a: 0.45 }],
          sub: [{ p: tube([[84, 124, 12], [104, 108, 14], [128, 110, 10], [136, 124, 5]]), c: BL, m: 'gem', line: 0, gloss: 0.6 }] },
        ...(o.bolts ? [bolt([96, 96], [118, 136], 3, o.bolt, o.boltLc)] : []),
      ] },
      { kind: 'head', pivot: [108, 88], shapes: [
        // струя ветра со лба назад — «волосы» элементаля
        { p: tube([[108, 50, 34], [82, 44, 26], [58, 50, 16], [38, 44, 8], [26, 36, 3]]), c: BD, m: 'gem', gloss: 0.45, line: 0.6, lc: tone(BD, -0.6),
          lines: [{ p: [[92, 40], [66, 42], [40, 42]], w: 1.8, light: true, a: 0.75 }, { p: [[90, 56], [64, 54]], w: 1.4, a: 0.4 }] },
        ...(o.cloud ? [[86, 40, 12], [100, 32, 14], [116, 34, 12], [128, 44, 9], [72, 48, 10]].map(([x, y, rr]) => ({ p: ell(x, y, rr, rr * 0.86, 10), c: o.cloud, m: 'gem', gloss: 0.35, line: 0.6, lc: tone(o.cloud, -0.6) })) : []),
        { p: ell(112, 60, 23, 22, 12), c: BL, m: 'gem', gloss: 0.6, line: 0.7, lc: tone(B, -0.6),
          lines: [{ p: [[94, 52], [108, 44], [126, 46]], w: 1.6, light: true, a: 0.8 }, { p: [[96, 72], [110, 78], [124, 74]], w: 1.2, a: 0.4 }] },
        { p: [[114, 50], [134, 50], [134, 56], [116, 58]], c: tone(B, -0.45), m: 'flat', line: 0 },
        ...glow(122, 60, 9, 7, o.eyeRgb, 1), ...glow(133, 59, 7, 6, o.eyeRgb, 0.9),
        { e: [122, 60, 4.6, 3.4], c: o.eye, m: 'gem', line: 0.5, lc: tone(o.eye, -0.6), glint: [[121, 59, 1.8]] },
        { e: [133, 59, 3.4, 2.9], c: o.eye, m: 'gem', line: 0.5, lc: tone(o.eye, -0.6), glint: [[132.4, 58.2, 1.4]] },
        ...(o.bolts ? [bolt([104, 26], [120, 2], 3.2, o.bolt, o.boltLc)] : []),
      ] },
      { kind: 'prop', pivot: [126, 98], shapes: [
        ...(o.bolts ? [...glow(186, 38, 26, 30, '255,240,140', 0.9), bolt([174, 76], [206, 4], 8, o.bolt, o.boltLc), bolt([192, 38], [222, 44], 4, o.bolt, o.boltLc)] : []),
        { p: tube([[124, 96, 26], [146, 100, 20], [164, 86, 16]]), c: B, m: 'gem', gloss: 0.5, line: 0.6, lc: tone(B, -0.6),
          lines: [{ p: [[128, 90], [146, 94], [160, 82]], w: 2, light: true, a: 0.75 }] },
        { p: ell(170, 80, 16, 15, 12), c: BL, m: 'gem', gloss: 0.6, line: 0.6, lc: tone(B, -0.6),
          lines: [{ p: [[160, 80], [166, 72], [176, 72], [180, 80], [172, 88], [166, 82]], w: 1.8, light: true, a: 0.85 }] },
        ribbon([[180, 90, 3], [194, 96, 3.5], [206, 90, 2]], 0.5),
      ] },
    ];
    V.def(name, place(name, parts, 1, 4));
  }
  air('air_elemental', { c: '#c6d4e2', white: '255,255,255', rgb: '215,232,250', eye: '#2a5ad0', eyeRgb: '90,150,255' });
  air('storm_elemental', { c: '#5c6c90', white: '200,215,255', rgb: '110,140,220', eye: '#fff070', eyeRgb: '255,240,120', cloud: '#3c4666',
    bolts: true, bolt: '#fff27a', boltLc: '#b88008' });

  /* ================= Водяной / ледяной элементаль =================
     Тело-волна поднимается из лужи, пенный гребень на голове, руки — толстые струи.
     Ледяной — то же, но застывшее: грани, кристаллы вместо пены, ледяное копьё в кулаке. */
  function water(name, o) {
    const M = o.c, MD = tone(M, -0.24), ML = o.light, F = o.foam, R = o.rgb, lc = tone(M, -0.62), ice = o.ice;
    const foam = (x, y, rr) => ({ p: ell(x, y, rr, rr * 0.85, 9), c: F, m: 'cloth', line: 0.5, lc: tone(F, -0.4), rim: 0.6 });
    const bubble = (x, y, rr) => ({ e: [x, y, rr, rr], c: rgba('255,255,255', 0.4), m: 'flat', line: 0.5, lc: rgba('255,255,255', 0.7) });
    const body = [[66, 100], [84, 84], [118, 80], [140, 92], [146, 116], [134, 144], [122, 176], [126, 214], [80, 216], [84, 178], [74, 142]];
    const ripple = ice
      ? [{ p: [[92, 96], [104, 150], [96, 200]], w: 1.4, light: true, a: 0.9 }, { p: [[118, 90], [128, 130]], w: 1.2, light: true, a: 0.8 }, { p: [[104, 150], [128, 144]], w: 1, a: 0.5 }, { p: [[84, 128], [104, 150]], w: 1, a: 0.5 }]
      : [{ p: [[80, 108], [96, 124], [90, 150], [100, 176]], w: 2, light: true, a: 0.7 }, { p: [[120, 96], [132, 118], [124, 140]], w: 1.6, light: true, a: 0.6 }, { p: [[104, 186], [112, 204]], w: 1.4, light: true, a: 0.6 }];
    const legs = [
      // волна-завиток за спиной
      { p: tube([[96, 236, 24], [66, 232, 20], [46, 218, 15], [40, 200, 11], [50, 190, 7], [60, 194, 4]]), c: MD, m: 'gem', gloss: 0.8, line: 0.6, lc,
        lines: [{ p: [[88, 230], [62, 226], [48, 212]], w: 1.6, light: true, a: 0.7 }] },
      haze(bevel([[34, 245], [44, 228], [70, 216], [104, 212], [140, 216], [164, 228], [170, 245]], 8), R, 0.3),
      { p: [P(40, 245, 1), [46, 232], [68, 222], [100, 218], [134, 220], [156, 230], P(164, 245, 1)], c: M, m: 'gem', gloss: 0.8, line: 0.6, lc,
        lines: [{ p: [[56, 236], [80, 230], [104, 234]], w: 1.6, light: true, a: 0.7 }, { p: [[112, 230], [140, 228], [152, 236]], w: 1.4, light: true, a: 0.6 }] },
    ];
    if (ice) legs.push(...[[50, 236, -0.7, 26, 12], [70, 226, -0.58, 30, 13], [138, 226, -0.4, 28, 12], [158, 234, -0.3, 22, 10], [60, 200, -0.8, 18, 8]].map(([x, y, a, len, wid]) => shard([x, y], Math.PI * a, len, wid, tone(ML, 0.1), lc)));
    else legs.push(...[[48, 230, 6], [60, 224, 7], [74, 220, 6], [128, 219, 6], [142, 222, 7], [156, 228, 6], [52, 194, 6], [42, 204, 5]].map(([x, y, rr]) => foam(x, y, rr)));
    const crest = ice
      ? [[100, 42, -0.62, 40, 13], [86, 46, -0.78, 44, 14], [114, 40, -0.48, 30, 11], [74, 56, -0.9, 34, 12]].map(([x, y, a, len, wid]) => shard([x, y], Math.PI * a, len, wid, tone(ML, 0.12), lc))
      : [{ p: tube([[122, 40, 12], [102, 32, 18], [80, 34, 18], [64, 46, 14], [60, 62, 8], [68, 68, 3]]), c: F, m: 'cloth', line: 0.6, lc: tone(F, -0.45), rim: 0.6,
        lines: [{ p: [[110, 30], [84, 30], [66, 42]], w: 1.2, a: 0.35 }] },
        ...[[122, 36, 7], [110, 28, 8], [94, 26, 8], [78, 30, 7], [66, 40, 6], [58, 54, 5]].map(([x, y, rr]) => foam(x, y, rr))];
    const fist = ice
      ? [shard([164, 100], -Math.PI * 0.1, 58, 18, tone(ML, 0.15), lc), shard([166, 104], Math.PI * 0.12, 30, 12, tone(ML, 0.05), lc), { p: ell(170, 100, 16, 15, 10), c: M, m: 'gem', gloss: 1.2, line: 0.6, lc }]
      : [{ p: ell(174, 100, 17, 16, 12), c: ML, m: 'gem', gloss: 0.9, line: 0.6, lc, lines: [{ p: [[164, 94], [172, 90], [182, 94]], w: 1.6, light: true, a: 0.8 }] },
        foam(160, 96, 6), foam(168, 88, 5), drop(180, 128, 3.6, ML, { lc }), drop(170, 142, 2.8, ML, { lc })];
    const parts = [
      { kind: 'legs', pivot: [100, 214], shapes: legs },
      { kind: 'torso', pivot: [102, 150], shapes: [
        haze(grow(body, 104, 150, 1.12, 1.05), R, 0.28),
        { p: tube([[80, 102, 30], [58, 122, 24], [50, 146, 20]]), c: MD, m: 'gem', gloss: 0.8, line: 0.6, lc, lines: [{ p: [[70, 104], [56, 126]], w: 1.6, light: true, a: 0.6 }] },
        { p: ell(48, 154, 14, 13, 10), c: MD, m: 'gem', gloss: 0.9, line: 0.6, lc },
        ...(ice ? [shard([42, 160], Math.PI * 0.62, 26, 10, tone(ML, 0.05), lc)] : [drop(44, 178, 3, MD, { lc })]),
        { p: body, c: M, m: 'gem', gloss: 0.9, line: 0.7, lc, belly: 0.3, lines: ripple,
          sub: [{ p: tube([[96, 96, 14], [106, 130, 18], [100, 170, 12], [108, 206, 8]]), c: ML, m: ice ? 'flat' : 'gem', line: 0, gloss: 0.5 }] },
        ...(ice ? [[70, 96, -0.85, 30, 12], [80, 88, -0.7, 38, 14], [94, 84, -0.58, 26, 10]].map(([x, y, a, len, wid]) => shard([x, y], Math.PI * a, len, wid, tone(ML, 0.1), lc))
          : [bubble(92, 132, 3), bubble(112, 162, 2.4), bubble(100, 190, 3.2), bubble(122, 120, 2), bubble(88, 164, 1.8)]),
      ] },
      { kind: 'head', pivot: [108, 86], shapes: [
        ...crest,
        { p: ell(112, 62, 22, 24, 12), c: M, m: 'gem', gloss: 1, line: 0.7, lc,
          lines: ice ? [{ p: [[100, 48], [112, 62], [104, 78]], w: 1.2, light: true, a: 0.8 }] : [{ p: [[96, 58], [104, 46], [118, 42]], w: 1.8, light: true, a: 0.8 }],
          sub: [{ p: ell(120, 66, 12, 14, 10), c: ML, m: 'flat', line: 0 }] },
        { e: [121, 60, 4.2, 3.4], c: o.eye, m: 'gem', line: 0.5, lc: tone(o.eye, -0.5), glint: [[120, 59, 1.8]] },
        { e: [132, 59, 3.2, 2.8], c: o.eye, m: 'gem', line: 0.5, lc: tone(o.eye, -0.5), glint: [[131.4, 58.2, 1.3]] },
        { p: [[114, 53], [126, 52], [128, 55], [115, 56]], c: tone(M, -0.45), m: 'flat', line: 0 },
        ...(ice ? [] : [foam(126, 42, 5)]),
      ] },
      { kind: 'prop', pivot: [128, 98], shapes: [
        { p: tube([[126, 96, 32], [150, 110, 26], [166, 102, 22]]), c: M, m: 'gem', gloss: 0.9, line: 0.6, lc,
          lines: [{ p: [[132, 92], [150, 104], [164, 96]], w: 1.8, light: true, a: 0.7 }] },
        ...fist,
      ] },
    ];
    V.def(name, place(name, parts, 1, 6));
  }
  water('water_elemental', { c: '#2a86c0', light: '#72cbee', foam: '#f2faff', rgb: '110,195,240', eye: '#0e2a5a' });
  water('ice_elemental', { c: '#8ecbe8', light: '#e2f6ff', foam: '#ffffff', rgb: '190,235,255', eye: '#1a4a9a', ice: true });

  /* ================= Огненный / энергетический элементаль =================
     Фигура из пламени: языки огня текут назад, как будто он несётся вперёд; внизу — огненная лужа.
     Энергетический — голубая плазма с электрическими дугами и шарами-спутниками. */
  function fire(name, o) {
    const pal = { out: o.out, mid: o.mid, core: o.core, lc: o.lc }, R = o.rgb;
    const T = (x, y, a, len, wid, cu) => tongue([x, y], Math.PI * a, len, wid, pal, cu);
    // корпус: со спины контур сам рвётся острыми языками
    const body = [[72, 98], [88, 84], [116, 80], [138, 94], [142, 120], [132, 146], [122, 170], [124, 194], [118, 216], [114, 238], [92, 238], [88, 216], [84, 202], P(64, 192, 1), [80, 182], [78, 166], P(56, 152, 1), [72, 144], [70, 124]];
    const arcs = o.arcs ? [bolt([56, 118], [30, 146], 3.4, o.arc, o.arcLc), bolt([146, 150], [170, 182], 3.2, o.arc, o.arcLc), bolt([86, 204], [60, 228], 3, o.arc, o.arcLc)] : [];
    const orbs = o.orbs ? [[34, 88, 8], [172, 150, 6], [46, 204, 5.5]].flatMap(([x, y, rr]) => [...glow(x, y, rr * 2.8, rr * 2.8, R, 1), { e: [x, y, rr, rr], c: o.core, m: 'gem', gloss: 1.3, line: 0.5, lc: o.lc, glint: [[x - rr * 0.3, y - rr * 0.3, rr * 0.5]] }]) : [];
    const parts = [
      { kind: 'legs', pivot: [100, 226], shapes: [
        ...glow(100, 234, 70, 16, R, 1),
        ...blaze([P(50, 245, 1), [58, 236], [88, 228], [124, 228], [150, 236], P(156, 245, 1)], 102, 240, pal),
        ...T(58, 243, -0.64, 34, 20, -6), ...T(150, 243, -0.36, 32, 18, 6), ...T(78, 242, -0.58, 42, 22, -5), ...T(128, 242, -0.44, 40, 22, 5), ...T(104, 243, -0.5, 30, 18, 3),
      ] },
      { kind: 'torso', pivot: [102, 150], shapes: [
        ...glow(100, 132, 92, 118, R, 1),
        // языки пламени срываются со спины и тянутся вверх
        ...T(80, 196, -0.86, 44, 20, 9), ...T(66, 160, -0.83, 54, 24, 11), ...T(68, 128, -0.79, 62, 28, 13), ...T(78, 100, -0.73, 58, 26, 11), ...T(90, 86, -0.62, 40, 18, 7),
        // дальняя рука вскинута, в кулаке пламя
        ...blazeTube([[84, 100, 24], [70, 80, 18], [66, 58, 13]], pal),
        ...T(66, 62, -0.56, 46, 24, 8),
        ...blaze(body, 106, 150, pal, { lines: [{ p: [[96, 100], [104, 130], [98, 168]], w: 1.6, light: true, a: 0.6 }] }),
        ...arcs, ...orbs,
      ] },
      { kind: 'head', pivot: [106, 86], shapes: [
        ...T(84, 62, -0.84, 40, 18, 8), ...T(90, 50, -0.73, 56, 24, 10), ...T(102, 42, -0.62, 64, 26, 11), ...T(118, 40, -0.52, 46, 20, 7),
        ...blaze(ell(112, 60, 21, 23, 12), 114, 62, pal),
        // злые раскосые глазницы, в них — белый жар
        { p: [[113, 54], [127, 58], [126, 64], [115, 63]], c: o.socket, m: 'flat', line: 0 }, { p: [[131, 58], [139, 54], [139, 61], [132, 63]], c: o.socket, m: 'flat', line: 0 },
        ...glow(121, 60, 9, 6, o.eyeRgb, 1), { e: [121, 60.5, 3.4, 1.8], c: o.eye, m: 'gem', line: 0, glint: [[120.4, 60, 1.6]] },
        { e: [135, 59.5, 2.2, 1.5], c: o.eye, m: 'gem', line: 0, glint: [[134.6, 59, 1.2]] },
        ...(o.arcs ? [bolt([118, 36], [134, 10], 2.6, o.arc, o.arcLc)] : []),
      ] },
      { kind: 'prop', pivot: [126, 98], shapes: [
        ...blazeTube([[124, 96, 24], [146, 104, 19], [164, 94, 15]], pal),
        ...glow(172, 86, 34, 34, R, 1),
        ...T(168, 94, -0.44, 46, 28, 8), ...T(174, 96, -0.22, 32, 18, 5),
        { p: ell(170, 92, 11, 10, 10), c: o.core, m: 'gem', gloss: 1.2, line: 0.5, lc: o.lc, glint: [[166, 88, 3]] },
        ...(o.arcs ? [bolt([178, 84], [206, 66], 3, o.arc, o.arcLc)] : []),
      ] },
    ];
    V.def(name, place(name, parts, 1, 4));
  }
  fire('fire_elemental', { out: '#d8341a', mid: '#ff8c1e', core: '#ffe66a', lc: '#7a1606', rgb: '255,130,40', socket: '#6a1606', eye: '#fff8c8', eyeRgb: '255,240,180' });
  fire('energy_elemental', { out: '#2a5ce0', mid: '#5cc6ff', core: '#effcff', lc: '#0e2a78', rgb: '110,200,255', socket: '#0e2a78', eye: '#ffffff', eyeRgb: '220,250,255',
    arcs: true, arc: '#eafcff', arcLc: '#3a8ae0', orbs: true });

  /* ================= Земляной / магмовый элементаль =================
     Глыба из валунов на ногах-столбах, голова вросла в плечи, ближний кулак-валун занесён над головой.
     Магмовый — чёрный базальт с раскалёнными трещинами, лавой и огнём на плечах. */
  function earth(name, o) {
    const S = o.c, SD = tone(S, -0.22), G = o.gloss;
    const st = (p, c, extra) => Object.assign({ p, c, m: o.m, gloss: G }, extra || {});
    const cr = list => o.hot
      ? list.flatMap(p => [{ p, w: 5.5, c: rgba(o.hotRgb, 0.35) }, { p, w: 2, c: o.crack }])
      : list.map(p => ({ p, w: 1.3, c: o.crack }));
    const pal = { out: '#d83a14', mid: '#ff9020', core: '#ffe070', lc: '#6a1406' };
    const parts = [
      { kind: 'leg', side: -1, pivot: [80, 176], shapes: [
        st(slab([80, 170], [76, 210], 38, 34, 7), SD, { lines: cr([[[70, 182], [80, 192], [76, 204]]]) }),
        st(slab([76, 212], [74, 230], 34, 38, 6), SD),
        st(bevel([[52, 230], [92, 228], [102, 236], [102, 245], [50, 245]], 5), tone(SD, -0.08)),
      ] },
      { kind: 'leg', side: 1, pivot: [120, 176], shapes: [
        st(slab([120, 170], [124, 210], 40, 36, 7), S, { lines: cr([[[116, 184], [128, 196]]]) }),
        st(slab([124, 212], [126, 230], 36, 40, 6), S),
        st(bevel([[104, 230], [142, 228], [154, 236], [154, 245], [102, 245]], 5), tone(S, -0.08)),
      ] },
      { kind: 'torso', pivot: [100, 150], shapes: [
        // дальняя рука висит до колен, кулак-камень
        st(slab([58, 96], [46, 140], 32, 28, 6), SD), st(slab([46, 142], [44, 178], 30, 34, 6), SD, { lines: cr([[[40, 150], [50, 164]]]) }),
        st(bevel([[26, 176], [62, 174], [66, 206], [30, 210]], 8), tone(SD, -0.05)),
        ...(o.hot ? [drop(44, 222, 3.4, '#ff8a20', { lc: '#8a2a06', m: 'gem' })] : []),
        st(bevel([[64, 148], [136, 148], [140, 180], [62, 182]], 6), tone(S, -0.1), { lines: [{ p: [[100, 152], [100, 180]], w: 1.1, a: 0.5 }] }),
        st(bevel([[46, 90], [86, 68], [134, 68], [160, 90], [156, 132], [134, 160], [74, 164], [48, 140]], 12), S, {
          lines: cr([[[60, 104], [70, 118], [64, 134]], [[140, 124], [148, 140]], [[96, 124], [104, 140], [98, 152]]]),
          sub: [
            st(bevel([[58, 84], [100, 72], [104, 108], [64, 116]], 8), tone(S, 0.08), { line: 0.7 }),
            st(bevel([[108, 74], [150, 86], [148, 120], [110, 114]], 8), tone(S, 0.12), { line: 0.7, lines: cr([[[122, 82], [130, 100]]]) }),
            st(bevel([[68, 122], [142, 120], [132, 154], [76, 158]], 8), tone(S, 0.02), { line: 0.7 }),
          ] }),
        ...(o.moss ? [{ p: [[56, 84], [86, 68], [118, 66], [110, 76], [86, 80], [66, 94]], c: o.moss, m: 'fur', furLen: 0.45, flow: Math.PI * 0.5, line: 0.5 },
          { p: [[64, 150], [86, 146], [80, 156]], c: o.moss, m: 'fur', furLen: 0.4, line: 0.5 }] : []),
        ...(o.hot ? [...glow(104, 134, 22, 20, o.hotRgb, 1), { p: [P(96, 126, 1), P(108, 122, 1), P(114, 134, 1), P(104, 146, 1), P(94, 138, 1)], c: '#ffb030', m: 'gem', gloss: 1.2, line: 0.6, lc: '#8a2a06', glint: [[102, 130, 3]] },
          ...tongue([68, 80], -Math.PI * 0.62, 34, 18, pal, -5), ...tongue([84, 72], -Math.PI * 0.55, 30, 16, pal, -3)] : []),
      ] },
      { kind: 'head', pivot: [112, 78], shapes: [
        st(bevel([[90, 44], [126, 40], [140, 56], [138, 80], [98, 84], [88, 62]], 8), S, { lines: cr([[[98, 50], [104, 60]]]) }),
        st(bevel([[100, 52], [142, 50], [144, 60], [102, 62]], 3), SD, { line: 0.6 }),
        { p: [[110, 62], [140, 61], [139, 68], [111, 69]], c: '#1a1410', m: 'flat', line: 0 },
        ...glow(124, 65, 12, 8, o.eyeRgb, 1),
        { e: [122, 65, 5, 2.6], c: o.eye, m: 'gem', line: 0, glint: [[121, 64, 1.8]] }, { e: [135, 64.5, 3.4, 2.2], c: o.eye, m: 'gem', line: 0 },
        st(bevel([[106, 72], [138, 72], [136, 84], [108, 84]], 3), SD, { line: 0.6, lines: [{ p: [[112, 78], [132, 78]], w: 1, a: 0.6 }] }),
      ] },
      { kind: 'prop', pivot: [142, 90], shapes: [
        st(slab([146, 92], [166, 62], 36, 30, 7), S, { lines: cr([[[150, 84], [158, 72]]]) }),
        st(slab([166, 62], [172, 28], 30, 36, 7), S),
        st(bevel([[146, -2], [184, -10], [202, 10], [198, 34], [160, 40], [144, 20]], 10), tone(S, 0.05), {
          lines: cr([[[160, 4], [170, 16], [166, 30]], [[184, 2], [190, 20]]]),
          sub: [st(bevel([[150, -4], [182, -8], [178, 12], [152, 14]], 6), tone(S, 0.14), { line: 0.6 })] }),
        ...(o.hot ? [...glow(176, 16, 36, 32, o.hotRgb, 0.7), drop(196, 50, 3.4, '#ff8a20', { lc: '#8a2a06' }), drop(186, 58, 2.6, '#ffb040', { lc: '#8a2a06' })] : []),
        st(bevel([[124, 70], [160, 72], [170, 98], [150, 110], [126, 100]], 9), tone(S, 0.06), { lines: cr([[[140, 78], [148, 96]]]) }),
      ] },
    ];
    V.def(name, place(name, parts, 0.96, 2));
  }
  earth('earth_elemental', { c: '#aa9068', m: 'horn', gloss: 0.12, crack: '#4a3a26', moss: '#6a8a34', eye: '#c8ff70', eyeRgb: '170,255,90' });
  earth('magma_elemental', { c: '#433638', m: 'horn', gloss: 0.3, crack: '#ffb040', hot: true, hotRgb: '255,110,30', eye: '#ffd040', eyeRgb: '255,170,40' });

  /* ================= Псионический / магический элементаль =================
     Высокая полупрозрачная фигура на вихревом хвосте; внутри головы светится сфера разума,
     над ней — венец огоньков; в ладонях — сгустки силы.
     Магический — синий с золотом: вокруг тела кольцо-орбита с рунами, вместо сферы — звезда-призма. */
  function psychic(name, o) {
    const R = o.rgb, L = o.lite, D = o.deep;
    const edge = { line: 0.9, lc: rgba(L, 0.85) };
    const body = [[68, 98], [84, 84], [116, 80], [138, 92], [142, 118], [132, 146], [118, 168], [100, 176], [84, 166], [74, 138]];
    const orb = (x, y, rr) => [...glow(x, y, rr * 2.8, rr * 2.8, o.orbRgb, 1), { e: [x, y, rr, rr], c: o.orb, m: 'gem', gloss: 1.4, line: 0.6, lc: tone(o.orb, -0.55), glint: [[x - rr * 0.35, y - rr * 0.35, rr * 0.5]] }];
    const ring = (x, y, rx, ry, a) => ({ e: [x, y, rx, ry], c: rgba(R, 0.16 * a), m: 'flat', line: 0.8, lc: rgba(L, 0.75 * a) });
    // орбита (магический): эллипс вокруг корпуса, дальняя половина — за телом, ближняя — перед ним
    const orbit = (front) => {
      const pts = []; for (let i = 0; i <= 14; i++) { const t = (front ? 0 : Math.PI) + i / 14 * Math.PI; pts.push([104 + Math.cos(t) * 66, 128 + Math.sin(t) * 16 - Math.cos(t) * 10, 4]); }
      return { p: tube(pts), c: o.gold, m: 'gold', gloss: 1, line: 0.5 };
    };
    const runes = o.ring ? [[-0.5, 5], [0.1, 6], [0.62, 5]].map(([t, rr]) => { const a = Math.PI * 0.5 + t; return { p: star(104 + Math.cos(a) * 66, 128 + Math.sin(a) * 16 - Math.cos(a) * 10, rr, 4, 0.35), c: '#fff4c0', m: 'gem', line: 0.5, lc: '#a07010' }; }) : [];
    const crown = [];
    for (let i = 0; i < 11; i++) {
      const a = Math.PI + i / 10 * Math.PI, x = 110 + Math.cos(a) * 38, y = 30 + Math.sin(a) * 16;
      crown.push(...glow(x, y, 6, 6, o.dotRgb, 0.9), { e: [x, y, 3.2, 3.2], c: o.dot, m: 'gem', gloss: 1.2, line: 0.4, lc: tone(o.dot, -0.5) });
    }
    const mind = o.prism
      ? [...glow(110, 52, 26, 26, o.orbRgb, 1), { p: star(110, 52, 16, 6, 0.5), c: o.gold, m: 'gem', gloss: 1.4, line: 0.6, lc: '#8a5a08', glint: [[106, 48, 4]] },
        { e: [110, 52, 6, 6], c: '#ffffff', m: 'gem', line: 0, glint: [[108, 50, 3]] }]
      : [...glow(110, 50, 26, 26, L, 1), { e: [110, 50, 14, 14], c: o.brain, m: 'gem', gloss: 1.3, line: 0.6, lc: tone(o.brain, -0.55), glint: [[105, 45, 4.5]],
        lines: [{ p: [[99, 50], [104, 42], [114, 42], [120, 50], [114, 58], [106, 54], [108, 48]], w: 1.3, c: rgba('255,255,255', 0.75) }] }];
    const parts = [
      { kind: 'legs', pivot: [100, 196], shapes: [
        haze(tube([[100, 150, 68], [92, 184, 50], [100, 212, 32], [108, 232, 16], [112, 238, 7]]), R, 0.3, edge),
        haze(tube([[100, 150, 40], [94, 184, 28], [101, 212, 17], [108, 230, 7]]), D, 0.35),
        ring(98, 194, 44, 8, 1), ring(104, 216, 32, 6, 0.9), ring(110, 234, 20, 4.5, 0.8),
      ] },
      { kind: 'torso', pivot: [102, 140], shapes: [
        ...glow(104, 120, 84, 96, R, 0.8),
        ...(o.ring ? [orbit(false)] : []),
        haze(tube([[82, 98, 22], [62, 120, 17], [52, 144, 13]]), R, 0.45, edge),
        ...orb(46, 152, 8),
        haze(body, R, 0.42, Object.assign({ lines: [{ p: [[104, 90], [102, 130], [100, 170]], w: 1.6, c: rgba(L, 0.7) }, { p: [[82, 110], [102, 118], [126, 108]], w: 1.2, c: rgba(L, 0.5) }, { p: [[84, 134], [102, 140], [124, 132]], w: 1.2, c: rgba(L, 0.45) }] }, edge)),
        haze(grow(body, 104, 124, 0.62, 0.7), D, 0.4),
        ...(o.ring ? [orbit(true), ...runes] : [...glow(104, 124, 12, 12, L, 1)]),
      ] },
      { kind: 'head', pivot: [106, 86], shapes: [
        haze(tube([[106, 70, 18], [106, 90, 22]]), R, 0.4),
        haze(ell(110, 54, 25, 28, 14), R, 0.36, edge),
        ...mind,
        ...glow(124, 64, 7, 5, '255,255,255', 1), { e: [124, 64, 4.6, 1.8], c: '#ffffff', m: 'gem', line: 0 }, { e: [133, 63, 3.2, 1.5], c: '#ffffff', m: 'gem', line: 0 },
        ...crown,
      ] },
      { kind: 'prop', pivot: [126, 94], shapes: [
        haze(tube([[124, 94, 22], [148, 104, 17], [168, 96, 13]]), R, 0.45, edge),
        haze(ell(174, 94, 8, 7, 8), R, 0.5, edge),
        ...orb(186, 88, 12),
        ring(186, 88, 20, 20, 0.8),
      ] },
    ];
    V.def(name, place(name, parts, 1.04, 4));
  }
  psychic('psychic_elemental', { rgb: '190,110,235', lite: '245,215,255', deep: '120,40,170', brain: '#f0b8ff', orb: '#fbe8ff', orbRgb: '240,170,255', dot: '#e8a8ff', dotRgb: '220,140,255' });
  psychic('magic_elemental', { rgb: '90,140,255', lite: '215,235,255', deep: '40,60,190', gold: '#f0c040', orb: '#fff2b0', orbRgb: '255,220,110', dot: '#ffd850', dotRgb: '255,210,90',
    prism: true, ring: true });

  /* ================= Жар-птица / феникс =================
     Стройная птица на тонких золотых ногах, крылья вскинуты, хохолок из трёх перьев,
     длинный хвост лентами с «глазками» на концах. Рамка своя: земля y=290.
     Феникс — пылающий: жёлто-белое пламя, огонь по краям крыльев и вместо концов хвоста, ореол. */
  const BG = 290;
  /** Концы маховых и второстепенных перьев крыла wing.feather — чтобы посадить на них пламя. */
  function wingTips(O, d, L) {
    d = norm(d[0], d[1]); const n = [d[1], -d[0]];
    const T = (x, y) => [O[0] + d[0] * x + n[0] * y, O[1] + d[1] * x + n[1] * y];
    const out = [];
    const add = (B, a, len) => { const tip = [B[0] + Math.cos(a) * len, B[1] + Math.sin(a) * len]; const gd = [d[0] * Math.cos(a) + n[0] * Math.sin(a), d[1] * Math.cos(a) + n[1] * Math.sin(a)]; out.push([T(tip[0], tip[1]), Math.atan2(gd[1], gd[0])]); };
    for (let i = 0; i < 6; i++) add([L * (0.62 + i * 0.066), 3 + (5 - i) * 1.6], Math.PI * (0.25 - i * 0.047), L * (0.44 + i * 0.05));
    for (let j = 0; j < 7; j += 2) add([L * (0.06 + j * 0.086), 5], Math.PI * (0.45 - j * 0.03), L * (0.34 + j * 0.013));
    return out;
  }
  function birdLeg(X, c, feath, claw) {
    const toes = [0, 1, 2].map(i => ({ p: tube([[X + 2, BG - 9, 7], [X + 14 - i * 4, BG - 6 + i, 5.5], [X + 22 - i * 6, BG - 5 + i, 4]]), c, m: 'horn', tex: 'scale', texSize: 0.3, line: 0.6 }));
    const claws = [0, 1, 2].map(i => ({ p: [P(X + 20 - i * 6, BG - 7 + i, 1), P(X + 28 - i * 6, BG - 3 + i * 0.5, 1), P(X + 21 - i * 6, BG - 2 + i * 0.5, 1)], c: claw, m: 'horn', line: 0.5 }));
    return [
      { p: [P(X - 4, BG - 8, 1), P(X - 15, BG - 3, 1), P(X - 3, BG - 4, 1)], c: claw, m: 'horn', line: 0.5 },
      { p: tube([[X - 4, 232, 10], [X, 258, 8], [X + 2, BG - 9, 7]]), c, m: 'horn', tex: 'scale', texSize: 0.4, line: 0.7 },
      ...toes, ...claws,
      { p: [[X - 20, 198], [X + 14, 196], [X + 14, 222], [X + 6, 240, 1], [X - 2, 230], [X - 8, 242, 1], [X - 14, 228]], c: feath, m: 'feather', texSize: 0.5, belly: 0.3 },
    ];
  }
  function firebird(name, o) {
    const WN = { pri: o.pri, pri2: tone(o.pri, 0.12), sec: o.sec, sec2: tone(o.sec, -0.06), cov: o.cov, cov2: o.cov2 };
    const WF = { pri: tone(o.pri, -0.22), pri2: tone(o.pri, -0.14), sec: tone(o.sec, -0.22), sec2: tone(o.sec, -0.28), cov: tone(o.cov, -0.22), cov2: tone(o.cov2, -0.22) };
    const pal = { out: o.flameOut || '#e8401a', mid: o.flameMid || '#ffa028', core: o.flameCore || '#fff0a0', lc: o.flameLc || '#8a1a06' };
    const nearO = [194, 158], nearD = [-0.64, -0.77], nearL = 152, farO = [206, 150], farD = [-0.12, -1], farL = 132;
    const nearWing = wing.feather(nearO, nearD, nearL, WN), farWing = wing.feather(farO, farD, farL, WF);
    if (o.flames) {
      for (const [p, a] of wingTips(nearO, nearD, nearL)) nearWing.push(...tongue([p[0] - Math.cos(a) * 10, p[1] - Math.sin(a) * 10], a, 34, 17, pal, 4));
      for (const [p, a] of wingTips(farO, farD, farL)) farWing.unshift(...tongue([p[0] - Math.cos(a) * 10, p[1] - Math.sin(a) * 10], a, 28, 14, pal, 4));
    }
    // хвост: длинные ленты с «глазком» (жар-птица) или языком пламени (феникс) на конце
    const tail = [];
    for (let i = 4; i >= 0; i--) { const lf = leaf([150, 212], Math.PI * (0.78 + i * 0.055), 70 - i * 4, 20); tail.push({ p: lf.body, c: i % 2 ? o.pri : o.sec, m: 'leather', gloss: 0.5, line: 0.6, lines: [{ p: lf.shaft, w: 0.9, light: true, a: 0.45 }] }); }
    const ribbons = [
      [[150, 208, 12], [120, 204, 9], [94, 190, 7], [76, 170, 6], [70, 150, 5]],
      [[150, 214, 13], [118, 226, 10], [86, 226, 8], [58, 214, 7], [42, 196, 6]],
      [[152, 220, 12], [122, 242, 9], [92, 254, 7], [62, 258, 6], [40, 252, 5]],
    ];
    ribbons.forEach((c, i) => {
      const a = c[c.length - 2], b = c[c.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      tail.push({ p: tube(c), c: i === 1 ? o.ribbon : tone(o.ribbon, -0.12), m: 'leather', gloss: 0.7, line: 0.6, lines: [{ p: c.map(q => [q[0], q[1]]), w: 1, light: true, a: 0.55 }] });
      if (o.flames) tail.push(...glow(b[0], b[1], 22, 22, o.glowRgb, 0.9), ...tongue([b[0] - Math.cos(ang) * 4, b[1] - Math.sin(ang) * 4], ang, 44, 24, pal, i === 2 ? 6 : -6));
      else {
        const lf = leaf([b[0] - Math.cos(ang) * 4, b[1] - Math.sin(ang) * 4], ang, 34, 22), cx = b[0] + Math.cos(ang) * 14, cy = b[1] + Math.sin(ang) * 14;
        tail.push({ p: lf.body, c: o.eyeFeather, m: 'leather', gloss: 0.8, line: 0.6, lc: tone(o.eyeFeather, -0.6),
          sub: [{ e: [cx, cy, 7, 6], c: o.ocellus, m: 'gem', line: 0.5 }, { e: [cx + 1, cy, 3.4, 3], c: '#2a1030', m: 'gem', line: 0, glint: [[cx, cy - 1, 1.4]] }] });
      }
    });
    const crest = [];
    for (let i = 0; i < 3; i++) {
      const c = [[270 - i * 6, 74, 4], [262 - i * 11, 54 - i * 2, 3], [254 - i * 16, 40 - i * 3, 2.2]], e = c[2], ang = Math.atan2(e[1] - c[1][1], e[0] - c[1][0]);
      crest.push({ p: tube(c), c: o.crestStem, m: 'leather', line: 0.5 });
      if (o.flames) crest.push(...tongue([e[0], e[1]], ang, 26, 14, pal, -3));
      else { const lf = leaf([e[0], e[1]], ang, 16, 12); crest.push({ p: lf.body, c: o.crest, m: 'gem', gloss: 1, line: 0.5, lc: tone(o.crest, -0.6), sub: [{ e: [e[0] + Math.cos(ang) * 8, e[1] + Math.sin(ang) * 8, 3, 3], c: o.ocellus, m: 'gem', line: 0 }] }); }
    }
    const headS = [
      ...crest,
      { p: [[214, 172], [220, 140], [232, 114], [250, 98], [272, 98], [276, 118], [262, 140], [254, 176]], c: o.neck, m: 'feather', texSize: 0.5, flow: Math.PI * 0.6 },
      // перья на затылке торчат назад
      { p: [[254, 98], [236, 92, 1], [250, 106], [232, 112, 1], [252, 116]], c: tone(o.head, -0.12), m: 'feather', texSize: 0.4, line: 0.6 },
      { p: [[248, 98], [254, 80], [272, 70], [292, 74], [302, 88], [296, 102], [278, 108], [258, 108]], c: o.head, m: 'feather', texSize: 0.4, flow: Math.PI * 0.8 },
      { p: [[296, 96], [312, 98], [306, 104], [296, 103]], c: tone(o.beak, -0.22), m: 'horn' },
      { p: [[294, 82], [308, 84], [318, 92], [320, 104, 1], [312, 96], [296, 96]], c: o.beak, m: 'horn', gloss: 1.1, lines: [{ p: [[298, 86], [312, 90]], w: 1, light: true, a: 0.7 }] },
      { p: [[278, 82], [296, 80], [300, 88], [282, 90]], c: o.mask, m: 'feather', texSize: 0.3, line: 0.5 },
      { e: [286, 86, 4.4, 3.8], c: o.eye, m: 'gem', line: 0.6, sub: [{ e: [287, 86, 2, 2.8], c: '#1a0806', m: 'flat', line: 0 }], glint: [[285, 84.6, 1.6]] },
    ];
    const torso = [
      ...(o.flames ? glow(200, 180, 150, 130, o.glowRgb, 0.9) : glow(200, 186, 90, 70, o.glowRgb, 0.6)),
      ...tail,
      { p: [[132, 216], [146, 190], [178, 166], [212, 154], [240, 160], [254, 184], [246, 212], [220, 232], [184, 240], [152, 234]], c: o.body, m: 'feather', texSize: 0.65, flow: Math.PI * 0.8, belly: 0.35,
        lines: [{ p: [[150, 204], [180, 182], [214, 170]], w: 1.4, light: true, a: 0.45 }],
        sub: [{ p: [[206, 150], [262, 160], [262, 244], [200, 244], [208, 228, 1], [198, 214], [212, 202, 1], [204, 188], [218, 176, 1], [210, 162]], c: o.breast, m: 'feather', texSize: 0.5, flow: Math.PI * 0.5, line: 0, belly: 0.3 }] },
    ];
    const parts = [
      { kind: 'prop', pivot: farO, shapes: farWing },
      { kind: 'leg', side: 1, pivot: [192, 206], shapes: birdLeg(190, tone(o.leg, -0.22), tone(o.breast, -0.22), '#3a2010') },
      { kind: 'leg', side: -1, pivot: [212, 206], shapes: birdLeg(210, o.leg, o.breast, '#2a1608') },
      { kind: 'torso', pivot: [196, 196], shapes: torso },
      { kind: 'head', pivot: [236, 166], shapes: headS },
      { kind: 'prop', pivot: nearO, shapes: nearWing },
    ];
    const to = frameOf(name) || { w: 360, h: 333, anchor: [183, 310] };
    V.def(name, fit(parts, { ground: [196, BG] }, to, to.anchor[1] / BG * (o.size || 0.96)));
  }
  firebird('firebird', { pri: '#b01e18', sec: '#d8401a', cov: '#ec7a22', cov2: '#f6b43a', body: '#dc3a18', breast: '#f6a82a', neck: '#e8561c', head: '#f07a24', mask: '#b82a14',
    beak: '#f0d060', leg: '#e0a830', eye: '#ffe060', ribbon: '#e8481a', eyeFeather: '#f0b030', ocellus: '#2a8ad0', crest: '#f8c840', crestStem: '#d8401a', glowRgb: '255,150,60' });
  firebird('phoenix', { pri: '#f07010', sec: '#f8a020', cov: '#ffc838', cov2: '#fff0a0', body: '#ffb028', breast: '#fff0b0', neck: '#ffc440', head: '#ffd860', mask: '#f08018',
    beak: '#fff0b0', leg: '#f0c040', eye: '#ffffff', ribbon: '#ff9a20', crestStem: '#ffb028', glowRgb: '255,190,70', flames: true,
    flameOut: '#f04a10', flameMid: '#ffb030', flameCore: '#fff6c0', flameLc: '#9a2a06' });
})(typeof window !== 'undefined' ? window : globalThis);
