# Блок A — Рынок BESS Испании: размер, пайплайн, окно спредов, механизм мощности

Дата исследования: 2026-09-05. Все обращения к источникам — 2026-09-05. Гипотеза: софтверный ИИ-оптимизатор диспетчеризации BESS для владельцев 10–50 МВт в Испании, монетизация 10–20 % revenue-share. Задача — попытаться опровергнуть К1 и К8.

Сопутствующий файл: `/home/user/research/bess-spain/pipeline/bess_pipeline.csv` — 79 реально найденных проектов (78 ≥ 10 МВт, суммарно ≈ 4,4 ГВт; 56 проектов в диапазоне 10–50 МВт ≈ 1,64 ГВт).

---

## 1. Вердикты

### К1 «Рынок достаточен» (≥ 1,5 ГВт в стройке / с доступом к 2028; ≥ 50 проектов ≥ 10 МВт) — **ПОДТВЕРЖДЕНО по пайплайну, с оговоркой по темпу ввода**

Ключевые факты:
1. **Разрешений на доступ — 24,3 ГВт** (16 156 МВт в сети транспорта + 8 157 МВт в распредсети) на 31.01.2026 плюс 15,1 ГВт в рассмотрении — данные REE через pv-magazine.es (2026-02-03). Порог 1,5 ГВт превышен в 16 раз «на бумаге».
2. **Реально «горячий» пайплайн:** ~2 ГВт с AAC (разрешение на строительство) на август 2026 (Orka Energía / El Periódico de la Energía, 2026-08-20), 6,4 ГВт с открытым делом в BOE и 10,3 ГВт анонсировано до 2029 (Modo Energy через El Español, 2026-08-27); 2,2 ГВт / 9,4 ГВтч получили субсидию FEDER (126 проектов, обязаны быть завершены до 31.12.2029; MITECO/IDAE, 2025-12-30). За 4 квартала (4Q25–2Q26) BOE опубликовал 78 проектов BESS на ~4,8 ГВт.
3. **Количество проектов:** только в нашем CSV 78 проектов ≥ 10 МВт (56 из них 10–50 МВт). pv-magazine (2025-12-02): 462 проекта / 7 614 МВт в административной проработке, средний размер 18 МВт. Порог «≥ 50 проектов» превышен многократно.

Оговорка (это и есть главный риск для К1): **установлено всего 260,8 МВт на август 2026** (REE), из них реально торгует на рынке ~150 МВт (Orka). За май–август 2026 подключено лишь 40 МВт. От AAC до ввода standalone-проекта — 16–17 месяцев. Значит к концу 2028 в работе реалистично будет **~2–4 ГВт**, а не 7 ГВт. Порог 1,5 ГВт «в стройке или с доступом» проходится, но «в эксплуатации к 2028» — только в базовом/оптимистичном сценарии.

### К8 «Окно достаточное» (спреды day-ahead не схлопываются до 2031) — **НЕЯСНО, с уклоном «частично опровергнуто»**

1. **Спреды day-ahead пока растут:** рекорд 94 €/МВтч среднесуточного спреда в 2025 (Modo, 2025-06), 148 €/МВтч средний часовой спред в июле 2026 — выше кризиса 2022 (AleaSoft, 2026-08-05). Причина структурная — 33+ ГВт солнца, capture rate солнца упал до 56 % (2025).
2. **Но выручка на МВт по прогнозу Modo падает более чем вдвое к 2030:** 4-часовая батарея — ~366 k€/МВт/год в 2027 → ~146 k€/МВт/год в 2030 «as balancing saturates», затем восстановление на растущих DA-спредах (Modo Jul-26 forecast, через поисковую выдачу; апрельский прогноз давал ~225 k€/МВт/год в 2028). Цены aFRR уже сжаты: ~26 €/МВт/ч (2024) → 13 (2025) → 9 (1H2026) → < 5 к 2030 (Modo, 2026-07). То есть **вспомогательные услуги насыщаются уже сейчас при < 300 МВт батарей** (конкуренция с ГЭС/ГАЭС), задолго до 2031.
3. **Порог насыщения именно DA-спредов для Испании нигде публично не рассчитан** («не найдено»). Аналоги: Калифорния — при прошедших ~10 ГВт BESS насыщены ancillary, выручка 80 → 51 → 40 $/кВт/год (2023→2025), спред TB4 −14 % г/г (Modo, 2026-08); Германия — даже при 78 ГВт «overbuild» средние TB-спреды сжимаются на ~40 %, не коллапсируют (Modo, 2026-01/06); Великобритания — 2 ГВт против потребности 0,6–1,5 ГВт в частотном резерве → −73 % частотных доходов в 2023. Aurora (2025-11): 7,2 ГВт BESS в Испании к 2030 — при пике спроса ~40 ГВт это уровень, на котором в CAISO спреды начали сжиматься. **Допущение:** заметное сжатие DA-спредов в Испании — 2029–2031, а не позже; окно «жирных» merchant-доходов — 2027–2029.

Итог по К8: DA-спреды как таковые к 2031 не «схлопнутся» (солнечный профиль структурный, AleaSoft: батареи «умерят спреды, не уничтожая ценность»), но **совокупная выручка актива, от которой считается revenue-share, вероятно, упадёт в 1,5–2,5 раза с пика 2027 к 2030**. Гипотеза «окно до 2031» держится для DA, но не для стека доходов в целом.

---

## 2. Установленная мощность и пайплайн

### 2.1 Установленная мощность BESS (сетевые батареи, без автопотребления)

| Дата | МВт | МВтч | Источник (год, URL) |
|---|---|---|---|
| конец 2024 | 25 МВт (Modo: «25 MW as of end-2024») / ~29 МВт (El Independiente) | н/д | Modo Energy, 2025 — https://modoenergy.com/research/es/connecting-to-spains-transmission-grid-bess-has-dedicated-headroom ; El Independiente 2026-05-27 |
| апр. 2025 | 28 МВт | н/д | REE через ess-news 2026-04-28 — https://www.ess-news.com/2026/04/28/installed-bess-capacity-in-spain-grew-by-589-since-2025-blackout/ |
| 31.12.2025 | **96 МВт** (батареи) при 3 331 МВт ГАЭС; всего накопители 3 427 МВт = 2,4 % установленной мощности | н/д | REE, Informe del Sistema Eléctrico 2025 (март 2026) — https://www.sistemaelectrico-ree.es/en/electricity-system-report/storage/installed-storage-capacity ; PDF https://www.sistemaelectrico-ree.es/sites/default/files/informes/2026/ise-2025.pdf |
| 31.01.2026 | 72 МВт RdT + 24 МВт RdD = 96 МВт | н/д | REE через pv-magazine.es 2026-02-03 |
| фев. 2026 | 124,5 МВт | н/д | REE через El Periódico de la Energía 2026-02-19 |
| апр. 2026 | 193 МВт (+589 % г/г) | н/д | REE через Fundación Renovables / ess-news 2026-04-28 |
| май 2026 | 221 МВт | н/д | REE через El Periódico de la Energía 2026-05-14 |
| **авг. 2026** | **260,8 МВт** (всего накопители 3 592 МВт); реально торгует ~150 МВт | н/д | REE через El Periódico de la Energía 2026-08-20 — https://elperiodicodelaenergia.com/espana-solo-conecta-40-mw-de-baterias-en-los-ultimos-tres-meses/ |
| прогноз конец 2026 | 334 / 751 / 1 208 МВт (медленный / базовый / быстрый) | н/д | Orka Energía, там же |

Разбивка stand-alone vs co-located в установленной мощности официально не публикуется («не найдено»). По косвенным данным: большинство введённых — гибриды при ФЭС (Iberdrola Campo Arañuelo 58 МВт / 120 МВтч — крупнейшая, 27.05.2026); первый independent stand-alone на рынке — Ignis (2025). Автопотребление (не наш сегмент): 155 → 339 МВтч в 2025 (UNEF/ess-news).

Годовой МВтч по сетевым батареям: «не найдено» в первичных источниках; допущение 2–2,5 ч → 260 МВт ≈ 550–650 МВтч.

### 2.2 Пайплайн по стадиям

| Стадия | МВт | Дата | Источник |
|---|---|---|---|
| Заявки в очереди на доступ (все накопители) | 340 ГВт «в очереди» (AEPIBAL, включая всё) | 11.2025 | pv-magazine.es 2025-12-01 (AEPIBAL Day) |
| Разрешения на доступ выданы — батареи | 16 156 МВт RdT + 8 157 МВт RdD = **24 313 МВт** | 31.01.2026 | REE через pv-magazine.es — https://www.pv-magazine.es/2026/02/03/enero-cerro-con-mas-de-24-gw-de-baterias-con-permisos-en-espana/ |
| В рассмотрении (доступ) | 11 590 МВт RdT + 3 490 МВт RdD = 15 080 МВт | 31.01.2026 | там же |
| То же, AleaSoft | 26 ГВт выдано + 14 ГВт в рассмотрении | 08.2026 | AleaSoft (через Cantabria Económica) |
| Гибридные разрешения / stand-alone (AEPIBAL) | 21 ГВт гибридов («большая часть не будет реализована») + 11 ГВт stand-alone | 11.2025 | pv-magazine.es 2025-12-01 |
| В административной проработке (проекты) | 462 проекта / 7 614 МВт; 53 % stand-alone, 47 % гибриды; средний 18 МВт × 3,2 ч | 02.12.2025 | pv-magazine.es — https://www.pv-magazine.es/2025/12/02/se-tramitan-en-espana-462-proyectos-de-almacenamiento-que-suman-7-614-mw/ |
| То же, обновление | 560 проектов / 9 074 МВт, 3,3 ч; 52 % stand-alone | 02.2026 | El Periódico de la Energía 2026-02-19 |
| С DIA (положит. экол. заключение) | 2 644 МВт | 12.2025 | pv-magazine.es 2025-12-02 |
| С AAC (разрешение на строительство) | 483 МВт (12.2025) → **~2 000 МВт** (08.2026; ~700 МВт выдано только в августе) | 08.2026 | pv-magazine.es 2025-12-02; El Periódico de la Energía 2026-08-20 |
| Опубликовано в BOE (AAP/AAC/DIA) | 4Q25: 26 проектов / 1 840 МВт; 1Q26: 18 / 1 193 МВт; 2Q26: 34 / 1 760 МВт (+140 % г/г) — итого ~4,8 ГВт за 3 квартала | 01–07.2026 | pv-magazine.es (см. источники) |
| Вошли в información pública 1Q26 | 96 проектов / 2 121,5 МВт (+464 % г/г), 98,9 % батареи; 46 проектов с DIA 1 144,6 МВт; 15 с AAC 239,6 МВт | 04.2026 | Opina 360 через ess-news 2026-04-24 |
| Анонсировано до 2029 / с делом в BOE | 10,3 ГВт / 6,4 ГВт | 27.08.2026 | Modo Energy через El Español |
| Субсидировано FEDER (обяз. ввод до 31.12.2029) | 126 проектов, **2,2 ГВт / 9,4 ГВтч**, 818,3 M€; 69 гибридов, 39 stand-alone, 15 тепловых, 3 ГАЭС; 1 750 заявок | 30.12.2025 | MITECO/IDAE — https://www.idae.es/noticias/el-idae-asigna-818-millones-126-proyectos-que-reforzaran-el-almacenamiento-energetico-gran ; pv-magazine.es 2026-01-07 |
| Более ранний раунд (PRTR, 2024–25) | 45 проектов, 690,2 МВт / 2 820 МВтч, 156,4 M€; лидеры Benbros (8), Iberdrola (8), RIC Energy (6) | 2025 | El Periódico de la Energía — https://elperiodicodelaenergia.com/los-benjumea-iberdrola-y-ric-energy-los-grandes-ganadores-de-las-ayudas-a-las-baterias/ |

Вывод по 2028: с учётом лагов (гибрид ~10 мес., stand-alone 16–17 мес. от AAC) и обязательства FEDER «до конца 2029», к концу 2028 в эксплуатации: **пессимистично ~1,5–2 ГВт, базово ~3–4 ГВт, оптимистично 6–7 ГВт** (Modo через El Español: «в 2027 подключится столько же, сколько атомный парк, ~7,1 ГВт» — считаем верхней границей; Orka дал 751 МВт базово на конец 2026). **Допущение** автора: 3,5 ГВт в базе на конец 2028.

---

## 3. Топ владельцев / девелоперов (проекты ≥ 10 МВт)

Ранжирование по найденным МВт (CSV + отраслевые сводки). Полный перечень проектов — в CSV.

| # | Владелец | Найдено МВт (проекты) | Комментарий, статус | Источник |
|---|---|---|---|---|
| 1 | Iberdrola | ~900 МВт в проработке (pv-magazine 12.2025: 903 МВт — №1); в CSV: Oriol 205, Cedillo 215, Tagus I-IV 140, Arenales 95, Campo Arañuelo 58/120 МВтч (оперативно), San Antonio 30/124 МВтч, Majada Alta 30/124 МВтч, Iglesias 30, Andévalo 26 | «operates close to 200 MW» батарей в Испании; своя торговая площадка — маловероятный клиент | iberdrola.com 2026-05-27; pv-magazine.es 2025-12-02 |
| 2 | Enel Green Power España (Endesa) | 580 МВт в проработке (№2, 12.2025); CSV: Navalvillar/Castilblanco/Valdecaballero 3×38,5, Mudéjar 42, Tesouro 17,5, Moeche 10,5; 143 МВт в BOE во 2Q26 | Мудéхар: использует только 265 из 1 202 МВт доступа | pv-magazine.es 2026-07-17; 2026-06-10 |
| 3 | Grenergy | 345 МВт в проработке (№3, 12.2025); Oviedo 150/600 МВтч (стройка, tolling 10 л., 100 M€ долг), Escuderos 680 МВтч (tolling 12 л.), 4×21,9 (Cuenca), Bañuela 21,7 | Испания — 6 ГВтч в пайплайне Greenbox | grenergy.eu 2026-07-22; ess-news 2026-04-27 |
| 4 | Bruc Energy | 240 МВт в BOE 2Q26 + 165 МВт в 1Q26: 10 гибридов по 28–46 МВт (Sevilla/Málaga) | Идеальный размер 10–50 МВт; независимый | pv-magazine.es 2026-07-17, 2026-04-01 |
| 5 | Engie (ex-Rolwind) | Palmosilla 200/800, Cerrillo 78/312 (COD 2028); плюс доступ к флексу 625 МВтч Ignis (10 лет) и 55 МВт/220 МВтч Return (tolling 10 лет) | Engie — оптимизатор-агрегатор, конкурент, не клиент | elconciso.es; ess-news 2026-07-03 |
| 6 | Saeta Yield (Brookfield) | Valle Solar BESS I+II: 92,5 + 167 МВт (AAC) | | pv-magazine.es 2026-04-01 |
| 7 | Solaria | Maira 150, Aquarii 40, Pegaso 31, Castor 20, Santiz 20; 80 МВт в BOE 2Q26 | | pv-magazine.es |
| 8 | Opdenergy | Covatillas 44, Las Regañas 51 (SA), Belinchón 1-3 (3×26,7), Los Belos, Montesol, Miramundo, La Fernandina (24–27 МВт) | серия однотипных 24–27 МВт гибридов | pv-magazine.es |
| 9 | Repsol | Valdesolar 200 МВт (AAC, Badajoz) | | pv-magazine.es 2026-04-01 |
| 10 | RIC Energy | Tagus 2 HBESS 176,4 МВт; Sonora Subirats 23,5 (SA); 6 субсидированных проектов PRTR | | pv-magazine.es 2026-07-17 |
| 11 | Zelestra | SPK Trujillo 109,2 МВт (AAC); 160 МВтч под PPA с EDP | | pv-magazine.es; renewablesnow |
| 12 | Matrix Renewables | Lagerung 101,8 МВт (SA, Girona) | | pv-magazine.es |
| 13 | X-Elio (Brookfield) | BESS Pacheco 105 (Murcia), El Tello 63 (Valencia) | | pv-magazine.es |
| 14 | Our New Energy | La Farga BESS 148,4 МВт (SA, Girona) | | pv-magazine.es 2026-01-12 |
| 15 | FRV | Palau 20 (SA), La Solanilla 17,5/70 МВтч; портфель 1,2 ГВт (сделка 1Q26) | | Modo Capital Markets Q1 2026; RatedPower |
| 16 | ABO Energy | Orcoyen Almacena 73,6 МВт (SA, Navarra) | | pv-magazine.es |
| 17 | Arena Green Power | PB Babor 66 МВт (SA, Cádiz) | | pv-magazine.es |
| 18 | Naturgy | 16 установок, 260 МВт / 689 МВтч в портфеле; стройка Tabernas I-II, Carpio del Tajo, La Nava, El Escobar, Piletas (COD 2026); Villanueva del Rey 22,9 | вертикально интегрирована | energynews.es; pv-magazine.es |
| 19 | Sinne Energy | 97 МВт / 403 МВтч (макс. субсидия PRTR 32,3 M€) | | El Periódico de la Energía |
| 20 | Benbros (Benjumea) | 8 субсидированных проектов PRTR; Solórzano 49,7 | | там же; pv-magazine.es |
| 21 | Ignis | 625 МВтч под соглашение с Engie (COD 2028); Mulhacén 21,6, Broza 10,9; первый независимый оператор SA-батареи (2025) | сам оптимизирует — конкурент | ignis.es; ess-news 2026-07-03 |
| 22 | Elawan | Iniesta 30, Torrijos 20 | | pv-magazine.es |
| 23 | EDP Renováveis | Las Lomillas 36 | | pv-magazine.es |
| 24 | Statkraft | Talayuela II 23,9 (DIA) | | pv-magazine.es |
| 25 | Acciona Energía | Bolarque 24,6 (AAP) / 20 МВт/40 МВтч и 13/26 (COD 2027); уже оперирует батареи (в числе первых) | | pv-magazine.es 2026-08-11 |
| 26 | Galp | Ictio Alcázar II-III 40 | | pv-magazine.es |
| 27 | Aquila Clean Energy | El Cuco 33,6 | | pv-magazine.es |
| 28 | Grupo Jorge | Herrera de los Navarros 35,1 | | pv-magazine.es |
| 29 | Alerion | La Loma 36 | | pv-magazine.es |
| 30 | Jinko Power | портфель 486 МВт stand-alone (на продаже с 03.2026) | | ION Analytics 2026-06-04 |

Не найдено проектов ≥ 10 МВт (в открытых источниках за 2025–26) у: Capital Energy, Nexwell, Finerge, Verbund, Lightsource bp, Sonnedix, Q-Energy, Ingenostrum, Powen, BayWa, Atlantica, Enerfín, Greenalia, Ecoener, Turbo Energy, Sungrow (кроме упоминания как получателя субсидии PRTR), Iberblue, Eranovum (3,6 МВт), Emergy — «не найдено» (поисковый лимит исчерпан; не значит, что проектов нет).

---

## 4. Регионы концентрации и конкурсы

### 4.1 Регионы

| Регион | Показатель | Источник |
|---|---|---|
| Cataluña | 34 % всех разрешений на доступ для stand-alone (2 587 МВт выдано + 3 702 МВт в рассмотрении; UNEF/REE, 03.2025); **2 021 МВт авторизовано** (REE, конец марта 2026) — №1 | elEconomista 2025-03; ess-news 2026-04 |
| Andalucía | 1 439 МВт разрешений SA (2025); №1 по проектам в información pública 1Q26 (630 МВт); 31 субсидированный проект FEDER (№1); Engie Palmosilla/Cerrillo, Bruc ×10 | UNEF; ess-news 2026-04-24; IDAE |
| Extremadura | №1 по МВт в проработке (1 300 МВт, 12.2025); Iberdrola Cedillo/Oriol/Tagus/Arenales/Campo Arañuelo; Zelestra Trujillo; Repsol Valdesolar; 530 МВт в info pública (конец 2025) | pv-magazine.es 2025-12-02 |
| Asturias | 949 МВт в проработке; 1 102 МВт разрешений SA; Grenergy Oviedo 150/600; 15 проектов PRTR | там же |
| Aragón | 832 МВт в проработке; нудо Mudéjar (Andorra); Opdenergy, Alerion, Grupo Jorge | там же |
| Castilla-La Mancha | 633 МВт; №1 по AAC в 3Q25; Cuenca — кластер Opdenergy/Grenergy/Elawan; RIC Tagus 2 | pv-magazine.es; Energética21 |
| C. Valenciana / Galicia | 15 / 11 субсидированных проектов FEDER; Saeta Valle Solar 260 МВт | IDAE |

### 4.2 Конкурсы на мощность доступа (concursos de capacidad de acceso)

- **Специальных конкурсов за мощность доступа для накопителей в 2025–2026 не найдено.** Предложение MITECO 2022 г. о конкурсе на 5,8 ГВт в 17 узлах для ВИЭ+накопителей (с баллами за хранение) — результатов/адъюдикации в открытых источниках «не найдено».
- **Nudos de transición justa:** Mudéjar (Teruel) — 1 202 МВт присуждено в 11.2022; Enel использует лишь 265 МВт; 937 МВт будут перераспределены среди участников осенью 2026 (pv-magazine.es 2026-06-10). Проекты в узлах TJ объявлены «стратегическими установками».
- **Конкурсы доступа для спроса (demanda):** первые 8 узлов на 3 681 МВт (07.2025); первая адъюдикация 26.02.2026 — 928 МВт промышленного спроса в 5 узлах, 3,1 млрд € инвестиций (Modo). Для BESS косвенно: в 75 % узлов сети транспорта мощность исчерпана, свободно 97,5 ГВт «номинально», эффективно 39–95 ГВт (Modo).
- **Гибкий доступ (acceso flexible):** CNMC утвердила 11.08.2026 (в силу с 01.09.2026); заявки накопителей рассматриваются как гибкий доступ по RDL 7/2026, с переходным режимом для уже выданных разрешений. Это может ускорить подключения BESS в перегруженных узлах — плюс для К1.

---

## 5. Сценарии ввода до 2030 и насыщение спредов

### 5.1 Прогнозы ввода BESS (ГВт)

| Источник (дата) | 2026 | 2027 | 2028 | 2030 | Примечание |
|---|---|---|---|---|---|
| PNIEC 2023-2030 (MITECO, 2024) | — | — | — | 22,5 ГВт всех накопителей (18,9 электрич. + 3,6 термосолар); батареи отдельно не выделены; ГАЭС ~10 ГВт → батареи **допущение ~8–9 ГВт** | цель, не прогноз |
| Aurora (Montel, 2025-11-25) | — | — | — | **7,2 ГВт** («72-fold») | «challenge» с финансированием |
| Aurora (Montel, 2024-06) | 0,9 ГВт до 2026 (субсидии) | | | 11 ГВт пайплайн / 6,5 ГВт с доступом | устарело |
| Modo (El Español, 2026-08-27) | | ~7,1 ГВт «подключится в 2027» | | | 10,3 ГВт анонсировано до 2029 — оптимистичный |
| Orka Energía (2026-08-20) | 0,33 / 0,75 / 1,21 | | | | по AAC + лаги |
| AEPIBAL (2025-12) | ~0,5 ГВт в 2026 | | 5 ГВт «за 2–3 года» | | |
| EY Infrastructure Compass (2025-10) | | | | 16 ГВт «в разработке» до 2030 | пайплайн, не ввод |
| enspired (2025) | | | | 14 ГВт планов | |
| SolarPower Europe Outlook 2026-2030 (06.2026) | | | | Испания — топ-5 рынок ЕС к 2030, число не раскрыто; ЕС utility-scale 2025: 19 ГВтч | |

Сценарии автора (**допущение**, синтез): 
- **Пессимизм:** 0,4 ГВт (2026) → 1,2 (2027) → 2,0 (2028) → 3,5 (2030): финансирование, лаги, отказ части субсидированных.
- **База:** 0,75 → 2,0 → 3,5 → 6–7 ГВт (Aurora 7,2).
- **Оптимизм:** 1,2 → 4–7 (Modo) → 7–8 → 10–12 ГВт.

### 5.2 Порог насыщения спредов — что известно

- **Испания, вспомогательные услуги уже насыщаются:** aFRR upward capacity ~26 €/МВт/ч (2024) → ~13 (2025) → ~9 (1H2026) → < 5 (2030) — Modo Jul-26. Modo: выручка 4h-батареи ~366 k€/МВт/год (2027) → ~146 k€ (2030) «as balancing saturates, then recovering on widening day-ahead spreads» (фраза из поисковой выдачи по Modo Jul-26; полный отчёт закрыт). Апрельский прогноз: ~225 k€/МВт/год в 2028; «Day-ahead revenues rise vs Jan-26 before 2030, then fall below it».
- **Испания, DA-спреды:** 73 €/МВтч (2022) → 94 (2025, рекорд) (Modo); +25 % 2024→2025 (RatedPower); июль 2026 — 148 €/МВтч (1h, рекорд, AleaSoft); 2025 среднесуточный Германия ~124 vs Испания ~98 €/МВтч (AleaSoft). ~10 % часов по 0 или ниже (RatedPower). AleaSoft (2026-08-05): рост мощности батарей/ГАЭС/интерконнекторов «will moderate spreads in the future without eliminating the value of storage».
- **Публичной оценки «при X ГВт BESS DA-спред в Испании падает на Y %» не найдено.** Grid Forward (Substack, 2025): к 2030 2h-BESS в Испании — валовая маржа арбитража «approximately 40 €/MW» (ед. изм. в тексте неясны; вероятно k€/МВт/год) — резко ниже текущих.
- **Аналоги:**
  - *Калифорния (CAISO):* 15,7 ГВт / 59,6 ГВтч (конец 2025), 16,2 ГВт (08.2026); выручка ~80 (2023) → 51 (2024) → ~40 $/кВт/год (2025); при прохождении ~10 ГВт насыщены AS; TB4 DA-спред 135 → 116 $/МВт (−14 % г/г, июнь 2026); RA-контракты держат бизнес-кейс (Modo 2026-08; Rabobank).
  - *Германия:* ~2,5 ГВт установлено, 78 ГВт одобрено; overbuild (+50 % к базе 14,3 ГВт к 2030) режет DA-выручку на 17 %, underbuild +11 %; даже при 78 ГВт TB-спреды −40 %, «не коллапс»; доля ancillary 55 % → 5 % к 2030 (Modo 2026-01/06).
  - *Великобритания:* > 150 k£/МВт/год (2022) → ~50 (2023) → 36 (нач. 2024, минимум) → 84 (12.2024) → 41 (02.2026); частотные услуги −73 % в 2023 при 2 ГВт против потребности 0,6–1,5 ГВт (Modo).
- **Перенос на Испанию (допущение):** пик спроса ~40 ГВт, солнце 33+ ГВт; отношение BESS/пик в CAISO при насыщении AS ≈ 20 % → для Испании ~5–8 ГВт. По базовому сценарию это 2029–2031. Насыщение aFRR в Испании наступает ещё раньше — по сути уже в 2026–2028 (конкуренция ГЭС + гидро 17 ГВт + ГАЭС 3,3 ГВт).

---

## 6. Механизм мощности (mecanismo de capacidad) 2026

| Параметр | Значение | Источник |
|---|---|---|
| Статус | **Одобрен Еврокомиссией 29.05.2026** как госпомощь; MITECO готовит implementing orders; REE должна представить анализ покрытия и коэффициенты твёрдости | pv-magazine.es 2026-05-29 — https://www.pv-magazine.es/2026/05/29/la-comision-aprueba-el-mercado-de-capacidad-para-espana/ |
| Бюджет / срок | до 9 000 M€ за 2026–2036 (~900 M€/год), 10 лет с мая 2026 | там же |
| Формат | аукционы pay-as-bid; три типа: главный (новые активы, контракты до половины срока жизни, макс. 15 лет; ранее говорили о 9-летних), корректирующий (1 год, существующие), переходный (5 лет, проекты с AAP) | Modo — https://modoenergy.com/research/es/spains-upcoming-capacity-market-what-we-know-so-far |
| Ориентир цены | ~20 000 €/МВт/год (memoria técnica; 800–900 M€/год) | El Español 2025-09-19; Modo |
| Допуск батарей | да, наравне с генерацией и спросом; обязательство доступности в «stress hours» (≤ 10 % часов года, публикуются заранее) | Modo |
| Derating (оценка Modo для поставки 2032) | 2h BESS 0,33–0,41; 4h 0,55–0,68; первые оценки REE 0,27–0,70 | Modo — https://modoenergy.com/research/en/spains-capacity-market-bess-derating-factors |
| Сроки | первая главная субаста — ожидается **2027** (Energía Estratégica; Modo: «если одобрено в 2026 и субаста в 2027, delivery ~2032»); отрасль надеялась на конец 2026 | energiaestrategica.com; Modo |
| Влияние на бизнес-кейс | 2h: ~0,37 × 20 k€ ≈ **7–8 k€/МВт/год**; 4h ≈ 11–14 k€/МВт/год — т. е. **~3–8 % выручки**, а не якорь (в GB CM ≈ 10–15 % выручки). Elperiódico (2026-06-08): «no sustituirá al análisis integral de ingresos, ni convertirá automáticamente cualquier proyecto BESS en financiable». Не финализированы derating, штрафы, гарантии | там же |

Следствие для гипотезы: механизм мощности добавляет предсказуемый, но небольшой доход и вводит ограничение на диспетчеризацию в stress-hours — задача для оптимизатора (co-optimisation), но не спасение от сжатия merchant-выручки. Главная альтернатива для бэнкабельности сейчас — **tolling / floor-контракты с utilities** (Grenergy–«IG utility» 10 и 12 лет; Engie–Ignis 625 МВтч; Engie–Return 55 МВт/220 МВтч), где диспетчеризацию берёт оффтейкер.

---

## 7. TAM / SAM / SOM

### 7.1 Бенчмарки выручки BESS в Испании (публичные)

| Источник | Значение | Комментарий |
|---|---|---|
| Modo Energy Apr-26 forecast | 4h stand-alone ~**225 k€/МВт/год в 2028** (Jan-26: ~190 k€) | прогноз; Jul-26 ниже в 2028 из-за обвала aFRR, выше после 2031 |
| Modo Jul-26 (через поисковую выдачу) | 4h: ~366 k€/МВт/год (2027) → ~146 k€ (2030) | требует проверки в Terminal |
| ION Analytics / Infralogic (2026-06-04) | «annual revenues in excess of EUR 150,000/MW in the first few years»; цены RTB-проектов 42 k€/МВт (3Q24) → 71,5 k€ (1Q26, до 112 k€) | оценка рынка сделок |
| Tolling-сделки (общеевропейский ориентир, EnkiAI 2026) | 2 500–10 000 €/МВт/мес ≈ 30–120 k€/МВт/год | Испанские ставки не раскрыты |
| European BESS Index (03.2026) | Испания 28–48 k€/МВт/год (100 МВт / 200 МВтч, trailing 12m до 1Q26) | вторичный агрегатор, методика непрозрачна; противоречит Modo/ION — вероятно, только энергия без aFRR |
| Grid Forward (2025) | арбитраж 2h к 2030 «~40 €/MW» (вероятно k€) | пессимистичный взгляд |

**Рабочее допущение** для расчёта: 150–250 k€/МВт/год в 2027–2028 (совпадает с Modo/ION), **снижение до 100–150 k€ к 2030**. Для 2h-систем (большинство гибридов 10–50 МВт) — нижняя граница диапазона.

### 7.2 Расчёт (допущения помечены)

| Уровень | МВт | Логика | Выручка активов | Комиссия 10–20 % |
|---|---|---|---|---|
| **TAM 2028 (база)** | ~3 500 МВт установлено (допущение, п. 5.1) | все сетевые BESS Испании | 3,5 ГВт × 150–250 k€ = 525–875 M€/год | **52–175 M€/год** |
| TAM 2030 (база) | ~6 500 МВт | то же | 6,5 ГВт × 100–150 k€ = 650–975 M€ | 65–195 M€/год |
| **SAM 2028** | ~1 200–1 600 МВт | доля 10–50 МВт ≈ 35–45 % МВт (в CSV 56 из 78 проектов, 1,64 из 4,4 ГВт = 37 %); минус вертикально интегрированные (Iberdrola, Endesa, Naturgy, Repsol, EDP, Engie ≈ 35–40 % МВт) и минус проекты под tolling (диспетчеризация у оффтейкера) | 1,4 ГВт × 150–250 k€ = 210–350 M€ | **21–70 M€/год** |
| **SOM 2028–2029** | 80–160 МВт (5–10 % SAM; 3–6 клиентов по 20–40 МВт) | реалистичная доля нового софт-игрока против Engie, Ignis, Enel X, Axpo, Alpiq, Flexidao/Enspired и in-house | 100–160 МВт × 150–250 k€ = 15–40 M€ | **1,5–8 M€/год ARR** (при 20 % — верх) |
| SOM 2030 при сжатии | 150–300 МВт | рост доли, но выручка/МВт −40 % | 15–45 M€ | 1,5–9 M€/год |

Чувствительность: если сбудется пессимистичный ввод (2 ГВт к 2028) и выручка 100–150 k€ — SAM ≈ 0,7 ГВт × 100–150 k€ × 10–20 % = **7–21 M€/год**, SOM ≈ 0,5–2 M€ ARR. Это порог, на котором revenue-share-модель для нишевого стартапа перестаёт масштабироваться.

---

## 8. Что говорит против гипотезы

1. **Разрыв между бумагой и железом.** 24 ГВт разрешений vs 261 МВт в работе (авг. 2026) и всего +40 МВт за лето; AEPIBAL сам говорит, что «большая часть» из 21 ГВт гибридных разрешений не будет реализована. Клиентов, которым реально нужен оптимизатор *сегодня*, — десятки МВт, а не гигаватты; продажи 2026–2027 будут «в пайплайн», без выручки.
2. **Насыщение aFRR наступает раньше, чем рынок появился.** Цены aFRR упали втрое 2024→1H2026 при < 300 МВт батарей (Modo). Modo прогнозирует падение выручки 4h-батареи с ~366 к ~146 k€/МВт/год к 2030 — комиссия от выручки сжимается вместе с ней.
3. **Tolling и «flex purchase» уводят диспетчеризацию к utilities.** Все крупные сделки 2026 (Grenergy 150/600 и 680 МВтч, Engie–Ignis 625 МВтч, Engie–Return 220 МВтч) — 10–12-летние контракты, где оффтейкер (Engie, «IG utility») сам торгует. Банки требуют именно этого («BESS financing pivoted from merchant to tolling»). Целевой сегмент независимых merchant-владельцев 10–50 МВт может оказаться узким.
4. **Крупнейшие владельцы — вертикально интегрированные.** Iberdrola (№1 по пайплайну, ~200 МВт в работе), Endesa/Enel, Naturgy, Repsol, EDP, Engie имеют свои торговые площадки; они — 35–40 % МВт и не купят revenue-share.
5. **Гибриды доминируют (69 из 108 субсидированных батарейных проектов; ~50 % пайплайна).** У гибрида при ФЭС оптимизация ограничена PPA/узлом и часто уже зашита в контракт с оффтейкером/EPC (Zelestra–EDP, Grenergy–Galp PPA); ценность отдельного ИИ-оптимизатора ниже, чем для stand-alone.
6. **Механизм мощности мал и поздний:** ~20 k€/МВт/год × derating 0,33–0,68 ≈ 7–14 k€/МВт/год, первая субаста 2027, поставка возможно 2032 — не компенсирует сжатие merchant-доходов до 2031.
7. **Прецеденты:** CAISO −50 % выручки за два года при 10–16 ГВт; GB −67 % за год (2022→2023). Испания — «2–3 года позади кривой насыщения» (Grid Forward). Уверенность, что «до 2031 не схлопнется», основана на модельных прогнозах Modo/Aurora, которые уже дважды пересматривались за 2026 (Jan → Apr → Jul).
8. **Порог насыщения DA-спредов для Испании публично не рассчитан** — К8 нельзя ни подтвердить, ни опровергнуть первичным источником; «не найдено».

Что говорит «за» (для честности): структурно самые широкие спреды в Европе (148 €/МВтч в июле 2026), слабые интерконнекторы (3 ГВт с Францией, 68 % времени перегружены), CNMC-гибкий доступ с 09.2026, 2,2 ГВт субсидированных проектов с дедлайном 2029, и рост цен RTB-проектов на 70 % за 18 месяцев — рынок объективно стартует в 2027–2028.

---

## 9. Источники (обращение 2026-09-05)

Первичные / официальные:
- REE, Informe del Sistema Eléctrico 2025 (март 2026): https://www.sistemaelectrico-ree.es/sites/default/files/informes/2026/ise-2025.pdf ; страница по накопителям: https://www.sistemaelectrico-ree.es/en/electricity-system-report/storage/installed-storage-capacity
- REE, Conoce la capacidad de acceso: https://www.ree.es/es/clientes/generador/acceso-conexion/conoce-la-capacidad-de-acceso
- MITECO, Informe del Operador del Sistema, marzo 2026 (PDF, не распарсен): https://www.miteco.gob.es/content/dam/miteco/es/energia/files-1/electricidad/Informes_Operador/2026/Marzo_2026.pdf
- IDAE, 818 M€ / 126 проектов (2025-12-30): https://www.idae.es/noticias/el-idae-asigna-818-millones-126-proyectos-que-reforzaran-el-almacenamiento-energetico-gran
- MITECO, 700 M€ convocatoria (2025-05): https://www.miteco.gob.es/en/prensa/ultimas-noticias/2025/mayo/el-miteco-lanza-700-millones-en-ayudas-para-almacenamiento-energ.html
- CNMC, acceso flexible (2026-08-11): https://www.cnmc.es/prensa/permisos-acceso-flexibles-20260811
- BOE-A-2026-17875 (Bañuela 21,69 МВт, 20.07.2026): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-17875
- BOE-A-2026-9170 (Hibridación Zafra 24,04 МВт, Opdenergy): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-9170
- Iberdrola España, Campo Arañuelo 58 МВт/120 МВтч (2026-05-27): https://www.iberdrolaespana.com/sala-comunicacion/noticias/inauguracion-mayor-bateria-almacenamiento-energia-espana-campo-aranuelo-caceres
- Grenergy, Oviedo 100 M€ (2026-07-22): https://grenergy.eu/grenergy-secures-the-first-financing-for-a-stand-alone-battery-energy-storage-project-in-spain-worth-e100-million/
- Ignis–Engie (2026-07): https://ignis.es/en/engie-and-ignis-sign-a-long-term-agreement-for-battery-energy-storage-in-spain/
- Transición Justa, Nudo Mudéjar: https://www.transicionjusta.gob.es/en/adjudicacion-del-nudo-mudejar-de-transicion-justa-.html

Отраслевые / аналитика:
- pv-magazine.es 2026-02-03 (24 ГВт разрешений): https://www.pv-magazine.es/2026/02/03/enero-cerro-con-mas-de-24-gw-de-baterias-con-permisos-en-espana/
- pv-magazine.es 2025-12-02 (462 проекта / 7 614 МВт): https://www.pv-magazine.es/2025/12/02/se-tramitan-en-espana-462-proyectos-de-almacenamiento-que-suman-7-614-mw/
- pv-magazine.es BOE 3Q25: https://www.pv-magazine.es/2025/10/10/se-anuncio-la-construccion-de-8-proyectos-bess-con-un-total-de-47325-mw-en-el-3t-en-espana/
- pv-magazine.es BOE 4Q25: https://www.pv-magazine.es/2026/01/12/boe-26-proyectos-de-almacenamiento-en-el-4t-de-2025-con-184-gw/
- pv-magazine.es BOE 1Q26: https://www.pv-magazine.es/2026/04/01/el-boe-publica-en-el-primer-trimestre-18-proyectos-de-almacenamiento-bess-que-suman-1-193-mw/
- pv-magazine.es BOE 2Q26: https://www.pv-magazine.es/2026/07/17/boe-34-proyectos-almacenamiento-con-176-gw-bess-publicados-en-el-segundo-trimestre-de-2026/
- pv-magazine.es 2026-01-07 (908 M€ ayudas): https://www.pv-magazine.es/2026/01/07/miteco-impulsa-el-almacenamiento-energetico-con-908-millones-en-ayudas-a-proyectos-a-gran-escala-y-bombeo-innovador/
- pv-magazine.es 2026-05-29 (mercado de capacidad): https://www.pv-magazine.es/2026/05/29/la-comision-aprueba-el-mercado-de-capacidad-para-espana/
- pv-magazine.es 2025-12-01 (AEPIBAL Day): https://www.pv-magazine.es/2025/12/01/aepibal-day-2025-a-las-puertas-del-gran-salto/
- pv-magazine.es 2026-06-10 (Mudéjar 937 МВт): https://www.pv-magazine.es/2026/06/10/el-primer-concurso-de-transicion-justa-pierde-el-78-de-su-potencia-937-mw-del-nudo-mudejar-se-reasignaran/
- pv-magazine.es 2026-08-11 (Acciona): https://www.pv-magazine.es/2026/08/11/acciona-construira-dos-nuevas-baterias-en-espana-y-tambien-un-centro-de-datos-con-solar/
- pv-magazine.es 2025-10-13 (EY 16 ГВт): https://www.pv-magazine.es/2025/10/13/espana-desarrolla-16-gw-de-bess-hasta-2030-el-29-del-total-mundial-segun-ey/
- El Periódico de la Energía 2026-08-20 (260,8 МВт; 2 ГВт AAC; лаги): https://elperiodicodelaenergia.com/espana-solo-conecta-40-mw-de-baterias-en-los-ultimos-tres-meses/
- El Periódico de la Energía 2026-05-14 (221 МВт): https://elperiodicodelaenergia.com/espana-ya-tiene-conectados-mas-de-200-mw-de-baterias
- El Periódico de la Energía 2026-02-19 (124,5 МВт; 9 074 МВт/560 проектов): https://elperiodicodelaenergia.com/comienza-la-era-de-las-baterias-en-espana-ya-hay-conectados-125-mw/
- El Periódico de la Energía (PRTR: 45 проектов, 690 МВт/2 820 МВтч): https://elperiodicodelaenergia.com/los-benjumea-iberdrola-y-ric-energy-los-grandes-ganadores-de-las-ayudas-a-las-baterias/
- El Periódico de la Energía 2026-06-08 (bancabilidad CM): https://elperiodicodelaenergia.com/el-mercado-de-capacidad-una-nueva-pieza-para-la-bancabilidad-de-las-baterias-pero-no-la-solucion-definitiva
- El Español 2026-08-27 (Modo: 7,1 ГВт в 2027; 10,3/6,4 ГВт): https://www.elespanol.com/invertia/empresas/energia/20260827/cuenta-baterias-espana-conectara-capacidad-parque-nuclear-existente/1003744364025_0.html
- El Español 2025-09-19 (CM ~20 000 €/МВт): https://www.elespanol.com/invertia/empresas/energia/20250919/mercado-capacidad-baterias-ciclos-podria-meses-solo-falta-ok-bruselas-ayuda/1003743931104_0.html
- ess-news 2026-04-28 (589 %): https://www.ess-news.com/2026/04/28/installed-bess-capacity-in-spain-grew-by-589-since-2025-blackout/
- ess-news 2026-04-24 (Opina 360, 1Q26): https://www.ess-news.com/2026/04/24/battery-energy-storage-project-pipeline-in-spain-surges-464-year-on-year/
- ess-news 2026-07-17 (2Q26): https://www.ess-news.com/2026/07/17/spain-adds-1-76-gw-of-battery-storage-projects-in-q2/
- ess-news 2026-07-10 (июнь 1 ГВт): https://www.ess-news.com/2026/07/10/spain-publishes-notices-for-1-gw-of-battery-storage-projects-in-june/
- ess-news 2026-04-27 (Grenergy tolling): https://www.ess-news.com/2026/04/27/grenergy-signs-12-year-tolling-deal-for-spanish-hybrid-project-with-680-mwh-bess/
- ess-news 2026-07-03 (Ignis–Engie): https://www.ess-news.com/2026/07/03/ignis-engie-sign-long-term-battery-storage-deal-in-spain/
- Energética21 (Opina 360, 3Q25): https://energetica21.com/noticia/almacenamiento-despega-espana-casi-3500-mw-nuevos-proyectos-300-mw-autorizados-tercer-trimestre/
- elEconomista 2025-03 (UNEF: Cataluña 34 %): https://www.eleconomista.es/energia/noticias/13256816/03/25/cataluna-gana-terreno-en-almacenamiento-tras-la-prohibicion-a-las-renovables.html
- El Conciso (Engie–Rolwind): https://www.elconciso.es/energia/engie-rolwind-proyectos-almacenamiento-bateria-tarifa-alora_0_2006423189.html
- Modo Energy, Spain BESS Forecast Jul-26: https://modoenergy.com/research/en/spain-bess-forecast-jul-26
- Modo Energy, Spain BESS Forecast Apr-26: https://modoenergy.com/research/en/spain-bess-forecast-april-2026
- Modo Energy, Iberia «Why no batteries» (2025-06): https://modoenergy.com/research/en/jun-2025-iberia-spain-bess-battery-energy-storage-buildout-capex-hydro-transmission-solar-prices
- Modo Energy, Spain capacity market: https://modoenergy.com/research/es/spains-upcoming-capacity-market-what-we-know-so-far ; derating: https://modoenergy.com/research/en/spains-capacity-market-bess-derating-factors
- Modo Energy, grid headroom Spain: https://modoenergy.com/research/es/connecting-to-spains-transmission-grid-bess-has-dedicated-headroom
- Modo Energy, Germany overbuild (2026-01): https://modoenergy.com/research/en/january-2026-germany-fundamentals-risk-overbuild-bess-revenue-cannibalisation ; livestream 06.2026: https://modoenergy.com/research/en/june-2026-german-battery-storage-livestream-key-takeaways
- Modo Energy, CAISO 2026: https://modoenergy.com/research/en/caiso-battery-storage-2026-things-to-watch
- Modo Energy, GB Feb-2026 (£41k): https://modoenergy.com/research/en/me-bess-gb-revenues-february-2026-wholesale-battery-energy-storage-balancing-mechanism
- Modo Energy, European BESS Capital Markets Q1 2026: https://modoenergy.com/research/en/european-bess-capital-markets-report-q1-2026
- Aurora via Montel 2025-11-25 (7,2 ГВт): https://montelnews.com/see/news/b6e94217-cb9d-4a1a-a816-5d9c14b4920b/spain-battery-capacity-to-rise-72-fold-to-7-2-gw-by-2030-aurora ; 2024-06-04 (11 ГВт): https://montelnews.com/news/37034e31-2ad4-418b-9b5f-d60e5bb9e2b5/spains-battery-project-pipeline-reaches-11-gw-aurora
- AleaSoft 2026-08-05 (148 €/МВтч): https://aleasoft.com/record-spreads-july-spain-portugal/
- RatedPower (Iberia BESS price curve): https://ratedpower.com/blog/iberia-bess-price-curve/
- ION Analytics 2026-06-04: https://ionanalytics.com/insights/infralogic/spanish-solar-project-prices-plummet-as-bess-values-soar/
- Grid Forward (Substack): https://gridforward.substack.com/p/the-revenue-illusion-in-battery-storage
- European BESS Index (вторичный): https://europeanbessindex.com/bess-revenue-europe
- enspired, BESS in Spain: https://www.enspired-trading.com/blog/bess-in-spain
- Energía Estratégica (subastas 2027): https://www.energiaestrategica.com/es/notes/subasta
- SolarPower Europe Outlook 2026-2030 (ees-europe summary): https://www.ees-europe.com/news/european-bess-market-2026-2030
- Rabobank (Spain BESS; CA saturated) — 403, не прочитано: https://www.rabobank.com/knowledge/d011476239-backup-power-for-europe-part-4-spain-s-bess-market-is-heating-up

---

## 10. Открытые вопросы

1. **Официальная разбивка установленных батарей stand-alone / гибрид и МВтч** — REE публикует только МВт; нужен запрос к REE/esios или Orka.
2. **Точный порог насыщения DA-спредов для Испании** — нужен доступ к Modo Terminal / Aurora Chronos (сценарии GW→спред). Ключевой параметр для К8.
3. **Полный текст Modo Jul-26**: подтверждение траектории 366 → 146 k€/МВт/год и разбивка DA vs aFRR (сейчас — из поисковой выдачи).
4. **Доля пайплайна под tolling/flex-контрактами** vs merchant — определяет реальный SAM; нет агрегированных данных.
5. **Сроки и параметры первой субасты механизма мощности** (derating, stress hours, штрафы) — orden MITECO ещё не опубликован.
6. **Результаты конкурсов доступа для генерации/накопителей (5,8 ГВт / 17 узлов)** и перераспределение 937 МВт Mudéjar (осень 2026).
7. **Проекты ≥ 10 МВт у Capital Energy, Nexwell, Verbund, Sonnedix, Q-Energy, Lightsource bp, Iberblue и др.** — не проверено из-за исчерпания поискового лимита.
8. **Бенчмарк фактической выручки работающих испанских батарей 2025–2026** (не прогноз) — Modo/Orka индекс по Испании публично не найден.
9. **Отсев субсидированных проектов** (доля отказов от FEDER-грантов к 2027) — сильно влияет на базу 2028.
