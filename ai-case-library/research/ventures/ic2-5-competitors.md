# IC2-5. Проверка: «Позиция независимого верификатора constraint-платежей не занята»

Дата проверки: 01.09.2026. Метод: открытый веб-поиск + первичные документы (NESO, Ofgem, Find a Tender, сайты вендоров). Пометки: **[не нашёл]** = отсутствие в открытых источниках, не доказательство отсутствия вообще; **[допущение]** помечено явно.

---

## Вердикт: ЧАСТИЧНО ОПРОВЕРГНУТО

Утверждение состоит из двух половин, и они проверяются по-разному:

1. **«Коммерческого вендора нет»** — **скорее подтверждено.** Ни у одной из проверенных платформ не нашёл продукта «независимый расчёт достижимой выработки на каждый constraint-ивент». Все продают либо ценовую/рыночную аналитику БМ, либо агрегированные оценки curtailment, либо консалтинг по производительности парков. Оговорка: это «нет продукта на сайте», а не «нет продукта вообще» — закрытые консалтинговые мандаты (DNV, LCP) не видны снаружи.

2. **«NESO/Elexon/Ofgem не строят собственный»** — **опровергнуто по существу.** NESO с августа 2024 ведёт собственную программу верификации точности Physical Notifications ветропарков (Monitoring Procedure с 1 марта 2025): помесячная публикация ошибок каждого Wind BMU, воркшопы, эскалация в Ofgem. Ofgem имеет работающую машину enforcement по TCLC с многомиллионными прецедентами и систему surveillance по REMIT. Это не «независимый пер-ивент counterfactual», но ядро позиции контур уже занял сам — и сообщает, что проблема сокращается.

Практический вывод для позиционирования: свободна не позиция «верификатора вообще», а узкая ниша «независимый пер-ивент counterfactual достижимой выработки» — причём её TAM сжимается тем, что (а) NESO уже давит на точность PN своим инструментом и (б) точность PN, по данным NESO, заметно выросла в 2024–2025.

---

## 1. Контур (NESO / Ofgem / Elexon) — главное опровержение

### NESO: собственная программа верификации FPN уже работает
Источник: NESO «Guidance Note — Good Industry Practice. In relation to FPN Accuracy (Grid Code BC 1.4.2(a))», февраль 2025, https://www.neso.energy/document/367841/download (проверен полный текст PDF).

- Версия 1 выпущена **09.08.2024**, версия 2 — **10.02.2025** после консультации дек. 2024 – янв. 2025.
- NESO установила пороги «Good Industry Practice» для ветровых BMU: net-ошибка FPN vs фактическая выработка **±3% в месяц**, абсолютная ошибка **<9.4%** (от доступной мощности). Пороги = топ-10% лучших onshore-парков по данным 2023.
- **Monitoring Procedure с 1 марта 2025**: NESO помесячно публикует NET_PERC_ERROR и ABS_PERC_ERROR **по каждому Wind BMU** за последние 6 месяцев (расчёт на данных Elexon, «для полной прозрачности и воспроизводимости»). 3 месяца несоответствия → notice; 6 месяцев → формальное уведомление в Ofgem.
- NESO фиксирует эффект: средняя net-ошибка ветровых BMU упала с 6.95% (2023) до 5.03% (2024), абсолютная — с 14.03% до 11.28%; число BMU, укладывающихся в порог, выросло со ~107 до ~128. Цитата: «Since the initial release of the Guidance Note in August 2024, NESO has observed significant improvements in wind PN accuracy».

**Нюанс (важен для продукта):** методика NESO меряет точность FPN в «нормальных» периодах (периоды с Bid/Offer acceptance корректируются по Grid Code) — то есть это косвенная верификация: честность PN вне curtailment как прокси честности PN во время curtailment. Прямого расчёта «что парк реально мог выработать в час конкретного constraint-ивента» NESO в этом документе не делает. Ниша counterfactual-на-ивент формально остаётся, но давление на первопричину (завышенные PN) контур уже оказывает сам.

### Ofgem: enforcement-машина по TCLC существует и применялась
- Прецеденты по Transmission Constraint Licence Condition (SLC 20A): **Beatrice Offshore Windfarm — £33.14 млн** в redress-фонд (https://www.ofgem.gov.uk/publications/compliance-beatrice-offshore-windfarm-limited-tclc), **Dorenell Windfarm — £5.53 млн** (https://www.ofgem.gov.uk/decision/compliance-dorenell-windfarm-limited-tclc), расследования SSE Generation, EP SHB, compliance-кейс Drax Pumped Storage.
- **Moray East**: расследование открыто 09.04.2025 по TCLC (завышенные bid-цены), на основе в т.ч. данных REF (~£100 млн за два года до сентября 2023). По состоянию на 01.09.2026 **исхода не нашёл** — расследование числится открытым (https://www.ofgem.gov.uk/publications/investigation-moray-offshore-windfarm-east-limiteds-compliance-tclc; https://www.offshorewind.biz/2025/04/15/ofgem-launches-probe-into-whether-moray-east-was-charging-excessive-grid-balancing-prices/).
- Обновлённый guidance по TCLC выпущен 10.06.2024 после консультации (https://www.ofgem.gov.uk/sites/default/files/2024-06/TCLC_guidance_10June24.pdf).
- Ofgem закупала Market Abuse Surveillance System под REMIT (тендер, government-online.net: https://www.government-online.net/software-tender-ofgem/) — у регулятора есть собственная система наблюдения за рынком.

### Elexon
- Elexon — источник данных (Insights Solution / BMRS: PN, MEL, BOA, метеринг; https://bmrs.elexon.co.uk/), на которых NESO и считает свои метрики. Собственного продукта «верификация достижимой выработки» у Elexon **[не нашёл]**; Insights Solutions — публичная платформа данных, не верификатор.

### Тендеры
- На Find a Tender нашёл только финансовый аудит NESO (награждён, £1.85 млн, https://www.find-tender.service.gov.uk/Notice/037458-2024). Тендеров именно на «верификацию PN / bid audit / curtailment counterfactual» **[не нашёл]** — что логично: NESO сделала это внутренней функцией Market Monitoring team, без внешней закупки.

**Вывод по п.3 задания:** контур строит своё — позиция «наблюдателя за честностью PN» занята самим NESO. Прямо говорю: тезис «NESO/Elexon/Ofgem не строят собственный» в исходной формулировке неверен. Что осталось незанятым: независимый (не-NESO) пер-ивент расчёт для сторон, которым нужна нейтральная третья оценка (пресса, потребительские организации, сами генераторы для защиты в расследованиях, юристы).

---

## 2. Конкурентная карта: коммерческие платформы

| Игрок | Что реально продаёт про constraints | Расчёт «что парк мог выработать»? |
|---|---|---|
| **Modo Energy** | Research-подписка: анализ constraint-costs, curtailment Шотландии, влияние на BESS (https://modoenergy.com/research/en/gb-great-britain-battery-energy-storage-curtailment-wind-constraint-scotland-costs). Фокус — батареи и бенчмаркинг BESS-выручки. | **[не нашёл]** продукта верификации; только исследовательские статьи |
| **LCP Delta (Enact)** | Ценовая/BM-аналитика, прогнозы выручки активов; консалтинговые отчёты о constraint-costs (напр., «From Bottlenecks to Balance», март 2026: https://insights.lcp.com/rs/032-PAO-331/images/LCP-Delta-Reformed-National-Pricing-Measures-on-GB-Grid-Constraint-Costs-March-2026.pdf; https://www.lcp.com/en/energy-transition/technology/enact) | **[не нашёл]** пер-ивент верификации как продукта. Консалтинг под заказ — возможен **[допущение]** |
| **Montel (EnAppSys)** | Ближе всех: квартальные/годовые отчёты curtailment GB+Ирландия с оценкой «could have been generated» (10.2 TWh curtailed в GB в 2025; «только 61% ветра Сев. Шотландии дошёл до сети», Q1 2026) (https://montel.energy/platforms/enappsys; https://www.edie.net/report-renewable-energy-curtailment-reached-record-high-in-2025/; https://eandt.theiet.org/2026/01/22/record-wasted-wind-power-2025-could-have-powered-every-home-london) | Считает **агрегированный** counterfactual на уровне рынка/региона — но это market intelligence, не пер-ивент верификация конкретного BMU и не аудиторский продукт |
| **Aurora Energy Research** | Amun: site-specific прогнозы выручки и **curtailment-риска** для ветра (форвардно, для инвестрешений) (https://auroraer.com/software/amun) | Прогноз будущего curtailment ≠ верификация прошлых ивентов. **[не нашёл]** |
| **Cornwall Insight** | Рыночные исследования и прогнозы; продукта по верификации constraint **[не нашёл]** | **[не нашёл]** |
| **Elexon Insights Solutions** | Публичные данные BMRS (PN, BOA, wind generation) (https://bmrs.elexon.co.uk/wind-generation) | Нет — это сырьё, из которого такой продукт делают |
| **TNEI** | On-Demand Dispatch Down Report: прогноз curtailment-риска, бенчмарк против EirGrid — **фокус Ирландия**, форвардный (https://www.tneigroup.com/on-demand-dispatch-down-report/) | Форвардная оценка, не ретро-верификация GB-ивентов |
| **Regen** | Политические исследования/членская ассоциация; продукта **[не нашёл]** | **[не нашёл]** |

Итого по п.1: у всех — ценовая аналитика, прогнозы или агрегированные curtailment-оценки. Пер-ивент верификацию достижимой выработки конкретного парка как коммерческий продукт не нашёл ни у кого. Ближайший сосед — Montel/EnAppSys (агрегированный counterfactual уже в проде) и REF (пер-парковый, но вручную и бесплатно).

## 2а. Открытые модели и академия (п.2)

- **Renewables.ninja** (Imperial/ETH; Staffell & Pfenninger): почасовая симуляция выработки ветра по локации — готовый движок для counterfactual. Лицензия данных **CC BY-NC** — некоммерческая (https://www.renewables.ninja/about); коммерческое использование требует отдельной договорённости. Кто строит на нём коммерческую верификацию — **[не нашёл]** никого.
- **Академические counterfactual-работы есть, коммерциализации не видно**: Cambridge C4E «Breakdown of British Wind Curtailment using a Multi-Source...» (https://como.ceb.cam.ac.uk/media/preprints/c4e-preprint-304.pdf), Strathclyde wind curtailment tool (https://pureportal.strath.ac.uk/en/publications/designing-a-wind-power-curtailment-tool-modelling-and-development/), Cambridge EPRG WP2503 об экономике curtailment (https://www.jbs.cam.ac.uk/wp-content/uploads/2025/03/eprg-wp2503.pdf). Это подтверждает: методология публична и воспроизводима — барьер входа в нишу низкий, защита продукта должна быть не в модели, а в статусе/нейтральности/данных.
- Bloomberg-расследование 2024 (Gillespie/Finch, 30 млн записей: топ-40 парков завышали прогноз на 20% в 2018–2021, на 13% в 2021–2023) — разовое, не продукт (https://www.bloomberg.com/graphics/2024-uk-wind-farms-overstate-output/). Именно оно + REF запустили реакцию контура (guidance NESO авг. 2024, расследование Moray East).

## 4. REF (Renewable Energy Foundation)

- **Что делает**: ведёт публичную базу constraint-платежей по каждому ветропарку с 2010 (данные Elexon/BMRS, включая bid-цены по settlement-периодам), блог-расследования («Windfarm constraint profits exceed £100m in 2023», https://www.ref.org.uk/ref-blog/380-windfarm-constraints-profits-exceed-100million; методика: https://www.ref.org.uk/energy-data/notes-on-wind-farm-constraint-payments). Именно REF передал Ofgem расчёты по Moray East (https://ref.org.uk/ref-blog/389-ofgem-opens-investigation-into-moray-east-constraint-payments).
- **Форма**: зарегистрированная благотворительная организация (осн. 2004, Noel Edmonds). Признаков коммерциализации (платный продукт, API, подписка) **[не нашёл]** — всё публикуется бесплатно. Детализацию текущего финансирования в поиске не нашёл; DeSmog отмечает непрозрачность доноров (https://www.desmog.com/renewable-energy-foundation/).
- **Репутация — ключевое для позиционирования**: REF систематически называют анти-ветряным лобби. RenewableUK (CEO Maria McCaffery): «It is an anti-wind lobbying organisation». Джон Констебл (многолетний director of policy) связан с климат-скептическим GWPF и возглавлял локальную анти-ветряную кампанию NOWAP (https://en.wikipedia.org/wiki/Renewable_Energy_Foundation; https://www.desmog.com/2016/02/16/anti-wind-campaigner-john-constable-joins-lord-lawson-s-climate-sceptic-gwpf-think-tank/).
- **Следствие**: цифры REF индустрия дисконтирует как мотивированные — это одновременно (а) доказательство спроса на нейтрального верификатора и (б) риск: «верификатор constraint-платежей» по умолчанию читается как анти-ветряной актор. Нейтральность придётся доказывать конструкцией (методика в open source, advisory board, работа и НА генераторов — напр., защита в TCLC-расследованиях).

## 5. Международные игроки сбоку

- **DNV**: продаёт Operational Energy Assessment (>1000 парков, 50 000 турбин), **Curtailment Risk Assessment** и валидированную методику EPA/WindFarmer (https://www.dnv.com/services/operational-energy-assessment-of-renewables-3961/; https://www.dnv.com/services/curtailment-risk-assessment-for-renewable-energy-projects-2598/). Это годовые/инвестиционные оценки, не пер-ивент BM-верификация — но у DNV есть всё (данные, методики, бренд нейтральности), чтобы войти в нишу за месяцы, если появится платящий спрос. **Главный кандидат на «вход сбоку»** [допущение на основе capabilities, признаков движения именно в BM-верификацию не нашёл].
- **Kayrros**: куплен Energy Aspects (сделка закрыта май 2026) — спутниковая аналитика вливается в UK-хаус рыночной аналитики (https://www.energyaspects.com/resources/insights/energy-aspects-completes-acquisition-of-kayrros). Движения в constraint-верификацию **[не нашёл]**, но комбинация «спутники + UK market intelligence» — потенциальный конкурент.
- **Yes Energy / Amperon**: партнёрство по nodal-прогнозам — целиком про рынки США (https://www.yesenergy.com/amperon-yes-energy-partnership). Признаков экспансии в GB BM **[не нашёл]**.

## 6. Некролог: аналитика британского энергорынка за ~5 лет

| Компания | Что случилось | Урок |
|---|---|---|
| **EnAppSys** (Middlesbrough, лидер GB-аналитики) | Продана Montel/Riverside в 2023, **цена не раскрыта** (https://montel.energy/resources/blog/enappsys-joins-the-montel-group; https://www.bdo.co.uk/en-gb/deals/acquisition-of-enappsys-by-montel-group) | Standalone-аналитика GB-рынка не дожила до масштаба — стала фичей европейской платформы. Данные-как-подписка = низкие мультипликаторы |
| **Origami Energy** (Cambridge, ПО для трейдинга/флекса, венчурные десятки млн £) | **Распущена 05.05.2026** по данным Companies House (https://find-and-update.company-information.service.gov.uk/company/08619644) | Энергетический SaaS без владения активами/потоком сделок сгорает даже с сильными инвесторами |
| **Kayrros** (Париж, спутниковая энергоаналитика) | Поглощена Energy Aspects, 2026 (https://tech.eu/2026/03/13/energy-aspects-to-buy-paris-based-kayrros-to-add-satellite-and-geospatial-analytics-capabilities/) | Нишевые данные продаются в дистрибуцию, не живут отдельно |
| **Limejump** (агрегатор/BM-доступ, куплен Shell 2019) | Май 2024 — продажа клиентской базы F&S Energy, новых контрактов нет (https://find-and-update.company-information.service.gov.uk/company/08246300) | Даже с мейджором за спиной BM-бизнес схлопнулся |
| **Electron** (flexibility marketplace) | **НЕ некролог** — жив, поднял £4 млн (июль 2025), партнёр SP Energy Networks (https://www.solarpowerportal.co.uk/solar-technology/electron-raises-4m-to-scale-its-flexibility-market-software-for-low-carbon-grids). Исходная посылка задания не подтвердилась | Опровержение ценнее: выживают те, кто встроился в регуляторный процесс (Ofgem/Elexon flexibility facilitation) — прямой намёк на модель для верификатора |

Общий паттерн некролога: чистые «данные+аналитика» по GB-рынку не выживают standalone — их покупают дёшево/не раскрывая цену либо они растворяются. Выживание — через встраивание в регуляторный контур или владение транзакцией.

---

## Сводка вердикта

- **Подтверждено**: коммерческого вендора пер-ивент верификации достижимой выработки нет (не нашёл ни продукта, ни анонсов; ближайшие соседи — Montel/EnAppSys с агрегированным counterfactual и REF вручную/бесплатно).
- **Опровергнуто**: «контур не строит собственный». NESO Market Monitoring c 08.2024 ведёт FPN Accuracy Monitoring Procedure (пороги ±3%/9.4%, помесячная публикация ошибок каждого Wind BMU с 03.2025, эскалация в Ofgem); Ofgem — действующий TCLC-enforcement (Beatrice £33.14m, Dorenell £5.53m, открытый кейс Moray East) + REMIT-surveillance.
- **Неясно / риски тезиса**: (1) точность PN уже быстро растёт под давлением NESO — ядро проблемы, которую монетизирует продукт, сжимается; (2) методология counterfactual публична (Renewables.ninja, Cambridge, Strathclyde) — низкий барьер входа, DNV может закрыть нишу «сбоку» быстро; (3) позиционирование «верификатор constraint-платежей» без специальной конструкции нейтральности будет прочитано как «REF 2.0», т.е. анти-ветряной актор.
- **Незанятый остаток позиции**: независимая пер-ивент оценка для сторон вне NESO — генераторы (защита в TCLC/GIP-процессах: спрос создан самим контуром), инвесторы/покупатели парков (due diligence по риску расследований), пресса/потребительские организации. Это другая, более узкая позиция, чем в исходном утверждении.
