# NX-3. Подключение к электросети (interconnection / технологическое присоединение): есть ли продуктовая зона для софтверной команды без физических моделей сети

Дата: 01.09.2026. Приоритет источникам 2025–2026.
Заказчик: студия ИИ-разработки без железа и без физических моделей сети; сильные стороны — документы, LLM, исследовательская методология.

---

## 0. Вердикт коротко

**Зона есть, но она узкая, и она сузилась за последние 18 месяцев.**

Разделение, которое надо держать в голове, — не «США vs Россия», а **«расчёт режимов» vs «допуск заявки к расчёту»**.

- **Расчёт режимов (power flow, устойчивость, короткие замыкания)** — закрыт для команды без физмоделей. Тут Siemens PSS/E, DIgSILENT PowerFactory, PowerWorld как формат-стандарт, и поверх них — Pearl Street/Enverus (SUGAR). Вход требует не «экспертизы по регламенту», а инженеров-режимщиков и валидированного солвера.
- **Допуск заявки — проверка комплектности, site control, титулов, соответствия тарифу, сроков, переписки** — это чистая работа с документами, и **это подтверждённое узкое место**: DOE говорит, что «свыше 90% получаемых заявок дефектны» ([DOE / APPA, 2024](https://www.publicpower.org/periodical/article/doe-offers-funding-accelerate-interconnection-process-through-utilization-artificial-intelligence)). Под это выделено $30 млн федеральных денег (AI4IX).
- **Но именно в этой документной нише в декабре 2025 года развернулся Alphabet.** Tapestry (X moonshot) выкатила HyperQ в PJM: 811 заявок, 4 581 документ site control, медиана 6 мин 15 с на заявку против ~4 часов вручную ([Tapestry field notes, 2025–2026](https://www.tapestryenergy.com/en/projects/field-notes-hyperq-deployment-in-pjm-s-cycle-1)).

Для студии это значит: **на «большой» рынок США (7 RTO + крупные utility) заходить поздно и дорого; на «длинный хвост» (девелоперы, ТСО, консультанты, региональные utility) — можно, но это small business, а не венчурная история.** В России зона реальна и почти не занята качественным софтом, но покупателей физически мало и число их сокращается по государственному плану.

---

## 1. Из чего реально состоит процесс подключения (США)

### 1.1 Структура

По pro forma FERC (Order 2003 → Order 2023) последовательность такая:

1. Заявка на присоединение (interconnection request, IR) → попадание в очередь.
2. Серия исследований: feasibility / system impact / facilities study. После Order 2023 — **кластерное исследование** вместо последовательного.
3. Interconnection Agreement (IA) — договор между ISO/utility и владельцем генерации: режимы, ответственность за стоимость сетевых усилений.
4. Стройка → COD (commercial operation date).

Источник по цепочке и по тому, что большинство проектов отваливается на любом этапе: [LBNL, Seel, «Queued Up: Status and Drivers of Generator Interconnection Backlogs», 29.04.2025, слайд 2](https://solar-media.s3.amazonaws.com/assets/LSSUSA25/Marketing/Presentations/Interconnection%20Queues%20and%20Costs,%20Seel%204.29.2025%20public%20version.pdf).

### 1.2 Нормативные сроки после Order 2023

- Окно подачи заявок в кластер — **45 календарных дней**.
- Customer engagement window — **60 календарных дней**.
- Само кластерное исследование — **150 календарных дней** с момента закрытия engagement window.
- Рестади — ещё 150 дней.
- FERC **отменил стандарт «reasonable efforts»** и ввёл жёсткие дедлайны с денежными штрафами для transmission provider: **$1 000/раб. день** за просрочку кластерного исследования, **$2 000/раб. день** за рестади и affected system study, **$2 500/раб. день** за facilities study.

Источники: [FERC Order 2023 explainer](https://www.ferc.gov/explainer-interconnection-final-rule); [Troutman Pepper, сводка Order 2023](https://www.troutman.com/insights/troutman-pepper-summary-of-ferc-order-no-2023-on-generator-interconnection-reform/); [Climate Solutions Legal Digest, март 2024, про штрафы](https://www.climatesolutionslaw.com/2024/03/generator-interconnection-rule-ferc-provides-clarification-and-tweaks-to-order-no-2023/).

**Это важно для продуктовой логики:** с Order 2023 у оператора сети появился прямой денежный убыток от каждого просроченного дня. До этого мотивации ускоряться формально не было.

### 1.3 Насколько сроки в реальности разъезжаются с нормативом

Первичный документ — квартальная отчётность SPP по Order 845 в FERC (дело ER19-1954-000, подана 10.02.2026):

- SPP допустил просрочку по **Interconnection Facility Studies все четыре последних квартала** и по DISIS Phase Two — три квартала из четырёх.
- Средний срок выполнения DISIS Phase Two в отчётных кварталах — **452 дня и 490 дней** при нормативе 120 дней.
- Доля исследований, превысивших 120 дней, — **100% в трёх кварталах из четырёх**.

Источник: [SPP, Order 845 informational filing Q4 2025, февраль 2026 (PDF)](https://www.spp.org/documents/75953/20260210_order%20845%20informational%20filing%20q4%202025_er19-1954-000.pdf).

### 1.4 Объём очереди и сроки в целом

- На конец 2025 в очередях **~8 200 активных проектов**, **>2 060 ГВт** суммарно (1 312 ГВт генерации + ~749 ГВт хранения). Годом ранее — ~2 300 ГВт, то есть объём снизился на ~12% в основном за счёт отзывов, а не за счёт постройки. Источник: [LBNL, «Queued Up: 2026 Edition», июнь 2026](https://emp.lbl.gov/publications/queued-2026-edition-characteristics).
- Типичный проект, вышедший в эксплуатацию в 2024 году, провёл в очереди **~55 месяцев (4,5 года)**; медиана IR→COD выросла с <2 лет (проекты 2000–2007) до >4 лет (2018–2024). Источник: [LBNL, «Queued Up: 2025 Edition»](https://emp.lbl.gov/publications/queued-2025-edition-characteristics), медиана «приближается к 5 годам для завершённых в 2022–2023» — [Seel, 2025, слайд 12](https://solar-media.s3.amazonaws.com/assets/LSSUSA25/Marketing/Presentations/Interconnection%20Queues%20and%20Costs,%20Seel%204.29.2025%20public%20version.pdf).
- **Доля доходящих до эксплуатации крайне низка.** Из заявок 2000–2018: газ 31%, ветер 20%, солнце 13%, батареи 11%, солнце+батареи 10%. По мощности ещё ниже. Отзывается ~67–80% в зависимости от технологии. Источник: [Seel, 2025, слайды 8–9](https://solar-media.s3.amazonaws.com/assets/LSSUSA25/Marketing/Presentations/Interconnection%20Queues%20and%20Costs,%20Seel%204.29.2025%20public%20version.pdf).

**Смысл для продукта:** ~70–80% работы инженеров тратится на проекты, которые никогда не будут построены. Это и есть экономическое обоснование скрининга — но скрининг на «выживет ли проект» требует стоимости сетевых усилений, то есть физики.

### 1.5 Человеко-часы инженеров: что удалось и что не удалось найти

**Не нашёл** публичной агрегированной цифры «сколько человеко-часов стоит одно исследование». Причина структурная, и это важно:

FERC Order 845 обязывает transmission provider публиковать **суммарное число часов сотрудников и сторонних консультантов**, потраченных на interconnection studies, — но **только если** он просрочил более 25% исследований любого типа два квартала подряд. DOE прямо пишет, что эти отчёты «ограничены»: они про часы на исследования, а не на процесс целиком, и **не разделяют часы персонала оператора, подрядчиков и владельца сети**. Источник: [DOE i2X Transmission Interconnection Roadmap, апрель 2024, Solution 2.12, стр. 41](https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf).

DOE там же признаёт: **«национальных данных, чтобы оценить потребность в кадрах точнее, почти нет»**. То есть в отрасли нет самого базового измерения трудоёмкости — это и риск (нельзя посчитать ROI продукта), и возможность (сам факт измерения — продукт).

Косвенные количественные опоры:

| Показатель | Значение | Источник |
|---|---|---|
| Депозит за исследование (Order 2023 pro forma) | $5 000 заявка + $35 000 + $1 000/МВт (20–80 МВт); $150 000 (80–200 МВт); $250 000 (≥200 МВт) | [i2X Roadmap, сноска 46](https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf) |
| Депозит за исследование, MISO | от $50 000 до $640 000 в зависимости от мощности | там же |
| Депозит за исследование, SPP | от $25 000 до $90 000 | там же |
| Ручная проверка site control по одной заявке | ~**4 часа** (оценка Tapestry, вендорская) | [Tapestry, HyperQ в PJM Cycle 1](https://www.tapestryenergy.com/en/projects/field-notes-hyperq-deployment-in-pjm-s-cycle-1) |
| Заявка может быть объёмом до **6 000 страниц** | — | [Latitude Media / DCD о HyperQ, 2025](https://www.datacenterdynamics.com/en/news/google-backed-tapestry-completes-first-deployment-of-ai-platform-for-pjm-interconnection-application-process/) |

*Допущение:* депозит $25–640 тыс. за исследование — верхняя граница представления о стоимости инженерного труда на один проект; он покрывает не только труд. Точную структуру не нашёл.

### 1.6 Где на самом деле узкое место

DOE в i2X Roadmap называет три причины заторов: **рост числа заявок, неэффективность процессов и кадровые ограничения** ([i2X Roadmap, раздел 2](https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf)). Отдельно DOE фиксирует, что данные по стоимости и исследованиям «часто существуют только в формате PDF, что затрудняет доступ и анализ» (там же, стр. ~1912 текста) — это прямое указание на документную, а не расчётную природу части проблемы.

И самое конкретное:

> **«Некоторые организации указывают, что свыше 90% получаемых ими заявок на присоединение дефектны, и исправление этих заявок — существенная причина длительных задержек».**
> — [DOE, программа AI4IX, изложено в APPA, ноябрь 2024](https://www.publicpower.org/periodical/article/doe-offers-funding-accelerate-interconnection-process-through-utilization-artificial-intelligence)

---

## 2. Кто уже автоматизирует эту работу

### 2.1 Карта игроков

| Игрок | Что делает | Сторона рынка | Природа | Деньги |
|---|---|---|---|---|
| **Pearl Street Technologies** (SUGAR, Interconnect) | Ускорение расчётов режимов; «сокращение времени инженерного анализа до 200 раз»; обработано >300 ГВт очередей | Операторы сети + девелоперы | **Физика** | Основан 2018, финансировался в первую очередь **неразводняющими грантами NSF, ARPA-E, DOE, DARPA**; seed от Pear VC (2022), также VoLo Earth, Powerhouse, Incite. **Поглощён Enverus 13.03.2025, сумма не раскрыта** |
| **Nira Energy** | Prospecting (карта свободной мощности по подстанциям, оценка стоимости усилений) + In-Queue (сценарное моделирование движения по очереди) | Девелоперы | Данные + упрощённая физика | Прибыльна с 2021; >100 клиентов-девелоперов; поддержано >500 ГВт исследований. **Growth investment от Energize Capital, июнь 2025** |
| **GridUnity** | Interconnection lifecycle management: приём заявок, валидация данных, управление исследованиями, координация стройки; продукт GridSync под Order 2023 | Операторы сети / utility | **Процесс и документы** | **$49,5 млн федеральных денег (DOE GRIP), проект DIGITAL, общий бюджет $99 млн**, октябрь 2024 |
| **Clean Power Research (PowerClerk)** | Workflow-автоматизация заявок; **>3 млн проектов обработано**, 175+ программ utility; партнёрства с envelio и ScottMadden (2025) | Utility (в основном DER + large load) | **Процесс и документы** | Зрелый инкумбент, не стартап |
| **Tapestry (Alphabet X)** — **HyperQ** | Агентный ИИ читает заявки на присоединение и находит дефекты; site control validation | RTO (PJM) | **Документы. Прямо в целевой нише** | Alphabet moonshot; PJM-партнёрство объявлено апрель 2025, HyperQ выкатили декабрь 2025 |
| **Enverus** | Аналитика очередей (Interconnection Queue Outlook), PRISM; после покупки Pearl Street — ещё и расчёты | Девелоперы, инвесторы | Данные + физика | Крупная энергетическая data-компания |
| **Zonevex** | Парсинг лизов/опционов (Claude Vision OCR), расчёт покрытия участков через PostGIS, pass/fail по PJM Manual 14H 7.1.6, MISO Attachment Y, CAISO BPM; генерация Officer Certification пакетов | **Девелоперы** | **Чистые документы, без физики** | Публичных данных о раунде/команде **не нашёл**; выглядит как микрокоманда |
| **Paces** | Сайтинг и due diligence: зонирование, пермиты, экология, данные сети | Девелоперы | Данные | **$11 млн Series A**; ранее $1,9 млн pre-seed (Resolute Ventures); YC |
| **HData** | Regulatory AI по документам FERC и штатных регуляторов; >20 млн документов, анализ до 400 файлов за раз; Private Catalog для собственных документов клиента | Utility, регуляторы, аналитики | **Чистые документы** | Сумма раунда **не нашёл** |
| **Siemens PTI / PSS®E** (Gridscale X) | Стандарт де-факто: формат `.raw`/`.dyr` — обменный стандарт исследований присоединения; 2 000+ Python API; сети 200 000+ узлов | Планировщики сети | **Физика** | Siemens |
| **DIgSILENT PowerFactory**, **PowerWorld**, **ETAP** | Расчёт режимов, устойчивости, КЗ | Планировщики, девелоперы | **Физика** | Устоявшиеся вендоры |
| **Gridmatic** | **Не относится к теме.** Это AI-power marketer/трейдер: прогноз цен, оптимизация батарей; фонд на $50 млн под 500 МВт хранения в ERCOT/CAISO | Трейдинг | — | $50 млн (фонд, не венчур в софт) |

Ссылки: [Pearl Street/Enverus](https://www.enverus.com/newsroom/undo-the-queue-enverus-acquires-pearl-street-technologies-to-solve-for-a-more-reliable-resilient-grid/); [Pear VC о поглощении](https://pear.vc/pearl-street-technologies-is-acquired-by-enverus/); [Nira + Energize Capital, июнь 2025](https://www.prnewswire.com/news-releases/nira-energy-partners-with-energize-capital-to-scale-transmission-automation-software-302467710.html); [GridUnity $49,5 млн](https://www.gridunity.com/resources/gridunitys-digital-project-awarded-49-5-million-in-federal-funding-to-accelerate-grid-interconnection); [PowerClerk 3 млн проектов](https://www.cleanpower.com/2025/2025-to-date-milestones-innovations-and-customer-stories/); [Tapestry HyperQ](https://www.tapestryenergy.com/en/projects/field-notes-hyperq-deployment-in-pjm-s-cycle-1); [Zonevex](https://zonevex.com/blog/zonevex-vs-gridunity); [Paces Series A $11M](https://www.paces.com/news/paces-raises-11-million-to-accelerate-clean-energy-development); [HData](https://www.hdata.com/); [Siemens PSS®E](https://www.siemens.com/en-us/products/pss-software/gridscale-x-pss-e/); [Gridmatic](https://www.gridmatic.com/gridmatic-closes-50-million-energy-storage-fund-underscoring-importance-of-ai-to-optimizing-batteries/).

### 2.2 «PowerRunner»

**Не нашёл** продукта под названием PowerRunner в нише interconnection queue management. Возможна путаница с PowerClerk (Clean Power Research) или с PowerRunner LLC — консалтингом по utility-биллингу. Не подтверждаю существование такого игрока в этой нише.

### 2.3 Федеральные деньги как форма конкуренции

Два больших пула, оба идут мимо частного венчура:

- **AI4IX (DOE Office of Electricity, через ConnectWerx)** — **до $30 млн**, приём заявок закрыт 10.01.2025, отбор объявляли на «зиму 2025». Программа таргетирует **именно фазу подачи заявки**, а не расчёт сети: автоматизация приёма, верификация site control, прозрачность данных. Кто выиграл — **публичного списка победителей не нашёл**. Источники: [DOE AI4IX](https://www.energy.gov/oe/ai-interconnection-ai4ix), [ConnectWerx CWX-010-GDO](https://www.connectwerx.org/portfolio-items/ppo-cwx-010-gdo-accelerating-interconnection-through-ai-ai4ax/).
- **i2X iQMS (DOE)** — до **$11,2 млн** распредсетевым utility на пилоты софта для управления очередями DER/EV. Источник: [DOE i2X iQMS](https://www.energy.gov/cmei/i2x/i2x-innovative-queue-management-solutions-iqms-clean-energy-interconnection-and-0).

**Это опровержение для чисто венчурной логики:** покупатель в этой нише привык, что за софт платит федеральный бюджет, а не его собственный P&L.

---

## 3. Ключевой вопрос: есть ли продукты именно про документы и регламент, а не про расчёт режимов

**Да, есть. И зона в 2025–2026 из «свободной» стала «занимаемой».**

### 3.1 Подтверждения, что документная зона реальна

1. **DOE официально формулирует проблему как документную.** >90% заявок дефектны; AI4IX прямо про «review interconnection applications for the required site control documentation and flag errors within submitted supporting documents». Это не про потокораспределение.
2. **Tapestry HyperQ — доказательство, что LLM это решает.** Разворот в PJM Cycle 1:
   - 811 заявок на генерацию, ~220 ГВт;
   - **4 581 сырой документ site control** синтезированы в **2 328 юридически связных пакетов**;
   - **9 312 параллельных проверок** по четырём критериям OATT: срок договора, цепочка правопреемства (chain-of-title), эксклюзивность (ковенант землевладельца), минимальная площадь;
   - **медиана 6 мин 15 с** на заявку, 95-й перцентиль — 28 минут; ~**20× ускорение** против ручных ~4 часов;
   - на выходе — Application Readiness Report **со ссылками на конкретные страницы**, финальное решение остаётся за инженером.
   Источник: [Tapestry field notes](https://www.tapestryenergy.com/en/projects/field-notes-hyperq-deployment-in-pjm-s-cycle-1); подтверждение независимо: [Utility Dive](https://www.utilitydive.com/news/pjm-google-tapestry-grid-interconnection-ai/744982/), [DCD](https://www.datacenterdynamics.com/en/news/google-backed-tapestry-completes-first-deployment-of-ai-platform-for-pjm-interconnection-application-process/).
3. **Zonevex — существующий продукт-доказательство, что это делается малой командой.** Парсит лизы через Claude Vision OCR, считает покрытие участков в PostGIS, выдаёт pass/fail по конкретным пунктам тарифов и готовый пакет с Officer Certification. Физической модели сети внутри нет вообще. Позиционируется как «зеркало» GridUnity: GridUnity принимает заявки на стороне оператора, Zonevex производит доказательства на стороне заявителя.
4. **GridUnity и PowerClerk — это не расчётные, а процессные системы.** PowerClerk обработал >3 млн проектов чисто как workflow-движок. GridSync (GridUnity) — «централизация коммуникаций, валидации данных, управления исследованиями и координации стройки под Order 2023». Ни то, ни другое не считает режимы.
5. **HData** доказывает, что LLM-продукт по регуляторным документам энергетики продаётся utility и регуляторам как отдельная категория.

### 3.2 Опровержения — почему зона хуже, чем кажется

1. **Самый ценный кусок уже забрал Alphabet.** HyperQ работает у крупнейшего RTO Северной Америки. Tapestry заявляет партнёров в США, Великобритании, Чили, Новой Зеландии, Австралии, Бразилии. Конкурировать за оставшиеся 6 RTO против команды X с бесконечным капиталом и уже отработанным кейсом — плохая позиция для студии.
2. **Покупателей на стороне операторов — единицы.** 7 ISO/RTO + ~49 не-ISO балансирующих зон ([LBNL](https://emp.lbl.gov/queues)). Это не рынок, это список. Причём в нём уже сидят GridUnity (клиенты в 37 штатах, ~50% населения США) и PowerClerk (175+ программ).
3. **Продавать utility очень дорого и медленно.** Типичная воронка: **~6 месяцев до пилота и ~18 месяцев до контракта**; «pilot purgatory» — пилоты, которые не переходят в закупку и на которых стартапы теряют деньги; «cyber-risk-legal-procurement-IT сэндвич», где любой из барьеров убивает сделку. Источники: [Salesforce Ventures, гайд по продажам utility](https://salesforceventures.com/perspectives/utility-sales/); [Latitude Media о pilot purgatory](https://www.latitudemedia.com/news/pilot-purgatory-the-quintessential-definition-of-insanity/). Для студии без энергетического нетворка это фактически запретительно.
4. **Данные закрыты режимом CEII.** Модели и базовые кейсы — critical energy infrastructure information; доступ регламентирован. i2X прямо перечисляет «более последовательные процессы доступа к CEII-данным» как нерешённую проблему. Это операционный барьер и для разработки, и для демо.
5. **Экономика ниши маленькая.** Единственная найденная цифра по выручке чистого игрока: **Nira Energy — $3,6 млн ARR при оценке $10,8 млн (2024)** — [GetLatka](https://getlatka.com/companies/niraenergy.com). *Оговорка: GetLatka — вторичный агрегатор, не первичный источник; цифра ориентировочная.* Это при 100+ клиентах среди крупнейших девелоперов США, то есть при почти полном покрытии сегмента.
6. **Оценка рынка в $148 млн (2025) с ростом до $1,02 млрд к 2034** взята из [marketintelo.com](https://marketintelo.com/report/ai-grid-interconnection-queue-software-market/amp) — **это низкокачественный автогенерируемый market report, использовать нельзя.** Указываю только чтобы вы его не подобрали где-то ещё как «данные».

### 3.3 Была ли смерть или дешёвый выход в нише

Прямых банкротств не нашёл. Но есть два сигнала о низком потолке:

- **Pearl Street Technologies.** Технологический лидер расчётной части (SUGAR, «до 200× ускорение», >300 ГВт обработано, Startup of the Year по версии Mercom на RE+ 2024), поглощён **Enverus в марте 2025, сумма не раскрыта**. Ключевая деталь: инвестор Pear VC пишет, что компания финансировалась **прежде всего неразводняющими грантами NSF, ARPA-E, DOE и DARPA**, а seed от Pear зашёл только в начале 2022. То есть за 7 лет существования компания с лучшей технологией в нише не привлекла крупного венчурного раунда и вышла через поглощение отраслевым data-вендором без раскрытия суммы. *Допущение: нераскрытая сумма + грантовое финансирование + отсутствие поздних раундов — типичная сигнатура скромного выхода, не единорога. Прямого подтверждения размера сделки нет.*
- **Kevala** — соседняя ниша (grid analytics, поднимала $21 млн в 2021), **поглощена Residex в июне 2025**, сумма не раскрыта. [Crunchbase](https://www.crunchbase.com/organization/kevala).

**Вывод по разделу 3:** документная зона открыта технологически, но конкурентно и коммерчески она уже не «зелёное поле». Для студии без энергетического нетворка США — это не первый рынок.

---

## 4. Россия: технологическое присоединение

### 4.1 Как устроено

Базовый акт — **Постановление Правительства РФ № 861 от 27.12.2004** («Правила технологического присоединения…»), многократно изменявшееся; актуальная редакция — от 01.07.2026. [КонсультантПлюс](https://www.consultant.ru/document/cons_doc_LAW_51030/).

Процедура: заявка → договор ТП → технические условия (ТУ) → выполнение мероприятий сторонами → акт о ТП. Ключевой документ, который надо готовить и проверять, — **технические условия**; это текстовый инженерно-регламентный артефакт, не расчёт режима.

### 4.2 Нормативные сроки

| Категория | Срок |
|---|---|
| ЮЛ до 150 кВт; ФЛ до 15 кВт (при выполнении условий по расстоянию) | **6 месяцев** |
| До 670 кВт включительно | **4 месяца** (при отсутствии необходимости строительства сетей) |
| Свыше 670 кВт | **до 1 года и более**, зависит от необходимости стройки/реконструкции |
| Упрощённые случаи (0,4 кВ и ниже, ≤15 м до сетей, без согласований с третьими лицами) | **30 рабочих дней** |

Источники: [Правила ТП, ПП 861 (текст на сайте Россети Северо-Запад)](https://clients.rosseti-sz.ru/powergridconnection/gc_regulations/gc_rules/); [Гарант, разбор «три срока в договоре ТП»](https://www.garant.ru/ia/opinion/author/korobkova/1426113/).

*Оговорка: сроки многослойны и зависят от мощности, класса напряжения, расстояния и необходимости строительства. Приведённая таблица — упрощение; в конкретном кейсе надо смотреть текущую редакцию 861.*

### 4.3 Штрафуют ли за нарушение сроков — да, и системно

**Статья 9.21 КоАП РФ** — нарушение субъектом естественной монополии порядка подключения (техприсоединения):
- должностные лица — **10 000–40 000 ₽**;
- юридические лица — **100 000–500 000 ₽**;
- за повторное нарушение санкции выше.

[КоАП РФ ст. 9.21, КонсультантПлюс](https://www.consultant.ru/document/cons_doc_LAW_34661/6f859cc496d21336b64d302c2bb0511a24b0743f/).

Практика — реальная и массовая. Единственный найденный региональный срез с цифрами:

> Тюменское УФАС в части контроля доступа к сетям инженерно-технического обеспечения: **437 жалоб принято, 155 дел возбуждено, 145 постановлений о наложении штрафа**; ООО «Россети Тюмень» оштрафовано **на 92 млн ₽ за 2023 год**; в 2024 обращений было больше, чем в 2023.
> — [РБК Тюмень, 12.09.2024](https://t.rbc.ru/tyumen/12/09/2024/66e2c2fe9a79473d731b315b)

Отдельный пример: «Россети Центр и Приволжье» оштрафованы на **600 тыс. ₽** за нарушение сроков ТП по жалобе ООО «Мракаавто» ([Правда ПФО](https://pravdapfo.ru/news/rosseti-czentr-i-privolzhe-oshtrafovali-na-600-tysyach-rublej/)).

**Общероссийской агрегированной статистики по числу дел 9.21 за 2024–2025 не нашёл** — ФАС публикует «Доклады о состоянии конкуренции», но актуального среза с разбивкой по 9.21 найти не удалось. Есть только база решений `br.fas.gov.ru` с отдельными делами.

### 4.4 Объём заявок

Консолидированной цифры по группе «Россети» не нашёл. Есть по отдельным ДЗО за 2024:

| Компания | Заявок принято | Договоров заключено | Договоров исполнено |
|---|---|---|---|
| Россети Юг | 24 732 (2 325 МВт) | 15 187 (636 МВт) | 16 340 (481 МВт) |
| Россети Северо-Запад | — | — | 15 711 |
| Россети Московский регион | — | — | >73 000 потребителей, ~2,5 ГВт |

Источники: [Годовой отчёт Россети Юг 2024](https://ar2024.rosseti-yug.ru/ru/2/0/index.html); [Годовой отчёт Россети Северо-Запад 2024](https://ar2024rosseti-sz.ru/ru/strategic-report/perfomance-results); [Годовой отчёт Россети Московский регион 2024 (PDF)](https://www.akm.ru/upload/akmrating/Rosseti_MR_annual_report_2024.pdf).

*Допущение:* по порядку величины по всей группе «Россети» речь идёт о сотнях тысяч договоров ТП в год. Прямого подтверждения консолидированной цифры не нашёл — не используйте её как факт.

Косвенно масштаб подтверждает интегратор ИБР, заявляющий, что в его проекте автоматизации подачи и управления заявками ТП «в 10 субъектах РФ принято и обработано около **1 млн заявок ТП**» ([ИБР, кейс](https://ibsco.ru.com/keys/tekhnologicheskie-prisoedineniya/prisoedinenie-k-elektricheskim-setyam.html)) — **это вендорское заявление, не подтверждённый факт**.

### 4.5 ИТ-продукты для ТП в России — рынок занят, но занят слабо

Что есть:

- **Портал-тп.рф** — портал электросетевых услуг группы «Россети», сделан по поручению Минэнерго в рамках дорожной карты «Повышение доступности энергетической инфраструктуры». Плюс мобильное приложение «Россети» и региональные ЛК (например, [utp.rossetimr.ru](https://utp.rossetimr.ru/)).
- **«УТП» на платформе 1С:8** — формирование и учёт заявок ТП, формирование и учёт ТУ.
- **tp-seti.ru** — личный кабинет для ТСО: приём заявок, контроль сроков ТП, SMS-уведомления, ЭДО, интеграция с ЕПГУ.
- **so-online.ru** — ЛК сетевой организации, калькулятор стоимости ТП, раскрытие информации.
- **ИБР** — интегратор, кейсы по интеграции с Госуслугами по ПП №1125.

**Регуляторный форсирующий фактор:** **Постановление Правительства РФ № 1125 от 22.08.2024** (изменения в 861) — с **01.01.2026** все ТСО обязаны принимать и обрабатывать заявки на ТП через ЕПГУ (Госуслуги). Санкции за неисполнение по данным вендора: до **1 000 000 ₽** на юрлицо, до **50 000 ₽** или дисквалификация до 3 лет на должностное лицо, вплоть до утраты статуса ТСО. Источники: [ПП №1125, Гарант](https://www.garant.ru/products/ipo/prime/doc/409474791/); [разбор требований и санкций — tp-seti.ru](https://tp-seti.ru/blog/integratsiya-lichnogo-kabineta-s-epgu-dlya-territorialnykh-setevykh-organizatsiy-polnoe-rukovodstvo-/) — *санкционные суммы взяты из вендорского материала, первичной сверки по тексту КоАП/ПП не делал, проверяйте перед использованием.*

**Главное опровержение по России — покупателей становится меньше по плану государства.** Минэнерго целенаправленно сокращает число ТСО: цель — **400 организаций**, по 3–4 на регион. С 2022 года число ТСО уже снизилось **на 56%**. С 01.09.2024 действует закон о системообразующих ТСО — «одно окно» в каждом субъекте. Источники: [ТАСС, снижение на 56%](https://tass.ru/ekonomika/25445465); [ТАСС, планы Минэнерго](https://tass.ru/ekonomika/25408487); [smart-lab со ссылкой на Минэнерго (Медведева) о цели 400 ТСО в 2026](https://smart-lab.ru/blog/news/1220144.php).

Итого по России: **ниша с реальным болевым синдромом (штрафы за сроки, жалобы, обязательная интеграция с ЕПГУ), но с очень ограниченным и сжимающимся числом покупателей (≈400 ТСО + 15 ДЗО «Россети»), уже покрытых 1С-интеграторами и внутренними ИТ-службами.** Ни один найденный продукт не использует LLM для работы с содержанием ТУ, договоров и переписки — они все workflow/ЭДО. Это единственная реальная щель.

---

## 5. Нужна ли физическая модель сети — честный ответ

**Разделю по продуктовым классам.**

### Нужна обязательно (зона закрыта для команды без экспертизы)

- Расчёт стоимости сетевых усилений и, следовательно, любой продукт вида «доживёт ли проект до IA» / «сколько будет стоить подключение здесь». Это ядро ценности Nira и Enverus.
- Ускорение самих исследований (SUGAR) — это численные методы решения power flow, а не языковая задача.
- Оценка доступной мощности (hosting capacity, свободная мощность подстанции) — физика.
- В России: содержательная проверка ТУ по существу («хватит ли мощности», «правильно ли выбрана точка присоединения»).

**Ключевое подтверждение, что LLM тут не замена, а обёртка:** академическая работа **Grid-Mind (arXiv 2602.20683, февраль 2026, M. Shamseldein)** — «LLM-Orchestrated Multi-Fidelity Agent for Automated Connection Impact Assessment» — **прямо не утверждает, что LLM заменяет симуляцию**. LLM в ней декомпозирует задачу и оркеструет вызовы валидированных солверов (PSE, ParaEMT), а сами расчёты делает физический движок. [arXiv](https://arxiv.org/pdf/2602.20683).

### Не нужна (зона открыта)

- Проверка комплектности и дефектности заявки: сроки договоров аренды/опциона, цепочка правопреемства, эксклюзивность, площадь, соответствие пунктам тарифа. Это HyperQ и Zonevex — там нет физики.
- Сборка и валидация пакета документов на стороне заявителя (Officer Certification, evidence package).
- Извлечение структурированных данных из PDF-исследований и договоров (DOE отдельно жалуется, что данные «существуют только в PDF»).
- Трекинг сроков и обязательств, генерация уведомлений о дефектах со ссылками на страницы.
- В России: контроль сроков по 861, автогенерация проектов ТУ по шаблонам и прецедентам, разбор входящей переписки, подготовка позиции по жалобам в ФАС.

### Честный барьер, который надо назвать вслух

**Даже в «документной» зоне продавать придётся инженерам-энергетикам, и без человека с отраслевой репутацией сделки не будет.** HyperQ выдаёт не решение, а «Application Readiness Report со ссылками на страницы, чтобы инженеры сети принимали финальное решение» — то есть продукт живёт внутри инженерного процесса, и вход в этот процесс требует доверия. Плюс CEII-режим на данных. **Это не техническая, а доступовая преграда, и она для студии без энергетического партнёра выше, чем отсутствие физмодели.**

---

## 6. Что бьёт по гипотезе сильнее всего (сводка опровержений)

1. **Alphabet уже в целевой нише** и уже показал результат в крупнейшем RTO (декабрь 2025).
2. **Покупателей на стороне операторов сети — десятки, не тысячи**, и они заняты GridUnity/PowerClerk; в России их ~400 и число сокращается по плану государства.
3. **Цикл продажи utility 18 месяцев + pilot purgatory** — прямая угроза выживанию небольшой студии.
4. **Референсная выручка чистого игрока: ~$3,6 млн ARR** при почти полном покрытии сегмента девелоперов.
5. **Лучшая технология в нише (Pearl Street) вышла через нераскрытое поглощение**, прожив на грантах, а не на венчуре.
6. **За софт в этой нише привык платить бюджет** (AI4IX $30 млн, GRIP $49,5 млн, iQMS $11,2 млн), а не сам покупатель.
7. **Ни одной публичной цифры «человеко-часов на исследование»** — ROI продукта нечем обосновать перед закупщиком; DOE сам признаёт отсутствие данных.

---

## 7. Вердикт

**Продуктовая зона для софтверной команды без физических моделей сети — есть, но она не там, где кажется на первый взгляд, и она не венчурного размера.**

**Что закрыто:** всё, что связано с расчётом режимов и стоимости сетевых усилений. Соваться туда без инженеров-режимщиков и валидированного солвера — гарантированная потеря времени.

**Что открыто:** документно-регламентный слой — комплектность, титулы и site control, соответствие пунктам тарифа/ТУ, извлечение данных из PDF, контроль сроков и обязательств, подготовка и оспаривание позиций. Это подтверждено первичным источником (DOE: >90% заявок дефектны) и двумя работающими продуктами без физики (HyperQ, Zonevex).

**Где эта зона доступна именно для вас:**

| Сегмент | Покупатель | Оценка |
|---|---|---|
| RTO/ISO США | 7 организаций | **Закрыто.** Alphabet + GridUnity + 18-мес. циклы |
| Крупные utility США | ~49 балансирующих зон | **Плохо.** Занято PowerClerk/GridUnity, CEII, закупки |
| **Девелоперы США (заявительская сторона)** | Сотни компаний, включая дата-центровых | **Реалистично.** Ниша Zonevex, вход дешевле, покупатель коммерческий и торопится. Но это small business на ~$1–5 млн ARR, не больше |
| **Консультанты/EPC/юрфирмы по присоединению** | Много, покупают быстрее | **Реалистично.** Продаётся как ускоритель их собственной услуги |
| **Россия: ТСО и «Россети»** | ~400 ТСО + 15 ДЗО | **Реалистично, но узко.** Форсирующий фактор — ПП №1125 (ЕПГУ с 01.01.2026) и штрафы по 9.21. LLM-слоя ни у кого нет. Потолок — десятки млн ₽/год |
| **Россия: заявительская сторона** (девелоперы, промышленность, застройщики) | Тысячи | **Самое доступное.** Подготовка заявки, разбор ТУ, контроль просрочки сетевой организации, автоподготовка жалобы в ФАС по 9.21 |

**Рекомендуемая формулировка гипотезы, если решите копать дальше:**
не «мы автоматизируем interconnection», а **«мы делаем заявительской стороне пакет, который проходит с первого раза, и держим сетевую организацию в сроке»**. Покупатель — девелопер или консультант, а не оператор сети. Метрика, которую можно продать без физмодели: доля заявок, принятых без замечаний, и число дней, отыгранных на дефектных циклах.

**Что проверить перед вложениями (чего я не смог закрыть):**
1. Кто выиграл AI4IX — публичного списка победителей не нашёл; это прямой список ваших будущих конкурентов.
2. Реальная выручка Zonevex и его размер — публичных данных нет.
3. Общероссийская статистика ФАС по ст. 9.21 за 2024–2025 — не нашёл; без неё размер российской боли оценён только по одному региону (Тюмень).
4. Консолидированные цифры ТП по группе «Россети» — не нашёл.
5. Условия сделки Enverus–Pearl Street — не раскрыты; это ключевой ориентир по потолку выхода в нише.

---

## Приложение: список источников

**Первичные (регуляторы, лаборатории, отчётность):**
- [LBNL, Queued Up: 2026 Edition (данные на конец 2025), июнь 2026](https://emp.lbl.gov/publications/queued-2026-edition-characteristics)
- [LBNL, Queued Up: 2025 Edition (данные на конец 2024)](https://emp.lbl.gov/publications/queued-2025-edition-characteristics)
- [LBNL / J. Seel, Queued Up: Status and Drivers of Generator Interconnection Backlogs, 29.04.2025 (PDF)](https://solar-media.s3.amazonaws.com/assets/LSSUSA25/Marketing/Presentations/Interconnection%20Queues%20and%20Costs,%20Seel%204.29.2025%20public%20version.pdf)
- [DOE i2X Transmission Interconnection Roadmap, апрель 2024 (PDF)](https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf)
- [SPP, Order 845 informational filing Q4 2025, ER19-1954-000, 10.02.2026 (PDF)](https://www.spp.org/documents/75953/20260210_order%20845%20informational%20filing%20q4%202025_er19-1954-000.pdf)
- [FERC, Explainer on the Interconnection Final Rule (Order 2023)](https://www.ferc.gov/explainer-interconnection-final-rule)
- [FERC, Interconnection of Large Loads, Docket RM26-4-000](https://www.ferc.gov/rm26-4)
- [DOE, AI for Interconnection (AI4IX)](https://www.energy.gov/oe/ai-interconnection-ai4ix)
- [DOE i2X iQMS](https://www.energy.gov/cmei/i2x/i2x-innovative-queue-management-solutions-iqms-clean-energy-interconnection-and-0)
- [ПП РФ №861 от 27.12.2004, актуальная редакция, КонсультантПлюс](https://www.consultant.ru/document/cons_doc_LAW_51030/)
- [ПП РФ №1125 от 22.08.2024, Гарант](https://www.garant.ru/products/ipo/prime/doc/409474791/)
- [КоАП РФ ст. 9.21, КонсультантПлюс](https://www.consultant.ru/document/cons_doc_LAW_34661/6f859cc496d21336b64d302c2bb0511a24b0743f/)
- [Годовой отчёт ПАО «Россети Юг» за 2024](https://ar2024.rosseti-yug.ru/ru/2/0/index.html)
- [Годовой отчёт ПАО «Россети Северо-Запад» за 2024](https://ar2024rosseti-sz.ru/ru/strategic-report/perfomance-results)
- [Годовой отчёт ПАО «Россети Московский регион» за 2024 (PDF)](https://www.akm.ru/upload/akmrating/Rosseti_MR_annual_report_2024.pdf)

**Сайты продуктов и объявления вендоров (заявления вендора, не подтверждённые факты):**
- [Tapestry, HyperQ в PJM Cycle 1](https://www.tapestryenergy.com/en/projects/field-notes-hyperq-deployment-in-pjm-s-cycle-1)
- [Pearl Street Technologies](https://pearlstreettechnologies.com/)
- [Enverus: приобретение Pearl Street, 13.03.2025](https://www.enverus.com/newsroom/undo-the-queue-enverus-acquires-pearl-street-technologies-to-solve-for-a-more-reliable-resilient-grid/)
- [Pear VC о поглощении Pearl Street](https://pear.vc/pearl-street-technologies-is-acquired-by-enverus/)
- [Nira Energy](https://www.niraenergy.com/) и [Nira + Energize Capital, июнь 2025](https://www.prnewswire.com/news-releases/nira-energy-partners-with-energize-capital-to-scale-transmission-automation-software-302467710.html)
- [GridUnity, $49,5 млн DOE GRIP](https://www.gridunity.com/resources/gridunitys-digital-project-awarded-49-5-million-in-federal-funding-to-accelerate-grid-interconnection)
- [Clean Power Research, итоги 2025 (PowerClerk, >3 млн проектов)](https://www.cleanpower.com/2025/2025-to-date-milestones-innovations-and-customer-stories/)
- [Zonevex vs GridUnity](https://zonevex.com/blog/zonevex-vs-gridunity)
- [Paces, Series A $11 млн](https://www.paces.com/news/paces-raises-11-million-to-accelerate-clean-energy-development)
- [HData](https://www.hdata.com/)
- [Siemens Gridscale X / PSS®E](https://www.siemens.com/en-us/products/pss-software/gridscale-x-pss-e/)
- [DIgSILENT PowerFactory](https://www.digsilent.de/en/powerfactory.html)
- [ConnectWerx, CWX-010-GDO (AI4IX)](https://www.connectwerx.org/portfolio-items/ppo-cwx-010-gdo-accelerating-interconnection-through-ai-ai4ax/)
- [tp-seti.ru, интеграция ЛК ТСО с ЕПГУ](https://tp-seti.ru/)
- [ИБР, кейсы по ТП](https://ibsco.ru.com/keys/tekhnologicheskie-prisoedineniya/prisoedinenie-k-elektricheskim-setyam.html)
- [Портал ТП «Россети Московский регион»](https://utp.rossetimr.ru/)

**Пресса и аналитика:**
- [Utility Dive, PJM–Google–Tapestry](https://www.utilitydive.com/news/pjm-google-tapestry-grid-interconnection-ai/744982/)
- [DCD, первое развёртывание платформы Tapestry в PJM](https://www.datacenterdynamics.com/en/news/google-backed-tapestry-completes-first-deployment-of-ai-platform-for-pjm-interconnection-application-process/)
- [Latitude Media, Tapestry и бэклог PJM](https://www.latitudemedia.com/news/tapestry-is-using-ai-to-help-pjm-clear-its-interconnection-backlog/)
- [Latitude Media, Nira Energy](https://www.latitudemedia.com/news/how-nira-energy-is-using-software-to-unclog-the-interconnection-queue/)
- [APPA, DOE и AI4IX (цифра >90% дефектных заявок)](https://www.publicpower.org/periodical/article/doe-offers-funding-accelerate-interconnection-process-through-utilization-artificial-intelligence)
- [Salesforce Ventures, продажи utility](https://salesforceventures.com/perspectives/utility-sales/)
- [Latitude Media, pilot purgatory](https://www.latitudemedia.com/news/pilot-purgatory-the-quintessential-definition-of-insanity/)
- [Climate Solutions Legal Digest, штрафы за просрочку исследований](https://www.climatesolutionslaw.com/2024/03/generator-interconnection-rule-ferc-provides-clarification-and-tweaks-to-order-no-2023/)
- [РБК Тюмень, штраф «Россети Тюмень» 92 млн ₽, 12.09.2024](https://t.rbc.ru/tyumen/12/09/2024/66e2c2fe9a79473d731b315b)
- [Правда ПФО, штраф «Россети Центр и Приволжье» 600 тыс. ₽](https://pravdapfo.ru/news/rosseti-czentr-i-privolzhe-oshtrafovali-na-600-tysyach-rublej/)
- [ТАСС, число ТСО снизилось на 56% с 2022](https://tass.ru/ekonomika/25445465)
- [ТАСС, планы Минэнерго по сокращению ТСО](https://tass.ru/ekonomika/25408487)
- [arXiv 2602.20683, Grid-Mind (февраль 2026)](https://arxiv.org/pdf/2602.20683)

**Источники, помеченные как ненадёжные:**
- getlatka.com (выручка Nira) — вторичный агрегатор
- marketintelo.com (объём рынка $148 млн) — автогенерируемый market report, **не использовать**
