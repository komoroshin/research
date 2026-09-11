"""Прогноз цен day-ahead D-1 простой моделью: градиентный бустинг (sklearn HistGradientBoostingRegressor)
на лагах цен, погоде (Open-Meteo) и календаре. Схема: на утро D-1 известны цены до дня D-1 включительно
(они публикуются в 13:00 дня D-2), поэтому лаги — D-1, D-2, D-7 по тому же интервалу суток, а также средние.
Обучение: расширяющееся окно, переобучение раз в месяц, прогноз на следующий месяц (без утечки будущих цен).
Погода — реанализ (допущение: заменяет прогноз D-1, см. fetch_weather.py)."""
import numpy as np, pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor

ES_HOLIDAYS = {"2025-01-01","2025-01-06","2025-04-18","2025-05-01","2025-08-15","2025-10-12","2025-11-01","2025-12-06","2025-12-08","2025-12-25",
               "2026-01-01","2026-01-06","2026-04-03","2026-05-01","2026-08-15","2026-10-12","2026-11-01","2026-12-08","2026-12-25"}

def build_features(g: pd.DataFrame) -> pd.DataFrame:
    """g: единая 15-мин сетка с колонками ts (local), price, погода. Индекс — RangeIndex."""
    f = pd.DataFrame(index=g.index)
    f["tod"] = g.ts.dt.hour + g.ts.dt.minute / 60
    f["dow"] = g.ts.dt.dayofweek
    f["month"] = g.ts.dt.month
    f["holiday"] = g.ts.dt.strftime("%Y-%m-%d").isin(ES_HOLIDAYS).astype(int)
    f["doy"] = g.ts.dt.dayofyear
    key = g.ts.dt.strftime("%H:%M")
    date = g.ts.dt.normalize()
    piv = g.assign(key=key, date=date).pivot_table(index="date", columns="key", values="price")
    for lag in (1, 2, 7):
        lagged = piv.shift(lag)
        f[f"lag{lag}"] = [lagged.at[d, k] if (d in lagged.index and k in lagged.columns) else np.nan for d, k in zip(date, key)]
    dm = g.assign(date=date).groupby("date")["price"].agg(["mean", "max", "min"])
    for lag in (1, 2, 7):
        sh = dm.shift(lag)
        f[f"dmean{lag}"] = date.map(sh["mean"]).values
        f[f"dmax{lag}"] = date.map(sh["max"]).values
        f[f"dmin{lag}"] = date.map(sh["min"]).values
    for c in ("temperature_2m", "shortwave_radiation", "wind_speed_100m", "cloud_cover", "wind_nw", "rad_south"):
        f[c] = g[c].values
    # дневные агрегаты погоды дня D (известны из прогноза накануне — допущение)
    wd = g.assign(date=date).groupby("date")[["rad_south", "wind_nw"]].mean()
    f["rad_day"] = date.map(wd["rad_south"]).values
    f["wind_day"] = date.map(wd["wind_nw"]).values
    return f

def rolling_forecast(g: pd.DataFrame, first_month: str = "2025-04") -> np.ndarray:
    f = build_features(g)
    y = g.price.values
    pred = np.full(len(g), np.nan)
    months = pd.period_range(first_month, g.ts.max().to_period("M"), freq="M")
    per = g.ts.dt.to_period("M")
    ok = f.notna().all(axis=1).values
    for m in months:
        train = (per < m).values & ok
        test = (per == m).values & ok
        if train.sum() < 2000 or test.sum() == 0:
            continue
        model = HistGradientBoostingRegressor(max_iter=400, learning_rate=0.05, max_leaf_nodes=31,
                                              min_samples_leaf=40, l2_regularization=1.0, random_state=0)
        model.fit(f.values[train], y[train])
        pred[test] = model.predict(f.values[test])
    return pred
