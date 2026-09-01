# W1 — Детектор «умер лидер»: энергетический софт с доказанной ценностью и провалившейся монетизацией

Дата: 01.09.2026. Дисциплина: каждое утверждение — с источником; интерпретации причин смерти помечены словом **допущение**; «не нашёл» — полноценный ответ.

Ключевая рамка проверки: у категории есть опубликованное доказательство экономии (пилот, RCT, отчёт RTO/регулятора), но лидер категории не может привлечь деньги, продаётся ниже прошлой оценки или закрывается. Гипотеза: чаще всего это значит, что продукт продавали покупателю, у которого экономия **не попадает в собственный P&L** (утилита на cost-of-service зарабатывает на CapEx, а не на экономии для потребителей).

---

## Часть 1. Четыре известных примера

### 1.1 NewGrid (topology optimization / реконфигурация сети)

**Доказанная ценность (факты):**
- Исследование NewGrid + SPP + Brattle: устранение исторических нарушений операционных лимитов по 75% проанализированных ограничений, потенциальная экономия на congestion — **$18–44 млн/год**; FERC одобрил план SPP по topology optimization 19.08.2026 ([Utility Dive](https://www.utilitydive.com/news/ferc-spp-topology-optimization-grid-congestion/828366/)).
- Конкретный кейс: реконфигурация, найденная софтом NewGrid, снизила цену в узле с ~$600/МВт·ч до ~$25/МВт·ч (средняя по SPP); MISO с 2024 г. сэкономила $95 млн на экономических реконфигурациях ([Canary Media](https://www.canarymedia.com/articles/transmission/new-software-can-find-more-room-for-clean-energy-on-transmission-grid)).
- Компания живёт с 2015 г. (спин-офф проекта ARPA-E/Boston University) ([Canary Media](https://www.canarymedia.com/articles/transmission/new-software-can-find-more-room-for-clean-energy-on-transmission-grid)).
- Цифру «~$125 тыс. привлечённых за 11 лет» независимо подтвердить **не смог** (Crunchbase-профиль существует, но сумма в выдаче не раскрыта; [Crunchbase](https://www.crunchbase.com/organization/newgrid)) — беру как данные вашей проверки. Canary Media подтверждает качественно: компания живёт на DOE-гранты и не имеет органического спроса от утилит.

**Published-объяснение провала монетизации:**
- CEO Pablo Ruiz прямо: «The overall incentives that are embedded in the current regulatory structure are a barrier to extracting the most value from the transmission grid». Cost-of-service даёт гарантированную доходность на CapEx; софт снижает издержки, но не создаёт утилите актива в тарифной базе. Экономия от снижения congestion достаётся потребителям (через тариф), не утилите. Плюс консерватизм операторов и отсутствие формального процесса реконфигураций в RTO (у MISO его нет) ([Canary Media](https://www.canarymedia.com/articles/transmission/new-software-can-find-more-room-for-clean-energy-on-transmission-grid)).

**Кто мог бы платить вместо утилиты/RTO — разбор по механике денег:**
- **FTR-трейдеры — да, но со знаком «шорт на знание».** Congestion — это их актив: держатели FTR, купившие права дёшево на аукционе, зарабатывают на спреде congestion-цен; успех в FTR требует глубокого понимания топологии и паттернов перегрузки ([PCI Energy Solutions](https://www.pcienergysolutions.com/2024/08/07/what-is-ftr-trading-strategies-benefits-market-impacts-explained/), [Yes Energy](https://www.yesenergy.com/blog/what-is-ftr-trading-and-how-does-it-work)). **Допущение:** трейдер платит не за «снижение перегрузки», а за **предсказание** того, где и когда RTO применит/не применит реконфигурацию — это альфа для FTR/виртуальных позиций. Ценность та же (модель топологии), продукт другой (прогноз, а не операционный инструмент). Willingness to pay трейдеров за grid-данные доказан существованием прибыльных Yes Energy/Enverus.
- **Генераторы/батарейные девелоперы, страдающие от curtailment, — да.** **Допущение:** для ветропарка в SPP, которого «режут» из-за перегрузки, реконфигурация = прямые МВт·ч выручки; консорциум генераторов на одном congested-интерфейсе мог бы оплачивать анализ NewGrid и лоббировать реконфигурацию в RTO (модель «плати за разблокированную выручку», success fee). Аналогично — девелоперы на стадии interconnection: обход перегрузки снижает network upgrade costs, которые сидят прямо в их CapEx.
- **Сам RTO — частично сработало, но это не венчурный рынок:** SPP/MISO внедряют, но это 7 покупателей в США с многолетним циклом (FERC-одобрение SPP заняло годы) ([Utility Dive](https://www.utilitydive.com/news/ferc-spp-topology-optimization-grid-congestion/828366/)).

**Вердикт: не тот покупатель.** Ценность огромна и доказана регулятором; покупатель (утилита/RTO) структурно не монетизирует её.

### 1.2 LineVision (dynamic line rating, DLR)

**Факты:**
- Лидер категории DLR; последний раунд — Series C $33 млн, **3 октября 2022**, всего ~$50 млн; Series D в базах нет (на 09.2026) ([PRNewswire](https://www.prnewswire.com/news-releases/linevision-announces-33m-series-c-in-growth-capital-to-accelerate-the-net-zero-grid-301639640.html), [Tracxn](https://tracxn.com/d/companies/linevision/__qvQMyeUlsLAM466n9aGi4hm4n_i7heuweFnzFYnFRPE)).
- Published-объяснение: годы «pilot hell» — R&D-пилоты без операционных контрактов; утилиты боятся hardware на ЛЭП; внедрение DLR требует изменить процессы, «не менявшиеся сто лет»; только в 2022 National Grid дал первый операционный контракт ([Latitude Media](https://www.latitudemedia.com/news/how-linevision-made-it-past-the-utility-pilot-hurdle/), [Latitude Media](https://www.latitudemedia.com/news/linevisions-years-long-effort-to-operationalize-new-technology-at-utilities/)).
- Ценность категории доказана: крупнейший DLR-проект США с National Grid, операционализация в Нью-Йорке ([LineVision](https://www.linevisioninc.com/news/linevision-operationalizes-dynamic-line-ratings-in-new-york-to-increase-transmission-capacity-and-grid-safety-for-national-grid)).

**Кто мог бы платить вместо утилиты:**
- **Допущение:** те же две группы, что у NewGrid: (а) генераторы/девелоперы, чья выручка ограничена рейтингом конкретной линии (DLR даёт +10–40% capacity, т.е. прямые МВт·ч в их P&L) — модель «DLR как условие ускоренного interconnection, оплачивает девелопер»; (б) крупная новая нагрузка — **дата-центры**, которым DLR ускоряет подключение (та же логика, что у Enchanted Rock с flexible connection, см. Часть 3).
- **Допущение:** причина смерти — не «ценность мала», а комбинация «не тот покупатель + цикл продажи убил»: покупатель тот получает ценность (defer CapEx), но его процессы и стимулы делают цикл 5–7 лет, несовместимый с венчурной кассой.

**Вердикт: тот покупатель по ценности, но убийственный цикл; перезаход — платит тот, кому линия мешает зарабатывать (девелопер/нагрузка), а не тот, кто ею владеет.**

### 1.3 AutoGrid (DERMS/VPP-платформа)

**Факты:**
- Schneider Electric купил AutoGrid в мае 2022 и продал Uplight через **19 месяцев** (сделка объявлена 14.12.2023, закрыта в феврале 2024, сумма не раскрыта) ([Memoori](https://memoori.com/behind-schneider-electric-move-divest-autogrid-uplight/), [BizWest](https://bizwest.com/2023/12/14/uplight-to-acquire-autogrid-building-on-schneider-ties/)).
- Published-объяснение: Memoori называет продажу «стратегическим разворотом после многих лет инвестиций»; официальная версия — комплементарность (Uplight умеет вовлекать 110 млн домохозяйств, AutoGrid — диспетчировать ресурсы; вместе якобы +60% peak reduction к 2030) ([Memoori](https://memoori.com/behind-schneider-electric-move-divest-autogrid-uplight/), [Uplight](https://uplight.com/press/uplight-to-acquire-autogrid/)).
- Контекст рынка VPP: инвестор-owned утилиты (~70% клиентов США) зарабатывают на строительстве инфраструктуры с гарантированной доходностью — у них нет естественного стимула поддерживать VPP ([Heatmap](https://heatmap.news/climate-tech/vpps-voltus-octopus)); WoodMac: VPP «прошли пилотную стадию», но политика и технология всё ещё барьеры ([Utility Dive](https://www.utilitydive.com/news/vpps-past-pilot-scale-but-policy-tech-challenges-remain-woodmac/724974/)).

**Кто мог бы платить:** **допущение** — ритейлер/агрегатор с позицией в оптовом рынке (у него shaving пика = прямое снижение затрат на закупку) и владельцы DER-портфелей (монетизация через market revenue share, как у Voltus/CPower). Продажа DERMS утилите = продажа «программы», которую утилита ведёт из-под регулятора, т.е. бюджетная, а не P&L-покупка.

**Вердикт: не тот покупатель (утилита), при этом сам актив дважды перепродан стратегам — ценность признаётся, монетизация в утилитном канале не складывается.**

### 1.4 Uplight (customer engagement + flexibility для утилит)

**Факты:**
- Оценка **$1,5 млрд** в июле 2021 (Rubicon продал контроль консорциуму во главе со Schneider/AES/Huck) ([Business Wire](https://www.businesswire.com/news/home/20210728006113/en/Rubicon-Technology-Partners-Completes-Sale-of-Majority-Stake-in-Uplight-at-%241.5-Billion-Valuation)).
- В 2025 искал покупателя через Evercore с ценником «чуть выше $1 млрд» — ниже оценки 2021; после поглощения AutoGrid «новые партнёрства и запуски продуктов заметно редки»; названы проблемы интеграции продуктов («integration would be the easy part — it turns out it's actually the other way around») ([Latitude Media](https://www.latitudemedia.com/news/scoop-uplight-is-looking-for-a-buyer/)).
- Март 2026: контроль купил **Octopus Energy** (ритейлер!), сумма не раскрыта, Schneider остался миноритарием ([Latitude Media](https://www.latitudemedia.com/news/octopus-energy-is-taking-a-majority-stake-in-uplight/), [ESG Today](https://www.esgtoday.com/octopus-acquires-majority-stake-in-grid-tech-company-uplight/)).

**Кто мог бы платить:** ответ дал сам рынок — купил ритейлер. **Допущение:** для Octopus/Kraken вовлечение клиента и гибкость — это маржа поставщика и снижение cost-to-serve (прямой P&L), а не «программа по указке регулятора». Сам факт сделки — свидетельство в пользу паттерна перезахода (см. Часть 3).

**Вердикт: не тот покупатель; исход (продажа ритейлеру со скидкой к оценке 2021) — почти лабораторное подтверждение гипотезы.**

---

## Часть 2. Ещё категории с паттерном «ценность доказана — монетизация слабая»

### 2.1 Home energy reports / behavioral efficiency (Opower)
- **Ценность доказана:** категория построена на RCT-подтверждённой экономии; Opower дорос до IPO. **Монетизация провалилась:** IPO апрель 2014 по $25, продан Oracle в мае 2016 по **$10.30** (~$532 млн) — сильно ниже IPO; перед сделкой — квартальные убытки, увольнение 7,5% штата, высокие R&D/маркетинговые издержки ([Utility Dive](https://www.utilitydive.com/news/oracle-to-buy-opower-for-418453/), [Goodwin](https://www.goodwinlaw.com/en/news-and-events/news/2016/05/05_02_2016-opower-to-be-acquired-by-oracle-for-$532-million), [SEC](https://www.sec.gov/Archives/edgar/data/0001412043/000119312516571455/d180345dex991.htm)).
- **Причина (допущение):** покупатель — утилита, платящая из регуляторного EE-бюджета: рынок капнут размером бюджетов, рост требует дорогих продаж, экономия достаётся потребителю, а не покупателю. Не «ценность мала», а «ценность не в P&L покупателя + потолок бюджета».
- **Перезаход-кандидат (допущение):** ритейлер на конкурентных рынках (churn reduction + cost-to-serve — модель Octopus/Kraken) или OEM тепловых насосов/кондиционеров (отчёты как канал продаж электрификации).

### 2.2 Disaggregation (Bidgely, Sense)
- **Ценность:** Bidgely определяет EV/солнце/батареи за счётчиком из одних AMI-данных, ~40 утилит-клиентов ([Business Wire](https://www.businesswire.com/news/home/20210914005432/en/Bidgely-Secures-%2426M-in-Financing-to-Accelerate-Utilities-Leading-Role-in-the-Clean-Energy-Future)). **Монетизация:** последний публичный раунд Bidgely — $26 млн, сентябрь 2021; новых раундов в выдаче не нашёл ([Tracxn](https://tracxn.com/d/companies/bidgely/__a0bbrzO271Lpri4botnXXHTwdGG3gBJuWxM4iNe8S8M)).
- Sense: потребительское железо упёрлось в цену и сложность установки; компания перезашла — встроила disaggregation в счётчики Landis+Gyr (Revelo) и панели Schneider, получая ongoing fees как софт-сервис на платформе утилиты ([Latitude Media](https://www.latitudemedia.com/news/is-the-era-of-direct-to-consumer-energy-hardware-coming-to-a-close/), [Sense](https://sense.com/utilities/)).
- **Причина (допущение):** disaggregation — это фича данных, не продукт: и потребитель, и утилита получают «инсайт», который сам по себе не двигает их P&L. **Перезаход-кандидат:** OEM счётчиков (Sense уже показал), страховщики (детекция аварийных нагрузок) — по страховщикам подтверждений **не нашёл**.

### 2.3 Резидентные VPP-агрегаторы (Swell, OhmConnect)
- **Ценность доказана:** DOE — утроение VPP к 2030 экономит $10 млрд/год и закрывает 20% пика ([Utility Dive](https://www.utilitydive.com/news/virtual-power-plant-vpp-doe-liftoff-tesla-voltus/693525/)).
- **Монетизация:** Swell закрылся в августе 2024, подняв $150+ млн (SoftBank, Ares); Canary: «слишком рано для неразвитого и нелюбимого рынка VPP», тонкие маржи, «рынок, где никто не понял, как зарабатывать»; Hawaiian Electric компенсировала клиентам развал программы ([Canary Media](https://www.canarymedia.com/articles/climatetech-finance/the-cleantech-companies-that-didnt-make-it-through-2024), [Latitude Media](https://www.latitudemedia.com/news/scoop-swell-is-shutting-down/), [KHON2](https://www.khon2.com/local-news/hawaiian-electric-to-compensate-customers-after-swell-energy-closure/)).
- Даже C&I-лидер Voltus не ожидал прибыльности до 2025 и заплатил $18 млн по мировой с FERC (обвинения в нарушении правил DR в MISO, январь 2025) ([businessmodelcanvastemplate.com](https://businessmodelcanvastemplate.com/blogs/how-it-works/voltus-how-it-works)).
- **Причина (допущение):** для residential — «цикл продажи убил + не тот покупатель» (платит утилита за программу, а не рынок за мощность) плюс дорогой acquisition домохозяйств. **Перезаход-кандидат:** ритейлер (Octopus), OEM устройств (Tesla, Renew Home от Google/SIP), дата-центры как покупатели гибкости.

### 2.4 Микрогрид-контроллеры (Heila Technologies)
- **Ценность:** MIT-спин-офф, работающие микрогриды (Stone Edge Farm). **Монетизация:** за ~7 лет привлёк лишь **$3 млн** + гранты, продан Kohler в январе 2022, сумма не раскрыта — по масштабу это acqui-hire в подразделение генераторов ([Canary Media](https://www.canarymedia.com/articles/grid-edge/kohler-power-buys-startup-that-uses-game-theory-math-to-manage-microgrids), [Energy Tech](https://www.energytech.com/microgrids/article/21213246/on-site-gen-set-maker-kohler-acquiring-microgrid-controls-firm-heila)).
- **Причина (допущение):** контроллер — 2–5% стоимости микрогрида; покупатель (владелец объекта/EPC) платит за киловатты и uptime, не за софт. Коммодитизация в составе железа. **Перезаход доказан рынком:** Enchanted Rock продаёт не контроллер, а **Resiliency-as-a-Service** (см. 3.1).

### 2.5 EV smart charging для сетей (WeaveGrid, ev.energy)
- **Ценность:** управляемая зарядка снижает пиковые издержки; программы растут (DTE перевыполнила цели enrollment) ([Utility Dive](https://www.utilitydive.com/news/as-ev-load-grows-utilities-use-managed-charging-to-harness-flexibility-lo/816859/)).
- **Монетизация:** прямых свидетельств провала лидера **не нашёл** — WeaveGrid в 2025 расширяется (Rivian, O&R/NY) ([WeaveGrid](https://www.weavegrid.com/news/weavegrid-and-rivian-collaborate-to-deliver-advanced-grid-integrated-charging-solutions)). Структурный риск (допущение): 3000+ утилит США = фрагментированный канал с программными бюджетами; категория «предсмертной» не является, но канал тот же, что убил Opower. **Кандидат-перезаход:** автопроизводитель (платит за клиентский опыт/удержание) и ритейлер (EV-тарифы) — Octopus уже делает это внутри Kraken.

### 2.6 Grid analytics для муниципалитетов и кооперативов (Camus Energy)
- **Ценность:** платформа у Vermont EC, Kit Carson, La Plata; ARR +500% с 2021 ([Business Wire](https://www.businesswire.com/news/home/20240213268424/en/)). **Монетизация:** за ~6 лет всего ~$29–35 млн (Series A растянута экстеншенами до 2024) — series A-размер на седьмом году: масштабирования нет ([Latitude Media](https://www.latitudemedia.com/news/camus-energy-expands-series-a-to-help-utilities-chart-load-growth/)).
- **Причина (допущение):** покупатели (муни/коопы) — правильные по стимулам (они не IOU, экономия реально их), но **мелкие и бедные**: ACV мал, продажи штучные, рынок 2770 организаций с крошечными IT-бюджетами. Здесь «ценность попадает в P&L, но P&L маленький». Перезаход не про покупателя, а про упаковку: G&T-кооперативы/агрегаторы каналом.

### 2.7 Building EMS (Gridium, Carbon Lighthouse)
- Подтверждений смерти лидеров **не нашёл**: Gridium жив как EMaaS ([Gridium](https://gridium.com/)); по Carbon Lighthouse свидетельств закрытия в выдаче нет ([Crunchbase](https://www.crunchbase.com/organization/carbon-lighthouse)). Категорию в детектор не включаю — честный «не нашёл».

---

## Часть 3. Доказательства, что перезаход работает

1. **Enchanted Rock (перезаход микрогридов).** Вместо продажи контроллеров/софта — RaaS: финансирует, владеет и оперирует микрогридами; клиент платит за гарантированные 99.99% uptime без CapEx. Сотни площадок H-E-B/Walmart в Техасе; с 2025 — дата-центры (bridge-to-grid для Microsoft, «вдвое дешевле дизеля») ([EnkiAI](https://enkiai.com/data-center/enchanted-rocks-raas-powers-ai-data-centers-in-2025), [PRNewswire](https://www.prnewswire.com/news-releases/enchanted-rock-and-us-energy-partner-to-provide-back-up-power-for-microsoft-data-center-for-grid-outages-302012202.html)). Покупатель сменился с «сеть/владелец объекта покупает технологию» на «C&I/ЦОД покупает результат» — категория взлетела.
2. **Gridmatic / Habitat Energy (перезаход battery optimization).** Вместо продажи оптимизационного софта утилитам — сами стали трейдером: Gridmatic поднял фонд $50 млн и толлингует чужие батареи (владельцу — фикс, себе — весь трейдинговый апсайд); Habitat оптимизирует 3+ ГВт в ERCOT/UK/Австралии как трейдер, в 2026 вышел в PJM ([Energy Storage News](https://www.energy-storage.news/gridmatic-launches-us50-million-fund-to-manage-bess-projects-in-ercot-and-caiso/), [Business Wire](https://www.businesswire.com/news/home/20260415643233/en/Habitat-Energy-Expands-Into-PJM)). Та же математика оптимизации, но монетизируется через рынок, а не через лицензию утилите.
3. **Sense (перезаход disaggregation).** D2C-железо не взлетело → та же технология встроена в счётчики Landis+Gyr и панели Schneider, оплата — ongoing fees через OEM ([Latitude Media](https://www.latitudemedia.com/news/is-the-era-of-direct-to-consumer-energy-hardware-coming-to-a-close/)). Покупатель сменился с потребителя на OEM.
4. **Amperon (форкастинг: продавать трейдерам, а не утилитам).** Позиционирует прогнозы прежде всего трейдерам/IPP/ритейлерам и дистрибутируется через трейдерский терминал Yes Energy (Head of Trading Ørsted: «game changing») ([PRNewswire](https://www.prnewswire.com/news-releases/amperons-ai-powered-forecasts-now-available-on-the-yes-energy-platform-302403714.html)). Willingness to pay трейдеров за grid-данные — доказанный факт существования Yes Energy/Enverus.
5. **Octopus → Uplight (перезаход через M&A).** Утилитный вендор с просевшей оценкой куплен ритейлером, для которого те же функции — прямой P&L ([Latitude Media](https://www.latitudemedia.com/news/octopus-energy-is-taking-a-majority-stake-in-uplight/)). **Допущение:** это подтверждение паттерна «сменился покупатель — актив снова нужен».

Паттерн рабочий: во всех пяти случаях ценность не менялась — менялся тот, в чей P&L она попадает (или компания сама становилась этим P&L).

---

## Итоговая таблица

| Категория (лидер) | Доказанная ценность | Причина провала монетизации | Кандидат-покупатель для перезахода |
|---|---|---|---|
| Topology optimization (NewGrid) | $18–44 млн/год экономии в SPP, FERC-одобрение 08.2026; узел $600→$25/МВт·ч (Utility Dive, Canary) | **Не тот покупатель**: экономия уходит потребителям через тариф, утилита зарабатывает на CapEx (цитата CEO) | FTR-/power-трейдеры (прогноз реконфигураций = альфа); консорциумы генераторов/БЭС, страдающих от curtailment (success fee от разблокированной выручки) |
| DLR (LineVision) | Крупнейший DLR-проект США, операционализация у National Grid | **Цикл продажи убил** (годы «pilot hell») + покупатель без стимула спешить; без раунда с 10.2022 | Девелоперы генерации/БЭС и дата-центры, покупающие ускоренное подключение (МВт·ч и месяцы — их P&L) |
| DERMS/VPP-платформа (AutoGrid) | Дважды куплен стратегами; VPP-экономика подтверждена DOE ($10 млрд/год) | **Не тот покупатель**: IOU зарабатывают на стройке, не на гибкости (Heatmap); Schneider вышел за 19 мес. | Ритейлер/агрегатор с рыночной позицией; владельцы DER-портфелей (revenue share) |
| Engagement+flex (Uplight) | $1,5 млрд оценка 2021; 110 млн домохозяйств охвата | **Не тот покупатель** + непереваренная интеграция; продажа ниже оценки 2021 | Уже случилось: ритейлер (Octopus, 03.2026) |
| Home energy reports (Opower) | RCT-доказанная поведенческая экономия, IPO | **Не тот покупатель + потолок**: EE-бюджеты капнуты регулятором; убытки, продажа $10.30 против IPO $25 | Конкурентные ритейлеры (churn/cost-to-serve); OEM электрификации |
| Disaggregation (Bidgely, Sense) | Детекция EV/DER из AMI-данных у ~40 утилит | **Фича, не продукт** (допущение); Bidgely без раунда с 09.2021 | OEM счётчиков/панелей (Sense уже доказал); утилиты платят OEM, не стартапу |
| Residential VPP (Swell, OhmConnect) | DOE: $10 млрд/год экономии при масштабировании | **Рынок не готов + тонкие маржи**: Swell умер с $150 млн привлечённых | Ритейлер (модель Octopus/Kraken), OEM устройств (Renew Home), ЦОД как покупатель гибкости |
| Микрогрид-контроллеры (Heila) | Работающие микрогриды, MIT-технология | **Коммодитизация в составе железа**: $3 млн за 7 лет, acqui-hire Kohler | Перезаход доказан: RaaS для C&I/ЦОД (Enchanted Rock) |
| EV smart charging (WeaveGrid) | Программы работают, enrollment выше плана | Провала **не нашёл**; структурный риск утилитного канала (3000+ утилит) | Автопроизводители, ритейлеры |
| Grid analytics муни/коопы (Camus) | ARR +500%, реальные коопы-клиенты | **P&L покупателя мал**: Series A-экстеншены на 7-м году | Правильный покупатель, неправильный размер; канал через G&T/NRECA |

## Топ-2 самых перспективных перезахода

**№1. Congestion intelligence для трейдеров и curtailment-страдальцев (перезаход topology optimization / NewGrid-паттерна).**
Обоснование: разрыв максимален — ценность подтверждена RTO и FERC в долларах ($18–44 млн/год только в SPP), при этом лидер прожил 11 лет на грантах. Willingness to pay альтернативного покупателя уже доказан: FTR-трейдеры живут пониманием топологии (PCI, Yes Energy), а прибыльные data-терминалы для энерготрейдинга существуют. Два конкретных продукта: (а) прогноз реконфигураций/загрузок как фид в трейдерские терминалы; (б) success-fee-анализ для генераторов и БЭС, теряющих выручку на curtailment. **Допущение:** внедрение реконфигураций самими RTO (SPP с 2026, MISO с 2024) создаёт новый источник неопределённости в congestion — то есть спрос трейдеров на такой прогноз будет расти именно потому, что категория «победила» операционно.

**№2. Гибкость/подключение как услуга для дата-центров (перезаход DLR + DERMS + микрогридов).**
Обоснование: единственный покупатель в энергетике, у которого месяцы ожидания мощности стоят миллиарды в P&L прямо сейчас. Паттерн уже подтверждён Enchanted Rock (bridge-to-grid для Microsoft, RaaS вместо продажи контроллеров) и разворотом Uplight на «AI-driven demand growth» как главный аргумент продажи (Latitude). DLR-компетенция LineVision и диспетчирование AutoGrid в этой упаковке продаются не утилите за программный бюджет, а девелоперу ЦОД за ускоренные мегаватты. **Допущение:** это же — наиболее реалистичный exit-маршрут для активов из первой колонки таблицы.
