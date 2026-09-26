"""Скачивание цен day-ahead OMIE (Испания) из публичных файлов marginalpdbc.

Формат файла marginalpdbc_YYYYMMDD.1:
  MARGINALPDBC;
  YYYY;MM;DD;period;price_PT;price_ES;
  ...
  *
Период: час (1..24, DST 23/25) до 30.09.2025, 15 минут (1..96) с 01.10.2025.
Источник: https://www.omie.es/es/file-access-list (файлы публичные, дата обращения 2026-09-05).
Результат: data/processed/prices.parquet (колонки: ts (Europe/Madrid, tz-naive local), price_es, price_pt, mtu_min).
"""
import concurrent.futures as cf
import datetime as dt
import io
import pathlib
import sys
import time

import pandas as pd
import requests

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "omie"
OUT = ROOT / "data" / "processed" / "prices.parquet"
URL = "https://www.omie.es/es/file-download?parents%5B0%5D=marginalpdbc&filename=marginalpdbc_{d}.1"


def fetch_day(day: dt.date) -> pathlib.Path | None:
    RAW.mkdir(parents=True, exist_ok=True)
    p = RAW / f"marginalpdbc_{day:%Y%m%d}.1"
    if p.exists() and p.read_text(errors="ignore").startswith("MARGINALPDBC"):
        return p
    for attempt in range(4):
        try:
            r = requests.get(URL.format(d=f"{day:%Y%m%d}"), timeout=60)
            if r.status_code == 200 and r.text.startswith("MARGINALPDBC"):
                p.write_text(r.text)
                return p
            if r.status_code == 404:
                return None
        except requests.RequestException:
            pass
        time.sleep(2 ** attempt)
    return None


def parse(p: pathlib.Path) -> pd.DataFrame:
    rows = []
    for line in p.read_text().splitlines()[1:]:
        parts = [x for x in line.strip().split(";") if x != ""]
        if len(parts) < 6 or not parts[0].isdigit():
            continue
        y, m, d, per = map(int, parts[:4])
        rows.append((dt.date(y, m, d), per, float(parts[4]), float(parts[5])))
    df = pd.DataFrame(rows, columns=["date", "period", "price_pt", "price_es"])
    n = len(df)
    mtu = 60 if n <= 25 else 15
    # локальное время: периоды идут подряд в местном времени (DST-дни имеют 23/25 ч или 92/100 блоков)
    day_local = pd.Timestamp(df["date"].iloc[0]).tz_localize("Europe/Madrid")
    ts_utc = day_local.tz_convert("UTC") + pd.to_timedelta((df["period"] - 1) * mtu, unit="min")
    df["ts_utc"] = ts_utc
    df["ts"] = ts_utc.dt.tz_convert("Europe/Madrid").dt.tz_localize(None)
    df["mtu_min"] = mtu
    return df[["ts_utc", "ts", "price_es", "price_pt", "mtu_min"]]


def main(start="2025-01-01", end=None):
    start = dt.date.fromisoformat(start)
    end = dt.date.fromisoformat(end) if end else dt.date.today() - dt.timedelta(days=1)
    days = [start + dt.timedelta(days=i) for i in range((end - start).days + 1)]
    with cf.ThreadPoolExecutor(8) as ex:
        paths = list(ex.map(fetch_day, days))
    missing = [d for d, p in zip(days, paths) if p is None]
    frames = [parse(p) for p in paths if p is not None]
    df = pd.concat(frames).sort_values("ts_utc").reset_index(drop=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(OUT, index=False)
    print(f"days ok={len(frames)} missing={len(missing)} rows={len(df)} range={df.ts.min()}..{df.ts.max()}")
    if missing:
        print("missing:", [str(d) for d in missing][:20])


if __name__ == "__main__":
    main(*sys.argv[1:])
