# IC11-3 · Проверка утверждения о «данных как рве» — расчётное ядро для андеррайтинга BESS / ВИЭ / сетевых активов

Дата проверки: 01.09.2026. Режим: скептик, задача — опровергнуть.
Метод: веб-поиск (200 запросов) + чтение первоисточников (EPRI white paper PDF, Munich Re aiSure factsheet, сайты вендоров/регуляторов). Каждое число — с источником. «Не нашёл» помечено явно. Допущения — словом «допущение».

---

## 0. Вердикт

**Утверждение в исходной формулировке ОПРОВЕРГНУТО по обеим частям.**

1. «Есть или может быть собран массив, которого нет у страховщиков и инкумбентов» — во всех трёх доменах массивы, к которым команда могла бы получить доступ извне, уже либо публичны (EPRI, NREL PVDAQ, EIA, CIGRE, Battery Archive), либо принадлежат вендорам, которые **уже** продают их страховщикам напрямую (TWAICE→NARDAC/Munich Re, ACCURE→Aviva/Protect Solar, ONYX Insight→Aviva, kWh Analytics — сам MGA, Raptor Maps 373 ГВт). Свободного «белого пятна» под новый массив BESS/ВИЭ, который можно собрать без собственных активов, не нашёл.
2. «Данные партнёрской сети в РФ относятся к массиву и легально применимы» — данные РФ-распредсети (а) не покрывают BESS и ВИЭ вообще (ВИЭ в РФ ≈ 6,6 ГВт, промышленных BESS — данных о заметной установленной мощности не нашёл), (б) по сетевым активам сталкиваются с задокументированной непереносимостью между странами/парками (CIGRE, турецкое сопоставление), (в) с юридической стороны прямого запрета на экспорт обезличенной аварийности не нашёл, но есть уголовный риск для сотрудников партнёра (ст. 275.1 УК РФ), режим КИИ/ТЭК, и главное — санкционно-репутационный стоп-фактор у покупателя (CEO «Россетей» под санкциями ЕС/UK с 03.2022; прецедент Kaspersky/ICTS показывает, что «разработано в РФ» = «unacceptable risk» для US-регулятора).

**Что выживает из гипотезы:** не «данные как ров», а (a) пул данных клиентов-страховщиков/владельцев, который команда сама насобирает по мере работы (так строили kWh Analytics, ONYX), и/или (b) принятие риска (гарантия точности модели по образцу Munich Re aiSure — но это уже страховая конструкция, см. §6). Оба варианта требуют западной юрисдикции и не опираются на РФ-партнёра.

---

## 1. BESS: базы инцидентов и данные деградации

### 1.1 EPRI BESS Failure Incident Database — публична, но мелкая и «медийная»
- На момент white paper (май 2024) в базе **81 инцидент**, из них только **26** с достаточной информацией для присвоения root cause; за 2011–2017 из 9 инцидентов не классифицирован ни один; за 2018+ root cause определён у **36%**. Источник: EPRI White Paper «Insights from EPRI's BESS Failure Incident Database: Analysis of Failure Root Cause», May 2024, PDF: https://restservice.epri.com/publicdownload/000000003002030360/0/Product (текст извлечён локально).
- Источники базы — **только публичные**: «media reports, published root cause analyses (RCA), and corporate press releases… active searching of global English-language media… No proprietary information was discussed in these interviews nor used in the classification» (там же). База сама признаёт: «many incidents are not reported in news media… There is no guarantee that the database captures every relevant BESS failure incident».
- На март 2025 — **95 записей** (WECC/ERCOT, «BESS Events in the West», 14.03.2025: https://www.ercot.com/files/docs/2025/03/12/BESS-Events-in-the-West.pdf).
- Частота отказов упала на 97% (2018→2023, EPRI) / на 99% (2018→2025, EPRI Storage Wiki, обновлено 20.07.2026: https://storagewiki.epri.com/index.php/BESS_Failure_Incident_Database). Т.е. и без того малый массив инцидентов растёт всё медленнее — статистики на «модель риска» из него не собрать.
- 72% отказов с известным возрастом — на стадии строительства/пуско-наладки/первых 2 лет (EPRI, там же). Вывод: значимая часть риска — интеграция и стройка, а это данные EPC/OEM, а не эксплуатационные телеметрии.
- Другие: UL Lithium-Ion Battery Incident Reporting, EV FireSafe — упомянуты в EPRI как альтернативные публичные базы (там же). NFPA/DNV отдельных публичных баз инцидентов не нашёл (DNV — Battery Scorecard, лабораторные тесты «dozens of cells»: https://www.dnv.com/publications/2024-battery-scorecard/).

**Опровержение:** «Собрать базу инцидентов лучше EPRI» без доступа к закрытым RCA невозможно — EPRI прямо пишет, что OEM и интеграторы RCA не раскрывают, а регуляторного требования отчётности нет («No current federal, state, or local jurisdiction requires incident reporting», там же).

### 1.2 Данные деградации — публичные датасеты лабораторные и крошечные
- NASA (4 ячейки), CALCE, Oxford (LCO pouch), Sandia (18650 NCA/NMC/LFP до 80%), агрегатор Battery Archive. Источники: NASA data-driven prediction paper (2024): https://www.nasa.gov/wp-content/uploads/2024/01/data-driven-prediction-of-long-and-short-term-li-ion-battery-degradation-using-public-datasets-and-nail-puncture-testing-1.pdf ; Volta Foundation «Comparison of Open Datasets»: https://volta.foundation/featured-post/comparison-of-open-datasets-for-lithium-ion-battery-testing ; https://www.batteryarchive.org/study_summaries.html.
- Это данные ячеек в камере, не полевые данные систем — для андеррайтинга парка BESS они дают априорные кривые, не более. DNV Battery XT строится на «20 years of published literature… semi-empirical formulae similar to USABC/INL/NREL» (Utility Dive: https://www.utilitydive.com/news/new-dnv-gl-service-allows-independent-testing-of-li-on-battery-lifetimes-ac/510561/) — т.е. инкумбент-сертификатор тоже сидит на публичной литературе + собственных тестах.

### 1.3 Коммерческие аналитики BMS-данных — уже продают страховщикам
- **TWAICE ↔ NARDAC** (MGA по ВИЭ/BESS), партнёрство 12.06.2024: аналитика используется, чтобы «improve insurance terms»; количественного эффекта на премию в релизе нет. https://www.twaice.com/newsroom/insurance-partnership-nardac ; https://www.globenewswire.com/en/news-release/2024/06/12/2897643/0/en/
- **TWAICE ↔ Munich Re**: Munich Re выпустил performance-warranty-страховку Li-ion на базе мониторинга TWAICE (BatteryIndustry.net: https://batteryindustry.net/munich-re-uses-monitoring-by-twaice-software-to-offer-warranty-insurance-for-li-ion-batteries/). Плюс aiSure: если оценка SoH TWAICE ошибается >2%, клиент получает **8×** уплаченного; гарантия обеспечена страховщиком группы Munich Re (S&P AA). Источник: Munich Re aiSure Case Study TWAICE (PDF, ©2022): https://www.munichre.com/content/dam/munichre/contentlounge/website-pieces/documents/aiSure_Case_Study_Twaice_Factsheet.pdf/_jcr_content/renditions/original./aiSure_Case_Study_Twaice_Factsheet.pdf
- **ACCURE ↔ Aviva**: двухлетний пилот, старт 05.08.2026, «embed predictive battery analytics into its risk framework»; клиенты Aviva получают льготный onboarding у ACCURE. https://www.modernpowersystems.com/news/aviva-backs-landmark-energy-storage-pilot-safety-project/
- **ACCURE ↔ Protect Solar**: «directly influences how assets are evaluated during underwriting». https://www.accure.net/news/accure-partners-with-protect-solar
- Voltaiq — фокус на производстве/тестах ячеек, не на страховании (https://www.voltaiq.com/platform). Munich Re Ventures пишет о battery analytics как основе будущего андеррайтинга (https://medium.com/@MunichReVentures/battery-analytics-impacts-on-the-mobility-and-insurance-industries-1715e2f02da2). **PowerUp — не нашёл** подтверждений продаж страховщикам (поиск исчерпан).
- Появляются и прямые конкуренты-нишевики: SynthGrid «EnergyPassport — BESS Performance Data for Insurance Underwriters» (https://synthgrid.io/insurance; страница отдала 403, содержание не проверено).

**Ответ на вопрос «где место для нового массива»:** полевые BMS-данные уже у TWAICE/ACCURE (они сидят на владельцах), инцидентная статистика публична и мала, а страховщики (Aviva, Munich Re, NARDAC) уже интегрировали этих вендоров. Новому игроку без своих BESS-активов собирать нечего. Что страховщики действительно просят — **время**: «We would need to see at least five years of data» на новые химии (Oliver Litterick, TMGX, ess-news 06.11.2025: https://www.ess-news.com/2025/11/06/what-insurers-want-battery-developers-to-understand-right-now/); «We're pricing 2026 BESS renewals using historical data from a period when these assets barely existed» (цитата андеррайтера, repath.earth: https://repath.earth/bess-insurance-requirements-climate-risk-data/). Это дефицит истории, который нельзя закрыть ИИ-надстройкой.

---

## 2. ВИЭ: производственные данные

- **kWh Analytics**: 300 000+ активов в базе, $100B+ loss data, покрытие **30% солнечных активов США**, защищает $50B активов; HelioStats с 2013; **сама — MGA** с панелью из 5 из топ-10 (ре)страховщиков (Aspen — property до $100M/локация, Swiss Re и Everest Re — Solar Revenue Put до 95% выработки). https://kwhanalytics.com/about/ . Пресс-релиз 12.05.2026: анализ 6,5 ГВт recoverable risk (инверторы 28%): https://www.businesswire.com/news/home/20260512932725/en/ . Финансирование: всего $32,5M, последний раунд Series B $20M (02.2022), далее гранты DOE $2,4M (09.2024) и приз $0,5M (01.2025) — https://www.crunchbase.com/organization/kwh-analytics . (Наблюдение, не вывод: «данные + MGA» на 13-м году не привлекли крупный поздний раунд.)
- **Raptor Maps**: датасет **373 ГВт** DC, 75+ ГВт non-DC инспекций, 15 ГВт автономных дронов; в отчёте 2026 — гостевая статья kWh Analytics о страховых издержках. https://pages.raptormaps.com/hubfs/Marketing%20Content%20for%20Website/2026%20Global%20Solar%20Report%20by%20Raptor%20Maps%20(compressed).pdf ; https://www.tipranks.com/news/private-companies/raptor-maps-deepens-role-in-data-driven-solar-asset-management-and-automation
- **DNV**: Renewable Asset Benchmarking — 150 000+ месячных точек производительности и почти столько же событий-отказов по **1100+ проектам** (https://www.dnv.com/cases/renewable-asset-benchmarking-88650/); WindFarmer валидирован на 900 годах операционных данных (https://www.dnv.com/software/services/windfarmer/).
- **ONYX Insight** (Macquarie, 2024): 32 000+ турбин в 45 странах, **9 000+ отказов** крупных компонентов, 60+ моделей турбин, 15 лет истории; партнёрство с **Aviva 16.07.2026** — «strengthens underwriting by reducing the information asymmetry». https://www.reinsurancene.ws/aviva-and-onyx-insight-partner-to-improve-wind-turbine-risk-management/ ; https://onyxinsight.com/company/news/aviva-partnership/ . WindESCo — отдельных данных не нашёл.
- **Публичные**: NREL PVDAQ (https://data.openei.org/submissions/4568; точного числа систем в результатах нет; в одном исследовании NREL — 573 residential-систем), EIA-923 — ~3 034 станций помесячно + 9 528 ежегодно, EIA-860 — все генераторы ≥1 МВт (https://eia.gov/electricity/data/eia923/ ; https://docs.catalyst.coop/pudl/en/latest/data_sources/eia860.html).

**Опровержение:** пробел «нет данных по производительности ВИЭ» закрыт трижды (kWh — 30% США, Raptor — 373 ГВт, ONYX — 9k отказов) и уже соединён со страховщиками. Российская сеть ВИЭ-активов почти не имеет: 6,6 ГВт всех ВИЭ РФ на 1П2025 (ветер 2,57 ГВт, солнце 2,55 ГВт) — https://www.cdu.ru/tek_russia/articles/6/1161/ ; по данным СО ЕЭС на 2023: солнце 1 788 МВт, ветер 2 420 МВт (https://ru.wikipedia.org/wiki/Возобновляемая_энергетика_России). Данных об установленной мощности промышленных СНЭ в РФ — **не нашёл**. Т.е. партнёр-сеть к массиву BESS/ВИЭ не относится вовсе.

---

## 3. Сетевые активы: у кого данные и переносимы ли российские

### 3.1 Что уже есть
- **CIGRE WG A2.37** (TB 642, 2015): 964 major failures, **167 459 трансформаторо-лет, 56 utilities, 21 страна**, общий failure rate ≈0,53%/год (GSU ≈0,95%). **TB 939** (2024): 425 000+ трансформаторо-лет, 1 204 отказа, 1 916 списаний, 66 utilities, 27 стран; failure rate «упал более чем вдвое». https://www.e-cigre.org/publications/detail/642-transformer-reliability-survey.html ; https://electra.cigre.org/336-october-2024/technical-brochures/analysis-of-ac-transformer-reliability.html ; https://www.hvassets.com/en/post/transformer-reliability-and-the-case-for-condition-based-maintenance
- **NERC TADS/GADS**: сырые данные конфиденциальны, публично — только агрегаты; даже FERC получил доступ «on an ongoing and non-public basis» (Federal Register 29.09.2015: https://www.federalregister.gov/documents/2015/09/29/2015-24282/... ; NERC 2025 TADS DRI). Т.е. закрытые сырые данные существуют, но у регулятора/utilities, а не у страховщиков и не у стартапов.
- **FM Global**: инструмент Equipment Predisposed на «proprietary data», data sheets на «nearly 200 years of property loss experience», DS 5-4 Transformers (ревизия 07.2019); из loss-статистики: отказ трансформатора без взрыва/пожара в ~10 раз вероятнее. https://newsroom.fmglobal.com/releases/fm-globals-equipment-predisposed-tool-recognized-by-business-insurance-magazine-with-a-2021-innovation-award ; https://risklogic.com/recent-changes-to-fm-global-property-loss-prevention-data-sheet-5-4-transformers
- **HSB (Munich Re)**: крупнейший equipment-breakdown-страховщик Сев. Америки, **5+ млн** коммерческих локаций — https://www.munichre.com/hsb/en/about-hsb.html . Собственная claims-база несопоставимо больше любой одной распредсети.
- **Hitachi TXpert / Siemens**: экосистема мониторинга трансформаторов «manufacturer-agnostic», продаж данных страховщикам не нашёл (https://www.hitachienergy.com/products-and-solutions/transformers/the-txpert-ecosystem).

### 3.2 Переносимость российских данных (домен-шифт)
- Российская статистика существует и даже частично опубликована: удельная повреждаемость трансформаторов ≥80 МВА **0,86%/год отказов, 0,22%/год аварий** (НИЦ «ЗТЗ-Сервис»); магистральные сети 1,5/0,25%, региональные 1,5/0,48% (Cyberleninka, «Анализ повреждаемости электрооборудования…»: https://cyberleninka.ru/article/n/analiz-povrezhdaemosti-elektrooborudovaniya-elektricheskih-setey-i-obosnovanie-meropriyatiy-po-povysheniyu-nadezhnosti). Цифры того же порядка, что CIGRE 0,53% — российские данные не дают «нового сигнала» на уровне базовых частот.
- Износ сетей «Россетей» 35–45% (Росстат/Минстрой 2025–26, https://ru-bezh.ru/kompanii-i-ryinki/news/26/07/03/rossiyskiy-biznes-otkazhetsya-ot-massovogo-obnovleniya-setevoy-i); >30% оборудования старше 45 лет (2017, https://regnum.ru/news/2348996.html); доля отечественного оборудования >50% в деньгах (2025). Популяция — советские/российские трансформаторы, 6–10 кВ воздушные сети, континентальный климат. Целевые активы западных страховщиков — новые BESS/ВИЭ с китайскими/европейскими OEM.
- Прямое свидетельство домен-шифта: сопоставление CIGRE (536 отказов) с турецкими отказами 2018–2023 — по вводам и обмоткам совместимо, но **отказы магнитопровода и изоляции у турецкой популяции существенно чаще** (ResearchGate «Analysis of Major Failures of Power Transformers»: https://www.researchgate.net/publication/375860407_Analysis_of_Major_Failures_of_Power_Transformers). Сама CIGRE отмечает разброс по классам напряжения и типам. Для ML: работы по transfer learning для трансформаторов (ADDA, multi-stage transfer — https://www.researchgate.net/publication/396845436_... ; патент US 11619682) существуют именно потому, что модели **не переносятся** без адаптации на целевых данных.
- Исследований, специально сопоставляющих российскую распредсеть и западный парк для андеррайтинга — **не нашёл**.

**Опровержение:** российские данные (а) дают базовые частоты, которые уже есть в CIGRE с 27 стран, (б) по составу популяции (советское оборудование, 6–10 кВ) — другой домен, (в) без целевых (западных) размеченных данных не адаптируются. «Уникальность» здесь — не преимущество, а причина непереносимости.

---

## 4. Легальность и комплаенс

### 4.1 Российская сторона
- **187-ФЗ (КИИ)**: прямого запрета на передачу обезличенных данных об аварийности за рубеж в тексте закона/гайдов **не нашёл**. Но вектор регулирования обратный: Указ №250 запрещает с 2025 СЗИ из недружественных стран на объектах КИИ; 325-ФЗ вводит с 01.03.2026 «национальный контроль» над КИИ, иностранные решения на значимых объектах запрещены (https://securitymedia.org/info/187-fz-o-bezopasnosti-kii-novye-trebovaniya-2025-2026-prakticheskiy-gayd.html ; https://www.anti-malware.ru/analytics/Technology_Analysis/Critical-Information-Infrastructure-Security-Law-2025). Данные об АСУ ТП/топологии значимых объектов — допущение: будут трактованы как информация ограниченного доступа субъектом КИИ.
- **256-ФЗ (безопасность объектов ТЭК)**: паспорта безопасности и категорирование объектов ТЭК — документы ограниченного доступа (https://legalacts.ru/doc/federalnyi-zakon-ot-21072011-n-256-fz-o/). Отказы оборудования на конкретных подстанциях = сведения об уязвимости объектов ТЭК (допущение).
- **Указ №1203 (гостайна)** относит «инфраструктуру экономики» к отраслям, функционирующим в интересах обороноспособности (ред. 24.06.2025, https://www.consultant.ru/document/cons_doc_LAW_8522/). Порог применения к обезличенной статистике — не определён, риск на усмотрении ФСБ.
- **Ст. 275.1 УК РФ** (с 2022): конфиденциальное сотрудничество с иностранной организацией в целях содействия деятельности против безопасности РФ — **3–8 лет** (https://www.consultant.ru/... ; https://sudact.ru/law/uk-rf/osobennaia-chast/razdel-x/glava-29/statia-275.1/). Передача данных о сети сотрудниками партнёра иностранному страховому продукту — реальный персональный риск для них, независимо от того, есть ли формальный запрет.
- Указ Президента (11.2023) дал 46 компаниям право самим определять объём раскрытия (https://www.rbc.ru/business/27/11/2023/6564afc59a7947bdb98dd3ef) — тренд на закрытие, не открытие.
- При этом агрегированные сводки об аварийных отключениях региональные «Россети» **публикуют** (Россети Кубань — годовые сводки 2012–2024: https://rosseti-kuban.ru/potrebitelyam/tekhnicheskoe-sostoyanie-setey/svodnye-dannye-ob-avariynykh-otklyucheniyakh/ ; Ленэнерго: https://rosseti-lenenergo.ru/standart/4006.html). Т.е. «безопасный» уровень агрегации уже публичен и ценности как ров не имеет.
- Экспортный контроль РФ на неперсональные данные — **не нашёл** отдельного акта (поиск исчерпан).

### 4.2 Сторона покупателя (западный страховщик / Lloyd's)
- CEO «Россетей» А. Рюмин — под санкциями UK (16.03.2022) и ЕС (4-й пакет 2022) как глава госоператора сетей (https://interfax.com/newsroom/top-stories/76814/ ; https://www.opensanctions.org/entities/NK-Fd5TG7x4fSZNDZGFZnLZqH/). Само ПАО «Россети» в OFAC SDN — по результатам поиска не найдено (проверить по консолидированным спискам; допущение — региональная ДЗО тоже не в SDN). Но партнёр — российская сетевая компания под контролем государства, т.е. в due diligence страховщика это entity под sectoral/ownership-скринингом.
- Lloyd's: guidance по sanctions due diligence (https://www.lloyds.com/news-and-insights/market-communications/regulatory-communications/news-articles/sanctions-due-dilligence-guidance), Lloyd's Europe «Market Guidance on Russia-Ukraine sanctions» (https://lloydseurope.com/events-and-communications/market-bulletins/market-guidance-on-russia-ukraine-sanctions); рынок «backs sanctions against Russia» (https://www.reinsurancene.ws/lloyds-re-insurance-market-backs-sanctions-against-russia-report/). Прямого запрета покупать данные — **не нашёл**; но вопрос «откуда данные» задают.
- Санкции ЕС запрещают поставку в РФ IT-услуг (с 10.2022), enterprise/industrial ПО (12.2023), расширены до AI-сервисов (18–21-й пакеты, 07.2026: https://www.consilium.europa.eu/en/press/press-releases/2026/07/23/21st-package-of-sanctions-eu-hits-russian-energy-financial-services-and-crypto-hard/). Это обратное направление, но означает: западный продукт не сможет отдать партнёру-сети ничего (ни модель, ни софт) — партнёрство одностороннее. Запрет на *импорт* услуг/данных из РФ в ЕС — **не проверил** (допущение: общего запрета нет).
- **Прецедент US ICTS/Kaspersky (20.06.2024)**: Commerce запретил Kaspersky, т.к. «software design, development, and supply are conducted in Russia» = «unacceptable risk» (https://www.mofo.com/resources/insights/240716-commerce-issues-first-ever-icts-final-determination). Rule по connected vehicles запрещает с MY2027 ПО, «designed, developed… by persons linked to China and Russia» (https://www.sidley.com/en/insights/newsupdates/2024/09/...). Продукт «расчётное ядро с данными из РФ-сети и ИИ-разработчиками в РФ» попадает ровно в этот паттерн для US-покупателей. Для страховщика это red flag на первой же анкете вендора.

**Опровержение:** «легально» ≠ «продаваемо». Даже если формального запрета нет, RF-provenance данных и разработчиков — блокер в vendor due diligence западного страховщика, а для сотрудников партнёра — уголовный риск по 275.1.

---

## 5. Коммодитизация: что остаётся у ИИ-надстройки

- Методики стандартны и открыты: CIGRE A2.37 (частоты), IEEE C57.104 (DGA), NFPA 855/UL 9540A (BESS safety), P50/P90 — общее место. EPRI прямо говорит, что классификация root cause сделана «by engineering judgement by subject matter experts at EPRI, TWAICE, and PNNL» на публичных данных — т.е. лучшую публичную модель BESS-риска уже делают консорциумом.
- **Fathom** (Bristol, UK): Swiss Re купила 13.12.2023 (сумма не раскрыта); после сделки — «owning the data pipeline from raw terrain intelligence through to probabilistic modelling creates a significant competitive moat» (https://www.fathom.global/newsroom/swiss-re-acquires-fathom/ ; https://www.swissre.com/risk-knowledge/risk-perspectives-blog/seeing-flood-risk-clearly.html ; https://insuretechtrends.com/ai-flood-modelling-reshapes-insurer-risk/). Модель, выросшая на публичном рельефе, стала ценной как **собственный hazard-слой + поглощение инкумбентом** — не как независимый вендор.
- **RMS** → Moody's, ~$2,0B (объявлено 05.08.2021), 400+ моделей, 120 стран (https://www.insurancejournal.com/news/national/2021/08/05/625920.htm). Ценность — калибровка на claims-данных клиентов за 30 лет и регуляторное принятие, не алгоритм.
- Oasis LMF (industry-owned, open-source) создан именно чтобы снизить зависимость от вендоров моделей; аналитика рынка называет проигравшими «mid-tier point solutions that can't defend margins once incumbents… bundle features» (https://www.preventionweb.net/news/oasis-launches-industry-owned-not-profit-catastrophe-modelling-saas-platform-provide ; https://secondorderrisk.substack.com/p/insurance-reorients-around-data-and).
- Инкумбенты уже держат «свои» модели: Munich Re Green Tech Solutions — гарантии производительности на 10–20 лет, «risk experts dig into failure rates, degradation curves…», 12+ лет экспертизы (https://www.munichre.com/landingpage/en/new-green-tech-solutions.html ; https://www.ad-hoc-news.de/boerse/news/ueberblick/why-munich-re-s-green-tech-solutions-quietly-matter-for-the-energy/69589959).
- Примера «лучшая модель на публичных данных удержала позицию как независимый вендор в страховой аналитике» — **не нашёл**. Найденные истории успеха (Fathom, RMS, kWh, ONYX) — либо накопленные proprietary-данные клиентов/собственные hazard-слои, либо поглощение.

**Вывод:** ров ИИ-надстройки на публичных данных — нулевой; удерживают (а) proprietary-данные, накапливаемые из клиентских портфелей, (б) регуляторное/рыночное принятие модели (годы), (в) статус MGA/риск-носителя.

---

## 6. Альтернативный ров — обязательство вместо данных

- **kWh Analytics** — уже MGA: Solar Revenue Put (Swiss Re, Everest Re), property до $100M/локация (Aspen). Т.е. лидер «данных по ВИЭ» стал страховщиком — подтверждает, что данные монетизируются через принятие риска.
- **Munich Re aiSure × TWAICE**: гарантия точности SoH ±2%, индемнити 8× стоимости аналитики, страховщик группы Munich Re (S&P AA), после due diligence платформы Munich Re (aiSure factsheet, 2022). Модель: вендор аналитики даёт гарантию, но носитель риска — страховщик. Это и есть граница: **вендор с гарантией = застрахованный вендор, а не MGA**; MGA — когда вендор принимает андеррайтинговые решения от имени capacity.
- **Omnidian**: гарантия 95% выработки, «we'll send you a check» (https://performance.omnidian.com/); кто носитель риска (страховщик/перестраховщик, регулирование как сервисного контракта) — **не нашёл**.
- Для команды: гарантия по модели требует capacity-партнёра, лицензий (MGA — регулируемая деятельность в UK/EU/US) и западной юрисдикции; ИИ-команда в РФ + партнёр-сеть в РФ этого не получат (см. §4.2).

---

## 7. Итоговая таблица

| Тезис гипотезы | Статус | Ключевое опровержение |
|---|---|---|
| Массив BESS-данных, которого нет у других | Опровергнуто | EPRI публична (81→95 инцидентов, только медиа-источники); BMS-данные у TWAICE/ACCURE, уже проданы Munich Re/Aviva/NARDAC |
| Массив ВИЭ-данных | Опровергнуто | kWh 30% США + MGA; Raptor 373 ГВт; ONYX 9k отказов ↔ Aviva; DNV 1100 проектов |
| Массив сетевых отказов | Ослаблено | CIGRE 425k трансформаторо-лет/27 стран; HSB 5 млн локаций; FM Global 200 лет; сырые TADS закрыты для всех |
| РФ-сеть относится к массиву | Опровергнуто | В РФ 6,6 ГВт ВИЭ, BESS — не найдено; популяция советского оборудования; домен-шифт задокументирован (Турция vs CIGRE) |
| РФ-данные легально применимы | Не опровергнуто формально, но заблокировано практически | Нет найденного прямого запрета; но 275.1 УК, режимы КИИ/ТЭК, CEO под санкциями, прецедент Kaspersky/ICTS |
| Ров ИИ-надстройки на открытых методиках | Опровергнуто | Ни одного примера независимого удержания; Fathom/RMS/kWh — собственные данные или поглощение |
| Ров через обязательство | Возможен, но меняет бизнес | Это MGA/страховая конструкция (kWh, aiSure) — нужна capacity и западная лицензия |

## 8. Явно не найдено / не проверено
- Точное число записей EPRI после 03.2025.
- PowerUp, WindESCo — данные о продажах страховщикам.
- Установленная мощность промышленных СНЭ в РФ.
- Отдельный акт РФ об экспортном контроле неперсональных данных.
- Запрет ЕС/UK/US на импорт данных/услуг *из* РФ (допущение: общего нет).
- Присутствие ПАО «Россети»/ДЗО в OFAC SDN (по поиску — нет; требует проверки по спискам).
- Носитель риска по гарантии Omnidian.
- Исследования переносимости именно российских сетевых данных.
- Содержание SynthGrid EnergyPassport (403).
