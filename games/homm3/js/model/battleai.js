/* ============================================================================
   model/battleai.js — ИИ боя.

   Два уровня:
   • simple (лёгкая сложность) — жадный выбор «урон минус ответка», без
     ожидания и позиционной оценки.
   • smart (по умолчанию) — оценка размена: считает не только свой удар и
     ответный, но и во что обойдётся стоять на выбранной клетке до своего
     следующего хода; не подставляется под залп, уводит заблокированного
     стрелка только если его не догонят, ждёт, когда выгоднее принять атаку,
     чем идти под неё.
     Против прежнего жадного ИИ: 63 % побед на армиях 2-й недели, 86 % — 4-й.

   Всё считается по тем же правилам, что и настоящий бой (Battle.calcDamage),
   поэтому оценки ИИ и подсказки игроку не расходятся.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Hex = U.Hex, C = H3.Creatures, Bt = H3.Battle, SP = H3.Spells, R = H3.Rules;

  // Веса поведения. Подобраны прогонами против жадного ИИ (dev/aitune.js):
  // осторожность при движении — главный фактор (без неё 13 % побед, при 1.5 — 86 %),
  // «держаться строя» и «прикрывать стрелков» на проверке оказались вредны и убраны.
  const T = {
    incoming: 1,        // учитывать урон, который прилетит в нас на выбранной клетке
    moveDanger: 1.5,    // осторожность при движении — не лезть под залп в одиночку
    surround: 0.012,    // бояться окружения
    wait: 1,            // пользоваться ожиданием
    shooterFlee: 1,     // уводить заблокированного стрелка, если враг не догонит
    meleePenalty: 0.15, // нежелание стрелка драться в упор
    patienceFrom: 6,    // с какого раунда осторожность начинает спадать
    patienceTo: 18,     // к какому раунду она сходит на нет
  };
  /**
   * Нетерпение: две осторожные армии могут топтаться до лимита раундов
   * (наблюдалось на паре стрелков без боезапаса). Поэтому со временем ИИ
   * перестаёт беречься и идёт в контакт.
   */
  function patience(b) {
    if (b.round <= T.patienceFrom) return 1;
    return Math.max(0, 1 - (b.round - T.patienceFrom) / (T.patienceTo - T.patienceFrom));
  }

  /* ---------- базовые оценки ---------- */
  const valuePerHp = u => C.aiValue(Bt.cre(u)) / Bt.cre(u).hp;
  const stackValue = u => C.aiValue(Bt.cre(u)) * u.count;
  /** Насколько стек опасен для нас в будущем: стрелки и «бьющие по площади» дороже. */
  function threatWeight(u) {
    const c = Bt.cre(u);
    let k = 1;
    if (C.isShooter(c) && u.shots > 0) k *= 1.45;
    if (C.hasAb(c, 'breath') || C.hasAb(c, 'attackAll') || C.hasAb(c, 'threeHeaded')) k *= 1.2;
    if (C.hasAb(c, 'noRetaliation')) k *= 1.1;
    if (C.hasAb(c, 'lifeDrain') || C.hasAb(c, 'deathStare')) k *= 1.15;
    return k;
  }
  function expected(b, a, t, ranged, dist) {
    if (!a.alive || !t.alive || a.count <= 0) return 0;
    const d = Bt.calcDamage(b, a, t, { ranged, dist });
    return (d.min + d.max) / 2;
  }
  /** Ценность урона по цели с учётом её роли и добивания. */
  function damageWorth(b, a, t, ranged, dist) {
    const dmg = Math.min(expected(b, a, t, ranged, dist), Bt.totalHp(t));
    let v = dmg * valuePerHp(t) * threatWeight(t);
    if (dmg >= Bt.totalHp(t)) v *= 1.25; // добить — снимает угрозу целиком
    return v;
  }
  /** Копия стека с другим количеством — для «а что он ответит, когда поредеет». */
  function shrunk(t, dmg) {
    const killed = Math.floor(dmg / t.maxHp);
    const left = Math.max(0, t.count - killed);
    return left === t.count ? t : Object.assign(Object.create(Object.getPrototypeOf(t)), t, { count: left, alive: left > 0 });
  }
  function canRetaliate(b, a, t) {
    return !C.hasAb(Bt.cre(a), 'noRetaliation') && t.retal > 0 && t.alive
      && !Bt.hasEff(t, 'blind') && !Bt.hasEff(t, 'petrify') && !Bt.hasEff(t, 'paralyze');
  }
  /** Во что обойдётся ответный удар цели (она уже поредела от нашего удара). */
  function retaliationCost(b, a, t) {
    if (!canRetaliate(b, a, t)) return 0;
    const myDmg = expected(b, a, t, false);
    const rest = shrunk(t, myDmg);
    if (!rest.count) return 0;
    const back = Math.min(expected(b, rest, a, false), Bt.totalHp(a));
    return back * valuePerHp(a);
  }

  /* ---------- позиционная оценка ---------- */
  /** Ходит ли враг ещё в этом раунде (тогда он ударит раньше, чем мы ответим). */
  function actsThisRound(b, e) {
    for (let i = b.pos; i < b.queue.length; i++) if (b.queue[i] === e.id) return true;
    return b.waitQueue.includes(e.id);
  }
  /**
   * Сколько мы потеряем, стоя на (x, y) до своего следующего хода:
   * суммируем ожидаемый урон врагов, которые дотуда дотянутся.
   * skipId — цель, которую мы как раз атакуем (её ответка считается отдельно).
   */
  function incomingCost(b, u, x, y, skipId, dmgToTarget) {
    let cost = 0;
    for (const e of Bt.enemies(b, u.side)) {
      if (e.id === skipId) continue;
      const c = Bt.cre(e);
      let reaches = false, ranged = false, dist = Hex.dist(e.x, e.y, x, y);
      if (C.isShooter(c) && e.shots > 0 && !Bt.adjacentEnemy(b, e)) { reaches = true; ranged = true; }
      else if (dist <= Bt.effSpeed(b, e) + 1) reaches = true;
      if (!reaches) continue;
      const dmg = Math.min(expected(b, e, u, ranged, dist), Bt.totalHp(u));
      // враг, который ещё не ходил в этом раунде, ударит гарантированнее
      cost += dmg * valuePerHp(u) * (actsThisRound(b, e) ? 0.85 : 0.55) * T.incoming;
    }
    // цель, которую мы бьём: если выживет, в следующий раз ударит уже она
    if (skipId !== undefined && skipId !== null) {
      const t = b.units[skipId];
      if (t && t.alive) {
        const rest = shrunk(t, dmgToTarget || 0);
        if (rest.count) cost += Math.min(expected(b, rest, u, false), Bt.totalHp(u)) * valuePerHp(u) * 0.5;
      }
    }
    return cost;
  }
  /** Сколько своих рядом — держим строй, не убегаем в одиночку. */
  function supportAt(b, u, x, y) {
    let s = 0;
    for (const a of Bt.allies(b, u.side)) {
      if (a.id === u.id || !a.alive) continue;
      const d = Hex.dist(a.x, a.y, x, y);
      if (d <= 1) s += 1; else if (d <= 2) s += 0.5; else if (d <= 3) s += 0.2;
    }
    return s;
  }
  /** Сколько врагов будет вокруг клетки — окружение опасно. */
  function surroundedAt(b, u, x, y) {
    let n = 0;
    for (const [nx, ny] of Hex.neighbors(x, y)) { const o = Bt.unitAt(b, nx, ny); if (o && o.alive && o.side !== u.side) n++; }
    return n;
  }

  /* ---------- выбор действия ---------- */
  function choose(b, smart) {
    const u = Bt.current(b); if (!u) return null;
    smart = smart !== false;
    const foes = Bt.enemies(b, u.side);
    if (!foes.length) return { type: 'defend' };
    const spell = chooseSpell(b, u.side, smart);
    if (spell) return spell;
    return smart ? chooseSmart(b, u, foes) : chooseGreedy(b, u, foes);
  }

  /** Лёгкая сложность: бьёт то, что выгоднее прямо сейчас, не думая о позиции. */
  function chooseGreedy(b, u, foes) {
    if (Bt.isShooterNow(b, u)) {
      let best = null, bv = -Infinity;
      for (const t of foes) { const v = damageWorth(b, u, t, true, Hex.dist(u.x, u.y, t.x, t.y)); if (v > bv) { bv = v; best = t; } }
      return { type: 'shoot', target: best.id };
    }
    const reach = Bt.reachable(b, u);
    let best = null, bv = -Infinity;
    for (const a of reach.attacks) {
      const t = b.units[a.target];
      const v = damageWorth(b, u, t, false) - retaliationCost(b, u, t);
      if (v > bv) { bv = v; best = a; }
    }
    if (best) return { type: 'attack', target: best.target, from: best.from };
    let target = null, tv = -Infinity;
    for (const f of foes) { const v = stackValue(f) / (1 + Hex.dist(u.x, u.y, f.x, f.y)); if (v > tv) { tv = v; target = f; } }
    let hb = null, hd = Infinity;
    for (const k of reach.hexes.values()) { const d = Hex.dist(k.x, k.y, target.x, target.y); if (d < hd) { hd = d; hb = k; } }
    if (hb && !(hb.x === u.x && hb.y === u.y)) return { type: 'move', x: hb.x, y: hb.y };
    return { type: 'defend' };
  }

  /** Основной ИИ: считает размен и позицию. */
  function chooseSmart(b, u, foes) {
    const c = Bt.cre(u);
    const shooterNow = Bt.isShooterNow(b, u);
    const myValue = stackValue(u);

    // 1. стрельба — почти всегда лучшее, что может делать стрелок
    if (shooterNow) {
      let best = null, bv = -Infinity;
      for (const t of foes) {
        const dist = Hex.dist(u.x, u.y, t.x, t.y);
        let v = damageWorth(b, u, t, true, dist);
        // добить того, кто вот-вот дойдёт до нас, ценнее
        if (Hex.dist(t.x, t.y, u.x, u.y) <= Bt.effSpeed(b, t) + 1) v *= 1.15;
        if (v > bv) { bv = v; best = t; }
      }
      if (best) return { type: 'shoot', target: best.id };
    }

    const reach = Bt.reachable(b, u);
    const stayCost = incomingCost(b, u, u.x, u.y, null, 0);

    // 2. лучшая атака с учётом размена
    let bestAtk = null, bestAtkVal = -Infinity;
    for (const a of reach.attacks) {
      const t = b.units[a.target];
      if (!t || !t.alive) continue;
      const gain = damageWorth(b, u, t, false);
      const myDmg = expected(b, u, t, false);
      const cost = retaliationCost(b, u, t)
        + incomingCost(b, u, a.from[0], a.from[1], t.id, myDmg)
        + surroundedAt(b, u, a.from[0], a.from[1]) * myValue * T.surround;
      let v = gain - cost;
      // стрелку лезть в ближний бой почти всегда плохо: теряет выстрелы
      if (C.isShooter(c) && u.shots > 0 && !C.hasAb(c, 'noMeleePenalty')) v -= myValue * T.meleePenalty;
      if (v > bestAtkVal) { bestAtkVal = v; bestAtk = a; }
    }

    // 3. стрелок заблокирован: отходить стоит только если враг за нами не догонит,
    //    иначе это цикл бегства — потерянный выстрел и удар в спину
    if (C.isShooter(c) && u.shots > 0 && !shooterNow && T.shooterFlee) {
      const chasers = foes.filter(f => !C.isShooter(Bt.cre(f)) || f.shots <= 0);
      let bestFree = null, bestFreeVal = -Infinity;
      for (const k of reach.hexes.values()) {
        if (k.x === u.x && k.y === u.y) continue;
        let free = true, safe = true;
        for (const [nx, ny] of Hex.neighbors(k.x, k.y)) { const o = Bt.unitAt(b, nx, ny); if (o && o.alive && o.side !== u.side) { free = false; break; } }
        if (!free) continue;
        for (const f of chasers) if (Hex.dist(f.x, f.y, k.x, k.y) <= Bt.effSpeed(b, f) + 1) { safe = false; break; }
        if (!safe) continue; // догонят — уходить бессмысленно
        const v = -incomingCost(b, u, k.x, k.y, null, 0) + supportAt(b, u, k.x, k.y) * myValue * 0.01;
        if (v > bestFreeVal) { bestFreeVal = v; bestFree = k; }
      }
      if (bestFree) return { type: 'move', x: bestFree.x, y: bestFree.y };
      if (bestAtk) return { type: 'attack', target: bestAtk.target, from: bestAtk.from };
      return { type: 'defend' };
    }

    // 4. подождать, если враг сам придёт: тогда бьём мы, а не нас
    if (T.wait && !u.waited && bestAtkVal <= myValue * 0.02) {
      const enemyShooters = foes.some(f => C.isShooter(Bt.cre(f)) && f.shots > 0);
      const someoneComes = foes.some(f => !C.isShooter(Bt.cre(f)) && Hex.dist(f.x, f.y, u.x, u.y) <= Bt.effSpeed(b, f) + 1);
      if (someoneComes && !enemyShooters) return { type: 'wait' };
    }

    // 5. атака, если она вообще выгодна
    if (bestAtk && bestAtkVal > 0) return { type: 'attack', target: bestAtk.target, from: bestAtk.from };

    // 6. движение: к цели, но в строю и не под залп
    const target = pickApproachTarget(b, u, foes);
    let bestMove = null, bestMoveVal = -Infinity;
    for (const k of reach.hexes.values()) {
      const d = Hex.dist(k.x, k.y, target.x, target.y);
      const danger = incomingCost(b, u, k.x, k.y, null, 0);
      const v = -d * myValue * 0.03
        - danger * T.moveDanger * patience(b)
        - surroundedAt(b, u, k.x, k.y) * myValue * T.surround;
      if (v > bestMoveVal) { bestMoveVal = v; bestMove = k; }
    }
    if (bestMove && !(bestMove.x === u.x && bestMove.y === u.y)) {
      if (bestAtk && bestAtkVal > bestMoveVal) return { type: 'attack', target: bestAtk.target, from: bestAtk.from };
      return { type: 'move', x: bestMove.x, y: bestMove.y };
    }
    if (bestAtk) return { type: 'attack', target: bestAtk.target, from: bestAtk.from };
    return { type: 'defend' };
  }

  /** Куда идти: вражеские стрелки в приоритете, дальше — по ценности и близости. */
  function pickApproachTarget(b, u, foes) {
    let best = foes[0], bv = -Infinity;
    for (const f of foes) {
      const d = Hex.dist(u.x, u.y, f.x, f.y);
      let v = stackValue(f) * threatWeight(f) / (1 + d * 0.6);
      if (C.isShooter(Bt.cre(f)) && f.shots > 0) v *= 1.6;
      if (v > bv) { bv = v; best = f; }
    }
    return best;
  }

  /* ---------- заклинания героя ---------- */
  function chooseSpell(b, side, smart) {
    const s = b.sides[side];
    if (!s.hero || b.casted[side] || !s.hero.hasBook) return null;
    const list = Bt.availableSpells(b, side).filter(x => x.ok);
    if (!list.length) return null;
    const foes = Bt.enemies(b, side), own = Bt.allies(b, side);
    const P = s.pow;
    let best = null, bv = 0;
    const ownPower = own.reduce((a, u) => a + stackValue(u), 0);
    const threshold = Math.max(200, ownPower * 0.02);
    for (const { spell, mastery } of list) {
      const m = Math.max(1, mastery), v = spell.v[m - 1];
      let val = 0, action = null;
      if (spell.kind === 'damage') {
        const dmg = (v + spell.perPower * P) * (1 + R.skillVal(s.hero, 'sorcery') / 100);
        if (spell.all) {
          let tot = 0;
          for (const u of b.units) {
            if (!u.alive) continue;
            const eligible = spell.onlyUndead ? C.isUndead(Bt.cre(u)) : spell.onlyLiving ? !C.isUndead(Bt.cre(u)) : true;
            if (!eligible) continue;
            const d = Math.min(dmg, Bt.totalHp(u)) * valuePerHp(u);
            tot += u.side === side ? -d : d;
          }
          val = tot; action = { type: 'cast', spell: spell.id };
        } else if (spell.area) {
          for (const f of foes) {
            let tot = 0;
            const cells = [[f.x, f.y]].concat(Hex.neighbors(f.x, f.y));
            const set = spell.area === 'ring' ? cells.slice(1) : cells;
            for (const [x, y] of set) { const t = Bt.unitAt(b, x, y); if (!t) continue; const d = Math.min(dmg, Bt.totalHp(t)) * valuePerHp(t); tot += t.side === side ? -d : d; }
            if (tot > val) { val = tot; action = { type: 'cast', spell: spell.id, hex: [f.x, f.y] }; }
          }
        } else {
          for (const f of foes) {
            const imm = C.abNum(Bt.cre(f), 'spellImmune', 0); if (imm >= spell.level) continue;
            const d = Math.min(dmg, Bt.totalHp(f)) * valuePerHp(f) * threatWeight(f) * (spell.chain ? 1.4 : 1);
            if (d > val) { val = d; action = { type: 'cast', spell: spell.id, target: f.id }; }
          }
        }
      } else if (spell.kind === 'debuff' && smart) {
        if (spell.effect === 'slow') {
          const fast = foes.filter(f => !Bt.hasEff(f, 'slow')).sort((p, q) => stackValue(q) - stackValue(p))[0];
          if (fast) { val = stackValue(fast) * 0.12 * (m === 3 ? 2 : 1); action = { type: 'cast', spell: spell.id, target: fast.id }; }
        } else if (spell.effect === 'blind') {
          const t = foes.filter(f => !Bt.hasEff(f, 'blind') && !C.hasAb(Bt.cre(f), 'mindImmune') && !C.isUndead(Bt.cre(f))).sort((p, q) => stackValue(q) * threatWeight(q) - stackValue(p) * threatWeight(p))[0];
          if (t) { val = stackValue(t) * 0.25; action = { type: 'cast', spell: spell.id, target: t.id }; }
        } else if (['weakness', 'curse', 'disrupting_ray'].includes(spell.effect)) {
          const t = foes.filter(f => !Bt.hasEff(f, spell.effect)).sort((p, q) => stackValue(q) - stackValue(p))[0];
          if (t) { val = stackValue(t) * 0.06 * (m === 3 ? 2 : 1); action = { type: 'cast', spell: spell.id, target: t.id }; }
        }
      } else if (spell.kind === 'buff' && smart) {
        const strong = own.filter(x => !Bt.hasEff(x, spell.effect)).sort((p, q) => stackValue(q) - stackValue(p))[0];
        if (strong) {
          const k = { haste: 0.1, bless: 0.12, shield: 0.08, stone_skin: 0.08, bloodlust: 0.08, precision: C.isShooter(Bt.cre(strong)) ? 0.12 : 0, air_shield: 0.05, prayer: 0.2, fortune: 0.04 }[spell.effect] || 0.03;
          val = stackValue(strong) * k * (m === 3 ? 2 : 1);
          action = { type: 'cast', spell: spell.id, target: strong.id };
        }
      } else if (spell.kind === 'resurrect' || spell.kind === 'heal') {
        for (const x of b.units) {
          if (x.side !== side) continue;
          const dead = x.initial - (x.alive ? x.count : 0);
          if (dead <= 0 && x.hp === x.maxHp) continue;
          const eligible = spell.kind === 'heal' ? !C.isUndead(Bt.cre(x)) : spell.onlyUndead ? C.isUndead(Bt.cre(x)) : !C.isUndead(Bt.cre(x)) && !C.hasAb(Bt.cre(x), 'nonliving');
          if (!eligible) continue;
          const hp = v + spell.perPower * P;
          const raise = spell.kind === 'resurrect' ? Math.min(dead, Math.floor(hp / x.maxHp)) : 0;
          const val2 = raise * C.aiValue(Bt.cre(x)) + Math.min(hp, x.maxHp - x.hp) * valuePerHp(x) * 0.5;
          if (val2 > val && (x.alive || spell.kind === 'resurrect')) { val = val2; action = { type: 'cast', spell: spell.id, target: x.id }; }
        }
      }
      if (action && val > bv) { bv = val; best = action; }
    }
    return best && bv >= threshold ? best : null;
  }

  /** Автобой: обе стороны под ИИ до конца. */
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

  H3.BattleAI = { choose, chooseSpell, auto, damageWorth, incomingCost, retaliationCost, dmgValue: damageWorth, T };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.BattleAI;
})(typeof window !== 'undefined' ? window : globalThis);
