# Проверка 06 — Позиция «операционная платформа персонажа для правообладателя»

**Дата проверки:** 1 сентября 2026. **Статус:** в работе (черновик обновляется по ходу).

**Проверяемое утверждение:** «Позиция „операционная платформа персонажа для правообладателя" — удержание канона + судья безопасности + механика лицензирования — никем не занята и не закрывается в ближайший год».

**Главный адверсарный тезис для проверки:** слой контроля уже строится кем-то с дистрибуцией.

---

## ПРЕДВАРИТЕЛЬНЫЙ ВЕРДИКТ (обновляется): ОПРОВЕРГНУТО в сильной форме

Найден прямой контрпример: **Hasbro Sixth Wall + ElevenLabs (запуск 3 июня 2026)** — «Behavioral Licensing» на базе «CharacterOS» — это дословно описанная позиция: канон + guardrails + лицензионный контур, и пресс-релиз адресует её «creators, rights holders, and partners», т.е. не только IP Hasbro. Детали и ограничения — ниже.

---

## 1. Hasbro Sixth Wall — прямое попадание в позицию

**Факты (вендорские заявления, пресс-релиз Businesswire, 3 июня 2026,
https://www.businesswire.com/news/home/20260603297922/en/):**

- Hasbro запустила AI-студию **Sixth Wall** (CEO — Roberta Thomson; Chris Cocks — CEO Hasbro) в стратегическом партнёрстве с **ElevenLabs**.
- Вводит категорию **«Behavioral Licensing»** — «новая категория лицензирования персонажей для динамических взаимодействий»: «how characters think, speak, and interact in dynamic experiences».
- Технология — **CharacterOS**, «proprietary system for preserving a character's personality, canon, voice, and safety guardrails across interactive experiences». Т.е. в одном продукте заявлены: удержание канона + safety guardrails + голос + коммерческие условия.
- **Talent participation model** — компенсация актёрам, только авторизованные записи. Это закрывает и «долю правообладателя/таланта».
- 12 персонажей Hasbro на старте (Optimus Prime, Megatron, Cobra Commander, Mr. Potato Head, состав Clue) через **ElevenLabs Iconic Marketplace** и sixthwallstudio.com.
- Ключевая формулировка: студия «created to give **creators, rights holders, and partners** a trusted framework for bringing characters into these new experiences while preserving authenticity, safety, and commercial rights» + приём заявок на «time-bound Behavioral Licensing pilots». То есть позиционирование — **инфраструктура для правообладателей вообще**, а не только внутренний инструмент Hasbro.
- Мотивация в PR: «millions of consumers are already encountering unauthorized versions of popular characters» — та же боль, на которой стоит проверяемая идея.

**Что НЕ подтверждено независимо (ограничения):**
- Нет независимых данных, что CharacterOS реально содержит работающего «судью» (runtime-оценщика реплик), а не набор промптов+фильтров. «Preserving canon and safety guardrails» — вендорская формулировка.
- Нет подтверждения, что хоть один сторонний правообладатель (не-Hasbro) уже onboarded. Заявлен приём заявок на пилоты.
- Структура (100% дочка Hasbro или JV с ElevenLabs) в PR не раскрыта.
- Sixth Wall — про чат/голос/игры/контент-платформы; про **физические устройства/игрушки** заявлено как «connected physical products» в списке потенциальных применений (Forbes, 03.06.2026) — не как готовый продукт.

**Интерпретация:** связка «дистрибуция ElevenLabs (Iconic Marketplace) + бренд-доверие Hasbro + CharacterOS» — это ровно сценарий «слой контроля строится кем-то с дистрибуцией». Стадия — запуск/пилоты (≈3 месяца на рынке к сент. 2026).

---

## 2. Китайская связка (движение вверх по стеку)

### Tuya
- На Spielwarenmesse 2026 (Нюрнберг, 27–31 янв. 2026) Tuya показала полный AI-toy-стек: «AI Agent Development Platform» — заказчик задаёт «personality, memory logic, and behavioral patterns» персонажа без обучения моделей; «deep customization to craft unique AI toys based on brand IP and cultural stories» (пресс-релиз Tuya, янв.–февр. 2026, https://www.tuya.com/news-details/tuya-smart-powers-the-next-wave-of-ai-toys-at-spielwarenmesse-2026-Kfbm3ygwbpeen; PureAI, февр. 2026).
- Это конструктор персоны (движение к «удержанию канона» на уровне конфигурации), но: **нет заявленного судьи безопасности как продукта, нет лицензионного контура** (контроль прав, аппрув сценариев, доля правообладателя). Tuya продаёт производителю, а не правообладателю.
- Вакансии Tuya на canon/safety-роли: не проверено напрямую (ограничение — нет доступа к китайским job-порталам из этой сессии). Допущение: при их скорости (15 дней до массового производства — из предыдущего скрининга) достроить конфигуратор до «контура правообладателя» — вопрос приоритета, а не технологии.

### FoloToy (после скандала Kumma, ноябрь 2025)
- Хронология: PIRG Education Fund выявил опасные ответы (ножи, спички, сексуальный контент; модель Mistral) → FoloToy сняла Kumma с продажи → через ~неделю вернула, заявив «reinforced safety modules and upgraded content filters» (Fox News; Gizmodo, нояб.–дек. 2025).
- Декабрьский фоллоу-ап PIRG: игрушка «better behaved» — но без независимой сертификации (PIRG, дек. 2025).
- **Вывод:** «исправления» FoloToy — внутренние фильтры, не продукт-судья и не платформа для правообладателей. Зачатком судьи не являются.

### Haivivi
- IP-стратегия подтверждена и растёт: партнёрство с IP Shanghai Film Group (нояб. 2024), HeartBear (апр. 2025), **первая в мире Ultraman AI-игрушка** (авг. 2025); BubblePal «replicates dozens of classic IP characters» с «voice and personality restoration of top licensed IPs»; глобальный запуск линейки в США 23 апреля 2026 (PR Newswire, 23.04.2026, https://www.prnewswire.com/news-releases/haivivi-debuts-new-ai-companion-toys-in-the-us-breathing-life-into-dolls-through-technology-302751879.html).
- Haivivi — **лицензиат, делающий персонажей in-house**, а не платформа, которую правообладатель контролирует. «Personality restoration» — вендорское заявление, механика аппрува/канон-контроля для IP-партнёра публично не описана. Но по числу живых IP-сделок в устройствах — ближайший практик в Китае.

### ByteDance/Doubao, iFlytek, MiniMax
- ByteDance: Doubao подключён к игрушкам партнёров (в т.ч. FoloToy); выбраны эксклюзивные производители-партнёры (Runxin, Quectel, Espressif) (36kr, 2025–2026). Это модельный слой + hardware-экосистема, лицензионного контура для правообладателей нет.
- MiniMax/Talkie: IPO на HKEX 9 янв. 2026 (~$618M, оценка ~$6.5B при листинге — Wikipedia/Sacra, 2026); Talkie >300M пользователей (июнь 2026, Sacra). Стратегия — consumer-развлечения и AI-native контент; Sacra прямо: «MiniMax doesn't sell AI to enterprises; it sells entertainment to consumers». Talkie исторически строился на НЕавторизованных персонах (Trump, Swift и др.) — это антипод позиции, не конкурент в ней.
- iFlytek: сильны в речи/образовании; отдельного «IP-персонажного» B2B-продукта в выдаче не найдено (ограничение: поиск только по англоязычным источникам).

**Итог по блоку 1:** китайская связка коммодитизирует производство и конфигурацию персоны, но лицензионный контур + судья как продукт для правообладателя — не найдены ни у кого. Скрининговая оценка Tuya подтверждается.

---

## 3. Западный стек

### ElevenLabs (+ Sixth Wall) — занял не только голос
- **Iconic Marketplace** — двусторонняя площадка: компания запрашивает доступ к «iconic talent», **каждый запрос ревьюит и аппрувит правообладатель/талант** (elevenlabs.io/iconic-marketplace, вендорское описание, 2026). Это уже лицензионный контур с аппрувом — пока на уровне голоса/таланта.
- С Sixth Wall (июнь 2026) контур расширен с голоса на **поведение персонажа** (Behavioral Licensing). Т.е. ElevenLabs — дистрибуция, Sixth Wall/CharacterOS — контроль. Предпосылка скрининга «ElevenLabs = только голосовой слой» **устарела на ~3 месяца**.

### Inworld AI — ушёл в инфраструктуру, не в контроль
- Пивот в realtime voice-модели: релиз модели «слышит тон/настроение» (Business Insider, май 2026), **снижение цен >50% в июне 2026** «чтобы consumer-стартапы выжили» (Business Insider, июнь 2026). 87 сотрудников на 30.06.2026 (Tracxn). Исторически $117–130M, оценка >$500M (Businesswire, авг. 2023).
- Через Dentsu Ventures — brand ambassadors/virtual sales для брендов (dentsu.com, дата инвестиции не уточнена). Канон-контроль/лицензионный контур для развлекательных IP — не продукт Inworld. **Позицию не занимает.**

### Convai — без изменений
- Движок 3D-персонажей для разработчиков (Unreal/Unity, no-code), seed ~$5M (Crunchbase, 2026). Сделок с правообладателями и контрольного слоя не найдено.

### Character.AI — вычищен, но без лицензионной платформы
- После C&D от Disney (сент. 2025, Deadline) удалил персонажей Disney; «we respond swiftly to requests to remove content» (Deadline, сент. 2025). Публичных лицензионных сделок с IP-холдерами к сент. 2026 не найдено. В «легальную платформу персонажей» не превратился (по открытым источникам).

### Meta AI Studio — свернули направление знаменитостей
- Celebrity-чатботы (Snoop Dogg и др.) закрыты ещё в июле 2024 из-за низкого интереса (NBC News, 2024–2025; aibase). AI Studio — self-serve для криэйторов, не контур для правообладателей. **Не конкурент в позиции.**

### Genies — второй прямой кандидат на позицию
- **4 сделки с правообладателями за Q1 2026** (blog.genies.com): MLB Players Inc. (05.02.2026), King Records / Hypnosis Mic (24.02.2026), NBPA (05.03.2026), **Sanrio (20.03.2026)**; плюс WEBTOON — character chat в приложении WEBTOON (Variety, 2026).
- Sanrio-сделка (PR Newswire, 20.03.2026): AI-опыт с gudetama, затем Hello Kitty и др.; заявлено: «all character models and expressions will be individually created and **supervised by human creators** to preserve each character's personality, visual identity, and the integrity of the original world and story». Это канон-контроль **через ручную супервизию**, не через продукт-судью.
- Механика управления, модерация, ревшер — публично **не раскрыты** (проверено по блогу Genies и PR). Genies ~$1B оценка после раунда $150M (2022, Wikipedia — старые данные; свежих раундов не найдено).
- **Интерпретация:** Genies занимает позицию «платформа, где правообладатель запускает персонажа» в цифровых каналах (чат/аватары/SDK), с дистрибуцией через WEBTOON и genies.com. Слабое место относительно проверяемой идеи: нет заявленного runtime-судьи и голосовых/физических устройств; «супервизия людьми» плохо масштабируется.

### Soul Machines / UneeQ / Futureverse
- В выдаче за 2026 нет свидетельств продукта «управляемый лицензированный персонаж для правообладателя» (Soul Machines/UneeQ — корпоративные digital humans; Futureverse — FIFA-гейминг). Ограничение: глубоко не проверялись (бюджет), риск пропуска низкий — их дистрибуция в entertainment-IP мала.

---

## 4. Сами студии

### Disney
- Сделка Disney–OpenAI ($1B, анонс 11.12.2025: Sora генерирует видео с 200+ персонажами Disney/Marvel/Pixar/Star Wars; NPR, 11.12.2025) — **умерла**: OpenAI закрыл Sora 24–25 марта 2026, Disney узнала за <1 часа до анонса (Variety, март 2026; Deadline, март 2026). Sora API отключается 24.09.2026 (Variety).
- После этого публичных анонсов внутренней платформы персонажей Disney не найдено; официальная позиция — «continue to engage with AI platforms… while respecting IP» (Variety, март 2026). **Слот «партнёр Disney по интерактивным персонажам» на сент. 2026 выглядит вакантным** — это скорее аргумент ЗА нишу, чем против.

*(далее — NBCU/Netflix/Sanrio/Bandai, safety-вендоры, патенты, раунды — в работе)*
