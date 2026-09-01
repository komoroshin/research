# IC3-4 — Регуляторная устойчивость: обязанность оператора считать и выставлять Ausfallarbeit

Дата проверки: 01.09.2026. Роль: скептик, задача — опровергнуть.

## Проверяемое утверждение

«Обязанность оператора самому считать и выставлять Ausfallarbeit устойчива на горизонте 3–5 лет; её не вернут сетям, не автоматизируют централизованно и не отменят вместе с самой компенсацией».

## ВЕРДИКТ: утверждение В ЗНАЧИТЕЛЬНОЙ ЧАСТИ ОПРОВЕРГНУТО

Ядро гипотезы держится на **переходной дыре, а не на устойчивой обязанности**:

1. **«Оператор сам выставляет счёт» — это временный костыль, а не целевая модель.** Целевая модель закона от 18.12.2025 — **Gutschriftverfahren**: сетевой оператор сам считает Ausfallarbeit и выставляет оператору установки кредит-ноту; операторы выставляют счета сами только пока сети не автоматизировали процесс. Массовая автоматизация у сетей началась уже летом 2026, задним числом с 23.12.2025 (node.energy, 2026; pv magazine, 06.03.2026 — часть сетей уже анонсировала автоматические гутшрифты с оплатой во втором следующем месяце).
2. **Методику централизованно стандартизирует BNetzA уже к концу 2026** (Festlegungsverfahren BK8-26-001: эскизный документ 08.06.2026, консультация до 01.07.2026, воркшоп 20.08.2026, проект Festlegung — середина сентября 2026, завершение — конец 2026).
3. **Сама компенсация под политической атакой.** «Netzpaket» BMWE (Кабинет одобрил часть 29.07.2026) вводит **Redispatch-Vorbehalt**: новые ВИЭ-установки в «kapazitätslimitierte Netzgebiete» (обрезка >5% в прошлом году; статус до 6 лет) подключаются только при отказе от части компенсации. BWE/BEE оспаривают как противоречащее праву ЕС — исход не решён.
4. **Объём боли сжимается.** Компенсации ВИЭ за redispatch: ~433 млн € в 2025, **минус >20% к 2024**; обрезано лишь 3,5% ВИЭ-выработки. Прогноз затрат на управление перегрузками на 2026–2028 срезан ÜNB на ~4 млрд € из-за ввода Ultranet (2026), A-Nord/SuedOstLink (2027), SuedLink (2028). Q1 2026: −11% к Q1 2025.

**Что выживает из гипотезы:** не «расчёт и выставление счёта», а **проверка чужих гутшрифтов и до-взыскание** — по рыночным наблюдениям node.energy «каждый десятый расчёт ошибочен», отклонение в 1% на ветропортфеле = шестизначные потери в год. Это другой продукт (audit/claims), с прямым сильным конкурентом (node.energy opti.node, вебинар на ~900 участников) и встроенной эрозией рынка после Festlegung BNetzA и достройки HVDC-линий.

---

## 1. Поправка EnWG от декабря 2025: текст и логика

**Факты:**
- Закон: «Gesetz zur Änderung des Energiewirtschaftsrechts» от **18.12.2025**, BGBl. 2025 I Nr. 347 от 22.12.2025, в силе с **23.12.2025** (dejure.org к §13a EnWG; von Bredow Valentin Herz, обзор новеллы).
- **§14 Abs. 1 S. 3 EnWG:** целевой билансовый выравнивающий механизм (bilanzieller Ausgleich) на уровне распределительных сетей **приостановлен до 31.12.2031** — сетевой оператор больше не обязан восполнять обрезанный ток «бумажной» энергией, вместо этого — финансовый ausgleich (vbvh.de).
- **§14 Abs. 1b EnWG:** финансовый ausgleich идёт теперь **напрямую между оператором установки и сетевым оператором**, директ-вермарктер/BKV исключён из платёжной цепочки; сверх компенсации сетевой оператор платит BKV «angemessenen Aufwendungsersatz» за проведение билансового выравнивания (vbvh.de; dejure).
- Расчёт невыработки — по **Mischpreis** (72,5% ID1 + 27,5% reBAP; Mitteilung Nr. 12 BNetzA / BDEW-механика), публикуется на netztransparenz.de; BNetzA прямо оставляет за собой право менять методику (quadra-energy.com; 88energie.de).
- Логика законодателя (в пересказе юристов и node.energy): убрать директ-вермарктера из «непрозрачной платёжной цепочки» и упростить компенсацию; изменение прошло почти незамеченным («не афишировалось», pv magazine 06.03.2026).

**Опровергающее:**
- Сама конструкция **явно срочная**: приостановка до 31.12.2031 + мандат BNetzA на Festlegung — то есть режим по определению переходный, а не «устойчивый на 3–5 лет» (vbvh.de: «Vorläufig, nicht permanent»).
- **Целевой процесс — гутшрифт от сетевого оператора**, не счёт от оператора установки: «Die Abwicklung erfolgt über ein Gutschriftverfahren; Anlagenbetreiber müssen keine Rechnungen stellen… Abrechnung startet im Sommer 2026 rückwirkend zum 23.12.2025» (node.energy, блог «Redispatch-Entschädigung 2026»). Самостоятельное выставление счетов — только «in der Übergangsphase», пока у конкретной сети нет автоматизации.
- **Не нашёл:** сам текст Begründung BT-Drucksache (номер печатного дела не всплыл в поиске; прямых цитат обоснования нет). Помечаю явно: вывод о «логике законодателя» — из вторичных юридических обзоров, не из первоисточника.

## 2. Позиции ассоциаций

- **BWE, Faktencheck «Was kostet uns Redispatch?» (апрель 2026, PDF):** опровергает тезис министра Райхе о «3 млрд € за выброшенный ветряной ток»: 2,8 млрд € (2024) и 3,1 млрд € (2025) — это **все** затраты Netzengpassmanagement; собственно финансовый ausgleich операторам ВИЭ в 2025 — **~433 млн €, −20%+ к 2024** (сноска: BNetzA, отчёт Netzengpassmanagement Q4/2025 от 30.03.2026). 96,5% ВИЭ-тока доставлено, обрезка 3,5%. Требования BWE: ускоренный netzausbau, «Nutzen statt Abregeln» (накопители, электролиз), прямые поставки промышленности. **Про механику биллинга (кто выставляет счёт) BWE в Faktencheck ничего не требует** — фокус на защите самой компенсации.
- **BEE, Handout «Netzpaket: Lösungen statt Blockaden!» (20.02.2026, PDF):** «Entschädigungszahlungen sind unverzichtbar und europarechtlich vorgeschrieben»; предусмотренное в Referentenentwurf **«Streichung von Entschädigungszahlungen (sogenannter Redispatch-Vorbehalt)»** не снижает ни объёмов обрезки, ни затрат, а перекладывает риски на операторов; юрзаключение канцелярии Raue (для BWE): противоречие Elektrizitätsbinnenmarkt-RL/-VO — отказ от компенсации допустим только добровольный; принудительный отказ в «kapazitätslimitierten Netzgebiet» добровольным не является; 10-летний отказ = «unkalkulierbares Planungsrisiko».
- **BDEW:** ведёт консультации по Festlegung BNetzA, критикует Kostenerstattung в «unbilanzierten Redispatch» (bdew.de, стр. «Kritik an der Kostenerstattung im unbilanzierten Redispatch»); исторически требовал «sachgerechte und anwendbare Kompensationsregelungen» с минимальной нагрузкой внедрения.
- **VKU:** отдельной позиции по §13a-биллингу в поиске **не нашёл** (помечаю явно).

**Опровергающее:** ни одна ассоциация не защищает статус-кво «оператор сам считает и выставляет» — все стороны тянут либо к стандартизированной автоматике (BDEW/BNetzA), либо к защите компенсации как таковой (BWE/BEE). Лоббистского якоря у нынешней ручной модели нет.

## 3. BNetzA: Festlegungsverfahren (статус 09.2026)

- **BK8-26-001-A** (по §14 Abs. 1b S. 4 в связке с §29 Abs. 1 EnWG): Eckpunktepapier опубликован **08.06.2026**, консультация до **01.07.2026**, воркшоп **20.08.2026**, **проект Festlegung — середина сентября 2026**, завершение процедуры — **до конца 2026** (bundesnetzagentur.de, страница BK8-26-001; bbh-blog.de). Предмет: условия применения билансового выравнивания у распределительных сетей и размер Kostenerstattung для BKV при «небилансированном» redispatch.
- Базовая Festlegung по финансовому ausgleich **BK8-22-001-A** (05.06.2024, ретроактивно с 01.01.2024): «bundesweit einheitliche Bestimmung des finanziellen Ausgleichs» по §13a Abs. 2 — компоненты компенсации стандартизированы федерально (bdew.de).
- Mischpreis-методика — переходное решение BDEW, BNetzA оставляет право её изменить (quadra-energy.com).

**Опровергающее:** регулятор движется к **полной стандартизации расчёта** с горизонтом «конец 2026». «Методика, которую нужно уметь считать» перестаёт быть ноу-хау: формула единая, входные цены публичны (netztransparenz.de), 15-минутные интервалы. Дифференциация сервиса «мы умеем посчитать» схлопывается; остаётся дифференциация «мы умеем проверить и доказать» (данные установки vs данные сети).

## 4. Централизация: connect+, Gutschriftverfahren, Redispatch 3.0

- **connect+** — центральная платформа обмена данными Redispatch 2.0 («single point of contact» рынка), полностью автоматизирована, но это **дата-хаб (стамм- и бевегунгсданные), не биллинговая платформа**; единой централизованной платформы расчёта компенсаций в поиске **не нашёл** (помечаю явно). Однако:
- **Gutschriftverfahren** — де-факто децентрализованная автоматизация того же самого: каждая сеть (их ~860+) сама считает и кредитует; старт массовых расчётов — **лето 2026, ретроактивно с 23.12.2025** (node.energy). Часть сетей уже платит автоматически «во втором следующем месяце» (pv magazine, 06.03.2026).
- **Redispatch 3.0** — сейчас исследовательско-демонстрационный проект (финансирование BMWE), а не действующий регуляторный режим; гибрид: cost-based для крупных + рыночное управление для малых флексибильностей через агрегаторов («Leistungspreis-Plus», pv magazine 30.07.2026). **Компенсационную механику §13a для существующих установок в горизонте 3–5 лет не меняет** — это единственный пункт, где гипотеза держится.

**Опровергающее:** «не автоматизируют централизованно» — формально верно (единой платформы нет), по существу ложно: автоматизация идёт распределённо на стороне сетей и уже началась. Окно, в котором оператору нужно «самому считать и выставлять», — ориентировочно 2026 — начало 2027 (допущение: по темпам анонсов сетей), а не 3–5 лет.

## 5. Объём боли: рынок сжимается, но не исчезает

- Компенсации операторам ВИЭ: **~554 млн € (2024)** (cleanthinking.de со ссылкой на BNetzA) → **~433 млн € (2025), −20%+** (BWE Faktencheck 04.2026 ← BNetzA 30.03.2026). Обрезка — 3,5% ВИЭ-выработки; offshore-ветер −27% обрезки г/г.
- Общие затраты Netzengpassmanagement: 3,335 млрд € (2023) → 2,776 млрд € (2024, −17%) → ~3,1 млрд € (2025). **Q1 2026: ~784 млн € против 882 млн € в Q1 2025, −11%** (BNetzA; iwr.de 08.2026; windkraft-journal.de 11.08.2026).
- **Прогноз ÜNB (к сезону сетевых тарифов, октябрь 2025): срез на ~4 млрд € суммарно за 2026–2028**: 2026 −~1 млрд € (до 3,1 млрд €), 2027 −1,4 млрд € (до 3,0 млрд €), ниже 3 млрд € — к 2029. Причина: ввод HVDC — Ultranet (2026), A-Nord + первый участок SuedOstLink (2027), SuedLink (2028) (zfk.de).
- Контрдовод в пользу рынка: закон сам закладывает ~3% «эффективной» обрезки (EU-ориентир 5%) — redispatch у ВИЭ не исчезнет; ВИЭ-зубау продолжается (ВИЭ ~60% выработки, BEE 02.2026), а юг с ростом PV генерирует собственные локальные перегрузки (карта BWE/BEE: на юге redispatch бьёт в первую очередь по PV).

**Опровергающее:** база сервиса (сумма компенсаций, из которой клиент готов платить долю) — сотни миллионов €, падает двузначными темпами уже второй год, и ввод четырёх HVDC-коридоров в 2026–2028 придавит именно север-юг ветровой redispatch — исторически главный источник Ausfallarbeit. «Боль» не исчезает, но её денежная ёмкость на горизонте 3–5 лет скорее вдвое меньше сегодняшней (допущение-экстраполяция).

## 6. Юридическая сторона: спор, сроки, где нужен «расчёт, который устоит»

- Прямое требование оператора к сетевому оператору (§13a Abs. 2, §14 Abs. 1b EnWG); споры решаются **двусторонне** между оператором и сетью (BDEW FAQ Redispatch 2.0 v1.5; node.energy).
- **Исковая давность — общая по BGB, 3 года**; расхождения должны урегулироваться до её истечения (BDEW FAQ; node.energy: трёхлетнее окно для до-заявления требований, в т.ч. ретроактивных с 23.12.2025).
- Формализованной процедуры оспаривания гутшрифта / стандартных сроков оплаты в законе **не нашёл** (помечаю явно): практика — оплата «во втором следующем месяце» у автоматизировавшихся сетей (pv magazine), остальное — договорно/двусторонне.
- Качество расчётов сетей: «примерно каждый десятый расчёт ошибочен» (стамм-данные, мощности, привязка ко времени); 1% отклонения на крупном ветропортфеле = «шестизначные» годовые потери (node.energy / windindustrie-in-deutschland.de). BWE Handlungsempfehlung (27.05.2025): гутшрифты NB и EIV «не принимать без проверки», сверять с собственным логбуком/данными установки.

**Вывод по пункту:** «расчёт, который устоит» нужен — но как **контр-расчёт для проверки чужого гутшрифта и обоснования претензии**, а не как первичный биллинг. Это подтверждает пивот-версию продукта и опровергает исходную.

## Сводка по рискам гипотезы

| Риск | Статус | Срок |
|---|---|---|
| Возврат обязанности сетям (Gutschriftverfahren) | **Реализуется уже сейчас** — целевая модель закона, старт лето 2026 | 2026–2027 |
| Централизованная стандартизация методики (BNetzA BK8-26-001) | Проект Festlegung сен. 2026, финал до конца 2026 | конец 2026 |
| Отмена компенсации (Netzpaket, Redispatch-Vorbehalt) | Кабинет 29.07.2026; только новые установки в зонах >5% обрезки, до 6 лет; оспаривается по праву ЕС | 2027+ , исход не решён |
| Сжатие объёма redispatch (HVDC-линии) | Прогноз ÜNB −4 млрд € за 2026–2028; факт: −20% компенсаций ВИЭ в 2025, −11% затрат в Q1 2026 | 2026–2029 |
| Конкурент в нише «проверки» | node.energy opti.node уже в рынке (вебинар ~900 участников) | сейчас |

## Что НЕ нашёл (явно)

- Текст Begründung законопроекта (BT-Drucksache) к закону от 18.12.2025 — только вторичные юробзоры.
- Позицию VKU по биллингу §13a/§14.
- Признаки единой централизованной биллинговой платформы у connect+/DSO-сообщества (connect+ — только обмен данными).
- Формальную законодательную процедуру оспаривания гутшрифта и статутные сроки оплаты.

## Источники

1. von Bredow Valentin Herz, «EnWG-Novelle & Redispatch: Gesetzesänderung führt zu neuem Entschädigungsregime» — https://www.vbvh.de/news/enwg-novelle-redispatch-gesetzesaenderung-fuehrt-zu-neuem-entschaedigungsregime/
2. dejure.org, §13a EnWG (ред. закона от 18.12.2025, BGBl. 2025 I Nr. 347) — https://dejure.org/gesetze/EnWG/13a.html
3. node.energy, «Redispatch-Entschädigung 2026» — https://www.node.energy/blog/redispatch-entschaedigung
4. pv magazine DE, 06.03.2026, «Anlagenbetreiber müssen Redispatch-Entschädigung selbst beim Netzbetreiber einfordern» — https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/
5. BWE, Faktencheck «Was kostet uns Redispatch?», апрель 2026 (PDF) — https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/04-politische-arbeit/01-gesetzgebung/20260421_Faktencheck_Redispatch.pdf
6. BEE, Handout «Netzpaket: Lösungen statt Blockaden!», 20.02.2026 (PDF) — https://www.bee-ev.de/fileadmin/Redaktion/Dokumente/Meldungen/Positionspapiere/2026/20260220_BEE_Handout_Netzpaket_kurz.pdf
7. BNetzA, BK8-26-001-A Eckpunktepapier (08.06.2026) — https://www.bundesnetzagentur.de/DE/Beschlusskammern/1_GZ/BK8-GZ/2026/2026_3-Steller/BK8-26-001/BK8-26-001-A_Eckpunktepapier.html
8. BBH-Blog, «Fortentwicklung des Redispatch 2.0 – Festlegungsverfahren zur Kostenerstattung eröffnet» — https://www.bbh-blog.de/allgemein/fortentwicklung-des-redispatch-2-0-festlegungsverfahren-zur-kostenerstattung-bei-redispatch-massnahmen-eroeffnet/
9. BDEW, «Redispatch 2.0: BNetzA-Festlegung zum finanziellen Ausgleich» (BK8-22-001-A, 05.06.2024) — https://www.bdew.de/energie/redispatch-20-bnetza-festlegung-zum-finanziellen-ausgleich/
10. Rödl & Partner, «Netzpaket des BMWE: Referentenentwurf», 18.02.2026 — https://www.roedl.com/insights/netzpaket-bmwe-referentenentwurf-netzanschluss-redispatch-2-0-ee-projekte/
11. CUBE CONCEPTS, «EEG 2027 & Netzpaket: Kabinettsbeschluss» (29.07.2026) — https://cubeconcepts.de/eeg-2027-netzpaket-kabinettsbeschluss-zum-refinanzierungsbeitrag-cfd-im-ueberblick/
12. cleanthinking.de, «Redispatch-Kosten 2026: Stimmt Reiches Zahl? Faktencheck» — https://www.cleanthinking.de/faktencheck-redispatch-drei-milliarden/
13. ZfK, «Redispatch-Prognose: Kosten um vier Milliarden Euro nach unten korrigiert» — https://www.zfk.de/politik/deutschland/redispatch-kosten-kosten-vier-milliarden-euro
14. iwr.de, «BNetzA meldet weniger Eingriffe… Q1 2026 −11%» — https://www.iwr.de/news/bundesnetzagentur-meldet-weniger-eingriffe-ins-stromnetz-kosten-im-ersten-quartal-2026-um-elf-prozent-gesunken-news39950
15. Windkraft-Journal, 11.08.2026, «Netzengpassmanagement im 1. Quartal 2026 rückläufig» — https://www.windkraft-journal.de/2026/08/11/bundesnetzagentur-netzengpassmanagement-im-1-quartal-2026-ist-ruecklaeufig/226829
16. QUADRA energy, «Redispatch-Abrechnungsoptionen» — https://www.quadra-energy.com/redispatch-abrechnungsoptionen/
17. 88energie, «Redispatch-Entschädigung 2026 – wer rechnet, wer zahlt, wer prüft» — https://www.88energie.de/redispatch-entsch-digung-2026-wer-rechnet-wer-zahlt-wer-pr-ft-2256719.html
18. Windindustrie in Deutschland (WID), «Gesetzesänderung macht Redispatchabrechnung zur neuen Schlüsselaufgabe für Betreiber» — https://www.windindustrie-in-deutschland.de/news/gesetzesaenderung-macht-redispatchabrechnung-zur-neuen-schluesselaufgabe-fuer-betreiber
19. BWE, Anwendungsempfehlung Redispatch 2.0, 27.05.2025 (PDF) — https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/02-technik-und-netze/01-netze/20250527_BWE_Handlungsempfehlung_Redispatch.pdf
20. BDEW, FAQ Redispatch 2.0 v1.5, 24.09.2024 (PDF) — https://www.bdew.de/media/documents/2024-09-24_FAQ_Redispatch_V1.5.pdf
21. pv magazine DE, 30.07.2026, «Leistungspreis-Plus-Modell … Redispatch 3.0» — https://www.pv-magazine.de/2026/07/30/leistungspreis-plus-modell-als-marktbasiertes-konzept-zur-einbindung-von-kleinstflexibilitaeten-in-den-redispatch-3-0/
