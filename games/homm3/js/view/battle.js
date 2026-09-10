/* ============================================================================
   view/battle.js — экран боя: гексовое поле, ввод игрока, анимация событий,
   очередь ходов, книга заклинаний, автобой. run(b, opts) → Promise<result>.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Hex = U.Hex, C = H3.Creatures, Bt = H3.Battle, AI = H3.BattleAI, Sp = H3.Sprites, An = H3.Anim, UI = H3.UI, SP = H3.Spells, R = H3.Rules, T = H3.Terrain, Fx = H3.Fx;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const W = Bt.W, H = Bt.H;

  const V = { b: null, canvas: null, ctx: null, day: 4, size: 26, ox: 0, oy: 0, dpr: 1, hover: null, reach: null, human: [], auto: false, speed: 1, floats: [], anims: [], skip: false, spellMode: null, resolve: null, bg: null, pos: {}, done: false, tapTarget: null, tactics: null, fx: null, heroCast: [0, 0], clouds: [], margin: 24, showHeroes: false, cam: { x: 0, y: 0, z: 1 }, ptrs: new Map(), pinch: null, pan: null, pressTimer: null };

  function init() {
    V.canvas = UI.$('#battleCanvas'); V.ctx = V.canvas.getContext('2d');
    // ввод идёт через камеру: на телефоне поле приближают щипком и двигают пальцем,
    // тап срабатывает на отпускании, если палец не двигался; долгое нажатие — карточка отряда
    const c = V.canvas;
    c.addEventListener('pointerdown', e => {
      if (!V.b) return;
      V.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, ox: e.offsetX, oy: e.offsetY });
      try { c.setPointerCapture(e.pointerId); } catch (err) { /* синтетическое событие */ }
      if (V.ptrs.size === 2) { const [a, b2] = [...V.ptrs.values()]; V.pinch = { d: Math.hypot(a.x - b2.x, a.y - b2.y), z: V.cam.z, cx: (a.ox + b2.ox) / 2, cy: (a.oy + b2.oy) / 2, wx: 0, wy: 0 }; [V.pinch.wx, V.pinch.wy] = toWorld(V.pinch.cx, V.pinch.cy); clearTimeout(V.pressTimer); V.pan = null; return; }
      if (e.pointerType !== 'touch') { onDown(e); return; }
      V.pan = { x: e.clientX, y: e.clientY, cx: V.cam.x, cy: V.cam.y, moved: false, ox: e.offsetX, oy: e.offsetY };
      clearTimeout(V.pressTimer);
      V.pressTimer = setTimeout(() => { if (!V.pan || V.pan.moved) return; V.pan.long = true; const h = hexAt(V.pan.ox, V.pan.oy); const u = h && Bt.unitAt(V.b, h[0], h[1]); if (u) unitInfo(u); }, 500);
    });
    c.addEventListener('pointermove', e => {
      if (!V.b) return;
      const pt = V.ptrs.get(e.pointerId); if (pt) { pt.x = e.clientX; pt.y = e.clientY; pt.ox = e.offsetX; pt.oy = e.offsetY; }
      if (V.pinch && V.ptrs.size === 2) {
        const [a, b2] = [...V.ptrs.values()]; const d = Math.hypot(a.x - b2.x, a.y - b2.y);
        setZoom(V.pinch.z * d / Math.max(1, V.pinch.d), V.pinch.cx, V.pinch.cy, V.pinch.wx, V.pinch.wy);
        return;
      }
      if (V.pan) {
        const dx = e.clientX - V.pan.x, dy = e.clientY - V.pan.y;
        if (!V.pan.moved && Math.hypot(dx, dy) > 8) { V.pan.moved = true; clearTimeout(V.pressTimer); }
        if (V.pan.moved) { V.cam.x = V.pan.cx - dx / V.cam.z; V.cam.y = V.pan.cy - dy / V.cam.z; clampCam(); }
        return;
      }
      if (e.pointerType !== 'touch') onMove(e);
    });
    const up = e => {
      V.ptrs.delete(e.pointerId);
      if (V.pinch) { if (V.ptrs.size < 2) V.pinch = null; V.pan = null; return; }
      clearTimeout(V.pressTimer);
      const pan = V.pan; V.pan = null;
      if (pan && !pan.moved && !pan.long) onDown(e);
    };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', e => { V.ptrs.delete(e.pointerId); V.pinch = null; V.pan = null; clearTimeout(V.pressTimer); });
    c.addEventListener('wheel', e => { e.preventDefault(); const [wx, wy] = toWorld(e.offsetX, e.offsetY); setZoom(V.cam.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.offsetX, e.offsetY, wx, wy); }, { passive: false });
    V.canvas.addEventListener('pointerleave', () => { V.hover = null; UI.hideTip(); });
    V.canvas.addEventListener('contextmenu', e => { e.preventDefault(); const h = hexAt(e.offsetX, e.offsetY); const u = h && Bt.unitAt(V.b, h[0], h[1]); if (u) unitInfo(u); });
    window.addEventListener('resize', () => { if (V.b) layout(); });
    requestAnimationFrame(loop);
  }
  function layout() {
    const box = UI.$('#battleMain'); V.dpr = window.devicePixelRatio || 1;
    const bw = box.clientWidth, bh = box.clientHeight;
    // поля по краям шире одного гекса: крупные существа на крайних колоннах
    // выступают за свои гексы и иначе обрезались бы краем канвы
    // на широком экране по краям поля стоят герои — им нужны поля пошире
    // поля по краям держат фигуры героев — на телефоне тоже: поле шире экрана и двигается пальцем
    const M = bw >= 760 ? 76 : 64; V.margin = M; V.showHeroes = true;
    const narrow = bw < 600;
    // телефон в портрете: гексы считаем по высоте, поле шире экрана — его двигают пальцем
    const size = narrow ? Math.min(26, Math.floor((bh - 60) / (1.5 * H + 0.5))) : Math.floor(Math.min((bw - 2 * M) / (Math.sqrt(3) * (W + 0.5)), (bh - 80) / (1.5 * H + 0.5)));
    V.size = Math.max(14, size);
    const fw = Math.sqrt(3) * V.size * (W + 0.5), fh = V.size * (1.5 * H + 0.5);
    V.fw = fw;
    V.cw = narrow ? bw : Math.min(bw, Math.round(fw + 2 * M)); V.ch = narrow ? bh : Math.min(bh, Math.round(fh + 80));
    V.worldW = Math.max(V.cw, Math.round(fw + 2 * M));
    V.ox = Math.round((V.worldW - fw) / 2); V.oy = Math.round((V.ch - fh) / 2) + 14;   // запас сверху: высокие спрайты верхнего ряда
    V.canvas.width = V.cw * V.dpr; V.canvas.height = V.ch * V.dpr; V.canvas.style.width = V.cw + 'px'; V.canvas.style.height = V.ch + 'px';
    V.zFit = V.cw / V.worldW;
    V.cam = { x: 0, y: 0, z: 1 }; clampCam();
    V.day = H3.Game && H3.Game.state ? H3.Game.state.day : 4;
    // горизонт проходит чуть выше верхнего ряда гексов: поле стоит на земле, а не висит в небе
    const hz = U.clamp((V.oy - V.size * 0.8) / V.ch, 0.10, 0.5);
    V.bg = makeBgLayers(V.b.terrain, V.worldW, V.ch, V.day, hz);
    for (const u of V.b.units) { const [x, y] = centerOf(u); V.pos[u.id] = { x, y, phase: An.phaseOf(u.id + ':' + u.cid) }; }
    if (V.fx) V.fx.S.bounds = { w: V.worldW, h: V.ch };
    // облака над полем (под землёй неба нет)
    V.clouds = [];
    if (V.b.terrain !== 'subter') for (let i = 0; i < 4; i++) V.clouds.push({ x: rnd(0, V.worldW), y: rnd(8, V.ch * 0.22), w: rnd(50, 110), h: rnd(10, 18), v: rnd(4, 9), a: rnd(0.12, 0.26) });
  }
  /** Задник тремя слоями: небо и дальняя гряда, силуэты среднего плана, земля. Слои едут с разной скоростью. */
  function makeBgLayers(terrain, w, h, day, hz) {
    const layer = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const sky = layer(), mid = layer(), ground = layer();
    const rng = new U.RNG(U.hashStr(terrain));
    paintSky(sky.getContext('2d'), terrain, w, h, rng, day, hz);
    paintMid(mid.getContext('2d'), terrain, w, h, rng, day, hz);
    paintGround(ground.getContext('2d'), terrain, w, h, rng, day, hz);
    return { sky, mid, ground };
  }
  function paintSky(ctx, terrain, w, h, rng, day, hz) {
    const HZ = h * hz;
    const sky = { grass: ['#5f9be8', '#b9d8f5'], dirt: ['#6a7a9a', '#c9c2b0'], sand: ['#7fb6e8', '#f2e4c0'], snow: ['#8aa8c8', '#e8f0f8'], swamp: ['#5a7a6a', '#a8b898'], rough: ['#7a90b0', '#d0c8b0'], lava: ['#3a1a1a', '#8a3a20'], subter: ['#2a2230', '#5a4a58'] }[terrain] || ['#5f9be8', '#b9d8f5'];
    const g = ctx.createLinearGradient(0, 0, 0, HZ * 1.15); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, HZ + 40);
    if (terrain !== 'subter') {
      // светило и дальняя гряда — самый медленный план
      ctx.globalAlpha = 0.55; ctx.fillStyle = terrain === 'lava' ? '#ff9a4a' : '#fff6d0';
      ctx.beginPath(); ctx.arc(w * 0.8, HZ * 0.32, 16, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = terrain === 'snow' ? '#c9d5de' : terrain === 'lava' ? '#5a2a20' : terrain === 'sand' ? '#c2a866' : '#6f8a9a';
      ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.moveTo(0, HZ);
      for (let x = 0; x <= w; x += 30) ctx.lineTo(x, HZ - 34 * Math.abs(Math.sin(x / 190 + 0.4)) - rng.int(0, 8));
      ctx.lineTo(w, HZ + 12); ctx.lineTo(0, HZ + 12); ctx.fill(); ctx.globalAlpha = 1;
    }
    T.applyDaylight(ctx, day || 4, 0, 0, w, h);
  }
  function paintMid(ctx, terrain, w, h, rng, day, hz) {
    const HZ = h * hz;
    if (terrain !== 'subter') {
      ctx.fillStyle = terrain === 'snow' ? '#b6c6d2' : terrain === 'lava' ? '#4a2018' : terrain === 'sand' ? '#b09858' : '#5f7a86';
      ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(0, HZ + 6);
      for (let x = 0; x <= w; x += 26) ctx.lineTo(x, HZ + 6 - 22 * Math.abs(Math.sin(x / 120 + 1.7)) - rng.int(0, 6));
      ctx.lineTo(w, HZ + 18); ctx.lineTo(0, HZ + 18); ctx.fill(); ctx.globalAlpha = 1;
    }
    bgDetails(ctx, terrain, w, h, rng, hz);   // силуэты на горизонте
    T.applyDaylight(ctx, day || 4, 0, 0, w, h);
  }
  function paintGround(ctx, terrain, w, h, rng, day, hz) {
    const HZ = h * hz, st = T.STYLE[terrain] || T.STYLE.grass;
    ctx.fillStyle = st.base[0]; ctx.beginPath(); ctx.moveTo(0, HZ + 10);
    for (let x = 0; x <= w; x += 20) ctx.lineTo(x, HZ + 10 - 14 + Math.sin(x / 60) * 8 + rng.int(-3, 3)); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
    ctx.fillStyle = st.base[1]; ctx.beginPath(); ctx.moveTo(0, HZ + 22); for (let x = 0; x <= w; x += 25) ctx.lineTo(x, HZ + 22 + Math.cos(x / 90) * 10); ctx.lineTo(w, HZ + 40); ctx.lineTo(0, HZ + 40); ctx.fill();
    ctx.fillStyle = st.base[0]; ctx.fillRect(0, HZ + 40, w, h - HZ - 40);
    // фактура земли: тайлы карты приглушённо, поверх — крапинка и кочки
    ctx.globalAlpha = 0.30;
    for (let y = Math.round(HZ); y < h; y += 32) for (let x = 0; x < w; x += 32) ctx.drawImage(T.tile(terrain, (x / 32 * 7 + y / 32 * 13) % 9), x, y);
    ctx.globalAlpha = 1;
    for (let i = 0; i < 600; i++) { ctx.fillStyle = rng.pick(st.spec); ctx.fillRect(rng.int(0, w), rng.int(HZ, h), rng.int(1, 3), 1); }
    for (let i = 0; i < 50; i++) { ctx.fillStyle = rng.pick(st.spec); const x = rng.int(0, w), y = rng.int(HZ + 20, h); ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.ellipse(x, y, rng.int(4, 12), rng.int(1, 4), 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
    T.applyDaylight(ctx, day || 4, 0, 0, w, h);
    // виньетка поля: края уходят в тень, взгляд собирается к середине
    const g = ctx.createRadialGradient(w / 2, (HZ + h) / 2, Math.min(w, h) * 0.3, w / 2, (HZ + h) / 2, Math.max(w, h) * 0.62);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(12,10,8,0.4)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function makeBg(terrain, w, h, day) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const ctx = cv.getContext('2d');
    const sky = { grass: ['#5f9be8', '#b9d8f5'], dirt: ['#6a7a9a', '#c9c2b0'], sand: ['#7fb6e8', '#f2e4c0'], snow: ['#8aa8c8', '#e8f0f8'], swamp: ['#5a7a6a', '#a8b898'], rough: ['#7a90b0', '#d0c8b0'], lava: ['#3a1a1a', '#8a3a20'], subter: ['#2a2230', '#5a4a60'] }[terrain] || ['#5f9be8', '#b9d8f5'];
    const g = ctx.createLinearGradient(0, 0, 0, h * 0.55); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const st = T.STYLE[terrain] || T.STYLE.grass;
    const rng = new U.RNG(U.hashStr(terrain));
    ctx.fillStyle = st.base[0]; ctx.beginPath(); ctx.moveTo(0, h * 0.5);
    for (let x = 0; x <= w; x += 20) ctx.lineTo(x, h * 0.5 - 18 + Math.sin(x / 60) * 10 + rng.int(-3, 3)); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
    ctx.fillStyle = st.base[1]; ctx.beginPath(); ctx.moveTo(0, h * 0.42); for (let x = 0; x <= w; x += 25) ctx.lineTo(x, h * 0.42 + Math.cos(x / 90) * 14); ctx.lineTo(w, h * 0.5); ctx.lineTo(0, h * 0.5); ctx.fill();
    ctx.fillStyle = st.base[0]; ctx.fillRect(0, h * 0.5, w, h * 0.5);
    for (let i = 0; i < 400; i++) { ctx.fillStyle = rng.pick(st.spec); ctx.fillRect(rng.int(0, w), rng.int(h * 0.48, h), rng.int(1, 3), 1); }
    bgDetails(ctx, terrain, w, h, rng);
    T.applyDaylight(ctx, day || 4, 0, 0, w, h);   // бой идёт при свете того же дня, что и карта
    return cv;
  }
  /** Детали заднего плана по местности: дальние холмы, силуэты деревьев, солнце. */
  function bgDetails(ctx, terrain, w, h, rng, hz) {
    const HZ = h * (hz === undefined ? 0.44 : hz);
    const st = T.STYLE[terrain] || T.STYLE.grass;
    if (false) {
      // солнце или луна и дальняя гряда
      ctx.globalAlpha = 0.55; ctx.fillStyle = terrain === 'lava' ? '#ff9a4a' : '#fff6d0'; ctx.beginPath(); ctx.arc(w * 0.8, h * 0.12, 16, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = terrain === 'snow' ? '#c9d5de' : terrain === 'lava' ? '#5a2a20' : terrain === 'sand' ? '#c2a866' : '#6f8a9a';
      ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(0, h * 0.42);
      for (let x = 0; x <= w; x += 30) ctx.lineTo(x, h * 0.42 - 26 * Math.abs(Math.sin(x / 140 + 1)) - rng.int(0, 8));
      ctx.lineTo(w, h * 0.45); ctx.lineTo(0, h * 0.45); ctx.fill(); ctx.globalAlpha = 1;
    }
    // силуэты на горизонте: ёлки, пальмы, камни, сталактиты
    const dark = terrain === 'snow' ? '#7f8f9a' : terrain === 'sand' ? '#a08a50' : terrain === 'lava' ? '#2a1010' : terrain === 'subter' ? '#1a1418' : '#2f4a2a';
    ctx.fillStyle = dark; ctx.globalAlpha = 0.75;
    for (let x = rng.int(0, 30); x < w; x += rng.int(18, 40)) {
      const y = HZ + 10 + rng.int(-4, 4), s = rng.int(8, 18);
      if (terrain === 'subter') { ctx.beginPath(); ctx.moveTo(x - s * 0.3, 0); ctx.lineTo(x + s * 0.3, 0); ctx.lineTo(x, s * 2); ctx.fill(); continue; }
      if (terrain === 'sand') { ctx.fillRect(x, y - s, 2, s); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(x + 1, y - s, s * 0.6, 2, k * 0.8 - 1.2, 0, Math.PI * 2); ctx.fill(); } continue; }
      if (terrain === 'rough' || terrain === 'lava' || terrain === 'dirt') { ctx.beginPath(); ctx.moveTo(x - s * 0.6, y); ctx.lineTo(x, y - s * 0.8); ctx.lineTo(x + s * 0.7, y); ctx.fill(); continue; }
      ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x, y - s * 1.4); ctx.lineTo(x + s * 0.45, y); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - s * 0.35, y - s * 0.6); ctx.lineTo(x, y - s * 1.7); ctx.lineTo(x + s * 0.35, y - s * 0.6); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // кочки и камешки на переднем плане

  }
  /* ---------- камера ---------- */
  function toWorld(px, py) { return [px / V.cam.z + V.cam.x, py / V.cam.z + V.cam.y]; }
  function clampCam() { const z = V.cam.z; V.cam.x = U.clamp(V.cam.x, 0, Math.max(0, (V.worldW || V.cw) - V.cw / z)); V.cam.y = U.clamp(V.cam.y, 0, Math.max(0, V.ch - V.ch / z)); }
  /** Масштаб так, чтобы точка мира (wx, wy) осталась под экранной точкой (px, py). Минимум — всё поле в кадре. */
  function setZoom(z, px, py, wx, wy) { V.cam.z = U.clamp(z, Math.min(1, V.zFit || 1), 3); V.cam.x = wx - px / V.cam.z; V.cam.y = wy - py / V.cam.z; clampCam(); }
  /** Поле шире экрана или приближено — камера следует за ходящим отрядом. */
  function followUnit(u) {
    if (V.cam.z <= 1.01 && (V.worldW || V.cw) <= V.cw) return;
    const p = V.pos[u.id]; if (!p) return;
    const vw = V.cw / V.cam.z, vh = V.ch / V.cam.z;
    if (p.x > V.cam.x + vw * 0.15 && p.x < V.cam.x + vw * 0.85 && p.y > V.cam.y + vh * 0.15 && p.y < V.cam.y + vh * 0.85) return;
    V.cam.x = p.x - vw / 2; V.cam.y = p.y - vh / 2; clampCam();
  }
  function hexAt(px, py) { const [wx, wy] = toWorld(px, py); const [c, r] = Hex.fromPixel(wx, wy, V.size, V.ox, V.oy); return (c >= 0 && r >= 0 && c < W && r < H) ? [c, r] : null; }

  /** Запуск боя. opts: { human: [сторона игрока...], quick } */
  function run(b, opts) {
    return new Promise(resolve => {
      V.b = b; V.human = (opts && opts.human) || []; V.auto = false; V.done = false; V.resolve = resolve; V.floats = []; V.anims = []; V.spellMode = null; V.hover = null; V.reach = null; V.tapTarget = null;
      V.speed = H3.Game ? H3.Game.settings().animSpeed : 1; V.logLines = [];
      V.fx = Fx.scene(); V.heroCast = [0, 0];
      H3.Game.showScreen('battle');
      layout(); renderBar();
      H3.Audio.play(b.siege ? 'siege' : 'turn');
      // начальные события (башни, катапульта первого раунда)
      const ev = b.events.slice(); b.events = [];
      playEvents(ev).then(() => tacticsPhase()).then(() => step());
    });
  }
  function isHuman(side) { return V.human.includes(side) && !V.auto; }

  /* ---------- фаза тактики (навык «Тактика») ---------- */
  function tacticsPhase() {
    const b = V.b;
    if (!b || b.phase !== 'tactics') return Promise.resolve();
    const side = b.tactics.side;
    if (!isHuman(side)) {   // расставляет ИИ — молча, до конца фазы
      let guard = 0;
      while (b.phase === 'tactics' && guard++ < 80) { Bt.act(b, AI.chooseTactics(b)); syncPositions(); }
      return Promise.resolve();
    }
    V.tactics = { sel: null };
    UI.toast('Тактика: переставь отряды в подсвеченной полосе, затем «Готово»', '', 'ic_speed');
    renderBar();
    return new Promise(r => { V.tacticsResolve = r; });
  }
  function endTactics() {
    Bt.act(V.b, { type: 'tacticsDone' });
    V.tactics = null; const r = V.tacticsResolve; V.tacticsResolve = null;
    renderBar(); if (r) r();
  }
  function syncPositions() { for (const u of V.b.units) { const p = V.pos[u.id]; if (!p) continue; const [x, y] = centerOf(u); p.x = x; p.y = y; } }
  async function step() {
    const b = V.b;
    if (b.over) { await finishUp(); return; }
    const u = Bt.current(b);
    if (!u) { await finishUp(); return; }
    renderBar();
    // машиной без профильного навыка («Артиллерия» / «Первая помощь») игрок не управляет
    if (isHuman(u.side) && !Bt.autoMachine(b, u)) { V.reach = Bt.reachable(b, u); focusUnit(u); return; } // ждём ввода
    followUnit(u);
    V.reach = null;
    await wait(V.speed === 0 ? 0 : 120);
    const smart = H3.Game.settings().aiSmart !== false;
    const action = AI.choose(b, smart) || { type: 'defend' };
    await doAction(action);
  }
  async function doAction(action) {
    const b = V.b; if (b.over) return;
    const ev = Bt.act(b, action);
    if (ev.length && ev[ev.length - 1].t === 'error' && ev.length === 1) { UI.toast(ev[0].msg, 'warn'); if (isHuman(Bt.current(b).side)) { V.reach = Bt.reachable(b, Bt.current(b)); } return; }
    V.reach = null; V.spellMode = null;
    await playEvents(ev);
    await step();
  }
  async function finishUp() {
    if (V.done) return; V.done = true;
    await wait(V.speed === 0 ? 0 : 500);
    const res = V.b.result; const r = V.resolve; V.resolve = null; V.b = null;
    if (V.fx) V.fx.clear();
    r(res);
  }
  function focusUnit(u) { followUnit(u); }
  const wait = ms => new Promise(r => setTimeout(r, V.skip ? 0 : ms));
  const spd = ms => V.speed === 0 ? 0 : V.speed === 2 ? ms / 2 : ms;

  /* ---------- проигрывание событий ---------- */
  async function playEvents(events) {
    const b = V.b;
    for (const e of events) {
      if (!b) return;
      switch (e.t) {
        case 'newRound': log('Раунд ' + e.round); break;
        case 'turn': break;
        case 'move': {
          const u = b.units[e.unit]; const path = e.path;
          if (e.fly || e.back) { await tween(u, path[path.length - 1], spd(e.fly ? 260 : 200)); }
          else for (const [x, y] of path) { await tween(u, [x, y], spd(70)); if (!V.skip) H3.Audio.play('step'); stepDust(u); }
          break;
        }
        case 'hit': case 'shoot': case 'retaliate': {
          const a = b.units[e.unit], t = b.units[e.target]; if (!a || !t) break;
          if (e.t === 'shoot') { H3.Audio.play('shoot'); await shotFx(a, t); }
          else { await lunge(a, t, spd(140)); H3.Audio.play('hit'); hitFx(t, Bt.isBig(a)); if (Bt.isBig(a) && fxOn()) V.fx.shake(3, 160); }
          if (e.t === 'retaliate') log(unitName(a) + ' отвечает');
          break;
        }
        case 'damage': {
          const t = b.units[e.unit]; if (!t) break;
          float(t, '−' + e.dmg, t.side === 0 ? '#ff8a6a' : '#ffd070', true);
          if (e.killed) setTimeout(() => { if (V.b) float(t, '☠ ' + e.killed, '#ff5a4a', false, 14); }, V.speed === 0 ? 0 : 140);
          // сильный удар трясёт экран: снесло заметную часть отряда или много здоровья
          if (fxOn() && (e.killed >= 3 || e.dmg >= (t.hp + (t.count - 1) * t.maxHp) * 0.5)) V.fx.shake(Math.min(7, 2 + e.killed), 220);
          if (e.src === 'moat') { log(unitName(t) + ' застревает во рву: −' + e.dmg); if (fxOn()) { const r = unitRect(t); V.fx.burst(r.x, r.y, { n: 12, color: ['#4d7fe0', '#7fd9ea', '#fff'], speed: 70, ttl: 400, angle: -Math.PI / 2, spread: 1.6, size: 2 }); } }
          else if (e.src === 'tower') log('Башня бьёт ' + unitName(t) + ': −' + e.dmg);
          else log(unitName(t) + ': −' + e.dmg + (e.killed ? ', погибло ' + e.killed : ''));
          shake(t); await wait(spd(180)); break;
        }
        case 'manaChannel': { log('Фамильяры перехватили ' + e.mana + ' маны'); break; }
        case 'tent': { const t = b.units[e.target]; if (t) { float(t, '+' + e.amount, '#7fe08a'); healFx(t); log('Палатка лечит ' + unitName(t) + ': +' + e.amount + ' HP'); } await wait(spd(220)); break; }
        case 'death': { const u = b.units[e.unit]; H3.Audio.play('death'); log(unitName(u) + ' уничтожены'); deathFx(u); await fade(u, spd(420)); break; }
        case 'luck': { const u = b.units[e.unit]; float(u, 'Удача! ×2', '#9be07f'); H3.Audio.play('luck'); log(unitName(u) + ': удача — двойной урон'); if (fxOn()) { const r = unitRect(u); V.fx.rise(r.x, r.y, r.w, r.h, { n: 16, color: ['#f2d34c', '#fff', '#9be07f'], ttl: 600 }); } await wait(spd(250)); break; }
        case 'morale': { const u = b.units[e.unit]; float(u, e.good ? 'Мораль: доп. ход' : 'Мораль: замешательство', e.good ? '#9be07f' : '#ff8a6a'); H3.Audio.play('morale'); log(unitName(u) + (e.good ? ' воодушевлены — ещё один ход' : ' растеряны и пропускают ход')); if (fxOn()) { const r = unitRect(u); if (e.good) V.fx.rise(r.x, r.y, r.w, r.h, { n: 14, color: ['#f2d34c', '#ffe9a0'], ttl: 600 }); else V.fx.fall(r.x, r.y, r.w, r.h, { n: 10, color: ['#4b4d54', '#8b8d94'], ttl: 700 }); } await wait(spd(400)); break; }
        case 'wait': log(unitName(b.units[e.unit]) + ' ждут'); break;
        case 'defend': log(unitName(b.units[e.unit]) + ' защищаются'); break;
        case 'skip': log(unitName(b.units[e.unit]) + ' не могут действовать (' + ({ blind: 'ослеплены', petrify: 'окаменели', paralyze: 'парализованы' })[e.reason] + ')'); break;
        case 'spell': {
          const sp = SP.get(e.spell); const side = b.sides[e.side];
          H3.Audio.play('spell'); log((side.hero ? side.hero.name : 'Герой') + ' колдует «' + sp.name + '»');
          const targets = e.targets.map(x => b.units[x.unit]).filter(Boolean);
          await spellFx(sp, e, targets);
          for (const x of e.targets) { if (x.result) float(b.units[x.unit], x.result === 'immune' ? 'иммунитет' : 'сопротивление', '#c9c9cc'); else if (x.raised !== undefined) float(b.units[x.unit], '+' + x.raised, '#9be07f'); else if (x.dmg) float(b.units[x.unit], '−' + x.dmg, '#ffd070', true); }
          await wait(spd(350)); break;
        }
        case 'effect': { const u = b.units[e.unit]; const nm = EFFECT_NAMES[e.effect] || e.effect; if (u) float(u, nm, '#c9a9ff'); await wait(spd(150)); break; }
        case 'effectEnd': break;
        case 'heal': { const u = b.units[e.unit]; if (u && (e.raised || e.hp)) { float(u, e.raised ? '+' + e.raised : '+' + e.hp + ' HP', '#9be07f'); healFx(u); await wait(spd(200)); } break; }
        case 'ability': {
          const a = b.units[e.unit], t = e.target !== undefined ? b.units[e.target] : null;
          if (e.ab === 'resurrect' && t) { resurrectFx(t, '#ffe9a0'); float(t, 'воскрешение', '#ffe9a0'); log(unitName(a) + ' воскрешает ' + unitName(t)); await wait(spd(420)); break; }
          if (e.ab === 'raiseDemons' && t) { if (fxOn()) { const r = unitRect(t); V.fx.burst(r.x, r.y - 6, { n: 26, color: ['#ff5a1f', '#e8792b', '#7a1a14'], speed: 60, ttl: 700, grav: -80, shape: 'puff', size: 4 }); V.fx.ring(r.x, r.y, { r0: 4, r1: V.size * 1.4, color: '#ff5a1f', ttl: 450 }); } float(t, '+' + e.n + ' демонов', '#ffb060'); log(unitName(a) + ' поднимает демонов: ' + e.n); await wait(spd(420)); break; }
          if (e.ab === 'cast' && t) { buffFx(t, '#9ad0ff'); log(unitName(a) + ' колдует на ' + unitName(t)); await wait(spd(300)); break; }
          const nm = { deathStare: 'Взгляд смерти', fireShield: 'Огненный щит', lightning: 'Молния' }[e.ab] || e.ab;
          if (t && fxOn()) {
            const r = unitRect(t);
            if (e.ab === 'lightning') { V.fx.bolt(r.x + rnd(-30, 30), -10, r.x, r.y - r.h * 0.5, { ttl: spd(260) }); V.fx.burst(r.x, r.y - r.h * 0.5, { n: 10, color: ['#fff', '#7fd9ea'], speed: 100, ttl: 300, shape: 'spark', glow: true }); }
            else if (e.ab === 'fireShield') V.fx.burst(r.x, r.y - r.h * 0.4, { n: 18, color: ['#ff5a1f', '#f2d34c', '#e8792b'], speed: 70, ttl: 450, grav: -60, shape: 'puff', size: 3 });
            else if (e.ab === 'deathStare') { V.fx.ring(r.x, r.y - r.h * 0.5, { r0: V.size * 0.9, r1: 3, color: '#a04fd0', ttl: 380, under: false, squash: 1 }); V.fx.fall(r.x, r.y, r.w, r.h, { n: 12, color: ['#4e2a72', '#101828'] }); }
          }
          if (t) float(t, nm + (e.dmg ? ' −' + e.dmg : e.killed ? ' ' + e.killed : ''), '#ffd070');
          await wait(spd(260)); break;
        }
        case 'tower': { const t = b.units[e.target]; H3.Audio.play('shoot'); if (t) await towerFx(t); break; }
        case 'catapult': { log('Катапульта: ' + (e.result === 'destroy' ? 'участок стены разрушен!' : e.result === 'hit' ? 'стена повреждена' : 'промах')); await catapultFx(e); if (e.result !== 'miss') H3.Audio.play('siege'); await wait(spd(150)); break; }
        case 'moat': break;
        case 'manaDrain': log('Призраки вытягивают ману'); break;
        case 'end': break;
        case 'error': UI.toast(e.msg, 'warn'); break;
      }
      renderBar();
    }
  }
  const ABILITY_LABEL = { resurrect: 'Воскресить', raise: 'Поднять демонов', buff: 'Чары', bloodlust: 'Жажда крови' };
  const EFFECT_NAMES = { haste: 'Ускорение', slow: 'Замедление', bless: 'Благословение', curse: 'Проклятие', shield: 'Щит', stone_skin: 'Каменная кожа', bloodlust: 'Жажда крови', precision: 'Точность', weakness: 'Слабость', disrupting_ray: 'Разруш. луч', fortune: 'Фортуна', air_shield: 'Возд. щит', prayer: 'Молитва', blind: 'Ослепление', petrify: 'Окаменение', paralyze: 'Паралич', disease: 'Болезнь', poison: 'Яд', aging: 'Старение', bound: 'Связан' };
  function unitName(u) { return C.get(u.cid).name + (u.side === 0 ? '' : '') + ' (' + (u.side === 0 ? 'атака' : 'защита') + ')'; }
  function log(s) { V.logLines.push(s); if (V.logLines.length > 60) V.logLines.shift(); }
  /** Экранный центр стека: у крупного — середина между головой и хвостом. */
  function centerOf(u, cx, cy) {
    cx = cx === undefined ? u.x : cx; cy = cy === undefined ? u.y : cy;
    const [x, y] = Hex.center(cx, cy, V.size, V.ox, V.oy);
    if (!Bt.isBig(u)) return [x, y];
    const [tx2, ty2] = Hex.center(cx - Bt.dirOf(u), cy, V.size, V.ox, V.oy);
    return [(x + tx2) / 2, (y + ty2) / 2];
  }
  function tween(u, to, ms) {
    return new Promise(r => {
      const [tx, ty] = centerOf(u, to[0], to[1]); const p = V.pos[u.id];
      if (!ms) { p.x = tx; p.y = ty; r(); return; }
      p.moving = true;
      V.anims.push({ p, fx: p.x, fy: p.y, tx, ty, t: 0, ms, done: () => { p.moving = false; r(); } });
    });
  }
  function lunge(a, t, ms) {
    return new Promise(r => {
      const p = V.pos[a.id], q = V.pos[t.id]; const dx = (q.x - p.x) * 0.35, dy = (q.y - p.y) * 0.35;
      if (!ms) { r(); return; }
      // замах (0 → −1), затем удар с возвратом (+1 → 0) — см. Anim.state
      V.anims.push({ p, lunge: [0, -1], fx: p.x, fy: p.y, tx: p.x + dx, ty: p.y + dy, t: 0, ms: ms / 2, done: () => { V.anims.push({ p, lunge: [1, 0], fx: p.x, fy: p.y, tx: p.x - dx, ty: p.y - dy, t: 0, ms: ms / 2, done: () => { p.lunge = 0; r(); } }); } });
    });
  }
  function float(u, text, color, big, dy) { const p = V.pos[u.id]; if (!p) return; V.floats.push({ text, color, big, x: p.x + (Math.random() * 10 - 5), y: p.y - 30 + (dy || 0), t: 0, ms: V.speed === 0 ? 1 : (big ? 1100 : 900) }); }
  function shake(u) { const p = V.pos[u.id]; if (p) p.shake = V.speed === 0 ? 0 : 180; }
  function flashUnit(u, color) { const p = V.pos[u.id]; if (p) { p.flash = 350; p.flashColor = color; } }
  function flashHex(hex, color) { V.floats.push({ hexFlash: hex, color, t: 0, ms: 450 }); }
  function fade(u, ms) { return new Promise(r => { const p = V.pos[u.id]; if (!p || !ms) { r(); return; } p.fade = 1; V.anims.push({ p, fade: true, t: 0, ms, done: r }); }); }

  /* ---------- спецэффекты боя ----------
     Все эффекты — параметры для H3.Fx; ассетов нет. При скорости «мгновенно»
     не запускаются вовсе, при «быстро» длятся вдвое короче (spd). */
  const fxOn = () => !!V.fx && V.speed !== 0;
  /** Экранный прямоугольник стека: x — центр, y — земля, w/h — габарит. */
  function unitRect(u) { const p = V.pos[u.id]; const big = Bt.isBig(u); return { x: p.x, y: p.y + V.size * 0.55, w: V.size * (big ? 2.2 : 1.3), h: V.size * 1.8 }; }
  function bloodColor(u) {
    const c = C.get(u.cid);
    if (C.isUndead(c)) return ['#3a2030', '#5a3050', '#7a4a6a'];
    if (/golem|gargoyle|elemental|ballista|catapult|tent|cart|titan|giant/.test(u.cid)) return ['#8b8d94', '#c9c9cc', '#4b4d54'];
    if (/dragon|hydra|basilisk|wyvern|serpent|lizard|gorgon|troglodyte/.test(u.cid)) return ['#2d6b2a', '#5cb84a', '#1a4a1a'];
    return ['#c8332a', '#7a1a14', '#a02a20'];
  }
  function hitFx(t, heavy) {
    if (!fxOn()) return;
    const r = unitRect(t);
    V.fx.burst(r.x, r.y - r.h * 0.5, { n: 10, color: ['#fff', '#ffe9a0', '#f2d34c'], speed: 130, ttl: spd(300), size: 1.6, shape: 'spark', grav: 300, glow: true });
    V.fx.burst(r.x, r.y - r.h * 0.45, { n: heavy ? 18 : 9, color: bloodColor(t), speed: 85, ttl: spd(480), size: 2, grav: 280, angle: -Math.PI / 2, spread: Math.PI * 1.3 });
  }
  function stepDust(u) { if (!fxOn() || C.isFlyer(C.get(u.cid))) return; const p = V.pos[u.id]; const col = { snow: 'rgba(255,255,255,0.5)', sand: 'rgba(230,200,140,0.45)', lava: 'rgba(120,60,30,0.4)', swamp: 'rgba(90,120,80,0.4)' }[V.b.terrain] || 'rgba(120,100,70,0.35)'; V.fx.puff(p.x, p.y + V.size * 0.5, { n: 2, color: col, size: 3, ttl: spd(380), under: true, grow: 1.4 }); }
  function healFx(u) { if (!fxOn()) return; const r = unitRect(u); V.fx.rise(r.x, r.y, r.w, r.h, { n: 16, color: ['#7fe08a', '#bfe36b', '#ffffff'], ttl: spd(700) }); V.fx.ring(r.x, r.y, { r0: 3, r1: V.size * 1.1, color: '#7fe08a', ttl: spd(400) }); }
  function buffFx(u, color) { if (!fxOn()) return; const r = unitRect(u); V.fx.rise(r.x, r.y, r.w, r.h, { n: 14, color: [color, '#ffffff'], ttl: spd(650) }); V.fx.ring(r.x, r.y, { r0: 3, r1: V.size * 1.1, color, ttl: spd(380), width: 2 }); }
  function debuffFx(u, color) { if (!fxOn()) return; const r = unitRect(u); V.fx.fall(r.x, r.y, r.w, r.h, { n: 14, color: [color, '#101828', '#4b4d54'], ttl: spd(700) }); flashUnit(u, color); }
  function resurrectFx(u, color) { if (!fxOn()) return; const r = unitRect(u); V.fx.ring(r.x, r.y, { r0: V.size * 1.6, r1: 3, color, ttl: spd(450), width: 3, fill: color }); V.fx.rise(r.x, r.y, r.w, r.h * 1.3, { n: 26, color: [color, '#ffffff', '#f2d34c'], ttl: spd(900) }); V.fx.flash({ color, alpha: 0.12, ttl: spd(300) }); }
  /** Гибель: спрайт рассыпается на пиксели, которые уносит вверх. */
  function deathFx(u) {
    if (!fxOn()) return;
    const p = V.pos[u.id], c = C.get(u.cid);
    const sc = V.size / 14, scale = Math.max(1, Math.round(sc * (Bt.isBig(u) ? 1.65 : 1.4) * 2) / 2);
    const cv = Sp.render(u.cid, scale, u.side === 1);
    V.fx.dissolve(cv, p.x, p.y + V.size * 0.55 - 2, scale, u.side === 1, { n: 160, ttl: spd(1000), grav: C.isUndead(c) ? -60 : -20 });
    V.fx.puff(p.x, p.y + V.size * 0.2, { n: 5, color: C.isUndead(c) ? 'rgba(90,50,90,0.5)' : 'rgba(40,30,20,0.35)', size: 6, ttl: spd(700) });
  }
  /** Чем стреляет существо. */
  function shotKind(cid) {
    if (/titan|beholder|evil_eye/.test(cid)) return 'beam';
    if (/gog|magog/.test(cid)) return 'fire';
    if (/mage|monk|zealot|gremlin/.test(cid)) return 'orb';
    if (/lich/.test(cid)) return 'skull';
    if (/cyclops/.test(cid)) return 'stone';
    if (/orc/.test(cid)) return 'axe';
    if (/ballista/.test(cid)) return 'dart';
    return 'arrow';
  }
  async function shotFx(a, t) {
    const p = V.pos[a.id], q = V.pos[t.id];
    if (!fxOn()) return;
    const kind = shotKind(a.cid), ms = spd(kind === 'stone' ? 380 : kind === 'axe' ? 300 : 230);
    const y1 = p.y - V.size * 0.5, y2 = q.y - V.size * 0.4;
    // замах-выпад стрелка — та же деформация, что и у ближнего боя, только короче
    p.lunge = -0.6; setTimeout(() => { if (V.pos[a.id]) V.pos[a.id].lunge = 0; }, spd(160));
    if (kind === 'beam') {
      const col = /titan/.test(a.cid) ? '#e8f6ff' : '#e6a0ff';
      V.fx.bolt(p.x + (a.side === 0 ? 8 : -8), y1, q.x, y2, { color: col, glow: /titan/.test(a.cid) ? 'rgba(120,200,255,0.55)' : 'rgba(200,80,255,0.5)', ttl: spd(240), branches: /titan/.test(a.cid) ? 4 : 1, jag: 8 });
      V.fx.burst(q.x, y2, { n: 10, color: ['#fff', col], speed: 90, ttl: spd(300), shape: 'spark', glow: true });
      await wait(spd(200)); hitFx(t, false); return;
    }
    const o = { kind, ttl: ms, arc: kind === 'stone' ? 46 : kind === 'axe' ? 30 : kind === 'arrow' ? 22 : 10, size: Math.max(0.8, V.size / 26) };
    if (kind === 'fire') { o.color = '#ff7a2f'; o.trail = '#ff9a3a'; }
    if (kind === 'orb') { o.color = /monk|zealot/.test(a.cid) ? '#ffe9a0' : '#9ad0ff'; o.trail = o.color; }
    if (kind === 'skull') { o.color = '#7fe08a'; o.trail = 'rgba(60,140,60,0.7)'; }
    await V.fx.missile(p.x, y1, q.x, y2, o);
    if (kind === 'fire') { V.fx.burst(q.x, y2, { n: /magog/.test(a.cid) ? 30 : 14, color: ['#ff5a1f', '#f2d34c', '#e8792b'], speed: 80, ttl: spd(450), grav: -50, shape: 'puff', size: 3 }); if (/magog/.test(a.cid)) V.fx.ring(q.x, q.y + V.size * 0.5, { r0: 4, r1: V.size * 1.8, color: '#ff7a2f', ttl: spd(380) }); }
    else if (kind === 'skull') V.fx.puff(q.x, y2, { n: 8, color: ['rgba(60,140,60,0.5)', 'rgba(20,40,20,0.5)'], size: 5, ttl: spd(600) });
    else if (kind === 'orb') V.fx.burst(q.x, y2, { n: 12, color: [o.color, '#fff'], speed: 80, ttl: spd(320), shape: 'spark', glow: true });
    else if (kind === 'stone') { V.fx.burst(q.x, q.y + V.size * 0.5, { n: 14, color: ['#4b4d54', '#8b8d94'], speed: 90, ttl: spd(400), shape: 'square', size: 2.5, angle: -Math.PI / 2, spread: 2 }); V.fx.shake(3, spd(160)); }
    hitFx(t, kind === 'stone');
  }
  async function towerFx(t) {
    if (!fxOn()) return;
    const q = V.pos[t.id];
    const row = t.y < Bt.GATE_ROW ? 2 : 8;
    const [x, y] = Hex.center(Bt.WALL_COL, row, V.size, V.ox, V.oy);
    await V.fx.missile(x, y - V.size * 1.6, q.x, q.y - V.size * 0.4, { kind: 'dart', ttl: spd(220), arc: 12, size: Math.max(0.8, V.size / 26) });
    hitFx(t, false);
  }
  async function catapultFx(e) {
    if (!fxOn()) return;
    const rows = { 0: 0, 1: 3, 2: 7, 3: 10 }; const row = e.wall === 'gate' ? Bt.GATE_ROW : rows[e.wall];
    const [tx, ty] = Hex.center(Bt.WALL_COL, row, V.size, V.ox, V.oy);
    const [sx, sy] = Hex.center(0, Bt.GATE_ROW, V.size, V.ox, V.oy);
    const missY = e.result === 'miss' ? ty + V.size * 0.6 : ty - V.size * 0.5;
    await V.fx.missile(sx, sy - V.size, tx + (e.result === 'miss' ? V.size : 0), missY, { kind: 'stone', ttl: spd(560), arc: 90, size: Math.max(1, V.size / 22) });
    if (e.result === 'miss') { V.fx.puff(tx + V.size, missY, { n: 5, color: 'rgba(120,100,70,0.45)', size: 5, ttl: spd(500) }); return; }
    V.fx.burst(tx, ty - V.size * 0.4, { n: e.result === 'destroy' ? 30 : 14, color: ['#8b8d94', '#c9c9cc', '#4b4d54'], speed: 110, ttl: spd(600), shape: 'square', size: 3, angle: -Math.PI / 2, spread: 2.4 });
    V.fx.puff(tx, ty, { n: 6, color: 'rgba(120,110,100,0.5)', size: 7, ttl: spd(700) });
    V.fx.shake(e.result === 'destroy' ? 7 : 3, spd(260));
  }
  /** Позиция фигуры героя у края поля: [x, земля]. */
  function heroPos(side) {
    const [, gy] = Hex.center(0, Bt.GATE_ROW, V.size, V.ox, V.oy);
    return [side === 0 ? V.ox - V.margin * 0.5 : V.ox + V.fw + V.margin * 0.5, gy + V.size * 0.9];
  }
  function drawHeroFigure(ctx, side, sc, ts) {
    const h = V.b.sides[side].hero; const name = 'hero_' + h.cls;
    if (!Sp.has(name)) return;
    const [x, y] = heroPos(side);
    const cast = V.heroCast[side] > 0 ? 1 - V.heroCast[side] / 600 : 0;
    const st = An.state({ t: ts, phase: An.phaseOf('hero' + side), dir: side === 0 ? 1 : -1, cast });
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(x, y - 1, V.size * 0.5, V.size * 0.17, 0, 0, Math.PI * 2); ctx.fill();
    const color = (H3.Game.state && h.owner >= 0 && H3.Game.state.players[h.owner]) ? H3.Game.state.players[h.owner].color : '#999';
    T.castShadow(ctx, name, x, y, Math.max(1, Math.round(sc * 1.3 * 2) / 2), side === 1, V.day, 0.8, 0.5);
    An.draw(ctx, name, x, y, Math.max(1, Math.round(sc * 1.3 * 2) / 2), side === 1, { st }, { b: color });
    if (cast > 0 && fxOn() && Math.random() < 0.5) V.fx.add({ x: x + rnd(-8, 8), y: y - V.size * 1.6, vx: rnd(-10, 10), vy: -rnd(20, 40), ax: 0, ay: 0, ttl: 400, life: 0, size: 2, color: '#e6a0ff', shape: 'spark', glow: true, shrink: true });
  }
  /** Эффект заклинания: по школе и типу, с поправкой на конкретные заклинания. */
  async function spellFx(sp, e, targets) {
    const b = V.b;
    if (!fxOn()) { for (const tg of targets) flashUnit(tg, SP.SCHOOL_COLORS[sp.school]); return; }
    const col = SP.SCHOOL_COLORS[sp.school];
    V.heroCast[e.side] = 600;
    const [hx, hy] = V.showHeroes ? heroPos(e.side) : [e.side === 0 ? V.ox : V.ox + V.fw, V.oy + V.size * 6];
    const src = [hx, hy - V.size * 1.4];
    const rects = targets.map(unitRect);
    const hex = e.hex ? Hex.center(e.hex[0], e.hex[1], V.size, V.ox, V.oy) : (rects[0] ? [rects[0].x, rects[0].y - V.size * 0.4] : null);
    const id = sp.id, fx = V.fx;
    const FIRE = ['#ff5a1f', '#f2d34c', '#e8792b', '#ff9a3a'], ICE = ['#9ad0ff', '#ffffff', '#4d7fe0'], STONE = ['#4b4d54', '#8b8d94', '#b0843c'];
    const fireBurst = (x, y, big) => { fx.burst(x, y, { n: big ? 44 : 22, color: FIRE, speed: big ? 110 : 70, ttl: spd(520), grav: -60, shape: 'puff', size: big ? 4 : 3 }); fx.burst(x, y, { n: 12, color: ['#fff', '#f2d34c'], speed: 140, ttl: spd(320), shape: 'spark', glow: true }); fx.puff(x, y - 6, { n: 6, color: 'rgba(40,30,20,0.45)', size: 7, ttl: spd(800) }); };
    if (id === 'lightning_bolt' || id === 'titans_bolt' || id === 'chain_lightning') {
      fx.flash({ color: '#cfe8ff', alpha: id === 'titans_bolt' ? 0.45 : 0.25, ttl: spd(180) });
      let prev = null;
      for (const r of rects) {
        const y = r.y - r.h * 0.5;
        if (prev) fx.bolt(prev[0], prev[1], r.x, y, { ttl: spd(300), branches: 2, width: 2 });
        else fx.bolt(r.x + rnd(-40, 40), -10, r.x, y, { ttl: spd(320), branches: id === 'titans_bolt' ? 6 : 3, width: id === 'titans_bolt' ? 3 : 2 });
        fx.burst(r.x, y, { n: 14, color: ['#fff', '#7fd9ea'], speed: 110, ttl: spd(320), shape: 'spark', glow: true });
        fx.ring(r.x, r.y, { r0: 4, r1: V.size, color: '#cfe8ff', ttl: spd(300) });
        prev = [r.x, y];
        if (id === 'chain_lightning') await wait(spd(120));
      }
      if (id === 'titans_bolt') fx.shake(6, spd(260));
      await wait(spd(280)); return;
    }
    if (id === 'magic_arrow' || id === 'ice_bolt' || id === 'implosion') {
      const r = rects[0]; if (!r) return;
      if (id === 'implosion') {
        fx.ring(r.x, r.y - r.h * 0.4, { r0: V.size * 2.2, r1: 2, color: '#b0843c', ttl: spd(420), under: false, width: 4, squash: 0.6 });
        fx.burst(r.x, r.y - r.h * 0.4, { n: 20, color: STONE, speed: -90, ttl: spd(420), grav: 0, shape: 'square', size: 2.5 });
        await wait(spd(400));
        fx.burst(r.x, r.y - r.h * 0.4, { n: 34, color: STONE, speed: 150, ttl: spd(520), shape: 'square', size: 3 });
        fx.shake(7, spd(300)); await wait(spd(200)); return;
      }
      const ice = id === 'ice_bolt';
      await fx.missile(src[0], src[1], r.x, r.y - r.h * 0.5, { kind: 'orb', color: ice ? '#9ad0ff' : '#e6a0ff', trail: ice ? '#cfe8ff' : '#c04fd0', ttl: spd(320), arc: 18, size: Math.max(0.9, V.size / 24) });
      fx.burst(r.x, r.y - r.h * 0.5, { n: 22, color: ice ? ICE : ['#e6a0ff', '#c04fd0', '#fff'], speed: 110, ttl: spd(420), shape: ice ? 'square' : 'spark', glow: !ice, size: ice ? 2.5 : 1.8 });
      if (ice) fx.ring(r.x, r.y, { r0: 3, r1: V.size * 1.2, color: '#9ad0ff', ttl: spd(320) });
      await wait(spd(120)); return;
    }
    if (id === 'fireball' || id === 'inferno') {
      await fx.missile(src[0], src[1], hex[0], hex[1], { kind: 'fire', color: '#ff7a2f', trail: '#ff9a3a', ttl: spd(340), arc: 26, size: Math.max(1, V.size / 20) });
      fx.flash({ color: '#ff9a3a', alpha: 0.28, ttl: spd(220) });
      fireBurst(hex[0], hex[1], id === 'inferno');
      fx.ring(hex[0], hex[1] + V.size * 0.4, { r0: 6, r1: V.size * (id === 'inferno' ? 4.6 : 2.8), color: '#ff7a2f', ttl: spd(420), width: 4, fill: '#ff5a1f' });
      fx.shake(id === 'inferno' ? 6 : 4, spd(240));
      for (const r of rects) fx.burst(r.x, r.y - r.h * 0.4, { n: 8, color: FIRE, speed: 50, ttl: spd(500), grav: -70, shape: 'puff', size: 3 });
      await wait(spd(300)); return;
    }
    if (id === 'meteor_shower') {
      const hexes = [e.hex].concat(Hex.neighbors(e.hex[0], e.hex[1]));
      const jobs = hexes.map((hh, i) => new Promise(res => setTimeout(async () => {
        const [x, y] = Hex.center(hh[0], hh[1], V.size, V.ox, V.oy);
        await fx.missile(x + rnd(-60, 60), -20, x, y, { kind: 'stone', ttl: spd(360), arc: 0, size: Math.max(1, V.size / 20), trail: '#ff9a3a' });
        fx.burst(x, y, { n: 16, color: STONE.concat(FIRE), speed: 100, ttl: spd(480), shape: 'square', size: 2.5, angle: -Math.PI / 2, spread: 2.6 });
        fx.ring(x, y + 4, { r0: 3, r1: V.size * 1.3, color: '#b0843c', ttl: spd(320) });
        fx.shake(4, spd(180)); res();
      }, spd(i * 90))));
      await Promise.all(jobs); await wait(spd(150)); return;
    }
    if (id === 'frost_ring') {
      fx.ring(hex[0], hex[1] + V.size * 0.4, { r0: V.size * 0.8, r1: V.size * 2.4, color: '#9ad0ff', ttl: spd(520), width: 5, fill: '#cfe8ff' });
      for (const r of rects) { fx.burst(r.x, r.y - r.h * 0.4, { n: 14, color: ICE, speed: 60, ttl: spd(500), shape: 'square', size: 2.5 }); flashUnit(r === rects[0] ? targets[0] : targets[rects.indexOf(r)], '#9ad0ff'); }
      await wait(spd(420)); return;
    }
    if (id === 'armageddon') {
      fx.flash({ color: '#ff3a1f', alpha: 0.55, ttl: spd(500) });
      const jobs = [];
      for (let i = 0; i < 26; i++) jobs.push(new Promise(res => setTimeout(async () => {
        const x = rnd(V.ox, V.ox + V.fw), y = rnd(V.oy, V.oy + V.size * 15);
        await fx.missile(x + rnd(-80, 80), -20, x, y, { kind: 'fire', color: '#ff7a2f', trail: '#ff9a3a', ttl: spd(300), arc: 0, size: Math.max(1, V.size / 22) });
        fireBurst(x, y, false); fx.shake(3, spd(160)); res();
      }, spd(i * 35))));
      await Promise.all(jobs); fx.shake(8, spd(300)); await wait(spd(200)); return;
    }
    if (id === 'death_ripple' || id === 'destroy_undead') {
      const dark = id === 'death_ripple';
      const cx = V.ox + V.fw / 2, cy = V.oy + V.size * 8;
      fx.ring(cx, cy, { r0: 10, r1: V.fw * 0.7, color: dark ? '#4e2a72' : '#fff6d0', ttl: spd(600), width: 8, fill: dark ? '#101828' : '#ffe9a0', squash: 0.55 });
      fx.flash({ color: dark ? '#2a1040' : '#fff6d0', alpha: 0.35, ttl: spd(300) });
      for (const r of rects) { if (dark) fx.fall(r.x, r.y, r.w, r.h, { n: 14, color: ['#4e2a72', '#101828'] }); else fx.rise(r.x, r.y, r.w, r.h, { n: 16, color: ['#fff', '#ffe9a0'] }); }
      await wait(spd(520)); return;
    }
    if (sp.kind === 'resurrect') { for (const t of targets) resurrectFx(t, col); await wait(spd(500)); return; }
    if (sp.kind === 'heal') { for (const t of targets) healFx(t); await wait(spd(400)); return; }
    if (sp.kind === 'special') { for (const r of rects) fx.puff(r.x, r.y - r.h * 0.5, { n: 8, color: 'rgba(255,255,255,0.6)', size: 5, ttl: spd(500) }); await wait(spd(350)); return; }
    if (sp.kind === 'buff') { for (const t of targets) buffFx(t, col); await wait(spd(420)); return; }
    if (sp.kind === 'debuff') {
      for (const t of targets) { if (id === 'berserk') { const r = unitRect(t); fx.burst(r.x, r.y - r.h * 0.5, { n: 18, color: ['#ff5a1f', '#c8332a'], speed: 60, ttl: spd(500), grav: -30, shape: 'spark', glow: true }); } debuffFx(t, col); }
      await wait(spd(420)); return;
    }
    for (const t of targets) flashUnit(t, col);
    await wait(spd(400));
  }
  /** Окружение по местности: снег, пепел, туман, пыль, листья. */
  function ambient(dt) {
    if (!fxOn()) return;
    const t = V.b.terrain, fx = V.fx, w = V.worldW || V.cw, h = V.ch, k = dt / 1000;
    const chance = per => Math.random() < per * k;
    if (t === 'snow') { if (chance(30)) fx.add({ x: rnd(0, w), y: -5, vx: rnd(-12, 12), vy: rnd(22, 42), ax: 0, ay: 0, ttl: 12000, life: 0, size: rnd(1, 2.2), color: 'rgba(255,255,255,0.85)', shape: 'dot', shrink: false, fade: false, sway: true }); }
    else if (t === 'lava') { if (chance(14)) fx.add({ x: rnd(0, w), y: h + 2, vx: rnd(-8, 8), vy: -rnd(14, 34), ax: 0, ay: 0, ttl: 6000, life: 0, size: rnd(1, 2), color: ['#ff9a3a', '#ff5a1f', '#f2d34c'][Math.floor(Math.random() * 3)], shape: 'dot', shrink: false, glow: true, sway: true }); }
    else if (t === 'swamp') { if (chance(2.5)) fx.add({ x: rnd(-20, w), y: rnd(h * 0.5, h), vx: rnd(4, 10), vy: 0, ax: 0, ay: 0, ttl: 6000, life: 0, size: rnd(14, 26), color: 'rgba(170,200,160,0.22)', shape: 'puff', grow: 0.6, under: true }); }
    else if (t === 'sand') { if (chance(10)) fx.add({ x: -10, y: rnd(h * 0.45, h), vx: rnd(60, 110), vy: rnd(-4, 4), ax: 0, ay: 0, ttl: 5000, life: 0, size: 1.4, color: 'rgba(240,220,160,0.6)', shape: 'spark', shrink: false, fade: false }); }
    else if (t === 'grass' || t === 'dirt' || t === 'rough') { if (chance(1.8)) fx.add({ x: rnd(0, w), y: -5, vx: rnd(8, 20), vy: rnd(18, 30), ax: 0, ay: 0, ttl: 12000, life: 0, size: rnd(1.5, 2.5), color: ['#5cb84a', '#a67c1c', '#e8792b', '#2d6b2a'][Math.floor(Math.random() * 4)], shape: 'square', shrink: false, fade: false, sway: true }); }
    else if (t === 'subter') { if (chance(6)) fx.add({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-4, 4), vy: rnd(-6, 2), ax: 0, ay: 0, ttl: 4000, life: 0, size: 1.2, color: 'rgba(200,190,220,0.5)', shape: 'dot', shrink: false }); }
  }

  /* ---------- рендер ---------- */
  let lastTs = 0;
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!V.b || UI.$('#battle').classList.contains('hidden')) { lastTs = ts; return; }
    const dt = Math.min(60, ts - (lastTs || ts)); lastTs = ts;
    for (const a of V.anims.slice()) {
      a.t += dt; const f = Math.min(1, a.t / a.ms);
      if (a.fade) a.p.fade = 1 - f; else { a.p.x = U.lerp(a.fx, a.tx, f); a.p.y = U.lerp(a.fy, a.ty, f); }
      if (a.lunge) a.p.lunge = U.lerp(a.lunge[0], a.lunge[1], f);
      if (f >= 1) { V.anims.splice(V.anims.indexOf(a), 1); if (a.fade) a.p.fade = 0; a.done(); }
    }
    for (const f of V.floats.slice()) { f.t += dt; if (f.t >= f.ms) { V.floats.splice(V.floats.indexOf(f), 1); if (f.done) f.done(); } }
    for (const id in V.pos) { const p = V.pos[id]; if (p.shake > 0) p.shake -= dt; if (p.flash > 0) p.flash -= dt; }
    for (let i = 0; i < 2; i++) if (V.heroCast[i] > 0) V.heroCast[i] -= dt;
    if (V.fx) { V.fx.update(dt); ambient(dt); }
    for (const c of V.clouds) { c.x += c.v * dt / 1000; if (c.x - c.w > V.worldW) c.x = -c.w; }
    draw(ts);
  }
  function draw(ts) {
    const b = V.b, ctx = V.ctx, size = V.size;
    ctx.setTransform(V.dpr * V.cam.z, 0, 0, V.dpr * V.cam.z, -V.cam.x * V.dpr * V.cam.z, -V.cam.y * V.dpr * V.cam.z); ctx.imageSmoothingEnabled = false;
    if (V.fx) { const [sx, sy] = V.fx.shakeOffset(); ctx.translate(Math.round(sx), Math.round(sy)); }
    // параллакс: небо и дальний план отстают от земли, поле получает глубину при панораме
    const cx = V.cam.x;
    ctx.drawImage(V.bg.sky, Math.round(cx * 0.72), 0);
    ctx.drawImage(V.bg.mid, Math.round(cx * 0.34), 0);
    ctx.drawImage(V.bg.ground, 0, 0);
    for (const c of V.clouds) { ctx.fillStyle = 'rgba(255,255,255,' + c.a + ')'; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2); ctx.ellipse(c.x - c.w * 0.25, c.y + 2, c.w / 3.2, c.h / 2.4, 0, 0, Math.PI * 2); ctx.ellipse(c.x + c.w * 0.22, c.y + 1, c.w / 3.5, c.h / 2.2, 0, 0, Math.PI * 2); ctx.fill(); }
    const cur = Bt.current(b);
    // гексы
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
      const [x, y] = Hex.center(c, r, size, V.ox, V.oy);
      const pts = Hex.polygon(x, y, size - 0.5);
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      let fill = null;
      if (V.reach && V.reach.hexes.has(c + ',' + r) && !(cur && Bt.occupies(cur, c, r))) { const k = V.reach.speed ? V.reach.hexes.get(c + ',' + r).cost / V.reach.speed : 0; fill = 'rgba(120,220,120,' + (0.2 - 0.12 * k).toFixed(2) + ')'; }
      if (V.tactics) { const side = b.tactics.side; if (side === 0 ? c < b.tactics.dist : c >= W - b.tactics.dist) fill = 'rgba(241,207,116,0.22)'; }
      if (Bt.isMoat(b, c, r)) fill = 'rgba(40,90,180,0.45)';
      if (V.spellMode && V.spellMode.area && V.hover && Hex.dist(c, r, V.hover[0], V.hover[1]) <= (V.spellMode.area === 'ring' ? 1 : V.spellMode.area) && !(V.spellMode.area === 'ring' && Hex.dist(c, r, V.hover[0], V.hover[1]) === 0)) fill = 'rgba(200,80,255,0.25)';
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      // сетка почти не видна: поле — картина, а не миллиметровка; ярче только там, куда можно пойти
      ctx.strokeStyle = fill ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.055)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // наведение: у крупного стека показываем оба гекса, куда он встанет
    if (V.hover) {
      const hexes = [V.hover];
      if (cur && Bt.isBig(cur) && isHuman(cur.side) && V.reach && V.reach.hexes.has(V.hover[0] + ',' + V.hover[1])) hexes.push([V.hover[0] - Bt.dirOf(cur), V.hover[1]]);
      for (const [hx, hy] of hexes) {
        const [x, y] = Hex.center(hx, hy, size, V.ox, V.oy); const pts = Hex.polygon(x, y, size - 1);
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    if (V.tactics && V.tactics.sel !== null) {
      const p = V.pos[V.tactics.sel]; const su = b.units[V.tactics.sel];
      ctx.strokeStyle = 'rgba(241,207,116,0.95)'; ctx.lineWidth = 2; ctx.beginPath();
      ctx.ellipse(p.x, p.y + size * 0.55, size * (Bt.isBig(su) ? 1.5 : 0.75), size * 0.32, 0, 0, Math.PI * 2); ctx.stroke();
    }
    // текущий юнит
    if (cur) { const p = V.pos[cur.id]; const wide = Bt.isBig(cur) ? 1.5 : 0.75; ctx.strokeStyle = 'rgba(241,207,116,' + (0.6 + 0.3 * Math.sin(ts / 180)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p.x, p.y + size * 0.55, size * wide, size * 0.32, 0, 0, Math.PI * 2); ctx.stroke(); }
    if (V.fx) V.fx.drawUnder(ctx);
    // препятствия, стены, юниты — по рядам
    const sc = size / 14; // масштаб спрайтов
    const items = [];
    if (V.showHeroes) for (let s = 0; s < 2; s++) if (b.sides[s].hero) items.push({ y: -1, draw: () => drawHeroFigure(ctx, s, sc, ts) });
    for (const o of b.obstacles) { const [x, y] = Hex.center(o.x, o.y, size, V.ox, V.oy); items.push({ y, draw: () => { T.castShadow(ctx, o.kind, x, y + size * 0.6, sc * 0.9, false, V.day, 0.75, 0.5); Sp.draw(ctx, o.kind, x, y + size * 0.6, sc * 0.9); } }); }
    if (b.siege) for (let r = 0; r < H; r++) {
      const [x, y] = Hex.center(Bt.WALL_COL, r, size, V.ox, V.oy);
      const ws = Bt.wallState(b, Bt.WALL_COL, r);
      let spr;
      if (Bt.TOWER_ROWS[r]) spr = 'siege_tower';
      else if (r === Bt.GATE_ROW) spr = b.siege.gate > 0 ? 'gate' : 'gate_broken';
      else { const seg = Bt.WALL_SEGMENTS[r]; const st = b.siege.walls[seg]; spr = st === 2 ? 'wall_ok' : st === 1 ? 'wall_dmg' : 'wall_broken'; }
      items.push({ y: y + 0.5, draw: () => Sp.draw(ctx, spr, x, y + size * 0.75, sc * 0.8) });
      if (b.siege.moat) { const [mx, my] = Hex.center(Bt.MOAT_COL, r, size, V.ox, V.oy); items.push({ y: my - 100, draw: () => Sp.draw(ctx, 'moat', mx, my + size * 0.5, sc * 0.85) }); }
    }
    for (const u of b.units) {
      const p = V.pos[u.id]; if (!p) continue;
      if (!u.alive && !(p.fade > 0)) continue;
      items.push({ y: p.y, draw: () => drawUnit(ctx, u, p, sc, ts) });
    }
    items.sort((a, b2) => a.y - b2.y); for (const it of items) it.draw();
    if (V.fx) V.fx.drawOver(ctx, V.worldW * 2, V.ch * 2);
    // подсказка урона / стрелка направления
    if (V.hover && cur && isHuman(cur.side) && !V.spellMode) drawAttackHint(ctx, cur);
    // всплывающие
    for (const f of V.floats) {
      const k = f.t / f.ms;
      if (f.hexFlash) { const [x, y] = Hex.center(f.hexFlash[0], f.hexFlash[1], size, V.ox, V.oy); ctx.fillStyle = f.color; ctx.globalAlpha = 0.6 * (1 - k); ctx.beginPath(); ctx.arc(x, y, size * (1 + k * 1.5), 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; continue; }
      // цифры урона крупнее и с подскоком: сначала вылетают, потом тают
      const pop = f.big ? 1 + Math.max(0, 0.35 - k) * 1.2 : 1;
      ctx.globalAlpha = 1 - k * k; ctx.font = 'bold ' + Math.round((f.big ? 17 : 13) * Math.max(1, sc * 0.9) * pop) + 'px Philosopher, sans-serif'; ctx.textAlign = 'center';
      const yy = f.y - (f.big ? Math.sin(Math.min(1, k * 1.6) * Math.PI / 2) * 30 : k * 24);
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineJoin = 'round'; ctx.strokeText(f.text, f.x, yy);
      ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, yy); ctx.globalAlpha = 1;
    }
  }
  function drawUnit(ctx, u, p, sc, ts) {
    const c = C.get(u.cid);
    const x = p.x, y = p.y + V.size * 0.55;
    ctx.globalAlpha = p.fade !== undefined && !u.alive ? p.fade : 1;
    // процедурная анимация: дыхание, шаг, замах, отдача, оседание
    const st = An.state({
      t: ts, phase: p.phase, dir: u.side === 0 ? 1 : -1, flying: C.isFlyer(c),
      moving: !!p.moving, lunge: p.lunge, cast: p.cast,
      hurt: p.shake > 0 ? Math.min(1, p.shake / 180) : 0,
      dead: !u.alive && p.fade !== undefined ? p.fade : undefined,
    });
    const lift = Math.max(0, -st.dy);
    const big = Bt.isBig(u);
    // мягкое пятно под ногами + падающая тень силуэтом: отряд перестаёт «висеть» над гексом
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath();
    ctx.ellipse(p.x, y - 1, V.size * (big ? 1.1 : 0.5) * (1 - Math.min(0.3, lift / 30)), V.size * 0.18 * (1 - Math.min(0.35, lift / 26)), 0, 0, Math.PI * 2); ctx.fill();
    // крупное существо заметно больше обычного, но не вдвое: спрайты рисовались
    // под один гекс, и двойной масштаб залезал бы на соседние ряды
    const scale = Math.max(1, Math.round(sc * (big ? 1.65 : 1.4) * 2) / 2);
    if (u.alive) T.castShadow(ctx, u.cid, x, y - 2, scale, u.side === 1, V.day, 0.8, 0.5);
    An.draw(ctx, u.cid, x, y - 2, scale, u.side === 1, { st });
    if (p.flash > 0) { ctx.globalAlpha = Math.min(0.7, p.flash / 350); ctx.fillStyle = p.flashColor; ctx.beginPath(); ctx.arc(p.x, p.y, V.size * 0.9, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    if (u.alive) {
      // счётчик
      const txt = String(u.count); ctx.font = 'bold 11px sans-serif'; const tw = ctx.measureText(txt).width + 6;
      const off = Bt.isBig(u) ? V.size * 0.9 : V.size * 0.25;
      const bx = p.x + (u.side === 0 ? off : -off - tw), by = y - 2;
      ctx.fillStyle = u.side === 0 ? '#2f63d8' : '#a03a2c'; ctx.fillRect(bx, by - 11, tw, 12); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by - 10.5, tw - 1, 11);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(txt, bx + 3, by - 2);
      // эффекты
      let k = 0; for (const e in u.effects) { const bad = ['slow', 'curse', 'weakness', 'disrupting_ray', 'blind', 'petrify', 'paralyze', 'disease', 'poison', 'aging', 'bound'].includes(e); ctx.fillStyle = bad ? '#ff6a6a' : '#7fd9ea'; ctx.fillRect(p.x - V.size * (Bt.isBig(u) ? 1.2 : 0.6) + k * 5, p.y - V.size * 1.1, 4, 4); k++; }
      if (u.defended) { ctx.fillStyle = '#c9c9cc'; ctx.fillRect(p.x - V.size * (Bt.isBig(u) ? 1.2 : 0.6), p.y - V.size * 1.2 - 6, 4, 4); }
    }
    ctx.globalAlpha = 1;
  }
  function attackFrom(cur, target) {
    if (!V.reach) return null;
    const opts = V.reach.attacks.filter(a => a.target === target.id);
    if (!opts.length) return null;
    // ближайший к курсору
    if (V.hoverPx) { let best = null, bd = Infinity; for (const o of opts) { const [x, y] = Hex.center(o.from[0], o.from[1], V.size, V.ox, V.oy); const d = Math.hypot(x - V.hoverPx[0], y - V.hoverPx[1]); if (d < bd) { bd = d; best = o; } } return best; }
    return opts.sort((p, q) => p.cost - q.cost)[0];
  }
  function drawAttackHint(ctx, cur) {
    const b = V.b; const t = Bt.unitAt(b, V.hover[0], V.hover[1]);
    if (!t || t.side === cur.side) return;
    if (Bt.isShooterNow(b, cur)) { const p = V.pos[t.id]; Sp.drawFit(ctx, 'ic_shots', p.x - 8, p.y - V.size * 1.6 - 8, 16, 16); return; }
    const a = attackFrom(cur, t); if (!a) { const p = V.pos[t.id]; Sp.drawFit(ctx, 'ic_cross', p.x - 8, p.y - V.size * 1.6 - 8, 16, 16); return; }
    const [x, y] = Hex.center(a.from[0], a.from[1], V.size, V.ox, V.oy);
    ctx.strokeStyle = '#ffd070'; ctx.lineWidth = 2; const pts = Hex.polygon(x, y, V.size - 2); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke();
    const tp = V.pos[t.id]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tp.x, tp.y); ctx.stroke();
  }

  /* ---------- ввод ---------- */
  function onMove(e) {
    if (!V.b) return;
    const h = hexAt(e.offsetX, e.offsetY); V.hoverPx = toWorld(e.offsetX, e.offsetY);
    V.hover = h;
    const cur = Bt.current(V.b);
    if (!h) { UI.hideTip(); return; }
    const u = Bt.unitAt(V.b, h[0], h[1]);
    if (u && cur && isHuman(cur.side) && u.side !== cur.side && !V.spellMode) {
      const ranged = Bt.isShooterNow(V.b, cur); const can = ranged || attackFrom(cur, u);
      if (can) { const pv = Bt.preview(V.b, cur, u, ranged); let s = '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b><br>' + (ranged ? 'Выстрел' : 'Удар') + ': ' + pv.min + '–' + pv.max + ' урона, погибнет ' + pv.killMin + '–' + pv.killMax; if (pv.retMin !== undefined) s += '<br>Ответ: ' + pv.retMin + '–' + pv.retMax + ' урона, потеряем ' + pv.retKillMin + '–' + pv.retKillMax; UI.tip(e.clientX, e.clientY, s); return; }
      UI.tip(e.clientX, e.clientY, '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b><br>Недостижимо'); return;
    }
    if (u && cur && isHuman(cur.side) && u.side === cur.side && u.id !== cur.id && C.hasAb(C.get(cur.cid), 'healer') && !V.spellMode) {
      UI.tip(e.clientX, e.clientY, '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b><br>Подлечить: ' + (u.maxHp - u.hp > 0 ? 'ранен на ' + (u.maxHp - u.hp) + ' HP' : 'верхний цел')); return;
    }
    if (u) { UI.tip(e.clientX, e.clientY, '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b> ' + (u.side === 0 ? '(атакующие)' : '(защитники)') + '<br>HP ' + u.hp + '/' + u.maxHp + ', скорость ' + Bt.effSpeed(V.b, u) + (Object.keys(u.effects).length ? '<br>' + Object.keys(u.effects).map(k => EFFECT_NAMES[k] || k).join(', ') : '') + '<br><span class="muted">ПКМ — подробности</span>'); return; }
    UI.hideTip();
  }
  function onDown(e) {
    if (!V.b || e.button === 2) return;
    H3.Audio.unlock();
    const h = hexAt(e.offsetX, e.offsetY); if (!h) return;
    V.hoverPx = toWorld(e.offsetX, e.offsetY); V.hover = h;
    const b = V.b, cur = Bt.current(b);
    if (V.tactics) { tacticsClick(h); return; }
    if (!cur || !isHuman(cur.side)) { V.skip = true; setTimeout(() => { V.skip = false; }, 50); return; }
    const u = Bt.unitAt(b, h[0], h[1]);
    if (V.spellMode) { castAt(h, u); return; }
    if (e.pointerType === 'touch') { // двойной тап для подтверждения
      const key = h[0] + ',' + h[1];
      if (V.tapTarget !== key) { V.tapTarget = key; onMove(e); return; }
      V.tapTarget = null;
    }
    if (u && u.side !== cur.side) {
      if (Bt.isShooterNow(b, cur)) { doAction({ type: 'shoot', target: u.id }); return; }
      const a = attackFrom(cur, u); if (a) { doAction({ type: 'attack', target: u.id, from: a.from }); return; }
      UI.toast('Цель недостижима', 'warn'); return;
    }
    if (u && u.side === cur.side && u.id !== cur.id && C.hasAb(C.get(cur.cid), 'healer')) { doAction({ type: 'heal', target: u.id }); return; }
    if (u && u.side === cur.side && Bt.abilityOf(cur) && Bt.abilityTargets(b, cur).some(t => t.id === u.id)) { doAction({ type: 'ability', target: u.id }); return; }
    if (u && u.id === cur.id) { doAction({ type: 'defend' }); return; }
    if (!u && V.reach && V.reach.hexes.has(h[0] + ',' + h[1])) { doAction({ type: 'move', x: h[0], y: h[1] }); return; }
  }
  /** Клик в фазе тактики: свой отряд — выбрать, клетка в полосе — переставить. */
  function tacticsClick(h) {
    const b = V.b, side = b.tactics.side;
    const u = Bt.unitAt(b, h[0], h[1]);
    if (u && u.side === side) { V.tactics.sel = V.tactics.sel === u.id ? null : u.id; return; }
    if (V.tactics.sel === null) { UI.toast('Сначала выбери отряд', 'warn'); return; }
    const sel = b.units[V.tactics.sel];
    if (!Bt.inTacticsBand(b, sel, h[0], h[1])) { UI.toast('Только в подсвеченной полосе', 'warn'); return; }
    const ev = Bt.act(b, { type: 'tacticsMove', unit: sel.id, x: h[0], y: h[1] });
    if (ev.length && ev[0].t === 'error') { UI.toast(ev[0].msg, 'warn'); return; }
    syncPositions(); H3.Audio.play('step');
  }
  function castAt(h, u) {
    const sp = V.spellMode.spell; const side = Bt.current(V.b).side;
    if (sp.area) { doAction({ type: 'cast', spell: sp.id, hex: h }); return; }
    if (!u) { UI.toast('Выберите цель', 'warn'); return; }
    doAction({ type: 'cast', spell: sp.id, target: u.id });
  }
  function unitInfo(u) {
    const c = C.get(u.cid);
    const eff = Object.keys(u.effects).map(k => EFFECT_NAMES[k] || k).join(', ');
    UI.modal({ title: c.name, html: UI.creatureCard(c, '<div class="small">В бою: ×' + u.count + ', HP верхнего ' + u.hp + '/' + u.maxHp + ', скорость ' + Bt.effSpeed(V.b, u) + ', атака ' + Bt.effAtt(V.b, u, true) + ', защита ' + Bt.effDef(V.b, u) + (C.isShooter(c) ? ', выстрелов ' + u.shots : '') + (eff ? '<br>Эффекты: ' + eff : '') + '</div>') });
  }

  /* ---------- панель ---------- */
  function renderBar() {
    const b = V.b; if (!b) return;
    const bar = UI.$('#battleBar'); bar.innerHTML = '';
    const cur = Bt.current(b);
    const human = cur && isHuman(cur.side);
    // стороны
    const sideHtml = i => { const s = b.sides[i]; return '<div class="bside"><b>' + UI.esc(s.name) + '</b>' + (s.hero ? '<br><span class="small">' + UI.icon('ic_att') + s.att + ' ' + UI.icon('ic_def') + s.def + ' ' + UI.icon('ic_pow') + s.pow + ' ' + UI.icon('ic_mana') + s.mana + '</span>' : '') + '</div>'; };
    bar.appendChild(UI.el('div', '', sideHtml(0)));
    // очередь
    const q = UI.el('div', ''); q.id = 'queue';
    const ids = [];
    if (cur) ids.push(cur.id);
    for (let i = b.pos; i < b.queue.length; i++) if (b.units[b.queue[i]].alive) ids.push(b.queue[i]);
    for (const id of b.waitQueue) ids.push(id);
    for (const id of ids.slice(0, 12)) { const u = b.units[id]; const d = UI.el('div', 'q' + (cur && id === cur.id ? ' cur' : '') + (u.side === 1 ? ' enemy' : ''), UI.icon(u.cid, 1) + '<i>' + u.count + '</i>'); d.title = C.get(u.cid).name; q.appendChild(d); }
    bar.appendChild(q);
    bar.appendChild(UI.el('div', '', sideHtml(1)));
    const lg = UI.el('div', ''); lg.id = 'battleLog'; lg.innerHTML = V.logLines.slice(-2).map(s => '<div>' + UI.esc(s) + '</div>').join(''); bar.appendChild(lg);
    const btns = UI.el('div', 'row wrap');
    const mk = (label, fn, dis, title) => { const bt = UI.el('button', 'sm', label); bt.disabled = !!dis; bt.title = title || ''; bt.onclick = () => { H3.Audio.play('click'); fn(); }; btns.appendChild(bt); };
    if (V.tactics) {
      mk('Готово', () => endTactics(), false, 'Начать бой');
      mk('Сбросить', () => { for (const u of Bt.allies(b, b.tactics.side)) { u.x = u.startX; u.y = u.startY; } syncPositions(); }, false, 'Вернуть отряды на исходные места');
      bar.appendChild(btns);
      const hint = UI.el('div', 'small muted', 'Тактика: выбери отряд и укажи клетку в жёлтой полосе');
      bar.appendChild(hint);
      return;
    }
    const abil = cur && Bt.abilityOf(cur), abilT = abil ? Bt.abilityTargets(b, cur) : [];
    if (abil) mk(UI.icon('ic_spellbook') + ' ' + ABILITY_LABEL[abil], () => {
      const best = AI.chooseAbility(b, cur);
      if (best) doAction(best.action); else UI.toast('Некого выбрать', 'warn');
    }, !human || !abilT.length, 'Раз за бой; можно и кликнуть по своему отряду');
    mk(UI.icon('ic_wait') + ' Ждать', () => doAction({ type: 'wait' }), !human || (cur && cur.waited), 'Отложить ход до конца раунда');
    mk(UI.icon('ic_defend') + ' Защита', () => doAction({ type: 'defend' }), !human, 'Защита +20 % до следующего хода');
    mk(UI.icon('ic_spellbook') + ' Магия', () => openSpellbook(), !human || !b.sides[cur.side].hero || !b.sides[cur.side].hero.hasBook, 'Книга заклинаний');
    mk(UI.icon('ic_auto') + ' Авто', () => { V.auto = true; V.spellMode = null; step(); }, !human, 'Доверить бой ИИ');
    const canFlee = cur && b.sides[cur.side].hero && b.sides[cur.side].canRetreat;
    // редкие действия — в меню, чтобы главные кнопки были крупными и под пальцем
    mk('…', () => {
      const cost = canFlee ? Math.floor(R.armyCost(b.sides[cur.side].army).gold * 0.5 * (1 - 0.2 * R.skillLvl(b.sides[cur.side].hero, 'diplomacy'))) : 0;
      UI.choose('Ещё', '', [
        { id: 'retreat', label: 'Отступить', desc: 'Сохранить героя, потерять армию', disabled: !human || !canFlee },
        { id: 'surrender', label: 'Сдаться за ' + U.fmt(cost) + ' золота', desc: 'Заплатить выкуп и сохранить армию', disabled: !human || !canFlee },
        { id: 'speed', label: 'Скорость анимации: ' + ['мгновенно', 'обычно', 'быстро'][V.speed], desc: 'Переключить' },
      ]).then(ch => {
        if (ch === 'retreat') UI.confirm('Отступление', 'Герой сбежит в таверну, армия будет потеряна. Отступить?').then(v => { if (v) doAction({ type: 'retreat' }); });
        else if (ch === 'surrender') UI.confirm('Сдаться', 'Заплатить ' + U.fmt(cost) + ' золота и сохранить армию (герой уйдёт в таверну)?').then(v => { if (v) doAction({ type: 'surrender' }); });
        else if (ch === 'speed') { V.speed = (V.speed + 1) % 3; H3.Game.settings().animSpeed = V.speed; H3.Game.saveSettings(); renderBar(); }
      });
    }, false, 'Отступить, сдаться, скорость');
    bar.appendChild(btns);
  }
  function openSpellbook() {
    const b = V.b, cur = Bt.current(b); if (!cur) return;
    const list = Bt.availableSpells(b, cur.side);
    if (!list.length) { UI.toast('Нет заклинаний', 'warn'); return; }
    const wrap = UI.el('div', 'spells');
    let closeFn = null;
    for (const it of list) {
      const sp = it.spell;
      const d = UI.el('div', 'spell' + (it.ok ? '' : ' no'), UI.icon('sp_' + sp.id, 2) + '<div><b>' + UI.esc(sp.name) + '</b> <span class="lvl">' + sp.level + ' ур. · ' + it.cost + ' маны · ' + UI.esc(SP.SCHOOL_NAMES[sp.school]) + ' (' + UI.esc(H3.Skills.levelName(it.mastery) || 'нет школы') + ')</span><br>' + UI.esc(SP.describe(sp, it.mastery)) + (it.ok ? '' : '<br><span class="red">' + UI.esc(it.reason) + '</span>') + '</div>');
      if (it.ok) d.onclick = () => { H3.Audio.play('click'); if (closeFn) closeFn(); selectSpell(sp, it.mastery); };
      wrap.appendChild(d);
    }
    UI.modal({ title: 'Книга заклинаний (' + b.sides[cur.side].mana + ' маны)', html: wrap, wide: true, buttons: [{ label: 'Закрыть', value: null }], onOpen: (box, close) => { closeFn = close; } });
  }
  function selectSpell(sp, mastery) {
    const b = V.b, cur = Bt.current(b);
    const mass = sp.mass && mastery === 3;
    if (sp.all || mass) { doAction({ type: 'cast', spell: sp.id }); return; }
    V.spellMode = { spell: sp, area: sp.area };
    UI.toast('Выберите цель для «' + sp.name + '»');
  }

  H3.BattleView = { init, run, V, doAction, playEvents };
})(typeof window !== 'undefined' ? window : globalThis);
