# -*- coding: utf-8 -*-
"""Сборка js-файла фракции из готовых фигур. Общая для всех генераторов unit 3."""
import io, os

def emit(name, fig, comment, unit=3, anchor=None):
    rows = fig.rows_out()
    W = max(len(r) for r in rows)
    rows = [(r + '.' * W)[:W] for r in rows]
    body = '\n'.join("        '%s'," % r for r in rows)
    an = (' anchor: [%d, %d],' % tuple(anchor)) if anchor else ''
    return ("    /* %s (%d×%d) */\n    %s: {\n      hd: true, unit: %d,%s\n      rows: [\n%s\n      ],\n    },\n"
            % (comment, W, len(rows), name, unit, an, body))

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
