/* ============================================================================
   view/sprites_cove.js — спрайты существ фракции Cove (Бухта).
   14 существ: nymph, oceanid, crew_mate, seaman, pirate, corsair, stormbird,
   ayssid, sea_witch, sorceress, nix, nix_warrior, sea_serpent, haspid.
   Формат и палитра — docs/sprite-guide.md. Все смотрят вправо, якорь низ-центр.
   ========================================================================== */
(function () {
  'use strict';

  H3.Sprites.defineMany({

    /* ---------- уровень 1: нимфа 18×20 — дева волны, вместо ног гребень ---------- */
    nymph: {
      rows: [
        '.......kkk........',
        '......kCCCkk......',
        '.....kCsssCk......',
        '.....kCsssCk......',
        '.....kCkskCk......',
        '......ksssk.......',
        '.......kkk........',
        '....kkkvvkkk......',
        '...kvvvvvvvvk.....',
        '..kvvvvvvvvvvk....',
        '..kvvkvvvvkvvk....',
        '..kvk.kvvvk.kk....',
        '......kvvvk.......',
        '.....kkvvvkk......',
        '....kCCCvCCCk.....',
        '...kCCCCCCCCCk....',
        '..kCCCCCCCCCCCk...',
        '...kkCCCCCCCkk....',
        '.....kkkkkkk......',
        '..................',
      ],
    },
    /* океанида: бирюза глубже, в волосах жемчуг */
    oceanid: { base: 'nymph', tint: { v: 'c', C: 'Q' }, extra: [[6, 1, 'w'], [9, 1, 'w'], [5, 2, 'w']] },

    /* ---------- уровень 2: матрос 20×22 — тельняшка в широкую полосу, тесак ---------- */
    crew_mate: {
      rows: [
        '......kkkkk.........',
        '.....krrrrrk........',
        '....krrrrrrrk.......',
        '.....ksssssk........',
        '.....kskssk.........',
        '.....kssssk.........',
        '......kkkk..........',
        '...kkkkbbkkkk.......',
        '..kllllllllllk......',
        '..kbbbbbbbbbbk......',
        '..kllllllllllkkkk...',
        '..kbbbbbbbbbbkeek...',
        '..kllllllllllkeek...',
        '..kbbbbbbbbbbkeek...',
        '..kkllllllllkkeek...',
        '...kBBBBBBBBk.kkk...',
        '...kkkkkkkkkk.......',
        '...knnk..knnk.......',
        '...knnk..knnk.......',
        '..kkNNk..kNNkk......',
        '..kkkkk..kkkkk......',
        '....................',
      ],
    },
    /* морской волк: бандана синяя, борода, серьга */
    seaman: { base: 'crew_mate', tint: { r: 'B', b: 'l', l: 'e' }, extra: [[5, 5, 'i'], [6, 5, 'i'], [4, 4, 'y']] },

    /* ---------- уровень 3: пират 20×22 — треуголка, мушкет наперевес ---------- */
    pirate: {
      rows: [
        '....kkkkkkk.........',
        '...kNNNNNNNk........',
        '..kNNNNNNNNNk.......',
        '...kkkNNNkkk........',
        '.....ksssk..........',
        '.....kskssk.........',
        '.....kssssk.........',
        '......kkkk..........',
        '....kkkRRkkk........',
        '...kRRRRRRRRk.......',
        '...kRRRkkRRRkkkkk...',
        '...kRRkeeeeeeeeeek..',
        '...kRRkEEEEEEEEEEk..',
        '...kRRRkkkkkkkkkk...',
        '...kRRRRRRRRk.......',
        '....kRRRRRRk........',
        '....kkkkkkkk........',
        '....knnk.knnk.......',
        '....knnk.knnk.......',
        '...kkNNk.kNNkk......',
        '...kkkkk.kkkkk......',
        '....................',
      ],
    },
    /* корсар: камзол в бордо, перо на шляпе, второй ствол */
    corsair: { base: 'pirate', tint: { R: 'M', n: 'u', N: 'D' }, extra: [[10, 0, 'r'], [11, 1, 'r'], [16, 13, 'e'], [17, 13, 'E']] },

    /* ---------- уровень 4: буревестник 22×22 — крылья дугой, хвост вилкой ---------- */
    stormbird: {
      rows: [
        '..kk..................',
        '.kllk........kkk......',
        'kllllk......kllkk.....',
        'kllllllkkkkllllk......',
        '.klllllllllllllk......',
        '..kklllllllllllkkk....',
        '....klllllllllllllk...',
        '....kllkkklllkkllllk..',
        '...kllk..klllk.kkkkk..',
        '...kkk..kllllk........',
        '........klllllk.......',
        '.......klllllllk......',
        '.......klluullllk.....',
        '......kkluuuulllk.....',
        '.....kllkuuuukkkk.....',
        '....kllllkuuk.........',
        '...kllllllkk..........',
        '...kkllkkk............',
        '.....kyyk.............',
        '....kkyykk............',
        '....kkkkkk............',
        '......................',
      ],
    },
    /* айссид: перья темнеют до штормовых, клюв и когти краснеют */
    ayssid: { base: 'stormbird', tint: { l: 'C', u: 'z', y: 'r' }, extra: [[17, 7, 'y'], [18, 7, 'y'], [16, 8, 'y']] },

    /* ---------- уровень 5: морская ведьма 22×24 — посох с раковиной ---------- */
    sea_witch: {
      rows: [
        '.....kkkkk............',
        '....kpppppk...........',
        '...kppppppppk.........',
        '...kppkkkkppk.........',
        '....ksssssk...........',
        '....kskssk....kk......',
        '....kssssk...kcck.....',
        '.....kkkk....kcvck....',
        '...kkkppkkk..kcvck....',
        '..kppppppppk..kck.....',
        '..kpppppppppkkkkk.....',
        '..kppkppppkpppkTk.....',
        '..kppkppppkppkkTk.....',
        '..kppkppppkpk.kTk.....',
        '..kpppppppppk.kTk.....',
        '..kPPpppppPPk.kTk.....',
        '..kPPPPPPPPPk.kTk.....',
        '..kPPPPPPPPPk.kTk.....',
        '...kPPPPPPPk..kTk.....',
        '...kPPPPPPPk..kTk.....',
        '...kkPPPPPkk..kTk.....',
        '....kkPPPkk...kkk.....',
        '.....kkkkk............',
        '......................',
      ],
    },
    /* колдунья: мантия в глубокую синь, раковина светится */
    sorceress: { base: 'sea_witch', tint: { p: 'b', P: 'B', c: 'A' }, extra: [[14, 6, 'w'], [15, 7, 'w'], [8, 1, 'y']] },

    /* ---------- уровень 6: никса 26×24 — панцирный воин с трезубцем (2 гекса) ---------- */
    nix: {
      rows: [
        '..............kk.k.k......',
        '.......kkkkk..kkkkkkk.....',
        '......kqqqqqk..kkekek.....',
        '.....kqqqqqqqk..keeek.....',
        '.....kqkqqqkqk...kek......',
        '.....kqqqqqqqk...kek......',
        '......kqqqqqk....kek......',
        '.......kkkkk.....kek......',
        '....kkkqqqkkk....kek......',
        '...kqqqqqqqqqk...kek......',
        '..kqqqQQQQQqqqkkkkek......',
        '..kqqQQQQQQQqqk..kek......',
        '..kqqQQQQQQQqqk..kek......',
        '..kqqQQQQQQQqqk..kkk......',
        '..kqqqQQQQQqqqk...........',
        '..kqqqqqqqqqqqk...........',
        '..kkqqqqqqqqqkk...........',
        '...kqqqkkkqqqk............',
        '...kqqk...kqqk............',
        '..kkqqk...kqqkk...........',
        '..kQQQk...kQQQk...........',
        '..kQQQk...kQQQk...........',
        '.kkQQkk...kkQQkk..........',
        '.kkkkk.....kkkkk..........',
      ],
    },
    /* никса-воин: панцирь чернеет, гребень и трезубец золотятся */
    nix_warrior: { base: 'nix', tint: { q: 'u', Q: 'z', e: 'y' }, extra: [[8, 0, 'y'], [9, 0, 'y'], [10, 0, 'y'], [6, 1, 'y']] },

    /* ---------- уровень 7: морской змей 30×26 — кольца тела, гребень (2 гекса) ---------- */
    sea_serpent: {
      rows: [
        '...................kkkkk......',
        '..................kqqqqqk.....',
        '.................kqqqqqqqk....',
        '................kqqkqqqkqqk...',
        '................kqqqqqqqqqqk..',
        '...............kqqqqqqqqqqqk..',
        '...............kqqqkkkqqqqk...',
        '..............kqqqk...kqqk....',
        '.............kkqqqk...kkk.....',
        '...kkk......kkqqqk............',
        '..kQQQkk..kkqqqqk.............',
        '.kQQQQQQkkQQQQQk..............',
        'kQQQQQQQQQQQQQk...............',
        'kQQkkkQQQQQQQk................',
        'kQQk.kkQQQQkk.................',
        'kQQk...kkkk...................',
        'kQQkk.........................',
        '.kQQQkk.......................',
        '..kQQQQkk.....................',
        '...kQQQQQkk...................',
        '....kQQQQQQkk.................',
        '.....kkQQQQQQkk...............',
        '.......kkQQQQQQkk.............',
        '.........kkQQQQQQk............',
        '...........kkkkkkk............',
        '..............................',
      ],
    },
    /* хаспид: чешуя в малахит, по гребню — ядовитые шипы */
    haspid: { base: 'sea_serpent', tint: { q: 'G', Q: 'q' },
      extra: [[19, 0, 'h'], [23, 0, 'h'], [21, 1, 'h'], [17, 6, 'h'], [16, 9, 'h']] },

  });
})();
