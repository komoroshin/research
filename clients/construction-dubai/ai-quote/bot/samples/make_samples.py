"""Создаёт синтетические тестовые файлы: видео «обхода крыши» с тоном вместо речи, голосовое и фото.

Картинка и звук — заглушки ffmpeg (testsrc, синус). Речь подменяется расшифровками *.txt рядом с файлами
(STT_PROVIDER=sidecar), параметры — samples/expected_params.json (EXTRACTOR=stub).
Для проверки реального распознавания положите сюда настоящие видео и голосовые с крыши.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from aiquote.media import ffmpeg_exe  # noqa: E402

HERE = Path(__file__).resolve().parent


def make(out_dir: Path = HERE) -> dict[str, Path]:
    ff = ffmpeg_exe()
    files = {
        "video": out_dir / "roof_test.mp4",
        "voice": out_dir / "voice_test.ogg",
        "photo": out_dir / "photo_test.jpg",
    }
    run = lambda *a: subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", *a], check=True)
    run("-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=15:duration=20",
        "-f", "lavfi", "-i", "sine=frequency=440:duration=20",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(files["video"]))
    run("-f", "lavfi", "-i", "sine=frequency=300:duration=6", "-c:a", "libopus", str(files["voice"]))
    run("-f", "lavfi", "-i", "testsrc2=size=1600x1200", "-frames:v", "1", str(files["photo"]))
    return files


if __name__ == "__main__":
    for k, p in make().items():
        print(k, p)
