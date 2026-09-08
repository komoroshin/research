// Скриншот фазы тактики: node dev/tacticsshot.js [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || '/tmp/tactics.png';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=3', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const before = await page.evaluate(() => {
    const G = H3.Game, U = H3.U, h = G.selected();
    h.skills = Object.assign({}, h.skills, { tactics: 2 });
    const att = { hero: h, army: [{ cid: 'pikeman', n: 40 }, { cid: 'archer', n: 20 }, { cid: 'cavalier', n: 6 }, { cid: 'monk', n: 10 }], player: 0 };
    const def = { army: [{ cid: 'goblin', n: 60 }, { cid: 'orc', n: 20 }, { cid: 'wolf_rider', n: 15 }], player: 1, name: 'Орда' };
    const bt = H3.Battle.create(att, def, { rng: new U.RNG(11), terrain: 'grass' });
    H3.BattleView.run(bt, { human: [0] });
    return { phase: bt.phase, dist: bt.tactics && bt.tactics.dist, pos: bt.units.filter(u => u.side === 0).map(u => u.cid + '@' + u.x + ',' + u.y) };
  });
  await page.waitForTimeout(900);
  console.log('старт:', JSON.stringify(before));
  await page.screenshot({ path: out });
  // настоящими кликами: выбрать копейщиков и переставить их вперёд
  const box = await page.evaluate(() => {
    const V = H3.BattleView.V, b = V.b, U = H3.U;
    const u = b.units.find(x => x.side === 0 && x.cid === 'pikeman');
    const r = V.canvas.getBoundingClientRect();
    const c1 = U.Hex.center(u.x, u.y, V.size, V.ox, V.oy);
    const to = [b.tactics.dist - 1, u.y];
    const c2 = U.Hex.center(to[0], to[1], V.size, V.ox, V.oy);
    return { unit: [r.left + c1[0], r.top + c1[1]], to: [r.left + c2[0], r.top + c2[1]], want: to, was: [u.x, u.y], id: u.id };
  });
  await page.mouse.click(box.unit[0], box.unit[1]); await page.waitForTimeout(200);
  await page.mouse.click(box.to[0], box.to[1]); await page.waitForTimeout(300);
  const after = await page.evaluate(id => { const u = H3.BattleView.V.b.units[id]; return [u.x, u.y]; }, box.id);
  console.log('копейщики', JSON.stringify(box.was), '→', JSON.stringify(after), 'хотели', JSON.stringify(box.want));
  await page.screenshot({ path: out.replace('.png', '_moved.png') });
  // «Готово» — бой начинается
  await page.evaluate(() => { const b = [...document.querySelectorAll('#battleBar button')].find(x => x.textContent === 'Готово'); b.click(); });
  await page.waitForTimeout(700);
  console.log('после Готово: фаза', await page.evaluate(() => H3.BattleView.V.b.phase + ', раунд ' + H3.BattleView.V.b.round));
  await page.screenshot({ path: out.replace('.png', '_started.png') });
  await br.close();
  if (errs.length) console.log(errs.join('\n')); else console.log('no errors');
})();
