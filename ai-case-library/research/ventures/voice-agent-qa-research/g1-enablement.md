# G1 — Enablement бригад на дорогом промышленном оборудовании: занято или свободно

Дата проверки: 2026-09-02. Метод: поиск первичных источников (сайты компаний, пресс-релизы, SEC-филинги, отраслевая пресса).

## Проверяемое утверждение
> «Ввод бригады в строй на дорогом промышленном оборудовании — enablement операторов — никем не продаётся как отдельный продукт, и бюджет на это лежит у производителя оборудования».

Порог опровержения (задан заказчиком): если существуют компании, продающие это как самостоятельную услугу или продукт — критерий опровергнут.

---

## ВЕРДИКТ

**ЗАНЯТО. Утверждение опровергнуто по обеим половинам — и по первой строго, и по второй с оговоркой.**

1. **«Никем не продаётся как отдельный продукт» — ЛОЖНО, опровергнуто прямыми примерами.** Есть компании, у которых это и есть основной бизнес, включая ровно тот сегмент, с которого начался повод (ж/д путевые машины): **Global Rail Academy (ex-PMC Rail International Academy)** — независимая от производителей академия, выросшая из учебного центра Deutsche Plasser, 7 локаций, 25+ курсов, включая 28-дневный «Tamper Operator». В медтехе — **Imaging Diversified** (обучение технологов КТ/МРТ, клиенты прямым текстом: «Hospitals · ISOs · **OEM Partners**», тариф от $500/мес). В ЧПУ — **Gardner CNC Training** (30 лет, независимы от вендоров). В авиации — **CAE** ($4,28 млрд выручки FY2024).

2. **«Бюджет лежит у производителя» — ЧАСТИЧНО ВЕРНО, но это не свободный бюджет.** Производитель действительно платит. Но:
   - В большинстве случаев он платит **самому себе** (внутренняя сервисная/учебная служба) или **своему дилеру** (дилер отбивает обучение маржой на железе).
   - Когда платит третьей стороне — это оформлено не как «фонд enablement», а как **аутсорсинг производства обучения** (training BPO / white-label field service) с многолетним контрактом на десятки-сотни миллионов.
   - Когда обучают **бригаду конечного заказчика** (а не свой канал), деньги почти всегда сидят **строкой в конкретной поставке** — «training days», «training points/credits», «commissioning & startup».

3. **Аналога AWS MAP / Microsoft ECIF в промышленности не найдено.** Нет публичного именованного постоянного фонда производителя оборудования, куда третья сторона может подать заявку на со-финансирование ввода клиента в строй. *(Допущение: это отсутствие доказательств после целенаправленного поиска, а не доказанное отсутствие. Такие фонды могут существовать непублично, в дилерских соглашениях под NDA.)*

**Формулировка вердикта в терминах задачи: «занято сегментом X»**, где X = три уже занятых слоя (внутренняя служба OEM → дилерский канал → независимые академии, оплачиваемые владельцем оборудования) + четвёртый слой (аутсорсеры, оплачиваемые OEM), который занят в автопроме, авиации и медтехе, но **тонок в ж/д-геодезии и на испанском рынке конкретно**.

---

## ПРЯМОЙ ОТВЕТ НА КЛЮЧЕВОЙ ВОПРОС

> **Платит ли производитель оборудования третьей стороне за ввод бригад клиента в строй, и есть ли на это оформленный бюджет?**

**Да, платит — и есть оформленный бюджет, но в двух разных формах, и ни одна из них не похожа на AWS MAP.**

**Форма A — многолетний контракт на аутсорсинг обучения (бюджет = строка операционных расходов производителя).**
Самый чистый и документированный пример: **General Motors ↔ V2X**. GM платит стороннему подрядчику за проектирование, проведение и оценку технического обучения всех своих сервисных техников: контракт «более $100 млн», продлён до 2030 года, охват — почти 4 000 дилерских точек США, более 40 000 техников и учеников в год, включая управление флагманским GM Technical Training Center в Трое, Мичиган. Это не новая история: предшественник — Raytheon Professional Services, работавший с GM с 1999 года; ещё в начале 2000-х RPS взяла управление тренинг-центрами GM по **пятилетнему контракту на $150 млн**, разработала 425+ часов курсов и в 2005 доставила ~1,5 млн часов обучения техникам GM. Контракт затем перешёл Vertex → V2X.
*Оговорка:* обучают канал (дилерских техников), а не бригаду конечного покупателя. Но структурно это ровно тот же паттерн — производитель платит третьей стороне, чтобы у людей на другом конце цепочки заработало.

**Форма B — обязательство в договоре поставки (бюджет = строка в конкретной сделке).**
- **Boeing**: в договорах поставки, поданных в SEC, есть Customer Support Document и Supplemental Exhibit CS1 — «information, training, services and other things furnished by Boeing **in support of introduction of the Aircraft into the customer's fleet**»; покупателю начисляются **training points** пропорционально закупке.
- **Airbus**: «Airbus' commitment to provide training **to support the entry into service of customer aircraft**» — обязательство производителя, а исполнялось оно через кооперацию с независимой CAE (с 2002 года; впоследствии завершена по обоюдному согласию).
- В медвизуализации то же самое проще: «application training days» — стандартная позиция в поставке КТ/МРТ, и на рефёрбишед-рынке applications specialist приезжает учить технологов как часть сделки.

**Форма C (важная поправка к посылке) — платит не производитель и не покупатель, а отраслевой фонд.**
В Великобритании курс Leica Geosystems «Machine Control Training» (7 часов, аккредитация NOCN, одобрен CITB, максимум 8 человек) прямо помечен как «applicable for the **Tier 2 Levy Grant**» — то есть компенсируется из отраслевого сбора CITB. Это третий кошелёк, который в исходной гипотезе не учтён.

**Чего НЕ найдено:** именованной программы вида «OEM Enablement Fund», к которой независимый провайдер мог бы подключиться как партнёр и получать со-финансирование за каждое внедрение. В ИТ это MAP/ECIF; в промышленности эквивалент реализован как **закупка услуги по тендеру**, а не как партнёрская программа с фондом.

---

## ТАБЛИЦА ИГРОКОВ

| Игрок | Что продаёт | Тип | Кто платит | Числа / источник |
|---|---|---|---|---|
| **Global Rail Academy** (ex-PMC Rail International Academy) | Обучение операторов путевых машин, тампинга, сварки, измерений; сервис-техники (гидравлика, ПЛК); курс «Tamper Operator» 28 дней | **Независимая академия**, выросла из учебного центра Deutsche Plasser в Бингене (открыта апрель 2017), позиционирует независимость от производителей | Работодатель бригады (подрядчик / инфраструктурная компания) | 25+ курсов; локации: Вена (HQ), Леверкузен, Гамбург, Добой, Анкара, Торонто, Сент-Питерсберг (FL). Цена «on request». [pmcrail.com](https://www.pmcrail.com/en/europe/media-center/news/thinking-big-pmc-rail-international-academy-enters-the-market/), [global-rail-group.com/rail-academy](https://global-rail-group.com/rail-academy/), [na.global-rail-group.com/.../tamper-operator](https://na.global-rail-group.com/training-programme-na/tamper-operator/) |
| **Plasser & Theurer** (+ Plasser Far East, Plasser American) | Симуляторное обучение операторов (09-3D с 2011, Unimat 3D с 2015, BallastMaster VR), 5 дней, до 6 человек | Внутренняя служба + региональные дочки | Покупатель машины | Сертификаты в Малайзии выдаёт **PMC Rail International Academy** — т.е. внешняя академия уже в цепочке. [plassertheurer.com](https://www.plassertheurer.com/en/fleet/training-and-support/3d-simulation-tools), [plasserfareast.com](https://www.plasserfareast.com/en/fleet/training-and-support/tamping-simulation) |
| **Matisa** | «Certified operator training» + техподдержка как часть Life Cycle Management | Внутренняя служба / нацдочки (Matisa UK, Австралия) | Покупатель машины | [matisa.ch/lcm](http://www.matisa.ch/lcm/), [matisa.ch/en/matisa-uk.php](https://www.matisa.ch/en/matisa-uk.php) |
| **Trimble** (GEDO) | Trimble Learn; обучение через сеть авторизованных представителей (SITECH и др.) с «Trimble certified trainers»; симулятор для обучения операторов GCS900 | OEM + дилерский канал | Покупатель; дилер отбивает маржой | [trimble.com/en/learn](https://www.trimble.com/en/learn), [sitechla.com/training](https://sitechla.com/training/) |
| **Al-Top Topografía (ES)**, **ALLTERRA Iberica (ES)** | Семинары и формация по Trimble GEDO для ж/д, в т.ч. по тележке | Авторизованные дистрибьюторы Trimble в Испании | Покупатель / бесплатно как маркетинг | [al-top.com](https://al-top.com/formacion-trimble-dji-geomaticaencas/), [allterra-iberica.es](https://www.allterra-iberica.es/seminarios/ferrocarriles-trimble-topografia-escaneado/) |
| **Leica Geosystems** | Leica Training School (Шропшир, UK + сеть), Machine Control Training 7 ч, NOCN-аккредитация, CITB-одобрение; Certified Training по IMS; self-led подписка $1 495 для 6+ мест | Внутренняя служба OEM + сертифицированные партнёры | Покупатель, **частично компенсируется CITB Tier 2 Levy Grant** | [leica-geosystems.com/.../nocn-machine-control-training](https://leica-geosystems.com/en-gb/services-and-support/training/leica-training-school/nocn-machine-control-training), [learn.leicaims.com](https://learn.leicaims.com/p/self-led-training-1-year-subscription) |
| **SCCS Survey (UK)** | Обучение и демо по Amberg Rail (тележки GRP1000) и Leica; «flexible courses designed to suit your company's needs» | **Эксклюзивный дистрибьютор Amberg в UK**, не независимый | Покупатель | [sccssurvey.co.uk/rail-solutions](https://www.sccssurvey.co.uk/rail-solutions.html) |
| **Amberg Technologies** | Оборудование + обучение через партнёрскую сеть | OEM + партнёры | Покупатель | 30+ сбытовых партнёров в 40+ странах ([railway-technology.com](https://www.railway-technology.com/contractors/overhaul/amberg-technologies/)) |
| **Topcon Positioning** | John D. Dice Training Center — обучение **и клиентов, и дилеров**; растущая сеть таких центров | Внутренняя служба OEM | Покупатель / дилер | [insideunmannedsystems.com](https://insideunmannedsystems.com/customer-experience-a-focal-point-fornew-topcon-training-center/) |
| **GeoShack**, **AIS Training Center**, **Duncan-Parnell**, **ADMAR** | Курсы GPS Level 1/2, LPS-тахеометр, Magnet Field, сертификация операторов | Дилеры Topcon/Trimble с собственными учебными центрами | Покупатель | [geoshack.com/classes](https://geoshack.com/classes/), [aistraining.com](https://www.aistraining.com/industry-training/positioning-solutions/), [duncan-parnell.com](https://www.duncan-parnell.com/training/training-options) |
| **Hexagon** | Professional Services: консалтинг + инструкторское обучение на своих площадках и у клиента | Внутренняя служба OEM | Покупатель | [hexagon.com/products/product-groups/services/professional-services](https://hexagon.com/products/product-groups/services/professional-services) |
| **V2X** (ранее Raytheon Professional Services → Vertex) | Проектирование, проведение и оценка техобучения для всех сервисных техников GM; управление GM Technical Training Center | **Независимый подрядчик, оплачиваемый производителем** | **GM (производитель)** | Контракт >$100 млн, продлён до 2030; ~4 000 дилерских точек, 40 000+ техников/учеников в год. Ранее: 5-летний контракт на $150 млн, 425+ ч курсов, ~1,5 млн часов обучения в 2005. [prnewswire 10.03.2026](https://www.prnewswire.com/news-releases/v2x-extends-strategic-partnership-with-general-motors-to-deliver-advanced-technical-training-nationwide-302709110.html), [investors.gov2x.com](https://investors.gov2x.com/news/news-details/2026/V2X-Extends-Strategic-Partnership-with-General-Motors-to-Deliver-Advanced-Technical-Training-Nationwide/default.aspx), [raytheon.mediaroom.com](https://raytheon.mediaroom.com/index.php?s=43&item=509) |
| **GP Strategies** (в составе LTG) | Learning operations outsourcing, «OEM solutions», обучение дилерских и сервисных каналов; 50+ лет в автопроме | Независимый аутсорсер обучения | Производитель (OEM) | [gpstrategies.com/industries-we-serve/automotive/oem-solutions](https://www.gpstrategies.com/industries-we-serve/automotive/oem-solutions/) |
| **NIIT (Managed Training Services)** | Аутсорсинг всей учебной функции промышленных клиентов: контент, администрирование, доставка | Независимый аутсорсер | Заказчик-производитель | 2 500+ инструкторов, 40+ стран, 500 000+ обучаемых в год. [niit.com/en/learning-outsourcing](https://www.niit.com/en/learning-outsourcing/) |
| **Quest International** (OEM Services) | White-label филд-сервис для OEM: **installation, integration, upgrades and training**; Master Training Programs | **Независимый подрядчик под брендом OEM** | **OEM**, модель «fixed cost per service» | Вертикали: медизделия класса II/III, авиация, оборона, промышленность, ритейл. [questinc.com/oemservices/field-services](https://www.questinc.com/oemservices/field-services) |
| **Imaging Diversified** | Обучение рентген-технологов + ежемесячная поддержка по КТ/МРТ/рентгену/УЗИ/маммо/ядерке; 4 уровня B2B «от launch enablement до 24/7» | Независимая компания | Клиенты прямым текстом: «B2C Technologists · **B2B Hospitals · ISOs · OEM Partners**» | От **$500/мес** для физлиц; 4.9 при 84 отзывах Google. [imagingdiversified.com](https://imagingdiversified.com/) |
| **MTMI** (Medical Technology Management Institute) | Кросс-тренинг технологов по КТ/МРТ/маммо/УЗИ, 2–5 дней, вебинары, on-demand | Независимая, с 1989; сейчас подразделение CHCP (HCA Healthcare объявила о покупке CHCP, июнь 2026) | Технолог / больница-работодатель | [mtmi.net](https://www.mtmi.net/), [chcp.edu/why-chcp/mtmi](https://www.chcp.edu/why-chcp/mtmi/) |
| **RSTI** (Radiological Service Training Institute) | Курсы по обслуживанию КТ/МРТ конкретных OEM-платформ | Независимая | Больница / ISO / инженер | [rsti-training.com/modality/ct](https://rsti-training.com/modality/ct/) *(сайт отдал 503 при проверке 02.09.2026 — цены не подтверждены)* |
| **Intuitive Surgical (da Vinci)** | Da Vinci Learning: онлайн, симулятор, курсы для хирургов и персонала ОР; прокторинг у постели | OEM-программа + **независимые хирурги-прокторы как подрядчики** | Больница/хирург платят проктору **напрямую**; Intuitive только координирует | «Intuitive coordinates independent surgeon/physician proctors, who provide proctoring services **as independent contractors**… free to negotiate fees directly with each other». [intuitive.com/.../product-training-disclaimer](https://www.intuitive.com/en-us/about-us/company/legal/product-training-disclaimer) |
| **Amplity Health** | Контрактные полевые клинические команды, включая Imaging Clinical Applications Specialist | Контрактная коммерческая организация (CSO) | Производитель по контракту | [amplity.com](https://amplity.com/) |
| **CAE** | Обучение пилотов, кабинного экипажа, техников; type rating; сеть FFS | Крупнейший в мире независимый провайдер обучения в ГА | Авиакомпания; исторически частично — через обязательства Airbus по entry into service | Выручка FY2024 **US$4,282 млрд** *(вторичный источник: Wikipedia; сверить с годовым отчётом)*. Кооперация с Airbus с 2002, завершена по обоюдному согласию. [cae.com](https://www.cae.com/media-centre/press-releases/airbus-cae-training-services-cooperation-mutually-concluded) |
| **Agilent CrossLab Multi-Vendor Services** | Сервис, обучение и compliance на приборах **любого** производителя; «bundled training, repair and maintenance» | OEM, продающий услугу поверх чужого железа | Лаборатория-владелец | [agilent.com/.../multi-vendor](https://www.agilent.com/en/s/maintenance-repair/service-plans/multi-vendor) |
| **TRIGO Group** | Resident engineering: инженеры-резиденты на площадке заказчика, launch support, containment | Независимый провайдер | **Поставщик (Tier 1)**, чтобы у клиента-OEM всё поехало | С 2013; **400+ резидентных инженеров**, команды 3–15 чел., «1000-й резидентный проект». [trigo-group.com/services/resident-engineering](https://www.trigo-group.com/services/resident-engineering/) |
| **Gardner CNC Training (UK)**, **MTL Engineering** | Обучение ЧПУ на любых станках, у клиента на площадке | Независимые тренеры | Владелец станка | Gardner: 30 лет, «fully independent of any one software house». [gardner-cnc.co.uk](https://www.gardner-cnc.co.uk/), [mtlengineering.co.uk](https://www.mtlengineering.co.uk/our-services/cnc-training/) |
| **DMG MORI Academy, Mills CNC, Citizen Machinery UK** | Обучение операторов и программистов на своей и клиентской площадке | OEM / дилер | Покупатель станка | [uk.dmgmori.com](https://uk.dmgmori.com/service-and-training/academy/training), [millscnc.co.uk/training](https://www.millscnc.co.uk/training/) |
| **Siemens Professional Services (Commissioning)** | Пусконаладка как отдельная услуга в прайсе | OEM | Покупатель | [siemens.com/.../commissioning](https://www.siemens.com/en-us/products/industrial-lifecycle-training-services/commissioning/) |
| **Cross Company, Epcon Systems** | Start-up & commissioning + обучение операторов на площадке | Дистрибьюторы / EPC | Владелец установки | [crossco.com](https://www.crossco.com/services/process/start-up-and-commissioning/), [epconlp.com](https://epconlp.com/services/installation-commissioning-training/) |
| **ATS (Advanced Technology Services)** | Аутсорсинг промышленного обслуживания: забирает на себя владение, персонал, найм и обучение | Независимый аутсорсер | Завод-владелец | [advancedtech.com/outsourced-maintenance](https://www.advancedtech.com/outsourced-maintenance/) |

---

## РАЗБОР ПО ПУНКТАМ ЗАДАНИЯ

### 1. Геодезия и строительная техника: кто учит и как зарабатывает

Структура рынка — **трёхслойная, и все три слоя заняты**:

- **Внутренние службы производителя.** Leica Training School (собственный кампус в Шропшире + сеть площадок; курсы аккредитованы NOCN и одобрены CITB), Trimble Learn, Topcon John D. Dice Training Center (учит одновременно клиентов и дилеров), Hexagon Professional Services (инструкторские курсы на своих площадках и у клиента).
- **Дилерский канал — основной исполнитель.** Trimble вообще передаёт обучение авторизованным представителям: SITECH держит «Trimble certified trainers». Топкон — GeoShack (крупнейший дилер в Северной Америке), AIS Training Center (5 курсов позиционирования: GPS Level 1/2, LPS-тахеометр, Magnet Field, сертификация), ADMAR, Duncan-Parnell. В Испании GEDO для железных дорог ведут **Al-Top Topografía** и **ALLTERRA Iberica** — оба авторизованные дистрибьюторы Trimble. В UK по конкурирующей платформе Amberg (тележки GRP1000) — **SCCS Survey**, эксклюзивный дистрибьютор, продающий «flexible courses». **Модель заработка дилера: обучение — не отдельный P&L, а инструмент удержания сделки и апсейла; оплачивается либо клиентом по прайсу, либо «зашивается» в маржу на железе.**
- **Независимые провайдеры — есть, но не в геодезии, а рядом.** В ж/д-машинах — Global Rail Academy. В машинном контроле — профсоюзные учебные центры (напр., OE 139 Training Center, «Advanced Grade — Machine Control», курс посвящён именно GPS Topcon/Trimble); платит профсоюзный учебный фонд. В ЧПУ — Gardner CNC, MTL Engineering.

**Вывод по п.1:** независимых тренинг-провайдеров именно по геодезическому железу мало, и это **самая тонкая часть рынка**. Но «никем не продаётся» неверно даже здесь: дилеры продают обучение как отдельную позицию, а по соседнему сегменту (путевые машины) уже стоит независимая академия с 7 площадками.

### 2. Общий паттерн: есть ли отрасль «независимый application / commissioning support»

**Есть, и она зрелая, но называется иначе.** Три оформленных индустрии:

- **White-label field service для OEM.** Quest International прямо продаёт OEM-ам «installation, integration, upgrades and training» под брендом заказчика, по модели «fixed cost per service». Клиенты — производители медизделий класса II/III, авиации, обороны, промышленности.
- **Training BPO / Managed Training Services.** GP Strategies (learning operations outsourcing, отдельная линейка «OEM solutions»), NIIT MTS (2 500+ инструкторов, 40+ стран, 500 000+ обучаемых в год), V2X. Заказчик — производитель.
- **Resident engineering / launch support.** TRIGO Group: 400+ инженеров-резидентов, размещаемых на площадке клиента, чтобы запуск состоялся; платит поставщик. Это ближайший аналог «пусковой поддержки» по духу.

Плюс смежные модели: аутсорсинг обслуживания (ATS), мультивендорный сервис с обучением от чужого OEM (Agilent CrossLab), start-up & commissioning от дистрибьюторов и EPC (Cross Company, Epcon).

**Вывод по п.2: критерий опровергнут.** Отрасль существует, у неё есть публичные игроки, прайсинговые модели и многолетние контракты.

### 3. Медицинская аналогия — самый зрелый рынок

- **Intuitive (da Vinci).** Обучение хирургов и персонала ОР — программа Intuitive (Da Vinci Learning: онлайн, симулятор, очные курсы). Прокторинг у операционного стола — **независимые хирурги-подрядчики**: Intuitive их только координирует, а гонорар больница/хирург и проктор согласуют **напрямую между собой**; сама Intuitive прайс не устанавливает. Порядок величин косвенно: Intuitive — крупнейший плательщик среди 497 компаний в Open Payments по травматологам (33,6% всех выплат этой специальности); один хирург в исследовании получил $171 140, все — от Intuitive. *(Это выплаты за консультации/спикерство/прокторинг суммарно, не чистая ставка за кейс — точная ставка за проктор-кейс публично не раскрывается.)*
- **КТ/МРТ.** Application training — стандартный SKU производителя: у Siemens Healthineers, например, трёхдневный курс для будущих пользователей КТ на Somaris X и двухдневный по кардио-КТА. На рефёрбишед-рынке applications specialist приезжает учить технологов как часть сделки. Параллельно живут независимые: MTMI (с 1989, кросс-тренинг 2–5 дней), RSTI (сервисные курсы по платформам конкретных OEM), Imaging Diversified (от $500/мес; клиенты включая **OEM Partners и ISO**).
- **Кто платит.** Больница/технолог — за независимое обучение; производитель — за applications-специалистов в составе поставки и за контрактные полевые команды (Amplity, Quest).

**Вывод по п.3:** рынок расслоён окончательно. Свободного места нет; есть отдельная ниша «независимый проктор», но она устроена как индивидуальный подряд, а не как компания-продукт.

### 4. Как это оформлено у производителей

- **Отдельные SKU на обучение — да, повсеместно.** Leica: курс Machine Control 7 часов, максимум 8 человек, NOCN/CITB; self-led подписка $1 495 за 6+ мест. Siemens: отдельная услуга Commissioning в линейке Industrial Lifecycle Training Services. Global Rail Academy: «Tamper Operator, 28 дней». Плюс дилерские каталоги курсов (GeoShack, AIS, Duncan-Parnell, ADMAR).
- **Обучение как обязательство в договоре поставки — да.** Boeing Customer Support Document / Supplemental Exhibit CS1 в SEC-филингах: «training… furnished by Boeing in support of introduction of the Aircraft into the customer's fleet», покупателю начисляются **training points**. Airbus — «commitment to provide training to support the entry into service».
- **Доля выручки — не раскрывается отдельно.** Ни Trimble, ни Hexagon, ни Leica, ни Plasser не публикуют строку «training revenue»; она растворена в сервисе/подписках. Для калибровки порядка: сервисные контракты на медоборудование — ~7,4% стоимости приобретения в год при собственном обслуживании и 10–14% при аутсорсинге *(вторичный источник: speclens.ai; требует проверки)*. **Допущение: доля обучения в выручке производителя геодезического оборудования — единицы процентов, отдельно не отчитывается.**
- **Аутсорсится ли — да, но избирательно.** Аутсорсится обучение **канала** (V2X/GM, GP Strategies) и **филд-сервис** (Quest). Обучение **конечных бригад** производители геодезии/путевых машин держат у себя или отдают дилеру.

### 5. Кто пытался и не смог

Прямых банкротств независимых тренинг-компаний **именно по промышленному оборудованию** найти не удалось. Наблюдаемая картина — **не смерть, а поглощение**:

| Компания | Что произошло |
|---|---|
| PMC Rail International Academy | 2017 — выделена из учебного центра Deutsche Plasser; позже вошла в Global Rail Group, ребрендинг в Global Rail Academy |
| Raytheon Professional Services | Контракт GM продан Vertex, далее V2X |
| MTMI | Стала подразделением CHCP; в июне 2026 HCA Healthcare объявила о покупке CHCP |
| GP Strategies | Куплена Learning Technologies Group |
| Bon-Accord Training (UK, с 1986, обучение операторов подъёмно-транспортной техники) | Декабрь 2023 — куплена AquaTerra |

**Наблюдаемый режим отказа лежит в другом месте:** независимые учебные провайдеры в UK, зависевшие от государственного/сборного финансирования (Acacia Training и др.), закрывались при изменении правил финансирования. Урок для гипотезы: **опасен не сам продукт, а зависимость от единственного кошелька — особенно субсидийного.**

*(Ограничение исследования: поиск по закрытиям вёлся на английском и по открытым источникам; локальные банкротства в Испании/Германии могли не попасть в выдачу.)*

---

## ПОПРАВКА К ФАКТИЧЕСКОЙ БАЗЕ ПОСЫЛКИ

Цифра «около восьми выпускников по геодезии в год на всю Испанию» **не подтверждается и занижена примерно в 8 раз**.

По данным Министерства университетов / Министерства науки и SEPE (цитируются в материале que.es от 05.07.2026):
- **69 выпускников** Grado en Ingeniería en Geomática y Topografía по всей Испании за последний учебный год;
- пик 2012/13 — **более 1 000** выпускников;
- аффилиация в соцстрахе через 4 года после выпуска — **~91%**;
- на конец 2025 года в SEPE только **2 человека** искали первую работу топографом;
- стартовая зарплата ~**€30 000** брутто/год, через 4 года — **€31 845** (по COIGT);
- COIGT: «cuando faltan topógrafos cualificados, la obra puede sufrir retrasos, mayores costes y más riesgo de errores».

**Дефицит реален и подтверждён первичной статистикой** — но при питче цифру надо заменить на 69, иначе первый же проверяющий поймает на ошибке.

---

## ЧТО ЭТО ЗНАЧИТ ДЛЯ ИДЕИ

**Занятые ниши (туда не идти):**
- «Учить работать с тележкой и тахеометром» в чистом виде — это уже делает дилер (в Испании: Al-Top и ALLTERRA) бесплатно или почти бесплатно, как часть удержания сделки. Конкурировать ценой с бесплатным нельзя.
- «Академия операторов путевой техники» — занято Global Rail Academy, с 7 площадками и историей из Plasser.

**Где реально осталась щель (гипотезы, требующие отдельной проверки):**
1. **Разрыв между «обучили» и «производительность достигнута».** Ни один найденный игрок не продаёт результат в метриках машины (метры выправки за смену, доля переделок). Все продают часы курса и сертификат. Это единственное отличие, которое не занято.
2. **Плательщик — не производитель, а подрядчик-владелец бригады**, у которого простой выправочной машины стоит денег каждый день. Бюджет производителя доступен только через строку в конкретной поставке (аналог training points), а не через фонд.
3. **Третий кошелёк — отраслевые фонды.** Модель CITB Tier 2 Levy Grant показывает, что в некоторых юрисдикциях обучение частично компенсируется. Стоит проверить испанский аналог (Fundae / bonificaciones de formación) — это может оказаться самым доступным источником денег.

**Главный риск, вытекающий из п.5:** зависимость от одного кошелька убивает такие компании. Модель должна опираться минимум на два (подрядчик + отраслевой фонд), а бюджет производителя рассматривать как бонус, а не как основу.

---

## СТАТУС ИСТОЧНИКОВ

Проверено первично (открыто и прочитано): global-rail-group.com, na.global-rail-group.com, imagingdiversified.com, questinc.com, leica-geosystems.com (NOCN-курс), sccssurvey.co.uk, aistraining.com, que.es, store.leica-geosystems.us.

Взято из поисковой выдачи, страница не открылась напрямую (403/503/DNS) — помечено в тексте: cae.com (пресс-релиз Airbus–CAE), pmcrail.com, gmauthority.com, rsti-training.com, intuitive.com (product training disclaimer).

Вторичные источники, требующие сверки с отчётностью: выручка CAE FY2024 (Wikipedia), Hexagon Autonomous Solutions Q1 2026 EUR 176 млн (пересказ звонка), доли сервисных контрактов 7,4% / 10–14% (speclens.ai), пятилетний контракт RPS на $150 млн (Buffalo News, архивная заметка).

Контракт V2X–GM (>$100 млн, до 2030, ~4 000 дилерских точек, 40 000+ техников в год, центр в Трое, MI) подтверждён пресс-релизом на PR Newswire и на сайте IR V2X от 10.03.2026.
