# -*- coding: utf-8 -*-
"""js/view/sprites_tower_hd.js — Башня в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- гремлин 55×68 ----------------
c = Fig(55, 68)
CX = 22
c.poly([(CX - 10, 26), (CX + 10, 26), (CX + 12, 58), (CX - 12, 58)], 'n')      # бурая роба
c.poly([(CX - 10, 26), (CX - 2, 26), (CX - 5, 58), (CX - 12, 58)], 'N')
c.folds(CX - 10, 30, CX + 10, 57, 'N', 3)
c.rect(CX - 11, 42, CX + 11, 45, 'D')                                           # пояс
c.rect(CX - 13, 28, CX - 9, 42, 'g'); c.rect(CX + 9, 28, CX + 13, 42, 'g')      # зелёные руки
c.rect(CX + 11, 28, CX + 13, 42, 'G')
c.ellipse(CX - 11, 44, 3.2, 2.8, 'g'); c.ellipse(CX + 11, 44, 3.2, 2.8, 'g')
c.legs_bare(CX, 58, 67, 'g', 'G', gap=3)
c.face(CX, 16, 8, 'g', 'G', eye='y')
c.poly([(CX - 8, 14), (CX - 18, 6), (CX - 5, 10)], 'g')                         # огромные уши
c.poly([(CX + 8, 14), (CX + 18, 6), (CX + 5, 10)], 'g')
c.poly([(CX - 7, 15), (CX - 15, 8), (CX - 5, 12)], 'G')
c.rect(CX - 5, 22, CX + 4, 24, 'D')                                             # рот-щель
for i in range(5): c.ellipse(CX + 15 + i * 3, 46 + i * 3, 2.2, 2.2, 'E')        # цепь
c.ellipse(CX + 30, 60, 5.5, 5.5, 'u'); c.ellipse(CX + 29, 58, 3, 3, 'E')        # чугунное ядро
B.append(emit('gremlin', c, 'гремлин: зелёная кожа, огромные уши, бурая роба, цепь с ядром'))
B.append(upg('master_gremlin', 'мастер-гремлин: фиолетовая роба, красный колпак', 'gremlin',
             {'n': 'p', 'N': 'P', 'D': 'x'}, extra=[(21, 6, 'r'), (22, 5, 'r'), (23, 5, 'r'), (24, 6, 'r')]))

# ---------------- каменная гаргулья 67×72 ----------------
c = Fig(67, 72)
CX = 30
c.wing_bat(CX + 8, 36, 30, 22, 'e', 'E', 'l', n=3, a0=86, a1=12)
c.wing_bat(CX - 8, 36, 30, 22, 'e', 'E', 'l', n=3, flip=True, a0=86, a1=12)
c.ellipse(CX, 38, 12, 14, 'e'); c.ellipse(CX - 3, 34, 8, 9, 'l')                # торс-статуя
c.rect(CX - 10, 36, CX + 10, 38, 'E'); c.rect(CX - 10, 46, CX + 10, 48, 'E')    # швы камня
c.rect(CX - 16, 32, CX - 11, 48, 'e'); c.rect(CX + 11, 32, CX + 16, 48, 'e')
c.rect(CX - 16, 32, CX - 15, 48, 'E'); c.rect(CX + 15, 32, CX + 16, 48, 'E')
c.claws(CX - 17, 49, 3, 'l', 3, 4); c.claws(CX + 11, 49, 3, 'l', 3, 4)
for s in (-1, 1):                                                               # ноги, присев
    c.ellipse(CX + s * 7, 56, 5.5, 8, 'e'); c.ellipse(CX + s * 7, 54, 4, 5, 'l')
    c.paw(CX + s * 7, 64, 6, 'e', 'l', 'E', 3)
c.ellipse(CX, 16, 10, 9, 'e'); c.ellipse(CX - 2, 13, 7, 6, 'l')                  # голова
c.horns(CX, 10, 10, 'e', 'l', spread=7, curve=3)
c.rect(CX - 7, 18, CX + 6, 21, 'u')                                             # пасть
for x in range(CX - 6, CX + 6, 3): c.rect(x, 18, x + 1, 20, 'l')                # клыки
c.ellipse(CX - 4, 14, 2.6, 2.2, 'f'); c.ellipse(CX + 4, 14, 2.6, 2.2, 'f')
B.append(emit('stone_gargoyle', c, 'каменная гаргулья: швы камня, рога, клыки, когти, перепончатые крылья'))
B.append(upg('obsidian_gargoyle', 'обсидиановая гаргулья: чёрный камень, светящиеся глаза', 'stone_gargoyle',
             {'e': 'u', 'l': 'P', 'E': 'z', 'f': 'A'}))

# ---------------- каменный голем 67×80 ----------------
c = Fig(67, 80)
CX = 30
c.rect(CX - 16, 26, CX + 16, 56, 'T')                                           # корпус-глыба
c.rect(CX - 16, 26, CX - 10, 56, 't'); c.rect(CX + 11, 26, CX + 16, 56, 'N')
for y in (34, 44):  c.rect(CX - 16, y, CX + 16, y + 1, 'N')                     # швы кладки
for x in (CX - 6, CX + 6): c.rect(x, 26, x + 1, 56, 'N')
c.line(CX - 10, 30, CX - 5, 42, 'N'); c.line(CX + 8, 46, CX + 3, 54, 'N')       # трещины
c.rect(CX - 24, 28, CX - 17, 52, 'T'); c.rect(CX + 17, 28, CX + 24, 52, 'T')    # руки-плиты
c.rect(CX - 24, 28, CX - 22, 52, 't'); c.rect(CX + 22, 28, CX + 24, 52, 'N')
c.rect(CX - 25, 52, CX - 16, 60, 'T'); c.rect(CX + 16, 52, CX + 25, 60, 'T')    # кулаки
c.rect(CX - 14, 57, CX - 2, 79, 'T'); c.rect(CX + 2, 57, CX + 14, 79, 'T')      # ноги-столбы
c.rect(CX - 14, 57, CX - 11, 79, 't'); c.rect(CX + 11, 57, CX + 14, 79, 'N')
c.rect(CX - 16, 75, CX + 0, 79, 'N'); c.rect(CX + 0, 75, CX + 16, 79, 'N')
c.ellipse(CX, 18, 11, 9, 'T'); c.ellipse(CX - 3, 15, 7, 6, 't')                 # голова
c.rect(CX - 8, 18, CX - 3, 20, 'u'); c.rect(CX + 3, 18, CX + 8, 20, 'u')        # щели глаз
c.rect(CX - 9, 24, CX + 8, 26, 'N')
B.append(emit('stone_golem', c, 'каменный голем: кладка швами, трещины, щели глаз, руки-плиты'))
B.append(upg('iron_golem', 'железный голем: стальной корпус, заклёпки, огненные глаза', 'stone_golem',
             {'T': 'e', 't': 'l', 'N': 'E', 'u': 'F'}))

# ---------------- маг 66×80 ----------------
c = Fig(66, 80)
CX = 26
c.poly([(CX - 12, 30), (CX + 12, 30), (CX + 16, 79), (CX - 16, 79)], 'b')       # мантия
c.poly([(CX - 12, 30), (CX - 3, 30), (CX - 8, 79), (CX - 16, 79)], 'B')
c.folds(CX - 13, 34, CX + 13, 78, 'B', 4)
for x in range(CX - 14, CX + 15, 6): c.ellipse(x, 79, 2.4, 2.0, 'B')            # подол
c.rect(CX - 15, 34, CX - 10, 50, 'b'); c.rect(CX + 10, 34, CX + 15, 50, 'b')
c.rect(CX - 15, 34, CX - 14, 50, 'B'); c.rect(CX + 14, 34, CX + 15, 50, 'B')
c.ellipse(CX - 13, 51, 3.2, 2.8, 'S'); c.ellipse(CX + 13, 51, 3.2, 2.8, 'S')
c.rect(CX - 13, 44, CX + 13, 47, 'y'); c.rect(CX - 13, 44, CX + 13, 44, 'f')    # золотой кушак
c.face(CX, 20, 7, 'S', 'T', eye='k')
c.ellipse(CX, 27, 7, 6, 'l'); c.fur(CX - 6, 24, CX + 6, 34, 'e', step=3, length=9)   # седая борода
c.poly([(CX - 12, 14), (CX + 12, 14), (CX + 2, -6)], 'B')                       # остроконечная шляпа
c.poly([(CX - 10, 14), (CX + 8, 14), (CX + 2, -3)], 'b')
c.rect(CX - 12, 12, CX + 12, 15, 'B')                                           # поля
c.ellipse(CX + 2, 2, 2.6, 2.4, 'y'); c.ellipse(CX - 2, 8, 2.0, 1.8, 'y')        # звёзды
c.rect(CX + 18, 12, CX + 20, 78, 'N'); c.rect(CX + 18, 12, CX + 18, 78, 'n')    # посох
c.ellipse(CX + 19, 8, 5.5, 5.5, 'c'); c.ellipse(CX + 18, 6, 3, 2.8, 'w')        # шар
c.ellipse(CX + 19, 13, 4, 2, 'Y')
B.append(emit('mage', c, 'маг: мантия со складками, шляпа со звёздами, седая борода, посох с шаром'))
B.append(upg('arch_mage', 'архимаг: пурпурная мантия с золотой оторочкой, голубой шар', 'mage',
             {'b': 'p', 'B': 'P', 'N': 'y', 'n': 'f', 'c': 'b', 'w': 'c'}))

# ---------------- джинн 72×84 ----------------
c = Fig(72, 84)
CX = 32
for i in range(6):                                                              # дымный хвост
    w = 4 + i * 2.2
    c.ellipse(CX + (i % 2 * 2 - 1) * 3, 82 - i * 6, w, 4.5, 'C' if i % 2 else 'b')
c.ellipse(CX, 44, 15, 14, 'b'); c.ellipse(CX - 4, 40, 10, 9, 'c')               # торс
c.rect(CX - 14, 46, CX + 14, 50, 'y'); c.rect(CX - 14, 46, CX + 14, 46, 'f')    # золотой пояс
c.rect(CX - 20, 38, CX - 12, 44, 'b'); c.rect(CX + 12, 38, CX + 20, 44, 'b')    # руки скрещены
c.rect(CX - 20, 38, CX - 12, 40, 'c'); c.rect(CX + 12, 42, CX + 20, 44, 'C')
c.ellipse(CX - 6, 46, 5, 3.6, 'b'); c.ellipse(CX + 6, 48, 5, 3.6, 'C')          # кисти на груди
c.ellipse(CX - 18, 36, 4, 3.2, 'y'); c.ellipse(CX + 18, 36, 4, 3.2, 'y')        # браслеты
c.ellipse(CX, 22, 11, 12, 'b'); c.ellipse(CX - 3, 18, 7.5, 8, 'c')              # голова
c.ellipse(CX - 4, 22, 2.8, 2.4, 'w'); c.ellipse(CX + 4, 22, 2.8, 2.4, 'w')
c.ellipse(CX - 4, 22, 1.4, 1.4, 'k'); c.ellipse(CX + 4, 22, 1.4, 1.4, 'k')
c.rect(CX - 9, 16, CX + 8, 18, 'B')                                             # брови
c.ellipse(CX, 30, 6, 4, 'B'); c.fur(CX - 5, 28, CX + 5, 36, 'B', step=3, length=8)  # борода
c.ellipse(CX + 11, 26, 2.6, 2.6, 'y')                                           # серьга
B.append(emit('genie', c, 'джинн: дух без ног, дымный хвост кольцами, руки на груди, серьга'))
B.append(upg('master_genie', 'мастер-джинн: голубая кожа, белая дымка, золотой обруч', 'genie',
             {'b': 'c', 'c': 'w', 'C': 'l', 'B': 'C'}, extra=[(30, 11, 'y'), (31, 11, 'y'), (32, 11, 'y'), (33, 11, 'y')]))

# ---------------- нага 88×90 ----------------
c = Fig(88, 90)
CX = 40
# хвост: кольца сужаются книзу, у каждого свет по верхнему краю и тень по нижнему
for i, (w, y) in enumerate(((22, 52), (25, 63), (22, 73), (15, 82))):
    ox = (i % 2 * 2 - 1) * 5
    c.ellipse(CX + ox, y, w, 7.5, 'q')
    c.ellipse(CX + ox, y - 2.5, w * 0.82, 3.6, 'v')
    c.ellipse(CX + ox, y + 4, w * 0.88, 2.4, 'Q')
c.scales(CX - 26, 46, CX + 26, 88, 'v', 5, only='q')
c.poly([(CX - 14, 84), (CX - 26, 88), (CX - 12, 89)], 'Q')                      # кончик хвоста
c.ellipse(CX, 32, 11, 13, 'v'); c.ellipse(CX - 3, 28, 7.5, 8, 'w')              # торс
c.rect(CX - 10, 38, CX + 10, 41, 'y'); c.rect(CX - 10, 38, CX + 10, 38, 'f')
# шесть рук: плечо, предплечье, кисть и сабля, разведены веером
for sgn in (-1, 1):
    for i, (sh, ang) in enumerate(((22, -14), (30, -2), (38, 10))):
        ax = CX + sgn * 9
        c.rect(min(ax, ax + sgn * 9), sh, max(ax, ax + sgn * 9), sh + 4, 'v')    # плечо
        fx = CX + sgn * 18
        c.rect(min(fx, fx + sgn * 8), sh + ang // 3, max(fx, fx + sgn * 8), sh + 4 + ang // 3, 'v')
        hx = CX + sgn * 27
        c.ellipse(hx, sh + 2 + ang // 3, 3.4, 3, 'w')                            # кисть
        tipx, tipy = CX + sgn * 42, sh - 10 + ang
        c.poly([(hx, sh + ang // 3), (tipx, tipy), (tipx + sgn * 2, tipy + 5), (hx, sh + 5 + ang // 3)], 'l')
        c.line(hx + sgn * 2, sh + 1 + ang // 3, tipx - sgn * 2, tipy + 2, 'w')   # блик на клинке
        c.rect(min(hx, hx - sgn * 3), sh - 1 + ang // 3, max(hx, hx - sgn * 3), sh + 6 + ang // 3, 'Y')
c.ellipse(CX, 12, 10, 11, 'v'); c.ellipse(CX - 2, 9, 7, 7, 'w')                 # голова
c.ellipse(CX - 4, 12, 2.6, 2.4, 'k'); c.ellipse(CX + 4, 12, 2.6, 2.4, 'k')
c.rect(CX - 8, 6, CX + 7, 8, 'q')                                               # брови
c.rect(CX - 10, 2, CX + 10, 5, 'y')                                             # обруч
for i in range(-2, 3): c.poly([(CX + i * 4 - 2, 2), (CX + i * 4, -4), (CX + i * 4 + 2, 2)], 'y')
B.append(emit('naga', c, 'нага: кольца хвоста чешуёй, шесть рук с саблями веером, обруч с зубцами'))
B.append(upg('naga_queen', 'королева наг: пурпурная чешуя, красные клинки, золотая корона', 'naga',
             {'q': 'x', 'v': 'a', 'Q': 'P', 'l': 'r', 'w': 'A'}))

# ---------------- гигант 79×92 ----------------
c = Fig(79, 92)
CX = 36
c.rect(CX - 16, 36, CX + 16, 62, 'S')                                           # торс
c.rect(CX - 16, 36, CX - 10, 62, 's'); c.rect(CX + 11, 36, CX + 16, 62, 'T')
c.poly([(CX - 18, 34), (CX + 6, 34), (CX + 14, 64), (CX - 18, 64)], 'w')        # тога через плечо
c.poly([(CX - 18, 34), (CX - 6, 34), (CX - 2, 64), (CX - 18, 64)], 'L')
c.folds(CX - 16, 38, CX + 10, 63, 'l', 3)
c.rect(CX - 18, 60, CX + 16, 64, 'y')                                           # пояс
c.legs_bare(CX, 64, 91, 'S', 'T', boot=('N', 'n'), gap=6)
c.rect(CX - 26, 38, CX - 17, 58, 'S'); c.rect(CX - 26, 38, CX - 24, 58, 's')    # руки
c.rect(CX + 17, 24, CX + 26, 46, 'S'); c.rect(CX + 24, 24, CX + 26, 46, 'T')    # правая поднята
c.ellipse(CX - 22, 60, 4.5, 4, 'S'); c.ellipse(CX + 22, 22, 4.5, 4, 'S')
c.ellipse(CX, 22, 11, 12, 'S'); c.ellipse(CX - 3, 18, 7.5, 8, 's')              # голова
c.ellipse(CX - 4, 22, 2.6, 2.2, 'k'); c.ellipse(CX + 4, 22, 2.6, 2.2, 'k')
c.rect(CX - 9, 17, CX + 8, 19, 'D')
c.ellipse(CX, 10, 11, 6, 'D')                                                   # тёмные волосы
c.ellipse(CX, 29, 6.5, 4.5, 'D')                                                # борода
for i in range(4):                                                              # молния в поднятой руке
    c.poly([(CX + 20 + i * 2, 18 - i * 5), (CX + 26 + i * 2, 16 - i * 5), (CX + 22 + i * 2, 10 - i * 5)], 'f')
    c.poly([(CX + 21 + i * 2, 17 - i * 5), (CX + 25 + i * 2, 15 - i * 5), (CX + 22 + i * 2, 12 - i * 5)], 'w')
B.append(emit('giant', c, 'гигант: тога через плечо складками, тёмная борода, молния в руке'))
B.append(upg('titan', 'титан: синяя кожа, золотая тога-доспех и шлем', 'giant',
             {'S': 'b', 's': 'c', 'T': 'B', 'w': 'y', 'L': 'f', 'l': 'Y', 'D': 'B'}))

write('tower', 'существа Башни', B, 'tower3.py')
