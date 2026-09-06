"""Заполняет плейсхолдеры [BT_*] в passport.md и research/B_economics.md из результатов бэктеста."""
import pathlib, re, pandas as pd
ROOT = pathlib.Path(__file__).resolve().parents[1]
S = pd.read_csv(ROOT / "backtest/results/summary_eur_per_mw_year.csv", index_col=0)
M = pd.read_csv(ROOT / "backtest/results/monthly_eur_per_mw_year.csv", index_col=0)
summ = (ROOT / "backtest/results/summary.md").read_text()
fc_col = [c for c in S.columns if c.startswith("период с прогнозом")][0]
s = S[fc_col]; a = S["весь период"]
d_nr = (s["realistic"] / s["naive"] - 1) * 100
d_np = (a["perfect"] / a["naive"] - 1) * 100
share = s["realistic"] / s["perfect"] * 100
mae = re.search(r"MAE = ([\d.]+) €/МВтч, RMSE = ([\d.]+)", summ); mae7 = re.search(r"7 дней назад»: MAE = ([\d.]+)", summ)
solver = re.search(r"96 интервалов × 1 рынок: (\d+) мс; 192 интервала \(48 ч\): (\d+) мс; прокси 3 рынка × 48 ч \(576 интервалов\): (\d+) мс", summ)
y25 = S["2025 (янв–дек)"] if "2025 (янв–дек)" in S else None
y26 = S["2026 (янв–сен 4)"] if "2026 (янв–сен 4)" in S else None
q = S["15-мин режим (окт 2025–сен 2026)"]
d_pr = (s["realistic"] / s["persist"] - 1) * 100
share_p = s["persist"] / s["perfect"] * 100
verdict = (f"⚠️ формально подтверждено ({d_nr:+.0f} % против наивных окон по брифу), по сути опровергнуто: против простого правила «MILP на ценах D-1» прогноз даёт лишь {d_pr:+.1f} %"
           if d_nr >= 15 else "❌ опровергнуто (на day-ahead)")
repl = {
 "[BT_K2_VERDICT]": verdict,
 "[BT_K2_FACT]": (f"Бэктест 10 МВт/20 МВтч на OMIE 2025-01 — 2026-09 (610 дней): naive {a['naive']/1000:.0f} k€/МВт/год, perfect {a['perfect']/1000:.0f} k€ (Δ {d_np:+.0f} %); "
                  f"realistic (прогноз D-1, MAE {float(mae.group(1)):.1f} €/МВтч) {s['realistic']/1000:.0f} k€ против naive {s['naive']/1000:.0f} k€ на том же периоде — **Δ {d_nr:+.0f} %**, "
                  f"{share:.0f} % от perfect. **Простое правило persist** (тот же MILP на фактических ценах D-1, без прогноза) — {s['persist']/1000:.0f} k€ = {share_p:.0f} % от perfect: ценность в оптимизаторе и доступе к рынку, а не в «ИИ-прогнозе». Только day-ahead: без intraday/aFRR/mFRR (нет токена ESIOS). Гибкий доступ: запрет разряда в 10 % «худших» интервалов −{-(a['perfect_nodis10']/a['perfect']-1)*100:.0f} %, "
                  f"в 20 % — −{-(a['perfect_nodis20']/a['perfect']-1)*100:.0f} %; запрет заряда в вечерний пик — {-(a['perfect_nochg20']/a['perfect']-1)*100:.1f} %."),
 "[BT_K2_SHORT]": (", К2 формально (только против наивных окон)" if d_nr >= 15 else ""),
 "[BT_K2_SHORT2]": f"— оптимизатор даёт {d_nr:+.0f} % к наивным окнам, но ИИ-прогноз добавляет лишь {d_pr:+.1f} % к простому правилу на ценах D-1",
 "[BT_DPR]": f"{d_pr:+.1f}", "[BT_SHAREP]": f"{share_p:.0f}",
 "[BT_K8_FACT]": (f"По бэктесту DA-арбитраж 2 ч (perfect): 2025 — {y25['perfect']/1000:.0f} k€/МВт/год, 2026 (янв–сен) — {y26['perfect']/1000:.0f} k€; спреды в 2026 не сжимаются."),
 "[BT_SOLVER]": f"{solver.group(1)} мс на 96 интервалов, {solver.group(3)} мс на прокси 3 рынка × 48 ч",
 "[BT_P4]": f"{a['perfect_E40']/1000:.0f}", "[BT_P2]": f"{a['perfect']/1000:.0f}", "[BT_R2]": f"{s['realistic']/1000:.0f}",
 "[BT_RATIO4]": f"{a['perfect_E40']/a['perfect']:.2f}", "[BT_DNR]": f"{d_nr:+.0f}", "[BT_RMAE]": f"{float(mae.group(1))/float(mae7.group(1)):.2f}",
 "[BT_FEE]": f"{a['perfect']/1000*0.1:.0f}–{a['perfect']/1000*0.2:.0f}", "[BT_FEE25]": f"{a['perfect']/1000*0.1*25:.0f}–{a['perfect']/1000*0.2*25:.0f}",
 "[BT_SECTION]": (f"- **Данные:** OMIE day-ahead ES, 2025-01-01 — 2026-09-04, 610 дней (часовые до 30.09.2025, 15-мин с 01.10.2025). Батарея 10 МВт / 20 МВтч, КПД 88 %, ≤ 1,5 цикла/день.\n"
                  f"- **€/МВт/год, весь период:** naive {a['naive']/1000:.1f} k€ → perfect foresight {a['perfect']/1000:.1f} k€ (Δ {d_np:+.0f} %). На периоде с прогнозом (с 2025-04): naive {s['naive']/1000:.1f} k€ → realistic {s['realistic']/1000:.1f} k€ (**Δ {d_nr:+.0f} %**) → perfect {s['perfect']/1000:.1f} k€; realistic = {share:.0f} % от perfect.\n"
                  f"- **Прогноз D-1:** градиентный бустинг на лагах + погода + календарь, MAE {float(mae.group(1)):.1f} €/МВтч (наивный «как неделю назад» — {float(mae7.group(1)):.1f}); rMAE {float(mae.group(1))/float(mae7.group(1)):.2f} — на уровне литературы (LEAR/DNN 0,4–0,6).\n"
                  f"- **По годам (perfect, 2 ч):** 2025 — {y25['perfect']/1000:.0f} k€/МВт/год, 2026 янв–сен — {y26['perfect']/1000:.0f} k€; 15-мин режим (окт 2025 — сен 2026) — {q['perfect']/1000:.0f} k€. Спреды 2026 выше 2025 — окно пока открыто (К8 по DA не опровергается бэктестом; риск К8 — в aFRR и в объёме ввода после 2028).\n"
                  f"- **Гибкий доступ:** запрет разряда в 5/10/20 % интервалов вокруг вечернего пика — perfect −{-(a['perfect_nodis5']/a['perfect']-1)*100:.0f} / −{-(a['perfect_nodis10']/a['perfect']-1)*100:.0f} / −{-(a['perfect_nodis20']/a['perfect']-1)*100:.0f} %; запрет заряда там же — ≈ 0 % (батарея в пик не заряжается). По CNMC ограничение касается заряда → для 2-часовой батареи эффект мал, если ограничения не попадают в солнечный полдень (в перегруженных узлах — попадают; допущение).\n"
                  f"- **Чувствительность:** 4 ч — perfect {a['perfect_E40']/1000:.0f} k€/МВт/год, 1 ч — {a['perfect_E10']/1000:.0f} k€; КПД 85/92 % — {a['perfect_rte85']/1000:.0f}/{a['perfect_rte92']/1000:.0f} k€.\n"
                  f"- **Сравнение с бенчмарками:** наш DA-only perfect 2 ч ≈ {a['perfect']/1000:.0f} k€/МВт/год против публичных ~150–250 k€ (Modo/ION, стек с aFRR) и 85 k€ реального 2-часового 5 МВт актива Nexus/enspired (2025–26) — разрыв объясняется отсутствием aFRR/intraday в бэктесте и perfect-foresight; подробнее `research/B_economics.md`.\n"
                  f"- **Простое правило persist** (MILP на фактических ценах D-1, без прогноза — доступно любому representante): {s['persist']/1000:.1f} k€/МВт/год = {share_p:.0f} % от perfect; ML-прогноз добавляет к нему **{d_pr:+.1f} %**.\n"
                  f"- **Вывод для К2:** против фиксированных окон по брифу оптимизатор даёт {d_nr:+.0f} % (порог 15 % пройден), но почти вся ценность — в самой оптимизации по известному профилю D-1, а не в прогнозе: «ИИ-прогноз 15-минутных цен» как ядро продукта стоит ~2 % выручки DA-арбитража (≈ {(s['realistic']-s['persist'])/1000:.1f} k€/МВт/год, для актива 25 МВт ≈ {(s['realistic']-s['persist'])/1000*25:.0f} k€/год до вычета доли)."),
}
for p in (ROOT / "passport.md", ROOT / "research/B_economics.md"):
    if not p.exists(): continue
    t = p.read_text()
    for k, v in repl.items(): t = t.replace(k, v)
    p.write_text(t)
    left = re.findall(r"\[BT_[A-Z0-9_]+\]", t)
    print(p.name, "unfilled:", left)
print(f"naive→realistic {d_nr:+.1f}% ; naive→perfect {d_np:+.1f}% ; share {share:.1f}%")
