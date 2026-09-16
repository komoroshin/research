# -*- coding: utf-8 -*-
"""js/view/sprites_castle_hd.js — Замок в сетке unit 3.

Семь базовых существ рисуются частями из parts3, семь апгрейдов остаются перекраской.
Размеры взяты из dev/proto/sizes.py: существо обязано занимать столько же места на
экране, сколько занимало в unit 2.
"""
import io, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig

from emit3 import emit, upg

# ============================ копейщик 54×72 ============================
c = Fig(54, 72)
CX = 22
c.rect(CX - 10, 30, CX + 10, 46, 'E'); c.mail(CX - 10, 30, CX + 10, 46, 'e')     # кольчужный доспех
c.rect(CX - 8, 34, CX + 8, 52, 'b'); c.rect(CX - 8, 34, CX - 6, 52, 'B')         # туника
c.rect(CX + 6, 34, CX + 8, 52, 'B'); c.folds(CX - 7, 36, CX + 7, 51, 'B', 2)
c.rect(CX - 4, 38, CX + 3, 40, 'w'); c.rect(CX - 1, 36, CX + 1, 45, 'w')         # герб-крест
c.rect(CX - 11, 47, CX + 11, 50, 'N'); c.rect(CX - 11, 47, CX + 11, 47, 'n')     # пояс
c.rect(CX - 3, 46, CX + 2, 51, 'Y'); c.rect(CX - 2, 47, CX + 1, 50, 'y')         # пряжка
c.rect(CX - 15, 33, CX - 10, 47, 'E'); c.mail(CX - 15, 33, CX - 10, 47, 'e')     # рукава
c.rect(CX + 9, 33, CX + 14, 47, 'E'); c.mail(CX + 9, 33, CX + 14, 47, 'e')
c.ellipse(CX - 13, 48, 3.5, 3, 'S'); c.ellipse(CX + 12, 48, 3.5, 3, 'S')         # кисти
c.legs_bare(CX, 52, 71, 'T', 'N', boot=('D', 'N'))
c.rect(CX - 11, 26, CX + 11, 31, 'E'); c.mail(CX - 11, 26, CX + 11, 31, 'e')     # бармица
c.helm(CX, 13, 9, 'e', 'l', 'E', kind='pot')
c.rect(CX - 6, 20, CX + 5, 24, 'S'); c.rect(CX + 2, 20, CX + 5, 24, 'T')         # подбородок в тени
c.spear(CX + 13, 1, 68, 'n', 'N', 'l', 'e', blade_len=11)
c.ellipse(CX + 12, 48, 3.6, 3, 'S')   # кисть поверх древка
pikeman = c

# ============================ лучник 55×74 ============================
c = Fig(55, 74)
CX = 21
c.rect(CX - 9, 30, CX + 9, 50, 'G'); c.folds(CX - 8, 32, CX + 8, 49, 'j', 3)      # зелёная туника
c.rect(CX - 9, 30, CX - 7, 50, 'j'); c.rect(CX + 7, 30, CX + 9, 50, 'j')
c.rect(CX - 10, 44, CX + 10, 47, 'N'); c.rect(CX - 10, 44, CX + 10, 44, 'n')      # пояс
c.rect(CX - 13, 33, CX - 8, 46, 'H'); c.rect(CX + 8, 33, CX + 13, 46, 'H')        # рукава
c.rect(CX - 13, 33, CX - 12, 46, 'j'); c.rect(CX + 12, 33, CX + 13, 46, 'j')
c.ellipse(CX - 11, 47, 3.2, 2.8, 'S'); c.ellipse(CX + 11, 47, 3.2, 2.8, 'S')
c.legs_bare(CX, 50, 73, 'T', 'N', boot=('D', 'N'))
c.rect(CX + 6, 24, CX + 14, 42, 'N')                                             # колчан за спиной
c.rect(CX + 6, 24, CX + 8, 42, 'n')
for i in range(3): c.rect(CX + 8 + i * 2, 19, CX + 9 + i * 2, 25, 'T')            # оперение стрел
for i in range(3): c.rect(CX + 8 + i * 2, 19, CX + 9 + i * 2, 21, 'l')
c.hood(CX, 14, 8, 'G', 'j', inner='D')
c.face(CX + 1, 18, 6.5, 'S', 'T', eye='k')
c.bow(CX + 14, 16, 58, 'n', 'N', 'l')
c.ellipse(CX + 12, 47, 3.4, 2.9, 'S')   # кисть на рукояти
archer = c

# ============================ мечник 67×77 ============================
c = Fig(67, 77)
CX = 30
c.rect(CX - 13, 44, CX + 12, 55, 'E'); c.mail(CX - 13, 44, CX + 12, 55, 'e')      # кольчужная юбка
for x in range(CX - 13, CX + 13, 5): c.ellipse(x + 2, 55, 2.6, 2.2, 'u')          # фестоны
c.legs_armoured(CX, 55, 76, 'e', 'l', 'E')
c.plate(CX - 14, 26, CX + 13, 46, 'e', 'l', 'E')
c.poly([(CX - 8, 31), (CX + 8, 31), (CX + 7, 52), (CX - 7, 52)], 'R')             # табард
c.rect(CX - 7, 32, CX + 6, 51, 'r'); c.folds(CX - 6, 33, CX + 5, 50, 'R', 2)
c.rect(CX - 2, 34, CX + 1, 49, 'w'); c.rect(CX - 6, 39, CX + 5, 42, 'w')          # крест
c.rect(CX - 14, 47, CX + 13, 50, 'N'); c.rect(CX - 14, 47, CX + 13, 47, 'n')
c.rect(CX - 4, 46, CX + 3, 51, 'Y'); c.rect(CX - 3, 47, CX + 2, 50, 'y')
c.ellipse(CX, 25, 12, 6, 'E'); c.mail(CX - 12, 20, CX + 12, 30, 'e')              # бармица
c.pauldrons(CX, 27, 17, 'e', 'l', 'E')
c.rect(CX - 22, 34, CX - 16, 48, 'e'); c.rect(CX - 22, 34, CX - 20, 48, 'l')
c.rect(CX + 15, 34, CX + 21, 48, 'e'); c.rect(CX + 19, 34, CX + 21, 48, 'E')
for y in range(36, 48, 4):
    c.rect(CX - 22, y, CX - 16, y, 'E'); c.rect(CX + 15, y, CX + 21, y, 'l')
c.helm(CX, 12, 11, 'e', 'l', 'E', kind='great', crest='y')
c.sword(CX + 22, 2, 39, 'l', 'w', 'e', 'y', 'n', 'N')
c.shield_round(CX - 22, 40, 11, 'b', 'B', 'y', 'l', 'w')
swordsman = c

# ============================ монах 50×74 ============================
c = Fig(50, 74)
CX = 21
c.poly([(CX - 11, 30), (CX + 11, 30), (CX + 14, 73), (CX - 14, 73)], 'n')        # ряса
c.poly([(CX - 11, 30), (CX - 2, 30), (CX - 6, 73), (CX - 14, 73)], 'N')          # свет слева
c.folds(CX - 12, 34, CX + 12, 72, 'N', 4)
c.rect(CX - 12, 44, CX + 12, 47, 'D')                                            # верёвочный пояс
for x in range(CX - 11, CX + 12, 4): c.rect(x, 44, x + 1, 47, 'N')               # витки верёвки
c.rect(CX - 2, 47, CX + 0, 56, 'D')                                              # свисающий конец
c.rect(CX - 13, 33, CX - 9, 45, 'n'); c.rect(CX + 9, 33, CX + 13, 45, 'n')
c.rect(CX - 13, 33, CX - 12, 45, 'N'); c.rect(CX + 12, 33, CX + 13, 45, 'N')
c.ellipse(CX - 11, 46, 3.2, 2.8, 'S'); c.ellipse(CX + 11, 46, 3.2, 2.8, 'S')
c.hood(CX, 15, 9, 'n', 'N', inner='D')
c.face(CX + 1, 19, 6, 'S', 'T', eye='k', beard='l')
c.rect(CX + 17, 10, CX + 19, 72, 'N'); c.rect(CX + 17, 10, CX + 17, 72, 'n')     # посох
c.ellipse(CX + 18, 7, 4.2, 4.6, 'c'); c.ellipse(CX + 17, 6, 2.4, 2.6, 'w')       # кристалл
c.ellipse(CX + 18, 11, 3.4, 1.6, 'Y')                                            # оправа
monk = c

# ============================ грифон 92×83 ============================
c = Fig(92, 83)
BX, BY = 46, 52
c.ellipse(BX + 12, BY + 2, 23, 15, 'n')                                          # львиный зад
c.ellipse(BX + 15, BY - 5, 18, 10, 't')
c.ellipse(BX + 9, BY + 10, 20, 9, 'N')
c.fur(BX - 2, BY + 4, BX + 30, BY + 14, 'N', step=5, length=8)
c.line(BX + 32, BY - 3, BX + 42, BY + 6, 'n', 4)                                 # хвост
c.ellipse(BX + 43, BY + 8, 4, 5.5, 'N')
for x0 in (BX + 12, BX + 23):                                                    # задние лапы
    c.ellipse(x0, BY + 14, 6.5, 10, 'n'); c.ellipse(x0 - 1, BY + 11, 4.5, 6, 't')
    c.paw(x0, BY + 23, 6, 'n', 't', 'i', 3)
c.ellipse(BX - 10, BY - 3, 16, 16, 'l')                                          # орлиная грудь
c.ellipse(BX - 13, BY - 7, 12, 12, 'L')
c.scales(BX - 24, BY - 14, BX - 2, BY + 10, 'l', 5, only='Ll')
for x0 in (BX - 22, BX - 10):                                                    # передние лапы
    c.rect(x0 - 4, BY + 8, x0 + 4, BY + 21, 'T'); c.rect(x0 - 4, BY + 8, x0, BY + 21, 't')
    for y in range(BY + 10, BY + 21, 4): c.rect(x0 - 4, y, x0 + 4, y, 'T')
    c.paw(x0, BY + 22, 6, 't', 'T', 'i', 3)
c.ellipse(BX - 18, BY - 16, 10, 11, 'l')                                         # шея
c.ellipse(BX - 24, BY - 27, 11, 10, 'L'); c.ellipse(BX - 26, BY - 30, 8, 7, 'w')
c.ellipse(BX - 21, BY - 18, 12, 4.5, 'e')                                        # воротник
for x in range(BX - 32, BX - 10, 5): c.ellipse(x, BY - 17, 3, 2.2, 'l')
c.poly([(BX - 42, BY - 25), (BX - 33, BY - 29), (BX - 32, BY - 21)], 'y')        # клюв
c.poly([(BX - 42, BY - 25), (BX - 35, BY - 28), (BX - 35, BY - 22)], 'Y')
c.poly([(BX - 40, BY - 23), (BX - 32, BY - 23), (BX - 33, BY - 17)], 'y')
c.rect(BX - 40, BY - 24, BX - 32, BY - 24, 'Y')
c.rect(BX - 35, BY - 28, BX - 34, BY - 27, 'Y')
c.ellipse(BX - 29, BY - 28, 3.6, 3.2, 'y'); c.ellipse(BX - 29, BY - 28, 1.8, 1.8, 'k')
c.rect(BX - 33, BY - 33, BX - 25, BY - 31, 'e')
c.wing_feather(BX - 2, BY - 16, 44, 32, 'e', 'l', 'w', 'E', n=9, a0=118, a1=28)
c.ellipse(BX - 4, BY - 22, 7, 6, 'L'); c.ellipse(BX - 5, BY - 23, 4.5, 4, 'w')
griffin = c

# ============================ кавалерист 97×84 ============================
c = Fig(97, 84)
HX, HY = 44, 52
c.ellipse(HX, HY, 26, 13, 'n')                                                   # корпус коня
c.ellipse(HX - 4, HY - 5, 21, 8, 'T')
c.ellipse(HX + 2, HY + 7, 22, 7, 'N')
c.line(HX + 26, HY - 6, HX + 38, HY + 10, 'N', 5)                                # хвост
for x0, fr in ((HX - 18, 1), (HX - 6, 0), (HX + 12, 0), (HX + 20, 1)):           # ноги
    c.rect(x0 - 3, HY + 10, x0 + 3, HY + 24, 'n' if fr else 'T')
    c.rect(x0 - 3, HY + 10, x0 - 1, HY + 24, 'T' if fr else 'N')
    c.ellipse(x0, HY + 14, 4.5, 5, 'n' if fr else 'T')
    c.rect(x0 - 4, HY + 25, x0 + 4, HY + 29, 'D')
c.ellipse(HX - 27, HY - 12, 9, 11, 'n')                                          # шея
c.ellipse(HX - 34, HY - 21, 9, 7, 'n'); c.ellipse(HX - 39, HY - 18, 6, 4.5, 'T') # голова и морда
c.rect(HX - 42, HY - 19, HX - 40, HY - 18, 'N')
c.poly([(HX - 36, HY - 27), (HX - 34, HY - 32), (HX - 32, HY - 27)], 'n')        # уши
c.poly([(HX - 31, HY - 27), (HX - 29, HY - 32), (HX - 27, HY - 27)], 'n')
c.ellipse(HX - 36, HY - 22, 2.2, 2, 'k')
c.fur(HX - 30, HY - 26, HX - 20, HY - 10, 'N', step=3, length=9)                 # грива
c.poly([(HX - 14, HY - 6), (HX + 8, HY - 6), (HX + 10, HY + 12), (HX - 12, HY + 12)], 'r')   # попона
c.rect(HX - 12, HY - 5, HX + 8, HY + 11, 'r'); c.folds(HX - 11, HY - 4, HX + 7, HY + 11, 'R', 3)
for x in range(HX - 12, HX + 9, 5): c.ellipse(x, HY + 12, 2.2, 2.4, 'y')         # бахрома
RX = HX - 4
c.rect(RX - 8, HY - 26, RX + 8, HY - 8, 'e'); c.rect(RX - 8, HY - 26, RX - 5, HY - 8, 'l')
c.rect(RX + 5, HY - 26, RX + 8, HY - 8, 'E')
c.rivets(RX - 6, HY - 24, RX + 6, 'l', 5); c.rivets(RX - 6, HY - 10, RX + 6, 'l', 5)
c.pauldrons(RX, HY - 26, 11, 'e', 'l', 'E', lames=2)
c.rect(RX - 9, HY - 8, RX + 9, HY - 4, 'E'); c.mail(RX - 9, HY - 8, RX + 9, HY - 4, 'e')
c.helm(RX, HY - 36, 8, 'e', 'l', 'E', kind='great', crest='r')
c.ellipse(RX, HY - 45, 2.6, 4, 'r')                                              # плюмаж
c.spear(RX + 14, HY - 48, HY + 6, 'n', 'N', 'l', 'e', blade_len=12)
cavalier = c

# ============================ ангел 92×94 ============================
c = Fig(92, 94)
CX = 46
c.wing_feather(CX - 11, 38, 42, 34, 'l', 'w', 'L', 'e', n=10, flip=True, a0=112, a1=26)
c.wing_feather(CX + 11, 38, 42, 34, 'l', 'w', 'L', 'e', n=10, a0=112, a1=26)
c.poly([(CX - 13, 46), (CX + 13, 46), (CX + 17, 92), (CX - 17, 92)], 'w')        # длинное одеяние
c.poly([(CX - 13, 46), (CX - 4, 46), (CX - 8, 92), (CX - 17, 92)], 'L')
c.folds(CX - 14, 50, CX + 14, 91, 'l', 4)
c.plate(CX - 14, 26, CX + 13, 48, 'y', 'f', 'Y')                                 # золотые латы
c.pauldrons(CX, 27, 17, 'y', 'f', 'Y')
c.rect(CX - 15, 45, CX + 14, 49, 'Y'); c.rect(CX - 15, 45, CX + 14, 45, 'y')
c.rect(CX - 22, 33, CX - 16, 47, 'y'); c.rect(CX - 22, 33, CX - 20, 47, 'f')
c.rect(CX + 15, 33, CX + 21, 47, 'y'); c.rect(CX + 19, 33, CX + 21, 47, 'Y')
c.ellipse(CX - 19, 49, 3.4, 3, 'S'); c.ellipse(CX + 18, 49, 3.4, 3, 'S')
c.ellipse(CX, 24, 10, 5, 'y')                                                    # ворот
c.face(CX, 14, 9, 's', 'S', hair='y', eye='k')
c.ellipse(CX, 2, 11, 3.2, 'f'); c.ellipse(CX, 2, 8, 1.6, 'w')                    # нимб
c.sword(CX + 24, 4, 44, 'w', 'f', 'l', 'y', 'y', 'Y')
angel = c

# ============================ сборка ============================
out = io.StringIO()
out.write("""/* ============================================================================
   view/sprites_castle_hd.js — существа Замка в сетке unit 3 (втрое крупнее номинала).
   Стиль Б: контурной линии нет, форму держат тона. Семь базовых рисуются частями
   из dev/proto/parts3.py, семь апгрейдов — перекраска базовых.
   Собирается скриптом dev/proto/castle3.py.
   ========================================================================== */
(function () {
  'use strict';
  H3.Sprites.defineMany({
""")
out.write(emit('pikeman', pikeman, 'копейщик: шлем-котелок, кольчуга плетением, туника с крестом, копьё'))
out.write(upg('halberdier', 'алебардщик: красная туника, лезвие алебарды', 'pikeman',
              {'b': 'r', 'B': 'R'}, extra=[(44, 12, 'l'), (45, 12, 'l'), (45, 13, 'l'), (44, 13, 'e')]))
out.write(emit('archer', archer, 'лучник: капюшон, колчан с оперением стрел, лук с тетивой'))
out.write(upg('marksman', 'стрелок: тёмный капюшон, вторая стрела', 'archer',
              {'G': 'R', 'j': 'u', 'H': 'E', 'h': 'l'}, extra=[(35, 18, 'l'), (35, 19, 'l'), (36, 19, 'l')]))
out.write(emit('griffin', griffin, 'грифон: крыло рядами перьев, клюв с ноздрёй, когти по отдельности', flipx=True))
out.write(upg('royal_griffin', 'королевский грифон: золотое перо, алый гребень', 'griffin',
              {'n': 'y', 'N': 'Y', 'T': 'o', 't': 'f'}, extra=[(21, 20, 'r'), (22, 19, 'r'), (23, 19, 'r'), (24, 20, 'r')]))
out.write(emit('swordsman', swordsman, 'мечник: забрало с прорезью, заклёпки, кольчуга, дол на клинке'))
out.write(upg('crusader', 'крестоносец: золочёные латы, белый табард', 'swordsman',
              {'e': 'y', 'E': 'Y', 'l': 'w', 'r': 'w', 'R': 'l'}, extra=[(28, 40, 'r'), (29, 40, 'r'), (30, 40, 'r'), (31, 40, 'r')]))
out.write(emit('monk', monk, 'монах: ряса со складками, верёвочный пояс витками, посох с кристаллом'))
out.write(upg('zealot', 'фанатик: белая ряса, золотой пояс, кристалл ярче', 'monk',
              {'n': 'i', 'N': 'I', 'D': 'T', 'c': 'A'}, extra=[(38, 6, 'w'), (39, 6, 'w')]))
out.write(emit('cavalier', cavalier, 'кавалерист: конь с гривой, попона с бахромой, всадник в латах, копьё', flipx=True))
out.write(upg('champion', 'чемпион: белый конь, серебряные латы, синяя попона', 'cavalier',
              {'n': 'l', 'N': 'e', 'T': 'L', 'D': 'E', 'r': 'b', 'R': 'B'}))
out.write(emit('angel', angel, 'ангел: нимб, два крыла рядами перьев, золотые латы, светящийся меч'))
out.write(upg('archangel', 'архангел: белое золото, лазурные перья, голубой клинок', 'angel',
              {'y': 'w', 'Y': 'y', 'f': 'w', 'L': 'c', 'l': 'c', 'e': 'l'}))
out.write("  });\n})();\n")
path = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_castle_hd.js')
io.open(path, 'w', encoding='utf-8').write(out.getvalue())
print('записан sprites_castle_hd.js')
