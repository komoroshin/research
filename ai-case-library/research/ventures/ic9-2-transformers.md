# IC9-2 — Независимая оценка состояния б/у силовых трансформаторов как сервис для сделок. Проверка скептиком

Дата: 2026-09-01. Режим: опровержение утверждения
«Вторичный рынок трансформаторов вырос до заметных объёмов, сделки требуют независимой оценки состояния, за неё платят, и позиция оценщика не занята инкумбентами».

## 0. Вердикт

**Утверждение опровергнуто в 3 из 4 частей.**

| Часть утверждения | Статус | Кратко |
|---|---|---|
| Вторичный рынок вырос до заметных объёмов | **Подтверждено частично** (только качественно) | Спрос на б/у реально на максимумах (Surplus Record: 5 000+ запросов/год; Maddox 8 лет в Inc. 5000; Sunbelt Solomon продан PE→PE в июле 2026). Но **ни одной публичной оценки размера вторичного рынка в $ не нашёл**; единственная цифра «surplus electrical market >$1 млрд» — из промо-статьи маркетплейса, низкое доверие. |
| Сделки требуют независимой оценки состояния | **Опровергнуто** | Доминирующая модель — дилер-реконд (Maddox, Sunbelt Solomon, T&R, ELSCO, Jordan, Emerald) сам тестирует, сам ремонтирует, **сам даёт гарантию 3–5 лет** и продаёт под ANSI/PEARL-стандартом. Гарантия дилера заменяет оценку третьей стороны. Не нашёл ни одного продукта «сертификат состояния б/у трансформатора для сделки» и ни одного упоминания, что покупатели/страховщики/кредиторы такую оценку требуют. |
| За неё платят | **Не подтверждено** | Платят за DGA-анализ (лаборатории SDMyers/Doble/HSB/TJ|H2b), за condition assessment парка (Doble, Hitachi Energy, EA Technology, Siemens Energy) — но это **владельцы парка**, не участники сделок. Публичных прайсов ни у кого нет. Спрос на «оценку под покупку» как отдельную услугу в открытых источниках не виден. |
| Позиция оценщика не занята инкумбентами | **Опровергнуто** | Позиция занята с трёх сторон: (а) дилеры с in-house лабораториями и PEARL-аккредитацией; (б) независимые лаборатории/консультанты с 80-летними базами (Doble/ESCO — «80-year knowledgebase», SDMyers, HSB TOGA — страховщик Munich Re сам делает DGA); (в) NETA-аккредитованные независимые тестовые компании (по правилам NETA обязаны быть независимы от OEM/дилеров — это буквально «независимый оценщик» и он уже существует). |

**Плюс критический блокер доступа (новое, 26.08.2026):** Executive Order 14420/14421 «Declaring a National Emergency to Secure the U.S. Bulk-Power System» — запрещает транзакции с оборудованием, **а также «associated software, firmware, digital services, maintenance services and remote-access capabilities»**, связанными с «Covered Foreign Entity»; Россия в списке 24 стран. Действует на bulk-power system (69 кВ+, подстанции), **распределительные сети исключены**. Правила DOE — до 24.12.2026. Для сервиса с РФ-основателями и РФ-партнёром данных это ставит под вопрос сегмент utilities/подстанционных трансформаторов в США целиком; остаётся частный/распределительный сегмент (padmount ≤34.5 кВ), где как раз и живут реконд-дилеры — но там и оценка третьей стороны меньше всего нужна.

**Итог:** гипотеза в формулировке «независимый оценщик для сделок» — закрыть или радикально изменить. Ниже — по пунктам.

---

## 1. Размер и рост вторичного рынка

### Что подтверждается
- **Дефицит и цены новых.** Стандартные power transformers — средний lead time 128 недель, GSU — 144 недели; трёхфазные padmount — 40+ недель (Build.inc, «Data Center Transformer Procurement in 2026», https://build.inc/insights/data-center-transformer-procurement-2026). Substation-трансформаторы: ~140 недель в 2023 → >160 недель в 2026 (POWER Magazine, «Transformers in 2026: Shortage, Scramble, or Self-Inflicted Crisis?», https://www.powermag.com/transformers-in-2026-shortage-scramble-or-self-inflicted-crisis/). PV Magazine USA 11.05.2026 — lead times до четырёх лет (https://pv-magazine-usa.com/2026/05/11/u-s-transformer-market-faces-severe-supply-constraints-as-lead-times-extend-to-four-years/).
- **Цены новых:** PPI трансформаторов 197.30 (дек. 2019) → 366.604 (янв. 2026), +85.8%; power transformers +77% с 2019; распределительные +78–95% (Electrical Trader, «Historical Price Trends: Breakers and Transformers», https://electricaltrader.com/blogs/news/historical-price-trends-breakers-transformers — блог маркетплейса, PPI-цифры проверяемы по BLS).
- **Дисконт б/у:** «Used transformers can save 30–60% upfront»; пример: 10 MVA — экономия $45 000 сразу, но +$100 000 потерь энергии за 10 лет (там же). Тот же диапазон 30–60% повторяет Giga Energy (https://www.gigaenergy.com/blog/lead-time-delays-for-data-centers). ЮАР: «до 50%» (WDP Transvolt, https://wdptransvolt.co.za/product/3000-kva-transformers/).
- **Спрос на б/у на максимумах.** Surplus Record, пресс-релиз 25.06.2026: >5 000 запросов на трансформаторы за год; наибольший спрос — 3-фазные 1–2.5 MVA, вторичка 480 В, первичка 12.47/13.8 кВ; покупатели — utilities, подрядчики, производители, муниципальные utilities, девелоперы. Цитата президента Tommy Scanlan: «The secondary transformer market is as active as I've seen it in years» (https://www.barchart.com/story/news/2650996/used-transformer-demand-reaches-new-highs-as-lead-times-on-new-equipment-stretch-beyond-two-years-reports-surplus-record). **Важно:** 5 000 запросов — это распределительный класс (padmount ≤2.5 MVA), а не силовые подстанционные.
- **Дилеры растут:**
  - **Maddox Industrial Transformer** (осн. 2015, Battle Ground WA): Inc. 5000 восемь лет подряд, в 2026 — #1 367; 400 сотрудников; 8 площадок (WA, ID, OH, TX, SC, TN); 3-летний рост 798% на момент рейтинга 2024 (Inc./Maddox, https://www.maddox.com/resources/articles/inc-5000-2024; BusinessWire 11.08.2026, https://www.businesswire.com/news/home/20260811631291/en/...). Выручка: оценки расходятся — $53.8M (Kona Equity), $100–500M (IncFact), «nine figures… toward $1B» (Aaron Renn, https://www.aaronrenn.com/p/pursuing-ownership — вторичный источник). Частная, основатели-владельцы; **раундов/PE не нашёл** (Crunchbase/PitchBook профили пустые). NB: «Maddox Industrial Group» (Indianapolis, продана TransTech/Bridge Industries 11.01.2022) — **другая компания**, не путать (https://www.prnewswire.com/news-releases/transtech-announces-acquisition-of-maddox-industrial-group-301458415.html).
  - **Sunbelt Solomon** (Temple TX): 42 локации в США/Канаде/Чили, >1 600 сотрудников, «50 000+ единиц» на складе; Trilantic NA купил Sunbelt, слил с Solomon Corp (Oaktree GFI) 01.07.2019; в июле 2026 объявлена продажа фондам **TJC** (AUM $31.9B), закрытие Q3 2026, сумма не раскрыта (https://www.prnewswire.com/news-releases/sunbelt-solomon-announces-tjc-as-new-investment-partner-302829920.html; https://www.gibsondunn.com/gibson-dunn-advises-trilantic-north-america-and-sunbelt-solomon-services-on-sunbelt-solomon-sale/). Оценки выручки: $123–127M (ZoomInfo/PrivCo) — вероятно устаревшие при 1 600 сотрудниках. Предложение включает **asset management** для utilities — т.е. дилер уже продаёт услугу оценки парка.
  - **T&R Electric** (Colman SD, осн. 1961): «largest supplier of remanufactured transformers in the US», ~200 сотрудников, 61 акр, rebuild до 138 кВ / 30 MVA, buys/sells/**rents** (https://t-r.com/; https://heartlandenergy.com/tr-electric-powers-industry-community/).
  - **Emerald Transformer** — портфель Insight Equity (PE), купил трансформерное подразделение Clean Harbors в 2017 (https://www.insightequity.com/investments-info/emerald-transformer). **ELSCO** (Cincinnati, с 1960) — семейная, 5 поколений; **Jordan Transformer** — реманufacturing 69–230 кВ и мобильные подстанции. Раундов/сделок 2024–2026 по ним не нашёл.
  - Европа: **Slaters Electricals** (UK, «300+ used transformers in stock», до 132 кВ/40 MVA, refurbish in-house «to as-new»), **Bowers Electricals** (UK, «one of the largest stocks in Europe», гарантия 2 года). Cofely/«TRAFO» как реконд-дилеров **не нашёл**.

### Что НЕ подтверждается
- **Размер вторичного рынка в $ — не нашёл.** Все отчёты (GMI: US transformer market >$12.2B в 2024; глобальный ~$65–68B в 2025) — про новые. Сегмент «refurbished/used» отдельно никто не считает. Единственная цифра — «surplus electrical market estimated at over $1 billion» из промо-статьи Electrical Trader (https://electricaltrader.com/blogs/news/best-platforms-selling-electrical-equipment) — не источник.
- **Доля б/у в поставках** — не нашёл.
- **Допущение:** по составу спроса Surplus Record и продуктовым линейкам дилеров, ~90% вторичного оборота — распределительные и padmount ≤2.5 MVA (стоимость единицы $20–150k). Силовые подстанционные (≥10 MVA, $0.5–5M) — штучный рынок (Jordan, T&R, Transformer Exchange, Transformer Traders).

---

## 2. Кто оценивает состояние при сделке сегодня

- **Дилеры — сами и полностью.** Maddox: «Every transformer that Maddox remanufactures begins with a full battery of chemical and electrical tests… once again tested to ensure it meets all IEEE C57 and ANSI standards», 45-point review, **гарантия 3 года** (на странице ДЦ — 5 лет), PEARL-аккредитация (https://www.maddox.com/remanufactured; https://www.maddox.com/projects/datacenters; https://pearl1.org/2025/01/18/maddox-industrial-transformer-certificate-of-accreditation/). Surplus Record: «dealers offering certificates showing transformers were fully tested and ready for service». Т.е. **«сертификат состояния» уже существует — как приложение к гарантии дилера.**
- **Отраслевой стандарт есть:** PEARL (осн. 1997, ANSI-аккредитованный разработчик) — ANSI/PEARL Electrical Equipment Reconditioning Standard + Inspect & Test Standard; секции 1400 (≤600 В) и 2400 (2.4–38 кВ) — трансформаторы; «PEARL Reconditioned Seal»; аккредитация компаний третьей стороной (https://pearl1.org/reconditioning-standard/; https://pearl1.org/about-accreditation/). NB: только до 38 кВ — силовые подстанционные вне стандарта.
- **Независимые тестовые компании уже есть:** NETA (ANSI/NETA ATS/MTS) требует, чтобы аккредитованные компании были «independent, third-party testing firms with no affiliation to equipment manufacturers, electrical contractors, or product distributors» (https://electricaltrader.com/blogs/news/understanding-neta-standards-electrical-testing; https://webstore.ansi.org/sdo/neta). Это и есть «независимый оценщик» — сотни фирм по США.
- **Лаборатории/консультанты:**
  - **Doble** (ESCO Technologies; купила Morgan Schaffer 25.05.2017): Condition Assessment Services — O&M records, DGA, loading history, offline tests, отчёт с рекомендациями; dobleARMS — «80-year knowledgebase of asset performance». Прайс не публикуют (https://www.doble.com/services/consulting-testing-services/consulting-services/condition-assessment-services/).
  - **SDMyers**: DGA mail-in, 10–14 рабочих дней; Transformer Dashboard (health score, «At Risk/Satisfactory»), Premium-подписка; прайс не публикуют (https://www.sdmyers.com/transformer-services/testing-monitoring/oil-testing/dga/; https://www.sdmyers.com/transformer-services/testing-monitoring/transformer-dashboard/).
  - **HSB (Munich Re)** — страховщик **сам** оказывает TOGA Fluid Analysis: DGA, screen tests, moisture, furans, PCB (https://www.munichre.com/hsb/en/services/engineering/transformer-fluid-analysis/testing-results.html). Плюс «equipment longevity evaluations». Т.е. страховщик — не клиент оценщика, а сам оценщик.
  - **Hitachi Energy** «Assess & Secure» / TXpert — «manufacturer-agnostic», fleet screening → condition assessment → life extension (https://www.hitachienergy.com/products-and-solutions/transformers/transformer-service/assess-and-secure). **Siemens Energy** transformer services, **EA Technology** (UK) — аналогично.
  - **FM Global** — Data Sheet «Transformers» (rev. Oct 2025), сам ведёт инженерный надзор.
- **Пре-покупочная оценка б/у как продукт** — **не нашёл** ни у одного игрока. Гайды для покупателей («Surplus dealers offer reconditioned units with basic test reports… warranty 3–6 months; online auctions… as-is, no load testing documentation») советуют требовать TTR/megger/DGA у продавца или заказать NETA-тест (https://electronics.alibaba.com/buyingguides/used-power-transformer-buying-guide; https://www.jslhtf.com/used-vs-new-transformer-price-risk-comparison-for-procurement/). Т.е. потребность закрывается либо гарантией дилера, либо разовым NETA-тестом ($, локально).
- **Цена DGA** — публичного прайса нет ни у SDMyers, Doble, HSB, RESA, Intertek, OilAnalysisLab («Login to Buy»). **Допущение:** $100–300 за пробу, полный пакет (DGA+furans+screen) $300–600; on-site condition assessment силового трансформатора — $5–25k. Не подтверждено источниками.
- **Кредиторы:** оценка залога делается ASA/CMEA-аппрейзерами по USPAP (OLV) — общая машинно-оборудовательная практика, без специфики трансформаторов (https://www.kdauctions.com/resources/blog/uspap-equipment-appraisal-what-banks-lenders-actually-require). Спроса на «техническую» оценку трансформаторов от кредиторов не нашёл.

---

## 3. ИИ-оценка остаточного ресурса — кто продаёт

- Владельцам парка: SDMyers Transformer Dashboard; Doble dobleARMS/doblePRIME; Hitachi TXpert Hub/Services; Schneider EcoStruxure Transformer Expert (2024); Camlin TOTUS/TOTUSPRO; Dynamic Ratings; Qualitrol/Serveron (Ralliant); Vaisala OPT100 (обновлён апр. 2025 — активно развивают, не дивестировали); Delta-X Research TOA (независимая, Frost & Sullivan award 2022). Все — **fleet management для владельца**, подписка/приборы.
- Рынок мониторинга небольшой: Transformer Monitoring System Market ~$252M (2024) → $358M (2032) (marketresearchfuture — низкое доверие, порядок величины). DGA-анализаторы — до ~$1.16B к 2035 (openPR/market report, низкое доверие).
- «DD-оценка для покупки б/у» как ИИ-продукт — **не нашёл**.
- Академическая литература: обзор «Power Transformer Health Index and Life Span Assessment» (arXiv 2504.15310, 2025) — десятки ML-подходов; RF по IEEE C57.104-2019 — 89% точности; KPCA+RF — «100%» на малой выборке (https://pmc.ncbi.nlm.nih.gov/articles/PMC10877302/; https://doi.org/10.3390/machines14060634). Точность на бенчмарках упёрлась в потолок — дифференциация по алгоритму невозможна.

---

## 4. Данные и коммодитизация

- **Публичные DGA-датасеты есть:** IEC TC 10 (117 случаев с визуально подтверждённой неисправностью; Duval & Dukarm 2001, IEEE Xplore 917529); IEEE DataPort «DGA dataset» (703 записи: 584 train / 70 test / 49 IEC TC10; 5 газов + 7 классов; подписка IEEE DataPort, DOI 10.21227/27vy-h479); GitHub-наборы 376–1 758 образцов; Kaggle health-index сэмплы (https://ieee-dataport.org/documents/dga-dataset; https://github.com/alan-456/transformer-fault-dataset). CIGRE TB 642 (2015): 964 отказов на 167 459 трансформеро-лет, 56 utilities, 21 страна; отказность 0.53%/год substation, 0.95%/год GSU; винтовые 37.7%, вводы 15.9% — €230 для не-членов (https://www.e-cigre.org/publications/detail/642-transformer-reliability-survey.html).
- **Методики стандартизованы:** IEC 60599, IEEE C57.104-2019, Duval Triangle/Pentagons, IEEE C57.140-2017 (evaluation & reconditioning, remaining insulation life), C57.152 (field testing). Vaisala раздаёт **бесплатный DGA-калькулятор** (2023).
- **Вывод:** классификация неисправностей по DGA — коммодити (сотни статей, открытые наборы, бесплатные калькуляторы). Реальная ценность — в **лонгитюдных данных с исходом** (что случилось с трансформатором через N лет после оценки). Такие данные у Doble (80 лет), SDMyers, utilities. Ров партнёра: РФ-парк с историями — единичные тысячи единиц, другие конструкции (советские/российские заводы, ГОСТ), другие масла и режимы; **переносимость на парк GE/Westinghouse/ABB 1970-х в США — допущение, ничем не подтверждённое.** Плюс — см. EO — сам факт «модель обучена на данных российской сетевой компании» становится compliance-риском для клиента-utility.

---

## 5. Регуляторика и стандарты

- **DOE efficiency rule (Final Rule 22.04.2024, 89 FR, compliance с 23.04.2029):** распространяется на трансформаторы, «manufactured for sale or imported»; **«Refurbishment or rewinding of existing distribution transformers currently does not fall under the scope of energy-efficiency regulations»** (NEMA, «Energy Efficiency Regulations and Requirements for Distribution Transformers», https://www.nema.org/docs/default-source/nema-documents-libraries/doe-transformer-efficiency-regs.pdf; https://www.federalregister.gov/documents/2024/04/22/2024-07480/...). Это **поддерживает** реконд-рынок (арбитраж: б/у не обязан соответствовать), но одновременно даёт **регуляторный риск**: DOE получал комментарии по refurbished ещё в 2006–2007 — лазейку могут закрыть.
- **IEEE C57.140-2017** — guide по оценке и реконду; **ANSI/PEARL** — стандарт реконда до 38 кВ; **NETA ATS** — приёмочные испытания.
- **Страхование:** equipment breakdown (HSB, FM, Chubb, Travelers, CNA) — андеррайтинг учитывает age/condition/maintenance history; специальных условий для б/у трансформаторов **не нашёл**; страховщики ведут собственные loss-prevention программы (термография, oil analysis) — https://www.adjustersinternational.com/pubs/adjusting-today/equipment-breakdown-insurance/.
- **EO 14420/14421 от 26.08.2026** (91 FR 55995, опубл. 31.08.2026): запрет на acquisition/import/transfer/installation BPS-оборудования, связанного с Covered Foreign Entity, включая «associated software, firmware, digital services, maintenance services and remote-access capabilities»; 24 страны, включая Россию и Китай; действует «notwithstanding any contract entered into prior»; распространяется и на уже установленное оборудование (inventory/isolation/replacement); распределительные сети (local distribution) **исключены**; правила DOE до 24.12.2026 (Crowell & Moring, https://www.crowell.com/en/insights/client-alerts/power-play-new-executive-order-targets-electrical-grid-equipment; McGuireWoods, https://www.mcguirewoods.com/client-resources/alerts/2026/8/executive-order-expands-scrutiny-of-foreign-produced-bulk-power-equipment-what-energy-companies-should-know/; KPMG, https://kpmg.com/us/en/taxnewsflash/news/2026/08/united-states-national-emergency-bulk-power-system.html). Номер расходится по источникам (14420 у Crowell/NatLawReview, 14421 у McGuireWoods/Sosa&Arvelo) — суть одна.
- FEOC-правила (OBBBA 2025) — для налоговых кредитов, не для сервисов; здесь вторично.

---

## 6. Доступ и альтернативные рынки

- **США, utilities/подстанции (69 кВ+):** после EO 26.08.2026 — «digital services» и «maintenance services» от лиц под юрисдикцией РФ — в зоне запрета; де-факто utility не подпишет договор с вендором, у которого РФ-основатели и РФ-партнёр данных, до появления правил DOE. **Допущение:** юрлицо вне РФ не снимает критерий «owned by, controlled by, or subject to the jurisdiction or direction» при РФ-гражданстве бенефициаров.
- **США, частные дилеры/распредкласс:** EO не действует, но там оценка третьей стороны и не нужна (гарантия дилера).
- **Индия:** импорт second-hand capital goods — «restricted», лицензия IMRLC; <5 лет — обычно автоматически, >10 лет — обычно нет, кроме heavy equipment для инфраструктуры (DGFT, https://content.dgft.gov.in/Website/27_8.pdf). Внутренний рынок б/у огромен (Indiamart/TradeIndia — сотни дилеров), но дёшев и локален.
- **Залив:** Саудовская Аравия — SASO/SABER, «importation of used, refurbished… parts strictly prohibited, except for major components», Quality Mark обязателен для электрооборудования (https://www.trade.gov/country-commercial-guides/saudi-arabia-prohibited-and-restricted-imports; https://analytical-group.com/en/news-en/saso-updates-import-saudi-arabia). Saudi Transformers Co. сама делает refurbishment до 3 MVA. Рынок для б/у-импорта — закрыт/узок.
- **Африка:** ЮАР — активный реконд (Transformer King, WDP Transvolt — экспорт в Намибию, Ботсвану, Зимбабве, Замбию, Мозамбик, Лесото под SADC-сертификатами; скидка «до 50%»); Нигерия — импорт трансформаторов из Индии $83.25M (2024); специального запрета на б/у трансформаторы не нашёл. Платёжеспособность на «независимую ИИ-оценку» — сомнительна (допущение).
- **ЛатАм:** Sunbelt Solomon уже в Чили; Бразилия — экспортёр новых (Hitachi Energy). Отдельного вторичного рынка с данными не нашёл.
- **Европа:** UK-дилеры (Slaters, Bowers) — та же модель «refurbish in-house + гарантия».

---

## 7. Некролог / судьба игроков transformer health & grid analytics

Полных «смертей» стартапов именно в transformer health **не нашёл**; паттерн — ранняя продажа стратегу за нераскрытые/небольшие суммы, затем перепродажи:

| Компания | Что | Судьба | Источник |
|---|---|---|---|
| **Sentient Energy** | line sensors + predictive failure analytics для распредсетей | Koch Engineered Solutions купил 26.03.2020 → **продан Accurant International 12.04.2024** (сумма не раскрыта; Koch избавился через 4 года) | https://sentientenergy.com/press/accurant-international-acquires-sentient-energy/ |
| **GridSense** | мониторинг распределительных трансформаторов | Куплен Franklin Electric в 2016 (не «Eaton», как пишут маркет-репорты) | Tracxn/LinkedIn профиль; https://tracxn.com/d/companies/gridsense/... |
| **Morgan Schaffer** | DGA-мониторы, Calisto | Куплен ESCO/Doble 25.05.2017, сумма не раскрыта | https://www.doble.com/news/doble-engineering-company-welcomes-morgan-schaffer-new-subsidiary/ |
| **LumaSense** | сенсоры/мониторинг (в т.ч. трансформаторы) | Advanced Energy, $85M, 2018 | https://mergr.com/transaction/advanced-energy-industries-acquires-lumasense-technologies |
| **IntelliSAW** | беспроводные датчики T&D | Emerson, 21.10.2015, сумма не раскрыта | https://www.emerson.com/en-us/news/automation/1510-intellisaw |
| **Serveron** | online DGA | → BPL Global → Qualitrol (Ralliant) | https://www.qualitrolcorp.com/products/TM1 |
| **Trove Predictive Data Science** | прогноз нагрузки до трансформатора | E Source, 10.02.2020 | https://aligncp.com/news/esource-acquires-trove-predictive-science/ |
| **Verdeeco** | grid analytics (transformer utilization) | Sensus/Xylem, 07.04.2014 | https://www.utilitydive.com/news/sensus-acquires-smart-grid-data-startup-verdeeco/248558/ |
| **AutoGrid** | grid flexibility analytics | Uplight, дек. 2023 (после raise >$100M — допущение, суммы сделки нет) | https://www.cbinsights.com/company/autogrid-systems |
| **Delta-X Research** | TOA (интерпретация DGA), независимая с 1990-х | Жива, маленькая, не куплена | https://www.deltaxresearch.com/ |
| **Kelman** | portable/online DGA | GE, 2008 — **по памяти, допущение** | — |

**Уроки:** (1) utility-цикл продаж 18–36 месяцев, пилоты не масштабируются; (2) exit — стратегу-приборостроителю, т.к. ценность в приборе+данных, а не в софте; (3) чистый софт без сенсора/лаборатории не удержал позицию — ни один независимый «аналитический» игрок не вырос в заметный бизнес. Единственный растущий класс — **дилеры с активами** (Maddox, Sunbelt Solomon) и **Gridware** (сенсоры для линий, Series B $55M нояб. 2025 — не трансформаторы). Утверждение «GridSense $25M Series B 2025» из marketresearchfuture — **ложное**.

---

## 8. Смежная возможность — брокеридж б/у оборудования

- **Маркетплейсы:** Surplus Record (с 1924; фикс. месячная плата, «$0 commissions», 130 000+ читателей каталога; 5 000+ запросов на трансформаторы/год); Machinio (Liquidity Services с 2018, подписка дилера, цены не публикуют); Aucto (аукционы, «zero seller fees» на части категорий, buyer's premium не раскрыт; отраслевая норма 10–18%); Salvex (performance-based/exclusive commission, суммы не раскрыты); Electrical Trader (ниша electrical); eBay. Специализированные брокеры силовых: **Transformer Exchange** (Traverse City MI, buy/sell/**rent**), **Transformer Traders** (крупные силовые для utilities/ДЦ), transformerbroker.com.
- **Где ров:** у всех растущих игроков — **inventory**. Sunbelt Solomon — 50 000+ единиц на складе; Maddox — «in stock, ready to ship», собственные 8 площадок и remanufacturing; T&R — 61 акр и rebuild-цех. Их ценность — скорость (48 часов vs 128 недель) + гарантия, что невозможно без владения и ремонта. Чистые маркетплейсы (Surplus Record, Machinio) — старые, малые (Surplus Record — семейный бизнес, фикс-плата), не капитализируют дефицит.
- **Вывод:** брокеридж «без владения активами» существует (Transformer Traders, transformerbroker), но это индивидуальные брокеры с комиссией (допущение 3–10%), без масштаба и без данных; фильтр ComputeGrid #4 («без владения») по этому рынку **не проходит** — экономика вторичного рынка трансформаторов лежит в складе, ремонте и гарантии.

---

## 9. Что могло бы спасти гипотезу (для честности)

1. **Не сделка, а страховка/гарантия.** Единственная сторона, которая реально платит за «остаточный ресурс», — тот, кто несёт хвостовой риск: дилер, дающий 3–5-летнюю гарантию, и страховщик. Продукт «underwriting-модель для гарантии дилера/страховщика на б/у» — B2B-софт для 10–20 клиентов (Maddox, Sunbelt Solomon, HSB, FM). Но HSB уже сам лаборатория; дилеры имеют in-house.
2. **Rental-парк** (T&R, Sunbelt, Transformer Exchange уже сдают в аренду) — оценка ресурса нужна для ценообразования аренды. Опять же — внутренняя функция арендодателя.
3. **Рынки вне EO:** Африка/ЛатАм/Индия — есть б/у, нет денег на «ИИ-оценку»; Европа — есть деньги, но UK-дилеры дают гарантию сами.
4. **Данные партнёра** переносимы плохо и токсичны для комплаенса — гипотезу стоит строить без них, а значит без рва.

## 10. Пробелы («не нашёл»)
- Размер вторичного рынка трансформаторов в $ и доля б/у в поставках — нет.
- Публичные прайсы DGA / condition assessment — нет.
- Требования страховщиков/кредиторов к оценке б/у трансформаторов — нет.
- Раунды/выручка Maddox, ELSCO, Jordan — нет (частные).
- Принимают ли гиперскейлеры реконд — прямо не нашёл; Maddox называет ДЦ-клиента DC BLOX (2×2500 kVA), т.е. колокейшн среднего размера, не hyperscale.
- Европейские реконд-дилеры «Cofely/TRAFO» — не нашёл.
