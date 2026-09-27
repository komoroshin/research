"""Работа с медиа через ffmpeg: звук из видео, кадры из видео, нормализация аудио.

Если в системе нет ffmpeg, берём бинарник из пакета imageio-ffmpeg.
"""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm", ".mkv", ".3gp"}
AUDIO_EXT = {".ogg", ".oga", ".opus", ".mp3", ".m4a", ".wav", ".aac", ".amr", ".flac"}
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def ffmpeg_exe() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def _run(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run([ffmpeg_exe(), "-hide_banner", "-nostdin", *args],
                          capture_output=True, text=True, check=False)


def duration_sec(path: Path) -> float:
    """Длительность по выводу ffmpeg (ffprobe в imageio-ffmpeg нет)."""
    out = _run(["-i", str(path)]).stderr
    m = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", out)
    if not m:
        return 0.0
    h, mnt, s = m.groups()
    return int(h) * 3600 + int(mnt) * 60 + float(s)


def has_audio(path: Path) -> bool:
    return "Audio:" in _run(["-i", str(path)]).stderr


def to_speech_mp3(src: Path, dst: Path) -> Path:
    """Моно 16 кГц mp3: маленький файл, достаточный для распознавания речи."""
    r = _run(["-y", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000", "-b:a", "48k", str(dst)])
    if r.returncode != 0 or not dst.exists():
        raise RuntimeError(f"ffmpeg не смог извлечь звук из {src.name}: {r.stderr[-400:]}")
    return dst


def extract_frames(src: Path, out_dir: Path, count: int = 12, width: int = 1280) -> list[tuple[Path, float]]:
    """Равномерно берём `count` кадров по длине видео. Возвращает [(путь, секунда)]."""
    out_dir.mkdir(parents=True, exist_ok=True)
    dur = duration_sec(src)
    if dur <= 0:
        raise RuntimeError(f"Не удалось определить длительность {src.name}")
    n = max(1, min(count, int(dur)))  # не больше кадра в секунду
    frames = []
    for i in range(n):
        t = dur * (i + 0.5) / n
        dst = out_dir / f"{src.stem}_{i:02d}.jpg"
        r = _run(["-y", "-ss", f"{t:.2f}", "-i", str(src), "-frames:v", "1",
                  "-vf", f"scale='min({width},iw)':-2", "-q:v", "4", str(dst)])
        if r.returncode == 0 and dst.exists():
            frames.append((dst, round(t, 1)))
    if not frames:
        raise RuntimeError(f"ffmpeg не смог извлечь кадры из {src.name}")
    return frames


def kind_of(path: Path) -> str | None:
    ext = path.suffix.lower()
    if ext in VIDEO_EXT:
        return "video"
    if ext in AUDIO_EXT:
        return "audio"
    if ext in IMAGE_EXT:
        return "image"
    return None
