"""Бэктест стратегий диспетчеризации BESS на ценах day-ahead OMIE (Испания), 2025-01-01 … последняя дата.
Выход: backtest/results/summary.md, results/*.png, results/daily.csv, results/monthly.csv.
Запуск: python3 run_backtest.py  (перед этим fetch_omie.py, fetch_weather.py)."""
import json, pathlib, time, sys
import numpy as np, pandas as pd
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from strategies import Battery, naive_schedule, milp_schedule, revenue, DT
from forecast import rolling_forecast

ROOT = pathlib.Path(__file__).resolve().parents[1]
RES = ROOT / "backtest" / "results"; RES.mkdir(exist_ok=True, parents=True)


def load_grid() -> pd.DataFrame:
    pr = pd.read_parquet(ROOT / "data/processed/prices.parquet")
    # единая 15-мин сетка: часовые дни → 4 одинаковых блока
    hourly = pr[pr.mtu_min == 60]
    q = pd.concat([hourly.assign(ts_utc=hourly.ts_utc + pd.Timedelta(minutes=k)) for k in (0, 15, 30, 45)])
    g = pd.concat([q, pr[pr.mtu_min == 15]]).sort_values("ts_utc").reset_index(drop=True)
    g["ts"] = g.ts_utc.dt.tz_convert("Europe/Madrid").dt.tz_localize(None)
    g = g.rename(columns={"price_es": "price"})[["ts_utc", "ts", "price", "mtu_min"]]
    wp = ROOT / "data/processed/weather.parquet"
    if wp.exists():
        w = pd.read_parquet(wp)
        w15 = w.set_index("ts_utc").resample("15min").interpolate().reset_index()
        g = g.merge(w15, on="ts_utc", how="left")
    else:
        for c in ("temperature_2m", "shortwave_radiation", "wind_speed_100m", "cloud_cover", "wind_nw", "rad_south"):
            g[c] = np.nan
    import os
    if os.environ.get("BT_DAYS"):
        g = g[g.ts_utc < g.ts_utc.min() + pd.Timedelta(days=int(os.environ["BT_DAYS"]))]
    g["date"] = g.ts.dt.date
    g["tod"] = g.ts.dt.hour + g.ts.dt.minute / 60
    return g


def flex_masks(tod: np.ndarray, share: float) -> np.ndarray:
    """Маска «худших для сети» интервалов: доля share суток вокруг вечернего пика (центр 20:30) — допущение."""
    n = len(tod); k = int(round(share * n))
    centre = 20.5
    order = np.argsort(np.abs(tod - centre))
    m = np.zeros(n, bool); m[order[:k]] = True
    return m


def run_day(p, tod, bat, fc=None, flex_shares=(0.05, 0.10, 0.20), full=True):
    out = {}
    out["naive"] = revenue(naive_schedule(p, tod, bat), p)
    out["perfect"] = revenue(milp_schedule(p, bat), p)
    if fc is not None and not np.isnan(fc).any():
        out["realistic"] = revenue(milp_schedule(fc, bat), p)
    if full:
        for s in flex_shares:
            m = flex_masks(tod, s)
            out[f"perfect_nodis{int(s*100)}"] = revenue(milp_schedule(p, bat, no_discharge=m), p)
            out[f"perfect_nochg{int(s*100)}"] = revenue(milp_schedule(p, bat, no_charge=m), p)
            if "realistic" in out:
                out[f"realistic_nodis{int(s*100)}"] = revenue(milp_schedule(fc, bat, no_discharge=m), p)
                out[f"realistic_nochg{int(s*100)}"] = revenue(milp_schedule(fc, bat, no_charge=m), p)
    return out


def main():
    t_start = time.time()
    g = load_grid()
    if "--from-daily" in sys.argv:
        daily = pd.read_csv(RES / "daily.csv", index_col=0, parse_dates=True)
        meta = json.loads((RES / "meta.json").read_text())
        daily = add_persist(daily, g, Battery())
        daily.to_csv(RES / "daily.csv")
        postprocess(daily, g, meta["fc_stats"], meta["solver"], Battery(), meta.get("elapsed_s", 0))
        return
    have_weather = g["rad_south"].notna().mean() > 0.9
    print("grid rows", len(g), "weather", have_weather)
    if have_weather:
        g["fc"] = rolling_forecast(g)
        m = g.fc.notna()
        err = (g.price - g.fc)[m]
        fc_stats = {"MAE": float(err.abs().mean()), "RMSE": float(np.sqrt((err**2).mean())),
                    "rMAE_vs_lag7": float(err.abs().mean() / (g.price - g.lag7)[m].abs().mean()) if "lag7" in g else None,
                    "n": int(m.sum()), "from": str(g.ts[m].min().date())}
        # rMAE относительно наивного прогноза «как неделю назад»
        piv = g.pivot_table(index="date", columns=g.ts.dt.strftime("%H:%M"), values="price")
        lag7 = piv.shift(7)
        l7 = np.array([lag7.at[d, k] if d in lag7.index else np.nan for d, k in zip(g.date, g.ts.dt.strftime("%H:%M"))])
        mm = m & ~np.isnan(l7)
        fc_stats["rMAE_vs_lag7"] = float((g.price - g.fc)[mm].abs().mean() / (g.price - l7)[mm].abs().mean())
        fc_stats["MAE_lag7"] = float((g.price - l7)[mm].abs().mean())
        print("forecast", fc_stats)
    else:
        g["fc"] = np.nan; fc_stats = None

    bat = Battery()
    rows = []
    for d, day in g.groupby("date"):
        p = day.price.values; tod = day.tod.values; fc = day.fc.values
        r = run_day(p, tod, bat, fc)
        # чувствительность: длительность 1/4 ч и КПД 85/92 % — только naive/perfect/realistic
        for e in (10.0, 40.0):
            b2 = Battery(e_mwh=e)
            rr = run_day(p, tod, b2, fc, full=False)
            for k, v in rr.items(): r[f"{k}_E{int(e)}"] = v
        for rte in (0.85, 0.92):
            b2 = Battery(rte=rte)
            rr = run_day(p, tod, b2, fc, full=False)
            for k, v in rr.items(): r[f"{k}_rte{int(rte*100)}"] = v
        r["date"] = d; r["n"] = len(day); r["mean_price"] = p.mean(); r["spread"] = p.max() - p.min()
        rows.append(r)
    daily = pd.DataFrame(rows).set_index("date")
    daily.index = pd.to_datetime(daily.index)
    daily = add_persist(daily, g, bat)
    daily.to_csv(RES / "daily.csv")
    # замер солвера
    day = g[g.date == g.date.max()]
    p = day.price.values
    t0 = time.time(); milp_schedule(p, bat); t1 = time.time()
    p48 = np.concatenate([g[g.date == sorted(g.date.unique())[-2]].price.values, p])
    t2 = time.time(); milp_schedule(p48, bat); t3 = time.time()
    solver = {"milp_96_s": t1 - t0, "milp_192_s": t3 - t2}
    # 3 рынка × 48 ч: имитация — DA + два резервных продукта как дополнительные интервалы (грубая оценка размерности)
    rng = np.random.default_rng(0)
    p3 = np.concatenate([p48, p48 * 0.5 + rng.normal(0, 5, len(p48)), p48 * 0.3 + rng.normal(0, 5, len(p48))])
    t4 = time.time(); milp_schedule(p3, Battery(cycles_per_day=4.5)); t5 = time.time()
    solver["milp_576vars_proxy_s"] = t5 - t4
    (RES / "meta.json").write_text(json.dumps({"fc_stats": fc_stats, "solver": solver, "elapsed_s": time.time() - t_start}, ensure_ascii=False, indent=1))
    postprocess(daily, g, fc_stats, solver, bat, time.time() - t_start)


def add_persist(daily, g, bat):
    """Бенчмарк «простое правило»: MILP на ценах дня D-1 (персистентный прогноз, известен к 12:00 D-1) — то, что умеет любой representante."""
    days = sorted(g.date.unique())
    prev = None; vals = {}
    for d in days:
        p = g[g.date == d].price.values
        if prev is not None and len(prev) == len(p):
            vals[pd.Timestamp(d)] = revenue(milp_schedule(prev, bat), p)
        prev = p
    daily["persist"] = pd.Series(vals)
    return daily


def postprocess(daily, g, fc_stats, solver, bat, elapsed):
    cols = [c for c in daily.columns if c not in ("n", "mean_price", "spread")]
    monthly = daily[cols].resample("MS").sum(min_count=1)
    days_in_month = daily["n"].resample("MS").count()
    # аннуализация: €/МВт/год = сумма за месяц / дней × 365 / P (по доступным дням каждой колонки)
    ann = monthly.div(daily[cols].resample("MS").count()) * 365 / bat.p_mw
    ann["days"] = days_in_month
    ann.round(0).to_csv(RES / "monthly_eur_per_mw_year.csv")

    def annual(sub):
        return sub[cols].sum() / sub[cols].count() * 365 / bat.p_mw

    periods = {"весь период": daily}
    for lab, a, b in (("2025 (янв–дек)", "2025-01-01", "2025-12-31"), ("2026 (янв–сен 4)", "2026-01-01", "2026-12-31"),
                      ("15-мин режим (окт 2025–сен 2026)", "2025-10-01", "2026-12-31")):
        sub = daily.loc[a:b]
        if len(sub): periods[lab] = sub
    rl = daily[daily.realistic.notna()] if "realistic" in daily else daily.iloc[0:0]
    if len(rl):
        periods["период с прогнозом (с %s)" % rl.index.min().date()] = rl
    summ = pd.DataFrame({k: annual(v) for k, v in periods.items()})
    summ.round(0).to_csv(RES / "summary_eur_per_mw_year.csv")

    fig, ax = plt.subplots(figsize=(11, 5))
    for c, lab in (("naive", "naive (окна 12–16/19–23)"), ("persist", "persist (MILP на ценах D-1)"), ("realistic", "realistic (прогноз D-1)"), ("perfect", "perfect foresight")):
        if c in ann: ax.plot(ann.index, ann[c] / 1000, marker="o", label=lab)
    ax.set_ylabel("k€/МВт/год (аннуализировано по месяцу)"); ax.set_title("BESS 10 МВт/20 МВтч, day-ahead OMIE ES, арбитраж")
    ax.grid(alpha=.3); ax.legend(); fig.autofmt_xdate(); fig.tight_layout(); fig.savefig(RES / "monthly_strategies.png", dpi=130)
    fig, ax = plt.subplots(figsize=(11, 4))
    ax.plot(daily.index, daily.spread, lw=.7); ax.set_title("Дневной спред day-ahead (max−min), €/МВтч"); ax.grid(alpha=.3)
    fig.tight_layout(); fig.savefig(RES / "daily_spread.png", dpi=130)
    write_summary(summ, ann, daily, fc_stats, solver, bat, g, elapsed)


def write_summary(summ, ann, daily, fc_stats, solver, bat, g, elapsed):
    L = []
    L.append("# Бэктест: арбитраж BESS на day-ahead OMIE (Испания)\n")
    L.append(f"Данные: OMIE marginalpdbc, {g.ts.min().date()} — {g.ts.max().date()} ({daily.shape[0]} дней; "
             f"часовые до 30.09.2025, 15-мин с 01.10.2025; отсутствуют 2025-10-30 и 2025-11-27 — файлы OMIE недоступны, HTTP 404). "
             "Источник: https://www.omie.es/es/file-access-list (обращение 2026-09-05).\n")
    L.append("Стратегии: naive — фиксированные окна 12–16/19–23; persist — MILP на ценах дня D-1 (простое правило, доступно любому representante); realistic — MILP на прогнозе D-1 (бустинг); perfect — MILP на факте (верхняя граница). Аннуализация каждой колонки — по её доступным дням (realistic — с 2025-04).\n")
    L.append(f"Батарея: {bat.p_mw:.0f} МВт / {bat.e_mwh:.0f} МВтч, КПД {bat.rte*100:.0f} %, ≤ {bat.cycles_per_day} цикла/день, "
             f"штраф деградации {bat.deg_cost} €/МВтч (допущение). Только day-ahead, без intraday и балансирующих рынков (нет токена ESIOS).\n")
    L.append("## Выручка по стратегиям, €/МВт/год (аннуализация: сумма/дни×365)\n")
    keep = [r for r in summ.index if not any(x in r for x in ("_E", "_rte", "nodis", "nochg"))]
    L.append(summ.loc[keep].round(0).astype(int).to_markdown() + "\n")
    base = summ.iloc[:, -1] if "realistic" in summ.index else summ["весь период"]
    col = [c for c in summ.columns if c.startswith("период с прогнозом")]
    if col:
        s = summ[col[0]]
        L.append("### Ключевые соотношения (период с прогнозом)\n")
        L.append(f"- Дельта naive → realistic: **{(s['realistic']/s['naive']-1)*100:+.1f} %** ({s['naive']:.0f} → {s['realistic']:.0f} €/МВт/год)")
        L.append(f"- Дельта naive → perfect: **{(s['perfect']/s['naive']-1)*100:+.1f} %**")
        L.append(f"- Простое правило persist (MILP на ценах D-1) → realistic: **{(s['realistic']/s['persist']-1)*100:+.1f} %** ({s['persist']:.0f} → {s['realistic']:.0f}); persist = {s['persist']/s['perfect']*100:.1f} % от perfect")
        L.append(f"- Доля realistic от perfect: **{s['realistic']/s['perfect']*100:.1f} %**\n")
    s = summ["весь период"]
    L.append(f"- Дельта naive → perfect за весь период: **{(s['perfect']/s['naive']-1)*100:+.1f} %**\n")
    if fc_stats:
        L.append("## Качество прогноза D-1 (HistGradientBoosting, лаги + погода + календарь, переобучение помесячно)\n")
        L.append(f"- MAE = {fc_stats['MAE']:.2f} €/МВтч, RMSE = {fc_stats['RMSE']:.2f} €/МВтч, n = {fc_stats['n']} интервалов с {fc_stats['from']}")
        L.append(f"- Наивный прогноз «как 7 дней назад»: MAE = {fc_stats['MAE_lag7']:.2f} €/МВтч; rMAE модели = {fc_stats['rMAE_vs_lag7']:.2f}\n")
    L.append("## Сценарии гибкого доступа (доля интервалов суток вокруг вечернего пика 20:30 — допущение), €/МВт/год, весь период\n")
    rows = []
    for s_ in (5, 10, 20):
        for kind, lab in (("nodis", "запрет разряда"), ("nochg", "запрет заряда")):
            pk = f"perfect_{kind}{s_}"; rk = f"realistic_{kind}{s_}"
            rows.append({"сценарий": f"{s_} % часов, {lab}",
                         "perfect": summ.at[pk, "весь период"], "perfect Δ%": (summ.at[pk, "весь период"] / summ.at["perfect", "весь период"] - 1) * 100,
                         "realistic": summ.at[rk, col[0]] if (col and rk in summ.index) else np.nan,
                         "realistic Δ%": (summ.at[rk, col[0]] / summ.at["realistic", col[0]] - 1) * 100 if (col and rk in summ.index) else np.nan})
    L.append(pd.DataFrame(rows).set_index("сценарий").round(1).to_markdown() + "\n")
    L.append("## Чувствительность (весь период; realistic — период с прогнозом), €/МВт/год\n")
    rows = []
    for tag, lab in (("", "2 ч, 88 %"), ("_E10", "1 ч (10 МВтч)"), ("_E40", "4 ч (40 МВтч)"), ("_rte85", "КПД 85 %"), ("_rte92", "КПД 92 %")):
        rows.append({"вариант": lab, "naive": summ.at["naive" + tag, "весь период"], "perfect": summ.at["perfect" + tag, "весь период"],
                     "realistic": summ.at["realistic" + tag, col[0]] if col else np.nan,
                     "Δ naive→perfect %": (summ.at["perfect" + tag, "весь период"] / summ.at["naive" + tag, "весь период"] - 1) * 100})
    L.append(pd.DataFrame(rows).set_index("вариант").round(0).to_markdown() + "\n")
    L.append("## Помесячно, €/МВт/год\n")
    mcols = [c for c in ("naive", "persist", "realistic", "perfect", "days") if c in ann]
    L.append(ann[mcols].round(0).to_markdown() + "\n")
    L.append("## Солвер (HiGHS через scipy.optimize.milp, бинарные режимы заряд/разряд)\n")
    L.append(f"- 96 интервалов × 1 рынок: {solver['milp_96_s']*1000:.0f} мс; 192 интервала (48 ч): {solver['milp_192_s']*1000:.0f} мс; "
             f"прокси 3 рынка × 48 ч (576 интервалов): {solver['milp_576vars_proxy_s']*1000:.0f} мс. Полный прогон бэктеста: {elapsed/60:.1f} мин.\n")
    L.append("## Ограничения и допущения\n")
    L.append("- Только day-ahead: нет intraday (SIDC), aFRR/mFRR, механизма мощности — реальный стек выше.\n"
             "- Погода — реанализ, а не прогноз D-1 (утечка в пользу realistic; допущение ≈ 1–3 п.п.).\n"
             "- Дневная оптимизация, SoC 0 в начале дня, остаток не переносится (консервативно для perfect на 1–2 %).\n"
             "- Наивная стратегия — фиксированные окна 12–16 / 19–23 (по брифу), она реалистична для «EMS без оптимизатора» лишь частично.\n"
             "- Прогноз обучен с 2025-01, первые прогнозы с 2025-04; 15-мин истории < 1 года.\n")
    (RES / "summary.md").write_text("\n".join(L))
    print("\n".join(L[:12]))


if __name__ == "__main__":
    main()
