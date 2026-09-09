/* ============================================================================
   view/editor.js — редактор карт: холст с кистями (местность, дороги,
   препятствия, объекты), палитра, настройки карты и целей, проверка,
   сохранение в браузере, экспорт/импорт JSON и запуск своей карты.
   Документ карты живёт в H3.MapEdit; здесь только интерфейс.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, F = H3.Factions, C = H3.Creatures, O = H3.Objects, AR = H3.Artifacts, UI = H3.UI, Sp = H3.Sprites, T = H3.Terrain, ME = H3.MapEdit, AV = H3.AdvView;
  const TILE = 32, MAPS_KEY = 'homm3.maps';

  const V = {
    doc: null, id: null, layer: 0, brush: { kind: 'terrain', value: 'grass' }, dirty: true,
    cam: { x: 0, y: 0, z: 1 }, canvas: null, ctx: null, bake: [null, null], w: 0, h: 0, dpr: 1,
    drag: null, painting: false, hover: null, raf: null, onExit: null, changed: false, lastCell: null, prev: null, miniDirty: true,
  };

  /* ---------- хранилище карт ---------- */
  function list() { try { return JSON.parse(localStorage.getItem(MAPS_KEY) || '{}'); } catch (e) { return {}; } }
  function writeAll(all) { try { localStorage.setItem(MAPS_KEY, JSON.stringify(all)); return true; } catch (e) { UI.toast('Не удалось сохранить: в браузере кончилось место', 'warn'); return false; } }
  function saveMap(doc, id) {
    const all = list();
    id = id || 'm' + Date.now().toString(36);
    all[id] = { name: doc.name, w: doc.w, h: doc.h, players: doc.players.length, updated: Date.now(), json: ME.toJSON(doc) };
    return writeAll(all) ? id : null;
  }
  function removeMap(id) { const all = list(); delete all[id]; writeAll(all); }
  function loadMap(id) { const rec = list()[id]; return rec ? ME.fromJSON(rec.json) : null; }

  /* ---------- палитра ---------- */
  const TERRAIN_TITLES = { grass: 'Трава', dirt: 'Земля', sand: 'Песок', snow: 'Снег', swamp: 'Болото', rough: 'Пустошь', lava: 'Лава', subter: 'Подземелье', water: 'Вода', rock: 'Скала' };
  const SIMPLE = ['chest', 'campfire', 'learning_stone', 'tree_knowledge', 'shrine_1', 'shrine_2', 'shrine_3', 'magic_well', 'fountain_fortune', 'temple', 'rally_flag', 'oasis',
    'windmill', 'water_wheel', 'witch_hut', 'arena', 'mercenary_camp', 'marletto_tower', 'star_axis', 'garden_revelation', 'observatory', 'trading_post', 'hill_fort', 'tavern',
    'shipyard', 'boat', 'flotsam', 'sea_chest', 'bank_crypt', 'bank_dwarven', 'bank_griffin', 'bank_utopia'];

  function paletteHtml() {
    let head = '<div class="edsec"><h4>Обзор</h4><canvas id="edMini" class="px"></canvas></div>';
    const b = (kind, value, label, title, extra) => '<button class="edb' + (isOn(kind, value) ? ' on' : '') + '" data-kind="' + kind + '" data-val="' + value + '" title="' + UI.esc(title || label) + '">' + (extra || '') + '<span>' + UI.esc(label) + '</span></button>';
    let h = head + '<div class="edsec"><h4>Инструменты</h4>' + b('pan', '', 'Обзор', 'Двигать карту') + b('erase', '', 'Ластик', 'Убрать объект / препятствие / дорогу') + '</div>';
    h += '<div class="edsec"><h4>Местность</h4><div class="edgrid">' + R.TERRAINS.map(t => '<button class="edb terr' + (isOn('terrain', t) ? ' on' : '') + '" data-kind="terrain" data-val="' + t + '" title="' + TERRAIN_TITLES[t] + '"><i style="background:' + terrColor(t) + '"></i><span>' + TERRAIN_TITLES[t] + '</span></button>').join('') + '</div></div>';
    h += '<div class="edsec"><h4>Поверх</h4>' + b('road', '1', 'Дорога') + b('obs', '1', 'Лес') + b('obs', '2', 'Горы') + b('obs', '3', 'Камни') + '</div>';
    h += '<div class="edsec"><h4>Ключевое</h4>' + b('town', '', 'Город…', 'Город: фракция и владелец') + b('mine', '', 'Шахта…') + b('monster', '', 'Стражи…') + b('dwelling', '', 'Жилище…') + b('resource', '', 'Ресурсы…') + b('artifact', '', 'Артефакт…') + b('gate', '', 'Врата (пара)', 'Ставит врата сразу на оба слоя') + '</div>';
    h += '<div class="edsec"><h4>Квесты и ключи</h4>' + b('seer', '', 'Провидец…', 'Хижина провидца: задание и награда') + b('questguard', '', 'Страж-квестор…', 'Проход по условию') + b('keymaster', '', 'Ключник…', 'Шатёр ключника: цвет') + b('border', '', 'Застава…', 'Пропускает с ключом цвета') + b('pandora', '', 'Ящик Пандоры…', 'Стражи и награда внутри') + '</div>';
    h += '<div class="edsec"><h4>Объекты</h4><div class="edgrid one">' + SIMPLE.map(t => b('simple', t, O.get(t).name, O.get(t).desc || O.get(t).name)).join('') + '</div></div>';
    return h;
  }
  function isOn(kind, value) { const br = V.brush; return br.kind === kind && (value === '' || String(br.value) === String(value)); }
  function terrColor(t) { const s = T.STYLE[t]; return (s && s.mini) || '#888'; }

  /* ---------- экран ---------- */
  function open(doc, id, onExit) {
    V.doc = doc; V.id = id || null; V.onExit = onExit || null; V.layer = 0; V.changed = false;
    V.bake = [null, null]; V.prev = null; V.cam = { x: 0, y: 0, z: 1 };
    H3.Game.showScreen('editor');
    V.canvas = UI.$('#edCanvas'); V.ctx = V.canvas.getContext('2d');
    if (!V.canvas._bound) { bindCanvas(); V.canvas._bound = true; }
    renderChrome();
    resize();
    if (!V.raf) V.raf = requestAnimationFrame(loop);
  }
  function close() {
    if (V.raf) { cancelAnimationFrame(V.raf); V.raf = null; }
    const cb = V.onExit; V.doc = null; V.onExit = null;
    if (cb) cb(); else H3.Game.menu();
  }
  function renderChrome() {
    UI.$('#edPalette').innerHTML = paletteHtml();
    UI.$('#edPalette').querySelectorAll('[data-kind]').forEach(btn => { btn.onclick = () => pickBrush(btn.dataset.kind, btn.dataset.val); });
    const mini = UI.$('#edMini');
    mini.addEventListener('pointerdown', e => {
      const r = mini.getBoundingClientRect();
      centerOn((e.clientX - r.left) / r.width * V.doc.w, (e.clientY - r.top) / r.height * V.doc.h);
    });
    V.miniDirty = true;
    const doc = V.doc;
    UI.$('#edTop').innerHTML = '<b class="edname">' + UI.esc(doc.name) + '</b>'
      + '<span class="small muted">' + doc.w + '×' + doc.h + ' · игроков ' + doc.players.length + '</span>'
      + '<div class="seg"><button data-lay="0" class="' + (V.layer === 0 ? 'on' : '') + '">Поверхность</button><button data-lay="1" class="' + (V.layer === 1 ? 'on' : '') + '">Подземелье</button></div>'
      + '<div class="grow"></div>'
      + '<button class="sm" id="edZoomOut">−</button><button class="sm" id="edZoomIn">+</button>'
      + '<button class="sm" id="edProps">Карта…</button><button class="sm" id="edGoals">Цели…</button>'
      + '<button class="sm" id="edCheck">Проверить</button><button class="sm" id="edSave">Сохранить</button>'
      + '<button class="sm" id="edShare">Экспорт</button><button class="sm primary" id="edPlay">Играть</button><button class="sm" id="edExit">Выход</button>';
    const $ = s => UI.$(s, UI.$('#edTop'));
    UI.$('#edTop').querySelectorAll('[data-lay]').forEach(b => { b.onclick = () => { V.layer = +b.dataset.lay; V.dirty = true; renderChrome(); }; });
    $('#edZoomIn').onclick = () => zoom(1); $('#edZoomOut').onclick = () => zoom(-1);
    $('#edProps').onclick = () => propsDialog();
    $('#edGoals').onclick = () => goalsDialog();
    $('#edCheck').onclick = () => checkDialog();
    $('#edSave').onclick = () => doSave();
    $('#edShare').onclick = () => exportDialog();
    $('#edPlay').onclick = () => play();
    $('#edExit').onclick = async () => {
      if (V.changed && !await UI.confirm('Выход', 'Несохранённые изменения пропадут. Выйти?', 'Выйти', 'Остаться')) return;
      close();
    };
  }

  /* ---------- кисти ---------- */
  async function pickBrush(kind, val) {
    if (kind === 'town') {
      const doc = V.doc;
      const owners = [{ id: '-1', label: 'Нейтральный' }].concat(doc.players.map((p, i) => ({ id: String(i), label: 'Игрок ' + (i + 1) + ' (' + F.PLAYER_NAMES[i] + ')' })));
      const owner = await UI.choose('Чей город', 'Кому принадлежит город? Каждому игроку нужен хотя бы один.', owners);
      if (owner === null) return;
      const fid = await UI.choose('Фракция города', 'Выберите фракцию.', F.LIST.map(f => ({ id: f.id, label: f.name, desc: f.desc })));
      if (!fid) return;
      const own = +owner;
      if (own >= 0) { V.doc.players[own].faction = fid; V.changed = true; }
      V.brush = { kind: 'object', type: 'town', opts: { faction: fid, owner: own } };
    } else if (kind === 'mine') {
      const res = await UI.choose('Шахта', 'Что добывает?', U.RES.map(r => ({ id: r, label: O.MINE_NAMES[r] })));
      if (!res) return;
      V.brush = { kind: 'object', type: 'mine', opts: { res } };
    } else if (kind === 'resource') {
      const res = await UI.choose('Ресурсы', 'Что лежит?', U.RES.map(r => ({ id: r, label: O.RES_NAMES[r] })));
      if (!res) return;
      const n = await UI.askNumber('Сколько', O.RES_NAMES[res], res === 'gold' ? 5000 : 30, res === 'gold' ? 1000 : 5);
      if (!n) return;
      V.brush = { kind: 'object', type: 'resource', opts: { res, amount: n } };
    } else if (kind === 'monster') {
      const cid = await pickCreature('Стражи', 'Кто стоит на страже?');
      if (!cid) return;
      const n = await UI.askNumber('Численность', C.get(cid).name, 500, 20);
      if (!n) return;
      const ch = await UI.choose('Нрав', 'Как стражи встречают героя?', [
        { id: 'aggressive', label: 'Обычные', desc: 'Могут присоединиться за золото' },
        { id: 'friendly', label: 'Дружелюбные', desc: 'Охотнее присоединяются' },
        { id: 'hostile', label: 'Злобные', desc: 'Всегда дерутся' }]);
      if (!ch) return;
      V.brush = { kind: 'object', type: 'monster', opts: { cid, n, character: ch } };
    } else if (kind === 'dwelling') {
      const cid = await pickCreature('Жилище', 'Кто здесь нанимается?');
      if (!cid) return;
      V.brush = { kind: 'object', type: 'dwelling', opts: { cid } };
    } else if (kind === 'artifact') {
      const cls = await UI.choose('Артефакт', 'Какого класса?', [{ id: 'treasure', label: 'Малый' }, { id: 'minor', label: 'Средний' }, { id: 'major', label: 'Большой' }, { id: 'relic', label: 'Реликвия' }, { id: 'exact', label: 'Выбрать конкретный' }]);
      if (!cls) return;
      if (cls === 'exact') {
        const art = await UI.choose('Артефакт', 'Какой именно?', AR.LIST.map(a => ({ id: a.id, label: a.name, desc: a.desc })));
        if (!art) return;
        V.brush = { kind: 'object', type: 'artifact', opts: { art } };
      } else V.brush = { kind: 'object', type: 'artifact', opts: { art: 'random', cls } };
    } else if (kind === 'seer' || kind === 'questguard' || kind === 'pandora') {
      const tier = await UI.choose(kind === 'pandora' ? 'Ящик Пандоры' : 'Задание', 'Насколько сложным сделать?', [{ id: '1', label: 'Лёгкое', desc: 'для стартовой зоны' }, { id: '2', label: 'Среднее' }, { id: '3', label: 'Трудное', desc: 'для сокровищницы' }]);
      if (!tier) return;
      const type = kind === 'seer' ? 'seer_hut' : kind === 'questguard' ? 'quest_guard' : 'pandora_box';
      V.brush = { kind: 'object', type, opts: { tier: +tier, qctx: { arts: V.doc.objects.filter(o => o.type === 'artifact' && o.art !== 'random').map(o => o.art), cids: V.doc.objects.filter(o => o.type === 'dwelling').map(o => o.cid) } } };
    } else if (kind === 'keymaster' || kind === 'border') {
      const color = await UI.choose(kind === 'keymaster' ? 'Ключник' : 'Застава', 'Какого цвета?', H3.Quest.COLOR_IDS.map(c => ({ id: c, label: H3.Quest.KEY_COLORS[c].name })));
      if (!color) return;
      V.brush = { kind: 'object', type: kind === 'keymaster' ? 'keymaster' : 'border_guard', opts: { color } };
    } else if (kind === 'gate') {
      V.brush = { kind: 'gate' };
    } else if (kind === 'simple') {
      V.brush = { kind: 'object', type: val, opts: {} };
    } else {
      V.brush = { kind, value: kind === 'obs' || kind === 'road' ? +val : val };
    }
    renderChrome();
  }
  function pickCreature(title, text) {
    const byTier = {};
    for (const c of C.LIST) (byTier[c.tier] = byTier[c.tier] || []).push(c);
    const wrap = UI.el('div', '', '<div class="small muted">' + UI.esc(text) + '</div>');
    let resolveFn = null;
    for (let t = 1; t <= 7; t++) {
      const row = UI.el('div', 'edcreatures');
      row.innerHTML = '<b class="small">' + t + ' уровень</b>' + byTier[t].map(c => '<button class="edb" data-c="' + c.id + '" title="' + UI.esc(c.name + ' · ' + F.get(c.faction).name) + '">' + UI.icon(c.id, 1) + '</button>').join('');
      wrap.appendChild(row);
    }
    return new Promise(resolve => {
      UI.modal({ title, html: wrap, wide: true, buttons: [{ label: 'Отмена', value: null }], onOpen: (box, close) => {
        resolveFn = close;
        box.querySelectorAll('[data-c]').forEach(b => { b.onclick = () => resolveFn(b.dataset.c); });
      } }).then(v => resolve(v || null));
    });
  }

  /* ---------- правка документа ---------- */
  function objAtCell(x, y, z) {
    for (const o of V.doc.objects) { if ((o.z || 0) !== z) continue; for (const [cx, cy] of ME.cellsOf(o)) if (cx === x && cy === y) return o; }
    return null;
  }
  function apply(x, y, alt) {
    const doc = V.doc, z = V.layer, i = y * doc.w + x, lv = doc.levels[z], br = V.brush;
    if (x < 0 || y < 0 || x >= doc.w || y >= doc.h) return;
    const kind = alt ? 'erase' : br.kind;
    if (kind === 'pan') return;
    if (kind === 'erase') {
      const o = objAtCell(x, y, z);
      if (o) { removeObj(o); return; }
      if (lv.obs[i]) { lv.obs[i] = 0; touch(); return; }
      if (lv.road[i]) { lv.road[i] = 0; touch(); return; }
      return;
    }
    if (kind === 'terrain') { if (lv.terrain[i] === R.TERRAIN_INDEX[br.value]) return; lv.terrain[i] = R.TERRAIN_INDEX[br.value]; touch(); return; }
    if (kind === 'road') { if (lv.road[i]) return; lv.road[i] = 1; touch(); return; }
    if (kind === 'obs') { if (objAtCell(x, y, z)) return; if (lv.obs[i] === br.value) return; lv.obs[i] = br.value; touch(); return; }
    if (kind === 'gate') {
      if (objAtCell(x, y, 0) || objAtCell(x, y, 1)) { UI.toast('Клетка занята', 'warn'); return; }
      const pair = doc.nextPair = (doc.nextPair || 1);
      doc.objects.push(ME.makeObj('subter_gate', x, y, 0, { pair }));
      doc.objects.push(ME.makeObj('subter_gate', x, y, 1, { pair }));
      doc.nextPair = pair + 1;
      doc.levels[0].obs[i] = 0; doc.levels[1].obs[i] = 0;
      if (doc.levels[1].terrain[i] === R.TERRAIN_INDEX.rock) doc.levels[1].terrain[i] = R.TERRAIN_INDEX.subter;
      touch(); return;
    }
    if (kind === 'object') {
      const obj = ME.makeObj(br.type, x, y, z, br.opts);
      for (const [cx, cy] of ME.cellsOf(obj)) {
        if (cx < 0 || cy < 0 || cx >= doc.w || cy >= doc.h) { UI.toast('Объект не влезает', 'warn'); return; }
        if (objAtCell(cx, cy, z)) { UI.toast('Клетка занята', 'warn'); return; }
      }
      // под объектом препятствий быть не должно, вода — только под морскими
      for (const [cx, cy] of ME.cellsOf(obj)) lv.obs[cy * doc.w + cx] = 0;
      if (!O.get(obj.type).sea) {
        const ti = lv.terrain[i];
        if (ti === R.TERRAIN_INDEX.rock || ti === R.TERRAIN_INDEX.water) lv.terrain[i] = R.TERRAIN_INDEX[z ? 'subter' : 'grass'];
      }
      if (obj.type === 'town') { for (let dx = -2; dx <= 2; dx++) for (let dy = -1; dy <= 1; dy++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= doc.w || ny >= doc.h) continue; lv.obs[ny * doc.w + nx] = 0; if (lv.terrain[ny * doc.w + nx] === R.TERRAIN_INDEX.rock) lv.terrain[ny * doc.w + nx] = R.TERRAIN_INDEX[z ? 'subter' : 'grass']; } }
      doc.objects.push(obj);
      touch();
    }
  }
  function removeObj(o) {
    const doc = V.doc;
    const i = doc.objects.indexOf(o); if (i < 0) return;
    doc.objects.splice(i, 1);
    // врата уходят парой: одиночные никуда не ведут
    if (o.type === 'subter_gate') { const twin = doc.objects.find(x => x.type === 'subter_gate' && x.pair === o.pair); if (twin) doc.objects.splice(doc.objects.indexOf(twin), 1); }
    touch();
  }
  function touch() { V.changed = true; V.dirty = true; V.prev = null; V.bake[V.layer] = null; }

  /* ---------- диалоги ---------- */
  function propsDialog() {
    const doc = V.doc;
    const html = '<div class="opt"><label>Название</label><input id="pName" type="text" value="' + UI.esc(doc.name) + '" style="width:220px"></div>'
      + '<div class="opt"><label>Описание</label><input id="pDesc" type="text" value="' + UI.esc(doc.desc || '') + '" style="width:220px"></div>'
      + '<div class="opt"><label>Сложность</label><select id="pDiff">' + Object.keys(H3.State.DIFFICULTY).map(k => '<option value="' + k + '"' + (doc.difficulty === k ? ' selected' : '') + '>' + H3.State.DIFFICULTY[k].name + '</option>').join('') + '</select></div>'
      + '<div class="opt"><label>Игроков</label><select id="pNum">' + [2, 3, 4].map(n => '<option value="' + n + '"' + (doc.players.length === n ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></div>'
      + '<div class="small muted">Игрок 1 — вы, остальными управляет ИИ. Фракция игрока берётся от фракции его города.</div>'
      + '<div id="pPlayers"></div>';
    UI.modal({ title: 'Карта', html, buttons: [{ label: 'Готово', cls: 'primary', value: 'ok' }], onOpen: box => {
      const q = sel => box.querySelector(sel);
      const drawPlayers = () => {
        q('#pPlayers').innerHTML = doc.players.map((p, i) => '<div class="row"><span class="pcolor" style="background:' + F.PLAYER_COLORS[i] + '"></span>Игрок ' + (i + 1)
          + ' — ' + UI.esc(F.get(p.faction).name) + ' <span class="small muted">' + (i === 0 ? 'человек' : 'ИИ') + '</span>'
          + ' <span class="small ' + (doc.objects.some(o => o.type === 'town' && o.owner === i) ? 'green' : 'red') + '">' + (doc.objects.some(o => o.type === 'town' && o.owner === i) ? 'город есть' : 'города нет') + '</span></div>').join('');
      };
      drawPlayers();
      const upd = () => { doc.name = q('#pName').value || 'Карта'; doc.desc = q('#pDesc').value; doc.difficulty = q('#pDiff').value; V.changed = true; renderChrome(); };
      q('#pName').oninput = upd; q('#pDesc').oninput = upd; q('#pDiff').onchange = upd;
      q('#pNum').onchange = e => {
        const n = +e.target.value;
        while (doc.players.length < n) doc.players.push({ faction: F.LIST[doc.players.length % F.LIST.length].id, ai: true });
        while (doc.players.length > n) { const idx = doc.players.length - 1; doc.objects = doc.objects.filter(o => !(o.type === 'town' && o.owner === idx)); doc.players.pop(); }
        touch(); drawPlayers(); renderChrome();
      };
    } });
  }
  const WIN_GOALS = [
    { type: 'kill_all', label: 'Победить всех противников' },
    { type: 'capture_town', of: 'enemy', label: 'Захватить город врага' },
    { type: 'capture_all_towns', label: 'Захватить все города' },
    { type: 'gather', res: 'gold', amount: 50000, label: 'Накопить 50 000 золота', num: 'amount' },
    { type: 'find_artifact', label: 'Найти артефакт', art: true },
    { type: 'survive', days: 50, label: 'Продержаться 50 дней', num: 'days' },
  ];
  const LOSE_GOALS = [
    { type: 'lose_all', label: 'Потерять все города и героев' },
    { type: 'lose_hero', of: 'mine', label: 'Потерять главного героя' },
    { type: 'timeout', days: 60, label: 'Не уложиться в срок', num: 'days' },
  ];
  function goalsDialog() {
    const doc = V.doc;
    const has = (arr, t) => (arr || []).some(g => g.type === t);
    const row = (g, arr) => '<label class="edrow"><input type="checkbox" data-g="' + g.type + '" data-side="' + arr + '"' + (has(doc.goals[arr], g.type) ? ' checked' : '') + '> ' + UI.esc(g.label) + '</label>'
      + (g.num ? '<input class="ednum" type="number" data-n="' + g.type + '" data-side="' + arr + '" value="' + ((doc.goals[arr].find(x => x.type === g.type) || {})[g.num] || g[g.num]) + '" style="width:90px">' : '')
      + (g.art ? '<select class="edart" data-a="' + g.type + '">' + AR.LIST.map(a => '<option value="' + a.id + '"' + (((doc.goals.win.find(x => x.type === 'find_artifact') || {}).art === a.id) ? ' selected' : '') + '>' + UI.esc(a.name) + '</option>').join('') + '</select>' : '');
    const html = '<div class="parch small">Победа — любое из отмеченных условий. Поражение проверяется раньше победы.</div>'
      + '<h4>Победа</h4>' + WIN_GOALS.map(g => '<div class="row">' + row(g, 'win') + '</div>').join('')
      + '<h4>Поражение</h4>' + LOSE_GOALS.map(g => '<div class="row">' + row(g, 'lose') + '</div>').join('');
    UI.modal({ title: 'Условия сценария', html, buttons: [{ label: 'Готово', cls: 'primary', value: 'ok' }], onOpen: (box, close) => {
      const collect = () => {
        const out = { win: [], lose: [] };
        box.querySelectorAll('[data-g]').forEach(cb => {
          if (!cb.checked) return;
          const side = cb.dataset.side, type = cb.dataset.g;
          const src = (side === 'win' ? WIN_GOALS : LOSE_GOALS).find(g => g.type === type);
          const g = { type };
          if (src.of) g.of = src.of;
          if (src.num) { const inp = box.querySelector('[data-n="' + type + '"][data-side="' + side + '"]'); g[src.num] = Math.max(1, +inp.value || src[src.num]); if (type === 'gather') g.res = 'gold'; }
          if (src.art) { const sel = box.querySelector('[data-a="' + type + '"]'); g.art = sel.value; }
          out[side].push(g);
        });
        if (!out.win.length) out.win.push({ type: 'kill_all' });
        if (!out.lose.length) out.lose.push({ type: 'lose_all' });
        doc.goals = out; V.changed = true;
      };
      box.addEventListener('change', collect);
      box.addEventListener('input', collect);
    } });
  }
  function checkDialog() {
    const problems = ME.validate(V.doc);
    if (!problems.length) { UI.alert('Проверка', '<div class="parch"><p>Ошибок нет — карту можно играть.</p></div>'); return true; }
    const bad = problems.filter(p => p.bad);
    UI.alert(bad.length ? 'Карта не готова' : 'Замечания', '<div class="parch"><ul>' + problems.map(p => '<li class="' + (p.bad ? 'red' : 'muted') + '">' + UI.esc(p.text) + '</li>').join('') + '</ul></div>');
    return !bad.length;
  }
  function doSave() {
    const id = saveMap(V.doc, V.id);
    if (id) { V.id = id; V.changed = false; UI.toast('Карта «' + V.doc.name + '» сохранена'); }
  }
  function exportDialog() {
    const json = ME.toJSON(V.doc);
    UI.modal({ title: 'Экспорт карты', wide: true, html: '<div class="small muted">Скопируйте текст — его можно вставить обратно через «Импорт» в списке карт.</div><textarea id="edJson" style="width:100%;height:220px" readonly>' + UI.esc(json) + '</textarea>',
      buttons: [{ label: 'Выделить всё', value: 'sel', onClick: box => { const t = UI.$('#edJson', box); t.focus(); t.select(); return false; } }, { label: 'Закрыть', cls: 'primary', value: null }] });
  }
  async function play() {
    if (!checkDialog()) return;
    if (V.changed && V.id) saveMap(V.doc, V.id);
    H3.Game.playCustom(ME.clone(V.doc));
  }

  /* ---------- холст ---------- */
  function bindCanvas() {
    const c = V.canvas;
    c.addEventListener('pointerdown', e => {
      c.setPointerCapture(e.pointerId);
      const t = tileAt(e.offsetX, e.offsetY);
      if (V.brush.kind === 'pan' || e.button === 1 || e.shiftKey) { V.drag = { x: e.offsetX, y: e.offsetY, cx: V.cam.x, cy: V.cam.y }; return; }
      V.painting = true; V.lastCell = null;
      if (t) { apply(t[0], t[1], e.button === 2); V.lastCell = t; }
    });
    c.addEventListener('pointermove', e => {
      const t = tileAt(e.offsetX, e.offsetY);
      V.hover = t; V.dirty = true;
      if (V.drag) { V.cam.x = V.drag.cx - (e.offsetX - V.drag.x) / V.cam.z; V.cam.y = V.drag.cy - (e.offsetY - V.drag.y) / V.cam.z; clampCam(); return; }
      if (!V.painting || !t) return;
      if (V.lastCell && V.lastCell[0] === t[0] && V.lastCell[1] === t[1]) return;
      V.lastCell = t;
      // объекты ставим по одному клику, кистями можно возить
      if (V.brush.kind === 'terrain' || V.brush.kind === 'road' || V.brush.kind === 'obs' || V.brush.kind === 'erase' || e.buttons === 2) apply(t[0], t[1], e.buttons === 2);
    });
    const up = () => { V.painting = false; V.drag = null; };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    c.addEventListener('contextmenu', e => e.preventDefault());
    c.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY < 0 ? 1 : -1, e.offsetX, e.offsetY); }, { passive: false });
    window.addEventListener('resize', () => { if (H3.Game.G.screen === 'editor') resize(); });
  }
  function resize() {
    const box = UI.$('#edCanvasWrap'); if (!box || !V.canvas) return;
    V.dpr = window.devicePixelRatio || 1;
    V.w = box.clientWidth; V.h = box.clientHeight;
    V.canvas.width = Math.round(V.w * V.dpr); V.canvas.height = Math.round(V.h * V.dpr);
    V.canvas.style.width = V.w + 'px'; V.canvas.style.height = V.h + 'px';
    clampCam(); V.dirty = true;
  }
  function zoom(dir, px, py) {
    const old = V.cam.z;
    V.cam.z = U.clamp(+(V.cam.z + dir * 0.25).toFixed(2), 0.35, 2);
    if (px !== undefined) { V.cam.x += px / old - px / V.cam.z; V.cam.y += py / old - py / V.cam.z; }
    clampCam(); V.dirty = true;
  }
  function clampCam() {
    const doc = V.doc; if (!doc) return;
    V.cam.x = U.clamp(V.cam.x, -20, Math.max(0, doc.w * TILE - V.w / V.cam.z + 20));
    V.cam.y = U.clamp(V.cam.y, -20, Math.max(0, doc.h * TILE - V.h / V.cam.z + 20));
  }
  function tileAt(px, py) {
    const x = Math.floor((px / V.cam.z + V.cam.x) / TILE), y = Math.floor((py / V.cam.z + V.cam.y) / TILE);
    return (x >= 0 && y >= 0 && x < V.doc.w && y < V.doc.h) ? [x, y] : null;
  }
  /** Состояние-заглушка для рендера: местность и объекты рисуются игровым кодом. */
  function previewState() {
    if (V.prev) return V.prev;
    const doc = V.doc;
    const full = new Uint8Array(doc.w * doc.h).fill(2);   // в редакторе тумана нет
    const st = {
      seed: 12345, day: 1, turn: 0, heroes: {}, objects: {}, towns: {},
      players: doc.players.map((p, i) => ({ id: i, color: F.PLAYER_COLORS[i], name: F.PLAYER_NAMES[i], vis: [full, full] })),
      levels: doc.levels.map(l => ({ w: doc.w, h: doc.h, terrain: l.terrain, road: l.road, obs: l.obs })),
    };
    let id = 1;
    for (const src of doc.objects) {
      const o = Object.assign({}, src, { id: id++ });
      if (src.type === 'town') { st.towns[o.id] = { id: o.id, faction: src.faction, owner: src.owner, name: '', buildings: { hall_1: true }, garrison: [] }; o.townId = o.id; }
      if (src.type === 'dwelling') o.cid = src.cid;
      st.objects[o.id] = o;
    }
    return (V.prev = st);
  }
  function centerOn(tx, ty) {
    V.cam.x = (tx + 0.5) * TILE - V.w / V.cam.z / 2;
    V.cam.y = (ty + 0.5) * TILE - V.h / V.cam.z / 2;
    clampCam(); V.dirty = true;
  }
  function drawMini(st) {
    const cv = UI.$('#edMini'); if (!cv) return;
    T.renderMini(st, 0, cv, V.layer);
    const ctx = cv.getContext('2d');
    // рамка видимой области
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(V.cam.x / TILE) + 0.5, Math.round(V.cam.y / TILE) + 0.5, Math.round(V.w / V.cam.z / TILE), Math.round(V.h / V.cam.z / TILE));
    V.miniDirty = false;
  }
  function loop(ts) {
    V.raf = requestAnimationFrame(loop);
    if (!V.doc || H3.Game.G.screen !== 'editor') return;
    draw(ts);
  }
  function draw(ts) {
    const doc = V.doc, ctx = V.ctx, z = V.cam.z, dpr = V.dpr;
    const st = previewState();
    if (!V.bake[V.layer]) V.bake[V.layer] = T.renderMap(st, V.layer);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#101014'; ctx.fillRect(0, 0, V.canvas.width, V.canvas.height);
    ctx.setTransform(z * dpr, 0, 0, z * dpr, -Math.round(V.cam.x * z * dpr), -Math.round(V.cam.y * z * dpr));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(V.bake[V.layer], 0, 0);
    // объекты этого слоя по рядам
    const items = Object.values(st.objects).filter(o => (o.z || 0) === V.layer).sort((a, b) => a.y - b.y);
    for (const o of items) AV.drawObject(ctx, st, o, null, ts);
    // сетка и курсор
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1 / z;
    ctx.beginPath();
    for (let x = 0; x <= doc.w; x++) { ctx.moveTo(x * TILE, 0); ctx.lineTo(x * TILE, doc.h * TILE); }
    for (let y = 0; y <= doc.h; y++) { ctx.moveTo(0, y * TILE); ctx.lineTo(doc.w * TILE, y * TILE); }
    ctx.stroke();
    drawMini(st);
    if (V.hover) { ctx.strokeStyle = '#f1cf74'; ctx.lineWidth = 2 / z; ctx.strokeRect(V.hover[0] * TILE + 1, V.hover[1] * TILE + 1, TILE - 2, TILE - 2); }
    ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 2 / z; ctx.strokeRect(0, 0, doc.w * TILE, doc.h * TILE);
    V.dirty = false;
  }

  H3.Editor = { open, close, list, saveMap, removeMap, loadMap, V, MAPS_KEY, resize };
})(typeof window !== 'undefined' ? window : globalThis);
