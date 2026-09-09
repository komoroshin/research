/* ============================================================================
   view/adventure.js — карта приключений: рендер (canvas), камера, ввод,
   предпросмотр пути, анимация движения, миникарта, боковая панель.
   Действия делегируются H3.Game (main.js).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, O = H3.Objects, Sp = H3.Sprites, An = H3.Anim, T = H3.Terrain, UI = H3.UI, PF = H3.Pathfind, F = H3.Factions, AR = H3.Artifacts;
  const TILE = 32;

  const V = {
    canvas: null, ctx: null, mini: null, state: null, mapCanvas: [null, null], miniCanvas: null, layer: 0,
    cam: { x: 0, y: 0, z: 1.5 }, dirty: true, hover: null, pending: null, path: null, pf: null, pfHero: null,
    anim: null, drag: null, w: 0, h: 0, dpr: 1, lastTime: 0, busy: false, tipTimer: null,
    fx: null, ts: 0, water: [null, null],
  };
  const rnd = (a, b) => a + Math.random() * (b - a);
  // сколько «ночи» в каждом дне недели: окна светятся вечером и ранним утром
  const NIGHT = [0.45, 0.1, 0, 0, 0, 0.55, 0.95];

  function init() {
    V.canvas = UI.$('#mapCanvas'); V.ctx = V.canvas.getContext('2d'); V.mini = UI.$('#minimap');
    window.addEventListener('resize', resize);
    const c = V.canvas;
    c.addEventListener('pointerdown', onDown); c.addEventListener('pointermove', onMove); c.addEventListener('pointerup', onUp); c.addEventListener('pointercancel', () => { V.drag = null; });
    c.addEventListener('pointerleave', () => { V.hover = null; if (!isTouch()) { V.path = null; } UI.hideTip(); V.dirty = true; });
    c.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1 : -1, e.offsetX, e.offsetY); }, { passive: false });
    c.addEventListener('contextmenu', e => { e.preventDefault(); const t = tileAt(e.offsetX, e.offsetY); if (t) showInfo(t[0], t[1]); });
    V.mini.addEventListener('pointerdown', e => { const r = V.mini.getBoundingClientRect(); const m = S.lvl(V.state, V.layer); const x = (e.clientX - r.left) / r.width * m.w, y = (e.clientY - r.top) / r.height * m.h; centerOn(x, y); });
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
    V.state = state; V.layer = 0; V.mapCanvas = [T.renderMap(state, 0), null]; V.miniCanvas = document.createElement('canvas');
    if (V.miniOpen === undefined) toggleMini(window.innerWidth >= 900);
    V.pf = null; V.pfHero = null; V.path = null; V.pending = null; V.anim = null;
    V.fx = H3.Fx.scene(); V.water = [null, null];
    resize(); V.dirty = true;
  }
  function invalidate() { V.pf = null; V.dirty = true; }
  /** Полотно слоя рисуется лениво: подземелье — только когда туда спустились. */
  function layerCanvas(z) {
    if (!V.mapCanvas[z]) V.mapCanvas[z] = T.renderMap(V.state, z);
    return V.mapCanvas[z];
  }
  /** Показать слой z (0 — поверхность, 1 — подземелье). */
  function setLayer(z) {
    z = z ? 1 : 0;
    if (V.layer === z) return;
    V.layer = z; V.pf = null; V.path = null; V.dirty = true;
    clampCam();
  }
  function clampCam() {
    if (!V.state) return;
    const m = S.lvl(V.state, V.layer), z = V.cam.z;
    const maxX = Math.max(0, m.w * TILE - V.w / z), maxY = Math.max(0, m.h * TILE - V.h / z);
    V.cam.x = U.clamp(V.cam.x, 0, maxX); V.cam.y = U.clamp(V.cam.y, 0, maxY);
  }
  /** Высота панелей HUD сверху и снизу: центрируем в видимой между ними части карты. */
  function pads() { const t = UI.$('#hudTop'), b = UI.$('#hudBottom'); return { top: t ? t.offsetHeight : 0, bottom: b ? b.offsetHeight : 0 }; }
  function centerOn(tx, ty) { const p = pads(); V.cam.x = (tx + 0.5) * TILE - V.w / V.cam.z / 2; V.cam.y = (ty + 0.5) * TILE - (V.h - p.top - p.bottom) / V.cam.z / 2 - p.top / V.cam.z; clampCam(); V.dirty = true; }
  function zoomAt(dir, px, py) {
    const levels = [1, 1.5, 2, 3]; let i = levels.indexOf(V.cam.z); if (i < 0) i = 1;
    i = U.clamp(i + dir, 0, levels.length - 1); const nz = levels[i]; if (nz === V.cam.z) return;
    const wx = V.cam.x + px / V.cam.z, wy = V.cam.y + py / V.cam.z;
    V.cam.z = nz; V.cam.x = wx - px / nz; V.cam.y = wy - py / nz; clampCam(); V.dirty = true;
  }
  function tileAt(px, py) {
    const x = Math.floor((V.cam.x + px / V.cam.z) / TILE), y = Math.floor((V.cam.y + py / V.cam.z) / TILE);
    return S.inMap(V.state, x, y, V.layer) ? [x, y] : null;
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
    const hero = S.heroAt(st, x, y, V.layer), town = S.townAt(st, x, y, V.layer);
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
    const st = V.state, vis = S.visible(st, st.turn, x, y, V.layer);
    if (!vis) return '<b>Неизведанно</b>';
    const parts = [];
    const obj = S.objAt(st, x, y, V.layer), hero = S.heroAt(st, x, y, V.layer);
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
      else if (!t.obstacle) { let s = '<b>' + UI.esc(t.name) + '</b>'; const qd = H3.Quest.describe(obj); if (qd) s += '<br><span class="muted">' + UI.esc(qd) + '</span>'; else if (t.desc) s += '<br><span class="muted">' + UI.esc(t.desc) + '</span>'; const sel = H3.Game.selected(); if (sel && obj.visited && obj.visited['h' + sel.id]) s += '<br><i>уже посещали</i>'; parts.push(s); }
      else parts.push('<b>' + UI.esc(t.name) + '</b>');
    }
    if (!parts.length) parts.push('<b>' + UI.esc(R.TERRAIN_NAMES[S.terrainAt(st, x, y, V.layer)]) + '</b>' + (S.lvl(st, V.layer).road[S.idx(st, x, y, V.layer)] ? ' (дорога)' : ''));
    if (V.path && V.path.length) { const last = V.path[V.path.length - 1]; parts.push('<span class="small muted">Путь: ' + (last.turn === 0 ? 'сегодня' : 'через ' + last.turn + ' ' + U.plural(last.turn, 'ход', 'хода', 'ходов')) + '</span>'); }
    return parts.join('<br>');
  }
  function powerWord(v) { return v < 2000 ? 'слабая' : v < 8000 ? 'умеренная' : v < 25000 ? 'сильная' : v < 80000 ? 'очень сильная' : 'огромная'; }
  function showInfo(x, y) {
    const st = V.state; const obj = S.objAt(st, x, y, V.layer), hero = S.heroAt(st, x, y, V.layer);
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
    const z = V.cam.z, px = (tx + 0.5) * TILE, py = (ty + 0.5) * TILE, p = pads();
    const margin = 2 * TILE;
    if (px < V.cam.x + margin || px > V.cam.x + V.w / z - margin || py < V.cam.y + p.top / z + margin || py > V.cam.y + (V.h - p.bottom) / z - margin) centerOn(tx, ty);
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
    V.ts = ts;
    if (V.fx) { V.fx.update(dt); ambient(dt); }
    // idle-анимация требует перерисовки и без событий; вне движения — 30 к/с
    if (V.dirty || V.anim) { draw(ts); V.dirty = false; V.lastDraw = ts; }
    else if (ts - (V.lastDraw || 0) >= 33) { draw(ts); V.lastDraw = ts; }
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
    const st = V.state, ctx = V.ctx, m = S.lvl(st, V.layer), z = V.cam.z, dpr = V.dpr;
    const me = st.turn, vis = st.players[me].vis[V.layer];
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, V.canvas.width, V.canvas.height);
    ctx.setTransform(z * dpr, 0, 0, z * dpr, -Math.round(V.cam.x * z * dpr), -Math.round(V.cam.y * z * dpr));
    ctx.imageSmoothingEnabled = false;
    const x0 = Math.max(0, Math.floor(V.cam.x / TILE) - 1), y0 = Math.max(0, Math.floor(V.cam.y / TILE) - 2);
    const x1 = Math.min(m.w - 1, Math.ceil((V.cam.x + V.w / z) / TILE) + 1), y1 = Math.min(m.h - 1, Math.ceil((V.cam.y + V.h / z) / TILE) + 2);
    // местность
    ctx.drawImage(layerCanvas(V.layer), x0 * TILE, y0 * TILE, (x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE, x0 * TILE, y0 * TILE, (x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE);
    drawWater(ctx, m, vis, x0, y0, x1, y1, ts);
    V.view = { x0, y0, x1, y1 };
    // выделение героя
    const sel = H3.Game.selected();
    if (sel && !sel.dead && (sel.z || 0) === V.layer) { const [hx, hy] = heroDrawPos(sel); ctx.strokeStyle = 'rgba(241,207,116,' + (0.6 + 0.3 * Math.sin(ts / 200)) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(hx * TILE + 16, hy * TILE + 26, 13, 6, 0, 0, Math.PI * 2); ctx.stroke(); }
    // объекты и герои по рядам
    const items = [];
    for (const id in st.objects) { const o = st.objects[id]; if ((o.z || 0) !== V.layer) continue; if (o.x < x0 - 2 || o.x > x1 + 2 || o.y < y0 || o.y > y1 + 2) continue; if (!vis[o.y * m.w + o.x]) continue; items.push({ y: o.y, x: o.x, o }); }
    for (const id in st.heroes) { const h = st.heroes[id]; if (h.dead || (h.z || 0) !== V.layer) continue; if (h.owner !== me && vis[h.y * m.w + h.x] !== 2) continue; if (h.inTown && h.owner !== me) continue; const [px, py] = heroDrawPos(h); if (px < x0 - 1 || px > x1 + 1 || py < y0 - 1 || py > y1 + 1) continue; items.push({ y: py + 0.01, x: px, h, px, py }); }
    items.sort((a, b) => a.y - b.y);
    for (const it of items) {
      if (it.o) drawObject(ctx, st, it.o, vis, ts);
      else drawHero(ctx, st, it.h, it.px, it.py, ts);
    }
    if (V.fx) V.fx.drawOver(ctx, 0, 0);
    // свет дня: неделя проживается от прохладного утра к закату (под землёй неба нет)
    if (!V.layer) T.applyDaylight(ctx, st.day, x0 * TILE, y0 * TILE, (x1 - x0 + 1) * TILE, (y1 - y0 + 1) * TILE);
    drawLights(ctx, st, items, ts);
    // туман: маска в один пиксель на клетку, растянутая со сглаживанием —
    // граница разведанного получается мягкой, а не лесенкой из квадратов
    drawFog(ctx, st, vis, x0, y0, x1, y1);
    // путь
    if (V.path && sel && !V.anim) drawPath(ctx, sel);
    // наведение
    if (V.hover && !isTouch()) { ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(V.hover[0] * TILE + 0.5, V.hover[1] * TILE + 0.5, TILE - 1, TILE - 1); }
    drawMini(st, me);
  }
  /** Туман войны мягкой маской (1 px на клетку → растяжение со сглаживанием). */
  function drawFog(ctx, st, vis, x0, y0, x1, y1) {
    const m = S.lvl(st, V.layer), w = x1 - x0 + 3, h = y1 - y0 + 3;
    let cv = V.fogCanvas;
    if (!cv) { cv = V.fogCanvas = document.createElement('canvas'); }
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const fc = cv.getContext('2d'), img = fc.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const mx = x0 - 1 + x, my = y0 - 1 + y;
      const v = (mx < 0 || my < 0 || mx >= m.w || my >= m.h) ? 0 : vis[my * m.w + mx];
      d[(y * w + x) * 4 + 3] = v === 2 ? 0 : v === 1 ? 110 : 255;
    }
    fc.putImageData(img, 0, 0);
    const prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
    // центр каждого пикселя маски попадает в центр своей клетки
    ctx.drawImage(cv, (x0 - 1) * TILE, (y0 - 1) * TILE, w * TILE, h * TILE);
    ctx.imageSmoothingEnabled = prev;
  }
  function drawObject(ctx, st, o, vis, ts) {
    const px = o.x * TILE + 16, py = o.y * TILE + 32;
    const t = O.get(o.type);
    if (o.type === 'town') {
      const tw = st.towns[o.townId];
      Sp.draw(ctx, 'town_' + tw.faction, px, py - 2, 1);
      drawFlag(ctx, px, py - 48, tw.owner >= 0 ? st.players[tw.owner].color : '#999');
      return;
    }
    if (o.type === 'mine') { Sp.draw(ctx, 'mine_' + o.res, px, py, 1); drawFlag(ctx, px + 12, py - 26, o.owner >= 0 ? st.players[o.owner].color : '#999', true); return; }
    if (o.type === 'dwelling') { Sp.draw(ctx, 'dwelling_' + Math.min(7, C.get(o.cid).tier), px, py, 1); if (o.owner >= 0) drawFlag(ctx, px + 12, py - 28, st.players[o.owner].color, true); An.draw(ctx, o.cid, px - 10, py - 2, 0.5, false, creatureIdle(o.cid, o.id, ts)); return; }
    if (o.type === 'monster') { An.draw(ctx, o.cid, px, py - 2, 1, false, creatureIdle(o.cid, o.id, ts)); return; }
    if (o.type === 'resource') { Sp.draw(ctx, 'res_' + o.res, px, py - 8, 1); return; }
    if (o.type === 'artifact') { Sp.draw(ctx, 'artifact', px, py - 8, 1); return; }
    if (t.bank && o.empty) { ctx.globalAlpha = 0.55; Sp.draw(ctx, t.sprite, px, py, 1); ctx.globalAlpha = 1; return; }
    if (o.type === 'keymaster' || o.type === 'border_guard') { const kc = H3.Quest.KEY_COLORS[o.color]; Sp.draw(ctx, t.sprite, px, py, 1, false, kc ? { r: kc.hex } : undefined); return; }
    if (t.sprite) Sp.draw(ctx, t.sprite, px, py, 1);
  }
  /** Покой существа на карте: дыхание, у летающих — парение. */
  function creatureIdle(cid, key, ts) {
    return { t: ts, phase: An.phaseOf(key + ':' + cid), flying: C.isFlyer(C.get(cid)) };
  }
  function drawFlag(ctx, x, y, color, small) {
    const h = small ? 6 : 9, w = small ? 5 : 7;
    x = Math.round(x); y = Math.round(y);
    ctx.fillStyle = '#2a1a10'; ctx.fillRect(x, y, 1, h + 3);
    // полотнище полощется: каждый столбец сдвинут по синусоиде, дальше от древка — сильнее
    const ph = (x * 0.37 + y * 0.11), t = V.ts / 140;
    ctx.fillStyle = color;
    for (let i = 0; i < w; i++) { const dy = Math.round(Math.sin(t + ph + i * 0.9) * (i / w) * 1.6); ctx.fillRect(x + 1 + i, y + dy, 1, h - 2); }
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < w; i++) { const dy = Math.round(Math.sin(t + ph + i * 0.9) * (i / w) * 1.6); ctx.fillRect(x + 1 + i, y + dy, 1, 1); }
  }
  /* ---------- живая карта: вода, окружение, дым, огни ---------- */
  /** Индексы водных клеток слоя — считаются один раз. */
  function waterTiles(m, z) {
    if (V.water[z] && V.water[z].m === m) return V.water[z].list;
    const list = [];
    for (let i = 0; i < m.terrain.length; i++) if (m.terrain[i] === R.TERRAIN_INDEX.water) list.push(i);
    V.water[z] = { m, list };
    return list;
  }
  /** Блики на воде: короткие светлые штрихи бегут по клетке. */
  function drawWater(ctx, m, vis, x0, y0, x1, y1, ts) {
    const list = waterTiles(m, V.layer); if (!list.length) return;
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    const t = ts / 1400;
    for (const i of list) {
      const x = i % m.w, y = (i - x) / m.w;
      if (x < x0 || x > x1 || y < y0 || y > y1 || !vis[i]) continue;
      const ph = (x * 0.61 + y * 0.37);
      for (let k = 0; k < 2; k++) {
        const f = (t + ph + k * 0.5) % 1;
        const gx = x * TILE + f * (TILE - 8), gy = y * TILE + 6 + ((x * 7 + y * 5 + k * 9) % 18);
        const len = 4 + Math.sin((t + ph) * Math.PI * 2 + k) * 2;
        ctx.globalAlpha = 0.18 + 0.18 * Math.sin(f * Math.PI);
        ctx.fillRect(Math.round(gx), Math.round(gy), Math.round(len), 1);
      }
    }
    ctx.globalAlpha = 1;
  }
  /** Окружение по местности под камерой + дым над городами и шахтами. */
  function ambient(dt) {
    const st = V.state, fx = V.fx, view = V.view; if (!st || !view || !fx || H3.Game.settings().animSpeed === 0) return;
    if (fx.S.p.length > 260) return;
    const m = S.lvl(st, V.layer), vis = st.players[st.turn].vis[V.layer];
    const k = dt / 1000, W = (view.x1 - view.x0 + 1) * TILE, X0 = view.x0 * TILE, Y0 = view.y0 * TILE, H = (view.y1 - view.y0 + 1) * TILE;
    // считаем, какая местность в кадре преобладает, по случайной выборке клеток
    let snow = 0, lava = 0, swamp = 0, sand = 0, grass = 0, n = 0;
    for (let i = 0; i < 12; i++) {
      const x = view.x0 + Math.floor(Math.random() * (view.x1 - view.x0 + 1)), y = view.y0 + Math.floor(Math.random() * (view.y1 - view.y0 + 1));
      const idx = y * m.w + x; if (!vis[idx]) continue; n++;
      const t = R.TERRAINS[m.terrain[idx]];
      if (t === 'snow') snow++; else if (t === 'lava') lava++; else if (t === 'swamp') swamp++; else if (t === 'sand') sand++; else if (t === 'grass' || t === 'dirt') grass++;
    }
    if (!n) return;
    const area = W * H / (640 * 480);
    const chance = per => Math.random() < per * k * area;
    if (snow && chance(40 * snow / n)) fx.add({ x: rnd(X0, X0 + W), y: Y0 - 4, vx: rnd(-8, 8), vy: rnd(18, 34), ax: 0, ay: 0, ttl: 14000, life: 0, size: rnd(0.8, 1.6), color: 'rgba(255,255,255,0.85)', shape: 'dot', shrink: false, fade: false, sway: true });
    if (lava && chance(18 * lava / n)) { const x = rnd(X0, X0 + W), y = rnd(Y0, Y0 + H); const ti = Math.floor(y / TILE) * m.w + Math.floor(x / TILE); if (R.TERRAINS[m.terrain[ti]] === 'lava' && vis[ti]) fx.add({ x, y, vx: rnd(-4, 4), vy: -rnd(8, 18), ax: 0, ay: 0, ttl: 2500, life: 0, size: rnd(0.8, 1.5), color: ['#ff9a3a', '#ff5a1f', '#f2d34c'][Math.floor(Math.random() * 3)], shape: 'dot', glow: true, shrink: true, sway: true }); }
    if (swamp && chance(3 * swamp / n)) { const x = rnd(X0, X0 + W), y = rnd(Y0, Y0 + H); const ti = Math.floor(y / TILE) * m.w + Math.floor(x / TILE); if (R.TERRAINS[m.terrain[ti]] === 'swamp' && vis[ti]) fx.add({ x, y, vx: rnd(2, 6), vy: 0, ax: 0, ay: 0, ttl: 7000, life: 0, size: rnd(10, 18), color: 'rgba(170,200,160,0.2)', shape: 'puff', grow: 0.5 }); }
    if (sand && chance(8 * sand / n)) { const y = rnd(Y0, Y0 + H); const ti = Math.floor(y / TILE) * m.w + Math.floor((X0 + 2) / TILE); if (vis[ti]) fx.add({ x: X0 - 4, y, vx: rnd(40, 70), vy: rnd(-2, 2), ax: 0, ay: 0, ttl: 6000, life: 0, size: 1.2, color: 'rgba(240,220,160,0.55)', shape: 'spark', shrink: false, fade: false }); }
    if (grass && chance(2.5 * grass / n)) fx.add({ x: rnd(X0, X0 + W), y: Y0 - 4, vx: rnd(6, 16), vy: rnd(14, 24), ax: 0, ay: 0, ttl: 14000, life: 0, size: rnd(1.2, 2), color: ['#5cb84a', '#a67c1c', '#e8792b'][Math.floor(Math.random() * 3)], shape: 'square', shrink: false, fade: false, sway: true });
    // дым из труб: города и шахты в кадре
    for (const id in st.objects) {
      const o = st.objects[id]; if ((o.z || 0) !== V.layer) continue;
      if (o.type !== 'town' && o.type !== 'mine') continue;
      if (o.x < view.x0 || o.x > view.x1 || o.y < view.y0 || o.y > view.y1 || !vis[o.y * m.w + o.x]) continue;
      if (!chance(o.type === 'town' ? 6 : 2.5)) continue;
      const px = o.x * TILE + 16, py = o.y * TILE + 32;
      const [sx, sy] = o.type === 'town' ? [px - 6 + rnd(-2, 2), py - 42] : [px + 7, py - 22];
      fx.add({ x: sx, y: sy, vx: rnd(3, 8), vy: -rnd(6, 12), ax: 0, ay: 0, ttl: 2600, life: 0, size: rnd(2, 3.5), color: 'rgba(200,200,210,0.32)', shape: 'puff', grow: 1.6 });
    }
    fx.S.bounds = { w: m.w * TILE, h: m.h * TILE };
  }
  /** Вечером и ранним утром в окнах городов и жилищ загорается свет. */
  function drawLights(ctx, st, items, ts) {
    if (V.layer) return;
    const night = NIGHT[(st.day - 1) % 7]; if (!night) return;
    const flick = 0.85 + 0.15 * Math.sin(ts / 170);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const it of items) {
      const o = it.o; if (!o) continue;
      let spots = null;
      const px = o.x * TILE + 16, py = o.y * TILE + 32;
      if (o.type === 'town') spots = [[px - 12, py - 26], [px + 10, py - 30], [px - 2, py - 18], [px + 16, py - 14]];
      else if (o.type === 'dwelling' || o.type === 'tavern' || o.type === 'witch_hut' || o.type === 'seer_hut') spots = [[px - 4, py - 12], [px + 5, py - 10]];
      else if (o.type === 'mine') spots = [[px + 1, py - 8]];
      else if (o.type === 'keymaster') spots = [[px, py - 8]];
      if (!spots) continue;
      for (const [x, y] of spots) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, 'rgba(255,200,110,' + (0.85 * night * flick).toFixed(2) + ')'); g.addColorStop(1, 'rgba(255,160,60,0)');
        ctx.fillStyle = g; ctx.fillRect(x - 12, y - 12, 24, 24);
        ctx.fillStyle = 'rgba(255,240,180,' + (0.95 * night).toFixed(2) + ')'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 2);
      }
    }
    ctx.restore();
  }
  function drawHero(ctx, st, h, px, py, ts) {
    const color = st.players[h.owner].color;
    const x = px * TILE + 16, y = py * TILE + 30;
    const walking = !!(V.anim && V.anim.hero.id === h.id);
    const a = An.state({ t: ts, phase: An.phaseOf(h.id), dir: h.facing === 'l' ? -1 : 1, moving: walking });
    if (h.boat) {
      // под парусом: герой стоит в лодке, лодка покачивается на волне
      const bob = Math.sin(ts / 520 + An.phaseOf(h.id)) * 1.5;
      Sp.draw(ctx, 'boat', x, y + 4 + bob, 1, h.facing === 'l');
      An.draw(ctx, 'hero_' + h.cls, x, y - 4 + bob, 1, h.facing === 'l', { st: An.state({ t: ts, phase: An.phaseOf(h.id), idle: true }) }, { b: color });
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y, 11 - Math.max(0, -a.dy) * 0.25, 4, 0, 0, Math.PI * 2); ctx.fill();
      An.draw(ctx, 'hero_' + h.cls, x, y, 1, h.facing === 'l', { st: a }, { b: color });
    }
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
    if (!V.miniOpen) return;
    if (!V.miniDirty && V.miniFrame === st.day + ':' + Object.keys(st.objects).length + ':' + me) { /* перерисовываем кадр вьюпорта */ }
    T.renderMini(st, me, V.miniCanvas, V.layer);
    const mc = V.mini, mctx = mc.getContext('2d');
    const m = S.lvl(st, V.layer);
    mctx.imageSmoothingEnabled = false;
    mctx.fillStyle = '#000'; mctx.fillRect(0, 0, mc.width, mc.height);
    const scale = Math.min(mc.width / m.w, mc.height / m.h);
    mctx.drawImage(V.miniCanvas, 0, 0, m.w * scale, m.h * scale);
    if (V.layer) { // подпись слоя, чтобы не путаться, где находишься
      mctx.fillStyle = 'rgba(0,0,0,0.55)'; mctx.fillRect(0, 0, 62, 13);
      mctx.fillStyle = '#e0c070'; mctx.font = '10px sans-serif'; mctx.fillText('подземелье', 3, 10);
    }
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
    UI.$('#datebar').textContent = S.dateStr(st.day) + ' · ' + T.daylight(st.day).name + (p.daysWithoutTown ? ' · без города: ' + p.daysWithoutTown + '/7' : '');
    const sel = G.selected();
    const hp = UI.$('#heroPanel');
    if (sel) {
      const pr = R.heroPrimary(sel), mm = R.heroMaxMove(sel), mana = R.heroMaxMana(sel);
      hp.innerHTML = '<div class="hp-head">' + UI.heroPortrait(sel, 2) + '<div class="grow"><b class="w">' + UI.esc(sel.name) + '</b> <span class="muted">' + sel.level + ' ур.</span>'
        + '<div class="hp-stats"><span title="Атака">' + UI.icon('ic_att') + pr.att + '</span><span title="Защита">' + UI.icon('ic_def') + pr.def + '</span><span title="Сила магии">' + UI.icon('ic_pow') + pr.pow + '</span><span title="Знание">' + UI.icon('ic_kno') + pr.kno + '</span><span title="Мана">' + UI.icon('ic_mana') + sel.mana + '/' + mana + '</span><span title="Ход">' + UI.icon('ic_move') + Math.round(sel.move) + '</span></div>'
        + '<div class="bar" title="Очки движения ' + Math.round(sel.move) + ' / ' + mm + '"><div style="width:' + Math.round(100 * sel.move / mm) + '%"></div></div></div></div>'
        + UI.armyHtml(sel.army);
      hp.onclick = () => G.openHero(sel);
    } else { hp.innerHTML = '<div class="muted center small">Выбери героя или город</div>'; hp.onclick = null; }
    // лента героев и городов: портрет + полоска хода
    const ol = UI.$('#objList'); ol.innerHTML = '';
    for (const h of S.heroesOf(st, p.id)) {
      const d = UI.el('div', 'obj' + (sel && sel.id === h.id ? ' sel' : '') + (h.move < 100 ? ' done' : ''), UI.icon(h.portrait, 1) + '<div class="bar"><div style="width:' + Math.round(100 * h.move / R.heroMaxMove(h)) + '%"></div></div>'); d.title = h.name + ' (' + Math.round(h.move) + ' очков движения)';
      d.onclick = () => { if (sel && sel.id === h.id) { G.openHero(h); return; } G.selectHero(h.id); centerOn(h.x, h.y); }; ol.appendChild(d);
    }
    for (const t of S.townsOf(st, p.id)) {
      const d = UI.el('div', 'obj' + (t.builtToday ? ' done' : ''), UI.icon('town_' + t.faction, 1)); d.title = t.name + (t.builtToday ? ' (сегодня уже строили)' : '');
      d.onclick = () => { centerOn(t.x, t.y); G.openTown(t); }; ol.appendChild(d);
    }
    const ab = UI.$('#advButtons'); ab.innerHTML = '';
    const btn = (label, fn, cls, title) => { const b = UI.el('button', cls || '', label); b.onclick = () => { H3.Audio.play('click'); fn(); }; if (title) b.title = title; ab.appendChild(b); return b; };
    btn(UI.icon('ic_end_turn') + '<span class="lbl"> Конец хода</span>', () => G.endTurn(), 'primary wide', 'Конец хода (E)');
    btn(UI.icon('ic_hero'), () => G.nextHero(), '', 'Следующий герой (H)');
    const town = sel && H3.Adventure.townOfHero(st, sel);
    btn(UI.icon('ic_town'), () => { const t = town || S.townsOf(st, p.id)[0]; if (t) G.openTown(t); }, '', 'Город (T)');
    btn(UI.icon('ic_spellbook'), () => G.openSpellbook(), '', 'Книга заклинаний (C)');
    btn(UI.icon('ic_flag'), () => toggleMini(), V.miniOpen ? 'on' : '', 'Карта и журнал (M)');
    btn(UI.icon('ic_save'), () => G.openMenu(), '', 'Меню');
    const lg = UI.$('#log'); lg.innerHTML = st.log.filter(l => l.p === undefined || l.p === -1 || l.p === st.turn).slice(-40).map(l => '<div class="' + l.cls + '">' + UI.esc(l.text) + '</div>').join(''); lg.scrollTop = lg.scrollHeight;
    V.dirty = true;
  }
  /** Миникарта с журналом — всплывающая панель; на широком экране открыта сразу. */
  function toggleMini(force) {
    V.miniOpen = force === undefined ? !V.miniOpen : !!force;
    UI.$('#miniWrap').classList.toggle('hidden', !V.miniOpen);
    const b = UI.$('#advButtons'); if (b) { const btns = b.querySelectorAll('button'); if (btns[4]) btns[4].classList.toggle('on', V.miniOpen); }
    V.dirty = true;
  }

  H3.AdvView = { init, setState, invalidate, resize, centerOn, setLayer, layerCanvas, animateMove, renderSidebar, previewPath, V, describe, drawFlag, drawObject, toggleMini };
})(typeof window !== 'undefined' ? window : globalThis);
