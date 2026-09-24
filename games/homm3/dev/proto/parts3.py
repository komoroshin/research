# -*- coding: utf-8 -*-
"""Библиотека деталей для сетки unit 3.

Сетка втрое крупнее номинала даёт место под то, чего не было: заклёпку, звено кольчуги,
складку плаща, отдельный клык, дол на клинке. Рисовать это руками 77 раз бессмысленно —
здесь собраны части, из которых складываются существа, и фактуры, которыми они покрываются.

Правила стиля Б действуют без изменений: контурной линии нет, форму держат тона,
соседние материалы обязаны отличаться по яркости, `k` — только зрачки и щели.
"""
import math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from compose import Canvas


class Fig(Canvas):
    """Холст с прямоугольниками и фактурами поверх примитивов композитора.

    Вокруг заявленной сетки добавляется поле: крыло, копьё или рог легко выходят за
    рамку, и без поля их просто срезало бы краем холста (так и случилось на первом
    проходе — половина существ упиралась в край). Рисование идёт в координатах
    заявленной сетки, поле прибавляется незаметно, а emit() потом обрезает лишнее
    и выдаёт якорь, чтобы существо осталось на прежнем месте гекса.
    """

    MARGIN = 16

    def __init__(self, w, h, margin=None):
        self.W0, self.H0 = w, h
        self.M = self.MARGIN if margin is None else margin
        Canvas.__init__(self, w + self.M * 2, h + self.M * 2)

    def put(self, x, y, c):
        Canvas.put(self, x + self.M, y + self.M, c)

    def get(self, x, y):
        return Canvas.get(self, x + self.M, y + self.M)

    def rect(self, x0, y0, x1, y1, ch):
        for y in range(int(y0), int(y1) + 1):
            for x in range(int(x0), int(x1) + 1): self.put(x, y, ch)

    def rows_out(self):
        return [''.join(r) for r in self.g]

    # ---------- фактуры: кладутся поверх уже залитой области ----------
    def mail(self, x0, y0, x1, y1, light, only=None):
        """Кольчуга: звенья в шахматку через одно. Читается как плетение, а не как шум."""
        x0, y0, x1, y1 = int(x0), int(y0), int(x1), int(y1)
        for y in range(int(y0), int(y1) + 1):
            for x in range(int(x0), int(x1) + 1):
                if only and self.get(x, y) not in only: continue
                if self.get(x, y) == '.': continue
                if (x + (y % 2) * 2) % 4 == 0: self.put(x, y, light)

    def scales(self, x0, y0, x1, y1, light, step=4, only=None):
        """Чешуя: дуги рядами со сдвигом."""
        x0, y0, x1, y1 = int(x0), int(y0), int(x1), int(y1)
        for y in range(int(y0), int(y1) + 1, step):
            for x in range(int(x0), int(x1) + 1, step):
                ox = (y // step % 2) * (step // 2)
                for dx in range(step - 1):
                    xx, yy = x + ox + dx, y
                    if only and self.get(xx, yy) not in only: continue
                    if self.get(xx, yy) != '.': self.put(xx, yy, light)

    def fur(self, x0, y0, x1, y1, dark, step=4, length=5, only=None):
        """Мех: короткие штрихи вниз-влево, как ложится шерсть."""
        x0, y0, x1, y1 = int(x0), int(y0), int(x1), int(y1)
        for x in range(int(x0), int(x1) + 1, step):
            for i in range(length):
                xx, yy = x - i // 2, y0 + i
                if yy > y1: break
                if only and self.get(xx, yy) not in only: continue
                if self.get(xx, yy) != '.': self.put(xx, yy, dark)

    def folds(self, x0, y0, x1, y1, dark, n=3):
        """Складки ткани: вертикальные прориси, слегка расходящиеся книзу."""
        for i in range(n):
            x = x0 + (x1 - x0) * (i + 1) / (n + 1)
            self.line(x, y0, x + (i - (n - 1) / 2) * 2, y1, dark)

    def planks(self, x0, y0, x1, y1, dark, step=5):
        """Доски: горизонтальные швы."""
        y0, y1 = int(y0), int(y1)
        for y in range(int(y0), int(y1) + 1, step):
            self.rect(x0, y, x1, y, dark)

    def rivets(self, x0, y, x1, ch, step=6):
        """Ряд заклёпок."""
        x0, x1 = int(x0), int(x1)
        for x in range(int(x0), int(x1) + 1, step): self.ellipse(x, y, 1.4, 1.4, ch)

    # ---------- части ----------
    def helm(self, cx, cy, r, mid, light, dark, kind='pot', slit=True, crest=None):
        """Шлем. kind: pot — котелок, great — с личиной, open — открытый, crown — с зубцами."""
        self.ellipse(cx, cy, r, r * 1.08, mid)
        self.ellipse(cx - r * 0.28, cy - r * 0.3, r * 0.68, r * 0.62, light)
        if kind in ('great', 'pot'):
            self.rect(cx - r, cy + r * 0.2, cx + r, cy + r * 0.42, dark)          # надбровный обод
            self.rivets(cx - r * 0.8, cy + r * 0.31, cx + r * 0.8, light, max(3, int(r * 0.5)))
        if slit:
            self.rect(cx - r * 0.72, cy + r * 0.55, cx + r * 0.66, cy + r * 0.78, 'k')
            self.rect(cx - r * 0.1, cy + r * 0.55, cx + r * 0.05, cy + r * 0.78, dark)   # переносье
        if kind == 'great':
            for i in (-0.55, -0.1, 0.35):                                          # дыхательные отверстия
                self.rect(cx + r * i, cy + r * 1.0, cx + r * i + 1, cy + r * 1.15, 'k')
            self.rect(cx - r, cy + r * 0.85, cx - r * 0.78, cy + r * 1.3, dark)     # нащёчники
            self.rect(cx + r * 0.78, cy + r * 0.85, cx + r, cy + r * 1.3, dark)
        if kind == 'crown':
            for i in range(-2, 3):
                self.poly([(cx + i * r * 0.4 - 1, cy - r), (cx + i * r * 0.4, cy - r * 1.5), (cx + i * r * 0.4 + 1, cy - r)], light)
        if crest: self.ellipse(cx, cy - r * 1.05, r * 0.3, r * 0.26, crest)

    def face(self, cx, cy, r, skin, shade, hair=None, eye='k', beard=None):
        """Лицо: скула в тени, два глаза, бровь. Глаз крупнее 1 клетки, иначе конвейер съест."""
        self.ellipse(cx, cy, r, r * 1.12, skin)
        self.ellipse(cx - r * 0.3, cy - r * 0.25, r * 0.6, r * 0.6, skin)
        self.rect(cx + r * 0.45, cy - r * 0.4, cx + r, cy + r, shade)               # теневая сторона
        for s in (-1, 1):
            self.ellipse(cx + s * r * 0.42, cy - r * 0.1, r * 0.22, r * 0.2, eye)
        self.rect(cx - r * 0.8, cy - r * 0.55, cx + r * 0.8, cy - r * 0.42, shade)  # бровь
        if hair:
            self.ellipse(cx, cy - r * 0.62, r * 1.06, r * 0.6, hair)
            self.rect(cx - r * 1.05, cy - r * 0.6, cx - r * 0.7, cy + r * 0.5, hair)
            self.rect(cx + r * 0.7, cy - r * 0.6, cx + r * 1.05, cy + r * 0.5, hair)
        if beard:
            self.ellipse(cx, cy + r * 0.85, r * 0.8, r * 0.5, beard)

    def hood(self, cx, cy, r, mid, dark, inner='u'):
        """Капюшон: тень внутри обязательна, иначе лицо сливается с тканью."""
        self.ellipse(cx, cy, r * 1.25, r * 1.3, mid)
        self.ellipse(cx + r * 0.1, cy + r * 0.15, r * 0.85, r * 0.9, inner)
        self.poly([(cx - r * 1.25, cy), (cx - r * 0.5, cy - r * 1.5), (cx + r * 0.6, cy - r * 1.4), (cx + r * 1.25, cy)], mid)
        self.rect(cx - r * 1.3, cy + r * 0.6, cx + r * 1.3, cy + r * 1.1, dark)     # пелерина

    def plate(self, x0, y0, x1, y1, mid, light, dark):
        """Нагрудник: центральное ребро, свет слева, два ряда заклёпок."""
        self.rect(x0, y0, x1, y1, mid)
        self.rect(x0, y0, x0 + (x1 - x0) * 0.22, y1, light)
        self.rect(x1 - (x1 - x0) * 0.2, y0, x1, y1, dark)
        cx = (x0 + x1) / 2
        self.rect(cx - 1, y0 + 1, cx + 1, y1 - 1, light)
        self.rect(cx + 2, y0 + 1, cx + 2, y1 - 1, dark)
        self.rivets(x0 + 2, y0 + 2, x1 - 2, light, 5)
        self.rivets(x0 + 2, y1 - 2, x1 - 2, light, 5)

    def pauldrons(self, cx, y, w, mid, light, dark, lames=3):
        """Наплечники в несколько ламел — плечо перестаёт быть шаром."""
        for s in (-1, 1):
            bx = cx + s * w
            for i in range(lames):
                self.ellipse(bx, y + i * 4, 7.5 - i * 0.7, 4.6 - i * 0.5, light if i % 2 == 0 else mid)
                self.ellipse(bx, y + i * 4 + 1, 6.2 - i * 0.7, 3.0 - i * 0.5, mid if i % 2 == 0 else dark)

    def legs_armoured(self, cx, ytop, ybot, mid, light, dark, gap=3):
        """Ноги в латах: бедро, наколенник, поножа с ободком, башмак с носком."""
        h = ybot - ytop
        for s in (-1, 1):
            x0 = cx + s * gap - (4 if s < 0 else 0) - 4
            self.rect(x0, ytop, x0 + 8, ytop + h * 0.42, mid)
            self.rect(x0, ytop, x0 + 2, ytop + h * 0.42, light)
            self.ellipse(x0 + 4, ytop + h * 0.5, 5, 3.4, light)                    # наколенник
            self.ellipse(x0 + 4, ytop + h * 0.5, 3, 2.0, mid)
            self.rect(x0 + 1, ytop + h * 0.58, x0 + 7, ybot - 4, mid)
            self.rect(x0 + 1, ytop + h * 0.58, x0 + 2, ybot - 4, light)
            self.rect(x0 + 6, ytop + h * 0.58, x0 + 7, ybot - 4, dark)
            self.rect(x0 - 1, ybot - 3, x0 + 9, ybot, dark)                        # башмак
            self.rect(x0 - 1, ybot - 3, x0 + 9, ybot - 2, mid)
            self.rect(x0 + 6, ybot - 3, x0 + 9, ybot - 2, light)

    def legs_bare(self, cx, ytop, ybot, skin, shade, boot=None, gap=3):
        h = ybot - ytop
        for s in (-1, 1):
            x0 = cx + s * gap - (4 if s < 0 else 0) - 3
            self.rect(x0, ytop, x0 + 6, ybot - (4 if boot else 0), skin)
            self.rect(x0 + 4, ytop, x0 + 6, ybot - (4 if boot else 0), shade)
            self.ellipse(x0 + 3, ytop + h * 0.5, 4, 3, skin)                       # икра
            if boot:
                self.rect(x0 - 1, ybot - 5, x0 + 8, ybot, boot[0])
                self.rect(x0 - 1, ybot - 5, x0 + 8, ybot - 4, boot[1])

    def sword(self, x, ytip, yhilt, blade, glare, edge, guard, grip, gripd, pommel=True):
        """Меч: остриё, дол, теневая фаска, гарда, обмотка рукояти, навершие."""
        self.rect(x - 3, ytip + 5, x + 3, yhilt - 4, blade)
        self.rect(x - 1, ytip + 6, x, yhilt - 5, glare)
        self.rect(x + 2, ytip + 5, x + 3, yhilt - 4, edge)
        self.poly([(x - 3, ytip + 5), (x + 3, ytip + 5), (x, ytip)], blade)
        self.rect(x - 6, yhilt - 3, x + 6, yhilt - 1, guard)
        self.rect(x - 6, yhilt - 1, x + 6, yhilt - 1, edge)
        self.rect(x - 1, yhilt, x + 1, yhilt + 7, gripd)
        for y in range(int(yhilt), int(yhilt) + 8, 2): self.rect(x - 1, y, x + 1, y, grip)
        if pommel: self.ellipse(x, yhilt + 9, 2.8, 2.6, guard)

    def spear(self, x, ytip, ybut, shaft, shaftd, head, headd, blade_len=12):
        self.rect(x - 1, ytip + blade_len, x + 1, ybut, shaft)
        self.rect(x + 1, ytip + blade_len, x + 1, ybut, shaftd)
        self.poly([(x - 4, ytip + blade_len), (x, ytip), (x + 4, ytip + blade_len)], head)
        self.poly([(x, ytip + 2), (x + 4, ytip + blade_len), (x, ytip + blade_len)], headd)
        self.rect(x - 3, ytip + blade_len, x + 3, ytip + blade_len + 2, headd)      # втулка

    def bow(self, x, ytop, ybot, wood, woodd, string='l'):
        n = 26
        for i in range(n + 1):
            t = i / n
            y = ytop + (ybot - ytop) * t
            dx = math.sin(t * math.pi) * 7
            self.put(x - dx, y, wood); self.put(x - dx + 1, y, woodd)
        self.line(x, ytop, x, ybot, string)
        self.ellipse(x - 1, ytop, 1.6, 1.6, woodd); self.ellipse(x - 1, ybot, 1.6, 1.6, woodd)

    def shield_round(self, cx, cy, r, field, fieldd, rim, boss, bossl):
        self.ellipse(cx, cy, r, r * 1.3, fieldd)
        self.ellipse(cx, cy, r - 1.5, r * 1.3 - 2, field)
        self.rect(cx - 2, cy - r * 1.3, cx + 1, cy + r * 1.3, rim)
        self.rect(cx - r, cy - 2, cx + r - 1, cy + 1, rim)
        self.ellipse(cx, cy, r * 0.36, r * 0.36, boss)
        self.ellipse(cx, cy - 1, r * 0.22, r * 0.22, bossl)

    def wing_feather(self, x, y, span, rise, base, mid, light, dark, n=9, flip=False,
                     a0=None, a1=None, droop=1.0):
        """Перьевое крыло: передняя кромка дугой, перья растут вдоль неё.

        Две прежние попытки расходились из одной точки — это веер, а не крыло. У крыла
        есть рука (передняя кромка), и маховые сидят по всей её длине: у плеча короткие,
        к концу длинные. Кроющие перья мелкой чешуёй прикрывают место посадки.
        a0/a1 оставлены ради совместимости со старыми вызовами и не используются.
        """
        s = -1 if flip else 1
        # кромка — квадратичная кривая от плеча к концу крыла, выгнутая вверх
        P0 = (x, y)
        P1 = (x + s * span * 0.40, y - rise * 0.98)
        P2 = (x + s * span, y - rise * 0.66)
        def edge(t):
            u = 1 - t
            return (u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0],
                    u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1])

        feathers = []
        for i in range(n):
            t = (i + 0.5) / n
            px, py = edge(t)
            qx, qy = edge(min(1.0, t + 0.04))                      # касательная к кромке
            tx, ty = qx - px, qy - py
            tl = math.hypot(tx, ty) or 1
            # перо смотрит назад-вниз: нормаль к кромке, довёрнутая к корню
            nx, ny = (ty / tl) * s, -(tx / tl) * s
            nx, ny = -nx, -ny
            nx -= s * 0.62 * droop                                  # концы уводим назад — размах, а не веер
            ny += 0.20 * droop
            nl = math.hypot(nx, ny) or 1
            nx, ny = nx / nl, ny / nl
            L = rise * (0.5 + 1.05 * t)
            feathers.append((px, py, px + nx * L, py + ny * L, t))

        # подложка по всему крылу: без неё между перьями просвечивает фон
        self.poly([(x, y + rise * 0.1)] + [(fx, fy) for _, _, fx, fy, _ in feathers]
                  + [(px, py) for px, py, _, _, _ in reversed(feathers)], dark)
        for i, (px, py, fx, fy, t) in enumerate(feathers):
            w0, w1 = rise * 0.12, rise * 0.055
            dx, dy = fx - px, fy - py
            dl = math.hypot(dx, dy) or 1
            ox, oy = -dy / dl, dx / dl                              # поперёк пера
            self.poly([(px + ox * w0, py + oy * w0), (px - ox * w0, py - oy * w0),
                       (fx - ox * w1, fy - oy * w1), (fx + ox * w1, fy + oy * w1)],
                      light if i % 2 == 0 else mid)
            self.line(px - ox * w0 * 0.85, py - oy * w0 * 0.85,
                      fx - ox * w1 * 0.9, fy - oy * w1 * 0.9, dark)  # прорезь между перьями
        # кроющие перья по кромке — прикрывают посадку маховых
        for i in range(n + 2):
            t = i / (n + 1)
            px, py = edge(t)
            self.ellipse(px, py + rise * 0.05, rise * 0.1, rise * 0.075, base if i % 3 == 2 else (light if i % 2 else mid))
        self.ellipse(x, y - rise * 0.04, rise * 0.17, rise * 0.15, base)   # плечо крыла

    def wing_bat(self, x, y, span, rise, skin, skind, bone, n=4, flip=False, a0=108, a1=18):
        """Перепончатое крыло: сплошной сектор, из которого по краю вырезаны фестоны.

        Строить контур по точкам «палец — провис — палец» оказалось ошибкой: многоугольник
        самопересекался и давал колючки. Теперь сектор заливается целиком, а полукруглые
        вырезы между пальцами делаются прозрачностью — так перепонка и провисает.
        """
        s = -1 if flip else 1
        tips = []
        for i in range(n + 1):
            t = i / n
            ang = math.radians(a0 + (a1 - a0) * t)
            L = span * (0.66 + 0.34 * math.sin(math.pi * (0.35 + t * 0.65)))
            tips.append((x + s * math.cos(ang) * L, y - math.sin(ang) * L))
        self.poly([(x, y + rise * 0.14)] + tips + [(x, y - rise * 0.12)], skind)
        self.poly([(x, y + rise * 0.06)] + [(x + (tx - x) * 0.62, y + (ty - y) * 0.62) for tx, ty in tips]
                  + [(x, y - rise * 0.06)], skin)
        for i in range(n):                                              # фестоны между пальцами
            (ax, ay), (bx, by) = tips[i], tips[i + 1]
            mx, my = (ax + bx) / 2, (ay + by) / 2
            d = math.hypot(bx - ax, by - ay)
            ox, oy = (mx - x), (my - y)
            L = math.hypot(ox, oy) or 1
            cxx, cyy = mx + ox / L * d * 0.42, my + oy / L * d * 0.42
            self.ellipse(cxx, cyy, d * 0.56, d * 0.56, '.')
        for tx, ty in tips:
            self.line(x + s * 2, y, tx, ty, bone, 2 if rise > 26 else 1)
        self.ellipse(x, y, rise * 0.15, rise * 0.13, bone)

    def horns(self, cx, cy, size, mid, light, spread=6, curve=3):
        """Рога: конус из сужающихся кружков по дуге, свет по верхней кромке.

        Два плоских треугольника читались лезвиями топора, поэтому рог набирается
        кружками — у основания толстый, к концу сходит на нет и заворачивается.
        """
        n = max(4, int(size * 0.7))
        for s in (-1, 1):
            for i in range(n):
                t = i / (n - 1)
                r = size * 0.22 * (1 - t * 0.8)
                x = cx + s * (spread + curve * t * 2.2 + t * t * curve * 0.8)
                y = cy - size * t * 0.95 + t * t * size * 0.18
                self.ellipse(x, y, r, r, mid)
                self.ellipse(x - s * r * 0.3, y - r * 0.35, r * 0.55, r * 0.5, light)

    def claws(self, x0, y, n, ch, step=4, length=3):
        for i in range(n): self.rect(x0 + i * step, y, x0 + i * step + 1, y + length, ch)

    def paw(self, cx, y, w, mid, light, claw, n=3):
        self.rect(cx - w, y, cx + w, y + 4, mid)
        self.rect(cx - w, y, cx + w, y + 1, light)
        self.claws(cx - w + 1, y + 4, n, claw, max(3, int(2 * w / n)), 3)

    # ---------- крупные формы, общие для многих фракций ----------
    def horse(self, cx, cy, L, H, mid, light, dark, mane=None, head_left=True, legs=True):
        """Конское тело: круп, грудь, шея, голова с мордой, четыре ноги, хвост.
        Одна форма на кавалериста, кентавра, пегаса и единорога — меняются только тона."""
        s = -1 if head_left else 1
        self.ellipse(cx, cy, L * 0.52, H * 0.5, mid)
        self.ellipse(cx - s * L * 0.1, cy - H * 0.2, L * 0.42, H * 0.32, light)
        self.ellipse(cx + s * L * 0.06, cy + H * 0.28, L * 0.44, H * 0.28, dark)
        self.line(cx - s * L * 0.52, cy - H * 0.24, cx - s * L * 0.76, cy + H * 0.4, dark, 5)   # хвост
        nx, ny = cx + s * L * 0.5, cy - H * 0.45
        self.ellipse(nx, ny, L * 0.16, H * 0.42, mid)                                           # шея
        hx, hy = nx + s * L * 0.14, ny - H * 0.36
        self.ellipse(hx, hy, L * 0.16, H * 0.26, mid)                                           # голова
        self.ellipse(hx + s * L * 0.1, hy + H * 0.12, L * 0.1, H * 0.16, light)                 # морда
        self.rect(hx + s * L * 0.16, hy + H * 0.1, hx + s * L * 0.2, hy + H * 0.16, dark)       # ноздря
        self.ellipse(hx + s * L * 0.02, hy - H * 0.04, 2.2, 2.0, 'k')                           # глаз
        for o in (-0.06, 0.04):                                                                 # уши
            self.poly([(hx + s * L * o, hy - H * 0.22), (hx + s * L * (o + 0.02), hy - H * 0.42),
                       (hx + s * L * (o + 0.06), hy - H * 0.2)], mid)
        if mane:
            self.fur(min(nx, nx - s * L * 0.2), ny - H * 0.5, max(nx, nx - s * L * 0.2) + 8, cy - H * 0.1,
                     mane, step=3, length=int(H * 0.5))
        if legs:
            for i, t in enumerate((-0.38, -0.2, 0.22, 0.4)):
                fx = cx + t * L
                front = i >= 2 if head_left is False else i < 2
                self.rect(fx - L * 0.05, cy + H * 0.36, fx + L * 0.05, cy + H * 0.86, mid if front else dark)
                self.rect(fx - L * 0.05, cy + H * 0.36, fx - L * 0.02, cy + H * 0.86, light if front else mid)
                self.ellipse(fx, cy + H * 0.5, L * 0.07, H * 0.2, mid if front else dark)
                self.rect(fx - L * 0.07, cy + H * 0.87, fx + L * 0.07, cy + H * 1.0, 'D')       # копыто

    def serpent(self, cx, cy, coils, r, mid, light, dark, step=9):
        """Кольца змеиного хвоста: каждое следующее ниже и шире, свет по верхнему краю."""
        for i in range(coils):
            w = r * (1 + i * 0.22)
            y = cy + i * step
            self.ellipse(cx + (i % 2 * 2 - 1) * r * 0.25, y, w, r * 0.52, mid)
            self.ellipse(cx + (i % 2 * 2 - 1) * r * 0.25, y - r * 0.16, w * 0.8, r * 0.26, light)
            self.ellipse(cx + (i % 2 * 2 - 1) * r * 0.25, y + r * 0.3, w * 0.86, r * 0.18, dark)

    def tree_crown(self, cx, cy, r, mid, light, dark):
        """Крона: комья листвы разного размера, тень по нижнему краю — иначе выходит пудель."""
        for dx, dy, k, ch in ((-0.6, 0.1, 0.62, mid), (0.55, 0.05, 0.6, mid), (0, -0.45, 0.66, light),
                              (-0.3, 0.45, 0.5, dark), (0.35, 0.5, 0.48, dark), (0, 0.1, 0.7, mid)):
            self.ellipse(cx + r * dx, cy + r * dy, r * k, r * k * 0.85, ch)
        for dx in (-0.55, 0, 0.5):
            self.ellipse(cx + r * dx, cy + r * 0.62, r * 0.4, r * 0.24, dark)

    def bark(self, x0, y0, x1, y1, mid, light, dark):
        """Кора: вертикальные борозды разной длины."""
        self.rect(x0, y0, x1, y1, mid)
        for i, x in enumerate(range(int(x0), int(x1) + 1, 4)):
            self.line(x, y0 + (i % 3) * 3, x + 1, y1 - (i % 2) * 4, dark if i % 2 else light)

    def dragon_head(self, cx, cy, r, mid, light, dark, eye='f', teeth='i', jaw_open=True):
        self.ellipse(cx, cy, r, r * 0.78, mid)
        self.ellipse(cx - r * 0.2, cy - r * 0.25, r * 0.66, r * 0.5, light)
        self.poly([(cx - r * 0.2, cy - r * 0.3), (cx - r * 1.5, cy - r * 0.1), (cx - r * 0.2, cy + r * 0.3)], mid)   # морда
        self.poly([(cx - r * 0.2, cy - r * 0.25), (cx - r * 1.45, cy - r * 0.12), (cx - r * 0.2, cy + r * 0.05)], light)
        if jaw_open:
            self.poly([(cx - r * 0.2, cy + r * 0.12), (cx - r * 1.35, cy + r * 0.4), (cx - r * 0.2, cy + r * 0.5)], 'R')
            for i in range(4):
                x = cx - r * (0.35 + i * 0.25)
                self.rect(x, cy + r * 0.1, x + 1, cy + r * 0.28, teeth)
                self.rect(x, cy + r * 0.34, x + 1, cy + r * 0.5, teeth)
        self.rect(cx - r * 1.3, cy - r * 0.18, cx - r * 1.15, cy - r * 0.08, dark)       # ноздря
        self.ellipse(cx - r * 0.35, cy - r * 0.32, r * 0.16, r * 0.14, eye)
        self.ellipse(cx - r * 0.35, cy - r * 0.32, r * 0.07, r * 0.1, 'k')
        for s in (-1, 1):                                                                # рога назад
            self.poly([(cx + r * 0.3, cy - r * 0.5 + s * 3), (cx + r * 1.3, cy - r * (0.9 + s * 0.2)),
                       (cx + r * 0.4, cy - r * 0.3 + s * 3)], dark if s < 0 else mid)

    def skull(self, cx, cy, r, bone, light, dark, horns=False, jaw=True):
        """Череп: свод, глазницы, носовое отверстие, зубы. Глазница обязана быть
        крупнее двух клеток, иначе конвейер сведёт её в точку."""
        self.ellipse(cx, cy, r, r * 0.95, bone)
        self.ellipse(cx - r * 0.25, cy - r * 0.3, r * 0.62, r * 0.55, light)
        self.ellipse(cx - r * 0.42, cy + r * 0.05, r * 0.3, r * 0.26, 'k')
        self.ellipse(cx + r * 0.42, cy + r * 0.05, r * 0.3, r * 0.26, 'k')
        self.poly([(cx, cy + r * 0.25), (cx - r * 0.16, cy + r * 0.55), (cx + r * 0.16, cy + r * 0.55)], dark)
        if jaw:
            self.ellipse(cx, cy + r * 0.78, r * 0.72, r * 0.3, bone)
            for i in range(-3, 4):
                self.rect(cx + i * r * 0.2 - 0.5, cy + r * 0.62, cx + i * r * 0.2 + 0.5, cy + r * 0.82, dark)
        if horns: self.horns(cx, cy - r * 0.7, r * 1.1, bone, light, spread=int(r * 0.8), curve=int(r * 0.4))

    def ribcage(self, cx, cy, w, h, bone, dark, n=5):
        """Грудная клетка: позвоночник и рёбра дугами, между ними темно."""
        self.rect(cx - 1.5, cy - h / 2, cx + 1.5, cy + h / 2, bone)
        for i in range(n):
            y = cy - h / 2 + h * (i + 0.5) / n
            for s in (-1, 1):
                self.line(cx + s * 2, y, cx + s * w * 0.5, y + h * 0.06, bone, 2)
                self.line(cx + s * w * 0.5, y + h * 0.06, cx + s * w * 0.4, y + h * 0.16, bone, 2)
            self.line(cx - w * 0.44, y + h * 0.12, cx + w * 0.44, y + h * 0.12, dark)

    def flame(self, cx, cy, w, h, hot, mid, cool, n=5):
        """Язык пламени: изогнутые языки разной высоты плюс горячий сгусток у основания.

        Симметричные треугольники одной высоты читались короной свечей, поэтому
        языки уводятся в стороны и различаются по росту.
        """
        self.ellipse(cx, cy - h * 0.08, w * 0.5, h * 0.2, hot)
        for i in range(n):
            t = (i - (n - 1) / 2) / max(1, (n - 1) / 2)
            hh = h * (0.45 + 0.55 * (1 - abs(t))) * (0.7 + 0.3 * ((i * 5) % 4) / 3)
            x0 = cx + t * w * 0.4
            bend = -t * w * 0.22
            self.poly([(x0 - w * 0.14, cy), (x0 - w * 0.06 + bend * 0.6, cy - hh * 0.6),
                       (x0 + bend, cy - hh), (x0 + w * 0.07 + bend * 0.55, cy - hh * 0.5),
                       (x0 + w * 0.14, cy)], mid if abs(t) < 0.7 else cool)
        self.ellipse(cx, cy - h * 0.22, w * 0.3, h * 0.3, mid)
        self.ellipse(cx, cy - h * 0.04, w * 0.2, h * 0.14, hot)   # ядро мелкое и у самого основания

    def portrait(self, bg, skin, shade, hair=None, eye='b', gear=None, gcol=None, gdark=None,
                 beard=None, brow=None, cloth='e', clothd='E', collar=None, extras=None):
        """Портрет героя 72×72: фон фракции, плечи, шея, лицо, причёска, головной убор.

        Сетка втрое крупнее даёт место под то, чего в портрете не было: радужку со зрачком
        и бликом, брови, тень скулы, ноздри, губы, пряди волос, заклёпки на шлеме.
        Освещение в конвейере плоское (paint: silDome 0, rim 0) — портрет не шар.
        """
        W, H = self.W0, self.H0
        CX, CY = W / 2, H * 0.50
        self.rect(0, 0, W - 1, H - 1, bg)
        # плечи и грудь
        self.ellipse(CX, H * 1.06, W * 0.46, H * 0.36, clothd)
        self.ellipse(CX, H * 1.04, W * 0.40, H * 0.32, cloth)
        self.rect(CX - W * 0.1, H * 0.66, CX + W * 0.1, H * 0.82, shade)        # шея
        self.rect(CX - W * 0.1, H * 0.66, CX - W * 0.04, H * 0.82, skin)
        if collar:
            self.ellipse(CX, H * 0.84, W * 0.28, H * 0.09, collar)
        r = W * 0.25
        g, gd = gcol or 'e', gdark or 'E'

        # убор рисуется в два захода: то, что позади головы, — до лица, то, что поверх, — после.
        # Иначе капюшон, нарисованный последним, затирал глаза и оставлял пустой овал.
        if gear == 'hood':
            self.poly([(CX - r * 1.32, CY + r * 1.0), (CX - r * 0.78, CY - r * 1.4),
                       (CX + r * 0.82, CY - r * 1.35), (CX + r * 1.32, CY + r * 1.0)], g)
            self.ellipse(CX, CY - r * 0.5, r * 1.3, r * 1.0, g)
            self.ellipse(CX, CY - r * 0.1, r * 1.06, r * 1.1, gd)
        elif gear == 'hat':
            self.poly([(CX - r * 1.28, CY - r * 0.9), (CX + r * 1.28, CY - r * 0.9), (CX + r * 0.2, CY - r * 2.2)], gd)
            self.poly([(CX - r * 1.08, CY - r * 0.95), (CX + r * 0.9, CY - r * 0.95), (CX + r * 0.2, CY - r * 2.0)], g)
        elif gear in ('wide', 'tricorn'):
            self.poly([(CX - r * 1.05, CY - r * 1.0), (CX + r * 1.05, CY - r * 1.0),
                       (CX + r * 0.8, CY - r * 1.7), (CX - r * 0.8, CY - r * 1.7)], g)

        # голова
        self.ellipse(CX, CY, r, r * 1.2, skin)
        self.ellipse(CX - r * 0.28, CY - r * 0.28, r * 0.66, r * 0.7, skin)
        self.ellipse(CX + r * 0.52, CY + r * 0.1, r * 0.5, r * 0.8, shade)      # теневая щека
        self.ellipse(CX - r * 1.02, CY + r * 0.1, r * 0.2, r * 0.3, skin)       # уши
        self.ellipse(CX + r * 1.02, CY + r * 0.1, r * 0.2, r * 0.3, shade)
        if hair:
            self.ellipse(CX, CY - r * 0.76, r * 1.08, r * 0.62, hair)
            self.rect(CX - r * 1.1, CY - r * 0.74, CX - r * 0.76, CY + r * 0.7, hair)
            self.rect(CX + r * 0.76, CY - r * 0.74, CX + r * 1.1, CY + r * 0.7, hair)
            self.fur(CX - r * 1.08, CY - r * 1.1, CX + r * 1.08, CY + r * 0.6, shade, step=4, length=int(r * 0.9), only=hair)
        # глаза: белок, радужка, зрачок, блик
        for sgn in (-1, 1):
            ex = CX + sgn * r * 0.42
            self.ellipse(ex, CY - r * 0.02, r * 0.26, r * 0.19, 'w')
            self.ellipse(ex, CY - r * 0.02, r * 0.15, r * 0.15, eye)
            self.ellipse(ex, CY - r * 0.02, r * 0.08, r * 0.08, 'k')
            self.put(int(ex - r * 0.07), int(CY - r * 0.1), 'w')
            self.rect(ex - r * 0.28, CY - r * 0.3, ex + r * 0.28, CY - r * 0.22, brow or shade)
        self.rect(CX - r * 0.09, CY + r * 0.1, CX + r * 0.06, CY + r * 0.42, shade)   # нос
        self.rect(CX - r * 0.16, CY + r * 0.42, CX + r * 0.14, CY + r * 0.46, shade)  # ноздри
        self.rect(CX - r * 0.26, CY + r * 0.64, CX + r * 0.24, CY + r * 0.7, 'R')     # губы
        if beard:
            self.ellipse(CX, CY + r * 0.94, r * 0.84, r * 0.58, beard)
            self.rect(CX - r * 0.4, CY + r * 0.5, CX + r * 0.38, CY + r * 0.6, beard)
            self.fur(CX - r * 0.8, CY + r * 0.7, CX + r * 0.8, CY + r * 1.5, shade, step=3, length=int(r * 0.7))

        # убор поверх лица
        if gear == 'helm':
            self.ellipse(CX, CY - r * 0.66, r * 1.16, r * 0.98, g)
            self.ellipse(CX - r * 0.3, CY - r * 0.9, r * 0.7, r * 0.5, gcol or 'l')
            self.rect(CX - r * 1.16, CY - r * 0.42, CX + r * 1.16, CY - r * 0.22, gd)
            self.rivets(CX - r * 0.9, CY - r * 0.32, CX + r * 0.9, gcol or 'l', max(3, int(r * 0.4)))
            self.rect(CX - r * 1.16, CY - r * 0.2, CX - r * 0.86, CY + r * 0.7, g)   # нащёчники
            self.rect(CX + r * 0.86, CY - r * 0.2, CX + r * 1.16, CY + r * 0.7, gd)
        elif gear == 'hood':
            for sgn in (-1, 1):                                                       # край капюшона у щеки
                self.ellipse(CX + sgn * r * 1.06, CY + r * 0.1, r * 0.22, r * 0.9, gd)
            self.ellipse(CX, CY - r * 0.92, r * 0.98, r * 0.34, gd)                   # край надо лбом
            self.rect(CX - r * 1.4, CY + r * 1.05, CX + r * 1.4, CY + r * 1.6, gd)    # пелерина
        elif gear == 'hat':
            self.rect(CX - r * 1.36, CY - r * 1.02, CX + r * 1.36, CY - r * 0.82, gd)
        elif gear == 'wide':
            self.rect(CX - r * 1.6, CY - r * 1.06, CX + r * 1.6, CY - r * 0.86, gd)
            self.rect(CX - r * 1.05, CY - r * 1.2, CX + r * 1.05, CY - r * 1.08, gd)
        elif gear == 'tricorn':
            self.poly([(CX - r * 1.7, CY - r * 0.8), (CX + r * 1.7, CY - r * 0.8),
                       (CX + r * 0.9, CY - r * 1.7), (CX - r * 0.9, CY - r * 1.7)], g)
            self.poly([(CX - r * 1.5, CY - r * 0.86), (CX + r * 1.5, CY - r * 0.86),
                       (CX + r * 0.8, CY - r * 1.55), (CX - r * 0.8, CY - r * 1.55)], gd)
            self.rect(CX - r * 1.7, CY - r * 0.84, CX + r * 1.7, CY - r * 0.7, g)
        elif gear == 'circlet':
            self.rect(CX - r * 1.1, CY - r * 0.84, CX + r * 1.1, CY - r * 0.66, g)
            for i in range(-2, 3):
                self.poly([(CX + i * r * 0.4 - r * 0.12, CY - r * 0.84),
                           (CX + i * r * 0.4, CY - r * (1.2 if i == 0 else 1.0)),
                           (CX + i * r * 0.4 + r * 0.12, CY - r * 0.84)], gcol or 'y')
        elif gear == 'bandana':
            self.rect(CX - r * 1.12, CY - r * 0.92, CX + r * 1.12, CY - r * 0.56, g)
            self.rect(CX - r * 1.12, CY - r * 0.92, CX + r * 1.12, CY - r * 0.84, gcol or 'l')
            self.poly([(CX + r * 1.0, CY - r * 0.7), (CX + r * 1.7, CY - r * 0.2), (CX + r * 1.0, CY - r * 0.1)], gd)
        elif gear == 'horns':
            self.horns(CX, CY - r * 0.9, r * 1.2, gd, g, spread=int(r * 0.9), curve=int(r * 0.4))
        if extras:
            for fn in extras: fn(self, CX, CY, r)

    # ---------- насекомые (Улей) ----------
    def chitin(self, cx, cy, rx, ry, mid, light, dark, seg=5, rot=0.0):
        """Хитиновый сегментированный корпус: панцирь с поперечными пластинами.

        Форму держат именно швы между сегментами: гладкий эллипс читается каплей,
        а не насекомым. Свет сверху-слева — блик по верхней кромке каждой пластины.
        """
        self.ellipse(cx, cy, rx, ry, mid, rot)
        self.ellipse(cx - rx * 0.18, cy - ry * 0.30, rx * 0.72, ry * 0.58, light, rot)
        self.ellipse(cx + rx * 0.30, cy + ry * 0.28, rx * 0.62, ry * 0.52, dark, rot)
        for i in range(1, seg):                                   # швы поперёк тела
            t = -1 + 2.0 * i / seg
            x = cx + rx * t * math.cos(rot)
            y = cy + rx * t * math.sin(rot)
            h = ry * math.sqrt(max(0.0, 1 - t * t))
            self.line(x - h * math.sin(rot), y + h * math.cos(rot),
                      x + h * math.sin(rot), y - h * math.cos(rot), dark)
            self.line(x - h * math.sin(rot) + math.cos(rot), y + h * math.cos(rot) + math.sin(rot),
                      x + h * math.sin(rot) + math.cos(rot), y - h * math.cos(rot) + math.sin(rot), light)

    def insect_legs(self, cx, ytop, ybot, mid, dark, pairs=3, span=14, back=0.0):
        """Суставчатые лапы: колено ВЫШЕ бедра, ступни разнесены вперёд и назад.

        У насекомого нога ломается вверх, а пары тянутся в разные стороны — от
        этого стойка. Ровные вертикальные палки читались как ножки табурета.
        """
        reach = (0.95, 0.15, -0.85)                       # передняя вперёд, средняя вбок, задняя назад
        for i in range(pairs):
            r = reach[i] if i < len(reach) else 0.0
            hx = cx - back + (i - (pairs - 1) / 2.0) * span * 0.22
            hy = ytop + (ybot - ytop) * 0.15
            kx = hx + span * r * 0.45 + span * 0.12
            ky = hy - (ybot - ytop) * 0.22
            fx, fy = hx + span * r * 0.95, ybot
            for s, col in ((-1, dark), (1, mid)):         # дальняя нога пары темнее ближней
                o = s * span * 0.10
                self.line(hx + o, hy, kx + o, ky, col, 3)
                self.line(kx + o, ky, fx + o, fy, col, 2)
                self.ellipse(fx + o, fy, 2.2, 1.6, col)

    def mandibles(self, cx, cy, r, mid, dark, tip='i'):
        """Жвалы: две изогнутые клешни вперёд, светлые острия."""
        for s in (-1, 1):
            self.line(cx, cy + s * r * 0.2, cx + r * 0.9, cy + s * r * 0.75, mid, 3)
            self.line(cx + r * 0.9, cy + s * r * 0.75, cx + r * 1.5, cy + s * r * 0.25, mid, 2)
            self.ellipse(cx + r * 1.5, cy + s * r * 0.25, 1.6, 1.6, tip)
            self.line(cx + r * 0.2, cy + s * r * 0.35, cx + r * 0.85, cy + s * r * 0.8, dark)

    def compound_eye(self, cx, cy, rx, ry, mid, light, dark='k'):
        """Фасеточный глаз: крупная линза с сеткой фасеток и бликом."""
        self.ellipse(cx, cy, rx, ry, mid)
        for dy in range(int(-ry), int(ry) + 1, 2):
            for dx in range(int(-rx), int(rx) + 1, 2):
                if (dx / max(0.5, rx)) ** 2 + (dy / max(0.5, ry)) ** 2 <= 0.9:
                    if (dx + dy) % 4 == 0: self.put(cx + dx, cy + dy, dark)
        self.ellipse(cx - rx * 0.3, cy - ry * 0.35, rx * 0.3, ry * 0.3, light)

    def wing_membrane(self, x, y, span, rise, mid, light, vein, flip=False, droop=0.5):
        """Перепончатое крыло с жилками: длинное, узкое, с прожилками веером.

        От крыла летучей мыши отличается тем, что перепонка светлая и сквозная,
        а держат её тонкие жилки, а не пальцы.
        """
        s = -1 if flip else 1
        tipx, tipy = x + s * span, y - rise
        self.poly([(x, y), (x + s * span * 0.45, y - rise * 1.05), (tipx, tipy),
                   (x + s * span * 0.55, y + rise * droop * 0.55), (x + s * span * 0.12, y + rise * 0.16)], mid)
        self.poly([(x, y), (x + s * span * 0.42, y - rise * 0.92), (x + s * span * 0.82, y - rise * 0.82),
                   (x + s * span * 0.4, y - rise * 0.1)], light)
        for i in range(5):                                        # жилки от основания к кромке
            t = 0.15 + i * 0.2
            self.line(x + s * span * 0.06, y, x + s * span * t * 1.05,
                      y - rise * (1.0 - 0.45 * abs(t - 0.5)), vein)

    def sting(self, x, y, length, mid, dark, tip='i'):
        """Жало: конус назад-вниз со светлым остриём."""
        self.poly([(x, y - 4), (x, y + 4), (x - length, y + 1)], mid)
        self.poly([(x, y - 1), (x, y + 3), (x - length, y + 1)], dark)
        self.ellipse(x - length, y + 1, 1.6, 1.6, tip)

    def antennae(self, cx, cy, length, ch, spread=5):
        """Усики: две дуги вверх-наружу с утолщением на конце."""
        for s in (-1, 1):
            self.line(cx, cy, cx + s * spread, cy - length * 0.6, ch, 2)
            self.line(cx + s * spread, cy - length * 0.6, cx + s * spread * 1.9, cy - length, ch)
            self.ellipse(cx + s * spread * 1.9, cy - length, 2, 2, ch)
