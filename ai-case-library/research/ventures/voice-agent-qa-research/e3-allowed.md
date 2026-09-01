# E3 — Допускает ли регулирование, чтобы регламентированный разговор с клиентом вёл ИИ

Статус: ГОТОВО
Дата: 2026-09-01

## Проверяемое утверждение
«Регулирование допускает, чтобы регламентированный разговор с клиентом вёл ИИ, а не человек».

Порог опровержения: если в финансовых консультациях, страховых продажах или взыскании закон требует,
чтобы говорил лицензированный человек, — продукт «голосовой агент вместо сотрудника» невозможен,
и остаётся только помощь человеку.

## Журнал исследования
(заполняется по ходу)

---

## §4. TCPA / автодозвон в США — ГЛАВНЫЙ БАРЬЕР (первичный источник получен)

**Источник (первичный): FCC, Declaratory Ruling, CG Docket No. 23-362, FCC 24-17, released 8 Feb 2024.**
Полный текст: https://docs.fcc.gov/public/attachments/FCC-24-17A1.txt

### Что именно постановлено (цитаты)

п.2: «we confirm that the TCPA's restrictions on the use of "artificial or prerecorded voice"
encompass current AI technologies that generate human voices. See 47 U.S.C. § 227(b);
47 CFR § 64.1200(a)(1), (3).»

п.5: «callers must obtain **prior express consent** from the called party before making a call that
utilizes artificial or prerecorded voice simulated or generated through AI technology. If these
robocalls introduce an advertisement or contain telemarketing, the Commission's rules require that
the caller obtain the **prior express WRITTEN consent** of the called party. See 47 CFR § 64.1200(a)(2), (3).»

п.5 (обоснование): «They are "artificial" voice messages **because a person is not speaking them**»,
со ссылкой на суд: *Trim v. Reward Zone USA, 76 F.4th 1157, 1163 (9th Cir. 2023)* — «artificial voice»
включает «a sound resembling a human voice that is originated by artificial intelligence».

### КЛЮЧЕВОЕ для нашей гипотезы — п.8 закрывает лазейку «это не робозвонок, это диалог»

Комиссия опирается на Soundboard Ruling (35 FCC Rcd 14640, 2020): присутствие живого агента,
подбирающего реплики, «does not negate the clear statutory prohibition against initiating a call
using a prerecorded or artificial voice» (п.12 Soundboard).

Далее, п.8 FCC 24-17 дословно:
> «We find that this rationale applies to AI technologies, including those that either wholly
> simulate an artificial voice or resemble the voice of a real person taken from an audio clip to make
> it appear as though that person is speaking on the call **to interact with consumers**.
> In both cases, the call is initiated using an artificial or prerecorded voice under the TCPA.»

**Вывод:** интерактивность НЕ выводит голосового ИИ-агента из-под TCPA. Двусторонний живой диалог
с ИИ-голосом = «artificial voice call» = нужно согласие. Аргумент «мы не рободозвон, у нас
разговорный ИИ» юридически не работает — FCC его прямо предвосхитила и отклонила.

### Обязательные раскрытия (не про ИИ, а про личность звонящего)
п.9 / 47 CFR § 64.1200(b)(1),(2),(3): любое artificial/prerecorded voice сообщение обязано
в начале назвать «identity of the business, individual, or other entity that is responsible for
initiating the call»; для рекламы/телемаркетинга — обязательный opt-out механизм.
п.9: «These requirements are applicable to any AI technology that initiates any outbound telephone
call using an artificial or prerecorded voice to consumers.»


### Прочее по TCPA (важное для расчёта риска)

- **Санкции.** 47 U.S.C. § 227(b)(3): частный иск, **$500 за звонок**, суд может утроить до **$1 500**
  за умышленное/сознательное нарушение. Агрегированного потолка нет → классовые иски.
  Свежие расчёты по artificial/prerecorded voice: Gen Digital (Norton/LifeLock) — $9,95 млн, янв. 2026;
  Hy Cite Enterprises — $4,75 млн, нач. 2026; Register.com/Network Solutions — $1,5 млн (звонки на
  переназначенные номера). Источник-обзор: recordinglaw.com/us-laws/tcpa/tcpa-damages-and-lawsuits/,
  openclassactions.com. *(вторичный источник, суммы — из обзоров, не проверял по докетам — допущение)*
- **Правило «один звонок — одно согласие» (one-to-one consent) ОТМЕНЕНО судом.**
  *Insurance Marketing Coalition Ltd. v. FCC*, No. 24-10277 (11th Cir., 24 Jan 2025) — суд признал,
  что FCC вышла за пределы полномочий; правило вакатировано до вступления в силу (27 янв. 2025).
  → покупные лид-листы с «согласием на партнёров» снова юридически живы. Это ОСЛАБЛЯЕТ барьер,
  но не отменяет базового требования prior express (written) consent.
- **Отдельного правила «раскрой, что ты ИИ» на федеральном уровне пока НЕТ.**
  FCC 24-84 (NPRM, авг. 2024) предлагал: определение «AI-generated call», обязательное
  раскрытие в начале звонка и упоминание ИИ в тексте согласия. По состоянию на 2026 г.
  **NPRM не финализирован**; действующая администрация FCC (пред. Carr) держит более мягкую линию.
  → *допущение*: раскрытие «вы говорите с ИИ» федерально пока не обязательно, но обязанность
  назвать компанию (64.1200(b)(1)) действует уже сейчас.


---

## §1. Финансовые консультации (США + ЕС)

### США — что реально требует лицензии

**Ключ: лицензируется ФИРМА и ФУНКЦИЯ, а не «рот».**

- **Investment Advisers Act.** Инвест-советник — это лицо (в т.ч. юрлицо), регистрирующееся как RIA.
  SEC прямо признала модель **робо-эдвайзера**: *IM Guidance Update No. 2017-02, «Robo-Advisers»*,
  Division of Investment Management, 23 Feb 2017 (пресс-релиз SEC 2017-52,
  https://www.sec.gov/newsroom/press-releases/2017-52). Определение: «a registered investment adviser
  that uses innovative technologies to provide discretionary asset management services through online,
  **algorithmic-based programs**». Гайденс говорит про раскрытие, suitability и комплаенс — **не
  запрещает** алгоритму давать совет.
  → **ОПРОВЕРЖЕНИЕ тезиса «должен говорить лицензированный человек» на уровне инвест-совета.**
  Робо-эдвайзеры легальны в США с 2010-х и прямо благословлены SEC.

- **Regulation Best Interest, 17 CFR § 240.15l-1(a)(1)** (брокерская сторона), дословно:
  «**A broker, dealer, or a natural person who is an associated person** of a broker or dealer, when
  making a recommendation of any securities transaction or investment strategy involving securities
  … to a retail customer, shall act in the best interest of the retail customer…»
  → Норма прямо допускает, что **рекомендацию делает сама фирма** (broker/dealer), а не только
  физлицо. Т.е. рекомендация, выданная ИИ от имени фирмы, — это рекомендация фирмы, подпадающая
  под Reg BI, но НЕ запрещённая.
  Текст: https://www.ecfr.gov/current/title-17/chapter-II/part-240/subject-group-ECFR64f52d737aea1ed/section-240.15l-1

- **FINRA Rule 1210:** «Each **person** engaged in the investment banking or securities business of a
  member shall be registered with FINRA as a representative or principal.» Требование адресовано
  людям («associated persons»), ИИ не является associated person → регистрационное требование
  к ИИ не применяется напрямую; ответственность идёт на фирму через Rule 3110 (Supervision).
  https://www.finra.org/rules-guidance/rulebooks/finra-rules/1210

- **FINRA Regulatory Notice 24-09** (27 июня 2024): «existing securities laws and regulations apply
  to the use of AI tools… **does not create new legal or regulatory requirements**». Технологически
  нейтрально: правила надзора/хранения записей применяются к ИИ-инструментам.
  https://www.finra.org/rules-guidance/notices/24-09
  → Регулятор не запретил ИИ, а сказал «те же правила».

- **Практическое трение (не запрет): FINRA Rule 2210** — retail communications требуют
  предодобрения зарегистрированным принципалом ДО использования. Массовая генерация
  индивидуального контента ИИ плохо ложится на pre-use approval. FINRA сама признала этот
  mismatch и в **Regulatory Notice 26-14 (июль 2026)** предложила заменить обязательное
  pre-use approval на риск-ориентированную систему, прямо ссылаясь на ИИ.
  https://www.finra.org/rules-guidance/notices/26-14
  → То есть регулятор двигается НАВСТРЕЧУ ИИ-генерируемым коммуникациям, а не против.

### ЕС — MiFID II

- **Art. 25(1) MiFID II** требует, чтобы фирма обеспечила и доказала, что **физические лица,
  дающие инвестиционный совет или информацию** о финансовых инструментах, обладают необходимыми
  знаниями и компетенцией. Норма адресована людям, которые дают совет; она **не предписывает,
  что совет обязан давать человек**.
- **ESMA Public Statement on AI and investment services, ESMA35-335435667-5924, 30 May 2024**
  (первичный источник, PDF): ESMA прямо перечисляет как допустимые use-cases
  «AI-powered **chatbots and virtual assistants**… to provide support to clients» и
  «Supporting firms in the provision of investment advice/portfolio management services:
  AI tools could be used by firms to analyse a client's information… **in order to provide
  personalised investment recommendations**».
  п.9 (важное про раскрытие): «investment firms using AI for client interactions, **such as through
  chatbots or other types of AI-related automated systems, should transparently disclose to clients
  the use of such technology during these interactions**.»
  п.10: ответственность на management body; п.16: ex-ante и ex-post контроли; п.19-21: conduct of
  business при использовании ИИ для инвестсовета; сноска 10 отсылает к **ESMA Guidelines on certain
  aspects of the MiFID II suitability requirements (ESMA35-43-3172)**, которые прямо покрывают
  **robo-advice** и требуют от него тех же требований, что и от совета человека.
  https://www.esma.europa.eu/sites/default/files/2024-05/ESMA35-335435667-5924__Public_Statement_on_AI_and_investment_services.pdf

### Граница «информирование vs рекомендация»
- В США: «recommendation» — факт-специфичный тест; SEC в релизе Reg BI (84 FR 33318, 12 July 2019)
  указывает, что чем более индивидуализировано и «призывает к действию» сообщение, тем вероятнее
  это рекомендация. Общая образовательная информация и «investment education» рекомендацией не
  считаются.
- В ЕС: **Art. 4(1)(4) MiFID II** — «investment advice» = **персональная рекомендация** клиенту
  по конкретному финансовому инструменту. Общая информация без персонализации ≠ совет.
- **Практический вывод для продукта:** граница есть, и она даёт «безопасную зону» (информирование,
  сервис, статусы, назначение встреч), но НЕ является необходимой — совет ИИ тоже допустим,
  просто регуляторно нагружен (fiduciary/Reg BI/suitability + надзор + записи).

**Вердикт по §1: РАЗРЕШЕНО (с обвесом), НЕ «только помощь человеку».**
Нет нормы, требующей, чтобы рекомендацию озвучивал лицензированный человек. Лицензируется фирма
и содержание; ИИ-канал допустим. Ограничения — не в лицензии, а в надзоре, записях, раскрытии,
и (в США) в TCPA на исходящих звонках.

---

## §3. Взыскание задолженности (США)

**Прямого запрета на голосового ИИ-коллектора НЕТ.** Есть плотный набор ограничений, все из которых
исполнимы машиной — и часть из них машине даже проще соблюдать, чем человеку.

### Regulation F / FDCPA — что связывает

Первичный текст: 12 CFR Part 1006, https://www.consumerfinance.gov/rules-policy/regulations/1006/

- **§ 1006.14(b) «7-in-7»** (дословно): «a debt collector is presumed to comply … if the debt collector
  places a telephone call to a particular person in connection with the collection of a particular debt
  neither: More than **seven times within seven consecutive days**; nor Within a period of seven
  consecutive days **after having had a telephone conversation** with the person». Превышение —
  презумпция нарушения. CFPB FAQ: презумпция считается **на человека и на долг**, независимо от
  количества телефонных номеров.
  → Прямое ограничение экономики «дешёвый ИИ звонит бесконечно». Главный экономический аргумент
  голосового ИИ в коллекшене («звони сколько хочешь, это же почти бесплатно») законом обрублен.
- **§ 1006.14(d)** «a debt collector must not place telephone calls without **meaningfully disclosing
  the caller's identity**». → ИИ обязан назвать себя и коллекторское агентство.
- **§ 1006.14(h)** запрет на канал, от которого потребитель отказался.
- **15 U.S.C. § 1692e(11)** — «mini-Miranda»: в первом сообщении раскрыть, что это попытка взыскания
  долга, и что информация будет использована для этой цели; в последующих — что звонит debt collector.
- **15 U.S.C. § 1692e** в целом — запрет ложных/вводящих в заблуждение представлений.
  → **Риск-зона для ИИ:** голосовой агент с человеческим именем («здравствуйте, это Сара»), который
  на прямой вопрос «вы человек?» не признаётся, — кандидат в нарушение § 1692e.
  *(допущение: мне не известно опубликованного решения суда именно по «ИИ выдал себя за человека»
  в FDCPA-контексте; вывод — по аналогии с нормой, не по прецеденту.)*
- **§ 1006.6** — ограничения времени/места звонка (8:00–21:00 местного времени), запрет звонков на
  работу при известном запрете работодателя, третьи лица.

### Наложение TCPA на коллекшн (важный практический слой)
- Звонок ИИ-голосом на **мобильный** = artificial voice call → нужно prior express consent.
  Работающая тропа: **FCC 2008 ACA International Declaratory Ruling** — «the provision of a cell
  phone number to a creditor, e.g., as a part of a credit application, reasonably evidences prior
  express consent … to be contacted at that number **regarding the debt**».
  Там же: звонки исключительно ради взыскания **не являются telemarketing** → достаточно
  «prior express consent», письменного не требуется.
  → Это и есть реальный юридический фундамент, на котором сегодня работают ИИ-коллекторы.
  Бремя доказывания согласия — на кредиторе/коллекторе.
- Звонок на **стационарный/резидентный** номер: 47 CFR § 64.1200(a)(3) — коммерческий
  не-телемаркетинговый звонок с искусственным голосом освобождён от согласия, но не более
  **3 звонков за 30 дней** и с обязательным автоматическим opt-out механизмом в течение 2 секунд
  после идентификации (пост-TRACED Act, FR 20 Jan 2023, 2023-00634).
- **Отзыв согласия:** новые правила FCC действуют с **11 апр. 2025** — отзыв «любым разумным
  способом», слова stop/quit/revoke/opt out/cancel/unsubscribe/end считаются отзывом,
  обработать за **10 рабочих дней**. Часть правила (47 CFR § 64.1200(a)(10), распространение
  отзыва на все будущие звонки) отложена до **11 апр. 2026**.
  → Для голосового ИИ это техтребование: распознать отзыв в живой речи и мгновенно исполнить.

**Вердикт по §3: РАЗРЕШЕНО, но экономика урезана.** Голос ИИ в взыскании законен при
(а) наличии согласия/пути через ACA-2008, (б) соблюдении 7-in-7, (в) обязательных раскрытиях,
(г) честном ответе на «вы бот?». Ключевое: **лимит частоты убивает главный аргумент дешёвого
масштабирования** — нельзя звонить чаще, чем человек.

---

## §5. Обязанность раскрывать, что говорит машина

- **Федерально в США — обязанности «скажи, что ты ИИ» пока НЕТ.** Есть обязанность назвать
  компанию-инициатора звонка (47 CFR § 64.1200(b)(1)) и дать opt-out для рекламы (b)(3).
  FCC 24-84 (NPRM, авг. 2024) это предлагал, но по состоянию на 2026 не финализирован.
- **Калифорния, AB 2905 (в силе с 1 янв. 2025)** — вносит изменения в Cal. Public Utilities Code
  § 2874: при звонке с automatic dialing-announcing device живое объявление обязано
  «Inform the person called if the prerecorded message uses an **artificial voice**»;
  «artificial voice» = «a voice that is generated or significantly altered using artificial
  intelligence». Штраф порядка $500 за звонок *(сумма — из вторичного обзора, не сверял с текстом
  санкционной нормы — допущение)*.
  Текст: https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB2905
- **Калифорния, B.O.T. Act (SB 1001, Bus. & Prof. Code §§ 17940–17943, с 1 июля 2019)** —
  незаконно использовать бота, вводя человека в заблуждение о его искусственной природе,
  чтобы склонить к покупке; безопасная гавань — «clear, conspicuous» раскрытие.
  ⚠️ Ограничение: закон адресован **онлайн-взаимодействиям** (§17940 определяет «online» через
  сайт/веб-приложение), к телефонному звонку применяется спорно. *(допущение)*
- **Юта, AI Policy Act (SB 149, 2024; сужен SB 226, в силе с 7 мая 2025).**
  Для обычных потребительских взаимодействий — раскрытие **по прямому вопросу** потребителя.
  Для **лицензированных/регулируемых профессий и «высокорисковых» взаимодействий**
  (советы по финансам, праву, здоровью; финансовые/биометрические данные) — **проактивное
  раскрытие «в начале»**. Есть safe harbor при раскрытии в начале и по ходу. Штрафы: до $2 500
  за нарушение административно, до $5 000 за нарушение предписания.
  → **Это ровно наши три сценария.** В Юте голосовой ИИ, дающий финансовый совет, обязан
  представиться ИИ до начала разговора.
- **ЕС.** Двойной слой:
  (1) **AI Act, Art. 50(1)** — прозрачность: пользователь должен быть проинформирован, что
  взаимодействует с ИИ-системой (EIOPA п.2.5 прямо ссылается: «certain transparency requirements
  (e.g. need to **inform the customer that she/he is interacting with an AI system**)»);
  (2) **ESMA (п.9 Public Statement 30 May 2024)** — фирмы, использующие ИИ для взаимодействия
  с клиентами через чат-ботов и т.п., «should transparently disclose to clients the use of such
  technology during these interactions».

**Достаточно ли раскрытия?** Нет. Раскрытие снимает риск обвинения в обмане (§1692e FDCPA,
B.O.T. Act, UDAP), но **не заменяет** согласие по TCPA, лицензию продавца страховки и
обязательные отраслевые скрипты. Раскрытие — необходимое, но не достаточное условие.

---

## §2. Страховые продажи

### США — здесь барьер РЕАЛЬНЫЙ и самый жёсткий из трёх

- **Producer Licensing Model Act (NAIC #218):** «"Producer" means a **person required to be licensed
  under the laws of this state to sell, solicit, or negotiate insurance**». «Person» = natural or
  artificial entity → лицензию может держать и юрлицо (business entity producer license), но
  в штатах бизнес-лицензия требует **designated responsible licensed producer (DRLP)** —
  конкретного лицензированного физлица.
  → Ключевое: лицензируется **деятельность** «sell, solicit, negotiate». Если голосовой ИИ
  ведёт склонение к покупке и обсуждение условий — это солицитация. Она должна происходить
  **от имени и под лицензией** лицензированного продюсера/агентства. ИИ сам лицензию получить
  не может (нет экзамена, отпечатков, continuing education).
  → *Допущение:* нет однозначной нормы «ИИ не может солицитировать под лицензией агентства»;
  но и нет разрешительной нормы. Это серая зона, риск — обвинение в unlicensed activity.
- **NAIC Model Bulletin on the Use of AI Systems by Insurers** (принят 4 дек. 2023;
  по состоянию на март 2025 принят примерно в 24 штатах): требует письменную AIS Program,
  ответственность совета/менеджмента, тестирование на bias, ответственность за сторонний ИИ.
  Запрета на клиентский ИИ нет — есть обязанность управлять им.
  Карта принятия: https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf

### Medicare Advantage (США) — практически закрытая зона

**42 CFR § 422.2274** (и зеркальный § 423.2274 для Part D):
- агенты/брокеры обязаны быть «**licensed and appointed under State law**»;
- ежегодное обучение и тест с порогом **85%**;
- обязательный **Scope of Appointment** до маркетинговой встречи;
- MA-организация обязана **сообщать в CMS о зачислениях, сделанных нелицензированными
  представителями**;
- п. (g) по TPMO: контракты обязаны требовать записи **всех** маркетинговых/продажных/
  зачислительных звонков **целиком** (включая аудио веб-звонков), хранение **6 лет**
  (для CY2027 — аудио первые 3 года, дальше аудио или полная точная расшифровка);
  обязательный дисклеймер по § 422.2267(e)(41).
  https://www.law.cornell.edu/cfr/text/42/422.2274
→ **Вердикт по MA:** голосовой ИИ **не может быть продавцом**. Он может быть лидогенератором /
записывающим слоем / помощником агента, но зачисление должно делать лицензированное
физлицо-агент. Мне не удалось найти разрешительного разъяснения CMS про ИИ-агентов
*(допущение: отсутствие явного разрешения при жёстком лицензионном режиме = «нельзя»)*.

### ЕС — IDD

- **IDD (Dir. (EU) 2016/97) Art. 10** — требования к знаниям/компетенции адресованы
  **распространителям и их сотрудникам** и лицам в управленческой структуре, отвечающим за
  распространение; Annex I задаёт минимальный объём знаний.
- **EIOPA, Opinion on AI governance and risk management, EIOPA-BoS-25-360, 6 Aug 2025**
  (первичный источник): исходит из того, что **страховое законодательство (IDD, Solvency II)
  применяется ко ВСЕМ ИИ-системам в страховании** («insurance legislation such as the Insurance
  Distribution Directive and the Solvency II Directive… applies to all AI systems used in
  insurance», п.2.6). Требует human oversight (п.3.29–3.33), объяснимость (п.3.25 со ссылкой на
  Art. 20(1) IDD — объективная информация о продукте в понятной форме), ответственность AMSB.
  Запрета на ИИ в дистрибуции — нет.
  https://www.eiopa.europa.eu/document/download/88342342-a17f-4f88-842f-bf62c93012d6_en
→ В ЕС ИИ в страховой дистрибуции допустим при human oversight и раскрытии; отдельного
требования «полис продаёт человек» в IDD нет.

**Вердикт по §2: США — фактически ТОЛЬКО ПОМОЩЬ ЧЕЛОВЕКУ** (лицензия продюсера на солицитацию;
Medicare Advantage — жёстко закрыт). **ЕС — разрешено с оговорками** (human oversight, раскрытие).

---

## §6. Существующая практика: кто уже работает и как обходит

### Взыскание — самая зрелая зона, ИИ реально говорит с должником

- **Salient (trysalient.com)** — AI-native loan servicing. Клиенты названы публично:
  **Westlake Financial, American Credit Acceptance, Exeter Finance**;
  **Consumer Portfolio Services (Nasdaq: CPSS)** выпустила отдельный пресс-релиз о внедрении
  платформы Salient для collections. Раунд $60M от a16z (июль 2025), ARR >$25M.
  https://www.trysalient.com/ ; пресс-релиз CPS: nasdaq.com/press-release/consumer-portfolio-services-deploys-ai-powered-servicing-platform-salient-advance
  → Это самое сильное доказательство: **публичная компания официально сообщает акционерам,
  что ИИ ведёт разговоры с заёмщиками по взысканию.** Юристы публичной компании это подписали.
- **Skit.ai** — заявляет 120+ collection-команд, >1 млрд взаимодействий, «Compliance Layer»
  под FDCPA / TCPA / Reg F. *(маркетинговое заявление вендора, не проверено)*
- **Domu (Y Combinator)** — voice/SMS/email для банков, страховщиков, кредиторов.
  *(маркетинговое заявление вендора)*

**Как обходят:** не обходят, а вписываются. Схема одна:
(1) согласие берётся при выдаче кредита (номер телефона в заявке → ACA-2008),
(2) взыскание не telemarketing → достаточно oral consent,
(3) mini-Miranda и идентификация зашиты в скрипт как обязательные первые фразы,
(4) счётчик 7-in-7 на уровне платформы,
(5) 100% записи и транскрипты как аудит-трейл — то, что человеку сделать дороже.
**Ирония: ИИ соблюдает регламентированный скрипт лучше человека — это его продающий аргумент,
а не препятствие.**

### Страхование — ИИ до лицензированного человека, не вместо

- **eHealth (Nasdaq: EHTH), пресс-релиз 12 ноя. 2025** — голосовой ИИ-агент **«Alice»**
  (первичный источник). Что делает: шоппинг, **телефонная поддержка первичного зачисления**,
  пост-зачислительный сервис, статус заявки, ID-карты, вопросы по биллингу, обработка
  Do-Not-Call. Метрики: 100% answer rate вне рабочих часов, 77% «exceptional»,
  **30,9% позвонивших после часов выразили интерес к покупке плана против 24,4% у людей-скринеров**.
  Дословная цитата CDAIO Ketan Babaria: «**While licensed insurance agents remain essential as
  expert guides**, AI voice agents help facilitate a faster and more seamless shopping and
  support experience.»
  → Alice **не продаёт полис и не зачисляет**. Она квалифицирует, обслуживает и повышает интерес,
  а сделку закрывает лицензированный агент. Это ровно паттерн «помощь человеку + warm transfer».
- Вендоры под Medicare (Coverage Voice и др.) продают одну и ту же архитектуру:
  ИИ снимает Scope of Appointment и квалификацию → **warm transfer лицензированному агенту**.

### Финансовые консультации — ИИ в бэк-офисе, не у клиента

- **FINRA, 2026 Annual Regulatory Oversight Report, раздел GenAI** (первичный источник регулятора):
  «the top GenAI use case among FINRA member firms is **'Summarization and Information Extraction'**»,
  фирмы внедряют GenAI «with a focus on efficiency gains, **particularly with respect to internal
  processes**». Про клиентские голосовые применения — ничего.
  https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai
  → **Эмпирический факт: в брокер-дилерах ИИ сидит в бэк-офисе.** Даже там, где право позволяет
  больше, рынок не идёт в клиентскую рекомендацию.
- Платформенные вендоры (Thoughtly, Parloa, interface.ai, Kore.ai) в финсекторе строят одно и то же:
  квалификация лида, снятие согласия, запись на звонок с **лицензированным** советником;
  явное правило «factual information, not a recommendation the AI is not licensed to make».
- **Контрпример-предостережение: Massachusetts Securities Division, Policy Statement
  «Robo-Advisers and State Investment Adviser Registration» (2016)**: «fully automated
  robo-advisers, as currently structured, **may be inherently unable to carry out the fiduciary
  obligations of a state-registered investment adviser**». Регулятор штата прямо усомнился,
  что полностью автоматический советник вообще может быть советником.
  (Область: советники, регистрируемые в штате, т.е. < $100M AUM; это policy statement, не норма.)

### Судебная практика по ИИ-голосу уже началась (риск не теоретический)
- **Lowrey v. Twilio Inc. et al.**, No. 6:25-cv-00116 (W.D. Va., подан 29 дек. 2025) —
  истец пытается привлечь **OpenAI и Twilio** к ответственности по TCPA за звонки/сообщения,
  инициированные их клиентом (Fresh Start Group). Теория: платформа «made»/«caused» звонок,
  знала о нарушениях и имела техническую возможность их предотвратить.
  Докет: https://dockets.justia.com/docket/virginia/vawdce/6:2025cv00116/137374
  → **Прямой риск для нас как вендора голосового агента, а не только для клиента.**
- **Finley v. Altrua Ministries** (подан 4 апр. 2025) — TCPA по ИИ-голосовым сообщениям
  в healthcare-маркетинге. *(источник — обзор, докет не сверял — допущение)*
- Штаты активно давят на робозвонки: Anti-Robocall Multistate Litigation Task Force,
  «Operation Robocall Roundup» Phase 2 (3 дек. 2025) против Inteliquent, Bandwidth, Lumen,
  Peerless Network; июль 2026 — письмо 50 генпрокуроров в FCC за ужесточение KYC.

---

# ВЕРДИКТ

## Проверяемое утверждение — ЧАСТИЧНО ПОДТВЕРЖДЕНО

**«Регулирование допускает, чтобы регламентированный разговор с клиентом вёл ИИ» — ДА,
но не везде и не на тех условиях, на которых строится бизнес-кейс.**

Порог опровержения (закон требует, чтобы говорил лицензированный человек) **сработал
только в одном из трёх сценариев** — в страховых продажах в США.
Продукт «голосовой агент вместо сотрудника» **не невозможен**, но его безопасная зона —
намного уже, чем «регламентированные разговоры вообще».

## Вердикт по каждому сценарию

| Сценарий | Юрисдикция | Вердикт | Что связывает |
|---|---|---|---|
| **Финансовые консультации** | США | **РАЗРЕШЕНО** (с обвесом) | Лицензируется фирма (RIA/BD), не «рот». Робо-эдвайзеры прямо признаны SEC (IM Guidance 2017-02). Reg BI адресован «broker, dealer, **or** a natural person». FINRA 24-09: те же правила, новых нет. Трение: Rule 3110 надзор, Rule 2210 предодобрение коммуникаций, записи. Локальное исключение: **Массачусетс** (policy statement 2016) сомневается, что полностью автоматический советник может быть фидуциаром. |
| **Финансовые консультации** | ЕС | **РАЗРЕШЕНО** | MiFID II Art. 25(1) требует компетенции от **физлиц, которые дают совет**, но не требует, чтобы совет давал человек. ESMA (30.05.2024) прямо перечисляет ИИ-выдачу персональных рекомендаций как допустимый кейс + обязанность раскрыть, что клиент говорит с ИИ. Robo-advice покрыт ESMA35-43-3172. |
| **Страховые продажи** | США | **ТОЛЬКО ПОМОЩЬ ЧЕЛОВЕКУ** | Лицензия producer'а нужна на «sell, solicit, or negotiate». ИИ лицензию получить не может. **Medicare Advantage — фактически закрыт:** 42 CFR § 422.2274 требует лицензированного и назначенного агента, SOA, ежегодный тест 85%, запись всех звонков целиком (6 лет) и отчёт в CMS о зачислениях нелицензированными. Практика (eHealth «Alice») это подтверждает: ИИ квалифицирует → warm transfer лицензированному агенту. |
| **Страховые продажи** | ЕС | **РАЗРЕШЕНО с оговорками** | IDD Art. 10 адресован сотрудникам и управленцам, не запрещает ИИ-канал. EIOPA (06.08.2025): IDD/Solvency II применяются ко всем ИИ-системам, нужен human oversight и объяснимость. + AI Act Art. 50(1) — раскрытие. |
| **Взыскание** | США | **РАЗРЕШЕНО, но экономика обрезана** | Прямого запрета нет; работающие внедрения есть у публичных компаний. Связывает: 7-in-7 (12 CFR 1006.14(b)) — **лимит частоты убивает главный экономический аргумент**; meaningful disclosure (1006.14(d)); mini-Miranda (§1692e(11)); запрет ложных представлений (§1692e) → ИИ обязан признаться, что он ИИ, если спросят; отзыв согласия за 10 рабочих дней. |

## Разбор ограничений на автодозвон (п.4 — да, это главный барьер, но не абсолютный)

**Главное открытие:** FCC заранее закрыла лазейку «мы не робозвонок, у нас живой диалог».
FCC 24-17 п.8 прямо распространяет запрет на ИИ, который «speaking on the call **to interact
with consumers**». Разговорность не спасает.

**Практические следствия:**
1. **Любой исходящий звонок ИИ-голосом на мобильный в США = требуется prior express consent;
   если там есть реклама/телемаркетинг — prior express WRITTEN consent.**
   Цена ошибки $500–1 500 за звонок, без потолка, с классовым иском.
2. **Асимметрия, которая решает продукт: TCPA ограничивает ИНИЦИИРОВАНИЕ звонка.**
   Входящие звонки (клиент сам набрал) под 227(b) не подпадают.
   → **Inbound-голосовой агент — почти чистое поле. Outbound — минное.**
   (Для inbound остаются законы о согласии на запись разговора в двусторонних штатах —
   CA, FL, IL, PA и др.; это решается фразой-дисклеймером в начале.)
3. **Для существующих клиентов с согласием барьер низкий.** ACA-2008: номер, данный кредитору,
   = согласие на звонки по этому долгу; такие звонки не telemarketing.
   → Servicing / collections / статусы по своим клиентам — рабочая зона.
   **Холодный outbound по купленным лидам — экономически опасен.**
4. **Наложение FTC TSR** (16 CFR § 310.4(b)(1)(v)) на телемаркетинг: prerecorded-звонок для
   склонения к покупке требует письменного согласия; штрафы FTC порядка **$51 744 за нарушение**
   (уровень 2024). Это отдельный от TCPA слой. *(о том, что поправка TSR 2024 г. прямо
   распространила норму на ИИ-голоса, я видел только вторичный обзор — допущение, требует
   сверки с текстом Federal Register 2024-07180)*
5. **Ответственность вендора, а не только клиента.** *Lowrey v. Twilio Inc. et al.*
   (W.D. Va., 6:25-cv-00116, 29.12.2025) — попытка привлечь OpenAI и Twilio за звонки их
   пользователя. Если мы продаём платформу голосовых агентов, риск не переносится на клиента
   целиком.
6. **Смягчающий фактор:** правило one-to-one consent вакатировано (*Insurance Marketing
   Coalition v. FCC*, 11th Cir., 24.01.2025), FCC при пред. Carr держит мягкую линию,
   CFPB в 2025–26 резко сузил надзор. Но **частный иск по TCPA от регулятора не зависит** —
   это истцовский, а не надзорный риск. Ослабление CFPB/FCC **не снижает** главную угрозу.

## Раскрытие «я — машина»
- Федерально в США пока **не обязательно** (FCC 24-84 не финализирован).
- **Обязательно:** Калифорния AB 2905 (с 01.01.2025, звонки с artificial voice);
  Юта SB 149/SB 226 — **проактивно и заранее** для лицензированных профессий и «высокорисковых»
  тем (финансы, право, здоровье) — то есть ровно в наших сценариях;
  ЕС — AI Act Art. 50(1) + ESMA п.9 + EIOPA.
- **Раскрытия недостаточно.** Оно закрывает риск «обмана» (FDCPA §1692e, B.O.T. Act, UDAP),
  но не заменяет ни согласие по TCPA, ни лицензию продюсера, ни отраслевые скрипты.

## Что это значит для продукта (мой вывод, не норма)

**Не закрывать идею. Сузить её.**

Живая зона (закон позволяет, практика подтверждена реальными внедрениями):
- **inbound** голосовой агент в финсервисах и страховании — сервис, статусы, квалификация, SOA,
  запись на звонок, тёплый перевод;
- **outbound по своим клиентам с согласием** — servicing, напоминания, взыскание;
- **взыскание** как самая зрелая вертикаль (Salient/CPS — публичное подтверждение).

Мёртвая зона:
- **продажа страхового полиса ИИ-голосом в США**, особенно Medicare Advantage;
- **холодный outbound по купленным лидам** — экономика ломается о $500–1 500 за звонок;
- «ИИ вместо лицензированного агента, закрывающего сделку» — этого не покупает даже рынок,
  который юридически мог бы.

Главный вопрос, который надо задать следующим (он не про закон, а про экономику):
**если 7-in-7 и требование согласия ограничивают количество звонков ровно так же, как у людей,
в чём тогда остаётся экономия — в стоимости часа или в объёме?**
Если только в стоимости часа — рынок меньше, чем считался.

---

## Дисциплина источников: первичные документы, использованные в отчёте

1. FCC, Declaratory Ruling FCC 24-17, CG Docket 23-362, 08.02.2024 — https://docs.fcc.gov/public/attachments/FCC-24-17A1.txt (полный текст скачан локально: fcc2417.txt)
2. 47 U.S.C. § 227(b); 47 CFR § 64.1200(a),(b)
3. *Trim v. Reward Zone USA*, 76 F.4th 1157, 1163 (9th Cir. 2023)
4. *Insurance Marketing Coalition Ltd. v. FCC*, No. 24-10277 (11th Cir. 24.01.2025)
5. *Lowrey v. Twilio Inc. et al.*, No. 6:25-cv-00116 (W.D. Va., подан 29.12.2025)
6. 12 CFR §§ 1006.6, 1006.14 (Regulation F); 15 U.S.C. § 1692d, e
7. FCC 2008 ACA International Declaratory Ruling (73 FR 6041, 01.02.2008)
8. 17 CFR § 240.15l-1 (Regulation Best Interest)
9. SEC IM Guidance Update No. 2017-02, «Robo-Advisers», 23.02.2017
10. FINRA Rule 1210; FINRA Regulatory Notice 24-09 (27.06.2024); Regulatory Notice 26-14 (07.2026); FINRA 2026 Annual Regulatory Oversight Report, GenAI
11. Massachusetts Securities Division, Policy Statement «Robo-Advisers and State Investment Adviser Registration» (2016)
12. Directive 2014/65/EU (MiFID II), Art. 4(1)(4), Art. 25(1); ESMA Guidelines ESMA35-43-3172
13. ESMA Public Statement ESMA35-335435667-5924, 30.05.2024 (текст извлечён локально: esma_ai.txt)
14. Directive (EU) 2016/97 (IDD), Art. 10, Art. 17, Art. 20(1)
15. EIOPA Opinion on AI Governance and Risk Management, EIOPA-BoS-25-360, 06.08.2025 (текст извлечён локально: eiopa_ai.txt)
16. Regulation (EU) 2024/1689 (AI Act), Art. 50(1), Annex III
17. 42 CFR §§ 422.2274, 423.2274, 422.2267(e)(41)
18. NAIC Producer Licensing Model Act (#218); NAIC Model Bulletin on Use of AI Systems by Insurers (04.12.2023)
19. Cal. Pub. Util. Code § 2874 as amended by AB 2905 (в силе 01.01.2025); Cal. Bus. & Prof. Code §§ 17940–17943 (B.O.T. Act)
20. Utah Code (AI Policy Act, SB 149 (2024), в ред. SB 226, в силе 07.05.2025)
21. 16 CFR § 310.4(b)(1)(v) (FTC Telemarketing Sales Rule)
22. eHealth Inc. (Nasdaq: EHTH), пресс-релиз 12.11.2025, «eHealth Advances its AI Strategy with Expanded Voice Agent Capabilities»
23. Consumer Portfolio Services (Nasdaq: CPSS), пресс-релиз о внедрении Salient

Статус: ГОТОВО.
