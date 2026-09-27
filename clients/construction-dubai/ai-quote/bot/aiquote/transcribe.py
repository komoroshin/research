"""Расшифровка речи. Провайдер выбирается в .env (STT_PROVIDER)."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Protocol

# Подсказка распознавателю: термины, которые инженеры говорят вслух
DOMAIN_PROMPT = ("Осмотр кровли виллы в Дубае. Термины: гидроизоляция, жидкая резина, воронки, дренаж, "
                 "шахты кондиционеров, AC, проходки, пеноплекс, геотекстиль, щебень, плиты, ЦСП, CBP, "
                 "деформационные швы, отслоение, квадратов, погонных метров, Jumeirah, Arabian Ranches.")


class Transcriber(Protocol):
    def transcribe(self, audio: Path, source: Path) -> str: ...


class OpenAITranscriber:
    def __init__(self, model: str | None = None):
        from openai import OpenAI
        self.client = OpenAI()  # ключ из OPENAI_API_KEY
        self.model = model or os.getenv("STT_MODEL", "gpt-4o-transcribe")

    def transcribe(self, audio: Path, source: Path) -> str:
        with open(audio, "rb") as f:
            r = self.client.audio.transcriptions.create(
                model=self.model, file=f, language="ru", prompt=DOMAIN_PROMPT)
        return r.text.strip()


class SidecarTranscriber:
    """Для тестов без ключей: берёт текст из файла с тем же именем и расширением .txt."""

    def transcribe(self, audio: Path, source: Path) -> str:
        txt = source.with_suffix(".txt")
        if not txt.exists():
            raise FileNotFoundError(f"Нет расшифровки-заглушки {txt.name}")
        return txt.read_text(encoding="utf-8").strip()


def make_transcriber() -> Transcriber:
    p = os.getenv("STT_PROVIDER", "openai").lower()
    if p == "sidecar":
        return SidecarTranscriber()
    if p == "openai":
        return OpenAITranscriber()
    raise ValueError(f"Неизвестный STT_PROVIDER={p}")
