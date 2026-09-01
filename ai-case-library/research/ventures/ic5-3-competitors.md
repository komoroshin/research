# IC5-3. Проверка критерия фальсификации: «Позиция не занята»

**Гипотеза:** сервис подготовки и сопровождения обязательных подач по реформе очереди подключения в UK (Gate 2 / TMO4+, milestone-доказательства) для девелоперов генерации, накопителей и ЦОДов.
**Проверяемое утверждение (пытаемся опровергнуть):** «Специализированного SaaS для подач по реформе очереди нет, и сам NESO/подрядчики не строят инструмент, закрывающий нишу».
**Дата проверки:** 2026-09-01. Метод: веб-поиск (WebSearch/WebFetch), каждый факт с источником.

---

## Вердикт (сводно)

**Утверждение НЕ опровергнуто в узком смысле, но серьёзно ослаблено в трёх местах.**

1. **Чистого «SaaS для Gate 2-подач» не найдено** — нишу сегодня закрывают консультанты-люди (Roadnight Taylor, TNEI, Locogen, USP) и юрфирмы, не софт. «Не нашёл» — явный результат многих запросов.
2. **НО: NESO уже сам построил обязательный портал подачи** с автопрефиллом, валидацией, прогресс-барами — точка подачи занята регулятором by design. Продукту остаётся только слой «подготовки evidence», не «подачи».
3. **И: смежные позиции стремительно занимаются.** Continuum Industries прямо маркетирует Optioneer под TMO4+; Enverus (купил Pearl Street 03/2025, запустил PRISM Europe 01/2025) движется в Европу; Yottar в партнёрстве с National Grid Electricity Distribution строит платформу оценки подключений (03/2026). Окно узкое и сжимается с двух сторон — от регулятора и от инженерных платформ.

Риск-скоринг: главный убийца — не конкурент-стартап, а **сам NESO** (аналогия SolarAPP+ работает частично: точка подачи уже стандартизована, но evidence-подготовка — нет) и **эпизодичность спроса** (окна подач редкие: G2TWQ-окно закрылось 26.08.2025, новые demand-окна — не ранее конца 2026).

---

## 1. Что уже автоматизировал сам NESO (риск сверху)

- Подача Gate 2-evidence — **только через онлайн-портал NESO** (Connections Reform Portal); DNO принимают через свои порталы или почтой. Источник: Burges Salmon, «NESO Announces Grid Connections Reform Timeline», https://www.burges-salmon.com/articles/102lpup/neso-announces-grid-connections-reform-timeline/
- Функциональность портала (проверено по официальной странице обновлений): автопрефилл полей из данных проекта, real-time валидация обязательных полей, прогресс-бары, динамическая навигация, загрузка файлов (лимит 99MB/файл, 2GB/подача), PDF-выгрузка. 50+ фиксов за июль–август 2025. **Публичного API и планов с датами на странице нет.** Источник: NESO, Connections Reform Portal Updates, https://www.neso.energy/industry-information/connections-reform/connections-reform-portal-updates
- Портал сырой: технические сбои вынудили продлить окно G2TWQ; окно закрылось 26.08.2025. Источники: reNews, https://renews.biz/102076/neso-extends-gate-2-connections-evidence-window/ ; NESO news, https://www.neso.energy/news/clean-energy-projects-be-prioritised-grid-connections-reform-evidence-window-opens
- NESO публикует Evidence Handbook и шаблоны для подающих (снижает барьер и для конкурентов, и для DIY). Источник: NESO, https://www.neso.energy/industry-information/connections-reform/evidence-handbook-and-other-g2wq-submission-resources
- Таймлайн 2026: Gate 2 офферы по протектед-transmission (2026/27) — до конца января 2026; протектед-distribution и Gate 1 — до 31.03.2026; офферы до 2030 включительно — до конца июня 2026; Gate 2 Phase 1 distribution — июль–ноябрь 2026, Phase 2 transmission — сентябрь 2026 – январь 2027. Источники: Ashfords, https://www.ashfords.co.uk/insights/articles/neso-announces-updated-connections-reform-timeline ; Modo Energy, https://modoenergy.com/research/en/gb-neso-national-energy-system-operator-2026-energy-storage-roadmap-p462-connections-reform-balancing-mechanism
- Тендеры NESO на connections-IT: на Find a Tender найдены award «Digital Workplace Services, End User Compute and IT Service Management» (18.08.2025, notice 2025/S 000-049571) и закупка Procurement Services Indirect & IT (19.02.2025) — **специализированного тендера «инструмент для подающих» не нашёл** (явно: не нашёл). Источники: https://www.find-tender.service.gov.uk/Notice/049571-2025 ; https://bidstats.uk/tenders/2025/W10/841941384

**Вывод по риску сверху:** «точка подачи» уже принадлежит NESO — как SolarAPP+ в США, только сразу, до появления рынка. Продукт может жить только НАД порталом (сбор/структурирование доказательств: land rights, planning, queue-milestones), и NESO в любой момент может улучшить свои шаблоны/валидацию. Допущение: NESO вряд ли будет делать CRM-слой для девелоперов (не его мандат), но подтверждающего документа нет.

## 2. Стартапы в нише очередей/подключений

**США (движутся к Европе):**
- **Pearl Street Technologies** — куплена **Enverus в марте 2025**. SUGAR™ (для ISO/utilities) обработал 300+ GW очереди, ещё 100+ GW в пайплайне; Interconnect™ — для девелоперов. Источники: Enverus newsroom, https://www.enverus.com/newsroom/undo-the-queue-enverus-acquires-pearl-street-technologies-to-solve-for-a-more-reliable-resilient-grid/ ; Businesswire 18.09.2024, https://www.businesswire.com/news/home/20240918957908/en
- **Enverus** запустил **PRISM Europe 30.01.2025** (GIS-слои, site suitability; UK Gate 2-функций в анонсе НЕТ — явно проверено), плюс Power Flow Studio; маркетинг: «проекты с Enverus проводят в очереди на 500 дней меньше, 9x вероятность подключения» (цифры вендора, US-очереди). Источники: https://www.enverus.com/newsroom/enverus-prism-now-available-for-europe/ ; https://www.enverus.com/products/power-flow-studio/
- **Nira Energy** — In-Queue + Prospecting, 100+ девелоперов (AES, Invenergy…), 500+ GW studies, $3B+ найденных расхождений в costs; growth-раунд от Energize Capital; есть отдельная страница **для дата-центров**. **UK-экспансии не нашёл** (явно). Источники: https://www.niraenergy.com/ ; https://www.niraenergy.com/data-centers ; Latitude Media, https://www.latitudemedia.com/news/how-nira-energy-is-using-software-to-unclog-the-interconnection-queue/ ; Energize, https://energizecap.com/insights/why-we-invested-in-nira-energy

**UK/EU:**
- **Continuum Industries (Optioneer)** — Эдинбург, Series A $10M (сентябрь 2023, лид Singular). **Прямо маркетирует поддержку TMO4+**: «Optioneer supports assessment under Ofgem's TMO4+ connections reform — early spatial feasibility evidence», оценка маршрутов подключения до POC против пространственных ограничений; «customers are starting to gain access to compliance activities (biodiversity assessments)». Это **ближайший к нише игрок**, но фокус — пространственно-инженерный evidence, не документарно-milestone'овый пакет. Источники: https://www.continuum.industries/solution/renewables-development ; Tech.eu, https://tech.eu/2023/09/25/continuum-industries-raises-10-million-in-series-a-funding-to-revolutionize-ai-powered-infrastructure-planning/
- **Yottar** — Эксмут; pre-seed £740k–£1M (август 2025, лид Haatch); digital twin сети, вероятность одобрения подключения, клиенты Crown Estate, Tesla, NHS; таргет — demand-девелоперы 1–5MW. **Март 2026: партнёрство с National Grid Electricity Distribution** — платформа автоматизированной оценки grid capacity (контекст: очередь demand-подключений выросла на 460% за 6 мес. к июню 2025). Источники: DCD, https://www.datacenterdynamics.com/en/news/uk-startup-yottar-raises-12m-to-streamline-grid-connection-process-through-digital-twin-solution/ ; Enlit World (03/2026), https://www.enlit.world/library/national-grid-taps-startup-for-connections-intelligence-as-uk-tackles-speculative-requests ; Solar Power Portal, https://www.solarpowerportal.co.uk/solar-planning/national-grid-yottar-to-develop-platform-accelerating-grid-connections
- **TNEI / IPSA** — консалтинг + power-system-софт; активно пишет про Gate 2 («что смотреть в Gate 2-оффере»), но продукт — инженерный анализ сетей, не комплаенс-подачи. Источники: https://www.tneigroup.com/news_event/tnei-on-grid-connections-reform-results-and-what-to-look-out-for-in-your-gate-2-offer/ ; https://www.ipsa-power.com/
- **Gridimp** — по результатам поиска: energy-management/IoT, к нише подач отношения не нашёл (явно).
- **Neara** — упоминаний о UK connections reform / NESO-партнёрствах не нашёл (явно).

## 3. Смежные захваты (permitting/land)

- **LandTech** — UK, Power Infrastructure layer: субстанции DNO, headroom, RAG-статусы, ежедневное обновление, downloadable данные. Site-selection, **не подача**. Модуля «Gate 2 submissions» не нашёл (явно). Источники: https://land.tech/solutions/power-developers/ ; https://land.tech/blog/conducting-viability-assessments-with-the-power-infrastructure-layer
- **PermitFlow** — US construction permitting ($5.5M seed 2023, позже $54M); **UK/энергосети — не нашёл** (явно). Источник: TechCrunch, https://techcrunch.com/2023/05/08/permitflow-construction-permit-automation/
- Забавный структурный аналог в другой отрасли: **GatewayPin** (UK) — SaaS для Gateway 2/3-подач по Building Safety Act (evidence management, readiness tracking, submission packs; цена от 0,01% стоимости проекта). Доказывает, что модель «SaaS вокруг обязательного regulatory gate» в UK жизнеспособна — но в стройке, не в гриде. Источник: https://gatewaypin.co.uk/
- Кто реально закрывает нишу подач сегодня: **консультанты**. Roadnight Taylor («Connectology», вебинар «Gate 2 submissions: a practical guide» — 450+ регистраций), Locogen (страница «Gate 2 Grid Connection» services), USP Ltd (data centre grid connections). Источники: https://roadnighttaylor.co.uk/connectology/webinar/webinar-watch-gate-2-submission-guide/ ; https://locogen.com/expertise/gate-2-grid-connection/ ; https://utilitysolutionsproviderltd.com/sectors/data-centre-grid-connections/

## 4. Некролог (обязательный раздел)

Классических «смертей» софта вокруг grid connections UK с 2020 почти нет — зато идёт **консолидация поглощениями**:
- **Pearl Street Technologies → Enverus** (март 2025) — лидер US-interconnection-софта поглощён данными-гигантом. Источник: https://www.enverus.com/newsroom/undo-the-queue-enverus-acquires-pearl-street-technologies-to-solve-for-a-more-reliable-resilient-grid/
- **NovoGrid (IE, grid analytics для RE и дата-центров) → SCADA International** (ноябрь 2024). Источник: CB Insights, https://www.cbinsights.com/company/novogrid
- **GivEnergy** (UK, но это hardware/инверторы) — администрация после убытка £5.4M, весь штат уволен (2026) — смежный сигнал о хрупкости UK energy-tech, не про софт очередей. Источник: GB News, https://www.gbnews.com/money/givenergy-administration-staff-redundant
- Целевые запросы «grid connection software UK ceased trading/administration/wound up 2021–2023» — **умерших софт-стартапов именно в нише подключений не нашёл** (явно; Kaluza, Electron, Piclo, Advanced Infrastructure — живы и растут: Electron поднял £4M и в 03/2026 перевёл SP Energy Networks на ElectronConnect — Solar Power Portal, https://www.solarpowerportal.co.uk/solar-technology/electron-raises-4m-to-scale-its-flexibility-market-software-for-low-carbon-grids).
- Интерпретация некролога: ниша слишком молода, чтобы иметь кладбище (реформа утверждена Ofgem 15.04.2025 — Ofgem, https://ofgem.gov.uk/decision/decision-connections-reform-package-tm04); паттерн выхода — M&A в данные/инженерные платформы, а не банкротство. Допущение.

## 5. Регуляторный риск сверху (аналогия SolarAPP+)

- Аналогия работает наполовину: SolarAPP+ стандартизовал подачу там, где был рынок частных решений; в UK **NESO стандартизовал подачу сразу** — рынка «подачи» никогда не было, есть только рынок «подготовки». Судя по логу обновлений портала, NESO пилит UX/фиксы, а не экосистему API (явно: планов/API не нашёл — https://www.neso.energy/industry-information/connections-reform/connections-reform-portal-updates).
- Обратный риск: NESO публикует всё более подробные handbook'и/шаблоны (https://www.neso.energy/industry-information/connections-reform/evidence-handbook-and-other-g2wq-submission-resources) — коммодитизация знания, на котором стоит сервис.
- 2026 — «год имплементации»: основной поток работы это офферы и milestone-комплаенс по выданным Gate 2 (queue management milestones), не новые массовые подачи. Источник: Modo Energy, https://modoenergy.com/research/en/gb-neso-national-energy-system-operator-2026-energy-storage-roadmap-p462-connections-reform-balancing-mechanism

## 6. Второй движок: ЦОДы / demand connections

- Ofgem, консультация **29.07.2026** «Curate»: Data Centre Commitment Fee **£237,500–£712,500 за MW** (платится при акцепте оффера, возвращается при energisation, сгорает при выходе из очереди) + специфические queue-milestones для ЦОДов; дедлайн ответов 16.09.2026. Очередь demand-подключений выросла с **41 GW до 125 GW менее чем за год, из них ≥80 GW — ЦОДы**. Источники: Ofgem, https://www.ofgem.gov.uk/press-release/ofgem-acts-free-grid-capacity-tackling-speculative-data-centre-projects ; https://www.ofgem.gov.uk/consultation/proposed-data-centre-connection-reforms ; Slaughter and May, https://www.slaughterandmay.com/insights/new-insights/pay-to-stay-ofgem-s-plan-to-cull-the-data-centre-connection-queue/ ; Data Centre Review, https://datacentrereview.com/2026/07/ofgem-proposes-fees-to-remove-speculative-data-centres-from-grid-queue/
- Софт для UK demand connections: **специализированного не нашёл** (явно). Ближайшие: Yottar (1–5MW demand, NGED-партнёрство) — но это siting/оценка, не milestone-комплаенс; Nira — data-center-страница, только US; обслуживают ЦОДы консультанты/агенты (Savills — гайд «How to secure a data centre grid connection», https://www.savills.co.uk/blog/article/388854/commercial-property/demand-connection-reform--how-to-secure-a-data-centre-grid-connection.aspx ; USP Ltd). Новые окна demand-заявок — вероятно не раньше конца 2026 (HSF Kramer, https://www.hsfkramer.com/insights/2026-07/uk-grid-connections-reform) — т.е. у второго движка сейчас фаза консультации, продукт можно успеть к правилам. Допущение: финальные правила Ofgem могут заметно поменять состав milestone-доказательств.

---

## Итоговая оценка критерия фальсификации

| Подвопрос | Результат |
|---|---|
| Есть ли специализированный SaaS для Gate 2/TMO4+-подач? | **Не найден** — утверждение держится |
| Строит ли NESO инструмент, закрывающий нишу? | **Частично да**: обязательный портал с префиллом/валидацией уже есть; evidence-подготовку не закрывает |
| Кто ближе всех к нише? | Continuum (маркетинг под TMO4+), Yottar (NGED, demand), Enverus/Pearl Street (деньги + Европа) |
| Некролог | Смертей нет; консолидация M&A (Pearl Street→Enverus 03/2025, NovoGrid→SCADA Int. 11/2024) |
| Второй движок (ЦОДы) | Софта нет; правила (Curate) ещё в консультации до 16.09.2026 — окно есть, но и неопределённость правил |

**Ключевая уязвимость гипотезы — не конкуренция, а форма спроса:** подачи эпизодичны (окна), точка подачи принадлежит NESO, знание коммодитизируется handbook'ами; устойчивый продукт — скорее «milestone-комплаенс на весь жизненный цикл Gate 2-оффера + demand/ЦОД-пакет под Curate», чем «подготовка подач» как таковая.
