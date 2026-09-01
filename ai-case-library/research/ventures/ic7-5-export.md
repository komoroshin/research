# IC7-5 · Экспортные рынки для «проектной мощности как сервиса» — проверка на опровержение

Дата проверки: 01.09.2026. Роль: исследователь-скептик.
Контекст (принят, не перепроверялся): UK/ЕС публичный контур закрыт; США — FEOC делает РФ-нексус риском для клиентов с налоговыми кредитами; частные клиенты доступны при чистой структуре.

**Проверяемое утверждение:** «Существует хотя бы один экспортный рынок (Залив, Индия, ЛатАм/Бразилия, СНГ, ЮВА), где инжиниринг-сервис команды российского происхождения покупаем, и юнит-экономика (чек × поток проектов) складывается в бизнес ≥ $10 млн потенциала».

Ограничение исследования: лимит веб-поиска сессии исчерпан на ~40-м запросе; часть источников (MISO, SEC, KEGOC, Brazil Business, Mondaq и др.) дочитана через прямую загрузку PDF/страниц. Ряд пунктов помечен «не нашёл».

---

## 0. Вердикт (коротко)

**Утверждение опровергнуть полностью не удалось, но в заявленной форме оно не подтверждается.**

- **Рынок существует и он большой** — прежде всего Саудовская Аравия: только SEC/Saudi Energy энергизирует ~100 передающих подстанций в год (45 за 9М2025, 28 за Q1 2026) и в 2025 г. присудила ~$15 млрд контрактов по подстанциям и сетям. Бум ЦОДов в Заливе, Джохоре, Бразилии, Индии — реален.
- **Но «покупаем» — только как субподрядчик под чужой печатью.** Во всех пяти регионах прямой вход закрыт лицензированием (Саудия: 10 лет истории + лицензии в 4 странах; Малайзия: иностранное участие ≤30%, иностранный директор запрещён; Бразилия: CREA-регистрация только под контракт с бразильской фирмой; Казахстан: гослицензия на проектирование ≥110 кВ). Это совпадает с моделью «местный партнёр-подписант», но означает, что маржа делится, а канал продаж — не свой.
- **Ценовой якорь задаёт индийский офшор, а не «ИИ-ускорение».** Зарплата substation design engineer в Индии ≈ ₹438/час (~$5/час), офшорные конторы продают инженера-электрика от $8/час, рыночные ставки для аутсорсинга $25–45/час junior. Крупные EPC (L&T, KEC, Techno Electric) держат проектирование in-house. Значит, покупатель в Заливе/Индии/ЮВА сравнивает нас с ценой $10–30/час, а не с европейскими $100+/час. Премия за ИИ не формируется — экономия достаётся заказчику.
- **Юнит-экономика к $10 млн не сходится в горизонте 3–4 лет.** Реалистичный чек detailed design подстанции 110–345 кВ — $0,13–0,33 млн в СНГ (факт: ПСД 220 кВ — 170 млн тенге), в США — ~3% от CAPEX ($0,5–1,0 млн за 345 кВ ПС по MISO, включая экологию и ПНР). В Заливе/Индии/ЮВА — между этими точками (допущение: $0,15–0,5 млн). Для $10 млн нужно 25–70 полноценных проектов ПС в год, т.е. ~25–70% годового ввода подстанций SEC — недостижимо для нового субподрядчика без якорного EPC. Путь к $10 млн **не виден**; виден путь к $1–3 млн/год как субпроектировщик у 1–2 EPC.
- **РФ-происхождение:** в Заливе — не запрет, а фрикция: ОАЭ-банки закрывают счета и режут платежи с РФ-нексусом с осени 2023; при этом госструктуры ОАЭ (Edge, G42) массово нанимают российских инженеров. В Бразилии/Индии/ЮВА/СНГ прямых свидетельств отторжения не нашёл; в Бразилии барьер — язык/CREA, а не политика.
- **СНГ — «карман», не бизнес:** чеки $0,13–0,33 млн за ПСД, местные институты (UzEngineering, Sredazenergosetproekt, КазСЭП, ИП-проектировщики в тендерах KEGOC), крупные объекты — под EPC с собственным проектированием (ВБ/АБР/ЕБРР — plant design-supply-install). Годовой пул проектных работ KEGOC — единицы млн $.

**Итог:** гипотеза «есть рынок ≥$10 млн» → **изменить**: рынок есть, но это рынок субподряда по офшорным ставкам; $10 млн требует white-label под крупным EPC с гарантированным потоком (20+ ПС/год) — такой договорённости нет и её надо валидировать первой.

---

## 1. Залив (Saudi / UAE / Qatar)

### 1.1 Размер и динамика — рынок реальный и самый большой из пяти
- SEC (Saudi Energy): «During 9M 2025, SEC added and energized 45 new transmission substations»; «During Q1 2026, SE added and energized 28 new transmission substations»; число подстанций 1 343 (Q1 2026) vs 1 266 (Q1 2025), +77 за год; сеть 106 217 c.km (+5%). Источник: SE Earnings Release Q1 2026, 06.05.2026 — https://www.se.com.sa/-/media/sec/Investors/Earning-Reports/SE-Earnings-Release-Q1-2026-English.ashx ; Q3 2025 — https://www.se.com.sa/-/media/sec/Investors/Earning-Reports/SEC_ER_2025-Q3_Final.ashx
- Capex SEC Q1 2026: SAR 16,7 млрд за квартал (нормализованный, без customer-funded T&D SAR 3,5 млрд) — там же. В 2024 г. компания вложила $16 млрд, +43,8% г/г; в 2025 г. Saudi Energy присудила ~$15 млрд контрактов по подстанциям и сетям. Источник: trade.gov Saudi Arabia – Power (Country Commercial Guide) — https://www.trade.gov/country-commercial-guides/saudi-arabia-power
- Тендеры на 380 кВ BSP под ВИЭ раунда 7 (5 300 МВт): SolarQuarter, 03.03.2026 — https://solarquarter.com/2026/03/03/saudi-energy-invites-bids-for-380-kv-substations-to-boost-renewable-integration/ — тендеруется строительство (EPC), не отдельное проектирование.
- ЦОДы: операционная мощность 467 МВт (Q1 2026, MCIT), исторический темп ввода 94 МВт/год (2021–2025); нацтаргет ~1,5 ГВт к 2030; HUMAIN — 1,9 ГВт к 2030 и 6,6 ГВт к 2034; тендер HUMAIN Al-Saad (май 2026) — «2,000 MVA bulk supply point, substations only» → узкое место — сетевое подключение. Источник: vision2030.ai, «Saudi Data Center Capacity: The Real Megawatts», июль 2026 — https://vision2030.ai/analysis/saudi-data-centre-capacity-megawatts/ (аналитический сайт, не первичный; цифры MCIT указаны как источник).
- Финансирование: до $42 млрд капитала / $32 млрд долга к 2030 (Alvarez & Marsal); «lenders want to know when a facility will receive power» — AGBI, 08.2026 — https://www.agbi.com/ai/2026/08/saudi-data-centre-ambitions-could-require-42bn-by-2030/ ; Semafor 11.08.2026 — https://www.semafor.com/article/08/11/2026/saudi-data-center-capacity-projected-to-boom-but-financing-a-challenge
- HUMAIN → MIS: контракт >SAR 8,77 млрд «design and construct» 200 МВт (всего 250 МВт) — SaudiGulf Projects, 08.2026 — https://www.saudigulfprojects.com/2026/08/humain-awards-mis-major-ai-data-center-expansion-contract-worth-more-than-sar-8-77-billion/ . Т.е. проектирование идёт внутри D&B-контракта у местного/регионального EPC — окно для субпроектировщика есть только через EPC.
- **Контр-факт:** NEOM урезан: PIF в 12.2024 одобрил сокращение бюджета до 60%, The Line приостановлен (16.09.2025, до после-2030), списание $8 млрд, компенсации подрядчикам >$16 млрд; при этом ~$3 млрд перенаправлено на Oxagon (порт, ЦОДы). Источники: Semafor 22.05.2026 — https://www.semafor.com/article/05/22/2026/saudis-neom-halts-work-on-the-line-until-after-2030 ; The Middle East Insider 11.04.2026 — https://themiddleeastinsider.com/2026/04/11/what-happened-neom-the-line-2026-reality/ . Вывод: «NEOM» как аргумент спроса — слабый; спрос сидит в SEC/National Grid SA и в ЦОД-кампусах HUMAIN/DataVolt/stc.

### 1.2 Как заходят иностранные инжиниринговые фирмы — барьер высокий
- Лицензия инженерного консалтинга для 100% иностранной компании (MOMRAH/SCE): «The company must have been operating for at least 10 years»; «licensed in at least 4 countries in the same field»; финотчётность и ТР, заверенные посольством; данные саудовских партнёров. Источник: Mondaq, «How To Get Consulting Licenses For Engineering Offices In Saudi Arabia» — https://www.mondaq.com/saudiarabia/corporate-and-company-law/1526350/ . **Новое юрлицо вне РФ этим требованиям не соответствует по определению** → только субподряд у местного лицензированного офиса.
- Подача проектной документации в SEC: «submissions must be stamped and uploaded to the Kahraba portal by a licensed entity possessing the required Saudi Council of Engineers (SCE) accreditations… must possess SEC pre-qualifications» — ElecWatts GCC — https://elecwattsgcc.com/blog/sec-electrical-submission-requirements/ (вторичный источник, консалтинговый блог).
- Крупные подстанции SEC/TRANSCO уходят турнкей-EPC с собственным проектированием: L&T — 380 кВ GIS в КСА, 220/33 кВ в Абу-Даби (03.2025) — https://www.saudigulfprojects.com/2025/03/lt-awarded-new-substation-contracts-in-saudi-arabia-uae/ . У L&T PT&D — индийские проектные центры (допущение по общеизвестной структуре L&T; отдельный источник не нашёл).
- ОАЭ: требования Dubai Municipality к иностранной консалтинговой лицензии — **не проверил** (лимит поиска). Допущение: аналогичный барьер (опыт, резидентный инженер).

### 1.3 Отношение к РФ-корням после 2022
- Банки ОАЭ: с осени 2023 г. крупные банки прекратили платежи в/из РФ и постепенно закрывают счета россиян и компаний, «facing risks of secondary sanctions» (Vedomosti через Moscow Times, 19.02.2024) — https://www.themoscowtimes.com/2024/02/19/uae-banks-limit-payments-with-russia-over-secondary-sanctions-threat-vedomosti-a84143 ; в июле 2024 ~30% российских предприятий в ОАЭ получили уведомления об ограничениях/закрытии счетов (УНН со ссылкой на разведку — источник ангажированный, цифра непроверяема) — https://unn.ua/en/news/uae-banks-close-accounts-of-russian-companies-intelligence . Названы FAB, Emirates NBD, ADCB как «largely purged their ties to Russia» (Modern Diplomacy, 20.02.2024) — https://moderndiplomacy.eu/2024/02/20/uae-banks-limit-business-with-russia-and-russian-clients/
- Обратная сторона: «Emirati state entities Edge Group and G42 have hired large numbers of Russian engineers» (CEPA, «UAE Throws Lifeline to Beleaguered Russian Tech Sector») — https://cepa.org/article/uae-throws-lifeline-to-beleaguered-russian-tech-sector/ (полный текст недоступен — 429; цитата из поискового резюме). Academic: «A new capital pipeline to the Gulf?…Russian exodus to the UAE», British Journal of Middle Eastern Studies, 2025 — https://www.tandfonline.com/doi/full/10.1080/13530194.2025.2559341 (не прочитан, 403).
- Вывод: **риск — операционный (KYC/банки/платежи), а не клиентский**. Юрлицо в ОАЭ с российскими паспортами в UBO — красный флаг для банков; юрлицо в третьей юрисдикции с не-РФ UBO и сотрудниками-резидентами — рабочая, но недоказанная конфигурация (допущение).
- Российские инжиниринговые компании, реально работающие в Заливе по сетям, — **не нашёл**. Найдено только: Rosatom (офис в Дубае, переговоры по АЭС) и рамочные меморандумы РФПИ/«Нацпроектстрой»/Lamar Arabia (ПМЭФ 2025, Interfax) — https://www.interfax.ru/forumspb/1094118 ; «Саудовская Аравия изучает российские технологии» (Ведомости, 09.07.2025) — https://www.vedomosti.ru/politics/articles/2025/07/09/1123048-saudovskaya-araviya-izuchaet-rossiiskie-tehnologii . Ни одного кейса «российское проектное бюро проектирует ПС для SEC/TRANSCO/Kahramaa» после 2022 не найдено.

---

## 2. Индия

- Рынок: 7 EPC-подрядчиков, эмпанелированных PGCIL под TBCB до 765 кВ; KEC — «EPC solutions on turnkey basis»; Techno Electric — «robust in-house design and engineering capabilities, encompassing electrical, structural, and civil». Источники: Bajel Projects — https://www.bajelprojects.com/power-transmission.html ; KEC — https://www.kecrpg.com/turnkey-epc-solutions ; Techno Electric — https://www.techno.co.in/business/transmission . Вывод: проектирование ПС в Индии — внутренняя функция EPC, внешним иностранным субпроектировщикам места нет по цене.
- **Ставки (ключевой тест):**
  - Substation Design Engineer, Индия: средняя ₹9,10 лакх/год ≈ ₹438/час (Glassdoor, 2025) — https://www.glassdoor.co.in/Salaries/substation-design-engineer-salary-SRCH_KO0,26.htm . При ₹85/$ (допущение) ≈ **$5,2/час зарплаты**.
  - Engineering Design skill, India: ₹350/час base (PayScale, обновлено 09.07.2026, n=39) — https://www.payscale.com/research/IN/Skill=Engineering_Design/Hourly_Rate ≈ $4/час.
  - Офшорный найм инженера-электрика из Индии: «Starting from Just US $8/Hour» (VirtualEmployee) — https://www.virtualemployee.com/services/engineers-architects/hire-electrical-engineer ; «from $7/hour» (Outsourced.co) — https://outsourced.co/india/roles-industries/engineering-architecture/electrical-engineer/
  - Рыночные ставки аутсорсинга в Индии 2026 (софт, но показательно): junior $25–45/час, senior $60–90/час (Classic Informatics, без внешнего источника) — https://www.classicinformatics.com/blog/outsourcing-to-india ; Everest Group: ~$28/час mid-level с маржой вендора (по поисковому резюме, первоисточник не открыт).
  - Проверка тезиса «$12–25/час у индийских бюро»: **подтверждено с запасом вниз** — реальные предложения от $7–8/час, зарплатная база $4–5/час.
- Вывод по Индии: **опровергает** ценность «ИИ-ускорения из-за рубежа» как продукта для индийского рынка: местный инженер дешевле любого ИИ-ускоренного зарубежного человеко-часа с накладными. Индия — не рынок сбыта, а **конкурент-ценовой якорь** для всех остальных рынков.

---

## 3. Бразилия / ЛатАм

- Спрос: 52 заявки на присоединение ЦОДов к базовой сети SIN (сер. 2025); ~1 ГВт установленной IT-мощности (кон. 2025); запросы к ONS могут достичь 13,7 ГВт к 2035; мегапроекты Scala IA City (до 4,75 ГВт), Rio IA City (1,5 ГВт), TikTok Pecém. Источник: Industrial Info Resources — https://www.industrialinfo.com/iirenergy/industry-news/article/brazil-consolidates-position-as-digital-hub-with-accelerated-data-center-expansion--353205 . Scala строит собственную ПС 560 МВт (SSUBTB03, Tamboré) — https://scaladatacenters.com/en/scala-data-centers-announces-the-groundbreaking-of-a-560-mw-power-substation-in-sao-paulo-a-game-changer-for-brazils-digital-infrastructure-landscape/ (проектировщик в релизе не назван — не нашёл).
- Барьер CREA/ART: временная регистрация иностранного инженера — только под «a specific work contract with a Brazilian company», макс. 2 года, нельзя владеть контрольной долей/управлять инженерной фирмой; постоянная — permanent visa + ревалидация диплома в бразильском вузе, «normally takes 2 to 3 years»; все документы — консульская легализация + присяжный перевод. Источник: The Brazil Business — https://thebrazilbusiness.com/article/how-to-obtain-a-registration-with-crea ; ART по Закону 6.496/77 — https://thebrazilbusiness.com/article/introduction-to-anotacao-de-responsabilidade-tecnica
- Местные проектировщики уже есть: Marte Engenharia (138–750 кВ), Quantum Engenharia (до 500 кВ), VVS Engenharia (230 кВ по стандартам CEMIG/ONS) — https://www.marteengenharia.com.br/negocios?lang=en ; https://quantumengenharia.com.br/solucoes/subestacoes-e-linhas-de-transmissao/ ; https://vvsengenharia.com/ . Уровень ставок бразильских инженеров — **не нашёл**.
- Отношение к РФ-происхождению: свидетельств отторжения не нашёл; позиция бразильских банков по РФ-платежам — **не проверил** (лимит поиска). Допущение: политического барьера нет, барьер — португальский язык, нормы ABNT/ONS Procedimentos de Rede, CREA-подпись.
- Вывод: рынок растущий, но полностью локализованный (язык, стандарты, ART). Вход — только субподряд у бразильского бюро/EPC; премия за ИИ не очевидна, локальные ставки неизвестны.

---

## 4. СНГ (Казахстан, Узбекистан)

- Казахстан, KEGOC: 66,7 млрд тенге инвестиций в 2025 г. «на СМР, закупку оборудования и разработку ПСД»; два проекта 500 кВ на 356 млрд тенге (~$686 млн) до 2027; локальное содержание 92% по материалам, 64% по ПС. Источники: primeminister.kz — https://primeminister.kz/en/news/major-investment-projects-of-kegoc-kazakhtelecom-and-samruk-energy-considered-at-economic-growth-headquarters-29918 ; Trend.az — https://www.trend.az/business/economy/4073827.html
- **Чеки ПСД (факт, ноябрь 2025, акимат Костанайской области):** ПС 110/10 кВ «Восточная» — 109 331 741 тенге; ПС 220 кВ «Юг» — 170 369 165 тенге; ПС 110/10 кВ «Сухой порт» — 70 902 523 тенге. Источник: «Наш Костанай», 25.11.2025 — https://old.top-news.kz/razrabotku-psd-novyh-jelektricheskih-podstancij-nachnut-v-kostanae/ . При 515 тенге/$ (допущение) — **$212k / $331k / $138k**. Это верхняя планка местного рынка (гостендер, полная ПСД с экспертизой).
- Кто проектирует для KEGOC: по проекту «Усиление сети Западной зоны» (50,4 млрд тенге) 11 договоров ПИР — ИП «Ешимкулов Н.Т.», ТОО «Мангистауэнергомонтажналадка», ТОО «СИТ-Строй». Источник: KEGOC — https://www.kegoc.kz/ru/about/investicionnye-proekty/154940/ . Т.е. проектные лоты выигрывают локальные малые ТОО/ИП — конкуренция по цене, не по технологиям.
- Лицензирование: проектирование электроснабжения ≥110 кВ лицензируется; для иностранных лиц в зачёт опыта идёт «равнозначный разрешительный документ» из своей юрисдикции. Источники: egov.kz — https://egov.kz/cms/ru/services/licensing/526pass_adszhkh ; dogovor24 — https://dogovor24.kz/questions/kakie_vidy_proektnoj_dejatelnosti_podlezhat_licenzirovaniju-143.html . У нового юрлица «равнозначного документа» нет → лицензия только через местное ТОО с аттестованными ГИПами.
- Узбекистан: собственные институты — «УзИнжиниринг» (до 500 кВ), АО «Sredazenergosetproekt» (500 кВ) — https://uzeng.uz/ru/about/ ; https://saesp.uz/ . Крупные объекты (Ташкент/Гузар/Сурхан 500 кВ — ВБ; Саримай 500 кВ — ЕБРР, open tender two stage, «works», закрыт 03.11.2025) закупаются как plant/works с проектированием в составе EPC — https://www.developmentaid.org/tenders/view/1311055/ ; https://ecepp.ebrd.com/delta/viewNotice.html?displayNoticeId=39422757 . ВИЭ ACWA/Masdar (>8 ГВт ACWA в УЗ; Masdar 300 МВт BESS Зарафшан к ПС Мурунтау) — https://www.intellinews.com/tiif-2026-masdar-and-acwa-power-twin-engines-behind-uzbekistan-s-renewable-energy-boom-449845/ ; https://renewablewatch.in/2025/11/13/masdar-to-develop-300-mw-bess-project-in-uzbekistan/ — кто проектирует их сетевую часть, **не нашёл** (допущение: китайские EPC с собственным проектированием).
- Российские институты в СНГ: конкретных экспортных кейсов 2024–25 **не нашёл** (поиск по «Энергосетьпроект/Россети/проектный институт» дал только внутрироссийские программы). Допущение: они там есть неформально (общий язык, СНиП/ПУЭ-наследие) — это ещё и означает, что «российское происхождение» здесь не преимущество, а норма и ценовой демпинг.
- **Юнит-экономика СНГ:** при чеке $0,13–0,33 млн и, допустим, 10–20 выигранных лотах/год — $1,5–5 млн выручки, при этом конкурировать надо с местными ТОО по тендерной цене (де-факто ниже указанных лимитов). Годовой пул ПИР KEGOC при доле ПСД 3–5% от 66,7 млрд тенге — 2–3,3 млрд тенге ≈ $4–6,5 млн **на всех**. Итог: **карман, не бизнес ≥$10 млн**.

---

## 5. ЮВА (Малайзия/Джохор, Индонезия, Вьетнам)

- Джохор: STACK 220 МВт (275 кВ TNB, on-site substation, Q4 2026) — https://www.stackinfra.com/about/news-press/press-releases/stack-infrastructure-announces-220mw-campus-in-malaysia/ ; Vantage — двойной ввод 275 кВ — https://vantage-dc.com/data-center-locations/apac/johor-malaysia ; Yondr — 300+ МВт через ПС 275 кВ по ESA с TNB, от входа на рынок (03.2022) до энергизации (03.2024) — 2 года — https://www.yondrgroup.com/newsroom/press-release/yondr-group-powers-up-its-first-data-center-campus-in-malaysia-within-two-years-of-market-entry/ . Ни в одном релизе проектировщик сетевой части не назван — **не нашёл**. TNB ведёт «One-Stop-Centre» для гиперскейлеров — https://www.itnews.asia/feature/tnbs-one-stop-centre-meets-hyperscale-data-centres-power-demands-in-malaysia-607526 (партнёрский контент).
- Регуляторика Малайзии (важно): «foreign (ASEAN) equity up to 30% of joint ventures… foreign directorship is prohibited»; временная регистрация иностранного инженера ≤1 года под конкретный проект; **«There is no restriction under cross border supply and consumption abroad; however this service must be authenticated by the relevant registered professionals in Malaysia»**. Источник: Azmi & Associates — https://www.azmilaw.com/insights/legal-framework-of-registration-of-engineering-consulting-business-in-malaysia/ ; BEM — https://bem.org.my/Landing/register . Это единственный найденный регион, где кросс-бордер поставка проектных услуг прямо разрешена (с местной подписью) — совпадает с моделью гипотезы.
- Вьетнам: PECC1/2/3 (структуры EVN) — «leading consulting company… entrusted by investors and EVN for designing… transmission lines and substations»; иностранные консультанты (Fichtner) привлекаются для design verification — https://en.evn.com.vn/d6/news/Pride-of-Viet-Nams-Power-Engineering-Consulting-sector-66-163-1181.aspx ; https://www.pecc1.com.vn/d4/news/EVNPECC1-55-years-of-establishment-and-development--8-1944.aspx . Вывод: сетевую часть проектируют госинституты по внутренним ставкам; внешний вход — только как верификатор/специалист.
- Индонезия: PLN Enjiniring — инжиниринговое плечо PLN — https://plne.co.id/website/en/ ; Batam: DayOne 450 МВт PPA с PLN Batam (поставка 2026–27) — https://www.datacenterdynamics.com/en/news/dayone-inks-450mw-ppa-with-pln-batam-to-power-planned-data-center-in-batam-indonesia/ ; «Global engineering firms are forming joint teams with domestic specialists» (PetroRaya, вторичный) — https://www.petroraya.com/article/indonesias-data-center-boom-meets-an-energy-reality/
- Отношение к РФ-происхождению в ЮВА: свидетельств барьера не нашёл (Вьетнам/Индонезия/Малайзия к санкциям не присоединялись — общеизвестно, отдельный источник не приводится).
- Вывод: Малайзия — формально самый открытый для кросс-бордера рынок, но объём: ~10–15 крупных кампусов в Джохоре с одной-двумя ПС 275 кВ каждый на горизонте 3–4 лет (допущение по перечню datacentermap, 43 объекта) → 5–10 сетевых проектов в год на весь рынок, и их уже обслуживают сингапурские/малайзийские консультанты (Surbana Jurong, Cundall, Aurecon — по профилям компаний; конкретные назначения не нашёл).

---

## 6. Юнит-экономика: чек × поток

### 6.1 Чек detailed design подстанции/подключения
| Рынок | Данные | Источник |
|---|---|---|
| США (бенчмарк) | Engineering + environmental + testing&commissioning = **3% от стоимости проекта**; PM 5,5%; A&G 1,5%. Новая ПС 345 кВ: 4 позиции ring bus $15,8M; 6 позиций breaker-and-a-half $26,9M; 6 позиций double-breaker $32,3M → инженерный пакет **$0,47–0,97M**, из них чистое проектирование меньше (допущение: 50–70%) | MISO Transmission Cost Estimation Guide MTEP24, 01.05.2024, стр. 6–7 и табл. 4.2 — https://cdn.misoenergy.org/20240501%20PSC%20Item%2004%20MISO%20Transmission%20Cost%20Estimation%20Guide%20for%20MTEP24632680.pdf |
| Казахстан | ПСД ПС 220 кВ — 170,4 млн тенге (~$331k); ПС 110/10 кВ — 70,9–109,3 млн тенге (~$138–212k) | «Наш Костанай», 25.11.2025 — см. §4 |
| Залив / Индия / ЮВА / Бразилия | Прямых цифр по чеку **не нашёл**. Допущение: между СНГ и США — $0,15–0,5M за полный detailed design ПС 132–380 кВ; для сетевого подключения ЦОДа 100–300 МВт (ПС 132/275 кВ + ввод) — $0,3–0,8M | допущение |

### 6.2 Поток проектов
- Саудовская Аравия: ~100 передающих ПС/год энергизировано (45 за 9М2025 + 28 за Q1 2026 — SE Earnings). Плюс ЦОД-подключения: реальный темп ввода 94–108 МВт/год ЦОД-мощности (vision2030.ai) — это 1–3 кампуса в год, не десятки.
- Бразилия: 52 заявки ЦОД на присоединение к SIN (сер. 2025) — на несколько лет.
- Джохор: 5–10 сетевых проектов/год (допущение, §5).
- Казахстан: единицы–десятки ПСД-лотов/год, локальные тендеры.

### 6.3 Сходится ли $10 млн
- При среднем чеке $0,25M → 40 проектов/год; при $0,15M → 67; при $0,5M → 20.
- Даже самый ёмкий рынок (КСА, ~100 ПС/год) требует захвата **20–40% годового ввода** — при том что проектирование сидит внутри EPC-турнкей (L&T, MIS, местные) и у эмпанелированных SEC-консультантов с SCE-печатью. Для нового субподрядчика без лицензии и референсов это нереалистично в горизонте 3–4 лет.
- **Ценовой потолок:** конкурент по субподряду — индийский офшор $8–30/час (§2). При 100%-й ИИ-эффективности (2× скорость) наш человеко-час всё равно должен продаваться ≤ $30–40, чтобы быть конкурентным у EPC → выручка на инженера ≤ $60–80k/год → $10 млн = **125–170 инженеров** в загрузке (допущение: 2 000 оплачиваемых часов). Это не «маленькая команда с ИИ-ядром».
- Порог: **путь к ≥$10 млн не виден.** Виден путь к $1–3 млн/год (10–20 проектов у 1–2 якорных EPC).

---

## 7. Продажи: как получают первые контракты и сколько до первого чека
- Каналы (по найденным фактам): (а) субподряд у EPC — единственный реальный канал в КСА/ОАЭ/Индии, т.к. проектирование в составе турнкей (L&T, MIS, KEC); (б) IFI-тендеры в СНГ — но там закупают «works/plant» с проектированием внутри EPC, а консультанты нанимаются для оценки заявок/надзора с требованиями к опыту (ADB PAM 52322-004 — https://www.adb.org/sites/default/files/project-documents/52322/52322-004-pam-en_0.pdf , не прочитан — 403); (в) рамки с девелоперами ЦОД — проектировщик сетевой части в релизах не называется, решение принимает EPC/владелец с местным консультантом.
- Длительность цикла: «the full cycle from initial introduction to substantial project work can be six months or longer… trial orders» — Qimtek, «Understanding the Engineering Sales Cycle» — https://www.qimtek.co.uk/blog/understanding-engineering-sales-cycle ; кейс инженерной компании, вышедшей на UK через партнёра: заказ в 2005, «within 4 years… exporting over €1M» — Copernicus Consulting — https://www.copernicus-consulting.com/international-case-studies/ ; девелопер Yondr: 2 года от входа в Малайзию до энергизации (§5).
- Оценка (допущение на базе выше): первый субподрядный чек — 6–12 мес. после появления местного партнёра-подписанта; выход на $1M/год — 2–4 года; специфических данных по «субпроектировщик из третьей страны у EPC в Заливе» — **не нашёл**.

---

## 8. Что опровергает утверждение, что — нет

**Опровергает / ослабляет:**
1. Ни в одном из 5 регионов новый иностранный бюро не может подписывать проект сам (Саудия 10 лет + 4 страны; Малайзия ≤30%/без иностранных директоров; Бразилия CREA только под контракт; Казахстан лицензия). «Партнёр-подписант» — обязателен, а не опция → маржа и канал не свои.
2. Ценовой якорь Индии ($4–5/час зарплата, $8/час офшор) убивает премию за «ИИ-ускорение» во всех регионах, где закупщик — EPC.
3. Ни одного публичного кейса российского проектного бюро на сетевых объектах Залива/ЛатАм/ЮВА после 2022 не найдено; UAE-банки де-рискают РФ-нексус.
4. Чеки ($0,13–0,33M в СНГ; ~3% от CAPEX в США) × реалистичный поток (10–20 проектов/год у нового субподрядчика) = $1,5–5M, не $10M.
5. NEOM как источник спроса урезан на 60%, The Line заморожен.

**Не опровергает:**
1. Спрос в КСА (100 ПС/год, $15 млрд контрактов/год) и в ЦОД-кампусах (HUMAIN 6,6 ГВт-пайплайн, Джохор, Бразилия 52 заявки) — реален и растёт.
2. Малайзия прямо допускает кросс-бордер проектирование с местной аутентификацией; ОАЭ-госструктуры нанимают российских инженеров — «происхождение команды» само по себе не блокирует.
3. Узкое место в ЦОДах — именно сетевое подключение («2,000 MVA bulk supply point»; «lenders want to know when a facility will receive power») — боль совпадает с продуктом.

---

## 9. Что не нашёл / что надо проверить руками (первые дешёвые шаги)
- Ставки/чеки проектирования ПС в КСА/ОАЭ/Малайзии/Бразилии (нет публичных данных) → 3–5 интервью с BD у L&T PT&D, MIS, местных SCE-консультантов, Surbana Jurong.
- Кто проектирует сетевую часть Джохор-кампусов (STACK/Yondr/Vantage) — запросить у TNB One-Stop-Centre/девелоперов.
- Позиция банков ОАЭ/КСА к юрлицу третьей страны с РФ-гражданами в штате (без РФ UBO) — консультация комплаенса 2 банков.
- Требования Dubai Municipality/ADM к консалтинговой лицензии (не проверено).
- Готов ли хотя бы один EPC в Заливе дать white-label поток ≥20 ПС/год — единственный сценарий, где $10M становится видимым.
