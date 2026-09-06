/* ============================================================================
   data/spells.js — 29 заклинаний (ТЗ §5.5).
   school: air|earth|fire|water|all; level 1–4; mana — базовая цена;
   kind: damage|buff|debuff|heal|resurrect|adventure|special
   target: enemy|ally|any|allEnemies|allAllies|none
   v: [basic, advanced, expert] — базовое значение; perPower — множитель силы магии.
   mass: true — на экспертном уровне действует на всех (buff → своих, debuff → врагов).
   area: 0 — одна цель, 1 — цель + 6 соседей, 2 — радиус 2, 'ring' — только соседи.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  const LIST = [
    // ---- уровень 1
    { id: 'magic_arrow', name: 'Магическая стрела', school: 'all', level: 1, mana: 5, kind: 'damage', target: 'enemy', v: [10, 20, 30], perPower: 10, desc: 'Урон {v} + 10×Сила одной цели.' },
    { id: 'haste', name: 'Ускорение', school: 'air', level: 1, mana: 6, kind: 'buff', target: 'ally', v: [3, 5, 5], mass: true, effect: 'haste', desc: 'Скорость +{v}. Эксперт: всем своим.' },
    { id: 'slow', name: 'Замедление', school: 'earth', level: 1, mana: 6, kind: 'debuff', target: 'enemy', v: [25, 50, 50], mass: true, effect: 'slow', desc: 'Скорость −{v} %. Эксперт: всем врагам.' },
    { id: 'bless', name: 'Благословение', school: 'water', level: 1, mana: 5, kind: 'buff', target: 'ally', v: [0, 1, 1], mass: true, effect: 'bless', desc: 'Всегда максимальный урон (+{v}). Эксперт: всем своим.' },
    { id: 'curse', name: 'Проклятие', school: 'fire', level: 1, mana: 6, kind: 'debuff', target: 'enemy', v: [0, 1, 1], mass: true, effect: 'curse', desc: 'Всегда минимальный урон (−{v}). Эксперт: всем врагам.' },
    { id: 'shield', name: 'Щит', school: 'earth', level: 1, mana: 5, kind: 'buff', target: 'ally', v: [15, 30, 30], mass: true, effect: 'shield', desc: 'Урон в ближнем бою −{v} %. Эксперт: всем своим.' },
    { id: 'stone_skin', name: 'Каменная кожа', school: 'earth', level: 1, mana: 5, kind: 'buff', target: 'ally', v: [3, 6, 6], mass: true, effect: 'stone_skin', desc: 'Защита +{v}. Эксперт: всем своим.' },
    { id: 'bloodlust', name: 'Жажда крови', school: 'fire', level: 1, mana: 5, kind: 'buff', target: 'ally', v: [3, 6, 6], mass: true, effect: 'bloodlust', desc: 'Атака в ближнем бою +{v}. Эксперт: всем своим.' },
    { id: 'cure', name: 'Лечение', school: 'water', level: 1, mana: 6, kind: 'heal', target: 'ally', v: [10, 20, 30], perPower: 5, mass: true, desc: 'Снимает вредные эффекты и лечит {v} + 5×Сила HP. Эксперт: всем своим.' },
    { id: 'dispel', name: 'Снятие чар', school: 'water', level: 1, mana: 5, kind: 'special', target: 'any', v: [0, 0, 0], mass: true, desc: 'Снимает все эффекты с цели. Эксперт: со всех.' },
    // ---- уровень 2
    { id: 'lightning_bolt', name: 'Молния', school: 'air', level: 2, mana: 10, kind: 'damage', target: 'enemy', v: [10, 20, 50], perPower: 25, desc: 'Урон {v} + 25×Сила одной цели.' },
    { id: 'ice_bolt', name: 'Ледяная стрела', school: 'water', level: 2, mana: 8, kind: 'damage', target: 'enemy', v: [10, 20, 50], perPower: 20, desc: 'Урон {v} + 20×Сила одной цели.' },
    { id: 'death_ripple', name: 'Волна смерти', school: 'earth', level: 2, mana: 10, kind: 'damage', target: 'none', v: [10, 20, 30], perPower: 5, onlyLiving: true, all: true, desc: 'Урон {v} + 5×Сила всем живым существам на поле (и своим).' },
    { id: 'blind', name: 'Ослепление', school: 'fire', level: 2, mana: 10, kind: 'debuff', target: 'enemy', v: [50, 25, 0], effect: 'blind', desc: 'Цель не действует, пока её не ударят; ответный удар при пробуждении {v} %.' },
    { id: 'precision', name: 'Точность', school: 'air', level: 2, mana: 8, kind: 'buff', target: 'ally', v: [3, 6, 6], mass: true, effect: 'precision', desc: 'Атака стрелков +{v}. Эксперт: всем своим.' },
    { id: 'weakness', name: 'Слабость', school: 'water', level: 2, mana: 8, kind: 'debuff', target: 'enemy', v: [3, 6, 6], mass: true, effect: 'weakness', desc: 'Атака −{v}. Эксперт: всем врагам.' },
    { id: 'disrupting_ray', name: 'Разрушающий луч', school: 'air', level: 2, mana: 10, kind: 'debuff', target: 'enemy', v: [3, 4, 5], effect: 'disrupting_ray', stack: true, desc: 'Защита −{v} до конца боя, складывается.' },
    { id: 'fortune', name: 'Фортуна', school: 'air', level: 2, mana: 7, kind: 'buff', target: 'ally', v: [1, 2, 2], mass: true, effect: 'fortune', desc: 'Удача +{v}. Эксперт: всем своим.' },
    // ---- уровень 3
    { id: 'fireball', name: 'Огненный шар', school: 'fire', level: 3, mana: 15, kind: 'damage', target: 'any', v: [15, 30, 60], perPower: 10, area: 1, desc: 'Урон {v} + 10×Сила цели и 6 соседним гексам.' },
    { id: 'frost_ring', name: 'Кольцо холода', school: 'water', level: 3, mana: 12, kind: 'damage', target: 'any', v: [15, 30, 60], perPower: 10, area: 'ring', desc: 'Урон {v} + 10×Сила по 6 гексам вокруг цели (не по ней).' },
    { id: 'destroy_undead', name: 'Уничтожить нежить', school: 'air', level: 3, mana: 15, kind: 'damage', target: 'none', v: [10, 20, 50], perPower: 10, onlyUndead: true, all: true, desc: 'Урон {v} + 10×Сила всей нежити на поле.' },
    { id: 'animate_dead', name: 'Поднять мёртвых', school: 'earth', level: 3, mana: 15, kind: 'resurrect', target: 'ally', v: [30, 60, 160], perPower: 50, onlyUndead: true, desc: 'Воскрешает нежить на {v} + 50×Сила HP навсегда.' },
    { id: 'air_shield', name: 'Воздушный щит', school: 'air', level: 3, mana: 12, kind: 'buff', target: 'ally', v: [25, 50, 50], mass: true, effect: 'air_shield', desc: 'Урон от выстрелов −{v} %. Эксперт: всем своим.' },
    // ---- уровень 4
    { id: 'meteor_shower', name: 'Метеоритный дождь', school: 'earth', level: 4, mana: 16, kind: 'damage', target: 'any', v: [25, 50, 100], perPower: 25, area: 1, desc: 'Урон {v} + 25×Сила цели и 6 соседним гексам.' },
    { id: 'chain_lightning', name: 'Цепная молния', school: 'air', level: 4, mana: 24, kind: 'damage', target: 'enemy', v: [25, 50, 100], perPower: 40, chain: [4, 5, 5], desc: 'Урон {v} + 40×Сила; перескакивает на ближайшие стеки (до {c}), каждый следующий получает половину.' },
    { id: 'inferno', name: 'Инферно', school: 'fire', level: 4, mana: 16, kind: 'damage', target: 'any', v: [20, 40, 80], perPower: 10, area: 2, desc: 'Урон {v} + 10×Сила по цели и гексам в радиусе 2.' },
    { id: 'resurrection', name: 'Воскрешение', school: 'earth', level: 4, mana: 20, kind: 'resurrect', target: 'ally', v: [40, 80, 160], perPower: 50, onlyLiving: true, desc: 'Воскрешает живых на {v} + 50×Сила HP (базовый уровень — до конца боя).' },
    { id: 'prayer', name: 'Молитва', school: 'water', level: 4, mana: 16, kind: 'buff', target: 'ally', v: [2, 4, 4], mass: true, effect: 'prayer', desc: 'Атака, защита и скорость +{v}. Эксперт: всем своим.' },
    { id: 'town_portal', name: 'Городской портал', school: 'earth', level: 4, mana: 16, kind: 'adventure', target: 'none', v: [0, 1, 1], desc: 'Переносит героя в ближайший свой город (продвинутый: в любой на выбор). Стоит 300 очков движения.' },
  ];
  const BY_ID = Object.create(null);
  LIST.forEach(s => { BY_ID[s.id] = s; });
  const SCHOOL_NAMES = { air: 'Воздух', earth: 'Земля', fire: 'Огонь', water: 'Вода', all: 'Любая' };
  const SCHOOL_COLORS = { air: '#7fd9ea', earth: '#b0843c', fire: '#ff7a2f', water: '#4d7fe0', all: '#c04fd0' };

  /** Цена маны с учётом школы у героя. */
  function manaCost(spell, mastery) {
    if (!mastery) return spell.mana;
    return Math.max(1, spell.mana - (spell.level <= 2 ? 1 : 3));
  }
  /** Уровень мастерства героя для заклинания: 0..3 */
  function masteryOf(hero, spell) {
    if (spell.school === 'all') {
      return Math.max(hero.skills.air || 0, hero.skills.earth || 0, hero.skills.fire || 0, hero.skills.water || 0);
    }
    return hero.skills[spell.school] || 0;
  }
  function describe(spell, mastery) {
    const m = Math.max(1, mastery || 1);
    return spell.desc.replace('{v}', spell.v[m - 1]).replace('{c}', spell.chain ? spell.chain[m - 1] : '');
  }
  function byLevel(level) { return LIST.filter(s => s.level === level); }

  H3.Spells = { LIST, BY_ID, get: id => BY_ID[id], SCHOOL_NAMES, SCHOOL_COLORS, manaCost, masteryOf, describe, byLevel };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Spells;
})(typeof window !== 'undefined' ? window : globalThis);
