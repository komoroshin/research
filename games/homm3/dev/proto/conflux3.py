# -*- coding: utf-8 -*-
"""js/view/sprites_conflux_hd.js — Сопряжение в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- пикси 62×71 ----------------
c = Fig(62, 71)
CX = 30
for s, dy in ((-1, -4), (1, -4), (-1, 6), (1, 6)):                                # крылья стрекозы
    c.poly([(CX + s * 4, 34 + dy), (CX + s * 24, 22 + dy), (CX + s * 28, 32 + dy), (CX + s * 8, 40 + dy)], 'c')
    c.poly([(CX + s * 5, 34 + dy), (CX + s * 20, 26 + dy), (CX + s * 23, 32 + dy), (CX + s * 8, 38 + dy)], 'w')
    for i in range(3): c.line(CX + s * 6, 35 + dy, CX + s * (13 + i * 5), 25 + dy + i * 3, 'C')
c.poly([(CX - 8, 32), (CX + 8, 32), (CX + 11, 58), (CX - 11, 58)], 'g')          # зелёное платье
c.poly([(CX - 8, 32), (CX - 2, 32), (CX - 5, 58), (CX - 11, 58)], 'G')
c.folds(CX - 9, 36, CX + 9, 57, 'G', 3)
for x in range(CX - 10, CX + 11, 5): c.poly([(x, 58), (x + 2, 63), (x + 4, 58)], 'g')
c.rect(CX - 11, 34, CX - 7, 44, 's'); c.rect(CX + 7, 34, CX + 11, 44, 's')
c.legs_bare(CX, 60, 70, 's', 'S', gap=3)
c.face(CX, 22, 7, 's', 'S', eye='k')
c.ellipse(CX, 15, 8.5, 6, 'o'); c.fur(CX - 8, 16, CX + 8, 30, 'O', step=3, length=12)  # рыжие волосы
B.append(emit('pixie', c, 'пикси: крылья стрекозы с прожилками, рыжие волосы прядями, зелёное платье'))
B.append(upg('sprite', 'спрайт: голубое платье, серебристые волосы, прозрачные крылья', 'pixie',
             {'g': 'c', 'G': 'C', 'o': 'l', 'O': 'e'}))

# ---------------- воздушный элементаль 70×74 ----------------
c = Fig(70, 74)
CX = 32
for i in range(5):                                                                # воронка книзу
    w = 16 - i * 2.4
    c.ellipse(CX + (i % 2 * 2 - 1) * 3, 72 - i * 7, w, 4, 'e' if i % 2 else 'l')
c.ellipse(CX, 34, 14, 16, 'l'); c.ellipse(CX - 3, 30, 10, 11, 'w')               # вихрь
for i in range(4): c.ellipse(CX - 10 + i * 6, 26 + i * 4, 7, 3, 'e')             # витки вихря
c.rect(CX - 22, 12, CX - 14, 30, 'l'); c.rect(CX + 14, 12, CX + 22, 30, 'l')     # руки вверх
c.ellipse(CX - 18, 10, 4.5, 4, 'w'); c.ellipse(CX + 18, 10, 4.5, 4, 'w')
c.ellipse(CX, 18, 9, 9, 'w'); c.ellipse(CX - 2, 16, 6, 6, 'c')
c.ellipse(CX - 4, 18, 2.4, 2.2, 'b'); c.ellipse(CX + 4, 18, 2.4, 2.2, 'b')
B.append(emit('air_elemental', c, 'воздушный элементаль: вихрь витками, руки вверх, воронка книзу'))
B.append(upg('storm_elemental', 'штормовой элементаль: грозовая синева, искры молний', 'air_elemental',
             {'l': 'b', 'w': 'c', 'e': 'B', 'c': 'w'}, extra=[(14, 10, 'f'), (54, 10, 'f')]))

# ---------------- водяной элементаль 76×72 ----------------
c = Fig(76, 72)
CX = 34
for i in range(4):                                                                # тело-волна
    w = 20 - i * 2
    c.ellipse(CX + (i % 2 * 2 - 1) * 4, 70 - i * 9, w, 6, 'Q')
    c.ellipse(CX + (i % 2 * 2 - 1) * 4, 68 - i * 9, w * 0.8, 3, 'q')
c.ellipse(CX, 32, 15, 16, 'q'); c.ellipse(CX - 3, 28, 11, 11, 'C')
c.rect(CX - 24, 26, CX - 15, 36, 'c'); c.rect(CX + 15, 22, CX + 24, 32, 'c')     # голубые руки
c.ellipse(CX - 25, 38, 5, 4, 'c'); c.ellipse(CX + 25, 34, 5, 4, 'c')
c.ellipse(CX, 16, 10, 10, 'c'); c.ellipse(CX - 2, 14, 7, 7, 'w')                 # голубая голова
c.ellipse(CX - 4, 16, 2.4, 2.2, 'B'); c.ellipse(CX + 4, 16, 2.4, 2.2, 'B')
for x in range(CX - 12, CX + 13, 5): c.ellipse(x, 6, 4, 3, 'w')                  # гребень с пеной
B.append(emit('water_elemental', c, 'водяной элементаль: тело волной, голубая голова и руки, гребень с пеной'))
B.append(upg('ice_elemental', 'ледяной элементаль: белый лёд, синие грани', 'water_elemental',
             {'q': 'c', 'Q': 'C', 'C': 'w', 'c': 'L'}))

# ---------------- огненный элементаль 73×83 ----------------
c = Fig(73, 83)
CX = 34
for x in range(CX - 18, CX + 19, 7): c.ellipse(x, 80, 5, 3, 'O')                 # угли внизу
c.flame(CX, 78, 40, 46, 'f', 'F', 'O', 7)
c.ellipse(CX, 44, 13, 15, 'F'); c.ellipse(CX - 3, 40, 9, 10, 'f')
c.rect(CX - 22, 34, CX - 14, 48, 'F'); c.rect(CX + 14, 30, CX + 22, 44, 'F')
c.flame(CX - 18, 34, 14, 16, 'w', 'f', 'F', 4)
c.flame(CX + 18, 30, 14, 16, 'w', 'f', 'F', 4)
c.ellipse(CX, 24, 10, 10, 'f'); c.ellipse(CX - 2, 22, 7, 7, 'w')                 # лицо светлее
c.ellipse(CX - 4, 24, 2.4, 2.2, 'R'); c.ellipse(CX + 4, 24, 2.4, 2.2, 'R')
c.flame(CX, 16, 22, 20, 'w', 'f', 'F', 5)
B.append(emit('fire_elemental', c, 'огненный элементаль: языки пламени, светлое лицо, угли у ног'))
B.append(upg('energy_elemental', 'энергетический элементаль: белое пламя с лазурью', 'fire_elemental',
             {'F': 'c', 'f': 'w', 'O': 'C', 'R': 'b'}))

# ---------------- земляной элементаль 82×88 ----------------
c = Fig(82, 88)
CX = 36
c.rect(CX - 20, 34, CX + 20, 64, 'T'); c.rect(CX - 20, 34, CX - 13, 64, 't')
c.rect(CX + 13, 34, CX + 20, 64, 'N')
for y in (42, 54): c.rect(CX - 20, y, CX + 20, y + 1, 'N')
c.line(CX - 12, 36, CX - 6, 50, 'N'); c.line(CX + 10, 56, CX + 4, 63, 'N')       # трещины
c.rect(CX - 30, 36, CX - 21, 58, 'T'); c.rect(CX - 30, 36, CX - 28, 58, 't')
c.rect(CX + 21, 16, CX + 30, 42, 'T'); c.rect(CX + 28, 16, CX + 30, 42, 'N')     # поднятая рука
c.rect(CX - 32, 58, CX - 20, 66, 'T')
c.ellipse(CX + 26, 10, 11, 9, 'e'); c.ellipse(CX + 23, 8, 7, 6, 'l')             # глыба
c.rect(CX - 16, 66, CX - 2, 87, 'T'); c.rect(CX + 2, 66, CX + 16, 87, 'T')
c.rect(CX - 16, 66, CX - 13, 87, 't'); c.rect(CX + 13, 66, CX + 16, 87, 'N')
c.rect(CX - 18, 83, CX + 18, 87, 'N')
c.ellipse(CX, 24, 13, 11, 'T'); c.ellipse(CX - 4, 21, 8, 7, 't')
c.rect(CX - 9, 24, CX - 3, 27, 'h'); c.rect(CX + 3, 24, CX + 9, 27, 'h')         # светящиеся глаза
c.rect(CX - 10, 32, CX + 9, 34, 'N')
B.append(emit('earth_elemental', c, 'земляной элементаль: кладка швами, трещины, светящиеся глаза, глыба в руке'))
B.append(upg('magma_elemental', 'магматический элементаль: раскалённые трещины', 'earth_elemental',
             {'T': 'u', 't': 'E', 'N': 'F', 'h': 'f'}))

# ---------------- псионический элементаль 82×89 ----------------
c = Fig(82, 89)
CX = 38
for i in range(5):                                                                # хвост-дымка
    c.ellipse(CX + (i % 2 * 2 - 1) * 4, 86 - i * 8, 14 - i * 1.6, 5, 'P' if i % 2 else 'p')
c.ellipse(CX, 46, 15, 17, 'p'); c.ellipse(CX - 4, 42, 11, 12, 'a')
c.rect(CX - 26, 36, CX - 16, 46, 'p'); c.rect(CX + 16, 36, CX + 26, 46, 'p')
c.ellipse(CX - 28, 48, 8, 8, 'A'); c.ellipse(CX - 28, 48, 5, 5, 'w')             # сферы в руках
c.ellipse(CX + 28, 48, 8, 8, 'A'); c.ellipse(CX + 28, 48, 5, 5, 'w')
c.ellipse(CX, 24, 11, 12, 'a'); c.ellipse(CX - 3, 21, 8, 8, 'A')
c.ellipse(CX - 4, 24, 2.6, 2.4, 'w'); c.ellipse(CX + 4, 24, 2.6, 2.4, 'w')
for i in range(10):                                                               # ореол
    import math
    ang = math.pi * i / 9
    c.ellipse(CX - math.cos(ang) * 20, 24 - math.sin(ang) * 20, 2.2, 2.2, 'A')
B.append(emit('psychic_elemental', c, 'псионический элементаль: ореол из искр, сферы в руках, хвост-дымка'))
B.append(upg('magic_elemental', 'магический элементаль: радужное свечение, золотые сферы', 'psychic_elemental',
             {'p': 'b', 'a': 'c', 'A': 'y', 'P': 'B'}))

# ---------------- жар-птица 98×92 ----------------
c = Fig(98, 92)
BX, BY = 48, 50
c.wing_feather(BX - 6, BY - 10, 44, 34, 'F', 'f', 'w', 'O', n=10, flip=True, a0=116, a1=30)
c.wing_feather(BX + 6, BY - 10, 44, 34, 'F', 'f', 'w', 'O', n=10, a0=116, a1=30)
c.ellipse(BX, BY + 2, 14, 17, 'F'); c.ellipse(BX - 3, BY - 2, 10, 11, 'f')
for i in range(6):                                                                # длинный хвост до земли
    c.ellipse(BX + 6 + i * 4, BY + 14 + i * 6, 7 - i * 0.6, 4, 'F' if i % 2 else 'o')
c.flame(BX + 28, BY + 44, 20, 22, 'f', 'F', 'O', 5)
for s in (-1, 1):
    c.rect(BX + s * 7 - 2, BY + 18, BX + s * 7 + 2, BY + 28, 'y')
    c.claws(BX + s * 7 - 4, BY + 28, 3, 'Y', 4, 4)
c.ellipse(BX, BY - 20, 10, 9, 'F'); c.ellipse(BX - 3, BY - 23, 6.5, 6, 'f')
c.poly([(BX - 9, BY - 20), (BX - 19, BY - 18), (BX - 9, BY - 14)], 'y')
c.ellipse(BX - 4, BY - 24, 2.8, 2.4, 'w'); c.ellipse(BX - 4, BY - 24, 1.4, 1.4, 'k')
c.flame(BX + 2, BY - 28, 16, 16, 'w', 'f', 'F', 4)                                # гребень
B.append(emit('firebird', c, 'жар-птица: крылья в пламени, гребень, длинный хвост до земли'))
B.append(upg('phoenix', 'феникс: белое пламя, лазурные концы перьев', 'firebird',
             {'F': 'f', 'f': 'w', 'O': 'F', 'o': 'c', 'y': 'w'}))

write('conflux', 'существа Сопряжения', B, 'conflux3.py')
