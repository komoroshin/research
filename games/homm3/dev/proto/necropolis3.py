# -*- coding: utf-8 -*-
"""js/view/sprites_necropolis_hd.js — Некрополь в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- скелет 58×74 ----------------
c = Fig(58, 74)
CX = 26
c.ribcage(CX, 36, 22, 22, 'i', 'I', n=5)
c.rect(CX - 3, 47, CX + 3, 52, 'I')                                             # таз
c.ellipse(CX, 51, 8, 4, 'i')
for s in (-1, 1):                                                               # ноги-кости
    c.rect(CX + s * 5 - 2, 53, CX + s * 5 + 2, 62, 'i')
    c.ellipse(CX + s * 5, 63, 3.2, 2.4, 'I')
    c.rect(CX + s * 5 - 2, 64, CX + s * 5 + 2, 71, 'i')
    c.rect(CX + s * 5 - 4, 71, CX + s * 5 + 4, 73, 'I')
c.rect(CX - 14, 30, CX - 10, 46, 'i'); c.rect(CX + 10, 30, CX + 14, 46, 'i')    # руки
c.ellipse(CX - 12, 29, 4.5, 3.5, 'I'); c.ellipse(CX + 12, 29, 4.5, 3.5, 'I')    # плечи
c.ellipse(CX - 12, 47, 3.4, 3, 'i'); c.ellipse(CX + 12, 47, 3.4, 3, 'i')
c.skull(CX, 16, 11, 'i', 'L', 'I')
c.shield_round(CX - 21, 40, 9, 'N', 'D', 'e', 'E', 'l')                          # круглый щит
c.sword(CX + 21, 12, 44, 'O', 'o', 'N', 'N', 'D', 'D')                           # ржавый меч
B.append(emit('skeleton', c, 'скелет: череп с глазницами, рёбра дугами, ржавый меч, круглый щит'))
B.append(upg('skeleton_warrior', 'скелет-воин: шлем, тёмный щит, сталь вместо ржавчины', 'skeleton',
             {'O': 'e', 'o': 'l', 'N': 'E', 'D': 'u'},
             extra=[(22, 6, 'e'), (23, 5, 'e'), (26, 5, 'e'), (29, 6, 'e')]))

# ---------------- ходячий мертвец 48×74 ----------------
c = Fig(48, 74)
CX = 22
c.poly([(CX - 11, 26), (CX + 11, 26), (CX + 9, 56), (CX - 9, 56)], 'j')          # грязное тряпьё
c.poly([(CX - 11, 26), (CX - 3, 26), (CX - 4, 56), (CX - 9, 56)], 'H')
for x in range(CX - 9, CX + 9, 5): c.poly([(x, 56), (x + 2, 62), (x + 4, 56)], 'H')  # рваный низ
c.rect(CX - 4, 34, CX - 1, 46, 'i')                                              # кость наружу
c.ellipse(CX - 3, 33, 3, 2.4, 'L')
c.rect(CX - 20, 30, CX - 11, 36, 'd'); c.rect(CX + 11, 32, CX + 20, 38, 'd')     # руки вперёд
c.rect(CX - 20, 30, CX - 11, 31, 'T'); c.ellipse(CX - 21, 33, 3.6, 3, 'd')
c.ellipse(CX + 21, 35, 3.6, 3, 'd')
c.legs_bare(CX, 58, 73, 'd', 'D', gap=4)
c.ellipse(CX + 1, 16, 9, 9.5, 'd'); c.ellipse(CX - 1, 13, 6, 6, 'T')             # землистая кожа
c.ellipse(CX - 3, 16, 2.6, 2.2, 'k'); c.ellipse(CX + 4, 16, 2.6, 2.2, 'k')
c.rect(CX - 5, 22, CX + 5, 24, 'D')
c.rect(CX - 8, 10, CX + 6, 12, 'N')
B.append(emit('walking_dead', c, 'ходячий мертвец: сгорбленный, руки вперёд, рваная одежда, кость наружу'))
B.append(upg('zombie', 'зомби: зеленоватая кожа, тёмное тряпьё', 'walking_dead',
             {'d': 'H', 'T': 'h', 'j': 'u', 'H': 'G', 'D': 'j'}))

# ---------------- привидение 66×65 ----------------
c = Fig(66, 65)
CX = 30
c.poly([(CX - 15, 18), (CX + 15, 18), (CX + 20, 58), (CX - 20, 58)], 'e')        # саван
c.poly([(CX - 15, 18), (CX - 4, 18), (CX - 8, 58), (CX - 20, 58)], 'l')
c.folds(CX - 16, 24, CX + 16, 56, 'E', 4)
for x in range(CX - 19, CX + 20, 6):                                             # рваный низ
    c.poly([(x, 56), (x + 3, 64), (x + 6, 56)], 'e')
    c.poly([(x + 1, 56), (x + 3, 61), (x + 5, 56)], 'E')
c.rect(CX - 24, 26, CX - 14, 32, 'e'); c.rect(CX + 14, 26, CX + 24, 32, 'e')     # рукава
c.ellipse(CX - 25, 30, 4, 3.4, 'l'); c.ellipse(CX + 25, 30, 4, 3.4, 'l')
c.hood(CX, 12, 11, 'e', 'E', inner='z')
c.ellipse(CX - 4, 14, 3, 2.6, 'c'); c.ellipse(CX + 4, 14, 3, 2.6, 'c')           # светящиеся глаза
c.ellipse(CX - 4, 14, 1.4, 1.4, 'w'); c.ellipse(CX + 4, 14, 1.4, 1.4, 'w')
B.append(emit('wight', c, 'привидение: саван со складками, рваный низ, тьма под капюшоном, светящиеся глаза'))
B.append(upg('wraith', 'дух: синеватый саван, ледяное свечение', 'wight',
             {'e': 'b', 'l': 'c', 'E': 'B', 'c': 'w'}))

# ---------------- вампир 49×74 ----------------
c = Fig(49, 74)
CX = 22
c.poly([(CX - 15, 24), (CX + 15, 24), (CX + 19, 68), (CX - 19, 68)], 'R')        # алая подкладка
c.poly([(CX - 13, 24), (CX + 13, 24), (CX + 16, 66), (CX - 16, 66)], 'u')        # чёрный плащ
c.poly([(CX - 13, 24), (CX - 5, 24), (CX - 9, 66), (CX - 16, 66)], 'E')
c.folds(CX - 13, 30, CX + 13, 65, 'z', 3)
c.rect(CX - 8, 30, CX + 8, 52, 'z')
c.rect(CX - 2, 30, CX + 1, 44, 'w')                                              # белая манишка
c.rect(CX + 10, 16, CX + 16, 32, 'u')                                            # поднятая рука
c.ellipse(CX + 16, 13, 4, 3.4, 'L'); c.claws(CX + 13, 9, 3, 'L', 3, 4)
c.face(CX, 13, 8.5, 'L', 'l', hair='z', eye='r')
c.rect(CX - 4, 19, CX + 3, 21, 'R')
c.rect(CX - 3, 21, CX - 2, 23, 'w'); c.rect(CX + 1, 21, CX + 2, 23, 'w')         # клыки
c.poly([(CX - 15, 26), (CX - 11, 12), (CX - 7, 26)], 'u')                        # высокий воротник по бокам
c.poly([(CX + 15, 26), (CX + 11, 12), (CX + 7, 26)], 'u')
c.poly([(CX - 13, 26), (CX - 11, 15), (CX - 9, 26)], 'R')
c.poly([(CX + 13, 26), (CX + 11, 15), (CX + 9, 26)], 'R')
B.append(emit('vampire', c, 'вампир: чёрный плащ с алой подкладкой, высокий воротник, клыки, когти'))
B.append(upg('vampire_lord', 'князь вампиров: багровый плащ, золотая застёжка', 'vampire',
             {'u': 'P', 'E': 'p', 'R': 'r', 'z': 'x'}, extra=[(22, 24, 'y'), (23, 24, 'y'), (22, 25, 'Y')]))

# ---------------- лич 49×74 ----------------
c = Fig(49, 74)
CX = 22
c.poly([(CX - 13, 24), (CX + 13, 24), (CX + 17, 72), (CX - 17, 72)], 'p')        # пурпурная мантия
c.poly([(CX - 13, 24), (CX - 4, 24), (CX - 8, 72), (CX - 17, 72)], 'P')
c.folds(CX - 14, 30, CX + 14, 71, 'P', 3)
c.ellipse(CX + 2, 44, 7, 8, 'A'); c.ellipse(CX + 2, 44, 4.5, 5.5, 'p')           # магический знак
for i in range(-1, 2): c.rect(CX + 2 + i * 4, 38, CX + 3 + i * 4, 50, 'A')
c.rect(CX - 17, 30, CX - 12, 46, 'p'); c.rect(CX + 12, 30, CX + 17, 46, 'p')
c.rect(CX - 17, 30, CX - 16, 46, 'P'); c.rect(CX + 16, 30, CX + 17, 46, 'P')
c.ellipse(CX - 15, 47, 3.4, 3, 'i'); c.ellipse(CX + 15, 47, 3.4, 3, 'i')
c.hood(CX, 12, 10, 'p', 'P', inner='x')
c.skull(CX, 15, 7.5, 'i', 'L', 'I', jaw=False)
c.ellipse(CX - 3, 15, 2.2, 2, 'A'); c.ellipse(CX + 3, 15, 2.2, 2, 'A')           # огоньки в глазницах
SX = CX + 19
c.rect(SX - 1, 14, SX + 1, 72, 'N'); c.rect(SX - 1, 14, SX - 1, 72, 'n')
c.skull(SX, 9, 5.5, 'i', 'L', 'I', jaw=False)
B.append(emit('lich', c, 'лич: череп в капюшоне, пурпурная мантия со знаком, посох с черепом'))
B.append(upg('power_lich', 'могучий лич: чёрная мантия, зелёное свечение знака', 'lich',
             {'p': 'u', 'P': 'z', 'A': 'h', 'x': 'z'}))

# ---------------- чёрный рыцарь 96×84 ----------------
c = Fig(96, 84)
c.horse(42, 50, 52, 26, 'u', 'E', 'z', mane='z', head_left=True, legs=True)
c.ellipse(20, 38, 2.6, 2.2, 'r'); c.ellipse(24, 38, 2.6, 2.2, 'r')               # алые глаза коня
c.poly([(28, 46), (52, 46), (54, 64), (26, 64)], 'z')                            # чепрак
c.folds(28, 48, 52, 63, 'u', 3)
RX = 38
c.rect(RX - 9, 20, RX + 9, 42, 'u'); c.rect(RX - 9, 20, RX - 6, 42, 'E')
c.rect(RX + 6, 20, RX + 9, 42, 'z')
c.rivets(RX - 7, 22, RX + 7, 'E', 5); c.rivets(RX - 7, 40, RX + 7, 'E', 5)
c.pauldrons(RX, 20, 12, 'u', 'E', 'z', lames=2)
c.rect(RX - 10, 42, RX + 10, 46, 'z')
c.helm(RX, 10, 9, 'u', 'E', 'z', kind='great', crest='R')
c.sword(RX + 22, -2, 32, 'e', 'l', 'E', 'z', 'z', 'u')
c.shield_round(RX - 18, 30, 9, 'u', 'z', 'E', 'i', 'L')
c.skull(RX - 18, 30, 5, 'i', 'L', 'I', jaw=False)                                # череп на щите
B.append(emit('black_knight', c, 'чёрный рыцарь: вороной конь с алыми глазами, чёрные латы, щит с черепом', flipx=True))
B.append(upg('dread_knight', 'рыцарь смерти: багровый плюмаж и чепрак, кроваво-красный клинок', 'black_knight',
             {'R': 'r', 'z': 'P', 'e': 'r', 'l': 'o'}))

# ---------------- костяной дракон 97×90 ----------------
c = Fig(97, 90)
BX, BY = 50, 54
c.wing_bat(BX + 4, BY - 18, 42, 32, 'E', 'u', 'i', n=4, a0=106, a1=20)
c.ribcage(BX, BY, 40, 30, 'i', 'I', n=6)
c.rect(BX - 2, BY - 18, BX + 2, BY + 18, 'I')                                    # позвоночник
for i in range(6): c.ellipse(BX + 22 + i * 5, BY + 2 + i * 3, 3.4, 2.6, 'i')     # хвост позвонками
c.poly([(BX + 50, BY + 18), (BX + 58, BY + 24), (BX + 49, BY + 23)], 'I')
for x0 in (BX - 14, BX + 12):                                                    # лапы-кости
    c.rect(x0 - 2, BY + 16, x0 + 2, BY + 26, 'i')
    c.ellipse(x0, BY + 27, 3.4, 2.6, 'I')
    c.rect(x0 - 2, BY + 28, x0 + 2, BY + 36, 'i')
    c.claws(x0 - 5, BY + 36, 3, 'I', 4, 4)
c.rect(BX - 26, BY - 16, BX - 20, BY - 6, 'i')                                   # шея
c.ellipse(BX - 24, BY - 20, 4, 3.2, 'I')
c.skull(BX - 32, BY - 28, 12, 'i', 'L', 'I', horns=True)
c.ellipse(BX - 37, BY - 26, 3.2, 2.6, 'h'); c.ellipse(BX - 27, BY - 26, 3.2, 2.6, 'h')
B.append(emit('bone_dragon', c, 'костяной дракон: череп с рогами, рёбра, крыло-спицы с обрывками перепонки, хвост позвонками', flipx=True))
B.append(upg('ghost_dragon', 'призрачный дракон: полупрозрачная зелень, туман вместо перепонки', 'bone_dragon',
             {'i': 'v', 'L': 'w', 'I': 'q', 'E': 'Q', 'u': 'q', 'h': 'w'}))

write('necropolis', 'существа Некрополя', B, 'necropolis3.py')
