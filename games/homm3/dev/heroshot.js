// Герой и город под палец на iPhone-размере: герой, деление стека кнопкой, долгое нажатие по отряду, встреча героев,
// книга заклинаний, повышение уровня, вкладки города, найм с быстрыми кнопками, рынок. node dev/heroshot.js [dir]
const { chromium, devices } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await br.newContext({ ...devices['iPhone 13'], locale: 'ru-RU' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const shot = async name => { console.log('shot', name); await page.screenshot({ path: path.join(dir, 'h_' + name + '.png') }); };
  const bottom = async () => { await page.evaluate(() => { const ms = document.querySelectorAll('.modal .body'); ms[ms.length - 1].scrollTop = 99999; }); await page.waitForTimeout(150); };
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html') + '?autostart=1&seed=3', { waitUntil: 'load' }); await page.waitForTimeout(900);
  await page.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); });
  // герой с артефактами, рюкзаком, машинами, навыками
  await page.evaluate(() => { const h = H3.Game.selected(); const ids = Object.keys(H3.Artifacts.BY_ID); h.arts.helm = ids[0]; h.backpack.push(ids[1], ids[2], ids[3]); h.machines = { ballista: true, first_aid_tent: true }; h.skills.logistics = 2; h.skills.wisdom = 1; h.spells.push('magic_arrow', 'haste', 'town_portal'); h.hasBook = true; H3.Game.openHero(h); });
  await page.waitForTimeout(600); await shot('hero'); await bottom(); await shot('hero_bottom');
  // тап по навыку — описание
  await page.evaluate(() => document.querySelector('[data-skill]').click()); await page.waitForTimeout(300);
  console.log('навык по тапу:', (await page.evaluate(() => { const ms = document.querySelectorAll('.modal'); return ms[ms.length - 1].textContent; })).slice(0, 60)); await page.evaluate(() => H3.UI.closeTop());
  // деление стека кнопкой: выбрать первый отряд → «Разделить» → число → тап по пустому слоту
  const slot = async i => { const p = await page.evaluate(i => { const s = document.querySelectorAll('#heroView .army7 .slot')[i]; const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, i); await page.touchscreen.tap(p[0], p[1]); await page.waitForTimeout(250); };
  await page.evaluate(() => { document.querySelector('.modal .body').scrollTop = 0; });
  await slot(0); console.log('панель выбора:', await page.evaluate(() => (document.querySelector('.selbar') || {}).textContent || 'нет')); await shot('hero_sel');
  await page.tap('[data-split]'); await page.waitForTimeout(300); await shot('hero_split_ask');
  await page.evaluate(() => { const b = [...document.querySelectorAll('.quick button')].find(x => /Половина/.test(x.textContent)); b.click(); });
  await page.evaluate(() => { const b = [...document.querySelectorAll('.modal .actions button')].pop().parentNode.querySelector('.primary'); b.click(); }); await page.waitForTimeout(300);
  console.log('после числа:', await page.evaluate(() => (document.querySelector('.selbar') || {}).textContent || 'нет'));
  await slot(5);
  console.log('армия после деления:', await page.evaluate(() => H3.Game.selected().army.map(s => s ? s.cid + '×' + s.n : '-').join(' ')));
  await shot('hero_after_split');
  // долгое нажатие по отряду — карточка существа
  const p0 = await page.evaluate(() => { const s = document.querySelectorAll('#heroView .army7 .slot')[0]; const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p0[0], y: p0[1] }] }); await page.waitForTimeout(700);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(300);
  console.log('долгое нажатие:', (await page.evaluate(() => { const ms = document.querySelectorAll('.modal'); return ms.length > 1 ? ms[ms.length - 1].textContent : 'нет карточки'; })).slice(0, 50)); await shot('hero_long'); await page.evaluate(() => H3.UI.closeTop());
  await page.evaluate(() => H3.UI.closeTop()); await page.waitForTimeout(200);
  // книга заклинаний
  await page.evaluate(() => { H3.Game.openSpellbook(); }); await page.waitForTimeout(400); await shot('spellbook'); await page.evaluate(() => H3.UI.closeTop());
  // встреча героев: второй герой нанимается, пока первый «вышел»
  const two = await page.evaluate(() => { const st = H3.Game.state; const t = H3.State.townsOf(st, 0)[0]; const h1 = H3.Game.selected(); t.buildings.tavern = true; t.tavern = H3.Rules.tavernCandidates(st, t, 2); const keep = t.visiting; t.visiting = null; const r = H3.Adventure.hireHero(st, t, t.tavern[0]); t.visiting = keep; if (!r.ok) return r.reason; r.hero.x = h1.x + 1; r.hero.backpack.push(Object.keys(H3.Artifacts.BY_ID)[5]); H3.HeroView.open(h1, r.hero); return 'ok'; });
  console.log('второй герой:', two); await page.waitForTimeout(600); await shot('exchange'); await bottom(); await shot('exchange_bottom');
  // рюкзак при встрече — выбор «Надеть/Передать»
  await page.evaluate(() => { document.querySelector('.modal .body').scrollTop = 0; });
  const bp = await page.evaluate(() => { const s = document.querySelector('#heroView .artslot[data-bp-i]'); const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await page.touchscreen.tap(bp[0], bp[1]); await page.waitForTimeout(300);
  console.log('рюкзак при встрече:', (await page.evaluate(() => { const ms = document.querySelectorAll('.modal'); return ms.length > 1 ? ms[ms.length - 1].textContent : 'нет выбора'; })).slice(0, 80)); await shot('exchange_bp');
  await page.evaluate(() => { const b = [...document.querySelectorAll('.choice button')].find(x => /Передать/.test(x.textContent)); if (b) b.click(); }); await page.waitForTimeout(300);
  console.log('рюкзаки:', await page.evaluate(() => { const st = H3.Game.state; return H3.State.heroesOf(st, 0).map(h => h.name + ':' + h.backpack.length).join(' '); }));
  await page.evaluate(() => H3.UI.closeTop()); await page.waitForTimeout(200);
  // повышение уровня
  await page.evaluate(() => { const h = H3.Game.selected(); h.xp += 3000; H3.Game.levelUps(h); }); await page.waitForTimeout(500); await shot('levelup');
  for (let k = 0; k < 3; k++) { await page.evaluate(() => { const b = document.querySelector('.choice button, .modal .actions button'); if (b) b.click(); }); await page.waitForTimeout(250); }
  // город: найм, рынок
  await page.evaluate(() => { const st = H3.Game.state; const t = H3.State.townsOf(st, 0)[0]; for (const b of ['market', 'fort', 'dwell_1', 'dwell_2', 'dwell_3', 'dwell_up_1', 'guild_1', 'blacksmith']) t.buildings[b] = true; H3.Game.openTown(t); });
  await page.waitForTimeout(900); await page.evaluate(() => { document.querySelectorAll('.toast').forEach(t => t.remove()); }); await shot('town');
  const tab = async re => { await page.evaluate(re => { const b = [...document.querySelectorAll('.tabs button')].find(x => new RegExp(re).test(x.textContent)); b.click(); }, re); await page.waitForTimeout(350); await bottom(); };
  await tab('Найм'); await shot('town_recruit');
  await page.evaluate(() => { const b = [...document.querySelectorAll('.dwell button')].find(x => x.textContent === 'Нанять' && !x.disabled); b.click(); }); await page.waitForTimeout(400); await shot('recruit_n');
  await page.evaluate(() => { [...document.querySelectorAll('.quick button')].find(x => /Все/.test(x.textContent)).click(); });
  console.log('быстрая кнопка «Все»:', await page.evaluate(() => document.querySelector('.modal:last-child input[type=number]').value));
  await page.evaluate(() => H3.UI.closeTop()); await tab('Рынок'); await shot('town_market');
  // гарнизон: выбрать отряд героя → панель → отмена
  await page.evaluate(() => { document.querySelector('.modal .body').scrollTop = 0; });
  const g = await page.evaluate(() => { const s = document.querySelectorAll('#townArmies .army7')[1].querySelector('.slot'); const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  await page.touchscreen.tap(g[0], g[1]); await page.waitForTimeout(250);
  console.log('город, панель выбора:', await page.evaluate(() => (document.querySelector('#townArmies .selbar') || {}).textContent || 'нет')); await shot('town_sel');
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
