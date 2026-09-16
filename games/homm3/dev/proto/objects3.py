# -*- coding: utf-8 -*-
"""js/view/sprites_objects_{1..6}_hd.js — 114 объектов карты, боя и сцены города в сетке unit 3.

Всё собирается из нескольких общих форм: дом (стена, крыша, дверь, окна), холм шахты,
куча ресурса, святилище, дерево, скала, осадная стена. Приметы объектов сверху.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, write

B = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
def add(g, name, w, h, comment, fn):
    c = Fig(w, h)
    fn(c)
    B[g].append(emit(name, c, comment))

# ---------------------------------------------------------------- общие формы
def house(c, x0, y0, x1, y1, wall, walld, roof, roofd, win='y', door='D', planks=False, gable=0.45):
    """Дом: стена с кладкой или досками, двускатная крыша, дверь, окна с переплётом."""
    c.rect(x0, y0, x1, y1, wall)
    c.rect(x0, y0, x0 + (x1 - x0) * 0.16, y1, walld if planks else wall)
    c.rect(x1 - (x1 - x0) * 0.14, y0, x1, y1, walld)
    if planks: c.planks(x0, y0, x1, y1, walld, 7)
    else:
        for y in range(int(y0) + 7, int(y1), 9): c.rect(x0, y, x1, y, walld)
        for x in range(int(x0) + 6, int(x1), 12): c.rect(x, y0, x + 1, y1, walld)
    hgt = (y1 - y0) * gable
    c.poly([(x0 - 4, y0), (x1 + 4, y0), ((x0 + x1) / 2, y0 - hgt)], roofd)
    c.poly([(x0 - 2, y0 - 1), ((x0 + x1) / 2 + 2, y0 - 1), ((x0 + x1) / 2, y0 - hgt + 3)], roof)
    for y in range(int(y0 - hgt) + 4, int(y0), 6):                       # черепица рядами
        t = (y - (y0 - hgt)) / max(1, hgt)
        c.rect((x0 + x1) / 2 - (x1 - x0) * 0.5 * t - 3, y, (x0 + x1) / 2 + (x1 - x0) * 0.5 * t + 3, y, roofd)
    cx = (x0 + x1) / 2
    c.rect(cx - 6, y1 - (y1 - y0) * 0.5, cx + 5, y1, door)               # дверь
    c.ellipse(cx, y1 - (y1 - y0) * 0.5, 6, 5, door)
    c.ellipse(cx + 3, y1 - (y1 - y0) * 0.25, 1.6, 1.6, 'y')
    for s in (-1, 1):                                                     # окна
        wx = cx + s * (x1 - x0) * 0.3
        c.rect(wx - 4, y0 + 8, wx + 3, y0 + 16, win)
        c.rect(wx - 1, y0 + 8, wx - 1, y0 + 16, walld); c.rect(wx - 4, y0 + 11, wx + 3, y0 + 12, walld)

def hill(c, cx, ybase, w, h, mid, light, dark):
    """Склон у шахты: сплошной овал читался серым пятном — держат форму грани и осыпь."""
    c.ellipse(cx, ybase, w, h, mid)
    c.ellipse(cx - w * 0.2, ybase - h * 0.35, w * 0.7, h * 0.6, light)
    c.ellipse(cx + w * 0.3, ybase + h * 0.2, w * 0.6, h * 0.5, dark)
    for i, (fx, fy, fw, fh) in enumerate(((-0.66, -0.34, 0.24, 0.26), (-0.14, -0.62, 0.28, 0.24),
                                          (0.40, -0.40, 0.26, 0.28), (0.10, -0.22, 0.22, 0.20))):
        c.poly([(cx + w * fx, ybase + h * fy),
                (cx + w * (fx + fw), ybase + h * (fy + fh * 0.35)),
                (cx + w * (fx + fw * 0.45), ybase + h * (fy + fh))], dark if i % 2 else light)
    for i in range(7):                                                  # осыпь по подошве
        a = -0.92 + i * 0.31
        c.ellipse(cx + w * a * 0.92, ybase + h * 0.40, w * 0.05, h * 0.055, dark)

def adit(c, cx, ybase, w, h, frame='N', framed='D'):
    """Штольня: арочный проём, уходящий в темноту, деревянная крепь, распорка и фонарь.

    Глубина — три вложенные арки от светлого к чёрному: без них проём читался просто
    как тёмный прямоугольник, наклеенный на холм.
    """
    def arch(half, top, ch):
        c.rect(cx - half, top, cx + half, ybase, ch)
        c.ellipse(cx, top, half, half * 0.85, ch)
    arch(w, ybase - h, 'E')                                            # обтёсанный камень устья
    arch(w - 3, ybase - h + 4, 'u')                                    # первые метры штрека
    arch(w - 7, ybase - h + 10, 'z')                                   # дальше не видно ничего
    c.rect(cx - w + 3, ybase - 3, cx + w - 3, ybase, 'u')              # пол у входа ловит свет
    c.rect(cx - w + 2, ybase - h + 11, cx + w - 2, ybase - h + 14, framed)   # распорка в глубине
    c.rect(cx - w - 5, ybase - h - 2, cx - w, ybase, frame)            # стойки крепи
    c.rect(cx + w, ybase - h - 2, cx + w + 5, ybase, framed)
    c.planks(cx - w - 5, ybase - h - 2, cx - w, ybase, framed, 8)
    c.rect(cx - w - 8, ybase - h - 8, cx + w + 8, ybase - h - 2, frame)      # перемычка
    c.rect(cx - w - 8, ybase - h - 8, cx + w + 8, ybase - h - 6, 'n')        # светлая кромка бруса
    c.rivets(cx - w - 5, ybase - h - 4, cx + w + 5, 'l', 9)
    c.rect(cx + w + 2, ybase - h - 6, cx + w + 4, ybase - h, framed)         # крюк фонаря
    c.ellipse(cx + w + 3, ybase - h + 3, 3, 3.5, 'f')                        # фонарь у входа
    c.ellipse(cx + w + 3, ybase - h + 2.5, 1.4, 1.8, 'w')


def cart(c, cx, ybase, mid, light, dark):
    """Вагонетка на рельсах: короб досками, светлый верхний борт, колёса, горка руды."""
    c.rect(cx - 13, ybase - 19, cx + 13, ybase - 3, 'N')
    c.planks(cx - 13, ybase - 19, cx + 13, ybase - 3, 'D', 6)
    c.rect(cx - 13, ybase - 19, cx + 13, ybase - 16, 'n')
    c.rect(cx - 13, ybase - 19, cx - 10, ybase - 3, 'n')
    c.rect(cx - 9, ybase - 23, cx + 9, ybase - 17, mid)                      # руда с горкой
    c.ellipse(cx - 4, ybase - 23, 6, 3.5, light)
    c.ellipse(cx + 6, ybase - 22, 5, 3, dark)
    c.rect(cx - 9, ybase - 17, cx + 9, ybase - 17, 'D')                      # шов: груз не сливается с бортом
    for s in (-1, 1):
        c.ellipse(cx + s * 8, ybase, 5, 5, 'E')
        c.ellipse(cx + s * 8, ybase, 2, 2, 'e')


def rails(c, x0, x1, y):
    """Рельсы: шпалы и две нити — они и связывают штольню с вагонеткой."""
    for x in range(int(x0), int(x1), 8): c.rect(x, y - 2, x + 4, y + 1, 'N')
    c.rect(x0, y - 3, x1, y - 2, 'e')
    c.rect(x0, y + 2, x1, y + 3, 'e')

def pile(c, cx, ybase, n, r, mid, light, dark, shape='round'):
    for i in range(n):
        a = i / max(1, n - 1)
        x = cx + (a - 0.5) * r * 2.2
        y = ybase - (0 if i % 2 else r * 0.7)
        if shape == 'round':
            c.ellipse(x, y, r * 0.6, r * 0.55, mid); c.ellipse(x - r * 0.15, y - r * 0.15, r * 0.3, r * 0.25, light)
        elif shape == 'bar':
            c.rect(x - r * 0.6, y - r * 0.4, x + r * 0.6, y + r * 0.4, mid)
            c.rect(x - r * 0.6, y - r * 0.4, x + r * 0.6, y - r * 0.2, light)
            c.rect(x - r * 0.6, y + r * 0.25, x + r * 0.6, y + r * 0.4, dark)
        elif shape == 'crystal':
            c.poly([(x - r * 0.5, y + r * 0.5), (x, y - r * 1.1), (x + r * 0.5, y + r * 0.5)], mid)
            c.poly([(x - r * 0.2, y + r * 0.5), (x, y - r * 0.9), (x + r * 0.1, y + r * 0.5)], light)

def shrine_body(c, cx, ybase, w, h, mid, light, dark, orb=None):
    c.rect(cx - w, ybase - h * 0.5, cx + w, ybase, mid)
    c.rect(cx - w, ybase - h * 0.5, cx - w + 3, ybase, light)
    c.rect(cx - w - 4, ybase - h * 0.58, cx + w + 4, ybase - h * 0.5, light)     # карниз
    c.poly([(cx - w - 4, ybase - h * 0.58), (cx + w + 4, ybase - h * 0.58), (cx, ybase - h)], dark)
    c.poly([(cx - w - 2, ybase - h * 0.6), (cx + 2, ybase - h * 0.6), (cx, ybase - h + 4)], mid)
    c.rect(cx - 5, ybase - h * 0.38, cx + 4, ybase, 'z')
    if orb:
        c.ellipse(cx, ybase - h * 0.78, 6, 6, orb); c.ellipse(cx - 1, ybase - h * 0.8, 3.4, 3.4, 'w')

def treeobj(c, crown, cl, cd, trunk, trunkd, W, H, snow=False, dead=False, palm=False):
    cx = W / 2
    c.bark(cx - 6, H * 0.42, cx + 6, H - 1, trunk, trunkd, trunkd)
    for s in (-1, 1):
        c.line(cx + s * 4, H * 0.5, cx + s * 14, H * 0.36, trunkd, 3)
    if dead:
        for s in (-1, 1):
            c.line(cx + s * 4, H * 0.44, cx + s * 20, H * 0.14, trunkd, 3)
            c.line(cx + s * 14, H * 0.26, cx + s * 22, H * 0.3, trunkd, 2)
    elif palm:
        for i in range(7):
            a = math.pi * (0.12 + i * 0.13)
            c.line(cx, H * 0.4, cx - math.cos(a) * 26, H * 0.4 - math.sin(a) * 22, crown, 4)
            c.line(cx, H * 0.4, cx - math.cos(a) * 24, H * 0.4 - math.sin(a) * 20, cl, 2)
    else:
        c.tree_crown(cx, H * 0.26, W * 0.42, crown, cl, cd)
        if snow:
            for dx in (-0.5, 0, 0.45):
                c.ellipse(cx + W * 0.42 * dx, H * 0.26 - W * 0.24, W * 0.2, W * 0.1, 'L')

# ================================================================ группа 1
RES = [('gold', 'y', 'f', 'Y', 'bar'), ('wood', 'n', 'T', 'N', 'bar'), ('ore', 'e', 'l', 'E', 'round'),
       ('mercury', 'C', 'c', 'Q', 'round'), ('sulfur', 'f', 'w', 'o', 'round'),
       ('crystal', 'c', 'w', 'C', 'crystal'), ('gems', 'g', 'h', 'G', 'crystal')]
for rid, mid, light, dark, shape in RES:
    def mk(c, mid=mid, light=light, dark=dark, shape=shape):
        hill(c, 46, 56, 42, 30, 'e', 'l', 'E')
        rails(c, 26, 92, 66)
        adit(c, 34, 66, 12, 22)
        cart(c, 70, 66, mid, light, dark)
        pile(c, 14, 74, 3, 8, mid, light, dark, shape)
    add(1, 'mine_' + rid, 96, 84, 'шахта (%s): холм, штольня с крепью, вагонетка, куча ресурса' % rid, mk)
for rid, mid, light, dark, shape in RES:
    def mk(c, mid=mid, light=light, dark=dark, shape=shape):
        pile(c, 22, 30, 4, 10, mid, light, dark, shape)
    add(1, 'res_' + rid, 44, 38, 'ресурс (%s): куча' % rid, mk)
def chest(c):
    c.rect(8, 18, 42, 36, 'N'); c.planks(8, 18, 42, 36, 'D', 6)
    c.ellipse(25, 18, 17, 9, 'n'); c.ellipse(25, 16, 14, 6, 'T')
    c.rect(8, 22, 42, 25, 'y'); c.rect(20, 16, 30, 28, 'y'); c.rect(23, 20, 27, 26, 'Y')
add(1, 'chest', 50, 38, 'сундук: доски, кованые полосы, замок', chest)
def campfire(c):
    for i in range(4): c.line(8 + i * 8, 48, 26 + i * 4, 40, 'N', 3)
    c.flame(26, 46, 26, 34, 'f', 'F', 'O', 5)
    for x in range(6, 46, 7): c.ellipse(x, 50, 4, 2.4, 'E')
add(1, 'campfire', 50, 54, 'костёр: поленья, языки пламени, камни по кругу', campfire)
def artifact(c):
    c.ellipse(21, 26, 12, 12, 'y'); c.ellipse(21, 26, 8, 8, 'Y')
    c.ellipse(21, 24, 5, 5, 'a'); c.ellipse(20, 23, 2.4, 2.4, 'w')
    c.rect(14, 34, 28, 40, 'Y'); c.rect(14, 34, 28, 36, 'y')
add(1, 'artifact', 44, 42, 'артефакт: золотая оправа с самоцветом на подставке', artifact)

# ================================================================ группа 2
for i in range(1, 8):
    def mk(c, i=i):
        house(c, 14, 40, 78, 72, 'T', 'N', 'r' if i < 4 else 'b', 'R' if i < 4 else 'B', 'f', 'D')
        for k in range(i):                                                 # флажки по уровню жилища
            c.rect(20 + k * 9, 24, 21 + k * 9, 34, 'u')
            c.poly([(21 + k * 9, 24), (28 + k * 9, 27), (21 + k * 9, 30)], 'y')
    add(2, 'dwelling_%d' % i, 94, 92, 'жилище %d уровня: дом с крышей, окна, флажки по уровню' % i, mk)
def bank_crypt(c):
    hill(c, 60, 70, 46, 18, 'E', 'e', 'u')
    c.rect(38, 30, 82, 72, 'E'); c.planks(38, 30, 82, 72, 'u', 9)
    c.poly([(34, 30), (86, 30), (60, 12)], 'u')
    c.rect(52, 46, 68, 72, 'z'); c.ellipse(60, 46, 8, 7, 'z')
    c.skull(60, 24, 9, 'i', 'L', 'I', jaw=False)
    for x in (24, 96): c.rect(x, 52, x + 6, 74, 'I'); c.skull(x + 3, 48, 6, 'i', 'L', 'I', jaw=False)
add(2, 'bank_crypt', 124, 78, 'склеп: курган, каменный вход, череп над проёмом, кости по бокам', bank_crypt)
def bank_dwarven(c):
    hill(c, 60, 88, 52, 24, 'T', 't', 'N')
    c.rect(34, 40, 86, 90, 'e'); c.rect(34, 40, 40, 90, 'l')
    for y in range(46, 90, 10): c.rect(34, y, 86, y + 1, 'E')
    c.rect(48, 58, 72, 90, 'N'); c.planks(48, 58, 72, 90, 'D', 7)
    c.rect(44, 54, 76, 58, 'y'); c.ellipse(60, 54, 16, 6, 'y')
    for x in (40, 80): c.rect(x - 4, 36, x + 4, 44, 'y')
add(2, 'bank_dwarven', 124, 96, 'гномья сокровищница: каменный фасад, дубовые ворота с золотой оковкой', bank_dwarven)
def bank_griffin(c):
    hill(c, 58, 98, 50, 20, 'e', 'l', 'E')
    c.rect(30, 44, 86, 100, 'l'); c.rect(30, 44, 36, 100, 'w')
    for y in range(50, 100, 11): c.rect(30, y, 86, y + 1, 'e')
    for x in (38, 58, 78): c.rect(x - 5, 52, x + 5, 100, 'w'); c.rect(x - 5, 52, x - 3, 100, 'L')
    c.poly([(24, 44), (92, 44), (58, 20)], 'e')
    c.poly([(30, 42), (60, 42), (58, 24)], 'l')
    c.wing_feather(58, 30, 26, 18, 'e', 'l', 'w', 'E', n=6)
add(2, 'bank_griffin', 120, 108, 'башня грифонов: колоннада, фронтон, крыло над входом', bank_griffin)
def bank_utopia(c):
    hill(c, 72, 112, 64, 26, 'T', 't', 'N')
    c.rect(30, 46, 114, 114, 'y'); c.rect(30, 46, 38, 114, 'f')
    for y in range(54, 114, 12): c.rect(30, y, 114, y + 1, 'Y')
    c.rect(60, 70, 86, 114, 'z'); c.ellipse(73, 70, 13, 11, 'z')
    c.poly([(24, 46), (120, 46), (72, 16)], 'Y')
    c.poly([(32, 44), (74, 44), (72, 22)], 'y')
    for x in (44, 100): c.horns(x, 44, 18, 'Y', 'y', spread=5, curve=4)
    c.ellipse(72, 34, 9, 9, 'r'); c.ellipse(70, 32, 4.5, 4.5, 'f')
add(2, 'bank_utopia', 148, 124, 'драконья утопия: золотой фасад, рога, самоцвет во фронтоне', bank_utopia)
def hill_fort(c):
    hill(c, 50, 78, 46, 20, 'T', 't', 'N')
    for x in range(12, 90, 9):
        c.rect(x, 44, x + 7, 78, 'N'); c.rect(x, 44, x + 2, 78, 'n')
        c.poly([(x, 44), (x + 3, 38), (x + 7, 44)], 'D')
    c.rect(38, 52, 62, 78, 'D'); c.rect(34, 30, 38, 52, 'N')
    c.poly([(38, 30), (52, 34), (38, 38)], 'r')
add(2, 'hill_fort', 100, 84, 'холм-крепость: частокол на холме, ворота, знамя', hill_fort)
def arena(c):
    c.ellipse(48, 48, 46, 14, 'T'); c.ellipse(48, 44, 40, 11, 't')
    for i in range(14):
        a = math.pi * i / 13
        c.rect(48 - math.cos(a) * 44 - 3, 44 - math.sin(a) * 12 - 10, 48 - math.cos(a) * 44 + 3, 44 - math.sin(a) * 12, 'e')
    c.poly([(36, 40), (48, 18), (60, 40)], 'e')
    c.rect(40, 26, 44, 42, 'l'); c.rect(52, 26, 56, 42, 'l')
add(2, 'arena', 98, 60, 'арена: овал трибун, колонны, ворота бойцов', arena)
def mercenary_camp(c):
    c.poly([(8, 70), (36, 20), (64, 70)], 'T'); c.poly([(16, 70), (36, 28), (44, 70)], 'N')
    c.rect(30, 50, 42, 70, 'D')
    c.rect(35, 12, 37, 22, 'N'); c.poly([(37, 12), (50, 16), (37, 20)], 'r')
    for x in (52, 62): c.rect(x, 44, x + 2, 70, 'N'); c.poly([(x - 4, 44), (x + 1, 34), (x + 6, 44)], 'e')
add(2, 'mercenary_camp', 76, 76, 'лагерь наёмников: шатёр, знамя, копья в козлах', mercenary_camp)
def trading_post(c):
    house(c, 8, 26, 58, 58, 'n', 'N', 'r', 'R', 'y', 'D', planks=True)
    c.rect(4, 22, 62, 26, 'N')
    for x in range(8, 58, 8): c.ellipse(x, 62, 5, 4, 'T')
    c.rect(60, 34, 70, 58, 'N'); c.planks(60, 34, 70, 58, 'D', 6)
add(2, 'trading_post', 76, 64, 'торговый пост: сруб с навесом, мешки и бочки у стены', trading_post)
def tavern(c):
    house(c, 10, 34, 72, 78, 'T', 'N', 'r', 'R', 'f', 'D', planks=True)
    c.rect(56, 18, 60, 36, 'N')
    c.rect(62, 20, 78, 32, 'n'); c.ellipse(70, 26, 6, 5, 'y')
    for x in range(14, 70, 12): c.ellipse(x, 82, 6, 5, 'N')
add(2, 'tavern', 84, 86, 'таверна: сруб, вывеска с кружкой, бочки у стены', tavern)

# ================================================================ группа 3
def simple(name, g, W, H, comment, fn):
    add(g, name, W, H, comment, fn)
simple('learning_stone', 3, 66, 74, 'камень знаний: валун с рунами и свечением', lambda c: (
    c.ellipse(32, 52, 26, 22, 'e'), c.ellipse(26, 44, 18, 14, 'l'),
    [c.rect(20 + i * 8, 40 + (i % 2) * 8, 24 + i * 8, 44 + (i % 2) * 8, 'c') for i in range(4)],
    c.ellipse(32, 30, 12, 5, 'c')))
for i, col in ((1, 'b'), (2, 'r'), (3, 'p')):
    simple('shrine_%d' % i, 3, 70, 76, 'святилище %d: каменный алтарь, шар' % i,
           lambda c, col=col: shrine_body(c, 34, 70, 22, 50, 'e', 'l', 'E', orb=col))
simple('magic_well', 3, 72, 72, 'колодец: каменное кольцо, навес, ведро на цепи', lambda c: (
    c.ellipse(34, 60, 24, 12, 'e'), c.ellipse(34, 56, 18, 9, 'z'),
    c.rect(14, 30, 18, 60, 'N'), c.rect(50, 30, 54, 60, 'N'),
    c.poly([(8, 30), (60, 30), (34, 12)], 'R'),
    c.rect(30, 32, 38, 42, 'N'), c.rect(33, 42, 35, 54, 'E')))
simple('fountain_fortune', 3, 70, 76, 'фонтан удачи: чаша, струи, монеты на дне', lambda c: (
    c.ellipse(34, 66, 28, 12, 'l'), c.ellipse(34, 62, 22, 9, 'c'),
    c.rect(30, 34, 38, 62, 'l'), c.ellipse(34, 32, 16, 7, 'l'),
    [c.line(34, 32, 34 + (i - 1) * 14, 56, 'c', 2) for i in range(3)],
    [c.ellipse(24 + i * 8, 64, 3, 2, 'y') for i in range(3)]))
simple('temple', 3, 70, 74, 'храм: колонны, фронтон, алтарь', lambda c: (
    c.rect(6, 66, 62, 72, 'l'),
    [c.rect(10 + i * 12, 30, 18 + i * 12, 66, 'w') for i in range(5)],
    [c.rect(10 + i * 12, 30, 12 + i * 12, 66, 'L') for i in range(5)],
    c.poly([(2, 30), (66, 30), (34, 10)], 'l'), c.poly([(8, 28), (36, 28), (34, 14)], 'w'),
    c.rect(28, 20, 40, 24, 'y')))
simple('rally_flag', 3, 62, 74, 'сборный флаг: древко, знамя, барабан', lambda c: (
    c.rect(28, 8, 32, 70, 'N'), c.rect(28, 8, 29, 70, 'n'),
    c.poly([(32, 10), (58, 18), (32, 30)], 'r'), c.poly([(32, 12), (52, 18), (32, 26)], 'o'),
    c.ellipse(18, 66, 12, 8, 'T'), c.rect(6, 60, 30, 66, 'N')))
simple('oasis', 3, 74, 76, 'оазис: пальмы, вода, песчаный вал', lambda c: (
    c.ellipse(36, 66, 32, 10, 'T'), c.ellipse(36, 62, 22, 7, 'C'), c.ellipse(36, 60, 16, 5, 'c'),
    c.bark(14, 30, 20, 62, 'n', 'T', 'N'),
    [c.line(17, 30, 17 - math.cos(math.pi * (0.1 + i * 0.16)) * 18, 30 - math.sin(math.pi * (0.1 + i * 0.16)) * 16, 'G', 3) for i in range(6)],
    c.bark(52, 38, 57, 62, 'n', 'T', 'N'),
    [c.line(54, 38, 54 - math.cos(math.pi * (0.1 + i * 0.16)) * 14, 38 - math.sin(math.pi * (0.1 + i * 0.16)) * 12, 'g', 2) for i in range(6)]))
simple('witch_hut', 3, 66, 74, 'хижина ведьмы: кривой сруб на курьих ножках, котёл', lambda c: (
    house(c, 12, 28, 54, 58, 'N', 'D', 'j', 'G', 'f', 'z', planks=True),
    c.line(22, 58, 18, 72, 'N', 4), c.line(44, 58, 48, 72, 'N', 4),
    c.ellipse(18, 72, 6, 3, 'D'), c.ellipse(48, 72, 6, 3, 'D'),
    c.ellipse(33, 22, 6, 4, 'u')))
simple('star_axis', 3, 66, 72, 'звёздная ось: каменное кольцо со сферой', lambda c: (
    c.rect(10, 60, 56, 68, 'e'),
    [c.rect(14 + i * 18, 34, 22 + i * 18, 60, 'l') for i in range(3)],
    c.ellipse(33, 30, 24, 8, 'e'), c.ellipse(33, 22, 12, 12, 'b'), c.ellipse(30, 19, 6, 6, 'c'),
    [c.ellipse(33 + math.cos(math.pi * i / 3) * 24, 30 - math.sin(math.pi * i / 3) * 12, 2.4, 2.4, 'w') for i in range(4)]))
simple('garden_revelation', 3, 76, 74, 'сад откровений: живая изгородь, арка, цветы', lambda c: (
    [c.tree_crown(12 + i * 18, 52, 12, 'G', 'g', 'j') for i in range(4)],
    c.rect(28, 34, 34, 70, 'l'), c.rect(44, 34, 50, 70, 'l'), c.ellipse(39, 34, 16, 8, 'l'),
    [c.ellipse(10 + i * 11, 68, 3, 2.4, 'm' if i % 2 else 'A') for i in range(6)]))
simple('tree_knowledge', 3, 78, 96, 'древо знаний: толстый ствол с дуплом, пышная крона, свиток', lambda c: (
    c.bark(30, 42, 46, 94, 'n', 'T', 'N'), c.ellipse(38, 62, 6, 8, 'D'),
    c.tree_crown(38, 30, 32, 'G', 'g', 'j'),
    c.rect(48, 56, 60, 70, 'i'), c.rect(48, 56, 60, 58, 'L')))
simple('windmill', 3, 76, 100, 'мельница: башня, лопасти, дверь', lambda c: (
    c.poly([(20, 96), (56, 96), (50, 36), (26, 36)], 'e'),
    c.poly([(20, 96), (34, 96), (32, 36), (26, 36)], 'l'),
    [c.rect(20, y, 56, y + 1, 'E') for y in range(44, 96, 10)],
    c.poly([(22, 36), (54, 36), (38, 18)], 'N'),
    c.rect(32, 70, 44, 96, 'N'),
    [c.line(38, 30, 38 + math.cos(math.pi * i / 2 + 0.4) * 30, 30 + math.sin(math.pi * i / 2 + 0.4) * 30, 'n', 4) for i in range(4)],
    [c.line(38, 30, 38 + math.cos(math.pi * i / 2 + 0.4) * 28, 30 + math.sin(math.pi * i / 2 + 0.4) * 28, 'T', 2) for i in range(4)]))
simple('observatory', 3, 64, 100, 'обсерватория: башня, купол с щелью, телескоп', lambda c: (
    c.rect(16, 40, 48, 98, 'l'), c.rect(16, 40, 22, 98, 'w'),
    [c.rect(16, y, 48, y + 1, 'e') for y in range(48, 98, 11)],
    c.rect(26, 74, 38, 98, 'N'),
    c.ellipse(32, 40, 22, 16, 'e'), c.ellipse(26, 34, 14, 10, 'l'),
    c.rect(30, 24, 36, 40, 'u'), c.rect(34, 18, 52, 28, 'E'), c.rect(34, 18, 52, 21, 'e')))
simple('water_wheel', 3, 88, 86, 'водяное колесо: сруб, колесо с лопастями, поток', lambda c: (
    house(c, 30, 34, 84, 76, 'n', 'N', 'r', 'R', 'f', 'D', planks=True),
    c.rect(0, 70, 30, 84, 'C'), c.rect(0, 70, 30, 74, 'c'),
    c.ellipse(20, 56, 20, 20, 'N'), c.ellipse(20, 56, 14, 14, 'D'),
    [c.line(20, 56, 20 + math.cos(math.pi * i / 4) * 20, 56 + math.sin(math.pi * i / 4) * 20, 'n', 3) for i in range(8)]))
simple('marletto_tower', 3, 52, 100, 'башня Марлетто: узкая башня, зубцы, знамя', lambda c: (
    c.rect(12, 30, 40, 98, 'e'), c.rect(12, 30, 18, 98, 'l'),
    [c.rect(12, y, 40, y + 1, 'E') for y in range(38, 98, 11)],
    [c.rect(12 + i * 8, 22, 17 + i * 8, 30, 'e') for i in range(4)],
    c.rect(22, 44, 30, 56, 'y'), c.rect(20, 76, 32, 98, 'N'),
    c.rect(26, 6, 28, 22, 'u'), c.poly([(28, 6), (44, 11), (28, 16)], 'b')))
simple('seer_hut', 3, 72, 72, 'хижина провидца: круглая хижина, соломенная крыша, кристалл у двери', lambda c: (
    c.ellipse(34, 60, 28, 16, 'T'), c.rect(10, 40, 58, 66, 'T'),
    c.planks(10, 40, 58, 66, 'N', 8),
    c.poly([(4, 40), (64, 40), (34, 14)], 'y'),
    c.fur(6, 16, 62, 40, 'Y', step=4, length=24),
    c.rect(28, 50, 40, 66, 'D'),
    c.poly([(58, 62), (62, 44), (66, 62)], 'a')))
simple('quest_guard', 3, 66, 66, 'страж-квест: каменный столб с рунами и щитом', lambda c: (
    c.rect(22, 24, 42, 62, 'e'), c.rect(22, 24, 27, 62, 'l'),
    [c.rect(22, y, 42, y + 1, 'E') for y in range(32, 62, 9)],
    c.ellipse(32, 20, 12, 8, 'e'),
    c.shield_round(32, 40, 9, 'b', 'B', 'y', 'l', 'w')))
simple('keymaster', 3, 82, 70, 'хранитель ключа: шатёр с вымпелом и большим ключом', lambda c: (
    c.poly([(8, 66), (40, 18), (72, 66)], 'p'), c.poly([(18, 66), (40, 26), (48, 66)], 'P'),
    c.rect(34, 46, 46, 66, 'z'),
    c.rect(39, 8, 41, 20, 'u'), c.poly([(41, 8), (56, 13), (41, 18)], 'y'),
    c.ellipse(62, 44, 7, 7, 'y'), c.rect(62, 44, 76, 48, 'y'), c.rect(70, 48, 72, 54, 'y')))
simple('border_guard', 3, 88, 78, 'пограничный страж: каменные ворота с цепью и печатью', lambda c: (
    c.rect(6, 24, 26, 74, 'e'), c.rect(58, 24, 78, 74, 'e'),
    c.rect(6, 24, 12, 74, 'l'), c.rect(58, 24, 64, 74, 'l'),
    [c.rect(6, y, 26, y + 1, 'E') for y in range(32, 74, 10)],
    [c.rect(58, y, 78, y + 1, 'E') for y in range(32, 74, 10)],
    c.rect(6, 16, 78, 24, 'e'), c.rect(6, 16, 78, 19, 'l'),
    [c.ellipse(28 + i * 7, 34, 3.4, 3.4, 'E') for i in range(5)],
    c.ellipse(42, 48, 10, 10, 'y'), c.ellipse(42, 48, 6, 6, 'Y')))
simple('pandora_box', 3, 58, 42, 'ящик Пандоры: окованный ларец со свечением из щели', lambda c: (
    c.rect(8, 16, 48, 38, 'P'), c.planks(8, 16, 48, 38, 'x', 6),
    c.ellipse(28, 16, 20, 9, 'p'),
    c.rect(8, 20, 48, 23, 'y'), c.rect(24, 14, 32, 28, 'y'),
    c.rect(10, 12, 46, 16, 'A')))

# ================================================================ группа 4
TREES = [('tree_1', 'G', 'g', 'j', 'n', 'N', 56, 82, {}), ('tree_2', 'g', 'h', 'G', 'n', 'N', 68, 88, {}),
         ('tree_3', 'j', 'G', 'D', 'N', 'D', 54, 76, {}), ('tree_pine', 'G', 'j', 'D', 'N', 'D', 54, 88, {}),
         ('tree_snow', 'G', 'g', 'j', 'N', 'D', 54, 88, {'snow': True}),
         ('tree_dead', 'N', 'n', 'D', 'N', 'D', 56, 76, {'dead': True}),
         ('tree_swamp', 'H', 'h', 'j', 'd', 'D', 68, 82, {}),
         ('tree_palm', 'g', 'h', 'G', 'n', 'N', 62, 88, {'palm': True})]
for nm, cr, cl, cd, tr, trd, w, h, kw in TREES:
    add(4, nm, w, h, '%s: крона комьями, кора бороздами' % nm, lambda c, a=(cr, cl, cd, tr, trd, w, h, kw): treeobj(c, a[0], a[1], a[2], a[3], a[4], a[5], a[6], **a[7]))
for nm, mid, light, dark in (('mountain_1', 'e', 'l', 'E'), ('mountain_2', 'T', 't', 'N'), ('mountain_lava', 'u', 'E', 'z')):
    def mk(c, mid=mid, light=light, dark=dark, nm=nm):
        c.poly([(4, 90), (34, 14), (60, 90)], mid); c.poly([(10, 90), (34, 22), (40, 90)], light)
        c.poly([(48, 90), (72, 34), (96, 90)], dark); c.poly([(52, 90), (72, 42), (78, 90)], mid)
        if nm == 'mountain_lava':
            c.line(34, 20, 28, 60, 'F', 2); c.line(72, 40, 78, 72, 'F', 2)
        else:
            c.poly([(26, 34), (34, 14), (42, 34)], 'L'); c.poly([(64, 48), (72, 34), (80, 48)], 'L')
    add(4, nm, 100, 92, '%s: два пика, светлая и теневая грань' % nm, mk)
for nm, w, h, r in (('rock_1', 42, 30, 16), ('rock_2', 46, 28, 18)):
    add(4, nm, w, h, '%s: валун с гранями' % nm, lambda c, w=w, h=h, r=r: (
        c.ellipse(w / 2, h - 6, r, r * 0.6, 'e'), c.ellipse(w / 2 - r * 0.3, h - 10, r * 0.6, r * 0.4, 'l'),
        c.ellipse(w / 2 + r * 0.4, h - 4, r * 0.5, r * 0.3, 'E')))
add(4, 'crystal_rock', 50, 46, 'кристальная скала: друза лиловых кристаллов', lambda c: (
    c.ellipse(24, 42, 20, 6, 'E'),
    [c.poly([(10 + i * 8, 42), (13 + i * 8, 42 - (14 + (i % 3) * 8)), (18 + i * 8, 42)], 'a') for i in range(4)],
    [c.poly([(12 + i * 8, 42), (14 + i * 8, 42 - (11 + (i % 3) * 7)), (16 + i * 8, 42)], 'A') for i in range(4)]))
OBST = [('obst_rock', 82, 64, 'e', 'l', 'E'), ('obst_stump', 82, 52, 'N', 'n', 'D'),
        ('obst_bush', 82, 62, 'G', 'g', 'j'), ('obst_bones', 82, 60, 'i', 'L', 'I'),
        ('obst_lava', 80, 38, 'F', 'f', 'R'), ('obst_ice', 82, 62, 'c', 'w', 'C')]
for nm, w, h, mid, light, dark in OBST:
    def mk(c, nm=nm, w=w, h=h, mid=mid, light=light, dark=dark):
        if nm == 'obst_bones':
            c.ribcage(w / 2, h - 18, 34, 24, mid, dark, n=4); c.skull(w / 2 - 24, h - 10, 9, mid, light, dark)
        elif nm == 'obst_lava':
            for i in range(4): c.ellipse(12 + i * 18, h - 10, 12, 6, mid); c.ellipse(12 + i * 18, h - 12, 8, 4, light)
        elif nm == 'obst_stump':
            c.ellipse(w / 2, h - 10, 22, 12, mid); c.ellipse(w / 2, h - 16, 18, 9, light)
            for i in range(3): c.ellipse(w / 2, h - 16, 14 - i * 5, 7 - i * 2.4, dark if i % 2 else light)
        else:
            for i, (dx, r) in enumerate(((-22, 16), (0, 20), (20, 14))):
                c.ellipse(w / 2 + dx, h - 12 - (r * 0.3), r, r * 0.8, mid)
                c.ellipse(w / 2 + dx - r * 0.3, h - 16 - (r * 0.3), r * 0.55, r * 0.45, light)
    add(4, nm, w, h, '%s: препятствие поля боя' % nm, mk)
add(4, 'subter_gate', 64, 64, 'вход в подземелье: скальный проём с лиловым свечением', lambda c: (
    c.ellipse(30, 56, 30, 16, 'E'), c.ellipse(30, 42, 26, 24, 'e'),
    c.ellipse(30, 46, 16, 18, 'z'), c.ellipse(30, 48, 11, 13, 'P'), c.ellipse(30, 50, 6, 8, 'a'),
    [c.poly([(6 + i * 12, 58), (9 + i * 12, 44), (14 + i * 12, 58)], 'E') for i in range(5)]))

# ================================================================ группа 5 (осада, море, машины)
def siege_wall(c, dmg=0):
    c.rect(6, 20, 84, 130, 'e'); c.rect(6, 20, 14, 130, 'l')
    for y in range(28, 130, 12): c.rect(6, y, 84, y + 1, 'E')
    for x in range(12, 84, 16): c.rect(x, 20, x + 2, 130, 'E')
    for x in range(6, 84, 16): c.rect(x, 8, x + 9, 20, 'e'); c.rect(x, 8, x + 9, 11, 'l')
    if dmg:
        for i in range(dmg * 3):
            c.ellipse(20 + (i * 23) % 60, 40 + (i * 31) % 70, 7, 6, '.')
add(5, 'wall_ok', 92, 134, 'стена: кладка швами, зубцы', lambda c: siege_wall(c, 0))
add(5, 'wall_dmg', 92, 134, 'стена повреждённая: проломы в кладке', lambda c: siege_wall(c, 2))
add(5, 'wall_broken', 92, 52, 'стена разрушенная: обломки кладки', lambda c: (
    c.rect(6, 30, 84, 48, 'e'), c.rect(6, 30, 14, 48, 'l'),
    [c.rect(6, y, 84, y + 1, 'E') for y in range(36, 48, 8)],
    [c.ellipse(14 + i * 14, 28, 8, 5, 'e') for i in range(5)]))
add(5, 'gate', 92, 134, 'ворота: створки с полосами и заклёпками в каменной арке', lambda c: (
    siege_wall(c, 0), c.rect(22, 60, 70, 130, 'N'), c.planks(22, 60, 70, 130, 'D', 10),
    c.ellipse(46, 60, 24, 20, 'N'),
    [c.rect(22, y, 70, y + 3, 'E') for y in (74, 100)], c.rect(45, 60, 47, 130, 'E'),
    c.rivets(26, 76, 66, 'l', 9)))
add(5, 'gate_broken', 92, 134, 'ворота выбитые: створки сорваны, проём открыт', lambda c: (
    siege_wall(c, 0), c.rect(22, 60, 70, 130, 'z'), c.ellipse(46, 60, 24, 20, 'z'),
    c.poly([(22, 130), (34, 60), (30, 130)], 'N'), c.poly([(70, 130), (60, 66), (64, 130)], 'N')))
add(5, 'siege_tower', 88, 158, 'осадная башня: ярусы на колёсах, мостик, щиты', lambda c: (
    [c.rect(10, 20 + i * 42, 76, 58 + i * 42, 'N') for i in range(3)],
    [c.planks(10, 20 + i * 42, 76, 58 + i * 42, 'D', 9) for i in range(3)],
    c.rect(4, 14, 82, 22, 'N'),
    [c.shield_round(20 + i * 24, 40, 9, 'r', 'R', 'y', 'l', 'w') for i in range(3)],
    [c.ellipse(20 + i * 44, 150, 13, 13, 'D') for i in range(2)],
    [c.ellipse(20 + i * 44, 150, 6, 6, 'N') for i in range(2)]))
add(5, 'moat', 90, 46, 'ров: тёмная вода с кольями', lambda c: (
    c.ellipse(44, 30, 42, 14, 'Q'), c.ellipse(44, 26, 36, 10, 'q'),
    [c.poly([(10 + i * 11, 34), (13 + i * 11, 16), (16 + i * 11, 34)], 'N') for i in range(7)]))
def boat(c):
    """Лодка носом вправо: корпус со скулой, грот за мачтой, кливер на носу.

    Прежний парус был треугольничком в четверть корпуса и читался как флажок —
    у лодки силуэт держит именно парус, он должен быть выше и шире борта.
    """
    c.poly([(5, 38), (72, 32), (70, 44), (59, 54), (18, 54), (5, 44)], 'N')     # корпус
    c.poly([(5, 38), (72, 32), (72, 36), (5, 42)], 'n')                         # планширь
    c.planks(9, 43, 64, 54, 'D', 5)
    c.rect(66, 34, 70, 46, 'D')                                                 # тень под скулой
    c.rect(3, 28, 8, 40, 'N')                                                   # ахтерштевень
    c.rect(43, 4, 46, 44, 'N'); c.rect(43, 4, 43, 44, 'n')                      # мачта
    c.rect(13, 43, 45, 45, 'N')                                                 # гик
    c.line(45, 7, 71, 31, 'D', 1)                                               # штаг
    c.poly([(45, 9), (70, 31), (61, 34), (45, 22)], 'L')                        # кливер
    c.poly([(45, 18), (57, 28), (61, 34), (45, 22)], 'e')
    c.poly([(43, 6), (33, 13), (24, 25), (17, 37), (15, 43), (43, 43)], 'w')    # грот с пузом
    c.poly([(19, 35), (16, 42), (43, 43), (43, 36)], 'l')                       # тень по нижней шкаторине
    c.line(43, 14, 31, 17, 'l'); c.line(43, 24, 24, 28, 'l')                    # швы полотнищ
    c.line(43, 33, 18, 38, 'l')
    c.poly([(43, 2), (30, 5), (43, 8)], 'r')                                    # вымпел сносит назад
add(5, 'boat', 78, 56, 'лодка: корпус со скулой, грот и кливер, вымпел', boat)
add(5, 'shipyard', 64, 50, 'верфь: помост, каркас лодки, брёвна', lambda c: (
    c.rect(2, 36, 62, 44, 'N'), c.planks(2, 36, 62, 44, 'D', 5),
    [c.line(12 + i * 9, 34, 14 + i * 9, 18, 'n', 2) for i in range(5)],
    c.ellipse(32, 18, 24, 6, 'N'),
    [c.ellipse(8 + i * 7, 48, 4, 3, 'T') for i in range(3)]))
add(5, 'flotsam', 56, 44, 'обломки: доски и бочка на воде', lambda c: (
    c.ellipse(28, 38, 26, 6, 'q'),
    [c.rect(6 + i * 11, 28 + (i % 2) * 5, 22 + i * 11, 33 + (i % 2) * 5, 'N') for i in range(3)],
    c.ellipse(40, 28, 8, 9, 'n'), c.rect(32, 24, 48, 26, 'E')))
add(5, 'sea_chest', 58, 40, 'морской сундук: окованный ларец в водорослях', lambda c: (
    c.rect(10, 16, 48, 34, 'N'), c.planks(10, 16, 48, 34, 'D', 6),
    c.ellipse(29, 16, 19, 9, 'n'), c.rect(10, 20, 48, 23, 'y'), c.rect(25, 14, 33, 26, 'y'),
    [c.line(6 + i * 12, 36, 10 + i * 12, 26, 'G', 2) for i in range(4)]))
add(5, 'ballista', 54, 58, 'баллиста: станина, лук, стрела, колёса', lambda c: (
    c.rect(8, 34, 46, 40, 'N'), c.planks(8, 34, 46, 40, 'D', 5),
    c.bow(30, 8, 34, 'n', 'N', 'l'), c.rect(12, 18, 40, 22, 'N'),
    c.poly([(40, 16), (50, 20), (40, 24)], 'e'),
    [c.ellipse(14 + i * 22, 46, 9, 9, 'D') for i in range(2)],
    [c.ellipse(14 + i * 22, 46, 4, 4, 'N') for i in range(2)]))
add(5, 'first_aid_tent', 52, 50, 'палатка лекаря: шатёр с красным крестом, сумка', lambda c: (
    c.poly([(4, 46), (25, 10), (46, 46)], 'w'), c.poly([(12, 46), (25, 16), (30, 46)], 'l'),
    c.rect(18, 30, 32, 46, 'l'), c.rect(22, 20, 27, 34, 'r'), c.rect(17, 25, 32, 29, 'r'),
    c.ellipse(44, 44, 7, 5, 'N')))
add(5, 'ammo_cart', 52, 48, 'повозка с боеприпасом: борта, бочки, колёса', lambda c: (
    c.rect(6, 20, 46, 36, 'N'), c.planks(6, 20, 46, 36, 'D', 6),
    [c.ellipse(14 + i * 12, 18, 7, 8, 'n') for i in range(3)],
    [c.rect(8 + i * 12, 14, 20 + i * 12, 16, 'E') for i in range(3)],
    [c.ellipse(14 + i * 22, 40, 8, 8, 'D') for i in range(2)],
    [c.ellipse(14 + i * 22, 40, 4, 4, 'N') for i in range(2)]))

# ================================================================ группа 6 (сцена города)
def bld(name, w, h, comment, fn): add(6, name, w, h, comment, fn)
for i, (w, h) in enumerate(((124, 108), (136, 130), (154, 136), (166, 170)), 1):
    def mk(c, i=i, w=w, h=h):
        house(c, 12, h * 0.42, w - 13, h - 4, 'l', 'e', 'b', 'B', 'y', 'D')
        for k in range(i):
            tx = 24 + k * (w - 48) / max(1, i - 1 if i > 1 else 1)
            c.rect(tx - 7, h * 0.2, tx + 7, h * 0.44, 'l'); c.rect(tx - 7, h * 0.2, tx - 4, h * 0.44, 'w')
            c.poly([(tx - 10, h * 0.2), (tx + 10, h * 0.2), (tx, h * 0.06)], 'B')
        c.rect(w / 2 - 12, h * 0.5, w / 2 + 11, h - 4, 'D')
    bld('bld_hall_%d' % i, w, h, 'ратуша %d уровня: башенки по уровню, ворота' % i, mk)
for nm, hgt, comment in (('bld_fort', 94, 'форт: стена с зубцами'), ('bld_citadel', 130, 'цитадель: стена с башнями'),
                         ('bld_castle', 172, 'замок: стена, башни, донжон')):
    def mk(c, hgt=hgt, nm=nm):
        c.rect(4, hgt - 56, 288, hgt - 4, 'l'); c.rect(4, hgt - 56, 288, hgt - 50, 'w')
        for y in range(hgt - 44, hgt - 4, 11): c.rect(4, y, 288, y, 'e')
        for x in range(8, 288, 18): c.rect(x, hgt - 62, x + 9, hgt - 56, 'l')
        if nm != 'bld_fort':
            for x in (30, 258):
                c.rect(x - 14, hgt - 100, x + 14, hgt - 4, 'l'); c.rect(x - 14, hgt - 100, x - 10, hgt - 4, 'w')
                c.poly([(x - 18, hgt - 100), (x + 18, hgt - 100), (x, hgt - 128)], 'B')
        if nm == 'bld_castle':
            c.rect(120, hgt - 150, 170, hgt - 4, 'l'); c.rect(120, hgt - 150, 126, hgt - 4, 'w')
            c.poly([(114, hgt - 150), (176, hgt - 150), (145, hgt - 188)], 'B')
        c.rect(132, hgt - 40, 158, hgt - 4, 'D')
    bld(nm, 292, hgt + 4, comment, mk)
SIMPLE_BLD = [('bld_tavern', 106, 100, 'таверна: сруб, вывеска', 'n', 'N', 'r', 'R'),
              ('bld_market', 120, 74, 'рынок: навес на столбах, прилавки', 'T', 'N', 'y', 'Y'),
              ('bld_blacksmith', 98, 94, 'кузница: труба, горн, наковальня', 'e', 'E', 'u', 'z'),
              ('bld_silo', 94, 118, 'склад: башня-амбар с конусом', 'T', 'N', 'N', 'D'),
              ('bld_special', 82, 82, 'особая постройка: купол с самоцветом', 'l', 'e', 'p', 'P')]
for nm, w, h, comment, wl, wld, rf, rfd in SIMPLE_BLD:
    def mk(c, w=w, h=h, wl=wl, wld=wld, rf=rf, rfd=rfd, nm=nm):
        house(c, 8, h * 0.38, w - 9, h - 4, wl, wld, rf, rfd, 'f', 'D', planks=(nm == 'bld_tavern'))
        if nm == 'bld_blacksmith':
            c.rect(w - 30, h * 0.06, w - 18, h * 0.42, 'E')
            for i in range(3): c.ellipse(w - 24 + i * 3, h * 0.02 - i * 7, 5 + i, 4 + i, 'l')
        if nm == 'bld_special':
            c.ellipse(w / 2, h * 0.34, w * 0.3, h * 0.2, rf); c.ellipse(w / 2, h * 0.3, w * 0.12, h * 0.1, 'A')
    bld(nm, w, h, comment, mk)
def wiz_tower(c, w, h, lv):
    """Башня гильдии магов: круглая шахта, арочные окна со светом, конус кровли, сфера.

    Плоский прямоугольник с треугольной крышей читался амбаром. Объём даёт не рисунок
    стены, а тон по расстоянию от оси цилиндра: свет слева, тень справа, ряды кладки
    провисают дугой — глаз сразу видит круглую башню.
    """
    cx, base_y = w / 2, h - 4
    top_y = h * 0.34                                              # где шахта переходит в кровлю
    rb, rt = w * 0.34, w * 0.26                                   # радиус у основания и у верха
    for y in range(int(top_y) - 2, int(base_y) + 1):
        t = max(0.0, (y - top_y) / max(1.0, base_y - top_y))
        r = rt + (rb - rt) * t
        for x in range(int(cx - r), int(cx + r) + 1):
            u = (x - cx) / r
            c.put(x, y, 'L' if u < -0.62 else 'l' if u < 0.22 else 'e' if u < 0.72 else 'E')
    y = base_y - 7                                                # ряды кладки дугой по цилиндру
    while y > top_y:
        t = (y - top_y) / max(1.0, base_y - top_y)
        c.ellipse(cx, y, rt + (rb - rt) * t, 1.5, 'E')
        y -= 11
    for k in range(lv):                                           # окна поднимаются по спирали
        wy = top_y + (base_y - top_y) * (0.14 + k * (0.64 / lv))
        s = 0 if lv == 1 else (-1, 1, -1, 1)[k % 4] * (0.5 if k % 2 else 1.0)
        wx = cx + s * w * 0.15
        ww, wh = w * 0.085, h * 0.05
        c.rect(wx - ww - 1, wy - 2, wx + ww + 1, wy + wh, 'E')                  # наличник
        c.ellipse(wx, wy - 2, ww + 1, (ww + 1) * 1.2, 'E')
        c.rect(wx - ww, wy, wx + ww, wy + wh, 'P')                              # проём
        c.ellipse(wx, wy, ww, ww * 1.2, 'P')
        c.rect(wx - ww + 1, wy + 1, wx + ww - 1, wy + wh - 1, 'c')              # свет из окна
        c.ellipse(wx, wy + 1, ww - 1, ww * 0.95, 'c')
    c.ellipse(cx, top_y - 1, rt + 5, 4, 'e')                                    # карниз под кровлей
    c.ellipse(cx, top_y - 3, rt + 5, 3.4, 'l')
    for i in range(5):                                                          # зубцы по карнизу
        bx = cx - (rt + 3) + i * (rt + 3) * 0.5
        c.rect(bx - 1.5, top_y - 8, bx + 1.5, top_y - 3, 'l')
    apex = h * 0.04
    c.poly([(cx - rt - 6, top_y - 6), (cx + rt + 6, top_y - 6), (cx, apex)], 'P')       # кровля
    c.poly([(cx - rt - 6, top_y - 7), (cx + 1, top_y - 7), (cx, apex + 3)], 'p')
    yy = top_y - 11
    while yy > apex + 5:                                                        # черепица рядами
        t2 = (top_y - 6 - yy) / max(1.0, top_y - 6 - apex)
        c.ellipse(cx, yy, (rt + 6) * (1 - t2), 1.3, 'P')
        yy -= 8
    c.ellipse(cx, top_y - 6, rt + 6, 2.2, 'r')                                  # кант в цвете фракции
    c.rect(cx - 1, apex - h * 0.06, cx + 1, apex + 2, 'Y')                      # шпиль
    c.ellipse(cx, apex - h * 0.07, w * 0.06, w * 0.06, 'A')                     # сфера гильдии
    c.ellipse(cx - w * 0.02, apex - h * 0.078, w * 0.022, w * 0.022, 'w')
    for s in (-1, 1):                                                           # контрфорсы
        c.poly([(cx + s * rb, base_y), (cx + s * (rb + 6), base_y),
                (cx + s * rb, base_y - h * 0.2)], 'e' if s < 0 else 'E')
    dw, dh = w * 0.15, h * 0.13                                                 # арочная дверь
    c.rect(cx - dw - 2, base_y - dh - 2, cx + dw + 2, base_y, 'E')
    c.ellipse(cx, base_y - dh - 2, dw + 2, (dw + 2) * 1.2, 'E')
    c.rect(cx - dw, base_y - dh, cx + dw, base_y, 'D')
    c.ellipse(cx, base_y - dh, dw, dw * 1.2, 'D')
    c.planks(cx - dw, base_y - dh, cx + dw, base_y, 'N', 7)
    c.rect(cx - dw - 6, base_y - 2, cx + dw + 6, base_y, 'l')                   # ступень

for i, (w, h) in enumerate(((64, 122), (70, 152), (76, 182), (82, 212)), 1):
    def mk(c, i=i, w=w, h=h):
        wiz_tower(c, w, h, i)
    bld('bld_guild_%d' % i, w, h, 'гильдия магов %d уровня: круглая башня, окна по уровню, сфера' % i, mk)
for i, (w, h) in enumerate(((76, 74), (92, 82), (104, 86), (100, 88), (118, 118), (130, 130), (160, 148)), 1):
    def mk(c, i=i, w=w, h=h):
        house(c, 8, h * 0.4, w - 9, h - 4, 'T', 'N', 'r' if i < 4 else 'b', 'R' if i < 4 else 'B', 'f', 'D')
        for k in range(i):
            c.rect(16 + k * 9, h * 0.18, 17 + k * 9, h * 0.38, 'u')
            c.poly([(17 + k * 9, h * 0.18), (24 + k * 9, h * 0.21), (17 + k * 9, h * 0.24)], 'y')
    bld('bld_dwell_%d' % i, w, h, 'жилище %d уровня на сцене города: флажки по уровню' % i, mk)
bld('bld_upg', 32, 42, 'значок улучшения: молот на щитке', lambda c: (
    c.ellipse(14, 20, 12, 14, 'y'), c.ellipse(14, 18, 8, 9, 'f'),
    c.rect(12, 10, 16, 32, 'N'), c.rect(6, 8, 22, 16, 'e')))

TITLES = {1: 'шахты, ресурсы и находки', 2: 'жилища, банки существ и заведения', 3: 'бонусные объекты и квестовые',
          4: 'деревья, горы, препятствия', 5: 'осада, море и боевые машины', 6: 'постройки сцены города'}
for g in range(1, 7):
    write('objects_%d' % g, TITLES[g], B[g], 'objects3.py')
