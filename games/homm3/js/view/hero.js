/* ============================================================================
   view/hero.js — экран героя (и обмен между двумя героями): статы, навыки,
   армия, артефакты, книга заклинаний, роспуск. Сделан под палец: тап — выбрать,
   второй тап — переместить, «Разделить» кнопкой, долгое нажатие — сведения.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, HE = H3.Heroes, SK = H3.Skills, SP = H3.Spells, AR = H3.Artifacts, UI = H3.UI, A = H3.Adventure;

  let cur = null;
  function open(hero, other) {
    return new Promise(resolve => {
      cur = { hero, other, sel: null, split: 0, artSel: null };
      const wrap = UI.el('div', other ? 'exch' : ''); wrap.id = 'heroView';
      cur.wrap = wrap;
      const buttons = [{ label: 'Закрыть', cls: 'primary', value: true }];
      UI.modal({ title: other ? 'Встреча героев' : 'Герой', html: wrap, wide: !!other, buttons }).then(() => { cur = null; resolve(); });
      render();
    });
  }
  function render() {
    const w = cur.wrap; w.innerHTML = '';
    w.appendChild(heroColumn(cur.hero, 0));
    if (cur.other) w.appendChild(heroColumn(cur.other, 1));
    H3.Game.refresh(false);
  }
  const sign = v => (v > 0 ? '+' : '') + v;
  const partsText = (parts, none) => parts.length ? parts.map(p => p[0] + ' ' + sign(p[1])).join('<br>') : none;
  function heroColumn(h, idx) {
    const col = UI.el('div', 'col hcol');
    const exch = !!cur.other;
    const pr = R.heroPrimary(h), fx = R.artifactFx(h), mor = R.heroMorale(h), luck = R.heroLuck(h);
    const cls = HE.getClass(h.cls);
    const xpNext = HE.xpForLevel(h.level + 1);
    const selHere = cur.sel && cur.sel.army === h.army;
    col.innerHTML = '<div class="row top">' + UI.heroPortrait(h, 3) + '<div class="grow"><h3>' + UI.esc(h.name) + '</h3><div class="small">' + UI.esc(cls.name) + ', ' + h.level + ' ур. · опыт ' + U.fmt(h.xp) + ' / ' + U.fmt(xpNext) + '</div>'
      + (exch ? '<div class="small muted">' + UI.icon('ic_att') + ' ' + pr.att + ' ' + UI.icon('ic_def') + ' ' + pr.def + ' ' + UI.icon('ic_pow') + ' ' + pr.pow + ' ' + UI.icon('ic_kno') + ' ' + pr.kno + ' · ' + UI.icon('ic_mana') + ' ' + h.mana + '/' + R.heroMaxMana(h) + '</div>' : '<div class="small muted">Специальность: ' + UI.esc(HE.specText(h)) + '</div>') + '</div></div>'
      + (exch ? '' : '<div class="stats4"><div data-stat="att">' + UI.icon('ic_att') + '<b>' + pr.att + '</b><small>атака</small></div><div data-stat="def">' + UI.icon('ic_def') + '<b>' + pr.def + '</b><small>защита</small></div><div data-stat="pow">' + UI.icon('ic_pow') + '<b>' + pr.pow + '</b><small>сила</small></div><div data-stat="kno">' + UI.icon('ic_kno') + '<b>' + pr.kno + '</b><small>знание</small></div></div>'
        + '<div class="hrow"><button class="chip" data-mor>' + UI.icon('ic_morale') + ' Мораль ' + sign(mor.value) + '</button><button class="chip" data-luck>' + UI.icon('ic_luck') + ' Удача ' + sign(luck.value) + '</button><span class="chip">' + UI.icon('ic_move') + ' ' + Math.round(h.move) + '/' + R.heroMaxMove(h) + '</span><span class="chip">' + UI.icon('ic_mana') + ' ' + h.mana + '/' + R.heroMaxMana(h) + '</span></div>'
        + '<div class="skills">' + Object.keys(h.skills).map(id => '<button class="skill" data-skill="' + id + '">' + UI.icon('sk_' + id) + '<b>' + UI.esc(SK.get(id).name) + '</b> ' + UI.esc(SK.levelName(h.skills[id])) + '</button>').join('') + (Object.keys(h.skills).length ? '' : '<span class="muted small">нет вторичных навыков</span>') + '</div>')
      + '<div class="small muted">Армия · ' + (exch ? 'тап — выбрать, второй тап — переместить к любому герою' : 'тап — выбрать, второй тап — переместить; долгое нажатие — сведения') + '</div>' + UI.armyHtml(h.army, selHere ? cur.sel.i : -1)
      + (selHere ? UI.selBarHtml(h.army[cur.sel.i], cur.split) : '')
      + '<div class="small muted">Артефакты · тап — снять, из рюкзака — надеть; долгое нажатие — описание</div><div class="artslots">' + AR.SLOTS.map(s => artSlotHtml(h, s)).join('') + '</div>'
      + machinesHtml(h)
      + '<div class="small muted">Рюкзак</div><div class="artslots" data-bp="1">' + (h.backpack.length ? h.backpack.map((id, i) => '<div class="artslot" data-bp-i="' + i + '">' + UI.icon('art_' + id, 2) + '</div>').join('') : '<span class="muted small">пусто</span>') + '</div>'
      + (exch || !h.spells.length ? '' : '<div class="small muted">Заклинания · тап — книга</div><div class="hrow" data-book>' + h.spells.map(id => '<span class="chip">' + UI.icon('sp_' + id, 1) + ' ' + UI.esc(SP.get(id).name) + '</span>').join('') + '</div>');
    UI.bindArmy(col, h.army, (i, e) => onSlot(h.army, i, e.shiftKey));
    const bar = col.querySelector('.selbar');
    if (bar) {
      const bs = bar.querySelector('[data-split]'); if (bs) bs.onclick = () => askSplit();
      bar.querySelector('[data-unsel]').onclick = () => { cur.sel = null; cur.split = 0; render(); };
    }
    col.querySelectorAll('.artslot[data-slot]').forEach(s => UI.press(s, { tap: () => onArtSlot(h, s.dataset.slot), long: () => { const id = h.arts[s.dataset.slot]; UI.alert(id ? AR.get(id).name : AR.SLOT_NAMES[s.dataset.slot], id ? UI.esc(AR.get(id).desc) : 'Слот пуст. Артефакт из рюкзака надевается тапом по нему.', id ? 'art_' + id : null); } }));
    col.querySelectorAll('.artslot[data-bp-i]').forEach(s => UI.press(s, { tap: () => onBackpack(h, +s.dataset.bpI), long: () => { const a = AR.get(h.backpack[+s.dataset.bpI]); UI.alert(a.name, UI.esc(a.desc), 'art_' + a.id); } }));
    col.querySelectorAll('[data-skill]').forEach(b => { b.onclick = () => { const id = b.dataset.skill; UI.alert(SK.get(id).name + ' — ' + SK.levelName(h.skills[id]), UI.esc(SK.describe(id, h.skills[id])), 'sk_' + id); }; });
    const bm = col.querySelector('[data-mor]'); if (bm) bm.onclick = () => UI.alert('Мораль ' + sign(mor.value), partsText(mor.parts, 'Нет модификаторов.'), 'ic_morale');
    const bl = col.querySelector('[data-luck]'); if (bl) bl.onclick = () => UI.alert('Удача ' + sign(luck.value), partsText(luck.parts, 'Нет модификаторов.'), 'ic_luck');
    const bk = col.querySelector('[data-book]'); if (bk) bk.onclick = () => spellbook(h);
    const btns = UI.el('div', 'row wrap hbtns');
    const b1 = UI.el('button', 'sm', UI.icon('ic_spellbook') + ' Книга заклинаний'); b1.onclick = () => spellbook(h); btns.appendChild(b1);
    if (!exch) { const b2 = UI.el('button', 'sm danger', 'Распустить героя'); b2.onclick = async () => { if (await UI.confirm('Распустить', 'Распустить героя ' + UI.esc(h.name) + '? Армия и артефакты будут потеряны.')) { A.dismissHero(H3.Game.state, h); UI.closeTop(); H3.Game.selectHero(null); H3.Game.refresh(true); } }; btns.appendChild(b2); }
    col.appendChild(btns);
    return col;
  }
  /** Боевые машины героя (покупаются в кузнице). */
  function machinesHtml(h) {
    const ids = ['ballista', 'first_aid_tent', 'ammo_cart'].filter(id => h.machines && h.machines[id]);
    if (!ids.length) return '';
    return '<div class="small muted">Боевые машины</div><div class="artslots">'
      + ids.map(id => '<div class="artslot" title="' + UI.esc(C.get(id).name + ': ' + C.get(id).desc) + '">' + UI.icon(id, 2) + '</div>').join('') + '</div>';
  }
  function artSlotHtml(h, slot) {
    const id = h.arts[slot];
    return '<div class="artslot' + (id ? ' full' : '') + '" data-slot="' + slot + '">' + (id ? UI.icon('art_' + id, 2) : '') + '<small>' + UI.esc(AR.SLOT_NAMES[slot]) + '</small></div>';
  }
  /** «Разделить»: спросить число, затем ждать тап по слоту-получателю. */
  async function askSplit() {
    const sel = cur.sel; if (!sel) return;
    const src = sel.army[sel.i]; if (!src || src.n < 2) return;
    const n = await UI.askNumber('Разделить стек', UI.esc(C.get(src.cid).name) + ' ×' + src.n + '. Сколько отделить?', src.n - 1, Math.floor(src.n / 2));
    if (!cur) return;
    cur.split = n || 0; render();
  }
  function onSlot(army, i, shift) {
    const sel = cur.sel;
    if (!sel) { if (army[i] && army[i].n > 0) { cur.sel = { army, i }; cur.split = 0; render(); } return; }
    if (sel.army === army && sel.i === i) { if (shift) { askSplit(); return; } cur.sel = null; cur.split = 0; render(); return; }
    const src = sel.army[sel.i];
    if (shift && !cur.split && src && src.n > 1) { askSplit(); return; }
    if (cur.split) {
      if (army[i] && army[i].cid !== src.cid) { UI.toast('Туда можно положить только ' + C.get(src.cid).name, 'warn'); return; }
      A.splitStack(sel.army, sel.i, army, i, cur.split);
    } else {
      // герой не может отдать последнее существо
      const owner = sel.army === cur.hero.army ? cur.hero : cur.other;
      if (owner && sel.army !== army && R.armySize(sel.army) === 1) { UI.toast('Герой не может остаться без армии', 'warn'); cur.sel = null; render(); return; }
      A.moveStack(sel.army, sel.i, army, i);
    }
    H3.Audio.play('click');
    cur.sel = null; cur.split = 0; render();
  }
  function onArtSlot(h, slot) {
    const id = h.arts[slot];
    if (id) { delete h.arts[slot]; h.backpack.push(id); H3.Audio.play('click'); render(); return; }
    UI.toast('Слот пуст — тапни по артефакту в рюкзаке, чтобы надеть');
  }
  async function onBackpack(h, i) {
    const art = AR.get(h.backpack[i]);
    const free = AR.slotsFor(art).find(slot => !h.arts[slot]);
    const to = cur.other ? (h === cur.hero ? cur.other : cur.hero) : null;
    let act = free ? 'wear' : null;
    if (to) { // при встрече — выбор: надеть или передать
      const opts = []; if (free) opts.push({ id: 'wear', label: 'Надеть', desc: AR.SLOT_NAMES[free] }); opts.push({ id: 'give', label: 'Передать', desc: to.name });
      act = await UI.choose(art.name, UI.esc(art.desc), opts, 'art_' + art.id); if (!cur) return;
    }
    if (act === 'wear') { h.arts[free] = art.id; h.backpack.splice(i, 1); H3.Audio.play('click'); render(); }
    else if (act === 'give') { to.backpack.push(art.id); h.backpack.splice(i, 1); UI.toast('Передано герою ' + to.name); render(); }
    else if (!to) UI.toast('Слот занят — сначала снимите артефакт', 'warn');
  }
  function spellbook(h) {
    if (!h.hasBook) { UI.alert('Книга заклинаний', 'У героя нет книги заклинаний. Её можно купить в гильдии магов за 500 золота.'); return; }
    if (!h.spells.length) { UI.alert('Книга заклинаний', 'Книга пуста. Заклинания изучаются в гильдии магов и святилищах.'); return; }
    const wrap = UI.el('div', 'spells');
    let closeFn = null;
    for (const id of h.spells) {
      const sp = SP.get(id), m = SP.masteryOf(h, sp);
      const adv = sp.kind === 'adventure';
      const d = UI.el('div', 'spell' + (adv ? '' : ' no'), UI.icon('sp_' + id, 2) + '<div><b>' + UI.esc(sp.name) + '</b> <span class="lvl">' + sp.level + ' ур. · ' + SP.manaCost(sp, m) + ' маны · ' + UI.esc(SP.SCHOOL_NAMES[sp.school]) + ' (' + UI.esc(SK.levelName(m) || 'без школы') + ')</span><br>' + UI.esc(SP.describe(sp, m)) + (adv ? '<br><span class="green">Применить на карте</span>' : '<br><span class="muted">только в бою</span>') + '</div>');
      if (adv) d.onclick = async () => { if (closeFn) closeFn(); const r = await castTownPortal(h); void r; };
      wrap.appendChild(d);
    }
    UI.modal({ title: 'Книга заклинаний', titleRight: '<span class="small muted">' + UI.esc(h.name) + ' · ' + UI.icon('ic_mana', 1) + ' ' + h.mana + '/' + R.heroMaxMana(h) + '</span>', html: wrap, wide: true, buttons: [{ label: 'Закрыть', value: null }], onOpen: (box, close) => { closeFn = close; } });
  }
  async function castTownPortal(h) {
    const st = H3.Game.state;
    const sp = SP.get('town_portal'), m = SP.masteryOf(h, sp);
    const towns = S.townsOf(st, h.owner).filter(t => !t.visiting || t.visiting === h.id);
    if (!towns.length) { UI.toast('Нет свободного города', 'warn'); return; }
    let townId = null;
    if (m >= 2 && towns.length > 1) { townId = await UI.choose('Городской портал', 'Куда переместиться?', towns.map(t => ({ id: t.id, label: t.name, desc: H3.Factions.get(t.faction).name }))); if (!townId) return; }
    const r = A.castTownPortal(st, h, townId);
    if (!r.ok) { UI.toast(r.reason, 'warn'); return; }
    H3.Audio.play('spell'); UI.closeTop(); UI.toast('Герой перенёсся в ' + r.town.name);
    H3.AdvView.invalidate(); H3.AdvView.centerOn(h.x, h.y); H3.Game.refresh(true);
  }

  H3.HeroView = { open, spellbook };
})(typeof window !== 'undefined' ? window : globalThis);
