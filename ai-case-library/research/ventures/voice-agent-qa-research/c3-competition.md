# C3. Конкуренты: проверка критерия «свободная ниша»

**Дата проверки:** 2026-09-01
**Проверяемое утверждение:** «Ни одна из существующих платформ тестирования голосовых AI-агентов не продаёт независимое заключение для третьей стороны как отдельный продукт, и ни одна не заняла нишу неанглийских языков».

---

## ВЕРДИКТ: ОПРОВЕРГНУТО (обе половины утверждения)

Порог опровержения, заданный в задаче, пройден **многократно и по обоим пунктам**. Найдено:

1. **Независимое заключение для третьей стороны продаётся как отдельный продукт — минимум двумя игроками.**
   - **Sipfront** (Вена, Австрия) — прямой аналог идеи: продукт называется «Voice AI Compliance Audit», позиционируется дословно как «the independent truth layer», выдаёт «EU AI Act Compliance Assessment Report» и «Evidence Pack», явно заявленный как «ready for internal review or **regulatory submission**».
   - **AIUC-1** (Artificial Intelligence Underwriting Company + BSI/Schellman) — независимая сертификация AI-агентов с аудитом, сертификатом и ежеквартальным ретестом. **ElevenLabs — голосовая платформа — сертифицирована по AIUC-1 в феврале 2026**, то есть категория «голосовые агенты» уже занята.

2. **Ниша неанглийских языков занята и является заявленной публичной функцией.**
   - Hamming: **65+ языков**, отдельные посадочные страницы по языкам (иврит, японский), детект code-switching.
   - Cekura: **32 языка** (включая русский), режим «Multilingual» для code-switching в одном звонке.
   - Coval: **10 языков**, 27 голосов, 20 акустических сред.
   - Bluejay: 500+ переменных симуляции, включая языки и акценты.

Дополнительно опровергнуто: **EU AI Act уже заявлен как продуктовая рамка** (Sipfront), а **аудит руками, а не self-serve, уже продаётся** (Sipfront, Cyara Professional/Managed Services, BABL AI).

**Единственный остаток свободного пространства** (не отменяет вердикт): формальной *аккредитованной* сертификации именно голосовых агентов под EU AI Act пока нет — Cekura прямо пишет, что не выдаёт аттестации; Coval и Hamming тоже не заявляют себя сертификаторами. Но эту позицию уже занимают AIUC+BSI сверху и Sipfront снизу, а не пустое поле.

---

## 1. Прямые опровержения (ключевые находки)

### 1.1 Sipfront — почти дословно та же идея, уже в рынке и с деньгами

Австрийская компания (Вена, основана 2020, основатели Andreas Granig, Markus Seidl, Daniel Tiefnig), исторически — тестирование SIP/телеком-инфраструктуры, развернулась в сторону аудита голосового AI.

Цитаты с продуктовой страницы `sipfront.com/ai-compliance/audit/` и `sipfront.com/qa-assurance/regulatory/`:

- «**the independent truth layer**»
- «an **independent, third-party record** of every interaction that is separate from your vendor's logic»
- «**verifiable, third-party technical proof**», «**Independent Ledger**»
- Состав деливерабла — **«Sipfront Evidence Pack»**:
  - **Compliance Scorecard** — «A high-level red/yellow/green status report for the **EU AI Act** and regional mandates» (описан как «board-ready regulatory summary»)
  - **Media Path Forensics** — deep-packet доказательства качества медиа-тракта
  - **Disclosure Verification** — «**Audio-validated evidence that your AI identifies itself correctly**» (это прямая проверка Article 50 EU AI Act)
  - **Remediation Roadmap** — приоритизированный список технических исправлений
- Отдельно упомянут **«EU AI Act Compliance Assessment Report»**
- Аудитория: документация «**ready for internal review or regulatory submission**»
- Регуляторный охват: EU AI Act, HIPAA, GDPR, **австрийский национальный стандарт DQV**, «cross-border consistency»
- EU-хостинг, «built in Austria», GDPR-aligned, **немецкая версия сайта (DE)**

**Финансирование:** €1.8M привлечено на «quality assurance and compliance testing for voice AI systems in the enterprise sector» (Dealroom / Vestbee, 2026).

> Это не «платформа самопроверки для инженера». Это ровно «независимое заключение для третьей стороны», проданное как отдельный продукт, в ЕС, под EU AI Act, с немецкоязычным интерфейсом. Критерий опровергнут этим пунктом в одиночку.

### 1.2 AIUC-1 — независимая сертификация AI-агентов, уже покрывшая голос

**Artificial Intelligence Underwriting Company (AIUC)**, Сан-Франциско. Модель: страховой полис + аудит + стандарт сертификации. Стандарт **AIUC-1** разработан совместно с юрфирмой Orrick, позиционируется как «**SOC 2 для AI**».

- Состав: **51 требование и 130 контролей** (65 обязательных, 65 опциональных) по шести риск-пиллерам (BSI / отраслевые разборы, 2026).
- Процесс (со страницы BSI): «**Quarterly adversarial testing**», «an **annual audit** of governance, safety and security controls», «Quantified performance evaluations», «Ongoing access to an evaluation analysis platform».
- Разделение ролей: **BSI** проводит «Operational Controls Audit» (BSI аккредитован как Certification Body по ISO/IEC 42001 — ANAB, RvA, UKAS); **AIUC** выдаёт сертификат; в отраслевых разборах также фигурирует **Schellman** как независимый аудитор.
- Заявленная цель — ровно «паспорт для внешней стороны»: «**accelerate procurement by giving buyers greater confidence**» и «differentiate AI products in competitive markets»; в отраслевых разборах — «what **regulated buyers ask for by name**».
- **Финансирование:** $15M seed, июль 2025, лид NFDG, участие Emergence Capital и Terrain; ангелы — Ben Mann (сооснователь Anthropic), экс-CISO Google Cloud и MongoDB. Основатели: Rune Kvist (ранний продуктовый/GTM найм в Anthropic), Brandon Wang (Thiel Fellow), Rajiv Dattani (экс-партнёр McKinsey, экс-COO METR).

**Критично для нашей идеи — голос уже покрыт:**
- **ElevenLabs, 12 февраля 2026** — «first-of-its-kind AI Agent insurance», сертификация покрывает именно «**AI voice agents**» и «their actions», использование в «customer support, sales, scheduling, and other business-critical workflows».
- Объём тестирования: «**5,835 technical tests across 14 risk categories**».
- Формулировка выгоды — «**third-party validation** of its security, safety and reliability».
- Клиенты ElevenLabs могут «achieve full AIUC-1 certification in weeks».
- Другие сертифицированные: **Intercom Fin** (декабрь 2025), **UiPath** (март 2026, «more than 2,000 technical evaluations»).

> Это буквально «паспорт агента», который владелец предъявляет закупщику. Уже выдан голосовому вендору. Уже с поддержкой аккредитованного certification body.

### 1.3 Мультиязычность — заявленная функция, а не пробел

| Игрок | Заявленная поддержка | Источник |
|---|---|---|
| **Hamming** | «**65+ языков**» на главной; «the only voice agent testing platform with **native support for 49 languages**, including code-switching detection, regional variant testing, and **language-specific WER benchmarks**»; отдельные посадочные страницы `/language/hebrew`, `/language/japanese`; акценты (South Indian, Gulf Arabic, UK, Australian, LatAm Spanish) | hamming.ai |
| **Cekura** | **32 языка** (пост от 20.04.2026): европейские (вкл. **русский**, украинский, польский, чешский, болгарский, эстонский), 9 индийских, восточно/юго-восточноазиатские, арабский, иврит, африкаанс; режим «**Multilingual** (for code-switching and multi-language conversations in a single call)»; «tri-provider architecture, automatically routing each language to the engine that performs best» | cekura.ai/blogs/cekura-multilingual-voice-ai-testing |
| **Coval** | «**10 languages**», 27 голосов, акценты (Australia, India, UK, USA), 20 сред фонового шума | coval.ai/products |
| **Bluejay** | «over **500 variables** including different voices, accents, **languages**, environments, and behaviors» | getbluejay.ai / обзоры |
| **Evalion** | мультиязычность подразумевается, детализация не подтверждена | Speechmatics, 26.05.2026 |

**Допущение:** «65+ языков» и «32 языка» — это маркетинговые заявления вендоров; фактическое *качество* оценки на, скажем, русском или казахском никем публично не бенчмаркнуто (Cekura прямо не даёт WER-цифр; Hamming заявляет «language-specific WER benchmarks», но публичных таблиц я не нашёл). То есть **заявленная функция есть у всех — доказанное качество не показал никто**. Это остаточная щель, но она не сохраняет исходное утверждение: утверждение говорило «ни одна не заняла нишу», а нишу как минимум *заявили* все ключевые игроки.

---

## 2. Таблица игроков

Столбцы: (1) отчёт для внешних сторон; (2) EU AI Act; (3) языки; (4) аудит руками / услуга, а не self-serve.

| Игрок | Отчёт для внешней стороны | EU AI Act заявлен | Языки | Аудит руками (услуга) | Цена (первоисточник/обзор) |
|---|---|---|---|---|---|
| **Sipfront** (AT) | **ДА, это и есть продукт.** «Evidence Pack», «Compliance Scorecard», «EU AI Act Compliance Assessment Report», «ready for regulatory submission», «independent third-party record» | **ДА, явно.** + HIPAA, GDPR, австрийский DQV, Article 50 disclosure verification | DE-версия сайта; «cross-border consistency»; точный список языков симуляции не опубликован | **ДА** — аудит как сервис (discovery → mapping → автоматизированная симуляция через сеть тест-проб) | не раскрыта. €1.8M raised |
| **AIUC** (+BSI, Schellman) | **ДА — сертификат AIUC-1.** Цель прямо: «accelerate procurement by giving buyers greater confidence» | не заявлен явно как EU AI Act; опирается на ISO/IEC 42001-инфраструктуру BSI | н/д (стандарт языко-нейтрален) | **ДА** — ежегодный аудит + ежеквартальный adversarial retest | не раскрыта. $15M seed (07.2025) |
| **Coval** | Частично. «Audit-ready at every step», «Logs, **exportable evidence**, and SOC 2 Type II infrastructure», «Catch failures before regulators do and **give your team the record to prove it**». Но себя сертификатором **не** называет: «the evaluation platform for voice AI quality» | **НЕТ** (проверено на главной, /products, /industries/financial-services) | **10** | Нет аудита. Есть «embedded forward-deployed engineers» для enterprise-пилотов | Starter $100/мес; Growth $500/мес; Enterprise от $4,500/мес; овераджи $0.40/симуляц.-мин, $0.10/мониторинг-мин. $28M Series A, всего $31M с 2024; 60+ организаций (Zoom, Deepgram) |
| **Hamming** | **ДА, частично как фича.** Раздел продукта «Compliance → Reports»; экспорт результатов **PDF-отчётом** с записями, транскриптами, метриками — «для stakeholder reviews, **compliance documentation**»; «audit-ready compliance reports»; audit logs → SIEM | **НЕТ явно.** Ориентируется на HIPAA, SOC 2, PCI DSS, GDPR | **65+** (заявлено); 49 «native» | Нет. Self-serve + REST API/CLI | тиры Startup / Agency / Enterprise, цифры sales-led. SOC 2 Type II получен 12.2025. Резиденция данных US/EU/UK |
| **Cekura** (экс-Vocera, YC F24) | **Частично, но с прямым отказом от роли аудитора.** Evidence set = «scenario definition, the audio, the transcript, the per-turn evaluator scores, the repeat-run history…and an access log». Дисклеймер дословно: «**Cekura does not certify compliance, issue attestations**, or make an agent HIPAA, PCI DSS or TCPA compliant» и «Treat the output as **engineering evidence for your compliance team, not a compliance conclusion**» | **НЕТ** (на странице compliance-testing EU AI Act не упомянут) | **32** + режим code-switching | Нет, self-serve | Free 300 кредитов; Developer $30/user/мес (750 кредитов); 5 кредитов/мин голосового теста; овераджи ×2 от ставки; +$10/мес за доп. линию; ~$208 за 1000 минутных симуляций; Enterprise sales-led. 75+ клиентов |
| **Cyara** | Частично. «AI Trust» модули: Compliance («PII exposure, regulatory violations, unsafe responses», «configurable compliance rules»), Bias, FactCheck, Misuse. Явных внешних отчётов/аттестаций не заявляет | **НЕТ явно** (говорит «regulatory violations» абстрактно) | не заявлено на странице AI Trust | **ДА, но другого типа** — Consulting Services, **Managed Services**, Fast-Start Packages. Это «помочь тебе пользоваться платформой», **не** независимое заключение о твоём агенте | Enterprise, только custom. 20 лет на рынке, 350M+ customer journeys/год. Agentic Testing + AI Governance анонсированы **31.03.2026** |
| **Bluejay** | Нет данных о внешних отчётах | Нет | 500+ переменных вкл. языки/акценты | Нет | sales-led. SOC 2 Type II, HIPAA |
| **Braintrust** | Нет (eval-инфраструктура общего назначения) | Нет | не специфицировано | Нет | Free; Pro **$249/мес**; Enterprise custom |
| **Roark** | Нет | Нет | не специфицировано | Нет | consumption-based + минимальный месячный спенд |
| **Tuner** (London) | Нет | Нет | не специфицировано | Нет | не раскрыта |
| **SuperBryn** | Нет данных | Нет | не специфицировано | Нет | Enterprise, не раскрыта |
| **TestZeus** | Нет данных | Нет | не специфицировано | Нет | не раскрыта. Заточен под Salesforce Agentforce |
| **Evalion** | Нет данных | Нет | мультиязычность подразумевается | Есть слой «hybrid human-review» + академический бенчмаркинг | не раскрыта |
| **BABL AI** (смежный, с 2018) | **ДА.** «Independent Third-Party Audits follow globally recognized assurance engagement standards, similar to financial auditing»; сертифицирует AI-системы; свой курс сертификации аудиторов | ориентируется на ISO 42001, NIST AI RMF | н/д | **ДА, это аудиторская фирма** | публичных цен нет |

Источник цен и тиров, где не указано иное: обзор Speechmatics «De-risk your voice agent: The 11 best voice agent testing platforms», 26.05.2026 — вторичный источник, цены следует перепроверить у вендоров.

---

## 3. Смежная угроза: встроили ли тестирование сами платформы-строители

| Платформа | Встроенное тестирование/оценка | Документ о качестве для клиента |
|---|---|---|
| **ElevenLabs** | **ДА.** «Test AI agent» в дашборде; **Success evaluation** (кастомные критерии, результат `success`/`failure`/`unknown`, каждый транскрипт прогоняется через LLM); **Data collection**; вкладка **Analysis** с кастомными критериями; Call history с транскриптами и результатами оценки | **ДА, и это худшая новость для идеи.** ElevenLabs — первый в мире держатель **AIUC-1-backed страхового полиса на голосовых агентов** (12.02.2026), 5,835 тестов по 14 категориям риска. То есть строитель платформы уже раздаёт клиентам внешнюю валидацию. SOC 2 Type 2 + HIPAA attested, BAA на Enterprise |
| **Vapi** | Базовые тест-сьюты в продукте; в обзорах регулярно указывается как «нужен внешний слой тестирования» | Отдельного документа о качестве агента не выдаёт |
| **Retell** | Аналогично; HIPAA на стандартных планах + self-service BAA-портал | Комплаенс-бейджи, не отчёт об агенте |
| **LiveKit / Pipecat** | Инфраструктурные фреймворки; тестирование навешивается сверху (Cekura, Evalion интегрируются) | Нет |

**Вывод по смежной угрозе:** прямой угрозы «строители вытеснят тестировщиков» пока нет — все платформы тестирования как раз строят интеграции поверх Vapi/Retell/LiveKit/Pipecat/ElevenLabs. **Но** ElevenLabs прошёл через AIUC-1 и теперь может предлагать своим клиентам ускоренную сертификацию — это и есть канал, по которому «паспорт агента» раздаётся бесплатно/дёшево как приложение к платформе.

---

## 4. Закрывшиеся и поглощённые игроки: почему не взлетели

Полноценных «трупов» именно в нише *тестирования голосовых агентов* не нашлось — категория слишком молодая (Coval и Cekura запущены в 2024). Найдено следующее:

| Событие | Год | Что это значит |
|---|---|---|
| **Cyara покупает Botium** (австрийский стартап автоматизированного тестирования чат-ботов) | ~2022 | Независимый тестировщик разговорного AI не дожил до самостоятельности — поглощён CX-инкумбентом |
| **Cyara покупает QBox** (UK, NLP-платформа тестирования разговорного AI), сумма не раскрыта | 28.11.2023 | Тот же паттерн. Два независимых игрока подряд ушли в один консолидатор. Сумма не раскрыта — обычно признак небольшой сделки. **Допущение:** непубличная сумма + отсутствие пресс-упоминаний о мультипликаторе указывают на скромный исход, а не на успешный экзит |
| **Promptfoo → OpenAI** | 09.03.2026 | Инструмент eval/red-teaming поглощён модельной лабораторией; open-source остаётся MIT. Сигнал: eval-слой втягивается вверх по стеку |
| **Vocera → Cekura** (переименование) | 2025 | Не провал — смена имени (конфликт с Vocera Communications). Компания жива, 75+ клиентов |

**Почему предыдущие не взлетели самостоятельно (интерпретация, частично допущение):**
1. **Тестирование — фича, а не компания.** Botium и QBox оба закончили внутри CX-платформы, потому что покупатель хочет один контракт на «тест + мониторинг + аналитика», а не отдельного вендора на QA.
2. **Eval-слой всасывается вверх** — Promptfoo к OpenAI, testing к ElevenLabs/Vapi в виде встроенных фич.

### 4.1 Самый важный предостерегающий аналог: NYC Local Law 144

Это единственный в мире случай, где **независимый сторонний AI-аудит был сделан обязательным по закону**, — и рынок всё равно не возник.

Закон обязывает работодателей в Нью-Йорке ежегодно проходить **третье-сторонний bias audit** автоматизированных инструментов найма (принят 2021, вступил 01.01.2023, енфорсмент с 05.07.2023).

Исследование **«Null Compliance: NYC Local Law 144 and the Challenges of Algorithm Accountability»** (ACM FAccT 2024, arXiv:2406.01399), 155 студентов-исследователей проверили **391 работодателя**:

- **18 работодателей опубликовали отчёты об аудите — 5%**
- **13 опубликовали transparency notices — 3%**
- оба документа — только у **11**
- среди 267 с активными вакансиями в NYC: 14 отчётов (5%), 12 нотисов (4%)
- из 26 ответивших на опрос работодателей **23 заявили, что закон к ним не применяется**
- **96% из 386 измерений** показали impact ratio выше 0.8 — авторы отмечают, что это «fully consistent» с публикационным смещением: невыгодные результаты просто не публикуются

Авторы признают, что закон «creates market opportunities for algorithm auditors», но фактическая соблюдаемость — единицы процентов.

> **Практический вывод для идеи:** даже прямой законодательный мандат на независимый сторонний AI-аудит дал ~5% реального спроса. Гипотеза «EU AI Act создаст спрос на паспорт агента» этим кейсом серьёзно ослаблена. Плюс механика самоотбора: аудит покупают те, кто уверен, что пройдёт, а публикуют — только хорошие результаты.

---

## 5. Регуляторный фон (для честной оценки окна)

- **EU AI Act, Article 50** — обязанность раскрытия, что собеседник говорит с AI, **действует с 02.08.2026** (то есть уже месяц как в силе на дату проверки).
- Штрафы Article 50: до **€15 млн или 3%** мирового оборота; за запрещённые практики — до **€35 млн или 7%**.
- Обязанность машиночитаемой маркировки (Art. 50(2)) лежит на **провайдерах** генеративных инструментов, обязанность раскрытия — на **деплойерах**.
- Для «высокорисковых» систем EU AI Act требует **third-party conformity assessment через notified bodies** — но голосовые агенты в большинстве кейсов (ресепшн, поддержка) классифицируются как **limited-risk**, а не high-risk. High-risk — только медицинский триаж, кредитные решения, скрининг при найме.

> **Это важное ограничение рынка:** обязательного независимого аудита для *типичного* голосового агента EU AI Act не вводит. Обязателен он только для узкой высокорисковой подгруппы. **Допущение:** платёжеспособный сегмент, где паспорт агента реально обязателен, — это медицина/кредит/найм, то есть заметно уже, чем «все голосовые агенты».

---

## 6. Что осталось от исходного утверждения

| Часть утверждения | Статус | Чем убито |
|---|---|---|
| Никто не продаёт независимое заключение для третьей стороны как отдельный продукт | **ОПРОВЕРГНУТО** | Sipfront (Evidence Pack + EU AI Act Assessment Report, «independent truth layer»); AIUC-1 + BSI/Schellman (сертификат, ElevenLabs 02.2026); BABL AI (аудиторская фирма с 2018) |
| Никто не занял нишу неанглийских языков | **ОПРОВЕРГНУТО** | Hamming 65+/49 native; Cekura 32 + code-switching; Coval 10; Bluejay языки/акценты в 500+ переменных |
| Никто не заявляет EU AI Act | **ОПРОВЕРГНУТО частично** | Sipfront заявляет прямо и строит на этом продукт. Coval, Hamming, Cekura, Cyara — **не** заявляют (проверено на первоисточниках). То есть среди чисто testing-платформ ниша EU AI Act действительно пуста, но её уже занял специализированный аудитор |
| Никто не продаёт аудит руками, а не self-serve | **ОПРОВЕРГНУТО** | Sipfront (аудит как сервис); Cyara (Consulting + Managed Services, но для использования платформы, а не как независимое заключение); BABL AI; AIUC (ежегодный аудит + квартальный ретест) |

### Что реально осталось незанятым (узко, и это не спасает исходную формулировку)

1. **Аккредитованная** сертификация именно голосовых агентов под EU AI Act — AIUC-1 не является notified-body-конформити, Sipfront не аккредитован как certification body. **Допущение:** это скорее вопрос времени и наличия гармонизированных стандартов, чем устойчивая ниша.
2. **Доказанное качество оценки на конкретном не-английском языке** — все заявляют покрытие, никто не публикует бенчмарков. Ниша «мы единственные, кто умеет мерить агента на русском/казахском/узбекском и показать WER» технически свободна, но это **фича, а не отдельная компания**, и её закроет любой из существующих одним релизом.
3. **Локальные регуляторные режимы вне ЕС/США** — Sipfront уже покрывает австрийский DQV; аналогичных национальных режимов в других юрисдикциях никто системно не закрывает.

---

## 7. Источники

Первичные (сайты и документация компаний, пресс-релизы):
- Sipfront — Voice AI Compliance Audit: https://sipfront.com/ai-compliance/audit/
- Sipfront — Regulatory and Legal Assurance for Voice AI: https://sipfront.com/qa-assurance/regulatory/
- Sipfront — About: https://sipfront.com/about/who-we-are/
- BSI — AIUC Agentic AI Certification (AIUC-1): https://www.bsigroup.com/en-US/products-and-services/standards/aiuc-agentic-ai-certification/
- ElevenLabs — «ElevenLabs secures first-of-its-kind AI Agent insurance», 12.02.2026: https://elevenlabs.io/blog/aiuc-announcement
- PRNewswire — тот же релиз: https://www.prnewswire.com/news-releases/elevenlabs-secures-first-of-its-kind-ai-agent-insurance-302684587.html
- ElevenLabs — Agents Platform quickstart (встроенные success evaluation / analysis): https://elevenlabs.io/docs/agents-platform/quickstart
- Coval — главная: https://www.coval.ai/
- Coval — Products (Simulate/Observe/Review, 10 языков): https://www.coval.ai/products
- Coval — Financial Services («audit-ready», «exportable evidence»): https://www.coval.ai/industries/financial-services/
- PRNewswire — Coval $28M Series A: https://www.prnewswire.com/news-releases/coval-raises-28-million-series-a-to-define-safety-and-reliability-for-autonomous-voice-agents-302808740.html
- Hamming — главная (65+ языков, SOC 2 Type II, HIPAA): https://hamming.ai/
- Hamming — Product (evaluation, call analytics, governance): https://hamming.ai/product
- Hamming — multilingual framework: https://hamming.ai/resources/multilingual-voice-agent-testing
- Cekura — Compliance Testing for Voice AI Agents (дисклеймер об аттестациях): https://www.cekura.ai/discover/compliance-testing-voice-ai-agents
- Cekura — Multilingual Voice AI Testing, 20.04.2026 (32 языка): https://www.cekura.ai/blogs/cekura-multilingual-voice-ai-testing
- Cekura — Pricing: https://www.cekura.ai/pricing
- Cyara — пресс-релиз Agentic Testing + AI Governance, 31.03.2026: https://cyara.com/news/cyara-launches-agentic-testing-to-help-enterprises-deploy-ai-agents-with-confidence/
- Cyara — AI Trust (FactCheck, Misuse, Compliance, Bias): https://cyara.com/products/cyara-ai-trust/
- Cyara — Consulting Services: https://cyara.com/services/consulting/
- Cyara — приобретение QBox, 28.11.2023: https://cyara.com/news/cyara-strengthens-ai-based-chatbot-optimization-capabilities-with-acquisition-of-qbox/
- BABL AI — AI Audits: https://babl.ai/ai-audits/

Академические / исследовательские:
- Wright et al., «Null Compliance: NYC Local Law 144 and the Challenges of Algorithm Accountability», ACM FAccT 2024: https://arxiv.org/html/2406.01399v1 · https://dl.acm.org/doi/10.1145/3630106.3658998

Вторичные (обзоры, использованы для цен и сводок — требуют перепроверки):
- Speechmatics, «De-risk your voice agent: The 11 best voice agent testing platforms», 26.05.2026: https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms
- Vestbee — Sipfront €1.8M: https://www.vestbee.com/insights/articles/sipfront-raises-1-8-m
- Dealroom — Sipfront €1.8M: https://app.dealroom.co/news/feed/sipfront-raises-1-8m-to-test-voice-ai-quality-for-enterprise-customers-1
- VettedAIAgents — разбор AIUC-1 (51 требование / 130 контролей, Schellman, Intercom Fin, UiPath): https://vettedaiagents.com/aiuc-1/
- Workstreet — What Is AIUC-1: https://www.workstreet.com/blog/what-is-aiuc-1
- StartupHub — AIUC $15M seed: https://www.startuphub.ai/startups/artificial-intelligence-underwriting-company
- CX Today — Cyara Agentic Testing + AI Governance: https://www.cxtoday.com/security-privacy-compliance/cyara-launches-agentic-testing-and-ai-governance-to-close-the-ai-trust-gap-in-customer-service/
- Fierce Healthcare — Coval $28M: https://www.fiercehealthcare.com/ai-and-machine-learning/coval-raises-28m-series-address-ai-voice-agent-reliability-compliance
