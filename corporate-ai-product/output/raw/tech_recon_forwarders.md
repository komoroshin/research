# Техническая разведка (Блок 5): ИИ-ассистент «статус + документы + черновик котировки» для транзитариев Испании (CNAE 52.29, 30–500 сотрудников)

Дата сбора: 2026-09-06. Продукт v1 — операционный ассистент поверх систем транзитария (TMS/ERP, таможенный модуль, PCS порта, трекинг линий, почта): отвечает сотрудникам и через черновик — клиентам «где мой груз / где документ / что с таможенным выпуском», готовит черновики ответов и черновик ответа на запрос котировки по истории отгрузок и тарифным таблицам. **Ничего не подаём в AEAT.**

Условные обозначения: `[>24 мес]` — источник старше сентября 2024; **допущение** — расчётное предположение аналитика; `[НЕТ ИСТОЧНИКА — не для питча]` — число без открытого источника; `[в выдаче]` — видел в сниппете поисковой выдачи, страницу не открыл. Курс: **€1 = $1,1622** (ECB reference rate, 2026-09-04, https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml ). Все $-эквиваленты пересчитаны по этому курсу.

Инструменты: WebSearch недоступен; поиск через Yahoo/Brave/Bing (Bing отдавал нерелевантную выдачу, Brave и DDG быстро блокировали — 429/CAPTCHA), прямые открытия официальных страниц и API (HuggingFace API, PyPI, Scaleway API, OVHcloud/ECB), Skill `claude-api` для цен/моделей Anthropic. Ссылки на системный ландшафт и регуляторику — на `raw/niche_freight_forwarders.md` (раздел 2) и `raw/regulatory_eu_ai_act_gdpr.md` (разделы 2.1 EU-residency, 4.2 UCC/AEO, 5.3 юрпакет) — не дублирую.

---

## 1. API и доступ к системам транзитария

### 1.1. TMS / ERP транзитария

| Система | Публичный API? | Авторизация / протокол | Документация | Ограничения, стоимость, что закрыто | Вывод для MVP |
|---|---|---|---|---|---|
| **CargoWise (WiseTech Global)** | Да, но **не REST**: **eAdaptor** — message-based шлюз, обмен XML-документами (Universal XML: UniversalShipment, UniversalEvent, UniversalDocument; и Native XML) по SOAP/HTTP; **eAdaptor Next** — тот же шлюз с OAuth2/JWT/сертификатами (Chain.io, «CargoWise API Documentation», https://chain.io/cargowise-api-documentation/ , открыто 2026-09-06). Плюс **eHub** (готовые коннекторы к линиям/NVOCC) и **E2E Messaging** (CargoWise↔CargoWise) (CargoMode, https://www.cargomo.de/articles/cargowise-ehub-vs-e2e-vs-eadapter/ , 2026) | Legacy eAdaptor — basic auth; eAdaptor Next — OAuth2, JWT, сертификаты (Chain.io) | **Спецификации eAdaptor/Universal XML «maintained by WiseTech for CargoWise customers and partners»** — публично недоступны; Developer Guide «only after purchase» (Chain.io; CargoMode). Неофициальные SDK: `SteeleConsulting/cargowise-eadapter` (GitHub/npm) [в выдаче Brave] | «A system connected directly to eAdaptor is, by design, **fully trusted — it can reach all of your CargoWise data**», без скоупов (Chain.io). «One endpoint per instance» — второй потребитель = свой relay (CargoMode). **С декабря 2025 — потранзакционная тарификация Value Pack**; пример из практики: **~$340/мес** WiseTech-fee при ~1 000 отгрузок/мес исходящего XML (~17 000 сообщений) + middleware от ~$100/мес; плюс системная automation fee DOM-CWAF (CargoMode, 2026). Партнёрская программа WiseTech — Service/Business/Education/Industry Partners с уровнями Platinum/Gold/Certified, компетенция «Integration» есть, но страница не раскрывает условий для ISV (https://www.cargowise.com/partners/ , открыто 2026-09-06) | Интеграция реалистична **только на стороне клиента** (клиент включает eAdaptor-исходящие UniversalEvent/UniversalShipment на наш endpoint); нужна аккредитация партнёра или сторонний коннектор (Chain.io/Complect и т.п.). Для испанского среднего сегмента CargoWise — меньшинство (см. niche-файл, раздел 2) |
| **Riege Scope** | **Да, REST, read-only**: Scope REST webservices — Order API (заказы/отгрузки: общие данные, air/ocean, customs, финансы, CO₂), Partner API, Salesperson API, Charge Type API — read-only; Quotation API — create/manage; Tax Authority API; Accounts Payable API (Riege, https://riege.github.io/scope-rest-webservices/ и https://service.riege.com/en/knowledge/api-interfaces-in-scope , открыто 2026-09-06) | Эндпоинты `https://{server}/scope/rest/v{version}/{resource}`; механизм аутентификации на публичной странице не описан | Публична (GitHub Pages, лицензия UPL), «not part of any contractual agreements» | Только чтение (для нас — плюс). Стоимость модуля/условия для сторонних вендоров не раскрыты. Интеграции: 50+ партнёров (INTTRA, CHAMP, Descartes, DAKOSY, Portbase, ATLAS, CBP…), методы — SFTP, REST, файлы XML/Excel (https://www.riege.com/solutions/integrations-partner ) | **Лучший TMS-кандидат для read-only коннектора** (Order API + Quotation API для черновика котировки). Но доля Scope в Испании не подтверждена |
| **Magaya** | «XML Web Service» для интеграции (Visual Basic, C#, Java, C++); «Magaya Open API»; Getting Started — подключение к Magaya Communication Suite, on-prem и cloud (Magaya help/brochure — **[в выдаче Yahoo]**, страницы help.magaya.com и magaya.com отдали 503/логин, dev.magaya.com — закрытая wiki «Hyperion») | не проверено | закрыта (wiki требует логина) | В Испании не подтверждён (niche-файл) | Не приоритет |
| **VisualTrans** (ES) | Заявляет **«API nativa»**: «Visual Trans ofrece la máxima conectividad con su software ERP transitario gracias a su API nativa»; облако, ISO 27001; интеграции с AEAT (DUA, ENS/EXS, AES); собственный «Asistente Virtual Aduanero» (https://visualtrans.com/ , открыто 2026-09-06) | не раскрыто | не публична | **Вендор уже продаёт ИИ-ассистента по таможне** — потенциальный конкурент/партнёр | Нужно партнёрство с вендором (доступ к API) |
| **DeiWorld** (Visual MS, ES) | Публичного API не найдено; облачный web-ERP (DEI TRANS/ADU/CONTA/CRM); **Portic, INTTRA, WebCargoNet «integradas dentro del software»**; track&trace для клиентов (https://deiworld.com/ , открыто 2026-09-06) | — | — | Закрыто; данные через экспорт/отчёты или партнёрство | Партнёрство |
| **Quatuor G4/G3** (ES) | Публичного API продукта нет; компания делает «desarrollos de APIs, SOAP y desarrollo de aplicaciones REST» на заказ; SaaS или on-prem (https://www.tmsquatuor.com/ , открыто 2026-09-06) | — | — | Интеграция = заказная разработка у вендора | Партнёрство/заказная интеграция |
| **Bytemaster B-First** (ES) | «Integraciones ERP», «Connectivity Suite» (электронные заказы/альбараны), «conexión a la Agencia Tributaria», интеграция с портами/аэропортами/котировочными платформами; стек **.NET + SQL**; SaaS; выгрузки в Power BI/Qlik (https://www.bytemaster.es/en/b-first-erp/ , открыто 2026-09-06) | — | — | Публичного API нет; **SQL-БД → возможен read-only доступ/реплика по договору с клиентом** (SaaS усложняет) | ODBC/реплика или партнёрство |
| **SC Trade Bitácora ERP** (ES) | Публичного API нет; «Enviador EDI», интеграция dbTaric/Taric (AEAT), рассылка DUA/Levante по e-mail, цифровой архив (https://www.sctrade.es/software-erp-aduanas/ , открыто 2026-09-06) | — | — | Закрыто | Экспорт/почта/партнёрство |

**Вывод по TMS:** единственный TMS с открыто задокументированным read-only REST — **Riege Scope**; CargoWise — XML-шлюз eAdaptor только для клиентов/партнёров с потранзакционной оплатой; испанские ERP (VisualTrans/DeiWorld/Quatuor/B-First/Bitácora) — **без публичных API**, интеграция через партнёрство, SQL-доступ (on-prem инсталляции на .NET/SQL) или экспорт (Excel/CSV/PDF по почте). Для MVP TMS-данные брать **через экспорт/выгрузку и «почтовый след» (DUA/Levante/арривал-нотисы, которые ERP сами рассылают по e-mail)** — это уже структурированные события.

### 1.2. Таможня: Taric, AEAT, ICS2, Ventanilla Única

- **Taric (TDua, TariffOne, TaricTrans):** публичного REST нет, но есть **задокументированные механизмы импорта/экспорта в TDua** — `duasql-public` v30.14.1: «Documentación para mecanismos de importación y exportación en TDua», 40+ форматов (H1 импорт, AES экспорт, NCTS, ENS, EXS, G3/G5, SOIVRE, счета, RUN…), таблицы статических данных (https://docs.taric.es/duasql-public/index.html , открыто 2026-09-06). TaricTrans-Aduanas: «DuaTaric.net es la integración de un conjunto de aplicaciones», модуль «Gestión EDI», «Integrable con otras aplicaciones» (PDF https://www.tarictrans.com/pdf/TaricTrans-Aduanas.pdf , открыт 2026-09-06). Продуктовая линейка и сайт — в niche-файле. «Ficha técnica» с типами API (https://descargas.taric.es/direct/pdf/pydio/data/public/782e61.php?dl=true ) — **не открылась (timeout)**. Вывод: у TDua есть **файловые/SQL-интерфейсы импорта-экспорта деклараций** — для read-only чтения статусов DUA/Levante достаточно экспорта по расписанию; полноценный API — по договорённости с Taric (партнёрство).
- **AEAT (Sede electrónica, Aduanas):** «Las declaraciones en aduanas… deben ser presentadas mediante sistemas informáticos ajustados a las especificaciones que se publican en el Portal»; обмен — **XML по SOAP web services**; требование — **Certificado de Usuario (firma electrónica) FNMT** (AEAT, «Formas de presentación», https://www3.agenciatributaria.gob.es/Sede/aduanas/entrada-salida-mercancias/declaracion-aduana/formas-presentacion.html , открыто 2026-09-06). Каталог web-сервисов с WSDL/XSD: https://www3.agenciatributaria.gob.es/static_files/common/internet/dep/aduanas/ws.html (открыто; на странице — EMCS, SILICIE, autoliquidaciones, «Lista de declaraciones», «Envío de documentos digitalizados»; DUA/ENS/AES — в отдельных guías técnicas, например https://sede.agenciatributaria.gob.es/Sede/aduanas/aduana-electronica/guias-tecnicas/presentacion-dua.html [в выдаче]). Для продукта: **подача — только сертифицированный представитель со своим сертификатом**; мы не подаём и не читаем через AEAT напрямую — статусы (Levante, circuito verde/naranja/rojo, EAL) берём из TDua/ERP-экспорта и почты.
- **ICS2:** ENS подают все EO, ввозящие/транзитирующие товары в ЕС; подключение — через **Shared Trader Portal (STP)** (регистрация в UUM&DS) или **Shared Trader Interface (STI)** system-to-system с **обязательным self-conformance testing** до go-live; материалы — в CIRCABC ICS2 library (Commission, https://taxation-customs.ec.europa.eu/customs-4/customs-security/import-control-system-2-ics2-0_en , открыто 2026-09-06). Сроки Release 3 — в niche-файле (раздел 3). Для нас: ICS2 — не источник данных для ассистента (подача идёт из TMS/таможенного ПО); максимум — читать подтверждения/MRN из почты/экспорта.
- **Ventanilla Única Aduanera (VUA):** модуль есть у Taric (niche-файл); отдельную страницу AEAT в этой сессии не открывал — `[не проверено]`.

### 1.3. PCS портов

- **PORTIC (Barcelona):** заявленные метрики — **275k вызовов web-сервисов/день, 7,2k подключённых пользователей, 150k сообщений/день** (https://www.portic.net/ , открыто 2026-09-06); пакеты «ICS Gateway», «ICS WEB», «Crystal Box», «TransPortic» (https://portic.net/servicios/pcs/ ); техподдержка обещает «soporte técnico para garantizar una integración eficiente… de tus sistemas logístico-portuarios», раздел «Documentación Técnica» — с фильтрами, содержимое не отдано без входа; клиентский портал app.portic.net (https://portic.net/soporte-tecnico/ ). Portic Forwarding (HTML5, интеграция с INTTRA/GT Nexus, видимость: приход судна, вход/выход контейнера, таможенный выпуск) — niche-файл. Условия для сторонних разработчиков и тарифы — **на сайте не опубликованы** (нужен запрос: portic@portic.net, +34 935 088 282).
- **valenciaportPCS (Valencia/Sagunto/Gandía):** три способа интеграции — **XML** («todas las transacciones a través de una única conexión»), **EDI** (EDIFACT и ANSI X.12), **плоские файлы** (+ valenciaportpcsAgent) (https://www.valenciaportpcs.com/nuestros-servicios/integracion/ , открыто 2026-09-06). Гайды для разработчиков публичны по типам сообщений: booking IFTMBF/IFTMBC, SI IFTMIN, **tracking IFTSTA**, COPARN/CODECO/COPINO, COPRAR/COARRI, VERMAS, IFTDGN, таможня IFCSUM/CUSRES; XML и EDI, ES/EN (https://www.valenciaportpcs.com/soporte/documentacion/guias-para-desarrolladores/ , открыто 2026-09-06). **Тарифы 2024 (в силе с 01.01.2024, действуют до утверждения новых):** для профиля «Transitario, Representante Aduanero u Operador Logístico» — ежемесячная плата по порогам TEU: **>18 000 TEU — 200 €/мес; >5 000 — 120 €; >2 000 — 80 €; >540 — 45 €; <540 — 1 €/TEU**; **alta нового предприятия 350 €**; **«Alta integración con terceros» 350 € + «Mantenimiento integración con terceros» 45 €/мес** — применяется, когда пользователь платформы просит обмен сообщениями с точками вне платформы «siempre que haya autorización para ello de la APV»; «Alta/Mantenimiento Integración Particular» (нестандартный формат) — те же 350 € + 45 €/мес (Autoridad Portuaria de Valencia, «Tarifas por Servicios Comerciales 2024», PDF https://www.valenciaport.com/wp-content/uploads/Tarifas-por-Servicios-Comerciales-2024-Mod.-2024-01-16.pdf , открыт 2026-09-06; страница https://www.valenciaportpcs.com/valenciaportpcs/tarifas/ ). Итого: **подключить нас как «третью сторону» клиента стоит ≈ 350 € разово + 45 €/мес (≈ $407 + $52/мес) при согласии APV** — самый дешёвый структурированный источник событий.
- **Algeciras (Teleport), Bilbao (e-puerto), Puertos del Estado** — в этой сессии не открывал; `[не проверено]`.

### 1.4. Трекинг линий и контейнеров, авиа, авто

| Провайдер | Что есть в открытом доступе (2026-09-06) | Цена | Вывод |
|---|---|---|---|
| **Terminal49** | Тарифы: **Free** («free forever», до 3 пользователей, 50 document credits, **без API**), **Lite** (годовой), **Essential** («Most Popular», годовой или pay-as-you-go, **API + webhooks**, ж/д), **Complete** (predictive ETA, SLA); enterprise — по запросу (https://www.terminal49.com/pricing , открыто 2026-09-06). 150+ источников (линии, терминалы, Class 1 rail) [в выдаче] | **Цена за контейнер не опубликована** | Кандидат №1 для трекинга (API + webhooks на PAYG), цена — по запросу |
| **Vizion** | «98% shipment tracked», «57% global market coverage», 300M событий, 7 000 сырых событий → **60 стандартных майлстоунов**, latency ≤6 ч, 99,99% uptime (https://www.vizionapi.com/ , открыто 2026-09-06); планы **Core** (98% ocean carrier coverage, webhook API, AIS, track by container/MBL) и **Professional** (terminal visibility, container trace, rail NA, OAuth) (https://docs.vizionapi.com/docs/plans ) | **Не опубликована** (demo/sales) | Кандидат №2 |
| **Portcast** | pricing-страница отдала 403 | `[не найдено]` | — |
| **project44, Shippeo, Gnosis, Searates** | не открывал (лимит); публичных прайсов у p44/Shippeo, по опыту рынка, нет — `[НЕТ ИСТОЧНИКА — не для питча]` | — | enterprise-сегмент, не для MVP |
| **Maersk developer portal** | developer.maersk.com → integration.maersk.com — **403** для нашего фетчера | `[не открыт]` | Прямые API линий — второй этап; для MVP достаточно агрегатора + PCS |
| **MSC / CMA CGM / Hapag developer APIs, INTTRA (E2open)** | не открывал | — | то же |
| **Авиа: Awery** | Awery ERP (web, авиакомпании/GSA/handling), Documents Library; 15-дневный триал; API на главной не описан (https://awery.aero/ , открыто 2026-09-06) | — | Авиа-трекинг (Cargo iQ, CHAMP, Descartes) — не проверял; `[не проверено]` |
| **Авто: GPS-провайдеры** | не проверял | — | вне MVP |

### 1.5. Почта, документы, мессенджеры

- **Microsoft Graph (Outlook):** лимит **10 000 запросов за 10 минут на пару «app ID + mailbox»** (v1.0 и beta); превышение по одному ящику не влияет на другие; JSON-batching — Graph отправляет в Outlook **до 4 запросов параллельно** (Microsoft Learn, «Microsoft Graph service-specific throttling limits», https://learn.microsoft.com/en-us/graph/throttling-limits , открыто 2026-09-06); общий лимит **130 000 запросов/10 с на приложение по всем тенантам**. Mail API поддерживает primary и shared mailboxes, не поддерживает in-place archive (https://learn.microsoft.com/en-us/graph/outlook-mail-concept-overview ). Delta query и change notifications для сообщений — стандартный путь инкрементальной индексации (общее знание Graph; страницы delta в сессии не открывал).
- **Microsoft Graph (SharePoint/OneDrive):** лимиты в **resource units**: 1 RU — единичный запрос/**delta with token**/скачивание; 2 RU — списки, create/update; 5 RU — операции с permissions. **Per app per tenant: 1 200 000 RU / 24 ч и 1 250 RU/мин при 0–1 000 лицензий** (у типового транзитария), 2 400 000 / 2 500 при 1 001–5 000; per user 3 000 запросов / 5 мин; app-only search с Sites.Read.All — 25 req/s; delegated search — 10 req/s на пользователя; для multitenant-приложений лимиты считаются per tenant (Microsoft Learn, «Avoid getting throttled or blocked in SharePoint Online», ms.date 2025-10-02, https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online , открыто 2026-09-06). Практика: ~600 запросов/мин при 2 RU — для 40 сотрудников с запасом.
- **Google Workspace (Gmail API):** **1 200 000 quota units/мин на проект, 6 000 units/мин на пользователя**; `messages.get` = 20, `messages.list` = 5, `history.list` = 2, `watch` = 100 units; порог бесплатного использования **80 000 000 units/день на проект** (с 01.05.2026) (Google, https://developers.google.com/workspace/gmail/api/reference/quota , открыто 2026-09-06). Для 40 ящиков × 1 000 писем/мес — пренебрежимо.
- **WhatsApp Business Platform (Meta Cloud API):** с 01.07.2025 — **потарифная оплата за сообщение** по категориям (marketing / utility / authentication); **все не-шаблонные сообщения бесплатны внутри 24-часового окна обслуживания** («When users message a business, this opens a 24-hour customer service window during which businesses can respond with service messages, at no charge»); utility-шаблоны внутри открытого окна бесплатны; Spain выделена как отдельный рынок с «higher marketing message rate» с 01.07.2026; volume-tiers снижают utility/auth ставки (Meta, https://developers.facebook.com/docs/whatsapp/pricing и https://whatsappbusiness.com/products/platform-pricing/ , открыто 2026-09-06; сами ставки — только в интерактивном калькуляторе/CSV). Вторичный источник в выдаче: маркетинг **≈ 0,0509 €/сообщение в Испании** (sendseven.com, сниппет Yahoo — `[в выдаче, не проверено]`). Для нашего сценария «клиент спросил статус → ответ в 24-часовом окне» стоимость сообщений **≈ 0**; платные — только инициируемые нами утилити-уведомления.
- **E-mail-парсинг:** документы-вложения (BL, invoice, packing list, DUA/Levante PDF) — см. раздел 3 (Docling/Unstructured/LlamaParse/Mistral OCR).

### 1.6. Общий вывод: какие коннекторы реалистичны для MVP

1. **Почта (Microsoft 365 / Google Workspace) + файлы (SharePoint/OneDrive/Drive/сетевые папки)** — стандартные API, документированные лимиты, есть готовые open-source коннекторы (Onyx, раздел 3). Это и есть «почтовый след» операций: арривал-нотисы, booking confirmation, DUA/Levante, инвойсы линий, переписка с клиентом. **Реалистично: да, без партнёрств.**
2. **PCS порта (valenciaportPCS — IFTSTA/COARRI/CODECO по XML; Portic — по запросу)** — структурированные события судно/контейнер/выпуск; для VPCS — 350 € + 45 €/мес как «интеграция с третьими лицами» с согласия APV. **Реалистично: да (Valencia — по прайсу, Barcelona — по переговорам с Portic).**
3. **Трекинг-агрегатор (Terminal49 Essential PAYG или Vizion Core)** — API + webhooks; цена по запросу. **Реалистично: да**, но закладывать бюджет по допущению.
4. **TMS/таможенный модуль — только экспорт** (CSV/Excel/PDF-отчёты TDua/ERP по расписанию, SQL-реплика для on-prem .NET/SQL-инсталляций) — **без партнёрства с вендором полноценного API нет** (VisualTrans «API nativa» — закрытая; Scope — исключение с публичным read-only REST; CargoWise — только через eAdaptor у клиента-партнёра с потранзакционной оплатой).

**Потребует партнёрства с вендором:** VisualTrans, DeiWorld, Quatuor, Bytemaster, SC Trade, Taric (полный API), CargoWise (партнёрский статус). Рекомендация: начать с 1–2 вендоров, у которых больше всего клиентов среди ATEIA-Barcelona (нужно выяснить на интервью), предлагать им «AI-слой» как совместное предложение.

---

## 2. Размещение моделей и стоимость инференса

### 2.1. Облачные провайдеры с EU-размещением (цены на 2026-09-06, $/1M токенов)

| Провайдер / модель | Input | Cached input | Output | EU-residency | Источник |
|---|---|---|---|---|---|
| **OpenAI gpt-5.5** | 5,00 | 0,50 | 30,00 | EU-endpoint `eu.api.openai.com`; **+10 % за regional processing для моделей после 05.03.2026** | https://developers.openai.com/api/docs/pricing (открыто 2026-09-06); residency — см. regulatory-файл 2.1 |
| OpenAI gpt-5.4 | 2,50 | 0,25 | 15,00 | то же | там же |
| OpenAI gpt-5.4-mini | 0,75 | 0,075 | 4,50 | то же | там же |
| OpenAI gpt-5.4-nano | 0,20 | 0,02 | 1,25 | то же | там же |
| OpenAI gpt-5 / gpt-5.1 | 1,25 | 0,125 | 10,00 | без надбавки (выпущены до 05.03.2026) | там же |
| OpenAI gpt-5-mini / nano | 0,25 / 0,05 | 0,025 / 0,005 | 2,00 / 0,40 | | там же |
| OpenAI text-embedding-3-small / -large | 0,02 / 0,13 | — | — | | там же |
| Batch (OpenAI) | −50 % | | | | там же |
| **Anthropic Claude Opus 5** | 5,00 | cache read 0,50 / write 6,25 | 25,00 | **Первопартийный API: `inference_geo` только `"global"` и `"us"` (US-only = ×1,1); workspace geo — только `"us"`; EU-инференса у первопартийного API нет** (Anthropic, https://platform.claude.com/docs/en/manage-claude/data-residency , открыто 2026-09-06). EU — через **AWS Bedrock** (eu-west-1, eu-north-1, частично eu-central-1 — regulatory-файл 2.1) и Vertex AI (Claude регионы «Coming 2026» для Europe на https://claude.com/regional-compliance ) | Skill `claude-api` (кэш 2026-06-24) + https://claude.com/pricing (открыто 2026-09-06) |
| Claude Sonnet 5 | 2,00 | 0,20 / 2,50 | 10,00 | то же | то же |
| Claude Haiku 4.5 | 1,00 | 0,10 / 1,25 | 5,00 | то же | то же |
| Claude Fable 5.1 | 10,00 | 0,25 / 12,50 | 50,00 | требует 30-дневного retention (Skill) | то же |
| Batch (Anthropic) | −50 % | | | | https://claude.com/pricing |
| **AWS Bedrock (Claude в ЕС)** | партнёрские цены, **не извлёк** (страница цен рендерится JS; JSON прайс-листа — хэшированные ключи) | | | EU-регионы подтверждены (regulatory-файл) | https://aws.amazon.com/bedrock/pricing/ (открыто, цены Claude не отображены) |
| **Google Gemini 2.5 Pro** | 1,25 (≤200k) / 2,50 | context caching есть | 10,00 / 15,00 | **Vertex AI: регионы europe-west1/3/4/8/9, EU multi-region `eu` (`aiplatform.eu.rep.googleapis.com`), «ML processing stays within that specific geographical region»; global endpoint — без residency** (Google, https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/locations и …/data-residency , открыто 2026-09-06). Gemini Developer API (ai.google.dev) — без EU-residency | https://ai.google.dev/gemini-api/docs/pricing (открыто 2026-09-06, «as of 2026-09-04») |
| Gemini 2.5 Flash / Flash-Lite | 0,30 / 0,10 | | 2,50 / 0,40 | | там же |
| Gemini 3.5 Flash / Flash-Lite | 1,50 / 0,30 | caching 0,15 | 9,00 / 2,50 | | там же |
| Gemini 3.6–3.8 Flash | 0,75 (до 31.12.2026; 1,50 с 2027) | | 3,75 (7,50 с 2027) | | там же |
| Gemini Embedding 2 / 001 | 0,20 / 0,15 | | | | там же |
| **Mistral Large 3** | 0,50 | cached −90 % | 1,50 | La Plateforme; **regional inference +10 %**; батч −50 %; веса **Apache 2.0** → on-prem | https://mistral.ai/pricing/api (открыто 2026-09-06) |
| Mistral Medium 3.5 | 1,50 | | 7,50 | (Modified MIT) | там же; лицензии — https://docs.mistral.ai/getting-started/models/models_overview/ |
| Mistral Small 4 | 0,15 | | 0,60 | Apache 2.0 | там же |
| Ministral 3 (3B/8B/14B) | 0,10 / 0,15 / 0,20 | | 0,10 / 0,15 / 0,20 | Apache 2.0 | там же |
| Mistral OCR 4.1 | **$4 / 1 000 страниц** | | | | там же |
| mistral-embed / codestral-embed | 0,10 / 0,15 | | | | там же |
| **Azure OpenAI (Foundry)** | цены = JS-калькулятор, **не извлёк** | | | **Data Zone Standard (EU)**: «processes data within the Azure EU Data Boundary» (+EFTA), Data Zone Batch −50 %; Regional Standard — внутри Azure geography; Global — любой регион (Microsoft Learn, «deployment types», ms.date 2026-08-06, https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/deployment-types , открыто 2026-09-06) | цены: https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ (открыто, «$-» плейсхолдеры) |

**Embedding-модели для испанского/каталанского:** OpenAI text-embedding-3-small/large ($0,02/$0,13); **Voyage voyage-3.5 $0,06/M (200M токенов бесплатно), voyage-multilingual-2 $0,12/M, rerank-2 $0,05/M** (https://docs.voyageai.com/docs/pricing , открыто 2026-09-06); Cohere Embed 4 — на странице цен только «Model Vault» (dedicated: $4–5/ч или $2 500–3 250/мес), токенная цена не показана (https://cohere.com/pricing , открыто 2026-09-06); Gemini Embedding 2 $0,20/M. **Open-weight:** `BAAI/bge-m3` — **MIT**, 38,2M загрузок (HF API, 2026-09-06); `intfloat/multilingual-e5-large` / `-instruct` — **MIT**; `Qwen/Qwen3-Embedding-8B` / `0.6B` — **Apache 2.0**, плюс `Qwen3-Reranker-0.6B/4B/8B` (обновлены 04.2026); `jinaai/jina-embeddings-v3` — **CC-BY-NC-4.0 (не для коммерции без лицензии)**, v4 — лицензия в тегах не указана (HF API, 2026-09-06). Каталанский: bge-m3 и multilingual-e5 — мультиязычные (100+ языков, общее знание; отдельных бенчмарков по каталанскому не искал — `[не проверено]`). Рекомендация: **bge-m3 self-hosted** (MIT, dense+sparse+colbert) или Voyage-3.5 как managed.

### 2.2. Open-weight модели: лицензии и GPU

| Модель (HF id) | Лицензия (тег HF, 2026-09-06) | Размер | Комментарий |
|---|---|---|---|
| `meta-llama/Llama-3.3-70B-Instruct` | `llama3.3` (Llama Community License, не OSI) | 70,6B | классика «70B» [релиз 12.2024] |
| `meta-llama/Llama-4-Scout-17B-16E-Instruct` / `Maverick` | `other` (Llama 4 Community License) | 109B / 402B MoE | 05.2025 |
| `Qwen/Qwen3-32B`, `Qwen3-235B-A22B(-Instruct-2507)`, `Qwen3.5-397B-A17B`, `Qwen3.8-27B` | **Apache 2.0** (Qwen3.8-2.4T-A95B — `other`) | 32B / 235B MoE / 397B MoE / 27B | Qwen3.8-27B — 6M+ загрузок (08.2026) |
| `mistralai/Mistral-Small-3.2-24B-Instruct-2506`, `Mistral-Small-4-119B-2603`, `Mistral-Large-3-675B-Instruct-2512`, Ministral 3 | **Apache 2.0** | 24B / 119B MoE / 675B MoE | Small 4 — hybrid instruct/reasoning |
| `google/gemma-3-27b-it` | `gemma` (Gemma Terms) | 27B | |
| `google/gemma-4-31B-it`, `gemma-4-26B-A4B-it` | **Apache 2.0** (тег HF) | 31B / 26B MoE | 07.2026 |
| `deepseek-ai/DeepSeek-V3.2`, `DeepSeek-V4-Flash`, `V4-Pro` | **MIT** | 685B / 291B / — | китайский провайдер; для EU-клиентов — только self-hosted |

**GPU-требования (правило большого пальца, общее знание, `[НЕТ ИСТОЧНИКА]`):** 70B dense — FP16 ≈ 140 GB (2×H100 80 GB), FP8 ≈ 70 GB (1×H100 80 GB / 1×RTX PRO 6000 96 GB, мало места под KV-cache), INT4/AWQ ≈ 35–40 GB (1×L40S 48 GB); 24–32B dense в FP8 — 1×L40S/L4×2; MoE 119B (Small 4) в 4 бит ≈ 60 GB — 1×96 GB. Инференс-стек: **vLLM (Apache 2.0, 91k★, v0.28.0 от 26.08.2026)** или **SGLang (Apache 2.0, 35,5k★)** (GitHub search API через MCP, PyPI, 2026-09-06).

**Аренда GPU в ЕС (2026-09-06):**

| Провайдер | Конфигурация | Цена | Источник |
|---|---|---|---|
| **Scaleway (Paris fr-par-2)** | H100-1-80G (1×H100 PCIe) | **€2,8665/ч ≈ €2 093/мес** (≈ $2 432/мес) | Scaleway public API `GET /instance/v1/zones/fr-par-2/products/servers` (hourly_price/monthly_price), 2026-09-06 |
| | H100-2-80G (2×H100 PCIe) | €5,733/ч ≈ €4 185/мес (≈ $4 864) | там же |
| | H100-SXM-2-80G / -4 / -8 | €6,62 / 12,77 / 25,33 /ч | там же |
| | L40S-1-48G | **€1,47/ч ≈ €1 073/мес** (≈ $1 247) | там же |
| | L4-1-24G | €0,7875/ч ≈ €575/мес | там же (и https://www.scaleway.com/en/pricing/gpu/ ) |
| | B300-SXM-2-288G | €18,96/ч ≈ €13 841/мес | там же |
| **OVHcloud (Gravelines GRA9/GRA11, EU)** | h100-380 (1×H100 80 GB) | **2,8 €/ч, 1 940 €/мес** (≈ $2 255) | https://www.ovhcloud.com/fr/public-cloud/prices/ (JSON в странице), открыто 2026-09-06 |
| | h100-760 (2×H100) | 5,6 €/ч, 3 880 €/мес (≈ $4 509) | там же |
| | l40s-90 (1×L40S) | 1,4 €/ч, 1 008 €/мес | там же |
| | l4-90 (1×L4) | 0,75 €/ч, 540 €/мес | там же |
| | a100-180 (1×A100 80 GB) | 2,75 €/ч, 1 100 €/мес | там же |
| **Hetzner (Falkenstein/Helsinki)** | **GEX131: 1×RTX PRO 6000 Blackwell Max-Q 96 GB GDDR7, Xeon Gold 5412U, 256 GB RAM** | **€889/мес или €1,4247/ч** (≈ $1 033/мес); пресс-релиз 11.12.2025; setup-fee «since 16 December 2025» — сумма на странице не отобразилась | https://www.hetzner.com/pressroom/new-gex131/ (открыто 2026-09-06); спецификации https://www.hetzner.com/dedicated-rootserver/gex131/ |
| Hetzner GEX45 | 1×RTX PRO 4000 Blackwell 24 GB (Helsinki) | цена на странице не отобразилась (JS) | https://www.hetzner.com/dedicated-rootserver/matrix-gpu/ |

### 2.3. Оценка стоимости инференса на одну компанию-транзитария в месяц

**Допущения (все — «допущение», если не указан источник):**
- 40 сотрудников × **40 запросов/чел./день** × 22 рабочих дня = **35 200 запросов/мес**.
- Запрос: **5 000 входных + 400 выходных токенов** → input **176M**, output **14,08M** токенов/мес.
- Кэшируемый префикс (системный промпт + схемы инструментов + политика ролей): **3 000 из 5 000 входных токенов** → при промпт-кэшировании 105,6M cache-read + 70,4M обычного входа (cache-write считаю пренебрежимым: префикс обновляется редко).
- Индексация в месяц: 4 000 отгрузок × 6 документов × 3 страницы = **72 000 страниц** + **40 000 писем**; **500 токенов/страница** и **600 токенов/письмо** → **36M + 24M = 60M токенов** на эмбеддинги; доля сканов, требующих OCR, — **50 %** (36 000 страниц).
- Трекинг: **2 000 активных контейнеров/мес**; цена агрегатора **не опубликована** → диапазон **$0,50–1,50 за контейнер/мес** `[НЕТ ИСТОЧНИКА — не для питча]`; альтернатива — события PCS (VPCS: 45 €/мес обслуживание интеграции, по прайсу).
- Self-hosted: узел 2×H100 PCIe (Scaleway H100-2-80G, €4 185/мес ≈ $4 864) под Llama-3.3-70B/Qwen3-32B/Gemma-4-31B в FP8 на vLLM; пропускная способность **~15 000 ток/с prefill и ~1 500 ток/с агрегированный decode** `[допущение, без источника]` → на тенанта в месяц: 176M/15k ≈ 3,3 ч + 14,08M/1,5k ≈ 2,6 ч ≈ **6 GPU-часов/мес**; рабочее окно 22 дня × 9 ч = 198 ч, целевая утилизация 50 % → **≈ 15 тенантов на узел** (пиковая одновременность — ограничитель; беру N = 10 консервативно).

**Формулы:** `LLM = Input_M × P_in + Output_M × P_out` (без кэша); `LLM_cache = 70,4 × P_in + 105,6 × P_cache + 14,08 × P_out`; `Emb = 60 × P_emb`; `OCR = 36 × P_ocr/1000стр`; `Track = 2 000 × P_cont` или PCS-фикс; `Self = (Cost_node / N) + Emb_self + OCR_self`.

| Вариант | Модель | LLM без кэша, $/мес | LLM с кэшем, $/мес | EU-надбавка | Итого с эмбеддингами, OCR и трекингом, $/мес |
|---|---|---|---|---|---|
| **(a) Премиальная облачная** | Claude Opus 5 (через Bedrock EU — партнёрская цена может отличаться) | 176×5 + 14,08×25 = **1 232** | 70,4×5 + 105,6×0,5 + 352 = **757** | Bedrock EU — цена не извлечена | 757 + 8 (emb-3-large) + 144 (Mistral OCR 36k стр.) + 52 (PCS) [+ 1 000–3 000 агрегатор-допущение] ≈ **$960 (PCS) … $2 000–4 000 (с агрегатором)** |
| | Claude Sonnet 5 | 352 + 140,8 = **493** | 140,8 + 21,1 + 140,8 = **303** | | ≈ **$510 … $1 500–3 500** |
| | OpenAI gpt-5.4 (EU-endpoint, +10 %) | 440 + 211 = 651 → **716** | 176 + 26,4 + 211 = 414 → **455** | +10 % | ≈ **$660 … $1 650–3 650** |
| | Gemini 2.5 Pro (Vertex `eu`) | 220 + 141 = **361** | (context caching, не считал) | регион EU без надбавки в прайсе | ≈ **$565 … $1 560–3 560** |
| **(b) Дешёвая облачная** | OpenAI gpt-5.4-mini (EU, +10 %) | 132 + 63 = 195 → **215** | 52,8 + 7,9 + 63,4 = 124 → **136** | +10 % | ≈ **$340 (Mistral OCR) / $235 (LlamaParse) … $1 250–3 250** |
| | Claude Haiku 4.5 | 176 + 70 = **246** | 70,4 + 10,6 + 70,4 = **151** | | ≈ **$295** (LlamaParse basic, emb-3-small) |
| | Gemini 2.5 Flash / 3.5 Flash-Lite | 52,8 + 35,2 = **88** | — | | ≈ **$240** |
| | Mistral Small 4 (La Plateforme EU, +10 %) | 26,4 + 8,4 = 35 → **38** | (cached −90 %) | +10 % | ≈ **$240** (с Mistral OCR и mistral-embed) |
| **(c) Self-hosted 70B в ЕС** | Qwen3-32B / Llama-3.3-70B / Gemma-4-31B FP8, vLLM, 2×H100 Scaleway Paris €4 185/мес | **N=1 (single-tenant/on-prem): $4 864/мес**; **N=5: $973**; **N=10: $486**; **N=15: $324** | — | данные не покидают ЕС/периметр | + bge-m3 self-hosted (≈$0 маржинально) + Docling self-hosted (CPU, ≈ $50–100/мес, допущение) + PCS $52 → **≈ $600 (N=10) … $5 000 (N=1)**; вариант Hetzner GEX131 (1×96 GB, модель ≤32B FP8 или 70B INT4): **$1 033/мес** за single-tenant on-prem-класс |

**Выводы:** (1) при кэшировании даже Opus 5 — **< $800/мес на компанию** при 35k запросов; Sonnet 5 / gpt-5.4 — **$300–450**; дешёвые модели — **< $150** — LLM не является драйвером себестоимости. (2) Драйверы — **OCR сканов (Mistral OCR $4/1 000 стр. → $144–288/мес; LlamaParse basic ≈ $1,25/1 000 стр. → $45–90; Docling self-hosted ≈ компьют) и трекинг-агрегатор (цена не опубликована)**. (3) Self-hosting выгоден с **N ≥ 5–10 тенантов на узел** или как отдельный on-prem-тариф (≥ $1 000–5 000/мес инфраструктуры) для AEO/крупных клиентов. (4) EU-residency: OpenAI/Mistral +10 %, Azure Data Zone EU, Vertex `eu`, Bedrock EU-регионы; **первопартийный Anthropic API EU-инференса не даёт** — только Bedrock/Vertex.

---

## 3. Готовые компоненты (open-source): зрелость, лицензия, брать/писать

Данные: GitHub Search API через MCP (звёзды/лицензия/pushed_at на 2026-09-06), PyPI JSON (версия/дата), файлы LICENSE через raw.githubusercontent.com.

| Компонент | Лицензия | Зрелость (★ / последний релиз или push) | Берём / пишем | Почему |
|---|---|---|---|---|
| **Onyx (ex-Danswer)** — RAG-ассистент с коннекторами | **MIT (Community Edition)**; `ee/`-директории — Onyx Enterprise License (LICENSE, README) | 31,9k★, push 2026-09-06 | **Берём как референс / форкаем коннекторы**, ядро — своё | Есть коннекторы Gmail, Google Drive, SharePoint (certificate auth **с permission sync**), Slack, Teams, Confluence, File, Web; **Outlook/M365-mail коннектора в официальном списке нет**; **Permission Sync Connectors, SSO (OIDC/SAML), User Groups & RBAC, Usage Analytics — только Enterprise Edition** (https://docs.onyx.app/llms.txt , …/admins/permissions/understanding_permissions.md , …/deployment/miscellaneous/enterprise_edition.md , открыто 2026-09-06). Для нас permission-sync критичен → EE-лицензия или своя реализация |
| **Airbyte** | **ELv2** (LICENSE) | 22,0k★, push 2026-09-05 | Не берём для ядра | ELv2 запрещает managed-service поверх; для ETL из SQL-реплик ERP — опционально self-hosted |
| **Nango** | **ELv2** | 11,7k★, push 2026-09-04 | Опционально (OAuth-хаб) | то же ограничение |
| **Composio** | MIT | 30,1k★, push 2026-09-06 | Опционально для действий (Slack/Teams) | много SaaS-коннекторов, но нет логистических |
| Merge.dev / Paragon | коммерческие | — | Нет | нет коннекторов к TMS транзитариев, лишний субпроцессор |
| **Unstructured** | Apache 2.0 | 15,4k★; PyPI 0.27.5 (2026-08-28) | Берём как запасной парсер | широкий охват форматов писем/офисных файлов |
| **Docling (IBM)** | **MIT** | **66,0k★**; PyPI 2.126.0 (2026-09-04) | **Берём** (PDF/сканы BL, инвойсы, packing list, таблицы) | лучший OSS layout-парсер, self-hosted → нет субпроцессора |
| LlamaParse (LlamaCloud) | коммерческий | 1 000 credits = $1,25; Free 10k credits/мес; basic parsing от 1 credit/стр.; **есть EU-регион** (https://www.llamaindex.ai/pricing , открыто 2026-09-06) | Опционально | дёшево, EU-регион, но субпроцессор |
| Azure Document Intelligence | коммерческий | цены — JS-калькулятор, не извлёк | Опционально (prebuilt Invoice) | EU-регионы Azure; цена `[не найдена]` |
| **Mistral OCR 4.1** | коммерческий | $4 / 1 000 стр., regional +10 % | Опционально для сложных сканов | EU-провайдер |
| **EDIFACT-парсеры**: `nerdocs/pydifact` (Python) | MIT | 191★, PyPI 0.2.3 (2026-04-10), push 2026-08-31 | **Берём** для IFTSTA/COARRI/CODECO из PCS | лёгкий токенизатор; маппинг сегментов IFTSTA/IFTMIN/CUSDEC — **пишем сами** по гайдам VPCS |
| `bots-edi/bots` | GPLv3 (общее знание; GitHub отдал 403/404) | `[не проверено]` | Нет | GPL, тяжёлый, неактивный |
| `xlate/staedi` (Java) | Apache 2.0 | 150★, push 2026-09-04 | Нет (стек Python) | если JVM |
| `jf-tech/omniparser` (Go) | MIT | 1 089★, push 2025-02 | Нет | если Go |
| **Elasticsearch** | AGPL-3.0 / SSPL / ELv2 (тройная) | 77,9k★ | Опционально | Document-Level Security есть, но лицензия и вес |
| **OpenSearch** | Apache 2.0 | 13,7k★, push 2026-09-05 | Берём как BM25 + DLS (security plugin) | Apache 2.0, FLS/DLS из коробки |
| **Vespa** | Apache 2.0 | 7,1k★ | Опционально (гибрид + ranking) | сложнее в эксплуатации |
| **Qdrant** | Apache 2.0 | 34,4k★; client 1.19.0 (2026-08-04) | **Берём** (векторы + payload-фильтры по tenant/клиенту/роли) | Apache 2.0, Rust, multitenancy-паттерны |
| **Weaviate** | BSD-3 | 16,8k★ | альтернатива | |
| **pgvector** | PostgreSQL License | 22,9k★, push 2026-08-20 | **Берём для MVP** (единая Postgres: метаданные + векторы + RLS) | минимум компонентов; Row-Level Security Postgres как permission-фильтр |
| **OpenFGA** (Zanzibar) | Apache 2.0 | 5,7k★, push 2026-09-04 | Опционально на этапе 2 | ReBAC «сотрудник→клиент→отгрузка→документ»; для MVP достаточно RLS |
| **Cerbos** | Apache 2.0 | 4,6k★ | альтернатива (policy-based) | |
| **LangGraph** | MIT | 41,1k★; PyPI 1.2.11 (2026-08-11) | Опционально | |
| **LlamaIndex** | MIT | 52,0k★; 0.14.24 | Опционально (ingestion) | |
| **Haystack** | Apache 2.0 | 26,4k★; 3.1.1 (2026-09-03) | альтернатива | |
| **Pydantic AI** | MIT | 19,7k★; 2.40.0 (2026-09-05) | **Берём** (типизированные инструменты, structured outputs, провайдеро-независимость) | тонкий слой, легко менять модель (Claude/OpenAI/vLLM) |
| OpenAI Agents SDK | MIT | 29,2k★; 0.22.0 | Нет (привязка) | |
| **Anthropic Claude Agent SDK / MCP** | MIT; MCP servers — переход MIT→Apache 2.0 | 8,0k★ / 90,1k★ (modelcontextprotocol/servers, push 2026-09-03); PyPI claude-agent-sdk 0.2.152 (2026-09-02) | **MCP — берём как протокол инструментов**; Agent SDK — нет (это Claude Code как библиотека) | MCP-серверы: `Softeria/ms-365-mcp-server` (MIT, 951★, push 2026-09-04), `taylorwilsdon/google_workspace_mcp` (MIT, 3,1k★), `korotovsky/slack-mcp-server` (MIT, 1,8k★) — GitHub search 2026-09-06; для продакшена оборачиваем в свои серверы с аудитом |
| CrewAI | MIT | 58,1k★ | Нет | лишняя абстракция для одного ассистента |
| **Temporal** | MIT | 22,8k★; PyPI temporalio 1.32.0 (2026-08-24) | Опционально (долгие индексации/ретраи) | для MVP — Celery/cron |
| **n8n** | **Sustainable Use License** + `.ee.` под Enterprise License (LICENSE.md) — **не OSI, запрещает встраивание в свой коммерческий SaaS без лицензии** | 203,5k★ | **Нет** в продукте; допустимо для внутренних автоматизаций | лицензия |
| **Ragas** | Apache 2.0 (PyPI 0.4.3, 2026-01-13) | ★ не получил (репозиторий не найден search-API) | Берём для RAG-метрик | |
| **DeepEval** | Apache 2.0 | 18,1k★; 4.2.1 (2026-09-03) | Берём (регресс-тесты «золотого» набора) | |
| **Langfuse** | **MIT** (кроме `ee/`) | 34,2k★; 4.15.1 (2026-08-28) | **Берём** (трейсинг, промпты, датасеты; self-hosted в ЕС) | |
| Arize Phoenix | **ELv2** (LICENSE; PyPI arize-phoenix 20.8.0 «Elastic-2.0») | 11,3k★ | Нет | лицензия |
| Guardrails AI | Apache 2.0 | 7,4k★; 0.11.0 | Опционально | |
| NeMo Guardrails | Apache 2.0 (общее знание) | 7,1k★ (NVIDIA-NeMo/Guardrails) | Опционально | Colang-правила «нельзя раскрывать ставки» — но проще на уровне retrieval-фильтров |
| **Presidio** | MIT (общее знание) | PyPI presidio-analyzer 2.2.364 (2026-07-22) | Берём (PII в логах/трейсах, псевдонимизация) | spaCy-модели для испанского |

---

## 4. Архитектура MVP «статус + документы + черновик котировки»

```
┌──────────────────────────── Клиент-транзитарий (tenant) ────────────────────────────┐
│  Источники (read-only):                                                              │
│   [M365/Google: Mail + SharePoint/Drive]  [PCS: VPCS XML IFTSTA/COARRI/CODECO |      │
│                                            Portic — по договору]                     │
│   [Трекинг-агрегатор: Terminal49/Vizion webhooks]  [TMS/TDua: экспорт CSV/XLSX/PDF   │
│                                            по расписанию / SQL-реплика on-prem]      │
│   [Тарифные таблицы: Excel/PDF ставок линий и клиентских тарифов — папка «rates»]    │
└───────────────┬──────────────────────────────────────────────────────────────────────┘
                │ коннекторы (MCP-серверы / воркеры), инкрементально (Graph delta, Gmail history,
                │ PCS-события, webhooks), каждая запись помечена tenant_id + ACL-источника
┌───────────────▼───────────────── Наш EU-кластер (Hetzner/OVH/Scaleway или Azure EU) ──┐
│ Ingestion: Docling (PDF/сканы) → нормализация → извлечение сущностей (BL#, контейнер, │
│   booking, MRN/DUA, ETA/ETD, клиент, отгрузка) → «Shipment Graph» (Postgres)          │
│ Индекс: Postgres + pgvector (эмбеддинги bge-m3/Voyage) + OpenSearch BM25 (DLS)        │
│ Permission layer: Postgres RLS по (tenant, роль, клиент, категория «rates»)            │
│ Orchestrator (Pydantic AI + MCP tools): route → retrieve (RLS-фильтр) → LLM → ответ    │
│   с цитатами [источник, событие, дата] → confidence → draft                            │
│ LLM: Sonnet 5/Opus 5 via Bedrock EU | gpt-5.4 EU-endpoint | Mistral | vLLM 70B (opt.) │
│ Audit log (append-only): кто спросил, что найдено, что показано, что отправлено       │
│ Eval: Langfuse traces, DeepEval/Ragas на «золотом» наборе отгрузок                    │
└───────────────┬──────────────────────────────────────────────────────────────────────┘
                │
┌───────────────▼──────────── Интерфейсы ───────────────────────────────────────────────┐
│ Web-консоль (чат + «карточка отгрузки» + очередь черновиков)                          │
│ Outlook add-in / Gmail add-on: «Ответить с помощью ассистента» → черновик в Compose    │
│ Teams/Slack-бот (внутренние вопросы) | WhatsApp Business (клиентские ответы в 24-ч     │
│ окне — только после одобрения человеком)                                             │
│ Human-in-the-loop: черновик → оператор правит/одобряет → отправка из ЕГО почты        │
│ ЗАПРЕТ: любые действия в AEAT/ICS2/PCS на запись; автономная отправка клиенту          │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Стек:** Python 3.12, FastAPI, Postgres 16 + pgvector (RLS), OpenSearch (опц.), Redis/Celery (индексация), Docling, pydifact, Pydantic AI + MCP, Langfuse, Presidio; фронт — Next.js; Outlook add-in (Office.js). Kubernetes или docker-compose на 2–3 VM в ЕС.

**EU-деплой и модель аренды:**
- **Multi-tenant SaaS (по умолчанию)** — один кластер в ЕС (Hetzner/OVH/Scaleway), изоляция тенантов: отдельная схема/БД на тенанта + RLS + отдельные ключи шифрования; LLM — Bedrock EU / OpenAI EU / Mistral (субпроцессоры в DPA, regulatory-файл 2.1).
- **Single-tenant / on-prem** — для AEO и крупных: тот же docker-образ на VM клиента или выделенный узел (Hetzner GEX131 €889/мес или 2×H100) с open-weight моделью (Qwen3/Gemma 4/Mistral Small 4 — Apache 2.0); CRA-обязательства для on-prem-дистрибутива (regulatory-файл, раздел 3).
- **Data Act:** экспорт индекса/настроек и switching-clause (regulatory-файл).

**Permission-модель (роли):**
- `operativo` — все отгрузки своего отдела/направления (море/авиа/авто), документы, события; **без клиентских тарифов** других направлений.
- `customer service` — отгрузки и документы **только закреплённых клиентов**; черновики внешних ответов.
- `aduanas` — DUA/Levante/MRN, таможенные документы всех отгрузок; без коммерческих ставок.
- `dirección` — всё, включая ставки и маржу.
- **Разграничение по клиентам** (`client_id` на каждой отгрузке/документе/письме) и **категория «rates» (коммерческая тайна)**: ставки линий/агентов и клиентские тарифы — отдельная категория с доступом `dirección` + `pricing`; черновик котировки видит ставки, но **исходящий текст никогда не содержит ставок другого клиента** (retrieval ограничен `client_id` запроса + общими тарифами линий). Внешние ACL (SharePoint/Drive) синхронизируются как в источнике (permission-aware, EDPB/AEPD — regulatory-файл 2.2).
- Multi-tenant: `tenant_id` в каждом ряду + RLS-политика; никакого дообучения на данных клиента.

**Аудит-лог:** append-only таблица (кто, когда, вопрос, retrieved doc_ids + версии, ответ, confidence, статус черновика: создан/изменён/одобрен/отправлен, кем), экспорт для AEO-аудита (UCC art. 39 — regulatory-файл 4.2), retention по политике клиента (дефолт 90 дней для промптов, лог одобрений — 3+3 года как у таможенных документов, UCC art. 51).

**Human-in-the-loop UI:** очередь черновиков → карточка отгрузки (события PCS/трекинга с датами и источниками) → черновик с цитатами и «уверенностью» → кнопки «одобрить/править/отклонить» → отправка из почтового ящика оператора (Graph `sendMail` от имени пользователя) с пометкой «подготовлено с помощью ИИ» (AI Act Art. 50 — regulatory-файл 1.4).

**Интерфейсы:** web (основной), Outlook add-in (там живёт operativo/customer service), Teams-бот (внутренние вопросы), WhatsApp Business (ответы клиентам в 24-часовом окне, бесплатно; только после одобрения).

**«Ничего не подаём в AEAT»:** коннекторы AEAT/ICS2 отсутствуют физически; PCS — только чтение (IFTSTA/COARRI/CODECO), запись (booking/SI) — вне MVP.

---

## 5. Сроки и бюджет до первого платящего клиента

**Зарплаты Испании (брутто/год, Michael Page «Estudio de Remuneración Tecnología 2026», PDF на michaelpage.es, открыт 2026-09-06; Madrid/Barcelona):** Python Developer (Backend) 4–7 лет **40–55k €**, ≥8 лет **55–70k €**; Java Developer ≥8 лет Madrid 60–90k €; **Machine Learning Specialist 4–7 лет: Madrid 60–80k €, Barcelona 60–90k €**; Data Scientist 4–7 лет Madrid 45–68k €, ≥8 лет 68–90k €; **DevOps Engineer 4–7 лет 60–80k €**, ≥8 лет 80–95k € (+5–10 % бонус); **Product Manager 4–7 лет 55–75k €**, ≥8 лет 75–90k €; **CTO 4–7 лет 75–100k €**, ≥8 лет >100k € (+10–20 %). Для сравнения: talent.com — «Backend developer senior» в Испании в среднем **33 000 €/год** (диапазон 24 000–35 200 €, 10 000 зарплат; https://es.talent.com/salary?job=backend+developer+senior , открыто 2026-09-06) — очевидно, смешанная выборка, для бюджета не использую. Hays «Guía del Mercado Laboral 2026» — только лендинг/регистрация (https://guiasalarial.hays.es/ ), цифры не извлёк. **Полная стоимость для работодателя = брутто × 1,30–1,33** (допущение, как в niche-файле).

**Команда до первого платящего (Испания, Barcelona/Madrid, допущение):**

| Роль | FTE | Брутто, €/год | Полная стоимость, €/год (×1,30) |
|---|---|---|---|
| Tech lead / архитектор (backend ≥8 лет) | 1,0 | 65 000 | 84 500 |
| Backend/integration engineers (Python 4–7 лет) | 2,0 | 2 × 50 000 | 130 000 |
| ML/LLM engineer (4–7 лет) | 1,0 | 70 000 | 91 000 |
| Frontend (Next.js, add-in) | 0,5 | 45 000 | 29 250 |
| Product/domain (бывший руководитель операций транзитария) | 1,0 | 50 000 | 65 000 |
| DevOps/security | 0,3 | 65 000 | 25 350 |
| **Итого payroll** | **5,8** | | **≈ 425 000 €/год ≈ 35 400 €/мес (≈ $41 100/мес)** |

**План (допущение):** M0–M1 — интервью (10–15 транзитариев ATEIA-Barcelona; Конгресс FETEIA 1–4.10.2026 — niche-файл), 2–3 design-партнёра, соглашения о данных; M1–M3 — MVP: коннекторы M365/Google + файлы, экспорт из TMS/TDua, VPCS-события, «где мой груз/документ» с цитатами, черновики ответов; M3–M5 — пилот у 2–3 транзитариев Barcelona (бесплатно/со скидкой), permission-модель, аудит, Outlook add-in; M4–M6 — черновик котировки из истории/тарифов, Portic/Terminal49; M2–M4 параллельно — юрпакет (DPA, DPIA-шаблон, sub-processor list, AI-literacy, пакет для работников; **~6–8 недель** — regulatory-файл 5.3); **первый платящий — M6–M9**.

**Бюджет до первого платящего (8 месяцев, допущение):**

| Статья | Испания | «Команда Ocean Tech в СНГ» (допущение без источника: payroll × 0,5) |
|---|---|---|
| Payroll 8 мес. | 283 000 € | 142 000 € |
| Инфраструктура ЕС (кластер + dev/stage + GPU-эксперименты + LLM API) 2 500–4 000 €/мес | 20 000–32 000 € | то же |
| Юрпакет (внешний юрист ES + DPO-консультант, 6–8 недель) | 15 000–30 000 € | то же |
| Партнёрства/PCS/трекинг (VPCS 350 € + 45 €/мес; Portic; агрегатор — по запросу) | 5 000–15 000 € | то же |
| Пилоты и продажи (поездки, FETEIA, Logistics & Automation Madrid) | 8 000–15 000 € | то же |
| Резерв 15 % | 50 000 € | 30 000 € |
| **Итого** | **≈ 380 000–425 000 € (≈ $440 000–495 000)** | **≈ 240 000–285 000 € (≈ $280 000–330 000)** |

Экономия по self-hosting LLM на этом этапе — нулевая (объёмы малы); GPU-узел покупать только под конкретного on-prem-клиента.

---

## 6. Риски качества и как их гасить

| Где ИИ ошибается недопустимо | Последствие | Контроль | Что добавляет к стоимости |
|---|---|---|---|
| **Неверный статус/ETA клиенту** (устаревшее событие, перепутанный рейс) | претензии, срыв доставки, репутация | Ответ строится **только из событий с источником и временной меткой** (PCS/трекинг/письмо), в черновике — цитата «COARRI 05.09 14:10, valenciaportPCS»; **обязательное одобрение человеком** исходящих; «не знаю / данных нет после дд.мм» вместо догадки; порог confidence → эскалация | UI очереди черновиков; +1 клик оператора на письмо; DeepEval-регрессии на «золотом» наборе |
| **Перепутать контейнер/BL/клиента** | раскрытие данных другого клиента (GDPR, коммерческая тайна) | Retrieval **жёстко фильтруется по `client_id`** запроса (RLS), сущности (контейнер/BL) валидируются регулярками (ISO 6346 check-digit для контейнеров), ответ содержит только сущности, найденные в фильтрованном контексте; тест «cross-client leakage» в CI | Разработка permission-слоя ~4–6 недель; отдельный набор leakage-тестов |
| **Раскрыть ставки другого клиента / закупочные ставки линий** в черновике котировки | потеря маржи, утечка тайны | Категория «rates» отдельно; в черновик клиенту попадают только тарифы **этого** клиента и «публичные»; закупочные ставки — только во внутренней части черновика с маркером «НЕ ОТПРАВЛЯТЬ»; пост-проверка исходящего текста регексами/классификатором на числа-ставки без источника | Guardrail-модуль; ревью человеком |
| **Неверная HS-классификация / таможенная стоимость** | солидарная ответственность представителя, доначисления 3+3 года (UCC art. 77, 51 — niche-файл, regulatory 4.2) | **Не делаем в v1** (ни классификации, ни советов по декларации); при вопросах — ссылка на TariffOne/TDua и «спроси aduanas» | 0 (отказ от функции) |
| **Сроки таможенных действий** (deadline ENS/ICS2, срок на исправление, temporary storage) | штрафы, простой | Ассистент показывает только **факты из источников** (MRN, Levante, дата), не считает дедлайны; фиксированный дисклеймер | 0 |
| **Автономные действия** (отправка, подача, изменение записей) | необратимые последствия | Архитектурный запрет: нет write-коннекторов к AEAT/ICS2/PCS/TMS; отправка — только из ящика оператора после одобрения; аудит-лог | — |
| **Галлюцинации по документам** (несуществующий номер BL) | ошибка клиента | Structured outputs + цитаты с `doc_id`/страницей; ответ без цитаты не показывается клиенту | +10–20 % токенов на цитирование |
| **Дрейф качества после смены модели/промпта** | регресс | «Золотой» набор 200–500 реальных вопросов по 50–100 отгрузкам design-партнёров с ожидаемыми ответами; прогон DeepEval/Ragas в CI перед каждым релизом; Langfuse-трейсы | ~2–3 недели на сбор набора + ~$20–50/прогон (LLM-judge, допущение) |
| **PII в логах/трейсах** | GDPR | Presidio-псевдонимизация в Langfuse, retention 30–90 дней | небольшая |

Итого «цена надёжности»: ~+15–25 % к разработке (permission-слой, цитаты, очередь одобрений, eval-набор) и ~+10–20 % токенов; зато именно это — продающий аргумент для AEO-клиентов (regulatory-файл 4.2).

---

## Что не нашёл

1. **Стоимость лицензии/доступа eAdaptor у WiseTech** от первоисточника — только сторонние оценки (CargoMode: ~$340/мес при 1 000 отгрузок; Value Pack с 12.2025); условия ISV-партнёрства — на сайте нет; Developer Guide (Scribd) не открылся.
2. **API испанских ERP** (VisualTrans «API nativa», DeiWorld, Quatuor, B-First, Bitácora) — документация закрыта; **Taric «ficha técnica»** с типами API — timeout; полный Taric API — только `duasql-public` (форматы импорта/экспорта TDua).
3. **Тарифы и техдокументация Portic** для сторонних вендоров — только по запросу; условия Algeciras/Bilbao — не открывал.
4. **Цены за контейнер Terminal49 / Vizion / Portcast / project44 / Shippeo** — не опубликованы (Portcast — 403).
5. **Maersk/MSC/CMA CGM/Hapag developer-порталы, INTTRA, Cargo iQ/CHAMP/Descartes, GPS-провайдеры** — не открыты (403/лимит).
6. **Точные ставки WhatsApp для Испании** — только в интерактивном калькуляторе/CSV Meta; вторичная цифра 0,0509 € — сниппет.
7. **Цены Claude на AWS Bedrock в EU-регионах и Azure OpenAI Data Zone EU** — страницы рендерят цены JS; прайс-лист Bedrock — с хэшированными ключами.
8. **Hetzner GEX45 цена и setup-fee GEX131** — не отобразились.
9. **Hays Guía Salarial 2026** — за регистрацией; Malt — не искал.
10. **Звёзды GitHub Ragas и Presidio** — search-API не вернул репозитории (возможно, переименованы); bots-edi — GitHub 403/404.
11. **Пропускная способность vLLM для 70B на 2×H100** — использовано допущение без бенчмарка.
12. **Бенчмарки эмбеддингов на каталанском** — не искал.

## Что сомнительно

- **Bing** отдавал нерелевантную выдачу на все запросы (вероятно, проблема прокси/региона); Brave/DDG — 429/CAPTCHA; часть поиска шла только через Yahoo — покрытие неполное.
- **Оценка «15 тенантов на узел 2×H100»** — допущение по пропускной способности; реальная одновременность в пиковые часы (9:00–11:00) может снизить N до 5–8.
- **Допущение 40 запросов/чел./день** — верхняя граница; при 10–15 запросах стоимость LLM падает в 3–4 раза.
- **Цена агрегатора трекинга $0,5–1,5/контейнер** — без источника; может оказаться подписочной (фикс/мес) — тогда для MVP выгоднее.
- **Vertex `eu` для Claude** — на claude.com/regional-compliance Europe помечена «Coming 2026» (страница не уточняет, относится ли к Vertex или Foundry); для EU-инференса Claude сейчас надёжно подтверждён только Bedrock (regulatory-файл).
- **Michael Page 2026** — вилки по 1 500 процессам подбора самого агентства, смещены к «рыночным» позициям; talent.com даёт вдвое меньшую медиану — истина между.
- **Onyx как база**: EE-функции (permission sync, RBAC, SSO) — под коммерческой лицензией; «MIT-ядро» без них для нашего кейса недостаточно — либо EE-лицензия, либо своя реализация (заложено в архитектуру).
- **Лицензия Gemma 4 = Apache 2.0** — по тегу HF на `google/gemma-4-31B-it`; текст лицензии не открывал.

## Источники (открытые в сессии 2026-09-06, если не указано иное)

- CargoWise/eAdaptor: https://chain.io/cargowise-api-documentation/ ; https://www.cargomo.de/articles/cargowise-ehub-vs-e2e-vs-eadapter/ ; https://www.cargowise.com/partners/
- Riege Scope: https://riege.github.io/scope-rest-webservices/ ; https://service.riege.com/en/knowledge/api-interfaces-in-scope ; https://www.riege.com/solutions/integrations-partner ; https://www.riege.com/
- Испанские ERP: https://visualtrans.com/ ; https://deiworld.com/ ; https://www.tmsquatuor.com/ ; https://www.bytemaster.es/en/b-first-erp/ ; https://www.sctrade.es/software-erp-aduanas/
- Taric: https://docs.taric.es/duasql-public/index.html ; https://www.tarictrans.com/pdf/TaricTrans-Aduanas.pdf ; https://www.taric.es/productos-y-servicios/software-aduanas/
- AEAT: https://www3.agenciatributaria.gob.es/Sede/aduanas/entrada-salida-mercancias/declaracion-aduana/formas-presentacion.html ; https://www3.agenciatributaria.gob.es/static_files/common/internet/dep/aduanas/ws.html ; https://sede.agenciatributaria.gob.es/Sede/aduanas.html
- ICS2: https://taxation-customs.ec.europa.eu/customs-4/customs-security/import-control-system-2-ics2-0_en
- PCS: https://www.portic.net/ ; https://portic.net/servicios/pcs/ ; https://portic.net/soporte-tecnico/ ; https://www.valenciaportpcs.com/nuestros-servicios/integracion/ ; https://www.valenciaportpcs.com/soporte/documentacion/guias-para-desarrolladores/ ; https://www.valenciaportpcs.com/valenciaportpcs/tarifas/ ; https://www.valenciaport.com/wp-content/uploads/Tarifas-por-Servicios-Comerciales-2024-Mod.-2024-01-16.pdf
- Трекинг: https://www.terminal49.com/pricing ; https://www.vizionapi.com/ ; https://docs.vizionapi.com/docs/plans ; https://awery.aero/
- Почта/мессенджеры: https://learn.microsoft.com/en-us/graph/throttling-limits ; https://learn.microsoft.com/en-us/graph/outlook-mail-concept-overview ; https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online ; https://developers.google.com/workspace/gmail/api/reference/quota ; https://developers.facebook.com/docs/whatsapp/pricing ; https://whatsappbusiness.com/products/platform-pricing/
- Модели/цены: https://developers.openai.com/api/docs/pricing ; https://claude.com/pricing ; https://platform.claude.com/docs/en/manage-claude/data-residency ; https://claude.com/regional-compliance ; https://ai.google.dev/gemini-api/docs/pricing ; https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/locations ; https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency ; https://mistral.ai/pricing/api ; https://docs.mistral.ai/getting-started/models/models_overview/ ; https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/deployment-types ; https://aws.amazon.com/bedrock/pricing/ ; https://docs.voyageai.com/docs/pricing ; https://cohere.com/pricing ; Skill `claude-api` (кэш 2026-06-24)
- Open-weight/эмбеддинги: HuggingFace API `https://huggingface.co/api/models/<id>` (Llama-3.3-70B, Llama-4, Qwen3/3.5/3.8, Mistral-Small-3.2/4, Mistral-Large-3, gemma-3/4, DeepSeek-V3.2/V4, bge-m3, multilingual-e5, jina v3/v4, Qwen3-Embedding)
- GPU: Scaleway API `https://api.scaleway.com/instance/v1/zones/fr-par-2/products/servers` ; https://www.scaleway.com/en/pricing/gpu/ ; https://www.ovhcloud.com/fr/public-cloud/prices/ ; https://www.hetzner.com/pressroom/new-gex131/ ; https://www.hetzner.com/dedicated-rootserver/gex131/
- OSS-компоненты: GitHub Search API (через MCP) 2026-09-06; PyPI JSON; LICENSE-файлы: onyx, airbyte, nango, langfuse, phoenix, pgvector, n8n, elasticsearch, modelcontextprotocol/servers (raw.githubusercontent.com); Onyx docs https://docs.onyx.app/llms.txt , https://docs.onyx.app/admins/permissions/understanding_permissions.md , https://docs.onyx.app/deployment/miscellaneous/enterprise_edition.md ; https://www.llamaindex.ai/pricing
- Зарплаты: Michael Page «Estudio de Remuneración Tech 2026» https://www.michaelpage.es/sites/michaelpage.es/files/protected-documents/2025-10/Estudio_de_Remuneracio%CC%81n_Tech_2026.pdf ; https://es.talent.com/salary?job=backend+developer+senior ; https://guiasalarial.hays.es/
- Курс: https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml (2026-09-04, USD 1,1622)
- Внутренние: `raw/niche_freight_forwarders.md` (раздел 2, 3), `raw/regulatory_eu_ai_act_gdpr.md` (2.1, 4.2, 5.3)
