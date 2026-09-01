#!/usr/bin/env python3
"""Отбирает кейсы из базы под питч: по отраслям, с оценкой пригодности.

Питчу нужен не любой кейс, а тот, который выдержит проверку аналитиком
партнёра. Поэтому ранг считается не по яркости цифры, а по её доказуемости:
измеренная метрика с источником, независимый (не вендорский) источник,
названный клиент, свежесть.

Запуск:
    python3 _pick_cases.py                  # по всем отраслям, топ-3
    python3 _pick_cases.py energy-utilities telecom manufacturing
    python3 _pick_cases.py --top 5 finance-insurance
"""
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parents[2] / "data" / "cases.json"
GRADE_POINTS = {"A": 3.0, "B": 1.5, "C": 0.0}


def latest_year(case):
    """Самый поздний год, упомянутый в сроках проекта или датах источников."""
    text = case.get("timeline") or ""
    years = [int(y) for y in re.findall(r"(20\d{2})", text)]
    years += [
        int(m.group(1))
        for s in case.get("sources", [])
        if (m := re.match(r"(20\d{2})", str(s.get("date") or "")))
    ]
    return max(years) if years else None


def headline(case):
    """Метрика для слайда: сначала измеренная, потом любая с источником."""
    metrics = case.get("metrics") or []
    for want in ("measured", None):
        for m in metrics:
            if want and m.get("status") != want:
                continue
            if not m.get("source_url"):
                continue
            base, res = (m.get("baseline") or "").strip(), (m.get("result") or "").strip()
            empty = {"", "0", "1x", "unknown", "n/a", "—"}
            arrow = f"{base} → {res}" if base.lower() not in empty else res
            return f"{m.get('metric_name')}: {arrow}".strip()
    return None


def score(case):
    """Пригодность для питча. Возвращает (балл, список слабых мест)."""
    pts, weak = 0.0, []
    metrics = case.get("metrics") or []

    measured = [m for m in metrics if m.get("status") == "measured" and m.get("source_url")]
    if measured:
        pts += 4.0
    elif any(m.get("source_url") for m in metrics):
        pts += 1.5
        weak.append("метрики заявлены, но не измерены")
    else:
        weak.append("нет метрики с источником")

    pts += GRADE_POINTS.get(case.get("evidence_grade"), 0.0)
    if case.get("evidence_grade") == "C":
        weak.append("грейд C")

    if case.get("vendor_claim"):
        weak.append("источник — сторона проекта")
    else:
        pts += 2.0

    if case.get("client_disclosed"):
        pts += 1.0
    else:
        weak.append("клиент не раскрыт")

    if len(case.get("sources") or []) > 1:
        pts += 1.0
    else:
        weak.append("единственный источник")

    pts += 0.4 * (case.get("sales_relevance") or 0)

    year = latest_year(case)
    if year:
        pts += max(0.0, 2.0 - 0.4 * (2026 - year))
        if year <= 2021:
            weak.append(f"данные {year} года")
    else:
        weak.append("срок не указан")

    return round(pts, 1), weak


def main():
    args = [a for a in sys.argv[1:]]
    top = 3
    if "--top" in args:
        i = args.index("--top")
        top = int(args[i + 1])
        del args[i : i + 2]

    cases = json.load(DATA.open(encoding="utf-8"))
    industries = args or sorted({c.get("industry") for c in cases if c.get("industry")})

    for industry in industries:
        pool = [c for c in cases if c.get("industry") == industry]
        if not pool:
            print(f"\n## {industry} — нет кейсов\n")
            continue
        ranked = sorted(pool, key=lambda c: score(c)[0], reverse=True)
        print(f"\n## {industry} — {len(pool)} кейсов в базе\n")
        for case in ranked[:top]:
            pts, weak = score(case)
            print(f"**{case['title']}**")
            print(f"`{case['id']}` · {case.get('client')} · {case.get('country')} "
                  f"· грейд {case.get('evidence_grade')} · балл {pts}")
            if h := headline(case):
                print(f"- Цифра: {h}")
            if hyp := case.get("entry_hypothesis"):
                print(f"- Гипотеза входа: {hyp}")
            print(f"- Слабые места: {'; '.join(weak) if weak else 'не вижу'}")
            print()


if __name__ == "__main__":
    main()
