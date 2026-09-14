# -*- coding: utf-8 -*-
"""Сборка js/view/sprites_rampart_hd.js: 14 существ Оплота в крупной сетке (unit 2), стиль Б.
Гном, лесной эльф, дендроид — строками; кентавр, пегас, единорог, зелёный дракон — композитором."""
import io, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from compose import Canvas
from castle_hd import rows_from, pad, block, stretch   # общие помощники (castle_hd при импорте пересобирает свой файл — это безвредно)


def strip_k(c):
    """стиль Б: композитор рисует внешний контур 'k' — снимаем его, зрачки возвращаем точечно"""
    c.outline(between=set())
    return [r.replace('k', '.') for r in c.rows()]


def setpx(rows, pts):
    rows = [list(r) for r in rows]
    for x, y, ch in pts: rows[y][x] = ch
    return [''.join(r) for r in rows]


def px_of(c):
    """все непрозрачные пиксели холста — список extra для апгрейда"""
    return [(x, y, ch) for y, row in enumerate(c.rows()) for x, ch in enumerate(row) if ch != '.']


def thick(rows, x0, y0, x1, y1, ch, th):
    """толстая линия прямо по списку строк (для веток и корней дендроида)"""
    n = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
    for i in range(n + 1):
        t = i / n; x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        for dy in range(-(th // 2), th - th // 2):
            for dx in range(-(th // 2), th - th // 2):
                xx, yy = int(x + dx), int(y + dy)
                if 0 <= yy < len(rows) and 0 <= xx < len(rows[0]): rows[yy][xx] = ch


# ---------- кентавр (композитор) 44×48: гнедое конское тело, человеческий торс в зелёной тунике, копьё ----------
c = Canvas(44, 48)
c.ellipse(18, 35, 13, 7, 'N')                      # корпус коня (тёмно-гнедой)
c.ellipse(9, 34, 6, 5, 'n', rot=0.2)               # свет на крупе
c.ellipse(30, 32, 6, 6, 'N')                       # грудь коня
c.line(6, 33, 1, 46, 'D', th=3)                    # хвост
for x0, mat in ((7, 'N'), (14, 'n'), (24, 'N'), (31, 'n')):   # ноги
    c.poly([(x0, 39), (x0 - 1, 46), (x0 + 3, 46), (x0 + 4, 39)], mat)
    c.poly([(x0 - 2, 45), (x0 + 4, 45), (x0 + 4, 48), (x0 - 2, 48)], 'D')
c.ellipse(31, 21, 5.5, 8, 'g')                     # торс в зелёной тунике растёт из груди коня
c.poly([(25, 27), (37, 27), (37, 29), (25, 29)], 'y')   # золотой пояс
c.ellipse(31, 8, 5, 5, 's')                        # голова
c.ellipse(31, 5, 5, 2.5, 'N')                      # волосы
c.poly([(29, 12), (33, 12), (33, 15), (29, 15)], 's')   # шея
c.line(36, 18, 39, 14, 's', th=2)                  # правая рука к копью
c.line(26, 18, 22, 25, 's', th=2)                  # левая рука
c.line(40, 38, 41, 3, 'N', th=3)                   # древко копья
c.poly([(37, 6), (40, 0), (44, 6)], 'l')           # наконечник
c.ellipse(39.5, 15, 2.5, 2.2, 's')                 # кисть на древке
c.put(33, 8, 'k'); c.put(34, 8, 'w')               # глаз
centaur = strip_k(c)
centaur = setpx(centaur, [(33, 8, 'k')])
# приметы капитана: стальной шлем на месте волос и красный плюмаж, алый плащ за спиной
h = Canvas(44, 48)
h.poly([(21, 16), (26, 15), (25, 28), (19, 30)], 'r')   # плащ
h.ellipse(31, 5, 5, 2.5, 'e')                      # шлем
h.poly([(29, 3), (33, 3), (34, 0), (30, 0), (28, 0)], 'r')   # плюмаж
captain_extra = px_of(h)

# ---------- гном 37×44: коренастый, рыжая борода до пояса, кольчуга, тяжёлый топор ----------
dwarf = rows_from("""
...........nnnnnnnnnn
.........nnnnnnnnnnnnnn
........nnnnnnnnnnnnnnnn
........nnNNNNNNNNNNNNnn
........nnssssssssssssnn
........nnssssssssssssnn
........nnssSwwsswwSssnn
........nnssSwksskwSssnn
........nnsssssSSsssssnn
........nnssOOOOOOOOssnn
..........OOOOooooOOOO
...eeeeeOOOOOOooooOOOOOOeeeee
..EeeeeEeOOOOOooooOOOOOeEeeeeE
..EeeeeEeOOOOOooooOOOOOeEeeeeE
..EeeeeEeOOOOOoooOOOOOeeEeeeeE
..EeeeeEeeOOOOoooOOOOeeeEeeeeE
..EeeeeEeeeOOOoooOOOeeeeEeeeeE
..EeeeeEeeeeOOoooOOeeeeeEeeeeE
..EeeeeEeeeeeOOoOOeeeeeeEeeeeE
..EeeeeEeeeeeeeeeeeeeeeeEeeeeE
..EeeeeEeeeeeeeeeeeeeeeeEeeeeE
..EssssEeeeeeeeeeeeeeeeeEeeeeE
..EssssEeeeeeeeeeeeeeeeeEeeeeE
...eeeeeeeeeeeeeeeeeeeeeeeee
.......NNNNNNNNNNNNNNNNN
.......dddddddd.ddddddd
.......dddddddd.ddddddd
.......dddddddd.ddddddd
.......dddddddd.ddddddd
.......dddddddd.ddddddd
.......dddddddd.ddddddd
.......dddddddd.ddddddd
......DDDDDDDDD.DDDDDDDD
......DDDDDDDDD.DDDDDDDD
""")
dwarf = [list(r + '.' * 40)[:37] for r in dwarf]
for y in range(17, 21):                                     # правая рука к топорищу
    for x in range(25, 29): dwarf[y][x] = 'e'
    for x in range(29, 31): dwarf[y][x] = 's'
for y in range(2, 28): dwarf[y][31] = 'd'; dwarf[y][32] = 'd'   # топорище
for y, hw in ((3, 2), (4, 3), (5, 4), (6, 4), (7, 4), (8, 4), (9, 3), (10, 2)):   # лезвие справа
    for x in range(33, 33 + hw): dwarf[y][x] = 'l' if x < 33 + hw - 1 else 'e'
dwarf = [''.join(r) for r in dwarf]
battle_extra = [(x, y, 'b' if y < 3 else 'B') for y in range(0, 4) for x in range(37) if dwarf[y][x] in 'nN']   # синий шлем
battle_extra += [(x, y, 'l') for y, hw in ((3, 2), (4, 3), (5, 4), (6, 4), (7, 4), (8, 4), (9, 3), (10, 2)) for x in range(31 - hw, 31)]   # второе лезвие
dwarf = stretch(dwarf, 44, [(11, 23), (25, 32)])

# ---------- лесной эльф 40×48: стройный, каштановые волосы, острые уши, зелёная туника, плащ, длинный лук ----------
wood_elf = rows_from("""
..............nnnnnnnn
............nnnnnnnnnnnn
............nnnnnnnnnnnn
............nnssssssssnn
............nnssssssssnn
............nnsSwwswwSnn
.........sssnnsSwkskwSnnsss
..........ssnnssssssssnnss
............nnsssSSsssnn
............nnssssssssnn
............nnnssssssnnn
.............nnnssssnnn
...............GssssG
...........ggggGGssGGgggg
..........gggggggGGgggggggg
.........Gggggggggggggggggg
........GGggggggggggggggggg
........GGGggggggggggggggggg
........GGGggggggggggggggggg
........GGGggggggggggggggggg
........GGGggggggggggggggggg
........GGGgggggggggggggggg
........GGGgggggggggggggggg
........GGGgNNNNNNNNNNNNNNN
........GGGgggggggggggggggg
........GGGgggggggggggggggg
........GGGgggggggggggggggg
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
............NNNNNNN.NNNNNNN
...........DDDDDDDD.DDDDDDDD
...........DDDDDDDD.DDDDDDDD
""")
wood_elf = [list(r + '.' * 40)[:40] for r in wood_elf]
for y in range(15, 23): wood_elf[y][15] = 'G'                              # линия левой руки
bow = [(4, 31), (5, 32), (6, 33), (7, 34), (8, 35), (9, 35), (10, 36), (11, 36)] + [(y, 37) for y in range(12, 23)] + \
      [(23, 36), (24, 36), (25, 35), (26, 35), (27, 34), (28, 33), (29, 32), (30, 31)]
for y, x in bow: wood_elf[y][x] = 'N'; wood_elf[y][x - 1] = 'T'           # дуга лука
for y in range(16, 22): wood_elf[y][36] = 'N'                              # рукоять лука целиком тёмная
for y in range(5, 30):
    if wood_elf[y][31] == '.': wood_elf[y][31] = 'l'                       # тетива
for y in range(17, 21):                                                     # рука к рукояти лука
    for x in range(27, 36): wood_elf[y][x] = 'S' if y in (17, 20) else 's'
for y in range(10, 22): wood_elf[y][5] = 'N'; wood_elf[y][6] = 'T'         # колчан за спиной
for x in (5, 6): wood_elf[9][x] = 'l'; wood_elf[8][x] = 'l'
wood_elf = [''.join(r) for r in wood_elf]
wood_elf = stretch(wood_elf, 48, [(13, 26), (27, 36)])

# ---------- пегас (композитор) 52×52: белая крылатая лошадь в полёте, тёмно-золотая грива и хвост ----------
c = Canvas(52, 52)
for k, (x1, y1) in enumerate(((2, 8), (8, 3), (16, 0), (24, 1))):        # крыло веером: перья чередуют светлый/серый
    c.poly([(24, 30), (x1, y1), (x1 + 7, y1 + 1), (28, 31)], 'e' if k % 2 else 'l')
c.ellipse(26, 36, 13, 6, 'L')                                            # корпус
c.ellipse(15, 37, 6, 5.5, 'L')                                           # круп
c.ellipse(26, 39, 10, 3, 'l')                                            # брюхо
c.ellipse(37, 33, 5.5, 5, 'L')                                           # грудь
c.ellipse(41, 25, 5, 8, 'L', rot=-0.5)                                   # шея
c.ellipse(46, 17, 6, 5, 'L')                                             # голова
c.ellipse(50.5, 18.5, 3, 2.5, 'l')                                       # морда
c.poly([(42, 14), (44, 8), (46, 14)], 'L')                               # ухо
c.feathers([(36, 19), (41, 12)], 'Y', 1.9, (-0.4, -0.8))                 # грива
c.line(12, 34, 3, 47, 'Y', th=3)                                         # хвост
for x0, mat in ((14, 'l'), (21, 'L'), (30, 'l'), (37, 'L')):             # ноги
    c.poly([(x0, 40), (x0 - 1, 49), (x0 + 3, 49), (x0 + 4, 40)], mat)
    c.poly([(x0 - 2, 48), (x0 + 4, 48), (x0 + 4, 51), (x0 - 2, 51)], 'e')
c.put(47, 15, 'k')                                                       # глаз
pegasus = strip_k(c)
pegasus = setpx(pegasus, [(47, 15, 'k')])
silver_extra = [(x, y, 'b') for y in (30, 31, 32) for x in range(35, 41)]   # синий нагрудный ремень

# ---------- дендроид-страж 56×60: дерево-великан, крона из листвы, кора с бороздами, ветки-руки, корни-ноги ----------
W, H = 56, 60
dend = [['.'] * W for _ in range(H)]
crown = {0: 7, 1: 11, 2: 13, 3: 15, 4: 16, 5: 17, 6: 17, 7: 16, 8: 15, 9: 13, 10: 10, 11: 7}
for y, hw in crown.items():
    for x in range(28 - hw, 28 + hw + 1): dend[y][x] = 'g'
for y, (a, b) in ((1, (18, 23)), (2, (17, 24)), (3, (17, 23)), (4, (18, 22))):        # светлые пятна листвы
    for x in range(a, b + 1): dend[y][x] = 'h'
    for x in range(56 - b, 56 - a + 1): dend[y][x] = 'h'
for y, (a, b) in ((3, (26, 30)), (4, (25, 31)), (5, (25, 31)), (6, (26, 30))):       # тёмный клок в центре
    for x in range(a, b + 1): dend[y][x] = 'G'
for y in range(9, 44):                                                              # ствол, книзу шире
    hw = 7 if y <= 22 else 7 + (y - 22) * 4 // 21
    for x in range(28 - hw, 28 + hw + 1): dend[y][x] = 'N'
for y in range(20, 44):                                                             # светлые полосы коры и борозда
    for x in (24, 25, 31, 32): dend[y][x] = 'n'
    dend[y][28] = 'D'
for y in (12, 13, 14):                                                              # глаза светятся
    for x in (23, 24, 25, 31, 32, 33): dend[y][x] = 'y'
dend[13][24] = 'k'; dend[13][32] = 'k'
for x in range(22, 27): dend[11][x] = 'D'
for x in range(30, 35): dend[11][x] = 'D'                                           # надбровья
for y in range(15, 19):
    for x in (27, 28, 29): dend[y][x] = 'T'                                          # нос-нарост
for y in (19, 20):
    for x in range(24, 33): dend[y][x] = 'D'                                        # рот-дупло
thick(dend, 22, 25, 8, 17, 'N', 5); thick(dend, 34, 25, 48, 17, 'N', 5)              # ветки-руки
thick(dend, 22, 23, 9, 15, 'n', 2); thick(dend, 34, 23, 47, 15, 'n', 2)              # свет по верху веток
for x0, x1, y1 in ((8, 3, 11), (8, 2, 17), (8, 5, 22), (48, 53, 11), (48, 54, 17), (48, 51, 22)):   # пальцы-сучья
    thick(dend, x0, 17, x1, y1, 'N', 2)
for y in range(44, 60):                                                             # три корня-ноги
    t = (y - 44) / 15.0
    for cx, dx in ((20, -11), (28, 0), (36, 11)):
        cxx = int(cx + dx * t)
        for x in range(cxx - 3, cxx + 4): dend[y][x] = 'z' if y >= 58 else 'N'
        if y < 58: dend[y][cxx - 1] = 'n'
dendroid_guard = [''.join(r) for r in dend]
soldier_extra = []
for cx, cy in ((3, 11), (53, 11), (2, 17), (54, 17)):                              # листва на сучьях солдата
    soldier_extra += [(x, y, 'g') for y in range(cy - 2, cy + 3) for x in range(cx - 2, cx + 3) if 0 <= x < W and (x - cx) ** 2 + (y - cy) ** 2 <= 5]

# ---------- единорог (композитор) 60×58: белая лошадь, мятная грива и хвост, золотой рог ----------
c = Canvas(60, 58)
c.ellipse(26, 36, 17, 8, 'L')                                            # корпус
c.ellipse(11, 37, 7, 7, 'L')                                             # круп
c.ellipse(26, 40, 13, 4, 'l')                                            # брюхо
c.ellipse(40, 34, 6.5, 6, 'L')                                           # грудь
c.ellipse(46, 25, 5.5, 9, 'L', rot=-0.45)                                # шея
c.ellipse(52, 15, 6, 4.5, 'L')                                           # голова
c.ellipse(56.5, 16.5, 3, 2.5, 'l')                                       # морда
c.poly([(49, 12), (51, 7), (53, 12)], 'L')                               # ухо
c.line(54, 11, 58, 1, 'Y', th=2)                                         # рог
c.feathers([(40, 19), (49, 11)], 'v', 2.4, (-0.3, -0.8))                 # грива
c.line(8, 33, 2, 50, 'v', th=3)                                          # хвост
c.feathers([(6, 38), (2, 50)], 'v', 1.8, (-0.6, 0.2))
for x0, mat in ((8, 'l'), (17, 'L'), (32, 'l'), (41, 'L')):              # ноги
    c.poly([(x0, 42), (x0 - 1, 55), (x0 + 4, 55), (x0 + 5, 42)], mat)
    c.poly([(x0 - 2, 54), (x0 + 5, 54), (x0 + 5, 58), (x0 - 2, 58)], 'e')
c.put(52, 13, 'k')                                                       # глаз
unicorn = strip_k(c)
unicorn = setpx(unicorn, [(52, 13, 'k')])
war_extra = [(x, y, 'w') for x, y in ((57, 0), (58, 0), (56, 1), (59, 1), (57, 2), (58, 2))]   # искры у острия рога
war_extra = [(x, y, 'w') for y in (0, 1) for x in range(55, 60)] + [(57, 2, 'w')]

# ---------- зелёный дракон (композитор) 64×60: тёмно-зелёный, светлое брюхо, перепончатые крылья, раскрытая пасть ----------
c = Canvas(64, 60)
# крылья: перепонка с зубчатым нижним краем, пальцы-кости
c.poly([(28, 30), (1, 12), (12, 12), (9, 2), (19, 8), (20, 0), (26, 12), (32, 28)], 'g')        # левое крыло
c.poly([(38, 30), (63, 12), (52, 12), (55, 2), (45, 8), (44, 0), (38, 12), (34, 28)], 'g')      # правое крыло
for x1, y1 in ((1, 12), (9, 2), (20, 0)): c.line(28, 30, x1, y1, 'G', th=2)                    # пальцы-кости
for x1, y1 in ((63, 12), (55, 2), (44, 0)): c.line(38, 30, x1, y1, 'G', th=2)
# тело, хвост, лапы
c.ellipse(30, 38, 16, 9, 'G')                                            # туловище
c.ellipse(31, 42, 12, 5, 't')                                            # брюхо
c.line(16, 40, 2, 54, 'G', th=4)                                         # хвост
c.poly([(0, 52), (4, 50), (6, 56), (2, 58)], 'h')                        # наконечник хвоста
for x0 in (18, 34):
    c.poly([(x0, 44), (x0 - 2, 57), (x0 + 5, 57), (x0 + 6, 44)], 'G')
    c.poly([(x0 - 4, 56), (x0 + 6, 56), (x0 + 6, 59), (x0 - 4, 59)], 'G')
    for dx in (-3, 0, 3): c.poly([(x0 + dx, 58), (x0 + dx + 1, 60), (x0 + dx + 2, 58)], 'i')   # когти
# шея и голова
c.ellipse(45, 30, 6, 9, 'G', rot=-0.6)
c.ellipse(45, 31, 3, 7, 't', rot=-0.6)                                   # светлое горло
c.ellipse(53, 19, 7, 5.5, 'G')                                           # голова
c.ellipse(59, 18, 4.5, 2.5, 'G')                                         # верхняя челюсть
c.poly([(54, 21), (63, 21), (61, 25), (54, 24)], 'D')                    # пасть
c.poly([(52, 23), (62, 25), (58, 28), (52, 27)], 't')                    # нижняя челюсть
for x in (56, 59, 62): c.put(x, 21, 'i'); c.put(x - 1, 24, 'i')          # зубы
c.put(53, 16, 'y'); c.put(54, 16, 'y'); c.put(53, 17, 'y'); c.put(54, 17, 'k')   # глаз
c.poly([(49, 15), (44, 8), (52, 13)], 'I'); c.poly([(54, 14), (56, 7), (58, 14)], 'I')   # рога
green_dragon = strip_k(c)
green_dragon = setpx(green_dragon, [(54, 17, 'k')])
# приметы золотого дракона: красный глаз и язык пламени из пасти
h = Canvas(64, 60)
h.poly([(62, 22), (64, 20), (64, 27), (60, 26)], 'f')
h.put(53, 16, 'r'); h.put(54, 16, 'r'); h.put(53, 17, 'r')
gold_extra = px_of(h)

out = "/* ============================================================================\n"
out += "   view/sprites_rampart_hd.js — существа Оплота в крупной сетке (unit 2), стиль Б:\n"
out += "   без контурной линии, тона кладёт рисунок. Собирается скриптом dev/proto/rampart_hd.py.\n"
out += "   ========================================================================== */\n(function () {\n  'use strict';\n  H3.Sprites.defineMany({\n"
out += block('centaur', centaur, 'кентавр: гнедое конское тело, торс в зелёной тунике, копьё (композитор)')
out += block('centaur_captain', None, 'капитан кентавров: стальной панцирь и шлем, красный плюмаж, алый плащ', base='centaur', tint={'g': 'e', 'G': 'E'}, extra=captain_extra)
out += block('dwarf', dwarf, 'гном: коренастый, рыжая борода до пояса, кольчуга, тяжёлый топор')
out += block('battle_dwarf', None, 'боевой гном: синий шлем, стальная броня, двусторонний топор', base='dwarf', tint={'e': 'C', 'E': 'B'}, extra=battle_extra)
out += block('wood_elf', wood_elf, 'лесной эльф: каштановые волосы, острые уши, зелёная туника и плащ, длинный лук, колчан')
out += block('grand_elf', None, 'великий эльф: золотые волосы, светлая одежда, синий плащ, смуглая кожа, самоцвет в волосах', base='wood_elf', tint={'n': 'y', 'g': 'i', 'G': 'b', 's': 'S'}, extra=[(17, 1, 'w'), (18, 1, 'w'), (17, 2, 'w'), (18, 2, 'w')])
out += block('pegasus', pegasus, 'пегас: белая крылатая лошадь в полёте, тёмно-золотая грива и хвост (композитор)')
out += block('silver_pegasus', None, 'серебряный пегас: серебристое тело, серые крылья, морская грива, синий нагрудный ремень', base='pegasus', tint={'L': 'l', 'l': 'e', 'e': 'E', 'Y': 'C'}, extra=silver_extra)
out += block('dendroid_guard', dendroid_guard, 'дендроид-страж: дерево-великан, крона листвы, кора с бороздами, ветки-руки, корни-ноги')
out += block('dendroid_soldier', None, 'дендроид-солдат: тёмная кора с тлеющими трещинами, оливковая крона, листва на сучьях', base='dendroid_guard', tint={'N': 'D', 'n': 'd', 'D': 'O', 'g': 'H', 'G': 'j'}, extra=soldier_extra)
out += block('unicorn', unicorn, 'единорог: белая лошадь, мятная грива и хвост, золотой рог (композитор)')
out += block('war_unicorn', None, 'боевой единорог: голубое тело, белая грива, искры у острия рога', base='unicorn', tint={'L': 'c', 'l': 'C', 'v': 'L', 'e': 'E'}, extra=war_extra)
out += block('green_dragon', green_dragon, 'зелёный дракон: тёмно-зелёный, светлое брюхо, перепончатые крылья, раскрытая пасть, рога (композитор)')
out += block('gold_dragon', None, 'золотой дракон: золотая чешуя, светлое брюхо, красный глаз, пламя из пасти', base='green_dragon', tint={'g': 'y', 'G': 'Y', 't': 'i', 'h': 'f', 'I': 'w'}, extra=gold_extra)
out += "  });\n})();\n"
p = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_rampart_hd.js')
io.open(p, 'w', encoding='utf-8').write(out)
print('записан', os.path.relpath(p))
