/* ============================================================================
   model/quest.js — квесты и ключи: хижина провидца, страж-квестор, шатёр
   ключника и пограничная застава, Ящик Пандоры.

   Квест: { kind: 'artifact', art } | { kind: 'creatures', cid, n }
        | { kind: 'level', level } | { kind: 'resources', res, amount }
        | { kind: 'primary', stat, value }
   Награда: { kind: 'gold'|'res'|'xp'|'artifact'|'creatures'|'primary'|'spell', ... }
   Ключи лежат у игрока: player.keys = { red: true, ... }.
   Никакого DOM: файл грузится и в node.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, R = H3.Rules, C = H3.Creatures, AR = H3.Artifacts, O = H3.Objects;

  const KEY_COLORS = {
    red: { name: 'Красный', gen: 'красного', hex: '#d23b2a' },
    blue: { name: 'Синий', gen: 'синего', hex: '#2f63d8' },
    green: { name: 'Зелёный', gen: 'зелёного', hex: '#3a9a3a' },
    orange: { name: 'Оранжевый', gen: 'оранжевого', hex: '#e08a20' },
    purple: { name: 'Лиловый', gen: 'лилового', hex: '#9a58c8' },
  };
  const COLOR_IDS = Object.keys(KEY_COLORS);
  const STAT_NAMES = { att: 'атаке', def: 'защите', pow: 'силе магии', kno: 'знанию' };
  const keysOf = p => p.keys || (p.keys = {});

  /* ---------- условие ---------- */
  function heroHasArt(hero, art) { return Object.keys(hero.arts).some(k => hero.arts[k] === art) || hero.backpack.includes(art); }
  function countOf(army, cid) { return army.reduce((a, s) => a + (s && s.cid === cid ? s.n : 0), 0); }
  /** Выполнено ли условие героем (для ресурсов — его игроком). */
  function met(state, hero, q) {
    if (!q) return true;
    const p = state.players[hero.owner];
    switch (q.kind) {
      case 'artifact': return heroHasArt(hero, q.art);
      case 'creatures': return countOf(hero.army, q.cid) >= q.n;
      case 'level': return hero.level >= q.level;
      case 'resources': return (p.res[q.res] || 0) >= q.amount;
      case 'primary': return R.heroPrimary(hero)[q.stat] >= q.value;
      default: return false;
    }
  }
  /** Забрать то, что требует условие (уровень и характеристики не отбираются). */
  function take(state, hero, q) {
    const p = state.players[hero.owner];
    if (q.kind === 'artifact') {
      for (const k in hero.arts) if (hero.arts[k] === q.art) { delete hero.arts[k]; return; }
      const i = hero.backpack.indexOf(q.art); if (i >= 0) hero.backpack.splice(i, 1);
    } else if (q.kind === 'creatures') {
      let left = q.n;
      for (let i = 0; i < 7 && left > 0; i++) { const s = hero.army[i]; if (!s || s.cid !== q.cid) continue; const k = Math.min(left, s.n); s.n -= k; left -= k; if (s.n <= 0) hero.army[i] = null; }
    } else if (q.kind === 'resources') p.res[q.res] -= q.amount;
  }
  function text(q) {
    if (!q) return '';
    switch (q.kind) {
      case 'artifact': return 'принести артефакт «' + ((AR.get(q.art) || {}).name || q.art) + '»';
      case 'creatures': return 'привести ' + q.n + ' × ' + ((C.get(q.cid) || {}).name || q.cid);
      case 'level': return 'достичь ' + q.level + ' уровня';
      case 'resources': return 'принести ' + U.fmt(q.amount) + ' ' + (O.RES_NAMES_GEN[q.res] || q.res);
      case 'primary': return 'иметь ' + q.value + ' по ' + STAT_NAMES[q.stat];
      default: return q.kind;
    }
  }
  /** Что забирают при выполнении — чтобы игрок знал заранее. */
  function costText(q) {
    if (!q) return '';
    if (q.kind === 'artifact') return 'артефакт заберут';
    if (q.kind === 'creatures') return 'существа останутся здесь';
    if (q.kind === 'resources') return 'ресурсы заберут';
    return '';
  }

  /* ---------- награда ---------- */
  function rewardText(r) {
    if (!r) return '';
    switch (r.kind) {
      case 'gold': return U.fmt(r.amount) + ' золота';
      case 'res': return r.amount + ' ' + (O.RES_NAMES_GEN[r.res] || r.res);
      case 'xp': return U.fmt(r.amount) + ' опыта';
      case 'artifact': return 'артефакт «' + ((AR.get(r.art) || {}).name || r.art) + '»';
      case 'creatures': return r.n + ' × ' + ((C.get(r.cid) || {}).name || r.cid);
      case 'primary': return '+' + r.value + ' к ' + STAT_NAMES[r.stat];
      case 'spell': return 'заклинание «' + ((H3.Spells.get(r.spell) || {}).name || r.spell) + '»';
      default: return r.kind;
    }
  }
  /** Выдать награду герою; возвращает { text, levelUps }. */
  function give(state, hero, r) {
    const p = state.players[hero.owner];
    const out = { text: rewardText(r), levelUps: 0 };
    switch (r.kind) {
      case 'gold': p.res.gold += r.amount; break;
      case 'res': p.res[r.res] = (p.res[r.res] || 0) + r.amount; break;
      case 'xp': out.levelUps = R.gainXp(hero, r.amount); break;
      case 'artifact': H3.Adventure.giveArtifact(hero, r.art); break;
      case 'creatures': { const left = R.addToArmy(hero.army, r.cid, r.n); if (left) out.text += ' (в армии нет места: ' + left + ' не поместились)'; break; }
      case 'primary': hero.pri[r.stat] += r.value; if (r.stat === 'kno') hero.mana = Math.min(R.heroMaxMana(hero), hero.mana + 10 * r.value); break;
      case 'spell': if (!hero.spells.includes(r.spell)) hero.spells.push(r.spell); break;
    }
    return out;
  }
  /** Ценность награды для ИИ (золотой эквивалент). */
  function rewardValue(r) {
    if (!r) return 0;
    switch (r.kind) {
      case 'gold': return r.amount;
      case 'res': return r.amount * (r.res === 'wood' || r.res === 'ore' ? 150 : 400);
      case 'xp': return r.amount * 1.5;
      case 'artifact': return AR.CLASS_VALUE[(AR.get(r.art) || {}).cls] || 2000;
      case 'creatures': return C.aiValue(C.get(r.cid)) * r.n;
      case 'primary': return 2500 * r.value;
      case 'spell': return 2500;
      default: return 1000;
    }
  }

  /* ---------- генерация ----------
     tier 1 — стартовая зона, 2 — промежуточная, 3 — сокровищница.
     ctx: { arts: [artId...] — артефакты, которые уже лежат на карте;
            cids: [cid...] — существа, которых на карте можно нанять } */
  function randomQuest(rng, tier, ctx) {
    ctx = ctx || {};
    const kinds = ['level', 'resources'];
    if (ctx.arts && ctx.arts.length) kinds.push('artifact', 'artifact');
    if (ctx.cids && ctx.cids.length) kinds.push('creatures');
    if (tier >= 2) kinds.push('primary');
    const kind = rng.pick(kinds);
    if (kind === 'level') return { kind, level: tier === 1 ? rng.int(3, 5) : tier === 2 ? rng.int(6, 9) : rng.int(10, 14) };
    if (kind === 'resources') {
      const res = tier === 1 ? rng.pick(['wood', 'ore', 'gold']) : rng.pick(U.RES);
      const amount = res === 'gold' ? rng.int(2, 4) * 1000 * tier : (res === 'wood' || res === 'ore' ? rng.int(8, 14) * tier : rng.int(4, 8) * tier);
      return { kind, res, amount };
    }
    if (kind === 'artifact') return { kind, art: rng.pick(ctx.arts) };
    if (kind === 'creatures') { const cid = rng.pick(ctx.cids); const c = C.get(cid); return { kind, cid, n: Math.max(2, Math.round(3000 * tier / C.aiValue(c))) }; }
    return { kind: 'primary', stat: rng.pick(['att', 'def', 'pow', 'kno']), value: tier === 2 ? rng.int(5, 8) : rng.int(9, 13) };
  }
  function randomReward(rng, tier, ctx) {
    ctx = ctx || {};
    const k = rng.pick(['gold', 'gold', 'xp', 'artifact', 'creatures', 'primary', 'res']);
    if (k === 'gold') return { kind: 'gold', amount: rng.int(2, 4) * 1000 * tier };
    if (k === 'xp') return { kind: 'xp', amount: rng.int(1, 3) * 1000 * tier };
    if (k === 'res') { const res = rng.pick(U.RARE); return { kind: 'res', res, amount: rng.int(6, 12) * tier }; }
    if (k === 'artifact') { const cls = tier === 1 ? 'treasure' : tier === 2 ? rng.pick(['minor', 'major']) : rng.pick(['major', 'relic']); return { kind: 'artifact', art: rng.pick(AR.byClass(cls)).id }; }
    if (k === 'creatures') { const t = Math.min(7, tier * 2 + rng.int(0, 1)); const c = rng.pick(C.LIST.filter(x => x.tier === t && !x.machine)); return { kind: 'creatures', cid: c.id, n: Math.max(1, Math.round(2500 * tier / C.aiValue(c))) }; }
    return { kind: 'primary', stat: rng.pick(['att', 'def', 'pow', 'kno']), value: tier >= 3 ? 2 : 1 };
  }
  /** Ящик Пандоры: стражи внутри и награда — по тиру. */
  function randomPandora(rng, tier, guardMul) {
    const value = rng.int(4000, 8000) * tier * (guardMul || 1);
    const pool = C.LIST.filter(c => !c.machine && value / C.aiValue(c) >= 4 && value / C.aiValue(c) <= 60);
    const c = pool.length ? rng.pick(pool) : C.get('pikeman');
    const n = Math.max(1, Math.round(value / C.aiValue(c)));
    const rewards = [randomReward(rng, tier)];
    if (rng.chance(0.4)) rewards.push(randomReward(rng, tier));
    return { guards: [{ cid: c.id, n }], rewards };
  }

  /* ---------- описание объектов для интерфейса ---------- */
  function describe(obj) {
    if (obj.type === 'seer_hut') return 'Задание: ' + text(obj.quest) + '. Награда: ' + rewardText(obj.reward) + '.';
    if (obj.type === 'quest_guard') return 'Пропустит, если ' + text(obj.quest) + '.';
    if (obj.type === 'keymaster') return 'Даёт ' + (KEY_COLORS[obj.color] || {}).name.toLowerCase() + ' ключ — им открывают заставу того же цвета.';
    if (obj.type === 'border_guard') return 'Пропускает только с ' + ((KEY_COLORS[obj.color] || {}).name || '').toLowerCase() + ' ключом.';
    if (obj.type === 'pandora_box') return 'Внутри награда и стражи: ' + (obj.guards || []).map(g => C.get(g.cid).name + ' ×' + g.n).join(', ') + '.';
    return '';
  }

  H3.Quest = { KEY_COLORS, COLOR_IDS, keysOf, met, take, text, costText, rewardText, give, rewardValue, randomQuest, randomReward, randomPandora, describe };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Quest;
})(typeof window !== 'undefined' ? window : globalThis);
