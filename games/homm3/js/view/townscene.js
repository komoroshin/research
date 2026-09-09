/* ============================================================================
   view/townscene.js — город как картина: пейзаж по фракции, постройки на
   сцене (построенные — в полный цвет, доступные — призраками), наведение,
   свет дня и огни в окнах, дым, флаги, существа у жилищ, герой у ратуши.

   H3.TownScene.create(canvas, town) → { draw(ts), hit(x, y), items, destroy }
   Сцена 960×400; спрайты построек (bld_*) рисуются в масштабе 2.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, C = H3.Creatures, F = H3.Factions, B = H3.Buildings, Sp = H3.Sprites, An = H3.Anim, T = H3.Terrain, UI = H3.UI;
  const W = 960, H = 400, SC = 2;
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- фракции: цвета стен/крыш и черты пейзажа ---------- */
  const TINT = {
    castle: { n: '#d8d0c0', N: '#9a9280', r: '#3b6fd4', R: '#243f8c' }, rampart: { n: '#b8a888', N: '#7a6a50', r: '#4a9a3a', R: '#2d6b2a' },
    tower: { n: '#e8eef4', N: '#a8b8c8', r: '#5b8fd6', R: '#2f5fa0' }, inferno: { n: '#6a3a2a', N: '#3a1a10', r: '#c8332a', R: '#7a1a14' },
    necropolis: { n: '#5a5a6a', N: '#2a2a3a', r: '#4e2a72', R: '#2a1a40' }, dungeon: { n: '#6a5a6a', N: '#3a2a3a', r: '#9a58c8', R: '#4e2a72' },
    stronghold: { n: '#9a6a3c', N: '#5a3a1c', r: '#c88a2a', R: '#8a5a10' }, fortress: { n: '#7a8a5a', N: '#4a5a3a', r: '#4a8a5a', R: '#2a5a3a' },
  };
  const SCENE = {
    castle: { sky: ['#4d8fe0', '#bcdcf7'], far: ['#6f8aa0', '#8fa8b8'], terrain: 'grass', trees: ['tree_1', 'tree_2'], water: 'river', flowers: true },
    rampart: { sky: ['#5a9ad8', '#cfe6f2'], far: ['#4f7a5a', '#7a9a6a'], terrain: 'grass', trees: ['tree_2', 'tree_3', 'tree_pine'], water: 'lake', forest: true },
    tower: { sky: ['#7a9ac0', '#e8f0f8'], far: ['#b8c8d8', '#d8e4ee'], terrain: 'snow', trees: ['tree_snow'], water: 'ice', snow: true },
    inferno: { sky: ['#2a1010', '#8a3a20'], far: ['#4a1a14', '#6a2a1a'], terrain: 'lava', trees: ['tree_dead'], water: 'lava', embers: true },
    necropolis: { sky: ['#2a2a40', '#7a7a90'], far: ['#3a3a4a', '#55556a'], terrain: 'dirt', trees: ['tree_dead'], water: 'none', graves: true, fog: true },
    dungeon: { sky: ['#1a1220', '#2a2030'], far: ['#2a2230', '#3a2a40'], terrain: 'subter', trees: [], water: 'cave', cave: true },
    stronghold: { sky: ['#6a88b0', '#e0d0b0'], far: ['#8a7a5a', '#a89a78'], terrain: 'rough', trees: ['tree_3'], water: 'none', stakes: true, dust: true },
    fortress: { sky: ['#4a6a5a', '#a8c0a0'], far: ['#4a6a4a', '#6a8a6a'], terrain: 'swamp', trees: ['tree_swamp'], water: 'swamp', reeds: true, fog: true },
  };
  // слоты сцены: x — центр, y — земля (низ спрайта)
  const LAYOUT = {
    dwell_7: [480, 150], dwell_5: [120, 216], dwell_6: [845, 218], dwell_2: [250, 176], dwell_3: [715, 178],
    hall: [480, 262], guild: [318, 268], dwell_1: [160, 300], dwell_4: [810, 302],
    tavern: [280, 344], blacksmith: [690, 344], market: [500, 352], silo: [900, 372], shipyard: [70, 372], walls: [480, 398],
  };
  const NIGHT = [0.45, 0.1, 0, 0, 0, 0.55, 0.95];

  /* ---------- анализ спрайта: линия крыши и окна (считается один раз) ---------- */
  const shapeCache = new Map();
  function shapeOf(sprite, tint) {
    const key = sprite + '|' + JSON.stringify(tint || {});
    let sh = shapeCache.get(key); if (sh) return sh;
    const cv = Sp.render(sprite, SC, false, tint); if (!cv) return null;
    let data; try { data = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; } catch (e) { return null; }
    const w = cv.width, h = cv.height, top = new Int16Array(w).fill(-1), windows = [];
    for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) { if (data[(y * w + x) * 4 + 3] > 40) { top[x] = y; break; } }
    for (let y = 0; y < h; y += SC) for (let x = 0; x < w; x += SC) {
      const k = (y * w + x) * 4;
      // окна нарисованы «золотом» палитры (#f2d34c): их и зажигаем ночью
      if (data[k + 3] > 40 && data[k] > 225 && data[k + 1] > 195 && data[k + 1] < 225 && data[k + 2] < 110) windows.push([x, y]);
    }
    sh = { w, h, top, windows: windows.filter((p, i) => i % 3 === 0).slice(0, 12), ax: cv._anchor[0] * SC, ay: cv._anchor[1] * SC };
    shapeCache.set(key, sh);
    return sh;
  }

  /** opts.state — состояние вместо живой партии (сцена в главном меню), opts.static — без призраков построек и проверок canBuild. */
  function create(canvas, town, opts) {
    opts = opts || {};
    const st = opts.state || H3.Game.state, f = F.get(town.faction), sc = SCENE[town.faction] || SCENE.castle, tint = TINT[town.faction];
    const ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    const rng = new U.RNG(U.hashStr(town.name + town.faction));
    const scene = { town, items: [], hover: null, fx: H3.Fx.scene(), bg: null, clouds: [], props: [], t0: 0 };
    scene.fx.S.bounds = { w: W, h: H };
    for (let i = 0; i < 5; i++) scene.clouds.push({ x: rng.int(0, W), y: rng.int(10, 80), w: rng.int(60, 150), h: rng.int(10, 22), v: rng.int(3, 8) / 1, a: rng.int(10, 26) / 100 });
    // реквизит пейзажа: деревья, камни, могилы, колья — по фракции
    const propsN = sc.forest ? 14 : 8;
    for (let i = 0; i < propsN && sc.trees.length; i++) scene.props.push({ kind: 'tree', sprite: rng.pick(sc.trees), x: rng.int(20, W - 20), y: rng.int(170, 392), s: rng.chance(0.3) ? 2 : 1.5 });
    if (sc.graves) for (let i = 0; i < 10; i++) scene.props.push({ kind: 'grave', x: rng.int(30, W - 30), y: rng.int(200, 392) });
    if (sc.stakes) for (let i = 0; i < 12; i++) scene.props.push({ kind: 'stake', x: rng.int(20, W - 20), y: rng.int(190, 392) });
    if (sc.reeds) for (let i = 0; i < 16; i++) scene.props.push({ kind: 'reed', x: rng.int(20, W - 20), y: rng.int(200, 392) });
    if (sc.cave) for (let i = 0; i < 8; i++) scene.props.push({ kind: 'crystal', x: rng.int(20, W - 20), y: rng.int(200, 392) });
    for (let i = 0; i < 12; i++) scene.props.push({ kind: 'rock', x: rng.int(10, W - 10), y: rng.int(180, 396), s: rng.int(2, 6) });

    /* ---------- фон (один раз) ---------- */
    function paintBg(day) {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
      const night = NIGHT[(day - 1) % 7];
      // небо
      if (sc.cave) { c.fillStyle = sc.sky[0]; c.fillRect(0, 0, W, H); }
      else {
        const g = c.createLinearGradient(0, 0, 0, 170); g.addColorStop(0, sc.sky[0]); g.addColorStop(1, sc.sky[1]); c.fillStyle = g; c.fillRect(0, 0, W, 170);
        if (night) { c.fillStyle = 'rgba(10,10,40,' + (0.55 * night) + ')'; c.fillRect(0, 0, W, 170); const sr = new U.RNG(7); c.fillStyle = 'rgba(255,255,255,' + (0.8 * night) + ')'; for (let i = 0; i < 70; i++) c.fillRect(sr.int(0, W), sr.int(0, 120), 1, 1); }
        // солнце или луна
        const sunX = 120 + ((day - 1) % 7) * 110, sunY = 60 + Math.abs((day - 1) % 7 - 3) * 12;
        c.globalAlpha = 0.9; c.fillStyle = night > 0.5 ? '#eef0ff' : '#fff6d0'; c.beginPath(); c.arc(sunX, sunY, night > 0.5 ? 14 : 20, 0, Math.PI * 2); c.fill();
        c.globalAlpha = 0.25; c.beginPath(); c.arc(sunX, sunY, night > 0.5 ? 22 : 34, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
      }
      // дальний план: две гряды
      for (let layer = 0; layer < 2; layer++) {
        c.fillStyle = sc.far[layer]; c.beginPath(); c.moveTo(0, 175);
        const r2 = new U.RNG(11 + layer + U.hashStr(town.name));
        for (let x = 0; x <= W; x += 24) c.lineTo(x, 150 - layer * 12 - Math.abs(Math.sin(x / (90 + layer * 40) + layer)) * (sc.cave ? 10 : 34) - r2.int(0, 6));
        c.lineTo(W, 180); c.fill();
      }
      if (sc.cave) { // свод пещеры со сталактитами
        c.fillStyle = '#231a28'; c.fillRect(0, 0, W, 70);
        const r3 = new U.RNG(5); c.fillStyle = '#2f2436';
        for (let x = 0; x < W; x += r3.int(14, 30)) { const len = r3.int(20, 70); c.beginPath(); c.moveTo(x - 8, 70); c.lineTo(x + 8, 70); c.lineTo(x, 70 + len); c.fill(); }
      }
      // земля из тайлов карты — та же фактура, что и на карте приключений
      const horizon = 160;
      for (let y = horizon; y < H; y += 32) for (let x = 0; x < W; x += 32) c.drawImage(T.tile(sc.terrain, (x / 32 * 7 + y / 32 * 13) % 9), x, y);
      // светлая кромка горизонта
      c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(0, horizon, W, 3);
      // вода по фракции
      paintWater(c, night);
      // дорога к воротам
      c.fillStyle = 'rgba(120,100,70,0.55)'; c.beginPath(); c.moveTo(430, 270); c.lineTo(530, 270); c.lineTo(600, 400); c.lineTo(360, 400); c.fill();
      c.fillStyle = 'rgba(200,180,140,0.25)'; for (let i = 0; i < 60; i++) c.fillRect(rng.int(380, 580), rng.int(275, 396), rng.int(2, 5), 1);
      // цветы / трещины / снег
      if (sc.flowers) { const r4 = new U.RNG(3); for (let i = 0; i < 80; i++) { c.fillStyle = r4.pick(['#ffd070', '#ff8a9a', '#ffffff', '#c9a9ff']); c.fillRect(r4.int(0, W), r4.int(horizon + 10, H), 2, 2); } }
      if (sc.embers) { const r4 = new U.RNG(4); for (let i = 0; i < 40; i++) { c.fillStyle = '#ff5a1f'; c.globalAlpha = 0.5; c.fillRect(r4.int(0, W), r4.int(horizon + 10, H), r4.int(4, 14), 1); } c.globalAlpha = 1; }
      return cv;
    }
    function paintWater(c, night) {
      const kind = sc.water; if (kind === 'none') return;
      const col = kind === 'lava' ? ['#c84a1a', '#ff7a2f'] : kind === 'ice' ? ['#bcd8ee', '#e8f4ff'] : kind === 'swamp' ? ['#3e5a5a', '#5a7a7a'] : kind === 'cave' ? ['#1e3050', '#2a4a78'] : ['#2d68b8', '#4a86d4'];
      c.fillStyle = col[0];
      if (kind === 'river' || kind === 'lava') { c.beginPath(); c.moveTo(0, 300); c.bezierCurveTo(120, 280, 180, 340, 120, 400); c.lineTo(0, 400); c.fill(); c.beginPath(); c.moveTo(W, 330); c.bezierCurveTo(880, 320, 900, 380, W - 60, 400); c.lineTo(W, 400); c.fill(); }
      else { c.beginPath(); c.ellipse(W - 110, 262, 110, 26, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(90, 380, 120, 24, 0, 0, Math.PI * 2); c.fill(); }
      scene.waterColor = col[1]; scene.waterKind = kind;
      if (kind === 'lava') { c.globalAlpha = 0.35; c.fillStyle = '#ff9a3a'; c.beginPath(); c.moveTo(0, 300); c.bezierCurveTo(120, 280, 180, 340, 120, 400); c.lineTo(0, 400); c.fill(); c.globalAlpha = 1; }
    }

    /* ---------- постройки на сцене ---------- */
    function rebuild() {
      const t = town, has = id => !!t.buildings[id], items = [];
      const stt = opts.state || H3.Game.state;
      const push = (o) => { const sh = shapeOf(o.sprite, o.tint === null ? undefined : tint); if (!sh) return; o.shape = sh; o.bx = o.pos[0] - sh.ax; o.by = o.pos[1] - sh.ay; items.push(o); };
      const next = (id) => { if (opts.static) return null; const chk = R.canBuild(stt, t, id); const b = B.get(t.faction, id); return b ? { id, name: b.name, cost: b.cost, ok: chk.ok, reason: chk.reason } : null; };
      // ратуша (всегда) и её улучшение
      const hall = R.townHallLevel(t);
      push({ key: 'hall', sprite: 'bld_hall_' + hall, pos: LAYOUT.hall, name: B.BY_ID['hall_' + hall].name, tab: 'build', upgrade: hall < 4 ? next('hall_' + (hall + 1)) : null, smoke: true });
      const fl = R.fortLevel(t);
      if (fl) push({ key: 'walls', sprite: ['', 'bld_fort', 'bld_citadel', 'bld_castle'][fl], pos: LAYOUT.walls, name: B.BY_ID[['fort', 'citadel', 'castle'][fl - 1]].name, tab: 'build', wide: true, upgrade: fl < 3 ? next(['citadel', 'castle'][fl - 1]) : null });
      else push({ key: 'walls', sprite: 'bld_fort', pos: LAYOUT.walls, name: 'Форт', ghost: next('fort'), wide: true });
      const gl = R.guildLevel(t);
      if (gl) push({ key: 'guild', sprite: 'bld_guild_' + Math.min(4, gl), pos: LAYOUT.guild, name: 'Гильдия магов ' + ['', 'I', 'II', 'III', 'IV', 'V'][gl], tab: 'guild', upgrade: gl < f.guildMax ? next('guild_' + (gl + 1)) : null, magic: true });
      else push({ key: 'guild', sprite: 'bld_guild_1', pos: LAYOUT.guild, name: 'Гильдия магов', ghost: next('guild_1') });
      for (const id of ['tavern', 'market', 'blacksmith', 'silo']) {
        const tab = id === 'tavern' ? 'tavern' : id === 'market' ? 'market' : id === 'blacksmith' ? 'smith' : null;
        if (has(id)) push({ key: id, sprite: 'bld_' + id, pos: LAYOUT[id], name: B.BY_ID[id].name, tab, smoke: id === 'blacksmith' || id === 'tavern' });
        else push({ key: id, sprite: 'bld_' + id, pos: LAYOUT[id], name: B.BY_ID[id].name, ghost: next(id) });
      }
      if (has('shipyard')) push({ key: 'shipyard', sprite: 'shipyard', pos: LAYOUT.shipyard, name: 'Верфь', tab: 'smith', tint: null });
      else if (!opts.static && R.canBuild(stt, t, 'shipyard').ok) push({ key: 'shipyard', sprite: 'shipyard', pos: LAYOUT.shipyard, name: 'Верфь', ghost: next('shipyard'), tint: null });
      for (let i = 1; i <= 7; i++) {
        const b = B.get(t.faction, 'dwell_' + i);
        if (has('dwell_' + i)) {
          const up = has('dwell_up_' + i); const c = C.get(up ? F.creaturesOf(t.faction, i)[1].id : b.creature);
          push({ key: 'dwell_' + i, sprite: 'bld_dwell_' + i, pos: LAYOUT['dwell_' + i], name: b.name + (up ? ' (улучш.)' : ''), desc: c.name + ': доступно ' + t.avail[i - 1], tab: 'recruit', upg: up, creature: c.id, upgrade: up ? null : next('dwell_up_' + i) });
        } else push({ key: 'dwell_' + i, sprite: 'bld_dwell_' + i, pos: LAYOUT['dwell_' + i], name: b.name, desc: b.desc, ghost: next('dwell_' + i) });
      }
      items.sort((a, b) => a.pos[1] - b.pos[1]);
      scene.items = items;
    }

    /* ---------- рисование ---------- */
    function drawProps(c, layer) {
      for (const p of scene.props) {
        if ((p.y < 262) !== (layer === 0)) continue;   // за ратушей / перед
        if (p.kind === 'tree' && Sp.has(p.sprite)) Sp.draw(c, p.sprite, p.x, p.y, p.s);
        else if (p.kind === 'rock') { c.fillStyle = '#4b4d54'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 2, p.s, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#8b8d94'; c.fillRect(p.x - p.s, p.y - p.s, p.s, 1); }
        else if (p.kind === 'grave') { c.fillStyle = '#8b8d94'; c.fillRect(p.x - 4, p.y - 12, 8, 12); c.fillStyle = '#4b4d54'; c.fillRect(p.x - 4, p.y - 12, 2, 12); c.fillStyle = '#c9c9cc'; c.fillRect(p.x - 1, p.y - 10, 2, 6); c.fillRect(p.x - 3, p.y - 8, 6, 2); }
        else if (p.kind === 'stake') { c.fillStyle = '#5a3a1c'; c.fillRect(p.x - 2, p.y - 18, 4, 18); c.fillStyle = '#e8e8ea'; c.fillRect(p.x - 3, p.y - 22, 6, 5); c.fillStyle = '#000'; c.fillRect(p.x - 2, p.y - 20, 1, 1); c.fillRect(p.x + 1, p.y - 20, 1, 1); }
        else if (p.kind === 'reed') { c.fillStyle = '#5a8a2a'; for (let i = -3; i <= 3; i += 3) c.fillRect(p.x + i, p.y - 14 + Math.abs(i), 1, 14 - Math.abs(i)); c.fillStyle = '#5a3a1c'; c.fillRect(p.x - 1, p.y - 16, 2, 4); }
        else if (p.kind === 'crystal' && Sp.has('crystal_rock')) Sp.draw(c, 'crystal_rock', p.x, p.y, 1.5);
      }
    }
    function drawItem(c, it, ts, night) {
      const sh = it.shape, hover = scene.hover === it;
      if (it.wide) { // стена: полоса на всю ширину
        c.globalAlpha = it.ghost ? 0.22 : 1;
        c.fillStyle = tint.n; c.fillRect(0, H - 2 - 40, W, 40); c.fillStyle = tint.N; for (let x = 0; x < W; x += 16) c.fillRect(x, H - 42, 8, 8);
      }
      if (it.ghost) {
        c.globalAlpha = hover ? 0.55 : (it.ghost.ok ? 0.34 : 0.16);
        Sp.draw(c, it.sprite, it.pos[0], it.pos[1], SC, false, it.tint === null ? undefined : tint);
        c.globalAlpha = 1;
        if (hover || it.ghost.ok) { // контур и молоток
          c.strokeStyle = it.ghost.ok ? (hover ? '#f1cf74' : 'rgba(241,207,116,0.55)') : 'rgba(200,200,200,0.5)'; c.lineWidth = 1; c.setLineDash([3, 3]); c.strokeRect(it.bx + 0.5, it.by + 0.5, sh.w - 1, sh.h - 1); c.setLineDash([]);
          if (it.ghost.ok) { c.fillStyle = '#f1cf74'; c.font = 'bold 12px sans-serif'; c.textAlign = 'center'; c.fillText('⚒', it.pos[0], it.by - 4); }
        }
        return;
      }
      Sp.draw(c, it.sprite, it.pos[0], it.pos[1], SC, false, it.tint === null ? undefined : tint);
      ornaments(c, it, ts);
      if (it.upg) Sp.draw(c, 'bld_upg', it.pos[0] + sh.w / 2 - 8, it.by + 6, SC);
      if (it.upgrade && it.upgrade.ok) { c.fillStyle = '#9be07f'; c.font = 'bold 12px sans-serif'; c.textAlign = 'center'; c.fillText('▲', it.pos[0] + sh.w / 2 - 6, it.by + 12); }
      if (hover) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.25; Sp.draw(c, it.sprite, it.pos[0], it.pos[1], SC, false, it.tint === null ? undefined : tint); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
      // существо у жилища
      if (it.creature) An.draw(c, it.creature, it.pos[0] - sh.w / 2 - 8, it.pos[1] + 2, 1, false, { t: ts, phase: An.phaseOf(it.key), flying: C.isFlyer(C.get(it.creature)) });
    }
    /** Черты фракции поверх постройки: снег на крышах, шипы, черепа, плющ, кристаллы. */
    function ornaments(c, it, ts) {
      const sh = it.shape, fid = town.faction;
      const roof = (step, fn) => { for (let x = 0; x < sh.w; x += step) { const y = sh.top[x]; if (y < 0) continue; fn(it.bx + x, it.by + y, x); } };
      if (fid === 'tower') { c.fillStyle = '#ffffff'; roof(2, (x, y) => c.fillRect(x, y, 2, 2)); c.fillStyle = 'rgba(255,255,255,0.5)'; roof(2, (x, y) => c.fillRect(x, y + 2, 2, 1)); }
      else if (fid === 'inferno') { c.fillStyle = '#1a0a08'; roof(8, (x, y, i) => { if (i % 16 === 0) { c.beginPath(); c.moveTo(x - 2, y + 1); c.lineTo(x + 2, y + 1); c.lineTo(x, y - 7); c.fill(); } }); if (Math.random() < 0.15) { const x = it.bx + Math.floor(Math.random() * sh.w); const y = sh.top[x - it.bx]; if (y >= 0) scene.fx.add({ x, y: it.by + y, vx: rnd(-4, 4), vy: -rnd(10, 22), ax: 0, ay: 0, ttl: 500, life: 0, size: 1.6, color: '#ff9a3a', shape: 'dot', glow: true, shrink: true }); } }
      else if (fid === 'necropolis') { let px = -1, py = 1e9; for (let x = 0; x < sh.w; x++) if (sh.top[x] >= 0 && sh.top[x] < py) { py = sh.top[x]; px = x; } if (px >= 0) { const x = it.bx + px, y = it.by + py; c.fillStyle = '#e8e8ea'; c.fillRect(x - 2, y - 6, 5, 4); c.fillStyle = '#000'; c.fillRect(x - 1, y - 5, 1, 1); c.fillRect(x + 1, y - 5, 1, 1); } }
      else if (fid === 'rampart') { c.fillStyle = '#3f7f2f'; for (let x = 4; x < sh.w - 4; x += 6) c.fillRect(it.bx + x, it.pos[1] - 3 - (x % 3), 3, 3 + (x % 3)); c.fillStyle = '#5cb84a'; roof(6, (x, y, i) => { if (i % 12 === 0) c.fillRect(x, y + 3, 2, 4 + (i % 5)); }); }
      else if (fid === 'dungeon') { c.fillStyle = '#c04fd0'; [[-1, 0], [1, 0]].forEach(([s]) => { const x = it.pos[0] + s * (sh.w / 2 - 4); c.beginPath(); c.moveTo(x - 3, it.pos[1]); c.lineTo(x + 3, it.pos[1]); c.lineTo(x, it.pos[1] - 9); c.fill(); }); c.fillStyle = '#e6a0ff'; c.fillRect(it.pos[0] - sh.w / 2 + 3, it.pos[1] - 5, 1, 2); }
      else if (fid === 'stronghold') { c.fillStyle = '#5a3a1c'; for (let x = 2; x < sh.w; x += 7) c.fillRect(it.bx + x, it.pos[1] - 8, 2, 8); c.fillStyle = '#e8e8ea'; c.fillRect(it.bx + 2, it.pos[1] - 12, 4, 4); }
      else if (fid === 'fortress') { c.fillStyle = '#7fa838'; roof(4, (x, y, i) => { if (i % 8 === 0) c.fillRect(x, y + 1, 3, 2); }); c.fillStyle = 'rgba(60,90,90,0.5)'; c.fillRect(it.bx, it.pos[1] - 2, sh.w, 3); }
      else { // замок: вымпел цвета игрока на коньке
        const p = st.players[town.owner]; let px = -1, py = 1e9; for (let x = 0; x < sh.w; x++) if (sh.top[x] >= 0 && sh.top[x] < py) { py = sh.top[x]; px = x; }
        if (p && px >= 0 && it.key !== 'hall') { const x = it.bx + px, y = it.by + py; c.fillStyle = '#2a1a10'; c.fillRect(x, y - 8, 1, 8); c.fillStyle = p.color; const wv = Math.round(Math.sin(ts / 150 + px) * 1.5); c.fillRect(x + 1, y - 8 + wv, 5, 3); }
      }
    }
    function drawLights(c, night, ts) {
      if (!night) return;
      c.save(); c.globalCompositeOperation = 'lighter';
      const flick = 0.85 + 0.15 * Math.sin(ts / 170);
      for (const it of scene.items) {
        if (it.ghost) continue;
        for (const [wx, wy] of it.shape.windows) {
          const x = it.bx + wx + 1, y = it.by + wy + 1;
          const g = c.createRadialGradient(x, y, 0, x, y, 10); g.addColorStop(0, 'rgba(255,200,110,' + (0.7 * night * flick).toFixed(2) + ')'); g.addColorStop(1, 'rgba(255,160,60,0)');
          c.fillStyle = g; c.fillRect(x - 10, y - 10, 20, 20);
        }
      }
      c.restore();
    }
    function drawWaterGlints(c, ts) {
      if (!scene.waterKind || scene.waterKind === 'ice') return;
      c.fillStyle = scene.waterColor; const t = ts / 1200;
      const spots = scene.waterKind === 'river' || scene.waterKind === 'lava' ? [[0, 300, 140, 100], [W - 120, 330, 120, 70]] : [[W - 220, 240, 220, 44], [0, 358, 210, 44]];
      for (const [x0, y0, w, h] of spots) for (let i = 0; i < 14; i++) { const f = (t + i * 0.37) % 1; const x = x0 + ((i * 53) % w), y = y0 + ((i * 29) % h); c.globalAlpha = 0.25 + 0.25 * Math.sin(f * Math.PI); c.fillRect(x + f * 12, y, 5, 1); }
      c.globalAlpha = 1;
    }
    function ambient(dt) {
      const fx = scene.fx; if (fx.S.p.length > 200) return;
      const k = dt / 1000, chance = per => Math.random() < per * k;
      if (sc.snow && chance(25)) fx.add({ x: rnd(0, W), y: -4, vx: rnd(-8, 8), vy: rnd(18, 32), ax: 0, ay: 0, ttl: 16000, life: 0, size: rnd(1, 2), color: 'rgba(255,255,255,0.85)', shape: 'dot', shrink: false, fade: false, sway: true });
      if (sc.embers && chance(12)) fx.add({ x: rnd(0, W), y: H, vx: rnd(-6, 6), vy: -rnd(14, 30), ax: 0, ay: 0, ttl: 6000, life: 0, size: rnd(1, 2), color: ['#ff9a3a', '#ff5a1f', '#f2d34c'][Math.floor(Math.random() * 3)], shape: 'dot', glow: true, sway: true });
      if (sc.fog && chance(2)) fx.add({ x: rnd(-20, W), y: rnd(220, H), vx: rnd(4, 9), vy: 0, ax: 0, ay: 0, ttl: 7000, life: 0, size: rnd(16, 28), color: 'rgba(200,210,200,0.18)', shape: 'puff', grow: 0.5 });
      if (sc.dust && chance(4)) fx.add({ x: -6, y: rnd(200, H), vx: rnd(40, 70), vy: rnd(-2, 2), ax: 0, ay: 0, ttl: 6000, life: 0, size: 1.2, color: 'rgba(230,210,170,0.5)', shape: 'spark', shrink: false, fade: false });
      if (sc.cave && chance(6)) fx.add({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-3, 3), vy: rnd(-5, 2), ax: 0, ay: 0, ttl: 4000, life: 0, size: 1.2, color: 'rgba(210,190,230,0.5)', shape: 'dot', shrink: false });
      if (sc.forest && chance(2)) fx.add({ x: rnd(0, W), y: -4, vx: rnd(6, 14), vy: rnd(12, 22), ax: 0, ay: 0, ttl: 16000, life: 0, size: rnd(1.5, 2.5), color: ['#5cb84a', '#a67c1c', '#e8792b'][Math.floor(Math.random() * 3)], shape: 'square', shrink: false, fade: false, sway: true });
      // дым из труб: ратуша, таверна, кузница — с самой высокой точки крыши
      for (const it of scene.items) {
        if (it.ghost || !it.smoke || !chance(3)) continue;
        let px = -1, py = 1e9; for (let x = 0; x < it.shape.w; x++) if (it.shape.top[x] >= 0 && it.shape.top[x] < py) { py = it.shape.top[x]; px = x; }
        if (px < 0) continue;
        fx.add({ x: it.bx + px + rnd(-3, 3), y: it.by + py + 4, vx: rnd(3, 8), vy: -rnd(8, 14), ax: 0, ay: 0, ttl: 2800, life: 0, size: rnd(2, 3.5), color: 'rgba(200,200,210,0.35)', shape: 'puff', grow: 1.6 });
        if (it.key === 'blacksmith' && Math.random() < 0.5) fx.add({ x: it.bx + px, y: it.by + py + 4, vx: rnd(-8, 8), vy: -rnd(10, 30), ax: 0, ay: 60, ttl: 500, life: 0, size: 1.5, color: '#ff9a3a', shape: 'spark', glow: true, shrink: true });
      }
      for (const it of scene.items) if (it.magic && !it.ghost && chance(4)) fx.add({ x: it.bx + rnd(4, it.shape.w - 4), y: it.by + rnd(0, 20), vx: rnd(-6, 6), vy: -rnd(8, 20), ax: 0, ay: 0, ttl: 900, life: 0, size: 1.6, color: ['#e6a0ff', '#7fd9ea', '#ffffff'][Math.floor(Math.random() * 3)], shape: 'spark', glow: true, shrink: true });
    }

    let lastTs = 0;
    function draw(ts) {
      const day = st.day, night = NIGHT[(day - 1) % 7];
      if (!scene.bg || scene.bgDay !== day) { scene.bg = paintBg(day); scene.bgDay = day; }
      const dt = Math.min(80, ts - (lastTs || ts)); lastTs = ts;
      scene.fx.update(dt); ambient(dt);
      for (const cl of scene.clouds) { cl.x += cl.v * dt / 1000; if (cl.x - cl.w > W) cl.x = -cl.w; }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(scene.bg, 0, 0);
      if (!sc.cave) for (const cl of scene.clouds) { ctx.fillStyle = 'rgba(255,255,255,' + cl.a + ')'; ctx.beginPath(); ctx.ellipse(cl.x, cl.y, cl.w / 2, cl.h / 2, 0, 0, Math.PI * 2); ctx.ellipse(cl.x - cl.w * 0.25, cl.y + 3, cl.w / 3.2, cl.h / 2.4, 0, 0, Math.PI * 2); ctx.ellipse(cl.x + cl.w * 0.22, cl.y + 2, cl.w / 3.5, cl.h / 2.2, 0, 0, Math.PI * 2); ctx.fill(); }
      drawWaterGlints(ctx, ts);
      drawProps(ctx, 0);
      for (const it of scene.items) drawItem(ctx, it, ts, night);
      drawProps(ctx, 1);
      // герой-гость стоит у ворот
      const hero = town.visiting ? st.heroes[town.visiting] : null;
      if (hero && Sp.has('hero_' + hero.cls)) { const p = st.players[hero.owner]; An.draw(ctx, 'hero_' + hero.cls, 430, 392, SC, false, { t: ts, phase: An.phaseOf('h' + hero.id) }, { b: p ? p.color : '#999' }); }
      scene.fx.drawOver(ctx, W, H);
      T.applyDaylight(ctx, day, 0, 0, W, H);
      // в пещере неба нет — ночь там не темнее вечера
      if (night) { ctx.fillStyle = 'rgba(10,10,40,' + (0.32 * (sc.cave ? Math.min(night, 0.4) : night)) + ')'; ctx.fillRect(0, 0, W, H); }
      drawLights(ctx, night, ts);
      // флаг владельца на ратуше
      const hall = scene.items.find(i => i.key === 'hall'); const p = st.players[town.owner];
      if (hall && p) { let px = -1, py = 1e9; for (let x = 0; x < hall.shape.w; x++) if (hall.shape.top[x] >= 0 && hall.shape.top[x] < py) { py = hall.shape.top[x]; px = x; } H3.AdvView.V.ts = ts; H3.AdvView.drawFlag(ctx, hall.bx + px, hall.by + py - 12, p.color); }
    }
    function hit(x, y) {
      const list = scene.items.slice().sort((a, b) => b.pos[1] - a.pos[1]);
      for (const it of list) {
        if (it.wide) { if (y >= H - 44) return it; continue; }
        if (x >= it.bx && x <= it.bx + it.shape.w && y >= it.by && y <= it.pos[1]) { const cx = Math.floor(x - it.bx); if (it.shape.top[cx] >= 0 && y >= it.by + it.shape.top[cx] - 4) return it; }
      }
      return null;
    }
    rebuild();
    scene.draw = draw; scene.hit = hit; scene.rebuild = rebuild; scene.destroy = () => { scene.fx.clear(); };
    return scene;
  }

  H3.TownScene = { create, LAYOUT, TINT, W, H };
})(typeof window !== 'undefined' ? window : globalThis);
