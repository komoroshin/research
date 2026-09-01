# IC11-2 — Конкурентная карта: независимый поставщик риск-моделей для страхования энергоактивов (BESS / ВИЭ / сети)

Дата исследования: 01.09.2026. Метод: веб-поиск + чтение первоисточников (пресс-релизы, отраслевые СМИ). Каждое число — с источником. Пометки: **[не нашёл]** — искал, не нашёл; **допущение** — вывод без прямого подтверждения.
Ограничение: лимит веб-поиска сессии исчерпан на последнем блоке (не проверены: объёмы раундов ACCURE/TWAICE, детали Munich Re GTS, YC/a16z BESS-risk стартапы 2025–2026). Эти пункты помечены явно.

---

## 0. ВЕРДИКТ

**Утверждение «позиция не занята: нет вендора с референсами у синдикатов/MGA» — ОПРОВЕРГНУТО в части ВИЭ (offshore wind, US solar) и ЧАСТИЧНО ОПРОВЕРГНУТО в части BESS.**

1. **Renew Risk (Лондон, осн. 2021)** — ровно та позиция, которую гипотеза объявляет свободной: независимый SaaS-вендор cat-моделей для ВИЭ, без своего MGA. Референсы: **GCube (MGA Tokio Marine HCC)** — принял модели в ноябре 2023; **Aviva** — совместная разработка Interconnector Risk Module и валидация windstorm-моделей; **Convex** (Lloyd's/Bermuda carrier) и **McGill & Partners** (брокер) — live на платформе Nasdaq/Verisk; **Lloyd's сам — инвестор** (£5m Series A, 13.02.2025, лид Molten Ventures). Май 2026 — запуск US SCS (град/торнадо/ветер) модели для солнечных станций. **BESS-модели у Renew Risk нет** (проверено по странице новостей — ни одного упоминания).
2. **По BESS «расчётного ядра для страховщиков» как отдельного вендора действительно нет — но нишу быстро закрывают battery-analytics компании, у которых уже есть данные с BMS:** ACCURE ↔ **Aviva** (2-летний пилот, встраивание предиктивной аналитики в risk framework Aviva, 05.08.2026), ACCURE ↔ Protect Solar (брокер, апр. 2026), ACCURE ↔ Gore Street (улучшенные условия страхования UK-сайтов), TWAICE ↔ **NARDAC** (MGA/брокер, 12.06.2024), TWAICE ↔ **Munich Re / Great Lakes** (гарантия точности аналитики и warranty-insurance, дек. 2022), **Elysia (Fortescue)** — прошла Lloyd's Lab Cohort 16 (апр.–июль 2026) именно с темой «battery intelligence for underwriting». То есть на BESS данные-первичка (телеметрия батарей) уже в руках инженерных софт-вендоров, а не «моделлеров», и страховщики выбирают их.
3. **Категория живая, но паттерн выхода — поглощение носителем капитала/данных, а не самостоятельный рост:** kWh Analytics → Beazley (10.03.2026, сумма не раскрыта; сам Beazley → Zurich за $10.9 млрд), Fathom → Swiss Re (дек. 2023), Praedicat → Moody's (сент. 2024), Sust Global → ISS STOXX (04.08.2025), Four Twenty Seven → Moody's (2019), The Climate Service → S&P (дек. 2021), KatRisk → Technosylva (19.11.2024), сама платформа Nasdaq Risk Modelling (хостинг Renew Risk) → Verisk (02.04.2025). Смерти: Cervest (администрация, июнь 2023, ~100 сотрудников без зарплаты), ClimateAi (свернулась, авг. 2025, $38m поднято).
4. **Что реально свободно (узко):** (а) BESS **cat/loss-модель для андеррайтера** (thermal-runaway PML, каскад «батарея→трансформатор→BI»), не привязанная к конкретному BMS-вендору — у Renew Risk её нет, у ACCURE/TWAICE это побочная функция мониторинга; (б) **сети/grid** — ни одного специализированного вендора не нашёл **[не нашёл]**; (в) Европа/Азия BESS — все найденные референсы либо UK, либо US.

Скептический итог: «белого пятна» размером с категорию нет. Есть щель шириной в один продукт (BESS loss-модель для синдикатов), и в неё уже заходят игроки с данными (ACCURE/TWAICE/Elysia) и с дистрибуцией (kWh внутри Beazley/Zurich, GCube с Renew Risk). Окно — 12–24 месяца, **допущение**.

---

## 1. Карта игроков «insurtech × energy/climate risk» 2022–2026

### 1.1. Специализированные по энергоактивам

| Игрок | Роль | Ключевые факты (число — источник) | Статус 09/2026 |
|---|---|---|---|
| **kWh Analytics** (SF) | MGA + база данных (Solar Revenue Put, property, BESS) | Всего поднято $32.51m за 10 раундов (Crunchbase, https://www.crunchbase.com/organization/kwh-analytics). >$50 млрд застрахованных активов, 11 (пере)страховщиков-партнёров, лимит до $100m на локацию (BusinessWire, 05.02.2026, https://www.businesswire.com/news/home/20260205549163/en/). Solar Revenue Put применён к >$4 млрд солнечных активов (kWh two-pager, https://assets.kwhanalytics.com/documents/public/solar-revenue-put/Solar_Revenue_Put_Two_Pager.pdf). Excess Nat Cat слой до $20m (Solar Power World, авг. 2025, https://www.solarpowerworldonline.com/2025/08/kwh-analytics-adds-excess-natural-catastrophe-coverage-to-solar-insurance-offerings/). | **Куплена Beazley**, объявлено 10.03.2026, сумма не раскрыта; интеграция в MAP Risks, CEO Kaminsky → Tim Turner (Beazley PR, https://www.beazley.com/en-US/news-and-events/acquisition-of-kwh-analytics/; Insurance Journal, https://www.insurancejournal.com/news/national/2026/03/10/861264.htm). GWP/выручка **[не нашёл]**. |
| **Renew Risk** (Лондон, 2021) | Независимый SaaS cat-моделлер для ВИЭ (offshore wind, US solar) | Seed £1.7m; Series A £5m, лид Molten Ventures, участие **Lloyd's**, Insurtech Gateway, ангелы — 13.02.2025 (Tech.eu, https://tech.eu/2025/02/13/renew-risk-secures-ps5m-for-renewable-energy-risk-modelling/; Renew Risk, https://www.renew-risk.com/resources/renew-risk-secures-5-million-investment). Ранее $4.7m seed при оценке $16m (по цитате в Renewable Energy Magazine, https://www.renewableenergymagazine.com/wind/renew-risk-s-offshore-wind-insurance-model-20231101). Клиенты: GCube (1.11.2023, Nasdaq PR https://www.nasdaq.com/press-release/renew-risks-offshore-wind-insurance-model-to-be-adopted-by-gcube-and-integrated-with), Aviva (валидация UK/EU windstorm моделей, CIR Magazine апр. 2026 https://www.cirmagazine.com/cir/c2026040903.php), Convex и McGill & Partners live на Nasdaq NRMC (Nasdaq, https://www.nasdaq.com/articles/fintech/nasdaq-rolls-out-renew-risk-catastrophe-models-offshore-wind-farms). Продукты: UK/EU windstorm, Japan/Taiwan typhoon+EQ для offshore wind, Interconnector Risk Module (с Aviva), US SCS Model для solar (май 2026, с Vāyuh; pv magazine USA https://pv-magazine-usa.com/2026/05/06/renew-risk-launches-storm-catastrophe-model-for-u-s-solar-projects/). **BESS: нет** (https://www.renew-risk.com/news). | Независимая, растёт. **Прямой прецедент, опровергающий гипотезу.** |
| **Sunereum Labs** (Delaware, 2024) | AI-платформа страхования/перестрахования solar 100 kW–20 MW, параметрика + smart-contract claims | Lloyd's Lab Cohort 15 (объявлено 11.09.2025, https://www.lloyds.com/insights/news/cohort-15-announcement). Раунды **[не нашёл]**. | Ранняя стадия; модель «платформа-страховщик», не чистый вендор. |
| **New Energy Risk** (Paragon Insurance Holdings) | Technology performance insurance для FOAK-технологий, Battery Revenue/Dispatch Insurance (5-летний revenue floor), с 2013 г. поддержала >$4.2 млрд clean capital | https://newenergyrisk.com/solutions/ ; https://paragoninsgroup.com/our-brands/new-energy-risk/ ; сделка с Ascend Analytics — страхование результата forecasting/bidding платформы BESS (Reinsurance News tag, https://www.reinsurancene.ws/tag/new-energy-risk/). | Инсорсинг: собственная научная команда, внешние модели **[не нашёл]**. |
| **GCube** (Tokio Marine HCC, куплен 2020) | MGA ВИЭ, 40 стран, property+liability | Купил внешние модели Renew Risk (2023). Собственная глобальная claims database, отчёты «Known Unknowns» (апр. 2025, https://www.renewableenergymagazine.com/panorama/extreme-weather-now-a-global-threat-to-20250414) и «Batteries Not Excluded» (BESS до 30% портфеля; >50% отказов BESS — в первые 2 года, https://www.tdworld.com/distributed-energy-resources/energy-storage/article/21283205/). | Покупает внешние cat-модели — да. |
| **NARDAC** | Брокер/MGA энергетики | BESS-андеррайтинг с $50m лимита на локацию от 8 синдикатов Lloyd's (pv magazine PR, https://www.pv-magazine.com/press-releases/nardac-launches-underwriting-services-for-battery-storage-projects/). Партнёр TWAICE (12.06.2024). | Активен. |
| **Altium + MS Amlin** | BESS all-risk через онлайн-платформу | (Amwins/пресс, см. запрос «BESS underwriting platform») | |
| **Amwins** | Wholesale-программа BESS | https://www.amwins.com/products/battery-energy-storage-systems-amwins | |
| **Renewable Guard**, **Protect Solar**, **Solarif** | Брокеры ВИЭ | Protect Solar — партнёр ACCURE (апр. 2026, https://www.accure.net/news/accure-partners-with-protect-solar) | Каналы, не моделлеры. |
| **REsurety** (Boston, 2012) | Weather×power×carbon аналитика для хеджей/VPPA | $32m Series C (окт. 2024, лид S2G + Citi), всего $49m (Dealroom/Crunchbase, https://dealroom.co/companies/resurety/); альянс с S&P Global Energy (окт. 2025). | Независимая, но клиент — оффтейкеры/девелоперы, не синдикаты. |

### 1.2. Battery analytics → страхование (де-факто конкуренты по BESS)

| Игрок | Референсы у страховщиков | Источник |
|---|---|---|
| **ACCURE** (Аахен) | **Aviva** — 2-летний пилот, аналитика встраивается в risk framework Aviva, клиентам Aviva льготный онбординг (05.08.2026, Modern Power Systems https://www.modernpowersystems.com/news/aviva-backs-landmark-energy-storage-pilot-safety-project/); **Protect Solar** (апр. 2026); **Gore Street Capital** — улучшенные условия на UK-сайтах (https://www.accure.net/news/gore-street-capital-leverages-accure-battery-intelligence-software-to-help-secure-enhanced-insurance-conditions-at-uk-energy-storage-sites); продуктовая страница «BESS insurance» (https://www.accure.net/battery-analytics-solutions/bess-insurance). Раунды **[не проверил — лимит поиска]**. |
| **TWAICE** (Мюнхен) | **NARDAC** (12.06.2024, GlobeNewswire https://www.globenewswire.com/news-release/2024/06/12/2897643/0/en/); **Munich Re / Great Lakes Insurance** — гарантия точности аналитики (возмещение 8× стоимости) и warranty-insurance на базе мониторинга TWAICE (дек. 2022, https://www.twaice.com/newsroom/munich-re-partnership). Исследование с EPRI/PNNL: вероятность отказов −97% с 2018 (тот же PR). |
| **Elysia (Fortescue, ex-Williams Advanced Engineering)** | Lloyd's Lab Cohort 16 (апр.–июль 2026): «battery intelligence to improve how battery risk is understood, underwritten and managed» (Lloyd's PR 06.03.2026, https://www.lloyds.com/insights/media-centre/press-releases/lloyds-lab-unveils-cohort-16-following-pitch-day-in-london; insuranceNEWS.com.au https://www.insurancenews.com.au/insurtech/fortescue-s-elysia-enters-lloyd-s-lab). Корпоративный игрок с балансом Fortescue. |
| Sarvada.ai (Индия), repath.earth | Контент-маркетинг по BESS underwriting; продукта-ядра не видно. **[не нашёл референсов]** |

### 1.3. Climate-risk / cat-modelling (общие)

| Игрок | Факты | Статус |
|---|---|---|
| **Moody's RMS** | Куплена Moody's за ~$2.0 млрд, закрыто 15.09.2021; insurance data&analytics Moody's → ~$500m выручки (Insurance Journal, https://www.insurancejournal.com/news/national/2021/09/16/632155.htm). + Praedicat (сент. 2024). | Консолидатор. |
| **Verisk Extreme Event Solutions (ex-AIR)** | Купила Nasdaq Risk Modelling for Catastrophes/Simplitium (объявлено 02.04.2025), 300+ сторонних моделей на Oasis LMF (Verisk PR, https://www.verisk.com/company/newsroom/verisk-acquires-nasdaq-risk-modelling-for-catastrophes-to-further-expand-the-global-extreme-event-risk-assessment-ecosystem/). Отдельных ВИЭ-моделей у Verisk **[не нашёл]** — ВИЭ на платформе закрывает Renew Risk. | Консолидатор + витрина для нишевых вендоров. |
| **CoreLogic → Cotality** | Ребренд 24.03.2025 (Insurance Journal, https://www.insurancejournal.com/news/national/2025/03/24/816859.htm); фокус hail/wildfire для property. | Не энергетика. |
| **Fathom** (Бристоль) | Куплена Swiss Re, дек. 2023, сумма не раскрыта; данные интегрированы в CatNet (Swiss Re PR, https://www.swissre.com/press-release/Swiss-Re-acquires-Fathom-a-leader-in-water-risk-intelligence/4af5e0d7-e065-404a-b80d-6f32955f0fbe). | Поглощена перестраховщиком. |
| **Jupiter Intelligence** | Series C $54m (лид Clearvision, MPower, CDPQ), всего ~$100m (Jupiter PR, https://www.jupiterintel.com/press-release/jupiter-announces-54-million-in-new-funding); ~82 сотрудника (PitchBook); партнёрства JLL (июль 2025), ERM (февр. 2026). Сокращения **[не нашёл]**. | Независима, фокус — корпораты/недвижимость, не андеррайтинг энергоактивов. |
| **Zesty.ai** | Всего $62.3m + кредитная линия CIBC $15m (25.06.2025, https://techstartups.com/2025/06/25/insurtech-startup-zestyai-raises-15m-to-scale-its-ai-powered-risk-analytics-platform/); 200+ регуляторных одобрений, клиенты Berkshire Hathaway, California FAIR Plan, «$3 трлн TIV» (Nasdaq PR, https://www.nasdaq.com/press-release/zesty.ai-triples-revenue-growth-from-record-number-of-insurer-partnerships). | Независима, property/wildfire, **не энергетика**. |
| **Kettle** | Series A $25m (лид Acrew), Lloyd's Lab alumni (AM Best, https://news.ambest.com/newscontent.aspx?refnum=237953&altsrc=140). | Wildfire-перестрахование (MGA-подобная модель). |
| **Arbol** | Series B $60m (30.04.2024, Giant Ventures, Opera Tech, Mubadala; https://www.arbol.io/post/arbol-raises-60-million-in-series-b-funding-to-scale-parametric-insurance-responding-to-increasing-climate-risk). | Параметрика + свой carrier — не чистый вендор. |
| **Previsico** | Series A закрыт окт. 2025 (Connecticut Innovations, BlueOrchard, Burnt Island; https://previsico.com/en-us/insights/previsico-secures-series-a-funding). | Flood forecasting. |
| **Tomorrow.io** | ~$100m ARR (2026, по Fast Company https://www.fastcompany.com/91503543/tomorrowio-most-innovative-companies-2026), Lloyd's Lab alumni, планы IPO. | Погода, не энергориск. |
| **Reask** (Сидней) | $4m от BlueOrchard InsuResilience (март 2025), всего $10.6m (https://coverager.com/reask-raises-4-million-from-blueorchards-insuresilience-fund/). | Независимый TC-моделлер, малый масштаб. |
| **Understory** | Погодная insurtech; в выдаче доминирует одноимённая датская travel-tech (€12m Series A, сент. 2025) — **по страховой Understory свежих данных [не нашёл]**. | |
| Climate X | $24.9m всего, Series A $18m лид GV (https://www.climate-x.com/articles/press-releases/series-a). | Независима, физриск для банков/недвижимости. |

### 1.4. Специализированные по BESS-страхованию как аналитический вендор
**[не нашёл]** ни одного стартапа с позиционированием «BESS underwriting platform / energy storage risk score» с раскрытыми референсами у синдикатов. Ближайшее: ACCURE/TWAICE/Elysia (см. 1.2) и внутренние данные kWh (внутри Beazley).

---

## 2. Инженерные фирмы как конкуренты

- **DNV**: сертификация/техническая due diligence, «создаёт уверенность у … финансовых и страховых компаний» (https://www.dnv.com/energy/services/renewables-certification/services/; TDD https://www.dnv.com/services/technical-and-commercial-due-diligence-of-renewable-projects-2595/). Отдельного продукта «DNV for insurers / risk score для андеррайтера» **[не нашёл]** — риск-оценка идёт как часть сертификации/IE-отчёта, т.е. **встроенная «фича» к сертификации**, оплачивается девелопером, а не страховщиком. **Допущение:** страховщик получает эти отчёты бесплатно через брокера как часть submission.
- **UL Solutions / TÜV SÜD / Bureau Veritas / Intertek / TÜV Rheinland**: рынок BESS TIC оценён $0.66 млрд (2026) → $1.30 млрд (2032) (Yahoo Finance/ResearchAndMarkets, https://finance.yahoo.com/energy/articles/battery-energy-storage-system-bess-115200592.html). TÜV SÜD прямо пишет, что услуги «поддерживают уверенность регуляторов, инвесторов, кредиторов и страховщиков» (https://www.tuvsud.com/en/industries/manufacturing/battery-energy-storage-system). UL 9540A — де-факто стандарт в США. Это **compliance-продукт**, а не вероятностная loss-модель. Прямой конкуренции по «PML/AAL для синдиката» нет, но они владеют первичкой по испытаниям (thermal runaway).
- **Lloyd's Register**: **[не нашёл]** предложений для страховщиков по BESS/ВИЭ.
- Итог по блоку: инженерные фирмы продают девелоперу, не андеррайтеру; их выход — сертификат/отчёт, не модель. Конкуренция косвенная (они «бесплатно» закрывают вопрос «is it safe?», оставляя андеррайтеру вопрос «what's my loss distribution?»).

---

## 3. MGA/носители с собственной аналитикой — покупают ли внешние модели?

| Игрок | Ядро своё или покупное |
|---|---|
| GCube (TMHCC) | Своё: claims database + отчёты. **Покупное: cat-модели Renew Risk (offshore wind).** Прецедент «MGA покупает модель у независимого вендора» — есть. |
| kWh Analytics | Своё (база 300k+ проектов, «$100B loss data» — Crunchbase). Теперь внутри Beazley → Zurich. Внешних моделей **[не нашёл]**. |
| New Energy Risk (Paragon) | Своё (в т.ч. страхует результаты чужой аналитики — Ascend Analytics). |
| Munich Re Green Tech Solutions | Своё: первый в мире продукт «battery performance insurance» (07.03.2019, https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/media-information/2019/2019-03-07-media-information.html); гарантии на 10–20 лет; Munich Re Specialty «Green Solutions» портфель. Мониторинг — **внешний (TWAICE)** для warranty-insurance. Объёмы премий **[не проверил — лимит]**. |
| Swiss Re | Centre of Competence for Renewable Energy (Reinsurance News, https://www.reinsurancene.ws/swiss-re-launches-new-centre-of-competence-for-renewable-energy/); flood — купили Fathom целиком. Паттерн: не лицензируют, а покупают. |
| Aviva | Покупает: валидирует Renew Risk, пилотирует ACCURE (2026). Самый «открытый» к внешним моделям носитель среди найденных. |
| Ascot | Линия Renewable Energy есть (https://www.ascotgroup.com/insurance/); аналитика **[не нашёл]**. |
| Брокеры (Marsh, Aon, WTW, Gallagher) | Marsh — «proprietary modeling tools» для BESS (https://www.marsh.com/en/industries/energy-and-power/expertise/battery-energy-storage-systems.html); Aon — прогноз BESS GWP >$1 млрд к 2027 и energy-transition premiums >$9 млрд к 2030 (Global Reinsurance, https://www.globalreinsurance.com/home/aon-forecasts-energy-transition-premiums-to-top-9bn-by-2030-as-it-launches-insurer-framework/1456953.article). Брокеры — и канал, и конкурент (in-house аналитика как бесплатный сервис клиенту). |

---

## 4. Некролог 2020–2026 (кто умер / продан дёшево / поглощён)

| Компания | Исход | Дата | Покупатель/причина | Источник |
|---|---|---|---|---|
| Cervest (Лондон) | Администрация, ~100 сотрудников без зарплаты с апреля | июнь 2023 | Сорвавшийся раунд; обещания фаундера не подтвердились | Proactive Investors, https://www.proactiveinvestors.co.uk/companies/news/1019362/ |
| ClimateAi (SF) | Свернулась, $38m поднято | авг. 2025 | «geopolitical and climate headwinds» | AgFunderNews, https://agfundernews.com/climate-resilience-platform-climateai-winds-down-operations |
| Four Twenty Seven | Мажоритарная доля → Moody's | июль 2019 | Рейтинговое агентство | Moody's IR, https://ir.moodys.com/press-releases/news-details/2019/Moodys-Acquires-Majority-Stake-in-Four-Twenty-Seven-Inc-a-Leader-in-Climate-Data-and-Risk-Analysis/default.aspx |
| The Climate Service | → S&P Global, «не материально» для S&P | дек. 2021 / объявл. 04.01.2022 | Рейтинговое агентство | S&P PR, https://press.spglobal.com/2022-01-04-S-P-Global-Acquires-The-Climate-Service,-Inc |
| RMS | → Moody's, ~$2.0 млрд | сент. 2021 | Рейтинговое агентство | Insurance Journal, https://www.insurancejournal.com/news/national/2021/09/16/632155.htm |
| Fathom | → Swiss Re | дек. 2023 | Перестраховщик | см. выше |
| Praedicat | → Moody's, «не материально», поднято $18m | сент. 2024 | Рейтинговое агентство | Insurance Journal, https://www.insurancejournal.com/news/national/2024/09/05/791534.htm |
| KatRisk | → Technosylva | 19.11.2024 | Wildfire-софт (данные) | Tracxn, https://tracxn.com/d/companies/katrisk/ |
| Sust Global | → ISS STOXX, поднято $4.71m | 04.08.2025 | Данные/ESG-провайдер | ESG Today, https://www.esgtoday.com/iss-stoxx-acquires-geospatial-ai-powered-climate-risk-data-provider-sust-global/ |
| Nasdaq Risk Modelling (Simplitium) | → Verisk | 02.04.2025 | Данные/аналитика | Verisk PR |
| kWh Analytics | → Beazley (→ Zurich) | 10.03.2026 | Страховщик | Beazley PR |
| One Concern | Жива, но последний раунд — Series B июнь 2021, всего $117m | — | **допущение**: стагнация | Tracxn, https://tracxn.com/d/companies/oneconcern/ |
| Jupiter Intelligence | Жива, Series C $54m; сокращений **[не нашёл]** | — | — | Jupiter PR |

**Паттерн выхода:** покупатели — (1) рейтинговые агентства/данные (Moody's ×3, S&P, ISS STOXX, Verisk), (2) перестраховщики/страховщики (Swiss Re, Beazley), (3) смежный софт (Technosylva). Суммы почти всегда «не раскрыто»/«не материально» — т.е. small-cap выходы, кроме RMS ($2 млрд — 30-летняя компания). Никто из независимых climate-стартапов 2017+ не вышел дороже сотен миллионов **[подтверждающих сделок не нашёл]**.

---

## 5. Рынок после Moss Landing (16.01.2025)

- Пожар уничтожил бОльшую часть 300 MW массива на 750 MW объекте Vistra; Marsh McLennan оценивал insured losses до **$180m** (TurfMagazine/агрегатор, https://turfmagazine.com/moss-landing-battery-fire-analysis-2025 — вторичный источник, **допущение** по точности).
- Отраслевая оценка (kWh Analytics + Renewable Guard + Brown & Brown, 05.06.2025): рынок «стабилен», ставки за technology risk **30–40 центов на $100 TIV**, андеррайтеры избегают indoor/NMC; «AI и предиктивная аналитика — golden egg для безопасности BESS» (Energy-Storage.News, https://www.energy-storage.news/beyond-the-headlines-the-bess-insurance-market-after-moss-landing/).
- Март 2026: страховщики «pricing 2026 BESS renewals using historical data from a period when these assets barely existed»; фокус смещается на трансформаторы и ошибки подрядчиков (pv magazine, 20.03.2026, https://www.pv-magazine.com/2026/03/20/why-bess-insurers-are-sweating-transformers-and-contractor-errors-over-battery-fires/). → Подтверждает **дефицит loss-модели**, но не подтверждает, что кто-то её продаёт.
- **Новые BESS-risk стартапы 2025–2026 (YC/a16z/insurtech-фонды):** **[не нашёл]** ни одного объявленного seed-раунда с позиционированием «BESS risk for insurers». Проверка YC/a16z не выполнена (лимит поиска) — **открытый пункт**.
- **Lloyd's Lab:** Cohort 15 (сент.–дек. 2025) — Sunereum Labs (solar insurance platform), Pinepeak (wildfire); Cohort 16 (апр.–июль 2026) — **Elysia/Fortescue (battery intelligence для underwriting)**, Plain Site, Plastic-i, Resilico (flood). Тематического тендера «energy storage risk» **[не нашёл]**; Cohort 16 — ирландская тема (flood, cyber, AI, export finance). Lloyd's как инвестор зашёл в Renew Risk (2025). Alumni Lloyd's Lab: $200m премий через alumni-coverholders, 85% сохраняют коммерческие связи с рынком (Lloyd's, https://www.lloyds.com/insights/lloyds-lab/lloyds-lab-accelerator/cohorts).

---

## 6. Модель выживания: кто вырос независимым без MGA и без продажи?

- **В climate/energy risk — крупных примеров нет.** Все, кто дорос до заметной выручки, либо проданы (RMS, Fathom, Praedicat, kWh), либо стали носителями риска (Arbol, Kettle, kWh — MGA), либо ушли в смежные рынки (Zesty.ai — property; Tomorrow.io — погода, ~$100m ARR; REsurety — VPPA-маркетплейс).
- **Долгоживущие независимые cat-моделлеры (не VC-модель):** Karen Clark & Co (с 2007, RiskInsight, https://www.karenclarkandco.com/), JBA Risk Management (flood, глобальные клиенты, https://oasislmf.org/community/model-providers) — прибыльные бутики без раундов, растут медленно, живут на лицензиях синдикатам и Oasis/NRMC-дистрибуции. **Допущение:** это и есть реалистичный «потолок» для независимого вендора без capital-play — десятки миллионов $ выручки за 10–15 лет, не венчурная траектория.
- **Renew Risk** — единственный VC-backed независимый вендор именно в энергоактивах; 4 года, £6.7m поднято, клиенты — 1 MGA + 1 carrier + 1 Lloyd's carrier + 1 брокер + Lloyd's-инвестор. Пока не масштаб, но жива и не продана.
- **Вывод по модели:** независимый вендор выживает, когда (а) сидит на дистрибуционной платформе (Oasis/NRMC→Verisk), (б) имеет стратегического инвестора с рынка (Lloyd's, InsuResilience/BlueOrchard — Reask, Previsico), (в) держит capex низким. Exit — почти всегда стратегу за нераскрытую сумму.

---

## 7. Что осталось непроверенным (лимит поиска)
1. Объёмы раундов ACCURE и TWAICE (для оценки их ресурса на страховой продукт).
2. Munich Re GTS: объём премий/GWp под гарантиями.
3. YC/a16z/insurtech-фонды: BESS-risk стартапы 2025–2026 (нужен отдельный прогон по YC directory и Crunchbase с фильтром «battery storage insurance»).
4. Lloyd's Register и Bureau Veritas — есть ли платные insurer-facing BESS-сервисы.
5. Sunereum Labs — раунды, первые полисы.
6. Сети/grid — ни одного вендора не найдено, но и целевой поиск «grid asset risk model insurers» не делался.

## 8. Полный список источников (URL)
- https://www.crunchbase.com/organization/kwh-analytics
- https://www.beazley.com/en-US/news-and-events/acquisition-of-kwh-analytics/
- https://www.insurancejournal.com/news/national/2026/03/10/861264.htm
- https://www.businesswire.com/news/home/20260205549163/en/
- https://assets.kwhanalytics.com/documents/public/solar-revenue-put/Solar_Revenue_Put_Two_Pager.pdf
- https://www.renew-risk.com/news ; https://www.renew-risk.com/resources/renew-risk-secures-5-million-investment
- https://tech.eu/2025/02/13/renew-risk-secures-ps5m-for-renewable-energy-risk-modelling/
- https://www.nasdaq.com/press-release/renew-risks-offshore-wind-insurance-model-to-be-adopted-by-gcube-and-integrated-with
- https://www.nasdaq.com/articles/fintech/nasdaq-rolls-out-renew-risk-catastrophe-models-offshore-wind-farms
- https://www.cirmagazine.com/cir/c2026040903.php
- https://pv-magazine-usa.com/2026/05/06/renew-risk-launches-storm-catastrophe-model-for-u-s-solar-projects/
- https://www.lloyds.com/insights/news/cohort-15-announcement
- https://www.lloyds.com/insights/media-centre/press-releases/lloyds-lab-unveils-cohort-16-following-pitch-day-in-london
- https://www.insurancenews.com.au/insurtech/fortescue-s-elysia-enters-lloyd-s-lab
- https://www.modernpowersystems.com/news/aviva-backs-landmark-energy-storage-pilot-safety-project/
- https://www.accure.net/news/accure-partners-with-protect-solar
- https://www.globenewswire.com/news-release/2024/06/12/2897643/0/en/
- https://www.twaice.com/newsroom/munich-re-partnership
- https://www.energy-storage.news/beyond-the-headlines-the-bess-insurance-market-after-moss-landing/
- https://www.pv-magazine.com/2026/03/20/why-bess-insurers-are-sweating-transformers-and-contractor-errors-over-battery-fires/
- https://www.pv-magazine.com/press-releases/nardac-launches-underwriting-services-for-battery-storage-projects/
- https://www.swissre.com/press-release/Swiss-Re-acquires-Fathom-a-leader-in-water-risk-intelligence/4af5e0d7-e065-404a-b80d-6f32955f0fbe
- https://www.insurancejournal.com/news/national/2021/09/16/632155.htm
- https://www.insurancejournal.com/news/national/2024/09/05/791534.htm
- https://www.verisk.com/company/newsroom/verisk-acquires-nasdaq-risk-modelling-for-catastrophes-to-further-expand-the-global-extreme-event-risk-assessment-ecosystem/
- https://www.esgtoday.com/iss-stoxx-acquires-geospatial-ai-powered-climate-risk-data-provider-sust-global/
- https://ir.moodys.com/press-releases/news-details/2019/Moodys-Acquires-Majority-Stake-in-Four-Twenty-Seven-Inc-a-Leader-in-Climate-Data-and-Risk-Analysis/default.aspx
- https://press.spglobal.com/2022-01-04-S-P-Global-Acquires-The-Climate-Service,-Inc
- https://www.proactiveinvestors.co.uk/companies/news/1019362/
- https://agfundernews.com/climate-resilience-platform-climateai-winds-down-operations
- https://tracxn.com/d/companies/katrisk/ ; https://tracxn.com/d/companies/oneconcern/
- https://www.jupiterintel.com/press-release/jupiter-announces-54-million-in-new-funding
- https://techstartups.com/2025/06/25/insurtech-startup-zestyai-raises-15m-to-scale-its-ai-powered-risk-analytics-platform/
- https://www.nasdaq.com/press-release/zesty.ai-triples-revenue-growth-from-record-number-of-insurer-partnerships
- https://news.ambest.com/newscontent.aspx?refnum=237953&altsrc=140
- https://www.arbol.io/post/arbol-raises-60-million-in-series-b-funding-to-scale-parametric-insurance-responding-to-increasing-climate-risk
- https://previsico.com/en-us/insights/previsico-secures-series-a-funding
- https://www.fastcompany.com/91503543/tomorrowio-most-innovative-companies-2026
- https://coverager.com/reask-raises-4-million-from-blueorchards-insuresilience-fund/
- https://dealroom.co/companies/resurety/
- https://www.climate-x.com/articles/press-releases/series-a
- https://www.dnv.com/energy/services/renewables-certification/services/
- https://www.tuvsud.com/en/industries/manufacturing/battery-energy-storage-system
- https://finance.yahoo.com/energy/articles/battery-energy-storage-system-bess-115200592.html
- https://www.munichre.com/en/company/media-relations/media-information-and-corporate-news/media-information/2019/2019-03-07-media-information.html
- https://www.reinsurancene.ws/swiss-re-launches-new-centre-of-competence-for-renewable-energy/
- https://www.marsh.com/en/industries/energy-and-power/expertise/battery-energy-storage-systems.html
- https://www.globalreinsurance.com/home/aon-forecasts-energy-transition-premiums-to-top-9bn-by-2030-as-it-launches-insurer-framework/1456953.article
- https://www.tdworld.com/distributed-energy-resources/energy-storage/article/21283205/
- https://www.renewableenergymagazine.com/panorama/extreme-weather-now-a-global-threat-to-20250414
- https://newenergyrisk.com/solutions/ ; https://paragoninsgroup.com/our-brands/new-energy-risk/
- https://www.karenclarkandco.com/ ; https://oasislmf.org/community/model-providers
