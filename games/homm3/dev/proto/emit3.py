# -*- coding: utf-8 -*-
"""Сборка js-файла фракции из готовых фигур. Общая для всех генераторов unit 3."""
import io, os

def emit(name, fig, comment, unit=3, anchor=None, paint=None, tight=False, flipx=False):
    """Обрезает холст до содержимого и выдаёт якорь.

    Рамка итогового спрайта — объединение заявленной сетки и того, что за неё вылезло,
    плюс клетка запаса. Якорь считается от центра-низа ЗАЯВЛЕННОЙ сетки, иначе
    несимметричное существо (меч справа, крыло слева) съехало бы с гекса.
    """
    rows = fig.rows_out()
    W = max(len(r) for r in rows)
    rows = [(r + '.' * W)[:W] for r in rows]
    M, W0, H0 = fig.M, fig.W0, fig.H0
    used = [i for i, r in enumerate(rows) if r.strip('.')]
    if used:
        cy0, cy1 = used[0], used[-1]
        cx0 = min(len(r) - len(r.lstrip('.')) for r in rows if r.strip('.'))
        cx1 = max(len(r.rstrip('.')) - 1 for r in rows if r.strip('.'))
    else:
        cx0, cy0, cx1, cy1 = M, M, M + W0 - 1, M + H0 - 1
    if tight:                       # портрет залит фоном до краёв: прозрачная кайма тут лишняя
        x0, x1, y0, y1 = cx0, cx1, cy0, cy1
    else:
        x0 = max(0, min(cx0, M) - 1); x1 = min(W - 1, max(cx1, M + W0 - 1) + 1)
        y0 = max(0, min(cy0, M) - 1); y1 = min(len(rows) - 1, max(cy1, M + H0 - 1) + 1)
    rows = [r[x0:x1 + 1] for r in rows[y0:y1 + 1]]
    ax = M + W0 / 2 - x0
    ay = M + H0 - y0
    if flipx:                      # спрайт обязан смотреть вправо: бой зеркалит правую сторону,
        rows = [r[::-1] for r in rows]   # карта — героя, идущего влево. Рисовать удобнее головой влево
        ax = len(rows[0]) - ax
    an = ' anchor: [%d, %d],' % (round(anchor[0]) if anchor else round(ax),
                                 round(anchor[1]) if anchor else round(ay))
    if paint: an = (' paint: { ' + ', '.join('%s: %s' % kv for kv in paint.items()) + ' },') + an
    body = '\n'.join("        '%s'," % r for r in rows)
    return ("    /* %s (%d×%d) */\n    %s: {\n      hd: true, unit: %d,%s\n      rows: [\n%s\n      ],\n    },\n"
            % (comment, len(rows[0]), len(rows), name, unit, an, body))

def upg(name, comment, base, tint, extra=None):
    parts = ["base: '%s'" % base, 'tint: { ' + ', '.join("%s: '%s'" % kv for kv in tint.items()) + ' }']
    if extra: parts.append('extra: [' + ', '.join("[%d, %d, '%s']" % e for e in extra) + ']')
    return "    /* %s */\n    %s: { %s },\n" % (comment, name, ', '.join(parts))

def write(faction, title, blocks, script):
    out = io.StringIO()
    out.write("""/* ============================================================================
   view/sprites_%s_hd.js — %s в сетке unit 3 (втрое крупнее номинала).
   Стиль Б: контурной линии нет, форму держат тона. Базовые рисуются частями
   из dev/proto/parts3.py, апгрейды — перекраска базовых.
   Собирается скриптом dev/proto/%s.
   ========================================================================== */
(function () {
  'use strict';
  H3.Sprites.defineMany({
""" % (faction, title, script))
    for b in blocks: out.write(b)
    out.write("  });\n})();\n")
    path = os.path.join(os.path.dirname(__file__), '..', '..', 'js', 'view', 'sprites_%s_hd.js' % faction)
    io.open(path, 'w', encoding='utf-8').write(out.getvalue())
    print('записан sprites_%s_hd.js' % faction)
