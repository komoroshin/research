# -*- coding: utf-8 -*-
"""Целевые размеры для перерисовки в unit 3.

Существо должно занимать на экране столько же места, сколько занимает сейчас, иначе
«детальнее» читается как «мельче». Скрипт берёт занятую площадь нынешнего спрайта
в номинальных пикселях и says, сколько это клеток в сетке unit 3.

Запуск:  python3 dev/proto/sizes.py [фракция]
"""
import re, sys, os, glob

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view')

def occupancy(rows, unit):
    ys = [i for i, r in enumerate(rows) if r.strip('.')]
    if not ys: return 0, 0
    x0 = min(len(r) - len(r.lstrip('.')) for r in rows if r.strip('.'))
    x1 = max(len(r.rstrip('.')) for r in rows)
    return (x1 - x0) / unit, (ys[-1] - ys[0] + 1) / unit

def sprites(path):
    s = open(path, encoding='utf-8').read()
    for m in re.finditer(r"\n    ([a-z_0-9]+): \{\n      hd: true, unit: (\d)[^\n]*\n      rows: \[\n((?:.*\n)*?)      \],?\n", s):
        yield m.group(1), int(m.group(2)), re.findall(r"'([^']*)'", m.group(3))

def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for f in sorted(glob.glob(os.path.join(ROOT, 'sprites_*_hd.js'))):
        fac = os.path.basename(f).split('_')[1]
        if fac in ('towns', 'portraits', 'heroes', 'objects', 'pilot'): continue
        if only and fac != only: continue
        print('\n== %s ==' % fac)
        for name, unit, rows in sprites(f):
            w, h = occupancy(rows, unit)
            print('  %-16s занимает %4.1f×%4.1f номинала  →  unit 3: %3d×%3d клеток (сетка ~%d×%d)'
                  % (name, w, h, round(w * 3), round(h * 3), round(w * 3) + 4, round(h * 3) + 2))

main()
