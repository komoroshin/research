# IC3-2: «Расчёт Ausfallarbeit — самостоятельная оплачиваемая услуга, а не бесплатная фича?»

Дата проверки: 01.09.2026. Роль: скептик, задача — опровергнуть утверждение.

## ВЕРДИКТ

**Утверждение в основном ОПРОВЕРГНУТО — с одной важной оговоркой.**

1. **В классическом виде (до 23.12.2025) — опровергнуто полностью.** Расчёт Ausfallarbeit и вся Redispatch-2.0-абвиклюнг (роли EIV/BTR, передача данных, согласование Ausfallarbeit с сетевым оператором) — это **стандартная бесплатная фича договора Direktvermarktung** у всех проверенных крупных Direktvermarkter. e2m прямо пишет «кostenfrei», Next Kraftwerke рекламирует «kostenloser Redispatch 2.0 Service», Interconnector (EnBW): «Die Kosten für die Erfüllung der Pflichten nach Redispatch 2.0 sind bereits in unserem Direktvermarktungsentgelt enthalten», Quadra Energy — «включая Redispatch 2.0… без скрытых расходов». Даже полностью автономный аутсорс обеих ролей EIV+BTR вне Direktvermarktung стоит **250 €/год** (easyEIV) — это ценовой потолок ниши, и он ничтожен.

2. **Оговорка (частичное «но»): поправка EnWG от 23.12.2025 создала НОВУЮ задачу**, которая в старые пакеты Direktvermarktung не входила: сетевой оператор теперь платит компенсацию напрямую оператору установки, Direktvermarkter выведен из платёжной цепочки, и в переходный период операторы **должны сами выставлять счета сетям** (Netzbetreiber массово признают, что не могут автоматизированно делать Gutschriften). Это реальная, подтверждённая боль (≈ каждая 10-я абрехнунг ошибочна; у крупного портфеля 1% отклонения = шестизначные потери в год — оценки node.energy).

3. **Но и эта ниша уже НЕ пуста.** Через ~2,5 месяца после поправки (март 2026) node.energy уже продавала платный модуль Erlösmonitoring / opti.node Cockpit «сверка Redispatch-начислений + ревизионная документация» и активно пиарила тему (статьи в pv magazine, Solarserver, Windkraft-Journal, WID — все от 05–10.03.2026, все по сути PR node.energy). rotorsoft (Drehpunkt GmbH) имеет премиум-модуль «EisMan и Redispatch 2.0: создание стандартизированных счетов». Часть Direktvermarkter «проверяет, можно ли сохранить старую платёжную цепочку» (pv magazine, 06.03.2026) — т.е. они тоже будут закрывать это для клиентов.

**Вывод для гипотезы:** как **самостоятельный сервис с отдельным чеком** — гипотеза в изначальной формулировке умирает: рынок исторически приучен получать это бесплатно в пакете Direktvermarktung, а ценовой якорь автономного аутсорса — сотни евро в год, не тысячи. Живой остаток гипотезы — узкое окно «выставление счетов + проверка компенсаций после EnWG-новеллы», но это (а) уже занято софтом действующих игроков (node.energy, rotorsoft), (б) скорее всего схлопнется, когда сети автоматизируют Gutschrift-процесс (закон именно это и предписывает), (в) будет ре-абсорбировано Direktvermarkter'ами и Betriebsführer'ами как фича. Строить на этом отдельный продукт — против течения.

---

## 1. Direktvermarkter: входит ли Ausfallarbeit/Redispatch в пакет?

| Компания | Что нашлось | Плата | Источник |
|---|---|---|---|
| **e2m (Energy2market)** | Берёт роли EIV и BTR, включая согласование Ausfallarbeit | **Бесплатно** для клиентов своего балансового круга: «wir haben uns … dafür entschieden, die Dienstleistung für unsere Kunden kostenfrei anzubieten» | [e2m.energy/de/Redispatch2.0.html](https://e2m.energy/de/Redispatch2.0.html), дата обращения 01.09.2026 |
| **Next Kraftwerke** | EIV: стамм-/плановые данные, метеоданные, консультация по моделям билансирования (Spitz/Pauschal) | Рекламируется как **«kostenloser Redispatch 2.0 Service»** в рамках Direktvermarktung; отдельных цен нет | [next-kraftwerke.de/virtuelles-kraftwerk/redispatch-2-0](https://www.next-kraftwerke.de/virtuelles-kraftwerk/redispatch-2-0) |
| **Interconnector (EnBW)** | Роли EIV и BTR для всех клиентов Direktvermarktung | **«Die Kosten für die Erfüllung der Pflichten nach Redispatch 2.0 sind bereits in unserem Direktvermarktungsentgelt enthalten»** — отдельной платы нет | [interconnector.de — Welche Kosten fallen bei der Direktvermarktung an?](https://www.interconnector.de/energieblog/welche-kosten-fallen-bei-der-direktvermarktung-an/) |
| **Statkraft** | «Rundum-sorglos-Paket»: роль EIV, поддержка расчёта Ausfallarbeit, консультация Spitz vs Spitz-Light | Цены на сайте не названы (не нашёл) | [statkraft.de — Redispatch 2.0](https://www.statkraft.de/kundenangebot/direktvermarktung/redispatch-22.0-informationen) |
| **Quadra Energy** (крупнейший DV Германии) | Direktvermarktung «включая дистанционное управление, расчёт Marktprämie и Redispatch 2.0», «прозрачно и **без скрытых расходов**» | В пакете | [quadra-energy.com](https://www.quadra-energy.com/), [qnect Solar](https://www.quadra-energy.com/qnect/direktvermarktung-solarstrom/) |
| in.power, MVV | Отдельных страниц с прайсом **не нашёл** (помечаю явно) | — | — |

**Контр-наблюдение против «бесплатности» (важно для честности):** flex power (июль 2023) показывает, что «бесплатность» Redispatch-услуг DV бывала иллюзией — часть Direktvermarkter компенсировала абрегелированные объёмы по «Mischpreis» вместо Marktwert: на примере 8-МВт солнечной станции (май 2023) недополучено 23 488 € из 60 737 € (−42%), а DV заработал 26 055 € вместо 2 567 €. Т.е. деньги в теме есть, но зарабатывались непрозрачной маржой, а не отдельным чеком за расчёт. Источник: [flex-power.energy — Vorsicht Redispatch 2.0](https://flex-power.energy/de/energieblog/vorsicht-redispatch-2-0-direktvermarkter-abregelungen/). Именно эту непрозрачность законодатель убил новеллой 23.12.2025.

## 2. Technische Betriebsführer

- **wpd windmanager** — заявляет расширение сервисного портфеля «в области … Redispatch 2.0» как часть Betriebsführung; отдельного прайса «€/установка за Ausfallarbeit-Abrechnung» публично **не нашёл**. Источники: [windindustry-in-germany.com — профиль wpd windmanager](https://www.windindustry-in-germany.com/windindustry/companies/technical-commercial-operational-management/wpd-windmanager-gmbh-co-kg.html), [husumwind.com](https://www.husumwind.com/en/p/wpd-windmanager-gmbh-co-kg.140288).
- ENERTRAG Betrieb, Deutsche Windtechnik, Energiequelle: публичных прайсов на Ausfallarbeit-Abrechnung **не нашёл** (помечаю явно). Deutsche Windtechnik — прежде всего сервис/ТО; её Umspannwerke-подразделение куплено wpd windmanager ([renewablesnow.com](https://renewablesnow.com/news/germanys-wpd-windmanager-buys-deutsche-windtechnik-unit-786833/)).
- **Допущение:** у Betriebsführer расчёт/контроль Entschädigung традиционно сидит внутри общего договора kaufmännische/technische Betriebsführung (см. ценовые якоря §6) — отдельной строкой не продаётся. Публичные Leistungsverzeichnis'ы это подтвердить/опровергнуть не позволили (не нашёл в открытом доступе).

## 3. Аутсорсинг ролей EIV/BTR — ближайший ценовой якорь

- **easyEIV**: обе роли EIV+BTR «без Direktvermarkter» за **250 €/календарный год + НДС**. Прямая цитата: «Mit easyEIV bieten wir Ihnen eine einfache, zuverlässige und kostengünstige Lösung, um auch ohne Direktvermarkter alle Anforderungen des Redispatch 2.0 zu erfüllen». Источник: [easy-eiv.de](https://www.easy-eiv.de/).
- **BTR по часам**: один из провайдеров (из выдачи по new-energie.de/bi-web.de) — BTR-услуга **100 €/час** по факту затрат, бронируется только вместе с EIV-услугой. Источник: поисковая выдача по [new-energie.de/gk/energieloesungen/redispatch](https://www.new-energie.de/gk/energieloesungen/redispatch) — **страницу целиком не дочитал, число из сниппета, требует верификации**.
- **Сервисная паушаль**: у одного регионального провайдера компенсация проходит «за вычетом сервисной паушали **0,4 ct/kWh** (нерегулируемые) / **0,2 ct/kWh** (регулируемые установки)» — источник из выдачи ([energieservice-ww.com/…/redispatch](https://www.energieservice-ww.com/produkte/geschaeftskunde/stromvermarktung/redispatch) — страница отдала HTTP 500, **число из сниппета, требует верификации**).
- BDEW ведёт **официальный список Dienstleister для Redispatch 2.0** (redispatch-дienstleisterliste, январь 2025) — т.е. провайдеров много, рынок аутсорсинга ролей сформирован ещё в 2021–2022. PDF по старой ссылке отдаёт 404: [bdew.de …250114_Dienstleisterliste_Redispatch_2.0.pdf](https://www.bdew.de/media/documents/250114_Dienstleisterliste_Redispatch_2.0.pdf) (существование подтверждено выдачей, содержимое не прочитано).
- **e2m** — те же роли бесплатно (см. §1).

**Вывод по якорю:** рыночная цена полного аутсорса Redispatch-обязанностей — **0–250 €/год за установку** (от «бесплатно в DV-пакете» до easyEIV). Отдельный «модуль расчёта Ausfallarbeit» не может стоить дороже этого потолка в старой конструкции.

## 4. Софт

- **rotorsoft (Drehpunkt GmbH)**: премиум-фича «EisMan und Redispatch 2.0» — «Create standardized, recognized invoices, also for Redispatch 2.0», т.е. **генерация счетов по Redispatch уже есть в стандартном Betriebsführungs-софте**. Цен нет публично. Источник: [rotorsoft.de/en/features](https://www.rotorsoft.de/en/features/).
- **node.energy (opti.node Cockpit + add-on Erlösmonitoring)**: «визуализирует выручку из вермарктунга и EEG, а также redispatch-абрегелирования… эффективная проверка счетов Direktvermarkter и Netzbetreiber». Платный, цены не публикуются (OMR: «провайдер цены не сообщает»). Источники: [node.energy/kaufmaennische-betriebsfuehrung/erloesmonitoring](https://www.node.energy/kaufmaennische-betriebsfuehrung/erloesmonitoring), [omr.com — node.energy pricing](https://omr.com/en/reviews/product/node-energy/pricing).
- **WIS (softenergy)**: модульная Betriebsführungs-платформа, ~100 модулей; специфического «Ausfallarbeit-модуля» в открытых описаниях **не нашёл**. Источник: [windmesse.de — WIS](https://w3.windmesse.de/windenergie/produkt/142-wis-windenergie-informations-system).
- **anemos GmbH**: делает Wind- und Ertragsgutachten включая **Minderertragsberechnungen** (недовыработка) — т.е. экспертизная (гутахтен-) ниша по расчёту недополученной энергии существует, но это классические ветрогутахтены, а не серийная Redispatch-абрехнунг. Источники: [anemos.de/de/standortanalysen.php](https://www.anemos.de/de/standortanalysen.php), [windmesse.de — anemos](https://w3.windmesse.de/anemos). Отдельного продукта «Ausfallarbeit-Gutachten für Redispatch» **не нашёл**.
- FGW: справочные Referenzerträge для Redispatch публикуются централизованно производителями ([wind-fgw.de](https://wind-fgw.de/information-fuer-anlagenhersteller-zur-veroeffentlichung-von-referenzertraegen-fuer-redispatch/)) — методика стандартизирована (BDEW-Leitfaden zur Berechnung der Ausfallarbeit, [PDF](https://www.bdew.de/media/documents/Awh_2020-05_RD_2.0_LF_Ausfallarbeit.pdf)), что снижает «экспертную» ценность чистого расчёта: это регламентная арифметика (Spitz / Spitz-Light / Pauschal), а не know-how.

## 5. После поправки EnWG 23.12.2025 — успел ли рынок занять нишу за 8 месяцев?

**Факты:**
- С 23.12.2025 Netzbetreiber платит Entschädigung **напрямую оператору установки**; Direktvermarkter выведен из платёжной цепочки; Aufwendungsersatz за билансовый процесс тоже идёт напрямую оператору. Источники: [node.energy/blog/redispatch-entschaedigung](https://www.node.energy/blog/redispatch-entschaedigung); [Solarserver, 05.03.2026](https://www.solarserver.de/2026/03/05/redispatch-abrechnung-anlagenbetreiber-ab-2026-in-der-verantwortung/); [pv magazine, 06.03.2026](https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/).
- Переходная боль реальна: «Die meisten Netzbetreiber haben bereits angekündigt, dass sie die Ausgleichszahlungen in der vorgesehenen Form noch nicht automatisiert abwickeln können» → операторы «müssen die Redispatch-Mengen den Netzbetreibern eigenständig in Rechnung stellen» (node.energy).
- Масштаб боли (оценки node.energy, т.е. заинтересованной стороны — **допущение об их корректности**): ~каждая 10-я абрехнунг ошибочна; 1% отклонения на крупном ветропортфеле = «нереализованные доходы в высоком шестизначном диапазоне в год». Источник: [WID, 10.03.2026, автор — node.energy GmbH](https://www.windindustrie-in-deutschland.de/news/gesetzesaenderung-macht-redispatchabrechnung-zur-neuen-schluesselaufgabe-fuer-betreiber).
- **Кто первый занял нишу:** node.energy — уже в марте 2026 продавала opti.node Cockpit/Erlösmonitoring под эту задачу и провела медиаблиц (Solarserver 05.03, pv magazine 06.03 + вебинар-PDF, Windkraft-Journal 05.03, WID 10.03, 88energie — все статьи по сути её контент-маркетинг). Также: [ee-hub вебинар «EnWG-Novelle & Redispatch» (02/2026)](https://ee-hub.de/veranstaltungen/webinar/enwg-novelle-redispatch-neue-regeln-fur-abrechnunge-02-2026); BWE выпустил Faktencheck «Was kostet uns Redispatch?» (апрель 2026, [PDF](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/04-politische-arbeit/01-gesetzgebung/20260421_Faktencheck_Redispatch.pdf)) и Handlungsempfehlung Redispatch (май 2025, [PDF](https://www.wind-energie.de/fileadmin/redaktion/dokumente/publikationen-oeffentlich/themen/02-technik-und-netze/01-netze/20250527_BWE_Handlungsempfehlung_Redispatch.pdf)).
- Часть Direktvermarkter «проверяет, можно ли сохранить прежние платёжные цепочки» (pv magazine, 06.03.2026) — т.е. DV не отдают тему без боя.
- Чистых сервисов «мы выставим счёт сети за вас» как отдельного продукта с публичным прайсом **не нашёл** (валидный «не нашёл») — ниша закрывается софтом внутри Betriebsführungs-платформ, а не standalone-услугой.

**Интерпретация скептика:** окно существует, но (а) оно переходное по своей природе — закон предписывает сетям автоматические Gutschriften, и по мере автоматизации (у части сетей уже «автоматическая гутшрифт в übernächsten Monat» — pv magazine) задача «выставить счёт» отмирает, остаётся задача «проверить гутшрифт» — классическая фича Erlösmonitoring; (б) за 8 месяцев в него уже вошёл сильнейший нишевый софт-игрок с дистрибуцией и брендом.

## 6. Ценовые якоря Betriebsführung (сколько выдержит чек)

- Полные Betriebskosten ветропарка: **30–40 €/кВт/год** в первые годы, ~**50 €/кВт/год** с ~6-го года (Fraunhofer IEE Windmonitor: [windmonitor.iee.fraunhofer.de](https://windmonitor.iee.fraunhofer.de/windmonitor_de/3_Onshore/5_betriebsergebnisse/4_betriebskosten/); [TARANIS 2026](https://taranis-windsolar.de/kosten-einer-windkraftanlage/)). Это ВСЁ: ТО, аренда, страховка, управление, вермарктунг.
- **Kaufmännische Betriebsführung: 1,5–2,5% годовой выручки** (BWE Praxisbuch Betriebsführung, [PDF](https://www.windindustrie-in-deutschland.de/f/56d4/0/5f086bba393237c14e0003d3/BWEBcherPraxisbuchBetriebsfhrung.pdf)). Для типичной 3-МВт WEA с выручкой ~500–600 тыс. €/год это ~8–15 тыс. €/год за ВСЮ коммерческую Betriebsführung.
- Direktvermarktungs-бонус исторически ~4 €/MWh (Maschinenring, [maschinenring.de](https://www.maschinenring.de/rems-murr/einkaufsvorteile/strom-und-erdgas/direktvermarktung/)); сами вермарктунг-энтгельты — «десятые доли цента за кВт·ч».
- **Следствие:** один расчётный модуль внутри этой структуры реалистично может стоить сотни евро — максимум малые тысячи €/год на парк (сопоставимо с easyEIV 250 €/год и долей от 1,5–2,5% kfm. BF). Чек «тысячи € за установку в год» рынок не выдержит — потолок задан бесплатными DV-пакетами.

## Сводка «не нашёл» (валидные пробелы)

- Публичные прайсы Statkraft/Quadra/MVV/in.power на Redispatch-компонент — не нашёл (у всех «в пакете»/«по запросу»).
- Публичный прайс Betriebsführer именно на Ausfallarbeit-Abrechnung (€/WEA/год) — не нашёл.
- Цены node.energy opti.node — не публикуются.
- Standalone-сервис «выставим счёт сети за вас» с прайсом (после новеллы) — не нашёл.
- emsys / energy & meteo systems: специфический Ausfallarbeit-модуль — не проверено глубоко (их фокус — прогнозы/VPP); Flex-платформы — не проверено.

## Что могло бы реанимировать гипотезу (условия)

1. Целиться не в «расчёт» (комодитизирован, бесплатен), а в **проверку/оспаривание начислений сетей** (Erlösmonitoring/claim management) с success-fee от найденных недоплат — там боль в шестизначных суммах, а не в трудозатратах.
2. Сегмент **без Direktvermarkter** (малые установки 100–950 кВт в фиксированной EEG-вергютунг, sonstige DV) — им RD-пакет DV недоступен, но и чек там уровня easyEIV (сотни €).
3. Скорость: node.energy уже 6 месяцев в нише; догонять — только через нишевание (напр., только PV-C&I, только Stadtwerke-порфели) или через white-label для Betriebsführer.
