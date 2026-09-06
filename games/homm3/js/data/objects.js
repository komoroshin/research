/* ============================================================================
   data/objects.js — типы объектов карты приключений (ТЗ §6.1).
   sprite — имя спрайта; value — ценность для ИИ/стражей (золото-эквивалент);
   once: 'hero' (раз на героя) | 'player' | 'week' | 'day' | 'remove' (исчезает) | null.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const RES_NAMES = { gold: 'Золото', wood: 'Дерево', ore: 'Руда', mercury: 'Ртуть', sulfur: 'Сера', crystal: 'Кристаллы', gems: 'Самоцветы' };
  const RES_NAMES_GEN = { gold: 'золота', wood: 'дерева', ore: 'руды', mercury: 'ртути', sulfur: 'серы', crystal: 'кристаллов', gems: 'самоцветов' };
  const MINE_NAMES = { gold: 'Золотая шахта', wood: 'Лесопилка', ore: 'Рудник', mercury: 'Алхимическая лаборатория', sulfur: 'Серная дюна', crystal: 'Кристальная пещера', gems: 'Пруд самоцветов' };
  const MINE_INCOME = { gold: 1000, wood: 2, ore: 2, mercury: 1, sulfur: 1, crystal: 1, gems: 1 };

  const TYPES = {
    town: { name: 'Город', sprite: null, value: 30000, footprint: [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0]], once: null },
    mine: { name: 'Шахта', sprite: null, value: 0, once: null },
    resource: { name: 'Ресурсы', sprite: null, value: 0, once: 'remove' },
    chest: { name: 'Сундук с сокровищами', sprite: 'chest', value: 1500, once: 'remove' },
    campfire: { name: 'Костёр', sprite: 'campfire', value: 800, once: 'remove' },
    artifact: { name: 'Артефакт', sprite: 'artifact', value: 0, once: 'remove' },
    dwelling: { name: 'Жилище', sprite: null, value: 3000, once: null },
    monster: { name: 'Стражи', sprite: null, value: 0, once: null },
    learning_stone: { name: 'Камень знаний', sprite: 'learning_stone', value: 1500, once: 'hero', desc: '+1000 опыта (один раз на героя).' },
    tree_knowledge: { name: 'Древо знаний', sprite: 'tree_knowledge', value: 2500, once: 'hero', desc: '+1 уровень (один раз на героя).' },
    shrine_1: { name: 'Святилище заклятий', sprite: 'shrine_1', value: 1000, once: 'hero', desc: 'Учит заклинанию 1 уровня.' },
    shrine_2: { name: 'Святилище жестов', sprite: 'shrine_2', value: 2000, once: 'hero', desc: 'Учит заклинанию 2 уровня.' },
    shrine_3: { name: 'Святилище мыслей', sprite: 'shrine_3', value: 3000, once: 'hero', desc: 'Учит заклинанию 3 уровня (нужна Мудрость).' },
    magic_well: { name: 'Колодец маны', sprite: 'magic_well', value: 500, once: 'day', desc: 'Полностью восстанавливает ману (раз в день).' },
    fountain_fortune: { name: 'Фонтан удачи', sprite: 'fountain_fortune', value: 500, once: 'week', desc: 'Удача от −1 до +3 до следующего боя.' },
    temple: { name: 'Храм', sprite: 'temple', value: 500, once: 'week', desc: '+1 мораль до следующего боя (+2 в седьмой день).' },
    rally_flag: { name: 'Знамя сбора', sprite: 'rally_flag', value: 500, once: 'week', desc: '+1 мораль, +1 удача до следующего боя.' },
    oasis: { name: 'Оазис', sprite: 'oasis', value: 600, once: 'week', desc: '+1 мораль до следующего боя, +800 очков движения.' },
    windmill: { name: 'Мельница', sprite: 'windmill', value: 700, once: 'week', desc: '3–6 редкого ресурса раз в неделю.' },
    water_wheel: { name: 'Водяная мельница', sprite: 'water_wheel', value: 700, once: 'week', desc: '500 золота раз в неделю (1000 после первой недели).' },
    witch_hut: { name: 'Хижина ведьмы', sprite: 'witch_hut', value: 1500, once: 'hero', desc: 'Обучает вторичному навыку.' },
    arena: { name: 'Арена', sprite: 'arena', value: 2000, once: 'hero', desc: '+2 к атаке или защите на выбор.' },
    mercenary_camp: { name: 'Лагерь наёмников', sprite: 'mercenary_camp', value: 1500, once: 'hero', desc: '+1 к атаке.' },
    marletto_tower: { name: 'Башня Марлетто', sprite: 'marletto_tower', value: 1500, once: 'hero', desc: '+1 к защите.' },
    star_axis: { name: 'Звёздная ось', sprite: 'star_axis', value: 1500, once: 'hero', desc: '+1 к силе магии.' },
    garden_revelation: { name: 'Сад откровения', sprite: 'garden_revelation', value: 1500, once: 'hero', desc: '+1 к знанию.' },
    observatory: { name: 'Обсерватория', sprite: 'observatory', value: 800, once: 'player', desc: 'Открывает карту в радиусе 15.' },
    trading_post: { name: 'Торговый пост', sprite: 'trading_post', value: 500, once: null, desc: 'Обмен ресурсов.' },
    hill_fort: { name: 'Холмфорт', sprite: 'hill_fort', value: 1500, once: null, desc: 'Улучшение существ 1–4 уровня (1 уровень бесплатно).' },
    tavern: { name: 'Таверна', sprite: 'tavern', value: 800, once: null, desc: 'Найм героев.' },
    bank_crypt: { name: 'Склеп', sprite: 'bank_crypt', value: 3000, once: 'remove', bank: true, desc: 'Охраняется нежитью. Награда: золото.' },
    bank_dwarven: { name: 'Сокровищница гномов', sprite: 'bank_dwarven', value: 5000, once: 'remove', bank: true, desc: 'Охраняется гномами. Награда: золото и кристаллы.' },
    bank_griffin: { name: 'Заповедник грифонов', sprite: 'bank_griffin', value: 12000, once: 'remove', bank: true, desc: 'Охраняется грифонами. Награда: ангелы.' },
    bank_utopia: { name: 'Утопия драконов', sprite: 'bank_utopia', value: 40000, once: 'remove', bank: true, desc: 'Охраняется драконами. Награда: 20 000 золота и 4 артефакта.' },
    // препятствия (непроходимы, не взаимодействуют)
    tree: { name: 'Лес', sprite: null, obstacle: true },
    mountain: { name: 'Горы', sprite: null, obstacle: true },
    rock: { name: 'Камни', sprite: null, obstacle: true },
  };
  for (const k in TYPES) TYPES[k].id = k;

  // Банки существ: гарнизон (по неделям масштабируется) и награда
  const BANKS = {
    bank_crypt: { guards: [['skeleton', 30], ['walking_dead', 20], ['wight', 10]], reward: { gold: 3000 }, scale: 1.0 },
    bank_dwarven: { guards: [['dwarf', 20], ['battle_dwarf', 12]], reward: { gold: 2500, crystal: 5 }, scale: 1.0 },
    bank_griffin: { guards: [['griffin', 30], ['royal_griffin', 10]], reward: { creature: 'angel', n: 2 }, scale: 1.0 },
    bank_utopia: { guards: [['green_dragon', 5], ['red_dragon', 4], ['gold_dragon', 3], ['black_dragon', 2]], reward: { gold: 20000, artifacts: 4 }, scale: 1.0 },
  };
  // Тиры сокровищ для генератора: [тип, вес, тир]
  const TREASURE_TABLE = [
    ['resource', 30, 1], ['chest', 14, 1], ['campfire', 8, 1], ['learning_stone', 4, 1], ['magic_well', 3, 1], ['fountain_fortune', 3, 1], ['temple', 3, 1], ['rally_flag', 3, 1],
    ['windmill', 3, 1], ['water_wheel', 3, 1], ['mercenary_camp', 2, 1], ['marletto_tower', 2, 1], ['shrine_1', 3, 1], ['dwelling', 5, 1], ['artifact', 4, 1], ['oasis', 2, 1],
    ['artifact', 6, 2], ['shrine_2', 3, 2], ['witch_hut', 3, 2], ['arena', 2, 2], ['star_axis', 2, 2], ['garden_revelation', 2, 2], ['tree_knowledge', 2, 2], ['dwelling', 5, 2], ['bank_crypt', 3, 2], ['bank_dwarven', 3, 2], ['hill_fort', 2, 2], ['trading_post', 2, 2], ['tavern', 2, 2], ['observatory', 2, 2],
    ['artifact', 6, 3], ['shrine_3', 3, 3], ['bank_griffin', 3, 3], ['bank_utopia', 2, 3], ['dwelling', 4, 3], ['tree_knowledge', 2, 3],
  ];

  H3.Objects = { TYPES, get: id => TYPES[id], BANKS, TREASURE_TABLE, RES_NAMES, RES_NAMES_GEN, MINE_NAMES, MINE_INCOME };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Objects;
})(typeof window !== 'undefined' ? window : globalThis);
