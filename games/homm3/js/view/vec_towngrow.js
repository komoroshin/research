/* ============================================================================
   view/vec_towngrow.js — города на карте по уровню укреплений: деревня, форт, цитадель, замок.

   Имена: town_<фракция>#0 — без форта (поселение), #1 — форт (стена и ворота), #2 — цитадель
   (центральная башня и ров), #3 — замок (полная крепость — рисунок из vec_towns.js плюс ров);
   суффикс 'c' (town_castle#3c) — построен Капитолий: знамёна, золото, позолоченный купол.
   Рамка и якорь — от town_<фракция>, город стоит на своей клетке. meta.flag — основание древка
   флажка владельца (единицы рисунка): флажок стоит на макушке главного здания ступени.

   Ступень — одна функция фракции с параметром уровня: чем выше уровень, тем больше она добавляет.
   Помощники рисования (башня, стена, ворота, окно…) берутся из vec_towns.js (H3.VTownKit).

   В браузере рисунки описываются по требованию (H3.TownGrow.sprite) — 100+ описаний сразу
   заметно тормозили бы старт на телефоне; в node (тесты) — все сразу, чтобы тест их проверил.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;
  const { tube, ell, P, tone, frameOf, mapShapes } = K;
  const FACTIONS = ['castle', 'rampart', 'tower', 'inferno', 'necropolis', 'dungeon', 'stronghold', 'fortress', 'conflux', 'cove', 'factory', 'hive', 'bastion'];
  let T = null, PLAN = null;

  /** Уровень укреплений города: 0 — нет форта, 1 — форт, 2 — цитадель, 3 — замок. */
  function level(tw) { const b = tw && tw.buildings || {}; return b.castle ? 3 : b.citadel ? 2 : b.fort ? 1 : 0; }
  /** Имя рисунка ступени (без проверки, описан ли он). */
  function name(tw) { return 'town_' + tw.faction + '#' + level(tw) + (tw.buildings && tw.buildings.hall_4 ? 'c' : ''); }
  /** Что рисовать для города: ступень, если рисованная графика включена и рисунок получился; иначе прежний town_<фракция>. */
  function sprite(tw) {
    const base = 'town_' + tw.faction;
    if (!V.VEC.on || !T) return base;
    const nm = name(tw);
    return ensure(nm) ? nm : base;
  }
  /** Описать рисунок ступени, если его ещё нет. true — описан. */
  function ensure(nm) {
    if (V._defs[nm]) return true;
    const m = /^town_([a-z]+)#([0-3])(c?)$/.exec(nm);
    if (!m || !T || !PLAN[m[1]]) return false;
    try {
      const f = m[1], lvl = +m[2], cap = !!m[3], base = 'town_' + f;
      const fr = frameOf(base) || { w: 567, h: 437, anchor: [T.CX, T.G] };
      let shapes = PLAN[f](lvl, fr), flagAt = shapes.flag || [T.CX, 93];
      const smoke = (shapes.smoke || (lvl >= 3 ? [[223, 33]] : [])).map(at => ({ at, c: '200,200,210', rate: 6 / Math.max(1, (shapes.smoke || [1]).length), big: 1.2 }));
      if (cap) { const c = capital(f, lvl, shapes); shapes = shapes.concat(c); flagAt = c.flag || flagAt; }
      const lights = windows(shapes, [3, 4, 5, 5][lvl]);   // огни складываются ('lighter'): у маленькой деревни их меньше, иначе она сливается в одно пятно
      const dx = fr.anchor[0] - T.CX, dy = fr.anchor[1] - T.G, mv = p => [p[0] + dx, p[1] + dy];
      if (dx || dy) { shapes = mapShapes(shapes, (x, y) => [x + dx, y + dy], 1); flagAt = mv(flagAt); smoke.forEach(sm => { sm.at = mv(sm.at); }); lights.forEach((p, i) => { lights[i] = mv(p); }); }
      V.def(nm, { w: fr.w, h: fr.h, anchor: fr.anchor, meta: { flag: flagAt, level: lvl, lights, smoke }, parts: [{ kind: 'torso', pivot: fr.anchor.slice(), shapes }] });
      return true;
    } catch (e) { if (root.console) console.warn('town stage ' + nm + ': ' + e.message); return false; }
  }
  /* ---------- окна для ночных огней: видимые (не закрытые стеной или башней) окна рисунка ---------- */
  function inPoly(pts, x, y) {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; }
    return c;
  }
  const covers = (s, x, y) => s.e ? Math.pow((x - s.e[0]) / s.e[2], 2) + Math.pow((y - s.e[1]) / s.e[3], 2) < 1 : !!(s.p && s.p.length > 2 && !(s.op < 1) && inPoly(s.p, x, y));
  /** Окно — тёплый проём из win(): самоцвет без контрового света с бликом 0.5. Берём до max видимых, вразброс. */
  function windows(shapes, max) {
    const all = [];
    shapes.forEach((s, i) => {
      if (!(s.m === 'gem' && s.gloss === 0.5 && s.rim === 0 && s.p)) return;
      let x = 0, y = 0; for (const q of s.p) { x += q[0]; y += q[1]; } x /= s.p.length; y /= s.p.length;
      for (let j = i + 1; j < shapes.length; j++) if (covers(shapes[j], x, y)) return;
      all.push([Math.round(x), Math.round(y)]);
    });
    if (all.length <= max) return all;
    all.sort((a, b) => a[0] - b[0]);
    const out = []; for (let k = 0; k < max; k++) out.push(all[Math.floor((k + 0.5) * all.length / max)]);
    return out;
  }
  /** Все ступени всех фракций (лист проверки, тест). */
  function defineAll() { for (const f of FACTIONS) for (let l = 0; l < 4; l++) { ensure('town_' + f + '#' + l); ensure('town_' + f + '#' + l + 'c'); } }
  function init(kit) {
    if (T) return;
    T = kit; PLAN = plans();
    if (typeof document === 'undefined') defineAll();   // node: тест проверит все описания
  }
  H3.TownGrow = { init, level, name, sprite, ensure, defineAll, FACTIONS };

  /* ============================== помощники ступеней ============================== */
  let CX = 283, G = 433;
  /** Ряды черепицы на скатной крыше (боковой вид: трапеция от карниза к коньку). */
  function roofRows(xl, xr, y0, xl2, xr2, y1, n) {
    const out = [];
    for (let i = 1; i < n; i++) { const t = i / n, y = y0 + (y1 - y0) * t; out.push({ p: [[xl + (xl2 - xl) * t, y], [xr + (xr2 - xr) * t, y]], w: 2, a: 0.4 }); }
    return out;
  }
  /**
   * Дом: стены (штукатурка с фахверком, брёвна или кладка), дверь, окно, крыша по стилю фракции.
   * S — стиль фракции: { wall, wallD, timber, logs, mason, roofK: side|gable|cone|dome|onion, roof, roofD, roofM, flare, pointed, winC, winLC, snow, chimney }
   */
  function house(cx, base, hw, wh, S, o) {
    o = o || {}; const out = [], top = base - wh, rk = o.roof || S.roofK || 'side';
    const rc = o.rc || S.roof, rd = o.rd || S.roofD || tone(rc, -0.3), rm = o.roofM || S.roofM || 'leather';
    const lines = [];
    if (S.timber) {
      lines.push({ p: [[cx - hw, top + 5], [cx + hw, top + 5]], w: 3, c: S.timber, a: 0.9 }, { p: [[cx - hw, top + wh * 0.52], [cx + hw, top + wh * 0.52]], w: 2.6, c: S.timber, a: 0.85 });
      for (const k of [-0.64, 0.64]) lines.push({ p: [[cx + k * hw, top], [cx + k * hw, base]], w: 2.6, c: S.timber, a: 0.85 });
      lines.push({ p: [[cx - hw * 0.64, top + wh * 0.52], [cx - hw * 0.1, top + 5]], w: 2.2, c: S.timber, a: 0.8 });
    } else if (S.logs) for (let y = top + 12; y < base; y += 13) lines.push({ p: [[cx - hw, y], [cx + hw, y]], w: 2.2, a: 0.5 });
    else if (S.mason) lines.push(...T.masonry(cx - hw, top, cx + hw, base, 15, 22, 0.32));
    if (o.chimney || S.chimney) out.push({ p: T.box(cx + hw * 0.28, top - (o.rh || hw * 0.9) * 0.9 - 26, cx + hw * 0.28 + 16, top + 4), c: S.chimC || '#7a3a26', m: 'cloth', line: 1, lines: [{ p: [[cx + hw * 0.28 - 2, top - (o.rh || hw * 0.9) * 0.9 - 22], [cx + hw * 0.28 + 18, top - (o.rh || hw * 0.9) * 0.9 - 22]], w: 4, c: '#3b3b44', a: 0.9 }] });
    out.push({ p: T.box(cx - hw, top, cx + hw, base), c: S.wall, m: S.wallM || (S.logs ? 'wood' : 'cloth'), flow: S.logs ? 0 : undefined, line: 1, lines, belly: 0.2,
      sub: [{ p: T.box(cx + hw * 0.5, top - 2, cx + hw + 2, base + 2), c: S.wallD, m: 'flat', line: 0 }] });
    const dx = o.door === undefined ? -hw * 0.34 : o.door;
    out.push({ p: T.arch(cx + dx, base, Math.max(7, hw * 0.2), Math.min(wh * 0.6, 40), S.pointed), c: S.doorC || T.DOOR, m: 'wood', flow: -Math.PI / 2, line: 1 });
    if (wh > 40) out.push(...T.win(cx + (dx < 0 ? hw * 0.4 : -hw * 0.4), base - wh * 0.38, Math.max(6, hw * 0.16), Math.max(14, wh * 0.3), { pointed: S.pointed, c: S.winC, lc: S.winLC, cross: hw > 30 }));
    let apex;
    if (rk === 'side') {
      const e = 8, rh = o.rh || hw * 0.9, y0 = top + 6, y1 = top - rh;
      out.push({ p: [P(cx - hw - e, y0, 1), P(cx - hw * 0.45, y1, 1), P(cx + hw * 0.45, y1, 1), P(cx + hw + e, y0, 1)], c: rc, m: rm, gloss: 0.3, line: 1, furLen: 1, flow: Math.PI * 0.5,
        lines: roofRows(cx - hw - e, cx + hw + e, y0, cx - hw * 0.45, cx + hw * 0.45, y1, 4).concat([{ p: [[cx - hw * 0.8, y0 - 6], [cx - hw * 0.4, y1 + 5]], w: 2, light: true, a: 0.5 }]),
        sub: [{ p: [P(cx + hw * 0.45, y1 - 2, 1), P(cx + hw + e + 4, y0 + 2, 1), P(cx + hw * 0.62, y0 + 4, 1)], c: rd, m: 'flat', line: 0 }] });
      apex = [cx, y1];
    } else if (rk === 'gable') {
      const e = 10, rh = o.rh || hw * 1.05, y0 = top + 6;
      out.push({ p: T.gable(cx - hw, cx + hw, y0, rh, e), c: rc, m: rm, gloss: 0.3, line: 1, furLen: 1, flow: Math.PI * 0.5, belly: 0.2,
        sub: [{ p: [P(cx + 1, y0 - rh - 2, 1), P(cx + hw + e + 4, y0 + 2, 1), P(cx + 1, y0 + 4, 1)], c: rd, m: 'flat', line: 0 }],
        lines: [{ p: [[cx - hw - e + 4, y0 - 2], [cx, y0 - rh + 3], [cx + hw + e - 4, y0 - 2]], w: 3.4, c: tone(rc, -0.45), a: 0.7 }] });
      apex = [cx, y0 - rh];
    } else if (rk === 'cone') {
      const rh = o.rh || hw * 1.9;
      out.push(...T.cone(cx, top + 2, hw + 6, rh, rc, rd, { flare: o.flare === undefined ? S.flare : o.flare, m: rm, lean: o.lean || S.lean && S.lean * (cx < CX ? -1 : 1) }));
      apex = [cx + (o.lean || S.lean && S.lean * (cx < CX ? -1 : 1) || 0), top + 2 - rh];
    } else if (rk === 'dome') {
      const rh = o.rh || hw * 0.9;
      out.push({ p: T.box(cx - hw - 3, top - 6, cx + hw + 3, top + 4), c: S.wall, m: 'cloth', line: 1 }, ...T.dome(cx, top - 4, hw + 1, rh, rc, rd));
      apex = [cx, top - 4 - rh];
    } else if (rk === 'onion') {
      const rh = o.rh || hw * 1.7;
      out.push({ p: T.box(cx - hw - 3, top - 6, cx + hw + 3, top + 4), c: S.wall, m: 'cloth', line: 1 }, ...T.onion(cx, top - 4, hw + 4, rh, rc, rd));
      apex = [cx, top - 4 - rh];
    }
    if (S.snow) out.push(T.snowcap(apex[0], apex[1] + (rk === 'side' ? 4 : 10), rk === 'side' ? hw * 0.5 : hw * 0.55, 0.6));
    if (o.finial) out.push({ p: tube([[apex[0], apex[1] + 3, 3.5], [apex[0], apex[1] - 12, 2.2]]), c: o.finial, m: 'gold', line: 0.5 }, { e: [apex[0], apex[1] - 14, 4, 4], c: o.finial, m: 'gold', line: 0.5 });
    out.apex = apex;
    return out;
  }
  /** Ратуша поселения: широкий дом с большой дверью и башенкой-звонницей на коньке. */
  function hall(cx, base, S) {
    const hw = S.hallW || 64, wh = S.hallH || 84, rh = 40;
    const out = house(cx, base, hw, wh, S, { roof: 'side', rh, door: 0 });
    out.push(...T.win(cx - hw * 0.55, base - wh * 0.4, 8, 20, { pointed: S.pointed, c: S.winC, lc: S.winLC }), ...T.win(cx + hw * 0.55, base - wh * 0.4, 8, 20, { pointed: S.pointed, c: S.winC, lc: S.winLC }));
    const ridge = base - wh - rh, b = T.tower(cx, ridge + 30, 20, 60, Object.assign({}, S.tw, { win: [ridge + 4], winW: 6, winH: 16, top: S.hallTop || 'cone', roofH: S.hallTop === 'dome' ? 22 : S.hallTop === 'onion' ? 40 : 50, eave: 5, finial: null, flag: null, mason: false }));
    out.push(...b);
    out.apex = b.apex;
    return out;
  }
  /** Главная башня цитадели (донжон поменьше замкового). */
  function keep(S, cx, g) {
    const k = S.keep || {};
    const t = T.tower(cx, g, k.hw || 54, k.h || 262, Object.assign({}, S.tw, { win: k.win || [g - 150, g - 206], winW: 11, winH: 30, roofH: k.roofH || 108, eave: 8, finial: null, flag: null }, k.o));
    return t;
  }
  /** Каменная стена форта: кладка, зубцы (или шипы), угловые башенки, ворота. */
  function stoneWall(S, x0, x1, g, gx) {
    const y = S.wallY || g - 88, out = [];
    out.push(...T.cwall(x0, x1, y, g, S.fortC, { top: S.fortTop || S.fortC, mh: 14, st: 28, merlons: !S.spikes }));
    if (S.spikes) out.push(T.spikes(x0 - 6, x1 + 6, y, 22, 22, S.spikes));
    if (S.snow) for (let x = x0 + 4; x < x1 - 10; x += 30) out.push(T.snowcap(x + 8, y - 14, 10, 0.6));
    if (S.posts !== false) for (const x of [x0 + 12, x1 - 12]) out.push(...T.tower(x, g, 26, g - y + 44, Object.assign({}, S.tw, { top: S.postTop || 'crenel', roofH: 56, eave: 5, win: [], finial: null, flag: null })));
    out.push(...T.gate(gx, g, 28, 76, Object.assign({ ring: tone(S.fortC, -0.12), rw: 10, pointed: S.pointed }, S.gateO)));
    return out;
  }
  /** Ров перед стеной и мост к воротам. */
  function moat(c, gx, g, o) {
    o = o || {};
    const w = T.water(-14, 581, g - 13, g + 12, c, { n: 12 });
    if (o.lava) Object.assign(w, { sub: [{ p: T.box(-14, g - 2, 581, g + 5), c: '#ffc050', m: 'flat', line: 0 }], lc: '#6a1a0a' });
    return [w, { p: T.box(gx - 34, g - 15, gx + 34, g + 12), c: o.bridge || '#8a6a40', m: 'wood', flow: 0, line: 1, lines: T.planks(gx - 34, g - 15, gx + 34, g + 12, 11, true, 0.5) }];
  }
  /** Знамя на золотом пруте: верх (x, y), длина L. */
  function banner(x, y, L, c) {
    return [{ p: tube([[x - 22, y, 4.5], [x + 22, y, 4.5]]), c: T.GOLD, m: 'gold', line: 0.6 },
      { p: [P(x - 18, y + 2, 1), P(x + 18, y + 2, 1), P(x + 18, y + L, 1), P(x, y + L - 14, 1), P(x - 18, y + L, 1)], c, m: 'cloth', line: 1,
        sub: [{ e: [x, y + L * 0.4, 9, 9], c: T.GOLD, m: 'gold', line: 0 }],
        lines: [{ p: [[x - 13, y + 6], [x - 13, y + L - 6]], w: 2.6, c: T.GOLD, a: 0.9 }, { p: [[x + 13, y + 6], [x + 13, y + L - 6]], w: 2.6, c: T.GOLD, a: 0.9 }] }];
  }
  /** Горка золотых монет у ворот. */
  function coins(x, y, s) {
    s = s || 1; const out = [];
    for (const [dx, dy, r] of [[-16, -3, 9], [0, -4, 10], [16, -3, 9], [-8, -14, 9], [9, -14, 9], [0, -24, 8]]) out.push({ e: [x + dx * s, y + dy * s, r * s * 1.15, r * s * 0.8], c: '#e8b440', m: 'gold', gloss: 1, line: 0.7, lc: '#6a4410', glint: [[x + dx * s - 3, y + dy * s - 2, 2.2 * s]] });
    return out;
  }
  /** Позолоченный купол-луковка с шаром: основание (x, y), полуширина hw. */
  function goldDome(x, y, hw) {
    const out = [{ p: T.box(x - hw - 2, y - 6, x + hw + 2, y + 4), c: '#c89030', m: 'gold', line: 0.8 }, ...T.onion(x, y - 4, hw, hw * 1.9, '#f0c048', '#b07818')];
    const top = y - 4 - hw * 1.9;
    out.push({ p: tube([[x, top + 3, 3], [x, top - 10, 2]]), c: T.GOLD, m: 'gold', line: 0.5 }, { e: [x, top - 12, 4.5, 4.5], c: '#f0c048', m: 'gold', line: 0.5, glint: [[x - 1.5, top - 13.5, 1.6]] });
    out.flag = [x, top - 14];
    return out;
  }
  /** Капитолий: позолоченный купол на главном здании, знамёна фракции, горки золота у ворот. */
  function capital(f, lvl, shapes) {
    const S = PLAN[f].S || {}, out = [], bc = S.banner || '#c42a2a';
    const top = lvl >= 3 && S.apex3 ? S.apex3 : shapes.flag, bx = S.banX || 112, by = lvl >= 1 ? (S.banY || (S.wallY || G - 88) + 6) : G - 96;
    for (const s of [-1, 1]) out.push(...banner(CX + s * bx, by, 70, bc));
    const gd = top ? goldDome(top[0], top[1] + (S.domeDy || 0), S.domeW || 18) : [];
    out.push(...gd, ...coins(CX - 58, G - 2, 0.9), ...coins(CX + 58, G - 2, 0.9));
    out.flag = gd.flag;
    return out;
  }

  /* ============================== фракции ============================== */
  function plans() {
    CX = T.CX; G = T.G;
    const GOLD = T.GOLD, P3 = {};
    /** Ступень из полного рисунка vec_towns.js: замок + ров (если своей воды у города нет). */
    const full = (f, S) => { const out = T.FULL[f]({}); if (S.moatC && S.moat3 !== false) out.push(...moat(S.moatC, CX, G, S.moatO)); out.flag = S.flag3 || [CX, 93]; return out; };
    /** Общая схема «каменного» города: дома → ратуша/донжон → стена с воротами → ров → передний план. */
    function std(f, S) {
      const fn = (lvl) => {
        if (lvl >= 3) { const out = full(f, S); if (S.front3) out.push(...S.front3()); if (S.smoke) out.smoke = S.smoke(lvl); return out; }
        const out = [], g = S.ground || G, gx = S.gateX || CX, x0 = S.x0 === undefined ? 30 : S.x0, x1 = S.x1 === undefined ? 537 : S.x1;
        if (S.back) out.push(...S.back(lvl));
        // за стеной дома стоят дальше от зрителя — поднимаем их, чтобы над стеной были видны крыши и верх стен
        const lift = lvl >= 1 ? (S.lift === undefined ? 34 : S.lift) : 0;
        const smoke = [];
        for (const h of S.houses) if (!(lvl >= 2 && Math.abs(h[0] - gx) < 70)) { const hs = house(h[0], (h[1] === undefined ? g : h[1]) - lift, h[2], h[3], S, h[4]); out.push(...hs); if (!smoke.length) smoke.push([hs.apex[0] + h[2] * 0.3, hs.apex[1] + 6]); }
        let apex;
        if (lvl < 2) { const hl = hall(gx, g - lift, S); out.push(...hl); apex = hl.apex; }
        else { const k = keep(S, gx, g); out.push(...k); apex = k.apex; if (S.keepX) out.push(...S.keepX(k)); }
        if (lvl >= 1) out.push(...(S.fort ? S.fort(lvl, g, gx) : stoneWall(S, x0, x1, g, gx)));
        if (lvl >= 2 && S.moatC) out.push(...moat(S.moatC, gx, g, S.moatO));
        if (S.front) out.push(...S.front(lvl));
        out.flag = apex; out.smoke = S.smoke ? S.smoke(lvl) : smoke;
        return out;
      };
      fn.S = S; P3[f] = fn;
    }

    /* ---------- Замок: белая штукатурка с фахверком, синие крыши, алые знамёна ---------- */
    const castleTW = { wall: '#e4e0d6', shade: '#b4b0aa', light: '#f4f2ec', roof: '#3566cc', roofD: '#1f3f8e' };
    std('castle', { wall: '#eee8da', wallD: '#bcb4a2', timber: '#6a4a2c', roofK: 'side', roof: '#3566cc', roofD: '#1f3f8e', tw: castleTW,
      houses: [[150, G - 26, 38, 60], [416, G - 26, 38, 60], [62, G, 46, 70, { roof: 'gable' }], [504, G, 46, 70, { roof: 'gable' }]],
      fortC: '#dcd8ce', fortTop: '#e8e4da', gateO: { ring: '#c8c4ba' }, moatC: '#3a7ab8', banner: '#c42a2a', apex3: [CX, 27],
      keepX: k => [{ p: [P(CX - 20, 196, 1), P(CX + 20, 196, 1), P(CX + 20, 236, 1), P(CX, 228, 1), P(CX - 20, 236, 1)], c: '#c42a2a', m: 'cloth', line: 1,
        sub: [{ p: T.box(CX - 3.5, 196, CX + 3.5, 232), c: GOLD, m: 'gold', line: 0 }, { p: T.box(CX - 14, 206, CX + 14, 212), c: GOLD, m: 'gold', line: 0 }] }],
      front: lvl => lvl ? [] : [...T.flag(206, G - 4, 64, '#c42a2a', { fw: 30, fh: 18 }), ...T.flag(360, G - 4, 64, '#c42a2a', { fw: 30, fh: 18 })] });

    /* ---------- Оплот: светлые круглые домики под зелёными шпилями, великое дерево ---------- */
    const rampTW = { wall: '#dcd6c0', shade: '#a8a088', light: '#f2eee0', roof: '#4c9a3a', roofD: '#2d6424', flare: 0.16, pointed: true };
    const LEAF = ['#2f6a24', '#4a8a32', '#5e9e3c', '#76b44a'], BUSH = ['#4a8a32', '#5e9e3c', '#76b44a', '#8ac458'];
    std('rampart', { wall: '#e8e0c8', wallD: '#b0a68a', roofK: 'cone', roof: '#4c9a3a', roofD: '#2d6424', flare: 0.18, pointed: true, tw: rampTW, hallTop: 'cone',
      houses: [[168, G - 26, 30, 50], [388, G - 26, 28, 48], [70, G, 36, 56], [512, G, 34, 54]],
      back: lvl => {   // великое дерево — с первого дня; домик в ветвях — когда город подрос
        const out = [...T.trunk(468, G, 200, 30, '#7a5230', -8)];
        out.push({ p: tube([[462, 262, 18], [420, 222, 12], [384, 200, 8]]), c: '#7a5230', m: 'wood', line: 0.9 }, { p: tube([[462, 236, 16], [510, 196, 10], [536, 170, 6]]), c: '#7a5230', m: 'wood', line: 0.9 });
        out.push(...T.foliage(462, 132, 112, 90, 8, LEAF, 17));
        if (lvl >= 2) out.push({ e: [398, 196, 34, 28], c: '#9a6a3a', m: 'wood', flow: 0, line: 1 }, ...T.win(398, 208, 7, 18, { pointed: true }), ...T.cone(398, 178, 40, 50, '#4c9a3a', '#2d6424', { flare: 0.18 }));
        return out;
      },
      fort: (lvl, g, gx) => {   // низкая стена с аркадой и золотым поясом, стройные угловые башенки под шпилями
        const out = [], arc = [], y = 350;
        for (let x = 62; x < 520; x += 46) if (Math.abs(x - gx) > 60) arc.push({ p: T.arch(x, 414, 12, 40, true), c: '#34462c', m: 'flat', line: 0 });
        out.push({ p: T.box(28, y, 539, g), c: '#d4ccb2', m: 'cloth', line: 1, belly: 0.2, sub: arc, lines: T.masonry(28, y, 539, g, 20, 36, 0.3).concat([{ p: [[28, y + 8], [539, y + 8]], w: 5, c: GOLD, a: 0.85 }]) });
        for (const x of [40, 527]) out.push(...T.tower(x, g, 22, 140, Object.assign({}, rampTW, { win: [340], winW: 6, winH: 16, roofH: 84, eave: 5, finial: GOLD })));
        out.push(...T.gate(gx, g, 28, 80, { pointed: true, ring: '#e6d8a8', rw: 8, grate: false, door: '#8a5a30' }));
        return out;
      },
      keep: { hw: 46, h: 250, roofH: 124 },
      keepX: k => [{ p: T.box(CX - 58, 262, CX + 58, 271), c: '#8a5a30', m: 'wood', flow: 0, line: 1, lines: [{ p: [[CX - 56, 250], [CX + 56, 250]], w: 2.4, c: '#5a3a1c', a: 0.9 }, ...[-1, -0.5, 0, 0.5, 1].map(k => ({ p: [[CX + k * 54, 262], [CX + k * 54, 250]], w: 2, c: '#5a3a1c', a: 0.9 }))] }],
      moatC: '#3a8ab0', banner: '#3f8f33', apex3: [CX, 21], banY: 356,
      front: lvl => [...T.foliage(118, 414, 40, 20, 3, BUSH, 5, { leaf: 0.5 }), ...(lvl < 2 ? T.foliage(452, 414, 44, 20, 3, BUSH, 9, { leaf: 0.5 }) : [])],
      front3: () => [] });

    /* ---------- Башня: белые башенки под синими куполами, снег, золото ---------- */
    const towerTW = { wall: '#eef2f6', shade: '#b8c6d6', light: '#ffffff', roof: '#4f86d0', roofD: '#2a5a9c', winC: '#bfe2ff', winLC: '#2a4a78' };
    std('tower', { wall: '#f0f4f8', wallD: '#b8c6d6', roofK: 'onion', roof: '#4f86d0', roofD: '#2a5a9c', winC: '#bfe2ff', winLC: '#2a4a78', snow: true, tw: towerTW, hallTop: 'dome',
      houses: [[150, G - 26, 30, 66, { roof: 'dome', rc: '#9ab8d8', rd: '#6a88b0', finial: GOLD }], [416, G - 26, 30, 66, { roof: 'dome', rc: '#9ab8d8', rd: '#6a88b0', finial: GOLD }], [62, G, 36, 84, { finial: GOLD }], [504, G, 36, 84, { finial: GOLD }]],
      fortC: '#e4eaf0', fortTop: '#eef3f8', postTop: 'dome', keep: { hw: 54, h: 270, o: { top: 'dome', roof: '#6aa0e0', roofD: '#3a6aa8', roofH: 54 } },
      keepX: k => [{ p: tube([[CX + 8, k.apex[1] + 36, 10], [CX + 50, k.apex[1] + 4, 9], [CX + 66, k.apex[1] - 8, 10]], { flat1: true }), c: '#c8943a', m: 'gold', line: 0.9 }, T.snowcap(CX - 12, k.apex[1] + 12, 30)],
      moatC: '#7ab8e0', moatO: { bridge: '#c8a050' }, banner: '#2a5aa8', apex3: [CX, 49], domeDy: 4,
      front: lvl => lvl ? [] : [{ p: ell(200, G + 2, 40, 9, 12), c: '#f8fbff', m: 'cloth', line: 0.6, lc: '#8aa0b8' }, { p: ell(372, G + 2, 34, 8, 12), c: '#f8fbff', m: 'cloth', line: 0.6, lc: '#8aa0b8' }] });

    /* ---------- Инферно: чёрный камень, алые острые крыши, рога, жаровни, лава ---------- */
    const infTW = { wall: '#40302e', shade: '#221816', light: '#5c4844', roof: '#a8281c', roofD: '#5c1410', winC: '#ffa040', winLC: '#2a0a04', pointed: true, flare: 0.1 };
    const brazier = (x, y) => [{ p: tube([[x, G, 7], [x, y + 10, 5]]), c: '#2a1e1c', m: 'steel', line: 0.7 }, { p: [P(x - 18, y, 1), P(x + 18, y, 1), [x + 12, y + 14], [x - 12, y + 14]], c: '#3a2a28', m: 'steel', line: 0.8 }, ...T.flame(x, y + 2, 15, 40)];
    std('inferno', { wall: '#4a3a36', wallD: '#2a1e1c', roofK: 'cone', roof: '#a8281c', roofD: '#5c1410', pointed: true, flare: 0.1, winC: '#ffa040', winLC: '#2a0a04', tw: infTW,
      houses: [[150, G - 24, 32, 60, { rh: 76 }], [416, G - 24, 32, 60, { rh: 76 }], [62, G, 38, 70, { rh: 90 }], [504, G, 38, 70, { rh: 90 }]],
      fortC: '#382a28', spikes: '#2a1e1c', gateO: { pointed: true, ring: '#2a1e1c', hole: '#ff6a1a', grateC: '#1a0e0c' }, postTop: 'crenel',
      keep: { hw: 54, h: 262, roofH: 110 }, keepX: k => [T.horn(CX - 46, 196, -1, 70, '#7a6a5e'), T.horn(CX + 46, 196, 1, 70, '#7a6a5e'), T.spikes(CX - 62, CX + 62, 176, 14, 20, '#2a1e1c')],
      moatC: '#ff6a1a', moatO: { lava: true, bridge: '#3a2a28' }, moat3: false, banner: '#8a1a10', apex3: [CX, -8], domeW: 16,
      front: lvl => lvl ? [] : [...brazier(206, 380), ...brazier(360, 380)],
      hallTop: 'cone' });

    /* ---------- Некрополис: тёмный камень, кривые острые крыши, фиолетовые окна, надгробия ---------- */
    const necTW = { wall: '#5e5c6c', shade: '#3a3846', light: '#7c7a8c', roof: '#3a2c46', roofD: '#1c1424', winC: '#b67ae8', winLC: '#1a0e24', pointed: true, flare: 0.2 };
    const grave = (x, k) => ({ p: T.arch(x, G, 10 * k, 30 * k), c: '#8a8898', m: 'cloth', line: 1, lines: [{ p: [[x, G - 24 * k], [x, G - 8 * k]], w: 2, a: 0.6 }, { p: [[x - 5 * k, G - 18 * k], [x + 5 * k, G - 18 * k]], w: 2, a: 0.6 }] });
    std('necropolis', { wall: '#6a6878', wallD: '#3a3846', roofK: 'cone', roof: '#3a2c46', roofD: '#1c1424', pointed: true, flare: 0.2, lean: 10, winC: '#b67ae8', winLC: '#1a0e24', tw: necTW,
      houses: [[150, G - 24, 30, 62, { rh: 96 }], [416, G - 24, 30, 62, { rh: 96 }], [62, G, 36, 72, { rh: 116 }], [504, G, 36, 72, { rh: 116 }]],
      fortC: '#524f62', fortTop: '#5e5b70', gateO: { pointed: true, ring: '#46435a', hole: '#120c18', grateC: '#5a5868' },
      keep: { hw: 50, h: 250, roofH: 140 },
      keepX: k => [...[-1, 1].map(s => ({ p: [P(CX + s * 50, 206, 1), P(CX + s * 72, 160, 1), P(CX + s * 64, 212, 1), P(CX + s * 54, 280, 1)], c: '#2a2434', m: 'horn', line: 0.9 })), ...T.skull(CX, 212, 17, { c: '#e8e4d8' })],
      moatC: '#3a5a4a', moatO: { bridge: '#5a4a3a' }, banner: '#4a2a6a', apex3: [CX, 15], hallTop: 'cone',
      front: lvl => lvl ? [] : [grave(206, 1), grave(236, 0.8), grave(356, 0.9), ...T.skull(112, 396, 13), ...T.skull(454, 396, 13)] });

    /* ---------- Цитадель (Stronghold) не каменная — своя схема ниже ---------- */

    /* ---------- Сопряжение: белые домики под хрустальными крышами, пилоны стихий, парящие острова ---------- */
    const confTW = { wall: '#eef0f6', shade: '#b0b8cc', light: '#ffffff', roof: '#7fd9ea', roofD: '#3a9ab8', roofM: 'gem', winC: '#dcc0ff', winLC: '#4a3a6a', pointed: true };
    const PYL = [[30, '#ff7a2a'], [196, '#3a9af0'], [370, '#eaf6ff'], [537, '#b08a4a']];
    std('conflux', { wall: '#f0f2f8', wallD: '#b0b8cc', roofK: 'cone', roof: '#7fd9ea', roofD: '#3a9ab8', roofM: 'gem', pointed: true, flare: 0.1, winC: '#dcc0ff', winLC: '#4a3a6a', tw: confTW,
      houses: [[150, G - 26, 30, 60], [416, G - 26, 30, 60], [84, G, 34, 70, { rh: 80 }], [484, G, 34, 70, { rh: 80 }]],
      back: lvl => [...T.island(410, 120, 30, '#3ab0f0'), ...(lvl >= 1 ? T.island(110, 96, 44, '#ff8a3a') : [])],
      fort: (lvl, g, gx) => [{ p: T.box(40, 350, 527, g), c: '#e2e6ee', m: 'cloth', line: 1, lines: T.masonry(40, 350, 527, g, 20, 36, 0.3) }, T.merlons(36, 531, 348, 12, 26, '#eef1f7', { k: 0.5 }),
        ...T.gate(gx, g, 30, 84, { pointed: true, ring: '#d0d8e6', rw: 10, hole: '#2a3a5a', grateC: '#9ad8f0' })],
      keep: { hw: 50, h: 262, roofH: 138, o: { flare: 0.2 } },
      keepX: k => [{ p: tube([[CX - 40, 150, 3.5], [CX, 162, 3.5], [CX + 40, 150, 3.5]]), c: GOLD, m: 'gold', line: 0.5 }],
      front: lvl => { const out = []; for (const [x, c] of PYL) if (lvl >= 1 || x === 30 || x === 537) out.push(...T.pylon(x, G, lvl >= 1 ? 120 : 90, c)); return out; },
      front3: () => [],
      moatC: '#5ac8f0', moatO: { bridge: '#c8d0e0' }, banner: '#6a4ac0', apex3: [CX, -3], banX: 150, banY: 358, domeW: 16 });

    /* ---------- Бухта: песчаник, бирюзовые крыши, пирс с лодкой, маяк ---------- */
    const coveTW = { wall: '#caa878', shade: '#8f7450', light: '#e0c496', roof: '#2a8a8a', roofD: '#155a5a' };
    const GC = 404;
    const pier = () => ({ p: T.box(0, 392, 212, 402), c: '#8a6a40', m: 'wood', flow: 0, line: 1, lines: T.planks(0, 392, 212, 402, 18, true, 0.5) });
    const sloop = () => [{ p: tube([[104, 360, 5], [104, 250, 4]]), c: '#6a4a2a', m: 'wood', line: 0.8 },
      { p: [P(108, 256, 1), [150, 290], P(168, 352, 1), P(108, 352, 1)], c: '#efe6cc', m: 'cloth', line: 1, lines: [{ p: [[112, 320], [160, 320]], w: 5, c: '#2a8a8a', a: 0.85 }] },
      { p: [P(40, 356, 1), P(176, 356, 1), [164, 382], P(150, 398, 1), P(56, 398, 1), [44, 380]], c: '#6a4424', m: 'wood', flow: 0, line: 1, lines: [{ p: [[46, 366], [172, 366]], w: 4, c: '#c89a3a', a: 0.9 }] }];
    const lighthouse = () => { const out = [{ p: ell(508, 406, 56, 22, 12), c: '#6a6258', m: 'horn', line: 1 }];
      const bands = []; for (let y = 206; y < 400; y += 46) bands.push({ p: [P(470, y, 1), P(546, y, 1), P(546, y + 22, 1), P(470, y + 22, 1)], c: '#c42a2a', m: 'flat', line: 0 });
      out.push({ p: T.trap(508, 196, 400, 22, 34), c: '#f2eee6', m: 'cloth', line: 1, sub: bands.concat([{ p: [P(516, 190, 1), P(550, 190, 1), P(550, 404, 1), P(524, 404, 1)], c: '#9a9088', m: 'flat', line: 0 }]) });
      out.push({ p: T.box(480, 186, 536, 198), c: '#3a3a42', m: 'steel', line: 1 }, { p: T.box(488, 150, 528, 188), c: '#ffd860', m: 'gem', gloss: 1, line: 1, lc: '#3a2a10', lines: [{ p: [[508, 150], [508, 188]], w: 3, c: '#3a3a42', a: 0.9 }] }, ...T.dome(508, 152, 24, 26, '#b8322a', '#7a1a14'));
      return out; };
    std('cove', { wall: '#dcc294', wallD: '#9a7c54', roofK: 'side', roof: '#2a8a8a', roofD: '#155a5a', tw: coveTW, ground: GC, x0: 150, x1: 540,
      houses: [[236, GC - 22, 32, 54], [420, GC - 22, 34, 56], [182, GC, 34, 64, { roof: 'gable' }], [478, GC, 40, 68]],
      fortC: '#c0a070', fortTop: '#ccae80', gateO: { ring: '#a88a5c' }, wallY: 334, posts: false,
      keep: { hw: 54, h: 250, roofH: 108 },
      fort: (lvl, g, gx) => { const out = stoneWall(P3.cove.S, 150, 450, g, gx); if (lvl >= 1) out.push(...lighthouse()); return out; },
      front: lvl => [pier(), ...sloop(), T.water(0, 567, 400, G, '#2a78a8', { n: 12 })],
      banner: '#c42a2a', apex3: [CX, 14], banX: 104, banY: 340 });

    /* ---------- Фабрика: кирпич, стальные крыши, трубы с дымом, шестерня ---------- */
    const facTW = { wall: '#9a4028', shade: '#62261a', light: '#b85a3a', roof: '#6a6a74', roofD: '#3b3b44', bw: 26, rh: 16 };
    const stack = (x, top) => { const out = [{ p: T.trap(x, top, G, 13, 19), c: '#7a3020', m: 'cloth', line: 1, lines: T.masonry(x - 20, top, x + 20, G, 16, 20, 0.35).concat([{ p: [[x - 20, top + 34], [x + 20, top + 34]], w: 5, c: '#3a3a42', a: 0.9 }]), sub: [{ p: T.box(x + 5, top - 6, x + 22, G + 2), c: '#4e1c12', m: 'flat', line: 0 }] },
      { p: T.box(x - 18, top - 8, x + 18, top + 4), c: '#3b3b44', m: 'steel', line: 1 }];
      for (let i = 0; i < 3; i++) out.push({ p: ell(x + 6 + i * 11, top - 24 - i * 22, 12 + i * 4, 10 + i * 3, 10), c: '#c8c8ce', m: 'cloth', line: 0.6, lc: '#8a8a94', ao: 0.4 });
      return out; };
    std('factory', { wall: '#a84a30', wallD: '#62261a', mason: true, roofK: 'side', roof: '#6a6a74', roofD: '#3b3b44', roofM: 'steel', tw: facTW,
      houses: [[160, G - 26, 38, 58, { chimney: true }], [408, G - 26, 38, 58, { chimney: true }], [92, G, 44, 70], [476, G, 44, 70]],
      back: lvl => [...stack(lvl >= 1 ? 44 : 30, lvl >= 1 ? 110 : 180), ...(lvl >= 1 ? stack(523, 110) : [])],
      fortC: '#8a3a24', gateO: { ring: '#6a6a74', grateC: '#8a8a94' }, posts: false, x0: 66, x1: 501,
      keep: { hw: 66, h: 240, roofH: 100, o: { bw: 26, rh: 16 } }, keepX: k => T.gear(CX, 262, 38, 10, '#c8883a'),
      moatC: '#4a5a62', moatO: { bridge: '#6a6a74' }, banner: '#b86a2a', apex3: [CX, 47],
      smoke: lvl => lvl >= 3 ? [[50, 44], [529, 44]] : lvl ? [[50, 70], [529, 70]] : [[36, 140]],
      front: lvl => lvl ? [] : T.gear(206, 404, 20, 8, '#c8883a') });

    /* ---------- Подземелье: пещерная пасть в скалах, пурпурные башни, кристаллы ---------- */
    const dunS = { wall: '#5c4c60', shade: '#342a38', light: '#76667a', roof: '#8a4ac0', roofD: '#4e2a72', winC: '#e090ff', winLC: '#2a0e3a', pointed: true, flare: 0.1 };
    const RK = '#4a4252', RK2 = '#3a3442';
    const cave = (k) => { const out = [], m = (x, y) => [CX + (x - CX) * k, G + (y - G) * k];
      out.push(T.rock([P(...m(170, G + 50), 1), m(178, 360), m(206, 318), m(CX, 294), m(360, 318), m(388, 360), P(...m(396, G + 50), 1)], RK2));
      out.push({ p: [P(...m(206, G + 52), 1), m(212, 390), m(234, 348), m(CX, 330), m(332, 348), m(354, 390), P(...m(360, G + 52), 1)], c: '#0e0a12', m: 'cloth', ao: 1.5, line: 1 });
      for (let i = 0; i < 7; i++) { const x = 226 + i * 19, len = 18 + (i % 3) * 10, y = 342 - Math.sin(i / 6 * Math.PI) * 10; out.push({ p: [P(...m(x - 8, y - 4), 1), P(...m(x + 8, y - 4), 1), P(...m(x + 1, y + len), 1)], c: '#6a6072', m: 'horn', line: 0.8 }); }
      return out; };
    const dunCrys = lvl => { const out = []; for (const [x, y, h, c, l] of [[36, G, 70, '#9a5ae0', -0.15], [58, G, 48, '#c890f8', 0.1], [150, G, 40, '#b070f0', 0.2], [400, G, 44, '#b070f0', -0.2], [512, G, 76, '#9a5ae0', 0.12], [540, G, 50, '#c890f8', 0.25]]) out.push(T.crystal(x, y, h * 0.24, h * (lvl ? 1 : 0.8), c, l)); return out; };
    function dungeon(lvl) {
      if (lvl >= 3) return Object.assign(full('dungeon', {}), { smoke: [] });
      const out = [], k = [0.62, 0.8, 0.9][lvl];
      // скалы растут вместе с городом
      const L = (x, y) => [x, G - (G - y) * k];
      out.push(T.rock([P(-20, G, 1), L(-14, 250), L(20, 170), L(70, 130), L(130, 150), L(176, 210), L(200, 300), P(214, G, 1)], RK, { lines: [{ p: [L(60, 160), L(80, 240), L(66, 320)], w: 2.4, a: 0.45 }] }));
      out.push(T.rock([P(352, G, 1), L(366, 300), L(390, 220), L(440, 160), L(500, 150), L(548, 190), L(564, 280), P(566, G, 1)], RK, { lines: [{ p: [L(470, 170), L(456, 260), L(480, 340)], w: 2.4, a: 0.45 }] }));
      // жилые башенки на скалах
      const t1 = T.tower(96, L(0, 300)[1], 26, 96 * k + 20, Object.assign({}, dunS, { win: [L(0, 300)[1] - 50], winW: 6, winH: 16, roofH: 70 }));
      const t2 = T.tower(470, L(0, 290)[1], 26, 90 * k + 20, Object.assign({}, dunS, { win: [L(0, 290)[1] - 48], winW: 6, winH: 16, roofH: 66 }));
      out.push(...t1, ...t2);
      let apex;
      if (lvl >= 2) { const t = T.tower(CX, 380, 50, 236, Object.assign({}, dunS, { win: [196, 250], winW: 10, winH: 28, roofH: 112, eave: 8 })); out.push(...t); apex = t.apex; }
      else { const t = T.tower(CX, 380, 34, 120, Object.assign({}, dunS, { win: [320], winW: 8, winH: 22, roofH: 84, eave: 6 })); out.push(...t); apex = t.apex; }
      if (lvl >= 1) {   // крепостная стена из тёмного камня между скалами, острые зубцы
        out.push(...T.cwall(120, 446, 356, G, '#4e4458', { top: '#5a5064', mh: 16, st: 22 }));
        for (const x of [132, 434]) out.push(...T.tower(x, G, 24, 118, Object.assign({}, dunS, { top: 'crenel', win: [], finial: null })));
      }
      out.push(...cave(lvl ? 0.66 : 0.6));
      if (lvl >= 2) out.push(...moat('#2e2a4a', CX, G, { bridge: '#4a4252' }));
      out.push(...dunCrys(lvl));
      out.flag = apex; out.smoke = [];
      return out;
    }
    dungeon.S = { banner: '#6a2a9a', apex3: [CX, 0], banX: 150, banY: 330, domeW: 16 }; P3.dungeon = dungeon;

    /* ---------- Цитадель (Stronghold): шатры, частокол, бревенчатая вышка вождя, черепа ---------- */
    function yurt(cx, g, hw, h) {
      const logs = []; for (let y = g - h * 0.45 + 10; y < g; y += 14) logs.push({ p: [[cx - hw, y], [cx + hw, y]], w: 2.2, a: 0.5 });
      return [{ p: T.box(cx - hw, g - h * 0.45, cx + hw, g), c: '#6e4a28', m: 'wood', flow: 0, line: 1, lines: logs, sub: [{ p: T.box(cx + hw * 0.5, g - h * 0.45 - 2, cx + hw + 2, g + 2), c: '#4a3018', m: 'flat', line: 0 }] },
        { p: [P(cx - hw - 20, g - h * 0.42, 1), [cx - hw * 0.55, g - h * 0.75], P(cx, g - h, 1), [cx + hw * 0.55, g - h * 0.75], P(cx + hw + 20, g - h * 0.42, 1), [cx, g - h * 0.36]], c: '#b08a50', m: 'fur', furLen: 1.1, flow: Math.PI * 0.5, line: 1, belly: 0.3 },
        ...T.gate(cx, g, 16, 40, { grate: false, door: '#5a3a1c', hole: T.HOLE })];
    }
    function stronghold(lvl) {
      if (lvl >= 3) return Object.assign(full('stronghold', { moatC: '#5a6a44', moatO: { bridge: '#6a4424' } }), { smoke: [[102, 287]] });
      const out = [], tents = () => [...T.tent(102, G, lvl ? 66 : 58, lvl ? 150 : 132, '#c8a06a', '#8a4a2a'), ...T.tent(466, G, lvl ? 66 : 58, lvl ? 150 : 132, '#c8a06a', '#8a4a2a')];
      if (!lvl) out.push(...tents());
      let apex;
      if (lvl >= 2) {   // вышка вождя поменьше
        const logs = []; for (let y = 236; y < G; y += 17) logs.push({ p: [[CX - 52, y], [CX + 52, y]], w: 2.4, a: 0.55 });
        out.push({ p: T.trap(CX, 226, G, 46, 54), c: '#6e4a28', m: 'wood', flow: 0, line: 1, lines: logs, sub: [{ p: [P(CX + 22, 220, 1), P(CX + 60, 220, 1), P(CX + 60, G + 2, 1), P(CX + 26, G + 2, 1)], c: '#4a3018', m: 'flat', line: 0 }] });
        for (const s of [-1, 1]) out.push({ p: tube([[CX + s * 50, 236, 11], [CX + s * 50, G, 12]]), c: '#5a3a1c', m: 'wood', line: 0.9 });
        out.push({ p: [P(CX - 74, 234, 1), [CX - 42, 186], P(CX, 138, 1), [CX + 42, 186], P(CX + 74, 234, 1), [CX, 244]], c: '#b08a50', m: 'fur', furLen: 1.2, flow: Math.PI * 0.5, line: 1, belly: 0.3 });
        out.push(...T.skull(CX, 272, 24, { horns: true }));
        apex = [CX, 140];
      } else { const b = lvl ? G - 44 : G, y = yurt(CX, b, lvl ? 56 : 50, lvl ? 170 : 150); out.push(...y); apex = [CX, b - (lvl ? 170 : 150)]; }
      if (lvl >= 1) {
        out.push(T.palisade(10, 557, 332, G, 24, '#7a5230', { bands: [366, 406] }), ...tents());
        out.push(...T.gate(CX, G, 26, 70, { grate: false, door: '#5a3a1c', hole: T.HOLE }));
        for (const s of [-1, 1]) out.push({ p: tube([[CX + s * 40, G, 9], [CX + s * 40, 336, 7]]), c: '#5a3a1c', m: 'wood', line: 0.8 }, ...T.skull(CX + s * 40, 326, 11, { horns: true }));
      } else out.push(...T.stakeSkull(206, G, 60, 11), ...T.stakeSkull(360, G, 60, 11), ...T.stakeSkull(24, G, 70, 11), ...T.stakeSkull(543, G, 70, 11));
      if (lvl >= 2) out.push(...moat('#5a6a44', CX, G, { bridge: '#6a4424' }), ...T.stakeSkull(24, G, 96, 13), ...T.stakeSkull(543, G, 96, 13));
      out.flag = apex; out.smoke = [[102, G - (lvl ? 150 : 132) + 4]];   // дымок из верха шатра
      return out;
    }
    stronghold.S = { banner: '#b8322a', apex3: [CX, 98], banY: 360, domeW: 16, domeDy: 6 }; P3.stronghold = stronghold;

    /* ---------- Крепость: хижины на сваях над болотом, соломенные крыши, тотемы ящеров ---------- */
    const THATCH = '#b8a060', FW = '#7a5a34';
    const hut = (cx, hw, top, rh, win2, base) => {
      base = base || 344; const r = [];
      r.push({ p: T.box(cx - hw, top, cx + hw, base), c: FW, m: 'wood', flow: -Math.PI / 2, line: 1, lines: T.planks(cx - hw, top, cx + hw, base, 14, true, 0.4), sub: [{ p: T.box(cx + hw * 0.45, top, cx + hw + 2, base + 2), c: '#4e3a20', m: 'flat', line: 0 }] });
      r.push({ p: T.arch(cx, base, hw * 0.22, (base - top) * 0.62), c: T.HOLE, m: 'cloth', line: 1 });
      for (const dx of win2) r.push(...T.win(cx + dx, top + (base - top) * 0.52, 8, 18, { cross: false }));
      r.push({ p: [P(cx - hw - 20, top + 12, 1), [cx - hw * 0.5, top - rh * 0.45], P(cx, top - rh, 1), [cx + hw * 0.5, top - rh * 0.45], P(cx + hw + 20, top + 12, 1), [cx, top + 18]], c: THATCH, m: 'fur', furLen: 1.1, flow: Math.PI * 0.5, dens: 1.2, line: 1, belly: 0.25,
        lines: [{ p: [[cx - hw - 16, top + 10], [cx, top + 16], [cx + hw + 16, top + 10]], w: 4, c: '#7a6030', a: 0.8 }] });
      r.push({ p: tube([[cx, top - rh + 10, 6], [cx, top - rh - 18, 3]]), c: '#4a3a24', m: 'wood', line: 0.6 });
      r.apex = [cx, top - rh - 18];
      return r;
    };
    const stilts = (x0, x1, y, st) => { const out = []; for (let x = x0; x <= x1; x += st) out.push({ p: tube([[x, y + 8, 9], [x + 2, 424, 9]], { flat0: true }), c: '#4a3a24', m: 'wood', line: 0.8 }); return out; };
    const deck = (x0, x1, y) => ({ p: T.box(x0, y, x1, y + 16), c: '#8a6a40', m: 'wood', flow: 0, line: 1, lines: T.planks(x0, y, x1, y + 16, 22, true, 0.5) });
    const reeds = () => { const out = []; for (const x of [14, 160, 250, 330, 420, 556]) for (let k = -1; k <= 1; k++) out.push({ p: tube([[x + k * 6, 420, 3], [x + k * 9, 386 + Math.abs(k) * 8, 2]]), c: '#6a9a3a', m: 'leather', line: 0.5 }); return out; };
    function fortress(lvl) {
      const out = [];
      if (lvl === 0) {   // отдельные хижины, каждая на своих сваях
        for (const [cx, hw] of [[96, 48], [471, 48]]) out.push(...stilts(cx - 48, cx + 48, 358, 32), deck(cx - 64, cx + 64, 350), ...hut(cx, hw, 286, 76, [-28, 28], 352));
        out.push(...stilts(CX - 60, CX + 60, 342, 40), deck(CX - 76, CX + 76, 334));
      } else {
        out.push(...T.lizardTotem(28, 398, 150), ...T.lizardTotem(539, 398, 150));
        out.push(...stilts(34, 540, 344, 30), deck(18, 549, 342));
        // у замка боковые хижины — двухъярусные сторожевые дома
        const top = lvl >= 3 ? 206 : 270;
        out.push(...hut(96, 56, top, 86, [-34, 34]), ...hut(471, 56, top, 86, [-34, 34]));
        if (lvl >= 3) for (const x of [96, 471]) out.push({ p: T.box(x - 66, 300, x + 66, 308), c: '#8a6a40', m: 'wood', flow: 0, line: 1, lines: [-1, -0.5, 0, 0.5, 1].map(k => ({ p: [[x + k * 62, 300], [x + k * 62, 288]], w: 2, c: '#4a3a24', a: 0.9 })).concat([{ p: [[x - 64, 288], [x + 64, 288]], w: 2.4, c: '#4a3a24', a: 0.9 }]) });
      }
      let apex;
      if (lvl >= 3) { const h = hut(CX, 80, 214, 130, [-46, 46]); out.push(...h, ...T.win(CX, 184, 10, 24, { cross: false })); apex = h.apex; }
      else if (lvl >= 2) { const h = hut(CX, 74, 226, 120, [-42, 42]); out.push(...h); apex = h.apex; }
      else { const h = hut(CX, 60, lvl ? 262 : 258, 96, [-32, 32], lvl ? 344 : 336); out.push(...h); apex = h.apex; }
      if (lvl >= 1) {   // частокол из заострённых кольев по краю настила, ворота между тотемами
        out.push(T.palisade(18, CX - 44, 312, 360, 20, '#6a4a28', { bands: [340] }), T.palisade(CX + 44, 549, 312, 360, 20, '#6a4a28', { bands: [340] }));
        out.push(...T.gate(CX, 356, 30, 64, { grate: false, door: '#5a3a1c', hole: T.HOLE }));
        out.push(...T.lizardTotem(CX - 70, 398, [0, 90, 104, 116][lvl]), ...T.lizardTotem(CX + 56, 398, [0, 90, 104, 116][lvl]));
      } else out.push(...T.lizardTotem(206, 398, 90));
      out.push(T.water(0, 567, 396, G, '#3a6a58', { n: 12 }), ...reeds());
      out.flag = apex; out.smoke = [[471, (lvl >= 3 ? 206 : lvl ? 270 : 286) - (lvl ? 86 : 76) + 14]];
      return out;
    }
    fortress.S = { banner: '#2a7a5a', banX: 188, banY: 290, domeW: 16, domeDy: 8 }; P3.fortress = fortress;

    /* ---------- Улей: ульи из воска, соты, хитиновые шпили ---------- */
    const WAX = '#d8b048', CH = '#8aa02a';
    function hive(lvl) {
      if (lvl >= 3) return Object.assign(full('hive', { moatC: '#e0a030', moatO: { bridge: '#8a6a2a' } }), { smoke: [] });
      const out = [];
      if (lvl >= 1) out.push(...T.spire(34, G, 280 + lvl * 20, 24, CH, '#ffb020'), ...T.spire(533, G, 280 + lvl * 20, 24, CH, '#ffb020'));
      else out.push(...T.spire(40, G, 190, 18, CH, '#ffb020'), ...T.spire(527, G, 190, 18, CH, '#ffb020'));
      if (lvl >= 2) out.push(...T.spire(160, 350, 150, 16, '#6a8020', '#ffc040'), ...T.spire(410, 350, 150, 16, '#6a8020', '#ffc040'));
      // малые ульи: у поселения на земле, за стеной — чуть дальше и выше, чтобы стену было видно
      const sb = lvl ? G - 40 : G;
      out.push(T.skep(110, sb, 60, 118, '#caa040'), T.skep(456, sb, 60, 118, '#caa040'), { e: [110, sb - 24, 12, 10], c: '#2a1a08', m: 'cloth', line: 1 }, { e: [456, sb - 24, 12, 10], c: '#2a1a08', m: 'cloth', line: 1 });
      if (lvl >= 1) out.push({ p: T.box(18, 368, 549, G), c: '#c8a040', m: 'leather', line: 1, lines: T.combLines(20, 378, 549, G, 11) }, T.spikes(12, 555, 368, 18, 26, '#6a8020'));
      const hw = [70, 84, 104][lvl], h = [150, 190, 250][lvl];
      out.push(T.skep(CX, G, hw, h, WAX, { comb: lvl >= 1 }));
      const cells = lvl >= 2 ? [[CX - 34, 250], [CX + 18, 232], [CX + 50, 280], [CX - 58, 310], [CX + 40, 330]] : lvl ? [[CX - 30, 300], [CX + 26, 290], [CX - 40, 350], [CX + 40, 356]] : [[CX - 22, 340], [CX + 24, 352]];
      for (const [x, y] of cells) out.push({ p: T.hexPts(x, y, 12), c: '#ffc040', m: 'gem', gloss: 0.7, line: 1, lc: '#5a3a08' });
      out.push({ p: ell(CX, G - 34, 26 + lvl * 4, 26 + lvl * 4, 12), c: '#1e1206', m: 'cloth', ao: 1.4, line: 1 });
      const top = G - h;
      out.push({ p: tube([[CX, top + 6, 7], [CX, top - 28, 4]]), c: CH, m: 'horn', line: 0.8 }, { e: [CX, top - 32, 9, 10], c: '#ffb020', m: 'gem', line: 0.8 });
      if (lvl >= 2) out.push(...moat('#e0a030', CX, G, { bridge: '#8a6a2a' }));
      out.flag = [CX, top - 40]; out.smoke = [];
      return out;
    }
    hive.S = { banner: '#8aa02a', apex3: [CX, 96], banX: 190, banY: 372, domeW: 14, domeDy: 0 }; P3.hive = hive;

    /* ---------- Бастион: бревенчатые избы под мхом, священный дуб, частокол, длинный дом ---------- */
    const BWOOD = '#8a5a30', MOSS = '#5a8a2e';
    /** Священный дуб: k — размер (1 — как у замка), base — где стоит ствол. */
    const oak = (k, base) => { const d = (1 - k) * 120;
      return [...T.trunk(CX, base, 150 + d, 30 * k + 4, '#6a4a2c', 0), ...[-1, 1].map(s => ({ p: tube([[CX, 190 + d, 20 * k], [CX + s * 60 * k, 150 + d, 13 * k], [CX + s * 110 * k, 140 + d, 7 * k]]), c: '#6a4a2c', m: 'wood', line: 0.9 })),
        ...T.foliage(CX, 108 + d, 170 * k, 88 * k, 10, ['#2a5a20', '#3e7a2a', '#52902e', '#6aa838'], 29)]; };
    const izba = (cx, base, hw, wh) => house(cx, base, hw, wh, { wall: BWOOD, wallD: '#5a3a1c', logs: true, roofK: 'gable', roof: MOSS, roofD: '#3a6a1e', roofM: 'fur' });
    const totem = x => [{ p: tube([[x, G, 10], [x, 340, 8]]), c: '#6a4424', m: 'wood', line: 0.8, lines: [{ p: [[x - 5, 390], [x + 5, 390]], w: 4, c: '#b8322a', a: 0.9 }] }, ...T.skull(x, 330, 14, { horns: true })];
    function bastion(lvl) {
      if (lvl >= 3) return Object.assign(full('bastion', { moatC: '#4a6a4a', moatO: { bridge: '#6a4424' }, flag3: [CX, 186] }), { smoke: [[CX + 44, 226]] });   // флажок — на коньке длинного дома, не в кроне дуба
      const out = [...oak(lvl >= 2 ? 1 : 0.72, lvl >= 2 ? 300 : G - 60)];
      out.push(...izba(96, lvl ? G - 20 : G, 50, 70), ...izba(470, lvl ? G - 20 : G, 50, 70));
      if (lvl >= 1) out.push(T.palisade(10, 557, 312, G, 22, '#7a5230', { bands: [352, 400] }));
      let apex;
      if (lvl >= 2) {   // длинный дом вождя над частоколом
        const logs = []; for (let y = 292; y < G; y += 16) logs.push({ p: [[CX - 96, y], [CX + 96, y]], w: 2.4, a: 0.5 });
        out.push({ p: T.box(CX - 96, 282, CX + 96, G), c: BWOOD, m: 'wood', flow: 0, line: 1, lines: logs, sub: [{ p: T.box(CX + 56, 280, CX + 98, G + 2), c: '#5a3a1c', m: 'flat', line: 0 }] });
        out.push({ p: T.gable(CX - 96, CX + 96, 292, 96, 20), c: MOSS, m: 'fur', furLen: 0.9, flow: Math.PI * 0.5, line: 1, belly: 0.3, lines: [{ p: [[CX - 102, 290], [CX, 204], [CX + 102, 290]], w: 5, c: '#4a3018', a: 0.8 }] });
        out.push({ p: tube([[CX - 28, 214, 8], [CX + 4, 194, 7], [CX + 28, 170, 4]]), c: BWOOD, m: 'wood', line: 0.8 }, { p: tube([[CX + 28, 214, 8], [CX - 4, 194, 7], [CX - 28, 170, 4]]), c: BWOOD, m: 'wood', line: 0.8 });
        out.push(...T.win(CX - 58, 340, 9, 24), ...T.win(CX + 58, 340, 9, 24), ...T.win(CX, 262, 10, 26));
        apex = [CX, 196];
      } else { const h = izba(CX, G, 70, 84); out.push(...h); apex = h.apex; }
      if (lvl >= 1) out.push(...T.gate(CX, G, 30, 76, { grate: false, door: '#5a3a1c' }), ...totem(178), ...totem(388));
      else out.push(...totem(196), ...totem(370));
      if (lvl >= 2) out.push(...moat('#4a6a4a', CX, G, { bridge: '#6a4424' }));
      out.flag = apex; out.smoke = [[470, (lvl ? G - 20 : G) - 70 - 50]];
      return out;
    }
    bastion.S = { banner: '#5a8a2e', apex3: [CX, 186], banY: 330, domeW: 16, domeDy: 4 }; P3.bastion = bastion;

    return P3;
  }

  if (H3.VTownKit) init(H3.VTownKit);
})(typeof window !== 'undefined' ? window : globalThis);
