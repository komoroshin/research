# -*- coding: utf-8 -*-
"""Композитор спрайтов из примитивов: заливки без контура, контур ('k') добавляется автоматически
по внешней границе и между материалами, где попросили. Выдаёт rows для defineMany."""
import math

class Canvas:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.g = [['.'] * w for _ in range(h)]
    def put(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h: self.g[int(y)][int(x)] = c
    def get(self, x, y):
        return self.g[y][x] if 0 <= x < self.w and 0 <= y < self.h else '.'
    def ellipse(self, cx, cy, rx, ry, c, rot=0.0):
        cr, sr = math.cos(rot), math.sin(rot)
        for y in range(int(cy - max(rx, ry)) - 1, int(cy + max(rx, ry)) + 2):
            for x in range(int(cx - max(rx, ry)) - 1, int(cx + max(rx, ry)) + 2):
                dx, dy = x + 0.5 - cx, y + 0.5 - cy
                u, v = dx * cr + dy * sr, -dx * sr + dy * cr
                if (u / rx) ** 2 + (v / ry) ** 2 <= 1: self.put(x, y, c)
    def poly(self, pts, c):
        ys = [p[1] for p in pts]
        for y in range(int(min(ys)), int(max(ys)) + 1):
            xs = []
            n = len(pts)
            for i in range(n):
                (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
                if (y0 <= y + 0.5 < y1) or (y1 <= y + 0.5 < y0):
                    xs.append(x0 + (y + 0.5 - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            for i in range(0, len(xs) - 1, 2):
                for x in range(int(math.floor(xs[i])), int(math.ceil(xs[i + 1]))): self.put(x, y, c)
    def line(self, x0, y0, x1, y1, c, th=1):
        n = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
        for i in range(n + 1):
            t = i / n; x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            self.ellipse(x, y, th / 2 + 0.5, th / 2 + 0.5, c) if th > 1 else self.put(x, y, c)
    def feathers(self, pts, c, size, along, tip_c=None):
        """гребёнка перьев вдоль ломаной pts: круги радиуса size с шагом size*1.3, смещённые в сторону along"""
        for i in range(len(pts) - 1):
            (x0, y0), (x1, y1) = pts[i], pts[i + 1]
            L = math.hypot(x1 - x0, y1 - y0); n = max(1, int(L / (size * 1.3)))
            for j in range(n + 1):
                t = j / n; x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                self.ellipse(x + along[0] * size, y + along[1] * size, size, size * 1.25, c)
                if tip_c: self.ellipse(x + along[0] * size * 1.6, y + along[1] * size * 1.6, size * 0.45, size * 0.6, tip_c)
    def outline(self, between=None):
        """внешний контур: прозрачный пиксель рядом с заливкой → 'k' (снаружи, силуэт растёт на 1);
        between: набор пар материалов, между которыми тоже рисуем линию"""
        g2 = [row[:] for row in self.g]
        for y in range(self.h):
            for x in range(self.w):
                c = self.g[y][x]
                if c != '.': continue
                if any(self.get(x + dx, y + dy) not in ('.', 'k') for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    g2[y][x] = 'k'
        if between:
            for y in range(self.h):
                for x in range(self.w):
                    c = self.g[y][x]
                    if c in ('.', 'k'): continue
                    for dx, dy in ((1, 0), (0, 1)):
                        d = self.get(x + dx, y + dy)
                        if d not in ('.', 'k') and d != c and (frozenset((c, d)) in between):
                            g2[y + dy][x + dx] = 'k'
        self.g = g2
    def rows(self): return [''.join(r) for r in self.g]

def emit(name, cv, comment=''):
    out = "    /* %s */\n    %s: {\n      rows: [\n" % (comment, name)
    out += '\n'.join("        '%s'," % r for r in cv.rows())
    return out + "\n      ],\n    },\n"

class Scaled:
    """Тот же холст, но все координаты умножаются на k.

    Нужен для сетки unit 3: рисовать удобно в прежних числах, а существо должно занимать
    столько же места на экране, сколько занимало в unit 2. Иначе «стало детальнее»
    читается как «стало мельче» — на этом уже один раз обожглись.
    """
    def __init__(self, w, h, k):
        self.k = k
        self.c = Canvas(int(round(w * k)), int(round(h * k)))
        self.w, self.h = self.c.w, self.c.h
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
    def outline(self, between=None): self.c.outline(between)
    def rows(self): return self.c.rows()
    @property
    def g(self): return self.c.g
