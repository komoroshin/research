# -*- coding: utf-8 -*-
"""js/view/sprites_fortress_hd.js — Крепость в сетке unit 3."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

# ---------------- гнолл 55×74 ----------------
c = Fig(55, 74)
CX = 24
c.rect(CX - 12, 30, CX + 12, 52, 'T'); c.ellipse(CX, 38, 9, 9, 't')
c.poly([(CX - 11, 30), (CX + 11, 30), (CX + 9, 48), (CX - 9, 48)], 'N')          # кожаный жилет
c.rect(CX - 9, 32, CX + 8, 46, 'n'); c.planks(CX - 9, 33, CX + 8, 46, 'N', 5)
c.rect(CX - 13, 50, CX + 13, 54, 'N')
c.rect(CX - 18, 32, CX - 12, 48, 'T'); c.rect(CX + 12, 32, CX + 18, 48, 'T')
c.fur(CX - 18, 32, CX - 12, 48, 'N', step=3, length=6)
c.ellipse(CX - 16, 49, 3.4, 3, 'T'); c.ellipse(CX + 16, 49, 3.4, 3, 'T')
c.legs_bare(CX, 54, 73, 'T', 'N', gap=5)
c.ellipse(CX + 1, 18, 10, 9, 'N'); c.ellipse(CX - 3, 15, 6, 6, 'd')              # гиеноголовая
c.ellipse(CX + 9, 22, 9, 6, 't')                                                  # светлая морда
c.rect(CX + 13, 20, CX + 15, 22, 'D')
c.rect(CX + 3, 24, CX + 15, 26, 'D')
for x in range(CX + 4, CX + 15, 3): c.rect(x, 24, x + 1, 26, 'i')
c.poly([(CX - 7, 12), (CX - 11, 1), (CX - 2, 9)], 'N')                           # тёмные уши
c.poly([(CX + 3, 11), (CX + 6, 1), (CX + 9, 10)], 'N')
c.fur(CX - 9, 8, CX + 4, 26, 'D', step=3, length=12)                              # грива
c.ellipse(CX + 3, 17, 2.6, 2.2, 'y'); c.ellipse(CX + 3, 17, 1.3, 1.3, 'k')
AX = CX + 21                                                                      # алебарда
c.rect(AX - 1, 14, AX + 1, 70, 'N'); c.rect(AX - 1, 14, AX - 1, 70, 'n')
c.poly([(AX - 8, 12), (AX, 2), (AX + 2, 18), (AX - 7, 20)], 'e')
c.poly([(AX - 7, 13), (AX - 1, 5), (AX - 1, 17), (AX - 6, 18)], 'l')
B.append(emit('gnoll', c, 'гнолл: гиеноголовый, грива прядями, светлая морда с клыками, кожаный жилет, алебарда'))
B.append(upg('gnoll_marauder', 'гнолл-мародёр: тёмная шкура, шипы на жилете', 'gnoll',
             {'T': 'd', 't': 'T', 'N': 'D', 'n': 'N'}, extra=[(18, 33, 'i'), (24, 33, 'i'), (30, 33, 'i')]))

# ---------------- ящер 55×74 ----------------
c = Fig(55, 74)
CX = 24
c.ellipse(CX, 40, 12, 14, 'G'); c.ellipse(CX, 44, 8, 9, 'h')                     # светлое брюхо
c.scales(CX - 12, 28, CX + 12, 50, 'g', 4, only='G')
for i in range(6):                                                                # тёмный гребень
    c.poly([(CX + 8 + i, 32 - i * 2), (CX + 11 + i, 26 - i * 3), (CX + 13 + i, 32 - i * 2)], 'j')
c.line(CX + 12, 46, CX + 24, 60, 'G', 4)                                          # хвост
c.poly([(CX + 22, 58), (CX + 30, 66), (CX + 21, 64)], 'j')
c.rect(CX - 13, 48, CX + 13, 52, 'N')                                             # повязка
c.rect(CX - 17, 32, CX - 12, 46, 'G'); c.rect(CX + 12, 32, CX + 17, 46, 'G')
c.ellipse(CX - 15, 47, 3.4, 3, 'g'); c.ellipse(CX + 15, 47, 3.4, 3, 'g')
c.legs_bare(CX, 54, 72, 'G', 'j', gap=5)
for s in (-1, 1): c.claws(CX + s * 9 - 5, 72, 3, 'i', 4, 3)
c.ellipse(CX - 1, 18, 10, 9, 'G'); c.ellipse(CX - 4, 15, 6, 6, 'g')
c.ellipse(CX - 8, 22, 7, 4.5, 'h')                                                # светлая челюсть
c.rect(CX - 15, 21, CX - 13, 23, 'j')
c.rect(CX - 14, 24, CX - 2, 26, 'j')
for x in range(CX - 13, CX - 2, 3): c.rect(x, 22, x + 1, 24, 'i')
c.ellipse(CX - 2, 17, 2.6, 2.2, 'y'); c.ellipse(CX - 2, 17, 1.3, 1.3, 'k')
c.bow(CX + 20, 12, 60, 'n', 'N', 'l')
B.append(emit('lizardman', c, 'ящер: чешуя, тёмный гребень, светлая челюсть с клыками, хвост, лук', flipx=True))
B.append(upg('lizard_warrior', 'воин-ящер: бирюзовая чешуя, стальной наплечник', 'lizardman',
             {'G': 'q', 'g': 'v', 'h': 'w', 'j': 'Q'}, extra=[(10, 32, 'e'), (12, 32, 'l'), (14, 33, 'e')]))

# ---------------- змеемуха 67×68 ----------------
c = Fig(67, 68)
BX, BY = 30, 40
for i, (w, y) in enumerate(((9, 44), (10, 52), (8, 60))):                         # змеиное тело кольцами
    ox = (i % 2 * 2 - 1) * 4
    c.ellipse(BX + ox, y, w * 1.6, w * 0.6, 'j')
    c.ellipse(BX + ox, y - 1.5, w * 1.4, w * 0.4, 'G')
c.ellipse(BX, BY - 6, 11, 13, 'G'); c.ellipse(BX - 2, BY - 10, 7, 8, 'j')        # тёмная спина
c.scales(BX - 10, BY - 16, BX + 10, BY + 4, 'g', 4, only='G')
for s, dy in ((-1, -12), (1, -12), (-1, -2), (1, -2)):                            # четыре крыла
    c.poly([(BX + s * 4, BY + dy), (BX + s * 26, BY + dy - 12), (BX + s * 30, BY + dy - 2), (BX + s * 8, BY + dy + 5)], 'c')
    c.poly([(BX + s * 5, BY + dy + 1), (BX + s * 22, BY + dy - 8), (BX + s * 25, BY + dy - 2), (BX + s * 8, BY + dy + 3)], 'w')
    for i in range(3):                                                            # прожилки
        c.line(BX + s * 6, BY + dy + 1, BX + s * (14 + i * 6), BY + dy - 9 + i * 4, 'C')
c.ellipse(BX, BY - 20, 9, 8, 'G'); c.ellipse(BX - 2, BY - 23, 6, 5, 'g')
c.ellipse(BX - 5, BY - 21, 4, 3.6, 'r'); c.ellipse(BX + 5, BY - 21, 4, 3.6, 'r')  # большие глаза
c.ellipse(BX - 5, BY - 22, 2, 1.8, 'k'); c.ellipse(BX + 5, BY - 22, 2, 1.8, 'k')
c.rect(BX - 4, BY - 15, BX + 3, BY - 14, 'j')
B.append(emit('serpent_fly', c, 'змеемуха: змеиное тело кольцами, четыре крыла с прожилками, большие глаза'))
B.append(upg('dragon_fly', 'драконья муха: бирюзовое тело, золотые крылья', 'serpent_fly',
             {'G': 'q', 'g': 'v', 'j': 'Q', 'c': 'y', 'w': 'f', 'C': 'Y'}))

# ---------------- василиск 80×62 ----------------
c = Fig(80, 62)
BX, BY = 38, 34
c.ellipse(BX, BY, 26, 11, 'H'); c.ellipse(BX - 4, BY - 4, 21, 7, 'h')
c.ellipse(BX + 2, BY + 5, 22, 5, 'j')
c.scales(BX - 24, BY - 10, BX + 22, BY + 6, 'h', 4, only='H')
for i in range(7):                                                                # ржавый гребень
    x = BX - 18 + i * 6
    c.poly([(x, BY - 10), (x + 3, BY - 10 - (4 + i % 3 * 3)), (x + 6, BY - 9)], 'O')
    c.poly([(x + 1, BY - 10), (x + 3, BY - 9 - (4 + i % 3 * 3)), (x + 3, BY - 10)], 'o')
c.line(BX + 24, BY + 2, BX + 38, BY + 12, 'H', 4)
for i, x0 in enumerate((BX - 20, BX - 8, BX + 4, BX + 14, BX - 14, BX + 10)):     # шесть лап
    fr = i < 3
    c.rect(x0 - 2, BY + 8, x0 + 2, BY + 18, 'H' if fr else 'j')
    c.paw(x0, BY + 17, 4, 'H' if fr else 'j', 'h', 'i', 3)
c.ellipse(BX - 28, BY - 4, 10, 8, 'H'); c.ellipse(BX - 32, BY - 1, 7, 5, 'h')
c.rect(BX - 39, BY, BX - 30, BY + 3, 'j')
for x in range(int(BX - 38), int(BX - 30), 3): c.rect(x, BY, x + 1, BY + 2, 'i')
c.ellipse(BX - 30, BY - 7, 3.2, 2.8, 'r'); c.ellipse(BX - 30, BY - 7, 1.6, 1.6, 'k')
B.append(emit('basilisk', c, 'василиск: шесть лап, ржавый гребень, чешуя, красный глаз', flipx=True))
B.append(upg('greater_basilisk', 'великий василиск: тёмно-оливковая чешуя, золотой гребень', 'basilisk',
             {'H': 'j', 'h': 'H', 'O': 'y', 'o': 'f'}))

# ---------------- горгона 91×66 ----------------
c = Fig(91, 66)
BX, BY = 44, 36
c.ellipse(BX, BY, 28, 14, 'O'); c.ellipse(BX + 12, BY - 9, 13, 8, 'O')           # горб
c.ellipse(BX - 6, BY - 5, 22, 8, 'o')
c.ellipse(BX + 2, BY + 7, 24, 6, 'N')
c.scales(BX - 26, BY - 12, BX + 24, BY + 8, 'o', 5, only='O')
c.line(BX + 26, BY - 2, BX + 38, BY + 8, 'N', 4)
for x0, fr in ((BX - 18, 1), (BX - 6, 0), (BX + 10, 0), (BX + 18, 1)):
    c.rect(x0 - 3, BY + 10, x0 + 3, BY + 22, 'u' if fr else 'z')                  # тёмные ноги
    c.rect(x0 - 4, BY + 22, x0 + 4, BY + 26, 'E')                                 # копыта
c.ellipse(BX - 28, BY - 6, 11, 10, 'O'); c.ellipse(BX - 32, BY - 2, 8, 6, 'o')
c.rect(BX - 39, BY - 3, BX - 37, BY - 1, 'N')
c.ellipse(BX - 30, BY - 10, 3, 2.6, 'f'); c.ellipse(BX - 30, BY - 10, 1.5, 1.5, 'k')
c.horns(BX - 28, BY - 14, 14, 'I', 'i', spread=7, curve=5)                        # костяные рога
B.append(emit('gorgon', c, 'горгона: бронзовая чешуя, горб, костяные рога, тёмные ноги с копытами', flipx=True))
B.append(upg('mighty_gorgon', 'могучая горгона: тёмная бронза, золотые рога', 'gorgon',
             {'O': 'N', 'o': 'O', 'I': 'y', 'i': 'f'}))

# ---------------- виверна 92×89 ----------------
c = Fig(92, 89)
BX, BY = 46, 52
c.wing_bat(BX + 4, BY - 16, 40, 30, 'q', 'Q', 'v', n=4, a0=108, a1=18)
c.ellipse(BX, BY, 22, 15, 'q'); c.ellipse(BX - 4, BY - 6, 17, 9, 'v')
c.ellipse(BX + 2, BY + 7, 18, 7, 'Q')
c.scales(BX - 20, BY - 12, BX + 18, BY + 6, 'v', 5, only='q')
for x0 in (BX - 10, BX + 8):                                                      # две лапы
    c.ellipse(x0, BY + 14, 6, 10, 'q'); c.paw(x0, BY + 23, 6, 'q', 'v', 'i', 3)
for i in range(6):                                                                # хвост с жалом
    c.ellipse(BX + 22 + i * 5, BY + 2 + i * 4, 5 - i * 0.4, 4 - i * 0.3, 'q')
c.poly([(BX + 50, BY + 24), (BX + 60, BY + 32), (BX + 50, BY + 30)], 'i')
c.ellipse(BX - 24, BY - 12, 10, 9, 'q')
c.dragon_head(BX - 30, BY - 20, 10, 'q', 'v', 'Q', eye='y')
B.append(emit('wyvern', c, 'виверна: две лапы, перепончатые крылья, хвост с жалом, раскрытая пасть', flipx=True))
B.append(upg('wyvern_monarch', 'виверна-владыка: изумрудная чешуя, золотое жало', 'wyvern',
             {'q': 'G', 'v': 'g', 'Q': 'j', 'i': 'y'}))

# ---------------- гидра 100×92 ----------------
c = Fig(100, 92)
BX, BY = 50, 62
c.ellipse(BX, BY, 28, 16, 'N'); c.ellipse(BX - 4, BY - 6, 22, 9, 'n')
c.ellipse(BX + 2, BY + 8, 23, 7, 'T')                                             # светлое брюхо
c.scales(BX - 26, BY - 14, BX + 24, BY + 4, 'n', 5, only='N')
for x0, fr in ((BX - 18, 1), (BX - 6, 0), (BX + 10, 0), (BX + 18, 1)):
    c.ellipse(x0, BY + 14, 6, 9, 'D' if not fr else 'N')
    c.paw(x0, BY + 22, 6, 'D' if not fr else 'N', 'n', 'i', 3)
for i, (ax, ay) in enumerate(((-34, -40), (-20, -48), (-4, -50), (10, -46), (24, -38))):
    hx, hy = BX + ax, BY + ay
    c.line(BX + ax * 0.2, BY - 10, hx, hy, 'N', 7)                               # шея до самой головы
    c.line(BX + ax * 0.2, BY - 10, hx, hy, 'n', 3)
    c.ellipse(hx, hy, 8, 7, 'N'); c.ellipse(hx - 2, hy - 2, 5, 4.5, 'n')
    c.poly([(hx - 2, hy - 2), (hx - 12, hy + 1), (hx - 2, hy + 4)], 'N')          # морда
    c.rect(hx - 11, hy + 2, hx - 2, hy + 4, 'R')
    for x in range(int(hx - 10), int(hx - 2), 3): c.rect(x, hy + 1, x + 1, hy + 3, 'i')
    c.ellipse(hx - 3, hy - 3, 2.4, 2, 'y'); c.ellipse(hx - 3, hy - 3, 1.2, 1.2, 'k')
B.append(emit('hydra', c, 'гидра: пять голов на шеях веером, чешуя, светлое брюхо, тёмные лапы', flipx=True))
B.append(upg('chaos_hydra', 'хаос-гидра: багровая чешуя, чёрные лапы, жёлтые глаза', 'hydra',
             {'N': 'R', 'n': 'r', 'T': 'o', 'D': 'z'}))

write('fortress', 'существа Крепости', B, 'fortress3.py')
