# -*- coding: utf-8 -*-
"""js/view/sprites_towns_{1,2,3}_hd.js — 11 городов на карте в сетке unit 3.

Город собирается из общего каркаса (стена с зубцами, ворота, донжон, башни) и
фракционных надстроек. Сетка втрое крупнее даёт место под кладку швами, оконные
переплёты, черепицу, зубцы и флаги.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, write

W, H = 168, 114

def wall(c, y0, y1, mid, light, dark, crenel=True, step=10):
    c.rect(4, y0, W - 5, y1, mid)
    c.rect(4, y0, W - 5, y0 + 3, light)
    for y in range(int(y0) + 6, int(y1), 9): c.rect(4, y, W - 5, y, dark)     # швы кладки
    for x in range(6, W - 6, 13): c.rect(x, y0 + 2, x + 1, y1, dark)
    if crenel:
        for x in range(4, W - 6, step):
            c.rect(x, y0 - 6, x + step // 2, y0, mid)
            c.rect(x, y0 - 6, x + step // 2, y0 - 4, light)

def gate(c, cx, ybase, w, h, arch, dark, bars=True):
    c.rect(cx - w, ybase - h, cx + w, ybase, dark)
    c.ellipse(cx, ybase - h, w, w * 0.9, dark)
    c.rect(cx - w - 3, ybase - h - 3, cx + w + 3, ybase - h + 2, arch)
    c.ellipse(cx, ybase - h - 1, w + 3, w * 0.95, arch)
    c.ellipse(cx, ybase - h, w, w * 0.9, dark)
    if bars:
        for x in range(int(cx - w) + 2, int(cx + w), 5): c.rect(x, ybase - h, x + 1, ybase, 'u')
        for y in range(int(ybase - h), int(ybase), 6): c.rect(cx - w, y, cx + w, y + 1, 'u')

def tower(c, cx, ybase, w, h, mid, light, dark, roof=None, roofd=None, spire=True, flag=None, win='y'):
    c.rect(cx - w, ybase - h, cx + w, ybase, mid)
    c.rect(cx - w, ybase - h, cx - w + 3, ybase, light)
    c.rect(cx + w - 3, ybase - h, cx + w, ybase, dark)
    for y in range(int(ybase - h) + 8, int(ybase), 10): c.rect(cx - w, y, cx + w, y, dark)
    for i in range(int(h // 16)):                                            # окна переплётом
        y = ybase - h + 12 + i * 16
        c.rect(cx - 3, y, cx + 2, y + 7, win)
        c.rect(cx - 1, y, cx - 1, y + 7, dark); c.rect(cx - 3, y + 3, cx + 2, y + 3, dark)
    if roof:
        c.poly([(cx - w - 3, ybase - h), (cx + w + 3, ybase - h), (cx, ybase - h - (h * 0.42 if spire else h * 0.25))], roofd)
        c.poly([(cx - w - 1, ybase - h - 1), (cx + w * 0.4, ybase - h - 1), (cx, ybase - h - (h * 0.38 if spire else h * 0.22))], roof)
    if flag:
        c.rect(cx, ybase - h - h * 0.5, cx + 1, ybase - h - h * 0.2, 'u')
        c.poly([(cx + 1, ybase - h - h * 0.5), (cx + 11, ybase - h - h * 0.44), (cx + 1, ybase - h - h * 0.36)], flag)

def base_town(c, mid, light, dark, roof, roofd, win='y', flag='r', ground=None):
    if ground: c.rect(0, H - 10, W - 1, H - 1, ground)
    wall(c, H - 34, H - 6, mid, light, dark)
    tower(c, 18, H - 6, 12, 62, mid, light, dark, roof, roofd, True, flag, win)
    tower(c, W - 19, H - 6, 12, 62, mid, light, dark, roof, roofd, True, None, win)
    tower(c, 50, H - 6, 10, 48, mid, light, dark, roof, roofd, True, None, win)
    tower(c, W - 51, H - 6, 10, 48, mid, light, dark, roof, roofd, True, None, win)
    tower(c, W // 2, H - 6, 22, 86, mid, light, dark, roof, roofd, True, flag, win)   # донжон
    gate(c, W // 2, H - 6, 13, 24, dark, 'z')

T = []
def add(g, name, comment, fn):
    c = Fig(W, H)
    fn(c)
    T.append((g, emit(name, c, comment)))

# ---- Замок ----
def castle(c):
    base_town(c, 'l', 'w', 'e', 'b', 'B', 'y', 'r', ground=None)
    c.rect(W // 2 - 8, H - 96, W // 2 + 7, H - 88, 'r')                      # алое знамя на донжоне
add(1, 'town_castle', 'Замок: белый донжон с алым знаменем, башни под синими конусами, зубчатая стена', castle)

# ---- Оплот ----
def rampart(c):
    base_town(c, 'e', 'l', 'E', 'G', 'j', 'f', 'g')
    for x in (30, 70, 100, 140):                                             # деревянные балконы
        c.rect(x - 9, H - 52, x + 9, H - 47, 'N'); c.rect(x - 9, H - 52, x + 9, H - 51, 'n')
    c.tree_crown(W - 26, H - 74, 24, 'G', 'g', 'j')                          # огромное дерево
    c.bark(W - 30, H - 56, W - 22, H - 8, 'N', 'n', 'D')
add(1, 'town_rampart', 'Оплот: серая башня с деревянными балконами, зелёные конусы, огромное дерево', rampart)

# ---- Башня ----
def tower_town(c):
    base_town(c, 'w', 'L', 'l', 'c', 'C', 'b', 'c')
    for cx, r in ((18, 13), (W - 19, 13), (W // 2, 23)):                      # луковичные купола
        c.ellipse(cx, H - (68 if r > 20 else 62), r, r * 0.9, 'c')
        c.ellipse(cx - r * 0.3, H - (72 if r > 20 else 66), r * 0.6, r * 0.5, 'w')
        c.poly([(cx - 2, H - (80 if r > 20 else 74)), (cx, H - (96 if r > 20 else 88)), (cx + 2, H - (80 if r > 20 else 74))], 'y')
    c.rect(4, H - 12, W - 5, H - 8, 'y')                                      # золотая площадка
add(1, 'town_tower', 'Башня: белые стены, голубые луковичные купола с золотыми шпилями, золотая площадка', tower_town)

# ---- Инферно ----
def inferno(c):
    base_town(c, 'u', 'E', 'z', 'R', 'D', 'F', 'r')
    for x in range(8, W - 8, 14):                                             # шипы на стене
        c.poly([(x, H - 34), (x + 3, H - 46), (x + 6, H - 34)], 'E')
    for cx in (18, W - 19, W // 2):
        c.horns(cx, H - 70, 16, 'E', 'u', spread=10, curve=5)
        c.flame(cx, H - 66, 16, 18, 'f', 'F', 'O', 4)
    c.rect(0, H - 8, W - 1, H - 1, 'F')                                       # лавовый ров
    c.rect(0, H - 8, W - 1, H - 6, 'f')
add(2, 'town_inferno', 'Инферно: чёрный камень, рога и пламя на башнях, шипы на стене, лавовый ров', inferno)

# ---- Некрополис ----
def necropolis(c):
    base_town(c, 'E', 'e', 'u', 'u', 'z', 'p', 'P')
    for cx in (18, 50, W - 51, W - 19, W // 2):                               # кривые шпили
        c.poly([(cx - 3, H - 68), (cx + 2, H - 96), (cx + 4, H - 68)], 'z')
    for cx in (34, W - 35):                                                   # черепа на стене
        c.skull(cx, H - 22, 7, 'i', 'L', 'I', jaw=False)
add(2, 'town_necropolis', 'Некрополис: чёрно-серый камень, пурпурные окна, черепа, кривые шпили', necropolis)

# ---- Темница ----
def dungeon(c):
    c.rect(0, H - 10, W - 1, H - 1, 'u')
    c.tree_crown(30, H - 60, 30, 'E', 'e', 'u')                               # тёмная скала
    c.tree_crown(W - 32, H - 56, 26, 'E', 'e', 'u')
    base_town(c, 'E', 'e', 'u', 'p', 'P', 'a', 'x')
    c.ellipse(W // 2, H - 6, 18, 22, 'z')                                     # пещерный вход
    for i, (dx, hgt) in enumerate(((-44, 18), (-30, 12), (36, 14), (50, 20))):  # лиловые кристаллы
        c.poly([(W // 2 + dx - 5, H - 8), (W // 2 + dx, H - 8 - hgt), (W // 2 + dx + 5, H - 8)], 'p')
        c.poly([(W // 2 + dx - 2, H - 8), (W // 2 + dx, H - 6 - hgt), (W // 2 + dx + 2, H - 8)], 'a')
add(2, 'town_dungeon', 'Темница: тёмная скала, пещерный вход, пурпурная башня, лиловые кристаллы', dungeon)

# ---- Цитадель ----
def stronghold(c):
    c.rect(0, H - 10, W - 1, H - 1, 'N')
    for x in range(4, W - 4, 9):                                              # частокол из брёвен
        c.rect(x, H - 40, x + 7, H - 6, 'N'); c.rect(x, H - 40, x + 2, H - 6, 'n')
        c.poly([(x, H - 40), (x + 3, H - 47), (x + 7, H - 40)], 'D')
    tower(c, W // 2, H - 6, 22, 72, 'N', 'n', 'D', 'T', 'N', False, 'r', 'f')
    for cx in (28, W - 29):
        c.poly([(cx - 16, H - 6), (cx, H - 54), (cx + 16, H - 6)], 'T')       # шатры
        c.poly([(cx - 12, H - 6), (cx, H - 46), (cx + 4, H - 6)], 'N')
    c.skull(W // 2, H - 60, 10, 'i', 'L', 'I', jaw=False)
    for cx in (12, W - 13):                                                   # черепа на кольях
        c.rect(cx, H - 34, cx + 2, H - 8, 'D'); c.skull(cx + 1, H - 38, 6, 'i', 'L', 'I', jaw=False)
add(3, 'town_stronghold', 'Цитадель: частокол из брёвен, сруб с черепом, шатры, черепа на кольях', stronghold)

# ---- Крепость ----
def fortress(c):
    c.rect(0, H - 14, W - 1, H - 1, 'Q')                                      # зелёная вода
    for x in range(6, W - 6, 11): c.rect(x, H - 12, x + 2, H - 1, 'q')
    for x in range(10, W - 8, 16):                                            # сваи
        c.rect(x, H - 30, x + 3, H - 4, 'D')
    wall(c, H - 44, H - 26, 'N', 'n', 'D', crenel=False)
    for cx, w, h in ((24, 14, 40), (W - 25, 14, 40), (W // 2, 22, 58)):
        c.rect(cx - w, H - 26 - h, cx + w, H - 26, 'N')
        c.rect(cx - w, H - 26 - h, cx - w + 3, H - 26, 'n')
        c.planks(cx - w, H - 26 - h, cx + w, H - 26, 'D', 7)
        c.poly([(cx - w - 5, H - 26 - h), (cx + w + 5, H - 26 - h), (cx, H - 26 - h - h * 0.4)], 'T')  # солома
        c.fur(cx - w - 4, H - 26 - h - int(h * 0.36), cx + w + 4, H - 26 - h, 'N', step=3, length=int(h * 0.36))
        c.rect(cx - 4, H - 26 - h + 12, cx + 3, H - 26 - h + 20, 'f')
add(3, 'town_fortress', 'Крепость: болотное дерево на сваях, соломенные крыши, зелёная вода', fortress)

# ---- Сопряжение ----
def conflux(c):
    base_town(c, 'w', 'L', 'l', 'c', 'C', 'A', 'c')
    for dx, col in ((-52, 'c'), (52, 'F')):                                   # кристаллы на пилонах
        cx = W // 2 + dx
        c.rect(cx - 5, H - 46, cx + 5, H - 8, 'l')
        c.poly([(cx - 7, H - 46), (cx, H - 72), (cx + 7, H - 46)], col)
        c.poly([(cx - 3, H - 46), (cx, H - 66), (cx + 3, H - 46)], 'w')
    for dx, col in ((-30, 'T'), (30, 'l')):                                   # земля и воздух у подножия
        c.ellipse(W // 2 + dx, H - 12, 10, 7, col)
    for dx, dy in ((-66, 34), (60, 44), (-20, 52)):                           # парящие камни
        c.ellipse(W // 2 + dx, H - dy - 40, 7, 4, 'e')
add(3, 'town_conflux', 'Сопряжение: белый донжон, кристаллы стихий на пилонах, парящие камни', conflux)

# ---- Бухта ----
def cove(c):
    c.rect(0, H - 16, W - 1, H - 1, 'Q')
    for x in range(6, W - 6, 11): c.rect(x, H - 14, x + 2, H - 2, 'q')
    base_town(c, 'T', 't', 'N', 'q', 'Q', 'c', 'r')
    for x in range(10, 54, 8): c.rect(x, H - 18, x + 5, H - 14, 'N')          # пирс
    c.rect(26, H - 60, 29, H - 18, 'N')                                       # мачта
    c.poly([(29, H - 58), (52, H - 46), (29, H - 26)], 'w')                   # парус
    c.ellipse(30, H - 18, 16, 6, 'N')
    c.rect(W - 26, H - 74, W - 16, H - 8, 'w')                                # полосатый маяк
    for y in range(H - 72, H - 8, 12): c.rect(W - 26, y, W - 16, y + 5, 'r')
    c.ellipse(W - 21, H - 78, 8, 6, 'f')
add(3, 'town_cove', 'Бухта: корабль с парусом у пирса, песчаный донжон, полосатый маяк', cove)

# ---- Фабрика ----
def factory(c):
    base_town(c, 'R', 'r', 'D', 'O', 'N', 'f', 'y')
    c.ellipse(W // 2, H - 66, 22, 22, 'y')                                    # латунная шестерня
    c.ellipse(W // 2, H - 66, 14, 14, 'Y')
    for i in range(10):
        a = math.pi * 2 * i / 10
        c.rect(W // 2 + math.cos(a) * 22 - 2, H - 66 + math.sin(a) * 22 - 2,
               W // 2 + math.cos(a) * 22 + 2, H - 66 + math.sin(a) * 22 + 2, 'y')
    for cx in (22, W - 23):                                                   # трубы с дымом
        c.rect(cx - 5, H - 76, cx + 5, H - 30, 'E')
        c.rect(cx - 5, H - 76, cx - 3, H - 30, 'e')
        for i in range(3): c.ellipse(cx + i * 3, H - 82 - i * 7, 5 + i, 4 + i * 0.6, 'l')
add(3, 'town_factory', 'Фабрика: латунный корпус с шестернёй, кирпичные цеха, трубы с дымом', factory)

# ---- Улей ----
def hive(c):
    base_town(c, 'T', 'i', 'N', 'H', 'j', 'f', 'h')
    c.ellipse(W // 2, H - 58, 30, 30, 'T')                                    # земляной купол гнезда
    c.ellipse(W // 2 - 6, H - 66, 22, 20, 'i')
    c.ellipse(W // 2 + 10, H - 50, 20, 18, 'N')
    for i, r in enumerate((26, 19, 12)):                                      # соты-ярусы
        for k in range(-2, 3):
            cx = W // 2 + k * r * 0.42
            c.ellipse(cx, H - 58 - i * 12, 4.5, 4, 'f')
            c.ellipse(cx, H - 58 - i * 12, 3, 2.6, 'O')
    c.ellipse(W // 2, H - 24, 9, 8, 'D')                                      # лётное отверстие
    for cx in (20, W - 21):                                                   # хитиновые шпили
        c.poly([(cx - 7, H - 26), (cx + 7, H - 26), (cx, H - 86)], 'H')
        c.poly([(cx - 4, H - 26), (cx + 1, H - 26), (cx - 1, H - 80)], 'h')
        c.ellipse(cx, H - 88, 4, 5, 'f')
add(3, 'town_hive', 'Улей: земляной купол с сотами, лётное отверстие, хитиновые шпили', hive)

for g, title in ((1, 'города на карте (группа 1)'), (2, 'города на карте (группа 2)'), (3, 'города на карте (группа 3)')):
    write('towns_%d' % g, title, [b for gg, b in T if gg == g], 'towns3.py')
