# Блок G — Бизнес-модель и проверка К3 «Уже платят»

Дата исследования: 2026-09-05. Все URL открыты 2026-09-05 (дата обращения одна для всех источников, далее не повторяется). Метод: веб-поиск (EN/ES) + чтение первички (пресс-релизы компаний, банков, юрфирм) и отраслевой прессы (Energy-Storage.News, ESS-News, El Periódico de la Energía, El Español, Modo Energy). Часть источников недоступна из песочницы (Rabobank — HTTP 403, Rödl — 503, Aurora PDF — 404, ignis.es — пусто); по ним использованы только сниппеты/вторичные пересказы и это помечено.

---

## 1. Вердикт К3

**К3 в буквальной формулировке («≥ 5 публично подтверждённых кейсов, где владелец BESS в Иберии платит оптимизатору / route-to-market провайдеру revenue-share или fee») — НЕ ПОДТВЕРЖДЕНО. Найдено 0 таких кейсов с раскрытой ставкой и 0 — даже без ставки.**

Что найдено вместо этого (все — 2025–2026, все — Испания, Португалия — ноль):

| # | Что есть | Кто платит кому | Это «владелец платит оптимизатору»? |
|---|---|---|---|
| 1 | Grenergy · Oviedo 150 MW / 600 MWh — 10-летний **financial tolling** с неназванной IG-utility (17.02.2026) | Utility платит владельцу фикс. capacity fee; **владелец сам оперирует и торгует** | Нет — обратное направление платежа |
| 2 | Grenergy · Escuderos 680 MWh (гибрид с 200 MW PV) — 12-летний financial tolling (27.04.2026) | То же | Нет |
| 3 | Engie ↔ Ignis · 625 MWh, 10 лет — «flexibility purchase agreement» на день-вперёд; Ignis оперирует и сам оптимизирует балансирующие рынки (06.07.2026) | Engie покупает гибкость DA; Ignis оставляет себе balancing | Нет — Ignis и есть свой оптимизатор |
| 4 | Return ↔ Engie · 55 MW / 220 MWh, 10 лет, **full tolling** (20–21.07.2026) | Engie платит Return фикс, Engie оптимизирует и забирает апсайд | Нет — это toll, Engie = трейдер-оффтейкер, не софт |
| 5 | Zelestra ↔ EDP · 170 MWp + 400 MWh — «solar-plus-storage PPA» / «PPA 2.0» (29.07.2025) | EDP покупает профилированную энергию | Нет — PPA, структура батарейной части не раскрыта |
| 6 | Grenergy · первый project finance stand-alone BESS в Испании, €100 млн, Santander + SMBC (22.07.2026) | Банки → SPV; опора на toll #1 | Не про оптимизатор |

Партнёрства/намерения (не контракты с владельцами): enspired ↔ Nexus Energía (28.07.2025, цель 300 MW в 2026), Entrix — выход в Иберию (27.10.2025, клиенты не названы), Capalo AI — планы на Испанию/Португалию в 2026, Axpo Iberia — предложение услуг, Bamboo Energy — SaaS + revenue share с ритейлерами (не с владельцами утилити-BESS).

**Ключевые факты:**
- Все 4 «настоящих» контракта Испании — это **tolling/offtake с utility-трейдером** (Engie, неназванная IG-utility), а не fee за софт-оптимизацию. Контрагенты выбираются по кредитному рейтингу («rated Investment Grade by Moody's») — банк смотрит на баланс оффтейкера, а не на бэктест.
- В financial toll (Grenergy) **владелец сам оперирует и торгует** («Grenergy will retain responsibility for operating the batteries and managing trading activities» — ESS-News, 27.04.2026). Расчёт по контракту идёт по «алгоритму оптимизации ex-post» (EY, 28.04.2026) — т.е. функция «эталонного оптимизатора/бэктеста» в этой структуре реально существует, но кто её выполняет — не раскрыто.
- Установленная база stand-alone BESS в Испании: **18 MW** (Modo, 03.06.2025); ~60 MW на апрель 2025 (Rabobank, по сниппету). Т.е. владельцев с работающими батареями 10–50 MW, которым можно продать оптимизацию «сегодня», почти нет; COD найденных сделок — 2027–2028.
- В Португалии контрактов с третьей стороной (toll / optimisation) **не найдено**: все проекты (EDP BigBATT 180 MW/360 MWh, Galp 60.5 MW/120 MWh, Prosolia 15 MW/60 MWh, Hyperion 16 MW/64 MWh) — PRR/Innovation Fund, самооперирование.
- Полезный контрфакт из Европы: реальные контракты «владелец → оптимизатор» с раскрытой структурой существуют вне Иберии: R.Power ↔ Axpo (Польша, 300 MW/1 200 MWh, до 2038, «reparto de beneficios … combinado con una garantía mínima de ingresos», 05.05.2026); Kyon ↔ enspired/Entrix (Германия, 24.10.2025); Danske Commodities Windyhill 400 MWh (UK, 10 лет, 27.02.2026); Statkraft ↔ Eku (UK, 23.04.2025). Ставки нигде не раскрыты.

**Итог: гипотеза «клиент платит долю от выручки, потому что без бэктеста банк не даёт PF» в Иберии сегодня не имеет ни одного публичного подтверждения. Банк дал первый PF под toll с IG-utility, а не под бэктест.**

---

## 2. Таблица кейсов Иберии (2023–2026)

| Дата | Стороны | Актив | Тип контракта | Срок / старт | Ставка | Источник |
|---|---|---|---|---|---|---|
| 17.02.2026 | Grenergy (владелец) ↔ «international utility rated Investment Grade by Moody's» | Oviedo (Asturias), 150 MW / 600 MWh (618 MWh), stand-alone | Financial tolling; Grenergy «retains responsibility for operations and battery trading management» | 10 лет, с 01.2028 | не раскрыта | grenergy.eu пресс-релиз; ESS-News 17.02.2026 |
| 27.04.2026 | Grenergy ↔ IG-utility (Moody's & S&P) | Escuderos (Castilla-La Mancha): 200 MW PV + 680 MWh BESS | Financial tolling; по El Español «cubre el spread sobre el 80 % de la capacidad total»; PV под 12-летним PPA с Galp (2020) | 12 лет, с 07.2028 | не раскрыта | grenergy.eu (503 при доступе), ESS-News 27.04.2026, El Español 06.05.2026 |
| 06.07.2026 | Engie ↔ Ignis | Портфель по Испании, 625 MWh, COD 2028 | «Long-term flexibility purchase agreement»: Engie получает гибкость DA-рынка на 10 лет, «IGNIS will secure the revenue generated by these assets… responsible for operating the facilities and optimizing its participation in balancing» | 10 лет | не раскрыта | Renewable Energy Magazine 06.07.2026; Energy-Storage.News 06.07.2026 |
| 20.07.2026 | Return (владелец/оператор) ↔ Engie | 3 проекта в Стране Басков, 55 MW / 220 MWh, COD конец 2027 | **Full tolling**: «ENGIE optimizará su capacidad de flexibilidad en los mercados mayoristas y servicios de ajuste»; Engie платит фикс и оставляет апсайд | 10 лет | не раскрыта | engie.es пресс-релиз 20.07.2026; Energy-Storage.News 21.07.2026 |
| 29.07.2025 | Zelestra ↔ EDP | Trujillo (Extremadura): 170 MWp PV + 400 MWh | Solar-plus-storage PPA («PPA 2.0»): «the battery can always be fully charged daily by the solar plant…» | не раскрыт | не раскрыта | Energy-Storage.News 29.07.2025 и 05.01.2026 |
| 22.07.2026 | Grenergy ↔ Santander + SMBC | Oviedo 618 MWh | Senior non-recourse PF €100 млн (+ кредитные линии), «first financing in Spain for a project of this kind»; юрист — Clifford Chance | тенор не раскрыт | — | grenergy.eu; cliffordchance.com 07.2026 |
| 06.01.2026 | BRUC ↔ Banco Cooperativo, Sabadell, BNP AM, EDC, Santander | Рефинансирование 858 MW PV, «up to 650 MW BESS co-location potential» | Рефинансирование PV-платформы | — | — | Energy-Storage.News 06.01.2026 |
| 09.04.2026 | Engie — покупка проектов Tarifa 200 MW/800 MWh и Álora 78 MW/312 MWh (Андалусия) | 278 MW / 1.1 GWh, COD 2028 | M&A; Engie будет оптимизировать сам | — | цена не раскрыта (EnkiAI: €240 млн, первичкой не подтверждено) | Mercom 09.04.2026 |
| 28.07.2025 | enspired ↔ Nexus Energía | — | Партнёрство: enspired = оптимизация, Nexus = representante / market agent (6 900 MW под представлением); цель «300 MW de BESS operativos en 2026» | — | модель оплаты не раскрыта; на сайте: «DA swaps and floors through our financing partners. Tolling is expected in the near future» | nexusenergia.com; ESS-News 28.07.2025; enspired-trading.com/bess-optimization-spain |
| 27.10.2025 | Entrix — выход в Испанию/Португалию | — | Намерение; клиенты в Иберии не названы | — | — | entrixenergy.com пресс-релиз |
| 2026 (план) | Capalo AI — вход в ES/PT | — | Намерение | — | — | Tech.eu 06.02.2026 |
| Португалия 2025–2026 | EDP BigBATT 180 MW/360 MWh; Galp 60.5 MW/120.4 MWh (4 площадки); Prosolia 15 MW/60 MWh; Hyperion 16 MW/64 MWh | гибриды/stand-alone | PRR / Innovation Fund, самооперирование; **сторонний оптимизатор/toll не найден** | — | — | ESS-News 01.08.2025; 22.07.2026; welectric 05.01.2026; Legal500 PT |

Не найдено (проверялось поиском, результатов с контрактами нет): Iberdrola, Endesa, Naturgy, Repsol, Acciona — контракты на оптимизацию чужих BESS; Statkraft Iberia (только собственные гибриды 14.26 MW/28.51 MWh и 2 stand-alone 90 MW/360 MWh); Shell Energy Europe, Danske Commodities, In Commodities, Flexcity, Habitat, Modo, Fluence, Wärtsilä, Tesla, Flower, Arenko, Kyon — в Иберии контрактов нет; Matrix Renewables (проекты 2×100 MW/400 MWh на разрешениях, оффтейка нет); Nexwell, Ingenostrum, Capital Energy, Turbo Energy, Iberblue, Q-Energy — нет.

---

## 3. Европейские бенчмарки ставок

Публичных ставок revenue-share по конкретным контрактам нет нигде в Европе — только структуры и иллюстрации.

| Параметр | Значение | Источник |
|---|---|---|
| Структуры контрактов (Европа) | «Profit Share: where optimiser takes a defined % of profits as a fee»; «Profit Share with Revenue Floor: with a higher % profit share fee to pay for the floor»; «Toll: where optimiser pays a fixed capacity fee in exchange for retaining all revenue»; «5-10 yr terms available across larger markets (e.g. GB, Germany, Benelux)» | Timera Energy, 08.07.2024 |
| Иллюстрация ставок (Германия) | Merchant: split 95:5 (владелец:оптимизатор); Floor: гарантия €80 000/MW + 75/25 сверх; Toll: €130 000/MW фикс на 5 лет — **иллюстративные, не рыночные** | The Mobility House, 09.04.2026 |
| Toll-цена в модели Aurora | «tolling agreement price of 126 €/kW/year as the average of upper and lower bound in their Base Case» — по сниппету поиска; PDF (Gazis, Renewable Storage Forum GR, 10.2025) недоступен (404). **Не верифицировано** | Aurora / renewablestorageforum.gr |
| Италия MACSE (сентябрь 2025) | 10 GWh законтрактовано по «EUR 12,959 per MWh per year, 65 % below Terna's reserve price», 15-летние контракты → для 4-часовой ≈ €51.8k/MW/год | M&A Community, 04.05.2026 |
| Выручка Германии | 2022 «surging above 200 €/kW/yr»; 2023 «130-180 €/kW/yr»; Q1 2024 «below 100 €/kW/yr» | Timera, 17.06.2024 |
| Выручка Германия / Франция (2025) | Германия gross ~€80 000/MW, арбитраж ~€70 000/MW; Франция merchant €110–115k/MW | Capstone DC, 24.11.2025 |
| GB выручка | 2024 £51k/MW/год; 2025 £72k/MW/год; «In a low-revenue year (~£40k/MW/yr), the floor ensures a minimum return, while in a strong year (~£70k/MW/yr), toll contracts offer stability» | Modo Energy, 29.10.2025 |
| GB wholesale+BM | £43 829/MW/год за 12 мес. до 04.2026 = 60 % выручки | Modo Energy, 05.2026 |
| Доля контрактованной мощности (Германия, пример PF) | Портфель 112 MW/238 MWh: 55 MW — 7-летний toll с Vattenfall, 57 MW merchant через terralayr LAYR; долг €60 млн, «seven-year mini-perm» (Commerzbank, ABN AMRO) | WFW, 26.01.2026 |
| Гибридная структура | «50 % tolling, 30 % DA swap, and 20 % fully merchant» (пример enspired); банки-партнёры: Santander, ING, Berenberg | enspired, 12.01.2026 |
| Испания — оценки выручки | «260k€/MW for 4-hour BESS was analyzed for 2024» (enspired, страница Spain); реальные 5 MW: ≈€134k/MW (4h) и €85k/MW (2h); бэктест до €250k/MW (2h); «+58 %» vs простые стратегии (Nexus/enspired, RENMAD 17–18.03.2026); Modo прогноз 4h stand-alone 2028: ~225 k€/MW/год (апрель 2026) vs ~190 (январь 2026) | enspired-trading.com; nexusenergia.com 03.2026; Modo 07.05.2026 |
| Испания — aFRR capacity | средние пики цен up-capacity: 2024 ~€26/MW/h → 2025 ~€13 → 1H2026 ~€9 → 2030 «below €5/MW/h»; «aFRR capacity prices are already cannibalising in mid-2026» | Modo Energy, 15.07.2026 |
| Испания — DA-свопы | «An exception is Spain, where such swaps have become accepted by lenders» (Ryan Alexander, enspired, PV Tech Power vol. 46) | IndexBox, 15.07.2026 (вторичка) |
| Испания — мощность и рынок | Capacity market: одобрен ЕК 28–29.05.2026, €9 000 млн / 10 лет (€900 млн/год), новые BESS — контракты «hasta 15 años», pay-as-bid | Modo (ES) 27.01.2026; Energy-Storage.News 02.06.2026 |

Вывод по ставкам: **типичный диапазон revenue-share оптимизатора в Европе 5–15 % — допущение** (единственная публичная цифра — иллюстративные 5 % у Mobility House; Timera подтверждает только форму «defined %» и что при floor доля выше). Toll-цены: публично только Италия MACSE (~€52k/MW/год для 4h, регулируемый аукцион) и неверифицированные 126 €/kW/год (Aurora, модельное допущение).

---

## 4. Требования банков к долгу под BESS (Испания и бенчмарк)

| Требование | Формулировка / число | Источник |
|---|---|---|
| Контрактованная доля | «for non-recourse project finance, the market generally wants to see 50 % to 60 % of the capacity rented out for five to seven years via a tolling agreement»; «Typical structures are 12-month merchant phases, then around 80 % tolling for five to seven years» | ESS-News, BBDF 2026 (01.04.2026; 31.03.2026) — спикеры Commerzbank, ABN AMRO, NORD/LB, Santander, Rabobank |
| Merchant без контракта | «a non-contracted strategy is not yet bankable» (Tim Koenemann, Commerzbank) | ESS-News 01.04.2026 |
| DSCR по траншам | toll-часть DSCR 1.15; merchant-часть DSCR 2.0 «to handle the volatility» | ESS-News 01.04.2026 |
| DSCR (US-бенчмарк) | Toll «1.20x P90 DSCR»; merchant «1.30–1.40x P50 DSCR or 1.10–1.15x P90 DSCR»; «Every senior lender in the first round requested a hedge layer before confirming a term» | Sunraise Capital, 24.06.2026 |
| Испания — что нужно банку | «un capacity fee que asegure la bancabilidad del proyecto»; «cuanto más sólidas sean las dos primeras capas [toll + capacity market], menor será la dependencia del proyecto de los ingresos merchant y mejor será el ratio de cobertura del servicio de deuda» | Ontier (P. Rubio), El Periódico de la Energía, 04.08.2026 |
| Испания — DSCR и прогнозы | банки требуют «la capacidad real del proyecto para cubrir el servicio de la deuda en escenarios conservadores y con la mayor proporción posible de ingresos previsibles o contratados»; сценарии P50/P10/P90; capacity market — «nueva pieza para la bancabilidad de las baterías, no la solución final» | AleaSoft, 08.06.2026; 24.04.2026 |
| Испания — FTA-механика | «El propietario del activo recibe un pago fijo periódico por disponibilidad (capacity fee) y, a cambio, transfiere al comprador el valor del despacho óptimo»; ODV считается «un algoritmo de optimización ejecutado ex-post sobre precios de mercado publicados»; fee «€/MW/año» | EY España, 28.04.2026 |
| Испания — первый PF | Grenergy Oviedo €100 млн, Santander + SMBC, senior non-recourse; Santander: «marks a turning point in the financing of energy storage in Spain»; предшествовал toll с IG-utility | grenergy.eu 22.07.2026; capital-riesgo.es |
| Испания — структуры в PF-сделках 2025 | Modo: в Испании и Италии выбранная структура — «PPAs/CfDs», в отличие от UK floors и DE tolling; Q1 2026: Spain 3 сделки, Portugal 3; из 10 раскрытых структур в Европе «five fully contracted», 3 merchant (DE, GR), 2 mixed | Modo Energy 03.2026; 23.04.2026 |
| «Одобренный оптимизатор» / независимый прогноз | Явного требования «approved optimiser» в публичных источниках по Испании **не найдено**. Косвенно: оптимизатор должен показать «real revenues… confirmed by an independent third party», AFRY даёт «bankable forecast» (enspired, 12.01.2026); Enertis Applus+ — «bankability reports… technical due diligence… for lenders» (30.01.2024) | enspired; Enertis |
| Португалия | «standalone BESS projects have so far relied more heavily on equity and EU level support (such as the Innovation Fund), as their business models depend on merchant revenues»; ~120 MW к середине 2025; аукцион 750 MVA в 2026 | Legal500 Portugal Renewable Energy guide 2025 |
| Рейтинговые агентства | Moody's: «using a contracted revenue model is the least risky approach… merchant revenue model brings volatility and regulatory risk» (2018, по пересказу Business Standard). Свежих критериев Fitch/S&P по BESS-PF в Испании **не найдено** | Business Standard (вторичка) |
| Недоступно | Rabobank «Backup power for Europe part 4: Spain» (403) — по сниппету: 60 MW установлено (04.2025), пайплайн 10.3 GW к 2029; Rödl BESS España (503) | — |

Итог: банки в Испании финансируют под **контрактованный capacity fee от кредитоспособного оффтейкера** (+ с 2026 — capacity market), а не под бэктест. Независимый прогноз (AleaSoft / AFRY / Aurora / Modo) и техническая DD (Enertis, DNV) — обязательные приложения, но это отчёты консультантов, а не «одобрение оптимизатора».

---

## 5. Консультанты по оценке доходов / гибкому доступу и порядок цен

| Игрок | Что делает для BESS в Иберии | Цена |
|---|---|---|
| AleaSoft (AleaStorage / AleaGreen) | «cálculo de ingresos y rentabilidad tanto en sistemas de baterías stand-alone como en soluciones híbridas»; сценарии P50/P10/P90, DSCR, участие в capacity auctions | не публикуется |
| Enertis Applus+ | >30 проектов гибридизации, >780 MWh в Испании (SIMUBATT+), «bankability reports», technical DD для lenders, technical advisor на financial close (Recurrent, Италия) | не публикуется |
| AFRY | «bankable forecast provider» (в связке с enspired для банков) | не публикуется |
| Modo Energy | Spain BESS Forecast (обновления 01/04/07.2026), бенчмарки, список испанских оптимизаторов (05.02.2026, paywall); тарифы Free / Business / Enterprise, «36-month contracts, paid annually», цены по запросу; Business даёт «License to include Modo Energy benchmarks and indices in contracts» | не публикуется |
| Aurora Energy Research | BatMAR (European Battery Markets Attractiveness Report), Iberia в покрытии | не публикуется |
| Timera, Baringa, Clean Horizon, DNV, G-advisory | Испанских BESS-кейсов с ценами не найдено; Clean Horizon (DE) — участник BBDF-панели | не публикуется |
| Nexus Energía (+ enspired) | representante / market agent + оптимизация; в марте 2026 показывали живой 5 MW-кейс | не публикуется |
| Bamboo Energy | «SaaS + revenue-sharing» для ритейлеров/агрегаторов; 10+ comercializadoras; утилити-BESS клиенты не названы | не публикуется |

**Порядок цен — допущение** (публичных прайс-листов нет ни у одного): независимый market/revenue report для банка — €25–80k one-off; подписка на прогнозы (Modo/Aurora/AleaSoft) — €20–80k/год за рынок; технический bankability-отчёт (Enertis/DNV) — €30–100k. Метод: экспертная оценка по аналогам PPA-рынка; требует проверки 2–3 запросами КП.

---

## 6. Варианты монетизации оптимизатора (с примерами и оценкой для Иберии)

| Вариант | Кто платит, когда | Плюсы | Минусы | Примеры |
|---|---|---|---|---|
| (a) Прямая: SaaS / revenue-share с владельцем, торгует сторонний representante | Владелец, ежемесячно с выручки | Асимметрично выгодна владельцу, низкий CAPEX клиента | В Испании обязателен representante/market agent (Nexus, Axpo, Engie…); у них уже есть свой софт (Nexus+enspired); банк не видит ценности без floor; база работающих 10–50 MW BESS ≈ 0 до 2027 | Kyon ↔ enspired/Entrix (DE); Danske ↔ Windyhill (UK); в Иберии — **нет** |
| (b) White-label через трейдера/representante | Трейдер платит лицензию/долю | Один канал → много активов; трейдер несёт кредитный риск и compliance | Маржа делится; трейдер может заменить; Nexus уже занят enspired, Engie/Axpo — свои десктопы | enspired ↔ Nexus (ES); Capalo ↔ D.TRADING (Балканы, 03.09.2026: «merchant, floor-and-upside-share, tolling») |
| (c) Расчёт гибкого доступа / бэктест / ODV для банка или для FTA-расчётов (one-off консалтинг) | Владелец или банк, единоразово при FID/при расчётах по FTA | Спрос есть сейчас (все сделки на стадии FID 2026–2027); низкий барьер | Рынок консультантов уже занят (AleaSoft, Enertis, AFRY, Modo); низкий LTV; репутационный барьер «независимости» | EY описывает ODV-алгоритм ex-post; Enertis 30+ проектов |
| (d) Floor + share | Оптимизатор гарантирует floor, забирает бо́льшую долю сверху | Единственная структура, которую банк «видит» из merchant-мира | Требует баланса/кредитной поддержки → нужен партнёр-трейдер (D.TRADING, Axpo) | R.Power ↔ Axpo (PL); Entrix «FloorPlus»; enspired «floors through our financing partners» |
| (e) Собственный трейдинг / toll | Оптимизатор становится оффтейкером | Максимальная маржа, банк доволен | Лицензия market agent в OMIE/REE, залоги, капитал, IG-рейтинг — недостижимо для софт-стартапа | Engie ↔ Return, Engie ↔ Ignis, Grenergy ↔ IG-utility |

Рекомендация: **не (a)**. Реалистичный вход — **(c) как клин** (расчёт ODV/бэктеста под FTA и под capacity-market участие для девелоперов 10–50 MW, у которых нет своего трейдинг-деска) с переходом к **(b)/(d) через партнёра-трейдера** (Axpo Iberia, Nexus, Engie уже заняты; кандидаты — независимые representantes второго эшелона, Capalo-подобные). Прямой revenue-share с владельцем в Иберии в 2026–2027 — без публичных прецедентов.

---

## 7. Параметры для финмодели

| Параметр | Значение | Основание |
|---|---|---|
| Revenue-share оптимизатора (merchant, без floor) | 5–10 % (базово 7 %) | **Допущение**; иллюстрация 5 % — Mobility House 09.04.2026; форма «defined %» — Timera 07.2024 |
| Revenue-share при floor | 15–30 % сверх floor (иллюстрация 25 %) | Mobility House (иллюстрация); **допущение** |
| Выручка BESS Испания, 4h | 2024: до €260k/MW (enspired, анализ); реальные 5 MW 2025–26: €134k/MW (4h), €85k/MW (2h); прогноз 2028: ~€190–225k/MW/год (Modo); риск: aFRR capacity → <€5/MW/h к 2030 | enspired; Nexus/enspired 03.2026; Modo 05.2026, 07.2026 |
| Средний размер актива в сегменте | 10–50 MW: Return — 3×~18 MW; FRV — 18–57 MW площадки; Statkraft stand-alone 2×45 MW; Galp 14 MW; медиана для модели **25 MW / 4h — допущение** | engie.es 07.2026; Energy-Storage.News 23.02.2026; ESS-News 24.07.2026 |
| Длина цикла продаж | Toll → PF у Grenergy: 17.02.2026 → 22.07.2026 = 5 мес.; COD 2027–28; для софт-контракта **9–18 мес. — допущение** (решение привязано к FID) | grenergy.eu |
| Срок контракта / отток | Контракты оптимизации в Европе 3 года (Danske ↔ Welkin Mill, 19.03.2024) — 10 лет (Danske ↔ Windyhill, 27.02.2026); toll 7–12 лет. Отток **10–15 %/год — допущение** | danskecommodities.com; WFW |
| Стоимость привлечения | **Допущение**: €50–120k на контракт (полевые продажи в Мадриде, 2–3 конференции/год: RENMAD, Solarplaza BESS Iberia, участие в DD) | — |
| Адресуемая база | Установлено stand-alone 18 MW (06.2025); PERTE/€700 млн → 2.5–3.5 GW, >100 проектов; пайплайн 10.3 GW к 2029; capacity market €900 млн/год с 2026 | Modo 06.2025; Energy-Storage.News; Rabobank (сниппет); Modo 01.2026 |
| Обязательные затраты клиента рядом с оптимизатором | Representante fee (не публикуется — **допущение** 1–3 % выручки или €/MWh), независимый прогноз €25–80k, техническая DD €30–100k | см. §5 |

---

## 8. «Что говорит против»

1. **Ноль публичных контрактов «владелец → оптимизатор» в Иберии.** Все 4 контракта 2026 г. — toll/flexibility purchase с utility-трейдерами; фраза «rated Investment Grade by Moody's» повторяется в каждом пресс-релизе Grenergy — банку нужен баланс, не алгоритм.
2. **Владельцы крупных проектов оставляют торговлю у себя.** Grenergy: «retain responsibility for operations and battery trading management»; Ignis: «responsible for operating the facilities and optimizing its participation in balancing». Т.е. девелоперы верхнего эшелона строят in-house.
3. **Route-to-market в Испании требует representante/market agent** (Nexus: 6 900 MW под представлением). Софт без лицензии не может быть «route-to-market» — только поставщиком трейдеру. Нишу «софт + representante» уже заняли enspired ↔ Nexus (07.2025), Entrix (10.2025), Axpo Iberia; Engie покупает проекты и оптимизирует сам (278 MW/1.1 GWh, 04.2026).
4. **Банки требуют контрактованные потоки, не бэктест:** «a non-contracted strategy is not yet bankable» (Commerzbank); Ontier: нужен «capacity fee que asegure la bancabilidad». Единственный признанный в Испании merchant-инструмент — DA-swap от трейдера («swaps have become accepted by lenders»), что опять требует баланса.
5. **Установленная база мала:** 18–60 MW stand-alone в 2025; COD найденных сделок — 2027–2028. Продавать оптимизацию «работающих» батарей 10–50 MW в 2026 некому; спрос сдвигается на 2027+.
6. **Сжатие premium-потоков:** Modo (07.2026): aFRR capacity-цены «already cannibalising», прогноз <€5/MW/h к 2030 → доля выручки, где «умный» оптимизатор даёт альфу над простыми стратегиями, сокращается; capacity market (€/MW/год) и toll не зависят от качества алгоритма.
7. **Модо/Aurora/AleaSoft/Enertis** уже закрывают потребность банка в «независимом прогнозе» — бэктест стартапа не заменит независимый отчёт для кредитного комитета.
8. **Португалия** — рынок ещё без stand-alone PF: «relied more heavily on equity and EU level support» (Legal500).

Что говорит «за» (для честности): нужен кто-то, кто считает ODV/ex-post алгоритм в FTA (EY) — это софт-функция; Nexus/enspired показали «+58 %» от многорыночной оптимизации на реальных 5 MW; capacity market с контрактами до 15 лет расширит PF-рынок, и владельцам 10–50 MW без трейдинг-деска нужен будет партнёр.

---

## 9. Источники (все открыты 2026-09-05)

Первичные (компании, банки, юрфирмы, регуляторы):
- Grenergy, 17.02.2026 — 10-летний FTA Oviedo: https://grenergy.eu/grenergy-signs-a-10-year-financial-tolling-agreement-for-its-stand-alone-battery-project-in-oviedo/
- Grenergy, 22.07.2026 — PF €100 млн Santander + SMBC: https://grenergy.eu/grenergy-secures-the-first-financing-for-a-stand-alone-battery-energy-storage-project-in-spain-worth-e100-million/
- Grenergy, 04.2026 — 12-летний FTA Escuderos (503 при доступе; см. ESS-News): https://grenergy.eu/grenergy-signs-a-12-year-financial-tolling-agreement-for-energy-storage-in-spain/
- Clifford Chance, 07.2026: https://www.cliffordchance.com/news/news/2026/07/clifford-chance-advises-grenergy-on-the-first-financing-of-a-stand-alone-battery-energy-storage-project-in-spain.html
- Capital-Riesgo.es (Santander CIB): https://capital-riesgo.es/en/articles/santander-cib-supports-grenergy-on-spain-s-first-financing-for-a-stand-alone-battery-energy-storage-project/
- ENGIE España, 20.07.2026 — Return ↔ ENGIE full tolling: https://www.engie.es/return-y-engie-sellan-un-acuerdo-pionero-a-diez-anos-para-impulsar-la-inversion-en-almacenamiento-de-baterias-en-espana/
- IGNIS, 07.2026 (страница вернулась пустой): https://ignis.es/en/engie-and-ignis-sign-a-long-term-agreement-for-battery-energy-storage-in-spain/
- Nexus Energía — альянс с enspired: https://www.nexusenergia.com/noticias/nexus-energia-y-enspired-llegan-a-una-alianza-estrategica-para-liderar-el-mercado-de-optimizacion-de-activos-de-almacenamiento-renovable-en-espana/
- Nexus Energía, RENMAD 03.2026: https://www.nexusenergia.com/blog/notas-de-prensa/nexus-energia-y-enspired-muestran-como-integrar-baterias-de-forma-rentable-en-el-mercado-espanol-en-renmad-almacenamiento-2026/
- enspired — Spain page: https://www.enspired-trading.com/bess-optimization-spain
- enspired, 12.01.2026 — bankable optimizer: https://www.enspired-trading.com/blog/secure-bess-financing-with-a-bankable-optimizer
- enspired, 16.06.2026 — BESS in Spain: financing: https://www.enspired-trading.com/blog/bess-in-spain-financing-revenues-co-location-ai
- Entrix, 27.10.2025 — Iberia entry: https://entrixenergy.com/en/cases/press-release-iberia-market-entry ; https://www.entrixenergy.com/en/entrix-spain
- Statkraft UK, 23.04.2025 — Eku Energy: https://www.statkraft.co.uk/newsroom/2025/statkraft-signs-trading-and-optimisation-services-agreement-with-eku-energy/
- Danske Commodities, 19.03.2024 — Welkin Mill: https://www.danskecommodities.com/about/media/danske-commodities-signs-optimisation-agreement-for-battery-storage-asset-in-the-uk
- WFW, 26.01.2026 — Commerzbank/ABN AMRO German BESS portfolio: https://www.wfw.com/press/wfw-advises-commerzbank-ag-and-abn-amro-on-german-bess-portfolio-financing/
- EY España, 28.04.2026 — Valoración de FTA: https://www.ey.com/es_es/the-cfo-agenda/valoracion-fnancial-tolling-agreements-sobre-almacenamiento-energetico
- Enertis Applus+, 30.01.2024: https://www.enertisapplus.com/enertis-applus-provides-technical-advisory-services-for-hybrid-renewables-plus-battery-projects-in-spain-totaling-more-than-780-mwh/
- Bamboo Energy: https://bambooenergy.tech/
- Modo Energy pricing: https://modoenergy.com/pricing
- Legal500 Portugal Renewable Energy 2025: https://www.legal500.com/guides/chapter/portugal-renewable-energy/
- Gore Street Capital, 09.01.2025 — Iberia intro: https://www.gorestreetcap.com/blog/introduction-to-battery-energy-storage-markets-spain-and-portugal-the-iberian-grid/

Аналитика / консультанты:
- Modo Energy, 03.06.2025 — Why no batteries in Spain: https://modoenergy.com/research/en/jun-2025-iberia-spain-bess-battery-energy-storage-buildout-capex-hydro-transmission-solar-prices
- Modo Energy, 07.05.2026 — Spain forecast Apr-26: https://modoenergy.com/research/en/spain-bess-forecast-april-2026
- Modo Energy, 15.07.2026 — Spain forecast Jul-26: https://modoenergy.com/research/en/spain-bess-forecast-jul-26
- Modo Energy, 27.01.2026 — Spain capacity market (ES): https://modoenergy.com/research/es/spains-upcoming-capacity-market-what-we-know-so-far
- Modo Energy, 03.2026 — European BESS financing report 2025: https://modoenergy.com/research/en/march-2026-europe-battery-financing-deal-report-2025
- Modo Energy, 23.04.2026 — Capital Markets Q1 2026: https://modoenergy.com/research/european-bess-capital-markets-report-q1-2026
- Modo Energy, 29.10.2025 — De-risking GB returns: https://modoenergy.com/research/en/gb-battery-energy-storage-derisking-returns-revenues-great-britain-offtake-ldes-p462-q3-2025
- Modo Energy, 05.02.2026 — Spanish optimisers list (paywall): https://modoenergy.com/research/battery-energy-storage-optimizers-contact-list-iberia
- Modo Energy (ES), 04.09.2025 — ERCOT offtake explainer: https://modoenergy.com/research/es/battery-bess-offtake-tolling-agreements-route-market-contracts-ercot-explainer-part-one
- Timera Energy, 08.07.2024 — European BESS offtake & financing: https://timera-energy.com/blog/european-bess-offtake-financing-state-of-play/
- Timera Energy, 17.06.2024 — German BESS: https://timera-energy.com/blog/5-takeaways-on-german-bess-investment/
- The Mobility House, 09.04.2026 — Revenue models: https://mobilityhouse-energy.com/int_en/knowledge-center/article/revenue-models-bess
- Pexapark — BESS offtake & optimization agreements: https://pexapark.com/what-are-bess-offtake-and-optimization-agreements/
- Capstone DC, 24.11.2025: https://capstonedc.com/insights/europes-battery-storage-edge/
- M&A Community, 04.05.2026 — BESS paradox (MACSE): https://mnacommunity.com/europe-bess-market-2026/
- Sunraise Capital, 24.06.2026 — BESS PF underwriting: https://sunraisecapital.com/blog/standalone-battery-storage-project-finance-underwriting-2026
- AleaSoft, 08.06.2026: https://www.diariosigloxxi.com/texto-diario/mostrar/5911420/aleasoft-mercado-capacidad-nueva-pieza-bancabilidad-baterias-no-solucion-final ; 24.04.2026: https://www.emprendedores.es/noticias-de-empresa/aleasoft-de-las-previsiones-de-mercado-a-la-bancabilidad-un-cambio-estructural-en-el-sector-electrico/
- Aurora (сниппет; PDF 404): https://renewablestorageforum.gr/wp-content/uploads/2025/10/Gazis.pdf
- Rabobank (403): https://www.rabobank.com/knowledge/d011476239-backup-power-for-europe-part-4-spain-s-bess-market-is-heating-up
- Rödl (503): https://www.roedl.es/es/articulos/blog2026/mercado-battery-energy-storage-systems-bess-espana

Пресса:
- Energy-Storage.News, 21.07.2026 — Return/Engie, EnBW/Zelestra: https://www.energy-storage.news/return-and-engie-enbw-and-zelestra-agree-long-term-bess-tolls-in-spain-italy/
- Energy-Storage.News, 06.07.2026 — Engie/Ignis: https://www.energy-storage.news/engie-agrees-offtake-deal-developer-625mwh-spain-bess-flexibility-floor-toll/
- Renewable Energy Magazine, 06.07.2026 — Engie/Ignis: https://www.renewableenergymagazine.com/storage/engie-and-ignis-sign-a-longterm-agreement-20260706
- Energy-Storage.News, 28.04.2026 — Grenergy 680 MWh toll: https://www.energy-storage.news/grenergy-signs-12-year-toll-for-680mwh-spain-bess/
- ESS-News, 27.04.2026: https://www.ess-news.com/2026/04/27/grenergy-signs-12-year-tolling-deal-for-spanish-hybrid-project-with-680-mwh-bess/
- ESS-News, 17.02.2026: https://www.ess-news.com/2026/02/17/grenergy-inks-10-year-tolling-deal-for-spains-biggest-battery/
- Energy-Storage.News, 29.07.2025 — Zelestra/EDP PPA: https://www.energy-storage.news/edp-developer-zelestra-sign-spains-first-solar-plus-storage-ppa/ ; 05.01.2026: https://www.energy-storage.news/zelestras-solar-plus-storage-spain-offtake-deal-is-ppa-2-0-firm-says/
- Energy-Storage.News, 02.06.2026 — EU approves Spain capacity market: https://www.energy-storage.news/eu-approves-spain-euro-9-billion-capacity-market-generation-demand-response-energy-storage/
- Energy-Storage.News, 23.02.2026 — FRV 1.2 GW: https://www.energy-storage.news/frv-set-for-1-2gw-5gwh-bess-rollout-in-spain/
- Energy-Storage.News, 06.01.2026 — BRUC: https://www.energy-storage.news/2025-concludes-with-1-5gwh-of-european-bess-project-completions-financing-and-supply-deals/
- Energy-Storage.News, 04.08.2026 — Prosolia/EDP: https://www.energy-storage.news/prosalia-and-edp-hybridise-solar-pv-wind-projects-with-batteries-in-portugal-spain/
- ESS-News, 01.04.2026 — BBDF: financing standalone vs co-located: https://www.ess-news.com/2026/04/01/bbdf-2026-how-financing-standalone-vs-co-located-projects-really-works/ ; 31.03.2026: https://www.ess-news.com/2026/03/31/bbdf-2026-finance-tolling-and-getting-the-merchant-balance-right/
- ESS-News, 28.07.2025 — enspired Spain/Poland: https://www.ess-news.com/2025/07/28/enspired-expands-battery-storage-optimization-to-spain-and-poland/
- ESS-News, 24.10.2025 — Kyon: https://www.ess-news.com/2025/10/24/kyon-energy-chooses-two-energy-optimizers-for-their-upcoming-battery-energy-storage-systems/
- ESS-News, 03.09.2026 — D.TRADING/Capalo: https://www.ess-news.com/2026/09/03/d-trading-capalo-ai-to-offer-bankable-bess-revenue-deals/
- ESS-News, 01.08.2025 — KKR/Greenvolt, Galp: https://www.ess-news.com/2025/08/01/iberian-storage-news-kkr-iinjects-e150m-into-greenvolt-for-battery-projects-galp-deploys-147-mwh-in-iberia/
- ESS-News, 22.07.2026 — Prosolia/Grenergy: https://www.ess-news.com/2026/07/22/prosolia-grenergy-advance-battery-storage-projects-in-portugal-and-spain/
- ESS-News, 24.07.2026 — Statkraft/Aquila: https://www.ess-news.com/2026/07/24/statkraft-aquila-advance-hybrid-bess-projects-in-spain/
- El Periódico de la Energía, 05.05.2026 — R.Power/Axpo (Польша): https://elperiodicodelaenergia.com/r-power-y-axpo-firman-uno-de-los-mayores-acuerdos-de-optimizacion-de-almacenamiento-en-baterias-de-europa
- El Periódico de la Energía, 04.08.2026 — Ontier, tolling y mercado de capacidad: https://elperiodicodelaenergia.com/tolling-agreements-y-mercado-de-capacidad-las-dos-caras-de-la-bancabilidad-del-almacenamiento-en-espana
- El Español, 06.05.2026 — peaje financiero/tollings: https://www.elespanol.com/invertia/empresas/energia/20260506/acuerdos-peaje-financiero-tollings-autoconsumo-remoto-nuevas-figuras-inversion-baterias-rentables/1003744233866_0.html
- Mercom, 09.04.2026 — Engie Andalusia: https://mercomcapital.com/engie-acquires-1-1-gwh-battery-storage-projects-in-spain/
- IndexBox, 15.07.2026 (пересказ PV Tech Power vol. 46): https://www.indexbox.io/blog/route-to-market-strategy-becomes-key-factor-in-bess-project-financing/
- Tech.eu, 06.02.2026 — Capalo €11M: https://tech.eu/2026/02/06/capalo-ai-raises-eur11m-to-expand-battery-storage-optimization/
- welectric, 05.01.2026 — Portugal Hyperion: https://welectric.news/2026/01/05/portugal-launches-first-battery-energy-storage-projects/

---

## 10. Открытые вопросы

1. Кто контрагент Grenergy по обоим FTA (utility «IG by Moody's/S&P») и какая ставка €/MW/год — раскрытие возможно в отчётности Grenergy за 2026 (годовой отчёт / инвестор-презентация).
2. Кто считает ex-post ODV в испанских FTA (EY описывает механику, исполнитель не назван) — это прямой запрос к EY/Grenergy/Engie; потенциально первая монетизируемая роль софта.
3. Реальные fee representante в Испании (Nexus, Axpo) и доля enspired в альянсе с Nexus — только интервью.
4. Есть ли у Modo «Who are the Spanish optimisers» (05.02.2026, paywall) список с законтрактованными MW — купить/запросить.
5. Условия PF Grenergy (тенор, DSCR, доля merchant) — Santander/SMBC/Clifford Chance не раскрыли.
6. Португалия: результаты аукциона 750 MVA (2026) и появление первого stand-alone PF — отслеживать.
7. Rabobank «Spain's BESS market is heating up» и Rödl BESS España — не открылись; перепроверить с другого доступа (могут содержать оценки fee и требований банков).
8. Aurora BatMAR: реальные toll-цены по Испании (126 €/kW/год — модельное допущение для Греции, не Иберии) — запросить у Aurora.
9. Переход OMIE на 15-минутный MTU и его влияние на «альфу» оптимизатора — количественных оценок для Испании в открытых источниках не найдено (в этом блоке не проверялось глубоко).
