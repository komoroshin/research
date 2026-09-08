// Проверка моря: посадка в лодку, плавание, высадка. node dev/seashot.js [seed] [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const seed = process.argv[2] || '3', out = process.argv[3] || '/tmp/sea.png';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|ERR_FAILED|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html') + '?autostart=1&seed=' + seed + '&size=M&opp=1', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(async () => {
    const G = H3.Game, S = H3.State, PF = H3.Pathfind, st = G.state, h = G.selected();
    const boat = Object.values(st.objects).find(o => o.type === 'boat');
    if (!boat) return { err: 'на этой карте нет моря' };
    // ставим героя на берег рядом с лодкой
    let spot = null;
    for (let dy = -1; dy <= 1 && !spot; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = boat.x + dx, y = boat.y + dy;
      if ((dx || dy) && S.terrainAt(st, x, y, 0) !== 'water' && !S.isBlocked(st, x, y, 0)) { spot = [x, y]; break; }
    }
    h.x = spot[0]; h.y = spot[1]; h.move = 4000;
    S.computeVisibility(st, 0); G.selectHero(h.id); H3.AdvView.centerOn(h.x, h.y);
    let pf = S.pathfield(st, h);
    await G.moveAlong(h, PF.annotate(pf, PF.pathTo(pf, boat.x, boat.y), h.move, H3.Rules.heroMaxMove(h)));
    const boarded = !!h.boat;
    // плывём к дальней клетке моря
    pf = S.pathfield(st, h);
    const W = st.levels[0].w; let far = null, fd = 0;
    for (let i = 0; i < pf.dist.length; i++) { const d = pf.dist[i], x = i % W, y = (i / W) | 0;
      if (d < Infinity && d > fd && S.terrainAt(st, x, y, 0) === 'water') { fd = d; far = [x, y]; } }
    if (far) await G.moveAlong(h, PF.annotate(pf, PF.pathTo(pf, far[0], far[1]), h.move, H3.Rules.heroMaxMove(h)));
    return { boarded, sailing: !!h.boat, pos: [h.x, h.y], terrain: S.terrainAt(st, h.x, h.y, 0), boat: [boat.x, boat.y] };
  });
  console.log('плавание:', JSON.stringify(info));
  await page.waitForTimeout(800);
  await page.screenshot({ path: out });
  // высадка на берег
  const land = await page.evaluate(async () => {
    const G = H3.Game, S = H3.State, PF = H3.Pathfind, st = G.state, h = G.selected();
    if (!h.boat) return 'не в лодке';
    const pf = S.pathfield(st, h), W = st.levels[0].w;
    let sh = null, sd = Infinity;   // ближайший берег, а не первый попавшийся
    for (let i = 0; i < pf.dist.length; i++) { const d = pf.dist[i], x = i % W, y = (i / W) | 0;
      if (d < Infinity && d > 0 && d < sd && S.terrainAt(st, x, y, 0) !== 'water') { sd = d; sh = [x, y]; } }
    if (!sh) return 'берега не видно';
    h.move = 4000;
    await G.moveAlong(h, PF.annotate(pf, PF.pathTo(pf, sh[0], sh[1]), h.move, H3.Rules.heroMaxMove(h)));
    const left = Object.values(st.objects).find(o => o.type === 'boat' && Math.abs(o.x - h.x) <= 1 && Math.abs(o.y - h.y) <= 1);
    return 'высадился @' + h.x + ',' + h.y + ' (' + S.terrainAt(st, h.x, h.y, 0) + '), в лодке=' + !!h.boat + ', лодка у берега=' + !!left;
  });
  console.log('высадка:', land);
  await page.waitForTimeout(600);
  await page.screenshot({ path: out.replace('.png', '_land.png') });
  console.log(errs.length ? errs.join('\n') : 'no errors');
  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
