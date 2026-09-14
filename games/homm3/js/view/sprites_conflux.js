/* ============================================================================
   view/sprites_conflux.js — спрайты существ фракции Conflux (Сопряжение).
   14 существ: pixie, sprite, air_elemental, storm_elemental, water_elemental,
   ice_elemental, fire_elemental, energy_elemental, earth_elemental,
   magma_elemental, psychic_elemental, magic_elemental, firebird, phoenix.
   Формат и палитра — docs/sprite-guide.md. Все смотрят вправо, якорь низ-центр.
   ========================================================================== */
(function () {
  'use strict';

  H3.Sprites.defineMany({

    /* ---------- уровень 1: фея 18×20 — крылья-лепестки, зелёное платье ---------- */
    pixie: {
      rows: [
        '........kk........',
        '.......ksskk......',
        '......kssssk......',
        '......ksskssk.....',
        '.......kssk.......',
        '..kk....kk....kk..',
        '.kAAk..kggk..kAAk.',
        'kAAAAkkggggkkAAAAk',
        'kAAAAAgggggAAAAAAk',
        'kAAAAkgggggkAAAAAk',
        '.kAAk.kgggk.kAAAk.',
        '..kk..kgggk..kkk..',
        '......kGGGk.......',
        '......kGGGk.......',
        '.......kkk........',
        '......ksksk.......',
        '......kskskk......',
        '.....kkk.kkk......',
        '..................',
        '..................',
      ],
    },
    /* спрайт: крылья в белую магию, платье синее, искры */
    sprite: { base: 'pixie', tint: { A: 'L', g: 'c', G: 'C' }, extra: [[2, 5, 'w'], [15, 5, 'w'], [8, 1, 'w']] },

    /* ---------- уровень 2: воздушный элементаль 20×22 — воронка смерча, витки сужаются ---------- */
    air_elemental: {
      rows: [
        '..kkkkkkkkkkkkkk....',
        '.kllllllllllllllk...',
        'kllkkkkkkkkkkkkllk..',
        'kllk..........kkkk..',
        '.kkk................',
        '...kkkkkkkkkkkk.....',
        '..kllllllllllllk....',
        '..kllkkkkkkkkkllk...',
        '...kk........kkkk...',
        '.....kkkkkkkkk......',
        '....kllllllllllk....',
        '....kllkkkkkkllk....',
        '.....kk......kkk....',
        '.......kkkkkkk......',
        '......klllllllk.....',
        '......kllkkkllk.....',
        '.......kk...kkk.....',
        '........kkkkk.......',
        '.......klllllk......',
        '........kkkkk.......',
        '.........kkk........',
        '....................',
      ],
    },
    /* штормовой: серый вихрь синеет, в руке молния */
    storm_elemental: { base: 'air_elemental', tint: { l: 'c' }, extra: [[17, 5, 'y'], [18, 6, 'y'], [17, 7, 'y'], [18, 8, 'y'], [17, 9, 'y'], [18, 10, 'y']] },

    /* ---------- уровень 3: водяной элементаль 20×22 — волна с загнутым гребнем ---------- */
    water_elemental: {
      rows: [
        '.............kkkk...',
        '...........kkbbbbk..',
        '..........kbbbbbbbk.',
        '.........kbbbkkkbbk.',
        '........kbbbk..kbbk.',
        '.......kbbbk...kkk..',
        '......kbbbk.........',
        '.....kbbbk..........',
        '....kkbbk...........',
        '...kbbbbkkkkk.......',
        '..kbbbbbbbbbbk......',
        '..kbbwwwwbbbbbk.....',
        '..kbwkwkwwbbbbbk....',
        '..kbbwwwwbbbbbbk....',
        '..kbbbbbbbbbbbbk....',
        '..kbbBBBbbbBBBbk....',
        '..kbBBBBBBBBBBbk....',
        '...kBBBBBBBBBBk.....',
        '...kBBBBBBBBBk......',
        '....kkBBBBBkk.......',
        '......kkkkk.........',
        '....................',
      ],
    },
    /* ледяной: вода становится льдом, по гребню — сосульки */
    ice_elemental: { base: 'water_elemental', tint: { b: 'c', B: 'C' }, extra: [[6, 1, 'w'], [10, 1, 'w'], [8, 0, 'w'], [3, 4, 'w']] },

    /* ---------- уровень 4: огненный элементаль 22×24 — язык пламени ---------- */
    fire_elemental: {
      rows: [
        '..........kk..........',
        '.........kffk.........',
        '........kfffk.........',
        '.......kffffk.........',
        '.....kkfffffkk........',
        '....kfffffffffk.......',
        '...kffffffffffk.......',
        '...kffkFFFkfffk.......',
        '..kfffkFkFkffffk......',
        '..kfffkFFFkffffk......',
        '..kffffffffffffk......',
        '..kffFFffffFFffk......',
        '..kfFFFFffFFFFfk......',
        '...kFFFFFFFFFFk.......',
        '...kFFFFFFFFFk........',
        '....kFFFFFFFk.........',
        '....kFFoooFFk.........',
        '.....kFooooFk.........',
        '.....kooooook.........',
        '......kooook..........',
        '.......kookk..........',
        '.......kkkk...........',
        '......................',
        '......................',
      ],
    },
    /* энергетический: пламя выцветает в белый жар */
    energy_elemental: { base: 'fire_elemental', tint: { f: 'w', F: 'y', o: 'f' }, extra: [[10, 2, 'w'], [4, 6, 'w'], [17, 6, 'w']] },

    /* ---------- уровень 5: земляной элементаль 24×24 — валун на ногах ---------- */
    earth_elemental: {
      rows: [
        '........kkkkkk..........',
        '......kknnnnnnkk........',
        '....kknnnnnnnnnnk.......',
        '...knnnnnnnnnnnnnk......',
        '..knnnkkknnnkkknnnk.....',
        '..knnk.dknnk.dknnnk.....',
        '..knnk..knnk..knnnk.....',
        '.knnnnkknnnnkknnnnnk....',
        '.knnnnnnnnnnnnnnnnnk....',
        '.knnNNnnnnnnnnNNnnnk....',
        '.knNNNNnnnnnnNNNNnnk....',
        '.knnNNnnnnnnnnNNnnnk....',
        '..knnnnnnnnnnnnnnnk.....',
        '..kNNNNNNNNNNNNNNNk.....',
        '...kNNNNNNNNNNNNNk......',
        '....kkNNNNNNNNNkk.......',
        '......kNNNk.kNNk........',
        '.....kkNNNkkkNNkk.......',
        '.....kNNNNk.kNNNk.......',
        '.....kNNNNk.kNNNk.......',
        '.....kdddNk.kNdddk......',
        '....kkdddkk.kkdddkk.....',
        '....kkkkkk...kkkkk......',
        '........................',
      ],
    },
    /* магмовый: камень раскаляется, в трещинах — лава */
    magma_elemental: { base: 'earth_elemental', tint: { n: 'u', N: 'z', d: 'F' }, extra: [[8, 9, 'F'], [9, 10, 'f'], [14, 9, 'F'], [13, 10, 'f'], [11, 12, 'F']] },

    /* ---------- уровень 6: псионический элементаль 26×26 — мозг-облако с глазом ---------- */
    psychic_elemental: {
      rows: [
        '..........kkkkk...........',
        '.......kkkpppppkkk........',
        '.....kkppppppppppppk......',
        '....kppppPPpppPPppppk.....',
        '...kppppPPPpppPPPpppppk...',
        '..kpppppPPpppppPPpppppppk.',
        '..kppppppppppppppppppppppk',
        '..kpppkkkkppppkkkkpppppppk',
        '..kppkwwwwkppkwwwwkppppppk',
        '..kpkwwAAwwkkwwAAwwkpppppk',
        '..kpkwwAAwwkkwwAAwwkppppk.',
        '..kppkwwwwkppkwwwwkpppkk..',
        '...kppkkkkppppkkkkppppk...',
        '...kppppppppppppppppppk...',
        '....kppppPPPPPPPPppppk....',
        '....kpppPPPPPPPPPPppk.....',
        '.....kppPPPPPPPPPPpk......',
        '.....kpPPPPPPPPPPPk.......',
        '......kPPPPPPPPPPk........',
        '......kPPPkkkkPPPk........',
        '.....kkPPk...kPPkk........',
        '.....kPPPk...kPPPk........',
        '.....kPPPk...kPPPk........',
        '....kkPPkk...kkPPkk.......',
        '....kkkkk.....kkkkk.......',
        '..........................',
      ],
    },
    /* магический: фиолет уходит в светлую магию, в глазах — золото */
    magic_elemental: { base: 'psychic_elemental', tint: { p: 'A', P: 'a', w: 'w' }, extra: [[8, 9, 'y'], [9, 9, 'y'], [16, 9, 'y'], [17, 9, 'y']] },

    /* ---------- уровень 7: жар-птица 30×28 — распахнутые крылья, хвост ---------- */
    firebird: {
      rows: [
        '.....................kkk......',
        '....................koook.....',
        '...................kooyyk.....',
        '...kk..............koyyyk.....',
        '..kfk.............koyykkk.....',
        '..kfk......kkk...koyyk........',
        '..kffk....kfffk.koyyk.........',
        '..kffk...kffffkkoyyk..........',
        '..kfffkkkfffffkoyyk...........',
        '...kffffffffffkyyk............',
        '...kffffffffffkyk.............',
        '....kffffffffffk..............',
        '....kffFFFFFFffk..............',
        '.....kfFFFFFFFfk..............',
        '.....kFFFFFFFFFk..............',
        '.....kFFFFFFFFFk..............',
        '......kFFFFFFFk...............',
        '......kFFFFFFk................',
        '......kFFFFFk.................',
        '.....kkFFFFk..................',
        '....kFFkkFFk..................',
        '...kFFk.kFFk..................',
        '...kook.kook..................',
        '...kook.kook..................',
        '..kkookkkookk.................',
        '..kkkk...kkkk.................',
        '..............................',
        '..............................',
      ],
    },
    /* феникс: перья добела, хвост длиннее, корона искр */
    phoenix: { base: 'firebird', tint: { f: 'w', F: 'f', o: 'F', y: 'w' },
      extra: [[24, 1, 'w'], [25, 2, 'w'], [26, 3, 'w'], [22, 0, 'y'], [6, 4, 'w'], [3, 3, 'w']] },

  });
})();
