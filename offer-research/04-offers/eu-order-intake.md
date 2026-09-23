# Order Intake: заказы из почты, PDF и Excel превращаются в черновик заказа в вашей учётной системе

Европа (SE/NO/FI, UK/IE; NL/BE/DK/SE) · Итоговый балл после адвоката дьявола: **сегмент A (E1) — 69, сегмент B (E2) — 67** · Статус: **основной тест**

Движок один: почта и вложения → извлечение → сверка со справочниками клиента → черновик или файл импорта → экран проверки. Меняются только выход (ERP или TMS) и справочники.

## Оффер одной строкой
**За 3 недели заказы, которые клиенты шлют письмом, PDF или Excel, начинают сами появляться черновиками в вашей ERP или файлом импорта для вашей TMS. Человек их только подтверждает. $5 000 за пилот, ещё $2 500 — только если выйдем на согласованный порог. Годового контракта нет, код остаётся у вас.**

## Кому (ICP)
| | **A. Оптовые дистрибьюторы** | **B. Экспедиторы и перевозчики** |
|---|---|---|
| Отрасль | NACE 46.69, 46.73, 46.74, 46.3, 46.52 | NACE 52.29, 49.41 |
| Размер | 50–500 чел. и **≥40 заказов по почте в день** (квалифицируем) | **50–249 чел.** или ≥40 заказов в день (раньше было 20–249) |
| Гео | SE, NO, FI; UK, IE | NL, BE, DK, SE (Baltics и PL — позже: час стоит €16–18) |
| Учётная система | Visma (.net / Business NXT), Sage 200, Business Central on-prem или NAV; клиенты со **заказами в Excel** или письмами на SE/NO/FI | TMS без собственного AI-ввода: Transpas, локальные NL/DK/SE-системы, самописные, планирование в Excel |
| ЛПР | COO / Operations Director, Head of Customer Service / Inside Sales; в небольших компаниях — CFO | Operations Director / COO / владелец |
| **Исключаем** | **BC Online с ящиком M365** (там уже есть Microsoft Sales Order Agent), NL/BE (Hyperfox, Lleverage, OrderPilot), PL/Baltics | **Клиентов Sinari и Qargo**; клиентов Soloplan — только если они не купили модуль распознавания; DE (нужен немецкий) |
| Размер списка | ≈1–2 тыс. после исключений [О]; ядро до исключений ≈4 300 (Eurostat SBS 2023 + ONS 2025) | 20–249 чел. в 10 странах: ≈1 050 экспедиторов и ≈7 950 перевозчиков (Eurostat SBS 2023). Сколько останется при 50–249 чел. и фильтре по TMS, не посчитано |
| Откуда выгружать | NO — API Brønnøysund (450 юрлиц: код 46, 50–500 чел.); SE — allabolag; FI — YTJ/Vainu; UK — Companies House; IE — CRO; LinkedIn Sales Navigator. ERP ищем по вакансиям («Visma Business», «Sage 200»), страницам кейсов партнёров, BuiltWith/Wappalyzer | FENEX (687 членов), TLN, WCA/FIATA, вакансии planner / order entry на Indeed и LinkedIn. Apollo — объём не проверен |

ERP или TMS удаётся определить снаружи примерно у 30–50% компаний (у TMS — примерно у трети) [О]. Поэтому на сбор списка закладываем **3–4 дня**.

## Почему сейчас
- **Регуляторного триггера с датой нет ни в одном сегменте.** Оффер держится на ROI и на сигнале с уровня компании: вакансии order entry / planner, адрес orders@ или «email us your order» на сайте.
- **A:** 02.09.2026 Microsoft перевела Sales Order Agent в BC в статус GA ([MS Learn](https://learn.microsoft.com/en-us/dynamics365/business-central/sales-order-agent-setup)). Сама категория становится нормой, но агент не читает Excel, не поддерживает шведский, норвежский и финский и работает только в BC Online. Все остальные остаются без него, и именно это наш клин.
- **B:** CargoWise с 01.12.2025 берёт плату за транзакцию ([WiseTech](https://www.wisetechglobal.com/news/wisetech-global-launches-cargowise-value-packs-introducing-substantial-new-product-capabilities-and-simplified-billing/)). Это только вторичный угол: счёт от наших услуг не уменьшается. Дефицит кадров в NL (4.1% вакансий во II кв. 2026, Eurostat) на этом этапе заново не перепроверялся.

## Боль в деньгах
**Экономия в год = заказов в день × минут на заказ ÷ 60 × 230 дней × стоимость часа (Eurostat lc_lci_lev) × 60–70% снимаемого времени.**
- Допущения [О]: число заказов в день (25–100 в A и 37–75 в B), доля 60–70%, 230 рабочих дней. Минуты на заказ (5–15) взяты у вендоров.
- **A:** затраты $25–120k в год, экономия $25–44k в год при объёме вдвое ниже исходного допущения. Ставка часа: SE €43, NO €49, IE €32.
- **B:** считаем только ввод заказов: $30–100k в год в NL/BE; при 37 заказах в день экономия ≈$30–35k (€41/ч).
- Вывод: ниже 40 заказов в день подписка съедает половину экономии и больше. Поэтому это порог квалификации.

## Что продаём
- **Пилот, 3 недели, 1–2 человека.**
  - **Неделя 0**, бесплатно: прогон 20–30 реальных заказов клиента и выгрузки каталога, доступ к ERP/TMS.
  - **Неделя 1:** подключение к одному ящику или папке orders@ (не ко всему M365).
  - **Неделя 2:** извлечение, сопоставление артикулов покупателя с SKU (A) или адресов и клиентов со справочником TMS (B), очередь исключений.
  - **Неделя 3:** работа в бою на 1–3 крупных клиентах и отчёт «до/после» в минутах на заказ.
- **Выход A:** черновик заказа в Visma / Sage 200 / BC on-prem.
- **Выход B:** **структурированный заказ в формате импорта, который TMS уже принимает (EDI / XML / CSV)**, плюс экран проверки. Интерфейс вендора TMS для этого не нужен.
- **Цена:** $5 000 фикс + $2 500 при достижении порога. Порог — доля строк (A) или заказов (B) без правок на согласованной выборке, ставим по цели клиента. Для B стартовая точка обсуждения — 60%.
- **Гарантия:** порог не достигнут — возвращаем 100% из $5 000.
- **Безопасность:** DPA; хостинг в ЕС; LLM не обучается на данных клиента; минимальные права и лог действий. Разворачиваем в тенанте клиента и передаём код и инструкцию. Письма в ящике не трогаем: если разбор не удался, заказ идёт старым путём, а оператор получает алерт. SLA — в рабочие часы.
- **Дальше:** подписка за заказ или строку с полом **€600–800 в месяц (A)** и **$500–700 в месяц (B)**.
  - Модули по €3–5k: запросы цен и КП, подтверждения; для B — Quote Draft.
  - **Первые 2–3 пилота — за $3–5k** в обмен на именной кейс.
- **Побочный продукт A:** для BC Online — «SOA readiness & tuning» за $3–5k через BC-партнёров: чистка Item References, преобразование Excel → PDF, правила ящика.

## Чем заменяем кейсы
- Бесплатный прогон на своих письмах — это вход в разговор, а не отличие: у Hyperfox, Rossum, Nexcade и SOA он тоже есть.
- Отличаемся условиями: **нет 12-месячного контракта** (у Hyperfox, Workist и Rossum он минимальный); вторая часть оплаты — только за результат; код и развёртывание остаются у клиента; методика замера открытая (по таймстемпам в ERP/TMS).

## Почему мы, а не коробка
- **A:**
  - **Microsoft SOA:** встроен в BC Online, ≈$4–5k в год [О], цена кредита не проверена. Не читает Excel, нет SE/NO/FI, нет on-prem/NAV, не распознаёт пересланные письма.
  - **Continia Document Capture:** уже умеет sales orders и сидит у BC-партнёров в Nordics.
  - **Hyperfox, Lleverage, OrderPilot** — NL, контракты на 12 месяцев, кейсы «4 FTE» и «90%» ([lleverage.ai](https://www.lleverage.ai/)).
  - **Rossum:** от $18k в год, триал, контракт 12 месяцев.
  - **Canals, Conexiom** — американские ERP. **Choco** — только food service.
  - **Наша дыра:** Visma (свободна, но API не проверен), Sage 200 (европейских игроков не нашли), BC on-prem/NAV, Excel, SE/NO/FI.
- **B:**
  - **Sinari Smart OT, Soloplan CarLo (text recognition), Qargo Intelligence** — ввод встроен в саму TMS, и вендор ещё и привратник интерфейса.
  - **Nexcade, 5U AI, Raft** — CargoWise и крупные клиенты, только через демо.
  - **CargoMind** — микроперевозчики, €0.049 за действие.
  - **FreightMynd** — кастом за 4–8 недель.
  - **Наша дыра:** TMS без своего AI-ввода, выход через существующий импорт, 3 недели.
- **Канал в обоих сегментах:** партнёры Visma / BC / Sage и внедренцы TMS без AI-модуля (Transpas), реферальная доля 15–20%.

## Первое письмо
### A. Дистрибьюторы (EN)
**Подставляем:** {ERP} из вакансий или кейсов партнёра; {signal} — orders@ на сайте или вакансия order entry; {language} сайта/переписки; Excel-прайс или бланк заказа.

> **Subject:** Customer orders into {Visma / Sage 200} without retyping
> Hi {Name}, I noticed {Company} asks customers to email orders to {orders@…} and is hiring an {order entry} role.
> We set up a flow that reads those emails, PDFs and Excel files, matches customer part numbers to your SKUs and creates draft sales orders in {ERP}. Your team approves each one.
> Fixed 3-week pilot, no annual contract, runs in your own tenant. The second half of the fee is due only if we hit the target we agree on together.
> Roughly how many orders a day come in by email?

**Вариация 2 (Excel и язык; BC on-prem / BC со шведским, норвежским или финским):**
> Hi {Name}, Microsoft's new Sales Order Agent only reads PDF and image attachments, doesn't list {Swedish/Norwegian/Finnish} as a supported language and runs only on BC Online (per Microsoft's docs). Many of {Company}'s orders probably arrive as Excel files in {language}.
> We cover that gap: email and Excel orders become draft orders in {ERP}, and a person confirms each one. Worth a look at 20 of your real orders?

**Вариация 3 (контроль и риск):**
> Hi {Name}, most order-automation vendors ask for a 12-month contract before you see results on your own data.
> We do a fixed 3-week pilot for {Company}: email and Excel orders become drafts in {ERP}, the code runs in your tenant and stays with you. If we miss the target we agree on, you get a full refund. Do you get more or fewer than 40 orders a day by email?

### B. Экспедиторы и перевозчики (EN)
**Подставляем:** вакансия (planner / order entry) и город; TMS, если видно, иначе спрашиваем; упоминание EDI у клиента; членство в FENEX, TLN или WCA.

> **Subject:** {Company}: order emails into {TMS} import
> Hi {Name}, saw {Company} is hiring a {planner} in {city}, often a sign that orders still get retyped from email and PDF.
> We turn those emails into structured orders in the import format your TMS already accepts (EDI / XML / CSV). A planner confirms each one, and if parsing fails the order just goes the old way.
> Fixed 3-week pilot, no annual contract. Which TMS are you on?

**Вариация 2 (только для пользователей CargoWise):**
> Hi {Name}, since 1 Dec 2025 CargoWise charges per job. The one thing you still control is how many jobs one person can handle.
> We turn booking emails and PDFs into CargoWise-ready drafts that your team reviews. It's a fixed 3-week pilot measured in minutes per job on your own mailbox. Worth a 15-minute look?

**Вариация 3 (EDI-вопрос):**
> Hi {Name}, your large shippers probably send orders by EDI, while everyone else sends email and PDF that someone keys in by hand.
> We give that second group the same treatment: email in, file out in the format your {TMS} imports, and a human checks it. Could we try it on 20 anonymised order emails?

## План теста
- **180 контактов, 2 недели:**
  - **A — 90** (SE/NO/FI 50, UK/IE 40): только компании с подтверждённой ERP вне BC Online.
  - **B — 90** (NL/BE 50, DK/SE 40): 50–249 чел., TMS определена и не входит в список исключений.
- **Каналы:** email (3 касания за 10 дней) + LinkedIn connect к ЛПР.
- **Пороги считаем по каждому сегменту отдельно:** позитивных ≥3% — развиваем; 1–3% — меняем угол (ERP/язык → Excel → контроль; вакансия → EDI); <1% — закрываем сегмент.
- **Опережающий индикатор:** сколько компаний прислали 20–30 заказов на прогон. Отдельно считаем, в скольких ответах есть ≥40 заказов в день.
- **До рассылки замерить:**
  - у какой доли карточек удалось определить ERP/TMS;
  - сколько карточек просмотрено на одну компанию в списке;
  - доставляемость доменов.

## Что проверить руками до старта
1. **Visma API** (Developer Portal): можно ли создать Order/OrderLine, нужна ли регистрация приложения и сколько она стоит. Без этого Visma не берём.
2. **Sage 200 API:** можно ли создать sales order. В паспорте не проверено.
3. Опросить 2–3 Visma-партнёров в NO/SE: приходят ли заказы почтой или через EDI/портал.
4. AppSource и Visma Marketplace: есть ли уже приложения «sales order from email».
5. Цена Copilot Credits на PAYG (≈$0.01 — это оценка).
6. **Transpas:** есть ли импорт или API (сайт отдавал TLS-ошибку и 503). Условия интерфейсов Soloplan и CargoWise eAdaptor для третьих сторон.
7. Допущения «40–100 заказов в день» и «50–70% заказов по email» (вторая цифра — самоотчёт вендора). Проверяем на первых звонках.
8. Цифра Hyperfox €0.07 за строку устарела, в материалах не используем.

## Главные риски
- **Вендор системы — конкурент и привратник:** Microsoft SOA и Continia (A), Sinari, Soloplan и Qargo (B). Если фильтр по ERP/TMS окажется неточным, в список попадут компании, у которых задача уже решена.
- **Экономика на малом объёме:** при <40 заказов в день окупаемость около 1×.
- **Доверие:** нет кейсов, нужен доступ к ящику и записи в ERP. Закрываем DPA, развёртыванием у клиента, оплатой за результат и первыми пилотами за кейс. Сделка может затянуться на 1–3 месяца через VAR.
- **Visma API не проверен.** Если он закрыт, ветка A сужается до Sage 200 и BC on-prem.
- **Сбор списка дорогой:** ERP/TMS видна только у трети или половины компаний, поэтому просматривать придётся 400–600 карточек.
