# IC12-1 · Инженерно-геодезические изыскания как слой сетевых/ЦОД-проектов (Залив, Индия, ЮВА)
Дата: 01.09.2026. Роль: исследователь-скептик. Задача — опровергнуть утверждение:
«Изыскания — обязательный, оплачиваемый и дефицитный по людям слой сетевых и ЦОД-проектов на целевых рынках, и методика быстрого ввода местных техников решает реальную боль (квоты локализации, дефицит), а не выдуманную».

## 0. Вердикт (коротко)
**Частично опровергнуто.** Из четырёх тезисов уверенно подтверждён один — «квоты локализации реальны и бьют именно по геодезистам» (Саудовская Аравия). Остальные либо слабые, либо опровергнуты:

| Тезис | Статус | Суть |
|---|---|---|
| Обязательный слой | ✅ подтверждено | Без съёмки/трассировки проект ЛЭП/ПС не проектируется; в Индии RECPDCL/POWERGRID закупают отдельно; в Малайзии по закону нужен лицензированный LLS. |
| Оплачиваемый слой | ⚠️ технически да, коммерчески слабо | Расчётная доля изысканий в CAPEX ЛЭП — порядка **0,1–0,5 %** (допущение на основе индийских расценок и стоимости км линии); в Заливе отдельных тендеров SEC/DEWA/TNB на survey **не найдено** — работа сидит внутри EPC-контракта; в Индии закупка по L1 (самая низкая цена). Это нишевый субподряд, а не «слой» с деньгами. |
| Дефицит людей | ❌ не доказано | Прямых данных о дефиците именно *геодезистов* (land/geodetic surveyors) в Заливе и Индии нет. Найденные «дефициты сюрвейеров» — про **quantity surveyors** (сметчиков). Зарплаты линейных геодезистов в КСА низкие (2,5–4 тыс. SAR/мес по объявлениям) — не признак острого дефицита. Найм в саудовском строительстве в 2026 замедлился (AGBI, авг. 2026). |
| Квоты локализации бьют по геодезистам | ✅ сильно подтверждено (КСА) | Постановление Минтруда КСА № 103105 от 26.01.2025: **30 % саудизации** «технических инженерных профессий», список прямо включает Land Surveyor, Geodetic Surveyor, Surveying Technician, Assistant Surveyor, Photogrammetric Surveyor, Digital Aerial Survey Mapping Technician и др. Порог — 5+ работников в этих профессиях, мин. зарплата 5 000 SAR, **обязательная аккредитация Saudi Council of Engineers**. |
| «Быстрый ввод техников» решает боль | ⚠️ условно | Боль в КСА реальна (нужно поставить саудовцев на 30 % позиций и провести их через аккредитацию SCE). Но (а) техник должен пройти аккредитацию SCE — быстрая методика её не обходит (не проверено, чем именно подтверждается квалификация); (б) полевая работа быстро уходит в дрон-LiDAR/фотограмметрию (RECPDCL, TNB) и роботов разметки (Civ Robotics) — нужный «техник» всё больше оператор дрона/обработчик данных, а не оператор тахеометра; (в) вендорские дистрибьюторы (Trimble/Leica в КСА) уже имеют учебные центры — обучение как услуга там частично «бесплатно». |

**Итог для решения:** изыскания как *самостоятельный бизнес* — низкомаржинальный субподряд с ничтожной долей CAPEX и закупкой по цене. Как *локализационный инструмент внутри инженерной компании* в КСА (закрыть 30 % саудовцев на survey-позициях и получить баллы Local Content) — гипотеза рабочая. Для Индии иностранная фирма в поле практически не допускается (нужна индийская сущность), для Малайзии — только через лицензированного LLS (их ~456 на полуостров). Главные риски: аккредитация SCE, дронизация, и то, что «дефицит» на деле не подтверждён.

---

## 1. Доля и объём: сколько стоят изыскания и кто их делает

### 1.1 Расценки (первичные/отраслевые)
- **Индия, LiDAR-съёмка коридора ЛЭП: ₹15 000–40 000 за км** («indicative estimates only»). Дрон-LiDAR коридор ₹8–25 тыс./км. Источник: Garud Survey, «LiDAR Survey Cost Per Kilometer in India 2026», https://garudsurvey.com/lidar-survey-cost-per-kilometer-in-india-2026-guide/ (2026).
- **Стоимость линии (Индия, ориентир CERC 2015):** 400 kV D/C Quad Moose ≈ ₹101 лакх/цепь-км; 765 kV S/C ≈ ₹159 лакх/км. Источник: CERC Order, Petition 256/TT/2013, https://www.cercind.gov.in/2015/orders/SO256.pdf (2015). Более свежего единого бенчмарка в открытом доступе **не нашёл**; современные цифры выше (допущение: ₹2–4 крор/км для 765 kV D/C).
- **Расчёт (допущение):** LiDAR-съёмка ₹15–40 тыс./км против ₹1–3 крор/км линии → **0,005–0,04 % CAPEX**. Даже с полным пакетом detailed survey (трассировка, профилирование, tower spotting, удельное сопротивление грунта, геотехника) доля изысканий вряд ли превышает **0,5–1 %** (допущение; прямого % по ЛЭП в источниках нет — «не нашёл»).
- **США (ориентир):** topographic route survey full ROW с LiDAR — $72 775; ROW-съёмка ~$20 007/милю. Источник: US DOT ROSA-P, «Applying UAS LiDAR for Developing Small Project Terrain Models», https://rosap.ntl.bts.gov/view/dot/77194.
- **ЦОД:** топосъёмка коммерческого участка $1 500–30 000+; для кампуса 200–1000 акров «существенно выше», но конкретики нет. Источники: The Future 3D, https://www.thefuture3d.com/learn/topographic-survey-cost-guide/; EPCLand, https://epcland.com/topographical-surveys-data-centre/. На фоне CAPEX гипeрскейл-кампуса ($1 млрд+) доля — **сотые доли процента** (допущение).

### 1.2 Как закупается
- **Индия — отдельная закупка, но по L1.** RECPDCL (дочка REC, координатор торгов TBCB) объявила эмпанелмент survey-агентств: этап 1 — трассировка и выбор ≥4 альтернативных площадок ПС; этап 2 — аэро-LiDAR и фотограмметрия дронами, ортофото, DSM/DTM, GIS-база. Срок подачи 04.07.2026, эмпанелмент на 2 года, **6 schedules, L1 определяется отдельно по каждому**. Суммы не раскрыты. Источник: T&D India, https://www.tndindia.com/recpdcl-to-empanel-survey-agencies-for-power-transmission-projects-under-tbcb/ (2026).
- **POWERGRID (Khammam-II–Pendurthi 765 kV):** detailed survey (route alignment, profiling, tower spotting, soil resistivity, геотехника) включён в **scope EPC-тендера**, срок 07.04.2026. Источник: Mercom India, https://www.mercomindia.com/powergrid-floats-ists-tender-to-evacuate-power-from-green-hydrogen-projects (2026).
- **Саудовская Аравия — отдельных survey-тендеров SEC/Saudi Energy не нашёл.** ЛЭП 380 kV закупаются как EPC (Hyundai E&C — $389 млн на два контракта, 40 проектов ЛЭП в КСА; L&T — EPC подстанций). Местный EPC Al Sharif Contracting указывает route survey в собственном перечне работ. Источники: Hyundai E&C, https://en.hdec.kr/en/newsroom/news_view.aspx?NewsSeq=1212; Al Sharif, https://alsharifgroup.com/asc.html. **Вывод:** в Заливе survey — субподряд/внутренний scope EPC, не отдельный оплачиваемый заказчиком слой.
- **DEWA:** 21 контракт на ~AED 3 млрд ($817 млн) на ПС 132 kV и кабели (июль 2026); survey-тендеров **не нашёл**. Источник: SaudiGulf Projects, https://www.saudigulfprojects.com/2026/07/dewa-awards-21-contracts-worth-aed-3-billion-for-132kv-substations-and-transmission-cable-projects-in-dubai/.
- **TNB (Малайзия):** отдельных survey-тендеров **не нашёл**; TNB использует LiDAR/гиперспектр (THySIS) и мобильный LiDAR (Riegl VMQ-1 HA) для инвентаризации; подрядчик по сбору данных активов имел разрешение JUPEM (Geospatial Defense Division). Источники: TNB, https://www.tnb.com.my/sustainability/sustainable-grid-management; ISPRS Archives XLVI-4/W3-2021, https://isprs-archives.copernicus.org/articles/XLVI-4-W3-2021/239/2022/.

---

## 2. Лицензирование: может ли иностранная фирма делать изыскания

### 2.1 КСА — GEOSA
- GEOSA (ex-GCS) регулирует съёмку, геопространственную информацию и аэрофотосъёмку, кроме Минобороны. **8 июля 2025** запущена Geospatial Licensing and Permitting System; лицензированию подлежат «все организации, занимающиеся surveying и geospatial activities полностью или частично, включая компании, консалтинговые и инженерные фирмы и подрядчиков». Источники: SPA, https://www.spa.gov.sa/en/N2353775 (2025); Asharq Al-Awsat, https://english.aawsat.com/business/5162515-...; GEOSA, https://geosa.gov.sa/en/About/activities/Pages/default.aspx; портал https://geo-licensing.geosa.gov.sa/ (503 при попытке доступа).
- Классы лицензий, требования к иностранным компаниям, число лицензиатов — **не нашёл** (портал недоступен, пресс-релизы без деталей).
- FIG Congress 2026 (Alshahrani, Clarke et al., «Concept of Land Survey for the KSA», https://fig.net/resources/proceedings/fig_proceedings/fig2026/papers/ts07a/TS07A_alshahrani_clarke_et_al_13879.pdf, май 2026): текущие проблемы КСА — «Variations in survey practices», «Absence of a unified national survey manual», «Inconsistent accuracy classifications», **«Variable professional competency levels»**, «Limited systematic QA/QC»; в планах GEOSA — «Licensing and classification of surveyors and companies», «Professional competency requirements», field audit. Цифр по числу геодезистов/выпускников в статье **нет**. Косвенное подтверждение проблемы качества кадров, но не дефицита.

### 2.2 ОАЭ (Дубай)
- Деятельность «Geodetic engineering surveying» (код 7110.55) лицензируется DED/DET (mainland) или фризоной; инженерная фирма должна быть в реестре консультантов/подрядчиков Dubai Municipality; экспаты-специалисты — с аттестованными и зарегистрированными в DM квалификациями; кадастровые съёмки — только утверждённые DM геодезисты. Стоимость лицензии AED 12–30 тыс./год, срок 2–4 недели. Источники: Meydan FZ, https://www.meydanfz.ae/activity-hub/geodetic-engineering-surveying-services-license-in-dubai; DM, https://www.dm.gov.ae/municipality-business/consultants-contractors-and-suppliers-data/. Первичного регламента DM с квалификационными требованиями **не нашёл**; запрета для иностранных фирм не видно — барьер низкий.

### 2.3 Индия — Geospatial Guidelines 2021 (первоисточник DST F.No.SM/25/02/2020, 15.02.2021)
- Порог точности: **1 м по горизонтали / 3 м по вертикали**. Данные точнее порога **могут создаваться и принадлежать только Indian Entities** и храниться/обрабатываться в Индии (п. vii, ix).
- **Ground truthing, доступ к CORS и RTK-сервисам — только Indian Entities** (п. vi-a). Terrestrial Mobile Mapping, Street View, съёмка в территориальных водах — только Indian Entities независимо от точности (п. vi-b).
- Иностранные и иностранно-контролируемые компании могут лишь **лицензировать** такие данные у индийских сущностей через API, без перепродажи (п. viii).
- Источник: https://dst.gov.in/sites/default/files/Final%20Approved%20Guidelines%20on%20Geospatial%20Data.pdf.
- **Вывод:** инженерная съёмка (см-дм точность) в Индии иностранной фирмой в поле — фактически невозможна; только через индийское юрлицо, контролируемое индийскими гражданами.

### 2.4 Малайзия — Licensed Land Surveyors Act 1958, поправки 2024
- Поправки вступили в силу **23.10.2024**: эксклюзивное право LLS на airborne, hydrographic, BIM, GIS, terrestrial и topographic surveys, подаваемые в госорганы; штраф до RM 250 000 / 3 года. В полуостровной Малайзии ~**456 LLS**; ~977 членов IGRSM и 100+ гидрографов вне лицензии протестуют против «bottleneck». Источник: The Star, 03.10.2024, https://www.thestar.com.my/news/nation/2024/10/03/amendment-to-land-surveyors-act-1958-restricts-national-development-argue-geospatial-professionals; протест IGRSM, https://mycoordinates.org/formal-protest-regarding-the-gazettement-of-the-amendment-to-the-licensed-land-surveyors-act-1958-...
- **Вывод:** барьер высокий, но это дефицит *лицензий*, а не техников; иностранцу — только под подписью LLS.

---

## 3. Дефицит и локализация

### 3.1 Дефицит — доказательства слабые
- **КСА, зарплаты:** объявления — 2 500–4 000 SAR/мес + жильё (Layboard, https://layboard.in/vacancies/jobs-in-saudi-arabia/for-speciality/land-surveyor); ERI — средняя 147 263 SAR/год, entry 106 744, senior 182 173 (https://www.erieri.com/salary/job/land-surveyor/saudi-arabia, 2025). Разброс огромный; низ рынка — экспаты из Южной Азии по низким ставкам → признаков «дефицитной премии» нет.
- **КСА, найм:** AGBI, авг. 2026 — «hiring slows following giga-project rejig»; дефицит назван для MEP-специалистов, site supervisors и **quantity surveyors** (сметчики, не геодезисты). https://www.agbi.com/analysis/construction/2026/08/saudi-construction-hiring-slows-following-giga-project-rejig/. Индийский агрегатор говорит о «4 000+ вакансий Land Surveyor NEOM» (Indeed) — ненадёжный счётчик, не использовать как цифру.
- **Индия:** специфических данных о дефиците геодезистов **не нашёл**. Общие: 80 % работодателей испытывают нехватку талантов (Careers360/ManpowerGroup). RICS Surveying Skills Report 2025: >25 % считают нехватку критической — но RICS охватывает в основном built-environment/QS и UK-центричен. https://www.rics.org/content/dam/ricsglobal/documents/reports/Surveying-skills-report-2025.pdf.
- **Малайзия:** дефицит *лицензированных* LLS (~456) при наличии сотен нелицензированных специалистов — т.е. проблема регуляторная, а не кадровая.

### 3.2 Квоты — сильное подтверждение (КСА)
- **HRSD, Procedural Manual for the Saudization Resolution of Technical Engineering Professions** (постановление № 103105 от 26.01.2025), https://www.hrsd.gov.sa/sites/default/files/2025-03/Procedural%20Manual%20for%20the%20Saudization%20Resolution%20of%20Technical%20Engineering%20Professions.pdf:
  - 30 % саудизации по целевым профессиям, поэтапно за 5 лет с 27.07.2025;
  - применяется ко всем частным предприятиям с **5+ работниками** в целевых профессиях;
  - засчитывается саудовец с зарплатой в GOSI **≥ 5 000 SAR** и **аккредитацией Saudi Council of Engineers**;
  - Таблица 1 включает: **Land Surveyor (216507), Geodetic Surveyor (216503), Aerial Surveyor (216501), Mining Surveyor, Photogrammetric Surveyor, General Surveyor (3212132), Assistant Surveyor (3212172), Surveying Technician (311211), Field Surveyor and Investigator (3212202), Digital Aerial Survey Mapping Technician (3212192), Digital Aerial Survey Equipment Operator, Geodesy Expert (2212201), Cartographer and Plans Draftsman** и др.
- Отдельно «инженеры» (46 профессий, 5+ инженеров): 25 % → 30 % к 30.06.2026, мин. зарплата 8 000 SAR. Источники: Fragomen (403 при доступе), Middle East Briefing, https://www.middleeastbriefing.com/news/saudi-arabias-nitaqat-2026-update-...; Corporate Immigration Partners, https://corporateimmigrationpartners.com/saudi-arabia-new-saudization-rates-impact-key-professions/.
- **Local Content (LCGPA):** формула включает зарплаты саудовцев и «capacity building» — обучение саудовцев, развитие поставщиков, R&D. Источники вторичные (Grant Thornton KSA, https://www.grantthornton.sa/en/insights/articles-and-publications/local_content_certification_lessons_from_early_movers_in_the_kingdom/; Setup in Saudi). Первичную методику LCGPA с весами **не нашёл**.

### 3.3 ОАЭ
- Эмиратизация: компании с 50+ квалифицированными сотрудниками — +2 % в год, 10 % к концу 2026; штраф AED 9 000/мес за незакрытую позицию в 2026. Источник: u.ae, https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/emiratis-employment-in-private-sector; Mercans. Отраслевых квот именно на геодезистов **нет**.
- ICV (MOIAT): зарплаты и обучение эмиратцев весят больше экспатских; бонус за рост числа эмиратцев. Источник: MOIAT ICV Supplier Certification Guidelines, https://moiat.gov.ae/-/media/site/moiat/microsite/icv/body/icv-supplier-certification-guidelines--moiat.ashx (веса не извлечены — допущение по вторичным источникам).

---

## 4. Технологический сдвиг
- **Спрос уходит в дрон-LiDAR/фотограмметрию:** RECPDCL требует именно «Aerial LiDAR and Photogrammetry survey using Drones» (см. 1.2); TNB — LiDAR/гиперспектр и мобильный LiDAR (см. 1.2). Индийские расценки на дрон-LiDAR — ₹8–25 тыс./км против ₹15–40 тыс. за «классический» LiDAR-коридор.
- **Civ Robotics:** Series A $7,5 млн (июль 2025, AlleyCorp, Bobcat, ffVC), всего $12,5 млн; CivDot — до 3 000 точек/день, 8 мм; >20 ГВт солнечных проектов, >10 млн точек; клиенты Bechtel, Boldt; расширение в EMEA. Источники: ENR, https://www.enr.com/articles/60976-...; The Robot Report, https://www.therobotreport.com/civ-robotics-spots-series-a-funding-automated-surveying/; CNBC 20.08.2025, https://www.cnbc.com/2025/08/20/these-little-robots-are-changing-the-way-solar-farms-are-built.html. **Новостей 2026 г. не нашёл** — статус на 2026 неизвестен. Фокус — разметка свай на солнечных полях; для трассировки ЛЭП/ПС применимость ограничена.
- **US DOT:** UAS LiDAR дешевле вертолётного LiDAR на ~$1 195/проект и дешевле классики на ~$10 539 (−20–25 %). https://rosap.ntl.bts.gov/view/dot/77194.
- **Вывод:** сдвиг не отменяет людей, но меняет профиль: нужны операторы дронов (в Индии — с лицензией DGCA, допущение), обработчики облаков точек, GIS. Методика «быстрого ввода техников на сложном оборудовании» из ж/д Испании должна быть переориентирована на дрон/LiDAR-стек — иначе учит вчерашней профессии. Одновременно дронизация **снижает** число полевых часов на км и, соответственно, число техников — против тезиса о дефиците.

---

## 5. Вендорский канал (Trimble / Leica / Topcon)
- **Trimble КСА — Al Jehat (JATCO):** представитель Trimble/Nikon/Spectra; проводит семинары и обучение (Trimble Express ~200 участников). https://jatco.com.sa/geometics-technology-trimble/; Geospatial World, https://geospatialworld.net/news/trimble-express-in-saudi-arabia/.
- **Trimble Индия — AllTerra Solutions LLP** (официальный партнёр), https://allterra.co.in/. Сеть Trimble Geospatial — 400+ дистрибьюторских точек «с обучением, ремонтом и поддержкой». https://geospatial.trimble.com/en/where-to-buy.
- **Leica КСА — SITML** (эксклюзив), точки продаж Эр-Рияд/Джидда/Даммам/Медина, **собственный учебный центр** и сертифицированные мастерские. https://sitml.com/about-leica-geosystems-and-sitml/.
- **Платят ли вендоры партнёрам за enablement** — **не нашёл**. Наблюдение: дистрибьюторы сами продают обучение как часть сервиса, т.е. это конкурирующий канал, а не источник выручки для сторонней методики.
- Topcon в регионе — не искал (лимит запросов).

---

## 6. Сделки: покупают ли «людей и полевой слой» дорого
| Сделка | Сумма | Что купили | Источник |
|---|---|---|---|
| Acuren → NV5 Global (закрыта 04.08.2025) | ~$1,7 млрд (вкл. долг; $618,7 млн cash + 79 млн акций) | NV5 целиком — TIC + геопространственные + консалтинг; не «чистый» survey | SEC 10-K TIC Solutions FY2025, https://www.sec.gov/Archives/edgar/data/2032966/000162828026017015/tic-20251231.htm |
| Bowman → Surdex (04.2024) | $44 млн при NSB run-rate ~$28 млн (**≈1,6× выручки**) | аэросъёмка/LiDAR, 10 самолётов | Bowman PR, https://bowman.com/news/bowman-enters-into-definitive-agreement-to-acquire-surdex-corporation-... |
| Bowman → Smith & Associates Land Surveying (05.2026) | не раскрыта | локальная survey-фирма (осн. 2018) | Investing.com |
| Bernhard Capital → Bowman (08.2026) | $1 млрд, $43/акц., премия 57,9 % | инжиниринг+survey, take-private | InsideArbitrage, https://www.insidearbitrage.com/2026/08/bernhard-capital-partners-to-acquire-bowman-consulting-for-1-billion/ |
| Woolpert → Bluesky International (05.2025) | не раскрыта | 100+ survey/mapping специалистов, UK | https://woolpert.com/news/woolpert-acquires-bluesky-international-... |
| Woolpert → Dawood Engineering (07.2025) | не раскрыта | 150+ инженеров/геодезистов, присутствие в т.ч. на Ближнем Востоке | https://woolpert.com/news/woolpert-acquires-dawood-... |
| Hexagon → B&A (07.2025) | не раскрыта | **продажа** non-core: геопространственное производство данных и IT-сервисы US Federal | https://hexagon.com/company/newsroom/press-releases/2025/hexagon-agrees-sale-of-non-core-business-areas |
| Fugro → Galt Geotechnics (07.2026) | не раскрыта | геотехника, Австралия | Fugro business news |

**Вывод:** покупают консолидированные платформы (мультипликатор ~1,6× выручки у Surdex — умеренно, не «дорого»); Hexagon, наоборот, **избавляется** от сервисов по производству данных как non-core. Сделок по покупке survey-фирм в Заливе/Индии **не нашёл**. «Люди и полевой слой» сами по себе премии не получают — премию получают данные/ПО/аэрофлот и госконтракты.

---

## 7. Что осталось непроверенным (явно)
- Реальный % изысканий в CAPEX ЛЭП/ПС/ЦОД по первичным сметам — не найден; оценка 0,1–0,5 % — допущение.
- Классы лицензий GEOSA и допуск иностранных компаний — портал недоступен.
- Требования SCE к аккредитации техников-геодезистов (образование/стаж/экзамен) — не проверял; это ключевое препятствие для «быстрого ввода».
- Веса LCGPA/ICV за обучение — только вторичные источники.
- Статус Civ Robotics на 2026 — нет новостей.
- Topcon-канал, оплата enablement партнёрам вендорами — не найдено.
- Данные по дефициту геодезистов в Индии — не найдено.

## 8. Рекомендация скептика
Не строить продукт вокруг «дефицитного и дорогого слоя изысканий» — его нет. Есть узкая, но настоящая регуляторная боль в КСА: 30 % саудовцев на профессиях геодезистов/техников + аккредитация SCE + баллы Local Content. Проверять дальше именно её: (1) у 5–10 саудовских EPC/консультантов (Al Sharif, AJEC, GeoReference и т.п.) — сколько у них survey-позиций и как закрывают квоту; (2) требования SCE к аккредитации техника; (3) готовность SITML/JATCO делить обучение. Индия — только через индийскую сущность; Малайзия — через LLS. Методику переориентировать на дрон-LiDAR/GNSS-стек.
