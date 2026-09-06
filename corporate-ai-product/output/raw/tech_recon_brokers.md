# Техническая разведка (Блок 5): нишевой ИИ-ассистент для corredurías de seguros (Испания)

Дата сбора: 2026-09-06. Продукт: ассистент класса Glean поверх систем брокера; v1 — «copilot реноваций» + Q&A по условиям полисов; v2 — siniestros. Входные материалы: `niche_insurance_brokers.md` (раздел 2 — системный ландшафт) и `regulatory_eu_ai_act_gdpr.md` (EU-residency провайдеров, DPA/DPIA — здесь не дублирую, ссылаюсь).

Формат чисел: `значение (источник, ссылка, дата)`. Пометки: `[>24 мес]` — опубликовано до сентября 2024; `[НЕТ ИСТОЧНИКА — не для питча]`; «допущение» — моё допущение для расчёта; `[заявлено]` — заявление вендора.

Курс: **€1 = $1,1622** (ECB euro reference rate, https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml, 04.09.2026). Все € ниже пересчитаны по нему.

Ограничение сбора: WebSearch недоступен; поисковики через WebFetch практически не работали (Bing/Bing-RSS отдавали результаты только по первому слову запроса, Brave — 429, DuckDuckGo — captcha, Mojeek/Startpage — блок). Всё ниже — с официальных страниц, открытых напрямую; там, где страница не открылась (503/404/DNS), это прямо сказано.

---

## 1. API и доступ к системам брокера

### 1.1 ERP/«programas de gestión» брокеров

| Система (доля у членов ADECOSE, Barómetro 2025) | Публичный API? | Что подтверждено (источник) | Что закрыто / обходной путь |
|---|---|---|---|
| **MPM Software — segElevia** (53,2 %) | **Публичной документации API не найдено.** | Сайт описывает «integración con host de compañías/bancos», «reglas de negocio configurables para intercambio con aseguradoras», портал eClient, TarifAI, Elevia BOT (MPM, https://www.mpmsoftware.com/es/soluciones/brokers/, прочитано 06.09.2026). Раздел «Integraciones Terceros» перечисляет **9 готовых интеграций**: 3CX (телефония), Chocolate Chatbot (ИИ-чат), DORA (омниканальные siniestros), eEvidence (сертифицированная почта/согласия RGPD), ForceManager (мобильный CRM), IMeureka Market Place, Lleida.net (SMS), Melmacia (ИИ-аналитика), Mensagia (SMS) (MPM, https://www.mpmsoftware.com/es/productos/?t, прочитано 06.09.2026). Т.е. **интеграции делаются по партнёрской программе, а не через self-service API.** MPM в списке «empresas de software adheridas a CIMA» (см. 1.2). | Путь для нас: (а) партнёрство с MPM (как Melmacia/Chocolate) — единственный «чистый» вариант; (б) без партнёрства — **экспорт**: EIAC-файлы, которые segElevia скачивает из CIMA (лежат у брокера), выгрузки в Excel/CSV из отчётов, документы полисов в файловом хранилище/почте; (в) RPA по веб-интерфейсу — крайний вариант, не рекомендую (SaaS, условия использования не проверены). |
| **ebroker** (E2K Global; 16,0 %) | **Не проверено** — сайт https://www.ebroker.es/ и https://ebroker.es/ отдавали HTTP 503 / ошибку SSL при 4 попытках 06.09.2026. | В `niche_insurance_brokers.md`: ebroker — крупнейший технологический оператор по числу подключённых к CIMA (459 corredores). В списке CIMA «software adheridas» (см. 1.2). | Те же обходные пути, что для segElevia: EIAC-файлы + экспорт + документы. Наличие «ebroker API» — [НЕТ ИСТОЧНИКА — не для питча]. |
| **Codeoscopic — Avant2 Sales Manager / Tesis Broker Manager** (3,2 %) | **Да, партнёрский REST API «Integra»**: «API Rest que expone la funcionalidad de los productos Codeoscopic», есть «API Portal — repositorio documental de procesos», инфраструктура AWS; целевые пользователи — «productos Codeoscopic Workspace, aseguradoras y corredores»; доступ через демо/контакт, цены не раскрыты (Codeoscopic, https://codeoscopic.com/en/workspace/integra-en/, прочитано 06.09.2026). | Avant2 подключается к ERP: Tesis (двунаправленно), Winbrok, Opensoft, Gestibrok, LPI, **Gecose**, Click, **Lamb**, Dynamicsoft, **Elevia** — данные производства «se pueden recuperar en formatos VisualSEG y EIAC para subir a tu ERP» (Codeoscopic, https://codeoscopic.com/en/workspace/avant2-en/avant2-erp-connection/, прочитано 06.09.2026). **Вывод: между тарификатором и ERP интеграция файловая (VisualSEG/EIAC), не API** — значит и мы можем работать с теми же файлами. | Аутентификация Integra — не описана публично. Доступ = партнёрский договор. |
| **Gecose** (5,3 %) | Не найдено. Сайт https://www.gecose.es/ отдаёт пустую JS-страницу без текста (06.09.2026). | В списке CIMA «software adheridas»; интегрирован с Avant2 (файлы). | Файлы EIAC/VisualSEG + экспорт. |
| **SoftQS — iSegur** (3,2 %) | Не найдено. https://www.softqs.com/ — только заголовок «Soft QS», JS без текста (06.09.2026). | В списке CIMA «software adheridas». | То же. |
| **Mediator (Terralogía)** | API не упоминается. | Единственный с публичной ценой: **от €99/мес** (≈$115), модульно; «conectividad EIAC — importaciones diarias automáticas de 35+ aseguradoras»; WhatsApp из карточки клиента/полиса; массовые SMS/email; адаптация к DEC 2024 (Mediator, https://www.mediator.es/, прочитано 06.09.2026). В списке CIMA как «Terralogia». | Файлы EIAC (импортирует ежедневно → лежат локально) + экспорт. |
| **Euro Agent Cloud (Lamb Software)** | Не проверено: www.euroagentcloud.com — DNS не резолвится; www.lambsoftware.es — SSL-ошибка (06.09.2026). | В списке CIMA как «Lamb Software»; интегрирован с Avant2. | То же. |

**Общий вывод по ERP:** ни у одного из ERP нет self-service публичного API с открытой документацией; Codeoscopic — единственный с задокументированным существованием партнёрского REST API. Интеграция «в лоб» = партнёрство с вендором (MPM/ebroker закрывают ~70 % сегмента). Без партнёрства данные доступны через **файлы**: EIAC-XML (стандарт, XSD публичны — п. 1.2), VisualSEG-экспорт тарификаторов, Excel-выгрузки отчётов, PDF полисов/условий в хранилище и почте.

### 1.2 EIAC / CIMA (TIREA) — ключевой пункт

**Формат и документация — публичны и бесплатны.** На странице «Mundo EIAC → Biblioteca EIAC» без логина скачиваются (CIMA, https://www.cimaseg.es/mundo-eiac/, прочитано 06.09.2026; ссылки на файлы извлечены из HTML):
- Documentos Estándar V07.1 — `209_IAC_ESP_DOC_DOCS-ESTANDAR-EIAC-V07-1_V05.pdf` (wp-content/uploads/2026/07/);
- **XSD + примеры XML V07.1** — `XML-V07-1_V05.zip` (2026/07) и предыдущая `XML-V07-1_V04.zip` (2026/03);
- Diccionario de datos V06 — `209_IAC_ESP_DOC_DICCIONARIO_DATOS_V06.pdf`;
- Normas de uso V07.1 — `209_IAC_ESP_DOC_NORMAS-USO-V07-1_V03-1.pdf`;
- аналогичный пакет для V06 («ACTUALIZADO»).
- «La autoría de estos estándares corresponde al sector, que los pone a disposición de Entidades y Corredores para su libre uso» (там же).

**Объекты/процессы:** pólizas, recibos, liquidaciones, siniestros; nueva producción, cartera, suplementos, anulaciones, движения recibos, alta siniestros, liquidación cuenta de efectivo, cargas masivas. Что нового в 7.1: модернизация типов покрытий/классификации рисков, коллективные полисы, стандартизация движений recibos, новый процесс **«Mensajes» для siniestros** («enviar notas de tramitación y referenciar documentación»). **С Q4 2026 версии 6.0 и 7.1 работают параллельно, CIMA даёт инструменты конверсии** (CIMA, https://www.cimaseg.es/eiac-version-7-1/, прочитано 06.09.2026). Сейчас corredurías через CIMA работают с версиями **V5/V6** (CIMA, https://www.cimaseg.es/para-quien/corredores/, прочитано 06.09.2026).

**Как брокер получает файлы (три пути, дословно со страниц CIMA):**
1. **«Si dispones de software de mercado»** — ERP-вендор уже подключён к CIMA единым соединением; брокер подписывает контракт с TIREA, в портале CIMA настраивает **свои учётные данные к каждой страховщице** («configurar en nuestro Portal sus credenciales de acceso a cada una de las entidades»), после чего файлы приходят в ERP через CIMA (CIMA, https://www.cimaseg.es/para-quien/empresas-de-software/, 06.09.2026).
2. **«Si dispones de software propio»** — брокер сам делает «la integración de los distintos métodos WS necesarios para poder conectarte» (корредорес-страница, 06.09.2026). Т.е. **интеграция — через Web Service (SOAP/WS-методы), спецификация выдаётся по запросу**, публично не выложена. FAQ: «Es el Web Service que se facilita a aseguradoras, corredores y soluciones software para la mediación, para que conecten con CIMA» (CIMA FAQ, https://www.cimaseg.es/faqs/, 06.09.2026).
3. **«Si no dispones de software»** — логин в портал CIMA: «Visualizar el contenido de cada fichero, descargarlos en XML o en Microsoft Excel», уведомления, «Consultas de pólizas, recibos, siniestros o liquidaciones», «Transformaciones» (корредорес-страница, 06.09.2026).

**Для сторонних разработчиков (empresas de software):** «Contacta con nosotros y te proporcionaremos el método de acceso propuesto con todas las garantías… Será necesario firmar con TIREA un contrato de prestación de servicio»; CIMA сама проводит тесты со страховщиками и назначает день переключения. **Требования «аккредитации/гомологации» не упоминаются** — по Póliza Digital прямо: вендор «contacta con CIMA para documentación técnica, integra los métodos WS, activa el módulo para sus clientes» (CIMA, https://www.cimaseg.es/poliza-digital/como-adherirse/, 06.09.2026). **Тарифы CIMA публично не раскрыты** («solicita sin compromiso el contrato, para poder valorarlo») — [цена: НЕТ ИСТОЧНИКА].

**Кто уже подключён (CIMA, 06.09.2026):** 30 софт-компаний в списке adheridas — AUNNA TECH, Click!, codeoscopic, Dynamic Soft, ebroker, Gecose Software, gestibrok, imeureka, INFONET, INFORMÁTICA ACTIVExSOFT, INTRASOFT, Lamb Software, LIF SISTEMAS, MICROMAQ, mn program, **mpm**, OPENFARM, OpenSoft, póliza informática, seQurnet, SHOPNET BROKERS (SNB), SIMS, Sinkroniza, SNB, Soft QS, TAAF, Terralogia, Weecover (https://www.cimaseg.es/para-quien/empresas-de-software/). Страховщиков «operativas» — 39 (Allianz, AXA, Generali, Helvetia, Mapfre, Occident, Reale, Zurich, Caser, DKV, Fiatc, Hiscox, Santalucía, SegurCaixa Adeslas и др.), «adheridas» — 50 (в т.ч. Mutua Madrileña, Pelayo, Sanitas), «en febrero de 2026 se está trabajando para incorporar el resto» (https://www.cimaseg.es/para-quien/aseguradoras/, 06.09.2026). Оператор — TIREA S.A. (Las Rozas, Madrid), 165+ страховых компаний-участников платформы (TIREA, https://www.tirea.es/, 06.09.2026). Протокол безопасности «Protocolo de Seguridad y GDPR CIMA» с учётом DORA; сектор-инициатива с января 2025 «con 7 Entidades Aseguradoras y 5 Empresas Tecnológicas» (FECOR, https://www.fecor.es/eiac-fecor/, 06.09.2026).

**Что это значит для продукта:**
- **MVP: не подключаться к CIMA вовсе.** Файлы EIAC уже скачаны ERP брокера и лежат у него (каталог импорта ERP / SFTP / портал CIMA «descargar XML»). Парсим XML по публичным XSD 6.0/7.1 → структурированная база pólizas/recibos/siniestros/liquidaciones. Плюс «Transformaciones/Excel» из портала как запасной вход. Стоимость интеграции — только парсер + маппинг «свободных полей» (в Barómetro задокументировано, что страховщики кладут разные данные в свободные теги — нужен маппинг per-insurer).
- **Этап 2: стать «software propio/empresa de software» в CIMA** — контракт с TIREA, интеграция WS-методов, брокер вносит нас как свою технологическую компанию. Это даёт прямой поток файлов и, важно, **Póliza Digital** (входящие запросы на e-подпись от страховщиков) и «Mensajes» siniestros в 7.1 — основа для v2.
- Риск: TIREA/CIMA принадлежит страховому сектору; условия контракта/цены/сроки тестирования не публичны — закладывать 2–4 месяца на подключение (допущение).

### 1.3 Экстранеты страховщиков

- **Публичных developer-порталов для брокерского канала в Испании не найдено.** Проверено 06.09.2026: `developer.mapfre.com` — HTTP 503; `developer.axa.com` — 503; `developer.allianz.com` и `developer.zurich.com` — DNS не резолвится; `www.axa.es/mediadores`, `www.allianz.es/mediadores.html`, `www.reale.es/es/mediadores`, `www.generali.es/mediadores` — 404. Корпоративный сайт Mapfre упоминаний API/партнёрского портала для mediadores не содержит (https://www.mapfre.com/en/, 06.09.2026).
- **Zurich España**: «área profesional para mediadores» — вход через `login.zurich.es/auth/realms/emp-inter/protocol/openid-connect/auth` (Keycloak/OIDC), без публичных условий использования и без упоминания API (https://www.zurich.es/mediadores, 06.09.2026). Это типовой случай: **экстранет = веб-портал за логином**.
- Отраслевой «API» страховщиков для брокеров — это и есть **EIAC через CIMA** (страховщики «начали отключать любые другие способы работы, кроме CIMA» — ADECOSE 2025, см. niche-файл). Всё, чего нет в EIAC (статус siniestro в реальном времени, оферта реновации в PDF, suplementos), приходит **почтой** («buzones») или лежит в экстранете.
- **RPA/скрейпинг экстранетов:** условия использования порталов недоступны без логина — проверить нельзя; юридически это зона риска (договорные запреты на автоматизированный доступ, учётные данные сотрудника, secreto profesional art. 188 RDL 3/2020). Судебная практика по screen-scraping в ЕС/Испании (дело Ryanair v PR Aviation, CJEU C-30/14; испанские дела Ryanair против агрегаторов) — страницы не открылись → [НЕТ ИСТОЧНИКА — не для питча]. **Рекомендация:** RPA только как «ассистент под сессией пользователя» (браузерное расширение, действует от имени залогиненного сотрудника, без хранения его паролей у нас), и не в MVP.

### 1.4 Почта, файлы, подпись, WhatsApp

**Microsoft Graph (M365)** — основной коннектор для почты/документов (доля M365 vs Google в corredurías не измерена — см. niche-файл):
- Модель доступа: delegated (от имени пользователя) vs application (без пользователя; для `Mail.Read`, `Files.Read.All`, `Sites.Read.All` нужен admin consent) (Microsoft Learn, https://learn.microsoft.com/en-us/graph/auth/auth-concepts, обновлено 06.08.2025).
- **Ограничение доступа приложения к конкретным ящикам** — «RBAC for Applications in Exchange Online» (заменяет Application Access Policies): роли `Application Mail.Read`, `Application MailboxItem.Read` и т.д. с `-CustomResourceScope`/Admin Unit; важно снять unscoped-грант в Entra, иначе объединение даёт полный доступ (Microsoft Learn, https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac, обновлено 21.08.2026). Это закрывает требование «индексировать только ящики producción/renovaciones, не dirección».
- **Delta queries** поддерживаются для `message`, `mailFolder`, `mailboxItem`, `driveItem`, `listItem`, `site`, `user`, `group`; токены для Outlook-сущностей живут «пока хватает кэша», для directory — 7 дней; возможны replays и `410 Gone` (полная пересинхронизация) (Microsoft Learn, https://learn.microsoft.com/en-us/graph/delta-query-overview, обновлено 14.05.2026).
- **Лимиты**: Graph глобально — 130 000 запросов/10 с на приложение по всем тенантам; identity-сервис 3 500–8 000 RU/10 с на приложение на тенант (Microsoft Learn, https://learn.microsoft.com/en-us/graph/throttling-limits, 06.09.2026). **SharePoint/OneDrive** — на приложение на тенант (0–1 000 лицензий): **1 200 000 RU/24 ч и 1 250 RU/мин**; delta с токеном = 1 RU, list children = 2 RU, permissions = 5 RU; на пользователя 3 000 запросов/5 мин; поиск с app-only `Sites.Read.All` — 25 req/s; «использование SharePoint как промежуточного хранилища между M365 и другим репозиторием — unsupported use case» (Microsoft Learn, https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online, обновлено 10.08.2026). Для брокера 40 чел. с 3 000 полисов × ~5 файлов это ~15–30 тыс. RU на полный первичный обход — укладывается в суточный лимит с запасом.
- **Outlook add-in** (интерфейс «рядом с письмом»): один манифест + JS/HTML для web, new/classic Outlook Windows, Mac, iOS/Android; task pane, read/compose режимы, event-based activation; не активируется на IRM-защищённых письмах на мобильных и на .msg-вложениях; распространение через Microsoft Marketplace или sideload/admin (Microsoft Learn, https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/outlook-add-ins-overview, 26.02.2026).

**Google Workspace**: Gmail API — 1 200 000 quota units/мин на проект, 6 000/мин на пользователя; `messages.get` = 20 ед., `messages.list` = 5, `history.list` = 2 (Google, https://developers.google.com/workspace/gmail/api/reference/quota, 06.09.2026). Drive API — 1 000 000 ед./мин на проект, 325 000/мин на пользователя; `files.get` 5 ед., `files.list` 100, download 200 (Google, https://developers.google.com/workspace/drive/api/guides/limits, 06.09.2026).

**Signaturit** (22,5 % corredurías ADECOSE): REST API v3, **OAuth2 Bearer**, prod `https://api.signaturit.com/v3`, sandbox `https://api.sandbox.signaturit.com/v3` (бесплатный, отдельные креды); эндпоинты signatures (create/list/get/cancel), скачивание подписанного PDF и **audit trail**, подписки на события/webhooks (`events_url`); rate limits не документированы (Signaturit, https://docs.signaturit.com/api/latest, 06.09.2026). Для нас — читать статус подписи и подписанные PDF в досье полиса.

**WhatsApp Business Platform (Meta Cloud API)**: с 1 июля 2025 — **тариф за сообщение** (не за conversation): категории marketing / utility / authentication; **service-сообщения бесплатны**, utility внутри 24-часового окна — бесплатны; Испания — отдельный рынок в rate card (Meta, https://developers.facebook.com/docs/whatsapp/pricing, 06.09.2026; https://whatsappbusiness.com/products/platform-pricing/, 06.09.2026 — конкретные ставки для Испании только в интерактивном калькуляторе, не извлечены → [цифры: НЕТ ИСТОЧНИКА]). Для сценария «клиент пишет — брокер отвечает в окне» стоимость ≈ 0; платные — только исходящие шаблоны (напоминание о реновации = utility/marketing).

### 1.5 Реалистичные коннекторы для MVP

| # | Коннектор | Готовность | Что даёт для copilot реноваций |
|---|---|---|---|
| 1 | **M365: Exchange Online (Graph Mail, app-only + RBAC-scope) + SharePoint/OneDrive (Graph driveItem delta)** — или Google Workspace как альтернатива | API стабильный, документация полная, лимитов хватает | оферты реновации от страховщиков (письма+PDF), переписка с клиентом, условия/DIP/пóлизы в файлах |
| 2 | **EIAC-файлы (XML v6.0/7.1)** из каталога ERP/SFTP/портала CIMA — парсер по публичным XSD | XSD публичны; интеграции с CIMA не требуется | cartera с датами vencimiento, recibos (история платежей/премий), siniestros по полису, liquidaciones |
| 3 | **Экспорт из segElevia/ebroker** (Excel/CSV отчёты, файловые выгрузки) — ручной/расписанием | зависит от брокера; без API | справочник клиентов/полисов, ответственные сотрудники (для разграничения доступа) |
| (4) | Signaturit API | готов, OAuth2 | статус подписи, подписанные PDF |
| (5) | WhatsApp Cloud API | готов | канал уведомлений/черновиков клиенту (v1.5) |

**Требует партнёрства с вендором:** двусторонняя интеграция с segElevia/ebroker (создание задач, запись результатов реновации в ERP, чтение через API) — MPM и E2K; подключение к CIMA как «empresa de software» — TIREA; Codeoscopic Integra — для брокеров на Avant2/Tesis.

---

## 2. Размещение моделей и стоимость инференса

### 2.1 Облачные модели с EU-размещением (цены на 06.09.2026, $/1M токенов)

| Провайдер / модель | Input | Output | Кэш/батч | EU-размещение | Источник |
|---|---|---|---|---|---|
| **Anthropic Claude Sonnet 5** | **$2** | **$10** | cache read $0,20; batch −50 % | Первопартийный API: `inference_geo` только `"us"` (×1,1) и `"global"`; **EU-опции нет**; workspace geo — только `"us"` (Anthropic, https://platform.claude.com/docs/en/manage-claude/data-residency, 06.09.2026). **EU — через Amazon Bedrock**: регионы eu-central-1 (Frankfurt), eu-west-1 (Ireland, in-region), eu-north-1 (Stockholm, in-region), eu-south-2 (**Spain**), eu-west-3 (Paris), eu-central-2, eu-south-1, eu-west-2 — profile «EU»; **региональные эндпоинты +10 %** к цене; модели Fable 5.1/5, Opus 5/4.8/4.7, Sonnet 5, Haiku 4.5 (Anthropic, https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock, 06.09.2026). Google Cloud: global / multi-region / regional, regional +10 % (Anthropic, https://platform.claude.com/docs/en/about-claude/pricing, 06.09.2026). | Anthropic pricing (та же страница, 06.09.2026); Skill `claude-api` (кэш 24.06.2026) |
| Claude Opus 5 | $5 | $25 | cache read $0,50 | то же | там же |
| Claude Haiku 4.5 | $1 | $5 | cache read $0,10 | то же (Bedrock EU) | там же |
| Claude Fable 5.1 | $10 | $50 | cache read $0,25 | Bedrock regional пока только us-east-1 | там же |
| **OpenAI gpt-5.4** | $2,50 | $15 | cache −90 %; batch −50 % | EU data residency через `eu.api.openai.com` (см. regulatory-файл); **+10 % для моделей, выпущенных с 05.03.2026** («Regional processing… charged a 10 % uplift») | OpenAI, https://developers.openai.com/api/docs/pricing, 06.09.2026 |
| OpenAI gpt-5.6-terra / gpt-5.6-sol | $2 / $4 | $12 / $20 | | то же | там же |
| OpenAI gpt-5.4-mini | $0,75 | $4,50 | | то же | там же |
| OpenAI gpt-5.6-luna | $0,20 | $1,20 | | то же | там же |
| OpenAI text-embedding-3-large / -small | $0,13 / $0,02 | — | | eu-endpoint поддерживает embeddings (regulatory-файл) | там же |
| **Azure OpenAI (Foundry)** | = OpenAI + региональные тарифы | | Provisioned/Data Zone | В Foundry доступны gpt-5.6 (sol/terra/luna), gpt-5.5, gpt-5.4 (+mini/nano), gpt-5.x; типы деплоя Standard (регион) / **Data Zone** / Global; Sweden Central — стандартный EU-регион (fine-tuning table) (Microsoft Learn, https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure, 04.09.2026). Полная матрица EU-регионов per model — не извлечена (отдельная страница region-availability) → проверить перед питчем. | |
| **Google Gemini 2.5 Flash** | $0,30 | $2,50 | | Gemini API (developer) — EU-residency не упомянут на странице цен; Vertex data-residency страница не открылась → **EU-residency Gemini [не подтверждено]** | Google, https://ai.google.dev/gemini-api/docs/pricing, 06.09.2026 |
| Gemini 3.5 Flash / 3.5 Flash-Lite | $1,50 / $0,30 | $9 / $2,50 | | | там же |
| Gemini 3.1 Pro Preview / 2.5 Pro | $2 / $1,25 | $12 / $10 | | | там же |
| Gemini Embedding 2 / Gemini Embedding | $0,20 / $0,15 | — | | | там же |
| **Mistral Medium 3.5** | $1,50 | $7,50 | batch −50 %, cache −90 % | **«Regional Inference: +10 % for EU or global endpoints»**; Studio: «Deploy across cloud and on-prem… Nothing leaves your perimeter» (self-hosted), dedicated (Mistral, https://mistral.ai/products/la-plateforme, 06.09.2026) | Mistral, https://mistral.ai/pricing/api, 06.09.2026 |
| Mistral Small 4 (Apache 2.0) | $0,15 | $0,60 | | | там же |
| Mistral Large 3 (Apache 2.0) | $0,50 | $1,50 | | | там же |
| Ministral 3 (3B/8B/14B) | $0,10 / 0,15 / 0,20 | = input | | | там же |
| Codestral | $0,30 | $0,90 | | | там же |
| Mistral OCR 4.1 / Document AI | **$4 / 1 000 стр.** / $5 / 1 000 стр. | | | | там же |
| Mistral Embed / Codestral Embed | $0,10 / $0,15 | — | | | там же |
| **OVHcloud AI Endpoints** (EU, управляемые open-weight; €/1M, без НДС) | Llama-3.3-70B €0,67/€0,67 (≈$0,78); Qwen3-32B €0,08/€0,23; Mistral-Small-3.2-24B €0,09/€0,28; gpt-oss-120b €0,08/€0,40; Qwen3-Embedding-8B €0,10; **bge-m3 €0,01** | | | EU-датацентры OVH | OVHcloud, https://www.ovhcloud.com/en-ie/public-cloud/prices/, 06.09.2026 |
| Voyage embeddings | voyage-4-large $0,12; voyage-4 $0,06; voyage-4-lite $0,02; rerank-3 $0,05 | | | EU не указано | Voyage, https://docs.voyageai.com/docs/pricing, 06.09.2026 |
| Cohere Embed 4 / Rerank | Model Vault: от $4/ч или $2 500/мес; private deployments | | | on-prem/VPC | Cohere, https://cohere.com/pricing, 06.09.2026 |

Партнёрские платформы: Bedrock EU (Frankfurt/Ireland/Zurich/Paris) — цены Claude 3.5 Sonnet те же, что в US; Llama 3.3 70B $0,40/$2,00; Mistral Large 3 $0,50/$1,50; для open-моделей EU-регионы «на 10–30 % дороже US» (AWS, https://aws.amazon.com/bedrock/pricing/, 06.09.2026 — страница отдала только часть таблиц).

### 2.2 Open-weight для локального размещения

| Модель | Лицензия (HF API, 06.09.2026) | Примечание |
|---|---|---|
| Llama 3.3 70B Instruct | `llama3.3` (Meta community) | «Built with Llama», лимит 700M MAU |
| Llama 4 Scout/Maverick | `other` = Llama 4 Community License: коммерческое использование разрешено; >700M MAU — отдельная лицензия; **«Built with Llama»** и префикс «Llama» в именах производных; **явного исключения EU-компаний в тексте лицензии нет** (Meta, https://developer.meta.com/ai/llama4/license/, 06.09.2026) | |
| **Qwen3-235B-A22B / Qwen3-32B** | **Apache-2.0** | |
| **Qwen3-Embedding-8B** (+4B/0.6B) | **Apache-2.0**; MTEB multilingual **70,58** vs gemini-embedding-exp 68,37, multilingual-e5-large-instruct 63,22, **bge-m3 59,56**; 100+ языков (HF, https://huggingface.co/Qwen/Qwen3-Embedding-8B, 06.09.2026) | лучший open-weight для испанского по MMTEB |
| Mistral Small 3.2 24B / Mistral Large 3 675B | **Apache-2.0** | |
| Gemma 3 27B | `gemma` — не OSI, есть Prohibited Use Policy; коммерческое использование разрешено; на странице условий отмечено, что **Gemma 4 — Apache 2.0** (Google, https://ai.google.dev/gemma/terms, 06.09.2026) | |
| DeepSeek V3.1 / V3.2 | **MIT** | |
| bge-m3 | **MIT**; 100+ языков; 8 192 токена; dense+sparse+colbert (HF, https://huggingface.co/BAAI/bge-m3, 06.09.2026) | |
| multilingual-e5-large | MIT | |
| jina-embeddings-v3 | **CC-BY-NC-4.0 — коммерчески нельзя без лицензии** | jina-v4 — тег лицензии отсутствует |

**GPU для 70B (арифметика, допущение):** FP16 ≈ 140 ГБ весов → 2×H100 80 ГБ; FP8 ≈ 70 ГБ → 1×H100 «впритык» (мало места под KV-кэш при 6k-контексте и батче); INT4/AWQ ≈ 35–40 ГБ → 1×L40S 48 ГБ или 1×H100 с запасом. vLLM поддерживает tensor-parallel и квантование (Apache-2.0, 91 052★, последний релиз v0.28.0 26.08.2026 — GitHub, https://github.com/vllm-project/vllm/releases, 06.09.2026). Практично для ниши: **Qwen3-32B (Apache) или Mistral Small 3.2 24B (Apache) на 1×L40S/1×A100** — испанский на уровне, лицензия чистая.

**Аренда GPU в ЕС (без НДС, 06.09.2026):**
| Провайдер | Инстанс | €/ч | ≈ €/мес | ≈ $/мес | Источник |
|---|---|---|---|---|---|
| OVHcloud (EU) | h100-1-gpu (H100 80 GB) | 3,10 | 2 263 | 2 630 | https://www.ovhcloud.com/en-ie/public-cloud/prices/ |
| OVHcloud | a100-180 (1×A100 80 GB) | 2,75 | **1 100 (monthly)** | 1 278 | там же |
| OVHcloud | a100-360 (2×A100 80 GB) | 5,50 | **2 200 (monthly)** | 2 557 | там же |
| OVHcloud | l40s-1-gpu (L40S 48 GB) | 1,55 | 1 131,5 | 1 315 | там же |
| OVHcloud | l4-1-gpu (L4 24 GB) | 0,83 | 605,9 | 704 | там же |
| OVHcloud | h200-4-gpu | 23,12 | 16 877,6 | 19 615 | там же |
| Scaleway (PAR-1) | L4-1-24G | 0,79 | 574,87 | 668 | https://www.scaleway.com/en/pricing/gpu/ |
| Scaleway (PAR-2) | H100-1-80G / H100-2-80G / L40S-1-48G | — | — | — | есть в PAR-2, цены на странице не отрендерились → [не извлечено] |
| Hetzner | GEX131 (RTX PRO 6000 Blackwell 96 GB, 256 GB RAM; HEL1/FSN1), GEX45 (RTX PRO 4000 24 GB) | — | — | — | https://www.hetzner.com/dedicated-rootserver/gex131/ — цена JS, не извлечена; **H100 у Hetzner нет** («Our GEX servers use NVIDIA RTX GPUs») |

### 2.3 Оценка стоимости инференса на одну correduría в месяц

**Допущения (заданы + мои):** 40 сотрудников × 30 запросов/день × 20 дней = **24 000 запросов/мес**; запрос = 6 000 входных (RAG-контекст) + 500 выходных токенов → **144 M input + 12 M output**. Реновации: 250/мес × 40 000 токенов = 10 M; допущение: 90 % input / 10 % output → **9 M in + 1 M out**. Индексация: 3 000 полисов × 30 стр. × **500 токенов/стр. (допущение)** = 45 M + 20 000 писем × **1 000 токенов (допущение)** = 20 M → **65 M токенов эмбеддингов** (это полная переиндексация; инкрементально в 5–10 раз меньше). Prompt-caching: допущение — 50 % входных токенов Q&A попадают в кэш (системный промпт + повторяющиеся документы).

**Формулы:** `Cost_QA = 144M×P_in + 12M×P_out`; `Cost_QA_cache = 72M×P_in + 72M×P_cache + 12M×P_out`; `Cost_renov = 9M×P_in + 1M×P_out`; `Cost_emb = 65M×P_emb`; `Cost_EU = Cost × 1,10` (региональная надбавка Bedrock/OpenAI-EU/Mistral-EU).

| Вариант | Модель (цена in/out) | Q&A без кэша | Q&A с кэшем | Реновации | Эмбеддинги | **Итого/мес (без кэша → с кэшем)** | +10 % EU |
|---|---|---|---|---|---|---|---|
| (a) премиум | Claude Sonnet 5 ($2/$10; cache $0,20) | $288+$120 = $408 | $144+$14,4+$120 = $278 | $18+$10 = $28 | text-emb-3-large $8,5 / voyage-4 $3,9 | **$445 → $315** | **$490 → $345** |
| (a′) премиум-макс | Claude Opus 5 ($5/$25) | $720+$300 = $1 020 | $360+$36+$300 = $696 | $45+$25 = $70 | $8,5 | **$1 100 → $775** | $1 210 → $850 |
| (a″) премиум OpenAI | gpt-5.4 ($2,5/$15) | $360+$180 = $540 | $180+$18+$180 = $378 | $22,5+$15 = $37,5 | $8,5 | **$586 → $424** | $645 → $466 |
| (b) дешёвая | Claude Haiku 4.5 ($1/$5) | $144+$60 = $204 | $72+$7,2+$60 = $139 | $9+$5 = $14 | $8,5 | **$227 → $162** | $250 → $178 |
| (b) | gpt-5.4-mini ($0,75/$4,5) | $108+$54 = $162 | ≈$113 | $11,25 | $8,5 | **$182 → $133** | $200 → $146 |
| (b) | Gemini 2.5 Flash ($0,30/$2,50) | $43+$30 = $73 | — | $5,2 | Gemini Emb $9,75 | **$88** | (EU не подтверждён) |
| (b) | Mistral Small 4 ($0,15/$0,60) | $21,6+$7,2 = $29 | — | $2 | Mistral Embed $6,5 | **$37** | $41 |
| (b) | gpt-5.6-luna ($0,20/$1,20) | $28,8+$14,4 = $43 | — | $3 | $8,5 | **$55** | $60 |
| (b-EU-open) | OVH AI Endpoints Llama-3.3-70B (€0,67/€0,67) | €102,5+€8 = €111 | — | €6,7 | bge-m3 €0,65 | **€118 ≈ $137** | уже EU |
| (b-EU-open) | OVH AI Endpoints Qwen3-32B (€0,08/€0,23) | €11,5+€2,8 = €14,3 | — | €1 | €0,65 | **€16 ≈ $19** | уже EU |
| (c) self-hosted 70B | 2×A100 80 GB OVH €2 200/мес (monthly) + 30 % на ops/мониторинг (допущение) = €2 860 ≈ $3 324/мес на узел | | | | bge-m3 на том же GPU | **N=1: $3 324; N=5: $665; N=10: $332; N=20: $166** на клиента | уже EU |
| (c′) self-hosted 70B on-demand | 2×H100 OVH 2×€2 263 = €4 526 + 30 % = €5 884 ≈ $6 838/мес | | | | | **N=1: $6 838; N=10: $684; N=20: $342** | уже EU |
| (c″) self-hosted 24–32B | 1×L40S OVH €1 131 + 30 % = €1 470 ≈ $1 709/мес | | | | | **N=1: $1 709; N=5: $342; N=10: $171** | уже EU |

**Пропускная способность узла (допущение, источника с бенчмарком не нашёл — NVIDIA NIM benchmarking-страница отдала 404/пусто):** нагрузка одного брокера — 166 M токенов/мес, из них ~153 M prefill; при агрегатной prefill-скорости 10 k ток/с на 2×GPU это ~4,3 GPU-часа/мес, decode 13 M при 1 k ток/с — 3,6 ч. Ограничение — не объём, а **пиковая конкурентность в рабочие часы** (40 чел. × 30 запросов за ~8 ч ≈ 2,5 запроса/мин на брокера). Узел 2×A100/H100 с vLLM комфортно обслуживает **~10 брокеров** (допущение) → строка N=10.

**Выводы:** (1) даже премиальная модель — **$300–500/мес на брокера** (≈ $8–12 на сотрудника/мес) — это ≤10 % от типового чека $50–100/пользователь/мес; (2) дешёвый тир — $20–230; (3) self-hosted окупается только при ≥5–10 клиентах на узел или при отдельно оплаченном on-prem-дистрибутиве; для single-tenant on-prem у одного брокера ($1,7–3,3 k/мес) — дороже облака, но продаётся как «данные не покидают периметр» (56,4 % брокеров не доверяют страховщикам с данными — ADECOSE 2025); (4) базовый выбор для MVP — **Claude Sonnet 5 через Bedrock EU (eu-west-1/eu-south-2) для реноваций и сложных ответов + Haiku 4.5 / Qwen3-32B на OVH для классификации и черновой обработки; эмбеддинги — Qwen3-Embedding-8B или bge-m3 self-hosted/OVH** (€0,01/M — эмбеддинги практически бесплатны).

---

## 3. Готовые компоненты (open-source) — зрелость, лицензия, берём/пишем

Метаданные GitHub (звёзды, лицензия, `pushed_at`) — через GitHub search API 06.09.2026; теги релизов — со страниц `/releases` (год на странице не отображается; активность подтверждена `pushed_at`).

| Компонент | Лицензия | Зрелость (★, последний push / релиз) | Берём / пишем своё | Почему |
|---|---|---|---|---|
| **Коннекторы / ingestion** | | | | |
| Onyx (ex-Danswer) | **MIT (CE) + EE-папки под отдельной лицензией**; EE: SSO OIDC/SAML, **«Permission Syncing — automatically inherit user permissions from external systems»**, group-based access, RBAC, whitelabel, analytics (Onyx docs, https://docs.onyx.app/deployment/miscellaneous/enterprise_edition.md, 06.09.2026); коннекторы Gmail, Google Drive, SharePoint (с «optional permission sync» через сертификат), Confluence, Slack, Teams (docs.onyx.app/llms.txt, 06.09.2026); «50+ connectors», Lite/Standard режимы, Docker/K8s/Helm | 31 942★, push 06.09.2026, релиз v4.7.0 (5 сент.) | **Берём как референс/ускоритель ingestion, не как ядро** | Permission sync и группы — в EE (цена self-hosted не опубликована); ядро продукта — доменные объекты (póliza/recibo/siniestro/EIAC), которых в Onyx нет; UI — общий чат, не workflow реноваций |
| Airbyte | **ELv2 (только)** — запрет «hosted or managed service» (GitHub LICENSE, https://github.com/airbytehq/airbyte/blob/master/LICENSE, 06.09.2026) | 21 995★, push 05.09.2026 | Не берём | ELv2 неудобна для встраивания в SaaS; коннекторов к ERP брокеров всё равно нет |
| Nango | Elastic License; 900+ API; self-host допускается с ограниченным функционалом (GitHub, https://github.com/NangoHQ/nango, 06.09.2026) | 11 739★, push 04.09.2026 | Опционально для OAuth-менеджмента (M365/Google/Signaturit) | Экономит недели на токенах/рефрешах; ELv2 — оценить с юристом |
| Composio | MIT | 30 075★, push 06.09.2026 | Не берём для MVP | Ориентирован на SaaS-инструменты агентов, не на M365-индексацию с ACL |
| Merge.dev / Paragon (коммерческие) | Merge: 3 linked accounts бесплатно, далее **$650/мес до 10 аккаунтов ($65/доп.)**, категории File Storage/CRM/Ticketing/ATS/HRIS/Accounting, «Merge for EU» (https://www.merge.dev/pricing, 06.09.2026); Paragon — только «Get a quote», self-host/forward-deploy в Enterprise (https://www.useparagon.com/pricing, 06.09.2026) | — | Не берём | Нет коннекторов к ERP брокеров/EIAC; M365/Google мы делаем сами |
| **Парсинг PDF полисов** | | | | |
| **Docling (IBM)** | **MIT**; PDF/DOCX/PPTX/XLSX/HTML/EML/MSG/изображения; layout, reading order, **table structure**, OCR (GitHub, https://github.com/docling-project/docling, 06.09.2026) | 66 048★, push 04.09.2026, релиз v2.126.0 | **Берём (основной)** | Таблицы условий/franquicias/capitales — ключ; MIT; локально (данные не уходят) |
| Unstructured | Apache-2.0 | 15 399★, push 05.09.2026, релиз 0.27.5 | Запасной | |
| MarkItDown (Microsoft) | MIT | 178 383★, push 04.09.2026 | Для DOCX/XLSX/EML быстрый путь | |
| Mistral OCR 4.1 | Premier (API) | $4/1 000 стр. → 90 000 стр./мес = **$360/мес** (первичная), далее инкрементально | Для сканов/факсов страховщиков | Качество на испанских сканах — тестировать |
| LlamaParse | коммерч.; 1 000 credits = $1,25, «as low as 1 credit/page»; планы Free 10K / Starter $50 / Pro $500; EU-endpoint упомянут (https://www.llamaindex.ai/pricing, 06.09.2026) | — | Не берём | Docling+Mistral OCR закрывают |
| Azure Document Intelligence | коммерч.; F0 0–500 стр./мес бесплатно; цены на странице скрыты за селектором региона (https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/, 06.09.2026) | — | Не берём в MVP | Цены не извлечены |
| **Permission-aware поиск / хранилища** | | | | |
| Elasticsearch | **AGPL-3.0 / SSPL / ELv2 (тройная)**, x-pack только ELv2 (GitHub LICENSE.txt, 06.09.2026); **DLS (document-level security)** через role query с Mustache `{{_user.username}}`; ограничения: read-only, не все запросы, утечка через агрегации (Elastic docs, https://www.elastic.co/docs/deploy-manage/users-roles/cluster-or-deployment-auth/controlling-access-at-document-field-level, 06.09.2026) | 77 902★ | Не берём | Лицензионная сложность; DLS-через-роли негибок для «по клиентам» |
| OpenSearch | Apache-2.0 | 13 666★, push 05.09.2026 | Кандидат для гибридного поиска (BM25+kNN) | Apache; DLS есть |
| **Qdrant** | **Apache-2.0** | 34 402★, push 05.09.2026, релиз v1.19.1 | **Берём (вектор + payload-фильтры)** | Фильтрация по `tenant_id/client_id/role` на уровне запроса; Rust; single-binary |
| pgvector | PostgreSQL License («Other» в GitHub) | 22 923★, push 20.08.2026 | **Берём для MVP вместо Qdrant, если <1–2 M чанков** | Одна БД (Postgres) = проще ACL (row-level security) и аудит |
| Weaviate / Vespa | BSD-3-Clause / Apache-2.0 | 16 785★ / 7 077★ | Не берём | Избыточно |
| **OpenFGA** | Apache-2.0 | 5 714★, релиз v1.19.0 25.08.2026 | Берём на этапе 2 (ReBAC: сотрудник→клиент→полиза→документ) | Zanzibar-модель точно ложится на «кто ведёт какого клиента» |
| Cerbos | Apache-2.0 | 4 575★, push 03.09.2026 | Альтернатива (ABAC-политики) | |
| Microsoft Graph permission trimming | — | — | **Берём**: RBAC for Applications + чтение `permissions` driveItem (5 RU) для зеркалирования ACL | см. 1.4 |
| **Оркестрация агентов** | | | | |
| **LangGraph** | MIT | 41 110★, push 06.09.2026 | **Берём** для графа «собрать досье → сравнить → черновик → ждать одобрения» | Checkpointing, human-in-the-loop прерывания |
| LlamaIndex | MIT | 52 032★, релиз v0.14.24 19.08.2026 | Частично (readers, node parsers) | |
| Haystack | Apache-2.0 | 26 429★, релиз v3.1.1 | Альтернатива LangGraph | |
| **Pydantic AI** | MIT | 19 743★, релиз v2.40.0 04.09.2026 | **Берём** для типизированных структурированных выходов (RenewalComparison, PolicyTerms) | Строгие схемы = меньше галлюцинаций в числах |
| OpenAI Agents SDK | MIT | 29 214★ | Не берём | Привязка к OpenAI |
| Anthropic Claude Agent SDK (python) | MIT | 8 040★, релиз v0.2.152 02.09.2026 | Не берём как ядро (Claude Code-харнесс) | Наш loop — свой/LangGraph |
| **MCP** (спецификация) | спец. — «Other»; servers — Apache-2.0/MIT | спец. 9 144★, **стабильная ревизия 2026-07-28** (GitHub releases, 06.09.2026); servers 90 105★; референсные серверы: Everything, Fetch, Filesystem, Git, Memory, Sequential Thinking, Time; **официальных серверов M365/Google Workspace нет** (Slack — архив, заменён Zencoder), реестр — registry.modelcontextprotocol.io (https://github.com/modelcontextprotocol/servers, 06.09.2026) | **Берём как протокол** для наших коннекторов (EIAC-server, ERP-export-server, M365-server) — чтобы клиент мог подключать Copilot/Claude поверх наших данных | Зрелый, есть у всех вендоров; но серверы к нашим источникам пишем сами |
| CrewAI | MIT | 58 135★ | Не берём | Мультиагентность не нужна в v1 |
| **Temporal** | MIT | 22 849★, релиз v1.31.2 | **Берём** для durable workflow реновации (60–90 дней, ретраи, ожидание одобрения) | Долгоживущие процессы с человеком в цикле — ровно его кейс |
| n8n | **Sustainable Use License: только внутреннее использование; «distribute… only free of charge for non-commercial purposes»; для SaaS/embedding нужен n8n Enterprise License** (GitHub LICENSE.md, https://github.com/n8n-io/n8n/blob/master/LICENSE.md, 06.09.2026) | 203 498★ | **Не берём** в продукт | Нельзя встраивать/хостить для третьих лиц без Enterprise-лицензии |
| **Evaluation / guardrails / PII** | | | | |
| **Langfuse** | **MIT кроме папок `ee`** | 34 240★, релиз v4.30.0 | **Берём (self-hosted, EU)** — трассы, оценки, prompt-версии | |
| Phoenix (Arize) | «Other» (Elastic-подобная) | 11 342★ | Не берём | Лицензия |
| Ragas | Apache-2.0 | релиз v0.4.3 | Берём для RAG-метрик (faithfulness, context precision) | |
| DeepEval | Apache-2.0 | 18 124★ | Берём для регресс-тестов «золотого» набора (pytest-стиль) | |
| Guardrails AI | Apache-2.0 | 7 360★ | Опционально | |
| NeMo Guardrails | Apache-2.0 | релиз v0.24.0 | Опционально | |
| **Presidio (Microsoft)** | **MIT** | 10 800★, релиз 2.2.364 | **Берём** для PII-редакции в логах/трейсах и в промптах во внешние API (DNI/NIE, IBAN, телефоны — свои recognizers для испанских форматов) | |

---

## 4. Архитектура MVP: copilot реноваций с 3 коннекторами

```
                    ┌──────────────────────── Источники у брокера ────────────────────────┐
                    │ M365 (Exchange/SharePoint)   EIAC-XML (папка ERP / SFTP / CIMA)     │
                    │ Google Workspace (альт.)     Экспорт ERP (Excel/CSV по расписанию)  │
                    │ Signaturit (API)             [v1.5] WhatsApp Cloud API              │
                    └───────┬──────────────────────────┬─────────────────────┬────────────┘
                            │ Graph delta / app-only    │ watch-folder/SFTP   │ cron pull
                    ┌───────▼──────────────────────────▼─────────────────────▼────────────┐
                    │ INGESTION (workers, очередь)                                          │
                    │  • MailConnector (delta, RBAC-scope ящиков)  • EIACParser (XSD 6/7.1) │
                    │  • FileConnector (driveItem delta + permissions) • ERPExportLoader    │
                    │  • Docling → chunks + tables  • Mistral OCR (сканы)  • Presidio (лог) │
                    └───────┬──────────────────────────────────────────────────────────────┘
                            │
      ┌─────────────────────▼──────────────────────┐   ┌────────────────────────────────┐
      │ ХРАНИЛИЩЕ (Postgres, EU)                    │   │ ACL / AUTHZ                     │
      │  • domain: cliente, póliza, recibo,         │◄──┤ Postgres RLS (tenant, roles) +  │
      │    siniestro, liquidación, oferta, doc      │   │ OpenFGA (этап 2: сотрудник→     │
      │  • chunks + pgvector (→ Qdrant при росте)   │   │ cliente→póliza→doc)             │
      │  • audit_log (append-only)                  │   │ зеркало ACL M365/Drive          │
      └─────────────────────┬──────────────────────┘   └────────────────────────────────┘
                            │
      ┌─────────────────────▼──────────────────────────────────────────────────────────┐
      │ ORCHESTRATION (Temporal: RenewalWorkflow, 60–90 дней до vencimiento)             │
      │  1 detect: vencimiento из EIAC/ERP → создать «expediente de renovación»          │
      │  2 collect: условия (PDF), recibos/siniestros (EIAC), оферта страховщика (mail)  │
      │  3 analyze (LangGraph + Pydantic AI, Claude Sonnet 5 @ Bedrock EU):              │
      │     diff условий/примы, сравнение с 1–2 альтернативами, цитаты page-level        │
      │  4 draft: письмо клиенту / запрос страховщику (Haiku/Qwen для черновой части)   │
      │  5 HUMAN GATE: черновик → одобрение/правка (роль producción) → отправка          │
      │  6 send: через Graph sendMail от имени сотрудника / WhatsApp utility-шаблон       │
      │  7 writeback: PDF-досье + заметка в ERP (экспорт/ручной ввод; API — по партнёрству)│
      └─────────────────────┬──────────────────────────────────────────────────────────┘
                            │
      ┌─────────────────────▼──────────────────────┐   ┌────────────────────────────────┐
      │ ИНТЕРФЕЙСЫ                                  │   │ OBSERVABILITY / EVAL            │
      │  • Web-app (inbox реноваций, Q&A по полису) │   │ Langfuse (self-hosted), Ragas/  │
      │  • Outlook add-in (task pane у письма)      │   │ DeepEval регресс на «золотом»   │
      │  • Teams-бот / WhatsApp (v1.5)              │   │ наборе, метрики HITL            │
      │  • MCP-server поверх наших данных           │   │                                 │
      └─────────────────────────────────────────────┘   └────────────────────────────────┘
```

**Стек:** Python 3.12 (FastAPI, LangGraph, Pydantic AI, Docling, lxml для XSD-валидации EIAC), Temporal (workflow), Postgres 16 + pgvector (→ Qdrant при >1–2 M чанков), Redis (очереди/кэш), React/TypeScript (web, Outlook add-in на Office.js), Langfuse, Presidio. LLM: Claude Sonnet 5/Haiku 4.5 через **Bedrock EU (eu-west-1 in-region или профиль EU; Spain eu-south-2)**; резерв — Mistral Medium 3.5 (EU +10 %) / Qwen3-32B на OVH AI Endpoints; эмбеддинги — Qwen3-Embedding-8B или bge-m3 (self-hosted/OVH). Деплой: **Hetzner (Falkenstein/Helsinki) или OVH (Gravelines/Paris) для multi-tenant SaaS**; для тендеров/крупных — **single-tenant дистрибутив (Docker Compose/Helm) в облаке клиента или on-prem** с Qwen3-32B на 1×L40S. Bedrock EU и OVH — единственные субпроцессоры LLM (см. regulatory-файл: EU-endpoint + ZDR + SCC как fallback).

**Multi-tenant vs single-tenant:** MVP — multi-tenant с жёсткой изоляцией (`tenant_id` в каждой таблице + Postgres RLS + отдельные бакеты документов + отдельные Bedrock-ключи per tenant); single-tenant/on-prem — отдельный SKU с этапа 2 (ADECOSE-брокеры не доверяют страховщикам с данными; DORA-требования транслируются через CIMA-контракты — см. niche-файл).

**Permission-модель (роли correduría):**
| Роль | Видит | Делает |
|---|---|---|
| producción / comercial | клиенты своего портфеля (cartera asignada), их pólizas/ofertas/переписку | одобряет и отправляет черновики реноваций |
| administración | все recibos/liquidaciones, но не медицинские вложения siniestros | сверка recibos, отчёты |
| siniestros | siniestros и связанные документы; **данные здоровья — только при явном флаге роли** (art. 9 GDPR — см. niche-файл §3.2) | v2 |
| dirección | всё + аналитика | настройка политик, аудит |
| admin (IT) | техн. настройки, без содержимого документов (опционально) | коннекторы, ключи |
Реализация: (1) роли и «cartera asignada» импортируются из ERP-экспорта/M365-групп; (2) на каждом документе — `allowed_principals` (зеркало ACL SharePoint/Drive через `permissions`, 5 RU) ∩ доменное правило (клиент ведётся сотрудником); (3) все запросы к индексу фильтруются до ранжирования (pre-filter), не после; (4) OpenFGA на этапе 2 для наследования по цепочке cliente→póliza→documento.

**Аудит-лог:** append-only таблица (кто, когда, какой запрос, какие документы вошли в контекст (id+страницы), какая модель/версия промпта, ответ, действие — одобрил/правил/отклонил/отправил); хранение — по политике клиента, но ≥ срока хранения преддоговорной документации (6 лет — niche-файл §3.1) для досье реновации; PII в трейсах Langfuse маскируется Presidio.

**Human-in-the-loop UI:** inbox «Renovaciones a 90/60/30 días» → карточка: сводка изменений (diff условий/премии с цитатами «стр. N»), таблица сравнения, черновик письма → кнопки «Aprobar y enviar / Editar / Rechazar (причина)». **Автономная отправка запрещена конфигурационно** (нет кода-пути send без approval-события). Outlook add-in показывает то же досье при открытом письме страховщика. Teams/WhatsApp — v1.5 (уведомления, не действия).

---

## 5. Сроки и бюджет до первого платящего клиента

**Ставки (полная стоимость работодателя, Испания):** заданное допущение **€60–90 k/год на senior backend/ML** (≈ $70–105 k). Проверка источниками: Hays «Guía salarial» (https://www.hays.es/guia-salarial) — HTTP 403; Michael Page «Estudios de remuneración» (https://www.michaelpage.es/estudios-remuneracion) — 404; Randstad Research «Tendencias Salariales 2025» PDF — 503 при трёх попытках → **[Hays/Michael Page: НЕТ ИСТОЧНИКА — не цитировать в питче]**. Единственное открывшееся: Talent.com (агрегатор вакансий, 2026, выборка «10 000 salaries»): «desarrollador senior» — медиана **€47 000**, диапазон €33 000–55 800; «machine learning engineer» — €37 500–60 000; «devops» — €37 000 (3 307 зарплат); «ingeniero backend senior» — €26 000 и «ingeniero de software senior» — €13 700 — **явно битые срезы, не использовать** (Talent.com, https://es.talent.com/salary?job=desarrollador+senior и др., 06.09.2026). Брутто €45–60 k × ~1,32 (соцвзносы работодателя, допущение) ≈ €60–80 k полной стоимости — согласуется с заданным диапазоном. **Вариант «команда в РФ/СНГ» — допущение: 40–55 % от испанской полной стоимости** (без источника; заказчик обозначил как допущение).

**Команда до первого платящего (7–9 месяцев):**
| Роль | FTE | Месяцев | Испания, €k (полная стоимость €60–90k/год → €5–7,5k/мес) |
|---|---|---|---|
| Tech lead / архитектор (LLM+данные) | 1,0 | 8 | 48–60 |
| Backend/LLM-инженеры | 2,0 | 7 | 70–105 |
| Инженер коннекторов/ingestion (Graph, EIAC, Docling) | 1,0 | 6 | 30–45 |
| Frontend (web + Outlook add-in) | 0,5 | 5 | 12–19 |
| Product/domain (ex-correduría, испанский страховой) | 0,5 | 8 | 20–30 (допущение: €5–7,5k/мес полная) |
| QA / eval-инженер + разметка «золотого» набора | 0,5 | 6 | 15–22 |
| DevOps/безопасность | 0,3 | 8 | 12–18 |
| **Итого людей** | **5,8** | | **€207–299 k** |
| Инфраструктура (Hetzner/OVH + Bedrock EU + OVH Endpoints + Langfuse), 8 мес × €1,5–4 k | | | 12–32 |
| Юридический пакет (DPA, DPIA-шаблон, sub-processor list, EU-residency statement, политика хранения) — ~6–8 недель, 1 юрист + 1 инженер (regulatory-файл §5) | | | 15–30 (допущение по ставкам юристов) |
| Пилоты 2–3 брокера: онбординг, маппинг EIAC per insurer, командировки на ADECOSE/Congreso Mediadores/CMAB (события — niche-файл §8) | | | 10–25 |
| Партнёрство CIMA/TIREA (контракт, тесты) — если на этапе 2 | | | 0 в MVP / [цена НЕТ ИСТОЧНИКА] |
| Резерв 15 % | | | 37–58 |
| **Итого (Испания)** | | | **€280–445 k ≈ $325–515 k** |
| **Итого (команда РФ/СНГ, допущение 40–55 % ставок; юр. пакет и инфраструктура — те же)** | | | **€150–260 k ≈ $175–300 k** |

**Календарь:**
- М0–1: design partners (2–3 corredurías через ADECOSE/CMAB, целевые события 28.09, 05–06.10, 20.10.2026), доступ к обезличенным EIAC-файлам и 200–300 полисам для золотого набора; архитектура; DPA/DPIA-шаблон стартует.
- М1–4: ingestion (M365 + EIAC + ERP-экспорт), Docling-пайплайн, доменная модель, Q&A по условиям с цитатами; eval-контур.
- М3–6: RenewalWorkflow (Temporal), сравнение/диффы, черновики, HITL-UI, Outlook add-in; регресс на золотом наборе.
- М5–8: пилоты у 2–3 брокеров (бесплатно/со скидкой), маппинг свободных полей EIAC под 5–8 страховщиков пилотов, security-pack (пентест, EU-residency statement).
- **М7–9: первый платящий** (конверсия пилота). Допущение: чек €1,5–4 k/мес за брокера 30–60 чел. (€40–70/пользователь) — при инференсе $300–500/мес валовая маржа ≥ 80 %.

Что может сдвинуть сроки: доступ к данным пилотов (secreto profesional → нужна DPA до первого файла), разнобой EIAC между страховщиками (задокументирован ADECOSE), недоступность ERP-API (только партнёрство).

---

## 6. Риски качества и человек в цикле

**Где ошибка недопустима (по убыванию тяжести):**
1. **Условия покрытия / исключения / franquicias** — неверное «покрыто/не покрыто» = консультационная ответственность брокера (RC-страхование corredor обязательно — art. 157 RDL 3/2020; secreto profesional art. 188 — niche-файл §3).
2. **Суммы**: prima neta/total, capitales, franquicia, комиссии; ошибки в диффе «стало дороже на X %».
3. **Даты**: fecha de efecto/vencimiento, plazo de preaviso для no-renovación — пропуск = автопролонгация или потеря клиента.
4. **Смешение клиентов/полис** (два клиента с похожими именами, несколько полис одного клиента, дубли recibos «Marca A y Marca B nos duplican recibos» — ADECOSE 2025) — утечка данных между клиентами = инцидент GDPR.
5. **Данные здоровья** (Salud/Vida/Accidentes): попадание в контекст/письмо — art. 9 GDPR; в v1 — вне scope (No Vida).
6. **Галлюцинация условий**, которых нет в документе (особенно при сканах низкого качества и «свободных полях» EIAC).
7. Неверная атрибуция письма (ответить не тому страховщику/клиенту), отправка без одобрения.

**Как встраиваем проверку (по каждому риску):**
- **Обязательное одобрение** любого исходящего (письмо, WhatsApp, изменение в ERP): нет кода-пути отправки без approval-события; роль-approver ≠ роль-инициатор для сумм выше порога (допущение: премия > €5 k — второй глаз).
- **Цитаты с указанием источника и страницы** для каждого утверждения об условии/сумме/дате (Docling даёт page/bbox; хранить `doc_id, page, span`); утверждение без цитаты помечается «sin fuente» и не попадает в черновик. Claude Citations API (page_location) — есть на Bedrock (Anthropic Bedrock doc, 06.09.2026).
- **Структурированные выходы (Pydantic AI, strict-схемы)**: числа/даты извлекаются в типизированные поля с валидацией (диапазон дат, сумма = нетто + налоги ± допуск), а не «в тексте».
- **Confidence + «no lo sé»**: порог уверенности ретривера/экстрактора; при отсутствии документа/низком сходстве — явный отказ и задача сотруднику, не догадка.
- **Diff старых/новых условий** — детерминированный (таблица clausulado v1 vs v2 по extracted fields), LLM только объясняет diff; премии/даты сверяются с EIAC-recibos (второй независимый источник).
- **Разграничение клиентов**: pre-filter по `client_id` до ретрива; в контекст одного expediente — только документы этой polizы/клиента; автотест «cross-client leakage» в регрессе.
- **Данные здоровья**: классификатор + Presidio-детекторы (диагнозы, cuestionario de salud) → документы помечаются `sensitive=health` и исключаются из индекса v1.
- **Регресс-тесты на «золотом» наборе**: 200–300 полис (5–8 страховщиков × 4–6 ramos No Vida) с размеченными полями (capital, prima, franquicias, exclusiones, fechas) + 100 реальных оферт реновации с эталонным диффом; запуск DeepEval/Ragas на каждый релиз промпта/модели; метрики: exact-match по числам/датам ≥ 99 %, faithfulness ≥ 0,95, «sin fuente»-rate, cross-client leakage = 0.
- **Мониторинг в проде**: Langfuse — доля правок черновиков сотрудниками, доля отклонений, время ревью; правки → в золотой набор.

**Что это добавляет к стоимости:**
- **Время ревью у брокера**: 250 реноваций/мес × 8–12 мин (допущение) = 33–50 ч/мес ≈ 0,2–0,3 FTE técnico; при полной стоимости бэк-офиса €29–39 k/год (niche-файл §7.1) — **€500–1 000/мес** на брокера; это и есть «человек в цикле» вместо 45–60 мин на реновацию вручную (Quandri, niche-файл §4.3 — зарубежная оценка).
- **Разметка золотого набора**: 250 полис × 30 стр. × ~1,5 ч эксперта (допущение) ≈ 375 ч; по €40–50/ч (допущение для ex-técnico/фриланс) = **€15–19 k разово**, +€2–3 k/квартал на пополнение.
- **Eval-инфраструктура**: Langfuse self-hosted (MIT) — ~€100–200/мес хостинг; прогоны LLM-as-judge: 300 кейсов × 5 сценариев × 4 запуска/мес × ~10 k токенов = 60 M токенов ≈ **$60–120/мес** на Haiku/Sonnet; eval-инженер 0,5 FTE уже в бюджете.
- **Задержка релизов**: регресс на золотом наборе перед каждым обновлением модели/промпта — +1–2 дня на релиз (допущение).
- Итого «налог на качество» ≈ **€20–25 k разово + €1–2 k/мес** на пилот-брокера — сопоставимо с 5–7 % бюджета MVP.

---

## Что не нашёл
1. **Публичная документация API segElevia, ebroker, Gecose, iSegur, Euro Agent Cloud** — сайты либо без упоминаний API, либо не открылись (ebroker 503/SSL, Lamb SSL, euroagentcloud DNS, Gecose/SoftQS — пустой JS). Наличие/отсутствие API — не подтверждено.
2. **Спецификация Web Service CIMA** (методы, SOAP/REST, авторизация) и **тарифы TIREA/CIMA** — выдаются только по контракту.
3. **Developer-порталы страховщиков** для брокерского канала в Испании — не найдены (503/404/DNS); условия использования экстранетов — за логином.
4. **Судебная практика по скрейпингу** (Ryanair v PR Aviation C-30/14; испанские дела) — страницы CURIA/поиск не открылись.
5. **Hays / Michael Page Guía Salarial 2026** — 403/404; Randstad 2025 PDF — 503. Есть только Talent.com (часть срезов битая).
6. **Цены Scaleway H100/L40S (PAR-2) и Hetzner GEX131** — не отрендерились (JS).
7. **Ставки WhatsApp для Испании** (marketing/utility/authentication) — только в интерактивном калькуляторе Meta.
8. **EU data residency для Gemini (Vertex)** и **полная матрица EU-регионов Azure OpenAI для GPT-5.4/5.5/5.6** — страницы не открылись / не извлечены.
9. **Бенчмарк пропускной способности 70B на H100** (NVIDIA NIM benchmarking — 404) — оценка узла «~10 брокеров» = допущение.
10. **Цена Onyx Enterprise Edition self-hosted** (permission sync — в EE) — по запросу.
11. Даты релизов GitHub — на страницах без года; использованы `pushed_at` из API как подтверждение активности.

## Что сомнительно
1. **Оценка нагрузки 30 запросов/чел./день** (задана) — для corredurías вероятно завышена в 2–3 раза (типичная активность ассистентов — 5–15/день); реальная стоимость инференса будет ниже, но лучше держать консервативно.
2. **Prompt-caching 50 %** — сильно зависит от того, повторяются ли документы между запросами одного сотрудника; при 20 % кэш-хитов экономия падает до ~10 %.
3. **500 токенов/стр. полиса** — condiciones generales плотные, может быть 700–900; эмбеддинги при этом всё равно <$20/мес, но prefill-нагрузка Q&A задана независимо (6 000 токенов), так что на итог не влияет.
4. **Bedrock EU «+10 %»** относится к regional endpoints моделей 4.5+; при использовании профиля `eu.` (cross-region внутри ЕС) — это и есть regional → надбавка применяется. Global-эндпоинт без надбавки не гарантирует обработку в ЕС — для DPIA не подходит.
5. **Talent.com** — агрегатор вакансий, не обзор рынка; значения для «ingeniero backend senior» (€26 k) и «ingeniero de software senior» (€13,7 k) противоречат «desarrollador senior» (€47 k) — использовать только последнюю цифру и как ориентир.
6. **Llama 4 и ЕС**: в тексте лицензии на developer.meta.com исключения ЕС не нашёл, но в 2025 г. Meta публично ограничивала мультимодальные модели для EU-компаний (по памяти — [НЕТ ИСТОЧНИКА]); для чистоты — Qwen3/Mistral (Apache 2.0).
7. **Доля M365 vs Google Workspace в corredurías** не измерена (niche-файл) — коннектор №1 может оказаться Google; архитектура симметрична, но Outlook add-in тогда заменяется на Gmail add-on.
8. Список «software adheridas» CIMA — по состоянию страницы (дата обновления не указана); список страховщиков датирован «febrero de 2026».
9. **Оценка «узел на 10 брокеров»** и все GPU-расчёты — арифметика без бенчмарка; для питча использовать только облачные цены (варианты a/b) и OVH AI Endpoints.

## Источники (открытые в этой сессии)
CIMA: https://www.cimaseg.es/mundo-eiac/ · https://www.cimaseg.es/faqs/ · https://www.cimaseg.es/para-quien/corredores/ · https://www.cimaseg.es/para-quien/empresas-de-software/ · https://www.cimaseg.es/para-quien/aseguradoras/ · https://www.cimaseg.es/eiac-version-7-1/ · https://www.cimaseg.es/poliza-digital/como-adherirse/ · https://www.cimaseg.es/descubre-cima/ · https://www.tirea.es/ · https://www.tirea.es/glosario/cima/ · https://www.fecor.es/eiac-fecor/
Вендоры ERP: https://www.mpmsoftware.com/es/soluciones/brokers/ · https://www.mpmsoftware.com/es/productos/ · https://www.mpmsoftware.com/es/productos/?t · https://codeoscopic.com/en/workspace/avant2-en/ · https://codeoscopic.com/en/workspace/integra-en/ · https://codeoscopic.com/en/workspace/avant2-en/avant2-erp-connection/ · https://www.mediator.es/ · https://www.zurich.es/mediadores · https://www.mapfre.com/en/
Почта/файлы/подпись/WhatsApp: https://learn.microsoft.com/en-us/graph/auth/auth-concepts · https://learn.microsoft.com/en-us/graph/delta-query-overview · https://learn.microsoft.com/en-us/graph/throttling-limits · https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online · https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac · https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/outlook-add-ins-overview · https://developers.google.com/workspace/gmail/api/reference/quota · https://developers.google.com/workspace/drive/api/guides/limits · https://docs.signaturit.com/api/latest · https://developers.facebook.com/docs/whatsapp/pricing · https://whatsappbusiness.com/products/platform-pricing/
Модели/цены: https://platform.claude.com/docs/en/about-claude/pricing · https://platform.claude.com/docs/en/manage-claude/data-residency · https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock · https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy · https://developers.openai.com/api/docs/pricing · https://ai.google.dev/gemini-api/docs/pricing · https://mistral.ai/pricing/api · https://docs.mistral.ai/getting-started/models/models_overview/ · https://mistral.ai/products/la-plateforme · https://aws.amazon.com/bedrock/pricing/ · https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure · https://docs.voyageai.com/docs/pricing · https://cohere.com/pricing · https://www.ovhcloud.com/en-ie/public-cloud/prices/ · https://www.ovhcloud.com/en/public-cloud/gpu/ · https://www.scaleway.com/en/pricing/gpu/ · https://www.hetzner.com/dedicated-rootserver/matrix-gpu/ · https://www.hetzner.com/dedicated-rootserver/gex131/ · https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
Open-weight/лицензии: https://huggingface.co/api/models/… (Llama-3.3-70B, Llama-4-Scout/Maverick, Qwen3-235B/32B, Qwen3-Embedding-8B, Mistral-Small-3.2, Mistral-Large-3, gemma-3-27b-it, DeepSeek-V3.1/V3.2, bge-m3, multilingual-e5-large, jina-embeddings-v3) · https://developer.meta.com/ai/llama4/license/ · https://ai.google.dev/gemma/terms · https://huggingface.co/BAAI/bge-m3 · https://huggingface.co/Qwen/Qwen3-Embedding-8B
OSS-компоненты: GitHub search API (06.09.2026) и страницы: https://github.com/onyx-dot-app/onyx · https://docs.onyx.app/llms.txt · https://docs.onyx.app/deployment/miscellaneous/enterprise_edition.md · https://docs.onyx.app/admins/permissions/understanding_permissions.md · https://github.com/airbytehq/airbyte/blob/master/LICENSE · https://github.com/NangoHQ/nango · https://github.com/docling-project/docling · https://github.com/n8n-io/n8n/blob/master/LICENSE.md · https://github.com/langchain-ai/langgraph · https://github.com/modelcontextprotocol/servers · https://github.com/modelcontextprotocol/modelcontextprotocol/releases · https://github.com/microsoft/presidio · https://github.com/langfuse/langfuse · https://github.com/elastic/elasticsearch/blob/main/LICENSE.txt · https://www.elastic.co/docs/deploy-manage/users-roles/cluster-or-deployment-auth/controlling-access-at-document-field-level · https://www.llamaindex.ai/pricing · https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/ · https://www.merge.dev/pricing · https://www.useparagon.com/pricing · страницы `/releases` для vllm, llama_index, pydantic-ai, qdrant, temporal, ragas, openfga, claude-agent-sdk-python, NeMo-Guardrails, unstructured, haystack, docling, langgraph, langfuse, presidio, onyx
Зарплаты: https://es.talent.com/salary?job=desarrollador+senior · https://es.talent.com/salary?job=machine+learning+engineer · https://es.talent.com/salary?job=devops
