/* ============================================================================
   view/sprites_dungeon.js — спрайты существ фракции Dungeon (Подземелье).
   Формат: см. docs/sprite-guide.md. Подключать после js/view/sprites.js.
   Существа: troglodyte, infernal_troglodyte, harpy, harpy_hag, beholder,
   evil_eye, medusa, medusa_queen, minotaur, minotaur_king, manticore,
   scorpicore, red_dragon, black_dragon.
   ========================================================================== */
(function () {
  H3.Sprites.defineMany({
    // ---------------------------------------------------------------- 1 lvl
    // Троглодит — сгорбленный безглазый ящер с дубиной (20×22)
    troglodyte: {
      pal: { '1': '#bd93e8' },
      rows: [
        '...............kkk..',
        '..............kTnnk.',
        '..............kTnnk.',
        '..............knnNk.',
        '...............kNk..',
        '.....kkkk......kNk..',
        '...kk1ppkk.....kNk..',
        '..k1pppppkkk...kNk..',
        '..k1ppppppppkk.kNk..',
        '..kppppPPPPPpk.kNk..',
        '..kPppPkkkkkkk.kNk..',
        '.kkPPPPk......kkkkk.',
        'k1ppPPPPkkkkkkpPPpk.',
        'k1pppppppppPPPpPPpk.',
        'k1pppppppPPPPkkkkk..',
        'kppppppPPPPPPk......',
        'kPpppPPPPPPPPk......',
        'kPkkkPPkkPPPk.......',
        'kPk..kPk.kPPk.......',
        '.kk..kPk.kPPk.......',
        '....kPPk.kPPPk......',
        '....kkkk.kkkkk......',
      ],
    },
    // Адский троглодит — красная кожа, тлеющая дубина
    infernal_troglodyte: {
      base: 'troglodyte',
      tint: { '1': 'o', p: 'r', P: 'R', T: 'f', n: 'F', N: 'O' },
    },

    // ---------------------------------------------------------------- 2 lvl
    // Гарпия — женщина с крыльями и когтями, летит (22×21)
    harpy: {
      rows: [
        '..........kkk.........',
        '.........kRRRk........',
        '........kRRRRRk.......',
        '.......kRRsssSk.......',
        '.......kRRsskSk.......',
        '.kk.....kRsssSk....kk.',
        'ktyk....kkkssk....kytk',
        'ktyykk...kssk...kkyytk',
        'ktyyyykkkssSkkkkyyyytk',
        '.kyyyYyksssSSkYyyyyyk.',
        '.kYyyYyksssSSkYyyyYk..',
        '..kYyYkssssSSSkYyYk...',
        '...kkkkssSSSSSkkkk....',
        '.......knnnnnk........',
        '......kNnkknnk........',
        '......kNk..kNk........',
        '.....kNk...kNk........',
        '....kyNk..kyNyk.......',
        '....kkkk..kkkkk.......',
        '......................',
        '......................',
      ],
    },
    // Гарпия-ведьма — зелёная кожа, тёмные крылья, красный глаз
    harpy_hag: {
      base: 'harpy',
      tint: { s: 'g', S: 'G', y: 'P', Y: 'x', t: 'p', R: 'z' },
      extra: [[12, 4, 'r']],
    },

    // ---------------------------------------------------------------- 3 lvl
    // Бехолдер — парящий глаз с щупальцами, стрелок (22×22)
    beholder: {
      pal: { '1': '#c39be9' },
      rows: [
        '....k.....k.....k.....',
        '...kpk...kpk...kpk....',
        '...kpk..kpk...kpk.....',
        '....kpk.kpk..kpk......',
        '.....kpkkpkkkpk.......',
        '....kk1ppppppkk.......',
        '...k1pppppppppPk......',
        '..k1ppppppkkkkkPk.....',
        '.k1pppppkkwwwwwkPk....',
        '.k1ppppkwwwwbbwwkPk...',
        '.kppppkwwwwbbbbwwkPk..',
        '.kppppkwwwbbbkkbwkPk..',
        '.kppppkwwwbbbkkbwkPk..',
        '.kPpppklwwwbbbbwwkPk..',
        '.kPppppklwwwbbwwkPPk..',
        '..kPppppkklllllkPPPk..',
        '..kPPppppppkkkkkPPPk..',
        '...kPPPkikikikiPPPk...',
        '....kPPPkkkkkkkPPk....',
        '.....kkPPPPPPPPkk.....',
        '.......kkkkkkkk.......',
        '......................',
      ],
    },
    // Злой глаз — красный, больше щупалец, жёлтая радужка
    evil_eye: {
      base: 'beholder',
      tint: { '1': 'o', p: 'r', P: 'R', b: 'y' },
      extra: [
        [1, 1, 'k'], [0, 2, 'k'], [1, 2, 'r'], [2, 2, 'k'], [0, 3, 'k'], [1, 3, 'r'], [2, 3, 'k'],
        [1, 4, 'k'], [2, 4, 'r'], [3, 4, 'k'], [2, 5, 'k'], [3, 5, 'r'],
        [18, 1, 'k'], [17, 2, 'k'], [18, 2, 'r'], [19, 2, 'k'], [17, 3, 'k'], [18, 3, 'r'], [19, 3, 'k'],
        [16, 4, 'k'], [17, 4, 'r'], [18, 4, 'k'], [15, 5, 'r'], [16, 5, 'k'],
      ],
    },

    // ---------------------------------------------------------------- 4 lvl
    // Медуза — женщина-змея с волосами-змеями и луком, стрелок (24×24)
    medusa: {
      rows: [
        '......k..kk..k..........',
        '.....kgk.kgkkgk.........',
        '.....kggkkgggkk.........',
        '....kGggggggggk.........',
        '....kGgsssssSgk.........',
        '....kGssssksSgk...kk....',
        '....kGGsssssSkk...knk...',
        '.....kkkssSSk.....lknk..',
        '.......kkSSk......lkTnk.',
        '.....kkkpppkk.....lkTnk.',
        '....kpPkpppPkkkkk.lkTnk.',
        '....kpPkpppPkssssSkkTnk.',
        '....kppPPppPkkkkkkkkTnk.',
        '.....kkPPPPPk.....lkTnk.',
        '.....kGgggggk.....lkTnk.',
        '....kGgggghggk....lkTnk.',
        '...kGgggggghggk...lknk..',
        '..kGggggkkkkhggk..knk...',
        '..kGgggk....kggk..kk....',
        '..kGggk......kggkkkk....',
        '..kGgggk......kgghggk...',
        '...kGgggkkkkkkkkgggkk...',
        '....kGGggggggggggkkk....',
        '.....kkkkkkkkkkkkk......',
      ],
    },
    // Королева медуз — золотая тиара, синее одеяние, золотая полоса чешуи
    medusa_queen: {
      base: 'medusa',
      tint: { p: 'b', P: 'B', h: 'y' },
      extra: [[7, 2, 'y'], [10, 2, 'y'], [12, 2, 'y'], [6, 3, 'y'], [7, 3, 'y'], [8, 3, 'y'], [9, 3, 'y'], [10, 3, 'y'], [11, 3, 'y'], [12, 3, 'y']],
    },

    // ---------------------------------------------------------------- 5 lvl
    // Минотавр — бык-человек с секирой (28×28)
    minotaur: {
      rows: [
        '....k.........k.....kkk.....',
        '...kik.......kik....kNkkk...',
        '...kiik.....kiik....kNkleeek',
        '....kiikkkkkkiik....kNkleeek',
        '.....kkTnnnnnkk.....kNkleeek',
        '.....kTNnnnnnnk.....kNkleeek',
        '....kTnnnnnnnnnk....kNkEeeek',
        '....kNnnkNnnknnnk...kNkEEEk.',
        '....kNnnnnnnnnnnnk..kNkkkk..',
        '.....kNNnnSSSsSSk...kNk.....',
        '......kkkSkkkkkkk...kNk.....',
        '....kkkkNNNNNNkkkk..kNk.....',
        '..kkTnnNNnnnnNNnnNkkkNk.....',
        '.kTnnNkTnnnnnnnnNkNnkNk.....',
        '.kNnnNknnnnnnnnnnkNnnnNNk...',
        '.kNnNk.knnnnnnnnnkkNnnnNNk..',
        '.kNNk..knNnnnnnnNkkkkkkkk...',
        '.kkk..kNnnNNnnnnNNk.kkk.....',
        '......kNnnnnnnnnnnNk........',
        '.....kNNkkkkkkkkkkNNk.......',
        '.....kNkrrrrRRRRRkNNk.......',
        '.....kkkrrrRRRRRRRkkk.......',
        '.......kNNkRRRkNNNk.........',
        '.......kNNk...kNNNk.........',
        '.......kNNk...kNNNk.........',
        '......kNNNk...kNNNNk........',
        '......kDDDk...kDDDDk........',
        '......kkkkk...kkkkkk........',
      ],
    },
    // Король минотавров — корона, золотая секира, пурпурная набедренная повязка
    minotaur_king: {
      base: 'minotaur',
      tint: { e: 'y', l: 'i', E: 'Y', r: 'p', R: 'P' },
      extra: [[8, 2, 'y'], [10, 2, 'y'], [7, 3, 'y'], [8, 3, 'y'], [9, 3, 'y'], [10, 3, 'y'], [11, 3, 'y'], [12, 3, 'y']],
    },

    // ---------------------------------------------------------------- 6 lvl
    // Мантикора — лев с крыльями летучей мыши и хвостом скорпиона (28×28)
    manticore: {
      rows: [
        '............................',
        '..kkkk......................',
        '.kRRRRk.....................',
        'kRkkkRRk....kk..............',
        'kRk..kRRk..kPpk.............',
        'kRk...kkk.kPppPk............',
        'kRk......kPpPPPxk...kkkkkk..',
        'kRk.....kPPPPxxxPk.kRRRRRRk.',
        'kRk....kPPPxxxxPPkkRRoooooRk',
        'kRk...kPPxxxxxxxPkkRooooooRk',
        'kRk..kPPxxxxxxxxPkkRookooook',
        'kRk..kPxxxxxxxxxxkkRoooooook',
        'kRk...kkkkkkkkkkkkkRoooooOOk',
        'kRk.kkktoooooooooOkRRoookkkk',
        'kRkkktooooooooooooookRRRRk..',
        'kRkkooooooooooooooOOOkkkkk..',
        '.kkoooooooooooooooooOOOOOk..',
        '..kOoooOOooooooooooOOOOOOk..',
        '...kOOOOOOOOOOOOOOOOOOOOOk..',
        '....kOOkkkOOkkkkkOOkkkOOOk..',
        '....kOOk.kOOk...kOOk.kOOk...',
        '....kOOk.kOOk...kOOk.kOOk...',
        '...kOOk..kOOk...kOOk.kOOk...',
        '...kOOk.kOOOk..kOOOk.kOOOk..',
        '...kOOk.kOOOk..kOOOk.kOOOk..',
        '..kOOOk.kOOOk..kOOOk.kOOOk..',
        '..kDDDk.kDDDk..kDDDk.kDDDk..',
        '..kkkkk.kkkkk..kkkkk.kkkkk..',
      ],
    },
    // Скорпикора — тёмно-красная, серые крылья, светящийся глаз и жало
    scorpicore: {
      base: 'manticore',
      tint: { t: 'r', o: 'R', O: 'D', R: 'z', p: 'e', P: 'u', x: 'z' },
      extra: [[6, 4, 'h'], [7, 4, 'h'], [22, 10, 'f']],
    },

    // ---------------------------------------------------------------- 7 lvl
    // Красный дракон — большой дракон с крыльями и хвостом (32×32)
    red_dragon: {
      rows: [
        '....kk....kk....................',
        '...kRrk..kRrk...................',
        '...kRrRk.kRrRk....kk............',
        '..kRrrRRkkRrRRk.kRrk...kkk.kk...',
        '..kRrRRRRkRrRRRkRrRk...kiiikiik.',
        '.kRrRRRRRRRrRRRRRrRk..kRrrrrrrk.',
        '.kRrRRRRRRRrRRRRRrRk.kRrrrkfrrrk',
        '.kRRRRRRRRRrRRRRRrRk.kRrrrrrrrrk',
        '..kRRRRRRRRrRRRRRrRkkRRrrrrrrrrk',
        '..kRRRRRRRRRRRRRRRRk.kRrrrrkkkkk',
        '...kRRRRRRRRRRRRRRRk..kRrrrrrik.',
        '....kRRRRRRRRRRRRRRk..kkRRRRRk..',
        '.....kkRRRRRRRRRRRRk.kRrrrRRk...',
        '.......kkkkkkkkkkkkkkRrrrRk.....',
        '.....kkorrrrrrrrrrrkRrrrRk......',
        '....korrrrrrrrrrrrrrrrrrrRRk....',
        '...korrrrrrrrrrrrrrrrrrrRRRk....',
        '..kRrrrrrrrrrrrrrrrrrrRRRRk.....',
        '..kRrrrrrrrrrrrrrrrrrRRRRk......',
        '..kRRrrrrrrrrrrrrrrrRRRRk.......',
        '.kRRRRRyyyyyyyyyyyyyRRRk........',
        'kRkkkRYyyyyyyyyyyyyYRRk.........',
        'kRk..kYYyyyyyyyyyyYYRk..........',
        'kRk..kkYYYYYYYYYYYYkk...........',
        'kRk..kRRRkkkkkkRRRRk............',
        'kRk..kRrRk....kRrrRk............',
        'kRk..kRrRk....kRrrRk............',
        'kRk..kRrRk....kRrrRk............',
        'kRk..kRRrRk..kRRrrRk............',
        'kRRk.kRrrRRk.kRrrrRRk...........',
        'kRRRkkRkRkRk.kRkRkRRk...........',
        '.kkk.kkkkkkk.kkkkkkkk...........',
      ],
    },
    // Чёрный дракон — чёрная чешуя, оранжевые глаза
    black_dragon: {
      base: 'red_dragon',
      pal: { '3': '#23222c' },
      tint: { r: 'u', R: '3', o: 'e', y: 'E', Y: '3', f: 'o', i: 'l' },
      extra: [[28, 6, 'o']],
    },
  });
})();
