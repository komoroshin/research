# IC4-4: Цена и массовость — проверка критерия фальсификации

**Дата проверки:** 01.09.2026
**Проверяемое утверждение:** «Поток проектов массовый и растущий, консультантам за пакет платят заметные деньги (ориентир цены существует), и NFPA 855-2026 реально принимается юрисдикциями — то есть рынок есть и оцифровывается».

## Вердикт (кратко)

**Утверждение в основном НЕ подтверждается — по трём из четырёх опор.**

1. «Массовый поток» — НЕТ в смысле тысяч пакетов: utility-scale поток — **сотни** проектов в год (~300–400 вводов/год), C&I-сегмент, где ждали «тысячи мелких пакетов», — карликовый (~38 МВт за квартал). Рост — да, есть, но в 2025 очередь storage в interconnection queues впервые **сократилась на 16%**.
2. «Ориентир цены существует» — **публичного ориентира цены HMA/пакета НЕ НАШЁЛ** (валидный отрицательный результат: ни презентаций с прайсом, ни RFP с суммой за HMA, ни обсуждений с цифрами). Есть только косвенные прокси.
3. «NFPA 855-2026 реально принимается» — **принимается медленно**: даже Калифорния (самый передовой штат) планирует ввод 2026-го издания только с **01.07.2027**; NYC сидит на модифицированном издании **2020**; основная масса юрисдикций — на IFC/изданиях 2020/2023.
4. Плюс два неучтённых гипотезой фактора против: **Техас — крупнейший рынок — почти без local permitting** (пакет часто не нужен вовсе), и **подпись PE обязательна** по NFPA 855-2026 (чистый софт без инженера не закрывает потребность).

---

## 1. Цена: сколько платят консультантам за HMA / пакет

**Прямых публичных цен НЕ НАЙДЕНО** — это главный отрицательный результат раздела. Проверено: сайты Code Red Consultants, Jensen Hughes, Fire & Risk Alliance, Exponent, Rigsbee, Coffman (услуги описаны, цен нет); поиск по RFP и повесткам муниципалитетов («in the amount of $», «not to exceed») — конкретных контрактов на HMA с суммой не найдено; NYSERDA Energy Storage Peer Review Guidebook (январь 2026, 1.2 МБ PDF, вычитан целиком) — методика ревью есть, **долларовых сумм нет** ([NYSERDA, 01.2026](https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Energy-Storage/2026-01-Energy-Storage-Peer-Review-Guidebook.pdf)).

Что есть (косвенные прокси):

- **UL 9540A** (делает вендор батарей, НЕ девелопер): cell-level $8–20 тыс. (2–4 недели), unit-level **$40–100+ тыс.** (6–12 недель) — [Wattality, гайд по UL 9540A](https://wattality.com/blog/ul-9540a-testing-guide). Важно: это расход **производителя** оборудования, размазанный на все проекты с этим продуктом, а не построчный расход каждого permitting-пакета.
- **Ставки экспертов-FPE:** $125–350/час у специализированных фирм ([Fire/Reconstruction Consultants rate schedule](https://fireexpert.com/rate-schedule/)); зарплатный уровень штатного FPE ~$36/час ([Salary.com](https://www.salary.com/research/salary/listing/fire-protection-engineer-salary)). **Допущение:** HMA объёмом 40–150 часов по $150–300/час → вилка **$6–45 тыс. за HMA**; полный пакет (HMA + ERP + формы + сопровождение AHJ) — условно $20–80 тыс. Это расчёт, не найденный факт.
- **Fatal flaw screening площадки** (соседняя услуга): «under $5,000 за площадку» — [Carina Energy, BESS Permitting Guide](https://carina.energy/bess-permitting-guide/). Единственная найденная публичная цена в нише.
- **Эскроу NY-тауншипов:** депозит **1% от стоимости проекта** в эскроу на оплату консультантов и юристов при рассмотрении заявки (Town of Hamden NY local law; аналогично Binghamton, Pine Plains — [ecode360](https://ecode360.com/42094837)). Это подтверждает, что деньги на консультантов при рассмотрении крутятся заметные, но платит их девелопер за ревью со стороны города, а не за свой пакет.
- **Peer review обязателен в NY:** 2025 NYS Fire Code требует peer review всех BESS выше порога; AHJ вправе заставить девелопера оплатить независимое ревью ([NYSERDA Peer Review Guidebook, 01.2026](https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Energy-Storage/2026-01-Energy-Storage-Peer-Review-Guidebook.pdf)). Заметь инверсию: NYSERDA строит **вендорский пул проверенных peer-ревьюеров** — т.е. штат сам стандартизирует и частично коммодитизирует эту работу.

**Время:** публичных данных «HMA занимает N недель» не нашёл. Прокси: unit-level 9540A — 6–12 недель; мораторaffected-сроки ниже. Помечаю как не найдено.

## 2. Массовость: сколько пакетов в год

- **Вводы:** рекорд 2025 — **18,9 ГВт** BESS всех сегментов, +52% к 2024 ([Wood Mackenzie/ACP, пресс-релиз](https://www.woodmac.com/press-releases/2025-u.s.-energy-storage-installations-set-new-record-surpass-2024-by-52)); SEIA даёт 58 ГВт·ч за 2025 ([SEIA](https://seia.org/news/united-states-installs-58-gwh-of-new-energy-storage-in-2025/)).
- **Число объектов, а не ГВт:** действующих utility-scale батарейных станций ≥1 МВт — **~1 022** (EIA-860M, июнь 2026, через [usnuclearpowerplants.com/battery](https://usnuclearpowerplants.com/battery)); EIA ранее ожидала **300+ проектов к вводу за 2025** ([EIA Today in Energy](https://www.eia.gov/todayinenergy/detail.php?id=61202)). То есть поток вводов utility-scale — **порядка 300–400 объектов/год**, permitting-поток (с учётом отмирающих) — допущение: 500–1 000 заявок/год.
- **Пайплайн:** 2 741 планируемый проект у **244 девелоперов**, 513 ГВт ([Cleanview, июнь 2026](https://cleanview.co/power-projects/developers/battery-storage)). Но пайплайн ≠ годовой поток: большинство проектов из очереди никогда не строится.
- **Очередь сжимается:** LBNL Queued Up 2026 (июнь 2026): storage в активных очередях **749 ГВт, −16% за 2025** — первый спад ([LBNL, PDF](https://emp.lbl.gov/sites/default/files/2026-06/Queued%20Up%202026%20Edition.pdf), [RTO Insider](https://www.rtoinsider.com/136008-lbnl-interconnection-report-2026-signs-improvement/)). «Растущий поток заявок» уже не бесспорен.
- **C&I («тысячи мелких пакетов») — ОПРОВЕРГНУТО:** community/commercial/industrial сегмент в Q2 2025 — всего **38 МВт** ([Wood Mackenzie Q2 2025](https://www.woodmac.com/press-releases/us-energy-storage-installations-reach-new-quarterly-record-in-q2-with-5.6-gw)); за год это грубо 150–250 МВт → при 0,5–2 МВт на объект — **порядка 100–400 установок/год**, не тысячи. Резидентка (2,7 ГВт, 92% роста) идёт по листингу UL 9540 и прескриптивным требованиям — полноценный HMA-пакет там не нужен.

## 3. Принятие NFPA 855-2026

- **Калифорния:** с 01.01.2026 действует CA Fire Code с привязкой к NFPA 855 **2023**; OSFM лишь «намерен предложить раннее принятие» издания 2026 — **эффективно с 01.07.2027** ([ess-news.com, 10.10.2025](https://www.ess-news.com/2025/10/10/california-adopts-battery-storage-safety-legislation-following-moss-landing-fire/); [Energy Law Blog, 11.2025](https://www.energylawinfo.com/2025/11/california-battery-energy-storage-systems-legislation-update-safety-requirements-and-ab-205-opt-in-procedures-amended/)). SB 38 (подписан Ньюсомом) требует emergency response plans — это подтверждает спрос на ERP-часть пакета ([офис сенатора Laird](https://sd17.senate.ca.gov/news/governor-newsom-signs-legislation-enhance-battery-storage-safety)).
- **Нью-Йорк:** штатный 2025 Fire Code с 01.01.2026 «aligns with and exceeds NFPA 855» + обязательный peer review ([NYSERDA](https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Energy-Storage/2026-01-Energy-Storage-Peer-Review-Guidebook.pdf)); **NYC — модифицированное издание 2020** (1 RCNY 3616-07, [Code Red Consultants](https://coderedconsultants.com/insights/new-rules-for-battery-energy-storage-systems-in-new-york-city/)).
- **Другие штаты:** Michigan, Indiana — законы о соответствии NFPA 855; Maryland, NY — регуляции «latest NFPA 855» ([ACP](https://cleanpower.org/news/battery-storage-industry-unveils-national-blueprint-for-safety/)). Каких изданий — в первоисточниках не уточнено.
- **Вывод:** тезис «855-2026 принимается юрисдикциями» на 09.2026 **фактически ложен в настоящем времени**: ни одна найденная юрисдикция ещё не ввела издание 2026 в действие; лидер (CA) — июль 2027; остальные догонят через цикл IFC (обычно 3–6 лет). «Неизбежность» откладывается ровно так, как сформулировано в критерии фальсификации. При этом HMA как требование существует и в изданиях 2020/2023 (мягче, по требованию AHJ) — спрос есть, но триггер «всем станет обязательно в 2026» не сработал.

## 4. Обратный ветер: моратории после Moss Landing (01.2025)

- «Дюжины» локальных мораториев; резкий рост с 2023 ([Heatmap через MarketBeat, 10.2025](https://www.marketbeat.com/articles/fears-of-massive-battery-fires-spark-local-opposition-to-energy-storage-projects-2025-10-04)).
- **52 сообщества** (США + немного Австралии) отклонили батарейные проекты — Global Battery Rejection Database ([Robert Bryce, Substack](https://robertbryce.substack.com/p/the-battery-backlash-is-real-its)).
- Точечные примеры: Orange County NY (2025), Solano County CA (2024), Morro Bay — запрет с прицелом до 2027 ([AOL/SLO Tribune](https://aol.com/morro-bay-moves-block-battery-213520827.html)), San Benito County — пауза ([BenitoLink](https://benitolink.com/supervisors-hit-pause-on-energy-storage-projects/)).
- Моратории длятся 6–18 месяцев и иногда становятся постоянными ([Carina Energy](https://carina.energy/bess-permitting-guide/)).
- Двоякий эффект: моратории сокращают поток пакетов, но ужесточение требований в выживших юрисдикциях повышает ценность каждого пакета. Чистый эффект на количество — минус.

## 5. Кто покупатель: концентрация

- **244 девелопера** держат пайплайн 513 ГВт ([Cleanview](https://cleanview.co/power-projects/developers/battery-storage)); NextEra один — 2,8 ГВт операционных, втрое больше ближайшего преследователя ([Tamarindo](https://tamarindo.global/insight/analysis/who-are-the-top-5-us-storage-companies-by-operating-capacity/)).
- **Допущение** (стандартное для отрасли распределение): топ-10–20 девелоперов держат основной объём ГВт; у них 10–50 проектов/год, in-house инженерия и рамочные договоры с Jensen Hughes/Fisher/ESRG — софту туда путь через enterprise-продажу, не self-serve.
- Покупателей «длинного хвоста» — считанные сотни (244 девелопера всего, из них активных с ≥1 проектом в год — заметно меньше), плюс порядка сотен C&I-EPC. **Тысяч покупателей нет.**
- **Техас — критический контрфакт:** штат-лидер по новым вводам (7 ГВт плана на 2025, обгоняет Калифорнию — [Cleanview newsletter](https://newsletter.cleanview.co/p/ranking-the-top-clean-energy-developers)), при этом **state-level пермитов нет, а округа не могут зонировать неинкорпорированные земли** ([TDI FAQ](https://www.tdi.texas.gov/fire/battery-energy-storage-systems.html); [PNNL-34462](https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-34462.pdf)). Значит, существенная доля крупнейшего рынка вообще не генерирует спрос на AHJ-пакет (страховщики/кредиторы требуют часть документов, но это другой, добровольный спрос).
- **Барьер PE:** NFPA 855-2026 требует, чтобы HMA вёл registered design professional / FPE ([Code Red Consultants](https://coderedconsultants.com/insights/hazard-mitigation-analysis-updates-nfpa-855-2026/); [sunlithenergy.com](https://sunlithenergy.com/nfpa-855-guide/)). «Генератор пакета» без печати инженера — черновик, а не продукт permitting; либо нужен свой инженерный штаб (тогда это консалтинг с софт-плечом, а не софт).
- **Конкуренты уже в нише:** Kite Compliance (kitecompliance.ai — AI-гайды по NFPA 855/9540A) и BESS SDK (bess-sdk.com) уже строят продукт вокруг этой документации — ниша не пустая.

## 6. Санити-чек SAM

Все строки — расчёт-допущение на числах из разделов 1–2.

| Сценарий | Пакетов/год | Цена софт-пакета | Выручка-потолок |
|---|---|---|---|
| Консервативный | 400 (вводы utility-scale + активный C&I) | $3 000 | **$1,2 млн/год** |
| Базовый | 800 (permitting-поток с отмиранием) | $5 000 | **$4 млн/год** |
| Агрессивный (100% рынка!) | 1 500 (все заявки, все сегменты) | $10 000 | **$15 млн/год** |

Даже агрессивный сценарий предполагает 100% захват рынка и цену, близкую к нижней границе цены живого консультанта. Реалистичный SOM (10–20% базового) — **$0,4–0,8 млн/год**. Порог «бизнес ≥$10 млн» **не проходится** без выхода за рамки гипотезы (консалтинг с PE-штампом, соседние документы — interconnection, страхование, peer-review-сторона для AHJ, международные рынки).

## Что подтвердилось

- Рост вводов реален и рекорден (18,9 ГВт, +52% — Wood Mackenzie).
- Регуляторное ужесточение реально: SB 38 (CA), обязательный peer review (NY), NFPA 855-2026 расширяет HMA почти на все установки — направление верное.
- Деньги в контуре permitting-безопасности крутятся (эскроу 1% от CAPEX в NY-таунах; 9540A $40–100 тыс.).

## Итог по критерию фальсификации

Критерий «рынок есть и оцифровывается» **сфальсифицирован в 3 из 4 частей**: (а) поток — сотни, не тысячи, и очередь сокращается; (б) публичного ориентира цены пакета нет — рынок непрозрачный, чисто консалтинговый; (в) издание 2026 ещё нигде не действует, лидер введёт 07.2027; (г) дополнительно: Техас без пермитов, обязательный PE, 2 существующих софт-конкурента, покупателей — сотни с высокой концентрацией. Потолок выручки чистого софт-генератора — единицы миллионов долларов в год.
