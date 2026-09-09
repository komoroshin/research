// Прогон кампании: экран, старт сценария, победа, перенос героя. node dev/campshot.js [out.png]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || '/tmp/camp.png';
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await br.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_CONNECTION|ERR_FAILED|fonts/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.click('#btnCamp'); await page.waitForTimeout(400);
  await page.screenshot({ path: out });
  console.log('сценариев на экране:', await page.evaluate(() => document.querySelectorAll('.campsc').length));
  // играем первый сценарий
  await page.click('.campsc.open button'); await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const st = H3.Game.state;
    return { day: st.day, camp: st.settings.campaign, goals: H3.Adventure.goalList(st, 0).map(g => (g.lose ? '☠ ' : '□ ') + g.text) };
  });
  console.log('сценарий:', JSON.stringify(info));
  await page.screenshot({ path: out.replace('.png', '_play.png') });
  // побеждаем: убираем противника и триггерим проверку
  const win = await page.evaluate(async () => {
    const st = H3.Game.state;
    // «зарабатываем» на первой карте: уровень, навык, артефакт, армия
    const me = H3.State.heroesOf(st, 0)[0];
    me.level = 6; me.xp = 5000; me.skills.offense = 2; me.spells.push('fireball');
    me.arts.weapon = 'centaur_axe'; H3.Rules.addToArmy(me.army, 'griffin', 9);
    // «убиваем» противников напрямую: снимаем города и героев
    for (const p of st.players) {
      if (p.id === 0) continue;
      for (const h of H3.State.heroesOf(st, p.id).slice()) H3.Adventure.killHero(st, h);
      for (const tid of p.towns.slice()) { st.towns[tid].owner = -1; }
      p.towns = []; p.alive = false;
    }
    H3.Adventure.checkGoals(st);
    return { winner: st.winner, reason: st.endReason };
  });
  console.log('победа:', JSON.stringify(win));
  await page.evaluate(() => H3.Game.G && null);
  // вызываем экран итогов через конец хода
  await page.evaluate(() => { H3.Game.settings().confirmEndTurn = false; H3.Game.endTurn(); });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out.replace('.png', '_win.png') });
  const after = await page.evaluate(() => {
    const modal = document.querySelector('.modal');
    const pr = JSON.parse(localStorage.getItem('homm3.campaign') || '{}');
    return { modal: modal ? modal.textContent.slice(0, 120) : 'нет окна', progress: pr };
  });
  console.log('после победы:', JSON.stringify(after));
  // «Следующий сценарий» — и герой должен перейти на вторую карту целиком
  const next = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.modal button')].find(x => /Следующий/.test(x.textContent));
    if (!b) return false; b.click(); return true;
  });
  console.log('кнопка «следующий сценарий»:', next);
  await page.waitForTimeout(2500);
  await page.evaluate(() => H3.UI.closeTop());   // брифинг сценария
  await page.waitForTimeout(300);
  console.log('второй сценарий:', await page.evaluate(() => {
    const st = H3.Game.state; if (!st) return 'не стартовал';
    const h = H3.State.heroesOf(st, 0)[0];
    const goal = st.goals.win[0];
    return JSON.stringify({ scenario: st.settings.campaign.scenario, hero: h.name, level: h.level, xp: h.xp, skills: h.skills,
      fireball: h.spells.includes('fireball'), art: h.arts.weapon, army: h.army.filter(Boolean).map(s => s.cid + 'x' + s.n),
      move: h.move === H3.Rules.heroMaxMove(h), goal: H3.Adventure.goalList(st, 0).map(g => (g.lose ? '☠ ' : '□ ') + g.text) });
  }));
  await page.screenshot({ path: out.replace('.png', '_next.png') });
  console.log(errs.length ? errs.join('\n') : 'no errors');
  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
