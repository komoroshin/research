# Проверка: «Голосовой ввод и голосовые ассистенты для полевых и подземных промышленных работ — незанятая ниша»

Статус: ЗАВЕРШЕНО
Дата: 2026-09-01

## Порог опровержения (задан заказчиком)
Если Honeywell Vocollect, Zebra, промышленные интеграторы или шахтные вендоры уже продают голосовой ввод осмотров для этих сред — критерий опровергнут.

## ВЕРДИКТ (кратко): КРИТЕРИЙ ОПРОВЕРГНУТ. Полный разбор — в конце файла.
Honeywell продаёт именно голосовой ввод осмотров (inspection) как отдельный коммерческий продукт с 2010-х. См. блок 1.

---

## 1. Honeywell Vocollect — ПОДТВЕРЖДЕНО, продукт есть

**Продукт:** «Honeywell Voice Maintenance & Inspection» (внутреннее имя серверной части — **VoiceCheck**).
Страница продукта: https://automation.honeywell.com/gb/en/software/productivity/workforce-task-management/maintenance-inspection

Первоисточник — официальный «Voice Maintenance & Inspection Solution 1.10 Implementation Guide», © 2023 Honeywell International, 258 страниц:
https://automation.honeywell.com/content/dam/sps/en/documents/productivity/ai-pss-VoiceCheck_Implementation_Guide.pdf

Что установлено по первичке (цитаты из гайда):
- **Это ровно тот сценарий, что в гипотезе:** голос ведёт техника по чек-листу осмотра, ответы техника пишутся в систему-хост. Со страницы продукта: «streamline repair and inspection processes while documenting every step to ensure strict compliance».
- **Железо:** «VoiceCheck is supported on the Talkman A700x series and Honeywell Android devices» (стр. гайда, разд. Hardware Configuration). Носимый терминал Talkman + гарнитура, есть пояса и кобуры для техников. Модель A730x — со встроенным сканером 1D/2D.
- **Хостинг на выбор — локально или облако:** в гайде отдельные главы «Local Hosting» и «Cloud Hosting». То есть **замкнутый контур поддерживается штатно** (on-prem сервер, single/multi-server, decentralized/centralized).
- **Распознавание — на устройстве, не в облаке.** Talkman работает на Linux-ядре, у каждого оператора свои голосовые «templates», которые **загружаются на устройство** («Loading an Operator's Templates on A700», «The Device Will Not Load an Operator Template», Appendix D «Template Training Options»). Движок — Vocollect VoiceCatalyst.
- **Офлайн-работа документирована.** Из release notes VoiceCatalyst: оператор может продолжать выполнять задачу, выйдя из зоны Wi-Fi; накопленные данные и templates отправляются на хост при восстановлении связи (гайд A700x: «Transfers any templates to the host that had not been sent prior to powering…»).
- **Батарея:** от полного заряда стандартная батарея A700x — «14 hours of projected life», ресурс ~1.5 года при комнатной температуре, high-capacity — ~3 года (Implementation Guide 1.10).

**Спецификации Talkman A700x (первоисточник — A700x Product Guide, Honeywell):**
https://help.honeywellaidc.com/Library/Content/Library/en_US/A700x_Product_Guide_en_US.pdf
- ОС: Linux Kernel
- Рабочая температура: −30…+50 °C (A730x: −20…+50 °C)
- Защита: **IP67**, MIL-STD-810F method 514.6, 24 падения с 1.5 м на сталь
- Вес с батареей: 238–320 г
- **ATEX / IECEx / Class I Div 2 в гайде НЕ упомянуты ни разу** (проверено grep по полному тексту 132-страничного гайда). Т.е. Talkman — промышленное, но **не взрывозащищённое** устройство.

**Отраслевые кейсы:** Honeywell пилотировала Voice M&I на **собственных авиадвигательных заводах** (Manufacturing.net, «Voice Enables Hands-Free, Eyes-Free Inspection»). Аэрокосмос/MRO — заявленная целевая отрасль.

**Цены:** публичного прайса нет (enterprise-продажа через партнёров). — требуется допроверка.

### Что это значит для гипотезы
Занято: голосовой чек-лист осмотра на носимом терминале, on-prem, офлайн, on-device распознавание — **это ровно продукт Honeywell, живой и с релизами до 2023 г.**
НЕ закрыто Honeywell'ом (пока по первичке):
- взрывозащищённое исполнение (ATEX/IECEx Zone 1) — Talkman его не имеет;
- LLM-ассистент со свободной речью — Vocollect работает по **жёсткой ограниченной грамматике** («at any given step there are limited options that the user can say»), это не диалоговый агент;
- «память об объекте между визитами» — в VoiceCheck это данные хоста, а не агентская память.

---

## 2. Zebra, Datalogic, Ivanti — голосовой слой поверх мобильных приложений

**Ivanti Wavelink Speakeasy** — https://www.ivanti.com/products/speakeasy
- Прослойка, делающая любое существующее приложение (telnet/web) голосовым: TTS читает экран, STT пишет ответ обратно в хост.
- **Всё распознавание идёт на устройстве:** «Because all the voice processing is handled within the mobile device, there's no need to modify your existing host applications or add middleware» (Ivanti, страница продукта). То есть офлайн-контур закрыт.
- Отрасли по описанию Ivanti включают **«field force automation»**, не только склад.
- Заявка вендора: «customers report productivity gains of 50 percent or more» (Ivanti — маркетинговое число, независимо не подтверждено).
- Работает с Velocity Client v1.2.104+ на Android.
- Пресс-релиз о запуске: https://www.ivanti.com/company/press-releases/2016/wavelink-brings-voice-to-velocity-with-speakeasy (2016)

**Zebra Technologies** — https://www.zebra.com/us/en/support-downloads/software/mobile-computer-software/voice-client.html
- Есть Voice Client для мобильных компьютеров Zebra + Workcloud (коммуникации, задачи).
- Фокус — **склад и retail-фронтлайн, picking**, не осмотры оборудования. Собственного «voice inspection» продукта уровня Honeywell VoiceCheck не обнаружено.
- Экосистема партнёров: EPG **LYDIA Voice** на железе Zebra («AI-driven voice picking»); EPG заявляет +15% эффективности, −30% операционных затрат, −80% времени обучения по сравнению с legacy voice (EPG, https://epg.com/us/ai-driven-voice-picking-the-next-standard-for-warehouse-performance/ — маркетинговое число вендора).
- Апрель 2026: альянс Cubic Vocality + Zebra — мост между PTT-радиостанциями и Zebra Workcloud Sync (то есть Zebra идёт в сторону **голосовой связи**, а не голосового ввода осмотров).

**Datalogic** — отдельного голосового продукта для осмотров не найдено (требуется допроверка).

### Вывод по блоку
Голосовой ввод как «слой над формой» — коммодити, продаётся минимум с 2016 г., работает на устройстве офлайн. Технологического рва здесь нет.

---

## 3. EAM/промышленный софт — голос уже встроен

**IBM Maximo — ПОДТВЕРЖДЕНО, штатная функция.**
- Официальная документация IBM: «Enabling voice-guided inspections» — https://www.ibm.com/docs/en/masv-and-l/maximo-manage/cd?topic=forms-enabling-voice-guided-inspections
- Механика ровно как в гипотезе: «the inspection form is read aloud to the inspector and the inspector's verbal responses are recorded in the inspection form». Включается галочкой Form settings → Enable voice inspection; в мобильном приложении инспектор жмёт иконку микрофона.
- Историческая ветка: «Maximo 7.6.1 Inspections — Voice Guided Inspections using IBM Watson» (IBM Support, https://www.ibm.com/support/pages/maximo-761-inspections-voice-guided-inspections-using-ibm-watson) — IBM интегрировала Watson conversational services для hands-free исполнения осмотров.
- Отдельно есть приложение **IBM Maximo Inspector** (Google Play) со сканированием ШК и распознаванием речи.
- Офлайн-режим голосовой части — **не подтверждён** (страница IBM отдаёт 403 на автоматический запрос). Maximo Mobile в целом заявляет офлайн-работу, но именно про голос — допущение, требует проверки у IBM.

**SAP / Infor / Hexagon / Bentley / ABB** — по этим вендорам отдельной проверки ещё не сделано (см. раздел «Незакрытые вопросы»).

---

## 6. Сертифицированное железо — ЕСТЬ ГОТОВОЕ, делать своё НЕ НАДО

Ключевая находка: **ecom instruments (Pepperl+Fuchs) Smart-Ex® 03 DZ1M Mining** —
https://www.ecom-ex.com/products/communication/cell-phones/smart-ex-03-dz1m/

Это искробезопасный 5G-смартфон, **специально сертифицированный для подземной добычи**:
- ATEX: **I M1 Ex ia I Ma** (Group I, категория M1 — высшая для шахт: можно не выключать при появлении метана)
- IECEx: Ex ia I Ma; UKCA Ex: I M1 Ex ia I Ma; **ANZEx** (Австралия): Ex ia I Ma; **IA/MASC** (ЮАР): Ex ia I Ma
- Одобрен для «Zone 1/21 & DIV 1, Zone 2/22 & DIV 2 and mining»
- Процессор: **Qualcomm Dragonwing™ QCM6490** + SDR753, **8 GB RAM**, 128 GB
- **Android 15**, патчи безопасности до Q4 2032
- Экран 6", 1080×2160; батарея 4400 мАч Li-Ion; **IP68** (EN/IEC 60529), MIL-STD-810H
- Wi-Fi 6, 5G/4G/3G/2G (в т.ч. частные сети)

Значение: QCM6490 — SoC с Hexagon NPU, на нём **штатно крутятся on-device ASR и малые LLM**. То есть весь целевой стек (офлайн-распознавание + локальная модель + структурированный отчёт) укладывается в **серийное сертифицированное устройство**, которое уже прошло ATEX/IECEx/ANZEx/MASC. Разрабатывать и сертифицировать своё железо не нужно — и почти наверняка экономически бессмысленно (цикл сертификации ATEX Group I M1 — годы).

Рядом на рынке (тот же класс, для полноты):
- **ecom Smart-Ex 03 DZ1** — тот же аппарат для Zone 1/21 & Div 1 (нефтегаз/химия), Snapdragon QCM6490, 8 ГБ RAM, Android
- **ecom / Sensear / Cobic-Ex ATEX-гарнитуры**: Sensear **SM1P-Ex** (ATEX+IECEx, Bluetooth, шумозащита, headset-to-headset); ecom **HS-Ex 01 J** для Zone 1/21 со встроенным микрофоном — https://www.ecom-ex.com/products/communication/headsets/
- Пепперл+Фукс продаёт искробезопасные мобильные устройства «for Zone 1/21 and Division 1» под брендом Honeywell Process Solutions — https://honeywell.pepperl-fuchs.com/honeywell/en/808.htm

**Важный контраст:** носимый голосовой терминал самой Honeywell (Talkman A700x) **НЕ имеет ATEX/IECEx** — только IP67 и MIL-STD-810F. То есть флагманский голосовой продукт Honeywell для осмотров **физически нельзя занести в шахту Group I или в Zone 1**. Это единственная реальная щель в его покрытии.

---

## 3b. Salesforce Field Service — голос-в-форму уже в проде у сотен тысяч техников

Первоисточник — инженерный блог Salesforce, «Delivering Accurate, Low-Latency Voice-to-Form AI in Real-World Field Conditions» (≈март 2026):
https://engineering.salesforce.com/delivering-accurate-low-latency-voice-to-form-ai-in-real-world-field-conditions/

- Это **продакшн-фича Salesforce Field Service Mobile**, а не пилот: «delivering AI-powered mobile experiences to a field workforce supporting hundreds of thousands of active technicians each month».
- Заявленные метрики: **85% field-level accuracy**, сквозное заполнение формы **менее 15 секунд**.
- Архитектура — **гибрид**: STT выполняется **локально на устройстве** нативными фреймворками iOS/Android (аудио не покидает устройство), а маппинг текста в поля формы делает **облачная LLM**.
- Явно перечислены те же боли, что в гипотезе: акценты, фоновый шум от техники и трафика, перчатки, опасные локации, нестабильная сеть.

**Что это значит:** идея «сказал — получилась структурированная запись осмотра» уже реализована крупнейшим вендором полевого сервиса. Но: маппинг у них **в облаке**, т.е. на замкнутый контур без интернета их решение не ложится. И **85% точности по полям — это не compliance-grade**; для регламентного осмотра в шахте/машотделении такой уровень не проходит без ручной вычитки (у них ровно она и стоит: «technicians can review and edit transcriptions before submission»).

---

## 5. Стартапы — сегмент активно заселяется прямо сейчас

- **GIDR.ai** — agentic AI voice для смарт-очков: пошаговые инструкции, распознавание деталей, визуальные комплаенс-проверки для field/frontline. Источник: Field Technologies Online, https://www.fieldtechnologiesonline.com/doc/gidr-ai-powers-ai-glasses-with-hands-free-ai-voice-guidance-for-field-services-0001
- **Proekspert** — «voice-enabled AI agents for industrial field service»: hands-free voice-guided workflows и **захват структурированных комплаенс-данных прямо в ходе работы**. Это формулировка один-в-один с проверяемой гипотезой. https://proekspert.com/solutions/ai-for-field-service-teams/
- **AssemblyAI** — готовое решение «Voice Agents for Field Service Operations» (HVAC + FSM), live-транскрипция, точность по номерам деталей, интеграция с FSM. https://www.assemblyai.com/solutions/voice-agents-field-service
- **MyFieldAgent (KAISPE)** — hands-free AI-ассистент для фронтлайн-команд в Microsoft Marketplace для Dynamics 365. https://marketplace.microsoft.com/en-us/product/dynamics-365/kaispellc.kspfiapp

Контекст рынка: голосовой AI в 2025 г. привлёк **$2.1 млрд** венчурных денег; с июня 2025 по май 2026 — **36 раскрытых сделок на $2.58 млрд** в conversational AI (AssemblyAI, «Voice AI in 2026», https://www.assemblyai.com/blog/voice-ai-in-2026-series-1 — вторичный источник, число вендорское).

**Ни один из найденных стартапов не заявляет офлайн-работу в сертифицированном контуре подземки или судна.** Все — облачные, для «обычного» полевого сервиса.

---

## Свидетельства о трудностях внедрения (важнее списка вендоров)

Прямых кейсов «отрасль попробовала и отвергла» в открытых источниках **не найдено** — наоборот, продукт Honeywell живёт с релизами до 2023 г., а Salesforce выкатил голос в 2026 г. Но найдены системные ограничения, которые объясняют, почему проникновение остаётся низким:

1. **Шум — главный физический барьер.** «ASR systems are not accurately processing and understanding human speech due to background noise, multiple people talking, signal disruption, and distance» (Kardome, https://www.kardome.com/blog-posts/problem-speech-recognition-technology). Машинное отделение судна — 95–105 дБ; забой — ударный шум. Это ровно та зона, где потребительские ASR ломаются.
2. **Точность как барьер принятия:** «In a 2020 worldwide survey, 73 percent of users say accuracy was the number one factor inhibiting voice tech adoption» (вторичный источник, цитируется без первичной ссылки — **проверить перед использованием в деке**).
3. **Провалы мобильных внедрений в поле — не про железо, а про UX:** «Field techs rarely used their mobile devices, and it wasn't the hardware that was the problem; the mobile apps were the failure point… They slowed work down» (Field Technologies Online, https://www.fieldtechnologiesonline.com/doc/how-to-ensure-technology-adoption-among-field-technicians-0001). Это главный риск и для голосового агента.
4. **Косвенное свидетельство сложности:** Honeywell/Vocollect за ~45 лет работы в промышленном голосе так и **не сделала взрывозащищённый носимый терминал** — при том что железо у неё своё. Это либо признак, что рынок подземки/Zone 1 для голоса слишком мал, либо незанятая ниша. **Обе трактовки допустимы; это допущение, а не факт.**

---

## 3c. AccuSpeechMobile — ПРЯМОЙ АНАЛОГ, полностью офлайн, уже продаётся

Это самая близкая находка ко всей конструкции гипотезы.

Первоисточники:
- https://www.accuspeechmobile.com/field-services-eam/
- https://www.accuspeechmobile.com/sap-workflows/
- https://www.accuspeechmobile.com/solution/

Дословные заявления вендора:
- «AccuSpeechMobile is a **100% device-based solution. No voice server or middleware is required** and no changes are needed to the backend system (WMS, ERP, EAM, CMMS).»
- «**cloud or network connection is not required** to use the full functionality of device-based data collection.»
- «Adding a voice interface for **mobile inspection, maintenance and repair workflows**, frees hands and eyes for other tasks, improving safety and efficiency for the mobile workforce.»
- Для SAP: «for customers using SAP CAMS Accelerator, SAP Work Manager or SAP PEO, voice commands and responses can be deployed entirely on the mobile device — no changes needed to the SAP application».

**Это ровно «офлайн-голосовой ввод осмотров в замкнутом контуре», продаваемый как продукт.** Единственное, чего у него нет по описанию — LLM-диалога и памяти об объекте между визитами.

## 3d. SAP Service and Asset Manager — голос в структурированные поля

- SAP SSAM: техник надиктовывает детали работы, приложение **транскрибирует речь в структурированные данные и само заполняет поля** (часы, расходы, пробег). Источник: Emixa, «What's New in SAP EAM: Exploring the Latest AI-Driven Features», https://emixa.com/blog/whats-new-in-sap-eam-exploring-the-latest-ai-driven-features (партнёрский обзор); обсуждение в SAP Community: https://community.sap.com/t5/technology-q-a/voice-commands-in-sap-asset-manager/qaq-p/14009001
- Hexagon EAM / Infor EAM — собственного голосового модуля в первичке не найдено; их голосовой слой закрывается сторонними (AccuSpeechMobile, Ivanti). **Допущение**, требует прямой проверки у вендоров.

---

## 4. Шахтные и морские вендоры — здесь голоса действительно НЕТ

**Подземка (Sandvik, Epiroc, Komatsu, Caterpillar):**
- Проверка не нашла ни одного голосового интерфейса или голосового ассистента в их продуктовых линейках. Их цифровая повестка — **телеуправление и автономность техники** (Sandvik AutoMine/iSure, Epiroc SmartROC, Cat MineStar), а не интерфейс человека-осмотрщика.
- Это **пустое место, подтверждённое отсутствием**: OEM-и подземной техники голосом не занимаются.

**Флот (Kongsberg, Wärtsilä, ABB Marine, DNV):**
- У Kongsberg — системы автоматизации машотделения K-Chief 600/700, мониторинг двигателя, Vessel Insight, Remote Services. **Голосового интерфейса в этих продуктах не заявлено.**
- Голосовые заметки для инспекций судов встречаются у мелких приложений (напр. «Marine Inspection AI» в Google Play — voice notes для hands-free-отчётности), но это диктофонная заметка, а не структурированный отчёт.
- **Вывод: у крупных морских вендоров голосового ввода осмотров нет.**

**Инспекционный софт для добычи с голосом уже есть у нишевых игроков:**
- **Pervidi** — «Mining Inspection Software | Offline-First Field App», https://www.pervidi.com.au/industries/mining/ — офлайн-первое полевое приложение с захватом фото/видео/**голосовых заметок**. Опять же: голосовая заметка, не структурированный диалог.

---

## КРИТИЧЕСКОЕ: реальный подземный эксперимент с ASR — цифры точности

Это самый ценный источник по вопросу «работает ли это вообще под землёй».

**Stefaniak, Stachowiak, Koperska, Skoczylas, Śliwiński. «Application of Wearable Computer and ASR Technology in an Underground Mine to Support Mine Supervision of the Heavy Machinery Chamber». Sensors (Basel), октябрь 2022.**
https://pmc.ncbi.nlm.nih.gov/articles/PMC9573029
Место: рудник **KGHM Polska Miedź S.A., Лубин, Польша** (подземная добыча меди).

Результаты полевых испытаний:
- **Общая корректность заполнения формы: 70–80%**
- По типам данных: названия машин — **86,33%**; имена операторов — **92,58%**; **подразделения — 60,16%**
- Лабораторно на спец-лексике: 81–100% word accuracy в зависимости от шума
- Архитектура: Android-приложение (3 МБ) + **сервер на Python по беспроводной связи**, движок — **Google Speech Recognition** (то есть НЕ офлайн)
- Проблемы: **внезапный громкий шум техники резко ухудшает распознавание**; постоянный шум вентиляции — почти не мешает; специализированная горная лексика потребовала собственного словаря и алгоритма нечёткого сопоставления (longest common subsequence); нужна короткая тренировка пользователей
- Вывод авторов: применение ASR для ведения записей бригадиром **«is possible»** — при неидеальной точности

**Что из этого следует для гипотезы:**
- Подземка как среда для голоса **изучалась и признана в принципе рабочей** — но на 2022 г. только через облачный движок Google и с точностью 70–80%, что для регламентного осмотра недостаточно.
- Именно эти два ограничения (облако + точность) **сняты современным стеком**: on-device ASR (Whisper-класса) на NPU + LLM-постобработка с доменным словарём. Это и есть содержательное окно возможности, а не «незанятая ниша».
---

## 3e. Категория «Connected Worker» / «Digital Operator Rounds» — голос уже фича, а не продукт

**Innovapptive** — https://www.innovapptive.com/product/operations-suite/operator-rounds
- Продукт mRounds: цифровые обходы оператора для нефтегаза/процессной промышленности.
- **Офлайн-режим штатный:** «RapidSync™ Offline Mode» — заявлен как core capability.
- Интеграции: «Prebuilt SAP, Maximo, Oracle integrations», двусторонняя синхронизация с историянами OSI PI, IP21.
- Заявленные результаты (числа вендора, независимо не подтверждены): **−21% простоев, $2.9 млн экономии на объект, 10 500+ операторов смен**.
- **Голос есть:** Innovapptive заявляет hands-free voice-to-text в мобильном обслуживании; их AI-слой WorkSmartAI «authors rounds, detects issues, provides instant troubleshooting and delivers step-by-step instructions».
- Frost & Sullivan назвал Innovapptive «2026 Company of the Year» и лидером Frost Radar™ по Augmented Connected Worker (вторичный источник).
- ATEX-устройства на странице не упомянуты.

Соседи по категории: **GE Vernova** (operator rounds software), **Prometheus Group**, **AssetSense**, **iFactory**, **Pervidi**.

---

## Цены (что удалось установить)

| Позиция | Цена | Источник |
|---|---|---|
| Honeywell Vocollect (софт + Talkman) | **Публичного прайса нет, только quote через Honeywell/реселлеров** | Third Fin, обзор Vocollect, https://thirdfin.io/voice-picking/honeywell-vocollect/ (вторичный) |
| Масштаб установленной базы Vocollect | «used daily by **nearly one million workers in 60 countries**» | там же (вторичный, число вендорское — **проверить перед деком**) |
| ATEX/IECEx планшет Zone 1, 8" Android | **~€2 400** | explosionprooftablets.com, обзор 2026 (агрегатор — **вторичный, требует сверки по вендору**) |
| ATEX/IECEx планшет Zone 1, Windows-рабочая станция | **~€4 500** | там же |
| Ivanti Speakeasy, Zebra Voice Client, AccuSpeechMobile | Публичного прайса нет | сайты вендоров |

Вывод по ценам: **весь сегмент — enterprise-продажа по запросу**, публичных цен нет ни у кого. Для финмодели придётся строить на аналогах, а не на прайсах. Это **допущение** и явный пробел данных.

---

# ВЕРДИКТ

## «Незанятая ниша» — ОПРОВЕРГНУТО. Порог, заданный заказчиком, перейдён с запасом.

Голосовой ввод осмотров в промышленных средах **продаётся минимум с 2010-х**, у него есть:
- собственный продукт у Honeywell (**Voice M&I / VoiceCheck**, гайд 1.10 от 2023) с носимым терминалом, on-prem-хостингом, on-device распознаванием и офлайн-работой;
- штатная функция в **IBM Maximo** («Enabling voice-guided inspections», официальная документация);
- прод-фича у **Salesforce Field Service** на «hundreds of thousands of active technicians» (2026);
- голос в **SAP Service and Asset Manager**;
- полностью офлайновый, device-only продукт **AccuSpeechMobile** для EAM/CMMS-осмотров;
- голосовой слой-коммодити **Ivanti Speakeasy** (с 2016) и **Zebra Voice Client**;
- голос как фича у **Innovapptive** и всей категории Connected Worker / Digital Operator Rounds.

Формулировка «незанятая ниша» в текущем виде **не выдерживает проверки и не должна попадать ни в деку, ни в разговор с инвестором** — она проверяется одним поиском и подрывает доверие ко всему остальному.

## Что при этом реально свободно (сегмент X)

Свободен не «голос для полевых работ», а узкое пересечение **четырёх** условий, ни одно из которых по отдельности не свободно:

**Сегмент X = голосовой агент на LLM, полностью офлайн, на серийном железе Group I M1 / Zone 1, для регламентных осмотров в подземке и машотделениях, с памятью об объекте между визитами.**

Чем он отличается от каждого из найденных игроков:

| Условие | Кто уже закрывает | Кто НЕ закрывает |
|---|---|---|
| Голос → структурированный отчёт осмотра | Honeywell, Maximo, SAP, Salesforce, AccuSpeech, Innovapptive | — |
| Полностью офлайн, без облака | Honeywell (жёсткая грамматика), AccuSpeechMobile, Ivanti | Salesforce (маппинг в облаке), Innovapptive-AI, все найденные стартапы |
| Свободная речь + LLM-диалог, а не фиксированная грамматика | Salesforce, стартапы (GIDR, Proekspert, AssemblyAI) — но все облачные | Honeywell, AccuSpeech, Ivanti — у них жёсткая ограниченная грамматика |
| Сертифицированное железо Group I M1 / Zone 1 (шахта, метан) | **Никто из голосовых вендоров.** Есть только само железо (ecom Smart-Ex 03 DZ1M) | Honeywell Talkman — только IP67, ATEX нет |
| Память об объекте между визитами (агентская, а не запись в БД хоста) | **Никто из найденных** | все |

**Ключевой факт, на котором держится вся позиция:** флагманский голосовой терминал Honeywell (Talkman A700x) **не имеет ATEX/IECEx** — проверено grep по полному тексту официального 132-страничного product guide. То есть лидер рынка голосовых осмотров физически не может зайти в шахту Group I и в Zone 1. Это единственная документально подтверждённая дыра в покрытии.

**Но её надо честно взвесить:** Vocollect работает в промышленном голосе ~45 лет, у неё своё железо и свои сертификационные ресурсы — и она эту дыру не закрыла. Две трактовки: (а) рынок подземки/Zone 1 слишком мал, чтобы окупить ATEX-сертификацию носимого терминала; (б) ниша просто ждала своего момента. **Это допущение — и оно ровно то, что нужно проверить следующим шагом, до любых вложений в разработку.**

## Опасное для гипотезы

1. **Точность.** Единственное измеренное подземное внедрение (KGHM Лубин, Sensors 2022) дало **70–80%** корректности заполнения формы, а по одному полю — **60,16%**. Salesforce в 2026 г. на обычном поле имеет **85% field-level accuracy** и оставляет ручную вычитку. Для регламентного осмотра, который потом идёт в надзор, ни одна из этих цифр не проходит. **Порог приемлемой точности для комплаенс-отчёта надо определить с клиентом до разработки** — это может убить идею быстрее, чем конкуренты.
2. **Внезапный шум техники** резко ломает распознавание (KGHM), тогда как постоянный шум вентиляции — почти нет. Забой и машотделение — это как раз ударный шум.
3. **Провал полевых мобильных внедрений — обычно в UX, а не в технологии:** «it wasn't the hardware that was the problem; the mobile apps were the failure point… They slowed work down» (Field Technologies Online).
4. **Свидетельств, что отрасль попробовала голос и отвергла, не найдено.** Наоборот: Honeywell поддерживает продукт до 2023 г., Salesforce вывел голос в 2026 г. Это значит, что «пройденный этап» — не риск; риск в другом: **сегмент занимается прямо сейчас, конкуренты входят в 2025–2026 гг.**

# ОТВЕТ ПО ПУНКТУ 6 (сертифицированное железо) — своё делать НЕ НАДО

**Да, готовые сертифицированные носимые устройства с микрофоном и вычислителем существуют, включая специально одобренные для подземной добычи.**

Эталон — **ecom instruments (Pepperl+Fuchs) Smart-Ex® 03 DZ1M Mining**:
https://www.ecom-ex.com/products/communication/cell-phones/smart-ex-03-dz1m/
- Сертификаты: ATEX **I M1 Ex ia I Ma**, IECEx Ex ia I Ma, UKCA Ex, ANZEx (Австралия), IA/MASC (ЮАР). Категория **M1** — высшая для шахт: устройство остаётся безопасным при появлении метана и его не нужно выключать.
- Вычислитель: **Qualcomm Dragonwing QCM6490**, **8 ГБ RAM**, 128 ГБ, **Android 15** с патчами до Q4 2032.
- IP68, MIL-STD-810H, 4400 мАч, 5G/Wi-Fi 6 (в т.ч. частные сети), микрофон и камера штатно.

Того же класса: **ecom Smart-Ex 03 DZ1** (Zone 1/21 & Div 1 — нефтегаз, химия, машотделения), **ecom Tab-Ex 05 DZ1** (планшет Zone 1), **Aegex 100M / Aegex10** (единственный Zone 1 планшет на Windows 11), **Getac** ATEX-планшеты, **Bartec Agile S NI** (Zone 2/22).
ATEX-гарнитуры с микрофоном: **Sensear SM1P-Ex** (ATEX+IECEx, Bluetooth, шумоподавление), **ecom HS-Ex 01 J** (Zone 1/21).

**Практический вывод:**
- Разрабатывать и сертифицировать своё железо — **не нужно и почти наверняка вредно**: цикл ATEX Group I M1 занимает годы и стоит как отдельный бизнес.
- QCM6490 несёт Hexagon NPU — этого достаточно для on-device ASR (Whisper-класса) и малой LLM. Весь целевой офлайн-стек ложится на серийное устройство.
- **Ограничение, о котором надо помнить:** доступная RAM на мобильных устройствах даже топового уровня обычно <4 ГБ под приложение, что ограничивает размер модели (обзор «On-Device LLMs: State of the Union, 2026», https://v-chandra.github.io/on-device-llms/). 8 ГБ Smart-Ex — это весь объём устройства, не бюджет модели.
- Реальная работа студии — **не железо, а софт + доменные словари + офлайн-пайплайн + сертификация приложения под процедуры заказчика.**

# ТАБЛИЦА ИГРОКОВ

| Игрок | Что продаёт | Осмотры? | Офлайн? | LLM/свободная речь? | ATEX/шахта? | Источник |
|---|---|---|---|---|---|---|
| **Honeywell Vocollect** (Voice M&I / VoiceCheck) | Голосовой чек-лист осмотра + носимый Talkman A700x | **Да, профильно** | **Да** (on-device templates, работа вне Wi-Fi) | Нет — жёсткая грамматика | **Нет** (IP67, MIL-STD-810F) | Implementation Guide 1.10, 2023; A700x Product Guide |
| **AccuSpeechMobile** | Голосовой слой для EAM/CMMS/SAP, 100% на устройстве | **Да** (inspection, maintenance, repair) | **Да, полностью** («cloud or network connection is not required») | Нет | Не заявлено | accuspeechmobile.com/field-services-eam |
| **IBM Maximo** | Voice-guided inspections как штатная фича | **Да** | Не подтверждено | Watson conversational (истор.) | Нет | IBM Docs «Enabling voice-guided inspections» |
| **Salesforce Field Service** | Voice-to-form, прод, сотни тысяч техников | Да (work data) | **Частично**: STT локально, маппинг в облаке | **Да, LLM** | Нет | engineering.salesforce.com, ~03.2026 |
| **SAP SSAM** | Речь → структурированные поля | Да | Не подтверждено | AI-транскрипция | Нет | SAP Community / Emixa |
| **Ivanti Wavelink Speakeasy** | Голос поверх любого telnet/web-приложения | Косвенно | **Да** («all voice processing within the mobile device») | Нет | Нет | ivanti.com/products/speakeasy, с 2016 |
| **Zebra** | Voice Client, Workcloud; партнёр EPG LYDIA | Нет (склад/picking) | Да | LYDIA — «AI-driven» | Нет | zebra.com |
| **Innovapptive** | Digital Operator Rounds + WorkSmartAI, voice-to-text | **Да** | **Да** (RapidSync Offline) | AI-агенты | Не заявлено | innovapptive.com |
| **Pervidi** | Mining Inspection, offline-first, голосовые заметки | Да | Да | Нет (диктофон) | Не заявлено | pervidi.com.au/industries/mining |
| **GIDR.ai** | Agentic voice для смарт-очков, field | Да | Нет (облако) | **Да** | Нет | Field Technologies Online |
| **Proekspert** | Voice-enabled AI agents для field service, структурированный комплаенс-захват | **Да** | Нет | **Да** | Нет | proekspert.com |
| **AssemblyAI** | Voice agents for field service (HVAC/FSM) | Да | Нет | **Да** | Нет | assemblyai.com |
| **Sandvik / Epiroc / Komatsu / Caterpillar** | Телеуправление и автономность техники | **Нет** | — | **Нет** | — | проверено, голоса нет |
| **Kongsberg / Wärtsilä / ABB Marine / DNV** | Автоматизация машотделения (K-Chief 600/700), мониторинг | **Нет** | — | **Нет** | — | kongsberg.com |
| **ecom / Aegex / Getac / Bartec / Sensear** | **Железо** ATEX/IECEx (в т.ч. Group I M1) | — | — | — | **Да** | вендорские страницы |

# ЧТО ПРОВЕРИТЬ СЛЕДУЮЩИМ ШАГОМ (пробелы этой проверки)

1. **Цены Honeywell Voice M&I и AccuSpeechMobile** — только через запрос котировки у реселлера. Без этого нет якоря для финмодели.
2. **Офлайн-режим голоса в IBM Maximo** — страница IBM отдаёт 403 автоматике, нужен ручной просмотр или запрос в IBM.
3. **Hexagon EAM и Infor EAM** — собственный голосовой модуль не найден, но и отсутствие не доказано. Прямой запрос вендорам.
4. **Datalogic** — голосового продукта не найдено, проверку считать неполной.
5. **Главное:** спросить 3–5 реальных заказчиков (шахта, судовладелец), **какой порог точности** делает голосовой отчёт приемлемым для надзора. Цифры 70–85% из существующих внедрений говорят, что это и есть настоящий барьер — важнее конкурентов.
6. Проверить, **пробовала ли Honeywell/Vocollect делать ATEX-терминал и почему отказалась** — это прямо отвечает, ниша это или тупик.
