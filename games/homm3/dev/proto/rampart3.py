# -*- coding: utf-8 -*-
"""js/view/sprites_rampart_hd.js — Оплот в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- кентавр 70×74 ----------------
c = Fig(70, 74)
c.horse(34, 46, 46, 24, 'n', 'T', 'N', mane='N', head_left=False, legs=True)
c.ellipse(34, 46, 10, 9, 'n')                                              # стык торса и крупа
TX = 22
c.rect(TX - 8, 18, TX + 8, 36, 'G'); c.rect(TX - 8, 18, TX - 6, 36, 'j')    # зелёная туника
c.rect(TX + 6, 18, TX + 8, 36, 'j'); c.folds(TX - 7, 20, TX + 7, 35, 'j', 2)
c.rect(TX - 9, 32, TX + 9, 35, 'N'); c.rect(TX - 9, 32, TX + 9, 32, 'n')    # пояс
c.rect(TX - 12, 20, TX - 8, 32, 'S'); c.rect(TX + 8, 20, TX + 12, 32, 'S')  # руки
c.rect(TX + 10, 20, TX + 12, 32, 'T')
c.face(TX, 12, 6.5, 'S', 'T', hair='N', eye='k', beard='N')
c.poly([(TX - 8, 8), (TX - 11, 2), (TX - 5, 6)], 'S')                       # острые уши
c.poly([(TX + 8, 8), (TX + 11, 2), (TX + 5, 6)], 'S')
c.spear(TX + 16, 2, 58, 'n', 'N', 'l', 'e', blade_len=12)
c.ellipse(TX + 15, 30, 3.4, 2.9, 'S')
B.append(emit('centaur', c, 'кентавр: конское тело, торс в тунике, острые уши, копьё'))
B.append(upg('centaur_captain', 'капитан кентавров: панцирь, шлем с плюмажем, алый плащ', 'centaur',
             {'G': 'r', 'j': 'R', 'N': 'E', 'S': 'e', 'T': 'E'},
             extra=[(20, 6, 'r'), (21, 5, 'r'), (22, 5, 'r'), (23, 6, 'r')]))

# ---------------- гном 56×68 ----------------
c = Fig(56, 68)
CX = 22
c.rect(CX - 12, 28, CX + 12, 50, 'E'); c.mail(CX - 12, 28, CX + 12, 50, 'e')  # кольчуга
c.rect(CX - 13, 46, CX + 13, 50, 'N'); c.rect(CX - 13, 46, CX + 13, 46, 'n')
c.rect(CX - 5, 45, CX + 4, 51, 'Y'); c.rect(CX - 4, 46, CX + 3, 50, 'y')
c.rect(CX - 17, 30, CX - 12, 44, 'E'); c.mail(CX - 17, 30, CX - 12, 44, 'e')
c.rect(CX + 12, 30, CX + 17, 44, 'E'); c.mail(CX + 12, 30, CX + 17, 44, 'e')
c.ellipse(CX - 15, 45, 3.6, 3, 'S'); c.ellipse(CX + 15, 45, 3.6, 3, 'S')
c.legs_bare(CX, 51, 67, 'N', 'D', boot=('D', 'N'), gap=4)
c.ellipse(CX, 33, 8, 10, 'o'); c.ellipse(CX - 2, 30, 5.5, 7, 'f')            # рыжая борода
c.fur(CX - 7, 27, CX + 7, 41, 'O', step=3, length=12, only='of')
c.face(CX, 18, 7, 'S', 'T', eye='k')
c.rect(CX - 8, 20, CX + 8, 24, 'o')                                          # усы
c.helm(CX, 12, 9, 'e', 'l', 'E', kind='pot', slit=False)
c.rect(CX - 9, 16, CX + 9, 18, 'E')
AX = CX + 15                                                                  # тяжёлый топор в руках
c.rect(AX - 1, 12, AX + 1, 62, 'N'); c.rect(AX - 1, 12, AX - 1, 62, 'n')
c.poly([(AX - 10, 10), (AX, 4), (AX + 2, 20), (AX - 9, 22)], 'e')
c.poly([(AX - 9, 11), (AX - 1, 6), (AX - 1, 19), (AX - 8, 20)], 'l')
c.ellipse(AX - 1, 44, 3.6, 3, 'S')   # кисть на топорище
B.append(emit('dwarf', c, 'гном: кольчуга плетением, рыжая борода прядями, шлем, тяжёлый топор'))
B.append(upg('battle_dwarf', 'боевой гном: синий шлем, стальная броня, двусторонний топор', 'dwarf',
             {'o': 'O', 'f': 'o', 'e': 'b', 'l': 'c'},
             extra=[(42, 12, 'l'), (43, 12, 'l'), (43, 13, 'l'), (42, 13, 'e')]))

# ---------------- лесной эльф 54×74 ----------------
c = Fig(54, 74)
CX = 20
c.poly([(CX - 11, 24), (CX + 11, 24), (CX + 13, 60), (CX - 13, 60)], 'G')     # плащ
c.poly([(CX - 11, 24), (CX - 3, 24), (CX - 6, 60), (CX - 13, 60)], 'j')
c.rect(CX - 8, 28, CX + 8, 48, 'H'); c.folds(CX - 7, 30, CX + 7, 47, 'j', 2)  # туника
c.rect(CX - 9, 44, CX + 9, 47, 'N'); c.rect(CX - 9, 44, CX + 9, 44, 'n')
c.rect(CX - 12, 30, CX - 8, 44, 'H'); c.rect(CX + 8, 30, CX + 12, 44, 'H')
c.ellipse(CX - 10, 45, 3.2, 2.8, 'S'); c.ellipse(CX + 10, 45, 3.2, 2.8, 'S')
c.legs_bare(CX, 50, 73, 'H', 'j', boot=('N', 'n'))
c.rect(CX + 5, 20, CX + 12, 36, 'N'); c.rect(CX + 5, 20, CX + 7, 36, 'n')     # колчан
for i in range(3): c.rect(CX + 7 + i * 2, 15, CX + 8 + i * 2, 21, 'T')
for i in range(3): c.rect(CX + 7 + i * 2, 15, CX + 8 + i * 2, 17, 'l')
c.face(CX, 14, 7, 'S', 'T', hair='N', eye='k')
c.poly([(CX - 7, 12), (CX - 12, 4), (CX - 4, 9)], 'S')                        # острые уши
c.poly([(CX + 7, 12), (CX + 12, 4), (CX + 4, 9)], 'S')
c.bow(CX + 16, 8, 62, 'n', 'N', 'l')
c.ellipse(CX + 14, 44, 3.4, 2.9, 'S')
B.append(emit('wood_elf', c, 'лесной эльф: плащ со складками, острые уши, колчан, длинный лук'))
B.append(upg('grand_elf', 'великий эльф: золотые волосы, синий плащ, смуглая кожа', 'wood_elf',
             {'G': 'B', 'j': 'P', 'N': 'y', 'n': 'f', 'S': 'T', 'T': 'S', 'H': 'l'},
             extra=[(18, 8, 'c'), (19, 8, 'c')]))

# ---------------- пегас 80×78 ----------------
c = Fig(80, 78)
c.wing_feather(38, 30, 40, 30, 'l', 'w', 'L', 'e', n=9, a0=112, a1=26)
c.horse(38, 48, 50, 26, 'l', 'w', 'e', mane='Y', head_left=True, legs=True)
c.ellipse(16, 34, 4, 3.4, 'Y')                                                 # золотая чёлка
B.append(emit('pegasus', c, 'пегас: белая лошадь, золотая грива, крыло веером перьев', flipx=True))
B.append(upg('silver_pegasus', 'серебряный пегас: серые крылья, морская грива, синий ремень', 'pegasus',
             {'Y': 'C', 'w': 'l', 'l': 'e', 'e': 'E'},
             extra=[(40, 46, 'b'), (41, 46, 'b'), (42, 46, 'b'), (43, 46, 'b')]))

# ---------------- дендроид-страж 85×92 ----------------
c = Fig(85, 92)
CX = 42
c.bark(CX - 13, 34, CX + 13, 78, 'n', 'T', 'N')                                # ствол
c.poly([(CX - 13, 78), (CX - 26, 91), (CX - 4, 91)], 'N')                      # корни-ноги
c.poly([(CX + 13, 78), (CX + 26, 91), (CX + 4, 91)], 'N')
c.bark(CX - 24, 84, CX - 6, 91, 'N', 'n', 'D')
c.bark(CX + 6, 84, CX + 24, 91, 'N', 'n', 'D')
for s in (-1, 1):                                                              # ветки-руки
    c.line(CX + s * 12, 44, CX + s * 30, 34, 'N', 5)
    c.line(CX + s * 28, 35, CX + s * 36, 46, 'N', 4)
    for i in range(3): c.line(CX + s * (32 + i * 2), 44, CX + s * (36 + i * 3), 52, 'D', 2)
c.tree_crown(CX, 20, 26, 'G', 'g', 'j')
c.tree_crown(CX - 26, 34, 11, 'G', 'g', 'j')
c.tree_crown(CX + 26, 34, 11, 'G', 'g', 'j')
c.ellipse(CX - 6, 46, 3.6, 3, 'f'); c.ellipse(CX - 6, 46, 1.8, 1.8, 'k')       # глаза-дупла
c.ellipse(CX + 6, 46, 3.6, 3, 'f'); c.ellipse(CX + 6, 46, 1.8, 1.8, 'k')
c.poly([(CX - 8, 56), (CX + 8, 56), (CX + 5, 62), (CX - 5, 62)], 'D')          # рот-разлом
B.append(emit('dendroid_guard', c, 'дендроид-страж: кора бороздами, крона комьями, ветки-руки, корни-ноги'))
B.append(upg('dendroid_soldier', 'дендроид-солдат: тёмная кора с тлеющими трещинами, оливковая крона', 'dendroid_guard',
             {'G': 'j', 'g': 'H', 'n': 'D', 'T': 'N', 'N': 'D', 'f': 'F'}))

# ---------------- единорог 94×89 ----------------
c = Fig(94, 89)
c.horse(46, 56, 58, 30, 'w', 'L', 'l', mane='v', head_left=True, legs=True)
c.poly([(20, 32), (10, 6), (26, 30)], 'y')                                     # рог
c.poly([(21, 31), (13, 12), (24, 30)], 'f')
for i in range(4): c.line(18 - i * 2, 26 - i * 5, 22 - i * 2, 24 - i * 5, 'Y')  # витки рога
c.fur(22, 26, 42, 56, 'v', step=3, length=18)                                  # мятная грива по шее
B.append(emit('unicorn', c, 'единорог: белое тело, мятная грива прядями, витой золотой рог', flipx=True))
B.append(upg('war_unicorn', 'боевой единорог: голубое тело, белая грива, искры у рога', 'unicorn',
             {'w': 'c', 'L': 'w', 'l': 'C', 'v': 'w'},
             extra=[(12, 8, 'f'), (13, 7, 'f'), (11, 6, 'w')]))

# ---------------- зелёный дракон 100×92 ----------------
c = Fig(100, 92)
BX, BY = 52, 56
c.wing_bat(BX + 2, BY - 16, 44, 34, 'G', 'j', 'H', n=4)
c.ellipse(BX, BY, 30, 17, 'G')                                                 # туша
c.ellipse(BX - 4, BY - 7, 25, 10, 'g')
c.ellipse(BX + 2, BY + 8, 26, 8, 'h')                                          # светлое брюхо
c.scales(BX - 28, BY - 14, BX + 26, BY + 6, 'g', 5, only='G')
c.line(BX + 28, BY - 4, BX + 44, BY + 14, 'G', 6)                              # хвост
c.poly([(BX + 42, BY + 10), (BX + 50, BY + 18), (BX + 40, BY + 18)], 'j')
for x0, fr in ((BX - 18, 1), (BX + 12, 0)):                                    # лапы
    c.ellipse(x0, BY + 15, 7, 11, 'G' if fr else 'j')
    c.ellipse(x0 - 1, BY + 12, 5, 6, 'g' if fr else 'G')
    c.paw(x0, BY + 24, 7, 'G' if fr else 'j', 'g', 'i', 3)
for i in range(7):                                                             # гребень
    x = BX - 20 + i * 6
    c.poly([(x, BY - 16), (x + 3, BY - 16 - (5 + i % 3 * 3)), (x + 6, BY - 15)], 'j')
c.ellipse(BX - 30, BY - 14, 11, 10, 'G')                                       # шея
c.dragon_head(BX - 34, BY - 24, 11, 'G', 'g', 'j', eye='f')
B.append(emit('green_dragon', c, 'зелёный дракон: чешуя, перепончатое крыло, раскрытая пасть с клыками, гребень', flipx=True))
B.append(upg('gold_dragon', 'золотой дракон: золотая чешуя, красный глаз, пламя из пасти', 'green_dragon',
             {'G': 'y', 'g': 'f', 'j': 'Y', 'h': 'w', 'f': 'r'},
             extra=[(14, 34, 'F'), (15, 34, 'F'), (13, 35, 'o')]))

write('rampart', 'существа Оплота', B, 'rampart3.py')
