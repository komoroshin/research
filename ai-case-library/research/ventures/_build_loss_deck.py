#!/usr/bin/env python3
"""Собирает loss-recovery-deck.html из слайдов и оформления существующей деки.

Шрифты (base64) и CSS не дублируются в репозитории вручную: они берутся из
jv-deck.html, который остаётся каноном оформления. Слайды лежат отдельно в
_loss-deck-slides.html — правится только этот файл.

Запуск: python3 _build_loss_deck.py
"""
from pathlib import Path

HERE = Path(__file__).parent
SOURCE = HERE / "jv-deck.html"
SLIDES = HERE / "_loss-deck-slides.html"
OUT = HERE / "loss-recovery-deck.html"

TITLE = "Океан Тех × Возврат потерь в сетях"

src = SOURCE.read_text(encoding="utf-8").split("\n")

# Строки 1–5 — <title> и пять @font-face с вшитыми шрифтами; строки 6–184 — CSS.
fonts = "\n".join(src[0:5])
fonts = fonts.replace("<title>Океан Тех × Партнёрство</title>", "", 1)
css = "\n".join(src[5:184])

# Хвост: полоса прогресса, зоны навигации и скрипт режима презентации.
tail_start = next(i for i, l in enumerate(src) if l.strip() == '<div class="rail" id="rail"></div>')
tail = "\n".join(src[tail_start:])

slides = SLIDES.read_text(encoding="utf-8").strip()

OUT.write_text(
    f"<title>{TITLE}</title>\n{fonts}\n{css}\n\n"
    f'<div class="canvas" id="canvas">\n\n{slides}\n\n</div>\n\n{tail}\n',
    encoding="utf-8",
)

n = slides.count('<section class="slide')
print(f"{OUT.name}: {n} слайдов, {OUT.stat().st_size // 1024} КБ")
