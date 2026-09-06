/* ============================================================================
   view/adventure.js — карта приключений: рендер (canvas), камера, ввод,
   предпросмотр пути, анимация движения, миникарта, боковая панель.
   Действия делегируются H3.Game (main.js).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, O = H3.Objects, Sp = H3.Sprites, T = H3.Terrain, UI = H3.UI, PF = H3.Pathfind, F = H3.Factions, AR = H3.Artifacts;
  const TILE = 32;

  const V = {
    canvas: null, ctx: null, mini: null, state: null, mapCanvas: null, miniCanvas: null,
    cam: { x: 0, y: 0, z: 1.5 }, dirty: true, hover: null, pending: null, path: null, pf: null, pfHero: null,
    anim: null, drag: null, w: 0, h: 0, dpr: 1, lastTime: 0, busy: false, tipTimer: null,
  };

  function init() {
    V.canvas = UI.$('#mapCanvas'); V.ctx = V.canvas.getContext('2d'); V.mini = UI.$('#minimap');
    window.addEventListener('resize', resize);
    const c = V.canvas;
    c.addEventListener('pointerdown', onDown); c.addEventListener('pointermove', onMove); c.addEventListener('pointerup', onUp); c.addEventListener('pointercancel', () => { V.drag = null; });
    c.addEventListener('pointerleave', () => { V.hover = null; if (!isTouch()) { V.path = null; } UI.hideTip(); V.dirty = true; });
    c.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1 : -1, e.offsetX, e.offsetY); }, { passive: false });
    c.addEventListener('contextmenu', e => { e.preventDefault(); const t = tileAt(e.offsetX, e.offsetY); if (t) showInfo(t[0], t[1]); });
    V.mini.addEventListener('pointerdown', e => { const r = V.mini.getBoundingClientRect(); const m = V.state.map; const x = (e.clientX - r.left) / r.width * m.w, y = (e.clientY - r.top) / r.height * m.h; centerOn(x, y); });
    requestAnimationFrame(loop);
  }
  function isTouch() { return V.lastPointerType === 'touch'; }
  function resize() {
    const box = UI.$('#advMain'); if (!box) return;
    V.dpr = window.devicePixelRatio || 1;
    V.w = box.clientWidth; V.h = box.clientHeight;
    V.canvas.width = Math.round(V.w * V.dpr); V.canvas.height = Math.round(V.h * V.dpr);
    V.canvas.style.width = V.w + 'px'; V.canvas.style.height = V.h + 'px';
    clampCam(); V.dirty = true;
  }
  function setState(state) {
    V.state = state; V.mapCanvas = T.renderMap(state); V.miniCanvas = document.createElement('canvas');
    V.pf = null; V.pfHero = null; V.path = null; V.pending = null; V.anim = null;
    resize(); V.dirty = true;
  }
  function invalidate() { V.pf = null; V.dirty = true; }
  function clampCam() {
    if (!V.state) return;
    const m = V.state.map, z = V.cam.z;
    const maxX = Math.max(0, m.w * TILE - V.w / z), maxY = Math.max(0, m.h * TILE - V.h / z);
    V.cam.x = U.clamp(V.cam.x, 0, maxX); V.cam.y = U.clamp(V.cam.y, 0, maxY);
  }
  function centerOn(tx, ty) { V.cam.x = (tx + 0.5) * TILE - V.w / V.cam.z / 2; V.cam.y = (ty + 0.5) * TILE - V.h / V.cam.z / 2; clampCam(); V.dirty = true; }
  function zoomAt(dir, px, py) {
    const levels = [1, 1.5, 2, 3]; let i = levels.indexOf(V.cam.z); if (i < 0) i = 1;
    i = U.clamp(i + dir, 0, levels.length - 1); const nz = levels[i]; if (nz === V.cam.z) return;
    const wx = V.cam.x + px / V.cam.z, wy = V.cam.y + py / V.cam.z;
    V.cam.z = nz; V.cam.x = wx - px / nz; V.cam.y = wy - py / nz; clampCam(); V.dirty = true;
  }
  function tileAt(px, py) {
    const x = Math.floor((V.cam.x + px / V.cam.z) / TILE), y = Math.floor((V.cam.y + py / V.cam.z) / TILE);
    return S.inMap(V.state, x, y) ? [x, y] : null;
  }

  /* ---------- ввод ---------- */
  function onDown(e) {
    V.lastPointerType = e.pointerType;
    V.drag = { x: e.clientX, y: e.clientY, cx: V.cam.x, cy: V.cam.y, moved: false, t: Date.now() };
    V.canvas.setPointerCapture(e.pointerId);
    if (e.pointerType === 'touch') { clearTimeout(V.tipTimer); V.tipTimer = setTimeout(() => { const t = tileAt(e.offsetX, e.offsetY); if (t && V.drag && !V.drag.moved) { V.drag.long = true; showInfo(t[0], t[1]); } }, 550); }
  }
  function onMove(e) {
    V.lastPointerType = e.pointerType;
    if (V.drag && e.buttons) {
      const dx = e.clientX - V.drag.x, dy = e.clientY - V.drag.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) V.drag.moved = true;
      if (V.drag.moved) { V.cam.x = V.drag.cx - dx / V.cam.z; V.cam.y = V.drag.cy - dy / V.cam.z; clampCam(); V.dirty = true; UI.hideTip(); }
      return;
    }
    if (e.pointerType === 'touch') return;
    const t = tileAt(e.offsetX, e.offsetY);
    if (!t) { V.hover = null; UI.hideTip(); return; }
    if (!V.hover || V.hover[0] !== t[0] || V.hover[1] !== t[1]) {
      V.hover = t; V.dirty = true;
      if (!V.busy) { previewPath(t[0], t[1]); const html = describe(t[0], t[1]); if (html) UI.tip(e.clientX, e.clientY, html); else UI.hideTip(); }
    } else if (!V.busy) { const html = describe(t[0], t[1]); if (html) UI.tip(e.clientX, e.clientY, html); }
  }
  function onUp(e) {
    clearTimeout(V.tipTimer);
    const d = V.drag; V.drag = null;
    if (!d || d.moved || d.long) return;
    if (e.button === 2) return;
    const t = tileAt(e.offsetX, e.offsetY); if (!t) return;
    H3.Audio.unlock();
    handleClick(t[0], t[1], e.pointerType === 'touch');
  }
  function handleClick(x, y, touch) {
    if (V.busy || !V.state) return;
    const G = H3.Game, st = V.state;
    const hero = S.heroAt(st, x, y), town = S.townAt(st, x, y);
    const me = st.turn;
    // клик по своему герою — выбрать (или открыть экран героя при повторном)
    if (hero && hero.owner === me && !(G.selected() && G.selected().id === hero.id && V.pending && V.pending[0] === x && V.pending[1] === y)) {
      if (G.selected() && G.selected().id === hero.id) { G.openHero(hero); return; }
      G.selectHero(hero.id); V.pending = null; V.path = null; V.dirty = true; return;
    }
    if (town && town.owner === me && !G.selected()) { G.openTown(town); return; }
    const sel = G.selected(); if (!sel) return;
    if (town && town.owner === me && sel.inTown === town.id) { G.openTown(town); return; }
    // второй клик по той же цели — идти
    if (V.pending && V.pending[0] === x && V.pending[1] === y && V.path) { G.moveAlong(sel, V.path); V.pending = null; return; }
    previewPath(x, y);
    if (!V.path) { if (!touch) UI.toast('Туда не пройти', 'warn'); V.dirty = true; return; }
    V.pending = [x, y]; V.dirty = true;
    if (!touch) { G.moveAlong(sel, V.path); V.pending = null; }
  }
  function previewPath(x, y) {
    const G = H3.Game, sel = G && G.selected();
    V.path = null;
    if (!sel || !V.state) return;
    if (!V.pf || V.pfHero !== sel.id || V.pfX !== sel.x || V.pfY !== sel.y) { V.pf = S.pathfield(V.state, sel); V.pfHero = sel.id; V.pfX = sel.x; V.pfY = sel.y; }
    const p = PF.pathTo(V.pf, x, y);
    if (!p || !p.length) return;
    V.path = PF.annotate(V.pf, p, sel.move, R.heroMaxMove(sel));
    V.dirty = true;
  }
  function describe(x, y) {
    const st = V.state, vis = S.visible(st, st.turn, x, y);
    if (!vis) return '<b>Неизведанно</b>';
    const parts = [];
    const obj = S.objAt(st, x, y), hero = S.heroAt(st, x, y);
    if (hero && (hero.owner === st.turn || vis === 2)) {
      const p = st.players[hero.owner];
      parts.push('<b>' + UI.esc(hero.name) + '</b> — ' + UI.esc(H3.Heroes.getClass(hero.cls).name) + ' ' + hero.level + ' ур.' + (hero.owner !== st.turn ? '<br>' + UI.esc(p.name) + ' · сила ' + powerWord(R.armyPower(hero.army, hero)) : ''));
    }
    if (obj) {
      const t = O.get(obj.type);
      if (obj.type === 'town') { const tw = st.towns[obj.townId]; parts.push('<b>' + UI.esc(tw.name) + '</b> — ' + UI.esc(F.get(tw.faction).name) + (tw.owner >= 0 ? ', ' + UI.esc(st.players[tw.owner].name) : ', нейтральный') + (tw.owner !== st.turn && vis === 2 ? '<br>гарнизон: ' + powerWord(R.armyPower(tw.garrison, null)) : '')); }
      else if (obj.type === 'mine') parts.push('<b>' + UI.esc(O.MINE_NAMES[obj.res]) + '</b>' + (obj.owner >= 0 ? ' — ' + UI.esc(st.players[obj.owner].name) : ' — ничья') + '<br>+' + O.MINE_INCOME[obj.res] + ' ' + UI.esc(O.RES_NAMES_GEN[obj.res]) + ' в день');
      else if (obj.type === 'monster') { const c = C.get(obj.cid); const sel = H3.Game.selected(); let s = '<b>' + UI.esc(c.name) + '</b> — ' + (sel && R.skillLvl(sel, 'scouting') ? obj.n : UI.countWord(obj.n).toLowerCase()); if (sel) { const k = R.armyPower(sel.army, sel) / Math.max(1, H3.Adventure.monsterPower(obj)); s += '<br>' + (k >= 3 ? 'гораздо слабее вас' : k >= 1.5 ? 'слабее вас' : k >= 0.8 ? 'примерно равны' : k >= 0.4 ? 'сильнее вас' : 'гораздо сильнее вас'); } parts.push(s); }
      else if (obj.type === 'resource') parts.push('<b>' + UI.esc(O.RES_NAMES[obj.res]) + '</b>');
      else if (obj.type === 'artifact') parts.push('<b>' + UI.esc(AR.get(obj.art).name) + '</b><br><span class="muted">' + UI.esc(AR.get(obj.art).desc) + '</span>');
      else if (obj.type === 'dwelling') { const c = C.get(obj.cid); parts.push('<b>Жилище: ' + UI.esc(c.name) + '</b>' + (obj.owner === st.turn ? ' — доступно ' + obj.avail : '')); }
      else if (!t.obstacle) { let s = '<b>' + UI.esc(t.name) + '</b>'; if (t.desc) s += '<br><span class="muted">' + UI.esc(t.desc) + '</span>'; const sel = H3.Game.selected(); if (sel && obj.visited && obj.visited['h' + sel.id]) s += '<br><i>уже посещали</i>'; parts.push(s); }
      else parts.push('<b>' + UI.esc(t.name) + '</b>');
    }
    if (!parts.length) parts.push('<b>' + UI.esc(R.TERRAIN_NAMES[S.terrainAt(st, x, y)]) + '</b>' + (st.map.road[S.idx(st, x, y)] ? ' (дорога)' : ''));
    if (V.path && V.path.length) { const last = V.path[V.path.length - 1]; parts.push('<span class="small muted">Путь: ' + (last.turn === 0 ? 'сегодня' : 'через ' + last.turn + ' ' + U.plural(last.turn, 'ход', 'хода', 'ходов')) + '</span>'); }
    return parts.join('<br>');
  }
  function powerWord(v) { return v < 2000 ? 'слабая' : v < 8000 ? 'умеренная' : v < 25000 ? 'сильная' : v < 80000 ? 'очень сильная' : 'огромная'; }
  function showInfo(x, y) {
    const st = V.state; const obj = S.objAt(st, x, y), hero = S.heroAt(st, x, y);
    if (obj && obj.type === 'monster') { const c = C.get(obj.cid); UI.modal({ title: c.name, html: UI.creatureCard(c, '<div class="small">На карте: ' + UI.countWord(obj.n) + (H3.Game.selected() && R.skillLvl(H3.Game.selected(), 'scouting') ? ' (' + obj.n + ')' : '') + '</div>') }); return; }
    if (obj && obj.type === 'dwelling') { UI.modal({ title: O.get('dwelling').name, html: UI.creatureCard(C.get(obj.cid)) }); return; }
    if (hero && hero.owner !== st.turn) { UI.modal({ title: hero.name, html: '<div class="row top">' + UI.heroPortrait(hero, 3) + '<div><b class="w">' + UI.esc(H3.Heroes.getClass(hero.cls).name) + '</b> ' + hero.level + ' ур.<br>' + UI.esc(st.players[hero.owner].name) + '<br>Сила армии: ' + powerWord(R.armyPower(hero.army, hero)) + '</div></div>' + UI.armyHtml(hero.army) }); return; }
    const html = describe(x, y); if (html) UI.modal({ title: 'Клетка', html });
  }

  /* ---------- анимация движения ---------- */
  function animateMove(hero, steps) {
    return new Promise(resolve => {
      if (!steps.length) { resolve(); return; }
      const speed = H3.Game.settings().animSpeed; // 0 мгновенно, 1 норм, 2 быстро
      if (speed === 0) { V.anim = null; V.dirty = true; resolve(); return; }
      V.anim = { hero, steps, i: 0, t: 0, dur: speed === 2 ? 45 : 90, resolve };
      centerOnIfOut(hero.x, hero.y);
    });
  }
  function centerOnIfOut(tx, ty) {
    const z = V.cam.z, px = (tx + 0.5) * TILE, py = (ty + 0.5) * TILE;
    const margin = 2 * TILE;
    if (px < V.cam.x + margin || px > V.cam.x + V.w / z - margin || py < V.cam.y + margin || py > V.cam.y + V.h / z - margin) centerOn(tx, ty);
  }

  /* ---------- рендер ---------- */
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!V.state || UI.$('#adv').classList.contains('hidden')) return;
    const dt = Math.min(100, ts - (V.lastTime || ts)); V.lastTime = ts;
    if (V.anim) {
      const a = V.anim; a.t += dt;
      while (a.t >= a.dur && a.i < a.steps.length) { a.t -= a.dur; a.i++; H3.Audio.play('step'); const s = a.steps[Math.min(a.i, a.steps.length - 1)]; centerOnIfOut(s[0], s[1]); }
      if (a.i >= a.steps.length) { V.anim = null; a.resolve(); }
      V.dirty = true;
    }
    if (V.dirty || V.anim) { draw(ts); V.dirty = false; }
  }
  function heroDrawPos(h) {
    if (V.anim && V.anim.hero.id === h.id) {
      const a = V.anim; const from = a.i === 0 ? a.start || [a.steps[0][0], a.steps[0][1]] : a.steps[a.i - 1]; const to = a.steps[Math.min(a.i, a.steps.length - 1)];
      if (a.i === 0 && !a.start) a.start = [h._px !== undefined ? h._px : (a.steps[0][0] - (h.x - a.steps[a.steps.length - 1][0] === 0 ? 0 : 0)), 0];
      const f = a.i >= a.steps.length ? 1 : U.clamp(a.t / a.dur, 0, 1);
      const fx = a.i === 0 ? a.origin[0] : from[0], fy = a.i === 0 ? a.origin[1] : from[1];
      return [U.lerp(fx, to[0], f), U.lerp(fy, to[1], f)];
    }
    return [h.x, h.y];
  }
  function draw(ts) {
    const st = V.state, ctx = V.ctx, m = st.map, z = V.cam.z, dpr = V.dpr;
    const me = st.turn, vis = st.players[me].vis;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, V.canvas.width, V.canvas.height);
    ctx.setTransform(z * dpr, 0, 0, z * dpr, -Math.round(V.cam.x * z * dpr), -Math.round(V.cam.y * z * dpr));
    ctx.imageSmoothingEnabled = false;
    const x0 = Math.max(0, Math.floor(V.cam.x / TILE) - 1), y0 = Math.max(0, Math.floor(V.cam.y / TILE) - 2);
    const x1 = Math.min(m.w - 1, Math.ceil((V.cam.x + V.w / z) / TILE) + 1), y1 = Math.min(m.h - 1, Math.ceil((V.cam.y + V.h / z) / TILE) + 2);
    // местность
    ctx.drawImage(V.mapCanvas, x0 * TILE, y0 * TILE, (x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE, x0 * TILE, y0 * TILE, (x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE);
    // выделение героя
    const sel = H3.Game.selected();
    if (sel && !sel.dead) { const [hx, hy] = heroDrawPos(sel); ctx.strokeStyle = 'rgba(241,207,116,' + (0.6 + 0.3 * Math.sin(ts / 200)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(hx * TILE + 16, hy * TILE + 26, 13, 6, 0, 0, Math.PI * 2); ctx.stroke(); }
    // объекты и герои по рядам
    const items = [];
    for (const id in st.objects) { const o = st.objects[id]; if (o.x < x0 - 2 || o.x > x1 + 2 || o.y < y0 || o.y > y1 + 2) continue; if (!vis[o.y * m.w + o.x]) continue; items.push({ y: o.y, x: o.x, o }); }
    for (const id in st.heroes) { const h = st.heroes[id]; if (h.dead) continue; if (h.owner !== me && vis[h.y * m.w + h.x] !== 2) continue; if (h.inTown && h.owner !== me) continue; const [px, py] = heroDrawPos(h); if (px < x0 - 1 || px > x1 + 1 || py < y0 - 1 || py > y1 + 1) continue; items.push({ y: py + 0.01, x: px, h, px, py }); }
    items.sort((a, b) => a.y - b.y);
    for (const it of items) {
      if (it.o) drawObject(ctx, st, it.o, vis);
      else drawHero(ctx, st, it.h, it.px, it.py);
    }
    // туман
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const v = vis[y * m.w + x];
      if (v === 2) continue;
      ctx.fillStyle = v === 0 ? '#000' : 'rgba(0,0,10,0.42)';
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }
    // путь
    if (V.path && sel && !V.anim) drawPath(ctx, sel);
    // наведение
    if (V.hover && !isTouch()) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(V.hover[0] * TILE + 0.5, V.hover[1] * TILE + 0.5, TILE - 1, TILE - 1); }
    drawMini(st, me);
  }
  function drawObject(ctx, st, o, vis) {
    const px = o.x * TILE + 16, py = o.y * TILE + 32;
    const t = O.get(o.type);
    if (o.type === 'town') {
      const tw = st.towns[o.townId];
      Sp.draw(ctx, 'town_' + tw.faction, px, py - 2, 1);
      drawFlag(ctx, px, py - 48, tw.owner >= 0 ? st.players[tw.owner].color : '#999');
      if (tw.owner === st.turn) { const inc = R.townIncome(tw); void inc; }
      return;
    }
    if (o.type === 'mine') { Sp.draw(ctx, 'mine_' + o.res, px, py, 1); drawFlag(ctx, px + 12, py - 26, o.owner >= 0 ? st.players[o.owner].color : '#999', true); return; }
    if (o.type === 'dwelling') { Sp.draw(ctx, 'dwelling_' + Math.min(7, C.get(o.cid).tier), px, py, 1); if (o.owner >= 0) drawFlag(ctx, px + 12, py - 28, st.players[o.owner].color, true); Sp.draw(ctx, o.cid, px - 10, py - 2, 0.5); return; }
    if (o.type === 'monster') { Sp.draw(ctx, o.cid, px, py - 2, 1, false); return; }
    if (o.type === 'resource') { Sp.draw(ctx, 'res_' + o.res, px, py - 8, 1); return; }
    if (o.type === 'artifact') { Sp.draw(ctx, 'artifact', px, py - 8, 1); return; }
    if (t.bank && o.empty) { ctx.globalAlpha = 0.55; Sp.draw(ctx, t.sprite, px, py, 1); ctx.globalAlpha = 1; return; }
    if (t.sprite) Sp.draw(ctx, t.sprite, px, py, 1);
  }
  function drawFlag(ctx, x, y, color, small) {
    const h = small ? 6 : 9, w = small ? 5 : 7;
    ctx.fillStyle = '#2a1a10'; ctx.fillRect(Math.round(x), Math.round(y), 1, h + 3);
    ctx.fillStyle = color; ctx.fillRect(Math.round(x) + 1, Math.round(y), w, h - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(Math.round(x) + 1, Math.round(y), w, 1);
  }
  function drawHero(ctx, st, h, px, py) {
    const color = st.players[h.owner].color;
    const x = px * TILE + 16, y = py * TILE + 30;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
    Sp.draw(ctx, 'hero_' + h.cls, x, y, 1, h.facing === 'l', { b: color });
    drawFlag(ctx, x + (h.facing === 'l' ? -13 : 8), y - 30, color, true);
    if (h.owner === st.turn && h.move <= 0 && !V.anim) { ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x - 8, y + 1, 16, 2); }
  }
  function drawPath(ctx, sel) {
    const p = V.path; if (!p || !p.length) return;
    let prev = [sel.x, sel.y];
    for (let i = 0; i < p.length; i++) {
      const s = p[i], cx = s.x * TILE + 16, cy = s.y * TILE + 16;
      const col = s.turn === 0 ? '#9be07f' : s.turn === 1 ? '#f1cf74' : '#ff9a7a';
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.moveTo(prev[0] * TILE + 16, prev[1] * TILE + 16); ctx.lineTo(cx, cy); ctx.stroke(); ctx.globalAlpha = 1;
      const last = i === p.length - 1, turnEdge = i > 0 && p[i - 1].turn !== s.turn;
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, last ? 6 : 3, 0, Math.PI * 2); ctx.fill();
      if (last || turnEdge) { ctx.fillStyle = '#000'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(s.turn + 1), cx, cy + 3); }
      prev = [s.x, s.y];
    }
    if (V.pending && isTouch()) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(V.pending[0] * TILE + 2, V.pending[1] * TILE + 2, TILE - 4, TILE - 4); }
  }
  function drawMini(st, me) {
    if (!V.miniDirty && V.miniFrame === st.day + ':' + Object.keys(st.objects).length + ':' + me) { /* перерисовываем кадр вьюпорта */ }
    T.renderMini(st, me, V.miniCanvas);
    const mc = V.mini, mctx = mc.getContext('2d');
    mctx.imageSmoothingEnabled = false;
    mctx.fillStyle = '#000'; mctx.fillRect(0, 0, mc.width, mc.height);
    const scale = Math.min(mc.width / st.map.w, mc.height / st.map.h);
    mctx.drawImage(V.miniCanvas, 0, 0, st.map.w * scale, st.map.h * scale);
    const z = V.cam.z;
    mctx.strokeStyle = '#fff'; mctx.lineWidth = 1;
    mctx.strokeRect(V.cam.x / TILE * scale, V.cam.y / TILE * scale, V.w / z / TILE * scale, V.h / z / TILE * scale);
  }

  /* ---------- боковая панель ---------- */
  function renderSidebar() {
    const st = V.state, G = H3.Game; if (!st) return;
    const p = st.players[st.turn];
    const inc = p.income || S.playerIncome(st, p.id);
    UI.$('#resbar').innerHTML = U.RES.map(r => '<span title="' + UI.esc(O.RES_NAMES[r]) + ': +' + (inc[r] || 0) + ' в день">' + UI.resIcon(r) + '<b>' + U.fmt(p.res[r]) + '</b></span>').join('') + '<span class="muted" title="Доход в день">' + UI.icon('ic_day') + '+' + U.fmt(inc.gold) + '</span>';
    UI.$('#datebar').textContent = S.dateStr(st.day) + (p.daysWithoutTown ? ' · без города: ' + p.daysWithoutTown + '/7' : '');
    const sel = G.selected();
    const hp = UI.$('#heroPanel');
    if (sel) {
      const pr = R.heroPrimary(sel), mor = R.heroMorale(sel), luck = R.heroLuck(sel), mm = R.heroMaxMove(sel), mana = R.heroMaxMana(sel);
      const xpNow = sel.xp - H3.Heroes.xpForLevel(sel.level), xpNeed = H3.Heroes.xpForLevel(sel.level + 1) - H3.Heroes.xpForLevel(sel.level);
      hp.innerHTML = '<div class="hp-head">' + UI.heroPortrait(sel, 2) + '<div class="grow"><b class="w">' + UI.esc(sel.name) + '</b><br><span class="muted">' + UI.esc(H3.Heroes.getClass(sel.cls).name) + ', ' + sel.level + ' ур.</span>'
        + '<div class="bar xp" title="Опыт ' + sel.xp + ' / ' + H3.Heroes.xpForLevel(sel.level + 1) + '"><div style="width:' + Math.round(100 * xpNow / xpNeed) + '%"></div></div></div></div>'
        + '<div class="stats4"><div title="Атака">' + UI.icon('ic_att') + '<b>' + pr.att + '</b></div><div title="Защита">' + UI.icon('ic_def') + '<b>' + pr.def + '</b></div><div title="Сила магии">' + UI.icon('ic_pow') + '<b>' + pr.pow + '</b></div><div title="Знание">' + UI.icon('ic_kno') + '<b>' + pr.kno + '</b></div></div>'
        + '<div class="row sp small" style="margin-top:3px"><span title="Мораль">' + UI.icon('ic_morale') + ' ' + (mor.value > 0 ? '+' : '') + mor.value + '</span><span title="Удача">' + UI.icon('ic_luck') + ' ' + (luck.value > 0 ? '+' : '') + luck.value + '</span><span title="Очки движения">' + UI.icon('ic_move') + ' ' + Math.round(sel.move) + '/' + mm + '</span><span title="Мана">' + UI.icon('ic_mana') + ' ' + sel.mana + '/' + mana + '</span></div>'
        + '<div class="bar"><div style="width:' + Math.round(100 * sel.move / mm) + '%"></div></div>' + UI.armyHtml(sel.army);
      hp.onclick = () => G.openHero(sel);
    } else { hp.innerHTML = '<div class="muted center" style="padding:30px 0">Выберите героя или город</div>'; hp.onclick = null; }
    // список героев и городов
    const ol = UI.$('#objList'); ol.innerHTML = '';
    for (const h of S.heroesOf(st, p.id)) {
      const d = UI.el('div', 'obj' + (sel && sel.id === h.id ? ' sel' : '') + (h.move < 100 ? ' done' : ''), UI.icon(h.portrait, 1)); d.title = h.name + ' (' + Math.round(h.move) + ' очков движения)';
      d.onclick = () => { G.selectHero(h.id); centerOn(h.x, h.y); }; d.ondblclick = () => G.openHero(h); ol.appendChild(d);
    }
    for (const t of S.townsOf(st, p.id)) {
      const d = UI.el('div', 'obj' + (t.builtToday ? ' done' : ''), UI.icon('town_' + t.faction, 1)); d.title = t.name + (t.builtToday ? ' (сегодня уже строили)' : '');
      d.onclick = () => { centerOn(t.x, t.y); G.openTown(t); }; ol.appendChild(d);
    }
    const ab = UI.$('#advButtons'); ab.innerHTML = '';
    const btn = (label, fn, cls, title) => { const b = UI.el('button', cls || '', label); b.onclick = () => { H3.Audio.play('click'); fn(); }; if (title) b.title = title; ab.appendChild(b); return b; };
    btn(UI.icon('ic_end_turn') + ' Конец хода (E)', () => G.endTurn(), 'primary wide');
    btn(UI.icon('ic_hero') + ' Герой (H)', () => G.nextHero(), '', 'Следующий герой');
    const town = sel && H3.Adventure.townOfHero(st, sel);
    btn(UI.icon('ic_town') + ' Город (T)', () => { const t = town || S.townsOf(st, p.id)[0]; if (t) G.openTown(t); }, '', 'Открыть город');
    btn(UI.icon('ic_spellbook') + ' Магия (C)', () => G.openSpellbook(), '', 'Книга заклинаний');
    btn(UI.icon('ic_save') + ' Меню', () => G.openMenu(), '', 'Сохранить, загрузить, настройки');
    const lg = UI.$('#log'); lg.innerHTML = st.log.filter(l => l.p === undefined || l.p === -1 || l.p === st.turn).slice(-40).map(l => '<div class="' + l.cls + '">' + UI.esc(l.text) + '</div>').join(''); lg.scrollTop = lg.scrollHeight;
    V.dirty = true;
  }

  H3.AdvView = { init, setState, invalidate, resize, centerOn, animateMove, renderSidebar, previewPath, V, describe, drawFlag };
})(typeof window !== 'undefined' ? window : globalThis);
