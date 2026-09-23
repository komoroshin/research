# Поток 4 · Триггеры: регуляторика и вендоры · Европа (ЕС + UK)

Дата сбора: 23.09.2026. Исполнитель: агент-исследователь, поток 4.

**Что искал.** Регуляторные и рыночные события с датой (последние 12 мес. и ближайшие 12–15 мес.), которые создают обязательную задачу для компаний на 20–500 сотрудников и закрываются ИТ/AI-решением силами 1–2 человек: e-invoicing по странам, EAA, AI Act после Digital Omnibus, NIS2, DORA, CSRD после Omnibus, Pay Transparency, таможня для e-commerce, рост цен SaaS.
**Какие источники сработали.** Первоисточники: сайт Еврокомиссии по AI Act (digital-strategy.ec.europa.eu), новость Еврокомиссии о пошлине €3 (commission.europa.eu), портал KSeF Минфина Польши (ksef.podatki.gov.pl), einvoice.belgium.be, Microsoft Licensing и Partner Center, страница Atlassian о конце Data Center. Кроме них: юрфирмы (Gibson Dunn, DLA Piper, Latham, Morgan Lewis), регуляторы через выдачу поиска (CSSF, FSMA, EBA), вендорские прайсы.
**Что не открылось.** EUR-Lex отдаёт WAF-челлендж (HTTP 202 с пустым телом), поэтому тексты директив и регламентов процитировать напрямую не удалось. Страница FPS Finance (BE) показывает капчу, consilium.europa.eu отдаёт 403. Где первоисточник не открылся, дата подтверждена минимум двумя независимыми вторичными источниками, и это помечено. Лимит веб-поиска на сессию (200) исчерпан в конце работы, поэтому часть пунктов помечена «не проверено».
**Главный вывод.** Само соответствие e-invoicing уже стало товаром: подключение к Peppol или KSeF стоит от 0 до нескольких сотен €/зл в год. Нам остаются задачи вокруг него: нестандартный биллинг, мультистрановой слой и AI-обработка входящих структурированных счетов. Самые «горячие» триггеры с понятным сигналом снаружи: EAA (сайт можно просканировать), NIS2 в NL (закон с 15.08.2026), DORA для малых платёжных институтов и EMI, AI Act ст. 50 для тех, у кого есть чат-боты и голосовые агенты (действует с 02.08.2026).

---

### 1. EAA: аудит и исправление доступности e-commerce-сайта и приложения (NL / IE / Nordics / FR)
- Рынок / страна: ЕС. Продаётся по-английски в NL, IE, SE, DK, FI и в международном e-commerce. Во FR самый жёсткий прецедент, но там нужен французский.
- Сегмент (отрасль × размер × ЛПР): интернет-магазины, маркетплейсы, банковские и финтех-приложения, билетные сервисы, e-book-платформы. Размер от 10 человек или от €2 млн оборота (микропредприятия-услуги освобождены). ЛПР: Head of E-commerce / CTO / Head of Digital.
- Боль: с 28.06.2025 сайт и приложение должны соответствовать требованиям доступности (на практике WCAG 2.1/2.2 AA через EN 301 549). У большинства SMB-магазинов этого нет. Доступность надо и сделать, и поддерживать при каждом релизе.
- Триггер / почему сейчас (с датой):
  - Применяется с 28.06.2025.
  - FR, 04.06.2026: суд обязал Carrefour сделать сайт и приложение полностью доступными за 6 месяцев под штрафом €500 в день. Дело инициировали НКО, в ноябре 2025 они подали иски и против Auchan, E.Leclerc и Picard. Иск к Auchan отклонён 05.05.2026 по основаниям scope.
  - NL: ACM ввела обязательную самоотчётность (дедлайн 15.10.2025) и до весны 2026 проверяла тех, кто не отчитался. Активное принуждение ожидается во 2-й половине 2026.
  - SE: PTS открыла 28 проверок e-commerce-сайтов по своей инициативе (октябрь 2025) и получила 124 жалобы.
  - DE: с августа 2025 идут частные Abmahnungen (досудебные претензии) со ссылкой на BFSG.
  - Максимальные штрафы по странам: IE €60 000, DE €100 000, FR €375 000, SE около €900 000.
  - Оговорка: по данным на середину 2026 денежных штрафов по EAA ещё никто не получил, пока всё идёт через предписания и судебные запреты.
- Внешний сигнал для персонализации: автоматический скан главной страницы, карточки товара и чекаута (axe или Lighthouse) с числом нарушений AA. Нет ли на сайте accessibility statement. Есть ли на сайте оверлей-виджет (сам по себе он требованиям не соответствует — **гипотеза**, в этом прогоне не проверено).
- Кто уже продаёт (≥2 ссылки, цены если есть):
  - AbilityNet (UK): £4 950 + VAT фикс, до 10 страниц.
  - Jim Byrne (UK): от £2 500.
  - AudioEye / DigitalA11Y: $1 500–5 500, около $175 за страницу.
  - Accessible.org: $100–250 за страницу, VPAT/ACR +$350.
  - Accessibility.build: от $950.
  - Axively: скан €9 плюс AI-подсказки по исправлению за €9–99.
  - Level Access, EqualWeb: managed compliance.
- Грубая стоимость боли (оценка): аудит £2,5–5k + исправление 20–60 ч × €80 = €1,6–4,8k + мониторинг €2–5k/год. Итого **$6–15k в первый год** на компанию. Риск суда или предписания (как у Carrefour: €500/день) — отдельно, не монетизирован.
- Что делаем мы и почему это не «пара промптов»:
  - Фикс-аудит по шаблонам страниц, а не по их числу.
  - Исправление в коде (Shopify, Magento, headless).
  - Внедрение a11y-тестов в CI.
  - AI-пайплайн: alt-тексты и описания для тысяч карточек товара, приведение PDF (инструкции, счета) к доступному виду.
  - Здесь нужны реальные правки фронтенда и регресс-тесты, промптов недостаточно.
- Посильно ли 1–2 людям за 2–4 недели: да. Аудит 1 неделя, исправление основных шаблонов 2–3 недели, пайплайн alt-текстов переиспользуется между клиентами.
- Источники:
  - https://auditsu.com/resources/eaa-enforcement-2026 (25.06.2026)
  - https://www.levelaccess.com/blog/penalties-for-eaa-non-compliance/ (2026)
  - https://www.webyes.com/blogs/eaa-fines/ (2026)
  - https://www.deque.com/blog/early-signs-of-eaa-enforcement-across-europe/
  - https://accessibility.build/guides/accessibility-audit-cost (обновлено 08.2026)
  - https://accessible.org/pricing/
  - https://axively.com/
  - Первоисточник: Директива (EU) 2019/882 — EUR-Lex не открылся, дата 28.06.2025 взята из вторичных источников.
  - Расхождение: суд по делу Carrefour в одном источнике назван Paris, в другом Caen. Уточнить.
- Уверенность: **высокая** по триггеру и спросу, **средняя** по срочности (штрафов пока нет).

### 2. NIS2 в Нидерландах (Cbw с 15.08.2026): gap-анализ + автоматический сбор доказательств + ответы на supplier-анкеты
- Рынок / страна: NL (основной, продаётся по-английски), плюс DE (с 06.12.2025), BE, IT (там уже есть первые штрафы). IE, ES, FR закон ещё не приняли.
- Сегмент: средние субъекты NIS2 (от 50 сотрудников или от €10 млн оборота) в секторах Annex I/II: производство, пищевая промышленность, логистика, ИТ-MSP, digital providers, waste, chemicals. А также их поставщики, которым крупные клиенты шлют анкеты по цепочке поставок. ЛПР: CEO / CFO / IT Manager. По NIS2 руководство лично отвечает за меры.
- Боль: нужны меры по ст. 21 (10 направлений), уведомление об инцидентах за 24/72 ч, регистрация у регулятора. Штатного CISO нет, доказательства разбросаны по системам.
- Триггер / почему сейчас (с датой):
  - Cbw и Wwke вступили в силу **15.08.2026**, под обязанности попали более 8 000 организаций в NL.
  - 08.07.2026 Еврокомиссия передала дела NL и ES в Суд ЕС за неполную транспозицию.
  - DE: закон действует с 06.12.2025, нужна регистрация в BSI.
  - Первые штрафы: BE €185 000, IT €450 000, HU €78 000.
- Внешний сигнал для персонализации: NACE-код и численность (попадание в сектор и размер). Вакансии «security officer / ISO 27001». Есть ли ISO 27001 (публичные реестры сертификатов). Для поставщиков: кто их крупные клиенты из сектора NIS2.
- Кто уже продаёт:
  - NIS2Ready (saevelis): gap-отчёт от €349, для SME на 50–500 сотрудников.
  - ADVISORI (DE): NIS2 readiness assessment.
  - GRC Solutions: NIS2 compliance services.
  - Check Point: NIS2 Readiness Assessment.
  - Possehl Secure: gap-анализ NIS2/CRA.
  - Срок консалтингового ассессмента: 2–3 недели для SME, 3–5 недель для medium.
- Грубая стоимость боли (оценка): gap-анализ €5–15k + внедрение мер и политик €20–60k + 0,5–1 FTE на поддержку (€40–70k/год) = **$60–150k в первый год**. Формула: консалтинг + доля FTE. Максимальный штраф для important entities: €7 млн или 1,4% оборота (из текста NIS2, EUR-Lex не открылся — **проверить**).
- Что делаем мы: коннекторы к M365/Google, IdP, EDR, тикетингу для автоматического сбора доказательств. Реестр активов и рисков. AI-агент, который отвечает на supplier security-анкеты по базе политик. Runbook уведомления за 24 ч. Это интеграции плюс прод-надёжность, а не генерация политик промптом.
- Посильно ли 1–2 людям за 2–4 недели: gap-анализ и набор политик — да. Автосбор доказательств — MVP за 3–4 недели, переиспользуется.
- Источники:
  - https://www.nldigitalgovernment.nl/overview/nis2-directive-cyberbeveiligingswet-cbw/
  - https://business.gov.nl/amendments/nis2-directive-protects-network-information-systems/
  - https://www.dlapiper.com/en/insights/publications/2026/02/nis-2-directive-transposed-in-germany (02.2026)
  - https://compliancehub.wiki/nis2-cjeu-referral-ireland-spain-france-netherlands-2026/ (2026)
  - https://www.legiscope.com/blog/nis2-enforcement-tracker-2026.html (штрафы — вторичный источник)
  - https://nis2.saevelis.com/
  - https://www.advisori.de/services/regulatory-compliance-management/nis2/nis2-readiness-assessment
  - https://www.glocertinternational.com/resources/guides/nis2-readiness-assessment-guide/
- Уверенность: **высокая** по триггеру (NL), **средняя** по конкуренции (рынок плотный: консалтинг плюс Vanta/Drata-подобные).

### 3. DORA для малых платёжных институтов, EMI и CASP: автоматизация Register of Information и ICT-third-party
- Рынок / страна: ЕС-финтех-хабы, где работают по-английски: LT, MT, CY, IE, LU, NL.
- Сегмент: платёжные институты, e-money-институты, небольшие инвестфирмы, страховые посредники, CASP. 20–300 сотрудников. ЛПР: Head of Compliance / COO / CTO. Второй сегмент: SaaS-вендоры финтехов (ICT third-party providers), которым клиенты предъявляют требования ст. 30 DORA к договорам и анкетам.
- Боль: ежегодный Register of Information по шаблону EBA. Для малого PI это самое трудоёмкое требование. Excel перестаёт справляться примерно после 50 ICT-договоров. Плюс классификация и отчётность по инцидентам.
- Триггер / почему сейчас (с датой):
  - DORA применяется с 17.01.2025.
  - Второй цикл RoI: подача с 16.02 по 13.03.2026 (CSSF: 11.02–31.03.2026), дата данных 31.12.2025. Следующий цикл — Q1 2027 на данных на 31.12.2026, то есть готовиться нужно сейчас.
  - В ноябре 2025 назначены 19 критических ICT-провайдеров.
- Внешний сигнал для персонализации: лицензия в реестре центробанка (LB, MFSA, CBI, CSSF) — тип и дата. Стек из вакансий. Количество ICT-вендоров (по сайту и вакансиям).
- Кто уже продаёт:
  - DoraPass: SME-ориентированный, от ~€500.
  - ProcessUnity: €18 000+/год.
  - Panorays: автоматизация RoI.
  - RiskNow: бесплатный шаблон.
  - Legiscope: обзор 12 инструментов.
  - Диапазон цен: от ~€5 000/год для малого PI до €150 000+/год для значимого банка.
- Грубая стоимость боли (оценка): 0,3–0,5 FTE compliance (€60–80k × 0,4 ≈ €24–32k) + инструмент €5–18k/год = **$30–55k в год**.
- Что делаем мы: извлечение данных из ICT-договоров (AI по PDF) в таблицы EBA RoI с референциальной целостностью. Валидация по правилам ESA. Выгрузка xBRL-CSV. Ежегодное обновление. Для вендоров — AI-заполнение DORA-анкет клиентов. Работа с документами плюс строгая схема данных, это не промпт.
- Посильно ли 1–2 людям за 2–4 недели: да. Пилот — RoI одного PI из его договоров за 3 недели. Шаблон EBA один на всех, поэтому высокая переиспользуемость.
- Источники:
  - https://www.cssf.lu/en/2026/02/dora-submission-timeframe-for-register-of-information-edesk-portal-open-as-of-11-february-2026/ (02.2026)
  - https://www.fsma.be/en/news/dora-register-information-third-party-ict-service-providers-limited-update-2026
  - https://www.eba.europa.eu/publications-and-media/press-releases/esas-announce-timeline-collect-information-designation-critical-ict-third-party-service-providers
  - https://www.legiscope.com/blog/best-dora-compliance-software.html (2026)
  - https://dorapass.com/blog/dora-compliance-costs
  - https://dorapass.com/blog/dora-for-payment-institutions
  - https://www.risknow.com/en/resources/dora-register-guide
- Уверенность: **высокая**. Бонус: отрасль финансы/финтех.

### 4. EU AI Act, ст. 50 (с 02.08.2026): соответствие для компаний с чат-ботами и голосовыми агентами + маркировка AI-контента
- Рынок / страна: весь ЕС плюс UK-компании с пользователями в ЕС. Продаётся по-английски.
- Сегмент: SMB и mid-market, у которых есть AI-чат-бот поддержки, голосовой агент, AI-генерация контента (e-commerce, финтех, клиники, travel). ЛПР: CTO / Head of CX / DPO.
- Боль:
  - Пользователя нужно информировать, что он общается с AI, в начале взаимодействия.
  - Синтетический контент нужно маркировать машиночитаемо.
  - Для систем, выпущенных на рынок до 02.08.2026, требование маркировки (watermarking) действует с 02.12.2026.
  - Отдельно: провайдеры high-risk систем по Annex III (HR/рекрутинг, кредитный скоринг, образование) должны пройти conformity до **02.12.2027**. Это HR-tech и финтех-SaaS.
- Триггер / почему сейчас (с датой):
  - Digital Omnibus on AI вступил в силу 27.07.2026.
  - High-risk по Annex III перенесены на 02.12.2027, Annex I — на 02.08.2028.
  - Ст. 50 применяется с 02.08.2026. Grace-период до 02.12.2026 касается только маркировки для систем, уже бывших на рынке.
  - Обязанность по AI literacy (ст. 4) смягчена до «support the development».
  - Код практики по маркировке AI-контента опубликован 10.06.2026.
  - Штраф за нарушение ст. 50: до €15 млн или 3%; для SME и SMC — меньшая из двух величин.
- Внешний сигнал для персонализации: на сайте есть чат-виджет (Intercom Fin, Zendesk AI, Tidio) или голосовой бот на линии, но нет AI-дисклеймера. AI-вакансии. Для HR-tech и скоринга — описание продукта со словами «AI screening / scoring».
- Кто уже продаёт: OmbuLabs (SMB-чеклист по ст. 50, агентство), regulation-ai.eu, bratby.law (юр. консультации UK/EU), artificialintelligenceact.eu (гайды). Публичных фикс-цен на пакет «ст. 50 для SMB» **не нашёл**. Proof of spend слабый: продают юрфирмы почасово и AI-governance-платформы без публичных цен.
- Грубая стоимость боли (оценка): доработка ботов и контента €3–8k + юр-ревью €2–5k = $5–15k разово. Для Annex III-провайдеров — $50–150k на подготовку к conformity (оценка: QMS, техдокументация, логирование, human oversight).
- Что делаем мы: инвентаризация AI-точек контакта. Доработка ботов (дисклеймер, логирование, эскалация на человека). Watermarking и C2PA для генерируемого контента. Для HR-tech/скоринга: техдокументация, логирование, мониторинг bias — это продакшн-инженерия. Хорошо ложится на опыт команды с голосовыми агентами.
- Посильно ли 1–2 людям за 2–4 недели: ст. 50 — да, за 1–2 недели. Annex III — пилот-gap за 3–4 недели, полное соответствие дольше.
- Источники:
  - https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai (первоисточник, даты)
  - https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ (27.05.2026)
  - https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/
  - https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
  - https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50
  - https://www.ombulabs.ai/blog/eu-ai-act-article-50-smb-checklist.html
  - https://www.regulation-ai.eu/en/transparency-obligations/
- Уверенность: **высокая** по датам, **низкая–средняя** по proof of spend (ст. 50). Для Annex III HR-tech — средняя, срок 14 месяцев.

### 5. Бельгия, Peppol B2B (с 01.01.2026, штрафы с 01.04.2026): коннектор для нестандартного биллинга + AI-обработка входящих
- Рынок / страна: BE. Продаётся по-английски, в Фландрии и Брюсселе это нормально.
- Сегмент: компании на 20–300 сотрудников со своим или legacy-биллингом (SaaS, e-commerce, B2B-дистрибуция, сервисные компании с отраслевым ПО без Peppol-модуля). ЛПР: CFO / Finance Manager.
- Боль: все B2B-счёта между плательщиками НДС в BE идут в структурированном виде через Peppol (EN 16931 / Peppol BIS UBL). Стандартная бухгалтерия это закрывает, а кастомный биллинг и отраслевые системы — нет. Входящие XML нужно разносить автоматически, иначе выигрыша нет.
- Триггер / почему сейчас (с датой):
  - Обязательность с 01.01.2026 (einvoice.belgium.be).
  - Период толерантности до 31.03.2026.
  - С 01.04.2026 штрафы: €1 500 / €3 000 / €5 000 за 1-е, 2-е и последующие нарушения (вторичные источники; FPS Finance закрыт капчей).
  - С **01.01.2028** — почти онлайн e-reporting в FPS Finance (5-угольная модель).
  - Налоговый стимул: вычет 120% затрат на софт, обучение и **консалтинг** по e-invoicing для малых SME за 2024–2027. Это прямой аргумент в продаже.
- Внешний сигнал для персонализации: проверка, зарегистрирована ли компания в Peppol Directory (публичный поиск по номеру предприятия). Если не зарегистрирована или зарегистрирована только как получатель — сигнал. Тип биллинга по сайту и вакансиям.
- Кто уже продаёт:
  - Storecove (API access point): тарифы от €0 до €894, по G2 кастом-квоты от ~€495/мес.
  - e-invoice.be: API, альтернатива Storecove.
  - Babelway, Tradeshift, Billtrust, Banqup: платформы.
  - Nexuro Digital: внедрение (Odoo).
- Грубая стоимость боли (оценка): ручная разноска 500 входящих в месяц × 5 мин × €35/ч ≈ €17k/год + штрафы до €5k за нарушение + интеграция кастомного биллинга €5–15k разово. Итого **$15–35k на компанию в первый год**.
- Что делаем мы: коннектор «кастомный биллинг → UBL → access point» с валидацией Schematron. Входящий поток «Peppol XML + остатки PDF → AI-кодирование по счетам, центрам затрат, PO-матчинг → ERP». Задел на e-reporting 2028. Грязные данные и интеграции, не промпт.
- Посильно ли 1–2 людям за 2–4 недели: да, коннектор 2–3 недели. Переиспользуется в DE, PL, GR, HR (см. карточку 7).
- Источники:
  - https://einvoice.belgium.be/en (первоисточник: дата 01.01.2026, толерантность Q1)
  - https://finance.belgium.be/en/enterprises/vat/e-invoicing/mandatory-use-structured-electronic-invoices-2026 (первоисточник, закрыт капчей)
  - https://tradeshift.com/resources/compliance/belgium-b2b-e-invoicing-mandate-2026-tolerance-period/
  - https://peppolvalidator.com/peppol-belgium (штрафы)
  - https://www.grantthornton.be/en/the-field/articles-and-publications/BTW/e-invoicing-benefits-and-the-introduction-of-the-belgian-e-mandate2/ (120%)
  - https://www.comarch.com/trade-and-services/data-management/legal-regulation-changes/belgium-confirms-2026-peppol-e-invoicing-mandate-with-2028-near-real-time-reporting-to-follow/
  - https://www.g2.com/products/storecove/pricing
  - https://e-invoice.be/alternatives/storecove
- Уверенность: **высокая** по триггеру, **средняя** по боли. Базовая Peppol-отправка дешёвая, платят за интеграцию и AP-автоматизацию.

### 6. Германия, E-Rechnung на отправку (с 01.01.2027 при обороте > €800k): XRechnung/ZUGFeRD из кастомного биллинга + разбор входящих
- Рынок / страна: DE. Немецкий нужен для классического Mittelstand (штраф в скоринге). По-английски продаётся международным tech, SaaS и e-commerce-компаниям с GmbH.
- Сегмент: SaaS, маркетплейсы, e-commerce, сервисные компании с собственным биллингом (Stripe, Chargebee, самописный), 20–300 сотрудников. ЛПР: CFO / Head of Finance / CTO.
- Боль: с 01.01.2025 все обязаны принимать e-invoices. С 01.01.2027 компании с оборотом прошлого года более €800 000 обязаны их выставлять (EN 16931: XRechnung, ZUGFeRD), с 01.01.2028 — все. Кастомный биллинг этого не умеет, входящие XRechnung приходят «нечитаемыми» для людей.
- Триггер / почему сейчас (с датой): 01.01.2027 — через 3 месяца. Основание — Wachstumschancengesetz (UStG), циркуляр BMF от 15.10.2025.
- Внешний сигнал для персонализации: оборот > €800k (Handelsregister / Bundesanzeiger). Биллинг по стеку сайта (Stripe, Chargebee) и вакансиям. B2B-модель продаж.
- Кто уже продаёт: ZugferdAPI.dev, invoice-api.xhub.io (free-to-start), InvoiceXML (API-тулкит), thelawin.dev (XRechnung с валидацией KoSIT), n8n-шаблоны от комьюнити, ERP-интеграторы (erpimplementation.eu). Цены за счёт в этом прогоне **не получены**.
- Грубая стоимость боли (оценка): интеграция €5–20k разово + ручной разбор входящих XRechnung (300/мес × 4 мин × €40/ч ≈ €9,6k/год). Итого **$15–30k**.
- Что делаем мы: генерация валидного XRechnung/ZUGFeRD из данных биллинга с валидацией KoSIT. Входящий AI-парсинг в бухгалтерию (DATEV, Lexware). Переиспользуется с карточкой 5.
- Посильно ли 1–2 людям за 2–4 недели: да.
- Источники:
  - https://www.vatupdate.com/2026/08/25/germany-e-invoicing-b2b-mandate-timeline-and-compliance/ (25.08.2026)
  - https://sovos.com/vat/tax-rules/e-invoicing-germany/
  - https://www.advisori.de/en/blog/e-invoicing-mandate-germany
  - https://www.zugferdapi.dev/
  - https://invoice-api.xhub.io/en
  - https://www.invoicexml.com/blog/zugferd-api-toolkit
  - https://community.n8n.io/t/xrechnung-zugferd-with-n8n-e-invoice-automation-for-germany-2027-deadline/287541
  - Первоисточник BMF (циркуляр 15.10.2025) не открывал — **проверить на bundesfinanzministerium.de**.
- Уверенность: **высокая** по дате, **средняя** по сегменту на английском.

### 7. Мультистрановой e-invoicing-слой для кросс-бордер компаний (GR 01.10.2026, HR 2026, PL 2027, ES 2027, UK 2029, ViDA 2030)
- Рынок / страна: компании из NL, IE, Nordics, UK, Baltics с дочками или B2B-продажами в нескольких странах ЕС. Продаётся по-английски, это международный финдир.
- Сегмент: mid-market, 50–500 сотрудников, 2+ юрлица в ЕС. ЛПР: Group CFO / Financial Controller.
- Боль: в каждой стране свой формат и канал. У каждой дочки свой локальный провайдер, данные в группе не сходятся.
- Триггер / даты:
  - **GR**: всё B2B через myDATA с **01.10.2026**, адаптационный период до 31.12.2026. Крупные (оборот > €1 млн) — с 02.03.2026.
  - **HR**: B2B/B2G и e-reporting с 01.01.2026 (Fiscalization 2.0), расширение с 01.01.2027.
  - **PL KSeF**: обязателен с 01.04.2026 (крупные с 01.02.2026), для малых (≤ 10 000 зл/мес) — с 01.01.2027. Штрафы только с **01.01.2027** — до 100% НДС со счёта вне KSeF (вторичные источники).
  - **ES**: Verifactu с 01.01.2027 для плательщиков налога на прибыль, с 01.07.2027 для прочих (RDL 15/2025). Штраф за неадаптированный софт до €50 000 в год. B2B e-invoice по Crea y Crece — RD 238/2026, даты в источниках расходятся (01.10.2027 для оборота > €8 млн, 01.10.2028 для остальных по Integrasoft) — **проверить в BOE**.
  - **FR**: приём e-invoices для всех с 01.09.2026, выставление для крупных и средних с 01.09.2026, для SME и микро с 01.09.2027.
  - **LV**: B2B с 01.01.2028. **EE**: обязательность в проекте, не принята.
  - **UK**: обязательно с **01.04.2029** (B2B/B2G, 4-угольная модель, без e-reporting в HMRC). Дорожная карта — к Budget в ноябре 2026.
  - **ViDA**: цифровая отчётность по внутри-ЕС B2B с 01.07.2030.
- Внешний сигнал для персонализации: список дочек (Companies House / реестры). Страны присутствия. В PL — зарегистрирована ли компания в KSeF (не проверяемо снаружи — **гипотеза**).
- Кто уже продаёт: Sovos, EDICOM, Comarch, ecosio, Basware, Marosa (консалтинг), Storecove. Локально в PL: ksefservice.pl (есть прайс), integracja-ksef.pl, VATAX (сравнение цен от 0 зл). В PL стоимость для средней фирмы — от сотен до нескольких тысяч зл разово плюс абонемент (afaktury.pl, eztax.pl).
- Грубая стоимость боли (оценка): 3 страны × (локальный провайдер €2–6k/год + интеграция €5–10k) + сверка группы 0,2 FTE (€12k) = **$35–60k в год**.
- Что делаем мы: единая шина «ERP / биллинг группы → канонический инвойс → адаптеры (Peppol, KSeF FA(3), myDATA, Verifactu) → единый реестр статусов и входящих». Каждый новый адаптер — актив.
- Посильно ли 1–2 людям за 2–4 недели: пилот на 1–2 странах — да. Полный слой — нет, это продукт.
- Источники:
  - https://ksef.podatki.gov.pl/etapy-wdrozenia-ksef/ (первоисточник по датам PL)
  - https://sovos.com/blog/vat/poland-e-invoicing-via-ksef/
  - https://www.vatupdate.com/2026/05/02/poland-ksef-e-invoicing-mandate-a-comprehensive-guide/ (05.2026)
  - https://ksefservice.pl/pricing.php
  - https://afaktury.pl/ile-kosztuje-wdrozenie-ksef-w-firmie,0,61,11,366/
  - https://www.vatcalc.com/greece/greece-mydata-e-book-and-e-invoices-update/
  - https://edicomgroup.com/blog/greece-mandatory-electronic-invoice
  - https://marosavat.com/vat-news/croatia-e-invoicing-mandate
  - https://www.basware.com/en/compliance-map/croatia
  - https://www.garrigues.com/es_ES/noticia/retrasa-entrada-vigor-verifactu
  - https://noticias.juridicas.com/actualidad/noticias/20735-nueva-prorroga:-verifactu-no-sera-obligatorio-hasta-2027-para-sociedades-y-otros-contribuyentes/
  - https://www.integrasoft.es/2026/08/14/verifactu-y-factura-electronica-b2b-mas-informacion/ (14.08.2026)
  - https://www.ey.com/en_gl/technical/tax-alerts/france-revises-schedule-for-adopting-e-invoicing-reform
  - https://www.icas.com/news-insights-events/news/tax/autumn-budget-2025-e-invoicing-will-go-ahead-from-2029 (UK)
  - https://www.vatupdate.com/2026/07/21/e-invoicing-mandate-from-april-2029/ (UK)
  - https://finbite.eu/en/e-invoicing-mandates-europe-2026/ (сводка, LV/EE)
- Уверенность: **высокая** по датам (кроме ES B2B), **средняя** по готовности mid-market платить нам, а не Sovos/EDICOM.

### 8. Пошлина €3 на мелкие посылки (с 01.07.2026, за каждую тарифную позицию): AI-классификация HS-кодов для UK/не-ЕС e-commerce, продающих в ЕС
- Рынок / страна: UK-продавцы (и US, CH) с доставкой в ЕС. Продаётся по-английски.
- Сегмент: D2C и e-commerce-бренды, 20–200 сотрудников, с большим ассортиментом (fashion, beauty, electronics accessories), зарегистрированные в IOSS. ЛПР: Head of Ops / Head of E-commerce / CFO.
- Боль: освобождение для посылок до €150 отменено. Пошлина €3 начисляется **за каждую тарифную позицию** в посылке: 5 футболок — €3, 3 футболки и часы — €6. Декларирует и платит продавец или импортёр. Неверный или слишком детальный HS-код в каталоге напрямую увеличивает пошлину и ломает оформление. С ноября 2026 ожидается ещё handling fee около €2 (на стадии переговоров). Временный режим до 01.07.2028, потом обычные ставки через EU Customs Data Hub.
- Триггер / почему сейчас (с датой): 01.07.2026 уже действует. Handling fee — ориентировочно 11.2026. Переход на полные пошлины — 01.07.2028.
- Внешний сигнал для персонализации: UK-магазин доставляет в ЕС (shipping policy, цены в EUR, DDP/IOSS). Размер каталога. Отзывы на Trustpilot про «customs charges».
- Кто уже продаёт: в этом прогоне **не проверено** (лимит поиска). Кандидаты для проверки на этапе 2: Zonos, Avalara Item Classification, Hurricane Commerce, Gerlach (брокер, есть публикация по теме). Proof of spend пока не подтверждён ссылками с ценами.
- Грубая стоимость боли (оценка): 50 000 посылок/год × в среднем 1,5 позиции × €3 = €225k пошлин. Если оптимизировать классификацию на 10–15%, это €22–34k/год. Плюс ручная классификация 2 000 SKU × 5 мин × €30/ч = €5k.
- Что делаем мы: AI-классификатор HS/CN по карточкам товаров (текст + фото) с объяснением и уровнем уверенности. Проверка брокером-человеком. Выгрузка в Shopify и 3PL. Оптимизация группировки позиций в заказе.
- Посильно ли 1–2 людям за 2–4 недели: да.
- Источники:
  - https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en (первоисточник, 29.06.2026)
  - https://taxation-customs.ec.europa.eu/news/guidance-and-legal-text-temporary-flat-fee-low-value-imports-which-will-apply-until-1-july-2028-2026-06-08_en (08.06.2026)
  - https://www.business.gov.uk/campaign/europe/european-union-eu-regulations/eu-ucc-reforms/ (UK-гайд)
  - https://gerlach-customs.com/knowledge-base/eu-parcel-duty-150-exemption/
  - https://www.globalvatcompliance.com/globalvatnews/eu-low-value-customs-duty/
- Уверенность: **высокая** по триггеру, **низкая** по proof of spend (не проверено). Бонус: ритейл и e-commerce.

### 9. Pay Transparency Directive: отчёт о разрыве в оплате + job architecture из HRIS (первые отчёты 07.06.2027)
- Рынок / страна: ЕС. NL, SE, DK, CZ вводят с 01.01.2027. Уже транспонировали SK, IT, LT, MT. Продаётся по-английски в NL, Nordics, LT, MT.
- Сегмент: работодатели на 150–500 сотрудников (финтех, ритейл, tech, сервис). ЛПР: CHRO / Head of People / CFO.
- Боль:
  - Нужны объективные грейды и категории «равной ценности» и расчёт gender pay gap по 7 показателям.
  - Совместная оценка оплаты, если разрыв ≥ 5% и не объяснён.
  - Диапазоны зарплат в вакансиях, запрет спрашивать историю зарплат.
  - Данные лежат в разных HRIS и payroll, грязные.
- Триггер / почему сейчас (с датой):
  - Срок транспозиции 07.06.2026 прошёл, успели 4 из 27 стран.
  - Первый отчёт **07.06.2027**: для 250+ (ежегодно) и для 150–249 (раз в 3 года) — по данным за 2026. Сбор данных нужен уже сейчас.
  - 100–149 сотрудников — с 2031 (вторичные источники; EUR-Lex не открылся).
- Внешний сигнал для персонализации: численность 150+ (LinkedIn / Apollo). Вакансии без salary range. Страна юрлица и статус транспозиции.
- Кто уже продаёт: Ravio (pay benchmarking + PTD), Syndio, Trusaic, beqom — есть трекеры транспозиции и продукты. Цены публично **не получены**.
- Грубая стоимость боли (оценка): консалтинг по грейдингу €15–40k + инструмент €5–20k/год + 0,2 FTE HR-аналитика (€12k) = **$30–70k в первый год**.
- Что делаем мы: пайплайн HRIS и payroll → чистка → AI-кластеризация ролей в job families → расчёт 7 метрик Директивы → отчёт → генерация salary ranges для вакансий. Работа с грязными данными и чувствительными данными (возможен on-prem).
- Посильно ли 1–2 людям за 2–4 недели: да, пилот-расчёт на данных клиента за 3 недели.
- Источники:
  - https://www.morganlewis.com/pubs/2026/06/eu-pay-transparency-directive-the-deadline-for-transposition-has-passed-what-now (06.2026)
  - https://remoteworkeurope.eu/news/2026/eu-pay-transparency-directive-disclosures-2026/
  - https://synd.io/eu-pay-transparency-directive-transposition-tracker/
  - https://trusaic.com/resources/resources-eu-pay-transparency-directive-member-state-transposition-monitor/
  - https://ravio.com/blog/everything-you-need-to-know-about-the-eu-pay-transparency-directive
  - https://www.beqom.com/blog/eu-pay-transparency-directive-transposition-by-country
  - Первоисточник — Директива (EU) 2023/970, ст. 9 и 34 (EUR-Lex заблокирован WAF) — **проверить**.
- Уверенность: **средняя**. Дата жёсткая, но национальные законы запаздывают, и срочность в ряде стран размыта.

### 10. Atlassian Data Center: конец продаж (30.03.2026) и EOL (28.03.2029) — миграция или уход на альтернативы для mid-market
- Рынок / страна: ЕС и UK, особенно DE, NL, Nordics, где много self-hosted из-за GDPR и суверенитета данных. Продаётся по-английски.
- Сегмент: компании на 100–500 сотрудников на Jira/Confluence Data Center (финтех, регулируемые отрасли, производство). ЛПР: CTO / Head of IT.
- Боль: новые лицензии DC не продаются с 30.03.2026, продление для существующих — до 30.03.2028, 28.03.2029 — read-only. Переход в Cloud в среднем примерно на 28% дороже (Zylo). Плюс вопросы с интеграциями и резидентностью данных.
- Триггер / почему сейчас (с датой): 30.03.2026 (end of sale) уже наступил; 30.03.2028 — последнее продление; 28.03.2029 — EOL.
- Внешний сигнал для персонализации: публичные поддомены jira.company.com / confluence.company.com (признак self-hosted). Вакансии «Jira administrator». Упоминания DC в вакансиях.
- Кто уже продаёт: Seibert Group, Eficode, Deiser, ReleaseTeam, Getint (миграционные партнёры Atlassian). Цены не публичны.
- Грубая стоимость боли (оценка): 300 пользователей × (Cloud Premium ~$15–18/мес — **не проверено**) × 12 ≈ $54–65k/год плюс рост ~28% относительно DC, плюс миграция $20–60k.
- Что делаем мы: миграция данных и интеграций (в Cloud или в open-source альтернативу, если нужен self-hosted). AI-чистка и дедупликация Confluence как база знаний для внутреннего RAG — это и есть мостик к AI.
- Посильно ли 1–2 людям за 2–4 недели: оценка и прототип миграции — да. Полная миграция крупного инстанса — дольше.
- Источники:
  - https://www.atlassian.com/licensing/data-center-end-of-life (первоисточник)
  - https://us.seibert.group/atlassian-data-center-end-of-life
  - https://www.eficode.com/insights/blog/atlassian-is-ending-data-center-next-steps-for-you
  - https://www.releaseteam.com/dc-end-of-life/
  - https://www.theregister.com/2025/09/09/atlassian_will_go_cloudonly_customers/ (09.09.2025)
  - https://zylo.com/blog/saas-pricing-trends (09.06.2026, «+28%»)
- Уверенность: **средняя**. Сегмент DC смещён к крупному бизнесу, и у Atlassian плотная сеть партнёров.

### 11. Рост цен SaaS для SMB (Microsoft 365 с 01.07.2026 и др.): аудит лицензий и замена «платы за место» своим решением
- Рынок / страна: ЕС и UK, по-английски.
- Сегмент: компании на 50–500 сотрудников с десятками SaaS-подписок. ЛПР: CFO / COO / Head of IT.
- Боль: подписки дорожают быстрее бюджета. Используется в среднем 54% купленных лицензий.
- Триггер / почему сейчас (с датой):
  - Microsoft 365 дорожает с 01.07.2026 при продлении: Business Basic $6 → $7, Business Standard $12,50 → $14,50, рост до +33% по планам. Business Standard / Premium with Copilot — $23,50 / $32.
  - Salesforce +6% с 01.08.2025.
  - HubSpot: $10 за 1 000 AI-кредитов сверх лимита.
  - Gartner: цены ряда крупных вендоров выросли на 10–20% в 2025 при росте ИТ-бюджетов на 2,8%.
  - 79% ИТ-руководителей столкнулись с ростом цен при продлении.
- Внешний сигнал для персонализации: стек компании (BuiltWith, вакансии). Численность × тариф даёт прогноз прироста счёта. Дата продления (неизвестна снаружи).
- Кто уже продаёт: Zylo, Vendr, Tropic (SaaS management / закупка), toolrelief (трекер). Цены у Zylo и Vendr не публичны.
- Грубая стоимость боли (оценка): 200 сотрудников × M365 +$2/мес × 12 = $4,8k/год только M365. Все SaaS: 200 × ~$2–4k на человека × 8–12% роста ≈ $32–96k/год прироста (оценка, ставка на человека не проверена).
- Что делаем мы: аудит использования (SSO и логи биллинга) → отказ от лишних мест → замена 1–2 «per-seat» инструментов (CRM, helpdesk, база знаний) на self-hosted или свою сборку с AI-слоем. Не-AI вход с AI следующим шагом.
- Посильно ли 1–2 людям за 2–4 недели: аудит — да. Замена одного инструмента — 3–4 недели.
- Источники:
  - https://www.microsoft.com/en-us/licensing/news/2026-m365-packaging-pricing-updates (первоисточник)
  - https://learn.microsoft.com/en-us/partner-center/announcements/2026-july
  - https://www.microsoft.com/en-us/copilot/blog/2025/12/04/advancing-microsoft-365-new-capabilities-and-pricing-update/ (04.12.2025)
  - https://zylo.com/blog/saas-pricing-trends (09.06.2026)
  - https://zylo.com/blog/saas-statistics
  - https://toolrelief.com/saas-price-hike-tracker-2026/
  - https://www.usu.com/en/blog/microsoft-price-increase-2026
- Уверенность: **средняя** по триггеру (размытый тренд, кроме M365), **низкая** по уникальности оффера.

### 12. UK Cyber Security and Resilience Bill: MSP попадают под регулирование (Royal Assent ожидается около начала 2027)
- Рынок / страна: UK, по-английски.
- Сегмент: managed service providers (ИТ-аутсорс) на 20–300 сотрудников с доступом к системам клиентов — по оценке 900–1 100 новых организаций в scope. ЛПР: MD / CTO / Head of Security.
- Боль: обязательные меры безопасности, уведомление об инциденте за 24 ч, отчёты о near-miss, штрафы от оборота.
- Триггер / дата: законопроект прошёл Commons 16.06.2026. Committee stage в Лордах с 01.09.2026. Royal Assent ожидается около начала 2027, дальше вторичное законодательство. Точной даты применения **нет**.
- Внешний сигнал для персонализации: MSP в реестре Companies House (SIC 62020/62030), клиенты из критических секторов, сертификаты Cyber Essentials и ISO 27001.
- Кто уже продаёт: Stanga, Cloudswitched, Impact IT Solutions, Servnet UK (гайды и услуги подготовки). Цены не получены.
- Грубая стоимость боли (оценка): аналогично NIS2 для medium — $40–100k в первый год.
- Что делаем мы: переиспользуем стек из карточки 2 (автосбор доказательств, runbook на 24 ч, ответы на анкеты клиентов).
- Посильно ли 1–2 людям за 2–4 недели: да, как расширение NIS2-продукта.
- Источники:
  - https://compliancehub.wiki/uk-cyber-security-resilience-bill-lords-committee-september-2026-msp-data-centre-scope/ (09.2026)
  - https://www.stanga.net/en/blog/uk-cyber-security-resilience-bill-2026/
  - https://www.pwc.co.uk/services/technology/cyber-security-services/insights/understanding-cyber-security-and-resilience-bill.html
  - https://www.servnetuk.com/insights/cyber-security-resilience-bill-uk-scope-2026
  - Первоисточник (bills.parliament.uk) не открывал.
- Уверенность: **низкая–средняя**. Дата применения не определена.

---

## Отброшено (не SMB или нет задачи для нас)
- **CSRD после Omnibus I.** Directive (EU) 2026/470, опубликована в OJ 26.02.2026, в силе с 18.03.2026. Порог теперь больше 1 000 сотрудников и больше €450 млн оборота, это enterprise. Компании до 1 000 сотрудников — «shielded»: вправе отказывать в запросах сверх VSME. Давление на SMB **снизилось**, триггер слабый. Источники: https://www.lw.com/en/insights/eu-sustainability-omnibus-published-in-the-official-journal, https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/eu-council-approves-omnibus-i-directive
- **UK Making Tax Digital for Income Tax** (с 04.2026 для дохода > £50k, 2027 — £30k, 2028 — £20k). Касается ИП и арендодателей, не нашего сегмента. Источник: https://www.gov.uk/guidance/find-out-if-and-when-you-need-to-use-making-tax-digital-for-income-tax
- **Франция, e-invoicing.** Даты в карточке 7. Отдельной карточкой не делал: продажа требует французского, а рынок PDP (платформ) поделён сертифицированными игроками.

## Открытые проверки для этапа 2
1. Тексты EUR-Lex (2019/882, 2022/2555, 2023/970, 2024/1689 в редакции Omnibus) — попробовать другой доступ (Publications Office / cellar).
2. Испания, B2B по Crea y Crece: номер и дата RD и сроки — по BOE.
3. Proof of spend по карточке 8 (цены Zonos / Avalara на HS-классификацию).
4. Цены Ravio, Syndio (карточка 9) и Storecove (напрямую).
