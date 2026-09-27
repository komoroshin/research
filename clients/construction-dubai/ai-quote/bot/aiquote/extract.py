"""Разбор выезда: заметки + расшифровки + кадры/фото → параметры объекта (JSON).

Claude только извлекает параметры. Цены считает pricing.py.
"""
from __future__ import annotations

import base64
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

RULES = """Ты помогаешь инженеру компании Aureum Construction (Дубай) подготовить КП на гидроизоляцию кровли жидкой резиной.
Ниже заметки инженера, расшифровки его голосовых и видео, а также кадры из видео и фото кровли. Извлеки параметры объекта. Цены НЕ считай.

Правила:
- Первая секция — основная кровля (kind "main"). Гараж, малая кровля над входом, балкон — отдельные секции.
- Площадь названа диапазоном («120–130») — бери верхнюю границу и запиши это в assumptions.
- gravel = на кровле балласт (плиты, щебень, геотекстиль, пеноплекс), который нужно снять.
- old_wp = старая гидроизоляция отслоилась и её снимают целиком.
- drains = проверка и чистка воронок; drain_leak = протечка у воронки, нужен её демонтаж и ремонт.
- ac = есть шахты кондиционеров или проходки труб, которые надо герметизировать.
- Обычные трещины входят в работу и отдельно не считаются. cracks = true, только если инженер отдельно говорит про деформационные швы или ремонт трещин; если назвал длину швов в метрах — joints_lm, иначе 0.
- cbp_sqm = площадь ЦСП-плит по периметру под замену (иначе 0); tiles = битая терракотовая плитка под замену.
- Нестандартные дефекты (плесень, грибок, мокрые стены, потолки после протечки) в расчёт не входят: добавь их в questions как отдельную работу для оценки.
- Если площадь или ключевой признак неизвестны — поставь лучшую оценку и добавь вопрос в questions.
- debris, duration, warranty — только если инженер их назвал, иначе null.
- Если голос и кадры расходятся (сказал «гравия нет», а на кадрах щебень) — добавь вопрос в questions.
- offer — адрес объекта латиницей, как в заголовке КП (район, улица, вилла).
- questions и assumptions — по-русски, коротко."""

_num_or_null = {"anyOf": [{"type": "number"}, {"type": "null"}]}
SCHEMA = {
    "type": "object",
    "properties": {
        "offer": {"type": "string"},
        "sections": {"type": "array", "items": {
            "type": "object",
            "properties": {
                "kind": {"type": "string", "enum": ["main", "garage", "small", "balcony"]},
                "name": {"type": "string"},
                "area": {"type": "number"},
                "gravel": {"type": "boolean"}, "old_wp": {"type": "boolean"},
                "drains": {"type": "boolean"}, "drain_leak": {"type": "boolean"},
                "ac": {"type": "boolean"}, "joints_lm": {"type": "number"},
                "cracks": {"type": "boolean"}, "cbp_sqm": {"type": "number"}, "tiles": {"type": "boolean"},
            },
            "required": ["kind", "name", "area", "gravel", "old_wp", "drains", "drain_leak", "ac",
                         "joints_lm", "cracks", "cbp_sqm", "tiles"],
            "additionalProperties": False,
        }},
        "debris": _num_or_null, "duration": _num_or_null, "warranty": _num_or_null,
        "questions": {"type": "array", "items": {"type": "string"}},
        "assumptions": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["offer", "sections", "debris", "duration", "warranty", "questions", "assumptions"],
    "additionalProperties": False,
}


@dataclass
class Image:
    path: Path
    label: str  # «Фото 1» или «Видео roof.mp4, 00:12»


class Extractor(Protocol):
    def extract(self, notes: str, transcripts: list[tuple[str, str]], images: list[Image]) -> dict: ...


class ClaudeExtractor:
    def __init__(self, model: str | None = None):
        import anthropic
        self.anthropic = anthropic
        self.client = anthropic.Anthropic()  # ключ из ANTHROPIC_API_KEY
        self.model = model or os.getenv("CLAUDE_MODEL", "claude-opus-5")

    def extract(self, notes: str, transcripts: list[tuple[str, str]], images: list[Image]) -> dict:
        content: list[dict] = []
        for img in images:
            media = "image/png" if img.path.suffix.lower() == ".png" else (
                "image/webp" if img.path.suffix.lower() == ".webp" else "image/jpeg")
            content.append({"type": "text", "text": img.label})
            content.append({"type": "image", "source": {
                "type": "base64", "media_type": media,
                "data": base64.standard_b64encode(img.path.read_bytes()).decode()}})
        parts = [RULES]
        if notes.strip():
            parts.append("Заметки инженера:\n" + notes.strip())
        for name, text in transcripts:
            parts.append(f"Расшифровка «{name}»:\n{text}")
        if images:
            parts.append(f"Выше {len(images)} изображений кровли (подписи перед каждым).")
        content.append({"type": "text", "text": "\n\n".join(parts)})

        resp = self.client.beta.messages.create(
            model=self.model,
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            output_config={"format": {"type": "json_schema", "schema": SCHEMA}},
            messages=[{"role": "user", "content": content}],
        )
        if resp.stop_reason == "refusal":
            raise RuntimeError("Claude отказался обрабатывать этот выезд")
        if resp.stop_reason == "max_tokens":
            raise RuntimeError("Ответ Claude оборвался по длине")
        text = next(b.text for b in resp.content if b.type == "text")
        return json.loads(text)


class StubExtractor:
    """Для тестов без ключей: возвращает готовый JSON (по умолчанию samples/expected_params.json)."""

    def __init__(self, path: Path | None = None):
        self.path = path or Path(__file__).resolve().parent.parent / "samples" / "expected_params.json"

    def extract(self, notes: str, transcripts: list[tuple[str, str]], images: list[Image]) -> dict:
        return json.loads(self.path.read_text(encoding="utf-8"))


def make_extractor() -> Extractor:
    e = os.getenv("EXTRACTOR", "claude").lower()
    if e == "stub":
        return StubExtractor()
    if e == "claude":
        return ClaudeExtractor()
    raise ValueError(f"Неизвестный EXTRACTOR={e}")
