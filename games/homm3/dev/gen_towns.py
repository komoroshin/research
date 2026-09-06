#!/usr/bin/env python3
# Генератор js/view/sprites_towns.js — города на карте и здания экрана города.
# Примитивы (box/cone/crenel/stamp) + ручные штампы деталей; контур k накладывается автоматически.
import random

OUT = '/home/user/research/games/homm3/js/view/sprites_towns.js'

class C:
    def __init__(s, w, h):
        s.w, s.h = w, h
        s.g = [['.'] * w for _ in range(h)]
    def px(s, x, y, c):
        if 0 <= x < s.w and 0 <= y < s.h: s.g[y][x] = c
    def get(s, x, y):
        return s.g[y][x] if 0 <= x < s.w and 0 <= y < s.h else '.'
    def rect(s, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1): s.px(x, y, c)
    def hline(s, y, x0, x1, c):
        for x in range(x0, x1 + 1): s.px(x, y, c)
    def vline(s, x, y0, y1, c):
        for y in range(y0, y1 + 1): s.px(x, y, c)
    def box(s, x0, y0, x1, y1, light, main, dark):
        """Куб с освещением сверху-слева."""
        s.rect(x0, y0, x1, y1, main)
        s.hline(y0, x0, x1, light); s.vline(x0, y0, y1, light)
        s.vline(x1, y0 + 1, y1, dark); s.hline(y1, x0 + 1, x1, dark)
    def crenel(s, x0, x1, y, light, dark, period=2):
        """Зубцы над стеной: ряд y (стена начинается с y+1); зубец 2 px, промежуток 2 px."""
        x = x0
        while x <= x1:
            s.px(x, y, light)
            if x + 1 <= x1: s.px(x + 1, y, dark)
            x += 4
    def cone(s, cx, ybase, halfw, h, light, main, dark, tip=None):
        """Конус/фронтон: основание ширины 2*halfw+1 на ряду ybase, вершина на ybase-h."""
        for i in range(h + 1):
            y = ybase - i
            hw = round(halfw * (h - i) / h) if h else halfw
            for x in range(cx - hw, cx + hw + 1):
                c = main
                if x < cx - hw // 2: c = light
                elif x > cx + hw // 2 and hw > 0: c = dark
                s.px(x, y, c)
        if tip: s.px(cx, ybase - h, tip)
    def gable(s, x0, x1, ybase, h, light, main, dark):
        """Двускатная крыша над отрезком x0..x1 (прямоугольные скаты)."""
        cx = (x0 + x1) // 2
        for i in range(h + 1):
            y = ybase - i
            l = x0 + round((cx - x0) * i / h); r = x1 - round((x1 - cx) * i / h)
            for x in range(l, r + 1):
                s.px(x, y, light if x < l + 2 else (dark if x > r - 2 else main))
    def stamp(s, x, y, rows):
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                if ch != '.': s.px(x + i, y + j, ch)
    def window(s, x, y, w=1, h=2, c='z', top=None):
        s.rect(x, y, x + w - 1, y + h - 1, c)
        if top: s.hline(y - 1, x, x + w - 1, top)
    def arch(s, cx, ybot, hw, h, c, frame=None):
        """Арочный проём: низ ybot, полуширина hw, высота h."""
        for i in range(h):
            y = ybot - i
            cur = hw if i < h - hw else hw - (i - (h - hw)) - 1
            if cur < 0: break
            s.rect(cx - cur, y, cx + cur, y, c)
        if frame:
            for i in range(h):
                y = ybot - i
                cur = hw if i < h - hw else hw - (i - (h - hw)) - 1
                if cur < 0: break
                s.px(cx - cur - 1, y, frame); s.px(cx + cur + 1, y, frame)
                if i == h - 1: s.hline(y - 1, cx - cur, cx + cur, frame)
    def outline(s):
        add = []
        for y in range(s.h):
            for x in range(s.w):
                if s.g[y][x] != '.': continue
                near = False
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        if s.get(x + dx, y + dy) not in ('.',): near = True
                if near: add.append((x, y))
        for x, y in add: s.g[y][x] = 'k'
    def rows(s):
        return [''.join(r) for r in s.g]

SPR = {}
ORDER = []
def reg(name, c, pal=None):
    c.outline()
    r = c.rows()
    assert all(len(x) == c.w for x in r)
    SPR[name] = (r, pal); ORDER.append(name)

# ---------------------------------------------------------------------------
#  A. ГОРОДА НА КАРТЕ 56×48
# ---------------------------------------------------------------------------
W, H = 56, 48

def base_ground(c, y0, y1, light, main, dark):
    c.box(2, y0, W - 3, y1, light, main, dark)

# ---- Castle: белые стены, синие крыши --------------------------------------
def town_castle():
    c = C(W, H)
    wl, wm, wd = 'w', 'l', 'e'
    # задние башни
    for cx in (17, 39):
        c.box(cx - 3, 20, cx + 3, 40, wl, wm, wd); c.cone(cx, 19, 4, 6, 'c', 'b', 'B', tip='y')
        c.window(cx, 24, 1, 2, 'z'); c.window(cx, 30, 1, 2, 'z')
    # стена
    c.box(6, 33, 49, 45, wl, wm, wd)
    c.crenel(6, 49, 32, wl, wd)
    for x in range(9, 48, 5): c.window(x, 37, 1, 2, 'z')
    # угловые башни
    for cx in (7, 48):
        c.box(cx - 3, 24, cx + 3, 45, wl, wm, wd); c.cone(cx, 23, 4, 6, 'c', 'b', 'B', tip='y')
        c.window(cx, 28, 1, 2, 'z'); c.window(cx, 35, 1, 2, 'z')
    # центральный донжон (плоский верх — место флага)
    c.box(22, 12, 33, 45, wl, wm, wd)
    c.crenel(22, 33, 11, wl, wd)
    c.hline(17, 23, 32, wd)
    c.window(25, 20, 2, 3, 'z', top='b'); c.window(29, 20, 2, 3, 'z', top='b')
    c.window(27, 27, 2, 3, 'z', top='b')
    # ворота
    c.arch(27, 45, 2, 7, 'z', frame='B')
    c.hline(45, 25, 30, 'D'); c.hline(44, 25, 30, 'D')
    # синие полотнища на башне
    c.rect(23, 14, 24, 16, 'b'); c.rect(31, 14, 32, 16, 'b')
    reg('town_castle', c)

# ---- Rampart: камень с плющом, зелёные крыши, деревья ----------------------
def town_rampart():
    c = C(W, H)
    sl, sm, sd = 'l', 'e', 'E'
    # деревья позади
    for tx, ty, r in ((9, 30, 4), (46, 28, 5), (50, 35, 3)):
        c.cone(tx, ty + 6, r, r * 2 + 2, 'g', 'G', 'G'); c.vline(tx, ty + 7, ty + 9, 'N')
    # стена
    c.box(8, 34, 47, 45, sl, sm, sd); c.crenel(8, 47, 33, sl, sd)
    # плющ
    for x0, y0, n in ((17, 34, 9), (19, 35, 6), (36, 34, 8), (38, 35, 5), (34, 36, 4)):
        for i in range(n): c.px(x0 + (i % 2), y0 + i, 'g' if i % 3 else 'G')
    c.stamp(16, 42, ['gGg']); c.stamp(37, 42, ['gGg'])
    # боковые башни с зелёными коническими крышами
    for cx in (12, 43):
        c.box(cx - 3, 22, cx + 3, 45, sl, sm, sd); c.cone(cx, 21, 4, 7, 'h', 'g', 'G', tip='y')
        c.window(cx, 27, 1, 2, 'z'); c.window(cx, 33, 1, 2, 'z')
        c.px(cx - 3, 40, 'g'); c.px(cx - 2, 41, 'G'); c.px(cx + 3, 38, 'g')
    # центральная башня — круглая, с плоским верхом (флаг)
    c.box(23, 10, 32, 45, sl, sm, sd); c.crenel(23, 32, 9, sl, sd)
    c.hline(15, 24, 31, sd)
    c.window(26, 17, 1, 3, 'z', top='G'); c.window(29, 17, 1, 3, 'z', top='G')
    c.window(27, 25, 2, 3, 'z', top='G')
    for x, y in ((24, 30), (25, 31), (24, 33), (31, 36), (30, 37), (31, 39), (25, 40)): c.px(x, y, 'g')
    # ворота-арка
    c.arch(27, 45, 2, 7, 'D', frame='N')
    c.hline(45, 25, 30, 'N')
    reg('town_rampart', c)

# ---- Tower: белые/голубые башни со шпилями на снегу -------------------------
def town_tower():
    c = C(W, H)
    wl, wm, wd = 'w', 'L', 'l'
    # снег
    c.box(2, 41, W - 3, 45, 'w', 'L', 'l')
    # задние шпили
    for cx, top in ((14, 14), (41, 14)):
        c.box(cx - 2, top + 8, cx + 2, 43, wl, wm, wd); c.cone(cx, top + 7, 3, 7, 'c', 'b', 'B', tip='y')
        c.window(cx, top + 12, 1, 2, 'b'); c.window(cx, top + 18, 1, 2, 'b'); c.window(cx, top + 24, 1, 2, 'b')
    # низкая стена
    c.box(9, 35, 46, 43, wl, wm, wd); c.crenel(9, 46, 34, 'w', 'l')
    for x in range(12, 45, 5): c.window(x, 38, 1, 2, 'b')
    # боковые башни с шпилями
    for cx in (8, 47):
        c.box(cx - 3, 26, cx + 3, 43, wl, wm, wd); c.cone(cx, 25, 4, 9, 'c', 'b', 'B', tip='y')
        c.window(cx, 30, 1, 2, 'b'); c.window(cx, 36, 1, 2, 'b')
    # центральная башня: высокая, плоский верх с золотой каймой (место флага)
    c.box(23, 8, 32, 43, wl, wm, wd)
    c.hline(7, 23, 32, 'y'); c.hline(8, 24, 31, 'Y')
    c.hline(16, 24, 31, wd); c.hline(24, 24, 31, wd)
    c.window(25, 11, 2, 3, 'b', top='c'); c.window(29, 11, 2, 3, 'b', top='c')
    c.window(27, 19, 2, 3, 'b', top='c')
    c.window(27, 27, 2, 3, 'b', top='c')
    # синий пояс и ворота
    c.hline(33, 24, 31, 'b')
    c.arch(27, 43, 2, 7, 'B', frame='b'); c.hline(43, 25, 30, 'z')
    # снежные шапки на зубцах
    for x in range(10, 46, 4): c.px(x, 33, 'w')
    reg('town_tower', c)

# ---- Inferno: красно-чёрное, рога, огонь ------------------------------------
def town_inferno():
    c = C(W, H)
    wl, wm, wd = 'E', 'u', 'z'
    # лава по низу
    c.box(2, 42, W - 3, 45, 'f', 'F', 'R')
    # задние рогатые башни
    for cx in (15, 40):
        c.box(cx - 3, 22, cx + 3, 42, wl, wm, wd)
        c.rect(cx - 3, 21, cx + 3, 21, 'R')
        # рога
        c.stamp(cx - 5, 15, ['k.....k', 'kR...Rk', '.kR.Rk.', '.kRRRk.'])
        c.window(cx, 27, 1, 2, 'F'); c.window(cx, 33, 1, 2, 'F')
    # стена
    c.box(7, 33, 48, 42, wl, wm, wd)
    c.crenel(7, 48, 32, 'R', 'k')
    for x in range(10, 47, 5): c.window(x, 36, 1, 2, 'F')
    c.hline(41, 8, 47, 'R')
    # угловые башни
    for cx in (8, 47):
        c.box(cx - 3, 25, cx + 3, 42, wl, wm, wd)
        c.stamp(cx - 4, 19, ['k......k', 'kR....Rk', '.kR..Rk.', '..kRRk..', '..RRRR..'])
        c.window(cx, 30, 1, 2, 'F')
    # центральная башня с плоским верхом и рогами по бокам
    c.box(22, 13, 33, 42, wl, wm, wd)
    c.stamp(19, 6, ['k...............k', 'kR.............Rk', '.kR...........Rk.', '..kR.........Rk..', '...kR.......Rk...', '....kRRRRRRRk....', '....RRRRRRRRR....'])
    c.hline(19, 23, 32, 'R')
    c.window(25, 22, 2, 3, 'F', top='R'); c.window(29, 22, 2, 3, 'F', top='R')
    c.window(27, 29, 2, 3, 'f', top='R')
    # ворота — пасть с огнём
    c.arch(27, 42, 3, 8, 'z', frame='R')
    c.stamp(25, 37, ['.f...', 'fF.f.', 'FFfFF', 'FFFFF'])
    # огонь на стенах
    c.stamp(12, 28, ['.f.', 'fF.', 'FF.']); c.stamp(41, 28, ['.f.', '.Ff', '.FF'])
    reg('town_inferno', c)

# ---- Necropolis: чёрно-фиолетовая готика, черепа ----------------------------
def town_necropolis():
    c = C(W, H)
    wl, wm, wd = 'E', 'u', 'z'
    # задние шпили готики
    for cx in (15, 40):
        c.box(cx - 2, 22, cx + 2, 43, wl, wm, wd); c.cone(cx, 21, 3, 9, 'p', 'P', 'x', tip='i')
        c.window(cx, 26, 1, 3, 'a'); c.window(cx, 33, 1, 3, 'a')
    # стена
    c.box(7, 34, 48, 45, wl, wm, wd)
    c.crenel(7, 48, 33, 'E', 'z')
    for x in range(10, 47, 6): c.arch(x, 40, 1, 4, 'z', frame='P')
    # угловые башни с острыми фиолетовыми крышами
    for cx in (8, 47):
        c.box(cx - 3, 26, cx + 3, 45, wl, wm, wd); c.cone(cx, 25, 4, 8, 'p', 'P', 'x')
        c.window(cx, 31, 1, 3, 'a')
        c.stamp(cx - 1, 37, ['iii', 'izi', 'iii', '.i.'])  # череп на башне
    # центральная колокольня, плоский верх (флаг), стрельчатые окна
    c.box(22, 11, 33, 45, wl, wm, wd)
    c.crenel(22, 33, 10, 'E', 'z')
    c.hline(18, 23, 32, wd)
    c.arch(25, 25, 1, 6, 'a', frame='P'); c.arch(30, 25, 1, 6, 'a', frame='P')
    c.hline(30, 23, 32, 'P')
    # большой череп над воротами
    c.stamp(25, 32, ['.iiii.', 'iiiiii', 'izizii', 'iiiiii', '.ikik.'])
    # ворота
    c.arch(27, 45, 2, 6, 'z', frame='x'); c.hline(45, 25, 30, 'z')
    # свечение
    c.px(15, 12, 'a'); c.px(40, 12, 'a')
    reg('town_necropolis', c)

# ---- Dungeon: тёмные скалы, фиолетовые башни, вход в пещеру ------------------
def town_dungeon():
    c = C(W, H)
    rl, rm, rd = 'e', 'E', 'u'
    # скала — грубая форма
    c.cone(24, 45, 22, 20, rl, rm, rd); c.cone(34, 45, 20, 17, rl, rm, rd); c.cone(12, 45, 9, 11, rl, rm, rd); c.cone(47, 45, 7, 9, rl, rm, rd)
    c.rect(2, 36, W - 3, 45, rm); c.hline(36, 2, W - 3, rl); c.rect(3, 45, W - 3, 45, 'z')
    for x, y in ((6, 40), (10, 43), (20, 41), (36, 42), (48, 40), (44, 44), (15, 30), (40, 31), (24, 26), (31, 27)):
        c.px(x, y, 'z'); c.px(x + 1, y, 'u')
    for x, y in ((8, 37), (18, 33), (38, 34), (50, 38), (28, 24), (22, 30), (34, 30)):
        c.px(x, y, 'l')
    # фиолетовые башни, торчащие из скалы
    for cx, top in ((14, 20), (42, 20)):
        c.box(cx - 2, top + 6, cx + 2, 38, 'p', 'P', 'x'); c.cone(cx, top + 5, 3, 6, 'A', 'p', 'P', tip='a')
        c.window(cx, top + 9, 1, 2, 'a'); c.window(cx, top + 15, 1, 2, 'a')
    # центральная башня, плоский верх (флаг)
    c.box(24, 10, 31, 34, 'p', 'P', 'x')
    c.crenel(24, 31, 9, 'p', 'x')
    c.hline(16, 25, 30, 'x')
    c.window(26, 18, 1, 3, 'a'); c.window(29, 18, 1, 3, 'a'); c.window(27, 25, 2, 3, 'a')
    # вход в пещеру
    c.arch(28, 45, 5, 10, 'z', frame='u')
    c.stamp(24, 40, ['..a......', 'a...a..a.'])
    c.hline(45, 24, 32, 'z')
    # свечение у входа
    c.px(22, 44, 'a'); c.px(34, 43, 'a')
    reg('town_dungeon', c)

# ---- Stronghold: деревянный частокол, черепа, коричнево-жёлтый ---------------
def town_stronghold():
    c = C(W, H)
    wl, wm, wd = 'T', 'n', 'N'
    # земля
    c.box(2, 43, W - 3, 45, 't', 'd', 'D')
    # задние хижины с жёлтыми соломенными крышами
    for cx in (14, 42):
        c.box(cx - 5, 30, cx + 5, 43, wl, wm, wd); c.gable(cx - 6, cx + 6, 29, 6, 'y', 'Y', 'O')
        c.window(cx, 34, 2, 2, 'z')
    # частокол
    for x in range(6, 50, 2):
        c.vline(x, 34, 43, wm if x % 4 else wl); c.px(x, 33, 'T'); c.px(x + 1, 34, wd)
        c.vline(x + 1, 35, 43, wd)
    c.hline(39, 6, 49, 'D')
    # черепа на кольях
    for x in (8, 20, 34, 46):
        c.stamp(x - 1, 30, ['iii', 'izi', '.i.'])
    # центральная башня — деревянная, плоский верх (флаг)
    c.box(22, 14, 33, 43, wl, wm, wd)
    c.crenel(22, 33, 13, 'T', 'N')
    c.hline(20, 23, 32, wd); c.hline(28, 23, 32, wd); c.vline(27, 15, 42, wd)
    c.window(24, 22, 2, 2, 'z'); c.window(30, 22, 2, 2, 'z'); c.window(24, 31, 2, 2, 'z'); c.window(30, 31, 2, 2, 'z')
    # ворота с черепом над ними
    c.arch(27, 43, 2, 7, 'D', frame='N')
    c.stamp(25, 30, ['.iii.', 'iizii', 'iiiii', '.i.i.']); c.px(27, 30, 'i')
    # жёлтые щиты
    c.stamp(23, 16, ['yy', 'Yy']); c.stamp(31, 16, ['yy', 'Yy'])
    reg('town_stronghold', c)

# ---- Fortress: болотные хижины на сваях, зелёно-коричневые -------------------
def town_fortress():
    c = C(W, H)
    wl, wm, wd = 'T', 'n', 'N'
    # вода
    c.box(2, 41, W - 3, 45, 'v', 'C', 'Q')
    for x in range(4, 52, 7): c.px(x, 43, 'v')
    # задние хижины на сваях
    for cx in (12, 44):
        for sx in (cx - 4, cx + 4): c.vline(sx, 38, 44, 'N')
        c.box(cx - 5, 29, cx + 5, 38, wl, wm, wd); c.cone(cx, 28, 7, 6, 'H', 'j', 'G')
        c.window(cx, 33, 2, 2, 'z')
    # средние хижины
    for cx in (22, 34):
        for sx in (cx - 3, cx + 3): c.vline(sx, 39, 44, 'N')
        c.box(cx - 4, 33, cx + 4, 39, wl, wm, wd); c.gable(cx - 5, cx + 5, 32, 5, 'H', 'j', 'G')
        c.window(cx, 35, 1, 2, 'z')
    # центральная башня-хижина на сваях, плоский верх (флаг)
    for sx in (24, 27, 30, 33): c.vline(sx, 40, 44, 'D')
    c.box(23, 15, 34, 40, wl, wm, wd)
    c.crenel(23, 34, 14, 'j', 'G')
    c.hline(22, 24, 33, wd); c.hline(30, 24, 33, wd)
    c.stamp(25, 24, ['HHHHHHHH', 'jjjjjjjj', 'GGGGGGGG'])  # соломенный пояс
    c.window(26, 17, 1, 3, 'z'); c.window(30, 17, 1, 3, 'z'); c.window(27, 32, 3, 2, 'z')
    c.arch(28, 40, 2, 6, 'D', frame='N')
    # камыш и кувшинки
    for x in (5, 8, 50, 52): c.vline(x, 36, 41, 'H'); c.px(x, 35, 'G')
    c.stamp(14, 42, ['gg']); c.stamp(41, 43, ['gg'])
    reg('town_fortress', c)

# ---------------------------------------------------------------------------
#  B. ЗДАНИЯ ЭКРАНА ГОРОДА (стены n/N, крыши r/R — перекрашивает движок)
# ---------------------------------------------------------------------------
WL, WD, RL, RD = 'n', 'N', 'r', 'R'

def house(c, x0, x1, ytop, ybot, roofh, win=True, door=True):
    c.box(x0, ytop, x1, ybot, WL, WL, WD)
    c.gable(x0 - 1, x1 + 1, ytop - 1, roofh, RL, RL, RD)
    c.hline(ytop - 1, x0 - 1, x1 + 1, RD)
    if door:
        cx = (x0 + x1) // 2
        c.arch(cx, ybot, 1, 5, 'D', frame=WD)
    if win:
        c.window(x0 + 2, ytop + 3, 2, 2, 'y', top=WD); c.window(x1 - 3, ytop + 3, 2, 2, 'y', top=WD)

def bld_hall_1():
    c = C(44, 36)
    house(c, 5, 38, 16, 34, 9)
    c.window(12, 22, 2, 2, 'y', top=WD); c.window(30, 22, 2, 2, 'y', top=WD)
    c.window(20, 10, 2, 2, 'y', top=RD)  # мансарда
    c.vline(33, 5, 8, 'u'); c.px(34, 5, 'u'); c.stamp(32, 2, ['.l.', 'l.l'])  # труба с дымом
    c.hline(34, 6, 37, 'D')
    reg('bld_hall_1', c)

def bld_hall_2():
    c = C(48, 42)
    house(c, 5, 42, 20, 40, 9)
    c.window(12, 26, 2, 2, 'y', top=WD); c.window(34, 26, 2, 2, 'y', top=WD)
    c.window(12, 32, 2, 2, 'y', top=WD); c.window(34, 32, 2, 2, 'y', top=WD)
    # башенка с часами
    c.box(20, 6, 27, 20, WL, WL, WD)
    c.cone(23, 5, 4, 4, RL, RL, RD, tip='y')
    c.stamp(21, 9, ['.iii.', 'iiiii', 'iizii', 'iiiii', '.iii.'])
    c.px(23, 11, 'z'); c.px(23, 10, 'z')
    reg('bld_hall_2', c)

def bld_hall_3():
    c = C(52, 48)
    house(c, 8, 43, 24, 46, 8, win=False)
    for x in (12, 20, 30, 36): c.window(x, 28, 2, 3, 'y', top=WD); c.window(x, 36, 2, 3, 'y', top=WD)
    for cx in (9, 42):
        c.box(cx - 3, 12, cx + 3, 46, WL, WL, WD); c.cone(cx, 11, 4, 6, RL, RL, RD, tip='y')
        c.window(cx, 16, 1, 3, 'y'); c.window(cx, 24, 1, 3, 'y'); c.window(cx, 34, 1, 3, 'y')
    c.stamp(22, 11, ['.iii.', 'iiiii', 'iizii', 'iiiii', '.iii.']); c.px(24, 13, 'z'); c.px(24, 12, 'z')
    c.hline(46, 9, 42, 'D')
    reg('bld_hall_3', c)

def bld_hall_4():
    c = C(56, 56)
    c.box(6, 30, 49, 54, WL, WL, WD)
    c.hline(29, 5, 50, WD); c.hline(28, 5, 50, WL)
    for x in range(10, 47, 6): c.window(x, 34, 2, 4, 'y', top=WD); c.vline(x + 4, 31, 53, WD) if x < 44 else None
    c.arch(27, 54, 3, 9, 'D', frame=WD)
    # колоннада
    for x in (9, 15, 39, 45): c.vline(x, 42, 53, WL)
    # барабан купола
    c.box(18, 20, 37, 28, WL, WL, WD)
    for x in range(20, 36, 4): c.window(x, 22, 1, 3, 'y')
    # купол
    for i, hw in enumerate((10, 10, 9, 9, 8, 7, 6, 4, 2)):
        y = 19 - i
        for x in range(27 - hw, 28 + hw):
            c.px(x, y, RL if x < 27 - hw // 2 else (RD if x > 27 + hw // 2 else RL))
    c.hline(19, 17, 38, RD)
    # золотой шпиль
    c.stamp(25, 2, ['..y..', '..y..', '.yyy.', '.yyY.', '..yY.', '..yY.', '.yyY.', 'yyyYY', '.yyY.'])
    # боковые башенки
    for cx in (9, 46):
        c.box(cx - 3, 18, cx + 3, 30, WL, WL, WD); c.cone(cx, 17, 4, 5, RL, RL, RD, tip='y')
        c.window(cx, 22, 1, 3, 'y')
    c.hline(54, 7, 48, 'D')
    reg('bld_hall_4', c)

def wall_base(c, ytop, ybot, tower_top, tower_h_extra=0):
    w = c.w
    # стена
    c.box(9, ytop, w - 10, ybot, WL, WL, WD)
    c.crenel(9, w - 10, ytop - 1, WL, WD)
    c.hline(ytop + 3, 10, w - 11, WD)
    for x in range(14, w - 14, 8): c.rect(x, ytop + 5, x, ytop + 7, 'z')
    # ворота
    cx = w // 2
    c.arch(cx, ybot, 5, 11, 'D', frame=WD)
    c.arch(cx, ybot, 4, 9, 'z')
    for y in range(ybot - 8, ybot, 3): c.hline(y, cx - 4, cx + 4, 'e')
    for x in range(cx - 3, cx + 4, 3): c.vline(x, ybot - 8, ybot, 'e')
    # башни по краям
    for tx in (6, w - 7):
        c.box(tx - 5, tower_top, tx + 5, ybot, WL, WL, WD)
        c.crenel(tx - 5, tx + 5, tower_top - 1, WL, WD)
        c.rect(tx, tower_top + 4, tx, tower_top + 6, 'z')
        c.rect(tx, tower_top + 11, tx, tower_top + 13, 'z')

def bld_fort():
    c = C(96, 36)
    wall_base(c, 16, 34, 8)
    c.hline(34, 2, 93, 'D')
    reg('bld_fort', c)

def bld_citadel():
    c = C(96, 44)
    wall_base(c, 22, 42, 12)
    # центральная башня над воротами
    c.box(38, 4, 57, 26, WL, WL, WD); c.crenel(38, 57, 3, WL, WD)
    c.hline(9, 39, 56, WD)
    c.window(42, 12, 2, 3, 'z'); c.window(52, 12, 2, 3, 'z'); c.window(47, 18, 2, 3, 'z')
    c.hline(42, 2, 93, 'D')
    reg('bld_citadel', c)

def bld_castle():
    c = C(96, 56)
    wall_base(c, 30, 54, 14)
    # три башни
    for cx, top in ((25, 18), (70, 18)):
        c.box(cx - 5, top, cx + 5, 34, WL, WL, WD); c.crenel(cx - 5, cx + 5, top - 1, WL, WD)
        c.rect(cx, top + 5, cx, top + 7, 'z')
        c.cone(cx, top - 3, 5, 4, RL, RL, RD); c.vline(cx, top - 8, top - 6, 'k'); c.stamp(cx + 1, top - 8, ['rr', 'r.'])
    c.box(38, 8, 57, 34, WL, WL, WD); c.crenel(38, 57, 7, WL, WD)
    c.hline(13, 39, 56, WD); c.hline(23, 39, 56, WD)
    c.window(42, 16, 2, 3, 'z'); c.window(52, 16, 2, 3, 'z'); c.window(47, 26, 2, 3, 'z')
    c.vline(47, 2, 6, 'k'); c.stamp(48, 2, ['rrr', 'rr.', 'r..'])
    # флаги-пиксели на башнях краёв
    for tx in (6, 89): c.vline(tx, 9, 12, 'k'); c.stamp(tx + 1, 9, ['rr', 'r.'])
    c.hline(54, 2, 93, 'D')
    reg('bld_castle', c)

def bld_tavern():
    c = C(36, 32)
    house(c, 4, 31, 14, 30, 8)
    c.hline(21, 5, 30, WD)
    c.stamp(6, 22, ['N', 'N', 'N', 'N', 'N']); c.stamp(29, 22, ['N', 'N', 'N', 'N', 'N'])  # балки
    # вывеска с кружкой
    c.hline(4, 31, 34, WD); c.vline(34, 4, 5, WD)
    c.rect(31, 6, 35, 11, 'T'); c.rect(32, 7, 33, 10, 'y'); c.px(34, 8, 'Y'); c.px(34, 9, 'Y'); c.hline(7, 32, 33, 'w')
    c.vline(9, 4, 8, 'u'); c.px(10, 4, 'u'); c.stamp(8, 1, ['.l.', 'l.l'])
    reg('bld_tavern', c)

def bld_market():
    c = C(40, 28)
    # три навеса
    for x0, hue in ((2, RL), (15, RL), (28, RL)):
        x1 = x0 + 10
        c.vline(x0 + 1, 12, 26, WD); c.vline(x1 - 1, 12, 26, WD)
        c.rect(x0, 8, x1, 11, hue)
        for x in range(x0, x1 + 1, 2): c.vline(x, 8, 11, RD)
        c.hline(7, x0 + 1, x1 - 1, RL)
        # прилавок с товарами
        c.rect(x0 + 1, 20, x1 - 1, 26, WL); c.hline(20, x0 + 1, x1 - 1, WD)
        c.stamp(x0 + 2, 17, ['o.g', 'oyg', 'ooy'] if x0 != 15 else ['b.r', 'brr', 'bbr'])
        c.stamp(x1 - 4, 17, ['.p.', 'ppa', 'ppa'] if x0 != 2 else ['.i.', 'iii', 'tit'])
    reg('bld_market', c)

def bld_blacksmith():
    c = C(34, 30)
    c.box(3, 14, 30, 28, WL, WL, WD)
    c.gable(2, 31, 13, 6, RL, RL, RD); c.hline(13, 2, 31, RD)
    # труба и дым
    c.rect(24, 5, 26, 12, 'u'); c.hline(5, 23, 27, 'E')
    c.stamp(22, 1, ['..l..', '.l.ll', 'l.l..'])
    # открытый проём с наковальней и горном
    c.rect(6, 18, 17, 28, 'z')
    c.stamp(8, 22, ['..lee.', 'leeeee', '..ee..', '.eeee.'])
    c.stamp(14, 19, ['fF', 'Ff']); c.px(15, 18, 'f')
    c.window(22, 19, 3, 3, 'y', top=WD)
    c.hline(28, 4, 29, 'D')
    reg('bld_blacksmith', c)

def bld_silo():
    c = C(30, 40)
    c.box(7, 12, 22, 38, WL, WL, WD)
    for y in (18, 24, 30): c.hline(y, 8, 21, WD)
    c.cone(14, 11, 9, 7, RL, RL, RD, tip='y')
    c.hline(11, 5, 23, RD)
    c.window(14, 14, 1, 2, 'z'); c.window(14, 20, 1, 2, 'z')
    c.arch(14, 38, 2, 6, 'D', frame=WD)
    # мешки/зерно у входа
    c.stamp(1, 33, ['.tt.', 'tttT', 'tTTT']); c.stamp(24, 34, ['.tt.', 'tTTT'])
    reg('bld_silo', c)

def guild(name, w, h, floors):
    c = C(w, h)
    cx = w // 2
    tw = w // 2 - 3
    top = 12
    c.box(cx - tw, top, cx + tw, h - 2, WL, WL, WD)
    c.crenel(cx - tw, cx + tw, top - 1, WL, WD)
    for i in range(floors):
        y = top + 4 + i * 8
        c.hline(y + 6, cx - tw + 1, cx + tw - 1, WD)
        c.window(cx - tw + 2, y, 1, 3, 'b'); c.window(cx + tw - 2, y, 1, 3, 'b')
        if i == floors - 1: c.arch(cx, h - 2, 1, 5, 'D', frame=WD)
    # синий шар на вершине
    c.stamp(cx - 3, 2, ['..ccc..', '.cwbbc.', 'cwbbbbc', 'cbbbbBc', 'cbbbBBc', '.cbBBB.', '..cBc..'])
    c.rect(cx - 1, 9, cx + 1, 11, 'Y'); c.px(cx - 2, 11, 'y'); c.px(cx + 2, 11, 'y')
    reg(name, c)

def dwell_1():  # хижина
    c = C(28, 24)
    c.box(5, 12, 22, 22, WL, WL, WD)
    c.gable(4, 23, 11, 7, RL, RL, RD); c.hline(11, 4, 23, RD)
    c.arch(13, 22, 1, 5, 'D', frame=WD)
    c.window(7, 15, 2, 2, 'y', top=WD); c.window(18, 15, 2, 2, 'y', top=WD)
    c.stamp(21, 3, ['l.', '.l']); c.rect(20, 5, 21, 8, 'u')
    reg('bld_dwell_1', c)

def dwell_2():  # башенка
    c = C(30, 28)
    c.box(9, 10, 20, 26, WL, WL, WD)
    c.cone(14, 9, 7, 6, RL, RL, RD, tip='y'); c.hline(9, 7, 21, RD)
    c.window(12, 12, 1, 3, 'z'); c.window(16, 12, 1, 3, 'z'); c.window(14, 18, 2, 2, 'y', top=WD)
    c.arch(14, 26, 1, 5, 'D', frame=WD)
    # низкая пристройка
    c.box(2, 18, 8, 26, WL, WL, WD); c.gable(1, 9, 17, 3, RL, RL, RD)
    reg('bld_dwell_2', c)

def dwell_3():  # дом с двором
    c = C(34, 30)
    c.box(12, 12, 31, 28, WL, WL, WD)
    c.gable(11, 32, 11, 7, RL, RL, RD); c.hline(11, 11, 32, RD)
    c.window(15, 15, 2, 2, 'y', top=WD); c.window(26, 15, 2, 2, 'y', top=WD); c.window(15, 21, 2, 2, 'y', top=WD)
    c.arch(24, 28, 1, 6, 'D', frame=WD)
    # забор двора
    for x in range(2, 11, 2): c.vline(x, 21, 28, 'T'); c.px(x, 20, 'T')
    c.hline(23, 2, 11, 'N'); c.hline(26, 2, 11, 'N')
    c.stamp(4, 15, ['.gg.', 'gGgg', '.GG.']); c.vline(5, 18, 19, 'N')
    reg('bld_dwell_3', c)

def dwell_4():  # форт
    c = C(36, 34)
    c.box(4, 18, 31, 32, WL, WL, WD); c.crenel(4, 31, 17, WL, WD)
    c.hline(22, 5, 30, WD)
    for cx in (6, 29):
        c.box(cx - 3, 8, cx + 3, 32, WL, WL, WD); c.crenel(cx - 3, cx + 3, 7, WL, WD)
        c.window(cx, 12, 1, 3, 'z'); c.window(cx, 22, 1, 3, 'z')
    c.arch(17, 32, 3, 9, 'D', frame=WD); c.rect(15, 26, 19, 32, 'z')
    for y in (27, 30): c.hline(y, 15, 19, 'e')
    c.vline(17, 26, 32, 'e')
    c.window(11, 25, 1, 3, 'z'); c.window(23, 25, 1, 3, 'z')
    reg('bld_dwell_4', c)

def dwell_5():  # храм
    c = C(40, 38)
    c.box(4, 22, 35, 36, WL, WL, WD)
    # колонны
    for x in range(6, 35, 5): c.vline(x, 24, 35, WL); c.vline(x + 1, 24, 35, WD)
    c.hline(23, 5, 34, WD)
    c.gable(3, 36, 21, 8, RL, RL, RD); c.hline(21, 3, 36, RD)
    # окно-роза
    c.stamp(17, 14, ['.yyy.', 'yayay', 'yyayy', 'yayay', '.yyy.'])
    c.arch(19, 36, 2, 8, 'D', frame=WD)
    # купол-фонарь
    c.box(15, 8, 24, 13, WL, WL, WD); c.cone(19, 7, 5, 4, RL, RL, RD, tip='y')
    c.window(19, 9, 1, 3, 'y')
    reg('bld_dwell_5', c)

def dwell_6():  # большая башня
    c = C(44, 42)
    c.box(14, 10, 29, 40, WL, WL, WD); c.crenel(14, 29, 9, WL, WD)
    c.hline(16, 15, 28, WD); c.hline(26, 15, 28, WD)
    c.window(17, 12, 1, 3, 'z'); c.window(26, 12, 1, 3, 'z'); c.window(21, 19, 2, 3, 'z', top=WD); c.window(21, 29, 2, 3, 'z', top=WD)
    c.arch(21, 40, 2, 7, 'D', frame=WD)
    for cx in (7, 36):
        c.box(cx - 4, 22, cx + 4, 40, WL, WL, WD); c.cone(cx, 21, 5, 6, RL, RL, RD, tip='y')
        c.window(cx, 26, 1, 3, 'z'); c.window(cx, 33, 1, 3, 'z')
    c.cone(21, 8, 3, 5, RL, RL, RD, tip='y')
    reg('bld_dwell_6', c)

def dwell_7():  # величественный портал с сиянием
    c = C(52, 48)
    c.box(4, 20, 47, 46, WL, WL, WD); c.crenel(4, 47, 19, WL, WD)
    c.hline(26, 5, 46, WD)
    for cx in (8, 43):
        c.box(cx - 4, 8, cx + 4, 46, WL, WL, WD); c.cone(cx, 7, 5, 6, RL, RL, RD, tip='y')
        c.window(cx, 12, 1, 3, 'z'); c.window(cx, 22, 1, 3, 'z'); c.window(cx, 32, 1, 3, 'z')
    # портал
    c.arch(25, 46, 9, 20, RD, frame=WD)
    c.arch(25, 46, 7, 17, 'a')
    c.arch(25, 46, 5, 14, 'A')
    c.arch(25, 46, 3, 10, 'w')
    for x, y in ((14, 18), (36, 18), (12, 30), (38, 32), (16, 40), (34, 40)): c.px(x, y, 'A')
    c.stamp(22, 1, ['..k.k..', '.k.a.k.', 'k.aAa.k', '.k.a.k.', '..k.k..'])
    c.hline(46, 5, 46, 'D')
    reg('bld_dwell_7', c)

def bld_upg():
    c = C(12, 14)
    c.vline(2, 1, 12, 'N')
    c.stamp(3, 1, ['yyyyyyy.', 'yyyyyyyy', 'Yyyyyy..', 'YYyyy...', 'YYYy....'])
    c.px(2, 1, 'y')
    reg('bld_upg', c)

# ---------------------------------------------------------------------------
for f in (town_castle, town_rampart, town_tower, town_inferno, town_necropolis, town_dungeon, town_stronghold, town_fortress):
    f()
bld_hall_1(); bld_hall_2(); bld_hall_3(); bld_hall_4()
bld_fort(); bld_citadel(); bld_castle()
bld_tavern(); bld_market(); bld_blacksmith(); bld_silo()
guild('bld_guild_1', 24, 40, 2); guild('bld_guild_2', 26, 50, 3); guild('bld_guild_3', 28, 60, 4); guild('bld_guild_4', 30, 70, 5)
dwell_1(); dwell_2(); dwell_3(); dwell_4(); dwell_5(); dwell_6(); dwell_7()
bld_upg()

out = []
out.append('/* ============================================================================')
out.append('   view/sprites_towns.js — спрайты городов на карте (town_*) и зданий экрана')
out.append('   города (bld_*). Формат — см. docs/sprite-guide.md.')
out.append('   town_*: 56×48, якорь низ-центр, место флага — плоский верх главной башни.')
out.append('   bld_*: буквы n/N = стены (светлая/тёмная), r/R = крыши (светлая/тёмная) —')
out.append('   их перекрашивает движок в цвета фракции; остальное — общая палитра.')
out.append('   ========================================================================== */')
out.append('(function () {')
out.append('  H3.Sprites.defineMany({')
for name in ORDER:
    rows, pal = SPR[name]
    out.append('    %s: { // %d×%d' % (name, len(rows[0]), len(rows)))
    out.append('      rows: [')
    for r in rows: out.append("        '%s'," % r)
    out.append('      ],')
    out.append('    },')
out.append('  });')
out.append('})();')
open(OUT, 'w').write('\n'.join(out) + '\n')
print('wrote', len(ORDER), 'sprites')
for name in ORDER: print(name, len(SPR[name][0][0]), 'x', len(SPR[name][0]))
