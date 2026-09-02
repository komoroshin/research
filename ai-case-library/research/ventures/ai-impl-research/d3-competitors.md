# D3 — Конкуренты: занята ли позиция «внешний поставщик, внедряющий ИИ в производственный процесс инженерной фирмы»

Дата проверки: 2026-09-02. Проверял: веб-поиск + первичные источники (сайты компаний, пресс-релизы, Microsoft Customer Stories, отраслевая пресса).

---

## 0. Вердикт

**ПОДТВЕРЖДЕНО — но узко, и в формулировке «ниша свободна» это опасно неверно.**

Строгий тест на опровержение («≥2 сильных игрока, которые делают ровно это для AEC/инженерных услуг и имеют публичных клиентов») **не пройден**. Я не нашёл ни одной пары компаний, у которых одновременно есть:
(а) продукт = внедрение ИИ в производственный процесс инженерной фирмы (не обучение, не стратегия, не подписка на софт),
(б) публично названные клиенты-инженерные фирмы,
(в) публично раскрытые результаты внедрения.

Ближе всего подошли два, и каждый провалил ровно один критерий:
- **YegaTech** — публичные клиенты есть (SSOE, Wade Trim, WJE, Shive-Hattery, Mackenzie, Parkhill, CEC), но сами пишут: *«We are not a software vendor and we do not sell implementation hours»* — то есть (а) нет.
- **Advisor Labs** — внедрение есть, цены раскрыты ($8–15k sprint zero, $60–180k production build), но единственный кейс — безымянный «state DOT», то есть (б) нет.

**Однако** позиция «свободна» не потому, что её никто не хочет, а потому что:
1. **Покупатель делает это сам.** Verdantas строит агентов in-house на Copilot Studio (внешний интегратор в кейсе Microsoft не назван), Trilon нанимает VP AI Strategy и Director of Product Strategy & Applied AI, E Source и Verdantas *покупают* ИИ-компании целиком (StrategyWise, AEEC). Это не «нет конкурента» — это «клиент решил не покупать эту услугу снаружи».
2. **Горизонтальные FDE-гиганты заходят через ровно тот же канал (PE-портфели) прямо сейчас.** Ode (Anthropic + Blackstone + H&F + Goldman, $1.5 млрд, ~100 инженеров, июль 2026), OpenAI Deployment Company (май 2026), Microsoft Frontier Co. ($2.5 млрд, 6 000 сотрудников, июль 2026), Accenture + Microsoft FDE practice (март 2026). Про Ode прямо сказано: PE-фонды направляют туда свои портфельные компании. Они пока не отраслевые, но у них нет причин не стать.
3. **Никто не публикует кейсы, потому что клиенты не разрешают** — это не пустота рынка, это пустота витрины. Значит и наше «первый в нише» будет так же невидимо, а конкурент может уже сидеть внутри Trilon без пресс-релиза. *Допущение.*

Практический вывод: не «ниша пустая, заходи спокойно», а **«окно есть, оно измеряется кварталами, и главный конкурент — внутренний отдел клиента»**.

---

## 1. Конкурентная карта

| Игрок | Что именно продаёт | Клиенты в AEC/инжиниринге (публично) | Чем отличается от «внедрения в процесс» | Насколько закрывает нашу позицию |
|---|---|---|---|---|
| **Ode (Anthropic + Blackstone + H&F + Goldman)** | Forward-deployed инженеры, встают внутрь предприятия и перестраивают ключевой бизнес-процесс. $1.5 млрд, ~100 инженеров, поглотили Fractional AI | Не нашёл AEC-клиентов. Отраслевая привязка не заявлена | Горизонтальный, не отраслевой; не знает инженерную нормативку, PE-штамп, ПИР-цикл | **Высокая угроза по каналу**: PE-фонды заводят туда портфельные компании. Отраслевой экспертизы нет — пока |
| **OpenAI Deployment Company** | То же: FDE внутри клиента (май 2026) | Не нашёл | Горизонтальный | Высокая по каналу, низкая по домену |
| **Microsoft Frontier Co.** | $2.5 млрд, 6 000 сотрудников, встроенная FDE-практика (июль 2026) | Не нашёл AEC-специфики | Привязан к стеку Microsoft | Средняя—высокая. WSP уже на Microsoft (см. ниже) |
| **Accenture** | Industry X ~$9 млрд выручки, +10%; генИИ $2.7 млрд в FY25, $5.9 млрд букингов, ~6 000 проектов. Практика Engineering, Construction & Real Estate. FDE-практики с Microsoft (март 2026) и ServiceNow (май 2026) | **На странице E&C — ни одного названного клиента и ни одного ИИ-кейса с цифрами** (проверил) | Industry X — это R&D/продуктовый инжиниринг (заводы, изделия), не проектное производство AEC-фирмы | **Низкая сейчас, огромная потенциально.** Мощность есть, фокуса на AEC-проектное производство — нет |
| **Deloitte / EY / KPMG / PwC / McKinsey QB / Slalom / Thoughtworks / Globant / EPAM** | Общие ИИ-практики и кейсы | Не нашёл ни одного публичного кейса «внедрили ИИ в проектное производство инженерной фирмы» с названным клиентом | Кейсы Deloitte по E&C — про CRM/ERP (напр. Etex, Salesforce), не про проектирование | **Низкая.** Отраслевого предложения под ПИР нет |
| **Symetri (Addnode Group; бывш. Microdesk + Excitech)** | «AI Services»: AI Enablement, AI Agents («design targeted agents and automations»), AI Platforms, Strategy & Governance. Вход — 4-недельный AI Workshop с матрицей value × feasibility и ROI | **№1 глобальный Autodesk Solution Provider**, тысячи AEC-клиентов по BIM/VDC. Но **ИИ-кейсов с именами и цифрами на сайте нет** (проверил) | Родом из Autodesk-канала: сильны в BIM-процессах и кастомной разработке под Revit; ИИ-практика молодая, витрина пустая | **Самый серьёзный прямой конкурент из найденных.** Тот же покупатель, те же процессы, канал уже построен. Не закрывает позицию сегодня — но может за квартал |
| **GRAITEC / Applied Software** | Autodesk Platinum, софт + консалтинг + обучение AEC и MFG | Тысячи AEC-клиентов по BIM | Каналом продаёт лицензии; ИИ-услуги отдельно не выделены в найденных материалах | Средняя. Тот же профиль, что Symetri, ИИ-предложение слабее выражено |
| **HSO** | Dynamics 365 + отраслевой пакет **AEC360**; вебинар «AI Agents in AEC» с use-cases: go/no-go анализ, поиск опыта и генерация резюме/project sheets, черновики технических нарративов, флаги рисков графика, отслеживание escalation-оговорок | Имён AEC-клиентов по ИИ не раскрывает (проверил) | ERP/CRM-интегратор: агенты вокруг Dynamics, а не внутри расчётно-проектного контура | Средняя. Бьёт по «околопроектным» задачам, не по производству |
| **Zweig Group** | «AI Innovation Discovery»: анализ → первые шаги → AI Strategic Plan → **Implementation Support** → change management + «AI On-Call Services» первые 12 месяцев | Ни одного названного клиента и ни одной цены на странице (проверил) | Это управленческий консалтинг AEC-отрасли (M&A, оргразвитие), ИИ — новая линейка поверх | Средняя—высокая по доверию у покупателя (Zweig — «свои» для AEC-фирм), низкая по инженерной глубине |
| **YegaTech** | AI Strategy, AI Governance, Adoption & Culture. Формат: executive working session → strategy sprint на несколько недель → governance/обучение. **Явно: «we do not sell implementation hours»** | **SSOE (1 000+ чел.), Wade Trim, WJE, Shive-Hattery, Mackenzie (фирма с 60-летней историей), Parkhill, CEC Inc.**; партнёрства с AIA, ACEC, PSMJ. 8 патентов США по ИИ, 10 000+ обученных | Продаёт стратегию и культуру, а не работающий процесс. Их же клиенты остаются с задачей «а теперь построй» | **Не закрывает позицию — но занимает вход в кабинет.** После них внедрять зовут кого-то ещё; это скорее партнёр, чем конкурент |
| **Advisor Labs** | AI-консалтинг **и внедрение**: кастомные ИИ-решения, автоматизация процессов, оркестрация данных между GIS/CAD/BIM/PM. Методология из 6 шагов с обучением и success management | Один кейс: **безымянный state DOT**, многолетний многомиллионный контракт, «сэкономили десятки миллионов $ в год» на капитальной программе в $1 млрд | Ближе всех к нашей позиции. Но клиент — заказчик (DOT), а не инженерная фирма-исполнитель | **Прямой конкурент по форме.** Ограничение: нет публичной витрины и, судя по всему, малый размер |
| **POLR AI** (Chandler, AZ) | Обучение по ролям + фасилитация внутреннего ИИ-комитета + **кастомные агенты и автоматизации собственной командой разработки**, интеграции Procore/SharePoint. Вход: assessment / 90-дневный спринт. **Ценообразование от результата** («hours returned, roles supported, throughput gained»), не почасовое | Не раскрыты (проверил) | Начинают с обучения, разработка — «когда обучения недостаточно» | Средняя. Модель ценообразования — ровно наша; масштаб и доказательства отсутствуют |
| **AI in AEC** (Stjepan Mikulic) | AI Workflow Audit (3–6 недель «от киковки до первого деплоя») + AI Mastery Program (обучение). 1 000+ студентов из 78 стран, 3 000+ подписчиков | Логотипы на сайте: NCC, AFRY, SWECO, Architecture49, INOVA, Creoox. **Кейсов с цифрами нет** — вероятно, это работодатели учеников, а не корпоративные клиенты (*допущение*) | По сути образовательный бизнес с аудит-надстройкой | Низкая как конкурент, высокая как формирователь спроса |
| **Dan Cumberland Labs** | AI readiness assessment, roadmap, модель зрелости «Pacemark» (исследование 300+ компаний). «Our small team» | Клиентов не называет (проверил) | Стратегия/роадмап, не производство | Низкая |
| **AEC Hub, AECforward, Reope, Cove, Conifer Advising** | Каталог + мелкие бутики: подбор инструментов, кастомные агенты, Rhino.compute, BIM-координация. Conifer — $350+/час | Не раскрыты | Микро-игроки, 1–10 человек (*допущение по виду сайтов*) | Низкая поштучно, заметная в сумме как ценовое давление снизу |
| **Bentley Systems** | ИИ внутри продукта: агент автоматической простановки аннотаций на чертежах (GA ноябрь 2025), Bentley Copilot в OpenRoads/OpenRail (начало 2026), AI-поиск в ProjectWise (early access декабрь 2025, GA 2026). Плюс **Infrastructure AI co-innovation initiative** — приглашает инженерные фирмы совместно разрабатывать ИИ-воркфлоу и **обучать/деплоить собственные модели рядом с софтом Bentley** | Публичные партнёры инициативы поимённо получить не удалось (пресс-релиз отдаёт 403 и требует логина) | Вендор софта, не поставщик услуг внедрения. Но сужает поле use-cases сверху | **Высокая как «съедание рынка сверху»**: то, что войдёт в продукт, нельзя будет продать как проект внедрения |
| **Autodesk** | Forma Project Data Agent вышел из беты в марте 2026 (запросы к RFI, протоколам, проектным данным на естественном языке); Autodesk Assistant становится агентным; Design and Make Marketplace на DevCon 2026 | — | Вендор + маркетплейс. Внедрение отдаёт каналу (Symetri, Graitec) | Высокая как сужение поля; сам услуги не продаёт |
| **Deltek** | Dela — ИИ-оркестратор, «Dela Agent Workforce» для Vantagepoint; PPM Enterprise Risk (Q1 2026). Nucleus Research назвал Deltek Expert в 2026 ERP Value Matrix | ERP-клиенты — сотни A/E-фирм | ERP-вендор; агенты вокруг финансов и проектного управления | Высокая по «околопроектному» слою, нулевая по расчётно-проектному |
| **Unanet / BST Global** | ERP для A/E; Unanet: 45% A/E-клиентов, по их данным, переходят с Deltek. Внедрение Vantagepoint/Unanet 3–9 мес., BST10 6–18 мес. | Unanet называет: NewFields, ISG, Hixson, Warehaus, Albert Kahn, Eichleay | Классическое ERP-внедрение, не ИИ в производстве | Низкая по домену, но **важный референс по формату контракта**: 3–18 мес. внедрения — это норма, к которой рынок привык |
| **Transcend (Design Generator)** | **SaaS-подписка**: автогенерация проектов подстанций и водных объектов, «в 10× быстрее», «сокращение цикла проектирования до 90%». $20 млн Series B (2023). «Более 635 млн человек в 120 странах затронуты проектами Transcend» | Поимённо клиентов на сайте не публикует (проверил страницу Power Industry) | **Продаёт продукт, а не внедрение.** Инженерная фирма покупает лицензию и сама учится | Средняя: закрывает конкретный участок процесса (подстанции), но не процесс целиком |
| **ThinkLabs AI** | Физически-информированный ИИ-двойник сети; «10 млн сценариев за <10 минут». $28 млн Series A (март 2026), лид Energy Impact Partners, участники NVentures (NVIDIA) и Edison International | **10+ энергокомпаний**; публично — совместные результаты с **Southern California Edison** (январь 2026); удвоили число аккаунтов за Q1 2026 | Софт для утилит, а не услуга для инженерной фирмы | Низкая напрямую; но забирает бюджет у Qualus/E Source-подобных |
| **Marengo (YC)** | **AI-native инженерная фирма**, проектирует ЦОДы «вдвое быстрее и вдвое дешевле»: 1 000 концептов параллельно, Pareto-оптимальный выбор, от feasibility до FEED и разрешений. $4 млн design partnerships с двумя крупнейшими девелоперами | Девелоперы не названы | **Не поставщик, а замена клиента.** Конкурирует с инженерной фирмой, а не обслуживает её | Не закрывает позицию — но обесценивает покупателя. Стратегическая угроза всей ставке |
| **Zero RFI (KP Reddy)** | **Роллап** с собственным ИИ-слоем Foundation Zero, встраиваемым в купленные сервисные фирмы. $13.8 млн seed, лид General Catalyst, март 2026 | Купили Brookwood Group, BuildingWorks, KP Reddy Co. | Покупает фирмы и внедряет ИИ в себя. Это не поставщик — это конкурирующая модель владения | Не закрывает позицию, но **доказывает, что покупатель предпочитает владеть, а не арендовать** |
| **EvolveLAB** | Computational design + BIM-консалтинг, кастомные Revit add-ins, Dynamo, Forge-дашборды. **Куплена Chaos в феврале 2025** | — | Была ближайшим аналогом «внедрения в процесс» — и её купил вендор софта | Показательно: этот тип бизнеса рынок оценивает как актив для вендора, а не как самостоятельную платформу |
| **Trunk Tools, Augmenta, Motif, Higharc, Arcol, Qbiq, Swapp, Hypar, Speckle, Pearl Street (куплена Enverus), Vela, Gridcare, Emerald AI, SubsGPT** | Подписка на софт (SaaS), точечные участки процесса | Разрозненно | Софт по подписке, не услуга внедрения | Низкая индивидуально; в сумме — фрагментация бюджета клиента |

---

## 2. Кто уже работает с названными роллап-платформами

Прямых объявлений «роллап X нанял ИИ-подрядчика Y» я **не нашёл ни одного**. Вместо этого нашёл устойчивый обратный паттерн — платформы строят ИИ внутри себя:

| Платформа | Что делает с ИИ | Источник |
|---|---|---|
| **Verdantas** (2 500 чел., ~36 компаний, ~100 офисов) | Построила агентов **сама**, на Microsoft Copilot Studio: Technical Resource Agent (поиск по организации, поддержка КП, проектная/клиентская аналитика) и Contract Management Agent (риск-ревью договоров против политик юротдела в SharePoint). Стек: Microsoft Fabric + Dataverse + Azure AI Search + Power Automate, интеграции с Workday, Deltek, ServiceNow, Harbor Compliance. Мультиагентная оркестрация — «до 2× быстрее ответы»; ревью договоров «часы → минуты»; **150+ заявок на новых агентов от подразделений**. CDIO — Sujan Turlapaty. **Внешний интегратор в кейсе не назван.** Публикация Microsoft от 19.03.2026 | Microsoft Customer Stories |
| **Verdantas** | Июль 2026 — **купила AEEC** (Reston, VA), «technology-driven environmental engineering», прямо ради ИИ и кастомных цифровых решений. Август 2026 — купила Sherwood Design Engineers | PRNewswire, verdantas.com |
| **Trilon** (5 500+ чел.) | Заявляет инвестиции в технологии **«более чем в 5× выше среднего по отрасли»**. Нанимает **VP, AI Strategy and Programs** и **Director of Product Strategy & Applied AI** (обе — remote, открыты в 2026). Формулировка вакансии: возглавить кросс-функциональные ИИ-команды, «discover, evaluate, and deliver high-impact AI products and services». 2026 — запустили Artheon (слияние CME Associates, Churchill Consulting Engineers, Naik Consulting Group) | trilon.com, вакансии (Ladders, Himalayas, ZipRecruiter) |
| **E Source** (300+ утилит-клиентов) | Купила **StrategyWise** (ИИ/ML-компания) ради data science и ИИ-компетенций; август 2026 — купила **Aneden Consulting** ради interconnection/compliance-инжиниринга | esource.com, PRNewswire |
| **Zero RFI** | Сам по себе ИИ-роллап: слой Foundation Zero встраивается в приобретённые фирмы | Wilson Sonsini, finsmes, Yahoo Finance |
| **GDS Associates / Littlejohn** | Март 2026 — стратегическое партнёрство. GDS: ~200 профессионалов, 40 лет, планирование энергоснабжения, transmission/interconnection studies, прогноз нагрузки, регуляторика. Заявленная цель — «scaled platform» через доп. поглощения. ENR подаёт сделку под углом «расшивка планировочного узкого места в сетевых проектах», но полный текст получить не удалось (403) | littlejohnllc.com, Morrissey Goodale, ENR (частично) |
| **Qualus** | Есть направление Software Solutions (оптимизация сети, аварийное управление, ИИ-интеграция ВИЭ) — то есть тоже строит своё | qualuscorp.com |
| **Thrive, GDS** | ИИ-партнёрств не нашёл | — |

**Ключевой вывод по слою:** конкурент нашей позиции у роллапов — это не другая консалтинговая фирма, а **их собственный CDIO с бюджетом на найм и на M&A**. Verdantas продемонстрировала, что 2 500-человечная платформа может собрать работающих агентов на коробочном Copilot Studio без внешнего интегратора. Это самое сильное возражение против всей гипотезы.

---

## 3. Эксклюзивные партнёрства

**Рынок-закрывающих эксклюзивов в AEC не нашёл.** Что нашёл из крупного и близкого:

- **WSP × Microsoft — 7 лет, $1 млрд** (стратегическое партнёрство, развёртывание Microsoft 365 Copilot на «десятки тысяч» из 75 000 сотрудников). Метрики: 84% пользователей Copilot в регулярном опросе подтверждают ежедневную экономию времени; в пилоте на транспортном проекте в Южной Америке финальная фаза валидации могла быть выполнена за 10–15% обычного времени цикла. **Кто интегрировал — в кейсе не указано.** Это не эксклюзив, но $1 млрд на 7 лет означает, что у WSP бюджет на ИИ уже расписан.
- **Sweco** (22 000+ консультантов) — построила **SwecoGPT** на Azure AI Studio для внутреннего использования. In-house.
- **Kimley-Horn** — Microsoft 365 Copilot в AEC-работе (Microsoft Customer Story).
- **AECOM × Southern Methodist University** (апрель 2026) — партнёрство по ИИ в инфраструктуре: докторская фелоушип-программа в Lyle School of Engineering. То есть AECOM строит talent pipeline, а не покупает внедрение.
- **AECOM купила Consigli за $390 млн** (декабрь 2025).
- **Bentley Infrastructure AI co-innovation initiative** — открытое приглашение инженерным фирмам, не эксклюзив.
- **Accenture × Microsoft FDE practice** (март 2026), **Accenture × ServiceNow FDE program** (май 2026), **Accenture Edge × Google Cloud** для mid-market — это партнёрства вендор↔интегратор, не отраслевые эксклюзивы.
- **Bain × OpenAI** — Bain инвестировала в OpenAI Deployment Company; совместная работа с PE-портфелями заявлена явно.

**Вывод:** дверь юридически не закрыта нигде. Но у WSP, Sweco, Verdantas дверь закрыта фактически — бюджет и стек уже выбраны.

---

## 4. Цены и формы контрактов (что раскрыто)

| Кто | Что | Форма |
|---|---|---|
| **Advisor Labs** | **Sprint zero по одному AEC-процессу: $8 000–15 000. Production build: $60 000–180 000 фиксированной ценой.** Окупаемость «внутри девяти месяцев по измеренному времени PM и сметчиков» | Фиксированная цена по этапам. **Единственная публичная цена «внедрения» в AEC, которую я нашёл** |
| **POLR AI** | Цен нет. Модель: **«value-priced against the outcome (hours returned, roles supported, throughput gained), not billed by the hour»**. Вход: assessment / discovery call / 90-дневный спринт | Оплата от результата |
| **Conifer Advising** | $350+/час | Почасовая |
| **Symetri** | Цен нет. Вход — 4-недельный AI Workshop, выход: матрица возможностей value × feasibility, роадмап со сроками, ROI по топ-инициативам | Воркшоп → проект |
| **AI in AEC** | Цен нет. AI Workflow Audit: **3–6 недель от киковки до первого деплоя** | Аудит + подписка на обучение |
| **YegaTech** | Цен нет. Executive working session → strategy sprint на несколько недель → governance/обучение | Спринт-консалтинг |
| **Zweig Group** | Цен нет. Пятиэтапка + **«AI On-Call Services» первые 12 месяцев** | Проект + ретейнер |
| **WSP × Microsoft** | **$1 млрд / 7 лет** | Долгосрочное стратегическое партнёрство (софт + сервис) |
| **Ode** | Не раскрыто | — |
| **Unanet / Deltek / BST Global** | Не раскрыто. Сроки внедрения: 3–9 мес. (Vantagepoint/Unanet), 6–18 мес. (BST10) | Лицензия + внедрение |
| **Marengo** | $4 млн в design partnerships с двумя девелоперами | Design partnership |

**Ориентир для нас:** $8–15k пилот, $60–180k продакшн-билд за процесс — это текущая публичная планка американского AEC-бутика. Ретейнер после внедрения («AI On-Call», 12 мес.) — уже нормализованная практика (Zweig). Оплата от результата (POLR) — доказано существующая, но у мелкого игрока.

---

## 5. Чем реально отличается «внедрение в процесс» от продажи софта — живые примеры

**Продажа софта (подписка):**
- *Transcend Design Generator* — фирма покупает лицензию, генерирует проекты подстанций «в 10× быстрее», заявленное сокращение цикла до 90%. Ответственность за то, чтобы инженеры этим пользовались, лежит на фирме. Именной клиентуры нет.
- *Bentley Copilot / агент аннотирования чертежей* — включается в OpenRoads/OpenRail. Фирма платит за подписку; изменение процесса — её забота.
- *Deltek Dela Agent Workforce* — агенты внутри ERP. Купил — получил функцию.
- *Autodesk Forma Project Data Agent* — запрос к RFI и протоколам на естественном языке внутри продукта.

**Внедрение в процесс (услуга):**
- *Verdantas* — но это **инсорс**, не поставщик: команда сама собрала Technical Resource Agent и Contract Management Agent, подцепила Workday/Deltek/ServiceNow/Harbor Compliance через Power Automate, получила «часы → минуты» на ревью договоров и очередь из 150+ заявок от подразделений. Это эталон того, как выглядит результат — и одновременно доказательство, что клиент способен сделать это без нас.
- *Advisor Labs × state DOT* — многолетний многомиллионный контракт, автоматизация управления проектами и отчётности, «десятки миллионов $ экономии в год» на капитальной программе $1 млрд. Форма: fixed-fee этапами. Клиент безымянный.
- *Barge Design Solutions* (ENR №169 в 2023, офисы в 5 штатах) — планы по охране труда и безопасности: **8–10 часов → 10–15 минут**. По публичным следам делали **сами** (презентовали Bob Higgins и Gary McClure), внешний подрядчик не назван.
- *Haskell* — балансировка земляных работ на участке 65 акров через ИИ-оптимизацию в Civil 3D. Софт + собственная работа.
- *Bechtel* — Big Data & Analytics Center of Excellence, дата-лейк 5 петабайт. Полный инсорс.

**Граница проходит здесь:** софт продаёт функцию и уходит; внедрение продаёт **изменённый процесс с замеренной дельтой и людьми, которые им пользуются**. Публичных примеров второго, сделанного *внешним поставщиком для инженерной фирмы*, я нашёл ровно один (Advisor Labs), и тот с безымянным клиентом и заказчиком-DOT, а не проектировщиком.

---

## 6. Обратные сигналы

**Провалы и статистика неудач:**
- **88%** ИИ-proof-of-concept в enterprise не доходят до продакшна (IDC, 2025 CIO Playbook) — из 33 пилотов до продакшна доходят 4.
- **95%** корпоративных генИИ-пилотов не дают измеримого эффекта на P&L (MIT NANDA, *The GenAI Divide*, август 2025).
- **80%+** ИИ-проектов проваливаются — примерно вдвое чаще, чем не-ИИ ИТ-проекты (RAND, 2024).
- Capgemini Research Institute, *Engineering & R&D Pulse 2026*: проблема не в возможностях ИИ, а в том, «как ИИ осмысляется, управляется и встраивается в инженерные организации». Главный барьер — **не техника, а change management**.
- Скрытые издержки копятся на стадии пилота — в основном это время инженеров, потраченное на инструменты, которые не дошли до продакшна.

**Сигнал В НАШУ пользу (важный):**
- **MIT NANDA (август 2025): партнёрства со специализированными вендорами успешны примерно в 67% случаев; внутренние разработки — успешны втрое реже.** Это прямой аргумент против инсорс-стратегии Verdantas/Trilon и лучший имеющийся у нас продающий факт.

**Профессиональная ответственность как потолок:**
- «No PE stamp depends on the first draft» — расчёты под печатью инженера **не являются первой целью для ИИ-внедрения**. Всё, за чем стоит ответственность (напряжения, нагрузки, выбор материалов), требует человеческой подписи. Граница между исполнением ИИ и одобрением инженера — «где живёт ответственность».
- Следствие: возврат дают **непарадные задачи** — автоматизация КП, оборот RFI/RFP, суммаризация документов, поиск по нормативам, транскрипция совещаний. То есть ровно то, что уже делают Verdantas, Deltek Dela и HSO AEC360 — рынок сходится в узкую полосу и там будет тесно.

**Низкая база проникновения (и это скорее риск темпа, чем возможность):**
- Только **27%** AEC-профессионалов используют ИИ в операциях; **52%** фирм всё ещё печатают чертежи на стадии проектирования (Bluebeam, 2026 AEC Technology Outlook).
- **94%** AEC-фирм, уже использующих ИИ, планируют увеличить инвестиции (Bluebeam, 2026).
- **90%** респондентов используют или планируют ИИ хотя бы в одной бизнес-функции в 2026, но только **5%** считают свою организацию зрелой по ИИ (Deltek Clarity 2026). Ведущее применение — автоматизация бизнес-процессов, 34% фирм (+10 п.п. год к году).
- **35%** инфраструктурных фирм ожидают ИИ более чем в 50% проектов в течение 3 лет (Bentley / Mott MacDonald / Pinsent Masons / Turner & Townsend, 2025).
- В PE: **95%** ИИ-программ проходят business case, но только **36%** портфельных компаний используют ИИ ежедневно и лишь **7%** описывают ИИ как полностью интегрированный (Bain/StepStone 2026 PE GP Outlook).

**Публичной критики ИИ-инструментов инженерами и отказов от подписок с именами — не нашёл.** Отдельно: подтверждённых случаев «инженерная фирма наняла внешнего ИИ-подрядчика и разорвала контракт» — не нашёл.

---

## 7. Чего не нашёл (честно)

- Ни одного публичного контракта «роллап-платформа инженерных фирм ↔ внешний поставщик внедрения ИИ». Ни у Trilon, ни у Verdantas, ни у Qualus, ни у E Source, ни у Thrive, ни у GDS.
- Именных ИИ-кейсов у Symetri, HSO, Zweig Group, POLR AI, Advisor Labs (кроме безымянного DOT), Dan Cumberland Labs.
- Кто именно интегрировал Copilot для WSP и Verdantas (внутренние команды или партнёр) — в первоисточниках не указано.
- Списка партнёров Bentley Infrastructure AI co-innovation initiative — пресс-релиз Bentley отдаёт 403/требует логина, businesswire тоже 403.
- Полного текста ENR по сделке Littlejohn–GDS и ENR 2026 Top 500 (пейволл).
- Цен Ode, OpenAI Deployment Company, Microsoft Frontier Co.
- Детальных данных по Thrive Holdings × OpenAI (лимит поисковых запросов исчерпан на этом шаге; по вторичному источнику: Thrive Holdings — $1+ млрд, в декабре 2025 OpenAI взяла долю и встраивает инженерные команды внутрь портфельных компаний — **не верифицировано первоисточником**).
- Данных по Vela Energy, SubsGPT, Gridcare, Emerald AI, Motif, Arcol, Qbiq, Swapp, Speckle — по каждому не хватило запросов; по общей картине они относятся к SaaS-слою.

---

## 8. Что это значит для ставки — три следствия

1. **Продавать надо не «внедрение ИИ», а то, чего у клиента нет: 14 исследователей и мультиагентный стек.** Verdantas доказала, что Copilot Studio + CDIO закрывают «околопроектный» слой. Наше отличие обязано лежать глубже — в расчётно-проектном контуре, где Copilot не работает и где живёт PE-штамп. Иначе мы конкурируем с Microsoft-лицензией, которая у клиента уже куплена.
2. **Лучший продающий факт — MIT NANDA: 67% против втрое меньшего.** Прямо бьёт в инсорс-инстинкт Trilon и Verdantas.
3. **Окно короткое.** Ode с $1.5 млрд входит через PE-канал, Bentley и Autodesk забирают use-cases внутрь продукта, Symetri может развернуть ИИ-практику на существующей AEC-клиентуре за квартал, а Marengo и Zero RFI подрывают самого покупателя. Формально позиция свободна; практически её будут занимать в 2026–2027.

---

## Источники

**Роллапы и покупатели**
- [Verdantas builds agents… using Microsoft Copilot Studio — Microsoft Customer Stories, 19.03.2026](https://www.microsoft.com/en/customers/story/26233-verdantas-microsoft-copilot-studio)
- [Verdantas Advances AI and Data-Driven Engineering… Acquisition of AEEC — PRNewswire, июль 2026](https://www.prnewswire.com/news-releases/verdantas-advances-ai-and-data-driven-engineering-and-environmental-solutions-with-acquisition-of-american-engineering--environmental-consultants-302816474.html)
- [Verdantas — News](https://www.verdantas.com/news-insights/news/4046/verdantas-advances-ai-and-data-driven-engineering-and-environmental-solutions-wit)
- [Trilon — Our Vision](https://www.trilon.com/our-vision) · [Trilon: Director of Product Strategy & Applied AI](https://www.theladders.com/job/director-of-product-strategy-applied-ai-trilongroup-virtual-travel_88332177) · [Trilon: VP, AI Strategy and Programs](https://himalayas.app/companies/trilon-group/jobs/vp-ai-strategy-and-programs)
- [E Source acquires StrategyWise](https://esource.com/001202aiml/e-source-expands-data-science-and-ai-capabilities-acquisition-strategywise) · [E Source Acquires Aneden Consulting — PRNewswire, авг. 2026](https://www.prnewswire.com/news-releases/e-source-acquires-aneden-consulting-to-deepen-interconnection-engineering-capabilities-302857854.html)
- [Littlejohn & Co. Partners With GDS Associates, март 2026](https://littlejohnllc.com/news/littlejohn-co-partners-with-gds-associates-to-support-the-next-phase-of-growth/) · [Morrissey Goodale](https://www.morrisseygoodale.com/news/gds-associates-enters-a-strategic-partnership-with-littlejohn-co/) · [ENR (403/пейволл)](https://www.enr.com/articles/62611-littlejohngds-deal-targets-planning-bottleneck-slowing-us-grid-projects)
- [Qualus — Software Solutions](https://qualuscorp.com/expertise/software-solutions/)
- [Wilson Sonsini: Zero RFI $13.8M Series Seed](https://www.wsgr.com/en/insights/wilson-sonsini-advises-zero-rfi-on-dollar138-million-series-seed-round.html) · [Yahoo Finance: KP Reddy launches Zero RFI, General Catalyst](https://finance.yahoo.com/news/tech-veteran-kp-reddy-launches-130000191.html) · [FinSMEs, март 2026](https://www.finsmes.com/2026/03/zero-rfi-raises-13-8m-in-seed-funding.html)

**Крупный консалтинг и FDE-гиганты**
- [Accenture: Engineering, Construction and Real Estate Services](https://www.accenture.com/us-en/industries/industrial-equipment/engineering-construction-real-estate)
- [Accenture launches Microsoft Forward Deployed Engineering Practice, март 2026](https://newsroom.accenture.com/news/2026/accenture-launches-microsoft-forward-deployed-engineering-practice-to-help-organizations-scale-ai-across-the-enterprise)
- [ServiceNow and Accenture Launch FDE Program, май 2026](https://newsroom.accenture.com/news/2026/servicenow-and-accenture-launch-forward-deployed-engineering-program-to-scale-agentic-ai-across-the-enterprise)
- [Accenture Edge and Google Cloud — mid-market agentic AI](https://newsroom.accenture.com/news/2026/accenture-edge-and-google-cloud-bring-scalable-agentic-ai-solutions-to-mid-market-companies)
- [Luminix: Accenture Company Overview 2026 (выручка, Industry X)](https://www.useluminix.com/reports/company-overviews/accenture-company-overview-business-segments-financials-and-global-market-position-2026)
- [TechCrunch: Anthropic, Blackstone bet the next trillion-dollar AI business is implementation, 15.07.2026](https://techcrunch.com/2026/07/15/anthropic-blackstone-bet-the-next-trillion-dollar-ai-business-is-implementation-not-models/) · [MarketScale: Ode](https://www.marketscale.com/industries/software-and-technology/anthropic-and-blackstone-launch-15b-ai-implementation-firm-ode-betting-enterprise-deployment-beats-model-building) · [metir: Beyond the Model](https://www.metirai.com/blog/ai-implementation-services-forward-deployed-engineering-2026)
- [CNBC: Microsoft commits $2.5B and 6,000 employees to new AI implementation unit, 02.07.2026 (403 при фетче)](https://www.cnbc.com/2026/07/02/microsoft-commits-2point5-billion-6000-employees-ai-implementation-unit.html)
- [Bain & Company invests in the OpenAI Deployment Company, 2026](https://www.bain.com/about/media-center/press-releases/2026/bain-company-openai-a-new-venture-to-deploy-ai-at-enterprise-scale/)
- [Bain & StepStone 2026 Private Equity GP Outlook](https://www.stepstonegroup.com/news-insights/bain-company-and-stepstone-group-release-2026-private-equity-gp-outlook/)
- [Deloitte: AI & Engineering Case Studies](https://www.deloitte.com/us/en/services/consulting/collections/ai-engineering-case-studies.html)

**Вендоры софта и канал**
- [Bentley Systems Advances Infrastructure AI… (403 при фетче)](https://www.bentley.com/news/bentley-systems-advances-infrastructure-ai-with-new-applications-and-industry-collaboration/) · [Informed Infrastructure — перепечатка](https://informedinfrastructure.com/post/bentley-systems-advances-infrastructure-ai-with-new-applications-and-industry-collaboration) · [ENR: Bentley Unveils Platform Upgrades](https://www.enr.com/articles/61673-bentley-unveils-platform-upgrades-redoubles-ai-investment)
- [Autodesk: Building for Agentic AI — APS](https://aps.autodesk.com/blog/building-agentic-ai-whats-new-autodesk-platform-services) · [Design and Make Marketplace](https://aps.autodesk.com/blog/design-and-make-marketplace-where-your-solutions-meet-industry-agentic-ai-workflows) · [Forma at AU 2026](https://blogs.autodesk.com/forma/2026/08/24/autodesk-forma-au-2026-guide/)
- [Deltek: How the Dela Agent Workforce is Redefining Project Delivery](https://www.deltek.com/resources/articles/how-the-dela-agent-workforce-is-redefining-project-delivery/) · [Deltek Clarity 2026 press release](https://www.deltek.com/en/about/media-center/press-releases/2026/the-latest-deltek-clarity-industry-studies-highlight-ai-challenges) · [Why A&E Firms Are Embracing Agentic AI in ERP](https://www.deltek.com/resources/articles/agentic-ai-architecture-engineering/)
- [Symetri — AI Services](https://www.symetri.us/ai/) · [Symetri acquires Microdesk — PRNewswire](https://www.prnewswire.com/news-releases/microdesk-joins-forces-with-symetri-and-becomes-the-1-global-autodesk-solution-provider-301493351.html)
- [GRAITEC / Applied Software](https://graitec.com/us/)
- [HSO: AI Agents in AEC](https://www.hso.com/ondemand/ai-agents-in-aec/) · [HSO aec360](https://www.hso.com/ip-offering/aec360/)
- [Unanet — switch from Deltek (named A/E customers)](https://info.unanet.com/switch-ae)
- [Chaos acquires EvolveLAB, февраль 2025](https://www.chaos.com/press/chaos-acquires-evolvelab-and-its-aec-ai-tools)

**Бутики AI-enablement для AEC**
- [YegaTech — AI Consulting for AEC](https://yegatech.com/ai-consulting-for-aec/) · [yegatech.com](https://yegatech.com/)
- [Advisor Labs — AEC AI (цены)](https://www.advisorlabs.com/industry/aec-ai)
- [POLR AI — AI Enablement for AEC Firms](https://polrai.com/aec)
- [AI in AEC (Stjepan Mikulic)](https://www.aiinaec.com/) · [консалтинг](https://www.aiinaec.com/consulting)
- [Zweig Group — AI Innovation Discovery](https://zweiggroup.com/pages/ai-innovation-discovery)
- [AEC Hub — каталог ИИ-консультантов для AEC](https://www.aechub.org/consultants)
- [Dan Cumberland Labs — AEC AI Roadmap](https://dancumberlandlabs.com/blog/aec-ai-roadmap/) · [Copilot Agents for AEC Firms](https://dancumberlandlabs.com/blog/copilot-agents-aec/)

**Специализированные ИИ-стартапы**
- [Transcend — Power Industry](https://transcendinfra.com/power-industry/) · [Electrical Substation Design](https://transcendinfra.com/electrical-substation-design/) · [$20M Series B, BusinessWire 2023](https://www.businesswire.com/news/home/20230803972843/en/Transcend-Raises-$20M-Series-B-to-Automate-Critical-Infrastructure-Design)
- [ThinkLabs AI $28M Series A — GlobeNewswire, 31.03.2026](https://www.globenewswire.com/news-release/2026/03/31/3265239/0/en/thinklabs-ai-closes-28-m-series-a-led-by-energy-impact-partners-backed-by-nventures-and-edison-international.html) · [BetaKit](https://betakit.com/thinklabs-secures-28-million-usd-series-a-to-help-power-grids-manage-data-centre-demand/) · [VentureBeat](https://venturebeat.com/infrastructure/nvidia-backed-thinklabs-ai-raises-usd28-million-to-tackle-a-growing-power)
- [Marengo — Y Combinator](https://www.ycombinator.com/companies/marengo) · [Launch YC: Accelerated Data Center Design](https://www.ycombinator.com/launches/SiK-marengo-accelerated-data-center-design)

**Кейсы, метрики и обратные сигналы**
- [WSP empowers engineers and scientists with Microsoft 365 Copilot — Microsoft Customer Stories](https://www.microsoft.com/en/customers/story/26012-wsp-microsoft-365-copilot/)
- [Sweco Group / SwecoGPT — Microsoft Customer Stories](https://www.microsoft.com/en/customers/story/1767395222127336377-swecogroup-azure-ai-services-professional-services-en-sweden)
- [Kimley-Horn brings Microsoft 365 Copilot to AEC work](https://www.microsoft.com/en/customers/story/26418-kimley-horn-microsoft-365)
- [AECOM and SMU Announce Strategic Partnership, апрель 2026](https://aecom.com/press-releases/aecom-and-smu-announce-strategic-partnership-to-invest-in-the-future-of-ai-in-infrastructure-talent/)
- [Dan Cumberland Labs: AI in Civil Engineering — Why 88% of Pilots Fail (сводка статистики IDC/MIT NANDA/RAND/Bluebeam/Bentley с указанием источников)](https://dancumberlandlabs.com/blog/ai-in-civil-engineering/)
- [Capgemini: Why AI pilots succeed, but AI transformation fails at scale (Engineering & R&D Pulse 2026)](https://www.capgemini.com/insights/research-library/why-ai-pilots-succeed-but-engineering-transformation-fails/)
- [BST Global Launches 2026 AI Data Impact Survey for the AEC Industry — BusinessWire](https://www.businesswire.com/news/home/20251105615222/en/BST-Global-Launches-2026-AI-Data-Impact-Survey-for-the-AEC-Industry)
- [BD+C: AI in AEC — where firms should start and how to scale adoption](https://www.bdcnetwork.com/aec-tech/article/55359703/ai-in-aec-where-firms-should-start-and-how-to-scale-adoption)
- [Stantec: AI is democratizing design automation in the AEC industry, 2026](https://www.stantec.com/en/news-media/2026/ai-is-democratizing-design-automation-aec-industry)
