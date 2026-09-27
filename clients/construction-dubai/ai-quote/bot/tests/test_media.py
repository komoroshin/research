from aiquote import media


def test_frames_and_audio(samples, tmp_path):
    v = samples["video"]
    assert 19 <= media.duration_sec(v) <= 21
    assert media.has_audio(v)
    frames = media.extract_frames(v, tmp_path / "frames", count=12)
    assert len(frames) == 12
    assert all(p.stat().st_size > 1000 for p, _ in frames)
    assert frames[0][1] < frames[-1][1]
    mp3 = media.to_speech_mp3(samples["voice"], tmp_path / "voice.mp3")
    assert mp3.stat().st_size > 1000
    assert media.kind_of(samples["photo"]) == "image"
