/* ============================================================================
   data/campaign.js — кампании: цепочки сценариев с переносом героя.

   Сценарий = настройки генерации карты + цели + брифинг. Цели можно задавать
   шаблоном (`of: 'enemy'`) — конкретные id подставятся после генерации карты.
   carry: 'hero' — в следующий сценарий переходит герой с уровнем, навыками,
   заклинаниями, артефактами и армией; 'none' — начинаем с чистого листа.
   hero — стартовый герой игрока (id), foes — фракции противников по порядку
   (кого не хватило — случайные из оставшихся).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  const LIST = [
    {
      id: 'erathia',
      name: 'Возвращение в Эрафию',
      desc: 'Пять сценариев: от родного удела до столицы врага. Герой переходит из карты в карту вместе с армией и артефактами.',
      scenarios: [
        {
          id: 'e1', name: 'Родной удел',
          brief: 'Соседний барон объявил ваши земли своими. Разберитесь с ним, пока не подтянулись его союзники.',
          size: 'S', seed: 1101, faction: 'castle', opponents: 1, difficulty: 'easy',
          goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
        },
        {
          id: 'e2', name: 'Тесный проход',
          brief: 'Дорога на север перекрыта заставой. Возьмите вражеский город — и путь открыт. Держитесь: у вас на всё три недели.',
          size: 'S', seed: 1102, faction: 'castle', opponents: 1, difficulty: 'normal',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 21 }] },
        },
        {
          id: 'e3', name: 'Казна похода',
          brief: 'Войну кормит золото. Наберите казну — и армию можно будет собрать где угодно.',
          size: 'M', seed: 1103, faction: 'castle', opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'gather', res: 'gold', amount: 60000 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
        },
        {
          id: 'e4', name: 'Клинок предков',
          brief: 'В подземельях спрятан клинок вашего рода. Найдите его — и не потеряйте героя: без него поход кончится.',
          size: 'M', seed: 1104, faction: 'castle', opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'find_artifact', art: 'titan_gladius' }, { type: 'kill_all' }],
            lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
        },
        {
          id: 'e5', name: 'Столица',
          brief: 'Последний бой. Все города на карте должны стать вашими.',
          size: 'L', seed: 1105, faction: 'castle', opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'capture_all_towns' }], lose: [{ type: 'lose_all' }] },
        },
      ],
    },
    {
      id: 'necro',
      name: 'Тень Некрополиса',
      desc: 'Пять сценариев за Некрополис: от одинокого паладина у ворот склепа до войны со всем живым. Каждый сценарий — своё условие: убить, выстоять, отстроить, найти, истребить.',
      scenarios: [
        {
          id: 'n1', name: 'Пробуждение',
          brief: 'Паладин Эрафии пришёл сжечь ваш склеп. Упокойте его — остальные разбегутся сами.',
          size: 'S', seed: 1201, faction: 'necropolis', hero: 'vidomina', foes: ['castle'], opponents: 1, difficulty: 'easy',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
        },
        {
          id: 'n2', name: 'Осада',
          brief: 'Эльфы Оплота пришли под стены. Продержитесь четыре недели — подойдут ваши легионы. Потеряете город — потеряете всё.',
          size: 'S', seed: 1202, faction: 'necropolis', hero: 'vidomina', foes: ['rampart'], opponents: 1, difficulty: 'normal',
          goals: { win: [{ type: 'survive', days: 28 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_town', of: 'mine' }] },
        },
        {
          id: 'n3', name: 'Кости и золото',
          brief: 'Мёртвым тоже нужна столица. Отстройте Капитолий за восемь недель — варвары и ящеры не дадут спокойно копить.',
          size: 'M', seed: 1203, faction: 'necropolis', hero: 'vidomina', foes: ['stronghold', 'fortress'], opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'build', building: 'hall_4' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 56 }] },
        },
        {
          id: 'n4', name: 'Корона лича',
          brief: 'В подземельях спрятан Шлем-череп — знак власти над мёртвыми. Достаньте его сами: без вас поход рассыплется в прах.',
          size: 'M', seed: 1204, faction: 'necropolis', hero: 'vidomina', foes: ['tower', 'dungeon'], opponents: 2, difficulty: 'hard',
          goals: { win: [{ type: 'find_artifact', art: 'skull_helmet' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
        },
        {
          id: 'n5', name: 'Живые против мёртвых',
          brief: 'Три королевства живых объединились против вас. Никаких сроков и условий: остаться должны только мёртвые.',
          size: 'L', seed: 1205, faction: 'necropolis', hero: 'vidomina', foes: ['castle', 'rampart', 'tower'], opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
        },
      ],
    },
  ];
  const BY_ID = Object.create(null);
  LIST.forEach(c => { BY_ID[c.id] = c; });

  H3.Campaign = { LIST, BY_ID, get: id => BY_ID[id] };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Campaign;
})(typeof window !== 'undefined' ? window : globalThis);
