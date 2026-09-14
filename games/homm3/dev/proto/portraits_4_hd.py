# -*- coding: utf-8 -*-
"""Сборка js/view/sprites_portraits_4_hd.js: 8 портретов героев Бухты и Фабрики в крупной сетке 48×48 (unit 2), стиль Б —
без контура, фон заполнен, плоское освещение. Классы: captain, navigator (Бухта), mercenary, artificer (Фабрика).
Каждый портрет собирается композитором: фон → волосы сзади → плечи → шея → голова → черты лица → волосы/шляпа → приметы класса."""
import io, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from compose import Canvas

def pad(rows, W):
    return [(r + '.' * W)[:W] for r in rows]

def block(name, rows, comment, unit=2, paint=None):
    """блок defineMany для hd-спрайта; paint — переопределения paint-конвейера для этого спрайта"""
    W = max(len(r) for r in rows); rows = pad(rows, W)
    body = '\n'.join("        '%s'," % r for r in rows)
    pt = (' paint: { ' + ', '.join('%s: %s' % (k, v) for k, v in paint.items()) + ' },') if paint else ''
    return "    /* %s (%d×%d) */\n    %s: {\n      hd: true, unit: %d,%s\n      rows: [\n%s\n      ],\n    },\n" % (comment, W, len(rows), name, unit, pt, body)

W = H = 48
PAINT = {'silDome': 0, 'rim': 0, 'ao': 0.08}          # плоское освещение: без купола по квадрату, без ободка
BG_COVE, BG_FACTORY = 'C', 'E'                          # Бухта — морская волна, Фабрика — серая сталь

# ---------- общие примитивы ----------
def canvas(bg):
    c = Canvas(W, H)
    for y in range(H):
        for x in range(W): c.put(x, y, bg)
    return c

def rect(c, x0, y0, x1, y1, col):
    """заливка прямоугольника [x0,x1)×[y0,y1)"""
    for y in range(y0, y1):
        for x in range(x0, x1): c.put(x, y, col)

def torso(c, col, yt=36, shoulder=6):
    """плечи шире кадра: трапеция от линии yt до самого низа"""
    c.poly([(16, yt), (32, yt), (54, yt + shoulder), (54, H + 2), (-6, H + 2), (-6, yt + shoulder)], col)

def collar(c, col, yt=36, depth=7):
    """V-образный воротник рубашки под шеей"""
    c.poly([(14, yt), (34, yt), (24, yt + depth)], col)

def neck(c, shade, yt=36):
    rect(c, 19, 26, 30, yt + 1, shade)

def head(c, skin, cx=24, cy=19, rx=12, ry=13):
    c.ellipse(cx, cy, rx, ry, skin)

def ears(c, skin, y=20):
    c.ellipse(11.5, y, 2.6, 3.6, skin); c.ellipse(36.5, y, 2.6, 3.6, skin)

def eyes(c, y=19, lx=17, rx=28, look=1):
    """глаза: белок 3×2, зрачок 1×2 (look — смещение зрачка: 1 — в камеру, 0/2 — в сторону)"""
    rect(c, lx, y, lx + 3, y + 2, 'w'); rect(c, rx, y, rx + 3, y + 2, 'w')
    rect(c, lx + look, y, lx + look + 1, y + 2, 'k'); rect(c, rx + look, y, rx + look + 1, y + 2, 'k')

def brows(c, col, y=16, thick=2, tilt=0):
    """брови 6×2; tilt=1 — нахмуренные (внутренние концы ниже)"""
    if tilt:
        c.poly([(15, y), (21, y + 1), (21, y + 1 + thick), (15, y + thick)], col)
        c.poly([(27, y + 1), (33, y), (33, y + thick), (27, y + 1 + thick)], col)
    else:
        rect(c, 15, y, 21, y + thick, col); rect(c, 27, y, 33, y + thick, col)

def nose(c, shade, y=20):
    """нос — тень-треугольник под переносицей"""
    c.poly([(24, y), (21, y + 7), (27, y + 7)], shade)

def mouth(c, col, y=28, w=8):
    rect(c, 24 - w // 2, y, 24 + w // 2, y + 2, col)

# ---------- Бухта: капитаны — треуголка, борода, мундир ----------
def tricorne(c, col):
    """треуголка: высокая тулья, широкие поля с загнутыми вверх углами, золотой кант по краю"""
    c.ellipse(24, 8, 11, 6.5, col)                                 # тулья
    rect(c, 6, 11, 42, 16, col)                                    # поля
    c.poly([(0, 4), (7, 4), (12, 16), (0, 16)], col)               # загнутый левый угол
    c.poly([(41, 4), (48, 4), (48, 16), (36, 16)], col)            # загнутый правый угол
    rect(c, 0, 15, 48, 17, 'y')                                    # кант по нижней кромке
    rect(c, 0, 4, 3, 16, 'y'); rect(c, 45, 4, 48, 16, 'y')          # кант по загнутым углам
def captain_a():
    """Коркес: седой обветренный капитан, чёрная треуголка с золотым кантом, синий мундир с эполетами"""
    c = canvas(BG_COVE)
    c.ellipse(24, 22, 13.5, 14, 'e')                          # седые волосы сзади
    torso(c, 'B'); collar(c, 'L', depth=8)
    rect(c, 22, 40, 27, 43, 'y'); rect(c, 22, 45, 27, 48, 'y')   # латунные пуговицы
    c.ellipse(4, 39, 8, 3.5, 'y'); c.ellipse(44, 39, 8, 3.5, 'y')  # эполеты
    rect(c, -1, 41, 9, 47, 'Y'); rect(c, 39, 41, 49, 47, 'Y')     # бахрома эполет
    neck(c, 'n'); head(c, 'S'); ears(c, 'S')
    nose(c, 'n'); brows(c, 'l', tilt=1)
    rect(c, 15, 22, 21, 24, 'n'); rect(c, 27, 22, 33, 24, 'n')    # мешки под глазами — возраст
    eyes(c)
    c.ellipse(24, 31, 11, 7, 'l'); c.ellipse(24, 34, 8, 5, 'e')   # седая борода со светлым верхом
    rect(c, 18, 26, 31, 29, 'l')                                   # усы
    mouth(c, 'e', y=29, w=6)
    tricorne(c, 'D')
    return c.rows()

def captain_b():
    """Иллор: молодой капитан с чёрными волосами до плеч, повязка на глазу, коричневая треуголка, красный мундир"""
    c = canvas(BG_COVE)
    c.ellipse(24, 24, 15, 16, 'D')                                 # чёрные волосы до плеч
    torso(c, 'R'); collar(c, 'L', depth=8)
    rect(c, 22, 40, 27, 43, 'y'); rect(c, 22, 45, 27, 48, 'y')     # пуговицы
    rect(c, -1, 40, 10, 43, 'y'); rect(c, 38, 40, 49, 43, 'y')     # галун на плечах
    neck(c, 'S'); head(c, 's'); ears(c, 's')
    nose(c, 'S'); brows(c, 'D')
    eyes(c, look=0)
    rect(c, 26, 17, 33, 23, 'D')                                   # повязка на правом глазу
    c.line(12, 14, 28, 17, 'D', th=2)                              # ремешок повязки
    c.ellipse(24, 31, 10, 5.5, 'N')                                # короткая тёмная борода
    rect(c, 18, 26, 31, 28, 'N')                                   # усы
    mouth(c, 'r', y=29, w=6)
    tricorne(c, 'N')
    return c.rows()

# ---------- Бухта: навигаторы — синяя бандана, серьга ----------
def navigator_a():
    """Касметра: темнокожая женщина, синяя бандана, чёрные косы, золотая серьга, белая рубаха и кожаный жилет"""
    c = canvas(BG_COVE)
    torso(c, 'L'); c.poly([(-6, 40), (17, 36), (17, 50), (-6, 50)], 'd'); c.poly([(31, 36), (54, 40), (54, 50), (31, 50)], 'd')   # жилет
    collar(c, 's', depth=6)                                        # вырез — кожа
    neck(c, 'N'); head(c, 'n')
    rect(c, 7, 12, 13, 38, 'D'); rect(c, 35, 12, 41, 38, 'D')     # косы вдоль лица (поверх ушей)
    nose(c, 'N'); brows(c, 'D', thick=2)
    eyes(c)
    mouth(c, 'R', y=28, w=8)
    c.ellipse(24, 11, 13.5, 7, 'B')                                # бандана
    rect(c, 9, 13, 39, 16, 'B')                                    # нижний край банданы
    c.poly([(36, 14), (46, 9), (47, 14), (39, 17)], 'B')           # хвост узла
    c.ellipse(37, 26, 2.5, 3, 'y'); c.ellipse(37, 26, 1, 1.4, 'n') # серьга-кольцо
    return c.rows()

def navigator_b():
    """Анабель: светлокожая рыжая женщина, синяя бандана, длинные волнистые волосы, зелёный жилет, серьга"""
    c = canvas(BG_COVE)
    c.ellipse(24, 26, 16, 18, 'o')                                 # рыжие волосы сзади
    c.ellipse(9, 34, 5, 9, 'O'); c.ellipse(39, 34, 5, 9, 'O')      # тёмные пряди по краям
    torso(c, 'L'); c.poly([(-6, 40), (17, 36), (17, 50), (-6, 50)], 'G'); c.poly([(31, 36), (54, 40), (54, 50), (31, 50)], 'G')   # зелёный жилет
    collar(c, 'S', depth=6)
    neck(c, 'S'); head(c, 's')
    nose(c, 'S'); brows(c, 'O')
    eyes(c, look=2)
    rect(c, 15, 22, 20, 24, 'm'); rect(c, 28, 22, 33, 24, 'm')     # румянец
    mouth(c, 'r', y=28, w=8)
    c.ellipse(24, 11, 13.5, 7, 'B')                                # бандана
    rect(c, 9, 13, 39, 17, 'B')
    c.poly([(9, 14), (2, 9), (1, 14), (12, 17)], 'B')              # хвост узла слева
    c.ellipse(11, 27, 2.5, 3, 'y'); c.ellipse(11, 27, 1, 1.4, 's') # серьга слева
    return c.rows()

# ---------- Фабрика: наёмники — широкополая шляпа, платок на шее ----------
def mercenary_a():
    """Зиф: смуглый наёмник со шрамом, коричневая шляпа с тёмной лентой, красный платок, бурый плащ"""
    c = canvas(BG_FACTORY)
    c.ellipse(24, 21, 14.5, 12, 'D')                               # тёмные волосы сзади (до линии платка)
    torso(c, 'd')
    c.poly([(12, 33), (36, 33), (24, 46)], 'r')                    # платок на шее
    rect(c, 12, 32, 36, 37, 'r')
    neck(c, 'n'); head(c, 'S'); ears(c, 'S')
    c.ellipse(24, 31, 9, 4, 'n')                                   # щетина
    nose(c, 'n'); brows(c, 'D', tilt=1)
    eyes(c, y=19)
    c.line(15, 19, 17, 26, 'R', th=2)                              # шрам на левой щеке
    mouth(c, 'N', y=28, w=8)
    c.ellipse(24, 7, 11, 6, 'N')                                   # тулья шляпы
    rect(c, 12, 8, 36, 12, 'D')                                    # лента
    c.poly([(-2, 11), (50, 11), (48, 16), (0, 16)], 'N')           # поля во всю ширину
    rect(c, 0, 15, 48, 17, 'd')                                    # нижняя кромка полей светлее
    return c.rows()

def mercenary_b():
    """Тарк: наёмник с тёмно-песочной кожей, лысый, чёрная бородка и усы, бурая шляпа с красной лентой, жёлтый платок"""
    c = canvas(BG_FACTORY)
    torso(c, 'N')
    c.poly([(12, 35), (36, 35), (24, 46)], 'y')                    # платок
    rect(c, 12, 34, 36, 37, 'y')
    neck(c, 'd'); head(c, 'T'); ears(c, 'T')
    nose(c, 'd'); brows(c, 'D')
    eyes(c, look=1)
    rect(c, 17, 25, 32, 28, 'D')                                   # широкие усы
    c.ellipse(24, 32, 5, 4, 'D')                                   # бородка клином
    mouth(c, 'N', y=28, w=6)
    c.ellipse(24, 8, 11, 6, 'd')                                   # тулья
    rect(c, 12, 9, 36, 12, 'R')                                    # красная лента
    c.poly([(-2, 11), (50, 11), (48, 16), (0, 16)], 'd')           # поля
    rect(c, 0, 15, 48, 17, 'N')
    return c.rows()

# ---------- Фабрика: инженеры — гогглы на лбу, медные детали ----------
def goggles(c, y=10, rim='Y', lens='c', strap='N'):
    rect(c, 6, y - 1, 42, y + 4, strap)                            # ремешок через голову
    for cx in (18, 30):
        c.ellipse(cx, y + 1, 5.5, 4, rim); c.ellipse(cx, y + 1, 3.5, 2.5, lens)
    rect(c, 22, y, 26, y + 3, rim)                                 # перемычка

def artificer_a():
    """Уинона: молодая женщина, тёмные волосы в пучок, латунные гогглы на лбу, кожаный фартук, медный наплечник"""
    c = canvas(BG_FACTORY)
    c.ellipse(24, 20, 15, 14.5, 'N')                               # волосы сзади (обрамляют лицо)
    c.ellipse(24, 5, 7, 4, 'N')                                    # пучок
    torso(c, 'l'); c.poly([(13, 36), (35, 36), (40, 50), (8, 50)], 'n')   # фартук
    rect(c, 13, 36, 17, 50, 'N'); rect(c, 31, 36, 35, 50, 'N')     # лямки фартука
    c.ellipse(44, 42, 9, 6, 'O'); c.ellipse(45, 41, 6, 3.5, 'o')   # медный наплечник справа
    neck(c, 'S'); head(c, 's'); ears(c, 's')
    nose(c, 'S'); brows(c, 'N')
    eyes(c)
    rect(c, 15, 22, 20, 24, 'm'); rect(c, 28, 22, 33, 24, 'm')     # румянец
    mouth(c, 'r', y=28, w=6)
    c.ellipse(24, 8, 12, 5, 'N')                                   # волосы над лбом
    goggles(c, y=9)
    return c.rows()

def artificer_b():
    """Агар: пожилой лысый инженер, седые виски и усы, гогглы на лбу, бурая куртка с медными наплечниками"""
    c = canvas(BG_FACTORY)
    torso(c, 'd'); collar(c, 'I', depth=6)
    c.ellipse(4, 42, 9, 6, 'O'); c.ellipse(44, 42, 9, 6, 'O')      # медные наплечники
    c.ellipse(3, 41, 6, 3.5, 'o'); c.ellipse(45, 41, 6, 3.5, 'o')
    neck(c, 'n'); head(c, 'S'); ears(c, 'S')
    c.ellipse(11, 22, 3.5, 6, 'l'); c.ellipse(37, 22, 3.5, 6, 'l') # седые виски
    nose(c, 'n'); brows(c, 'l', thick=3)
    eyes(c, look=0)
    rect(c, 15, 22, 21, 24, 'n'); rect(c, 27, 22, 33, 24, 'n')     # морщины под глазами
    c.ellipse(24, 27.5, 7, 2.8, 'l')                               # пышные седые усы
    mouth(c, 'n', y=30, w=6)
    goggles(c, y=8, strap='D')
    return c.rows()

# ---------- проверки: заполненность, палитра, одиночные пиксели ----------
PALETTE = set('kwleEuzsStTIiLrRoOfFMmyYnNdDgGhHjqQvbBcCpPxaA')
def check(name, rows):
    assert len(rows) == H and all(len(r) == W for r in rows), name
    assert all(ch != '.' for r in rows for ch in r), '%s: есть незакрашенные пиксели' % name
    assert all(ch in PALETTE for r in rows for ch in r), '%s: символ вне палитры' % name
    lone = []
    for y in range(H):
        for x in range(W):
            ch = rows[y][x]
            if ch == 'k': continue
            same = sum(1 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + dx < W and 0 <= y + dy < H and rows[y + dy][x + dx] == ch)
            if same == 0: lone.append((x, y, ch))
    if lone: print('  одиночные пиксели в %s: %s' % (name, lone))

PORTRAITS = [
    ('portrait_captain_a', captain_a, 'Коркес: седой капитан, чёрная треуголка с золотым кантом, синий мундир с эполетами'),
    ('portrait_captain_b', captain_b, 'Иллор: молодой капитан, чёрные волосы, повязка на глазу, коричневая треуголка, красный мундир'),
    ('portrait_navigator_a', navigator_a, 'Касметра: темнокожий навигатор, синяя бандана, косы, золотая серьга, кожаный жилет'),
    ('portrait_navigator_b', navigator_b, 'Анабель: рыжая женщина-навигатор, синяя бандана, зелёный жилет, серьга'),
    ('portrait_mercenary_a', mercenary_a, 'Зиф: смуглый наёмник со шрамом, коричневая шляпа, красный платок'),
    ('portrait_mercenary_b', mercenary_b, 'Тарк: лысый наёмник с чёрной бородкой, бурая шляпа с красной лентой, жёлтый платок'),
    ('portrait_artificer_a', artificer_a, 'Уинона: женщина-инженер, пучок, гогглы на лбу, кожаный фартук, медный наплечник'),
    ('portrait_artificer_b', artificer_b, 'Агар: пожилой лысый инженер, седые усы, гогглы на лбу, медные наплечники'),
]

out = "/* ============================================================================\n"
out += "   view/sprites_portraits_4_hd.js — портреты героев Бухты и Фабрики (captain, navigator, mercenary, artificer)\n"
out += "   в крупной сетке 48×48 (unit 2), стиль Б: без контура, фон заполнен, плоское освещение.\n"
out += "   Собирается скриптом dev/proto/portraits_4_hd.py.\n"
out += "   ========================================================================== */\n(function () {\n  'use strict';\n  H3.Sprites.defineMany({\n"
for name, fn, comment in PORTRAITS:
    rows = fn()
    check(name, rows)
    out += block(name, rows, comment, paint=dict(PAINT))
out += "  });\n})();\n"
p = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_portraits_4_hd.js')
io.open(p, 'w', encoding='utf-8').write(out)
print('записан', os.path.relpath(p))
