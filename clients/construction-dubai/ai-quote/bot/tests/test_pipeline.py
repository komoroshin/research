import shutil

from aiquote.extract import ClaudeExtractor, StubExtractor
from aiquote.pipeline import Visit, process, summary_text
from aiquote.transcribe import SidecarTranscriber


def test_pipeline_offline(samples, tmp_path):
    visit = Visit(tmp_path, notes=["Клиент просит начать до конца месяца"])
    for k in ("video", "voice", "photo"):
        dst = tmp_path / samples[k].name
        shutil.copy2(samples[k], dst)
        if samples[k].with_suffix(".txt").exists():
            shutil.copy2(samples[k].with_suffix(".txt"), dst.with_suffix(".txt"))
        assert visit.add_file(dst)
    r = process(visit, SidecarTranscriber(), StubExtractor(), log=lambda s: None)
    assert [n for n, _ in r.transcripts] == ["roof_test.mp4", "voice_test.ogg"]
    assert "105–110" in r.transcripts[0][1]
    assert r.images_used == 1 + 12
    assert r.totals.grand == 26670
    data = r.pdf.read_bytes()
    assert data[:4] == b"%PDF" and b"/Count 1" in data  # одна страница
    text = summary_text(r)
    assert "26 670 AED" in text and "Уточнить" in text


class _FakeMessages:
    def __init__(self):
        self.kwargs = None

    def create(self, **kw):
        self.kwargs = kw
        block = type("B", (), {"type": "text", "text": '{"offer":"x","sections":[],"debris":null,"duration":null,'
                                                        '"warranty":null,"questions":[],"assumptions":[]}'})
        return type("R", (), {"stop_reason": "end_turn", "content": [block]})


def test_claude_request_shape(samples, monkeypatch):
    """Проверяем, что уходит в Claude, без сети и ключа."""
    ex = ClaudeExtractor.__new__(ClaudeExtractor)
    ex.model = "claude-opus-5"
    fake = _FakeMessages()
    ex.client = type("C", (), {"beta": type("Beta", (), {"messages": fake})})
    from aiquote.extract import Image
    out = ex.extract("заметка", [("roof.mp4", "расшифровка")], [Image(samples["photo"], "Фото 1")])
    assert out["offer"] == "x"
    kw = fake.kwargs
    assert kw["model"] == "claude-opus-5"
    assert kw["fallbacks"] == "default" and kw["betas"] == ["server-side-fallback-2026-07-01"]
    assert kw["output_config"]["format"]["type"] == "json_schema"
    content = kw["messages"][0]["content"]
    assert [c["type"] for c in content] == ["text", "image", "text"]
    assert content[1]["source"]["media_type"] == "image/jpeg"
    assert "расшифровка" in content[-1]["text"] and "заметка" in content[-1]["text"]
