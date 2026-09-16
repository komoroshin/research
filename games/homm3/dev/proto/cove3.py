# -*- coding: utf-8 -*-
"""js/view/sprites_cove_hd.js — Бухта в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- нимфа 52×71 ----------------
c = Fig(52, 71)
CX = 24
for i, (w, y) in enumerate(((16, 62), (18, 68))):                                 # гребень волны вместо ног
    c.ellipse(CX + (i % 2 * 2 - 1) * 3, y, w, 6, 'C')
    c.ellipse(CX + (i % 2 * 2 - 1) * 3, y - 2, w * 0.8, 3, 'c')
for x in range(CX - 16, CX + 17, 6): c.ellipse(x, 58, 4.5, 3, 'w')               # пена
c.ellipse(CX, 40, 11, 14, 'v'); c.ellipse(CX - 3, 36, 7.5, 9, 'w')
c.rect(CX - 15, 34, CX - 10, 46, 'v'); c.rect(CX + 10, 34, CX + 15, 46, 'v')
c.ellipse(CX - 13, 47, 3.2, 2.8, 'v'); c.ellipse(CX + 13, 47, 3.2, 2.8, 'v')
c.face(CX, 18, 8, 'v', 'q', eye='k')
c.ellipse(CX, 11, 10, 7, 'q'); c.fur(CX - 10, 12, CX + 10, 34, 'Q', step=3, length=18)  # бирюзовые волосы
B.append(emit('nymph', c, 'нимфа: мятная кожа, бирюзовые волосы прядями, гребень волны с пеной вместо ног'))
B.append(upg('oceanid', 'океанида: голубая кожа, светлые волосы, жемчуг в причёске', 'nymph',
             {'v': 'c', 'q': 'C', 'Q': 'b', 'w': 'L'}, extra=[(20, 8, 'w'), (26, 7, 'w')]))

# ---------------- матрос 55×71 ----------------
c = Fig(55, 71)
CX = 22
c.rect(CX - 11, 30, CX + 11, 48, 'w')                                             # тельняшка
for y in range(31, 48, 4): c.rect(CX - 11, y, CX + 11, y + 1, 'b')
c.rect(CX - 12, 46, CX + 12, 50, 'N'); c.rect(CX - 12, 46, CX + 12, 46, 'n')
c.rect(CX - 16, 32, CX - 11, 46, 'w'); c.rect(CX + 11, 32, CX + 16, 46, 'w')
for y in range(33, 46, 4):
    c.rect(CX - 16, y, CX - 11, y + 1, 'b'); c.rect(CX + 11, y, CX + 16, y + 1, 'b')
c.ellipse(CX - 14, 47, 3.4, 3, 'S'); c.ellipse(CX + 14, 47, 3.4, 3, 'S')
c.legs_bare(CX, 51, 70, 'b', 'B', boot=('D', 'N'), gap=4)                        # синие штаны
c.face(CX, 18, 8, 'S', 'T', eye='k')
c.rect(CX - 9, 11, CX + 9, 15, 'r'); c.rect(CX - 9, 11, CX + 9, 12, 'o')         # красная бандана
c.poly([(CX + 7, 13), (CX + 14, 18), (CX + 8, 17)], 'r')
c.poly([(CX + 18, 30), (CX + 32, 44), (CX + 29, 48), (CX + 16, 34)], 'l')        # сабля
c.line(CX + 19, 32, CX + 30, 45, 'w')
c.rect(CX + 14, 28, CX + 19, 33, 'Y')
B.append(emit('crew_mate', c, 'матрос: красная бандана, тельняшка полосами, синие штаны, сабля'))
B.append(upg('seaman', 'моряк: синяя бандана, кожаный жилет, тесак', 'crew_mate',
             {'r': 'b', 'o': 'c', 'b': 'N', 'B': 'D'}))

# ---------------- пират 68×80 ----------------
c = Fig(68, 80)
CX = 26
c.rect(CX - 13, 32, CX + 13, 56, 'r'); c.rect(CX - 13, 32, CX - 10, 56, 'R')
c.rect(CX + 10, 32, CX + 13, 56, 'R')
c.rivets(CX - 10, 36, CX + 10, 'y', 6); c.rivets(CX - 10, 50, CX + 10, 'y', 6)   # пуговицы камзола
c.rect(CX - 4, 32, CX - 1, 56, 'w')                                               # рубаха в разрезе
c.rect(CX - 14, 52, CX + 14, 57, 'D'); c.rect(CX - 5, 51, CX + 4, 58, 'Y')
c.rect(CX - 19, 34, CX - 13, 52, 'r'); c.rect(CX + 13, 30, CX + 19, 44, 'r')
c.ellipse(CX - 17, 53, 3.6, 3, 'S')
c.legs_bare(CX, 58, 79, 'N', 'D', boot=('u', 'E'), gap=5)
c.face(CX, 18, 8.5, 'S', 'T', eye='k', beard='N')
c.rect(CX - 8, 16, CX - 2, 19, 'u')                                               # повязка на глазу
c.line(CX - 9, 14, CX + 8, 17, 'u')
c.poly([(CX - 15, 12), (CX + 15, 12), (CX + 9, 4), (CX - 9, 4)], 'u')            # треуголка
c.poly([(CX - 13, 11), (CX + 13, 11), (CX + 8, 6), (CX - 8, 6)], 'E')
c.rect(CX - 16, 11, CX + 16, 13, 'u')
c.rect(CX + 19, 34, CX + 32, 37, 'N'); c.rect(CX + 26, 32, CX + 34, 36, 'E')     # пистолет вперёд
c.rect(CX + 22, 37, CX + 26, 42, 'N')
c.poly([(CX + 16, 46), (CX + 26, 68), (CX + 22, 70), (CX + 13, 48)], 'l')        # сабля к земле
c.rect(CX + 12, 43, CX + 18, 48, 'Y')
B.append(emit('pirate', c, 'пират: треуголка, повязка на глазу, борода, камзол с пуговицами, пистолет и сабля'))
B.append(upg('corsair', 'корсар: синий камзол, золотая оторочка, два пистолета', 'pirate',
             {'r': 'b', 'R': 'B', 'y': 'f'}, extra=[(52, 50, 'E'), (53, 50, 'N'), (54, 51, 'E')]))

# ---------------- штормовая птица 82×65 ----------------
c = Fig(82, 65)
BX, BY = 40, 36
c.wing_feather(BX - 6, BY - 8, 40, 30, 'e', 'l', 'w', 'E', n=9, flip=True, a0=118, a1=32)
c.wing_feather(BX + 6, BY - 8, 40, 30, 'e', 'l', 'w', 'E', n=9, a0=118, a1=32)
c.ellipse(BX, BY + 2, 12, 14, 'w'); c.ellipse(BX - 3, BY - 2, 8, 9, 'L')
for s in (-1, 1): c.poly([(BX + s * 4, BY + 14), (BX + s * 18, BY + 26), (BX + s * 2, BY + 22)], 'e')  # вилка хвоста
for s in (-1, 1):
    c.rect(BX + s * 6 - 2, BY + 14, BX + s * 6 + 2, BY + 22, 'y')
    c.claws(BX + s * 6 - 3, BY + 22, 3, 'Y', 3, 3)
c.ellipse(BX, BY - 14, 8, 7, 'w'); c.ellipse(BX - 2, BY - 16, 5.5, 5, 'L')
c.poly([(BX - 7, BY - 14), (BX - 17, BY - 12), (BX - 7, BY - 9)], 'y')
c.ellipse(BX - 3, BY - 17, 2.6, 2.2, 'k')
B.append(emit('stormbird', c, 'штормовая птица: крылья веером с тёмными концами, вилка хвоста, жёлтый клюв'))
B.append(upg('ayssid', 'айссид: грозово-синее перо, молнии на концах крыльев', 'stormbird',
             {'w': 'c', 'L': 'w', 'e': 'b', 'l': 'C', 'E': 'B'}))

# ---------------- морская ведьма 73×89 ----------------
c = Fig(73, 89)
CX = 30
c.poly([(CX - 14, 32), (CX + 14, 32), (CX + 19, 86), (CX - 19, 86)], 'p')        # фиолетовая мантия
c.poly([(CX - 14, 32), (CX - 4, 32), (CX - 9, 86), (CX - 19, 86)], 'P')
c.folds(CX - 15, 38, CX + 15, 85, 'P', 4)
for x in range(CX - 18, CX + 19, 6):                                              # волна по подолу
    c.ellipse(x, 86, 4.5, 3.5, 'C'); c.ellipse(x, 85, 3, 2, 'c')
c.rect(CX - 18, 36, CX - 13, 52, 'p'); c.rect(CX + 13, 36, CX + 18, 52, 'p')
c.ellipse(CX - 16, 53, 3.4, 3, 'v'); c.ellipse(CX + 16, 53, 3.4, 3, 'v')
c.face(CX, 20, 8.5, 'v', 'q', eye='y')
c.ellipse(CX, 12, 11, 7, 'Q'); c.fur(CX - 11, 13, CX + 11, 38, 'q', step=3, length=20)
SX = CX + 22
c.rect(SX - 1, 16, SX + 1, 86, 'N'); c.rect(SX - 1, 16, SX - 1, 86, 'n')
c.ellipse(SX, 11, 6, 6, 'w'); c.ellipse(SX - 1, 9, 3.5, 3.5, 'L')                # жемчужина
c.ellipse(SX, 16, 4.5, 2.2, 'Y')
B.append(emit('sea_witch', c, 'морская ведьма: мантия со складками, волна по подолу, посох с жемчужиной'))
B.append(upg('sorceress', 'чародейка: тёмно-синяя мантия, золотая оторочка, жемчужина ярче', 'sea_witch',
             {'p': 'b', 'P': 'B', 'N': 'y', 'n': 'f', 'w': 'A'}))

# ---------------- никс 72×92 ----------------
c = Fig(72, 92)
CX = 30
c.rect(CX - 14, 34, CX + 14, 60, 'e'); c.scales(CX - 14, 34, CX + 14, 60, 'l', 4)  # чешуйчатые латы
c.rect(CX - 15, 58, CX + 15, 63, 'E')
c.pauldrons(CX, 34, 17, 'e', 'l', 'E', lames=2)
c.rect(CX - 22, 38, CX - 16, 54, 'v'); c.rect(CX + 16, 38, CX + 22, 54, 'v')
c.ellipse(CX - 20, 55, 3.6, 3, 'v'); c.ellipse(CX + 20, 55, 3.6, 3, 'v')
c.legs_bare(CX, 63, 91, 'v', 'q', gap=5)
c.ellipse(CX, 20, 10, 11, 'v'); c.ellipse(CX - 3, 17, 7, 7, 'w')
c.ellipse(CX - 4, 20, 2.6, 2.2, 'k'); c.ellipse(CX + 4, 20, 2.6, 2.2, 'k')
for i in range(5):                                                                # гребень-плавник
    c.poly([(CX - 8 + i * 4, 10), (CX - 6 + i * 4, 1), (CX - 4 + i * 4, 10)], 'q')
    c.poly([(CX - 7 + i * 4, 10), (CX - 6 + i * 4, 4), (CX - 5 + i * 4, 10)], 'C')
TX = CX + 26                                                                       # трезубец
c.rect(TX - 1, 18, TX + 1, 84, 'Y'); c.rect(TX - 1, 18, TX - 1, 84, 'y')
for dx in (-6, 0, 6): c.poly([(TX + dx - 2, 18), (TX + dx, 4), (TX + dx + 2, 18)], 'y')
c.rect(TX - 8, 17, TX + 8, 20, 'Y')
c.ellipse(CX - 24, 44, 11, 13, 'i')                                                # щит-раковина
for i in range(5): c.line(CX - 24, 32, CX - 32 + i * 4, 56, 'I')
B.append(emit('nix', c, 'никс: гребень-плавник, чешуйчатые латы, трезубец, щит-раковина'))
B.append(upg('nix_warrior', 'воин-никс: тёмная чешуя, золотые латы, красный гребень', 'nix',
             {'e': 'y', 'l': 'f', 'E': 'Y', 'q': 'r', 'C': 'o'}))

# ---------------- морской змей 97×92 ----------------
c = Fig(97, 92)
CX = 48
c.ellipse(CX + 6, 76, 30, 10, 'Q')                                                # тёмная задняя петля
c.ellipse(CX + 6, 73, 26, 5, 'q')
for i, (w, y) in enumerate(((24, 62), (21, 50), (17, 38))):                       # тело кольцами
    ox = (i % 2 * 2 - 1) * 6
    c.ellipse(CX + ox, y, w, 8, 'q')
    c.ellipse(CX + ox, y - 2.5, w * 0.82, 4, 'v')
    c.ellipse(CX + ox, y + 4, w * 0.86, 2.4, 'Q')
c.scales(CX - 26, 30, CX + 26, 70, 'v', 5, only='q')
c.ellipse(CX - 16, 22, 13, 11, 'q'); c.ellipse(CX - 19, 19, 9, 7, 'v')            # голова
c.poly([(CX - 24, 22), (CX - 38, 26), (CX - 24, 30)], 'q')                        # морда
c.rect(CX - 37, 27, CX - 22, 30, 'R')
for x in range(int(CX - 36), int(CX - 22), 3):
    c.rect(x, 24, x + 1, 27, 'i'); c.rect(x + 1, 30, x + 2, 33, 'i')
c.ellipse(CX - 22, 18, 3.2, 2.8, 'y'); c.ellipse(CX - 22, 18, 1.6, 1.6, 'k')
for i in range(6):                                                                 # гребень
    c.poly([(CX - 14 + i * 4, 12), (CX - 12 + i * 4, 2), (CX - 10 + i * 4, 12)], 'C')
B.append(emit('sea_serpent', c, 'морской змей: тело кольцами чешуёй, гребень, раскрытая пасть с зубами'))
B.append(upg('haspid', 'хаспид: багровая чешуя, золотой гребень', 'sea_serpent',
             {'q': 'R', 'v': 'r', 'Q': 'D', 'C': 'y'}))

write('cove', 'существа Бухты', B, 'cove3.py')
