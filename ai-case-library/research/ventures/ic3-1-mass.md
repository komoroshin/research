# IC3-1 «Массовость проблемы» — проверка на опровержение

**Дата проверки:** 01.09.2026. Роль: скептик, задача — опровергнуть утверждение.

**Проверяемое утверждение:** «Redispatch-меры затрагивают тысячи установок в год, счетов много, и Spitzabrechnung даёт оператору ощутимо больше денег, чем Pauschalverfahren, — за качество расчёта есть денежная причина платить».

**Вердикт: НЕЯСНО / подтверждено лишь частично.** Опровергнуть целиком не удалось, но два из трёх столпов утверждения держатся на слабых или устаревших данных:

- Столп «тысячи установок затронуты В ГОД» — **не подтверждён напрямую**: под режим Redispatch 2.0 подпадает ~100 тыс. установок (≥100 кВт), но **сколько из них реально абрегелируется в год — агрегированной статистики нет нигде** (не публикуют ни BNetzA, ни netztransparenz). Косвенно — да, много (PV-абрегелирование удвоилось два года подряд, Бавария — эпицентр), но число установок — допущение, не факт.
- Столп «Spitz даёт ощутимо больше денег» — **держится на исследованиях 2013/2017 гг. эпохи EinsMan** (ENERTRAG: +10%; +26,8 тыс. €/ВЭУ/год), для ветра в Шлезвиг-Гольштейне. Актуального систематического сравнения для Redispatch 2.0 **не нашёл**. BNetzA в 2025 консультирует «Korrekturfaktor» к Spitz — точность Spitz сама под вопросом.
- Столп «счетов много» (после EnWG-новеллы 23.12.2025 оператор сам требует компенсацию у сетевика) — **подтверждён**, но с контрпримером: крупные DSO (EWE NETZ) обещают **автоматическую ежемесячную Gutschrift** — там сервису расчёта делать нечего. И общий котёл компенсаций ВИЭ **сжался на 22% в 2025** (433 млн €), причём львиная доля — offshore/крупный ветер, не «длинный хвост» SaaS-клиентов.

---

## 1. Сколько установок затрагивается redispatch-мерами в год

**Что подтверждено:**
- Под режим Redispatch 2.0 (с 01.10.2021) подпадают все генерирующие установки и накопители **≥100 кВт** плюс дистанционно управляемые меньшей мощности. BDEW: «более 80 000 установок» стали частью управления перегрузками (оценка на старте режима, 2021). Источник: [BDEW — Redispatch 2.0](https://www.bdew.de/energie/redispatch-20/).
- EnBW/Interconnector (блог, без даты, ~2021): «около 100 000 ВИЭ-установок затронуто» режимом. Источник: [interconnector.de](https://www.interconnector.de/energieblog/redispatch-2-0-was-anlagenbetreiber-jetzt-wissen-muessen/). К 2026 г. парк ≥100 кВт вырос (бум наземного PV) — **допущение: заметно больше 100 тыс.**
- Объём мер: Netzengpassmanagement всего **30 304 GWh (2024)**, **30 319 GWh (2025)** — стабильно; из них redispatch с ВИЭ **9 389 GWh (2024) / 9 379 GWh (2025)**. Абрегелировано **3,5% всей ВИЭ-генерации** (2024 и 2025). Источники: [SMARD «Volumen und Kosten gesunken»](https://www.smard.de/page/home/topic-article/444/216636/volumen-und-kosten-gesunken) (данные BNetzA за 2024, 02.04.2025), [SMARD «Maßnahmenvolumen im Gesamtjahr stabil»](https://www.smard.de/page/home/topic-article/444/219906/massnahmenvolumen-im-gesamtjahr-stabil) (Gesamtjahr 2025, 30.03.2026).
- Сдвиг в распределительные сети: в 2024 ~75% мер — в передающей сети, в 2025 — только ~2/3; **PV-абрегелирование: 1 389 GWh в 2024 (+97% к 2023), в 2025 ещё +94%** — эпицентр Бавария. Источники: [pv-magazine 03.04.2025](https://www.pv-magazine.de/2025/04/03/abregelung-von-photovoltaik-anlagen-stieg-2024-um-97-prozent/), [ZfK «Redispatch-Zahlen 2025»](https://www.zfk.de/energie/strom/redispatch-2025-pv-abregelung-verteilnetz).
- Карта BEE по Redispatch-событиям 2025 г. (в BWE-Faktencheck, апр. 2026): квоты >3% в Баварии и на севере/востоке — абрегелирование геоконцентрировано, юго-запад почти не затронут. Источник: [BWE Faktencheck «Was kostet uns Redispatch?»](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/04-politische-arbeit/01-gesetzgebung/20260421_Faktencheck_Redispatch.pdf) (апрель 2026, PDF прочитан целиком).

**НЕ НАШЁЛ (важно для опровержения):**
- **Число отдельных установок, реально затронутых мерами за год, — нигде не агрегируется.** BNetzA-квартальные отчёты дают GWh и €, не число установок. netztransparenz.de публикует каждую меру ÜNB (начало/конец, MW, MWh — [страница Redispatch](https://www.netztransparenz.de/de-de/Systemdienstleistungen/Betriebsfuehrung/Redispatch)), но: (а) без агрегатов по числу установок, (б) DSO-меры публикуют сами DSO разрозненно (пример: [EAM Netz](https://www.eam-netz.de/redispatch20/veroeffentlichung-von-redispatchmassnahmen/)). Утверждение «тысячи установок в год» — **правдоподобное допущение, не проверенный факт**. Чтобы проверить, пришлось бы вручную сшивать выгрузки десятков DSO.
- Число отдельных Abregelungen/мер в год по всей Германии — тоже без централизованного агрегата.

## 2. Порог 100 кВт

Подтверждено: порог **100 кВт** (EnWG §13a в связке с NABEG-новеллой), меньше — если установка дистанционно управляема сетевиком. Источники: [EWE NETZ](https://www.ewe-netz.de/einspeiser/strom/redispatch-ganzheitlich/redispatch-ueber-100-kw), [regionetz](https://www.regionetz.de/redispatch), [BDEW](https://www.bdew.de/energie/redispatch-20/). Точной свежей цифры установок ≥100 кВт из MaStR на 2025/2026 **не нашёл** (поиск не дал; прямой запрос в MaStR не делал).

## 3. Spitz vs Pauschal — есть ли «денежная причина платить»

**Механика (подтверждено, [BDEW-Leitfaden zur Berechnung der Ausfallarbeit, май 2020, PDF](https://www.bdew.de/media/documents/Awh_2020-05_RD_2.0_LF_Ausfallarbeit.pdf); [BNetzA BK6-20-059 Anlage 1, 06.11.2020](https://www.bundesnetzagentur.de/DE/Beschlusskammern/1_GZ/BK6-GZ/2020/BK6-20-059/BK6-20-059_Anlage1_vom_06_11_2020.pdf?__blob=publicationFile&v=1)):**
- **Pauschalverfahren** (дефолт): последняя полная четверть часа до меры экстраполируется на всю длительность меры.
- **Spitzabrechnung**: гипотетический профиль по погодным данным, измеренным на самой установке, по 15-мин интервалам (+ Korrekturfaktor).
- **Spitz light**: то же, но по референсным данным/соседним станциям, без собственной сенсорики.
- Выбор — за оператором, ежегодно на установку; **переход в Spitz необратим** (назад в Pauschal нельзя — [FAQ SWSZ-Netz](https://www.swsz-netz.de/service/faq/welches-abrechnungsmodell-muss-ich-waehlen)).

**Оценки разницы в деньгах — ВСЕ УСТАРЕВШИЕ (эпоха EinsMan, до Redispatch 2.0):**
- ENERTRAG, 19.02.2013: ветропарк 26 МВт, Шлезвиг-Гольштейн, 36 отключений за 2012 — Spitz дал **+10%** к сумме компенсации против Pauschal. Источник: [iwr.de](https://www.iwr.de/news.php?id=23054).
- ENERTRAG WindStrom, студия 07.09.2017 (~500 ВЭУ, 2 года): переход Pauschal→Spitz даёт **в среднем +26 846 €/ВЭУ/год**; «умная» Spitz против отсутствия абрехнунга — 71 650 €/ВЭУ/год. Источник: [windbranche.de, пресс-релиз 07.09.2017](https://www.windbranche.de/news/presse/pm-5732-enertrag-windstrom-studie-zu-mehrerloesen-durch-spitzabrechnung). **Осторожно: это данные 2015–2017 гг., ветер, север, режим EinsMan — прямой перенос на PV-Баварию-2026 некорректен.**
- Встречалась формулировка «Pauschal на солнечный летний день может ошибаться до 50% от номинала» (веб-сводка по FAQ сетевиков/блогам) — **первоисточник не верифицировал, использовать нельзя.**
- **Актуального (2022+) систематического сравнения Spitz vs Pauschal в евро/процентах НЕ НАШЁЛ.** Это главная дыра в утверждении.
- Направление ошибки Pauschal не универсально: для PV мера, начатая утром, режет полуденный пик → Pauschal занижает; но мера, начатая на пике ветра, может и завышать. Логика «Spitz всегда ощутимо больше» — допущение.
- **Регуляторный риск:** BNetzA ведёт консультацию [BK6-23-241 по «Korrekturfaktor» в Spitzabrechnung](https://www.bundesnetzagentur.de/DE/Beschlusskammern/1_GZ/BK6-GZ/2023/BK6-23-241/2025/BK6-23-241_konsultation.html) (Wind-Bin-Verfahren; срок подачи позиций — 13.06.2025) — методика Spitz может быть пересчитана, преимущество может сжаться.

**Кто жалуется на Pauschal:** BEE подавал позиции в оба Festlegungsverfahren по финансовому выравниванию ([Stellungnahme к §13a EnWG](https://www.bee-ev.de/service/publikationen-medien/beitrag/bee-stellungnahme-zur-konsultation-der-bestimmung-des-angemessenen-finanziellen-ausgleichs-nach-13-a-enwg), [к bilanzieller Ausgleich](https://www.bee-ev.de/service/publikationen-medien/beitrag/bee-stellungnahme-zum-festlegungsverfahren-zum-bilanziellen-ausgleich-von-redispatch-massnahme)); у биогаза своя специфика (газ факелится при заполненном хранилище — недоучёт «zusätzliche Aufwendungen», обсуждается в отраслевых FAQ/BDEW Umsetzungsfragen [v1.22, 23.08.2024](https://www.bdew.de/media/documents/Awh_20240823_Umsetzungsfragen_Redispatch-2-0_v1.22.pdf)). BWE выпустил [Handlungsempfehlung Redispatch, 27.05.2025](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/02-technik-und-netze/01-netze/20250527_BWE_Handlungsempfehlung_Redispatch.pdf) — отрасль реально занимается темой абрехнунга.

**Доля операторов по методам:** статистики **НЕ НАШЁЛ** (никто не публикует, ни BNetzA, ни BDEW).

## 4. EnWG-новелла от 23.12.2025 — механика

Подтверждено ([pv-magazine, 06.03.2026](https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/); [pv-magazine, 22.07.2026](https://www.pv-magazine.de/2026/07/22/direktvermarkter-faellt-aus-der-zahlungskette/) — за пейволом, видна только шапка; [EWE NETZ](https://www.ewe-netz.de/einspeiser/strom/redispatch-ganzheitlich/redispatch-ueber-100-kw)):
- Новелла EnWG опубликована 22.12.2025, в силе с **23.12.2025**; переработан §14/§13a EnWG.
- **Было:** для установок в Direktvermarktung компенсацию у сетевика истребовал прямой сбытовик (Direktvermarkter) и транслировал оператору (плюс bilanzieller Ausgleich по BK6-20-059).
- **Стало:** Direktvermarkter исключён из платёжной цепочки; **оператор установки сам предъявляет требование сетевому оператору**. Цитата Node Energy (CEO Matthias Karger): «законодатель убирает Direktvermarkter из непрозрачной цепочки платежей»; процесс «kompliziert und fehleranfällig», «примерно каждый десятый расчёт был ошибочным» (**источник заинтересованный** — Node Energy продаёт именно такой сервис).
- Расчёт — по **BDEW-Mischpreis** (72,5% ID-AEP + 27,5% reBAP, 15-мин интервалы, публикация на netztransparenz в T+2 мес.) → выплаты фактически в **M+2** (пример EWE: мера 01.01.2026 → расчёт ~21.03.2026).
- Для установок на фиксированном EEG-тарифе (без Direktvermarktung) порядок по сути не изменился — платит сетевик.
- **Контрфакт против «новой массовой обязанности выставлять счета»:** EWE NETZ описывает **ежемесячную автоматическую Gutschrift от сетевика** на базе данных BTR — т.е. как минимум часть DSO строит self-billing, где оператору счёт выставлять не надо. Badenova аналогично («Gutschrift vom Netzbetreiber» для мер с 23.12.2025 — [badenovanetze](https://www.badenovanetze.de/netzkunden/strom/strom-einspeisen/gesetzliche-regelungen)). Процессы у сетевиков пока неоднородны (pv-magazine: «многие сетевики ещё не настроили адекватный процесс», рекомендация выставлять счета сразу) — окно возможности есть, но оно может закрываться по мере автоматизации DSO.
- Переходный период: детальных норм не нашёл; практикуется разрез по дате меры (до/после 23.12.2025). Bundesgesetzblatt-текст новеллы напрямую не читал (**не нашёл** прямой ссылки за отведённое время) — механика взята из вторичных отраслевых источников. Помечаю как ограничение.

## 5. Денежный объём

- Компенсации операторам абрегелированных ВИЭ-установок: **2023: ~578 млн €** (расчёт из «554 млн € в 2024 = −4%», [Energie&Management, 02.04.2025](https://www.energie-und-management.de/nachrichten/energieerzeugung/detail/netzengpasskosten-2024-um-500-millionen-euro-gesunken-259018)); **2024: ~554 млн €**; **2025: ~433 млн € (−22%)** ([BNetzA via BWE Faktencheck 04/2026](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/04-politische-arbeit/01-gesetzgebung/20260421_Faktencheck_Redispatch.pdf), [ZfK](https://www.zfk.de/energie/strom/redispatch-2025-pv-abregelung-verteilnetz)). **Тренд ВНИЗ, не вверх** — упали цены, offshore −27%.
- Общие косты Netzengpassmanagement: 2,8 млрд € (2024) → 3,071 млрд € (2025), но рост — за счёт резервных электростанций (952 млн €) и конвенционального redispatch (1,2 млрд €), не ВИЭ-компенсаций.
- Средняя компенсация на установку в год: **посчитать нельзя** — числа затронутых установок нет. Допущение-вилка: 433 млн € на «десятки тысяч» затронутых установок — от единиц до десятков тыс. € на установку в среднем, но распределение крайне скошено: крупнейшие блоки — offshore-ветер (4 562 GWh в 2024 — [SMARD](https://www.smard.de/page/home/topic-article/444/216636/volumen-und-kosten-gesunken)) и крупный onshore (3 384 GWh), это корпоративные игроки с собственными процессами. «Длинному хвосту» PV ≥100 кВт достаются небольшие суммы за штуку (PV всего 1 389 GWh в 2024 при ставке компенсации порядка выпавшей выручки ~60–90 €/MWh → **допущение:** весь PV-пул компенсаций 2024 ~100–130 млн € на многие тысячи установок — в среднем скорее тысячи, чем десятки тысяч € на установку).

## 6. Конкуренты/рынок (побочный факт)

Сервисы уже существуют и активно маркетируются: **Node Energy** (opti.node, вебинары с pv-magazine), **Stromfee/HR Energiemanagement** (аудит компенсаций после отключений Bayernwerk — [stromfee.me](https://www.stromfee.me/post/erstattung-pv-anlagen-wegen-abschaltung-bayernwerk-2026)), Direktvermarkter (e2m и др.) предлагают redispatch-абрехнунг как услугу. Рынок существует — и уже занят как минимум двумя специализированными игроками.

## Сводка по критерию фальсификации

| Компонент утверждения | Статус | Ключевой факт |
|---|---|---|
| Тысячи установок затронуты в год | **Неясно** — правдоподобно, но агрегата нет | ~100 тыс. установок под режимом; число реально абрегелированных в год не публикуется |
| Счетов много / новая обязанность | **Частично подтверждено** | С 23.12.2025 оператор в Direktvermarktung сам требует компенсацию; но часть DSO автоматизирует через Gutschrift |
| Spitz даёт ощутимо больше денег | **Не подтверждено актуальными данными** | +10% (2013) и +26,8 тыс.€/ВЭУ/год (2017) — EinsMan-эпоха, ветер; свежих сравнений нет; BNetzA пересматривает Korrekturfaktor |
| Растущий денежный пул | **Опровергнуто** | Компенсации ВИЭ падают: 578→554→433 млн € (2023→2025), объёмы ВИЭ-redispatch стабильны (9,4 TWh) |

**Главные риски гипотезы:** (1) недоказанная величина среднего чека для «длинного хвоста» PV-операторов; (2) устаревшая доказательная база преимущества Spitz; (3) DSO-автоматизация (Gutschrift/self-billing) может съесть ценность сервиса за 1–2 года; (4) пул компенсаций сжимается; (5) ниша уже занята (Node Energy, Stromfee).
