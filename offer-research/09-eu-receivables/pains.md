# Боли с просрочкой B2B-оплат в Европе и UK: выбор сегмента для «агента по дебиторке»

*Дата исследования: 30.09.2026. Продукт: ИИ готовит напоминания должникам, человек одобряет в чате, агент разбирает ответы и доводит до досудебного требования (Letter Before Action). ICP: SMB на 10–200 человек, не айтишный, много B2B-клиентов на отсрочке.*

**Как читать.** У каждой цифры есть ссылка. «Не подтверждено» стоит там, где я не нашёл первоисточник или не смог его открыть. Оценки в рейтинге (1–5) — это моё суждение по собранным данным, не измерение.

**Важная оговорка про отраслевые данные.** Отраслевая статистика бывает двух видов, и их легко перепутать:
- **(А) как отрасль получает деньги** — это и есть боль нашего клиента. Сюда относятся Xero, DBT/LSBS, RISR, Klipboard.
- **(Б) как отрасль платит своим поставщикам** — Altares, Creditreform, UK Payment Practices Reporting, Novuna. Такие цифры говорят о финансовом стрессе в отрасли и о её клиентах, но не о том, насколько больно ей самой.

---

## 0. Итог (TL;DR)

| # | Сегмент (первый рынок: UK) | Боль | Платёжеспособность | Нетехничность | Скорость сделки | Σ /20 | Вердикт |
|---|---|---|---|---|---|---|---|
| 1 | **Временный персонал / кадровые агентства (temp staffing), без полного факторинга** | 5 | 4 | 3 | 4 | **16** | Первый заход: боль лучше всего подтверждена данными |
| 2 | **Коммерческий клининг и охрана (facility services)** | 5 | 3 | 5 | 4 | **17*** | Тот же разрыв «еженедельная зарплата против оплаты за 30–60+ дней», но данных меньше; поставить параллельным пилотом |
| 3 | **Builders' merchants и оптовая дистрибуция** | 4 | 4 | 4 | 3 | **15** | Самый большой объём счетов на клиента; тормозит интеграция с отраслевой ERP |
| 4 | Производство и инжиниринг SME (добавлен по данным) | 3–4 | 4 | 4 | 3 | 14–15 | Кандидат на вторую волну |
| 5 | Субподрядчики в строительстве (UK) | 5 | 3 | 5 | 2 | 15 | Боль максимальная, но продукту подходит хуже: заявки на оплату, pay-less notices, споры, удержания |
| 6 | Грузоперевозки (haulage) | 4 | 2 | 5 | 3 | 14 | Маржа тонкая, много микробизнеса, распространён факторинг |
| 7 | IT, агентства, B2B-услуги | 3 | 4 | 1–2 | 4 | 12 | Технически грамотны, соберут или купят решение сами; для нетехничного ICP не подходят |

\* У клининга и охраны сумма выше, чем у staffing, но **доказательная база слабее**: нет свежего отраслевого опроса именно про их дебиторку. Поэтому №1 — staffing, а клининг и охрана идут вторым пилотом, и их боль надо подтвердить интервью.

**География первого захода — UK (затем Ирландия).** Причины:
- просрочка заметная (12,9 дня по Altares), а Нидерланды и Германия платят дисциплинированно (3 и ~7 дней);
- английский язык;
- много пользователей Xero, QuickBooks и Sage;
- есть готовая юридическая лестница: законные проценты и компенсация по Late Payment Act, Letter Before Action;
- законопроект (Commercial Payments Bill, объявлен в марте 2026, в King's Speech в мае 2026; на 21.07.2026 — стадия комитета в Палате лордов, применение ожидается не раньше 2027, см. legal.md) даёт повод для разговора: потолок отсрочки 60 дней и **обязательные** проценты 8% + ставка Банка Англии.

Франция, Испания, Италия и Португалия по боли сильнее (14–24 дня), но это отдельная локализация.

---

## 1. Макроданные по странам

### 1.1 Европа в целом

| Метрика | Значение | Источник |
|---|---|---|
| Разрыв между фактическим сроком оплаты и договорным (B2B payment gap) | вырос с 16 дней (2023) до **20 дней (2026)** | [Intrum EPR 2026, пресс-релиз 21.04.2026](https://storage.mfn.se/507ca676-a5fc-46ea-90b6-35cf6f8524e0/intrums-european-payment-report-2026-late-payments-are-holding-back-european-growth.pdf) |
| Доля выручки, полученной с опозданием | **>12%**, выше порога, который компании считают «терпимым» | там же |
| Компании, которые сами платят поставщикам позже из-за чужих задержек | 62% | там же |
| Компании, которые не выполнили план роста из-за просрочек | 57% | там же |
| Компании, которые уже используют ИИ в платежах | 66% (в 2025 — 59%); 55% говорят, что им не хватает навыков | там же |
| Экономия на чейзинге от ИИ по оценке Intrum | ~20% затрат | там же |
| Время на выбивание долгов | в среднем 73 рабочих дня в год, ~10,15 ч в неделю (EPR 2024); UK — 72 дня, DE — 78 | [Intrum EPR 2024](https://intrum.com/insights/publications/epr-2024/european-companies-spend-73-days-chasing-debt-in-2024) |
| Компании Западной Европы, столкнувшиеся с просрочкой | «почти 4 из 5»; доля торгового кредита — 52% B2B-продаж | [Atradius PPB 2026, пресс-релиз 20.05.2026](https://kyodonewsprwire.jp/index.php/release/202605209423) |
| Доля просроченных B2B-счетов в Западной Европе | 47%; безнадёжные долги — 6% (из пересказа поисковика, в первоисточнике не проверено) | не подтверждено; см. [Atradius PPB WE](https://atradius-mx-ts1.opc.oracleoutsourcing.com/reports/payment-practices-barometer-western-europe.html) |
| Средний срок отсрочки в Западной Европе | 52 дня против 41 годом ранее (Atradius 2024) | [Atradius PPB WE 2024 (PDF через FCIB)](https://fcibglobal.com/pdf/news/B2B%20payment%20practices%20trends%20Western%20Europe%20-%20Strategic%20credit%20management%20crucial%20as%20bad%20debts%20and%20DSO%20worsen.pdf) |
| Глобальный DSO (дни до получения оплаты) | 56,5 дня в 2025 году | [Allianz Trade DSO Report 2026, 16.07.2026](https://www.allianz-trade.com/en_global/news-insights/news/dso-report-2026.html) |

### 1.2 Страны: средняя просрочка сверх срока (Altares / D&B, 1-е полугодие 2025)

Источник: [Altares, «Comportements de paiement France et Europe S1 2025»](https://www.altares.com/wp-content/uploads/ALTARES_Etude-Comportements-de-paiement-France-et-Europe_S12025.pdf).

| Страна | Дней просрочки | Платят вовремя |
|---|---|---|
| Нидерланды | ~3 | >80% |
| Германия | <7 | >60% |
| Бельгия | <12 | 47% |
| Ирландия | 12,7 | 54,3% |
| **UK** | **12,9** | **57,5%** |
| Европа, в среднем | 14,0 | — (9,3% компаний опаздывают больше чем на 30 дней) |
| Франция | 14,1 | 45,2% |
| Испания | ~15 | ~45% |
| Италия | 17 | — (~12% опаздывают больше чем на 30 дней) |
| Португалия | 24 | ~20% (16% опаздывают больше чем на месяц) |

**Германия, Creditreform (2-е полугодие 2025).**
- Средняя просрочка — 7,50 дня (в 2022 году было ~11).
- Средний договорной срок — 32,13 дня; полный срок оплаты — 39,63 дня.
- Источники: [Unternehmeredition](https://www.unternehmeredition.de/?p=84863), [retail-news.de](https://retail-news.de/zahlungsindikator-winter-2025-26/).
- По отраслям (из пересказа поисковика, в первоисточнике не сверено — **не подтверждено**): строительство — худшая дисциплина, 13,5–15 дней; оптовая торговля — ~6 дней.

**Вывод.** Германия и Нидерланды — рынки с низкой болью, туда первыми не идём. UK и Ирландия — «средняя» боль при удобном языке и законодательстве. Юг Европы — самая сильная боль, но это отдельные языки и практики.

### 1.3 UK подробнее

| Метрика | Значение | Источник |
|---|---|---|
| Малый бизнес (клиенты Xero): средний срок получения оплаты | 29,1 дня (кв. 2 2026) | [Xero SBI UK](https://www.xero.com/resources/small-business-insights/latest-united-kingdom) |
| Малый бизнес: средняя просрочка | 8,3 дня (кв. 2 2026); 8,4–8,6 дня за 2025 год | там же; [Xero UK Update, июль 2026](https://brandfolder.xero.com/NE531UQB/at/95p34jj9hkpr888p4b9kjhn/UK_Update_-_Jul_2026.pdf) |
| Просрочка по отраслям, кв. 4 2025 | искусство и досуг — 13,2 дня; образование — 11,7; ИТ и медиа — 11,2; **производство — 10,9**; HoReCa — 4,7 (лучший результат) | [Xero UK Update, февраль 2026](https://brandfolder.xero.com/NE531UQB/at/ckks7xhb8sk44jk3hb48sp/UK_Update_-_Feb_2026.pdf) (через поисковую выдачу; цифры по стройке и опту найти не удалось) |
| Стоимость просрочек для экономики | ~£11 млрд в год; затронуто 28% бизнесов (~1,5 млн); **86 часов** в год на чейзинг на каждый затронутый бизнес | [DBT / London Economics «Late Payments Research», июль 2025](https://assets.publishing.service.gov.uk/media/688a089a6478525675738ff9/late_payments_research_impact_on_uk_economy.pdf) |
| Есть проблемы с оплатами (просрочка и/или сроки >60 дней), по размеру компании | микро — 19%; **малые (10–49) — 38%**; **средние (50–249) — 49%**; крупные — 66% | там же, таблица 2 |
| Деньги, застрявшие в просрочке, у затронутых компаний | малые — в среднем £52 081 (1,47% оборота); средние — £193 635 (0,79%) | там же, таблица 3 |
| Доля SME, для которых просрочка — «большая проблема» (LSBS 2023) | стройка — 10,1% всех SME (≈17% среди тех, кто даёт отсрочку); бизнес-услуги — 9,1% (≈17%); дистрибуция — 5,6% (≈11,5%); производство — 5,3% (≈7%) | там же, таблица 9 (пересчёт «среди дающих отсрочку» — мой) |
| Новые судебные решения о взыскании долгов с бизнеса (CCJ), Англия и Уэльс | 167 642 за 2025 год (+1,4% к 2024) | [Registry Trust, статистика](https://registry-trust.org.uk/stats/q4-2025-statistics) |
| Законопроект (ещё не закон, см. legal.md) | 24.03.2026 объявлены: потолок отсрочки 60 дней, обязательные проценты 8% + ставка Банка Англии, штрафы от Small Business Commissioner, запрет удержаний (retentions) в стройке; внесён в King's Speech в мае 2026 | [GOV.UK, пресс-релиз](https://www.gov.uk/government/news/time-to-pay-up-government-unveils-toughest-crackdown-on-late-payments-in-over-25-years); [ChannelX](https://channelx.world/2026/05/small-business-commissioner-welcomes-late-payments-announcement-in-the-kings-speech/) |
| Каждый день закрываются из-за неплатежей | ~38 малых бизнесов | [GOV.UK, пресс-релиз](https://www.gov.uk/government/news/time-to-pay-up-government-unveils-toughest-crackdown-on-late-payments-in-over-25-years) |
| FSB: малых бизнесов в цепочках поставок, которым платили с опозданием | 84% (дата опроса не установлена — **не подтверждено**) | [Scottish Financial News](https://www.scottishfinancialnews.com/articles/fsb-scotland-s-smaller-firms-plead-for-late-payment-action) |

**Что это значит для продукта.** Закон уже даёт кредитору право на проценты и фиксированную компенсацию за каждый счёт: £40, £70 или £100 в зависимости от суммы ([GOV.UK: claim debt recovery costs](https://www.gov.uk/late-commercial-payments-interest-debt-recovery/claim-debt-recovery-costs); проценты 8% + base rate — [GOV.UK](https://www.gov.uk/late-commercial-payments-interest-debt-recovery/charging-interest-commercial-debt)). Большинство SME этим не пользуются. Среди субподрядчиков, например, начисляли проценты лишь 5% ([Construction Enquirer, 2014](http://www.constructionenquirer.com/?p=99668)). Агент, который сам считает проценты и компенсацию, добавляет их в эскалацию и готовит Letter Before Action, приносит измеримые деньги сверх экономии времени.

---

## 2. Карточки сегментов

### 2.1 Temp staffing (временный персонал) — №1

- **Механика боли.** Временным работникам платят еженедельно, а клиенты оплачивают счета через 30–60–90 дней ([REC / Novuna](https://www.rec.uk.com/our-view/news/news-our-business-partners/managing-cashflow-costs-and-confidence-todays-economy)). По оценке Sonovate, агентство ждёт оплату в среднем 56 дней ([Sonovate](https://www.sonovate.com/blog/why-is-your-recruitment-agency-not-being-paid-on-time/); дата и методология не указаны — **не подтверждено**).
- **Цифры (RISR, конец 2025 года)** ([REC](https://www.rec.uk.com/our-view/news/news-our-business-partners/managing-cashflow-costs-and-confidence-todays-economy)):
  - у 34% агентств денежный поток ухудшился в 2025 году;
  - у 35% за 12 месяцев появился безнадёжный долг (в среднем по всем отраслям — 30%);
  - из них 57% потеряли ≥£10k, 21% — ≥£50k;
  - ~1/3 агентств говорят, что быстрые оплаты от клиентов сняли бы напряжение с денежным потоком.
- **Почему клиенты платят поздно.** Не сходятся таймшиты с номерами заказов (PO), клиент ждёт «сверки», агентство боится испортить отношения ([Sonovate](https://www.sonovate.com/blog/why-is-your-recruitment-agency-not-being-paid-on-time/)). Для агента это удобно: причины типовые, ответы клиентов можно классифицировать («нет PO», «спор по часам», «ждём одобрения»).
- **Кто занимается дебиторкой.** В агентствах на 10–200 человек обычно есть бухгалтерия или финдиректор и часто отдельный credit controller. **Ключевой риск:** многие сидят на факторинге или invoice finance, а в полном факторинге кредит-контроль делает фактор ([Ultimate Finance](https://ultimatefinance.co.uk/work-with-us/business-owners/funding-for-the-human-resourcing-industry), [Novuna](https://www.novuna.co.uk/news-and-insights/business-cash-flow/credit-control-for-recruitment-agencies-reduce-late-payment-risk/)). Поэтому целимся в агентства **без полного факторинга** (свой кредит-контроль, конфиденциальный invoice discounting или без финансирования). Доля таких агентств — **не подтверждено**, выяснять в интервью.
- **Платёжеспособность.** Высокая: оборот агентства на 50 внутренних сотрудников с сотнями временных работников исчисляется миллионами фунтов, при таком обороте просрочка стоит дорого. Оценка качественная.
- **Нетехничность.** Средняя: работают с ATS и back-office системами (Access, Eque2, 3r и т.п. — список не проверялся), но не разработчики.

### 2.2 Коммерческий клининг и охрана — №2

- **Механика боли.** Та же, что у staffing: зарплата раз в неделю или две, клиенты (в том числе FM-интеграторы и крупные компании) просят отсрочку на 45–60 дней ([Sprintlaw UK](https://sprintlaw.co.uk/articles/pricing-and-payment-terms-for-uk-cleaning-service-contracts/); [Novuna: factoring for security companies](https://www.novuna.co.uk/news-and-insights/business-cash-flow/factoring-for-security-companies/)). Платить работникам позже нельзя по закону: удержание зарплаты незаконно по Employment Rights Act ([LegalVision UK](https://legalvision.co.uk/employment/limits-late-employee-payments-small-businesses/)).
- **Косвенные данные о стрессе в отрасли (данные типа Б).**
  - Во Франции сама охрана платит своим поставщикам с опозданием почти на 26 дней, консалтинг — ~21, фрахт — ~17 (Altares, кв. 2 2025, [PDF](https://www.altares.com/wp-content/uploads/ALTARES_Etude-Comportements-de-paiement-France-et-Europe_S12025.pdf)).
  - В UK FM-подрядчики из верхнего эшелона тоже платят поздно. Atlas Cleaning не оплатил в срок 45% платежей во 2-м полугодии 2025 года ([Payment Practices Reporting](https://check-payment-practices.service.gov.uk/report/107903) — номер отчёта взят из поисковой выдачи, сам отчёт не открывал). Это цепочка, в конце которой стоит наш малый клининг-субподрядчик.
- **Кто занимается дебиторкой.** Обычно владелец, офис-менеджер или приходящий бухгалтер. Это очень нетехничный сегмент — идеально для модели «одобри в чате».
- **Платёжеспособность.** Ниже: маржа в клининге тонкая (точных цифр по UK не нашёл — **не подтверждено**). Цену стоит привязывать к ускорению поступлений, а не брать высокий фиксированный тариф.
- **Пробел в данных.** Свежих отраслевых опросов от BCC, BICSc или BSIA про дебиторку своих членов найти не удалось. Боль надо подтвердить 10–15 интервью.

### 2.3 Builders' merchants и оптовая дистрибуция — №3

- **Klipboard + Censuswide (март 2026; 327 дистрибьюторов и 250 закупщиков, UK)** ([Professional Builders Merchant, 15.07.2026](https://professionalbuildersmerchant.co.uk/news/klipboard-research-reveals-98-percent-of-uk-distributors-deal-with-late-payments/)):
  - **98%** сталкиваются с просрочкой;
  - **56%** тратят больше 6 часов в неделю на ручную работу с платежами;
  - **96%** держат хотя бы одного сотрудника под платежи и кредит-контроль.
- **Позиция BMF.** Федерация давно жалуется, что подрядчики навязывают 120 дней как «норму» ([Builders Merchants News](https://www.buildersmerchantsnews.co.uk/news/news-archive/bmf-calls-bis-break-late-payment-culture); публикация старая, эпохи BIS).
- **Клиенты мерчантов — мелкие строители.** 81% UK-тредсменов сейчас ждут оплату, в среднем им должны £6 210 ([Direct Line via PBM, 14.10.2024](https://professionalbuildersmerchant.co.uk/news/direct-line-research-reveals-concerning-extent-of-late-payments-to-uk-tradespeople/)). Отсюда хроническая просрочка по торговым счетам у мерчантов.
- **Плюсы.** Сотни и тысячи торговых счетов на одну компанию, много однотипных напоминаний — идеальный объём для агента. Кредит-контролёр уже есть, агент усиливает его, а не заменяет.
- **Минусы.**
  - Отраслевые ERP (Kerridge/Klipboard, Merchanter и др. — вывод по названию исследования Klipboard) вместо Xero, поэтому интеграция дольше.
  - Решение часто принимает финдиректор, есть кредитное страхование.
  - По данным Altares, торговля строительными материалами во Франции — одни из лучших плательщиков (~10 дней). Значит, у **самих** мерчантов финансы в порядке, а страдают они от клиентов.

### 2.4 Производство и инжиниринг SME — №4 (добавлен)

- По Xero это одна из худших отраслей UK по просрочке: 10,9 дня (кв. 4 2025, [Xero UK Update, февраль 2026](https://brandfolder.xero.com/NE531UQB/at/ckks7xhb8sk44jk3hb48sp/UK_Update_-_Feb_2026.pdf)).
- По LSBS реже всех говорят, что «не дают отсрочку» (26%): почти все торгуют в кредит ([DBT 2025](https://assets.publishing.service.gov.uk/media/688a089a6478525675738ff9/late_payments_research_impact_on_uk_economy.pdf), таблица 9).
- Крупные покупатели часто платят через 60–90 дней. **Не подтверждено для UK SME**: в поиске встречаются только агрегаты, например оценка Novuna «80+ дней» по производству ([Novuna](https://www.novuna.co.uk/news-and-insights/business-cash-flow/late-payments-soar-past-50-days-the-uks-worst-paying-industries-revealed/)). Эта цифра смешивает данные типа А и Б.

### 2.5 Субподрядчики в строительстве — №5

- **Боль максимальная и хорошо задокументирована.**
  - DBT (июль 2025): задержка выплаты удержаний (retentions) коснулась 71% подрядчиков, у которых их удерживали; больше половины сталкивались с частичной или полной невыплатой ([Scottish Construction Now](https://www.scottishconstructionnow.com/articles/huge-amounts-late-payments-still-written-subcontractors), [NFRC](https://www.nfrc.co.uk/resource/nfrc-welcomes-landmark-payment-consultation-a-vital-opportunity-to-end-retention-abuse-once-and-for-all.html)).
  - NFRC: только в кровле и фасадах в удержаниях заперто больше £300 млн.
  - Старый, но большой опрос NSCC/FMB (2014; 719 фирм): 92% работают на сроках ≤45 дней, но в срок получают только 57%; удержаний £439 млн, из них 45% просрочено ([Construction Enquirer](http://www.constructionenquirer.com/?p=99668), [Construction Index](https://www.theconstructionindex.co.uk/news/view/late-payment-remains-rife)).
- **Почему не №1.**
  1. Оплата идёт по процедуре Construction Act: заявка на оплату, payment notice, pay-less notice, adjudication. Это в первую очередь юридическое сопровождение и работа сметчика (QS), а не вежливое напоминание.
  2. Должник — генподрядчик с сильной переговорной позицией: давить напоминаниями рискованно для отношений.
  3. Запрет удержаний по новому закону частично снимет эту боль.
- **Вариант нишевого продукта «агент по заявкам на оплату и срокам по Construction Act»** — отдельная гипотеза.

### 2.6 Грузоперевозки — №6

- RHA: крупные клиенты платят через 90 дней и позже, а ≥60% затрат (зарплата и топливо) надо оплачивать в течение двух недель ([Skipton Business Finance, пересказ RHA](https://www.skiptonbusinessfinance.co.uk/industry-news/rha-expresses-late-payment-concerns)). Дата публикации **не подтверждена**.
- RHA, май 2026: «late payment kills viable firms…» — Richard Smith; за предыдущий год обанкротились 400 транспортных компаний ([trans.info, 20.05.2026](https://trans.info/en/pay-hauliers-on-time-476815)).
- **Минусы.** Много микроперевозчиков (1–5 машин), тонкая маржа, распространены факторинг и оплата через биржи грузов. Дешёвый сегмент.

### 2.7 IT, агентства, B2B-услуги — №7

- Просрочка заметная: ИТ и медиа — 11,2 дня (Xero, кв. 4 2025); консалтинг во Франции как плательщик — ~21 день (Altares).
- **Но.** Клиенты технически грамотны, сами настраивают Chaser или Xero-напоминания либо пишут скрипты. Для нетехничного ICP не подходят, и ценность «одобри в чате» для них ниже.

---

## 3. Отраслевые голоса (цитаты)

**Ограничения.** Reddit недоступен моему поисковому инструменту: запросы к reddit.com блокируются. Свежие ветки UKBF и отраслевых форумов в основном старые (2009–2019). Там, где форумных цитат нет, привожу цитаты владельцев и отраслевых ассоциаций из прессы. Имена указаны только для публичных фигур, форумные ники не привожу.

| # | Сегмент | Цитата | Кто, когда | Ссылка |
|---|---|---|---|---|
| 1 | Клининг | «We do a couple of hours office cleaning a week for them… it does affect my cash flow as my staff are paid weekly, and this company are always REALLY late paying usually 3 or 4 weeks.» | владелица клининговой компании, Mumsnet, 17.06.2019 | [Mumsnet](https://www.mumsnet.com/talk/am_i_being_unreasonable/3614624-to-sack-this-client-who-is-always-late-paying) |
| 2 | Клининг | «We have a few commercial clients who need to be constantly chased for paying late.» | клининговая компания, UKBF, 16.05.2018 | [UKBF](https://www.ukbusinessforums.co.uk/threads/advice-on-late-payers-and-adding-late-payment-charges-to-invoices.388275/) |
| 3 | Кадровое агентство | «We are frustrated by organisations that pay their invoices late… Even winning does not guarantee payment… we are still having to chase payment.» | Lynne Shields, MD Arden Shields (рекрутинг); дата статьи **не подтверждена** | [Coventry Telegraph](https://www.coventrytelegraph.net/news/business/lynnes-drive-on-late-payers-3152831) |
| 4 | Дистрибуция | «Late payments have become a fact of life for almost every distributor, creating unnecessary pressure on cash flow.» | Lochan Sim, Klipboard (вендор), 15.07.2026 | [PBM](https://professionalbuildersmerchant.co.uk/news/klipboard-research-reveals-98-percent-of-uk-distributors-deal-with-late-payments/) |
| 5 | Builders' merchants | «…the trend by some builders and contractors to move to 120 days as a default position has to be confronted» | BMF, старая публикация | [Builders Merchants News](https://www.buildersmerchantsnews.co.uk/news/news-archive/bmf-calls-bis-break-late-payment-culture) |
| 6 | Haulage | «late payment kills viable firms and drags on the whole supply chain» | Richard Smith, MD RHA, 05.2026 | [trans.info](https://trans.info/en/pay-hauliers-on-time-476815) |
| 7 | Стройка | «Late payment is still rife within the supply chain and much more needs to be done to ensure payments are made within terms.» | Brian Berry, FMB, 11.2014 | [Construction Index](https://www.theconstructionindex.co.uk/news/view/late-payment-remains-rife) |
| 8 | B2B-услуги (ИИ/автоматизация) | «Spent months chasing a investment bank having to go through about 15 different layers» | участник UKBF, 09.01.2025 | [UKBF](https://www.ukbusinessforums.co.uk/threads/companies-will-have-to-pay-uk-supplier-invoices-within-60-days-or-face-fines.430582/) |
| 9 | Видеопродакшн | крупные корпорации — худшие плательщики: «2 из 10 счетов вовремя» (пересказ, не дословно) | участник UKBF, 07.2012 | [UKBF](https://www.ukbusinessforums.co.uk/threads/how-do-you-deal-with-clients-not-paying-on-time.264183/) |
| 10 | Все SME | «Late payments cost the UK economy £11 billion a year with founders spending over 86 hours chasing overdue invoices.» | Emma Jones, Small Business Commissioner, 05.2026 | [ChannelX](https://channelx.world/2026/05/small-business-commissioner-welcomes-late-payments-announcement-in-the-kings-speech/) |

**Чего не хватает.** Свежих (2025–2026) первичных жалоб владельцев из staffing, клининга и охраны. Вывод: форумные голоса подтверждают боль, но это не замена 10–15 проблемным интервью (например, через LinkedIn-группы REC, APSCo, BCC).

---

## 4. Кто ведёт дебиторку и сколько стоит альтернатива

**Кто этим занимается в SMB на 10–200 человек** (качественная оценка по источникам выше, долей нет — **не подтверждено**):
- **10–30 сотрудников:** владелец или офис-менеджер плюс приходящий бухгалтер (часто на Xero или QuickBooks).
- **30–200 сотрудников:** штатный бухгалтер, finance manager или FD, часто выделенный credit controller (полная или частичная занятость). В дистрибуции у 96% есть сотрудник под платежи и кредит-контроль ([Klipboard 2026](https://professionalbuildersmerchant.co.uk/news/klipboard-research-reveals-98-percent-of-uk-distributors-deal-with-late-payments/)).

**Цена альтернатив:**

| Альтернатива | Цена | Источник |
|---|---|---|
| Штатный credit controller | в среднем **£33 939** в год (диапазон £30 777–39 724); на Reed.co.uk 1 035 вакансий | [Reed](https://www.reed.co.uk/average-salary/average-credit-controller-salary) |
| Штатный credit controller (Indeed) | £28 424 в год (5,7 тыс. зарплат, обновлено 17.08.2026); Лондон — £33 250 | [Indeed UK](https://uk.indeed.com/career/credit-controller/salaries) (цифры из поисковой выдачи, прямой заход вернул 403) |
| По опыту | 0–3 года — £25–30k; 3–5 лет — £28–35k; 5+ лет — £32–45k | Morgan McKinley / uktaxcalculators (через выдачу) — **не подтверждено** |
| Частичная занятость | £13–17,5 в час; £27–29k pro rata за 3 дня в неделю | вакансии DWP Find a Job / Hays (через выдачу) — **не подтверждено** |
| Полная стоимость сотрудника | зарплата £34k плюс National Insurance работодателя, пенсия и рабочее место ≈ £40–45k в год | моя оценка, **не подтверждено** |
| Аутсорс кредит-контроля | ~2% от выставленных счетов, или £250 за £10k, или £250 за 250 счетов; окупается примерно с £10k выставленных счетов в месяц | [UKBF, 2010](https://www.ukbusinessforums.co.uk/threads/costs-of-outsourcing-credit-control-and-also-debt-collection.174950/) — старые цены |
| Коллекторы | «no win no fee», 10–20% от взысканного | там же |
| SaaS-конкурент Chaser | £199 в месяц (оборот <£4 млн), £599 (<£10 млн), £899 (<£100 млн); есть ИИ-генератор писем и платная опция «Care» — живой AR-специалист | [Chaser pricing](https://www.chaserhq.com/pricing) |
| Факторинг / invoice finance | индустрия UK Finance выдаёт больше £20 млрд одновременно десяткам тысяч клиентов | [UK Finance](https://www.ukfinance.org.uk/our-expertise/commercial-finance/invoice-finance-and-asset-based-lending) |

**Вывод по цене.** Потолок цены задаёт полставки credit controller (~£1,4–1,8k в месяц). Нижнюю границу рынка SaaS задаёт Chaser (£199–599 в месяц, но это инструмент без человеческой работы). Коридор для «агента с одобрением в чате» — **£300–900 в месяц** на SMB на 10–200 человек. Опционально — бонус от взысканных процентов и компенсаций по Late Payment Act. Это гипотеза, её надо проверить интервью.

---

## 5. Косвенные признаки «горячего» клиента

| Сигнал | Где взять | Как читать | Статус |
|---|---|---|---|
| **Дебиторка в балансе** | Companies House (бесплатный API и выгрузки) | Малые компании, подающие abridged или полную отчётность, показывают строку Debtors. Смотрим debtors / turnover, а если оборот не раскрыт — debtors / net assets и динамику год к году. Микропредприятия показывают только current assets, поэтому сигнал слабый | формат отчётности — **нужно проверить на выборке**. С 01.04.2028 малые и микрокомпании обязаны подавать P&L (с правом его не публиковать) и делать это через iXBRL — [ICAEW](https://www.icaew.com/insights/viewpoints-on-the-news/2026/jun-2026/companies-house-accounts-changes-confirmed-for-april-2028) |
| **Отчётность подана поздно или «Accounts overdue»** | Companies House | Признак проблем с деньгами или беспорядка в финансах | логика — моя |
| **CCJ, поданные этой компанией против своих клиентов** | Registry Trust (платный доступ); иски в County Court | Компания уже судится с должниками, значит боль доходит до суда | в 2025 году — 167 642 коммерческих решения ([Registry Trust](https://registry-trust.org.uk/stats/q4-2025-statistics)). Найти CCJ, поданные **кредитором**, по реестру нельзя (реестр ведётся по должникам) — **не подтверждено** |
| **CCJ против самой компании** | Registry Trust, CreditSafe | Она сама платит поздно — это антисигнал к платёжеспособности, скорее исключить | — |
| **Вакансия credit controller или accounts receivable** | Reed, Indeed, Totaljobs, LinkedIn Jobs | Самый сильный сигнал: компания готова платить £30k+ за функцию. Ищем вакансии в компаниях на 10–200 человек, особенно повторные и «part-time / temporary credit controller» | на Reed 1 035 вакансий ([Reed](https://www.reed.co.uk/average-salary/average-credit-controller-salary)) |
| **Стек Xero, QuickBooks или Sage** | Упоминания в вакансиях («Xero experience essential»), ссылки «Pay now» в счетах, партнёрские каталоги бухгалтеров, BuiltWith | С этими системами простая интеграция, значит быстрый пилот | — |
| **Крупные клиенты компании платят поздно** | UK Payment Practices Reporting ([check-payment-practices.service.gov.uk](https://check-payment-practices.service.gov.uk/)) | Если основные заказчики клининг- или охранной компании — FM-гиганты с 40%+ счетов вне срока, у их субподрядчиков гарантированно болит | подход — мой, данные публичные |
| **Использует факторинг** | Charges (залоги) в Companies House на имя фактора | Полный факторинг — антисигнал (кредит-контроль делает фактор). Confidential invoice discounting — нейтрально или позитивно | логика — моя, **проверить** |
| **Отзывы «late payer» о компании** | Glassdoor, Trustpilot, Google | Скорее описывают саму компанию как плательщика, это антисигнал | — |
| **Германия** | Unternehmensregister / Bundesanzeiger | Малые GmbH публикуют сокращённый баланс, в том числе «Forderungen aus Lieferungen und Leistungen»; микрокомпании могут только сдать отчётность на хранение (Hinterlegung) | **не подтверждено** в этом исследовании; к тому же DE — рынок с низкой болью |
| **Нидерланды** | KvK (платные выписки) | Малые компании публикуют баланс, в том числе строку debiteuren | **не подтверждено**; NL — рынок с минимальной болью |

**Практический скоринг лида (гипотеза):**
- открыта вакансия credit controller или AR — **+3**;
- отрасль №1–3 и 10–200 сотрудников — **+2**;
- стек Xero, QuickBooks или Sage — **+2**;
- debtors растут быстрее net assets год к году — **+1**;
- основные заказчики есть в Payment Practices Reporting с 30%+ поздних оплат — **+1**;
- полный факторинг (charge на имя фактора) — **−2**;
- CCJ против самой компании — **−3**.

---

## 6. Логика рейтинга

Каждый сегмент оценён по четырём критериям (1–5):
- **Боль** — насколько просрочка критична: разрыв между затратами и поступлениями, доля затронутых, безнадёжные долги, время на чейзинг.
- **Платёжеспособность** — оборот, маржа, готовность платить £300–900 в месяц.
- **Нетехничность** — как далёк сегмент от «соберу сам» (чем выше балл, тем лучше для нас).
- **Скорость сделки** — кто принимает решение (владелец или комитет), сложность интеграции, мешает ли факторинг или ERP.

**Почему staffing — №1, а не клининг или стройка:**
1. Лучше всех подтверждённая боль: отраслевой опрос RISR 2025 с цифрами по денежному потоку и безнадёжным долгам.
2. Структурный разрыв: зарплата раз в неделю против оплаты через 56 дней.
3. Много однотипных счетов, причины задержки типовые (PO, таймшиты) — удобно для классификации ответов агентом.
4. Решение принимает владелец или FD, цикл сделки короткий.
5. Конфликт «боимся испортить отношения с клиентом» ([Sonovate](https://www.sonovate.com/blog/why-is-your-recruitment-agency-not-being-paid-on-time/)) — ровно то, что закрывает модель «ИИ пишет вежливо, человек одобряет».

**Главные риски:**
1. Факторинг в staffing и haulage может убрать боль (кредит-контроль делает фактор).
2. UK-статистика Xero показывает **улучшение** сроков: 29 дней — рекорд с 2017 года ([SBC](https://www.smallbusinesscommissioner.gov.uk/news/sbc-weekly-update/are-we-turning-a-corner-on-payments/)). Средняя просрочка в 8 дней не выглядит катастрофой. Боль сконцентрирована в хвостах и отраслях, а не в среднем по рынку.
3. Новый закон с обязательными процентами и потолком 60 дней может постепенно снизить боль, но в ближайшие 1–2 года даёт повод для разговора и «юридический» функционал агента.
4. Конкуренты уже продают ИИ-напоминания (Chaser и др.). Отличие продукта — разбор ответов должников и доведение до Letter Before Action с одобрением в чате. Это надо проверить на реальной ценности.

**Что проверить в первую очередь (10–15 интервью на сегмент 1–2):**
- доля агентств и клининговых компаний без полного факторинга;
- сколько часов в неделю уходит на чейзинг и кто его делает;
- сколько открытых счетов у одного клиента;
- какая бухгалтерская система (Xero, Sage, QuickBooks, отраслевая);
- готовность платить £300–900 в месяц;
- отношение к автоматическому начислению процентов по Late Payment Act.
