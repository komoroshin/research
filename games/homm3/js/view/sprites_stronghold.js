/* ============================================================================
   view/sprites_stronghold.js — спрайты существ фракции Stronghold (Цитадель).
   Формат см. docs/sprite-guide.md. Подключать после js/view/sprites.js.
   Существа: goblin, hobgoblin, wolf_rider, wolf_raider, orc, orc_chieftain,
             ogre, ogre_mage, roc, thunderbird, cyclops, cyclops_king,
             behemoth, ancient_behemoth.
   ========================================================================== */
(function () {
  H3.Sprites.defineMany({
    // ---------------------------------------------------------------- 1 уровень
    // Гоблин: маленький зелёный, большие уши, дубинка в правой руке. 18×20
    goblin: {
      rows: [
        '........kk....kkk.',
        '.......kggk..kTTnk',
        '.....kkhggGk.kTnnk',
        '..kkkghhggGGkkTnnk',
        '.kgggkhgwkgGk.kkkk',
        '..kkkgggggGGk.kNk.',
        '....kGgrwwrGk.kNk.',
        '.....kGGGGGk..kNk.',
        '......kkkkk..kggk.',
        '.....kkgggkgggggk.',
        '....kgkgggkkkkk...',
        '....kgkrrrkk......',
        '....kkkRrRk.......',
        '......kRRRk.......',
        '......kkkkk.......',
        '.....kGgkGgk......',
        '.....kGgkGgk......',
        '.....kNNkNNk......',
        '....kkNNkkNNk.....',
        '....kkkk.kkkk.....',
      ],
    },
    // Хобгоблин: тот же силуэт, красный шлем, коричневая набедренная повязка
    hobgoblin: {
      base: 'goblin',
      tint: { r: 'n', R: 'N' },
      extra: [
        [8, 0, 'k'], [9, 0, 'k'],
        [8, 1, 'r'], [9, 1, 'r'],
        [7, 2, 'r'], [8, 2, 'r'], [9, 2, 'r'], [10, 2, 'R'],
        [6, 3, 'R'], [7, 3, 'r'], [8, 3, 'r'], [9, 3, 'R'], [10, 3, 'R'],
        [7, 6, 'r'], [10, 6, 'R'],
      ],
    },

    // ---------------------------------------------------------------- 2 уровень
    // Наездник на волке: гоблин верхом на сером волке. 24×22
    wolf_rider: {
      rows: [
        '.........kk.............',
        '........kggk..k.........',
        '......kkhggGkkek........',
        '.....kghhgwkGkek........',
        '......kkggggGkNk........',
        '.......kGGGGkkNk........',
        '.......kkkkk.kNkkk..kk..',
        '.....kkrrrrkkkNkkEk.kEk.',
        '....kgkRrrRkgkNkEeekkeek',
        '....kgkRrrRkggNkEeeeeeek',
        '.....kkRRRkkkkkEleeewkek',
        '.kk.kkkkkgkkkkEEleeeeeek',
        'kEEkkEeekgkeeeEEleeeeeek',
        'kEEEkEeekNkeeeEEleeeeeek',
        'kkEEEEeeeeeeeeEEEeeekwk.',
        '.kkEEEEeeeeeeeeeeEEEkkk.',
        '..kkEEEEeeeeeeeeeEEEEk..',
        '...kkEEEkkEEEkkkEEEkEEk.',
        '...kEEk..kEEk..kEEk.kEEk',
        '...kEEk..kEEk..kEEk.kEEk',
        '..kkEEk..kEEk..kEEk.kEEk',
        '..kkkk...kkkk..kkkk.kkkk',
      ],
    },
    // Волчий налётчик: чёрный волк, красные доспехи у гоблина, злые глаза
    wolf_raider: {
      base: 'wolf_rider',
      tint: { e: 'u', E: 'z', l: 'e', g: 'H', h: 'g', G: 'j' },
      extra: [
        [20, 10, 'r'],
        [7, 7, 'e'], [10, 7, 'e'],
        [5, 8, 'r'], [12, 8, 'r'],
        [5, 9, 'r'], [12, 9, 'r'],
        [14, 2, 'l'], [14, 3, 'l'],
      ],
    },

    // ---------------------------------------------------------------- 3 уровень
    // Орк: зеленокожий, клыки, метательный топор в правой руке. 20×22
    orc: {
      rows: [
        '......kkkk..........',
        '.....kGGGGk......kk.',
        '....kGgggggk....kekk',
        '....kgghgggk...kleek',
        '....kgkgwkgk...kleek',
        '....kggggggk....kekk',
        '.....kGwgwGk.....kNk',
        '......kkkkk......kNk',
        '....kkkgggggkkk..kNk',
        '...kgggkgggggkgggkNk',
        '..kgggkkgggggkkgggkk',
        '..kggk.kgggggk.kggk.',
        '..kgk..kGgggGk..kkk.',
        '..kkk..kGgggGk......',
        '.......kknnnkk......',
        '......knnNnNnnk.....',
        '......kNnNnNnNk.....',
        '......kkkkkkkkk.....',
        '......kGggkGggk.....',
        '......kGggkGggk.....',
        '......kNNNkNNNk.....',
        '.....kkNNNkkNNNk....',
      ],
    },
    // Вождь орков: рогатый шлем, красный раскрас/доспех, топор побольше
    orc_chieftain: {
      base: 'orc',
      tint: { n: 'r', N: 'R' },
      extra: [
        [3, 0, 'k'], [12, 0, 'k'],
        [3, 1, 'k'], [4, 1, 'i'], [11, 1, 'i'], [12, 1, 'k'],
        [4, 2, 'I'], [11, 2, 'I'],
        [6, 1, 'r'], [7, 1, 'r'], [8, 1, 'r'], [9, 1, 'R'],
        [5, 2, 'r'], [10, 2, 'R'],
        [15, 1, 'k'], [16, 1, 'e'],
        [14, 2, 'k'], [15, 2, 'e'],
      ],
    },

    // ---------------------------------------------------------------- 4 уровень
    // Огр: толстый жёлто-коричневый великан с дубиной. 24×24
    ogre: {
      rows: [
        '.......kkkkk............',
        '......kNNNNNk......kkkk.',
        '.....kNtttttNk....kTTnnk',
        '.....kttyttttk...kkTnnnk',
        '.....ktytyyttk...kTnnnNk',
        '.....kttkwktnk...kknNNkk',
        '.....ktttttttnk...kkNNk.',
        '......kiyiyitnk....kNNk.',
        '......kknnnnnkk....kNNk.',
        '....kkkkkkkkkkkkk..kNNk.',
        '..kktttttkttttttkttkNNk.',
        '.kttttttktttttttktttNNk.',
        '.kttttkkttttttttkttttNk.',
        '.kttttkttttttttttkkttnk.',
        '.kntkknttttttttttnkkkkk.',
        '.kkkk.knttttttttttnnk...',
        '......knnNnNnNnNnNnnk...',
        '.....kkNnNnNnNnNnNNnkk..',
        '.....kNNnNnNnNnNnNNNNk..',
        '.....kkkkkkkkkkkkkkkkk..',
        '.....kntttk...kntttnk...',
        '.....knttnk...knttnnk...',
        '.....kNNNNk...kNNNNNk...',
        '....kkkkkkkk.kkkkkkkkk..',
      ],
    },
    // Огр-маг: синяя кожа, вместо дубины — посох со светящимся шаром
    ogre_mage: {
      base: 'ogre',
      tint: { t: 'b', y: 'c', n: 'B', N: 'P', T: 'y' },
      extra: [
        // убрать дубину
        [19, 1, '.'], [20, 1, '.'], [21, 1, '.'], [22, 1, '.'],
        [18, 2, '.'], [19, 2, '.'], [20, 2, '.'], [21, 2, '.'], [22, 2, '.'], [23, 2, '.'],
        [17, 3, '.'], [18, 3, '.'], [19, 3, '.'], [20, 3, '.'], [21, 3, '.'], [22, 3, '.'], [23, 3, '.'],
        [17, 4, '.'], [18, 4, '.'], [19, 4, '.'], [20, 4, '.'], [21, 4, '.'], [22, 4, '.'], [23, 4, '.'],
        [17, 5, '.'], [18, 5, '.'], [19, 5, '.'], [20, 5, '.'], [21, 5, '.'], [22, 5, '.'], [23, 5, '.'],
        [18, 6, '.'],
        // шар магии
        [20, 0, 'k'], [21, 0, 'k'],
        [19, 1, 'k'], [20, 1, 'A'], [21, 1, 'a'], [22, 1, 'k'],
        [19, 2, 'k'], [20, 2, 'a'], [21, 2, 'a'], [22, 2, 'k'],
        [20, 3, 'k'], [21, 3, 'k'],
        // посох
        [19, 4, 'k'], [20, 4, 'N'], [21, 4, 'N'], [22, 4, 'k'],
        [19, 5, 'k'], [20, 5, 'N'], [21, 5, 'N'], [22, 5, 'k'],
        [19, 6, 'k'], [20, 6, 'N'], [21, 6, 'N'], [22, 6, 'k'],
        [20, 7, 'N'], [21, 7, 'N'], [20, 8, 'N'], [21, 8, 'N'], [20, 9, 'N'], [21, 9, 'N'],
        [20, 10, 'N'], [21, 10, 'N'], [20, 11, 'N'], [21, 11, 'N'], [21, 12, 'N'],
        // золотой обруч на голове
        [7, 1, 'y'], [8, 1, 'y'], [9, 1, 'y'], [10, 1, 'y'], [11, 1, 'y'],
      ],
    },

    // ---------------------------------------------------------------- 5 уровень
    // Рух: огромная бурая птица с распахнутыми крыльями, летит. 28×28
    roc: {
      rows: [
        '.kk.........................',
        'knnkk.......................',
        'kNnnnkk.....................',
        '.kNnnnnkk...........kkk.....',
        '.kNnnnnnnkk........kttkk....',
        '..kNnnnnnnnkk.....kttttyk...',
        '..kNNnnnnnnnnkk...ktkttyyk..',
        '...kNNnnnnnnnnnkk.kttttyyyk.',
        '...kNNNnnnnnnnnnnkkttttkyyk.',
        '....kNNNnnnnnnnnnnnttttk.kk.',
        '....kkNNNnnnnnnnnnnnttttk...',
        '.....kkNNNnnnnnnnnnnttttk...',
        '......kkNNNnnnnnnnnttttkk...',
        '.......kkNNNnnnnnnnttttk....',
        '........kkNNNnnnnnnnttkk....',
        '.........kkNNNnnnnnnnkk.....',
        '..........kkNNnnnnnNNk......',
        '...........kkNnnnNNNk.......',
        '............kNNNNNNk........',
        '............kkNNNNk.........',
        '..........kkNkkNNk..........',
        '.........kNNk.kNNk..........',
        '........kNNk..kyyk..........',
        '........kkk...kyyk..........',
        '..............kykkk.........',
        '..............kkkkk.........',
        '............................',
        '............................',
      ],
    },
    // Птица грома: синяя раскраска, молнии из крыльев
    thunderbird: {
      base: 'roc',
      tint: { n: 'b', N: 'B', t: 'c', y: 'y' },
      extra: [
        [3, 12, 'y'], [4, 13, 'y'], [3, 14, 'y'], [4, 15, 'y'], [3, 16, 'y'],
        [6, 15, 'y'], [7, 16, 'y'], [6, 17, 'y'], [7, 18, 'y'],
        [26, 12, 'y'], [25, 13, 'y'], [26, 14, 'y'], [25, 15, 'y'],
        [22, 7, 'w'],
      ],
    },

    // ---------------------------------------------------------------- 6 уровень
    // Циклоп: одноглазый великан, камень в поднятой правой руке. 28×28
    cyclops: {
      rows: [
        '.....................kkkk...',
        '....................kIiiIk..',
        '..........kkkk.....kIiiiIIk.',
        '.........kNNNNk....kIiIIIIk.',
        '........kNNNNNNk...kkIIIIk..',
        '.......kNsssssSk....kkkkkk..',
        '.......ksssssssk....kssk....',
        '.......ksskkkssk....kssk....',
        '.......kskwwBksk...kssk.....',
        '.......ksskkkssk...kssk.....',
        '.......ksssssssk..kssk......',
        '.......kSiSiSiSk..kssk......',
        '........kSSSSSk..kssk.......',
        '........kkSSSkkkkssk........',
        '.....kkkkssssssssssk........',
        '....kssskssssssssskk........',
        '...kssskssssssssssk.........',
        '...kssskssssssssssk.........',
        '...kssskSsssssssssk.........',
        '...kskkSSssssssssSk.........',
        '...kkk.kSsssssssSSk.........',
        '......kkSSrrrrrrSkk.........',
        '......kSrRrRrRrRrSk.........',
        '......kSRrRrRrRrRSk.........',
        '......kkkkkkkkkkkkk.........',
        '......kSsssk..kSsssk........',
        '......kSsssk..kSsssk........',
        '.....kkkkkkk..kkkkkkk.......',
      ],
    },
    // Король циклопов: золотая корона, красная повязка становится алой с золотом, зелёная кожа темнее
    cyclops_king: {
      base: 'cyclops',
      tint: { s: 't', S: 'n' },
      extra: [
        [8, 1, 'k'], [10, 1, 'k'], [12, 1, 'k'], [14, 1, 'k'],
        [8, 2, 'y'], [10, 2, 'y'], [12, 2, 'y'], [14, 2, 'y'],
        [9, 2, 'k'], [11, 2, 'k'], [13, 2, 'k'],
        [8, 3, 'k'], [9, 3, 'y'], [10, 3, 'y'], [11, 3, 'Y'], [12, 3, 'y'], [13, 3, 'Y'], [14, 3, 'k'],
        [9, 4, 'Y'], [10, 4, 'Y'], [11, 4, 'Y'], [12, 4, 'Y'], [13, 4, 'Y'],
        [8, 5, 'k'], [14, 5, 'k'],
      ],
    },

    // ---------------------------------------------------------------- 7 уровень
    // Чудище: огромный медведеподобный зверь с когтями, четыре лапы. 32×32
    behemoth: {
      rows: [
        '................................',
        '................................',
        '......kkkkkkk...................',
        '....kknnnnnnnkk.................',
        '...knnnnnnnnnnnkkk..............',
        '..knnnnnnnnnnnnnnnkkkk..........',
        '.knnnnnnnnnnnnnnnnnnnnkk........',
        '.knNnnnnnnnnnnnnnnnnnnnnkk......',
        'knNNnnnnnnnnnnnnnnnnnnnnnnk.....',
        'kNNNnnnnnnnnnnnnnnnnnnnnnnnk....',
        'kNNNNnnnnnnnnnnnnnnnnnnnnnnnk...',
        'kNNNNnnnnnnnnnnnnnnnnkkkkkkkkk..',
        'kNNNNNnnnnnnnnnnnnnnkNNnnnnnnkk.',
        '.kNNNNNnnnnnnnnnnnnkNnnnnnnnnnnk',
        '.kNNNNNNnnnnnnnnnnnkNnnkwknnnnnk',
        '..kNNNNNNnnnnnnnnnnkNnnkkknnnnnk',
        '..kNNNNNNNnnnnnnnnnkNNnnnnnnnnnk',
        '...kNNNNNNNnnnnnnnnkkNNnnnnnnnkk',
        '...kNNNNNNNNnnnnnnnnkkNNnwnwnkk.',
        '....kNNNNNNNNNnnnnnnnkkNNNNNkk..',
        '....kNNNNNNNNNNNnnnnnnkkkkkkk...',
        '.....kNNNNNNkkkNNNNNNNNNk.......',
        '.....kNNNNNk...kNNNNNNNNNk......',
        '.....kNNNNk.....kNNNNNNNNk......',
        '....kkNNNNk.....kNNNNkNNNNk.....',
        '....kNNNNk......kNNNk.kNNNk.....',
        '....kNNNNk......kNNNk.kNNNk.....',
        '...kkNNNNk.....kkNNNk.kNNNNk....',
        '...kNNNNNk.....kNNNNk.kNNNNk....',
        '..kkNNNNkk....kkNNNkk.kkNNNkk...',
        '.kiikiikk....kiikiikk.kiikiikk..',
        'kiikiikk....kiikiikk.kiikiikkk..',
      ],
    },
    // Древнее чудище: чёрно-серое, когти длиннее и белее, красные глаза
    ancient_behemoth: {
      base: 'behemoth',
      tint: { n: 'u', N: 'z', i: 'L' },
      extra: [
        [24, 14, 'r'], [25, 18, 'r'], [27, 18, 'r'],
        [0, 29, 'k'], [1, 29, 'L'], [2, 29, 'L'],
        [0, 30, 'L'], [3, 30, 'L'], [1, 31, 'L'],
        [12, 29, 'k'], [13, 29, 'L'], [12, 30, 'L'],
        [21, 29, 'k'], [22, 29, 'L'], [21, 30, 'L'],
        [29, 31, 'L'], [30, 30, 'k'], [30, 31, 'L'], [31, 31, 'k'],
      ],
    },
  });
})();
