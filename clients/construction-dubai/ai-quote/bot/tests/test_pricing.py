import json
from pathlib import Path

from aiquote.pricing import Params, Section, build_lines, duration_days, totals

EXPECTED = json.loads((Path(__file__).resolve().parent.parent / "samples" / "expected_params.json").read_text())


def test_example_matches_web_prototype():
    p = Params.from_dict(EXPECTED)
    lines = build_lines(p)
    t = totals(p, lines)
    assert t.by_section == [21900, 3500]
    assert t.subtotal == 25400
    assert t.vat == 1270
    assert t.grand == 26670
    assert duration_days(p) == 12


def test_debris_auto_and_prep_thresholds():
    p = Params(sections=[Section(area=228, gravel=True, drains=True)])
    codes = {l.code: l for l in build_lines(p)}
    assert codes["debris"].qty == 4          # 228 м² балласта → 4 рейса, как в КП Jumeirah Islands
    assert codes["prep"].price == 500
    assert build_lines(Params(sections=[Section(area=403)]))[0].price == 2000   # prep >300 м²
    assert build_lines(Params(sections=[Section(area=68)]))[0].price == 300     # prep <90 м²


def test_old_waterproofing_adds_primer_and_discount():
    p = Params(sections=[Section(area=100, old_wp=True, joints_lm=40)])
    lines = build_lines(p)
    assert [l.code for l in lines] == ["remove_old_wp", "prep", "joints_lm", "primer", "liquid_rubber", "water_test"]
    t = totals(p, lines, discount_pct=10)
    assert t.subtotal == 500 + 500 + 2000 + 500 + 10000
    assert t.discount == 1350
    assert t.grand == round((13500 - 1350) * 1.05, 2)


def test_from_dict_is_defensive():
    p = Params.from_dict({"sections": [{"kind": "roof??", "area": "abc"}, {"area": -5}], "warranty": None})
    assert p.sections[0].kind == "main" and p.sections[0].area == 0
    assert p.sections[1].kind == "garage" and p.sections[1].area == 0
    assert p.warranty == 15
