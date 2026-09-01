# IC4-3 — Доступность американского рынка BESS для команды российского происхождения

**Дата проверки:** 01.09.2026. **Роль:** исследователь-скептик, задача — опровергнуть утверждение.

**Проверяемое утверждение:** «Американский частный рынок BESS-девелоперов доступен команде российского происхождения: продажа софта частным девелоперам/EPC не упирается в санкционные и комплаенс-барьеры».

---

## Вердикт (кратко)

**Утверждение опровергнуто ЧАСТИЧНО.** Прямого юридического запрета на продажу permitting-софта частным US-девелоперам командой граждан РФ (живущих вне РФ, с юрлицом в США) — **нет**. Но утверждение в формулировке «не упирается в санкционные и комплаенс-барьеры» — **ложно**: найдено минимум четыре реальных барьера, из которых один (FEOC-режим для BESS с июля 2025) бьёт точно по целевому клиенту — BESS-девелоперу, живущему на ITC-кредите и на 10-летнем риске recapture. Барьеры преодолимы структурированием (грин-карты/резидентство вне РФ, прозрачный cap table, US-инкорпорация, данные в US-периметре), но они означают удлинённые сейлз-циклы, вопросы о бенефициарах в каждом enterprise-онбординге и ненулевой хвостовой риск дискреционного ICTS-разбирательства (прецедент — Касперский).

---

## 1. Формальные барьеры: ICTS, IEEPA, connected vehicles

### 1.1 ICTS-режим (EO 13873, 15 CFR part 7 / part 791) — ГЛАВНЫЙ формальный хвостовой риск

- Режим ICTS позволяет Commerce (BIS/OICTS) запрещать или ограничивать транзакции с ICTS (информационно-коммуникационные технологии и сервисы), имеющие связь с «иностранными противниками». РФ — в списке foreign adversaries (вместе с КНР, Кубой, Ираном, КНДР, режимом Мадуро). Источники: [Steptoe — Commerce Issues Final Rule Targeting Connected Software Applications](https://www.steptoe.com/en/news-publications/international-compliance-blog/commerce-issues-final-rule-targeting-connected-software-applications.html); [BIS — Commerce Issues Final Rule to Formalize ICTS Program](https://www.bis.gov/press-release/commerce-issues-final-rule-formalize-icts-program).
- **Критично:** определение «person owned by, controlled by, or subject to the jurisdiction or direction of a foreign adversary» в ICTS-правилах **включает граждан или резидентов страны-противника, не являющихся гражданами/LPR США** ([15 CFR § 791.2 / бывш. part 7, Cornell LII](https://www.law.cornell.edu/cfr/text/15/791.2); подтверждено сводкой [Morgan Lewis, дек. 2024](https://www.morganlewis.com/pubs/2024/12/securing-the-icts-supply-chain-commerce-issues-final-rules-pursuant-to-eo-13873)). То есть US-корпорация, контролируемая гражданами РФ без грин-карт, **формально попадает в периметр возможного ICTS-ревью**, если её софт относится к покрываемым категориям. Грин-карта/гражданство США выводит физлицо из определения.
- Покрываемые категории транзакций включают ICTS, используемые в секторах критической инфраструктуры (энергетика — один из секторов по PPD-21), и «connected software applications». Финальное правило о connected software applications перечисляет критерии оценки, среди них — «ownership, control, or management by persons subject to a foreign adversary's jurisdiction» ([Hughes Hubbard](https://www.hugheshubbard.com/news-insights/insights/commerce-updates-icts-regulations-with-new-app-controls)). Рамочное ICTS-правило формализовано и вступило в силу в феврале 2025 ([Steptoe — Update on ICTS Rules 2025](https://www.steptoe.com/en/news-publications/international-compliance-blog/update-on-icts-rules-recent-actions-and-path-ahead-in-2025.html)).
- **Прецедент применения — Касперский:** 20.06.2024 BIS выпустил первое в истории Final Determination по ICTS — полный запрет Kaspersky Lab (включая US-дочку) продавать софт и обновления в США; обновления отрезаны с 29.09.2024; три юрлица внесены в Entity List за сотрудничество с российскими военными/разведкой ([Morgan Lewis](https://www.morganlewis.com/pubs/2024/06/commerce-issues-first-ever-ban-on-information-and-communications-technology-and-services-transactions-under-eo-13873); [Mayer Brown](https://www.mayerbrown.com/en/insights/publications/2024/06/bis-issues-first-icts-ban-prohibiting-sales-and-updates-to-kaspersky-products-and-services-in-the-us-while-ofac-sanctions-senior-executives-and-directors); [Covington](https://www.cov.com/en/news-and-insights/insights/2024/06/commerce-department-issues-first-final-determination-and-prohibition-under-the-icts-rule)).
- **Оценка:** это дискреционный, штучный инструмент (за 5 лет — один запрет софт-компании, и это была компания со штаб-квартирой в Москве и связями с разведкой). Для US-инкорпорированного permitting-SaaS без операций в РФ вероятность ревью низкая, но **не нулевая и не опровержимая** — юридический периметр охватывает команду по признаку гражданства. Это хвостовой риск, а не запрет. **Не нашёл** ни одного случая ICTS-действия против US-компании с основателями-гражданами РФ, живущими вне РФ.

### 1.2 Connected vehicles rule (BIS, 14.01.2025) — аналога для энергетики НЕТ

- Финальное правило BIS от 14.01.2025 запрещает импорт/продажу связанного ПО/железа (VCS/ADS) для легковых машин, «designed, developed, manufactured, or supplied by» лицами под юрисдикцией КНР или РФ; софт — с модельного года 2027 ([Mayer Brown](https://www.mayerbrown.com/en/insights/publications/2025/01/us-commerce-department-finalizes-rule-on-connected-vehicles-with-supply-chain-links-to-china-and-russia); [Gibson Dunn — вступило в силу 17.03.2025](https://www.gibsondunn.com/bis-connected-vehicles-rule-effective-as-of-march-17-2025/)).
- Расширение секторального подхода: ANPRM по дронам (UAS) от 03.01.2025 ([Sidley](https://www.sidley.com/en/insights/newsupdates/2025/01/us-department-of-commerce-seeks-to-protect-drones-supply-chain-from-foreign-adversaries)); коммерческий транспорт — анонсирован будущий rulemaking.
- **Аналогичного секторального правила для энергетики / BESS / permitting-софта не нашёл** (помечаю явно). Но тренд «секторальные ICTS-правила по цепочкам поставок, где software supply-chain из РФ/КНР = запрещённая» — подтверждён двумя секторами за один 2025 год. Риск появления energy-правила на горизонте 3–5 лет — реальный, направление уже отработано (допущение-экстраполяция).

### 1.3 DOJ Data Security Program (EO 14117) — касается, но в обратную сторону

- Правило DOJ (в силе с 08.04.2025, конец grace period 08.07.2025) запрещает/ограничивает передачу bulk-данных американцев «странам озабоченности» (РФ в списке) и **covered persons** — включая вендоров и подрядчиков, связанных с этими странами ([White & Case](https://www.whitecase.com/insight-alert/doj-issues-guidance-bulk-sensitive-data-rules); [Federal Register, 08.01.2025](https://www.federalregister.gov/documents/2025/01/08/2024-31486/preventing-access-to-us-sensitive-personal-data-and-government-related-data-by-countries-of-concern)).
- Для продукта: планы площадок и datasheet'ы — не «sensitive personal data», под правило не подпадают. **Но**: правило заставило enterprise-заказчиков встроить в vendor-онбординг вопросы «есть ли у вендора covered persons / доступ из стран озабоченности». Инженер-гражданин РФ, физически находящийся в РФ, с доступом к данным клиента — красный флаг по DSP-логике клиента, даже если формально данные не «bulk sensitive». Команда должна сидеть вне РФ — это условие, а не опция.

### 1.4 CFIUS — для продаж НЕ релевантен, для фандрайза/экзита — да

- CFIUS рассматривает **иностранные инвестиции в US-бизнесы**, а не продажи софта клиентам. Продажа подписки девелоперу CFIUS не триггерит (анализ, не требует источника — это периметр статута FIRRMA).
- Релевантность: (а) если компания инкорпорирована вне США и будет покупать US-активы; (б) при экзите — покупатель будет диligence'ить РФ-связи (см. прецедент DoorDash ниже). Допущение: для SaaS-продаж — нерелевантно.

---

## 2. FEOC / Prohibited Foreign Entity — неожиданно самый «прицельный» барьер (найден в ходе опровержения)

- OBBBA (04.07.2025) ввёл запретительные правила «prohibited foreign entities» для клин-энерджи налоговых кредитов, включая **Section 48E ITC — основной кредит BESS-проектов (30%)**. «Covered nations»: КНР, **РФ**, КНДР, Иран ([Baker Tilly](https://www.bakertilly.com/insights/understanding-foreign-entity-of-concern); [Foley Hoag — FEOC Rules and Battery Storage](https://foleyhoag.com/news-and-insights/blogs/energy-and-climate-counsel/2026/july/the-prohibited-foreign-entity-(or-feoc)-rules-and-battery-storage/)).
- **«Specified foreign entity» включает физлиц — граждан covered nations, не являющихся гражданами/LPR США** ([Norton Rose / projectfinance.law — Working Through the FEOC Maze](https://www.projectfinance.law/publications/working-through-the-feoc-maze)). Пороги «foreign-influenced entity»: 25% у одного SFE, 40% суммарно, 15% долга. То есть US-стартап, где основатели-граждане РФ без грин-карт держат ≥25%, **сам формально является foreign-influenced entity** по этой рамке.
- Что это значит для девелопера-клиента: BESS-проект теряет весь 30% ITC при нарушении material-assistance порога (с 2026 — 55% затрат не-PFE, к 2030 — 75%) и попадает под **10-летний recapture**, если контракты дают SFE «effective control» над объектом; в 13 факторов effective control входят **IP-лицензионные соглашения, заключённые после 04.07.2025** ([Energy-Storage.News — «FEOC compliance for BESS is a decade-long obligation»](https://www.energy-storage.news/feoc-compliance-for-bess-is-a-decade-long-obligation/); [Foley Hoag](https://foleyhoag.com/news-and-insights/blogs/energy-and-climate-counsel/2026/july/the-prohibited-foreign-entity-(or-feoc)-rules-and-battery-storage/); [Morgan Lewis, март 2026](https://www.morganlewis.com/pubs/2026/03/how-feoc-rules-are-reshaping-energy-storage-tax-credit-eligibility)).
- **Честная оценка обеих сторон.** Формально: SaaS-подписка на permitting-инструмент — не «manufactured product» (не входит в material assistance cost ratio) и почти наверняка не «effective control» над объектом (не управляет генерацией/хранением). Юридически чистый вывод «наш софт вне FEOC-периметра» защитим. **Практически:** девелопер, у которого на кону 30% CAPEX и 10 лет recapture, диligence'ит теперь ЛЮБОГО контрагента с nexus к covered nations; вендор-«foreign-influenced entity» по определению — это лишний абзац в tax opinion и лишний вопрос tax equity инвестора. Это не запрет, это **трение в каждой сделке** и готовый повод юристу клиента сказать «давайте возьмём аналог без РФ-нексуса». Гайденс Treasury по effective control ещё дописывается (поручение — авг. 2025, [Foley Hoag](https://foleyhoag.com/news-and-insights/blogs/energy-and-climate-counsel/2026/july/the-prohibited-foreign-entity-(or-feoc)-rules-and-battery-storage/)) — неопределённость сама по себе барьер.

---

## 3. Практика: KYC / vendor onboarding у девелоперов и EPC

- **По конкретным компаниям (NextEra, Plus Power, Key Capture, Spearmint, esVolta, Burns & McDonnell, Mortenson, Blattner) публичных анкет с вопросами о гражданстве бенефициаров НЕ НАШЁЛ** — вендор-порталы непубличны. Помечаю явно.
- Косвенно (сильно): NERC CIP-013 обязывает utilities и BES-субъектов вести supply-chain cyber-risk-планы и оценивать вендоров ПО через анкеты (NATF ESSCR Questionnaire) до заключения контракта ([NERC/NATF Implementation Guidance](https://www.nerc.com/globalassets/programs/compliance/compliance-guidance/implementation/cip-013-supply-chain-risk-management-plans-natf-1.pdf); [Venminder — обзор CIP-013](https://www.venminder.com/blog/vendor-risk-management-requirements-nerc-cip-013-1)). CIP-013 формально касается BES Cyber Systems (не permitting-SaaS), но крупные девелоперы/IOU распространяют vendor-скрининг на весь софт (допущение, основанное на стандартной практике TPRM).
- FEOC (раздел 2) добавил с 2025–2026 отдельный слой anti-covered-nation диligence у BESS-девелоперов — уже как условие сохранения ITC, т.е. финансово мотивированный.
- **Прецеденты отказов вендорам с РФ-корнями в US cleantech/constructiontech после 2022 — прямых НЕ НАШЁЛ** (помечаю явно). Ближайшие прецеденты отказов по РФ-происхождению — из смежных областей: DoorDash сорвал сделку по покупке NY-стартапа Fridge No More (основатели-россияне), сославшись на due diligence; компания закрылась, ~600 сотрудников уволены (март 2022, [CNBC](https://www.cnbc.com/2022/03/17/the-silicon-valley-fallout-from-waging-economic-war-against-russia.html)); Slush отозвал победу Immigram у российских основателей — «purely political, not business» ([PitchBook, 2022](https://pitchbook.com/news/articles/slush-pulls-immigram-win-russia)). Оба кейса — 2022, пик; свежих (2024–2026) аналогов не нашёл.

---

## 4. Успешные прецеденты RU-founded в США (опровержение тезиса о «закрытом рынке»)

Это сильнейший контраргумент против версии «рынок закрыт»:

- Стартапы с российскими корнями привлекли **$3.3 млрд в 2024 (46 сделок, средний чек $22.5M)** и **>$3 млрд в 2025 (58 сделок, средний чек $22.1M)** после провала 2022–2023 ([Oninvest, 2026](https://en.oninvest.com/article/startups-with-russian-roots-have-survived-one-crisis-but-there-is-a-new-one-ahead)).
- Примеры (там же): **Neon** (Никита Шамгунов) — поглощён Databricks за ~$1 млрд (2025); **ClickHouse** — $350M раунд, оценка $6.35 млрд; **Avride** (Аркадий Волож) — $375M; **Plata** — $910M, оценка $3.1 млрд. ClickHouse и Neon продают инфраструктурный софт американским enterprise, включая регулируемые отрасли.
- Как структурируются (Oninvest): релокация команды в США/ЛатАм/ОАЭ, **полный разрыв операционных связей и активов с РФ**, прозрачный cap table с верифицированными источниками средств.
- Специфично по энергетике/стройке/страхованию: **проверяемых примеров RU-founded софт-компаний, продающих именно US-энергетике после 2022, не нашёл** (Grid Status, Camus Energy — подтверждения российских корней основателей нет; помечаю явно). Отсутствие примера в энергетике — слабый негативный сигнал (сектор чувствительнее среднего) либо просто малая выборка.
- Новые барьеры 2026 (Oninvest): ужесточение иммиграции США — сбор $100 тыс. за H-1B, приостановка иммиграционных виз для граждан 75 стран, включая РФ (основатели идут через O-1); включение РФ в **AML-блэклист ЕС**, кратно ужесточившее комплаенс против россиян в европейских банках.

---

## 5. Критическая инфраструктура и статус софта

- Энергетика — сектор критической инфраструктуры (PPD-21/CISA), и ICTS-периметр «ICTS used in critical infrastructure» формально может дотянуться до софта, применяемого в секторе (см. 1.1). Но permitting-софт **не является операционной технологией**: не подключается к SCADA/EMS, не входит в BES Cyber System по NERC CIP (CIP-013 покрывает системы, влияющие на bulk electric system в реальном времени — [Venminder](https://www.venminder.com/blog/vendor-risk-management-requirements-nerc-cip-013-1)). Отсутствие SCADA-подключения **снимает NERC CIP-вопрос, но не снимает ICTS-периметр и не снимает вопросы корпоративного TPRM клиента**.
- FERC CEII (critical energy infrastructure information): однолинейные схемы и планы площадок энергообъектов могут трактоваться заказчиком как чувствительные; это решается NDA и хранением данных в US-регионе, юридического запрета на обработку частной US-компанией нет (**не нашёл** нормы, ограничивающей обработку по гражданству сотрудников — помечаю; анализ: CEII-режим касается раскрытия FERC-контролируемой информации, не частных SaaS).

## 6. Данные пакета: EAR / ITAR

- ITAR — не при чём: гражданские стационарные накопители не входят в USML (анализ; спорных трактовок не нашёл).
- UL 9540A-протоколы **публикуются производителями в открытом доступе** — например, [публичный отчёт Fortress Power/CSA](https://www.fortresspower.com/wp-content/uploads/2022/10/20221014-eVault-MAX-80128223-UL-9540A-Test-Report.pdf) и [страница комплаенса Tesla](https://energylibrary.tesla.com/docs/Public/EnergyStorage/Powerwall/General/Compliance/SafetyStandardsLithiumIonElectrochemical/en-us/GUID-2927B686-2691-4A8F-9643-D57B21F9AB61.html). «Published» технология не подпадает под EAR; коммерческие datasheet'ы и планы площадок — EAR99/не-технология. **Прямого разбора «UL 9540A под EAR» не нашёл** (помечаю), но сам факт открытой публикации отчётов производителями — сильное свидетельство отсутствия контроля.
- Нюанс: EAR99-ограничения на экспорт **в РФ** сейчас широкие; если часть команды физически в РФ и получает клиентские технические данные — это потенциальный экспорт в РФ и отдельная головная боль. Вывод тот же, что и в 1.3: **команда и данные — строго вне РФ**.

## 7. Банковско-платёжный слой

- **Mercury** (банк по умолчанию для стартапов нерезидентов): в 2024 массово закрыл счета и перестал обслуживать компании с основателями из длинного списка стран; затронуты даже Украина (основатели, находящиеся в стране) и Хорватия (член ЕС); причина — давление FDIC на банк-партнёр Choice и «слишком сложные санкционные программы» ([The Paypers](https://thepaypers.com/fintech/news/mercury-stops-serving-startups-in-several-countries); [Kyiv Independent](https://kyivindependent.com/as-ukraine-banks-on-its-young-tech-startups-western-banks-are-cutting-them-off/)). Россия/Беларусь у Mercury — в запрещённых странах; сторонние обзоры трактуют запрет для РФ как «citizens and residents, без workaround» ([entity.inc](https://www.entity.inc/blog/restricted-countries-us-bank-account/)), при этом кейс Украины показывает, что политика применялась по **месту нахождения** основателя, а не паспорту ([The Paypers](https://thepaypers.com/fintech/news/mercury-stops-serving-startups-in-several-countries)). Официальную страницу Mercury проверить не удалось (403). Итог: Mercury для команды с РФ-паспортами — как минимум лотерея, независимо от места жительства.
- **Stripe**: ограничения сформулированы по **локации**, не гражданству — «does not support users located in Russia, Ukraine and Belarus» ([Stripe support](https://support.stripe.com/questions/sanctions-on-russia-and-belarus)); Stripe Atlas доступен нерезидентам, кроме находящихся в санкционных юрисдикциях ([docs.stripe.com/atlas](https://docs.stripe.com/atlas)). Гражданин РФ с адресом и налоговым резидентством вне РФ и US-корпорацией — формально проходит, но enhanced KYC по паспорту РФ вероятен (допущение, подтверждаемое общим паттерном «banks may deny regardless of residence» — [entity.inc](https://www.entity.inc/blog/restricted-countries-us-bank-account/)).
- Традиционные банки (Chase, BoA и т.п.) требуют личного присутствия/SSN хотя бы одного управляющего; с РФ-паспортом — enhanced due diligence, но при виде/грин-карте и US-адресе счета открываются (допущение из практики, прямых свежих прецедентов отказов/одобрений 2025–2026 не нашёл — помечаю).

---

## Сводка: что опровергнуто, что устояло

| № | Подутверждение | Статус |
|---|---|---|
| 1 | «Нет формальных запретов на продажу такого софта» | **Устояло с оговоркой**: запрета нет, но ICTS-периметр формально охватывает граждан РФ без LPR; прецедент полного запрета (Касперский) существует; секторальные правила (авто, дроны) множатся |
| 2 | «Комплаенс клиентов — не барьер» | **Опровергнуто**: FEOC-режим 48E (РФ — covered nation, физлица-граждане считаются SFE, порог 25%, 10-летний recapture) делает РФ-нексус вендора предметом диligence в каждой сделке BESS-девелопера с 2026 |
| 3 | «Прецедентов отказов нет» | Не опровергнуто и не подтверждено: прямых отказов вендорам не нашёл; смежные (Fridge No More/DoorDash, Immigram/Slush) — 2022 |
| 4 | «RU-founded компании успешно продают в США» | **Подтверждено** ($3.3B/2024, $3B/2025, Neon, ClickHouse), но примеров именно в энергетике не нашёл |
| 5 | «Данные пакета не регулируются» | Устояло (UL 9540A публичны, EAR99), при условии «данные и команда вне РФ» |
| 6 | «Банкинг/платежи — решаемо» | Частично опровергнуто: Mercury фактически закрыт, Stripe — по локации проходит; всё решается только при резидентстве вне РФ |

## Условия, при которых гипотеза остаётся жизнеспособной (must-have, не nice-to-have)

1. Юрлицо — US C-Corp; никаких операций, активов, сотрудников, серверов в РФ (стандарт выживших: Oninvest).
2. Основатели — налоговые резиденты вне РФ; целевое состояние — грин-карты/гражданство США (выводит из определений и ICTS «citizen or resident», и FEOC «specified foreign entity» — двойной эффект).
3. Готовый «FEOC comfort package» для клиентов: письмо юристов, что продукт — не manufactured product, не material assistance, не effective control; cap table и источники средств — прозрачны.
4. Данные клиентов — только в US-облаке, доступ только из-за пределов РФ; SOC 2.
5. Банкинг — не Mercury; закладывать 2–4 недели на enhanced KYC (допущение).

**Главный нефальсифицированный риск:** дискреционное расширение ICTS на энергосектор или общее ужесточение (по образцу connected vehicles) в горизонте жизни компании — вероятность не оценить, последствие — фатальное для US-only продукта. Митигация — скорость получения LPR-статуса основателями и диверсификация рынков.
