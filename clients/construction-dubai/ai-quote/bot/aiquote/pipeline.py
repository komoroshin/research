"""Конвейер обработки одного выезда."""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from pathlib import Path

from . import media
from .extract import Extractor, Image, make_extractor
from .pdf import render_pdf
from .pricing import Line, Params, Totals, build_lines, totals
from .transcribe import Transcriber, make_transcriber


@dataclass
class Visit:
    """Всё, что инженер прислал по одному объекту."""
    workdir: Path
    notes: list[str] = field(default_factory=list)
    files: list[Path] = field(default_factory=list)

    def add_file(self, path: Path) -> str | None:
        kind = media.kind_of(path)
        if kind:
            self.files.append(path)
        return kind


@dataclass
class Result:
    params: Params
    lines: list[Line]
    totals: Totals
    transcripts: list[tuple[str, str]]
    images_used: int
    pdf: Path
    warnings: list[str]


def process(visit: Visit, transcriber: Transcriber | None = None, extractor: Extractor | None = None,
            log=print) -> Result:
    transcriber = transcriber or make_transcriber()
    extractor = extractor or make_extractor()
    frames_per_video = int(os.getenv("FRAMES_PER_VIDEO", "12"))
    max_images = int(os.getenv("MAX_IMAGES", "20"))
    tmp = visit.workdir / "work"
    tmp.mkdir(parents=True, exist_ok=True)

    transcripts: list[tuple[str, str]] = []
    photos: list[Image] = []
    frames: list[Image] = []
    warnings: list[str] = []

    for f in visit.files:
        kind = media.kind_of(f)
        if kind == "image":
            photos.append(Image(f, f"Фото {len(photos) + 1}"))
        elif kind == "audio":
            log(f"Расшифровываю {f.name}")
            mp3 = media.to_speech_mp3(f, tmp / f"{f.stem}.mp3")
            transcripts.append((f.name, transcriber.transcribe(mp3, f)))
        elif kind == "video":
            log(f"Режу на кадры {f.name}")
            for path, sec in media.extract_frames(f, tmp / "frames", frames_per_video):
                frames.append(Image(path, f"Видео {f.name}, {int(sec // 60):02d}:{int(sec % 60):02d}"))
            if media.has_audio(f):
                log(f"Расшифровываю звук из {f.name}")
                mp3 = media.to_speech_mp3(f, tmp / f"{f.stem}.mp3")
                transcripts.append((f.name, transcriber.transcribe(mp3, f)))
            else:
                warnings.append(f"В видео {f.name} нет звука")

    # Фото инженера важнее кадров из видео; кадры прореживаем равномерно
    room = max(0, max_images - len(photos))
    if len(frames) > room:
        step = len(frames) / room if room else 0
        frames = [frames[int(i * step)] for i in range(room)]
        warnings.append(f"Кадров больше лимита, взято {room}")
    images = photos[:max_images] + frames

    notes = "\n".join(visit.notes)
    if not notes.strip() and not transcripts and not images:
        raise ValueError("Нет данных: пришлите видео, голосовое, фото или заметку")

    log(f"Разбираю выезд: {len(transcripts)} расшифровок, {len(images)} изображений")
    params = Params.from_dict(extractor.extract(notes, transcripts, images))
    if not params.sections:
        raise ValueError("Не удалось определить ни одной кровли")
    lines = build_lines(params)
    t = totals(params, lines)
    name = re.sub(r"[^\w\- ]+", "", params.offer or "roof").strip().replace(" ", "_")[:60] or "roof"
    pdf = render_pdf(params, lines, t, visit.workdir / f"Quotation_{name}.pdf")
    return Result(params, lines, t, transcripts, len(images), pdf, warnings)


def _aed(v: float) -> str:
    return f"{v:,.0f}".replace(",", " ") + " AED"


def summary_text(r: Result) -> str:
    """Короткий отчёт для инженера (Telegram, консоль)."""
    out = [f"Объект: {r.params.offer or '—'}"]
    for i, s in enumerate(r.params.sections):
        flags = [n for n, on in [("балласт", s.gravel), ("снять старую г/и", s.old_wp), ("воронки", s.drains),
                                 ("протечка у воронки", s.drain_leak), ("кондиционеры", s.ac),
                                 ("трещины/швы", s.cracks or s.joints_lm > 0), ("ЦСП", s.cbp_sqm > 0),
                                 ("плитка", s.tiles)] if on]
        out.append(f"{i + 1}. {s.name}: {s.area:g} м² · {', '.join(flags) or 'только гидроизоляция'} · "
                   f"{_aed(r.totals.by_section[i])}")
    out.append(f"Итого с НДС: {_aed(r.totals.grand)}")
    if r.params.questions:
        out.append("\nУточнить:\n" + "\n".join(f"• {q}" for q in r.params.questions))
    if r.params.assumptions:
        out.append("\nПринято по умолчанию:\n" + "\n".join(f"• {a}" for a in r.params.assumptions))
    if r.warnings:
        out.append("\n" + "\n".join(f"⚠ {w}" for w in r.warnings))
    return "\n".join(out)
