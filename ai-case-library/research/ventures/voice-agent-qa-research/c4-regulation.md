# C4. Регуляторика: EU AI Act и спрос на независимый аудит голосовых AI-агентов

**Дата проверки:** 1 сентября 2026
**Проверяемое утверждение:** «EU AI Act и смежное регулирование порождают спрос на доказательство качества голосового AI-агента, которое может выдать обычная неаккредитованная компания, и не требуют, чтобы такие доказательства выдавал только назначенный (notified) орган».
**Порог опровержения:** если для голосовых агентов в целевых сценариях закон требует оценку соответствия строго третьей аккредитованной стороной — критерий опровергнут.

---

## ВЕРДИКТ

**Юридическая часть утверждения — ПОДТВЕРЖДЕНА (с одной оговоркой).**
**Коммерческая часть («порождает спрос») — ОПРОВЕРГНУТА в заявленной формулировке.**

Разложим, потому что утверждение склеивает два разных тезиса.

### Что подтверждено

Закон **не требует** notified body для целевых сценариев голосовых агентов. Art. 43(2) AI Act прямо: для high-risk систем из пунктов 2–8 Приложения III провайдер идёт по **Приложению VI (внутренний контроль), «which does not provide for the involvement of a notified body»**. Клиентский сервис, найм, кредитный скоринг, доступ к услугам — всё это пункты 2–8 либо вообще вне Приложения III. Порог опровержения **не достигнут**.

**Оговорка (единственная зона обязательной третьей стороны):** Приложение III **пункт 1 — биометрия**, куда попадают голосовая биометрическая идентификация и **распознавание эмоций по голосу**. По Art. 43(1) провайдер может выбрать внутренний контроль, только если **полностью применил** гармонизированные стандарты. Гармонизированных стандартов в Официальном журнале **нет ни одного** (см. п. 6) → условие невыполнимо → для этого узкого класса notified body формально обязателен. При этом notified bodies под AI Act в NANDO тоже **нет ни одного**. То есть этот сегмент сейчас не может обслужить никто, включая аккредитованных игроков.

### Что опровергнуто

Утверждение «порождает спрос **на доказательство**» не подтверждается фактами. Три независимых опровержения:

1. **Сроки уехали.** Digital Omnibus (Регламент (ЕС) 2026/1744, в силе с 27 июля 2026) перенёс обязанности по high-risk из Приложения III с 2 августа 2026 на **2 декабря 2027**, из Приложения I — на **2 августа 2028**. Главный драйвер срочности сдвинут на ~16 месяцев.
2. **То, что осталось на 2 августа 2026 (Art. 50), не требует никакого доказательства.** Обязанность — сказать собеседнику, что он говорит с машиной. Ни формата документа, ни аудита, ни отчёта. Официальный путь «продемонстрировать соответствие» — бесплатный добровольный Code of Practice Еврокомиссии, ~190 подписантов, либо «alternative equivalently adequate means» на усмотрение провайдера.
3. **Естественный эксперимент уже проведён и провален.** NYC Local Law 144 **обязывает** независимый bias audit и публикацию отчёта. Исследование 391 работодателя: отчёты опубликовали **18** (~4,6%). Аудит Контролёра Нью-Йорка (декабрь 2025) признал правоприменение неэффективным. Юридический мандат на независимый аудит **не создал** рынок независимого аудита. У нас же мандата нет вовсе.

**Практический вывод:** продавать «паспорт агента» как закрытие требований AI Act — **нельзя**, у отчёта нет юридического веса и он ничего не закрывает. Продавать как инженерный QA-артефакт для тендеров — можно, но это другой продукт, другой бюджет и рынок с уже сложившимися игроками (см. п. 5 и «Кладбище»).

---

## 1. Статья 50 — обязанность раскрывать, что собеседник машина

**Сроки.** Art. 50 применяется с **2 августа 2026** — Digital Omnibus его **не** переносил ([White & Case](https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act): отсрочка «does not apply to other obligations relevant to high-risk AI systems (notably the transparency requirements)»). Отдельный grace period до **2 декабря 2026** — только для маркировки AI-сгенерированного контента системами, размещёнными до 2 августа 2026 (Omnibus сократил его с шести месяцев до трёх).

**Кого касается.** Провайдеров (Art. 50(1)) и деплойеров (Art. 50(2)–(4)), включая внеевропейских, если результат используется в ЕС ([FAQ Еврокомиссии](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)).

**Что именно требуется.** Текст Art. 50(1) ([AI Act Service Desk, EC](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)): системы, взаимодействующие напрямую с людьми, должны быть спроектированы так, чтобы человек был информирован, что он взаимодействует с AI-системой, *«unless this is obvious from the point of view of a natural person who is reasonably well-informed»*. Информация даётся *«in a clear and distinguishable manner at the latest at the time of the first interaction»*.

**Какая форма доказательства требуется — ключевой ответ: НИКАКАЯ.**
- В тексте Art. 50 **нет** упоминаний сертификации, аудита или оценки третьей стороной (проверено по официальному тексту EC).
- FAQ Еврокомиссии: обязательной сертификации нет; Code of Practice **добровольный**.
- [Guidelines Еврокомиссии по Art. 50](https://digital-strategy.ec.europa.eu/en/policies/guidelines-transparency-ai-generated-content) (опубликованы 6 августа 2026): по маркировке контента соответствие демонстрируется присоединением к Code of Practice **либо** «alternative equivalently adequate means»; по остальным обязанностям Art. 50 провайдеры *«determine adequate measures themselves»*.
- [Code of Practice on Transparency of AI-generated Content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content) (финал 10 июня 2026, ~190 подписантов к концу июля 2026) покрывает Art. 50(2), (4), (5) — маркировку контента — и **не покрывает Art. 50(1)**, то есть ровно ту норму, которая касается голосового агента как собеседника.

**Санкции:** до €15 млн или 3% мирового оборота.

**Вывод по п.1 (главный удар по идее):** обязанность по Art. 50(1) для голосового агента исполняется **одной фразой в начале звонка**. Это работа на 20 минут разработчика, а не объект платного аудита. Регуляторного «крючка», который заставит владельца агента купить отчёт ради Art. 50, **нет**.

---

## 2. Какие голосовые агенты попадают в high-risk по Приложению III

Отнесение идёт **по назначению применения**, а не по модальности. Голос сам по себе high-risk не делает ([Annex III, AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3)).

| Пункт Annex III | Голосовой сценарий | Маршрут оценки |
|---|---|---|
| **1. Биометрия** | голосовая биоидентификация, распознавание эмоций по голосу | Art. 43(1) — **notified body, если стандарты не применены полностью** |
| 2. Критическая инфраструктура | голосовое управление/диспетчеризация | Annex VI, самооценка |
| 3. Образование | голосовое оценивание/приём | Annex VI |
| 4. Занятость | скрининг кандидатов по телефону, шортлист | Annex VI |
| 5. Существенные услуги | кредитоспособность физлиц; **триаж экстренных вызовов** | Annex VI |
| 6–8. Правоохрана, миграция, правосудие | — | Annex VI |
| **вне Annex III** | запись на приём, часы работы, статус заказа, callback | только Art. 50 |

**Что требуется от провайдера high-risk** (Chapter III, Section 2 + Section 3): система риск-менеджмента (Art. 9), управление данными (Art. 10), техническая документация по Приложению IV (Art. 11), логирование/record-keeping (Art. 12) с хранением логов (Art. 19), инструкции по использованию (Art. 13), человеческий надзор (Art. 14), точность/робастность/кибербезопасность (Art. 15), система менеджмента качества (Art. 17), оценка соответствия (Art. 43), декларация соответствия (Art. 47), маркировка CE (Art. 48), регистрация в базе ЕС (Art. 49).

**Сроки для всего этого — 2 декабря 2027** (Annex III), см. п. 7.

**Не пропустить, это важнее, чем кажется — Art. 6(4)** (официальный текст EC):
> *«A provider who considers that an AI system referred to in Annex III is not high-risk shall document its assessment before that system is placed on the market or put into service. Such provider shall be subject to the registration obligation set out in Article 49(2). Upon request of national competent authorities, the provider shall provide the documentation of the assessment.»*

Это **единственная реальная точка платного спроса**, которую я нашёл в законе для неаккредитованного игрока: обязательный письменный документ «почему мой голосовой агент НЕ high-risk», который надо предъявлять регулятору. Но это по природе юридическо-консалтинговый артефакт (юрфирмы уже его продают), а не воспроизводимый технический тест агента. *Допущение:* монетизировать это можно, но чек — консалтинговый (тысячи $, разовый), а не продуктовый.

---

## 3. Механика conformity assessment: где самооценка, где notified body

**Art. 43(1)** — Annex III **пункт 1 (биометрия)**: провайдер может выбрать Annex VI (внутренний контроль) **только** если применил гармонизированные стандарты Art. 40. Если стандарты не применены или применены частично (либо их нет / нет common specifications по Art. 41) — **обязателен Annex VII с notified body**.

**Art. 43(2)** — дословно ([EC AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-43)):
> *«For high-risk AI systems referred to in points 2 to 8 of Annex III, providers shall follow the conformity assessment procedure based on internal control as referred to in Annex VI, which does not provide for the involvement of a notified body.»*

**Annex VI целиком** (официальный текст EC) — четыре пункта, всё делает сам провайдер:
1. процедура состоит из пунктов 2, 3, 4;
2. провайдер **сам** проверяет соответствие своей QMS требованиям Art. 17;
3. провайдер **сам** изучает техдокументацию на соответствие Chapter III Section 2;
4. провайдер **сам** проверяет, что процесс разработки и пост-маркет мониторинг (Art. 72) соответствуют техдокументации.

**Annex VII** — оценка QMS + оценка техдокументации **notified body**, с выдачей сертификата.

**Итог по п.3:** обязательная третья сторона существует ровно для одной категории — Annex III п.1 (биометрия/эмоции) при неприменённых стандартах. Плюс Annex I (AI внутри регулируемых продуктов: медизделия, машины) — там notified body приходит из отраслевого законодательства. Всё остальное — **самооценка**.

**Критическое различение, которое ломает бизнес-модель:** в Annex VI слово «сам» стоит в каждом пункте. Провайдер может **купить** помощь в подготовке, но подписывает декларацию соответствия (Art. 47) и несёт ответственность он. Частный отчёт не переносит ответственность и не заменяет ни одного шага процедуры. То есть отчёт — это **вход**, а не **выход** процедуры, и покупать его никто не обязан.

---

## 4. Статус назначения notified bodies

**На текущий момент — назначенных под AI Act notified bodies практически нет.**

- Процесс назначения стартовал 2 августа 2025 (дедлайн для государств-членов — учредить notifying authority).
- По состоянию на апрель 2026 в базе NANDO **ноль** органов, нотифицированных под AI Act ([Reg Intel](https://reg-intel.com/eu-ai-act-conformity-assessment-what-to-do-when-the-infrastructure-isnt-ready/), [eyreACT](https://eyreact.com/notified-bodies-ai-act/)). Подтверждений о существенном изменении к сентябрю 2026 я не нашёл.
- Digital Omnibus пытается это чинить: единая процедура назначения под AI Act и отраслевое законодательство одновременно; **переходный период**, в котором notified bodies, уже назначенные по отраслевому праву ЕС, могут выполнять оценку high-risk AI до формального назначения ([White & Case](https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act)).

**Инфраструктура правоприменения тоже не построена:**
- market surveillance authority + notifying authority должны были быть назначены к 2 августа 2025;
- по данным трекера [artificialintelligenceact.eu](https://artificialintelligenceact.eu/national-implementation-plans/) на 17 июня 2026 обе структуры назначили **9 из 27** государств-членов, ещё у 12 — законопроекты в процессе;
- единых точек контакта на март 2026 — **8 из 27**.

**Что это значит для идеи.** Хорошая новость: конкурента-notified-body на рынке фактически нет, поляна пуста. Плохая и более сильная: **пустая поляна — это не отсутствие конкуренции, это отсутствие правоприменения**. Никто не штрафует → у покупателя нет боли → бюджета на доказательство нет. Отсутствие notified bodies — симптом того, что рынок ещё не наступил, а не окно возможности.

---

## 5. Признаёт ли регулирование отчёты неаккредитованных частных аудиторов

**Точного положительного ответа в праве нет. Формулирую честно, с обеих сторон.**

**Против (сильнее):**
- В AI Act **нет ни одной нормы**, придающей отчёту неаккредитованного частного аудитора какой-либо доказательный статус. Сертификаты выдают только notified bodies (Annex VII / Art. 44). Presumption of conformity даёт только гармонизированный стандарт, процитированный в Официальном журнале (Art. 40), или common specifications (Art. 41).
- В Annex VI отчёт третьей стороны не упоминается ни разу.
- В Art. 50 и в Guidelines Еврокомиссии от 6 августа 2026 третья сторона не упоминается ни разу.
- **Риск маркетинга:** позиционирование отчёта как «сертификата соответствия AI Act» с любой маркировкой, похожей на CE или на номер notified body, юридически опасно. *Допущение:* точную статью запрета (Art. 48 AI Act и/или Art. 30 Регламента 765/2008 о вводящих в заблуждение маркировках) я не верифицировал по первоисточнику — этот пункт закрывается консультацией с юристом по product compliance ЕС до запуска.

**За (слабее, но реально):**
- Ничто не **запрещает** провайдеру использовать частный отчёт как внутренний input: в Annex VI п.3–4 провайдер «изучает информацию» и «проверяет» — источник информации закон не ограничивает.
- Art. 6(4) прямо требует **документированную оценку** — и её содержание закон не регламентирует.
- Art. 95 (кодексы поведения) — добровольные, могут включать сторонние механизмы.
- Market surveillance authority по Art. 74 может запросить документацию; частный отчёт в пакете хуже не сделает.

**Формулировка вердикта по п.5:** частный отчёт **допустим как элемент внутренней доказательной базы и юридического веса не имеет**. Продавать его как «закрытие самооценки по AI Act» — недостоверное обещание.

---

## 6. Гармонизированные стандарты CEN-CENELEC и ISO/IEC 42001

**Гармонизированные стандарты (CEN-CENELEC JTC 21).**
- Исходный дедлайн разработки — 30 апреля 2025; Еврокомиссия перенесла на 31 августа 2025; фактически не выполнено.
- Октябрь 2025: CEN и CENELEC приняли «exceptional measures» для ускорения, целевой срок — **Q4 2026** ([CEN-CENELEC, 23.10.2025](https://www.cencenelec.eu/news-events/news/2025/brief-news/2025-10-23-ai-standardization/)).
- На середину 2026 в Официальном журнале процитировано **ноль** стандартов → **presumption of conformity не работает ни для чего** ([ai-act-standards.com](https://ai-act-standards.com/), [lawandtechnology.eu](https://lawandtechnology.eu/en/iso-iec-42001-and-the-ai-act-why-certification-is-not-yet-a-presumption-of-conformity/)).
- Ключевой документ в разработке — **prEN 18286** «AI — Quality Management System for EU AI Act Regulatory Purposes», проектируется под presumption of conformity с Art. 17.

**ISO/IEC 42001 (AIMS, декабрь 2023).**
- **Не** является гармонизированным стандартом → сертификация сама по себе presumption of conformity **не даёт**.
- AIMS по ISO 42001 ≠ QMS по Art. 17 AI Act — это разные системы.
- **Но:** это уже доступная **аккредитованная сертификация третьей стороной**, и рынок её принял. В 2026 сертифицированы AWS, Microsoft, SAP; закупочные команды всё чаще требуют ISO 42001 как условие покупки. Голландская национальная AI-стратегия и немецкий AI Action Plan упоминают AI governance certification как критерий качества в госзакупках.

**Заменяют ли стандарты частный аудит — да, и это главный конкурентный риск.**
Не «заменяют», а **вытесняют**: когда prEN 18286 будет процитирован в Официальном журнале, у покупателя появится маршрут «сертификат аккредитованного органа = презумпция соответствия». Против юридически действующей презумпции неаккредитованный «паспорт агента» не выстоит ни в тендере, ни у регулятора. Окно для частного отчёта закрывается по мере созревания стандартов — то есть бизнес-модель имеет **отрицательную опцию по времени**: чем дольше рынок ждёт, тем хуже позиция.

---

## 7. Сроки: что действует, что перенесено

| Норма | Дата | Статус |
|---|---|---|
| Art. 5 (запрещённые практики), AI literacy | 2 февраля 2025 | действует |
| GPAI (Art. 51–56), governance, санкции | 2 августа 2025 | действует |
| **Art. 50 (прозрачность, «я машина»)** | **2 августа 2026** | **действует, НЕ переносилось** |
| Маркировка AI-контента, системы до 02.08.2026 | 2 декабря 2026 | grace period (сокращён с 6 до 3 мес.) |
| Новые запреты Art. 5 (NCII, CSAM) — техсредства | 2 декабря 2026 | grace period |
| Регуляторные песочницы (Art. 57) | 2 августа 2027 | перенесено |
| **High-risk Annex III (самостоятельные системы)** | **2 декабря 2027** | **перенесено с 02.08.2026** |
| **High-risk Annex I (встроенные в продукты)** | **2 августа 2028** | **перенесено с 02.08.2027** |

**Переносы и смягчения — да, состоялись и это закон, а не проект.**
[**Регламент (ЕС) 2026/1744**](https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng) («Digital Omnibus on AI») от 8 июля 2026, опубликован в Официальном журнале 24 июля 2026, вступил в силу 27 июля 2026. Политическое соглашение — 6 мая 2026, подтверждено Советом 13 мая 2026.

Помимо переносов: устранение дублирования с отраслевым product safety law, единая процедура назначения органов, переходный режим для отраслевых notified bodies, расширение упрощений для SME на small mid-caps, два новых запрета в Art. 5.

Официального подтверждения, что перенос обусловлен готовностью стандартов (safeguard clause), в источниках нет — даты зафиксированы жёстко ([CSA Research Note](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/)).

**Оговорка о качестве источника:** прямой доступ к тексту EUR-Lex из этой среды заблокирован (нулевой ответ и по HTML, и по PDF). Даты по Omnibus подтверждены четырьмя независимыми вторичными источниками (White & Case, CSA, Gibson Dunn, lawandtechnology.eu) **плюс** первичным маркером: страница Art. 113 на официальном [AI Act Service Desk Еврокомиссии](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113) несёт дисклеймер *«This provision has been amended by the Digital Omnibus on AI. The text displayed on this page has not yet been updated to reflect those amendments»*. Факт поправки подтверждён первично, точные даты — вторично. Закрывается сверкой консолидированного текста Art. 113 на EUR-Lex с машины без прокси-ограничений.

---

## Кладбище: кто уже пробовал и почему не взлетел

Запрос требовал проверить закрывшихся и убыточно проданных. Проверено, находки существенные.

**Vera (Лиз О'Салливан) — закрылась.** AI validation company, основана ~2022, pre-seed $2,7 млн (TechCrunch, октябрь 2023). Закрыта после 5 лет работы (~2025). Причина словами основателя: **пайплайн иссяк, инвесторы стали скептичны**, решения найти не удалось. Это ровно смежная категория — независимая валидация AI-систем.

**Luminos.Law (ранее bnh.ai) — поглощена, пути наружу нет.** Первая фирма, где AI governance вели одновременно юристы и дата-сайентисты (red teaming + аудит моделей). Переговоры о продаже начались осенью 2024, сделка закрыта **31 декабря 2024**: [поглощена юрфирмой ZwillGen](https://iapp.org/news/a/zwillgen-acquires-ai-law-firm-luminos-law) и превращена в её AI Division. Смысл сигнала: **чистый pure-play AI-аудит не выжил как отдельный бизнес — он схлопнулся в практику юридической фирмы**, где аудит продаётся как приложение к legal privilege и к отношениям с клиентом. Сумма сделки не раскрыта → «убыточность» утверждать не могу, но структура (продажа фирме-покупателю профильной практики, а не стратегу/финансовому инвестору) на успешный exit не похожа. *Допущение.*

**Parity (Румман Чоудхури) — не состоялась как самостоятельный бизнес.** Один из двух флагманов «cottage industry алгоритмического аудита» из [обзора MIT Technology Review, январь 2021](https://www.technologyreview.com/2021/01/15/1016183/ai-ethics-startups/) вместе с ORCAA. Перешла к Лиз О'Салливан в июне 2021, дальше следов самостоятельной компании нет; траектория основателя ушла в Vera, которая закрылась.

**Fairly AI → Asenion.** Ребрендинг с уходом от позиционирования «assurance/audit» к платформе «assess-test-assure» через Microsoft marketplace. Пивот от услуги к софту — характерный признак, что услуговая модель не масштабировалась. *Допущение о причинах.*

**Почему не взлетели — три повторяющиеся причины:**
1. **Покупает страх, а не добродетель.** Пока нет штрафов, «доказательство качества» — статья расхода без владельца бюджета. Данные: только 18% компаний вообще внешне валидируют свои этические заявления об AI.
2. **Нет юридического веса — нет цены.** Отчёт, который ничего не закрывает, конкурирует не с notified body, а с «мы сами напишем документ» и с юрфирмой, которая даёт legal privilege в довесок.
3. **Продукт не масштабируется.** Аудит — это люди-часы; воспроизводимость упирается в то, что каждый агент уникален. Отсюда пивоты в софт (Fairly→Asenion, Luminos.Law→Luminos.AI).

**Аналог из соседнего регулирования — сертификация по GDPR Art. 42.** Механизм добровольной сертификации существует с 2018 года. За 8 лет фактически одна общеевропейская одобренная схема (Europrivacy, признана DPA 30 стран, 2022), уптейк ничтожный. Академическая критика ([ScienceDirect, 2020](https://www.sciencedirect.com/science/article/pii/S0267364920300625)) прямо предупреждает, что схемы вне режима Art. 42/43 воспроизводят «race to the bottom» и обесценивание сертификации. **Это и есть прогноз для неаккредитованного «паспорта агента».**

**Аналог с обязательным мандатом — NYC Local Law 144.** Самый жёсткий тест гипотезы, какой возможен: закон **обязывает** независимый bias audit ежегодно и **обязывает публиковать** отчёт. Результат: из 391 проверенного работодателя отчёты опубликовали **18** (4,6%), уведомления — 13 (3,3%) ([arXiv 2406.01399 «Null Compliance»](https://arxiv.org/html/2406.01399v1)). Аудит Контролёра штата Нью-Йорк ([OSC, 02.12.2025](https://www.osc.ny.gov/state-agencies/audits/2025/12/02/enforcement-local-law-144-automated-employment-decision-tools)): DCWP проверил 32 компании и нашёл 1 нарушение, аудиторы Контролёра на той же выборке — минимум 17. **Даже прямой законодательный мандат на независимый аудит не создал платёжеспособного спроса.**

---

## Кто уже занял соседние ниши (конкуренты за тот же бюджет)

- **Voice AI testing SaaS:** Hamming (SOC 2 Type II, декабрь 2025), Coval, Cekura, Roark — продают **воспроизводимые прогоны сценариев и отчёты** по подписке, непрерывно, дешевле разового аудита, с SOC 2/HIPAA/GDPR в комплекте. Это прямой субститут «паспорта агента» на технической стороне.
- **ISO/IEC 42001** через аккредитованные органы — субститут на стороне «признаваемости в тендере».
- **Юрфирмы** (ZwillGen/Luminos, DLA Piper и др.) — субститут на стороне Art. 6(4) и юридического заключения.
- **AI governance платформы:** Credo AI, Holistic AI, Asenion, Modulos, Saidot.

Что реально спрашивают в тендерах ЕС, по практике и по обновлённым **Model Contractual Clauses for AI Procurement (MCC-AI)** Еврокомиссии (полная версия для high-risk, light для не-high-risk, 24 языка): классификация риска, оценка соответствия, техническая документация, прозрачность по Art. 50, data governance, GPAI-статус. **Частный аудиторский отчёт в этом перечне не фигурирует.**

---

## Что бы опровергло/подтвердило остаток сомнений

| Вопрос | Чем закрывается |
|---|---|
| Точный консолидированный текст Art. 113 после Omnibus | EUR-Lex consolidated version 32024R1689 с незаблокированной машины |
| Реальный статус NANDO под AI Act на сентябрь 2026 | Прямой запрос в NANDO (фильтр «Regulation (EU) 2024/1689») |
| Сумма сделки ZwillGen/Luminos.Law | Не раскрыта; закрывается только инсайдом |
| Появятся ли явные требования частного аудита в тендерах ЕС | Выборка 20–30 живых тендеров на TED (ted.europa.eu) с фильтром по AI |
| Риск запрета на «сертификатоподобный» маркетинг | Консультация с юристом по product compliance ЕС (Art. 48 AI Act, Рег. 765/2008) |

---

## Источники

- [Article 43: Conformity assessment — AI Act Service Desk, Еврокомиссия](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-43)
- [Annex VI: Conformity Assessment Procedure Based on Internal Control — AI Act Service Desk, ЕК](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-6)
- [Article 50: Transparency obligations — AI Act Service Desk, ЕК](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)
- [Article 6 — AI Act Service Desk, ЕК](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-6)
- [Article 113 — AI Act Service Desk, ЕК (с дисклеймером о поправке Omnibus)](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113)
- [Annex III — AI Act Service Desk, ЕК](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3)
- [FAQ: Transparency obligations under Article 50 — ЕК](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- [Guidelines on transparency obligations — ЕК, 06.08.2026](https://digital-strategy.ec.europa.eu/en/policies/guidelines-transparency-ai-generated-content)
- [Code of Practice on Transparency of AI-generated Content — ЕК, 10.06.2026](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content)
- [Регламент (ЕС) 2026/1744 (Digital Omnibus on AI) — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng)
- [EU AI Omnibus enters into force — White & Case](https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act)
- [EU AI Act's High-Risk Deadline: Deferred, Not Cancelled — CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/)
- [Digital Omnibus on AI in the Official Journal — lawandtechnology.eu](https://lawandtechnology.eu/en/digital-omnibus-on-ai-official-journal-regulation-2026-1744/)
- [EU AI Act Omnibus Agreement — Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)
- [CEN-CENELEC: ускорение разработки стандартов AI, 23.10.2025](https://www.cencenelec.eu/news-events/news/2025/brief-news/2025-10-23-ai-standardization/)
- [EU AI Act — Harmonised standards map](https://ai-act-standards.com/)
- [ISO/IEC 42001 и AI Act: почему сертификация ещё не даёт презумпции — lawandtechnology.eu](https://lawandtechnology.eu/en/iso-iec-42001-and-the-ai-act-why-certification-is-not-yet-a-presumption-of-conformity/)
- [prEN 18286 и ISO 42001 — CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-pren-18286-iso-42001-20260428-cs/)
- [National Implementation Plans tracker — artificialintelligenceact.eu](https://artificialintelligenceact.eu/national-implementation-plans/)
- [Notified Bodies Under the EU AI Act — eyreACT](https://eyreact.com/notified-bodies-ai-act/)
- [EU AI Act Conformity Assessment: When the Infrastructure Isn't Ready — Reg Intel](https://reg-intel.com/eu-ai-act-conformity-assessment-what-to-do-when-the-infrastructure-isnt-ready/)
- [Null Compliance: NYC Local Law 144 — arXiv 2406.01399](https://arxiv.org/html/2406.01399v1)
- [Enforcement of Local Law 144 — NY State Comptroller, 02.12.2025](https://www.osc.ny.gov/state-agencies/audits/2025/12/02/enforcement-local-law-144-automated-employment-decision-tools)
- [Critical audit of NYC's AI hiring law — DLA Piper, 01.2026](https://www.dlapiper.com/en-us/insights/publications/2026/01/critical-audit-of-nyc-ai-hiring-law-signals-increased-risk-for-employers)
- [ZwillGen acquires AI law firm Luminos.Law — IAPP](https://iapp.org/news/a/zwillgen-acquires-ai-law-firm-luminos-law)
- [Worried about your firm's AI ethics? These startups are here to help — MIT Technology Review, 15.01.2021](https://www.technologyreview.com/2021/01/15/1016183/ai-ethics-startups/)
- [Vera wants to use AI to cull generative models' worst behaviors — TechCrunch, 05.10.2023](https://techcrunch.com/2023/10/05/vera-wants-to-use-ai-to-cull-generative-ais-worst-behavior/)
- [What GDPR tells about certification — ScienceDirect, 2020](https://www.sciencedirect.com/science/article/pii/S0267364920300625)
- [Europrivacy — European Data Protection Seal](https://www.europrivacy.org/en)
- [EU model contractual clauses for AI procurement: A practical guide — IAPP](https://iapp.org/news/a/eu-model-contractual-clauses-for-ai-procurement-a-practical-guide)
- [Updated EU AI model contractual clauses — Public Buyers Community, ЕК](https://public-buyers-community.ec.europa.eu/communities/procurement-ai/news/updated-eu-ai-model-contractual-clauses-now-available)
- [AI assurance: the UK market and government actions — DSIT report, 06.11.2024](https://www.burges-salmon.com/articles/102jph1/ai-assurance-the-uk-market-and-government-actions-dsit-report/)
- [De-risk your voice agent: 11 best voice agent testing platforms in 2026 — Speechmatics](https://www.speechmatics.com/company/articles-and-news/de-risk-your-voice-agent-11-best-voice-agent-testing-platforms)
