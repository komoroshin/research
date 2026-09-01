# Занята ли позиция «локальный офлайн голосовой ИИ-ассистент для организаций»

Проверка конкурентной позиции до проработки гипотезы. Дата проверки: 2026-09-01.
Дисциплина: каждое число — с источником; первичка (сайты и доки вендоров) важнее обзоров; оценки помечены словом «допущение».

---

## ГЛАВНЫЙ ВЕРДИКТ

**Позиция ЗАНЯТА в своей широкой формулировке.** «Локальный офлайн полнодуплексный голосовой агент на железе заказчика» в 2026 году — это не белое пятно, а конкурентная категория с как минимум 6–8 коммерческими вендорами, готовым бесплатным референс-стеком от NVIDIA и полностью открытым OSS-путём.

Критично: **NVIDIA раздаёт это бесплатно.** Блюпринт `NVIDIA-AI-Blueprints/nemotron-voice-agent` под лицензией BSD 2-Clause даёт end-to-end голосового агента (ASR + LLM + TTS локальными NIM-сайдкарами) с заявленной **«Sub-second E2E latency»**, VAD/EOU-логикой прерываний, и профилями развёртывания на **DGX Spark ($3 999)** и **Jetson Thor ($3 499)**. Это ровно тот продукт, который предполагалось строить, — только с нулевой ценой и логотипом NVIDIA.
Источник: [GitHub NVIDIA-AI-Blueprints/nemotron-voice-agent](https://github.com/NVIDIA-AI-Blueprints/nemotron-voice-agent), 2026.

**Свободны три узких сегмента** (детали в разделе «Что свободно»):
1. **По-настоящему отключённый контур** — без «звонка домой» за лицензией (SCIF, борт, закрытый периметр).
2. **Не-английский полный дуплекс** локально — качество вне EN проседает у всех.
3. **Долгая память о собеседнике** как продукт — её не продаёт ни один голосовой вендор; это отдельный слой (Mem0, Zep), не интегрированный с офлайн-дуплексом.

Ни один из этих трёх сегментов сам по себе не является рынком «локального голосового ассистента» — это сужение до ниши.

---

## ПУНКТ 2 (ГЛАВНЫЙ): кто продаёт полный дуплексный диалог локально

Вопрос был поставлен так: «распознавание офлайн умеют многие, а кто продаёт **полный разговорный агент с перебиваниями и низкой латентностью на железе заказчика без интернета**? Если таких нет — позиция свободна».

**Такие есть. Как минимум пять коммерческих и два бесплатных.** Ниже — только то, что подтверждено первичными источниками (документация или сайт самого вендора), а не обзорами.

### Подтверждено первичкой — продают полный дуплекс on-prem

**1. Deepgram — Voice Agent API self-hosted. Самое сильное опровержение гипотезы.**
Их собственная документация: *«This guide covers deploying Deepgram's Voice Agent API in a self-hosted Kubernetes environment… The Voice Agent API orchestrates Speech-to-Text (STT), a Large Language Model (LLM), and Text-to-Speech (TTS) into a single WebSocket-based conversational pipeline»*, эндпоинт `/v1/agent/converse`.
Локально крутятся: Flux (STT, «purpose-built, low-latency streaming speech-to-text model tailored for voice agent use cases»), Aura-2 (TTS), отдельный end-of-turn движок. Прерывания и «eager end-of-turn» — параметры конфигурации (`eot_threshold`, `eager_eot_threshold`), то есть дуплекс здесь продуктовая фича, а не хак.
LLM — **bring-your-own** через `agent.think.endpoint` (произвольный URL + headers), то есть можно повесить локальный vLLM и не выпускать данные наружу.
Источники: [Deploy Voice Agent](https://developers.deepgram.com/docs/deploy-voice-agent), [Configure Voice Agent](https://developers.deepgram.com/docs/configure-voice-agent), [Flux self-hosted](https://developers.deepgram.com/docs/flux-self-hosted). Анонс self-hosted Voice Agent — март 2025 ([changelog](https://developers.deepgram.com/changelog/self-hosted-changelog/2025/3/7)).

**Оговорка, которая и создаёт остаточную нишу:** Deepgram self-hosted **не полностью офлайн**. Их же доки: контейнеры *«will only contact the Deepgram license server in order to validate the Deepgram components and models, as well as report usage information»*. License Proxy при потере связи держит систему живой *«for a pre-configured amount of time»* (состояние `TrustBased`), затем `Failed` — и всё выключается. Более того: *«If the Deepgram license server cannot be reached, a new instance of the License Proxy will fail»* — то есть после перезапуска в отрезанном контуре система не поднимется.
Единственный полностью офлайн вариант у них — Amazon SageMaker: *«A SageMaker deployment also runs fully airgapped: the container is network-isolated and makes no connection to the Deepgram Cloud»* — но это AWS, а не железо заказчика.
Источники: [License Proxy](https://developers.deepgram.com/docs/license-proxy), [Self-hosted Introduction](https://developers.deepgram.com/docs/self-hosted-introduction).

**2. Speechmatics — Flow On-Premise.**
Со своего сайта: *«With Flow On-Premise from Speechmatics, you can deploy an entire Conversational AI API locally in your infrastructure»*, *«Flow On-Premise can be deployed into a Kubernetes cluster on any cloud provider, hypervisor or even bare metal»*. Сам Flow: *«engineered to engage in natural and fluid conversations by automatically handling interruptions, responding to multiple speakers»*.
Цена облачного Flow — **$0,0537/мин**, с 20% скидкой свыше 100 часов/мес. On-prem — по запросу.
Источники: [The return of on-prem](https://www.speechmatics.com/company/articles-and-news/the-return-of-on-prem-why-enterprise-is-no-longer-in-the-cloud), [Introducing Flow](https://www.speechmatics.com/company/articles-and-news/speechmatics-introduces-flow), [Pricing](https://www.speechmatics.com/pricing).
*Расхождение, которое стоит проверить при углублении:* в технической документации Speechmatics (`docs.speechmatics.com/deployments`) таблица доступности on-prem перечисляет только realtime/batch транскрипцию и перевод — Flow там не значится. Маркетинг говорит «есть», доки — молчат. Допущение: on-prem Flow продаётся индивидуально через enterprise-контракт, а не как каталожный контейнер.

**3. Cartesia — on-prem, on-device и air-gapped с офлайн-лицензией.**
Три модели развёртывания на их сайте: Cloud, On-Premise (*«Deploy models in your data center»*), On-Device (*«Constant memory usage», «Deploy and run models on custom hardware»*). Продукты: Sonic (TTS), Ink (STT), Managed Agents (голосовые агенты). Заявлено: *«No data ever leaves the inference hardware»*.
Ключевое отличие от Deepgram: Cartesia заявляет поддержку air-gapped развёртываний **без контакта с их облаком, на офлайн-лицензии**. Это, если подтвердится в контракте, закрывает и «отключённый контур».
Латентность Sonic — 90 мс.
Финансирование: **$100M Series B** (октябрь 2025, Kleiner Perkins, при участии NVIDIA); всего **$191M** привлечено с декабря 2024 по октябрь 2025.
Источники: [Cartesia Deployments](https://www.cartesia.ai/deployments), [Cartesia launch](https://www.cartesia.ai/launch), [Contrary Research](https://research.contrary.com/company/cartesia).
*Оговорка:* docs.cartesia.ai/self-hosted закрыт авторизацией — детали офлайн-лицензии первичкой не проверены, формулировка про air-gap взята из вторичных пересказов их доков. **Это надо проверить напрямую у вендора перед любым выводом.**

**4. ElevenLabs — on-premise и on-device, релиз в первой половине 2026.**
С их страницы: on-premise — *«High-quality, multilingual voice models designed to run efficiently on Confidential Computing infrastructure with GPUs»*, 30+ языков; on-device — *«Lightweight voice models designed for reliable, on-device inference»*, работает на *«entry-level GPUs, NPUs, and modern CPU and ARM-based chips»*. Прямо заявлена поддержка *«air-gapped deployments when isolation is required»* и *«No customer data or audio ever leaves your infrastructure»*.
Цена: *«Pricing is defined case by case»*, *«typically includes a license fee and a usage-based component»*.
Источник: [ElevenLabs On-Prem Deployments](https://elevenlabs.io/on-prem-deployments).
*Оговорка:* на их странице не сказано явно, что в локальную поставку входит весь ConvAI/Agents-стек, а не только голосовые модели. Допущение: на старте это модели (TTS/STT), агентная оркестрация — следующим шагом.

**5. Rasa — on-prem голосовой агент с прозрачной ценой.**
Единственный в списке с публичной ценой входа: **от $35 000/год** за self-hosted развёртывание. Заявляет native voice (Twilio, AudioCodes, Genesys), 100% on-prem или private cloud, целевую латентность sub-second от конца речи до ответа агента, и что данные никогда не попадают на серверы Rasa.
Источники: [Rasa — best AI voice agents](https://rasa.com/blog/best-ai-voice-agents), [Rasa vs Dialogflow](https://rasa.com/vs/dialogflow).
*Оговорка:* $35k — цифра из их собственного маркетингового блога, не из прайс-листа. Считать ориентиром, не гарантией.

### Бесплатно и открыто — второе большое опровержение

**6. NVIDIA Nemotron Voice Agent Blueprint (BSD 2-Clause, бесплатно).**
Требования по железу из репозитория: *Workstation: «Single GPU ≥ 72 GB, or 2 GPUs ≥ 40 GB each»*; *DGX Spark: «1 GPU, 128 GB unified memory (Blackwell)»*; *Jetson Thor: «1 GPU, 128 GB unified memory (Blackwell)»*. Работает с локальными NIM-сайдкарами ASR/LLM/TTS. Заявлено: *«Sub-second E2E latency»* и поддержка нескольких одновременных потоков.
Предшественник — `NVIDIA/voice-agent-examples` (бывш. ace-controller), BSD-2-Clause, построен на Pipecat; архивирован 17 июля 2026 с переездом в этот блюпринт.
На CES 2026 NVIDIA публично показывала локально-облачных гибридных агентов на DGX Spark, собранных на Pipecat.
Источники: [nemotron-voice-agent](https://github.com/NVIDIA-AI-Blueprints/nemotron-voice-agent), [voice-agent-examples](https://github.com/NVIDIA/voice-agent-examples), [build.nvidia.com](https://build.nvidia.com/nvidia/nemotron-voice-agent).

**7. Полностью открытый стек, который заказчик развернёт сам.**
- **Moshi (Kyutai)** — первая открытая full-duplex speech-to-speech модель: моделирует два аудиопотока одновременно, теоретическая латентность 160 мс / ~200 мс на практике; реализации PyTorch, MLX (iPhone/Mac) и Rust для продакшена. По состоянию на середину 2026 — только английский. [GitHub kyutai-labs/moshi](https://github.com/kyutai-labs/moshi), [arXiv 2410.00037](https://arxiv.org/abs/2410.00037).
- **Kyutai Unmute** (MIT) — оборачивает любую текстовую LLM в низколатентный STT/TTS. [kyutai.org](https://kyutai.org/blog/2025-07-03-tts-unmute-open-source/).
- **Pipecat** (Daily) — конвейер с автоматической отменой TTS/LLM при `UserStartedSpeakingFrame`, то есть barge-in из коробки; поддерживает локальный Whisper без API-ключей. [docs.pipecat.ai](https://docs.pipecat.ai/server/services/stt/whisper).
- **LiveKit Agents** — self-hosted WebRTC + агентный SDK.
- **Sesame CSM-1B** (Apache 2.0) — контекстно-зависимый разговорный TTS. [HF sesame/csm-1b](https://huggingface.co/sesame/csm-1b).
- **Ultravox** (Fixie, открытые веса) — ~150 мс TTFT, аудио напрямую в пространство LLM без промежуточного ASR. [ultravox.ai](https://www.ultravox.ai/blog/ultravox-an-open-weight-alternative-to-gpt-4o-realtime).
- **Mistral Voxtral** — открытые веса TTS/STT под Apache 2.0, вариант 4,7B специально для локального и edge-развёртывания. [Mistral](https://mistral.ai/).

**Вывод по пункту 2: гипотеза «облачные игроки структурно не могут обслуживать эти сегменты» — не подтверждается.** Ровно те облачные игроки, которых гипотеза считала структурно неспособными (Deepgram, Speechmatics, ElevenLabs, Cartesia), уже выпустили локальные версии именно под этим аргументом. Speechmatics даже написала об этом статью с заголовком «Возвращение on-prem: почему голова корпоративного ИИ больше не в облаке».

---

## ТАБЛИЦА ИГРОКОВ

Легенда: **Дуплекс on-prem** = продаётся ли полный разговорный агент (не только STT/TTS) на железе заказчика.

| Игрок | Что продаёт | On-prem | Дуплекс on-prem | Полный офлайн | Цена | Источник |
|---|---|---|---|---|---|---|
| **Deepgram** | STT+TTS+Voice Agent API | Да (K8s/Docker/SageMaker) | **Да**, `/v1/agent/converse`, BYO-LLM | Нет — license server; airgap только на SageMaker | Enterprise, годовая лицензия по мощности; облачный Nova-3 ~$0,46/ч | [docs](https://developers.deepgram.com/docs/deploy-voice-agent) |
| **Speechmatics** | STT, перевод, Flow (агент) | Да, CPU/GPU-контейнеры, K8s, on-device SDK | **Да** (Flow On-Premise, по маркетингу; в доках не подтверждено) | Не заявлено | Flow $0,0537/мин облако; batch $0,80–1,04/ч; on-prem по запросу | [pricing](https://www.speechmatics.com/pricing) |
| **Cartesia** | Sonic (TTS), Ink (STT), Managed Agents | Да: on-prem, on-device | **Да** (Agents) | **Заявлен air-gap + офлайн-лицензия** (не проверено первичкой) | Enterprise | [deployments](https://www.cartesia.ai/deployments) |
| **ElevenLabs** | TTS, STT (Scribe), Agents | Да, с 1П 2026; on-device | Частично — модели точно, агент неясен | **Air-gap заявлен** | License fee + usage, case by case | [on-prem](https://elevenlabs.io/on-prem-deployments) |
| **NVIDIA** | Riva (ASR/TTS/NMT), NIM, Nemotron Voice Agent Blueprint | Да: датацентр, edge, embedded | **Да — и бесплатно** (BSD-2 блюпринт) | Да (модели локальные) | Блюпринт $0; Riva в проде через NVIDIA AI Enterprise **$4 500/GPU/год** (3 г. — $13 500, 5 л. — $18 000, perpetual — $22 500); dev бесплатно + 90-дневный триал | [Riva FAQ](https://www.nvidia.com/en-gb/ai-data-science/products/riva/faq), [Dell listing](https://www.dell.com/en-us/shop/nvidia-ai-enterprise-subscription-per-gpu-3-years-includes-standard-8x5-support/apd/ac566092/software) |
| **Rasa** | Оркестрация диалога (CALM) + voice | Да, 100% on-prem | **Да** | Да (свои модели) | **от $35 000/год** | [rasa.com](https://rasa.com/blog/best-ai-voice-agents) |
| **Picovoice** | Cheetah (STT), Orca (TTS), Koala, picoLLM | Полностью on-device, офлайн | Компоненты есть; готового дуплекс-агента как продукта — нет | **Да, полностью офлайн** | Free tier; Starter от **$6 000**; Enterprise от **$30 000/год** | [pricing](https://picovoice.ai/pricing/) |
| **Vosk / Alpha Cephei** | Офлайн STT, 20+ языков, модели ~50 МБ | Да, Apache-2.0 | Нет (только ASR) | Да | OSS бесплатно; коммерческая лицензия непублична | [alphacephei.com](https://alphacephei.com/vosk/) |
| **Inworld AI** | TTS-2, STT, Router | **TTS on-prem подтверждён доками**; полный стек — только по обзорам | Нет (по их же докам — TTS) | Не заявлено | Enterprise от $5/1M симв.; on-prem по запросу | [docs](https://docs.inworld.ai/tts/on-premises) |
| **Murf (Falcon)** | TTS | Да, K8s | **Нет — только TTS** (проверено) | Не заявлено | Не публикуется; «до 30% дешевле облака» | [murf.ai](https://murf.ai/blog/on-premise) |
| **Rime** | TTS | Да, on-prem GA | **Нет — только TTS** (проверено) | Не заявлено | от $0,03/1K симв. (Mist); on-prem enterprise | [rime.ai](https://www.rime.ai/pricing) |
| **Smallest.ai** | Lightning (TTS), Pulse (STT), Electron (SLM), Hydra (S2S) | Да, on-prem/private cloud, заявлен air-gap | Да (Hydra S2S) | Заявлен | Enterprise; **$13M Series A**, июль 2026 | [smallest.ai](https://smallest.ai/blog/series-a-funding-13m-next-generation-voice-ai) |
| **Gladia** | STT | Да: cloud, on-premise, air-gap в Enterprise | Нет (STT) | Заявлен air-gap | Enterprise custom | [gladia.io](https://www.gladia.io/pricing) |
| **Soniox** | STT, TTS | Не заявлен публично | Нет | Нет | ~$0,10–0,12/ч облако | [soniox.com](https://soniox.com/pricing) |
| **iFLYTEK** | Полный стек, «all-in-one» приватный ИИ | Да, приватное развёртывание | Да (заявлено, GITEX Asia 2026) | Заявлено «fully offline» | Не публикуется | GlobeNewswire, 10.04.2026 |
| **Yandex SpeechKit** | STT, TTS | Да, 100% on-prem развёртывание моделей | Не заявлено | Да | Облако по длительности/символам; on-prem по запросу | [yandex.cloud](https://yandex.cloud/en/services/speechkit) |
| **Sber SaluteSpeech / GigaChat** | STT, TTS, аудио-модель | Не подтверждено первичкой | Нет данных | Нет данных | Нет данных | GigaChat3.1-Audio-10B выложен открыто |
| **LinTO / Linagora (FR)** | Открытая голосовая платформа, «GAFAM Free» | Да, on-prem или Raspberry Pi | Голосовой ассистент — да, но старого поколения | Да | OSS | [linagora.com](https://linagora.com/en/linto) |
| **Voiceitt** | ASR для нестандартной речи (дизартрия, акценты) | Нет — веб-приложение | Нет | Нет | — | [voiceitt.com](https://www.voiceitt.com/) |
| **Dograh** | On-prem голосовой агент, OSS | Да | Да, заявлен zero-connectivity | Заявлен | OSS | [dograh.com](https://www.dograh.com/on-prem-voice-ai) |

### Суверенный и оборонный ИИ (пункт 3): голос почти никто не продаёт

| Игрок | On-prem/air-gap | Голос | Комментарий |
|---|---|---|---|
| **Palantir** | Да, включая тактический edge | **Нет голосового продукта** | Армейское соглашение до **$10 млрд** на 10 лет (2025). Партнёрство с Anduril (дек. 2024). Данные и решения, не речь. |
| **Anduril** | Да (Lattice, Menace — deployable compute) | **Нет** | Инструментирование тактического edge |
| **Helsing** | Да | **Нет** | **$1,8 млрд** при оценке **$18 млрд**, июль 2026 — крупнейший оборонный раунд в Европе. Дроны, подводная разведка, ИИ для боевых систем. Голос не заявлен. |
| **Mistral** | Да — Azure Local в fully disconnected режиме | **Да, но модели**: Voxtral TTS открытые веса (24,3B и 4,7B для edge) | Не агент, а компоненты. €4 млрд в дата-центры, >$400M ARR |
| **Aleph Alpha** | Да — on-prem, VPC, air-gapped (PhariaAI) | **Нет** | Немецкие федеральные министерства, европейские оборонные агентства |
| **Cohere** | Да — VPC, on-prem, **fully air-gapped** (North) | **Нет** | Пилоты: RBC, Dell, LG, Palantir |
| **G42 / Core42 (ОАЭ)** | Да | Jais/Jais-30B — текст, Apache 2.0 | В июле 2026 США перевели ОАЭ в Country Group A:5, G42 и Core42 — approved end users |
| **HUMAIN (СА)** | Национальная инфраструктура | ALLaM 34B — есть речевой ввод в HUMAIN Chat; отдельного on-prem дуплекс-продукта нет | PIF, 500+ млрд арабских токенов |
| **Sarvam AI (Индия)** | Да, «secure, population-scale deployment» | **Да — «designed for voice»**, 22 индийских языка, совместно с AI4Bharat | Выбрана IndiaAI Mission для суверенной LLM (апр. 2025); Sarvam-30B и 105B представлены в фев. 2026. **Наиболее близкий аналог задуманного — но в Индии и на индийских языках** |
| **Krutrim (Индия)** | — | 22 языка, текст | Krutrim-3, >2 трлн токенов |

**Вывод по пункту 3:** оборонные и суверенные чемпионы **голос не продают** — они продают данные, модели и платформы. Это действительно пробел. Но пробел этот существует не потому, что задача нерешаема, а потому, что голос для них — не тот слой ценности. Продавать голосового агента этим заказчикам придётся *через* них или *под* их платформой, а не вместо. Единственное исключение — Sarvam AI в Индии, которая строит суверенную голосовую модель по госзаказу.

---

## ЖЕЛЕЗО (пункт 4): не ограничение

Ключевой факт: **дуплексный голос локально помещается в бюджет малой организации.** Это одновременно и хорошая, и плохая новость — плохая потому, что низкий порог входа означает низкий барьер и для конкурентов, и для DIY-заказчика.

| Вариант | Цена | Что тянет | Источник |
|---|---|---|---|
| RTX 3090 / 4090 (24 ГБ) | ~$1 000–2 000 | Минимум для продакшена: Faster-Whisper ~3–4 ГБ + 7B LLM Q4 ~6–8 ГБ + Kokoro/MeloTTS ~1–2 ГБ = **~10–14 ГБ** | GIGAGPU, 2026 |
| RTX 5090 (32 ГБ) | ~$2 000–3 000 | **~500–800 мс end-to-end** на связке Faster-Whisper + 7B vLLM + Kokoro. До ~8 параллельных звонков | GIGAGPU |
| **NVIDIA DGX Spark** | **$3 999** (Founder's Edition, старт продаж 15.10.2025). В рознице разброс: NVIDIA Marketplace $4 699, Newegg $4 399, Best Buy $5 404 | 128 ГБ unified, 1 петафлопс, модели до 200B, 35–80+ tok/s. **Официальный профиль блюпринта NVIDIA** | [Engadget](https://www.engadget.com/ai/nvidia-starts-selling-its-3999-dgx-spark-ai-developer-pc-120034479.html), [Micro Center](https://www.microcenter.com/product/699008/nvidia-dgx-spark) |
| **Jetson AGX Thor (T5000)** | **$3 499** dev kit; **$2 999**/модуль при заказе от 1 000 шт. | 2 070 TOPS FP4, 128 ГБ LPDDR5x, >7,5× от AGX Orin. **Официальный профиль блюпринта** | [NVIDIA Newsroom](https://nvidianews.nvidia.com/news/nvidia-blackwell-powered-jetson-thor-now-available-accelerating-the-age-of-general-robotics), [CNX Software](https://www.cnx-software.com/2025/08/19/3499-nvidia-jetson-agx-thor-developer-kit-2070-tops-jetson-t5000-som-for-robotics-and-edge-ai/) |
| Jetson AGX Orin 64 ГБ | $3 499 (275 TOPS) | Предыдущее поколение; ~15,6 ГБ доступно CUDA — тесно для 13 ГБ GGUF с контекстом 4096 | NVIDIA Marketplace |
| NVIDIA L40S (48 ГБ) | ~$7 500–10 000 за карту; аренда $0,55–7,58/ч | Серверный узел | Thunder Compute, 2026 |
| RTX PRO 6000 Blackwell (96 ГБ) | **Цена выросла вдвое**: старт $8 565 (март 2025) → $13 250 → **$16 000** (2026) | 16+ параллельных звонков | [Tom's Hardware](https://www.tomshardware.com/pc-components/gpus/nvidia-doubles-rtx-pro-6000-blackwells-msrp-to-a-staggering-usd16-000-96gb-card-started-pre-orders-below-usd8-000-last-year), [TechPowerUp](https://www.techpowerup.com/351549/nvidia-rtx-pro-6000-blackwell-96-gb-gpu-now-costs-usd-16-000) |

**Латентность on-device против облака:** 15–80 мс TTFT локально против 180–600 мс в облаке — разрыв в 4–13 раз *в пользу локального*. То есть аргумент «локально медленнее» больше не работает — но и аргумент «мы умеем то, чего не умеет облако» тоже, потому что локальную скорость получает любой, кто скачал блюпринт.

**Допущение (метод оценки):** узел на DGX Spark за ~$4 000 + бесплатный блюпринт NVIDIA + бесплатные открытые модели даёт организации рабочий локальный дуплексный ассистент за стоимость одного рабочего места. Отсюда: **аппаратного барьера, за которым можно спрятать маржу, нет.** Маржа может быть только в интеграции, доменной настройке, поддержке и сертификации.

Важная оговорка: RTX PRO 6000 подорожала вдвое за год — это удорожание высоко-плотных узлов (16+ линий), но не базового сценария на 1–8 линий.

---

## РЫНОК (пункт 5): раунды, сделки, закрытия

**Общий контекст.** Голосовые ИИ-стартапы привлекли **$2,1 млрд** в 2024 году и почти **$500 млн** в I квартале 2025 (AssemblyAI). Рынок распознавания речи — **$18,39 млрд** в 2025 с прогнозом **$61,71 млрд** к 2031 (там же).

**Раунды, релевантные нише «приватный / on-prem голос» (2025–2026):**

| Компания | Раунд | Дата | Инвесторы | Релевантность |
|---|---|---|---|---|
| **Cartesia** | **$100M Series B** (всего $191M) | окт. 2025 | Kleiner Perkins, Index, Lightspeed, **NVIDIA** | Прямая: on-prem + on-device + air-gap |
| **ElevenLabs** | **$500M Series D**, оценка **$11 млрд** | 2025–2026 | — | Косвенная: на эти деньги и делается on-prem |
| **Rime** | **$24M Series A** | 15.07.2026 | M13, Twilio Ventures, Corazon, Unusual | «World's first enterprise-ready speech-to-speech model»; on-prem GA. До этого $5,5M seed (май 2025) |
| **Smallest.ai** | **$13M Series A** | июль 2026 | Seligman Ventures, Sierra Ventures, 3one4 | Прямая: on-prem/private cloud/air-gap. До этого $8M seed (окт. 2025) |
| **Helsing** | **$1,8 млрд**, оценка **$18 млрд** | 13.07.2026 | — | Оборонный ИИ без голоса — показывает, где реально деньги |
| **Abridge** | $300M Series E | июнь 2025 | — | Голос в здравоохранении (не on-prem) |
| **Nabla** | $70M Series C | июнь 2025 | — | То же |
| **Assort Health** | $120M Series C, оценка $1,2 млрд | 2026 | — | То же |

**Закрывшиеся и поглощённые:**
- **Play.ht** — закрылся 31.12.2025 после того, как Meta забрала команду. Разработчиков с его низколатентной инфраструктуры в значительной мере подобрала Cartesia.
- **Replica Studios** — закрылся 01.06.2025.
- **Sonantic** — внутри Spotify с 2022, публично недоступен.
- **Weights.gg** — команду голосового клонирования, по сообщениям, забрал OpenAI.
- Общий фон: в 2025 закрылись **3 800** ИИ-стартапов (27% от запущенных в 2024), в начале 2026 — ещё **1 800** (+13%).

**Чтение сигнала.** Деньги в нише есть, но они идут в **горизонтальные голосовые платформы** (Cartesia, Rime, ElevenLabs, Smallest.ai), которые добавляют on-prem как *опцию поставки*, а не в компании, чей единственный тезис — «мы локальные». Ни одного раунда, поднятого под чистую формулировку «suverennyi/private voice AI» как отдельной категории, найти не удалось. Это может значить одно из двух: категория ещё не оформилась (шанс) — или инвесторы не считают её отдельной категорией (риск). Второе вероятнее, учитывая, что все горизонтальные игроки эту функцию уже закрыли.

**Осторожно с цифрами рынка.** Аналитические агрегаторы прямо противоречат друг другу по доле on-prem: один источник говорит, что облако займёт **58,3%** развёртываний в 2026, другой — что on-premises **доминировал с 62,6%** в сегменте голосовых агентов в 2024. Обе цифры — из платных отчётов без раскрытой методологии. **Не использовать ни одну без независимой проверки.**

---

## ЧТО ВСЁ-ТАКИ СВОБОДНО

Три сужения, которые пережили проверку. Каждое меньше исходной гипотезы.

**1. По-настоящему отключённый контур — без «звонка домой».**
Deepgram, лидер по функциональности, здесь падает: license server, `TrustBased` окно, и невозможность поднять новый инстанс без связи. Для SCIF, борта, объекта без канала — это дисквалификация. Найденное правило отрасли: *«a tool that calls a license server is blocked in a SCIF»*, и *«air-gapped deployments typically use site licensing (annual or perpetual) rather than per-user or per-token pricing»*.
Заявляют офлайн-лицензию: Cartesia, ElevenLabs, Gladia, Smallest.ai, Picovoice (полностью on-device), плюс любой OSS-стек. **Но заявляют — не значит, что проверено; ни у кого из них это не описано в открытой первичной документации.**
*Это самое живое из трёх — но проверять надо не поиском, а разговором с двумя-тремя такими заказчиками.*

**2. Полный дуплекс не на английском.**
Moshi — только английский (середина 2026). Качество открытых моделей вне EN/CN заметно ниже. IndicASR/IndicWav2Vec для хинди: **12–18% WER на чистой речи, 22–30% на телефонии**. Sarvam закрывает Индию по госзаказу; iFLYTEK — Китай; ALLaM/Jais — арабский текст. Русский, тюркские, языки СНГ, языки Юго-Восточной Азии в локальном дуплексе — пусто.
*Это реальный технический ров, но узкий и языково-локальный: он не масштабируется за пределы выбранного языкового рынка.*

**3. Долгая память о собеседнике как часть локального голоса.**
Ни один голосовой вендор из таблицы не продаёт долгую персональную память. Deepgram даёт `context_length` в пределах сессии, не больше. Память — отдельный слой: Mem0, Zep (эпизодическая и темпоральная память), OpenClaw (local-first, on-device память). В 2026 все крупные платформы обновили память (ChatGPT — новая архитектура, июнь 2026; Claude — память на всех тарифах; Gemini Personal Intelligence; Copilot GA; Grok Skills) — **но всё это облачное.**
*Локальный дуплексный голос + локальная долговременная память о человеке — сочетание, которого готовым продуктом действительно не продаёт никто.* Это самое интересное из трёх. Но: и Mem0, и Zep — открытые/API-доступные, то есть сборка этого сочетания занимает недели, а не годы. Ров тонкий.

---

## ЧТО ЭТО ЗНАЧИТ ДЛЯ ГИПОТЕЗЫ

**Опровергнуто:**
- «Облачные игроки структурно не могут обслуживать сегменты, которым нельзя наружу» — могут и делают. Deepgram, Speechmatics, ElevenLabs, Cartesia выпустили локальные версии именно под этот запрос в 2025–2026.
- «Дуплексного локального агента никто не продаёт» — продают минимум пятеро, и NVIDIA раздаёт бесплатно.
- «Железо — ограничение» — не ограничение: $3 499–3 999 за узел, официально поддержанный NVIDIA.
- «Заказчик не соберёт сам» — соберёт: BSD-2 блюпринт + открытые модели + Pipecat. NVIDIA буквально показала это на CES 2026.

**Не опровергнуто:**
- Оборонные и суверенные чемпионы (Palantir, Anduril, Helsing, Cohere, Aleph Alpha) голос действительно не продают.
- Полностью отключённое развёртывание без лицензионного канала у лидера рынка не работает.
- Связка «локальный дуплекс + долгая память о человеке» готовым продуктом не продаётся.

**Честная переформулировка позиции, если продолжать:** не «мы делаем локальный голосовой ИИ» (эту фразу говорят все), а что-то вроде «мы внедряем и держим локального голосового собеседника с памятью в отключённом контуре на языке X» — то есть интегратор и держатель решения, а не разработчик платформы. Экономика тогда — не лицензия на технологию, а проект и поддержка, и конкурировать придётся не с Deepgram, а с системными интеграторами.

---

## ОГОВОРКИ И ЧЕГО НЕ УДАЛОСЬ ПРОВЕРИТЬ

- **Cartesia self-hosted docs закрыты авторизацией.** Ключевое утверждение про air-gap и офлайн-лицензию взято из вторичных пересказов их документации. Проверить напрямую.
- **Speechmatics Flow On-Premise:** маркетинг утверждает, техническая документация не подтверждает. Расхождение не разрешено.
- **ElevenLabs on-prem:** не ясно, входит ли агентная оркестрация или только модели.
- **Цены on-prem почти нигде не публичны.** Публичные ориентиры удалось получить только по Rasa ($35k/год), Picovoice ($6k / $30k/год), NVIDIA AI Enterprise ($4 500/GPU/год) и Speechmatics Flow (облако, $0,0537/мин). Остальное — «contact sales».
- **Рыночные доли on-prem противоречивы** и не должны использоваться.
- **Ошибки агрегаторов, которые пришлось разводить вручную:**
  - Поисковая выдача приписала Helsing «command model family with 23 languages» — это модели **Cohere**, не Helsing. У Helsing голосового/языкового продукта не найдено.
  - **Moshi**: Kyutai (франц. full-duplex модель) против «Moshi Moshi» — сервисной компании из Бангалора и против SSH-терминала getmoshi.app. Три разные сущности.
  - **Inworld**: обзорный сайт утверждает «on-premise variants of Realtime STT, TTS and Router»; **их собственная документация описывает on-prem только для TTS.** Верить документации.
  - Murf Falcon и Rime в первой выдаче шли как «on-prem voice AI agent» — при проверке первичкой оба оказались **чистым TTS**.
- **DGX Spark:** цены разъезжаются от $3 999 до $5 404 в зависимости от продавца и комплектации; брать $3 999 как Founder's Edition, а не как гарантированную рыночную.
