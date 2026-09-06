/* ============================================================================
   view/sprites_tower.js — спрайты существ фракции Tower (Башня).
   14 существ: gremlin, master_gremlin, stone_gargoyle, obsidian_gargoyle,
   stone_golem, iron_golem, mage, arch_mage, genie, master_genie, naga, naga_queen,
   giant, titan.
   Формат и палитра — docs/sprite-guide.md. Все смотрят вправо, якорь низ-центр.
   Подключать после js/view/sprites.js.
   ========================================================================== */
(function () {
  'use strict';

  H3.Sprites.defineMany({

    /* ---------- уровень 1: гремлин 20×22 — зелёный ушастый коротышка, бурая роба, цепь с ядром ---------- */
    gremlin: {
      rows: [
        '.......kkkkk........',
        '......khgggGk.......',
        '..kk.kggggggGk.kk...',
        '.kggkkggggggGkkggk..',
        '.kgggggggggggggggGk.',
        '..kkkGgwkgwkgGkkk...',
        '.....kGgggggGk......',
        '.....kGgkkkkGk......',
        '......kGGGGGk.......',
        '.......kkkkkkk......',
        '......kknnnnNkk.....',
        '.....kgknnnnNkgk....',
        '....kggknnnnNkggk...',
        '....kGkknnnnNkkGgk..',
        '....kkkknnnnNk.kkke.',
        '.......kNnnNNk....e.',
        '.......kNNNNNk....e.',
        '.......kkkkkkk..kkk.',
        '.......kgk.kgk.kleuk',
        '.......kgk.kgk.keuuk',
        '......kkGk.kGkkkuuuk',
        '......kkkk.kkkk.kkk.',
      ],
    },

    /* ---------- мастер-гремлин: красный колпак, фиолетовая роба (стрелок — метает ядро) ---------- */
    master_gremlin: {
      base: 'gremlin',
      tint: { n: 'p', N: 'P' },
      extra: [
        [7, 1, 'r'], [8, 1, 'r'], [9, 1, 'r'], [10, 1, 'r'], [11, 1, 'R'], [6, 2, 'r'],
        [7, 2, 'r'], [8, 2, 'r'], [9, 2, 'r'], [10, 2, 'r'], [11, 2, 'r'], [12, 2, 'R'],
        [6, 3, 'R'], [7, 3, 'R'], [8, 3, 'R'], [9, 3, 'R'], [10, 3, 'R'], [11, 3, 'R'],
        [12, 3, 'R'], [9, 0, 'y'],
      ],
    },

    /* ---------- уровень 2: каменная горгулья 24×23 — серая крылатая статуя-демон, рога, клыки, когти; парит ---------- */
    stone_gargoyle: {
      rows: [
        '.kk........kk......kk...',
        '.klk.......kelk..kelk...',
        '.kllk......kkeekkkeek...',
        '.klllk....klleeeeeeek...',
        '.kllElk...kleewkeewkk...',
        '.kllElek..kleeeeeeeEk...',
        '.kllEleek.kEeekkkkkEk...',
        '..klEleeek.kEeikikiEk...',
        '..klEleeeekkkEEEEEEEk...',
        '...kElEleeeek.kEEEEk....',
        '...kkElEleeeeeeeeeeeek..',
        '....kkElEleeeeeeeeeEEkk.',
        '.....kkEkEleeeeeeeeEkEek',
        '......kkkkkEeeeeeeeEkEek',
        '.......kk.kEeeeeeeeEkkkk',
        '.........kEEeeeeeEEkkEek',
        '........kkEeeekkkeEk.kkk',
        '......kkkEeekk..kEeEk.k.',
        '.....kEEkkEEEk..kEEEk...',
        '.....kEk.kEEkk..kkEEkk..',
        '.....kk..kkkk...kkkkk...',
        '........................',
        '........................',
      ],
    },

    /* ---------- обсидиановая горгулья: чёрный камень с фиолетовым отливом, светящиеся глаза ---------- */
    obsidian_gargoyle: {
      base: 'stone_gargoyle',
      tint: { e: 'u', E: 'z', l: 'p', w: 'a' },
      extra: [
        [3, 3, 'A'], [3, 4, 'A'], [4, 5, 'A'],
      ],
    },

    /* ---------- уровень 3: каменный голем 24×24 — приземистый истукан из песчаника с трещинами ---------- */
    stone_golem: {
      rows: [
        '.........kkkkkk.........',
        '........kIITTTdk........',
        '........kITkTkdk........',
        '........kITTTTdk........',
        '........kdTkkkdk........',
        '.......kkkddddkkk.......',
        '....kkkIITTTTTTTdkkk....',
        '..kkIITTTTTTTTTTTTTddkk.',
        '.kITTdkITTTTTTTTTkTTTdk.',
        '.kITTdkITTTTdTTTTkTTTdk.',
        '.kITTdkITTTdTTTTTkTTTdk.',
        '.kITTdkITTTTTTTTTkTTTdk.',
        '.kITTdkITTdTTTTTTkTTTdk.',
        '.kITTdkITTTTTTTdTkTTTdk.',
        '.kITTdkITTTTTTTTTkTTTdk.',
        '.kITTdkITTTTTTTTTkTTTdk.',
        '.kIIIdkddddddddddkIIIdk.',
        '.kkkkkkTTTTkkTTTTkkkkkk.',
        '......kTTTdkkTTTdk......',
        '......kTTTdkkTTTdk......',
        '......kTTTdkkTTTdk......',
        '.....kkTTTdkkTTTdkk.....',
        '.....kITTddkkITTddk.....',
        '.....kkkkkkkkkkkkkk.....',
      ],
    },

    /* ---------- железный голем: стальной корпус, заклёпки, огненные глаза ---------- */
    iron_golem: {
      base: 'stone_golem',
      tint: { I: 'l', T: 'e', d: 'E' },
      extra: [
        [11, 2, 'f'], [13, 2, 'f'], [8, 7, 'y'], [15, 7, 'y'], [8, 14, 'y'], [15, 14, 'y'],
        [11, 10, 'y'], [12, 10, 'y'], [3, 10, 'y'], [3, 13, 'y'], [19, 10, 'y'], [19, 13, 'y'],
        [8, 19, 'y'], [15, 19, 'y'],
      ],
    },

    /* ---------- уровень 4: маг 24×24 — синяя мантия, остроконечная шляпа, седая борода, посох с шаром ---------- */
    mage: {
      rows: [
        '.........kk.............',
        '........kbBk........kAk.',
        '........kbBk.......kAaAk',
        '.......kbbBk........kAk.',
        '.......kbbBk........kTk.',
        '......kbbbBk........kTk.',
        '......kbybBk........kTk.',
        '.....kbbbbBBk.......kTk.',
        '..kkkkbbbbBBkkkk....kTk.',
        '.kbbbbbbbbbbBBBBBk..kTk.',
        '..kkkkkssssSkkkk....kTk.',
        '......kssskSk.......kTk.',
        '......kslllsk.......kTk.',
        '......kllllllk......kTk.',
        '.....kklllllkk......kTk.',
        '....kbbklllkbbk.....kTk.',
        '...kbbbbkkkkbbbbkbsskTk.',
        '...kbbbbbbbbbbbbbkkkkTk.',
        '...kbyyyyyyyyyyyYk..kTk.',
        '...kbbbbbBbbbbbbBk..kTk.',
        '..kbbbbbbBbbbbbbBBk.kTk.',
        '..kbbbbbbBbbbbbbBBk.kTk.',
        '.kbbbbbbbBbbbbbbBBBkkTk.',
        '.kk........kk......kk...',
      ],
    },

    /* ---------- архимаг: фиолетовая мантия с золотой оторочкой, золотой посох, звёзды на шляпе ---------- */
    arch_mage: {
      base: 'mage',
      tint: { b: 'p', B: 'P', T: 'y', a: 'c', A: 'w' },
      extra: [
        [2, 9, 'y'], [3, 9, 'y'], [4, 9, 'y'], [5, 9, 'y'], [6, 9, 'y'], [7, 9, 'y'],
        [8, 9, 'y'], [9, 9, 'y'], [10, 9, 'y'], [11, 9, 'y'], [12, 9, 'Y'], [13, 9, 'Y'],
        [14, 9, 'Y'], [15, 9, 'Y'], [16, 9, 'Y'], [9, 4, 'y'], [2, 22, 'y'], [3, 22, 'y'],
        [4, 22, 'y'],
      ],
    },

    /* ---------- уровень 5: джинн 24×26 — синий дух без ног, руки скрещены на груди, хвост из дымки, серьга ---------- */
    genie: {
      rows: [
        '..........kk............',
        '.........kcbk...........',
        '........kkkkkkk.........',
        '.......kcbbbbbBk........',
        '.......kcbbwkbBk........',
        '.......kcbbbbbBk........',
        '.....yykBbbkkbBk........',
        '......ykkBbbbBBk........',
        '........kkBBBkk.........',
        '......kkkkkkkkkk........',
        '....kkcbbbbbbbBkk.......',
        '...kcbbbbbbbbbbbBk......',
        '..kcbbkbbbbbbbbkcbBk....',
        '..kcbbkbbbbbbkcbbkBk....',
        '..kcbbkbbbbkcbbbkbBk....',
        '..kcbbkbbkcbbbkbcbBk....',
        '...kcbkcbbbkbbbbkkBBk...',
        '....kkkkkkkbbbbbbbBBk...',
        '.....kyyyyyyyyyyyYYk....',
        '......kBbbbbbbbbBBk.....',
        '.......kBbbbbbbBBk......',
        '........kcBbbbBBk.......',
        '......kkccBBBBk.........',
        '....kkcccBBBk...........',
        '...kccckkkkk............',
        '...kkkk.................',
      ],
    },

    /* ---------- мастер-джинн: светлее (голубая кожа), золотой обруч, браслеты, крупная серьга ---------- */
    master_genie: {
      base: 'genie',
      tint: { b: 'c', B: 'b', c: 'w' },
      extra: [
        [8, 3, 'y'], [9, 3, 'y'], [10, 3, 'y'], [11, 3, 'y'], [12, 3, 'y'], [13, 3, 'y'],
        [14, 3, 'y'], [3, 13, 'y'], [4, 13, 'y'], [5, 13, 'y'], [16, 13, 'y'], [17, 13, 'y'],
        [16, 20, 'y'],
      ],
    },

    /* ---------- уровень 6: нага 28×28 — женщина-змея, шесть рук с мечами, кольца хвоста ---------- */
    naga: {
      rows: [
        '....kk......kkkk......kk....',
        '....klk....kuuuuk.....klk...',
        '....klk...kuuuuuuk....klk...',
        '....klk...kussssSk....klk...',
        '....kek...kuswksSk....kek...',
        '...kkkkk..kussssSk...kkkkk.k',
        '...kSsk...kuSssSk...ksSskklk',
        'kk...ksSk...kSSk...kssk.klk.',
        'klk....kSksssssSSksk...klk..',
        '.klk....kksssssSSkk...kek...',
        '..kek.ksskyyyyyYYksskkkk....',
        '..kkkSsskkyyyyyYYkkssSk.....',
        '....kkkk.ksssssSSkkkkk......',
        'kkk...kssksssssSSkssk.kkkkk.',
        'kllkSssskksssssSSkkssklllllk',
        'kkkkkkkkkkyyyyyYYkkkkkkkkkk.',
        '.........kCqqqqQQk..........',
        '.........kCqqqqQQk..........',
        '........kCqqqqqQQk..........',
        '.......kCCqqqqqQQQk.........',
        '......kCqqqqqqqqQQQk....kkk.',
        '...kkkqCqqqqqqqqQQQQkkkkqqk.',
        '..kqqCCqqqqqqqqqqqQQQqqqqqQk',
        '.kqCCqqqqQQQQQQQQqqQQQqqqQQk',
        '.kqCqqqqQqqqqqqQQqqqQQqqqQQk',
        '.kqqqqqqqqqqqqqqqqqqqqQQQQQk',
        '..kQqqqqqqqqqqqqqqqqqQQQQQk.',
        '...kkkkkkkkkkkkkkkkkkkkkkk..',
      ],
    },

    /* ---------- королева наг: золотая корона, красные клинки, пурпурная чешуя ---------- */
    naga_queen: {
      base: 'naga',
      tint: { l: 'r', e: 'R', q: 'x', Q: 'P', C: 'p' },
      extra: [
        [12, 1, 'y'], [13, 1, 'r'], [14, 1, 'y'], [15, 1, 'y'], [11, 2, 'y'], [16, 2, 'y'],
      ],
    },

    /* ---------- уровень 7: гигант 32×32 — исполин в белой тоге, огромный меч ---------- */
    giant: {
      rows: [
        '.............kkkkkk.........kk..',
        '............knnnnnNk.......klek.',
        '...........knnnnnnnNk......klek.',
        '...........knnnssssNk......klek.',
        '...........knsswksSNk......klek.',
        '...........kNsssssSSk......klek.',
        '...........kNsssssSSk......klek.',
        '............kSskkSSk.......klek.',
        '.............kSSSSk......kyyyyyk',
        '..............kSSk......kssknNk.',
        '..........kkkkkkkkkkkk..kssssNk.',
        '........kkiiiiiiiksssssskkssssk.',
        '.......kssiiiiiiiIkssssssSk.....',
        '......kssskiiiiiiIksssssSk......',
        '......kssSkiiiiiiIkkssssSk......',
        '......kssSkiiiiiiiIkkssSk.......',
        '......kssSkiiiiiiiiIkkkkk.......',
        '......kssSkiiiiiiiiiIkk.........',
        '......kSSSkyyyyyyyyyYk..........',
        '.....kkSSSkiiiiiiiiiIk..........',
        '.....kSsSSkiiiiiiiiiIk..........',
        '.....kkkkkkiiiiiiiiiIk..........',
        '..........kIiiiiiiiIIk..........',
        '..........kkkkkkkkkkkk..........',
        '..........ksssSkksssSk..........',
        '..........ksssSkksssSk..........',
        '..........ksssSkksssSk..........',
        '..........ksssSkksssSk..........',
        '..........ksssSkksssSk..........',
        '.........kknnNkkknnNkk..........',
        '.........knnnNk.knnnNk..........',
        '.........kkkkkk.kkkkkk..........',
      ],
    },

    /* ---------- титан: синяя кожа, золотой доспех и шлем, молния в руке (стрелок) ---------- */
    titan: {
      rows: [
        '.............kkkkkk..........kk.',
        '............kyyyyyYk........kwck',
        '...........kyyyyyyyYk......kwck.',
        '...........kyyybbbbYk......kwk..',
        '...........kybbwkbBYk.....kkwkk.',
        '...........kYbbbbbBBk.....kwwwck',
        '...........kYbbbbbBBk......kkwck',
        '............kBbkkBBk........kwk.',
        '.............kBBBBk.........kwk.',
        '..............kBBk......kbbbkwk.',
        '..........kkkkkkkkkkkk..kbbbbBk.',
        '........kkyyyyyyykbbbbbbkkbbbbk.',
        '.......kbbyyyyyyyYkbbbbbbBk.....',
        '......kbbbkyyyyyyYkbbbbbBk......',
        '......kbbBkyyyyyyYkkbbbbBk......',
        '......kbbBkyyyyyyyYkkbbBk.......',
        '......kbbBkyyyyyyyyYkkkkk.......',
        '......kbbBkyyyyyyyyyYkk.........',
        '......kBBBklllllllllek..........',
        '.....kkBBBkyyyyyyyyyYk..........',
        '.....kBbBBkyyyyyyyyyYk..........',
        '.....kkkkkkyyyyyyyyyYk..........',
        '..........kYyyyyyyyYYk..........',
        '..........kkkkkkkkkkkk..........',
        '..........kbbbBkkbbbBk..........',
        '..........kbbbBkkbbbBk..........',
        '..........kbbbBkkbbbBk..........',
        '..........kbbbBkkbbbBk..........',
        '..........kbbbBkkbbbBk..........',
        '.........kkeeEkkkeeEkk..........',
        '.........keeeEk.keeeEk..........',
        '.........kkkkkk.kkkkkk..........',
      ],
    },

  });
})();
