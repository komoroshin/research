/* ============================================================================
   model/battleai.js — ИИ боя (ТЗ §7.5): перебор целей по «нанесённый − ответный
   урон», приоритет стрелков, ожидание, заклинания героя. Также автобой.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Hex = U.Hex, C = H3.Creatures, Bt = H3.Battle, SP = H3.Spells, R = H3.Rules;

  const valuePerHp = u => C.aiValue(Bt.cre(u)) / Bt.cre(u).hp;
  function expected(b, a, t, ranged, dist) {
    const d = Bt.calcDamage(b, a, t, { ranged, dist });
    return (d.min + d.max) / 2;
  }
  /** Ценность урона: убитые × ценность + остаток HP × ценность/HP */
  function dmgValue(b, a, t, ranged, dist) {
    const dmg = Math.min(expected(b, a, t, ranged, dist), Bt.totalHp(t));
    let v = dmg * valuePerHp(t);
    const ct = Bt.cre(t);
    if (C.isShooter(ct) || C.hasAb(ct, 'breath') || C.hasAb(ct, 'attackAll')) v *= 1.3;
    if (dmg >= Bt.totalHp(t)) v *= 1.2; // добить — приоритет
    return v;
  }
  function retaliationValue(b, a, t) {
    if (C.hasAb(Bt.cre(a), 'noRetaliation') || t.retal <= 0 || Bt.hasEff(t, 'blind') || Bt.hasEff(t, 'petrify') || Bt.hasEff(t, 'paralyze')) return 0;
    const dmg = expected(b, a, t, false);
    const survivors = Math.max(0, t.count - Math.floor(dmg / t.maxHp));
    if (!survivors) return 0;
    const tmp = Object.assign({}, t, { count: survivors });
    const back = Math.min(expected(b, tmp, a, false), Bt.totalHp(a));
    return back * valuePerHp(a);
  }
  function threatAt(b, u, x, y) { // сколько врагов могут дотянуться до гекса
    let th = 0;
    for (const e of Bt.enemies(b, u.side)) {
      const d = Hex.dist(e.x, e.y, x, y);
      const sp = Bt.effSpeed(b, e);
      if (d <= sp + 1 || C.isShooter(Bt.cre(e))) th += C.aiValue(Bt.cre(e)) * e.count;
    }
    return th;
  }

  /** Выбирает действие для текущего юнита. smart=false — упрощённый ИИ (лёгкая сложность). */
  function choose(b, smart) {
    const u = Bt.current(b); if (!u) return null;
    smart = smart !== false;
    const c = Bt.cre(u);
    const foes = Bt.enemies(b, u.side);
    if (!foes.length) return { type: 'defend' };
    // 1. заклинание героя (раз в раунд, до действия)
    const sp = chooseSpell(b, u.side, smart);
    if (sp) return sp;
    // 2. стрельба
    if (Bt.isShooterNow(b, u)) {
      let best = null, bv = -Infinity;
      for (const t of foes) { const v = dmgValue(b, u, t, true, Hex.dist(u.x, u.y, t.x, t.y)); if (v > bv) { bv = v; best = t; } }
      return { type: 'shoot', target: best.id };
    }
    const reach = Bt.reachable(b, u);
    // 3. ближняя атака
    let best = null, bv = -Infinity;
    for (const a of reach.attacks) {
      const t = b.units[a.target];
      let v = dmgValue(b, u, t, false) - retaliationValue(b, u, t);
      if (smart) v -= threatAt(b, u, a.from[0], a.from[1]) * 0.002;
      if (C.isShooter(c)) v -= 0.5 * C.aiValue(c) * u.count * 0.05; // стрелку невыгодно лезть в ближний бой
      if (v > bv) { bv = v; best = a; }
    }
    if (best && (bv > 0 || !smart || u.waited || C.isShooter(c) === false && foes.every(f => Hex.dist(f.x, f.y, u.x, u.y) <= 2))) return { type: 'attack', target: best.target, from: best.from };
    // 4. стрелок заблокирован/без стрел — отойти от врагов
    if (C.isShooter(c) && u.shots > 0) {
      let hb = null, hd = -1;
      for (const k of reach.hexes.values()) { let md = Infinity; for (const f of foes) md = Math.min(md, Hex.dist(f.x, f.y, k.x, k.y)); if (md > hd) { hd = md; hb = k; } }
      if (hb && hd > 1 && !(hb.x === u.x && hb.y === u.y)) return { type: 'move', x: hb.x, y: hb.y };
      if (best) return { type: 'attack', target: best.target, from: best.from };
      return { type: 'defend' };
    }
    // 5. ждать, если враг может подойти сам, а мы ещё не ждали
    if (smart && !u.waited) {
      const canBeReached = foes.some(f => !C.isShooter(Bt.cre(f)) && Hex.dist(f.x, f.y, u.x, u.y) <= Bt.effSpeed(b, f) + 1);
      const enemyShooters = foes.some(f => C.isShooter(Bt.cre(f)) && f.shots > 0);
      if (canBeReached && !enemyShooters && !best) return { type: 'wait' };
    }
    if (best && bv > -Infinity && (u.waited || !smart)) return { type: 'attack', target: best.target, from: best.from };
    // 6. двигаться к ближайшей ценной цели
    let target = null, tv = -Infinity;
    for (const f of foes) { const v = C.aiValue(Bt.cre(f)) * f.count / (1 + Hex.dist(u.x, u.y, f.x, f.y)) * (C.isShooter(Bt.cre(f)) ? 1.5 : 1); if (v > tv) { tv = v; target = f; } }
    let hb = null, hd = Infinity;
    for (const k of reach.hexes.values()) {
      const d = Hex.dist(k.x, k.y, target.x, target.y);
      const th = smart ? threatAt(b, u, k.x, k.y) * 0.00001 : 0;
      if (d + th < hd) { hd = d + th; hb = k; }
    }
    if (hb && !(hb.x === u.x && hb.y === u.y)) return { type: 'move', x: hb.x, y: hb.y };
    if (best) return { type: 'attack', target: best.target, from: best.from };
    return { type: 'defend' };
  }

  function chooseSpell(b, side, smart) {
    const s = b.sides[side];
    if (!s.hero || b.casted[side] || !s.hero.hasBook) return null;
    const list = Bt.availableSpells(b, side).filter(x => x.ok);
    if (!list.length) return null;
    const foes = Bt.enemies(b, side), own = Bt.allies(b, side);
    const P = s.pow;
    let best = null, bv = 0;
    const ownPower = own.reduce((a, u) => a + C.aiValue(Bt.cre(u)) * u.count, 0);
    const threshold = Math.max(200, ownPower * 0.02);
    for (const { spell, mastery } of list) {
      const m = Math.max(1, mastery), v = spell.v[m - 1];
      let val = 0, action = null;
      if (spell.kind === 'damage') {
        const dmg = (v + spell.perPower * P) * (1 + R.skillVal(s.hero, 'sorcery') / 100);
        if (spell.all) { let tot = 0; for (const u of b.units) if (u.alive) { const eligible = spell.onlyUndead ? C.isUndead(Bt.cre(u)) : spell.onlyLiving ? !C.isUndead(Bt.cre(u)) : true; if (!eligible) continue; const d = Math.min(dmg, Bt.totalHp(u)) * valuePerHp(u); tot += u.side === side ? -d : d; } val = tot; action = { type: 'cast', spell: spell.id }; }
        else if (spell.area) {
          for (const f of foes) { let tot = 0; const cells = [[f.x, f.y]].concat(Hex.neighbors(f.x, f.y)); const set = spell.area === 'ring' ? cells.slice(1) : cells;
            for (const [x, y] of set) { const t = Bt.unitAt(b, x, y); if (!t) continue; const d = Math.min(dmg, Bt.totalHp(t)) * valuePerHp(t); tot += t.side === side ? -d : d; }
            if (tot > val) { val = tot; action = { type: 'cast', spell: spell.id, hex: [f.x, f.y] }; } }
        } else {
          for (const f of foes) { const imm = C.abNum(Bt.cre(f), 'spellImmune', 0); if (imm >= spell.level) continue; const d = Math.min(dmg, Bt.totalHp(f)) * valuePerHp(f) * (spell.chain ? 1.4 : 1); if (d > val) { val = d; action = { type: 'cast', spell: spell.id, target: f.id }; } }
        }
      } else if (spell.kind === 'debuff' && smart) {
        if (spell.effect === 'slow') { const fast = foes.filter(f => !Bt.hasEff(f, 'slow')).sort((p, q) => C.aiValue(Bt.cre(q)) * q.count - C.aiValue(Bt.cre(p)) * p.count)[0]; if (fast) { val = C.aiValue(Bt.cre(fast)) * fast.count * 0.12 * (m === 3 ? 2 : 1); action = { type: 'cast', spell: spell.id, target: fast.id }; } }
        else if (spell.effect === 'blind') { const t = foes.filter(f => !Bt.hasEff(f, 'blind') && !C.hasAb(Bt.cre(f), 'mindImmune') && !C.isUndead(Bt.cre(f))).sort((p, q) => C.aiValue(Bt.cre(q)) * q.count - C.aiValue(Bt.cre(p)) * p.count)[0]; if (t) { val = C.aiValue(Bt.cre(t)) * t.count * 0.25; action = { type: 'cast', spell: spell.id, target: t.id }; } }
        else if (['weakness', 'curse', 'disrupting_ray'].includes(spell.effect)) { const t = foes.filter(f => !Bt.hasEff(f, spell.effect)).sort((p, q) => C.aiValue(Bt.cre(q)) * q.count - C.aiValue(Bt.cre(p)) * p.count)[0]; if (t) { val = C.aiValue(Bt.cre(t)) * t.count * 0.06 * (m === 3 ? 2 : 1); action = { type: 'cast', spell: spell.id, target: t.id }; } }
      } else if (spell.kind === 'buff' && smart) {
        const strong = own.filter(u => !Bt.hasEff(u, spell.effect)).sort((p, q) => C.aiValue(Bt.cre(q)) * q.count - C.aiValue(Bt.cre(p)) * p.count)[0];
        if (strong) { const k = { haste: 0.1, bless: 0.12, shield: 0.08, stone_skin: 0.08, bloodlust: 0.08, precision: C.isShooter(Bt.cre(strong)) ? 0.1 : 0, air_shield: 0.05, prayer: 0.2, fortune: 0.04 }[spell.effect] || 0.03; val = C.aiValue(Bt.cre(strong)) * strong.count * k * (m === 3 ? 2 : 1); action = { type: 'cast', spell: spell.id, target: strong.id }; }
      } else if (spell.kind === 'resurrect' || spell.kind === 'heal') {
        for (const u of b.units) { if (u.side !== side) continue; const dead = u.initial - (u.alive ? u.count : 0); if (dead <= 0 && u.hp === u.maxHp) continue;
          const eligible = spell.kind === 'heal' ? !C.isUndead(Bt.cre(u)) : spell.onlyUndead ? C.isUndead(Bt.cre(u)) : !C.isUndead(Bt.cre(u)) && !C.hasAb(Bt.cre(u), 'nonliving'); if (!eligible) continue;
          const hp = v + spell.perPower * P; const raise = spell.kind === 'resurrect' ? Math.min(dead, Math.floor(hp / u.maxHp)) : 0; const val2 = raise * C.aiValue(Bt.cre(u)) + Math.min(hp, u.maxHp - u.hp) * valuePerHp(u) * 0.5;
          if (val2 > val && (u.alive || spell.kind === 'resurrect')) { val = val2; action = { type: 'cast', spell: spell.id, target: u.id }; } }
      }
      if (action && val > bv) { bv = val; best = action; }
    }
    if (best && bv >= threshold) return best;
    return null;
  }

  /** Автобой: обе стороны под управлением ИИ до конца. */
  function auto(b, smart) {
    let guard = 0;
    while (!b.over && guard++ < 5000) {
      const a = choose(b, smart);
      if (!a) break;
      Bt.act(b, a);
    }
    if (!b.over) Bt.finish(b, 0, 'timeout');
    return b.result;
  }

  H3.BattleAI = { choose, chooseSpell, auto, dmgValue };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.BattleAI;
})(typeof window !== 'undefined' ? window : globalThis);
