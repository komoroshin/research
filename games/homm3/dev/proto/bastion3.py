# -*- coding: utf-8 -*-
"""js/view/sprites_bastion_hd.js — Бастион в сетке unit 3.

Звери на общем конском теле (horse) с мехом, лапами и своей головой; два стрелка —
люди в зелёном с луками. Все смотрят вправо: horse рисуется head_left=True и
зеркалится через flipx, люди рисуются сразу вправо.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, upg, write

B = []

def beast_head(c, hx, hy, r, mid, light, dark, ears=True, snout=0.55, tusks=False):
    """Звериная голова влево: черепная коробка, морда, нос, глаз, уши."""
    c.ellipse(hx, hy, r, r * 0.85, mid); c.ellipse(hx - r * 0.2, hy - r * 0.25, r * 0.6, r * 0.45, light)
    c.ellipse(hx - r * snout * 1.4, hy + r * 0.25, r * 0.55, r * 0.4, light)          # морда
    c.ellipse(hx - r * snout * 2.0, hy + r * 0.2, r * 0.2, r * 0.18, 'k')               # нос
    c.ellipse(hx - r * 0.35, hy - r * 0.1, r * 0.17, r * 0.15, 'y'); c.ellipse(hx - r * 0.35, hy - r * 0.1, r * 0.08, r * 0.08, 'k')
    if ears:
        for o in (-0.15, 0.35):
            c.poly([(hx + r * o, hy - r * 0.6), (hx + r * (o + 0.15), hy - r * 1.25), (hx + r * (o + 0.4), hy - r * 0.55)], dark)
    if tusks:
        for o in (-0.1, 0.25):
            c.poly([(hx - r * 1.05 + r * o, hy + r * 0.55), (hx - r * 1.25 + r * o, hy + r * 0.05), (hx - r * 0.9 + r * o, hy + r * 0.5)], 'i')

# ---------------- лесной кот 62×48 ----------------
c = Fig(62, 48)
c.horse(34, 30, 40, 16, 'T', 't', 'N', head_left=True)
c.fur(16, 22, 52, 38, 'N', step=4, length=6)
beast_head(c, 12, 22, 8, 'T', 't', 'N')
c.line(56, 22, 61, 8, 'N', 3)                                                          # хвост трубой
B.append(emit('forest_cat', c, 'лесной кот: гибкое тело, полосатый мех, хвост трубой', flipx=True))
B.append(upg('lynx', 'рысь: серебристый мех, кисточки на ушах', 'forest_cat', {'T': 'l', 't': 'L', 'N': 'e'}))

# ---------------- следопыт 54×72 ----------------
c = Fig(54, 72)
CX = 22
c.rect(CX - 10, 26, CX + 10, 50, 'H'); c.rect(CX - 10, 26, CX - 6, 50, 'j'); c.folds(CX - 8, 28, CX + 8, 48, 'j', 3)   # зелёная куртка
c.rect(CX - 11, 48, CX + 11, 52, 'N')                                                                                # ремень
c.legs_bare(CX, 52, 71, 'n', 'N', boot='DN', gap=4)
c.rect(CX - 15, 28, CX - 10, 44, 'H'); c.rect(CX + 10, 28, CX + 15, 44, 'H')                                          # рукава
c.hood(CX, 17, 9, 'j', 'G', inner='u')
c.face(CX, 18, 5, 's', 'S')
c.bow(CX + 24, 8, 66, 'n', 'N', string='l')
B.append(emit('tracker', c, 'следопыт: зелёная куртка с капюшоном, ремень, длинный лук'))
B.append(upg('forester', 'лесник: бурая куртка, серый капюшон', 'tracker', {'H': 'n', 'j': 'N', 'G': 'e'}))

# ---------------- вепрь 78×58 ----------------
c = Fig(78, 58)
c.horse(42, 34, 52, 22, 'N', 'n', 'D', head_left=True)
c.fur(16, 22, 66, 46, 'D', step=3, length=8)
for x in range(20, 62, 5): c.rect(x, 20, x + 1, 26, 'D')                                # щетина гребнем
beast_head(c, 14, 30, 11, 'N', 'n', 'D', snout=0.7, tusks=True)
B.append(emit('boar', c, 'вепрь: тяжёлое тело, щетина гребнем, клыки', flipx=True))
B.append(upg('tusker', 'клыкач: чёрная щетина, ржавые клыки', 'boar', {'N': 'u', 'n': 'E', 'D': 'k', 'i': 'y'}))

# ---------------- росомаха 82×60 ----------------
c = Fig(82, 60)
c.horse(44, 36, 54, 20, 'D', 'n', 'k', head_left=True)
c.rect(20, 30, 68, 34, 'T')                                                              # светлая полоса по боку
c.fur(16, 26, 70, 50, 'k', step=3, length=9)
beast_head(c, 14, 30, 10, 'D', 'n', 'k', snout=0.6)
for i in range(2): c.claws(22 + i * 30, 56, 3, 'i', step=3, length=4)
B.append(emit('wolverine', c, 'росомаха: тёмный мех со светлой полосой, когти', flipx=True))
B.append(upg('dire_wolverine', 'матёрая росомаха: седой мех, красные глаза', 'wolverine', {'D': 'E', 'n': 'l', 'T': 'w', 'y': 'r'}))

# ---------------- ловчий 60×80 ----------------
c = Fig(60, 80)
CX = 24
c.rect(CX - 11, 28, CX + 11, 54, 'j'); c.rect(CX - 11, 28, CX - 7, 54, 'G'); c.folds(CX - 9, 30, CX + 9, 52, 'G', 3)
c.mail(CX - 8, 30, CX + 8, 42, 'e')                                                      # кольчужный ворот
c.rect(CX - 12, 52, CX + 12, 56, 'N'); c.rect(CX - 3, 52, CX + 3, 56, 'y')               # ремень с пряжкой
c.legs_bare(CX, 56, 79, 'n', 'N', boot='DN', gap=4)
c.rect(CX - 16, 30, CX - 11, 48, 'j'); c.rect(CX + 11, 30, CX + 16, 48, 'j')
c.hood(CX, 18, 10, 'G', 'D', inner='u')
c.face(CX, 19, 5.5, 's', 'S', beard='n')
c.poly([(CX - 14, 12), (CX + 2, 6), (CX + 14, 12)], 'N')                                 # перо на капюшоне
c.rect(CX + 4, 4, CX + 6, 12, 'w')
c.bow(CX + 26, 6, 74, 'N', 'D', string='l')
B.append(emit('ranger', c, 'ловчий: тёмно-зелёный плащ, кольчужный ворот, борода, длинный лук'))
B.append(upg('master_ranger', 'мастер-ловчий: серый плащ, золотая пряжка, белое перо', 'ranger', {'j': 'e', 'G': 'E', 'D': 'u'}))

# ---------------- медведь 92×80 ----------------
c = Fig(92, 80)
c.horse(48, 46, 58, 30, 'N', 'n', 'D', head_left=True)
c.ellipse(48, 34, 30, 12, 'N')                                                           # горб
c.fur(18, 22, 78, 66, 'D', step=3, length=10)
beast_head(c, 16, 34, 13, 'N', 'n', 'D', snout=0.5)
for i in range(2): c.claws(22 + i * 38, 76, 4, 'i', step=3, length=5)
B.append(emit('bear', c, 'медведь: горбатая спина, густой мех, когти', flipx=True))
B.append(upg('cave_bear', 'пещерный медведь: серый мех, шрамы', 'bear', {'N': 'e', 'n': 'l', 'D': 'E'}))

# ---------------- великий олень 104×96 ----------------
c = Fig(104, 96)
c.horse(52, 62, 62, 28, 'T', 't', 'N', head_left=True)
c.fur(24, 46, 82, 76, 'N', step=4, length=8)
for s in (-1, 1):                                                                         # ветвистые рога
    bx = 22 + (6 if s > 0 else 0)
    c.line(bx, 26, bx - 6 * s, 6, 'i', 3)
    for k, (dy, dx) in enumerate(((22, 10), (16, 13), (10, 9))):
        c.line(bx - 6 * s * (1 - dy / 22.0), 6 + dy, bx - 6 * s * (1 - dy / 22.0) + dx * s, 6 + dy - 8, 'i', 2)
c.ellipse(24, 34, 9, 7, 'T'); c.ellipse(20, 36, 5, 4, 't'); c.ellipse(16, 37, 2, 1.8, 'k')
c.ellipse(25, 32, 2, 2, 'k')
B.append(emit('great_stag', c, 'великий олень: высокое тело, ветвистые рога', flipx=True))
B.append(upg('forest_king', 'король леса: белая шерсть, золотые рога, зелёные искры', 'great_stag',
             {'T': 'L', 't': 'w', 'N': 'l', 'i': 'y'}, extra=[(30, 6, 'h'), (14, 4, 'h'), (22, 2, 'h')]))

write('bastion', 'существа Бастиона', B, 'bastion3.py')
