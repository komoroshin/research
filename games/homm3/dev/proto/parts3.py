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
    """Холст с прямоугольниками и фактурами поверх примитивов композитора."""

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
                     a0=104, a1=22):
        """Крыло веером: перья расходятся из одной точки, как маховые от плеча.

        Первая версия рисовала параллельные полосы одной ширины — выходила гребёнка
        радиатора, а не крыло. Здесь перья поворачиваются вокруг плеча, длина растёт
        к середине веера, каждое отделено тёмной прорисью по нижнему краю.
        """
        s = -1 if flip else 1
        pts, tips = [], []
        for i in range(n):
            t = i / max(1, n - 1)
            ang = math.radians(a0 + (a1 - a0) * t)
            L = span * (0.6 + 0.4 * math.sin(math.pi * (0.3 + t * 0.7)))
            tips.append((ang, L, x + s * math.cos(ang) * L, y - math.sin(ang) * L))
        # 1. сплошная подложка по всему вееру: без неё между перьями просвечивает фон
        #    и крыло читается пальмовой ветвью, а не крылом
        self.poly([(x, y + rise * 0.1)] + [(tx, ty) for _, _, tx, ty in tips] + [(x, y - rise * 0.1)], dark)
        # 2. перья поверх подложки, через одно светлее, с прорезью по нижнему краю
        for i, (ang, L, tx, ty) in enumerate(tips):
            px, py = -math.sin(ang), -math.cos(ang)
            w0, w1 = rise * 0.2, rise * 0.1
            self.poly([(x + s * px * w0, y + py * w0), (x - s * px * w0, y - py * w0),
                       (tx - s * px * w1, ty - py * w1), (tx + s * px * w1, ty + py * w1)],
                      light if i % 2 == 0 else mid)
            self.line(x - s * px * w0 * 0.85, y - py * w0 * 0.85,
                      tx - s * px * w1 * 0.95, ty - py * w1 * 0.95, dark)
        # 3. плечо крыла: кроющие перья мелкой чешуёй прикрывают сходящиеся основания
        self.ellipse(x, y - rise * 0.05, rise * 0.32, rise * 0.26, base)
        for i in range(5):
            ang = math.radians(a0 + (a1 - a0) * (0.1 + i * 0.2))
            r = rise * 0.36
            self.ellipse(x + s * math.cos(ang) * r, y - math.sin(ang) * r, 3.2, 2.4,
                         light if i % 2 else mid)

    def wing_bat(self, x, y, span, rise, skin, skind, bone, n=4, flip=False, a0=108, a1=18):
        """Перепончатое крыло: пальцы веером, перепонка между ними провисает фестонами.

        Плоский многоугольник без фестонов читался зелёной доской, поэтому край
        строится по точкам «кончик пальца — провис — кончик пальца».
        """
        s = -1 if flip else 1
        tips = []
        for i in range(n + 1):
            t = i / n
            ang = math.radians(a0 + (a1 - a0) * t)
            L = span * (0.62 + 0.38 * math.sin(math.pi * (0.35 + t * 0.65)))
            tips.append((x + s * math.cos(ang) * L, y - math.sin(ang) * L))
        edge = [(x, y - rise * 0.1)]
        for i, (tx, ty) in enumerate(tips):
            edge.append((tx, ty))
            if i < n:                                                   # провис перепонки к следующему пальцу
                nx, ny = tips[i + 1]
                edge.append(((tx + nx) / 2 - s * span * 0.06, (ty + ny) / 2 + rise * 0.16))
        edge.append((x, y + rise * 0.12))
        self.poly(edge, skind)
        inner = [(x, y - rise * 0.06)] + [((x + tx) / 2 + s * 1, (y + ty) / 2) for tx, ty in tips] + [(x, y + rise * 0.06)]
        self.poly(inner, skin)                                          # прикорневая часть светлее
        for tx, ty in tips:                                             # кости пальцев
            self.line(x + s * 2, y - rise * 0.05, tx, ty, bone, 2)
        self.ellipse(x, y, rise * 0.16, rise * 0.14, bone)              # сустав плеча

    def horns(self, cx, cy, size, mid, light, spread=6, curve=3):
        for s in (-1, 1):
            self.poly([(cx + s * spread, cy), (cx + s * (spread + curve), cy - size), (cx + s * (spread + curve * 2.4), cy - size * 0.2)], mid)
            self.poly([(cx + s * (spread + 1), cy), (cx + s * (spread + curve), cy - size * 0.8), (cx + s * (spread + curve * 1.6), cy - size * 0.25)], light)

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
