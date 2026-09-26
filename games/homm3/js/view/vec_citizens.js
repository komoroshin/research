/* ============================================================================
   view/vec_citizens.js — жители и мелкая жизнь экрана города.

   1) Рисунки: свои жители (крестьянин, горожанка, ученик мага) и подвижные
      детали сцены (мельница с крыльями). Остальных жителей берём из готовых
      рисунков существ фракции в маленьком масштабе.
   2) H3.TownLife.create(env) — «жизнь» сцены города: жители ходят по улицам между
      дверями построек (двери = низ-центр слота LAYOUT), заходят внутрь, болтают;
      птицы, летучие мыши, бабочки, светлячки по фракции; мельница, фонтан.
      Всё только рисуется: в hit() сцены не участвует — тапам по постройкам не мешает.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const Sp = H3.Sprites;
  const { tube, P, ell, arm, head, helm, torso, robe, humanoid, tone, H } = K;
  const SKIN = '#e8b890', WOOD = '#7a5230';

  /* =========================================================== рисунки жителей
     Рамка — маленький пиксельный силуэт 20×25 (он же запасной спрайт при выключенном
     рисованном конвейере): рисунок встаёт ногами в его якорь, как любое существо. */
  function frameSprite(name, body, legs, hat) {
    const rows = [];
    for (let y = 0; y < 25; y++) {
      let r = '';
      for (let x = 0; x < 20; x++) {
        let ch = '.';
        if ((x - 10) * (x - 10) + (y - 4) * (y - 4) <= 9) ch = 's';
        else if (y >= 8 && y <= 17 && x >= 7 && x <= 13) ch = 'b';
        else if (y >= 18 && y <= 24 && ((x >= 7 && x <= 9) || (x >= 11 && x <= 13))) ch = 'l';
        if (y <= 2 && x >= 6 && x <= 14) ch = 'h';
        r += ch;
      }
      rows.push(r);
    }
    Sp.define(name, { rows, pal: { s: SKIN, b: body, l: legs, h: hat } });
  }

  /** Крестьянин: соломенная шляпа, рубаха, вилы на плече. */
  function peasant(name, o) {
    frameSprite(name, o.shirt, o.hose, '#e0c060');
    const hx = H.headX, hy = H.headY, r = H.headR, hand = [140, 120];
    V.def(name, humanoid({
      name,
      legs: { style: 'hose', c: o.hose, boot: '#4a3020' },
      back: arm([80, 90], [74, 120], [82, 146], { c: o.shirt, hand: SKIN, w: 15 }),
      body: torso({ c: o.shirt, skirt: o.shirt, skirtLen: 180, belt: '#5a3a22', buckle: '#8a7a5a', chestLines: [{ p: [[104, 84], [104, 118]], w: 1.4, a: 0.5 }] }),
      head: [...head(hx, hy, r, { skin: SKIN, hair: o.hair, beard: o.beard, beardLen: 1.2 }),
        { p: ell(hx, hy - r * 0.55, r * 1.75, r * 0.36, 14), c: '#e0c060', m: 'leather', gloss: 0.2, line: 0.9, lc: '#6a5020' },
        { p: [[hx - r * 0.85, hy - r * 0.6], [hx - r * 0.7, hy - r * 1.25], [hx, hy - r * 1.45], [hx + r * 0.7, hy - r * 1.25], [hx + r * 0.85, hy - r * 0.6]], c: '#e8cc6a', m: 'leather', line: 0.9, lc: '#6a5020',
          lines: [{ p: [[hx - r * 0.82, hy - r * 0.78], [hx + r * 0.82, hy - r * 0.78]], w: 3, c: o.band, a: 0.95 }] }],
      arm: [
        { p: tube([[hand[0] + 8, hand[1] + 70, 5], [hand[0], hand[1], 5], [hand[0] - 14, hand[1] - 80, 5]]), c: WOOD, m: 'wood', line: 0.7 },
        ...[-12, 0, 12].map(dx => ({ p: tube([[hand[0] - 14 + dx * 0.4, hand[1] - 80, 3], [hand[0] - 16 + dx, hand[1] - 104, 2.6], [hand[0] - 15 + dx * 1.1, hand[1] - 118, 1.8]]), c: '#9aa0a8', m: 'steel', line: 0.5 })),
        { p: tube([[hand[0] - 26, hand[1] - 80, 3], [hand[0] - 2, hand[1] - 80, 3]]), c: '#9aa0a8', m: 'steel', line: 0.5 },
        ...arm([126, 90], [140, 112], hand, { c: o.shirt, hand: SKIN, w: 15 }),
      ],
    }));
  }
  peasant('cit_peasant', { shirt: '#b89a62', hose: '#6a5a3a', hair: '#7a5030', beard: '#7a5030', band: '#8a2a24' });

  /** Горожанка: платье до пят, передник, косынка, корзинка с хлебом и яблоками. */
  function townswoman(name, o) {
    frameSprite(name, o.dress, o.dress, o.scarf);
    const hx = H.headX, hy = H.headY, r = H.headR, bx = 146, by = 160;
    V.def(name, humanoid({
      name, robe: true, feetC: '#4a3020',
      back: arm([80, 90], [72, 120], [80, 146], { c: o.dress, hand: SKIN, w: 14 }),
      body: [...robe({ c: o.dress, belt: o.apronBelt || '#e8e0d0' }),
        { p: [[84, 146], [124, 146], [132, 232], [102, 238], [78, 232]], c: '#ece6d6', m: 'cloth', line: 0.8, lines: [{ p: [[104, 150], [104, 234]], w: 1, a: 0.3 }] },
        { p: [[74, 84], [128, 82], [120, 100], [84, 102]], c: o.scarf, m: 'cloth', line: 0.8 }],
      head: [...head(hx, hy, r, { skin: SKIN, hair: o.hair, hairStyle: 'long', brow: true }),
        { p: [[hx - r * 1.1, hy + r * 0.5], [hx - r * 1.15, hy - r * 0.35], [hx - r * 0.55, hy - r * 1.1], [hx + r * 0.3, hy - r * 1.15], [hx + r * 0.95, hy - r * 0.65], [hx + r * 0.7, hy - r * 0.42], [hx - r * 0.1, hy - r * 0.5], [hx - r * 0.5, hy + r * 0.1], [hx - r * 0.55, hy + r * 0.7]], c: o.scarf, m: 'cloth', line: 0.9,
          lines: [{ p: [[hx - r * 0.8, hy - r * 0.6], [hx + r * 0.5, hy - r * 0.9]], w: 1, a: 0.35 }] }],
      arm: [
        ...arm([126, 90], [136, 124], [bx - 4, by - 14], { c: o.dress, hand: SKIN, w: 14 }),
        { p: tube([[bx - 22, by - 4, 3], [bx - 16, by - 30, 3], [bx, by - 36, 3], [bx + 16, by - 30, 3], [bx + 22, by - 4, 3]]), c: '#9a6a36', m: 'wood', line: 0.6 },
        { e: [bx - 8, by - 4, 9, 8], c: '#c83a2a', m: 'skin', line: 0.6, glint: [[bx - 11, by - 7, 2]] },
        { e: [bx + 7, by - 6, 12, 7], c: '#d8a860', m: 'leather', line: 0.6 },
        { p: [[bx - 26, by - 6], [bx + 26, by - 6], [bx + 20, by + 16], [bx - 20, by + 16]], c: '#b8864a', m: 'wood', flow: 0, line: 0.8,
          lines: [{ p: [[bx - 23, by + 2], [bx + 23, by + 2]], w: 1.4, a: 0.5 }, { p: [[bx - 21, by + 10], [bx + 21, by + 10]], w: 1.4, a: 0.5 }] },
      ],
    }));
  }
  townswoman('cit_woman', { dress: '#3a62a8', scarf: '#e8dcc0', hair: '#8a5a2a' });
  V.def('cit_woman#2', { base: 'cit_woman', recolor: { '#3a62a8': '#a8382c', '#e8dcc0': '#f0d890', '#8a5a2a': '#4a2e18' } });
  V.def('cit_peasant#2', { base: 'cit_peasant', recolor: { '#b89a62': '#7a8a4a', '#6a5a3a': '#5a4a3a', '#7a5030': '#c8a060', '#8a2a24': '#2a4a8a' } });

  /** Ученик мага: мантия, капюшон на плечах, книга в руках. */
  function apprentice(name, o) {
    frameSprite(name, o.robe, o.robe, o.hair);
    const hx = H.headX, hy = H.headY, r = H.headR;
    V.def(name, humanoid({
      name, robe: true, feetC: '#3a2a20', size: 0.92,
      back: arm([80, 90], [76, 118], [120, 128], { c: o.robe, hand: SKIN, w: 14 }),
      body: [...robe({ c: o.robe, belt: o.trim }),
        { p: [[72, 78], [132, 78], [128, 100], [104, 108], [78, 100]], c: tone(o.robe, -0.12), m: 'cloth', line: 0.8 },
        { p: [[102, 100], [108, 100], [112, 244], [100, 244]], c: o.trim, m: 'cloth', line: 0.6 }],
      head: head(hx, hy, r, { skin: SKIN, hair: o.hair }),
      arm: [
        ...arm([126, 90], [134, 118], [138, 126], { c: o.robe, hand: SKIN, w: 14 }),
        { p: [P(114, 112, 1), P(150, 106, 1), P(154, 138, 1), P(118, 144, 1)], c: o.book, m: 'leather', line: 0.9,
          sub: [{ p: [P(120, 114, 1), P(148, 109, 1), P(148, 112, 1), P(120, 117, 1)], c: '#f0e6c8', m: 'flat', line: 0 }],
          lines: [{ p: [[134, 110], [136, 140]], w: 1.6, c: '#e8c050', a: 0.9 }] },
      ],
    }));
  }
  apprentice('cit_apprentice', { robe: '#3a5aa8', trim: '#e8c050', hair: '#6a4424', book: '#7a2a2a' });
  V.def('cit_apprentice#2', { base: 'cit_apprentice', recolor: { '#3a5aa8': '#6a3a98', '#6a4424': '#d8b070', '#7a2a2a': '#2a5a3a' } });

  /* =========================================================== мельница
     Башня без крыльев и крылья отдельно — крылья крутятся на сцене. */
  const ln = (p, w, a, o) => Object.assign({ p, w, a }, o || {});
  V.def('windmill.tower', { w: 260, h: 340, anchor: [130, 337], parts: [{ kind: 'torso', pivot: [130, 337], shapes: (() => {
    const out = [{ e: [130, 332, 60, 7], c: '#3a3a36', m: 'flat', line: 0 }];
    const courses = []; for (let y = 150; y < 330; y += 18) courses.push(ln([[98 + (332 - y) * 0.05, y], [162 - (332 - y) * 0.05, y]], 1.2, 0.4));
    out.push({ p: [P(96, 332, 1), P(164, 332, 1), P(154, 132, 1), P(106, 132, 1)], c: '#c8c0ae', m: 'horn', gloss: 0.15, lines: courses,
      sub: [{ p: [P(140, 130, 1), P(170, 130, 1), P(170, 334, 1), P(150, 334, 1)], c: '#8e887c', m: 'flat', line: 0 }] });
    out.push({ p: [P(116, 332, 1), [116, 300], [130, 288], [144, 300], P(144, 332, 1)], c: '#6a4428', m: 'wood', flow: -Math.PI / 2, line: 1 });
    out.push({ p: [P(122, 222, 1), P(138, 222, 1), P(138, 244, 1), P(122, 244, 1)], c: '#f2d34c', m: 'gem', gloss: 0.5, line: 1, lc: '#4a3010' });
    out.push({ p: [P(98, 136, 1), [104, 112], P(130, 84, 1), [156, 112], P(162, 136, 1)], c: '#8a5530', m: 'wood', flow: -0.6, gloss: 0.2, lines: [ln([[106, 122], [154, 122]], 1.4, 0.5)] });
    return out;
  })() }], meta: { lights: [[130, 233]] } });
  V.def('windmill.sails', { w: 260, h: 260, anchor: [130, 130], parts: [{ kind: 'torso', pivot: [130, 130], shapes: (() => {
    const hub = [130, 130], out = [];
    for (let i = 0; i < 4; i++) {
      const a = -0.62 + i * Math.PI / 2, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]], at = (r, o) => [hub[0] + u[0] * r + v[0] * o, hub[1] + u[1] * r + v[1] * o];
      const lat = []; for (let r = 34; r < 112; r += 13) lat.push(ln([at(r, 3), at(r, 25)], 1.4, 0.8, { c: '#6a4a2a' }));
      lat.push(ln([at(20, 14), at(112, 14)], 1.2, 0.6, { c: '#6a4a2a' }));
      out.push({ p: [P(...at(20, 3), 1), P(...at(114, 3), 1), P(...at(114, 25), 1), P(...at(20, 25), 1)], c: '#ece2c8', m: 'cloth', line: 0.8, lines: lat });
      out.push({ p: tube([[...at(0, 0), 6], [...at(120, 0), 4]]), c: '#6a4424', m: 'wood', line: 0.7 });
    }
    out.push({ e: [hub[0], hub[1], 9, 9], c: '#4a4a52', m: 'steel', line: 0.7 });
    return out;
  })() }] });

  /* =========================================================== жизнь сцены */
  /** Готовое пятно света цвета rgb: рисуется одним drawImage с прозрачностью (градиент на кадр не создаём). */
  const GLOW = {};
  function glowSprite(rgb) {
    let cv = GLOW[rgb]; if (cv) return cv;
    cv = GLOW[rgb] = document.createElement('canvas'); cv.width = cv.height = 32;
    const c = cv.getContext('2d'), g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(' + rgb + ',1)'); g.addColorStop(0.35, 'rgba(' + rgb + ',0.45)'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
    c.fillStyle = g; c.fillRect(0, 0, 32, 32);
    return cv;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const TAU = Math.PI * 2;

  /* Жители по фракции: n — рисунок, s — масштаб (1 = рост существа у жилища), v — скорость (точек сцены в секунду),
     guard — стражник (ходит по улицам и стоит подолгу), glow — светится сам (фонарь не нужен).
     Порядок = приоритет: ночью выходят первые (стража и фонарщики). */
  const G = { guard: true };
  const SIZE = 1.18;   // общий множитель роста жителей: ~16 точек сцены у человека (существо у жилища — 24)
  const POOL = {
    castle: [['pikeman', G], ['cit_peasant'], ['cit_woman'], ['cit_peasant#2'], ['cit_woman#2'], ['archer'], ['monk', { v: 12 }], ['halberdier', G]],
    rampart: [['wood_elf', G], ['dwarf', { s: 0.52 }], ['grand_elf'], ['battle_dwarf', { s: 0.52 }], ['wood_elf'], ['dwarf', { s: 0.52 }], ['grand_elf']],
    tower: [['gremlin', G], ['cit_apprentice'], ['master_gremlin'], ['cit_apprentice#2'], ['mage', { s: 0.5 }], ['gremlin'], ['cit_apprentice']],
    inferno: [['familiar', G], ['imp', { v: 26 }], ['imp', { v: 26 }], ['gog', { s: 0.5 }], ['familiar', { v: 24 }], ['imp', { v: 26 }], ['imp', { v: 26 }]],
    necropolis: [['skeleton_warrior', G], ['skeleton', { v: 14 }], ['walking_dead', { v: 8 }], ['skeleton', { v: 14 }], ['wight', { s: 0.5, v: 16, glow: '170,255,200' }], ['walking_dead', { v: 8 }], ['skeleton', { v: 14 }]],
    dungeon: [['infernal_troglodyte', G], ['troglodyte'], ['troglodyte'], ['beholder', { s: 0.42, v: 12 }], ['troglodyte'], ['infernal_troglodyte']],
    stronghold: [['hobgoblin', G], ['goblin', { v: 24 }], ['goblin', { v: 24 }], ['orc', { s: 0.52 }], ['goblin', { v: 24 }], ['hobgoblin']],
    fortress: [['gnoll_marauder', G], ['gnoll'], ['lizardman', { s: 0.52 }], ['gnoll'], ['lizard_warrior', { s: 0.52 }], ['gnoll']],
    conflux: [['water_elemental', { s: 0.44, v: 14 }], ['pixie', { v: 22 }], ['fire_elemental', { s: 0.4, v: 14, glow: '255,150,60' }], ['sprite', { v: 22 }], ['air_elemental', { s: 0.42, v: 20 }], ['earth_elemental', { s: 0.38, v: 10 }], ['pixie', { v: 22 }]],
    cove: [['seaman', G], ['crew_mate'], ['pirate', { s: 0.5 }], ['nymph'], ['crew_mate'], ['seaman'], ['nymph']],
    factory: [['halfling_grenadier', G], ['halfling', { v: 22 }], ['mechanic'], ['halfling', { v: 22 }], ['engineer', { s: 0.52 }], ['halfling', { v: 22 }]],
    hive: [['builder', G], ['worker', { v: 24 }], ['worker', { v: 24 }], ['larva', { s: 0.5, v: 8 }], ['worker', { v: 24 }], ['builder']],
    bastion: [['tracker', G], ['forester'], ['forest_cat', { s: 0.46, v: 30 }], ['ranger', { s: 0.52 }], ['forester'], ['tracker']],
  };
  /* Цвет фонаря: у каждой фракции свой огонь. */
  const LAMP = { inferno: '255,120,40', necropolis: '140,255,170', dungeon: '210,150,255', conflux: '150,230,255', tower: '200,225,255' };
  /* Мелкая живность: днём и ночью. */
  const CRIT = {
    castle: [['birds', 'butterflies'], ['bats', 'fireflies']],
    rampart: [['birds', 'butterflies'], ['fireflies', 'bats']],
    tower: [['ravens'], ['bats']],
    inferno: [['bats'], ['bats']],
    necropolis: [['crows', 'wisps'], ['bats', 'wisps']],
    dungeon: [['bats', 'motes'], ['bats', 'motes']],
    stronghold: [['vultures', 'birds'], ['bats']],
    fortress: [['dragonflies', 'birds'], ['fireflies']],
    conflux: [['butterflies', 'wisps', 'birds'], ['wisps', 'fireflies']],
    cove: [['gulls'], ['bats']],
    factory: [['vultures'], ['bats']],
    hive: [['bees', 'birds'], ['fireflies']],
    bastion: [['birds', 'butterflies'], ['fireflies', 'bats']],
  };
  /* Детали у воды и на площади. x, y — земля (низ рисунка), s — масштаб. */
  const DECOR = {
    castle: [{ kind: 'windmill', x: 34, y: 262, s: 1.4 }, { kind: 'mill', x: 152, y: 352, s: 1.15 }],
    rampart: [{ kind: 'fountain', x: 404, y: 300, s: 1.35 }],
    conflux: [{ kind: 'fountain', x: 404, y: 300, s: 1.35 }],
    cove: [{ kind: 'fountain', x: 404, y: 300, s: 1.35 }],
    bastion: [{ kind: 'mill', x: 152, y: 352, s: 1.15 }],
    stronghold: [{ kind: 'windmill', x: 34, y: 262, s: 1.4 }],
  };

  /**
   * env: { W, H, L (LAYOUT), faction, water (вид воды), RS, An (H3.Anim) }
   * → { setDoors(items), update(dt, ts, night), depth() — жители и детали для сортировки по глубине,
   *     drawSky(ctx, ts, night), drawLights(ctx, ts, night), count }
   */
  function create(env) {
    const L = env.L, An = H3.Anim, Cr = H3.Creatures, fid = env.faction;
    const life = { actors: [], sky: [], motes: [], decor: [], warm: [], ready: false, night: -1 };
    /* ---------- улицы: перекрёстки от слотов LAYOUT ---------- */
    const J = [
      { id: 'jw', x: L.dwell_1[0] + 42, y: 318 }, { id: 'jg', x: L.guild[0] + 22, y: 298 }, { id: 'jc', x: L.hall[0], y: 290 },
      { id: 'je', x: L.special[0] - 40, y: 320 }, { id: 'jf', x: L.dwell_4[0] - 52, y: 324 },
      { id: 'gate', x: L.hall[0] - 8, y: 354, door: true, w: 2 },
    ];
    const JE = [['jw', 'jg'], ['jg', 'jc'], ['jc', 'je'], ['je', 'jf'], ['jc', 'gate'], ['jg', 'gate'], ['je', 'gate']];
    let nodes = {}, adj = {};
    const WEIGHT = { tavern: 4, market: 4, hall: 3, blacksmith: 2, guild: 2, special: 2 };
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    function link(a, b) { (adj[a] || (adj[a] = [])).push(b); (adj[b] || (adj[b] = [])).push(a); }
    life.setDoors = function (items) {
      nodes = {}; adj = {};
      for (const j of J) nodes[j.id] = Object.assign({}, j);
      for (const [a, b] of JE) link(a, b);
      for (const it of items || []) {
        if (it.ghost || it.wide || !it.pos || it.pos[1] < 250 || it.pos[1] > 357) continue;
        const M = V.meta && V.meta(it.sprite), dd = M && M.m.door;   // своя дверь рисунка (meta.door), иначе низ-центр слота
        const n = { id: it.key, x: dd ? it.pos[0] + (dd[0] - M.ax) / M.U * 2 : it.pos[0], y: it.pos[1] + 2, door: true, w: WEIGHT[it.key] || 1 };
        nodes[n.id] = n;
        const js = J.filter(j => !j.door).map(j => [j, dist(j, n)]).sort((a, b) => a[1] - b[1]);
        link(n.id, js[0][0].id); if (js[1][1] < js[0][1] * 1.4) link(n.id, js[1][0].id);
      }
      for (const a of life.actors) { if (!nodes[a.at]) a.at = nearest(a.x, a.y).id; if (a.path.some(id => !nodes[id])) a.path = []; }
    };
    function nearest(x, y) { let best = null, bd = 1e9; for (const id in nodes) { const d = Math.hypot(nodes[id].x - x, nodes[id].y - y); if (d < bd) { bd = d; best = nodes[id]; } } return best; }
    function route(from, to) {   // Дейкстра на десятке узлов
      const D = { [from]: 0 }, prev = {}, open = new Set([from]);
      while (open.size) {
        let u = null; for (const k of open) if (u === null || D[k] < D[u]) u = k;
        open.delete(u); if (u === to) break;
        for (const v of adj[u] || []) { const d = D[u] + dist(nodes[u], nodes[v]); if (D[v] === undefined || d < D[v]) { D[v] = d; prev[v] = u; open.add(v); } }
      }
      if (D[to] === undefined) return [];
      const out = []; for (let k = to; k !== from; k = prev[k]) out.unshift(k);
      return out;
    }
    function chooseTarget(a) {
      const ids = Object.keys(nodes).filter(id => id !== a.at);
      if (!ids.length) return null;
      if (a.guard) return pick(ids.filter(id => !nodes[id].door || id === 'gate')) || pick(ids);
      if (Math.random() < 0.2) return pick(ids.filter(id => !nodes[id].door)) || pick(ids);
      let sum = 0; for (const id of ids) sum += nodes[id].door ? nodes[id].w : 0.6;
      let r = Math.random() * sum; for (const id of ids) { r -= nodes[id].door ? nodes[id].w : 0.6; if (r <= 0) return id; }
      return ids[0];
    }

    /* ---------- жители ---------- */
    const pool = (POOL[fid] || POOL.castle).filter(p => V.has(p[0]) || (Sp.has(p[0]) && !/^cit_/.test(p[0])));   // без рисованного конвейера — старые спрайты существ
    function makeActor(p, i) {
      const o = p[1] || {}, s = +((o.s || 0.56) * SIZE).toFixed(3), d = V._defs[p[0]];
      const hgt = (d ? d.anchor[1] / 10 : 24) * s;
      const flying = !!(Cr && Cr.get(p[0]) && Cr.isFlyer(Cr.get(p[0])));
      return { n: p[0], s, h: hgt, v: (o.v || 18) * rnd(0.85, 1.15), guard: !!o.guard, glow: o.glow || null, flying,
        key: 'cit' + i + p[0], ph: rnd(0, TAU), x: 0, y: 0, at: null, path: [], st: 'idle', t: rnd(0.3, 3), face: Math.random() < 0.5 ? -1 : 1, alpha: 1, lamp: false, out: false };
    }
    life.populate = function (night) {
      life.night = night;
      // днём 5–7 жителей (по числу построек у улиц), ночью 2–3 с фонарями
      const doors = Object.keys(nodes).filter(id => nodes[id].door).length;
      const nDay = Math.min(pool.length, 4 + Math.min(3, Math.floor(doors / 2)));
      const n = night >= 0.5 ? Math.min(nDay, night > 0.8 ? 2 : 3) : nDay;
      life.actors = [];
      const starts = Object.keys(nodes).sort(() => Math.random() - 0.5);
      for (let i = 0; i < n; i++) {
        const a = makeActor(pool[i], i), st = nodes[starts[i % starts.length]];
        a.at = st.id; a.x = st.x + rnd(-6, 6); a.y = st.y + rnd(-2, 2);
        a.lamp = night >= 0.4 && !a.glow;
        // кто-то уже внутри, кто-то в пути — чтобы не стартовали хором
        if (st.door && i % 3 === 2) { a.st = 'inside'; a.t = rnd(0.5, 4); a.alpha = 0; }
        life.actors.push(a);
      }
      // прогрев рисунков: по одному за кадр, чтобы открытие города не подвисало
      life.warm = []; life.ready = false;
      const seen = new Set();
      for (const a of life.actors) for (const f of [false, true]) { const k = a.n + '|' + a.s + '|' + f; if (!seen.has(k)) { seen.add(k); life.warm.push([a.n, a.s, f]); } }
      for (const dc of life.decor) for (const nm of dc.names) life.warm.push([nm, dc.s, null]);
    };
    function startWalk(a) {
      const to = chooseTarget(a); if (!to) { a.st = 'idle'; a.t = rnd(2, 4); return; }
      a.path = route(a.at, to); a.st = a.path.length ? 'walk' : 'idle'; a.t = rnd(1, 3);
    }
    function arrive(a) {
      const n = nodes[a.at];
      // у ратуши не стоим: перед её дверью встают башни ворот, и фигурка казалась бы на шпиле
      if (n && n.door && !a.guard && (a.at === 'hall' || Math.random() < 0.6)) { a.st = 'enter'; a.t = 0.45; return; }
      a.st = 'idle'; a.t = a.guard ? rnd(3, 7) : rnd(1.2, 4);
      // встретил знакомого — повернулись друг к другу и болтают
      for (const b of life.actors) if (b !== a && b.st === 'idle' && b.alpha > 0.5 && Math.abs(b.x - a.x) < 30 && Math.abs(b.y - a.y) < 12) {
        a.face = b.x >= a.x ? 1 : -1; b.face = -a.face; a.t += 2.5; b.t = Math.max(b.t, a.t); break;
      }
    }
    function stepActor(a, dt) {
      const k = dt / 1000; a.t -= k;
      if (a.st === 'walk') {
        const n = nodes[a.path[0]]; if (!n) { a.path = []; a.st = 'idle'; a.t = 1; return; }
        const dx = n.x - a.x, dy = n.y - a.y, d = Math.hypot(dx, dy), step = a.v * k;
        if (Math.abs(dx) > 0.5) a.face = dx > 0 ? 1 : -1;
        if (d <= step) { a.x = n.x; a.y = n.y; a.at = a.path.shift(); if (!a.path.length) arrive(a); }
        else { a.x += dx / d * step; a.y += dy / d * step; }
      } else if (a.st === 'idle') {
        if (a.t <= 0) startWalk(a);
        else if (a.guard && Math.random() < 0.15 * k) a.face = -a.face;   // стражник оглядывается
      } else if (a.st === 'enter') {
        a.alpha = Math.max(0, a.t / 0.45);
        if (a.t <= 0) { a.st = 'inside'; a.t = rnd(2.5, 8); a.alpha = 0; }
      } else if (a.st === 'inside') {
        if (a.t <= 0) { a.st = 'exit'; a.t = 0.45; const n = nodes[a.at]; if (n) { a.x = n.x; a.y = n.y; } a.face = Math.random() < 0.5 ? -1 : 1; }
      } else if (a.st === 'exit') {
        a.alpha = Math.min(1, 1 - a.t / 0.45);
        if (a.t <= 0) { a.alpha = 1; startWalk(a); }
      }
    }
    function drawActor(c, a, ts) {
      if (a.alpha <= 0.01) return;
      const RS = env.RS, moving = a.st === 'walk';
      const walk = moving ? Math.sin(ts / 105 + a.ph) : 0;
      const bob = a.flying ? -2.2 - Math.sin(ts / 260 + a.ph) * 0.8 : moving ? -Math.abs(walk) * 0.7 : 0;
      c.save();
      c.globalAlpha = a.alpha;
      // тень у ног (у летунов — бледнее и уже)
      c.fillStyle = a.flying ? 'rgba(0,0,0,0.13)' : 'rgba(0,0,0,0.24)';
      c.beginPath(); c.ellipse(a.x, a.y, a.h * 0.26, a.h * 0.075 + 0.5, 0, 0, TAU); c.fill();
      // дробное положение — в перенос холста, иначе фигурка ползёт рывками по целым точкам сцены
      const xi = Math.round(a.x), yi = Math.round(a.y + bob);
      c.setTransform(RS, 0, 0, RS, (a.x - xi) * RS, (a.y + bob - yi) * RS);
      An.draw(c, a.n, xi, yi, a.s, a.face < 0, { t: ts, phase: a.ph, moving, flying: a.flying, dir: a.face, st: { dx: 0, dy: 0, alpha: 1 } });
      c.setTransform(RS, 0, 0, RS, 0, 0);
      if (a.lamp) {   // фонарь в руке: качается на ходу
        const hx = a.x + a.face * a.h * 0.26, hy = a.y + bob - a.h * 0.42, sw = moving ? Math.sin(ts / 210 + a.ph) * 0.35 : Math.sin(ts / 900 + a.ph) * 0.08;
        const lx = hx + Math.sin(sw) * 3, ly = hy + Math.cos(sw) * 3;
        c.strokeStyle = '#2a1e14'; c.lineWidth = 0.35; c.beginPath(); c.moveTo(hx, hy); c.lineTo(lx, ly - 1); c.stroke();
        c.fillStyle = '#3a2a1a'; c.fillRect(lx - 0.9, ly - 1.2, 1.8, 0.45); c.fillRect(lx - 0.9, ly + 1.1, 1.8, 0.45);
        c.fillStyle = 'rgb(' + (LAMP[fid] || '255,200,110') + ')'; c.fillRect(lx - 0.7, ly - 0.8, 1.4, 1.9);
        a.lx = lx; a.ly = ly;
      }
      c.restore();
    }

    /* ---------- детали: мельница, водяное колесо, фонтан ---------- */
    for (const d of DECOR[fid] || []) {
      if (d.kind === 'windmill' && V.has('windmill.tower')) life.decor.push(Object.assign({ names: ['windmill.tower', 'windmill.sails'], ph: rnd(0, TAU) }, d));
      if (d.kind === 'mill' && V.has('mine_wood#g') && env.water === 'river') life.decor.push(Object.assign({ names: ['mine_wood#g', 'mine_wood.wheel'] }, d));
      if (d.kind === 'fountain' && V.has('fountain_fortune')) life.decor.push(Object.assign({ names: ['fountain_fortune'] }, d));
    }
    /** Подвижная деталь: картинка с якорем в оси вращения, повёрнутая на угол a. */
    function spin(c, name, x, y, s, a) {
      const im = Sp.image(name, s); if (!im) return;
      const cv = im.cv, ax = cv._anchor[0] * s, ay = cv._anchor[1] * s;
      c.save(); c.translate(x, y); c.rotate(a); c.imageSmoothingEnabled = true; c.drawImage(cv, -ax, -ay, cv.width * im.k, cv.height * im.k); c.restore();
    }
    function drawDecor(c, d, ts) {
      c.imageSmoothingEnabled = true;
      if (d.kind === 'windmill') {
        Sp.draw(c, 'windmill.tower', d.x, d.y, d.s);
        // ось крыльев: точка 130,118 рисунка башни (якорь 130,337), в точках сцены
        spin(c, 'windmill.sails', d.x, d.y - (337 - 118) / 10 * d.s, d.s, ts / 1000 * 0.7 + d.ph);
      } else if (d.kind === 'mill') {
        const M = V.meta('mine_wood#g');
        Sp.draw(c, 'mine_wood#g', d.x, d.y, d.s);
        if (M && M.m.anim) for (const an of M.m.anim) spin(c, an.name, d.x + (an.at[0] - M.ax) / M.U * d.s, d.y + (an.at[1] - M.ay) / M.U * d.s, d.s, ts / 1000 * an.spin);
        // брызги от колеса
        c.fillStyle = 'rgba(235,248,255,0.8)';
        for (let i = 0; i < 5; i++) { const f = (ts / 700 + i / 5) % 1, wx = d.x + (50 - 163) / 10 * d.s - 4 + i * 1.6; c.globalAlpha = 0.7 * (1 - f); c.beginPath(); c.arc(wx - f * 3, d.y + (212 - 283) / 10 * d.s + 5 + f * 5 - Math.sin(f * Math.PI) * 3, 0.6, 0, TAU); c.fill(); }
        c.globalAlpha = 1;
      } else if (d.kind === 'fountain') {
        Sp.draw(c, 'fountain_fortune', d.x, d.y, d.s);
        // струи: капли по дугам от чаши вниз, в бассейн
        const topY = d.y - (257 - 108) / 10 * d.s, cx = d.x;
        for (let i = 0; i < 12; i++) {
          const f = (ts / 1100 + i / 12) % 1, side = i % 2 ? 1 : -1, w = (4.2 + (i % 3) * 0.6) * d.s;
          const x = cx + side * f * w, y = topY + (-2 + f * f * 11 - f * 3) * d.s;
          c.fillStyle = 'rgba(225,245,255,' + (0.85 * (1 - f * 0.6)).toFixed(2) + ')';
          c.beginPath(); c.arc(x, y, 0.45 + 0.2 * (1 - f), 0, TAU); c.fill();
        }
      }
    }

    /* ---------- живность ---------- */
    let spawnT = 0;
    function critterSet(night) { const c = CRIT[fid] || CRIT.castle; return night >= 0.5 ? c[1] : c[0]; }
    function spawnFlock(kind) {
      const fromL = Math.random() < 0.5, n = kind === 'vultures' ? 2 : kind === 'bats' ? Math.floor(rnd(2, 5)) : Math.floor(rnd(3, 6));
      const cave = env.water === 'cave' || fid === 'dungeon';
      const y0 = cave ? rnd(80, 150) : rnd(30, 110), v = (kind === 'bats' ? rnd(38, 55) : kind === 'gulls' ? rnd(26, 36) : rnd(32, 48)) * (fromL ? 1 : -1);
      for (let i = 0; i < n; i++) {
        const b = { kind, x: (fromL ? -20 : env.W + 20) - (fromL ? 1 : -1) * (i * rnd(9, 16)), y: y0 + (i % 2 ? 1 : -1) * i * rnd(2, 5), vx: v * rnd(0.94, 1.06), ph: rnd(0, TAU),
          span: kind === 'vultures' ? 8 : kind === 'bats' ? 3.2 : kind === 'crows' || kind === 'ravens' ? 4.4 : kind === 'gulls' ? 5 : 3.6 };
        if (kind === 'vultures') { b.cx = rnd(200, env.W - 200); b.cy = rnd(40, 80); b.r = rnd(40, 70); b.a = rnd(0, TAU) + i * Math.PI; b.x = b.cx; b.y = b.cy; b.life = rnd(25, 40); }
        life.sky.push(b);
      }
    }
    function spawnGround(kind, night) {
      life.motes = [];
      const N = { butterflies: 4, fireflies: 14, wisps: 5, motes: 10, dragonflies: 3, bees: 5 }[kind] || 0;
      for (let i = 0; i < N; i++) life.motes.push({ kind, x: rnd(30, env.W - 30), y: rnd(kind === 'motes' ? 100 : 230, 350), vx: 0, vy: 0, ph: rnd(0, TAU), hue: pick(['#f2c84a', '#ff8ac0', '#ffffff', '#8ac8ff', '#ffa040']), tx: 0, ty: 0, t: 0 });
    }
    function stepCritters(dt, ts, night) {
      const k = dt / 1000, set = critterSet(night);
      const flyers = set.filter(s => ['birds', 'bats', 'crows', 'ravens', 'gulls', 'vultures'].includes(s));
      spawnT -= k;
      if (flyers.length && spawnT <= 0 && life.sky.length < 12) { spawnFlock(pick(flyers)); spawnT = rnd(7, 15); }
      for (const b of life.sky) {
        if (b.kind === 'vultures') { b.a += k * 0.32; b.x = b.cx + Math.cos(b.a) * b.r; b.y = b.cy + Math.sin(b.a) * b.r * 0.35; b.life -= k; b.vx = -Math.sin(b.a); continue; }
        b.x += b.vx * k;
        b.y += (b.kind === 'bats' ? Math.sin(ts / 190 + b.ph) * 22 : Math.sin(ts / 900 + b.ph) * 3) * k;
      }
      life.sky = life.sky.filter(b => b.kind === 'vultures' ? b.life > 0 : b.x > -60 && b.x < env.W + 60);
      const gk = set.find(s => ['butterflies', 'fireflies', 'wisps', 'motes', 'dragonflies', 'bees'].includes(s));
      if (!gk) life.motes = []; else if (!life.motes.length || life.motes[0].kind !== gk) spawnGround(gk, night);
      for (const m of life.motes) {
        m.t -= k;
        if (m.t <= 0) {   // новая цель рядом: бабочка перепархивает, стрекоза дёргается, светлячок плывёт
          const r = m.kind === 'dragonflies' ? 60 : m.kind === 'bees' ? 40 : m.kind === 'butterflies' ? 30 : 18;
          m.tx = Math.max(20, Math.min(env.W - 20, m.x + rnd(-r, r))); m.ty = Math.max(m.kind === 'motes' ? 80 : 220, Math.min(356, m.y + rnd(-r, r) * 0.5));
          m.t = m.kind === 'dragonflies' ? rnd(0.4, 1.6) : m.kind === 'bees' ? rnd(0.2, 0.6) : rnd(1, 3);
        }
        const sp = m.kind === 'dragonflies' ? 5 : m.kind === 'bees' ? 6 : 1.2;
        m.x += (m.tx - m.x) * Math.min(1, sp * k); m.y += (m.ty - m.y) * Math.min(1, sp * k);
        if (m.kind === 'butterflies') m.y += Math.sin(ts / 160 + m.ph) * 6 * k;
      }
    }
    function bird(c, b, ts) {
      const s = b.span, dir = b.vx >= 0 ? 1 : -1;
      const flapRate = b.kind === 'gulls' ? 190 : b.kind === 'crows' || b.kind === 'ravens' ? 120 : 95;
      // парят: крылья замирают на несколько секунд, потом снова машут
      const glide = b.kind === 'vultures' || (b.kind === 'gulls' ? Math.sin(ts / 1300 + b.ph) > -0.2 : Math.sin(ts / 2100 + b.ph) > 0.55);
      const f = glide ? 0.25 + Math.sin(ts / 700 + b.ph) * 0.08 : Math.sin(ts / flapRate + b.ph);
      const col = b.kind === 'gulls' ? '#f4f4f0' : b.kind === 'crows' || b.kind === 'ravens' ? '#15131a' : b.kind === 'vultures' ? '#3a2a22' : '#2e2c34';
      const up = f * s * 0.55, mid = s * 0.22;
      c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = Math.max(0.7, s * 0.2);
      c.beginPath(); c.moveTo(b.x - s, b.y - up); c.quadraticCurveTo(b.x - s * 0.45, b.y - mid - up * 0.35, b.x, b.y); c.quadraticCurveTo(b.x + s * 0.45, b.y - mid - up * 0.35, b.x + s, b.y - up); c.stroke();
      if (b.kind === 'gulls') { c.strokeStyle = '#3a3a40'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(b.x - s, b.y - up); c.lineTo(b.x - s * 0.75, b.y - up * 0.8 - mid * 0.3); c.moveTo(b.x + s, b.y - up); c.lineTo(b.x + s * 0.75, b.y - up * 0.8 - mid * 0.3); c.stroke(); }
      c.fillStyle = col; c.beginPath(); c.ellipse(b.x + dir * s * 0.12, b.y + 0.2, s * 0.3, s * 0.13, 0, 0, TAU); c.fill();
    }
    function bat(c, b, ts) {
      const s = b.span, f = Math.sin(ts / 45 + b.ph), up = f * s * 0.6;
      c.fillStyle = fid === 'inferno' ? '#2a0e0a' : '#1a1620';
      c.beginPath(); c.moveTo(b.x, b.y - s * 0.2);
      for (const sd of [-1, 1]) {
        c.lineTo(b.x + sd * s * 0.45, b.y - s * 0.3 - up * 0.6); c.lineTo(b.x + sd * s, b.y - up);
        c.lineTo(b.x + sd * s * 0.78, b.y + s * 0.1 - up * 0.5); c.lineTo(b.x + sd * s * 0.55, b.y - up * 0.3); c.lineTo(b.x + sd * s * 0.3, b.y + s * 0.2);
        c.lineTo(b.x, b.y + s * 0.25);
      }
      c.fill();
      if (fid === 'inferno') { c.fillStyle = '#ff5a1f'; c.fillRect(b.x - 0.5, b.y - 0.1, 0.35, 0.35); c.fillRect(b.x + 0.2, b.y - 0.1, 0.35, 0.35); }
    }
    function butterfly(c, m, ts) {
      // крылья — два треугольника-лепестка; взмах сжимает их к телу (вид сбоку)
      const o = 0.25 + 0.75 * Math.abs(Math.sin(ts / 70 + m.ph)), w = 2.1;
      c.fillStyle = m.hue;
      for (const sd of [-1, 1]) {
        c.beginPath(); c.moveTo(m.x, m.y - 0.2);
        c.quadraticCurveTo(m.x + sd * w * o * 0.9, m.y - w * 1.1, m.x + sd * w * o, m.y - w * 0.35);
        c.quadraticCurveTo(m.x + sd * w * o * 0.7, m.y + w * 0.55, m.x, m.y + 0.3); c.fill();
      }
      c.fillStyle = '#2a2018'; c.fillRect(m.x - 0.2, m.y - 0.9, 0.4, 1.5);
    }
    function dragonfly(c, m, ts) {
      const dir = m.tx >= m.x ? 1 : -1, f = Math.sin(ts / 18 + m.ph) * 0.5 + 0.5;
      c.strokeStyle = '#2a8aa0'; c.lineWidth = 0.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(m.x - dir * 3, m.y + 0.3); c.lineTo(m.x + dir * 1.2, m.y); c.stroke();
      c.fillStyle = 'rgba(220,240,255,' + (0.35 + f * 0.3).toFixed(2) + ')';
      c.beginPath(); c.ellipse(m.x - dir * 0.2, m.y - 1, 1.8, 0.5, -0.3 * dir, 0, TAU); c.ellipse(m.x + dir * 0.4, m.y - 1, 1.6, 0.45, 0.3 * dir, 0, TAU); c.fill();
    }
    function bee(c, m, ts) {
      c.fillStyle = 'rgba(240,250,255,0.55)'; const f = Math.sin(ts / 15 + m.ph);
      c.beginPath(); c.ellipse(m.x - 0.3, m.y - 0.9 - f * 0.2, 0.9, 0.45, -0.4, 0, TAU); c.ellipse(m.x + 0.3, m.y - 0.9 + f * 0.2, 0.9, 0.45, 0.4, 0, TAU); c.fill();
      c.fillStyle = '#e8b020'; c.beginPath(); c.ellipse(m.x, m.y, 1.1, 0.7, 0, 0, TAU); c.fill();
      c.fillStyle = '#2a2010'; c.fillRect(m.x - 0.2, m.y - 0.7, 0.4, 1.4);
    }

    /* ---------- кадр ---------- */
    life.update = function (dt, ts, night) {
      if (night !== life.night) life.populate(night);
      if (life.warm.length) {
        // прогрев: один рисунок за кадр (у фрагмента декора — своя картинка без частей)
        const [n, s, f] = life.warm.shift();
        if (f === null) Sp.image(n, s); else if (An.parts) An.parts(n, s, f);
        if (!life.warm.length) life.ready = true;
        return;
      }
      for (const a of life.actors) stepActor(a, dt);
      stepCritters(dt, ts, night);
    };
    /** Всё, что стоит на земле, — для общей сортировки по глубине вместе с постройками. */
    life.depth = function () {
      if (!life.ready) return [];
      const out = [];
      for (const d of life.decor) out.push({ y: d.y, life: d, decor: true });
      for (const a of life.actors) if (a.alpha > 0.01) out.push({ y: a.y, life: a });
      return out;
    };
    life.drawDepth = function (c, e, ts) { if (e.decor) drawDecor(c, e.life, ts); else drawActor(c, e.life, ts); };
    /** Летуны в небе и живность у земли (до света дня: их тоже темнит ночь). */
    life.drawSky = function (c, ts) {
      if (!life.ready) return;
      c.save();
      for (const b of life.sky) (b.kind === 'bats' ? bat : bird)(c, b, ts);
      for (const m of life.motes) {
        if (m.kind === 'butterflies') butterfly(c, m, ts);
        else if (m.kind === 'dragonflies') dragonfly(c, m, ts);
        else if (m.kind === 'bees') bee(c, m, ts);
      }
      c.restore();
    };
    /** Свет поверх ночи: фонари, светлячки, огоньки. */
    life.drawLights = function (c, ts, night) {
      if (!life.ready) return;
      c.save(); c.globalCompositeOperation = 'lighter';
      const glow = (x, y, r, rgb, a) => { if (a <= 0.01) return; c.globalAlpha = Math.min(1, a); c.drawImage(glowSprite(rgb), x - r, y - r, r * 2, r * 2); };
      for (const a of life.actors) {
        if (a.alpha <= 0.01) continue;
        const fl = 0.85 + 0.15 * Math.sin(ts / 90 + a.ph * 3);
        if (a.lamp && a.lx !== undefined) { glow(a.lx, a.ly, 14, LAMP[fid] || '255,190,100', 0.5 * fl * a.alpha * Math.max(0.5, night)); glow(a.lx, a.ly, 3, '255,240,200', 0.8 * a.alpha); glow(a.x, a.y, 8, LAMP[fid] || '255,190,100', 0.18 * a.alpha); }
        if (a.glow) glow(a.x, a.y - a.h * 0.5, a.h * 0.9, a.glow, (night >= 0.4 ? 0.45 : 0.18) * fl * a.alpha);
      }
      for (const m of life.motes) {
        if (m.kind === 'fireflies') { const p = Math.max(0, Math.sin(ts / 600 + m.ph * 5)); if (p > 0.05) { glow(m.x, m.y, 5, '200,255,120', 0.55 * p); glow(m.x, m.y, 1.2, '240,255,200', 0.9 * p); } }
        else if (m.kind === 'wisps') { const p = 0.6 + 0.4 * Math.sin(ts / 400 + m.ph); const rgb = fid === 'necropolis' ? '140,255,180' : '160,230,255'; glow(m.x, m.y - 6, 9, rgb, 0.35 * p); glow(m.x, m.y - 6, 2, '240,255,255', 0.8 * p); }
        else if (m.kind === 'motes') { const p = 0.5 + 0.5 * Math.sin(ts / 700 + m.ph); glow(m.x, m.y, 3, '200,160,255', 0.35 * p); }
      }
      // окно мельницы
      if (night >= 0.3) for (const d of life.decor) if (d.kind === 'windmill' || d.kind === 'mill') {
        const M = V.meta(d.kind === 'windmill' ? 'windmill.tower' : 'mine_wood#g'); if (!M || !M.m.lights) continue;
        for (const l of M.m.lights) glow(d.x + (l[0] - M.ax) / M.U * d.s, d.y + (l[1] - M.ay) / M.U * d.s, 9, '255,190,100', 0.55 * night);
      }
      c.restore();
    };
    return life;
  }

  H3.TownLife = { create, glowSprite, POOL, CRIT, DECOR };
})(typeof window !== 'undefined' ? window : globalThis);
