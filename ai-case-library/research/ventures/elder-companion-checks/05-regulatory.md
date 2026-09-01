# Регуляторная проверка: голосовой AI-компаньон для пожилых с эскалацией «наблюдений»

Дата проверки: 1 сентября 2026 г. Проверены действующие на эту дату редакции.

---

## 0. Проверяемое утверждение

> «Регуляторика не блокирует продукт: голосовой AI-компаньон, который отдаёт наружу НАБЛЮДЕНИЯ (а не диагнозы) и эскалирует их человеку, остаётся вне регулирования медицинских изделий в ЕС (MDR) и США (FDA), а обработка данных проходится согласием резидента по GDPR».

## ВЕРДИКТ: **ОПРОВЕРГНУТО** (в формулировке «остаётся вне регулирования» и «проходится согласием»)

Разбивка по трём частям утверждения:

| Часть утверждения | Вердикт | Суть |
|---|---|---|
| «Вне MDR в ЕС» | **Опровергнуто для ядра продукта** | Речевые маркеры когнитивного ухудшения + алерт по отклонению от нормы = MDSW, Rule 11a → **минимум класс IIa** (нотифицированный орган). Вне MDR остаётся только урезанная версия без речевых маркеров. |
| «Вне регулирования FDA» | **Опровергнуто** | Софт, делающий patient-specific анализ и выдающий рекомендации **caregiver'ам, а не HCP, — прямо назван device** в CDS-гайденсе FDA (ред. 29.01.2026). Максимум, на что можно рассчитывать, — *enforcement discretion*, а это не «вне регулирования». |
| «GDPR проходится согласием резидента» | **Опровергнуто** | Согласие когнитивно снижающегося человека — самое хрупкое из оснований; в Нидерландах мониторинг такого человека прямо квалифицируется как **onvrijwillige zorg** по Wet zorg en dwang и требует представителя + процедуру, а не «галочку». Плюс обязательная DPIA. |
| Не учтённый в утверждении слой | — | **EU AI Act ст. 50 уже применяется с 02.08.2026**; при MDR class IIa продукт автоматически становится **high-risk AI**; PLD 2024/2853 делает софт «продуктом» для строгой ответственности. |

**Главный вывод:** регуляторика не «блокирует» продукт, но она **определяет, какой именно продукт вы имеете право продавать**. Формулировка «наблюдения, а не диагнозы» — необходимое, но **недостаточное** условие. Решает не текст на экране, а **заявленное назначение + вся маркетинговая обвязка + наличие постоянного алертинга по отклонению от персональной нормы**. Именно последний элемент — ядро вашей ценности — и является тем, что тянет продукт внутрь регулирования.

---

## 1. EU MDR (Regulation 2017/745): где проходит граница

### 1.1 Актуальные документы

- **MDCG 2019-11 Rev.1**, июнь 2025 — «Guidance on Qualification and Classification of Software in Regulation (EU) 2017/745 – MDR and Regulation (EU) 2017/746 – IVDR». [PDF](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf), [страница обновления 17.06.2025](https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en)
- **Manual on borderline and classification under Regulations (EU) 2017/745 and 2017/746, v5**, апрель 2026. [PDF](https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf)
- **MDCG 2025-6 / AIB 2025-1**, июнь 2025 — FAQ на стыке MDR/IVDR и AI Act. [PDF](https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en?filename=mdcg_2025-6_en.pdf)

### 1.2 Что MDCG говорит «в вашу пользу»

**(а) Wellness прямо исключён.** MDCG 2019-11 Rev.1, §3.1:
> «software only intended for non-medical purposes (excluding MDR Annex XVI devices), such as invoicing, staff planning, e-mailing, web or voice messaging, data parsing, word processing, and back-up, wellness or fitness apps, do not qualify as MDSW»

**(б) Передача и отображение без интерпретации — не изделие.** MDCG 2019-11 Rev.1, Annex I, d.1 «Telemedicine systems»:
> «Telemedicine that solely transfers and displays information for monitoring purposes without interpreting data does not qualify as a medical device.»

**(в) Риск-скоринг по бытовому поведению, а не по физиологии, — не изделие.** Это самая ценная для вас позиция и она есть в Borderline Manual v5, §1.1.9.1 (приложение для профилактики ИППП). Вывод регулятора:
> «the prevention does not rely on specific characteristics of the individual user (physiological parameters, etc…) but mainly on their sexual habits and behaviour… Therefore, the risk calculation is based on indirect criteria and not on physiological parameters… cannot be considered as a medical purpose according to the definition of medical device.»

→ **Это ваш единственный реальный «коридор» под MDR:** та часть продукта, что работает с **бытовыми фактами из содержания разговора** (не ел, не принял лекарство, плохо спал, упал, не выходил из дома), опирается на *поведенческие, косвенные* признаки, а не на физиологические параметры.

### 1.3 Что MDCG говорит против вас (это перевешивает)

**(а) Определение медизделия включает «мониторинг, предсказание, прогноз».** MDR ст. 2(1) (цитируется в MDCG 2019-11 Rev.1, §2):
> «diagnosis, **prevention, monitoring, prediction, prognosis**, treatment or alleviation of **disease**»

Слово «диагноз» — только одно из семи. «Мониторинг» и «предсказание» дают медицинское назначение сами по себе. **Отказ от слова «диагноз» не выводит из-под MDR.**

**(б) Голос — это input, алерт — это output. Прямо перечислены.** MDCG 2019-11 Rev.1, §2, «Input data»: *«Data given through speech recognition»*. «Output data»: *«Alarms (…or a warning in a free text form)»*. То есть архитектура «речь → алерт» полностью внутри понятийного аппарата MDSW.

**(в) Модуль, генерирующий алармы по мониторингу и анализу параметров пациента, — это изделие.** MDCG 2019-11 Rev.1, Annex I, d) Communication Systems:
> «A software module generating alarms based on the monitoring and analysis of patient specific physiological parameters is qualified as a medical device (MDSW).»

И там же, d.1: *«Additional modules such as thresholds alerts may qualify as a medical device if they are intended for medical purposes.»* Ваше «отклонение от личной нормы» — это ровно threshold alert по персональной базовой линии.

**(г) Ключевой удар — новая правка Rule 11(a) в Rev.1 2025 года.** В change-log Rev.1 прямо указано: *«4.2.1. Addition of clarification to Rule 11 (Subrule a). Addition of references and examples on devices intended to prevent the risk of illness […]»*. Сам текст §4.2.1:
> «a device intended to **prevent the risk of illnesses or pathologies by analysing physiological parameters** (e.g. placement of the dorsal vertebrae, analysis of arterial stiffness, etc.) **can be considered as a device providing information which is used to take decisions with diagnosis purpose (potential detection of pathologies) and in this case is in class IIa**.»

Это буквально описывает продукт, который анализирует физиологические параметры, чтобы поймать риск патологии раньше. Формулировка «potential detection of pathologies» закрывает уловку «мы же не ставим диагноз».

**(д) Ближайший прямой аналог в самом гайденсе — умные часы с алертом.** MDCG 2019-11 Rev.1, §3.2, Note 1:
> «MDSW smartwatch app, which is intended to send alarm notifications to the user and/or health practitioner when it recognises irregular heartbeats for the purpose of detecting cardiac arrhythmia.»

Структура идентична вашей: пассивный фон → распознавание паттерна → нотификация пользователю и/или медработнику.

**(е) Computer Aided Detection.** Annex I, b): *«Computer Aided Detection systems are intended to provide information that may suggest or exclude medical conditions are qualified as medical devices (MDSW).»* Формулировка «may suggest» — низкий порог.

### 1.4 Является ли «замедление речи, сбивчивость, спутанность, дезориентация во времени» физиологическим параметром?

Это **центральный спорный вопрос**, и он не решается однозначно текстом гайденсов.

- Аргумент «нет»: MDCG перечисляет как vital physiological parameters *«respiration, heart rate, cerebral functions, blood gases, blood pressure and body temperature»* (§4.2.1, sub-rule 11b). Темп речи там не назван.
- Аргумент «да» (сильнее): в том же списке есть **«cerebral functions»**. Речевая беглость, связность и ориентация во времени — стандартные компоненты клинической оценки когнитивных функций (MMSE/MoCA). *Допущение:* нотифицированный орган и компетентный орган государства-члена с высокой вероятностью прочитают «дезориентация во времени» как прокси когнитивной функции, то есть церебральной функции.
- Классификационный пример прямо рядом: Annex IV, *«Diagnostic MDSW intended for scoring depression based on inputted data on a patient's symptoms (e.g. mood, anxiety) should be classified as class IIb under Rule 11(a)»*. Скоринг психического состояния по симптомам, введённым в софт, — это уже IIb, не IIa.

**Мой вывод (это интерпретация, не текст нормы — допущение):** «детекция ухудшения когнитивного состояния» **является медицинским назначением** в смысле MDR (это «monitoring» и «prediction/prognosis» в отношении disease). Как только это назначение заявлено или следует из функциональности и маркетинга, продукт — MDSW, и по Rule 11(a) он **минимум класс IIa**. Класс I (Rule 11c) недостижим: в Annex III MDCG 2019-11 таблица соответствия IMDRF↔MDR имеет **нижнюю границу IIa** и прямо оговаривает: *«This table does not take into account MDSW which is Class I»*. Примеры класса I в Annex IV — это приложение фертильности и AAC-приложение для людей с нарушением коммуникации, то есть совсем другая природа.

### 1.5 Практические последствия класса IIa

- Нотифицированный орган, полный QMS по ISO 13485, техдокументация, клиническая оценка (MDCG 2020-1), PMS/PMCF, UDI, EUDAMED.
- Ст. 7 MDR + MDCG 2019-11 Rev.1, §3: *«any claims, relating to the intended medical purpose of their MDSW are supported by appropriate level of clinical evidence. If this is not the case, the software … may not be CE marked as a medical device, nor present said claims.»* То есть **делать заявления без клинических доказательств прямо запрещено, даже если вы не собираетесь получать CE**.
- Implementing rule 3.5 (Annex VIII): при пересечении правил применяется самое строгое.
- **Модульность.** MDCG 2019-11 Rev.1 §3 и §7 усиливают требование: *«manufacturers must ensure that the intended purpose of each module is clearly defined»*. Это одновременно и риск (один «медицинский» модуль тянет за собой), и инструмент (архитектурное разделение модулей — легитимная стратегия).

### 1.6 Прецеденты: как классифицированы аналоги

Честно: **публичных решений компетентных органов ЕС по Sensi.AI, SafelyYou, CarePredict, ElliQ я не нашёл.** Ни один из них не является европейской компанией с публичным EU-регуляторным следом; поиск по CE/MDR по ним результата не дал. Не следует принимать отсутствие находки за доказательство отсутствия регистрации — **это пробел исследования, а не вывод**.

Что удалось установить:

- **Sensi.AI** — на собственной продуктовой странице [sensi.ai/product](https://www.sensi.ai/product/) **сознательно не называет ни одного заболевания**: формулировки «detects care anomalies», «Predictive Care Intelligence», «identifies care patterns». Единственное регуляторное заявление — «Sensi is HIPAA Compliant». То есть ровно ваша стратегия, применённая на практике. **Но:** в интервью [TechCrunch, 26.06.2024](https://techcrunch.com/2024/06/26/sensi-ai-grabs-31m-series-b-from-insight-zeev-to-monitor-seniors-24-7) система описана как сигнализирующая о «urinary tract infections, pneumonia». Это классическая ловушка: FDA (см. §3) и MDR смотрят на **всю совокупность labeling, advertising, промо-материалов**, а не только на UI.
- **Nobi** (Бельгия, лампа с детекцией падений) — в пресс-релизе [PRNewswire, 2023](https://www.prnewswire.com/news-releases/nobi-agetech-device-helps-protect-seniors-by-detecting-and-preventing-falls-301713897.html) описан как «already a proven medical device in the Belgian market». Класс MDR и нотифицированный орган из открытых источников подтвердить не удалось. **Требует проверки по EUDAMED.**
- **Самый чистый и лучше всего задокументированный прецедент границы — Apple Watch.** Детекция падения с автоматическим вызовом экстренных служб — **не медизделие**. Уведомление о нерегулярном ритме, «похожем на ФП» — **медизделие**: FDA De Novo [DEN180042](https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180042.pdf), CE-марка в ЕЭЗ с марта 2019 ([Apple Newsroom](https://www.apple.com/newsroom/2019/03/ecg-app-and-irregular-rhythm-notification-on-apple-watch-available-today-across-europe-and-hong-kong/)), в Австралии внесено в ARTG как **класс IIa**.

  Разница ровно в одном: **дискретное событие безопасности (упал) vs. вывод о паттерне, указывающем на состояние здоровья (сердце бьётся неправильно)**. Ваши «речевые маркеры» — это вторая категория, а «упал / не поел» — первая.

---

## 2. EU AI Act (Regulation (EU) 2024/1689)

### 2.1 Актуальные сроки на 01.09.2026 (после Digital Omnibus)

Digital Omnibus on AI: предложен Комиссией 19.11.2025, согласован и, по данным вторичных источников, **опубликован в OJ 24.07.2026, вступил в силу 27.07.2026** ([Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/), [DLA Piper](https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/The-Digital-AI-Omnibus-Proposed-deferral-of-high-risk-AI-obligations-under-the-AI-Act), [CSA Research Note](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-omnibus-vii-deadline-delay-20260/)).
*Оговорка: точный номер регламента-омнибуса и ссылку на OJ подтвердить первоисточником в этой сессии не удалось (EUR-Lex не отдавал контент). **Требует сверки перед использованием в документах для инвестора или клиента.***

| Обязательство | Дата применения | Статус на 01.09.2026 |
|---|---|---|
| Ст. 5 — запрещённые практики | 02.02.2025 | **действует** |
| Обязательства GPAI | 02.08.2025 | действует |
| **Ст. 50 — прозрачность** | **02.08.2026** | **ДЕЙСТВУЕТ УЖЕ СЕЙЧАС** (для систем, размещённых до этой даты — переходный период до 02.12.2026) |
| Annex III high-risk (standalone) | **02.12.2027** (перенесено с 02.08.2026) | ещё не действует |
| Annex I high-risk (встроенные в продукты, в т.ч. MDR) | **02.08.2028** | ещё не действует |

### 2.2 Ст. 5 — запрет эксплуатации уязвимости пожилых: **не применяется к вам**

Ст. 5(1)(b) запрещает ИИ-систему, которая *«exploits any of the vulnerabilities of a natural person… due to their age, disability…»* — но только **с целью или эффектом «materially distorting the behaviour»** и причинения **«significant harm»** ([текст ст. 5](https://artificialintelligenceact.eu/article/5/); [Commission Guidelines on prohibited AI practices, C(2025) 5052 final](https://ai-act-service-desk.ec.europa.eu/sites/default/files/2025-08/guidelines_on_prohibited_artificial_intelligence_practices_established_by_regulation_eu_20241689_ai_act_english_ied3r5nwo50xggpcfmwckm3nuc_112367-1.PDF)). Гайдлайны Комиссии иллюстрируют запрет примерами обмана и манипулятивных предложений/скама в адрес пожилых.

Забота и эскалация к человеку — не «искажение поведения ради вреда». **Ст. 5 вас не запрещает.**
**НО** — это важно для продуктовых решений: компаньон, который *убеждает* («поешь», «прими таблетку», удерживает от отключения подписки, использует эмоциональную привязанность для upsell), уже двигается в сторону «materially distorting behaviour». *Допущение: практический риск здесь не в ст. 5, а в репутации и в потребительском праве, но границу лучше держать явно.*

### 2.3 Annex III high-risk: два входа, оба реальные

**Вход №1 — эмоциональное распознавание, Annex III п. 1(c).**
[Annex III](https://artificialintelligenceact.eu/annex/3/) относит к high-risk *«AI systems intended to be used for emotion recognition»*. Ст. 3(39) + [Recital 18](https://artificialintelligenceact.eu/recital/18/): это система, выводящая **эмоции или намерения** из биометрических данных. Recital 18 исключает **физические состояния** (боль, усталость) и *«mere detection of readily apparent expressions… such as… raised voice or whispering»*, если только они не используются для вывода эмоций.

→ Ваши речевые маркеры (темп, связность, повторы) — скорее «физическое/когнитивное состояние», а не эмоция. **Это защитимая позиция.** Но: если вы добавите анализ настроения / «sentiment», «одиночество», «подавленность» (а для компаньона это очень естественное расширение) — вы **прямо попадаете в Annex III 1(c) → high-risk**. Это архитектурная развилка, которую нужно решить заранее.

**Вход №2 — важнее и почти неизбежен: связка MDR → AI Act ст. 6(1).**
MDCG 2025-6 / AIB 2025-1, Q2 и Таблица 1:
> «A MDAI is considered a high-risk AI system under Article 6(1) AIA if it meets both of the following conditions: 1. the MDAI is a safety component, or the AI system is itself a medical device and 2. the MDAI is subject to a third-party conformity assessment by a notified body»

Таблица 1 из документа:

| MDR-класс | Нотифицированный орган | High-risk по ст. 6(1) AI Act |
|---|---|---|
| MDR Class I (нестерильный, неизмерительный, не многоразовый хирургический) | Нет | **Нет** |
| MDR Class I (стерильный, измерительный, многоразовый хирургический) | Да | **Да** |
| **MDR Class IIa, IIb, III** | Да | **Да** |
| MDR Annex XVI | Да | Да |

→ **Как только продукт становится MDR Class IIa (см. §1.4), он автоматически становится high-risk AI** со всем пакетом (риск-менеджмент, data governance, техдокументация, логирование, human oversight, точность/робастность/кибербезопасность). Срок для этой категории — **02.08.2028**.

Там же, Q4: *«The application of Article 5 AIA, prohibited AI practices and Article 50 AIA transparency obligations… does not depend on the MDR/IVDR classification.»*

**Annex III п. 5(a) («essential public assistance benefits and services, including healthcare services») и 5(d) (обработка вызовов экстренных служб / triage) — к вам, как описано, не относятся**, потому что вы не оцениваете право на получение услуг и не диспетчеризуете экстренные вызовы. *Важно: если вы когда-нибудь начнёте автоматически приоритизировать вызовы бригады или триажировать — вы попадёте в 5(d), который является high-risk.*

### 2.4 Ст. 50 — прозрачность: **применяется к вам уже сегодня**

[Ст. 50(1)](https://artificialintelligenceact.eu/article/50/): провайдеры систем, взаимодействующих напрямую с людьми, обязаны обеспечить, чтобы человек был **проинформирован, что общается с ИИ**, если это не очевидно.
Ст. 50(3): если используется emotion recognition — деплойер обязан информировать людей о работе системы.
Информация даётся *«in a clear and distinguishable manner at the latest at the time of the first interaction or exposure»* и с учётом требований доступности.

**Практика для вас:** голосовой компаньон, который звучит «как человек» и разговаривает с когнитивно снижающимся пожилым, — это самая чувствительная точка. Раскрытие должно быть не в EULA, а **в самом голосовом взаимодействии**, регулярно и в доступной форме. Дата — уже прошла.

---

## 3. США: FDA

### 3.1 Актуальные редакции (важно — обе обновлены в январе 2026)

- **«General Wellness: Policy for Low Risk Devices»**, издано **6 января 2026 г.**, отменяет редакцию от 27.09.2019. [PDF](https://www.fda.gov/media/90652/download)
- **«Clinical Decision Support Software»**, издано **29 января 2026 г.**, отменяет редакцию от 6 января 2026 г. (которая, в свою очередь, отменила финальный гайденс 2022 г.). [PDF](https://www.fda.gov/media/109618/download)
- **«Policy for Device Software Functions and Mobile Medical Applications»**. [PDF](https://www.fda.gov/media/80958/download)

**То есть версия 2022 года, на которую ссылается исходное утверждение, устарела. Проверять надо по редакции 29.01.2026.**

### 3.2 CDS-исключение (§520(o)(1)(E) FD&C Act): **вам не подходит, точка**

CDS-гайденс (ред. 29.01.2026), раздел IV(3), дословно:
> «**Software functions that support or provide recommendations to patients or caregivers – not HCPs – meet the definition of a device.**»

Ваш продукт по определению эскалирует **родственнику** (не HCP) и оператору ухода (HCP только если это лицензированный медработник; в home care это часто не так). **Критерий 3 не выполняется → CDS-исключение недоступно.**

Дополнительно ломаются и другие критерии:
- **Критерий 1** («не обрабатывать сигнал от signal acquisition system»). Гайденс: *«Although many signal acquisition systems are intended to monitor signals for medical purposes… other signal acquisition systems that measure physiological parameters that are not specifically…»*. *Допущение: микрофон, непрерывно снимающий речевой сигнал для извлечения физиологических/когнитивных признаков, с высокой вероятностью будет прочитан FDA как signal acquisition system — это отдельно проваливает Критерий 1.* Требует консультации FDA-регуляторного консультанта (Q-Submission / Pre-Sub).
- **Критерий 4** (HCP должен успеть независимо проверить основания): *«FDA does not consider software functions intended for a critical, time-sensitive task or decision to meet Criterion 4»*.

### 3.3 General Wellness (ред. 06.01.2026): узкий, но **реальный** коридор — и вы из него выпадаете по двум пунктам

Двухчастный тест (раздел III): (1) назначение только general wellness, (2) низкий риск. «Mental acuity» — **прямо в списке разрешённых wellness-заявлений** первой категории.

Но дальше гайденс закрывает именно вашу конструкцию:

> «Products **are not** general wellness products when they are intended to measure, estimate, or report physiologic values for medical or clinical purposes, including screening, diagnosis, **monitoring, alerting**, or management of a disease or condition.»

> «Products are not general wellness products if their labeling, advertising, **user interface, or functionality** includes any of the following: 1. references to specific diseases, clinical conditions, or **diagnostic thresholds**; 2. **alerts, alarms, or prompts that recommend or require specific clinical action or medical management**; …5. intended-use statements that explicitly target diagnosis, screening, monitoring, or management of a disease or condition.»

**И — самое интересное — в редакции 2026 г. появилась именно та «безопасная гавань», которую описывает ваше утверждение:**

> «a product may be considered a general wellness product even if it includes a notification informing a user that **evaluation by a healthcare professional may be helpful** when outputs fall outside ranges appropriate for general wellness use, provided that such notifications:
> • do not identify or name a specific disease or medical condition;
> • **do not characterize the output as abnormal, pathological, or diagnostic**;
> • do not include clinical thresholds, diagnoses, or treatment recommendations; and
> • **do not provide ongoing alerts or monitoring intended to manage a disease or condition**.»

Это буквально «наблюдения, а не диагнозы». **Но вы нарушаете два из четырёх условий:**
1. «третий день говорит медленнее обычного и путает даты» — это **характеристика вывода как отклоняющегося от нормы** (сравнение с личной базовой линией и есть «характеризовать как abnormal»). Формально вы не сказали «патология», но вы сказали «не как обычно», что и есть суть.
2. Ваш продукт **по замыслу** даёт **ongoing alerts and monitoring** — это ядро ценностного предложения, а не побочная функция. Формулировка гайденса прямо это исключает.

Также: гайденс требует, чтобы **labeling, включая promotional materials и marketing communications, не выходил за пределы заявленного назначения**. Кейс Sensi.AI (§1.6) — иллюстрация того, как одно интервью основателя разрушает эту защиту.

### 3.4 Реальный статус по США: «is a device, but likely enforcement discretion — если очень аккуратно»

По «Policy for Device Software Functions and Mobile Medical Applications» ваш продукт попадает в перечень **фокуса надзора** (раздел V.A.3):
> «software functions that perform patient-specific analysis and provide patient-specific diagnosis or treatment recommendations to patients, caregivers, or other users who are not health care professionals»
> «software function that analyzes patient-specific medical information to detect a life-threatening and/or time critical condition, such as stroke or sepsis, and generate an alarm or an alert»

Одновременно **Appendix B** (enforcement discretion — FDA не намерена применять требования) содержит близкие к вам пункты:
- п. 10: «enable a patient or caregiver to create and send an alert or general emergency notification to first responders»;
- п. 11: «keep track of medications and provide user-configured reminders»;
- п. 12: «provide historical trending and comparison of vital signs»;
- п. 13: «aggregate and display trends in personal health incidents (e.g., hospitalization rates or alert notification rates)».

**Вывод по США:** «вне регулирования» — неверно. Верная формулировка: *«скорее всего, является device по §201(h), но при строго дисциплинированном позиционировании (трендинг и логирование, без детекции состояния, без клинических порогов) может попасть в зону enforcement discretion»*. Это **позиция, а не гарантия**: enforcement discretion — не право, его можно потерять одним пресс-релизом. Перед выходом в США — **Q-Submission / Pre-Sub в CDRH**, а не мнение юриста по e-mail.

### 3.5 HIPAA

- HHS: business associate — тот, кто *creates, receives, maintains, or transmits* PHI от имени covered entity ([HHS, Business Associates](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html)).
- **Модель B2B (продаёте агентству домашнего ухода / нанимающему провайдеру): да, вы business associate, BAA обязателен.** Это же и заявляет Sensi.AI («HIPAA Compliant»). Исключение «conduit» (транзитный оператор связи) к вам не относится — вы храните и анализируете.
- **Модель D2C (продаёте семье напрямую): HIPAA к вам вообще не применяется** — и это не облегчение, а смена регулятора: применяется **FTC Health Breach Notification Rule** и общее полномочие FTC по недобросовестным практикам. *Допущение: конкретную редакцию HBNR (правка 2024 г.) в этой сессии первоисточником подтвердить не удалось — требует проверки.*
- Записи голоса + содержание разговора о самочувствии — это PHI в полном объёме; сюда же ложатся требования Security Rule, минимизации, ограничения вторичного использования (обучение моделей на PHI — отдельный, тяжёлый вопрос для BAA).

---

## 4. GDPR

### 4.1 Данные

Голос + содержание разговоров о здоровье + вывод «когнитивное ухудшение» = **данные о здоровье, ст. 9 GDPR** ([текст](https://gdpr-info.eu/art-9-gdpr/)), спецкатегория, обработка по умолчанию **запрещена**, кроме исключений ст. 9(2). Голос дополнительно может быть биометрией (если используется для идентификации говорящего — например, чтобы отличить подопечного от сиделки; это очень вероятная функция).

### 4.2 Работает ли согласие? — Не как единственная опора

- **Ст. 9(2)(a)** требует **explicit consent**. Планка выше обычной.
- **Проблема дееспособности.** GDPR не регулирует, кто даёт согласие за взрослого, утратившего способность понимать. Это отсылка к **национальному гражданскому праву** (опека, попечительство, доверенность, представитель). Соответственно единого европейского ответа нет, и утверждение «проходится согласием резидента» некорректно уже потому, что в вашем ЦА способность дать валидное согласие **деградирует по ходу использования продукта** — то есть согласие, валидное в день установки, может перестать быть валидным через год. **Это требует консультации местного юриста в каждой юрисдикции; из текста GDPR ответ не выводится.**
- **Динамика согласия.** Согласие должно быть отзываемым в любой момент и так же легко, как даётся (ст. 7(3)). Для продукта, чья ценность — непрерывность наблюдения, это конструктивный конфликт.
- **Альтернативы, которые обычно и используются на практике** (*допущение, требует локальной проверки*): ст. 9(2)(h) — «health or social care… on the basis of Union or Member State law» — в связке с ролью **оператора ухода как контролёра**, а вендора как **процессора**. Это часто прочнее согласия, но требует, чтобы у оператора было национальное правовое основание, и накладывает обязанность профессиональной тайны (ст. 9(3)). Ст. 9(2)(c) (vital interests, когда субъект физически или юридически неспособен дать согласие) — только для экстренных ситуаций, не для повседневного мониторинга.

### 4.3 Опровержение №1: Нидерланды — Wet zorg en dwang

Это самый жёсткий контраргумент к тезису «согласие всё решает».

Согласно [dwangindezorg.nl (правительственный портал по Wzd)](https://www.dwangindezorg.nl/wzd/onvrijwillige-zorg), onvrijwillige zorg — это «zorg waarmee de cliënt of zijn vertegenwoordiger niet instemt», а также уход, на который согласился представитель, но против которого клиент **протестует**. Девять категорий по ст. 2 Wzd включают:
- **«uitoefenen van toezicht op betrokkene»** (осуществление надзора за человеком) — сюда попадают cameratoezicht и **toezichthoudende domotica**;
- «beperken van de bewegingsvrijheid»;
- «beperken van de vrijheid het eigen leven in te richten».

**Что это значит для вас в Нидерландах:** непрерывный голосовой мониторинг человека с деменцией — это не «продукт с галочкой согласия», это форма **надзора**, попадающая в режим Wzd, требующая согласия/участия **vertegenwoordiger**, обоснования через «ernstig nadeel» и прохождения **stappenplan** (пошаговой процедуры с участием специалистов). Плюс: если человек **протестует** (снимает устройство, просит выключить) — согласия представителя недостаточно.

Это радикально меняет unit-экономику внедрения: продажа не заканчивается подписью семьи, она включает клинико-правовую процедуру внутри организации-заказчика.
**Требуется консультация нидерландского юриста по здравоохранению — из текста GDPR это не выводимо.**

### 4.4 Опровержение №2: DPIA обязательна, а не «желательна»

- Ст. 35(1) и 35(3)(b) GDPR: DPIA обязательна при обработке спецкатегорий в крупном масштабе и при систематической оценке личных аспектов ([текст](https://gdpr-info.eu/art-35-gdpr/)).
- Нидерландский список обязательных DPIA (Besluit lijst verwerkingen… BWBR0042812, опубликован 27.11.2019, [wetten.overheid.nl](https://wetten.overheid.nl/BWBR0042812)) содержит **сразу несколько** попаданий в ваш кейс: №7 «Gezondheidsgegevens» (крупномасштабная обработка данных о здоровье учреждениями ухода), №13 «Communicatiegegevens», №15 «Profilering», **№16 «Observatie en beïnvloeding van gedrag»**, №17 «Biometrische gegevens».

→ В Нидерландах DPIA — не best practice, а формальная обязанность по нескольким основаниям сразу.

### 4.5 Data residency и локальный инференс: **не маркетинг — в Германии это норма права**

Для немецкого канала возмещения (DiPA) действует жёсткое ограничение. BfArM, DiPA-Leitfaden v1.3 от 15.07.2026, §3.3.3:
> «Die DiPAV beschränkt… den Ort der Datenverarbeitung… auf die Bundesrepublik Deutschland, die Mitgliedstaaten der EU, die Vertragsstaaten des Abkommens über den EWR und die Schweiz und Staaten, für die ein Angemessenheitsbeschluss nach Artikel 45 DSGVO vorliegt. **Eine Verarbeitung personenbezogener Daten außerhalb der EU allein auf Basis von Artikel 46 DSGVO (Standardvertragsklauseln) oder Artikel 47 (Binding Corporate Rules) ist für DiPA nicht zulässig** (vgl. § 5 Absatz 4 DiPAV).»

То есть SCC — недостаточное основание; нужна страна с решением об адекватности. Плюс §5(3) DiPAV **ограничивает перечень целей, на которые вообще можно взять согласие**, и вводит **Kopplungsverbot** (нельзя открывать функции «в обмен на данные»).

**Ответ на вопрос «локальный инференс — юридическое преимущество или маркетинг»:**
- **Юридическое преимущество — да, но не абсолютное.** Плюсы реальные: (а) снятие вопроса о трансграничной передаче (гл. V GDPR) и о зависимости от Data Privacy Framework; (б) сильный аргумент при DPIA — уменьшение объёма данных, покидающих периметр (принцип минимизации, ст. 5(1)(c)); (в) в немецком DiPA — прямое условие допуска; (г) в муниципальных тендерах Северной Европы обычно требование, а не пожелание (*требует проверки по конкретной тендерной документации*).
- **Но это не отменяет:** статус данных как ст. 9, обязанность DPIA, необходимость правового основания, режим Wzd, и — главное — **не отменяет MDR**. Локальный инференс не меняет назначение продукта ни на йоту. MDCG 2019-11 Rev.1, §3.2, Note 3: *«Software may be qualified as MDSW regardless of its location (e.g. operating in the cloud, on a computer, on a mobile phone…)»*.

**Формулировка, которую можно честно использовать:** «локальная обработка снимает трансграничный риск и облегчает DPIA и тендеры; она не является заменой правовому основанию и не влияет на классификацию по MDR».

---

## 5. Национальные требования

### 5.1 Германия: DiPA — путь есть, но он почти пуст

Основание: §§ 40a, 40b SGB XI (введены DVPMG 09.06.2021), процедура — § 78a SGB XI и DiPAV. Первоисточник: [BfArM, DiPA-Leitfaden v1.3 от 15.07.2026](https://www.bfarm.de/SharedDocs/Downloads/DE/Medizinprodukte/dipa_leitfaden.pdf?__blob=publicationFile).

Ключевые условия (§2.1 Leitfaden):
> «Eine DiPA **kann, muss jedoch kein Medizinprodukt sein**. DiPA als Medizinprodukte müssen nach der Verordnung (EU) 2017/745 (MDR) … der **niedrigen Risikoklasse I oder IIa** angehören.»

- Продукт должен снижать нарушения самостоятельности или противодействовать усугублению потребности в уходе (**«pflegerischer Nutzen»** — его нужно **доказать**).
- Только **домашний контекст** («ausschließlich im häuslichen Kontext»).
- **Не DiPA**: приложения для «Wissensvermittlung, Information oder Kommunikation» и для организации работы служб ухода. *Это важно: чисто «компаньон для общения» под DiPA не пройдёт — нужен доказанный уход-эффект.*
- Потолок возмещения: **40 € в месяц** на человека за DiPA + **30 €** за eUL (дополнительные услуги амбулаторных служб) — по Leitfaden v1.3. *(Более ранние источники называют 50 € суммарно; действующей считать цифру из Leitfaden.)*
- С **01.01.2026** действует **BEEP-Gesetz**, вводящий **Erprobung** — предварительное включение в реестр на испытательный срок до 12 месяцев для доказательства pflegerischer Nutzen, с возможностью продления.

**Отрезвляющий факт:** по данным отраслевых источников, за три с лишним года существования § 40a SGB XI **в BfArM не поступило ни одной заявки на включение DiPA**, и первых DiPA ожидают только в течение 2026 г. благодаря Erprobung ([pflege-dschungel.de, «DiPA 2026»](https://pflege-dschungel.de/dipa-2026/)). *Это вторичный источник — требует проверки по официальной статистике BfArM, но сам факт, что BfArM в 2026 г. выпускает Leitfaden v1.3 на 138 страниц и вводит режим испытаний, косвенно подтверждает: канал пока не работает как канал выручки.*

**Практический вывод по Германии:** DiPA — это **не путь к быстрым деньгам**, а долгий регуляторный проект с потолком 40 €/мес и требованием доказательного исследования. Строить бизнес-кейс на возмещении через Pflegeversicherung в первые 2–3 года — **необоснованно**.

### 5.2 Нидерланды

- **Wet zorg en dwang** — см. §4.3. Самое существенное ограничение, и оно не про GDPR, а про право ухода.
- Дополнительно применимы (упоминаю как контур, **первоисточниками в этой сессии не подтверждено — требует локального юриста**): Wkkgz (качество и жалобы в уходе), WGBO (договор оказания медпомощи, представительство), NEN 7510/7512/7513 (ИБ в здравоохранении) — де-факто обязательны в тендерах, MedMij/Wegiz — при интеграции с обменом данными.
- DPIA — обязательна по нескольким пунктам списка AP (§4.4).

### 5.3 Швеция и Дания: **пробел исследования**

Честно: **у меня не осталось бюджета поиска, и первоисточники (retsinformation.dk вернул 403, socialstyrelsen.se — 404) открыть не удалось. Ничего утверждать не буду.**

Что нужно проверить у местных юристов (это гипотезы для проверки, не выводы):
- **Дания:** глава о magtanvendelse в Serviceloven (§§ 124–129a) — режим «personlige alarm- og pejlesystemer» и иных форм надзора в отношении людей со значительно и стойко сниженной психической функцией; решение обычно принимает **kommunalbestyrelsen**, а не семья. *Если это так, датская модель ближе к нидерландской Wzd, чем к «согласию».*
- **Швеция:** отсутствует прямой аналог Wzd; практика строится на **samtycke** + **biståndsbeslut** по Socialtjänstlagen, при этом Socialstyrelsen публиковала разъяснения о невозможности «презумпции согласия» для людей с деменцией. **Требует подтверждения.**
- Обе страны: закупки муниципальные → де-факто решают требования тендера (ИБ, размещение данных, интеграции, языки, SLA), а не только закон.

### 5.4 Общее: стандарты, которые понадобятся независимо от классификации

*(Допущение, основанное на практике рынка, а не на норме)*: EN 50134 (social alarm systems) — часто условие муниципальных контрактов; ISO/IEC 27001 и ISO 27701; при MDSW — ISO 13485, IEC 62304, IEC 82304-1, ISO 14971. Требует проверки по конкретной тендерной документации.

---

## 6. Ответственность за пропущенное событие (missed detection)

### 6.1 Что меняется в ЕС: Directive (EU) 2024/2853 (новая Product Liability Directive)

Новая директива об ответственности за дефектные продукты **прямо включает программное обеспечение в понятие «продукт»** и вводит строгую (безвиновную) ответственность, а также запрещает ограничивать или исключать эту ответственность в отношении потерпевшего.

**Оговорка по источнику:** EUR-Lex в этой сессии не отдавал контент (HTTP 202 с пустым телом при нескольких попытках, включая PDF). **Номера статей (ст. 4 — определение продукта, ст. 6 — ущерб, ст. 7 — дефектность, ст. 22 — транспозиция) и точные даты я приводить как проверенные не могу.** Общеизвестно, что срок транспозиции — **9 декабря 2026 г.**, и что старая Директива 85/374/EEC отменяется, а новый режим применяется к продуктам, размещённым на рынке после этой даты. **Это требует сверки по тексту OJ и консультации юриста — не используйте эти даты в документах без проверки.**

Почему это критично для вас:
- Договорное ограничение ответственности перед **оператором ухода** (B2B) — работает в обычных пределах. Ограничение ответственности перед **пострадавшим пожилым человеком или его семьёй** по режиму product liability — **не работает**: строгая ответственность не отменяется договором, и потерпевший не является стороной вашего договора.
- Софт, который «продолжает обучаться после ввода в эксплуатацию», и обновления — в новом режиме прямо учитываются при оценке дефектности и продлевают ответственность производителя за пределы момента поставки.

### 6.2 Как ограничивают ответственность на практике (B2B-контракты)

*Это отраслевая практика, а не норма — используйте как чек-лист, а не как правовую гарантию:*
1. **Переопределение продукта в договоре:** «decision-support / awareness tool», не «monitoring system» и не «alarm system». Явное «система не предназначена для обнаружения экстренных состояний и не заменяет наблюдение персонала».
2. **Best-efforts, а не SLA на детекцию.** SLA на *доступность сервиса и доставку алерта*, но никогда — на *чувствительность/специфичность детекции*. Обещание «мы поймаем X% событий» — прямой путь и к claim'у о медицинском назначении, и к иску.
3. **Human-in-the-loop как договорная обязанность заказчика**, а не только как ваша фича: оператор обязан подтверждать/эскалировать, ответственность за клиническое решение — на нём.
4. Cap на прямые убытки (обычно кратно годовому платежу), исключение косвенных.
5. Обязательная **страховка ответственности продукта**; в Германии для медизделий-DiPA сведения о страховке ответственности производителя даже публикуются в реестре (Leitfaden, §2.2: *«Haftpflichtversicherung des Herstellers nach Medizinprodukterecht: Höhe der…»*).
6. Логирование всех алертов и их обработки — доказательственная база и в вашу пользу, и против вас.

### 6.3 Известные иски к вендорам мониторинга пожилых

**Не найдено.** Бюджет веб-поиска в этой сессии был исчерпан до проверки этого пункта. **Это пробел исследования, а не вывод об отсутствии исков.**
*Допущение, требующее проверки:* в США основная масса исков по «пропущенным событиям» в eldercare исторически идёт против **учреждений** (negligence, wrongful death), а вендор попадает в дело через третьих лиц/indemnity; отдельная линия — иски о **misrepresentation** к производителям medical alert устройств. Проверить по PACER / Westlaw и по практике страховщиков — это работа для местного litigation-юриста.

---

## 7. Есть ли игроки, закрывшиеся или замедлившиеся из-за регуляторики?

**Прямо задокументированного кейса «закрылись из-за MDR/FDA в нише мониторинга пожилых» я не нашёл.** Не выдаю отсутствие находки за отсутствие явления. Что проверено:

- **Winterlight Labs** (речевые биомаркеры когнитивного снижения — ближайший технологический аналог вашего ядра) — **не закрылась**: приобретена Cambridge Cognition за £7 млн в январе 2023 г. ([Canadian Healthcare Technology](https://www.canhealth.com/2023/02/01/winterlight-labs-acquired-by-cambridge-cognition/)). Но обратите внимание на **траекторию**: продукт живёт как инструмент **для клинических исследований** (research use), а не как потребительский продукт с алертами. Это косвенный, но сильный сигнал: коммерциализация речевых когнитивных биомаркеров в потребительском контуре не состоялась ни у кого из лидеров — все ушли в pharma/clinical trials, где регуляторный статус проще.
- **Canary Speech** — позиционируется как **clinical decision support для клиницистов** (модель Cognitive Health для MCI/AD у пациентов 50+), то есть намеренно в HCP-контуре ([CHAI Registry](https://registry.chai.org/canary-speech), [canaryspeech.com](https://canaryspeech.com/voice-biomarkers/)). Это ровно противоположная вашей стратегия: не «выйти из-под регулирования словами», а «работать с врачом».
- **CarePredict** — признаков закрытия не найдено, компания активна.
- **Германия / DiPA** — самый показательный «регуляторный тормоз» на уровне рынка: канал возмещения существует с 2021 г., но заявок к 2026 г. фактически не было, и государству пришлось вводить режим испытаний (§5.1).

**Честный вывод:** ниша не «убита» регуляторикой — она **сегментирована** ею. Игроки, оставшиеся в потребительском контуре (Sensi.AI, SafelyYou, CarePredict, ElliQ), выжили ценой отказа от медицинских заявлений в официальных материалах. Игроки, работавшие с настоящими клиническими биомаркерами (Winterlight, Canary Speech), ушли в клинический/фарм-контур. **Совместить «клиническую ценность» и «отсутствие регулирования» устойчиво не удалось никому из проверенных.**

---

## 8. РФ (полигон, не рынок) — коротко

**Оговорка по источникам: первоисточники (consultant.ru, garant.ru, roszdravnadzor.gov.ru) в этой сессии не отдали текст статей. Ниже — рамка, а не проверенные цитаты. Всё требует сверки с действующей редакцией и консультации российского юриста.**

- **152-ФЗ «О персональных данных»:** сведения о состоянии здоровья — специальная категория (ст. 10), обработка по общему правилу требует **письменного** согласия установленной формы (ст. 9). Отдельно: требования локализации баз данных граждан РФ (ч. 5 ст. 18), уведомление РКН, оценка вреда, требования по защите (ПП РФ №1119).
- **Статус медизделия:** определение — ст. 38 ФЗ-323 «Об основах охраны здоровья граждан». Госрегистрация — Росздравнадзор, по правилам ПП РФ №1416. Отдельно действует упрощённый порядок для ПО (Приказ Минздрава по номенклатурной классификации; для ПО-медизделий у Росздравнадзора есть методические рекомендации).
- *Допущение:* та же логика, что и в ЕС — если вы заявляете «выявление ухудшения состояния», это медицинское назначение и регистрация; если заявляете «сервис бытового ухода и связи с родственниками», это не медизделие. Практика Росздравнадзора по ИИ-ПО быстро меняется.
- **Как полигон это работает** для сбора данных, отработки диалогов и модели, **но данные, собранные в РФ, юридически бесполезны для ЕС**: для клинической оценки под MDR понадобится доказательная база, собранная по MDR/ISO 14155 и репрезентативная для целевой популяции. *Допущение:* русскоязычная речевая модель также не переносится напрямую на нидерландский/немецкий/шведский — речевые маркеры языкозависимы, и это **отдельный, недооценённый регуляторный и научный риск** (в MDCG 2025-6 требование к репрезентативности датасетов для high-risk MDAI прописано явно).

---

## 9. Что делать: три конфигурации продукта

| | **A. «Бытовой компаньон»** | **B. «Wellness + мягкий сигнал»** | **C. «Медизделие»** |
|---|---|---|---|
| Что выдаёт | Факты из разговора: не поел, не принял таблетку, не спал, упал, не выходил | То же + нейтральный трендинг («разговоры стали короче»), без сравнения с «нормой» | «Признаки когнитивного ухудшения», риск-скор, приоритет |
| MDR | Вне (аналогия: Borderline Manual v5 §1.1.9.1) | **Серая зона**, зависит от формулировок | **Class IIa минимум**, нотифицированный орган |
| FDA | Вероятно enforcement discretion (App. B п.10–13) | Вероятно device + enforcement discretion; General Wellness — **нет** (ongoing alerts) | Device, требуется 510(k)/De Novo |
| AI Act | Не high-risk; ст. 50 применяется | Не high-risk; ст. 50 применяется | **High-risk** по ст. 6(1) (MDCG 2025-6, Табл. 1), срок 02.08.2028 |
| Что теряете | Главную дифференциацию | Часть дифференциации | 18–36 мес. и деньги на NB + клинику |
| Wzd (NL) | Всё равно применяется (это «toezicht») | Применяется | Применяется |

**Рекомендация (интерпретация, не норма):** идти конфигурацией **A** с архитектурным разделением модулей (MDCG 2019-11 Rev.1 §7 о modular MDSW прямо это допускает и требует чётко описать назначение каждого модуля), а речевые когнитивные маркеры **держать как отдельный модуль в R&D-контуре**, накапливая доказательную базу под будущий Class IIa. Не смешивать их в одном intended purpose — иначе «медицинский» модуль утянет за собой весь продукт.

---

## 10. Что можно и чего нельзя говорить в выводе продукта

### ✅ Можно (все три конфигурации)
- Пересказ факта из разговора: «сказал, что сегодня не завтракал», «сказал, что таблетки закончились», «сказал, что упал вчера».
- Факт отсутствия события: «сегодня разговор не состоялся», «три дня подряд не отвечает».
- Нейтральные метрики использования без клинической рамки: «длительность разговоров за неделю», «время звонков».
- Приглашение к человеческому решению без указания причины: «возможно, стоит позвонить» / «команда ухода может захотеть посмотреть».
- Прозрачность: «я — ИИ-ассистент» (обязательно по ст. 50 AI Act, уже в силе).
- Явный дисклеймер: «не медицинское изделие, не предназначено для выявления заболеваний и экстренных состояний, не заменяет наблюдение персонала».

### ⚠️ Осторожно — граница (каждое такое слово двигает вас в конфигурацию B/C)
- Любое сравнение с «нормой»/«обычным» — «третий день говорит медленнее обычного». По FDA-гайденсу General Wellness 2026 это уже «characterize the output as abnormal».
- Слова «отклонение», «аномалия», «изменение», «ухудшение», «baseline», «порог».
- Любой персональный порог, вызывающий алерт.
- Слово «alert» само по себе (в гайденсах FDA и MDCG оно триггерное).

### 🚫 Нельзя (переводит в медизделие / ломает General Wellness / создаёт claim без клин. доказательств)
- Названия состояний в любой форме: «инсульт», «деменция», «когнитивное снижение», «делирий», «ИМП», «пневмония», «депрессия» — включая в блогах, интервью, презентациях, деке для инвестора. *(Кейс Sensi.AI: чистая продуктовая страница + интервью с названиями болезней = защита разрушена.)*
- «Раннее выявление», «early detection», «screening», «predict», «risk score», «probability of…».
- «Клиническая точность», «medical-grade», «clinically validated», «accuracy 9x%» (прямо запрещено в FDA GW 2026 п. 4).
- Рекомендация клинического действия: «вызовите врача», «нужно к неврологу», «проверьте на инфекцию», «увеличьте дозу».
- Любое автоматическое действие с медицинскими последствиями (вызов скорой без человека, приоритизация бригад) — попадание в Annex III 5(d) AI Act.
- Заявления об эмоциональном состоянии («подавлен», «тревожен», «одинок») — риск Annex III 1(c) (emotion recognition → high-risk) плюс медицинский claim.
- «Наш продукт вне регулирования / не требует сертификации» — говорить это клиенту опасно и, скорее всего, неверно.

### 🎯 В какую категорию продукт НЕ должен попасть

1. **MDSW по Rule 11(a) MDR** — «software intended to provide information which is used to take decisions with diagnosis or therapeutic purposes» → **Class IIa минимум**, нотифицированный орган, клиническая оценка, 18–36 месяцев. Триггер: «detection of pathologies» через анализ физиологических параметров.
2. **MDSW по Rule 11(b)** — «software intended to monitor physiological processes» → Class IIa (или IIb, если vital parameters). Триггер: позиционирование как «система мониторинга».
3. **High-risk AI по ст. 6(1) AI Act** — автоматическое следствие из п.1/п.2 (MDCG 2025-6, Табл. 1). Отдельный полный пакет обязательств.
4. **High-risk AI по Annex III 1(c)** — emotion recognition. Триггер: любой вывод об эмоциях/настроении из голоса.
5. **High-risk AI по Annex III 5(d)** — triage / приоритизация экстренных вызовов. Триггер: автоматическая эскалация в экстренные службы.
6. **Device под FDA без enforcement discretion** — триггер: детекция состояния, клинические пороги, ongoing alerts «to manage a condition», или любые условия, ломающие безопасную гавань General Wellness 2026.
7. **Onvrijwillige zorg вне процедуры Wzd (NL)** — это не «категория продукта», а операционный риск: внедрение без stappenplan и без vertegenwoordiger = нарушение закона на стороне вашего клиента, что означает потерю клиента.

---

## 11. Что нужно сделать до вложений (по приоритету)

1. **Зафиксировать intended purpose в одном абзаце** и прогнать его через MDCG 2019-11 Rev.1 Figure 1/Figure 2 (decision steps). Это самый дешёвый шаг с наибольшим эффектом.
2. **Регуляторный консультант по MDR (нотифицированный орган или EU AR)** — один платный борд-ревью формулировки назначения. Дешевле, чем узнать это от компетентного органа.
3. **США: Q-Submission (Pre-Sub) в FDA CDRH** — не обязателен, но это единственный способ получить письменную позицию, а не мнение.
4. **Юрист по праву ухода в Нидерландах** — конкретно по Wzd и по тому, кто в вашей модели контролёр (оператор) и кто процессор (вы).
5. **Локальные юристы в Швеции и Дании** — режим magtanvendelse / samtycke: это пробел моего исследования, а не «зелёный свет».
6. **DPIA как проектный артефакт с самого начала** — она всё равно понадобится, а её структура заставит принять архитектурные решения (что храним, что удаляем, что не покидает периметр) до того, как их станет дорого менять.
7. **Дисциплина коммуникаций** — письменный гайд «что мы говорим / чего не говорим» для сайта, деки, интервью и продавцов. По FDA-гайденсу General Wellness 2026 marketing communications — часть labeling.

---

## 12. Список источников

**ЕС — медизделия**
1. MDCG 2019-11 Rev.1, «Guidance on Qualification and Classification of Software in Regulation (EU) 2017/745 – MDR and Regulation (EU) 2017/746 – IVDR», июнь 2025. https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf
2. Страница обновления MDCG 2019-11 rev.1, 17.06.2025. https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en
3. «Manual on borderline and classification under Regulations (EU) 2017/745 and 2017/746», v5, апрель 2026. https://health.ec.europa.eu/document/download/71a87df8-5ca1-4555-b453-b65bdf8de909_en?filename=md_borderline_manual_en.pdf
4. MDCG 2025-6 / AIB 2025-1, «FAQ on Interplay between the MDR & IVDR and the AI Act», июнь 2025. https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en?filename=mdcg_2025-6_en.pdf
5. MDCG 2021-24, Guidance on classification of medical devices. https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf

**ЕС — AI Act**
6. AI Act, Article 5 (текст, зеркало OJ). https://artificialintelligenceact.eu/article/5/
7. AI Act, Article 6. https://artificialintelligenceact.eu/article/6/
8. AI Act, Article 50. https://artificialintelligenceact.eu/article/50/
9. AI Act, Annex III. https://artificialintelligenceact.eu/annex/3/
10. AI Act, Recital 18 (определение emotion recognition). https://artificialintelligenceact.eu/recital/18/
11. Commission Guidelines on prohibited AI practices, C(2025) 5052 final. https://ai-act-service-desk.ec.europa.eu/sites/default/files/2025-08/guidelines_on_prohibited_artificial_intelligence_practices_established_by_regulation_eu_20241689_ai_act_english_ied3r5nwo50xggpcfmwckm3nuc_112367-1.PDF
12. Digital Omnibus on AI — обзоры (вторичные, как указатель на первоисточник): Gibson Dunn https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ ; DLA Piper https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/The-Digital-AI-Omnibus-Proposed-deferral-of-high-risk-AI-obligations-under-the-AI-Act ; CSA https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-omnibus-vii-deadline-delay-20260/

**GDPR / национальное**
13. GDPR, ст. 9. https://gdpr-info.eu/art-9-gdpr/
14. GDPR, ст. 35. https://gdpr-info.eu/art-35-gdpr/
15. Besluit lijst verwerkingen persoonsgegevens waarvoor een DPIA verplicht is (AP, BWBR0042812, опубл. 27.11.2019). https://wetten.overheid.nl/BWBR0042812
16. Wet zorg en dwang — onvrijwillige zorg (правительственный портал). https://www.dwangindezorg.nl/wzd/onvrijwillige-zorg
17. BfArM, «Das Verfahren für digitale Pflegeanwendungen (DiPA) nach § 78a SGB XI», Leitfaden v1.3 от 15.07.2026. https://www.bfarm.de/SharedDocs/Downloads/DE/Medizinprodukte/dipa_leitfaden.pdf?__blob=publicationFile
18. BfArM, раздел DiPA. https://www.bfarm.de/DE/Medizinprodukte/Aufgaben/DiGA-und-DiPA/DiPA/_node.html
19. Обзор состояния DiPA в 2026 (вторичный источник, требует сверки). https://pflege-dschungel.de/dipa-2026/

**США**
20. FDA, «General Wellness: Policy for Low Risk Devices», 06.01.2026. https://www.fda.gov/media/90652/download
21. FDA, «Clinical Decision Support Software», 29.01.2026. https://www.fda.gov/media/109618/download
22. FDA, «Policy for Device Software Functions and Mobile Medical Applications». https://www.fda.gov/media/80958/download
23. HHS, «Business Associates». https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html
24. FDA De Novo DEN180042, Irregular Rhythm Notification Feature. https://www.accessdata.fda.gov/cdrh_docs/reviews/DEN180042.pdf

**Рынок / прецеденты**
25. Apple Newsroom, ECG app & irregular rhythm notification в Европе, 03.2019. https://www.apple.com/newsroom/2019/03/ecg-app-and-irregular-rhythm-notification-on-apple-watch-available-today-across-europe-and-hong-kong/
26. Sensi.AI, продуктовая страница. https://www.sensi.ai/product/
27. TechCrunch, «Sensi.AI grabs $31M…», 26.06.2024. https://techcrunch.com/2024/06/26/sensi-ai-grabs-31m-series-b-from-insight-zeev-to-monitor-seniors-24-7
28. Canadian Healthcare Technology, «Winterlight Labs acquired by Cambridge Cognition», 01.02.2023. https://www.canhealth.com/2023/02/01/winterlight-labs-acquired-by-cambridge-cognition/
29. CHAI Registry, Canary Speech Vocal Biomarker Model for Cognitive Health. https://registry.chai.org/canary-speech
30. PRNewswire, Nobi AgeTech device, 2023. https://www.prnewswire.com/news-releases/nobi-ai-driven-agetech-device-helps-protect-seniors-by-detecting-and-preventing-falls-301713897.html

---

## 13. Пробелы этого исследования (честный перечень)

1. **Швеция и Дания** — первоисточники не открылись (403/404), бюджет поиска исчерпан. Раздел 5.3 — гипотезы, не выводы.
2. **Directive (EU) 2024/2853 (PLD)** — EUR-Lex не отдавал контент. Номера статей и даты не подтверждены первоисточником.
3. **Иски к вендорам мониторинга пожилых** — не проверено вовсе.
4. **Регуляторный статус Sensi.AI / SafelyYou / CarePredict / ElliQ в ЕС** — публичных данных не найдено; отсутствие находки ≠ отсутствие регистрации. Стоит проверить по EUDAMED.
5. **Класс MDR и нотифицированный орган Nobi** — не подтверждено.
6. **Статистика BfArM по числу заявок на DiPA** — вторичный источник.
7. **РФ** — первоисточники (consultant.ru, garant.ru, roszdravnadzor.gov.ru) текст статей не отдали; раздел 8 — рамка, требующая сверки.
8. **FTC Health Breach Notification Rule (ред. 2024)** — не проверен первоисточником.
