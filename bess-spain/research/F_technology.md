# Блок F «Технология» — кабинетная часть

**Гипотеза:** софтверный ИИ-оптимизатор диспетчеризации BESS 10–50 МВт в Испании (прогноз 15-мин цен DA/ID, стекинг DA + intraday continuo + aFRR/mFRR, учёт ограничений гибкого доступа к сети). Заказчик — софтверная студия без доменной экспертизы в энергетике.

Дата исследования: 2026-09-05. Все обращения к источникам — 2026-09-05, если не указано иное. Бэктест на ценах OMIE и замер солвера делаются отдельно; здесь — только кабинетная часть.

Условные обозначения: **[Д]** — допущение (число/оценка автора без внешнего источника); **не найдено** — публично проверить не удалось.

---

## 1. Резюме и главные технические риски

**Что подтвердилось.**

1. **Данные для прогноза и бэктеста доступны бесплатно и машиночитаемо.** OMIE публикует 15-минутные цены day-ahead (`marginalpdbc_YYYYMMDD.1`, 96 периодов — проверено на файле за 2026-09-04) и агрегаты intraday continuo (`precios_pibcic`, эмиссия ~03:11 следующего дня) в виде `;`-разделённых txt-файлов; ESIOS (REE) отдаёт через REST/JSON по персональному токену все балансирующие цены (aFRR banda — ID 634/2130, энергия aFRR — 682/683, mFRR — 2197/676/677, desvíos — 686/687, RR — 1782, спрос — 1293/1775) в 15-минутном разрешении (с 24.05.2022). ENTSO-E — дубль/кросс-чек (400 запросов/мин на токен). Погода — ECMWF open data (IFS/AIFS 0,25°, CC-BY-4.0, задержка 7–9 ч) и Open-Meteo ($29–99/мес за коммерческую лицензию).
2. **Точность прогноза DA-цен в литературе ограничена и «плато» достигнуто давно.** В открытом бенчмарке Lago et al. (2021) лучшие модели (DNN-ансамбль) дают rMAE 0,38–0,57 (т. е. на 43–62 % лучше наивного прогноза «цена = вчера/неделю назад»), sMAPE 4,9–14,2 % в зависимости от рынка; LEAR (LASSO-регрессия) отстаёт всего на 2–5 п. п. Для Испании отдельные работы 2025 г. сообщают MAE ≈ 10,9 €/МВтч (rMAE ≈ 35 % от наивного) — сопоставимо. Вывод: «ИИ» здесь — не дифференциатор, важнее ранговая точность (порядок дорогих/дешёвых интервалов), ансамбли, честный тест ≥ 1–2 лет и DM-тест.
3. **Доля от perfect-foresight выручки.** Академические работы: прогноз с ранговой корреляцией τ ≥ 0,85–0,95 даёт 97–100 % perfect-foresight, персистентность — 33 % (Falezza, 2026, DE/CH). Практика: Infradebt (дек. 2025) по австралийскому NEM — реально наблюдаемые 60–80 % при заложенных в финмодели 80–90 %. Для бизнес-кейса разумный диапазон **65–85 %** [Д].
4. **EMS-интеграция технически стандартна, но организационно тяжёлая.** Все крупные EMS/PPC (Wärtsilä GEMS, Sungrow EMS3000, Ingeteam INGECON SUN PPC / INGESAS IC3, Huawei Smart String ESS) поддерживают Modbus TCP и IEC 60870-5-104 (у части — IEC 61850, DNP3, OPC UA); GEMS дополнительно имеет REST + WebSocket API. **Открытых публичных API «для стороннего оптимизатора» ни у кого не найдено** — интеграция всегда проектная (register map / точки IEC 104 согласуются с EPC/вендором).
5. **Подача заявок на рынок — только через representante/трейдера.** Публичных API у Nexus Energía, Axpo Iberia, Statkraft, Acciona, Audax не найдено; реальная модель на рынке — разделение ролей «оптимизатор + representante» (enspired + Nexus Energía, июль 2025: enspired — стратегия и торговля, Nexus — представление на OMIE/REE, центр управления, преквалификация, зона регулирования для aFRR/mFRR).
6. **Солверы — не узкое место.** Задача 96×2 суток × 3 рынка с бинарными переменными — малый MILP; HiGHS (open source) на MIPLIB-бенчмарке Mittelmann (07.2026) решает 158–179 из 240 «тяжёлых» инстансов и в ~10× медленнее Gurobi, чего для задачи такого размера более чем достаточно [Д, подтверждается замером].

**Главные технические риски (ранжированы).**

| # | Риск | Серьёзность | Комментарий |
|---|------|-------------|-------------|
| R1 | **Нет пути к рынку без representante с зоной регулирования** — aFRR/mFRR требуют преквалификации и «zona de regulación», которой у софтверной студии нет | Критический | Модель бизнеса обязана быть «оптимизатор при трейдере» (как enspired+Nexus), иначе стек рынков сводится к DA/ID |
| R2 | **Доступ к EMS-командам** — каждый актив = отдельная проектная интеграция (Modbus/IEC 104 register map, VPN, кибербезопасность IEC 62443), одобрение вендора/EPC, гарантийные ограничения батареи | Высокий | S/M/L-оценка в разд. 8; первый актив — L, далее M |
| R3 | **Точность прогноза не даёт устойчивого преимущества** над LEAR-уровнем; конкуренты (enspired, Entrix, Capalo, Fluence Mosaic) уже имеют > 1 ГВт под управлением и годы данных | Высокий | Дифференциация — не «ИИ», а деградация/гарантия, ограничения сети, UX для владельца |
| R4 | **Ограничения гибкого доступа к сети** для хранения ещё не оформлены: e-distribución прямо пишет, что заявки на хранение «не могут быть обработаны как гибкий спрос — ждём регуляторного развития»; карты REE для спроса появились только 20.02.2026 | Средний | Функция «учёт гибкого доступа» пока моделируется как статические/временные лимиты P_max(t) [Д] |
| R5 | **Лаги и ненадёжность публикации** (ESIOS D+1 c 16:30; ECMWF 7–9 ч; OMIE ID-агрегаты ~03:11 D+1; пересчёты/версии файлов) | Средний | Нужен слой валидации и «холодные» fallback-прогнозы |
| R6 | Лицензии данных: OMIE — свободно с указанием источника, без явного разрешения на коммерческое использование; ESIOS — условия не найдены | Низкий-средний | Уточнить письмом в OMIE/REE перед коммерческим запуском |

---

## 2. Данные и API

| Источник | Что даёт | Доступ / формат | Разрешение, лаг публикации | Лимиты / лицензия | Проверено |
|---|---|---|---|---|---|
| **OMIE — публичные файлы** (`omie.es/es/file-access-list`) | `marginalpdbc_YYYYMMDD.v` — маргинальные цены DA (ES/PT); `precios_pibcic` — max/min/средневзв. цены intraday continuo по периодам; `curva_pbc_YYYYMMDD.v` — агрегированные кривые DA (без юнитов; с юнитами — `curva_pbc_uof` через 90 дней конфиденциальности); `curva_pibc` — кривые ID-аукционов; `trades` — сделки SIDC; `pibcic_tot` — итоги SIDC | Прямое скачивание `https://www.omie.es/es/file-download?parents%5B0%5D=<каталог>&filename=<файл>`; txt, разделитель `;`, десятичный разделитель `,` (в marginalpdbc — `.`), заголовок + строки + `*` | DA: gate closure 12:00 CET, публикация ≈13:00 после валидации OS; 15-мин периоды с 1.10.2025 (SDAC 15-min MTU) — файл за 2026-09-04 содержит 96 строк; `precios_pibcic` за 03.09.2026 эмитирован 04.09.2026 03:11 | Aviso legal: информация «puede ser utilizada libremente… siempre que se respete íntegramente su contenido original», обязательна ссылка на источник; явного разрешения коммерческого использования нет | Формат-спецификация v1.35 (июнь 2024, до перехода на 15 мин); живые файлы 2026-09-05 |
| **ESIOS / REE API** (`api.esios.ree.es`) | ~1 981 индикатор (список получен 2026-09-05). Ключевые ID: 600 precio mercado SPOT diario; 612–618 ID-сессии (устар. аукционы); 1727 precio de referencia MIC (intraday continuo); **634** precio banda secundaria (aFRR capacity, ист.), **2130** precio reserva sec. a subir, **10463** a bajar; **682/683** precio energía sec. subir/bajar; **2197** precio energías de balance mFRR (AP), 676/677 marginal terciaria bajar/subir; 668/669 gestión de desvíos; **686/687** precio cobro/pago desvíos; 1782 RR; 1293 demanda real; 1775 previsión D+1 demanda; 10249 previsión demanda residual; 460/541/542 прогнозы спроса/ветра/солнца | REST/JSON, заголовки `Accept: application/json; application/vnd.esios-api-v1+json`, `x-api-key: <token>`; токен — письмом на consultasios@ree.es (бесплатно, ~24 ч). `GET /indicators` (список) ответил 200 без ключа; `GET /indicators/{id}` без ключа → 403 | 15-мин разрешение с 24.05.2022 (документ REE «Adaptación… QH»); балансирующие цены D+1 публикуются «diariamente a partir de las 16:30 horas con la información del día D+1» (метаданные ind. 2130) | Лимиты запросов: **не найдено** в документации; условия использования: **не найдено** (страница не отдаёт текст) | Список индикаторов и коды ответа — 2026-09-05 |
| **ENTSO-E Transparency** (`web-api.tp.entsoe.eu`) | Day-ahead prices (A44, ст. 12.1.D), балансирующие данные (17.1.x), нагрузка, генерация, потоки | REST, `securityToken` (регистрация + письмо), XML/ZIP; python `entsoe-py` | DA-цены — «не позднее 1 ч после gate closure», 15-мин MTU с 1.10.2025 | 400 запросов/мин на токен/IP, бан ~10 мин (статья support-портала; страница отдаёт 403 при fetch — по сниппету) | Частично (Guide отдаёт 400) |
| **ECMWF open data** (IFS HRES/ENS, AIFS single/ENS) | 2t, 10м/100м ветер, ssrd и др.; 0,25°; 4 прогона/сутки (00/06/12/18 UTC); шаги 0–144 ч по 3 ч, далее по 6 ч до 240/360 ч | GRIB2 через data.ecmwf.int, AWS/Azure/GCP, python `ecmwf-opendata`; ecCodes ≥ 2.42 | Доступность «7–9 ч после базового времени прогноза»; rolling-архив 12 последних прогонов (~2–3 дня) | **CC-BY-4.0**, коммерческое использование разрешено с указанием источника; 500 одновременных соединений | Да |
| **Open-Meteo** | Мультимодельные прогнозы (в т. ч. ECMWF), исторический реанализ (в Professional+) | REST/JSON | Обновление по мере выхода моделей | Free: 10 000 вызовов/сутки, 5 000/ч, 600/мин, **только некоммерческое**; Standard $29/мес (1 млн вызовов), Professional $99/мес (5 млн + исторические API), Enterprise 50 млн+; данные CC BY 4.0, SLA 99,9 % | Да (pricing/terms) |
| **REE — capacidad de acceso (transporte)** | Карты доступной/занятой мощности спроса по узлам сети передачи (хранение считается спросом); пороги WSCR; «capacidad ocupada por posición» | PDF + CSV + XLSX на ree.es; первая публикация 20.02.2026 (по требованию CNMC, Resolución RDC/DE/008/25 от 01.12.2025) | Обновление **ежемесячно** по резолюции CNMC (страница REE называет квартальную периодичность; последняя версия «1 de septiembre de 2026») | Открыто; 75 % узлов без свободной мощности для нового спроса (El Periódico de la Energía, 20.02.2026) | Да |
| **e-distribución (Endesa)** | `capacidad disponible de generación` по узлам > 1 кВ; xlsx/csv, ежемесячно, история с 01.2023 | Прямые ссылки на сайте | Ежемесячно, данные за предыдущий месяц | Для хранения: «Las solicitudes de almacenamiento no podrán ser atendidas, por tratarse de demanda flexible y estar pendientes del desarrollo reglamentario» — **карт для BESS нет** | Да |
| **UFD (Naturgy)** | PDF 150 стр. «Capacidad de acceso para generación en las subestaciones de UFD» (по подстанциям, позициям, MW disponible/ocupada/en estudio) | PDF, дата 25.09.2024 (актуальность — не найдено) | Нерегулярно | Только генерация | Да (PDF) |
| **i-DE (Iberdrola)** | Карты/таблицы capacidad de acceso | Сайт вернул 503 при обращении | — | **не проверено** | Нет |
| **Viesgo** | «Mapa interactivo de la red» — это карта инцидентов/работ, а не capacidad | — | — | Карты capacidad — **не найдено** | Частично |
| Агрегаторы карт | AlvriSolutions собирает данные i-DE/Endesa/UFD/E.ON/Viesgo/REE в одну карту с экспортом в Excel (платно/условия — не найдено) | Web | — | — | Сниппет |
| **Платные прогнозы** | Meteologica (Мадрид; ветер/солнце/спрос/фундаментальные прогнозы, > 80 стран), AleaSoft/AleaBlue (DA/ID цены MIBEL, 45+ рынков), Montel, Enappsys, Volue Insight | Только по запросу | — | **Публичных цен нет ни у кого** (проверены сайты Meteologica, AleaSoft; Montel/Enappsys/Volue — не найдено). Ориентир для финмодели [Д]: €10–40 тыс./год за один рынок/продукт | Частично |

**Вывод по данным:** для MVP хватает OMIE + ESIOS + ECMWF open data (всё бесплатно, лицензии совместимы с коммерческим продуктом при указании источника; по OMIE/ESIOS стоит получить письменное подтверждение). Платные прогнозы — опция для ансамбля, не необходимость.

---

## 3. Точность прогнозов цен в литературе (2020–2026)

### 3.1 Открытый бенчмарк Lago et al. (2021), Applied Energy 293:116983 + epftoolbox

Пять рынков (NP, PJM, EPEX-BE/FR/DE), 6 лет данных, тест 2 года, DM-тесты. Метрика rMAE = MAE / MAE наивного прогноза (наив: «цена как в тот же час вчера/неделю назад»), т. е. **rMAE наивного = 1,0**.

| Рынок | DNN-ансамбль rMAE | LEAR-ансамбль rMAE | MAE DNN (€/МВтч) | sMAPE DNN |
|---|---|---|---|---|
| NordPool | 0,403 | 0,420 | 1,67 | 4,85 % |
| PJM | 0,439 | 0,476 | 2,78 | 11,22 % |
| EPEX-BE | 0,573 | 0,604 | 5,82 | 13,33 % |
| EPEX-FR | 0,533 | 0,543 | 3,91 | 10,98 % |
| EPEX-DE | 0,377 | 0,395 | 3,44 | 14,19 % |

Цитаты: «new methods are rarely benchmarked against well established and well performing simpler models»; «rMAE should always be… included to obtain more fair comparisons». Испании в бенчмарке **нет** (epftoolbox: EPEX-BE/FR/DE, NP, PJM; лицензия AGPL-3.0 — важно для коммерческого продукта: использовать как референс, не как зависимость).

### 3.2 Испания, 2023–2026

- Springer LNCS (2025), «A Comparative Evaluation of Deep Neural Networks for Electricity Price Forecasting»: для испанского рынка MLP-модели дают MAE ≈ 10,90–12,23 €/МВтч; лучшая (MLP + байесовская оптимизация) — **MAE 10,90 €/МВтч, rMAE 35,19 %** (по сниппету поисковой выдачи; полный текст за paywall — **не проверено**). Абсолютный MAE выше, чем в таблице Lago, из-за уровня цен 2022–2024.
- Mathematics and Computers in Simulation (2025), «Deep learning-based prediction models for spot electricity market prices in the Spanish market» — существует, числа не извлечены (paywall).
- Energy (2024), «Deep learning-based electricity price forecasting: Findings on price predictability and European electricity markets» — Испания среди рынков; числа не извлечены (paywall).
- Energy (2025), «Deep learning approaches for predicting the upward and downward energy prices in the Spanish automatic Frequency Restoration Reserve market» — единственная найденная работа именно по ценам энергии aFRR Испании; числа не извлечены (paywall).
- Обзор Yu, Bunn et al. (arXiv 2602.10071, февр. 2026) «Deep Learning for EPF: DA, Intraday, Balancing»: Испания в таблице исследований; тренды — «gradual transition from pointwise objectives toward probabilistic forecasting» (после 2023), для intraday — «orderbook-centric modeling», для balancing — «shallow backbones with relatively few layers»; появляются «foundation-style models for day-ahead forecasting». Отдельных результатов по 15-минутным данным Испании (после 1.10.2025) в обзоре нет — история 15-мин DA-цен OMIE на сегодня < 1 года, что ограничивает обучение/тест.

**Практический ориентир для MVP [Д]:** на испанском DA 2025–2026 ожидать MAE 8–14 €/МВтч, rMAE 0,4–0,6, sMAPE 12–20 % (волатильность выросла: доля нулевых/отрицательных цен ≈ 10 % часов, спреды 2024→2025 +25 % — RatedPower, 06.2026). Разрыв «LEAR vs лучший DNN» в 2–5 п. п. rMAE — ансамбль LEAR + GBM + небольшая NN даёт почти всё, что даёт «ИИ».

### 3.3 Доля perfect-foresight выручки при реалистичном прогнозе

| Источник | Рынок | Результат |
|---|---|---|
| Falezza, «When Forecast Accuracy Fails: Rank Correlation and Decision Quality in Multi-Market BESS Optimization», arXiv 2604.12082 (апр. 2026) | DE/CH 2020–2025, FCR/aFRR/DA/XBID | «Forecasts above an empirical threshold of tau ≈ 0.85–0.95 capture up to 97–100% of perfect-foresight revenue»; персистентность (τ≈0) — 33 %; «Rank correlation (Kendall tau), rather than MAE, is the primary predictor of intraday dispatch value» |
| Infradebt, «Percentage of Perfect» (22.12.2025) | Австралия NEM, выборка оптимизаторов | PoP = «Actual revenue earnt / Maximum revenue opportunity on a perfect foresight basis»; ожидания 80–90 %, «actual observed PoP for optimisers have been more in the 60–80% range»; «significant variability between… individual optimisers» |
| OptiGrid в Energy-Storage.News (21.01.2026) | NEM, методология | Четыре уровня качества расчёта PoP; «lack of standardisation and transparency in the assumptions» — сравнивать PoP между вендорами нельзя без единой методики |
| Energies 18(13):3309 (2025), «A Comparative Analysis of Price Forecasting Methods for Maximizing Battery Storage Profits» | (рынок — не проверено; MDPI вернул 403) | По сниппету: SSA-прогноз даёт > 97 % теоретического максимума в каждый год 2020–2024, в среднем 98 % — **не проверено** |
| «The Value of BESS in the Continuous Intraday Market: Forecast vs. Perfect Foresight» (ResearchGate, 2025) | Continuous intraday | ≈ 90 % perfect-foresight (по сниппету; полный текст **не проверен**) |
| Ascend Analytics (06.11.2023) | ERCOT/CAISO | Реальные результаты SmartBidder выше консервативного base case BatterySIMM на 8–24 % — иллюстрация разброса между «прогнозной» и «реализованной» выручкой |
| van Sandbergen, arXiv 2509.21337 (2025) | DA+ID кросс-маркет | «only a moderate portion of revenues will be lost if real forecasts are adopted» (числа в аннотации не даны) |

**Вывод:** академические 90–100 % относятся к чистому арбитражу с хорошими прогнозами; полевые 60–80 % включают простои, ограничения гарантии, ошибки исполнения и «плохие» дни. В финмодель: базовый сценарий **75 %**, пессимистичный 60 %, оптимистичный 85 % [Д].

---

## 4. EMS и протоколы

| Вендор / EMS | Протоколы (публично) | API для стороннего оптимизатора | Документация | Кейсы со сторонними оптимизаторами | Проверено |
|---|---|---|---|---|---|
| **Wärtsilä GEMS** (Power Plant Controller) | Modbus, DNP3, IEC 61850, OPC UA; «each interface's data points are fully configurable»; RESTful Web API + WebSocket Streaming API; IEC 62443-4, SSL/IPSec VPN; latency < 10 мс; BMS/PCS «from all major vendors» | REST/WebSocket есть, но открытой спецификации нет; условия — по проекту | Спец-лист GEMS PPC (08.2025), сайт GEMS | Не найдено публично | Да (PDF) |
| **Sungrow EMS3000** (PowerTitan) | Modbus RTU/TCP, IEC 61850 GOOSE, DNP 3.0, IEC 60870-5-104; «millions of monitoring points at GW-scale» | Открытого API не найдено; в отрасли принято «open interfaces for third-party EMS integration, typically selected by EPCs or aggregators» (Energy Industry Review, спонсорский материал) | Datasheet EMS3000 | Entrix + Sungrow — **не найдено** (поиск исчерпан) | Частично |
| **Huawei Smart String ESS (LUNA2000)** | Modbus TCP и IEC 104 к утилити-EMS (по сниппету datasheet «Utility Smart String ESS Solution»); есть документы «LUNA2000B/C ESS Modbus Port Definitions» (EDOC1100311915 / EDOC1100311508) | Register map публикуется (Modbus); FusionSolar облако — свой API, не для диспетча | support.huawei.com (страница не отдала текст при fetch) | Не найдено | Частично |
| **Tesla Megapack / Autobidder** | Autobidder — облачная торговля, «interfacing with market operators, network providers and customer networks via secure web APIs» (support page, по сниппету; страница 403); протоколы Site Controller для стороннего оптимизатора — **не найдено** (сниппет про Modbus/DNP3/REST относился к документу Bender, не Tesla) | Не найдено | tesla.com/support (403) | Не найдено | Нет |
| **Fluence (Mosaic / Nispera)** | Mosaic: «technology agnostic», 16 ГВт, рынки CAISO/ERCOT/NEM/MISO/Япония — **Европы/Испании на странице нет**; Nispera — APM с «open cloud-based architecture… supports APIs». Протоколы EMS Fluence OS — не найдено | Открытого API диспетча не найдено; Fluence «covers the whole chain… hardware… digital side» (ESN, 09.2025) | Сайт | enspired + Fluence — **не найдено** | Частично |
| **Power Electronics (Испания, Llíria)** | Freemaq PCSM/Multi PCSM до 5 360 кВА, grid-forming/following; PPC PRO (контроллер); Modbus TCP в datasheet PCSK (по сниппету); IEC 104/61850 — не найдено | Не найдено | Datasheets на сайте | Не найдено | Частично |
| **Ingeteam (Испания)** | INGECON SUN Plant Controller: Modbus TCP/RTU, IEC 61850, IEC 60870-5-101/-104; INGESAS IC3 (шлюз/RTU): IEC 61850 client/server, IEC 104, DNP3, Modbus, OPC-UA; INGECON SUN STORAGE FSK M до 9,1 МВт; собственная SCADA INGESYS | Стандартные телеуправляющие протоколы — «API» де-факто = IEC 104/61850 | ingeteam.com | Ingeteam — поставщик PCS в проектах Statkraft/Aquila (Испания, 07.2026) | Да |
| **Gamesa Electric** | Proteus PCS-E 5,6 МВА; EMS/протоколы на сайте не указаны | Не найдено | — | Не найдено | Частично |
| **BYD, CATL, Hithium** | Публичной информации по EMS-протоколам не собрано (бюджет поиска) — **не найдено** | — | — | Hithium — поставщик батарей в проектах Statkraft (Испания) | Нет |
| **Elecnor** | EPC/интегратор; собственного EMS-продукта не найдено | — | — | — | Нет |

**Отраслевая норма (SunLith, 05.2026):** внутри площадки EMS↔BMS/PCS — Modbus TCP/CAN; к SCADA/TSO — IEC 61850 («mandated by EU… utility operators»), IEC 60870-5-104 для европейских DSO/TSO, DNP3 — Северная Америка. Modbus TCP — polling, «adds latency»; GOOSE < 1 мс.

**Как выглядит интеграция на практике [Д, по совокупности источников]:** оптимизатор → защищённый канал (VPN/IPSec) → REST/MQTT-шлюз или прямо IEC 104/Modbus TCP к PPC/EMS → запись уставки активной мощности (setpoint, кВт) и режима, чтение SoC/SoH/доступной мощности/аварий. Для aFRR активацию сигналом REE выполняет **зона регулирования representante**, а не оптимизатор; оптимизатор лишь резервирует полосу. Каждая интеграция требует согласования точек с EPC/вендором и проверки на соответствие гарантийным условиям батареи (C-rate, циклы, DoD).

---

## 5. Интеграция с трейдерами / representantes в Испании

| Компания | Роль на рынке | Публичный API для подачи заявок сторонним оптимизатором | Как реально устроено | Проверено |
|---|---|---|---|---|
| **Nexus Energía** | 2-й representante ВИЭ (6 900–7 300 МВт, 16 300 установок), центр управления (4 800 МВт, «más de 670 señales activas»), зона регулирования для рынков балансировки, «Optimización con baterías» | **Не найдено**; есть клиентский портал productores.nexusenergia.com | Альянс с enspired (июль 2025): «enspired asume la responsabilidad del desempeño en el mercado y la ejecución de la estrategia de trading, mientras que Nexus Energía proporciona la representación en el mercado, la operación del centro de control, la precalificación de los activos y el acceso a su zona de regulación» (по пресс-релизу/сниппетам); цель 300 МВт BESS в 2026 | Да |
| **Axpo Iberia** | «market representation for renewable generators and optimisation services», опыт BESS-оптимизации в Европе (Польша, Италия) | Не найдено | Представление + собственная оптимизация; tolling/floor-структуры в других странах | Сниппет |
| **Statkraft** | В Испании — девелопер/оператор (5 гибридных проектов, 11 проектов > 200 МВт, 2 standalone 90 МВт/360 МВтч); route-to-market для сторонних BESS в Испании — не найдено | Не найдено | — | Частично |
| **Acciona Energía, Audax** | Не найдено (бюджет поиска) | Не найдено | — | Нет |
| **enspired** (AT) | Оптимизатор; торгует сам через EPEX PCT-программу, min 5 МВт, 2,6+ ГВт под контрактом, 1 ГВт live | Технические детали интеграции с EMS не раскрываются | В Германии — enspired (оптимизация) + Entelios (market access, balancing, FCR/aFRR): ECO STOR 103,5 МВт/238,5 МВтч, Obton 137,5 МВт/306 МВтч | Да |
| **Entrix** (DE) | «End-to-end»: торговля, онбординг, 24/7; DE/PL/IT/**ES/PT**; 30 000 сделок/день, 70 проектов, 3 ГВт под контрактом | Не найдено | Прямой доступ/через партнёров — не раскрыто | Да |
| **Capalo AI** (FI) | «Capalo Zeus VPP» — turn-key: route-to-market, BRP/BSP, торговля на своих книгах; 600 МВт live, 1,6 ГВт под контрактом; **Испания/Португалия — в пайплайне 2026** | Не найдено | Trading-as-a-service: клиент подписывает контракт, Capalo — BRP/BSP | Да |

**Вывод:** стандартной «API-подачи заявок» в Испании нет; интерфейс к рынку — договор с representante, обмен программами (P48/уставки, полоса aFRR) идёт по согласованному каналу (файлы/SFTP/e-mail/портал — конкретные форматы не найдены [Д]). Для MVP реалистично: (а) оптимизатор формирует план DA/ID и заявку на полосу → (б) representante подаёт на OMIE/REE от своей зоны → (в) оптимизатор исполняет физический диспетч на EMS в рамках программы. Прямое членство в OMIE (agente de mercado) + собственная зона регулирования — отдельный проект (юрлицо, гарантии, преквалификация REE), для стартапа-софтверной студии на MVP неоправдан [Д].

---

## 6. Солверы

### 6.1 Кабинетно

| Солвер | Лицензия / цена | Бенчмарки (Mittelmann MILP, MIPLIB2017 benchmark, 240 инстансов, таймаут 2 ч, обновлено 07.07.2026) | Заметки |
|---|---|---|---|
| **Gurobi** | Коммерческая, цены не публикуются; Vendr (02.2026): медиана контракта **$29 240/год**, диапазон $13 860–136 080; Ceris (02.2026): «expect $15,000+ annually»; eval-лицензия 30 дней бесплатно; **программа для стартапов на gurobi.com не найдена** (только academic и free trial) | Вышел из бенчмарков Mittelmann в августе 2024 — актуальных публичных цифр нет | Референс по скорости; на малых MILP преимущество не проявится [Д] |
| **HiGHS** | MIT (open source) | HiGHS 1.15.1 parallel: 179/240 решено, scaled SGM 5,44; HiGHS 1.15.0: 158/240, SGM 7,55 (COPT = 1,0, 219/240) | Дж. Холл (03.2024): «about one order of magnitude for Mittelmann's benchmarks between HiGHS and Gurobi» (MIP), для LP — 20× к COPT |
| **SCIP** | Apache 2.0 (с 2022) | SCIP 10.0/spx: 136/240, SGM 9,93; SCIPCO 11.0: 153/240, SGM 6,59 | Гибкий, но медленнее HiGHS на этом наборе |
| **CBC** | EPL | В текущем списке Mittelmann отсутствует — не найдено | Стареющий; для малых задач пригоден |
| **OR-Tools** | Apache 2.0 | Обёртка над SCIP/HiGHS/CP-SAT/GLOP — собственных MILP-бенчмарков в Mittelmann нет | CP-SAT интересен для комбинаторики режимов [Д] |
| **COPT / OptVerse / Xpress** | Коммерческие | COPT 8.0.3 — лидер (1,0; 219/240); OptVerse 2.0.1 — 1,72; 210/240 | Альтернатива Gurobi при переговорах |

**Размер задачи [Д]:** 48 ч × 4 = 192 интервала × 3 рынка (DA-энергия, ID-корректировка, полоса aFRR ↑/↓) ≈ 600–1 200 непрерывных переменных, 192–384 бинарных (заряд/разряд, состояние полосы), ~2 000–4 000 ограничений (SoC-баланс, P_max(t) с учётом гибкого доступа, взаимоисключение, лимиты циклов). Это на 2–3 порядка меньше инстансов MIPLIB; ожидание — доли секунды на HiGHS, что делает Gurobi необязательным. Rolling-horizon в 15-мин цикле + стохастика (сценарии цен) увеличит задачу ×10–50 — всё ещё в зоне HiGHS [Д]. Практика вендоров: enspired — «8 000–10 000 virtual optimisation tests every day» (ESN, 02.2025).

### 6.2 Замер на бэктесте

Замер (2026-09-06, `backtest/run_backtest.py`, scipy.optimize.milp → HiGHS 1.x, 1 vCPU песочницы, MILP с бинарными режимами заряд/разряд):

| Задача | Переменных (непрерывных + бинарных) | Время |
|---|---|---|
| 96 интервалов × 1 рынок (сутки, 15 мин) | 288 + 96 | ≈ 15 мс |
| 192 интервала (48 ч) | 576 + 192 | ≈ 29 мс |
| прокси 3 рынка × 48 ч (576 интервалов как один ряд) | 1 728 + 576 | ≈ 152 мс |
| полный бэктест: 610 дней × ~23 MILP (стратегии, сценарии, чувствительность) ≈ 14 000 задач + прогноз | — | ≈ 13 мин |

Вывод: для задачи такого размера HiGHS (open source, MIT) достаточен с запасом; Gurobi не нужен даже для интрадей-переоптимизации каждые 15 минут. Полная формулировка «3 рынка × 48 ч» с совместными ограничениями мощности/энергии по рынкам будет в 2–4 раза больше по переменным, но остаётся в секундах (допущение по масштабированию).

*Заполняется по результатам бэктеста (HiGHS vs CBC vs SCIP vs Gurobi-eval на реальной модели 96×48 ч × 3 рынка; время решения, gap, стабильность на 365 прогонах).*

---

## 7. Архитектура MVP

```mermaid
flowchart LR
  subgraph SRC[Источники данных]
    OMIE[OMIE файлы<br/>marginalpdbc, precios_pibcic, curvas]
    ESIOS[ESIOS API<br/>aFRR/mFRR/desvíos/demanda]
    ENTSOE[ENTSO-E API<br/>кросс-чек, соседние зоны]
    WX[ECMWF open data / Open-Meteo<br/>ветер, солнце, t2m]
    GRID[Карты capacidad REE/DSO<br/>+ лимиты гибкого доступа]
  end

  subgraph ING[Ингест и хранилище]
    ETL[Планировщик загрузок<br/>валидация, версии файлов]
    TS[(TimescaleDB/Parquet<br/>15-мин ряды)]
  end

  subgraph FC[Прогноз]
    F1[DA-цены D+1<br/>LEAR + GBM + NN ансамбль]
    F2[ID/aFRR/desvíos<br/>квантильные прогнозы]
    F3[Сценарии цен<br/>для стохастики]
  end

  subgraph OPT[Оптимизация]
    MILP[MILP 96×48ч×3 рынка<br/>HiGHS, rolling horizon]
    DEG[Модель деградации<br/>гарантийные лимиты]
    NET[Ограничения сети<br/>P_max(t), гибкий доступ]
  end

  subgraph MKT[Рынок]
    REP[Representante / трейдер<br/>Nexus, Axpo...]
    OMIEm[OMIE DA / IDA / SIDC]
    REE[REE: aFRR/mFRR<br/>через зону регулирования]
  end

  subgraph ASSET[Актив]
    GW[Шлюз площадки<br/>VPN, IEC 104 / Modbus TCP / REST]
    EMS[EMS/PPC вендора<br/>GEMS, EMS3000, Ingeteam...]
    BESS[(BESS 10-50 МВт)]
  end

  subgraph OPS[Мониторинг и отчётность]
    MON[Реал-тайм: SoC, исполнение,<br/>отклонения, алармы]
    REPT[Отчёты: выручка по рынкам,<br/>PoP, desvíos, деградация]
    UI[Портал владельца]
  end

  OMIE --> ETL
  ESIOS --> ETL
  ENTSOE --> ETL
  WX --> ETL
  GRID --> NET
  ETL --> TS
  TS --> F1 --> F3
  TS --> F2 --> F3
  F3 --> MILP
  DEG --> MILP
  NET --> MILP
  MILP -->|план DA/ID, заявка на полосу| REP
  REP --> OMIEm
  REP --> REE
  OMIEm -->|результаты| ETL
  REE -->|активации, программы| REP
  MILP -->|уставки P(t)| GW --> EMS --> BESS
  EMS -->|SoC, SoH, статусы| GW --> MON
  REP -->|программа P48, расчёты| MON
  MON --> REPT --> UI
  MON -->|re-optimize каждые 15 мин| MILP
```

Ключевые контуры: **D-1 цикл** (утро: прогноз → MILP → план и заявки representante к 12:00 CET → результаты ~13:00 → корректировка); **intraday цикл** (каждые 15 мин: обновлённые данные SIDC/ESIOS → re-optimize → уставки); **балансировка** (полоса aFRR резервируется оптимизатором, активации исполняет зона регулирования; оптимизатор удерживает SoC-коридор под полосу).

---

## 8. Интеграции: оценка сложности

| Интеграция | Сложность | Обоснование |
|---|---|---|
| OMIE публичные файлы (DA, ID-агрегаты, кривые) | **S** | Прямые URL, txt/`;`, стабильный формат; нужны только парсер версий (`.1/.2`) и обработка 15-мин/DST (92/100 периодов) [Д] |
| ESIOS API (цены балансировки, спрос, прогнозы) | **S** | JSON по токену, ID найдены; риск — недокументированные лимиты и позднее D+1 (16:30) |
| ENTSO-E API | **S** | Готовые клиенты (entsoe-py), 400 req/min; используется как дубль |
| ECMWF open data / Open-Meteo | **S–M** | GRIB2-конвейер (ecCodes), 7–9 ч лаг, выбор точек/агрегаций по регионам ветра/солнца Испании — M, если строить свою фичу-инженерию генерации |
| Карты capacidad REE/DSO и лимиты гибкого доступа | **M** | Данные разнородные (PDF/xlsx/csv, разные DSO), для хранения регуляторно не оформлены; в MVP — ручной ввод лимитов P_max(t) на актив + мониторинг обновлений карт |
| Прогнозная платформа (LEAR/GBM/NN, квантили, ансамбль, бэктест-харнесс) | **M** | Наука известна (Lago 2021), но нужны дисциплина тестов (≥ 1 год out-of-sample, DM-тест), 15-мин история OMIE < 1 года |
| Оптимизатор MILP + деградация + стохастика | **M** | Формулировка стандартна; сложность — калибровка деградации под гарантию конкретного вендора и корректный учёт правил aFRR (SoC-коридор, симметрия) |
| **Representante / трейдер (обмен планами и заявками)** | **L** | Нет API; договор, преквалификация актива, форматы обмена (P48, полосы, расчёты desvíos) определяются партнёром; критический путь MVP |
| **EMS первого актива** (IEC 104/Modbus TCP, VPN, кибербезопасность, гарантийные лимиты, FAT/SAT с EPC) | **L** | Проектная работа с вендором/EPC, 2–4 мес. календарно [Д]; последующие активы того же EMS — M |
| Мониторинг/портал владельца/отчётность (PoP, выручка по рынкам) | **M** | Стандартная веб-разработка; сложность — методика PoP (OptiGrid: четыре уровня качества) и сверка с расчётами representante |

---

## 9. Команда, сроки, инфраструктура

**Состав команды MVP [Д]:** 1 tech lead/архитектор; 2 backend (Python, ingest, интеграции, IEC 104/Modbus); 1 ML/forecasting; 1 OR-инженер (MILP/HiGHS, деградация); 1 frontend/портал; 0,5 DevOps/SecOps (VPN, IEC 62443-подход); **обязательно** доменный консультант по испанскому рынку (бывший трейдер/представитель или инженер зоны регулирования) — 0,3–0,5 FTE на всём горизонте, без него риски R1/R4 не закрываются.

**Оценка трудозатрат (человеко-недели, [Д]):**

| Блок | ч-нед | Комментарий |
|---|---|---|
| Ингест OMIE/ESIOS/ENTSO-E/погода + хранилище + валидация | 10–14 | Включая исторические загрузки 5+ лет для бэктеста |
| Прогнозная платформа (модели, квантили, бэктест-харнесс, мониторинг дрейфа) | 14–20 | |
| Оптимизатор (MILP, rolling horizon, деградация, сеть, сценарии) | 12–18 | |
| Симулятор/бэктестер рынка (DA+ID+aFRR, PoP) | 8–12 | Нужен и для продаж (доказательство ценности) |
| Интерфейс с representante (форматы обмена, автоматизация подачи) | 8–14 | Зависит от партнёра; часть — ручная/полуавтоматическая |
| Шлюз к EMS первого актива (IEC 104/Modbus, VPN, safety-логика, FAT/SAT) | 12–20 | Календарно длиннее из-за согласований |
| Портал, отчётность, алармы | 8–12 | |
| Безопасность, DevOps, наблюдаемость | 6–10 | |
| Управление, доменная экспертиза, документация | 8–12 | |
| **Итого** | **86–132 ч-нед** | ≈ 6–7 FTE × 4–5 мес. (без учёта календарного ожидания партнёров: договор с representante и доступ к активу могут занять 3–6 мес. параллельно) |

Разумная фазировка: **Фаза 0 (4–6 нед.)** — данные + бэктест + прогноз + MILP «на бумаге» (продуктовый инструмент для продаж «сколько вы теряете»); **Фаза 1 (3–4 мес.)** — пилот с одним representante и одним активом в режиме «советник» (рекомендации, без прямых уставок); **Фаза 2** — замкнутый контур диспетча.

**Инфраструктура (€/мес, [Д]):**

| Статья | €/мес | Допущения |
|---|---|---|
| Облако (2–4 vCPU-сервисы, PostgreSQL/Timescale 200–500 ГБ, объектное хранилище GRIB/parquet, очередь) | 400–1 200 | Один регион ЕС; ML-обучение раз в сутки на CPU, GPU не нужен для LEAR/GBM; при NN-ансамблях +€100–300 spot-GPU |
| Open-Meteo Professional (опционально) | ≈ 90 (US$99) | Или бесплатно через ECMWF open data напрямую |
| Платный прогноз цен/погоды (опционально, для ансамбля) | 800–3 500 | Публичных прайсов нет; ориентир €10–40 тыс./год |
| Gurobi (опционально) | ≈ 1 200–2 500 | По Vendr-медиане $29 240/год; базовый план — HiGHS = 0 |
| VPN/шлюзы на площадках, мониторинг, секреты, бэкапы | 100–300 | На 1–3 актива |
| Наблюдаемость/алертинг/on-call инструменты | 100–300 | |
| **Итого базово (без платных прогнозов и Gurobi)** | **≈ 700–1 900** | На 1–3 актива; масштабирование ≈ +€100–200 на актив |

---

## 10. Что говорит против

1. **Ниша уже занята игроками с ГВт под управлением и «трейдер + оптимизатор» в одном лице:** enspired (2,6 ГВт под контрактом, вход в Испанию через Nexus, цель 300 МВт в 2026), Entrix (3 ГВт, ES/PT активны), Capalo (ES/PT 2026), Fluence Mosaic (16 ГВт, пока без Европы на сайте), Axpo. Владелец 10–50 МВт скорее купит пакет «представление + оптимизация» у representante, чем отдельный софт.
2. **Софт без доступа к рынку не является продуктом:** без зоны регулирования нет aFRR/mFRR — ключевой части стека; всё, что остаётся, — DA/ID-арбитраж, где преимущество прогноза ограничено (rMAE ~0,4–0,6 у всех).
3. **Прогнозная точность — не дифференциатор:** LEAR отстаёт от лучших DNN на 2–5 п. п.; ранговая точность важнее MAE (Falezza 2026), а 15-минутной истории OMIE меньше года.
4. **Полевые 60–80 % PoP (NEM) против 90–100 % в статьях** — заявленный «ИИ-прирост» будет трудно доказать аудируемо; методики PoP не стандартизованы (OptiGrid 2026).
5. **Регуляторная незрелость гибкого доступа для хранения:** DSO (e-distribución) прямо не принимают заявки хранения как гибкого спроса; карты REE для спроса появились лишь в феврале 2026 и обновляются с оговорками («nudos sin valor consensuado»). Функция «учёт гибкого доступа» может не иметь данных, на которых работать, ещё 1–2 года [Д].
6. **Каждая EMS-интеграция — проект с вендором/EPC**, гарантийные ограничения батарей и кибербезопасность (IEC 62443) — время и ответственность, которые студия без энергетического опыта недооценивает.
7. **Лицензии:** epftoolbox — AGPL-3.0; OMIE не даёт явного разрешения на коммерческое использование данных; условия ESIOS не найдены.

---

## 11. Источники (обращение 2026-09-05)

**OMIE**
- Modelo de Ficheros para la distribución pública de información, v1.35 (06.2024) — https://www.omel.es/sites/default/files/2024-06/Formato_ficheros_inf_pub_135.pdf
- Acceso a ficheros — https://www.omie.es/es/file-access-list
- Файл marginalpdbc_20260904.1 — https://www.omie.es/es/file-download?parents%5B0%5D=marginalpdbc&filename=marginalpdbc_20260904.1
- Файл precios_pibcic_20260903.1 — https://www.omie.es/es/file-download?parents%5B0%5D=precios_pibcic&filename=precios_pibcic_20260903.1
- Day-ahead price (15-мин периоды) — https://www.omie.es/en/market-results/daily/daily-market/day-ahead-price
- Mercado de electricidad (расписание) — https://www.omie.es/en/mercado-de-electricidad
- Aviso legal — https://www.omie.es/es/aviso-legal

**ESIOS / REE**
- API e·sios Documentation — https://api.esios.ree.es/ ; список индикаторов — https://api.esios.ree.es/indicators ; https://api.esios.ree.es/doc/indicator/getting_a_list_of_indicators.html
- REE, «Adaptación de la página web pública de e·sios al proyecto de programación cuarto-horaria (QH)», 2022 — https://api.esios.ree.es/documents/658/download?locale=en
- PVPC.info, индикатор 2130 (публикация с 16:30 D+1) — https://pvpc.info/indicadores-esios/2130-banda-secundaria-a-bajar/
- Energía Chi-cuadrado, «Cómo conseguir datos de ESIOS con su API» — https://www.energychisquared.com/post/c%C3%B3mo-conseguir-datos-de-esios-con-su-api/
- github rogarui/ESIOS; datons/python-esios — https://github.com/rogarui/ESIOS/blob/main/README.md ; https://github.com/datons/python-esios

**ENTSO-E**
- API Rate Limit — https://transparencyplatform.zendesk.com/hc/en-us/articles/12783148966036 (fetch 403; данные по сниппету)
- Day-ahead Prices [12.1.D] — https://transparency.entsoe.eu/content/static_content/Static%20content/knowledge%20base/data-views/transmission-domain/Data-view%20Day-ahead%20prices.html
- SDAC 15-min MTU (1.10.2025) — https://www.entsoe.eu/network_codes/cacm/implementation/sdac/
- Restful API Guide — https://transparency.entsoe.eu/content/static_content/Static%20content/web%20api/Guide.html (fetch 400)

**Погода**
- ECMWF open data — https://www.ecmwf.int/en/forecasts/datasets/open-data ; https://confluence.ecmwf.int/display/DAC/ECMWF+open+data:+real-time+forecasts+from+IFS+and+AIFS ; https://github.com/ecmwf/ecmwf-opendata
- ECMWF, «makes its entire Real-time Catalogue open to all» (2025) — https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwf-makes-its-entire-real-time-catalogue-open-all
- Open-Meteo pricing / terms — https://open-meteo.com/en/pricing ; https://open-meteo.com/en/terms

**Сетевой доступ**
- REE, Conoce la capacidad de acceso — https://www.ree.es/es/clientes/consumidor/acceso-conexion/conoce-la-capacidad-de-acceso
- CNMC, 13.02.2026 — https://www.cnmc.es/prensa/mapa-capacidad-transporte-20260213
- SmartGridsInfo, 17.02.2026 — https://www.smartgridsinfo.es/2026/02/17/cnmc-fija-fecha-publicacion-mapas-capacidad-acceso-demanda-transporte
- El Periódico de la Energía, 20.02.2026 — https://elperiodicodelaenergia.com/red-electrica-publica-los-mapas-de-capacidad-de-acceso-de-la-demanda-a-la-red-de-transporte/
- pv magazine España, 30.01.2026 — https://www.pv-magazine.es/2026/01/30/pospuesta-hasta-mayo-la-publicacion-de-los-mapas-de-capacidad-de-ree/
- e-distribución, Capacidad disponible de generación — https://www.edistribucion.com/es/red-electrica/Nodos_capacidad_acceso.html ; https://www.edistribucion.com/es/red-electrica/nodos-capacidad-red/capacidad-generacion.html
- UFD, Capacidad de acceso para generación (PDF, 25.09.2024) — https://estaticos.naturgy.com/ufd/capacidades/publicacion%20capacidad.pdf
- Viesgo, Mapa interactivo — https://www.viesgodistribucion.com/mapa-interactivo-de-la-red
- AlvriSolutions — https://alvrisolutions.com/services/grid-services/intro-maps/grid-capacity/capacidad-disponible-spain/
- Energías Renovables, 09.09.2025 («83 % de los nudos… saturado») — https://www.energias-renovables.com/panorama/el-83-de-los-nudos-de-la-20250909 (fetch 503; по сниппету)

**Прогнозирование цен**
- Lago, Marcjasz, De Schutter, Weron (2021), Applied Energy 293:116983 — https://arxiv.org/abs/2008.08004 ; epftoolbox — https://github.com/jeslago/epftoolbox
- Yu, Bunn et al. (2026), «Deep Learning for EPF: A Review of DA, Intraday, and Balancing Markets», arXiv 2602.10071 — https://arxiv.org/html/2602.10071v1
- Springer LNCS (2025), «A Comparative Evaluation of DNNs for EPF» — https://link.springer.com/chapter/10.1007/978-3-031-95099-5_2 (paywall; числа по сниппету)
- Mathematics and Computers in Simulation (2025), Spanish market DL models — https://www.sciencedirect.com/science/article/pii/S0378475425002769 (403)
- Energy (2024), «DL-based EPF: Findings on price predictability and European markets» — https://www.sciencedirect.com/science/article/pii/S0360544224026513 (403)
- Energy (2025), aFRR Spain DL — https://www.sciencedirect.com/science/article/pii/S0360544225008874 (403)
- RatedPower, «Iberia's BESS price curve explained» (23.06.2026) — https://ratedpower.com/blog/iberia-bess-price-curve/

**Ценность прогноза / PoP**
- Falezza (2026), arXiv 2604.12082 — https://arxiv.org/abs/2604.12082
- Infradebt, «Percentage of Perfect» (22.12.2025) — https://www.infradebt.com.au/post/percentage-of-perfect
- OptiGrid в Energy-Storage.News (21.01.2026) — https://www.energy-storage.news/battery-trading-performance-demystifying-normalised-revenue-and-percent-of-perfect-foresight/
- Energies 18(13):3309 (2025) — https://doi.org/10.3390/en18133309 (403; по сниппету)
- ResearchGate, «Value of BESS in the Continuous Intraday Market: Forecast vs Perfect Foresight» — https://www.researchgate.net/publication/387975438 (403; по сниппету)
- van Sandbergen (2025), arXiv 2509.21337 — https://arxiv.org/abs/2509.21337
- Cornejo et al. (2025), arXiv 2506.17059 — https://arxiv.org/abs/2506.17059
- Ascend Analytics (06.11.2023) — https://www.ascendanalytics.com/blog/ensuring-accurate-valuations-batterysimm-revenue-forecast-validation

**EMS / протоколы**
- Wärtsilä GEMS Power Plant Controller spec (08.2025) — https://www.wartsila.com/docs/default-source/energy-docs/energy-storage/specification-sheets/gems-power-plant-controller.pdf?sfvrsn=e1fdac44_9 ; платформа — https://www.wartsila.com/energy/energy-storage/technology/gems-digital-energy-platform
- Sungrow EMS3000 — https://bessmanufacturers.com/sungrow/ems3000/ ; Energy Industry Review (Sungrow, спонсорский) — https://energyindustryreview.com/sponsored/sungrow-power-stack-and-powertitan-2-0-high-performance-battery-storage-for-fcr-and-utility-projects/
- Huawei LUNA2000B ESS Modbus Port Definitions — https://support.huawei.com/enterprise/en/doc/EDOC1100311915 ; Utility Smart String ESS Solution (PDF) — https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fprofessionals%2Fall-products%2Futility-smart-string%2Fother%2Futility-smart-string-ess-solution.pdf (не проверен)
- Tesla Autobidder — https://www.tesla.com/support/energy/tesla-software/autobidder (403)
- Fluence Mosaic — https://fluenceenergy.com/mosaic-intelligent-bidding-software/ ; ESN, 09.09.2025 — https://www.energy-storage.news/optimising-bess-performance-requires-long-term-perspective-says-fluence/
- Power Electronics — https://power-electronics.com/en/ ; https://power-electronics.com/en/storage/pcsm-&-multi-pcsm
- Ingeteam — https://www.ingeteam.com/en/ingesas-ic3 ; https://www.ingeteam.com/interactivos-sectores/Ingeteam_BESS/ ; INGECON SUN Plant Controller (PDF) — https://www.ingeteam.com/Download/4541/attachment/ingecon-sun-plant-controller-es.pdf.aspx
- Gamesa Electric — https://www.gamesaelectric.com/
- SunLith, «BESS Communication Protocols: The Complete 2026 Guide» (26.05.2026) — https://sunlithenergy.com/bess-communication-protocols/

**Трейдеры / оптимизаторы**
- Nexus Energía × enspired — https://www.nexusenergia.com/noticias/nexus-energia-y-enspired-llegan-a-una-alianza-estrategica-para-liderar-el-mercado-de-optimizacion-de-activos-de-almacenamiento-renovable-en-espana/ ; https://www.nexusenergia.com/productores/ ; ESS News, 28.07.2025 — https://www.ess-news.com/2025/07/28/enspired-expands-battery-storage-optimization-to-spain-and-poland/ ; El Periódico de la Energía — https://elperiodicodelaenergia.com/nexus-energia-confia-en-la-ia-de-enspired-para-optimizar-la-rentabilidad-de-las-baterias/
- enspired BESS; пресс-релизы ECO STOR (27.11.2024), Obton (19.12.2024) — https://www.enspired-trading.com/bess ; https://www.enspired-trading.com/press-releases/enspired-and-entelios-to-optimize-eco-stors-103.5-mw/238.5-mwh-bess ; https://www.enspired-trading.com/press-releases/enspired-and-entelios-market-obtons-306-mwh-bess-project-in-germany ; ESN, 04.02.2025 — https://www.energy-storage.news/enspired-integrates-battery-health-analytics-into-ai-driven-bess-trading-platform/
- Entrix — https://entrixenergy.com/ ; Capalo AI — https://capaloai.com/
- Modo Energy, «Who are the Spanish optimisers…» (05.02.2026, paywall) — https://modoenergy.com/research/battery-energy-storage-optimizers-contact-list-iberia
- ESS News, Statkraft/Aquila (24.07.2026) — https://www.ess-news.com/2026/07/24/statkraft-aquila-advance-hybrid-bess-projects-in-spain/
- ESN, Axpo/R.Power (Польша) — https://www.energy-storage.news/r-power-and-axpo-agree-optimisation-deal-with-floor-for-1-2gwh-poland-bess/

**Солверы**
- Mittelmann, MILP benchmark (07.07.2026) — https://plato.asu.edu/ftp/milp.html ; обзор — https://plato.asu.edu/bench.html
- HiGHS discussion #1683 (03.2024) — https://github.com/ERGO-Code/HiGHS/discussions/1683
- Vendr, Gurobi pricing (02.2026) — https://www.vendr.com/marketplace/gurobi
- Ceris, «MIP Solver Comparison 2025» (02.02.2026) — https://ceris.fyi/blog/mip-solver-comparison-2025/
- Gurobi free trial / licensing — https://www.gurobi.com/free-trial/ ; https://www.gurobi.com/solutions/licensing/

**Платные прогнозы**
- Meteologica — https://www.meteologica.com/ ; AleaSoft — https://aleasoft.com/ (цены не публикуются); Montel, Enappsys, Volue — не проверены.
