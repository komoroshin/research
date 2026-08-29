#!/usr/bin/env python3
"""Генерирует deck-content-for-design.md из content.js.

Выгрузка для Клод Дизайна не должна отставать от деки: после любой правки
content.js запустить `python3 gen-design-export.py` — файл перезапишется.
Internal-слайды не выгружаются (это черновик публичного показа).
"""
import re

with open('content.js', encoding='utf-8') as f:
    src = f.read()

body = src.split('String.raw`', 1)[1].rsplit('`', 1)[0]
chunks = re.split(r'^===[ \t]*', body, flags=re.M)[1:]

out = ["""# Threshold — текст презентации для Клод Дизайна

Файл генерируется из content.js (`python3 gen-design-export.py`) и держит
выгрузку синхронной с декой: вординг здесь равен вордингу деки.

Стиль для референса: бумажный фон, чернильный текст, один сдержанный оранжевый
акцент (тонкая волосяная линия), без иконок, теней, градиентов и карточек.
Заголовок крупно, 3–5 строк текста на слайд, числа — крупной цифрой с мелкой
подписью единицы рядом. Единственная иллюстрация во всей деке — схема четырёх
фаз протокола на слайде 6 (линия слева направо, третья фаза выделена заливкой).
Остальные изображения — скриншоты собственного прототипа (без чужих логотипов).
"""]

for chunk in chunks:
    head, *rest = chunk.split('\n')
    opts = [x.strip() for x in head.split('|')]
    kind, num = opts[0].split()
    if 'internal' in opts:
        continue
    text = '\n'.join(rest).split('\n--- notes')[0].strip()
    lines = text.split('\n')
    title = lines[0].lstrip('# ').strip()
    label = f"Слайд {num}" if kind == 'slide' else f"Приложение A{num}"
    out.append("---\n")
    out.append(f"## {label} — {title}\n")
    bigs, times, tables, bullets, paras, fts, gates, imgs = [], [], [], [], [], [], [], []
    for l in lines[1:]:
        l = l.rstrip()
        if not l:
            paras.append('')
        elif l.startswith('[big] '):
            v, _, lab = l[6:].partition(' | ')
            bigs.append(f"- **{v}** — {lab}")
        elif l.startswith('[time] '):
            v, _, lab = l[7:].partition(' | ')
            times.append(f"- **{v}** — {lab}")
        elif l.startswith('[img] '):
            imgs.append(l[6:])
        elif l.startswith('!! '):
            m = re.match(r'!! \[([^\]]+)\] (.*)', l)
            if m:
                gates.append(f"Рамка-акцент с меткой «{m.group(1).upper()}»:\n> {m.group(2)}")
            else:
                gates.append(f"Акцентная строка:\n> {l[3:]}")
        elif l.startswith('> '):
            fts.append(f"*Сноска: {l[2:]}*")
        elif l.startswith('| '):
            tables.append(l)
        elif l.startswith('- '):
            bullets.append(l)
        else:
            paras.append(l)
    if bigs:
        out.append("Крупные числа:\n" + '\n'.join(bigs) + '\n')
    if times:
        out.append("Таймлайн:\n" + '\n'.join(times) + '\n')
    para_text = '\n'.join(paras).strip()
    if para_text:
        out.append(para_text + '\n')
    if tables:
        out.append("Таблица:\n| | |\n|---|---|\n" + '\n'.join(tables) + '\n')
    if bullets:
        out.append('\n'.join(bullets) + '\n')
    if gates:
        out.append('\n'.join(gates) + '\n')
    if fts:
        out.append('\n'.join(fts) + '\n')
    if imgs:
        out.append(f"*(В деке — скриншот прототипа: {imgs[0]})*\n")

with open('deck-content-for-design.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
print(f"deck-content-for-design.md: {sum(1 for l in out if l.startswith('## '))} разделов")
