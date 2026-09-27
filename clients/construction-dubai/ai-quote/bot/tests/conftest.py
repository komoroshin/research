import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


@pytest.fixture(scope="session")
def samples(tmp_path_factory):
    from samples.make_samples import make
    out = tmp_path_factory.mktemp("samples")
    files = make(out)
    for k in ("video", "voice"):
        src = ROOT / "samples" / (files[k].stem + ".txt")
        files[k].with_suffix(".txt").write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
    return files
