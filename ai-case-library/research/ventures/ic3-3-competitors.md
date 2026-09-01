# IC3-3 — Конкуренты: занята ли позиция «расчёт и биллинг Ausfallarbeit для операторов ВИЭ»

Дата проверки: 01.09.2026. Роль: скептик-фальсификатор.

## ВЕРДИКТ

**Утверждение «позиция не занята» — ОПРОВЕРГНУТО.** Позиция занята многократно, на двух уровнях:

1. **node.energy (opti.node Cockpit / «Erlösmonitoring»)** — масштабный игрок (5 000+ операторских компаний, 14 000+ ветро/PV-установок, 43,5+ ГВт под управлением), который с марта 2026 публично позиционируется ровно на этой боли: после EnWG-новеллы от 23.12.2025 оператор сам выставляет счёт сетевому оператору, и opti.node «автоматически сверяет данные отзывов (Abrufe) с данными установки и рыночными ценами», ревизионно документирует и ловит расхождения. Их же цифра: «~каждый десятый расчёт Redispatch-Entschädigung содержит ошибки».
2. **Десятки специализированных EIV/BTR-провайдеров из официального списка BDEW** (актуальная редакция 12.03.2026, 72 страницы, ~100 компаний), у части которых **ядро оффера — именно расчёт Ausfallarbeit, контр-предложения (Gegenvorschläge) сетевому оператору и абрехнунг по всем трём методам (Pauschal / Spitz / SpitzLight) в интересах оператора установки**: AIRWIN, Multiversum, GODEA, softenergy, vantago, Virtimo, BTU EVU, Solandeo и др.

Что осталось от гипотезы: единого доминирующего «pure-play» бренда «биллинг Ausfallarbeit» нет — рынок фрагментирован (стадтверке, директ-вермарктеры, ИТ-бутики), а изменение закона 23.12.2025 (прямая выплата оператору; большинство DSO ещё не автоматизировали процесс) создало свежий спрос. Но это тезис «рынок фрагментирован и растёт», а НЕ «позиция свободна». Вход возможен только через дифференциацию против node.energy и BDEW-списка.

Контекст ставок: финансовый выкуп операторам ВИЭ за Redispatch — **~433 млн € за 2025 г.**; всё управление перегрузками сети — **~2,7 млрд € (2025)** (данные BNetzA через Energie & Management, 2026: https://www.energie-und-management.de/nachrichten/energieerzeugung/detail/netzengpasskosten-2024-um-500-millionen-euro-gesunken-259018).

---

## 1. Карта экосистемы Redispatch 2.0 (после 2021)

### Сторона оператора установки (Anlagenbetreiber) — это и есть проверяемая ниша

Главный источник: **официальная Dienstleisterliste für Anlagenbetreiber Redispatch 2.0 (BDEW, редакция 12.03.2026, 72 стр., ~100 компаний, обновляется еженедельно)** — https://www.bdew.de/media/documents/260312_Dienstleisterliste_Redispatch_2.0.pdf (список самодекларативный, BDEW не проверяет качество — допущение о достоверности заявлений компаний).

Провайдеры, заявляющие **именно расчёт/проверку/абрехнунг Ausfallarbeit для оператора** (цитаты из списка):

| Компания | Оффер (из BDEW-листа) |
|---|---|
| **AIRWIN GmbH** (Люнебург) | «Laufende Prüfung der Ausfallarbeit (Prognosemodell), Erstellung und Versand von Gegenvorschlägen zur Ausfallarbeit, bilaterale Klärung bei Unstimmigkeiten mit dem NB, Abrechnungsverfahren Spitz, SpitzLight und Pauschal für Wind und PV» — дословно оффер проверяемой гипотезы |
| **Multiversum GmbH** (Гамбург) | То же самое + «Fokus auf Anlagenbetreiberinteressen» |
| **GODEA GmbH** (Гамбург) | «Ermittlung und Abrechnung der Ausfallarbeit aus Sicht der Interessen des Anlagenbetreibers. Übermittlung Gegenvorschlag und erweitertes Clearing… Alle Abrechnungsverfahren. Alle Energieträger.» |
| **softenergy GmbH** (Росток) | Софт: «Berechnung der Ausfallarbeiten (Pauschal, Spitz, SpitzLight); Empfang & Analyse der berechneten Ausfallarbeit des Netzbetreibers sowie Erstellung von Gegenvorschlägen; Automatisierung» |
| **vantago GmbH** (Дюссельдорф) | «Teil- oder Vollautomatisierung der Rechnungsprüfung… Erstellung von Ausfallarbeit auf Basis aller Berechnungsverfahren; Gegenüberstellung von Erstaufschlägen von Netzbetreibern mit Gegenvorschlägen; automatische Antwortschreiben; Jahresendabrechnungen» |
| **Virtimo AG** (Берлин) | Софт для всех ролей (EIV, BTR, NB), «Ermittlung der Ausfallarbeit», connect+-коммуникация |
| **BTU EVU Rechenzentrum** (Дюссельдорф) | «Ermittlung der Ausfallarbeit zur Weiterverarbeitung im Rahmen der MaBiS-Prozesse» |
| **Solandeo GmbH** (Берлин) | «Solandeo Redispatchsystem — SaaS: Berechnung Ausfallarbeit, Berechnung netztechnischer Wirksamkeiten, Dokumentation» (см. некролог) |
| **easyEIV GmbH** | EIV+BTR **за 250 €/год за steuerbare Ressource** — ценовой якорь низа рынка; «insbesondere für Anlagenbetreiber ohne Direktvermarkter» |

Плюс весь слой директ-вермарктеров, которые до новеллы 2025 фактически вели Entschädigung за оператора: Quadra, GEWI, e2m (Energy2market), Interconnector/EnBW, Statkraft, Next Kraftwerke, NaturStromTrading, ANE GmbH & Co. KG (роли EIV/BTR/LF/BKV + Marktkommunikation EDIFACT/RAIDA для третьих лиц) и десятки стадтверке.

**node.energy** (Франкфурт): opti.node Cockpit + Erlösmonitoring — «Erfassung von Redispatch-Abregelungen und Entschädigungen; effiziente Prüfung von Abrechnungen der Direktvermarkter und Netzbetreiber». Клиенты: 5 000+ Betreibergesellschaften, 14 000+ установок, 43,5+ ГВт. Цен на сайте нет (бесплатная первичная консультация). Источники: https://www.node.energy/kaufmaennische-betriebsfuehrung/erloesmonitoring ; блог «Redispatch-Entschädigung 2026» (опубл. 11.03.2026, обновл. 25.08.2026) https://www.node.energy/blog/redispatch-entschaedigung ; pv magazine 06.03.2026 (цитируется CEO Matthias Karger, цифра «каждая десятая абрехнунг ошибочна») https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/ ; та же волна PR: Solarserver 05.03.2026, Windkraft-Journal 05.03.2026; вебинар-презентация node.energy на pv magazine: https://www.pv-magazine.de/wp-content/uploads/sites/4/2026/03/All-presentations_Node-Energy.pdf

### Сторона сети (Netzbetreiber) — названные в задании вендоры

- **connect+** — общая платформа сетевых операторов для обмена данными RD2.0 (RAIDA); инфраструктура, не биллинг оператора. Провайдеры из BDEW-листа подключают клиентов «к connect+».
- **Kisters AG** — полная RD2.0-платформа для NB: прогнозы, узкие места, Abrufe, **Ermittlung der Ausfallarbeit**, вплоть до абрехнунга; кооперация со Schleupen (абрехнунг/MaBiS в Schleupen.CS, событийный интерфейс передаёт abrechnungsrelevante Ausfallarbeit) — https://www.zfk.de/digitalisierung/redispatch-20-schleupen-und-kisters-kooperieren ; «20 новых клиентов разом» — миграция клиентов Wilken на платформу Kisters: https://www.kisters.eu/de/redispatch-2-0-20-neue-kunden-auf-einen-schlag/
- **Schleupen SE** — биллинг/MaBiS-звено в связке с Kisters (сторона NB).
- **Wilken** — биллинг-система NB; собственную RD2.0-платформу фактически уступил Kisters (см. некролог/консолидация).
- **Seven2one** — SaaS RD2.0 для сетевых операторов (пример: Netze Duisburg) — https://www.stadt-und-werk.de/k21-meldungen/redispatch-2-0-von-seven2one/ ; при этом числится и в BDEW-листе для операторов.
- **BTC AG** — RD2.0-решение (NABEG-комплаенс) https://www.btc-ag.com/Loesungen/fuer-die-Energiewirtschaft/Redispatch-2-0 + в BDEW-листе.
- **PSI** — в контексте «расчёт Ausfallarbeit для оператора» **не нашёл** (их фокус — сетевые лейтварты/TSO).
- **GreenPocket** — **не нашёл** ничего про Ausfallarbeit-абрехнунг (их профиль — визуализация энергоданных). Явная пометка: не нашёл.
- **Fichtner Digital / encore** — **не нашёл** специфического Ausfallarbeit-продукта (поиск давал только общие RD2.0-материалы). Явная пометка: не нашёл.
- **ane.energy** — «от Bilanzkreismanagement через Redispatch до REMIT/EMIR» (https://www.ane.energy/); в BDEW-листе как ANE GmbH & Co. KG (EIV/BTR/LF/BKV). Отдельного Ausfallarbeit-биллинг-продукта не заявляет.
- Ещё найдены: **RedispatchCortex** (energycortex, https://redispatch.energycortex.com/), **Energy Market Solutions**, **EES ENERKO** (redispatch.org, «Redispatch Solution» для операторов), **LEAG energy cubes**, **Robotron** (сторона NB).

## 2. Стартапы / нишевые игроки

- **easyEIV GmbH** (Випперфюрт) — микро-игрок, EIV+BTR за **250 €/год/SR**, целится в операторов без директ-вермарктера. Источники: BDEW-лист (12.03.2026); https://www.easy-eiv.de/
- **Cernion** (Дрезден?) — софт для стадтверке/поставщиков: автоматическая сверка парка установок (от 100 кВт) с MaStR, поиск дыр в штаммдатах, BDEW-конформные экспорты; контент-маркетинг прямо на боли «Ausfallarbeit-Falle: без корректных штаммдатов Ausfallarbeit не документируется» — https://cernion.de/insights/redispatch-ausfallarbeit-haftungsrisiko (дата статьи не установлена). Это смежная позиция (data-инфраструктура), не биллинг.
- **LUOX Energy** (бренд Lumenaza GmbH) — в BDEW-листе; ведёт SEO-статьи «Entschädigung bei Abregelung» — https://www.luox-energy.de/wissensartikel/entschaedigung-abregelung-redispatch
- **vantago, Multiversum, GODEA, AIRWIN, softenergy** — см. таблицу выше: это и есть «нишевые специалисты Ausfallarbeit», существующие с 2021–2022. Стадии/размер: частные GmbH, размеры не раскрыты (не нашёл выручку; допущение — единицы-десятки сотрудников).
- Поисковые запросы «Spitzabrechnung Dienstleister», «§13a EnWG Entschädigung berechnen» отдельных новых стартапов 2025–2026 не выявили — волну 2026 г. монетизирует прежде всего node.energy. Пометка: специализированный стартап «только счета Ausfallarbeit» (как аналог Flightright для рейсов) — **не нашёл**; ближайшее по духу — vantago и GODEA.

## 3. Clearingstelle EEG|KWKG — живость конфликта

- Общая статистика: **>22 000 обращений за 2007–2025, из них 3 256 в 2025**; главные темы 2025 — «Vergütung» и «Messung» (https://www.clearingstelle-eeg-kwkg.de/ — раздел Statistik).
- Специализированной статистики споров именно по Redispatch/Ausfallarbeit — **не нашёл**. Существенно: компенсация по §13a EnWG формально вне ядра компетенции EEG|KWKG-Clearingstelle; она публикует разъяснения (Aufsatz «Entschädigungsansprüche für Regelmaßnahmen des Netzbetreibers: Der finanzielle Ausgleich beim Redispatch 2.0» — https://www.clearingstelle-eeg-kwkg.de/aufsatz/6275 ; häufige Rechtsfrage Nr. 162 — https://www.clearingstelle-eeg-kwkg.de/haeufige-rechtsfrage/162), но споры по Ausfallarbeit идут в основном билатерально (процедура Gegenvorschlag в самом RD2.0-процессе) и через суды/BNetzA.
- Косвенная мера конфликта — цифра node.energy «~10% абрехнунгов ошибочны» (pv magazine, 06.03.2026; заинтересованный источник — допущение) и наличие у половины BDEW-провайдеров услуги «bilaterale Klärung bei Unstimmigkeiten mit dem NB» — т.е. споры настолько регулярны, что упакованы в стандартный оффер.

## 4. НЕКРОЛОГ (закрывшиеся/поглощённые с 2021)

- **Solandeo GmbH** (Берлин; «Solandeo Redispatchsystem» SaaS с Berechnung Ausfallarbeit; 45 сетевых операторов пользовались их RD2.0-решениями). **26.04.2024 — заявление о несостоятельности в Eigenverwaltung** (Amtsgericht Charlottenburg). Причина: «не смогла профинансировать запланированный рост в ужесточившейся среде финансирования» (капиталоёмкий Messstellenbetrieb, не redispatch как таковой). Исход: **июнь 2024 — поглощена инфраструктурным инвестором Ancala**, бизнес продолжается. Источники: pv magazine 06.05.2024 https://www.pv-magazine.de/2024/05/06/messstellenbetreiber-solandeo-ist-insolvent/ ; iwr.de https://www.iwr.de/ticker/neuer-investor-an-bord-ancala-uebernimmt-insolventen-messstellenbetreiber-solandeo-artikel6750 ; E&M https://www.energie-und-management.de/nachrichten/detail/strategischer-investor-uebernimmt-solandeo-224346
- **Wilken (RD2.0-платформа)** — тихая смерть продукта: **~20 клиентов Wilken мигрировали на платформу Kisters** («Redispatch 2.0: 20 neue Kunden auf einen Schlag», Kisters, дата публикации на странице не указана; по контексту 2023–2024) — https://www.kisters.eu/de/redispatch-2-0-20-neue-kunden-auf-einen-schlag/ Wilken осталась биллинг-звеном в связке. Это подтверждённый пример консолидации софта RD2.0.
- Прямых банкротств/закрытий EIV/BTR-сервисов для операторов (кроме Solandeo) — **не нашёл**, целевые запросы («Redispatch 2.0 Dienstleister Insolvenz/eingestellt/Übernahme») результата не дали. Допущение: мелкие провайдеры уходят без прессы; косвенный сигнал консолидации — сама BDEW-лista ужалась бы, но сравнение редакций (221117 vs 260312) по составу не проводил (старая редакция недоступна, 404).
- Смежный фон: волна банкротств директ-вермарктеров 2021–22 была связана с ценовым кризисом (не с RD2.0) — в некролог ниши не включаю.

## 5. Сторона сети: чем DSO проверяют входящие счета операторов

- Базовая механика RD2.0: **первичный расчёт Ausfallarbeit делает сам сетевой оператор** (его софт: Kisters, Schleupen.CS, Wilken, Seven2one, BTC, Robotron, решения через connect+), оператор установки может ответить Gegenvorschlag. С 2026 (после EnWG-новеллы) оператор выставляет счёт/получает Gutschrift напрямую — DSO сверяет со своим же расчётом в этих системах. Т.е. **«движок расчёта Ausfallarbeit» у DSO уже куплен и встроен**; pv magazine/Solarserver (03.2026) отмечают, что многие DSO ещё **не автоматизировали новый процесс прямых выплат** — окно для сервиса существует и на стороне сети (подтверждение слабой автоматизации: https://www.solarserver.de/2026/03/05/redispatch-abrechnung-anlagenbetreiber-ab-2026-in-der-verantwortung/).
- Отдельного продукта «проверка входящих счетов операторов для DSO» — **не нашёл**; функция живёт внутри существующих RD2.0/биллинг-платформ. Тезис «обе стороны в одних руках» уже реализован у **Kisters** (расчёт для NB + через партнёрства абрехнунг) и частично у **Virtimo** (софт «для всех ролей: EIV, BTR, NB»).

## 6. Крупные игроки в нише

- **DNV Energy Systems Germany GmbH** — в BDEW-листе: консалтинг по внедрению RD2.0 (выбор вендора, интеграция, QA, тренинг). Продукта «Ausfallarbeit-Gutachten» — не нашёл.
- **enervis** — политические гутахтены по redispatch (напр., для Green Planet Energy, energate) — не операционный расчёт Ausfallarbeit. **BET, Consentec** — целевой поиск «Gutachten Ausfallarbeit» ничего продуктового не дал (**не нашёл**). **TÜV, UL** — **не нашёл**.
- Вывод: крупные заходят как консультанты внедрения (DNV, BTC), а не как биллинг-сервис оператора. Единственный «крупный» на стороне оператора — сами энергоконцерны-директвермарктеры (EnBW/Interconnector, RWE S&T, Statkraft, ENGIE, E.ON) из BDEW-листа.

---

## Что это значит для гипотезы (резюме скептика)

1. Формулировка «специализированного вендора нет» ложна: node.energy + ≥8 профильных провайдеров BDEW-листа продают ровно этот продукт, часть — с 2021–2022 г.
2. Живой момент рынка реален: новелла EnWG 23.12.2025 переложила биллинг на операторов, DSO не готовы, ~10% расчётов с ошибками (по заинтересованной оценке node.energy) — но первым этот нарратив уже застолбил node.energy (PR-волна 05–06.03.2026 во всех отраслевых СМИ + вебинар pv magazine).
3. Экономика ниши скромна: весь пул выплат операторам ВИЭ ~433 млн €/2025; при комиссии сервиса 1–5% (допущение) — TAM сервиса десятки млн €, и он уже делится между DV, стадтверке и специалистами. Ценовой якорь снизу — easyEIV с 250 €/год за ресурс.
4. Если двигаться дальше — только с ответом «чем лучше node.energy и почему оператор уйдёт от своего директ-вермарктера/берайтера из BDEW-листа».

### Ключевые источники
- BDEW Dienstleisterliste für Anlagenbetreiber RD 2.0, 12.03.2026: https://www.bdew.de/media/documents/260312_Dienstleisterliste_Redispatch_2.0.pdf (и лендинг https://www.bdew.de/energie/anbieterliste-dienstleister-redispatch-20/)
- pv magazine, 06.03.2026: https://www.pv-magazine.de/2026/03/06/anlagenbetreiber-muessen-redispatch-entschaedigung-selbst-beim-netzbetreiber-einfordern/
- node.energy, блог 11.03.2026/25.08.2026: https://www.node.energy/blog/redispatch-entschaedigung ; продукт: https://www.node.energy/kaufmaennische-betriebsfuehrung/erloesmonitoring
- Solarserver, 05.03.2026: https://www.solarserver.de/2026/03/05/redispatch-abrechnung-anlagenbetreiber-ab-2026-in-der-verantwortung/
- Kisters↔Schleupen: https://www.zfk.de/digitalisierung/redispatch-20-schleupen-und-kisters-kooperieren ; Kisters↔Wilken-миграция: https://www.kisters.eu/de/redispatch-2-0-20-neue-kunden-auf-einen-schlag/
- Solandeo: https://www.pv-magazine.de/2024/05/06/messstellenbetreiber-solandeo-ist-insolvent/ ; https://www.energie-und-management.de/nachrichten/detail/strategischer-investor-uebernimmt-solandeo-224346
- BNetzA-цифры (через E&M, 2026): https://www.energie-und-management.de/nachrichten/energieerzeugung/detail/netzengpasskosten-2024-um-500-millionen-euro-gesunken-259018
- Clearingstelle EEG|KWKG: https://www.clearingstelle-eeg-kwkg.de/aufsatz/6275 ; https://www.clearingstelle-eeg-kwkg.de/haeufige-rechtsfrage/162
- BDEW-Leitfaden Berechnung der Ausfallarbeit (методология Pauschal/Spitz/SpitzLight): https://www.bdew.de/media/documents/Awh_2020-05_RD_2.0_LF_Ausfallarbeit.pdf
