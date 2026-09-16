# -*- coding: utf-8 -*-
"""js/view/sprites_inferno_hd.js — Инферно в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

def imp_body(c, CX, CY, skin, light, dark, size=1.0):
    """Бесовское тельце: пузо, короткие ноги, рожки, хвост со стрелкой."""
    c.ellipse(CX, CY, 11 * size, 13 * size, skin)
    c.ellipse(CX, CY + 3 * size, 8 * size, 8 * size, light)                    # светлое брюшко
    c.rect(CX - 15 * size, CY - 6 * size, CX - 10 * size, CY + 6 * size, skin)
    c.rect(CX + 10 * size, CY - 6 * size, CX + 15 * size, CY + 6 * size, skin)
    c.rect(CX + 13 * size, CY - 6 * size, CX + 15 * size, CY + 6 * size, dark)
    for s in (-1, 1):
        c.rect(CX + s * 7 * size - 3 * size, CY + 12 * size, CX + s * 7 * size + 3 * size, CY + 22 * size, skin)
        c.rect(CX + s * 7 * size - 4 * size, CY + 22 * size, CX + s * 7 * size + 4 * size, CY + 26 * size, dark)
        c.claws(CX + s * 7 * size - 4 * size, CY + 26 * size, 3, 'i', int(3 * size), int(3 * size))
    c.line(CX + 10 * size, CY + 6 * size, CX + 20 * size, CY + 18 * size, dark, 3)   # хвост
    c.poly([(CX + 19 * size, CY + 16 * size), (CX + 25 * size, CY + 22 * size), (CX + 18 * size, CY + 21 * size)], dark)

# ---------------- бес 54×71 ----------------
c = Fig(54, 71)
CX = 24
c.wing_bat(CX + 9, 28, 20, 16, 'R', 'D', 'u', n=3, a0=96, a1=20)
c.wing_bat(CX - 9, 28, 20, 16, 'R', 'D', 'u', n=3, flip=True, a0=96, a1=20)
imp_body(c, CX, 38, 'r', 'o', 'R', 0.95)
c.ellipse(CX, 18, 9, 9, 'r'); c.ellipse(CX - 2, 15, 6, 6, 'o')
c.horns(CX, 12, 9, 'R', 'r', spread=6, curve=2)
c.ellipse(CX - 4, 18, 2.6, 2.2, 'f'); c.ellipse(CX + 4, 18, 2.6, 2.2, 'f')
c.rect(CX - 6, 23, CX + 5, 25, 'D')
for x in range(CX - 5, CX + 5, 3): c.rect(x, 23, x + 1, 24, 'i')
B.append(emit('imp', c, 'бес: рожки, светлое брюшко, кожаные крылья, хвост со стрелкой'))
B.append(upg('familiar', 'фамильяр: тёмно-багровая шкура, синее пламя в глазах', 'imp',
             {'r': 'R', 'o': 'r', 'R': 'D', 'f': 'c'}))

# ---------------- гог 54×71 ----------------
c = Fig(54, 71)
CX = 24
imp_body(c, CX, 38, 'O', 'o', 'D', 1.0)
c.ellipse(CX, 18, 9.5, 9.5, 'O'); c.ellipse(CX - 2, 15, 6.5, 6, 'S')           # светлое лицо
c.horns(CX, 12, 9, 'D', 'O', spread=6, curve=2)
c.ellipse(CX - 4, 18, 2.6, 2.2, 'f'); c.ellipse(CX + 4, 18, 2.6, 2.2, 'f')
c.rect(CX - 6, 23, CX + 5, 25, 'D')
c.rect(CX + 12, 20, CX + 16, 34, 'O')                                           # поднятая рука
c.ellipse(CX + 16, 14, 7, 7, 'F'); c.ellipse(CX + 15, 12, 4.5, 4.5, 'f')       # огненный шар
c.ellipse(CX + 15, 11, 2.4, 2.4, 'w')
B.append(emit('gog', c, 'гог: ржавая шкура, светлое лицо, рожки, огненный шар в поднятой руке'))
B.append(upg('magog', 'магог: багровая шкура, шар крупнее и ярче', 'gog',
             {'O': 'R', 'o': 'r', 'F': 'f', 'f': 'w'}))

# ---------------- адская гончая 82×62 ----------------
c = Fig(82, 62)
BX, BY = 40, 34
c.ellipse(BX, BY, 24, 12, 'u'); c.ellipse(BX - 3, BY - 5, 19, 7, 'E')
c.ellipse(BX + 2, BY + 6, 20, 6, 'z')
for x0, fr in ((BX - 16, 1), (BX - 6, 0), (BX + 10, 0), (BX + 18, 1)):
    c.ellipse(x0, BY + 11, 5, 8, 'u' if fr else 'z'); c.paw(x0, BY + 19, 5, 'u' if fr else 'z', 'E', 'i', 3)
c.flame(BX + 26, BY - 4, 14, 18, 'f', 'F', 'O', 5)                              # огненный хвост
c.ellipse(BX - 24, BY - 8, 11, 9, 'u'); c.ellipse(BX - 30, BY - 4, 8, 5, 'E')   # голова и морда
c.rect(BX - 36, BY - 4, BX - 28, BY - 1, 'R')                                    # светящаяся пасть
for x in range(int(BX - 35), int(BX - 28), 3): c.rect(x, BY - 4, x + 1, BY - 2, 'i')
c.ellipse(BX - 26, BY - 11, 2.8, 2.4, 'f')
c.poly([(BX - 22, BY - 15), (BX - 20, BY - 22), (BX - 16, BY - 14)], 'u')        # ухо
c.flame(BX - 16, BY - 12, 20, 16, 'f', 'F', 'O', 6)                              # огненная грива
B.append(emit('hell_hound', c, 'адская гончая: графитовая шкура, огненная грива и хвост, светящаяся пасть'))

# ---------------- цербер 88×72 ----------------
c = Fig(88, 72)
BX, BY = 44, 40
c.ellipse(BX, BY, 26, 13, 'u'); c.ellipse(BX - 3, BY - 5, 21, 8, 'E')
c.ellipse(BX + 2, BY + 7, 22, 7, 'z')
for x0, fr in ((BX - 18, 1), (BX - 6, 0), (BX + 12, 0), (BX + 20, 1)):
    c.ellipse(x0, BY + 12, 5.5, 9, 'u' if fr else 'z'); c.paw(x0, BY + 21, 5.5, 'u' if fr else 'z', 'E', 'i', 3)
c.flame(BX + 28, BY - 6, 16, 20, 'f', 'F', 'O', 5)
for i, (hx, hy, r) in enumerate(((BX - 30, BY - 16, 9), (BX - 24, BY - 4, 10), (BX - 34, BY + 6, 8))):
    c.ellipse(hx, hy, r, r * 0.85, 'u'); c.ellipse(hx - r * 0.5, hy + r * 0.3, r * 0.7, r * 0.5, 'E')
    c.rect(hx - r * 1.3, hy + r * 0.2, hx - r * 0.3, hy + r * 0.55, 'R')
    for x in range(int(hx - r * 1.2), int(hx - r * 0.3), 3): c.rect(x, hy + r * 0.2, x + 1, hy + r * 0.45, 'i')
    c.ellipse(hx - r * 0.2, hy - r * 0.3, 2.6, 2.2, 'f')
    c.poly([(hx + r * 0.2, hy - r * 0.8), (hx + r * 0.5, hy - r * 1.5), (hx + r * 0.8, hy - r * 0.7)], 'u')
c.flame(BX - 14, BY - 16, 22, 18, 'f', 'F', 'O', 6)
B.append(emit('cerberus', c, 'цербер: три головы с горящими пастями, огненная грива и хвост'))

# ---------------- демон 48×77 ----------------
c = Fig(48, 77)
CX = 22
c.rect(CX - 11, 28, CX + 11, 50, 'r'); c.ellipse(CX, 34, 9, 9, 'o')             # светлая грудь
c.rect(CX - 11, 28, CX - 8, 50, 'R'); c.rect(CX + 8, 28, CX + 11, 50, 'R')
c.rect(CX - 12, 48, CX + 12, 53, 'D'); c.rect(CX - 12, 48, CX + 12, 49, 'N')    # повязка
c.rect(CX - 17, 30, CX - 12, 48, 'r'); c.rect(CX + 12, 30, CX + 17, 48, 'r')
c.rect(CX + 15, 30, CX + 17, 48, 'R')
c.claws(CX - 18, 49, 3, 'i', 3, 4); c.claws(CX + 12, 49, 3, 'i', 3, 4)
c.legs_bare(CX, 53, 72, 'r', 'R', gap=4)
for s in (-1, 1): c.claws(CX + s * 8 - 5, 72, 3, 'i', 4, 4)
c.ellipse(CX, 17, 10, 10, 'r'); c.ellipse(CX - 2, 14, 6.5, 6, 'o')
c.horns(CX, 11, 8, 'R', 'o', spread=7, curve=2)
c.ellipse(CX - 4, 17, 2.8, 2.4, 'f'); c.ellipse(CX + 4, 17, 2.8, 2.4, 'f')
c.rect(CX - 7, 22, CX + 6, 24, 'D')
for x in range(CX - 6, CX + 6, 3): c.rect(x, 22, x + 1, 23, 'i')
B.append(emit('demon', c, 'демон: мускулистый, светлая грудь, короткие рога, когти, повязка'))
B.append(upg('horned_demon', 'рогатый демон: длинные рога, тёмно-багровая шкура', 'demon',
             {'r': 'R', 'o': 'r', 'R': 'D'}, extra=[(12, 6, 'i'), (13, 4, 'i'), (30, 6, 'i'), (31, 4, 'i')]))

# ---------------- порождение ада 88×89 ----------------
c = Fig(88, 89)
CX = 40
c.wing_bat(CX + 14, 34, 34, 26, 'R', 'D', 'u', n=4, a0=96, a1=16)
c.wing_bat(CX - 14, 34, 34, 26, 'R', 'D', 'u', n=4, flip=True, a0=96, a1=16)
c.rect(CX - 15, 32, CX + 15, 58, 'r'); c.ellipse(CX, 40, 12, 12, 'o')
c.rect(CX - 15, 32, CX - 11, 58, 'R'); c.rect(CX + 11, 32, CX + 15, 58, 'R')
c.pauldrons(CX, 32, 19, 'e', 'l', 'E', lames=2)                                  # стальные оплечья
c.rect(CX - 24, 40, CX - 17, 56, 'r'); c.rect(CX + 17, 40, CX + 24, 56, 'r')
c.rect(CX - 24, 44, CX - 17, 48, 'e'); c.rect(CX + 17, 44, CX + 24, 48, 'e')     # наручи
c.rect(CX - 16, 56, CX + 16, 61, 'D')
c.legs_bare(CX, 61, 88, 'r', 'R', gap=6)
for s in (-1, 1): c.claws(CX + s * 10 - 6, 88, 3, 'i', 5, 4)
c.ellipse(CX, 20, 12, 12, 'r'); c.ellipse(CX - 3, 16, 8, 7, 'o')
c.horns(CX, 12, 12, 'R', 'o', spread=9, curve=4)
c.ellipse(CX - 5, 20, 3, 2.6, 'f'); c.ellipse(CX + 5, 20, 3, 2.6, 'f')
c.rect(CX - 8, 26, CX + 7, 28, 'D')
for i in range(6): c.ellipse(CX + 26 + i * 2, 44 + i * 5, 2.4, 2.4, 'N')         # кнут
B.append(emit('pit_fiend', c, 'порождение ада: стальные оплечья и наручи, кожаные крылья, кнут'))
B.append(upg('pit_lord', 'повелитель ада: чёрная шкура, золочёная сталь', 'pit_fiend',
             {'r': 'R', 'o': 'r', 'R': 'D', 'e': 'y', 'l': 'f', 'E': 'Y'}))

# ---------------- ифрит 67×89 ----------------
c = Fig(67, 89)
CX = 30
c.flame(CX, 88, 34, 30, 'f', 'F', 'o', 6)                                        # пламя вместо ног
c.rect(CX - 13, 34, CX + 13, 60, 'r'); c.ellipse(CX, 42, 10, 10, 'o')
c.rect(CX - 13, 34, CX - 10, 60, 'R'); c.rect(CX + 10, 34, CX + 13, 60, 'R')
c.rect(CX - 14, 56, CX + 14, 61, 'y'); c.rect(CX - 14, 56, CX + 14, 56, 'f')     # золотой пояс
c.rect(CX - 20, 36, CX - 14, 54, 'r'); c.rect(CX + 14, 24, CX + 20, 50, 'r')
c.ellipse(CX - 17, 40, 4, 3.2, 'y'); c.ellipse(CX + 17, 30, 4, 3.2, 'y')        # браслеты
c.ellipse(CX, 22, 11, 11, 'r'); c.ellipse(CX - 3, 19, 7, 6.5, 'o')
c.flame(CX, 12, 20, 16, 'f', 'F', 'O', 5)                                        # пламя вместо волос
c.ellipse(CX - 4, 22, 2.8, 2.4, 'y'); c.ellipse(CX + 4, 22, 2.8, 2.4, 'y')
c.rect(CX - 7, 27, CX + 6, 29, 'D')
c.poly([(CX + 20, 24), (CX + 34, 6), (CX + 36, 12), (CX + 23, 28)], 'l')         # ятаган
c.line(CX + 22, 25, CX + 33, 10, 'w')
c.rect(CX + 18, 22, CX + 22, 28, 'Y')
B.append(emit('efreet', c, 'ифрит: пламя вместо волос и ног, золотые браслеты и пояс, ятаган'))
B.append(upg('efreet_sultan', 'султан ифритов: синее пламя, голубая кожа, золотой обруч', 'efreet',
             {'f': 'c', 'F': 'b', 'o': 'C', 'r': 'B', 'R': 'P'}))

# ---------------- дьявол 98×92 ----------------
c = Fig(98, 92)
CX = 46
c.wing_bat(CX + 16, 32, 40, 30, 'R', 'D', 'u', n=4, a0=100, a1=14)
c.wing_bat(CX - 16, 32, 40, 30, 'R', 'D', 'u', n=4, flip=True, a0=100, a1=14)
c.rect(CX - 14, 30, CX + 14, 58, 'R'); c.ellipse(CX, 38, 11, 11, 'r')
c.rect(CX + 10, 30, CX + 14, 58, 'D')
c.rect(CX - 15, 56, CX + 15, 61, 'D')
c.rect(CX - 22, 34, CX - 15, 54, 'R'); c.rect(CX + 15, 34, CX + 22, 54, 'R')
c.legs_bare(CX, 61, 84, 'R', 'D', gap=6)
for s in (-1, 1): c.rect(CX + s * 10 - 6, 84, CX + s * 10 + 6, 91, 'D')          # копыта
c.line(CX + 14, 56, CX + 30, 74, 'D', 3)
c.poly([(CX + 28, 72), (CX + 36, 80), (CX + 27, 78)], 'D')                       # хвост со стрелкой
c.ellipse(CX, 18, 11, 11, 'R'); c.ellipse(CX - 3, 15, 7, 6.5, 'r')
c.horns(CX, 10, 16, 'D', 'R', spread=9, curve=5)
c.ellipse(CX - 5, 18, 3, 2.6, 'f'); c.ellipse(CX + 5, 18, 3, 2.6, 'f')
c.rect(CX - 8, 24, CX + 7, 26, 'k')
for x in range(CX - 7, CX + 7, 3): c.rect(x, 24, x + 1, 25, 'i')
TX = CX + 26                                                                      # золотой трезубец
c.rect(TX - 1, 18, TX + 1, 80, 'Y'); c.rect(TX - 1, 18, TX - 1, 80, 'y')
for dx in (-6, 0, 6): c.poly([(TX + dx - 2, 18), (TX + dx, 4), (TX + dx + 2, 18)], 'y')
c.rect(TX - 8, 17, TX + 8, 20, 'Y')
B.append(emit('devil', c, 'дьявол: длинные рога, широкие крылья, копыта, хвост, золотой трезубец'))
B.append(upg('arch_devil', 'архидьявол: чёрная шкура, багровые крылья, огонь у трезубца', 'devil',
             {'R': 'u', 'r': 'R', 'D': 'z', 'y': 'f', 'Y': 'y'},
             extra=[(70, 4, 'F'), (71, 3, 'F'), (72, 4, 'o')]))

write('inferno', 'существа Инферно', B, 'inferno3.py')
