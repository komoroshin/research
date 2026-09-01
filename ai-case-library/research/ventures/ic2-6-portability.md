# IC2-6. Переносимость механики независимой верификации выплат за невыработку

**Дата:** 01.09.2026
**Проверяемое утверждение:** «Механика независимой верификации выплат за невыработку переносима минимум на одну юрисдикцию помимо Великобритании».

**Вердикт: ПОДТВЕРЖДЕНО.** Вторая юрисдикция — **Германия (Redispatch 2.0, компенсация Ausfallarbeit по §13a EnWG)**: деньги сопоставимого с UK масштаба (~3,07 млрд € затрат на управление перегрузками сети в 2025, из них 433 млн € — прямые компенсации ВИЭ за невыработку), «упущенная выработка» считается расчётными методиками с выбором между вариантами (spitz/pauschal/spitz light) — то есть предмет спора существует по построению, есть институционализированные механизмы споров (Clearingstelle EEG|KWKG, практика BGH), данные по каждой redispatch-мере публичны на netztransparenz.de. Близкий второй кандидат — Ирландия/SEM (dispatch-down 11,3% ветра в 2025, живой регуляторный спор о границе constraint/curtailment).

---

## 1. Германия — Redispatch 2.0/3.0, §13a EnWG ★ главный кандидат

**Механика.** При redispatch-отключении сетевой оператор, в чьей сети возникла причина, обязан выплатить «надлежащую финансовую компенсацию» (§13a Abs. 2 EnWG) — компенсируются упущенные доходы (EEG-вознаграждение / прямой сбыт) и допрасходы ([MITNETZ](https://www.mitnetz-strom.de/energie-einspeisen/redispatch2.0/finanzieller-ausgleich), [Clearingstelle EEG|KWKG](https://www.clearingstelle-eeg-kwkg.de/haeufige-rechtsfrage/162)). Исторически (режим Einspeisemanagement §15 EEG) — 95% упущенных доходов, 100% при превышении порога 1% годовой выручки; оператор ВИЭ **сам выбирает метод расчёта** невыработки на календарный год.

**Как считается «упущенная выработка» (Ausfallarbeit)** — ровно та задача, которую решает продукт:
- **Pauschalverfahren** — последняя измеренная четверть часа до меры экстраполируется на длительность меры (грубо; ассоциации прямо признают метод проблемным);
- **Spitzabrechnung** — динамический поквартальночасовой расчёт по **погодным данным площадки и кривой мощности**;
- **Spitz light** — упрощённый вариант без собственного измерения погоды.
Источник: [BDEW-Leitfaden zur Berechnung der Ausfallarbeit](https://www.bdew.de/media/documents/Awh_2020-05_RD_2.0_LF_Ausfallarbeit.pdf), [обзор GÖRG](https://www.goerg.de/de/aktuelles/veroeffentlichungen/06-01-2022/redispatch-2-0-regelungen-entwicklungen-und-auswirkungen). Spitzabrechnung — по сути та же «мезопогода × кривая мощности», что и в UK-продукте.

**Деньги.** Полный 2025 год: затраты на Netzengpassmanagement **3,071 млрд €** (2024: 2,954 млрд €), в т.ч. redispatch конвенциональных станций 1,176 млрд €, **компенсации ВИЭ за невыработку 433 млн €** (2024: 554 млн €), резервные станции ~0,95 млрд €, countertrading 102 млн € ([IWR по данным BNetzA](https://www.iwr.de/news/netzengpassmanagement-2025-stromnetz-stabil-kosten-leicht-gestiegen-bei-hohem-ausbau-erneuerbarer-energien-news39599), [Clean Energy Wire](https://www.cleanenergywire.org/news/renewable-curtailment-compensation-costs-germany-decrease-22-2025), [SMARD/BNetzA](https://www.smard.de/page/home/topic-article/444/219200/volumen-und-kosten-gestiegen)). Отключено 3,5% выработки ВИЭ за 2025.

**Споры.** Предусмотрен формальный **clearing-процесс** при расхождении объёмов между сетевым оператором и оператором установки ([BDEW FAQ](https://www.bdew.de/media/documents/2024-09-24_FAQ_Redispatch_V1.5.pdf)); методика Ausfallarbeit в ряде мест до сих пор не регламентирована — открытые вопросы зафиксированы в [Umsetzungsfragenkatalog BDEW](https://www.bdew.de/media/documents/Awh_20240823_Umsetzungsfragen_Redispatch-2-0_v1.22.pdf) и в [позиции BEE к консультации BNetzA по §13a Abs. 2](https://www.bee-ev.de/service/publikationen-medien/beitrag/bee-stellungnahme-zur-konsultation-der-bestimmung-des-angemessenen-finanziellen-ausgleichs-nach-13-a-abs-2-enwg). Внесудебный орган споров — **Clearingstelle EEG|KWKG** (рекомендации/вотумы/арбитраж, [архив дел по Einspeisemanagement](https://www.clearingstelle-eeg-kwkg.de/haeufige-rechtsfrage/162)); есть практика BGH в пользу операторов установок ([MASLATON о решении BGH по §15 EEG](https://www.maslaton.de/news/BGH-entscheidet-zugunsten-der-Anlagenbetreiber-Entschaedigungsansprueche-nach--15-EEG-auch-bei-Einspeisemanagement-infolge-von-Netzausbau--n758)). Важно: поправка EnWG, вступившая в силу **23.12.2025**, меняет порядок финансовой компенсации (требования теперь напрямую к ответственному сетевому оператору) — правила в движении, что обычно повышает спрос на независимый расчёт. *(Специализированных «аудиторов Ausfallarbeit» как отдельного рынка не нашёл — нишу закрывают юрфирмы и directmarketers; это скорее плюс для вендора.)*

**Публичность.** [Netztransparenz.de](https://www.netztransparenz.de/en/Ancillary-Services/System-operations/Redispatch) публикует каждую redispatch-меру: время начала/конца, средняя и максимальная мощность, МВт·ч, инструктирующий/запрашивающий оператор, CSV-выгрузка; агрегированные объёмы и затраты — квартальные отчёты BNetzA/SMARD. Суммы компенсаций по конкретным установкам не публикуются (только агрегаты) — для продукта это некритично: верифицируется расчёт клиента-генератора.

**Опровержение (проверено):** методика НЕ задана жёсткой формулой без места для спора — наоборот, выбор из трёх методов, погодозависимый spitz-расчёт и незакрытые регуляторные вопросы. Место для верификатора есть.

## 2. Ирландия / SEM — dispatch-down ветра ★ сильный второй кандидат

**Механика и объёмы.** Dispatch-down ветра в Республике Ирландия в 2025 — **11,3%** выработки (6,6 п.п. constraints — локальные сетевые, 4,7 п.п. curtailment — системные лимиты SNSP/инерция) ([EirGrid Annual Constraint & Curtailment Report](https://cms.eirgrid.ie/sites/default/files/publications/Annual-Renewable-Constraint-and-Curtailment-Report-2024-V1.0.pdf), [climatejargonbuster.ie](https://climatejargonbuster.ie/kb/curtailment/)). Компенсация асимметрична: curtailment для priority-dispatch ВИЭ с 2013 в основном не компенсируется, constraints — фактически компенсируются (генератор сохраняет ex-ante позицию рынка; firm/partially firm — до уровня FAQ) ([SEMO Ch.19 Curtailment](https://www.sem-o.com/sites/semo/files/training/modules/imb-settlements/Curtailment.pdf), [позиция IWEA](https://windenergyireland.com/images/files/20191115-iwea-position-paper-on-priority-dispatch-and-compensation-for-constraint-and-curtailment.pdf)).

**Деньги.** Общая стоимость constraints по острову — **€567 млн в 2024/25**, прогноз €700 млн на 2025/26 ([Modo Energy](https://modoenergy.com/research/en/ireland-bess-market-ds3-fass-wholesale-balancing-mechanism-2026); включает и оплату газовых станций must-run, т.е. выплаты ветру — часть суммы; допущение помечаю).

**Спор — живой и структурный:** граница «constraint vs curtailment» определяет, платят или нет, и прямо сейчас пересматривается — консультация [SEM-24-044](https://www.semcommittee.com/publications/sem-24-044-tso-proposed-definitions-curtailment-constraint-and-energy-balancing) о новых определениях + Mod_13_23 (NPDR), регуляторы заказали TSO **независимое моделирование** для решения (статус на конец 2025: решение не принято, [Future Power Markets Newsletter, Dec 2025](https://cms.eirgrid.ie/sites/default/files/publications/Future-Power-Markets-Newsletter-Issue-27-December-2025.pdf)). Верификация классификации события (что реально ограничило: локальная сеть или системный лимит) — расчётная задача, близкая продукту.

**Публичность:** отличная — ежегодные отчёты EirGrid/SONI по constraint & curtailment на уровне единиц, данные SEMO. Рынок англоязычный, маленький, концентрированный (десятки ветропарков) — легко покрыть, но и потолок выручки ниже.

## 3. Испания — restricciones técnicas: растущая боль, компенсация частичная

Curtailment резко вырос: с ~1–3% до **пика ~11% ВИЭ-выработки в июле 2025** (>1 100 ГВт·ч за месяц) ([Strategic Energy](https://strategicenergy.eu/record-curtailment-in-summer-2025-up-to-11-of-renewable-energy-was-not-integrated-into-the-grid/)). Но компенсация неполная: ограничение в **фазе 1** решения técnicas не оплачивается; оплата возникает при активации оферт на рынках корректировки. Для RECORE-установок **RD 917/2025** (поправка к RD 413/2014) защищает регулируемый доход: equivalent hours не режутся за энергию, не выданную из-за restricciones técnicas и за часы нулевых цен ([AEE](https://aeeolica.org/en/publicado-el-rd-917-2025-que-modifica-el-rd-413-2014/), [заключение CNMC IPN/CNMC/043/24](https://www.cnmc.es/sites/default/files/5837940.pdf)) — причём эффект restricciones учитывается **по заявлению установки** в ликвидациях CNMC ([процедура CNMC 2024–2025](https://sede.cnmc.gob.es/tramites/energia-electricidad/liq-recore-energia-restricciones-24-25)) — это ниша для расчётного доказательства «сколько не выдали из-за ограничений». Данные REE/ESIOS публичны. Итог: юрисдикция «на вырост» — боль огромная и растёт, но денежная механика компенсаций пока фрагментарна → пометка «частично формульная/частично без компенсации».

## 4. США/Техас — частная версия механики (PPA deemed energy)

Рыночных (ERCOT) компенсаций за curtailment нет. Но в PPA стандартна конструкция **deemed energy**: офтейкер платит контрактную цену за расчётный объём, который генератор произвёл бы, если бы не ограничение по вине/инструкции офтейкера; референс — **P50-расчёт независимого инженера** — «the standard lenders require and eliminates disputes over self-serving output estimates» ([Law Insider: Deemed Generation](https://www.lawinsider.com/dictionary/deemed-generation)). Масштаб проблемы растёт: ERCOT срезал 5% ветра и 9% солнца уже в 2022, прогноз к 2035 — 13%/19% ([EIA](https://eia.gov/todayinenergy/detail.php?id=57100)). **Публичных арбитражных кейсов «генератор vs офтейкер за curtailed MWh» не нашёл** — споры конфиденциальны (допущение: они есть, раз стандарт индустрии прямо строится вокруг их предотвращения). Это подтверждает переносимость механики как **частной** (роль independent engineer), но рынок фрагментирован по контрактам, данных нет в открытом доступе → плохой второй рынок, хороший третий.

## 5. Япония — вычёркиваем (нет денег в механике)

Curtailment большой и растёт: **1,77 ТВт·ч (+38%) за апрель–август ФГ2025**, рекорд; Кюсю ~7,6% ([Japan Energy Hub](https://japanenergyhub.com/news/h1-2025-solar-wind-curtailment/), [Reuters via renewables.az](https://renewables.az/en/news/japan-s-renewable-curtailments-on-track-to-hit-record-as-nuclear-generation-rises)). Но компенсации **нет**: правила 30-дней / 360-часов / unlimited — все безвозмездные, non-firm access = curtailment без компенсации ([Orrick Japan Renewables Alert](https://www.orrick.com/en/Insights/2025/02/Japan-Renewables-Alert-69), [пояснение Shizen Energy](https://so.shizenenergy.net/en/blog/2026_output_solar_curtailment/)). OCCTO ведёт **верификацию корректности curtailment** ([OCCTO](https://www.occto.or.jp/en/works/no2.html)) — т.е. задача расчёта есть, но её делает регулятор, платежей нет → верифицировать нечего. Следить за реформами METI (смена порядка curtailment ФГ2026–27), не более.

## 6. Австралия — вычёркиваем

Semi-scheduled генераторы несут curtailment-риск сами; правило AEMC от 04/2021 лишь обязало следовать dispatch cap, компенсаций за сетевой curtailment нет ([AEMC draft determination](https://www.aemc.gov.au/media/95671), [WattClarity](https://wattclarity.com.au/articles/2023/05/renewable-curtailment-forced-and-not-quite-so-forced/)). Идущая реформа compensation frameworks ([AEMO rule change, Dec 2025](https://wattclarity.com.au/articles/2025/12/aemo-propose-rule-change-to-reform-compensation-frameworks/)) касается directions/intervention, не рутинного curtailment. Подтверждено: компенсаций нет → вычёркиваем.

## 7. Китай — вычёркиваем для внешнего вендора

Механика на бумаге есть: гарантированные часы закупки, с недавних правил — компенсация ВИЭ **со стороны вытеснивших их угольных станций**; но enforcement признаётся проблемой самими аналитиками ([RAP](https://www.raponline.org/blog/chinas-string-of-new-policies-addressing-renewable-energy-curtailment-an-update/), [China Energy Portal — Measures for guaranteed full purchase](https://chinaenergyportal.org/en/measures-for-the-guaranteed-full-purchase-of-renewable-electricity/)). Честно: иностранный верификатор между китайскими госкомпаниями и Grid Corp нереалистичен. Фиксирую и вычёркиваю.

## 8. UK CfD как отдельная линия — не даёт новой механики

CfD-платёж привязан к **метрированной** выработке: нет выработки — нет top-up; при отрицательных ценах (NPP) top-up не платится ([Commons Library CBP-9871](https://researchbriefings.files.parliament.uk/documents/CBP-9871/CBP-9871.pdf), [Baringa/DECC report](https://assets.publishing.service.gov.uk/media/5a7f291040f0b6230268dcdf/Baringa_DECC_CfD_Negative_Pricing_Report.pdf)). «Что было бы выработано» в CfD-расчёте LCCC не фигурирует — упущенный CfD-доход генераторы закладывают в цены заявок балансирующего механизма, т.е. спор возвращается в BM (базовый UK-кейс продукта). Понятие deemed energy в GB-дискуссии существует (оценка по соседним периодам/скорости ветра — та же Baringa), но как механизм выплат в CfD не реализовано. Вывод: отдельного нового рынка линия не создаёт; помечаю как «формульная, без места для внешнего верификатора».

---

## Рейтинг (деньги × спор × публичность × доступность рынка)

| # | Юрисдикция | Деньги | Спор | Публичность | Доступность | Итог |
|---|---|---|---|---|---|---|
| 1 | **Германия (Redispatch 2.0)** | ★★★ 3,07 млрд € NEM-2025; 433 млн € компенсаций ВИЭ | ★★★ выбор методик spitz/pauschal, clearing-процесс, Clearingstelle, BGH, реформа 12/2025 | ★★★ netztransparenz по-мерно, CSV; BNetzA/SMARD | ★★ ЕС, зрелый рынок, язык — барьер умеренный | **Второй рынок** |
| 2 | Ирландия/SEM | ★★ €567 млн constraints 2024/25 (частично ветру) | ★★★ живой спор constraint vs curtailment (SEM-24-044, Mod_13_23) | ★★★ EirGrid/SEMO по-юнитно | ★★★ англоязычный, компактный | Третий / пилотный |
| 3 | Испания | ★★ 11% ВИЭ в пике июля 2025, тренд ↑ | ★★ заявительный учёт restricciones в ликвидациях CNMC; фаза 1 не оплачивается | ★★★ REE/ESIOS | ★★ | «На вырост» |
| 4 | США/Техас (PPA) | ★★ растущий curtailment | ★★ частные споры, публичных кейсов не нашёл | ★ контракты закрыты | ★★ | Ниша independent engineer |
| — | Япония | ★★★ объёмы | — компенсаций нет | ★★★ OCCTO | ★ | Вычеркнута |
| — | Австралия | — | — компенсаций нет | ★★★ | ★★★ | Вычеркнута |
| — | Китай | ★★ на бумаге | ★ enforcement | ★ | — | Вычеркнута |

## Обоснование выбора Германии как второй юрисдикции

1. **Та же расчётная задача.** Spitzabrechnung — расчёт невыработки по погодным данным площадки поквартальночасово — технически совпадает с ядром продукта (мезопогода × кривая мощности). Продукт переносится без смены методологии, меняются только источники данных.
2. **Деньги второго после UK масштаба** в Европе: 3,07 млрд € в 2025 против ~£1,5 млрд constraint-платежей UK.
3. **Спор встроен в механику**: три альтернативных метода расчёта, официальный clearing-процесс при расхождениях, признанные регулятором незакрытые методологические вопросы, специализированный орган споров и свежая (23.12.2025) реформа компенсаций.
4. **Данные публичны** на уровне отдельной меры (netztransparenz), что даёт продукту независимую опору для верификации.

**Главный риск-контраргумент:** значительная часть немецких компенсаций ВИЭ считается по Pauschalverfahren (почти формульно) — там верификатор мало нужен; коммерческая ниша концентрируется в spitz-сегменте и в спорах о выборе/применении метода. Помечено как ограничение, не опровергает вердикт.

---
*Методологическая пометка: цифры 2025–2026 по Германии (BNetzA/SMARD через IWR/CEW), Ирландии (EirGrid/Modo), Японии (OCCTO/Reuters) — из названных источников; там, где первоисточник не открывался напрямую (агрегаты BNetzA пересказаны прессой), это видно по ссылке. «Не нашёл»: публичные арбитражи по deemed energy в Техасе; отдельный рынок «аудиторов Ausfallarbeit» в Германии; посуточные суммы компенсаций конкретным установкам в Германии (не публикуются).*
