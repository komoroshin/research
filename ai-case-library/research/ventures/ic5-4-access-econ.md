# IC-5.4 — Проверка на фальсификацию: доступ к частным покупателям и юнит-экономика
### Гипотеза: «UK частные девелоперы/EPC/ЦОДы готовы покупать комплаенс-софт у вендора с РФ-основателями, и юнит-экономика складывается в бизнес ≥$10 млн потенциала»

**Дата проверки:** 01.09.2026. Роль: исследователь-скептик, цель — опровергнуть.

---

## ВЕРДИКТ (кратко)

**Утверждение в основном ОПРОВЕРГНУТО — но не тем звеном, которое ожидалось.**

1. **Главный опровергающий факт — не «происхождение», а ТАЙМИНГ: основная кампания подач уже прошла.** Окно подачи Gate 2 evidence (G2TWQ/CMP435) закрылось **26 августа 2025**, результаты реформы объявлены **8 декабря 2025** (283 ГВт продвинуто, >300 ГВт удалено из очереди). Разовый «час пик», под который заточена гипотеза, состоялся ДО выхода продукта. Остаётся хвост: milestone-комплаенс по выданным офферам, окно новых заявок H2 2026 и свежая demand-реформа для ЦОДов (консультация Ofgem открыта до 16.09.2026) — это заметно меньший и размазанный по времени рынок.
2. **Юнит-экономика не дотягивает до $10 млн на одной Британии.** ~1 720 проектов в transmission-очереди; даже при агрессивных допущениях (3 000 проектов × £3 000/год) потолок ~£9 млн (~$11 млн) TAM при 100% захвате. Реалистичная доля нового вендора без референсов (5–10% за 2–3 года) = $0,5–1 млн ARR. Порог «≥$10 млн потенциала» достижим только с экспансией за пределы UK или с consulting-ставками (что уже не софт-бизнес).
3. **Доступ по происхождению: жёсткого юридического барьера для продаж частникам НЕ нашёл — но и позитивных прецедентов НЕ нашёл.** Формального фильтра «нет вендорам с РФ-корнями» в анкетах Achilles UVDB / SIG / CAIQ не обнаружено (помечено ниже). При этом: (а) задокументирован климат де-рискинга (банки, репутация); (б) регуляторный вектор (Cyber Security and Resilience Bill, ноябрь 2025) втягивает поставщиков ИТ-услуг энергосектору и сами ЦОДы в режим NIS — supply-chain-скрутиниз будет расти; (в) прецедент origin-based исключения в UK существует (Huawei), пока только в телекоме. Для гиперскейлеров РФ-корни — реальный минус в security review, хотя формального запрета не нашёл.
4. **Конкуренция уже на поле:** в UK — Gridview, Yottar (партнёр National Grid Electricity Distribution), плюс консультанты (Roadnight Taylor, TNEI); в США — прибыльные Nira Energy и Pearl Street. «Альтернативный клин» в США — это вход на рынок с окопавшимися инкумбентами, а не лёгкий путь.

**Что осталось бы живого:** узкий B2B-сервис milestone-комплаенса (M1–M10 по queue management) + demand-side реформа ЦОДов 2026–2027 — но это ниша на сотни тысяч, не десятки миллионов, и именно в ЦОД-сегменте профиль основателей наиболее токсичен.

---

## 1. Vendor onboarding у UK-девелоперов и ЦОДов

### Утилиты и крупные девелоперы: Achilles UVDB
- Стандарт пре-квалификации поставщиков в UK utilities — **UVDB Powered by Achilles**: ~70 крупных закупщиков, включая **National Grid, SSE, UK Power Networks, Thames Water** ([Achilles UVDB](https://www.achilles.com/uvdb/); [буклет Achilles, февр. 2024](https://www.achilles.com/app/uploads/2023/05/AC1391-UVDB-Buyer-leaflet-update-Feb-2024-V2-1.pdf)).
- Процедура: регистрация, анкета, для рискованных категорий — аудит UVDB Verify (безопасность, качество, экология). **Явного фильтра по гражданству основателей в открытых описаниях нет** — «не нашёл» (это не значит, что его нет во внутренних KYC-модулях; анкеты включают раскрытие структуры собственности — допущение).
- Важно: UVDB актуален при продаже **сетевым компаниям/utilities**. Для продажи **девелоперам** (Field, Zenobe, Penso Power и т.п.) формализованного общего барьера не нашёл — у частных девелоперов onboarding легче (обычный procurement + InfoSec-анкета). Это согласуется с вводной («частные покупатели юридически доступны»).

### ЦОДы и гиперскейлеры
- Гиперскейлеры используют стандартные рамки вендорского security-скрининга: **SIG (до 1 200+ вопросов), CAIQ/CSA STAR** ([Bitsight: CAIQ vs SIG](https://www.bitsight.com/blog/caiq-vs-sig-top-questionnaires-vendor-risk-assessment); [Google Cloud SIG](https://cloud.google.com/security/compliance/sig)). Специфических опубликованных требований «происхождения» для поставщиков софта **не нашёл** (помечаю явно).
- Однако все три (MS/AWS/Google) полностью свернули бизнес в РФ и ведут сплошной санкционный скрининг контрагентов (структура владения, бенефициары). **Допущение (обоснованное):** вендор, где вся команда основателей — граждане РФ, при прочих равных проиграет тендер на security review у гиперскейлера; враждебного прецедента или успешного кейса **не нашёл** — публичных данных нет.
- Прецеденты отказов/успехов в UK proptech/constructiontech для РФ-фаундеров после 2022: **не нашёл ни того, ни другого** (целевой поиск дал только материалы об оттоке и о «компаниях, контролируемых из России» в негативном ключе — [openDemocracy](https://www.opendemocracy.net/en/dark-money-investigations/russia-controlled-british-companies-623/)). Отсутствие успешных публичных кейсов — само по себе слабый негативный сигнал.

### Банковский контур (из вводной, подтверждается)
- Де-рискинг задокументирован: массовые закрытия счетов россиянам без санкционного статуса, отказ банков объяснять причины ([W Legal](https://wlegal.co.uk/russians-sanctions-and-sars-are-the-uk-banks-getting-it-wrong/); [Global Banking & Finance Review](https://www.globalbankingandfinance.com/EU-BANKS-RUSSIANS-9426a32e-e2e0-40d9-9563-7357c95679d3/)). Для B2B-вендора это операционный риск (приём платежей, эскроу), даже при юрлице вне РФ.

**Итог блока:** юридического «нельзя» нет; практического «легко» — тоже нет. Продажа девелоперам средней руки — реалистична при чистой структуре (не-РФ юрлицо, локальный директор/фронт). Гиперскейлеры и utilities — считать закрытыми для холодного захода без референсов (допущение с высокой уверенностью).

---

## 2. Чувствительность ниши: данные о критической инфраструктуре

- Подачи Gate 2 содержат точки подключения, мощности, red line boundaries, сроки — типовые CNI-данные. Сегодня SaaS-вендор такого рода **не является** оператором существенных услуг по NIS Regulations 2018 напрямую.
- **Но вектор против:** Cyber Security and Resilience (NIS) Bill внесён в парламент **12 ноября 2025**; расширяет режим на **MSP, дата-центры, крупных load controllers** и вводит через вторичное законодательство обязанности OES управлять supply-chain-рисками поставщиков ([Clifford Chance, ноябрь 2025](https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2025/11/cyber-security-and-resilience--network-and-information-systems--.html); [Taylor Wessing](https://www.taylorwessing.com/en/insights-and-events/insights/2025/11/rd-uks-cyber-security-and-resilience-bill); [Commons Library CBP-10442](https://commonslibrary.parliament.uk/research-briefings/cbp-10442/)). То есть клиенты будут обязаны глубже проверять поставщиков — анкеты станут жёстче ровно в момент выхода вендора на рынок.
- **Аналогия Huawei:** механизм origin-based исключения в UK-праве существует и применён — designated vendor directions по Telecommunications (Security) Act 2021, направления 35 операторам, вынос Huawei из 5G к концу 2027 ([Designated Vendor Direction, gov.uk](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1110248/Final_Huawei_Designated_Vendor_Direction.pdf); [Computer Weekly](https://www.computerweekly.com/news/252509705/UK-government-enshrines-law-to-strip-out-high-risk-suppliers-tech-from-networks)). Аналогия **частичная**: режим сектор-специфичен (телеком), на софт для подач в NESO не распространяется. Но прецедент показывает: при эскалации государство умеет выключать вендора по стране происхождения, и покупатели это знают — закладывают в риск-оценку.
- NSI Act 2021: энергетика — в 17 секторах обязательной нотификации сделок; приобретатели из «враждебных» юрисдикций статистически чаще попадают под скрутиниз ([Ashurst quickguide](https://www.ashurst.com/en/insights/quickguide-uk-national-security-and-investment-control-regime/); [Charles Russell Speechlys по отчёту 2025-26](https://www.charlesrussellspeechlys.com/en/insights/expert-insights/corporate/2026/the-national-security-and-investment-act-five-years-on-what-the-2025-26-annual-report-tells-foreign-buyers/)). Прямо софт-вендора не касается, но осложняет будущие раунды/экзит с РФ-фаундерами в capтейбле — минус для «бизнеса ≥$10 млн» как инвест-кейса.

**Итог блока:** прямого запрета нет; регуляторный тренд — против; аналогия Huawei работает как риск-аргумент покупателя, не как норма.

---

## 3. Юнит-экономика

### Размер рынка (штуки и ГВт)
- До реформы: **739 ГВт** в очереди, **>1 700 заявок** только за 2023–24 ([NESO](https://www.neso.energy/neso-implements-electricity-grid-connection-reforms-unlock-investment-great-britain); [Greenberg Traurig, апр. 2025](https://www.gtlaw.com/en/insights/2025/4/uk-grid-connection-reforms-breaking-the-bottleneck)).
- Через G2TWQ оценено **~3 000 заявок**; продвинуто **283 ГВт** генерации+storage и **99 ГВт** demand; **>300 ГВт удалено** (результаты 8 декабря 2025: [NESO](https://www.neso.energy/neso-implements-electricity-grid-connection-reforms-unlock-investment-great-britain); [Energy Voice](https://www.energyvoice.com/renewables-energy-transition/586395/britain-drops-300-gw-from-grid-queue-as-neso-prioritises-ready-to-build-projects/)).
- Сейчас в TEC-реестре **1 720 проектов в очереди** (2 214 строк, срез 04.08.2026 — [Gridview connections queue](https://gridview.ai/connections-queue); первоисточник — [TEC Register NESO](https://www.neso.energy/data-portal/transmission-entry-capacity-tec-register)). Distribution-проекты добавляют ещё пул (точной цифры по embedded-реестру не нашёл — помечаю).
- Число подающих организаций: точной публичной цифры **не нашёл**. Ориентиры: RenewableUK — **~500 компаний-членов** ([RenewableUK](https://www.renewableuk.com/membership/)), а не «4000+» из формулировки задания — это опровержение внутренней предпосылки гипотезы. **Допущение:** за 1 700–3 000 проектами стоит порядка 400–800 организаций (крупные девелоперы держат десятки проектов).

### Ценовой якорь
- UK planning-SaaS (ближайший ценовой аналог): LandInsight **£2 500–6 000 за лицензию/год**, Nimbus Advanced **£3 000/год**, LandTech Unlimited **£3 620/год** ([LandTech pricing](https://land.tech/landinsight-pricing-plans)).
- Консультанты (Roadnight Taylor, TNEI): проектные ставки, публичных прайсов нет («не нашёл»); сетевые application fees — до **£7 880+VAT** за заявку ([Roadnight Taylor](https://roadnighttaylor.co.uk/archive/act-quickly-avoid-grid-application-fees/)) — косвенный потолок того, что рынок привык платить «за подачу».
- US-аналоги (Nira, Pearl Street) прайсы не публикуют («не нашёл»); Nira прибыльна с 2021, обслужила 500+ ГВт исследований ([Energize Capital](https://energizecap.com/insights/why-we-invested-in-nira-energy); [Canary Media](https://www.canarymedia.com/articles/transmission/its-hard-to-connect-clean-power-to-the-grid-new-software-can-help)).

### Расчёт потолка (все допущения помечены)
- Оптимистичный TAM UK: 3 000 проектов × £3 000/проект/год (допущение: чек на уровне planning-SaaS) = **£9 млн/год ≈ $11 млн** при 100% захвате. Через организации: 600 орг × £10 000 ACV = **£6 млн ≈ $7,5 млн**.
- Реалистичная доля нового вендора без UK-референсов через 2–3 года: 5–10% (допущение) → **$0,4–1,1 млн ARR**.
- Вывод: **UK-only рынок сам по себе меньше либо равен порогу $10 млн даже при захвате 100%**. Утверждение «юнит-экономика складывается в ≥$10 млн» на UK — опровергнуто. Порог достижим только: (а) с consulting-ставками (люди, не софт), (б) с ЦОД-demand-сегментом (fee £237,5–712,5 тыс./МВт делает ставки высокими, но клиентов мало и это самые закрытые покупатели), (в) с мульти-рынком (см. §6).

---

## 4. Канал продаж

- **Напрямую девелоперам** — единственный реалистичный канал для RF-профиля; RenewableUK (~500 членов) и Solar Energy UK — событийные площадки, а не канал дистрибуции. Цифра «~4000+ членов» не подтвердилась.
- **White label через консультантов** (Roadnight Taylor, TNEI, LCP Delta и юрфирмы Burges Salmon/Foot Anstey, активно ведущие практику connections) — логичный обход проблемы происхождения (бренд консультанта закрывает procurement). Но: консультанты сами монетизируют комплаенс руками и не мотивированы дефлировать свой биллинг (допущение, подтверждаемое тем, что TNEI продаёт «what to look out for in your Gate 2 offer» как услугу — [TNEI](https://www.tneigroup.com/news_event/tnei-on-grid-connections-reform-results-and-what-to-look-out-for-in-your-gate-2-offer/)).
- **Уже агрегируют клиентов конкуренты:** Yottar в партнёрстве с National Grid Electricity Distribution по connections intelligence ([Enlit](https://www.enlit.world/library/national-grid-taps-startup-for-connections-intelligence-as-uk-tackles-speculative-requests)); Gridview продаёт queue-аналитику по TEC ([Gridview](https://gridview.ai/)). Позиция «первого софта в нише» уже занята локальными игроками без токсичного профиля.

---

## 5. Скорость / окна

Хронология (все даты — источники):
- Окно подачи Gate 2 evidence **закрыто 26.08.2025** ([Foot Anstey](https://www.footanstey.com/our-insights/articles-news/neso-moves-the-goalposts-on-connections-reform/)).
- Результаты объявлены **08.12.2025** ([NESO](https://www.neso.energy/neso-implements-electricity-grid-connection-reforms-unlock-investment-great-britain)).
- Выдача Gate 2 офферов: транш за траншем до **30.09.2026** (пост-2030 проекты), Phase 1 distribution — до **30.11.2026** ([Burges Salmon](https://www.burges-salmon.com/articles/102lpup/neso-announces-grid-connections-reform-timeline/); [NESO timeline](https://www.neso.energy/industry-information/connections-reform/connections-reform-timeline)).
- Новое окно заявок — **H2 2026** ([NESO](https://www.neso.energy/industry-information/connections-reform/about-connections-reform)).
- Demand/ЦОД-реформа: консультация Ofgem с commitment fee **£237 500–712 500/МВт** открыта 29.07.2026, закрывается **16.09.2026**; заявки demand выросли с 41 до 125 ГВт за год, ≥80 ГВт — ЦОДы ([Ofgem](https://www.ofgem.gov.uk/press-release/ofgem-acts-free-grid-capacity-tackling-speculative-data-centre-projects); [DCD](https://www.datacenterdynamics.com/en/news/ofgem-proposes-commitment-fee-to-tackle-speculative-data-center-projects-in-uk-grid-connection-queue/)).

**Вывод:** пиковое разовое событие (массовая подача evidence) прошло за год до сегодняшней даты. Новый вендор с нуля успевает только к: окну H2 2026 (сроки продажи B2B в энергетике 6–12 мес — допущение, значит впритык/мимо), и к ongoing milestone-комплаенсу (M1–M10, ongoing land compliance — [NESO Gate 2 Criteria Methodology, 19.12.2025](https://www.neso.energy/document/375016/download); [Queue Management Guidance](https://www.neso.energy/document/294211/download)) — это «длинный хвост», признак сервисного бизнеса на сотни тысяч, не $10-миллионного SaaS.

---

## 6. Альтернативный клин: ЕС/США

- **США:** механика аналогична (readiness deposits, cluster studies, FERC Order 2023), но рынок занят прибыльными инкумбентами — **Nira Energy** (500+ ГВт исследований, прибыльна с 2021, стратегическое партнёрство с Energize Capital, май 2025 — [PRNewswire](https://www.prnewswire.com/news-releases/nira-energy-partners-with-energize-capital-to-scale-transmission-automation-software-302467710.html)) и **Pearl Street** (работает с Southern Company, SPP — [Canary Media](https://www.canarymedia.com/articles/transmission/its-hard-to-connect-clean-power-to-the-grid-new-software-can-help)). Для РФ-команды США дополнительно хуже UK по visa/санкционному климату (допущение). Клин не «легче», а тяжелее.
- **ЕС:** тренд тот же — «first ready, first served»: Германия вводит **Reifegradverfahren** с 01.04.2026 ([HSF Kramer](https://www.hsfkramer.com/notes/energy/2026-posts/from-first-come-to-first-ready-germanys-new-maturity-based-grid-connection-process-for-bess-and-large-scale-consumers)), Ирландия — connection windows EirGrid, ЕК выпустила European Grids Package **10.12.2025** и guidance по maturity-критериям ([EC](https://energy.ec.europa.eu/topics/infrastructure/european-grids_en); [Clean Energy Wire](https://www.cleanenergywire.org/factsheets/qa-eu-grid-package)). В очередях Европы **>1 700 ГВт** ([ess-news, 09.12.2025](https://www.ess-news.com/2025/12/09/energy-storage-europe-association-grid-connection-reform-priority-lanes-storage-flexible-connection-agreements-cable-pooling-hybrid-connections/)).
- **Переносимость механики: низкая.** Каждый режим — свои формы, свой регулятор, свой язык, свои milestone-определения (UK M1–M10 ≠ немецкий Reifegrad ≠ EirGrid windows). Переносится только «мета-компетенция» (парсинг форм + доказательная база + дедлайн-менеджмент), а контент — с нуля на страну (допущение, подтверждаемое различием документов). Это multi-country grind, а не репликация.
- Плюс: в ЕС климат к РФ-паспортам в банках/комплаенсе не мягче UK ([Global Banking & Finance Review](https://www.globalbankingandfinance.com/EU-BANKS-RUSSIANS-9426a32e-e2e0-40d9-9563-7357c95679d3/)). Единственное «окно» — Германия с апреля 2026 ещё не имеет очевидного нишевого SaaS-инкумбента (**не нашёл** такого — но и не искал глубоко; помечаю как открытый вопрос).

---

## Сводка по критерию фальсификации

| Подутверждение | Статус | Ключевой факт |
|---|---|---|
| «Частники готовы покупать у РФ-вендора» | Не опровергнуто юридически, не подтверждено ни одним прецедентом | Прецедентов «за» не нашёл; климат де-рискинга задокументирован |
| «ЦОДы/гиперскейлеры — покупатели» | Практически опровергнуто (допущение с высокой уверенностью) | SIG/CAIQ + санкционный скрининг + CSR Bill затягивает ЦОДы в NIS-режим |
| «Юнит-экономика ⇒ ≥$10 млн» | **Опровергнуто для UK-only** | Потолок TAM ≈ $7–11 млн при 100% захвата; реалистично $0,4–1,1 млн ARR |
| «Окна 2026–27 — наш момент» | **Опровергнуто наполовину** | Главное окно закрылось 26.08.2025; остались H2 2026 window + ЦОД-fee-реформа + milestone-хвост |
| «ЕС/США — запасной клин» | Опровергнуто для США (инкумбенты), под вопросом для ЕС (Германия 04.2026) | Nira/Pearl Street прибыльны и масштабируются; механика не переносится, только компетенция |

**Рекомендация для паспорта гипотезы:** критерий фальсификации сработал по экономике и таймингу. Если пивотить — то в (а) white-label под UK/EU консультантов (снимает вопрос происхождения, но урезает маржу и потолок), или (б) Германия/ЕС demand+BESS с апреля 2026 как первичный рынок. В текущей формулировке — **закрыть**.
