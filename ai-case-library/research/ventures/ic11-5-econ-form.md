# IC-11.5 · Экономика формы: расчётное ядро для страховщиков энергоактивов (BESS / ВИЭ / сети)

Дата: 01.09.2026. Роль: исследователь-скептик. Задача — опровергнуть утверждение:

> «Существует форма — лицензия модели, DD-отчёт на актив, доля в результате андеррайтинга — в которой независимый вендор без капитала доходит до ≥$10 млн выручки, покупатели не сконцентрированы в 5–10 домах, и тот, кто ближе всех к клиенту (перестраховщик, брокер, инженер-сюрвейер), не сделает это фичей».

Ограничение исследования: лимит веб-поиска сессии исчерпан после ~45 запросов; дальше — прямые загрузки страниц. Часть источников (theinsurer.com, crunchbase, coverager, dnv.com, howden) закрыта 401/403 — помечено.

---

## 0. Вердикт (коротко)

**Утверждение в его сильной форме опровергнуто по всем трём компонентам одновременно.** Ни одного примера независимого вендора моделей для страхования энергоактивов, дошедшего до $10 млн выручки *без* превращения в MGA (риск/подпись) или *без* поглощения инкумбентом, не найдено. Ближайший аналог — kWh Analytics — начал как данные/софт (HelioStats, 2013), перешёл в риск-продукт (Solar Revenue Put, 2016–2017), потом в MGA (property, 2023) и в марте 2026 продан Beazley. Второй по известности — Renew Risk (Лондон, Lloyd's в кэп-тейбле, модели на Nasdaq/Verisk Model Exchange) — на FY до 31.05.2025 сдаёт **микро-отчётность** в Companies House, т.е. по порогам это оборот ≤£632k (допущение см. §1.2). Покупатели BESS/ВИЭ-рисков — узкий список: брокерская вики и консорциумы называют 6–8 лидирующих маркетов и панели из 6–8 синдикатов. И «съедание фичей» уже происходит: Aviva встроила ACCURE в свой риск-фреймворк (пилот 2 года, 08.2026), HDI — ACCURE через TH!NX (2024), Munich Re — TWAICE (2020), Beazley — купил kWh целиком (2026), Moody's — купил RMS ($2 млрд, 2021) и Cape Analytics (2025), Swiss Re — Fathom (2023), Verisk — Nasdaq Model Exchange (2025).

Что *не* опровергнуто: (а) форма «риск-носитель без капитала» существует и доступна — Lloyd's coverholder (New Energy Risk получил статус в 2026 через синдикат 2843 OAK, капитал coverholder не требуется, требуется спонсор-managing agent + брокер); (б) DD-отчёт как форма существует (DNV QRA/HMA, Bureau Veritas, брокерские инженеры), но цены за отчёт публично не найдены, платит владелец, а не страховщик.

---

## 1. Выручка аналогов

### 1.1 kWh Analytics (США) — «от данных к MGA», затем продажа
- Основана 2012; HelioStats (данные/бенчмаркинг) — 2013; Solar Revenue Put — 2016 (первая сделка дек. 2017, Coronal/Panasonic); Property Insurance как MGA — 2023. База 300 000+ активов, «30% солнечных активов США», «$100B+ loss data», «5 из топ-10 (пере)страховщиков в панели», «>$50B assets protected». Источник: kWh Analytics, About, https://kwhanalytics.com/about/ (загружено 01.09.2026).
- Раунд $20M (02.2022). Источник: BusinessWire 08.02.2022, https://www.businesswire.com/news/home/20220208005044/en/
- Ёмкость с Aspen: $75M/локация (04.2024) → $100M/проект (02.2026). Источник: Reinsurance News, тег kWh, https://www.reinsurancene.ws/tag/kwh-analytics/
- Solar Revenue Put «застраховал >$3B солнечных станций США». Источник: выдача по kWh (два-пейджер kWh недоступен — DNS assets.kwhanalytics.com не резолвится).
- **10.03.2026 — Beazley объявил о покупке kWh Analytics** («US renewable energy MGA»), интеграция в MAP Risks; цена **не раскрыта**; GWP/выручка/штат **не раскрыты**. Источники: Beazley PR https://www.beazley.com/en-US/news-and-events/acquisition-of-kwh-analytics/ ; Insurance Business https://www.insurancebusinessmag.com/us/news/mergers-acquisitions/beazley-announces-kwh-analytics-swoop-567934.aspx ; Insurance Journal 10.03.2026 https://www.insurancejournal.com/news/national/2026/03/10/861264.htm
- Вывод: единственный «вышедший за $10M» (допущение — выручка не раскрыта, но $100M ёмкости/проект и панель из 5 топ-10 перестраховщиков означают GWP в десятки млн) — сделал это **как MGA с риском в структуре**, и в итоге **продан инкумбенту**. Чистого «вендора модели» здесь не было с 2017 года.

### 1.2 Renew Risk (Лондон) — «чистый вендор моделей»
- Основана 2021; seed $4.7M при оценке $16M; затем раунд £5M (Molten Ventures, Lloyd's, Insurtech Gateway; дата на сайте не указана). Источники: Reinsurance News 09.04.2026 https://www.reinsurancene.ws/renew-risk-launches-specialist-offshore-windstorm-models-to-transform-risk-assessment-across-europe/ ; Renew Risk News https://www.renew-risk.com/news
- Клиенты/партнёры по публикациям: McGill & Partners и Convex (ранние адоптеры на Nasdaq), Aviva (соразработка ветровых моделей, interconnector module), GCube (принял модели офшорного ветра). Источники: Nasdaq-статья (ныне редиректит на Verisk Model Exchange), Renew Risk News.
- **Companies House, RENEW RISK LIMITED (№13769364): последние счета — «Micro company accounts» за год до 31.05.2025 (поданы 01.04.2026); и за 2024, и за 2023 — тоже микро.** Источник: https://find-and-update.company-information.service.gov.uk/company/13769364/filing-history
- Допущение: для отчётного года, начавшегося 01.06.2024, действуют старые пороги микро-компании (2 из 3: оборот ≤£632k, баланс ≤£316k, ≤10 сотрудников). При привлечённых £5M баланс, скорее всего, >£316k, значит выполняются оборот ≤£632k и ≤10 сотрудников. **То есть через 4 года, с Lloyd's-инвестором, четырьмя моделями и брендовыми логотипами — оборот порядка <$1M.** Это прямой контрпример тезису «лицензия модели → $10M».

### 1.3 New Energy Risk (Paragon) — «performance insurance», не софт
- Специалист по technology performance insurance (>10 лет), клиенты привлекли >$3B капитала (на 30.06.2022). Источник: Paragon https://paragoninsgroup.com/news-insights/new-energy-risk-announces-milestone-as-clients-raise-3b-in-capital/
- 04–05.2026 — статус **Lloyd's coverholder** по tax credit insurance через синдикат 2843 (OAK Re), спонсор OAK Global. Источник: https://www.lifeinsuranceinternational.com/news/new-energy-risk-lloyds-coverholder/
- Выручка не раскрыта (принадлежит Paragon Insurance Holdings). Форма — андеррайтинг с подписью, не лицензия модели. Подтверждает урок «выживает форма с подписью».

### 1.4 Verisk (Extreme Event Solutions, ex-AIR)
- Сегментная выручка EES **не раскрывается**; в Q2/Q3 2025 «Underwriting revenues +8.3% / +6.9%, primarily due to forms, rules and loss cost services and extreme event solutions». Источник: Verisk newsroom Q2/Q3 2025 (страницы загружаются без тела; цифры из поисковой выдачи). Оценка «$750M revenue» от LeadIQ — ненадёжный сторонний источник, не использую.
- 07.2026 Verisk купил McKenzie Intelligence Services; 2025 — Nasdaq Risk Modelling → Verisk Model Exchange (магазин моделей, где размещался Renew Risk). Источник: GlobeNewswire 29.07.2026 https://www.globenewswire.com/news-release/2026/07/29/3335063/0/en/ ; https://www.verisk.com/products/model-exchange/
- Смысл для нас: **дистрибуция сторонних моделей теперь принадлежит инкумбенту (Verisk)**; независимый вендор на витрине — квартирант.

### 1.5 Moody's RMS
- Куплен Moody's за ~$2.0B (09.2021) при выручке RMS ~$320M (FY к 30.09.2021). Источники: Insurance Journal 16.09.2021 https://www.insurancejournal.com/news/national/2021/09/16/632155.htm ; Artemis https://www.artemis.bm/news/rms-sold-to-moodys-2-billion/
- По ВИЭ у RMS нет отдельного продукта: предлагают Climate Change Models, SiteIQ, Industrial Facilities Model, консалтинг по bespoke vulnerability curves (статья 25.01.2022). Источник: https://www.moodys.com/web/en/us/insights/insurance/risk-modeling-and-the-rise-of-renewables.html
- Cape Analytics — куплена Moody's (объявлено 13.01.2025), цена не раскрыта, «not material», Cape привлекла $75M. Источник: TechCrunch 13.01.2025 https://techcrunch.com/2025/01/13/moodys-agrees-to-acquire-cape-analytics-which-develops-geospatial-ai-for-insurance-providers/
- Вывод: даже лидер рынка cat-моделей с $320M выручки — это ~6% от цены сделки; независимость закончилась поглощением.

### 1.6 Fathom → Swiss Re
- Куплен 14.12.2023; **цена не раскрыта**. Источник: Swiss Re PR https://www.swissre.com/press-release/Swiss-Re-acquires-Fathom-a-leader-in-water-risk-intelligence/4af5e0d7-e065-404a-b80d-6f32955f0fbe
- Выручка Fathom до сделки — **не нашёл** (лимит поиска).

### 1.7 Провалы
- **Cervest/EarthScan**: привлёк $34.8–36.2M (Series A $30M, 05.2021, Draper Esprit, Benioff/Time Ventures), вошёл в администрацию 06.2023, ~100 сотрудников без зарплаты с апреля; IP продано «конкуренту» — **кому и почём, не нашёл** (proactiveinvestors 403). Источники: CB Insights https://www.cbinsights.com/company/cervest ; TechCrunch 20.05.2021 https://techcrunch.com/2021/05/20/climate-risk-platform-cervest-raises-30m-series-a-led-by-draper-esprit/ ; ProactiveInvestors (заголовок) https://www.proactiveinvestors.co.uk/companies/news/1019362/
- **Jupiter Intelligence**: подтверждений увольнений/реструктуризации 2024–2026 **не нашёл**; пресс-лента 2025–2026 — только партнёрства (Arcadis, ERM, RINA, JLL, SEI), ни одной цифры выручки/раунда. Источник: https://www.jupiterintel.com/press-release . Обратите внимание: Jupiter продаёт корпоративам/банкам, не страховщикам — это уход из нашей ниши.

### 1.8 Итог по §1
**Кто из вендоров моделей вышел за $10M, не став MGA и не будучи купленным — не найдено ни одного.** RMS ($320M) и Fathom — куплены. Cape — куплена. kWh — стал MGA, куплен. Cervest — банкрот. Renew Risk — микро-компания. NER — андеррайтер, не вендор.

---

## 2. Концентрация покупателей

- Брокерская вики (UK): «Lloyd's leaders are typically a small panel of energy and engineering syndicates», активные маркеты по BESS: **GCube (Tokio Marine HCC), Munich Re, Swiss Re Corporate Solutions, Liberty Specialty Markets, HDI Global, Tokio Marine Kiln**; брокеры: Marsh, Aon, WTW, McGill, Lockton, Howden. «Capacity for stand-alone grid-scale BESS in the UK is more constrained than for almost any other renewable energy asset class». Источник: Apex Insurance Brokers Wiki https://apexinsurancebrokers.co.uk/wiki/battery-storage-insurance/
- Консорциумы Lloyd's под BESS: GCube — **6 синдикатов**, $100M/проект (16.07.2024); Nardac — **8 синдикатов**, $50M/локация (26.03.2024); TMGX — «первый Lloyd's-консорциум», +$125M ёмкости, опыт 8 GW BESS. Источники: Reinsurance News https://www.reinsurancene.ws/gcube-unveils-100m-lloyds-consortium-to-support-bess-sector/ ; Nardac https://nardac.com/nardac-secures-underwriting-authority-for-battery-storage-projects/ ; TMGX https://tmgx.com/products/battery-energy-storage-systems
- kWh Analytics: «5 из топ-10 (пере)страховщиков в панели», лид — Aspen. Источник: kWh About.
- Marsh запустил facility для mid-scale солнце/BESS <50 MW, до $25M liability, «A-rated carriers» (без имён). Источник: Insurtech Insights https://www.insurtechinsights.com/marsh-launches-renewable-energy-facility-for-mid-scale-solar-and-bess-risks/
- **Оценка (допущение):** реальных «ведущих» андеррайтеров BESS/ВИЭ в мире — 10–20 домов (6–8 лондонских лидеров + Munich Re/Swiss Re CorSo/AXA XL/Allianz/Chubb/Liberty/HDI + 3–5 специализированных MGA: GCube, kWh, Nardac, TMGX, NER). Следующие за ними синдикаты — фолловеры, которые аналитику не покупают, а следуют за лидером. Утверждение «покупатели не сконцентрированы в 5–10 домах» — по BESS **опровергнуто на уровне лидеров**; по «всему ВИЭ» — расширяется до ~20.
- Якоря цен на аналитику: cat-модели — «шести- и семизначные годовые лицензии»; документированный кейс — Citizens Property (FL) платит AIR **$539 299/год** при >1.5 млн полисов. Источник: Citizens FL закупочный документ 2021 https://www.citizensfla.com/documents/20702/19792377/20210921+02A+Catastrophe+Modeling+Software+Services...pdf ; Marsh «Catastrophe Modeling: Why All the Fuss?» https://www.marsh.com/en/services/property-risk-management/insights/catastrophe-modeling.html . Допущение: нишевая энергетическая модель для синдиката с портфелем BESS в $50–500M премии будет стоить на порядок ниже — $50–200k/год.

---

## 3. Форма «DD-отчёт на актив»

- Кто делает: DNV (QRA сайтов BESS, hazard/battery safety, permitting support; технический DD «bankability» — напр. Energy Vault B-VAULT), Bureau Veritas (BESS-решения для девелоперов/EPC/инвесторов/кредиторов), брокерские риск-инженеры (WTW — вовлечение с NTP по стадиям стройки и «pre-feed»). Источники: DNV https://www.dnv.com/services/battery-safety-risk-analysis-and-permitting-support-159179/ (403 при загрузке, описание из выдачи) ; Energy Vault https://www.energyvault.com/newsroom/energy-vault-receives-successful-technical-due-diligence-evaluation... ; Bureau Veritas UK https://www.bureauveritas.co.uk/sustainability/battery-energy-storage-systems ; WTW 02.2026 https://www.wtwco.com/en-us/insights/2026/02/hybridization-in-renewable-energy-how-risk-engineering-makes-all-the-difference
- Что требуют страховщики до бинда: «evidence of containerised hot-spot testing and BMS commissioning before risk attaches», предпочтение UL 9540A-контейнерам с deflagration venting (Apex wiki); «Hazard Mitigation Study… fire and explosion risks», «most insurers now mandating detailed risk assessments and safety certifications before providing coverage» (Solarif). Ставка премии BESS — «0.3%–1.2% от стоимости проекта в год»; пример UK: 100 MW/200 MWh → CAR-программа £40–60M, операционные франшизы £250–500k на контейнер. Источники: Apex wiki; Solarif https://solarif.com/academy-article/what-are-battery-storage-insurance-requirements-in-2025/
- **Цены за отчёт — не нашёл** ни у DNV, ни у BV, ни в брокерских материалах (нет публичных прайсов; поисковый лимит). Допущение из практики lender IE-отчётов: $20–100k за технический DD, $5–30k за QRA/HMA сайта — не подтверждено источником.
- **Кто платит:** владелец/девелопер (DNV/BV позиционируют услуги для девелоперов, EPC, инвесторов, кредиторов; Aviva-пилот с ACCURE — «eligible Aviva clients receive preferential onboarding fees with Accure», т.е. платит клиент-владелец, страховщик лишь субсидирует). Источник: Modern Power Systems 05.08.2026 https://www.modernpowersystems.com/news/aviva-backs-landmark-energy-storage-pilot-safety-project/
- Объём: EIA (2022) ожидал «>300 utility-scale battery projects online к 2025»; факт 2025 — 15–16 GW/47–58 GWh за год (рекорд), 43.6 GW на конец 2025, ~52 GW к середине 2026, планы 14 GW H2-2026, 26 GW 2027, 14 GW 2028; WoodMac: уровень 2025 не повторится до 2029. Источники: EIA https://www.eia.gov/todayinenergy/detail.php?id=54939 ; EIA 07.08.2026 https://www.eia.gov/todayinenergy/detail.php?id=67925 ; WoodMac/ACP https://www.woodmac.com/press-releases/2025-u.s.-energy-storage-installations-set-new-record-surpass-2024-by-52/ ; ESN https://www.energy-storage.news/us-annual-battery-storage-installations-will-not-reach-2025-levels-again-until-2029-wood-mac/ . **Точного числа проектов/год не нашёл**; допущение: при среднем 80–120 MW на проект 16 GW ≈ 130–200 utility-scale вводов в США в год, т.е. ниже ориентира 300–400 из задания.
- Субподряд к DNV/брокеру: прецедентов «независимый софт-вендор как субподрядчик DNV» не нашёл. Наоборот: DNV, BV, брокеры (WTW/Marsh «proprietary modeling tools») держат инженерию in-house; Marsh: «insightful data and proven proprietary modeling tools for BESS». Источник: Marsh https://www.marsh.com/en/industries/energy-and-power/expertise/battery-energy-storage-systems.html

---

## 4. Форма «доля в результате андеррайтинга» без капитала

- Механика MGA: «An MGA does not carry capital against the risks it writes»; доход — ceding/management commission (типично 25–35% GWP по fronting-структурам) + profit commission. Источники: hyperexponential https://www.hyperexponential.com/blog/mga-carrier-relationships ; private.law wiki fronting https://wiki.private.law/en/insurance-fronting-mga
- Lloyd's coverholder: нужны спонсоры — Lloyd's-брокер **и** managing agent; заявка через ATLAS; бизнес-план, финансовая информация, подписанное undertaking; «robust operational capabilities», quote-and-bind система и бордеро по стандарту V5.2. **Минимальный капитал/PI-лимит на странице Lloyd's не указаны** (в referral criteria/Crystal, не загружены). Источники: Lloyd's https://www.lloyds.com/market-resources/delegated-authorities/coverholders ; https://www.lloyds.com/market-resources/delegated-authorities/coverholders/new-coverholder-applications ; Insly https://insly.com/en/blog/lloyds-coverholder-systems-requirements-your-guide-to-being-ready/ . Масштаб: ~$25B премии через >4 000 coverholder-отношений.
- Прецеденты «аналитический партнёр с долей в результате»: **не нашёл ни одного публичного кейса**, где дата-вендор без биндинга получает profit commission. Найденные кейсы — либо вендор на лицензии (TWAICE→Munich Re, 2020: «нет признаков, что TWAICE делит андеррайтинговый результат»; TWAICE лишь застраховал точность своей аналитики через Great Lakes/Munich Re с выплатой 8× стоимости аналитики), либо партнёр становится coverholder/MGA (NER 2026, Nardac 2024, kWh 2023). Источники: TWAICE https://www.twaice.com/newsroom/munich-re-partnership ; https://www.twaice.com/newsroom/twaice-guaranteed-accuracy-of-battery-analytics
- Вывод: «MGA без капитала» — да, форма открыта (coverholder не держит капитал), но это **не «вендор модели с долей»**, а полноценный андеррайтер с подписью, спонсором-синдикатом, системами, комплаенсом и профессиональной ответственностью за биндинг. Пример NER: понадобился спонсор OAK Global и синдикат 2843.

---

## 5. Кто съест фичей — уже едят

| Вектор | Факт | Источник |
|---|---|---|
| Перестраховщик (Munich Re) | Green Tech Solutions: performance guarantee до 30 лет, «co-creational risk engineering process 3–6 месяцев: concept → risk assessment → technical DD → offer», «in-depth technical risk expertise», 15 лет трек-рекорда, сеть с research/certification организациями; батарейная performance-страховка с 2019 на данных TWAICE | Munich Re factsheet (PDF, © 2026); PR 07.03.2019 https://www.munichre.com/en/company/media-relations/.../2019-03-07-media-information.html |
| Перестраховщик (Swiss Re) | купил Fathom (12.2023), строит 50 000-летние event sets in-house | Swiss Re PR; Fathom newsroom https://www.fathom.global/newsroom/fathom-swiss-re-flood-data/ |
| Страховщик (Beazley) | купил kWh Analytics (03.2026) — «modelling, underwriting and risk management across renewable energy portfolios» | Beazley PR |
| Страховщик (Aviva) | 2-летний пилот с ACCURE: аналитика «embedded into its risk framework»; соразработка моделей с Renew Risk силами своих exposure/underwriting/risk-engineering команд | Modern Power Systems 05.08.2026; Reinsurance News 09.04.2026 |
| Страховщик (HDI) | HDI TH!NX + ACCURE для Gore Street (130 MW, 04.2024) | ACCURE news https://www.accure.net/news/gore-street-capital-... |
| Брокеры | Marsh: «proprietary modeling tools for BESS», facility <50 MW; WTW: свои риск-инженеры на всех стадиях; Aon: «data and analytics» в пакете | Marsh, WTW, Aon страницы (см. §3) |
| Инженеры-сюрвейеры | DNV QRA/HMA/permitting, BV BESS-DD — in-house | §3 |
| Monitoring-вендоры | ACCURE: 24+ GWh, 100+ сайтов, страница «BESS insurance», партнёры Aviva/HDI/Protect Solar/iON+; TWAICE: гарантия точности, застрахованная Munich Re | https://www.accure.net/battery-analytics-solutions/bess-insurance ; ACCURE/Protect Solar |
| Модельные платформы | Moody's (RMS+Cape), Verisk (Model Exchange, MIS), KatRisk (купил RED, 04.2026) | §1.4–1.5; Reinsurance News https://www.reinsurancene.ws/katrisk-expands-global-catastrophe-modelling-capabilities-with-red-acquisition/ |
| OEM батарей | Прямых фактов «Tesla/Fluence дают страховщикам данные» **не нашёл**; но Munich Re продаёт performance-гарантии именно OEM (ESS Inc., 2019–2024) — т.е. OEM-данные уже текут в перестраховщика | ESS Inc. https://essinc.com/ess-inc-and-munich-re-expand-industry-leading-warranty-insurance-coverage/ |

Где именно вытеснят: (1) мониторинг/health-скоринг — ACCURE/TWAICE уже «insurance-grade» и встроены у Aviva/HDI/Munich Re; (2) cat-риск ВИЭ — Renew Risk + Aviva/GCube/Convex, витрина у Verisk; (3) pre-bind DD — DNV/BV/брокеры; (4) performance/underperformance-модели — Munich Re GTS, kWh→Beazley. Свободной «полки» между этими четырьмя не видно.

---

## 6. Санити-чек $10 млн

- **Лицензии.** При $100–300k/год нужно 33–100 платящих домов; лидеров в мире ~10–20 (§2). Renew Risk с логотипами Aviva/GCube/Convex/McGill — микро-компания (§1.2). Cat-якорь $539k/год — у Citizens с 1.5 млн полисов, а у BESS-синдиката портфель на 2–3 порядка меньше. **Путь до $10M на лицензиях в этой нише не просматривается.**
- **DD-отчёты.** При $10–30k/отчёт нужно 330–1 000 отчётов/год; utility-scale вводов в США — допущение 130–200/год (§3), плюс Европа/Австралия — допущение ещё 100–200. Даже 100% доли рынка не даёт $10M при $10–30k; при $50k+ конкурируешь с DNV/BV/брокерами, у которых инженеры и бренд. Цен нет в открытых источниках. **Не проходит.**
- **Profit commission / MGA.** При комиссии 25–35% GWP (fronting/MGA-норма) $10M дохода = $30–40M GWP; при ставке 0.3–1.2% TIV — $2.5–13B застрахованной стоимости. kWh к 2026 «>$50B assets protected» и продан. Это путь, но это **MGA с подписью, спонсором и 8–10 годами** (kWh: 2016→2026), не «вендор без капитала». Допущение: чистый profit commission без базовой комиссии (5–15% прибыли) требует ещё ~3–5× большего GWP.
- Вывод: **единственный арифметически проходящий путь — стать риск-носителем (coverholder/MGA)**; это и есть форма «с подписью», о которой урок предыдущих проверок.

---

## 7. Регуляторные барьеры

- **Solvency II, ст. 126**: «The use of a model or data obtained from a third party shall not be considered to be a justification for exemption from any of the requirements for the internal model». Т.е. страховщик обязан валидировать вендорскую модель как свою; вендор должен открыть методологию/документацию. Источник: https://www.legislation.gov.uk/eudr/2009/138/article/126
- **PRA SS1/23**: применяется к **банкам** с IM-approval, не к страховщикам (страховщики — через Solvency II/валидацию внутренних моделей); но принципы вендорских моделей те же: «satisfy themselves that the vendor models have been validated to the same standards», «boards… ultimately responsible… even when there are… third-party arrangements». Источники: BoE https://www.bankofengland.co.uk/prudential-regulation/publication/2023/may/model-risk-management-principles-for-banks-ss ; Katalysys https://www.katalysys.com/insights/ss123-model-risk-management
- **Ответственность вендора модели.** RMS в документе для регулятора Техаса (ASOP 38, 2018): «RMS is not engaged in the insurance… industries… SPECIFICALLY DISCLAIMS ANY AND ALL RESPONSIBILITIES, OBLIGATIONS AND LIABILITY WITH RESPECT TO ANY DECISIONS… IN NO EVENT SHALL RMS… BE LIABLE FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES». Источник: TDI https://www.tdi.texas.gov/submissions/rate_submissions/documents/rmsasop.pdf . **Прецедентов исков к вендорам cat-моделей — не нашёл** (два поиска; Florida FCHLPM-статут содержит иммунитет для комиссии, не для вендоров). Вывод: индустрия работает на полном отказе от ответственности; отсюда и низкая ценность «чистой модели» — за неё никто не отвечает, значит и платят как за софт.
- **E&O для вендора.** Tech E&O $1M-лимит: медиана ~$2.0k/год; по выручке $5–10M — $9.6k, >$10M — $14.4k; «technology, finance… engineering pay more». Источник: Vouch https://www.vouch.us/blog/errors-omissions-insurance-cost . Для coverholder-статуса PI требуется (лимит на странице Lloyd's не указан — не нашёл). Барьер по стоимости E&O — низкий; барьер по валидации (ст. 126) — высокий по трудозатратам, но это барьер для *покупателя*, что ещё сильнее сужает число домов, готовых внедрять стороннюю модель.

---

## 8. Что осталось «не нашёл» (честно)
1. Цены DD/QRA-отчётов по BESS (DNV/BV) — нет публичных прайсов.
2. Точное число utility-scale BESS-проектов, введённых в 2025 (только GW/GWh и «>300 к 2025» из прогноза EIA 2022).
3. Выручка/цена: kWh (Beazley), Fathom (Swiss Re), Cape (Moody's) — не раскрыты.
4. Сегментная выручка Verisk EES — не раскрывается.
5. Покупатель IP Cervest.
6. Иски к вендорам cat-моделей — не найдено ни одного.
7. Минимальные капитал/PI для Lloyd's coverholder — в закрытых referral criteria.
8. Раунды kWh после 2022 — не нашёл (вероятно, не было; сразу продажа).

---

## 9. Итоговая таблица по компонентам утверждения

| Компонент | Статус | Ключевое доказательство |
|---|---|---|
| Вендор без капитала → ≥$10M | **Опровергнуто** (нет ни одного примера) | Renew Risk — микро-отчётность FY25; kWh — MGA→продажа; RMS/Fathom/Cape — куплены; Cervest — банкрот |
| Покупатели не в 5–10 домах | **Опровергнуто по BESS-лидерам**, ~10–20 по всему ВИЭ | Apex wiki (6 лидеров), консорциумы 6–8 синдикатов, kWh «5 из топ-10» |
| Ближайший к клиенту не сделает фичей | **Опровергнуто** | Aviva/ACCURE (08.2026), HDI/ACCURE, Munich Re/TWAICE + GTS, Beazley/kWh, Swiss Re/Fathom, Moody's/RMS+Cape, Verisk/Model Exchange |
| Форма «MGA без капитала» существует | **Подтверждено** (но это форма с подписью) | Lloyd's coverholder; NER 2026; Nardac 2024 |
| Форма «DD-отчёт» существует | Подтверждено, но ёмкость < $10M и занята DNV/BV/брокерами | §3 |
