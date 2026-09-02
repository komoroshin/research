#!/usr/bin/env python3
"""Финмодель-отправная точка: AI-native инженерия подключения (дека grid).

Рычаги вынесены наверх и помечены как допущения. Модель отвечает не «сколько
заработаем», а «что должен измерить шаг 1» и «сходится ли ask с потребностью».

    python3 _finmodel_grid.py > grid-engineering-finmodel.md
"""

# ---- Константы из деки и отчётов (источник в скобках) ----------------------
BILLABLE_HOURS = 2000        # оплачиваемых часов на инженера в год (ic7-5, допущение)
RATE_LOW, RATE_HIGH = 30, 40 # $/час при субподряде у EPC (ic7-5: ≤30–40)
OFFSHORE_FLOOR = 8           # индийский офшор, $/час (ic7-5) — ценовой пол
AI_TEAM_COST = 1.2e6         # ИИ-ядро: 8–10 разработчиков в год, $ (допущение)
ASK_TOTAL = 10e6             # ask сдержанной деки (grid)
ASK_VISION = 30e6            # ask вижн-деки: ядро + 5 фирм + роботы

# ---- Рычаги-допущения ---------------------------------------------------------
SCENARIOS = {
    "консервативный": dict(uplift=1.2, engineers=30, rate=RATE_LOW,
                           cost_eng=45e3, multiple=1.2),
    "базовый":        dict(uplift=1.5, engineers=40, rate=35,
                           cost_eng=40e3, multiple=1.0),
    "оптимистичный":  dict(uplift=2.0, engineers=50, rate=RATE_HIGH,
                           cost_eng=35e3, multiple=0.8),
}
# uplift    — рост выработки инженера с ИИ-ядром (шаг 1 измеряет; допущение)
# engineers — штат купленной фирмы (шаг 2)
# cost_eng  — полная стоимость инженера в год, Залив/Индия, $ (допущение)
# multiple  — цена покупки фирмы в годовых выручках (допущение: малый
#             инжиниринг торгуется около 0,5–1,2× выручки)
OVERHEAD = 0.25              # не-инженерные расходы фирмы, доля от ФОТ инженеров (допущение)
RAMP = 0.6                   # доля полной выработки в первый год после покупки (допущение)


def scenario(name, p):
    rev_per_eng = p["rate"] * BILLABLE_HOURS            # без ИИ
    rev_per_eng_ai = rev_per_eng * p["uplift"]          # с ядром
    firm_rev = p["engineers"] * rev_per_eng             # выручка фирмы до покупки
    price = firm_rev * p["multiple"]
    run_rate = p["engineers"] * rev_per_eng_ai
    cost = p["engineers"] * p["cost_eng"] * (1 + OVERHEAD) + AI_TEAM_COST
    margin = (run_rate - cost) / run_rate
    # Потребность в капитале за 24 мес.: ядро 6 мес. + покупка + недобор в первый год
    year1_rev = run_rate * RAMP
    year1_gap = max(0.0, cost - year1_rev)
    need = AI_TEAM_COST * 0.5 + price + year1_gap + 0.5e6  # + резерв на сделку
    eng_for_10m = 10e6 / rev_per_eng_ai
    return dict(name=name, rev_per_eng=rev_per_eng, rev_per_eng_ai=rev_per_eng_ai,
                firm_rev=firm_rev, price=price, run_rate=run_rate, cost=cost,
                margin=margin, need=need, eng_for_10m=eng_for_10m, **p)


def m(x):
    return f"{x/1e6:.1f} млн $"


rows = [scenario(k, v) for k, v in SCENARIOS.items()]

print("# Финмодель-отправная точка: инженерия подключения с ИИ внутри\n")
print("Дата: 01.09.2026. Генерируется `_finmodel_grid.py`; рычаги — вверху скрипта,")
print("каждый помечен как допущение. Не прогноз, а карта того, что должен")
print("измерить шаг 1 и сходится ли ask деки с потребностью в капитале.\n")
print("## Константы (с источником)\n")
print(f"- Оплачиваемых часов на инженера: {BILLABLE_HOURS} в год (ic7-5, допущение).")
print(f"- Ставка при субподряде у EPC: {RATE_LOW}–{RATE_HIGH} $/час (ic7-5); "
      f"ценовой пол индийского офшора — {OFFSHORE_FLOOR} $/час.")
print(f"- ИИ-ядро: {m(AI_TEAM_COST)} в год на команду разработки (допущение).")
print(f"- Ask деки: {m(ASK_TOTAL)} тремя шагами.\n")
print("## Сценарии\n")
print("| Рычаг | " + " | ".join(r["name"] for r in rows) + " |")
print("|---|" + "---|" * len(rows))
def line(label, f):
    print(f"| {label} | " + " | ".join(f(r) for r in rows) + " |")
line("Рост выработки с ИИ (допущение)", lambda r: f"×{r['uplift']}")
line("Штат купленной фирмы", lambda r: f"{r['engineers']}")
line("Ставка, $/час", lambda r: f"{r['rate']}")
line("Выручка на инженера без ИИ", lambda r: f"{r['rev_per_eng']/1e3:.0f} тыс. $")
line("Выручка на инженера с ИИ", lambda r: f"{r['rev_per_eng_ai']/1e3:.0f} тыс. $")
line("Выручка фирмы до покупки", lambda r: m(r["firm_rev"]))
line("Цена покупки (× выручки, допущение)", lambda r: f"{m(r['price'])} (×{r['multiple']})")
line("Run-rate после интеграции", lambda r: m(r["run_rate"]))
line("Расходы в год (инженеры + overhead + ядро)", lambda r: m(r["cost"]))
line("Маржа при полной выработке", lambda r: f"{r['margin']*100:.0f}%")
line("Инженеров на 10 млн $ выручки", lambda r: f"{r['eng_for_10m']:.0f}")
line("Потребность в капитале за 24 мес.", lambda r: m(r["need"]))
print()
# ---- Roll-up: что покупают 30 млн $ (вижн-дека) -------------------------------
base = rows[1]                       # базовый сценарий как единица
N_FIRMS = 5
ROBOTS, ROBOT_PRICE = 30, 52e3       # парк роботов, $ (State Grid: $41–52 тыс.)
acq = N_FIRMS * base["price"]
robots = ROBOTS * ROBOT_PRICE
core_3y = AI_TEAM_COST * 3
ramp_gap = N_FIRMS * max(0.0, base["cost"] - AI_TEAM_COST - base["run_rate"] * RAMP) * 0.5
deal_costs = N_FIRMS * 0.4e6
need30 = acq + robots + core_3y + ramp_gap + deal_costs
run30 = N_FIRMS * base["run_rate"]
eng30 = N_FIRMS * base["engineers"]
print("## Roll-up на 30 млн $ (вижн-дека, базовый сценарий × 5 фирм)\n")
print(f"- Покупка {N_FIRMS} фирм по {m(base['price'])}: {m(acq)}.")
print(f"- Парк {ROBOTS} роботов по {ROBOT_PRICE/1e3:.0f} тыс. $: {m(robots)}.")
print(f"- ИИ-ядро три года: {m(core_3y)}; интеграционный недобор: {m(ramp_gap)}; "
      f"сделки и юристы: {m(deal_costs)}.")
print(f"- **Потребность: {m(need30)} против ask {m(ASK_VISION)}** — запас "
      f"{m(ASK_VISION-need30)} на дороже купленные фирмы или третий рынок.")
print(f"- Run-rate после интеграции: {m(run30)} при {eng30} инженерах; "
      f"маржа базового сценария {base['margin']*100:.0f}%.")
print("- Допущение, которое всё решает: мультипликатор покупки 1,0× выручки. При 2× "
      f"потребность вырастает на {m(acq)} и запас исчезает.")
WSP_POWER, POWER_STAFF = 1.78e9, 4000        # WSP → POWER Engineers, 10.2024
per_head_in = base["price"] / base["engineers"]
per_head_out = WSP_POWER / POWER_STAFF
print(f"- Цена за инженера: вход {per_head_in/1e3:.0f} тыс. $ (базовый сценарий, 1× выручки) "
      f"против {per_head_out/1e3:.0f} тыс. $ в сделке WSP → POWER — разрыв ×{per_head_out/per_head_in:.1f}. "
      "Это направление цены категории по американским ставкам, не наш мультипликатор на выходе.\n")
print("## Как читать\n")
print("1. **Один рычаг решает всё — рост выработки.** Без него (×1,0) это")
print("   инжиниринговое бюро на офшорных ставках с маржой около нуля после")
print("   расходов на ядро. Поэтому шаг 1 плана — не «построить продукт», а")
print("   измерить ×: часы инженера на типовой проект до и после ядра, на")
print("   реальном потоке партнёра и одном субподряде.")
print("2. **Консервативный сценарий убыточен — и это критерий остановки.**")
print("   При ×1,2 выручка не покрывает инженеров и ядро; такой бизнес не")
print("   покупать. Порог, ниже которого не идём во второй шаг: ×1,5 на")
print("   измеренном потоке. Потребность в капитале на два года — 4–5 млн $;")
print("   остаток ask (5–6 млн $) — третий шаг, вторая фирма, и просить его")
print("   надо только после измеренного ×.")
print("3. **Цена покупки — самое слабое допущение.** Мультипликаторы малого")
print("   инжиниринга в Заливе/Индии публично не торгуются; 0,8–1,2× выручки —")
print("   ориентир, который проверяет только разговор с продавцом.")
print("4. **Десять миллионов выручки = 65–110 инженеров с ядром** против")
print("   125–170 без него (ic7-5). Это headcount-бизнес; ИИ меняет наклон,")
print("   а не природу. Exit-мультипликаторы — инжиниринговые, не софтовые.")
print("5. **Чего модель не знает:** реальных ставок в Заливе, срока сделки по")
print("   покупке фирмы, оттока инженеров после покупки. Всё это — допущения,")
print("   помеченные в скрипте; заменять по мере измерений.")
