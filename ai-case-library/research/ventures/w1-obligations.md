# W1. Регуляторные обязанности в энергетике 2025–2028: «обязаны, но не умеют»

Дата отчёта: 01.09.2026. Метод: по каждой обязанности — норма, обязанные (число), срок, санкция, чем закрывают сейчас, есть ли софт. Ранжирование = число обязанных (1–5) × жёсткость санкции (1–5) × отсутствие инструментов (1–5). Оценки числа компаний, помеченные «~», — мои допущения на основе структуры отрасли, не из первоисточника.

---

## 1. ЕС

### 1.1 NIS2 (Директива (EU) 2022/2555) — киберустойчивость энергосектора
- **Норма:** NIS2; срок транспозиции — 17.10.2024. К середине 2026 большинство стран транспонировали, идут первые санкции (Германия открыла дела за несвоевременные уведомления об инцидентах); Еврокомиссия в 2026 повела отстающие страны в Суд ЕС ([ECSO tracker](https://ecs-org.eu/policy/nis2-directive-transposition-tracker/), [Fasken](https://www.fasken.com/en/knowledge/2025/08/european-unions-nis-2-directive-what-you-need-to-know), [Secra](https://secra.es/en/blog/nis2-directive-enforcement-fines)).
- **Кто обязан:** энергетика — сектор Annex I (essential); порог 50 сотрудников / €10 млн оборота. По ЕС в целом — сотни тысяч entities, в энергетике ~тысячи компаний (допущение).
- **Санкция:** до €10 млн или 2% глобального оборота (essential); €7 млн / 1,4% (important); персональная ответственность директоров.
- **Чем закрывают:** консультанты + горизонтальные GRC-платформы.
- **Софт есть?** Да, рынок перенасыщен (Vanta, Drata, десятки GRC-вендоров — допущение по общеизвестному рынку). **Белого пятна нет.**
- **Ранг:** 5 × 5 × 1 = **25**.

### 1.2 Network Code on Cybersecurity (NCCS, Регламент (EU) 2024/1366) — «энергетический AI Act»
- **Норма:** Делегированный регламент Комиссии 2024/1366, в силе с 13.06.2024 ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A02024R1366-20250914), [ACER](https://www.acer.europa.eu/electricity/cybersecurity)).
- **Календарь** (по [OpenKRITIS](https://www.openkritis.de/eu/nccs_network-code-cybersecurity.html)): методологии оценки рисков — февраль 2026; общесоюзный риск-отчёт — декабрь 2026; предложение по minimum/advanced controls — январь 2027; **нотификация high-impact / critical-impact entities национальными органами — до сентября 2027**; **первые риск-отчёты самих entities — сентябрь 2028**; critical-impact — подтверждение соответствия в 24 мес., верификация каждые 36 мес.
- **Кто обязан:** TSO, крупные DSO, крупная генерация, NEMO, критичные ICT-провайдеры — по индексу ECII (пороги 250–1500 МВт). Оценочно **сотни энтити на весь ЕС** (~300–1000, допущение).
- **Санкция:** в самом регламенте штрафы не прописаны; полномочия нацорганов — инспекции, аудиты, требование доказательств; санкции национальные + давление через NIS2. Пометка: жёсткость пока средняя.
- **Чем закрывают:** пока никто системно — методологии только выходят; TSO делают ISO 27001/ИБ-службами, консультанты (Big4) начинают практики.
- **Софт есть?** **Специализированного — нет.** Generic GRC не покрывает специфические артефакты NCCS (ECII-классификация, cross-border risk reports, CSMS по перечню контролей NCCS). Это ближайший аналог паттерна «EU AI Act → комплаенс-инструменты»: категория создана регламентом, дедлайны 2027–2028 впереди, покупатель обязан.
- **Ранг:** 2 × 3 × 5 = **30**.

### 1.3 CSRD для энергокомпаний — ⚠️ ЛОЖНЫЙ СИГНАЛ
- Omnibus I (Директива (EU) 2026/470, опубликована 26.02.2026): scope срезан до компаний >1000 сотрудников и >€450 млн оборота; wave 2/3 сдвинуты на 2028/2029; ESRS-датапоинты сокращены с >1100 до ~400–500; число non-EU компаний в scope упало с ~10 000 до ~1200 ([DLA Piper](https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/eu-council-approves-omnibus-i-directive), [Coolset](https://www.coolset.com/academy/csrd-under-omnibus-updated-scope-timelines-and-what-companies-should-do-in-2026), [ESG Today](https://www.esgtoday.com/omnibus-cuts-non-eu-companies-in-the-scope-of-csrd-from-10000-to-1200-efrag/)).
- Вывод: обязанность сжимается на глазах, рынок вендоров перегрет. Не строить.

### 1.4 EU Grid Action Plan / прозрачность hosting capacity
- **Норма:** ст. 50, 57 Electricity Regulation и ст. 31 Electricity Directive (в ред. реформы EMD 2024): TSO публикуют доступную мощность для подключения не реже раза в месяц, DSO — раз в квартал, с высокой пространственной гранулярностью ([Ember](https://ember-energy.org/app/uploads/2024/07/Ember-Hosting-capacity-maps-pdf.pdf), [ENTSO-E JTF](https://www.entsoe.eu/grid-action-plan-on-hosting-capacities/)). Карты есть в 22 странах на уровне DSO, но качество «varies greatly». Guidance Комиссии по grid connections — C(2025) 8473 от 10.12.2025 (рекомендация, не санкция).
- **Кто обязан:** все TSO (~40) и DSO (~2400 в ЕС, допущение по числу членов DSO Entity/оценкам отрасли).
- **Санкция:** слабая — надзор NRA, прямых штрафов в норме нет. **Полу-ложный сигнал по санкции**, но: мелким DSO нечем считать hosting capacity → ниша «hosting capacity map as a service».
- **Софт есть?** Частично (Envelio, digital-grid платформы — допущение), для мелких DSO — нет.
- **Ранг:** 4 × 2 × 3 = **24**.

---

## 2. США

### 2.1 FERC Order 881 — ambient-adjusted ratings (AAR)
- **Норма:** Order 881 (декабрь 2021), срок внедрения AAR — 12.07.2025 ([ISO-NE](https://www.iso-ne.com/participate/support/participant-readiness-outlook/ferc-order-no-881-mtlr)).
- **Факт на 09.2026 — ключевой сигнал «обязаны, но не умеют»:** большинство RTO дедлайн сорвали. FERC дал MISO продление до 17.12.2026 (запрошенная внешняя дата — 31.12.2028), PJM — до весны 2026, ISO-NE/SPP/CAISO — до конца 2026, NYISO просил 3 года; названная причина — **«shortage of market software and integration capacity», нехватка квалифицированных вендоров** ([FERC/Rosner](https://www.ferc.gov/news-events/news/commissioner-rosners-concurrence-order-granting-extension-time-re-miso-inc-under), [RTO Insider](https://www.rtoinsider.com/69986-nyiso-asks-ferc-extension-order-881/), [The Relay](https://therelaymag.com/ferc-881-slips-the-aar-and-dlr-race-to-free-capacity)).
- **Кто обязан:** все jurisdictional transmission providers (~200+ компаний, допущение) + члены RTO.
- **Санкция:** несоответствие тарифу FERC; главная боль — обязательный почасовой пересчёт рейтингов на 10 суток вперёд для каждой линии.
- **Софт есть?** Да — Ampacimon, LineVision, Heimdall Power, AspenTech OSI ([Ampacimon](https://www.ampacimon.com/news/ampacimons-go-to-guide-to-ferc-order-881-compliance), [LineVision](https://www.linevisioninc.com/news/ferc-order-881-are-you-prepared), [AspenTech](https://www.aspentech.com/en/resources/blog/why-ems-based-ambient-adjusted-ratings-matter-more-than-ever)) — **но вендорского ресурса физически не хватает** (это зафиксировано в материалах о продлениях MISO). Дефицит не категории, а мощности внедрения: окно для нового игрока до 2027–2028 (следующая волна — DLR NOPR).
- **Ранг:** 3 × 4 × 3 = **36**.

### 2.2 FERC Order 2023 / 2023-A — штрафы за просрочку interconnection studies
- **Норма:** Order 2023 (июль 2023), 2023-A (март 2024): жёсткие дедлайны кластерных исследований (150 дней), штрафы за просрочку в пользу заявителей; устоял в суде (DC Circuit) ([FERC explainer](https://www.ferc.gov/explainer-interconnection-final-rule-2023-A), [White & Case](https://www.whitecase.com/insight-alert/dc-circuit-upholds-interconnection-reforms-ferc-order-no-2023)).
- **Смягчение:** штрафы применяются только с **третьего кластерного цикла** после вступления compliance-филинга + возможность просить relief ([Climate Solutions Law](https://www.climatesolutionslaw.com/2024/03/generator-interconnection-rule-ferc-provides-clarification-and-tweaks-to-order-no-2023/)). ⚠️ Частично отложенный сигнал.
- **Софт есть?** Рынок уже сформировался: Pearl Street (SUGAR/Interconnect), GridUnity (использован CAISO для комплаенса Order 2023), Nira Energy; кейс MISO — автоматизация повторила 2-летнее исследование за 10 дней ([Canary Media](https://www.canarymedia.com/articles/transmission/this-doe-backed-software-is-helping-to-unclog-the-grid), [письма комиссара Rosner в RTO](https://www.ferc.gov/news-events/news/commissioner-rosners-letters-isosrtos-regarding-interconnection-automation)). **Окно сужается — заходить поздно, ниши остаются у не-RTO utilities.**
- **Ранг:** 3 × 3 × 2 = **18**.

### 2.3 Крупные нагрузки / ЦОДы: show cause orders шести RTO (18.06.2026)
- **Норма:** приказы FERC по s.206 FPA от 18.06.2026 всем шести RTO/ISO: за 60 дней — обосновать тарифы или подать изменения под large loads; за 30 дней — информационные отчёты о достаточности генерации; в деле >3500 страниц комментариев от ~175 сторон ([White & Case](https://www.whitecase.com/insight-alert/ferc-orders-grid-operators-promptly-revise-or-justify-interconnection-rules-data), [McGuireWoods](https://www.mcguirewoods.com/client-resources/alerts/2026/6/ferc-issues-section-206-show-cause-orders-directing-all-six-rtos-isos-to-justify-or-reform-large-load-integration-rules/), [Bracewell](https://www.bracewell.com/resources/ferc-show-cause-orders-data-center-interconnection/)).
- **Статус:** тарифные филинги — август–сентябрь 2026, содержание обязательств для девелоперов ЦОДов (депозиты, milestone-требования, curtailability) кристаллизуется прямо сейчас. Прямых обязанностей «со штрафом» ещё нет — **преждевременно для комплаенс-продукта, зато идеально для intelligence-продукта** (мониторинг 6 тарифов + очередей для сотен девелоперов ЦОДов).
- **Ранг:** 4 × 2 × 4 = **32** (как intelligence, не комплаенс).

### 2.4 NERC CIP-015 (INSM)
- **Норма:** утверждён FERC 26.06.2025, в силе с 02.09.2025; первые дедлайны — control centers к 01.10.2028, остальные к 2030 ([Nozomi](https://www.nozominetworks.com/blog/preparing-for-nerc-cip-015-1-internal-network-security-monitoring-for-electric-utilities), [MRO](https://www.mro.net/reliability-standard-cip-015-1-and-the-internal-network-security-monitoring-insm-journey/)). Санкции NERC — до $1 млн/день за нарушение (стандартный потолок NERC; допущение — в источниках выдачи не проверял).
- **Софт есть?** Да, плотно: Dragos, Nozomi, Forescout, Darktrace, Claroty. **Белого пятна нет.**
- **Ранг:** 3 × 5 × 1 = **15**.

---

## 3. Великобритания

### 3.1 Реформа очереди подключений TMO4+ / Gate 2 (2025–2026)
- **Норма:** пакет TMO4+ одобрен Ofgem в апреле 2025 ([Summary Decision](https://www.ofgem.gov.uk/sites/default/files/2025-04/Summary-Decision-Document-TMO4-package.pdf)); принцип «first ready and needed, first connected». Gate 2 Criteria Methodology (ред. 19.12.2025, [NESO](https://www.neso.energy/document/375016/download)).
- **Новые обязанности заявителей:** каждый проект с офером (transmission + крупные distribution) обязан подать Readiness Declaration с доказательствами прав на землю («land route») или прогресса планирования («planning route») + соответствие strategic alignment (CPAP до 2035). Окна подачи: с мая 2025 (distribution), июль 2025 — Gate 2 Whole Queue; окно продлевали из-за «technical and operational challenges» ([NESO evidence handbook](https://www.neso.energy/industry-information/connections-reform/evidence-handbook-and-other-g2wq-submission-resources), [reNews](https://renews.biz/102076/neso-extends-gate-2-connections-evidence-window/)).
- **Кто обязан:** вся очередь — тысячи проектов (очередь GB >700 ГВт; число проектов ~ тысячи — допущение). Это повторяющийся процесс: новые окна, milestone-мониторинг, ре-подтверждения.
- **Санкция:** предельно жёсткая рыночно — **потеря места в очереди / перевод в Gate 1** = смерть проекта.
- **Чем закрывают:** консультанты (Blake Clough и т.п.) + юристы + Excel. **Специализированного софта «evidence pack / queue position manager» не нашёл** — белое пятно.
- **Ранг:** 4 × 5 × 4 = **80**.

### 3.2 Ofgem commitment fee для ЦОДов
- **Норма:** консультация «Curate – Demand Connections Reform» от 29.07.2026, открыта до 16.09.2026: upfront-фи £237 500–712 500 за МВт (возврат при энергизации, потеря при выходе из очереди) + milestone-требования к финансовой и коммерческой зрелости; demand-очередь выросла с 41 ГВт (11.2024) до 125 ГВт (06.2025), из них ≥80 ГВт — ЦОДы ([Ofgem](https://www.ofgem.gov.uk/consultation/proposed-data-centre-connection-reforms), [Slaughter and May](https://www.slaughterandmay.com/insights/new-insights/pay-to-stay-ofgem-s-plan-to-cull-the-data-centre-connection-queue/)).
- **Статус:** ещё консультация — обязанности нет. Но с деньгами такого размера на кону milestone-комплаенс девелоперов ЦОДов станет обязательным. **Наблюдать; решение ожидаемо к 2027.**
- **Ранг (сегодня):** 2 × 4 × 4 = **32** (потенциал выше после решения).

---

## 4. Индия

### 4.1 Энергоаудиты и энергоучёт DISCOM (BEE) — ⚠️ наполовину ложный сигнал
- **Норма:** квартальный energy accounting (45 дней) и ежегодный аудит (4 месяца после конца ФГ) для DISCOM по регламентам BEE в рамках Energy Conservation Act 2001; регламенты 2021/2022, новый draft в Gazette 15.04.2026 ([Mercom](https://www.mercomindia.com/bee-proposes-mandatory-energy-audits-and-quarterly-accounting-for-discoms), [PSU Watch](https://psuwatch.com/national-news/power-ministry-mandates-energy-accounting-discoms-every-quarter-every-year), [Legitquest, регламент 2022](https://www.legitquest.com/act/bureau-of-energy-efficiency-manner-and-intervals-for-conduct-of-energy-audit-in-electricity-distribution-companies-amendment-regulations-2022/c435)).
- **Кто обязан:** ~60–70 DISCOM (допущение).
- **Санкция:** формально штрафы по s.26 EC Act, но обязанность существует с 2021 года, а публичных наказаний DISCOM за неисполнение не нашёл — **исполнение слабое, платёжеспособность DISCOM низкая**. Классический «на бумаге есть — на практике не карается». Не строить, пока новый регламент 2026 не получит зубы.

### 4.2 Resource Adequacy (Rule 16 Electricity (Amendment) Rules 2022 + Guidelines 06.2023)
- DISCOM обязаны готовить 10-летние LT-DRAP с веттингом CEA, показывать 100%/90% tie-up на 1-й/2-й год ([PIB](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1936026&reg=48&lang=2)). CEA уже публикует RA-планы по конкретным DISCOM (2026). Санкция — регуляторное давление SERC, прямых штрафов не нашёл. Инструменты — западные RA/капмоделирование (Plexos и пр.) дорого для DISCOM; **ниша для дешёвого RA-моделирования есть, но платёжеспособность покупателя сомнительна.** Ранг: 3 × 2 × 4 = 24, с дисконтом за платёжеспособность.

---

## 5. Бразилия

### 5.1 ANEEL: перенос расчёта нетехнических потерь с «faturado» на «medido» (11.03.2025)
- **Норма:** решение ANEEL от 11.03.2025 — нетехнические потери и energia requerida считаются от измеренного, а не выставленного рынка, с учётом MMGD; применяется с тарифных процессов 2025 ([ANEEL](https://www.gov.br/aneel/pt-br/assuntos/noticias/2025/aneel-aperfeicoa-o-calculo-da-energia-requerida-para-adaptar-efeitos-da-mmgd-ao-calculo-da-compra-de-energia-das-distribuidoras), [Poder360](https://www.poder360.com.br/poder-energia/aneel-muda-metodologia-do-calculo-de-perdas-nao-tecnicas-de-energia/), [Canal Energia](https://www.canalenergia.com.br/noticias/53305365/aneel-altera-regra-sobre-perdas-nao-tecnicas-de-distribuidoras)).
- **Оценка:** это не обязанность со штрафом, а изменение тарифной методики (~50+ дистрибьюторов). ⚠️ Как комплаенс-сигнал — ложный; как продуктовый — умеренный: усиливается ценность аналитики «medido vs faturado» и loss detection (рынок уже занят AMI/аналитикой). Ранг: 3 × 2 × 2 = 12.
- Требования ANEEL к качеству обслуживания 2025–2026 отдельно **не верифицировал** — не включаю (дисциплина «не выдумывать»).

---

## 6. Залив

- **Саудовская Аравия:** NCA OTCC-1:2022 — обязательные OT-контроли для критической инфраструктуры, включая энергетику; ECC как база ([Vision2030/NCA обзор](https://vision2030.ai/sectors/technology/cybersecurity/)).
- **ОАЭ:** IAS v2 (обновление 2025, 188 контролей; усиление OT и supply chain), DESC ISR v3; штрафы AED 100 тыс. — 3 млн, ответственность менеджмента ([обзор](https://cybersecuritysolutions.ae/uae-mandatory-cyber-resilience-compliance-guide/)).
- **Оценка:** обязанные — десятки крупных госкомпаний (SEC, DEWA, TAQA, Aramco-периметр); закупают глобальных OT-вендоров и интеграторов; рынок закрыт, вход через локальных партнёров. Точные дедлайны 2025–2028 по энергосектору в первоисточниках не подтвердил — **помечаю как непроверенное**. Ранг: 1 × 3 × 2 = 6.

---

## 7. Россия

### 7.1 ПП № 1125 от 22.08.2024: приём заявок на техприсоединение через ЕПГУ с 01.01.2026
- **Норма:** ПП РФ № 1125 (изменения в ПП № 861), в силе с 01.01.2026: заявки на ТП ко **всем** электросетевым компаниям — через Госуслуги ([Гарант](https://www.garant.ru/products/ipo/prime/doc/409474791/), [КонсультантПлюс](https://www.consultant.ru/law/hotdocs/86149.html)).
- **Кто обязан:** все ТСО (после консолидации — порядка сотен организаций; точное число на 2026 не нашёл, допущение ~600–1000) — каждой нужна интеграция ЛК с ЕПГУ/СМЭВ.
- **Санкция:** нарушение правил ТП — административная ответственность (ст. 9.21 КоАП, штрафы на юрлиц за каждый случай; точные суммы здесь не привожу — не сверял редакцию) + риск несоответствия критериям ТСО.
- **Чем закрывают:** дедлайн уже наступил; малые ТСО закрывают наспех — интеграторы уже продают кейсы интеграции с ЕПГУ ([ИБР](https://ibsco.ru.com/keys/tekhnologicheskie-prisoedineniya/keys-po-integratsii-s-portalom-gosuslug9672.html), профильные гайды [tp-seti.ru](https://tp-seti.ru/blog/integratsiya-lichnogo-kabineta-s-epgu-dlya-territorialnykh-setevykh-organizatsiy-polnoe-rukovodstvo-/)).
- **Софт есть?** Заказные интеграции есть, коробочного SaaS «ЛК ТП + ЕПГУ для малых ТСО» — на виду нет. Белое пятно среднего размера; рынок рублёвый и сжимающийся (консолидация ТСО). Ранг: 3 × 3 × 3 = **27**.

### 7.2 СТСО (закон с 01.09.2024)
- В каждом регионе — системообразующая ТСО: единое окно для потребителей, подхват бесхозяйных сетей, ликвидация аварий чужих ТСО, модель «котёл сверху» ([КонсультантПлюс](https://www.consultant.ru/law/hotdocs/85569.html), [ст. 46.4 закона об электроэнергетике](https://www.consultant.ru/document/cons_doc_LAW_41502/189336977faec04bce83d4b8245fc796a905f0de/)). Обязанных ~85 (по одной на регион) — это крупные «Россети»-структуры с внутренней разработкой. ⚠️ Для стороннего вендора — слабый сигнал (мало покупателей, госзакупки). Ранг: 1 × 3 × 2 = 6.

### 7.3 Интеллектуальный учёт (522-ФЗ) 
- Обязанность ГП/сетевых по ИСУ с 2020/2021; с 01.01.2023 — штраф за непредоставление доступа к минимальному набору функций ИСУ ([Гарант](https://www.garant.ru/consult/account/1506939/), [522-ФЗ](http://www.kremlin.ru/acts/bank/43868)). Рынок приборов и ПО зрелый (Энергомера и др.), обязанность не новая. ⚠️ Не «свежая волна». Ранг: 3 × 2 × 1 = 6.

---

## Некролог (проверка на смертность ставки на регуляторную волну)

1. **Planetly** (Берлин, carbon accounting): куплена OneTrust, через год закрыта целиком, ~200 сотрудников уволены (11.2022) ([Axios](https://www.axios.com/pro/climate-deals/2022/11/04/planetly-shuts-down-layoffs-carbon-accounting), [TechCrunch](https://techcrunch.com/2024/10/09/unhappy-with-their-exit-these-ex-planetly-employees-are-using-ai-to-refine-carbon-accounting)). Ставка на добровольную/грядущую отчётность умерла раньше, чем отчётность стала обязательной.
2. **Omnibus-обвал CSRD-рынка (2025–2026):** scope non-EU срезан с ~10 000 до ~1200 компаний, датапоинты с 1100 до ~400–500, сроки +2 года; вендоры месяцами перестраивали продукты; Morningstar Sustainalytics сократила 10–12% штата ([ESG Today](https://www.esgtoday.com/omnibus-cuts-non-eu-companies-in-the-scope-of-csrd-from-10000-to-1200-efrag/), [Coolset](https://www.coolset.com/academy/best-esg-reporting-software-tools), [Sustainable Tech Partner](https://sustainabletechpartner.com/news/sustainability-layoffs-who-is-cutting-green-it-and-climate-technology-jobs/2/)). Волна консолидации carbon-accounting стартапов шла уже с 2023 ([Sifted](https://sifted.eu/articles/carbon-accounting-startups-acquisition)).
- **Урок:** отчётно-раскрывающие мандаты (disclosure) политически хрупки — их режут при смене ветра. **Технико-операционные мандаты** (AAR-рейтинги, кибер-контроли сетей, процессы очереди подключений) переживают политику: их нельзя «отменить омнибусом», не тронув физику сети.

## Ложные сигналы (сводно)
- CSRD для энергетики — срезан Omnibus (см. некролог).
- Индийские энергоаудиты DISCOM — обязанность с 2021, наказаний не видно, покупатель неплатёжеспособен.
- FERC Order 2023 штрафы — отложены до 3-го кластерного цикла + relief-механизм; рынок инструментов уже занят.
- ANEEL «faturado→medido» — методика тарифа, не санкционируемая обязанность.
- 522-ФЗ ИСУ — волна 2020 года, рынок зрелый.
- Hosting capacity ЕС — обязанность есть, санкции мягкие; строить можно только как продажу «ценности» (быстрее продавать мощность), не как комплаенс.

---

## Итоговая таблица (ранжирование: обязанные × санкция × отсутствие инструментов, каждый 1–5)

| # | Обязанность | Юрисдикция | Кто обязан (≈) | Срок | Санкция | Инструменты сейчас | N×S×G | Балл |
|---|---|---|---|---|---|---|---|---|
| 1 | **Gate 2 / TMO4+: readiness-доказательства и milestone-комплаенс очереди** | UK | тысячи проектов | окна с 2025, далее постоянно | потеря места в очереди | консультанты + Excel | 4×5×4 | **80** |
| 2 | **FERC 881: AAR** | США | ~200+ TP | 12.07.2025 → продления до конца 2026–2028 | несоответствие тарифу; продления кончаются | вендоры есть, мощности внедрения не хватает | 3×4×3 | **36** |
| 3 | **FERC large loads (show cause 06.2026) → тарифные обязанности ЦОДов** | США | 6 RTO + сотни девелоперов | филинги 08–09.2026 | s.206 FPA | ничего (нормы рождаются) | 4×2×4 | **32** |
| 4 | **Ofgem commitment fee ЦОДов (£237–712 тыс./МВт)** | UK | сотни проектов ЦОД | консультация до 16.09.2026 | потеря фи/очереди (после решения) | ничего | 2×4×4 | **32** |
| 5 | **NCCS 2024/1366: CSMS, риск-отчёты** | ЕС | сотни entities | нотификация 09.2027, отчёты 09.2028 | нацнадзор, аудиты | ИБ-службы + Big4, спецсофта нет | 2×3×5 | **30** |
| 6 | **ПП 1125: ЕПГУ для техприсоединения** | РФ | сотни ТСО | 01.01.2026 (наступил) | ст. 9.21 КоАП, риск статуса ТСО | заказные интеграции | 3×3×3 | **27** |
| 7 | NIS2 (энергосектор) | ЕС | тысячи | действует | до €10 млн / 2% | GRC-рынок насыщен | 5×5×1 | 25 |
| 8 | Hosting capacity transparency | ЕС | ~2400 DSO + TSO | действует | мягкая | частично | 4×2×3 | 24 |
| 9 | Resource Adequacy DISCOM | Индия | ~60 DISCOM | ежегодно | мягкая | дорогие западные модели | 3×2×4 | 24 |
| 10 | FERC Order 2023 штрафы за studies | США | ~200 TP | с 3-го цикла | штрафы заявителям | Pearl Street, GridUnity, Nira | 3×3×2 | 18 |
| 11 | NERC CIP-015 INSM | США/Канада | сотни | 10.2028/2030 | до $1 млн/день (допущение) | Dragos, Nozomi и др. | 3×5×1 | 15 |
| 12 | ANEEL perdas medido | Бразилия | ~50 | тарифы 2025+ | нет (методика) | AMI-аналитика | 3×2×2 | 12 |
| 13 | Залив (OTCC/IAS v2) | KSA/UAE | десятки | не подтв. | AED до 3 млн | глобальные OT-вендоры | 1×3×2 | 6 |
| 14 | СТСО | РФ | ~85 | с 09.2024 | регуляторная | внутренняя разработка | 1×3×2 | 6 |

## Топ-3 «горящих»

1. **UK: комплаенс очереди подключений (Gate 2 → milestone-режим → Ofgem fee для ЦОДов).** Тысячи проектов обязаны периодически доказывать readiness (земля/планирование/финансы), цена ошибки — место в очереди, а с 2027 ещё и сотни тысяч фунтов за МВт. Сегодня это консультанты и вручную собранные evidence packs; окно NESO в 2025 продлевали из-за операционного хаоса — прямое свидетельство «обязаны, но не умеют». Специализированного SaaS не видно. Бонус: паттерн реплицируется (ЕС реформирует подключения тем же курсом — guidance C(2025) 8473; FERC — show cause по large loads).
2. **США: FERC 881 (и следом DLR).** Уникальный случай, где регулятор письменно зафиксировал: дедлайн сорван из-за нехватки софта и вендорских мощностей. Продления заканчиваются в 2026–2028 — покупатели обязаны купить в этом окне. Вход не в категорию с нуля, а в дефицит capacity: лёгкий AAR-движок/интеграция для не-RTO utilities и отстающих TO.
3. **ЕС: NCCS (Регламент 2024/1366).** Ближайший структурный аналог EU AI Act в энергетике: регламент уже в силе, методологии выходят в 2026, назначение обязанных — к 09.2027, первые риск-отчёты — 09.2028. Категория «NCCS-комплаенс для high/critical-impact entities» пока пуста — generic GRC не покрывает ECII, cross-border risk reports и CSMS-артефакты. Риск: число обязанных — сотни, не тысячи; санкционный механизм национальный и пока мягче NIS2.

**Сквозной вывод:** строить на технико-операционных мандатах (очереди подключений, рейтинги линий, сетевые кибер-контроли) — они переживают политические откаты; избегать disclosure-мандатов (некролог CSRD/Planetly).
