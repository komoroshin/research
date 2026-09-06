/* ============================================================================
   view/town.js — экран города: картинка с постройками, стройка, найм,
   гильдия, таверна, рынок, гарнизон и герой-гость.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, F = H3.Factions, B = H3.Buildings, SP = H3.Spells, HE = H3.Heroes, Sp = H3.Sprites, UI = H3.UI, A = H3.Adventure, O = H3.Objects;

  const TINT = {
    castle: { n: '#d8d0c0', N: '#9a9280', r: '#3b6fd4', R: '#243f8c' }, rampart: { n: '#b8a888', N: '#7a6a50', r: '#4a9a3a', R: '#2d6b2a' },
    tower: { n: '#e8eef4', N: '#a8b8c8', r: '#5b8fd6', R: '#2f5fa0' }, inferno: { n: '#6a3a2a', N: '#3a1a10', r: '#c8332a', R: '#7a1a14' },
    necropolis: { n: '#5a5a6a', N: '#2a2a3a', r: '#4e2a72', R: '#2a1a40' }, dungeon: { n: '#6a5a6a', N: '#3a2a3a', r: '#9a58c8', R: '#4e2a72' },
    stronghold: { n: '#9a6a3c', N: '#5a3a1c', r: '#c88a2a', R: '#8a5a10' }, fortress: { n: '#7a8a5a', N: '#4a5a3a', r: '#4a8a5a', R: '#2a5a3a' },
  };
  const LAYOUT = {
    dwell_7: [320, 118], dwell_2: [150, 128], dwell_3: [500, 128], dwell_5: [62, 178], dwell_6: [586, 180], hall: [320, 202], guild: [215, 208],
    dwell_1: [96, 234], dwell_4: [560, 240], tavern: [180, 266], blacksmith: [470, 266], market: [330, 280], silo: [600, 296], walls: [320, 318],
  };

  let cur = null; // { town, hero, tab, sel: {army, i} }

  function open(town) {
    return new Promise(resolve => {
      const st = H3.Game.state;
      const hero = town.visiting ? st.heroes[town.visiting] : null;
      cur = { town, hero, tab: 'build', sel: null, resolve };
      const wrap = UI.el('div', ''); wrap.id = 'townView';
      const left = UI.el('div', ''); const pic = UI.el('canvas', 'px'); pic.id = 'townPic'; pic.width = 640; pic.height = 320; left.appendChild(pic);
      const armies = UI.el('div', 'garr'); armies.id = 'townArmies'; left.appendChild(armies);
      const right = UI.el('div', ''); right.id = 'townRight';
      wrap.appendChild(left); wrap.appendChild(right);
      cur.pic = pic; cur.right = right; cur.armies = armies;
      pic.addEventListener('click', e => { const r = pic.getBoundingClientRect(); onPicClick((e.clientX - r.left) * 640 / r.width, (e.clientY - r.top) * 320 / r.height); });
      pic.addEventListener('mousemove', e => { const r = pic.getBoundingClientRect(); const hit = hitBuilding((e.clientX - r.left) * 640 / r.width, (e.clientY - r.top) * 320 / r.height); if (hit) UI.tip(e.clientX, e.clientY, '<b>' + UI.esc(hit.name) + '</b>' + (hit.desc ? '<br>' + UI.esc(hit.desc) : '')); else UI.hideTip(); });
      pic.addEventListener('mouseleave', UI.hideTip);
      UI.modal({ title: town.name + ' — ' + F.get(town.faction).name, titleRight: '<span class="small muted">' + UI.esc(F.get(town.faction).desc) + '</span>', html: wrap, wide: true,
        buttons: [{ label: 'Закрыть', cls: 'primary', value: true }], closable: true }).then(() => { UI.hideTip(); cur = null; resolve(); });
      render();
    });
  }
  function render() { drawPic(); renderArmies(); renderRight(); }

  /* ---------- картинка ---------- */
  function buildingsOnPic() {
    const t = cur.town, list = [];
    const has = id => !!t.buildings[id];
    const hall = R.townHallLevel(t); list.push({ key: 'hall', sprite: 'bld_hall_' + hall, pos: LAYOUT.hall, id: 'hall_' + (hall < 4 ? hall + 1 : 4), name: B.BY_ID['hall_' + hall].name });
    const fl = R.fortLevel(t); if (fl) list.push({ key: 'walls', sprite: ['', 'bld_fort', 'bld_citadel', 'bld_castle'][fl], pos: LAYOUT.walls, id: fl < 3 ? ['fort', 'citadel', 'castle'][fl] : 'castle', name: B.BY_ID[['fort', 'citadel', 'castle'][fl - 1]].name, wide: true });
    const gl = R.guildLevel(t); if (gl) list.push({ key: 'guild', sprite: 'bld_guild_' + gl, pos: LAYOUT.guild, id: 'guild', name: 'Гильдия магов ' + ['', 'I', 'II', 'III', 'IV'][gl], tab: 'guild' });
    for (const id of ['tavern', 'market', 'blacksmith', 'silo']) if (has(id)) list.push({ key: id, sprite: 'bld_' + id, pos: LAYOUT[id], id, name: B.BY_ID[id].name, tab: id === 'tavern' ? 'tavern' : id === 'market' ? 'market' : null });
    for (let i = 1; i <= 7; i++) if (has('dwell_' + i)) { const b = B.get(t.faction, 'dwell_' + i); list.push({ key: 'dwell_' + i, sprite: 'bld_dwell_' + i, pos: LAYOUT['dwell_' + i], id: 'dwell_' + i, name: b.name + (has('dwell_up_' + i) ? ' (улучш.)' : ''), desc: C.get(has('dwell_up_' + i) ? F.creaturesOf(t.faction, i)[1].id : b.creature).name + ': доступно ' + t.avail[i - 1], tab: 'recruit', upg: has('dwell_up_' + i) }); }
    return list;
  }
  function drawPic() {
    const t = cur.town, cv = cur.pic, ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const terrain = F.get(t.faction).terrain, st = H3.Terrain.STYLE[terrain];
    const sky = { grass: ['#4d8fe0', '#bcdcf7'], snow: ['#7a9ac0', '#e8f0f8'], lava: ['#2a1010', '#8a3a20'], dirt: ['#4a4a6a', '#b8b0a0'], subter: ['#1a1220', '#4a3a58'], rough: ['#6a88b0', '#d8d0b8'], swamp: ['#4a6a5a', '#a8b898'], sand: ['#7fb6e8', '#f2e4c0'] }[terrain] || ['#4d8fe0', '#bcdcf7'];
    const g = ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 320);
    const rng = new U.RNG(U.hashStr(t.name));
    ctx.fillStyle = st.base[1]; ctx.beginPath(); ctx.moveTo(0, 150); for (let x = 0; x <= 640; x += 32) ctx.lineTo(x, 130 + Math.sin(x / 70) * 14 + rng.int(-4, 4)); ctx.lineTo(640, 320); ctx.lineTo(0, 320); ctx.fill();
    ctx.fillStyle = st.base[0]; ctx.fillRect(0, 150, 640, 170);
    for (let i = 0; i < 500; i++) { ctx.fillStyle = rng.pick(st.spec); ctx.fillRect(rng.int(0, 640), rng.int(150, 320), rng.int(1, 3), 1); }
    const tint = TINT[t.faction];
    const list = buildingsOnPic().slice().sort((a, b) => a.pos[1] - b.pos[1]);
    for (const b of list) {
      if (b.wide) { ctx.fillStyle = tint.n; ctx.fillRect(0, 318 - 56, 640, 56); ctx.fillStyle = tint.N; for (let x = 0; x < 640; x += 16) ctx.fillRect(x, 318 - 56, 8, 8); }
      Sp.draw(ctx, b.sprite, b.pos[0], b.pos[1], 2, false, tint);
      if (b.upg) Sp.draw(ctx, 'bld_upg', b.pos[0] + 20, b.pos[1] - 60, 2);
    }
    // флаг владельца на ратуше
    const p = H3.Game.state.players[t.owner]; if (p) H3.AdvView.drawFlag(ctx, LAYOUT.hall[0] + 2, LAYOUT.hall[1] - 100, p.color);
  }
  function hitBuilding(x, y) {
    const list = buildingsOnPic().slice().sort((a, b) => b.pos[1] - a.pos[1]);
    for (const b of list) { const cv = Sp.render(b.sprite, 2); if (!cv) continue; const w = cv.width, h = cv.height; const bx = b.pos[0] - w / 2, by = b.pos[1] - h; if (b.wide ? (y >= 318 - 56) : (x >= bx && x <= bx + w && y >= by && y <= b.pos[1])) return b; }
    return null;
  }
  function onPicClick(x, y) { const b = hitBuilding(x, y); if (!b) return; H3.Audio.play('click'); if (b.tab) { cur.tab = b.tab; renderRight(); } else if (b.key === 'hall' || b.key === 'walls') { cur.tab = 'build'; renderRight(); } }

  /* ---------- армии ---------- */
  function renderArmies() {
    const t = cur.town, h = cur.hero, box = cur.armies;
    box.innerHTML = '<div class="small muted">Гарнизон' + (t.buildings.tavern ? ' (+1 мораль при обороне)' : '') + '</div>' + UI.armyHtml(t.garrison, cur.sel && cur.sel.army === t.garrison ? cur.sel.i : -1)
      + (h ? '<div class="row sp small" style="margin-top:4px"><span>' + UI.heroPortrait(h, 1) + ' <b class="w">' + UI.esc(h.name) + '</b> (' + h.level + ' ур.)</span><span class="muted">клик по стеку — выбрать, второй клик — переместить; Shift — разделить</span></div>' + UI.armyHtml(h.army, cur.sel && cur.sel.army === h.army ? cur.sel.i : -1) : '<div class="small muted" style="margin-top:4px">В городе нет героя</div>');
    const arm = box.querySelectorAll('.army7');
    const bind = (el, army) => el.querySelectorAll('.slot').forEach((s, i) => { s.onclick = e => onSlot(army, i, e.shiftKey); });
    bind(arm[0], t.garrison); if (h && arm[1]) bind(arm[1], h.army);
  }
  async function onSlot(army, i, split) {
    const sel = cur.sel;
    if (!sel) { if (army[i] && army[i].n > 0) { cur.sel = { army, i }; renderArmies(); } return; }
    if (sel.army === army && sel.i === i) { cur.sel = null; renderArmies(); return; }
    const src = sel.army[sel.i];
    if (split && src && src.n > 1 && (!army[i] || army[i].cid === src.cid)) {
      const n = await UI.askNumber('Разделить стек', UI.esc(C.get(src.cid).name) + ' ×' + src.n + '. Сколько переместить?', src.n - 1, Math.floor(src.n / 2));
      if (n) A.splitStack(sel.army, sel.i, army, i, n);
    } else A.moveStack(sel.army, sel.i, army, i);
    // герой не может остаться без армии, если он в городе? (можно — армия в гарнизоне)
    cur.sel = null; renderArmies(); H3.Game.refresh(false);
  }

  /* ---------- правая панель ---------- */
  function renderRight() {
    const t = cur.town, st = H3.Game.state, p = st.players[t.owner], box = cur.right;
    const inc = R.townIncome(t);
    let html = '<div class="row sp"><span>' + UI.icon('ic_day') + ' Доход: ' + UI.costHtml(inc) + '</span><span class="small muted">' + (t.builtToday ? 'сегодня уже строили' : 'можно строить') + '</span></div>';
    html += '<div class="tabs">' + [['build', 'Стройка'], ['recruit', 'Найм'], ['guild', 'Гильдия'], ['tavern', 'Таверна'], ['market', 'Рынок']].map(([id, nm]) => '<button data-tab="' + id + '" class="' + (cur.tab === id ? 'on' : '') + '">' + nm + '</button>').join('') + '</div>';
    html += '<div id="townTab"></div>';
    box.innerHTML = html;
    box.querySelectorAll('[data-tab]').forEach(b => { b.onclick = () => { H3.Audio.play('click'); cur.tab = b.dataset.tab; renderRight(); }; });
    const tab = box.querySelector('#townTab');
    ({ build: renderBuild, recruit: renderRecruit, guild: renderGuild, tavern: renderTavern, market: renderMarket })[cur.tab](tab, t, p, st);
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
        + '<div class="row wrap" style="margin:6px 0"><span>Отдать:</span>' + U.RES.map(r => '<button class="sm ' + (stt.from === r ? 'primary' : '') + '" data-from="' + r + '">' + UI.resIcon(r) + '</button>').join('') + '</div>'
        + '<div class="row wrap" style="margin:6px 0"><span>Получить:</span>' + U.RES.map(r => '<button class="sm ' + (stt.to === r ? 'primary' : '') + '" data-to="' + r + '">' + UI.resIcon(r) + '</button>').join('') + '</div>'
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

  H3.TownView = { open, marketUI, TINT, LAYOUT };
})(typeof window !== 'undefined' ? window : globalThis);
