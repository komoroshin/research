# -*- coding: utf-8 -*-
"""js/view/sprites_factory_hd.js — Фабрика в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- полурослик 52×68 ----------------
c = Fig(52, 68)
CX = 22
c.rect(CX - 10, 30, CX + 10, 48, 'G'); c.rect(CX - 10, 30, CX - 7, 48, 'j')      # зелёная куртка
c.rect(CX + 7, 30, CX + 10, 48, 'j')
c.rect(CX - 6, 30, CX + 5, 46, 'H')                                               # жилет
c.rivets(CX - 4, 34, CX + 3, 'y', 5)
c.rect(CX - 11, 44, CX + 11, 48, 'N'); c.rect(CX - 4, 43, CX + 3, 49, 'Y')
c.rect(CX - 15, 32, CX - 10, 44, 'G'); c.rect(CX + 10, 30, CX + 15, 40, 'G')
c.ellipse(CX - 13, 45, 3.2, 2.8, 'S'); c.ellipse(CX + 16, 38, 3.2, 2.8, 'S')
c.legs_bare(CX, 50, 66, 'N', 'D', gap=4)
for s in (-1, 1): c.ellipse(CX + s * 6, 66, 5, 2.4, 'S')                          # босые ступни
c.face(CX, 18, 8, 'S', 'T', hair='n', eye='k')
c.poly([(CX - 15, 12), (CX + 15, 12), (CX + 8, 4), (CX - 8, 4)], 'N')            # шляпа с полями
c.rect(CX - 16, 11, CX + 16, 13, 'n')
SL = CX + 20                                                                       # рогатка с камнем
c.poly([(SL - 4, 30), (SL - 2, 22), (SL, 30)], 'n')
c.poly([(SL, 30), (SL + 2, 22), (SL + 4, 30)], 'n')
c.line(SL - 2, 23, SL + 2, 23, 'D')
c.ellipse(SL, 26, 3.4, 3.4, 'e')
B.append(emit('halfling', c, 'полурослик: шляпа с полями, куртка и жилет с пуговицами, рогатка, босые ноги'))
B.append(upg('halfling_grenadier', 'полурослик-гренадёр: бурая куртка, граната вместо камня', 'halfling',
             {'G': 'N', 'j': 'D', 'H': 'n', 'e': 'u'}, extra=[(41, 22, 'F'), (42, 21, 'f')]))

# ---------------- механик 49×74 ----------------
c = Fig(49, 74)
CX = 21
c.rect(CX - 11, 30, CX + 11, 50, 'b'); c.rect(CX - 11, 30, CX - 8, 50, 'B')      # синяя рубаха
c.poly([(CX - 9, 34), (CX + 9, 34), (CX + 11, 58), (CX - 11, 58)], 'N')          # кожаный фартук
c.poly([(CX - 9, 34), (CX - 2, 34), (CX - 4, 58), (CX - 11, 58)], 'n')
c.rect(CX - 6, 44, CX + 5, 52, 'D'); c.rect(CX - 6, 44, CX + 5, 45, 'N')         # карман
c.rect(CX - 16, 32, CX - 11, 46, 'b'); c.rect(CX + 11, 30, CX + 16, 44, 'b')
c.ellipse(CX - 14, 47, 3.2, 2.8, 'S'); c.ellipse(CX + 16, 42, 3.2, 2.8, 'S')
c.legs_bare(CX, 58, 73, 'N', 'D', boot=('u', 'E'), gap=4)
c.face(CX, 18, 8, 'S', 'T', hair='N', eye='k')
c.rect(CX - 9, 10, CX + 9, 13, 'E')                                               # очки на лбу
c.ellipse(CX - 5, 11, 3.2, 2.6, 'c'); c.ellipse(CX + 5, 11, 3.2, 2.6, 'c')
WX = CX + 20                                                                       # гаечный ключ
c.rect(WX - 2, 30, WX + 2, 62, 'e'); c.rect(WX - 2, 30, WX - 1, 62, 'l')
c.poly([(WX - 7, 30), (WX - 7, 22), (WX - 3, 22), (WX - 3, 26), (WX + 3, 26), (WX + 3, 22), (WX + 7, 22), (WX + 7, 30)], 'e')
c.rect(WX - 7, 22, WX - 3, 23, 'l')
B.append(emit('mechanic', c, 'механик: очки на лбу, синяя рубаха, кожаный фартук с карманом, гаечный ключ'))
B.append(upg('engineer', 'инженер: серый фартук, стальной ключ, красный платок', 'mechanic',
             {'N': 'E', 'n': 'e', 'D': 'u', 'b': 'r', 'B': 'R'}))

# ---------------- броненосец 82×53 ----------------
c = Fig(82, 53)
BX, BY = 38, 30
c.ellipse(BX, BY, 26, 13, 'T')
c.ellipse(BX - 4, BY - 5, 21, 8, 't')
for i in range(6): c.line(BX - 18 + i * 7, BY - 12, BX - 20 + i * 7, BY + 10, 'N', 2)   # пластины панциря
c.ellipse(BX + 2, BY + 7, 22, 5, 'N')
for x0, fr in ((BX - 16, 1), (BX - 4, 0), (BX + 10, 0), (BX + 18, 1)):
    c.rect(x0 - 3, BY + 10, x0 + 3, BY + 18, 'N' if fr else 'D')
    c.paw(x0, BY + 17, 4, 'N' if fr else 'D', 'n', 'i', 3)
for i in range(5): c.ellipse(BX + 26 + i * 4, BY + 2 + i * 2, 4 - i * 0.4, 3, 'T')      # хвост
c.ellipse(BX - 28, BY - 2, 9, 8, 'n'); c.ellipse(BX - 34, BY + 1, 7, 4.5, 'N')          # вытянутая морда
c.rect(BX - 40, BY, BX - 38, BY + 2, 'D')
c.ellipse(BX - 29, BY - 5, 2.6, 2.2, 'k')
c.poly([(BX - 25, BY - 8), (BX - 24, BY - 14), (BX - 20, BY - 7)], 'n')                 # ухо
B.append(emit('armadillo', c, 'броненосец: панцирь пластинами, вытянутая морда, четыре лапы, хвост', flipx=True))
B.append(upg('bellwether_armadillo', 'вожак: тёмный панцирь, латунные ободья', 'armadillo',
             {'T': 'N', 't': 'T', 'N': 'y', 'n': 'd'}))

# ---------------- автоматон 61×83 ----------------
c = Fig(61, 83)
CX = 26
c.rect(CX - 14, 30, CX + 14, 58, 'y'); c.rect(CX - 14, 30, CX - 10, 58, 'f')     # латунный корпус
c.rect(CX + 10, 30, CX + 14, 58, 'Y')
c.rivets(CX - 12, 33, CX + 12, 'f', 6); c.rivets(CX - 12, 55, CX + 12, 'f', 6)
c.ellipse(CX, 44, 8, 8, 'u'); c.ellipse(CX, 44, 5.5, 5.5, 'F')                   # топка на груди
c.ellipse(CX, 45, 3, 3, 'f')
for i in range(3): c.rect(CX - 6 + i * 5, 36, CX - 5 + i * 5, 38, 'E')           # решётка
c.rect(CX - 22, 32, CX - 15, 52, 'y'); c.rect(CX + 15, 32, CX + 22, 52, 'y')     # поршневые руки
c.rect(CX - 22, 38, CX - 15, 41, 'E'); c.rect(CX + 15, 38, CX + 22, 41, 'E')
c.rect(CX - 22, 46, CX - 15, 49, 'E'); c.rect(CX + 15, 46, CX + 22, 49, 'E')
c.rect(CX - 24, 52, CX - 14, 58, 'Y'); c.rect(CX + 14, 52, CX + 24, 58, 'Y')
c.rect(CX - 12, 58, CX - 2, 80, 'y'); c.rect(CX + 2, 58, CX + 12, 80, 'y')
c.rect(CX - 12, 58, CX - 9, 80, 'f'); c.rect(CX + 9, 58, CX + 12, 80, 'Y')
c.rect(CX - 14, 78, CX + 14, 82, 'E')
c.ellipse(CX, 20, 11, 10, 'y'); c.ellipse(CX - 3, 17, 7, 6, 'f')
c.rect(CX - 8, 20, CX - 3, 23, 'c'); c.rect(CX + 3, 20, CX + 8, 23, 'c')         # глаза-линзы
c.rect(CX - 9, 27, CX + 8, 29, 'E')
c.rect(CX + 8, 2, CX + 13, 14, 'E'); c.rect(CX + 8, 2, CX + 9, 14, 'e')          # труба
for i in range(3): c.ellipse(CX + 11 + i * 2, -2 - i * 4, 4 + i, 3 + i * 0.6, 'l')     # пар
B.append(emit('automaton', c, 'автоматон: латунный корпус с заклёпками, топка на груди, поршневые руки, труба с паром'))
B.append(upg('sentinel_automaton', 'страж-автоматон: стальной корпус, синие линзы', 'automaton',
             {'y': 'e', 'f': 'l', 'Y': 'E', 'c': 'b'}))

# ---------------- песчаный червь 85×90 ----------------
c = Fig(85, 90)
CX = 40
for x in range(CX - 30, CX + 31, 6): c.ellipse(x, 88, 8, 4, 'T')                  # песок у основания
for i, (w, y) in enumerate(((17, 80), (16, 68), (15, 56), (14, 44), (13, 32))):   # кольчатое тело
    ox = int((i % 2 * 2 - 1) * 3)
    c.ellipse(CX + ox, y, w, 7, 'T')
    c.ellipse(CX + ox, y - 2.5, w * 0.82, 3.4, 't')
    c.ellipse(CX + ox, y + 3.6, w * 0.86, 2.2, 'N')
c.ellipse(CX + 3, 20, 16, 12, 'T'); c.ellipse(CX, 17, 11, 8, 't')
c.ellipse(CX + 3, 14, 13, 7, 'R')                                                 # пасть-воронка
c.ellipse(CX + 3, 13, 9, 5, 'D')
for i in range(9):                                                                # ряды зубов
    import math
    ang = math.pi * i / 8
    c.poly([(CX + 3 - math.cos(ang) * 12, 14 - math.sin(ang) * 6),
            (CX + 3 - math.cos(ang) * 13, 8 - math.sin(ang) * 7),
            (CX + 3 - math.cos(ang) * 10, 14 - math.sin(ang) * 5)], 'i')
B.append(emit('sandworm', c, 'песчаный червь: кольчатое тело, пасть-воронка с рядами зубов, песок у основания'))
B.append(upg('olgoi_khorkhoi', 'олгой-хорхой: багровые кольца, чёрная пасть', 'sandworm',
             {'T': 'R', 't': 'r', 'N': 'D', 'R': 'z'}))

# ---------------- стрелок 74×89 ----------------
c = Fig(74, 89)
CX = 28
c.poly([(CX - 15, 32), (CX + 15, 32), (CX + 19, 82), (CX - 19, 82)], 'i')        # плащ-пыльник
c.poly([(CX - 15, 32), (CX - 5, 32), (CX - 9, 82), (CX - 19, 82)], 'I')
c.folds(CX - 16, 38, CX + 16, 81, 'I', 4)
c.rect(CX - 9, 32, CX + 9, 52, 'N')
c.rect(CX - 10, 30, CX + 10, 36, 'r'); c.rect(CX - 10, 30, CX + 10, 31, 'o')     # красный платок
c.rect(CX - 10, 50, CX + 10, 54, 'D'); c.rect(CX - 4, 49, CX + 3, 55, 'Y')
c.rect(CX - 20, 36, CX - 15, 52, 'i'); c.rect(CX + 15, 34, CX + 20, 50, 'i')
c.ellipse(CX - 18, 53, 3.4, 3, 'S'); c.ellipse(CX + 18, 51, 3.4, 3, 'S')
c.legs_bare(CX, 60, 88, 'N', 'D', boot=('u', 'E'), gap=5)
c.face(CX, 20, 8, 'S', 'T', eye='k')
c.rect(CX - 7, 24, CX + 6, 26, 'N')                                               # усы
c.poly([(CX - 18, 14), (CX + 18, 14), (CX + 9, 5), (CX - 9, 5)], 'N')            # широкополая шляпа
c.poly([(CX - 16, 13), (CX + 16, 13), (CX + 8, 7), (CX - 8, 7)], 'n')
c.rect(CX - 19, 13, CX + 19, 15, 'N')
GX = CX + 22                                                                       # длинное ружьё
c.rect(GX - 2, 26, GX + 2, 44, 'N'); c.rect(GX - 2, 26, GX - 1, 44, 'n')
c.rect(GX - 1, 4, GX + 1, 28, 'E'); c.rect(GX - 1, 4, GX - 1, 28, 'e')
c.rect(GX - 3, 26, GX + 3, 30, 'e')
c.poly([(GX - 4, 44), (GX + 3, 44), (GX + 1, 54), (GX - 6, 52)], 'N')            # приклад
B.append(emit('gunslinger', c, 'стрелок: широкополая шляпа, усы, красный платок, плащ-пыльник, длинное ружьё'))
B.append(upg('bounty_hunter', 'охотник за головами: тёмный пыльник, звезда на груди', 'gunslinger',
             {'i': 'T', 'I': 'N', 'r': 'u', 'o': 'E'}, extra=[(24, 40, 'y'), (25, 39, 'y'), (26, 40, 'y')]))

# ---------------- коатль 100×92 ----------------
c = Fig(100, 92)
CX = 48
c.wing_feather(CX - 4, 40, 40, 30, 'Y', 'y', 'f', 'O', n=9, flip=True, a0=116, a1=28)
c.wing_feather(CX + 8, 38, 42, 32, 'Y', 'y', 'f', 'O', n=9, a0=116, a1=28)
for i, (w, y) in enumerate(((20, 84), (22, 72), (19, 60))):                       # кольца тела
    ox = int((i % 2 * 2 - 1) * 5)
    c.ellipse(CX + ox, y, w, 8, 'G')
    c.ellipse(CX + ox, y - 2.5, w * 0.8, 4, 'g')
    c.ellipse(CX + ox, y + 4, w * 0.86, 2.4, 'j')
c.scales(CX - 24, 54, CX + 24, 88, 'g', 5, only='G')
c.ellipse(CX + 2, 74, 16, 5, 'h')                                                 # светлое брюхо
c.ellipse(CX - 10, 44, 12, 11, 'G'); c.ellipse(CX - 13, 41, 8, 7, 'g')
c.poly([(CX - 20, 44), (CX - 34, 48), (CX - 20, 52)], 'G')                        # раскрытая пасть
c.rect(CX - 33, 49, CX - 18, 52, 'R')
for x in range(int(CX - 32), int(CX - 18), 3):
    c.rect(x, 46, x + 1, 49, 'i'); c.rect(x + 1, 52, x + 2, 55, 'i')
c.ellipse(CX - 16, 40, 3.2, 2.8, 'y'); c.ellipse(CX - 16, 40, 1.6, 1.6, 'k')
for i in range(6):                                                                # гребень из перьев
    c.poly([(CX - 14 + i * 4, 34), (CX - 12 + i * 4, 24), (CX - 10 + i * 4, 34)], 'y')
    c.poly([(CX - 13 + i * 4, 34), (CX - 12 + i * 4, 27), (CX - 11 + i * 4, 34)], 'f')
B.append(emit('couatl', c, 'коатль: пернатый змей, золотые крылья веером, кольца тела чешуёй, гребень из перьев', flipx=True))
B.append(upg('crimson_couatl', 'багровый коатль: алая чешуя, тёмно-золотые крылья', 'couatl',
             {'G': 'R', 'g': 'r', 'j': 'D', 'h': 'o', 'y': 'Y', 'f': 'y'}))

write('factory', 'существа Фабрики', B, 'factory3.py')
