# B3 — Позиционирование: «агентный дуплекс» (разговор + вызов инструментов при низкой задержке)

Статус: **готово**. Вердикт: НИША ЗАНЯТА — порог опровержения пройден (xAI Grok Voice Think Fast).
Дата: 2026-09-01

Проверяемое утверждение: «Никто не целится специально в задачу агентного дуплекса — разговора
с вызовом инструментов при низкой задержке».
Порог опровержения: профинансированный стартап/команда, заявляющая ИМЕННО это как продукт.

## Журнал ресёрча
(заполняется по ходу)

### Найдено (первичные источники, проверено)

**LiveKit Agents — preemptive generation (спекулятивная генерация).**
Docs LiveKit (docs.livekit.io/agents/build/audio/, проверено 2026-09-01): «Preemptive generation
speculatively starts an LLM response before the user's end of turn is confirmed, reducing perceived
latency». Включено по умолчанию. Параметры: `preemptive_tts` (спекулятивно гонять и TTS),
`max_speech_duration`, `max_retries`. Явных цифр задержки на странице НЕТ.
→ Механизм «спекулятивное исполнение» уже роздан бесплатно в опенсорсном фреймворке.
Известный баг: preemptive generation НЕ учитывает выполняющийся tool call —
github.com/livekit/agents-js issue #1365 «Preemptive generation does not check in-flight function
tool execution»; github.com/livekit/agents issue #4219 (дубли LLM-запросов).
→ Важный сигнал: у лидера инфраструктуры спекулятивка и tool calls КОНФЛИКТУЮТ, т.е. именно
агентный дуплекс у них не доведён.

**Pipecat / Daily — Smart Turn v3 (семантический эндпойнтинг).**
daily.co/blog/announcing-smart-turn-v3-... (11 сентября 2025). Модель 8 МБ, CPU-инференс 12 мс
(60 мс на дешёвом AWS), GPU 3.3–6.6 мс, 23 языка. **Полностью открыты веса, обучающие данные
и тренировочный скрипт**, лицензия BSD-2 (huggingface.co/pipecat-ai/smart-turn-v3).
Про tool calling — ни слова.
→ Семантический эндпойнтинг как компонент — бесплатный и открытый.

**Vapi.** Собственный блог vapi.ai/blog/speech-latency: заявка «industry-leading sub-500ms
response times», цели P50 < 500 мс / P95 < 800 мс. Разбивка: ASR 40–300 мс, LLM 100–400 мс,
TTS 50–250 мс. **Сценарий — чистый голосовой конвейер (audio→ASR→LLM→TTS), без внешнего
вызова инструмента.** Влияние tool call на эти цифры в статье не квантифицировано.
Docs vapi.ai/tools/custom-tools: работа с задержкой инструмента — это **маскировка**, а не
ускорение: «Async Mode», сообщения `Request Start` / `Request Delayed` / `Request Complete` /
`Request Failed`, Timeout Settings. Т.е. пока инструмент думает, агент проговаривает филлер.
→ Классический пример смазывания: цифра относится к разговору, а не к сценарию с инструментом.

**Deepgram Flux — Eager End of Turn.** developers.deepgram.com/docs/flux/voice-agent-eager-eot:
события `EagerEndOfTurn` → `TurnResumed` (отмена) → `EndOfTurn`. Заявка: срезает «сотни
миллисекунд», конкретно «последние 100–200 мс end-to-end latency» ценой **+50–70 % LLM-вызовов**.
End-of-turn детекция ~260 мс медиана (<300 мс), p95 ~1.5 с.
Про tool calls: **не обсуждается**; RAG/Function Calling упомянуты лишь как сценарий, где приём
полезен. Спекулятивного исполнения инструментов нет.

**Phonic** (Lux Capital, $4M seed, март 2025; prnewswire 302419143). Сайт phonic.ai:
«Speech in to speech out within 300ms» — это **чистый разговор** (speech-to-speech).
Отдельно: «leverages frontier intelligence for reliable tool calling» — **без единой цифры
задержки**. Т.е. даже команда, ближе всех стоящая к тезису, разделяет: быстрый дуплекс — своя
модель, инструменты — внешний «фронтирный» LLM. Это подтверждает гипотезу, а не опровергает.

**Ultravox / Fixie.ai** (~$17M поднято по Crunchbase/startuphub; открытые веса модели,
github.com/fixie-ai/ultravox). Заявка 150 мс TTFT — это **time-to-first-token в разговоре**,
не сценарий с инструментом. На сайте ultravox.ai — «Agentic-ready», «Empowering Tools»,
но **ни одной цифры задержки для tool call**.

**Sindarin.tech** — «Accelerated Low Latency Voice AI», по Tracxn/Crunchbase **внешнего
финансирования нет** (bootstrapped). Порог опровержения не проходит.

### КРИТИЧНО: цифры гипотезы подтверждены, но уже частично устарели

**Источник цифр «0,600 / 4,25 с» найден:** Full-Duplex-Bench-v3, arXiv 2604.04847
(Guan-Ting Lin, Chen Chen, Zhehuai Chen, Hung-yi Lee; подано 6 апреля 2026).
Дословно: «GPT-Realtime leads on Pass@1 (0.600)», «Gemini Live 3.1 achieves the fastest latency
(4.25 s)», cascaded baseline — 10.12 с. Ключевой вывод статьи: «Self-correction handling and
multi-step reasoning under hard scenarios remain the most consistent failure modes».
→ Гипотеза «задача не решена» на этом бенчмарке ПОДТВЕРЖДАЕТСЯ.

**НО:** через месяц вышел τ-voice — Sierra (Soham Ray, Keshav Dhandhania, Victor Barres @ Sierra
+ Karthik Narasimhan, Princeton), sierra.ai/blog/tau-voice-..., **1 мая 2026**.
278 задач клиентского сервиса (retail/airline/telecom), полный дуплекс с перебиваниями,
шум и акценты, оценка «вызвал ли правильный инструмент, соблюдал ли политику, правильно ли
изменил базу». Динамика фронтира: **30 % (gpt-realtime-1.0, авг 2025) → 67 %
(xAI grok-voice-think-fast-1.0, апр 2026)**. Потолок текстовых reasoning-моделей ~85 %,
нетекстовый нереasoning-бейзлайн 54 %.
→ Утверждение «лучший Pass@1 в мире 0,600» **не выдерживает**: 0,600 — это лучший результат
на одном бенчмарке в апреле; на бенчмарке Sierra за тот же месяц уже 67 %. Фронтир прибавил
+37 п.п. за 8 месяцев. Это скорость, при которой «нерешённость» — временное состояние.

### ОПРОВЕРЖЕНИЕ НАЙДЕНО: xAI, Grok Voice Think Fast

Первичный источник — x.ai/news.

**Grok Voice Think Fast 1.0** (x.ai/news/grok-voice-think-fast-1, **23 апреля 2026**):
- «Real-time reasoning with **zero added latency**»
- «**high-volume tool calling** to address the user's request»
- «28 tools. This single agent uses dozens of distinct tools across hundreds of support and
  sales workflows» (продакшн у Starlink: конверсия 20 %, resolution rate 70 %, 25+ языков)
- «takes the top spot on the **τ-voice Bench leaderboard**, which evaluates full-duplex voice
  agents under realistic conditions including noise, accents, interruptions, and turn-taking»

**Grok Voice Think Fast 2.0** (x.ai/news/grok-voice-think-fast-2, **29 июля 2026**):
- «they **reason through queries while speaking**. Reasoning in parallel with speech makes the
  model substantially smarter than other speech-to-speech models **with no impact on latency**»
- «**tool calls are snappier, usually executing before the end of the agent's first sentence**»
- Цифры: Overall Quality 82.9 % (было 75.7 %), Speech Reasoning 97.2 % (Big Bench Audio),
  Conversational Dynamics 95.1 % (**Full Duplex Bench**), Agentic Performance **56.5 % (τ-voice)**,
  **Time to First Audio 0.70 s**. Транскрипция в 1.5–2.0× лучше Deepgram Nova 3 / ElevenLabs Scribe v2.

→ Это **ровно та задача**, которую гипотеза объявляет незанятой: дуплекс + вызов инструментов +
низкая задержка, заявленные как продукт, с собственными метриками по обоим осям сразу.
Компания профинансирована на порядки выше порога опровержения. **Порог опровержения пройден.**

⚠️ Несостыковка, требующая ручной сверки: блог Sierra (1 мая 2026) пишет про grok-voice-think-fast-1.0
«67 %» на τ-voice, а x.ai для 2.0 (29 июля) указывает 56.5 %. Разные агрегации/версии бенчмарка либо
разные срезы. Не переносить ни одну из цифр в питч без сверки с лидербордом τ-voice напрямую.

### Kyutai → коммерческая структура ЕСТЬ

Kyutai — некоммерческая лаборатория (Париж, ноябрь 2023; Iliad/Xavier Niel, CMA CGM, Schmidt
Futures; €300 млн на 5 лет). **Спин-офф — Gradium**, основан в сентябре 2025:
Neil Zeghidour (CEO, ex-Meta/DeepMind), Olivier Teboul (CTO, ex-Google Brain),
Laurent Mazaré (ex-DeepMind/Jane Street), Alexandre Défossez (ex-Meta).
**$70M seed** (лид FirstMark Capital + Eurazeo, с участием Эрика Шмидта, Нила, Саадэ) —
TechCrunch 2 декабря 2025; **расширен до >$100M** с приходом NVIDIA (Sifted).
Продукт — real-time TTS/STT, перевод, edge-модели. **Заявленный фокус — модели и реальное
время, НЕ «агентный дуплекс с инструментами»**. Порог опровержения формально не проходит,
но это крупный игрок ровно в соседней клетке.

**Unmute (kyutai.org/unmute/)** — каскад STT + любой текстовый LLM + TTS, **демонстрирует
function calling** (пример: получение новостей через API), задержка «below a second»,
код на GitHub, открыт. Признанное ограничение: каскад теряет эмоцию/интонацию/паузы.
→ Ещё один кусок решения, розданный бесплатно.

### Сколько на самом деле стоит вызов инструмента (первичная цифра индустрии)

voiceaiandvoiceagents.com — «Voice AI & Voice Agents: An Illustrated Primer», написан командой
Pipecat (Daily), обновление **июнь 2026**. Дословно:
«TTFT for inference that includes a function call. LLM TTFT is 450ms and throughput is 100 tokens
per second. If the function call request chunk is 100 tokens, it takes 1s to output the function
call request.» Полный цикл = 450 мс (TTFT) + ~1 с (сборка запроса) + время исполнения функции
+ второй раунд инференса (ещё минимум 450 мс).
Рекомендация примера — **давать аудио-филлер, пока функция исполняется**, потому что она
регулярно вылезает за приемлемое окно ответа.
→ Т.е. индустриальный консенсус по tool call — **маскировать, а не ускорять**. Это и есть щель,
в которую целится гипотеза. Но см. ниже: щель уже закрывают.

Про эндпойнтинг тот же документ: трёхслойка — VAD (порог 200 мс) + Pipecat Smart Turn
(open source, 23 языка, ~30 мс классификация) + однотокенный тег от LLM (✓ / ○ / ◐).
Итог: «we're making turn decisions in ~250ms from the time a user pauses while speaking».

### Академия: спекулятивный вызов инструментов уже опубликован

- **«Speculative Interaction Agents: Building Real-Time Agents with Asynchronous I/O and
  Speculative Tool Calling»**, arXiv 2605.13360, 13–14 мая 2026. Авторы: Coleman Hooper,
  Minwoo Kang, Suhong Moon, Nicholas Lee, Eric Wen, John Wawrzynek, Michael W. Mahoney,
  Yakun Sophia Shao, Amir Gholami, Kurt Keutzer (группа Keutzer/Gholami, BerkeleyAI — *допущение*
  по составу авторов). Результаты: **ускорение 1.3–1.7× для облачных моделей**,
  **1.6–2.2× для edge-моделей** (Qwen2.5-3B, Llama-3.2-3B) на нескольких tool-calling бенчмарках.
  Лицензия CC BY 4.0.
- **PASTE (Pattern-Aware Speculative Tool Execution)** — упоминается как работа марта 2026
  (Shanghai Jiao Tong University + Microsoft Research). *Требует проверки по первичному
  источнику — найдено только через вторичный обзор.*
- «Next-Turn: Duration-Aware Streaming Endpoint Detection», arXiv 2606.18094 — ещё один
  открытый эндпойнтинг.
→ Ключевые механизмы гипотезы (спекулятивное исполнение, асинхронный I/O) — **опубликованы
в открытом доступе под свободной лицензией**.

**SHANKS: Simultaneous Hearing and Thinking for Spoken Language Models** — arXiv 2510.06917
(октябрь 2025), принята как long paper на **ACL 2026** (aclanthology.org/2026.acl-long.404/),
страница проекта d223302.github.io/SHANKS/.
Механизм: SLM генерирует «непроизносимую» цепочку рассуждений, ПОКА слушает пользователя
(вход режется на чанки фиксированной длины). По этим рассуждениям решает, перебивать ли,
и делает вызовы инструментов.
Результат: «**SHANKS can complete 56.9 % of the tool calls before the user finishes their turn**»,
+37.1 п.п. к точности перебивания.
→ Это буквально «агентный дуплекс»: вызов инструмента ДО конца реплики. Опубликовано,
отрецензировано, с проектной страницей.

Смежное, всё открытое: «Act While Thinking: Accelerating LLM Agents via Pattern-Aware Speculative
Tool Execution» (PASTE), arXiv 2603.18897; «Thinking-while-speaking: A Controlled, Interleaved
Reasoning Method for Real-Time Speech Generation», arXiv 2605.20946; «Liberating LLM Capabilities
in Full-Duplex Speech Models», arXiv 2606.07547; «Dynamic Speculative Agent Planning»,
arXiv 2509.01920; StreamRAG (RAG-вызов посреди стриминга ввода).

### Патенты (п. 5)

Специализированных патентных заявок именно на «спекулятивное исполнение инструментов в
дуплексном голосовом агенте» найти не удалось. Есть старый смежный слой, который **скорее
создаёт риск свободы действий, чем закрывает путь**:
- US9514747B1 (Google) — «Reducing speech recognition latency», динамическое снижение задержки
  в ходе произносимой реплики.
- US9413891B2 — «Real-time conversational analytics facility», contextual look-ahead
  (предсказание следующих слов для снижения задержки распознавания).
- EP3881317A1 — «System and method for accelerating user agent chats»: предсказание фразы
  пользователя ДО отправки, экономия задержки при совпадении. Это прямой аналог спекулятивки,
  но в чате.
- US20240289863A1 — адаптивные AI-агенты диалога (широкая заявка 2024).
**Вывод по п. 5:** блокирующего патента на путь не обнаружено (*допущение* — поиск вёлся по
публичным индексам, полноценного FTO-анализа не делалось; свежие заявки 2025–2026 ещё могут
быть непубликованы, лаг публикации 18 месяцев). Одновременно **своего патентного рва тоже нет**:
приоритет по ключевым механизмам уже занят публикациями (SHANKS окт-2025, PASTE мар-2026,
Speculative Interaction Agents май-2026) — они образуют prior art, который мешает запатентовать
это самим.

### Остальные проверенные игроки

**OpenAI.** gpt-realtime-2.1 / gpt-realtime-2.1-mini, **6 июля 2026**
(developers.openai.com/api/docs/models/gpt-realtime-2.1 + community.openai.com анонс).
Дословно из доков: «Reasoning model with tool use», «supports speech-to-speech interactions with
configurable reasoning effort, instruction following, and **tool use for complex voice-agent
workflows**», «Higher reasoning effort can increase latency and output token usage».
Анонс: снижение **p95 голосовой задержки минимум на 25 %** за счёт кеширования; в mini-линейку
завезли reasoning и tool use по цене прежней mini.
→ Крупнейшая лаборатория явно тянет reasoning + tool use внутрь низколатентного дуплекса.
Заметь честно: своих цифр «задержка со вызовом инструмента» OpenAI тоже не публикует —
в доках только качественная оговорка про трейд-офф.

**LiveKit.** $100M Series C (лид Index Ventures, при участии Salesforce Ventures, Altimeter,
Redpoint), оценка **$1 млрд**, январь 2026 (livekit.com/blog/livekit-series-c, TechCrunch 22.01.2026).
Питает голосовой режим ChatGPT; клиенты — xAI, Salesforce, Tesla. Позиционирование —
инфраструктура реального времени, НЕ «агентный дуплекс» как продукт.

**Cartesia.** ~$191 млн привлечено (seed $27M, Series A $64M март 2025, $100M ноябрь 2025 —
Kleiner Perkins, Index, Lightspeed, NVIDIA). Платформа агентов Line, cartesia.ai/agents дословно:
«Advanced reasoning, **tool calling**, and real-time actions, with **ultra-low latency**».
**Ни одной цифры**: «ultra-low» без числа, метрик по tool call нет вообще. Цифры у них есть
только по компонентам: Sonic 3 — 40 мс стриминг / 90 мс полная модель; Ink-2 STT — 100 мс.
→ Эталон смазывания: слова «tool calling» и «ultra-low latency» в одном предложении, а измерена
только TTS.

**Retell AI.** Собственная turn-taking модель, заявка «от 600 мс» (retellai.com), независимые
замеры 580–800 мс. Их же документация признаёт: при tool calling нужно **2 LLM-вызова**, что
добавляет задержку; всё в стриминге. Мониторинг P50/P90/P99 end-to-end в дашборде.
→ Цифра 600 мс — разговор; сценарий с инструментом сами описывают как дороже.

**Bland AI.** >$100M привлечено, **$50M Series C** (лид Dell Technologies Capital, июнь 2026,
PRNewswire 302801583; участвовали HubSpot Ventures, Archerman, Tribeca). Полностью свой стек,
заявка ~400 мс на in-house моделях; независимые замеры ближе к 800 мс со всплесками до 2.5 с.
Позиционирование Series C — «complex, high-stakes conversations», не задержка вызова инструментов.

**Rime.** Arcana v3 (февраль 2026): **120 мс on-prem** — это TTS-задержка, не сценарий с
инструментом. 100 млн+ звонков в месяц (Domino's, Wingstop).

**Speechmatics.** blog.speechmatics.com/semantic-turn-detection: семантический эндпойнтинг,
рекомендуют SLM вместо фронтирного LLM, чтобы **не добавить 500 мс**. WER 1.07 % на стриминге —
лучший из 12 в независимом замере Pipecat (август 2026). Позиционирование — STT + turn detection,
про tool call латентность не заявляют.

**GetStream** (getstream.io/blog/speculative-tool-calling-voice/, Raymond F, **23 декабря 2025**) —
разбор «speculative tool calling» для голоса: два параллельных трека (филлер в аудио + тихое
предсказание и исполнение инструмента). Бюджет: ASR 300 мс, LLM-решение 200–1000 мс, исполнение
инструмента 100–2000 мс, LLM-ответ 300 мс, TTS 250–300 мс; филлер «buys 1.5-2 seconds»,
роутинговые модели ~50–100 мс. Есть код-примеры на Python в статье, репозитория нет.
→ Приём разобран публично, с кодом, ещё в конце 2025 года.

**Vocode** — vocode-core: последний коммит **ноябрь 2024**, внимание ушло в хостинг-продукт.
Как опенсорсный игрок фактически неактивен.

**Smallest.ai** — $13M Series A (лид Seligman Ventures, участвовали Sierra Ventures и 3one4),
**31 июля 2026**, TechCrunch. Тезис: прорыв не в ускорении LLM, а в маленьких специализированных
моделях; «слушать, думать и говорить одновременно», «virtually zero response lag».
Но при выходе за пределы своей базы знаний — **передача разговора большому LLM и «hold» с
имитацией «сейчас уточню»**. Т.е. снова маскировка.

**Sierra** — построила τ-voice (см. выше) именно как измерение «агент реального времени решает
реальные задачи с инструментами». Соавтор — Karthik Narasimhan (Princeton), автор оригинального
τ-bench. Это не просто продукт в нише — это команда, которая **определяет метрику** ниши.

**Sindarin** — bootstrapped, финансирования нет. **Vapi / Deepgram / Daily-Pipecat** — см. выше.

---

## ВЕРДИКТ

**ЗАНЯТА.** Проверяемое утверждение «никто не целится специально в задачу агентного дуплекса»
**опровергнуто**, причём с запасом.

Порог опровержения («профинансированный стартап или команда, заявляющая именно это как свой
продукт») пройден минимум трижды, по первичным источникам:

1. **xAI, Grok Voice Think Fast 1.0 / 2.0** (x.ai/news, 23.04.2026 и 29.07.2026) — заявляет
   ровно связку «дуплекс + вызов инструментов + без прироста задержки»:
   «reason through queries **while speaking**… **with no impact on latency**»,
   «**tool calls are snappier, usually executing before the end of the agent's first sentence**»,
   «high-volume tool calling», TTFA 0.70 с, τ-voice 56.5 %, Full Duplex Bench 95.1 %.
   Продакшн-развёртывание у Starlink на 28 инструментах.
2. **OpenAI, gpt-realtime-2.1 / -2.1-mini** (06.07.2026) — reasoning + tool use внутри
   низколатентного speech-to-speech, −25 % p95 задержки.
3. **Sierra** — построила τ-voice, бенчмарк именно этой задачи, вместе с автором τ-bench
   из Принстона. Ниша не просто занята — у неё уже есть общепринятая линейка.

Плюс широкий слой заявок без цифр: Cartesia Line («tool calling… ultra-low latency»),
Phonic («frontier intelligence for reliable tool calling»), Ultravox («Agentic-ready»),
Smallest.ai («слушать, думать и говорить одновременно»).

### Что при этом в гипотезе оказалось верным

- **Цифры 0,600 / 4,25 с — реальные и правильно процитированные** (Full-Duplex-Bench-v3,
  arXiv 2604.04847, апрель 2026). Задача действительно не решена на этом бенчмарке.
- **Диагноз «вендоры смазывают сценарий» — подтверждён полностью.** Из всех проверенных
  первичных источников **ни один** не публикует задержку для сценария с вызовом инструмента
  как заголовочную метрику. Все headline-цифры — чистый разговор.
- **Индустриальный стандартный ответ на tool call — маскировка филлером, а не ускорение.**
  Подтверждено первичкой: Vapi (`Request Start` / `Request Delayed`), Pipecat primer
  («provide audio feedback while functions execute»), Smallest.ai («hold to research»),
  GetStream (филлер «buys 1.5-2 seconds»).

### Что в гипотезе не выдержало

- **«Лучший Pass@1 в мире 0,600»** — верно только для одного бенчмарка и только на апрель 2026.
  По τ-voice (Sierra, 01.05.2026) фронтир прошёл 30 % (авг-2025) → 67 % (апр-2026), то есть
  +37 п.п. за 8 месяцев. Строить позиционирование на «никто не может» при такой производной —
  опасно: цифра устареет быстрее, чем закроется раунд.
- **«Никто не целится»** — целятся две сильнейшие лаборатории мира, обе с прямыми
  формулировками в анонсах.

---

## Таблица игроков: цифра и К КАКОМУ СЦЕНАРИЮ она относится

| Игрок | Заявленная цифра | Сценарий цифры | Механизм под tool call | Источник (первичный) |
|---|---|---|---|---|
| **xAI Grok Voice Think Fast 2.0** | TTFA **0.70 с**; τ-voice 56.5 %; Full Duplex Bench 95.1 % | Дуплекс **+ агентные задачи с инструментами** — единственный, кто даёт обе оси | Рассуждение параллельно речи; tool call «до конца первого предложения» | x.ai/news/grok-voice-think-fast-2, 29.07.2026 |
| **OpenAI gpt-realtime-2.1** | −25 % p95 задержки | Разговор; агентная ось не квантифицирована | Configurable reasoning effort + tool use в S2S | developers.openai.com/api/docs/models/gpt-realtime-2.1, 06.07.2026 |
| **Phonic** | **300 мс** speech-to-speech | **Чистый разговор** | «frontier intelligence for reliable tool calling» — без цифр | phonic.ai; $4M seed, Lux, PRNewswire 302419143 |
| **Vapi** | sub-500 мс; P50<500 / P95<800 | **Чистый конвейер** ASR→LLM→TTS | Маскировка: async-режим + `Request Start/Delayed` | vapi.ai/blog/speech-latency; docs.vapi.ai/tools/custom-tools |
| **Retell AI** | от **600 мс** (замеры 580–800 мс) | Разговор, своя turn-taking модель | Признают: tool call = **2 LLM-вызова**, дороже | retellai.com; docs.retellai.com |
| **Bland AI** | ~**400 мс** заявка (замеры ~800 мс, всплески 2.5 с) | Разговор, свой стек | Не заявлено | bland.ai; PRNewswire 302801583, $50M Series C, июнь 2026 |
| **Cartesia (Line)** | «ultra-low latency» **без числа**; Sonic 3 — 40/90 мс, Ink-2 — 100 мс | Числа только по **компонентам** (TTS/STT) | «tool calling and real-time actions» — без метрик | cartesia.ai/agents; ~$191 млн привлечено |
| **Ultravox / Fixie** | **150 мс TTFT** | **Первый токен в разговоре** | «Agentic-ready», «Empowering Tools» — без цифр | ultravox.ai; ~$17 млн (Crunchbase) |
| **Deepgram Flux** | EOT ~**260 мс** медиана; eager EOT срезает **100–200 мс** ценой **+50–70 % LLM-вызовов** | **Только эндпойнтинг**, не полный цикл | Eager EOT — спекулятивный запуск LLM, инструменты не спекулируются | developers.deepgram.com/docs/flux/voice-agent-eager-eot |
| **Daily / Pipecat** | Smart Turn v3: **12 мс CPU**; решение о смене хода **~250 мс** | **Только эндпойнтинг** | Явно рекомендуют филлер; **не** спекулятивные инструменты | daily.co/blog (11.09.2025); voiceaiandvoiceagents.com (июнь 2026) |
| **LiveKit** | цифр по preemptive generation **нет** | — | Preemptive generation (вкл. по умолчанию) + `preemptive_tts`; **конфликтует с tool calls** (issues #1365, #4219) | docs.livekit.io/agents/build/audio/; $100M Series C, оценка $1 млрд, янв. 2026 |
| **Rime** | **120 мс** on-prem | **Только TTS** | — | rime.ai, Arcana v3, февраль 2026 |
| **Speechmatics** | WER 1.07 % на стриминге; предупреждают про **+500 мс** от фронтирного LLM в эндпойнтинге | **Только STT + turn detection** | — | blog.speechmatics.com/semantic-turn-detection |
| **Gradium (спин-офф Kyutai)** | real-time TTS/STT | **Модели**, не агент | Unmute показывает function calling, «below a second» | TechCrunch 02.12.2025 ($70M seed → >$100M с NVIDIA) |
| **Sindarin** | «low latency» | Разговор | — | sindarin.tech; **финансирования нет** (Tracxn/Crunchbase) |
| **Vocode** | — | — | — | vocode-core, последний коммит **ноябрь 2024** |
| **Smallest.ai** | «virtually zero response lag» | Разговор | При выходе за базу знаний — **передача большому LLM + «hold»** | TechCrunch 31.07.2026, $13M Series A |
| **Sierra** | фронтир τ-voice: 30 % → **67 %** за 8 мес. | **Задачи с инструментами в дуплексе** (278 задач) | Строит метрику ниши | sierra.ai/blog/tau-voice-…, 01.05.2026 |

**Правило чтения таблицы:** цифра «sub-second» у 15 из 18 относится к чистому разговору или
к одному компоненту стека. Единственный, кто даёт задержку и агентную успешность рядом,
для одного и того же сценария — **xAI**. Это и есть ответ на п. 2.

---

## Пункт 6 (главный): сколько решения уже роздано бесплатно

**Ответ: практически всё, кроме интеграции.** Ров отсутствует; преимущество измеряется
неделями, а не годами — этот тезис задания **подтверждается**.

Инвентаризация по компонентам:

| Компонент решения | Статус | Где лежит | Лицензия / дата |
|---|---|---|---|
| **Семантический эндпойнтинг** | Полностью открыт, включая **обучающие данные и скрипт тренировки** | pipecat-ai/smart-turn-v3 (HF + GitHub) | BSD-2, 11.09.2025; 12 мс CPU, 23 языка |
| **Спекулятивная генерация LLM до конца реплики** | Открыт и **включён по умолчанию** | livekit/agents — `preemptive_generation`, `preemptive_tts` | Apache-2 фреймворк, docs.livekit.io |
| **Eager end-of-turn (события ранней уверенности)** | Открытый протокол в публичном API | Deepgram Flux: `EagerEndOfTurn` / `TurnResumed` / `EndOfTurn` | Публичные доки, коммерческий API |
| **Barge-in / прерывание** | Открыт | Pipecat (`should_interrupt`, `MinWordsUserTurnStartStrategy`), LiveKit Agents 1.5.x, TEN Framework | Открытые репозитории |
| **Параллельные каналы действий** | Открыт | Pipecat `ParallelPipeline` (несколько под-пайплайнов конкурентно) | reference-server.pipecat.ai |
| **Function calling в дуплексном каскаде** | Открыт | Kyutai **Unmute** (код на GitHub), «below a second» | kyutai.org/unmute/ |
| **Вызов инструмента ДО конца реплики пользователя** | **Опубликован академически, отрецензирован** | **SHANKS**, arXiv 2510.06917 → **ACL 2026 long paper**; страница проекта d223302.github.io/SHANKS/ | 56.9 % tool call завершаются до конца реплики |
| **Спекулятивное исполнение инструментов** | Опубликовано, CC BY 4.0 | «Speculative Interaction Agents» arXiv 2605.13360 (1.3–1.7× cloud, 1.6–2.2× edge); **PASTE / «Act While Thinking»** arXiv 2603.18897 | май 2026 / март 2026 |
| **Чередование рассуждения и речи** | Опубликовано | arXiv 2605.20946, 2606.07547, 2509.01920, StreamRAG | 2025–2026 |
| **Прикладной рецепт «филлер ‖ спекулятивный tool call»** | Разобран публично, с кодом | getstream.io/blog/speculative-tool-calling-voice/ | 23.12.2025 |
| **Бенчмарки для измерения** | Открыты | Full-Duplex-Bench-v3 (2604.04847), τ-voice (Sierra), VoiceAgentBench, Audio2Tool (2604.22821), EVA-Bench (2605.13841), VoiceBench | 2025–2026 |

**Что НЕ роздано:** только веса лучших закрытых speech-to-speech моделей
(grok-voice-think-fast, gpt-realtime-2.1, Gemini Live). Но именно они и лидируют по метрике —
то есть недостающая часть находится у тех, кого гипотеза считает не целящимися в задачу.

**Следствие для позиционирования.** Ров не может стоять на:
(а) семантическом эндпойнтинге — открыт с весами и данными;
(б) спекулятивном исполнении — три статьи и продакшн-фича LiveKit;
(в) параллельном исполнении действий — примитив в Pipecat;
(г) самом факте «мы делаем tool call быстро» — так уже заявляет xAI и OpenAI.
Патентом закрыть тоже нельзя: перечисленное выше образует **prior art**.

---

## Ответы по пунктам задания

**1. Инфраструктурные игроки.** Ни у одного из проверенных (LiveKit, Daily/Pipecat, Vapi,
Retell, Bland, Cartesia, Rime, Deepgram, Speechmatics, Sindarin, Vocode) агентный дуплекс не
заявлен как **свой продукт с метрикой**. Специальные механизмы есть у трёх: LiveKit
(preemptive generation, конфликтует с tool calls), Deepgram (eager EOT), Pipecat (Smart Turn +
ParallelPipeline). Ни у кого нет спекулятивного исполнения **инструментов** в продукте.

**2. Кто к чему относит цифры.** См. таблицу. Единственный, у кого задержка и агентная
успешность измерены для одного сценария — **xAI**. Все остальные дают либо чистый разговор,
либо один компонент. Диагноз задания верен.

**3. Исследователи с коммерческими структурами.**
- **Kyutai** → спин-офф **Gradium** (сент. 2025), $70M seed → **>$100M** с NVIDIA. Есть.
- **Full-Duplex-Bench** (Guan-Ting Lin, Hung-yi Lee, + Chen Chen / Zhehuai Chen — NVIDIA;
  *допущение* по аффилиациям, требует сверки) — коммерческой структуры не обнаружено, но
  NVIDIA-соавторство означает промышленный интерес.
- **DuplexSLA / SHANKS** — SHANKS вышла в ACL 2026 без своей компании; но механизм уже
  переиспользован индустрией.
- **Sierra** — обратный случай: коммерческая компания, которая пришла в исследование и
  выпустила бенчмарк.

**4. Свежие раунды 2025–2026 под тезис «быстрый голосовой агент, который выполняет задачи».**
LiveKit $100M Series C @ $1 млрд (янв. 2026, Index) · Cartesia $100M (ноя. 2025, KP/Index/
Lightspeed/NVIDIA; всего ~$191M) · Gradium $70M seed (дек. 2025) → >$100M (NVIDIA) ·
Bland $50M Series C (июнь 2026, Dell Technologies Capital; всего >$100M) ·
Smallest.ai $13M Series A (июль 2026) · Phonic $4M seed (март 2025, Lux) ·
VoiceRun $5.5M seed (янв. 2026, Flybridge) · Ringg AI $5.5M Series A ·
ElevenLabs $500M Series D @ $11 млрд · Decagon $250M Series D.
Капитал в сегменте — сотни миллионов долларов в год.

**5. Патенты.** Блокирующего патента именно на спекулятивное исполнение инструментов в
дуплексном голосовом агенте не найдено. Смежный prior art: US9514747B1 (Google, снижение
задержки распознавания), US9413891B2 (contextual look-ahead), EP3881317A1 (предсказание
реплики пользователя до отправки), US20240289863A1. *Допущение:* полноценного FTO-анализа не
делалось; заявки 2025–2026 могут быть ещё не опубликованы (лаг ~18 мес.).
Собственный патентный ров затруднён: SHANKS, PASTE и Speculative Interaction Agents уже
опубликованы.

**6.** См. раздел выше. **Ров отсутствует.**

---

## Есть ли свободный сегмент

Свободного сегмента «делаем агентный дуплекс быстрее всех» — нет. Что осталось тонким
(это **гипотезы**, не установленные факты, требуют отдельной проверки):

1. **Честное измерение с раскрытым сценарием.** Ни один вендор не публикует
   «задержка при вызове инструмента, p50/p95». Это дыра в отрасли — но её уже занимают
   evaluation-компании (Coval, Cekura, Hamming) и бенчмарки Sierra.
2. **Стек, где закрытая фронтир-модель недоступна:** on-prem, регулируемые отрасли,
   не-английские языки, телефония низкого качества. Grok/GPT-Realtime туда не идут; Speechmatics
   и Rime (120 мс on-prem) — идут, но без агентной части.
3. **Домен, а не механизм.** Единственное, что остаётся защитимым при отсутствии рва в
   механизмах, — вертикальные данные, интеграции и политика домена (то, что Sierra и Bland
   уже строят: «complex, high-stakes conversations»).

**Рекомендация по формулировке для питча:** заявку «никто не целится в задачу» надо снять —
она опровергается одной ссылкой на x.ai/news и убьёт доверие ко всей остальной аргументации.
Рабочая замена — «отрасль не измеряет задержку в сценарии с инструментом и лечит её филлером;
у нас — метрика и механизм», что по первичным источникам **подтверждается**.
