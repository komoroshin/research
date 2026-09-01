# IC8-2. Независимый слой M&V гибкости крупных нагрузок — проверка на опровержение

Дата проверки: 01.09.2026. Режим: скептик. Задача — опровергнуть утверждение:
«Верификацию гибкости крупных нагрузок ещё никто не делает как независимый продукт, за неё есть кому платить помимо ISO, и ISO/utility не закроют нишу собственным инструментом».

## 0. Вердикт (кратко)

**Утверждение в основном опровергается по всем трём частям.**

1. **«Никто не делает как независимый продукт»** — формально верно (отдельного вендора «только верификация гибкости крупных нагрузок» не найдено), но функция уже занята: baseline и факт снижения считают сами ISO по данным счётчиков (PJM DR Hub/CBL, CAISO DRS, ERCOT ERS/Load Resource, MISO real-power tests); для крупных нагрузок ISO/utility требуют не статистику, а **физический контроль** (телеметрия ≤10 с, удалённое отключение, «100% контроль над выключателем», полный disconnect за 30 мин); коммерческие слоты заняты агрегаторами (CSP), EM&V-консалтингом (Guidehouse/DNV/Opinion Dynamics под CPUC), third-party implementer'ами (Olivine) и платформами (Recurve, Emerald AI — «telemetry, verification and event compliance reporting» встроены в продукт).
2. **«Есть кому платить помимо ISO»** — не подтверждено. ДЦ платят за *гибкость/capacity* (Emerald, Voltus BYOC), utility — за *результат DR* через RFP с встроенным M&V. Ни одного контракта, где кто-то платит именно за независимую верификацию гибкости, не найдено. Страховщики: продуктов под curtailment-обязательства не найдено; на рынке дефицит даже SLA-страховок. Кредиторы: не найдено.
3. **«ISO/utility не закроют нишу сами»** — опровергается паттерном 2024–2026: после мошенничеств (Ketchup Caddy, Voltus, American Efficient) MISO и PJM ужесточили правила **внутри себя** (аттестации, обязательная подача meter data, real-power тесты, IMM-митигация, sunset EE), PJM годами имел в Manual 18B опцию «PJM или независимая третья сторона» и не отдал её наружу; ERCOT сам проводит «verification review» аттестаций ILLE; губернатор Техаса поручил аудит ДЦ PUCT/ERCOT; в PJM IRAS проверку исполнения снижения возложили на EDC/штаты.

Главная ошибка гипотезы: **аналогия с American Efficient не переносится на крупные нагрузки.** Там мошенничество было в *counterfactual* энергоэффективности (self-certification «but-for», без счётчика), а не в измерении. Крупная нагрузка — один revenue-grade счётчик + телеметрия + Firm Service Level; там нечего «верифицировать статистикой». Спрос на независимый M&V есть в **мелких агрегированных активах** (1–10 кВт, где IMM MISO прямо просит «independent certification... audit authority» — memo 05.03.2026), т.е. ровно в обратном сегменте.

Остаточная ниша (если искать): (а) modelled-baseline для DC с волатильной нагрузкой (AI-training кластеры) в *economic* DR; (б) сертификация *способности* (pre-energization testing по классам Flex MOSAIC) — но это уже делает EPRI/DCFlex с 65+ участниками; (в) UK/EU, где Elexon как раз строит стандартизированные baselines и FMAR — ниша централизуется, а не открывается.

---

## 1. Как сегодня верифицируется DR / гибкость по рынкам

### PJM
- **Кто считает.** CSP подаёт meter data, PJM в DR Hub считает CBL/FSL и производит settlement; «Meter data will be forwarded to the EDC and LSE upon receipt, and these parties will then have ten (10) business days to provide feedback to PJM» (PJM ELRP / Manual 11; обзор — [Codibly, PJM aggregator guide](https://codibly.com/blog/articles/demand-response-pjm)). CSP «frequently run parallel calculations to audit these settlements» — т.е. вторая линия проверки уже у агрегатора.
- **Методы.** FSL летом / CBL зимой, «adjusted FSL year round»; после решения FERC 05.05.2026 DR переходит на 24/7 доступность с 01.06.2027, ELCC DR растёт с 69 % (2026/27) до ~92 % (2027/28) ([PJM Inside Lines](https://insidelines.pjm.com/ferc-approves-expanded-role-for-demand-response-to-enhance-reliability/), [Enel](https://www.enelnorthamerica.com/insights/blogs/pjm-2027-2028-capacity-auction-results)).
- **EE (Manual 18B).** «PJM or an independent third party will review the content of the Initial Post-Installation M&V Report… must permit PJM or an independent third party to conduct post-installation M&V audits» ([PJM Manual 18B](https://www.pjm.com/-/media/DotCom/documents/manuals/m18b.pdf)). Опция аутсорса существовала — и не помешала American Efficient: PJM «rely solely on the sworn statement or affirmation of the [EE] Resource Provider» ([Foley Hoag, 05.2026](https://foleyhoag.com/news-and-insights/blogs/energy-and-climate-counsel/2026/may/what-regulators-can-t-see-the-american-efficient-case-and-the-future-of-demand-side-oversight/)).
- **Что изменили после American Efficient.** Не «наняли верификатора», а **закрыли класс ресурса**: PJM и MISO sunset EE в capacity markets (FERC одобрил 2024 и 2025 соответственно) (Foley Hoag, там же). Штраф: $722 млн civil penalty + ~$410 млн disgorgement, 15.04.2026; >20 ГВт фиктивной мощности в PJM ([Utility Dive](https://www.utilitydive.com/news/ferc-american-efficient-fraud-market-manipulation-pjm-miso/817670/), [GRC Report](https://www.grcreport.com/post/ferc-orders-1-13-billion-penalty-against-american-efficient-over-decade-long-energy-market-fraud)).
- **Аккредитованные третьи стороны.** Не найдено списка аккредитованных M&V-провайдеров PJM. Единственная «третья сторона» с полномочиями — IMM (Monitoring Analytics). Цены — не найдено.

### MISO
- **Мошенничества и ответ.** Ketchup Caddy: ~210/303/372 МВт фиктивных регистраций (2019–2021), «MISO did not call a curtailment event… and required only mock tests», штраф $25 млн + $1,5 млн + disgorgement, 05.12.2024 ([Utility Dive](https://www.utilitydive.com/news/ferc-ketchup-caddy-miso-demand-response-fraud/734844/)). Voltus: 29 % портфеля без контрактов к 2020/21, $18 млн (10,9 + 7,1 + $1 млн CEO), 06.01.2025; compliance-отчёты в FERC 2 года, **без независимого монитора** ([Utility Dive](https://www.utilitydive.com/news/voltus-ferc-miso-demand-response-settlement/736640/)).
- **Правила.** FERC 18.07.2025 (ER25-1729) принял тариф MISO: «require demand resources to attest in writing… require that demand resources submit meter data demonstrating the load reduction to MISO within a specified timeframe; explicitly allow MISO's IMM to mitigate… baseline… five lowest average load days over the prior 45-day period» ([FERC 2025 Assessment of DR, с. 23](https://www.ferc.gov/sites/default/files/2025-12/25_Annual%20Assessment%20of%20Demand%20Response_1212.pdf)). Real-power тесты LMR: FERC одобрил 17.11.2025 (ER25-2845), «operational data could satisfy the testing requirement»; OMS возражала по срокам ([raokonidena](https://raokonidena.substack.com/p/ferc-approves-misos-real-power-testing)). MISO проверяет «respond within its registered time… hold the response for the full four hours… achieve its stated Capacity Availability or Firm Service Level» ([MISO KB](https://help.misoenergy.org/knowledgebase/article/KA-01030/en-us)).
- **Единственное явное требование «независимой верификации».** IMM MISO (Potomac Economics), memo 05.03.2026 по предложению Voltus ослабить точность счётчиков для активов 1–10 кВт: «Self-certification is not an independent verification of actual field performance… any relaxation… should be conditioned on… independent testing and certification, and audit authority» ([IMM memo, MSC-2025-7](https://cdn.misoenergy.org/MSC%20Meter%20Accuracy%20Standards%20for%20Small%20Aggregated%20Assets%20(MSC%202025-7)%20(20260219)_IMM745213.pdf)). **Важно:** речь о мелких агрегированных активах, и просьба — сохранить 0,3 % стандарт счётчиков, а не нанять вендора.

### ERCOT
- **Load Resources / CLR.** Квалификационный тест проводит ERCOT Demand Integration; телеметрия ICCP; CLR под SCED — «must be able to respond to ERCOT dispatch instructions in a measurable, verifiable way» ([ERCOT LR page](https://www.ercot.com/services/programs/load/laar), [NFM](https://www.nfmconsulting.com/knowledge/ercot-controllable-load-resource-guide/)). Для крупных нагрузок: «≤10-s telemetry, continuous state reporting, and redundant ICCP» ([arXiv 2601.12686](https://arxiv.org/pdf/2601.12686)).
- **ERS.** «ERCOT shall evaluate the event performance… using data from metering»; ERS Default/Alternate/Weather-Sensitive baseline назначает ERCOT; требуется IDR/smart meter 15-мин ([ERCOT ERS](https://www.ercot.com/services/programs/load/eils)).
- **4CP.** Считает ERCOT по 15-мин интервалам, аллокация TCOS по TDSP — участник не «верифицирует», а просто оказывается ниже пика ([ERCOT M-B080124-01](https://www.ercot.com/services/comm/mkt_notices/M-B080124-01)).
- **DR в ERCOT 2024:** 4 099 МВт (+13,5 %) (FERC 2025 Assessment).
- Аккредитованные третьи стороны M&V — не найдено.

### CAISO
- **Кто считает.** SC/DRP подаёт исторические и событийные meter data, расчёт baseline и performance — в DRS CAISO; «The SC for the DRP is responsible for ensuring that SQMD… represents an accurate… Demand Response Energy Measurement» ([CAISO DR Registration User Guide v5.0, 2024](https://www.caiso.com/documents/demand-response-registration-user-guide-ver-5-0-clean.pdf)).
- **Recurve/FLEXmeter.** По заказу CAISO после блэкаутов 08.2020 разработан open-source FLEXmeter (site-level модель + GRIDmeter comparison group), «eligible to clear demand response transactions in the CAISO market»; CAISO «Demand Response Advanced Measurement Methodology», обновл. 02.2022 ([Recurve](https://www.recurve.com/blog/caiso-introduces-new-open-source-advanced-m-v-to-increase-confidence-in-demand-response-impacts-copy), [CAISO PDF](https://www.caiso.com/Documents/Demand-Response_Advanced_Measurement_Methodology_updated_Feb_2022.pdf)). **Вывод:** передовой M&V для DR в CAISO уже **открыт (open source) и тарифицирован** → коммодитизация.
- **Утилитная оценка.** CPUC Load Impact Protocols (D.08-04-050) — ежегодные ex-post/ex-ante оценки DR-программ выполняют консультанты (Nexant/Resource Innovations, Guidehouse, DNV, Opinion Dynamics) по контрактам CPUC/IOU ([CPUC LIP](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-costs/demand-response-dr/demand-response-load-impact-protocols)). Суммы контрактов — не найдено. **Olivine** — DRP/SC и third-party implementer ELRP для SDG&E/SCE, делает baseline/settlement; годовые cap'ы администрирования ELRP: $3,9 млн PG&E, $2,9 млн SCE, $1,6 млн SDG&E ([CPUC ELRP](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-costs/demand-response-dr/emergency-load-reduction-program), [Olivine](https://olivineinc.com/about/)). Это ближайший реальный аналог «независимого слоя» — и это программный implementer utility, а не рыночный продукт.
- **DR в CAISO 2024:** 4 373 МВт; third-party DR в среднем 188 МВт (↓ с 210), utility DR 986 МВт (↓ с 1 175) (FERC 2025 Assessment).

### Общий объём (для масштаба)
FERC, 2025 Assessment: DR в 7 оптовых рынках США 2024 — **33 272 МВт** (+0,7 %), ≈6,5 % пика; PJM 8 526 МВт (−11,8 %), MISO 12 954 МВт, NYISO 1 921, SPP 968, ISO-NE 431 ([FERC](https://www.ferc.gov/sites/default/files/2025-12/25_Annual%20Assessment%20of%20Demand%20Response_1212.pdf)).

---

## 2. Что требует новая волна large-load правил и кто проверяет «сбросил 60 МВт за 10 минут»

### FERC show-cause 18.06.2026 (6 RTO/ISO)
- Определение large load: >50 МВт, >69 кВ; три новых продукта передачи: Non-firm Contract Demand, Firm Contract Demand, Interim NITS; «standard agreements» должны содержать «details about telemetry and equipment requirements, including remote disconnect capabilities»; 60 дней на ответ, ответы до ноября–декабря 2026 ([RMI](https://rmi.org/resources/understanding-fercs-large-load-orders/), [Vinson & Elkins](https://www.velaw.com/insights/ferc-institutes-six-simultaneous-section-206-proceedings-targeting-large-load-interconnection-across-all-rto-iso-markets/), [Utility Dive](https://www.utilitydive.com/news/data-center-interconnection-ferc-large-load-show-cause/824501/)). Операционные требования: «real-time metering and telemetry, load management plans… periodic reporting of actual versus projected load» ([Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/06/ferc-advances-new-oversight-framework-for-large-loads)).
- **Ни в одном источнике нет требования независимой третьей стороны для верификации.** Модель — телеметрия + remote disconnect у utility/RTO.

### PJM: IRAS (ex-Connect and Manage), решение Board 27.07.2026, filing 31.07.2026
- Large Load ≥50 МВт в радиусе 1 мили; реестр (peak, ramp, «telemetry specifications», BYONC, backup gen); существующие регистрируются до 01.03.2027; новые без BYONC с 01.06.2027 снижаются **до** Pre-Emergency Load Management.
- **Кто исполняет и проверяет:** «When receiving an IRAS reduction megawatt quantity, the TO will take action to initiate and complete the reduction within 10 minutes»; «The compensation program will be administered by the EDs by awarding such compensation based upon **determining compliance with the mandated load reduction**»; «Credit megawatt quantities should be based upon the actual load reduction achieved» ([PJM IRAS Executive Summary, 27.07.2026](https://www.pjm.com/-/media/DotCom/about-pjm/who-we-are/public-disclosures/2026/20260727-cifp-framework-for-service-during-periods-of-insufficient-resource-adequacy-executive-summary.pdf)). Ставка кредита = Non-PAI rate. **Верификация закреплена за EDC/штатом**, PJM «lacks authority to curtail individual sites directly» ([TFTC](https://www.tftc.io/pjm-50-mw-rule-ai-data-center-curtailment-ferc-2026)).
- **IMM (10.06.2026)** предлагает модель CSP: «The CSP would receive a curtailment directive from PJM… The behavior of the CSP and its customers could be directly monitored. Appropriate penalties could be imposed» — верификация через существующую DR-инфраструктуру, без нового слоя ([IMM Connect & Manage V1](https://www.monitoringanalytics.com/reports/presentations/2026/IMM_CIFP_Connect_and_Manage_Proposal-V1_20260610.pdf)). IMM же назвал гибкость без обязательного curtailment «regulatory fiction» ([Latitude Media](https://www.latitudemedia.com/news/a-reality-check-on-flexible-data-centers/)).
- Reliability Backstop Procurement: агрегаторы DR/DER должны «show the identified sites and associated contracts… for the length of the fixed 15-year term»; cap $555/MW-day UCAP ([PJM Board Decision RBP, 27.07.2026](https://www.pjm.com/-/media/DotCom/about-pjm/who-we-are/public-disclosures/2026/20260727-cifp-reliability-backstop-procurement-pjm-board-decision.pdf)). Прогноз large load: до 70 ГВт к 2038.

### ERCOT / Texas SB6
- ≥75 МВт после 31.12.2025: оборудование удалённого отключения при firm load shed; воли добровольная Large Load Demand Management Service (PUCT Project 58482, ≥75 МВт, уведомление 24 ч, конкурентная закупка); финальное правило large load ожидается к 31.12.2026 ([Weil](https://www.weil.com/-/media/files/pdfs/2025/july/weil-energy-alert--senate-bill-6-reforms-interconnection-and-colocation-rules-for-data-centers-and-o.pdf), [ZEG](https://www.zeroemissiongrid.com/iso-rto/puct-large-load-interconnection/)).
- PUCT Docket 59220 (24.07.2026, Goodnight Wind 265,5 МВт + Crusoe 260 МВт): ДЦ обязан «full disconnect from the ERCOT system upon an ERCOT instruction… within 30 minutes», уведомление 60 мин; settlement по «ERCOT Polled Settlement meter» ([White & Case](https://www.whitecase.com/insight-alert/puct-affirms-curtailment-authority-over-co-located-data-centers-first-net-metering)).
- **ERCOT сам верифицирует:** «ERCOT conducts verification review of a sample set of ILLEs. ILLEs, through T(D)SPs, must produce documentation supporting their attestations» (Batch Zero; ~205 ГВт eligible; финансовое обеспечение $50 000/МВт) ([ERCOT Senate deck 29.07.2026](https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf)). Губернатор Abbott 03.08.2026 поручил PUCT/ERCOT «comprehensive verification and audit» ДЦ-проектов; ERCOT ведёт site-readiness verification до 09.04.2027 ([Baker Botts](https://www.bakerbotts.com/thought-leadership/publications/2026/august/texas-large-load-interconnection-update---ercot-batch-zero-pause-and-verification-process), [Texas Tribune](https://www.texastribune.org/2026/08/03/texas-data-center-project-audit-greg-abbott/)).

### Utility-side (ответ на «утилита по счётчику или нужен независимый слой?»)
- Silicon Valley Power (58 ДЦ): «SVP must have 100% control of the loadside breaker if the data center wants faster interconnection» (COO Chris Karwick) ([Utility Dive, 08.2026](https://www.utilitydive.com/news/data-centers-flexibility-utilities-speed-to-power/822588/)). PGE требует «visibility» и «dispatchability» в interconnection agreement.
- Google–I&M (IURC, petition 30.07.2025): «defined curtailment schedules, compliance testing, and performance penalties… if Google fails to meet its commitment, the company must repay a portion of its annual credit»; риск accreditation/shortfall целиком на Google ([POWER](https://www.powermag.com/google-im-strike-landmark-deal-to-share-clean-capacity-and-flex-ai-load/)). Всего Google — 1 ГВт DR в контрактах с I&M, TVA, Entergy Arkansas, Minnesota Power, DTE (03.2026) ([Google](https://blog.google/innovation-and-ai/infrastructure-and-cloud/global-network/demand-response-data-center-milestone/)). Верификация — двусторонняя (utility по счётчику + договорные тесты), третьих сторон не упомянуто.
- CRA (17.02.2026): «Verification standards favor hard telemetry over probabilistic inference… Statistical baselines and portfolio diversity… tend to fail when customer behavior changes during extreme system conditions»; «Only binding, verifiable service levels—maximum grid draw under contingencies, guaranteed curtailment response times, financial penalties for non-performance—can be incorporated into planning models» ([CRA](https://www.crai.com/insights-events/publications/grid-under-pressure-flexibility-centered-large-load-policies-overlook-recent-lessons/)). Это прямой аргумент **против** baseline-аналитики как продукта для large loads.

**Итог по п.2:** «сбросил 60 МВт за 10 минут» проверяется телеметрией/счётчиком у TO/EDC/ERCOT; независимый слой в правилах не предусмотрен нигде.

---

## 3. Игроки «verification of flexibility»

| Игрок | Что реально делает | Продаёт ли «верификацию» отдельно |
|---|---|---|
| **Emerald AI** ($150 млн Series A @ $1,05 млрд, 25.08.2026; всего ~$197 млн) | Оркестратор Emerald Conductor; «provides telemetry, verification, and event compliance reporting back to the utility operator»; SVP «Flexible Load Interconnection Program» — «verified, dispatchable flexibility»; Vera Rubin ~100 МВт (Manassas, с Dominion/PJM/EPRI, кон. 2026) ([Emerald AI](https://www.emeraldai.co/blog/emerald-ai-raises-150-million-series-a), [Utility Dive](https://www.utilitydive.com/news/data-centers-flexibility-utilities-speed-to-power/822588/)) | Нет — верификация **встроена** в продукт гибкости; независимой верификации в демо (SRP, 25 %/3 ч) не упомянуто ([Latitude](https://www.latitudemedia.com/news/nvidia-and-oracle-tapped-this-startup-to-flex-a-phoenix-data-center/)) |
| **Voltus / CPower / Enel X** | CSP: регистрируют, подают meter data, ISO считает; Voltus сам вносит предложения по стандартам счётчиков (MISO MSC-2025-7); Voltus BYOC: Google, до 100 МВт/год VPP в PJM, 3 года, 02.06.2026 ([Voltus](https://www.voltus.co/press/voltus-google-bring-your-own-capacity-pjm)); CPower — LS Power (2018) → NRG (сделка ~$12 млрд EV, 2025) | «Сами себе верификаторы» в пределах правил ISO; берут 20–40 % gross payments ([Codibly](https://codibly.com/blog/articles/how-demand-response-aggregators-make-money-business-models-for-the-8-44b-flexibility-market)) — M&V внутри маржи |
| **Recurve** (~$53 млн всего, Series B 10.2025, ~58 чел.) | OpenEEmeter/GRIDmeter/FLEXmeter — open source; CAISO-tariff-compliant; DOE одобрил OpenEEmeter для IRA rebates (01.2025); FLEX-платформа для utility EE+DR ([Recurve](https://recurve.com/2025/01/17/recurves-openeemeter-approved-by-doe-as-first-open-source-mv-software-for-ira-home-energy-rebates/), [startupfundraising](https://startupfundraising.com/companies/recurve)) | Да, ближайший «M&V как продукт» — но для utility-программ (масс-сегмент), не для large-load; сам факт open-source = коммодитизация метода |
| **Olivine** | DRP/SC CAISO + third-party implementer ELRP (baseline, settlement) | Да, как implementer utility-программы (не рыночный слой) |
| **Camus Energy** | FlexConnect для utility; Google-sponsored исследование с Encoord/Princeton ZERO: flexible interconnection на 3–5 лет быстрее, backup 40–70 ч/год, curtailment 7–35 ч/год ([Latitude](https://www.latitudemedia.com/news/a-google-backed-blueprint-for-fercs-data-center-fast-lane/)) | Нет, продаёт utility платформу headroom/оркестрации |
| **GridCARE** ($64 млн Series A, 14.05.2026; 650 МВт headroom для National Grid NY) | Поиск headroom для ДЦ ([Latitude](https://www.latitudemedia.com/news/gridcare-raises-oversubscribed-64-million-series-a/)) | Нет |
| **Verrus** | Flexible DC + NREL демо 70 МВт (100 % за 1 мин через батареи) | Нет |
| **EPRI DCFlex / Flex MOSAIC** (23.03.2026, 65+ участников, 9 демо-площадок) | Классификация гибкости (5 классов), «technical protocols, measurement standards, and contractual frameworks»; «EPRI is not a standards-setting organization» ([EPRI](https://dcflex.epri.com/flex-mosaic), [DCD](https://www.datacenterdynamics.com/en/news/epri-launches-data-center-flexibility-framework-to-speed-up-grid-connections/)) | Некоммерческий консорциум занимает роль «стандарта/аттестации» |
| **WattTime / Kevala / Bidgely / Amperon / Arcadia / UtilityAPI** | Данные/прогноз/EAC; продуктов «verified flexibility» для ДЦ не найдено | Не найдено |
| **WattCarbon** | EAC с временной/локационной привязкой для DER (WEATS, 05.2024) | Сертификаты, не верификация DR |
| **Guidehouse / DNV / Opinion Dynamics / Resource Innovations / ICF** | EM&V utility-программ под регуляторами (CPUC и др.); ICF консультирует по гибкости ДЦ | Инкумбенты «независимой оценки», работают по контракту utility/регулятора |

**Не найдено:** ни одного стартапа, поднявшего seed/Series A в 2025–2026 под «независимую верификацию гибкости». Инвестиции в grid flexibility «pulled back in 2025» ([Net Zero Insights](https://netzeroinsights.com/resources/where-the-grid-gets-flexible/)).

---

## 4. Риск «сделают сами» — подтверждён

- MISO: ужесточение тарифа (ER25-1729, ER25-2050, ER25-2845) — внутри ISO + IMM.
- PJM/MISO: sunset EE вместо аудита; PJM DR 24/7 + ELCC; IRAS — верификацию отдали EDC.
- ERCOT: собственный verification review ILLE; PUCT/ERCOT аудит ДЦ по поручению губернатора (08.2026); ERCOT разрабатывает «tool which provides ERCOT operators with advance warning that system conditions may require Large Load curtailment» ([EPE](https://epeconsulting.com/epe-intelligence/news/preparing-for-nogrr-282-ercot-s-next-phase-of-large-load-requirements)).
- FERC: 06.2026 — телеметрия/remote disconnect в стандартных соглашениях; ANOPR 01.2026 (60-дневные studies для curtailable loads) ([Keentel](https://keentelengineering.com/poi-interconnection-data-centers-large-loads)).
- Utility: Ameren Illinois «Flexible Interconnection Plan» (30.06.2026) — DERMS + SCADA-телеметрия, 5 % curtailment target, собственный процесс ([Ameren](https://www.ameren.com/-/media/files/account/service-options/renewables/illinois/resources/flexible-interconnection-plan-p2.ashx)); SVP — контроль над выключателем.
- **Тендеры на M&V-платформы:** не найдено. Найдены RFP на **саму гибкость**: PSE 2026 Demand Response RFP (портфель 10 % пиковой нагрузки) ([PSE](https://www.pse.com/-/media/PDFs/001-Energy-Supply/003-Acquiring-Energy/2026-Demand-Response-Request-for-Proposals/2026-DR-RFP.pdf)); SVCE/PCE demand flexibility RFP (офферы до 13.08.2026) ([SVCE](https://www.svcleanenergy.org/solicitations/)). M&V в них — обязанность поставщика гибкости.
- FERC audit programs: после AE — enforcement (1b.19 письмо Affirmed Energy 22.05.2025), но не программа третьих сторон ([Utility Dive](https://www.utilitydive.com/news/ferc-affirmed-energy-investigation-show-cause-pjm-capacity-energy-efficiency/720258/)).
- **NESO «закрыла мониторинг заявок ветропарков»** — конкретный кейс закрытия стартапа не найден; найдено только, что NESO выпустила собственные инструменты Connections 360 / Connections Portal / Grid Connect X ([NESO](https://www.neso.energy/industry-information/connections/connections-360)). Помечено как «не подтверждено».

---

## 5. Кто платит — контракты и суммы

| Плательщик | Найдено | Сумма |
|---|---|---|
| Utility | Платит за DR/гибкость (RFP), за headroom-платформы (Camus, GridCARE), за implementer-услуги (Olivine: cap $1,6–3,9 млн/год на ELRP-администрирование) | Отдельной строки «верификация» — не найдено |
| ДЦ | Платит за гибкость/capacity: Emerald (софт), Voltus BYOC (100 МВт/год, Google, 3 года, сумма не раскрыта), I&M кредиты по DR | За верификацию — не найдено |
| Страховщик/кредитор | SLA-insurance в дефиците, «current coverage often excludes non-physical damage such as power outages» ([Insurance Journal, 30.06.2026](https://www.insurancejournal.com/news/international/2026/06/30/875775.htm)); продуктов под curtailment-обязательства — не найдено; требований кредиторов к M&V — не найдено | — |
| Регулятор | Платит EM&V-консультантам (CPUC) — существующий рынок инкумбентов | Суммы контрактов — не найдено |
| ISO | Считает сам; IMM как аудитор | — |

Косвенная оценка стоимости «доверия»: агрегаторы удерживают 20–40 % gross DR-платежей; PJM RBP cap $555/MW-day; PJM IRAS credit = Non-PAI rate. Допущение: если бы верификация выделилась в отдельную услугу, её потолок — доля этой маржи, а не новая статья.

---

## 6. Некролог (M&V / DR-аналитика, 2017–2026)

| Компания | Исход | Причина (по источникам) |
|---|---|---|
| EnerNOC | → Enel, ~$250 млн cash ($7,67/акц.), 08.2017 ([Utility Dive](https://www.utilitydive.com/news/enel-completes-acquisition-of-energy-management-company-enernoc/448831/)) | Низкая маржа DR, зависимость от правил PJM |
| Comverge | → Itron, ~$100 млн, 2017 ([Utility Dive](https://www.utilitydive.com/news/itron-acquires-demand-response-provider-comverge-for-100m/442188/)) | То же |
| Enbala | → Generac, 2020, сумма не раскрыта | Поглощение |
| Blueprint Power | → bp, 10.2021, не раскрыта; интегрирована | Поглощение |
| AutoGrid | Привлёк ~$159 млн → Schneider 05.2022 (не раскрыто) → Uplight 09.02.2024 (не раскрыто); Uplight «large» layoff 21.11.2024; Uplight искал покупателя за ~$1 млрд; Octopus — контрольный пакет 24.03.2026, сумма не раскрыта ([Canary](https://www.canarymedia.com/articles/grid-edge/schneider-buys-autogrid-to-tap-huge-potential-of-distributed-energy-resources), [REW](https://www.renewableenergyworld.com/power-grid/smart-grids/uplight-executes-large-layoff-after-autogrid-integration/), [Latitude](https://www.latitudemedia.com/news/octopus-energy-is-taking-a-majority-stake-in-uplight/)) | Дважды перепродан; консолидация |
| Swell Energy | Закрылась 08.2024, ABC-ликвидация; «thin margins», «relative immaturity of the sector» ([Latitude](https://www.latitudemedia.com/news/scoop-swell-is-shutting-down/)) | VPP-экономика |
| OhmConnect | Слита в Renew Home (03.2024); приём новых — стоп 03.2026; техасская книга → Direct Energy 05.2026 ([The Dissent](https://thedissentsf.com/article/ohmconnect-the-startup-that-paid-you-to-turn-off-the-lights-is-closing-it-didn-t)) | Consumer DR не масштабировался |
| Voltus | Жива; $18 млн FERC-settlement (01.2025); купила Brightfield AI 10.06.2026 | — |
| Recurve | Жива, ~$53 млн за ~10 лет, Series B 10.2025 | Медленный рост M&V-as-a-product |
| Arcadia (utility data) | Сокращения 2024–2026 (headcount −4,2 % 2025, −2,9 % 2026) ([Revelio](https://www.reveliolabs.com/companies/arcadia-power/employees)) | Data-layer коммодитизация |

Общий вывод некролога: чистая DR/M&V-аналитика в США **ни разу** не дала выхода дороже ~$300 млн; выживают те, кто продаёт мощность/гибкость (Voltus, Emerald) или сидит на utility-программах (Olivine, Recurve, EM&V-консалтинг).

---

## 7. Доступ команды российского происхождения

- **Техас (главный large-load рынок):** Lone Star Infrastructure Protection Act (в силе с 06.2021) запрещает бизнесам и госорганам Техаса контракты, дающие «direct or remote access to or control of critical infrastructure» (в т.ч. electric grid) компаниям, «owned or controlled by individuals from China, Russia, North Korea, and Iran»; AG распространил на interconnection agreements; штрафов нет, но комплаенс utility/ERCOT будет отсекать ([Jackson Walker](https://www.jw.com/news/insights-texas-lone-star-infrastructure-protection-act/), [GovTech](https://www.govtech.com/security/texas-law-will-block-it-contracts-with-some-foreign-vendors)). Слой верификации с телеметрией — это «remote access» по определению.
- **Федерально:** ICTS-правило — первый final determination против Kaspersky 24.06.2024; критерий — юрисдикция/операции, не гражданство основателей ([Covington](https://www.cov.com/en/news-and-insights/insights/2024/06/commerce-department-issues-first-final-determination-and-prohibition-under-the-icts-rule)). NERC CIP-013 — vendor risk management у utility; Fortress: 90 % из 200+ ПО в энергетике США содержит код разработчиков из РФ/КНР — тема на радаре ([Fortress](https://www.fortressinfosec.com/company/news/energy-companies-contains-code-from-russian-chinese-developers)). CFIUS: инвестиции из РФ — red flag; 347 filings в 2025 ([Fenwick](https://www.fenwick.com/insights/publications/cfius-common-faqs-by-startup-founders-and-investors)). FEOC — про tax credits, к софту напрямую не относится.
- **Вывод:** продажа ISO/utility в США с РФ-основателями и телеметрическим доступом — нереалистично в Техасе и крайне тяжело в остальных штатах (CIP-013 due diligence). Продажа ДЦ/страховщикам — юридически проще, но спроса не найдено (п.5).
- **UK:** Elexon — Market Facilitator (с кон. 2025) и делivery body FMAR (назначен 07.03.2025); консультация «Standardised Baselining Methodologies» (2025); DFS — provider сам считает delivered volume по P376, NESO платит pay-as-bid ([Elexon](https://www.elexon.co.uk/2025/03/07/elexon-appointed-as-flexibility-market-asset-registration-delivery-body/), [NESO DFS 10.08.2026](https://www.neso.energy/document/346011/download)); ENA дала бесплатный baselining verification tool ([ENA](https://www.energynetworks.org/industry/flexibility-services)); flexible connections DNO управляет через ANM/DERMS, при превышении Curtailment Limit DNO платит по фиксированной цене ([ENA explainer](https://www.energynetworks.org/assets/images/Resource%20library/ON21-WS1A%20Open%20Networks%20Flexibility%20Connections%20Explainer%20and%20Q&A%20(19%20Aug%202021).pdf)). Ofgem: консультация о mandatory curtailment ДЦ до 16.09.2026, Flex Technical Taskforce — отчёт AI Energy Council осенью 2026 ([HSF Kramer](https://www.hsfkramer.com/insights/2026-07/uk-grid-connections-reform)). **Вывод:** в UK ниша централизуется в Elexon (единый реестр + единые baselines), независимый верификатор не предусмотрен.
- **EU:** Network Code on Demand Response — ACER передал в ЕК 07.03.2025; ст. 14(4): реестр baseline-методов ведут ENTSO-E/EU DSO Entity; национальное применение ~2027 ([Electron](https://electron.net/your-guide-to-the-eu-draft-network-code-on-demand-response/)). Верификация — у TSO/DSO по национальным методам.

---

## 8. Что могло бы спасти гипотезу (честно)

1. **Economic DR для DC с волатильной нагрузкой.** FSL/CBL для AI-training кластера с меняющимся профилем — реальная методическая проблема; но CAISO уже открыла FLEXmeter, а PJM/ERCOT решают через FSL/телеметрию. Допущение: спрос появится, если DC массово пойдут в *economic* DR, а не только в emergency/interruptible — сегодня контракты (Google, IRAS, SB6) почти все emergency-типа.
2. **Сертификация способности (capability), а не факта.** Pre-energization тесты по классам Flex MOSAIC, «model quality test… as a future condition for energization» в ERCOT — тут возможен роль независимой лаборатории (аналог NREL-демо Verrus). Но EPRI/NREL/ERCOT уже это делают.
3. **Аудит «software-defined» гибкости** (сброс — реальный, а не перенос нагрузки в соседний ДЦ того же оператора; влияние на другой узел сети). Для ISO это не проблема (считают по узлу), для carbon/ESG-отчётности — возможно, но это другой рынок (EAC, WattCarbon).
4. **UK/EU DSO-рынки** — есть шанс как поставщик baseline-тулинга Elexon/DSO по тендеру, но это B2G-подряд, не продукт.

## 9. Пробелы («не нашёл»)
- Цены на M&V-услуги (Recurve, EM&V-консультанты, Olivine-контракты) — не найдено.
- Список аккредитованных third-party M&V провайдеров в PJM/MISO/ERCOT — не найдено (вероятно, не существует).
- Полный текст PJM IRAS FERC-filing (ER26-3380, 31.07.2026) — детали телеметрии/штрафов не извлечены.
- Кейс NESO с закрытием стартапа по мониторингу заявок ветропарков — не подтверждён.
- Страховые/кредитные требования к M&V curtailment-обязательств — не найдено.
