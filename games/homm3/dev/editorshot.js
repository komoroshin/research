// Прогон редактора карт: создание, кисти, объекты, проверка, сохранение, игра.
// node dev/editorshot.js [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || '/tmp/editor.png';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|ERR_FAILED|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'load' });
  await page.waitForTimeout(700);

  // меню → свои карты → создать карту (S, 2 игрока)
  await page.click('#btnMaps'); await page.waitForTimeout(300);
  await page.click('#mapNew'); await page.waitForTimeout(300);
  await page.click('.choice button'); await page.waitForTimeout(300);      // маленькая
  await page.click('.choice button'); await page.waitForTimeout(500);      // 2 игрока
  console.log('экран редактора:', await page.evaluate(() => H3.Game.G.screen), '| кистей в палитре:', await page.evaluate(() => document.querySelectorAll('#edPalette .edb').length));

  // рисуем: местность, дорога, лес — через модель (кисти проверяем отдельно кликом)
  const built = await page.evaluate(() => {
    const E = H3.Editor, ME = H3.MapEdit, R = H3.Rules;
    const doc = E.V.doc;
    doc.name = 'Тестовая долина';
    for (let y = 10; y < 20; y++) for (let x = 4; x < 30; x++) doc.levels[0].terrain[y * doc.w + x] = R.TERRAIN_INDEX.sand;
    for (let x = 8; x < 28; x++) doc.levels[0].road[14 * doc.w + x] = 1;
    for (let x = 6; x < 12; x++) doc.levels[0].obs[18 * doc.w + x] = 1;
    for (let y = 6; y < 14; y++) for (let x = 20; x < 30; x++) doc.levels[1].terrain[y * doc.w + x] = R.TERRAIN_INDEX.subter;
    doc.objects.push(ME.makeObj('town', 8, 14, 0, { faction: 'castle', owner: 0 }));
    doc.objects.push(ME.makeObj('town', 26, 14, 0, { faction: 'necropolis', owner: 1 }));
    doc.objects.push(ME.makeObj('mine', 12, 12, 0, { res: 'ore' }));
    doc.objects.push(ME.makeObj('monster', 16, 14, 0, { cid: 'griffin', n: 14 }));
    doc.objects.push(ME.makeObj('resource', 11, 16, 0, { res: 'gold', amount: 1500 }));
    doc.objects.push(ME.makeObj('artifact', 14, 17, 0, { art: 'random', cls: 'major' }));
    doc.objects.push(ME.makeObj('windmill', 18, 11, 0, {}));
    doc.objects.push(ME.makeObj('subter_gate', 24, 12, 0, { pair: 1 }));
    doc.objects.push(ME.makeObj('subter_gate', 24, 12, 1, { pair: 1 }));
    doc.players[1].faction = 'necropolis';
    E.V.prev = null; E.V.bake = [null, null]; E.V.changed = true;
    return { objects: doc.objects.length };
  });
  console.log('объектов в документе:', built.objects);

  // кисть «лес» кликом по холсту — проверяем реальный ввод
  await page.evaluate(() => { const b = [...document.querySelectorAll('#edPalette .edb')].find(x => x.textContent.trim() === 'Лес'); b.click(); });
  const box = await page.$eval('#edCanvas', c => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y }; });
  await page.mouse.move(box.x + 300, box.y + 300); await page.mouse.down(); await page.mouse.move(box.x + 360, box.y + 300, { steps: 8 }); await page.mouse.up();
  await page.waitForTimeout(400);
  const painted = await page.evaluate(() => { const d = H3.Editor.V.doc; let n = 0; for (let i = 0; i < d.levels[0].obs.length; i++) if (d.levels[0].obs[i] === 1) n++; return n; });
  console.log('клеток леса после мазка:', painted);
  await page.screenshot({ path: out });

  // подземелье
  await page.evaluate(() => document.querySelector('[data-lay="1"]').click());
  await page.waitForTimeout(500);
  await page.screenshot({ path: out.replace('.png', '_under.png') });
  await page.evaluate(() => document.querySelector('[data-lay="0"]').click());

  // проверка карты
  await page.click('#edCheck'); await page.waitForTimeout(300);
  console.log('проверка:', (await page.evaluate(() => document.querySelector('.modal .body').textContent)).slice(0, 160));
  await page.screenshot({ path: out.replace('.png', '_check.png') });
  await page.evaluate(() => H3.UI.closeTop());

  // цели сценария: отмечаем «захватить город врага» и срок
  await page.click('#edGoals'); await page.waitForTimeout(300);
  await page.evaluate(() => {
    const box = document.querySelector('.modal .body');
    box.querySelector('[data-g="capture_town"]').click();
    box.querySelector('[data-g="kill_all"]').click();      // снимаем
    const t = box.querySelector('[data-g="timeout"]'); t.click();
    const n = box.querySelector('[data-n="timeout"]'); n.value = '45'; n.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.screenshot({ path: out.replace('.png', '_goals.png') });
  await page.evaluate(() => H3.UI.closeTop());
  console.log('цели:', await page.evaluate(() => JSON.stringify(H3.Editor.V.doc.goals)));

  // настройки карты: переименование и третий игрок
  await page.click('#edProps'); await page.waitForTimeout(300);
  await page.evaluate(() => {
    const box = document.querySelector('.modal .body');
    const n = box.querySelector('#pName'); n.value = 'Долина трёх'; n.dispatchEvent(new Event('input', { bubbles: true }));
    const num = box.querySelector('#pNum'); num.value = '3'; num.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(200);
  console.log('после настроек:', await page.evaluate(() => { const d = H3.Editor.V.doc; return JSON.stringify({ name: d.name, players: d.players.length, msg: document.querySelector('#pPlayers').textContent.replace(/\s+/g, ' ').trim() }); }));
  await page.screenshot({ path: out.replace('.png', '_props.png') });
  await page.evaluate(() => H3.UI.closeTop());
  // третьему игроку города нет — проверка обязана ругаться
  await page.click('#edCheck'); await page.waitForTimeout(300);
  console.log('проверка с третьим игроком:', (await page.evaluate(() => document.querySelector('.modal .body').textContent)).slice(0, 120));
  await page.evaluate(() => H3.UI.closeTop());
  // возвращаем двух игроков и цели по умолчанию
  await page.evaluate(() => { const d = H3.Editor.V.doc; d.players.pop(); d.goals = { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] }; });

  // сохранение и список карт
  await page.click('#edSave'); await page.waitForTimeout(300);
  console.log('в хранилище карт:', await page.evaluate(() => Object.values(H3.Editor.list()).map(m => m.name + ' ' + m.w + 'x' + m.h)));

  // экспорт/импорт кругом
  const roundtrip = await page.evaluate(() => {
    const ME = H3.MapEdit, doc = H3.Editor.V.doc;
    const back = ME.fromJSON(ME.toJSON(doc));
    return { bytes: ME.toJSON(doc).length, ok: back.objects.length === doc.objects.length && back.levels[0].terrain[14 * doc.w + 10] === doc.levels[0].terrain[14 * doc.w + 10] };
  });
  console.log('экспорт:', JSON.stringify(roundtrip));

  // играем свою карту
  await page.click('#edPlay'); await page.waitForTimeout(600);
  await page.evaluate(() => H3.UI.closeTop());  // «ошибок нет»
  await page.waitForTimeout(1500);
  const game = await page.evaluate(() => {
    const st = H3.Game.state; if (!st) return { screen: H3.Game.G.screen };
    const h = H3.State.heroesOf(st, 0)[0];
    const pf = H3.State.pathfield(st, h);
    return { screen: H3.Game.G.screen, players: st.players.map(p => p.faction), towns: Object.keys(st.towns).length,
      objects: Object.keys(st.objects).length, hero: h.name + '@' + h.x + ',' + h.y, reach: pf.dist.filter(d => d < Infinity).length };
  });
  console.log('партия:', JSON.stringify(game));
  await page.screenshot({ path: out.replace('.png', '_play.png') });

  // ход ИИ проходит
  await page.evaluate(() => { H3.Game.settings().confirmEndTurn = false; H3.Game.endTurn(); });
  await page.waitForTimeout(4000);
  console.log('после хода:', await page.evaluate(() => { const st = H3.Game.state; return JSON.stringify({ day: st.day, log: st.log.slice(-2).map(l => l.text) }); }));

  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
