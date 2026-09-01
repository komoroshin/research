# A1 — Проверка: «В суверенных и гособлаках нет разговорного голосового агента»

Дата проверки: 2026-09-01. Статус: **черновик, пополняется по ходу**.

## Порог опровержения (задан заказчиком)
Если разговорные голосовые сервисы объявлены в роадмапе Azure Government / AWS European Sovereign Cloud /
Google Sovereign Cloud на ближайший год — тема мертва.

## Ключевое разделение (правило 3)
- **ASR** (распознавание) — есть почти везде.
- **TTS** (синтез) — есть почти везде.
- **Разговорный агент** = дуплексный стриминг + барджин (перебивания) + VAD/end-of-turn + вызов инструментов
  + управление диалогом в одном low-latency API. Это отдельный класс продукта
  (Azure Voice Live, AWS Nova Sonic / Amazon Connect, Google Gemini Live API / CCaaS).
  Именно он и отсутствует.

---

## НАХОДКИ (первичка)

### 1. Azure Government / Azure China — ПОДТВЕРЖДЕНО
Источник: Microsoft Learn, «Speech service in sovereign clouds»,
https://learn.microsoft.com/en-us/azure/ai-services/speech-service/sovereign-clouds
(зеркало: MicrosoftDocs/azure-ai-docs, sovereign-clouds.md). **Дата документа: 25.02.2026.**

Azure Government (US Gov Arizona / US Gov Virginia):
- ПОДДЕРЖИВАЕТСЯ: Speech to text (realtime, batch, language ID, диаризация, custom speech),
  Text to speech (standard + neural voice), Speech translation (realtime), Keyword recognition, Speech Studio.
- НЕ ПОДДЕРЖИВАЕТСЯ: **Voice Live**, **LLM speech**, **Live interpreter**, Fast transcription,
  Custom voice, Personal voice, TTS avatar, Custom keyword, Video translation,
  Pronunciation assessment.

Azure China (21Vianet):
- НЕ ПОДДЕРЖИВАЕТСЯ: **Voice Live**, **LLM speech**, **Live interpreter**, Custom voice,
  Personal voice, TTS avatar, Custom keyword, Video translation.
- (отличие от Gov: pronunciation assessment в Китае есть, fast transcription не в списке запретов)

=> Ровно та картина, что в гипотезе: **ASR/TTS есть, разговорного агента (Voice Live) нет** в обоих
суверенных облаках Microsoft, по состоянию на документ от 25.02.2026.

### 2. AWS European Sovereign Cloud (ESC) — ПОДТВЕРЖДЕНО с УТОЧНЕНИЯМИ
Источник: AWS European Sovereign Cloud User Guide, полный перечень сервисов (TOC),
https://docs.aws.eu/esc/latest/userguide/services.html (снят 01.09.2026, ~96 сервисов).
Запуск ESC: январь 2026 (регион eusc-de-east-1, Бранденбург),
https://aws.amazon.com/blogs/aws/opening-the-aws-european-sovereign-cloud/

Из AI/ML в списке ЕСТЬ ровно три: **Amazon Bedrock**, **Amazon SageMaker AI**, **Amazon Polly**.

**Поправка к ранее установленному факту** (важно, работает и за, и против гипотезы):
- ❌ Неверно, что «Polly отсутствует». **Amazon Polly (TTS) в ESC ЕСТЬ**, страница
  https://docs.aws.eu/esc/latest/userguide/polly.html прямо говорит: "There are no differences
  for this service". То есть синтез речи в ESC полнофункционален.
- ❌ Неверно, что «Amazon Q есть». **Amazon Q в перечне ESC ОТСУТСТВУЕТ.**
- ✅ Верно: **Amazon Transcribe, Amazon Lex, Amazon Connect в ESC отсутствуют.**
  Страницы `transcribe.html` и `lex.html` отдают 302 на индекс (не существуют),
  `connect.html`/`comprehend.html` — 404-заглушка. В TOC их нет.

Итого по ESC: **TTS есть, ASR НЕТ, разговорного агента НЕТ, контакт-центра (Connect) НЕТ.**
Это даже жёстче, чем у Microsoft: в ESC нет даже распознавания речи.

### 3. Amazon Nova Sonic / Nova 2 Sonic — разговорная модель AWS — НЕ в суверенных облаках
Источники (первичка, Amazon Bedrock User Guide, снято 01.09.2026):
- https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-sonic.html
- https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html

Nova 2 Sonic — speech-to-speech модель AWS (дата запуска 02.12.2025), API
`InvokeModelWithBidirectionalStream`, ровно тот класс «разговорный агент».
**Регионы: только us-east-1, us-west-2, eu-north-1 (Стокгольм), ap-northeast-1 (Токио).**
Ни GovCloud, ни ESC. Nova Sonic (v1) — us-east-1, eu-north-1, ap-northeast-1, EOL 14.09.2026.

Контрольная точка про «очередь приоритетов»: текстовые Nova Pro/Lite/Micro **в GovCloud
(us-gov-west-1) уже есть** (анонс март 2025, https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-nova-models-govcloud/),
а Sonic — нет, спустя 9+ месяцев после релиза Nova Sonic (апрель 2025).
=> Перенос текстовых моделей в суверенный контур AWS уже отработан; голосовая
разговорная модель за ним не пошла. Это довод в пользу устойчивости дыры.

### 4. AWS GovCloud (US) — ЧАСТИЧНОЕ ОПРОВЕРЖЕНИЕ (важно!)
Источник: AWS GovCloud (US) User Guide (снято 01.09.2026).

Что ЕСТЬ в GovCloud (в отличие от ESC):
- **Amazon Transcribe** (US-West и US-East), https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-tsc.html
  Ограничения: нет Call Analytics; в US-East нет автоопределения языка и авторедактирования.
- **Amazon Polly**, **Amazon Comprehend**, **Amazon Kendra**, **Amazon Chime SDK**,
  **Amazon Bedrock**, **Amazon Bedrock AgentCore** — все в TOC GovCloud.
- **Amazon Lex V1 и V2** (только US-West), https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-lex.html
  Ограничения: только en-US и es-US; нет каналов (Facebook/Slack/Twilio); нет conversation logs;
  нет utterances view.
- **Amazon Connect** (только US-West), https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-con.html
  FedRAMP High авторизован (AWS Public Sector Blog, «Amazon Connect achieves FedRAMP High authorization»).

=> **В GovCloud разговорный голосовой бот СУЩЕСТВУЕТ** в классическом (доLLM) виде:
Connect + Lex V2 (ASR+NLU+барджин через `x-amz-lex:start-silence-threshold-ms` /
`end-silence-threshold-ms`) + Lambda как «вызов инструментов» + Polly на выходе.
Это прямое ограничение формулировки «разговорного голосового агента нет вообще».

Что в GovCloud ОТСУТСТВУЕТ (цитата из «How Connect Customer differs»):
- **Amazon Q in Connect** (LLM-ассистент) — НЕТ
- **Amazon Connect Contact Lens GenAI features** + `ListRealTimeContactAnalysisSegments` — НЕТ
- Amazon Connect Voice ID — НЕТ
- Customer Profiles, Cases, Outbound Campaigns, email-канал, Live Media Streaming — НЕТ
- Нет кросс-партиционной интеграции с коммерческими регионами (Lex/Lambda/S3 из commercial недоступны)
- **Nova Sonic / Nova 2 Sonic — НЕТ** (см. п.3)

=> Точная формулировка дыры в GovCloud: **есть IVR-бот на интентах, нет LLM-разговорного агента.**
Это разные продукты по качеству диалога, но заказчик, которому «нужен голосовой бот в контуре»,
формально закрытый вариант уже имеет. Гипотезу в исходной редакции это ослабляет.

### 5. Google Cloud — Assured Workloads: чёткий градиент «суверенность ↑ → голос ↓»
Источник (первичка, полная таблица «Supported products by control package», снята 01.09.2026):
https://docs.cloud.google.com/assured-workloads/docs/supported-products

| Control package | STT | TTS | Dialogflow CX / Agent Assist | Gemini Live API |
|---|---|---|---|---|
| FedRAMP High / Moderate | ✅ | ✅ | ✅ (Dialogflow, Agent Assist, CX Insights) | ❌ нет ни в одном пакете |
| IL2 | ✅ | ✅ | ✅ | ❌ |
| **IL4 (DoD)** | ✅ | ❌ | ❌ | ❌ |
| **IL5 (DoD)** | ✅ | ❌ | ❌ | ❌ |
| CJIS, IRS 1075 | ✅ | ✅ | ✅ | ❌ |
| EU Data Boundary (+ and Support) | ✅ | ✅ | ✅ | ❌ |
| **EU Data Boundary with Access Justifications** | ✅ | ❌ | ❌ | ❌ |
| KSA / Switzerland with Access Justifications | ❌ | ❌ | ❌ | ❌ |

Два вывода:
1. **Gemini Live API (нативный speech-to-speech Google) НЕ входит НИ В ОДИН из ~38 control packages.**
   Слово "conversational"/"Live API" в таблице не встречается вовсе.
2. Чем строже суверенность, тем меньше голоса: на FedRAMP High полный стек (включая
   Dialogflow CX) есть, а на IL4/IL5 и на EU Data Boundary **with Access Justifications**
   остаётся только распознавание речи.

### 6. Google Distributed Cloud air-gapped (настоящий суверенный/изолированный контур) — ПОДТВЕРЖДЕНО
Источник: официальные условия «Google Distributed Cloud Air Gapped Services»,
https://cloud.google.com/terms/gdcag/services — **последняя редакция 23.06.2026.**

Полный перечень AI/ML в GDC air-gapped (цитата раздела «2. AI/ML Services»):
OCR; **Speech-to-Text**; Translation; Agent Platform Workbench;
Generative AI: Embeddings API, **Gemini for GDC API**.

=> В air-gapped контуре Google: **ASR есть, TTS НЕТ, Dialogflow/Conversational Agents НЕТ,
Live API НЕТ.** Есть только Gemini как текстовый API. Голосового агента собрать не из чего —
нет даже синтеза. Это самый жёсткий разрыв из всех рассмотренных.

### 7. Azure Government — второй, независимый канал тоже закрыт (Realtime API)
Важно: в Azure два разных пути к разговорному агенту — (а) **Voice Live** (Speech-сервис) и
(б) **Azure OpenAI Realtime API** (модели `gpt-realtime`, `gpt-audio`). Гипотеза выживает,
только если закрыты оба. Проверено:

(а) Voice Live: см. п.1 — прямо в списке unsupported для Gov и China.
    В коммерческом облаке Voice Live **вышел в GA на Build 2026** (июнь 2026),
    https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-speech-at-build-2026-powering-voice-agents-with-real-time-and-life-like-ex/4524638
    FAQ (ms.date 31.03.2026, обновлён 05.06.2026): «Voice Live is available in **10+ Azure regions**»,
    https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live-faq
    Функционально это ровно «разговорный агент»: STT+TTS+turn detection+**interruption handling**+
    semantic VAD+EOU+**function calling**+MCP+телефония через Azure Communication Services.
    Регионов Gov среди «10+» нет.

(б) Realtime-модели: «Foundry Models sold by Azure in Azure Government»,
    https://learn.microsoft.com/en-us/azure/ai-foundry/openai/azure-government (ms.date 03.04.2026,
    обновлена 19.05.2026). **Полный список моделей в usgovarizona / usgovvirginia:**
    `gpt-5.1`, `gpt-4.1`, `gpt-4.1-mini`, `o3-mini`, `gpt-4o`, text-embedding-3-large/-small/ada-002.
    **`gpt-realtime` / `gpt-audio` / `gpt-4o-realtime` — ОТСУТСТВУЮТ.**
    Для сравнения, в коммерческом Azure уже есть `gpt-realtime-1.5-2026-02-23`
    и `gpt-audio-1.5-2026-02-23`.

=> В Azure Government закрыты **оба** пути. Причём текстовый фронтир едет в Gov быстро
(gpt-5.1 помечен NEW в госсписке), а аудио-модальность не едет вообще.
Тот же паттерн, что у AWS (текстовые Nova в GovCloud есть, Nova Sonic нет).
**Это главный аргумент за устойчивость дыры: отставание не общее, а именно по голосовой модальности.**

Дополнительно: страница «Foundry Tools on Azure Government»
(https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-cognitiveservices,
обновлена 11.02.2026) перечисляет провижененные типы аккаунтов в Gov:
ComputerVision, Face, Language, TextTranslation, OpenAI. **Speech в этом перечне не назван.**
(Speech в Gov при этом есть — см. п.1; допущение: страница устарела, ms.date 2021.)

### 8. Azure Government — ТРЕТЬЕ независимое подтверждение (самый свежий документ)
Источник: «Feature availability across cloud regions — Microsoft Foundry»,
https://learn.microsoft.com/en-us/azure/foundry/reference/region-support
**ms.date 21.08.2026, обновлена 25.08.2026** — то есть за неделю до этой проверки.

Раздел «Foundry in sovereign clouds → Azure Government (United States)»,
цитата «Unsupported features in Azure Government regions»:
> Serverless endpoints; Content Understanding; **Agents playground**; Images playground;
> **Real-time audio playground**; Healthcare playground; Fine-tuning; **Azure AI Agents**;
> Batch jobs; Azure OpenAI Evaluation; Deploy Web App; VS Code Extension

Два отдельно важных пункта:
1. **«Real-time audio playground» назван неподдерживаемым прямым текстом.**
2. **«Azure AI Agents» (Foundry Agent Service) в Gov отсутствует целиком.** А Voice Live в
   коммерческом облаке продан именно как «Voice Live for Foundry Prompt Agents + Foundry Agent
   Service integration». Значит, в Gov отсутствует не только голосовой слой, но и агентная
   подложка под ним. Чтобы Voice Live поехал в Gov, Microsoft сначала надо привезти туда
   Agent Service. Это **два шага, а не один** — сильный аргумент за срок 12–18 месяцев.

Поддерживается в Gov при этом: Azure OpenAI, Speech (+ Speech playground preview), Language,
Translator, Vision + Document, Content Safety, Model catalog, Prompt flow, Guardrails.

### 9. Azure Secret / Top Secret (US) — голоса нет, роадмапа по голосу нет
Источник: Azure Government devblog, «Announcing GPT-5.2 Availability in Azure for U.S. Government
Secret and Top Secret Clouds», **15.01.2026**,
https://devblogs.microsoft.com/azuregov/advancing-ai-capabilities-in-azure-for-u-s-government-secret-and-top-secret-clouds/
Анонсирована ровно одна вещь — `GPT-5.2`, фронтир-модель рассуждений. **Ни одного упоминания
speech / audio / voice / realtime.** Планы названы без дат: «enhancing support for agentic
workflows», «improving observability, safety guardrails», «accelerating availability of future
frontier models».
Контекст: Azure OpenAI получил авторизацию DoD IL6 (апрель 2025) и ICD 503 для Top Secret
(январь 2025) — то есть путь для текстовых моделей в закрытые контуры уже проложен и работает
быстро, но по голосу по нему ничего не поехало.

### 10. Национальные облака ЕС — дыра ещё шире (там нет вообще никакого AI)
**S3NS (Франция, Thales + Google Cloud), PREMI3NS, SecNumCloud 3.2 qualified.**
Источники: Thales Group press releases (SecNumCloud qualification), отчёт с S3NS Summit 2026
(sitsi.pacanalyst.com/thales-s3ns-google-summit-2026). Каталог ~30 сервисов;
**роадмап на H1 2026 — 15 новых сервисов: Cloud Run, Cloud Build, Spanner, Bigtable, Dataproc,
Composer, Confidential VMs, Filestore, Secret Manager, Access Transparency.**
Это всё инфраструктура и данные. **Ни Vertex AI, ни Speech-to-Text, ни Dialogflow, ни Gemini
в анонсированном роадмапе нет.**

**Bleu (Франция, Capgemini + Orange, на технологиях Azure).** Источники: bleucloud.fr,
usine-digitale (валидация ANSSI J1). На 2026 Bleu ещё **проходит квалификацию SecNumCloud 3.2**
(J0 → J1), первые IaaS-сервисы Azure только запущены, цель квалификации — 1-е полугодие 2026,
периметр оценки — **IaaS / PaaS / CaaS**. AI-сервисов в периметре не заявлено.

**Delos Cloud (Германия, SAP на технологиях Azure).**
Источник по стартовому портфелю: разбор Arvato Systems, «Delos Cloud Azure Service Portfolio»,
https://us.arvato-systems.com/blog/delos-cloud-azure-service-portfolio — перечислены
Virtual Networks, DNS, VM (A/B/D/E/F), VPN/ExpressRoute, Entra ID, AKS, ACI, ACR, Service Bus,
Event Hub/Grid, Firewall, WAF, App Service, Logic Apps, Data Factory, HDInsights.
**AI/Cognitive/Speech-сервисов нет вообще**; отдельно отмечено, что **нет даже GPU-VM серии G**.

=> Во всех трёх национальных облаках ЕС отсутствует не только разговорный агент, а весь AI-слой.
Гипотеза здесь верна с огромным запасом. Но и рынок там пока не «нет голоса», а «нет ничего».

### 11. ГЛАВНЫЙ КАНДИДАТ В ОПРОВЕРЖЕНИЕ: «OpenAI for Germany» на Delos Cloud
Анонс: SAP + OpenAI + Microsoft, https://openai.com/global-affairs/openai-for-germany/
(страница отдаёт 403 для автоматического доступа; сведения — по вторичным разборам:
DCD, TechRepublic, Technology Magazine, dig.watch).
Заявлено: **запуск в 2026**, инфраструктура Delos Cloud расширяется до **4 000 GPU**,
цель — «интеграция AI-агентов в рабочие процессы» госсектора Германии.
**Конкретный список моделей не опубликован; упоминаний voice / realtime / audio в анонсе нет.**
Допущение: это в первую очередь ChatGPT-подобный ассистент и текстовые агенты для
делопроизводства, а не Realtime-голос.

Риск для гипотезы: **высокий по ЕС/Германии, но не подтверждённый.** Если в Delos приедет
Azure OpenAI целиком, включая `gpt-realtime`/GPT-Live, то в немецком суверенном контуре
разговорный агент появится внутри окна 12–18 месяцев. Это надо мониторить как триггер.
Контраргумент: даже в Azure Government (гораздо более зрелом суверенном облаке Microsoft
с 2010-х) realtime-моделей нет до сих пор — маловероятно, что Delos обгонит Gov.

### 12. РЕШАЮЩАЯ ПРОВЕРКА: полная таблица регионов Voice Live
Источник: «Supported regions for Azure Speech», https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions
**ms.date 25.08.2026, обновлена 26.08.2026** — за 6 дней до этой проверки. Самый свежий
первичный документ в подборке.

Вкладка «Voice Live» перечисляет поимённо 28 регионов: australiaeast, brazilsouth,
canadacentral, canadaeast, centralindia, centralus, eastus, eastus2, francecentral,
germanywestcentral, italynorth, japaneast, japanwest, koreacentral, northcentralus,
norwayeast, southafricanorth, southcentralus, southeastasia, swedencentral,
switzerlandnorth, uaenorth, uksouth, westcentralus, westeurope, westus, westus2, westus3.

**`usgovarizona` и `usgovvirginia` в таблице ОТСУТСТВУЮТ. Регионов Azure China тоже нет.**
Аналогично отсутствуют они и во вкладках «LLM speech» (6 регионов) и «Text-to-speech avatar».
Колонка «Agent support» (интеграция с Foundry Agent Service) есть только у коммерческих регионов.

Это самое прямое доказательство из возможных: не отсутствие упоминания, а поимённый список
регионов, в котором госрегионов нет.

### 13. Обходные пути — и почему они тоже упираются в ту же стену (пункт 5 задания)

**а) FedRAMP-авторизованные CCaaS.** Работают, но именно LLM-агент из них вырезан:
- **NICE CXone**: FedRAMP **Moderate**, Package ID **FR1704655535**, первый CCaaS с авторизацией
  (с 2018), 35+ авторизованных приложений
  (https://www.nice.com/faq/general-customer-experience-contact-center-faqs/what-is-fedramp-and-how-does-nice-offer-fedramp-authorized-contact-center-solutions).
  Но: **«AI Agents (Cognigy)» и «AI Agents (Cognigy) for Process Automation» прямо названы
  не входящими в текущую фазу FedRAMP-развёртывания.** Внутри периметра — Copilot for Agents,
  то есть подсказки оператору, а не автономный голосовой агент для звонящего.
- **Genesys Cloud CX**: FedRAMP **Moderate** (https://www.genesys.com/fedramp/genesys-cloud-cx).
  Проверка релиз-нот FedRAMP-региона: релиз **15.06.2026** — 12 фич, из ИИ только
  «Exact match in Agent Copilot checklists» и мультичеклисты Agent Copilot, то есть снова
  agent-assist. Страница «Features coming soon — FedRAMP region»
  (https://help.genesys.cloud/release-notes/genesys-cloud/features-coming-soon-fedramp/),
  ближайший релиз **31.08.2026** — **ни одной AI / voice bot / virtual agent / AI Studio фичи.**

**б) Свой контур (self-hosted).** В GovCloud есть SageMaker AI и Bedrock AgentCore, в Azure Gov —
model catalog, в GDC air-gapped — Gemini for GDC API + STT. Технически госзаказчик может
собрать «ASR → LLM → TTS» конвейер сам. Но: в ESC и GDC air-gapped **нет TTS/ASR соответственно**,
а собранный вручную конвейер даёт задержку и качество барджина заметно хуже нативного
speech-to-speech. Это и есть содержание ниши.

**в) Локальные вендоры / маркетплейсы.** AWS Marketplace для ESC существует
(https://docs.aws.amazon.com/marketplace/latest/userguide/esc_seller_guide.html), Marketplace
есть и в GDC air-gapped (по условиям сервисов). Это открытый канал для стороннего
голосового агента — и одновременно самый реалистичный путь выхода для нас.

### 14. Причина отсутствия (пункт 4 задания) — разбор
Гипотезы в порядке убывания доказанности:

1. **Не «очередь приоритетов вообще» — очередь именно по модальности.** Самый сильный вывод
   из всей проверки. Текстовый фронтир едет в суверенные контуры очень быстро:
   `gpt-5.1` в Azure Gov (помечен NEW), `GPT-5.2` в Secret/Top Secret 15.01.2026,
   Claude Opus 5 и Bedrock AgentCore в GovCloud (август 2026), Nova Pro/Lite/Micro в GovCloud
   с марта 2025. За тот же период голосовые разговорные сервисы не приехали **никуда ни разу**.
   Значит, дело не в общем лаге суверенных облаков.

2. **Техническая/архитектурная.** Speech-to-speech требует не просто веса модели, а
   низколатентный дуплексный стриминг-стек: WebSocket/WebRTC-фронт, семантический VAD,
   echo cancellation, интеграция с телефонией (в Azure — Azure Communication Services;
   в AWS — Amazon Connect). Это целая подсистема, а не деплой модели. В Azure Gov
   отсутствует и **Foundry Agent Service** («Azure AI Agents» в списке unsupported) —
   то есть нет подложки, к которой Voice Live привязан архитектурно. В ESC нет
   ни Connect, ни Transcribe. Перенос требует нескольких зависимостей, а не одной.

3. **Комплаенс/сертификация.** Голосовой контент — биометрия (голосовой отпечаток).
   Показательно: **Amazon Connect Voice ID** (голосовая биометрия) прямо назван недоступным
   в GovCloud; Custom voice и Personal voice — недоступны в Azure Gov и Azure China.
   Плюс сертификация (FedRAMP/DoD IL/ICD 503, SecNumCloud) каждой новой подсистемы —
   это месяцы. *Допущение:* точной публичной причины провайдеры не называют; это вывод
   по косвенным признакам.

4. **Лицензионная** — не подтвердилась как основная. Никаких свидетельств лицензионных
   ограничений на перенос голосовых моделей не найдено.

Вывод по причине: **сочетание (1)+(2)**, и обе компоненты медленные. Это аргумент за то,
что дыра держится дольше 12 месяцев, а не за то, что закроется завтра.

---

## ПРОВЕРКА ПОРОГА ОПРОВЕРЖЕНИЯ

Порог: «если разговорные голосовые сервисы объявлены в роадмапе Azure Government,
AWS European Sovereign Cloud или Google Sovereign Cloud на ближайший год — тема мертва».

**Порог НЕ достигнут ни по одному из трёх провайдеров.** Проверены роадмап-каналы:

| Канал | Дата | Голосовой разговорный агент в роадмапе? |
|---|---|---|
| Azure Gov «Feature availability across cloud regions» | 21–25.08.2026 | Нет; «Real-time audio playground» и «Azure AI Agents» — в списке unsupported |
| Azure Speech regions (таблица Voice Live) | 25–26.08.2026 | Нет; госрегионов в списке нет |
| Azure Gov devblog (Secret/Top Secret) | 15.01.2026 | Нет; только GPT-5.2, планы без дат |
| Azure sovereign clouds — Speech | 25.02.2026 | Нет; Voice Live/LLM speech/Live interpreter = unsupported |
| AWS ESC User Guide (полный TOC сервисов) | снят 01.09.2026 | Нет; нет ни Transcribe, ни Lex, ни Connect |
| AWS GovCloud Newsletter, Issue #6 | август 2026 | Нет; Bedrock AgentCore, Nova Multimodal Embeddings, Claude Opus 5, Amazon Quick Agentic AI — голоса нет |
| Bedrock model region compatibility (Nova 2 Sonic) | снят 01.09.2026 | Нет; 4 коммерческих региона, GovCloud/ESC отсутствуют |
| Google Assured Workloads supported products | снят 01.09.2026 | Нет; Live API не в одном из ~38 пакетов |
| GDC air-gapped Services terms | 23.06.2026 | Нет; в AI/ML только OCR, STT, Translation, Embeddings, Gemini API |
| S3NS роадмап (Summit 2026) | H1 2026 | Нет; 15 новых сервисов — вся инфраструктура, ни одного AI |
| Genesys FedRAMP «Features coming soon» | релиз 31.08.2026 | Нет AI/voice-фич |

**Ни один провайдер не объявил разговорный голосовой сервис в суверенном облаке
с датой в пределах ближайшего года.**

---

## ВЕРДИКТ

# 🟢 ДЫРА ЕСТЬ И УСТОЙЧИВА — с двумя обязательными уточнениями формулировки

**Устойчива (окно 12–18 месяцев подтверждается):**
- Порог опровержения не достигнут — пусто во всех проверенных роадмапах.
- Отставание именно по голосовой модальности, а не общий лаг: текстовый фронтир едет
  в госконтуры за недели-месяцы, голос не приехал за 16 месяцев с релиза Nova Sonic
  (апрель 2025) и за 15 месяцев с релиза Voice Live.
- Для Azure Gov нужен не один шаг, а два: сначала Foundry Agent Service, потом Voice Live.
- В ЕС-контурах (ESC, S3NS, Bleu, Delos) отсутствует даже базовый слой — TTS/ASR/GPU.

**Уточнение 1 — формулировку «нет разговорного голосового агента» надо сузить.**
В **AWS GovCloud** рабочий голосовой бот есть: Amazon Connect (FedRAMP High) + Lex V2
(барджин через silence-thresholds) + Polly + Transcribe + Lambda как tool calling.
Это доLLM-стек на интентах. У Google на **FedRAMP High** тоже есть Dialogflow + Agent Assist
+ STT + TTS. Так что честная формулировка: **«нет LLM-разговорного голосового агента
(speech-to-speech, естественные перебивания, вызов инструментов) — есть только IVR
на интентах предыдущего поколения»**. Утверждение «дыры нет вообще» неверно, но и
исходное «нет ничего» — тоже. Продавать надо разницу в качестве диалога, а не пустоту.

**Уточнение 2 — дыра неоднородна. Она тем глубже, чем строже суверенность:**
- FedRAMP Moderate/High, IL2 → голосовой агент прошлого поколения ЕСТЬ (дыра узкая)
- Azure Gov, DoD IL4/IL5, EU Data Boundary + Access Justifications → ASR есть, дальше пусто
- AWS ESC, GDC air-gapped, Bleu, Delos, S3NS → нет даже полного ASR/TTS (дыра максимальная)
Наш реальный рынок — вторая и третья строки.

**Главный риск (мониторить как триггер закрытия):** «OpenAI for Germany» на Delos Cloud,
запуск заявлен на 2026, 4 000 GPU. Список моделей не опубликован. Если туда приедет
Realtime/GPT-Live — немецкий суверенный контур закроется первым. Контраргумент: Azure
Government зрелее Delos на порядок и realtime-моделей не имеет до сих пор.

**Второй риск:** AWS завозит в GovCloud агентный слой очень быстро (Bedrock AgentCore
с памятью и политиками, Amazon Quick Agentic AI — август 2026). Nova 2 Sonic вышел
02.12.2025 и уже в 4 регионах, включая eu-north-1. Путь Nova → GovCloud накатан.
*Допущение:* при сохранении темпа Sonic в GovCloud реалистичен в горизонте 12–24 мес.

---

## СВОДНАЯ ТАБЛИЦА ПО ПРОВАЙДЕРАМ (на 01.09.2026)

| Облако | ASR | TTS | Разговорный агент (LLM, барджин, tools) | Разговорный бот (интенты) | Дата источника |
|---|---|---|---|---|---|
| **Azure Government** (usgovaz/usgovva) | ✅ realtime+batch+diarization | ✅ standard+neural | ❌ Voice Live нет; `gpt-realtime`/`gpt-audio` нет; Azure AI Agents нет; real-time audio playground нет | ❌ | 25.02.2026 / 19.05.2026 / 25.08.2026 |
| **Azure Secret / Top Secret** | н/д публично | н/д публично | ❌ ни одного упоминания voice/audio; только GPT-5.2 | ❌ | 15.01.2026 |
| **Azure China (21Vianet)** | ✅ (+ pronunciation assessment) | ✅ | ❌ Voice Live, LLM speech, Live interpreter — unsupported | ❌ | 25.02.2026 |
| **AWS GovCloud (US)** | ✅ Transcribe (W+E; без Call Analytics) | ✅ Polly | ❌ Nova Sonic/Nova 2 Sonic нет; Amazon Q in Connect нет; Contact Lens GenAI нет; Voice ID нет | ✅ **Connect (FedRAMP High) + Lex V2, только US-West, en-US/es-US** | 01.09.2026 / авг. 2026 |
| **AWS European Sovereign Cloud** (eusc-de-east-1) | ❌ **Transcribe отсутствует** | ✅ Polly («no differences») | ❌ Lex нет, Connect нет, Nova Sonic нет | ❌ | 01.09.2026 (запуск янв. 2026) |
| **Google Assured Workloads — FedRAMP High/Moderate, IL2, CJIS, IRS 1075** | ✅ | ✅ | ❌ Gemini Live API не в одном из ~38 пакетов | ✅ Dialogflow CX + Agent Assist | 01.09.2026 |
| **Google Assured Workloads — DoD IL4 / IL5** | ✅ | ❌ | ❌ | ❌ | 01.09.2026 |
| **Google — EU Data Boundary** | ✅ | ✅ | ❌ | ✅ Dialogflow CX | 01.09.2026 |
| **Google — EU Data Boundary w/ Access Justifications** | ✅ | ❌ | ❌ | ❌ | 01.09.2026 |
| **Google Distributed Cloud air-gapped** | ✅ STT | ❌ **TTS отсутствует** | ❌ | ❌ (только Gemini for GDC API, текст) | 23.06.2026 |
| **Bleu (Франция, Azure)** | ❌ | ❌ | ❌ | ❌ | 2026, идёт квалификация SecNumCloud 3.2, периметр IaaS/PaaS/CaaS |
| **Delos Cloud (Германия, Azure)** | ❌ | ❌ | ❌ (заявлен «OpenAI for Germany» на 2026, состав не раскрыт) | ❌ | стартовый портфель — без AI и без GPU-VM |
| **S3NS / PREMI3NS (Франция, Google)** | ❌ | ❌ | ❌ | ❌ | роадмап H1 2026 — 15 сервисов, все инфраструктурные |
| **FedRAMP CCaaS: NICE CXone** | ✅ | ✅ | ❌ **AI Agents (Cognigy) вне периметра FedRAMP** | ✅ | FedRAMP Moderate, FR1704655535 |
| **FedRAMP CCaaS: Genesys Cloud CX** | ✅ | ✅ | ❌ в релизах 15.06.2026 и 31.08.2026 AI/voice-агентов нет | ✅ | FedRAMP Moderate |

---

## СПИСОК ИСТОЧНИКОВ (все первичные, кроме помеченных)
1. Microsoft Learn, Speech service in sovereign clouds — 25.02.2026 — https://learn.microsoft.com/en-us/azure/ai-services/speech-service/sovereign-clouds
2. Microsoft Learn, Supported regions for Azure Speech (таблица Voice Live) — 25–26.08.2026 — https://learn.microsoft.com/en-us/azure/ai-services/speech-service/regions
3. Microsoft Learn, Feature availability across cloud regions (Foundry, sovereign clouds) — 21–25.08.2026 — https://learn.microsoft.com/en-us/azure/foundry/reference/region-support
4. Microsoft Learn, Foundry Models sold by Azure in Azure Government — 03.04.2026 / 19.05.2026 — https://learn.microsoft.com/en-us/azure/ai-foundry/openai/azure-government
5. Microsoft Learn, Voice Live FAQ — 31.03.2026 / 05.06.2026 — https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live-faq
6. Microsoft Learn, Foundry Tools on Azure Government — обновл. 11.02.2026 — https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-cognitiveservices
7. Azure Government devblog, GPT-5.2 в Secret/Top Secret — 15.01.2026 — https://devblogs.microsoft.com/azuregov/advancing-ai-capabilities-in-azure-for-u-s-government-secret-and-top-secret-clouds/
8. Microsoft Community Hub, Azure Speech at Build 2026 (Voice Live GA) — июнь 2026 — https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-speech-at-build-2026-powering-voice-agents-with-real-time-and-life-like-ex/4524638
9. AWS European Sovereign Cloud User Guide, перечень сервисов — снят 01.09.2026 — https://docs.aws.eu/esc/latest/userguide/services.html
10. AWS ESC User Guide, Amazon Polly — https://docs.aws.eu/esc/latest/userguide/polly.html
11. AWS News Blog, Opening the AWS European Sovereign Cloud — янв. 2026 — https://aws.amazon.com/blogs/aws/opening-the-aws-european-sovereign-cloud/
12. Amazon Bedrock User Guide, Nova 2 Sonic model card — https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-sonic.html
13. Amazon Bedrock User Guide, Regional availability by models — https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html
14. AWS GovCloud (US) User Guide — Amazon Connect — https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-con.html
15. AWS GovCloud (US) User Guide — Amazon Lex — https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-lex.html
16. AWS GovCloud (US) User Guide — Amazon Transcribe — https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-tsc.html
17. AWS GovCloud (US) Newsletter, Issue #6 — август 2026 — https://aws.amazon.com/govcloud-us/newsletter/
18. AWS Public Sector Blog, Amazon Connect achieves FedRAMP High — https://aws.amazon.com/blogs/publicsector/amazon-connect-achieves-fedramp-high-authorization
19. Google Cloud, Assured Workloads supported products by control package — снят 01.09.2026 — https://docs.cloud.google.com/assured-workloads/docs/supported-products
20. Google Cloud, GDC Air Gapped Services (условия) — ред. 23.06.2026 — https://cloud.google.com/terms/gdcag/services
21. NICE, FedRAMP FAQ (Moderate, FR1704655535) — https://www.nice.com/faq/general-customer-experience-contact-center-faqs/what-is-fedramp-and-how-does-nice-offer-fedramp-authorized-contact-center-solutions
22. Genesys Cloud Resource Center, FedRAMP release notes 15.06.2026 — https://help.genesys.cloud/release-notes/genesys-cloud-fedramp/june-15-2026/
23. Genesys Cloud Resource Center, FedRAMP Features coming soon (31.08.2026) — https://help.genesys.cloud/release-notes/genesys-cloud/features-coming-soon-fedramp/
24. Genesys, Genesys Cloud for government (FedRAMP) — https://www.genesys.com/fedramp/genesys-cloud-cx
25. *(вторичное)* Arvato Systems, Delos Cloud Azure Service Portfolio — https://us.arvato-systems.com/blog/delos-cloud-azure-service-portfolio
26. *(вторичное)* PAC/SITSI, Thales S3NS Google Summit 2026 — https://sitsi.pacanalyst.com/thales-s3ns-google-summit-2026
27. Thales Group, S3NS SecNumCloud qualification (PREMI3NS) — https://www.thalesgroup.com/en/news-centre/press-releases/s3ns-announces-secnumcloud-qualification-premi3ns-its-trusted-cloud
28. Bleu, валидация J0/J1 SecNumCloud 3.2 — https://www.bleucloud.fr/bleu-valide-le-j0-de-la-qualification-secnumcloud-3-2/
29. OpenAI, OpenAI for Germany — https://openai.com/global-affairs/openai-for-germany/ *(страница отдаёт 403 для автодоступа; содержание — по вторичным разборам DCD/TechRepublic)*

## ЧТО НЕ УДАЛОСЬ ПРОВЕРИТЬ (честные пробелы)
- Состав моделей «OpenAI for Germany» на Delos Cloud — не опубликован. Ключевая неизвестная.
- Точный сервис-каталог Bleu — публичной постатейной выкладки не нашёл.
- Реестр FedRAMP Marketplace программно недоступен (SPA без открытого API); уровни авторизации
  NICE и Genesys взяты с их собственных страниц, не из реестра.
- Состав AI-сервисов в Azure Secret/Top Secret публично не раскрывается в принципе.
- Бюджет веб-поиска в сессии исчерпан (200/200); часть уточнений делалась прямым fetch.
