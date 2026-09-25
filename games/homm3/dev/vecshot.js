// Проверка рисованных (векторных) существ и объектов.
//   node dev/vecshot.js sheet <out.png> <name,name,...> [крупный масштаб, по умолч. 6]
//     по строке на имя: старый пиксельный | новый крупно | новый в размере боя (обе стороны) | кадры: шаг, замах, взмах, удар по нему
//   node dev/vecshot.js battle <out-prefix> <атака,через,запятую> <защита,через,запятую> [местность]
//     бой на iPhone 13: <prefix>_l.png — левый край поля, <prefix>_r.png — правый, <prefix>_zoom.png — крупно первый отряд
//   node dev/vecshot.js map <out.png> <name,name,...> — объекты на карте (масштаб карты, телефон)
const { chromium, devices } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const [,, mode, out, a1, a2, a3] = process.argv;
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errs = [];
  const hook = p => { p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) errs.push(m.text()); }); p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); };
  if (mode === 'sheet' || mode === 'map') {
    const page = await br.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 }); hook(page);
    await page.goto('file://' + ROOT + '/index.html?dev=1&vec=1', { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const url = await page.evaluate(([names, big, mode]) => {
      const Sp = H3.Sprites, Vc = H3.Vec, An = H3.Anim;
      const rows = names.length, RH = mode === 'map' ? 140 : 42 * big + 30, W = 1400;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = rows * RH + 10; const c = cv.getContext('2d');
      const g = c.createLinearGradient(0, 0, 0, cv.height); g.addColorStop(0, '#5d8a3a'); g.addColorStop(1, '#46702c'); c.fillStyle = g; c.fillRect(0, 0, W, cv.height);
      c.font = '14px monospace';
      names.forEach((nm, i) => {
        const y = i * RH + RH - 16;
        c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(0, y + 2, W, 1);
        c.fillStyle = '#fff'; c.fillText(nm + (Vc.has(nm) ? '' : '  (НЕТ рисованного)'), 6, i * RH + 16);
        if (mode === 'map') {   // размер карты: клетка 32, экран ×3
          Vc.setOn(false); c.imageSmoothingEnabled = false; Sp.draw(c, nm, 120, y, 3); Vc.setOn(true);
          c.imageSmoothingEnabled = true; Sp.draw(c, nm, 320, y, 3); Sp.draw(c, nm, 480, y, 1.5);
          return;
        }
        Vc.setOn(false); c.imageSmoothingEnabled = false; Sp.draw(c, nm, 120, y, big); Vc.setOn(true);
        c.imageSmoothingEnabled = true;
        if (!Vc.has(nm)) return;
        const nw = Vc.render(nm, big, false, null, Sp.SCENE); c.drawImage(nw, 380 - nw._anchor[0] * big, y - nw._anchor[1] * big);
        const small = (x, flip) => { const im = Vc.image(nm, 2.5, flip, null, Sp.SCENE); c.drawImage(im.cv, x - im.cv._anchor[0] * 2.5, y - im.cv._anchor[1] * 2.5, im.cv.width * im.k, im.cv.height * im.k); };
        small(640, false); small(760, true);
        const fl = C => C && H3.Creatures.isFlyer(C);
        const C = H3.Creatures.get(nm);
        const frames = [{ moving: true, t: 105 * Math.PI / 2 }, { moving: true, t: 105 * Math.PI * 1.5 }, { lunge: -1 }, { lunge: 1 }, { hurt: 1 }, { dead: 0.3 }];
        frames.forEach((f, j) => { const o = Object.assign({ t: 0, phase: 0, flying: fl(C), key: 'sheet' + i + ':' + j, rate: 1 }, f); if (f.t === undefined) o.t = 400 * j; o.st = An.state(o); An.draw(c, nm, 870 + j * 88, y, 2, false, o); });
      });
      c.fillStyle = '#fff'; c.fillText('старый', 90, 12); c.fillText('новый', 360, 12); c.fillText('бой: свой / чужой', 620, 12); c.fillText('шаг ×2, замах, удар, отдача, падение', 870, 12);
      return cv.toDataURL();
    }, [a1.split(','), +(a2 || 6), mode]);
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  } else if (mode === 'battle') {
    const ctx = await br.newContext({ ...devices['iPhone 13'], locale: 'ru-RU' });
    const page = await ctx.newPage(); hook(page);
    await page.goto('file://' + ROOT + '/index.html?dev=1&vec=1&autostart=1&seed=3&faction=castle&opp=1', { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    await page.evaluate(([att, def, terrain]) => {
      const G = H3.Game, U = H3.U, n = id => Math.max(1, Math.round(60 / H3.Creatures.get(id).tier));
      H3.BattleView.run(H3.Battle.create({ hero: G.selected(), army: att.map(cid => ({ cid, n: n(cid) })), player: 0 }, { army: def.map(cid => ({ cid, n: n(cid) })), player: 1, name: 'Враг' }, { rng: new U.RNG(2), terrain }), { human: [0] });
    }, [a1.split(','), a2.split(','), a3 || 'grass']);
    await page.waitForTimeout(1600);
    const cam = async (fn, file) => { await page.evaluate(fn); await page.waitForTimeout(500); await page.screenshot({ path: out + file }); };
    await cam(() => { const V = H3.BattleView.V; V.cam.z = 1; V.cam.x = 0; V.cam.y = 0; }, '_l.png');
    await cam(() => { const V = H3.BattleView.V; V.cam.z = 1; V.cam.x = 1e5; V.cam.y = 0; H3.BattleView.V.cam.x = Math.max(0, V.worldW - V.cw); }, '_r.png');
    await cam(() => { const V = H3.BattleView.V; const u = V.b.units[0], p = V.pos[u.id]; V.cam.z = 2.4; V.cam.x = p.x - 70; V.cam.y = p.y - 150; }, '_zoom.png');
  }
  console.log('saved', out, errs.length ? '\n' + errs.join('\n') : '');
  await br.close();
})();
