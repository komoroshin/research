"""Прогон выезда из локальных файлов, без Telegram.

python -m aiquote.cli samples/roof_test.mp4 samples/voice_test.ogg --notes "Jumeirah Park D7" --out out/test
"""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from dotenv import load_dotenv

from .pipeline import Visit, process, summary_text


def main() -> None:
    load_dotenv()
    ap = argparse.ArgumentParser(description="Aureum Quote: выезд → КП")
    ap.add_argument("files", nargs="*", type=Path, help="видео, аудио, фото")
    ap.add_argument("--notes", default="", help="текстовые заметки инженера")
    ap.add_argument("--out", type=Path, default=Path("out/cli"))
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    visit = Visit(a.out, notes=[a.notes] if a.notes else [])
    for f in a.files:
        dst = a.out / f.name
        if f.resolve() != dst.resolve():
            shutil.copy2(f, dst)
        # расшифровка-заглушка едет вместе с файлом
        if f.with_suffix(".txt").exists():
            shutil.copy2(f.with_suffix(".txt"), dst.with_suffix(".txt"))
        if not visit.add_file(dst):
            print(f"Пропускаю {f.name}: неизвестный формат")
    r = process(visit)
    print("\n" + summary_text(r))
    print(f"\nPDF: {r.pdf}")


if __name__ == "__main__":
    main()
