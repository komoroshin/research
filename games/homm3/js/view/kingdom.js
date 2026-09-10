/* ============================================================================
   view/kingdom.js — экран «Королевство»: все города и герои на одном листе.

   К середине партии городов пять, героев четыре, и ход превращается в обход
   карты ради одной кнопки в каждом городе. Здесь всё видно сразу: где сегодня
   не строили, где кого можно нанять, у кого остался ход. Отсюда же переходы.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, S = H3.State, R = H3.Rules, C = H3.Creatures, F = H3.Factions, B = H3.Buildings, O = H3.Objects, UI = H3.UI;

  /** Что в этом городе можно построить прямо сейчас — самое дешёвое из доступного. */
  function nextBuild(st, t) {
    if (t.builtToday) return null;
    let best = null;
    for (const b of B.forFaction(t.faction)) {
      if (t.buildings[b.id]) continue;
      const chk = R.canBuild(st, t, b.id);
      if (!chk.ok) continue;
      const price = (b.cost.gold || 0) + 100 * U.RES.filter(r => r !== 'gold').reduce((a, r) => a + (b.cost[r] || 0), 0);
      if (!best || price < best.price) best = { b, price };
    }
    return best;
  }
  /** Сколько существ можно нанять в городе прямо сейчас (по деньгам и наличию). */
  function recruitable(st, t) {
    let n = 0;
    for (let tier = 1; tier <= 7; tier++) {
      if (!t.buildings['dwell_' + tier]) continue;
      const up = !!t.buildings['dwell_up_' + tier];
      n += R.maxRecruit(st, t, tier, up);
    }
    return n;
  }

  function open() {
    const st = H3.Game.state; if (!st) return Promise.resolve();
    const p = st.players[st.turn];
    const wrap = UI.el('div', 'kingdom');
    const render = () => {
      const inc = p.income || S.playerIncome(st, p.id);
      const towns = S.townsOf(st, p.id), heroes = S.heroesOf(st, p.id);
      const power = heroes.reduce((a, h) => a + R.armyPower(h.army, h), 0);
      let html = '<div class="kres">' + U.RES.map(r => '<span title="' + UI.esc(O.RES_NAMES[r]) + '">' + UI.resIcon(r) + '<b>' + U.fmt(p.res[r]) + '</b><i>+' + (inc[r] || 0) + '</i></span>').join('') + '</div>';
      html += '<div class="ksum small muted">' + towns.length + ' ' + U.plural(towns.length, 'город', 'города', 'городов')
        + ' · ' + heroes.length + ' ' + U.plural(heroes.length, 'герой', 'героя', 'героев')
        + ' · сила армий ' + U.fmt(Math.round(power)) + '</div>';

      html += '<h4>Города</h4>';
      if (!towns.length) html += '<div class="parch small">Городов нет. Захватите город в течение семи дней, иначе поражение.</div>';
      for (const t of towns) {
        const nb = nextBuild(st, t), rec = recruitable(st, t);
        const hero = t.visiting && st.heroes[t.visiting] && st.heroes[t.visiting].inTown === t.id ? st.heroes[t.visiting] : null;
        html += '<div class="kcard"><div class="row sp"><b class="w">' + UI.esc(t.name) + '</b><span class="small muted">' + UI.esc(F.get(t.faction).name) + ' · ' + UI.icon('ic_gold', 1) + (R.townIncome(t).gold || 0) + '</span></div>'
          + '<div class="small ' + (t.builtToday ? 'muted' : nb ? 'green' : 'muted') + '">' + (t.builtToday ? 'Сегодня уже строили' : nb ? 'Можно построить: ' + UI.esc(nb.b.name) : 'Нечего строить') + '</div>'
          + '<div class="small ' + (rec ? 'green' : 'muted') + '">' + (rec ? 'Доступно к найму: ' + rec : 'Нанимать некого') + '</div>'
          + (hero ? '<div class="small">' + UI.heroPortrait(hero, 1) + ' ' + UI.esc(hero.name) + ' в городе</div>' : '')
          + (t.garrison.some(x => x && x.n > 0) ? UI.armyHtml(t.garrison) : '<div class="small muted">Гарнизон пуст</div>')
          + '<div class="mrow"><button class="primary" data-town="' + t.id + '">Открыть</button><button data-recruit="' + t.id + '">Найм</button><button data-go="' + t.x + ',' + t.y + ',' + (t.z || 0) + '">На карте</button></div></div>';
      }

      html += '<h4>Герои</h4>';
      if (!heroes.length) html += '<div class="parch small">Героев нет. Наймите героя в таверне.</div>';
      for (const h of heroes) {
        const mm = R.heroMaxMove(h), pr = R.heroPrimary(h);
        html += '<div class="kcard"><div class="row"><span>' + UI.heroPortrait(h, 2) + '</span><div class="grow"><div class="row sp"><b class="w">' + UI.esc(h.name) + '</b><span class="small muted">' + h.level + ' ур.</span></div>'
          + '<div class="small muted">' + UI.icon('ic_att', 1) + pr.att + ' ' + UI.icon('ic_def', 1) + pr.def + ' ' + UI.icon('ic_pow', 1) + pr.pow + ' ' + UI.icon('ic_kno', 1) + pr.kno + ' · ' + UI.icon('ic_mana', 1) + h.mana + '/' + R.heroMaxMana(h) + '</div>'
          + '<div class="bar" title="Ход ' + Math.round(h.move) + ' / ' + mm + '"><div style="width:' + Math.round(100 * h.move / mm) + '%"></div></div></div></div>'
          + UI.armyHtml(h.army)
          + '<div class="mrow"><button class="primary" data-hero="' + h.id + '">Открыть</button><button data-go="' + h.x + ',' + h.y + ',' + (h.z || 0) + '" data-sel="' + h.id + '">На карте</button></div></div>';
      }
      wrap.innerHTML = html;
      wrap.querySelectorAll('[data-town]').forEach(b => { b.onclick = async () => { UI.closeTop(); await H3.Game.openTown(st.towns[+b.dataset.town]); open(); }; });
      wrap.querySelectorAll('[data-recruit]').forEach(b => { b.onclick = async () => { UI.closeTop(); await H3.Game.openTown(st.towns[+b.dataset.recruit], 'recruit'); open(); }; });
      wrap.querySelectorAll('[data-hero]').forEach(b => { b.onclick = async () => { UI.closeTop(); await H3.Game.openHero(st.heroes[+b.dataset.hero]); open(); }; });
      wrap.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => {
        const [x, y, z] = b.dataset.go.split(',').map(Number);
        UI.closeTop();
        if (b.dataset.sel !== undefined) H3.Game.selectHero(+b.dataset.sel);
        H3.AdvView.setLayer(z); H3.AdvView.centerOn(x, y); H3.Game.refresh(false);
      }; });
    };
    render();
    return UI.modal({ title: 'Королевство', titleRight: '<span class="small muted">' + UI.esc(S.dateStr(st.day)) + '</span>', html: wrap, wide: true, buttons: [{ label: 'Закрыть', cls: 'primary' }] });
  }

  H3.Kingdom = { open, nextBuild, recruitable };
})(typeof window !== 'undefined' ? window : globalThis);
