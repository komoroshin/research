/* ============================================================================
   main.js — машина экранов, главное меню, ход игрока и ИИ, бои, диалоги
   объектов, уровни, сохранения, горячие клавиши. H3.Game — точка входа UI.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, S = H3.State, A = H3.Adventure, C = H3.Creatures, F = H3.Factions, HE = H3.Heroes, O = H3.Objects, AR = H3.Artifacts, SK = H3.Skills, SP = H3.Spells, UI = H3.UI, Sp = H3.Sprites, AV = H3.AdvView, BV = H3.BattleView, TV = H3.TownView, HV = H3.HeroView, Bt = H3.Battle;
  const VERSION = '1.0';
  const G = { state: null, selHero: null, busy: false, screen: 'menu', settingsObj: null };
  const SAVE_KEY = 'homm3.save.', SET_KEY = 'homm3.settings';

  /* ---------- настройки ---------- */
  function settings() {
    if (!G.settingsObj) { G.settingsObj = { animSpeed: 1, confirmEndTurn: true, quickBattle: false, aiSmart: true }; try { Object.assign(G.settingsObj, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch (e) { /* ignore */ } }
    return G.settingsObj;
  }
  function saveSettings() { try { localStorage.setItem(SET_KEY, JSON.stringify(settings())); } catch (e) { /* ignore */ } }

  /* ---------- экраны ---------- */
  function showScreen(name) { for (const id of ['menu', 'adv', 'battle']) UI.$('#' + id).classList.toggle('hidden', id !== name); G.screen = name; if (name === 'adv') AV.resize(); }
  function selected() { return G.state && G.selHero !== null ? G.state.heroes[G.selHero] : null; }
  function selectHero(id) { G.selHero = id; AV.V.pending = null; AV.V.path = null; refresh(false); }
  function nextHero() {
    const st = G.state; const hs = S.heroesOf(st, st.turn).filter(h => h.move >= 100);
    if (!hs.length) { UI.toast('Все герои сходили'); return; }
    const i = hs.findIndex(h => h.id === G.selHero); const h = hs[(i + 1) % hs.length];
    selectHero(h.id); AV.centerOn(h.x, h.y);
  }
  function refresh(full) { if (!G.state) return; if (full) AV.invalidate(); AV.renderSidebar(); AV.V.dirty = true; }

  /* ---------- главное меню ---------- */
  const NEW = { size: 'S', opponents: 1, difficulty: 'normal', faction: 'castle', hero: null, seed: '' , name: 'Игрок' };
  function menu() {
    showScreen('menu');
    const m = UI.$('#menu'); m.innerHTML = '';
    const card = UI.el('div', 'wood card');
    const hasAuto = !!load('auto', true);
    card.innerHTML = '<div class="title"><h1>Герои Эрафии</h1><div class="sub">Браузерная стратегия в духе Heroes of Might and Magic III</div></div>'
      + '<div class="menu-actions"><button class="big primary" id="btnNew">Новая игра</button><button class="big" id="btnCont" ' + (hasAuto ? '' : 'disabled') + '>Продолжить</button><button class="big" id="btnLoad">Загрузить</button><button class="big" id="btnHelp">Как играть</button></div>'
      + '<div class="center small muted" style="margin-top:12px">Версия ' + VERSION + ' · 8 фракций · 112 существ · гексовые бои · ИИ-противники · сохранения в браузере</div>';
    m.appendChild(card);
    card.querySelector('#btnNew').onclick = () => newGameForm();
    card.querySelector('#btnCont').onclick = () => { const st = load('auto'); if (st) start(st); };
    card.querySelector('#btnLoad').onclick = () => loadDialog();
    card.querySelector('#btnHelp').onclick = () => help();
  }
  function newGameForm() {
    const m = UI.$('#menu'); m.innerHTML = '';
    const card = UI.el('div', 'wood card');
    const seg = (key, opts) => '<div class="seg">' + opts.map(([v, l, t]) => '<button data-k="' + key + '" data-v="' + v + '" class="' + (String(NEW[key]) === String(v) ? 'on' : '') + '" title="' + UI.esc(t || '') + '">' + l + '</button>').join('') + '</div>';
    const render = () => {
      const f = F.get(NEW.faction);
      const heroes = HE.heroesOfFaction(NEW.faction);
      if (!heroes.some(h => h.id === NEW.hero)) NEW.hero = heroes[0].id;
      const maxOpp = S.SIZES[NEW.size].maxPlayers - 1; if (NEW.opponents > maxOpp) NEW.opponents = maxOpp;
      card.innerHTML = '<div class="title"><h2>Новая игра</h2></div>'
        + '<div class="opt"><label>Карта</label>' + seg('size', [['S', 'Маленькая 36×36', '2 игрока, ~45 минут'], ['M', 'Средняя 54×54', 'до 3 игроков, ~90 минут'], ['L', 'Большая 72×72', 'до 4 игроков, 2+ часа']]) + '</div>'
        + '<div class="opt"><label>Противники</label>' + seg('opponents', [1, 2, 3].filter(n => n <= maxOpp).map(n => [n, String(n)])) + '</div>'
        + '<div class="opt"><label>Сложность</label>' + seg('difficulty', Object.keys(S.DIFFICULTY).map(k => [k, S.DIFFICULTY[k].name, S.DIFFICULTY[k].desc])) + '</div>'
        + '<div class="small muted" style="margin:-2px 0 6px 122px">' + UI.esc(S.DIFFICULTY[NEW.difficulty].desc) + '</div>'
        + '<div class="opt"><label>Фракция</label><div class="factions">' + F.LIST.map(x => '<button data-k="faction" data-v="' + x.id + '" class="' + (NEW.faction === x.id ? 'on' : '') + '" title="' + UI.esc(x.desc) + '">' + UI.icon('town_' + x.id, 1) + x.name + '</button>').join('') + '</div></div>'
        + '<div class="small muted" style="margin:-2px 0 6px 122px">' + UI.esc(f.desc) + '</div>'
        + '<div class="opt"><label>Герой</label><div class="heroes4">' + heroes.map(h => '<button data-k="hero" data-v="' + h.id + '" class="' + (NEW.hero === h.id ? 'on' : '') + '" title="' + UI.esc(HE.specText(h)) + '">' + UI.icon('portrait_' + h.cls + '_' + h.portrait, 2) + h.name + '<small>' + UI.esc(HE.getClass(h.cls).name) + '</small></button>').join('') + '</div></div>'
        + '<div class="opt"><label>Сид карты</label><div class="row"><input type="text" id="seed" value="' + UI.esc(NEW.seed) + '" placeholder="случайный" style="width:140px"><button class="sm" id="rndSeed">Случайный</button><span class="small muted">одинаковый сид — одинаковая карта</span></div></div>'
        + '<div class="menu-actions"><button class="big primary" id="btnStart">Начать игру</button><button class="big" id="btnBack">Назад</button></div>';
      card.querySelectorAll('[data-k]').forEach(b => { b.onclick = () => { H3.Audio.play('click'); const k = b.dataset.k; NEW[k] = k === 'opponents' ? +b.dataset.v : b.dataset.v; NEW.seed = card.querySelector('#seed').value; render(); }; });
      card.querySelector('#rndSeed').onclick = () => { NEW.seed = String(Math.floor(Math.random() * 1e9)); render(); };
      card.querySelector('#btnBack').onclick = () => menu();
      card.querySelector('#btnStart').onclick = () => { H3.Audio.unlock(); NEW.seed = card.querySelector('#seed').value; const seed = NEW.seed ? (isNaN(+NEW.seed) ? U.hashStr(NEW.seed) : +NEW.seed) : Math.floor(Math.random() * 1e9); newGame({ size: NEW.size, opponents: NEW.opponents, difficulty: NEW.difficulty, faction: NEW.faction, hero: NEW.hero, seed, name: NEW.name }); };
    };
    render(); m.appendChild(card);
  }
  function help() {
    UI.modal({ title: 'Как играть', wide: true, html: '<div class="parch"><p><b>Цель:</b> захватить все города противников и уничтожить их героев. Потеря всех городов на 7 дней — поражение.</p>'
      + '<p><b>Карта.</b> Выберите героя и щёлкните по клетке — он пойдёт туда (на телефоне: первый тап показывает путь, второй — идёт). Зелёный путь — сегодня, жёлтый — завтра. Наведите курсор на объект, чтобы узнать, что это. Правый клик / долгое нажатие — подробности о стражах.</p>'
      + '<p><b>Ресурсы.</b> Захватывайте шахты (флаг ставится при входе), подбирайте ресурсы и сундуки. Золото — главное; редкие ресурсы нужны для гильдии магов и лучших существ.</p>'
      + '<p><b>Город.</b> Одна постройка в день. Сначала — Ратуша и жилища существ, затем Форт/Цитадель/Замок (прирост ×1.5/×2 в понедельник), гильдия магов. Нанимайте существ герою, стоящему в городе.</p>'
      + '<p><b>Бой.</b> Стеки ходят по скорости. Щёлкните по врагу — атака (рамка показывает, откуда бьём), по свободному гексу — движение. Стрелки стреляют, если рядом нет врага. «Ждать» откладывает ход, «Защита» даёт +20 % защиты. Герой колдует раз в раунд. Наведение на врага показывает урон и ответный удар.</p>'
      + '<p><b>Стражи.</b> Стек на карте охраняет соседние клетки. Подсказка говорит, насколько он слабее или сильнее вас. Слабые стражи могут присоединиться или разбежаться.</p>'
      + '<p><b>Клавиши:</b> E — конец хода, H — следующий герой, T — город, C — книга заклинаний, стрелки/WASD — камера, +/− — масштаб, Esc — закрыть окно, Пробел в бою — пропуск анимации.</p></div>' });
  }

  /* ---------- новая игра / старт ---------- */
  function newGame(opts) {
    let st;
    try { st = S.newGame(opts); } catch (e) { UI.alert('Ошибка', 'Не удалось создать карту: ' + UI.esc(e.message)); return; }
    start(st);
  }
  function start(st) {
    G.state = st; G.selHero = null;
    AV.setState(st); showScreen('adv');
    const p = st.players[st.turn];
    const h = S.heroesOf(st, p.id)[0];
    if (h) { selectHero(h.id); AV.centerOn(h.x, h.y); } else refresh(false);
    if (st.winner !== null) { gameOver(); return; }
    save('auto');
    if (st.day === 1) UI.toast('Партия началась. Удачи, ' + p.name + '!');
  }

  /* ---------- движение и взаимодействие ---------- */
  async function moveAlong(hero, annotatedPath) {
    if (G.busy || !hero || hero.owner !== G.state.turn) return;
    const st = G.state;
    const path = annotatedPath.map(s => [s.x, s.y]);
    if (!path.length) return;
    G.busy = true; AV.V.busy = true;
    try {
      const origin = [hero.x, hero.y];
      if (path[0][0] < hero.x) hero.facing = 'l'; else if (path[0][0] > hero.x) hero.facing = 'r';
      const r = A.moveHero(st, hero, path);
      if (r.steps.length) { AV.V.anim = null; const a = { hero, steps: r.steps, i: 0, t: 0, dur: settings().animSpeed === 0 ? 0 : settings().animSpeed === 2 ? 45 : 90, origin, resolve: null }; await new Promise(res => { a.resolve = res; if (a.dur === 0) { res(); return; } AV.V.anim = a; }); }
      hero.facing = r.steps.length ? (r.steps[r.steps.length - 1][0] < origin[0] ? 'l' : r.steps[r.steps.length - 1][0] > origin[0] ? 'r' : hero.facing) : hero.facing;
      AV.invalidate(); refresh(false);
      if (r.stop) await handleStop(hero, r.stop);
    } catch (e) { console.error(e); UI.toast('Ошибка: ' + e.message, 'warn'); }
    G.busy = false; AV.V.busy = false;
    AV.invalidate(); refresh(false);
    checkEnd();
  }
  async function handleStop(hero, stop) {
    const st = G.state;
    if (stop.kind === 'nomove') { UI.toast('Очки движения закончились', 'warn'); return; }
    if (stop.kind === 'town') { if (stop.town.owner === hero.owner) await openTown(stop.town); return; }
    if (stop.kind === 'hero') { await HV.open(hero, stop.hero); return; }
    if (stop.kind === 'enemyHero') {
      const e = stop.hero; const tw = A.townOfHero(st, e);
      const ok = await UI.confirm('Атаковать героя', '<b>' + UI.esc(e.name) + '</b> (' + UI.esc(st.players[e.owner].name) + ', ' + e.level + ' ур.)<br>Сила армии врага: ' + U.fmt(R.armyPower(e.army, e)) + ', ваша: ' + U.fmt(R.armyPower(hero.army, hero)) + '<br>Напасть?', 'В бой', 'Отступить');
      if (ok) await fight(hero, tw ? { town: tw } : { hero: e });
      return;
    }
    if (stop.kind === 'siege') {
      const tw = stop.town; const dh = tw.visiting ? st.heroes[tw.visiting] : null;
      const garr = dh ? dh.army : tw.garrison;
      if (R.armyEmpty(garr)) { A.captureTown(st, tw, hero.owner, hero); H3.Audio.play('flag'); UI.toast('Город ' + tw.name + ' захвачен без боя!', '', 'town_' + tw.faction); AV.invalidate(); refresh(false); await openTown(tw); return; }
      const ok = await UI.confirm('Осада города', '<b>' + UI.esc(tw.name) + '</b> (' + UI.esc(tw.owner >= 0 ? st.players[tw.owner].name : 'нейтральный') + ')' + (dh ? '<br>Защищает герой ' + UI.esc(dh.name) : '') + '<br>Укрепления: ' + (['нет', 'Форт (стены)', 'Цитадель (стены, ров, башня)', 'Замок (стены, ров, 3 башни)'][R.fortLevel(tw)]) + '<br>Сила гарнизона: ' + U.fmt(R.armyPower(garr, dh)) + ', ваша: ' + U.fmt(R.armyPower(hero.army, hero)) + '<br>Штурмовать?', 'Штурм', 'Отступить', 'town_' + tw.faction);
      if (ok) await fight(hero, { town: tw });
      return;
    }
    if (stop.kind === 'monster') {
      const m = stop.obj; const c = C.get(m.cid);
      const ap = A.approachMonster(st, hero, m);
      const cnt = R.skillLvl(hero, 'scouting') ? m.n : UI.countWord(m.n).toLowerCase();
      const strength = ap.k >= 3 ? 'гораздо слабее вас' : ap.k >= 1.5 ? 'слабее вас' : ap.k >= 0.8 ? 'примерно равны вам' : ap.k >= 0.4 ? 'сильнее вас' : 'гораздо сильнее вас';
      const card = UI.creatureCard(c, '<div class="small">На пути: <b>' + cnt + '</b> — ' + strength + '.</div>');
      if (ap.outcome === 'join') {
        const ch = await UI.choose(c.name, card + '<p>' + UI.esc(c.name) + ' восхищены вашей силой и хотят присоединиться!</p>', [{ id: 'join', label: 'Принять в армию' }, { id: 'fight', label: 'Напасть' }, { id: 'no', label: 'Уйти' }]);
        if (ch === 'join') { A.joinMonster(st, hero, m, 0); H3.Audio.play('flag'); UI.toast(c.name + ' ×' + m.n + ' присоединились', '', c.id); }
        else if (ch === 'fight') await fight(hero, { monster: m, pending: stop.pending });
      } else if (ap.outcome === 'pay') {
        const p = st.players[hero.owner];
        const ch = await UI.choose(c.name, card + '<p>' + UI.esc(c.name) + ' готовы присоединиться за <b>' + U.fmt(ap.cost) + '</b> золота (у вас ' + U.fmt(p.res.gold) + ').</p>', [{ id: 'pay', label: 'Заплатить', disabled: p.res.gold < ap.cost }, { id: 'fight', label: 'Напасть' }, { id: 'no', label: 'Уйти' }]);
        if (ch === 'pay') { A.joinMonster(st, hero, m, ap.cost); H3.Audio.play('coin'); UI.toast(c.name + ' ×' + m.n + ' наняты', '', c.id); }
        else if (ch === 'fight') await fight(hero, { monster: m, pending: stop.pending });
      } else if (ap.outcome === 'flee') {
        const ch = await UI.choose(c.name, card + '<p>' + UI.esc(c.name) + ' в ужасе бегут при вашем приближении.</p>', [{ id: 'let', label: 'Отпустить' }, { id: 'fight', label: 'Догнать и напасть' }]);
        if (ch === 'let') { A.removeObject(st, m); UI.toast(c.name + ' разбежались'); }
        else if (ch === 'fight') await fight(hero, { monster: m, pending: stop.pending });
      } else {
        const ch = await UI.choose(c.name, card + '<p>' + UI.esc(c.name) + ' преграждают путь и готовы к бою.</p>', [{ id: 'fight', label: 'В бой!' }, { id: 'no', label: 'Отступить' }]);
        if (ch === 'fight') await fight(hero, { monster: m, pending: stop.pending });
      }
      return;
    }
    if (stop.kind === 'object') await visitObject(hero, stop.obj);
  }
  async function visitObject(hero, obj) {
    const st = G.state;
    const t = O.get(obj.type);
    if (t.bank && obj.guards && obj.guards.length) {
      const g = obj.guards.map(x => C.get(x.cid).name + ' ×' + x.n).join(', ');
      const ok = await UI.confirm(t.name, t.desc + '<br>Внутри: ' + UI.esc(g) + '.<br>Напасть?', 'В бой', 'Уйти', t.sprite);
      if (ok) await fight(hero, { bank: obj });
      return;
    }
    if (obj.type === 'trading_post') { const box = UI.el('div'); TV.marketUI(box, st.players[hero.owner], Math.max(1, S.townsOf(st, hero.owner).filter(x => x.buildings.market).length)); await UI.modal({ title: 'Торговый пост', html: box, buttons: [{ label: 'Закрыть', cls: 'primary' }] }); return; }
    if (obj.type === 'hill_fort') { await hillFort(hero); return; }
    if (obj.type === 'tavern') { await mapTavern(hero, obj); return; }
    const v = A.visit(st, hero, obj);
    if (!v) return;
    AV.invalidate();
    if (v.levelUps) H3.Audio.play('levelup');
    if (v.kind === 'dwelling') {
      const c = C.get(obj.cid);
      if (obj.avail > 0) {
        const p = st.players[hero.owner];
        let max = obj.avail; for (const r of U.RES) if (c.cost[r]) max = Math.min(max, Math.floor(p.res[r] / c.cost[r]));
        if (max <= 0) { await UI.alert(v.title, v.text + '<br><span class="red">Не хватает ресурсов.</span>', c.id); return; }
        const n = await UI.askNumber(v.title, UI.creatureCard(c) + '<p>Доступно: ' + obj.avail + '</p>', max, max, c.cost, p.res);
        if (n) { const r = A.recruitFromDwelling(st, hero, obj, n); if (r.ok) { H3.Audio.play('coin'); UI.toast('Нанято: ' + c.name + ' ×' + r.n, '', c.id); } else UI.toast(r.reason, 'warn'); }
      } else await UI.alert(v.title, v.text, c.id);
      refresh(false); return;
    }
    if (v.toast) { UI.toast(v.text, '', v.icon); if (obj.type === 'resource' || obj.type === 'campfire') H3.Audio.play('coin'); if (obj.type === 'mine') H3.Audio.play('flag'); }
    else if (v.choices) {
      const ch = await UI.choose(v.title, v.text, v.choices, v.icon);
      if (ch && ch !== 'no') { const r = A.resolve(st, hero, obj, ch); if (r && r.text) UI.toast(r.text); if (r && r.levelUps) { H3.Audio.play('levelup'); await levelUps(hero); } }
    } else { await UI.alert(v.title, v.text, v.icon); if (obj.type === 'artifact' || obj.type === 'chest') H3.Audio.play('coin'); }
    if (v.levelUps) await levelUps(hero);
    refresh(false);
  }
  async function hillFort(hero) {
    const st = G.state, p = st.players[hero.owner];
    const items = [];
    hero.army.forEach((s, i) => { if (!s || s.n <= 0) return; const c = C.get(s.cid); if (c.upgTo && !c.upg && c.tier <= 4) items.push({ i, s, c }); });
    if (!items.length) { await UI.alert('Холмфорт', 'Здесь улучшают существ 1–4 уровня, но в вашей армии некого улучшать.', 'hill_fort'); return; }
    const wrap = UI.el('div');
    for (const it of items) {
      const uc = C.get(it.c.upgTo); const cost = it.c.tier === 1 ? {} : R.upgradeStackCost(it.c.id, it.s.n);
      const d = UI.el('div', 'dwell'); d.innerHTML = UI.icon(it.c.id, 2, 'cr') + '<div class="grow"><b class="w">' + UI.esc(it.c.name) + ' ×' + it.s.n + '</b> → ' + UI.esc(uc.name) + '<br>' + (it.c.tier === 1 ? '<span class="green">бесплатно</span>' : UI.costHtml(cost, p.res)) + '</div>';
      const b = UI.el('button', 'sm', 'Улучшить'); b.disabled = !U.canAfford(p.res, cost);
      b.onclick = () => { U.pay(p.res, cost); it.s.cid = it.c.upgTo; H3.Audio.play('coin'); b.disabled = true; b.textContent = 'Готово'; refresh(false); };
      d.appendChild(b); wrap.appendChild(d);
    }
    await UI.modal({ title: 'Холмфорт', html: wrap, buttons: [{ label: 'Закрыть', cls: 'primary' }] });
  }
  async function mapTavern(hero, obj) {
    const st = G.state, p = st.players[hero.owner];
    if (!obj.tavern || !obj.tavern.length) obj.tavern = R.tavernCandidates(st, { faction: hero.faction }, 2);
    const wrap = UI.el('div');
    wrap.innerHTML = '<div class="small muted">Найм героя стоит ' + R.HERO_COST + ' золота. Новый герой появится рядом с таверной.</div>';
    for (const tid of obj.tavern) {
      const tpl = HE.get(tid), cl = HE.getClass(tpl.cls);
      const d = UI.el('div', 'dwell'); d.innerHTML = UI.icon('portrait_' + tpl.cls + '_' + tpl.portrait, 2, 'cr') + '<div class="grow"><b class="w">' + UI.esc(tpl.name) + '</b> — ' + UI.esc(cl.name) + '<br><span class="small">' + UI.esc(HE.specText(tpl)) + '</span></div>';
      const b = UI.el('button', 'sm', 'Нанять'); b.disabled = p.res.gold < R.HERO_COST || p.heroes.length >= 8;
      b.onclick = () => {
        // ищем свободную клетку рядом
        let pos = null; for (let dy = -1; dy <= 1 && !pos; dy++) for (let dx = -1; dx <= 1; dx++) { const x = obj.x + dx, y = obj.y + dy; if ((dx || dy) && S.inMap(st, x, y) && !S.isBlocked(st, x, y) && !S.heroAt(st, x, y) && !S.monstersNear(st, x, y).length) { pos = [x, y]; break; } }
        if (!pos) { UI.toast('Нет места рядом с таверной', 'warn'); return; }
        p.res.gold -= R.HERO_COST; const h = R.makeHero(st, tid, p.id, pos[0], pos[1], false); p.heroes.push(h.id); obj.tavern = obj.tavern.filter(x => x !== tid);
        S.computeVisibility(st, p.id); H3.Audio.play('coin'); UI.toast('Нанят герой ' + h.name); UI.closeTop(); selectHero(h.id); refresh(true);
      };
      d.appendChild(b); wrap.appendChild(d);
    }
    await UI.modal({ title: 'Таверна', html: wrap, buttons: [{ label: 'Закрыть', cls: 'primary' }] });
  }

  /* ---------- бои ---------- */
  async function fight(hero, target) {
    const st = G.state;
    const b = A.startBattle(st, hero, target);
    if (!b) { if (target.town) { A.captureTown(st, target.town, hero.owner, hero); UI.toast('Город захвачен!'); } refresh(true); return; }
    const humanSides = [];
    b.sides.forEach((s, i) => { if (s.player >= 0 && !st.players[s.player].isAI) humanSides.push(i); });
    if (settings().quickBattle && humanSides.length === 1) { H3.BattleAI.auto(b, settings().aiSmart); }
    else await BV.run(b, { human: humanSides });
    const sum = A.endBattle(st);
    showScreen('adv'); AV.invalidate(); refresh(false);
    await battleResult(sum, hero);
    if (sum && sum.attWon && target.town && !hero.dead) { await openTown(target.town); }
    checkEnd();
  }
  async function battleResult(sum, myHero) {
    if (!sum) return;
    const st = G.state;
    const me = st.players[st.turn];
    const iAmAtt = sum.ctx.heroId && st.heroes[sum.ctx.heroId] && st.heroes[sum.ctx.heroId].owner === me.id;
    const won = iAmAtt ? sum.attWon : !sum.attWon;
    H3.Audio.play(won ? 'win' : 'lose');
    const r = sum.res;
    const side = (i, title) => '<div><b class="w">' + UI.esc(title) + '</b><br>' + (r.sides[i].losses.length ? r.sides[i].losses.map(l => UI.icon(l.cid, 1) + ' ' + UI.esc(C.get(l.cid).name) + ' ×' + l.n).join('<br>') : '<span class="muted">без потерь</span>') + '</div>';
    let html = '<div class="row top" style="gap:24px">' + side(0, 'Потери: ' + r.sides[0].name) + side(1, 'Потери: ' + r.sides[1].name) + '</div>';
    if (sum.winner && sum.xp) html += '<p style="margin-top:8px">' + UI.esc(sum.winner.name) + ' получает <b>' + U.fmt(sum.xp) + '</b> опыта' + (sum.levelUps ? ' и новый уровень!' : '.') + '</p>';
    if (sum.raised) html += '<p>Некромантия: поднято скелетов — ' + sum.raised + '.</p>';
    if (sum.loot.length) html += '<p>Трофеи: ' + sum.loot.map(id => UI.icon('art_' + id, 1) + ' ' + UI.esc(AR.get(id).name)).join(', ') + '</p>';
    if (sum.text.length) html += '<p>' + sum.text.map(UI.esc).join('. ') + '</p>';
    if (r.reason === 'retreat') html += '<p class="muted">Герой отступил и вернётся в таверну.</p>';
    if (r.reason === 'surrender') html += '<p class="muted">Герой сдался, армия сохранена; он вернётся в таверну.</p>';
    if (r.reason === 'timeout') html += '<p class="muted">Бой затянулся: атакующий отступает.</p>';
    await UI.modal({ title: won ? 'Победа!' : 'Поражение', html });
    const hero = sum.winner;
    if (hero && !hero.dead && hero.owner === me.id) await levelUps(hero);
    if (myHero && myHero.dead && G.selHero === myHero.id) { G.selHero = null; const h = S.heroesOf(st, me.id)[0]; if (h) selectHero(h.id); }
  }
  async function levelUps(hero) {
    const st = G.state;
    while (R.pendingLevels(hero) > 0 && !hero.dead) {
      const opt = R.levelUpOptions(hero, st._rng.misc);
      const priName = { att: 'Атака', def: 'Защита', pow: 'Сила магии', kno: 'Знание' }[opt.pri];
      H3.Audio.play('levelup');
      let choice = null;
      if (opt.choices.length) {
        const id = await UI.choose(hero.name + ' достигает ' + (hero.level + 1) + ' уровня!', '<div class="row">' + UI.heroPortrait(hero, 3) + '<div>' + UI.icon('ic_' + opt.pri) + ' <b>' + priName + ' +1</b><br>Выберите вторичный навык:</div></div>',
          opt.choices.map(c => ({ id: c.id, label: SK.get(c.id).name + ' — ' + SK.levelName(c.lvl), desc: SK.describe(c.id, c.lvl) })));
        choice = opt.choices.find(c => c.id === id) || opt.choices[0];
      } else await UI.alert(hero.name + ' достигает ' + (hero.level + 1) + ' уровня!', UI.icon('ic_' + opt.pri) + ' <b>' + priName + ' +1</b>');
      R.applyLevelUp(hero, opt.pri, choice);
      refresh(false);
    }
  }

  /* ---------- экраны города и героя ---------- */
  async function openTown(town) { if (town.owner !== G.state.turn) return; await TV.open(town); AV.invalidate(); refresh(false); }
  async function openHero(hero) { await HV.open(hero); refresh(false); }
  function openSpellbook() { const h = selected(); if (!h) { UI.toast('Выберите героя'); return; } HV.spellbook(h); }

  /* ---------- конец хода, ИИ ---------- */
  async function endTurn() {
    if (G.busy || !G.state) return;
    const st = G.state; const me = st.players[st.turn];
    if (settings().confirmEndTurn) {
      const idle = S.heroesOf(st, me.id).filter(h => h.move >= R.heroMaxMove(h) * 0.5);
      if (idle.length) { const ok = await UI.confirm('Конец хода', 'У героев ещё есть очки движения: ' + idle.map(h => UI.esc(h.name)).join(', ') + '.<br>Завершить ход?', 'Завершить', 'Отмена'); if (!ok) return; }
    }
    G.busy = true; AV.V.busy = true;
    const ov = UI.$('#advOverlay');
    try {
      H3.Audio.play('turn');
      A.endPlayerTurn(st);
      while (st.players[st.turn].isAI && st.winner === null) {
        const p = st.players[st.turn];
        ov.textContent = 'Ход: ' + p.name + '…'; ov.classList.remove('hidden');
        await new Promise(r => setTimeout(r, 30));
        try { await H3.AI.playTurn(st, p.id, { battle: b => defendBattle(b), afterBattle: sum => defendResult(sum) }); } catch (e) { console.error('AI error', e); }
        A.endPlayerTurn(st);
      }
    } finally { ov.classList.add('hidden'); G.busy = false; AV.V.busy = false; }
    const day = st.day;
    showScreen('adv'); AV.invalidate(); refresh(false);
    if (S.dayOfWeek(day) === 1) { H3.Audio.play('week'); UI.toast('Новая неделя! Прирост существ в городах.', '', 'ic_day'); }
    else UI.toast(S.dateStr(day), '', 'ic_day');
    const p = st.players[st.turn];
    const hs = S.heroesOf(st, p.id);
    if (hs.length && !(selected() && !selected().dead)) selectHero(hs[0].id);
    if (selected()) AV.centerOn(selected().x, selected().y);
    save('auto');
    checkEnd();
  }
  async function defendBattle(b) {
    const humanSides = []; b.sides.forEach((s, i) => { if (s.player >= 0 && !G.state.players[s.player].isAI) humanSides.push(i); });
    UI.$('#advOverlay').classList.add('hidden');
    UI.toast('На вас напали!', 'warn');
    await BV.run(b, { human: humanSides });
    showScreen('adv');
  }
  async function defendResult(sum) { if (!sum) return; const me = G.state.players.find(p => !p.isAI); const involved = sum.res.sides.some(s => s.player === me.id); if (involved) { showScreen('adv'); AV.invalidate(); refresh(false); await battleResult(sum, null); } }
  function checkEnd() {
    const st = G.state; if (!st || st.winner === null) return;
    gameOver();
  }
  async function gameOver() {
    const st = G.state; const won = st.winner === 0;
    H3.Audio.play(won ? 'win' : 'lose');
    const d = st.day - 1;
    const html = '<div class="parch"><p>' + (won ? 'Все противники повержены. Эрафия ваша!' : 'Ваши города потеряны, а герои разбиты. Эрафия досталась ' + UI.esc((st.players[st.winner] || { name: 'врагу' }).name) + '.') + '</p>'
      + '<table class="t"><tr><td>Дней</td><td class="num">' + d + '</td></tr><tr><td>Боёв</td><td class="num">' + st.stats.battles + '</td></tr><tr><td>Побед</td><td class="num">' + st.stats.won + '</td></tr><tr><td>Убито врагов</td><td class="num">' + st.stats.killed + '</td></tr><tr><td>Потеряно существ</td><td class="num">' + st.stats.lost + '</td></tr><tr><td>Городов</td><td class="num">' + st.players[0].towns.length + '</td></tr></table></div>';
    await UI.modal({ title: won ? 'Победа!' : 'Поражение', html, buttons: [{ label: 'В меню', cls: 'primary' }], closable: false });
    try { localStorage.removeItem(SAVE_KEY + 'auto'); } catch (e) { /* ignore */ }
    G.state = null; menu();
  }

  /* ---------- сохранения ---------- */
  function save(slot) {
    if (!G.state) return false;
    try { G.state.selHero = G.selHero; localStorage.setItem(SAVE_KEY + slot, S.serialize(G.state)); return true; } catch (e) { UI.toast('Не удалось сохранить: ' + e.message, 'warn'); return false; }
  }
  function load(slot, probe) {
    try { const s = localStorage.getItem(SAVE_KEY + slot); if (!s) return null; if (probe) return true; const st = S.deserialize(s); G.selHero = st.selHero !== undefined ? st.selHero : null; return st; } catch (e) { if (!probe) UI.toast('Не удалось загрузить: ' + e.message, 'warn'); return null; }
  }
  function slotInfo(slot) { try { const s = localStorage.getItem(SAVE_KEY + slot); if (!s) return null; const m = /"day":(\d+)/.exec(s); const f = /"faction":"(\w+)"/.exec(s); return { day: m ? +m[1] : '?', faction: f ? f[1] : '' }; } catch (e) { return null; } }
  function saveDialog() {
    const rows = [1, 2, 3].map(i => { const inf = slotInfo(i); return { id: String(i), label: 'Слот ' + i, desc: inf ? S.dateStr(inf.day) + (inf.faction ? ', ' + F.get(inf.faction).name : '') : 'пусто' }; });
    UI.choose('Сохранить', 'Выберите слот:', rows).then(id => { if (id && save(id)) UI.toast('Сохранено в слот ' + id); });
  }
  function loadDialog() {
    const rows = ['auto', 1, 2, 3].map(i => { const inf = slotInfo(i); return { id: String(i), label: i === 'auto' ? 'Автосохранение' : 'Слот ' + i, desc: inf ? S.dateStr(inf.day) + (inf.faction ? ', ' + F.get(inf.faction).name : '') : 'пусто', disabled: !inf }; });
    UI.choose('Загрузить', 'Выберите сохранение:', rows).then(id => { if (!id) return; const st = load(id); if (st) start(st); });
  }
  function exportDialog() {
    if (!G.state) return;
    const s = btoa(unescape(encodeURIComponent(S.serialize(G.state))));
    UI.modal({ title: 'Экспорт партии', html: '<p class="small muted">Скопируйте текст и сохраните его; его можно вставить в «Импорт» на другом устройстве.</p><textarea style="width:100%;height:120px;font-size:10px">' + s + '</textarea>' });
  }
  function importDialog() {
    const ta = UI.el('textarea'); ta.style.cssText = 'width:100%;height:120px;font-size:10px';
    const wrap = UI.el('div', '', '<p class="small muted">Вставьте текст сохранения:</p>'); wrap.appendChild(ta);
    UI.modal({ title: 'Импорт партии', html: wrap, buttons: [{ label: 'Загрузить', cls: 'primary', value: true }, { label: 'Отмена', value: false }] }).then(v => { if (!v) return; try { const st = S.deserialize(decodeURIComponent(escape(atob(ta.value.trim())))); start(st); } catch (e) { UI.toast('Не удалось прочитать сохранение', 'warn'); } });
  }
  function openMenu() {
    const st = settings();
    const html = UI.el('div', 'col');
    html.innerHTML = '<div class="row wrap"><button id="mSave">Сохранить</button><button id="mLoad">Загрузить</button><button id="mExp">Экспорт</button><button id="mImp">Импорт</button></div>'
      + '<h4>Настройки</h4><div class="row wrap"><label><input type="checkbox" id="oSound" ' + (H3.Audio.isEnabled() ? 'checked' : '') + '> Звук</label><label><input type="checkbox" id="oConfirm" ' + (st.confirmEndTurn ? 'checked' : '') + '> Спрашивать при конце хода</label><label><input type="checkbox" id="oQuick" ' + (st.quickBattle ? 'checked' : '') + '> Быстрый бой (ИИ за меня)</label></div>'
      + '<div class="row">Скорость анимации: <div class="seg">' + ['мгновенно', 'обычно', 'быстро'].map((l, i) => '<button data-sp="' + i + '" class="' + (st.animSpeed === i ? 'on' : '') + '">' + l + '</button>').join('') + '</div></div>'
      + '<div class="row wrap" style="margin-top:8px"><button id="mHelp">Как играть</button><button id="mQuit" class="danger">Выйти в меню</button></div>'
      + '<div class="small muted">Сид карты: ' + (G.state ? G.state.seed : '') + '</div>';
    UI.modal({ title: 'Меню', html, buttons: [{ label: 'Закрыть', cls: 'primary' }], onOpen: (box, close) => {
      box.querySelector('#mSave').onclick = () => { close(); saveDialog(); };
      box.querySelector('#mLoad').onclick = () => { close(); loadDialog(); };
      box.querySelector('#mExp').onclick = () => { close(); exportDialog(); };
      box.querySelector('#mImp').onclick = () => { close(); importDialog(); };
      box.querySelector('#mHelp').onclick = () => { close(); help(); };
      box.querySelector('#mQuit').onclick = async () => { close(); if (await UI.confirm('Выход', 'Выйти в главное меню? Партия автосохранена.')) { save('auto'); G.state = null; menu(); } };
      box.querySelector('#oSound').onchange = e => H3.Audio.setEnabled(e.target.checked);
      box.querySelector('#oConfirm').onchange = e => { st.confirmEndTurn = e.target.checked; saveSettings(); };
      box.querySelector('#oQuick').onchange = e => { st.quickBattle = e.target.checked; saveSettings(); };
      box.querySelectorAll('[data-sp]').forEach(b => { b.onclick = () => { st.animSpeed = +b.dataset.sp; saveSettings(); box.querySelectorAll('[data-sp]').forEach(x => x.classList.toggle('on', x === b)); }; });
    } });
  }

  /* ---------- клавиши ---------- */
  function keys(e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'Escape') { UI.closeTop(); return; }
    if (G.screen === 'battle') { if (e.key === ' ') { BV.V.skip = true; setTimeout(() => { BV.V.skip = false; }, 80); e.preventDefault(); } return; }
    if (G.screen !== 'adv' || !G.state || UI.stackDepth()) return;
    const k = e.key.toLowerCase();
    const cam = AV.V.cam; const step = 64 / cam.z;
    if (k === 'arrowleft' || k === 'a') { cam.x -= step; AV.V.dirty = true; }
    else if (k === 'arrowright' || k === 'd') { cam.x += step; AV.V.dirty = true; }
    else if (k === 'arrowup' || k === 'w') { cam.y -= step; AV.V.dirty = true; }
    else if (k === 'arrowdown' || k === 's') { cam.y += step; AV.V.dirty = true; }
    else if (k === 'e' || k === 'enter') endTurn();
    else if (k === 'h') nextHero();
    else if (k === 't') { const h = selected(); const t = (h && A.townOfHero(G.state, h)) || S.townsOf(G.state, G.state.turn)[0]; if (t) openTown(t); }
    else if (k === 'c') openSpellbook();
    else if (k === '+' || k === '=') { const c = UI.$('#mapCanvas'); AV.V.cam.z = Math.min(3, AV.V.cam.z + 0.5); AV.resize(); }
    else if (k === '-') { AV.V.cam.z = Math.max(1, AV.V.cam.z - 0.5); AV.resize(); }
    else return;
    if (k.startsWith('arrow')) e.preventDefault();
    const m = G.state.map; cam.x = U.clamp(cam.x, 0, Math.max(0, m.w * 32 - AV.V.w / cam.z)); cam.y = U.clamp(cam.y, 0, Math.max(0, m.h * 32 - AV.V.h / cam.z));
  }

  /* ---------- запуск ---------- */
  function boot() {
    AV.init(); BV.init();
    window.addEventListener('keydown', keys);
    window.addEventListener('error', e => { console.error(e.error || e.message); try { UI.toast('Ошибка: ' + (e.message || 'см. консоль'), 'warn'); } catch (x) { /* ignore */ } });
    window.addEventListener('unhandledrejection', e => { console.error(e.reason); try { UI.toast('Ошибка: ' + ((e.reason && e.reason.message) || e.reason), 'warn'); } catch (x) { /* ignore */ } G.busy = false; if (AV.V) AV.V.busy = false; });
    document.addEventListener('pointerdown', () => H3.Audio.unlock(), { once: true });
    menu();
    const q = new URLSearchParams(location.search);
    if (q.get('autostart')) newGame({ size: q.get('size') || 'S', opponents: +(q.get('opp') || 1), difficulty: q.get('diff') || 'normal', faction: q.get('faction') || 'castle', hero: null, seed: +(q.get('seed') || 1), name: 'Игрок' });
  }

  H3.Game = { boot, settings, saveSettings, showScreen, selected, selectHero, nextHero, refresh, newGame, start, moveAlong, handleStop, fight, levelUps, openTown, openHero, openSpellbook, endTurn, openMenu, save, load, menu, help, get state() { return G.state; }, G };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(typeof window !== 'undefined' ? window : globalThis);
