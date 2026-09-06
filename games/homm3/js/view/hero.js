/* ============================================================================
   view/hero.js — экран героя (и обмен между двумя героями): статы, навыки,
   армия, артефакты, книга заклинаний, роспуск.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, C = H3.Creatures, HE = H3.Heroes, SK = H3.Skills, SP = H3.Spells, AR = H3.Artifacts, UI = H3.UI, A = H3.Adventure;

  let cur = null;
  function open(hero, other) {
    return new Promise(resolve => {
      cur = { hero, other, sel: null, artSel: null };
      const wrap = UI.el('div', ''); wrap.id = 'heroView';
      cur.wrap = wrap;
      const buttons = [{ label: 'Закрыть', cls: 'primary', value: true }];
      UI.modal({ title: other ? 'Встреча героев' : hero.name, html: wrap, wide: true, buttons }).then(() => { cur = null; resolve(); });
      render();
    });
  }
  function render() {
    const w = cur.wrap; w.innerHTML = '';
    w.appendChild(heroColumn(cur.hero, 0));
    if (cur.other) w.appendChild(heroColumn(cur.other, 1)); else w.appendChild(detailsColumn(cur.hero));
    H3.Game.refresh(false);
  }
  function heroColumn(h, idx) {
    const col = UI.el('div', 'col');
    const pr = R.heroPrimary(h), fx = R.artifactFx(h), mor = R.heroMorale(h), luck = R.heroLuck(h);
    const cls = HE.getClass(h.cls);
    const xpNext = HE.xpForLevel(h.level + 1);
    col.innerHTML = '<div class="row top">' + UI.heroPortrait(h, 3) + '<div class="grow"><h3>' + UI.esc(h.name) + '</h3><div class="small">' + UI.esc(cls.name) + ', ' + h.level + ' ур. · опыт ' + U.fmt(h.xp) + ' / ' + U.fmt(xpNext) + '</div><div class="small muted">Специальность: ' + UI.esc(HE.specText(h)) + '</div></div></div>'
      + '<div class="stats4"><div title="Атака (база ' + h.pri.att + (fx.att ? ', артефакты ' + (fx.att > 0 ? '+' : '') + fx.att : '') + ')">' + UI.icon('ic_att') + '<b>' + pr.att + '</b><small>атака</small></div><div title="Защита">' + UI.icon('ic_def') + '<b>' + pr.def + '</b><small>защита</small></div><div title="Сила магии">' + UI.icon('ic_pow') + '<b>' + pr.pow + '</b><small>сила</small></div><div title="Знание">' + UI.icon('ic_kno') + '<b>' + pr.kno + '</b><small>знание</small></div></div>'
      + '<div class="row wrap small"><span title="' + UI.esc(mor.parts.map(p => p[0] + ' ' + (p[1] > 0 ? '+' : '') + p[1]).join(', ') || 'нет модификаторов') + '">' + UI.icon('ic_morale') + ' Мораль ' + (mor.value > 0 ? '+' : '') + mor.value + '</span><span title="' + UI.esc(luck.parts.map(p => p[0] + ' ' + (p[1] > 0 ? '+' : '') + p[1]).join(', ') || 'нет модификаторов') + '">' + UI.icon('ic_luck') + ' Удача ' + (luck.value > 0 ? '+' : '') + luck.value + '</span><span>' + UI.icon('ic_move') + ' ' + Math.round(h.move) + '/' + R.heroMaxMove(h) + '</span><span>' + UI.icon('ic_mana') + ' ' + h.mana + '/' + R.heroMaxMana(h) + '</span></div>'
      + '<div class="skills">' + Object.keys(h.skills).map(id => UI.skillHtml(id, h.skills[id])).join('') + (Object.keys(h.skills).length ? '' : '<span class="muted small">нет вторичных навыков</span>') + '</div>'
      + '<div class="small muted">Армия (клик — выбрать, второй клик — переместить/объединить; Shift+клик — разделить)</div>' + UI.armyHtml(h.army, cur.sel && cur.sel.army === h.army ? cur.sel.i : -1)
      + '<div class="small muted">Артефакты (клик — снять/надеть)</div><div class="artslots">' + AR.SLOTS.map(s => artSlotHtml(h, s)).join('') + '</div>'
      + '<div class="small muted">Рюкзак</div><div class="artslots" data-bp="1">' + (h.backpack.length ? h.backpack.map((id, i) => '<div class="artslot" data-bp-i="' + i + '" title="' + UI.esc(AR.get(id).name + ': ' + AR.get(id).desc) + '">' + UI.icon('art_' + id, 2) + '</div>').join('') : '<span class="muted small">пусто</span>') + '</div>';
    col.querySelectorAll('.army7 .slot').forEach((s, i) => { s.onclick = e => onSlot(h.army, i, e.shiftKey); });
    col.querySelectorAll('.artslot[data-slot]').forEach(s => { s.onclick = () => onArtSlot(h, s.dataset.slot); });
    col.querySelectorAll('.artslot[data-bp-i]').forEach(s => { s.onclick = () => onBackpack(h, +s.dataset.bpI); });
    const btns = UI.el('div', 'row wrap');
    const b1 = UI.el('button', 'sm', UI.icon('ic_spellbook') + ' Книга заклинаний'); b1.onclick = () => spellbook(h); btns.appendChild(b1);
    if (!cur.other) { const b2 = UI.el('button', 'sm danger', 'Распустить героя'); b2.onclick = async () => { if (await UI.confirm('Распустить', 'Распустить героя ' + UI.esc(h.name) + '? Армия и артефакты будут потеряны.')) { A.dismissHero(H3.Game.state, h); UI.closeTop(); H3.Game.selectHero(null); H3.Game.refresh(true); } }; btns.appendChild(b2); }
    col.appendChild(btns);
    return col;
  }
  function artSlotHtml(h, slot) {
    const id = h.arts[slot];
    return '<div class="artslot' + (cur.artSel && cur.artSel.hero === h && cur.artSel.slot === slot ? ' sel' : '') + '" data-slot="' + slot + '" title="' + UI.esc(AR.SLOT_NAMES[slot] + (id ? ': ' + AR.get(id).name + ' — ' + AR.get(id).desc : '')) + '">' + (id ? UI.icon('art_' + id, 2) : '') + '<small>' + UI.esc(AR.SLOT_NAMES[slot].slice(0, 4)) + '</small></div>';
  }
  function detailsColumn(h) {
    const col = UI.el('div', 'col');
    let html = '<h3>Навыки</h3><table class="t small">';
    for (const id in h.skills) html += '<tr><td>' + UI.icon('sk_' + id) + ' ' + UI.esc(SK.get(id).name) + '</td><td>' + UI.esc(SK.levelName(h.skills[id])) + '</td><td class="muted">' + UI.esc(SK.describe(id, h.skills[id])) + '</td></tr>';
    html += '</table>';
    html += '<h3>Армия</h3><table class="t small"><tr><th></th><th>Существо</th><th class="num">Кол-во</th><th class="num">Ат/Зщ</th><th class="num">Урон</th><th class="num">HP</th><th class="num">Ск</th></tr>';
    for (const s of h.army) if (s && s.n > 0) { const c = C.get(s.cid); html += '<tr><td>' + UI.icon(c.id, 1) + '</td><td>' + UI.esc(c.name) + '</td><td class="num">' + s.n + '</td><td class="num">' + c.att + '/' + c.def + '</td><td class="num">' + c.dmg[0] + '–' + c.dmg[1] + '</td><td class="num">' + c.hp + '</td><td class="num">' + c.speed + '</td></tr>'; }
    html += '</table><div class="small muted">Сила армии: ' + U.fmt(R.armyPower(h.army, h)) + '</div>';
    if (h.spells.length) html += '<h3>Заклинания</h3><div class="small">' + h.spells.map(id => UI.icon('sp_' + id, 1) + ' ' + UI.esc(SP.get(id).name)).join(', ') + '</div>';
    col.innerHTML = html;
    return col;
  }
  async function onSlot(army, i, split) {
    const sel = cur.sel;
    if (!sel) { if (army[i] && army[i].n > 0) { cur.sel = { army, i }; render(); } return; }
    if (sel.army === army && sel.i === i) { cur.sel = null; render(); return; }
    const src = sel.army[sel.i];
    if (split && src && src.n > 1 && (!army[i] || army[i].cid === src.cid)) {
      const n = await UI.askNumber('Разделить стек', UI.esc(C.get(src.cid).name) + ' ×' + src.n + '. Сколько переместить?', src.n - 1, Math.floor(src.n / 2));
      if (n) A.splitStack(sel.army, sel.i, army, i, n);
    } else {
      // герой не может отдать последнее существо
      const owner = sel.army === cur.hero.army ? cur.hero : cur.other;
      if (owner && sel.army !== army && R.armySize(sel.army) === 1 && !(army[i] && army[i].cid === src.cid && false)) { UI.toast('Герой не может остаться без армии', 'warn'); cur.sel = null; render(); return; }
      A.moveStack(sel.army, sel.i, army, i);
    }
    cur.sel = null; render();
  }
  function onArtSlot(h, slot) {
    const id = h.arts[slot];
    if (id) { delete h.arts[slot]; h.backpack.push(id); H3.Audio.play('click'); render(); return; }
    if (cur.artSel && cur.artSel.hero === h && cur.artSel.bp !== undefined) { const art = AR.get(h.backpack[cur.artSel.bp]); if (AR.slotsFor(art).includes(slot)) { h.arts[slot] = art.id; h.backpack.splice(cur.artSel.bp, 1); cur.artSel = null; H3.Audio.play('click'); render(); } else UI.toast('Не подходит к этому слоту', 'warn'); }
  }
  function onBackpack(h, i) {
    const art = AR.get(h.backpack[i]);
    // попробовать надеть в свободный подходящий слот; если оба героя — можно передать другому
    for (const slot of AR.slotsFor(art)) if (!h.arts[slot]) { h.arts[slot] = art.id; h.backpack.splice(i, 1); H3.Audio.play('click'); render(); return; }
    if (cur.other) { const to = h === cur.hero ? cur.other : cur.hero; to.backpack.push(art.id); h.backpack.splice(i, 1); UI.toast('Передано герою ' + to.name); render(); return; }
    UI.toast('Слот занят — сначала снимите артефакт', 'warn');
  }
  function spellbook(h) {
    if (!h.hasBook) { UI.alert('Книга заклинаний', 'У героя нет книги заклинаний. Её можно купить в гильдии магов за 500 золота.'); return; }
    if (!h.spells.length) { UI.alert('Книга заклинаний', 'Книга пуста. Заклинания изучаются в гильдии магов и святилищах.'); return; }
    const st = H3.Game.state;
    const wrap = UI.el('div', 'spells');
    let closeFn = null;
    for (const id of h.spells) {
      const sp = SP.get(id), m = SP.masteryOf(h, sp);
      const adv = sp.kind === 'adventure';
      const d = UI.el('div', 'spell' + (adv ? '' : ' no'), UI.icon('sp_' + id, 2) + '<div><b>' + UI.esc(sp.name) + '</b> <span class="lvl">' + sp.level + ' ур. · ' + SP.manaCost(sp, m) + ' маны · ' + UI.esc(SP.SCHOOL_NAMES[sp.school]) + ' (' + UI.esc(SK.levelName(m) || 'без школы') + ')</span><br>' + UI.esc(SP.describe(sp, m)) + (adv ? '<br><span class="green">Применить на карте</span>' : '<br><span class="muted">только в бою</span>') + '</div>');
      if (adv) d.onclick = async () => { if (closeFn) closeFn(); const r = await castTownPortal(h); void r; };
      wrap.appendChild(d);
    }
    UI.modal({ title: 'Книга заклинаний — ' + h.name + ' (' + h.mana + '/' + R.heroMaxMana(h) + ' маны)', html: wrap, wide: true, buttons: [{ label: 'Закрыть', value: null }], onOpen: (box, close) => { closeFn = close; } });
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
