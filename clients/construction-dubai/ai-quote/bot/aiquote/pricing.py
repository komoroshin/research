"""Прайс и правила расчёта. Те же правила, что в веб-прототипе (app/index.html).

Цены выведены из 10 КП Matrosov Technical Services, январь–май 2025.
Считает только этот модуль: ИИ цены не трогает.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

VAT = 0.05

PRICES: dict[str, dict] = {
    "dismantle_ballast": {"en": "Dismantling of slabs, crushed stone, geotextile and penoplex", "unit": "Sq.m", "price": 60},
    "dismantle_cbp": {"en": "Dismantling of CBP boards around the perimeter", "unit": "Sq.m", "price": 50},
    "remove_old_wp": {"en": "Complete dismantling of the old peeled off waterproofing", "unit": "Sq.m", "price": 5},
    "drain_leak_fix": {"en": "Dismantling the drainage funnel, fixing the leakage and re-installing the funnel", "unit": "Set", "price": 1700},
    "drains": {"en": "Checking and cleaning the drainage funnels and drainage system in whole", "unit": "Set", "price": 1500, "extra": 800},
    "ac_penetrations": {"en": "Sealing the AC shafts, pipe connections and penetrations with a silicone sealant", "unit": "Set", "price": 1300},
    "prep": {"en": "Preparation of the base for a new waterproofing (removal of dirt and dust)", "unit": "Set", "price": 500},
    "joints_lm": {"en": "Sealing all shrinkage and expansion joints with a silicone sealant, repair of cracks", "unit": "Lm", "price": 50},
    "cracks_set": {"en": "Repair of the cracks and sealing the expansion joints with a silicone sealant", "unit": "Set", "price": 1000, "extra": 650},
    "primer": {"en": "Applying PVA primer on the prepared and cleaned surface", "unit": "Sq.m", "price": 5},
    "liquid_rubber": {"en": "Installation of a new liquid rubber waterproofing in 2 coats with reinforcement mesh", "unit": "Sq.m", "price": 100},
    "install_cbp": {"en": "Installation of new CBP boards around the perimeter", "unit": "Sq.m", "price": 100},
    "tiles_replace": {"en": "Replacement of damaged terracotta tiles (including materials)", "unit": "Set", "price": 800},
    "water_test": {"en": "Testing of new waterproofing with water", "unit": "Set", "price": 0},
    "debris": {"en": "Disposal of debris from the site", "unit": "Trip", "price": 500},
}

KINDS = {"main": "Main roof", "garage": "Garage roof", "small": "Small roof", "balcony": "Balcony"}


@dataclass
class Section:
    kind: str = "main"
    name: str = "Main roof"
    area: float = 0
    gravel: bool = False
    old_wp: bool = False
    drains: bool = False
    drain_leak: bool = False
    ac: bool = False
    joints_lm: float = 0
    cracks: bool = False
    cbp_sqm: float = 0
    tiles: bool = False


@dataclass
class Params:
    offer: str = ""
    sections: list[Section] = field(default_factory=list)
    debris: int | None = None
    duration: int | None = None
    warranty: int = 15
    questions: list[str] = field(default_factory=list)
    assumptions: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, d: dict) -> "Params":
        def f(v) -> float:
            try:
                return max(0.0, float(v))
            except (TypeError, ValueError):
                return 0.0

        secs = []
        for i, s in enumerate((d.get("sections") or [])[:5]):
            kind = s.get("kind") if s.get("kind") in KINDS else ("main" if i == 0 else "garage")
            secs.append(Section(
                kind=kind, name=str(s.get("name") or KINDS[kind]), area=f(s.get("area")),
                gravel=bool(s.get("gravel")), old_wp=bool(s.get("old_wp")), drains=bool(s.get("drains")),
                drain_leak=bool(s.get("drain_leak")), ac=bool(s.get("ac")), joints_lm=f(s.get("joints_lm")),
                cracks=bool(s.get("cracks")), cbp_sqm=f(s.get("cbp_sqm")), tiles=bool(s.get("tiles")),
            ))
        return cls(
            offer=str(d.get("offer") or ""),
            sections=secs,
            debris=None if d.get("debris") is None else int(f(d["debris"])),
            duration=None if not d.get("duration") else int(f(d["duration"])),
            warranty=int(f(d.get("warranty"))) or 15,
            questions=[str(x) for x in (d.get("questions") or [])][:8],
            assumptions=[str(x) for x in (d.get("assumptions") or [])][:8],
        )


@dataclass
class Line:
    section: int
    code: str
    qty: float
    price: float

    @property
    def cost(self) -> float:
        return round(self.qty * self.price, 2)


@dataclass
class Totals:
    by_section: list[float]
    subtotal: float
    discount: float
    vat: float
    grand: float


def build_lines(p: Params) -> list[Line]:
    lines: list[Line] = []
    gravel_area = 0.0
    for si, s in enumerate(p.sections):
        main = s.kind == "main"
        a = s.area

        def add(code: str, qty: float, price: float | None = None) -> None:
            lines.append(Line(si, code, qty, PRICES[code]["price"] if price is None else price))

        if s.gravel:
            add("dismantle_ballast", a)
            gravel_area += a
        if s.cbp_sqm > 0:
            add("dismantle_cbp", s.cbp_sqm)
        if s.old_wp:
            add("remove_old_wp", a)
        if s.drain_leak:
            add("drain_leak_fix", 1)
        elif s.drains:
            add("drains", 1, PRICES["drains"]["price"] if main else PRICES["drains"]["extra"])
        if s.ac:
            add("ac_penetrations", 1)
        if main:
            add("prep", 1, 300 if a < 90 else 2000 if a > 300 else 500)
        else:
            add("prep", 1, 200 if a < 15 else 300)
        if s.joints_lm > 0:
            add("joints_lm", s.joints_lm)
        elif s.cracks:
            add("cracks_set", 1, PRICES["cracks_set"]["price"] if main else PRICES["cracks_set"]["extra"])
        if s.old_wp:
            add("primer", a)
        if a > 0:
            add("liquid_rubber", a)
        if s.cbp_sqm > 0:
            add("install_cbp", s.cbp_sqm)
        if s.tiles:
            add("tiles_replace", 1)
        add("water_test", 1)

    trips = p.debris if p.debris is not None else (
        (2 if gravel_area <= 130 else math.ceil(gravel_area / 60)) if gravel_area > 0 else 0)
    if trips and p.sections:
        lines.append(Line(0, "debris", trips, PRICES["debris"]["price"]))
    return lines


def duration_days(p: Params) -> int:
    if p.duration:
        return p.duration
    total = sum(s.area for s in p.sections)
    return 12 if any(s.gravel for s in p.sections) or total > 200 else 7


def totals(p: Params, lines: list[Line], discount_pct: float = 0) -> Totals:
    by_sec = [round(sum(l.cost for l in lines if l.section == i), 2) for i in range(len(p.sections))]
    subtotal = round(sum(by_sec), 2)
    disc = round(subtotal * discount_pct / 100, 2)
    vat = round((subtotal - disc) * VAT, 2)
    return Totals(by_sec, subtotal, disc, vat, round(subtotal - disc + vat, 2))
