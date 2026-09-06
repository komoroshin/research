# Блок 3. Конкуренты и альтернативы

**⚠️ Частично действителен, одна трактовка исправлена.** Карта горизонтальных игроков и пустой квадрант верны глобально. Но вывод «категория схлопнулась / не строить ещё один Glean» был подан неверно: поглощения Moveworks за $2,85 млрд, Sana за ~$1,1 млрд и Casetext за $650 млн — это успешные экзиты, а не провалы. Исправленная разборка исходов и список активных отраслевых покупателей — в `00_core_findings.md` §1. Испанские нишевые игроки, интеграторы и каналы — привязаны к рынку, который отменён.

Дата: 2026-09-06. Основная ниша — **транзитарии и таможенные представители (CNAE 52.29), 30–500 сотрудников, Испания → ЕС**; запасная — страховые брокеры (раздел 6). Полные разборы с источниками: `raw/competitors_horizontal.md` (группа 1), `raw/competitors_niche_forwarders.md` (группы 2–4, транзитарии), `raw/competitors_niche_brokers.md` (брокеры), `raw/niche_freight_forwarders.md` §5.

Правила: `[заявлено]` — слова вендора; `[третья сторона]` — агрегатор/конкурент, не для питча без сверки; `[>24 мес]` — старше 24 месяцев; `[оценка]` — расчёт аналитика. Курс €→$ 1,1622 (ECB, 05.09.2026).

Ограничение сбора: поисковый бюджет сессии был исчерпан, поисковики через WebFetch давали капчу/429; исследователи работали через Bing News и прямые сайты вендоров. Официальные страницы OpenAI, Microsoft (Copilot Business), G2, Reddit, Crunchbase, Hays/Michael Page не открылись — по ним данные третьих сторон, помечены.

---

## Группа 1. Горизонтальные игроки (полный разбор — `raw/competitors_horizontal.md`)

| Игрок | Мин. клиент / мест | Публичная цена, $/место/мес (дата) | Размещение / ЕС | Коннекторы, SDK, MCP | Испания/ЕС | Оценка / раунд | Слабые места по отзывам |
|---|---|---|---|---|---|---|---|
| Glean | Enterprise; ~100–250 мест, контракт от ~$50–60 k/год (третьи стороны, 2026) | Публичной нет; $50–75 с AI add-on (Fritz.ai 03.2026; GoSearch 06.2026 — третьи стороны) | Облако; EU-регион не найден | 275+ коннекторов, 40+ LLM, MCP (glean.com, 09.2026) | Офиса/кейсов в Испании не найдено; экспансия 2026 — Австралия | Series F $150 M при $7,2 B (06.2025); run-rate >$300 M (05.2026, заявлено) | Непрозрачная цена, +7–12 % при продлении, сложная настройка прав, «находит, но не делает» (Fritz.ai) |
| Microsoft 365 Copilot (+Copilot Studio) | Любой тенант M365; Copilot Business ≤300 мест | $30 Enterprise (годовая); Copilot Business $21/$25, промо $18 (третьи стороны, 08.2026); Copilot Studio $200 за 25 000 кредитов (microsoft.com, 09.2026) | Облако MS; EU Data Boundary покрывает M365 (MS Learn, 07.2026) | 1 400+ коннекторов Power Platform, MCP | Полное присутствие, партнёры повсеместно | 15 M → 20 M → 30 M+ платных мест за FY26 (MS, 01–07.2026) | Oversharing через SharePoint: 40 % из 132 ИТ-лидеров откладывали rollout ≥3 мес (Gartner via Computerworld, 04.12.2024); «низкая ценность за $30» |
| ChatGPT Business / Enterprise | Business от 2 мест; Enterprise — по запросу («150 мест» — один Reddit-пост 2023, сомнительно) | Business $20/$25 (с 02.04.2026); Premium-место $100/$125 (08.2026); Enterprise ~$45–75 (третьи стороны, сомнительно) | Облако OpenAI; EU data residency at-rest для Enterprise/API с 06.02.2025 (TechCrunch) | SharePoint, Google Drive, Dropbox, Box, Outlook, Teams, Gmail, Slack, GitHub, Linear (третьи стороны, 06.2026) | Через партнёров; офиса в Испании не найдено | «ChatGPT Work и Codex — 10 M пользователей» (08.2026, заявлено) | Непрозрачность Enterprise; лимит агентов 40 сообщений/мес на Business |
| Claude Team / Enterprise | Team 2–150 мест; Enterprise мин. 20/50 (третьи стороны) | Team $20/$25; Premium $100/$125; Enterprise $20 + usage по API (claude.com, 09.2026) | Облако Anthropic; в Microsoft Foundry (07.2026); EU residency первопартийно не найдена (in-region через AWS Bedrock EU — `raw/regulatory…`) | Gmail, Google Drive, Slack, M365, Chrome; MCP | Офиса в Испании не найдено | Гигант | Мало публичных отзывов; непредсказуемый usage-биллинг на Enterprise |
| Gemini Enterprise (ex-Agentspace) | Business 1–300 (или 500) мест | Business $21; Standard $30/$35; Plus $50–60 (третьи стороны, 08–09.2026) | Облако Google; «sovereign controls» в Plus | Полная библиотека коннекторов со Standard; число не найдено | Присутствие Google | Гигант; переименование 09.10.2025 | «buggy, snail speed»; метеринг $15–40/power-user сверх квот |
| Notion AI | От 1 места | Plus $10; Business $20/$24 с AI (notion.com, 09.2026) | Облако; EU residency (Frankfurt/Ireland) только Enterprise | Enterprise Search beta: Slack, Teams, GitHub, Jira, Box, OneDrive, Salesforce, Asana | Локализация есть; офиса нет | Гигант-частник | Работает в основном внутри Notion, не для многошаговой работы в других системах |
| Guru | Professional мин. 10 мест | $25/$30 (третьи стороны); сайт — «custom» (getguru.com, 09.2026) | Облако; ЕС не найдено | 100+ интеграций | Не найдено | Раунды не найдены; медианный чек $540/год (costbench, 07.2026) | Поиск не терпит опечаток, AI смешивает внешние/внутренние данные |
| Moveworks (ServiceNow) | Практически 1 000+ сотрудников | $15–45 за сотрудника в **год** (Vendr via unthread, 04.2026) | Облако; регион ЕС не найден | 100+ интеграций | Через ServiceNow | Куплен за $2,85 B (закрыто 15.12.2025) | Общие ответы на нишевые запросы; нет BYO-LLM |
| Dust (FR) | Self-serve до 100 мест; Enterprise от 100 | Pro $24/$30; Max $120/$150 (с 24.06.2026, третьи стороны) | Облако; US/EU residency; single-tenant в Enterprise | 20+ коннекторов; unlimited + MCP в Enterprise | Париж; Qonto, Alan, PayFit, Pennylane; Испания не найдена | Series B $40 M (Sequoia, Abstract, 18.05.2026) | Слабый онбординг, крутая кривая для не-разработчиков |
| Onyx (ex-Danswer, OSS) | Не указан | Business $20 (годовая); OSS бесплатно (onyx.app, 09.2026) | Self-host / cloud / airgapped | 40+ коннекторов; MCP | Thales (FR) | Seed $10 M (03.2025); 20 k GitHub stars | 12 контейнеров в default-деплое; pivot к chat-UI (HN, 11.2025) |
| Writer | Starter ≤5 мест; Enterprise по запросу | Starter $29/$39; Team $18–25 (Vendr, 02.2026); медианный контракт $28,9 k/год | Облако; «flexible deployment» в Enterprise | Knowledge Graph + коннекторы (Enterprise) | Не найдено | $1,9 B (11.2024) | Дорого; разрыв между Starter и Enterprise |
| Mistral Vibe (FR) | Team мин. 2 | Team $19,99/$24,99 + $50 базово (третьи стороны, 08.2026) | On-prem / private cloud / Mistral Cloud с residency (mistral.ai, 09.2026) | 100+ инструментов через коннекторы + MCP | ЕС-игрок; Испания не найдена | Series C €1,7 B при ~€11,7 B (09.2025) | Каталог коннекторов ограничен; SOC 2 Type II «в процессе» |
| Coveo, Elastic, Sinequa (ChapsVision), Sana (Workday), Qatalog (ClickUp), Aleph Alpha (Cohere) | Крупный enterprise / платформы для строителей / поглощены | — | — | — | — | Sinequa → ChapsVision (18.11.2024); Sana → Workday ~$1,1 B (11.2025); Qatalog → ClickUp; Aleph Alpha → Cohere (24.04.2026) | Для 30–500 не игроки |
| Испанские: Nuclia, Clibrain, Sherpa.ai | — | — | — | — | Nuclia → Progress (30.06.2025, стала RAG-инфраструктурой); Clibrain — статус не установлен; Sherpa.ai — «суверенный ИИ», продукт класса Glean не подтверждён | — | Испанского горизонтала класса Glean для 30–500 нет |

**Вывод по группе 1.** Рынок разорван надвое: генералисты за $20–30/место с 1–2 мест без связки с отраслевыми системами и permission-aware платформы за $50–75 со входом от 100–250 мест и $50–100 k+ в год. Коннекторы к испанскому/логистическому стеку (VisualTrans, DeiWorld, Taric, Portic, Sage, a3) не заявлены ни у кого; реальную EU/on-prem опцию для SMB дают только Mistral и Onyx. За 2024–2026 категория «горизонтальный enterprise search» консолидирована (Sana, Moveworks, Dashworks, Qatalog, Doti, Sinequa, Nuclia, Aleph Alpha поглощены; Onyx ушёл в chat-UI) — аргумент не строить «ещё один Glean», а занимать квадрант «30–500 × отраслевой стек × выполнение работы × $20–40 без минимума мест × EU».

---

## Группа 2. Нишевые ИИ-решения для транзитариев и таможни

### 2.1. Стартапы и платформы (23 проверены; ниже — релевантные для сегмента 30–500)

| Игрок | Страна | Что делает | Целевой клиент | Цена | Стадия / раунд | Интеграции | Слабые места / релевантность |
|---|---|---|---|---|---|---|---|
| **cargo.one + Cargofive** | DE / PT | После покупки Cargofive (02.03.2026): ставки и котировки авиа+море+авто, 5 agentic-workflows (rate management, procurement, quoting, booking, **customer support**) в режимах co-pilot / supervised / autonomous, RAG, **MCP-сервер**, клиентский портал с динамическим прайсингом | Форвардеры всех размеров; у Cargofive 200+ форвардеров, включая испанских (Contransa, Lantia) | Не публична | cargo.one ~$20 M (лид Bessemer), 02.03.2026 (https://www.cargo.one/blog/cargofive-acquisition-ai-os-multimodal-launch); Cargofive €2,5 M (03.2024 `[>24 мес]`) | API к TMS/ERP; интегрирован в VisualTrans | **Ближайший конкурент по сценарию «черновик котировки» в Иберии**; не читает данные компании (TMS/PCS/почта) |
| **Raft** (ex-Vector.ai) | UK/US | Agentic-платформа: таможенная подготовка, AP-матчинг инвойсов, ETA-трекинг | Крупные и средние (ALS — 700+ специалистов) | Не публична | Series B $30 M (Eight Roads, Bessemer) — дата на сайте 01.09.2026 выглядит как дата страницы, вероятно 2023 `[сомнительно]` | Vizion (трекинг) | Нет SMB-плана и публичной цены; Иберии нет |
| **Levity** | DE | Автоматизация почты: спот-котировки, ввод заказов, track&trace, arrival notices, AP/AR; human-in-the-loop; forward-deployed engineering | Enterprise («multibillion companies»: Gebrüder Weiss, ExFreight) | Не публична | Seed $8,3 M (12.10.2022 `[>24 мес]`, Balderton, Angular); позже раундов не найдено; ~18 человек | Gmail, Outlook, CargoWise, SAP, Zendesk | Дорогое внедрение через FDE-команду; SMB не покрыт |
| **Digicust** | AT | ИИ-таможня: тарифная классификация, декларации, экспортный контроль, IDP; ISO 27001; EU-хостинг | Форвардеры/брокеры/грузовладельцы (Rüdinger 700 чел.) | Не публична | Pre-Series A €2,3 M (18.12.2025) | ATLAS, DAKOSY, Scope, SAP, D365…; **Taric/AEAT нет** | Германо-центрична; Испании нет |
| **Bytemaster _b first IA** | ES (Матаро) | **RAG-копилот внутри ERP _b first**: отвечает на операционные/таможенные вопросы по руководствам AEAT, вики и данным ERP; портал _b Tracking для клиентов | Только клиенты _b first («более 30 компаний», 2 500+ пользователей `[заявлено]`) | Не публична | Частная, 60+ сотрудников, 1994 | Нативно | **Ближайший локальный аналог сценария «статус/документ», но замкнут на свой ERP** (https://www.bytemaster.es/b-first/copilot-ia-bfirst/) |
| **VisualTrans** | ES | Tariff Code (автоклассификация TARIC), ИИ-оцифровка DUA/инвойсов, голосовой агент «Victoria» для общения с клиентами/поставщиками; 5 000+ пользователей в 25+ странах `[заявлено]` | Транзитарии/агенты | По запросу | Частная | AEAT, Portic, Valenciaport, Portel, TARIC, Webcargo, Cargofive, Kaleido, Shipsgo | ERP-вендор с ИИ-модулями; не кросс-системный ассистент (https://visualtrans.com/especiales-logistica-inteligente/) |
| **SC Trade — Sherlock** | ES | ИИ-платформа на IBM watsonx: предиктивная аналитика, «automatización aduanera» | Клиенты Bitácora ERP (FedEx, Inditex, SEUR) | Не публична | Частная | Нативно | Крупные клиенты; кастомные проекты |
| **DeiWorld, Quatuor, Taric, Click&Cargo, Riege Scope, Portic, valenciaportPCS** | ES / DE | ИИ-ассистентов **не найдено**; DeiWorld — Track&Trace для клиентов; Riege — таможня DE/CH/NL/US, Испании нет | — | — | — | — | Интеграционные точки, не конкуренты |
| **Beacon** | UK | Трекинг 160+ перевозчиков, ETA, документы, проверка инвойсов | Грузовладельцы и форвардеры (Fever-Tree, Tata) | Не публична | Не найдено | SAP, NetSuite, Sage, D365 | Больше для грузовладельца |
| **Freightos WebCargo** | IL / Барселона | Rate & Quote Air → Ocean (05.11.2025); 1,6 M транзакций/год | Форвардеры всех размеров | Не публична | Публичная (NASDAQ: CRGO) | VisualTrans | Котировки, не данные компании; локальная команда в Барселоне |
| **Usyncro** | ES (Мадрид) | Единое досье отгрузки, блокчейн-целостность документов, авто-обработка документации | Экспортёры/форвардеры | Не раскрыто | Breakeven в 2026 после реструктуризации 2024 (El Español, 13.07.2026) | — | «Документный» сосед; не ассистент; сам признаёт давление ИИ на SaaS |
| **Handle** | US/MX | ИИ-агенты бэк-офиса (страхование, логистика) | Брокеры/операторы | Не публична | Seed $6 M, a16z, 03.2026 | — | Пока страхование в Мексике |
| **Expedock** | US/PH | **Пивот** в managed remote teams (люди + ИИ) для логистики | Форвардеры/3PL | /pricing — 404 | Series A $13,5 M (08.2022 `[>24 мес]`) | — | Сигнал: чистый IDP для форвардеров не «взлетел» |
| Компоненты трекинга: **Shipsgo** ($2/контейнер: 500 кредитов = $1 000), **Terminal49** (Free/Lite/Essential, цены скрыты), **Vizion**, **Portcast**, **Gnosis** | TR / US / SG | Контейнер/авиа-трекинг по API | Платформы | Shipsgo публична | — | API | Не конкуренты, а компоненты для Блока 5 |
| Digital forwarders: **iContainers (Agility, Барселона)**, **Forto** («ищет покупателя», ~2025 `[сниппет]`), **Zencargo** | ES / DE / UK | Онлайн-котировки, «ИИ в котировках и сервисе» `[заявлено]` | Грузовладельцы | Услуга | — | — | Конкуренты за клиента среднего транзитария, не за софт |
| Мюнхенский стартап «AI workers for freight forwarding» | DE | ИИ-«работники» бэк-офиса; инвесторы — экс-руководители DHL/Maersk | — | — | $3,2 M, ~08.2026 (MSN/Yahoo, название не установлено) | — | Проверить перед питчем |

### 2.2. Инкумбенты: «ИИ в комплекте»
- **WiseTech / CargoWise:** Value Packs с 01.12.2025 — одна транзакционная плата за job вместо мест, в пакете AI Classification Assistant, AI workflow engine, чат-бот «AI CargoWise Expert», портал Neo (menafn.com, 30.11.2025); сокращение 2 000 позиций (29 %) под ИИ (Yahoo Finance, 02.2026); FY2026 выручка $1,396 B (+79 % после e2open); покупка FRDM.ai (22.07.2026). Для клиентов CargoWise ИИ уже «включён».
- **Magaya:** ACEbridge AI Compliance Agent (США), +50 клиентов за Q2 2026. **Descartes:** Tai $100 M (25.08.2026), Extensiv $120 M (01.09.2026).
- **Kuehne+Nagel / DSV:** акции −10 % на страхе ИИ-дизрапта форвардинга (Morningstar, ~03.2026, заголовок).

### 2.3. Вывод по группе 2
Прямого «Glean для среднего транзитария» (ассистент поверх TMS + PCS + почта + Taric) нет. Смежные позиции заняты: документы (Raft, Shipamax/WiseTech, Digicust), таможня (Taric, Digicust, Customs4trade), ставки/котировки (cargo.one+Cargofive — уже в Иберии, Freightos — в Барселоне), почта для enterprise (Levity). Самые близкие локальные соседи — ERP-вендоры, которые встраивают ИИ в свои системы (Bytemaster, VisualTrans, SC Trade), но каждый видит только свою систему.

---

## Группа 3. Интеграторы и заказная разработка (Испания/ЕС)

| Компания | Специализация в ИИ | Кейсы для транзитариев | Размер | Источник |
|---|---|---|---|---|
| Plain Concepts | AI Transformation, Copilot/Azure | Нет (PremFina — поддержка) | 700+ сотрудников, 26 delivery-центров `[заявлено]` | https://www.plainconcepts.com/ |
| Sngular | Data & AI, GenAI на Google Cloud | Нет | 1 300+ сотрудников, выручка >€100 M (FY2024) `[заявлено]` | https://www.sngular.com/ |
| SDG Group | Практика AI, Orbitae, GenAI-чаты для данных | Amadeus, ж/д, aerospace — не транзитарии | — | https://www.sdggroup.com/ |
| Keepler (с 04.2026 — Accenture AI & Data) | AI Agents, GenAI, RAG | Только «Transport Company» в отзывах | 240 чел. | https://keepler.io/ |
| Kairós DS | AI, Data, Cloud; ES/MX/PE | Нет | 750+ | https://www.kairosds.com/ |
| Minsait (Indra), Bluetab (IBM), Izertis, Paradigma Digital, Intelygenz (VASS) | Agentic AI, суверенный ИИ, IDP | Логистика/транспорт (Мексика) у Minsait; транзитариев нет | Крупные | сайты компаний |
| ERP-вендоры как интеграторы: Bytemaster, SC Trade, VisualTrans/Visual MS | Уже встроили ИИ в свой ERP (см. 2.1) | Да — для своих клиентов | 60+ (Bytemaster) | — |
| AndSoft (e-TMS), Alerce (Alertran) | ИИ не упомянут | Автоперевозки/дистрибуция, не транзитарии | 350 клиентов / 80+ клиентов | сайты |

**Ценовой диапазон проектов.** Ставки €/день Hays/Michael Page/Malt 2026 — страницы не открылись `[НЕТ ИСТОЧНИКА — не для питча]`. Косвенные якоря: senior engineer €67–85 k, Staff AI Engineer €82–107 k в год (Xataka по Manfred/Hays, 30.04.2026); фриланс Upwork Испания — средняя заявленная ставка $42–58/ч (Remitly, 18.06.2026). Оценка стоимости типового RAG-ассистента у испанского интегратора: **€600–1 200/день, пилот 2–3 человека × 6–10 недель = €60–150 k (≈$70–175 k)**, поддержка 15–20 %/год `[оценка аналитика, не для питча как факт]`. Ни один проверенный интегратор не показывает кейс «ассистент для транзитария»; для фирмы 30–500 человек заказной RAG у бутика — экономически тяжёлый путь, что и объясняет пустой квадрант.

**Госпрограммы как канал и субсидия (важно для цены «под ключ»):**
- **Ports 4.0 (Puertos del Estado):** Ideas — фикс €15 000; Precomercial (TRL 3–6) — до €1 M, до 60 % стоимости, до 36 мес.; Comercial (TRL ≥7) — до €2 M, до 80 %; конвокатория 2025 — €6,75 M (BOE-B-2025-48112, 30.12.2025), Ideas 2025 — 164 заявки, Comerciales — 91; прекоммерческая конвокатория Q4 2026 — €12 M (https://ports40.es/bases-de-la-convocatoria/). За 6 конвокаторий — €53,75 M, 108 идей, 47 прекоммерческих, 37 коммерческих проектов. **Реальный канал: грант на пилот с портовой общиной (Portic/Valenciaport как партнёры).**
- **Kit Consulting (Red.es):** ваучер €12 000 (10–49 чел.) / €18 000 (50–99) / €24 000 (100–249) на 10 услуг, включая «Inteligencia Artificial»; приём закрыт 31.03.2025; продление после 2026 обсуждается (заголовки MSN/Bolsamanía, 11.2025) — **новая конвокатория не подтверждена**.
- **Kit Digital:** сегменты IV (50–99) до €25 000 и V (100–249) до €29 000 с ИИ-решениями; приём до 30.06.2025; Orden TDF/39/2026 сохраняет программу, новые сроки не объявлены `[сниппет]`.

---

## Группа 4. Не-софт альтернативы со стоимостью

| Альтернатива | Стоимость | Источник | Что не закрывает |
|---|---|---|---|
| **Найм operativo / customer service** | 21–30 k€ брутто → **€28–40 k (≈$32–46 k) полная стоимость** в год | InfoJobs Barcelona 09.2026; ×1,30–1,33 соцвзносы `[расчёт]` | Знания уходят с человеком; «relevo generacional» — приоритет FETEIA 2026; стоимость найма/текучесть — не найдено |
| **Аутсорсинг/BPO (Филиппины, Expedock managed teams, Outsourced.ph, iSupport, MicroSourcing)** | «Экономия до 70–75 %» `[заявлено]`; цены за час/операцию не публикуются → ≈€8–12 k/год за выделенного сотрудника `[оценка]` | сайты провайдеров (09.2026) | Испанского BPO для транзитариев не найдено; часовые пояса, качество, доступ к системам |
| **«Excel + человек»** | = стоимость одного operativo (выше) | — | Не масштабируется; 5+ систем остаются |
| **Горизонтальные ассистенты на 40 мест/год:** Copilot Business $21 → $10 080 (промо $18 → $8 640) + база M365; Copilot Enterprise $30 → $14 400; ChatGPT Business $20–25 → $9 600–12 000; Claude Team $20 → $9 600; Gemini Business $21 → $10 080 | **$9–14 k/год** | `raw/competitors_horizontal.md` §4 (цены Microsoft — третьи стороны) | Нет коннекторов к VisualTrans/Portic/Taric; oversharing-риски; «чат по документам», не процессы |
| **Клиентские порталы TMS (DeiWorld Track&Trace, Bytemaster _b Tracking, CargoWise Neo, cargo.one portal)** | Внутри лицензии TMS / по запросу | сайты вендоров | Закрывают «где мой груз» только для клиента, который заходит сам, и только данными одной системы; не отвечают на почту, не готовят котировки |
| **Виртуальные ассистенты/фриланс** | Upwork Испания $42–58/ч заявленная ставка (Remitly, 06.2026); part-time VA ≈$15–26 k/год `[оценка]` | — | Без доступа к системам и знаний отрасли |

Вывод: горизонтальный ассистент стоит 25–40 % одного operativo, но не подключён к отраслевому стеку; ценовой потолок нишевого продукта на 40 мест логично держать в коридоре «меньше одного человека» — $12–25 k в год ($25–50/место) `[оценка]`, что совпадает с якорями Блока 2.

---

## Итог 1. Карта по двум осям

Обозначения: [Г1] горизонталь, [Г2] нишевой ИИ, [Г3] интегратор, [Г4] не-софт.

| Глубина специализации ↓ / размер клиента → | Микро <10 | Малый 10–30 | **Средний 30–500** | Enterprise 500+ |
|---|---|---|---|---|
| **Горизонталь** (ИИ по любым данным) | ChatGPT Business, Claude Team, Notion AI, Copilot Business, Gemini Business, Dust Pro, Onyx OSS [Г1]; фриланс/VA [Г4] | те же + Guru (мин. 10 мест) [Г1] | те же (потолок 300 мест) + Dust/Onyx Enterprise, Mistral Vibe [Г1]; Plain Concepts / Sngular / SDG / Keepler-Accenture / Kairós / Intelygenz на заказ [Г3] | Glean, ChatGPT Enterprise, Copilot Enterprise, Gemini Plus, Moveworks/ServiceNow, Sana/Workday, Writer, Coveo, Sinequa [Г1]; Minsait, Bluetab-IBM [Г3] |
| **Логистика широко** (визибилити, аудит, ставки) | Cargoflip $99/мес; Shipsgo $2/контейнер; Terminal49 Free [Г2] | Shipsgo, Terminal49, Vizion API [Г2] | Beacon, Portcast, Gnosis, Wakeo, Freightos WebCargo, cargo.one Rate & Quote [Г2]; digital forwarders iContainers / Forto / Zencargo (конкуренты за клиента) | Shippeo (+Logward), project44 (не проверен), Loop, BlueCargo [Г2] |
| **Транзитарий-специфичный** (поверх TMS/таможни) | Click&Cargo (ERP без ИИ) | Quatuor, Click&Cargo; филиппинский BPO [Г4] | **VisualTrans (Tariff Code / IDP / Victoria), Bytemaster _b first IA (RAG только для своих клиентов), SC Trade Sherlock, DeiWorld (портал без ИИ), Digicust (таможня DE/AT, не AEAT), cargo.one agentic quoting/support** [Г2]; Expedock managed teams [Г4] | **CargoWise Value Packs (AI Classification Assistant, AI CargoWise Expert, Neo), Magaya ACEbridge (US), Raft, Levity, Customs4trade, Riege Scope (без ИИ)** [Г2] |
| **Процесс-специфичный** (статус / документ / котировка из нескольких систем: TMS + PCS + почта + Taric) | — | — | **ПУСТОЙ КВАДРАНТ** — никто не читает VisualTrans/DeiWorld + Portic/valenciaportPCS + Outlook + Taric и не отвечает/готовит черновики для компании 30–500 человек | Levity (почта), Raft (документы/таможня) — частично |

Пустой квадрант — «средний 30–500 × процесс-специфичный кросс-системный ассистент». На него давят с трёх сторон: снизу-справа ERP-вендоры (Bytemaster, VisualTrans) изнутри своих систем, сверху CargoWise Value Packs / Raft / Levity, сбоку cargo.one (котировки и поддержка, но не «данные компании»).

## Итог 2. Три отличия, которые сложно скопировать

1. **Нормализация статуса из PCS + TMS + почты + линий для среднего сегмента.** У среднего транзитария 4–6 систем разных поставщиков (VisualTrans + Taric + Portic + Outlook); Portic обрабатывает 150 k сообщений/день, valenciaportPCS — 26 k транзакций/день (сайты PCS). Bytemaster-копилот читает только свою ERP и мануалы AEAT; VisualTrans-ИИ — классификация/IDP/голос; cargo.one — ставки. Вендорам ERP сложно скопировать, потому что каждый видит только свою систему; enterprise-игрокам (Raft, Levity) — потому что Portic/valenciaportPCS/Taric — локальные интеграции без глобального рынка. Оговорка: доступ к API PCS и данным линий — по соглашениям (проверяется в Блоке 5); стоимость трекинг-компонента известна (Shipsgo ~$2/контейнер).
2. **EU-размещение + permission-aware индекс под AEO и коммерческую тайну ставок.** AEO требует ИТ-безопасности и контроля доступа (UCC art. 39); CargoWise переносит ИИ в облако WiseTech с платой за job, что затрудняет «не давать ИИ доступ к части данных»; горизонтали дают EU-residency только на Enterprise (Notion, OpenAI) — см. группу 1. Права «как в системе-источнике», запрет дообучения на ставках клиента, изоляция тенантов, хостинг в ЕС на плане для 30–500 мест. Оговорка честно: воспроизводимо крупными игроками при желании — защита на 12–24 месяца, не структурная.
3. **Канал FETEIA/ATEIA + Ports 4.0.** 20 ATEIA с публичными списками членов, конгресс 1–4.10.2026, кластер из 260 компаний в Каталонии; Ports 4.0 покрывает до 60 % (прекоммерческий, ≤€1 M) / 80 % (коммерческий, ≤€2 M) стоимости проекта, конвокатория 2025 — €6,75 M, прекоммерческая Q4 2026 — €12 M. Ни один из проверенных нишевых игроков (Raft, Levity, Digicust, cargo.one, Beacon) не показывает присутствия в FETEIA/Испании. Оговорка: Kit Consulting закрыт с 03.2025, Kit Digital 2026 без сроков — надёжен только Ports 4.0.

Четвёртый кандидат — «эталонные данные по статусам/котировкам, накопленные по десяткам транзитариев» (data flywheel) — обоснован частично: открытых эталонных наборов у конкурентов нет, но cargo.one заявляет «89 % точность котировки», Bytemaster уже имеет RAG по мануалам AEAT. Сложность копирования средняя.

## Итог 3. Три риска быть съеденными гигантами

1. **WiseTech/CargoWise встраивает ИИ и меняет модель цены.** С 01.12.2025 ИИ-классификатор, чат-бот и портал Neo включены в транзакционную плату за job; 2 000 сокращений (29 %) ради ИИ; выручка $1,4 B; покупка FRDM.ai. Для транзитариев на CargoWise наш продукт — «ещё одна подписка поверх включённого». Смягчает только то, что Испания — рынок VisualTrans/DeiWorld/Quatuor/Taric, а не CargoWise (доля CargoWise в Испании не измерена `[НЕТ ИСТОЧНИКА]`).
2. **Свои же ERP-вендоры и cargo.one закрывают сценарии изнутри.** Bytemaster уже продаёт RAG-копилот по ERP + AEAT; VisualTrans (5 000+ пользователей) — Tariff Code, IDP, голосового агента; SC Trade — Sherlock; cargo.one после покупки Cargofive (200+ форвардеров, включая испанских) — agentic-котировки и support-агента с MCP. Raft/Levity двигаются вниз, Digicust — по ЕС. Самый вероятный сценарий «съедания» — не гигант, а собственный ERP клиента. Митигация: мульти-ERP и мульти-PCS, работа через экспорт/почту, которыми владеет сам транзитарий, совместимость с их MCP.
3. **Copilot за $18–21 + «человек дешевле» + сжатие сегмента.** Copilot Business/ChatGPT Business — $10 k/год на 40 мест, партнёры-интеграторы могут собрать «ассистента транзитария» на Copilot Studio; Expedock и филиппинские BPO обещают −70–75 % стоимости operativo; digital forwarders (iContainers-Agility в Барселоне, Forto, Zencargo) отбирают клиентов у средних транзитариев; PCS могут добавить чат поверх своих сообщений. Макро-риск: рынок уже торгует «ИИ-дизрапт форвардинга» (K+N/DSV −10 %), а при марже 3,6–4,2 % средние транзитарии могут заморозить ИТ-бюджеты. Митигация: ценность в кросс-системной нормализации и выполнении процессов, а не в чате; субсидии Ports 4.0 снимают барьер стоимости.

---

## 6. Кратко — запасная ниша: страховые брокеры (полностью — `raw/competitors_niche_brokers.md`)

- **Нишевые (15 + 6 смежных):** Foliume (ES, seed $1 M, «110+ компаний» `[заявлено]`, ассистент в WhatsApp, Client Hub, голосовые агенты); Innova Ibérica Coverize+/Coverbot (Codeoscopic; сравнение условий, черновик parte); **MPM TarifAI «cotización inteligente para defender cartera» (19.03.2026) + ассистент EVIA (22.06.2026)** — вендор с 53 % ADECOSE уже зашёл в реновации; MelmacIA («200+ corredurías» `[заявлено]`, скоринг оттока); Panora (FR, seed $4,5 M `[сайт]`, котировки/презентация для courtiers); **Quandri** (CA/US, $22 M, «hundreds of agencies», $20–80 k/год `[третья сторона]`, реновации personal lines внутри AMS) — ближайший аналог «copilot реноваций»; **ennabl** (US, Plus $110 / Teams $140 за место в месяц — единственный «ассистент сотрудника» в нише с публичной ценой); Comulate (US, Series B $20 M; **антимонопольный иск к Applied Systems, 21.01.2026** — прецедент отключения конкурента от данных ERP); Thinksurance (DE, 99–3 499 €/мес + setup); blau direkt AMEISE COPILOT (DE, 13.04.2026); Ralfi (AU, Outlook-ассистент «реновации + siniestros», 26.08.2026 — подтверждение живости сценария); Zywave Apex MCP (US). ebroker-ИИ не найден (сайт 503).
- **Интеграторы:** 17 проверены, ни одного кейса mediación; Kit Consulting €12/18/24 k (закрыт с 03.2025).
- **Не-софт:** BPO для corredurías с публичными ценами не найден (TPA Van Ameyde — без цен); полная стоимость tramitador 29–39 k€ (соцвзносы 30,65 % + AT); Copilot/ChatGPT/Claude на 40 мест — $9,6–14,4 k/год.
- **Пустой квадрант:** «средний брокер 30–500 × permission-aware ассистент поверх ERP + EIAC/CIMA + почта + экстранеты (Испания/ЕС)»; смежные заняты MPM TarifAI/Coverize+ (процесс) и ennabl/Quandri (США).
- **Отличия:** EIAC-нормализация + мульти-ERP (ров против горизонталов и интеграторов, но не против MPM/ebroker); EU/permission-aware под art. 188 RDL 3/2020 и art. 9 GDPR («минимум-плюс», Coverize+ частично уже там); data flywheel по исходам реноваций. Канал ADECOSE не эксклюзивен (партнёрской программы нет).
- **Риски:** ERP-вендоры (MPM, Codeoscopic) + прецедент Applied vs Comulate; Copilot $18–21 + Copilot Studio + MCP от ERP-вендоров; Foliume/Panora/Quandri/Outmarket идут в Испанию/вверх, страховщики через CIMA «отключают любые другие способы работы».

Вывод для запасной ниши: конкурентное поле подтверждает решение Блока 4 — брокеры остаются быстрым полигоном и вторым вертикальным пакетом, но не первым продуктом: владелец ERP (MPM) уже строит ровно тот сценарий (defensa de cartera), который был выбран для v1.

---

## Что не найдено или сомнительно
- Дата/ARR Series B Raft; раунды Levity после 2022; цены cargo.one, Digicust, Beacon, VisualTrans, Bytemaster, SC Trade, DeiWorld.
- Название мюнхенского стартапа ($3,2 M); Chain.io, project44, FreightGPT, Hubflow, Clearit, CustomsAI — не проверены.
- Доля CargoWise среди испанских транзитариев.
- Ставки €/день интеграторов (Hays/Michael Page/Malt не открылись); цены BPO; стоимость найма/текучесть.
- Статус Kit Consulting / Kit Digital на 09.2026; программы BCL для стартапов.
- Отзывы G2/Capterra/Reddit по нишевым игрокам — не открывались; для горизонталов — только Computerworld/Gartner-опрос и HN.
- ChatGPT Enterprise «$60 / 150 мест» — восходит к одному Reddit-посту 2023; промо Copilot Business — расхождение дат (30.09 vs 31.12.2026).
- Метрики вендоров (Raft «$150 M+ экономии», cargo.one «68 % быстрее», Digicust «99,9 %», VisualTrans «5 000+ пользователей») — заявлены, не измерены.
