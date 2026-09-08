// Проверка подземелья: спуск через врата, рендер обоих слоёв. node dev/undershot.js [seed] [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const seed = process.argv[2] || '7', out = process.argv[3] || '/tmp/under.png';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|ERR_FAILED|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=' + seed + '&size=M&opp=1', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  console.log('слои:', await page.evaluate(() => {
    const st = H3.Game.state, T = H3.Rules.TERRAINS;
    return st.levels.map((m, z) => { const c = {}; for (let i = 0; i < m.terrain.length; i++) c[T[m.terrain[i]]] = (c[T[m.terrain[i]]] || 0) + 1; return 'z' + z + ' ' + JSON.stringify(c); }).join(' | ');
  }));
  // телепортируем героя к вратам и спускаемся
  const res = await page.evaluate(async () => {
    const G = H3.Game, S = H3.State, st = G.state, h = G.selected();
    const gate = Object.values(st.objects).find(o => o.type === 'subter_gate' && !o.z);
    h.x = gate.x; h.y = gate.y - 1; h.move = 3000;
    S.computeVisibility(st, 0); G.selectHero(h.id); H3.AdvView.centerOn(h.x, h.y);
    const pf = S.pathfield(st, h);
    const p = H3.Pathfind.pathTo(pf, gate.x, gate.y);
    await G.moveAlong(h, H3.Pathfind.annotate(pf, p, h.move, H3.Rules.heroMaxMove(h)));
    return { z: h.z, pos: [h.x, h.y], layer: H3.AdvView.V.layer, gate: [gate.x, gate.y] };
  });
  console.log('после врат:', JSON.stringify(res));
  await page.waitForTimeout(900);
  // закрыть возможный тост/диалог
  await page.evaluate(() => { const b = document.querySelector('.modal .actions button'); if (b) b.click(); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: out });
  console.log(errs.length ? errs.join('\n') : 'no errors');
  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
