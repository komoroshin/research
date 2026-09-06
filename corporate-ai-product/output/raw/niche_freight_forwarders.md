# Ниша: транзитарии и таможенные представители (CNAE/NACE 52.29) — Испания / ЕС / СНГ

Дата сбора: 2026-09-05. Продукт: нишевой корпоративный ИИ класса Glean (подключён к системам компании, отвечает на вопросы по данным и выполняет работу) для средних компаний 30–500 сотрудников. Стартовый рынок — Испания, расширение — ЕС; СНГ — отдельный сценарий (цифры не смешиваем).

Условные обозначения: `[>24 мес]` — опубликовано до сентября 2024; `[оценка]` — расчёт аналитика на основе указанных источников, не измеренное значение; `[НЕТ ИСТОЧНИКА — не для питча]` — число без подтверждённого источника.

Важное методологическое замечание по кодам: госстатистика Испании (INE DIRCE) публикует разбивку по размеру только на уровне 3-значной группы **CNAE 522 «Actividades anexas al transporte»** (включает 52.21 автодорожные, 52.22 морские, 52.23 авиационные вспомогательные услуги, 52.24 погрузка-разгрузка и **52.29 транзитарии/таможенные агенты**). Eurostat SBS даёт 4-значный **H52.29** без размерных классов и **H522** — с размерными классами. Все оценки «числа компаний 30–500 чел. в 52.29» ниже — расчёт из этих двух наборов.

---

## 1. Число компаний целевого размера (30–500 чел.)

### Испания

**INE DIRCE, 1 января 2025 (запрос к API INE, таблица 39371 «Empresas por condición jurídica, actividad principal (grupos CNAE 2009) y estrato de asalariados»; получено 2026-09-05 через `servicios.ine.es/wstempus/js/ES/DATOS_TABLA/39371`; страница таблицы: https://www.ine.es/jaxiT3/Tabla.htm?t=39371 ; пресс-релиз DIRCE 2025 опубликован 11.12.2025: https://www.ine.es/dyngs/Prensa/DIRCE2025.htm )** — группа **CNAE 522**, вся Испания:

| Страта наёмных работников | 2024 | 2025 |
|---|---|---|
| Всего компаний 522 | 14 057 | 13 784 |
| Без наёмных | 3 777 | 3 934 |
| 1–2 | 5 138 | 4 845 |
| 3–5 | 2 139 | 2 073 |
| 6–9 | 1 123 | 1 061 |
| 10–19 | 914 | 893 |
| 20–49 | 551 | 538 |
| 50–99 | 176 | 173 |
| 100–199 | 105 | 113 |
| 200–499, 500–999 | серии не вернулись в выдаче API (см. «Что не нашёл») | — |
| 1000–4999 | 25 | 25 |
| ≥5000 | 5 | 5 |

Итого в группе 522 с 20–199 наёмными: **824 компании (2025)**; 50–199: **286**.

**Eurostat SBS `sbs_sc_ovw` (данные 2023, обновлено 2026-09-01; получено через API `ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw`, датасет: https://ec.europa.eu/eurostat/databrowser/view/sbs_sc_ovw/default/table?lang=en )** — **H522, Испания, 2023**: всего 15 078 предприятий; 20–49 чел.: **646**; 50–249: **330**; ≥250: **110**; занятых всего 203 565, из них в классе 50–249 — 34 998, в классе 20–49 — 18 205.

**Eurostat SBS `sbs_ovw_act` (2023)** — **H52.29, Испания**: **5 372 предприятия, 89 604 занятых** (2022: 5 537 / 88 508). Доля 52.29 в 522: ~36 % предприятий, ~44 % занятых.

**Оценка целевого сегмента Испании [оценка]:** если доля 52.29 внутри размерных классов такая же, как в среднем по группе (36–44 %), то компаний 52.29 с 20–249 сотрудниками ≈ 0,36–0,44 × 976 ≈ **350–430**, с 50–249 ≈ **120–145**. Диапазон 30–500 чел. для 52.29 разумно оценивать в **~300–400 компаний** (с учётом того, что часть 20–29 отсекается, а 250–500 добавляется). Это верхняя граница «адресуемого» списка; реальные транзитарии/агенты, а не портовые стивидоры/обработчики грузов — ещё меньше.

**Отраслевая перепись Transporte XXI, «Libro Blanco del Sector Transitario 2024» (опубликован июнь 2024, данные по отчётности за 2022 год; PDF: https://www.transportexxi.com/wp-content/uploads/2025/02/TransporteXXI-LB-Sector-Transitario-2024-web.pdf ) [>24 мес]:**
- проанализировано **832 действующие компании** (плюс 80 ликвидированных/неактивных); только **62 компании (7,4 %) с выручкой > €50 млн** дают 59 % продаж сектора; 92,5 % — ниже €50 млн;
- топ-10 компаний — >€3 770 млн, **27,2 %** продаж сектора; топ-100 (11 % выборки) — **70 %**;
- «типовая компания» (медиана выручки) — **€4,04 млн** (2022; +21,7 % г/г; 2019: €2,63 млн);
- продажи на сотрудника **€0,581 млн** (2022);
- прибыль сектора **€496 млн, чистая маржа 3,6 %** (2022); **средние компании (50–249 чел., до €50 млн)** — прибыль €161 млн, чистая маржа **4,2 %**; крупные (≥250) — €261 млн, 3,2 %;
- Каталония: **260 компаний, 33,8 % рынка**, >€4 600 млн продаж; Мадрид 25,2 % (~€3 500 млн); Валенсия 23,2 % (~€3 200 млн); три региона — 82,2 % продаж;
- 2018–2022 создано 110 новых компаний.
- Расчётный объём сектора по выборке [оценка]: €3 770 млн / 0,272 ≈ **€13,9 млрд** (2022).

**eInforma, отраслевой отчёт CNAE 5229 (баланс 2024, отчёт от 01.04.2026; https://www.einforma.com/informes-sectoriales/cnae-5229-empresas-otras-actividades-anexas-al-transporte ):** 11 568 компаний в коде (в другом снимке eInforma — 11 861); выручка по регионам: Мадрид €7,33 млрд, Каталония €4,67 млрд, Галисия €1,82 млрд, Валенсия €1,75 млрд, остальные €2,95 млрд (сумма ≈ €18,5 млрд; включает всех зарегистрированных под кодом, не только транзитариев); за 12 мес. создано 274, закрыто 140. Разбивки по числу сотрудников на странице нет.

**Федерация FETEIA-OLTRA:** «más de 600 empresas asociadas», объединяет «la práctica totalidad» транзитариев и таможенных представителей страны, 20 региональных ATEIA; через её членов проходит 90 % внешней торговли Испании (сниппеты LinkedIn FETEIA-OLTRA и Alianza FP Dual в выдаче поиска; сайт федерации https://www.feteia.org/feteia-oltra.php подтверждает 20 ATEIA и «90 %», но число членов на странице не указано). В заседании исполкома в июне 2026 участвовали 15 ATEIA (Empresa Exterior, 22.06.2026: https://empresaexterior.com/feteia-oltra-define-su-hoja-de-ruta-nueva-financiacion-formacion-y-elecciones-en-octubre/ ).

**ATEIA-OLTRA Barcelona (Gotcarga, 26.06.2013) [>24 мес]:** 130 компаний-членов, ~8 000 занятых в провинции, 7 820 сотрудников у членов (2010), €3 млрд оборота (2010); 86 % — МСП (https://www.gotcarga.com/barcelona-concentra-el-20-del-total-de-empresas-trasitarias-de-espana/ ).

**DBK «Empresas Transitarias», 14-е издание (февраль 2026; https://www.dbk.es/es/tipos-estudios/sectores-basic/empresas-transitarias ):** анализирует 38 ведущих компаний; итоговых чисел по сектору в открытой части нет (платный отчёт, 200 стр.).

**Consejo General de Agentes de Aduanas:** только колехиадос (члены коллегий) могут выступать «agente de aduanas-representante aduanero» (https://representantesaduaneros.com/portal-de-transparencia/la-profesion-en-espana/ ); численность колехиадос на сайте не опубликована — не найдено.

### ЕС

**Eurostat SBS `sbs_ovw_act` (2023):** **H52.29, EU-27: 70 000 предприятий, 1 212 080 занятых** (2022: 68 650 / 1 207 719). По странам (предприятия / занятые, 2023): DE 13 456 / 426 881; IT 7 586 / 178 534; PL 6 150 / 50 164; ES 5 372 / 89 604; FR 3 429 / 124 543; NL 3 173 / 56 490.

**Eurostat SBS `sbs_sc_ovw` (2023), H522, EU-27 по размерным классам:** всего 140 000; 20–49 чел.: **6 700**; 50–249: **4 251**; ≥250: **1 147**. Германия: 20–49 — 1 913, 50–249 — 1 124, ≥250 — 261; Италия: 1 271 / 945 / 225; Франция: 360 / 266 / 94; Нидерланды: 286 / 196 / 63; Польша: 310 / 169 / 47.

**Оценка ЕС [оценка]:** доля 52.29 в 522 по ЕС ≈ 50 % предприятий (70 000 / 140 000) и ≈ 58 % занятых → компаний 52.29 с 20–249 сотрудниками ≈ **5 000–6 000**, из них 50–249 ≈ **2 100–2 500**; сегмент 30–500 чел. ≈ **4 000–5 000** компаний по ЕС-27.

**CLECAT (европейская федерация экспедиторов и таможенных агентов; https://www.clecat.org/organisation/objectives ):** «represents the interests of more than 19.000 companies employing in excess of 1.000.000 staff», >20 национальных ассоциаций; европейские экспедиторы/таможенные агенты очищают ~95 % грузов, обрабатывают 65 % автомобильных, 95 % авиа- и 65 % морских перевозок (заявленное федерацией).

### СНГ (отдельный сценарий)

**Россия — Реестр таможенных представителей ФТС России, редакция от 28.08.2026** (зеркало документа на портале Альта-Софт: https://www.alta.ru/tamdoc/19bn0132/ ; официальный реестр: https://customs.gov.ru/registers/customs-representatives — при обращении 2026-09-05 отдал HTTP 503). Подсчёт по HTML-таблице документа (мой парсинг строк с 4-значным регистрационным номером): **всего записей 2 159, из них «Исключен» — 1 329, действующих — 830** [подсчёт аналитика по первоисточнику; погрешность ±2–3 % из-за строк-дублей]. Для сравнения: расширенный реестр VEDrating (интеграция данных ФТС от 23.05.2023) показывает 180 брокеров, но это отфильтрованная выборка (https://vedrating.ru/reestrbrokerov/ ) [>24 мес]. Число экспедиторов (ОКВЭД 52.29) в России и размерная разбивка — не найдено (WebSearch-лимит).

**Казахстан — Реестр таможенных представителей КГД МФ РК** (https://kgd.gov.kz/ru/nsi/tsbrok/10/1 ): страница при обращении 2026-09-05 отдавала ошибку подключения к БД («записи отсутствуют»); зеркало uchet.kz — за платной авторизацией. Известно, что КГД утвердил рейтинг таможенных представителей за 01.07.2024–30.06.2025 приказом №695 от 31.08.2025 (сниппет cdb.kz). Число — **не найдено**.

---

## 2. Типовой системный ландшафт транзитария (Испания/ЕС)

Подтверждённые в источниках системы (все — вендорские страницы или отраслевые публикации, найдены в выдаче поиска 2026-09-05):

**A. Таможенное ПО и связь с AEAT (DUA, ENS/ICS2, AES, EMCS, depósitos):**
- **Taric S.A.** (Испания) — линейка «software aduanas»: TDua (декларации с автоклассификацией по базе dbTaric и расчётом платежей), TariffOne (онлайн-тариф), DA/DDA депозиты, ADT-LAME, G5, гарантии GRN, Ventanilla Única Aduanera, H7 (малоценные), Intrastat; «cubren a diario las necesidades de miles de profesionales», 30 лет на рынке (https://www.taric.es/productos-y-servicios/software-aduanas/ , https://www.taric.es/productos-y-servicios/software-aduanas/importexport/ ).
- **VisualTrans** — ERP для агентов и транзитариев, «conexión directa con AEAT», DUA, электронное оформление; новости о переходе на AES для экспорта (https://visualtrans.com/aduanas/ , https://visualtrans.com/noticias/aes/ ).
- **Quatuor Software** — G4/G3, решения для транзитариев, таможенных представителей, складов (https://www.tmsquatuor.com/software-de-gestion-aduanera-g4-g3-en-espana/ ).
- **Bytemaster B-First ERP (área de aduanas)** (https://www.bytemaster.es/en/b-first-erp/area-de-aduanas/ ), **DeiWorld** (ERP для транзитариев/агентов, модуль аduanas: DAE, DAT, EXS, ENS, T2L; https://deiworld.com/ ), **SC Trade Technologies** (https://www.sctrade.es/software-erp-aduanas/ ), **MIC Customs Solutions** (решение для AEAT; https://www.mic-cust.com/es/implementaciones-globales/soluciones/solucion-de-despacho-aduanero-para-aeat/ ).

**B. Forwarding/TMS:**
- **CargoWise (WiseTech Global)** — глобальный стандарт; публикует гайды по ICS2 R3 (https://www.cargowise.com/news/ics2-release-3-how-to-prepare-for-key-compliance-changes/ ). Shipamax (извлечение данных из документов) — часть WiseTech с 01.11.2022 (Crunchbase/PitchBook в выдаче; https://shipamax.com/about/ ).
- **Riege Scope** — «logistics software for freight forwarding, transportation and customs» (https://www.riege.com/ ).
- Испанские ERP выше (VisualTrans, DeiWorld, Quatuor, B-First) часто совмещают TMS + аduanas + бухгалтерию.
- **Magaya, Softlink, Akanea, Dixilog, Uniserv** — в выдаче по Испании не подтвердились; не включаю.

**C. Портовые системы (PCS):**
- **PORTIC (Port de Barcelona)** — PORTIC Forwarding для транзитариев и таможенных агентов (HTML5, без установки, интеграция с INTTRA и GT Nexus; морские/наземные/ж/д заказы; SCCP инспекции, VGM, видимость цепочки: приход судна, вход/выход контейнера, таможенный выпуск) — релиз 17.05.2021 (https://www.portdebarcelona.cat/en/node/869 ) [>24 мес].
- **valenciaportPCS** — раздел «Transitarios», интеграция по XML «через одно соединение» (https://www.valenciaportpcs.com/usuarios/transitarios/ , https://www.valenciaportpcs.com/nuestros-servicios/integracion/ ).

**D. Почта как основной операционный канал:** Levity (ИИ-автоматизация почты для логистики) интегрируется с Gmail, Outlook, CargoWise, SAP, Zendesk; кейсы — спот-котировки, ввод заказов, track&trace, arrival notices, AP/AR; «100M+ emails processed» (https://levity.ai/en ). Опрос Deep Current (600 ЛПР экспедиторов/NVOCC/брокеров/3PL, сентябрь 2025–январь 2026; публикация 23.02.2026): **более двух третей используют 5+ систем ежедневно**, только ~20 % применяют ИИ для проверки документов (https://trans.info/en/freight-digital-tools-457339 ).

**E. ERP/бухгалтерия:** Sage/A3 — общеиспанский стандарт для МСП, но специфического подтверждения именно для транзитариев в выдаче нет — `[НЕТ ИСТОЧНИКА — не для питча]`.

**Вывод по ландшафту:** у среднего испанского транзитария типично 4–6 систем: (1) TMS/ERP транзитария (VisualTrans/DeiWorld/Quatuor/CargoWise/Scope), (2) таможенный модуль/Taric с каналом в AEAT, (3) PCS порта (Portic/valenciaportPCS), (4) Outlook/Gmail + Excel с тарифами, (5) бухгалтерия, (6) порталы линий/INTTRA. Данные о статусе груза и ставках размазаны между ними.

**СНГ (кратко):** **Альта-ГТД** (Альта-Софт) — рабочее место декларанта: ДТ, предварительное информирование, транзит, 100+ видов документов; интеграция с 1С, SOLVO, Ролис и др. (https://www.alta.ru/programs/alta-gtd/ ). 1С:Управление транспортной логистикой, ВЭД-Декларант, Битрикс24 — общеизвестны, но в этой сессии не верифицированы.

---

## 3. Регуляторные ограничения на данные

- **UCC (Reglamento (UE) 952/2013), art. 51 — хранение документов:** «al menos durante tres años» вся документация по art. 15(1) в доступной для таможни форме; при корректировке таможенного долга срок продлевается ещё на 3 года; отсчёт — с конца года принятия декларации (Iberley: https://www.iberley.es/legislacion/articulo-51-codigo-aduanero-union-europea ; консолидированный текст EUR-Lex: https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:02013R0952-20161224 ). Практическое следствие для продукта: ИИ не должен быть «единственным местом хранения»; индексирование — поверх систем-источников.
- **Ответственность таможенного представителя:** при **прямом** представительстве представитель действует от имени и за счёт клиента и не несёт личной ответственности; при **косвенном** — от своего имени, становится декларантом и солидарно отвечает за таможенный долг (UCC art. 77(3)); риск доначислений до 3 лет после выпуска (обзоры: Grant Thornton NL по ECJ об импортном НДС https://www.grantthornton.nl/en/insights-en/topics/vat/ecj-indirect-customs-representative-is-not-jointly-liable-for-import-vat/ ; Customs Easy https://customseasy.com/customs-representation-direct-or-indirect/ ). Следствие: любая ИИ-подсказка по классификации/стоимости — только «черновик под подпись» человека.
- **Испания: только колехиадос** могут действовать как agente de aduanas–representante aduanero (Consejo General, ссылка выше). Пост-таможенные проверки AEAT ведутся в рамках сроков давности Ley General Tributaria (общий срок — 4 года, art. 66 LGT; консолидированный текст открыт: https://www.boe.es/buscar/act.php?id=BOE-A-2003-23186 , но статья в выдаче обрезана — число «4 года» указываю по общему знанию закона, проверить перед питчем).
- **ICS2 Release 3:** с **1 апреля 2025** — house-level ENS для морских перевозок (форвардеры либо передают полные данные линии, либо подают сами) (CargoWise, iCustoms в выдаче); с **1 сентября 2025** — обязательно для авто- и ж/д-операторов; до конца 2025 — multiple filing по всем видам транспорта (FIATA, 31.08.2025: https://fiata.org/n/eu-ics2-alert-ics2-release-3-goes-live-on-1-september-2025/ ). Это добавляет транзитариям объём структурированных данных «до погрузки» — новая точка боли и данных.
- **Испания, DeCA:** внедрение «Documento electrónico de Control Administrativo» запланировано на октябрь 2026 (Empresa Exterior, 22.06.2026) — ещё одно изменение форматов данных; **AES** (экспорт) уже внедрён (VisualTrans).
- **AEO (UCC art. 39, критерий безопасности):** заявитель должен иметь «appropriate information technology security measures – for example firewalls and anti-virus protection – to protect the applicant's computer system from unauthorised intrusion and to secure the applicant's documentation» (AEO Manual, Revenue Ireland: https://www.revenue.ie/en/tax-professionals/tdm/customs/authorised-economic-operators/instruction-on-authorised-economic-operators.pdf ; EU AEO Guidelines: https://taxation-customs.ec.europa.eu/system/files/2017-03/aeo_guidelines_en.pdf ). Для ИИ-продукта: у AEO-клиентов будут требовать описания контроля доступа, журналирования, локализации данных — SaaS в ЕС и права доступа «как в системе-источнике» обязательны.
- **GDPR / LOPDGDD (LO 3/2018):** персональные данные в BL/инвойсах/контактах — стандартные требования (DPA, минимизация, ЕС-хостинг); отдельных отраслевых актов для транзитариев не найдено; отраслевой источник не искал — общее знание.
- **Коммерческая тайна:** ставки линий/агентов и клиентские тарифы — ключевой актив; при мультиарендной системе нужна жёсткая изоляция тенантов и запрет на дообучение на данных клиента. Регуляторного акта нет — это требование рынка (`[НЕТ ИСТОЧНИКА — не для питча]` как цифра, но как риск — очевидно).

**Вывод:** проходимость нормальная для **read-only ассистента** (ответы на вопросы, черновики писем/котировок); высокая планка для **автономных таможенных действий** (классификация, подача DUA) из-за солидарной ответственности представителя и 3+3-летнего горизонта проверок.

---

## 4. Признаки боли из открытых источников

**Опросы/исследования (измеренное/заявленное):**
- **Deep Current, февраль 2026** (600 ЛПР: forwarders, NVOCC, customs brokers, 3PL; опрос сентябрь 2025–январь 2026): 83 % работают «реактивно»; ~75 % принимают 50+ операционных решений в день, 50 % — 100+; 43 % отмечают рост объёма решений за 5 лет **несмотря на цифровизацию**; >2/3 используют 5+ систем ежедневно; ~20 % используют ИИ для проверки документов; >50 % понесли финансовые потери от ручных ошибок за 12 мес. (https://trans.info/en/freight-digital-tools-457339 ). Вывод источника: цифровизация усилила фрагментацию систем, а не снизила нагрузку.
- **FreightCaviar / Epay Manager, опрос брокеров (США), 12.12.2024:** ~12 % рабочего времени (>260 ч/год) уходит на бэк-офисные «бумажные» проблемы; 93 % решают споры по счетам перевозчиков по почте (47 %) или телефону (46 %); 42 % команд тратят ≥1 ч/день на аудит документов; у 1 из 4 брокеров >25 % входящих инвойсов требуют разбирательств (https://www.freightcaviar.com/freight-brokers-youre-spending-12-of-your-time-fixing-back-office-issues/ ). Выборка не раскрыта; рынок США (брокеры, не транзитарии).
- **Shipmnts (блог, без первоисточника):** «96 % форвардеров используют хотя бы один ИИ-инструмент, только 17 % считают операции полностью автоматизированными» (ссылается на «2024 global survey» без названия) и «BCG 2023: традиционный форвардер тратит в среднем 62 минуты на обработку одного шипмента» (https://shipmnts.com/blog/why-forwarders-use-ai-but-arent-automated ) — первоисточник BCG не открыт; **`[НЕТ ПЕРВОИСТОЧНИКА — не для питча]`**.
- **Raft (пресс-релиз Series B, страница датирована на сайте 01.09.2026):** клиент ALS (таможенное управление, 700+ специалистов в 50 локациях) обрабатывает через Raft 130 000+ документов в месяц; кейсы — инвойсы, таможенная документация (https://www.raft.ai/resources/press-releases/raft-raises-30m-in-series-b-funding-to-transform-global-supply-chain-execution-with-ai ). Levity: 100M+ обработанных писем (https://levity.ai/en ).

**Испанские отраслевые медиа (заявленное):**
- Diario del Puerto, 30.11.2021 [>24 мес]: Enric Ticó (FETEIA) и Glauc Fornés (a.hartrodt España) — цифровизация как стратегический вызов, три направления: онлайн-котировки/контрактация, операционные процессы, управление данными; цель — убрать «трудоёмкие задачи без ценности для клиента»; проблема поколенческой смены и найма (https://www.diariodelpuerto.com/logistica/los-transitarios-se-enfrentan-a-la-digitalizacion-la-descarbonizacion-y-la-integracion-vertical-MAGD16382010201096570 ).
- FETEIA-OLTRA, дорожная карта 2026 (22.06.2026): среди приоритетов — «relevo generacional», обучение (партнёрство с Grupo Planeta), DeCA, снижение админ-нагрузки по CATCH (импорт рыбопродукции); XIV Конгресс включает «relevo generacional y transformación del sector» (https://www.feteia.org/cms/1/2776/todo-preparado-para-el-xiv-congreso-feteia-2026-en-tenerife ).
- Diario del Puerto, спецвыпуски «TRANSITARIOS 2024» и «IA y Tecnología Logística 2025» (https://recursos.diariodelpuerto.com/publicaciones/TRANSITARIOS-2024/ , https://recursos.diariodelpuerto.com/publicaciones/IA-Y-TECNOLOGIA-LOGISTICA-2025/ ) — не открыты (не хватило лимита), содержание не проверено.
- Reddit r/logistics / r/freightforwarding — конкретные треды **не найдены** (поисковый лимит; Bing/DDG не отдали результатов).

**Роли, которые нанимают на «разгребание информации» (InfoJobs, Барселона, выдача 2026-09-05; https://www.infojobs.net/ofertas-trabajo/barcelona/operativo-trafico-maritimo ):** 5 вакансий «operativo de tráfico marítimo»:
- El Mosca / Go Global — Operativo de Tráfico Marítimo Nacional Senior (El Prat), indefinido, з/п не указана;
- Projectel Transfers — Operativo/a de Tráfico – Logística Internacional (Barcelona), indefinido;
- **Berlox Meridian — Operativo de Tráfico: 21 000–27 000 € брутто/год**;
- **Duamar Tránsitos y Aduanas — Transitario/a transporte marítimo: 24 000–30 000 € брутто/год**;
- **Transglory — Customer Service Exportación Marítima: 21 000–26 000 € брутто/год**.
Функционал в описаниях: координация pick-up/доставок/транзитов, «contacto diario con clientes, transportistas, navieras, agentes internacionales y proveedores» — то есть роль в основном почтово-коммуникационная. Также в выдаче: Grafton — Operativo/a de Tráfico Marítimo y Aéreo (Madrid), «salario según experiencia».

---

## 5. Нишевые ИИ-конкуренты (кратко)

| Компания | Страна | Что делает | Целевой клиент | Стадия / раунд | Источник |
|---|---|---|---|---|---|
| **Raft** | UK/US | ИИ-платформа для форвардеров и таможенных брокеров: обработка инвойсов, таможенная документация, извлечение данных; «rewrite the technology playbook for freight forwarders and customs brokers» | Крупные и средние форвардеры/брокеры (кейс ALS — 700+ чел.; Navia Freight; «leading global freight forwarder») | **Series B $30M**, лид Eight Roads, участие Bessemer, Episode 1, Dynamo, Moguntia | https://www.raft.ai/resources/press-releases/raft-raises-30m-in-series-b-funding-to-transform-global-supply-chain-execution-with-ai ; Air Cargo News (403 при открытии); PitchBook в выдаче. Дата раунда в открытой странице не подтверждена. |
| **Expedock** | US/PH | ИИ-обработка документов → данные в инструменты форвардера (CargoWise и др.): инвойсы, statement of accounts, сверка, постинг | Форвардеры и международные логисты, в т.ч. крупные (Wayfair, ClearFreight, JUSDA, Ascent) | **Series A $13,5M (10.08.2022), всего $17,5M**, лид Insight Partners [>24 мес] | https://www.insightpartners.com/ideas/expedock-raises-13-5m-series-a-led-by-insight-partners-to-solve-and-accelerate-the-global-supply-chain/ |
| **Vooma** | US | ИИ-агенты для **автоброкеров и перевозчиков** (quote, cover, schedule, voice) — не транзитарии | Брокеры/перевозчики США | $16,6M (Series A $13M Craft Ventures + seed $3,6M Index); выручка ×12,5 | FreightWaves, Index Ventures в выдаче (https://www.freightwaves.com/news/vooma-grabs-16-6m-in-funding-as-brokers-prepare-for-market-swing ) |
| **Levity** | DE (Berlin) | «Communication Intelligence»: автоматизация почтовых процессов — спот-котировки, ввод заказов, track&trace, arrival notices, AP/AR; интеграции Gmail/Outlook/CargoWise/SAP/Zendesk | Enterprise-форвардеры с большим объёмом почты (кейс Gebrüder Weiss) | Раунды — **не найдено** | https://levity.ai/en |
| **Shipamax** | UK | Извлечение данных из BL/инвойсов/упаковочных листов в TMS | Форвардеры на CargoWise | $7M привлечено; **куплена WiseTech Global 01.11.2022** | https://shipamax.com/about/ ; https://shipamax.com/blog/shipamax-raises-7m-to-help-automate-logistics-backoffice/ |
| **Cargofive** | PT (Lisbon), работает в Иберии/LatAm | Управление морскими/авиа-ставками, мультимодальные котировки, API к ERP и линиям | «small, midsize and top-50 forwarders», **100+ клиентов** | **€2,5M (25.03.2024)** — Lince Capital, Shilling, Indico Capital, EIT Urban Mobility [>24 мес] | https://cargofive.com/cargofive-raises-e2-5m-to-accelerate-digital-transformation-in-freight-forwarding/ ; https://www.eu-startups.com/2024/03/lisbon-based-cargofive-raises-e2-5-million-to-continue-accelerating-digital-transformation-in-freight-forwarding/ |
| **Digicust** | AT | ИИ по таможне: из PDF/писем/таблиц/ERP → определение тарифного кода, проверка экспортных ограничений, подготовка деклараций | Таможенные брокеры, форвардеры, экспортёры; Европа | **Pre-Series A €2,3M (18.12.2025)** — Jet Investment €950k, LookAI €250k, частные инвесторы €550k, aws €500k | https://www.vestbee.com/insights/articles/digicust-secures-2-3-m ; https://en.ain.ua/2025/12/18/digicust-raises-eur23m/ |
| **Customs4trade (C4T)** | BE (Mechelen) | Платформа CAS: мультистрановая таможенная автоматизация, спецпроцедуры, акцизы, ИИ-классификация | Корпорации-грузовладельцы, LSP, брокеры, таможенные органы | **Series C €17M (16.06.2021)**, всего ~€22M на тот момент; позже Series C-II $4,37M (04.2023), всего ~$33,9M (CB Insights) [>24 мес] | https://www.customs4trade.com/blog/c4t-secures-17m-to-set-the-global-standard-for-customs ; CB Insights/Crunchbase в выдаче |
| **Kale Logistics Solutions** | IN | Cargo community systems для аэропортов/портов (не ИИ-ассистент для МСП) | Аэропорты, порты, крупные операторы | Series B $30M (Creaegis), Series A $5M (2020) | сниппет в выдаче |
| **Taric (TariffOne, TDua)** | ES | Инкумбент таможенного ПО с автоклассификацией по базе | Тысячи профессионалов Испании | Частная, зрелая | https://www.taric.es/productos-y-servicios/software-aduanas/ |
| Beacon, Cargoflip, Zencargo, Forto, Loadsmart, «Avocado AI» | — | **Не проверены** в этой сессии (лимит поиска) — не включать в питч без проверки | | | |

**Вывод:** прямого аналога «Glean для среднего транзитария Испании» (ассистент поверх TMS + таможня + PCS + почта, отвечающий на вопросы и готовящий черновики) не найдено. Смежные ниши заняты: извлечение документов (Shipamax/WiseTech, Expedock, Raft), таможенная классификация (Digicust, C4T, Taric), управление ставками/котировки (Cargofive — уже на иберийском рынке, 100+ клиентов), почтовая автоматизация для enterprise (Levity). Испанских ИИ-стартапов именно для транзитариев в выдаче не обнаружено (поиск не завершён).

---

## 6. Лучший процесс для первой версии продукта

Кандидаты и оценка (частота / стоимость / доступность данных / риск ошибки / конкуренция):

| Процесс | Частота | Стоимость для клиента | Доступность данных | Риск ошибки | Конкуренты |
|---|---|---|---|---|---|
| A. Ответ на статус-запрос «где мой груз» + вопросы по документам из нескольких систем | Очень высокая (ежедневно, десятки-сотни писем; роли customer service/operativo — €21–30k) | Средняя на запрос, высокая суммарно (по Deep Current — 5+ систем, «реактивная» работа) | Высокая: TMS, PCS (Portic/valenciaportPCS дают события судна/контейнера/выпуска), трекинг линий, почта | Низкий (read-only, ответ проверяет человек) | Слабая для среднего сегмента (Levity — enterprise) |
| B. Ответ на запрос котировки из e-mail с подбором ставок из истории/тарифов | Высокая | Высокая (прямое влияние на выручку и скорость ответа) | Средняя: ставки в Excel/почте/тарифных PDF, часто не структурированы | Средний (ошибка в ставке = потеря маржи; но человек подписывает) | Cargofive (Иберия), Levity |
| C. Извлечение данных из BL/инвойсов/packing list в TMS | Высокая | Средняя | Высокая | Средний | Сильная: Shipamax (внутри CargoWise), Expedock, Raft, Digicust |
| D. Таможенная классификация и подготовка DUA | Высокая у агентов | Высокая | Высокая (Taric-база) | **Высокий**: солидарная ответственность представителя, горизонт проверок 3+3 года (UCC art. 51, 77) | Taric, Digicust, C4T |
| E. Сверка счетов перевозчиков | Средняя (месячные циклы) | Средняя-высокая | Средняя (PDF-инвойсы линий) | Средний | Expedock, Raft |

**Рекомендация для v1: процесс A (операционный ассистент «статус + документы» поверх TMS/PCS/почты), с быстрым расширением в B (черновик ответа на котировку).**

Аргументы:
1. **Частота и ФОТ.** Это ежедневная работа самых массовых ролей (operativo de tráfico, customer service; в Барселоне 21–30k € брутто/год каждая), и именно на неё жалуется рынок: «реактивная» работа, 5+ систем, рост числа решений (Deep Current, 2026).
2. **Данные уже есть и структурированы:** события в PCS (Portic/valenciaportPCS: приход судна, вход/выход контейнера, таможенный выпуск), статусы в TMS, переписка в Outlook — их достаточно для ответа без нового ввода данных.
3. **Минимальный регуляторный риск:** ассистент не принимает таможенных решений и ничего не подаёт в AEAT — обходит проблему ответственности представителя (UCC art. 77) и AEO-требований к изменению данных; достаточно прав чтения и ЕС-хостинга.
4. **Свободная ниша в среднем сегменте:** конкуренты на почте (Levity) продают enterprise; извлечение документов и классификация — заняты; Cargofive закрывает ставки, но не «ответы по данным компании».
5. **Естественная воронка к B:** тот же индекс почты + история отгрузок даёт «похожие прошлые котировки» для черновика ответа — это уже прямое влияние на выручку, а не только на затраты.

Против D как v1: высокий риск и сильные инкумбенты (Taric у «тысяч профессионалов»). Против C: рынок консолидирован вокруг WiseTech/Expedock/Raft, дифференциация слабая.

---

## 7. Средний ФОТ ролей

**Испания (брутто/год):**
- Operativo de tráfico (Барселона, InfoJobs 09.2026): **21 000–27 000 €** (Berlox), **24 000–30 000 €** (Duamar); Customer Service exportación marítima: **21 000–26 000 €** (Transglory) (https://www.infojobs.net/ofertas-trabajo/barcelona/operativo-trafico-maritimo ).
- Agente de aduanas (Glassdoor España, 2025–2026): медиана **26 000 €/год** (P25 22 500 €, P75 32 500 €, P90 42 500 €); Мадрид — 26 000 € (20 000–30 000 €) (https://www.glassdoor.es/Sueldos/agente-de-aduanas-sueldo-SRCH_KO0,17.htm , https://www.glassdoor.es/Sueldos/madrid-agente-aduanas-sueldo-SRCH_IL.0,6_IC2664239_KO7,21.htm ). Отдельная страница «Agente Aduanero» показывает 48 688 € (41 008–50 567 €) — вероятно, смешанная выборка, **сомнительно** (https://www.glassdoor.es/Sueldos/agente-aduanero-sueldo-SRCH_KO0,15.htm ).
- Общая вилка транзитария по конвенциям (Click&Cargo, 18.05.2026, ориентировочно): **22 000–38 000 €** брутто/год; SMI 2026 — 17 094 €/год (https://clickandcargo.com/sueldo-transitario-convenio/ ).
- Конвенции: для Барселоны существует отдельный **Convenio colectivo de Transitarios y Aduanas de Barcelona** (код 08016425012010; на ccoo.app выложен текст 2010–2013 — категории: jefes, oficial 1ª/2ª, auxiliar administrativo, técnicos, agentes de aduanas; 1 700 ч/год; 4 экстра-выплаты) — **актуальные таблицы 2024–2026 не найдены** (https://ccoo.app/convenio/convenio-colectivo-transitarios-y-aduanas-de-barcelona/ ) [>24 мес]. Соседний convenio «Transporte y Logística de Barcelona» индексировал таблицы на 4,75 % (2023), 4,5 % (2024), 4,25 % (2025) (Cadena de Suministro: https://www.cadenadesuministro.es/logistica/actualizadas-tablas-salariales-convenio-colectivo-logistica-transporte-barcelona_1514695_102.html ).
- **Полная стоимость для работодателя [оценка]:** брутто × ~1,30–1,33 (соцвзносы работодателя) → operativo/customer service **≈ 28 000–40 000 €/год**, agente de aduanas ≈ 30 000–43 000 €/год.

**ЕС-ориентир:**
- Германия: Speditionskaufmann — **~45 000 €/год** (диапазон 41 355–52 511 €; вход ~43 400 €) (jobvector/StepStone/gehaltsvergleich в выдаче: https://www.jobvector.de/gehalt/speditionskaufmann/ , https://www.stepstone.de/gehalt/Speditionskaufmann-frau.html ); Zolldeklarant — **~45 000–45 700 €/год** (https://www.gehaltsvergleich.com/gehalt/Zolldeklarant-Zolldeklarantin , https://de.indeed.com/karriere-guide/gehalt/zolldeklarant-gehalt ).
- Нидерланды: Declarant — **€3 225–3 611/мес** (~€42–47k/год с отпускными); douanedeclarant €3 536/мес, junior €2 930/мес (Indeed NL, Werkzoeken, Nationale Beroepengids в выдаче: https://nl.indeed.com/career/declarant/salaries , https://www.werkzoeken.nl/salaris/declarant/ ).

**СНГ (отдельно, руб./мес):**
- Специалист по таможенному оформлению: Москва **124 125 ₽** (ГородРабот, 2026: https://moskva.gorodrabot.ru/salaries/specialist-po-tamozhennomu-oformleniyu ), Московская область 90 400 ₽ (2025); декларант, вакансии hh.ru Москва — 70 000–100 000 ₽ (https://hh.ru/vacancies/deklarant ).
- Специалист по логистике и ВЭД: Москва **140 000 ₽**, Россия 98 000 ₽ (Dream Job: https://dreamjob.ru/salary/specialist-po-logistike-i-ved ); логист Москва 103 128 ₽ (ГородРабот 2026).
- Cleverence (05.09.2025): логист-диспетчер 50–65k (регионы) / 80–90k (Москва, СПб); менеджер по логистике 90–140k; руководитель отдела 170–250k; ВЭД-компетенции +15–25 % к доходу (https://www.cleverence.ru/articles/sklad-i-logistika/-zarplata-v-transportnoy-logistike-v-2024-godu-ot-dispetchera-do-direktora/ ).
- Казахстан — не найдено.

---

## 8. Доступность ЛПР для интервью извне

**Ассоциации (Испания):**
- **FETEIA-OLTRA** — федерация 20 ATEIA, >600 компаний (заявлено), президент Enric Ticó; выборы президента **1 октября 2026** на конгрессе; создаёт «FETEIA SERVICES» для диверсификации доходов — открыта к партнёрствам (Empresa Exterior, 22.06.2026). Списки членов по ATEIA публичны: https://www.feteia.org/socios.php?orden=empresa , по регионам (пример Madrid: https://www.feteia.org/ateias.php?tipo_socio=3&ateia_dependiente=18 ; Las Palmas: https://www.feteia.org/ateias.php?tipo_socio=3&ateia_dependiente=17 ) — готовый список для аутрича.
- **ATEIA-OLTRA Barcelona** (https://ateia-madrid.com/informacion-sobre-ateia-madrid/ — Madrid; Barcelona — через feteia.org) — 260 компаний в Каталонии по Libro Blanco; 8 из топ-15 сидят в Барселоне.
- **Consejo General de Colegios de Agentes de Aduanas y Representantes Aduaneros** — реестр колехиадос с поиском (https://representantesaduaneros.com/busqueda-de-agentes/ ), региональные коллегии (https://representantesaduaneros.com/colegios/ ).
- Propeller Club Barcelona, Barcelona-Catalunya Centre Logístic (BCL) — события на осень 2026 **не проверены** (лимит поиска).

**События, сентябрь–декабрь 2026 (только подтверждённые):**
- **XIV Congreso FETEIA — Tenerife, 1–4 октября 2026** (темы: таможенные новации, практическое применение новых регуляций, Ley de Movilidad Sostenible, relevo generacional, диалог с госорганами; выборы президента 1 октября) (https://www.feteia.org/cms/1/2776/todo-preparado-para-el-xiv-congreso-feteia-2026-en-tenerife ; Cadena de Suministro об открытии регистрации: https://www.cadenadesuministro.es/logistica/feteia-abre-inscripciones-xiv-congreso-nacional-tenerife_1517215_102.html ). Лучшее место для 20–40 интервью за 3 дня: собираются владельцы и директора средних транзитариев со всей Испании.
- **Logistics & Automation Madrid — IFEMA, 11–12 ноября 2026**, совместно с Empack и Logistic & Industrial Build; 4 конференц-зала, 250+ спикеров (https://www.ifema.es/logistics-automation , https://www.esmadrid.com/agenda/logistics-automation-madrid-ifema-madrid ). Аудитория шире (интралогистика), транзитарии — меньшинство.
- **SIL Barcelona 2026 прошёл 3–5 июня 2026** (Fira Montjuïc, 28-е издание, «IA Corner»); следующий — 2027 (https://www.silbcn.com/es/ , https://elmercantil.com/evento/sil-2026/ ). В окно сентябрь–декабрь не попадает.
- Медиа-каналы для доступа: Diario del Puerto, Cadena de Suministro, Transporte XXI (ежегодный Libro Blanco + рейтинг — готовый список 832 компаний с выручкой), El Mercantil, Naucher.

---

## Что не нашёл

1. Разбивка INE DIRCE по стратам 200–499 и 500–999 для CNAE 522 — серии не вернулись в выдаче API (возможно, иное наименование); нужен ручной запрос на ine.es.
2. Число компаний именно 52.29 по размерным классам (INE даёт только 3-значную группу; Eurostat 4-значный код — без размеров). Все числа по «30–500 чел. в 52.29» — оценки.
3. Точное число членов FETEIA на официальной странице (есть только «más de 600» в сторонних сниппетах) и число колехиадос таможенных агентов.
4. Актуальные таблицы Convenio de Transitarios y Aduanas de Barcelona 2024–2026 (только текст 2010–2013).
5. Треды Reddit (r/logistics, r/freightforwarding) с описанием почтовой/ручной боли — поиск не отработал.
6. Первоисточник «BCG: 62 минуты на шипмент» и «96 % / 17 %» (Shipmnts не даёт ссылок).
7. Раунды Levity, Beacon, Cargoflip; Zencargo/Forto/Loadsmart не проверялись. Дата Series B Raft ($30M) — страница пресс-релиза открыта, но дата на ней выглядит как дата страницы (01.09.2026), сторонние источники (Air Cargo News) отдали 403.
8. Испанские ИИ-стартапы для таможни/транзитариев — поиск не завершён.
9. Казахстан: число таможенных представителей (страница КГД неработоспособна), зарплаты.
10. Россия: число экспедиторов (ОКВЭД 52.29) и размерная структура; членство АРЭ.
11. DSLV (Германия) / FENEX (Нидерланды) — число членов не проверено.
12. События Propeller Club Barcelona и BCL на осень 2026.
13. Прямых опросов испанских транзитариев о доле времени на e-mail/ручной ввод — не найдено; есть только международные (Deep Current, FreightCaviar).

## Что сомнительно

- **CLECAT «19 000 компаний / 1 000 000 сотрудников»** — заявление федерации без методологии; расходится с Eurostat (70 000 предприятий 52.29 в ЕС), т.к. считает только членов национальных ассоциаций.
- **eInforma 11 568–11 861 компаний в CNAE 5229** против Eurostat 5 372 — eInforma считает все зарегистрированные юрлица под кодом (включая спящие); для сегментации использовать Eurostat/INE.
- **Glassdoor «Agente Aduanero» 48 688 €** — противоречит «Agente de Aduanas» 26 000 € на том же ресурсе; вероятно, малая/смешанная выборка.
- **Опрос FreightCaviar** — рынок США, брокеры, спонсор — вендор (Epay Manager), выборка не раскрыта.
- **Мой подсчёт «830 действующих таможенных представителей» в реестре ФТС** — парсинг HTML-зеркала; строки-дубли могут давать погрешность в единицы процентов; официальная сводка ФТС недоступна (503).
- **Оценки «300–400 компаний 52.29 с 30–500 чел. в Испании» и «4 000–5 000 в ЕС»** — пропорциональное распределение, а не измерение; внутри 52.29 транзитарии крупнее среднего по группе, поэтому реальное число может быть выше на 10–30 %.
- Libro Blanco 2024 описывает 2022 год (пик фрахтовых ставок) — маржи и медианная выручка завышены относительно 2024–2026.
- Число «90 % внешней торговли проходит через членов FETEIA» — самооценка федерации.

## Оценка ниши (1–5)

| Критерий | Оценка | Обоснование |
|---|---|---|
| Плотность информационной боли | **4** | Международные опросы 2024–2026 фиксируют 5+ систем в день, реактивную работу и потери от ручных ошибок; массовые роли за 21–30k € заняты перепиской; но испанских измерений нет. |
| Размер сегмента (Испания / ЕС) | **3** | Испания: ~300–400 целевых компаний [оценка] при медианной выручке €4 млн и марже ~4 % — узко и чувствительно к цене; ЕС: ~4–5 тыс. компаний [оценка] — достаточно для масштабирования. |
| Регуляторная проходимость | **4** | Для read-only ассистента (статусы, документы, черновики) барьеры стандартные (GDPR, ЕС-хостинг, AEO-ИТ-безопасность); красная зона — только автономные таможенные действия (UCC art. 51/77). |
| Отсутствие сильного нишевого конкурента | **3** | Прямого «Glean для средних транзитариев» нет, но смежные ниши плотно заняты (Raft/Expedock/Shipamax — документы; Digicust/C4T/Taric — таможня; Cargofive — ставки в Иберии; Levity — почта для enterprise). |
| Доступность ЛПР для интервью | **4** | FETEIA (20 ATEIA, публичные списки членов) + Конгресс FETEIA 1–4 октября 2026 + Logistics & Automation 11–12 ноября 2026 + кластер из 260 компаний в Барселоне; рейтинги Transporte XXI дают готовый список 832 компаний. |

**Итог: 18/25.** Ниша подходит как стартовая при условии узкого v1 (ассистент «статус + документы + черновик котировки» поверх TMS/PCS/почты), с продажей через ATEIA и конгресс FETEIA; масштаб — за счёт ЕС (DE/IT/NL/FR), где та же структура систем (CargoWise/Scope + национальные таможенные модули + PCS).

---

## Источники (все открыты через WebFetch/API или видны в выдаче поиска 2026-09-05)

- INE DIRCE API: https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/39371 ; таблица: https://www.ine.es/jaxiT3/Tabla.htm?t=39371 ; пресс-релиз: https://www.ine.es/dyngs/Prensa/DIRCE2025.htm
- Eurostat SBS API (`sbs_sc_ovw`, `sbs_ovw_act`): https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/ ; https://ec.europa.eu/eurostat/databrowser/view/sbs_sc_ovw/default/table?lang=en ; https://ec.europa.eu/eurostat/databrowser/view/sbs_ovw_act/default/table?lang=en
- Transporte XXI Libro Blanco Sector Transitario 2024: https://www.transportexxi.com/wp-content/uploads/2025/02/TransporteXXI-LB-Sector-Transitario-2024-web.pdf
- eInforma CNAE 5229: https://www.einforma.com/informes-sectoriales/cnae-5229-empresas-otras-actividades-anexas-al-transporte
- FETEIA-OLTRA: https://www.feteia.org/feteia-oltra.php ; https://www.feteia.org/cms/1/2776/todo-preparado-para-el-xiv-congreso-feteia-2026-en-tenerife ; https://es.linkedin.com/company/feteia-oltra ; https://empresaexterior.com/feteia-oltra-define-su-hoja-de-ruta-nueva-financiacion-formacion-y-elecciones-en-octubre/
- CLECAT: https://www.clecat.org/organisation/objectives
- Consejo General de Agentes de Aduanas: https://representantesaduaneros.com/portal-de-transparencia/la-profesion-en-espana/
- Gotcarga (ATEIA Barcelona 2013): https://www.gotcarga.com/barcelona-concentra-el-20-del-total-de-empresas-trasitarias-de-espana/
- DBK: https://www.dbk.es/es/tipos-estudios/sectores-basic/empresas-transitarias
- Реестр ФТС (зеркало Альта-Софт): https://www.alta.ru/tamdoc/19bn0132/ ; VEDrating: https://vedrating.ru/reestrbrokerov/ ; КГД РК: https://kgd.gov.kz/ru/nsi/tsbrok/10/1
- Taric: https://www.taric.es/productos-y-servicios/software-aduanas/ ; VisualTrans: https://visualtrans.com/aduanas/ ; Quatuor: https://www.tmsquatuor.com/software-de-gestion-aduanera-g4-g3-en-espana/ ; DeiWorld: https://deiworld.com/ ; Riege: https://www.riege.com/ ; CargoWise ICS2: https://www.cargowise.com/news/ics2-release-3-how-to-prepare-for-key-compliance-changes/
- Portic: https://www.portdebarcelona.cat/en/node/869 ; valenciaportPCS: https://www.valenciaportpcs.com/usuarios/transitarios/
- UCC art. 51: https://www.iberley.es/legislacion/articulo-51-codigo-aduanero-union-europea ; FIATA ICS2: https://fiata.org/n/eu-ics2-alert-ics2-release-3-goes-live-on-1-september-2025/ ; AEO Manual (Revenue IE): https://www.revenue.ie/en/tax-professionals/tdm/customs/authorised-economic-operators/instruction-on-authorised-economic-operators.pdf ; LGT: https://www.boe.es/buscar/act.php?id=BOE-A-2003-23186
- Deep Current survey (trans.info): https://trans.info/en/freight-digital-tools-457339 ; FreightCaviar: https://www.freightcaviar.com/freight-brokers-youre-spending-12-of-your-time-fixing-back-office-issues/ ; Shipmnts: https://shipmnts.com/blog/why-forwarders-use-ai-but-arent-automated
- Diario del Puerto: https://www.diariodelpuerto.com/logistica/los-transitarios-se-enfrentan-a-la-digitalizacion-la-descarbonizacion-y-la-integracion-vertical-MAGD16382010201096570
- InfoJobs: https://www.infojobs.net/ofertas-trabajo/barcelona/operativo-trafico-maritimo ; Glassdoor: https://www.glassdoor.es/Sueldos/agente-de-aduanas-sueldo-SRCH_KO0,17.htm ; Click&Cargo: https://clickandcargo.com/sueldo-transitario-convenio/ ; ccoo.app: https://ccoo.app/convenio/convenio-colectivo-transitarios-y-aduanas-de-barcelona/ ; Cadena de Suministro: https://www.cadenadesuministro.es/logistica/actualizadas-tablas-salariales-convenio-colectivo-logistica-transporte-barcelona_1514695_102.html
- Конкуренты: Raft https://www.raft.ai/resources/press-releases/raft-raises-30m-in-series-b-funding-to-transform-global-supply-chain-execution-with-ai ; Expedock https://www.insightpartners.com/ideas/expedock-raises-13-5m-series-a-led-by-insight-partners-to-solve-and-accelerate-the-global-supply-chain/ ; Vooma https://www.freightwaves.com/news/vooma-grabs-16-6m-in-funding-as-brokers-prepare-for-market-swing ; Cargofive https://cargofive.com/cargofive-raises-e2-5m-to-accelerate-digital-transformation-in-freight-forwarding/ ; Digicust https://www.vestbee.com/insights/articles/digicust-secures-2-3-m ; C4T https://www.customs4trade.com/blog/c4t-secures-17m-to-set-the-global-standard-for-customs ; Shipamax https://shipamax.com/about/ ; Levity https://levity.ai/en
- События: https://www.ifema.es/logistics-automation ; https://www.silbcn.com/es/ ; https://www.cadenadesuministro.es/logistica/feteia-abre-inscripciones-xiv-congreso-nacional-tenerife_1517215_102.html
- Зарплаты ЕС/СНГ: https://www.jobvector.de/gehalt/speditionskaufmann/ ; https://www.gehaltsvergleich.com/gehalt/Zolldeklarant-Zolldeklarantin ; https://nl.indeed.com/career/declarant/salaries ; https://moskva.gorodrabot.ru/salaries/specialist-po-tamozhennomu-oformleniyu ; https://dreamjob.ru/salary/specialist-po-logistike-i-ved ; https://www.cleverence.ru/articles/sklad-i-logistika/-zarplata-v-transportnoy-logistike-v-2024-godu-ot-dispetchera-do-direktora/
