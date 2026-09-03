# Праймы Индии (+ ЦА/ЮВА) для white-label субподряда в электросетевом проектировании

Дата: 02.09.2026. Роль: исследователь-скептик. Метод: веб-поиск + чтение первоисточников (≈30 запросов + выгрузки). Всё непроверенное помечено «не нашёл» или «допущение».

**Валютное допущение по всему файлу: ₹87/$** (для сопоставимости с остальными файлами библиотеки; сами источники местами считают по другому курсу — где так, помечено).

---

## 0. Вердикт до таблицы (главное, чтобы не терять время)

1. **Поток работы в Индии есть и он огромный.** ICRA: ₹5–6 трлн ($57–69 млрд) капекса в передаче за FY27–FY32, нужно +20 000 ckm линий и +120 ГВА подстанционной мощности **в год** ([ICRA via SolarQuarter, 13.07.2026](https://solarquarter.com/2026/07/13/indias-power-transmission-sector-to-see-%E2%82%B95-6-trillion-capex-by-fy32-amid-renewable-energy-expansion-icra/)).
2. **Дефицит исполнения задокументирован.** ICRA прямо называет «нехватку квалифицированных кадров» одним из трёх ограничителей; только **12 %** проектов TBCB, введённых к марту 2026, уложились в срок, медианная просрочка **>10 месяцев** (там же).
3. **НО ставочная арифметика идёт против нас.** Загруженная себестоимость индийского проектировщика подстанций — **≈$12–15/час** (расчёт из ₹9,1 лакх средней зарплаты, §8). Продать российскую команду в индийского прайма дороже этого нельзя, а дешевле — незачем. **Индия как «дешёвый рынок сбыта проектных часов» не работает; Индия работает как канал к западному конечному заказчику и как место, где нашу экономику надо строить не на часах, а на выпуске (за чертёж/за комплект/за срок).**
4. **Западная экспозиция закрывает половину списка.** KEC (SAE Towers в США/Мексике/Бразилии, 55 % выручки — экспорт), Kalpataru (Швеция, Бразилия, Ближний Восток), Apar (29,8 % экспорт, США +83 % по проводу), Skipper (монополи в Северную Америку) — у всех клиенты, чьи комплаенс-требования делают российского субподрядчика токсичным. Относительно «чистые» по этому критерию — **Techno Electric, Adani Energy Solutions (свои риски, см. §9), Transrail, госструктуры и штатные трансco, застройщики ЦОД**.
5. **Крупные GCC (WSP, Burns & McDonnell, Jacobs, Cyient, Quest Global) — это КОНКУРЕНТЫ, а не канал.** Они уже сидят внутри западных заказчиков и уже забрали офшорную маржу. Заходить к ним с российской командой = предлагать им перепродавать нашу мощность их же клиентам, у которых нас не пропустит комплаенс.
6. **Реалистичная точка входа — не «прайм вообще», а конкретный узел: проектная перегрузка у EPC второго эшелона и у застройщиков ЦОД/ВИЭ**, где срок дороже цены и где нет прямого западного конечного заказчика.

---

## 1. Макро: почему поток есть

| Показатель | Значение | Источник |
|---|---|---|
| Капекс передачи Индии FY27–FY32 | **₹5–6 трлн** (~$57–69 млрд) | [ICRA/SolarQuarter, 13.07.2026](https://solarquarter.com/2026/07/13/indias-power-transmission-sector-to-see-%E2%82%B95-6-trillion-capex-by-fy32-amid-renewable-energy-expansion-icra/) |
| Требуемый темп | **20 000 ckm/год** линий, **120 ГВА/год** подстанций | там же |
| Проекты TBCB в срок (к 03.2026) | **12 %**; медианная просрочка **>10 мес.**, разброс 2 мес. – 3 года | там же |
| Ограничители по ICRA | «limited manufacturing capacity, **shortages of skilled manpower**, supply chain constraints» | там же |
| ISTS-схемы с просрочкой ≥1 года | ~1 из 4 | там же |
| Отраслевой спикер | Ankit Jain, Vice President & Co-Group Head, ICRA | там же |
| ЦОД: живая мощность / пайплайн | **1,5–1,6 ГВт** live → **1,7–2,0 ГВт** к концу 2026; пайплайн **8,33 ГВт** | [CRN Asia, 2026](https://www.crnasia.com/india/news/2026/india-s-data-centre-capacity-crosses-1-5-gw-as-metro-hubs-drive-growth), [Business Today, 13.04.2026](https://www.businesstoday.in/technology/news/story/indias-data-centre-capacity-set-to-reach-2gw-by-2026-backed-by-30-billion-in-investments-report-525381-2026-04-13), [Let's Data Science](https://letsdatascience.com/news/india-expands-data-centre-pipeline-to-833-gw-f72ff281) |
| ЦОД по городам (пайплайн) | Мумбаи 3,75 ГВт, Хайдарабад 1,93 ГВт, Ченнаи — след. | там же |
| ER&D-экспорт Индии FY26 | **$63 млрд**, прогноз >$100 млрд к 2030 | [Nasscom via ANI, 01.09.2026](https://aninews.in/news/business/indias-engineering-rampd-services-revenue-to-cross-usd-100-billion-by-2030-nasscom20260901131015/) |
| GCC в Индии FY26 | **2 117 компаний / 3 728 юнитов**, 2,36 млн чел., $98,4 млрд | [Zinnov–Nasscom GCC Landscape 2026](https://zinnov.com/centers-of-excellence/zinnov-nasscom-india-gcc-landscape-2026-report/) |

**Важная оговорка (честно):** единственный публично найденный «человеческий» дефицит, названный отраслевым топом, — это **монтажники опор**, а не проектировщики. Д-р Nilesh Kane (Chief – T&D, Tata Power): «getting manpower for transmission tower erection is challenging», бригады сконцентрированы в Западной Бенгалии и Джаркханде ([T&D India](https://www.tndindia.com/we-are-addressing-supply-chain-challenges-through-better-planning-and-coordination-tata-power/)). Прямых публичных заявлений индийских праймов «нам не хватает проектировщиков» — **не нашёл**. Косвенный сигнал вместо них — открытые вакансии в проектных отделах (§3).

---

## 2. Группа 1. Крупные T&D EPC (кто перегружен и мог бы отдать проектирование)

### 2.1 KEC International (RPG Group)
- **Владелец/страна:** RPG Group, Индия (публичная, NSE/BSE). Сайт: kecrpg.com
- **Размер FY26:** выручка **₹23 506 крор** (~$2,70 млрд), рекорд ([Business Upturn](https://www.businessupturn.com/business/kec-international-reports-record-rs-23506-crore-revenue-for-fy26/), [India IPO](https://www.indiaipo.in/news/detail/kec-international-reports-record-fy26-revenue-profitability-and-order-intake)). Численность — не нашёл проверяемой цифры.
- **Портфель:** заказ-книга на 31.03.2026 — **₹36 267 крор** (~$4,17 млрд), с L1 >₹40 000 крор; приток заказов FY26 — **₹25 280 крор**, рекорд ([Construction World](https://www.constructionworld.in/policy-updates-and-economic-news/kec-reports-highest-ever-revenues-order-intake-and-profitability/91878)). Q1 FY27: выручка ₹5 024 крор, OB+L1 >₹40 000 крор на 30.06.2026 ([EQ Mag](https://www.eqmagpro.com/kec-international-reports-%E2%82%B95024-crore-q1-fy27-revenue-order-book-and-l1-position-cross-%E2%82%B940000-crore-eq/)).
- **T&D отдельно:** приток FY26 **₹17 700 крор**; неисполненная T&D-книга с L1 **₹25 200 крор** на 26.05.2026; выручка T&D FY26 **₹15 883 крор**, +24 % г/г; ~62 % всей книги ([T&D India](https://www.tndindia.com/kec-international-reports-unexecuted-order-book-of-over-rs-40000-crore/)).
- **Признаки нехватки мощности:** активный найм в T&D India по всей стране — но по функциям **PM, construction, planning, survey, quality, EHS, commercial, field engineering**, т.е. стройка, **не проектирование** ([Construction Placement, 2026](https://constructionplacement.org/kec-international-hiring-2026-project-manager-construction-manager/)). Публичных заявлений о нехватке проектных ресурсов — не нашёл.
- **Западная экспозиция: ВЫСОКАЯ.** 55 % выручки — международная (MENA, SAARC, Americas, APAC); дочка **SAE Towers Holdings LLC** (Монтеррей, Мексика + Белу-Оризонти, Бразилия, 123 200 т), крупные поставки опор в США ([Wikipedia/KEC](https://en.wikipedia.org/wiki/KEC_International), [KEC](https://www.kecrpg.com/towermanufacturing)).
- **ЛПР (опубликовано):** **Vimal Kejriwal** — MD & CEO ([LinkedIn](https://in.linkedin.com/in/vimalkejriwal)); **Rajinder Gupta** — Chief Executive T&D India & Sri Lanka (по вторичному источнику [theorg](https://theorg.com/org/kec-international-ltd/teams/leadership-team) — **проверить перед использованием**).
- **Как заходить:** публичного vendor-портала для инжиниринговых услуг **не нашёл**; исторически регистрация поставщика идёт через отдел закупок. Через RPG-корпоративный канал / отраслевые площадки.
- **Оценка для нас:** поток огромный, но комплаенс-профиль (США/Бразилия/Мексика) делает нас проблемным вендором. **Низкий приоритет.**

### 2.2 Kalpataru Projects International (KPIL)
- **Владелец/страна:** Kalpataru Group, Индия (публичная). Сайт: kalpataruprojects.com
- **Размер FY26:** выручка **₹27 143 крор**, +22 % г/г (источник компании называет $2,8 млрд — курс у них иной, флаг) ([Quartr Q1 26/27](https://quartr.com/events/kalpataru-projects-international-kpil-q1-26-27_F4LEDVcw), [Kalpataru](https://kalpataruprojects.com/about-us)).
- **Портфель:** OB **₹63 287 крор** ($6,9 млрд по их курсу) на 31.03.2026; на 30.06.2026 — **₹66 607 крор**, из них T&D **₹29 609 крор** (44 %) ([T&D India](https://www.tndindia.com/kalpataru-projects-international-reports-10-per-cent-growth-in-power-td-revenue/)). T&D-книга росла на 30 % г/г, выручка T&D +56 % г/г в FY26.
- **Признаки нехватки проектной мощности: САМЫЙ ЧЁТКИЙ В ВЫБОРКЕ.** Открытые вакансии **Manager / Deputy Manager – Design (Civil & Electrical)** под проекты GIS & AIS подстанций, локации **Нойда и Вадодара**, опыт 5–10 лет, публикация 22.07.2026 ([Construction Placement](https://constructionplacement.org/kalpataru-projects-international-limited-recruitment-2026-7/)). Это буквально те роли, которые мы предлагаем закрыть.
- **Западная экспозиция: ВЫСОКАЯ.** Дочки **Linjemontage i Grästorp AB** (Швеция, 85 %) и **Fasttel Engenharia** (Бразилия); заявленный фокус роста — «Middle East and the Nordics» ([Kalpataru Power](https://kalpatarupower.com/major-operating-subsidiaries/), [Realty n More](https://realtynmore.com/kalpataru-projects-international-secures-new-order/)).
- **ЛПР (опубликовано):** **Manish Mohnot** — MD & CEO ([Bloomberg](https://www.bloomberg.com/profile/person/15423694)). Контакт по найму в проектный отдел: `santosh.kumar@kalpataruprojects.com` — **опубликован на агрегаторе вакансий, не на сайте компании; проверить перед контактом**.
- **Как заходить:** **есть работающий вендор-портал: `https://vendorconnect.kalpatarugroup.com/Registration/Index`** (регистрация с OTP по e-mail и телефону).
- **Оценка:** лучший «сигнал спроса» из группы 1, но нордическо-бразильская экспозиция + шведская дочка = серьёзный комплаенс-фильтр. **Средний приоритет, заходить через индийский домашний T&D-периметр, не через группу.**

### 2.3 L&T Power Transmission & Distribution (Larsen & Toubro)
- **Владелец/страна:** L&T, Индия (публичная). Сайт: larsentoubro.com
- **Размер FY26 (группа):** заказ-книга **₹740 327 крор** (~$85 млрд), +28 % г/г; выручка **₹285 874 крор** (~$32,9 млрд), +12 % ([пресс-релизы L&T](https://www.larsentoubro.com/pressreleases/2026/2026-05-13-lt-wins-orders-significant-for-power-transmission-distribution-business)).
- **Портфель PT&D:** серия крупных заказов FY26 — «₹5 000–10 000 крор» пакет по Индии и Ближнему Востоку; отдельный «₹1 000–2 500 крор» на 380 кВ + два 132 кВ ПС; на Ближнем Востоке — 5 подстанций и >250 км ВЛ «под ключ» ([EQ Mag](https://www.eqmagpro.com/lt-secures-%E2%82%B95000-10000-crore-power-transmission-orders-across-india-and-the-middle-east-eq/), [L&T](https://www.larsentoubro.com/pressreleases/2026/2026-02-25-lt-wins-orders-major-in-india-and-abroad-for-power-transmission-infrastructure)).
- **Признаки нехватки:** **EDRC (Engineering Design & Research Centre)** — собственный проектный центр L&T (Ченнаи, Дели, Калькутта, Шарджа) — **открыто набирает** Lead Design Engineer (Primary), Design Lead – Secondary (Substation), Lead/Design Engineer Civil & Structural (STAAD Pro), BIM Modeller (Revit) в Ченнаи, Фаридабаде и Хайдарабаде, публикация 22.07.2026 ([Construction Placement](https://constructionplacement.org/lt-power-transmission-distribution-recruitment-2026/), [EDRC PT&D](https://eip.lntecc.com/homepage/PTD/edrc.html)).
- **Практика внешнего проектирования:** L&T EDRC — **инсорсер и сам продаёт инжиниринг**, т.е. скорее конкурент нам. Публичных примеров закупки L&T внешнего детального проектирования — **не нашёл**.
- **Западная экспозиция:** Ближний Восток + СНГ-нейтральные рынки; прямой западной клиентуры в PT&D меньше, чем у KEC/Kalpataru, но L&T как группа глубоко завязан на западные финансирование и заказчиков. **Средне-высокая.**
- **ЛПР:** публично раскрытого имени руководителя EDRC PT&D — **не нашёл**. На агрегаторе указан контакт для откликов `Mohammed.taj@Intecc.com` (домен явно с опечаткой — вероятно `lntecc.com`; **не использовать без проверки**).
- **Оценка:** гигант с собственным проектным заводом. **Как заказчик — маловероятно; как эталон конкурента и как источник кадровой рыночной цены — полезен.**

### 2.4 Techno Electric & Engineering (TEECL)
- **Владелец/страна:** семья Gupta/Saraiya, Индия (публичная). Сайт: techno.co.in
- **Размер FY26:** заказ-книга **₹9 566 крор** (₹95 665 млн; ~$1,10 млрд) = **2,9× выручки FY26**; цель FY27 — выручка ₹4 000 крор ([инвест-презентация Q4 FY26](https://www.techno.co.in/public/uploads/2/2026-05/teecl_investor_presentation_q4_fy26.pdf), [Sahi](https://www.sahi.com/news/techno-electric-aims-for-4-000-crore-fy27-revenue-supported-by-11-000-crore-order-book-3904-PE1_COR)).
- **Портфель:** в Q1 FY26 сдал подстанции на **17 площадках**, план — **>20 подстанций 220–765 кВ** за остаток FY26; EPC-заказы в передаче ~**₹7 120 крор** на 30.06.2025 ([T&D India](https://www.tndindia.com/techno-electric-eyeing-rs-2500-crore-annual-order-inflow-from-power-transmission/)). Плюс собственный ЦОД-бизнес: 1-я очередь в Ченнаи введена в FY26, далее Нойда и Калькутта, цель 15–20 МВт к 12.2027.
- **Признаки нехватки:** книга 2,9× выручки при плане >20 подстанций в год — **структурная перегрузка по определению**. Публичных заявлений о найме проектировщиков — не нашёл.
- **Практика внешнего проектирования:** компания подчёркивает **«robust in-house design and engineering capabilities»** (электрика, конструкции, гражданка) ([Techno](https://www.techno.co.in/business/transmission)) — т.е. официально всё внутри. Это одновременно и барьер, и зацепка: у них есть внутренний отдел, которому можно продать «переливной клапан».
- **Западная экспозиция: НИЗКАЯ** — бизнес преимущественно индийский (PGCIL, штатные трансco, свои ЦОД). Публично раскрытых западных конечных заказчиков — не нашёл.
- **ЛПР (опубликовано):** **P. P. Gupta** — Managing Director; **Ankit Saraiya** — Director & President/CEO; **Sujoy Ray** — Group President ([команда TEECL](https://www.techno.co.in/about/team), [Craft.co](https://craft.co/techno-electric-engineering-company/executives)).
- **Оценка:** **лучший профиль риска в группе 1** — перегружен, домашний, с собственным проектным отделом, который физически не может закрыть 20+ подстанций в год без внешних рук.

### 2.5 Adani Energy Solutions (AESL)
- **Владелец/страна:** Adani Group, Индия (публичная). Сайт: adanienergysolutions.com
- **Портфель:** строящийся передающий портфель **₹71 779 крор** (~$8,25 млрд) на конец FY26; в Q1 FY26 — ₹59 304 крор; заказ-книга обсуждается на уровне ~₹85 000 крор ([Tradebrains](https://tradebrains.in/indian-markets/85000-cr-order-book-can-strong-order-inflows-turn-adani-energy-solutions-into-a-bigger-power-transmission-player-12443625), [Adani Q1 FY26](https://www.adani.com/newsroom/media-releases/adani-energy-solutions-records-solid-performance-in-q1-fy26)).
- **Капекс:** план FY26 **₹17 000–18 000 крор**, из них ₹12 000–13 000 крор в передачу ([EQ Mag](https://www.eqmagpro.com/adani-energy-solutions-plans-%E2%82%B916000-18000-crore-investment-for-fy26-to-boost-transmission-and-smart-metering-eq/)).
- **Сеть:** 26 696 ckm, 55,5 лакх умных счётчиков установлено (Q1 FY26).
- **Признаки нехватки:** размер строящегося портфеля относительно собственного инжиниринга; конкретных публичных вакансий проектировщиков — не нашёл.
- **Западная экспозиция: формально низкая, фактически — особый риск.** Группа находится под юридическим давлением в США (обвинения Минюста/SEC 2024 г.), из-за чего её комплаенс к контрагентам с санкционным профилем скорее ужесточён, а не смягчён. **Допущение** (прямого подтверждения политики по российским субподрядчикам не нашёл).
- **ЛПР:** публично раскрытого руководителя инжиниринга AESL — **не нашёл**.
- **Оценка:** объём есть, вход тяжёлый. **Средний приоритет.**

### 2.6 Transrail Lighting
- **Портфель FY26:** приток заказов **₹8 520 крор** (T&D — 89 %); заказ-книга на 31.03.2026 **₹16 361 крор** (~$1,88 млрд) с L1, +12 % г/г, доля T&D **92 %**; выручка +30 %, PAT +28 % ([T&D India](https://www.tndindia.com/transrail-lighting-records-over-rs-8500-crore-order-inflow-in-fy26/), [Transrail](https://transrail.in/press-release/transrail-delivers-stellar-fy26-performance-with-30-revenue-growth-and-28-pat-growth/), [IPO Central](https://ipocentral.in/transrail-lighting-q4-fy26-results/)).
- **Западная экспозиция:** экспорт в Африку/Юго-Восточную Азию/Ближний Восток; западных конечных заказчиков публично — не нашёл. **Низкая-средняя.**
- **Оценка:** чистый T&D-игрок среднего размера с быстрым ростом — то есть максимальная вероятность проектного «узкого горла». **Кандидат в шорт-лист.**

### 2.7 Skipper Limited и Apar Industries — оговорка
Оба — **производители, а не покупатели проектирования**, и оба продают на Запад:
- **Skipper**: «от Tower Design Services до монтажа», первая индийская компания, поставившая монополи в Северную Америку, крупнейший в истории заказ от «top-tier utility» в Северной Америке; экспорт 12M FY26 — **₹710 крор**, 16 % выручки инжинирингового сегмента ([Skipper](https://www.skipperlimited.com/engineering/transmission-towers/1), [US Skipper](https://us.skipperlimited.com/about)). **Skipper продаёт tower design — это конкурент, а не клиент.**
- **Apar**: выручка FY26 **₹22 902 крор** (~$2,63 млрд), +23,3 %; доля экспорта **29,8 %**; выручка от рынка США **+55,2 %**, по проводам **+83 %** г/г ([Quartr](https://quartr.com/events/apar-industries-limited-aparinds-q4-25-26_F6sCVgPy), [T&D India](https://www.tndindia.com/apar-industries-conductor-business-enjoys-24-per-cent-order-inflow-growth-in-fy26/)).
**Вывод: обе — не наши клиенты. Исключить.**

### 2.8 Tata Projects — активно нанимает в T&D
Публикация 22.08.2026: набор по T&D-дивизиону по всей Индии — Project Manager, Site Planning, Section In-Charge, Site Engineer, Surveyor, EHS, QA/QC ([Construction Placement](https://constructionplacement.org/tata-projects-jobs-2026-transmission-line-substation-electrical-civil-vacancies/)). Опубликованные контакты для откликов: `bhuvaneshp@tataprojects.com`, `abhishek.dubey@tataprojects.com` (**агрегатор, не сайт компании — проверить**). **Проектных ролей в списке нет** — снова стройка. Заказ-книгу Tata Projects по T&D за FY26 — **не нашёл**.

### 2.9 Sterlite Power → Resonia / Sterlite Electric
Демерджер завершён: **Resonia** (бывш. Sterlite Grid 5) — инфраструктура передачи (BOT), **Sterlite Electric** — кабели/провода/OPGW ([Precize](https://www.precize.in/blogs/sterlite-power-demerger-sterlite-electric-grid-5)).
- **Resonia:** ожидаемая выручка FY26 ~**₹6 500 крор** (~$747 млн); заявленный план инвестиций **₹1 лакх крор (~$11,5 млрд) к FY32**; ЛПР — **Pratik Agarwal, Chairperson** ([Resonia](https://www.resonia.com/updates/resonia-betting-big-on-power-transmission-to-invest-rs-1-lakh-crore-by-fy32-chairperson-pratik-agarwal)). Выиграла TBCB-проекты: Rajasthan REZ Ph-IV (Bikaner, ~8 ГВт эвакуации) и Ananthapur-II REZ Ph-I ([Sterlite Electric PR](https://www.sterliteelectric.com/category/press-release)).
- **Sterlite Electric:** заказы Q1 (апр–июн) ₹1 500 крор; FY25 суммарно ₹7 500 крор ([Energetica India](https://www.energetica-india.net/news/sterlite-electric-bags-inr-2400-cr-in-q4-orders-fy25-total-surges-to-inr-7500-cr)).
- **Западная экспозиция:** бразильские активы исторически в периметре Sterlite; сейчас после демерджера — **не нашёл** ясной картины. Флаг.
- **Оценка:** ₹1 лакх крор капекса к FY32 при выручке ₹6 500 крор — это разрыв, который нечем закрыть внутренними ресурсами. **Кандидат в шорт-лист.**

---

## 3. Сигналы проектной перегрузки — что реально нашлось

| Компания | Сигнал | Тип роли | Дата | Источник |
|---|---|---|---|---|
| **L&T PT&D / EDRC** | 6 открытых проектных ролей: Lead Design Primary; Design Lead Secondary; Lead/Design Civil & Structural (STAAD); BIM Modeller (Revit); PEM Electrical | **Проектирование** | 22.07.2026 | [ConstructionPlacement](https://constructionplacement.org/lt-power-transmission-distribution-recruitment-2026/) |
| **Kalpataru (KPIL)** | Manager/Dy. Manager – Design (Civil + Electrical), GIS/AIS ПС, Нойда и Вадодара, 5–10 лет | **Проектирование** | 22.07.2026 | [ConstructionPlacement](https://constructionplacement.org/kalpataru-projects-international-limited-recruitment-2026-7/) |
| **Tata Consulting Engineers** | набор под проекты ВЛ и ПС в Гуджарате | смешанный | 2026 | [ConstructionPlacement](https://constructionplacement.org/tata-consulting-engineers-recruitment-2026-4/) |
| **Tata Projects** | T&D-дивизион, 10 типов ролей, «multiple locations across India» | стройка | 22.08.2026 | [ConstructionPlacement](https://constructionplacement.org/tata-projects-jobs-2026-transmission-line-substation-electrical-civil-vacancies/) |
| **KEC International** | T&D India, PAN India, PM/construction/planning/QA/EHS | стройка | 2026 | [ConstructionPlacement](https://constructionplacement.org/kec-international-hiring-2026-project-manager-construction-manager/) |
| Рынок в целом | ~272 вакансии «substation design» на Naukri | проектирование | 08.2026 | заголовок [Naukri](https://www.naukri.com/substation-design-jobs) (страница отдаёт 403 при выгрузке — цифра из поисковой выдачи, **проверить вручную**) |

**Чтение сигнала:** проектные вакансии есть у **L&T EDRC и KPIL**, у остальных — стройка. Это значит, что «нехватка проектной мощности» в Индии на публичном уровне подтверждается **точечно, а не отраслево**. Не преувеличивать в питче.

---

## 4. Группа 2. Офшорные инженерные центры в Индии — канал или конкурент?

**Короткий ответ: конкурент. Все пятеро.** Они и есть тот самый «дешёвый офшорный проектный ресурс», которым мы хотим быть, только уже внутри западного заказчика, с его стандартами, его страховкой и его PE-подписью.

| Центр | Масштаб в Индии | Что делает в сетях | Западные заказчики | Вывод |
|---|---|---|---|---|
| **WSP GCC India** (+ POWER Engineers) | **5 500+** в GCC; WSP India 6 014 чел. на 03.2026, +53,8 % с 2023 ([Revelio](https://www.reveliolabs.com/companies/wsp-india/employees)) | проектирование ВЛ, электрические расчёты для utility и промышленных клиентов ([WSP India](https://www.wsp.com/en-in/hubs/power)) | Да, целиком | **Прямой конкурент.** POWER Engineers (+4 000 чел.) интегрирован в WSP ([WSP](https://www.wsp.com/en-us/news/2026/wsp-completes-integration-with-power-engineers)); WSP также покупает TRC за **$3,3 млрд** ([ENR](https://www.enr.com/articles/62232-wsp-aims-for-power-market-boost-in-33b-deal-to-buy-sector-design-leader-trc-cos)) |
| **Burns & McDonnell India** | Мумбаи с 2013, Бенгалуру с 2023; **T&D-практика ~400 чел. — крупнейшая группа в Индии**, партнёрство с 16 офисами по миру ([B&McD](https://www.burnsmcd.com/news/india-leaders-for-bengaluru-transmission-distribution-group)) | T&D-проектирование на экспорт | Да (США) | **Прямой конкурент** |
| **Cyient** | выручка FY26 **$658 млн**, 14 000+ сотрудников, 300+ клиентов в 30 странах; utilities — заявленный сектор ([Cyient](https://www.cyient.com/news/cyient-builds-further-strength-in-q2-fy26)) | геопространственные/сетевые сервисы для utilities | Да | Конкурент; T&D-разбивку по выручке **не нашёл** |
| **Quest Global** | **32 566** сотрудников на 03.2026 ([Revelio](https://www.reveliolabs.com/companies/quest-global-services/employees)); HQ Сингапур, 104 центра | **Grid Engineering Services**: system engineering, control & protection, **HVDC/FACTS**, валидация моделей, power system studies, grid-code compliance ([Quest Global](https://www.questglobal.com/industries/energy/power/grid-engineering-services/)) | Да | **Самый близкий конкурент по продуктовой линейке** |
| **Tata Consulting Engineers (TCE)** | выручка FY26 ~**₹3 000 крор** (~$345–360 млн), цель $1 млрд к FY31 ([Business Standard, 24.07.2026](https://www.business-standard.com/amp/companies/news/tata-consulting-engineers-targets-1-billion-revenue-by-fy31-126072400936_1.html)); численность по Revelio 27 885 на 03.2026 — **цифра сомнительна для TCE, вероятно смешение с группой Tata; флаг** | 12 000+ км ВЛ, **250+ подстанций**, AIS/GIS/HVDC, DLR-решения ([TCE T&D](https://www.tataconsultingengineers.com/power/transmission-distribution/)) | частично | Гибрид: конкурент по Индии, но **единственный из пятёрки, кто нанимает под индийские ВЛ/ПС-проекты** → теоретически может быть перегружен |
| **Jacobs / Stantec India** | центры в Индии, Польше, на Филиппинах; «remote design and modeling support» ([Jacobs India](https://www.jacobs.com/jacobs-india)) | да | Да | Конкурент |

**Практический вывод по группе 2:** канал через них означает, что наша работа попадёт к их западному конечному заказчику через их же контракт — то есть именно туда, где нас не пропустит комплаенс (см. §9). **Единственная теоретически рабочая конструкция — TCE на чисто индийских проектах** (индийский заказчик, индийская подпись, наш вклад как расчётное ядро без атрибуции). Публичных примеров, что TCE закупает внешнее детальное проектирование, — **не нашёл**.

---

## 5. Группа 3. Независимые проектные компании и консультанты

| Компания | Профиль | Размер | Источник |
|---|---|---|---|
| **Tractebel India** (ENGIE) | Энергетика, ВИЭ, T&D, гидро, водные ресурсы; офисы Гургаон и Гандинагар | **850+** сотрудников | [Tractebel](https://tractebel-engie.com/en/locations/india/) |
| **Fichtner Consulting Engineers (India)** | В Индии с **1987**; подстанции и T&D — от ТЭО и трассировки до базового и детального проектирования, закупочного сопровождения, авторского надзора | не нашёл | [Fichtner India](https://www.fichtner.co.in/business-sectors/power-generation-and-transmission) |
| **Mott MacDonald India** | >50 лет в Индии, купил Dalal Consultants (2001) | не нашёл | [Mott MacDonald](https://en.wikipedia.org/wiki/Mott_MacDonald) |
| **RECPDCL** (дочка REC Ltd, госсектор) | Проводит **эмпанелмент EPC-подрядчиков** по ВЛ и AIS/GIS ПС (срок 2 года + 2 по согласию); выступает bid-process coordinator по TBCB | — | [T&D India](https://www.tndindia.com/recpdcl-to-empanel-contractors-for-power-transmission-projects/) |
| **PFC Consulting (PFCCL)** | Тот же функционал: тендерит межштатные схемы (напр. 765/400/220 кВ AIS в Долви, Райгад, Махараштра) | — | [Mercom](https://www.mercomindia.com/pfc-consulting-tenders-intrastate-transmission-project-in-maharashtra-2) |
| Мелкие бюро power system studies (iFluids, Power Consultants Mumbai, Aditya Engineering Services, VB Engg., Power Projects India) | load flow, КЗ, релейная координация, arc flash, гармоники, grid-code | микро | сводка по [поиску](https://www.indiamart.com/power-consultants/), [iFluids](https://ifluids.com/power-systems-studies/) |

**Что важно:** в Индии **interconnection studies в западном смысле как отдельный платный рынок отсутствуют**. Подключение к межштатной сети идёт через **CTUIL** по регламенту Connectivity/GNA (CERC Regulations 2022), заявки подаются **онлайн через NSWS**, а системные исследования делает сама CTU ([CTUIL GNA](https://www.ctuil.in/gna), [Detailed Procedure PDF](https://www.ctuil.in/uploads/cerc/167272677083Detailed%20Procedure%20for%20Connectivity%20and%20GNA%20to%20ISTS_Vol-I.pdf), [SolarQuarter, 15.04.2026](https://solarquarter.com/2026/04/15/ctuil-introduces-streamlined-connectivity-and-gna-framework-to-boost-grid-integration/)). То есть **бизнес-модель «продаём interconnection studies», работающая в США, в Индии не воспроизводится** — там это регуляторная процедура, а не консалтинговый рынок. Это важное опровержение исходной гипотезы по пункту 3 задания.

Микро-бюро power system studies — реальны, но это компании на единицы-десятки человек, они не праймы и денег такого масштаба не носят.

---

## 6. Группа 4. Госструктуры и заказчики с потоком

### 6.1 POWERGRID (PGCIL)
- **Как заходить (проверено):** портал тендеров `https://apps.powergrid.in/pgciltenders/u/default.aspx`, отдельная **регистрация вендора на e-tender-портале**; MSME обязаны иметь **Udyam**-регистрацию и присутствие на **GeM**; по отдельным категориям — предварительный эмпанелмент, эмпанелированные вендоры получают уведомления и приглашения в ограниченные тендеры ([PGCIL e-procurement](https://apps.powergrid.in/pgciltenders/u/e-procurement.aspx)).
- **Барьер:** эмпанелмент по TBCB до 765 кВ pan-India держат **семь** EPC-подрядчиков (в их числе Bajel Projects) ([Bajel](https://www.bajelprojects.com/power-transmission.html)). Список закрытый.
- **Для нас:** прямая продажа проектных часов государственной компании из РФ через тендерную процедуру — **нереалистично** (требования к местной регистрации, опыту в Индии, EMD/BG). **Только через индийского прайма как невидимый субподряд.**

### 6.2 Bid-process coordinators — RECPDCL и PFCCL
Оба готовят «предпроектную лопату» под TBCB (д-р Kane, Tata Power: «RECPDCL and PFCCL provide pre-project spadework»). Пример масштаба: тендер RECPDCL на 400 кВ ПС + ВЛ в округе Белагави (Карнатака), **оценочная стоимость ₹18,5 млрд (~$205,8 млн)**, объём — «design, engineering, construction, erection, testing, commissioning + поставка + O&M + изыскания + DPR + финансирование + земля»; L1 — Dilip Buildcon ([Mercom](https://www.mercomindia.com/recpdcl-tenders-intrastate-transmission-line-for-400-kv-substation-in-karnataka), [Mercom L1](https://www.mercomindia.com/dilip-buildcon-wins-recs-auction-to-set-up-ists-for-400-kv-substation-in-karnataka)).
**Читаем:** проектирование в Индии **не покупается отдельным лотом** — оно зашито в BOO/BOOT-пакет победителя. Значит наш покупатель — **победитель тендера**, а не тендерная организация.

### 6.3 Tata Power (Transmission)
- Портфель (введённое + строящееся) — **~8 000 ckm**, строящееся **>2 000 ckm** на 30.06.2026; цель **7 300 ckm** собственной сети к 03.2028; программа расширения сети Мумбаи — **₹10 000 крор** за 5 лет ([T&D India](https://www.tndindia.com/tata-power-under-construction-transmission-portfolio-crosses-2000-ckm/), [интервью](https://www.tndindia.com/we-are-addressing-supply-chain-challenges-through-better-planning-and-coordination-tata-power/)).
- **ЛПР (опубликовано):** **д-р Nilesh Kane, Chief – Transmission & Distribution, Tata Power**.
- **Узкие места по его же словам:** трансформаторы **24–36 месяцев** срок поставки; провод подорожал ~**15 % за два месяца**; дефицит бригад монтажа опор. Проектирование он узким местом **не называет** — честно фиксируем.
- **EPC делает Tata Projects** (группа), координаторы — RECPDCL/PFCCL, СП — Resurgent Power Ventures (26 %).

### 6.4 Застройщики ЦОД — самый недооценённый вход
| Игрок | Масштаб/планы | Источник |
|---|---|---|
| **AdaniConneX** (Adani × EdgeConneX 50:50) | цель **1 ГВт** за десятилетие; sustainability-linked финансирование до **$1,44 млрд** (04.2024); AI-ЦОД в Ченнаи | [Data Centre Magazine](https://datacentremagazine.com/top10/top-10-data-centre-companies-in-india) |
| **CtrlS** | проект **Chandan Valley 612 МВт** (Хайдарабад, 2027–28); MoU с **NTPC Green** на ~**2 ГВт** ВИЭ (11.2025) | там же |
| **Yotta** | расширение в Пуне и Хайдарабаде | там же |
| **Sify** | рост через партнёрства, региональная экспансия | там же |
| **Techno Electric** | сам строит ЦОД (Ченнаи→Нойда, Калькутта) — редкий гибрид «EPC + ЦОД-девелопер» | [инвест-презентация](https://www.techno.co.in/public/uploads/2/2026-05/teecl_investor_presentation_q4_fy26.pdf) |

**Почему это лучший вход:** пайплайн **8,33 ГВт против 1,6 ГВт живой мощности** — пятикратный разрыв; каждому кампусу нужна выделенная подстанция, схема выдачи/приёма мощности и заявка в сеть; сроки диктует стройка ЦОД, а не сетевой регламент; конечный заказчик — индийское юрлицо (даже если арендатор — гиперскейлер), а платит за **срок**, не за час.

---

## 7. Группа 5. Центральная Азия и ЮВА (краткий проход, бюджет поиска остаточный)

| Страна / игрок | Что нашёл | Оценка для нас |
|---|---|---|
| **Казахстан, KEGOC** | 374 ВЛ, 80 ПС 35–1150 кВ, 38 246 МВА ([Wikipedia/KEGOC](https://en.wikipedia.org/wiki/KEGOC)). Проекты: расширение ПС 500 кВ Шу + ВЛ 475 км Шу–Жамбыл–Шымкент (сдача сер. 2027); интеграция Западной зоны — ВЛ 500 кВ **604 км** Улке–Карабатан + новая ПС 500 кВ Карабатан к 2027; новая цифровая ПС 500 кВ в Астане ([Astana Times, 03.2026](https://astanatimes.com/2026/03/kazakhstan-to-link-western-regions-to-national-grid-in-major-network-upgrade-by-2027/), [KEGOC](https://www.kegoc.kz/en/about/investicionnye-proekty/18396/)) | **Самый низкий языковой и стандартный барьер** (ГОСТ/СНиП-наследие, русский язык, ЕАЭС). Подрядчики и проектные институты по проектам 2026 — **не нашёл**. Минус: банковский комплаенс к российским контрагентам (см. предыдущие файлы библиотеки) |
| **Узбекистан** | ADB: заём **$125 млн**, «Digitize to Decarbonize» — реабилитация 12 ВЛ в 7 областях (~359 км) + реконструкция четырёх ПС 220 кВ (Файзабад, Оби-Хает, Зафар, Зарафшан); техспецификации готовят **международные консультанты по линии ADB TA**, закупка по ICB ([ADB 58437-001](https://www.adb.org/projects/58437-001/main), [ADB news](https://www.adb.org/news/adb-help-modernize-uzbekistan-power-transmission-grid)). Всемирный банк — проект **ESTART** | Донорские деньги = донорские правила закупки. Российское происхождение — **прямое трение** в ADB/WB-процедурах. **Допущение**, прямого запрета не нашёл |
| **Вьетнам** | Проектные институты EVN: **PECC1–PECC5**. PECC2 — >400 проектов ВЛ 500/220/110 кВ, >2000 км ВЛ 500 кВ ([PECC2 T&D](https://pecc2.com/en/transmission.html)); PECC5 лицензирован на проектирование до 500 кВ ([PECC5](https://pecc5.com/home/)); PECC3 — ТЭС, сети, ПС, ВИЭ | Государственные проектные институты — **это конкуренты-инсорсеры**, а не покупатели субподряда. Низкий приоритет |
| **Индонезия, PLN** | RUPTL 2025–2034: **47 758 ckm** ВЛ и **+107 950 МВА** ПС за 10 лет; требуется ~**$2,4 млрд/год** инвестиций в передачу против фактических **$1,4 млрд/год** с 2019 — **разрыв финансирования, а не проектной мощности** ([IEEFA](https://ieefa.org/resources/unlocking-indonesias-transmission-grid-investment), [Southeast Asia Infrastructure](https://southeastasiainfra.com/indonesias-power-future-plns-ruptl-2025-2034-focuses-on-renewables-integration/)) | Объём гигантский, но узкое место — деньги. Проектный субподряд не решает их проблему |
| **Малайзия, TNB** | По запросу ничего релевантного не нашлось — **не нашёл** | — |

---

## 8. СТАВКИ — отдельный вывод (самое важное для нашей экономики)

### 8.1 Что нашлось по цифрам

| Показатель | Значение | Источник / оговорка |
|---|---|---|
| Средняя зарплата **Substation Design Engineer**, Индия | **₹9 10 365/год**; межквартиль ₹7 07 644 – ₹11 87 755; потолок ~₹14,5 лакх | [Glassdoor India, 01.2026](https://www.glassdoor.co.in/Salaries/substation-design-engineer-salary-SRCH_KO0,26.htm) |
| **Power Transmission Engineer**, Индия | **₹17 85 311/год**, эквивалент **₹858/час** | [ERI/SalaryExpert](https://www.erieri.com/salary/job/power-transmission-engineer/india) — выборка смещена к сеньорам |
| «Transmission Line» навык | средняя ₹18,5 лакх, медиана ₹16,0 лакх | [6figr](https://6figr.com/in/salary/transmission-line--s) — самоотчётная база, флаг |
| **Transmission-Line Engineer** | ₹5 06 064/год средняя; 1–4 года ₹2 88 346; 5–9 лет ₹4 99 100 | [PayScale](https://www.payscale.com/research/IN/Job=Transmission-Line_Engineer/Salary) — резко ниже других источников; **разброс источников в 3,5×, доверять диапазону, не точке** |
| CADD-час в Индии (оплата труда) | ~**₹225/час** (~$2,6) | [PayScale CADD](https://www.payscale.com/research/IN/Skill=Computer_Aided_Drafting_%26_Design_(CADD)/Hourly_Rate) |
| Индийский CAD-дизайнер, **биллинг** аутсорсеру | «от **$10/час**» (рекламная нижняя граница) | [Virtual Employee](https://www.virtualemployee.com/services/engineers-architects/hire-cad-designer) |
| Офшорный инженер из Индии, **биллинг** (широкий ER&D/софт) | **$20–65/час**: junior $15–30, mid $25–40, senior $35–48/65 | [Aalpha](https://www.aalpha.net/articles/offshore-software-development-hourly-rates/), [TechVinta](https://techvinta.com/blog/offshore-software-development-rates-india-2026) — **прокси: это софт, не сетевое проектирование** |
| Черчение/проектирование в США | базовый 2D AutoCAD **$45+/час**; типично **$55–75/час**; специализированное до **$130/час** | [CADdrafter.us](https://caddrafter.us/how-much-do-cad-drafting-services-cost/), [Tecticonism](https://tecticonismstudio.com/how-much-do-architectural-drafting-cost-in-the-usa-and-canada/) |
| Индийские бюро против США/Канады | дешевле на **40–60 %** | там же |

### 8.2 Расчёт (наш, с явными допущениями)

Внутренняя загруженная себестоимость индийского проектировщика подстанций у прайма:
- ₹9 10 365/год ÷ ₹87/$ = **$10 464/год** фонд оплаты
- ÷ 2 000 рабочих часов = **$5,2/час** «голая» зарплата
- × коэффициент загрузки 2,2–2,8 (соцпакет, аренда, ПО, руководство, простой) — **допущение** — = **$11,5–14,6/час**
- Для сеньора (₹17,85 лакх): $10,3/час голых × 2,2–2,8 = **$22,6–28,7/час**

**Экспортный биллинг** индийского GCC за то же самое: осторожная оценка **$25–45/час** для проектировщика уровня mid–senior (интерполяция из ER&D-диапазона $25–48 с поправкой вверх за отраслевую специфику — **допущение, прямых сетевых рейт-кардов не нашёл**).

### 8.3 Что из этого следует

1. **Внутренний индийский рынок продажи часов для нас закрыт.** Мы не можем быть дешевле $12–15/час загруженной себестоимости индийского прайма и одновременно оставаться бизнесом. Любой питч «мы дешевле вашего инженера» в Индии проигрывает арифметике.
2. **Арбитраж идёт в обратную сторону:** это Индия — дешёвая площадка относительно нас и Запада, а не наоборот. Наше преимущество должно быть **не в цене часа, а в выпуске на единицу времени** (ИИ-ядро) и в **дефицитной экспертизе** (расчёты режимов, устойчивость, релейная защита, HVDC), которых у линейного индийского проектировщика нет.
3. **Правильная единица продажи — не час.** Комплект чертежей, расчёт, схема выдачи мощности, срок. Тогда наша ставка сравнивается не с $13/час, а со стоимостью просрочки проекта (медиана >10 мес. по TBCB) и с ценой контракта (пример: ₹18,5 млрд за одну 400 кВ ПС с линиями).
4. **Разрыв «Индия→Запад» — вот где деньги.** Индийский GCC берёт $25–45/час и продаёт результат в США, где локальный аналог стоит $55–130/час. Мы можем участвовать в этой цепочке только как невидимое расчётное ядро индийского юрлица — и то с оговорками §9.
5. **Публичных рейт-кардов именно на T&D-проектирование в Индии — НЕ НАШЁЛ**, ни у PGCIL/CEA (man-month расценки), ни в отраслевых отчётах. Все цифры выше — либо зарплаты, либо прокси из смежных секторов. **Перед любым коммерческим решением цифру надо добыть из живого разговора, а не из веба.**

---

## 9. Комплаенс — фильтр, который решает больше, чем экономика

- 30.10.2024 США (Госдеп + OFAC) внесли в списки ~400 сущностей, включая **19 индийских компаний и 2 физлиц** за поддержку военной деятельности РФ; среди них — фирмы, поставлявшие электронику и **электрооборудование** (KDG Engineering, Shaurya Aeronautics, RRG Engineering, Pointer Electronics и др.) ([Jenner & Block](https://www.jenner.com/en/news-insights/client-alerts/ofac-casts-wide-net-with-sanctions-against-russia-linked-indian-targets)).
- Вторичные санкции бьют не по юрисдикции, а по доступу: потеря долларового клиринга, отсечение от американской финансовой системы ([Clifford Chance, 12.2025](https://www.cliffordchance.com/insights/resources/blogs/regulatory-investigations-financial-crime-insights/2025/12/red-flags-and-blacklists-how-india-based-companies-can-avoid-us-sanctions-pitfalls.html)).
- Рекомендация юристов индийским компаниям — **аудировать цепочку поставщиков и требовать того же уровня комплаенса от вендоров** (там же). Это ровно тот процесс, в котором нас найдут.

**Практическое следствие для сегментации (это и есть колонка «работает ли на западных заказчиков»):**

| Профиль клиента | Пример | Наш доступ |
|---|---|---|
| Экспортёр в США/ЕС с западным конечным заказчиком | KEC (SAE Towers), Kalpataru (Швеция/Бразилия), Apar (США 30 %), Skipper (Сев. Америка), WSP/B&McD/Jacobs/Quest Global | **Практически закрыт** |
| Индийский игрок с международкой вне Запада | L&T PT&D (Ближний Восток), Transrail (Африка/ЮВА/БВ) | Условно открыт, но группа целиком под западным финансовым периметром |
| Чисто индийский заказчик, индийская подпись, индийские деньги | Techno Electric, Resonia, штатные трансco, застройщики ЦОД под индийских арендаторов | **Открыт** |
| Государство/доноры (PGCIL, ADB/WB в ЦА) | PGCIL, ADB-Узбекистан | Закрыт по процедуре закупки |

---

## 10. Сводная таблица кандидатов

| # | Название | Страна / владелец | Портфель (последнее раскрытие) | Привлекает внешних проектировщиков? | Работает на западных заказчиков? | Как заходить | ЛПР (опубликовано) |
|---|---|---|---|---|---|---|---|
| 1 | **Techno Electric & Engineering** | Индия, семьи Gupta/Saraiya | OB ₹9 566 крор (2,9× выручки); >20 ПС 220–765 кВ за год; свои ЦОД | Публично — нет, заявлен «robust in-house design». **Разрыв мощности очевиден** | **Нет** (домашний рынок) | Прямой контакт руководства; отраслевые площадки Elecrama/IEEMA | P. P. Gupta (MD); Ankit Saraiya (Dir. & President); Sujoy Ray (Group President) |
| 2 | **Resonia** (бывш. Sterlite Grid 5) | Индия, Vedanta/Agarwal | выручка FY26 ~₹6 500 крор; план капекса **₹1 лакх крор к FY32**; TBCB-победы (Bikaner REZ 8 ГВт, Ananthapur-II) | Не нашёл | Не нашёл (после демерджера бразильский периметр неясен) | Прямой контакт; отслеживать TBCB-победы и заходить сразу после присуждения | Pratik Agarwal (Chairperson) |
| 3 | **Transrail Lighting** | Индия, публичная | OB ₹16 361 крор (T&D 92 %); приток FY26 ₹8 520 крор; выручка +30 % | Не нашёл | Экспорт в Африку/ЮВА/БВ; западных — не нашёл | Прямой контакт закупок; сайт transrail.in | **Не нашёл** |
| 4 | **Kalpataru Projects (KPIL)** | Индия, Kalpataru Group | OB ₹66 607 крор (30.06.2026), T&D ₹29 609 крор (44 %); T&D-выручка +56 % в FY26 | **Косвенно ДА** — открытые вакансии Design (Civil+Electrical) Нойда/Вадодара | **ДА** (Швеция, Бразилия, Ближний Восток) | **Вендор-портал `vendorconnect.kalpatarugroup.com/Registration/Index`** | Manish Mohnot (MD & CEO); контакт найма santosh.kumar@ (агрегатор, проверить) |
| 5 | **AdaniConneX / CtrlS / Yotta / Sify** (ЦОД) | Индия | пайплайн ЦОД 8,33 ГВт против 1,6 ГВт live; AdaniConneX цель 1 ГВт, финансирование до $1,44 млрд; CtrlS 612 МВт Chandan Valley | Не нашёл, но структурно обязаны (нет своих сетевых отделов) | Арендаторы — гиперскейлеры (риск), заказчик — индийское юрлицо | Через их EPC/консультантов, либо напрямую в capacity/energy-команды | **Не нашёл** |
| 6 | **Adani Energy Solutions** | Индия, Adani | строящийся портфель ₹71 779 крор; капекс FY26 ₹17–18 тыс. крор | Не нашёл | Формально нет; **но группа под юр. давлением в США → жёсткий комплаенс** (допущение) | Тендеры/вендор-регистрация группы | **Не нашёл** |
| 7 | **L&T PT&D (EDRC)** | Индия, L&T | группа: OB ₹740 327 крор, выручка ₹285 874 крор; PT&D-заказы ₹5–10 тыс. крор пакетами | **Нет — сам является проектным центром**, набирает проектировщиков в штат | Ближний Восток; группа в западном фин. периметре | — | Руководителя EDRC PT&D **не нашёл** |
| 8 | **KEC International** | Индия, RPG | OB ₹36 267 крор (+L1 >₹40 тыс. крор); T&D-книга ₹25 200 крор; T&D-выручка ₹15 883 крор (+24 %) | Не нашёл; нанимает стройку, не проектирование | **ДА** (SAE Towers: США/Мексика/Бразилия; 55 % экспорт) | Отдел закупок; публичного портала не нашёл | Vimal Kejriwal (MD & CEO); Rajinder Gupta (CE T&D India & SL — вторичный источник) |
| 9 | **Tata Power (Transmission)** | Индия, Tata | ~8 000 ckm всего, >2 000 ckm строится; ₹10 000 крор на сеть Мумбаи за 5 лет | EPC отдаёт Tata Projects, «спадворк» — RECPDCL/PFCCL | Нет прямых западных | Через Tata Projects как EPC | **д-р Nilesh Kane, Chief – T&D** |
| 10 | **Tata Projects** | Индия, Tata | T&D-книгу не нашёл; активный набор по T&D pan-India (22.08.2026) | Не нашёл; набирает стройку | Группа Tata — западная экспозиция есть | HR-контакты опубликованы на агрегаторе (проверить) | **Не нашёл** |
| 11 | **Tata Consulting Engineers** | Индия, Tata | выручка ~₹3 000 крор, цель $1 млрд к FY31; 12 000+ км ВЛ, 250+ ПС | Не нашёл; **сам продаёт проектирование** | Частично | — | **Не нашёл** |
| 12 | **WSP GCC India (+POWER Engineers)** | Канада/Великобритания | 5 500+ в GCC; WSP India 6 014 чел.; покупка TRC за $3,3 млрд | **Конкурент** | **ДА, целиком** | — | — |
| 13 | **Burns & McDonnell India** | США | T&D-практика ~400 чел., крупнейшая группа в Индии | **Конкурент** | **ДА** | — | — |
| 14 | **Quest Global** | Сингапур/Индия | 32 566 сотрудников; Grid Engineering: HVDC/FACTS, C&P, power system studies | **Конкурент, самый близкий по линейке** | **ДА** | — | — |
| 15 | **Cyient** | Индия, публичная | выручка FY26 $658 млн, 14 000+ чел. | **Конкурент** | **ДА** | — | — |
| 16 | **PGCIL** | Индия, государство | межштатная сеть, крупнейший заказчик страны | Нет — эмпанелмент 7 EPC на TBCB до 765 кВ | Нет | Портал `apps.powergrid.in/pgciltenders` + Udyam + GeM; эмпанелмент по категориям | **Не нашёл** |
| 17 | **KEGOC** | Казахстан, государство | 374 ВЛ, 80 ПС, 38 246 МВА; ВЛ 604 км Улке–Карабатан + ПС 500 кВ к 2027; ВЛ 475 км Шу–Шымкент к сер. 2027 | Не нашёл | Нет | Госзакупки Казахстана | **Не нашёл** |
| 18 | **PLN (Индонезия)** | Индонезия, государство | RUPTL: 47 758 ckm + 107 950 МВА за 10 лет; потребность $2,4 млрд/год против факта $1,4 млрд | Узкое место — финансирование, не проектирование | — | — | — |
| 19 | **PECC1–PECC5 (EVN)** | Вьетнам, государство | PECC2: >400 проектов ВЛ 500/220/110 кВ, >2000 км ВЛ 500 кВ | **Конкуренты-инсорсеры** | — | — | — |

---

## 11. Шорт-лист: 6 кандидатов с обоснованием

### 1. Techno Electric & Engineering (TEECL) — приоритет №1
**Почему:** книга **2,9× годовой выручки** при плане «>20 подстанций 220–765 кВ в год» — арифметически невозможно закрыть внутренним проектным отделом. Компания **чисто индийская** (нет западного конечного заказчика → нет комплаенс-стопа), при этом заявляет собственные проектные компетенции — значит, у неё есть человек, который отвечает за проектную загрузку и у которого горит.
**Зацепка для захода:** «У вас 20+ подстанций в год и внутренний проектный отдел. Мы закрываем пиковые окна по вторичке/первичке и по расчётам режимов — как переливной клапан, под вашей подписью, без появления в документах. Начнём с одной подстанции, чтобы вы проверили качество».
**Риск:** размер компании (~$1 млрд OB) даёт им запас, они могут просто нанять — и на индийской ставке это дешевле нас.

### 2. Resonia — приоритет №2
**Почему:** заявленный капекс **₹1 лакх крор к FY32** против выручки FY26 **₹6 500 крор** — это 15-кратный разрыв между амбицией и текущим масштабом. Организация такого размера физически не имеет проектной мощности под этот план и будет вынуждена покупать её снаружи. Плюс TBCB-модель: победитель обязан уложиться в срок, а медиана по отрасли — просрочка >10 мес.
**Зацепка:** «Вы объявили ₹1 лакх крор до FY32. Медианная просрочка TBCB — 10 месяцев, и она стоит вам тарифной выручки. Мы даём проектную мощность под конкретный выигранный лот с фиксированным сроком».
**Риск:** после демерджера структура и бразильский периметр непрозрачны — проверить западную экспозицию до первого контакта.

### 3. Застройщики ЦОД (AdaniConneX, CtrlS, Yotta, Sify) — приоритет №3, как сегмент
**Почему:** пайплайн **8,33 ГВт против 1,6 ГВт** живой мощности; у ЦОД-девелоперов **нет и не будет собственных сетевых проектных отделов**; их метрика — срок ввода, а не стоимость часа; конечный заказчик формально индийский. Это единственный сегмент, где «мы дороже индийского инженера» не является возражением.
**Зацепка:** «Ваш кампус упирается не в стройку, а в схему выдачи мощности и заявку в сеть. Мы делаем этот пакет за N недель вместо N месяцев — фиксированной ценой за комплект».
**Риск:** арендаторы — американские гиперскейлеры со своими требованиями к цепочке поставщиков. Проверять по каждому кампусу отдельно.

### 4. Transrail Lighting — приоритет №4
**Почему:** **92 % книги — T&D**, рост выручки +30 %, книга ₹16 361 крор. Чистый профильный игрок среднего размера — самая высокая вероятность, что рост опережает наём. Западной клиентуры публично нет.
**Зацепка:** «Вы выросли на 30 % за год. Проектный отдел так не растёт. Возьмите нас на пиковую нагрузку».
**Риск:** ЛПР не нашёл — вход придётся строить с нуля.

### 5. Kalpataru Projects (KPIL) — приоритет №5, с оговоркой
**Почему:** **единственный, у кого нашлись открытые вакансии именно проектировщиков подстанций** (Нойда, Вадодара, 22.07.2026) — это прямое, датированное доказательство спроса, а не наша интерпретация. Плюс работающий вендор-портал = формализованный вход.
**Зацепка:** «Вы ищете Manager Design по GIS/AIS в Нойду и Вадодару. Найм такого человека — 3–6 месяцев. Мы даём команду на следующей неделе, под ваш контроль».
**Риск и оговорка:** шведская и бразильская дочки, фокус роста «Nordics + Middle East». **Заходить только в индийский домашний T&D-периметр и заранее продумать структуру контрагента.** Если комплаенс поднимут на уровне группы — разговор закончится.

### 6. Tata Consulting Engineers — приоритет №6, как эксперимент
**Почему:** единственный из «офшорных центров», кто одновременно (а) сам перегружен на индийских проектах (набор под ВЛ/ПС в Гуджарате), (б) не является чистым экспортным GCC, (в) имеет цель утроить выручку до $1 млрд к FY31 с текущих ~$350 млн. Утроение за 5 лет = дефицит рук по определению.
**Зацепка:** «Вы идёте с $350 млн к $1 млрд за пять лет. Это утроение проектной мощности. Мы — часть ответа на индийском портфеле».
**Риск:** это консалтинговая компания, для неё проектирование — товар, а не издержка. Может воспринять нас как конкурента. **Вероятность отказа выше, чем у остальных пяти.**

**Кого исключить из работы сразу:** KEC, Apar, Skipper (западная экспозиция + производственный, а не проектный профиль); WSP, Burns & McDonnell, Jacobs, Quest Global, Cyient (конкуренты с западным конечным заказчиком); PGCIL и ADB-финансируемые проекты в ЦА (закрытая процедура закупки); PECC во Вьетнаме (госинсорсеры).

---

## 12. Механика захода — что известно точно

| Механизм | Статус | Детали |
|---|---|---|
| **Kalpataru vendor portal** | **Работает** | `https://vendorconnect.kalpatarugroup.com/Registration/Index`, регистрация с OTP по почте и телефону |
| **PGCIL e-tender** | **Работает** | `https://apps.powergrid.in/pgciltenders/u/default.aspx`; для MSME обязательны **Udyam** + **GeM**; по части категорий — предварительный эмпанелмент |
| **RECPDCL эмпанелмент EPC** | Периодический | ВЛ + AIS/GIS ПС, срок 2 года + 2 по согласию сторон; следить за EOI |
| **KEC / Techno / Transrail / Resonia** | Публичного портала для инжиниринговых услуг **не нашёл** | Только прямой контакт закупок/руководства |
| **Формат отраслевого входа** | — | Elecrama / IEEMA — крупнейшие отраслевые площадки Индии по электрооборудованию; конкретных дат следующего издания в этой сессии **не проверял** |

**Ключевой структурный вывод по механике:** в Индии **проектирование не закупается отдельным лотом** — оно вшито в BOO/BOOT/EPC-пакет (пример: ₹18,5 млрд за 400 кВ ПС «под ключ», включая DPR, изыскания, финансирование и землю). Значит тендерные порталы для нас — **источник разведки о том, кто только что выиграл и у кого сейчас загорелся срок**, а не канал продаж. Продажа — прямая, победителю, в первые недели после присуждения.

---

## 13. Чего не нашёл (честный список)

- Ни одного **публичного примера**, что индийский T&D-прайм закупает детальное проектирование у внешней проектной фирмы. Ни контракта, ни суммы, ни упоминания в отчётности.
- **Рейт-карды на T&D-проектирование** в Индии — ни экспортные, ни внутренние; ни у PGCIL/CEA (man-month), ни в отраслевых отчётах. Все ставки в §8 — производные от зарплат и прокси из смежных секторов.
- **Численность персонала** KEC, Transrail, Resonia; численность проектных отделов у всех кандидатов.
- **Имена руководителей инжиниринга** у Transrail, Resonia (кроме председателя), AESL, Tata Projects, TCE, PGCIL.
- **T&D-заказ-книга Tata Projects** за FY26.
- Разбивка выручки **Cyient** по T&D.
- **Подрядчики и проектные институты KEGOC** по проектам 2026.
- Что-либо релевантное по **Малайзии/TNB**.
- Прямых **заявлений индийских праймов о нехватке проектировщиков** — только косвенные (вакансии) и отраслевая оценка ICRA про «skilled manpower» в целом.
- Число вакансий «substation design» на Naukri (272, 08.2026) — из поисковой выдачи, сама страница отдаёт 403; **проверить вручную**.

## 14. Пометки о качестве источников

- Контактные e-mail (`santosh.kumar@kalpataruprojects.com`, `bhuvaneshp@tataprojects.com`, `abhishek.dubey@tataprojects.com`, `Mohammed.taj@Intecc.com`) взяты с **агрегатора вакансий constructionplacement.org**, а не с корпоративных сайтов. Домен в последнем явно искажён. **Ни один не проверен, использовать только после верификации.**
- Должность Rajinder Gupta (KEC) — по вторичной базе theorg.com, первоисточником не подтверждена.
- Численность TCE 27 885 (Revelio Labs) выглядит завышенной для TCE и, вероятно, смешивает группу Tata — **не использовать в питче**.
- Разброс зарплатных источников по одной и той же роли достигает **3,5×** (PayScale ₹5,06 лакх против ERI ₹17,85 лакх) — работать только с диапазоном.
- Курс ₹87/$ — допущение; источники компаний считают по своему (Kalpataru даёт $6,9 млрд на ₹63 287 крор ≈ ₹92/$).
