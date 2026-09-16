# -*- coding: utf-8 -*-
"""js/view/sprites_stronghold_hd.js — Цитадель в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- гоблин 52×68 ----------------
c = Fig(52, 68)
CX = 22
c.ellipse(CX, 40, 11, 13, 'g'); c.ellipse(CX, 44, 8, 8, 'h')                     # пузо
c.rect(CX - 12, 46, CX + 12, 50, 'r'); c.rect(CX - 12, 46, CX + 12, 46, 'o')    # красная повязка
c.rect(CX - 16, 32, CX - 11, 46, 'g'); c.rect(CX + 11, 32, CX + 16, 46, 'g')
c.rect(CX + 14, 32, CX + 16, 46, 'G')
c.ellipse(CX - 14, 47, 3.4, 3, 'g'); c.ellipse(CX + 14, 47, 3.4, 3, 'g')
c.legs_bare(CX, 52, 67, 'g', 'G', gap=4)
c.ellipse(CX, 18, 10, 10, 'g'); c.ellipse(CX - 2, 15, 6.5, 6, 'h')
c.poly([(CX - 8, 16), (CX - 20, 6), (CX - 4, 12)], 'g')                          # большие уши
c.poly([(CX + 8, 16), (CX + 20, 6), (CX + 4, 12)], 'g')
c.poly([(CX - 7, 17), (CX - 17, 9), (CX - 5, 14)], 'G')
c.ellipse(CX - 4, 18, 2.6, 2.2, 'y'); c.ellipse(CX + 4, 18, 2.6, 2.2, 'y')
c.rect(CX - 6, 23, CX + 5, 25, 'D')
for x in range(CX - 5, CX + 5, 3): c.rect(x, 23, x + 1, 24, 'i')
CLB = CX + 19                                                                     # дубинка
c.rect(CLB - 2, 34, CLB + 2, 62, 'N'); c.rect(CLB - 2, 34, CLB - 1, 62, 'n')
c.ellipse(CLB, 31, 5.5, 6.5, 'N'); c.ellipse(CLB - 1, 29, 3.6, 4, 'n')
B.append(emit('goblin', c, 'гоблин: большие уши, клыки, красная повязка, дубинка'))
B.append(upg('hobgoblin', 'хобгоблин: рослый, бурая кожа, стальной шлем', 'goblin',
             {'g': 'H', 'h': 'h', 'G': 'j'}, extra=[(20, 8, 'e'), (21, 7, 'e'), (23, 7, 'e'), (24, 8, 'e')]))

# ---------------- наездник на волке 86×71 ----------------
c = Fig(86, 71)
c.horse(38, 44, 48, 22, 'e', 'l', 'E', mane='E', head_left=True, legs=True)
c.fur(16, 34, 44, 56, 'E', step=4, length=12)                                     # шерсть волка
c.ellipse(15, 33, 4, 3.2, 'E')
c.rect(6, 34, 12, 36, 'u')                                                        # пасть волка
for x in range(7, 12, 2): c.rect(x, 34, x + 1, 36, 'i')
RX = 34
c.ellipse(RX, 24, 9, 10, 'g'); c.ellipse(RX - 2, 21, 6, 6.5, 'h')
c.rect(RX - 12, 22, RX - 8, 32, 'g'); c.rect(RX + 8, 22, RX + 12, 32, 'g')
c.rect(RX - 10, 30, RX + 10, 33, 'r')
c.ellipse(RX, 10, 8, 8, 'g'); c.ellipse(RX - 2, 8, 5, 5, 'h')
c.poly([(RX - 7, 9), (RX - 16, 2), (RX - 4, 6)], 'g'); c.poly([(RX + 7, 9), (RX + 16, 2), (RX + 4, 6)], 'g')
c.ellipse(RX - 3, 10, 2.2, 2, 'y'); c.ellipse(RX + 3, 10, 2.2, 2, 'y')
c.spear(RX + 16, 0, 46, 'n', 'N', 'l', 'e', blade_len=11)
B.append(emit('wolf_rider', c, 'наездник на волке: волк с шерстью прядями, гоблин с копьём', flipx=True))
B.append(upg('wolf_raider', 'волчий налётчик: бурый волк, два копья, шлем', 'wolf_rider',
             {'e': 'n', 'l': 'T', 'E': 'N'}, extra=[(52, 4, 'l'), (53, 3, 'l'), (54, 5, 'e')]))

# ---------------- орк 64×80 ----------------
c = Fig(64, 80)
CX = 28
c.rect(CX - 14, 32, CX + 14, 58, 'G'); c.ellipse(CX, 40, 10, 10, 'g')
c.rect(CX - 14, 32, CX - 10, 58, 'j'); c.rect(CX + 10, 32, CX + 14, 58, 'j')
c.poly([(CX - 13, 34), (CX + 13, 34), (CX + 11, 52), (CX - 11, 52)], 'N')        # кожаная броня
c.rect(CX - 11, 36, CX + 10, 50, 'n'); c.planks(CX - 11, 37, CX + 10, 50, 'N', 5)
c.rivets(CX - 9, 38, CX + 9, 'T', 6); c.rivets(CX - 9, 48, CX + 9, 'T', 6)
c.rect(CX - 15, 56, CX + 15, 61, 'N')
c.rect(CX - 21, 36, CX - 15, 54, 'G'); c.rect(CX + 15, 36, CX + 21, 54, 'G')
c.ellipse(CX - 19, 55, 3.6, 3, 'g'); c.ellipse(CX + 19, 55, 3.6, 3, 'g')
c.legs_bare(CX, 61, 79, 'G', 'j', boot=('D', 'N'), gap=5)
c.ellipse(CX, 18, 11, 11, 'G'); c.ellipse(CX - 3, 15, 7, 6.5, 'g')
c.ellipse(CX - 4, 18, 2.6, 2.2, 'r'); c.ellipse(CX + 4, 18, 2.6, 2.2, 'r')
c.rect(CX - 8, 24, CX + 7, 26, 'D')
c.rect(CX - 6, 22, CX - 4, 26, 'i'); c.rect(CX + 4, 22, CX + 6, 26, 'i')         # клыки вверх
AX = CX + 24                                                                      # метательный топор
c.rect(AX - 1, 30, AX + 1, 52, 'N')
c.poly([(AX - 9, 28), (AX, 22), (AX + 1, 38), (AX - 8, 40)], 'e')
c.poly([(AX - 8, 29), (AX - 1, 24), (AX - 1, 36), (AX - 7, 38)], 'l')
B.append(emit('orc', c, 'орк: клыки вверх, кожаная броня с заклёпками, метательный топор'))
B.append(upg('orc_chieftain', 'вождь орков: тёмная кожа, красная броня, два топора', 'orc',
             {'G': 'j', 'g': 'H', 'n': 'r', 'N': 'R'}))

# ---------------- огр 73×86 ----------------
c = Fig(73, 86)
CX = 32
c.ellipse(CX, 46, 20, 22, 'T'); c.ellipse(CX + 2, 52, 15, 14, 't')               # огромный живот
c.rect(CX - 20, 56, CX + 20, 62, 'N'); c.fur(CX - 19, 56, CX + 19, 62, 'D', step=4, length=6)
c.rect(CX - 27, 34, CX - 19, 58, 'T'); c.rect(CX + 19, 30, CX + 27, 54, 'T')
c.rect(CX - 27, 34, CX - 25, 58, 't'); c.rect(CX + 25, 30, CX + 27, 54, 'N')
c.ellipse(CX - 24, 59, 4.5, 4, 'T'); c.ellipse(CX + 24, 55, 4.5, 4, 'T')
c.legs_bare(CX, 64, 85, 'T', 'N', gap=7)
c.ellipse(CX, 20, 13, 13, 'T'); c.ellipse(CX - 3, 17, 8, 8, 't')
c.ellipse(CX - 5, 20, 2.8, 2.4, 'k'); c.ellipse(CX + 5, 20, 2.8, 2.4, 'k')
c.rect(CX - 9, 27, CX + 8, 29, 'D')
c.rect(CX - 7, 25, CX - 5, 29, 'i'); c.rect(CX + 5, 25, CX + 7, 29, 'i')
c.ellipse(CX, 10, 12, 5, 'N')                                                     # клок волос
CLB = CX + 30
c.rect(CLB - 3, 28, CLB + 3, 84, 'N'); c.rect(CLB - 3, 28, CLB - 1, 84, 'n')
c.ellipse(CLB, 24, 8, 9, 'N'); c.ellipse(CLB - 1, 21, 5.5, 6, 'n')
B.append(emit('ogre', c, 'огр: огромный живот, повязка из шкуры, клыки, дубина'))
B.append(upg('ogre_mage', 'огр-маг: синяя кожа, костяные бусы, посох вместо дубины', 'ogre',
             {'T': 'b', 't': 'c', 'N': 'P', 'n': 'p'}, extra=[(28, 32, 'i'), (32, 33, 'i'), (36, 32, 'i')]))

# ---------------- рух 96×86 ----------------
c = Fig(96, 86)
BX, BY = 48, 50
c.wing_feather(BX - 6, BY - 10, 46, 34, 'N', 'n', 'T', 'D', n=10, flip=True, a0=118, a1=26)
c.wing_feather(BX + 6, BY - 10, 46, 34, 'N', 'n', 'T', 'D', n=10, a0=118, a1=26)
c.ellipse(BX, BY + 2, 15, 18, 'n'); c.ellipse(BX - 3, BY - 2, 11, 12, 'T')
c.scales(BX - 14, BY - 12, BX + 14, BY + 16, 'T', 5, only='n')
for s in (-1, 1):                                                                 # лапы вперёд
    c.rect(BX + s * 8 - 3, BY + 18, BX + s * 8 + 3, BY + 30, 'y')
    for y in range(BY + 20, BY + 30, 3): c.rect(BX + s * 8 - 3, y, BX + s * 8 + 3, y, 'Y')
    c.rect(BX + s * 8 - 6, BY + 30, BX + s * 8 + 6, BY + 34, 'y')
    c.claws(BX + s * 8 - 6, BY + 34, 3, 'i', 5, 5)
c.ellipse(BX, BY - 20, 11, 10, 'n'); c.ellipse(BX - 3, BY - 23, 7, 6.5, 'T')
c.poly([(BX - 10, BY - 20), (BX - 22, BY - 17), (BX - 10, BY - 13)], 'y')        # клюв
c.poly([(BX - 10, BY - 20), (BX - 20, BY - 18), (BX - 10, BY - 16)], 'Y')
c.ellipse(BX - 5, BY - 24, 3, 2.6, 'y'); c.ellipse(BX - 5, BY - 24, 1.5, 1.5, 'k')
B.append(emit('roc', c, 'рух: распахнутые крылья веером, жёлтый клюв, лапы с когтями вперёд'))
B.append(upg('thunderbird', 'громовая птица: синее перо, искры на кончиках крыльев', 'roc',
             {'n': 'b', 'N': 'B', 'T': 'c', 'D': 'P'}, extra=[(6, 18, 'w'), (88, 18, 'w')]))

# ---------------- циклоп 78×92 ----------------
c = Fig(78, 92)
CX = 34
c.rect(CX - 17, 36, CX + 17, 64, 'T'); c.ellipse(CX, 46, 12, 12, 't')
c.rect(CX - 17, 36, CX - 13, 64, 't'); c.rect(CX + 13, 36, CX + 17, 64, 'N')
c.rect(CX - 18, 62, CX + 18, 68, 'r'); c.rect(CX - 18, 62, CX + 18, 63, 'o')     # красная повязка
c.rect(CX - 26, 40, CX - 18, 62, 'T'); c.rect(CX - 26, 40, CX - 24, 62, 't')
c.rect(CX + 18, 22, CX + 26, 48, 'T'); c.rect(CX + 24, 22, CX + 26, 48, 'N')     # рука с камнем
c.ellipse(CX - 23, 63, 4.5, 4, 'T')
c.ellipse(CX + 22, 16, 9, 8, 'e'); c.ellipse(CX + 20, 14, 6, 5, 'l')             # камень
c.legs_bare(CX, 68, 91, 'T', 'N', gap=7)
c.ellipse(CX, 22, 14, 14, 'T'); c.ellipse(CX - 4, 18, 9, 8, 't')
c.ellipse(CX, 21, 7, 6, 'w'); c.ellipse(CX, 21, 4.5, 4, 'h')                     # единственный глаз
c.ellipse(CX, 21, 2.4, 2.4, 'k')
c.rect(CX - 9, 13, CX + 8, 15, 'N')
c.rect(CX - 8, 30, CX + 7, 32, 'D')
c.rect(CX - 6, 28, CX - 4, 32, 'i'); c.rect(CX + 4, 28, CX + 6, 32, 'i')
B.append(emit('cyclops', c, 'циклоп: единственный глаз с радужкой, красная повязка, камень в поднятой руке'))
B.append(upg('cyclops_king', 'король циклопов: серая кожа, золотая повязка, костяные бусы', 'cyclops',
             {'T': 'e', 't': 'l', 'N': 'E', 'r': 'y', 'o': 'f'}))

# ---------------- чудище 98×71 ----------------
c = Fig(98, 71)
MX, MY = 46, 40
c.ellipse(MX, MY, 30, 16, 'n')
c.ellipse(MX + 14, MY - 10, 14, 9, 'n')                                           # горб
c.ellipse(MX - 6, MY - 5, 23, 9, 'd')
c.ellipse(MX + 2, MY + 8, 24, 8, 'N')
c.fur(MX - 24, MY - 12, MX + 20, MY - 2, 'N', step=5, length=9)
for x in range(MX + 1, MX + 14, 5): c.line(x, MY + 1, x + 2, MY + 7, 'd')
for i, x in enumerate(range(MX - 20, MX + 16, 6)):
    hgt = 4 + (i * 5 % 5)
    c.poly([(x, MY - 12), (x + 3, MY - 12 - hgt), (x + 6, MY - 11)], 'T')
    c.poly([(x + 1, MY - 12), (x + 3, MY - 11 - hgt), (x + 3, MY - 12)], 'I')
for x0, fr in ((MX - 20, 0), (MX - 10, 1), (MX + 12, 1), (MX + 21, 0)):
    c.ellipse(x0, MY + 15, 6.5, 10, 'n' if fr else 'd')
    c.paw(x0, MY + 24, 6, 'n' if fr else 'd', 't', 'i', 4)
for x0 in (MX - 10, MX + 12):                                                     # костяные наручи
    c.rect(x0 - 7, MY + 17, x0 + 7, MY + 21, 'T')
    c.rect(x0 - 7, MY + 17, x0 + 7, MY + 18, 'I')
    c.rect(x0 - 7, MY + 21, x0 + 7, MY + 21, 'N')
c.ellipse(MX + 30, MY - 6, 13, 12, 'n'); c.ellipse(MX + 32, MY - 10, 9, 6, 'd')
c.ellipse(MX + 36, MY, 9, 6, 't')
c.rect(MX + 41, MY - 3, MX + 43, MY - 1, 'N')
c.rect(MX + 31, MY + 3, MX + 44, MY + 5, 'R')
for x in range(MX + 32, MX + 44, 3): c.rect(x, MY + 5, x + 1, MY + 8, 'i')
for x in range(MX + 33, MX + 44, 3): c.rect(x, MY, x + 1, MY + 3, 'i')
c.ellipse(MX + 30, MY - 9, 3.2, 2.6, 'f'); c.ellipse(MX + 30, MY - 9, 1.6, 1.6, 'k')
c.horns(MX + 30, MY - 15, 14, 'I', 'i', spread=7, curve=4)
B.append(emit('behemoth', c, 'чудище: горб, гребень вдоль хребта, шерсть прядями, костяные наручи, клыки'))
B.append(upg('ancient_behemoth', 'древнее чудище: серо-синяя шкура, белые клыки и гребень', 'behemoth',
             {'n': 'b', 'd': 'B', 'N': 'P', 't': 'c', 'T': 'L'}))

write('stronghold', 'существа Цитадели', B, 'stronghold3.py')
