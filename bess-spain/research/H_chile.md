# Блок H. Чили как второй рынок для ИИ-оптимизатора диспетчеризации BESS

Дата исследования: 2026-09-05. Все URL проверены в этот день, если не указано иное. Пометка «допущение» — наша оценка, не источник.

## 1. Вердикт

**«Другой продукт, не сейчас».** Чили — один из самых быстрорастущих BESS-рынков мира (≈2,3 ГВт в работе + 2,5 ГВт на испытаниях + 4,7 ГВт в стройке на июнь 2026), но это **не рынок ставок**. Диспетчеризация централизованная: Coordinador Eléctrico Nacional (CEN) сам рассчитывает «costo de oportunidad» батареи и сам задаёт профиль заряда/разряда; с DS 32/2025 (опубликован 17.06.2026) это закреплено явно, а самодиспетч (autodespacho) разрешён только системам ≤9 МВт. Значит, ядро испанского продукта — прогноз цен + оптимизация ставок на день-вперёд/внутридневном/балансирующем рынках — в Чили **нечего оптимизировать**. Остаются второстепенные рычаги (SSCC-аукционы, параметры декларации, capacity credit, портфель контрактов), под которые нужен другой продукт (revenue assurance / settlement & contract analytics), другая интеграция (не биржа, а платформы CEN) и другая модель монетизации (revenue share на «аплифт от ставок» не работает, если ставок нет). Дополнительно: сегмент 10–50 МВт в Чили тонкий — типичный проект 100–430 МВт, а ниже 9 МВт действует другой режим (PMGD/autodespacho). Пересматривать не раньше, чем (а) CEN/CNE введут обязательную «явную методологию costo de oportunidad с участием владельца» или рыночные ставки (это обсуждается: предложения SPEC/ACERA 2026), и (б) заработают аукционы CPF с 2026 г. и новые SSCC с 2027 г.

## 2. Мощность и пайплайн

| Показатель | Значение | Источник |
|---|---|---|
| В работе, конец марта 2025 | 954 МВт | pv magazine, 28.04.2025 (по данным Min. Energía) |
| В работе, нояб. 2025 | 1 474 МВт / 6,1 ГВтч (+846 МВт / 2 872 МВтч в пусконаладке) | americasmi.com (агрегатор; по данным CNE), обращение 05.09.2026 через поисковую выдачу — первичный документ не открыт |
| В работе, дек. 2025 | 1 575 МВт в работе, 737 МВт в испытаниях, 6 770 МВт в стройке | Reporte Minero/ACERA balance 2025, янв. 2026 (через поисковую выдачу) |
| В работе + испытания, март–апр. 2026 | **3 072 МВт / 13 528 МВтч** («Hay 3.072 MW de capacidad BESS en el sistema, operando y en pruebas») | CEN, презентации 25.03.2026 и 15.04.2026 (первичный) |
| Установлено, 31.03.2026 | 2 156 МВт; лидеры: Engie 487 МВт, AES Andes 470 МВт, Enor Chile 405 МВт | Redimin 21.08.2026 (цитирует отчёт Min. Energía) |
| В работе, март 2026 (реестр CNE, МВтч) | 8 786 МВтч | CNE via Reporte Minero 11.05.2026 |
| **Июнь 2026 (Reporte Min. Energía, корте 30.06.2026)** | **2 291 МВт в работе; 2 524 МВт / 11 773 МВтч в испытаниях (27 систем); 4 705 МВт / 19 223 МВтч в стройке (33 проекта, $3,86 млрд); 17 проектов в SEIA на 3 550 МВт / 19 024 МВтч** | pv magazine LatAm 28.07.2026 (по отчёту Min. Energía) |
| Декларировано в стройке (CNE, май 2026) | 73 проекта BESS, 5 728 МВт нетто | CNE Reporte Mensual via Reporte Minero 01.07.2026 |
| Прогноз CEN до дек. 2026 | +2 400 МВт батарей (в дополнение к 3 072 МВт); солнце +5 400 МВт | CEN, 15.04.2026 |
| Прогноз CNE на конец 2026 / 2027 | >20 000 МВтч / >25 000 МВтч; +12 978 МВтч за май–дек. 2026 | CNE via Reporte Minero 11.05.2026 |
| Прогноз ACERA | +8 ГВт в 2026, +1,49 ГВт в 2027; ≈9 ГВт к 2027 | Energía Estratégica (через поисковую выдачу; статья за пейволом) |

Итог по мощности: **конец 2024 ≈ 0,8–1,0 ГВт; конец 2025 ≈ 1,5–1,6 ГВт в работе (2,3 ГВт с испытаниями); конец 2026 ≈ 5 ГВт (CEN: 3,07 + 2,4); 2027 ≈ 9 ГВт (ACERA)**. Цель 2 ГВт-2030 закрыта 31.03.2026; 6 ГВт-2050 — ожидается к концу 2026/началу 2027 (Min. Energía).

Крупнейшие объекты/владельцы (первичные и отраслевые источники): AES Andes — 756 МВт в работе после Bolero 146 МВт/3ч (авг. 2026), Hub Andes Solar 510 МВт (Fluence, 5ч), Cristales 340 МВт/1 360 МВтч и Pampas 340 МВт/1 360 МВтч в стройке; Engie — 487 МВт (Coya, Tamaya, BESS Lile 140 МВт анонсирован); Grenergy — Oasis de Atacama (2 ГВт PV / 11 ГВтч, фазы; Elena I 430 МВт/3 010 МВтч на испытаниях; Gabriela 272 МВт/1,1 ГВтч продана CVC DIF за $475 млн, 02.09.2026); Colbún — Diego de Almagro (Wärtsilä), Chaca 228 МВт/912 МВтч; Enel — Azabache 94 МВт; Atlas — BESS del Desierto (первый standalone, апр. 2025), Copiapó 233 МВт/932 МВтч; Acciona — 200 МВт/1 000 МВтч; CIP — 1,1 ГВтч; Zelestra/Sungrow — 1 ГВтч; Innergex, Sonnedix, Mainstream, Ibereólica, Pacific Hydro, Statkraft — конкретные BESS-МВт в открытых источниках за этот прогон **не найдено**.

## 3. Структура доходов и роль оптимизации

**Рынок энергии.** В Чили нет биржи: CEN централизованно диспетчирует по аудированным/декларированным затратам и публикует costo marginal по узлам; владелец BESS получает разницу между стоимостью зарядки и разряда по costo marginal — но **профиль задаёт CEN**. Цитаты первичных документов CEN (25.03.2026, 15.04.2026): «El Coordinador determina la operación (perfil carga y descarga) de los sistema de almacenamiento con el objetivo de contribuir a una operación segura y a mínimo costo del sistema». DS 32/2025 (Diario Oficial 17.06.2026, по обзору Garrigues): «el coordinador deberá incorporar en la programación de la operación a los SAE ... determinando centralizadamente los horarios de carga y descarga»; «costo de oportunidad, que es calculado por el coordinador para minimizar el costo presente y futuro esperado»; «los SAE ... con capacidad de inyección de hasta 9 MW podrán optar por un régimen de autodespacho». Ранее (DS125, обзор Guía Chile Energía) владелец мог *предлагать* программу зарядки, CEN её «учитывал» — теперь и это перешло к оператору. SPEC (2026) предлагает сделать методологию costo de oportunidad явной и обязательной в списке merit order — то есть рынок сам признаёт, что владелец сегодня не управляет арбитражем.

**Pagos por potencia (capacity).** Ley 21.505 (2022) + DS 70 (05.06.2024) включили standalone-BESS в оплату мощности; 10-летний переходный режим: Potencia de Suficiencia = макс. мощность × процент признания по длительности (Garrigues, DLA Piper, Carey). По Aurora (апр. 2025): 5-часовые батареи получают полный capacity payment до 2034 г.; точная таблица процентов для 1–4 ч — **не найдено** (BCN не отдала текст). Цена мощности ~USD 8/кВт-мес ≈ USD 90–96/кВт-год (americasmi, агрегатор; Decreto 4T/2026 CNE не открыт — диапазон, не факт). Доля в выручке standalone-BESS ≈15% capacity / 85% арбитраж (americasmi; агрегатор). Оптимизировать здесь можно только доступность в пиковые часы и выбор длительности при проектировании.

**SSCC.** Аукционы CPF/CSF/CTF существуют, но ставка — только «costos de desgaste» с потолками, а costo de oportunidad возмещается ex post (Informe SSCC 2026, CEN, 30.06.2025: «el actual esquema de subastas para SSCC de CF se circunscribe a ofertas de costos de desgaste, sujetos a valores máximos»). CPF+ переходит с прямой инструкции на аукционы с 2026 г.; новые SSCC — процесс на 2027 г. (CEN, дек. 2025). Aurora: «el diseño del mercado chileno no incentiva a las baterías a prestar estos servicios» — в отличие от рынков, где SSCC дают до 30% выручки. То есть SSCC-слой мал и слабо «оптимизируем».

**PPA/контракты.** Основная модель — гибридные PPA (пример: Gabriela, 15 лет) и контракты с горнодобытчиками; продажа по costo marginal узла; контрактная позиция хеджируется физикой. Здесь есть спрос на аналитику «портфель контрактов × узловые цены × расчёты CEN», но это не ставки.

**Curtailment.** Вертимиенто 2025: 6 205 ГВтч (−0,3% к 2024; +133% к 2023), 48,3% — Antofagasta, 28,4% — Atacama; BESS выдали ≈2 ТВтч и сняли ≈24% потенциального вертимиенто (Broker & Trader via Reporte Minero, 21.01.2026). Декабрь 2025: 806,6 ГВтч = 25,4% солнца+ветра. Спред: дневной costo marginal ≈0, ночной ≈USD 100/МВтч (BNamericas/Funds Society). Спред большой — но забирает его CEN-оптимизация, а не ставки владельца.

**Что реально оптимизирует владелец в Чили:** (1) декларируемые параметры (КПД, ограничения, доступность, ремонты) и корректность моделей RMS/EMT — CEN прямо предупреждает, что услуги BESS «se verán limitados» без них; (2) участие в SSCC-аукционах; (3) capacity credit (длительность, доступность в пиковые часы); (4) контрактный портфель/расчёты ex post; (5) для ≤9 МВт — autodespacho (другой сегмент, PMGD). Это продукт класса «revenue assurance + settlement + contract analytics», не «bid optimizer».

## 4. Кто управляет BESS сейчас

- **Собственные команды utilities + EMS вендоров.** AES Andes — Fluence (Andes Solar, 6-gen stack; какой софт диспетчирует — Mosaic/OS — в блоге Fluence не указано; Mosaic заявлен только для NEM, CAISO, ERCOT, Japan). Colbún — Wärtsilä GEMS (Diego de Almagro, 8 МВт/32 МВтч, 2022; GEMS «determines the most economical periods to dispatch» — де-факто в рамках программы CEN). Zelestra — Sungrow (1 ГВтч). Tesla Autobidder в Чили — **не найдено**.
- **Европейские оптимизаторы:** enspired — рынки FR, ES, GR, PL, NL, RO, IT, DE, AT, BE; «No mention of Chile, Latin America» (пресс-страница enspired, 05.09.2026). Entrix, Capalo, Habitat Energy в Чили — **не найдено**.
- **Чилийские софт-компании:** в рознице/C&I — Battex, Cinergia, Cynersis, Terralink (EMS для клиентов за счётчиком, не utility-scale). Отдельного «оптимизатора для utility-scale BESS» в Чили **не найдено** — что логично при централизованном диспетче. Аналитика/консалтинг: Aurora, Systep/GIE, Broker & Trader Energy Chile.

## 5. Что говорит против (и за)

**Против:** (1) нет ставок — CEN сам считает costo de oportunidad и профиль (DS 32/2025); autodespacho ≤9 МВт; (2) SSCC — ставки только на износ с потолками, opportunity cost ex post; (3) сегмент 10–50 МВт почти пуст: проекты 100–430 МВт, ниже 9 МВт — PMGD; (4) владельцы — крупные utilities с in-house аналитикой и EMS вендоров (Fluence, Wärtsilä, Sungrow); (5) capacity — 15% выручки, определяется длительностью/доступностью, не софтом; (6) revenue share «от аплифта» не измерить, когда базовый профиль задаёт оператор.
**За:** (1) рост 2→9 ГВт за 2025–2027 и $3,75 млрд годового оборота рынка (CEN); (2) регулятор движется к «явному» costo de oportunidad и аукционам CPF (2026) / новым SSCC (2027) — окно может открыться в 2027–2028; (3) сильный curtailment и спреды 0→100 $/МВтч; (4) язык и юрисдикция близки к Испании (Grenergy, Acciona, Zelestra, Sonnedix, Ibereólica, Engie, Enel — общие клиенты); (5) реальная незакрытая боль — расчёты ex post, декларации, контракты, capacity — под неё можно сделать другой модуль.

**Что пришлось бы поменять в продукте:** заменить «прогноз цен + ставки» на «прогноз costo marginal по узлам + расчёт ex-post выручки + оптимизация деклараций/доступности/SSCC-офферов + контрактный портфель»; интеграция с платформами CEN (Infotécnica, programación, transferencias económicas), не с OMIE/ESIOS; монетизация — SaaS/подписка или доля от SSCC/капасити, а не от арбитражного аплифта.

**Размер призового фонда (допущение, метод):** база ≈5 ГВт (конец 2026) → 9 ГВт (2027). Выручка владельца ≈ USD 150–200 тыс./МВт-год (допущение: арбитраж 1 цикл/день × 4 ч × 365 × $60–80/МВтч ≈ $90–115 тыс. + capacity $60–95 тыс.) → валовая BESS-выручка Чили ≈ $0,75–1,0 млрд/год к 2027 (допущение). Контестируемая софтом доля при централизованном диспетче — 3–5% (SSCC + декларации + capacity + расчёты; допущение) ≈ $25–50 млн/год аплифта; при доле 20–30% → **$5–15 млн/год на всех поставщиков**, из них сегмент 10–50 МВт (<10% МВт) → **≈$0,5–1,5 млн/год**. Для сравнения: если бы Чили ввела рыночные ставки, контестируемая доля выросла бы до 10–20% выручки (европейские бенчмарки; допущение), т.е. пул $75–200 млн/год — но это гипотетика 2028+.

## 6. Источники (обращение 05.09.2026)

1. CEN, C. Finat, «El rol de los BESS en el desarrollo del sistema eléctrico chileno», 15.04.2026 — https://www.coordinador.cl/wp-content/uploads/2026/04/2026-04-15-LATIN-AMERICAN-ENERGY-CARLOS-FINAT-1.pdf
2. CEN, J.P. Ávalos, «Del proyecto a la operación real…», 25.03.2026 — https://www.coordinador.cl/wp-content/uploads/2026/03/2026-03-25-CONO-SUR-ALMACENAMIENTO.pdf
3. CEN, Informe de Servicios Complementarios 2026 (30.06.2025) — https://www.coordinador.cl/wp-content/uploads/2025/06/2025.06.30-Informe_SSCC_2026.pdf
4. Min. Energía, Reporte de proyectos en construcción, май 2026 — https://energia.gob.cl/sites/default/files/documentos/reporte_de_proyectos_-_mayo_2026.pdf (не открыт, цитируется через 5 и 6)
5. pv magazine LatAm, 28.07.2026 (отчёт Min. Energía, корте 30.06.2026) — https://www.pv-magazine-latam.com/2026/07/28/chile-suma-47-gw-de-almacenamiento-y-205-gw-solares-en-construccion/
6. pv magazine LatAm, 28.04.2026 (отчёт за март 2026) — https://www.pv-magazine-latam.com/2026/04/28/chile-alcanza-4-597-mw-de-almacenamiento-en-operacion/
7. Reporte Minero, CNE: 12 978 МВтч до конца 2026, 11.05.2026 — https://www.reporteminero.cl/noticia/noticias/2026/05/cne-almacenamiento-bess-chile-2026
8. Reporte Minero, CNE Reporte Mensual (73 проекта, 5 728 МВт), 01.07.2026 — https://www.reporteminero.cl/noticia/noticias/2026/07/energias-renovables-capacidad-instalada-chile-bess-cne
9. Reporte Minero, вертимиенто 2025 = 6 205 ГВтч, 21.01.2026 — https://www.reporteminero.cl/noticia/noticias/2026/01/vertimiento-renovables-chile-2025
10. Reporte Minero, «El dilema de los 6.000 MW», 03.08.2026 (AES Andes 756 МВт, Bolero) — https://www.reporteminero.cl/noticia/noticias/2026/08/dilema-vertimiento-renovable-6000-mw-data-centers-bess-chile
11. Redimin, 21.08.2026 (68 проектов / 5 219 МВт; ранжирование владельцев) — https://www.redimin.cl/chile-acelera-despliegue-de-plantas-bess-y-supera-los-5-200-mw-en-proyectos-declarados-en-construccion
12. Garrigues, DS 32/2025 (программирование SAE Coordinador, autodespacho ≤9 МВт) — https://www.garrigues.com/es_ES/noticia/chile-gobierno-aprueba-decreto-redefine-operacion-sistema-electrico-reparto-inyecciones
13. Garrigues, DS 70 / capacity для storage — https://www.garrigues.com/en_GB/new/chile-approval-significant-changes-recognition-and-compensation-energy-storage-systems-and
14. Carey, toma de razón DS 70 (30.05.2024) — https://www.carey.cl/contraloria-toma-razon-a-norma-de-almacenamiento-de-energia/
15. BCN, Decreto 70 (05.06.2024) — https://www.bcn.cl/leychile/navegar?idNorma=1204012 (текст не загрузился; таблица процентов не проверена)
16. Guía Chile Energía, «DS125: la metodología de despacho de los BESS» — https://www.guiachileenergia.cl/ds125-la-metodologia-de-despacho-de-los-bess/
17. Electrominería, «SPEC propone 7 cambios…» — https://electromineria.cl/spec-7-propuestas-acelerar-operacion-bess-chile/ (текст только через поисковую выдачу)
18. pv magazine LatAm, Aurora Energy Research, 03.04.2025 — https://www.pv-magazine-latam.com/2025/04/03/la-rentabilidad-de-las-baterias-varia-en-chile-pero-la-colocacion-de-paneles-solares-puede-duplicar-los-ingresos-segun-aurora/
19. americasmi.com, «BESS in Chile» (агрегатор; capacity ~$8/кВт-мес, 15/85%) — https://americasmi.com/insights/energy-storage-in-chile/ (страница не открылась, данные из поисковой выдачи)
20. pv magazine, 28.04.2025 (954 МВт) — https://www.pv-magazine.com/2025/04/28/chile-already-halfway-to-2-gw-energy-storage-target/
21. Energy-Storage.News, «BESS: Chile's renewables saviour?», 27.01.2025 — https://www.energy-storage.news/bess-chiles-renewables-saviour/
22. Wärtsilä, референс Colbún (GEMS) — https://www.wartsila.com/energy/learn-more/references/ipps/colbun
23. Fluence blog, Andes Solar — https://blog.fluenceenergy.com/energy-storage-next-evolution-in-chile-andes-solar ; Mosaic markets — https://fluenceenergy.com/mosaic-intelligent-bidding-software/
24. enspired, press releases (нет Чили/LatAm) — https://www.enspired-trading.com/press-releases
25. Nueva Minería, «Almacenamiento energético en Chile, definiciones regulatorias» — https://www.nuevamineria.com/revista/almacenamiento-energetico-en-chile-definiciones-regulatorias/
26. Funds Society / BNamericas (ночные цены ≈$100/МВтч, BESS Coya) — https://www.bnamericas.com/en/news/chilean-battery-energy-storage-systems-stabilize-energy-supply-pricing (через поисковую выдачу)
