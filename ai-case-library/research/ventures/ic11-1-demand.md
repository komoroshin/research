# IC11-1 · Спрос страховщиков энергоактивов на внешние модели риска — проверка «на опровержение»

Дата исследования: 01.09.2026. Метод: веб-поиск (≈45 запросов) + первичные источники (пресс-релизы, отчёты брокеров, регуляторные документы Lloyd's, документ Citizens Florida). Все числа — с источником и датой. «Не нашёл» помечено явно. Допущения — словом «допущение».

---

## 0. Вердикт

**Утверждение «страховщики энергоактивов покупают внешние модели риска у независимых вендоров — есть контракты, цены и растущий спрос» — подтверждается лишь частично и в узком сегменте; в широком смысле опровергается.**

Что подтверждается:
- Есть 1 (один) независимый вендор с публично подтверждёнными страховыми клиентами именно по энергоактивам — **Renew Risk** (cat-модели для офшорного ветра и SCS/град для солнца): клиенты GCube (2023), Convex и McGill and Partners (2024, через платформу Nasdaq), Aviva как со-разработчик модуля по интерконнекторам; раунд £5M с участием Lloyd's (фев. 2025).
- Инкумбенты фиксируют рост спроса: Moody's RMS («рост спроса на квантификацию cat-риска для ВИЭ за последние два года», 2022), Verisk добавил 70+ функций уязвимости для солнца в SCS-модель (2025), Moody's RMS выпустил SCS HD с ВИЭ-экспозицией (дек. 2025).
- Данные мониторинга BESS (ACCURE) реально признаются андеррайтерами (HDI 2024, Aviva 2026) — но **платит владелец актива, не страховщик**.

Что опровергается:
- **Цен нет.** Ни одного публичного прайса/тендера на модель по ВИЭ/BESS не найдено. Единственный якорь — контракт Citizens Florida с AIR (Verisk) на ураганную модель: **$539 299/год** (2021), и это гигантский монополист-страховщик, а не синдикат по ВИЭ.
- **«Растущий спрос из-за ужесточения» не подтверждается рынком.** Рынок ВИЭ/BESS в 2025–2026 **смягчается**, а не ужесточается: WTW (июль 2025) — «двузначные экономии на продлениях, пятилетний минимум ставок по новым проектам, переизбыток ёмкости»; NARDAC (дек. 2025) — «премии по BESS продолжат смягчаться»; Lockton (март 2025) — «Moss Landing — не market-moving event». Capacity crunch по BESS/ВИЭ в 2025–2026 не найден.
- **MGA с данными строят свои модели и не продают их.** kWh Analytics, Understory, Descartes, Sunereum — модель = их ров, они продают полис, а не модель.
- **Коммодитизация сверху идёт полным ходом:** Swiss Re CatNet (слой града, июль 2026 — интеграция с SAS для скоринга в андеррайтинге), Munich Re Location Risk Intelligence (SaaS/API), Gallagher Re — собственная вероятностная модель града, Aon Impact Forecasting, Verisk + S&P Global Energy (совместный продукт по климатриску энергоактивов).
- **Оценки BESS (UL 9540A, NFPA 855 HMA, loss-control) заказывает и оплачивает владелец/EPC**, страховщик лишь требует документы. Это не рынок «страховщик платит вендору».

**Практический вывод:** платящий клиент за «расчётное ядро» по энергоактивам сегодня — это чаще **владелец актива/девелопер/финансирующий банк** (чтобы получить лучшие условия), либо **брокер/перестраховщик**, а не первичный андеррайтер. Прямые продажи Lloyd's-синдикатам — нишевые, длинные (валидация), низкомаржинальные из-за бесплатной аналитики брокеров и перестраховщиков.

---

## 1. Как устроен андеррайтинг энергоактивов сегодня

### 1.1 Кто держит ёмкость
- Ёмкость по литий-ионным BESS сконцентрирована в небольшой панели специалистов: GCube (Tokio Marine HCC), Munich Re, Swiss Re Corporate Solutions, HDI Global, Allianz, Liberty Specialty Markets, Markel, Tokio Marine Kiln. — Apex Insurance Brokers Wiki, «Lithium-ion BESS insurance», б/д (2025), https://apexinsurancebrokers.co.uk/wiki/lithium-ion-bess-insurance/
- GCube (теперь Tokio Marine GX) — консорциум из 6 синдикатов Lloyd's с ёмкостью до **$100M на проект** для BESS (фев. 2024). — reNews, https://renews.biz/94532/gcube-launches-100m-bess-insurance-consortium/ ; Global Reinsurance, https://www.globalreinsurance.com/home/gcube-backs-energy-storage-with-new-100m-lloyds-consortium/1452478.article
- Tokio Marine GX «застраховал 8 GW BESS» (июнь 2026). — The Insurer, https://www.theinsurer.com/sustainable-insurance/news/tmgx-tailored-policy-wordings-needed-for-combined-renewable-and-bess-projects-2026-06-02/
- Lockton «BESS Lock»: full-follow facility до **£250M** (~1 GWh проекта), март 2025. — Energy-Storage.News, https://www.energy-storage.news/moss-landing-is-not-a-market-moving-event-for-bess-insurance/

### 1.2 Чем оценивают риск (что нашёл)
| Инструмент | Кто | Источник/дата |
|---|---|---|
| Внутренние данные + внешняя аналитика операционных данных | GCube × Clir: «Smart Renewable Energy Insurance, powered by Clir Risk» — данные >200 GW ветра/солнца, для более точных котировок и лучших условий | Clir/GCube, https://www.clir.eco/news/gcube-unveils-smart-renewable-energy-insurance-powered-by-clir ; Windpower Engineering, https://www.windpowerengineering.com/gcube-launches-new-ai-led-renewable-energy-asset-insurance-offering-with-clir/ (2023, допущение по году — дата на страницах не выведена) |
| Внешняя cat-модель офшорного ветра | GCube × Renew Risk (1 нояб. 2023); Convex и McGill and Partners — live на платформе Nasdaq (2024) | https://www.renew-risk.com/resources/renew-risks-offshore-wind-insurance-model-to-be-adopted-by-gcube ; https://www.nasdaq.com/press-release/renew-risks-offshore-wind-insurance-model-to-be-adopted-by-gcube-and-integrated-with |
| Cat-модели инкумбентов | Verisk SCS: «более 70 новых функций уязвимости для крышной и utility-scale солнечной генерации» (2025 model releases); Moody's RMS North America SCS HD (10 дек. 2025) — «расширение на specialty-экспозиции, включая ВИЭ, крышные панели как secondary modifier» | Verisk, https://www.verisk.com/blog/rethinking-frequency-perils-verisk-updates-severe-thunderstorm-model/ ; Moody's, https://www.moodys.com/web/en/us/insights/insurance/introducing-moodys-rms-north-america-severe-convective-storm-hd-models.html |
| Moody's RMS для ВИЭ — не отдельная модель, а bespoke на базе Industrial Facilities Model (51 peril view, 165 регионов) | 25 янв. 2022 | https://www.moodys.com/web/en/us/insights/insurance/managing-risk-and-catastrophe-modeling-for-the-growing-renewables-sector.html |
| Брокерская аналитика | Gallagher Re — собственная вероятностная модель града (ЮАР, 2 км, 390 000 ячеек); Aon Impact Forecasting (климатические cat-модели; Low-Carbon Transition Framework, нояб. 2025); WTW — «risk modelling по flood/hail/bushfire — теперь минимальное требование» (июль 2025) | https://www.ajg.com/gallagherre/analytics/ ; https://aon.mediaroom.com/news-releases?item=138527 ; https://www.wtwco.com/en-us/insights/2025/07/renewable-energy-market-review-2025 |
| Инженерные отчёты | UL 9540A unit-level — «типично требуется как условие покрытия»; NFPA 855 HMA — «обычно deliverable EPC/owner's engineer»; NARDAC: андеррайтеры требуют «полные data rooms, инженерную документацию, geospatial-mapping CAT-экспозиции, commissioning records» | Apex wiki (выше); Bluerithm, https://bluerithm.com/designing-commissioning-plans-for-bess-that-actually-satisfy-nfpa-855/ ; NARDAC 18 дек. 2025, https://nardac.com/top-infrastructure-renewable-insurance-trends-for-2026-what-to-expect/ |

**Не нашёл:** публичных описаний внутренних актуарных моделей Ascot, Beazley, Aspen, Liberty, Chubb, AXA XL по ВИЭ/BESS; данных, что кто-то из них лицензирует независимую модель по энергоактивам (кроме перечисленных Renew Risk-кейсов). Beazley публично описывает лишь линейку (ветер/солнце/BESS), TMK — найм андеррайтеров.

---

## 2. Прецеденты покупки внешних моделей по энергоактивам

### 2.1 Renew Risk (единственный чистый прецедент «вендор → страховщик»)
- Seed £1.7M; раунд **£5M** (13 фев. 2025), лид Molten Ventures, участие **Lloyd's**, Insurtech Gateway. — Tech.eu, https://tech.eu/2025/02/13/renew-risk-secures-ps5m-for-renewable-energy-risk-modelling/
- Клиенты/партнёры: GCube (нояб. 2023), Convex, McGill and Partners (на Nasdaq RMC), Aviva (со-разработка модуля по интерконнекторам, дата на странице не указана). — https://www.renew-risk.com/news
- Продукты: офшорный ветер UK/EU windstorm (пилот 25 нояб. 2025, продакшн Q2 2026, при поддержке Oasis LMF), Япония/Тайвань (тайфун+землетрясение), US Solar SCS (8 мая 2026, партнёр Vāyuh). — CIR Magazine, https://www.cirmagazine.com/cir/c2026040903.php ; Reinsurance News, https://www.reinsurancene.ws/renew-risk-introduces-us-severe-storm-model-for-solar-insurance-market/
- **Цены/условия лицензий — не раскрыты нигде.** Не нашёл.
- Допущение: «Nasdaq Risk Modelling for Catastrophes» больше не существует как независимая платформа — URL статьи Nasdaq теперь редиректит на Verisk Model Exchange (проверено 01.09.2026, https://www.verisk.com/products/model-exchange/). Т.е. «первая независимая платформа» поглощена инкумбентом — контр-сигнал для тезиса о независимой дистрибуции.

### 2.2 kWh Analytics — MGA, а не вендор моделей
- Лицензированное страховое лицо Solar Energy Insurance Services; база 300 000+ солнечных активов; «trusted by 5 of the top 10 global (re)insurance carriers», «insured over $40B». — https://kwhanalytics.com/ ; VDE, https://www.vde.com/en/vde-americas/newsroom/prepare-for-hail-season (17 апр. 2025)
- Модель используется для собственных продуктов (Solar Revenue Put, property), а не продаётся. Пилот «hail-ready → ниже премия» (апр. 2026). — pv magazine USA, https://pv-magazine-usa.com/2026/04/07/new-pilot-program-from-kwh-analytics-will-reward-hail-ready-solar-projects-with-lower-insurance-costs/
- Совместно с VDE Americas выпустили **бесплатную** форму оценки hail stow для андеррайтеров/финансистов (17 апр. 2025) — индустриальный стандарт, не платный продукт. — Solar Power World, https://www.solarpowerworldonline.com/2025/04/new-tool-aims-to-help-insurance-underwriters-monitor-solar-tracker-hail-risk/
- **Не нашёл** свидетельств, что kWh лицензирует данные/модели другим страховщикам.

### 2.3 Understory — MGA
- Series A **$15M** (июнь 2024, True Ventures, Prelude), рост 500% г/г, запуск продукта для ВИЭ; полный стек MGA/MGU с собственным сенсором Dot. — PR Newswire, https://www.prnewswire.com/news-releases/climate-risk-solving-insurance-provider-understory-secures-15-million-series-a-funding-302164916.html
- Продают полис, не модель. Обновлений 2025–2026 по ВИЭ **не нашёл**.

### 2.4 ACCURE Battery Intelligence — «данные владельца, признанные страховщиком»
- Gore Street Capital × HDI Global (через PIB): «enhanced insurance conditions» для Stony 80 MW и Ferrymuir 50 MW, 23 апр. 2024; числа условий не раскрыты. — https://www.accure.net/news/gore-street-capital-leverages-accure-battery-intelligence-software-to-help-secure-enhanced-insurance-conditions-at-uk-energy-storage-sites
- Aviva × ACCURE: двухлетний пилот, «preferential insurance conditions» для операторов с мониторингом; **платит оператор** (Aviva даёт клиентам льготный onboarding fee у ACCURE), 5 авг. 2026. — Modern Power Systems, https://www.modernpowersystems.com/news/aviva-backs-landmark-energy-storage-pilot-safety-project/
- MEAG (Munich Re) — ACCURE для своего 231 MWh BESS (как инвестор). — https://www.accure.net/
- Вывод: модель монетизации — B2B с владельцем, страховщик получает данные бесплатно как условие лучших терминов.

### 2.5 Arbol
- GWP $250M (2023), Series B $60M (2024), Lloyd's coverholder; продаёт параметрические полисы, а не модели. — PR Newswire, https://www.prnewswire.com/news-releases/arbol-raises-60-million-in-series-b-funding-to-scale-parametric-insurance-responding-to-increasing-climate-risk-302131746.html ; InsTech, https://www.instech.co/knowledge-centre/arbol-enabling-climate-risk-transfer-in-renewables-and-reinsurance/

### 2.6 Intertek CEA (Clean Energy Associates)
- Клиенты — финансовые институты, девелоперы, EPC, IPP, владельцы; куплена Intertek (2022), ребренд Intertek CEA (окт. 2025). **Партнёрств со страховщиками не нашёл.** — Solar Power World, https://www.solarpowerworldonline.com/2025/10/clean-energy-associates-rebrands-as-intertek-cea/

### 2.7 VDE Americas (Hail Risk Atlas), Vaisala Xweather
- VDE: отчёты/карты града для «девелоперов, страховщиков и инвесторов»; заявление «должны получать insurance credits» — без чисел. — https://www.vde.com/en/vde-americas/newsroom/vde-hail-risk-atlas-press-release
- Vaisala: 55% стоимости погодных убытков солнца в США/Канаде — град; средний hail-claim **$58M**; продукт — прогнозы за 60 мин для операторов (сент. 2025). — https://www.vaisala.com/en/press-releases/2025-09/solar-industry-faces-billion-dollar-problem-vaisala-xweather-first-launch-advanced-hail-forecasts
- Покупатель — оператор, не страховщик.

### 2.8 Sunereum Labs (Lloyd's Lab Cohort 15)
- Основана 2024; «AI-платформа страхования/перестрахования энергоинфраструктуры» для проектов 100 kW–20 MW; инвестиции Lloyd's Lab и InsurTech NY. Снова MGA-модель. — https://www.lloyds.com/insights/news/cohort-15-announcement ; https://sunereum.com/

### 2.9 Sinai / «Elemental» / wildfire-модели для ВИЭ
- **Не нашёл** ничего релевантного по «Sinai» и «Elemental» в контексте страхования энергоактивов. Единственный wildfire-факт: kWh Analytics 2026 — лишь 4% PV-пожаров происходят в зонах высокого wildfire-риска, 84% — «equipment-driven brushfires» внутри станции. — BusinessWire 12 мая 2026, https://www.businesswire.com/news/home/20260512932725/en/

---

## 3. BESS после Moss Landing (янв. 2025)

### 3.1 Премии и ёмкость
- Ставки по BESS: **~30–40 центов на $100 страховой суммы** (technology risk), «стабильный прогноз рынка», 9 июня 2025. — kWh Analytics, https://kwhanalytics.com/beyond-the-headlines-the-bess-insurance-market-after-moss-landing/
- Lockton (10 марта 2025): «Moss Landing — не market-moving event»; больше scrutiny только для indoor-установок. — Energy-Storage.News (ссылка выше)
- NARDAC (18 дек. 2025): «премии по BESS продолжат смягчаться, темп смягчения замедлится»; по property 2025 снижения «от high single digits до 25%+». — https://nardac.com/top-infrastructure-renewable-insurance-trends-for-2026-what-to-expect/
- WTW Renewable Energy Market Review 2025 (июль 2025): «renewal rates trending towards double-digit savings; new projects at five-year low in rates; ongoing oversupply in capacity»; при этом селективность к BESS «с ограниченным thermal control или недостаточным spacing». — https://www.wtwco.com/en-us/insights/2025/07/renewable-energy-market-review-2025 (полный PDF >10 МБ, не загружен)
- Snижение нормализованных failure rates на ~98% за 2018–2024 (EPRI-данные, цит. Resource Recycling, 24 фев. 2026). — https://resource-recycling.com/recycling/2026/02/24/battery-fire-risk-isnt-going-away-insurance-is-responding/
- Противоречивый источник: Solarif (2026) — «премии utility-scale BESS 2–5% capex, среднее 3,2%» — **допущение: это ненадёжная маркетинговая страница**, расходится с 0,3–0,4% от kWh Analytics на порядок; в расчётах не использовать. — https://solarif.com/academy-article/what-are-battery-storage-insurance-requirements-in-2025/
- **Capacity crunch по BESS/ВИЭ в 2025–2026 — не нашёл.** Найден обратный сигнал (переизбыток ёмкости). Единственный «дефицит» — исторический: солнечный рынок 2019–2021 (ставки с 10 до 30 центов/$100, участие страховщиков с 100% до 5–50%, уход Pioneer/CNA/RSA/AIG; AM Best, июнь 2021, https://news.ambest.com/articlecontent.aspx?refnum=308714).

### 3.2 Требования и кто заказывает оценки
- UL 9540A (обновлён март 2025) — «insurers typically require unit-level testing as condition of cover». — Apex wiki
- NFPA 855 (ред. 2026): порог 600 kWh для HMA снят — HMA нужна для любой ESS; HMA — «deliverable EPC / owner's engineer», «installer ultimately responsible». — Code Red Consultants, https://coderedconsultants.com/insights/hazard-mitigation-analysis-updates-nfpa-855-2026/ ; Bluerithm (выше)
- UL Solutions запустил BESS evaluation services (fire/deflagration risk, симуляции, документация) — июнь 2026. — Yahoo Finance/ResearchAndMarkets, https://finance.yahoo.com/energy/articles/battery-energy-storage-system-bess-115200592.html
- Fire & Risk Alliance: отчёт для American Clean Power (сент. 2025) — заказчик отраслевая ассоциация; услуги FRA — для владельцев. — https://cleanpower.org/wp-content/uploads/gateway/2025/03/Assessment-of-Potential-Impacts-of-Fires-at-BESS-Facilities_FINAL_Sep-2025.pdf
- **Вывод: заказчик и плательщик оценок — владелец/EPC.** Свидетельств, что страховщики сами покупают third-party BESS-оценки у DNV/UL/ESRG/FRA, **не нашёл**.
- «Страховой скоринг BESS» как продукт: **не нашёл**. Ближайшее — GCube-отчёт «Batteries Not Excluded» (фев. 2024: >50% отказов в первые 2 года; 5–50 MWh — >50% событий; ~10 отказов/год, ×10 к 2016; 48% — solar+storage) — собственная аналитика андеррайтера. — TD World, https://www.tdworld.com/distributed-energy-resources/energy-storage/article/21283205/
- kWh Analytics 2026: 75% BESS-сайтов имеют ранние HVAC-сигналы; ошибки SOC стоят >$1M/GWh/год; 75% андеррайтеров не покроют valuation step-up >25%. — BusinessWire 12 мая 2026

---

## 4. Регуляторный спрос на валидацию моделей — барьер или ров?

- Lloyd's Internal Model Validation Guidance (янв. 2023), §4.4 External Models: «If the internal model uses third party or external modelling… these need to be validated as part of the board's consideration of capital. A change to a third-party provider view of risk cannot be automatically accepted… Agents need to demonstrate their understanding of external models, including any material limitations… choice of version should be justified in the validation report… the validator would be expected to comment on the appropriateness of a particular vendor model in comparison with others.» — https://assets.lloyds.com/media/6e632c01-fc88-40c6-9c16-e8cac6ff191d/Internal%20Model%20Validation%20Guidance%20-%20January%202023%20Final.pdf
- Solvency II: определённые валидационные тесты — не реже раза в год; Lloyd's: где cat-риск материален, внешняя cat-модель — в периметре внутренней модели (MS12 use test). — Lloyd's Capital Guidance 2024, https://assets.lloyds.com/media/0a5cc3b2-8b60-4585-8db8-0cca63ec037e/Lloyd's%20Capital%20Guidance%20-%20February%202024.pdf
- PRA SS1/23 (model risk) — применяется к банкам, на страховщиков формально **не распространён** (обновление обещано с мая 2023, по состоянию на апр. 2026 нет). — Burning Cost, https://burning-cost.github.io/2026/04/05/pra-auditors-2026-ss123-pricing-model-monitoring/
- NAIC Model Bulletin on AI: принят 23–24 штатами (2025); страховщик отвечает за third-party AI, нужны audit rights, документированная валидация, тесты на bias. — Quarles, https://www.quarles.com/newsroom/publications/nearly-half-of-states-have-now-adopted-naic-model-bulletin-on-insurers-use-of-ai ; Holland & Knight, https://www.hklaw.com/en/insights/publications/2025/05/the-implications-and-scope-of-the-naic-model-bulletin
- **Оценка:** это **барьер входа** (в капитальный контур попасть трудно: нужна документация уровня Verisk/Moody's, сравнение с другими вендорами, годовой цикл), но **не ров** для новичка: ров возникает только после того, как модель уже сидит в чьей-то внутренней модели. Важная оговорка: требования Lloyd's касаются **capital modelling**; pricing/underwriting-инструменты (скоринг сделки, мониторинг) формально в этот периметр не входят — там барьер ниже, но и «замены фичей» ничто не мешает. Допущение: NAIC AI-бюллетень повышает стоимость продажи «AI-скоринга» американским carriers (нужны explainability и audit rights).

---

## 5. Контр-сигнал: коммодитизация сверху

- **Swiss Re CatNet®** — обновлённый слой града «для страховщиков и корпоративных клиентов… включая ВИЭ-инфраструктуру»; июль 2026 — партнёрство с SAS: CatNet-скоринг встроен в pricing/underwriting workflow. — https://www.swissre.com/reinsurance/property-and-casualty/solutions/property-solutions/catnet/new-layer-of-protection-against-complex-threat.html ; SAS, https://www.sas.com/en_ca/news/press-releases/2026/july/swiss-re-insurance-partner-risk-intelligence.html
- **Munich Re Location Risk Intelligence** — SaaS/API для страховщиков на собственных NatCat/climate-моделях; Green Tech Solutions — гарантии производительности с собственным инжинирингом (55 GW под управлением). — https://www.munichre.com/en/solutions/reinsurance-property-casualty/realytix-zero/location-risk-intelligence.html ; https://www.munichre.com/en/solutions/for-industry-clients/renewable-energy-and-energy-efficiency.html
- **Gallagher Re** — собственная вероятностная модель града; **Aon Impact Forecasting** — «climate & sustainability team of the year 2025», Low-Carbon Transition Framework (нояб. 2025; премии energy transition >$9B к 2030, рост ВИЭ-премий ~$3B 2024→2030). — https://aon.mediaroom.com/news-releases?item=138527
- **Verisk × S&P Global Energy** — «insurance-adjusted climate risk intelligence» (страница получена частично; допущение — целится в энергоактивы). — https://www.verisk.com/company/newsroom/verisk-and-sp-global-energy-collaborate-to-deliver-insurance-adjusted-climate-risk-intelligence/
- **Verisk Model Exchange** = бывшая Nasdaq RMC (допущение по редиректу; см. §2.1).
- **GCube × Clir** — MGA берёт аналитику операционных данных у вендора, но упаковывает её в свой продукт «Smart Insurance» — вендор невидим для рынка.
- Вывод: вертикальная интеграция «перестраховщик/брокер → бесплатная аналитика для цедентов/клиентов» — активна и ускоряется (2025–2026). Независимому вендору остаётся ниша «asset-first» физических моделей по узким перилам/классам (офшорный ветер, град по солнцу, интерконнекторы, BESS thermal), где инкумбенты пока используют proxy (industrial facilities, secondary modifiers).

---

## 6. Ценовые якоря

| Якорь | Значение | Источник |
|---|---|---|
| Лицензия cat-модели (AIR/Verisk, ураган Флорида, SaaS) | **$539 299/год** (базовая, при >1,5M полисов до $717 515; NTE $4,85M за 8 лет); предыдущий контракт 2014–2021 — $2,08M за 8 лет ≈ $260k/год | Citizens Property Insurance Corp., Board Action Item, 21 сент. 2021, https://www.citizensfla.com/documents/20702/19792377/20210921+02A+Catastrophe+Modeling+Software+Services+... |
| Допущение: лицензия узкоспециализированной ВИЭ-модели для среднего синдиката | порядок **$50–250k/год** — экстраполяция от Citizens (у синдиката экспозиция на 1–2 порядка меньше и одна–две перила); **публичных подтверждений нет** | — |
| Loss-control survey BESS ($/актив) | **Не нашёл.** Публичных прайсов нет; найденные «$60–75 per case» — оплата полевого инспектора жилой недвижимости, нерелевантно | CareerBuilder listing (нерелевантно) |
| Доля аналитики в расходах андеррайтера | **Не нашёл.** Expense ratio Lloyd's 34,4% (2024) без разбивки на data/analytics | Insurance Capital Markets Research, https://insurancecapitalmarkets.com/lloydsmarket2024/expense_analysis.html |
| Стоимость Oasis-инфраструктуры | членские взносы >$2M за 2 года от 21 участника на всю платформу (2014) — иллюстрация, что индустрия сознательно давит цену моделирования вниз | Artemis, https://www.artemis.bm/news/oasis-gets-industry-backing-for-loss-modelling-framework-open-source-standards/ |
| Ставка BESS | 30–40 ¢/$100 (2025) | kWh Analytics (см. §3.1) |
| Ставка солнце (историческая) | 10 → 30 ¢/$100 за 6–8 лет к 2021 | AM Best, июнь 2021 |
| Средний hail-claim по солнцу | $58M | Vaisala, сент. 2025 |
| Aggregate hail-claims по солнцу (2025) | $342M gross, >1M модулей | Risk & Insurance, https://riskandinsurance.com/rising-hail-risk-poses-growing-threat-to-solar-farm-insurability/ |

---

## 7. Итоговая таблица: что подтверждено / опровергнуто

| Тезис гипотезы | Статус | Ключевой факт |
|---|---|---|
| Есть контракты страховщиков с независимыми вендорами по энергоактивам | Частично: 1 вендор (Renew Risk) с 4 названными клиентами | GCube 2023, Convex/McGill 2024, Aviva |
| Есть цены | **Опровергнуто** (нет ни одной публичной цены по ВИЭ-модели) | Единственный якорь — Citizens/AIR $539k/год |
| Растущий спрос из-за ужесточения/дефицита ёмкости | **Опровергнуто** для 2025–2026 (рынок смягчается) | WTW июль 2025, NARDAC дек. 2025, Lockton март 2025 |
| Не строят in-house | Частично опровергнуто: MGA с данными строят своё (kWh, Understory, Descartes, Sunereum), GCube — свой BESS-датасет | §2 |
| Не берут только у Verisk/Moody's/брокеров | Частично опровергнуто: инкумбенты уже добавили ВИЭ в SCS/HD-модели, брокеры/перестраховщики раздают аналитику | §5 |
| Валидация = ров | Скорее барьер, чем ров; ров только post-adoption и только для capital-контура | Lloyd's §4.4 |

## 8. Что это значит для гипотезы (без гипотез о продукте — только следствия)
1. Первичный андеррайтер — трудный первый покупатель: долгая валидация, бесплатная альтернатива от брокера/перестраховщика, смягчающийся рынок снижает боль.
2. Реально платящие сегодня: владельцы/операторы (ACCURE, VDE, Vaisala), MGA за операционные данные (Clir), капитальные площадки (Lloyd's как инвестор Renew Risk). Дистрибуция через платформы (Oasis, Verisk Model Exchange) — путь на витрину, но платформа теперь принадлежит инкумбенту.
3. Единственный доказанный «pull» от страховщиков — там, где инкумбенты используют proxy: офшорный ветер, град по солнцу (asset-specific уязвимость), интерконнекторы. По BESS thermal-риску скорингового продукта нет — это дыра, но пока рынок закрывает её требованиями к владельцу (UL 9540A/NFPA 855), а не покупкой модели.
4. Вопросы для следующей проверки: (а) готов ли хоть один синдикат назвать бюджет на внешнюю ВИЭ-модель (интервью, не веб), (б) условия Renew Risk (цена/структура), (в) почему GCube выбрал внешнюю модель вместо in-house — публичного ответа нет.
