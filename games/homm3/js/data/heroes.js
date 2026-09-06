/* ============================================================================
   data/heroes.js — 16 классов героев и 32 именованных героя (ТЗ §5.4).
   Класс: start {att,def,pow,kno}, grow — вероятности роста (%), type might|magic.
   Герой: name, cls, spec {type:'creature'|'skill'|'resource'|'spell', id},
          skills [{id, lvl}], spell (стартовое заклинание), portrait 'a'|'b'.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  const cls = (id, name, faction, type, start, grow) => ({ id, name, faction, type, start: { att: start[0], def: start[1], pow: start[2], kno: start[3] }, grow: { att: grow[0], def: grow[1], pow: grow[2], kno: grow[3] } });
  const CLASSES = [
    cls('knight', 'Рыцарь', 'castle', 'might', [2, 2, 1, 1], [35, 45, 10, 10]),
    cls('cleric', 'Клирик', 'castle', 'magic', [1, 0, 2, 2], [20, 15, 30, 35]),
    cls('ranger', 'Рейнджер', 'rampart', 'might', [1, 3, 1, 1], [35, 45, 10, 10]),
    cls('druid', 'Друид', 'rampart', 'magic', [0, 2, 1, 2], [10, 20, 35, 35]),
    cls('alchemist', 'Алхимик', 'tower', 'might', [1, 1, 2, 2], [30, 30, 20, 20]),
    cls('wizard', 'Волшебник', 'tower', 'magic', [0, 0, 2, 3], [10, 10, 40, 40]),
    cls('demoniac', 'Демоник', 'inferno', 'might', [2, 2, 1, 1], [35, 35, 15, 15]),
    cls('heretic', 'Еретик', 'inferno', 'magic', [1, 1, 2, 1], [15, 15, 35, 35]),
    cls('deathknight', 'Рыцарь смерти', 'necropolis', 'might', [1, 2, 2, 1], [30, 25, 20, 25]),
    cls('necromancer', 'Некромант', 'necropolis', 'magic', [1, 0, 2, 2], [15, 15, 35, 35]),
    cls('overlord', 'Повелитель', 'dungeon', 'might', [2, 2, 1, 1], [35, 35, 15, 15]),
    cls('warlock', 'Чернокнижник', 'dungeon', 'magic', [0, 0, 3, 2], [10, 10, 50, 30]),
    cls('barbarian', 'Варвар', 'stronghold', 'might', [4, 0, 1, 1], [55, 35, 5, 5]),
    cls('battlemage', 'Боевой маг', 'stronghold', 'magic', [2, 1, 1, 1], [30, 20, 25, 25]),
    cls('beastmaster', 'Повелитель зверей', 'fortress', 'might', [0, 4, 1, 1], [30, 50, 10, 10]),
    cls('witch', 'Ведьма', 'fortress', 'magic', [0, 1, 2, 2], [5, 15, 40, 40]),
  ];
  const CLASS_BY_ID = Object.create(null);
  CLASSES.forEach(c => { CLASS_BY_ID[c.id] = c; });

  const h = (id, name, cl, spec, skills, portrait, spell) => ({ id, name, cls: cl, spec, skills, portrait, spell: spell || null });
  const HEROES = [
    // Castle
    h('orrin', 'Оррин', 'knight', { type: 'skill', id: 'archery' }, [{ id: 'leadership', lvl: 1 }, { id: 'archery', lvl: 1 }], 'a'),
    h('valeska', 'Валеска', 'knight', { type: 'creature', id: 'archer' }, [{ id: 'leadership', lvl: 1 }, { id: 'archery', lvl: 1 }], 'b'),
    h('adela', 'Адела', 'cleric', { type: 'spell', id: 'bless' }, [{ id: 'wisdom', lvl: 1 }, { id: 'diplomacy', lvl: 1 }], 'a', 'bless'),
    h('caitlin', 'Кейтлин', 'cleric', { type: 'resource', id: 'gold' }, [{ id: 'wisdom', lvl: 1 }, { id: 'intelligence', lvl: 1 }], 'b', 'cure'),
    // Rampart
    h('kyrre', 'Кирре', 'ranger', { type: 'skill', id: 'logistics' }, [{ id: 'archery', lvl: 1 }, { id: 'logistics', lvl: 1 }], 'a'),
    h('ivor', 'Ивор', 'ranger', { type: 'creature', id: 'wood_elf' }, [{ id: 'archery', lvl: 1 }, { id: 'offense', lvl: 1 }], 'b'),
    h('mephala', 'Мефала', 'druid', { type: 'skill', id: 'armorer' }, [{ id: 'wisdom', lvl: 1 }, { id: 'armorer', lvl: 1 }], 'a', 'stone_skin'),
    h('uland', 'Уланд', 'druid', { type: 'spell', id: 'cure' }, [{ id: 'wisdom', lvl: 1 }, { id: 'water', lvl: 1 }], 'b', 'cure'),
    // Tower
    h('neela', 'Нила', 'alchemist', { type: 'skill', id: 'armorer' }, [{ id: 'scouting', lvl: 1 }, { id: 'armorer', lvl: 1 }], 'a'),
    h('thane', 'Тейн', 'alchemist', { type: 'creature', id: 'genie' }, [{ id: 'scouting', lvl: 1 }, { id: 'luck', lvl: 1 }], 'b'),
    h('solmyr', 'Солмир', 'wizard', { type: 'spell', id: 'chain_lightning' }, [{ id: 'wisdom', lvl: 1 }, { id: 'sorcery', lvl: 1 }], 'a', 'lightning_bolt'),
    h('halon', 'Халон', 'wizard', { type: 'skill', id: 'mysticism' }, [{ id: 'wisdom', lvl: 1 }, { id: 'mysticism', lvl: 1 }], 'b', 'magic_arrow'),
    // Inferno
    h('fiona', 'Фиона', 'demoniac', { type: 'creature', id: 'hell_hound' }, [{ id: 'scouting', lvl: 1 }, { id: 'offense', lvl: 1 }], 'a'),
    h('rashka', 'Рашка', 'demoniac', { type: 'creature', id: 'efreet' }, [{ id: 'leadership', lvl: 1 }, { id: 'armorer', lvl: 1 }], 'b'),
    h('xyron', 'Ксайрон', 'heretic', { type: 'spell', id: 'inferno' }, [{ id: 'wisdom', lvl: 1 }, { id: 'fire', lvl: 1 }], 'a', 'bloodlust'),
    h('ash', 'Эш', 'heretic', { type: 'resource', id: 'sulfur' }, [{ id: 'wisdom', lvl: 1 }, { id: 'sorcery', lvl: 1 }], 'b', 'curse'),
    // Necropolis
    h('isra', 'Исра', 'deathknight', { type: 'skill', id: 'necromancy' }, [{ id: 'necromancy', lvl: 1 }, { id: 'armorer', lvl: 1 }], 'a'),
    h('vokial', 'Вокиал', 'deathknight', { type: 'creature', id: 'vampire' }, [{ id: 'necromancy', lvl: 1 }, { id: 'offense', lvl: 1 }], 'b'),
    h('vidomina', 'Видомина', 'necromancer', { type: 'skill', id: 'necromancy' }, [{ id: 'necromancy', lvl: 2 }], 'a', 'curse'),
    h('thant', 'Тант', 'necromancer', { type: 'spell', id: 'animate_dead' }, [{ id: 'necromancy', lvl: 1 }, { id: 'wisdom', lvl: 1 }], 'b', 'magic_arrow'),
    // Dungeon
    h('gunnar', 'Гуннар', 'overlord', { type: 'skill', id: 'logistics' }, [{ id: 'logistics', lvl: 1 }, { id: 'armorer', lvl: 1 }], 'a'),
    h('shakti', 'Шакти', 'overlord', { type: 'creature', id: 'troglodyte' }, [{ id: 'offense', lvl: 1 }, { id: 'resistance', lvl: 1 }], 'b'),
    h('alamar', 'Аламар', 'warlock', { type: 'spell', id: 'resurrection' }, [{ id: 'wisdom', lvl: 1 }, { id: 'earth', lvl: 1 }], 'a', 'slow'),
    h('deemer', 'Димер', 'warlock', { type: 'spell', id: 'meteor_shower' }, [{ id: 'wisdom', lvl: 1 }, { id: 'sorcery', lvl: 1 }], 'b', 'magic_arrow'),
    // Stronghold
    h('crag_hack', 'Крэг Хак', 'barbarian', { type: 'skill', id: 'offense' }, [{ id: 'offense', lvl: 2 }], 'a'),
    h('gretchin', 'Гретчин', 'barbarian', { type: 'creature', id: 'goblin' }, [{ id: 'pathfinding', lvl: 1 }, { id: 'leadership', lvl: 1 }], 'b'),
    h('gundula', 'Гундула', 'battlemage', { type: 'skill', id: 'offense' }, [{ id: 'wisdom', lvl: 1 }, { id: 'offense', lvl: 1 }], 'a', 'bloodlust'),
    h('dessa', 'Десса', 'battlemage', { type: 'skill', id: 'logistics' }, [{ id: 'wisdom', lvl: 1 }, { id: 'logistics', lvl: 1 }], 'b', 'haste'),
    // Fortress
    h('tazar', 'Тазар', 'beastmaster', { type: 'skill', id: 'armorer' }, [{ id: 'armorer', lvl: 2 }], 'a'),
    h('wystan', 'Вистан', 'beastmaster', { type: 'creature', id: 'lizardman' }, [{ id: 'armorer', lvl: 1 }, { id: 'archery', lvl: 1 }], 'b'),
    h('mirlanda', 'Мирланда', 'witch', { type: 'spell', id: 'weakness' }, [{ id: 'wisdom', lvl: 1 }, { id: 'water', lvl: 1 }], 'a', 'weakness'),
    h('styg', 'Стиг', 'witch', { type: 'skill', id: 'sorcery' }, [{ id: 'wisdom', lvl: 1 }, { id: 'sorcery', lvl: 1 }], 'b', 'shield'),
  ];
  const HERO_BY_ID = Object.create(null);
  HEROES.forEach(x => { HERO_BY_ID[x.id] = x; });

  function heroesOfFaction(fid) { return HEROES.filter(x => CLASS_BY_ID[x.cls].faction === fid); }
  function specText(hero) {
    const s = hero.spec;
    if (s.type === 'creature') return H3.Creatures.get(s.id).name + ' (+1 скорость, +5 % атаки/защиты за уровни)';
    if (s.type === 'skill') return H3.Skills.get(s.id).name + ' (эффект растёт с уровнем)';
    if (s.type === 'resource') return s.id === 'gold' ? '+350 золота в день' : '+1 ' + s.id + ' в день';
    if (s.type === 'spell') return H3.Spells.get(s.id).name + ' (усиленное)';
    return '';
  }

  /** Таблица опыта (уровни 1–30, далее +20 % прироста). */
  const XP = [0, 1000, 2000, 3200, 4600, 6200, 8000, 10000, 12200, 14700, 17500, 20600, 24320, 28784, 34140, 40567, 48279, 57533, 68637, 81961,
    97949, 117134, 140156, 167782, 200933, 240714, 288451, 345735, 414475, 496963];
  function xpForLevel(level) {
    if (level <= 1) return 0;
    if (level <= XP.length) return XP[level - 1];
    let prev = XP[XP.length - 1], inc = XP[XP.length - 1] - XP[XP.length - 2];
    for (let l = XP.length + 1; l <= level; l++) { inc = Math.round(inc * 1.2); prev += inc; }
    return prev;
  }
  function levelForXp(xp) { let l = 1; while (xp >= xpForLevel(l + 1)) l++; return l; }

  H3.Heroes = { CLASSES, CLASS_BY_ID, getClass: id => CLASS_BY_ID[id], HEROES, HERO_BY_ID, get: id => HERO_BY_ID[id], heroesOfFaction, specText, xpForLevel, levelForXp };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Heroes;
})(typeof window !== 'undefined' ? window : globalThis);
