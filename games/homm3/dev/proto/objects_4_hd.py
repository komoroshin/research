# -*- coding: utf-8 -*-
"""Сборка js/view/sprites_objects_4_hd.js: препятствия карты приключений (деревья, горы, камни),
препятствия поля боя (obst_*) и подземные врата в крупной сетке (unit 2 → номинальные размеры
старых спрайтов из sprites_objects.js), стиль Б — без контурной линии, объём держат тона:
свет сверху-слева, у каждой кроны/склона три-четыре ступени яркости. Всё — композитором."""
import io, os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
from compose import Canvas

# ---------- общие помощники ----------
def pad(rows, W):
    return [(r + '.' * W)[:W] for r in rows]

def block(name, rows, comment, unit=2, anchor=None):
    """блок defineMany для hd-спрайта; anchor — в ИСХОДНЫХ пикселях крупной сетки (движок делит на unit)"""
    W = max(len(r) for r in rows); rows = pad(rows, W)
    body = '\n'.join("        '%s'," % r for r in rows)
    pt = (' anchor: [%d, %d],' % tuple(anchor)) if anchor else ''
    return "    /* %s (%d×%d) */\n    %s: {\n      hd: true, unit: %d,%s\n      rows: [\n%s\n      ],\n    },\n" % (comment, W, len(rows), name, unit, pt, body)

def rect(c, x0, y0, x1, y1, mat):
    """прямоугольник: столбцы x0..x1-1, строки y0..y1-1 (полуоткрытый, как срезы)"""
    c.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], mat)

def despeckle(rows, passes=3):
    """одиночный пиксель (нет соседа своего тона по 4 сторонам) → самый частый тон среди соседей;
    прозрачное не трогаем, а пиксель почти без заливки вокруг стираем"""
    H, W = len(rows), len(rows[0])
    for _ in range(passes):
        def get(x, y): return rows[y][x] if 0 <= x < W and 0 <= y < H else '.'
        out = [r[:] for r in rows]; changed = False
        for y in range(H):
            for x in range(W):
                ch = rows[y][x]
                if ch == '.': continue
                nb = [get(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))]
                if ch in nb: continue
                solid = [a for a in nb if a != '.']
                out[y][x] = max(set(solid), key=solid.count) if len(solid) >= 2 else '.'
                changed = True
        rows = out
        if not changed: break
    return rows

def finish(c):
    rows = despeckle([list(r) for r in c.rows()])
    return [''.join(r) for r in rows]

# ---------- примитивы растительности и камня ----------
def lobe(c, x, y, r, dark, mid, light, ry=None):
    """шар листвы: тёмная основа, средний тон сдвинут вверх-влево, блик ещё выше-левее"""
    ry = ry or r
    c.ellipse(x, y, r, ry, dark)
    c.ellipse(x - r * 0.18, y - ry * 0.2, r * 0.78, ry * 0.76, mid)
    c.ellipse(x - r * 0.4, y - ry * 0.46, r * 0.42, ry * 0.34, light)

def shade(c, cx, cy, rx, ry, mat, over):
    """эллипс-тень только поверх материалов over (силуэт не растёт)"""
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1 and c.get(x, y) in over: c.put(x, y, mat)

def crown(c, lobes, dark, mid, light, deep=None):
    """крона из шаров: рисуем сверху вниз — нижние (передние) перекрывают низ верхних;
    deep — глубокая тень по нижней кромке кроны (только поверх листвы)"""
    lobes = sorted(lobes, key=lambda t: t[1])
    for x, y, r in lobes:
        lobe(c, x, y, r, dark, mid, light)
    if deep:
        xs = [x - r for x, y, r in lobes] + [x + r for x, y, r in lobes]
        ybot = max(y + r for x, y, r in lobes)
        cx = (min(xs) + max(xs)) / 2.0; rx = (max(xs) - min(xs)) / 2.0
        shade(c, cx + rx * 0.08, ybot - 2, rx * 0.85, rx * 0.22, deep, dark + mid)

def trunk(c, cx, y0, y1, w, dark, mid, deep=None):
    """ствол: тело dark, световая полоса mid слева, глубокая тень deep справа"""
    x0 = cx - w // 2
    rect(c, x0, y0, x0 + w, y1, dark)
    rect(c, x0, y0, x0 + max(2, w // 3), y1, mid)
    if deep: rect(c, x0 + w - 2, y0, x0 + w, y1, deep)

def roots(c, cx, ybot, half, dark, mid):
    """корневая «лапа» у земли: трапеция dark, верхняя грань mid"""
    c.poly([(cx - half, ybot), (cx + half, ybot), (cx + half * 0.45, ybot - 4), (cx - half * 0.45, ybot - 4)], dark)
    c.poly([(cx - half + 2, ybot - 2), (cx + half * 0.3, ybot - 2), (cx + half * 0.3, ybot - 4), (cx - half * 0.45, ybot - 4)], mid)

def tier(c, cx, top, bottom, half, light, mid, dark, tips=True):
    """ярус ели: конус с плоской вершиной 2 px, левая грань light-полоса, правая — dark; зубчики по нижнему краю"""
    c.poly([(cx - 1, top), (cx + 1, top), (cx + half, bottom), (cx - half, bottom)], mid)
    c.poly([(cx + 1, top), (cx + half, bottom), (cx + half * 0.1, bottom)], dark)
    c.poly([(cx - 1, top), (cx - half, bottom), (cx - half + 6, bottom)], light)
    if tips:
        x = cx - half + 1
        while x + 5 <= cx + half:
            c.poly([(x, bottom), (x + 5, bottom), (x + 2.5, bottom + 3)], light if x + 2 < cx - half + 6 else (mid if x + 2 < cx else dark))
            x += 6

def ledge(c, x, y, w, mat, h=3):
    """уступ склона: наклонный параллелограмм высотой h"""
    c.poly([(x, y), (x + w, y - 2), (x + w, y - 2 + h), (x, y + h)], mat)

def boulder(c, pts, light, mid, dark, deep=None):
    """валун: многоугольник mid, правая-нижняя треть dark, левая-верхняя полоса light, снизу deep"""
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    c.poly(pts, mid)
    cx, cy = (x0 + x1) / 2.0, (y0 + y1) / 2.0
    # тёмная грань: пересечение с полуплоскостью справа-снизу от диагонали через центр
    shade = [(x, y) for x, y in pts if (x - cx) + (y - cy) * 1.2 > 0]
    if len(shade) >= 2:
        i0 = pts.index(shade[0]); i1 = pts.index(shade[-1])
        c.poly(shade + [(cx + 1, cy + 1)], dark)
    # светлая полоса — уменьшенная копия верхне-левого края
    lit = [(x, y) for x, y in pts if (x - cx) * 0.6 + (y - cy) < -1]
    if len(lit) >= 2:
        inner = [(cx + (x - cx) * 0.55, cy + (y - cy) * 0.55) for x, y in lit[::-1]]
        c.poly(lit + inner, light)
    if deep: rect(c, x0, y1 - 2, x1, y1, deep)

def shard(c, xb0, xb1, yb, xt, yt, light, mid, dark):
    """кристалл-призма: левая грань mid с бликом light вдоль ребра, правая грань dark; вершина плоская 2 px"""
    xm = (xb0 + xb1) / 2.0 + 1
    c.poly([(xb0, yb), (xt - 1, yt), (xt + 1, yt), (xb1, yb)], mid)
    c.poly([(xm, yb), (xt + 1, yt), (xb1, yb)], dark)
    c.poly([(xb0, yb), (xt - 1, yt), (xt + 1, yt + 3), (xb0 + 3, yb)], light)

# ============================================================================
# ДЕРЕВЬЯ
# ============================================================================
# tree_1 40×52: дуб — круглая крона из семи шаров, толстый ствол
c = Canvas(40, 52)
trunk(c, 20, 28, 49, 6, 'N', 'n', 'D')
roots(c, 20, 52, 9, 'N', 'n')
crown(c, [(20, 17, 13), (9, 20, 7), (31, 21, 7), (12, 9, 6.5), (28, 8, 6.5), (20, 4, 6), (20, 27, 7)], 'G', 'g', 'h', deep='Q')
tree_1 = finish(c)

# tree_2 44×56: раскидистое дерево — крона шире и выше, два яруса шаров
c = Canvas(44, 56)
trunk(c, 22, 30, 53, 6, 'N', 'n', 'D')
roots(c, 22, 56, 10, 'N', 'n')
crown(c, [(22, 18, 15), (8, 22, 8), (36, 23, 8), (12, 9, 7), (32, 9, 7), (22, 4, 6), (22, 30, 8), (5, 14, 5), (39, 14, 5)], 'G', 'g', 'h', deep='Q')
tree_2 = finish(c)

# tree_3 36×48: берёза — светлая салатовая крона, белый ствол с тёмными отметинами
c = Canvas(36, 48)
trunk(c, 18, 26, 45, 6, 'l', 'L', 'e')
for i, y in enumerate((28, 34, 40)):                              # отметины коры 5×3, чередуем стороны
    rect(c, 15 + (i % 2) * 3, y, 20 + (i % 2) * 3, y + 3, 'u')
roots(c, 18, 48, 8, 'e', 'l')
crown(c, [(18, 14, 12), (7, 17, 6.5), (29, 17, 6.5), (10, 7, 6), (26, 7, 6), (18, 3, 5), (18, 23, 6.5)], 'j', 'g', 'h')
tree_3 = finish(c)

# tree_pine 36×56: ель — три яруса-конуса, тень яруса на нижнем, ствол внизу
def pine(c, snow=False):
    trunk(c, 18, 40, 53, 6, 'N', 'n', 'D')
    roots(c, 18, 56, 8, 'N', 'n')
    tiers = [(24, 43, 17), (12, 30, 13), (0, 18, 9)]
    for i, (top, bottom, half) in enumerate(tiers):
        tier(c, 18, top, bottom, half, 'h', 'g', 'G')
        if i + 1 < len(tiers):                                     # тень следующего (верхнего) яруса на этом
            nt, nb, nh = tiers[i + 1]
            rect(c, 18 - nh + 1, nb, 18 + nh - 1, nb + 3, 'Q')          # глубокая тень под верхним ярусом
        if snow:
            h = bottom - top
            c.poly([(17, top), (19, top), (18 + half * 0.55, top + h * 0.55), (18 + half * 0.3, top + h * 0.45), (18, top + h * 0.55), (18 - half * 0.3, top + h * 0.45), (18 - half * 0.55, top + h * 0.55)], 'w')
            c.poly([(18, top), (19, top), (18 + half * 0.55, top + h * 0.55), (18 + half * 0.3, top + h * 0.45), (18, top + h * 0.55)], 'l')
    if snow:
        c.ellipse(18, 54, 15, 3, 'l'); c.ellipse(17, 53, 13, 2.2, 'w')
c = Canvas(36, 56); pine(c); tree_pine = finish(c)
c = Canvas(36, 56); pine(c, snow=True); tree_snow = finish(c)

# tree_dead 36×48: сухое дерево — голый ствол, толстые изломанные ветви, корни
c = Canvas(36, 48)
branches = [((17, 27), (9, 13), 5), ((9, 13), (3, 3), 3), ((10, 13), (14, 2), 3),
            ((20, 25), (28, 11), 5), ((28, 11), (34, 3), 3), ((28, 11), (25, 1), 3),
            ((21, 31), (31, 23), 3), ((16, 33), (6, 24), 3)]
for (x0, y0), (x1, y1), th in branches:
    c.line(x0, y0, x1, y1, 'N', th)
for (x0, y0), (x1, y1), th in branches:
    if th >= 5: c.line(x0 - 1, y0 - 1, x1 - 1, y1 - 1, 'n', 2)
trunk(c, 18, 24, 45, 8, 'N', 'n', 'D')
roots(c, 18, 48, 10, 'N', 'n')
tree_dead = finish(c)

# tree_swamp 44×52: болотное дерево — оливковая крона, свисающие плети, ходульные корни в воде
c = Canvas(44, 52)
trunk(c, 22, 24, 44, 6, 'N', 'n', 'D')
c.line(19, 36, 10, 46, 'N', 3); c.line(25, 36, 34, 46, 'N', 3)           # ходульные корни
for x, y1 in ((6, 30), (14, 34), (30, 33), (38, 29)):                       # плети мха
    c.line(x, 22, x, y1, 'j', 3)
crown(c, [(22, 14, 15), (8, 17, 7), (36, 18, 7), (13, 6, 6), (31, 6, 6), (22, 24, 7)], 'j', 'H', 'h', deep='G')
c.ellipse(22, 47, 22, 5.5, 'Q'); c.ellipse(21, 46, 19, 3.8, 'q')           # вода
c.ellipse(11, 45, 4, 1.5, 'v'); c.ellipse(28, 47, 3.5, 1.5, 'v')            # блики на воде
tree_swamp = finish(c)

# tree_palm 40×56: пальма — изогнутый ствол, шесть листьев, кокосы
c = Canvas(40, 56)
tp = [(16, 54), (15, 44), (16, 34), (18, 26), (21, 18)]
for i in range(len(tp) - 1):
    c.line(tp[i][0], tp[i][1], tp[i + 1][0], tp[i + 1][1], 'N', 6)
for i in range(len(tp) - 1):
    c.line(tp[i][0] - 1, tp[i][1], tp[i + 1][0] - 1, tp[i + 1][1], 'n', 3)
c.ellipse(16, 54, 7, 2.5, 'N'); c.ellipse(15, 53, 4, 1.5, 'n')
fronds = [[(22, 16), (12, 8), (3, 14)], [(22, 16), (32, 8), (39, 14)], [(22, 16), (17, 6), (10, 2)],
          [(22, 16), (27, 6), (34, 2)], [(22, 16), (11, 19), (5, 28)], [(22, 16), (33, 19), (38, 28)]]
for pts in fronds:
    for i in range(2): c.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 'G', 6)
for pts in fronds:
    for i in range(2): c.line(pts[i][0] - 1, pts[i][1] - 1, pts[i + 1][0] - 1, pts[i + 1][1] - 1, 'g', 3)
c.ellipse(19, 20, 2.6, 2.6, 'N'); c.ellipse(24, 21, 2.6, 2.6, 'N'); c.ellipse(18, 19, 1.4, 1.2, 'n')
tree_palm = finish(c)

# ============================================================================
# ГОРЫ 64×60: главная вершина слева-центр, вторая справа; левый склон светлый, правый тёмный
# ============================================================================
def mountain(c, light, mid, dark, deep, snow=None, ledges=True):
    # главный массив
    c.poly([(0, 60), (8, 40), (18, 18), (26, 1), (30, 6), (36, 20), (44, 40), (50, 60)], mid)
    c.poly([(26, 1), (30, 6), (36, 20), (44, 40), (50, 60), (30, 60), (28, 30)], dark)          # теневая грань
    c.poly([(0, 60), (8, 40), (18, 18), (26, 1), (23, 12), (14, 38), (6, 60)], light)             # свет по левому ребру
    # вторая вершина справа (перед теневой гранью главной)
    c.poly([(40, 60), (46, 36), (52, 14), (58, 26), (64, 44), (64, 60)], mid)
    c.poly([(52, 14), (58, 26), (64, 44), (64, 60), (55, 60), (54, 32)], dark)
    c.poly([(40, 60), (46, 36), (52, 14), (50, 24), (48, 44), (44, 60)], light)
    if ledges:
        for x, y, w in ((10, 30, 9), (14, 44, 12), (5, 54, 10), (20, 22, 7)): ledge(c, x, y, w, dark)   # тени уступов на свету
        for x, y, w in ((32, 26, 8), (36, 40, 10), (34, 52, 12)): ledge(c, x, y, w, mid)                # освещённые кромки в тени
        ledge(c, 57, 40, 6, mid); ledge(c, 46, 48, 8, dark)
    rect(c, 0, 58, 64, 60, deep)
    if snow:
        w, l = snow
        c.poly([(18, 18), (26, 1), (30, 6), (36, 20), (33, 14), (30, 18), (27, 12), (24, 19), (21, 13)], w)
        c.poly([(26, 1), (30, 6), (36, 20), (33, 14), (30, 18), (27, 12)], l)
        c.poly([(48, 24), (52, 14), (58, 26), (56, 22), (54, 27), (51, 21)], w)
        c.poly([(52, 14), (58, 26), (56, 22), (54, 27)], l)
c = Canvas(64, 60); mountain(c, 'l', 'e', 'E', 'u', snow=('w', 'l')); mountain_1 = finish(c)
c = Canvas(64, 60); mountain(c, 't', 'n', 'N', 'D'); mountain_2 = finish(c)

# mountain_lava 64×60: вулкан — графит, кратер с огнём, лавовые потоки по обоим склонам
c = Canvas(64, 60)
c.poly([(0, 60), (8, 40), (18, 14), (24, 6), (36, 6), (42, 16), (52, 40), (60, 60)], 'u')
c.poly([(30, 6), (36, 6), (42, 16), (52, 40), (60, 60), (34, 60), (32, 30)], 'z')
c.poly([(0, 60), (8, 40), (18, 14), (24, 6), (22, 14), (14, 38), (6, 60)], 'E')
for x, y, w in ((10, 32, 8), (36, 30, 8), (44, 46, 10)): ledge(c, x, y, w, 'z' if x < 30 else 'u')
# кратер: рваный край, лава внутри
c.poly([(20, 8), (26, 3), (34, 3), (40, 8), (38, 10), (22, 10)], 'E')
c.poly([(23, 8), (27, 5), (33, 5), (37, 8), (36, 9), (24, 9)], 'F')
rect(c, 27, 6, 33, 9, 'f')
# потоки: ржавое свечение, лава, яркая сердцевина
streams = [[(24, 9), (20, 24), (14, 40), (12, 60)], [(35, 9), (40, 26), (46, 42), (50, 60)], [(30, 9), (30, 20), (26, 34), (28, 48), (27, 60)]]
for s in streams:
    for i in range(len(s) - 1): c.line(s[i][0], s[i][1], s[i + 1][0], s[i + 1][1], 'O', 5)
for s in streams:
    for i in range(len(s) - 1): c.line(s[i][0], s[i][1], s[i + 1][0], s[i + 1][1], 'F', 3)
for s in streams[:2]:
    for i in range(len(s) - 1): c.line(s[i][0], s[i][1], s[i + 1][0], s[i + 1][1], 'f', 1)
rect(c, 0, 58, 64, 60, 'z')
mountain_lava = finish(c)

# ============================================================================
# КАМНИ
# ============================================================================
# rock_1 28×20: один валун
c = Canvas(28, 20)
boulder(c, [(2, 20), (1, 12), (5, 6), (12, 3), (20, 4), (26, 9), (27, 20)], 'l', 'e', 'E', 'u')
rock_1 = finish(c)

# rock_2 28×20: россыпь из трёх камней
c = Canvas(28, 20)
boulder(c, [(13, 20), (12, 9), (17, 4), (24, 4), (27, 9), (27, 20)], 'l', 'e', 'E')
boulder(c, [(0, 20), (0, 12), (4, 7), (10, 7), (13, 12), (13, 20)], 'l', 'e', 'E')
boulder(c, [(8, 20), (9, 14), (13, 12), (18, 13), (20, 20)], 'l', 'e', 'E')
rect(c, 0, 18, 28, 20, 'u')
rock_2 = finish(c)

# crystal_rock 32×28: три голубых кристалла на сером камне
c = Canvas(32, 28)
boulder(c, [(0, 28), (1, 20), (8, 17), (24, 17), (31, 21), (31, 28)], 'l', 'e', 'E', 'u')
shard(c, 18, 27, 20, 23, 6, 'w', 'c', 'C')
shard(c, 4, 14, 20, 9, 0, 'w', 'c', 'C')
shard(c, 13, 20, 20, 17, 11, 'w', 'c', 'C')
crystal_rock = finish(c)

# ============================================================================
# ПРЕПЯТСТВИЯ БОЯ 52×40
# ============================================================================
# obst_rock: большой валун и малый рядом
c = Canvas(52, 40)
boulder(c, [(0, 38), (0, 26), (6, 12), (14, 3), (26, 0), (34, 4), (40, 16), (43, 30), (40, 38)], 'l', 'e', 'E')
boulder(c, [(38, 38), (39, 20), (44, 10), (50, 12), (51, 24), (50, 38)], 'l', 'e', 'E')
c.line(24, 20, 30, 28, 'u', 3); ledge(c, 8, 26, 10, 'E')                              # трещина и уступ
rect(c, 0, 37, 52, 40, 'u')
obst_rock = finish(c)

# obst_stump: пень — годовые кольца на спиле, кора, корни
c = Canvas(52, 40)
rect(c, 7, 16, 41, 34, 'N'); rect(c, 7, 16, 13, 34, 'n'); rect(c, 36, 16, 41, 34, 'D')
c.ellipse(24, 34, 17, 3.5, 'N'); c.ellipse(21, 34, 12, 2, 'n')
for x, y in ((5, 37), (24, 37), (45, 37)):
    c.ellipse(x, y, 7, 3, 'N'); c.ellipse(x - 1, y - 1, 5, 1.6, 'n')
c.ellipse(24, 16, 17.5, 8.5, 'T')                                                  # кромка коры сверху
c.ellipse(24, 16, 15.5, 7, 't')
for r in (12, 6): c.ellipse(24, 16, r, r * 0.45, 'T')
for r in (9, 3): c.ellipse(24, 16, r, r * 0.45, 't')
rect(c, 0, 38, 52, 40, 'D')
obst_stump = finish(c)

# obst_bush: куст — гроздь шаров листвы, тёмный низ
c = Canvas(52, 40)
c.ellipse(26, 36, 24, 4, 'G')
crown(c, [(26, 22, 15), (10, 26, 9), (42, 27, 9), (16, 12, 8), (36, 13, 8), (26, 8, 7), (26, 32, 8), (4, 32, 5), (48, 33, 5)], 'G', 'g', 'h', deep='Q')
obst_bush = finish(c)

# obst_bones: череп, длинные кости, рёбра
c = Canvas(52, 40)
c.ellipse(26, 37, 22, 3.6, 'I'); c.ellipse(24, 36, 17, 2, 'i')                       # костяная россыпь
for (x0, y0), (x1, y1) in (((3, 31), (21, 25)), ((30, 33), (49, 28))):              # длинные кости
    c.line(x0, y0, x1, y1, 'I', 5); c.line(x0 - 1, y0 - 1, x1 - 1, y1 - 1, 'i', 3)
    for x, y in ((x0, y0), (x1, y1)):
        c.ellipse(x, y - 2, 3, 2.2, 'i'); c.ellipse(x, y + 2, 3, 2.2, 'I')
for i, x in enumerate((4, 10, 16)):                                                    # рёбра — дуги грудной клетки
    c.line(x, 13 + i, x + 1, 20, 'I', 3); c.line(x + 1, 20, x + 5, 25, 'I', 3)
    c.line(x - 1, 13 + i, x, 19, 'i', 2)
c.ellipse(34, 12, 10, 9, 'I'); c.ellipse(32, 11, 8.5, 7.5, 'i')                       # череп
rect(c, 27, 18, 41, 23, 'I'); rect(c, 28, 17, 38, 21, 'i')
c.ellipse(29, 11, 2.6, 2.4, 'z'); c.ellipse(37, 11, 2.6, 2.4, 'z')                    # глазницы
c.poly([(32, 14), (35, 14), (33.5, 17)], 'z')                                          # нос
for x in (29, 33, 37): rect(c, x, 20, x + 2, 23, 'u')                                  # зубы
obst_bones = finish(c)

# obst_lava: лужа лавы — тёмный ободок, огонь, корка, яркие пятна
c = Canvas(52, 40)
c.ellipse(26, 26, 25, 11, 'u'); c.ellipse(26, 26, 22.5, 9, 'O'); c.ellipse(26, 25, 20, 7.5, 'F')
for x, y, rx, ry in ((12, 24, 4, 2.2), (30, 30, 5, 2), (38, 22, 3.5, 2)): c.ellipse(x, y, rx, ry, 'O')
for x, y, rx, ry in ((20, 22, 4, 2), (33, 25, 3.5, 1.8), (16, 29, 3, 1.6)): c.ellipse(x, y, rx, ry, 'f')
obst_lava = finish(c)

# obst_ice: ледяная глыба — несколько осколков на льдине
c = Canvas(52, 40)
rect(c, 0, 30, 52, 40, 'C'); rect(c, 0, 30, 52, 34, 'c'); rect(c, 0, 30, 12, 33, 'l')
shard(c, 30, 44, 32, 40, 10, 'w', 'c', 'C')
shard(c, 4, 18, 32, 10, 1, 'w', 'c', 'C')
shard(c, 36, 50, 32, 45, 18, 'w', 'c', 'C')
shard(c, 14, 30, 32, 24, 6, 'w', 'c', 'C')
obst_ice = finish(c)

# ============================================================================
# subter_gate 44×40: каменное кольцо с чёрным провалом, ступень-плита внизу; якорь [22,40]
# ============================================================================
c = Canvas(44, 40)
rect(c, 2, 32, 42, 40, 'e'); rect(c, 2, 32, 42, 35, 'l'); rect(c, 2, 38, 42, 40, 'E')
c.ellipse(22, 16, 16, 16, 'E')
c.ellipse(21, 15, 14.5, 14.5, 'e')
c.ellipse(19.5, 13.5, 12, 12, 'l')
c.ellipse(22, 16, 10.5, 10.5, 'u')
c.ellipse(22, 15.3, 9, 9, 'z')
subter_gate = finish(c)

# ============================================================================
items = [
    ('tree_1', tree_1, 'Дуб: круглая крона из шаров листвы (тень/тон/блик), толстый ствол с корнями', None),
    ('tree_2', tree_2, 'Раскидистое дерево: широкая двухъярусная крона, ствол с корнями', None),
    ('tree_3', tree_3, 'Берёза: светлая салатовая крона, белый ствол с тёмными отметинами', None),
    ('tree_pine', tree_pine, 'Ель: три яруса-конуса, свет слева, тень яруса на ярусе, зубчатый край', None),
    ('tree_snow', tree_snow, 'Заснеженная ель: снежные шапки на ярусах, сугроб у ствола', None),
    ('tree_dead', tree_dead, 'Сухое дерево: голый ствол, изломанные толстые ветви, корни', None),
    ('tree_swamp', tree_swamp, 'Болотное дерево: оливковая крона, плети мха, ходульные корни в тёмной воде', None),
    ('tree_palm', tree_palm, 'Пальма: изогнутый ствол, шесть листьев с тёмным низом, кокосы', None),
    ('mountain_1', mountain_1, 'Серая гора: две вершины со снегом, светлое левое ребро, теневая грань, уступы', None),
    ('mountain_2', mountain_2, 'Бурая гора: две вершины, песочное ребро, тёмный склон, уступы', None),
    ('mountain_lava', mountain_lava, 'Вулкан: графитовый конус, кратер с огнём, три лавовых потока', None),
    ('rock_1', rock_1, 'Валун: серый камень, блик слева-сверху, тень справа-снизу', None),
    ('rock_2', rock_2, 'Россыпь из трёх камней', None),
    ('crystal_rock', crystal_rock, 'Кристаллы: три голубых призмы на сером камне', None),
    ('obst_rock', obst_rock, 'Препятствие боя: большой валун с трещинами и малый рядом', None),
    ('obst_stump', obst_stump, 'Препятствие боя: пень с годовыми кольцами, корой и корнями', None),
    ('obst_bush', obst_bush, 'Препятствие боя: куст — гроздь шаров листвы', None),
    ('obst_bones', obst_bones, 'Препятствие боя: череп, длинные кости, рёбра, костяная россыпь', None),
    ('obst_lava', obst_lava, 'Препятствие боя: лужа лавы с коркой и яркими пятнами', None),
    ('obst_ice', obst_ice, 'Препятствие боя: ледяные осколки на льдине', None),
    ('subter_gate', subter_gate, 'Подземные врата: каменное кольцо, чёрный провал, плита-ступень', [22, 40]),
]

# ---------- проверки: размер 2× от старого, палитра, одиночные пиксели ----------
PALETTE = set('kwleEuzsStTIiLrRoOfFMmyYnNdDgGhHjqQvbBcCpPxaA.')
import re
old = io.open(os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_objects.js'), encoding='utf-8').read()
def old_size(name):
    m = re.search(r"\n    %s: \{ rows: \[\n((?:.*\n)*?)    \]" % name, old)
    rows = [r.strip()[1:-2] for r in m.group(1).split('\n') if r.strip().startswith("'")]
    return len(rows[0]), len(rows)
for name, rows, comment, anchor in items:
    W, H = len(rows[0]), len(rows)
    ow, oh = old_size(name)
    assert (W, H) == (2 * ow, 2 * oh), '%s: %d×%d, ожидалось %d×%d' % (name, W, H, 2 * ow, 2 * oh)
    assert all(len(r) == W for r in rows), name
    assert all(ch in PALETTE for r in rows for ch in r), '%s: символ вне палитры' % name
    assert name == 'obst_lava' or any(ch != '.' for ch in rows[-1]), '%s: нижняя строка пуста' % name   # лужа лавы плоская, как и в старом файле
    lone = []
    for y in range(H):
        for x in range(W):
            ch = rows[y][x]
            if ch == '.': continue
            same = sum(1 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + dx < W and 0 <= y + dy < H and rows[y + dy][x + dx] == ch)
            if same == 0: lone.append((x, y, ch))
    if lone: print('  одиночные пиксели в %s: %s' % (name, lone))

out = "/* ============================================================================\n"
out += "   view/sprites_objects_4_hd.js — препятствия карты приключений (деревья, горы, камни), препятствия\n"
out += "   поля боя (obst_*) и подземные врата в крупной сетке (unit 2, номинальные размеры — как у старых\n"
out += "   спрайтов в sprites_objects.js), стиль Б: без контурной линии, объём держат тона (свет сверху-слева).\n"
out += "   Якорь — низ-центр; у subter_gate — как в старом файле. Собирается скриптом dev/proto/objects_4_hd.py.\n"
out += "   ========================================================================== */\n(function () {\n  'use strict';\n  H3.Sprites.defineMany({\n"
for name, rows, comment, anchor in items:
    out += block(name, rows, comment, anchor=anchor)
out += "  });\n})();\n"
p = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_objects_4_hd.js')
io.open(p, 'w', encoding='utf-8').write(out)
print('записан', os.path.normpath(p))
