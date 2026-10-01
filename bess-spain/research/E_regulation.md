# Блок E — Регуляторика Испании для софтверного оптимизатора BESS (проверка К5 «Регуляторика не блокирует»)

Дата исследования: 2026-09-05. Все ссылки проверены в этот день (дата обращения указана в разделе 12). Приоритет источников: BOE / CNMC / REE / OMIE → юрфирмы → СМИ. Непроверенное помечено «не найдено» / «допущение».

---

## 1. Вердикт К5 и ключевые факты

**Вердикт: К5 в основном подтверждается — регуляторика НЕ блокирует схему «софт + лицензированный представитель», но за 2025–2026 гг. она стала заметно жёстче по части гибкого доступа и технических обязанностей, и ряд ключевых «дверей» (агрегатор, рынок мощности) ещё не открыты до конца.** Формула: «не блокирует, но требует X» — где X это (i) представитель/BRP с гарантиями и центром управления, (ii) готовность продукта к 15-мин гранулярности и к ограничениям гибкого доступа на стороне заряда, (iii) готовность к телеметрии/инструкциям DSO/TSO, (iv) неопределённость по агрегатору и рынку мощности до конца 2026.

Ключевые факты (все — с первоисточниками, см. раздел 12):

1. **Схема «софт + представитель» законна и практикуется.** Ley 24/2013 art. 6.1.h (владельцы хранилищ — субъекты), art. 6.2 (представители: прямая — «en nombre del representado», косвенная — «en nombre propio»). Правила OMIE (Res. CNMC 28.02.2025, BOE-A-2025-4908, Regla 4) допускают агентами и «titulares de instalaciones de almacenamiento», и «representantes». Живой пример: партнёрство оптимизатора **enspired** с трейдером **Nexus Energía** (июль 2025) — оптимизатор без собственной лицензии, доступ ко всем потокам выручки через представителя.
2. **Гибкий доступ (acceso flexible) для BESS теперь обязателен на стороне заряда** — но не запрещает стекинг. Res. CNMC 31.07.2026 (BOE-A-2026-17571, действует с 01.09.2026): «las solicitudes de acceso de demanda de las instalaciones de almacenamiento se analizarán como solicitudes de acceso flexible». Ограничение касается **только поглощения (заряда)**, не выдачи. Хранилище с гибким разрешением «podrá adaptar su programación en mercados posteriores y en servicios de ajuste siempre que no supere la limitación de consumo flexible comunicada». Компенсаций за ограничения типов 0–2 нет; для типа 3 (сеть передачи) отменённая программа оплачивается по цене day-ahead.
3. **RDL 7/2025 отклонён Конгрессом 22.07.2025** (BOE-A-2025-15313); часть мер вернули через RD 997/2025 (BOE-A-2025-22434, 05.11.2025) и RDL 7/2026 (BOE-A-2026-6544, конвалидирован 26.03.2026), который ввёл в RD 1183/2020 art. 2.k понятия «capacidad de acceso firme / flexible» и закрепил: «las instalaciones de almacenamiento tendrán permisos de acceso flexibles desde la perspectiva de la demanda».
4. **15-минутная гранулярность уже везде:** интрадей (SIDC, IDA + континуальный) — с 18.03.2025; day-ahead (SDAC) — с 01.10.2025 (96 цен/сутки, OMIE); ПО REE адаптированы Res. CNMC 06.03.2025 (BOE-A-2025-5342); aFRR/mFRR — 15-мин продукты (PO 7.2, BOE-A-2024-11535).
5. **Балансирующие рынки открыты для BESS:** Условия баланса (BOE-A-2024-11535) прямо допускают агрегацию «instalaciones de almacenamiento»; минимальная ставка 1 МВт; порог провайдера aFRR снижен «de 200 MW instalados a 100 MW habilitados» → для актива 10–50 МВт **самостоятельно стать провайдером aFRR нельзя, нужен представитель-провайдер с ≥100 МВт хабилитированных**. PICASSO — с 17.06.2025, MARI — с 10.12.2024.
6. **Агрегатор независимый (RD 88/2026, BOE-A-2026-3212) появился, но не работает:** его эффект наступает «simultáneamente» с адаптацией CNMC (DF 9); консультация MITECO по методологии/ПО закрылась 03.09.2026 — окончательного акта не найдено.
7. **Рынок мощности:** одобрен Еврокомиссией 28–29.05.2026 (≈€9 млрд/10 лет), но Orden ministerial и созыв первого аукциона по состоянию на 04.08.2026 не опубликованы; на портале участия MITECO на 05.09.2026 пунктов по «mercado de capacidad» нет.
8. **Технические обязанности растут:** RD 917/2025 (BOE 16.10.2025) — хранилища >5 МВт обязаны быть приписаны к центру управления, слать телеметрию в реальном времени и исполнять инструкции OS (техобязанности с 01.06.2026); PO 7.4 (Res. 30.06.2026, BOE-A-2026-15127) — базовый контроль напряжения обязателен для хранилищ на силовой электронике, ≥5 МВт обязаны следовать инструкциям OS по коэффициенту мощности.
9. **NIS2 в Испании не транспонирована** (anteproyecto 14.01.2025; закон не опубликован на 31.07.2026; Еврокомиссия передала дело в Суд ЕС 09.07.2026 — по данным юр. блогов, первичного акта не найдено). Энергетика — «сектор esencial».

---

## 2. Правовая карта

| Тема | Статус для гипотезы | Что требует | Источник |
|---|---|---|---|
| Хранилище как субъект сектора | Не блокирует | — | Ley 24/2013 art. 6.1.h (введён RDL 23/2020) |
| Представительство на рынке (прямое/косвенное) | Не блокирует | Договор представительства; представитель = агент OMIE и субъект REE | Ley 24/2013 art. 6.2; Reglas OMIE Regla 4 (BOE-A-2025-4908) |
| Ответственность за отклонения (desvíos) | Не блокирует, но требует X | BRP «responderá financieramente de los desvíos» — это представитель/субъект, не софт | Condiciones relativas al balance (BOE-A-2024-11535) |
| Оптимизатор как SaaS без лицензии | Не блокирует (допущение: прямого запрета не найдено) | Команды на актив юридически идут от владельца/представителя; SLA и ответственность в договоре | Ley 24/2013 art. 6; OMIE Regla 4; практика enspired–Nexus |
| Гибкий доступ на стороне заряда | Требует X | Тип 0/1/2/3, телеметрия, следование инструкциям DSO/TSO, без компенсации (типы 0–2) | Res. CNMC 31.07.2026 BOE-A-2026-17571; RDL 7/2026 DF15; Circular 1/2024 |
| Стекинг рынков при гибком доступе | Не блокирует | Адаптация программ в поздних рынках и ajuste «siempre que no supere la limitación» | BOE-A-2026-17571 Anexo III.2.1.f; Anexo IV.7 |
| Карты доступной мощности | Не блокирует (инфо) | REE публикует ежемесячно с 02.02.2026 | Res. CNMC 01.12.2025 BOE-A-2025-25253 |
| Гарантии за доступ | Требует X | Хранилище (поглощение) €20/kW vs спрос €40/kW; каducidad за неиспользованную мощность | RD 997/2025 DF3 → RD 1183/2020 art. 23 bis, 26 |
| Гибридизация с хранением | Не блокирует, упрощено | Упрощённая процедура, без новой оценки, если в полигонали | RD 1183/2020 art. 27; RD 997/2025 art. 5–6 |
| 15-мин MTU day-ahead/intraday | Требует X (продукт) | 96 периодов, форматы ставок OMIE, ПО 3.1/14.4 | OMIE nota 01.10.2025; BOE-A-2025-4908; BOE-A-2025-5342 |
| aFRR (secundaria) | Требует X | Провайдер ≥100 MW habilitados; UP ≥1 MW; CCGD по PO 9.2 + PO 3.8 Anexo I; PICASSO | BOE-A-2024-11535; REE «Ser proveedor…» (01.2024) |
| mFRR (terciaria) / RR | Не блокирует | Хабилитация UP ≥1 MW, FAT 12,5 мин, MARI | BOE-A-2024-11535; REE guide |
| SRAD (ответ спроса) | Не блокирует (ограниченно) | Полугодовые аукционы с 01.01.2026, 12,5 мин, 2 ч | Res. CNMC 06.11.2025 BOE-A-2025-22853 |
| Контроль напряжения (PO 7.4) | Требует X | Базовая услуга обязательна для BESS на силовой электронике; ≥5 МВт — инструкции OS; динамика — добровольно, оплачивается | BOE-A-2025-13076; BOE-A-2026-15127 |
| Центр управления / телеметрия | Требует X | >5 МВт: CCGD, телеметрия RT, инструкции; с 01.06.2026 | RD 917/2025 (мод. RD 413/2014 art. 7); PO 9, 9.2 |
| Независимый агрегатор | Пока не работает | Ждать адаптации CNMC / резолюции SEE / ПО | RD 88/2026 BOE-A-2026-3212; MITECO консультация 14.08–03.09.2026 |
| Рынок мощности | Не блокирует, не открыт | Orden и аукцион не опубликованы (на 04.08.2026) | pv-magazine 29.05.2026; El Periódico de la Energía 04.08.2026 |
| NIS2 / кибербезопасность | Требует X (скоро) | Закон не принят; энергетика — esencial; требования пойдут по цепочке поставок | Legiscope (10.07.2026); angelortegacastro (31.07.2026) — вторичные |

---

## 3. Гибкий доступ (acceso flexible) подробно

### 3.1 Хронология нормы
- **Circular 1/2021 CNMC** (BOE-A-2021-904) — доступ генерации; хранилища, которые могут «verter energía», подаются как генерация (RD 1183/2020 art. 6.3).
- **Circular 1/2024 CNMC** (BOE-A-2024-20760, 27.09.2024) — доступ спроса. Art. 3: «capacidad de acceso firme» (гарантия во все часы года) vs «flexible» («no se garantiza el suministro en todas las horas del año»). Преамбула: заявки хранилищ рассматриваются как генерация, но мощность оценивается «desde el punto de vista de la demanda». DT1: гибкие разрешения нельзя выдавать до утверждения спецификаций CNMC. DF1 меняет Circular 1/2021 (art. 3.2.d.v, 6.9, 7.2, Anexo I.6 — «условия со стороны спроса» в разрешениях хранилищ).
- **RDL 7/2025** (24.06.2025, BOE-A-2025-12857) — меры «refuerzo del sistema eléctrico» после блэкаута 28.04.2025; **отклонён Конгрессом 22.07.2025** (BOE-A-2025-15313: «el Congreso de los Diputados, en su sesión del día de hoy, acordó derogar el Real Decreto-ley 7/2025»). RD 1183/2020 art. 13 bis «se deja sin efecto».
- **RD 997/2025** (05.11.2025, BOE-A-2025-22434) — вернул часть мер рангом RD: art. 5 (potencia instalada хранилища = min из ёмкости батареи/инвертора/трансформатора), art. 6 (упрощённая гибридизация), art. 4 (анализы REE по напряжению/осцилляциям/ajuste), DF3 → RD 1183/2020 art. 23 bis (гарантии: хранилище-поглощение €20/kW; спрос €40/kW), art. 26.5–6 (автоматическая каducidad разрешений спроса ≥1 kV, если за 5 лет не оформлено ≥50 % мощности; увязка для «almacenamiento dual»). По RD 997/2025 положений об «acceso flexible» нет.
- **Res. CNMC 01.12.2025** (BOE-A-2025-25253) — спецификации мощности доступа спроса к сети передачи: хранилище в режиме потребления — «capacidad de acceso flexible de almacenamiento en modo demanda», вероятность поставки 90 % (не 95 %), «no debe entenderse como capacidad o probabilidad garantizada»; лимиты на точку: «Almacenamiento (modo consumo): 600 MW en 400 kV y 400 MW en 220 kV»; карты мощности REE ежемесячно, первая — 02.02.2026.
- **RDL 7/2026** (20.03.2026, BOE-A-2026-6544; конвалидирован 26.03.2026, BOE-A-2026-7125) — DF 15 переписывает RD 1183/2020 art. 2.k (firme/flexible) и art. 6.9; преамбула: «se regula que las instalaciones de almacenamiento tendrán permisos de acceso flexibles desde la perspectiva de la demanda». (Точный текст DF15 из BOE извлечь не удалось — не найдено; сверить у юриста.)
- **Res. CNMC 31.07.2026** (BOE-A-2026-17571) — «permisos de acceso flexibles de la demanda». Общий срок действия — **01.09.2026**.

### 3.2 Четыре типа гибких разрешений (BOE-A-2026-17571)
| Тип | Суть | Кто командует | Ожидание доступности | Компенсация |
|---|---|---|---|---|
| 0 «patrones» | Потребление только в заданных окнах, локальная система SIGPF | DSO (шаблон) | ≥62,5 % часов года | нет; «no será considerada como interrupción a efectos de los indicadores de calidad» |
| 1 (N-1, дистанционное отключение) | >30 kV, выделенная ячейка; отключение без предупреждения при N-1 | DSO (удалённый выключатель) | ~90 % | нет |
| 2 (гибкое снижение в распределении) | >1 МВт, >1 kV; инструкции D-1 и в реальном времени (30 мин превентивно / 3 мин корректирующе) | DSO (consignas) | ~90 % | нет; заявки не ранее 01.01.2028 |
| 3 (сеть передачи) | >1 МВт на RdT; фирменно в N, гибко в N-X; SRAP | TSO/REE (Sistema de Reducción Automática de Potencia) | перцентиль 90 по N-X | отменённая программа — по «precio marginal del mercado diario» |

### 3.3 Что это значит для BESS
- Заявки хранилищ на потребление «se analizarán como solicitudes de acceso flexible» (Resuelve Primero.3). Владельцы могут просить фирменный доступ для собственных нужд (servicios auxiliares) (Primero.4).
- Существующие разрешения: неоперационные хранилища — 3 месяца на конверсию (иначе теряют льготы по cargos/peajes); операционные — «se considerarán flexibles salvo manifestación expresa en contra» (Quinto).
- Автономные хранилища >100 кВт на >1 kV в распределении: телеметрия в реальном времени DSO, сертификация SIGPF, обязанность следовать инструкциям типа 2 (POD1, Anexo V).
- **Ограничение действует только на поглощение (заряд)**, не на выдачу. Выдача регулируется по правилам генерации (restricciones técnicas, PO 3.2) — как у любого генератора.
- Стекинг: программа day-ahead/intraday формируется свободно; «podrá adaptar su programación en mercados posteriores y en servicios de ajuste siempre que no supere la limitación de consumo flexible comunicada» (Anexo III.2.1.f). Тип 3: «podrán participar en los mercados gestionados por el OS» с уведомлением OS о гибком разрешении (Anexo IV.7).
- DSO+TSO обязаны за 6–12 мес. создать «mecanismos de intercambio de información» для интеграции гибких разрешений в servicios de ajuste и расчёты (Tercero.1). Отчёт DSO об использовании гибких разрешений — ежегодно до 1 июня (Sexto.1).
- Практический риск для оптимизатора: лимит заряда может прийти D-1 или в реальном времени (3–30 мин) → нужна интеграция сигналов DSO/REE и перерасчёт программы; несоблюдение = отключение всей установки (Anexo III.2.1.g).

---

## 4. Участие в рынках и предквалификация

### 4.1 Кто может подавать заявки
- **Субъекты** (Ley 24/2013 art. 6.1): производители, потребители, комерсиализаторы, **титуляры хранилищ (h)**, **независимые агрегаторы (i)** и др. **Представители** (art. 6.2): прямое представительство («en nombre del representado») и косвенное («en nombre propio»); один субъект не может одновременно действовать за свой счёт и за чужой.
- **Агент OMIE** (Reglas, Regla 4.1–4.2): производители, комерсиализаторы, прямые потребители, «titulares de instalaciones de almacenamiento», представители (косвенные/прямые). Требования: регистрация установки, статус субъекта системы у REE, «haberse adherido expresamente a las reglas», код агента/ACER, банковский счёт, гарантии.
- **BRP** (Condiciones relativas al balance, BOE-A-2024-11535): обязан «no desviarse, considerando el conjunto de sus programas» и «responderá financieramente de los desvíos que hayan de ser liquidados». Изменение программ после интрадей — «siempre que dichas modificaciones estén justificadas por incidentes sobrevenidos».
- **Независимый агрегатор** (RD 88/2026, BOE-A-2026-3212, в силе с 12.02.2026): art. 2.c определение; art. 20 — «podrán acceder a todos los mercados de electricidad»; art. 21–23 права/обязанности/техтребования; art. 22 declaración responsable в DGPEM; art. 36 гарантии по будущему Orden; DT3 — переходная централизованная модель «con corrección de programa y con compensación» (OS/OMIE — центральный контрагент); DA1/DF7 — CNMC 3 месяца на адаптацию форматов; **DF9 — положения об агрегаторе действуют «simultáneamente con esta adaptación por parte de la CNMC»**. MITECO провёл консультацию (14.08–03.09.2026) по резолюции SEE «programa de referencia base, precio y esquema de compensación… y se aprueban procedimientos de operación… para la implementación del agregador independiente». Финальный акт — не найдено. Вывод: на 09.2026 агрегатор как альтернатива представителю **ещё не операционен**.

### 4.2 Предквалификация для балансирующих услуг (REE «Ser proveedor de servicios de balance», 01.2024; BOE-A-2024-11535)
- «Todos los participantes del mercado con unidades de programación de generación, demanda o almacenamiento con capacidad mínima de oferta igual a 1 MW pueden ser proveedores de servicios de balance».
- Общие требования: UP ≥1 МВт; структурная информация; обмен в реальном времени через **centro de control de generación y demanda (CCGD)** по PO 9.2; для secundaria CCGD «deberá ser además el responsable de la zona de regulación y cumplir el Anexo I del P.O. 3.8».
- **aFRR**: продукт 15 мин, min 1 МВт, гранулярность 1 МВт, FAT 5 мин; порог провайдера — «pasa de 200 MW instalados a 100 MW habilitados» (гайд REE 01.2024 ещё указывает 200 МВт для зоны). Телеметрия: «No se incluirán las telemedidas negativas de instalaciones de almacenamiento (modo consumo), salvo que pertenezcan a UP habilitadas en el servicio en modo consumo» (PO 7.2). PICASSO — 17.06.2025.
- **mFRR**: min 1 МВт, FAT 12,5 мин, 15-мин продукт, единая трансграничная маргинальная цена; MARI — 10.12.2024. **RR** — платформа TERRE (PO 3.3).
- **SRAD** (Res. CNMC 06.11.2025): полугодовые аукционы с 01.01.2026, активация 12,5 мин, до 2 ч, гранулярность 1 МВт → 100 кВт со второго года; батареи/агрегаторы прямо не названы — участие «bajo acuerdos comerciales».
- **Контроль напряжения**: PO 7.4 (Res. 12.06.2025, BOE-A-2025-13076; Res. 30.06.2026, BOE-A-2026-15127). Базовая услуга обязательна «para instalaciones de producción bajo el ámbito del RD 413/2014 y de almacenamiento basadas en electrónica de potencia»; ≥5 МВт «deberán seguir las instrucciones dictadas por el operador del sistema»; новая добровольная модальность «consigna fija» для ≥1 МВт; оплата: 2 €/Mvarh (RT, P>0), 0,7 / 2,7 €/MW·день фикс; сроки внедрения 6–8 мес. CNMC поручила REE оценить «el impacto de una posible revisión… del carácter voluntario» (Res. 19.01.2026). Временные меры стабилизации напряжения (PO 3.1/3.2/7.2) действовали с 20.10.2025 по 19.01.2026 и продолжены резолюцией 19.01.2026.

### 4.3 Схема «софт + трейдер» на практике
- **enspired × Nexus Energía** (energy-storage.news, 22.07.2025; сайт Nexus): оптимизатор входит в Испанию через партнёра-представителя, «the best local partners to integrate our optimisation service via a joint offering»; Nexus даёт «access to all revenue streams». Модели: «from fully merchant to tolling and everything in between».
- **Entrix, Statkraft** — активны в Иберии (European BESS Index, вторичный источник; способ доступа не раскрыт).
- **Optimize Energy** (интервью AEE, 23.12.2025) — аналитика для владельцев, оценка «своего представителя»; продукт OptiBESS.
- **Tolling в Испании** (El Periódico de la Energía, 04.08.2026): physical tolling («el toller asume el control real operativo de la batería») vs financial tolling (расчёт по теоретическому оптимальному диспетчу, контроль у владельца).
- Прямого запрета на то, чтобы **нелицензированный** сервис формировал ставки/уставки, в первоисточниках не найдено (**допущение**: юридически ставки подаёт агент OMIE/BSP, команды исполняет CCGD владельца; софт — подрядчик). Ответственность за desvíos, гарантии и штрафы за невыполнение aFRR/mFRR несёт BRP/BSP → должна быть переложена договором.

---

## 5. 15-минутная гранулярность
- **Интрадей** (SIDC): MTU15 в континуальном рынке MIBEL и первая IDA с 15-мин продуктами — **18.03.2025** (Reglas OMIE, BOE-A-2025-4908; нота OMIE 18.03.2025).
- **Day-ahead** (SDAC «Big Bang»): **01.10.2025** — «96 precios cuartohorarios» (OMIE nota 01.10.2025).
- **Расчёт отклонений**: 15-мин период — с 01.12.2024 (по вторичным источникам SmartGridsInfo/OMIE; первичный акт — не найдено).
- **ПО REE**: Res. CNMC 06.03.2025 (BOE-A-2025-5342) меняет PO 3.1, 3.2, 3.3, 3.8, 4.0, 14.3, 14.4: «Los programas PDBF, PDVP, PHF, PHFC y P48 se publicarán con resolución cuarto-horaria»; энергия «MWh con un máximo de tres cifras decimales», мощность «MW con un máximo de una cifra decimal».
- **Балансировка**: aFRR/mFRR — 15-мин периоды валидности/поставки (PO 7.2 Anexo I).
- Последствия для BESS/продукта: 96 цен D-1 + 15-мин интрадей + 15-мин desvíos → прогноз и оптимизация должны быть 15-мин; больше внутричасовой волатильности; входные форматы OMIE (curvas/bloques 15 мин), PHF/P48 на 15 мин.

---

## 6. Механизм мощности
- Проект Orden (консультация MITECO, декабрь 2024): технологическая нейтральность («tanto la generación, el almacenamiento como la demanda podrán participar»), главные аукционы (начало услуги ≤5 лет после присуждения), аукционы корректировки (12 мес.), «ratios de firmeza», «esquema de penalizaciones en caso de incumplimiento», CO₂ ≤550 г/кВт·ч для существующих, 0 для новых.
- Одобрение ЕК: 28.05.2026 (El Periódico de la Energía) / 29.05.2026 (pv-magazine) — ≈€9 млрд, 10 лет (2026–2036), ≈€900 млн/год, проведение — REE, pay-as-bid.
- Статус: Orden ministerial и «consulta pública de la convocatoria de la primera subasta… no se ha publicado todavía» (04.08.2026). На портале участия MITECO на 05.09.2026 позиций по «mercado de capacidad» нет.
- Совместимость с арбитражем: правила доступности/штрафов в финальном виде **не найдено**. Допущение (по проекту Orden и статье 04.08.2026): обязательство — доступность в часы дефицита по надёжностному стандарту; оптимизатор должен держать SoC-резерв в объявленные окна и разделять потоки выручки («que la monetización de un revenue stream no interfiera»). Минимальная длительность для батарей (2h/4h) — не найдено.

---

## 7. Черновик схемы договора «владелец — представитель/трейдер — оптимизатор»

**Роли**
- **Владелец актива (titular de almacenamiento)**: держит разрешения доступа (генерация + гибкий спрос), лицензии, CCGD (свой или аутсорс), гарантии за доступ; отвечает перед DSO/TSO за исполнение инструкций и телеметрию (RD 917/2025, BOE-A-2026-17571).
- **Представитель/трейдер (representante indirecto = agente OMIE + sujeto de mercado + BRP + BSP)**: подаёт ставки D-1/ID/aFRR/mFRR/RR, держит гарантии OMIE/REE (PO 14.3), несёт финансовую ответственность за desvíos и невыполнение резервов; для aFRR — провайдер ≥100 МВт хабилитированных (агрегирует актив в свой портфель).
- **Оптимизатор (SaaS)**: прогноз 15-мин цен, стекинг, генерация плана ставок и уставок SoC/P; интеграция с EMS/SCADA через CCGD; учёт лимитов гибкого доступа и обязанностей PO 7.4/мощности. Не является субъектом рынка.

**Потоки денег**
- OMIE/REE → представитель (выручка D-1/ID/ajuste, минус desvíos, штрафы, peajes/cargos на заряд) → владелец (net of fee представителя: фикс €/МВт·мес или % выручки).
- Владелец → оптимизатор: фикс €/МВт·мес + успех-фи (% от uplift над бенчмарком), либо через представителя в «joint offering» (модель enspired–Nexus).
- Tolling-вариант: толлер платит владельцу фикс, сам заказывает оптимизатор.

**Ответственность за отклонения**
- Юридически — на BRP (представителе). Договорно: (a) desvíos из-за ошибок алгоритма/недоступности сервиса — лимитированная ответственность оптимизатора (cap = X месяцев fee), (b) из-за отказа актива — владелец, (c) из-за инструкций DSO/TSO (гибкий доступ, restricciones) — force majeure/регуляторный риск, без компенсации по типам 0–2.
- Невыполнение aFRR/mFRR (штрафы PO 7.2/7.3) — распределить аналогично; фиксировать «available capacity» протоколом.

**Данные/SCADA**
- Оптимизатор получает read-only телеметрию + пишет уставки через CCGD/EMS владельца, с локальными защитами (лимиты P/SoC, safe-mode при потере связи). CCGD остаётся единственной точкой команд OS/DSO (PO 9.2, PO 3.8 Anexo I). Доступ к данным измерений — по авторизации владельца (RD 88/2026 art. 6.p — для потребителей; для генерации — договор).
- Оговорки NIS2-типа: уведомление об инцидентах 24/72 ч, аудит, SLA, локализация данных, право владельца на аудит поставщика.

---

## 8. Требования к продукту, вытекающие из регуляторики
1. 15-мин прогноз и оптимизация (96 периодов D-1; интрадей IDA + континуальный; desvíos 15 мин).
2. Модуль «гибкий доступ»: ввод/приём лимитов заряда (типы 0–3): паттерны, инструкции D-1 и RT (3–30 мин), SRAP; автоматический перерасчёт программ и ставок «siempre que no supere la limitación».
3. Раздельная модель заряда (гибкий спрос, peajes/cargos) и выдачи (генерация, restricciones técnicas).
4. Интеграция с CCGD/EMS (PO 9.2, PO 3.8 Anexo I): телеметрия RT, коэффициенты «barras de central → punto de conexión», уставки; safe-mode.
5. Готовность к aFRR через провайдера-агрегатора (≥100 МВт): 15-мин блоки резерва и энергии, FAT 5 мин, учёт «modo consumo» хабилитации; mFRR 12,5 мин; RR.
6. Ограничения PO 7.4: резерв реактивной мощности / уставки напряжения не должны конфликтовать с P-программой; ≥5 МВт — инструкции OS.
7. Рынок мощности (когда откроется): резервирование SoC в окнах дефицита, учёт штрафов.
8. Учёт правил изменения программ после интрадей (только «incidentes sobrevenidos»).
9. Логи и аудит всех команд/ставок (доказательная база при спорах о desvíos и штрафах, NIS2).
10. Кибербезопасность уровня «поставщик критической инфраструктуры» (см. 9).

---

## 9. NIS2 / SCADA / кибербезопасность
- **NIS2 (Directiva 2022/2555)**: Испания пропустила срок 17.10.2024; anteproyecto «Ley de Coordinación y Gobernanza de la Ciberseguridad» одобрен Советом министров 14.01.2025; на 31.07.2026 «no constaba» публикации в BOE; 09.07.2026 Еврокомиссия передала дело в Суд ЕС (INFR(2024)0270) — вторичные источники (angelortegacastro.com, Legiscope); первичный акт не найдено. Энергетика — «entidades esenciales»; порог — 50+ сотрудников или >€10 млн; обязанности: управление рисками, уведомление 24 ч/72 ч/1 мес., «seguridad de la cadena de suministro»; санкции до €10 млн / 2 %. Оптимизатор как ИКТ-поставщик критического сектора получит требования «por contrato — notificación, auditoría, niveles de servicio».
- **Центры управления**: RD 413/2014 art. 7 в ред. RD 917/2025 — генерация и хранилища >5 МВт (0,5 МВт вне полуострова) «deberán estar adscritas a un centro de control de generación», слать телеметрию RT в REE и принимать инструкции; техобязанности с 01.06.2026; гибридные — раздельные данные. PO 9 / 9.1 / 9.2 / 9.3 — обмен информацией; PO 3.8 Anexo I — требования к CCGD.
- **Гибкий доступ**: локальные устройства управления в автономных хранилищах «deberán tener capacidad de seguir instrucciones… del gestor de la red» (BOE-A-2026-17571, Cuarto/POD1).
- Следствие: команды на актив из облака оптимизатора должны проходить через сертифицированный CCGD/EMS владельца; ответственность за исполнение инструкций OS/DSO — у владельца; оптимизатор — подрядчик с SLA. Прямых норм REE о «внешнем SaaS-доступе к SCADA» не найдено (допущение: регулируется требованиями CCGD и договором).

---

## 10. «Что говорит против» (опровержения / риски)
1. **Гибкий доступ — новый, сырой и без компенсаций.** Действует с 01.09.2026; ПО обмена информацией DSO↔TSO ещё в разработке (6–12 мес.); тип 2 (самый массовый для распределения) — только с 01.01.2028. Ожидание доступности ~90 % часов означает до ~10 % часов без заряда — арбитражные окна могут совпасть с ограничениями (солнечный полдень в перегруженных узлах). Модель доходности должна это учитывать.
2. **Порог aFRR 100 МВт хабилитированных** — сегмент 10–50 МВт зависит от крупного провайдера; переговорная позиция оптимизатора слабее, и часть ценности aFRR уйдёт агрегатору.
3. **Агрегатор независимый не операционен** — альтернативы представителю пока нет; сроки зависят от CNMC/SEE.
4. **Рынок мощности** — ни Orden, ни аукциона; правила доступности/штрафов неизвестны → нельзя обещать «стекинг с capacity».
5. **Ужесточение техобязанностей** (RD 917/2025, PO 7.4, возможная обязательность динамического контроля напряжения) — часть мощности инвертора может резервироваться под реактив/напряжение; ≥5 МВт обязаны исполнять инструкции OS.
6. **Регуляторная нестабильность**: RDL 7/2025 отклонён Конгрессом; RDL 7/2026 оспорен в КС (recurso 4714/2026 по отдельным статьям — по анализу BOE); частые временные резолюции CNMC (PO 3.1/3.2/7.2).
7. **NIS2** — придёт внезапно после публикации закона; поставщик софта для критического сектора попадёт под цепочку поставок.
8. **Ответственность за desvíos и штрафы** — юридически у представителя; крупные представители могут предпочесть свой in-house оптимизатор (Nexus уже партнёр enspired; Statkraft/Entrix — свои платформы) → риск канала сбыта.
9. **Peajes/cargos на заряд**: заявленное освобождение хранилищ (Circular 3/2020) — подтверждено только вторичным источником; при конверсии в гибкий доступ невыполнение сроков ведёт к «pérdida de excepciones» по cargos.

---

## 11. Вопросы для юриста
1. Точный текст DF15 RDL 7/2026 (RD 1183/2020 art. 2.k, 6.9) и изменений Ley 24/2013 art. 33 о хранилищах и гибком доступе; статус после конвалидации и recurso 4714/2026.
2. Может ли SaaS-оптимизатор без статуса субъекта формировать и передавать ставки представителю автоматически (API) — есть ли требования OMIE/REE к «делегированному доступу» к системам агента; регистрация третьих лиц в порталах OMIE/REE.
3. Допустима ли прямая запись уставок в EMS/CCGD владельца сторонним ПО с точки зрения PO 9.2 / PO 3.8 Anexo I и RD 917/2025; кто «ответственный оператор» CCGD.
4. Распределение ответственности за desvíos/штрафы aFRR-mFRR при алгоритмических ошибках; каps; страхование E&O.
5. Для актива 10–50 МВт: условия вхождения в провайдер aFRR ≥100 МВт (агрегация по art. 8 Condiciones de balance), возможность хабилитации «modo consumo».
6. Гибкий доступ: какой тип выбрать существующему/новому BESS; сроки конверсии (3 мес./7 мес.), последствия для cargos; можно ли оспаривать инструкции DSO; тип 3 — компенсация по цене D-1 и её учёт.
7. Статус независимого агрегатора: вступила ли в силу адаптация CNMC (DF9 RD 88/2026); резолюция SEE после консультации 03.09.2026.
8. Рынок мощности: ожидаемые правила доступности/штрафов для батарей, совместимость с арбитражем, дата первого аукциона.
9. PO 7.4: обязательства хранилищ по реактиву при P≤0; перспектива обязательной динамической модальности.
10. NIS2/anteproyecto: попадает ли оптимизатор в периметр как «proveedor» и какие договорные условия ожидать от владельцев/представителей.
11. Освобождение хранилищ от peajes/cargos на заряд (Circular 3/2020 и её изменения) — первичное подтверждение.

---

## 12. Источники (URL, дата обращения 2026-09-05)

**Первичные (BOE / CNMC / REE / OMIE / ENTSO-E / MITECO)**
- Ley 24/2013 (консолид.): https://www.boe.es/buscar/act.php?id=BOE-A-2013-13645
- RDL 23/2020: https://www.boe.es/buscar/act.php?id=BOE-A-2020-6621
- RD 1183/2020 (консолид., с пометками о RDL 7/2026, RD 997/2025, RDL 7/2025): https://www.boe.es/buscar/act.php?id=BOE-A-2020-17278
- Circular 1/2021 CNMC: https://www.boe.es/buscar/doc.php?id=BOE-A-2021-904
- Circular 1/2024 CNMC: https://www.boe.es/buscar/act.php?id=BOE-A-2024-20760
- Res. CNMC 25.04.2024 (MARI/PICASSO, Condiciones balance, PO 7.2): https://www.boe.es/buscar/doc.php?id=BOE-A-2024-11535 ; PDF PO 7.2: https://www.ree.es/sites/default/files/2024-11/PO_7_2_BOE-A-2024-11535.pdf
- REE «Ser proveedor de servicios de balance» (v3, 01.2024): https://www.ree.es/sites/default/files/12_CLIENTES/Documentos/Guia-Ser-proveedor-servicios-de-balance-v3.pdf
- Res. CNMC 28.02.2025 (Reglas OMIE, 15 мин): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-4908
- Res. CNMC 06.03.2025 (ПО под 15 мин): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-5342
- Res. CNMC 12.06.2025 (PO 7.4): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-13076
- RDL 7/2025: https://www.boe.es/buscar/act.php?id=BOE-A-2025-12857 ; derogación 22.07.2025: https://www.boe.es/buscar/doc.php?id=BOE-A-2025-15313
- OMIE nota MTU15 day-ahead 01.10.2025: https://www.omie.es/sites/default/files/2025-10/2501001_go_live_mtu15_md_es_vf.pdf
- RD 997/2025: https://www.boe.es/buscar/act.php?id=BOE-A-2025-22434
- Res. CNMC 06.11.2025 (SRAD, PO 7.5/14.4): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-22853
- Res. CNMC 01.12.2025 (capacidad demanda RdT): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-25253
- RD 88/2026 (agregador independiente): https://www.boe.es/buscar/act.php?id=BOE-A-2026-3212
- RDL 7/2026: https://www.boe.es/buscar/act.php?id=BOE-A-2026-6544 (análisis: &tn=6)
- Propuesta CNMC RDC/DE/003/25 (acceso flexible): https://www.cnmc.es/sites/default/files/editor_contenidos/Energia/Consulta%20Publica/1_RDC_DE_003_25_PROP%20Resolucion.%20Permisos%20Flexibles.pdf
- Res. CNMC 30.06.2026 (PO 7.4/14.4, BOE 10.07.2026): https://www.boe.es/boe/dias/2026/07/10/pdfs/BOE-A-2026-15127.pdf
- Res. CNMC 31.07.2026 (permisos acceso flexible demanda): https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-17571
- REE «Servicios de ajuste e intercambios internacionales 2025» (03.2026): https://www.sistemaelectrico-ree.es/sites/default/files/informes/2026/servicio-ajuste-2025.pdf
- ENTSO-E PICASSO: https://www.entsoe.eu/network_codes/eb/picasso/
- MITECO участие (консультация модель агрегации 14.08–03.09.2026): https://www.miteco.gob.es/es/energia/participacion.html
- MITECO проект Orden mercado de capacidad: https://www.miteco.gob.es/en/energia/participacion/2023-y-anteriores/detalle-participacion-publica-k-409.html
- CNMC пресс-релиз PO 7.4 (17.06.2025): https://www.cnmc.es/prensa/po-control-tension-20250617

**Юрфирмы / аналитика**
- Araoz & Rueda о RD 997/2025: https://www.araozyrueda.com/rd-997-2025-sistema-electrico/
- Gómez-Acebo & Pombo о RD 88/2026 (02.2026): https://ga-p.com/wp-content/uploads/2026/02/Energia_electrica.pdf
- PwC Periscopio (20.03.2026) о гибком доступе: https://periscopiofiscalylegal.pwc.es/medidas-de-refuerzo-de-la-capacidad-del-sistema-electrico/
- Iberley о дерогации RDL 7/2025: https://www.iberley.es/noticias/derogado-real-decreto-ley-7-2025-24-junio-medidas-refuerzo-sistema-electrico-35144
- Legiscope NIS2 (10.07.2026): https://www.legiscope.com/blog/nis2-espana-transposicion.html ; angelortegacastro (31.07.2026): https://angelortegacastro.com/ley-coordinacion-gobernanza-ciberseguridad-nis2-estado-boe/

**СМИ / отраслевые**
- pv-magazine: ЕК одобрила рынок мощности (29.05.2026): https://www.pv-magazine.es/2026/05/29/la-comision-aprueba-el-mercado-de-capacidad-para-espana/ ; критерии доступа (10.12.2025): https://www.pv-magazine.es/2025/12/10/el-boe-publica-los-criterios-tecnicos-que-transformaran-la-conexion-de-demanda-y-almacenamiento/ ; консультация acceso flexible (23.02.2026): https://www.pv-magazine.es/2026/02/23/a-consulta-publica-sobre-el-acceso-flexible-de-la-demanda-a-la-red-electrica/ ; RD 917/2025 (16.10.2025): https://www.pv-magazine.es/2025/10/16/todas-las-novedades-de-la-norma-que-define-la-prioridad-de-evacuacion-de-renovables-y-almacenamiento/
- El Periódico de la Energía: tolling и рынок мощности (04.08.2026): https://elperiodicodelaenergia.com/tolling-agreements-y-mercado-de-capacidad-las-dos-caras-de-la-bancabilidad-del-almacenamiento-en-espana ; RD 88/2026: https://elperiodicodelaenergia.com/real-decreto-88-2026-por-fin-espana-reconoce-al-agregador-independiente-ahora-toca-operarlo/
- El Español (23.01.2026) о возможной обязательности контроля напряжения: https://www.elespanol.com/invertia/empresas/energia/20260123/cnmc-abre-puerta-nuevo-servicio-control-tension-renovables-obligatorio-evitar-apagones/1003744096955_0.html
- Review Energy (13.07.2026) о PO 7.4: https://www.review-energy.com/otras-fuentes/la-cnmc-aprueba-cambios-para-impulsar-la-participacion-de-las-renovables-en-el-control-de-tension-de-la-red
- Energía Estratégica о картах мощности: https://www.energiaestrategica.com/espana-aprueba-nuevas-reglas-de-acceso-a-redes-para-demanda-y-bess-publicara-mapa-de-capacidad-en-febrero-de-2026/
- energy-storage.news: enspired × Nexus (22.07.2025): https://www.energy-storage.news/full-exposure-to-one-market-is-not-sustainable-optimiser-enspired-expands-to-greece-spain-and-poland/ ; роль оптимизаторов (05.08.2025): https://www.energy-storage.news/the-role-of-optimisers-in-bess-tolls-and-performance-warranties/
- Nexus Energía (сайт, партнёрство с enspired): https://www.nexusenergia.com/
- Synertics о MARI (10.12.2024): https://synertics.io/blog/163/portugal-and-spain-are-officially-operational-members-of-mari
- European BESS Index (Entrix, Statkraft в Иберии): https://europeanbessindex.com/best-bess-optimizers
- AEE интервью Optimize Energy (23.12.2025): https://www.aeeolica.org/en/rodrigo-garcia-director-de-operaciones-de-optimize-energy-es-el-protagonista-de-la-entrevista-del-mes-en-nuestra-newsletter/
- Stromfee.cloud (обзор норм, peajes — вторичный): https://www.stromfee.cloud/es/rules/
- SmartGridsInfo (15-мин desvíos с 01.12.2024 — вторичный): https://www.smartgridsinfo.es/2025/03/25/operador-iberico-omie-implementa-nueva-tipologia-ofertas-mercado-electrico-diario

**Не найдено / не проверено**: точный текст DF15 RDL 7/2026 и изменений Ley 24/2013 art. 33; финальная адаптация CNMC для агрегатора (DF9 RD 88/2026); Orden mercado de capacidad и правила доступности/штрафов; первичный акт о 15-мин расчёте desvíos с 01.12.2024; освобождение хранилищ от peajes (Circular 3/2020) в первоисточнике; положения RDL 20/2022 о хранении (страница BOE вернула другой документ); текст NIS2-закона (не опубликован).
