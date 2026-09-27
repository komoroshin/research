/* ============================================================================
   data/campaign.js — кампании: цепочки сценариев с переносом героя.

   Кампания: { id, name, desc, faction, hero?, prologue, epilogue, scenarios }.
     faction — главная фракция (обложка, цвет карты кампании);
     hero — главный герой кампании, только для портрета на обложке
       (стартового героя задаёт поле hero сценария);
     prologue — завязка всей кампании (1–3 предложения), epilogue — чем всё кончилось.

   Сценарий = настройки генерации карты + цели + брифинг. Цели можно задавать
   шаблоном (`of: 'enemy'`) — конкретные id подставятся после генерации карты.
   carry — правила переноса ИЗ прошлого сценария В этот:
     { hero: false } — прошлый герой не приходит, начинаем с чистого;
     { army: 'none' | 'part' | 'full' } — армию набираешь заново / половина каждого отряда,
       не больше трёх / всё войско целиком;
     { arts: false } — артефакты, рюкзак и машины остались в прошлом;
     { levelCap: N } — уровень срезается до N.
   Умолчание, если поле не задано: герой, половина армии, артефакты.
   hero — стартовый герой игрока (id), foes — фракции противников по порядку
   (кого не хватило — случайные из оставшихся).
   sea — сколько на карте воды: 'wide' — море обязательно и вдоль двух краёв,
   'none' — без морской полосы (озёра по шуму остаются, но лодок и верфей нет),
   по умолчанию как в обычной партии: четверть карт без моря.
   story — { intro: [{ who, text }], outro: [...] }: реплики до карты и после победы;
     who — id героя из heroes.js (портрет и имя, можно вражеского) или 'narrator' (летописец).
   bonus — 2–3 награды на выбор перед стартом (виды — как у хижины провидца:
     gold, res, creatures, artifact, spell, primary, xp; плюс { kind: 'building', building } —
     постройка фракции сценария, ставится бесплатно в стартовом городе с недостающими требованиями).
   events — [{ day, who, text, give?, foe? }]: сюжетные события по дням (day ≥ 2);
     give — награда игроку, foe: { cid, n } — подкрепление первому противнику.
   Цели сверх старых: hero_level { level }, flag_mines { n }, army { cid, n },
   defeat_monster { cid, n } — «хозяин» карты, особый отряд вдали от игрока.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  const N = 'narrator';
  const say = (who, text) => ({ who, text });

  const LIST = [
    {
      id: 'erathia',
      name: 'Возвращение в Эрафию',
      desc: 'Пять сценариев: от родного удела до столицы врага. Герой переходит из карты в карту вместе с армией и артефактами.',
      faction: 'castle', hero: 'orrin',
      prologue: 'Рыцарь Оррин вернулся из заморского похода и не узнал Эрафию: её растащили по кускам соседи, и в каждом уделе теперь чужой хозяин.',
      epilogue: 'Над столицей снова знамёна Эрафии. Корону Оррин отдал тем, кто умеет её носить, а себе оставил клинок предков — на всякий случай.',
      scenarios: [
        {
          id: 'e1', name: 'Родной удел',
          brief: 'Соседний барон объявил ваши земли своими. Разберитесь с ним, пока не подтянулись его союзники.',
          size: 'S', seed: 1101, faction: 'castle', opponents: 1, difficulty: 'easy',
          goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Родной удел встречает Оррина чужим флагом над воротами. Соседний барон решил, что хозяин уже не вернётся.'),
              say('orrin', 'Кто поднял чужое знамя над моим домом, тот его и снимет. Сам — или его снимут вместе с ним.'),
            ],
            outro: [say('orrin', 'Удел снова наш. Барон перед смертью бормотал про союзников на севере — значит, это только начало.')],
          },
          bonus: [{ kind: 'creatures', cid: 'griffin', n: 5 }, { kind: 'artifact', art: 'equestrian_gloves' }, { kind: 'building', building: 'dwell_2' }],
          events: [
            { day: 3, who: N, text: 'Крестьяне прознали, что вернулся законный хозяин, и принесли что смогли.', give: { kind: 'gold', amount: 1500 } },
            { day: 10, who: N, text: 'Барон нанял степных наездников — последнее, на что хватило его казны.', foe: { cid: 'wolf_rider', n: 10 } },
          ],
        },
        {
          id: 'e2', name: 'Тесный проход',
          brief: 'Дорога на север перекрыта заставой. Возьмите вражеский город — и путь открыт. Держитесь: у вас на всё три недели. С прошлой карты дошла половина войска.',
          carry: { army: 'part' },
          size: 'S', seed: 1102, faction: 'castle', opponents: 1, difficulty: 'normal',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 21 }] },
          story: {
            intro: [
              say('orrin', 'Застава держит единственную дорогу на север. Через три недели перевал завалит снегом — и поход кончится, не начавшись.'),
              say('valeska', 'Я сходила на разведку. Их комендант трус — ударишь быстро, и ворота откроются сами.'),
            ],
            outro: [say('orrin', 'Застава наша, дорога открыта. Дальше пойдём по чужим землям — а чужие земли кормят плохо.')],
          },
          bonus: [{ kind: 'creatures', cid: 'marksman', n: 10 }, { kind: 'artifact', art: 'boots_speed' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 7, who: N, text: 'Лазутчик донёс: к заставе подошли наёмники-волчатники.', foe: { cid: 'wolf_raider', n: 12 } },
            { day: 14, who: 'valeska', text: 'На перевале уже метёт. У нас неделя, не больше.' },
          ],
        },
        {
          id: 'e3', name: 'Казна похода',
          brief: 'Войну кормит золото. Наберите казну — и армию можно будет собрать где угодно. С вами половина прежнего войска.',
          carry: { army: 'part' },
          size: 'M', seed: 1103, faction: 'castle', opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'gather', res: 'gold', amount: 60000 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('caitlin', 'Армии не воюют на молитвах. Дайте мне шахты и рынок — и я дам вам войско.'),
              say('orrin', 'Шестьдесят тысяч. Сколько бы ни стоила столица, заплатим сполна.'),
            ],
            outro: [say('caitlin', 'Казна полна. Теперь любой город продаст нам хоть грифонов, хоть совесть.')],
          },
          bonus: [{ kind: 'creatures', cid: 'monk', n: 6 }, { kind: 'artifact', art: 'necklace_swiftness' }, { kind: 'building', building: 'hall_2' }],
          events: [
            { day: 5, who: 'caitlin', text: 'Купцы из соседнего города дали в долг под честное слово рыцаря.', give: { kind: 'gold', amount: 3000 } },
            { day: 21, who: N, text: 'Соседи поняли, зачем вы копите золото, и собирают войско против казны.', foe: { cid: 'cyclops', n: 6 } },
          ],
        },
        {
          id: 'e4', name: 'Клинок предков',
          brief: 'В подземелья спускаются налегке: войско остаётся наверху, с вами только свита из местных. Найдите клинок и не потеряйте героя — без него поход кончится.',
          carry: { army: 'none' },
          size: 'M', seed: 1104, faction: 'castle', opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'find_artifact', art: 'titan_gladius' }, { type: 'kill_all' }],
            lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'Клинок основателя рода лежит там, куда не доходит солнце. В тесных ходах толпа только мешает.'),
              say('orrin', 'Прадед спустился сюда с сотней, а вернулся один — но с победой. Посмотрим, чем кончится у меня.'),
            ],
            outro: [say('orrin', 'Гладиус тяжелее, чем кажется. Ничего, рука привыкнет — как раз к столице.')],
          },
          bonus: [{ kind: 'creatures', cid: 'crusader', n: 8 }, { kind: 'spell', spell: 'stone_skin' }, { kind: 'res', res: 'gems', amount: 10 }],
          events: [
            { day: 4, who: N, text: 'В часовне у входа в подземелье ждали монахи. Они пойдут с вами.', give: { kind: 'creatures', cid: 'monk', n: 5 } },
            { day: 12, who: N, text: 'Из глубины поднялись минотавры-стражи и примкнули к врагу.', foe: { cid: 'minotaur', n: 8 } },
          ],
        },
        {
          id: 'e5', name: 'Столица',
          brief: 'Последний бой. Все города на карте должны стать вашими. Из похода с вами вернулась половина войска.',
          carry: { army: 'part' },
          size: 'L', seed: 1105, faction: 'castle', opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'capture_all_towns' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('orrin', 'Столица. Здесь всё началось, здесь и кончится. Каждый город на карте должен поднять наш флаг.'),
              say('adela', 'Эрафия помнит своих. Я благословлю каждого, кто пойдёт на штурм.'),
            ],
            outro: [say(N, 'Ворота столицы открылись изнутри: горожане сами сняли засов. Эрафия снова одна.')],
          },
          bonus: [{ kind: 'creatures', cid: 'angel', n: 2 }, { kind: 'artifact', art: 'armor_wonder' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 7, who: 'adela', text: 'Монастыри прислали добровольцев.', give: { kind: 'creatures', cid: 'zealot', n: 8 } },
            { day: 21, who: N, text: 'Враги поняли, что поодиночке не выстоять, и стягивают войска.', foe: { cid: 'cyclops_king', n: 8 } },
          ],
        },
      ],
    },
    {
      id: 'necro',
      name: 'Тень Некрополиса',
      desc: 'Пять сценариев за Некрополис: от одинокого паладина у ворот склепа до войны со всем живым. Каждый сценарий — своё условие: убить, выстоять, отстроить, найти, истребить.',
      faction: 'necropolis', hero: 'vidomina',
      prologue: 'Видомину похоронили заживо за то, что она слишком много знала о смерти. Через сто лет она решила поделиться знаниями.',
      epilogue: 'Живые королевства пали одно за другим. Видомина не празднует: мёртвым спешить некуда, впереди у них вечность.',
      scenarios: [
        {
          id: 'n1', name: 'Пробуждение',
          brief: 'Паладин Эрафии пришёл сжечь ваш склеп. Упокойте его — остальные разбегутся сами.',
          size: 'S', seed: 1201, faction: 'necropolis', hero: 'vidomina', foes: ['castle'], opponents: 1, difficulty: 'easy',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Паладин с факелом стоит у ворот склепа. Он пришёл сжечь то, что давно умерло.'),
              say('vidomina', 'Как мило. Он думает, огонь меня пугает. Встретим гостя — и оставим у себя навсегда.'),
            ],
            outro: [say('vidomina', 'Паладин встанет к утру. Не таким, как раньше, но встанет.')],
          },
          bonus: [{ kind: 'creatures', cid: 'skeleton', n: 20 }, { kind: 'spell', spell: 'death_ripple' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 4, who: N, text: 'На старом погосте что-то шевелится — у Видомины прибавилось слуг.', give: { kind: 'creatures', cid: 'walking_dead', n: 10 } },
            { day: 9, who: N, text: 'Орден прислал паладину крестоносцев.', foe: { cid: 'crusader', n: 6 } },
          ],
        },
        {
          id: 'n2', name: 'Осада',
          brief: 'Эльфы Оплота пришли под стены. Продержитесь четыре недели — подойдут ваши легионы. Потеряете город — потеряете всё. Вся ваша нежить успела отойти за стены.',
          carry: { army: 'full' },
          size: 'S', seed: 1202, faction: 'necropolis', hero: 'vidomina', foes: ['rampart'], opponents: 1, difficulty: 'normal',
          goals: { win: [{ type: 'survive', days: 28 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_town', of: 'mine' }] },
          story: {
            intro: [
              say('kyrre', 'Мы вырубим эту гниль под корень. Четыре недели — и от вашего склепа останутся одни кости.'),
              say('vidomina', 'Кости — это как раз моё. Спасибо за подарок.'),
            ],
            outro: [say('vidomina', 'Легионы подошли. Эльфы ушли в лес — те, кто успел уйти.')],
          },
          bonus: [{ kind: 'creatures', cid: 'wight', n: 8 }, { kind: 'artifact', art: 'shield_yawning_dead' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 8, who: N, text: 'Эльфы подтянули к стенам древних стражей леса.', foe: { cid: 'dendroid_soldier', n: 8 } },
            { day: 15, who: N, text: 'С кладбищ за рекой пробрались первые легионеры.', give: { kind: 'creatures', cid: 'zombie', n: 15 } },
          ],
        },
        {
          id: 'n3', name: 'Кости и золото',
          brief: 'Мёртвым тоже нужна столица. Отстройте Капитолий за восемь недель — варвары и ящеры не дадут спокойно копить. От осады уцелела половина легионов.',
          carry: { army: 'part' },
          size: 'M', seed: 1203, faction: 'necropolis', hero: 'vidomina', foes: ['stronghold', 'fortress'], opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'build', building: 'hall_4' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 56 }] },
          story: {
            intro: [
              say('vidomina', 'Мёртвые не едят и не спят, но казну им тоже подавай. Нужен Капитолий — и нужен быстро.'),
              say('crag_hack', 'Кости и золото? Кости оставь себе. Золото мы заберём.'),
            ],
            outro: [say('vidomina', 'Капитолий стоит. Теперь у мёртвых есть столица, а у живых — повод бояться.')],
          },
          bonus: [{ kind: 'creatures', cid: 'vampire', n: 6 }, { kind: 'artifact', art: 'rib_cage' }, { kind: 'gold', amount: 5000 }],
          events: [
            { day: 10, who: N, text: 'Старый некромант отдал вам свои сбережения — в обмен на обещание поднять его, когда придёт срок.', give: { kind: 'gold', amount: 3000 } },
            { day: 28, who: 'crag_hack', text: 'Огры-маги готовы. Идём ломать их стройку!', foe: { cid: 'ogre_mage', n: 8 } },
          ],
        },
        {
          id: 'n4', name: 'Корона лича',
          brief: 'За короной идут одни: свита остаётся наверху, реликвии сданы в склеп. Достаньте Шлем-череп сами — без вас поход рассыплется в прах.',
          carry: { army: 'none', arts: false },
          size: 'M', seed: 1204, faction: 'necropolis', hero: 'vidomina', foes: ['tower', 'dungeon'], opponents: 2, difficulty: 'hard',
          goals: { win: [{ type: 'find_artifact', art: 'skull_helmet' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'Шлем-череп носил первый лич. Он лежит в гробнице, куда даже нежить входит поодиночке.'),
              say('deemer', 'Корону лича ищут многие. Находят немногие. Возвращаются... ну, ты поняла.'),
            ],
            outro: [say('vidomina', 'Шлем холодный, как само время. Теперь меня слушаются даже чужие мертвецы.')],
          },
          bonus: [{ kind: 'creatures', cid: 'vampire_lord', n: 4 }, { kind: 'spell', spell: 'animate_dead' }, { kind: 'res', res: 'mercury', amount: 10 }],
          events: [
            { day: 5, who: N, text: 'Старые скелеты-стражи гробницы признали хозяйку.', give: { kind: 'creatures', cid: 'skeleton_warrior', n: 20 } },
            { day: 12, who: N, text: 'Маги Башни разбудили стражей-наг.', foe: { cid: 'naga', n: 4 } },
          ],
        },
        {
          id: 'n5', name: 'Живые против мёртвых',
          brief: 'Три королевства живых объединились против вас. Никаких сроков и условий: остаться должны только мёртвые. С вами половина легионов, поднятых в подземельях.',
          carry: { army: 'part' },
          size: 'L', seed: 1205, faction: 'necropolis', hero: 'vidomina', foes: ['castle', 'rampart', 'tower'], opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Эрафия, Оплот и Башня впервые за сто лет договорились. Договорились против вас.'),
              say('vidomina', 'Три королевства — три кладбища. Люблю, когда живые экономят мне время.'),
            ],
            outro: [say('vidomina', 'Тишина. Никто не кричит, никто не молится. Наконец-то порядок.')],
          },
          bonus: [{ kind: 'creatures', cid: 'bone_dragon', n: 3 }, { kind: 'artifact', art: 'cape_velocity' }, { kind: 'building', building: 'dwell_4' }],
          events: [
            { day: 7, who: N, text: 'Эрафия прислала архангелов. Живые любят крылатых.', foe: { cid: 'archangel', n: 2 } },
            { day: 14, who: N, text: 'Павшие в прошлых битвах поднялись и ищут хозяйку.', give: { kind: 'creatures', cid: 'black_knight', n: 3 } },
          ],
        },
      ],
    },
    {
      id: 'cove',
      name: 'Флаг над бухтой',
      desc: 'Пять сценариев за Бухту: от краденой стоянки до архипелага под одним флагом. Море на всех картах, и половина дороги идёт по воде.',
      faction: 'cove', hero: 'corkes',
      prologue: 'Коркес украл корабль, бухту и имя. Корабль и бухту ещё можно вернуть — имя уже прижилось.',
      epilogue: 'Над архипелагом один флаг — с костью и монетой. Коркес так и не выучил морской устав: он его написал.',
      scenarios: [
        {
          id: 'c1', name: 'Своя стоянка',
          brief: 'У вас один корабль и бухта, которую вы ни у кого не спрашивали. Береговой барон пришёл вешать — объясните ему, что бухта уже занята.',
          size: 'S', seed: 1301, faction: 'cove', hero: 'corkes', foes: ['castle'], opponents: 1, difficulty: 'easy', sea: 'wide',
          goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Береговой барон пришёл с виселицей и указом. Указ длинный, виселица короткая.'),
              say('corkes', 'Скажите барону, что бухта занята. Не поймёт — скажем громче, из пушек.'),
            ],
            outro: [say('corkes', 'Барон ушёл вплавь. Бухта наша, а виселицу пустим на дрова.')],
          },
          bonus: [{ kind: 'creatures', cid: 'pirate', n: 8 }, { kind: 'artifact', art: 'clover_fortune' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 3, who: N, text: 'К бухте прибило бочку рома и матросов при ней. Матросы решили остаться.', give: { kind: 'creatures', cid: 'crew_mate', n: 8 } },
            { day: 9, who: N, text: 'Барон выписал из столицы стрелков.', foe: { cid: 'marksman', n: 10 } },
          ],
        },
        {
          id: 'c2', name: 'Чужой порт',
          brief: 'Соседний капитан сдаёт вашу бухту за долю. Возьмите его порт, пока он не привёл покупателей: четыре недели — и вас тут не ждут. С прошлой стоянки ушла половина команды.',
          carry: { army: 'part' },
          size: 'S', seed: 1321, faction: 'cove', hero: 'corkes', foes: ['cove'], opponents: 1, difficulty: 'normal', sea: 'wide',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 28 }] },
          story: {
            intro: [
              say('corkes', 'Сосед продал нашу бухту за долю. Посмотрим, сколько он выручит за свой порт.'),
              say('illor', 'Ничего личного, Коркес. Море — это торговля.'),
            ],
            outro: [say('corkes', 'Порт наш. Продавец сбежал на шлюпке — пусть торгует с чайками.')],
          },
          bonus: [{ kind: 'creatures', cid: 'corsair', n: 6 }, { kind: 'artifact', art: 'necklace_swiftness' }, { kind: 'res', res: 'wood', amount: 15 }],
          events: [
            { day: 6, who: N, text: 'Портовые грузчики недовольны хозяином и шепчут, где слабые ворота.', give: { kind: 'gold', amount: 2000 } },
            { day: 14, who: 'illor', text: 'Морские ведьмы берут дорого, но отрабатывают.', foe: { cid: 'sea_witch', n: 6 } },
          ],
        },
        {
          id: 'c3', name: 'Доля команды',
          brief: 'Команда ходит за долей, а не за идею. Наберите казну и кристаллы на новые корабли — и вас будут слушать. С вами половина команды.',
          carry: { army: 'part' },
          size: 'M', seed: 1303, faction: 'cove', hero: 'corkes', foes: ['dungeon', 'tower'], opponents: 2, difficulty: 'normal', sea: 'wide',
          goals: { win: [{ type: 'gather', res: 'gold', amount: 50000 }, { type: 'gather', res: 'crystal', amount: 40 }],
            lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('corkes', 'Команда ходит за долей, а не за красивые глаза. Нужны золото и кристаллы на новые корабли.'),
              say('casmetra', 'Кристаллы есть у магов Башни и у тёмных из глубин. Вежливо спросить не выйдет.'),
            ],
            outro: [say('corkes', 'Трюмы полны. Теперь меня слушают даже те, кто раньше слушал только ветер.')],
          },
          bonus: [{ kind: 'creatures', cid: 'nix', n: 4 }, { kind: 'artifact', art: 'ring_vitality' }, { kind: 'res', res: 'crystal', amount: 10 }],
          events: [
            { day: 8, who: 'casmetra', text: 'Торговец с юга платит кристаллами за молчание о своём грузе. Я согласилась.', give: { kind: 'res', res: 'crystal', amount: 5 } },
            { day: 20, who: N, text: 'Тёмные прознали про ваши трюмы и спустили мантикор.', foe: { cid: 'manticore', n: 6 } },
          ],
        },
        {
          id: 'c4', name: 'Компас на дне',
          brief: 'Адмирал, что знал все проходы архипелага, лежит на дне затопленных гротов вместе со своим компасом. За ним идут налегке: команда и добыча остаются в бухте. Утонете — искать будет некому.',
          carry: { army: 'none', arts: false },
          size: 'M', seed: 1306, faction: 'cove', hero: 'corkes', foes: ['fortress', 'necropolis'], opponents: 2, difficulty: 'hard', sea: 'wide',
          goals: { win: [{ type: 'find_artifact', art: 'drowned_compass' }, { type: 'kill_all' }],
            lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'Адмирал утонул со всем флотом, а его компас до сих пор показывает туда, куда надо.'),
              say('corkes', 'Идём налегке. Утопленникам лишний груз ни к чему — а мы пока не утопленники.'),
            ],
            outro: [say('corkes', 'Стрелка дрожит и смотрит прямо на архипелаг. Похоже, адмирал хочет реванша — моими руками.')],
          },
          bonus: [{ kind: 'creatures', cid: 'seaman', n: 12 }, { kind: 'spell', spell: 'ice_bolt' }, { kind: 'gold', amount: 4000 }],
          events: [
            { day: 5, who: N, text: 'Смотритель маяка отдал карту гротов — неточную, но лучше, чем ничего.', give: { kind: 'xp', amount: 1500 } },
            { day: 12, who: N, text: 'Ящеры выпустили в гроты гидр.', foe: { cid: 'hydra', n: 3 } },
          ],
        },
        {
          id: 'c5', name: 'Флаг над архипелагом',
          brief: 'С компасом проходы знаете только вы. Три державы держат острова — заберите все города, чтобы над архипелагом остался один флаг. С вами половина команды.',
          carry: { army: 'part' },
          size: 'L', seed: 1305, faction: 'cove', hero: 'corkes', foes: ['castle', 'tower', 'fortress'], opponents: 3, difficulty: 'hard', sea: 'wide',
          goals: { win: [{ type: 'capture_all_towns' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('corkes', 'Три державы делят острова, как пирог. Пора им узнать, что пирог — мой.'),
              say('anabel', 'Я поведу второй корабль. С компасом пройдём там, где их флоты сядут на мель.'),
            ],
            outro: [say('corkes', 'Все порты подняли мой флаг. Надо придумать ему гимн — короткий и громкий.')],
          },
          bonus: [{ kind: 'creatures', cid: 'haspid', n: 2 }, { kind: 'artifact', art: 'cape_velocity' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 7, who: 'anabel', text: 'Контрабандисты с дальних островов привели свою команду.', give: { kind: 'creatures', cid: 'corsair', n: 10 } },
            { day: 21, who: N, text: 'Эрафия прислала на острова тяжёлую конницу.', foe: { cid: 'champion', n: 6 } },
          ],
        },
      ],
    },
    {
      id: 'inferno',
      name: 'Договор с пламенем',
      desc: 'Пять сценариев за Инферно: еретик Ксайрон исполняет договор, подписанный кровью. Шахты, охотники на демонов, архангелы у врат и легион, достойный Владыки.',
      faction: 'inferno', hero: 'xyron',
      prologue: 'Еретик Ксайрон подписал договор кровью: мир наверху в обмен на душу. Срок — пока горит свеча в его кабинете. Свеча уже зажжена.',
      epilogue: 'Договор исполнен, и Ксайрон наконец прочёл мелкий шрифт: душа отходит победителю. Победителем был он сам — и пламя это вполне устроило.',
      scenarios: [
        {
          id: 'i1', name: 'Разлом',
          brief: 'Разлом открыт, но огню нужно топливо. Возьмите под себя пять шахт — сера и ртуть сами потекут в пекло. Или просто сожгите всех, кто мешает.',
          size: 'S', seed: 1401, faction: 'inferno', hero: 'xyron', foes: ['castle'], opponents: 1, difficulty: 'easy', sea: 'none',
          goals: { win: [{ type: 'flag_mines', n: 5 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('xyron', 'Первый шаг по чужой траве — и она уже дымится. Мне нравится этот мир.'),
              say(N, 'Вокруг разлома — рудники Эрафии. Договор требует платы: огню нужно топливо.'),
            ],
            outro: [say('xyron', 'Шахты дымят, бесы довольны. Владыка прислал записку: «Неплохо для начала». Он не хвалит зря.')],
          },
          bonus: [{ kind: 'creatures', cid: 'hell_hound', n: 6 }, { kind: 'artifact', art: 'petrified_breastplate' }, { kind: 'res', res: 'mercury', amount: 8 }],
          events: [
            { day: 3, who: N, text: 'Из разлома выбрались бесы — договор держит слово.', give: { kind: 'creatures', cid: 'imp', n: 20 } },
            { day: 10, who: 'valeska', text: 'Мечники, к разлому! Эту дыру надо закрыть, пока из неё не полезло что похуже.', foe: { cid: 'swordsman', n: 8 } },
          ],
        },
        {
          id: 'i2', name: 'Охотник на демонов',
          brief: 'Эрафия прислала святой отряд охотиться на демонов. Одолейте его вожака — остальные разбегутся. Тянуть нельзя: через пять недель к нему подойдёт весь орден. С вами половина прежней свиты.',
          carry: { army: 'part' },
          size: 'S', seed: 1402, faction: 'inferno', hero: 'xyron', foes: ['castle'], opponents: 1, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 35 }] },
          story: {
            intro: [
              say('adela', 'Я знаю, что ты подписал, Ксайрон. Такие договоры рвут вместе с подписавшим.'),
              say('xyron', 'Святая женщина, а грозит, как бес. Сожгу её охотников — а там и до неё дойдёт.'),
            ],
            outro: [say('xyron', 'Святой отряд сгорел. Орден ещё не знает — пусть узнает от дыма.')],
          },
          bonus: [{ kind: 'creatures', cid: 'magog', n: 10 }, { kind: 'spell', spell: 'fireball' }, { kind: 'building', building: 'dwell_3' }],
          events: [
            { day: 6, who: N, text: 'Сельский староста принёс серу — лишь бы огонь обошёл его деревню.', give: { kind: 'res', res: 'sulfur', amount: 6 } },
            { day: 14, who: 'adela', text: 'Братья по вере, отряд ждёт вас!', foe: { cid: 'zealot', n: 8 } },
          ],
        },
        {
          id: 'i3', name: 'Врата монастыря',
          brief: 'Дорогу вглубь Эрафии стерегут три архангела у монастырских врат. Пока они стоят, огонь дальше не пройдёт. Сломайте их — или выжгите всех вокруг. С вами половина войска.',
          carry: { army: 'part' },
          size: 'M', seed: 1403, faction: 'inferno', hero: 'xyron', foes: ['castle', 'rampart'], opponents: 2, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'defeat_monster', cid: 'archangel', n: 3 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Над монастырём стоят три архангела. Они не спят, не едят и не торгуются.'),
              say('xyron', 'Всё, что не торгуется, горит. Проверим, горят ли перья.'),
            ],
            outro: [say('xyron', 'Врата открыты. Перья, как выяснилось, горят отлично — только пахнут хуже серы.')],
          },
          bonus: [{ kind: 'creatures', cid: 'efreet', n: 3 }, { kind: 'artifact', art: 'sword_hellfire' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 8, who: 'caitlin', text: 'Монастырь не падёт. Казна Эрафии оплатит каждого всадника в его защиту.', foe: { cid: 'cavalier', n: 5 } },
            { day: 15, who: N, text: 'Бесы нашли в развалинах часовни золото, забытое монахами.', give: { kind: 'gold', amount: 4000 } },
          ],
        },
        {
          id: 'i4', name: 'Легион',
          brief: 'Владыка требует армию, достойную договора: десять султанов ифритов в одном войске. Старые отряды ушли в пекло на переплавку — легион собирают заново. На всё двенадцать недель.',
          carry: { army: 'none' },
          size: 'M', seed: 1404, faction: 'inferno', hero: 'xyron', foes: ['tower', 'rampart'], opponents: 2, difficulty: 'hard', sea: 'none',
          goals: { win: [{ type: 'army', cid: 'efreet_sultan', n: 10 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 84 }] },
          story: {
            intro: [
              say('xyron', 'Султаны ифритов служат только тем, у кого есть Замок и терпение. Замок я построю. Терпения нет.'),
              say('solmyr', 'Маги Башни видят, что ты строишь, еретик. Закончить мы тебе не дадим.'),
            ],
            outro: [say('xyron', 'Десять султанов, и каждый смотрит на меня, как на ужин. Владыка доволен — значит, пора в последний поход.')],
          },
          bonus: [{ kind: 'creatures', cid: 'pit_fiend', n: 8 }, { kind: 'spell', spell: 'inferno' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 7, who: N, text: 'Из разлома пришли первые ифриты — пока не султаны, но пылают исправно.', give: { kind: 'creatures', cid: 'efreet', n: 2 } },
            { day: 28, who: 'solmyr', text: 'Титаны проснулись. Посмотрим, как горит камень.', foe: { cid: 'titan', n: 2 } },
            { day: 56, who: N, text: 'Свеча в кабинете Ксайрона оплыла наполовину.' },
          ],
        },
        {
          id: 'i5', name: 'Последняя свеча',
          brief: 'Три королевства встали стеной между огнём и миром. Все города на карте должны стать вашими. Падёт Ксайрон — сгорит и договор. С вами половина легиона.',
          carry: { army: 'part' },
          size: 'L', seed: 1405, faction: 'inferno', hero: 'xyron', foes: ['castle', 'tower', 'rampart'], opponents: 3, difficulty: 'hard', sea: 'none',
          goals: { win: [{ type: 'capture_all_towns' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'Свеча оплыла почти до конца. Эрафия, Башня и Оплот собрали всё, что у них было.'),
              say('xyron', 'Прекрасно. Все враги в одном месте — экономия на дороге.'),
            ],
            outro: [say('xyron', 'Последний город сдался, свеча догорела. Владыка протянул руку за моей душой — и обжёгся.')],
          },
          bonus: [{ kind: 'creatures', cid: 'arch_devil', n: 2 }, { kind: 'artifact', art: 'boots_polarity' }, { kind: 'gold', amount: 10000 }],
          events: [
            { day: 7, who: 'adela', text: 'Небеса услышали Эрафию. Архангелы, ко мне!', foe: { cid: 'archangel', n: 2 } },
            { day: 21, who: N, text: 'Бесы принесли из пекла подарок Владыки. Жест щедрый — и подозрительный.', give: { kind: 'primary', stat: 'pow', value: 2 } },
          ],
        },
      ],
    },
    {
      id: 'dungeon',
      name: 'Интриги глубин',
      desc: 'Пять сценариев за Подземелье: изгнанный повелитель Шакти возвращается в Совет. Тоннели, драконье гнездо, шахты Совета и трон, который охраняет предатель.',
      faction: 'dungeon', hero: 'shakti',
      prologue: 'Совет Подземелья изгнал Шакти за то, что он победил слишком громко. Чернокнижник Димер занял его место и зря думает, что изгнанники не возвращаются.',
      epilogue: 'Совет собрался вновь — в полном составе, кроме Димера. Шакти сел во главе стола и первым делом велел укоротить стол.',
      scenarios: [
        {
          id: 'd1', name: 'Изгнанник',
          brief: 'Шакти изгнали без войска и без имени. Имя возвращают делом: поднимите героя до пятого уровня — или вычистите тоннели от всех, кто в них живёт.',
          size: 'S', seed: 1501, faction: 'dungeon', hero: 'shakti', foes: ['fortress'], opponents: 1, difficulty: 'easy', sea: 'none',
          goals: { win: [{ type: 'hero_level', level: 5 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'В тоннеле для неудачников Шакти ждала горстка троглодитов. Они тоже были неудачниками.'),
              say('shakti', 'Совет забыл, кто выиграл им последнюю войну. Напомню. Громко.'),
            ],
            outro: [say('shakti', 'Тоннели мои, троглодиты зовут меня вождём. Для начала неплохо.')],
          },
          bonus: [{ kind: 'creatures', cid: 'infernal_troglodyte', n: 15 }, { kind: 'artifact', art: 'centaur_axe' }, { kind: 'building', building: 'dwell_2' }],
          events: [
            { day: 4, who: N, text: 'Ещё два десятка изгнанников услышали, что в тоннеле объявился вожак.', give: { kind: 'creatures', cid: 'troglodyte', n: 20 } },
            { day: 10, who: 'tazar', text: 'Ящеры не пустят чужаков в свои болота. Даже подземных.', foe: { cid: 'lizard_warrior', n: 12 } },
          ],
        },
        {
          id: 'd2', name: 'Шёпот в тоннелях',
          brief: 'Димер посадил в город у выхода из тоннелей своего ставленника. Возьмите город за четыре недели, пока его не укрепили. С вами половина отряда.',
          carry: { army: 'part' },
          size: 'S', seed: 1502, faction: 'dungeon', hero: 'shakti', foes: ['dungeon'], opponents: 1, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 28 }] },
          story: {
            intro: [
              say('deemer', 'Шакти жив? Досадно. Передайте ему, что город у выхода из тоннелей — мой. Навсегда.'),
              say('shakti', 'Навсегда — это до четверга. Собирайтесь.'),
            ],
            outro: [say('shakti', 'Город наш. Ставленник сбежал к Димеру с донесением — пусть несёт. Мне и нужно, чтобы в Совете знали.')],
          },
          bonus: [{ kind: 'creatures', cid: 'harpy_hag', n: 10 }, { kind: 'artifact', art: 'necklace_swiftness' }, { kind: 'res', res: 'sulfur', amount: 8 }],
          events: [
            { day: 5, who: N, text: 'Медузы из соседней пещеры предложили услуги — за будущую долю.', give: { kind: 'creatures', cid: 'medusa', n: 5 } },
            { day: 14, who: 'deemer', text: 'Держи минотавров. И не смей проиграть.', foe: { cid: 'minotaur_king', n: 5 } },
          ],
        },
        {
          id: 'd3', name: 'Драконье гнездо',
          brief: 'Закон Совета: кто одолеет чёрных драконов глубин, тот и говорит в Совете первым. Четыре дракона ждут в гнезде. Победите их — или всех, кто придёт за ними. С вами половина войска.',
          carry: { army: 'part' },
          size: 'M', seed: 1503, faction: 'dungeon', hero: 'shakti', foes: ['stronghold', 'fortress'], opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'defeat_monster', cid: 'black_dragon', n: 4 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Гнездо в сердце глубин. Четыре чёрных дракона — старше Совета и злее его.'),
              say('shakti', 'Закон древний, но понятный. Побил дракона — говоришь. Не побил — становишься обедом.'),
            ],
            outro: [say('shakti', 'Драконы пали. Закон есть закон: теперь Совет обязан меня выслушать. Или хотя бы сделать вид.')],
          },
          bonus: [{ kind: 'creatures', cid: 'scorpicore', n: 4 }, { kind: 'artifact', art: 'ogre_targ' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 7, who: 'crag_hack', text: 'Драконья чешуя хорошо продаётся. Парни, в гнездо — вперёд подземных!', foe: { cid: 'cyclops', n: 6 } },
            { day: 16, who: N, text: 'Бехолдеры видели гнездо и показали тропу в обход засад.', give: { kind: 'xp', amount: 2000 } },
          ],
        },
        {
          id: 'd4', name: 'Золото Совета',
          brief: 'Совет держится на шахтах. Заберите себе дюжину — и Совет будет держаться на вас. Димер это понимает и бросит против вас всех. На всё десять недель, прежнее войско — наполовину.',
          carry: { army: 'part' },
          size: 'M', seed: 1504, faction: 'dungeon', hero: 'shakti', foes: ['dungeon', 'tower'], opponents: 2, difficulty: 'hard',
          goals: { win: [{ type: 'flag_mines', n: 12 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 70 }] },
          story: {
            intro: [
              say('deemer', 'Ты убил драконов, но Совет голосует золотом. А золото — у меня.'),
              say('shakti', 'Золото лежит в шахтах. Шахты стоят на земле. Землю я забирать умею.'),
            ],
            outro: [say('alamar', 'Двенадцать шахт — и половина Совета уже пишет тебе письма, Шакти. Вторая половина пишет завещания.')],
          },
          bonus: [{ kind: 'creatures', cid: 'evil_eye', n: 12 }, { kind: 'artifact', art: 'boots_speed' }, { kind: 'res', res: 'ore', amount: 20 }],
          events: [
            { day: 10, who: 'alamar', text: 'Я долго выбирал, чью сторону занять. Держи — в знак будущей дружбы.', give: { kind: 'spell', spell: 'resurrection' } },
            { day: 30, who: 'deemer', text: 'Откройте клетки. Пусть красные драконы разберутся с выскочкой.', foe: { cid: 'red_dragon', n: 2 } },
          ],
        },
        {
          id: 'd5', name: 'Трон глубин',
          brief: 'Димер позвал на помощь наземных — в глубинах за такое казнят. Возьмите его город, где заседает Совет, или сотрите с карты всех. Падёт Шакти — падёт и мятеж. С вами половина войска.',
          carry: { army: 'part' },
          size: 'L', seed: 1505, faction: 'dungeon', hero: 'shakti', foes: ['dungeon', 'castle', 'rampart'], opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'Над залом Совета висит знамя Эрафии. Такого в глубинах не видели тысячу лет.'),
              say('deemer', 'Союзники нужны тем, кто умеет считать. Ты, Шакти, умеешь только бить.'),
              say('shakti', 'Тогда посчитай, сколько тебе осталось.'),
            ],
            outro: [say('shakti', 'Трон холодный и неудобный. Самое место для того, кто не собирается на нём засиживаться.')],
          },
          bonus: [{ kind: 'creatures', cid: 'red_dragon', n: 2 }, { kind: 'artifact', art: 'pendant_courage' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 7, who: 'deemer', text: 'Тюрьмы открыты. Королевы медуз теперь служат мне.', foe: { cid: 'medusa_queen', n: 10 } },
            { day: 20, who: 'gunnar', text: 'Повелители устали от Димера. Мы с тобой, Шакти.', give: { kind: 'creatures', cid: 'minotaur_king', n: 8 } },
          ],
        },
      ],
    },
    {
      id: 'alliance',
      name: 'Клятва леса и башни',
      desc: 'Пять сценариев за Оплот и Башню по очереди: эльф Ивор и волшебник Солмир выжигают гниль, что ползёт из мёртвых земель. Герой меняется вместе с фракцией.',
      faction: 'rampart', hero: 'ivor',
      prologue: 'Мёртвая гниль ползёт по лесам Оплота, а маги Башни знают, откуда она. Эльф и волшебник принесли клятву: стоять друг за друга, пока гниль не выжжена.',
      epilogue: 'Лес снова шумит, а на шпиле Башни горит зелёный огонь в честь союза. Клятву сдержали оба — и никто не напомнил другому, что сомневался.',
      scenarios: [
        {
          id: 'a1', name: 'Пограничная роща',
          brief: 'В пограничную рощу пришла нежить и поднимает павших. Найдите того, кто её ведёт, и упокойте — или выжгите всю нежить в округе.',
          size: 'S', seed: 1601, faction: 'rampart', hero: 'ivor', foes: ['necropolis'], opponents: 1, difficulty: 'easy', sea: 'none',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Листья в пограничной роще почернели за одну ночь.'),
              say(N, 'Вожак нежити оставил на дубе надпись: «Лес — это кладбище, которое ещё не знает об этом».'),
              say('ivor', 'Лесной эльф не промахивается дважды. А по тебе не промахнусь и в первый раз.'),
            ],
            outro: [say('ivor', 'Их вожак ушёл в землю, но гниль шла не от него. Солмир из Башни писал, что знает источник. Пусть теперь маги поработают.')],
          },
          bonus: [{ kind: 'creatures', cid: 'wood_elf', n: 10 }, { kind: 'artifact', art: 'clover_fortune' }, { kind: 'building', building: 'dwell_3' }],
          events: [
            { day: 3, who: N, text: 'Кентавры с опушки пришли на зов рога.', give: { kind: 'creatures', cid: 'centaur', n: 8 } },
            { day: 9, who: N, text: 'Из болота поднялись привидения.', foe: { cid: 'wight', n: 10 } },
          ],
        },
        {
          id: 'a2', name: 'Башня в метель',
          brief: 'Ивор остался беречь рощу, в деле Солмир. Нежить окружила Башню — продержитесь три недели до оттепели. Сдадите город — сдадите союз.',
          carry: { hero: false },
          size: 'S', seed: 1602, faction: 'tower', hero: 'solmyr', foes: ['necropolis'], opponents: 1, difficulty: 'normal',
          goals: { win: [{ type: 'survive', days: 21 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_town', of: 'mine' }] },
          story: {
            intro: [
              say('solmyr', 'Три недели метели и мертвецы у стен. Хорошо, что молния зимой бьёт не хуже.'),
              say('isra', 'Башни падают, волшебник. Даже самые высокие.'),
            ],
            outro: [say('solmyr', 'Оттепель — мертвецы увязли в талом снегу. Пишу Ивору: гниль идёт из-под старого кургана.')],
          },
          bonus: [{ kind: 'creatures', cid: 'iron_golem', n: 8 }, { kind: 'artifact', art: 'magi_crown' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 7, who: 'isra', text: 'Метель — лучшее время для вампиров. Вперёд.', foe: { cid: 'vampire', n: 8 } },
            { day: 14, who: 'neela', text: 'Держись, Солмир! Мои алхимики прислали горгулий — всех, что успели оживить.', give: { kind: 'creatures', cid: 'stone_gargoyle', n: 12 } },
          ],
        },
        {
          id: 'a3', name: 'Курган',
          brief: 'Снова Ивор, Солмир вернулся к себе. Печать на кургане держал шлем единорога — его украли. Верните шлем. Погибнет Ивор — лес не услышит клятву.',
          carry: { hero: false },
          size: 'M', seed: 1603, faction: 'rampart', hero: 'ivor', foes: ['necropolis', 'dungeon'], opponents: 2, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'find_artifact', art: 'unicorn_helm' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say('mephala', 'Шлем алебастрового единорога держал печать кургана веками. Кто-то его унёс.'),
              say('ivor', 'Значит, вернём. И спросим вора, зачем он ему, — не спеша и с пристрастием.'),
            ],
            outro: [say('ivor', 'Шлем на месте, печать держит. Но вор был не мертвецом: следы уходят в глубины, под Башню.')],
          },
          bonus: [{ kind: 'creatures', cid: 'dendroid_guard', n: 5 }, { kind: 'spell', spell: 'bless' }, { kind: 'res', res: 'crystal', amount: 10 }],
          events: [
            { day: 6, who: N, text: 'Единороги почуяли, что шлем ищут, и вышли из чащи.', give: { kind: 'creatures', cid: 'unicorn', n: 2 } },
            { day: 15, who: N, text: 'Над курганом поднялись личи.', foe: { cid: 'lich', n: 8 } },
          ],
        },
        {
          id: 'a4', name: 'Под Башней',
          brief: 'Чернокнижники и некроманты подняли в пещерах под Башней шесть призрачных драконов. Уничтожьте стаю, пока она не взлетела. Солмир снова в деле, Ивор ведёт эльфов своей тропой.',
          carry: { hero: false },
          size: 'M', seed: 1604, faction: 'tower', hero: 'solmyr', foes: ['dungeon', 'necropolis'], opponents: 2, difficulty: 'hard',
          goals: { win: [{ type: 'defeat_monster', cid: 'ghost_dragon', n: 6 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('solmyr', 'Шесть драконов, мёртвых и злых. Хорошая новость — молнию они не любят. Плохая — любить её им и не нужно.'),
              say('deemer', 'Башня стоит на наших пещерах. Мы просто забираем своё.'),
            ],
            outro: [say('solmyr', 'Стая рассыпалась прахом. Остался корень — их общая цитадель в мёртвых землях.')],
          },
          bonus: [{ kind: 'creatures', cid: 'master_genie', n: 6 }, { kind: 'spell', spell: 'destroy_undead' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 8, who: 'deemer', text: 'Медузы, к Башне. Камень к камню.', foe: { cid: 'medusa_queen', n: 8 } },
            { day: 18, who: 'ivor', text: 'Эльфы держат лесную тропу. Вот тебе лучники, Солмир, — клятва есть клятва.', give: { kind: 'creatures', cid: 'grand_elf', n: 12 } },
          ],
        },
        {
          id: 'a5', name: 'Мёртвая цитадель',
          brief: 'Корень гнили — цитадель, где некроманты и чернокнижники сговорились с Инферно. Возьмите её — или добейте всех союзников тьмы. Войско ведёт Ивор, Солмир при нём.',
          carry: { hero: false },
          size: 'L', seed: 1605, faction: 'rampart', hero: 'ivor', foes: ['necropolis', 'dungeon', 'inferno'], opponents: 3, difficulty: 'hard', sea: 'none',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say(N, 'Цитадель стоит на выжженной земле. Над ней кружат гарпии, под ней горит Инферно.'),
              say('ivor', 'Клятву давали двое. Исполнять её идут тысячи.'),
              say('solmyr', 'Я прикрою магией. Постарайся не стрелять мне в спину, эльф.'),
            ],
            outro: [say('ivor', 'Цитадель пала. Лес шумит, Башня светится, и никто уже не помнит, что эльфы и маги когда-то не здоровались.')],
          },
          bonus: [{ kind: 'creatures', cid: 'war_unicorn', n: 4 }, { kind: 'artifact', art: 'pendant_courage' }, { kind: 'gold', amount: 8000 }],
          events: [
            { day: 5, who: 'solmyr', text: 'Башня прислала титана. Одного — зато какого.', give: { kind: 'creatures', cid: 'titan', n: 1 } },
            { day: 20, who: 'thant', text: 'Цитадель не падёт. Встаньте, драконы!', foe: { cid: 'ghost_dragon', n: 2 } },
          ],
        },
      ],
    },
    {
      id: 'wildlands',
      name: 'Степь и топь',
      desc: 'Пять сценариев за Цитадель и Крепость по очереди: варвары Крэг Хака и ящеры Тазара против эрафийского тракта и магов Башни. Герой меняется вместе с фракцией.',
      faction: 'stronghold', hero: 'crag_hack',
      prologue: 'Эрафия прокладывает тракт через степь и болота: рыцарям нужны пастбища, магам — торф и ртуть. Варвары и ящеры никогда не дружили. Придётся начать.',
      epilogue: 'Тракт зарос ковылём и осокой. Крэг Хак и Тазар так и не подружились — зато стали соседями, которые вместе бьют чужих.',
      scenarios: [
        {
          id: 'w1', name: 'Набег',
          brief: 'Рыцари Эрафии поставили заставу на кочевой тропе. Соберите орду — двадцать пять орков в одном войске — или сметите заставу прямо сейчас.',
          size: 'S', seed: 1701, faction: 'stronghold', hero: 'crag_hack', foes: ['castle'], opponents: 1, difficulty: 'easy', sea: 'none',
          goals: { win: [{ type: 'army', cid: 'orc', n: 25 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('crag_hack', 'Рыцари говорят, степь теперь их. Степь смеётся. Я тоже.'),
              say('orrin', 'Варвары понимают только силу. Покажем им силу — пусть понимают быстрее.'),
            ],
            outro: [say('crag_hack', 'Застава горит, орда ревёт. Слышал, у болот тоже появились рыцари. Ящерам не завидую.')],
          },
          bonus: [{ kind: 'creatures', cid: 'wolf_rider', n: 10 }, { kind: 'artifact', art: 'gnoll_flail' }, { kind: 'building', building: 'dwell_3' }],
          events: [
            { day: 4, who: N, text: 'Слух о набеге прошёл по степи: гоблины из дальних кочевий пришли сами.', give: { kind: 'creatures', cid: 'goblin', n: 25 } },
            { day: 11, who: 'orrin', text: 'Кавалерия, на заставу! Покажем дикарям, что такое строй.', foe: { cid: 'cavalier', n: 4 } },
          ],
        },
        {
          id: 'w2', name: 'Топь не отдаёт',
          brief: 'Крэг Хак остался в степи, болота держит Тазар. Рыцари поставили крепость на краю топи — возьмите её за четыре недели, пока болото не замостили гатью.',
          carry: { hero: false },
          size: 'S', seed: 1702, faction: 'fortress', hero: 'tazar', foes: ['castle'], opponents: 1, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'capture_town', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 28 }] },
          story: {
            intro: [
              say('tazar', 'Рыцари строят гати. Болото терпеливое: подождёт, пока они зайдут поглубже.'),
              say('mirlanda', 'Я прокляну их кузницы. Ты возьми ворота.'),
            ],
            outro: [say('tazar', 'Крепость наша, гать утонула. Варвары прислали гонца, зовут в союз. Воняют, но дерутся хорошо.')],
          },
          bonus: [{ kind: 'creatures', cid: 'gnoll_marauder', n: 15 }, { kind: 'spell', spell: 'slow' }, { kind: 'building', building: 'dwell_2' }],
          events: [
            { day: 5, who: N, text: 'Змии с дальних топей слетелись на шум битвы.', give: { kind: 'creatures', cid: 'serpent_fly', n: 8 } },
            { day: 13, who: N, text: 'Крестоносцы пришли укрепить гарнизон.', foe: { cid: 'crusader', n: 8 } },
          ],
        },
        {
          id: 'w3', name: 'Генерал Эрафии',
          brief: 'Эрафия прислала генерала с приказом стереть степь и топь с карт. Сломайте генерала — остальные повернут назад. Орду снова ведёт Крэг Хак, ящеры держат фланг.',
          carry: { hero: false },
          size: 'M', seed: 1703, faction: 'stronghold', hero: 'crag_hack', foes: ['castle', 'tower'], opponents: 2, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('valeska', 'Варвары и ящеры вместе? Тем лучше — один поход вместо двух.'),
              say('crag_hack', 'Она считает нас вместе. Правильно считает: вместе нас больше.'),
            ],
            outro: [say('crag_hack', 'Генерал лежит в ковыле. Маги Башни прислали кого-то своего — значит, дальше будет магия. Ненавижу магию.')],
          },
          bonus: [{ kind: 'creatures', cid: 'ogre', n: 8 }, { kind: 'artifact', art: 'ogre_targ' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 7, who: 'tazar', text: 'Держи, степняк. Мои василиски присмотрят за твоим флангом.', give: { kind: 'creatures', cid: 'basilisk', n: 5 } },
            { day: 18, who: 'valeska', text: 'Чемпионы, к генералу!', foe: { cid: 'champion', n: 5 } },
          ],
        },
        {
          id: 'w4', name: 'Гидры хаоса',
          brief: 'Маги Башни разбудили в топях шесть гидр хаоса и натравили на деревни ящеров. Ведьма Мирланда знает, как их убить. Десять недель — потом гидры расползутся по всем болотам.',
          carry: { hero: false },
          size: 'M', seed: 1704, faction: 'fortress', hero: 'mirlanda', foes: ['tower', 'castle'], opponents: 2, difficulty: 'hard', sea: 'none',
          goals: { win: [{ type: 'defeat_monster', cid: 'chaos_hydra', n: 6 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 70 }] },
          story: {
            intro: [
              say('mirlanda', 'Гидре рубят голову — вырастают две. Значит, рубить надо быстрее, чем они растут.'),
              say('halon', 'Мы лишь приоткрыли дверь. Гидры сами решили выйти погулять.'),
            ],
            outro: [say('mirlanda', 'Топь снова тихая, гидры на дне, маги в бегах. Осталось вернуть степь степи.')],
          },
          bonus: [{ kind: 'creatures', cid: 'wyvern_monarch', n: 4 }, { kind: 'spell', spell: 'prayer' }, { kind: 'gold', amount: 6000 }],
          events: [
            { day: 6, who: N, text: 'Гнолльи вожди привели свои стаи — мстить за сожжённые деревни.', give: { kind: 'creatures', cid: 'gnoll', n: 30 } },
            { day: 20, who: 'halon', text: 'Архимаги, в топь. Посмотрим, что ведьма противопоставит науке.', foe: { cid: 'arch_mage', n: 10 } },
          ],
        },
        {
          id: 'w5', name: 'Вольная степь',
          brief: 'Эрафия и Башня собрали последний поход. Степи нужна столица, чтобы было что защищать: поставьте Капитолий за двенадцать недель. Или прогоните всех — тоже ответ. Орду ведёт Крэг Хак.',
          carry: { hero: false },
          size: 'L', seed: 1705, faction: 'stronghold', hero: 'crag_hack', foes: ['castle', 'tower', 'conflux'], opponents: 3, difficulty: 'hard', sea: 'none',
          goals: { win: [{ type: 'build', building: 'hall_4' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 84 }] },
          story: {
            intro: [
              say('crag_hack', 'Столица? У варваров? Ладно. Но стены будут из черепов.'),
              say('tazar', 'Ящеры привезут камень. Черепа добывай сам.'),
            ],
            outro: [say('crag_hack', 'Капитолий стоит, стены каменные — Тазар настоял. Черепа сложили у ворот. Для красоты.')],
          },
          bonus: [{ kind: 'creatures', cid: 'behemoth', n: 2 }, { kind: 'artifact', art: 'ogre_club' }, { kind: 'building', building: 'hall_2' }],
          events: [
            { day: 7, who: N, text: 'Эрафия отправила в степь ангелов.', foe: { cid: 'angel', n: 3 } },
            { day: 28, who: 'gundula', text: 'Шаманы собрали дань со всех кочевий. На стройку, вождь!', give: { kind: 'gold', amount: 6000 } },
          ],
        },
      ],
    },
    {
      id: 'conflux',
      name: 'Сопряжение',
      desc: 'Пять сценариев за Сопряжение: элементалистка Игнисса чинит мир, у которого подпилили все четыре стихии. Ртуть, прилив, безумные фениксы, испытание огнём и последняя битва планов.',
      faction: 'conflux', hero: 'ignissa',
      prologue: 'Четыре стихии держат мир, как ножки стола. Кто-то подпилил все четыре. Игнисса, дитя огня, пошла выяснять — кто и зачем.',
      epilogue: 'Планы снова в равновесии, стихии спорят только между собой. Игнисса вернулась в огонь, но теперь каждый костёр в мире знает её имя.',
      scenarios: [
        {
          id: 'x1', name: 'Ртутный ключ',
          brief: 'Сопряжение держится на ртути — это кровь стихий, а черти Инферно пьют её вёдрами. Наберите тридцать мер, чтобы запечатать огненный разлом, или выгоните чертей.',
          size: 'S', seed: 1801, faction: 'conflux', hero: 'ignissa', foes: ['inferno'], opponents: 1, difficulty: 'easy', sea: 'none',
          goals: { win: [{ type: 'gather', res: 'mercury', amount: 30 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('ignissa', 'Огонь — мой брат. Но этот огонь чужой: он не греет, он жрёт.'),
              say('ash', 'Ртуть, сера, души — берём всё, что плохо лежит. Сопряжение лежит плохо.'),
            ],
            outro: [say('ignissa', 'Разлом запечатан ртутью и терпением. Но огонь был не один: вода тоже поднимается.')],
          },
          bonus: [{ kind: 'creatures', cid: 'fire_elemental', n: 5 }, { kind: 'artifact', art: 'ring_conjuring' }, { kind: 'res', res: 'mercury', amount: 8 }],
          events: [
            { day: 3, who: N, text: 'Феи заметили, что в Сопряжении снова хозяйка, и прилетели роем.', give: { kind: 'creatures', cid: 'pixie', n: 20 } },
            { day: 9, who: 'ash', text: 'Спускаю гончих. Пусть принесут мне эту девчонку.', foe: { cid: 'hell_hound', n: 10 } },
          ],
        },
        {
          id: 'x2', name: 'Прилив',
          brief: 'Водный план вышел из берегов, и пираты плывут на его волне прямо к вашему городу. Продержитесь три недели — вода отступит. Город сдавать нельзя. С вами половина войска.',
          carry: { army: 'part' },
          size: 'S', seed: 1802, faction: 'conflux', hero: 'ignissa', foes: ['cove'], opponents: 1, difficulty: 'normal', sea: 'wide',
          goals: { win: [{ type: 'survive', days: 21 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_town', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'Море поднялось на три локтя за ночь. На гребне волны — чёрные паруса.'),
              say('casmetra', 'Прилив — лучшее время для грабежа. Волна сама несёт добычу к борту.'),
            ],
            outro: [say('ignissa', 'Вода ушла, пираты сидят на мели. Но водный план открыли нарочно. Пора найти того, кто это сделал.')],
          },
          bonus: [{ kind: 'creatures', cid: 'ice_elemental', n: 8 }, { kind: 'spell', spell: 'air_shield' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 6, who: 'casmetra', text: 'Никсы, на берег!', foe: { cid: 'nix_warrior', n: 5 } },
            { day: 12, who: 'erdamon', text: 'Ветер на нашей стороне, Игнисса. Лови подмогу!', give: { kind: 'creatures', cid: 'storm_elemental', n: 10 } },
          ],
        },
        {
          id: 'x3', name: 'Безумные фениксы',
          brief: 'Чернокнижники глубин поймали фениксов и свели их с ума: шесть огненных птиц жгут всё, что видят. Одолейте их — или тех, кто их натравил. С вами половина войска.',
          carry: { army: 'part' },
          size: 'M', seed: 1803, faction: 'conflux', hero: 'ignissa', foes: ['dungeon', 'necropolis'], opponents: 2, difficulty: 'normal',
          goals: { win: [{ type: 'defeat_monster', cid: 'phoenix', n: 6 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('ignissa', 'Фениксы — мои родичи. Мне будет больно. Им — больнее.'),
              say('alamar', 'Птица, что восстаёт из пепла, — идеальный источник силы. Жаль, характер портится.'),
            ],
            outro: [say('ignissa', 'Фениксы сгорели и возродились — уже в своём уме. Один назвал заказчиков: мёртвые и тёмные, заодно.')],
          },
          bonus: [{ kind: 'creatures', cid: 'energy_elemental', n: 5 }, { kind: 'artifact', art: 'cape_conjuring' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 8, who: 'thunar', text: 'Земля помнит свой долг. Мои элементали — твои.', give: { kind: 'creatures', cid: 'earth_elemental', n: 4 } },
            { day: 16, who: 'alamar', text: 'Медузы, окаменить её свиту.', foe: { cid: 'medusa', n: 12 } },
          ],
        },
        {
          id: 'x4', name: 'Испытание огнём',
          brief: 'Сшить планы может только мастер: поднимите Игниссу до 14-го уровня. Испытание срезает всё выше десятого, свита ждёт на заставах. Десять недель, пока план не рассыпался.',
          carry: { army: 'none', levelCap: 10 },
          size: 'M', seed: 1804, faction: 'conflux', hero: 'ignissa', foes: ['necropolis', 'dungeon'], opponents: 2, difficulty: 'hard',
          goals: { win: [{ type: 'hero_level', level: 14 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 70 }] },
          story: {
            intro: [
              say('erdamon', 'Испытание простое: огонь забирает лишнее и оставляет суть. Если суть есть.'),
              say('ignissa', 'Не было бы сути — я бы давно погасла.'),
            ],
            outro: [say('erdamon', 'Мастер стихий. Теперь можно идти туда, где мёртвые и тёмные перекраивают планы по своим выкройкам.')],
          },
          bonus: [{ kind: 'creatures', cid: 'magic_elemental', n: 3 }, { kind: 'spell', spell: 'meteor_shower' }, { kind: 'building', building: 'guild_2' }],
          events: [
            { day: 10, who: N, text: 'Спрайты привели к Игниссе учеников с заставы: те спорят о стихиях до утра, и она учится вместе с ними.', give: { kind: 'xp', amount: 2500 } },
            { day: 30, who: N, text: 'Некрополис прислал рыцарей смерти.', foe: { cid: 'dread_knight', n: 6 } },
          ],
        },
        {
          id: 'x5', name: 'Сердце планов',
          brief: 'Мёртвые, тёмные и огненные перекраивают планы под себя. Сопряжение должно остаться ничьим — значит, их на карте быть не должно. Падёт Игнисса — стихии никто не соберёт. С вами половина войска.',
          carry: { army: 'part' },
          size: 'L', seed: 1805, faction: 'conflux', hero: 'ignissa', foes: ['necropolis', 'dungeon', 'inferno'], opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say(N, 'В сердце Сопряжения сходятся все четыре плана. Сегодня там сходятся и все враги.'),
              say('ignissa', 'Огонь, вода, земля и воздух. И я. Посмотрим, кого больше.'),
            ],
            outro: [say('ignissa', 'Стихии замолчали, планы встали на место. Тишина такая, что слышно, как далеко-далеко трещит костёр.')],
          },
          bonus: [{ kind: 'creatures', cid: 'phoenix', n: 2 }, { kind: 'artifact', art: 'cyclops_tunic' }, { kind: 'res', res: 'mercury', amount: 20 }],
          events: [
            { day: 7, who: N, text: 'Некрополис поднял драконов.', foe: { cid: 'ghost_dragon', n: 3 } },
            { day: 21, who: 'pasis', text: 'Феи всех планов с тобой, Игнисса! Не смотри, что маленькие.', give: { kind: 'creatures', cid: 'sprite', n: 40 } },
          ],
        },
      ],
    },
    {
      id: 'newlands',
      name: 'Новые земли',
      desc: 'Хроника за Улей, Бастион и Фабрику: пять сценариев о материке за океаном, куда приплыли колонисты, пираты и торговец чужой землёй Тарк. Герой меняется вместе с народом.',
      faction: 'hive', hero: 'zurr',
      prologue: 'За океаном нашли материк, и первыми туда поплыли колонисты Эрафии, пираты Бухты и наёмник Тарк, готовый продать им всё, что не приколочено. На материке их не ждали. Но встретили.',
      epilogue: 'Колонисты уплыли, Тарк сидит в клетке собственной работы. Улей, лес и мастерские так и не стали друзьями — но договорились, что земля эта их.',
      scenarios: [
        {
          id: 'l1', name: 'Горящие ульи',
          brief: 'Колонисты Эрафии жгут ульи ради мёда и пашни. Рою надо вырасти: тридцать плевунов в одном войске — и чужаки не посмеют подойти. Или прогоните их сами.',
          size: 'S', seed: 1901, faction: 'hive', hero: 'zurr', foes: ['castle'], opponents: 1, difficulty: 'easy', sea: 'none',
          goals: { win: [{ type: 'army', cid: 'spitter', n: 30 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('zurr', 'Чужаки пришли с огнём. Рой помнит огонь. Рой отвечает числом.'),
              say('caitlin', 'Какие странные пчёлы. Интересно, почём их мёд за морем?'),
            ],
            outro: [say('zurr', 'Колонисты бегут к кораблям. Но на берегу их ждут не корабли, а люди в железных масках.')],
          },
          bonus: [{ kind: 'creatures', cid: 'spitter', n: 8 }, { kind: 'artifact', art: 'badge_courage' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 3, who: N, text: 'Из глубины улья вылупились новые рабочие.', give: { kind: 'creatures', cid: 'worker', n: 15 } },
            { day: 10, who: 'caitlin', text: 'Стрелки из форта, за мной. Мёд сам себя не соберёт.', foe: { cid: 'marksman', n: 12 } },
          ],
        },
        {
          id: 'l2', name: 'Люди в масках',
          brief: 'Наёмники Тарка ловят маток на продажу колонистам. Одолейте их вожака — остальные сбегут. Пять недель, потом корабль уйдёт с добычей. С вами половина роя.',
          carry: { army: 'part' },
          size: 'S', seed: 1902, faction: 'hive', hero: 'zurr', foes: ['factory'], opponents: 1, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'timeout', days: 35 }] },
          story: {
            intro: [
              say('tark', 'Матка улья за морем стоит как замок. Ничего личного — просто арифметика.'),
              say('zurr', 'Рой тоже умеет считать. До последнего.'),
            ],
            outro: [say('zurr', 'Вожак пойман. Он сказал, что на западе Тарк ловит уже не маток, а медведей. Лес — не наша земля. Но и не его.')],
          },
          bonus: [{ kind: 'creatures', cid: 'wasp_warrior', n: 6 }, { kind: 'spell', spell: 'haste' }, { kind: 'res', res: 'gems', amount: 8 }],
          events: [
            { day: 5, who: 'melissa', text: 'Мои осы нашли их лагерь. Бери и лети.', give: { kind: 'creatures', cid: 'wasp_reaver', n: 4 } },
            { day: 14, who: 'tark', text: 'Стрелки, отработайте жалованье.', foe: { cid: 'gunslinger', n: 4 } },
          ],
        },
        {
          id: 'l3', name: 'Лесопилки',
          brief: 'Рой остался на востоке, западный лес бережёт Бастион. Чужаки валят деревья и роют руду. Егерь Ольд возвращает своё: заберите десять шахт и лесопилок — или выгоните всех.',
          carry: { hero: false },
          size: 'M', seed: 1903, faction: 'bastion', hero: 'old', foes: ['castle', 'factory'], opponents: 2, difficulty: 'normal', sea: 'none',
          goals: { win: [{ type: 'flag_mines', n: 10 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('old', 'Лес не продаётся. Кто рубит без спроса, тот и уходит без спроса.'),
              say('marr', 'Тотемы шепчут: чужаков много, но троп они не знают.'),
            ],
            outro: [say('old', 'Шахты наши, пилы молчат. Но ночью с севера пришёл рёв — Тарк пустил на лес что-то большое.')],
          },
          bonus: [{ kind: 'creatures', cid: 'bear', n: 3 }, { kind: 'artifact', art: 'equestrian_gloves' }, { kind: 'building', building: 'dwell_3' }],
          events: [
            { day: 6, who: N, text: 'Рыси вышли к егерю — лес помнит своих.', give: { kind: 'creatures', cid: 'lynx', n: 15 } },
            { day: 16, who: N, text: 'Колонисты прислали конницу стеречь лесопилки.', foe: { cid: 'cavalier', n: 5 } },
          ],
        },
        {
          id: 'l4', name: 'Багровые змеи',
          brief: 'Тарк разбудил багровых коатлей и выпустил на лес: шесть змеев жгут чащу с воздуха. Одолейте их, пока не сгорело всё. С Ольдом половина прежнего войска.',
          carry: { army: 'part' },
          size: 'M', seed: 1904, faction: 'bastion', hero: 'old', foes: ['factory', 'cove'], opponents: 2, difficulty: 'hard', sea: 'wide',
          goals: { win: [{ type: 'defeat_monster', cid: 'crimson_couatl', n: 6 }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }] },
          story: {
            intro: [
              say('old', 'Коатли не злые. Их злят. Тарк это умеет лучше всех.'),
              say('tark', 'Лес горит — пилить не надо. Выгодно же.'),
            ],
            outro: [say('old', 'Змеи упали в реку и остыли. Ко мне пришла Уинона из мастерских, без оружия. Говорит, Тарк предал и её.')],
          },
          bonus: [{ kind: 'creatures', cid: 'master_ranger', n: 6 }, { kind: 'spell', spell: 'fortune' }, { kind: 'building', building: 'citadel' }],
          events: [
            { day: 8, who: 'brana', text: 'Охотники с дальних заимок пришли. Будем бить змеев, когда садятся.', give: { kind: 'creatures', cid: 'ranger', n: 8 } },
            { day: 20, who: 'tark', text: 'Охотники за головами, за егерем. Плачу вдвойне.', foe: { cid: 'bounty_hunter', n: 6 } },
          ],
        },
        {
          id: 'l5', name: 'Клетка для Тарка',
          brief: 'Уинона знает мастерские Тарка изнутри, а колонисты и пираты — его покупатели и защита. Одолейте вожака его мастерских или выгоните с материка всех чужаков. Падёт Уинона — союз распадётся.',
          carry: { hero: false },
          size: 'L', seed: 1905, faction: 'factory', hero: 'wynona', foes: ['factory', 'castle', 'cove'], opponents: 3, difficulty: 'hard',
          goals: { win: [{ type: 'defeat_hero', of: 'enemy' }, { type: 'kill_all' }], lose: [{ type: 'lose_all' }, { type: 'lose_hero', of: 'mine' }] },
          story: {
            intro: [
              say('wynona', 'Я строила автоматонов, чтобы пахать землю. Тарк научил их стрелять. Пора переучить.'),
              say('tark', 'Ты всегда была слишком честной для этого ремесла, Уинона.'),
            ],
            outro: [say('wynona', 'Тарк в клетке, которую сам заказывал для маток. Рой, лес и мастерские подписали договор — на коре, воске и железе.')],
          },
          bonus: [{ kind: 'creatures', cid: 'sentinel_automaton', n: 8 }, { kind: 'artifact', art: 'armor_wonder' }, { kind: 'building', building: 'special' }],
          events: [
            { day: 6, who: 'zurr', text: 'Рой помнит, кто помог. Бери наших жуков.', give: { kind: 'creatures', cid: 'ram_beetle', n: 6 } },
            { day: 14, who: 'old', text: 'Лес идёт с тобой, механикус.', give: { kind: 'creatures', cid: 'bear', n: 3 } },
            { day: 24, who: 'tark', text: 'Выпускайте последних коатлей. Всё равно платить им нечем.', foe: { cid: 'crimson_couatl', n: 2 } },
          ],
        },
      ],
    },
  ];
  const BY_ID = Object.create(null);
  LIST.forEach(c => { BY_ID[c.id] = c; });

  /** Человеческим языком: что переходит в этот сценарий из прошлого. */
  function carryText(sc) {
    const r = H3.State ? H3.State.carryRules(sc && sc.carry) : Object.assign({ hero: true, army: 'part', arts: true, levelCap: 0 }, (sc && sc.carry) || {});
    if (!r.hero) return 'ничего: новый герой и новое войско';
    const parts = ['герой' + (r.levelCap ? ' (не выше ' + r.levelCap + ' уровня)' : '')];
    parts.push(r.army === 'full' ? 'всё войско' : r.army === 'none' ? 'войско набирается заново' : 'половина войска');
    parts.push(r.arts ? 'артефакты' : 'артефакты остаются в прошлом');
    return parts.join(', ');
  }

  /** Текст бонуса/подарка. faction — фракция сценария (нужна для имени постройки). */
  function rewardText(r, faction) {
    if (!r) return '';
    if (r.kind === 'building') {
      const B = H3.Buildings;
      const b = B && (faction && H3.Factions ? B.get(faction, r.building) : null) || (B && B.BY_ID[r.building]);
      return 'постройка «' + (b ? b.name : r.building) + '»';
    }
    if (H3.Quest && H3.Quest.rewardText) return H3.Quest.rewardText(r);
    return r.kind;
  }

  H3.Campaign = { LIST, BY_ID, get: id => BY_ID[id], carryText, rewardText };
  if (typeof module !== 'undefined' && module.exports) module.exports = H3.Campaign;
})(typeof window !== 'undefined' ? window : globalThis);
