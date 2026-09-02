# IC12-2 — «Enablement, оплачиваемый вендором/подрядчиком» в геодезии и путевой технике: проверка на опровержение

Дата исследования: 01.09.2026. Бюджет: 40 веб-запросов (использовано ~40 + 8 fetch). Скептическая рамка: цель — опровергнуть.

## 0. Вердикт (коротко)

**Утверждение опровергнуто в его сильной форме и подтверждено лишь в слабой.**

- **Вендорский enablement существует — но как внутренняя функция вендора/дилера, а не как открытый рынок для независимых.** Trimble делает это руками SITECH-дилеров (штатные Trimble Certified Trainers), Plasser & Theurer — собственным учебным центром в Линце (3 500 операторов за 10 лет), Matisa — «командой Matisa при поставке», Civ Robotics — своим field application engineer (1 день, включён в поставку). Прецедента, где вендор оборудования **платит независимой фирме** за вывод бригады клиента «на режим» в ж/д-геодезии, — **не нашёл** (ни в Европе, ни в MEA). Это «не нашёл», а не «не существует», но отсутствие следов при 40 запросах — само по себе сигнал: если такой рынок и есть, он непубличный, разовый, без прайсов.
- **Цены там, где они публичны, — низкие и коммодитизированные:** операторский курс по машинному контролю Leica/CITB — £235/день (1 день, группа до 8); независимый UK-тренер — £150+VAT/день; «полный ввод оператора GPS» — $3–5k включая простой; тренинг на тележку Amberg GRP — «через два дня бригады готовы». Дневная ставка топографа в Испании — ~€300/8ч. Это ценовой якорь, с которым придётся спорить.
- **Плательщик «у кого простаивает техника» — реальный, но он покупает не enablement, а готовый результат** (пред-измерение под шпалоподбивочную машину как услуга: немецкие Messtrupp'ы REIF Bau, GI-Consult; испанские субподрядчики-геодезисты на Comsa/Sacyr). Т.е. рынок «бригада как сервис» есть; рынок «мы за 3 дня выведем ВАШУ бригаду» — под вопросом, т.к. подрядчику проще купить бригаду, чем растить свою.
- **Что реально подтверждается:** дефицит геодезистов в Европе структурный и задокументирован (Испания: 69 выпускников/год против >1000 в 2012/13; Франция: индекс напряжённости 1,5, 17-е место среди самых дефицитных профессий; Германия: 6 из 10 вакансий не закрываются). Спрос в MEA растёт (LGV Кенитра–Марракеш 30% в мае 2026, Hafeet Rail в фазе укладки с июня 2026, Saudi Landbridge — контракт на 35 км «вот-вот»). Но **задокументированных проблем квалификации местных бригад / простоя путевых машин в MEA не нашёл** — это допущение, а не факт.
- **Масштабирование за пределы одного носителя:** методика 2–3-дневного ввода на тележку не уникальна (Amberg: 2 дня; Plasser ALC: 2 дня; Civ Robotics: 1 день). Уникален не метод, а **допуск** (репутация у Trimble + у подрядчика-заказчика). Репутация не масштабируется по train-the-trainer; масштабируются протокол допуска и бригады. Значит, масштабируемый бизнес — не «обучение», а **сертифицирующий поставщик бригад** (staffing + протокол), и это уже занятая, низкомаржинальная ниша (LVI Associates, Webuild Staffing — США; в Европе преимущественно inhouse у Tetra Tech/RPS).
- «8 выпускников в год на всю Испанию» — **не подтверждено**; свежая цифра — **69** (merca2 06.07.2026, que.es 05.07.2026, со ссылкой на COIGT/SEPE). Возможно, 8 — по одной конкретной школе; источника не нашёл.

Ниже — по пунктам с источниками.

---

## 1. Вендорский enablement: кто, платно/бесплатно, ставки

### Trimble / SITECH
- **Модель:** обучение и application support делегированы дилерской сети SITECH; тренеры — штатные «Trimble Certified Trainers» дилера. Публичных требований к программе Certified Trainer и формальных обязанностей дилера по application support — **не нашёл** (закрытая дилерская документация).
  - SITECH Rocky Mountain, «Certified Trimble Training» — https://sitechrockymtn.com/service-support/certified-training/ (просмотрено 01.09.2026)
  - SITECH Precision, «Service & Support»: «factory-trained and certified service technicians», «personalized training» — https://www.sitech-precision.com/service-support/
  - Trimble Learn (каталог курсов, digital credentials) — https://www.trimble.com/en/learn
- **Третьи стороны в обучении Trimble:** Koenig Solutions (IT-тренинги, «premier partner») — https://www.koenig-solutions.com/trimble-training-courses ; Duncan-Parnell (дилер): «trainers will travel to your office and/or jobsite» — https://www.duncan-parnell.com/training/training-options. Всё это — **программное/офисное обучение или дилеры**, не независимые полевые enablement-фирмы.
- **GEDO (Trimble Railway GmbH):** «системы распространяются через глобальную сеть дистрибьюторов»; страница «Where to buy» — форма «свяжем с местным дистрибьютором». Ни курсов, ни цен, ни длительности публично. — https://gedo.trimble.com/en/where-to-buy , https://gedo.trimble.com/en/about-us
  - Единственное упоминание обучения на GEDO у дилера: Precision Laser & Instrument (США) — «training has been performed on rental GEDO CE 2.0 trolleys on as-built sections of light rail» — https://www.laserinst.com/news/pliadamzweigtrimblegedoce2.0 (дата не указана)
  - Дистрибьюторы GEDO по регионам: UPG (Австралия) https://upgsolutions.com/rail-solutions/trimble-gedo-track-2-2/ ; Optron (ЮАР) https://optron.com/trimble/railways/gedo-systems/ ; AllTerra (Германия) https://allterra.de/anwendungen/rail/ ; KOREC (UK) https://www.korecgroup.com/product/trimble-gedo-gx50/. **Для Марокко/КСА/ОАЭ конкретного GEDO-дистрибьютора с тренинг-оффером не нашёл.**
- **Ставки:** Machine Control Engineer в SITECH Ireland — ~€60 000/год (вакансия, Caterpillar dealer jobs) — https://dealertechjobs.caterpillar.com/job/30391/machine_control_engineer ; Installation & Support Engineer (Machinetech, UK) — £38–50k — https://www.itjobswatch.co.uk/jv/Machinetech-Ltd/Installation-and-Support-Engineer-Job-Norwich-Norfolk-UK-4slmrj ; SITECH US почасово $25–28 (ZipRecruiter, 24.05.2026) — https://www.ziprecruiter.com/Jobs/Sitech. Freelance GPS machine control US — $24–60/час — https://www.ziprecruiter.com/Jobs/Freelance-Gps-Machine-Control. **Публичных €/день для application engineer в Европе — не нашёл.** Допущение: при €60k/год полная себестоимость дня ≈ €350–450, т.е. дилер продаёт день выезда в диапазоне €600–900 (допущение, не источник).

### Leica Geosystems (Hexagon)
- **Leica Training School (UK):** курс «3D Machine Control» — 7 часов, NOCN/CITB-аккредитация, max 8 человек, «at our dedicated training facility in Shropshire or at your venue» — https://leica-geosystems.com/en-gb/services-and-support/training/leica-training-school/nocn-machine-control-training
- **Цена через CITB National Construction College:** £235/день, 1 день, без VAT, для групп 8+ — https://www.citb.co.uk/national-construction-college/plant-operations-courses/leica-geosystems-3d-machine-control-for-operatives/ (цена — из сниппета поиска; на самой странице при fetch не отобразилась — **пометка: не перепроверено напрямую**)
- Трёхуровневая программа обучения Leica (Agg-Net) — https://www.agg-net.com/news/leica-geosystems-launch-new-three-tier-training-programme
- **Amberg (партнёр Leica, ж/д тележки GRP):** кейс — «after two days of training, field crews were ready to use the trolleys and the in-field software» (страница Amberg Group «Technology That Tracks» — при fetch 404, цитата из поискового сниппета; **не перепроверено**) — https://amberggroup.com/news-events/new/technology-that-tracks

### Topcon
- Курс «3D Machine Control for Machine Operators» (NOCN, с Flannery & Lynch) — 1 день — https://www.nocn.org.uk/products/assured-courses/courses/topcon-3d-machine-control-operator/ ; myTopcon eLearning; Topcon Solutions — 80+ онлайн-курсов. Цен не нашёл.
- Независимый UK-провайдер The Dozer Trainer: GPS machine control training — **£150+VAT/день** — https://thedozertrainer.co.uk/gps-practical-training/
- Оценка полного ввода оператора GPS: «$3 000–5 000 including trainer fees and lost productivity», 3–5 дней до уверенной работы, 2–4 недели до пиковой производительности — https://dirtmatch.com/blog/gps-machine-control-excavators-dozers (2026) — **это блог-оценка, не прайс**.

### Plasser & Theurer
- Собственный учебный центр: «approximately 3,500 machine operating employees have attended the Linz Training Centre in the last ten years» (Railway Gazette / Wikipedia) — https://en.wikipedia.org/wiki/Plasser_%26_Theurer
- Каталог курсов: ALC (SmartALC) — 2 дня; «Machine Technology – Basics» — 1 день; по типам машин — до 3 дней; языки DE/EN + переводчик; аудитория — операторы, сервис, системные техники. **Цен и условия «включено в поставку» страница не даёт.** — https://www.plassertheurer.com/en/fleet/training-and-support/training-at-plasser-theurer (fetch 01.09.2026)
- Симуляторы 09-3D (2011), Unimat 3D (2015) — https://www.plassertheurer.com/en/fleet/training-and-support/3d-simulation-tools
- Новый цех финальной сборки и ввода в эксплуатацию €60 млн в Линце, запуск нач. 2027 — https://www.railwaygazette.com/business/plasser-and-theurer-begins-construction-of-60m-assembly-and-commissioning-workshop/67377.article

### Matisa
- «When delivering tamping machines, a team from MATISA works with customers and partners on planning the arrival of the machine and training staff» (Rail Express, Австралия) — https://www.railexpress.com.au/tamping-their-authority/ ; Matisa UK: «operator training and technical assistance» — https://www.linkedin.com/company/matisa-uk-ltd

### Обучение как часть контракта поставки (кто платит — заказчик, внутри цены машины)
- MTR Hong Kong, контракт 1282: «design, manufacture, supply… commissioning… training, provision of spare parts, and provision of technicians for 4-year on-site technical support» — https://www.mtr.com.hk/en/corporate/tenders/TUE_1282.html
- Indian Railways: 27 машин HOTS-3X «along with training of Indian railway personnel» — https://railanalysis.in/rail-news/ircon-invites-tender-for-laying-and-linking-of-railway-tracks-over-south-east-central-railway/ (через сниппет)
- London Underground: контракт на техобслуживание шпалоподбивочных машин включает «operator training» — https://www.find-tender.service.gov.uk/Notice/083205-2025/PDF
- **Вывод:** обучение операторов путевых машин — стандартная строка в контракте поставки, исполняется вендором. Независимому туда встроиться можно только как **субподрядчику вендора** — прецедентов не нашёл.

### Комaтсу/Caterpillar (для сравнения — как вендор «продаёт» поддержку)
- Komatsu: «Komatsu-certified solution experts are on the phone, online or at your job site» — поддержка позиционируется как включённая — https://www.komatsu.com/en-us/technology/smart-construction/intelligent-machine-control ; число бесплатных дней не публикуется.

---

## 2. Прецеденты третьих сторон

### Независимые фирмы «ввод оператора/бригады»
- **Найдены только в machine control для земляных работ (UK):** Plantforce Digital — «leading independent supplier of GPS machine control systems in the UK», 23 года — https://plantforce.com/hire/explore-the-fleet/gps-machine-control/ ; Operator Skills Hub (Flannery) — https://www.operatorskillshub.com/gps-training/ ; The Dozer Trainer (£150+VAT/день); Kemp Engineering Survey — модели для машинного контроля — https://www.kempengineeringsurvey.co.uk/machine-control/. **Плательщик у всех — подрядчик (или CITB-грант), не вендор.**
- **В ж/д геодезии (GEDO/GRP) независимых тренинг-провайдеров не нашёл** ни в Европе, ни в MEA. Запросы: EN (UAE/Saudi/Qatar), FR (Maroc/Algérie), DE (Schulung Gleisvermessung). Результаты — только дистрибьюторы и **сервисные Messtrupp'ы**, которые продают само пред-измерение:
  - REIF Bauunternehmung (Германия): «Messtrupps… mit Zwei-Wagen-System GEDO CE 2.0… Jeder Messtrupp arbeitet selbstständig, von der Vorbereitung der Soll-Geometrien… bis Aufbereitung der Daten für die Stopfmaschinen» — https://reif-bau.de/gleismesswagen-trimble-gedo-ce/
  - GI-CONSULT (Германия), геодезическое пред-измерение — https://gi-consult.de/leistungen/vormessen/
  - Gexia Rail (Франция): «Trimble Gedo cart» в перечне инструментов — https://gexiafoncier.fr/gexia-rail/domaines-dinterventions-geometre-ferroviaire/
  - **Это и есть прямые конкуренты** гипотезы: они продают результат (протокол под машину), а не обучение.
- **Civ Robotics — модель «enablement включён в цену робота»:** «A field application engineer will visit your site and train your field team… takes one day», «only needs one person to operate» — https://www.civrobotics.com/faq. Это показывает, куда движется рынок: вендор **сжимает** enablement до 1 дня и делает его бесплатным дополнением.

### «Survey crew as a service» / staffing
- США: LVI Associates (contract surveyors, party chiefs) — https://www.lviassociates.com/en-us/request-talent/land-surveying-recruitment ; Webuild Staffing — https://www.webuildstaffing.com/employers/industry-specialization/land-surveying-staffing-services/. Масштаб (выручка) не публикуется.
- Европа: крупные inhouse-провайдеры Tetra Tech Europe, RPS — https://www.tetratecheurope.com/expertise/asset-management-compliance-and-surveying/geospatial-surveying/ , https://www.rpsgroup.com/services/design-and-development/surveying/geospatial/. Отдельного «survey crew staffing» рынка с цифрами в Европе — **не нашёл**.
- **Ценовой якорь Испания:** топограф — €300 за 8-часовой день, выезд от €200, офис ~€25/час (Cronoshare 2026) — https://www.cronoshare.com/cuanto-cuesta/contratar-topografo ; зарплаты €18–50k/год — https://global-geosystems.com/cuanto-cobra-un-topografo-en-espana/. Это низкая база; «высокоточная ж/д тележка» должна стоить кратно дороже, но публичных прайсов на GEDO-бригаду не нашёл.

---

## 3. Масштабирование методики (train-the-trainer, коммодитизация)

- **Дроны:** train-the-trainer 9 дней (Drone Tech Labs, Индия) — https://www.dronestechlabs.com/train-the-trainer-course-9273014.html ; Flapone TTT — https://www.flapone.com/faqs/instructor-pilot-training-ttt. Модель работает там, где есть **регуляторный сертификат** (лицензия пилота) — покупают сертификат, а не навык.
- **Machine control:** 1-дневные NOCN-курсы Leica/Topcon (см. п.1) — формат уже стандартизирован и передан в CITB/NOCN-систему. Это и есть коммодитизация: вендор отдаёт обучение в национальную схему с грантом.
- **Ж/д тележки:** 2 дня у Amberg (кейс), 2 дня у Plasser ALC. Т.е. «2–3 дня» — отраслевая норма, не ноу-хау.
- **Вывод:** передаваемый актив — не время обучения, а (а) протокол допуска (чек-лист приёмки бригады с измеримыми критериями), (б) признание протокола заказчиком/вендором. (а) копируется за неделю; (б) — не копируется, но и не масштабируется без бренда/схемы (аналог CPCS/NOCN). Реалистичный путь масштабирования — стать «схемой», а не «тренером»; для этого нужен якорный заказчик (Adif/ONCF/Etihad Rail), который впишет протокол в спецификацию. Прецедентов частной схемы допуска для ж/д геодезистов — **не нашёл**.

---

## 4. Рынок ж/д стройки MEA 2026

- **Марокко, LGV Кенитра–Марракеш (430 км, MAD 53 млрд ≈ $5,3 млрд):** 30% готовности в мае 2026, цель — сентябрь 2029 — https://www.moroccoworldnews.com/2026/05/309066/kenitra-marrakech-lgv-project-hits-30-progress-set-for-2029-delivery/ ; закуплено 2,5 млн т балласта, 800 тыс. т шпал, >100 тыс. т рельсов, 220 стрелок; укладка пути идёт на нескольких участках — https://www.moroccoworldnews.com/2026/04/288601/one-year-after-launch-what-has-oncf-delivered-on-its-high-speed-rail-program/ ; ~150 компаний, 2/3 национальные — https://fnh.ma/article/actualites-marocaines/lgv-kenitra-marrakech-avancement-chantier-oncf-maroc-2026. Подрядчики: SGTM ($200 млн, дек. 2024) — https://www.moroccoworldnews.com/2024/12/167259/… ; TGCC, Jet Contractors, CRCC 20, Shandong Hi-Speed — https://constructionreviewonline.com/moroccos-5bn-kenitra-marrakech-lgv-project-makes-headway-ahead-of-world-cup-2030-preparations/ ; GCF (Италия) — укладка пути — https://www.generalecostruzioniferroviarie.com/en/gcf-news/year-2025/391-gcf-at-high-speed-towards-marrakech ; PM-консорциум Egis/Systra/Novec — https://www.systra.com/en/news/new-contract-in-a-consortium-for-the-kenitra-marrakech-hsl-in-morocco/
  - **Проблемы квалификации местных бригад / простой путевых машин — не задокументированы** (запросы EN и FR). Единственное косвенное: «notable lack of topography specialists in Morocco given the major construction projects» (сайт учебного центра ODC Plus — маркетинговый текст, слабый источник) — https://www.odcplus.com/formation-topographie/
  - Comsa/Sacyr на LGV Марокко — **не нашёл**; Comsa заявляет присутствие в Марокко (пресс-служба) — http://prensa.comsa.com/en/… ; крупные контракты Comsa 2026 — Хорватия €350 млн, Мексика €168 млн.
- **Алжир, Béchar–Tindouf–Gara Djebilet (950 км):** построена ANESRIF+COSIDER+CRCC, открыта 1 февраля 2026, 1 026 км пути уложено — http://en.sasac.gov.cn/2026/03/03/c_20468.htm , https://uic.org/com/enews/article/algeria-inaugurates-the-new-bechar-tindouf-gara-djebilet-railway-line. **Укладка завершена — окно для enablement по этому проекту закрыто.** 2026 объявлен «годом больших строек» (TRT Français) — https://www.trtfrancais.com/article/ec95ecd816dc — новых контрактов на укладку с именами не нашёл.
- **Hafeet Rail (ОАЭ–Оман, 238 км, $2,5 млрд):** 40% в апреле 2026, фаза укладки пути с июня 2026 — https://www.omanobserver.om/article/1190769/business/economy/track-installation-commences-on-hafeet-rail-project , https://www.enr.com/articles/62894-25b-omanuae-hafeet-rail-enters-heavy-civil-phase-as-tunneling-bridgework-advance. Подрядчик укладки не назван.
- **КСА, Landbridge ($7 млрд, 1 500 км):** Riyadh section (35 км, двухпутка) — коммерческие предложения поданы 30.06.2026, награждение «imminently»; претенденты CCECC, CHEC, Saipem — https://guest.meed.com/contractors-submit-saudi-landbridge-riyadh-section-bids/ , https://constructionreviewonline.com/saudi-landbridge-riyadh-section-7bn-package-attracts-ccecc-chec-saipem-as-contract-award-nears/ ; TYPSA — lead design (апр. 2026) — https://www.meed.com/spanish-firm-wins-saudi-landbridge-design ; Sener — дизайн (Infobae 17.04.2026) — https://www.infobae.com/espana/2026/04/17/… . Укладка пути — **не раньше 2027–28** (допущение по фазе).
- **Вывод по MEA:** спрос есть, окно — Марокко (сейчас–2028) и Hafeet (2026–27). Но подтверждённой боли «бригады не умеют / машины стоят» нет; китайские подрядчики (CRCC, CCECC) традиционно везут свои бригады — допущение, что для них enablement местных не нужен.

---

## 5. Дефицит геодезистов в Европе

- **Испания:** 69 выпускников грado Ingeniería Geomática y Topografía за последний курс по всей стране против >1 000 в 2012/13; на конец 2025 — 2 безработных первого трудоустройства (SEPE); аффилиация в соцстрах через 4 года — 91%; стартовая зарплата ~€30k — merca2, 06.07.2026 — https://www.merca2.es/2026/07/06/grado-geomatica-pleno-empleo-oportunidad-2412041/ ; que.es, 05.07.2026 — https://www.que.es/2026/07/05/grado-geomatica-empleo-espana/ ; блог COIGT-среды (апр. 2025): «encontrar un candidato… de topógrafo de campo es complicado» — https://interesporlageomatica.com/2025/04/15/… **«8 в год» — не подтверждено.**
- **Франция:** géomètre-topographe — индекс напряжённости 1,5 в 2024, 17-е место среди самых дефицитных профессий; в 2026 «forte tension»; регионы — IdF, AURA, Nouvelle-Aquitaine — https://www.aboutir-emploi.fr/salaire-dun-geometre-en-2026-tendances-du-marche-et-metiers-porteurs/ ; Batiactu: «les géomètres-experts tirent la sonnette d'alarme» — https://www.batiactu.com/edito/emploi-manque-main-oeuvre-geometres-tirent-sonnette-62185.php
- **Германия:** «sechs von zehn Stellen in der Branche [Vermessung] nicht besetzt» — https://www.vermessung-schumann.de/hoeher-laenger-weiter-vermessungstechniker-ein-beruf-mit-perspektive/ (сайт бюро, вторичный); строительство/геодезия — 306 вакансий на 100 безработных — https://www.produktion.de/wirtschaft/arbeitsmarkt-fuer-ingenieure-unter-druck-fachkraefte-fehlen/2594810 ; VDV о переманивании госсектором — https://www.vdv-online.de/aktuelles/… . Цифр выпуска 2025 не нашёл.
- **США (для контекста):** BLS: 56 200 сюрвейеров (2010) → 47 770 (2020); Trimble + CSDS + Fresno State, 06.11.2025 — https://www.gpsworld.com/trimble-california-surveying-drafting-supply-partner-with-fresno-state-to-address-surveyor-shortage/ . Обратите внимание: **ответ Trimble на дефицит — спонсировать университет, а не покупать enablement у независимых.**
- **Ж/д (UK):** дефицит 2–3 тыс./год в E&P, S&T; до 90 тыс. уходов к 2030; <25 лет — 6,8% персонала — https://www.practicus.com/blog/rail-workforce-planning-in-an-industry-that-wont-sit-still , https://www.nsar.co.uk/2025/02/… . Про операторов шпалоподбивочных машин / простой техники — **отдельных данных не нашёл.**

---

## 6. Сделки-аналоги

- **Bowman Consulting (NASDAQ: BWMN)** — серийный покупатель survey-фирм: Smith & Associates Land Surveying (Лас-Вегас, осн. 2018) — ~$2,0 млн годового net service billing, cash + seller note, сумма не раскрыта, 04.05.2026 — https://investors.bowman.com/news-releases/news-release-details/bowman-acquires-nevada-based-smith-associates-land-surveying ; MTX Surveying — 60+ сотрудников, ~$9 млн billing, 2023 — https://www.businesswire.com/news/home/20230602005348/en/… ; всего 39 сделок (Tracxn) — https://tracxn.com/d/acquisitions/acquisitions-by-bowman/… . **Паттерн:** покупают выручку и людей (tuck-in), мультипликаторы не публикуются; типичные объекты — $2–10 млн billing.
- **Hexagon:** ITRES (гиперспектральная съёмка, июнь 2026) — https://hexagon.com/company/newsroom/press-releases/2026/hexagon-acquires-itres-… ; APEI (аэросъёмка, Франция, июнь 2025) — https://seekingalpha.com/news/4457496-… . **Покупают технологии/данные, не полевые бригады и не тренинг.**
- **Trimble:** Document Crunch (AI-контракты, апр. 2026), Flashtract, Ryvit — https://tracxn.com/d/acquisitions/acquisitions-by-trimble/… . **Ни одной покупки тренинг-провайдера или полевой survey-фирмы.**
- **Topcon:** вместо покупок — новое геоматическое подразделение (INTERGEO 2025) — https://www.geoweeknews.com/news/topcon-stakes-its-claim-in-geomatics
- **UK PE:** «PE-backed surveying and monitoring specialist expands with acquisition» (Insider Media, без сумм) — https://www.insidermedia.com/news/national/pe-backed-surveying-and-monitoring-specialist-expands-with-acquisition
- **Training & Simulation M&A (Capstone, июнь 2026):** сектор активен, но в high-tech симуляции, не в полевом обучении — https://www.capstonepartners.com/insights/article-training-and-simulation-sector-update/
- **Провалы:** конкретных кейсов краха независимых тренинг-провайдеров в строительстве 2025 — не нашёл; в реестре Companies House есть ликвидированные «Construction Training Specialists Ltd», «Construction Training Academy Ltd», «UK Construction Training Ltd» (даты не извлечены) — https://find-and-update.company-information.service.gov.uk/company/04943536/insolvency . UK-строительство: 3 931 инсолвенция в 2025 — https://bricks-bytes.com/corporate/uk-construction-insolvency-crisis-2025/ . **Вывод:** exit-путь для «тренинг-компании» не виден; exit-путь для «survey-фирмы с бригадами и выручкой» — виден (Bowman-модель), но это покупка выручки, не методики.

---

## 7. Civ Robotics: статус 2026, где остаётся человек

- Финансирование: Series A $7,5 млн (лид AlleyCorp, участие Bobcat, ff VC), всего $12,5 млн — ENR / Robot Report, июль 2025 — https://www.enr.com/articles/60976-automated-layout-startup-civ-robotics-secures-75m-series-a-funding-round , https://roboticsandautomationnews.com/2025/07/01/… . Новостей о раунде 2026 — не нашёл.
- Что автоматизировано: разметка точек (до 3 000/день), 8× быстрее, точность CivDot+ 8 мм, CivDot 30 мм; 20+ ГВт солнечных ферм, 6 млн координат — https://www.civrobotics.com/faq , https://www.civrobotics.com/robots/layout-robots/civdot . Партнёр Ferrovial (South Summit) — https://www.ferrovial.com/en/south-summit/civ-robotics/
- Что не автоматизировано: 1 оператор обязателен; своя базовая станция / NTRIP; уклон ≤30°; **ж/д, балласт, тележка на рельсах — не упоминаются ни в FAQ, ни в продуктах, ни в новостях** (запрос «Civ Robotics rail» — пусто). Это GNSS-разметка на грунте, точность 8 мм — на порядок хуже требований к геометрии ВСМ (доли мм по уровню/шаблону от тахеометра).
- Автономные тележки в ж/д: EU-проект AutoScan (инспекция дефектов, не геодезия) — https://cordis.europa.eu/article/id/250858-… ; Network Rail + Cranfield (Clearpath, инспекция) — https://www.robotics247.com/article/network_rail_cranfield_university_… ; академические INS-тележки — https://www.mdpi.com/1424-8220/18/2/538 . **Коммерческого автономного пред-измерения под шпалоподбивку без геодезиста — не нашёл.**
- GEDO GX50 (Trimble, лазерное сканирование габарита) — новая голова на ту же тележку, оператор нужен — https://www.railwaygazette.com/technology/rail-infrastructure-laser-scanning-system-launched/59613.article
- **Вывод:** человек остаётся в (а) привязке к опорной сети и тахеометру, (б) контроле качества и протоколе для машины, (в) допуске на путь. Окно 3–5 лет (допущение).

---

## 8. Что это значит для гипотезы (сухой остаток)

1. **«Плательщик — вендор оборудования»** — слабейшая часть. Все найденные вендоры делают enablement своими/дилерскими руками и либо включают его в цену, либо продают по £150–235/день. Единственная реалистичная форма — **субподряд у дистрибьютора Trimble в MEA** (дистрибьютор обязан обеспечить support, своих ж/д-кадров у него нет — допущение) или **со-маркетинг**: Trimble приводит вас как «референсную бригаду» при продаже GEDO. Это не рынок, это одна-две сделки в год.
2. **«Плательщик — подрядчик с простаивающей техникой»** — сильнее, но он покупает **результат** (протокол под машину), а не обучение своей бригады. Значит продукт — «бригада + протокол под ключ» с опцией «оставим вашу бригаду обученной». Конкуренты — Messtrupp-сервисы (REIF, GI-Consult, Gexia) и субподрядчики Comsa/Sacyr.
3. **Масштабирование** — через штат бригад и протокол допуска (staffing + QA), не через train-the-trainer. Это низкомаржинально, но продаваемо (Bowman-паттерн, $2–10 млн billing).
4. **Что проверить дальше (не веб, а руками):** (а) спросить у Trimble MEA прямо: «кто у вас сейчас вводит бригады клиентов на GEDO в Марокко/КСА и сколько это стоит?»; (б) у GCF/SGTM на LGV: простаивали ли машины из-за пред-измерения, сколько дней; (в) прайс любого Messtrupp-сервиса за км пред-измерения (Германия) как якорь.

---

## Реестр «не нашёл» (явно)
- Формальные требования Trimble Certified Trainer / обязанности SITECH по application support — нет в открытом доступе.
- Цена и длительность тренинга GEDO у Trimble Railway / дистрибьюторов — нет.
- €/день application engineer в Европе — нет (только годовые оклады €60k / £38–50k).
- Независимые провайдеры ввода бригад на ж/д тележки (EU, MEA) — нет.
- Дистрибьютор GEDO в Марокко/КСА с тренинг-оффером — нет.
- Документированный простой путевых машин / провал квалификации бригад на LGV Марокко, Hafeet, КСА — нет.
- Comsa/Sacyr на ж/д MEA 2026 — нет.
- «8 выпускников в год» (Испания) — нет; есть 69.
- Данные о выпуске геодезистов в Германии 2025 — нет.
- Покупки тренинг-провайдеров вендорами (Trimble/Hexagon/Topcon) — нет.
- Civ Robotics в ж/д — нет.
