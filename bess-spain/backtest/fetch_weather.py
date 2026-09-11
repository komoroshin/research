"""Погодные признаки для прогноза цен: Open-Meteo Archive API (реанализ ERA5/ECMWF IFS, лицензия CC-BY 4.0,
https://open-meteo.com/en/docs/historical-weather-api, дата обращения 2026-09-05).
Historical Forecast API (архив прогнозов) через прокси сессии отдавал HTTP 429/SSL EOF — не использован.
Точки: Мадрид, Севилья (солнце), Сарагоса, Ла-Корунья (ветер). Запросы помесячно через curl (длинные рвутся через прокси).
Результат: data/processed/weather.parquet (часовые значения, UTC): temperature_2m, shortwave_radiation,
wind_speed_100m, cloud_cover (среднее по точкам), wind_nw (Сарагоса+Корунья), rad_south (Мадрид+Севилья).
Допущение: используется ФАКТИЧЕСКАЯ погода (реанализ), а не прогноз D-1; ошибка прогноза погоды на 24–36 ч мала
относительно ошибки прогноза цен, но результат realistic-стратегии из-за этого чуть оптимистичен (≈ 1–3 п.п., допущение).
"""
import concurrent.futures as cf, json, pathlib, subprocess, time
import pandas as pd

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "weather"; RAW.mkdir(parents=True, exist_ok=True)
OUT = ROOT / "data" / "processed" / "weather.parquet"
POINTS = {"madrid": (40.42, -3.70), "sevilla": (37.39, -5.99), "zaragoza": (41.65, -0.88), "coruna": (43.36, -8.41)}
VARS = "temperature_2m,shortwave_radiation,wind_speed_100m,cloud_cover"
END = pd.Timestamp("2026-09-04").date()


def fetch(job):
    n, lat, lon, m = job
    p = RAW / f"{n}_{m}.json"
    if p.exists() and p.stat().st_size > 1000:
        return p
    s = m.start_time.date(); e = min(m.end_time.date(), END)
    url = (f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}"
           f"&start_date={s}&end_date={e}&hourly={VARS}&timezone=UTC")
    for a in range(8):
        r = subprocess.run(["curl", "-sS", "--max-time", "60", "-o", str(p), url], capture_output=True, text=True)
        if r.returncode == 0 and p.exists() and p.stat().st_size > 1000 and '"hourly"' in p.read_text()[:2000]:
            return p
        time.sleep(3 * (a + 1))
    print("FAIL", n, m); return None


def main():
    months = pd.period_range("2024-12", "2026-09", freq="M")
    jobs = [(n, lat, lon, m) for n, (lat, lon) in POINTS.items() for m in months]
    with cf.ThreadPoolExecutor(3) as ex:
        paths = [p for p in ex.map(fetch, jobs) if p]
    frames = []
    for p in paths:
        h = json.loads(p.read_text())["hourly"]
        d = pd.DataFrame(h).rename(columns={"time": "ts_utc"}); d["point"] = p.name.split("_")[0]; frames.append(d)
    df = pd.concat(frames); df["ts_utc"] = pd.to_datetime(df.ts_utc, utc=True)
    df = df.drop_duplicates(["ts_utc", "point"])
    agg = df.groupby("ts_utc")[["temperature_2m", "shortwave_radiation", "wind_speed_100m", "cloud_cover"]].mean()
    wind = df[df.point.isin(["zaragoza", "coruna"])].groupby("ts_utc")["wind_speed_100m"].mean().rename("wind_nw")
    sol = df[df.point.isin(["sevilla", "madrid"])].groupby("ts_utc")["shortwave_radiation"].mean().rename("rad_south")
    out = agg.join(wind).join(sol).reset_index().sort_values("ts_utc")
    out.to_parquet(OUT, index=False)
    print("files", len(paths), "/", len(jobs), "weather rows", len(out), out.ts_utc.min(), out.ts_utc.max(), "na", int(out.isna().sum().sum()))


if __name__ == "__main__":
    main()
