# IC4-1. Конкурентная проверка: «Позиция не занята — генератора разрешительного пакета BESS нет»

Дата проверки: 2026-09-01. Роль: исследователь-скептик, задача — опровергнуть утверждение.

## ВЕРДИКТ

**Утверждение опровергнуто ЧАСТИЧНО — в самой опасной его части.** Специализированного SaaS «введи проект → получи HMA-пакет по NFPA 855» на рынке действительно не найдено (поиск по многим формулировкам — пусто; «не нашёл» помечено ниже). НО ключевая посылка «пакет собирается с нуля вручную и это открытая позиция» ломается о два факта:

1. **Вендоры батарей УЖЕ поставляют ядро пакета бесплатно к железу.** В реальном разрешительном деле (Arlington BESS, Snohomish PUD, 25 МВт, 38×Tesla Megapack 2XL, HMA от 03.02.2025) EPC Ameresco прямо пишет, что его сайт-специфичный HMA — обёртка вокруг «proprietary and confidential Tesla HMA», подготовленного самой Tesla ([PDF, arlingtonwa.gov](https://www.arlingtonwa.gov/DocumentCenter/View/13278/Exhibit-13---BESS-Hazard-Mitigation-Analysis)). Tesla также обещает «draft Site-Specific HMA» вместе с заявкой на строительный пермит (FPE-отчёты Megapack в открытых делах: [EDF-RE Fraser Energy](https://www.edf-re.com/wp-content/uploads/07_Fraser-Energy_Megapack_Fire-Protection-Engineering-Report.pdf)). Это сценарий «немецкого Ausfallarbeit»: инкумбент раздаёт ядро продукта бесплатно.
2. **Данные UL 9540A — НЕ публичные по умолчанию.** База UL — добровольная, производитель сам выбирает уровень раскрытия (от «только модель и контакт» до полного отчёта) ([PR Newswire, 27.10.2020](https://www.prnewswire.com/news-releases/ul-launches-ul-9540a-database-to-recognize-manufacturers-who-have-completed-testing-for-their-energy-storage-systems-301151521.html); [UL infosheet](https://collateral-library-production.s3.amazonaws.com/uploads/asset_file/attachment/26695/UL_9540A_Database_Infosheet_%2B_Authorization_form_DIGITAL.pdf)). Тезис гипотезы «данные испытаний — публичные, продукт — упаковка» в общем случае неверен: без кооперации вендора пакет не собрать.

Что осталось от позиции: ниша «софт для независимых пожарных консультантов/EPC на не-Tesla проектах и малых девелоперах» — уже, чем в гипотезе, и с риском бесплатного госрешения снизу (SolarAPP+ автоматизировал residential storage) и бесплатных вендорских пакетов сверху.

---

## 1. Пожарно-инжиниринговые фирмы: есть ли у кого софт?

| Фирма | Статус | Софт генерации HMA? |
|---|---|---|
| **Fisher Engineering** | Куплена **Bowman Consulting Group** (NASDAQ: BWMN) 15.05.2023; ~$5M годового биллинга, 24 сотрудника ([Businesswire, 15.05.2023](https://www.businesswire.com/news/home/20230515005310/en/); [Bowman IR](https://investors.bowman.com/news/news-details/2023/Bowman-Acquires-Fisher-Engineering-Expands-Fire-Protection-and-Life-Safety-Engineering-Services/default.aspx)) | Не найдено. Консалтинг. Сигнал: BESS-пожарные консультанты — цель M&A для больших инжиниринговых групп |
| **Jensen Hughes** | Активна, BESS-практика широкая ([jensenhughes.com](https://www.jensenhughes.com/insights/mitigating-lithium-ion-battery-energy-storage-systems-bess-hazards)) | Есть digital-платформа **Advisr** (данные/аналитика), но продукта «генерация HMA» не найдено ([digital services](https://www.jensenhughes.com/services/digital)) |
| **ESRG (Energy Safety/Storage Response Group)** | Осн. 2019, Delaware OH; тестирование, code compliance, permitting support, ERP, обучение ([energyresponsegroup.com](https://www.energyresponsegroup.com/)) | Не найдено. Чистый консалтинг/сервис |
| **Fire & Risk Alliance** | Активна, BESS-направление (моделирование, испытания) ([fireriskalliance.com](https://fireriskalliance.com/battery-energy-storage-systems/)) | Софт-продукта не найдено |
| **PES, TÜV/UL Solutions, DNV** | Не проверялись глубоко (**не нашёл** признаков HMA-софта в общих выдачах) | — |

**Итог:** софта-генератора у консультантов не нашёл — тут утверждение держится. Но HMA обязана вести/подписывать registered design professional (PE) с опытом fire-protection ([Exponent](https://www.exponent.com/article/expanded-safety-guidelines-battery-energy-storage-systems); блоги отрасли) — значит, продукт без PE-подписи не закрывает работу, только ускоряет её. Это ограничивает модель «софт вместо консультанта» до «софт для консультанта».

## 2. Permitting-tech стартапы

- **PermitFlow** (YC, осн. 2021) и **Pulley** (осн. 2021, seed $4.4M от Susa Ventures, 2022) — горизонтальные construction-permitting платформы (подача/трекинг), признаков BESS/HMA-специализации **не нашёл** ([venturescout.io](https://www.venturescout.io/p/permitflow)).
- **SolarAPP+ (NREL, бесплатный, DOE-funded)** — **уже пермитит PV+storage**, >160 юрисдикций, >32 800 проектов ([energy.gov](https://www.energy.gov/cmei/systems/articles/160-communities-now-automating-solar-permitting-solarapp)); есть API для интеграции с гос-софтом. **Но scope — residential**; commercial/utility-scale явно вне охвата ([IREC](https://irecusa.org/programs/solarapp/); [NREL training, 03.2025](https://energy-ready.org/wp-content/uploads/2025/03/Residential-Rooftop-PV-Permitting-Training_Final_03.05.2025.pdf)). Риск бесплатного госрешения реален для residential/малого C&I сегмента; для utility-scale HMA пока нет — но прецедент «государство делает это бесплатно» создан.
- **Symbium** (Stanford AI Lab, Complaw) — автоматизация residential energy permitting/compliance ([Scout Cities](https://scoutcities.com/blog/ai-tools-simplifying-permitting-processes)). Storage-модуль utility-scale — **не нашёл**.
- **Paces** (Series A $11M, авг. 2024, Navitas Capital) — agentic AI для девелоперов solar/wind/**battery storage**; продукт «Permitting Predictor» (оценка пермит-риска площадки в минуты) ([Utility Dive](https://www.utilitydive.com/news/data-platform-paces-nabs-11m-to-scale-clean-energy-development/722760/); [paces.com](https://www.paces.com/news/paces-raises-11-million-to-accelerate-clean-energy-development)). Это siting/риск-скрининг, не генерация HMA-пакета — но это **ближайший финансируемый сосед**, которому добавить генерацию пакета логичнее всего.
- **GreenLancer, Lyra** — plan sets/marketplace для residential solar; BESS-HMA продукта **не нашёл**.
- AI plan review (сторона AHJ, не девелопера): **CodeComply.ai** (проверяет планы против NFPA/ICC), **CivCheck** (куплен Clariti, окт. 2025), **Archistar** (LA e-check, апр. 2025) ([Propmodo](https://propmodo.com/can-ai-really-help-speed-up-the-construction-permitting-process/); [codecomply.ai](https://codecomply.ai/)). Ниша ревью автоматизируется быстрее, чем ниша генерации.

## 3. Страховой канал

Страховщики — драйвер требований, не владельцы ниши: fire-документация (UL 9540/9540A, NFPA 855) — условие страхуемости ([kWh Analytics «Beyond the Spark»](https://kwhanalytics.com/beyond-the-spark-insuring-battery-storage/); [Solarif](https://solarif.com/academy-article/what-are-battery-storage-insurance-requirements-in-2025/); [Honeywell insurer's guide](https://buildings.honeywell.com/content/dam/hbtbt/en/documents/downloads/events-lp/37522_01_BESS_Codes_and_Standards_Insurers_Guide_IE.pdf)). Собственного софта генерации пакетов у страховщиков **не нашёл**. Скорее канал дистрибуции/усилитель спроса, чем конкурент. (FM Global datasheets — требования, не софт; глубоко не проверял — допущение.)

## 4. UL 9540A: публичность данных

- База UL — **opt-in**: производитель решает, публиковать ли (a) только модель+контакт, (b) summary, (c) полный отчёт ([PR Newswire](https://www.prnewswire.com/news-releases/ul-launches-ul-9540a-database-to-recognize-manufacturers-who-have-completed-testing-for-their-energy-storage-systems-301151521.html)).
- Часть отчётов лежит в открытую (residential: Fortress Power eVault MAX, AlphaESS, Pytes — PDF на сайтах вендоров), часть utility-scale всплывает в публичных пермит-делах (Tesla Megapack 2 FPE-отчёты в делах EDF-RE, NSW HSC). Но системно: fire code требует предоставить данные AHJ **по запросу**, не публично ([Mayfield Renewables](https://www.mayfield.energy/technical-articles/ul-9540-and-9540a-explained/)).
- **Вывод: посылка «данные публичные» из гипотезы НЕ подтверждается как общее правило.** Продукт зависит от кооперации вендора батарей или от накопления библиотеки отчётов из открытых пермит-дел (что возможно, но это и есть défendable-актив, а не «просто упаковка»).

## 5. НЕКРОЛОГ (permitting-tech / fire-safety-tech, 2020–2026)

- **Camino Technologies** (govtech permitting, raised $5.9M) — продана **Clariti**, май 2023; не смерть, но самостоятельной компании не стало ([GovTech](https://www.govtech.com/biz/clariti-buys-camino-technologies-in-permitting-tech-deal)).
- **CivCheck** (AI plan review) — куплен Clariti, окт. 2025 ([Propmodo](https://propmodo.com/can-ai-really-help-speed-up-the-construction-permitting-process/)).
- **OpenCounter, ePermitHub** — поглощены Accela ([GovTech](https://www.govtech.com/biz/accela-adds-to-its-permitting-power-via-acquisition)).
- **Fisher Engineering** — поглощена Bowman, 2023 (см. выше).
- Паттерн смерти в смысле «закрылись с нулём» в permitting-tech **не нашёл** (явно помечаю: искал «shut down/closed/failed permitting startup» — выдача даёт банкротства residential-инсталляторов solar (100+ за 2023, Vision Solar, Titan Solar — [Solar Power World](https://www.solarpowerworldonline.com/2024/01/bankruptcies-and-closures-rock-residential-solar-installation/)), не софта). Паттерн ниши — **ранняя продажа стратегу/платформе**, а не bust. Для инвестора это скорее плюс (exit-канал: Clariti, Accela, Bowman, инжиниринговые ролл-апы).

## 6. Вендорские пакеты (главный риск)

- **Tesla**: держит собственный конфиденциальный **Tesla HMA** + обещает draft site-specific HMA с пермит-заявкой; EPC (Ameresco) оборачивает его в сайт-специфичный документ ([Arlington HMA, 02.2025](https://www.arlingtonwa.gov/DocumentCenter/View/13278/Exhibit-13---BESS-Hazard-Mitigation-Analysis)). Публичные FPE/UL9540A-интерпретации Megapack гуляют по пермит-делам. **Для Tesla-проектов ядро пакета уже бесплатно.**
- **Fluence**: large-scale fire testing с gas sampling, данные позиционируются для «plume analysis, emergency response training and permitting guidance» ([Energy-Storage.news](https://www.energy-storage.news/fluence-hithium-canadian-solar-bess-units-undergo-large-scale-fire-testing-without-flames-spreading/)).
- **Sungrow**: сжёг 10 МВт·ч BESS в публичном burn-test как доказательство непропагации ([Energy-Storage.news](https://www.energy-storage.news/sungrow-burns-bess-proves-thermal-runaway-propagation-risk-mitigation/)); Sungrow/Fluence/Tesla — топ-3 интеграторов мира ([pv-magazine, 15.07.2026](https://www.pv-magazine-australia.com/2026/07/15/sungrow-leads-first-global-bess-integrator-ranking-as-market-tops-100-gw/)).
- Готовых «HMA-шаблонов скачай и подай» у Fluence/Sungrow/CATL **не нашёл** — но траектория очевидна: тестовые данные и permitting guidance вендоры уже раздают как sales-материал.

## Что это значит для гипотезы (сухой остаток скептика)

1. «Софта нет» — да, прямого конкурента-генератора не нашёл. Но «позиция свободна» ≠ «позиция защитима».
2. Смертельный сценарий подтверждён наполовину: Tesla уже делает «бесплатный Ausfallarbeit» для своих проектов; SolarAPP+ занял residential бесплатно. Остаётся окно: utility-scale/C&I на не-Tesla железе + независимые FPE-консультанты как пользователи.
3. Посылку «данные публичные» из паспорта гипотезы надо переписать: доступ к UL 9540A — переговорный, через вендора или библиотеку открытых пермит-дел.
4. HMA требует подписи PE → бизнес-модель должна быть «tool for the engineer» или «сервис с PE в штате», не self-serve для девелопера.

*Допущения: глубина проверки PES/TÜV/DNV/FM Global — поверхностная; отсутствие продукта у них не гарантировано, помечено выше. Числа рынка (112 ГВт/307 ГВт·ч) из задания не перепроверялись — вне скоупа этого агента.*
