/* ============================================================================
   data/artifacts.js — 36 артефактов (ТЗ §6.3).
   slot: helm|cape|neck|weapon|shield|armor|ring|boots|misc
   fx: {att, def, pow, kno, morale, luck, move, hp, speed, resist, spellDur, enemyMorale, fly}
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const a = (id, name, cls, slot, fx, desc) => ({ id, name, cls, slot, fx, desc });

  const LIST = [
    a('centaur_axe', 'Топор кентавра', 'treasure', 'weapon', { att: 2 }, '+2 к атаке'),
    a('dwarven_shield', 'Щит гномьих владык', 'treasure', 'shield', { def: 2 }, '+2 к защите'),
    a('unicorn_helm', 'Шлем алебастрового единорога', 'treasure', 'helm', { kno: 1 }, '+1 к знанию'),
    a('skull_helmet', 'Шлем-череп', 'treasure', 'helm', { kno: 2 }, '+2 к знанию'),
    a('petrified_breastplate', 'Нагрудник окаменевшего дерева', 'treasure', 'armor', { pow: 1 }, '+1 к силе магии'),
    a('ring_conjuring', 'Кольцо колдовства', 'treasure', 'ring', { spellDur: 2 }, 'Заклинания длятся на 2 раунда дольше'),
    a('badge_courage', 'Знак отваги', 'treasure', 'misc', { morale: 1 }, '+1 к морали'),
    a('clover_fortune', 'Клевер удачи', 'treasure', 'misc', { luck: 1 }, '+1 к удаче'),
    a('blackshard', 'Чёрный клинок мёртвого рыцаря', 'minor', 'weapon', { att: 3 }, '+3 к атаке'),
    a('gnoll_flail', 'Цеп великого гнолла', 'minor', 'weapon', { att: 4 }, '+4 к атаке'),
    a('gnoll_buckler', 'Щит короля гноллов', 'minor', 'shield', { def: 4 }, '+4 к защите'),
    a('magi_crown', 'Корона верховного мага', 'minor', 'helm', { kno: 4 }, '+4 к знанию'),
    a('rib_cage', 'Грудная клетка', 'minor', 'armor', { pow: 2 }, '+2 к силе магии'),
    a('basilisk_scales', 'Чешуя великого василиска', 'minor', 'armor', { def: 2 }, '+2 к защите'),
    a('ring_vitality', 'Кольцо жизненной силы', 'minor', 'ring', { hp: 1 }, '+1 HP всем существам'),
    a('ring_life', 'Кольцо жизни', 'minor', 'ring', { hp: 1 }, '+1 HP всем существам'),
    a('boots_speed', 'Сапоги скорости', 'minor', 'boots', { move: 600 }, '+600 очков движения'),
    a('equestrian_gloves', 'Перчатки наездника', 'minor', 'misc', { move: 300 }, '+300 очков движения'),
    a('cape_conjuring', 'Плащ колдовства', 'minor', 'cape', { spellDur: 3 }, 'Заклинания длятся на 3 раунда дольше'),
    a('necklace_swiftness', 'Ожерелье быстроты', 'minor', 'neck', { speed: 1 }, '+1 к скорости всех существ'),
    a('sword_hellfire', 'Меч адского пламени', 'major', 'weapon', { att: 6 }, '+6 к атаке'),
    a('shield_yawning_dead', 'Щит зевающих мертвецов', 'major', 'shield', { def: 3, enemyMorale: -1 }, '+3 к защите, −1 мораль врагу'),
    a('thunder_helmet', 'Шлем грома', 'major', 'helm', { kno: 10, pow: -2 }, '+10 к знанию, −2 к силе магии'),
    a('armor_wonder', 'Доспех чудес', 'major', 'armor', { att: 1, def: 1, pow: 1, kno: 1 }, '+1 ко всем навыкам'),
    a('ogre_club', 'Дубина огра-разрушителя', 'major', 'weapon', { att: 5 }, '+5 к атаке'),
    a('ogre_targ', 'Тарч свирепого огра', 'major', 'shield', { def: 5 }, '+5 к защите'),
    a('cyclops_tunic', 'Туника короля циклопов', 'major', 'armor', { pow: 4 }, '+4 к силе магии'),
    a('pendant_courage', 'Кулон отваги', 'major', 'neck', { morale: 3, luck: 3 }, '+3 к морали и удаче'),
    a('cape_velocity', 'Плащ стремительности', 'major', 'cape', { speed: 2 }, '+2 к скорости всех существ'),
    a('boots_polarity', 'Сапоги полярности', 'major', 'boots', { resist: 50 }, '+50 % сопротивления магии'),
    a('titan_gladius', 'Гладиус титана', 'relic', 'weapon', { att: 12 }, '+12 к атаке'),
    a('sentinel_shield', 'Щит стража', 'relic', 'shield', { def: 12 }, '+12 к защите'),
    a('helm_enlightenment', 'Шлем небесного просветления', 'relic', 'helm', { att: 6, def: 6, pow: 6, kno: 6 }, '+6 ко всем навыкам'),
    a('titan_cuirass', 'Кираса титана', 'relic', 'armor', { pow: 10, kno: -2 }, '+10 к силе магии, −2 к знанию'),
    a('necklace_bliss', 'Небесное ожерелье блаженства', 'relic', 'neck', { att: 3, def: 3, pow: 3, kno: 3 }, '+3 ко всем навыкам'),
    a('angel_wings', 'Крылья ангела', 'relic', 'cape', { fly: 1 }, 'Герой летает: препятствия не мешают, любая местность стоит 100'),
  ];
  const BY_ID = Object.create(null);
  LIST.forEach(x => { BY_ID[x.id] = x; });
  const CLASS_VALUE = { treasure: 2000, minor: 5000, major: 10000, relic: 20000 };
  const CLASS_NAMES = { treasure: 'Сокровище', minor: 'Малый', major: 'Большой', relic: 'Реликвия' };
  const SLOTS = ['helm', 'neck', 'cape', 'weapon', 'shield', 'armor', 'ring1', 'ring2', 'boots', 'misc1', 'misc2'];
  const SLOT_NAMES = { helm: 'Шлем', neck: 'Ожерелье', cape: 'Плащ', weapon: 'Оружие', shield: 'Щит', armor: 'Доспех', ring1: 'Кольцо', ring2: 'Кольцо', boots: 'Сапоги', misc1: 'Прочее', misc2: 'Прочее' };
  /** Слоты экипировки, куда можно надеть артефакт. */
  function slotsFor(art) {
    if (art.slot === 'ring') return ['ring1', 'ring2'];
    if (art.slot === 'misc') return ['misc1', 'misc2'];
    return [art.slot];
  }
  function byClass(cls) { return LIST.filter(x => x.cls === cls); }

  H3.Artifacts = { LIST, BY_ID, get: id => BY_ID[id], CLASS_VALUE, CLASS_NAMES, SLOTS, SLOT_NAMES, slotsFor, byClass };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Artifacts;
})(typeof window !== 'undefined' ? window : globalThis);
