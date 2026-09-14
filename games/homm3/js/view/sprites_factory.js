/* ============================================================================
   view/sprites_factory.js — спрайты существ фракции Factory (Фабрика).
   14 существ: halfling, halfling_grenadier, mechanic, engineer, armadillo,
   bellwether_armadillo, automaton, sentinel_automaton, sandworm, olgoi_khorkhoi,
   gunslinger, bounty_hunter, couatl, crimson_couatl.
   Формат и палитра — docs/sprite-guide.md. Все смотрят вправо, якорь низ-центр.
   ========================================================================== */
(function () {
  'use strict';

  H3.Sprites.defineMany({

    /* ---------- уровень 1: полурослик 18×20 — шляпа, праща-ружьё ---------- */
    halfling: {
      rows: [
        '...kkkkkkk........',
        '..kHHHHHHHk.......',
        '.kHHHHHHHHHk......',
        '..kkkHHHkkk.......',
        '....ksssk.........',
        '....kskssk........',
        '....kssssk........',
        '.....kkkk.........',
        '...kkkjjkkk..kk...',
        '..kjjjjjjjjkkTk...',
        '..kjjjkkjjjkTkk...',
        '..kjjkeeeeeek.....',
        '..kjjkEEEEEEk.....',
        '..kjjjkkkkkk......',
        '..kjjjjjjjjk......',
        '...kHHHHHHk.......',
        '...kkkkkkkk.......',
        '...knnk.knnk......',
        '..kkNNk.kNNkk.....',
        '..kkkkk.kkkkk.....',
      ],
    },
    /* гренадёр: куртка в хаки, на поясе гранаты */
    halfling_grenadier: { base: 'halfling', tint: { j: 'H', H: 'd' }, extra: [[3, 14, 'O'], [5, 14, 'O'], [12, 11, 'y'], [13, 11, 'y']] },

    /* ---------- уровень 2: механик 20×22 — ранец за спиной, гаечный ключ ---------- */
    mechanic: {
      rows: [
        '......kkkkk.........',
        '.....kOOOOOk........',
        '....kOOOOOOOk.......',
        '.....kkksskk........',
        '......ksssk.........',
        '......kskssk........',
        '......kssssk........',
        '.......kkkk.........',
        'kkkk.kkkbbkkk.......',
        'kuuukkbbbbbbk.......',
        'kuuukkbbbbbbk..kkk..',
        'kuluukbbbbbbkkkeek..',
        'kuuukkbbbbbbkeeekk..',
        'kuuukkbbkkbbkkek....',
        'kkkk.kbbkkbbk.kek...',
        '.....kbbbbbbk.kkk...',
        '.....kBBBBBBk.......',
        '.....kkkkkkkk.......',
        '.....kEEk.kEEk......',
        '.....kEEk.kEEk......',
        '....kkEEk.kEEkk.....',
        '....kkkkk.kkkkk.....',
      ],
    },
    /* инженер: комбинезон в рыжий, на ранце — клапан пара */
    engineer: { base: 'mechanic', tint: { b: 'O', B: 'D', u: 'e' }, extra: [[2, 8, 'l'], [3, 8, 'l'], [2, 9, 'w']] },

    /* ---------- уровень 3: армадилл 22×20 — броневой панцирь, четыре лапы ---------- */
    armadillo: {
      rows: [
        '......................',
        '.......kkkkkkk........',
        '.....kkTTTTTTTkk......',
        '....kTTTTTTTTTTTk.....',
        '...kTTkTTkTTkTTTTk....',
        '..kTTTkTTkTTkTTTTTk...',
        '..kTTTkTTkTTkTTTTTkk..',
        '.kTTTTkTTkTTkTTTTTTTk.',
        '.kTTTTkTTkTTkTTkssskk.',
        '.kTTTTTTTTTTTTTksksk..',
        '.kTTTTTTTTTTTTTksssk..',
        '..kTTTTTTTTTTTTkkkkk..',
        '..kkTTTTTTTTTTTk......',
        '...kkNNkkkkNNkkk......',
        '...kNNNk..kNNNk.......',
        '...kNNNk..kNNNk.......',
        '..kkNNkk..kkNNkk......',
        '..kkkkk....kkkkk......',
        '......................',
        '......................',
      ],
    },
    /* вожак: панцирь темнеет до бронзы, на спине — шипы */
    bellwether_armadillo: { base: 'armadillo', tint: { T: 'O', N: 'D' }, extra: [[7, 1, 'e'], [10, 1, 'e'], [13, 1, 'e'], [8, 0, 'l'], [11, 0, 'l']] },

    /* ---------- уровень 4: автоматон 22×24 — шагающий механизм с щитом ---------- */
    automaton: {
      rows: [
        '.......kkkkk..........',
        '......keeeeek.........',
        '.....keekekeek........',
        '.....kekwkwkek........',
        '.....keeeeeeek........',
        '......kkeeekk.........',
        '........kek...........',
        '...kkkkkkekkkkkk......',
        '..keeeeeeeeeeeeek.....',
        '..keelllllllllEek.....',
        '..keeleeeeeeelEek.....',
        '..keeleyyyyyelEek.....',
        '..keeleyEEEyelEek.....',
        '..keeleyyyyyelEek.....',
        '..keeleeeeeeelEek.....',
        '..keelllllllllEek.....',
        '..keeeeeeeeeeeeek.....',
        '...kkeeeekkeeeekk.....',
        '....keeek..keeek......',
        '....keeek..keeek......',
        '....kEEEk..kEEEk......',
        '...kkEEkk..kkEEkk.....',
        '...kkkkk....kkkkk.....',
        '......................',
      ],
    },
    /* автоматон-страж: сталь чернеет, ядро горит алым */
    sentinel_automaton: { base: 'automaton', tint: { e: 'u', E: 'z', y: 'r' }, extra: [[8, 3, 'r'], [10, 3, 'r'], [11, 12, 'f']] },

    /* ---------- уровень 5: песчаный червь 26×22 — кольчатое тело, пасть-воронка (2 гекса) ---------- */
    sandworm: {
      rows: [
        '..................kkkkk...',
        '................kktttttkk.',
        '...............kttttttttk.',
        '..............kttkkkkkttk.',
        '..............kttkMMMkttk.',
        '.............kttkMMMMMkttk',
        '.............kttkMMMMMkttk',
        '..............kttkMMMkttk.',
        '.......kkkk...kttkkkkkttk.',
        '....kkkttttkkkkttttttttk..',
        '..kktttttttttttttttttkk...',
        '.kttttkttttkttttkttttk....',
        'kttttkttttkttttkttttkk....',
        'kttkkttttkttttkttttkk.....',
        'kttkkttttkttttkttkk.......',
        'kttkkttttkttkkkkk.........',
        '.kkkkttttkkk..............',
        '...kkttttk................',
        '....kkttkk................',
        '.....kkkk.................',
        '..........................',
        '..........................',
      ],
    },
    /* олгой-хорхой: песок краснеет, пасть ярче */
    olgoi_khorkhoi: { base: 'sandworm', tint: { t: 'O', M: 'r' }, extra: [[19, 4, 'f'], [21, 4, 'f'], [20, 5, 'f']] },

    /* ---------- уровень 6: стрелок 24×24 — плащ, длинное ружьё на сошках ---------- */
    gunslinger: {
      rows: [
        '.....kkkkkkkk...........',
        '....kDDDDDDDDk..........',
        '...kDDDDDDDDDDk.........',
        '....kkkDDDkkk...........',
        '......ksssk.............',
        '......kskssk............',
        '......kssssk............',
        '.......kkkk.............',
        '....kkkkHHkkkk..........',
        '...kHHHHHHHHHHk.........',
        '...kHHHkkkkHHHkkkkkkkk..',
        '...kHHkeeeeeeeeeeeeeeek.',
        '...kHHkEEEEEEEEEEEEEEEk.',
        '...kHHkkkkkkkkkkkkkkkk..',
        '...kHHHHHHHHHHk.........',
        '...kHHHHHHHHHHk.........',
        '....kHHHHHHHHk..........',
        '....kDDDDDDDDk..........',
        '....kkkkkkkkkk..........',
        '....knnk..knnk..........',
        '....knnk..knnk..........',
        '...kkNNk..kNNkk.........',
        '...kkkkk..kkkkk.........',
        '........................',
      ],
    },
    /* охотник за головами: плащ бордовый, оптика на стволе, патронташ */
    bounty_hunter: { base: 'gunslinger', tint: { H: 'M', D: 'R' }, extra: [[14, 10, 'l'], [15, 10, 'l'], [16, 10, 'c'], [5, 15, 'y'], [7, 15, 'y']] },

    /* ---------- уровень 7: коатль 30×26 — пернатый змей в полёте (2 гекса) ---------- */
    couatl: {
      rows: [
        '......................kkkk....',
        '.....................kggggk...',
        '....................kggkggk...',
        '...kkk..............kgggggk...',
        '..kyyk..............kgkkkgk...',
        '..kyyk...kkkkk......kggggkk...',
        '..kyyyk.kgggggkkkkkkkgggk.....',
        '...kyyykgggggggggggggggk......',
        '...kkyyykgggggggggggggk.......',
        '.....kyyykggggggggggkk........',
        '......kyyykgggggggkk..........',
        '.......kyyykggggkk............',
        '........kyykkggk..............',
        '........kkk.kggk..............',
        '...........kggggk.............',
        '..........kgggGGgk............',
        '..........kggGGGGgk...........',
        '.........kggGGGGGGgk..........',
        '.........kgGGGGGGGGk..........',
        '........kgGGGGGGGGGk..........',
        '........kGGGGGGGGGk...........',
        '.......kGGGGGGGGGk............',
        '.......kGGGGGGGk..............',
        '......kkGGGGGkk...............',
        '........kkkkk.................',
        '..............................',
      ],
    },
    /* багровый коатль: перья в багрянец, гребень золотой */
    crimson_couatl: { base: 'couatl', tint: { g: 'M', G: 'R', y: 'f' },
      extra: [[22, 0, 'y'], [24, 0, 'y'], [23, 1, 'y'], [20, 3, 'y']] },

  });
})();
