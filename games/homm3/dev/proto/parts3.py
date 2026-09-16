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
        for y in range(int(y0), int(y1) + 1):
            for x in range(int(x0), int(x1) + 1):
                if only and self.get(x, y) not in only: continue
                if self.get(x, y) == '.': continue
                if (x + (y % 2) * 2) % 4 == 0: self.put(x, y, light)

    def scales(self, x0, y0, x1, y1, light, step=4, only=None):
        """Чешуя: дуги рядами со сдвигом."""
        for y in range(int(y0), int(y1) + 1, step):
            for x in range(int(x0), int(x1) + 1, step):
                ox = (y // step % 2) * (step // 2)
                for dx in range(step - 1):
                    xx, yy = x + ox + dx, y
                    if only and self.get(xx, yy) not in only: continue
                    if self.get(xx, yy) != '.': self.put(xx, yy, light)

    def fur(self, x0, y0, x1, y1, dark, step=4, length=5, only=None):
        """Мех: короткие штрихи вниз-влево, как ложится шерсть."""
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
        for y in range(int(y0), int(y1) + 1, step):
            self.rect(x0, y, x1, y, dark)

    def rivets(self, x0, y, x1, ch, step=6):
        """Ряд заклёпок."""
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

    def wing_bat(self, x, y, span, rise, skin, skind, bone, n=4, flip=False):
        s = -1 if flip else 1
        self.poly([(x, y), (x + s * span * 0.3, y - rise), (x + s * span, y - rise * 0.55), (x + s * span * 0.7, y + rise * 0.4)], skind)
        self.poly([(x + s * 2, y - 2), (x + s * span * 0.32, y - rise * 0.9), (x + s * span * 0.88, y - rise * 0.5), (x + s * span * 0.62, y + rise * 0.28)], skin)
        for i in range(n):
            t = (i + 1) / (n + 1)
            self.line(x + s * 3, y - rise * 0.2, x + s * span * (0.35 + t * 0.6), y - rise * (0.85 - t * 0.7), bone, 2)

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
