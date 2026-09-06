/* ============================================================================
   view/battle.js — экран боя: гексовое поле, ввод игрока, анимация событий,
   очередь ходов, книга заклинаний, автобой. run(b, opts) → Promise<result>.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Hex = U.Hex, C = H3.Creatures, Bt = H3.Battle, AI = H3.BattleAI, Sp = H3.Sprites, UI = H3.UI, SP = H3.Spells, R = H3.Rules, T = H3.Terrain;
  const W = Bt.W, H = Bt.H;

  const V = { b: null, canvas: null, ctx: null, size: 26, ox: 0, oy: 0, dpr: 1, hover: null, reach: null, human: [], auto: false, speed: 1, floats: [], anims: [], skip: false, spellMode: null, resolve: null, bg: null, pos: {}, done: false, tapTarget: null };

  function init() {
    V.canvas = UI.$('#battleCanvas'); V.ctx = V.canvas.getContext('2d');
    V.canvas.addEventListener('pointermove', onMove); V.canvas.addEventListener('pointerdown', onDown);
    V.canvas.addEventListener('pointerleave', () => { V.hover = null; UI.hideTip(); });
    V.canvas.addEventListener('contextmenu', e => { e.preventDefault(); const h = hexAt(e.offsetX, e.offsetY); const u = h && Bt.unitAt(V.b, h[0], h[1]); if (u) unitInfo(u); });
    window.addEventListener('resize', () => { if (V.b) layout(); });
    requestAnimationFrame(loop);
  }
  function layout() {
    const box = UI.$('#battleMain'); V.dpr = window.devicePixelRatio || 1;
    const bw = box.clientWidth, bh = box.clientHeight;
    const size = Math.floor(Math.min((bw - 20) / (Math.sqrt(3) * (W + 0.5)), (bh - 40) / (1.5 * H + 0.5)));
    V.size = Math.max(14, size);
    const fw = Math.sqrt(3) * V.size * (W + 0.5), fh = V.size * (1.5 * H + 0.5);
    V.cw = Math.min(bw, Math.round(fw + 20)); V.ch = Math.min(bh, Math.round(fh + 40));
    V.ox = Math.round((V.cw - fw) / 2); V.oy = Math.round((V.ch - fh) / 2) + 6;
    V.canvas.width = V.cw * V.dpr; V.canvas.height = V.ch * V.dpr; V.canvas.style.width = V.cw + 'px'; V.canvas.style.height = V.ch + 'px';
    V.bg = makeBg(V.b.terrain, V.cw, V.ch);
    for (const u of V.b.units) { const [x, y] = Hex.center(u.x, u.y, V.size, V.ox, V.oy); V.pos[u.id] = { x, y }; }
  }
  function makeBg(terrain, w, h) {
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
    return cv;
  }
  function hexAt(px, py) { const [c, r] = Hex.fromPixel(px, py, V.size, V.ox, V.oy); return (c >= 0 && r >= 0 && c < W && r < H) ? [c, r] : null; }

  /** Запуск боя. opts: { human: [сторона игрока...], quick } */
  function run(b, opts) {
    return new Promise(resolve => {
      V.b = b; V.human = (opts && opts.human) || []; V.auto = false; V.done = false; V.resolve = resolve; V.floats = []; V.anims = []; V.spellMode = null; V.hover = null; V.reach = null; V.tapTarget = null;
      V.speed = H3.Game ? H3.Game.settings().animSpeed : 1; V.logLines = [];
      H3.Game.showScreen('battle');
      layout(); renderBar();
      H3.Audio.play(b.siege ? 'siege' : 'turn');
      // начальные события (башни, катапульта первого раунда)
      const ev = b.events.slice(); b.events = [];
      playEvents(ev).then(() => step());
    });
  }
  function isHuman(side) { return V.human.includes(side) && !V.auto; }
  async function step() {
    const b = V.b;
    if (b.over) { await finishUp(); return; }
    const u = Bt.current(b);
    if (!u) { await finishUp(); return; }
    renderBar();
    if (isHuman(u.side)) { V.reach = Bt.reachable(b, u); focusUnit(u); return; } // ждём ввода
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
    r(res);
  }
  function focusUnit(u) { /* подсветка текущего */ }
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
          else for (const [x, y] of path) { await tween(u, [x, y], spd(70)); if (!V.skip) H3.Audio.play('step'); }
          break;
        }
        case 'hit': case 'shoot': case 'retaliate': {
          const a = b.units[e.unit], t = b.units[e.target]; if (!a || !t) break;
          if (e.t === 'shoot') { await projectile(a, t, spd(220)); H3.Audio.play('shoot'); }
          else { await lunge(a, t, spd(140)); H3.Audio.play('hit'); }
          if (e.t === 'retaliate') log(unitName(a) + ' отвечает');
          break;
        }
        case 'damage': {
          const t = b.units[e.unit]; if (!t) break;
          float(t, '−' + e.dmg + (e.killed ? ' (' + e.killed + ')' : ''), t.side === 0 ? '#ff8a6a' : '#ffd070');
          if (e.src === 'moat') log(unitName(t) + ' застревает во рву: −' + e.dmg);
          else if (e.src === 'tower') log('Башня бьёт ' + unitName(t) + ': −' + e.dmg);
          else log(unitName(t) + ': −' + e.dmg + (e.killed ? ', погибло ' + e.killed : ''));
          shake(t); await wait(spd(180)); break;
        }
        case 'death': { const u = b.units[e.unit]; H3.Audio.play('death'); log(unitName(u) + ' уничтожены'); await fade(u, spd(300)); break; }
        case 'luck': { const u = b.units[e.unit]; float(u, 'Удача! ×2', '#9be07f'); H3.Audio.play('luck'); log(unitName(u) + ': удача — двойной урон'); await wait(spd(250)); break; }
        case 'morale': { const u = b.units[e.unit]; float(u, e.good ? 'Мораль: доп. ход' : 'Мораль: замешательство', e.good ? '#9be07f' : '#ff8a6a'); H3.Audio.play('morale'); log(unitName(u) + (e.good ? ' воодушевлены — ещё один ход' : ' растеряны и пропускают ход')); await wait(spd(400)); break; }
        case 'wait': log(unitName(b.units[e.unit]) + ' ждут'); break;
        case 'defend': log(unitName(b.units[e.unit]) + ' защищаются'); break;
        case 'skip': log(unitName(b.units[e.unit]) + ' не могут действовать (' + ({ blind: 'ослеплены', petrify: 'окаменели', paralyze: 'парализованы' })[e.reason] + ')'); break;
        case 'spell': {
          const sp = SP.get(e.spell); const side = b.sides[e.side];
          H3.Audio.play('spell'); log((side.hero ? side.hero.name : 'Герой') + ' колдует «' + sp.name + '»');
          const targets = e.targets.map(x => b.units[x.unit]).filter(Boolean);
          if (e.hex) flashHex(e.hex, SP.SCHOOL_COLORS[sp.school]);
          for (const tg of targets) flashUnit(tg, SP.SCHOOL_COLORS[sp.school]);
          for (const x of e.targets) { if (x.result) float(b.units[x.unit], x.result === 'immune' ? 'иммунитет' : 'сопротивление', '#c9c9cc'); else if (x.raised !== undefined) float(b.units[x.unit], '+' + x.raised, '#9be07f'); }
          await wait(spd(500)); break;
        }
        case 'effect': { const u = b.units[e.unit]; const nm = EFFECT_NAMES[e.effect] || e.effect; if (u) float(u, nm, '#c9a9ff'); await wait(spd(150)); break; }
        case 'effectEnd': break;
        case 'heal': { const u = b.units[e.unit]; if (u && (e.raised || e.hp)) { float(u, e.raised ? '+' + e.raised : '+' + e.hp + ' HP', '#9be07f'); await wait(spd(200)); } break; }
        case 'ability': { const u = b.units[e.unit]; const nm = { deathStare: 'Взгляд смерти', fireShield: 'Огненный щит', lightning: 'Молния' }[e.ab] || e.ab; if (b.units[e.target]) float(b.units[e.target], nm + (e.dmg ? ' −' + e.dmg : e.killed ? ' ' + e.killed : ''), '#ffd070'); await wait(spd(200)); break; }
        case 'tower': { const t = b.units[e.target]; if (t) flashUnit(t, '#ffb03a'); H3.Audio.play('shoot'); break; }
        case 'catapult': { log('Катапульта: ' + (e.result === 'destroy' ? 'участок стены разрушен!' : e.result === 'hit' ? 'стена повреждена' : 'промах')); if (e.result !== 'miss') H3.Audio.play('siege'); await wait(spd(250)); break; }
        case 'moat': break;
        case 'manaDrain': log('Призраки вытягивают ману'); break;
        case 'end': break;
        case 'error': UI.toast(e.msg, 'warn'); break;
      }
      renderBar();
    }
  }
  const EFFECT_NAMES = { haste: 'Ускорение', slow: 'Замедление', bless: 'Благословение', curse: 'Проклятие', shield: 'Щит', stone_skin: 'Каменная кожа', bloodlust: 'Жажда крови', precision: 'Точность', weakness: 'Слабость', disrupting_ray: 'Разруш. луч', fortune: 'Фортуна', air_shield: 'Возд. щит', prayer: 'Молитва', blind: 'Ослепление', petrify: 'Окаменение', paralyze: 'Паралич', disease: 'Болезнь', poison: 'Яд', aging: 'Старение', bound: 'Связан' };
  function unitName(u) { return C.get(u.cid).name + (u.side === 0 ? '' : '') + ' (' + (u.side === 0 ? 'атака' : 'защита') + ')'; }
  function log(s) { V.logLines.push(s); if (V.logLines.length > 60) V.logLines.shift(); }
  function tween(u, to, ms) {
    return new Promise(r => {
      const [tx, ty] = Hex.center(to[0], to[1], V.size, V.ox, V.oy); const p = V.pos[u.id];
      if (!ms) { p.x = tx; p.y = ty; r(); return; }
      V.anims.push({ p, fx: p.x, fy: p.y, tx, ty, t: 0, ms, done: r });
    });
  }
  function lunge(a, t, ms) {
    return new Promise(r => {
      const p = V.pos[a.id], q = V.pos[t.id]; const dx = (q.x - p.x) * 0.35, dy = (q.y - p.y) * 0.35;
      if (!ms) { r(); return; }
      V.anims.push({ p, fx: p.x, fy: p.y, tx: p.x + dx, ty: p.y + dy, t: 0, ms: ms / 2, done: () => { V.anims.push({ p, fx: p.x, fy: p.y, tx: p.x - dx, ty: p.y - dy, t: 0, ms: ms / 2, done: r }); } });
    });
  }
  function projectile(a, t, ms) {
    return new Promise(r => { const p = V.pos[a.id], q = V.pos[t.id]; if (!ms) { r(); return; } V.floats.push({ proj: true, fx: p.x, fy: p.y - 14, tx: q.x, ty: q.y - 14, t: 0, ms, done: r }); });
  }
  function float(u, text, color) { const p = V.pos[u.id]; if (!p) return; V.floats.push({ text, color, x: p.x + (Math.random() * 10 - 5), y: p.y - 30, t: 0, ms: V.speed === 0 ? 1 : 900 }); }
  function shake(u) { const p = V.pos[u.id]; if (p) p.shake = V.speed === 0 ? 0 : 180; }
  function flashUnit(u, color) { const p = V.pos[u.id]; if (p) { p.flash = 350; p.flashColor = color; } }
  function flashHex(hex, color) { V.floats.push({ hexFlash: hex, color, t: 0, ms: 450 }); }
  function fade(u, ms) { return new Promise(r => { const p = V.pos[u.id]; if (!p || !ms) { r(); return; } p.fade = 1; V.anims.push({ p, fade: true, t: 0, ms, done: r }); }); }

  /* ---------- рендер ---------- */
  let lastTs = 0;
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!V.b || UI.$('#battle').classList.contains('hidden')) { lastTs = ts; return; }
    const dt = Math.min(60, ts - (lastTs || ts)); lastTs = ts;
    for (const a of V.anims.slice()) {
      a.t += dt; const f = Math.min(1, a.t / a.ms);
      if (a.fade) a.p.fade = 1 - f; else { a.p.x = U.lerp(a.fx, a.tx, f); a.p.y = U.lerp(a.fy, a.ty, f); }
      if (f >= 1) { V.anims.splice(V.anims.indexOf(a), 1); if (a.fade) a.p.fade = 0; a.done(); }
    }
    for (const f of V.floats.slice()) { f.t += dt; if (f.t >= f.ms) { V.floats.splice(V.floats.indexOf(f), 1); if (f.done) f.done(); } }
    for (const id in V.pos) { const p = V.pos[id]; if (p.shake > 0) p.shake -= dt; if (p.flash > 0) p.flash -= dt; }
    draw(ts);
  }
  function draw(ts) {
    const b = V.b, ctx = V.ctx, size = V.size;
    ctx.setTransform(V.dpr, 0, 0, V.dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(V.bg, 0, 0);
    const cur = Bt.current(b);
    // гексы
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
      const [x, y] = Hex.center(c, r, size, V.ox, V.oy);
      const pts = Hex.polygon(x, y, size - 0.5);
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      let fill = null;
      if (V.reach && V.reach.hexes.has(c + ',' + r) && !(cur && cur.x === c && cur.y === r)) fill = 'rgba(120,220,120,0.16)';
      if (Bt.isMoat(b, c, r)) fill = 'rgba(40,90,180,0.45)';
      if (V.spellMode && V.spellMode.area && V.hover && Hex.dist(c, r, V.hover[0], V.hover[1]) <= (V.spellMode.area === 'ring' ? 1 : V.spellMode.area) && !(V.spellMode.area === 'ring' && Hex.dist(c, r, V.hover[0], V.hover[1]) === 0)) fill = 'rgba(200,80,255,0.25)';
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      ctx.strokeStyle = 'rgba(0,0,0,0.13)'; ctx.lineWidth = 1; ctx.stroke();
    }
    if (V.hover) { const [x, y] = Hex.center(V.hover[0], V.hover[1], size, V.ox, V.oy); const pts = Hex.polygon(x, y, size - 1); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke(); }
    // текущий юнит
    if (cur) { const p = V.pos[cur.id]; ctx.strokeStyle = 'rgba(241,207,116,' + (0.6 + 0.3 * Math.sin(ts / 180)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p.x, p.y + size * 0.55, size * 0.75, size * 0.32, 0, 0, Math.PI * 2); ctx.stroke(); }
    // препятствия, стены, юниты — по рядам
    const sc = size / 14; // масштаб спрайтов
    const items = [];
    for (const o of b.obstacles) { const [x, y] = Hex.center(o.x, o.y, size, V.ox, V.oy); items.push({ y, draw: () => Sp.draw(ctx, o.kind, x, y + size * 0.6, sc * 0.9) }); }
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
    // подсказка урона / стрелка направления
    if (V.hover && cur && isHuman(cur.side) && !V.spellMode) drawAttackHint(ctx, cur);
    // всплывающие
    for (const f of V.floats) {
      const k = f.t / f.ms;
      if (f.proj) { const x = U.lerp(f.fx, f.tx, k), y = U.lerp(f.fy, f.ty, k) - Math.sin(k * Math.PI) * 30; ctx.fillStyle = '#ffe9a0'; ctx.fillRect(x - 3, y - 1, 7, 3); ctx.fillStyle = '#000'; ctx.fillRect(x - 3, y - 1, 7, 1); continue; }
      if (f.hexFlash) { const [x, y] = Hex.center(f.hexFlash[0], f.hexFlash[1], size, V.ox, V.oy); ctx.fillStyle = f.color; ctx.globalAlpha = 0.6 * (1 - k); ctx.beginPath(); ctx.arc(x, y, size * (1 + k * 1.5), 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; continue; }
      ctx.globalAlpha = 1 - k * k; ctx.font = 'bold ' + Math.round(13 * Math.max(1, sc * 0.9)) + 'px Philosopher, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#000'; ctx.fillText(f.text, f.x + 1, f.y - k * 24 + 1); ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y - k * 24); ctx.globalAlpha = 1;
    }
  }
  function drawUnit(ctx, u, p, sc, ts) {
    const c = C.get(u.cid);
    let x = p.x, y = p.y + V.size * 0.55;
    if (p.shake > 0) x += Math.sin(ts / 12) * 3;
    ctx.globalAlpha = p.fade !== undefined && !u.alive ? p.fade : 1;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(p.x, y - 1, V.size * 0.6, V.size * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    const scale = Math.max(1, Math.round(sc * 1.4 * 2) / 2);
    Sp.draw(ctx, u.cid, x, y - 2, scale, u.side === 1);
    if (p.flash > 0) { ctx.globalAlpha = Math.min(0.7, p.flash / 350); ctx.fillStyle = p.flashColor; ctx.beginPath(); ctx.arc(p.x, p.y, V.size * 0.9, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    if (u.alive) {
      // счётчик
      const txt = String(u.count); ctx.font = 'bold 11px sans-serif'; const tw = ctx.measureText(txt).width + 6;
      const bx = p.x + (u.side === 0 ? V.size * 0.25 : -V.size * 0.25 - tw), by = y - 2;
      ctx.fillStyle = u.side === 0 ? '#2f63d8' : '#a03a2c'; ctx.fillRect(bx, by - 11, tw, 12); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by - 10.5, tw - 1, 11);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(txt, bx + 3, by - 2);
      // эффекты
      let k = 0; for (const e in u.effects) { const bad = ['slow', 'curse', 'weakness', 'disrupting_ray', 'blind', 'petrify', 'paralyze', 'disease', 'poison', 'aging', 'bound'].includes(e); ctx.fillStyle = bad ? '#ff6a6a' : '#7fd9ea'; ctx.fillRect(p.x - V.size * 0.6 + k * 5, p.y - V.size * 1.1, 4, 4); k++; }
      if (u.defended) { ctx.fillStyle = '#c9c9cc'; ctx.fillRect(p.x - V.size * 0.6, p.y - V.size * 1.2 - 6, 4, 4); }
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
    const h = hexAt(e.offsetX, e.offsetY); V.hoverPx = [e.offsetX, e.offsetY];
    V.hover = h;
    const cur = Bt.current(V.b);
    if (!h) { UI.hideTip(); return; }
    const u = Bt.unitAt(V.b, h[0], h[1]);
    if (u && cur && isHuman(cur.side) && u.side !== cur.side && !V.spellMode) {
      const ranged = Bt.isShooterNow(V.b, cur); const can = ranged || attackFrom(cur, u);
      if (can) { const pv = Bt.preview(V.b, cur, u, ranged); let s = '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b><br>' + (ranged ? 'Выстрел' : 'Удар') + ': ' + pv.min + '–' + pv.max + ' урона, погибнет ' + pv.killMin + '–' + pv.killMax; if (pv.retMin !== undefined) s += '<br>Ответ: ' + pv.retMin + '–' + pv.retMax + ' урона, потеряем ' + pv.retKillMin + '–' + pv.retKillMax; UI.tip(e.clientX, e.clientY, s); return; }
      UI.tip(e.clientX, e.clientY, '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b><br>Недостижимо'); return;
    }
    if (u) { UI.tip(e.clientX, e.clientY, '<b>' + UI.esc(C.get(u.cid).name) + ' ×' + u.count + '</b> ' + (u.side === 0 ? '(атакующие)' : '(защитники)') + '<br>HP ' + u.hp + '/' + u.maxHp + ', скорость ' + Bt.effSpeed(V.b, u) + (Object.keys(u.effects).length ? '<br>' + Object.keys(u.effects).map(k => EFFECT_NAMES[k] || k).join(', ') : '') + '<br><span class="muted">ПКМ — подробности</span>'); return; }
    UI.hideTip();
  }
  function onDown(e) {
    if (!V.b || e.button === 2) return;
    H3.Audio.unlock();
    const h = hexAt(e.offsetX, e.offsetY); if (!h) return;
    V.hoverPx = [e.offsetX, e.offsetY]; V.hover = h;
    const b = V.b, cur = Bt.current(b);
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
    if (u && u.id === cur.id) { doAction({ type: 'defend' }); return; }
    if (!u && V.reach && V.reach.hexes.has(h[0] + ',' + h[1])) { doAction({ type: 'move', x: h[0], y: h[1] }); return; }
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
    mk(UI.icon('ic_wait') + ' Ждать', () => doAction({ type: 'wait' }), !human || (cur && cur.waited), 'Отложить ход до конца раунда');
    mk(UI.icon('ic_defend') + ' Защита', () => doAction({ type: 'defend' }), !human, 'Защита +20 % до следующего хода');
    mk(UI.icon('ic_spellbook') + ' Магия', () => openSpellbook(), !human || !b.sides[cur.side].hero || !b.sides[cur.side].hero.hasBook, 'Книга заклинаний');
    mk(UI.icon('ic_auto') + ' Авто', () => { V.auto = true; V.spellMode = null; step(); }, !human, 'Доверить бой ИИ');
    const canFlee = cur && b.sides[cur.side].hero && b.sides[cur.side].canRetreat;
    mk(UI.icon('ic_flee') + ' Отступить', () => UI.confirm('Отступление', 'Герой сбежит в таверну, армия будет потеряна. Отступить?').then(v => { if (v) doAction({ type: 'retreat' }); }), !human || !canFlee, 'Сохранить героя, потерять армию');
    mk(UI.icon('ic_surrender') + ' Сдаться', () => { const cost = Math.floor(R.armyCost(b.sides[cur.side].army).gold * 0.5 * (1 - 0.2 * R.skillLvl(b.sides[cur.side].hero, 'diplomacy'))); UI.confirm('Сдаться', 'Заплатить ' + U.fmt(cost) + ' золота и сохранить армию (герой уйдёт в таверну)?').then(v => { if (v) doAction({ type: 'surrender' }); }); }, !human || !canFlee, 'Заплатить выкуп и сохранить армию');
    mk(UI.icon('ic_speed') + ' ' + ['мгновенно', 'обычно', 'быстро'][V.speed], () => { V.speed = (V.speed + 1) % 3; H3.Game.settings().animSpeed = V.speed; H3.Game.saveSettings(); renderBar(); }, false, 'Скорость анимации');
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

  H3.BattleView = { init, run, V };
})(typeof window !== 'undefined' ? window : globalThis);
