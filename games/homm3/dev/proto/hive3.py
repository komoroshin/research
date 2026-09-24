# -*- coding: utf-8 -*-
"""js/view/sprites_hive_hd.js — Улей в сетке unit 3.

Рой узнаётся по общей палитре хитина (h/H/j — светлый, основной, тёмный) и по
силуэтам: низкая личинка, прямоходящий рабочий, приземистый плевун, оса с
перепончатыми крыльями, высокий богомол, широкий жук и грузная матка.
Все смотрят вправо (спрайт рисуется головой влево и зеркалится через flipx).
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- личинка 58×40 ----------------
c = Fig(58, 40)
c.chitin(28, 26, 24, 11, 'H', 'h', 'j', seg=7)
c.ellipse(20, 32, 20, 5, 'j')                                                    # тень брюшка
c.ellipse(48, 22, 9, 8, 'H'); c.ellipse(46, 19, 6, 5, 'h')                        # голова
c.compound_eye(50, 19, 3, 2.6, 'k', 'r')
c.mandibles(53, 23, 4, 'j', 'D')
for x in range(10, 44, 6):                                                        # ложноножки
    c.ellipse(x, 36, 2.6, 2.4, 'j')
c.antennae(50, 14, 6, 'j', spread=3)
B.append(emit('larva', c, 'личинка: низкое сегментированное тело, ложноножки, жвалы'))
B.append(upg('blood_larva', 'кровавая личинка: багровый хитин, жёлтый глаз', 'larva',
             {'H': 'r', 'h': 'm', 'j': 'R', 'r': 'y'}))

# ---------------- рабочий 60×64 ----------------
c = Fig(60, 64)
c.chitin(28, 40, 15, 12, 'H', 'h', 'j', seg=4)                                    # брюшко
c.chitin(34, 24, 11, 9, 'H', 'h', 'j', seg=3)                                     # грудь
c.insect_legs(30, 30, 62, 'H', 'j', pairs=3, span=20)
c.ellipse(46, 16, 9, 8, 'H'); c.ellipse(44, 13, 6, 5, 'h')                         # голова
c.compound_eye(49, 14, 3.4, 3, 'k', 'y')
c.mandibles(52, 19, 5, 'j', 'D')
c.antennae(48, 8, 9, 'j', spread=4)
c.rect(20, 34, 26, 38, 'j')
B.append(emit('worker', c, 'рабочий: брюшко и грудь раздельно, три пары суставчатых лап'))
B.append(upg('builder', 'строитель: светлый восковой хитин, янтарные накладки', 'worker',
             {'H': 'T', 'h': 'i', 'j': 'N', 'y': 'f'}))

# ---------------- плевун 66×58 ----------------
c = Fig(66, 58)
c.chitin(24, 30, 19, 15, 'H', 'h', 'j', seg=5, rot=-0.35)                          # брюшко задрано вверх-назад
c.insect_legs(34, 34, 56, 'H', 'j', pairs=3, span=26)
c.chitin(44, 34, 12, 10, 'H', 'h', 'j', seg=3)
c.ellipse(54, 30, 9, 8, 'H'); c.ellipse(52, 27, 6, 5, 'h')
c.compound_eye(57, 27, 3, 2.6, 'k', 'o')
c.rect(58, 32, 64, 36, 'j'); c.rect(58, 32, 64, 33, 'H')                            # сопло
for i, (dx, dy, r) in enumerate(((7, -1, 2.4), (12, -3, 2.0), (16, -6, 1.6))):      # струя кислоты
    c.ellipse(62 + dx, 34 + dy, r, r * 0.9, 'h' if i % 2 else 'o')
c.antennae(54, 22, 7, 'j', spread=3)
B.append(emit('spitter', c, 'плевун: задранное брюшко, сопло у головы, струя кислоты'))
B.append(upg('acid_spitter', 'кислотный плевун: ядовито-жёлтый хитин, зелёная кислота', 'spitter',
             {'H': 'j', 'h': 'h', 'j': 'G', 'o': 'w'}))

# ---------------- оса-воин 82×74 ----------------
c = Fig(82, 74)
c.wing_membrane(38, 26, 34, 26, 'v', 'L', 'e', flip=True)                          # дальнее крыло
c.wing_membrane(40, 24, 30, 22, 'v', 'L', 'e', flip=True, droop=0.3)
c.chitin(26, 46, 17, 11, 'f', 'y', 'O', seg=5)                                     # полосатое брюшко
for x in range(14, 40, 7): c.rect(x, 36, x + 3, 56, 'D')                           # чёрные полосы
c.sting(9, 50, 9, 'D', 'k')
c.chitin(44, 32, 12, 10, 'u', 'e', 'k', seg=3)                                     # грудь светлее головы
c.insect_legs(42, 40, 66, 'D', 'k', pairs=3, span=20)
c.ellipse(56, 22, 9, 8, 'D'); c.ellipse(54, 19, 6, 5, 'u')
c.compound_eye(60, 20, 3.6, 3.2, 'y', 'w')
c.mandibles(62, 25, 4, 'k', 'k')
c.antennae(58, 13, 9, 'k', spread=4)
B.append(emit('wasp_warrior', c, 'оса-воин: полосатое брюшко, жало, два перепончатых крыла'))
B.append(upg('wasp_reaver', 'оса-опустошитель: багровые полосы, зелёное жало', 'wasp_warrior',
             {'f': 'r', 'y': 'm', 'O': 'R', 'v': 'h'}))

# ---------------- богомол 78×90 ----------------
c = Fig(78, 90)
c.insect_legs(34, 52, 88, 'H', 'j', pairs=2, span=24)
c.chitin(28, 56, 16, 10, 'H', 'h', 'j', seg=5, rot=-0.5)                            # брюшко назад
c.chitin(38, 36, 11, 14, 'H', 'h', 'j', seg=4)                                      # вытянутая грудь
c.wing_membrane(34, 40, 22, 16, 'j', 'H', 'G', flip=True, droop=0.2)                # сложенные надкрылья
for s, yy in ((1, 30), (-1, 38)):                                                   # хватательные лапы
    c.line(44, yy, 58, yy - 10, 'H', 4)
    c.line(58, yy - 10, 52, yy + 6, 'H', 4)
    for i in range(5): c.ellipse(53 - i * 1.4, yy - 6 + i * 2.2, 1.2, 1.2, 'i')      # шипы
c.ellipse(46, 18, 9, 7, 'H'); c.ellipse(44, 15, 6, 4.4, 'h')                         # треугольная голова
c.poly([(38, 20), (54, 14), (54, 24)], 'H')
c.compound_eye(50, 15, 3.4, 3, 'h', 'w', 'G')
c.compound_eye(41, 17, 2.6, 2.4, 'h', 'w', 'G')
c.antennae(47, 9, 10, 'j', spread=4)
B.append(emit('mantis', c, 'богомол: треугольная голова, хватательные лапы с шипами, сложенные надкрылья'))
B.append(upg('mantis_reaper', 'богомол-жнец: белёсый хитин, красные глаза', 'mantis',
             {'H': 'l', 'h': 'L', 'j': 'e', 'G': 'E', 'w': 'r'}))

# ---------------- жук-таран 98×66 ----------------
c = Fig(98, 66)
c.insect_legs(46, 34, 64, 'j', 'D', pairs=3, span=34)
c.chitin(42, 34, 32, 18, 'H', 'h', 'j', seg=2)                                       # надкрылья
c.line(42, 18, 42, 50, 'j', 2)                                                       # шов надкрылий
for dx in (-18, -8, 8, 18):                                                          # рёбра надкрылий
    c.line(42 + dx, 20 + abs(dx) * 0.35, 42 + dx, 48 - abs(dx) * 0.35, 'j')
c.chitin(70, 30, 13, 12, 'j', 'H', 'D', seg=2)                                       # переднеспинка
c.ellipse(82, 28, 9, 8, 'j'); c.ellipse(80, 25, 6, 5, 'H')
c.compound_eye(85, 26, 3, 2.6, 'k', 'y')
c.poly([(86, 24), (97, 8), (91, 28)], 'i')                                           # рог-таран
c.poly([(87, 25), (94, 15), (90, 28)], 'I')
c.mandibles(88, 32, 5, 'D', 'k')
B.append(emit('ram_beetle', c, 'жук-таран: широкие надкрылья со швом, рог, шесть лап'))
B.append(upg('fortress_beetle', 'жук-крепость: стальной хитин, золотой рог', 'ram_beetle',
             {'H': 'e', 'h': 'l', 'j': 'E', 'i': 'y', 'I': 'Y'}))

# ---------------- матка 110×88 ----------------
c = Fig(110, 88)
c.insect_legs(52, 46, 86, 'j', 'D', pairs=3, span=34)
c.chitin(34, 50, 34, 22, 'f', 'y', 'O', seg=6)                                        # огромное брюшко
c.ellipse(30, 62, 20, 5, 'O')                                                         # тень по низу брюшка
c.wing_membrane(58, 34, 40, 30, 'v', 'L', 'e', flip=True)
c.wing_membrane(60, 32, 34, 24, 'v', 'L', 'e', flip=True, droop=0.25)
c.chitin(64, 34, 16, 14, 'H', 'h', 'j', seg=3)                                        # грудь
c.ellipse(82, 24, 12, 10, 'H'); c.ellipse(79, 20, 8, 6, 'h')                          # голова
c.compound_eye(87, 21, 4.4, 3.8, 'k', 'y')
c.compound_eye(76, 18, 3, 2.6, 'k', 'y')
c.mandibles(90, 28, 6, 'j', 'D')
for i in range(-2, 3):                                                                # венец из шипов
    c.poly([(80 + i * 4 - 1.6, 14), (80 + i * 4, 14 - (8 if i == 0 else 5)), (80 + i * 4 + 1.6, 14)], 'y')
c.antennae(84, 10, 11, 'j', spread=5)
B.append(emit('queen', c, 'матка: огромное янтарное брюшко, венец из шипов, крылья'))
B.append(upg('ancient_queen', 'древняя матка: тёмный панцирь, багровое брюшко, белый венец', 'queen',
             {'f': 'r', 'y': 'm', 'O': 'R', 'H': 'u', 'h': 'e', 'j': 'k'}))

write('hive', 'существа Улья', B, 'hive3.py')
