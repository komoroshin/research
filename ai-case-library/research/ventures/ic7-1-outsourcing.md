# IC7-1 · Проверка критерия фальсификации: «дефицит сетевых инженеров уже конвертируется в аутсорс проектирования»

Дата проверки: 01.09.2026. Роль: исследователь-скептик. Метод: веб-поиск (≈45 запросов + ~25 выгрузок первоисточников; лимит поисков сессии исчерпан на финальном этапе — часть пунктов помечена «не нашёл»).

## 0. Вердикт

**Частично подтверждено / частично опровергнуто (по компонентам):**

| Компонент утверждения | Статус | Одной строкой |
|---|---|---|
| Utilities реально отдают grid-design внешним фирмам, есть контракты/суммы/сроки | **Подтверждено** | BC Hydro→Stantec CAD$186M/7–20 лет (2024); Xcel→MYR design-build $500M+/5 лет (2025); National Grid ETP £8bn/130 подстанций (2025); NV5 $5M дизайн ВВ-подстанций для ЦОД (2025); муниципальные RFP на дизайн подстанций с фикс-сроками (WEC 2026, Mason PUD 2025). |
| «Покупают мощность, а не держат вакансии» — т.е. аутсорс *растёт как ответ на дефицит* | **Неясно** | Прямых данных о росте доли аутсорса в дизайне (in-house vs contractor %) **не нашёл**. Аутсорс дизайна — давняя практика (Leidos 70+ лет, Osmose 90 лет), а не новая реакция на дефицит. |
| Отдают **офшорным** фирмам (Cyient/Infosys/индийские бюро) напрямую | **Опровергнуто (для utilities)** | Не нашёл ни одного публичного контракта utility США/UK/ЕС напрямую с офшорной фирмой на substation/interconnection design. Офшор существует, но **внутри** больших пятёрок (B&McD India 1 900+ чел., L&T-S&L, WSP GCC 5 500+, AECOM Enterprise Capabilities). Офшорная маржа уже захвачена инкумбентами. |
| Вход новым/мелким вендорам открыт | **Опровергнуто для transmission-utilities; открыт для муни/коопов и девелоперов** | Approved-vendor-листы TO: FirstEnergy — **5** фирм на substation electrical design (02.2026), AEP — **14** (2022). Регион-эксклюзивные партнёрства National Grid до 2031. Зато коопы/муни закупают через открытый RFP по RUS Form 236; девелоперы/ЦОД покупают у фирм на 50–130 инженеров (Keentel, Pure Power, NV5). |
| Дефицит задокументирован и влияет на сроки | **Подтверждено (дефицит); слабо (влияние на сроки дизайна)** | 89% работодателей T&D-строительства — трудности найма (DOE USEER 2025); 96% участников ENTSO-E — нехватка уже тормозит (05.2025); 40% power-executives — трудности найма (Kearney/IEEE, 10.2025). Но публичные кейсы «проект задержан из-за нехватки проектировщиков» — **не нашёл**; в кейсах ЦОД задержки атрибутируются трансформаторам (120–160 недель) и пермитам, не дизайну. |

**Суть для гипотезы:** спрос на «проектную мощность» реален и оплачивается — но у *utilities* он закрывается многолетними рамочными MSA с 5–14 квалифицированными инкумбентами, у которых офшор уже встроен. Реалистичная точка входа — **не** IOU/TSO, а (а) девелоперы генерации/BESS и ЦОД, (б) муни/коопы с открытыми RFP, (в) субподряд у инкумбентов. «Фиксированный срок и цена» — норма для муни-RFP (WEC требует «priced not to exceed» и график с датами), т.е. формат покупки уже принят рынком.

---

## 1. Факт аутсорса: контракты utilities внешним фирмам

### 1.1. Найденные контракты с суммами/сроками

| Заказчик | Подрядчик | Что | Сумма / срок | Дата | Источник |
|---|---|---|---|---|---|
| BC Hydro (Канада, госutility) | Stantec | MSA: T&D engineering **включая substation design**, электрика/механика/civil/геотех + PM, закупки, логистика; «от system studies до construction management» | **CAD$186M**, 7 лет, до 20 лет | 30.04.2024 | [Stantec/GlobeNewswire](https://www.globenewswire.com/news-release/2024/04/30/2872016/0/en/Stantec-selected-by-BC-Hydro-to-provide-Transmission-Distribution-Engineering-and-Project-Delivery-Services.html), [Canadian Consulting Engineer](https://www.canadianconsultingengineer.com/bc-hydro-selects-stantec-for-transmission-and-distribution-engineering/) |
| BC Hydro | AtkinsRéalis | 7-летний MSA engineering & project delivery | сумма не раскрыта | 11.12.2024 | [AtkinsRéalis](https://www.atkinsrealis.com/en/media/trade-releases/2024/2024-12-11) |
| Xcel Energy (IOU, США) | MYR Group (MYR Energy Services) | **Design-build** distribution MSA: пермиты, ROW, outreach, **design** и construction, несколько штатов | **>$500M**, 5 лет (до 2029) | 14.07.2025 | [Barchart/MYR PR](https://www.barchart.com/story/news/33393075/myr-group-inc-subsidiary-awarded-design-build-electric-distribution-master-service-agreement-with-xcel-energy) |
| LADWP (муни, США) | Stantec | 5-летний MSA | **$104M** | 15.08.2024 | [GlobeNewswire](https://www.globenewswire.com/en/news-release/2024/08/15/2930766/0/en/Stantec-selected-by-Los-Angeles-Department-of-Water-Power-for-5-year-US-104-million-Master-Services-Agreement.html) (профиль работ не проверен — допущение, что T&D входит частично) |
| Bonneville Power Administration (федеральная, США) | Burns & McDonnell | 5-летний EPC-контракт: greenfield-подстанции, расширения, ЛЭП, brownfield | сумма не раскрыта; 12.2020–2025 | 12.2020 | [POWER Mag](https://www.powermag.com/press-releases/burns-mcdonnell-selected-to-execute-engineering-procurement-and-construction-for-bonneville-power-administration/) |
| National Grid ET (UK TSO) | Balfour Beatty, Morgan Sindall, Murphy, M Group, OTW (регионы) + Linxon, Burns & McDonnell (национальные) | Electricity Transmission Partnership: ~**130 подстанций** до 03.2031; регион-эксклюзив «priority access» | **£8bn** (первые £1.3bn распределены) | 07–08.2025 | [Power Technology](https://www.power-technology.com/news/national-grid-partneship-substation-development/), [NCE](https://www.newcivilengineer.com/latest/national-grid-overhauls-supplier-strategy-to-fast-track-8bn-substation-projects-31-07-2025/) |
| National Grid ET (UK) | AECOM-Arup JV, WSP — **design & consenting partners**; 5 строительных | Great Grid Partnership (enterprise model) | часть **£9bn** supply-chain framework, до/после 2030 | 05.2024 | [National Grid](https://www.nationalgrid.com/responsibility/great-grid-partnership), [Solar Power Portal](https://www.solarpowerportal.co.uk/energy-policy/national-grid-launches-the-great-grid-partnership) |
| NIE Networks (UK) | тендер | Earthing design & consultancy framework | **£2.85M**, 05.2026–04.2031 (+до 2034) | 2025 | [Find a Tender 050480-2025](https://www.find-tender.service.gov.uk/Notice/050480-2025) |
| Consumers Energy (IOU, США) | Leidos | Field inspection + **design** distribution lines, рекондукторинг, relocations | не раскрыто | — | [Renewable Energy World](https://www.renewableenergyworld.com/power-grid/outage-management/leidos-helps-consumers-energy-improve-electric-distribution-reliability/) |
| City of Wayne, NE (муни) | DGR Engineering | инжиниринг Northeast Substation, раздельные пакеты на торги | **$673 000** | 17.04.2024 | [Wayne Daily News](https://waynedailynews.com/local-news/council-approves-engineer-for-northeast-substation-proposed-generation-plant/) |
| Washington Electric Coop (VT) | RFP | Substation engineering, design & CM для 2 подстанций 34.5/12.47 kV + TGFOV-защита на 5 | «priced **not to exceed**»; контракт 31.07.2026 → полный дизайн 01.11.2026 → IFC-чертежи 01.02.2027 | 22.06.2026 | [WEC RFP PDF](https://www.washingtonelectric.coop/wp-content/uploads/2026/06/WEC-RFP-For-Substation-Design-and-Upgrades-2026.pdf) |
| Mason County PUD (WA) | RFP | Полный дизайн новой 12.47/7.2 kV подстанции + фидеры + 2.5 мили оптики | сумма не раскрыта; дедлайн 31.08.2025 | 2025 | [NWPPA](https://www.nwppa.org/rfprfq/jorstad-substation-project-rfp-2025-jorstad/) |
| Middle Tennessee Electric (кооп) | RFP | EPC подстанции Barfield | — | 05.2025 | [MTE RFP](https://mte.com/sites/default/files/Documents/RFP%20Documents/MTE%20Barfield%20Substation%20EPC%20RFP.pdf) |

### 1.2. Owner's engineer vs detailed design — что именно отдают

- BC Hydro→Stantec и Xcel→MYR — **детальный дизайн + доставка проекта** (не только OE). WEC RFP — полный цикл: обследование, equipment list, чертежи, RFQ-пакеты, релейные уставки, пуско-наладка, PM. То есть коопы отдают **всё**, оставляя себе только роль владельца.
- National Grid ETP — регион-эксклюзивные EPC/строительные партнёры; design-партнёры (AECOM-Arup, WSP) выделены отдельно в GGP. Мелким дизайн-бюро в этой модели места нет, кроме субподряда.
- Утверждение о «росте доли аутсорса»: **не нашёл** ни одной публичной цифры «% инженерных часов utilities, отданных подрядчикам» (ни в Black & Veatch 2025 Electric Report, ни в GRC-показаниях PG&E, ни у EEI). Аутсорс дизайна — **давняя** практика: Leidos «70+ лет» дизайна распредсетей ([Leidos](https://www.leidos.com/markets/energy/power-delivery/distribution-line-design)), Osmose «90+ лет» ([Osmose](https://www.osmose.com/distribution-engineering-design)). Вывод: аутсорс — не *новый* ответ на дефицит, а базовая модель отрасли; дефицит его усиливает, но количественно это не показано.

### 1.3. Консолидация рынка (косвенное подтверждение ценности «проектной мощности»)

- WSP купила POWER Engineers за **US$1.78bn** (закрыто 01.10.2024), ~4 000 сотрудников, 50 офисов, выручка 2023 **$864.4M**, мультипликатор **15.2x EBITDA 2024E** (12.5x с синергиями) — [ENR](https://www.enr.com/articles/59127-design-giant-wsp-to-buy-power-engineers-inc-in-18b-cash-deal), [Construction Dive](https://www.constructiondive.com/news/wsp-power-engineers-acquisition/724273/), [WSP transcript](https://www.wsp.com/-/media/investors/events/global/us/2024/20240812-wsp-global-inc-power-acquisition-transcript.pdf).
- Burns & McDonnell: выручка 2024 **$7.2bn**, бэклог на входе в 2025 **$12bn** (рекорд) — [MatrixBCG summary](https://matrixbcg.com/blogs/growth-strategy/burns-mcdonnell) (вторичный источник, допущение о точности).
- 15x EBITDA за инженерную фирму T&D — рынок платит за *людей-часы в дефицитной дисциплине*; это подтверждает ценность «мощности», но и показывает, что инкумбенты её активно скупают.

## 2. Офшорная модель

### 2.1. Что нашёл

- **Офшор встроен в инкумбентов, а не покупается utilities напрямую:**
  - Burns & McDonnell India: Мумбаи с 2013, Бангалор с 2023, **1 900+ специалистов**, в т.ч. «Transmission & Distribution — designing resilient electrical grids» — [Tribune India, 10.07.2025](https://www.tribuneindia.com/news/business/burns-mcdonnell-india-engineering-excellence-in-a-thriving-workplace/).
  - L&T-Sargent & Lundy (JV с 1995, Vadodara/Faridabad) — [S&L](https://www.sargentlundy.com/news/lt-sargent-lundy-limited-marks-30-years-of-success/), [L&T-S&L T&D](https://www.lntsnl.com/sectors/transmission-distribution).
  - Black & Veatch Pune — офис, 2 000+ открытых вакансий в Индии (LinkedIn) — [Glassdoor](https://www.glassdoor.co.in/Jobs/Black-and-Veatch-Pune-Jobs-EI_IE3605.0,16_IL.17,21_IC2856202.htm).
  - WSP GCC India **5 500+** (2025–26), теперь с POWER Engineers в группе — [Revelio Labs](https://www.reveliolabs.com/companies/wsp-india/employees), [WSP India](https://www.wsp.com/en-in/hubs/power).
  - AECOM Enterprise Capabilities: Индия, Китай, Испания, Польша, Румыния, ЮАР, Филиппины — «around-the-clock project support» — [AECOM](https://aecom.com/press-releases/aecom-strengthens-its-india-business-with-new-executive-appointment/).
  - Jacobs: центры в Индии, Польше, Филиппинах, «remote design and modeling support» — [Jacobs India](https://www.jacobs.com/jacobs-india).
- **Cyient** (Хайдарабад): выручка FY25 **US$870M**, DET-сегмент **$688M** (−3% cc); utilities внутри вертикали Sustainability; Americas +8.3% — [Cyient Q4 FY25](https://www.cyient.com/news/cyient-announces-q4-and-annual-fy25-results-profit-up-32-per-cent-qoq-cash-position-strongest). Заявляет substation design и utility engineering ([Cyient Utilities Engineering](https://www.cyient.com/utilities/engineering)), но **ни одного именованного контракта с utility США/UK/ЕС на substation/interconnection design не нашёл** (не хватило поискового бюджета на финальный запрос — помечаю как «не проверено до конца»).
- Доля работы офшор / on-shore в T&D-дизайне: **не нашёл** отраслевых цифр. Единственный аналог — SBM Offshore (нефтегаз): индийский центр делает **70–80% detailed engineering** ([Outsource Accelerator](https://news.outsourceaccelerator.com/sbm-offshore-upgrades-india/)). Допущение: в T&D доля ниже из-за PE-подписи, стандартов конкретной utility и site visits, но подтверждений нет.
- **Ставки:** для инженерного дизайна энергетики офшорные $/час **не нашёл**. Прокси из софт-аутсорса: US fully-loaded **$80–150/ч** vs offshore **$20–45/ч**; Индия senior **$35–55/ч**; реальная экономия после overhead/rework на 30–45% меньше заголовочной — [Full Scale](https://fullscale.io/blog/comparing-offshore-software-development-rates-by-country/), [Second Talent](https://www.secondtalent.com/developer-rate-card/offshore-software-development/) (допущение: перенос на инжиниринг). Общая ESO-цифра «дифференциал 40–70%» — [market.us](https://market.us/report/engineering-services-outsourcing-market/) (маркетинговый источник, низкая надёжность).
- Локальные ставки США: Electrical Engineer Expert/Consultant в среднем **$80/ч** (Salary.com, 10.2025); 1099-консультанты power systems **$120–220+/ч** ([ZipRecruiter/агрегаторы](https://www.ziprecruiter.com/Salaries/Electrical-Consultant-Salary)); муниципальная rate schedule: Engineer III senior project **$190/ч**, Engineer IV **$206/ч** (2021–22) — [LaPorte Co. RDC](https://laporteco.in.gov/wp-content/uploads/2022/04/RDC-4.22.pdf).

### 2.2. Что остаётся on-shore
Прямых описаний split'а не нашёл. Из RFP WEC видно, что заказчик требует: визиты на площадку, координацию с оперативным персоналом, пермиты штата (Act 250), пуско-наладку, RUS-документацию — это по определению on-shore. PE-подпись — требование законодательства штатов (допущение общеизвестное; в RFP явно не процитировано).

## 3. Дефицит инженеров: свежие данные

| Показатель | Значение | Источник |
|---|---|---|
| Трудности с наймом, T&D + storage construction | **89%** работодателей «хотя бы некоторые трудности» | DOE USEER 2025 через [POWER Mag, 02.01.2026](https://www.powermag.com/bridging-the-gap-how-the-power-industry-is-tackling-its-workforce-crisis/) |
| Рост занятости T&D+storage 2024 | +2.7%, +38 100 рабочих мест | там же |
| Power-executives с трудностями найма | **40%** | Kearney/IEEE через [IEEE Spectrum, 06.10.2025](https://spectrum.ieee.org/power-engineering-workforce-gap) |
| Потребность в инженерах глобально к 2030 | **450 000–1.5 млн** | там же |
| Текучесть: сменили работу/ушли за 3 года | «почти половина» power-инженеров | там же (Kearney) |
| Срок закрытия вакансии (малая фирма Select Power Systems) | **6–9 месяцев** | там же |
| Срок закрытия (рекрутёр KORE1) | **5–8 недель** для mid/senior; senior utility «30–50 дней» | [KORE1, 08.2026](https://www.kore1.com/hire-electrical-engineer/) — **противоречит** предыдущему; допущение: рекрутёрская реклама занижает |
| Зарплаты power systems/utilities | mid $105–135K, senior $140–175K (нац.), +$10–25K specialty premium | KORE1 |
| Global: критические hiring bottlenecks | >50% из 700 компаний | IEA WEE 2025 через POWER Mag |
| Пенсионеры к молодым (<25) в grid-профессиях | **1.4 : 1** | IEA через POWER Mag |
| ЕС: нехватка уже тормозит энергопереход | **96%** из 150+ участников | [ENTSO-E, 16.05.2025](https://www.entsoe.eu/news/2025/05/16/electrifying-europe-industry-and-grid-operators-discuss-the-skilled-workforce-gap/) |
| ЕС: >90% TSO с дефицитом, задерживающим проекты; >45% workforce старше 50; +15–20% зарплат senior HV 2024–25 | заявлено | [EuroEngineerJobs](https://www.euroengineerjobs.com/article/1057/high-voltage-transmission-recruitment-in-2026-why-the-grid-skills-crisis-will-decide-the-energy-transition) — **без ссылок на первоисточники, низкая надёжность** |
| AEE 2025: планируют найм 42.6% (было 45.9%), 3/4 отмечают нехватку | 09.2025, 1 016 анкет | [Utility Dive](https://www.utilitydive.com/news/energy-sector-hiring-interest-shrank-jobs-workforce-aee-survey/761480/) — контрсигнал: найм замедляется при дефиците (бюджеты) |

**Влияние на сроки проектов из-за *проектирования*:** **не нашёл** ни одного задокументированного кейса. В кейсах ЦОД задержки атрибутируются трансформаторам (lead time ~50 нед. 2021 → ~120 нед. 2024, [DCK](https://www.datacenterknowledge.com/energy-power-supply/why-ai-data-center-projects-face-years-of-delays-after-approval); 140→150→160+ нед. 2023–2026, [enkiai](https://enkiai.com/data-center/data-center-power-crisis-2026-the-grid-bottleneck/) — вторичный), пермитам (29% milestone-changes), supply chain (23%). «Нехватка инженеров — менее заметный кризис» упоминается ([Spencer Ogden](https://www.spencer-ogden.com/insights/why-are-data-centers-waiting-years-for-a-grid-connection)), но без чисел. NERC/EPRI-данных по инженерам **не нашёл** (поисковый бюджет).

## 4. Цены-якоря и сроки

- **Дизайн подстанции (муни/кооп):** Wayne NE — **$673K** инжиниринг подстанции (2024). WEC — цена «not to exceed» по позициям: дизайн+чертежи+смета, equipment list, 2 RFQ-пакета, пермиты, релейные уставки, ПНР, график, PM — **на каждую подстанцию отдельно**; итог не раскрыт (RFP от 06.2026, вскрытие 07.2026).
- **Срок дизайна (WEC):** контракт 31.07.2026 → полные дизайны/списки/сметы **01.11.2026 (3 мес.)** → IFC-чертежи и bid-пакеты **01.02.2027 (6 мес.)**. Это и есть «фиксированный срок» на рынке коопов.
- **ВВ-подстанции для ЦОД:** NV5 — **$5M** за дизайн нескольких подстанций 120–345 kV (GA, NV): materials, design, construction oversight, commissioning, relay settings, SCADA/HMI, studies — [NV5 PR 09.06.2025](https://seekingalpha.com/pr/20129936-nv5-awarded-5-million-in-high-voltage-data-center-substation-design-services); аналогично $5M от NE-utilities (NY/NJ) — [TipRanks](https://www.tipranks.com/news/the-fly/nv5-global-awarded-5m-in-substation-design-contracts-by-northeast-utilities).
- **Interconnection (регуляторные) издержки, не консультант:** application fee PJM ~**$170K** за 10 MW vs ERCOT **$6 500** ([Anern](https://www.anernstore.com/blogs/costs-incentives-policy/stop-underestimating-interconnection-fees-delays) — вторичный); LBNL/DOE: solar **$509/kW**, wind **$504/kW**, storage **~$437/kW**, gas **$150/kW**; 1–50 MW **$763/kW** → 750+ MW **$244/kW** (через [Keentel](https://keentelengineering.com/interconnection-cost-estimation); первоисточник [LBNL 02.2026](https://eta-publications.lbl.gov/sites/default/files/2026-02/lbnl_2026.02.23_ba_interconnection_costs.pdf) — не удалось выгрузить, >10 МБ).
- **Консультантские цены на interconnection application / studies:** публичных прайсов **не нашёл**. Keentel: «typically weeks, not months», 51 инженер; Pure Power: PE-sealed SLD, PSCAD/PSS/E/ASPEN-модели, подача в utility, 2 ревизии включены, 130+ инженеров, 17 000+ проектов ([Pure Power](https://www.purepower.com/interconnection-services)); GreenLancer — «flat fees» для DG-масштаба ([GreenLancer](https://www.greenlancer.com/pv-interconnection)). Формат fixed-fee на пакет уже существует в нижнем сегменте.
- **UK NERS-аккредитация ICP (вход в contestable connections design):** **£5K** (только Design/PM) до **£15K+** (все скоупы до 132 kV) — [Eclipse Power](https://eclipsepower.co.uk/ners-accreditation/); администрирует LRQA ([LRQA](https://www.lrqa.com/en-gb/utilities/ners/register/)). Сроки аккредитации не нашёл.

## 5. Контраргументы: как utilities решают проблему на самом деле

1. **Рамочные MSA с крупными игроками, многолетние и региональные.** BC Hydro (7–20 лет), Xcel-MYR (5 лет, $500M+), National Grid ETP (£8bn, региональный эксклюзив до 2031), GGP (design partners = AECOM-Arup, WSP). Это прямо противоположно покупке «проектной мощности» у нового вендора: мощность законтрактована на годы.
2. **Закрытые approved-vendor-листы у transmission owners.**
   - FirstEnergy (PJM), список от **06.02.2026**: Substation Electrical Engineering/Design — **5 фирм** (Black & Veatch, Burns & McDonnell, GPD Group, Dashiell, ECI); Transmission Line Design — 4. Примечание FE: другие подрядчики допускаются, «as long as the design engineering … performed by one of the approved engineering contractors above or by internal FE personnel» — [PJM FE list](https://www.pjm.com/-/media/DotCom/planning/plan-standards/private-fe/fe-approved-vendors-and-contractors.ashx?la=en).
   - AEP Transmission (rev. 5, 24.06.2022): Station & T-line Engineering/Design — **14 фирм** (Beta, B&V, B&McD, Commonwealth, Dashiell, DiGioia Gray, ECI, HDR, Kiewit, Mesa, POWER, RCM, S&L, TRC). Есть оговорка: «Upon request from an Interconnection Customer, AEP will evaluate candidate contractors … not listed» — [AEP list](https://docs.aep.com/docs/requiredpostings/TransmissionStudies/docs/2022/AEPApprovedContractorsMajor-EquipmentVendors6-2022.pdf). PJM-механизм: TO может добавить контрактора, если Interconnection Customer докажет квалификацию ([Law Insider](https://www.lawinsider.com/dictionary/list-of-approved-contractors)) — т.е. **девелопер может протащить нового вендора**, но это его усилие и риск.
3. **Зарплатная гонка** — есть: 4.2% рост инженерных зарплат в 2026, до +10% senior в energy/utilities ([Addison Group](https://addisongroup.com/insights/engineering-hiring-trends-workforce-planning-guide-2026/)); «3 вакансии на 1 кандидата»; ЕС +15–20% senior HV (ненадёжный источник). Мелкие фирмы проигрывают: junior «poached within six months for $5 more an hour» (IEEE Spectrum). Это риск и для новой проектной организации — если ядро всё-таки требует людей.
4. **Собственные штаты** — растут (T&D +38 100 рабочих мест в 2024, USEER), но ограничены бюджетом (AEE: меньше планируют найм).
5. **Предквалификация**: Avetta/ISNetworld — платная регистрация «сотни-тысячи $ в год» сужает пул ([Billy](https://billyforinsurance.com/resources/billy-vs-isnetworld-vs-avetta-subcontractor-prequalification/)); RFP WEC требует 3 референса схожих проектов по RUS-стандартам, страховку GL $2M/$3M + excess $5M, key personnel фиксируются.
6. **Не нашёл:** данных о том, что utilities отказываются от новых вендоров *из-за* ИИ или, наоборот, ищут ИИ-ускоренный дизайн; данных о доле аутсорса; GRC-показаний с % contract engineering.

## 6. Девелоперы и ЦОД как более лёгкий клиент

- **Кто проектирует их сторону:** независимые фирмы среднего размера — NV5 ($5M, ЦОД-подстанции 120–345 kV), Keentel (51 инженер, POI substation design, P&C, studies, PJM/NYISO), Pure Power (130+ инженеров, interconnection packages, модели), Encompass (BESS interconnection, Painesville RFQ 02.2026), American Power Engineers, ENTRUST (проекты 20 MW–1 600 MW), SgurrEnergy/VDE (OE). Рынок **фрагментирован по факту**: десятки фирм на 50–150 человек, никто не доминирует (допущение на основе выборки; количественной карты рынка не нашёл).
- **Скорость найма подрядчика:** прямых данных «время от знакомства до контракта» **не нашёл**. Косвенно: муни-RFP WEC — от публикации до контракта **39 дней** (22.06→31.07.2026); Painesville BESS RFQ — открытая закупка. У девелоперов — нет approved-list, нет RUS; допущение: недели.
- **Option to build (FERC 2023/2023-A):** девелопер может сам строить stand-alone network upgrades (в т.ч. POI-подстанцию), но у AEP/FE — через approved-контракторов; 2023-A расширил на кластерные апгрейды при согласии всех ([FERC explainer](https://www.ferc.gov/explainer-interconnection-final-rule-2023-A)). Это открывает девелоперскую сторону, но дизайн TO-стороны всё равно в руках листа.
- **ЦОД:** «colocated/customer-owned substation» — операторы ЦОД сами строят подстанции ([Hanwha DC](https://www.hanwhadatacenters.com/blog/colocated-substations-for-data-centers-benefits-risks-strategy/)); GE Vernova предлагает «flexible service agreements» по дизайну ВВ-подстанций ЦОД ([GE Vernova](https://www.gevernova.com/grid-solutions/industries/data-centers)). PJM 01.2026: **21 GW** в статусе engineering/procurement + 8.2 GW в стройке ([enkiai](https://enkiai.com/ai-market-intelligence/grid-interconnection-delays-2026-a-threat-to-us-energy/) — вторичный).

## 7. Что не нашёл (явно)

- % инженерных работ utilities, отданных на аутсорс, и динамика (ни США, ни UK, ни ЕС).
- Хоть один прямой контракт utility США/UK/ЕС с индийской/вьетнамской фирмой на substation/interconnection design.
- $/час офшорного *энергетического* инженера (только софт-прокси).
- Публичные прайсы консультантов на interconnection study/package/substation design для девелоперов.
- Кейсы задержек проектов из-за нехватки *проектировщиков* (не оборудования).
- NERC/EPRI-данные по инженерам; Ofgem-статистику доли ICP в contestable connections; BDEW/VDE-цифры по Германии; Cyient-контракты с utilities NA; итог тендера Mason County PUD (Jorstad); статистику времени аккредитации NERS.

## 8. Итог для критерия фальсификации

Критерий «аутсорс уже есть, с контрактами, ценами и сроками» — **выполнен** на уровне utilities (крупные MSA) и коопов/муни (RFP с NTE-ценой и датами), и на уровне девелоперов/ЦОД (NV5 $5M, boutique-фирмы). Критерий «покупают мощность, а не держат вакансии» — **не доказан количественно**; аутсорс — базовая, а не растущая-от-дефицита модель. Критерий «в т.ч. офшорным фирмам напрямую» — **опровергнут**: офшор существует только внутри инкумбентов, т.е. маржинальный рычаг «ИИ вместо офшора» будет конкурировать с уже сложившимися индийскими центрами Burns & McDonnell / WSP / S&L / B&V, а не с дорогими on-shore часами. Вход к IOU/TSO закрыт approved-листами (5–14 фирм) и региональными эксклюзивами до 2031; открытый вход — коопы/муни (RFP, RUS Form 236) и девелоперы/ЦОД (без листов, fixed-fee уже норма).
