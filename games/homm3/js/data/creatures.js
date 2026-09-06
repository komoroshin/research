/* ============================================================================
   data/creatures.js — 112 существ восьми фракций (статы SoD, см. docs/01-research.md §4).
   Поля: id, name, faction, tier, upg (улучшенное), base (id базового для upg),
   att, def, dmg [min,max], hp, speed, growth, cost {gold, +редкий}, ab (способности).
   Способности — строки 'code' или 'code:param'. Размер спрайта задаётся тиром.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  // c(id, name, tier, att, def, dmin, dmax, hp, speed, growth, gold, ab, extraCost)
  function mk(faction, list) {
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const [id, name, tier, att, def, dmin, dmax, hp, speed, growth, gold, ab, extra] = list[i];
      const upg = i % 2 === 1;
      const c = { id, name, faction, tier, upg, att, def, dmg: [dmin, dmax], hp, speed, growth, cost: Object.assign({ gold }, extra || {}), ab: ab || [] };
      if (upg) { c.base = list[i - 1][0]; out[out.length - 1].upgTo = id; }
      out.push(c);
    }
    return out;
  }
  const FLY = 'flyer', UND = 'undead', NL = 'nonliving';

  const LIST = [].concat(
    mk('castle', [
      ['pikeman', 'Копейщик', 1, 4, 5, 1, 3, 10, 4, 14, 60, ['immuneJoust']],
      ['halberdier', 'Алебардщик', 1, 6, 5, 2, 3, 10, 5, 14, 75, ['immuneJoust']],
      ['archer', 'Лучник', 2, 6, 3, 2, 3, 10, 4, 9, 100, ['shooter:12']],
      ['marksman', 'Стрелок', 2, 6, 3, 2, 3, 10, 6, 9, 150, ['shooter:24', 'doubleAttack']],
      ['griffin', 'Грифон', 3, 8, 8, 3, 6, 25, 6, 7, 200, [FLY, 'retaliations:2']],
      ['royal_griffin', 'Королевский грифон', 3, 9, 9, 3, 6, 25, 9, 7, 240, [FLY, 'retaliations:99']],
      ['swordsman', 'Мечник', 4, 10, 12, 6, 9, 35, 5, 4, 300, []],
      ['crusader', 'Крестоносец', 4, 12, 12, 7, 10, 35, 6, 4, 400, ['doubleAttack']],
      ['monk', 'Монах', 5, 12, 7, 10, 12, 30, 5, 3, 400, ['shooter:12']],
      ['zealot', 'Фанатик', 5, 12, 10, 10, 12, 30, 7, 3, 450, ['shooter:24', 'noMeleePenalty']],
      ['cavalier', 'Кавалерист', 6, 15, 15, 15, 25, 100, 7, 2, 1000, ['jousting', 'large']],
      ['champion', 'Чемпион', 6, 16, 16, 20, 25, 100, 9, 2, 1200, ['jousting', 'large']],
      ['angel', 'Ангел', 7, 20, 20, 50, 50, 200, 12, 1, 3000, [FLY, 'moraleBonus', 'hate:devil,arch_devil'], { gems: 1 }],
      ['archangel', 'Архангел', 7, 30, 30, 50, 50, 250, 18, 1, 5000, [FLY, 'moraleBonus', 'hate:devil,arch_devil', 'resurrectOnce'], { gems: 3 }],
    ]),
    mk('rampart', [
      ['centaur', 'Кентавр', 1, 5, 3, 2, 3, 8, 6, 14, 70, ['large']],
      ['centaur_captain', 'Капитан кентавров', 1, 6, 3, 2, 3, 10, 8, 14, 90, ['large']],
      ['dwarf', 'Гном', 2, 6, 7, 2, 4, 20, 3, 8, 120, ['magicResist:20']],
      ['battle_dwarf', 'Боевой гном', 2, 7, 7, 2, 4, 20, 5, 8, 150, ['magicResist:40']],
      ['wood_elf', 'Лесной эльф', 3, 9, 5, 3, 5, 15, 6, 7, 200, ['shooter:24']],
      ['grand_elf', 'Великий эльф', 3, 9, 5, 3, 5, 15, 7, 7, 225, ['shooter:24', 'doubleAttack']],
      ['pegasus', 'Пегас', 4, 9, 8, 5, 9, 30, 8, 5, 250, [FLY, 'large']],
      ['silver_pegasus', 'Серебряный пегас', 4, 9, 10, 5, 9, 30, 12, 5, 275, [FLY, 'large']],
      ['dendroid_guard', 'Дендроид-страж', 5, 9, 12, 10, 14, 55, 3, 3, 350, ['bind']],
      ['dendroid_soldier', 'Дендроид-солдат', 5, 9, 12, 10, 14, 65, 4, 3, 425, ['bind']],
      ['unicorn', 'Единорог', 6, 15, 14, 18, 22, 90, 7, 2, 850, ['onHit:blind:20', 'resistAura', 'large']],
      ['war_unicorn', 'Боевой единорог', 6, 15, 14, 18, 22, 100, 8, 2, 1000, ['onHit:blind:20', 'resistAura', 'large']],
      ['green_dragon', 'Зелёный дракон', 7, 16, 14, 25, 35, 180, 9, 1, 3000, [FLY, 'breath', 'spellImmune:3', 'large'], { crystal: 1 }],
      ['gold_dragon', 'Золотой дракон', 7, 17, 14, 25, 35, 200, 10, 1, 4000, [FLY, 'breath', 'spellImmune:4', 'large'], { crystal: 2 }],
    ]),
    mk('tower', [
      ['gremlin', 'Гремлин', 1, 3, 3, 1, 2, 4, 4, 16, 30, []],
      ['master_gremlin', 'Мастер-гремлин', 1, 4, 4, 1, 2, 4, 5, 16, 40, ['shooter:8']],
      ['stone_gargoyle', 'Каменная горгулья', 2, 6, 6, 2, 3, 16, 6, 9, 130, [FLY, NL]],
      ['obsidian_gargoyle', 'Обсидиановая горгулья', 2, 7, 7, 2, 3, 16, 9, 9, 160, [FLY, NL]],
      ['stone_golem', 'Каменный голем', 3, 7, 10, 4, 5, 30, 3, 6, 150, [NL, 'spellDamageReduce:50']],
      ['iron_golem', 'Железный голем', 3, 9, 10, 4, 5, 35, 5, 6, 200, [NL, 'spellDamageReduce:75']],
      ['mage', 'Маг', 4, 11, 8, 7, 9, 25, 5, 4, 350, ['shooter:24', 'noMeleePenalty']],
      ['arch_mage', 'Архимаг', 4, 12, 9, 7, 9, 30, 7, 4, 450, ['shooter:24', 'noMeleePenalty']],
      ['genie', 'Джинн', 5, 12, 12, 13, 16, 40, 7, 3, 550, [FLY, 'hate:efreet,efreet_sultan']],
      ['master_genie', 'Мастер-джинн', 5, 12, 12, 13, 16, 40, 11, 3, 600, [FLY, 'hate:efreet,efreet_sultan', 'castRandomBuff']],
      ['naga', 'Нага', 6, 16, 13, 20, 20, 110, 5, 2, 1100, ['noRetaliation', 'large']],
      ['naga_queen', 'Королева наг', 6, 16, 13, 30, 30, 110, 7, 2, 1600, ['noRetaliation', 'large']],
      ['giant', 'Гигант', 7, 19, 16, 40, 60, 150, 7, 1, 2000, ['mindImmune', 'large'], { gems: 1 }],
      ['titan', 'Титан', 7, 20, 16, 50, 100, 200, 9, 1, 5000, ['shooter:24', 'noRangePenalty', 'mindImmune', 'hate:black_dragon', 'large'], { gems: 3 }],
    ]),
    mk('inferno', [
      ['imp', 'Бес', 1, 2, 3, 1, 2, 4, 5, 15, 50, []],
      ['familiar', 'Фамильяр', 1, 4, 4, 1, 2, 4, 7, 15, 60, ['manaChannel']],
      ['gog', 'Гог', 2, 6, 4, 2, 4, 13, 4, 8, 125, ['shooter:12']],
      ['magog', 'Магог', 2, 7, 4, 2, 4, 13, 6, 8, 175, ['shooter:24', 'fireballShot']],
      ['hell_hound', 'Адская гончая', 3, 10, 6, 2, 7, 25, 7, 5, 200, ['large']],
      ['cerberus', 'Цербер', 3, 10, 8, 2, 7, 25, 8, 5, 250, ['threeHeaded', 'noRetaliation', 'large']],
      ['demon', 'Демон', 4, 10, 10, 7, 9, 35, 5, 4, 250, []],
      ['horned_demon', 'Рогатый демон', 4, 10, 10, 7, 9, 40, 6, 4, 270, []],
      ['pit_fiend', 'Порождение ада', 5, 13, 13, 13, 17, 45, 6, 3, 500, []],
      ['pit_lord', 'Владыка бездны', 5, 13, 13, 13, 17, 45, 7, 3, 700, ['raiseDemons']],
      ['efreet', 'Ифрит', 6, 16, 12, 16, 24, 90, 9, 2, 900, [FLY, 'fireImmune', 'hate:genie,master_genie']],
      ['efreet_sultan', 'Султан ифритов', 6, 16, 14, 16, 24, 90, 13, 2, 1100, [FLY, 'fireImmune', 'hate:genie,master_genie', 'fireShield:20']],
      ['devil', 'Дьявол', 7, 19, 21, 30, 40, 160, 11, 1, 2700, [FLY, 'noRetaliation', 'enemyLuck', 'hate:angel,archangel', 'large'], { mercury: 1 }],
      ['arch_devil', 'Архидьявол', 7, 26, 28, 30, 40, 200, 17, 1, 4500, [FLY, 'noRetaliation', 'enemyLuck', 'hate:angel,archangel', 'large'], { mercury: 2 }],
    ]),
    mk('necropolis', [
      ['skeleton', 'Скелет', 1, 5, 4, 1, 3, 6, 4, 12, 60, [UND]],
      ['skeleton_warrior', 'Скелет-воин', 1, 6, 6, 1, 3, 6, 5, 12, 70, [UND]],
      ['walking_dead', 'Ходячий мертвец', 2, 5, 5, 2, 3, 15, 3, 8, 100, [UND]],
      ['zombie', 'Зомби', 2, 5, 5, 2, 3, 20, 4, 8, 125, [UND, 'onHit:disease:100']],
      ['wight', 'Привидение', 3, 7, 7, 3, 5, 18, 5, 7, 200, [UND, FLY, 'regenerate']],
      ['wraith', 'Призрак', 3, 7, 7, 3, 5, 18, 7, 7, 230, [UND, FLY, 'regenerate', 'manaDrain']],
      ['vampire', 'Вампир', 4, 10, 9, 5, 8, 30, 6, 4, 360, [UND, FLY, 'noRetaliation']],
      ['vampire_lord', 'Лорд вампиров', 4, 10, 10, 5, 8, 40, 9, 4, 500, [UND, FLY, 'noRetaliation', 'lifeDrain']],
      ['lich', 'Лич', 5, 13, 10, 11, 13, 30, 6, 3, 550, [UND, 'shooter:12', 'deathCloud']],
      ['power_lich', 'Могучий лич', 5, 13, 10, 11, 15, 40, 7, 3, 600, [UND, 'shooter:24', 'deathCloud']],
      ['black_knight', 'Чёрный рыцарь', 6, 16, 16, 15, 30, 120, 7, 2, 1200, [UND, 'onHit:curse:20', 'large']],
      ['dread_knight', 'Рыцарь смерти', 6, 18, 18, 15, 30, 120, 9, 2, 1500, [UND, 'onHit:curse:20', 'deathBlow:20', 'large']],
      ['bone_dragon', 'Костяной дракон', 7, 17, 15, 25, 50, 150, 9, 1, 1800, [UND, FLY, 'enemyMorale', 'large']],
      ['ghost_dragon', 'Призрачный дракон', 7, 19, 17, 25, 50, 200, 14, 1, 3000, [UND, FLY, 'enemyMorale', 'onHit:aging:20', 'large'], { mercury: 1 }],
    ]),
    mk('dungeon', [
      ['troglodyte', 'Троглодит', 1, 4, 3, 1, 3, 5, 4, 14, 50, ['blindImmune']],
      ['infernal_troglodyte', 'Адский троглодит', 1, 5, 4, 1, 3, 6, 5, 14, 65, ['blindImmune']],
      ['harpy', 'Гарпия', 2, 6, 5, 1, 4, 14, 6, 8, 130, [FLY, 'strikeAndReturn']],
      ['harpy_hag', 'Гарпия-ведьма', 2, 6, 6, 1, 4, 14, 9, 8, 170, [FLY, 'strikeAndReturn', 'noRetaliation']],
      ['beholder', 'Бехолдер', 3, 9, 7, 3, 5, 22, 5, 7, 250, ['shooter:12', 'noMeleePenalty']],
      ['evil_eye', 'Злой глаз', 3, 10, 8, 3, 5, 22, 7, 7, 280, ['shooter:24', 'noMeleePenalty']],
      ['medusa', 'Медуза', 4, 9, 9, 6, 8, 25, 5, 4, 300, ['shooter:4', 'noMeleePenalty', 'onHit:petrify:20', 'large']],
      ['medusa_queen', 'Королева медуз', 4, 10, 10, 6, 8, 30, 6, 4, 330, ['shooter:8', 'noMeleePenalty', 'onHit:petrify:20', 'large']],
      ['minotaur', 'Минотавр', 5, 14, 12, 12, 20, 50, 6, 3, 500, ['minMorale']],
      ['minotaur_king', 'Король минотавров', 5, 15, 15, 12, 20, 50, 8, 3, 575, ['minMorale']],
      ['manticore', 'Мантикора', 6, 15, 13, 14, 20, 80, 7, 2, 850, [FLY, 'large']],
      ['scorpicore', 'Скорпикора', 6, 16, 14, 14, 20, 80, 11, 2, 1050, [FLY, 'onHit:paralyze:20', 'large']],
      ['red_dragon', 'Красный дракон', 7, 19, 19, 40, 50, 180, 11, 1, 2500, [FLY, 'breath', 'spellImmune:3', 'large'], { sulfur: 1 }],
      ['black_dragon', 'Чёрный дракон', 7, 20, 20, 40, 50, 200, 12, 1, 4000, [FLY, 'breath', 'spellImmune:5', 'hate:giant,titan', 'large'], { sulfur: 2 }],
    ]),
    mk('stronghold', [
      ['goblin', 'Гоблин', 1, 4, 2, 1, 2, 5, 5, 15, 40, []],
      ['hobgoblin', 'Хобгоблин', 1, 5, 3, 1, 2, 5, 7, 15, 50, []],
      ['wolf_rider', 'Наездник на волке', 2, 7, 5, 2, 4, 10, 6, 9, 100, ['large']],
      ['wolf_raider', 'Волчий налётчик', 2, 8, 5, 3, 4, 10, 8, 9, 140, ['doubleAttack', 'large']],
      ['orc', 'Орк', 3, 8, 4, 2, 5, 15, 4, 7, 150, ['shooter:12']],
      ['orc_chieftain', 'Вождь орков', 3, 8, 4, 2, 5, 20, 5, 7, 165, ['shooter:24']],
      ['ogre', 'Огр', 4, 13, 7, 6, 12, 40, 4, 4, 300, []],
      ['ogre_mage', 'Огр-маг', 4, 13, 7, 6, 12, 60, 5, 4, 400, ['castBloodlust']],
      ['roc', 'Рух', 5, 13, 11, 11, 15, 60, 7, 3, 600, [FLY, 'large']],
      ['thunderbird', 'Птица грома', 5, 13, 11, 11, 15, 60, 11, 3, 700, [FLY, 'onHit:lightning:20', 'large']],
      ['cyclops', 'Циклоп', 6, 15, 12, 16, 20, 70, 6, 2, 750, ['shooter:16', 'wallShooter']],
      ['cyclops_king', 'Король циклопов', 6, 17, 13, 16, 20, 70, 8, 2, 1100, ['shooter:24', 'wallShooter']],
      ['behemoth', 'Чудище', 7, 17, 17, 30, 50, 160, 6, 1, 1500, ['ignoreDefense:40', 'large']],
      ['ancient_behemoth', 'Древнее чудище', 7, 19, 19, 30, 50, 300, 9, 1, 3000, ['ignoreDefense:80', 'large'], { crystal: 1 }],
    ]),
    mk('fortress', [
      ['gnoll', 'Гнолл', 1, 3, 5, 2, 3, 6, 4, 12, 50, []],
      ['gnoll_marauder', 'Гнолл-мародёр', 1, 4, 6, 2, 3, 6, 5, 12, 70, []],
      ['lizardman', 'Ящер', 2, 5, 6, 2, 3, 14, 4, 9, 110, ['shooter:12']],
      ['lizard_warrior', 'Ящер-воин', 2, 6, 8, 2, 5, 15, 5, 9, 140, ['shooter:24']],
      ['serpent_fly', 'Змий', 3, 7, 9, 2, 5, 20, 9, 8, 220, [FLY, 'dispelOnHit']],
      ['dragon_fly', 'Стрекоза', 3, 8, 10, 2, 5, 20, 13, 8, 240, [FLY, 'dispelOnHit', 'onHit:weakness:100']],
      ['basilisk', 'Василиск', 4, 11, 11, 6, 10, 35, 5, 4, 325, ['onHit:petrify:20', 'large']],
      ['greater_basilisk', 'Великий василиск', 4, 12, 12, 6, 10, 40, 7, 4, 400, ['onHit:petrify:20', 'large']],
      ['gorgon', 'Горгона', 5, 10, 14, 12, 16, 70, 5, 3, 525, ['large']],
      ['mighty_gorgon', 'Могучая горгона', 5, 11, 16, 12, 16, 70, 6, 3, 600, ['deathStare', 'large']],
      ['wyvern', 'Виверна', 6, 14, 14, 14, 18, 70, 7, 2, 800, [FLY, 'large']],
      ['wyvern_monarch', 'Монарх виверн', 6, 14, 14, 18, 22, 70, 11, 2, 1100, [FLY, 'onHit:poison:100', 'large']],
      ['hydra', 'Гидра', 7, 16, 18, 25, 45, 175, 5, 1, 2200, ['attackAll', 'noRetaliation', 'large']],
      ['chaos_hydra', 'Гидра хаоса', 7, 18, 20, 25, 45, 250, 7, 1, 3500, ['attackAll', 'noRetaliation', 'large'], { sulfur: 1 }],
    ])
  );

  const BY_ID = Object.create(null);
  LIST.forEach(c => { BY_ID[c.id] = c; });

  /** Способность есть? */
  function hasAb(c, code) { return c.ab.some(a => a === code || a.startsWith(code + ':')); }
  /** Параметр способности ('shooter:12' → '12'). */
  function abParam(c, code) { const a = c.ab.find(x => x.startsWith(code + ':')); return a ? a.slice(code.length + 1) : null; }
  function abNum(c, code, dflt) { const p = abParam(c, code); return p === null ? (dflt || 0) : +p.split(':')[0]; }
  function isShooter(c) { return hasAb(c, 'shooter'); }
  function shots(c) { return abNum(c, 'shooter', 0); }
  function isFlyer(c) { return hasAb(c, 'flyer'); }
  function isUndead(c) { return hasAb(c, 'undead'); }
  function noMorale(c) { return hasAb(c, 'undead') || hasAb(c, 'nonliving'); }
  /** onHit-эффекты: [{effect, chance}] */
  function onHits(c) { return c.ab.filter(a => a.startsWith('onHit:')).map(a => { const p = a.split(':'); return { effect: p[1], chance: +p[2] }; }); }

  /**
   * AI value — ценность существа для ИИ, стражей и дипломатии (ТЗ §5.2).
   */
  function aiValue(c) {
    if (c._ai) return c._ai;
    let m = 1;
    if (isShooter(c)) m *= 1.3;
    if (isFlyer(c)) m *= 1.15;
    if (hasAb(c, 'noRetaliation')) m *= 1.2;
    if (hasAb(c, 'doubleAttack')) m *= 1.25;
    if (hasAb(c, 'breath') || hasAb(c, 'attackAll') || hasAb(c, 'threeHeaded') || hasAb(c, 'deathCloud')) m *= 1.2;
    if (hasAb(c, 'lifeDrain')) m *= 1.15;
    if (hasAb(c, 'spellImmune')) m *= 1.1;
    const others = c.ab.filter(a => !/^(shooter|flyer|noRetaliation|doubleAttack|breath|attackAll|threeHeaded|deathCloud|lifeDrain|spellImmune|large|undead|nonliving|immuneJoust|blindImmune)/.test(a)).length;
    m *= Math.pow(1.05, others);
    // калибровка под пропорции оригинальных AI value (копейщик ≈ 80, чёрный дракон ≈ 9000)
    const power = Math.pow(c.hp * (c.dmg[0] + c.dmg[1]) / 2, 0.6);
    const stats = 1 + 0.03 * (c.att + c.def);
    const speedMod = 0.9 + 0.02 * Math.min(c.speed, 15);
    c._ai = Math.round(10.7 * power * stats * speedMod * m);
    return c._ai;
  }

  const ABILITY_NAMES = {
    shooter: 'Стрелок', noMeleePenalty: 'Без штрафа в ближнем бою', noRangePenalty: 'Без штрафа за дальность', flyer: 'Летает',
    doubleAttack: 'Двойная атака', noRetaliation: 'Враг не отвечает', retaliations: 'Дополнительные ответные удары', strikeAndReturn: 'Удар и возврат',
    lifeDrain: 'Высасывает жизнь', breath: 'Дыхание (бьёт 2 гекса)', attackAll: 'Бьёт всех вокруг', threeHeaded: 'Бьёт 3 цели', deathCloud: 'Облако смерти',
    fireballShot: 'Огненный выстрел (по площади)', hate: 'Ненависть (+50 % урона)', jousting: 'Разгон (+5 %/гекс)', ignoreDefense: 'Игнорирует защиту',
    deathStare: 'Взгляд смерти', onHit: 'Эффект при ударе', dispelOnHit: 'Снимает чары при ударе', undead: 'Нежить', nonliving: 'Неживое',
    magicResist: 'Сопротивление магии', spellDamageReduce: 'Меньше урона от магии', spellImmune: 'Иммунитет к магии', mindImmune: 'Иммунитет к магии разума',
    moraleBonus: '+1 мораль армии', enemyMorale: '−1 мораль врагу', enemyLuck: '−1 удача врагу', minMorale: 'Мораль не ниже +1', regenerate: 'Регенерация',
    fireShield: 'Огненный щит', fireImmune: 'Иммунитет к огню', manaDrain: 'Вытягивает ману', bind: 'Связывает', resistAura: 'Аура сопротивления',
    wallShooter: 'Стреляет по стенам', resurrectOnce: 'Воскрешение (раз за бой)', raiseDemons: 'Поднимает демонов', castRandomBuff: 'Благословляет союзников',
    castBloodlust: 'Жажда крови союзнику', manaChannel: 'Перехват маны', immuneJoust: 'Иммунитет к разгону', blindImmune: 'Иммунитет к ослеплению', large: 'Крупное существо',
  };
  function abilityText(c) {
    return c.ab.filter(a => a !== 'large').map(a => {
      const [code, p] = a.split(':');
      let s = ABILITY_NAMES[code] || code;
      if (code === 'shooter') s += ' (' + p + ' выстр.)';
      else if (code === 'retaliations') s = p === '99' ? 'Безлимитные ответные удары' : p + ' ответных удара';
      else if (code === 'magicResist' || code === 'spellDamageReduce' || code === 'ignoreDefense' || code === 'fireShield') s += ' ' + p + ' %';
      else if (code === 'spellImmune') s += p === '5' ? ' (вся)' : ' (ур. 1–' + p + ')';
      else if (code === 'onHit') { const [eff, ch] = a.split(':').slice(1); s = ({ curse: 'Проклятие', blind: 'Ослепление', petrify: 'Окаменение', paralyze: 'Паралич', disease: 'Болезнь', weakness: 'Слабость', poison: 'Яд', aging: 'Старение', lightning: 'Удар молнии' })[eff] + ' ' + ch + ' %'; }
      else if (code === 'deathBlow') s = 'Смертельный удар ' + p + ' %';
      else if (code === 'hate') s = 'Ненависть: ' + p.split(',').map(id => (BY_ID[id] || { name: id }).name).join(', ');
      return s;
    });
  }

  H3.Creatures = { LIST, BY_ID, get: id => BY_ID[id], hasAb, abParam, abNum, isShooter, shots, isFlyer, isUndead, noMorale, onHits, aiValue, abilityText, ABILITY_NAMES };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Creatures;
})(typeof window !== 'undefined' ? window : globalThis);
