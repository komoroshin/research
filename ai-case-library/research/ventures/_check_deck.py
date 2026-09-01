#!/usr/bin/env python3
"""Проверки деки перед показом. Ловит регрессии, которые иначе увидит инвестор.

    python3 _check_deck.py energy

Четыре проверки:
1. Числа — каждое значимое число деки должно быть в реестре с источником.
2. Запрещённые формулировки — то, что снято по итогам проверки гипотезы,
   и обороты, запрещённые textstyle.md.
3. Утечка внутреннего — служебные пометки не должны попасть в собранную деку.
4. Вёрстка — реальный рендер в headless-браузере, переполнение слайда.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

# Реестры чисел по декам: значение → где подтверждено.
# Число не из реестра своей деки — ошибка.
NUMBERS_ENERGY = {
    "23%": "SMUD: собрано 723 тыс. $ из начисленных 3,11 млн $ (кейс EPRI)",
    "2,3": "SMUD: рост выставленной суммы 1,36 → 3,11 млн $",
    "22,4%": "NERC Нигерия 2025: потери сбора",
    "18,9%": "NERC Нигерия 2025: технические и коммерческие потери",
    "61": "LBNL Queued Up 2026: медиана заявка → питание, месяцев",
    "19%": "LBNL: доля проектов, дошедших до эксплуатации",
    "13%": "LBNL: доля мощности, дошедшей до эксплуатации",
    "116": "GE Vernova, отчётность за II квартал 2026: бэклог турбин, ГВт",
    "2031": "GE Vernova: год, на который принимаются резервирования поставок",
    "180%": "PJM: рост издержек от перегрузки за I полугодие 2026 (179,9%)",
    "1,26": "PJM: издержки от перегрузки, I полугодие 2025, млрд $",
    "3,54": "PJM: издержки от перегрузки, I полугодие 2026, млрд $",
    "5%": "Москва: резерв энергосистемы в 2026 (менее 5%)",
    "21": "Наша база: число голосовых кейсов",
    "1": "Наша база: голосовых кейсов в энергетике",
    "2003": "CHOICE Technologies: год начала работы",
    "30+": "CHOICE: число компаний-заказчиков",
    "20+": "Minsait: число компаний-заказчиков",
    "40": "Itron Revenue Assurance: млн точек учёта ежедневно",
    "50+": "МТС EnergyTool: число внедрений",
    "150": "Emerald AI: раунд 25.08.2026, млн $",
    "1,05": "Emerald AI: оценка, млрд $",
    "56%": "ТАСС: падение числа ТСО с 2022 года",
    "2022": "ТАСС: база отсчёта падения числа ТСО",
    "400": "Минэнерго: целевое число ТСО",
    "3,6": "Nira Energy: выручка, млн $ в год (агрегатор, допущение)",
    "80": "Northeast Group: нижняя граница оценки, которую мы НЕ используем",
    "100": "Northeast Group: верхняя граница оценки, которую мы НЕ используем",
    "2017": "Northeast Group: год пресс-релиза с этой оценкой",
    "350": "AiDASH → Schneider Electric, июль 2026, млн $",
    "91,5": "AiDASH: привлечено до сделки, млн $",
    "3,8": "AiDASH: кратность на вложенный капитал",
    "525": "Itron → Locusview, ноябрь 2025, млн $",
    "325": "Itron → Urbint, октябрь 2025, млн $",
    "277": "Наша база верифицированных кейсов",
    "1125": "ПП РФ №1125 от 22.08.2024",
    "22.08.2024": "Дата ПП №1125",
    "01.01.2026": "ПП №1125: обязательный приём заявок через ЕПГУ",
    "22.12.2021": "Обзор судебной практики, Президиум ВС РФ",
    "2026": "Текущий год",
    "2025": "Год сравнения в динамике PJM и сделках",
    "10": "Обзор ВС РФ: минуты на составление акта в поле",
    "7": "Наша база: голосовых кейсов в телекоме",
    "6": "Наша база: голосовых кейсов в медицине",
    "4": "Наша база: голосовых кейсов в финансах",
    "5": "Число занятых покупателей из семи (очереди на подключение)",
}

# Дека по потерям. Источники — в loss-recovery.md, раздел «Источники».
NUMBERS_LOSS = {
    "23%": "SMUD: собрано из начисленного (кейс EPRI)",
    "2,3": "SMUD: рост выставленной суммы",
    "38": "Фаридабад: нижняя граница собираемости",
    "51%": "Фаридабад: собираемость за FY24",
    "22,4%": "NERC Нигерия 2025: потери сбора",
    "18,9%": "NERC Нигерия 2025: технические и коммерческие",
    "2003": "CHOICE Technologies: год начала работы",
    "30+": "CHOICE: число компаний-заказчиков",
    "100": "CHOICE: млн абонентов",
    "2007": "CHOICE: Light в Рио как клиент с этого года",
    "20+": "Minsait: число компаний-заказчиков",
    "70%": "Minsait: доля выявляемого мошенничества",
    "10%": "Minsait: доля проверяемых точек",
    "40": "Itron Revenue Assurance: млн точек учёта ежедневно",
    "32": "Itron: число компаний-заказчиков",
    "2014": "Itron/Detectent: год полного цикла у SMUD",
    "2021": "МТС EnergyTool: год начала продаж; обзор ВС РФ — 22.12.2021",
    "50+": "МТС EnergyTool: число внедрений",
    "76%": "ANEEL: доля десяти компаний в коммерческих потерях Бразилии",
    "45": "ANEEL: нетехнические потери Бразилии за 2025, ТВт·ч",
    "31%": "ANEEL: доля Light и Amazonas Energia",
    "5,8%": "ANEEL: их доля низковольтного рынка",
    "9,2%": "Бразилия: покрытие умными счётчиками в 2025",
    "30,6%": "Бразилия: прогноз покрытия к 2030",
    "2030": "Бразилия: горизонт прогноза покрытия",
    "18,5%": "Кения: предел возмещения потерь регулятором",
    "21,2%": "Кения: фактические потери KPLC",
    "144": "Lei 14.133/2021, ст. 144 — оплата долей от сэкономленного",
    "20%": "Индия: пример доли от возврата в разборе модели денег",
    "60%": "Индия: доля от удерживаемого клиентом при доле 20%",
    "350": "AiDASH → Schneider Electric, млн $",
    "91,5": "AiDASH: привлечено до сделки, млн $",
    "2026": "Текущий год",
    "2025": "Год сравнения",
    "1": "Порядковые номера в перечнях",
    "4": "Число слоёв продукта",
}


# Снято по итогам проверки гипотезы либо запрещено textstyle.md.
FORBIDDEN = [
    (r"слабо занят", "ниша признана занятой — формулировка снята 01.09.2026"),
    (r"×\s*2,2|в 2,2 раза", "кейс «Россети Центр» убран из питча"),
    (r"Россети Центр", "кейс конкурента, убран из питча"),
    (r"80[–-]100 млрд \$(?!.*НЕ исполь)", "оценка Northeast Group как факт запрещена"),
    (r"гарантиру", "непроверяемое обещание"),
    (r"уникальн(ый|ая|ое|ые) (подход|технолог|решени)", "самопохвала, textstyle.md"),
    (r"лучшие практики|богатый опыт|комплексн(ое|ые) решени", "вежливая вата, textstyle.md"),
    (r"у нас построен стек|построенные активы — наш главный", "аргумент снят 01.09.2026"),
    (r"National Grid Partners выделил", "переупакованная аллокация, не новые деньги"),
]

# Дека по потерям цитирует снятую формулировку, чтобы её опровергнуть.
FORBIDDEN_EXCEPT = {"loss": [r"слабо занят"]}

INTERNAL_MARKERS = ["ВНУТРЕННЕЕ", "TODO", "ЗАМЕТКА:", "не показывать"]

PROBE = """
<script>
(function(){
  var root = document.documentElement;
  root.classList.add('deck');
  var bad = [];
  Array.prototype.forEach.call(document.querySelectorAll('.slide'), function(s, i){
    var prev = s.style.display;
    s.style.display = 'flex';
    var over = s.scrollHeight - s.clientHeight;
    if (over > 4) bad.push((i + 1) + ' (+' + over + 'px)');
    s.style.display = prev;
  });
  document.title = 'PROBE|' + (bad.length ? bad.join(', ') : 'ok');
})();
</script>
"""

SIGNIFICANT = re.compile(
    r"(?<![\w,.])(\d+(?:[,.]\d+)?(?:\.\d{2}\.\d{4})?)\s*(?:%|\+|ГВт|МВт|млрд|млн|тыс|крор|\$|₽)?"
)


def strip_tags(html):
    html = re.sub(r"<script.*?</script>", " ", html, flags=re.S)
    html = re.sub(r"<style.*?</style>", " ", html, flags=re.S)
    return re.sub(r"<[^>]+>", " ", html)


def check_numbers(text, registry):
    known = set(registry)
    problems = []
    for tok in re.findall(r"\d[\d.,]*\+?%?", text):
        tok = tok.rstrip(".,")
        if tok in known or tok.rstrip("%") in known:
            continue
        if re.fullmatch(r"\d{1,2}", tok):  # порядковые номера, счётчики слайдов
            continue
        problems.append(tok)
    return sorted(set(problems))


def main():
    key = sys.argv[1] if len(sys.argv) > 1 else "energy"
    deck = HERE / ("energy-portfolio-deck.html" if key == "energy"
                   else "loss-recovery-deck.html")
    slides = HERE / (f"_{key}-deck-slides.html" if key == "energy"
                     else "_loss-deck-slides.html")
    html = deck.read_text(encoding="utf-8")
    text = strip_tags(slides.read_text(encoding="utf-8"))
    fails = 0

    registry = NUMBERS_ENERGY if key == "energy" else NUMBERS_LOSS
    unknown = check_numbers(text, registry)
    if unknown:
        print("НЕ ПРОШЛО · числа без источника в реестре:", ", ".join(unknown))
        fails += 1
    else:
        print("ок · все значимые числа есть в реестре с источником")

    skip = FORBIDDEN_EXCEPT.get(key, [])
    hits = [(p, why) for p, why in FORBIDDEN
            if p not in skip and re.search(p, text, re.I)]
    if hits:
        for p, why in hits:
            print(f"НЕ ПРОШЛО · запрещённая формулировка /{p}/ — {why}")
        fails += 1
    else:
        print("ок · запрещённых формулировок нет")

    leaks = [m for m in INTERNAL_MARKERS if m.lower() in text.lower()]
    if leaks:
        print("НЕ ПРОШЛО · внутренние пометки в деке:", ", ".join(leaks))
        fails += 1
    else:
        print("ок · внутренних пометок нет")

    head = html[:200]
    if 'charset' in head.lower() and 'viewport' in head.lower():
        print("ок · объявлены кодировка и viewport")
    else:
        print("НЕ ПРОШЛО · нет charset или viewport в начале файла —"
              " кириллица превратится в кракозябры у части просмотрщиков")
        fails += 1

    with tempfile.TemporaryDirectory() as td:
        probe = Path(td) / "probe.html"
        probe.write_text(html + PROBE, encoding="utf-8")
        try:
            out = subprocess.run(
                [CHROME, "--headless", "--disable-gpu", "--no-sandbox",
                 "--window-size=1440,900", "--virtual-time-budget=5000",
                 "--dump-dom", f"file://{probe}"],
                capture_output=True, text=True, timeout=120).stdout
            m = re.search(r"PROBE\|([^<]*)", out)
            if not m:
                print("не проверено · рендер не отдал результат")
            elif m.group(1).strip() == "ok":
                print("ок · переполнения слайдов нет (рендер 1440×900)")
            else:
                print("НЕ ПРОШЛО · переполнение слайдов:", m.group(1))
                fails += 1
        except Exception as e:
            print(f"не проверено · рендер не запустился: {e}")

    print("\nИТОГ:", "готово к показу" if not fails else f"ошибок: {fails}")
    return 1 if fails else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BrokenPipeError:  # вывод оборван через | head — это не ошибка проверки
        sys.exit(0)
