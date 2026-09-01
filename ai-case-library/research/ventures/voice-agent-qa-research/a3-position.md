# A3 — Проверка позиции: «Ниша разговорных голосовых агентов для гос/суверенных контуров не занята»

Дата проверки: 2026-09-01. Метод: первичные источники (реестр FedRAMP Marketplace — полная выгрузка карточек продуктов,
сайты вендоров, пресс-релизы). Порог опровержения задан заказчиком: если у мейджора или интегратора уже есть
разговорный голосовой агент с нужными аккредитациями — критерий опровергнут.

**СТАТУС: завершено.**

---

## 0. Главное, что уже найдено (краткий спойлер)

Утверждение «ниша не занята» **опровергнуто для контура US Federal / FedRAMP Moderate**.
В реестре FedRAMP на 2026-09-01 есть как минимум:

- **Bland AI** — чистый pure-play «enterprise voice AI platform… AI phone agents», **FedRAMP Certified (20x, Class A pilot)**,
  deployment model **Government-Only Cloud**, свои собственные speech- и language-модели («customer calls are not sent to
  third-party frontier model providers»). Это буквально тот самый «независимый поставщик разговорного голоса в суверенном контуре»,
  который гипотеза считает несуществующим.
- **Entratus Conversational AI Platform** — **FedRAMP Certified (20x, Class C), Moderate**, «intelligent virtual assistants…
  natural language conversations via voice, web, and SMS».
- **Verint Self-Service for Government (VSSG)** — Verint IVA (голос+цифра) + Verint IVR, **Legacy FedRAMP Ready, Moderate**.
- **Maximus Intelligent Virtual Assistant (MIVA)** — **FedRAMP Authorized, Moderate, с 2019 г.**, прямо позиционируется как замена
  туш-тон/directed-dialog IVR на разговорный голос для госконтакт-центров.
- **NICE CXone, Genesys Cloud CX, Talkdesk Gov Edition, Content Guru storm (High), Lumen, T-Metrics, eGain, TTEC Humanify-G** —
  CCaaS с голосовыми ботами/IVA в FedRAMP-контуре.

Подробности, даты и оговорки — ниже.

---

## 1. Реестр FedRAMP Marketplace — первичная выгрузка

Источник: https://www.fedramp.gov/marketplace/products/ (страница отдаёт полный JSON-подобный дамп всех карточек;
выгружено и распарсено 587 записей 2026-09-01).

### 1.1. Прямые попадания — «разговорный голос» как основной продукт

| Вендор / CSO | Что это | Статус FedRAMP | Уровень | Дата | Примечание (первичка) |
|---|---|---|---|---|---|
| **Bland AI — «Bland»** (FR2628647242) | Enterprise voice AI platform, AI phone agents, собственные speech+LLM модели | **FedRAMP Certified**, путь 20x, Class A (Pilot), phase «Ongoing Certification» | не указан (20x pilot, impact_level = Unknown) | Initial Impl. 2026-07-17 → In Process 2026-08-06 → **Certified 2026-08-25** | deployment_model = **Government-Only Cloud**; trust center trust.bland-gov.com; ATO у агентств пока 0 |
| **Entratus — Conversational AI Platform** (FR2606141075) | IVA: «natural language conversations via voice, web, and SMS», транскрипция, human-in-the-loop | **FedRAMP Certified**, путь 20x, Class C | **Moderate** | In Process 2025-12-02 → **Certified 2026-05-06** | assessor A-LIGN; 1 authorization; public cloud |
| **Maximus — MIVA (Maximus Intelligent Virtual Assistant, ex-MIA)** | «Replaces traditional touchtone and directed dialog speech IVRs… interacts conversationally with callers», голос/email/SMS, интеграция со всеми крупными телефониями | **FedRAMP Authorized** | **Moderate** | Ready 2017-12-01, **Authorized 2019-04-09** | Госспециализированный вендор (Maximus — крупный BPO для федеральных и штатных программ) |
| **Verint — Verint Self-Service for Government (VSSG)** (FR2425035681) | Verint IVA (AI-разговоры на voice+digital) + Verint IVR + Call Risk Scoring | **Legacy FedRAMP Ready** (не Authorized) | Moderate | Ready **2024-11-26** | assessor Kratos; SaaS, public cloud; в описании прямо «AI-driven conversations… across voice and digital channels» |
| **Beam Up Ltd — «Beam»** (FR2632054530) | «Talk is a conversational AI voice and chat agent that answers resident calls… with SIP transfer to a human»; + real-time interpretation (STT→LLM→TTS) | **Initial Implementation** (20x), в процессе | не указан | заявка 2026-08-21 | целевой сегмент — human services agencies (соцслужбы) |

### 1.2. CCaaS-платформы с голосовыми ботами в госконтуре

| Вендор / CSO | Статус | Уровень | Дата авторизации | Голосовой ИИ |
|---|---|---|---|---|
| **NICE CXone** (FR1704655535) | FedRAMP Authorized | Moderate | **2018-04-09** | В карточке FedRAMP заявлены speech recognition, TTS, IVR, «intelligent virtual agent» |
| **Genesys Cloud CX** (FR2131766015) | FedRAMP Authorized | Moderate | **2023-06-26** | В карточке — conversational, IVR, NLU |
| **Content Guru — storm Cloud Contact Center** (FR2325657620) | FedRAMP Authorized | **High** | **2025-03-20** | CCaaS + «AI-driven Intelligent Automation»; голосовой бот явно не назван в карточке |
| **Talkdesk CX Cloud Government Edition** (FR2213647361) | FedRAMP Authorized | Moderate | **2025-06-03** | Карточка описывает voice engagement/routing; AI-агенты в карточке не выделены |
| **Lumen — Cloud Contact Center** (FR2229642430) | FedRAMP Authorized | Moderate | **2025-04-30** | — |
| **T-Metrics Cloud Contact Center (TCCC)** (FR1730842236) | FedRAMP Authorized | Moderate | **2023-03-31** | В карточке — voicebot, speech recognition, NLU, chatbot; + JITC для on-prem |
| **eGain Suite** (FR-…) | FedRAMP Authorized | Moderate | **2021-12-15** | Virtual Assistant/чат-бот (текст), не голос |
| **TTEC Humanify Enterprise – Government** | FedRAMP Authorized | Moderate | **2019-12-26** | Cisco UCCE + Verint WFO; IVR, speech analytics |
| **Nuance Dragon** (FR2102036897) | FedRAMP Authorized | Moderate | **2021-08-16** | Только распознавание речи (диктовка), не разговорный агент |
| **Moveworks GovCloud** | FedRAMP Authorized | Moderate | **2026-01-30** | Agentic assistant, natural language — но чат/интерфейс сотрудника, не телефон |
| **Verint (Legacy Ready)** | см. выше | Moderate | 2024-11-26 | IVA voice+digital |

### 1.3. Кого в реестре НЕТ (по состоянию на 2026-09-01, поиск по 587 карточкам)

- Нет отдельных карточек **Five9**, **Cisco Webex Contact Center (Gov)**, **Avaya** как самостоятельного CSO — Avaya фигурирует
  как Avaya Government Cloud с **DISA IL4 Provisional Authorization** (см. раздел 3), а не FedRAMP-карточкой в этой выгрузке.
- Amazon Connect и Google CCAI покрываются авторизациями AWS/GCP целиком, а не отдельной карточкой (см. раздел 3).

### 1.4. Уточнение по полной выгрузке (713 карточек, 2026-09-01)

Итоговый список карточек FedRAMP, где в описании/названии есть разговорный голос (conversational AI / voice AI /
voicebot / intelligent virtual agent / speech):

| CSP | CSO | Статус | Уровень | Путь | Дата | ATO агентств |
|---|---|---|---|---|---|---|
| Bland AI | Bland | FedRAMP Certified | (20x pilot, уровень не проставлен) | 20x Class A | 2026-08-25 | 0 |
| Entratus | Entratus Conversational AI Platform | FedRAMP Certified | Moderate | 20x Class C | 2026-05-06 | 1 |
| Beam Up Ltd | Beam (модуль Talk — голосовой агент) | Initial Implementation | — | 20x | заявка 2026-08-21 | 0 |
| MAXIMUS Inc. | Maximus Intelligent Virtual Assistant (MIVA) | FedRAMP Authorized | Moderate | Rev5 | 2019-04-09 | 3 |
| MAXIMUS Inc. | MAXIMUS Cloud | FedRAMP Authorized | Moderate | Rev5 | 2022-02-16 | 4 |
| NICE CXone | NiCE CXone | FedRAMP Authorized | Moderate | Rev5 | 2018-04-09 | 13 |
| Genesys | Genesys Cloud CX | FedRAMP Authorized | Moderate | Rev5 | 2023-06-26 | 11 |
| Verint | Verint Self-Service for Government | Legacy FedRAMP **Ready** | Moderate | Rev5 | 2024-11-26 | 0 |
| T-Metrics | T-Metrics Cloud Contact Center | FedRAMP Authorized | Moderate | Rev5 | 2023-03-31 | 3 |
| TTEC | Humanify Enterprise – Government | FedRAMP Authorized | Moderate | Rev5 | 2019-12-26 | 11 |
| eGain | eGain Suite | FedRAMP Authorized | Moderate | Rev5 | 2021-12-15 | 2 |
| Nuance | Nuance Dragon | FedRAMP Authorized | Moderate | Rev5 | 2021-08-16 | 2 |
| Talkdesk | CX Cloud Government Edition | FedRAMP Authorized | Moderate | Rev5 | 2025-06-03 | — |
| Content Guru | storm Cloud Contact Center | FedRAMP Authorized | **High** | Rev5 | 2025-03-20 | — |
| Lumen | Cloud Contact Center | FedRAMP Authorized | Moderate | Rev5 | 2025-04-30 | — |
| Avaya Federal Solutions | Avaya Government Cloud (UC+CC) | FedRAMP Authorized | Moderate | Rev5 | 2019-04-29 | 4 |
| Amazon | AWS GovCloud | FedRAMP Authorized | **High** | Rev5 | 2016-06-21 | 83 |
| Microsoft | Azure Government (incl. Dynamics 365) | FedRAMP Authorized | **High** | Rev5 | 2020-04-29 | 69 |
| Google | Google Cloud Platform | FedRAMP Authorized | **High** | Rev5 | 2019-12-04 | 27 |
| Cisco | Webex for Government | FedRAMP Authorized | Moderate | Rev5 | 2016-02-02 | 43 |

**Five9 в реестре FedRAMP отсутствует** (поиск по 713 карточкам — 0 совпадений по `Five9`).
Cognigy как отдельного CSO в реестре тоже нет (он поставляется внутри NiCE).

---

## 2. Гиперскейлеры: разговорный голос В суверенных контурах — есть

Это ключевая проверка гипотезы «гиперскейлеры не дают разговорный голос в суверенных контурах».
**Гипотеза не подтверждается по первичным источникам.**

### 2.1. AWS

Источник: https://aws.amazon.com/compliance/services-in-scope/FedRAMP/ и
https://aws.amazon.com/compliance/services-in-scope/DoD_CC_SRG/ (официальные таблицы AWS, проверено 2026-09-01).

| Сервис | FedRAMP Moderate (US East/West) | FedRAMP **High** (GovCloud) | DoD SRG **IL4** | DoD SRG **IL5** |
|---|---|---|---|---|
| Amazon Lex (`lex-models`, `lex-runtime`) — разговорный voice+chat NLU | ✓ | ✓ | ✓ | ✓ |
| Amazon Connect — CCaaS | ✓ | ✓ | ✓ | ✓ |
| Amazon Polly (TTS) | ✓ | ✓ | ✓ | ✓ |
| Amazon Transcribe (STT) | ✓ | ✓ | ✓ | ✓ |
| Amazon Bedrock (LLM) | ✓ | ✓ | ✓ | ✓ |

Т.е. **весь стек разговорного голоса (STT + NLU/LLM + TTS + телефония) авторизован в AWS GovCloud на FedRAMP High и DoD IL4/IL5.**
Дополнительно: пресс-релиз AWS «Amazon Connect achieves FedRAMP High authorization»
(https://aws.amazon.com/blogs/publicsector/amazon-connect-achieves-fedramp-high-authorization) и
«OpenAI GPT, GPT OSS и NVIDIA Nemotron на Amazon Bedrock получили FedRAMP High и DoD IL-4/5 в AWS GovCloud», июнь 2026
(https://aws.amazon.com/about-aws/whats-new/2026/06/addl-bedrock-model-fedramp-il-5-govcloud/).

### 2.2. Microsoft / Azure Government

Источник: https://learn.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope
(официальная таблица области аудита, обновлена февраль 2026, страница правлена 2026-08-18).

| Сервис в **Azure Government** | FedRAMP High | IL2 | IL4 | IL5WI | IL6 |
|---|---|---|---|---|---|
| Foundry: **Speech** (Azure AI Speech — STT/TTS) | ✅ | ✅ | ✅ | ✅ | — |
| **Bot Service** | ✅ | ✅ | ✅ | ✅ | — |
| **Azure OpenAI** | ✅ | ✅ | ✅ | ✅ | **✅** |
| **Microsoft Copilot Studio** (ex-Power Virtual Agents) | ✅ | ✅ | ✅ | — | — |
| **Dynamics 365 Contact Center** | ✅ | ✅ | — | — | — |
| Dynamics 365 Customer Service / Omnichannel | ✅ | ✅ | ✅ | ✅ | — |
| Foundry: LUIS / Language | ✅ | ✅ | ✅ | ✅ | ✅ |

Azure Government в целом держит FedRAMP High P-ATO (JAB) + DoD IL2/IL4/IL5 PA (DISA);
Azure Government Secret — IL6 + JSIG PL3; Azure Government Top Secret — ICD 503.
**Вывод: разговорный голос (Speech + OpenAI + Bot Service) доступен вплоть до IL5, а LLM-часть — до IL6.**

### 2.3. Google

- Google Cloud Platform — FedRAMP **High** (Rev5), с 2019-12-04, 27 ATO (реестр FedRAMP).
- **Gemini for Government** — FedRAMP Certified через 20x, уровень **Low**, 2026-01-21, 2 ATO (реестр FedRAMP).
  То есть у Google в госконтуре пока «слабое звено» именно по уровню для генеративного слоя.
  (Проверить отдельно CCAI/Dialogflow в FedRAMP-scope GCP — см. блок «Открытые вопросы».)

### 2.3-bis. Google — уточнение (первичка)

- **Dialogflow CX имеет авторизацию FedRAMP High.** Официальная страница Google
  https://docs.cloud.google.com/dialogflow/docs/compliance-security-controls — таблица авторизаций: «Dialogflow CX has received
  the following authorizations: **FedRAMP High**». Для Dialogflow ES — прочерк. Про DoD IL на этой странице ничего нет.
- Google подчёркивает: «Dialogflow is comprised of other Google Cloud services, such as Speech-to-Text and Text-to-Speech,
  and any certifications, security controls, and government authorizations cover Dialogflow in its entirety».
- Для FedRAMP High у Google обязателен **Assured Workloads Data Boundary for FedRAMP High + Assured Support**
  (https://cloud.google.com/security/compliance/fedramp). FedRAMP High P-ATO Google покрывает 150+ сервисов.
- Отдельно **Gemini for Government** авторизован по 20x только на уровне **Low** (реестр FedRAMP, 2026-01-21).

### 2.4. Cisco

- **Webex Contact Center Enterprise for Government (Webex CCE-G)** — **FedRAMP Moderate**
  (даташит Cisco: «…requiring a FedRAMP Moderate authorized cloud Contact Center»).
  Важная деталь: в даташите **нет упоминания разговорного/виртуального агента** — самообслуживание описано как классический
  Unified CVP IVR (тон/голосовые команды по заранее заданным задачам). Это скорее подтверждает нишу, чем опровергает.
- Webex for Government (сам Webex) — FedRAMP Moderate с 2016 г., 43 ATO.
- Cisco заявляет «AI Assistant for Government… generally available on FedRAMP-authorized infrastructure» (Cisco Live US, июнь 2026) —
  но это ассистент для агента, не голосовой бот для звонящего. **Допущение:** трактую как не-разговорный-голос до проверки по даташиту.

### 2.5. Five9 — единственный крупный CCaaS БЕЗ госаккредитации

Первичный источник — собственная страница Five9 (https://www.five9.com/solutions/government):
дословно «**We are committed to obtaining FedRAMP Moderate authorization** to meet the rigorous standards required for federal
agencies». То есть авторизации нет, есть только членство в StateRAMP. При этом продукт «Intelligent Virtual Agents /
AI-Powered Self-Service» у них есть — но **вне госконтура**. Подтверждено также отсутствием Five9 в реестре FedRAMP (0 из 713 карточек).

### 2.6. Nuance — стек фактически уходит с рынка, а не занимает нишу

- Microsoft **прекратил продажи** Nuance Enterprise hosted и on-premise лицензий **09.08.2024**.
- Поддержка hosted-предложений закончилась **в декабре 2025**, sustaining support для on-prem — **июнь 2026**.
  Речь о модуле Dialog (Recognizer — ASR, Vocalizer — TTS), на котором построена значительная часть мировых
  natural-language IVR. Источник: CX Today, «Nuance to Stop Supporting On-Premise Contact Centers: Now What?»;
  ReadSpeaker, «Nuance On-Prem EOL (2024–2028): 90-Day IVR Migration Plan».
- Рекомендованные пути миграции от самого Microsoft: **Azure, Dynamics 365 Contact Center, Copilot Studio**;
  preferred partner по миграции — **HCLTech** («Nuance Migration Factory»,
  листинг на Microsoft Marketplace: HCLTech Nuance→D365 CCaaS Migration Assessment Services).
- В FedRAMP из Nuance остался только **Nuance Dragon** (Moderate, 2021-08-16) — это медицинская диктовка (Dragon Medical One
  в Azure Government, ATO у VA, дистрибуция через Carahsoft/NASA SEWP V), **не разговорный агент**.
- **Nuance Mix в реестре FedRAMP отсутствует.**

**Это важнейший вывод по позиционированию:** уход Nuance с on-prem/hosted создаёт волну вынужденных миграций
голосовых IVR в госсекторе — то есть спрос есть, но и «пылесосы» этого спроса уже назначены (Microsoft + HCLTech).

---

## 3. Оборонные интеграторы и канал

### 3.1. Accenture Federal Services — «Agentic Service Center» / **FedVoice**

Первичный источник: https://www.accenture.com/us-en/industries/accenture-federal-services/agentic-service-center

- Продукт **FedVoice** даёт «human-like voice interactions», «24/7 support and the autonomous containment of **~45%** of
  routine inquiries without human intervention».
- Архитектура заявлена как «**modular FedRAMP-compliant architecture**», помогающая агентствам «achieve Authority to Operate (ATO) quickly».
- Названный кейс: **Federal Retirement Thrift Investment Board (FRTIB)** — 7,3 млн участников, $1+ трлн активов,
  97% взаимодействий в цифровых каналах, 94% удовлетворённость, −13% AHT.
- Май 2026: Accenture Federal Services + OpenAI — «agentic lab and FedRAMP-aligned implementation pathways».

**Это прямое опровержение по критерию «оборонные/федеральные интеграторы не поставляют разговорный голос».**

### 3.2. Прочие интеграторы

- **Booz Allen** — позиционируется как «number-one provider of AI services to the U.S. federal government»; партнёрство с **OpenAI**
  (национальная безопасность) и стратегический альянс с C3 AI. Публично оформленного *голосового* продукта для контакт-центров не нашёл —
  **допущение:** голос делается проектно под заказчика, а не как продукт с собственной аккредитацией.
- **Leidos** — январь 2026: партнёрство с OpenAI (agentic/gen AI в оборону, нацбезопасность, здравоохранение). В FedRAMP —
  только Leidos IQ FedCloud (Moderate, 2019). Голосового продукта не найдено.
- **CACI, SAIC** — в реестре FedRAMP отсутствуют; публичных голосовых продуктов не найдено.
- **TTEC Digital** — есть свой FedRAMP-контур (Humanify Enterprise-G, Moderate, 11 ATO), построенный на Cisco UCCE + Verint;
  это фактически интегратор-в-контуре.
- **HCLTech** — назначен Microsoft «preferred partner» для миграции клиентов Nuance на Dynamics 365 Contact Center
  («Nuance Migration Factory»).

### 3.3. Carahsoft как канал (Master Government Aggregator)

Carahsoft активно набирает AI-вендоров в госканал в 2026:
- **Moveworks** — «Carahsoft and Moveworks partner to bring **conversational AI** to the public sector»
  (Moveworks: FedRAMP Moderate, авторизация 2026-01-30; в 2026 куплен ServiceNow — пресс-релиз
  «Moveworks from ServiceNow achieves FedRAMP moderate authorization to provide secure conversational AI to public sector»).
- **Soprano Design** (январь 2026) — SMS, Email, **Voice**, Conversational AI для госсектора.
- **Upland Panviva** (август 2026) — AI Conversational Search для агентов контакт-центра.
- **Cohere** (июль 2026) — «secure, **sovereign AI** deployment solutions to the public sector».
- **Nuance Dragon** — исторически распространялся через Carahsoft по NASA SEWP V.

Вывод: **канал в госсектор для голосового/разговорного AI уже проложен и активно заполняется**, барьер входа здесь — не «никого нет»,
а «надо пролезть в уже сформированный список».

---

## 4. Специализированные госстартапы (пункт 6 — самый важный)

### 4.1. Polimorphic — прямой конкурент в муниципальном сегменте

Первичный источник: https://www.polimorphic.com/voice-agent и https://www.polimorphic.com/

- Продукт: **Voice Agent** — ИИ отвечает на звонки жителей 24/7, маршрутизирует, снимает голосовые заявки, заводит service requests;
  **75+ языков**; заявлена цель «replace your government phone tree with an AI call center».
- Полный стек: AI front desk + constituent CRM + voice agents + workflow.
- **Названные клиенты (муниципалитеты и округа):** City of Littleton (CO), Suisun City (CA), Newport (RI),
  Weber Basin Water Conservancy District, Passaic County (NJ), Town of Omro (WI), Vernon.
- Метрики из кейсов: 1 700 звонков/мес (Littleton), −70% звонков (Suisun City), 100% resolution (Weber Basin),
  −до 90% голосовых сообщений.
- **Аккредитации:** SOC 2 Type II, HIPAA, ADA/WCAG 2.1 AA, zero-data-retention соглашение с LLM-провайдером,
  TLS 1.2+/AES-256, immutable audit log. **FedRAMP / StateRAMP / TX-RAMP на сайте НЕ заявлены.**
- **Финансирование:** Series B под руководством **General Catalyst** (M13 и Shine — returning), суммарно ~**$28 млн**
  (Crunchbase / материалы компании).

**Это ключевое опровержение по пункту 6 для сегмента «муниципалитеты/штаты»: ниша занята специализированным госстартапом,
которого не видно в общих обзорах CCaaS.** Но заметьте: занята она **без** FedRAMP — на SOC 2. То есть в SLED-сегменте
аккредитация FedRAMP не является входным билетом.

### 4.2. Citibot — второй специализированный игрок в муниципалитетах

Первичный источник: https://www.citibot.io/voice

- **Citibot AI Voice** — ИИ-телефонный ассистент для госорганов: отвечает на вопросы жителей, заводит service requests,
  маршрутизирует, 24/7, многоязычно; интеграции с CRM и 311-платформами, работает на существующем номере агентства.
- **Названные клиенты:** Denver (CO), Kansas City (MO), Lancaster (CA), Village of Wellington (FL),
  Alameda County Mosquito Abatement District.
- Аккредитации на сайте: **ADA compliance/accessibility, end-to-end encryption, «secure data infrastructure»**.
  **FedRAMP / StateRAMP не заявлены.**
- Финансирование скромное: по данным Tracxn — ~$994K за один раунд (вторичный источник, помечаю как **допущение**).
- Обзорные источники (вторичка, Civic IQ) ставят в один ряд для муниципальных контрактов: **Citibot, Polimorphic,
  Tyler Technologies, Verint**.

### 4.3. Кто ещё заходит в госконтур через FedRAMP 20x (пайплайн)

Из выгрузки реестра, статус «Initial Implementation / In Process», путь 20x:
- **Eleven Labs Inc. — ElevenLabs Platform**, Initial Implementation, заявка **2026-07-17**. Это TTS/voice-модельный слой,
  то есть и модельные вендоры уже идут в госконтур.
- **Beam Up Ltd — Beam** (модуль Talk — голосовой агент для соцслужб), Initial Implementation, 2026-08-21.
- **Freshworks for Government** (agentic), 2026-08-04.

---

## 5. ЕС: здесь картина принципиально другая

### 5.1. Франция — SecNumCloud

- Квалификация SecNumCloud (ANSSI) — обязательный «суверенный» уровень для чувствительных госданных.
- По состоянию на **июль 2026** квалифицированы примерно **9–10 провайдеров**: Cegedim, Cloud Temple, Index Education,
  OVHcloud, Oodrive, Orange Business, Outscale, S3NS, Whaller, Worldline (~12 заявок в процессе; всего в каталоге ANSSI
  фигурирует до 21 записи по разным офферам). Источники — вторичные обзоры (legiscope, nis2-pro, codeconfiance),
  официальный каталог ANSSI (cyber.gouv.fr) при проверке отдавал 404 по прямым URL — **проверить вручную**.
- **Ни одного контакт-центрового / разговорно-голосового решения в списке SecNumCloud нет.**
  Это самая чистая «дыра», найденная в исследовании.
- Национальный игрок: **Zaion** (Франция, создан 2017, «изобрели термин callbot»), европейский специалист по голосовому ИИ.
  В марте 2026 купил **Dydu**; объединённая компания >€10 млн ARR, покрывает голос и текст. Среди ~50 крупных клиентов
  указаны «services publics», но публичные референсы — банки и страховые (La Banque Postale, Matmut).
  **SecNumCloud-квалификации у Zaion не нашёл** (помечаю как «не подтверждено», не как «нет»).

### 5.2. Германия — BSI C5

- Для использования облака в госсекторе/органах власти C5-Testat де-факто обязателен.
- **Голосовой слой в немецком госсекторе пока на стадии пилотов, и его строит само государство:**
  федеральная **Behördennummer 115** запустила в регулярную эксплуатацию **ИИ-чатбот** (не голос), разработанный
  **FITKO** (Föderale IT-Kooperation) совместно с 115-Verbund, бесплатно для коммун; уже работает в земле Берлин,
  Аахене, Эссене, Ойтине, Франкфурте-на-Майне, Карлсруэ, районе Харбург, Грюнхайде.
  Прямо заявлено: **используется open-source-решение для конфигурации ИИ-агентов, «kein Vendor Lock-in»**
  ни по облачной платформе, ни по языковой модели (источники: fitko.de, 115.de, kommune21.de).
- **Голосовой бот** — отдельные пилоты: например, город **Нюрнберг** тестирует KI-Voicebot в Behördenwegweiser (kommune21.de).
- **Cognigy** (немецкая, разговорный ИИ, voice+chat, есть on-prem/private-cloud развёртывание) — упоминается в контексте
  C5-совместимости, но подтверждения самого C5-Testat у Cognigy в первичке я не нашёл.
  В США Cognigy как отдельный CSO в FedRAMP отсутствует — он поставляется внутри **NiCE** (NICE купил Cognigy;
  «AI Agents (Cognigy)» — часть CXone).

### 5.3. Италия — ACN

- **Almawave** (группа Almaviva, Euronext Growth Milan) выпустила **Velvet 25B и Velvet Speech 2B** — европейские
  мультиязычные LLM на 24 официальных языках ЕС; **Velvet Speech 2B объединяет текст и голос, даёт диалог в реальном
  времени и мультиязычное распознавание речи с code-switching**, явно нацелен в т.ч. на **Pubblica Amministrazione**.
- **ACN** (Agenzia per la Cybersicurezza Nazionale) ведёт квалификацию облачных и ИКТ-сервисов для PA; в каталоге ACN
  есть записи **AIPA (Assistente Intelligente per la Pubblica Amministrazione)** и **AIWave** — по названиям это
  ИИ-ассистенты для PA (страницы ACN при проверке отдали 403, содержимое подтвердить не удалось — **проверить вручную**).

### 5.4. Испания

Не проверено (исчерпан бюджет поиска). Ожидаемая рамка — сертификация **ENS** (Esquema Nacional de Seguridad)
и каталог CPSTIC/CCN. **Открытый вопрос.**

---

## 6. ВЕРДИКТ

### Формально по заданному порогу опровержения — **критерий ОПРОВЕРГНУТ**

Порог был: «если Nuance, Verint, NICE, Genesys, Amazon Connect Gov, Google CCAI Gov или оборонные интеграторы
уже поставляют разговорного голосового агента с нужными аккредитациями — критерий опровергнут».

Сработали **сразу пятеро из семи**:

1. **Amazon Connect + Lex + Polly + Transcribe + Bedrock** — FedRAMP **High** в GovCloud и **DoD IL4/IL5** (таблицы AWS).
2. **Google Dialogflow CX** — **FedRAMP High** (документация Google).
3. **NICE CXone** — FedRAMP Moderate с 2018, 13 ATO, с IVA/voice-ботом (Cognigy внутри).
4. **Genesys Cloud CX** — FedRAMP Moderate с 2023, 11 ATO, с Genesys Virtual Agent (voice+digital, gen-AI).
5. **Verint Self-Service for Government** — Verint IVA (voice+digital) + IVR, FedRAMP **Ready** Moderate с 2024-11
   (это Ready, не Authorized — засчитываю как частичное срабатывание).
6. **Оборонный/федеральный интегратор Accenture Federal Services** — продукт **FedVoice** с «human-like voice
   interactions», FedRAMP-compliant архитектурой и живым федеральным кейсом (FRTIB).
7. Не сработал только **Nuance** — его enterprise-стек, наоборот, снят с продажи (EOL 2024–2026).

**Плюс два независимых игрока ровно в описанной нише, которых гипотеза не предполагала:**
- **Bland AI** — pure-play voice AI, **FedRAMP Certified (20x)**, **Government-Only Cloud**, собственные speech- и LLM-модели.
- **Entratus Conversational AI Platform** — **FedRAMP Certified (20x), Moderate**, голос+web+SMS.

**И два госстартапа, занявшие муниципальный сегмент без всякого FedRAMP:** Polimorphic (~$28M, Series B, General Catalyst)
и Citibot.

### Итоговая формулировка: «занята», но неоднородно

| Сегмент | Статус | Кто уже там |
|---|---|---|
| **US Federal, FedRAMP Moderate** | **Занята плотно** | NICE, Genesys, Talkdesk, Maximus MIVA, TTEC, T-Metrics, Verint (Ready), Entratus, Bland, Avaya |
| **US Federal, FedRAMP High** | **Занята** | AWS (Connect+Lex+Polly+Transcribe), Google (Dialogflow CX), Azure Gov (Speech+OpenAI+Bot Service), Content Guru (CCaaS High) |
| **US DoD IL4/IL5** | **Занята гиперскейлерами** (AWS, Azure Gov) — но **свободна от продуктовых голосовых агентов**: ни одного независимого «conversational voice agent» с собственной IL4/IL5-аккредитацией не найдено; всё собирается проектно поверх Lex/Azure Speech | AWS, Microsoft |
| **US DoD IL6 / классифицированные контуры** | **Практически свободна** (в Azure Gov Secret из ИИ-слоя авторизованы Azure OpenAI и Language, но **не Speech** и **не Bot Service**) | — |
| **US SLED (штаты/муниципалитеты)** | **Занята специализированными госстартапами**, причём **без FedRAMP** (входной билет — SOC 2 + ADA/WCAG) | Polimorphic, Citibot, Tyler, Verint |
| **Франция, суверенный контур SecNumCloud** | **СВОБОДНА** — в списке квалифицированных SecNumCloud нет ни одного контакт-центрового/голосового решения | — |
| **Германия, C5 / госсектор** | **Свободна от вендоров, но занята государством**: 115-Verbund строит ИИ-агентов сам, на open source, явно «kein Vendor Lock-in»; голос — в пилотах | FITKO / сами коммуны |
| **Италия, ACN** | **Занимается национальным чемпионом** — Almawave/Velvet Speech (нужна доп. проверка ACN-квалификации) | Almawave |
| **Испания** | Не проверено | — |

### Что это значит для гипотезы

Исходная формулировка «**гиперскейлеры не предоставляют разговорный голос в суверенных контурах**» — **фактически неверна**
для США. AWS и Microsoft дают полный стек до FedRAMP High / IL5, Google — Dialogflow CX на FedRAMP High.

**Единственные позиции, которые остались защитимыми, — узкие:**
1. **DoD IL6 / classified**: Azure Speech и Bot Service там **не авторизованы** (в таблице Microsoft на IL6 стоят только
   Azure OpenAI и Language). Это реальная, но крошечная и очень тяжёлая по входу ниша.
2. **Европейские суверенные контуры (в первую очередь SecNumCloud во Франции)**: голосового CCaaS/агента в квалифицированном
   списке нет. Это самая чистая находка исследования.
3. **Волна миграции с Nuance** (EOL: продажи стоп 08.2024, hosted-поддержка до 12.2025, on-prem до 06.2026) — спрос есть,
   но «пылесос» назначен: Microsoft + HCLTech.

**Рекомендация по позиционированию:** заявление «ниша не занята» в текущем виде питчить нельзя — его разбивает
за пять минут любой, кто откроет FedRAMP Marketplace и таблицу services-in-scope у AWS. Если тема продолжается,
её нужно перепозиционировать на **«европейский суверенный голос»** (SecNumCloud/C5/ACN) или на
**высокоуровневые оборонные контуры (IL6)**, а не на «гиперскейлеры не умеют».

---

## 7. Открытые вопросы / что не проверено

- **Испания** — ENS/CPSTIC, кто поставляет голос госорганам. Не проверено (исчерпан бюджет поиска).
- **Каталог ANSSI** (cyber.gouv.fr) — прямые URL отдавали 404; список SecNumCloud взят из вторичных обзоров июля 2026.
  Нужна ручная сверка по официальному каталогу.
- **ACN (Италия)** — страницы AIPA и AIWave отдали 403; квалификация Almawave не подтверждена первичкой.
- **Cognigy BSI C5** — подтверждения самого тестата не нашёл.
- **Bland AI**: 20x Class A (пилот), уровень impact в реестре не проставлен, ATO агентств = 0.
  Нужно проверить, что именно покрывает сертификация и есть ли реальные закупки.
- **Cisco**: «AI Assistant for Government» — не проверял по даташиту, ассистент ли это агента или голосовой бот для звонящего.
- **Google CCAI/CCaaS** (не Dialogflow CX, а полноценный контакт-центр) — область FedRAMP-scope не подтверждена первичкой.

## 8. Источники (первичные, проверены 2026-09-01)

- FedRAMP Marketplace, полная выгрузка карточек: https://www.fedramp.gov/marketplace/products/ (713 записей, распарсено локально)
- Карточка Bland AI: https://www.fedramp.gov/marketplace/products/FR2628647242/
- AWS FedRAMP services in scope: https://aws.amazon.com/compliance/services-in-scope/FedRAMP/
- AWS DoD CC SRG services in scope: https://aws.amazon.com/compliance/services-in-scope/DoD_CC_SRG/
- AWS: Amazon Connect achieves FedRAMP High: https://aws.amazon.com/blogs/publicsector/amazon-connect-achieves-fedramp-high-authorization
- AWS what's new (Bedrock FedRAMP High + IL4/5, июнь 2026): https://aws.amazon.com/about-aws/whats-new/2026/06/addl-bedrock-model-fedramp-il-5-govcloud/
- Microsoft Azure Government compliance scope: https://learn.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope
- Google Dialogflow compliance & security controls: https://docs.cloud.google.com/dialogflow/docs/compliance-security-controls
- Google Cloud FedRAMP: https://cloud.google.com/security/compliance/fedramp
- Cisco Webex CCE for Government datasheet: https://www.cisco.com/c/en/us/products/collateral/contact-center/webex-contact-center-enterprise/webex-cc-enterprise-govt-ds.html
- Five9 Government: https://www.five9.com/solutions/government
- Accenture Federal Agentic Service Center (FedVoice): https://www.accenture.com/us-en/industries/accenture-federal-services/agentic-service-center
- Polimorphic Voice Agent: https://www.polimorphic.com/voice-agent
- Citibot AI Voice: https://www.citibot.io/voice
- FITKO / 115: https://www.fitko.de/aktuelles/details/behoerdennummer-115-startet-regelbetrieb-ihres-ki-chatbots-fuer-kommunen , https://www.115.de/news/detail/behoerdennummer-115-startet-regelbetrieb-ihres-ki-chatbots-fuer-kommunen
- Nuance EOL: CX Today «Nuance to Stop Supporting On-Premise Contact Centers»; ReadSpeaker «Nuance On-Prem EOL (2024–2028)»
- Moveworks FedRAMP Moderate (ServiceNow PR): https://s205.q4cdn.com/537566246/files/doc_news/Moveworks-from-ServiceNow-achieves-FedRAMP-moderate-authorization-to-provide-secure-conversational-AI-to-public-sector-2026.pdf
- Carahsoft × Moveworks: https://www.moveworks.com/us/en/company/news/press-releases/Moveworks-and-Carahsoft-Partner-to-Bring-Conversational-AI-to-the-Public-Sector
- Carahsoft × Cohere (sovereign AI): https://www.carahsoft.com/news/cohere-and-carahsoft-partner-to-bring-secure-sovereign-ai-deployment-solutions-to-the-public-sector-2026

**СТАТУС ФАЙЛА: ЗАВЕРШЁН.**
