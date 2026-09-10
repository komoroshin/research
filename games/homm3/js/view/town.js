/* ============================================================================
   view/town.js — экран города: картинка с постройками, стройка, найм,
   гильдия, таверна, рынок, гарнизон и герой-гость.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, F = H3.Factions, B = H3.Buildings, SP = H3.Spells, HE = H3.Heroes, Sp = H3.Sprites, UI = H3.UI, A = H3.Adventure, O = H3.Objects;

  let cur = null; // { town, hero, tab, sel: {army, i} }

  function open(town, tab) {
    return new Promise(resolve => {
      const st = H3.Game.state;
      const hero = town.visiting ? st.heroes[town.visiting] : null;
      cur = { town, hero, tab: tab || 'build', sel: null, split: 0, resolve };
      const wrap = UI.el('div', ''); wrap.id = 'townView';
      const picWrap = UI.el('div', ''); picWrap.id = 'townPicWrap';
      const pic = UI.el('canvas', 'px'); pic.id = 'townPic'; picWrap.appendChild(pic); wrap.appendChild(picWrap);
      // на телефоне сцена шире экрана — показываем её середину
      setTimeout(() => {
        if (picWrap.scrollWidth <= picWrap.clientWidth + 8) return;
        picWrap.scrollLeft = (picWrap.scrollWidth - picWrap.clientWidth) / 2;
        let seen = false; try { seen = !!localStorage.getItem('homm3.hint.townpan'); localStorage.setItem('homm3.hint.townpan', '1'); } catch (e) { /* ignore */ }
        if (!seen) UI.toast('Сцену города можно двигать пальцем ⟷');
      }, 0);
      const below = UI.el('div', ''); below.id = 'townBelow';
      const armies = UI.el('div', 'garr'); armies.id = 'townArmies'; below.appendChild(armies);
      const right = UI.el('div', ''); right.id = 'townRight'; below.appendChild(right);
      wrap.appendChild(below);
      cur.pic = pic; cur.right = right; cur.armies = armies;
      cur.scene = H3.TownScene.create(pic, town);
      const TS = H3.TownScene;
      const at = e => { const r = pic.getBoundingClientRect(); return [(e.clientX - r.left) * TS.W / r.width, (e.clientY - r.top) * TS.H / r.height]; };
      let lastTouch = false, pressTimer = null, pressed = null;
      pic.addEventListener('pointerdown', e => { lastTouch = e.pointerType === 'touch'; pressed = [e.clientX, e.clientY]; if (lastTouch) { clearTimeout(pressTimer); pressTimer = setTimeout(() => { const [x, y] = at(e); const it = cur && cur.scene.hit(x, y); pressed = null; if (it) UI.alert(it.name, itemTip(it), it.sprite); }, 550); } });
      // палец поехал — это панорама сцены, а не тап: двигаем прокрутку сами (если браузер не сделал этого раньше)
      let dragging = null;
      pic.addEventListener('pointermove', e => {
        if (pressed && Math.hypot(e.clientX - pressed[0], e.clientY - pressed[1]) > 8) { clearTimeout(pressTimer); if (lastTouch) dragging = { x: e.clientX, sl: picWrap.scrollLeft, from: pressed[0] }; pressed = null; }
        if (dragging) { picWrap.scrollLeft = dragging.sl - (e.clientX - dragging.from); }
      });
      pic.addEventListener('pointerup', () => { dragging = null; });
      pic.addEventListener('pointerup', () => { clearTimeout(pressTimer); });
      pic.addEventListener('pointercancel', () => { clearTimeout(pressTimer); pressed = null; dragging = null; });
      pic.addEventListener('click', e => { if (!pressed && lastTouch) return; pressed = null; const [x, y] = at(e); if (lastTouch) touchSheet(x, y); else onPicClick(x, y, false); });
      pic.addEventListener('contextmenu', e => { e.preventDefault(); if (lastTouch) return; const [x, y] = at(e); onPicClick(x, y, true); });
      pic.addEventListener('mousemove', e => { const [x, y] = at(e); const hit = cur.scene.hit(x, y); cur.scene.hover = hit; if (hit) UI.tip(e.clientX, e.clientY, itemTip(hit)); else UI.hideTip(); });
      pic.addEventListener('mouseleave', () => { UI.hideTip(); if (cur) cur.scene.hover = null; });
      UI.modal({ title: town.name, titleRight: '<span class="small muted">' + UI.esc(F.get(town.faction).name) + '</span>', html: wrap, wide: true,
        buttons: [{ label: 'Закрыть', cls: 'primary', value: true }], closable: true }).then(() => { UI.hideTip(); if (cur && cur.scene) cur.scene.destroy(); cur = null; resolve(); });
      render();
      // на узком экране сцена шире окна — подсказываем один раз, что её можно двигать
      const loop = ts => { if (!cur || cur.pic !== pic) return; cur.scene.draw(ts); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
  }
  function render() { drawPic(); renderArmies(); renderRight(); }

  /* ---------- картинка ---------- */
  function drawPic() { if (cur && cur.scene) cur.scene.rebuild(); }
  function itemTip(it) {
    let s = '<b>' + UI.esc(it.name) + '</b>';
    if (it.desc) s += '<br>' + UI.esc(it.desc);
    if (it.ghost) s += '<br>' + (it.ghost.ok ? '<span class="green">Клик — построить за</span> ' : '<span class="red">' + UI.esc(it.ghost.reason) + '</span> · ') + UI.costHtml(it.ghost.cost, H3.Game.state.players[cur.town.owner].res);
    else if (it.upgrade) s += '<br><span class="muted">ПКМ — ' + UI.esc(it.upgrade.name) + ': </span>' + UI.costHtml(it.upgrade.cost, H3.Game.state.players[cur.town.owner].res) + (it.upgrade.ok ? '' : ' <span class="red">' + UI.esc(it.upgrade.reason) + '</span>');
    if (it.tab && !it.ghost) s += '<br><span class="muted">клик — ' + ({ build: 'стройка', recruit: 'найм', guild: 'гильдия', tavern: 'таверна', market: 'рынок', smith: 'кузница' })[it.tab] + '</span>';
    return s;
  }
  async function buildNow(b) {
    const st = H3.Game.state, t = cur.town;
    if (!b.ok) { UI.toast(b.reason, 'warn'); return; }
    const ok = await UI.confirm('Построить', 'Построить «' + UI.esc(b.name) + '» за ' + UI.costHtml(b.cost) + '?', 'Построить', 'Отмена');
    if (!ok || !cur) return;
    const r = R.build(st, t, b.id);
    if (r.ok) { H3.Audio.play('build'); UI.toast('Построено: ' + b.name); if (cur.hero) S.learnTownSpells(st, cur.hero, t); render(); H3.Game.refresh(false); }
    else UI.toast(r.reason, 'warn');
  }
  /** Тач: у постройки нет наведения и правой кнопки — вместо них карточка с действиями. */
  async function touchSheet(x, y) {
    const it = cur.scene.hit(x, y); if (!it) return;
    H3.Audio.play('click');
    const res = H3.Game.state.players[cur.town.owner].res;
    const choices = [];
    if (it.ghost) choices.push({ id: 'build', label: 'Построить', desc: (it.ghost.ok ? '' : it.ghost.reason + ' · ') + U.RES.filter(r => it.ghost.cost[r]).map(r => it.ghost.cost[r] + ' ' + O.RES_NAMES_GEN[r]).join(', '), disabled: !it.ghost.ok });
    else {
      if (it.tab) choices.push({ id: 'open', label: ({ build: 'Стройка', recruit: 'Найм', guild: 'Гильдия магов', tavern: 'Таверна', market: 'Рынок', smith: 'Кузница' })[it.tab] });
      if (it.upgrade) choices.push({ id: 'upgrade', label: 'Улучшить: ' + it.upgrade.name, desc: (it.upgrade.ok ? '' : it.upgrade.reason + ' · ') + U.RES.filter(r => it.upgrade.cost[r]).map(r => it.upgrade.cost[r] + ' ' + O.RES_NAMES_GEN[r]).join(', '), disabled: !it.upgrade.ok });
    }
    choices.push({ id: 'no', label: 'Закрыть' });
    const ch = await UI.choose(it.name, (it.desc ? UI.esc(it.desc) : '') + (it.ghost && !it.ghost.ok ? '<br><span class="red">' + UI.esc(it.ghost.reason) + '</span>' : ''), choices, it.sprite);
    if (!cur || !ch || ch === 'no') return;
    if (ch === 'build') buildNow(it.ghost);
    else if (ch === 'upgrade') buildNow(it.upgrade);
    else if (ch === 'open') { cur.tab = it.tab; renderRight(); const r = cur.right; if (r && r.scrollIntoView) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    void res;
  }
  function onPicClick(x, y, alt) {
    const it = cur.scene.hit(x, y); if (!it) return;
    H3.Audio.play('click');
    if (it.ghost) { buildNow(it.ghost); return; }
    if (alt && it.upgrade) { buildNow(it.upgrade); return; }
    if (it.tab) { cur.tab = it.tab; renderRight(); return; }
    if (it.upgrade) buildNow(it.upgrade);
  }

  /* ---------- армии ---------- */
  function renderArmies() {
    const t = cur.town, h = cur.hero, box = cur.armies;
    const selOf = army => cur.sel && cur.sel.army === army ? cur.sel.i : -1;
    const bar = army => cur.sel && cur.sel.army === army ? UI.selBarHtml(army[cur.sel.i], cur.split) : '';
    box.innerHTML = '<div class="small muted">Гарнизон' + (t.buildings.tavern ? ' (+1 мораль при обороне)' : '') + ' · тап — выбрать, второй тап — переместить; долгое нажатие — сведения</div>' + UI.armyHtml(t.garrison, selOf(t.garrison)) + bar(t.garrison)
      + (h ? '<div class="row small" style="margin-top:4px">' + UI.heroPortrait(h, 1) + ' <b class="w">' + UI.esc(h.name) + '</b> <span class="muted">(' + h.level + ' ур.)</span></div>' + UI.armyHtml(h.army, selOf(h.army)) + bar(h.army) : '<div class="small muted" style="margin-top:4px">В городе нет героя</div>');
    const arm = box.querySelectorAll('.army7');
    UI.bindArmy(arm[0], t.garrison, (i, e) => onSlot(t.garrison, i, e.shiftKey)); if (h && arm[1]) UI.bindArmy(arm[1], h.army, (i, e) => onSlot(h.army, i, e.shiftKey));
    box.querySelectorAll('[data-split]').forEach(b => { b.onclick = () => askSplit(); });
    box.querySelectorAll('[data-unsel]').forEach(b => { b.onclick = () => { cur.sel = null; cur.split = 0; renderArmies(); }; });
  }
  async function askSplit() {
    const sel = cur.sel; if (!sel) return;
    const src = sel.army[sel.i]; if (!src || src.n < 2) return;
    const n = await UI.askNumber('Разделить стек', UI.esc(C.get(src.cid).name) + ' ×' + src.n + '. Сколько отделить?', src.n - 1, Math.floor(src.n / 2));
    if (!cur) return;
    cur.split = n || 0; renderArmies();
  }
  function onSlot(army, i, shift) {
    const sel = cur.sel;
    if (!sel) { if (army[i] && army[i].n > 0) { cur.sel = { army, i }; cur.split = 0; renderArmies(); } return; }
    if (sel.army === army && sel.i === i) { if (shift) { askSplit(); return; } cur.sel = null; cur.split = 0; renderArmies(); return; }
    const src = sel.army[sel.i];
    if (shift && !cur.split && src && src.n > 1) { askSplit(); return; }
    if (cur.split) {
      if (army[i] && army[i].cid !== src.cid) { UI.toast('Туда можно положить только ' + C.get(src.cid).name, 'warn'); return; }
      A.splitStack(sel.army, sel.i, army, i, cur.split);
    } else A.moveStack(sel.army, sel.i, army, i);
    // герой может остаться без армии — она в гарнизоне, это допустимо
    H3.Audio.play('click');
    cur.sel = null; cur.split = 0; renderArmies(); H3.Game.refresh(false);
  }

  /* ---------- правая панель ---------- */
  function renderRight() {
    const t = cur.town, st = H3.Game.state, p = st.players[t.owner], box = cur.right;
    const inc = R.townIncome(t);
    let html = '<div class="row sp"><span>' + UI.icon('ic_day') + ' Доход: ' + UI.costHtml(inc) + '</span><span class="small muted">' + (t.builtToday ? 'сегодня уже строили' : 'можно строить') + '</span></div>';
    html += '<div class="tabs">' + [['build', 'Стройка'], ['recruit', 'Найм'], ['guild', 'Гильдия'], ['tavern', 'Таверна'], ['market', 'Рынок'], ['smith', 'Кузница']].map(([id, nm]) => '<button data-tab="' + id + '" class="' + (cur.tab === id ? 'on' : '') + '">' + nm + '</button>').join('') + '</div>';
    html += '<div id="townTab"></div>';
    box.innerHTML = html;
    box.querySelectorAll('[data-tab]').forEach(b => { b.onclick = () => { H3.Audio.play('click'); cur.tab = b.dataset.tab; renderRight(); }; });
    const tab = box.querySelector('#townTab');
    ({ build: renderBuild, recruit: renderRecruit, guild: renderGuild, tavern: renderTavern, market: renderMarket, smith: renderSmith })[cur.tab](tab, t, p, st);
  }
  function renderBuild(tab, t, p, st) {
    const list = B.forFaction(t.faction).filter(b => b.id !== 'hall_1');
    const grid = UI.el('div', 'bgrid');
    for (const b of list) {
      if (b.kind === 'hall' && !t.buildings[b.id]) { const lvl = +b.id.slice(-1); if (R.townHallLevel(t) !== lvl - 1) continue; }
      if (b.kind === 'fort' && !t.buildings[b.id]) { const need = { fort: 0, citadel: 1, castle: 2 }[b.id]; if (R.fortLevel(t) !== need) continue; }
      if (b.kind === 'guild' && !t.buildings[b.id] && R.guildLevel(t) !== b.level - 1) continue;
      if (b.kind === 'dwell_up' && !t.buildings['dwell_' + b.tier]) continue;
      const built = !!t.buildings[b.id];
      const chk = built ? null : R.canBuild(st, t, b.id);
      const card = UI.el('div', 'bcard' + (built ? ' built' : chk.ok ? '' : ' locked'));
      card.innerHTML = '<b>' + UI.esc(b.name) + '</b>' + (built ? '<span class="green small">Построено</span>' : UI.costHtml(b.cost, p.res) + '<span class="small ' + (chk.ok ? 'green' : 'red') + '">' + (chk.ok ? 'Можно строить' : UI.esc(chk.reason)) + '</span>') + '<span class="small muted">' + UI.esc(b.desc) + '</span>';
      if (!built && chk.ok) card.onclick = async () => { const ok = await UI.confirm('Построить', 'Построить «' + UI.esc(b.name) + '» за ' + UI.costHtml(b.cost) + '?', 'Построить', 'Отмена'); if (!ok) return; const r = R.build(st, t, b.id); if (r.ok) { H3.Audio.play('build'); UI.toast('Построено: ' + b.name); if (cur.hero) S.learnTownSpells(st, cur.hero, t); render(); H3.Game.refresh(false); } };
      grid.appendChild(card);
    }
    tab.appendChild(grid);
  }
  function renderRecruit(tab, t, p, st) {
    const dest = cur.hero ? cur.hero.army : t.garrison;
    tab.innerHTML = '<div class="small muted">Существа нанимаются ' + (cur.hero ? 'в армию героя ' + UI.esc(cur.hero.name) : 'в гарнизон') + '. Прирост в понедельник' + (t.buildings.castle ? ' ×2 (Замок)' : t.buildings.citadel ? ' ×1.5 (Цитадель)' : '') + '.</div>';
    let any = false;
    for (let tier = 1; tier <= 7; tier++) {
      if (!t.buildings['dwell_' + tier]) continue; any = true;
      const [base, upg] = F.creaturesOf(t.faction, tier);
      const hasUp = !!t.buildings['dwell_up_' + tier];
      for (const c of hasUp ? [upg, base] : [base]) {
        const max = R.maxRecruit(st, t, tier, c.upg);
        const d = UI.el('div', 'dwell');
        d.innerHTML = UI.icon(c.id, 2, 'cr') + '<div class="grow"><b class="w">' + UI.esc(c.name) + '</b> <span class="muted">доступно ' + t.avail[tier - 1] + ' · +' + R.growthOf(t, tier) + '/нед</span><br>' + UI.costHtml(c.cost, p.res) + ' за одного</div>';
        const btn = UI.el('button', 'sm', 'Нанять'); btn.disabled = max <= 0 || !R.canAddToArmy(dest, c.id); btn.title = max <= 0 ? 'Нет существ или ресурсов' : '';
        btn.onclick = async () => { const n = await UI.askNumber('Нанять: ' + c.name, UI.creatureCard(c), max, max, c.cost, p.res); if (!n) return; const r = R.recruit(st, t, tier, c.upg, n, dest); if (r.ok) { H3.Audio.play('coin'); UI.toast('Нанято: ' + c.name + ' ×' + r.n, '', c.id); render(); H3.Game.refresh(false); } else UI.toast(r.reason, 'warn'); };
        const info = UI.el('button', 'sm', '?'); info.onclick = () => UI.modal({ title: c.name, html: UI.creatureCard(c) });
        d.appendChild(btn); d.appendChild(info); tab.appendChild(d);
      }
    }
    if (!any) tab.innerHTML += '<div class="muted">Постройте жилища существ.</div>';
    // улучшение стеков
    const ups = [];
    const scan = (army, who) => army.forEach((s, i) => { if (s && s.n > 0 && R.canUpgradeIn(t, s.cid)) ups.push({ army, i, s, who }); });
    scan(t.garrison, 'гарнизон'); if (cur.hero) scan(cur.hero.army, cur.hero.name);
    if (ups.length) {
      tab.appendChild(UI.el('h4', '', 'Улучшение существ'));
      for (const u of ups) {
        const c = C.get(u.s.cid), uc = C.get(c.upgTo), cost = R.upgradeStackCost(c.id, u.s.n);
        const d = UI.el('div', 'dwell'); d.innerHTML = UI.icon(c.id, 2, 'cr') + '<div class="grow"><b class="w">' + UI.esc(c.name) + ' ×' + u.s.n + '</b> → ' + UI.esc(uc.name) + ' <span class="muted">(' + UI.esc(u.who) + ')</span><br>' + UI.costHtml(cost, p.res) + '</div>';
        const btn = UI.el('button', 'sm', 'Улучшить'); btn.disabled = !U.canAfford(p.res, cost);
        btn.onclick = () => { U.pay(p.res, cost); u.s.cid = c.upgTo; H3.Audio.play('coin'); UI.toast('Улучшено: ' + uc.name, '', uc.id); render(); H3.Game.refresh(false); };
        d.appendChild(btn); tab.appendChild(d);
      }
    }
  }
  function renderGuild(tab, t, p, st) {
    const gl = R.guildLevel(t);
    if (!gl) { tab.innerHTML = '<div class="muted">Гильдия магов не построена.</div>'; return; }
    const h = cur.hero;
    let html = '';
    if (h && !h.hasBook) html += '<div class="row sp" style="margin-bottom:6px"><span>У героя нет книги заклинаний.</span><button class="sm" id="buyBook" ' + (p.res.gold < 500 ? 'disabled' : '') + '>Купить книгу (500)</button></div>';
    for (let l = 1; l <= gl; l++) {
      html += '<h4>Уровень ' + l + '</h4><div class="spells">' + (t.guild[l] || []).map(id => { const sp = SP.get(id); const known = h && h.spells.includes(id); const can = h && h.hasBook && R.canLearn(h, sp); return '<div class="spell ' + (known ? '' : (h && h.hasBook && !can ? 'no' : '')) + '" title="' + UI.esc(SP.describe(sp, 1)) + '">' + UI.icon('sp_' + id, 2) + '<div><b>' + UI.esc(sp.name) + '</b> <span class="lvl">' + UI.esc(SP.SCHOOL_NAMES[sp.school]) + ', ' + sp.mana + ' маны</span><br>' + UI.esc(SP.describe(sp, 1)) + (known ? '<br><span class="green">выучено</span>' : h && h.hasBook && !can ? '<br><span class="red">нужна Мудрость</span>' : '') + '</div></div>'; }).join('') + '</div>';
    }
    tab.innerHTML = html;
    const bb = tab.querySelector('#buyBook'); if (bb) bb.onclick = () => { p.res.gold -= 500; h.hasBook = true; const l = S.learnTownSpells(st, h, t); H3.Audio.play('coin'); UI.toast('Книга куплена, выучено заклинаний: ' + l.length); render(); H3.Game.refresh(false); };
  }
  function renderTavern(tab, t, p, st) {
    if (!t.buildings.tavern) { tab.innerHTML = '<div class="muted">Таверна не построена.</div>'; return; }
    if (!t.tavern || !t.tavern.length) t.tavern = R.tavernCandidates(st, t, 2);
    tab.innerHTML = '<div class="small muted">Найм героя стоит ' + R.HERO_COST + ' золота. ' + (t.visiting ? 'В городе уже есть герой — сначала выведите его.' : '') + ' Героев: ' + p.heroes.length + '/8.</div>';
    for (const tid of t.tavern) {
      const tpl = HE.get(tid), cl = HE.getClass(tpl.cls);
      const retired = st.retired && st.retired[tid];
      const d = UI.el('div', 'dwell');
      d.innerHTML = UI.icon('portrait_' + tpl.cls + '_' + tpl.portrait, 2, 'cr') + '<div class="grow"><b class="w">' + UI.esc(tpl.name) + '</b> — ' + UI.esc(cl.name) + (retired ? ' (' + retired.level + ' ур., вернулся)' : '') + '<br><span class="small">Специальность: ' + UI.esc(HE.specText(tpl)) + '<br>Навыки: ' + tpl.skills.map(s => H3.Skills.get(s.id).name + ' (' + H3.Skills.levelName(s.lvl) + ')').join(', ') + '</span></div>';
      const btn = UI.el('button', 'sm', 'Нанять'); btn.disabled = !!t.visiting || p.res.gold < R.HERO_COST || p.heroes.length >= 8;
      btn.onclick = () => { const r = A.hireHero(st, t, tid); if (r.ok) { H3.Audio.play('coin'); UI.toast('Нанят герой ' + r.hero.name); cur.hero = r.hero; H3.Game.selectHero(r.hero.id); render(); H3.Game.refresh(false); } else UI.toast(r.reason, 'warn'); };
      d.appendChild(btn); tab.appendChild(d);
    }
  }
  /** Кузница: продаёт боевую машину своей фракции герою в городе. */
  function renderSmith(tab, t, p, st) {
    if (!t.buildings.blacksmith) { tab.innerHTML = '<div class="muted">Кузница не построена.</div>'; return; }
    const mid = C.SMITHY[t.faction] || 'ballista';
    const m = C.get(mid), h = cur.hero;
    tab.innerHTML = '<div class="small muted">Кузница ' + UI.esc(F.get(t.faction).adj) + ' делает одну машину. Машина принадлежит герою и выходит с ним в бой.</div>';
    const d = UI.el('div', 'row');
    d.innerHTML = UI.icon(mid, 2, 'cr') + '<div class="grow"><b>' + UI.esc(m.name) + '</b><div class="small muted">' + UI.esc(m.desc) + '</div>' + UI.costHtml(m.cost, p.res) + '</div>';
    const has = !!(h && h.machines && h.machines[mid]);
    const btn = UI.el('button', 'primary', has ? 'Уже есть' : 'Купить');
    btn.disabled = !h || has || !U.canAfford(p.res, m.cost);
    if (!h) { const w = UI.el('div', 'small muted', 'Нужен герой в городе.'); tab.appendChild(d); tab.appendChild(w); return; }
    btn.onclick = () => { U.pay(p.res, m.cost); if (!h.machines) h.machines = {}; h.machines[mid] = true; H3.Audio.play('coin'); UI.toast(m.name + ' куплена'); render(); H3.Game.refresh(false); };
    d.appendChild(btn); tab.appendChild(d);
    if (t.buildings.shipyard) shipyardRow(tab, t, p, st, h);
  }
  /** Верфь в приморском городе: спускает лодку на воду за 1000 золота. */
  function shipyardRow(tab, t, p, st, h) {
    const spot = A.waterSpotNear(st, t.x, t.y + 1, t.z || 0);
    const d = UI.el('div', 'row');
    d.innerHTML = UI.icon('boat', 2, 'cr') + '<div class="grow"><b>Верфь</b><div class="small muted">Спустить лодку на воду рядом с городом.</div>' + UI.costHtml({ gold: 1000 }, p.res) + '</div>';
    const btn = UI.el('button', '', 'Построить лодку');
    btn.disabled = !spot || p.res.gold < 1000;
    if (!spot) d.querySelector('.muted').textContent = 'У причала тесно — лодку спустить некуда.';
    btn.onclick = () => {
      p.res.gold -= 1000;
      const m = S.lvl(st, t.z || 0), i = spot[1] * m.w + spot[0];
      const boat = { id: st.nextId++, type: 'boat', x: spot[0], y: spot[1], z: t.z || 0, owner: t.owner };
      st.objects[boat.id] = boat; m.objAt[i] = boat.id; m.block[i] = 1;
      H3.Audio.play('coin'); UI.toast('Лодка спущена на воду');
      render(); H3.Game.refresh(true);
    };
    d.appendChild(btn); tab.appendChild(UI.el('h4', '', 'Верфь')); tab.appendChild(d);
    void h;
  }
  function renderMarket(tab, t, p, st) {
    if (!t.buildings.market) { tab.innerHTML = '<div class="muted">Рынок не построен.</div>'; return; }
    marketUI(tab, p, S.townsOf(st, p.id).filter(x => x.buildings.market).length);
  }
  /** Общий UI рынка (город и торговый пост). */
  function marketUI(tab, p, markets) {
    const stt = { from: 'wood', to: 'gold', n: 1 };
    const draw = () => {
      const rate = R.marketRate(stt.from, stt.to, markets);
      const maxN = Math.floor((p.res[stt.from] || 0) / rate.give);
      stt.n = U.clamp(stt.n, 1, Math.max(1, maxN));
      tab.innerHTML = '<div class="small muted">Рынков: ' + markets + '. Чем больше рынков, тем выгоднее курс.</div>'
        + '<div class="small muted" style="margin-top:6px">Отдать</div><div class="mkres">' + U.RES.map(r => '<button class="sm ' + (stt.from === r ? 'primary' : '') + '" data-from="' + r + '">' + UI.resIcon(r) + '<i>' + U.fmt(p.res[r] || 0) + '</i></button>').join('') + '</div>'
        + '<div class="small muted" style="margin-top:6px">Получить</div><div class="mkres">' + U.RES.map(r => '<button class="sm ' + (stt.to === r ? 'primary' : '') + '" data-to="' + r + '">' + UI.resIcon(r) + '</button>').join('') + '</div>'
        + (stt.from === stt.to ? '<div class="muted">Выберите разные ресурсы.</div>' : '<div>Курс: <b>' + rate.give + '</b> ' + UI.resIcon(stt.from) + ' → <b>' + rate.get + '</b> ' + UI.resIcon(stt.to) + '</div><div class="row"><input type="range" min="1" max="' + Math.max(1, maxN) + '" value="' + stt.n + '" class="grow"><span id="mkSum"></span><button class="sm primary" id="mkDo" ' + (maxN < 1 ? 'disabled' : '') + '>Обменять</button></div>');
      tab.querySelectorAll('[data-from]').forEach(b => { b.onclick = () => { stt.from = b.dataset.from; draw(); }; });
      tab.querySelectorAll('[data-to]').forEach(b => { b.onclick = () => { stt.to = b.dataset.to; draw(); }; });
      const range = tab.querySelector('input[type=range]'), sum = tab.querySelector('#mkSum');
      const upd = () => { stt.n = +range.value; sum.innerHTML = (stt.n * rate.give) + ' ' + UI.resIcon(stt.from) + ' → ' + (stt.n * rate.get) + ' ' + UI.resIcon(stt.to); };
      if (range) { range.oninput = upd; upd(); }
      const go = tab.querySelector('#mkDo'); if (go) go.onclick = () => { p.res[stt.from] -= stt.n * rate.give; p.res[stt.to] = (p.res[stt.to] || 0) + stt.n * rate.get; H3.Audio.play('coin'); draw(); H3.Game.refresh(false); };
    };
    draw();
  }

  H3.TownView = { open, marketUI, TINT: H3.TownScene.TINT, LAYOUT: H3.TownScene.LAYOUT };
})(typeof window !== 'undefined' ? window : globalThis);
