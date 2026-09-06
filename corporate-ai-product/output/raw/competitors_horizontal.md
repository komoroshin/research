# Карта горизонтальных конкурентов — корпоративный ИИ класса Glean для среднего бизнеса (30–500 сотрудников), старт — Испания/ЕС

Дата сбора: 2026-09-05/06. Все цены — `$`, если источник не в `$` — указано.
Метки: `[>24 мес]` — опубликовано до сентября 2024; `[НЕТ ИСТОЧНИКА — не для питча]` — число без подтверждённого источника; `(третья сторона)` — данные агрегатора/блога, а не вендора; `измерено / заявлено / прогноз` — характер числа.

Ограничения сбора (важно для читателя):
- Лимит WebSearch исчерпался на ~20-м запросе; дальше поиск шёл через Bing News / WebFetch. Официальные страницы OpenAI (`openai.com`, `help.openai.com`), Writer (`writer.com/plans`), Microsoft (`/copilot/business`, `/copilot/enterprise`), G2, Reddit, Capterra — отдали 403/503 или заблокированы для фетча. Поэтому по ChatGPT Enterprise, Copilot Business и всем «слабым местам по отзывам» опора на вторичные источники и HN; Reddit-ссылки привести не удалось.
- Все ссылки ниже либо открыты через WebFetch, либо реально показаны в выдаче поиска (Bing News / WebSearch / HN Algolia). Ни одна ссылка не сконструирована по смыслу.

---

## 1. Сводная таблица (игрок × 8 критериев)

| Игрок | 1. Мин. клиент / мест | 2. Цена за место/мес (дата) | 3. Размещение / EU | 4. Коннекторы, SDK, MCP | 5. Испания/ЕС | 6. Оценка / раунд / масштаб | 7. Слабые места (отзывы) | 8. Стратегия SMB/вертикали |
|---|---|---|---|---|---|---|---|---|
| **Glean** | Enterprise; ~100–250 мест, мин. контракт ~$50–60k/год (третья сторона, 2026) | Публичной нет; ~$45–50 база + ~$15 AI add-on; диапазон $50–75 (третья сторона, 03–08.2026) | Облако; хостинг в облаке клиента — не подтверждено официальной страницей; EU-регион — не найдено | 275+ коннекторов, 40+ LLM (glean.com, 09.2026); MCP-экосистема (пресс-релиз 06.2026); SDK — не проверено | Офис в ЕС — не найдено; экспансия 2026 — Австралия; испанские кейсы — не найдено | Series F $150M при $7.2B (06.2025); ARR $300M (05.2026, заявлено) | Непрозрачная цена, +7–12% при продлении, сложная настройка прав, «находит, но не делает», неточности в LLM-ответах | SMB-планов нет; вертикали: sales context, financial services MCP (2026) |
| **Microsoft 365 Copilot** (+Copilot Studio) | Любой тенант M365; SMB-SKU Copilot Business ≤300 мест (третья сторона) | $30 (Enterprise, годовая); Copilot Business $21 (годовая)/$25 мес, промо $18; Copilot Studio $200/25 000 кредитов/мес или PAYG (09.2026) | Только облако MS; EU Data Boundary покрывает M365 (MS Learn, 07.2026) | 1 400+ коннекторов Power Platform, MCP (microsoft.com, 09.2026) | Полное присутствие, локализация, партнёры повсеместно | 15M платных мест (01.2026) → 20M (04.2026) → 30M+ (07.2026), измерено/заявлено MS | Oversharing через SharePoint: 40% из 132 ИТ-лидеров откладывали внедрение ≥3 мес (Gartner via Computerworld, 12.2024); низкая ценность vs $30; путаница брендов | Есть SMB-SKU (Business Standard/Premium); вертикальных пакетов в SMB нет — только через партнёров/Copilot Studio |
| **ChatGPT Enterprise / Business** | Business: от 2 мест; Enterprise: по слухам 150 мест (единственный источник — Reddit-пост 2023 — сомнительно) | Business $20 годовая / $25 мес (с 02.04.2026); Premium-место $100/$125 (08.2026); Enterprise — по запросу, ~$45–75 (третья сторона) | Облако OpenAI; EU data residency at-rest для Enterprise/Edu с 06.02.2025; 10 регионов хранения / 3 региона инференса (третья сторона) | Коннекторы: SharePoint, Google Drive, Dropbox, Box, Outlook, Teams, Gmail, Slack, GitHub, Linear (третья сторона, 06.2026); MCP — официально не проверено | Присутствие через партнёров; офиса в Испании — не найдено | «ChatGPT Work и Codex — 10M пользователей» (08.2026, заявлено); платных бизнес-мест — не найдено | Непрозрачность Enterprise, лимит агентов 40 сообщений/пользователь/мес на Business, Business — только карта | SMB: Business с 2 мест + «small business program» (08.2026); вертикалей нет |
| **Claude Team / Enterprise** | Team 2–150 мест; Enterprise — мин. 20 (self-serve) / 50 (через продажи) (третья сторона) | Team $20 (годовая)/$25 мес; Premium $100/$125; Enterprise $20/место + usage по API-тарифам, только годовая (claude.com, 09.2026) | Облако Anthropic; GA в Microsoft Foundry (07.2026); EU data residency — не найдено | Gmail, Google Drive, Slack, Microsoft 365, Chrome; enterprise search, Cowork, MCP-коннекторы (claude.com) | Офиса в Испании — не найдено | Гигант; данные по бизнес-местам не найдены | Мало данных по отзывам; риск непредсказуемого usage-биллинга на Enterprise | Team — де-факто SMB-план; вертикалей нет |
| **Gemini Enterprise** (ex-Agentspace) | Business: 1–300 мест (третья сторона; другой источник — до 500) | Business $21; Standard $30 (годовая)/$35 мес; Plus $50–60; Frontline — при 150+ мест Standard/Plus (третья сторона, 08–09.2026) | Облако Google; «sovereign controls» в Plus (третья сторона); EU-регионы — не проверено | Полная библиотека коннекторов — со Standard (третья сторона); число — не найдено | Присутствие Google повсеместно | Гигант; переименование Agentspace → Gemini Enterprise 09.10.2025 | «buggy, snail speed» (отзывы, третья сторона); метеринг $15–40/power-user сверх квот | Business-редакция — SMB; вертикалей нет |
| **Notion AI** | От 1 места | Plus $10; Business $20/участник/мес (годовая; $24 мес) — AI включён; Enterprise — custom (notion.com, 09.2026); Custom Agents $10/1 000 кредитов | Облако; EU data residency (Frankfurt/Ireland) только Enterprise, бесплатно (notion.com/help) | Enterprise Search (beta): Slack, Teams, GitHub, Jira, Box, OneDrive, Salesforce, Asana (notion.com) | Локализация есть; офиса в Испании — не найдено | Гигант-частник; раунд не искали | AI работает в основном внутри Notion, «не построен для многошаговой работы в других инструментах» | SMB — родной сегмент; вертикалей нет |
| **Guru** | Professional: мин. 10 мест (третья сторона) | Professional $25/мес (годовая; $30 мес) → $250–300/мес минимум; сайт теперь «custom, platform + expertise» (getguru.com, 09.2026) | Облако; EU — не найдено | 100+ интеграций (getguru.com) | Не найдено | Раунды не найдены; медианный чек $540/год (513 покупок, третья сторона) | Поиск не терпит опечаток, AI смешивает внешние/внутренние данные, нет офлайна | SMB/mid-market — целевой; отраслевых пакетов нет |
| **Moveworks (ServiceNow)** | Практически 1 000+ сотрудников (третья сторона) | Нет публичной; $15–45/сотрудник/ГОД (Vendr via unthread, 04.2026); AWS Marketplace ~$150/пользователь/год | Облако; регион ЕС — не найдено | 100+ интеграций | Через ServiceNow | Куплен ServiceNow за $2.85B, закрыто 15.12.2025; 5.5M сотрудников-пользователей | Общие ответы на нишевые запросы; нет BYO-LLM; дрейф в SKU ServiceNow | Только enterprise; ITSM/HR-вертикаль |
| **Dust** (FR) | Self-serve до 100 мест; Enterprise — мин. 100 мест (третья сторона) | Free 500 кредитов; Pro $30 ($24 годовая, 8 000 кр.); Max $150 ($120); Enterprise custom (с 24.06.2026) | Облако; US/EU residency; single-tenant в Enterprise | 20+ коннекторов (Business); unlimited + MCP (Enterprise) | Париж; клиенты Qonto, Alan, PayFit, Pennylane; Испания — не найдено | Series A $16M (Sequoia, 06.2024) `[>24 мес]`; ARR $1M тогда; позже — не найдено | Слабый онбординг, крутая кривая для не-разработчиков, 1 GB/пользователь на Pro | SMB/mid-market self-serve; вертикалей нет |
| **Sana (Workday)** | Enterprise | Не найдено | Не найдено | Workday, Google Drive, SharePoint, Office365 | Стокгольм; Испания — не найдено | Куплен Workday ~$1.1B (объявл. 16.09.2025; закрыто 11.2025 за ~$1.0B cash); >1M пользователей | — | Уходит в HCM-вертикаль Workday |
| **Onyx** (ex-Danswer, OSS) | Не указан | Business $20/пользователь/мес (годовая); Enterprise custom (onyx.app, 09.2026); OSS — бесплатно | Self-host / cloud (AWS) / airgapped; on-prem и region-specific — Enterprise | 40+ коннекторов; MCP | Клиент Thales (FR); Испания — не найдено | Seed $10M (Khosla, First Round, 03.2025); 20k GitHub stars | 12 контейнеров в default-деплое, «features ticked off a list», страх enshittification VC-OSS (HN 11.2025) | Pivot к chat-UI; SMB через OSS; вертикалей нет |
| **Writer** | Starter ≤5 мест; Enterprise — по запросу | Starter $39 мес / $29 годовая (третья сторона); Vendr: $18–25 (02.2026); медианный контракт $28.9k/год | Облако; «flexible deployment» в Enterprise | Knowledge Graph + коннекторы (Enterprise) | Не найдено | $1.98B при $326M total (06.2025); ARR $47M (11.2024); Salesforce Ventures (10.2025) | Дорого; разрыв между 5-местным Starter и Enterprise | Enterprise-контент/агенты; вертикали: финсервисы, ритейл (заявлено) |
| **Qatalog** | — | — | — | — | — | Куплен ClickUp (сайт редиректит на clickup.com/qatalog-acquisition; дата/сумма не найдены) | — | Исчез как самостоятельный игрок |
| **Coveo** | Enterprise (Fortune 500) | Не публичная; per-query (100k запросов/единица), Workplace — seat-based (coveo.com) | Облако; multi-region hosting — add-on; hybrid | Salesforce, SAP, ServiceNow и др.; число не указано | Не найдено | Публичная (TSX); FY2026 выручка $148.3M (+11%), SaaS $142.5M (+13%); GenAI = 13% ARR (05.2026) | Акции −57% от пика; per-query модель непонятна SMB | Enterprise; вертикали: commerce, service, workplace |
| **Elastic** | Разработчики; любая | Resource/usage-based (elastic.co/pricing) | Cloud/serverless/self-managed; EU-регионы есть у Elastic Cloud (общеизвестно, страница не показала) | Коннекторы — платформа для строителей | Офисы в ЕС | Публичная | Не turnkey-ассистент; Workplace Search — документация 8.19 «больше не обновляется» | Платформа, не продукт для SMB |
| **Sinequa (ChapsVision)** | Крупный enterprise («200 000 пользователей, 400M документов») | Не найдено | Гибко; on-prem исторически | 200+ коннекторов | Франция (Suresnes); ChapsVision в 40 странах; Испания — не найдено | Куплен ChapsVision 18.11.2024 (+$90M раунд ChapsVision); ChapsVision €200M выручки 2024 | — | Enterprise; вертикали: life sciences, aerospace/defense, legal |
| **Mistral (Le Chat → Vibe)** (FR) | Team — мин. 2 (третья сторона) | Team $24.99 мес / $19.99 годовая (+$50 базовый сбор, третья сторона); Enterprise — по запросу | On-prem / private cloud / Mistral Cloud с data residency (mistral.ai, 09.2026) | 100+ инструментов через коннекторы + полный MCP (mistral.ai); 40+ MCP-коннекторов (третья сторона) | ЕС-игрок; Испания — не найдено | Series C €1.7B (ASML, 09.2025) при ~€11.7B; $830M долг (03.2026); партнёрство с Microsoft (07.2026) | Каталог коннекторов ограничен, SOC2 Type II «в процессе» (третья сторона) | SMB через Team; вертикалей нет |
| **Aleph Alpha** (DE) | Госсектор/крупный enterprise | Не найдено | Суверенно, on-prem/EU | Не найдено | Германия; Испания — нет | Куплен Cohere 24.04.2026, комбинированная оценка ~$20B; Schwarz +$600M в Cohere; выручка 2023 <€1M | Провал коммерциализации FM | Не SMB |
| **Испания: Sherpa.ai, Clibrain, Nuclia** | см. блок | — | — | — | — | Nuclia → Progress Software (30.06.2025) | — | Glean-класс среди испанских не найден |

---

## 2. Детали по игрокам

### Glean
- Цена: публичной нет. Третьи стороны: ~$45–50 база + ~$15/мес Work AI add-on, минимальный контракт ~$50–60k/год (обычно 100+ мест), обязательный support fee ~10% ARR, рост при продлении 7–12% (Fritz.ai, https://fritz.ai/glean-review/, 2026-03-03, третья сторона). Диапазон $50–75/место, 100–250 мест минимум, годовые минимумы $60k–225k (GoSearch — конкурент Glean, https://www.gosearch.ai/blog/glean-pricing-explained/, 2026-06-25). Coworker.ai: $50+, «$100k+ annual minimum», рост 30–40% при переходе от пилота к rollout (https://coworker.ai/blog/glean-pricing, обновл. 2026-08-25). Все три — конкуренты/агрегаторы, не для питча без оговорки.
- Возможности: «275+ connects to work apps», «40+ unique LLMs», кейсы 3.4k+ агентов в Zillow, 2.7k+ в Ericsson (https://www.glean.com/, открыто 2026-09-05, заявлено).
- Финансы: Series F $150M при $7.2B, лид Wellington Management (https://www.glean.com/press/glean-raises-150m-series-f-at-7-2b-valuation-to-accelerate-enterprise-ai-agent-innovation-globally, 06.2025). Вся история раундов: A $15M 03.2019 → F $150M 06.2025 (https://en.wikipedia.org/wiki/Glean_Technologies). ARR: $100M (02.2025) там же; «Surpasses $300M ARR» (https://www.glean.com/press, релиз 2026-05-28, заявлено).
- ЕС/Испания: в списке пресс-релизов 2026 европейских анонсов нет; есть «Expands to Australia» (2026-05-03) и «Global Partner Network» (2026-08-25) (https://www.glean.com/press). HQ Palo Alto, европейские офисы в Wikipedia не указаны. Испанские кейсы — не найдено; страница /customers — 404.
- Слабые места: «occasional inaccuracies», «misconfiguration during setup could potentially expose sensitive information», «significant IT involvement», «surfaces information but doesn't resolve tickets» (Fritz.ai, 2026-03-03). Опаковая цена — главная жалоба у G2/TrustRadius по пересказу GoSearch (2026-06-25). Прямые G2/Reddit-треды получить не удалось (403).
- Стратегия: enterprise-only, 2026 — sales context, financial-services MCP, Gartner «Market Shaper» в No-Code Agent Builders (https://www.glean.com/press). Появился новый прямой конкурент Atolio (Series A, 09.2025 — https://www.atolio.com/blog/atolio-raises-series-a-to-bring-secure-enterprise-search-to-the-world, видел в HN Algolia).

### Microsoft 365 Copilot (+ Copilot Studio / агенты)
- Цена: «$30.00 user/month, paid yearly»; Copilot Studio — «tenant-wide Copilot Credit packs of 25,000 Copilot Credits each, priced at $200.00/pack/month» + PAYG; «more than 1,400 external connectors», MCP-серверы (https://www.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-studio, открыто 2026-09-05).
- SMB-SKU Copilot Business: $21/мес годовая, $25 помесячно, снижен с $30 01.12.2025 (GoSearch, https://www.gosearch.ai/blog/microsoft-copilot-pricing/, данные на 2026-08-24, третья сторона); промо $18 до 31.12.2026, потолок 300 мест, база Business Standard/Premium; E3 растёт до ~$39, E5 до ~$60 с 07.2026 (https://www.explainx.ai/blog/microsoft-365-copilot-pricing-licensing-2026, 2026-08-21, третья сторона). Другой источник в выдаче называл промо до 30.09.2026 — расхождение, официальную страницу /copilot/business открыть не удалось (503). Copilot Chat бесплатен, но «web-grounded only» (explainx).
- Масштаб: 15M платных мест (FY26 Q2, 28.01.2026), 20M (FY26 Q3, 29.04.2026) (https://www.nojitter.com/ai-automation/microsoft-365-copilot-hits-20-million-paid-seats, 2026-05-01); 30M+ в FY26 Q4 (https://www.techtimes.com/articles/322143/20260729/azure-tops-100b-copilot-paid-seats-jump-30m-microsoft-blowout-quarter.htm — в выдаче, страница 403). Проникновение ~6.5% базы (2-data.com — только сниппет выдачи, не открыт).
- Размещение: EU Data Boundary включает Microsoft 365 для тенантов с sign-up в ЕС/ЕАСТ (https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-learn, дата страницы 2026-07-21).
- Oversharing: Gartner-опрос 132 ИТ-лидеров — 40% отложили rollout на ≥3 мес из-за oversharing, 64% — governance съел ресурсы; SharePoint Advanced Management включён в Copilot бесплатно с начала 2025 (https://www.computerworld.com/article/3616459/microsoft-moves-to-stop-m365-copilot-from-oversharing-data.html, 2024-12-04). Официальный blueprint «Remediate oversharing / guardrails / regulations» (https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-blueprint-oversharing, 2026-05-06). Рынок услуг «Copilot hardening от $35 000» (EPC Group, https://www.enterprisenews.com/press-release/story/111381/…, 06.2026) — косвенный индикатор боли. HN: «Copilot getting access to your entire 365/azure tenant is just a security nightmare» (protocolture, https://news.ycombinator.com/item?id=44371829, 2025-06-24); «1.85% of paid M365 users bought a subscription» (wolvoleo, https://news.ycombinator.com/item?id=46856885, 2026-02-02). Reddit r/sysadmin, r/msp — фетч заблокирован.
- Стратегия SMB: отдельный SKU ≤300 мест; вертикали — только через партнёров и Copilot Studio; Agent 365 control plane (05.2026, nojitter).

### ChatGPT Enterprise / Business / Team
- Business: $20/пользователь/мес годовая, $25 помесячно, мин. 2 места, снижено 02.04.2026 с $25/$30 (https://www.gosearch.ai/faqs/chatgpt-enterprise-pricing-explained-cost-tiers-hidden-fees-gosearch-comparison/, 2026-06-02; https://coworker.ai/blog/chatgpt-enterprise-pricing, 2026-08-25). Premium-место $125/мес или $100 годовая, снимает 5-часовой лимит агентов (https://www.msn.com/en-us/money/smallbusiness/chatgpt-business-adds-125-premium-seat-for-power-users-hitting-five-hour-cap/ar-AA29Rmu7, ~08.2026; https://www.cio.com/article/4207908/openai-targets-heavy-users-with-premium-chatgpt-business-seats.html). Лимит агентов на Business — 40 сообщений/пользователь/мес (GoSearch).
- Enterprise: quote-only; «$45–75, ~$60, 150 мест» — coworker.ai прямо предупреждает: «traces back to a single 2023 Reddit post… No fresh, dated 2026 quote has surfaced publicly» → **сомнительно, не для питча**. Inference.net (2026-03-10) упоминает «Go plan для 10–149 пользователей ~$35–40» — не подтверждено официально, **сомнительно**.
- Коннекторы (третья сторона, GoSearch 06.2026): SharePoint, Google Drive, Dropbox, Box, Outlook, Teams, Gmail, Slack, GitHub, Linear; «нет Confluence, Salesforce, Jira, ServiceNow, Asana» — данные конкурента, вероятно устарели; официальную страницу открыть не удалось. Company Knowledge — не верифицировано.
- EU: data residency at-rest в Европе для новых ChatGPT Enterprise/Edu и API с 06.02.2025 (https://techcrunch.com/2025/02/06/openai-launches-data-residency-in-europe/). «10 storage regions, 3 inference regions» — coworker.ai (третья сторона).
- Масштаб: «ChatGPT Work, Codex now have 10 million users» (https://www.msn.com/en-us/money/general/openai-wants-to-help-your-small-business-grow-if-you-use-chatgpt-more/ar-AA28rT0K, ~08.2026, заявлено); число платных бизнес-мест — не найдено.
- Слабые места: непрозрачность Enterprise; Business — только карта, без SCIM/residency; usage-биллинг при агентной нагрузке (coworker.ai).
- SMB: Business от 2 мест + «small business program» (9to5Mac в выдаче Bing News, 08.2026). Вертикалей нет.

### Claude Team / Enterprise (Anthropic)
- Team: «For teams of 2 to 150», $20/место годовая, $25 помесячно; Premium seat $100/$125; включает Claude Code, Cowork, Microsoft 365 integration, enterprise search, SSO, admin-контроль коннекторов. Enterprise: «$20/seat» + «usage at API rates», только годовая; SCIM, audit logs, compliance API, IP allowlisting, HIPAA-ready (https://claude.com/pricing, открыто 2026-09-05). Минимум мест Enterprise 20/50 — третьи стороны (GoSearch, Layer3), официально не подтверждено.
- Коннекторы: Gmail, Google Drive, Slack, Microsoft 365, Chrome; SOC 2, ISO 27001, GDPR (https://claude.com/enterprise). MCP — стандарт Anthropic, на странице /enterprise не упомянут явно.
- EU data residency — не найдено (Bing News по «Anthropic data residency Europe» вернул только новости о водяных знаках по EU AI Act, 08.2026). Claude GA в Microsoft Foundry (Redmond, ~07.2026, из выдачи). Доступность через Bedrock/Vertex — `[НЕТ ИСТОЧНИКА — не для питча]`.
- Слабые места: мало публичных отзывов по Enterprise; модель «место + токены» делает бюджет непредсказуемым (GoSearch, третья сторона).
- SMB: Team — рабочий SMB-план (2–150 мест). Вертикалей нет.

### Gemini Enterprise (Google, ex-Agentspace)
- Официальную страницу цен открыть не удалось (страница >10 MB; /gemini-enterprise/pricing — 404). Третьи стороны: Business $21 (1–300 мест), Standard от $30 (годовая)/$35 помесячно, Plus $50–60, Frontline — при 150+ мест Standard/Plus; overage $15–40/power-user/мес (https://coworker.ai/blog/gemini-enterprise-pricing, 2026-08-25; https://www.gosearch.ai/faqs/gemini-enterprise-pricing/, 2026-09-02 — там Business 1–500 мест; **расхождение по потолку**). GoSearch сам оговаривает: «Google isn't consistent about publishing these numbers».
- Agentspace переименован в Gemini Enterprise 09.10.2025 (GoSearch). Число коннекторов — не найдено; «полная библиотека коннекторов» открывается со Standard.
- EU: «sovereign controls» в Plus (coworker) — конкретики нет.
- Слабые места: отзывы «buggy products and snail speed», продукт «early-lifecycle» (coworker, третья сторона).
- SMB: Business-редакция ≤300/500 мест — прямой SMB-план по цене Copilot Business ($21).

### Notion AI
- Plus $10, Business $20/участник/мес (годовая), Enterprise custom; Business включает Notion Agent, AI Meeting Notes, Enterprise Search (Beta); Enterprise — zero data retention у LLM-провайдеров (https://www.notion.com/pricing, открыто 2026-09-05). Помесячно Business $24 (из выдачи). Custom Agents — $10/1 000 кредитов с 04.05.2026; standalone AI add-on $10 отменён 05.2025 (https://coworker.ai/blog/notion-ai-pricing, 2026-07-31).
- Enterprise Search коннекторы: Slack, Teams, GitHub; Jira, Box, OneDrive, Salesforce, Asana — beta (notion.com/pricing).
- EU: data residency (eu-central-1 Frankfurt / eu-west-1 Ireland) только Enterprise, бесплатно, только data at rest; Calendar/Mail/beta не покрыты (https://www.notion.com/help/data-residency).
- Слабые места: «works primarily within Notion's own content… not built to execute multi-step work across your other tools» (coworker).
- SMB — родной сегмент; вертикалей нет.

### Guru
- Страница цен переведена на «custom»: «Guru is a platform and expertise solution — not just a per-seat tool», «100+ enterprise tools out of the box» (https://www.getguru.com/pricing, открыто 2026-09-05). Ранее: Professional $25/пользователь/мес, минимум 10 мест ($300/мес); медианный чек $540/год по 513 покупкам; TrustRadius 9.6/10 (556 отзывов, 03.2026) (https://costbench.com/software/knowledge-management/guru/, верифицировано 2026-07-01, третья сторона). Coworker: $25 годовая / $30 помесячно, 10 мест (из выдачи).
- Слабые места (costbench): поиск ломается на опечатках, AI смешивает внешние и внутренние данные, нет офлайна, убрали public links.
- Раунды/оценка — не найдены (Bing News пусто). Партнёрство с Boomi (BusinessWire, 05.2026 — из выдачи).
- SMB/mid-market — целевой сегмент; отраслевых пакетов нет.

### Moveworks (ServiceNow)
- Сделка $2.85B, закрыта 15.12.2025; 5.5M сотрудников-пользователей, ~90% деплоев на 100% штата, ~250 общих клиентов с ServiceNow; 100+ интеграций; G2-минусы: «generic results» на нишевые запросы, нет BYO-LLM (https://www.eesel.ai/blog/moveworks, ред. 2026-07-29, третья сторона).
- Цена: нет публичной; Vendr: $15–30/сотрудник/год (10k+), $20–40 (1–5k); AWS Marketplace ~$150/пользователь/год (1 000–2 500); медианный ACV $130k (диапазон $89.7k–297.5k); «targets organizations with at least 1,000 employees» (https://unthread.io/blog/moveworks-pricing/, 2026-04-21, третья сторона).
- Для сегмента 30–500 — не игрок.

### Dust (Париж)
- Series A $16M, Sequoia, 27.06.2024, ARR $1M, клиенты Qonto (75% из 1 600 сотрудников ежемесячно), Alan, PayFit, Pennylane (https://techcrunch.com/2024/06/27/dust-grabs-another-16-million-for-its-enterprise-ai-assistants-connected-to-internal-data/) `[>24 мес]`. Более поздние раунды — не найдено.
- Цены после overhaul 24.06.2026: Free $0/500 кредитов; Pro $30/место/мес ($24 годовая, 8 000 кр.); Max $150 ($120, 40 000 кр.); Enterprise custom с пулом кредитов; Business self-serve до 100 мест, 20+ коннекторов, US/EU residency; Enterprise — unlimited connectors & MCP, single-tenant; API $0.01/кредит (https://www.usagepricing.com/blueprint/dust, третья сторона). До этого — €29/место flat.
- Слабые места: Enterprise от 100 пользователей, «initial implementation help… weak at best», крутая кривая для не-разработчиков, 1 GB/пользователь на Pro; G2 4.9/5 по 19 отзывам (https://costbench.com/software/ai-search-enterprise/dust-tt/, 2026-06/07, третья сторона).
- Самый близкий к нашему квадранту европейский игрок (self-serve, EU-хостинг, mid-market), но без отраслевой глубины и без Испании.

### Sana (Workday)
- Workday: соглашение 16.09.2025, ~$1.1B; «over one million users across hundreds of enterprises», Merck, Polestar; Sana Agents, enterprise search по Workday/Google Drive/SharePoint/Office365 (https://newsroom.workday.com/2025-09-16-Workday-Signs-Definitive-Agreement-to-Acquire-Sana). Закрытие 11.2025 за ~$1.0B cash (SEC 10-Q — в выдаче). Шведская компания (TechFundingNews в выдаче).
- Как горизонтальный конкурент для SMB в Испании — фактически выбыл (интеграция в Workday).

### Onyx (ex-Danswer, open source)
- Seed $10M (Khosla, First Round, YC) 12.03.2025; 40+ коннекторов; self-host / Onyx Cloud (AWS) / airgapped с локальными LLM; клиенты Netflix (14k+), Thales, UCSD (37k), Ramp (https://onyx.app/blog/seed-round). TechCrunch 12.03.2025 в выдаче.
- Цены: Business $20/пользователь/мес годовая (40+ коннекторов, custom agents, Slack); Enterprise — SSO, on-prem, region-specific, white-label; 20k GitHub stars (https://www.onyx.app/pricing, открыто 2026-09-05).
- Слабые места по HN Launch (YC W24, https://news.ycombinator.com/item?id=46045987, 11.2025): «users just want a chat window for AI» (tomasphan), «full of features ticked off a list that nobody has actually tried to use» (rao-v), 12 контейнеров в default (unleashit), «VC-backed open source… will enshitificate» (haolez). Сам pivot от enterprise search к chat-UI — сигнал, что чистый поиск не продавался.
- Раунды после seed — не найдено (в Bing News «Onyx» — другая компания, Onyx Security).

### Writer
- Оценка $1.98B при $326M total (06.2025); ARR $47M (11.2024); 300+ enterprise-клиентов; Salesforce Ventures (10.2025) (https://sacra.com/c/writer/, третья сторона). Официальная страница планов — 403.
- Цены: Starter $39 помесячно / $29 годовая, до 5 мест (eesel — из выдачи); Vendr: Team $18–25/пользователь/мес годовая, медианный контракт $28 910/год, mid-market 100–500 мест — $75k–250k/год (https://www.vendr.com/marketplace/writer, 02.2026, третья сторона). Enterprise — Knowledge Graph, все коннекторы, flexible deployment.
- Позиционирование — контент/агенты для enterprise; для 30–500 — дорого и без вертикальных пакетов под испанский рынок.

### Qatalog
- Сайт qatalog.com редиректит на https://clickup.com/qatalog-acquisition: «ClickUp acquired Qatalog… Enterprise AI Search, Ambient Agents» интегрируются в ClickUp. Дата и сумма — не найдены. Как самостоятельный конкурент — выбыл.

### Coveo
- Модель: query-based, «each pricing unit includes 100k queries per month», Workplace — seat-based, multi-region hosting как add-on, hybrid cloud/on-prem (https://www.coveo.com/en/pricing).
- FY2026 (год до 31.03.2026): выручка $148.3M (+11%), SaaS $142.5M (+13%), GenAI ≈13% ARR, NRR core 103% (https://www.theglobeandmail.com/investing/markets/stocks/CVO-T/pressreleases/2189135/coveo-solutions-q4-earnings-call-highlights/, 2026-05-27). Акции −57% от пика (Globe and Mail, 07.2026).
- Enterprise/commerce-фокус, не SMB.

### Elastic
- Цены — resource/usage-based, три модели (hosted, serverless, self-managed) (https://www.elastic.co/pricing). Документация Enterprise Search 8.19 помечена «no longer updated» (https://www.elastic.co/guide/en/enterprise-search/current/index.html); точная дата снятия Workplace Search — **не подтверждена** (страница deprecation — 404). Elastic — платформа для тех, кто строит сам; не turnkey-конкурент в SMB.

### Sinequa (ChapsVision)
- Куплена ChapsVision 18.11.2024 параллельно с раундом $90M ChapsVision (https://www.businesswire.com/news/home/20241118794850/en; https://www.kmworld.com/Articles/ReadArticle.aspx?ArticleID=166902). ChapsVision: €200M выручки 2024, ~1 000 сотрудников, 29 покупок с 2019, 2 000+ клиентов, 40 стран (https://www.chapsvision.com/). Sinequa: 200+ коннекторов, кейсы «400M документов, 200 000 пользователей», отрасли — manufacturing, life sciences, aerospace/defense, legal, energy (https://www.sinequa.com/). Испанский офис — не найден. Крупный enterprise, не SMB.

### Mistral (Le Chat → Vibe)
- Ребрендинг Le Chat → Vibe 05.2026 (https://en.wikipedia.org/wiki/Mistral_AI; MSN «Mistral Vibe review», из выдачи). Официально: «deploy Vibe on-premises, in a private cloud, or on Mistral Cloud with full data residency»; «100+ tools… through connectors and full MCP compatibility»; Team/Enterprise без цен (https://mistral.ai/products/le-chat, открыто 2026-09-05).
- Третья сторона: Team $24.99/мес ($19.99 годовая) + $50 базовый сбор, мин. 2; Enterprise «от ~$20k/мес» (оценка); 40+ MCP-коннекторов (Snowflake, Databricks, GitHub, Atlassian, Box, Notion, Outlook…); минусы: каталог коннекторов ограничен, SOC 2 Type II в процессе (https://www.teamazing.com/blog/mistral-le-chat-enterprise-review/, обновл. 2026-08-30).
- Финансы: Series C €1.7B (ASML) при ~€11.7B, 09.2025 (teamazing); Wikipedia: ASML 11% за €1.3B, Bloomberg — €2B при €12B — **расхождение по сумме**; $830M долг (03.2026); партнёрство с Microsoft, модели в Copilot Studio (07.2026) (Wikipedia). «~$400M annualized revenue 2026» — teamazing, не подтверждено.
- Для нашего квадранта: главный «суверенный» европейский горизонтал с SMB-планом, но без отраслевой глубины; Испания — не найдено.

### Aleph Alpha (DE)
- Поглощена Cohere 24.04.2026, комбинированная оценка ~$20B (по NYT), Schwarz Gruppe вкладывает $600M в Cohere (https://en.wikipedia.org/wiki/Cohere). Выручка 2023 <€1M при плане $6M, убыток €18.9M; из «$500M» раунда 11.2023 только €110M — equity (https://en.wikipedia.org/wiki/Aleph_Alpha). Продукт — суверенные SLLM на европейской инфраструктуре, клиенты Deutsche Bank, SAP, Bosch, Bundesagentur für Arbeit (https://aleph-alpha.com/). Не SMB-игрок; пример провала «суверенный FM без продукта».

### Испанские игроки (проверка)
- **Sherpa.ai** (Бильбао): сейчас позиционируется как ИИ для бизнеса с «data sovereignty» и приватностью, в команде сооснователь Siri (https://www.msn.com/es-es/tecnología/inteligencia-artificial/xabi-uribe-etxebarria-el-ingeniero-vasco-que-le-dio-calabazas-a-apple-ahora-tengo-a-un-cofundador-de-siri-en-mi-equipo-de-sherpa-ai/ar-AA29ZAXR, ~08.2026). История: голосовой ассистент, Series A до $15M, 5M пользователей (https://techcrunch.com/2019/01/23/sherpa-a-spanish-voice-assistant-expands-series-a-to-15m-as-it-passes-5m-users/) `[>24 мес]`. Сайт sherpa.ai через фетч пуст (JS). Продукта класса Glean (коннекторы к системам компании, permission-aware поиск) — не подтверждено.
- **Clibrain** (Мадрид): LLM LINCE для испанского (https://www.businesswire.com/news/home/20230731851948/en/Clibrain-Introduces-LINCE-the-First-Language-Model-LLM-Optimized-for-Spanish-AI/, 31.07.2023) `[>24 мес]`; сайт — 403; новостей 2024–2026 в Bing News нет. Статус и продукт для компаний — **не установлены**.
- **Nuclia** (Барселона, RAG-as-a-service): куплена Progress Software 30.06.2025 (https://www.wtnh.com/business/press-releases/globenewswire/9486946/progress-software-acquires-nuclia-an-innovator-in-agentic-rag-ai-technology/; https://sdtimes.com/agentic-ai/progress-software-unveils-rag-as-a-service-platform/), теперь «Progress Agentic RAG» — инфраструктура для разработчиков (30+ форматов, 40+ LLM), а не ассистент сотрудника (https://www.progress.com/agentic-rag). Сумма — не найдена.
- Вывод: **испанского горизонтального игрока класса Glean для 30–500 сотрудников не найдено.** Локальные попытки либо инфраструктурные (Nuclia), либо модельные (Clibrain), либо перепозиционированные (Sherpa.ai).

---

## 3. Некролог категории (enterprise search / knowledge AI, последние ~5 лет)

Проверено; «убыточно/дистресс» отмечено только там, где есть основания.

| Компания | Что случилось | Дата | Условия | Причина / комментарий | Источник |
|---|---|---|---|---|---|
| **Aleph Alpha** (DE) | Поглощена Cohere | 24.04.2026 | Комбинированная оценка ~$20B; Schwarz +$600M в Cohere | Провал коммерциализации: выручка 2023 <€1M, убыток €18.9M; «$500M» раунд — лишь €110M equity | Wikipedia Cohere / Aleph Alpha |
| **Sana Labs** (SE) | Куплена Workday | объявл. 16.09.2025, закрыто 11.2025 | ~$1.1B (закрыто ~$1.0B cash) | Успешный выход, но категория «горизонтальный enterprise search» ушла в HCM-вендора | newsroom.workday.com |
| **Moveworks** | Куплена ServiceNow | закрыто 15.12.2025 | $2.85B | Выход; последняя частная оценка $2.1B (2021) `[НЕТ ИСТОЧНИКА — не для питча]`; standalone-продукт растворяется в Now Assist | eesel.ai, unthread.io |
| **Dashworks** | Куплена HubSpot | 16.04.2025 | Не раскрыто; команда → HubSpot AI, технология → Breeze Copilot | Небольшой acqui-hire-стиль выход горизонтального поисковика | cmswire.com (выдача Bing News) |
| **Qatalog** (UK) | Куплена ClickUp | дата не найдена | Не раскрыто | Не продалась как standalone | clickup.com/qatalog-acquisition (редирект с qatalog.com) |
| **Sinequa** (FR) | Куплена ChapsVision | 18.11.2024 | Не раскрыто; ChapsVision одновременно подняла $90M | Консолидация «старого» enterprise search во французского роллап-игрока | BusinessWire 20241118794850, KMWorld 166902 |
| **Nuclia** (ES) | Куплена Progress Software | 30.06.2025 | Не раскрыто | RAG-инфраструктура, не продукт для сотрудника | GlobeNewswire via WTNH, SD Times |
| **Doti AI** (IL) | Куплена Salesforce | ~12.2025 | «около $100M» (по сообщениям) | Enterprise search «barely out of stealth» — покупка технологии | MSN ar-AA1QoCA9 (выдача; статья не открылась) |
| **Onna** | Куплена Reveal | 07.05.2024 | Не раскрыто | Ушла из knowledge в eDiscovery | BusinessWire 20240507774586, Law.com |
| **Humu** | Куплена Perceptyx | 02.08.2023 | Не раскрыто | Nudge/behavioral, не search; малый выход | Yahoo Finance (выдача Bing News) `[>24 мес]` |
| **Lucy AI** | lucy.ai редиректит на capacity.com | дата не найдена | Не найдено | Поглощение Capacity — детали не подтверждены | редирект, зафиксирован 2026-09-05 |
| **Swiftype** | Куплена Elastic | 11.2017 | Не раскрыто | Workplace Search — документация «больше не обновляется» (8.19); точная дата снятия — не подтверждена | Wikipedia Swiftype `[>24 мес]`; elastic.co docs |
| **Attivio** | Куплена ServiceNow (2019) | — | — | `[НЕТ ИСТОЧНИКА — не для питча]` (Wikipedia-страница 404) | — |
| **Onyx/Danswer** | Жив, но pivot от enterprise search к chat-UI (HN, 11.2025) | — | — | Косвенный сигнал: «чистый поиск» не продавался | news.ycombinator.com/item?id=46045987 |

Живы и не в некрологе (проверено 09.2026): **Lucidworks** (выручка $75M, 08.2025 — Wikipedia), **Yext** (публичная, ARR $440.8M, Q2 FY27, 09.2026 — Grafa/01net в выдаче; take-private — не найдено), **Hebbia** (Series B $130M 2024 — Wikipedia; ARR $13M по cryptobriefing 09.2026 — третья сторона), **Kognitos** (финансовая автоматизация), **Slite** («1 700+ компаний»), **Tettra**, **Kore.ai** (инвестиция AllianceBernstein ~02.2026 — MarketWatch в выдаче). **Twine**, **Klart** — не проверялись/не найдены.

---

## 4. Бенчмарк цен «за место» — knowledge/enterprise AI для среднего бизнеса

| Продукт | Список $/место/мес (годовая) | Помесячно | Минимум | Что включено | Источник, дата | Характер |
|---|---|---|---|---|---|---|
| Notion Plus | $10 | — | 1 | без полного AI | notion.com/pricing, 09.2026 | измерено (список) |
| Claude Team | $20 | $25 | 2 (макс. 150) | AI + Cowork + enterprise search + M365 | claude.com/pricing, 09.2026 | измерено (список) |
| Claude Enterprise | $20 + usage по API | — | 20/50 (третья сторона) | платформа без токенов | claude.com/pricing | измерено (список) |
| ChatGPT Business | $20 | $25 | 2 | агенты 40 сообщ./мес | GoSearch 06.2026, coworker 08.2026 | третья сторона |
| ChatGPT Business Premium | $100 | $125 | — | без 5-часового лимита | MSN/CIO, 08.2026 | заявлено (новость) |
| Notion Business (AI incl.) | $20 | $24 | 1 | Agent, Meeting Notes, Enterprise Search beta | notion.com/pricing, 09.2026 | измерено (список) |
| Onyx Business | $20 | — | не указан | 40+ коннекторов, self-host/cloud | onyx.app/pricing, 09.2026 | измерено (список) |
| Mistral Team | $19.99 | $24.99 (+$50 базово) | 2 | EU-хостинг | teamazing 08.2026 | третья сторона |
| Microsoft 365 Copilot Business | $21 (промо $18) | $25 | ≤300 мест, на базе Business Std/Premium ($12.50–22 сверху) | Copilot в M365 | GoSearch/explainx 08.2026 | третья сторона |
| Gemini Enterprise Business | $21 | — | 1–300/500 | ограниченные квоты | coworker/GoSearch 08–09.2026 | третья сторона |
| Dust Pro | $24 | $30 | 1 (self-serve ≤100) | 8 000 кредитов | usagepricing 06.2026 | третья сторона |
| Guru Professional | $25 | $30 | 10 | KM + AI | costbench 07.2026 | третья сторона |
| Writer Team | $18–25 (Vendr) / $29 (Starter) | $39 | Starter ≤5 | контент-агенты | Vendr 02.2026 | третья сторона |
| Microsoft 365 Copilot (Enterprise) | $30 | — | 1 (на E3/E5) | + база E3 ~$39 / E5 ~$60 с 07.2026 | microsoft.com (Copilot Studio page) 09.2026; explainx | измерено (список) / третья сторона |
| Gemini Enterprise Standard | $30 | $35 | 1 | полная библиотека коннекторов | coworker 08.2026 | третья сторона |
| Gemini Enterprise Plus | $50–60 | — | 1 | + sovereign controls | coworker 08.2026 | третья сторона |
| Glean | ~$45–50 + $15 AI ≈ $60–75 | — | ~100 мест / $50–60k+ год | enterprise search + agents | Fritz 03.2026, GoSearch 06.2026 | третья сторона |
| ChatGPT Enterprise | ~$45–75 (сомнительно) | — | «150 мест» (один Reddit-пост 2023) | — | coworker 08.2026 | сомнительно |
| Dust Max | $120 | $150 | — | 40 000 кредитов | usagepricing 06.2026 | третья сторона |
| Moveworks | $1.25–3.75 (= $15–45/сотр./год) | — | ~1 000 сотрудников | ITSM/HR-агент | unthread 04.2026 (Vendr) | третья сторона |

Вывод по ценам: для компании 30–500 человек «рыночная полка» горизонтальных ассистентов — **$20–30/место/мес** (Claude Team, ChatGPT Business, Notion Business, Copilot Business, Gemini Business, Dust Pro, Onyx). Всё, что глубже интегрировано с системами и permission-aware (Glean, ChatGPT Enterprise, Gemini Plus), стоит **$50–75** и требует 100+ мест / $50k+ в год. Между ними — пустота по цене и по функции.

---

## 5. Что не нашёл

- Официальные страницы OpenAI (ChatGPT Business/Enterprise, connectors, Company Knowledge), Microsoft `/copilot/business` и `/copilot/enterprise`, Writer `/plans`, Google `gemini-enterprise` pricing — не открылись (403/503/404/слишком большая). Все цифры по ним — третьи стороны.
- Число платных бизнес-мест ChatGPT Enterprise; минимум мест Enterprise официально.
- EU data residency у Claude Enterprise; официальный минимум мест Claude Enterprise.
- Точный потолок мест Gemini Enterprise Business (300 vs 500) и число коннекторов.
- Отзывы Reddit (r/sysadmin, r/msp) и G2 — фетч заблокирован; заменены Computerworld/Gartner-опросом, MS Learn blueprint и HN-комментариями.
- Раунды Dust после 06.2024, Onyx после 03.2025, Guru — вообще; Hebbia после 2024.
- Даты/суммы сделок Qatalog→ClickUp, Lucy AI→Capacity, Nuclia→Progress, Doti→Salesforce (только «~$100M» из сниппета).
- Дата снятия Elastic Workplace Search.
- Испанские клиенты у Glean/Dust/Mistral/Notion; испанские офисы у всех стартапов.
- Коннекторы к ERP среднего бизнеса Испании (Sage, Dynamics 365 BC, Odoo, Holded, a3) — **ни у одного игрока не найдено упоминаний**; у Copilot Studio (1 400+ коннекторов Power Platform) Dynamics 365 BC заведомо есть, но Holded/a3 — нет данных.
- Статус Clibrain 2024–2026; Twine, Klart.

## 6. Что сомнительно

- «$60/место, 150 мест» для ChatGPT Enterprise — растиражированная цифра из одного Reddit-поста 2023 (coworker.ai сам это отмечает). Не использовать в питче без оговорки.
- «Go plan 10–149 пользователей $35–40» (inference.net) — не подтверждено.
- Промо Copilot Business $18: до 30.09.2026 (одна выдача) vs 31.12.2026 (explainx) — расхождение.
- Размер раунда Mistral 09.2025: €1.7B (пресс) vs €2B при €12B (Bloomberg via Wikipedia).
- Минимумы мест Glean (100 vs 100–250) и Enterprise-минимум Dust (100) — только третьи стороны, часто конкуренты (GoSearch, Coworker, Onyx-калькулятор).
- «Проникновение Copilot 6.5%» — сниппет, страница не открыта.
- ARR Hebbia $13M и выручка Mistral ~$400M — единичные третьи стороны.

## 7. Вывод: где у горизонталов «пустой квадрант» относительно 30–500 человек и отраслевой глубины

1. **По цене и минимумам** рынок разорван надвое: «дешёвые генералисты» $20–30/место с 1–2 мест (Claude Team, ChatGPT Business, Notion, Copilot Business, Gemini Business, Dust, Onyx) и «глубокие permission-aware платформы» $50–75 со входом от 100–250 мест и $50–100k+/год (Glean, ChatGPT Enterprise, Gemini Plus/Frontline, Moveworks от 1 000 сотрудников, Sinequa/Coveo — крупный enterprise). Компания на 30–500 человек с бюджетом $10–60k/год либо получает чат без реальной связки с системами, либо не проходит по минимуму.
2. **По коннекторам к «испанскому» стеку** (Sage, a3, Holded, Odoo, Dynamics 365 BC, локальные банки/электронное выставление счетов) — ни один горизонтал не заявляет поддержку; каталоги строятся вокруг Slack/Google/Microsoft/Salesforce/Jira/Confluence. Единственный путь для SMB — Copilot Studio (1 400+ Power Platform-коннекторов) с его кредитной тарификацией и рисками oversharing, либо MCP «сделай сам» (Claude, Mistral, Dust Enterprise, Onyx).
3. **По суверенности/ЕС** реальную on-prem/private-cloud опцию для SMB дают только Mistral (Vibe Enterprise, по запросу) и Onyx (OSS/self-host); Dust — EU residency в self-serve. У Glean/Claude EU-residency не подтверждена; Notion — только на Enterprise; OpenAI — только Enterprise; Copilot — EU Data Boundary (плюс).
4. **По присутствию в Испании** — у всех стартапов ноль публичных испанских кейсов/офисов; локальные игроки ушли в инфраструктуру (Nuclia→Progress), модели (Clibrain) или репозиционируются (Sherpa.ai). Гиганты присутствуют, но продают SKU, а не внедрение.
5. **По отраслевой глубине** — вертикальные пакеты у горизонталов появляются только сверху (Glean: sales/financial services MCP; Moveworks: ITSM/HR; Coveo: commerce/service; Sinequa: life sciences/defense/legal). В SMB-планах вертикалей нет ни у кого.
6. **Сигнал консолидации**: за 2024–2026 горизонтальный enterprise search как самостоятельная категория поглощён (Sana→Workday, Moveworks→ServiceNow, Dashworks→HubSpot, Qatalog→ClickUp, Doti→Salesforce, Sinequa→ChapsVision, Nuclia→Progress, Aleph Alpha→Cohere), а Onyx сделал pivot в chat-UI. Выживает либо масштаб (Glean $300M ARR), либо встраивание в систему записи. Для нового игрока это аргумент **не строить «ещё один Glean»**, а занять пустой квадрант: **30–500 человек × EU/испанский стек данных × отраслевые рабочие процессы (выполнение работы, а не только ответы) × вход $20–40/место без 100-местного минимума и с EU-размещением**. Это единственная комбинация, где ни один из 20 проверенных игроков сегодня не имеет ни продукта, ни цены, ни присутствия.
