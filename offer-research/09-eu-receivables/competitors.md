# Конкуренты «агента по дебиторке» в UK и ЕС (SMB / mid-market)

Дата сбора: 30.09.2026. Дополняет `01-raw/s6-jobs-complaints-eu.md` (блок 2 «AI-кредит-контролёр»): там были только Chaser (от £199/мес) и упоминания Upflow/Kolleno. Здесь проверены функции, цены и раунды по каждому игроку.

Правила: у каждой цифры есть ссылка. Если факт не нашёлся, стоит «не подтверждено». Цены приведены в валюте публичного прайса и без НДС, если не сказано иное. «Нет данных» значит, что на проверенных страницах об этом ничего не сказано. Это не доказательство, что функции нет.

Легенда колонок:
- **ИИ-текст**: генерирует или предлагает тексты напоминаний и ответов.
- **Разбор ответов**: читает входящие письма должника (обещание оплатить / спор / «уже оплатили») и меняет цепочку.
- **Портал**: страница оплаты для должника.
- **Досудеб.**: письма «letter before action» или официальное последнее напоминание, передача коллекторам.
- **Каналы**: что есть кроме email.

---

## 1. Сводная таблица

| Игрок | Страна | Целевой клиент | Цена (публично) | Учётки из списка | ИИ-текст | Разбор ответов | Портал | Досудеб. / коллекторы | Каналы кроме email |
|---|---|---|---|---|---|---|---|---|---|
| **Chaser** | UK | SMB и mid, оборот < £4m / < £10m / < £100m | от **£199 / €239** (Compact), £599 (Core), £899 (Complete) в мес. [1] | Xero, QBO, Sage, NetSuite (+Dynamics, SAP) [1] | да, с 07.2025 [2] | **частично**: определяет намерение и готовит ответ, человек отправляет; авто-перестройки цепочки на странице нет [2] | да [1] | да, передача в свою службу взыскания по no-win-no-fee [3] | SMS, автозвонки, письма [1]; WhatsApp только через стороннюю интеграцию Saysimple [4] |
| **Upflow** | FR / US | от SMB до enterprise, тарифы по объёму выставленных счетов до $10m… >$100m | **по запросу** [5] | QBO, Xero (Starter); NetSuite, Sage Intacct (Grow+) [5] | да | **да**: Collection Agent (ответы / обещания / споры) в трёх режимах: выкл., «с одобрением», авто; обещание оплатить ставит напоминания на паузу [6]. Сам агент только на Scale+ [5] | да ($390/мес за свои платежи) [5] | нет данных | SMS, звонки, бумажные письма [5]; Slack только для уведомлений [7] |
| **Kolleno** | UK (Лондон) [8] | оборот > $1m / > $10m / > $100m | **$650/мес** ($545 при оплате за год), Business Plus $1,245 [9] | Xero, QBO, Sage Intacct; NetSuite (Enterprise) [9] | да | заявлены ИИ-агенты «insights / copilot / full automation» [10]; разбор ответов конкретно не описан, не подтверждено | да [9] | нет данных | SMS и звонки (100–600 в пакете) [9] |
| **Paidnice** | AU (Xero-экосистема), не подтверждено | микро и SMB на Xero/QBO | **£49 / €59 / $69** в мес. (Essentials, 150 счетов); Pro от $99 [11] | Xero, QBO, Stripe; Sage / NetSuite только на Custom от $999 [11] | нет данных | нет данных | да [11] | пени и проценты за просрочку, эскалация [12]; передача коллекторам не подтверждена | SMS $0.10/шт. [11] |
| **Satago** | UK | SMB | **£45 / £80 / £200** в мес. [13] | Xero (и др.) [14] | нет данных | нет данных | приём карт и BNPL (от £80) [13] | нет данных | SMS (от £80) [13] |
| **Payt** | NL | от микро до 1m+ счетов/мес | **€39.95** (30 счетов), €69.95 (75), €159.95 (250), выше по запросу [15] | Xero, NetSuite, SAP [16]; Exact / AFAS / Twinfield не подтверждено (есть партнёрская страница Twinfield [17]) | ИИ «в планах» (раунд 2024) [18] | нет данных | да [16] | «официальные последние напоминания», SmartCollect в лимите тарифа [15] | SMS [19] |
| **Onguard (Visma)** | NL | mid и enterprise, много юрлиц [20] | по запросу [20] | SAP, Dynamics, Oracle, AFAS, Exact [20] | ассистент «Guardian», слабо [20] | нет данных | нет данных | нет данных | нет данных |
| **Agicap (CashCollect)** | FR | PME / ETI [21] | по запросу [21] | через API / SFTP; список ERP на странице не подтверждён | да: ИИ-агент пишет напоминания с тоном по истории оплат [22] | нет: спор ставится вручную и останавливает напоминания [21] | да [21] | заказные письма, путь к injonction de payer [21] | заказное письмо (lettre recommandée) [21] |
| **Sidetrade** | FR | enterprise: 85% выручки от клиентов с оборотом > $1bn [23] | по запросу | крупные ERP | да | **да**: агент Aimie Cash Collection «ведёт переписку с должниками… обновляет записи» [23] | да | нет данных | нет данных |
| **HighRadius** | US | mid и enterprise | по запросу, в модели оплаты за результат (outcome-based) [24] | крупные ERP | да | да (агентная платформа) [24] | да | нет данных | нет данных |
| **Billtrust** | US | mid и enterprise | по запросу | крупные ERP | да: Agentic Email (07.2025) [25] | споры (Cases) [25]; адаптивные цепочки (11.2025) [26] | да | нет данных | нет данных |
| **Esker** | FR | mid и enterprise | по запросу | крупные ERP | да, ответы с проверкой человеком [27] | классификация входящих писем (NLP) [27] | да | нет данных | нет данных |
| **Quadient AR (YayPay)** | US / FR | mid | по запросу; сторонние оценки «от ~$500/мес» [28] | нет данных | нет данных | нет данных | да | нет данных | нет данных |
| **Invoiced (Flywire)** | US | mid B2B | по запросу [29] | NetSuite, Dynamics, Sage Intacct, QBO, Xero [29] | да: агент пишет коммуникации [29] | нет данных | да (SEPA, Bacs) [29] | нет данных | нет данных |
| **Tesorio** | US | mid и enterprise (клиенты: Slack, Box, Twilio) [30] | по запросу | нет данных | нет данных | нет данных | нет данных | нет данных | нет данных |
| **collectAI (Aareal)** | DE | B2C с большим объёмом: e-commerce, энергетика, телеком [31] | по запросу | нет данных | ИИ-оптимизация напоминаний [31] | нет данных | да | до взыскания включительно [31] | омниканально [31] |
| **Xero (встроено)** | NZ | SMB | входит в подписку | — | JAX (ИИ-агент Xero) ищет просроченные счета; follow-up «coming soon» [32] | нет | кнопка оплаты в выписке [32] | нет | нет; максимум **5 напоминаний** [33] |
| **QuickBooks Online (встроено)** | US | SMB | входит в подписку | — | Payments AI и Payments Agent, **только для US-аккаунтов** [34] | нет данных | QB Payments | автоматические пени в UK-версии недоступны [34] | до 3 напоминаний [34] |
| **Sage (встроено)** | UK | SMB | Copilot в подписке | — | Copilot: массовые напоминания после согласия пользователя; Payments Agent в Sage Sole Trader (02.2026) [35] | нет данных | нет данных | нет | нет данных |
| **Exact Online (встроено)** | NL | SMB | модуль Debiteurenbeheer | — | нет данных | нет данных | нет данных | нет данных | нет данных [36] |
| **DATEV (встроено)** | DE | SMB через налоговых консультантов | в составе Mittelstand Faktura | — | нет | нет | нет | трёхступенчатое Mahnwesen, пени и проценты [37] | письмо / email [37] |
| **Cleavr** (новый) | FR | SME и mid [38] | не опубликована | Pennylane, SAP, NetSuite [38] | да | **да**: делит ответы на «оплачено / спор / трудности» и меняет тактику [38] | да [38] | нет данных | SMS, **WhatsApp**, голос [38] |
| **Paraglide** (новый) | SE / UK | средние и крупные компании [39] | не опубликована | нет данных | да | **да**: отвечает в существующих цепочках писем, закрывает вопросы и споры [39] | нет данных | нет данных | нет данных |
| **Donnerstag.ai** (новый) | DE | поставщики, DACH [40] | не опубликована | ERP и банки [40] | фокус на сверке, а не на напоминаниях [40] | нет | нет | нет | нет |
| **AgentCollect** (новый, YC S23) | US | B2B, взыскание старых долгов, Fortune 500 [41] | не опубликована | Xero (OAuth) [42] | да | да | да [41] | **да**: требования через юристов, но только в США [41] | ИИ-звонки, SMS [41] |

Проверенные имена из списка, которые не подходят или не существуют:
- **Fluidly**: закрыт в апреле 2023 после покупки банком OakNorth [43].
- **Debitoor**: закрыт, пользователей перевели на SumUp Invoices [44].
- **Fygr**: переименован в **Okimia**, это казначейство и прогноз денежного потока без напоминаний клиентам [45].
- **Bilendi**: компания маркетинговых исследований (панели, опросы), к дебиторке отношения не имеет [46].
- **«Satchel»**: в нише дебиторки такой продукт не найден. Поиск выдаёт **Satago**, его я и разобрал. Если имелся в виду другой продукт, **не подтверждено**.
- **«Getpaid»**: getpaid.io из Дюссельдорфа делает платежи для маркетплейсов, не дебиторку [47]. Во французском поиске рядом всплывает **Respaid** (взыскание небольших долгов с помощью ИИ) [47].

---

## 2. Разделы по игрокам

### Chaser (UK): главный конкурент для SMB в UK
- Сайт: https://www.chaserhq.com. Цены: https://www.chaserhq.com/pricing
- Тарифы [1]:
  - **Compact** от £199 / €239 в мес.: 4 пользователя, 4 цепочки, для оборота < £4m.
  - **Core** £599 / €719: без лимитов, несколько юрлиц, оборот < £10m.
  - **Complete** £899 / €1,079: оборот < £100m.
  - Скидка 10% при оплате за год.
  - Отдельная платная услуга «Chaser Care»: выделенный специалист по дебиторке ведёт споры и почтовый ящик [1].
- Интеграции: Xero, QuickBooks, Sage, NetSuite, Dynamics 365, SAP и ещё 20+ [1]. DATEV и Exact на странице цен не названы.
- ИИ: «AI email generator» с июля 2025. Читает письмо должника, определяет намерение (promise-to-pay, dispute, document request) и предлагает ответ со ссылкой на портал. Отправляет человек [2]. **Что цепочка сама перестраивается после ответа, на странице не сказано** [2].
- Досудебка: эскалация в один клик в собственную службу взыскания по no-win-no-fee [3]. Ранее партнёром по взысканию указывали Debitura, по сторонним данным (не подтверждено напрямую).
- Каналы: SMS, автоматические звонки, бумажные письма [1]. WhatsApp только через интеграцию Saysimple [4].
- Отзывы:
  - Capterra: 4.9, 45 отзывов. Минус, прямо про наш сценарий: *«When our clients respond to chaser emails, we cannot reply directly.»* [48]
  - Xero App Store: 5.0 при 374 отзывах, негатива нет [49].
- Инвестиции: $4m / £3m growth-раунд в ноябре 2019, ведущий инвестор Fuel Ventures [50]. Более свежих раундов не найдено.

### Upflow (FR / US)
- Сайт: https://upflow.io. Цены: https://upflow.io/pricing, все тарифы **по запросу**. Тарифная сетка по объёму выставленных счетов: Starter до $10m, Grow до $25m и выше. Места для пользователей не ограничены [5].
- Интеграции: QBO, Xero, Pennylane (Starter); NetSuite, Sage Intacct, Slack (Grow+); HubSpot (Scale+); Salesforce (Accelerate+) [5].
- ИИ: **Collection Agent**. Отвечает на письма, фиксирует обещания оплатить и споры. У каждого навыка свой режим: выкл., «предлагает, человек одобряет», автономно. При обещании оплатить напоминания по клиенту встают на паузу (включено по умолчанию) [6]. Агент доступен **с тарифа Scale** (объём счетов до $50m) [5]. Для SMB это дорого и недоступно.
- Каналы: email, SMS, звонки, бумажные письма. SMS и звонки оплачиваются по использованию [5]. Slack работает как канал уведомлений, одобрения там нет [7].
- Отзывы: Capterra 4.5, 15 отзывов: *«The engineering team never completed one of my feature requests…»*; *«It is quite difficult, at the beginning, to put the email in each invoice sending.»* [51]
- Инвестиции: всего $22.85m, последний раунд Series A-II на $5m в апреле 2024 [52].

### Kolleno (UK)
- Сайт: https://www.kolleno.com. Цены: https://www.kolleno.com/pricing
- BusinessPay **$650/мес** ($545 при оплате за год), для оборота > $1m. Business Plus $1,245/мес ($995 за год), в нём «AI Agent Support». Enterprise по запросу [9].
- Интеграции: Xero, QBO, Sage Intacct; NetSuite / SAP / Oracle на Enterprise [9].
- ИИ: агенты работают по кредитной политике клиента в трёх режимах: только подсказки, copilot, полная автоматизация [10]. Детали разбора ответов не опубликованы. В тарифе есть «collections inbox management» [9].
- Отзывы: Xero App Store 5.0, 18 отзывов, негатива нет [53].
- Инвестиции: seed $5.4m, март 2022, Лондон [8].

### Paidnice (Xero-экосистема)
- Сайт: https://www.paidnice.com. Цены: https://www.paidnice.com/pricing
- Essentials **£49 / €59 / $69 в мес.**: 150 счетов, 2 пользователя. Pro тарифицируется по числу счетов, от $99 до $799. Custom от $999 [11].
- Сильная сторона: автоматические пени и проценты, графики платежей, выписки [11][12]. «Xero Global Small Business App of the Year 2025» [12].
- ИИ-функций и разбора ответов на странице цен нет.
- Отзывы: Capterra 4.9 (14), минус *«Some features like bulk late fee removal could be helpful»* [54]; Trustpilot 4.7 (29), негатива нет [55].
- Инвестиции: на странице Xero описан как «small, bootstrapped team» [56].

### Satago (UK)
- Сайт: https://www.satago.com. Цены: https://www.satago.com/pricing
- Basic £45, Premium £80, Platinum £200 в мес. Упор на кредитные отчёты, напоминания и финансирование под счета [13].
- Lloyds в 2022 вложил £5m за 20% компании, а в июле 2024 расторг лицензионный договор [57].

### Payt (NL)
- Сайт: https://paytsoftware.com. Цены: https://paytsoftware.com/pricing/
- €39.95 (30 счетов), €69.95 (75), €159.95 (250 счетов в мес.), неограниченное число пользователей, выше по запросу [15].
- Интеграции: SAP, NetSuite, Xero [16]. Партнёрства с Twinfield (Wolters Kluwer) [17] и Yuki [58].
- Инвестиции: **€55m от Partech (07.2024)**. Деньги идут в том числе на «ИИ для коммуникации с клиентами» [18]. Это самый прямой будущий конкурент в Бенилюксе.

### Onguard (NL, в составе Visma)
- Сайт: https://www.onguard.com. Mid и enterprise, работает с несколькими ERP сразу (SAP, Dynamics, AFAS, Exact), делает ставку на контроль команды, а не на ИИ [20].
- Visma купила Onguard у Main Capital в марте 2020. 600+ компаний-клиентов [59].

### Agicap CashCollect (FR)
- Сайт: https://agicap.com/fr/produits/poste-client/. Цена по запросу.
- ИИ-агент пишет напоминания массово, тон меняется от вежливого до формальной претензии в зависимости от истории оплат [22].
- Заказные письма, портал, отметка спора вручную, путь к injonction de payer [21].
- По данным самого Agicap, за первый год через CashCollect собрано €300m [22].

### Libeo (FR)
- Сайт: https://libeo.io. Основной продукт — оплата счетов поставщиков. Напоминания по счетам клиентам доступны через синхронизацию с QuickBooks [60].
- Купили TrackPay, инструмент для отправки счетов, напоминаний и оплат [61]. Цена на проверенных страницах не найдена.

### Enterprise-сегмент (для SMB 10–200 человек нерелевантен по цене и внедрению)
- **Sidetrade** (FR, листинг на Euronext):
  - Агент Aimie Cash Collection уже в работе. Ещё три агента (сверка платежей, споры, кредитный анализ) выходят до Q3 2026 [23].
  - 85% выручки от клиентов с оборотом больше $1bn [23].
  - В 10.2025 купил австралийский ezyCollect (SMB-сегмент) за €37.3m [62]. Это сигнал, что enterprise-игроки идут вниз в SMB.
- **HighRadius** (US): модель оплаты за результат, ИИ-агенты на весь процесс order-to-cash (от заказа до поступления денег) [24].
- **Billtrust** (US):
  - Куплен EQT за $1.7bn в 2022 [63].
  - Agentic Email и Cases (разбор споров) вышли в 07.2025 [25]; Collections Agentic Procedures в 11.2025 [26].
- **Esker** (FR):
  - Куплен Bridgepoint и General Atlantic, оценка €1.6bn, 02.2025 [64].
  - Synergy AI классифицирует входящие письма и предлагает ответы, человек проверяет [27].
- **Quadient AR (YayPay)**: Quadient объявил покупку в 07.2020 [65]. Прайса нет [28].
- **Invoiced**: куплен Flywire за $55m в 08.2024 [66].
- **Tesorio** (US): Series B $17m в 07.2022, всего $37.6m [30].
- **collectAI** (DE): основан в Otto Group, в 03.2022 куплен Aareal Bank [31]. Работает на B2C с большим объёмом (e-commerce, коммунальные услуги), для B2B SMB не подходит.

### Встроенные модули учётных систем
- **Xero**:
  - Не больше 5 автоматических напоминаний. Запрос пользователей с 2022 года (41 голос) в статусе «In development» на 31.08.2026.
  - Xero обещает «персональные планы напоминаний по истории оплат… persistent chasing until payment» [33].
  - Цитата пользователя: *«More than 80% of our invoices are paid late and sometimes we have to send up to 10 reminders over the course of 3-4 months»* [33].
  - JAX (ИИ-агент Xero на Claude) находит просроченные счета; напоминания пока «coming soon» [32][67].
  - **Главная угроза для недорогих надстроек над Xero в 2026–2027.**
- **QuickBooks Online**: до 3 напоминаний. Payments AI и Payments Agent доступны только для US-аккаунтов. В UK нет автоматических пени [34].
- **Sage**:
  - В Sage 50 автоматических напоминаний без Copilot нет. Сама Sage на форуме советует ставить Satago [68].
  - Copilot в Sage Accounting рассылает массовые напоминания только после согласия пользователя [35].
- **Exact Online**: модуль Debiteurenbeheer с 2022 года, автоматические напоминания [36]. ИИ не подтверждён.
- **DATEV**: трёхступенчатое Mahnwesen в Mittelstand Faktura [37]. В DATEV Unternehmen online своего модуля напоминаний нет, это видно по ветке сообщества [69]. ИИ нет.

### Новые ИИ-стартапы 2024–2026
1. **Cleavr** (Париж, основан в 2025):
   - Pre-seed €1m, 19.03.2026. Инвесторы: Kima Ventures, среди бизнес-ангелов CFO Pennylane [70].
   - Функции: делит ответы на «оплачено / спор / трудности» и сам меняет тактику, каналы email, SMS, WhatsApp и голос, портал должника, этапы до «Pré-légal / Légal» с сетью юристов по Европе. Языки FR/EN/ES/DE. Интеграции Pennylane, SAP, NetSuite, Sage, Xero, Odoo, Slack, Teams и др. [38]. Работает «en totale autonomie, sans intervention humaine».
   - **Прямой конкурент**: закрывает разбор ответов и досудебку. Отличие от нас — ставка на полную автономию без одобрения человеком; цена не опубликована.
2. **Paraglide** (Мальмё / Лондон):
   - Seed $5m (€4.2m) 29.01.2026, ведущие инвесторы Bessemer и DN Capital [39].
   - Агенты отвечают в существующих цепочках писем, закрывают вопросы и споры.
   - Целится в средние и крупные компании, клиенты Choco, Ardoq [39].
3. **Donnerstag.ai** (Франкфурт, основан в 2025):
   - Seed €4.3m, ведущий инвестор Speedinvest, 11.2025 [40].
   - Делает сверку и защиту поставщиков от недоплат, а не цепочки напоминаний.
4. **AgentCollect** (YC S23, США):
   - ИИ-агенты «один на аккаунт»: звонки, SMS, email, требования через юристов в 50 штатах [41]. Подключается к Xero по OAuth [42].
   - Судя по всему, связан с Respaid: основатель и год основания совпадают [47][41]. Это **не подтверждено**.
   - Для UK и ЕС досудебная часть не адаптирована.
5. **Zalos** (Лондон / Сан-Франциско, основан в 2025):
   - Seed €3.1m, 03.2026 [71].
   - «Computer agents» входят в ERP по логину и паролю. Это общая финансовая автоматизация, не узко дебиторка.

---

## 3. Где пустое место: что никто не делает хорошо для SMB на 10–200 сотрудников

1. **Разбор ответов с изменением цепочки есть только в дорогих тарифах.**
   - У Upflow это агент со Scale+ (объём счетов до $50m) [5][6].
   - У Sidetrade, Billtrust, Esker и HighRadius это enterprise-продукты [23][25][27][24].
   - Chaser за £199–599 определяет намерение и **предлагает** ответ, но сам цепочку не перестраивает [2]. Его клиенты жалуются, что на ответы должников нельзя ответить прямо из сервиса [48].
   - **Исключение — Cleavr** (проверено по сайту 30.09.2026 [38]): «Cleavr Intelligence lit chaque réponse, qualifie la situation, et agit» — «OK pour payer → Suivi J+3», «Contestation → Pause + alerte équipe», «Difficulté de trésorerie → Proposition échéancier». Цена не опубликована, поэтому попадает ли он в £200–600/мес — **не подтверждено**.
2. **Одобрения в мессенджере нет ни у кого.**
   - Все проверенные продукты работают через собственный веб-кабинет.
   - Slack у Upflow только для уведомлений [7]. Teams, WhatsApp и Telegram как интерфейс одобрения не найдены ни у одного игрока.
   - Для фаундера или операционного директора компании на 30 человек, у которого нет отдельного кредит-контролёра, это ключевая разница.
   - Cleavr позиционируется наоборот: «Fonctionne en totale autonomie, sans intervention humaine» [38]. Slack и Teams есть в списке интеграций, но как интерфейс одобрения писем на сайте не описаны — **не подтверждено**, проверить на демо.
3. **Досудебные документы по местному праву ЕС и UK — слабое место почти у всех.**
   - У Chaser есть передача в свою службу взыскания [3], у Agicap заказные письма и путь к injonction de payer [21], у DATEV трёхступенчатое Mahnwesen [37].
   - У AgentCollect требования через юристов только в США [41].
   - **Cleavr** ведёт до суда: этапы «Rappel — Qualif. — Amiable — Ferme — Pré-légal — Légal», сеть «huissiers et d'avocats présents dans toute l'Europe», языки FR/EN/ES/DE и «réglementation adaptés à chaque pays» [38]. Генерирует ли он сам документы (mise en demeure, letter before claim) и считает ли законные проценты и компенсацию €40/£40–100 — на сайте не сказано, **не подтверждено**.
   - Незанятая ниша:
     - UK: letter before claim по Pre-Action Protocol и начисление процентов по Late Payment Act.
     - DE: 3. Mahnung и заявление на gerichtliches Mahnverfahren.
     - NL: 14-дневное письмо по WIK.
     - FR: mise en demeure.
   - Это гипотеза. Сами требования законов в этом исследовании не проверялись.
4. **DACH и Бенилюкс на DATEV / Exact / Twinfield покрыты напоминаниями без ИИ.**
   - DATEV: трёхступенчатое Mahnwesen, без ИИ [37]. Exact Online: модуль Debiteurenbeheer, ИИ не подтверждён [36]. Twinfield: через партнёра Payt [17].
   - Payt с €55m на ИИ сюда идёт, но пока это обещание [18].
   - ИИ-агента поверх DATEV для немецкого Mittelstand не найдено: Donnerstag.ai делает сверку, а не переписку [40].
5. **Угроза снизу — сами учётные системы.**
   - Xero официально разрабатывает «persistent chasing» и персональные планы напоминаний [33], JAX на Claude [67].
   - Sage уже выпустил Payments Agent [35], QuickBooks — Payments Agent в США [34].
   - Простые напоминания «по расписанию» станут бесплатными. Защищённая ценность — разбор ответов, споры, досудебная работа и живой человек в цикле через мессенджер.
6. **Сигнал о цене.** Самые дешёвые решения, Paidnice (£49) и Satago (£45), ИИ не заявляют [11][13]. Chaser начинает с £199 [1], Kolleno с $650 [9]. Коридор **£200–600/мес за «агента с одобрением в чате»** на рынке свободен. Это оценка по публичным прайсам, а не проверенный спрос.

---

## Источники

1. https://www.chaserhq.com/pricing (30.09.2026)
2. https://www.chaserhq.com/features/ai-email-generator ; https://www.chaserhq.com/blog/ai-writes-debtor-email-replies-for-you-in-chaser-ai-email-generator
3. https://www.chaserhq.com/debt-collections
4. https://www.saysimple.com/integrations/chaser
5. https://upflow.io/pricing
6. https://docs.upflow.io/en-us/collection-and-collaboration/emails/collection-agents
7. https://docs.upflow.io/en-us/integrations/slack/connect-upflow-with-slack
8. https://www.venturecapitaljournal.com/fintech-startup-kolleno-takes-in-5-4m-seed/ (08.03.2022)
9. https://www.kolleno.com/pricing
10. https://www.kolleno.com/
11. https://www.paidnice.com/pricing
12. https://apps.xero.com/uk/app/paidnice
13. https://www.satago.com/pricing
14. https://apps.xero.com/za/function/debtor-tracking/app/satago
15. https://paytsoftware.com/pricing/
16. https://docs.paytsoftware.com/product/what-is-payt
17. https://www.wolterskluwer.com/nl-nl/solutions/twinfield-accounting/payt
18. https://paytsoftware.com/blog/payt-accelerates-european-expansion-with-strategic-investment-of-55m-from-partech ; https://siliconcanals.com/dutch-payt-secures-55m/
19. https://paytsoftware.com/frequently-asked-questions/
20. https://www.onguard.com/best-credit-management-software/
21. https://agicap.com/fr/produits/poste-client/
22. https://agicap.com/fr/fonctionnalites/relance-paiements-en-retard/ ; https://agicap.com/fr/article/cashcollect-un-an/
23. https://itbrief.co.uk/story/sidetrade-launches-ai-native-plan-with-three-new-products (10.04.2026)
24. https://www.highradius.com/resources/Blog/cost-vs-value-finding-the-right-partner-for-your-accounts-receivables-objectives/ ; https://aiagentrank.io/agent/highradius/pricing
25. https://www.cpapracticeadvisor.com/2025/07/24/billtrust-launches-new-ai-powered-accounts-receivable-innovations/164930/
26. https://www.crowdfundinsider.com/2025/11/255391-billtrust-launches-agentic-collections-tool/
27. https://www.esker.co.nl/esker-synergy-ai/ ; https://www.esker.com/ai
28. https://erpresearch.com/erp-add-ons/ar-collections/quadient-ar/pricing
29. https://www.invoiced.com/pricing
30. https://www.fintechfutures.com/baas/accounts-receivables-platform-tesorio-bags-17m-in-series-b-round (07.07.2022)
31. https://app.dealroom.co/companies/collectai ; https://www.boersen-zeitung.de/kompakt/neue-leitung-bei-aareal-bank-fintech-collectai-6f0d5194-65b7-11ed-a8ee-76a419d2158f
32. https://cfotech.asia/story/xero-adds-ai-invoicing-tools-to-help-payments-land (26.02.2026)
33. https://productideas.xero.com/forums/939198-for-small-businesses/suggestions/45148357-invoice-reminders-increase-of-reminders-that-c
34. https://thecfoclub.com/partner-spotlight/intuit-quickbooks-online/how-to-automate-payment-follow-ups-in-quickbooks-payments/ ; https://quickbooks.intuit.com/learn-support/en-uk/other-questions/add-interest-on-overdue-invoices/00/1050969
35. https://startups.co.uk/accounting/ai-invoicing/ ; https://www.sage.com/investors/investor-downloads/press-releases/2026/02/sage-copilot-brings-ai-powered-support-for-invoicing-and-payment-chasing-to-sage-sole-trader/
36. https://www.accountancyvanmorgen.nl/2022/05/24/exact-introduceert-geautomatiseerde-oplossing-voor-debiteurenbeheer/
37. https://www.datev.de/web/de/unternehmen/loesungen/rechnungswesen/mahnen-und-zahlen/optimiertes-und-digitales-mahnwesen
38. https://www.cleavr.fr/
39. https://techsavvy.media/en/malmoe-startup-lands-major-investment-to-automate-ar-with-ai-agents/ (29.01.2026)
40. https://www.starting-up.de/news/news-investments/donnerstagai-erhaelt-43-mio-euro-seed-finanzierung.html ; https://www.eu-startups.com/2025/11/frankfurt-based-accounts-receivable-platform-donnerstag-ai-raises-e4-3-million-to-expand-across-dach/
41. https://www.ycombinator.com/companies/agentcollect/jobs ; https://invoice.boostly.com/blog/best-ai-debt-collection-software (описание AgentCollect)
42. https://invoice.boostly.com/integrations/xero
43. https://fintech-alliance.com/news-insights/article/oaknorth-set-to-close-fluidly-following-2021-acquisition
44. https://debitoor.com/features/extras/support
45. https://www.okimia.com/ (редирект с fygr.io)
46. https://live.euronext.com/en/products/equities/company-news/2025-03-26-bilendi-record-results-2024
47. https://seedtable.com/startups/getpaid-io ; https://www.maddyness.com/2023/03/14/respaid-recouvrement/
48. https://www.capterra.com/p/157101/CHASER/reviews/
49. https://apps.xero.com/uk/app/chaser/reviews
50. https://tech.eu/2019/11/11/chaser-4-million-help-smes-unpaid-invoices/ ; https://fintech.global/2019/11/11/chaser-collects-3m-in-growth-funding-led-by-fuel-ventures/
51. https://www.capterra.co.za/reviews/193097/upflow
52. https://www.cbinsights.com/company/upflow-1/financials ; https://siliconcanals.com/crowdfunding/upflow-raises-15m/
53. https://apps.xero.com/uk/app/kolleno/reviews
54. https://www.capterra.ie/software/1032423/paidnice
55. https://no.trustpilot.com/review/paidnice.com
56. https://apps.xero.com/au/app/paidnice
57. https://thefintechtimes.com/all-the-very-best-says-lloyds-as-it-terminates-satago-contract/
58. https://paytsoftware.com/partners/yuki/
59. https://thefintechtimes.com/visma-continues-strong-growth-in-the-netherlands-by-acquiring-onguard-leader-in-order-to-cash-solutions/ (16.03.2020)
60. https://quickbooks.intuit.com/fr/applications/libeo/
61. https://www.cfnews.net/L-actualite/M-A-Corporate/Operations/100/Libeo-s-offre-une-solution-d-encaissement-370129
62. https://cfotech.com.au/story/sidetrade-acquires-ezycollect-to-expand-ai-order-to-cash-in-apac
63. https://www.businesswire.com/news/home/20220928005565/en/
64. https://finder.techleap.nl/news/feed/bridgepoint-acquires-92-93-of-esker-shares
65. https://finance.yahoo.com/news/quadient-announces-acquisition-leading-fintech-170000344.html
66. https://www.fintechfutures.com/b2b-b2c-payments/flywire-acquires-invoiced-to-enhance-b2b-payments-and-software-capabilities
67. https://itp.nz/techblog/just-ask-xero-software-giant-takes-the-plunge-into-generative-ai
68. https://communityhub.sage.com/gb/sage-50-accounts/f/general-discussion-uk/257025/automatically-chase-overdue-invoice-payments-without-copilot
69. https://www.datev-community.de/t5/Unternehmen-online/Mahnung-erstellen/m-p/71342
70. https://raising.fi/news/cleavr-pre-seed-march-2026-1 ; https://www.maddyness.com/2026/03/20/les-startups-francaises-ont-leve-75-millions-deuros-cette-semaine/
71. https://www.eu-startups.com/2026/03/londons-zalos-raises-e3-1-million-seed-to-bring-ai-agents-to-enterprise-finance-workflows/

### Ограничения
- G2 и часть eu-startups / AccountingWEB отдали 403, поэтому отзывы взяты с Capterra, Xero App Store и Trustpilot. В нишевых SMB-инструментах негатива почти нет (Chaser 5.0 при 374 отзывах в Xero), так что «боль из отзывов» здесь слабый сигнал.
- Страницы продуктов пересказывала вспомогательная модель при загрузке. Формулировки о функциях стоит перепроверить на демо, особенно у Kolleno, Agicap и Cleavr.
- Цены Upflow, Onguard, Agicap, Sidetrade, HighRadius, Billtrust, Esker и новых стартапов не опубликованы. Я их не додумывал.
