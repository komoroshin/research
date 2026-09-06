/* ============================================================================
   data/factions.js — 8 фракций: местность, цвета, жилища 1–7 с ценами,
   классы героев, ограничения гильдии, характер. (ТЗ §5.1, исследование §4–5)
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  // d(name, gold, wood, ore, rare{})
  const d = (name, gold, wood, ore, rare) => ({ name, cost: Object.assign({ gold, wood: wood || 0, ore: ore || 0 }, rare || {}) });

  const LIST = [
    { id: 'castle', name: 'Замок', adj: 'Замка', terrain: 'grass', color: '#3b6fd4', rare: 'gems', guildMax: 4, alignment: 'good',
      desc: 'Люди. Быстрый темп, два стрелка, конница с разгоном, архангелы воскрешают. Универсальная фракция.',
      classes: ['knight', 'cleric'], siloRes: { wood: 1, ore: 1 },
      dwellings: [d('Караульня', 500, 0, 10), d('Башня лучников', 1000, 5, 5), d('Башня грифонов', 1000, 0, 5), d('Казармы', 2000, 0, 10),
        d('Монастырь', 2000, 0, 5), d('Тренировочный лагерь', 3000, 5, 5, { mercury: 2, sulfur: 2, crystal: 2, gems: 2 }), d('Портал славы', 20000, 0, 0, { mercury: 10, sulfur: 10, crystal: 10, gems: 10 })] },
    { id: 'rampart', name: 'Оплот', adj: 'Оплота', terrain: 'grass', color: '#3f9a3a', rare: 'crystal', guildMax: 4, alignment: 'good',
      desc: 'Эльфы и гномы. Оборона, сопротивление магии, отличные стрелки, дендроиды сковывают врага, золотые драконы.',
      classes: ['ranger', 'druid'], siloRes: { wood: 1, ore: 1 },
      dwellings: [d('Конюшни кентавров', 500, 5), d('Хижина гномов', 1000, 5), d('Усадьба', 1000, 5), d('Заколдованный источник', 1000, 5),
        d('Арки дендроидов', 1500, 10), d('Поляна единорогов', 2000, 0, 0, { crystal: 10 }), d('Драконьи утёсы', 4000, 5, 5, { crystal: 20, gems: 10 })] },
    { id: 'tower', name: 'Башня', adj: 'Башни', terrain: 'snow', color: '#8fb4e8', rare: 'gems', guildMax: 4, alignment: 'good',
      desc: 'Маги. Лучшая магия, много стрелков, титаны — сильнейшие стрелки игры. Медленный старт на снегу.',
      classes: ['alchemist', 'wizard'], siloRes: { gems: 1 },
      dwellings: [d('Мастерская', 300, 5, 5), d('Парапет', 1000, 0, 10), d('Фабрика големов', 1500, 0, 5), d('Башня магов', 2000, 5, 5, { mercury: 5, sulfur: 5, crystal: 5, gems: 5 }),
        d('Алтарь желаний', 2000, 5, 5, { mercury: 3, sulfur: 3, crystal: 3, gems: 3 }), d('Золотой павильон', 2500, 5, 5, { crystal: 6, gems: 6 }), d('Облачный храм', 20000, 5, 5, { gems: 30 })] },
    { id: 'inferno', name: 'Инферно', adj: 'Инферно', terrain: 'lava', color: '#c8402a', rare: 'mercury', guildMax: 4, alignment: 'evil',
      desc: 'Демоны. Быстрые существа, магоги бьют по площади, ифриты и дьяволы без ответного удара. Слабый старт, сильный финал.',
      classes: ['demoniac', 'heretic'], siloRes: { mercury: 1 },
      dwellings: [d('Тигель бесов', 300, 5, 5), d('Зал грехов', 1000, 0, 5), d('Псарня', 1500, 10), d('Врата демонов', 1500, 0, 0, { mercury: 5 }),
        d('Адская дыра', 2000, 5, 5), d('Огненное озеро', 3000, 0, 0, { mercury: 5, sulfur: 5 }), d('Покинутый дворец', 15000, 10, 10, { mercury: 20 })] },
    { id: 'necropolis', name: 'Некрополис', adj: 'Некрополиса', terrain: 'dirt', color: '#5a3a7a', rare: 'mercury', guildMax: 4, alignment: 'evil',
      desc: 'Нежить. Некромантия поднимает скелетов после каждого боя, вампиры высасывают жизнь, армия без морали.',
      classes: ['deathknight', 'necromancer'], siloRes: { mercury: 1 },
      dwellings: [d('Проклятый храм', 400, 5, 5), d('Кладбище', 1000, 0, 5), d('Гробница душ', 1500, 5, 5), d('Поместье', 1500, 5, 5),
        d('Мавзолей', 2000, 10, 0, { crystal: 10, gems: 10 }), d('Зал тьмы', 2000, 0, 5, { sulfur: 10 }), d('Драконье хранилище', 10000, 0, 0, { sulfur: 20 })] },
    { id: 'dungeon', name: 'Подземелье', adj: 'Подземелья', terrain: 'subter', color: '#8a2a2a', rare: 'sulfur', guildMax: 4, alignment: 'evil',
      desc: 'Тёмные эльфы и минотавры. Сильная магия героев, гарпии бьют и возвращаются, чёрные драконы иммунны ко всей магии.',
      classes: ['overlord', 'warlock'], siloRes: { sulfur: 1 },
      dwellings: [d('Логово', 400, 10), d('Гнездо гарпий', 1000), d('Столп глаз', 1000, 1, 1, { mercury: 1, sulfur: 1, crystal: 1, gems: 1 }), d('Часовня безмолвных голосов', 2000, 5, 10),
        d('Лабиринт', 4000, 0, 10, { gems: 10 }), d('Логово мантикор', 5000, 5, 5, { mercury: 5, sulfur: 5 }), d('Драконья пещера', 15000, 15, 15, { sulfur: 20 })] },
    { id: 'stronghold', name: 'Цитадель', adj: 'Цитадели', terrain: 'rough', color: '#c88a2a', rare: 'crystal', guildMax: 3, alignment: 'neutral',
      desc: 'Орки и огры. Чистая сила и дешёвая армия, гильдия только до 3 уровня, циклопы ломают стены, чудища игнорируют защиту.',
      classes: ['barbarian', 'battlemage'], siloRes: { wood: 1, ore: 1 },
      dwellings: [d('Казармы гоблинов', 200, 5, 5), d('Волчье логово', 1000, 10, 5), d('Башня орков', 1000, 5, 5), d('Форт огров', 1000, 5, 5),
        d('Гнездо на утёсе', 1500, 2, 2), d('Пещера циклопов', 2000, 5, 5), d('Логово чудищ', 10000, 10, 10, { crystal: 10 })] },
    { id: 'fortress', name: 'Крепость', adj: 'Крепости', terrain: 'swamp', color: '#4a8a5a', rare: 'sulfur', guildMax: 3, alignment: 'neutral',
      desc: 'Ящеры и болотные твари. Защита, стрекозы снимают чары, горгоны убивают взглядом, гидры бьют всех вокруг.',
      classes: ['beastmaster', 'witch'], siloRes: { wood: 1, ore: 1 },
      dwellings: [d('Хижина гноллов', 300, 5), d('Логово ящеров', 1000, 0, 5), d('Улей змиев', 1500, 5, 5), d('Яма василисков', 1500, 5, 5, { sulfur: 5 }),
        d('Логово горгон', 2000, 5, 5), d('Гнездо виверн', 3000, 10, 10), d('Пруд гидр', 10000, 10, 10, { sulfur: 20 })] },
  ];
  const BY_ID = Object.create(null);
  LIST.forEach(f => { BY_ID[f.id] = f; });

  /** Стоимость улучшения жилища (ТЗ §5.1). */
  function upgradeCost(faction, tier) {
    if (tier === 7) {
      if (faction.id === 'necropolis') return { gold: 15000, mercury: 20 };
      if (faction.id === 'stronghold') return { gold: 15000, crystal: 10 };
      if (faction.id === 'fortress') return { gold: 15000, sulfur: 20 };
      return { gold: 20000, mercury: 10, sulfur: 10, crystal: 10, gems: 10 };
    }
    const base = faction.dwellings[tier - 1].cost;
    const gold = Math.max(1000, Math.round(base.gold / 500) * 500);
    const out = { gold };
    if (base.wood) out.wood = base.wood; if (base.ore) out.ore = base.ore;
    return out;
  }

  /** Существа фракции по тиру: [base, upg] */
  function creaturesOf(fid, tier) {
    return H3.Creatures.LIST.filter(c => c.faction === fid && c.tier === tier);
  }

  const NEUTRAL_COLOR = '#8a8a8a';
  const PLAYER_COLORS = ['#d23b2a', '#2f63d8', '#3a9a3a', '#e08a20'];
  const PLAYER_NAMES = ['Красный', 'Синий', 'Зелёный', 'Оранжевый'];

  H3.Factions = { LIST, BY_ID, get: id => BY_ID[id], upgradeCost, creaturesOf, NEUTRAL_COLOR, PLAYER_COLORS, PLAYER_NAMES };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Factions;
})(typeof window !== 'undefined' ? window : globalThis);
