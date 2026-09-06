# Ниша: асесории / despachos profesionales (CNAE 69.20) — фирмы 30–500 сотрудников

Дата сбора: 2026-09-05/06. Стартовый рынок — Испания; ЕС — расширение; СНГ — отдельный сценарий (цифры не смешивать).
Условные обозначения: `[>24 мес]` — опубликовано до сентября 2024; `[НЕТ ИСТОЧНИКА — не для питча]` — число без подтверждённого источника; «измерено / заявлено / прогноз» — характер числа.

---

## 1. Число компаний целевого размера (30–500 чел.)

### 1.1 Испания — INE DIRCE (измерено, госстатистика)

Источник: INE, DIRCE на 1 января 2025, таблица 39372 «Empresas por CCAA, actividad principal (grupos CNAE 2009) y estrato de asalariados», получена через API Tempus (`https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/39372`), список таблиц — https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736160707&idp=1254735576550 ; пресс-релиз DIRCE 2025 — https://www.ine.es/dyngs/Prensa/DIRCE2025.htm (публикация — декабрь 2025).

Группа CNAE 692 «Actividades de contabilidad, teneduría de libros, auditoría y asesoría fiscal», Испания, всего **62 234** предприятия (INE DIRCE 1.1.2025). Разбивка по числу наёмных работников (asalariados):

| Страта (наёмные) | Испания | Cataluña | Madrid | C. Valenciana | Andalucía |
|---|---|---|---|---|---|
| Всего | 62 234 | 10 688 | 11 906 | 7 643 | 9 916 |
| Без наёмных | 31 840 | 5 489 | 6 494 | 3 912 | 5 267 |
| 1–2 | 19 098 | 3 178 | 3 612 | 2 364 | 3 046 |
| 3–5 | 6 557 | 1 008 | 990 | 832 | 1 061 |
| 6–9 | 2 785 | 521 | 426 | 344 | 344 |
| 10–19 | 1 599 | 377 | 283 | 173 | 176 |
| **20–49** | **239** | 77 | 51 | 16 | 17 |
| **50–99** | **61** | 21 | 22 | 0 | 1 |
| **100–199** | **23** | 9 | 7 | 1 | 4 |
| 200–999 | ≈27 (получено вычитанием: API не вернул строки 200–499 и 500–999; 62 234 − сумма остальных страт = 27) | н/д | н/д | н/д | н/д |
| 1000–4999 | 5 | 0 | 5 | 0 | 0 |

Вывод по целевому размеру 30–500 наёмных в Испании: **≈ 84 юрлица в страте 50–199 + часть из 239 в страте 20–49 + ≈27 в 200–999 → порядка 150–250 юрлиц** (оценка на базе INE; точной страты «30+» в DIRCE нет — это моя интерполяция, не измерение). Важно: DIRCE считает юридические единицы, а сети (ETL Global — «140+ despachos») состоят из десятков отдельных юрлиц, так что число «фирм как бизнесов» ещё меньше, а число «точек принятия решений» — больше.

Альтернативные оценки для сверки:
- 53 998 компаний CNAE 6920, средняя выручка 403 651 € на компанию, балансы 2024 г.; 1 410 создано / 753 закрыто за 12 мес. (eInforma, https://www.einforma.com/informes-sectoriales/cnae-6920-empresas-actividades-de-contabilidad-teneduria-de-libros-auditoria-y-asesoria-fiscal , данные 2024) — коммерческий агрегатор, только как наводка.
- «около 60 000 asesorías в Испании, 77 % — менее 10 сотрудников» (Wolters Kluwer, Barómetro de la Asesoría 2026, пересказ в ChannelPartner, https://www.channelpartner.es/ticpymes/siete-de-cada-10-asesores-en-espana-recurre-a-la-ia-para-ganar-en-eficiencia/ , 1 июля 2026; и MuyPymes, https://www.muypymes.com/2026/06/30/wolters-kluwer-barometro-asesoria-descubrelo , 30 июня 2026) — заявлено вендором, опрос.

### 1.2 ЕС — Eurostat SBS (измерено)

Источник: Eurostat, набор `sbs_sc_ovw` «Enterprise statistics by size class and NACE Rev. 2 activity (from 2021 onwards)», NACE M69.2, получен через API `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw` (датасет обновлён 2026-09-01; справочная страница набора — https://ec.europa.eu/eurostat/web/structural-business-statistics ). Размерные классы Eurostat — по **занятым (persons employed)**, включая собственников, поэтому цифры выше, чем в INE по наёмным.

Год 2023, число предприятий NACE M69.2:

| Гео | Всего | 20–49 занятых | 50–249 | 250+ | Занято, чел. |
|---|---|---|---|---|---|
| EU-27 | 622 035 | 7 000 | 2 200 | 401 | 2 049 781 |
| Испания | 66 404 | 528 | 134 | 26 | 180 811 |
| Германия | 54 896 | 3 246 | 722 | 54 | 464 307 |
| Франция | 22 866 | 955 | 445 | 79 | 216 207 |
| Италия | 133 140 | 389 | 186 | 19 | 278 446 |
| Нидерланды | 36 430 | 213 | 91 | 27 | 109 339 |
| Польша | 51 240 | 348 | 70 | 35 | 160 747 |

Оценка целевого сегмента 30–500 занятых: **ЕС-27 ≈ 5 000–6 000 предприятий** (≈ половина класса 20–49 + весь класс 50–249 + бо́льшая часть 250+); **Испания ≈ 350–450** (по занятым; по наёмным INE — 150–250). Германия — крупнейший пул (≈ 2 300–2 500), затем Франция (≈ 900–1 000). Это интерполяция на базе Eurostat, а не измеренная страта.

Германия, профессиональная статистика: на 1.1.2026 — 105 953 членов палат налоговых консультантов, из них 89 549 Steuerberater и 15 232 Berufsausübungsgesellschaften (профессиональных обществ); 17 081 договоров обучения Steuerfachangestellte (BStBK Berufsstatistik 2025, https://www.bstbk.de/mediapool/bstbk/ebooks/Berufsstatistik-2025/ и https://www.haufe.de/steuern/taxulting/berufsstatistik-2025-mehr-mitglieder-weniger-auszubildende_598848_683870.html , 2026). На 1.1.2025 — 104 845 членов, 88 995 Steuerberater, 17 301 обучающихся (BStBK, https://www.bstbk.de/de/infothek?rid=1210 , январь 2025).

### 1.3 Концентрация в Испании: сети vs средние региональные фирмы

Ranking Expansión «Ingresos de las firmas de servicios profesionales en España», выручка за 2024 г., млн € (рост, %) (Expansión, 16 апреля 2025, PDF на сайте ETL: https://etl.es/wp-content/uploads/2025/04/ranking.pdf ):
- ETL Global 198,8 (+8,3); BDO 142,1 (+4,2); Grant Thornton 100,28 (+5,2); Auren 96,24 (+12,3); PKF Attest 70,95 (+17,7); Adade e-Consulting 65,69 (+13,0); Forvis Mazars 58,1 (+5,4); Baker Tilly 57,18 (+34,9); Afianza Asesores 54,3 (+126,3); Crowe Spain 47,6 (+15,0); RSM 36,1 (+12,8); Eudita 32,6; HLB España 25,79; Kreston Iberaudit 25; Avincla 21,45; ADN & GRM 21,2; Moore Global 20,81; Vir Audit 19,39; Russell Bedford 19,14; UHY 16,01; Bnfix 14,02; Faura-Casas 13,4; PrimeGlobal 12,6; Busquet 10,98; далее фирмы 2–6 млн.
- Совокупно 40 фирм — 4 984 млн € (+11,7 %); без Big Four средние фирмы — 1 230 млн € (+12,8 %) (там же).
- ETL Global España 2025: 222 млн € (+12 %), девятый год подряд двузначный рост, «более 140 despachos», 32 города, «более 2 950 профессионалов» (Última Hora / Lawyerpress / Capital-Riesgo по пресс-релизу ETL, май 2026: https://www.ultimahora.es/noticias/comunidades/2026/05/18/2631927/etl-global-espana-facturo-222-millones-2025-mas.html ; https://www.lawyerpress.com/2026/05/19/etl-global-supera-los-222-millones-de-euros-de-facturacion-en-espana/ ). В ранкинге Expansión 2026 (за 2025) ETL — 222,1 млн € (+11,7 %), «средние фирмы превысили 1,4 млрд €» (ETL blog, https://etl.es/blog/blog/etl-global-ranking-firmas-servicios-profesionales-2025 , апрель 2026).
- Консолидация «снизу»: 9 % despachos покупали портфели клиентов; среди фирм 50+ сотрудников — 50 % покупают у более мелких конкурентов (Barómetro de la Asesoría 2026, пересказ Innovación Despachos, https://marketplace.innovaciondespachos.com/community/blog/post/el-barometro-de-la-asesoria-2026-leido-entero-por-que-el-sector-factura-mas-y-gana-menos , 17 июля 2026) — заявлено, опрос.
- Профильные ассоциации как индикатор размера рынка ЛПР: REAF-REGAF — «более 6 500» экономистов-налоговых консультантов (Consejo General de Economistas, https://economistas.es/reaf-economistas-asesores-fiscales/ , данные ~2020 `[>24 мес]`). Число членов AEDAF и колегиадос Gestores Administrativos — не найдено.

Вывод: рынок крайне фрагментирован (51 % юрлиц без наёмных, 82 % ≤2 наёмных), верхушка — 10–15 сетей/групп с выручкой 20–220 млн €, и между ними «средний слой» ≈100–250 региональных фирм 30–200 человек — это и есть ICP. Сети (ETL, Adade, Auren, Afianza) активно скупают такие фирмы, т.е. ICP частично «уходит» в сети, но внутри сетей остаётся автономным despacho с собственным стеком.

### 1.4 СНГ (отдельно)

- Россия: рейтинг RAEX «Аутсорсинг учётных функций» по итогам 2025 г. — 86 компаний/групп; топ-5 по выручке: «Моё дело» 2 266 млн ₽, «ИАС Аутсорсинг» 1 930 млн ₽ (+40,9 %), 1C-WiseAdvice 1 576 млн ₽, «СберРешения» 1 566 млн ₽, UCMS Group 1 236 млн ₽ (Коммерсантъ, https://www.kommersant.ru/doc/8690999 , 28 мая 2026). По итогам 2024 г. суммарный доход участников рейтинга RAEX — 18,7 млрд ₽ (+14 %) (RAEX, https://raex-rr.com/b2b/outsoursing/accounting_and_tax_service_rating/2025/analytics/ , 2025).
- Оценка «объём рынка >500 млрд ₽ (+38,1 %) за 2024» (TAdviser, https://www.tadviser.ru/index.php/Статья:Аутсорсинг_учётных_функций… , 2025) — иной периметр (вкл. внутренние ИТ/финансовые сервисы), сомнительно, см. «Что сомнительно». Исследование РБК «итоги 2025, прогноз до 2030» — платное, цифры недоступны (https://marketing.rbc.ru/research/45108/ , 19 апреля 2026).
- Казахстан: ≈800 аутсорсинговых компаний, в среднем 20–50 клиентов каждая; аутсорсинг используют <10 % из ≈400 тыс. компаний (Forbes.kz по исследованию ГК «Учёт» и EY, https://forbes.kz/articles/novyiy_goluboy_okean_pervoe_issledovanie_ryinka_autsorsinga_buhgalterskogo_nalogovogo_i_kadrovogo_ucheta_v_rk , 2 мая 2022 `[>24 мес]`).
- Число компаний 30–500 чел. в СНГ-аутсорсинге — не найдено; по составу рейтинга RAEX (86 участников с выручкой от десятков млн ₽) можно ожидать 50–100 компаний целевого размера в РФ `[НЕТ ИСТОЧНИКА — не для питча]`.

---

## 2. Типовой системный ландшафт

### 2.1 Испания
Типовой despacho 30–200 чел. работает в 4–6 системах одновременно:
1. **Учёт/налоги/зарплата (ядро):** Wolters Kluwer a3 (a3ASESOR: a3con, a3nom, a3eco, a3ren; облачная линейка a3innuva) — по отраслевым блогам «наибольшее проникновение в сегменте asesorías» (bvnj.com, «Software contable para gestorías: A3 vs Sage vs Holded», 2025 — блог, наводка); Sage Despachos Connected / Sage for Accountants; TS Contasol/Nominasol (Software DELSOL, ныне в группе TeamSystem — teamsystem.es); Cegid Despachos; Glasof, Diez Software — реже. Опрос 2024 по МСП (не по despachos): Sage 50 — 34 %, a3 ERP/a3innuva — 18 %, Contasol/Nominasol — 12 % (bvnj.com, 2024, блог — только как наводка). Официальной доли рынка по despachos не найдено.
2. **Госпорталы:** sede electrónica AEAT (модели 303/111/115/130/200/347/390…, colaboración social — представительство третьих лиц; https://sede.agenciatributaria.gob.es/Sede/colaborar-agencia-tributaria/colaboracion-social-presentacion-declaraciones/gestiones-colaboracion-social.html ), DEHú (Dirección Electrónica Habilitada única — единый ящик уведомлений AEAT и других администраций; https://sede.agenciatributaria.gob.es/Sede/ayuda/consultas-informaticas/notificaciones-electronicas-ayuda-tecnica/acceso-notificaciones-electronicas-dehu.html ), Seguridad Social (Sistema RED / SILTRA), SEPE Contrat@/Certific@, Registro Mercantil, порталы автономных сообществ.
3. **Клиентские ERP/фактурирование:** Holded (Visma), Quipu, Declarando, Sage Active, Contasol у клиентов — в 74 % despachos практикуется «модель сотрудничества с клиентами в облаке», 53 % — гибрид облако/on-premise (Barómetro 2025, BusinessWire, https://www.businesswire.com/news/home/20250701861262/es , 1 июля 2025).
4. **Коммуникации и документы:** Outlook/Microsoft 365 или Google Workspace, WhatsApp с клиентами, клиентские порталы (a3doc cloud, Sage портал), сетевые папки/SharePoint; 85 % ведут учёт рабочего времени «в основном в Excel» (Barómetro 2023, Accountex España blog, https://www.accountexespana.es/blog/wolters-kluwer-presenta-la-segunda-edicion-del-barometro-de-la-asesoria/ , 20 июня 2023 `[>24 мес]`).
5. **Уведомления:** сервисы мониторинга уведомлений (Findiur — 13–14 тыс. организаций; AI Consultas — модуль Notificaciones AEAT).

**Verifactu и электронная фактура — сроки и влияние:**
- Verifactu (RD 1007/2023): RDL 15/2025 (BOE 3 декабря 2025) перенёс обязательность на **1 января 2027** для плательщиков налога на прибыль (IS) и **1 июля 2027** для остальных (автономос и т.п.); технические требования сохранены, срок для производителей ПО (9 мес. от Orden HAC/1177/2024) не менялся (Noticias Jurídicas, https://noticias.juridicas.com/actualidad/noticias/20735-nueva-prorroga:-verifactu-no-sera-obligatorio-hasta-2027-para-sociedades-y-otros-contribuyentes/ ; fiscal-impuestos.com, https://www.fiscal-impuestos.com/aplazamiento-entrada-vigor-Verifactu-2027 ; декабрь 2025).
- Factura electrónica B2B (Ley Crea y Crece): регламент RD 238/2026 опубликован 31 марта 2026; обязательна с **1 октября 2027** для компаний с оборотом >8 млн €, с **1 октября 2028** — для остальных, сообщение статусов оплаты — с 1 октября 2029 (Wolters Kluwer, https://www.wolterskluwer.com/es-es/expert-insights/factura-electronica-obligatoria-que-es-plazos ; BBVA, https://www.bbva.com/es/es/empresas/factura-electronica-b2b-y-ley-crea-y-crece-calendario-requisitos-y-retos/ ; 2026).
- Влияние: 85 % despachos знают о Verifactu/e-фактуре, 78 % используют ПО для управления нормативкой (Barómetro 2026, ChannelPartner, 1 июля 2026); «большинство asesores призывают МСП готовиться к реформе фактурирования» (Barómetro 2025). Для продукта: 2027–2028 — окно, когда данные клиентов массово переходят в структурированный e-формат (упрощает доступ к данным), но и пик нагрузки на despachos.

### 2.2 ЕС — кратко
- Германия: де-факто стандарт DATEV (кооператив; ≈ 40 тыс. канцелярий-членов — `[НЕТ ИСТОЧНИКА — не для питча]`), DATEV Unternehmen online, ELSTER; DATEV Copilot в тестировании в «KI-Werkstatt» (см. §5).
- Франция: Cegid, Sage, ACD, Pennylane (6 000+ cabinets-партнёров, см. §5); обязательная e-фактура B2B с 2026–2027.
- Италия: TeamSystem, Zucchetti, Wolters Kluwer Italia (Genya); SDI e-фактура с 2019.
- Общий паттерн: одна доминирующая учётная платформа + госпорталы + Office; данные — фрагментированы между практикой, клиентом и администрацией.

### 2.3 СНГ — кратко
1С:Бухгалтерия (+ 1С:Фреш/1С:БухОбслуживание), Контур.Экстерн/Эльба/Диадок, СБИС (Тензор), «Моё дело», Яндекс/Google почта, Битрикс24 в качестве CRM/портала; сдача отчётности через операторов ЭДО. Крупные аутсорсеры (1C-WiseAdvice, Моё дело) — собственные платформы. Источник по долям — не найден.

---

## 3. Регуляторные ограничения на данные

- **GDPR / LOPDGDD 3/2018:** despacho — «encargado del tratamiento» по данным клиентов-компаний и «responsable» по данным их сотрудников при расчёте зарплат; нужен договор поручения обработки (art. 28 GDPR), реестр операций, оценка рисков; трансграничная передача вне ЕЭЗ — только с гарантиями. Практический вывод для продукта: хостинг и обработка LLM-запросов в ЕС, DPA, отсутствие обучения на данных клиента, журналирование доступа. (Нормативная база — общеизвестна; конкретных новых актов AEPD по ИИ в despachos в этом сборе не искал.)
- **Secreto profesional:** обязательство конфиденциальности у экономистов/адвокатов/gestores по деонтологическим кодексам коллегий; на практике — требование разграничения доступа по клиентам внутри despacho (роль/сотрудник видит только «свои» портфели).
- **Ley 10/2010 (PBC/FT):** «auditores de cuentas, contables externos o asesores fiscales» — прямо названы sujetos obligados (BOE, https://www.boe.es/buscar/act.php?id=BOE-A-2010-6737 ; ACCID, «El contable externo y el asesor fiscal ante la prevención del blanqueo», https://accid.org/wp-content/uploads/2018/10/EL_CONTABLE_EXTERNO_Y_EL_ASESOR_FISCAL_ANTE_LA_PREVENCION_DEL_BLANQUEO_DE_CAPITALES-1.pdf `[>24 мес]`). Обязанности: идентификация клиента и titular real, собственная оценка рисков, внутренний manual и órgano de control, обучение персонала с документированием, сообщение в SEPBLAC при подозрениях (с запретом уведомлять клиента), **хранение документации диллидженса 10 лет** (Grupo Albatros, https://grupoalbatros.org/2026/02/27/prevencion-blanqueo-asesoria-fiscal-obligaciones-sanciones/ , 27 февраля 2026; RD 304/2014 — регламент). Для продукта: KYC-досье и «alertas» — хороший кандидат на ИИ-поиск, но с жёстким аудит-трейлом.
- **Ответственность за налоговые ошибки:** гражданская ответственность despacho при вине/небрежности; штраф AEAT из-за ошибки asesor’а платит asesor, недоимку — клиент (Ayuda T Pymes, https://ayudatpymes.com/gestron/asesoria-comete-error-sancionan/ ). Прецеденты: SAP Valencia (secc. 6) 24.04.2018 — ошибка в классификации деятельности клиента, взысканы все расходы перед AEAT (AECE, https://www.aece.es/noticias/sentencias-y-resoluciones-responsabilidad-del-asesor-fiscal-por-error-profesional_1422 `[>24 мес]`); SAP 353/2025 от 19.03.2025 — «систематические ошибки в декларациях, длящаяся вина» (упоминание в блоге CopilotGestoría, https://copilotgestoria.com/blog/responsabilidad-civil-asesor-fiscal-2026-seguro-rc-sentencias-proteger-despacho-guia-gestorias , 2026 — блог, наводка). Также типичная претензия — пропуск срока обжалования (CEF, «Responsabilidad civil del asesor fiscal», https://revistas.cef.udima.es/index.php/ceflegal/article/download/9803/9527/17767 ). Следствие: любые ИИ-ответы клиенту должны проходить через человека (human-in-the-loop) и логироваться.
- **Хранение:** Código de Comercio art. 30 — 6 лет с последней записи; налоговая давность — 4 года (но хранить 6); PBC — 10 лет (AEAT, https://sede.agenciatributaria.gob.es/Sede/impuesto-sobre-sociedades/gestion-impuesto-sobre-sociedades/obligaciones-contables-registrales/conservacion-libros.html ; Consejo General de Economistas blog, https://blog.economistas.es/documentacionempresa/ ).
- **Размещение данных:** формального требования «только в Испании» нет; GDPR + PBC + secreto profesional на практике означают ЕС-резидентность и запрет на обучение моделей на данных. Крупные вендоры позиционируют это как преимущество (DATEV: «обработка только внутри DATEV-Cloud»).
- **Verifactu / e-фактура** — см. §2: добавляют требования к целостности/неизменяемости записей, что косвенно ограничивает «запись» ИИ в учётные системы (продукт первой версии — read-only + черновики).

---

## 4. Признаки боли из открытых источников

### 4.1 Опросы отрасли (заявлено; опросы вендора Wolters Kluwer)
Barómetro de la Asesoría 2026 (V edición, WK, 30 июня–1 июля 2026; пересказы: MuyPymes, ChannelPartner, Innovación Despachos — ссылки в §1):
- **95 %** подтверждают, что нормативные изменения увеличивают их нагрузку; **85 %** называют избыточную бюрократию главной причиной непривлекательности профессии; **64 %** — регуляторное давление как причина сжатия маржи, 63,8 % — рост зарплат.
- **67 %** увеличили выручку в 2025, но лишь **51,7 %** улучшили маржу («сектор factura más y gana menos»).
- Таланты: **57 %** испытывают трудности с наймом; нехватка квалифицированных профилей выросла с **64 % до 74 %** за год; 57 % считают профессию непривлекательной; только **2,1 %** команд — сотрудники до 30 лет; **24,3 %** руководителей старше 60 (+4,6 п.п./год); лишь 25 % готовы к преемственности; 46,5 % имеют программы удержания.
- ИИ: **71 %** уже используют ИИ ежедневно (42 % годом ранее; 100 % среди крупных despachos); применение — 64,8 % отчёты, 53,8 % организация данных, 15 % — стратегические задачи; 63 % беспокоятся о качестве данных, 53 % — нет внутреннего обучения.
- Клиенты: 96,9 % новых клиентов — по рекомендациям; только 43,2 % измеряют удовлетворённость.
Barómetro 2025 (1 июля 2025): **80,2 %** — «отношения с Администрацией отмечены постоянным ростом нагрузки из-за нормативных изменений»; 63,8 % увеличили выручку. Barómetro 2023: 60,7 % — нехватка квалифицированных профессионалов `[>24 мес]`.

### 4.2 Уведомления и требования администраций
- «Asesor тратит в среднем 6 часов в неделю только на проверку наличия новых уведомлений»; последствия непроверенного ящика — «санкция до 600 000 €» (Emprendedores по данным Findiur, https://emprendedores.es/noticias-de-empresa/findiur-automatiza-con-ia-la-gestion-de-notificaciones-electronicas-para-gestorias-y-asesorias/ , 22 апреля 2026) — **заявлено вендором, без независимой верификации**; на собственном сайте Findiur цифра — «4 часа в неделю / ~35 часов в месяц» (https://findiur.com/ , 2026). Findiur мониторит 13–14 тыс. sedes electrónicas и обслуживает «более 60 000 компаний и автономос через despachos».
- Наличие ≥3 испанских ИИ-стартапов, чей первый продукт — именно разбор уведомлений AEAT/TGSS (Findiur, AI Consultas «Módulo Notificaciones AEAT» от 24,90 €/мес, CopilotGestoría «Radar Fiscal») — косвенный, но сильный сигнал, что боль реальна и платится.

### 4.3 Медиа / ассоциации
- Expansión (16.04.2025): «El despunte de la IA y el análisis de datos obliga a adaptar competencias profesionales»; президент REA (CGE) Emilio Álvarez — рост требований по ESG/CSRD, «неопределённость» (PDF ранкинга, ссылка в §1).
- AEDAF: программа осени 2026 включает «Apunte sobre Inteligencia Artificial» (16.09.2026, Barcelona) и вебинар «Todas las claves AI Consultas» (22.09.2026) — ассоциация сама продвигает ИИ-инструменты членам (AEDAF, https://www.aedaf.es/es/actividades/proximas-actividades ).
- AECEM «Proyecciones 2026 para el sector de asesoría» (https://aecem.es/noticias/proyecciones-2026-sector-asesoria/ , 22 января 2026): регуляторная сложность (Verifactu, НДС автономос, транспозиция директив), три поколения в одной фирме, спрос клиентов на «стратегию вместо compliance», ИИ при сохранении «certeza jurídica».
- Прямых заголовков «colapso de las asesorías» / «los asesores denuncian…» за 2025–2026 в этом сборе найти не удалось (поисковый бюджет исчерпан; см. «Что не нашёл»).

### 4.4 Найм и роли
- Типовые вакансии despachos: administrativo/a contable, técnico/a contable, técnico/a laboral (nóminas, Sistema RED, SILTRA), asesor/a fiscal junior/senior, gestor/a de cuentas / responsable de cartera. Пример: Michael Page — «Técnico laboral – Nóminas», Barcelona, senior 40 000–45 000 € брутто/год (jobs.accaglobal.com, https://jobs.accaglobal.com/job/14025864/tecnico-laboral-nominas-/?TrackID=9 , 2026; текст вакансии полностью не открылся — 403).
- Число открытых вакансий по ролям в InfoJobs/Indeed — не собрано (блокировка/лимит).
- Текучесть кадров в despachos — количественных данных не найдено; косвенно: 46,5 % имеют стратегию удержания, 2,1 % сотрудников до 30 лет (Barómetro 2026).

### 4.5 Время на поиск информации / ответы клиентам
Специализированных исследований «сколько времени despacho тратит на ответы клиентам / поиск в архивах» не найдено. Прокси: 84 % говорят, что технологии снимают монотонные задачи; ИИ применяется для «организации данных» у 53,8 % (Barómetro 2026); 6 (или 4) ч/нед на уведомления (Findiur, заявлено).

---

## 5. Нишевые ИИ-конкуренты (кратко)

### Испания
| Компания / продукт | Что делает | Целевой клиент | Стадия / раунд | Источник |
|---|---|---|---|---|
| Wolters Kluwer — a3innuva Nómina Expert AI | ИИ-агент внутри облачной зарплаты: ответы по контрактам, взносам, отпускам, больничным, конвениям на базе «verified content» WK | despachos и HR-отделы, пользователи a3innuva | Запуск июнь 2026 (корпорация) | BusinessWire 11.06.2026 https://www.businesswire.com/news/home/20260611875977/es ; WK https://www.wolterskluwer.com/es-es/news/lanzamiento-a3innuva-nomina-expert-ai |
| Sage — Sage Copilot | ИИ-ассистент в Sage Active (Испания/Франция/Германия): автоматизация задач, аналитика | малый бизнес; для despachos — через Sage for Accountants | Запуск в Европе окт. 2024 (корпорация) | Sage press https://www.sage.com/es-es/sala-de-prensa/notas-de-prensa/2024/10/sage-lanza-primer-asistente-contabilidad-basado-en-ia-de-europa/ |
| Findiur | ИИ-мониторинг, классификация и резюмирование электронных уведомлений 13–14 тыс. администраций, черновики писем клиентам, управление сертификатами | gestorías/asesorías, юрфирмы | Раунд не раскрыт; «60 000+ компаний через despachos» (заявлено) | Emprendedores 22.04.2026; https://findiur.com/ |
| AI Consultas | Модули IA Fiscal / IA Laboral / генератор документов / «Notificaciones AEAT» (requerimientos, propuestas de liquidación, recursos с цитированием норм) | asesorías, despachos, налоговые отделы | Бутстрап/SMB SaaS, от 24,90 €/мес за 10 дел/мес | https://aiconsultas.com/modulo-notificaciones-aeat/ (2026) |
| CopilotGestoría | OCR счетов → проводки за 8 с, 15 моделей AEAT, «Radar Fiscal» (риски до подачи), экспорт в Sage Despachos/A3/Contasol/Cegid | малые gestorías | Бутстрап; «100+ despachos» (заявлено), от 15 €/мес | https://copilotgestoria.com/ (2026) |
| TaxDown | B2C ИИ-подача IRPF; >10 млн € выручки 2025, 4 млн пользователей ES+MX | физлица (не despachos) | 4 млн € структурированного долга (BBVA Spark), 2025 | https://ecosistemastartup.com/taxdown-capta-e4m-para-escalar-su-ia-fiscal/ ; BBVA |
| Declarando | Онлайн-asesoría для автономос с ИИ | автономос (конкурент despachos, не поставщик) | Раунд 2,2 млн € (JME Ventures и др.; дата не подтверждена) | https://www.webcapitalriesgo.com/declarando-cierra-una-ronda-de-e22m-liderada-por-jme-ventures-acuden-encomenda-fundacion-bankinter-y-sabadellvc/ |
| Holded (Visma) | Облачный ERP для МСП + модуль для asesorías | МСП / despachos | Куплен Visma за ~120 млн € (2021) `[>24 мес]` | https://elreferente.es/actualidad/visma-se-hace-con-startup-barcelonesa-holded-120m/ |
| TeamSystem (TS Contasol) | Учётное ПО DELSOL, ИИ-функции в разработке | despachos и МСП | Корпорация (Италия) | https://teamsystem.es/magazine/verifactu-se-retrasa-2027/ |

Не проверены / не найдены в этом сборе: Dost, Quipu (испанский, не колумбийский), Ayuda T Pymes, Xolo, Legalitas, Lefebvre GenIA-L, Tirant IA, Cegid Pulse.

### ЕС / международные
| Компания | Что делает | Целевой клиент | Стадия / раунд | Источник |
|---|---|---|---|---|
| Pennylane (FR) | Платформа «cabinet + клиент» с ИИ; ARR 115 млн € (2025), 800 000 клиентов, 6 000+ cabinets | experts-comptables и их клиенты | Série E 175 млн € (TCV, Blackstone), оценка 3,5 млрд €, 20.01.2026; выход в 3-ю страну в H2 2026 | Maddyness https://www.maddyness.com/2026/01/20/pennylane-nouvelle-levee-de-fonds-de-175-millions-deuros-pour-la-licorne-francaise/ |
| DATEV Copilot (DE) | ИИ-ассистент внутри DATEV-Cloud: тексты/резюме, анализ документов, задачи в MyDATEV, единый поиск; прототип DATEV GPT тестировали 35 000 пользователей | Steuerkanzleien | Кооператив; в «KI-Werkstatt», дата релиза не указана; доля выручки ИИ утроилась в 2025 | https://www.datev.de/web/de/berufsgruppenuebergreifend/nachrichten/produkte-services/ki-im-kanzleialltag-datev-copilot ; Handwerksblatt |
| Silverfin (BE, Visma) | Облачная платформа отчётности/closing + AI assistant | средние и крупные accounting firms | Куплен Visma за ~300 млн € (2023) `[>24 мес]` | https://www.accountingweb.co.uk/tech/accounting-software/visma-snaps-up-silverfin-in-eu300m-deal |
| Karbon (AU/US) | Practice management + «Practice Intelligence», agentic-workflows, ИИ-ценообразование; купил Aider (AI advisory) 30.09.2025 | фирмы 10–500 чел., 40 стран | ~100 млн $ суммарно (Series B до 66 млн $, Tidemark; Five Elms) | https://karbonhq.com/resources/karbon-launches-tax-workflow-and-practice-intelligence/ (04.06.2025); https://www.aider.ai/news/karbon-acquires-aider |
| Candis (DE) | AP-автоматизация с ИИ для Mittelstand и Kanzleien | МСП/канцелярии | 16 млн $ (Viola FinTech, 2022 `[>24 мес]`); упоминание Series C 40 млн $ (Schroders) — не подтверждено первоисточником | https://www.fintechfutures.com/accounting-payroll/berlin-based-automated-accounting-platform-candis-raises-16m |
| Dext (UK) | Захват и обработка первички, интеграция в IRIS Elements | bookkeepers/accountants | Куплен IRIS Software Group, сделка закрыта 23.12.2024 | https://www.iris.co.uk/news/iris-completes-dext-acquisition/ |
| Xero JAX, Intuit Assist | ИИ-ассистенты внутри SMB-учёта (EN-рынки) | МСП/их бухгалтеры | Корпорации | не проверялось в этом сборе |

Вывод: **прямого аналога Glean для despachos (единый поиск + ответы по a3/Sage + почта + документы + госпорталы) на испанском рынке не найдено.** Конкуренция идёт по двум флангам: (а) вендоры ядра (WK, Sage, DATEV, Pennylane) встраивают «expert AI» внутрь своего ПО — закрытые, по одному источнику данных; (б) стартапы закрывают одну боль (уведомления, OCR, налоговые Q&A). Пустая ниша — кросс-системный слой «данные клиента + переписка + история решений».

---

## 6. Лучший процесс для первой версии продукта

Кандидаты и оценка (частота × стоимость × доступность данных × риск ошибки):

| Процесс | Частота | Стоимость для despacho | Доступность данных | Риск ошибки | Итог |
|---|---|---|---|---|---|
| A. Ответы клиентам по их налогам/учёту из a3/Sage + переписки | ежедневно, десятки/чел. | высокая (время senior’ов) | средняя: a3/Sage — закрытые БД/экспорт; почта — Graph API | высокий (совет = ответственность) | 2-я очередь |
| B. Разбор и маршрутизация уведомлений AEAT/TGSS + черновик ответа | ежедневно, все клиенты | высокая (4–6 ч/нед на 1 asesor — заявлено; штрафы/сроки 10 дней) | высокая: DEHú/PDF + данные клиента | средний (черновик под контролем) | **уже занято** Findiur/AI Consultas — не дифференцирует |
| C. Сбор недостающих документов у клиентов | ежемесячно/квартально (303/111) | средняя | высокая (почта, WhatsApp, портал) | низкий | хороший модуль, но «коммодити» (порталы WK/Sage) |
| **D. Внутренний поиск «как мы решали похожий случай» + ответ по клиенту** (почта, документы, консультации, история уведомлений, CRM, нормативка) | ежедневно, каждый сотрудник | высокая: 74 % не находят квалифицированных людей, 24 % партнёров >60 лет — знания уходят; junior’ы тратят время на «спросить у senior’а» | **высокая: Microsoft 365/Google, SharePoint/сетевые папки, PDF — стандартные коннекторы; не требует записи в a3/Sage** | низкий-средний (внутреннее использование, ответ с цитатами и источником) | **первая версия** |
| E. Онбординг нового клиента (KYC по Ley 10/2010, сбор данных, настройка в a3/Sage) | 2–10 раз/мес | средняя | средняя | средний (PBC) | 3-я очередь |

**Рекомендация: D — «корпоративная память despacho» (Glean-подобный поиск/ответы по внутренним источникам: почта, документы, консультации, история уведомлений и решений, нормативные подписки), с первым же расширением в сторону A (ответ клиенту с подтягиванием его данных из a3/Sage через экспорт/API).** Аргументы:
1. **Частота и покрытие:** используется каждым сотрудником каждый день, а не только «налоговиком в кампанию»; Barómetro 2026: 53,8 % уже применяют ИИ для «организации данных», 64,8 % — для отчётов, т.е. паттерн понятен покупателю.
2. **Стоимость:** боль — не «нет данных», а «данные в 5 системах и в головах senior’ов»; при 74 % дефиците квалифицированных кадров и старении партнёров это прямая замена времени senior’ов (30–45 тыс. €/год) и ускорение junior’ов.
3. **Доступность данных:** M365/Google/файлы — открытые API; не нужно ждать доступа к закрытым a3/Sage (WK/Sage сами закрывают этот слой своими «Expert AI»). Госпорталы и уведомления — уже делают другие; их можно подключать как источники, а не конкурировать.
4. **Риск ошибки и регуляторика:** внутренний ассистент с цитатами и без автоматической отправки клиенту — минимальная ответственность (см. §3), совместимо с secreto profesional при разграничении по клиентам; проще пройти DPA.
5. **Дифференциация:** ни один найденный игрок (WK, Sage, Findiur, AI Consultas, CopilotGestoría) не делает кросс-системный поиск по «истории фирмы»; DATEV Copilot идёт в эту сторону только внутри своей экосистемы в Германии.
Против B как первой версии: рынок уведомлений уже имеет 3+ дешёвых испанских решения (от 15–25 €/мес) — сложно оправдать «средний чек» для фирмы 30–500 чел.

---

## 7. Средний ФОТ ролей

### Испания (брутто/год)
| Роль | Ориентир | Источник |
|---|---|---|
| Técnico/a contable | 24 746 € (среднее по отчётам Indeed); диапазон 21 000–27 500 € | Indeed ES, https://es.indeed.com/career/t%C3%A9cnico-contable/salaries (2026; страница отдала 403 при повторном открытии — данные из поисковой выдачи) |
| Contable (общая) | 23 379 € (talent.com), 29 100 € (Glassdoor, май 2026), 26 712 € (Jooble) | https://es.talent.com/salary?job=contable ; https://www.glassdoor.es/Sueldos/contable-sueldo-SRCH_KO0,8.htm ; https://es.jooble.org/salary/tecnico-contable |
| Asesor/a contable | 21 499–45 349 € | Deusto Formación (блог), https://www.deustoformacion.com/cursos/contabilidad-finanzas/curso-contabilidad-financiera/sueldo — наводка |
| Asesor/a fiscal | 32 500 € (Glassdoor ES), Madrid 33 000 €; junior <3 лет ≈1 650 €/мес, 4–9 лет ≈1 910 €/мес, senior 10–20 лет ≈2 880 €/мес (Jobted, ×12–14); talent.com даёт 20 000 € (17 196–23 500) — явно смещено к junior/автономос | https://www.glassdoor.es/Sueldos/asesor-fiscal-sueldo-SRCH_KO0,13.htm ; https://www.jobted.es/salario/asesor-fiscal ; https://es.talent.com/salary?job=asesor+fiscal (2026) |
| Técnico/a laboral (nóminas) senior | 40 000–45 000 € (Barcelona, вакансия Michael Page) | jobs.accaglobal.com (2026) |
| Administrativo/a contable | ≈ уровень конвенио Grupo 5–6: 19 100–23 200 € | Convenio Oficinas y Despachos Cataluña 2026 (ниже) |

Convenio colectivo de Oficinas y Despachos de Cataluña 2025–2027 (подписан 14.04.2026, DOGC 14.05.2026; рост 3 % 2025 / 4 % 2026 / 4 % 2027; таблицы 2026, €/год): Grupo 1 (titulado superior) 31 989; Grupo 2 (titulado medio) 26 923; Grupo 3.1 (jefe) 26 054; 3.2 25 041; Grupo 4.1 23 738; Grupo 5.1 (administrativo con informática) 23 159; 5.2 22 870; 5.3 21 883; Grupo 6.1 21 278; 6.2 19 107; 6.3 17 653; Grupo 7 17 370 (Foment del Treball, https://www.foment.com/es/foment-firma-el-convenio-colectivo-de-oficinas-y-despachos-de-cataluna-2025-2027/ ; таблицы — calculadora-despido.com, https://calculadora-despido.com/convenios/oficinas-despachos-cataluna , 2026). Таблицы Madrid — не получены.

Рабочий ориентир полной стоимости (зарплата + ~30 % соцвзносов работодателя): técnico contable ≈ 32–36 тыс. €, técnico laboral ≈ 35–55 тыс. €, asesor fiscal senior ≈ 45–60 тыс. € — расчёт мой, `[НЕТ ИСТОЧНИКА — не для питча]` в части надбавки.

### ЕС — Германия (Steuerfachangestellte, брутто/год)
Средние по разным агрегаторам: 37 344 € (вход 30 360, макс 46 236) — brutto-netto-gehaltsrechner.de; ≈39 500 € — kanzleihafen.de; 51 987 € (диапазон 44 362–60 717) — jobvector.de (2026; все — агрегаторы вакансий, разброс из-за методик). Источники: https://www.brutto-netto-gehaltsrechner.de/berufe/steuerfachangestellte ; https://kanzleihafen.de/steuerfachangestellte-gehalt/ ; https://www.jobvector.de/gehalt/steuerfachangestellte/ .

### СНГ
Данные по зарплатам бухгалтеров аутсорсинга в РФ/КЗ в этом сборе не получены — «не найдено».

---

## 8. Доступность ЛПР для интервью извне

**Ассоциации (каналы):** AEDAF (Asociación Española de Asesores Fiscales; активные делегации, еженедельные «Martes Fiscales» в Barcelona), REAF-CGE (>6 500 членов `[>24 мес]`), Colegio de Economistas de Catalunya, Col·legis de Gestors Administratius (Catalunya, Madrid), AECE (expertos contables y tributarios), AECEM (ассоциация asesorías), ACCID. Плюс вендорные сообщества: Wolters Kluwer (Foro Asesores, a3 partners), Sage partners, Accountex.

**События сентябрь–декабрь 2026 (только реально найденные, с датами):**
| Дата | Событие | Место | Источник |
|---|---|---|---|
| 8, 15, 22 сен; 10, 17, 24 ноя; 1, 15 дек 2026 | AEDAF «Martes Fiscales» (18:00–20:00) | Barcelona | https://www.aedaf.es/es/actividades/proximas-actividades |
| 16 сен 2026 | AEDAF «Apunte sobre Inteligencia Artificial» | Barcelona | там же |
| 17–18 сен 2026 | Curso de Verano AEDAF 2026 (налогообложение недвижимости; «>130 зарегистрированных») | Santander | https://www.aedaf.es/es |
| 22 сен 2026 | AEDAF вебинар «Todas las claves AI Consultas» | online | aedaf.es |
| 5–6 ноя 2026 | **Jornadas Anuales del REAF 2026** (REAF / Consejo General de Economistas / Colegio de Economistas de Asturias) | Oviedo, Auditorio Príncipe Felipe | https://jornadastributarias.es/ |
| 12 ноя 2026 | AEDAF «Jornadas Tributarias del Atlántico», 5ª ed. | A Coruña, NH Collection Finisterre | aedaf.es (стр. 3 списка) |
| 18 ноя 2026 | AEDAF «Jornada Magistrados 2026» | Barcelona, Auditori UPF-BSM | aedaf.es |
| **18–19 ноя 2026** | **Accountex España 2026** (+ HR Expo, Legal Tech Expo; «100+ вендоров»; только для профессионалов) | IFEMA Madrid | https://www.ifema.es/accountex-espana ; ProDespachos 27.01.2026 https://www.prodespachos.com/noticias/madrid-se-prepara-para-accountex-espana-2026-la-gran-feria-de-contabilidad-y-gestion-empresarial/ |
| 16 дек 2026 | AEDAF «Jornada de Estudio Cierre Fiscal 2026» | Barcelona | aedaf.es |
| осень 2026 (дата не найдена) | Foro Asesores Wolters Kluwer 2026 — страницы Barcelona-2026 и Madrid-2026 существуют (https://www.wolterskluwer.com/es-es/solutions/a3/foroasesores/barcelona-2026 , …/madrid-2026 — 403 при открытии); в 2025 прошёл 7 октября (Barcelona + Madrid) | Barcelona, Madrid | IT User, https://www.ituser.es/eventos/2025/10/wolters-kluwer-marca-el-rumbo-del-despacho-profesional-ante-los-desafios-del-futuro |
| не найдено | Congreso Nacional AEDAF 2026 (XXXVII): в 2024 — San Sebastián 26–28 окт, в 2025 — Oviedo 6–8 ноя; на 2026 в списке 40 мероприятий AEDAF на сайте не значится | — | aedaf.es |

**Оценка доступности:** высокая для Cataluña/Madrid — плотный календарь AEDAF (2–4 события в месяц в Barcelona), Accountex как единая точка контакта с 100+ вендорами и посетителями-despachos, REAF Jornadas в ноябре. ЛПР (socio director, director de operaciones, responsable fiscal/laboral) публичны в LinkedIn и ранкингах; сети (ETL, Adade, Auren) имеют пресс-службы. Барьер — сезон: октябрь (модели 3-го квартала, до 20 октября) и январь (годовые модели) — худшее время для интервью; лучшие окна — вторая половина ноября и первая половина декабря.

---

## Что не нашёл
1. INE DIRCE: строки 200–499 и 500–999 наёмных для CNAE 692 (API вернул только остальные страты; 27 юрлиц — вычислено по разнице).
2. Официальная доля рынка a3 / Sage / Contasol именно среди despachos (только блоги).
3. Число членов AEDAF и колегиадос Gestores Administrativos (2025–2026).
4. Даты Foro Asesores Wolters Kluwer 2026 и Congreso Nacional AEDAF 2026; цифры посещаемости Accountex 2025.
5. Таблицы Convenio de Oficinas y Despachos de Madrid 2025/2026.
6. Количество открытых вакансий по ролям (InfoJobs/Indeed) и данные по текучести кадров в despachos.
7. Независимые (не вендорные) измерения времени на уведомления / поиск информации / ответы клиентам.
8. Медиа-заголовки «colapso de las asesorías» 2025–2026 (Cinco Días/Expansión) — не удалось проверить из-за исчерпания поискового бюджета и CAPTCHA у поисковиков.
9. Испанские стартапы Dost, Quipu (ES), Ayuda T Pymes, Xolo, Lefebvre GenIA-L, Cegid Pulse — не проверены.
10. Объём рынка аутсорсинга бухгалтерии РФ за 2025 (платный отчёт РБК), зарплаты в СНГ, Беларусь.
11. Число канцелярий-членов DATEV (использована оценка без источника).

## Что сомнительно
1. Разрыв INE (239 юрлиц 20–49 наёмных) vs Eurostat (528 предприятий 20–49 занятых) — разные единицы (наёмные vs занятые, вкл. партнёров) и методология SBS; для питча брать INE как консервативную оценку, Eurostat — для ЕС-сравнения.
2. «6 часов в неделю на уведомления» и «санкция до 600 000 €» — цифры Findiur (продавец решения), на своём сайте они же говорят «4 часа»; использовать только как «заявлено вендором».
3. Все проценты Barómetro de la Asesoría — опрос Wolters Kluwer среди своих клиентов, выборка не раскрыта; тренды (42 % → 71 % ИИ за год) выглядят завышенными.
4. Оценка российского рынка «>500 млрд ₽» (TAdviser) противоречит RAEX (18,7 млрд ₽ по участникам рейтинга) — разный периметр; не использовать без уточнения.
5. Зарплатные агрегаторы (talent.com 20 000 € для asesor fiscal vs Glassdoor 32 500 €) расходятся в 1,6 раза — брать конвенио + Glassdoor/Indeed как коридор.
6. Candis «Series C 40 млн $» — единственное упоминание, первоисточник не найден.
7. Дата и статус раунда Declarando 2,2 млн € — не подтверждены (вероятно, старый раунд).
8. Мои интерполяции числа фирм 30–500 (Испания 150–250 / 350–450; ЕС 5 000–6 000) — расчётные, не измеренные.

## Оценка ниши (1–5)
| Критерий | Оценка | Обоснование (одна строка) |
|---|---|---|
| Плотность информационной боли | **4** | 95 % — рост нагрузки от нормативки, 85 % — бюрократия, 74 % — дефицит кадров, старение партнёров (24 % >60) → знания и ответы «в головах» и в 5 системах; но боль сильнее всего у мелких, у 30–500 — частично закрыта процессами. |
| Размер сегмента (Испания / ЕС) | **2 / 4** | Испания: лишь ~150–250 юрлиц 30–500 наёмных (INE) — узко для старта, хотя внутри сетей больше «точек решения»; ЕС: ~5–6 тыс. предприятий, Германия+Франция ≈ 3,5 тыс. |
| Регуляторная проходимость | **3** | GDPR + secreto profesional + Ley 10/2010 (10 лет хранения, SEPBLAC) + гражданская ответственность за ошибки — проходимо для read-only внутреннего ассистента в ЕС-облаке, но каждый despacho потребует DPA и разграничение по клиентам; запись в учёт (Verifactu) — нет. |
| Отсутствие сильного нишевого конкурента | **3** | Прямого Glean-для-despachos нет; но WK/Sage встраивают «Expert AI» в ядро, DATEV/Pennylane — в ЕС, а дешёвые ES-стартапы уже заняли уведомления и OCR; окно — кросс-системная «память фирмы», 12–24 мес. |
| Доступность ЛПР для интервью | **4** | Плотный календарь AEDAF (Barcelona), REAF Jornadas 5–6 ноя (Oviedo), Accountex 18–19 ноя (Madrid, 100+ вендоров), публичные ЛПР сетей; минус — сезонность (октябрь/январь недоступны). |
