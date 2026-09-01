# E2 — Занята ли позиция: «ИИ для регламентированных разговоров»

**Статус:** в работе (черновик, наполняется по ходу исследования)
**Дата:** 2026-09-01

Разграничение:
- **Продукт А** — надзор за коммуникациями (communications surveillance / compliance archiving): слушает и проверяет УЖЕ состоявшиеся разговоры.
- **Продукт Б** — голосовой агент, который САМ ведёт регламентированный разговор вместо сотрудника.

---

## Черновые заметки (по ходу)

### Раунд 1 — сырые факты

- Behavox: $175M preferred equity от HPS Investment Partners (часть BlackRock), анонс 17.06.2026 (Businesswire). Всего привлечено ~$471M (Tracxn). Рост ARR >30% за 2025, клиентская база +86% до >100 крупных финансовых институтов. Продукты: Quantum (надзор за коммуникациями, agentic AI, тянет чаты+почту+ГОЛОС+архив в одно дело), Polaris (trade surveillance, запущен 2025).
- Theta Lake — ЕДИНСТВЕННЫЙ публичный прайс из найденных (AWS Marketplace, 12-мес контракт):
  - SMB Platform: $15 000/год (до 999 юзеров) + требуется PUPY content SKU
  - Enterprise Platform: $50 000/год (1000+ юзеров) + PUPY content SKU
  - Модель: платформенный fee + per user per year по ТИПУ КОНТЕНТА (video / voice / chat отдельно). Сумма PUPY не раскрыта.
- Global Relay: ориентир из вторичных источников (Vendr/SelectHub) — Compliance Email Archive ~$15/юзер/мес (вкл. Legal&Compliance $3 + WORM storage $2), one-time setup $995 на тенант, минимум 10 юзеров; средний годовой чек ~$86k, максимум до $400k. НЕ первичный источник — пометить.
- Волна штрафов «off-channel»: SEC — 95 действий, $2.3 млрд суммарно (сент.2022: 16 фирм / $1.1млрд SEC + CFTC = >$1.8млрд по 11 институтам; 2023 — 11 фирм; 2024 — 26 фирм; янв.2025 — финальная волна 12 фирм на $63M). SEC+CFTC+FINRA суммарно >$3.5 млрд. **Предмет — переписка (WhatsApp, личные телефоны), НЕ голос.**

### Раунд 2 — сырые факты

- Skit.ai: GenAI-first collections, голосовые агенты + SMS/email/chat. Заявляет 8+ лет живых внедрений, 1 млрд разговоров, $1B+ урегулированных счетов. Compliance Layer: FDCPA, TCPA, Reg F, ISO 27001, HIPAA, HITECH. Финансирование ~$47.6M за 5 раундов (Tracxn); Series B $23M (WestBridge Capital, 2021).
- Prodigal (по сайту вендора): proAgent — «purpose-built Agentic AI для полной автоматизации collections», голос + цифра, 24/7 = ЭТО автономный голосовой агент. Плюс агент-ассист/аналитика: proAssist (реалтайм-подсказки живому агенту), proInsight (QA/скоркарты), proNotes (заметки, EN+ES), proScore, proPay, proCollect. Т.е. Prodigal = И Б, И «полу-А» (QA звонков).
- TrueAccord: digital-first с 2013, ЯВНО отказ от телефона — email/SMS, 96% потребителей закрывают долг self-serve без человека. Голосового агента НЕТ. **Агрегаторы часто ставят TrueAccord в список «AI voice collections» — это ошибка.**
- Страховые продажи (регуляторика): NAIC Model Bulletin on Use of AI Systems by Insurers принят дек.2023, к маю 2026 принят 24+ штатами. Ключевое ограничение: лицензированным агентом (producer) может быть только «natural person» или юрлицо; ИИ юридически — «property/software». Core insurance acts (рекомендация покрытия, «стоит ли поднять франшизу») — non-delegable, нужен лицензированный человек. ИИ может объяснять термины и перечислять лимиты.
- Мультиязычность надзора: FINRA Rule 3110 требует надзирать коммуникации на ЛЮБОМ разрешённом фирмой языке. Признанная индустрией боль: лексиконы плохо переводятся (мандарин, португальский), высокий false-positive, «неровное региональное покрытие». Smarsh Intelligent Agent Detect: EN, ES, DE, PT, FR, HI, IT, JA, ZH. Behavox заявляет мультиязычность.

### Раунд 3 — голос vs текст, языки

- Behavox Voice 2.0 (пресс-релиз вендора, ноя.2023): 12+ языков, WER ~20% в 9 языках. Behavox Quantum Voice (пресс-релиз 21.08.2025, Businesswire): полная транскрипция + risk detection + **language-switching** для японского, мандарина, кантонского, хинди, корейского, вьетнамского, тайского, тагальского, индонезийского. Поддержка 150+ типов данных, включая источники голоса: Red Box, Verint, Cloud9, NICE, Cisco, Zoom, MS Teams.
- Shield (блог вендора, «State of Voice and Video Surveillance»): заявляет, что **«все голосовые решения спроектированы под надзор ТОЛЬКО на английском»** и что мало кто ловит переключение языка. ⚠️ Это заявление конкурента, и оно ПРЯМО опровергается пресс-релизом Behavox (авг.2025). Использовать как «спорный тезис», не как факт.
- 1LoD 2026 Surveillance Benchmarking Survey (спонсор Global Relay): ~70% фирм в PoC или активном внедрении AI в e-comms И ГОЛОСОВОМ надзоре; НИ ОДИН респондент не назвал AI полностью встроенным. 71% — фрагментация данных главный барьер. 22% банков признают, что их инфраструктура надзора не управляет риском рыночных злоупотреблений эффективно. 41% фирм в 2024 отказывались мониторить «культуру», к 2026 — 89% будут.
- Размеры рынка (вторичные, аналитики — брать как порядок, не как факт):
  - Communication surveillance: $4.92 млрд (2025) → $11.59 млрд (2033), CAGR 11.6% (Grand View Research)
  - Trade surveillance: $1.7 млрд (2024) → $5.2 млрд (2030), CAGR 20.2% (Grand View Research)
  - Voice surveillance in financial services: $4.2 млрд (2025) → $11.8 млрд (2034) (Dataintelo — низкое доверие)

### Раунд 4 — деньги игроков и консолидация

- SteelEye: Series B $21M (сент.2022), лид Ten Coves Capital; всего $43M. Коммуникационный + торговый надзор.
- Shield (shieldfc, Израиль, осн. 2018): Series B $20M (01.12.2022, GlobeNewswire), лид Macquarie Capital, участие UBS Next, Mindset Ventures, OurCrowd.
- Theta Lake: всего ~$71.5M. Series B $50M (23.03.2022, Businesswire), лид Battery Ventures; участники — Lightspeed, Neotribe, **Cisco Investments, RingCentral Ventures, Salesforce Ventures, Zoom** (т.е. стратеги-UC вложились в надзор за голосом/видео).
- Verint: куплен Thoma Bravo, сделка закрыта 26.11.2025, EV $2 млрд, объединяется с Calabrio. CEO Dan Bodner ушёл в advisory.
- NICE Actimize: NICE готовит продажу дивизиона Actimize, оценка в прессе $1.5–2 млрд (A-Team Insight). ⚠️ проверить статус.
- Smarsh: купил TeleMessage (фев.2024, мобильные сообщения) и **CallCabinet (фев.2025, cloud-native compliance call recording)** — прямой заход в голос. Лидер Gartner MQ DCGA 2025.
- NICE Actimize ранее купил Redkite (trade surveillance) и Guardian Analytics.
- **КЛЮЧЕВОЙ ФАКТ (Gartner, цитируется Smarsh):** «к 2028 году 80% клиентов DCGA консолидируют надзор за текстовым И аудио/видео контентом в одном решении — против МЕНЕЕ 20% в 2024». → в 2024 голос и текст надзирались раздельно у >80% фирм; т.е. щель по голосу РЕАЛЬНА сегодня, но инкумбенты её закрывают и Gartner ждёт закрытия к 2028.

### Раунд 5 — Продукт Б по сегментам

**Взыскание / обслуживание долга — ЗАНЯТО, деньги большие:**
- Skit.ai — голосовые агенты, ~$47.6M
- Prodigal proAgent — «полная автоматизация collections», голос+цифра
- Salient (trysalient.com) — $60M от a16z + Y Combinator + Matrix + Michael Ovitz (июль 2025); AI-native loan servicing, голосовые агенты для авто-кредитов; $1B+ обработано с 2023; ARR $14M на июнь 2025; клиент Consumer Portfolio Services (публичный пресс-релиз о развёртывании)
- TrueAccord — НЕ голос (digital-first email/SMS)

**Страховые продажи — ЗАНЯТО (частично), но упирается в лицензирование:**
- Liberate (liberate.ai) — Series A $50M, лид Battery Ventures; ранее $7M. Партнёрство с Zywave/TurboRater: Voice AI **comparative quoting** — котировки личного страхования во всех 50 штатах, 24/7, на английском, испанском и 100+ языках. Т.е. агент реально КОТИРУЕТ, а не только маршрутизирует. $100B+ премий обработано, SOC2/HIPAA/PCI, OpenAI Select Partner.
- Sixfold — AI Underwriter (июнь 2026), straight-through quote & bind; клиенты — Zurich, Generali GC&C, Guardian, Axis, New York Life, Skyward Specialty ($270B GWP суммарно).
- Ограничение (NAIC Model Bulletin + законы штатов о лицензии): «core insurance acts» — рекомендация покрытия/подбор под нужды — non-delegable, нужен лицензированный человек. Отрасль сходится на гибриде, не на замене агента.

**Финансовые консультации (инвест-советы голосом) — ПРАКТИЧЕСКИ ПУСТО, и это не случайность:**
- Рекомендация подпадает под Reg BI (брокер-дилер) и фидуциарную обязанность по Advisers Act (RIA). Требуется объяснимость: какие данные повлияли на рекомендацию и в какой мере, в формате, пригодном для своевременной проверки ЧЕЛОВЕКОМ.
- SEC Exam Priorities 2025: проверяют политики по ИИ и раскрытия; «AI-washing» под Rule 206(4)-1.
- Записи разговоров обязательны: SEC Rule 204-2 + правила FINRA.
- Существующие голосовые ИИ для эдвайзеров (напр. Botphonic) делают админ/расписание/квалификацию, НЕ советы.

**Сквозное регуляторное ограничение продукта Б (США):**
- FCC Declaratory Ruling от 08.02.2024: ИИ-сгенерированный голос = «artificial or prerecorded voice» по TCPA. Значит: нужно prior express (written) consent, идентификация ответственной стороны и механизм отказа. Это применимо к ЛЮБОМУ исходящему ИИ-звонку потребителю — в взыскании, страховании, продажах.

### Раунд 6 — цены, консолидация, опровержение «свободной щели»

**Ценовые ориентиры (лестница):**
- CallCabinet (теперь Smarsh): от **$14.95/юзер/мес**, безлимит записи и хранения, без поминутной тарификации (сайт вендора / реселлер California Telecom)
- Dubber (по G2): Call DUB **$14.95**/юзер/мес, DUB AI **$29.95**/юзер/мес → AI-слой примерно удваивает цену захвата
- Global Relay: ~**$15**/юзер/мес за Compliance Email Archive + $995 setup (вторичный источник Vendr/SelectHub); средний годовой контракт ~$86k, макс. до $400k
- Theta Lake: платформа **$15k/год** (SMB, до 999) или **$50k/год** (Enterprise 1000+) + per-user-per-year отдельно по типу контента (voice/video/chat) — AWS Marketplace
- ⇒ **Допущение:** полноценный голосовой надзор в финсекторе выходит примерно $30–60/юзер/мес плюс платформенный fee; enterprise-контракт — сотни тысяч $/год.

**Консолидация — кто кого:**
- Smarsh ← Digital Reasoning (2020, AI/NLP), ← TeleMessage (фев.2024, мобильные сообщения), ← **CallCabinet (04.02.2025, cloud-native compliance call recording; суммы не раскрыты)**. Сайт callcabinet.com теперь редиректит на smarsh.com/channels/voice/ — поглощение завершено. CallCabinet принёс сертифицированные интеграции с Avaya, Cisco, Microsoft, Webex, Zoom, 8x8.
- Verint ← Thoma Bravo, закрыто 26.11.2025, EV $2 млрд, сливают с Calabrio.
- NICE Actimize: выставлен на продажу (Goldman Sachs + JP Morgan). Ноя.2025 — ценник $1.5–2 млрд. К маю 2026 — 5 претендентов в due diligence при оценке ~$2.5 млрд: Advent International, Veritas Capital, New Mountain Capital, Stone Point Capital, **SymphonyAI**. NICE купил Actimize в 2007 за $280M. Actimize = 17% выручки NICE, но 29% прибыли.
- NICE ранее ← Redkite (trade surveillance), ← Guardian Analytics.
- Relativity Trace жив, партнёрство с Proofpoint (архив) и Intelligent Voice (голос); клиенты ING, Daiwa Capital Markets Europe, Vitol. **25+ языков и диалектов для голоса с автоопределением языка.**

**⛔ ГЛАВНОЕ ОПРОВЕРЖЕНИЕ гипотезы «свободный сегмент = голос + не-трейдинг + не-английский»:**
- **Sedric AI** (sedric.ai, Тель-Авив): compliance-dedicated LLM, надзор по каналам **voice, chat, email, social**, вертикали — финтехи/необанки, банки, крипто, **ARM (взыскание)**, трейдинг/секьюритиз. Покрывает UDAAP, Reg Z, TILA, ECOA, FTC, CFPB, SEC, FINRA, FCA, ESMA, MiFID, MiCA, **FDCPA** и законы штатов. Series A **$18.5M** (сент.2024), лид Foundation Capital, участие Amex Ventures, StageOne, The Garage; всего $22M. Клиенты: eToro, Trading 212, Capital.com, Exness, Libertex, NinjaTrader, Cedar Financial, WebBank, Coastal Bank.
- То есть именно та «щель», которую хотели занять (голосовой надзор вне капитальных рынков, вне английского, для лендинга/взыскания/страхования), уже занята стартапом на Series A с логотипами клиентов.

**Регуляторная база голоса (почему голос не «непокрыт по закону»):**
- MiFID II ст.16(7) — обязательная запись телефонных разговоров, связанных со сделками; хранение мин. 5 лет, до 7 по требованию регулятора; tamper-proof.
- UK: онширинг в FCA Handbook — SYSC 10A + COBS 11.8.
- ⇒ Запись голоса в финансах обязательна ДАВНО. Пробел не в записи, а в НАДЗОРЕ (анализе) записанного.

