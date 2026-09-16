# -*- coding: utf-8 -*-
"""Пилот повышенной детализации: три существа в сетке unit 3 (вместо unit 2).

Зачем: на телефоне одна клетка сетки существа занимает 2,25 пикселя экрана при обычном
зуме и до 6,75 при пинче (бой зумится до 3×). Плюс в нынешних спрайтах 23 % строк —
точные копии предыдущей (наследство stretch), то есть даже имеющаяся сетка недоиспользована.
Сетка втрое крупнее номинала даёт место под заклёпки, кольчужное плетение, дол на клинке,
пёрышки и когти по отдельности.

Имена с приставкой p_ — это витрина для сравнения, игра их не использует.
Собирает js/view/sprites_pilot_hd.js.
"""
import io, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from compose import Canvas
from castle_hd import block, pad

class Scaled:
    """Тот же композитор, но все координаты умножаются на k. Нужен, чтобы рисовать
    в удобных числах, а на выходе получать фигуру нужного номинального размера:
    существо в unit 3 должно занимать столько же места на экране, сколько занимало в unit 2,
    иначе сравнение «стало детальнее» превращается в «стало мельче»."""
    def __init__(self, c, k):
        self.c, self.k = c, k
    def _s(self, v): return v * self.k
    def put(self, x, y, ch):
        k = self.k
        for dy in range(int(k + 0.999)):
            for dx in range(int(k + 0.999)): self.c.put(int(x * k) + dx, int(y * k) + dy, ch)
    def rect(self, x0, y0, x1, y1, ch):
        k = self.k
        for y in range(int(y0 * k), int((y1 + 1) * k)):
            for x in range(int(x0 * k), int((x1 + 1) * k)): self.c.put(x, y, ch)
    def ellipse(self, cx, cy, rx, ry, ch, rot=0.0):
        self.c.ellipse(cx * self.k, cy * self.k, rx * self.k, ry * self.k, ch, rot)
    def poly(self, pts, ch):
        self.c.poly([(x * self.k, y * self.k) for x, y in pts], ch)
    def line(self, x0, y0, x1, y1, ch, th=1):
        k = self.k
        self.c.line(x0 * k, y0 * k, x1 * k, y1 * k, ch, max(1, round(th * k)))
    def feathers(self, pts, ch, size, along, tip_c=None):
        k = self.k
        self.c.feathers([(x * k, y * k) for x, y in pts], ch, size * k, along, tip_c)
    def get(self, x, y): return self.c.get(int(x * self.k), int(y * self.k))

def rect(c, x0, y0, x1, y1, ch):
    if isinstance(c, Scaled): c.rect(x0, y0, x1, y1, ch); return
    for y in range(int(y0), int(y1) + 1):
        for x in range(int(x0), int(x1) + 1): c.put(x, y, ch)

def rows_of(c):
    g = c.c if isinstance(c, Scaled) else c
    return [''.join(r) for r in g.g]

# ============================================================================
# 1. МЕЧНИК — гуманоид в латах. Что появилось против unit 2:
#    забрало с личиной и дыхательными прорезями, наплечники в три ламелы с заклёпками,
#    кольчужная бармица плетением, нагрудник с ребром и рядом заклёпок, пряжка пояса,
#    наколенники, латные башмаки с носком, у меча — дол, обмотка рукояти и навершие.
# ============================================================================
K1 = 1.10
c = Scaled(Canvas(int(62 * K1), int(75 * K1)), K1)
CX = 27

# --- ноги ---
for sgn, x0 in ((-1, CX - 11), (1, CX + 3)):
    rect(c, x0, 55, x0 + 8, 63, 'e')          # бедро
    rect(c, x0, 55, x0 + 2, 63, 'l')          # блик по внешнему краю
    rect(c, x0 + 7, 55, x0 + 8, 63, 'E')      # тень с внутренней
    c.ellipse(x0 + 4, 64, 5, 3.4, 'l')        # наколенник
    c.ellipse(x0 + 4, 64, 3, 2.0, 'e')
    rect(c, x0 + 1, 66, x0 + 7, 70, 'e')      # голень
    rect(c, x0 + 1, 66, x0 + 2, 70, 'l')
    rect(c, x0 + 6, 66, x0 + 7, 70, 'E')
    rect(c, x0 + 1, 67, x0 + 7, 67, 'l')      # ободок поножи
    rect(c, x0 - 1, 71, x0 + 9, 74, 'E')      # башмак
    rect(c, x0 - 1, 71, x0 + 9, 72, 'e')
    rect(c, x0 + 6, 71, x0 + 9, 72, 'l')      # носок ловит свет

# --- кольчужная юбка: зубчатый низ + плетение ---
rect(c, CX - 13, 45, CX + 12, 55, 'E')
for y in range(45, 56):
    for x in range(CX - 13, CX + 13):
        if (x + (y % 2) * 2) % 4 == 0: c.put(x, y, 'e')      # звенья через одно
for x in range(CX - 13, CX + 13, 5):                          # фестоны по нижнему краю
    c.ellipse(x + 2, 55, 2.6, 2.2, 'E')
    c.put(x + 2, 56, 'u')

# --- корпус: нагрудник ---
c.poly([(CX - 14, 26), (CX + 13, 26), (CX + 12, 46), (CX - 13, 46)], 'e')
rect(c, CX - 14, 26, CX - 9, 46, 'l')                         # свет слева
rect(c, CX + 9, 26, CX + 13, 46, 'E')                         # тень справа
rect(c, CX - 1, 27, CX + 1, 45, 'l')                          # центральное ребро
rect(c, CX + 2, 27, CX + 2, 45, 'E')                          # его теневая сторона
for y in (29, 43):                                            # ряды заклёпок
    for x in range(CX - 11, CX + 12, 4): c.ellipse(x, y, 1.4, 1.4, 'l')
# туника-гербовник поверх нагрудника
c.poly([(CX - 8, 31), (CX + 8, 31), (CX + 7, 52), (CX - 7, 52)], 'R')
rect(c, CX - 7, 32, CX + 6, 51, 'r')
rect(c, CX - 2, 34, CX + 1, 49, 'w')                          # крест
rect(c, CX - 6, 39, CX + 5, 42, 'w')
rect(c, CX - 7, 31, CX - 6, 52, 'R')                          # складка слева
rect(c, CX + 5, 31, CX + 7, 52, 'R')                          # складка справа

# --- пояс с пряжкой ---
rect(c, CX - 14, 47, CX + 13, 50, 'N')
rect(c, CX - 14, 47, CX + 13, 47, 'n')
rect(c, CX - 4, 46, CX + 3, 51, 'Y')
rect(c, CX - 3, 47, CX + 2, 50, 'y')
rect(c, CX - 1, 47, CX + 0, 50, 'Y')                          # язычок пряжки

# --- бармица: кольчуга плетением ---
c.ellipse(CX, 25, 12, 6, 'E')
for y in range(20, 30):
    for x in range(CX - 12, CX + 12):
        if c.get(x, y) == 'E' and (x + (y % 2) * 2) % 4 == 0: c.put(x, y, 'e')

# --- наплечники в три ламелы ---
for sgn in (-1, 1):
    bx = CX + sgn * 17
    for i, (ry, ch) in enumerate(((5.0, 'l'), (4.2, 'e'), (3.4, 'l'))):
        c.ellipse(bx, 27 + i * 5, 7.5 - i * 0.6, ry, ch)
        c.ellipse(bx, 28 + i * 5, 6.0 - i * 0.6, ry * 0.7, 'e' if ch == 'l' else 'E')
    c.ellipse(bx, 27, 1.6, 1.6, 'y')                          # заклёпка-пуговица сверху
# руки
rect(c, CX - 22, 34, CX - 16, 48, 'e'); rect(c, CX - 22, 34, CX - 20, 48, 'l')
rect(c, CX + 15, 34, CX + 21, 48, 'e'); rect(c, CX + 19, 34, CX + 21, 48, 'E')
for y in range(36, 48, 4):                                     # членение наручей
    rect(c, CX - 22, y, CX - 16, y, 'E'); rect(c, CX + 15, y, CX + 21, y, 'l')

# --- шлем с личиной ---
c.ellipse(CX, 12, 11, 12, 'e')
c.ellipse(CX - 3, 9, 7.5, 7.5, 'l')                            # блик слева сверху
rect(c, CX - 11, 15, CX + 11, 17, 'E')                         # надбровный обод
for x in range(CX - 9, CX + 10, 5): c.ellipse(x, 16, 1.4, 1.4, 'l')   # заклёпки обода
rect(c, CX - 8, 18, CX + 7, 20, 'k')                           # прорезь забрала
rect(c, CX - 1, 18, CX + 0, 20, 'E')                           # переносье делит прорезь надвое
for x in (CX - 6, CX - 1, CX + 4):                             # дыхательные отверстия
    rect(c, x, 23, x + 1, 24, 'k')
rect(c, CX - 11, 21, CX - 9, 26, 'E')                          # нащёчники
rect(c, CX + 9, 21, CX + 11, 26, 'E')
c.ellipse(CX, 1, 3.2, 2.6, 'y')                                # навершие шлема

# --- меч в правой руке: навершие, обмотка, гарда, дол ---
SX = CX + 22
c.ellipse(SX, 46, 2.8, 2.6, 'Y')                               # навершие
rect(c, SX - 1, 39, SX + 1, 45, 'N')                           # рукоять
for y in range(39, 46, 2): rect(c, SX - 1, y, SX + 1, y, 'n')  # обмотка
rect(c, SX - 6, 36, SX + 6, 38, 'y')                           # гарда
rect(c, SX - 6, 38, SX + 6, 38, 'Y')
rect(c, SX - 3, 6, SX + 3, 35, 'l')                            # клинок
rect(c, SX - 1, 7, SX + 0, 34, 'w')                            # дол ловит свет
rect(c, SX + 2, 6, SX + 3, 35, 'e')                            # теневая фаска
c.poly([(SX - 3, 6), (SX + 3, 6), (SX, 1)], 'l')               # остриё

# --- щит в левой руке: умбон, обод, крест ---
HX = CX - 22
c.ellipse(HX, 40, 11, 15, 'B')
c.ellipse(HX, 40, 9, 13, 'b')
rect(c, HX - 2, 28, HX + 1, 52, 'y')                           # крест
rect(c, HX - 8, 38, HX + 7, 41, 'y')
c.ellipse(HX, 40, 4, 4, 'l')                                   # умбон
c.ellipse(HX, 39, 2.4, 2.4, 'w')
for y in range(28, 53, 6): c.ellipse(HX - 9, y, 1.3, 1.3, 'l') # заклёпки обода
for y in range(28, 53, 6): c.ellipse(HX + 8, y, 1.3, 1.3, 'E')

swordsman = rows_of(c)

# ============================================================================
# 2. ГРИФОН — крылатый зверь. Читаемость держат тона: крыло разложено рядами
#    разной яркости (иначе перья слипаются в облако), голова вынесена из-под крыла,
#    орлиный перед светлее львиного зада.
# ============================================================================
K2 = 1.35
g = Scaled(Canvas(int(78 * K2), int(66 * K2)), K2)
BX, BY = 40, 42

# --- львиный зад ---
g.ellipse(BX + 8, BY + 1, 17, 12, 'n')
g.ellipse(BX + 10, BY - 4, 14, 8, 't')                          # круп ловит свет
g.ellipse(BX + 6, BY + 8, 15, 7, 'N')                           # брюхо в тени
for x in range(BX - 2, BX + 22, 5):                             # шерсть прядями
    g.line(x, BY + 5, x - 3, BY + 12, 'N')
# хвост с кисточкой
g.line(BX + 23, BY - 2, BX + 32, BY + 6, 'n', 3)
g.ellipse(BX + 33, BY + 8, 3.5, 4.5, 'N')
# задние лапы
for x0 in (BX + 9, BX + 17):
    g.ellipse(x0, BY + 11, 5, 8, 'n')
    g.ellipse(x0 - 1, BY + 9, 3.5, 5, 't')
    rect(g, x0 - 3, BY + 17, x0 + 4, BY + 21, 'N')
    for i in range(3): rect(g, x0 - 3 + i * 3, BY + 21, x0 - 2 + i * 3, BY + 23, 'i')

# --- орлиный перед: грудь пером ---
g.ellipse(BX - 10, BY - 2, 13, 13, 'l')
g.ellipse(BX - 12, BY - 5, 10, 10, 'L')
for y in range(BY - 10, BY + 8, 5):                             # чешуйки пера рядами
    for x in range(BX - 19, BX - 2, 6):
        g.ellipse(x + (y // 5 % 2) * 3, y, 2.2, 1.5, 'l')
# передние лапы — жёлтые, с чешуёй и когтями
for x0 in (BX - 19, BX - 10):
    rect(g, x0 - 3, BY + 6, x0 + 3, BY + 17, 'T')
    rect(g, x0 - 3, BY + 6, x0 + 0, BY + 17, 't')
    for y in range(BY + 8, BY + 17, 4): rect(g, x0 - 3, y, x0 + 3, y, 'T')
    rect(g, x0 - 5, BY + 18, x0 + 4, BY + 21, 't')
    rect(g, x0 - 5, BY + 20, x0 + 4, BY + 21, 'T')
    for i in range(3): rect(g, x0 - 5 + i * 4, BY + 21, x0 - 3 + i * 4, BY + 23, 'i')

# --- шея и голова, вынесены вперёд-вверх из-под крыла ---
g.ellipse(BX - 16, BY - 12, 8, 9, 'l')                          # шея
g.ellipse(BX - 20, BY - 21, 9, 8, 'L')                          # череп
g.ellipse(BX - 21, BY - 23, 6.5, 5.5, 'w')                      # темя — самое светлое
g.ellipse(BX - 18, BY - 14, 9.5, 3.5, 'e')                      # воротник отделяет голову от груди
for x in range(BX - 26, BX - 9, 4): g.ellipse(x, BY - 13, 2.4, 1.8, 'l')
# клюв: надклювье, крючок, линия рта, ноздря
g.poly([(BX - 34, BY - 20), (BX - 27, BY - 23), (BX - 26, BY - 17)], 'y')
g.poly([(BX - 34, BY - 20), (BX - 28, BY - 22), (BX - 28, BY - 18)], 'Y')
g.poly([(BX - 32, BY - 18), (BX - 26, BY - 18), (BX - 27, BY - 14)], 'y')
rect(g, BX - 32, BY - 19, BX - 26, BY - 19, 'Y')                # линия рта
rect(g, BX - 28, BY - 22, BX - 27, BY - 21, 'Y')                # ноздря
# глаз
g.ellipse(BX - 24, BY - 22, 3.2, 2.8, 'y')
g.ellipse(BX - 24, BY - 22, 1.6, 1.6, 'k')
rect(g, BX - 27, BY - 26, BX - 20, BY - 25, 'e')                # бровь

# --- крыло: кроющие перья сверху мелкой чешуёй, маховые снизу длинными пёрышками ---
g.poly([(BX - 6, BY - 14), (BX + 2, BY - 31), (BX + 22, BY - 27), (BX + 17, BY - 5)], 'E')
g.poly([(BX - 4, BY - 15), (BX + 3, BY - 29), (BX + 19, BY - 26), (BX + 14, BY - 7)], 'e')
for x in range(BX + 1, BX + 20, 5):                                      # кроющие: ряд светлых чешуек
    g.ellipse(x, BY - 26 + (x // 5 % 2), 2.4, 1.8, 'l')
for j in range(5):                                                       # маховые: перо = светлая полоса + тёмный стержень
    x0 = BX + 13 - j * 4
    g.poly([(x0, BY - 23 + j), (x0 + 3, BY - 23 + j), (x0 - 2, BY - 4 + j * 2), (x0 - 5, BY - 5 + j * 2)],
           'l' if j % 2 == 0 else 'e')
    g.line(x0 + 2, BY - 22 + j, x0 - 2, BY - 5 + j * 2, 'E')             # стержень пера
    g.ellipse(x0 - 3, BY - 5 + j * 2, 2, 1.6, 'w')                       # светлый кончик
g.ellipse(BX - 3, BY - 19, 6.5, 5.5, 'L')                                # мышца плеча крыла
g.ellipse(BX - 4, BY - 20, 4, 3.5, 'w')

griffin = rows_of(g)

# ============================================================================
# 3. БЕГЕМОТ — крупный зверь. Силуэт с горбом холки и просевшим крестцом,
#    гребень вдоль хребта неровный, рёбра только на боку, костяные наручи
#    обхватывают лапу, а не лежат доской.
# ============================================================================
K3 = 1.32
b = Scaled(Canvas(int(84 * K3), int(72 * K3)), K3)
MX, MY = 40, 44

b.ellipse(MX, MY, 29, 16, 'n')                                  # туша
b.ellipse(MX + 14, MY - 10, 13, 9, 'n')                         # горб холки
b.ellipse(MX - 6, MY - 5, 22, 9, 'd')                           # спина темнее
b.ellipse(MX + 2, MY + 8, 23, 8, 'N')                           # брюхо в тени
for x in range(MX - 22, MX + 20, 6):                            # шерсть прядями, только сверху
    b.line(x, MY - 12, x - 3, MY - 5, 'N')
for x in range(MX + 1, MX + 13, 5):                             # рёбра — три коротких штриха на боку
    b.line(x, MY + 1, x + 2, MY + 6, 'd')
b.ellipse(MX + 16, MY + 2, 7, 6, 'd')                           # лопатка
b.ellipse(MX - 16, MY + 2, 7, 6, 'd')                           # бедро
# гребень: неровные костяные пластины по хребту
for i, x in enumerate(range(MX - 20, MX + 16, 6)):
    hgt = 4 + (i * 5 % 5)
    b.poly([(x, MY - 11), (x + 3, MY - 11 - hgt), (x + 6, MY - 10)], 'T')
    b.poly([(x + 1, MY - 11), (x + 3, MY - 10 - hgt), (x + 4, MY - 11)], 'I')
    b.line(x + 5, MY - 11, x + 6, MY - 10 - hgt // 2, 'N')      # прорезь отделяет пластину от соседней

# лапы
for x0, fr in ((MX - 19, 0), (MX - 10, 1), (MX + 11, 1), (MX + 20, 0)):
    b.ellipse(x0, MY + 15, 6.5, 10, 'n' if fr else 'd')
    b.ellipse(x0 - 1, MY + 12, 4.5, 6, 'd' if fr else 'N')
    rect(b, x0 - 6, MY + 23, x0 + 6, MY + 27, 'n' if fr else 'd')
    rect(b, x0 - 6, MY + 23, x0 + 6, MY + 24, 't' if fr else 'n')
    for i in range(4): rect(b, x0 - 6 + i * 4, MY + 27, x0 - 4 + i * 4, MY + 28, 'i')
# костяные наручи: обхватывают лапу — светлый верх, тень снизу
for x0 in (MX - 10, MX + 11):
    rect(b, x0 - 7, MY + 16, x0 + 7, MY + 20, 'T')
    rect(b, x0 - 7, MY + 16, x0 + 7, MY + 17, 'I')              # верх ловит свет
    rect(b, x0 - 7, MY + 20, x0 + 7, MY + 20, 'N')              # нижняя кромка в тени
    for x in range(x0 - 5, x0 + 7, 5): rect(b, x, MY + 17, x + 1, MY + 19, 'I')   # шипы

# голова
b.ellipse(MX + 28, MY - 7, 12, 11, 'n')
b.ellipse(MX + 30, MY - 11, 9, 6, 'd')                          # лоб темнее
b.ellipse(MX + 34, MY - 1, 9, 6, 't')                           # морда светлее
rect(b, MX + 39, MY - 4, MX + 41, MY - 2, 'N')                  # ноздря
for x in range(MX + 18, MX + 32, 4):                            # грива на загривке
    b.line(x, MY - 18, x - 2, MY - 10, 'N')
# пасть с клыками
rect(b, MX + 29, MY + 2, MX + 42, MY + 4, 'R')
for x in range(MX + 30, MX + 42, 3): rect(b, x, MY + 4, x + 1, MY + 7, 'i')
for x in range(MX + 31, MX + 42, 3): rect(b, x, MY - 1, x + 1, MY + 2, 'i')
# глаз и бровь
b.ellipse(MX + 28, MY - 10, 3.2, 2.6, 'f')
b.ellipse(MX + 28, MY - 10, 1.6, 1.6, 'k')
rect(b, MX + 24, MY - 14, MX + 31, MY - 13, 'N')
# рога
b.poly([(MX + 20, MY - 16), (MX + 15, MY - 29), (MX + 24, MY - 17)], 'I')
b.poly([(MX + 21, MY - 17), (MX + 18, MY - 26), (MX + 23, MY - 18)], 'i')
b.poly([(MX + 32, MY - 16), (MX + 37, MY - 28), (MX + 37, MY - 16)], 'I')
b.poly([(MX + 33, MY - 17), (MX + 36, MY - 25), (MX + 36, MY - 17)], 'i')

behemoth = rows_of(b)

# ============================================================================
out = io.StringIO()
out.write("""/* ============================================================================
   view/sprites_pilot_hd.js — ПИЛОТ повышенной детализации (unit 3, сетка втрое
   крупнее номинала вместо вдвое). Три существа для сравнения бок о бок с боевыми
   версиями; игра эти имена не использует. Собирается dev/proto/detail_pilot.py.
   ========================================================================== */
(function () {
  'use strict';
  H3.Sprites.defineMany({
""")
out.write(block('p_swordsman', swordsman, 'мечник, unit 3: забрало, заклёпки, кольчуга плетением, дол на клинке', unit=3))
out.write(block('p_griffin', griffin, 'грифон, unit 3: перья рядами, клюв с ноздрёй, когти по отдельности', unit=3))
out.write(block('p_behemoth', behemoth, 'бегемот, unit 3: клыки, гребень хребта, шерсть прядями, костяные наручи', unit=3))
out.write("  });\n})();\n")
path = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_pilot_hd.js')
io.open(path, 'w', encoding='utf-8').write(out.getvalue())
print('записан', os.path.normpath(path))
