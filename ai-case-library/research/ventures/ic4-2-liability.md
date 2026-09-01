# IC4-2. Проверка критерия фальсификации: «софт собирает пакет — лицензированный инженер подписывает»

Дата проверки: 2026-09-01. Роль: исследователь-скептик. Задача — опровергнуть утверждение:
«Модель "софт собирает пакет, лицензированный инженер ставит подпись" юридически и практически встраивается в процесс: AHJ примет такой пакет, а инженер согласится подписывать машинно-собранный документ».

## ВЕРДИКТ (кратко)

**Утверждение в наивной формулировке ОПРОВЕРГНУТО, в скорректированной — выживает с серьёзными оговорками.**

- Модель «продаём девелоперу собранный пакет, потом находим инженера под подпись» — **юридически нерабочая**: это классический plan stamping, запрещённый во всех 50 штатах доктриной responsible charge. Инженер обязан сам «независимо контролировать и направлять» работу, иначе — дисциплинарка вплоть до отзыва лицензии.
- Модель «софт — инструмент инженера, который остаётся engineer-of-record» — легальна и уже реализуется, но тогда **покупатель — инженерная фирма, а не девелопер/EPC**, что меняет ICP и unit-экономику продукта. Это и есть частичная фальсификация исходной гипотезы.
- Дополнительный удар: в ключевых юрисдикциях между «пакетом» и разрешением стоит **обязательный независимый peer review квалифицированными экспертами** (Нью-Йорк с 2025/2026 — для всего >600 kWh), то есть машинно-собранный документ в любом случае читает живой профильный рецензент.
- И главное по «боли»: критический путь BESS-разрешения — **дискреционные слушания (CUP/SUP), общественная оппозиция и мораторShe (~150 муниципальных, 98 в одном штате Нью-Йорк)**, а не скорость сборки бумаг. Генератор пакета эту боль не решает.

---

## 1. Кто формально подписывает HMA по NFPA 855-2026

**Что нашёл:**

- NFPA 855 (2026) делает HMA **дефолтным требованием для большинства ESS-установок** (раньше — только по триггерам). HMA «must be provided to the AHJ for any indoor or outdoor ESS installation» по 2026-й редакции. Источник: Code Red Consultants, «Hazard Mitigation Analysis Updates — NFPA 855 (2026)», https://coderedconsultants.com/insights/hazard-mitigation-analysis-updates-nfpa-855-2026/ ; Telgian, «NFPA 855 Changes in the 2026 Edition», https://www.telgian.com/nfpa-855-changes-in-2026/
- Вторичные источники о 2026-й редакции: анализ и планирование должны «be conducted or directed by qualified professionals», «led by a registered Professional Engineer (PE)»; рекомендация (аннекс-уровень): risk assessment направляет registered design professional с опытом в fire protection engineering и в энергонакопителях. Источники: sunlithenergy.com/nfpa-855-guide/ ; firecodes.ai/blog/nfpa-855-2026-edition-key-code-changes-explained ; energy-storage.news/nfpa-855-2026-edition-updates-and-what-they-mean-for-energy-storage-projects/
- **НЕ НАШЁЛ** дословного текста раздела 4.4 NFPA 855-2026 (стандарт платный; вторичные источники раздел с точной формулировкой «кто подписывает» не цитируют). **Допущение:** формальное требование «PE-штампа» на HMA чаще исходит не из самого NFPA 855 (там язык «acceptable to the AHJ» / рекомендации аннекса), а из практики конкретного AHJ и из общих правил штатов о том, что engineering work подаётся за печатью PE. Это допущение согласуется со всеми найденными вторичными описаниями.
- Практика AHJ: юрисдикции (пример — San Diego County Fire Protection District, Interim BESS Directive 05.2025, https://www.sandiegocounty.gov/content/dam/sdc/sdcfa/documents/development-services/BESS%20Directive%2005.15.2025_FINAL.pdf) требуют HMA для всех объектов; в подаче ожидается «signed HMA» вместе с UL 9540/9540A-документами (sunlithenergy.com/nfpa-855-guide/).

**Вывод по п.1:** де-факто индустриальная норма — HMA готовит/направляет и подписывает fire protection engineer / PE; AHJ ждёт подписанный документ. «Софт без инженера» не проходит; вопрос лишь в том, чьим инструментом софт является.

## 2. Ответственность подписанта и эффект пожаров

- **Moss Landing (Vistra, 300 MW, пожар 16.01.2025):** волна исков в федеральных и штатных судах Калифорнии против Vistra, LG Energy Solution, PG&E и связанных компаний; эвакуация >1000 жителей; в июле 2025 Vistra подписала ASAOC с EPA (демонтаж батарей, снос, мониторинг воздуха/воды). Источники: Local News Matters, 22.05.2025, https://localnewsmatters.org/2025/05/22/wave-of-litigation-follows-january-fire-at-vistra-moss-landing-battery-facility/ ; Vistra 10-K FY2025 (SEC), https://www.sec.gov/Archives/edgar/data/1692819/000169281926000006/vistra-20251231.htm ; CBS News SF.
  - Важно для нашей проверки: **ответчики — владелец, производитель батарей и энергокомпании; исков против fire protection engineers / авторов HMA в найденных материалах НЕТ (не нашёл).**
- **McMicken (APS, Surprise, AZ, 04.2019):** 8 пожарных + полицейский госпитализированы; причина — внутренний дефект ячейки → каскадный thermal runaway; спор APS vs LG Chem о причине; вывод отчётов — Novec 1230 суппрессия была неадекватна против thermal runaway. Источники: Utility Dive, 2020, https://www.utilitydive.com/news/aps-says-runaway-thermal-event-caused-2019-battery-explosion-outlines-4-st/582475/ ; pv-magazine-usa.com/2020/07/30/... ; IEEE Spectrum. **Деталей исков/сеттлментов пострадавших пожарных найти не удалось (не нашёл — вероятно, закрытые условия).**
- **Gateway (San Diego, 2024/2025):** отдельно не искал глубоко — в выдаче фигурирует в общем ряду инцидентов (canarymedia.com о «flaws in the battery industry's early designs»). **Помечаю как непроверенное.**
- **Эффект на требования:** после Moss Landing Калифорния приняла SB 38 (подписан 10.2024: обязательный emergency response plan, координация с пожарными, подача плана в округ/город — leginfo.legislature.ca.gov, bill_id=202320240SB38) и SB 283 (подписан 10.2025: обязательная консультация с пожарной службой ДО подачи заявки; поручение fire marshal рассмотреть ограничение размещения ESS dedicated-use noncombustible buildings/outdoor) + CPUC ужесточила GO 167. Источники: solarpowerworldonline.com/2025/10/california-passes-battery-storage-safety-standards-after-moss-landing-fire/ ; canarymedia.com/articles/batteries/california-law-moss-landing-fire-safety ; coxcastle.com (CPUC BESS rules).
- **E&O инженеров:** конкретных данных «FPE отказываются подписывать BESS-документы / премии по E&O для BESS-подписантов выросли» **не нашёл**. Общий рынок professional liability в 2025 — мягкий (ставки снижались >2 лет, Ryan Specialty, April 2025 U.S. PL Market Report, https://blog.ryanspecialty.com/april-2025-u.s.-professional-executive-liability-insurance-market-report); типичные премии инжиниринговых фирм $3,000–15,000/год (малые) до >$100,000 (крупные), франшизы $5,000–25,000 (1800insurance.com). При этом страховщики самих BESS-проектов ужесточают требования к safety-документации (ess-news.com, 06.11.2025; pv-magazine.com, 07.11.2025). **Допущение:** климат после Moss Landing повышает осторожность подписантов, но документального подтверждения «инженеры не подписывают» нет; наоборот — FPE-фирмы активно продают HMA как услугу (Jensen Hughes, Telgian, Fire & Risk Alliance, ESRG, Sparc, Rigsbee и др.), т.е. подписывать готовы — свои документы.

**Вывод по п.2:** прецедентов ответственности именно подписанта HMA не найдено; иски бьют по владельцам/производителям. Опровержения «инженер побоится подписывать» нет — но и подписывать он согласен то, что контролировал сам (см. п.5).

## 3. Насколько различаются AHJ и идёт ли стандартизация

- Различия реальны и велики: «BESS is still an unlisted use in the majority of U.S. counties» → дискреционные CUP/SUP-процессы с непредсказуемыми сроками (Carina Energy, BESS Permitting Guide, https://carina.energy/bess-permitting-guide/).
- **NYC — отдельная вселенная:** FDNY Certificate of Approval через форму TM-2 (подаёт производитель/агент), затем DOB review, FDNY plan review, инспекции, operating permit (nyc.gov ESS equipment approval guide; eticaag.com/tm-2-for-bess-in-nyc-fdny-coa-requirements/).
- **Штат Нью-Йорк:** обновлённый fire code принят 25.07.2025, действует с 01.01.2026 — независимый peer review, explosion protection, central station monitoring (nyserda.ny.gov; environmentenergyleader.com).
- **Стандартизация сверху действительно идёт** (риск сжатия вариативности — подтверждён): IFC 2024 §1207 (codes.iccsafe.org), NFPA 855-2026, NYSERDA Battery Energy Storage System Model Law + Model Permit (nyserda.ny.gov/.../Battery-Energy-Storage-System-Model-Law.pdf), совместные рекомендации CESA + ACP-CA (07.2025, storagealliance.org), а также **state preemption**: NY (≥25 MW — ORES), OH (≥50 MW), MI (≥50 MW/200 MWh) и всего ~7 штатов с механизмами обхода локальных мораториев (carina.energy/bess-moratoriums/state-bypass-laws/).
- Против стандартизации: та же Калифорния движется в обратную сторону — AB 303 предлагал ОТМЕНИТЬ opt-in обход локального пермиттинга для ≥200 MWh (energy-storage.news).

**Вывод по п.3:** сегодня вариативность высокая (продукту есть что нормализовать), но тренд двоякий: модельные законы и preemption сжимают вариативность в самых крупных сегментах, а низовые ordinance плодят новую. Риск для продукта средний, не убийственный.

## 4. Peer review — настоящее узкое место?

- FCNYS 2020 §1206.8 давал AHJ право требовать peer review за счёт девелопера, но «despite the benefits, peer reviews are rarely utilized»; **FCNYS 2025 ДЕЛАЕТ peer review ОБЯЗАТЕЛЬНЫМ для любого проекта >600 kWh** (вне NYC). NYSERDA ведёт Peer Review Program с вет-листом рецензентов: Camelot Energy Group, DNV, Energy Safety Response Group; рецензируются HMA, FMEA, UL 9540A-отчёты; applicant'у рекомендовано закладывать **≥45 рабочих дней** на процесс (4 фазы, включая устранение замечаний). Источник: NYSERDA Energy Storage Peer Review Guidebook, январь 2026, https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Energy-Storage/2026-01-Energy-Storage-Peer-Review-Guidebook.pdf (текст извлечён из PDF).
- Санта-Крус и др. округа Калифорнии: «County may retain third-party experts (at the applicant's cost) to review certain technical reports» (cdi.santacruzcountyca.gov, BESS FAQs).
- **Цену peer review в долларах не нашёл** (не публикуется; оплачивает заявитель). Для масштаба: UL 9540A-тестирование оценивается в $25,000–60,000 (sunlithenergy.com/ul-9540a-test-method-battery-energy-storage/ — вторичный источник, помечаю как оценку).
- Рецензенты и авторы HMA — это один и тот же узкий пул фирм (Jensen Hughes делает и «AHJ Representation + Plan Review», jensenhughes.com; Sparc — «BESS Peer Review», sparcfp.com). 

**Вывод по п.4 (сильный аргумент против исходной модели):** даже идеально собранный пакет упирается в очередь к квалифицированному человеку-рецензенту с правом требовать правки. Ускорение сборки не ускоряет 45+ дней ревью. Логичный вывод для продукта: продавать инструмент обеим сторонам конвейера (авторам И рецензентам) или именно рецензирующим фирмам — гипотеза «продаём девелоперам» ослаблена.

## 5. Аналоги модели «пакет под чужую печать»

- **Plan stamping в engineering — незаконен во всех 50 штатах.** Доктрина responsible charge: подписывая/штампуя документ, PE заявляет, что подготовил его сам или под своим «независимым контролем и направлением» (Калифорния: PE Act, bpelsg.ca.gov/laws/pe_act.pdf; Невада: nvbpels.org сводка правил печати). Штамповка чужой работы — «one of the most common grounds for board discipline», от выговора до отзыва лицензии (ASCE «The Proper Use of the PE Seal», asce.org; pdh-pro.com/pe-resources/pe-sealing-and-stamping/; legalclarity.org по Калифорнии).
- Следствие для продукта: **формула «софт собирает → инженер ставит подпись» легальна ТОЛЬКО если инженер — реальный автор/руководитель работы, а софт — его инструмент** (как SAFER, CFD, расчётные пакеты — это давно норма). Нелегальна, если пакет собран вендором/девелопером, а инженер привлечён «на подпись». TurboTax-модель (софт считает, CPA подписывает как preparer) в инженерии напрямую не переносится: у CPA нет доктрины responsible charge в таком виде; у PE — есть. **Допущение:** аналогия с LegalZoom (софт+юрист) тоже хромает — правила UPL мягче, чем правила лицензионных бордов PE. Отдельных судебных дел «софт-вендор + PE-подпись» не искал глубоко — не нашёл в рамках этой проверки.
- Рынок уже отвечает на вопрос «кто покупатель»: инструменты строят сами инженерные фирмы — **BESS SDK от Fire & Risk Alliance** (bess-sdk.com — база инцидентов, site layout, HMA-гайды), **firecodes.ai**, **CodeComply.ai** (AI plan review — продаётся и AHJ), Sparc и PBFPE публично формулируют границу: AI — decision support, «any AI-assisted deliverable must undergo thorough, manual review», финальные решения — за инженером (sparcfp.com/the-role-of-artificial-intelligence-in-fire-protection-engineering/; pbfpe.com/post/ai-in-fire-protection).

**Вывод по п.5:** ключевая фальсификация. Юридическая конструкция вынуждает продавать софт инженеру (или строить свою инжиниринговую фирму с software leverage — «tech-enabled services»), а не продавать девелоперу пакет с приглашённой подписью.

## 6. Где реально болит процесс

- Критический путь — **дискреционное разрешение (CUP/SUP) со слушаниями**: «public hearings, broad AHJ latitude to impose conditions, and real denial risk»; пожарная служба имеет независимую юрисдикцию — «project can obtain zoning approval and still be stopped by the fire authority» (Carina Energy, BESS Permitting Guide).
- **Мораторії:** ~150 муниципальных ограничений в 17 штатах; Нью-Йорк — 98 (≈65% всех) в 37 округах; типичный мораторий 6–18 месяцев с риском продления/перехода в постоянный запрет (environmentenergyleader.com, «New York Battery Storage Moratoriums Hit 98 Municipalities»; eticaag.com/bess-moratorium-database/; carina.energy).
- Прочие тормоза: смена OEM в середине пермиттинга +6–12 мес.; изменение site plan → interconnection restudy +12–24 мес. (Carina).
- Точной статистики «доля отказов/возвратов HMA» **не нашёл**. Время самого peer review — ≥45 рабочих дней (NYSERDA, см. п.4); ministerial-пермиты после CUP — «weeks to months» (Carina).

**Вывод по п.6:** главный тормоз — политика и слушания, не сборка документов. Пакет документов — необходимое условие, но не бутылочное горлышко таймлайна. Продукт сокращает недели работы консультанта, а не месяцы слушаний и мораториев.

---

## Итог по критерию фальсификации

| Подутверждение | Статус |
|---|---|
| AHJ примет машинно-собранный пакет | Частично: примет пакет за подписью PE, но в NY (и растущем числе юрисдикций) добавлен обязательный человеческий peer review 45+ раб. дней |
| Инженер согласится подписывать машинно-собранный документ | Только если он сам в responsible charge (софт = его инструмент). «Подпись под чужой сборкой» = plan stamping, незаконно во всех 50 штатах |
| Модель встраивается в процесс «как есть» (продажа девелоперам/EPC) | ОПРОВЕРГНУТО в наивном виде: юридика толкает к продаже инженерным/рецензирующим фирмам или к tech-enabled инжинирингу |
| Продукт решает главную боль | Сомнительно: критический путь — слушания/оппозиция/мораторії, не бумаги |

**Не нашёл (явно):** дословный текст NFPA 855-2026 §4.4; цену HMA и peer review в $; иски против подписантов HMA; данные об отказах инженеров подписывать; условия сеттлментов McMicken; детали Gateway.

**Ключевые допущения помечены по тексту (4 шт.).**
