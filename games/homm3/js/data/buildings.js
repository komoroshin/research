/* ============================================================================
   data/buildings.js — общие постройки города (ТЗ §5.1) + сборка полного
   списка построек для фракции (включая жилища и их улучшения).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const rare4 = n => ({ mercury: n, sulfur: n, crystal: n, gems: n });

  const COMMON = [
    { id: 'hall_1', name: 'Сельская ратуша', cost: {}, req: [], income: 500, desc: 'Доход 500 золота в день. Есть с самого начала.', kind: 'hall' },
    { id: 'hall_2', name: 'Ратуша', cost: { gold: 2500 }, req: ['tavern'], income: 1000, desc: 'Доход 1000 золота в день.', kind: 'hall' },
    { id: 'hall_3', name: 'Городская ратуша', cost: { gold: 5000 }, req: ['hall_2', 'blacksmith', 'guild_1', 'market'], income: 2000, desc: 'Доход 2000 золота в день.', kind: 'hall' },
    { id: 'hall_4', name: 'Капитолий', cost: { gold: 10000 }, req: ['hall_3', 'castle'], income: 4000, desc: 'Доход 4000 золота в день. Только один на игрока.', kind: 'hall' },
    { id: 'fort', name: 'Форт', cost: { gold: 5000, wood: 20, ore: 20 }, req: [], desc: 'Стены при осаде. Нужен для жилищ 2–7 уровня.', kind: 'fort' },
    { id: 'citadel', name: 'Цитадель', cost: { gold: 2500, ore: 5 }, req: ['fort'], desc: 'Прирост существ +50 %. Ров и центральная башня при осаде.', kind: 'fort' },
    { id: 'castle', name: 'Замок', cost: { gold: 5000, wood: 10, ore: 10 }, req: ['citadel'], desc: 'Прирост существ +100 % (вместо +50 %). Две боковые башни. Нужен для жилища 7 уровня.', kind: 'fort' },
    { id: 'tavern', name: 'Таверна', cost: { gold: 500, wood: 5 }, req: [], desc: 'Найм героев. +1 мораль защитникам при осаде.', kind: 'misc' },
    { id: 'market', name: 'Рынок', cost: { gold: 500, wood: 5 }, req: [], desc: 'Обмен ресурсов. Чем больше рынков, тем лучше курс.', kind: 'misc' },
    { id: 'silo', name: 'Хранилище ресурсов', cost: { gold: 5000, ore: 5 }, req: ['market'], desc: 'Дополнительный ресурс каждый день.', kind: 'misc' },
    { id: 'blacksmith', name: 'Кузница', cost: { gold: 1000, wood: 5 }, req: [], desc: 'Нужна для Городской ратуши.', kind: 'misc' },
    { id: 'guild_1', name: 'Гильдия магов I', cost: { gold: 2000, wood: 5, ore: 5 }, req: [], desc: '5 заклинаний 1 уровня. Герои в городе полностью восстанавливают ману.', kind: 'guild', level: 1 },
    { id: 'guild_2', name: 'Гильдия магов II', cost: Object.assign({ gold: 1000, wood: 5, ore: 5 }, rare4(4)), req: ['guild_1'], desc: '+4 заклинания 2 уровня.', kind: 'guild', level: 2 },
    { id: 'guild_3', name: 'Гильдия магов III', cost: Object.assign({ gold: 1000, wood: 5, ore: 5 }, rare4(6)), req: ['guild_2'], desc: '+3 заклинания 3 уровня.', kind: 'guild', level: 3 },
    { id: 'guild_4', name: 'Гильдия магов IV', cost: Object.assign({ gold: 1000, wood: 5, ore: 5 }, rare4(8)), req: ['guild_3'], desc: '+2 заклинания 4 уровня.', kind: 'guild', level: 4 },
  ];
  const GUILD_SPELLS = { 1: 5, 2: 4, 3: 3, 4: 2 };

  /** Полный список построек фракции (общие + жилища + улучшения). */
  const cache = {};
  function forFaction(fid) {
    if (cache[fid]) return cache[fid];
    const f = H3.Factions.get(fid);
    const list = COMMON.filter(b => !(b.kind === 'guild' && b.level > f.guildMax)).map(b => Object.assign({}, b));
    for (let t = 1; t <= 7; t++) {
      const dw = f.dwellings[t - 1];
      const [base, upg] = H3.Factions.creaturesOf(fid, t);
      const req = [];
      if (t >= 2) req.push('dwell_' + (t - 1), 'fort');
      if (t === 5 && ['tower', 'inferno', 'necropolis', 'dungeon'].includes(fid)) req.push('guild_1');
      if (t === 7) req.push('castle');
      list.push({ id: 'dwell_' + t, name: dw.name, cost: dw.cost, req, kind: 'dwell', tier: t, creature: base.id,
        desc: 'Жилище: ' + base.name + ' (' + base.growth + ' в неделю).' });
      const ureq = ['dwell_' + t];
      if (t >= 5) ureq.push('citadel');
      list.push({ id: 'dwell_up_' + t, name: 'Улучш. ' + dw.name, cost: H3.Factions.upgradeCost(f, t), req: ureq, kind: 'dwell_up', tier: t, creature: upg.id,
        desc: 'Улучшенное жилище: ' + upg.name + '. Позволяет нанимать и улучшать.' });
    }
    cache[fid] = list;
    return list;
  }
  const BY_ID = Object.create(null);
  COMMON.forEach(b => { BY_ID[b.id] = b; });
  function get(fid, id) { return forFaction(fid).find(b => b.id === id); }

  /** Порядок постройки для ИИ (ТЗ §8.1). */
  const AI_ORDER = ['tavern', 'hall_2', 'dwell_2', 'dwell_3', 'guild_1', 'market', 'blacksmith', 'hall_3', 'fort', 'citadel', 'dwell_4', 'dwell_5', 'castle', 'dwell_6', 'hall_4', 'dwell_7',
    'dwell_up_1', 'dwell_up_2', 'dwell_up_3', 'dwell_up_4', 'dwell_up_5', 'dwell_up_6', 'dwell_up_7', 'guild_2', 'guild_3', 'guild_4', 'silo'];

  H3.Buildings = { COMMON, BY_ID, forFaction, get, GUILD_SPELLS, AI_ORDER };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Buildings;
})(typeof window !== 'undefined' ? window : globalThis);
