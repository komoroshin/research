# IC-3.5 — Доступ к рынку и юнит-экономика: сервис расчёта Ausfallarbeit (Redispatch 2.0)

Дата проверки: 01.09.2026. Роль: исследователь-скептик, задача — опровергнуть утверждение.

**Проверяемое утверждение:** «Немецкий частный рынок операторов ВИЭ доступен команде российского происхождения, и юнит-экономика сервиса складывается: чек на установку × число установок дают рынок, оправдывающий построение бизнеса».

---

## ВЕРДИКТ: УТВЕРЖДЕНИЕ ОПРОВЕРГНУТО ПО ОБЕИМ ЧАСТЯМ

1. **Экономика не складывается.** Весь пул компенсаций ВИЭ-операторам за redispatch в 2025 г. — 433 млн € и он **сократился на 22% год к году**; 1–3% от него = 4,3–13 млн € — это потолок выручки при захвате 100% рынка, т.е. сам TAM ниже или на границе порога «≥10 млн € SAM». Ценовой якорь ничтожен: полный аутсорсинг ролей EIV/BTR стоит 250–275 €/год за установку, а сама Betriebsführung — ~9 €/кВт/год.
2. **Ниша уже занята немецким инкумбентом.** node.energy (Франкфурт) подняла 15 млн € Series B (04.2025), её софт opti.node стоит на >14 000 wind/PV-установок (~⅓ всей немецкой зелёной генерации) и уже включает модуль redispatch-мониторинга/абрахования — ровно то, что предлагает гипотеза. Плюс Cernion, easyEIV, bi-web, 50komma2 и сами директ-маркетёры.
3. **Доступ структурно ухудшился, а не «затруднён».** 03.12.2025 ЕС внёс Россию в список высокорисковых юрисдикций по AML → **обязательный** Enhanced Due Diligence для любых клиентов/бенефициаров «с российскими связями» у всех обязанных субъектов ЕС. Задокументирована практика: немецкие банки замораживают счета россиян и **расторгают счета GmbH из-за российского участника**.
4. **Регуляторный риск против самого пула денег:** обсуждаемый «Redispatch-Vorbehalt» (Netzpaket 2026) может лишить новые установки компенсаций вообще — база сервиса («мы помогаем получить компенсацию») сжимается политически.

---

## ЧАСТЬ А — ДОСТУП

### А1. KYC/комплаенс и де-рискинг банков

**Найдено (структурный, самый тяжёлый факт):**
- 03.12.2025 Еврокомиссия добавила РФ в список высокорисковых третьих стран по AML/CFT (Delegated Regulation в развитие (EU) 2025/1393). Следствие: обязанные субъекты (банки, нотариусы, аудиторы) обязаны применять **Enhanced Due Diligence** к клиентам, транзакциям и **бенефициарным владельцам** с российскими связями. Это не «настроение рынка», а норма права.
  - Источники: [пресс-релиз Еврокомиссии IP/25/2910](https://ec.europa.eu/commission/presscorner/detail/en/ip_25_2910); [Squire Patton Boggs, 12.2025 «Hard-wiring Russia Risk Into EU Law»](https://www.squirepattonboggs.com/en/insights/publications/2025/12/hard-wiring-russia-risk-into-eu-law); [VinciWorks](https://vinciworks.com/blog/russia-added-to-the-eu-aml-high-risk-list-what-compliance-teams-need-to-know/).
- Практика немецких банков: волна блокировок/ограничений счетов лиц с российским гражданством (Sparkasse, Deutsche Bank, Commerzbank, N26), включая давних резидентов и даже граждан ФРГ; 12 из 20 опрошенных банков ссылались на санкционные пакеты. Разморозка занимает недели.
  - Источник: [United24 Media, 2026 «German Banks Freeze Russian Clients' Accounts»](https://united24media.com/world/german-banks-freeze-russian-clients-accounts-citing-sanctions-and-money-laundering-risks-18742); [United24 Media, 2026 — общеевропейская «чистка» счетов россиян](https://united24media.com/world/portugal-largest-bank-begins-mass-closure-of-accounts-held-by-russians-19839).
- **Прямо про юрлица:** немецкие адвокаты в 2026 г. публикуют типовые памятки «Konto gekündigt wegen russischem Gesellschafter» — банки расторгают/отказывают в расчётных счетах GmbH из-за российского участника, часто без объяснений. Юридически это оспоримо, но сам факт массовости практики подтверждён существованием таких Rechtstipps.
  - Источник: [anwalt.de, Rechtstipp 272663, 2026](https://www.anwalt.de/rechtstipps/konto-gekuendigt-wegen-russischem-gesellschafter-2026-rechte-der-gmbh-und-sofortmassnahmen-272663.html); также [Rechtstipp 238663](https://www.anwalt.de/rechtstipps/konto-gesperrt-wegen-russland-sanktionen-was-banken-duerfen-und-was-nicht-238663.html).
- Санкционная норма (ст. 5b Reg. 833/2014): запрет на приём депозитов >100 000 € от граждан РФ **без** вида на жительство/гражданства ЕС. Т.е. основатель с ВНЖ ЕС формально выведен из-под запрета — но банк всё равно обязан вести EDD (см. выше), и на практике перестраховывается.
  - Источник: [Bundesbank, Finanzsanktionen Russland/Ukraine](https://www.bundesbank.de/de/service/finanzsanktionen/sanktionsregimes/-/russland-ukraine-610842).

**Оценка для гипотезы:** юрлицо вне РФ не снимает проблему — EDD привязан к бенефициарам. Открытие счёта для GmbH с бенефициарами-гражданами РФ (даже с ВНЖ ЕС) — реалистично, но с задержками, риском немотивированного отказа/расторжения и постоянными compliance-запросами. Для B2B-продаж энергокомпаниям это же означает, что **vendor-onboarding у клиента** будет спотыкаться о sanctions-screening поставщика (у Mittelstand-энергетиков это стандартная анкета по цепочке поставок). Публичных данных именно о практике vendor-KYC немецких энерго-Mittelstand к «вендорам с РФ-корнями» — **не нашёл** (валидный ответ); косвенные индикаторы (AML-лист, банковская практика) — негативные.

### А2. Прецеденты: софт-вендоры с российскими основателями в немецкой энергетике после 2022

**НЕ НАШЁЛ** — ни задокументированных успехов, ни задокументированных отказов. Поиски по «Russian founders software Germany energy sanctions KYC refuse» дают только общий санкционный контекст. Это само по себе сигнал: (а) позитивных кейсов, на которые можно сослаться в продажах, нет; (б) рынок немецкого энергософта в этой нише полностью занят немецкими/скандинавскими/американскими игроками (см. А3). Допущение: отсутствие кейсов трактую как «против» гипотезы, потому что бремя доказательства доступа лежит на утверждении.

### А3. Локальное присутствие: язык, GmbH, сейлз

- Вся нормативно-процессная база — на немецком: [BDEW-Leitfaden по расчёту Ausfallarbeit (47 стр., немецкий)](https://www.bdew.de/media/documents/Awh_2020-05_RD_2.0_LF_Ausfallarbeit.pdf), FAQ сетевых операторов, форматы рыночной коммуникации (MaKo/EDI@Energy). Продукт без немецкоязычной команды невозможен даже технически (парсинг документов, поддержка клиентов, переписка с ~860 сетевыми операторами).
- Как заходят иностранцы: **через покупку локальных игроков или локальные офисы**. Power Factors (США) купил Greenbyte (Швеция, 2021) и **3megawatt (Мюнхен, 2012 г. осн.)** — т.е. немецкий рынок обслуживается через немецкую компанию в составе группы. Источники: [Power Factors/Greenbyte, 14.04.2021](https://www.powerfactors.com/news/power-factors-greenbyte-combine-form-market-leader), [PV Tech](https://www.pv-tech.org/power-factors-acquires-greenbyte-in-renewables-software-tie-up/). По Bazefield (Норвегия) немецких клиентов **не нашёл**.
- Оценка (допущение на базе структуры рынка): немецкий GmbH юридически не обязателен (продавать можно из любой страны ЕС), но немецкоязычный сейлз и поддержка — обязательны де-факто; покупатель (Betriebsführer/Direktvermarkter) консервативен и выбирает между локальными вендорами, у которых уже есть референсы.

### А4. Данные, SCADA, KRITIS/NIS2

- Сервис работает с Lastgang/замерами и мастер-данными установки. Если сервис **только считает и биллит** (без централизованного управления установками) — под определение критической инфраструктуры он, по-видимому, не подпадает.
- Но: в BSI-KritisV введено понятие **«digitale Energiedienste»** — «система, обеспечивающая центральный, межплощадочный доступ к управлению или прямому влиянию на энергоустановки». Технические операторы/системы с управляющим доступом к SCADA под него «вероятно часто подпадают» (оценка юристов). Порог KRITIS для генерации — 104 МВт **агрегированной** мощности (36 МВт для преквалифицированных на первичный резерв). EIV с управляющим доступом к портфелю >104 МВт — кандидат в KRITIS → требования §11 EnWG / IT-Sicherheitskatalog, аудиты BNetzA/BSI.
  - Источники: [Taylor Wessing о KritisV и ВИЭ, 06.2022](https://www.taylorwessing.com/en/insights-and-events/insights/2022/06/kritisv-erneuerbare-energien-anlagen-als-kritische-infrastruktur); [OpenKRITIS, сектор Energie](https://www.openkritis.de/it-sicherheitsgesetz/sektor_energie.html); [FAQ BSW-Solar по NIS-2/KRITIS-Dachgesetz, 05.06.2026](https://www.solarwirtschaft.de/datawall/uploads/2026/06/20260605_FAQ-NIS2_KritisDach_BSW_aktualisiert-1.pdf); [vbvh о реализации NIS-2](https://www.vbvh.de/news/die-umsetzung-von-nis-2-aenderungen-fuer-kritische-anlagen-besonders-wichtige-und-wichtige-einrichtungen/).
- Явного «фильтра происхождения» (гражданство владельцев вендора) в NIS2/KRITIS — **не нашёл**; такой фильтр существует только для «критических компонентов» (§9b BSIG, телеком-кейс Huawei). Но NIS2 требует от операторов управления рисками **цепочки поставок**, т.е. происхождение вендора попадает в риск-оценку клиента опосредованно (допущение: это будет использоваться против вендора с РФ-бенефициарами при прочих равных).

**Итог А:** рынок формально открыт (Art 5k тут не действует), но три слоя трения — обязательный EDD с 12.2025, банковский де-рискинг, vendor-risk-скрининг клиентов — делают доступ дорогим и медленным, а прецедентов успеха нет. Для сегмента, где альтернатива — локальный вендор в одном клике, это фактический барьер.

---

## ЧАСТЬ Б — ЮНИТ-ЭКОНОМИКА

### Б5. SAM: сколько установок и кто ими управляет

- Под Redispatch 2.0 подпадают **все** EE/KWK-установки от 100 кВт (плюс дистанционно управляемые <100 кВт) — это сотни тысяч установок формально, но точной официальной цифры «затронутых регулярно» **не нашёл**; BNetzA публикует объёмы (ГВт·ч), не число установок. Источники: [BDEW Redispatch 2.0](https://www.bdew.de/energie/redispatch-20/), [EWE Netz](https://www.ewe-netz.de/einspeiser/strom/redispatch-ganzheitlich/redispatch-ueber-100-kw).
- Регулярно затронуты прежде всего ветер (14 454 из 22 777 ГВт·ч сокращений выработки в 2024 г. — ветер; источник: [BWE Faktencheck Redispatch, 21.04.2026, PDF](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/04-politische-arbeit/01-gesetzgebung/20260421_Faktencheck_Redispatch.pdf)) и растуще PV (Q2 2025: 1 168 ГВт·ч, ×1,9 к Q2 2024; [ZfK по данным BNetzA](https://www.zfk.de/energie/strom/redispatch-2025-pv-abregelung-verteilnetz)). География концентрирована: только SH Netz (Шлезвиг-Гольштейн) в 2025 г. — 802 ГВт·ч сокращений, ~74,2 млн € выплат ([отчёт земли SH](https://www.schleswig-holstein.de/DE/fachinhalte/N/netzausbau/engpassmanagement)).
- **Концентрация покупателей — ключевой факт против «тысяч мелких чеков»:**
  - Роль EIV в большинстве случаев исполняет **директ-маркетёр** (подтверждают FAQ сетевых операторов: [NRM Netzdienste](https://www.nrm-netzdienste.de/de/einspeisungen/strom/faq-redispatch-2-0/aufgaben-und-pflichten-anlagenbetreibende-eiv-und-btr), [Netze BW](https://www.netze-bw.de/stromeinspeisung/redispatch)). Топ-5 директ-маркетёров 2025: Quadra 10 100 МВт, EnBW 9 900, Next Kraftwerke 8 020, Statkraft 6 800, Danske Commodities 6 600 ([ZfK, рейтинг 2025](https://www.zfk.de/unternehmen/ranking-die-zwanzig-groessten-direktvermarkter-2025)). Т.е. десятки ГВт «сидят» у ~20 компаний.
  - Betriebsführung тоже консолидирована: wpd windmanager — 6 011 МВт, 507 ветропарков, 2 721 турбина ([iwr.de, 2022](https://www.iwr.de/ticker/naechster-meilenstein-wpd-windmanager-knackt-in-der-betriebsfuehrung-6-gw-marke-artikel4706)); ENERTRAG Betrieb — >1 200 турбин; VSB — 1,3 ГВт; energy consult — >900 турбин / 2,8 ГВт ([windbranche.de, каталог Betriebsführung](https://www.windbranche.de/firmen/info-314-betriebsfuehrung)).
  - Вывод: продавать придётся не «тысячам операторов», а **нескольким десяткам управляющих/маркетёров**, у каждого из которых уже есть процесс и/или софт (см. Б6) — классический рынок «сотни логотипов, но 30 реальных сделок».

### Б6. Ценовой якорь

- Полный аутсорсинг ролей **EIV+BTR** (т.е. вся redispatch-обязанность целиком): базовый тариф **275 €/год + НДС за установку**, альтернативные провайдеры — **250 €/год** ([KommEnergie, страница Redispatch 2.0](https://www.kommenergie.de/netz/stromeinspeisung/redispatch-2-0.html)); директ-маркетёры часто включают EIV в договор ДМ «бесплатно». Расчётный модуль — лишь часть этой обязанности, т.е. правдоподобный чек за «только расчёт Ausfallarbeit + счёт» — **порядка 100–500 €/год на установку** для мелких и низкие тысячи € на портфель для профуправляющих (допущение, интерполяция от якоря 250–275 €).
- Betriebsführung целиком: **~9 €/кВт/год** (в структуре OPEX ~28 €/кВт на обслуживание, 13 €/кВт аренда, 9 €/кВт Betriebsführung; [Nefino, OPEX Windpark](https://nefino.de/was-sind-betriebskosten-windpark-opex/); [Fraunhofer IEE Windmonitor, Betriebskosten](https://windmonitor.iee.fraunhofer.de/windmonitor_de/3_Onshore/5_betriebsergebnisse/4_betriebskosten/)). Для типовой турбины 4 МВт это ~36 000 €/год **за всё управление** — redispatch-модуль не может стоить больше единиц процентов от этого.
- Инкумбент node.energy монетизирует redispatch как **модуль внутри платформы** opti.node, а не отдельный продукт ([Solarserver, 05.03.2026](https://www.solarserver.de/2026/03/05/redispatch-abrechnung-anlagenbetreiber-ab-2026-in-der-verantwortung/); [pv magazine, 06.03.2026](https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/)). Публичных цен **не нашёл** — но структурно это фича платформы, что само по себе аргумент «feature, not a company».

### Б7. Санити-чек рынка

- Пул компенсаций ВИЭ-операторам за redispatch в 2025 г.: **~433 млн €, минус 22% к 2024 г.** (данные BNetzA; [ZfK, «Redispatch-Zahlen 2025»](https://www.zfk.de/energie/strom/redispatch-2025-pv-abregelung-verteilnetz)). Для сверки: Q2 2025 — ~158 млн € ([SMARD](https://www.smard.de/page/home/topic-article/444/217642/uneinheitliche-entwicklungen)); общие затраты на управление перегрузками 2025 — ~3,1 млрд €, но ~85%+ из них — не компенсации ВИЭ, а затраты на замещающую генерацию ([SMARD, годовой обзор](https://www.smard.de/page/home/topic-article/444/219906/massnahmenvolumen-im-gesamtjahr-stabil); [Cleanthinking, Faktencheck](https://www.cleanthinking.de/faktencheck-redispatch-drei-milliarden/)).
- **Потолок по модели «% от компенсации»:** 1–3% × 433 млн € = **4,3–13 млн €/год при 100% захвате рынка**. При реалистичной доле 10–20% через 5 лет → 0,4–2,6 млн €/год. Ниже порога «≥10 млн € SAM» — причём это TAM, а не SAM.
- **Потолок по модели «фикс за установку»:** даже гипотетические 100 000 установок × 300 €/год = 30 млн € — но это рынок **всей** роли EIV/BTR, уже разобранный директ-маркетёрами и сервисами типа easyEIV; адресуемый расчётно-биллинговый остаток — доли этого.
- Динамика против гипотезы: пул **сжимается** (−22% в 2025), а Netzpaket/«Redispatch-Vorbehalt» (обсуждается в 2026) грозит вовсе лишить новые установки права на компенсацию — т.е. таргетируемая боль может быть частично ликвидирована законодателем ([Agora Energiewende о Redispatch-Vorbehalt](https://www.agora-energiewende.de/aktuelles/warum-der-geplante-redispatch-vorbehalt-fuer-erneuerbare-die-energiewende-ausbremst); [energie-experten.org](https://www.energie-experten.org/news/netzpaket-redispatch-vorbehalt-koennte-energiewende-blockieren-warum)).
- Единственный аргумент «за», найденный честно: с **23.12.2025** (новелла EnWG, §14) операторы должны **сами** требовать компенсацию у сетевого оператора (раньше это шло через директ-маркетёров/фин. ausgleich), у многих сетевых операторов нет процессов, ~10% расчётов исторически ошибочны — окно боли реально ([pv magazine, 06.03.2026](https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/); [Cernion об ошибках в Stammdaten](https://cernion.de/insights/redispatch-ausfallarbeit-haftungsrisiko)). Но это окно уже закрывают node.energy (>14 000 установок под управлением софта, 15 млн € Series B 04.2025; [pv magazine, 23.04.2025](https://www.pv-magazine.de/2025/04/23/node-energy-erhaelt-15-millionen-euro-frisches-kapital/)), Cernion, easyEIV ([easy-eiv.de](https://www.easy-eiv.de/)), bi-web ([bi-web.de](https://www.bi-web.de/de/loesung/redispatch2.0-einsatzverantwortlicher-eiv-btr/)), r-energy, 50komma2 — все немецкие, с готовыми клиентскими базами.

---

## СВОДНАЯ ТАБЛИЦА ЧИСЕЛ

| Показатель | Значение | Источник |
|---|---|---|
| Компенсации ВИЭ за redispatch, 2025 | ~433 млн €, −22% г/г | BNetzA via [ZfK](https://www.zfk.de/energie/strom/redispatch-2025-pv-abregelung-verteilnetz) |
| Компенсации ВИЭ, Q2 2025 | ~158 млн € | [SMARD](https://www.smard.de/page/home/topic-article/444/217642/uneinheitliche-entwicklungen) |
| Все затраты Engpassmanagement 2025 / пик 2022 | ~3,1 / 4,1 млрд € | [SMARD](https://www.smard.de/page/home/topic-article/444/219906/massnahmenvolumen-im-gesamtjahr-stabil) |
| Сокращения выработки 2024, ветер | 14 454 из 22 777 ГВт·ч | [BWE Faktencheck 04.2026](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/04-politische-arbeit/01-gesetzgebung/20260421_Faktencheck_Redispatch.pdf) |
| Аутсорс EIV+BTR, цена | 250–275 €/год/установка + НДС | [KommEnergie](https://www.kommenergie.de/netz/stromeinspeisung/redispatch-2-0.html) |
| Betriebsführung | ~9 €/кВт/год | [Nefino](https://nefino.de/was-sind-betriebskosten-windpark-opex/), [Fraunhofer IEE](https://windmonitor.iee.fraunhofer.de/windmonitor_de/3_Onshore/5_betriebsergebnisse/4_betriebskosten/) |
| node.energy | 15 млн € Series B; >14 000 установок (~⅓ green power DE) | [pv magazine 23.04.2025](https://www.pv-magazine.de/2025/04/23/node-energy-erhaelt-15-millionen-euro-frisches-kapital/) |
| wpd windmanager | 6 011 МВт, 507 парков, 2 721 турбина | [iwr.de 2022](https://www.iwr.de/ticker/naechster-meilenstein-wpd-windmanager-knackt-in-der-betriebsfuehrung-6-gw-marke-artikel4706) |
| Топ-5 Direktvermarkter 2025 | Quadra 10,1; EnBW 9,9; Next 8,0; Statkraft 6,8; Danske 6,6 ГВт | [ZfK рейтинг 2025](https://www.zfk.de/unternehmen/ranking-die-zwanzig-groessten-direktvermarkter-2025) |
| Ошибочные redispatch-расчёты | ~10% | node.energy via [pv magazine 06.03.2026](https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/) |
| РФ в AML-списке ЕС | с 03.12.2025, обязательный EDD | [Еврокомиссия IP/25/2910](https://ec.europa.eu/commission/presscorner/detail/en/ip_25_2910) |
| Порог KRITIS генерация | 104 МВт (36 МВт для PRL) | [OpenKRITIS](https://www.openkritis.de/it-sicherheitsgesetz/kritis-anlagen_kritisv_itsig20.html), [BSW FAQ 06.2026](https://www.solarwirtschaft.de/datawall/uploads/2026/06/20260605_FAQ-NIS2_KritisDach_BSW_aktualisiert-1.pdf) |

## Что осталось «не нашёл» (честно)
- Прецеденты софт-вендоров с российскими основателями в немецкой энергетике после 2022 — ни успехов, ни отказов.
- Точное число установок, регулярно попадающих под redispatch (BNetzA публикует объёмы, не счётчик установок).
- Публичные цены redispatch-модулей node.energy / Cernion / конкурентов.
- Практика vendor-KYC именно энерго-Mittelstand к вендорам с РФ-корнями (есть только банковская и общесанкционная практика).

## Что могло бы спасти гипотезу (условия пересмотра вердикта)
1. Продажа не операторам, а **сетевым операторам (DSO)**: их ~860, у большинства нет процессов расчёта после новеллы 23.12.2025 — но это другой сегмент (полугос, где Art 5k и госзакупочные фильтры как раз действуют) и другая гипотеза.
2. Команда с бенефициарами-гражданами ЕС / полная смена бенефициарной структуры — снимает EDD-триггер, но тогда «команда российского происхождения» перестаёт быть частью гипотезы.
3. Расширение продукта с «расчёт Ausfallarbeit» до полной роли EIV/BTR + Erlösmonitoring — но там лобовое столкновение с node.energy и директ-маркетёрами при чеке 250–275 €/год.
