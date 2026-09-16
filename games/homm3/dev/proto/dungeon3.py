# -*- coding: utf-8 -*-
"""js/view/sprites_dungeon_hd.js — Подземелье в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- троглодит 58×71 ----------------
c = Fig(58, 71)
CX = 26
c.ellipse(CX, 38, 13, 15, 'e'); c.ellipse(CX, 42, 9, 9, 'l')                     # светлое брюхо
for i in range(6):                                                                # гребень на спине
    c.poly([(CX + 9 + i, 30 - i * 2), (CX + 12 + i, 24 - i * 3), (CX + 14 + i, 30 - i * 2)], 'E')
c.rect(CX - 18, 32, CX - 12, 46, 'e'); c.rect(CX + 12, 32, CX + 18, 46, 'e')
c.rect(CX + 16, 32, CX + 18, 46, 'E')
c.ellipse(CX - 16, 47, 3.6, 3, 'l'); c.ellipse(CX + 16, 47, 3.6, 3, 'l')
c.legs_bare(CX, 52, 70, 'e', 'E', gap=5)
for s in (-1, 1): c.claws(CX + s * 9 - 5, 70, 3, 'l', 4, 3)
c.ellipse(CX - 4, 18, 11, 9, 'e'); c.ellipse(CX - 7, 15, 7, 6, 'l')              # безглазая голова
c.rect(CX - 14, 20, CX - 2, 23, 'u')                                             # пасть
for x in range(CX - 13, CX - 2, 3): c.rect(x, 20, x + 1, 22, 'i')
c.rect(CX - 10, 12, CX + 2, 14, 'E')                                             # надбровье вместо глаз
CLB = CX + 20
c.rect(CLB - 2, 30, CLB + 2, 62, 'N'); c.rect(CLB - 2, 30, CLB - 1, 62, 'n')     # дубина
c.ellipse(CLB, 28, 6, 7, 'N'); c.ellipse(CLB - 1, 26, 4, 4.5, 'n')
for i in range(3): c.ellipse(CLB - 4 + i * 4, 26 + i * 2, 1.8, 1.8, 'i')          # шипы
B.append(emit('troglodyte', c, 'троглодит: безглазая морда, гребень на спине, светлое брюхо, дубина с шипами'))
B.append(upg('infernal_troglodyte', 'инфернальный троглодит: багровая шкура, огненный гребень', 'troglodyte',
             {'e': 'R', 'l': 'r', 'E': 'D', 'u': 'z'}))

# ---------------- гарпия 67×72 ----------------
c = Fig(67, 72)
CX = 30
c.wing_feather(CX + 8, 26, 34, 26, 'Y', 'y', 'f', 'O', n=8, a0=108, a1=24)
c.wing_feather(CX - 8, 26, 34, 26, 'Y', 'y', 'f', 'O', n=8, flip=True, a0=108, a1=24)
c.ellipse(CX, 34, 10, 12, 'S'); c.ellipse(CX - 2, 31, 7, 8, 's')                 # торс
c.rect(CX - 9, 36, CX + 9, 39, 'N')
for s in (-1, 1):                                                                 # птичьи лапы
    c.rect(CX + s * 6 - 2, 46, CX + s * 6 + 2, 58, 'T')
    for y in range(48, 58, 3): c.rect(CX + s * 6 - 2, y, CX + s * 6 + 2, y, 'N')
    c.rect(CX + s * 6 - 5, 58, CX + s * 6 + 5, 62, 'T')
    c.claws(CX + s * 6 - 5, 62, 3, 'i', 4, 5)
c.face(CX, 16, 8, 'S', 'T', hair='D', eye='k')
c.ellipse(CX, 9, 9.5, 6, 'D'); c.fur(CX - 9, 10, CX + 9, 26, 'z', step=3, length=14)  # тёмные волосы
B.append(emit('harpy', c, 'гарпия: золотые крылья веером, тёмные волосы прядями, птичьи лапы с когтями'))
B.append(upg('harpy_hag', 'ведьма-гарпия: серые крылья, зеленоватая кожа', 'harpy',
             {'y': 'e', 'Y': 'E', 'f': 'l', 'O': 'u', 'S': 'H', 's': 'h'}))

# ---------------- бехолдер 67×68 ----------------
c = Fig(67, 68)
CX, CY = 32, 36
c.ellipse(CX, CY, 20, 19, 'x'); c.ellipse(CX - 4, CY - 5, 14, 13, 'p')           # шар
c.ellipse(CX, CY - 2, 12, 12, 'w'); c.ellipse(CX, CY - 2, 8, 8, 'c')             # огромный глаз
c.ellipse(CX, CY - 2, 4.5, 4.5, 'k'); c.ellipse(CX - 2, CY - 5, 2, 2, 'w')
c.rect(CX - 13, CY + 12, CX + 12, CY + 15, 'z')                                   # зубастая пасть
for x in range(CX - 12, CX + 12, 3): c.rect(x, CY + 12, x + 1, CY + 15, 'i')
for i, (dx, dy) in enumerate(((-14, -20), (-6, -26), (4, -27), (13, -21))):       # стебли с глазками
    c.line(CX + dx * 0.5, CY - 16, CX + dx, CY + dy, 'p', 3)
    c.ellipse(CX + dx, CY + dy - 3, 4.5, 4.5, 'w'); c.ellipse(CX + dx, CY + dy - 3, 2.4, 2.4, 'k')
B.append(emit('beholder', c, 'бехолдер: парящий шар, огромный глаз, стебли с глазками, зубастая пасть'))
B.append(upg('evil_eye', 'злой глаз: багровая плоть, красная радужка', 'beholder',
             {'x': 'R', 'p': 'r', 'c': 'r', 'w': 'o'}))

# ---------------- медуза 73×80 ----------------
c = Fig(73, 80)
CX = 32
for i, (w, y) in enumerate(((20, 52), (23, 63), (18, 74))):
    ox = (i % 2 * 2 - 1) * 5
    c.ellipse(CX + ox, y, w, 7.5, 'j')                       # тень кольца
    c.ellipse(CX + ox, y - 1.5, w * 0.92, 5, 'G')
    c.ellipse(CX + ox, y - 3.5, w * 0.72, 2.6, 'g')          # свет по верхнему краю
c.scales(CX - 24, 46, CX + 24, 78, 'g', 5, only='G')
c.ellipse(CX, 32, 10, 12, 'u'); c.ellipse(CX - 3, 29, 7, 8, 'E')                  # тёмное платье
c.rect(CX - 9, 38, CX + 9, 41, 'Y')
c.rect(CX - 16, 26, CX - 9, 34, 'S'); c.rect(CX + 9, 30, CX + 16, 38, 'S')        # руки
c.ellipse(CX - 17, 35, 3.4, 3, 'S'); c.ellipse(CX + 17, 39, 3.4, 3, 'S')
c.face(CX, 14, 8, 'S', 'T', eye='y')
for i, (dx, dy) in enumerate(((-15, -4), (-9, -13), (0, -17), (9, -13), (15, -4))):  # волосы-змеи
    c.line(CX + dx * 0.35, 11, CX + dx, 7 + dy, 'G', 3)
    c.ellipse(CX + dx, 4 + dy, 4.2, 3.4, 'g')               # голова змеи
    c.ellipse(CX + dx - 1, 3 + dy, 1.8, 1.6, 'r')           # глаз
    c.rect(CX + dx - 3, 6 + dy, CX + dx + 3, 7 + dy, 'j')   # пасть
c.bow(CX + 20, 12, 52, 'n', 'N', 'l')                                             # лук со стрелой
c.rect(CX + 12, 30, CX + 26, 31, 'T'); c.poly([(CX + 26, 28), (CX + 31, 30), (CX + 26, 33)], 'l')
B.append(emit('medusa', c, 'медуза: кольца хвоста чешуёй, волосы-змеи, тёмное платье, лук со стрелой'))
B.append(upg('medusa_queen', 'королева медуз: бирюзовая чешуя, багровое платье, золотой венец', 'medusa',
             {'G': 'q', 'g': 'v', 'j': 'Q', 'u': 'R', 'E': 'r'},
             extra=[(30, 6, 'y'), (31, 5, 'y'), (32, 5, 'y'), (33, 6, 'y')]))

# ---------------- минотавр 68×92 ----------------
c = Fig(68, 92)
CX = 30
c.rect(CX - 15, 34, CX + 15, 60, 'S'); c.ellipse(CX, 42, 11, 11, 's')            # загорелый торс
c.rect(CX - 15, 34, CX - 11, 60, 'T'); c.rect(CX + 11, 34, CX + 15, 60, 'T')
c.rect(CX - 16, 58, CX + 16, 63, 'r'); c.rect(CX - 16, 58, CX + 16, 59, 'o')     # красная повязка
c.rect(CX - 23, 36, CX - 16, 56, 'S'); c.rect(CX + 16, 36, CX + 23, 56, 'S')
c.rect(CX - 23, 36, CX - 21, 56, 'T'); c.rect(CX + 21, 36, CX + 23, 56, 'T')
c.legs_bare(CX, 63, 88, 'N', 'D', gap=6)                                          # мохнатые ноги
c.fur(CX - 12, 64, CX + 12, 84, 'D', step=3, length=10)
for s in (-1, 1): c.rect(CX + s * 9 - 6, 88, CX + s * 9 + 6, 91, 'D')            # копыта
c.ellipse(CX, 20, 14, 13, 'N'); c.ellipse(CX - 3, 16, 9, 8, 'd')                 # бычья голова
c.ellipse(CX - 1, 26, 8, 5, 'T')                                                  # морда
c.rect(CX - 4, 26, CX - 2, 28, 'D'); c.rect(CX + 2, 26, CX + 4, 28, 'D')
c.horns(CX, 15, 14, 'I', 'i', spread=12, curve=7)
c.ellipse(CX - 5, 19, 2.8, 2.4, 'r'); c.ellipse(CX + 5, 19, 2.8, 2.4, 'r')
AX = CX + 24                                                                      # двусторонняя секира
c.rect(AX - 2, 12, AX + 2, 70, 'N'); c.rect(AX - 2, 12, AX - 1, 70, 'n')
c.poly([(AX - 12, 12), (AX - 1, 4), (AX - 1, 24)], 'e'); c.poly([(AX - 11, 13), (AX - 2, 7), (AX - 2, 22)], 'l')
c.poly([(AX + 12, 12), (AX + 1, 4), (AX + 1, 24)], 'e'); c.poly([(AX + 11, 13), (AX + 2, 7), (AX + 2, 22)], 'e')
B.append(emit('minotaur', c, 'минотавр: бычья голова с рогами, загорелый торс, повязка, двусторонняя секира'))
B.append(upg('minotaur_king', 'король минотавров: чёрная шерсть, золотые рога, синяя повязка', 'minotaur',
             {'N': 'u', 'd': 'E', 'i': 'y', 'L': 'f', 'r': 'b', 'o': 'c'}))

# ---------------- мантикора 91×89 ----------------
c = Fig(91, 89)
BX, BY = 44, 54
c.wing_bat(BX + 4, BY - 18, 38, 28, 'R', 'D', 'u', n=4, a0=104, a1=22)
c.ellipse(BX, BY, 27, 15, 'O'); c.ellipse(BX - 4, BY - 6, 22, 9, 'o')
c.ellipse(BX + 2, BY + 8, 23, 7, 'N')
c.fur(BX - 20, BY + 4, BX + 20, BY + 14, 'N', step=5, length=9)
for x0, fr in ((BX - 18, 1), (BX - 6, 0), (BX + 12, 0), (BX + 20, 1)):
    c.ellipse(x0, BY + 14, 6, 9, 'O' if fr else 'N'); c.paw(x0, BY + 22, 6, 'O' if fr else 'N', 'o', 'i', 3)
c.ellipse(BX - 26, BY - 8, 12, 12, 'O')                                           # голова
c.fur(BX - 38, BY - 20, BX - 16, BY + 6, 'D', step=3, length=18)                  # тёмная грива
c.ellipse(BX - 30, BY - 6, 8, 6, 'o')
c.rect(BX - 38, BY - 4, BX - 30, BY - 1, 'R')
for x in range(int(BX - 37), int(BX - 30), 3): c.rect(x, BY - 4, x + 1, BY - 2, 'i')
c.ellipse(BX - 30, BY - 12, 3, 2.6, 'y'); c.ellipse(BX - 30, BY - 12, 1.5, 1.5, 'k')
for i in range(5):                                                                # хвост скорпиона
    c.ellipse(BX + 28 + i * 5, BY - 4 - i * 6, 4.5 - i * 0.4, 4 - i * 0.3, 'N')
c.poly([(BX + 48, BY - 30), (BX + 58, BY - 38), (BX + 50, BY - 22)], 'i')         # жало
B.append(emit('manticore', c, 'мантикора: тёмная грива прядями, перепончатые крылья, хвост скорпиона с жалом'))
B.append(upg('scorpicore', 'скорпикора: багровая шкура, чёрные крылья, ядовитое жало', 'manticore',
             {'O': 'R', 'o': 'r', 'N': 'D', 'R': 'z', 'i': 'h'}))

# ---------------- красный дракон 98×92 ----------------
c = Fig(98, 92)
BX, BY = 50, 56
c.wing_bat(BX + 6, BY - 20, 44, 34, 'R', 'D', 'u', n=4, a0=110, a1=16)
c.wing_bat(BX - 2, BY - 22, 36, 28, 'R', 'D', 'r', n=4, flip=True, a0=112, a1=40)
c.ellipse(BX, BY, 30, 17, 'r'); c.ellipse(BX - 4, BY - 7, 25, 10, 'R')
c.ellipse(BX + 2, BY + 8, 26, 8, 'y')                                             # золотое брюхо
c.scales(BX - 28, BY - 14, BX + 26, BY + 4, 'R', 5, only='r')
c.line(BX + 28, BY - 4, BX + 44, BY + 14, 'r', 6)
c.poly([(BX + 42, BY + 10), (BX + 50, BY + 18), (BX + 40, BY + 18)], 'R')
for x0, fr in ((BX - 18, 1), (BX + 12, 0)):
    c.ellipse(x0, BY + 15, 7, 11, 'r' if fr else 'R'); c.paw(x0, BY + 24, 7, 'r' if fr else 'R', 'o', 'i', 3)
for i in range(7):
    x = BX - 20 + i * 6
    c.poly([(x, BY - 16), (x + 3, BY - 16 - (5 + i % 3 * 3)), (x + 6, BY - 15)], 'R')
c.ellipse(BX - 30, BY - 14, 11, 10, 'r')
c.dragon_head(BX - 34, BY - 24, 11, 'r', 'o', 'R', eye='y')
c.flame(BX - 48, BY - 20, 16, 18, 'f', 'F', 'O', 5)                               # огонь из пасти
B.append(emit('red_dragon', c, 'красный дракон: чешуя, золотое брюхо, два перепончатых крыла, огонь из пасти'))
B.append(upg('black_dragon', 'чёрный дракон: чёрная чешуя, багровые крылья, синее пламя', 'red_dragon',
             {'r': 'u', 'R': 'z', 'o': 'E', 'y': 'E', 'f': 'c', 'F': 'b', 'O': 'B'}))

write('dungeon', 'существа Подземелья', B, 'dungeon3.py')
