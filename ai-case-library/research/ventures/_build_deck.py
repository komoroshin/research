#!/usr/bin/env python3
"""Собирает деку из файла слайдов и оформления jv-deck.html.

Шрифты (base64) и CSS не дублируются в репозитории: jv-deck.html остаётся
каноном оформления, отсюда берутся его <style>-блоки и скрипт режима
презентации. Правится только файл слайдов.

    python3 _build_deck.py loss      # loss-recovery-deck.html
    python3 _build_deck.py energy    # energy-portfolio-deck.html
    python3 _build_deck.py grid      # grid-engineering-deck.html
    python3 _build_deck.py           # обе
"""
import sys
from pathlib import Path

HERE = Path(__file__).parent
SOURCE = HERE / "jv-deck.html"

DECKS = {
    "loss": ("_loss-deck-slides.html", "loss-recovery-deck.html",
             "Океан Тех × Возврат потерь в сетях"),
    "energy": ("_energy-deck-slides.html", "energy-portfolio-deck.html",
               "Океан Тех × Энергетика: три продукта"),
    "grid": ("_grid-deck-slides.html", "grid-engineering-deck.html",
             "Океан Тех × Инженерия подключения с ИИ внутри"),
}


def build(key):
    slides_name, out_name, title = DECKS[key]
    src = SOURCE.read_text(encoding="utf-8").split("\n")
    # Служебные строки заголовка канона не переносим — свои ставим ниже.
    src = [l for l in src if not l.startswith("<meta ")]

    # <title> и пять @font-face со вшитыми шрифтами, затем CSS до </style>.
    css_end = next(i for i, l in enumerate(src) if l.strip() == "</style>")
    fonts = "\n".join(src[0:5]).replace(
        "<title>Океан Тех × Партнёрство</title>", "", 1)
    css = "\n".join(src[5:css_end + 1])

    tail_start = next(i for i, l in enumerate(src)
                      if l.strip() == '<div class="rail" id="rail"></div>')
    tail = "\n".join(src[tail_start:])

    slides = (HERE / slides_name).read_text(encoding="utf-8").strip()
    out = HERE / out_name
    out.write_text(
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        f"<title>{title}</title>\n{fonts}\n{css}\n\n"
        f'<div class="canvas" id="canvas">\n\n{slides}\n\n</div>\n\n{tail}\n',
        encoding="utf-8",
    )
    n = slides.count('<section class="slide')
    print(f"{out.name}: {n} слайдов, {out.stat().st_size // 1024} КБ")


if __name__ == "__main__":
    keys = sys.argv[1:] or list(DECKS)
    for k in keys:
        build(k)
