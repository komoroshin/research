/* ============================================================================
   model/battle.js — движок тактического боя (ТЗ §7). Чистая логика:
   create() → bstate; act(b, action) → events[]. Представление проигрывает
   события; ИИ и автобой вызывают те же функции.
   Поле 15×11 (odd-r), атакующий слева. Все существа занимают один гекс.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Hex = U.Hex, C = H3.Creatures, R = H3.Rules, SP = H3.Spells, F = H3.Factions;
  const W = 15, H = 11;
  const ROWS_BY_COUNT = { 1: [5], 2: [3, 7], 3: [2, 5, 8], 4: [1, 4, 6, 9], 5: [1, 3, 5, 7, 9], 6: [0, 2, 4, 6, 8, 10], 7: [0, 2, 4, 5, 6, 8, 10] };
  const WALL_COL = 11, MOAT_COL = 10;
  const WALL_SEGMENTS = { 0: 0, 1: 0, 3: 1, 4: 1, 6: 2, 7: 2, 9: 3, 10: 3 }; // row → индекс участка
  const TOWER_ROWS = { 2: 'top', 8: 'bottom' }; // гексы башен (непроходимы всегда)
  const GATE_ROW = 5;
  const MAX_ROUNDS = 100;

  /* ---------- создание ---------- */
  /**
   * sides: { hero (объект героя или null), army [7], player (id или -1), name }
   * opts: { terrain, siege: town|null, rng, native: {0: bool, 1: bool} }
   */
  function create(att, def, opts) {
    const rng = opts.rng;
    const b = {
      round: 0, terrain: opts.terrain || 'grass', units: [], obstacles: [], queue: [], waitQueue: [], pos: 0, cur: null,
      sides: [mkSide(att, 0, opts), mkSide(def, 1, opts)], casted: [false, false], over: false, winner: null, result: null,
      events: [], log: [], siege: null, _rng: rng, turnsTotal: 0,
    };
    if (opts.siege) {
      const town = opts.siege;
      const fl = R.fortLevel(town);
      b.siege = { fortLevel: fl, walls: [fl ? 2 : 0, fl ? 2 : 0, fl ? 2 : 0, fl ? 2 : 0], gate: fl ? 2 : 0, moat: fl >= 2, towers: fl >= 3 ? 3 : fl >= 2 ? 1 : 0, faction: town.faction, moatDmg: town.faction === 'fortress' ? 90 : 70 };
    }
    // юниты
    for (let s = 0; s < 2; s++) {
      const side = b.sides[s];
      const stacks = side.army.map((st, i) => ({ st, i })).filter(x => x.st && x.st.n > 0);
      const rows = ROWS_BY_COUNT[Math.min(7, stacks.length)] || [5];
      stacks.forEach((x, k) => {
        const c = C.get(x.st.cid);
        const col = s === 0 ? 0 : (b.siege ? 13 : 14);
        const u = mkUnit(b, s, x.i, c, x.st.n, col, rows[k]);
        b.units.push(u);
      });
    }
    // препятствия
    const nObs = rng.int(3, 7);
    const kinds = { grass: ['obst_rock', 'obst_stump', 'obst_bush'], dirt: ['obst_rock', 'obst_stump', 'obst_bones'], sand: ['obst_rock', 'obst_bones'], snow: ['obst_ice', 'obst_rock'], swamp: ['obst_stump', 'obst_bush'], rough: ['obst_rock', 'obst_rock', 'obst_bones'], lava: ['obst_lava', 'obst_lava', 'obst_bones'], subter: ['obst_rock', 'obst_bones'] };
    const ks = kinds[b.terrain] || kinds.grass;
    for (let i = 0; i < nObs; i++) {
      for (let t = 0; t < 30; t++) {
        const x = rng.int(2, b.siege ? 8 : 12), y = rng.int(0, H - 1);
        if (unitAt(b, x, y) || b.obstacles.some(o => o.x === x && o.y === y)) continue;
        b.obstacles.push({ x, y, kind: rng.pick(ks) }); break;
      }
    }
    newRound(b);
    return b;
  }
  function mkSide(src, idx, opts) {
    const hero = src.hero || null;
    const side = { idx, hero, heroId: hero ? hero.id : null, player: src.player, name: src.name || (hero ? hero.name : 'Нейтралы'), army: src.army, isAI: !!src.isAI,
      att: 0, def: 0, pow: 0, kno: 0, morale: 0, luck: 0, native: !!(opts.native && opts.native[idx]), canRetreat: src.canRetreat !== false, mana: 0, spellsCast: 0, extraMorale: src.morale || 0, extraLuck: src.luck || 0 };
    if (hero) {
      const p = R.heroPrimary(hero); side.att = p.att; side.def = p.def; side.pow = p.pow; side.kno = p.kno;
      side.morale = R.heroMorale(hero).value; side.luck = R.heroLuck(hero).value; side.mana = hero.mana;
    }
    side.morale = U.clamp(side.morale + side.extraMorale, -3, 3); side.luck = U.clamp(side.luck + side.extraLuck, -3, 3);
    return side;
  }
  function mkUnit(b, side, slot, c, n, x, y) {
    const s = b.sides[side];
    const fx = s.hero ? R.artifactFx(s.hero) : {};
    const maxHp = c.hp + (fx.hp || 0);
    return { id: b.units.length, side, slot, cid: c.id, count: n, initial: n, hp: maxHp, maxHp, x, y, alive: true,
      shots: C.shots(c), retal: 0, waited: false, defended: false, effects: {}, tempRaised: 0, moved: 0, acted: false, blockedRet: 0, killed: 0 };
  }

  /* ---------- вспомогательные ---------- */
  const cre = u => C.get(u.cid);
  function unitAt(b, x, y) { return b.units.find(u => u.alive && u.x === x && u.y === y) || null; }
  function inField(x, y) { return x >= 0 && y >= 0 && x < W && y < H; }
  function isObstacle(b, x, y) { return b.obstacles.some(o => o.x === x && o.y === y); }
  function wallState(b, x, y) { // 0 нет стены, 1 разрушена/проход, 2 стена цела/повреждена (непроходимо), 3 башня
    if (!b.siege || x !== WALL_COL) return 0;
    if (TOWER_ROWS[y]) return 3;
    if (y === GATE_ROW) return b.siege.gate > 0 ? 2 : 1;
    const seg = WALL_SEGMENTS[y];
    return b.siege.walls[seg] > 0 ? 2 : 1;
  }
  function passable(b, u, x, y) {
    if (!inField(x, y)) return false;
    if (isObstacle(b, x, y)) return false;
    const other = unitAt(b, x, y);
    if (other && other.id !== u.id) return false;
    const ws = wallState(b, x, y);
    if (ws === 3) return false;
    if (ws === 2) {
      if (y === GATE_ROW && u.side === 1) return true; // защитник проходит через ворота
      return C.isFlyer(cre(u)) ? false : false; // летающие перелетают, но не садятся на стену
    }
    return true;
  }
  function isMoat(b, x, y) { return !!(b.siege && b.siege.moat && x === MOAT_COL); }
  function effVal(u, name) { const e = u.effects[name]; return e ? e.v : 0; }
  function hasEff(u, name) { return !!u.effects[name]; }
  function effSpeed(b, u) {
    const c = cre(u);
    let s = c.speed + effVal(u, 'haste') + effVal(u, 'prayer');
    if (hasEff(u, 'slow')) s = Math.floor(s * (1 - effVal(u, 'slow') / 100));
    const side = b.sides[u.side];
    if (side.hero) { const fx = R.artifactFx(side.hero); s += fx.speed || 0; if (side.hero.spec && side.hero.spec.type === 'creature' && (side.hero.spec.id === u.cid || C.get(side.hero.spec.id).upgTo === u.cid)) s += 1; }
    if (side.native) s += 1;
    return Math.max(1, s);
  }
  function specBonus(side, u) {
    const h = side.hero; if (!h || !h.spec || h.spec.type !== 'creature') return 0;
    const sc = C.get(h.spec.id);
    if (h.spec.id !== u.cid && sc.upgTo !== u.cid) return 0;
    return 0.05 * Math.floor(h.level / sc.tier);
  }
  function effAtt(b, u, melee) {
    const c = cre(u), side = b.sides[u.side];
    let a = c.att + side.att + effVal(u, 'prayer') - effVal(u, 'weakness') - effVal(u, 'disease');
    if (melee) a += effVal(u, 'bloodlust'); else a += effVal(u, 'precision');
    if (side.native) a += 1;
    a += Math.round(c.att * specBonus(side, u));
    return Math.max(0, a);
  }
  function effDef(b, u) {
    const c = cre(u), side = b.sides[u.side];
    let d = c.def + side.def + effVal(u, 'stone_skin') + effVal(u, 'prayer') - effVal(u, 'disrupting_ray') - effVal(u, 'disease');
    if (u.defended) d = Math.floor(d * 1.2);
    if (side.native) d += 1;
    d += Math.round(c.def * specBonus(side, u));
    return Math.max(0, d);
  }
  function unitMorale(b, u) {
    const c = cre(u); if (C.noMorale(c)) return 0;
    const side = b.sides[u.side], enemy = b.sides[1 - u.side];
    let m = side.morale;
    if (b.units.some(e => e.alive && e.side !== u.side && C.hasAb(cre(e), 'enemyMorale'))) m -= 1;
    if (enemy.hero && R.artifactFx(enemy.hero).enemyMorale) m += R.artifactFx(enemy.hero).enemyMorale;
    if (C.hasAb(c, 'minMorale')) m = Math.max(1, m);
    return U.clamp(m, -3, 3);
  }
  function unitLuck(b, u) {
    const side = b.sides[u.side];
    let l = side.luck + effVal(u, 'fortune');
    if (b.units.some(e => e.alive && e.side !== u.side && C.hasAb(cre(e), 'enemyLuck'))) l -= 1;
    return U.clamp(l, -3, 3);
  }
  function totalHp(u) { return (u.count - 1) * u.maxHp + u.hp; }
  function canAct(u) { return u.alive && !hasEff(u, 'blind') && !hasEff(u, 'petrify') && !hasEff(u, 'paralyze'); }
  function isShooterNow(b, u) {
    const c = cre(u);
    if (!C.isShooter(c) || u.shots <= 0) return false;
    return !adjacentEnemy(b, u);
  }
  function adjacentEnemy(b, u) {
    for (const [nx, ny] of Hex.neighbors(u.x, u.y)) { const o = unitAt(b, nx, ny); if (o && o.side !== u.side) return o; }
    return null;
  }
  function enemies(b, side) { return b.units.filter(u => u.alive && u.side !== side); }
  function allies(b, side) { return b.units.filter(u => u.alive && u.side === side); }

  /* ---------- достижимость ---------- */
  /** Возвращает { hexes: Map('x,y' → {x,y,cost,prev}), attacks: [{target, from}] } */
  function reachable(b, u) {
    const c = cre(u), speed = effSpeed(b, u), fly = C.isFlyer(c);
    const res = new Map();
    const key = (x, y) => x + ',' + y;
    if (hasEff(u, 'bound')) { res.set(key(u.x, u.y), { x: u.x, y: u.y, cost: 0, prev: null }); return finish(); }
    if (fly) {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const d = Hex.dist(u.x, u.y, x, y);
        if (d <= speed && passable(b, u, x, y)) res.set(key(x, y), { x, y, cost: d, prev: null });
      }
      res.set(key(u.x, u.y), { x: u.x, y: u.y, cost: 0, prev: null });
    } else {
      const q = [[u.x, u.y]]; res.set(key(u.x, u.y), { x: u.x, y: u.y, cost: 0, prev: null });
      while (q.length) {
        const [x, y] = q.shift(); const cur = res.get(key(x, y));
        if (cur.cost >= speed) continue;
        if (isMoat(b, x, y) && !(x === u.x && y === u.y)) continue; // ров останавливает
        for (const [nx, ny] of Hex.neighbors(x, y)) {
          if (!passable(b, u, nx, ny) || res.has(key(nx, ny))) continue;
          res.set(key(nx, ny), { x: nx, y: ny, cost: cur.cost + 1, prev: [x, y] });
          q.push([nx, ny]);
        }
      }
    }
    return finish();
    function finish() {
      const attacks = [];
      for (const e of enemies(b, u.side)) {
        for (const [nx, ny] of Hex.neighbors(e.x, e.y)) {
          const r = res.get(key(nx, ny));
          if (r) attacks.push({ target: e.id, from: [nx, ny], cost: r.cost });
        }
      }
      return { hexes: res, attacks, speed, fly };
    }
  }
  function pathFrom(reach, x, y) {
    const out = []; let k = reach.hexes.get(x + ',' + y);
    while (k && k.prev) { out.push([k.x, k.y]); k = reach.hexes.get(k.prev[0] + ',' + k.prev[1]); }
    return out.reverse();
  }

  /* ---------- урон ---------- */
  /** Расчёт урона: возвращает {min, max, mult, base...}. opts: {ranged, dist, jousted, luck} */
  function calcDamage(b, a, t, opts) {
    opts = opts || {};
    const ca = cre(a), ct = cre(t), sa = b.sides[a.side], st = b.sides[t.side];
    const melee = !opts.ranged;
    const A = effAtt(b, a, melee);
    let D = effDef(b, t);
    const ign = C.abNum(ca, 'ignoreDefense', 0); if (ign) D = Math.floor(D * (1 - ign / 100));
    let I = 0, Rm = 1;
    if (A > D) I += Math.min(0.05 * (A - D), 3); else if (D > A) Rm *= 1 - Math.min(0.025 * (D - A), 0.7);
    // навыки героя
    if (sa.hero) {
      const off = R.skillVal(sa.hero, melee ? 'offense' : 'archery') / 100; I += off;
    }
    if (opts.luck) I += 1;
    if (opts.deathBlow) I += 1;
    const hateList = (C.abParam(ca, 'hate') || '').split(',');
    if (hateList.includes(t.cid)) I += 0.5;
    if (C.hasAb(ca, 'jousting') && opts.jousted && !C.hasAb(ct, 'immuneJoust')) I += 0.05 * opts.jousted;
    if (st.hero) Rm *= 1 - R.skillVal(st.hero, 'armorer') / 100;
    if (melee && hasEff(t, 'shield')) Rm *= 1 - effVal(t, 'shield') / 100;
    if (!melee && hasEff(t, 'air_shield')) Rm *= 1 - effVal(t, 'air_shield') / 100;
    if (!melee) {
      if ((opts.dist || 0) > 10 && !C.hasAb(ca, 'noRangePenalty')) Rm *= 0.5;
      if (opts.wall) Rm *= 0.5;
    } else if (C.isShooter(ca) && !C.hasAb(ca, 'noMeleePenalty')) Rm *= 0.5;
    if (opts.retalPenalty) Rm *= opts.retalPenalty;
    if (hasEff(t, 'petrify')) Rm *= 0.5;
    let dmin = ca.dmg[0], dmax = ca.dmg[1];
    if (hasEff(a, 'bless')) { dmin = dmax = dmax + effVal(a, 'bless'); }
    else if (hasEff(a, 'curse')) { dmin = dmax = Math.max(1, dmin - effVal(a, 'curse')); }
    const n = a.count;
    const mult = (1 + I) * Rm;
    const lo = Math.max(1, Math.floor(dmin * n * mult)), hi = Math.max(1, Math.floor(dmax * n * mult));
    return { min: lo, max: hi, mult, dmin, dmax, n };
  }
  function rollBase(b, a, dmin, dmax) {
    const n = a.count, rng = b._rng;
    if (dmin === dmax) return dmin * n;
    if (n <= 10) { let s = 0; for (let i = 0; i < n; i++) s += rng.int(dmin, dmax); return s; }
    let s = 0; for (let i = 0; i < 10; i++) s += rng.int(dmin, dmax); return Math.floor(s * n / 10);
  }
  function rollDamage(b, a, t, opts) {
    const d = calcDamage(b, a, t, opts);
    const base = rollBase(b, a, d.dmin, d.dmax);
    return Math.max(1, Math.floor(base * d.mult));
  }
  /** Наносит урон; возвращает число убитых. */
  function applyDamage(b, t, dmg, src) {
    if (!t.alive) return 0;
    let killed = 0;
    if (dmg >= totalHp(t)) { killed = t.count; t.count = 0; t.hp = 0; t.alive = false; }
    else {
      if (dmg < t.hp) t.hp -= dmg;
      else { dmg -= t.hp; killed = 1 + Math.floor(dmg / t.maxHp); t.hp = t.maxHp - (dmg % t.maxHp); t.count -= killed; }
    }
    b.sides[1 - t.side].killedValue = (b.sides[1 - t.side].killedValue || 0) + killed * C.aiValue(cre(t));
    t.killed += killed;
    b.events.push({ t: 'damage', unit: t.id, dmg, killed, src: src || null, dead: !t.alive });
    if (!t.alive) b.events.push({ t: 'death', unit: t.id });
    return killed;
  }
  function heal(b, u, amount, canRaise, permanent) {
    if (!u.alive && !canRaise) return 0;
    const c = cre(u);
    let raised = 0;
    if (!u.alive) { u.alive = true; u.count = 0; u.hp = 0; }
    // сначала долечиваем верхнего
    const missing = u.count > 0 ? u.maxHp - u.hp : 0;
    const top = Math.min(missing, amount); if (u.count > 0) { u.hp += top; amount -= top; }
    if (canRaise) {
      while (amount >= u.maxHp && u.count < u.initial) { u.count++; u.hp = u.maxHp; amount -= u.maxHp; raised++; }
      if (u.count < u.initial && amount > 0 && u.count === 0) { u.count = 1; u.hp = amount; raised++; amount = 0; }
      if (u.count === 0) { u.alive = false; }
      if (!permanent) u.tempRaised += raised;
    }
    b.events.push({ t: 'heal', unit: u.id, raised, hp: top });
    return raised;
  }

  /* ---------- удары ---------- */
  function strike(b, a, t, opts) {
    opts = opts || {};
    const ca = cre(a), ct = cre(t);
    let luck = false, deathBlow = false;
    if (!opts.noLuck) { const l = unitLuck(b, a); if (l > 0 && b._rng.chance(R.LUCK_CHANCE[l])) luck = true; }
    if (C.hasAb(ca, 'deathBlow') && b._rng.chance(C.abNum(ca, 'deathBlow') / 100)) deathBlow = true;
    const dmg = rollDamage(b, a, t, Object.assign({}, opts, { luck, deathBlow }));
    if (luck) b.events.push({ t: 'luck', unit: a.id });
    b.events.push({ t: opts.ranged ? 'shoot' : 'hit', unit: a.id, target: t.id, dmg });
    const beforeCount = t.count;
    const killed = applyDamage(b, t, dmg, a.id);
    // эффекты при ударе
    if (t.alive) {
      if (hasEff(t, 'blind')) { delete t.effects.blind; b.events.push({ t: 'effectEnd', unit: t.id, effect: 'blind' }); }
      for (const oh of C.onHits(ca)) {
        if (!b._rng.chance(oh.chance / 100)) continue;
        if (oh.effect === 'lightning') { const extra = 10 * a.count; applyDamage(b, t, extra, a.id); b.events.push({ t: 'ability', unit: a.id, target: t.id, ab: 'lightning', dmg: extra }); continue; }
        if (oh.effect === 'blind' && (C.hasAb(ct, 'blindImmune') || C.hasAb(ct, 'mindImmune') || C.isUndead(ct))) continue;
        if (oh.effect === 'petrify' && C.hasAb(ct, 'blindImmune')) continue;
        if (C.hasAb(ct, 'spellImmune') && C.abNum(ct, 'spellImmune') >= 3 && ['blind', 'petrify', 'paralyze', 'curse', 'weakness'].includes(oh.effect)) continue;
        addEffect(b, t, oh.effect, oh.effect === 'curse' ? 0 : oh.effect === 'weakness' ? 3 : oh.effect === 'disease' ? 2 : 1, 3);
      }
      if (C.hasAb(ca, 'dispelOnHit')) { for (const k of ['haste', 'bless', 'shield', 'stone_skin', 'bloodlust', 'precision', 'fortune', 'air_shield', 'prayer']) if (t.effects[k]) { delete t.effects[k]; } b.events.push({ t: 'effectEnd', unit: t.id, effect: 'dispel' }); }
      if (C.hasAb(ca, 'deathStare')) {
        const stares = Math.min(Math.ceil(t.count * 0.1), countHits(b, a.count, 0.1));
        if (stares > 0) { const d = stares * t.maxHp; applyDamage(b, t, Math.min(d, totalHp(t)), a.id); b.events.push({ t: 'ability', unit: a.id, target: t.id, ab: 'deathStare', killed: stares }); }
      }
    }
    if (C.hasAb(ca, 'lifeDrain') && dmg > 0) heal(b, a, dmg, true, true);
    if (!opts.ranged && C.hasAb(ct, 'fireShield') && t.alive && !C.hasAb(ca, 'fireImmune')) { const back = Math.floor(dmg * C.abNum(ct, 'fireShield') / 100); if (back > 0) { applyDamage(b, a, back, t.id); b.events.push({ t: 'ability', unit: t.id, target: a.id, ab: 'fireShield', dmg: back }); } }
    return { dmg, killed, luck, beforeCount };
  }
  function countHits(b, n, p) { let k = 0; for (let i = 0; i < Math.min(n, 30); i++) if (b._rng.chance(p)) k++; return k; }
  function addEffect(b, u, name, v, turns) {
    const c = cre(u);
    if (name === 'aging') { u.maxHp = Math.max(1, Math.floor(cre(u).hp / 2)); u.hp = Math.min(u.hp, u.maxHp); }
    if (name === 'poison') { u.effects.poison = { v: 1, turns: 5, applied: 0 }; b.events.push({ t: 'effect', unit: u.id, effect: name }); return; }
    if (name === 'disrupting_ray' && u.effects[name]) { u.effects[name].v += v; b.events.push({ t: 'effect', unit: u.id, effect: name }); return; }
    if (['blind', 'petrify', 'paralyze'].includes(name) && (C.hasAb(c, 'mindImmune') && name === 'blind')) return;
    u.effects[name] = { v, turns: turns || 3 };
    b.events.push({ t: 'effect', unit: u.id, effect: name, v });
  }
  /** Полная атака (с ответом, двойным ударом, спецспособностями). */
  function performAttack(b, a, t, opts) {
    const ca = cre(a);
    const ranged = !!opts.ranged;
    const canRetal = !ranged && !C.hasAb(ca, 'noRetaliation');
    const extraTargets = [];
    if (!ranged && C.hasAb(ca, 'breath')) { const [bx, by] = Hex.beyond(a.x, a.y, t.x, t.y); const o = unitAt(b, bx, by); if (o && o.id !== a.id) extraTargets.push(o); }
    if (!ranged && C.hasAb(ca, 'attackAll')) for (const [nx, ny] of Hex.neighbors(a.x, a.y)) { const o = unitAt(b, nx, ny); if (o && o.side !== a.side && o.id !== t.id) extraTargets.push(o); }
    if (!ranged && C.hasAb(ca, 'threeHeaded')) { let k = 0; for (const [nx, ny] of Hex.neighbors(a.x, a.y)) { const o = unitAt(b, nx, ny); if (o && o.side !== a.side && o.id !== t.id && k < 2) { extraTargets.push(o); k++; } } }
    if (ranged && (C.hasAb(ca, 'deathCloud') || C.hasAb(ca, 'fireballShot'))) for (const [nx, ny] of Hex.neighbors(t.x, t.y)) { const o = unitAt(b, nx, ny); if (o && o.id !== a.id && !(C.hasAb(ca, 'deathCloud') && C.isUndead(cre(o)))) extraTargets.push(o); }
    const hits = C.hasAb(ca, 'doubleAttack') ? 2 : 1;
    for (let h = 0; h < hits; h++) {
      if (!a.alive || !t.alive) break;
      strike(b, a, t, { ranged, dist: opts.dist, jousted: opts.jousted, wall: opts.wall });
      for (const et of extraTargets) if (et.alive && a.alive) strike(b, a, et, { ranged, dist: opts.dist, noLuck: true });
      if (h === 0 && canRetal && t.alive && a.alive) retaliate(b, t, a);
    }
    if (ranged) a.shots--;
  }
  function retaliate(b, t, a) {
    if (t.retal <= 0 || !t.alive || !a.alive) return;
    if (hasEff(t, 'petrify') || hasEff(t, 'paralyze')) return;
    let pen = 1;
    if (t._wakingBlind !== undefined) { pen = t._wakingBlind; delete t._wakingBlind; if (pen === 0) return; }
    t.retal--;
    b.events.push({ t: 'retaliate', unit: t.id, target: a.id });
    strike(b, t, a, { retalPenalty: pen });
  }

  /* ---------- очередь и раунды ---------- */
  function newRound(b) {
    b.round++;
    if (b.round > MAX_ROUNDS) { finish(b, 0, 'timeout'); return; }
    b.casted = [false, false];
    b.events.push({ t: 'newRound', round: b.round });
    for (const u of b.units) if (u.alive) { u.retal = C.abNum(cre(u), 'retaliations', 1); u.waited = false; u.defended = false; u.acted = false; }
    // осада: башни и катапульта
    if (b.siege) {
      if (b.siege.towers) {
        const targets = enemies(b, 1);
        if (targets.length) {
          const shots = [30].concat(b.siege.towers === 3 ? [15, 15] : []);
          for (const dmg of shots) { const alive = targets.filter(u => u.alive); if (!alive.length) break; const t = b._rng.pick(alive); b.events.push({ t: 'tower', target: t.id, dmg }); applyDamage(b, t, dmg, 'tower'); }
        }
      }
      const intact = []; for (let i = 0; i < 4; i++) if (b.siege.walls[i] > 0) intact.push(i); if (b.siege.gate > 0) intact.push('gate');
      if (intact.length && b.sides[0].hero) {
        const pick = b._rng.pick(intact), r = b._rng.next();
        let res = 'miss';
        if (r < 0.25) { res = 'destroy'; if (pick === 'gate') b.siege.gate = 0; else b.siege.walls[pick] = 0; }
        else if (r < 0.75) { res = 'hit'; if (pick === 'gate') b.siege.gate--; else b.siege.walls[pick]--; }
        b.events.push({ t: 'catapult', wall: pick, result: res });
      }
    }
    // призрак: вытягивает ману
    for (const u of b.units) if (u.alive && C.hasAb(cre(u), 'manaDrain')) { const es = b.sides[1 - u.side]; if (es.mana > 0) { es.mana = Math.max(0, es.mana - 2); b.events.push({ t: 'manaDrain', unit: u.id }); } }
    // порядок хода
    const order = b.units.filter(u => u.alive).sort((p, q) => {
      const ds = effSpeed(b, q) - effSpeed(b, p); if (ds) return ds;
      const first = (b.round % 2 === 1) ? 0 : 1;
      if (p.side !== q.side) return p.side === first ? -1 : 1;
      return p.slot - q.slot;
    });
    b.queue = order.map(u => u.id); b.waitQueue = []; b.pos = 0;
    checkEnd(b);
    if (!b.over) nextUnit(b);
  }
  function current(b) { return b.cur !== null ? b.units[b.cur] : null; }
  /** Переходит к следующему юниту, обрабатывая пропуски (ослепление, мораль). */
  function nextUnit(b) {
    while (!b.over) {
      let id;
      if (b.pos < b.queue.length) id = b.queue[b.pos++];
      else if (b.waitQueue.length) id = b.waitQueue.shift();
      else { newRound(b); return; }
      const u = b.units[id];
      if (!u.alive) continue;
      // начало хода юнита: эффекты
      startOfTurn(b, u);
      if (!u.alive) continue;
      if (!canAct(u)) { b.events.push({ t: 'skip', unit: u.id, reason: hasEff(u, 'blind') ? 'blind' : hasEff(u, 'petrify') ? 'petrify' : 'paralyze' }); continue; }
      const m = unitMorale(b, u);
      if (m < 0 && !u._moraleChecked && b._rng.chance(R.MORALE_CHANCE[String(m)])) { u._moraleChecked = true; b.events.push({ t: 'morale', unit: u.id, good: false }); continue; }
      u._moraleChecked = false;
      b.cur = u.id;
      b.events.push({ t: 'turn', unit: u.id });
      return;
    }
  }
  function startOfTurn(b, u) {
    const c = cre(u);
    for (const k of Object.keys(u.effects)) {
      const e = u.effects[k];
      if (k === 'poison') { if (e.applied < 5) { e.applied++; u.maxHp = Math.max(1, Math.floor(c.hp * (1 - 0.1 * e.applied))); u.hp = Math.min(u.hp, u.maxHp); b.events.push({ t: 'effect', unit: u.id, effect: 'poison' }); } continue; }
      if (k === 'blind' || k === 'disrupting_ray' || k === 'aging') continue;
      e.turns--; if (e.turns <= 0) { delete u.effects[k]; b.events.push({ t: 'effectEnd', unit: u.id, effect: k }); }
    }
    if (C.hasAb(c, 'regenerate') && u.hp < u.maxHp) { u.hp = u.maxHp; b.events.push({ t: 'heal', unit: u.id, raised: 0, hp: 0, regen: true }); }
    // связывание дендроидом: если рядом нет дендроида — освободить
    if (u.effects.bound) { const near = Hex.neighbors(u.x, u.y).some(([x, y]) => { const o = unitAt(b, x, y); return o && o.side !== u.side && C.hasAb(cre(o), 'bind'); }); if (!near) delete u.effects.bound; }
  }
  function afterAction(b, u, allowMorale) {
    checkEnd(b);
    if (b.over) return;
    if (allowMorale && u.alive) {
      const m = unitMorale(b, u);
      if (m > 0 && !u._moraleBonus && b._rng.chance(R.MORALE_CHANCE[m])) {
        u._moraleBonus = true; b.events.push({ t: 'morale', unit: u.id, good: true }); b.cur = u.id; b.events.push({ t: 'turn', unit: u.id }); return;
      }
    }
    if (u) u._moraleBonus = false;
    b.cur = null;
    nextUnit(b);
  }
  function checkEnd(b) {
    if (b.over) return;
    const a0 = allies(b, 0).length, a1 = allies(b, 1).length;
    if (!a0 && !a1) finish(b, 1, 'draw'); else if (!a0) finish(b, 1, 'annihilation'); else if (!a1) finish(b, 0, 'annihilation');
  }
  function finish(b, winner, reason) {
    b.over = true; b.winner = winner; b.reason = reason; b.cur = null;
    // временно воскрешённые погибают
    for (const u of b.units) if (u.alive && u.tempRaised > 0) { u.count -= u.tempRaised; if (u.count <= 0) { u.count = 0; u.alive = false; } }
    b.events.push({ t: 'end', winner, reason });
    b.result = summarize(b);
  }
  function summarize(b) {
    const sides = b.sides.map((s, i) => {
      const units = b.units.filter(u => u.side === i);
      const army = s.army.map(() => null);
      let lostValue = 0; const losses = [];
      for (const u of units) {
        const c = cre(u);
        if (u.alive && u.count > 0) army[u.slot] = { cid: u.cid, n: u.count };
        const lost = u.initial - (u.alive ? u.count : 0);
        if (lost > 0) { losses.push({ cid: u.cid, n: lost }); lostValue += lost * C.aiValue(c); }
      }
      return { army, losses, lostValue, hero: s.hero, player: s.player, name: s.name, mana: s.mana };
    });
    let xp = 0; const killedLiving = [];
    for (const u of b.units) if (u.side !== b.winner) { const lost = u.initial - (u.alive ? u.count : 0); xp += lost * cre(u).hp; if (lost > 0 && !C.isUndead(cre(u)) && !C.hasAb(cre(u), 'nonliving')) killedLiving.push({ cid: u.cid, n: lost, hp: cre(u).hp }); }
    if (b.sides[1 - b.winner].hero) xp += 500;
    return { winner: b.winner, reason: b.reason, sides, xp, killedLiving, rounds: b.round };
  }

  /* ---------- действия ---------- */
  function act(b, action) {
    b.events = [];
    if (b.over) return b.events;
    const u = current(b);
    if (!u) return b.events;
    const type = action.type;
    if (type === 'wait') {
      if (u.waited) return err('Уже ждёт');
      u.waited = true; b.events.push({ t: 'wait', unit: u.id });
      // вставляем в очередь ожидания по возрастанию скорости
      b.waitQueue.push(u.id); b.waitQueue.sort((p, q) => effSpeed(b, b.units[p]) - effSpeed(b, b.units[q]));
      b.cur = null; nextUnit(b); return b.events;
    }
    if (type === 'defend') { u.defended = true; b.events.push({ t: 'defend', unit: u.id }); afterAction(b, u, false); return b.events; }
    if (type === 'move') {
      const reach = reachable(b, u); const k = reach.hexes.get(action.x + ',' + action.y);
      if (!k || (action.x === u.x && action.y === u.y)) return err('Недостижимо');
      moveUnit(b, u, reach, action.x, action.y);
      afterAction(b, u, true); return b.events;
    }
    if (type === 'attack') {
      const t = b.units[action.target];
      if (!t || !t.alive || t.side === u.side) return err('Нет цели');
      const reach = reachable(b, u);
      let from = action.from;
      const options = reach.attacks.filter(a => a.target === t.id);
      if (!options.length) return err('Цель недостижима');
      if (!from || !options.some(o => o.from[0] === from[0] && o.from[1] === from[1])) from = options.sort((p, q) => p.cost - q.cost)[0].from;
      const origin = [u.x, u.y];
      const moved = moveUnit(b, u, reach, from[0], from[1]);
      if (!u.alive) { afterAction(b, u, false); return b.events; }
      performAttack(b, u, t, { ranged: false, jousted: moved });
      if (C.hasAb(cre(u), 'strikeAndReturn') && u.alive && !unitAt(b, origin[0], origin[1])) { u.x = origin[0]; u.y = origin[1]; b.events.push({ t: 'move', unit: u.id, path: [origin], back: true }); }
      afterAction(b, u, true); return b.events;
    }
    if (type === 'shoot') {
      const t = b.units[action.target];
      if (!t || !t.alive || t.side === u.side) return err('Нет цели');
      if (!isShooterNow(b, u)) return err('Нельзя стрелять');
      const dist = Hex.dist(u.x, u.y, t.x, t.y);
      const wall = !!(b.siege && u.side === 0 && t.x >= WALL_COL && b.siege.walls.some(w => w > 0));
      performAttack(b, u, t, { ranged: true, dist, wall });
      afterAction(b, u, true); return b.events;
    }
    if (type === 'cast') { const r = castSpell(b, u.side, action.spell, action.target, action.hex); if (r !== true) return err(r); return b.events; }
    if (type === 'retreat' || type === 'surrender') {
      const side = b.sides[u.side];
      if (!side.hero || !side.canRetreat) return err('Нельзя отступить');
      finish(b, 1 - u.side, type); return b.events;
    }
    return err('Неизвестное действие');
    function err(msg) { b.events.push({ t: 'error', msg }); return b.events; }
  }
  function moveUnit(b, u, reach, x, y) {
    if (x === u.x && y === u.y) return 0;
    const fly = reach.fly;
    const path = fly ? [[x, y]] : pathFrom(reach, x, y);
    u.x = x; u.y = y;
    b.events.push({ t: 'move', unit: u.id, path, fly });
    if (isMoat(b, x, y) && !fly) { const d = b.siege.moatDmg; b.events.push({ t: 'moat', unit: u.id, dmg: d }); applyDamage(b, u, d, 'moat'); }
    // дендроид связывает соседей
    if (C.hasAb(cre(u), 'bind')) for (const [nx, ny] of Hex.neighbors(x, y)) { const o = unitAt(b, nx, ny); if (o && o.side !== u.side) addEffect(b, o, 'bound', 1, 99); }
    return fly ? Hex.dist(x, y, x, y) : path.length;
  }

  /* ---------- заклинания ---------- */
  function spellTargets(b, side, spell, target, hex) {
    const mastery = b.sides[side].hero ? SP.masteryOf(b.sides[side].hero, spell) : 0;
    const m = Math.max(1, mastery);
    const mass = spell.mass && m === 3;
    let list = [];
    if (spell.all) list = b.units.filter(u => u.alive && (!spell.onlyLiving || !(C.isUndead(cre(u)) || C.hasAb(cre(u), 'nonliving'))) && (!spell.onlyUndead || C.isUndead(cre(u))));
    else if (mass) list = b.units.filter(u => u.alive && (spell.kind === 'buff' || spell.kind === 'heal' ? u.side === side : spell.kind === 'special' ? true : u.side !== side));
    else if (spell.area && hex) {
      const cells = [[hex[0], hex[1]]];
      if (spell.area === 'ring') { cells.length = 0; for (const n of Hex.neighbors(hex[0], hex[1])) cells.push(n); }
      else if (spell.area === 1) for (const n of Hex.neighbors(hex[0], hex[1])) cells.push(n);
      else if (spell.area === 2) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (Hex.dist(x, y, hex[0], hex[1]) <= 2 && !(x === hex[0] && y === hex[1])) cells.push([x, y]);
      for (const [x, y] of cells) { const u = unitAt(b, x, y); if (u) list.push(u); }
    } else if (target !== undefined && target !== null) { const u = b.units[target]; if (u && u.alive) list = [u]; }
    return { list, mastery: m, mass };
  }
  function resists(b, side, spell, u) {
    const c = cre(u);
    const imm = C.abNum(c, 'spellImmune', 0);
    if (imm && spell.level <= imm) return 'immune';
    if (spell.school === 'fire' && C.hasAb(c, 'fireImmune')) return 'immune';
    if (spell.kind === 'debuff' && spell.effect === 'blind' && (C.hasAb(c, 'mindImmune') || C.hasAb(c, 'blindImmune') || C.isUndead(c))) return 'immune';
    if (spell.kind === 'resurrect' && spell.onlyLiving && (C.isUndead(c) || C.hasAb(c, 'nonliving'))) return 'immune';
    if (spell.kind === 'resurrect' && spell.onlyUndead && !C.isUndead(c)) return 'immune';
    if (spell.kind === 'heal' && C.isUndead(c)) return 'immune';
    if (u.side === side) return null;
    let res = C.abNum(c, 'magicResist', 0);
    for (const [nx, ny] of Hex.neighbors(u.x, u.y)) { const o = unitAt(b, nx, ny); if (o && o.side === u.side && C.hasAb(cre(o), 'resistAura')) { res += 20; break; } }
    const es = b.sides[u.side];
    if (es.hero) { res += R.skillVal(es.hero, 'resistance'); const fx = R.artifactFx(es.hero); res += fx.resist || 0; }
    if (res > 0 && b._rng.chance(Math.min(0.9, res / 100))) return 'resisted';
    return null;
  }
  function castSpell(b, side, spellId, target, hex) {
    const spell = SP.get(spellId); if (!spell) return 'Нет заклинания';
    const s = b.sides[side];
    if (!s.hero) return 'Нет героя';
    if (b.casted[side]) return 'Уже колдовали в этом раунде';
    if (!s.hero.spells.includes(spellId)) return 'Герой не знает заклинание';
    if (spell.kind === 'adventure') return 'Только на карте';
    const mastery = SP.masteryOf(s.hero, spell);
    const cost = SP.manaCost(spell, mastery);
    if (s.mana < cost) return 'Не хватает маны';
    const { list, mastery: m, mass } = spellTargets(b, side, spell, target, hex);
    if (!list.length && !spell.all) return 'Нет цели';
    if (!mass && !spell.all && !spell.area && list.length) {
      const u = list[0];
      if ((spell.kind === 'buff' || spell.kind === 'heal' || spell.kind === 'resurrect') && u.side !== side) return 'Только на своих';
      if ((spell.kind === 'damage' || spell.kind === 'debuff') && spell.target === 'enemy' && u.side === side) return 'Только на врагов';
    }
    s.mana -= cost; b.casted[side] = true; s.spellsCast++;
    if (s.hero) s.hero.mana = s.mana;
    const P = s.pow;
    const dur = Math.max(1, P + (R.artifactFx(s.hero).spellDur || 0));
    const v = spell.v[m - 1];
    const ev = { t: 'spell', spell: spellId, side, targets: [], hex: hex || null, mass };
    b.events.push(ev);
    const sorcery = R.skillVal(s.hero, 'sorcery') / 100;
    const spec = s.hero.spec && s.hero.spec.type === 'spell' && s.hero.spec.id === spellId ? 1 + 0.03 * s.hero.level : 1;
    if (spell.kind === 'damage') {
      let targets = list;
      if (spell.chain) { targets = chainTargets(b, list[0], spell.chain[m - 1]); }
      targets.forEach((u, i) => {
        const r = resists(b, side, spell, u); if (r) { ev.targets.push({ unit: u.id, result: r }); return; }
        let dmg = Math.floor((v + spell.perPower * P) * (1 + sorcery) * spec * (1 - C.abNum(cre(u), 'spellDamageReduce', 0) / 100));
        if (spell.chain) dmg = Math.floor(dmg / Math.pow(2, i));
        ev.targets.push({ unit: u.id, dmg });
        applyDamage(b, u, dmg, 'spell');
      });
    } else if (spell.kind === 'buff' || spell.kind === 'debuff') {
      for (const u of list) {
        const r = resists(b, side, spell, u); if (r) { ev.targets.push({ unit: u.id, result: r }); continue; }
        if (spell.effect === 'blind') { addEffect(b, u, 'blind', v, 99); u._wakingBlind = v / 100; }
        else addEffect(b, u, spell.effect, v, spell.stack ? 99 : dur);
        ev.targets.push({ unit: u.id, effect: spell.effect });
      }
    } else if (spell.kind === 'heal') {
      for (const u of list) { const r = resists(b, side, spell, u); if (r) { ev.targets.push({ unit: u.id, result: r }); continue; }
        for (const k of ['slow', 'curse', 'weakness', 'disease', 'poison', 'blind', 'petrify', 'paralyze', 'disrupting_ray']) delete u.effects[k];
        heal(b, u, Math.floor((v + spell.perPower * P) * spec), false, true); ev.targets.push({ unit: u.id, heal: true }); }
    } else if (spell.kind === 'resurrect') {
      const u = list[0]; const r = resists(b, side, spell, u); if (r) { ev.targets.push({ unit: u.id, result: r }); }
      else { const raised = heal(b, u, Math.floor((v + spell.perPower * P) * spec), true, m >= 2 || spellId === 'animate_dead'); ev.targets.push({ unit: u.id, raised }); }
    } else if (spell.kind === 'special') { // dispel
      for (const u of list) { u.effects = {}; ev.targets.push({ unit: u.id, effect: 'dispel' }); }
    }
    checkEnd(b);
    return true;
  }
  function chainTargets(b, first, n) {
    const out = [first]; const used = new Set([first.id]);
    let cur = first;
    while (out.length < n) {
      let best = null, bd = Infinity;
      for (const u of b.units) { if (!u.alive || used.has(u.id)) continue; const d = Hex.dist(cur.x, cur.y, u.x, u.y); if (d < bd) { bd = d; best = u; } }
      if (!best) break; out.push(best); used.add(best.id); cur = best;
    }
    return out;
  }
  /** Заклинания, доступные герою стороны сейчас: [{spell, cost, ok, reason}] */
  function availableSpells(b, side) {
    const s = b.sides[side]; if (!s.hero || !s.hero.hasBook) return [];
    return s.hero.spells.map(id => SP.get(id)).filter(sp => sp.kind !== 'adventure').map(sp => {
      const m = SP.masteryOf(s.hero, sp), cost = SP.manaCost(sp, m);
      let ok = true, reason = '';
      if (b.casted[side]) { ok = false; reason = 'Уже колдовали в этом раунде'; }
      else if (s.mana < cost) { ok = false; reason = 'Не хватает маны'; }
      return { spell: sp, cost, ok, reason, mastery: m };
    });
  }

  /* ---------- превью для UI ---------- */
  function preview(b, a, t, ranged) {
    const dist = Hex.dist(a.x, a.y, t.x, t.y);
    const wall = !!(b.siege && a.side === 0 && ranged && t.x >= WALL_COL && b.siege.walls.some(w => w > 0));
    const d = calcDamage(b, a, t, { ranged, dist, wall });
    const total = totalHp(t);
    const kill = dmg => dmg >= total ? t.count : Math.floor(Math.max(0, dmg - t.hp) / t.maxHp) + (dmg >= t.hp ? 1 : 0);
    const out = { min: d.min, max: d.max, killMin: kill(d.min), killMax: kill(d.max) };
    if (!ranged && !C.hasAb(cre(a), 'noRetaliation') && t.retal > 0) {
      // ответ после потерь: считаем по среднему числу выживших
      const survivors = Math.max(0, t.count - Math.round((out.killMin + out.killMax) / 2));
      if (survivors > 0) { const tmp = Object.assign({}, t, { count: survivors }); const r = calcDamage(b, tmp, a, { ranged: false }); out.retMin = r.min; out.retMax = r.max; out.retKillMin = Math.floor(Math.max(0, r.min - a.hp) / a.maxHp) + (r.min >= a.hp ? 1 : 0); out.retKillMax = Math.min(a.count, Math.floor(Math.max(0, r.max - a.hp) / a.maxHp) + (r.max >= a.hp ? 1 : 0)); }
    }
    return out;
  }

  H3.Battle = { W, H, WALL_COL, MOAT_COL, GATE_ROW, TOWER_ROWS, WALL_SEGMENTS, create, act, current, reachable, pathFrom, preview, calcDamage, availableSpells, spellTargets,
    unitAt, isObstacle, wallState, isMoat, effSpeed, effAtt, effDef, unitMorale, unitLuck, totalHp, canAct, isShooterNow, adjacentEnemy, enemies, allies, cre, hasEff, effVal, passable, finish };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Battle;
})(typeof window !== 'undefined' ? window : globalThis);
