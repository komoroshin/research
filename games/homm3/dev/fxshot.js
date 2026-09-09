// Скриншоты спецэффектов боя: заклинания, выстрелы, гибель, погода. node dev/fxshot.js [dir]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2] || '/tmp';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const shot = async (name, ms) => { await page.waitForTimeout(ms || 0); await page.screenshot({ path: path.join(dir, 'fx_' + name + '.png') }); };
  const start = async terrain => {
    await page.evaluate(t => {
      const G = H3.Game, U = H3.U;
      const hero = G.selected();
      hero.spells = ['fireball', 'lightning_bolt', 'chain_lightning', 'meteor_shower', 'armageddon', 'ice_bolt', 'implosion', 'bless', 'slow', 'cure', 'resurrection', 'frost_ring', 'death_ripple', 'titans_bolt', 'inferno', 'magic_arrow'];
      hero.hasBook = true; hero.mana = 999; hero.pri.pow = 12; hero.skills.wisdom = 3;
      const att = { hero, army: [{ cid: 'archer', n: 30 }, { cid: 'magog', n: 20 }, { cid: 'cyclops', n: 6 }, { cid: 'lich', n: 12 }, { cid: 'titan', n: 3 }, { cid: 'orc', n: 25 }, { cid: 'mage', n: 10 }], player: 0 };
      const def = { army: [{ cid: 'pikeman', n: 60 }, { cid: 'wolf_rider', n: 30 }, { cid: 'stone_gargoyle', n: 20 }, { cid: 'zombie', n: 40 }, { cid: 'griffin', n: 25 }, { cid: 'ogre', n: 12 }, { cid: 'harpy', n: 20 }], player: 1, name: 'Стражи' };
      const bt = H3.Battle.create(att, def, { rng: new U.RNG(11), terrain: t });
      H3.BattleView.run(bt, { human: [0] });
      window.__V = H3.BattleView.V;
    }, terrain);
    await page.waitForTimeout(700);
  };
  // помощники внутри страницы
  await page.evaluate(() => {
    window.__cast = (spell, target, hex) => { const V = H3.BattleView.V, b = V.b; b.casted = [false, false]; const own = b.units.find(u => u.side === 0 && u.alive); b.cur = own.id; const foes = b.units.filter(u => u.side === 1 && u.alive); const foe = foes[(target || 0) % foes.length]; H3.BattleView.doAction({ type: 'cast', spell, target: foe.id, hex: hex || [foe.x, foe.y] }); };
    window.__castOwn = (spell, i) => { const V = H3.BattleView.V, b = V.b; b.casted = [false, false]; const own = b.units.filter(u => u.side === 0 && u.alive); b.cur = own[0].id; H3.BattleView.doAction({ type: 'cast', spell, target: own[(i || 0) % own.length].id }); };
    window.__shoot = (cid, target) => { const V = H3.BattleView.V, b = V.b; const u = b.units.find(x => x.side === 0 && x.cid === cid && x.alive); b.cur = u.id; const foes = b.units.filter(x => x.side === 1 && x.alive); const foe = foes[(target || 0) % foes.length]; H3.BattleView.doAction({ type: 'shoot', target: foe.id }); };
  });
  await start('snow');
  await shot('field_snow', 600);
  await page.evaluate(() => window.__cast('fireball', 0)); await shot('fireball', 420);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__cast('chain_lightning', 1)); await shot('chain', 260);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__cast('meteor_shower', 2)); await shot('meteor', 520);
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.__shoot('cyclops', 3)); await shot('shot_stone', 220);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__shoot('magog', 4)); await shot('shot_fire', 200);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__shoot('titan', 5)); await shot('shot_beam', 120);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__castOwn('bless', 1)); await shot('bless', 300);
  await page.waitForTimeout(900);
  // гибель: три титана добивают ослабленный стек
  await page.evaluate(() => { const b = H3.BattleView.V.b; const foe = b.units.filter(u => u.side === 1 && u.alive)[0]; foe.count = 2; foe.hp = 1; window.__shoot('titan', 0); });
  await shot('death', 700);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__castOwn('resurrection', 0)); await shot('resurrect', 350);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__cast('armageddon', 0)); await shot('armageddon', 600);
  await page.waitForTimeout(1500);
  console.log('снимок 1 готов; юнитов живо', await page.evaluate(() => H3.BattleView.V.b.units.filter(u => u.alive).length));
  // вторая местность: лава с пеплом, инферно и взгляд
  await page.evaluate(() => { H3.BattleView.V.b.over = true; });
  await page.waitForTimeout(800);
  await page.evaluate(() => H3.UI.closeTop());
  await page.waitForTimeout(300);
  await start('lava');
  await shot('field_lava', 1500);
  await page.evaluate(() => window.__cast('inferno', 2)); await shot('inferno', 480);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__cast('implosion', 1)); await shot('implosion', 450);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__cast('frost_ring', 3)); await shot('frost', 300);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.__shoot('lich', 4)); await shot('shot_skull', 200);
  await page.waitForTimeout(900);
  // катапульта и башни — осада
  await page.evaluate(() => { H3.BattleView.V.b.over = true; });
  await page.waitForTimeout(800);
  await page.evaluate(() => H3.UI.closeTop());
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const G = H3.Game, U = H3.U, st = G.state;
    const hero = G.selected(); hero.skills.ballistics = 3;
    const town = Object.values(st.towns).find(t => t.owner !== 0) || Object.values(st.towns)[0];
    town.buildings.fort = true; town.buildings.citadel = true; town.buildings.castle = true;
    const att = { hero, army: [{ cid: 'archer', n: 30 }, { cid: 'cyclops', n: 6 }, { cid: 'titan', n: 3 }], player: 0 };
    const def = { army: [{ cid: 'pikeman', n: 60 }, { cid: 'archer', n: 30 }], player: 1, name: 'Гарнизон' };
    const bt = H3.Battle.create(att, def, { rng: new U.RNG(4), terrain: 'grass', siege: town });
    H3.BattleView.run(bt, { human: [0] });
  });
  await shot('siege', 1300);
  await page.evaluate(() => { const b = H3.BattleView.V.b; H3.BattleView.playEvents([{ t: 'catapult', wall: 1, result: 'destroy' }, { t: 'tower', target: b.units.find(u => u.side === 0).id, dmg: 5 }]); });
  await shot('catapult', 520);
  await shot('tower', 400);
  console.log(errs.length ? 'ОШИБКИ:\n' + errs.join('\n') : 'no errors');
  await br.close();
})();
