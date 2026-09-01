# IC7-2 · Проверка критерия фальсификации: «софт не коммодитизировал grid-проектирование, AI-native проектных фирм в энергетике нет»

Дата проверки: 01.09.2026. Роль: скептик, задача — опровергнуть утверждение.
Метод: веб-поиск (≈45 запросов + ≈25 выборок страниц). Ограничение: лимит поисков сессии исчерпан — часть пунктов помечена «не проверено».

---

## 0. Вердикт

**Утверждение опровергнуто наполовину.**

- **Часть A («софт не коммодитизировал работу») — ДЕРЖИТСЯ.** Всё, что продаётся сегодня, — либо предварительный/концептуальный уровень (Transcend: SLD + BOM + 3D-концепт «за часы» — но это *preliminary design*; SBS SubsGPT — 3D-концепт + КП), либо CAD-ускорители внутри инструмента инженера (Bentley OpenUtilities Substation+ — early access только с ноября 2025; ETAP 2026 CoPilot — ассистент внутри модели). Ни один продукт не выдаёт детальный проект с релейной защитой, расчётами КЗ, заземлением и спецификацией «под подпись». Софт-стартапы в этой нише не выросли в самостоятельных игроков — их **поглощают до масштаба** (RatedPower→Enverus 2022, Anderson Optimization→PVcase 2023, Pearl Street→Enverus 03.2025, SBS→Enverus 03.2026, все цены не раскрыты).
- **Часть B («AI-native проектных фирм в энергетике нет») — ОПРОВЕРГНУТА в смежном сегменте и под угрозой в целевом.** Marengo (YC, 2026) — прямо «AI-native engineering firm», проектирует ЦОДы «в 2 раза быстрее и в 2 раза дешевле», $4M design-партнёрств с двумя крупнейшими девелоперами. Vela Energy (YC W26) — ИИ-агенты делают инженерные исследования/пермиты для large-load проектов (ЦОДы, подстанции). ThinkLabs ($28M, 03.2026) работает с 10+ utilities и выступает как аналитический сервис, не только софт. **В узком целевом сегменте (техприсоединение / substation design как AI-native фирма) прямого конкурента я не нашёл** — но окно закрывается: за 12 месяцев (07.2025–08.2026) в соседних клетках появилось ≥4 новых игрока, а Black & Veatch 27.08.2026 открыл вакансию «AI Program Manager – Power Delivery & Grid» под ИИ-инструменты для проектирования ВЛ, подстанций и BESS.
- **Ключевой вывод для формы:** рынок голосует за **сервис**: WSP заплатил $1.78B за POWER Engineers (4,000 чел., 2024), H&MV Engineering оценён в €1.4B (08.2026, заголовок — содержание не проверено), PE-фонды скупают T&D-инжиниринг (Commonwealth Associates, GDS, Agbara — 2025–2026). Софт-сторона той же ниши: Aurora Solar — три волны сокращений подряд (2024, 2025, 10.2025) после оценки $4B; PVcase — $100M Series B, оценка выручки ~$35M (низконадёжный источник); Transcend — ни одного раунда с 08.2023.

Следствие для гипотезы: тезис «ИИ — внутренний рычаг маржи, не продукт» **не опровергнут и даже подкреплён**, но допущение «в нише пусто» неверно — окно узкое (≈12–24 мес., допущение) и его уже осваивают соседи (ЦОД-проектирование, interconnection studies).

---

## 1. Прямые кандидаты-занявшие

| Компания | Что реально делает | Деньги / статус | Закрывает ли нишу «grid-проектирование под ключ»? | Источник |
|---|---|---|---|---|
| **Transcend (TDG)** | Генеративный *preliminary design* для water/wastewater/power: SLD, BOM, 3D BIM/GA-чертежи. Заявка «-90% цикла проектирования». Utility Interconnection Hub (10.2024): утилита подписывается, девелопер генерирует «compliant collector substation design» и подаёт через сайт утилиты. | $33–35M всего; Series B $20M (08.2023, Autodesk в раунде); инвестиция National Grid Partners (2024, сумма не раскрыта); ~100 сотрудников. **Ни одного раунда с 08.2023.** | **Нет.** На странице кейсов — 1 power-кейс (без цифр, 02.2024) против 11+ water. Продукт = предпроект, не рабочка. | [BusinessWire 03.08.2023](https://www.businesswire.com/news/home/20230803972843/en/Transcend-Raises-$20M-Series-B-to-Automate-Critical-Infrastructure-Design), [Tracxn](https://tracxn.com/d/companies/transcend/__9e7v8evHq3kHu23dTDZlGjoqWK3tIL5WkedxD0lH0Cc), [transcendinfra.com/power-industry](https://transcendinfra.com/power-industry/), [UIH 15.10.2024](https://transcendinfra.com/transcend-announces-the-utility-interconnection-hub-advancing-grid-access-for-renewable-energy-projects/), [case studies](https://transcendinfra.com/case-studies/), [Global Venturing/NGP](https://globalventuring.com/corporate/energy-and-natural-resources/ai-tools-can-remake-the-grid-rather-than-break-it-says-national-grid-partners/) |
| **Augmenta** | Не grid. Автоматическая 3D-трассировка кабельных лотков/conduit в Revit для зданий (ЦОДы, больницы, школы); «в 3 раза быстрее ручного». Клиенты — подрядчики. | $37.5M всего за 6 раундов; $10M seed 03.2025 (Prelude); **не куплена** (проверено — только раунды). | **Нет.** Здания, не сети; продукт — CAD-ускоритель для электромонтажников. | [GlobeNewswire 12.03.2025](https://www.globenewswire.com/news-release/2025/03/12/3041392/0/en/Augmenta-Secures-10-Million-USD-in-Funding-to-Pioneer-AI-Driven-Building-Design.html), [ConstructConnect 09.02.2026](https://canada.constructconnect.com/dcn/news/technology/2026/02/how-augmentas-ai-is-rewriting-electrical-pre-construction), [Tracxn](https://tracxn.com/d/companies/augmenta-ai/__xe8FokQJsTF0oci2bxJ-iHsmBVqZDxH1oUfcaWIXH_4) |
| **RatedPower (Enverus)** | PV-plant design; модуль подстанции: single/double busbar, line-to-transformer, размер трансформатора, потери, Flexible Interconnection Schema (несколько SBS/подстанций), «automated substation engineering and SLD generation for transmission-level interconnection». | Куплена Enverus 14.09.2022, цена не раскрыта; на момент сделки 1,400 пользователей, 20,000 проектов. | **Частично**: SLD и схема ПС для солнечной станции. Не делает: РЗА, КЗ, заземление, рабочку, техприсоединение как процесс. | [ratedpower.com/platform/substation](https://ratedpower.com/platform/substation/), [TechCrunch 14.09.2022](https://techcrunch.com/2022/09/14/enverus-acquires-solar-planning-solution-ratedpower/) |
| **Pearl Street (Enverus)** | SUGAR (power-flow engine) + Interconnect: автоматизация *interconnection studies* для ISO/utilities/девелоперов; «до 200x быстрее», >300 GW обработано; MISO внедряет для Phase 1 (цель — mid-Q1 2025), софт запускают сотрудники MISO сами. | Куплена Enverus 13.03.2025, цена не раскрыта. Инвесторы: VoLo Earth, Pear VC, Powerhouse, Incite. | **Нет** — это studies (сетевые расчёты), не проектирование подстанции/присоединения. Но съедает часть «инженерного» value chain. | [Enverus newsroom](https://www.enverus.com/newsroom/undo-the-queue-enverus-acquires-pearl-street-technologies-to-solve-for-a-more-reliable-resilient-grid/), [MISO collaboration](https://pearlstreettechnologies.com/miso-collaboration/), [Crunchbase](https://www.crunchbase.com/acquisition/enverus-acquires-pearl-street-technologies--429dcdcd) |
| **Nira Energy** | Карта доступной мощности по точкам присоединения (shadow-studies MISO и др.); >50 девелоперов, 5 из 10 крупнейших в США; >300 GW заявок. Заменяет консультанта на этапе *поиска площадки* («недели и десятки тысяч $»). | Seed YC 2022 ($500k); **$65.5M seed 13.06.2025** (Energize Capital + 3 конфиденциальных) — единственный источник, противоречит Crunchbase/StartupHub ($12M total) → **низкая надёжность**. | **Нет** — prospecting, не проектирование. | [Canary Media](https://www.canarymedia.com/articles/transmission/its-hard-to-connect-clean-power-to-the-grid-new-software-can-help), [SignalBase](https://www.trysignalbase.com/news/funding/nira-energy-secures-655m-seed-round-to-map-the-future-of-renewable-energy-development), [StartupHub](https://www.startuphub.ai/startups/nira-energy) |
| **Neara** | Физический digital twin ЛЭП; overhead line design, трассировка, структурный расчёт; «planning and design in weeks, not months». 90% выручки — за рубежом. | Series D A$90M, 10.02.2026, лид TCV; всего ~A$180M; оценка A$1.1B. | **Частично** для ВЛ (линии), не для подстанций/присоединения. Это инструмент для утилит, не проект под ключ. | [pv magazine AU 11.02.2026](https://www.pv-magazine-australia.com/2026/02/11/neara-closes-90-million-series-d-funding-round-reaches-1-1-billion-valuation/), [neara.com/transmission-design-optimization](https://neara.com/transmission-design-optimization/) |
| **SBS / Spatial Business Systems** | AUD (Automated Utility Design), SDS (Substation Design Suite), BSD (BIM Substation Designer), SubsGPT: генерирует 3D-концепт ПС по стандартам, КП с чертежами, BIM-модель, BOM; «до 90% сокращения цикла». Работает on-prem у клиента. | Принадлежала Peak Rock Capital; **Enverus объявил покупку 04.03.2026**, закрытие Q2 2026, цена не раскрыта. | **Частично**: физическая 3D-компоновка + спецификация. Не РЗА/КЗ/заземление (на сайте не заявлено). Ключевой сигнал: **это самый продвинутый «генератор подстанций» и он продан data-платформе, а не вырос сам.** | [Enverus 04.03.2026](https://www.enverus.com/newsroom/enverus-to-acquire-sbs-to-power-ai-driven-utility-planning-and-engineering/), [spatialbiz.com/technology-ai](https://www.spatialbiz.com/technology-ai/) |
| **Bentley OpenUtilities Substation+** | Model-based ПС-дизайн с «agentic AI»: запрос критериев на естественном языке, кросс-проверка свойств оборудования, расчёт «специализированных значений», поиск по каталогу, расстановка компонентов, placeholder-геометрия. Инженер — «expert supervision». | Анонс 15.10.2025 (YII Amsterdam), **early access с ноября 2025**; клиентов не названо (06.2026 — по-прежнему early access). | **Нет** — CAD-копилот. Но это инкумбент-вендор, который даёт инкумбентам-фирмам рычаг маржи. | [BusinessWire 15.10.2025](https://www.businesswire.com/news/home/20251015714746/en/Bentley-Systems-Advances-Infrastructure-AI-with-New-Applications-and-Industry-Collaboration), [Construction&Property 04.06.2026](https://construction-property.com/bentley-systems-unveils-ai-powered-software-to-accelerate-substation-design/) |
| **ThinkLabs AI** | Physics-informed AI-симуляция сети: «месячное исследование за <3 мин», 10M сценариев за 10 мин, точность >99.7% power flow; 10+ utilities, удвоение аккаунтов за Q1 2026. Для девелоперов — «approach utilities through the company» (сервисный элемент). | Series A $28M, 31.03.2026, лид Energy Impact Partners, NVentures (NVIDIA), Edison International. | **Нет** — планирование/операции сети, не проект. | [GlobeNewswire 31.03.2026](https://www.globenewswire.com/news-release/2026/03/31/3265239/0/en/thinklabs-ai-closes-28-m-series-a-led-by-energy-impact-partners-backed-by-nventures-and-edison-international.html), [Microgrid Knowledge 07.04.2026](https://www.microgridknowledge.com/design-engineering/article/55368986/how-microgrid-and-der-developers-can-collaborate-with-nvidia-backed-ai-company-to-speed-grid-interconnection) |
| **Piq Energy** | Агентная платформа: параллельный запуск load-flow, production-cost, EMT-исследований поверх существующих инструментов (не заменяет их); >1,000 сетевых моделей, >10,000 workflow. | Seed $5M, 08.07.2026 (Active Impact); основана 2023, из стелса 2025; клиенты/выручка не раскрыты. | **Нет** — studies. | [Kurrant 08.07.2026](https://kurrant.com/kurrantly-news/piq-energy-raises-5-million-seed-to-accelerate-grid-interconnection-studies/) |
| **Vela Energy** | «AI execution agents for large-load energy projects»: закупки, пермиты, инженерные исследования для ЦОДов/заводов/новых подстанций. | YC W26, pre-seed $1.3M. | **Ближайший по духу** к «техприсоединение как сервис» — но на pre-seed, детали продукта не проверены (страница YC 404). | [yespress.io](https://yespress.io/vela-yc-w26) (только сниппет; полный текст 403) |
| **Tapestry (Google X) + PJM** | Единая сетевая модель PJM, ИИ для обработки заявок на присоединение; фазы с 2025; PJM оперирует сам; «очень сложно сейчас количественно сказать, чего достигнем» (PJM). | Многолетнее партнёрство, 10.04.2025. | **Нет** — инструмент оператора. Косвенно ускоряет очередь → больше проектов → больше спроса на проектирование. | [Utility Dive 10.04.2025](https://www.utilitydive.com/news/pjm-google-tapestry-grid-interconnection-ai/744982/) |
| **P-1 AI (Archie)** | Агентный ИИ-инженер для hardware: механика, электрика, тепло, гидравлика, системы; партнёры — OEM в data-center cooling и critical power; демо на COMPUTEX 2026 под NVIDIA DSX. | Seed $23M (2025, Radical), Series A $50M, 29.07.2026 (NEA, Jeff Immelt в борде). | **Нет** — продуктовое проектирование, не сети. Но показывает, что VC верят в «AI-инженер» как продукт. | [GlobeNewswire 29.07.2026](https://www.globenewswire.com/news-release/2026/07/29/3335235/0/en/engineering-ai-startup-p-1-ai-announces-its-series-a-financing-led-by-nea-adding-jeff-immelt-to-the-company-s-board.html) |

**Не найдено** (искал): стартап, заявляющий «generative interconnection design» / «AI substation detailed design» с релейной защитой и рабочей документацией. Попадались только SBS SubsGPT (концепт), Bentley (копилот), Transcend (предпроект), GPT-обёртки (yeschat «Substation Design GPT», ChatDiagram — игрушки).

---

## 2. Насколько глубоко автоматизировано (что делает софт, что осталось руками)

| Задача | Состояние автоматизации | Источник / комментарий |
|---|---|---|
| Single-line diagram | Генерируется: RatedPower (для PV-ПС), Transcend TDG, ETAP 2026 («SLD из RESTful API»), IEEE-работы по автогенерации из CIM. | [ratedpower.com/platform/substation](https://ratedpower.com/platform/substation/), [ETAP 2026](https://etap.com/product-releases/etap-2026-release), [IEEE 8881340](https://ieeexplore.ieee.org/document/8881340/) |
| Компоновка/3D ПС, BOM | SBS SDS/BSD/SubsGPT — 3D-концепт + BOM «по стандартам»; Bentley Substation+ — расстановка компонентов, placeholder-геометрия; Transcend — GA/BIM. Все — **концепт/предпроект**. | см. табл. 1 |
| Power-flow / interconnection studies | Сильно автоматизировано: Pearl Street (200x, MISO), ThinkLabs (<3 мин), Piq (параллельные EMT/load-flow), Tapestry/PJM. | см. табл. 1 |
| Расчёты КЗ, arc-flash | Внутри ETAP/EasyPower/PowerFactory давно; ETAP 2026 добавил AI CoPilot + auto-complete и скриптовую автоматизацию studies. Стартапов «AI for short-circuit» **не нашёл** (поиск не выполнен — лимит). | [ETAP 2026 release 21.05.2026](https://etap.com/company/news/product-release-news/2026/05/21/etap-announces-etap-2026-powering-continuous-energy-intelligence) |
| Релейная защита: уставки, координация | Инструменты есть (ETAP Protection & Coordination, EasyPower, SEL/GE tooling с API), но **AI — только «augmentation layer», не замена детерминированной логики**; координация «требует обширного ручного анализа и трейд-оффов»; IBR/инверторная генерация ломает допущения классических уставок → больше, а не меньше инженерного суждения. Стартапов по AI-relay-coordination: **не найдено** (в выдаче доминируют зрелые инструменты). | [ScienceDirect, protection-grade AI framework, 2026](https://www.sciencedirect.com/science/article/pii/S259017452600543X), [ETAP P&C](https://etap.com/solutions/protection-coordination), [gitnux обзор 2026](https://gitnux.org/best/protection-relay-coordination-software/) |
| Заземление, молниезащита | Не проверено (лимит поисков). Допущение: CDEGS/ETAP GGS — расчёт есть, генерации проекта нет. | — |
| Спецификации/закупка, согласование с утилитой, штамп PE | Ручное. Bentley прямо формулирует роль инженера как «expert supervision». Transcend UIH и Tapestry автоматизируют *подачу/обработку*, но подпись и ответственность остаются на людях. | [Construction&Property 04.06.2026](https://construction-property.com/bentley-systems-unveils-ai-powered-software-to-accelerate-substation-design/) |

Сухой остаток: **автоматизирован «верх воронки» (studies, SLD, концепт-компоновка) и «низ» (CAD-ускорение). Середина — детальный проект с РЗА/КЗ/заземлением под ответственность PE — остаётся ручной инженерной работой.** Это ровно то место, где «ИИ как внутренний рычаг маржи» имеет смысл.

---

## 3. AI-native инжиниринговые фирмы в энергетике / AEC

| Фирма | Заявка | Модель | Деньги/тракция | Источник |
|---|---|---|---|---|
| **Marengo** (YC, 2026) | «AI-native engineering firm designing data centers in half the time and half the cost»; site due diligence → FEED → permitting design; 12 мес → 6 мес; «1,000 концептов параллельно vs 3–4». | **Инжиниринговая фирма**, ИИ — внутренний инструмент; «professional architects and engineers validate each output before delivery». Прямо та же форма, что в нашей гипотезе. | YC + a16z/Index scout funds + семейный офис $2B AUM; **$4M design-партнёрств с двумя крупнейшими девелоперами**; оценка рынка дизайна ЦОД $800B/год (12% от $6.7T capex — их допущение). | [YC launch](https://www.ycombinator.com/launches/SiK-marengo-accelerated-data-center-design), [YC profile](https://www.ycombinator.com/companies/marengo), [Dealroom](https://dealroom.co/news/talk-57EbJ0Buz-U-marengo-ai-accelerated-data-centre-design/) |
| **Vela Energy** (YC W26) | ИИ-агенты выполняют закупки, пермиты, инженерные исследования для large-load / подстанций. | Неясно (софт-агенты vs сервис) — не проверено. | Pre-seed $1.3M. | [yespress.io](https://yespress.io/vela-yc-w26) |
| **ThinkLabs AI** | «AI-native grid simulation» для 10+ utilities; для девелоперов — посредник к утилите. | Гибрид софт + анализ. | $28M Series A 03.2026. | см. табл. 1 |
| **Endra** (Швеция) | ИИ для MEP-проектирования зданий (электрика/сантехника). | Софт-платформа (по заголовку Forbes). | Series A $50M, всего $75M (Forbes 31.07.2026) — **содержание статьи не проверено (403)**. | [Forbes 31.07.2026](https://www.forbes.com/sites/davidprosser/2026/07/31/meet-the-swedish-start-up-using-ai-to-plan-electrics-and-plumbing/) |
| **P-1 AI** | «AI-инженер» для OEM (critical power, охлаждение ЦОД). | Софт/агент. | $73M всего. | см. табл. 1 |
| В электроэнергетике (сети/ПС/присоединение) как AI-native *фирма* | **Не найдено.** | | | Поиски: «AI-native engineering firm transmission/substation/power delivery», «YC W26/S26 substation», «engineering firm AI faster substation weeks». |

Вывод: тезис «AI-native фирм в энергетике нет» **ложен для ЦОД-инжиниринга (Marengo)** и **пока верен для сетевого проектирования**. Marengo — прямой прецедент формы «фирма с ИИ-ядром»; его следующий логичный шаг — сетевая часть ЦОДа (подстанция, присоединение), т.е. наша ниша (допущение).

---

## 4. Инкумбенты: строят ли ИИ внутри

| Фирма | Свидетельство | Дата | Источник |
|---|---|---|---|
| **Black & Veatch** | Вакансия «AI Program Manager – Power Delivery & Grid»: «leading AI-enabled tool initiatives across Distributed Infrastructure, focusing on Overhead Transmission Line, Substation, and BESS design»; 8+ лет, PE. Плюс BVInfraIQ (physics-based AI, старт с LNG), партнёрство с Zinier (field service). | **27.08.2026** | [Haystack](https://haystackapp.io/jobs/d0b25fb3-06ab-435b-a746-50813f811f68), [01net/BVInfraIQ](https://www.01net.it/black-veatch-launches-bvinfraiq-an-ai-enabled-digital-infrastructure-intelligence-platform-that-transforms-operational-data-into-actionable-insights/), [bv.com AI](https://www.bv.com/en-US/perspectives/ai-and-the-future-of-engineering) |
| **Sargent & Lundy** | «Founded an AI initiative»; в вакансиях substation-инженеров ожидается использование automation/AI и «agentic AI tools» для расчётов, документации. Конкретного продукта не названо. | 2026 (вакансии) | [S&L grid](https://www.sargentlundy.com/services/grid/), [вакансия](https://haystackapp.io/jobs/0161551b-7911-49a5-ab91-adb7395231cf) |
| **WSP** | CEO: ИИ — «great thing» при дефиците инженеров (07.05.2026); внутренний AI accelerator + Microsoft 365 Copilot; workflow-автоматизация на VIKTOR (структурные/фундаменты — не электрика). Купил POWER Engineers ($1.78B, 2024) и TRC ($3.3B, ENR) — т.е. масштабирует **людей**, а не софт. | 05–06.2026 | [BNN Bloomberg 07.05.2026](https://www.bnnbloomberg.ca/business/2026/05/07/ai-a-great-thing-for-engineering-amid-labour-shortage-says-wsp-global-ceo/), [VIKTOR case](https://www.viktor.ai/customer-cases/53/wsp-structural-design-workflow-automation-application), [ENR/TRC](https://www.enr.com/articles/62232-wsp-aims-for-power-market-boost-in-33b-deal-to-buy-sector-design-leader-trc-cos) |
| **Burns & McDonnell** | Публичные материалы — общие («generative AI bolsters innovation», 2023; «embracing AI in design automation», 02.2022, без своих инструментов). Директор preconstruction: фирмы не смогут использовать ИИ, «пока не структурируют данные». Свежих (2025–2026) пресс-релизов о собственных ИИ-инструментах для ПС **не нашёл**. | 2022–2024 | [blog.burnsmcd.com](https://blog.burnsmcd.com/embracing-artificial-intelligence-in-design-automation), [ENR keyword](https://www.enr.com/keywords/478-burns-mcdonnell) |
| Отрасль в целом | ENR Top 500 2026: выручка $158.7B (+7.4%), 83.2% фирм выросли; «AI boom buoys design revenue» — рост за счёт ЦОД-проектов, дефицит ресурсов и speed-to-market. | 04.2026 | [ENR](https://www.enr.com/articles/62878-enr-2026-top-500-design-firms-ai-boom-buoys-design-revenue) |

Вывод: инкумбенты **строят** (B&V — самое конкретное: вакансия под ИИ-инструменты именно для ВЛ/ПС/BESS, август 2026), но это внутренние программы на стадии «program manager», а не готовые продукты. Преимущество AI-native фирмы — временнóе (допущение: 18–36 мес.), не структурное. Инкумбенты также получают тот же рычаг от вендоров (Bentley Substation+, ETAP CoPilot, SBS→Enverus).

---

## 5. НЕКРОЛОГ: design-tech / energy-software, умершие или проданные дёшево с 2020

Искал: Canary Media списки 2023/2024, «solar/grid design software shut down», «AEC generative design failed», «acqui-hire AEC 2025», конкретные имена (HST Solar, Hypar, Sighten, AutoGrid, Anderson Optimization, Transcend).

| Компания | Что было | Что случилось | Причина | Источник |
|---|---|---|---|---|
| **Swell Energy** | VPP-софт (агрегация домашних солнца/батарей), $150M+ | Закрылась 08.2024 | «operational missteps, underdeveloped market» | [Canary Media 2024](https://www.canarymedia.com/articles/climatetech-finance/the-cleantech-companies-that-didnt-make-it-through-2024) |
| **AutoGrid** | DERMS/flexibility софт | Schneider купил 2022 → перепродал Uplight через ~18 мес (объявлено 14.12.2023, закрыто 09.02.2024), цена не раскрыта | Не раскрыто; двойная перепродажа за 2 года — признак невписавшегося актива (допущение) | [BizWest](https://bizwest.com/2023/12/14/uplight-to-acquire-autogrid-building-on-schneider-ties/), [Uplight](https://uplight.com/press/uplight-to-acquire-autogrid/) |
| **Aurora Solar** | Лидер residential solar design SaaS; $524M привлечено, оценка $4B (2022) | Сокращения 115 (01.2024), 58 (01.2025), третья волна + смена CEO (24.10.2025) | NEM 3.0 в Калифорнии, отмена ITC (OBBBA), «missed growth targets» | [SF Examiner 24.10.2025](https://www.sfexaminer.com/news/technology/struggling-sf-solar-company-cuts-more-staff-names-new-ceo/article_11301de8-2e8a-4dcc-a1ab-f2ac19f731d8.html), [WARN tracker](https://www.warntracker.com/company/aurora-solar) |
| **Sunfolding** | Пневматические трекеры (hardware) | Закрылась 10.2023, $32M+ | Производство, нет опыта проектов | [Canary Media 2023](https://www.canarymedia.com/articles/climatetech-finance/5-cleantech-startups-that-didnt-survive-to-see-2024) |
| **Sighten** | Solar sales/design SaaS | Куплена EverBright 21.02.2022 (цена не раскрыта) | Консолидация | [PitchBook](https://pitchbook.com/profiles/company/122602-96) |
| **Anderson Optimization** | Site-selection/PV design | Куплена PVcase 06.2023, цена не раскрыта | Консолидация | [pv magazine 07.06.2023](https://www.pv-magazine.com/2023/06/07/pvcase-acquires-anderson-optimization/) |
| **RatedPower / Pearl Street / SBS** | см. табл. 1 | Все куплены Enverus (2022 / 2025 / 2026), цены не раскрыты | Консолидация в data-платформу | см. табл. 1 |
| **Transcend** | Generative design | Жива, но **нет раунда 3 года** (последний 08.2023); power-кейсов почти нет | Сигнал стагнации (допущение) | [Tracxn](https://tracxn.com/d/companies/transcend/__9e7v8evHq3kHu23dTDZlGjoqWK3tIL5WkedxD0lH0Cc) |
| **HST Solar, Hypar** | Автодизайн PV / building design automation | Живы (HST — сайт активен; Hypar — $5.5M Series A 2023, упоминается как действующий 07.2025) | — | [hstpowers.com](https://www.hstpowers.com/), [aec+tech 07.2025](https://www.aecplustech.com/blog/top-generative-design-tools-aec-how-far-have-they-come) |

**Явных смертей софта именно для grid-проектирования — не нашёл.** Паттерн другой: не смерть, а **ранняя продажа стратегу за нераскрытую сумму** (4 сделки Enverus за 4 года + PVcase, EverBright). То есть standalone-софт в этой нише не доживает до масштаба самостоятельно — это косвенно поддерживает часть A утверждения (софт не стал коммодити-продуктом) и одновременно предупреждает: софт-модель в grid-design исторически = exit через M&A, не через рост.

Пусто по: провалам «AI substation design» стартапов (их ещё не было достаточно долго, чтобы умереть).

---

## 6. Сервис vs софт: что предпочитает клиент

**За сервис (готовый проект):**
- WSP → POWER Engineers, **$1.78B**, 4,000 сотрудников, 50 офисов (≈$445k/сотрудника), закрыто 01.10.2024; POWER = 20% pro forma выручки WSP в США. Затем WSP → TRC, $3.3B (ENR). Крупнейший дизайнер мира покупает *людей в энергетике*, а не софт. [Construction Dive](https://www.constructiondive.com/news/wsp-power-engineers-acquisition/724273/), [GlobeNewswire 01.10.2024](https://www.globenewswire.com/news-release/2024/10/01/2956467/0/en/WSP-Completes-Acquisition-of-POWER-Engineers.html)
- H&MV Engineering (HV/подстанции для ЦОД) — оценка **€1.4B**, заголовок: «дефицит HV-инженеров блокирует $1T ЦОД-стройку» (TechTimes 11.08.2026). **Содержание не проверено (403)** — использовать как сигнал, не как факт. [TechTimes](https://www.techtimes.com/articles/323930/20260811/hmv-engineering-valued-14b-hv-engineer-scarcity-blocks-1t-ai-data-center-buildout.htm)
- PE в T&D-инжиниринг 2025–2026: New Mountain → Commonwealth Associates (подстанции/T&D), Littlejohn → GDS Associates (05.03.2026, «planning bottleneck»), WSB (GHK) → Agbara, Willdan → KCS. Мультипликаторы не раскрыты. [PrivSource](https://www.privsource.com/acquisitions/engineering-services/2025), [ENR/GDS](https://www.enr.com/articles/62611-littlejohngds-deal-targets-planning-bottleneck-slowing-us-grid-projects), [Auxo](https://auxocapitaladvisors.com/transmission-distribution-engineering-firms/)
- Marengo (YC 2026) осознанно выбрал форму фирмы: «инженеры валидируют каждый выход перед поставкой». ThinkLabs для девелоперов работает как посредник/анализ. Тransformer lead-times 90–130+ недель и присоединение 5–7 лет делают клиенту важнее «кто-то доведёт до энергизации», чем «лицензия» (допущение, косвенно из [ATK Energy](https://atkenergygroup.com/blog/data-center-substation-construction/), [Utility Dive](https://www.utilitydive.com/spons/when-10-year-grid-plans-compress-into-3-meeting-the-ai-power-surge/806492/)).

**За софт:**
- Neara — единорог (A$1.1B, 02.2026), но продаёт *утилитам* инструмент для их собственных инженеров, не проект.
- Pearl Street/MISO: оператор запускает софт **сам** — там, где покупатель имеет штат инженеров (ISO/utility), софт побеждает.
- Nira: девелоперы охотно заменяют консультанта ($10k+, недели) софтом на этапе *prospecting* — там, где нет ответственности/подписи.
- Aurora Solar — ~$170M выручки 2023 (оценка Sacra) — софт работает в residential, где проект типовой и без утилитной экспертизы.

**Синтез (допущение на основе фактов выше):** граница проходит по **ответственности и типовости**. Где покупатель сам инженер (ISO, utility) и работа повторяема (power-flow, prospecting, PV-layout) — побеждает софт. Где покупатель — девелопер/ЦОД без штата HV-инженеров, а результат должен быть подписан и согласован с утилитой — побеждает сервис, и рынок платит за него миллиардные оценки. Наша ниша (техприсоединение, ПС, выдача мощности для ЦОД/BESS) — во второй зоне.

---

## 7. Что не нашёл / не проверил (честно)

- Цены сделок Enverus (RatedPower, Pearl Street, SBS), Uplight/AutoGrid — не раскрыты нигде.
- Выручка Transcend, SBS, Marengo, ThinkLabs — не раскрыта.
- Nira $65.5M — один источник, противоречит агрегаторам → не опираться.
- H&MV €1.4B, Endra $50M — только заголовки (страницы 403).
- Результаты Tapestry/PJM за 2026, Bentley Substation+ у реальных клиентов — не нашёл.
- Burns & McDonnell 2025–2026: свежих ИИ-объявлений не нашёл (лимит поисков).
- Заземление/молниезащита автоматизация — не проверял.
- Провалы «AI substation design» стартапов — пусто (сегмент моложе 2 лет).
- Рынок «substation design software» $10.17B (2025) — Verified Market Reports, **низкая надёжность**, не использовать.

---

## 8. Итог по критерию фальсификации

| Подутверждение | Статус | Ключевое доказательство |
|---|---|---|
| «Софт-генераторы не коммодитизировали grid-проектирование» | **Держится** | Лучшие генераторы = предпроект/концепт (Transcend, SBS) или копилот (Bentley, ETAP); РЗА/КЗ — «augmentation, not substitute»; standalone-софт продаётся стратегу до масштаба (4× Enverus) |
| «AI-native проектных фирм в энергетике нет» | **Опровергнуто в смежном сегменте** | Marengo (ЦОД-инжиниринг, YC 2026, $4M партнёрств); Vela (W26); ThinkLabs-гибрид. В сетевом проектировании — пока никого |
| Скрытое допущение «окно будет открыто долго» | **Под угрозой** | B&V вакансия AI PM – Power Delivery (27.08.2026); Bentley/Enverus/ETAP дают тот же рычаг всем; 4+ новых entrants за 12 мес. |
| Форма «сервис > софт» для этой ниши | **Подтверждается** | $1.78B за POWER Engineers, PE-волна в T&D-консалтинг, Marengo выбрал фирму; софт побеждает только у покупателей со своим инженерным штатом |

**Рекомендация скептика:** гипотезу не закрывать, но переформулировать критерий: не «ниша пуста», а «в сетевом проектировании для ЦОД/BESS/генерации ещё нет фирмы, которая продаёт скорость как продукт; у нас 12–24 месяца до того, как Marengo-подобные или B&V закроют её». И заложить в план, что рычаг маржи будет **общедоступным** (Bentley/ETAP/Enverus-SBS) — значит, дифференциация должна лежать в процессе/данных/ответственности, а не в самом ИИ.
