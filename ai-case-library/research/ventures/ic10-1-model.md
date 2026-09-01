# IC10-1. Проверка утверждения: «Возврат потерь как услуга за долю от возврата практикуется в мире, есть контракты и цены, модель не убита регуляторикой/репутацией»

Дата проверки: 01.09.2026. Роль: исследователь-скептик. Языки источников: англ., порт., исп., рус.
Ограничение: лимит веб-поиска сессии исчерпан (200 запросов); часть первоисточников (ANEEL REN 1000, Jusbrasil, find-tender, Ofgem R0234) недоступна из песочницы (403/404) — такие места помечены.

---

## 0. Вердикт (коротко)

**Утверждение в исходной форме ОПРОВЕРГНУТО частично, и в самой важной части — про «цены и контракты за долю от возврата».**

1. **Чистая contingency-модель «подрядчик без активов получает % от фактически взысканных денег за выявленное хищение электроэнергии» как сложившийся рынок с публичными ставками — НЕ НАЙДЕНА** ни в UK, ни в США, ни в Бразилии/Колумбии/Мексике, ни в Индии/ЮАР/Нигерии/Пакистане, ни в РФ. Ни одного публичного контракта с формулой «X % от recovered revenue» за theft detection на стороне сетевой/сбытовой компании найти не удалось (явно: «не нашёл»).
2. **Что реально существует — это соседние модели, и у каждой есть свои «шрамы»:**
   - **UK:** подрядчики revenue protection (Grosvenor, Morrison DS/M Group, члены UKRPA) работают **по транзакционной оплате за случай/визит**, финансируются через DUoS + per-case; регулятор платит поставщикам **фиксированную премию за подтверждённый случай (TDIS, ~£400/случай в первый год; расчётно ~£580/случай в 2024/25)** — и поставщики выполняют лишь **40% целей**, а Ofgem в 2025 создаёт **централизованные Energy Theft Unit (полиция Лондона) и Referral Assessment Service**, т.е. ниша аналитики/триажа частично **централизуется регулятором**.
   - **Индия:** input-based distribution franchisee (IBDF) — франчайзи платит input rate за кВт·ч и **забирает всю дельту от снижения AT&C**. Это ближайший аналог revenue-share, но требует опекса/капекса/операционного контроля; из ~28 дивизионов лишь 12 работают (CSEP 2024), расторгнуты Aurangabad, Jalgaon, Nagpur, Kanpur, Ranchi, Jamshedpur, Ujjain/Sagar/Gwalior, Odisha (BSES, лицензии отозваны).
   - **Бразилия (Light, Рио):** в 2012–2016 в программе «Light Legal / APZ» **нанимались малые фирмы с переменным вознаграждением, привязанным к результату снижения потерь и неплатежей** (Huback, COPPE/UFRJ 2018, с. ~104, 123) — единственный найденный пример «оплата за результат» на стороне ДСО; программа свёрнута в ряде фавел из-за насилия.
   - **ЮАР (Tshwane–PEU):** комиссия **19,5 центов с каждого ранда** проданной электроэнергии за умные счётчики → выплачено **R3,1 млрд**, маржа 63%, сделка признана **неконституционной** (2017), урегулирование 2018 — классический кейс «процент от оборота убил контракт».
3. **Регуляторные/репутационные «убийцы» существуют и действуют:** STJ Tema 699 и практика по односторонним TOI (Бразилия), ВС РФ 301-ЭС17-8833 + лимит 4 380 ч (РФ), скандал British Gas/Arvato 2023 (бонусы подрядчикам за принудительные счётчики → до £112 млн, запрет Ofgem), позиция Ofgem о вреде визитов без хищения, NERC (Нигерия) — нулевая комиссия агентам по MD-клиентам с 11.2025.
4. **Contingency распространён — но в зеркальном виде:** против утилит (аудит счетов за ЖКУ в США, 20–40% от возврата; в РФ юрфирмы «платите только за результат» при оспаривании актов безучётного потребления). Это означает: рынок «за результат» жив, но **платёжеспособный спрос и юридическая устойчивость на стороне потребителя, а не сети**.

**Практический вывод для гипотезы:** revenue-share на стороне ДСО нигде не стал стандартом; работающие деньги лежат в (а) per-case/per-visit услугах, (б) per-confirmed-case премиях (регуляторных или внутриконтрактных, как у Tata Power-DDL — Rs 50 + Rs 1 000 за подтверждённый случай), (в) полноценной франшизе с operational control. Юридическая устойчивость акта — главный риск: доля судебной отмены актов высокая везде, где процедура нарушена, а contingency-стимул именно её и провоцирует.

---

## 1. UK — индустрия revenue protection

### 1.1. Масштаб проблемы (цифры Ofgem/REC)
| Показатель | Значение | Источник |
|---|---|---|
| Оценка хищений 2013 | ≥ £200 млн/год, ~£7 на клиента, до 25 000 выявленных случаев/год, до 1/3 — каннабис | Ofgem, «Tackling electricity theft», консультация 2013: https://www.ofgem.gov.uk/publications/tackling-electricity-theft |
| Оценка хищений 2022 (RECCo) | £830 млн – £1,388 млрд/год; +£29–48 к счёту домохозяйства; +370% инцидентов вмешательства в приборы 2017–2021 | Ofgem, Decision R0173 (TDIS), 22.05.2025: https://www.ofgem.gov.uk/sites/default/files/2025-05/Authority%20decision%20to%20approve%20R0173%20Improvements%20to%20the%20Theft%20Detection%20Incentive%20Scheme%20(TDIS).pdf |
| Тот же объём в ценах осени 2024 | **£457–760 млн/год, ~£27 на потребителя**; «одна смерть каждые 10 дней» от вмешательства в счётчики | Ofgem, Decision R0233 (Energy Theft Unit), 26.06.2025: https://www.ofgem.gov.uk/sites/default/files/2025-06/Ofgem-decision-to-Approve-R0233-Introduction-of-an-Energy-Theft-Unit-ETU-under-the-Retail-Energy-Code-REC.pdf |
| Публичная цифра Ofgem | «свыше £1,4 млрд в год» | Ofgem consumer page: https://www.ofgem.gov.uk/information-consumers/energy-advice-households/energy-theft-and-meter-tampering |
| Сообщения о подозрениях (Stay Energy Safe/Crimestoppers) | 12 651 (2024), 13 795 (2025, +9%) | по сводке поиска со ссылкой на https://www.stayenergysafe.co.uk/more-on-energy-theft/energy-theft-latest-facts-and-statistics (страница не отдала текст — вторичный источник) |
| Коммерческие подтверждённые хищения 2022/23→2024/25 | электро +122%, газ +300% за 3 года | Talking Retail, 13.01.2026: https://www.talkingretail.com/news/industry-news/uk-sees-dramatic-rise-in-commercial-energy-theft-13-01-2026/ |

Обратите внимание на **разброс оценок в 7 раз** (£200 млн → £1,4 млрд → £457–760 млн): один из респондентов R0173 прямо пишет, что цели TDIS не выполняются «из-за фундаментальной переоценки уровня хищений, а не из-за дизайна стимулов» (Ofgem R0173, с. 3). Для бизнес-модели «доля от возврата» это означает: **адресуемый объём может быть в разы меньше рекламируемого**.

### 1.2. Модель оплаты подрядчиков
- **UKRPA** (ассоциация revenue protection): «Funding for the RPS is provided through Distribution Use of System charges (to cover infrastructure) and **transactional (to cover the costs of dealing with a specific case of interference)**»; «A major RPS will typically deal with approximately **500 cases of confirmed supply interference per month**». Источник: https://ukrpa.co.uk/home/revenue-protection/
  → Модель: **инфраструктура через сетевой тариф + оплата за случай**. Не доля от взыскания.
- **Grosvenor Services Group** — «industry leader in revenue protection… 20 years+»; **Morrison Data Services** — revenue protection в составе M Group Energy с апреля 2025. Ставки не публикуются. Источники: https://www.grosvenorservices.co.uk/revenue-protection-energy-theft-investigation-specialists/ ; https://www.morrisonds.com/revenue-protection-services/ (сайт Grosvenor из песочницы не открылся — DNS).
- **Тендеры:** SSE Distribution, PIN «FW-Service-Revenue Protection Services-Multi2029» (SSE9052, 06.12.2024): инспекции, расследования, выезды, сбор доказательств, суд; контракт 4+4 года. UK Power Networks — award «Forensic Investigation» (2025/S 000-000313, 07.01.2025). **Стоимость контрактов не раскрыта** (find-tender отдаёт 403 из песочницы). Источники: https://www.find-tender.service.gov.uk/Notice/039407-2024 ; https://www.find-tender.service.gov.uk/Notice/000313-2025/PDF
- **Цены за визит/за подтверждённый случай/доля от взыскания в открытом доступе: не нашёл.** Косвенно: поставщики перекладывают на потребителя «admin or investigation charges» без публичных сумм (пример политики поставщика Maxen Power: https://www.maxenpower.com/support/revenue-protection/).

### 1.3. Регуляторные схемы: TRAS, TDIS, ETU/RAS — «закрыли ли нишу аналитики»
- **TRAS** (Theft Risk Assessment Service, оператор — Experian, с ~2015/16): объединяет данные поставщиков с базой Experian, выдаёт Qualified Outliers, поставщики обязаны их отрабатывать; результаты возвращаются в TRAS. REC Schedule 7 (v1.1, 15.01.2021): https://www.ofgem.gov.uk/sites/default/files/docs/2021/02/rec_v1.1_-_theft_schedule_0.pdf (Annex 2). Описание: https://www.energytheftdetection.co.uk/tras/ (сайт из песочницы не открылся).
  → **Централизованный скоринг существует уже ~10 лет**; частная аналитика «кто ворует» на уровне поставщиков конкурирует с обязательным отраслевым сервисом.
- **TDIS** (Theft Detection Incentive Scheme): цели по доле рынка; выплата за подтверждённый случай. «В первый год — £400 за подтверждённое выявление» (Utility Week, «Suppliers given new incentive to detect energy theft», дата в сводке не указана, страница 403: https://utilityweek.co.uk/suppliers-given-new-incentive-to-detect-energy-theft/). Выполнение целей: **17 423 подтверждённых из 41 000 цели (42%) в 2021/22; 16 581 из 41 000 (40%) в 2022/23** (по сводке поиска из материалов REC/Ofgem R0173 — вторичный источник). Ofgem R0173 (2025): «Suppliers currently meet **40%** of their TDIS targets»; **лишь 37% лидов ETTOS расследуются, конверсия в подтверждённое хищение 22%**.
  Пулы выплат: 2023/24 — £3,3 млн газ + £4,5 млн электро; 2024/25 — **£5,7 млн газ + £4,2 млн электро** (RECCo, 23.02.2026: https://retailenergycode.co.uk/administering-the-theft-detection-incentive-scheme-on-time-and-on-budget/).
  **Расчётный якорь (допущение: ~17 тыс. подтверждённых случаев/год):** £9,9 млн / 17 тыс. ≈ **£580 за подтверждённый случай**.
  R0173 (май 2025) добавляет оплату за desktop investigation и site visit **даже без подтверждения хищения** — т.е. регулятор **отходит от чистого «pay per success»**, признавая, что он не работает.
- **ETU + RAS (R0233/R0234, июнь 2025):** отдельная полицейская Energy Theft Unit (City of London Police, минимум 3 года) + Referral Assessment Service как «единый фильтр и координатор» обращений. Мотив Ofgem: поставщикам «трудно и дорого» расследовать, нужны «specialised Revenue Protection Officers and police support», нарушители уходят к другому поставщику при подозрении. Источник: Ofgem R0233 (см. выше).
  → **Вывод по вопросу «закрыл ли централизованный сервис нишу»:** ниша *скоринга* закрыта TRAS давно; ниша *триажа* централизуется RAS; остаётся ниша *полевого расследования/доказательств* — и она оплачивается per case, а не долей.

### 1.4. Репутационно-регуляторные риски (UK)
- **British Gas / Arvato Financial Solutions (2023):** агенты подрядчика, **мотивированные бонусами**, вскрывали дома уязвимых клиентов для установки предоплатных счётчиков; **£20 млн** в фонд компенсаций, полный пакет **до £112 млн**; Ofgem запретил принудительную установку в группах риска; British Gas забрал установки по ордерам **in-house**. Источники: https://finance.yahoo.com/sectors/energy/articles/british-gas-pays-20m-settle-062203813.html ; https://www.centrica.com/media-centre/news/2023/british-gas-brings-warrant-prepayment-meter-installations-in-house-and-supports-urgent-introduction-of-social-tariffs/ ; https://www.ofgem.gov.uk/press-release/british-gas-agrees-settlement-relation-ofgems-investigation-unfair-treatment-prepayment-meter-customers
  → Прямой прецедент: **сдельно-мотивированный подрядчик в контакте с уязвимыми потребителями = регуляторный удар по заказчику**.
- Ofgem R0173: «we are also aware of the disruption and negative effects of visiting a customer's home, where there is no event of Energy Theft» — регулятор явно фиксирует вред ложноположительных визитов.
- Лицензия SLC 12A обязывает выявлять, является ли клиент пенсионером/инвалидом/хронически больным, и доказывать умысел/небрежность (Ofgem R0173, с. 1).
- Специфического скандала «ложные акты за долю» в UK **не нашёл** (поиск по Ombudsman/BBC/Guardian результатов не дал).

---

## 2. США

- **Contingency на стороне utility за выявление хищений: не нашёл.** Все найденные contingency-модели — **зеркальные**: аудит счетов за ЖКУ для клиентов utility (fee = % от возвратов/экономии; типично «процент от первого года экономии»; у одной фирмы единая ставка **40%**). Источники: https://americanutilityconsultants.com/ ; https://www.utilityaudit.com/performance-based-utility-audits/ ; https://smeng.com/electricity-bill-audit/ ; https://www.inertiaresourcesinc.com/utility-bill-auditing
- На стороне utility рынок — **SaaS/аналитика + собственные Revenue Protection департаменты**: Itron Revenue Assurance («более 12 000 инцидентов хищения газа/электро выявлено» — https://na.itron.com/what-we-offer/revenue-assurance), Bidgely (купила Grid4C 03.2025; на странице theft detection **нет ни одной цифры** по hit-rate/$/ROI/цене — https://www.bidgely.com/theft-detection), Detectent (DTE). Кейс Detectent: ресторан, 11 лет недоплат ≈ **$171 тыс.**, выставлено **$15 869 за 12 месяцев** (лимит back-billing) — https://electricenergyonline.com/energy/magazine/456/article/bridging-the-knowledge-gap-to-identify-energy-theft.htm
- Оценка «$6 млрд/год потерь utilities США» встречается только в слабых источниках (вакансии, вендорские блоги) — **не считать якорем**.
- Отдельные вакансии «Revenue Protection Investigator» у Dominion, ComEd — функция **внутренняя**, зарплатная ($87–182k, ZipRecruiter).

---

## 3. Латинская Америка

### 3.1. Бразилия
**Масштаб и регуляторика:**
- ANEEL, отчёт за 2024: **нетехнические потери R$10,3 млрд (2,85% выручки ДСО)**, технические R$11,2 млрд; **Light + Amazonas Energia = 34,1%** нетехнических; топ-10 ДСО = 74%. ANEEL задаёт **регуляторный лимит** потерь в тарифе: ниже лимита — доход ДСО, выше — убыток ДСО (стимул есть). Источники: https://canalsolar.com.br/perdas-nao-tecnicas-custou-10-bilhoes-aneel/ ; https://www.gov.br/aneel/pt-br/assuntos/distribuicao/perdas-de-energia ; https://solfus.com.br/furtos-e-fraudes-em-energia-poderiam-baratear-custo-da-energia/ (разброс потерь 2% Copel → 22% Light).
- **Юридическая устойчивость TOI — главный риск:** STJ **Tema Repetitivo 699**: административное отключение возможно только за неоплату recuperação de consumo за **90 дней до констатации фраудa**, при соблюдении contraditório/ampla defesa, и отключение — не позднее 90 дней после срока платежа. Источник: https://modeloinicial.com.br/lei/130534/tema-repetitivo-699-stj/num-699. Практика: **односторонняя перícia/TOI без уведомления потребителя — ничтожна**, долг неистребуем; бремя доказывания авторства фраудa — на ДСО (сводка судебной практики TJGO/STJ по поиску; REN 1000/2021 позволяет потребителю доказать, что нарушение возникло до его владения — без custo administrativo). Первоисточник REN 1000 (https://www2.aneel.gov.br/cedoc/ren20211000.html) из песочницы недоступен (403) — **конкретный % custo administrativo не подтверждён**.
- Reclame Aqui содержит массовые жалобы «cobrança de recuperação de consumo» на Light (страница 403) — репутационный фон.

**Операционные цифры (якоря на случай):**
| ДСО, период | Инспекции/лиды | Нарушений | Энергия | Расчёт на случай (моё) | Источник |
|---|---|---|---|---|---|
| Light (RJ), 1П 2026 | — | 28 193 нарушения; 153 тыс. нелегальных подключений нормализовано | 252 ГВт·ч (1П 2026); потери R$1,3 млрд/год; 36 нелегалов на 100 клиентов | ≈1,6 МВт·ч на нормализованное подключение (252 ГВт·ч/153 тыс.) | Cenário Energia 05.08.2026 https://cenarioenergia.com.br/2026/08/05/light-flagra-62-mil-irregularidades-em-julho-e-tenta-conter-perdas-de-r-13-bi-ano/ ; Diário do Rio (март 2026: 4 139 нарушений, 20 арестов; 240 ГВт·ч за период 2025–26, 136 тыс. нормализаций) https://diariodorio.com/light-identifica-mais-de-4-mil-irregularidades-e-prende-20-pessoas-por-furto-de-energia-em-marco |
| Neoenergia Brasília, 2024 | 28 000+ инспекций | 2 000+ регуляризаций (**hit-rate ≈7%**) | 86 ГВт·ч; R$2,8 млн ICMS | ≈43 МВт·ч/случай (крупные клиенты?) | https://www.neoenergia.com/web/brasilia/w/combate-ao-furto-de-energia-garante-retorno-de-r-2-8-milh%C3%B5es-em-impostos-para-o-distrito-federal-em-2024 |
| CPFL, 2025 | 58 000+ жалоб | 16 146 регуляризаций (**≈28% от жалоб**) | 17 500 МВт·ч; инвестиции R$160,9 млн | ≈1,1 МВт·ч/случай | https://cenarioenergia.com.br/2026/04/27/combate-as-perdas-denuncias-de-consumidores-ajudam-cpfl-energia-a-regularizar-16-mil-instalacoes/ |
| Light, 2016 (ретро) | 120 500 инспекций | — | 44,4 ГВт·ч нефактурованного потребления выставлено; R$1,5 млрд нефактуровано, R$500 млн ICMS | ≈0,37 МВт·ч на инспекцию | Huback, COPPE/UFRJ 2018 (диссертация), https://www.gesel.ie.ufrj.br/app/webroot/files/publications/12_huback1.pdf |

Примечание: цифры Light по ГВт·ч в СМИ противоречивы (в одной статье «5 712 ГВт·ч за март» — явная ошибка единиц); брать с осторожностью.

**Единственный найденный аналог «оплата за результат» на стороне ДСО:** программа **Light Legal / Áreas de Perda Zero (APZ, с 2012)**: «foram contratadas pequenas empresas, com menores encargos sociais, colocando técnicos eletricistas que residem nessas áreas… com **remuneração variável atrelada aos resultados obtidos de redução das perdas e da inadimplência**» (Huback 2018, с. ~104 и ~123; 850 тыс. клиентов, 39 APZ по Light 2016). Итог: с ухудшением безопасности Light **вышла из APZ Alemão, Cidade de Deus, Tomazinho и центра**, потеряв инвестиции (там же, с. ~103, 115). Модель существует, но **привязана к территории, персоналу на месте и госбезопасности**, а не к «аналитике без активов».
- Насилие как фактор: Electricaribe (Колумбия) — **242 акта насилия против сотрудников и подрядчиков за сентябрь 2016, 46 — физические** (Huback 2018). «Eletrotraficantes» — часто бывшие техники-подрядчики самой ДСО (там же).

### 3.2. Колумбия
- Electricaribe → Air-e/Afinia (2020): потери **31% (2020) → 30,6% (2021) → 25,1% (2023)**; Air-e **интервенирована Superservicios 12.09.2024**, долг COP 5,3 трлн. Источник: La República 19.06.2025 https://www.larepublica.co/economia/air-e-la-historia-de-una-empresa-que-quedo-en-el-limbo-por-causa-de-la-intervencion-4160994
- **Contraloría взыскала COP 17,56 млрд с Air-e и 11,84 млрд с Afinia за неправомерное перекладывание потерь на пользователей** (Infobae 10.10.2022, https://www.infobae.com/america/colombia/2022/10/10/contraloria-general-recupero-mas-de-29000-millones-de-subsidios-de-energia-en-la-region-caribe/) — регуляторный риск «переусердствовать с возвратом».
- Контрактов с подрядчиками «% от recuperada» **не нашёл**; программа потерь идёт через CONPES 3966 и KPI управляющего контракта.

### 3.3. Мексика
- CFE 2023: **6,2 млн проверок приборов учёта**, 1,8 млн счётчиков заменено → +211 ГВт·ч (449 млн песо), **+4 597 млн песо от recuperación de energía** (La Jornada 07.02.2024, https://www.jornada.com.mx/2024/02/07/economia/020n3eco — по сводке поиска, страница 403). Подрядных схем «за %» **не нашёл**.

### 3.4. Испания (для полноты — как эталон «свой отдел + подрядчики на инспекции»)
- Endesa/e-distribución 2024: **71 000 случаев фраудa при ~428 000 инспекций (hit-rate ≈16,6%)**, **867 ГВт·ч** возвращено (**≈12,2 МВт·ч на случай**), ~30% объёма — плантации каннабиса; инспекции ведут e-distribución **и её подрядчики**. Источник: https://www.endesa.com/en/press/press-room/news/energy-sector/electric-fraud-cases-2024

---

## 4. Индия / Африка / Пакистан

### 4.1. Индия — IBDF как ближайший аналог revenue-share
- Механика: франчайзи платит ДСО **input rate за каждый кВт·ч на входе** и живёт на разнице между сбором и input-платежом, т.е. **забирает 100% выгоды от снижения AT&C** ниже заложенной траектории (CSEP 2024; Indian Infrastructure 2016). Вариант IBF-IRS — с разделением приростной выручки.
- **Результаты:** Bhiwandi (Torrent, с 2007): AT&C **61,3% (2006-07) → 25% (2015-16) → 10,98% (1П FY23)**; Agra 11,35%; Shil-Mumbra-Kalwa 47% (FY17) → 35,32% (1П FY23). Источники: https://indianinfrastructure.com/2016/11/08/limited-success/ ; https://www.tndindia.com/torrent-power-sees-lower-losses-in-franchisee-areas/
- **Провалы:** Aurangabad (GTL) — расторгнут 10.11.2014, требование **Rs 393,07 crore** долга; Jalgaon (Crompton Greaves) — 10.08.2015, дефолт по платежам; Nagpur (Spanco→Essel) — 2011–09.09.2019, финансовое состояние Essel Group; Kanpur (Torrent) — отменён, сотрудники энергокомпании блокировали передачу; Ranchi/Jamshedpur — аннулированы 05.2015; Ujjain/Sagar/Gwalior (Essel) — вышли из-за «политического давления и сопротивления потребителей», хотя снизили потери с 45–47% до 25–30% за год; Muzaffarpur (Essel) — убыток **~Rs 10 crore/мес** из-за неплатежей; Odisha (BSES/Reliance NESCO/WESCO/SOUTHCO) — лицензии **отозваны OERC 04.03.2015** за финансовую несостоятельность и неисполнение предписаний. Источники: Indian Infrastructure 2016; https://www.tndindia.com/india-needs-distribution-franchisees-essel-utilities/ ; https://www.business-standard.com/article/companies/oerc-cancels-distribution-licence-of-reliance-energy-s-discoms-in-odisha-115030400500_1.html ; сводка по CSEP.
- **Оценка модели:** CSEP (2024): из ~28 дивизионов в 9 штатах **только 12 действуют**; результаты в основном **самоотчётные**, независимые аудиты «часто задерживаются или не публикуются»; регуляторы видят франчайзи как вендора, а не регулируемую сущность; «caution in prescribing the IBDF model as a “standard” policy solution». https://csep.org/working-paper/rethinking-franchisee-efficacy-in-indias-power-sector-a-critique-of-input-based-distribution-models/
- Структурная ловушка (Mehta, LinkedIn): статический базовый ABR → при снижении потерь **платёж ДСО растёт пропорционально**, «operational efficiency gained by DF is majorly returned back to Licensee»; при добавлении бытовых потребителей экономика ухудшается. https://www.linkedin.com/pulse/analysis-failure-input-based-power-distribution-franchisee-mehta
- **Внутриконтрактный per-case якорь (Tata Power-DDL):** RC 4600004872 (meter reading & bill distribution, 01.09.2020–31.08.2023, лимит Rs 12,52 crore): за подтверждённые («successfully executed by UTILITY») случаи Direct Theft/DAE/Misuse — **Rs 50/case подрядчику + Rs 1 000/case конкретному контролёру**; за «лишнее подключение» вне биллинга — Rs 50 + Rs 500; штрафы Rs 100–200/case за ошибки. Источник: https://shyamindus.com/wp-content/uploads/2022/01/MRBD-RC.pdf (Annexure 6, с. 35). Tata Power-DDL AT&C **5,54% на 31.03.2025** (сводка поиска по годовому отчёту).
  → Индийский ДСО с лучшими потерями платит за выявление **фикс за подтверждённый случай ~Rs 1 050 (≈$12,5)**, а не долю.

### 4.2. ЮАР
- **Tshwane – PEU Capital Partners (умные счётчики/вендинг):** **19,5 цента с каждого ранда** проданной электроэнергии; выплачено **R3,1 млрд** (~R5 млн/день); заявленная маржа PEU 63%; сделка признана **неконституционной (2017)**, урегулирование утверждено судом 23.10.2018 (комиссия снижена до 9,5c, новые провайдеры — 6–7c). Источники: https://www.citizen.co.za/news/south-africa/court-orders-replacement-of-tshwanes-smart-meters/ ; https://www.news24.com/news24/tshwanepeu-prepaid-meter-deal-declared-unconstitutional-20171013
  → Самый чистый в выборке пример «% от денежного потока за технологию без активов» — и самый громкий провал.
- **Eskom revenue protection:** штраф за вмешательство **R6 052,30**; **100 000 штрафов** «zero buyers» (News24 12.12.2024); вандализм/кражи **R221 млн** апр.2024–фев.2025; жители Orange Farm (120+ домохозяйств, отключены 2+ года) «Eskom, если мы согрешили, простите» — репутационный фон. Источники: https://groundup.org.za/article/eskom-if-we-have-sinned-please-forgive-us-my-prayer-candles-have-burnt-out/ ; https://www.capetownetc.com/news/eskom-cracks-down-on-electricity-meter-tampering/ ; https://www.news24.com/business/companies/eskom-fines-100-000-illegal-electricity-users-as-last-day-for-zero-buyer-leniency-strikes-20241212
- Муниципальные тендеры на «electricity meter audit, revenue protection assessment, GIS verification» (напр., Greater Kokstad GKM 52-25/26, закрытие 30.06.2026; оценка: функциональность 80 / цена 20) — **основа ценообразования в открытой части не раскрыта**. https://www.protenders.co.za/tender/the-appointment-of-service-provider-for-electricity-meter-audit-revenue-protecti-ocds-9t57fa-159221 . Подрядчиков Eskom «за % от recovered» **не нашёл** (упомянут Macrocomm как «revenue recovery projects» без условий).

### 4.3. Нигерия
- NERC, правила по third-party collection (с 01.11.2025, полное соответствие до 31.12.2025): **предоплата выручки агентами (prefunding)**, только CBN-лицензированные провайдеры, **нулевая комиссия и запрет агентов по MD-клиентам**; мотив — «leakages», «diverted funds». Источник: https://leadership.ng/new-third-party-collection-rules-demand-upfront-payment-to-boost-electricity-sector-liquidity/ . Ставки агентов: N20 за USSD-платёж < N5 000; сельские агенты до 3,25% с капом N2 000 (сводка поиска).
  → Регулятор **сворачивает** посредников на самом денежном сегменте — противоположный тренд гипотезе.

### 4.4. Пакистан
- K-Electric + FIA: **168 000+ случаев, 298,7 млн кВт·ч** (≈1,78 МВт·ч/случай), 980 FIR, 33 ареста с 09.2023 по 07.2024 (Dawn 25.07.2024, https://www.dawn.com/news/1847765). Подрядчиков за % **не нашёл**. NEPRA: слабость DISCO добавила Rs 397 млрд к circular debt в FY25 (https://www.brecorder.com/news/40402591/...).

### 4.5. Ямайка (из Huback 2018)
- JPS + Crime Stop Jamaica: вознаграждение **US$100 000** за выявление нелегальных подключений у крупных клиентов с возвратом выручки и арестом; янв–июл 2014 — 500+ арестов, «наказание лёгкое и неэффективное».

---

## 5. Россия и «некролог»

### 5.1. РФ
- **Аутсорсинг за долю от взысканного: не нашёл.** Найденные аналитические пилоты — **МТС EnergyTool**: Башкирэнерго (2020, показания занижены в 7–10 раз, цеха вместо жилья), Россети Сибирь (19.06.2023, пилот Кузбасс), Россети (16.10.2025, майнинг +15% в 2025). **Коммерческие условия ни в одном сообщении не раскрыты**; результатов в рублях нет. Источники: https://www.cnews.ru/news/line/2023-06-19_mts_i_rosseti_sibir_zajmutsya ; https://www.comnews.ru/content/241819/2025-10-17/2025-w42/1007/mts-vychislit-maynerov-dlya-rossetey
- Правовой каркас: ПП РФ №442; акт безучётного потребления — основное доказательство; ВС РФ 301-ЭС17-8833 (2017) — два типа нарушений (пломбы = нарушение per se; иное — нужно доказать искажение учёта); **лимит расчёта 4 380 часов с июля 2020**; суды лишают акт силы при нарушении права потребителя присутствовать. Источник: https://www.dvitex.ru/poleznoe/biznes/arbitrazhnyy-yurist/bezuchetnoe-potreblenie-elektroenergii-chto-nuzhno-znat-potrebitelyu-i-kak-vyigrat-sud/
- **Contingency существует — на стороне потребителя:** юрфирмы оспаривают акты «платите только за результат» (https://profenergoservice.ru/assistance-with-non-contractual-consumption), утверждая, что энергокомпании «намеренно завышают первичные суммы, чтобы затем договориться».
- Долги: энергосбыты привлекают коллекторов **по агентской схеме (цессия запрещена), 5–7% от взысканного** (сводка поиска: https://legres.ru/info/kak-rabotat-s-dolgami ; https://fcbg.ru/kollektorskie-agentstva/skolko-poluchayut-kollektory) — это единственный найденный в РФ «% от возврата» в энергетике, и он про **дебиторку, а не про акты**.
- Россети Центр: 1 кв. 2018 — 1 995 фактов хищений, 600 адм. дел, 5 уголовных (https://www.mrsk-1.ru/customers/against-theft/).
- **Кто ушёл с рынка РФ: не нашёл** (лимит поиска; целевые запросы по стартапам результатов не дали).

### 5.2. Некролог / провалы (сводно)
| Кейс | Что было | Чем кончилось | Источник |
|---|---|---|---|
| Tshwane–PEU (ЮАР) | 19,5c/ранд с вендинга | Неконституционно; R3,1 млрд выплачено | Citizen; News24 |
| British Gas/Arvato (UK) | Бонусы подрядчику за счётчики | £20 млн redress, до £112 млн; запрет; in-house | Yahoo/Telegraph; Centrica |
| IBDF Индия (8+ франшиз) | Полный residual claimant | Расторжения за неплатежи/политику | CSEP 2024; Indian Infrastructure |
| Light APZ (Бразилия) | Малые подрядчики с переменной оплатой за результат | Выход из части фавел из-за насилия | Huback 2018 |
| Air-e (Колумбия) | Оператор с KPI по потерям | Интервенция 09.2024; взыскания Contraloría | La República; Infobae |
| TDIS (UK) | Pay per confirmed case | 40% целей; переход к оплате процесса + полиция | Ofgem R0173/R0233 |
| NERC (Нигерия) | Агентские комиссии | Ноль комиссии по MD, prefunding | Leadership.ng |
| Стартапы theft-analytics, закрывшиеся | — | **не нашёл** (поиск дал только живых вендоров: Bidgely/Grid4C, Itron, Detectent) | — |

---

## 6. Ценовые якоря (всё, что удалось зафиксировать)

| Якорь | Значение | Тип | Источник |
|---|---|---|---|
| UK TDIS, премия за подтверждённый случай | **£400** (первый год схемы) | регуляторная per-case | Utility Week (сводка) |
| UK TDIS, расчётно 2024/25 | **≈£580/случай** (£9,9 млн / ~17 тыс.) | **моя оценка, допущение** | RECCo 02.2026 + R0173 |
| UK масштаб | £457–760 млн/год (цены 2024); ~£27/потребитель | объём | Ofgem R0233 |
| UK конверсия | 37% лидов расследуется; 22% → подтверждение | воронка | Ofgem R0173 |
| UK крупный RPS | ~500 подтверждённых случаев/мес | ёмкость | UKRPA |
| Tata Power-DDL | **Rs 50 + Rs 1 000 за подтверждённый случай хищения** (≈$12,5) | per-case подрядчику | RC 4600004872, Annex 6 |
| JPS Jamaica | US$100 000 награда за крупный кейс | bounty | Huback 2018 |
| Tshwane–PEU | 19,5c/ранд → 9,5c → рынок 6–7c | % с оборота (вендинг) | Citizen |
| Endesa 2024 | 12,2 МВт·ч/случай; hit-rate 16,6% | объём/случай | Endesa |
| K-Electric | 1,78 МВт·ч/случай | объём/случай | Dawn |
| Light 2025-26 | ≈1,6 МВт·ч/нормализованное подключение; R$1,3 млрд/год потерь | объём/случай | Cenário Energia; Diário do Rio |
| CPFL 2025 | ≈1,1 МВт·ч/случай; 28% конверсия жалоб | объём/случай | Cenário Energia |
| Neoenergia Brasília 2024 | hit-rate ≈7% инспекций | воронка | Neoenergia |
| Eskom | штраф R6 052,30; 100 тыс. штрафов | тариф санкции | GroundUp; News24 |
| US bill audits (зеркальная модель) | 20–40% от возврата | contingency (против utility) | UtilityAudit/ATUC/SM Eng. |
| РФ коллекторы для энергосбытов | 5–7% от взысканного (агентская схема) | contingency по дебиторке | legres/fcbg (сводка) |
| STJ Tema 699 | отключение только за 90 дней recuperação | правовой лимит | modeloinicial |
| РФ | лимит 4 380 ч расчёта безучётки | правовой лимит | dvitex |
| Water NRW PBC (аналог) | 43 проекта, PBC на 68% эффективнее; ожидаемая IRR 18% (до 35%); контракты $0,5–5,5 млн; 94% считают предфинансирование high-risk | perf.-based, соседний сектор | World Bank PPP; blogs.worldbank.org |
| «Средняя сумма доначисления на случай» в деньгах | **не нашёл** ни для UK, ни для Бразилии, ни для РФ | пробел | — |

---

## 7. Что это означает для гипотезы (сухой остаток)

1. **Модель «доля от возврата, без активов» не имеет мирового прецедента с публичной ценой в электроэнергетике.** Все реальные деньги — per case/per visit (UK), фикс за подтверждённый случай (TDIS, TPDDL), полная франшиза с operational control (IBDF), результативная оплата местным бригадам (Light APZ), либо % с оборота за инфраструктуру (PEU — и это кончилось судом).
2. **Регулятор везде движется к централизации и к оплате процесса, а не успеха** (TRAS → ETU/RAS; R0173 добавляет оплату за визиты без подтверждения; NERC убирает комиссии). Причина одна: pay-per-success создаёт стимул к агрессивным актам и ложноположительным визитам, что регуляторы прямо фиксируют как вред.
3. **Юридическая устойчивость акта — ключевой риск contingency:** STJ Tema 699 и практика по односторонним TOI; ВС РФ и 4 380 ч; в РФ и Бразилии выросла «зеркальная» индустрия отмены актов за долю. Модель, где доход = % от взысканного, будет систематически недополучать из-за отмен и мировых, и одновременно нести репутационный риск заказчика (кейс Arvato).
4. **Воронка узкая:** 7–17% инспекций дают нарушение (Neoenergia, Endesa), 22% лидов → подтверждение (UK), 1–2 МВт·ч на типовой бытовой случай (K-Electric, CPFL, Light). Экономика «за долю» держится только на крупных потребителях (Endesa 12 МВт·ч/случай, JPS-bounty на «grandes clientes») — а именно там сопротивление и судебное оспаривание максимальны.
5. **Экспорт «на рынки с высокими потерями»** упирается в насилие и политику, а не в аналитику: Electricaribe (242 нападения/мес), Light (выход из фавел), Индия (франшизы рвутся из-за неплатежей и политики), Нигерия (регулятор режет посредников). Аналитика без полевой, юридической и силовой части не монетизируется долей.

**Если менять гипотезу:** ближе к рынку — (а) фикс за подтверждённый и юридически устоявший акт + небольшой success-kicker; (б) SaaS/аналитика per meter для собственных подразделений revenue protection; (в) участие в централизованных сервисах (аналог TRAS/RAS) как поставщик скоринга. Каждый из них имеет прецеденты и цены; чистый revenue-share — нет.

---

## 8. Пробелы («не нашёл» — явно)
- Публичные £/визит и £/случай подрядчиков UK (Grosvenor/MDS); стоимость контрактов SSE/UKPN.
- Contingency на стороне utility в США за theft detection.
- Контракты «% от recuperada» в Бразилии/Колумбии/Мексике; точный % custo administrativo по REN 1000 (первоисточник 403).
- Подрядчики Eskom/DisCo/K-Electric «за %».
- Средняя денежная сумма доначисления на случай (везде).
- Ушедшие с рынка РФ/мира компании theft-analytics.
- Полные условия MTS EnergyTool.
