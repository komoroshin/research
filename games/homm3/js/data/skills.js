/* ============================================================================
   data/skills.js — 21 вторичный навык (ТЗ §5.4), три уровня.
   value[lvl-1] — численный эффект; w — веса выпадения для классов силы/магии.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const LEVELS = ['Базовый', 'Продвинутый', 'Экспертный'];

  const LIST = [
    { id: 'logistics', name: 'Логистика', value: [10, 20, 30], fmt: '+{v} % очков движения', w: { might: 5, magic: 3 } },
    { id: 'pathfinding', name: 'Поиск пути', value: [25, 50, 75], fmt: 'Штраф местности −{v} очков за тайл', w: { might: 4, magic: 2 } },
    { id: 'scouting', name: 'Разведка', value: [1, 2, 3], fmt: 'Радиус обзора +{v}; видно точное число стражей', w: { might: 3, magic: 2 } },
    { id: 'archery', name: 'Стрельба', value: [10, 25, 50], fmt: 'Урон стрелков +{v} %', w: { might: 5, magic: 2 } },
    { id: 'offense', name: 'Нападение', value: [10, 20, 30], fmt: 'Урон в ближнем бою +{v} %', w: { might: 6, magic: 2 } },
    { id: 'armorer', name: 'Доспехи', value: [5, 10, 15], fmt: 'Получаемый урон −{v} %', w: { might: 6, magic: 2 } },
    { id: 'wisdom', name: 'Мудрость', value: [3, 4, 5], fmt: 'Можно учить заклинания до {v} уровня', w: { might: 2, magic: 7 } },
    { id: 'air', name: 'Магия воздуха', value: [1, 2, 3], fmt: 'Заклинания воздуха на уровне «{lvl}», мана дешевле', w: { might: 2, magic: 5 } },
    { id: 'earth', name: 'Магия земли', value: [1, 2, 3], fmt: 'Заклинания земли на уровне «{lvl}», мана дешевле', w: { might: 2, magic: 5 } },
    { id: 'fire', name: 'Магия огня', value: [1, 2, 3], fmt: 'Заклинания огня на уровне «{lvl}», мана дешевле', w: { might: 2, magic: 4 } },
    { id: 'water', name: 'Магия воды', value: [1, 2, 3], fmt: 'Заклинания воды на уровне «{lvl}», мана дешевле', w: { might: 2, magic: 4 } },
    { id: 'intelligence', name: 'Интеллект', value: [25, 50, 100], fmt: 'Максимум маны +{v} %', w: { might: 1, magic: 5 } },
    { id: 'mysticism', name: 'Мистицизм', value: [2, 3, 4], fmt: 'Восстановление маны +{v} в день', w: { might: 1, magic: 4 } },
    { id: 'sorcery', name: 'Волшебство', value: [5, 10, 15], fmt: 'Урон заклинаний +{v} %', w: { might: 1, magic: 5 } },
    { id: 'resistance', name: 'Сопротивление', value: [5, 10, 20], fmt: 'Шанс отразить вражеское заклинание {v} %', w: { might: 3, magic: 3 } },
    { id: 'leadership', name: 'Лидерство', value: [1, 2, 3], fmt: 'Мораль +{v}', w: { might: 5, magic: 2 } },
    { id: 'luck', name: 'Удача', value: [1, 2, 3], fmt: 'Удача +{v}', w: { might: 4, magic: 3 } },
    { id: 'necromancy', name: 'Некромантия', value: [10, 20, 30], fmt: '{v} % убитых врагов поднимаются скелетами', w: { might: 0, magic: 0 } },
    { id: 'estates', name: 'Поместья', value: [125, 250, 500], fmt: '+{v} золота в день', w: { might: 3, magic: 3 } },
    { id: 'diplomacy', name: 'Дипломатия', value: [1, 2, 3], fmt: 'Нейтралы охотнее присоединяются (+{v}); сдача дешевле на {d} %', w: { might: 3, magic: 3 } },
    { id: 'learning', name: 'Обучение', value: [5, 10, 15], fmt: 'Опыт +{v} %', w: { might: 2, magic: 3 } },
  ];
  const BY_ID = Object.create(null);
  LIST.forEach(s => { BY_ID[s.id] = s; });

  function describe(id, lvl) {
    const s = BY_ID[id]; if (!s) return '';
    return s.fmt.replace('{v}', s.value[lvl - 1]).replace('{lvl}', LEVELS[lvl - 1]).replace('{d}', 20 * lvl);
  }
  function levelName(lvl) { return LEVELS[lvl - 1] || ''; }

  H3.Skills = { LIST, BY_ID, get: id => BY_ID[id], describe, levelName, LEVELS, MAX_SKILLS: 8 };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Skills;
})(typeof window !== 'undefined' ? window : globalThis);
